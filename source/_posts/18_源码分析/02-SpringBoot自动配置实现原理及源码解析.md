---
title: 02-SpringBoot自动配置实现原理及源码解析
date: 2020-11-01 15:05:15
tags:
- 源码分析
- Spring
- SpringBoot
categories: 
- 18_源码分析
---


>约定优于配置，这是SpringBoot中的一个很重要特性，此特性让可以在几秒中之内完成一个项目的搭建，无需任何配置。

## 为什么要自动配置

1. 手动配置很麻烦且容易出问题 
2. 构建一个一样的项目耗时长且复杂

## Overview

概括来说，就是借助@Import的支持，**收集和注册特定场景相关的bean定义来进行自动配置** 

eg:

- `@EnableAutoConfiguration` 是通过@Import将**`Spring自动配置`**相关的bean定义都加载到`IoC容器`，对应组件为：**AutoConfigurationImportSelector** 
- `@EnableScheduling` 是通过@Import将**`Spring调度框架`**相关的bean定义都加载到`IoC容器`，对应的组件为：**SchedulingConfiguration**
- `@EnableMBeanExport` 是通过@Import将**`JMX`**相关的bean定义加载到`IoC容器`，对应的组件为：**MBeanExportConfiguration**

## 自动配置基本流程


![image-20230527104745586](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527104746.png)

加载示意图，关键的是SpringFactoryLoader类： 

![20201101195330642](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527104833.png)

## 源码解析

在构建SpringBoot项目的时候，启动类是这样的

```java
@SpringBootApplication
public class SpringDemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(SpringDemoApplication.class, args);
	}
}
```

其中@SpringBootApplication注解是关键所在，接下来来看看为什么，进入到这个注解中

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration // 继承了@Configuration，表示当前是注解类
@EnableAutoConfiguration // 开启springboot的注解功能，springboot的四大神器之一，其借助@import的帮助
// 扫描路径设置
@ComponentScan(excludeFilters = {
    @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
	...
}
```

可以发现@SpringBootApplication注解其实是对`@SpringBootConfiguration、@EnableAutoConfiguration、@ComponentScan`三个注解的封装，也就是它们之间具有相互替代性。关注@EnableAutoConfiguration这个注解 @EnableAutoConfiguration主要是标记需要导入哪些配置，这个就是一个key（factoryType），之后依据key获取spring.facteries文件中的配置信息。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
// 自动配置包
@AutoConfigurationPackage
// 导入自动配置的组件
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
	...
}
```

有两个需要注意的地方，那就是@AutoConfigurationPackage、@Import(AutoConfigurationImportSelector.class)，先来看下@AutoConfigurationPackage

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
// 导入组件AutoConfigurationPackages.Registrar
@Import(AutoConfigurationPackages.Registrar.class)
public @interface AutoConfigurationPackage {
	...
}
```

进入到组件AutoConfigurationPackages.Registrar

```java
static class Registrar implements ImportBeanDefinitionRegistrar, DeterminableImports {
		@Override
		public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
			// 注册当前主程序的同级以及子集的包组件，其实就是注册了一个Bean的定义
			register(registry, new PackageImports(metadata).getPackageNames().toArray(new String[0]));
		}

		@Override
		public Set<Object> determineImports(AnnotationMetadata metadata) {
			return Collections.singleton(new PackageImports(metadata));
		}

	}
```

这个地方可能比较难以理解，主要有几个步骤：

1. 获取注解的类，这里是SpringDemoApplication 
2. 获取同级的package以及子package 
3. 扫描这些package，并将组件导入到spring管理的容器中，之后可以被用作spring.factories配置文件的key

接下来看下@Import(AutoConfigurationImportSelector.class)，通过Spring底层注解@Import，给容器导入一个组件，这个组件就是AutoConfigurationImportSelector.class，它实现了DeferredImportSelector，关键方法是selectImports()，来具体看看它的实现

```java
/**
	 * 获取需要导入的全限定类名数组
	 *
	 * @param annotationMetadata
	 * @return
	 */
	@Override
	public String[] selectImports(AnnotationMetadata annotationMetadata) {
   
		// 配置参数 spring.boot.enableautoconfiguration 是否打开，默认开启
		if (!isEnabled(annotationMetadata)) {
			return NO_IMPORTS;
		}
		// 获取自动配置对象，对象包含需要配置的全限定类名列表和需要排除的列表
		AutoConfigurationEntry autoConfigurationEntry = getAutoConfigurationEntry(annotationMetadata);
		return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
	}

	/**
	 * spring.boot.enableautoconfiguration 是否打开，默认处于打开状态
	 *
	 * @param metadata
	 * @return
	 */
	protected boolean isEnabled(AnnotationMetadata metadata) {
		if (getClass() == AutoConfigurationImportSelector.class) {
			return getEnvironment().getProperty(EnableAutoConfiguration.ENABLED_OVERRIDE_PROPERTY, Boolean.class, true);
		}
		return true;
	}
```

通过getAutoConfigurationEntry方法来获取的配置

```java
/**
	 * 基于annotationMetadata发现标有{@link Configuration @Configuration}的配置类并返回{@link AutoConfigurationEntry}
	 *
	 * @param annotationMetadata 配置类的注解元数据
	 * @return 应该被导入的自动配置
	 */
	protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {
		if (!isEnabled(annotationMetadata)) {
			return EMPTY_ENTRY;
		}
		AnnotationAttributes attributes = getAttributes(annotationMetadata);
		// 获取需要自动配置的类名集合
		List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
		// 去重
		configurations = removeDuplicates(configurations);
		// 获取需要排除的列表
		Set<String> exclusions = getExclusions(annotationMetadata, attributes);
		checkExcludedClasses(configurations, exclusions);
		// 移除需要排除的数据
		configurations.removeAll(exclusions);
		// 获取配置过滤器
		configurations = getConfigurationClassFilter().filter(configurations);
		// 触发导入自动配置事件
		fireAutoConfigurationImportEvents(configurations, exclusions);
		// 返回自动配置对象
		return new AutoConfigurationEntry(configurations, exclusions);
	}
```

获取原始的配置集合方法是getCandidateConfigurations

```java
/**
	 * 返回需要自动配置的类名列表
	 *
	 * @param metadata   the source metadata
	 * @param attributes the {@link #getAttributes(AnnotationMetadata) annotation
	 *                   attributes}
	 * @return a list of candidate configurations
	 */
	protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
   
		// 获取需要被加载的FactoryClass，也就是key
		Class<?> clazz = getSpringFactoriesLoaderFactoryClass();
		// 获取需要配置的全限定类名集合
		List<String> configurations = SpringFactoriesLoader.loadFactoryNames(clazz, getBeanClassLoader());
		Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you "
				+ "are using a custom packaging, make sure that file is correct.");
		return configurations;
	}
	
	/**
	 * 获取需要加载的工厂类
	 * 也就是key为org.springframework.boot.autoconfigure.EnableAutoConfiguration的配置都需要被加载到IoC
	 *
	 * @return the factory class
	 */
	protected Class<?> getSpringFactoriesLoaderFactoryClass() {
		return EnableAutoConfiguration.class;
	}
```

SpringFactoriesLoader类属于Spring框架私有的一种扩展方案，其主要功能就是从指定的配置文件 META-INF/spring.factories加载配置，来加载到需要自动配置的类的全限定名列表，接下来到Spring框架中去看下SpringFactoriesLoader.loadFactoryNames()静态方法。

```java
/**
	 * 使用给定的类加载器，从META-INF/spring.factories中加载给定的工厂类型实现
	 * 在spring5.3中，如果给定的工厂类型下的实现类名发现不止一次，会进行去重处理
	 *
	 * @param factoryType factoryType，eg:org.springframework.beans.BeanInfoFactory=xxx
	 * @param classLoader 用于加载资源的类加载器
	 *                    {@code null} to use the default
	 * @throws IllegalArgumentException if an error occurs while loading factory names
	 * @see #loadFactories
	 */
	public static List<String> loadFactoryNames(Class<?> factoryType, @Nullable ClassLoader classLoader) {
		ClassLoader classLoaderToUse = classLoader;
		if (classLoaderToUse == null) {
			classLoaderToUse = SpringFactoriesLoader.class.getClassLoader();
		}
		String factoryTypeName = factoryType.getName();
		// 加载Factories文件
		return loadSpringFactories(classLoaderToUse).getOrDefault(factoryTypeName, Collections.emptyList());
	}
```

关键方法在loadSpringFactories：

```java
/**
	 * 加载Factories文件
	 *
	 * @param classLoader factories文件解析之后的map
	 * @return
	 */
	private static Map<String, List<String>> loadSpringFactories(ClassLoader classLoader) {
		// 现在缓存中查找，classLoader为key
		Map<String, List<String>> result = cache.get(classLoader);
		if (result != null) {
   
			return result;
		}

		result = new HashMap<>();
		try {
			// 获取资源，这里固定目录为：META-INF/spring.factories
			Enumeration<URL> urls = classLoader.getResources(FACTORIES_RESOURCE_LOCATION);
			while (urls.hasMoreElements()) {
   
				URL url = urls.nextElement();
				UrlResource resource = new UrlResource(url);
				// 将资源加载为Properties
				Properties properties = PropertiesLoaderUtils.loadProperties(resource);
				// 遍历配置
				for (Map.Entry<?, ?> entry : properties.entrySet()) {
   
					String factoryTypeName = ((String) entry.getKey()).trim();
					// 获取value的数组，一般为类的全限定名
					// 比如 org.springframework.beans.BeanInfoFactory=org.springframework.beans.ExtendedBeanInfoFactory
					String[] factoryImplementationNames =
							StringUtils.commaDelimitedListToStringArray((String) entry.getValue());
					// 添加到result
					for (String factoryImplementationName : factoryImplementationNames) {
   
						result.computeIfAbsent(factoryTypeName, key -> new ArrayList<>())
								.add(factoryImplementationName.trim());
					}
				}
			}

			// 对value进行去重
			result.replaceAll((factoryType, implementations) -> implementations.stream().distinct()
					.collect(Collectors.collectingAndThen(Collectors.toList(), Collections::unmodifiableList)));
			// 添加到缓存中
			cache.put(classLoader, result);
		} catch (IOException ex) {
   
			throw new IllegalArgumentException("Unable to load factories from location [" +
					FACTORIES_RESOURCE_LOCATION + "]", ex);
		}
		return result;
	}
```

获取配置集合，主要流程如下：

1. 先在cache缓存中找，如果有则直接返回配置集合结果 
2. 在cache缓存中没有找到，依据classLoader.getResources(“META-INF/spring.factories”)获取文件 
3. 解析出文件的key、value保存到集合中 
4. 然后将结果保存到缓存cache中 
5. 返回结果，格式为Map&lt;String, List&gt;，其中key为factoriesType（比如org.springframework.boot.autoconfigure.EnableAutoConfiguration），value为配置的value

```java
# key
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
# value
com.autoconfig.ExampleAutoConfiguration,\
com.autoconfig.ExampleAutoConfiguration2,\
```

## 总结

配合@EnablAutoConfiguration使用的话，它主要是提供一种`配置查找`的功能，即根据@EnablAutoConfiguration的完整类名`org.springframework.boot.autoconfigure.EnableAutoConfiguration`作为查找的Key,获取对应的一组@Configuration类。 所以，@EnableAutoConfiguration大致的自动配置过程为：

1. 从classpath中搜寻所有的META-INF/spring.factories配置文件 
2. 获取所有key为`org.springframework.boot.autoconfigure.EnableautoConfiguration`的配置项（也可能是Enablexxx） 
3. 通过反射来实例化对应标有@Configuration注解的JavaConfig形式的IoC容器配置类，然后统一汇总到IoC容器中


![image-20230527105305269](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20230527105306.png)

