---
title: 03-基于AOP拆分IN查询提高查询效率
date: 2025-1-6 18:32:22
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241026113946.png
tags:
- AOP
- 性能优化
categories: 
- 17_项目设计
- 03_场景设计
---

![AOP-API](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20241026113946.png)

## 背景

在项目中经常遇到IN查询，同时IN的参数太多甚至大几百上千，会导致SQL性能下降严重进而接口反应太慢。这个应该是前期没规划好，但是事已至此还是要对此进行优化。第一个就是想到通过多线程去查，比如原来是

```sql
SELECT * FROM device WHERE id IN (1, 2, 3, 4)
```

拆分为

```sql
SELECT * FROM device WHERE id IN (1, 2)
SELECT * FROM device WHERE id IN (3, 4)
```

并行执行，然后将返回结果合并。

因为用的地方多，每次都要写很麻烦，所以结合Spring AOP写了一个基于注解优化方案，只需要打上注解就可以提升性能了。实现效果以及具体实现逻辑如下：

```java
@SplitWorkAnnotation(setThreadPool = LIST_DEVICE_EXECUTOR, splitLimit = 20, splitGroupNum = 10)
public listDeviceDetail(Long projectId,@NeedSplitParam List<Long> deviceId){
	......
}
```

适用场景和不适用场景

主要适用大批量IN查询，或者某个参数特别大导致性能问题的同时结果能简单合并的，就是说符合以下公式的：

```java
fun(a,b,bigList) = fun(a,b,bigListPart1) + fun(a,b,bigListPart2)
```

这里的加可以是：合并运算，SUM，COUNT以及求TOPN（合并后再取TOPN）

不适用的典型场景有分页以及不符合上面公式的场景。

### **定义AOP注解**

需要定义的注解参数：

- **setThreadPool：** 线程池，可能阻塞比较大，不要用公共的线程池最好自己定义一个
- **handlerReturnClass：** 返回值回调函数，对应不同返回值处理逻辑：可能是合并可能取前十条可能求和
- **splitLimit：** 超过多少需要拆分
- **splitGroupNum：** 拆分时每组多少个

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface SplitWorkAnnotation {

    /**
     * 设置线程池
     *
     * @return {@link ThreadPoolEnum}
     */
    ThreadPoolEnum setThreadPool();

    /**
     * 返回值处理
     *
     * @return {@link Class}<{@link ?} {@link extends} {@link HandleReturn}>
     */
    Class<? extends HandleReturn> handlerReturnClass() default MergeFunction.class;

    /**
     * 超过多少开始拆分 >
     *
     * @return int
     */
    int splitLimit() default 1000;

    /**
     * 拆分后每组多少
     *
     * @return int
     */
    int splitGroupNum() default 100;
}
```

标记需要拆分参数的注解

> 加在需要拆分的参数上，只支持一个。因为两两组合情况非常复杂，也一般不符合实际使用情况。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface NeedSplitParam {

}
```

### **使用AOP实现拆分多线程并发调用合并逻辑**

```java
@Aspect
@Component
@Slf4j
public class SplitWorkAspect {

    /**
     * 切入点表达式，拦截方法上有@NeedSplitParaAnnotation注解的所有方法
     *
     * @return void
     */
    @Pointcut("@annotation(com.demo.SplitWorkAnnotation)")
    public void needSplit() {
    }

    /**
     * @param pjp
     * @return {@link Object}
     * @throws Throwable
     */
    @Around("needSplit()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        Signature signature = pjp.getSignature();
        MethodSignature methodSignature = (MethodSignature) signature;
        Method targetMethod = methodSignature.getMethod();
        SplitWorkAnnotation splitWorkAnnotation = targetMethod.getAnnotation(SplitWorkAnnotation.class);
        Object[] args = pjp.getArgs();

        int splitLimit = splitWorkAnnotation.splitLimit();
        int splitGroupNum = splitWorkAnnotation.splitGroupNum();
        if (args == null || args.length == 0 || splitLimit <= splitGroupNum) {
            return pjp.proceed();
        }

        int needSplitParamIndex = -1;
        for (int i = 0; i < targetMethod.getParameters().length; i++) {
            Parameter parameter = targetMethod.getParameters()[i];
            NeedSplitParam needSplitParam = parameter.getAnnotation(NeedSplitParam.class);
            if (needSplitParam != null) {
                needSplitParamIndex = i;
                break;
            }
        }

        if (needSplitParamIndex == -1) {
            return pjp.proceed();
        }
        Object needSplitParam = args[needSplitParamIndex];


        //只能处理Object[] 和 Collection
        if (!(needSplitParam instanceof Object[]) && !(needSplitParam instanceof List) && !(needSplitParam instanceof Set)) {
            return pjp.proceed();
        }
        //如果目标参数长度小于拆分下限跳过
        boolean notMeetSplitLen = (needSplitParam instanceof Object[] && ((Object[]) needSplitParam).length <= splitLimit)
                || (needSplitParam instanceof List && ((List) needSplitParam).size() <= splitLimit)
                || (needSplitParam instanceof Set && ((Set) needSplitParam).size() <= splitLimit);
        if (notMeetSplitLen) {
            return pjp.proceed();
        }

        // 去重，这一步看情况也可以不要
        if (needSplitParam instanceof List) {
            List<?> list = (List<?>) needSplitParam;
            if (list.size() > 1) {
                needSplitParam = new ArrayList<>(new HashSet<>(list));
            }
        }
        //算出拆分成几批次
        int batchNum = getBatchNum(needSplitParam, splitGroupNum);
        if (batchNum == 1) {
            return pjp.proceed();
        }
        CompletableFuture<?>[] futures = new CompletableFuture[batchNum];
        ThreadPoolEnum threadPool = splitWorkAnnotation.setThreadPool();
        if (threadPool == null) {
            return pjp.proceed();
        }

        try {
            for (int currentBatch = 0; currentBatch < batchNum; currentBatch++) {
                int finalNeedSplitParamIndex = needSplitParamIndex;
                int finalCurrentBatch = currentBatch;
                Object finalNeedSplitParam = needSplitParam;
                futures[currentBatch] = CompletableFuture.supplyAsync(() -> {
                    Object[] dest = new Object[args.length];
                    //这一步很重要！！！因为多线程运行不能用原理的参数列表了，不然会导致混乱
                    System.arraycopy(args, 0, dest, 0, args.length);
                    try {
                        //将其他参数保持不变，将需要拆分的参数替换为part参数
                        dest[finalNeedSplitParamIndex] = getPartParam(finalNeedSplitParam, splitGroupNum, finalCurrentBatch);
                        return pjp.proceed(dest);
                    } catch (Throwable e) {
                        throw new RuntimeException(e);
                    }
                }, threadPool.getThreadPoolExecutor());
            }
            CompletableFuture<Void> all = CompletableFuture.allOf(futures);
            all.get();
            Class<? extends HandleReturn> handleReturn = splitWorkAnnotation.handlerReturnClass();

            List<Object> resultList = new ArrayList<>(futures.length);
            for (CompletableFuture<?> future : futures) {
                resultList.add(future.get());
            }
            //获取到每个part的结果然后调用处理函数
            return handleReturn.getDeclaredMethods()[0].invoke(handleReturn.getDeclaredConstructor().newInstance(), resultList);
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 获取批次数目
     *
     * @param needSplitParam1
     * @param splitGroupNum
     * @return {@link Integer}
     */
    public Integer getBatchNum(Object needSplitParam1, Integer splitGroupNum) {
        if (needSplitParam1 instanceof Object[]) {
            Object[] splitParam = (Object[]) needSplitParam1;
            return splitParam.length % splitGroupNum == 0 ? splitParam.length / splitGroupNum : splitParam.length / splitGroupNum + 1;
        } else if (needSplitParam1 instanceof Collection) {
            Collection<?> splitParam = (Collection<?>) needSplitParam1;
            return splitParam.size() % splitGroupNum == 0 ? splitParam.size() / splitGroupNum : splitParam.size() / splitGroupNum + 1;
        } else {
            return 1;
        }
    }

    /**
     * 获取当前批次参数
     *
     * @param needSplitParam
     * @param splitGroupNum
     * @param batch
     * @return {@link Object}
     * @throws NoSuchMethodException
     * @throws InvocationTargetException
     * @throws InstantiationException
     * @throws IllegalAccessException
     */
    public Object getPartParam(Object needSplitParam, Integer splitGroupNum, Integer batch) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        if (needSplitParam instanceof Object[]) {
            Object[] splitParam = (Object[]) needSplitParam;
            int end = Math.min((batch + 1) * splitGroupNum, splitParam.length);
            return Arrays.copyOfRange(splitParam, batch * splitGroupNum, end);
        } else if (needSplitParam instanceof List) {
            List<?> splitParam = (List<?>) needSplitParam;
            int end = Math.min((batch + 1) * splitGroupNum, splitParam.size());
            return splitParam.subList(batch * splitGroupNum, end);
        } else if (needSplitParam instanceof Set) {
            List splitParam = new ArrayList<>((Set) needSplitParam);
            int end = Math.min((batch + 1) * splitGroupNum, splitParam.size());
            //参数具体化了
            Set<?> set = (Set<?>) needSplitParam.getClass().getDeclaredConstructor().newInstance();
            set.addAll(splitParam.subList(batch * splitGroupNum, end));
            return set;
        } else {
            return null;
        }
    }
}
```

### **定义处理返回值的接口**

```java
/**
 * 处理返回结果接口
 **/
public interface HandleReturn {

    /**
     * 处理返回结果方法
     *
     * @param t 拆分后多次请求结果
     * @return R 处理后的返回结果
     */
    Object handleReturn(List t);
}
```

实现了一个简单合并的

```java
/**
 * 集合List等合并策略
 **/
public class MergeFunction implements HandleReturn {

    @Override
    public Object handleReturn(List results) {
        if (results == null) {
            return null;
        }
        if (results.size() <= 1) {
            //todo
            return results.get(0);
        }
        //这里自己要知道具体返回类型
        List first = (List) results.get(0);
        for (int i = 1; i < results.size(); i++) {
            first.addAll((List) results.get(i));
        }
        return first;
    }
}
```

