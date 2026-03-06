---
title: 09-DeepSeek提效：画图&生成sql&生成java代码
date: 2025-03-03 21:02:43
index_img: https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250206172444.png
tags:
- 第三方
- OpenAI
- Deepseek
categories: 
- 13_第三方
- 01_OpenAI
---



参考资料：

* 在线阅读（来自清华大学第二版）：[DeepSeek如何赋能职场应用-36页.pdf](http://jy-imgs.oss-cn-beijing.aliyuncs.com/pdf/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6%E7%AC%AC%E4%BA%8C%E7%89%88%E3%80%8ADeepSeek%E5%A6%82%E4%BD%95%E8%B5%8B%E8%83%BD%E8%81%8C%E5%9C%BA%E5%BA%94%E7%94%A8%E3%80%8B.pdf)
* 可用的免费满血DeepSeek大模型（2025-03）：[官网](https://chat.deepseek.com/)、[360的纳米AI](https://bot.n.cn/)、[腾讯元宝](https://yuanbao.tencent.com/)、[秘塔AI](https://metaso.cn/)



## 1. DeepSeek 模型特点

* 基础模型（V3）：“过程-结果”清晰（指令）
* 深度思考（R1）：目标清晰，结果可以模糊（推理）

【联网搜索】可以根据实时查询到的网络数据进行进一步分析总结结果或推理目标。——`必选`

![image-20250227144533533](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250227144534.png)

> PS：绝大部分场景下，V3 就够用（即无需勾选深度思考-R1模型）。
>
> 目前通过网页或APP会话进行代码生成，等价于手动驾驶（优先要会的）。
>
> 通过Cursor或以后诞生的更强大的全自动项目代码生成工具，等价于全自动驾驶（可能会很快）。

## 2. 画图

### 2.1 流程图

![image-20250227100655118](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250227100657.png)



### 2.2 甘特图

![image-20250227100737783](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250227100738.png)



### 2.3 海报

![image-20250227100919668](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250227100921.png)



`即梦AI`：

![image-20250227100935051](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250227100936.png)



### 2.4 视频

![image-20250227101149178](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250227101153.png)



## 3. 生成sql

#### 3.1 表设计

prompt-给字段：

> 设计一张MySQL 5.7中的高考分数表，输出建表语句，包括学号，姓名，总分（包括小数点后一位），记录写入时间和更新时间，有单自增主键，不要外键约束。

参考结果：

```sql
CREATE TABLE gaokao_score (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增主键',
    student_id VARCHAR(18) NOT NULL COMMENT '学号(18位数字)',
    student_name VARCHAR(30) NOT NULL COMMENT '学生姓名',
    total_score DECIMAL(5,1) NOT NULL COMMENT '总分(格式999.9)',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录写入时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

prompt-给方向：

> 根据微博的评论系统进行设计一张基于数据库MySQL 5.7的表，不要外键约束，输出建表sql语句。

参考结果：

```sql
CREATE TABLE comment_metadata (
    comment_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论ID(实际高并发业务建议使用雪花算法生成)',
    post_id BIGINT UNSIGNED NOT NULL COMMENT '微博ID',
    user_id BIGINT UNSIGNED NOT NULL COMMENT '评论用户ID',
    parent_id BIGINT UNSIGNED DEFAULT 0 COMMENT '父评论ID(0表示根评论)',
    root_id BIGINT UNSIGNED DEFAULT 0 COMMENT '根评论ID(用于构建评论树)',
    content TEXT NOT NULL COMMENT '评论内容(加密存储)',
    like_count INT UNSIGNED DEFAULT 0 COMMENT '点赞数(异步更新)',
    reply_count INT UNSIGNED DEFAULT 0 COMMENT '回复数(异步更新)',
    status TINYINT UNSIGNED DEFAULT 1 COMMENT '状态(0-删除 1-正常 2-审核中)',
    create_time DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间(精确到毫秒)',
    update_time DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) COMMENT '更新时间',
    is_hot TINYINT(1) GENERATED ALWAYS AS (like_count > 1000) VIRTUAL COMMENT '是否热评',
    PRIMARY KEY (comment_id),
    KEY idx_post_ctime (post_id, create_time) USING BTREE,
    KEY idx_user_post (user_id, post_id) USING BTREE,
    KEY idx_parent (parent_id) USING BTREE,
    KEY idx_root (root_id) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```



#### 3.2 写测试数据

> 表结构如下：
>
> ```sql
> CREATE TABLE student_score (
>    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
>    name VARCHAR(50) NOT NULL,
>    score DECIMAL(5,1) NOT NULL,
>    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
>    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
> );
> ```
>
> 往上面的表写入5条测试数据，放在一条SQL语句中，总分750，分数500到700之间，给到具体分数。
参考结果：

```sql
INSERT INTO student_score (name, score) VALUES 
('李明', 652.5),
('王芳', 587.0), 
('张伟', 703.9),
('赵静', 521.5),
('陈涛', 685.1);
```

```sql
SELECT SUM(score) AS total, AVG(score) AS average FROM student_score;
/* 输出示例(因RAND函数动态值会有浮动)：
total   | average 
3149.0  | 629.8 
*/
```



#### 3.3 SQL语句生成

> 表结构如下：
>
> ```sql
> CREATE TABLE student_score (
>    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
>    name VARCHAR(50) NOT NULL,
>    score DECIMAL(5,1) NOT NULL,
>    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
>    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
> );
> ```
>
> 查询分数大于600的学生姓名。

参考结果：

```sql
-- 基础查询语句 
SELECT name FROM student_score 
WHERE score > 600.0 
ORDER BY score DESC;
```



#### 3.4 写脚本

> ip.txt中，每一行存放MySQL的IP地址、用户名和密码，形式如下，请编写一个shell脚本，查看每个数据库当前的活跃连接数。
>
> ```txt
> 192.168.12.161,read_only,xxxxxx
> 192.168.12.162,read_only,xxxxxx
> ```

参考结果：

```bash
#!/bin/bash 
# MySQL活跃连接数检查脚本 
# 执行时间：2025-02-27 10:38:00 
 
log_file="connection_$(date +%Y%m%d%H%M%S).log"
 
echo "========== 数据库连接检查报告 ==========" | tee -a $log_file 
printf "%-18s %-8s %-8s\n" "IP地址" "连接数" "状态" | tee -a $log_file 
 
while IFS= read -r line || [[ -n "$line" ]]; do 
    # 安全解析输入行（兼容含特殊字符密码）
    eval $(awk '{print "ip="$1"; user="$2"; pwd="$3}' <<< "$line")
    
    # 获取连接数（设置5秒超时）
    conn_count=$(mysql -h$ip -u$user -p$pwd --connect-timeout=5 -sNe \
        "SHOW GLOBAL STATUS LIKE 'Threads_connected';" 2>/dev/null | awk '{print $2}')
    
    # 结果状态判断 
    if [[ $conn_count =~ ^[0-9]+$ ]]; then 
        status="\033[32m正常\033[0m"
    else 
        conn_count="N/A"
        status="\033[31m失败\033[0m"
    fi 
    
    # 格式化输出（兼容中文环境）
    printf "%-18s %-8s %b\n" $ip ${conn_count} $status | tee -a $log_file 
done < ip.txt  
 
echo -e "\n检查完成，日志已保存至：$log_file"
```



#### 3.5 充当SQL考官

> 接下来，你来帮我练习一下MySQL的SQL语句，每次给我出一道题，让我写出SQL语句，我回答告诉我正确还是错误，如果错误，告诉我正确答案，然后再出一道新的。

参考结果：

```
📝 第1题：基础查询
场景：某学校数据库中有 students 表，包含以下字段：

id INT（学生ID）
name VARCHAR(50)（姓名）
class VARCHAR(20)（班级）
score DECIMAL(5,1)（分数）
问题：查询 班级为「高三（2）班」且分数大于80分 的学生姓名和分数，按分数降序排列。

请写出你的SQL语句（无需分号）：

✅ 用户回复后，我将提供：

正确性判断与错误分析
参考答案（含索引优化建议）
下一题（难度递增）
请开始作答！
```



> select name, score from students
> where class = "高三（2）班"
> and score > 80
> order by score desc

```
✅ 回答正确性验证
您的SQL语句：
SELECT name, score FROM students  
WHERE class = "高三（2）班"  
AND score > 80  
ORDER BY score DESC  
判定结果：

语法正确，但存在 2项优化建议

🛠 改进建议与深度分析
字符串引号规范
	问题：MySQL官方推荐使用单引号(')包裹字符串，双引号可能导致某些配置下解析异常
	修正：WHERE class = '高三（2）班'
索引优化策略
	现状：全表扫描效率低（假设数据量超过10万行）
	优化方案：添加复合索引加速查询
```



#### 3.6 创建用户和赋权

> MySQL 5.7，创建一个用户，用户名是rw_user，host是%，权限是对所有库都有增删查改四个权限，帮我写成SQL语句。

参考结果：

```sql
-- 第一步：创建用户（需root权限）  
CREATE USER 'rw_user'@'%' IDENTIFIED BY 'StrongPassword123!';  
 
-- 第二步：授予增删查改权限  
GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO 'rw_user'@'%';  
 
-- 第三步：刷新权限  
FLUSH PRIVILEGES;  
```



#### 3.7 用户权限回收

> MySQL 5.7，回收用户rw_user@'%' 对所有库的delete权限。

参考结果：

```sql
-- 撤销DELETE权限（需SUPER权限）  
REVOKE DELETE ON *.* FROM 'rw_user'@'%';  
 
-- 刷新权限缓存  
FLUSH PRIVILEGES;  
```



#### 3.8 构造权限查询语句

> MySQL 5.7，为每个用户构造一条show grants for 'user_name'@'host' 的语句。

参考结果：

```sql
SELECT CONCAT('SHOW GRANTS FOR \'', User, '\'@\'', Host, '\';') AS grant_query  
FROM mysql.user   
WHERE User NOT IN ('mysql.sys','mysql.session','mysql.infoschema')   
ORDER BY User, Host;  
```



## 4. 生成代码

![image-20250227140356717](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250227140358.png)

![image-20250227140419499](https://jy-imgs.oss-cn-beijing.aliyuncs.com/img/20250227140421.png)

> 你是一位资深的全栈工程师，来根据我的产品需求构建我所需要的前端（vue）或后端（java）代码实例，需要真实可运行，没有任何bug和缺陷。接下来我会给你需求，你只需要按照我的需求生成页面代码或接口逻辑代码。

参考结果：

```
我准备好根据您的需求生成可运行的代码。请提供以下信息以帮助我更精准地实现您的需求：

功能场景（例如：用户登录页面/商品管理接口/数据可视化面板等）
技术栈偏好（例如：Vue3组合式API/Spring Boot 3.x/Element Plus等）
核心交互逻辑（例如：表单验证规则/接口鉴权方式/数据关联关系等）
特殊要求（例如：第三方API集成/WebSocket实时通信/性能优化指标等）
您可以通过这样的模板提交需求：

需求类型：[前端页面/后端接口] 功能描述：需要实现一个带有实时搜索功能的用户列表页面 技术要求：

Vue3 + TypeScript
使用Element Plus表格组件
防抖搜索请求
分页加载数据
接口错误全局捕获 预期交互：用户输入搜索词500ms后自动触发请求，分页器与搜索条件联动
我将根据您提供的详细需求，生成以下完整交付物：

组件/接口完整代码（含注释）
相关配置文件示例（vue-router/axios/spring security等）
单元测试代码示例
部署运行指南
性能优化建议
```

追问：

> 生成一个名叫互动答疑的页面代码和java接口代码，该页面的功能与微博的评论功能基本一致，具体功能包含用户可以点击提问按钮，弹窗填写提问的内容和上传图片；其他用户可以对该用户的提问内容进行回复、点赞、分享等操作；该页面最多支持2级的问答展示。

```html
<template>
  <div class="interaction-container">
    <!-- 提问按钮 -->
    <el-button type="primary" @click="showQuestionDialog">发起提问</el-button>
 
    <!-- 提问弹窗 -->
    <el-dialog v-model="dialogVisible" title="发起提问" width="600px">
      <el-form :model="questionForm" :rules="rules" ref="formRef">
        <el-form-item label="问题内容" prop="content">
          <el-input 
            v-model="questionForm.content" 
            type="textarea"
            :rows="4"
            placeholder="请输入您的问题（最多500字）"
            maxlength="500"
            show-word-limit 
          />
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload 
            action="/api/upload"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :file-list="fileList"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitQuestion">提交</el-button>
      </template>
    </el-dialog>
 
    <!-- 问答列表 -->
    <div class="qa-list">
      <div v-for="question in questionList" :key="question.id"  class="qa-item">
        <!-- 主问题 -->
        <div class="main-question">
          <div class="content">{{ question.content  }}</div>
          <div class="media" v-if="question.images"> 
            <img 
              v-for="(img, index) in question.images"  
              :key="index"
              :src="img"
              class="question-image"
            />
          </div>
          <div class="actions">
            <el-button text @click="showReplyDialog(question.id,  'question')">
              <el-icon><Comment /></el-icon> {{ question.replyCount  }}
            </el-button>
            <el-button text @click="handleLike(question.id,  'question')">
              <el-icon><Goods /></el-icon> {{ question.likeCount  }}
            </el-button>
            <el-button text @click="handleShare(question)">
              <el-icon><Share /></el-icon>
            </el-button>
          </div>
        </div>
 
        <!-- 二级回复 -->
        <div class="sub-replies" v-if="question.replies"> 
          <div v-for="reply in question.replies"  :key="reply.id"  class="reply-item">
            <div class="content">{{ reply.content  }}</div>
            <div class="actions">
              <el-button text @click="showReplyDialog(reply.id,  'reply')">回复</el-button>
              <el-button text @click="handleLike(reply.id,  'reply')">
                <el-icon><Goods /></el-icon> {{ reply.likeCount  }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
 
    <!-- 回复弹窗 -->
    <ReplyDialog 
      v-model="replyVisible"
      :targetId="currentTargetId"
      :type="replyType"
      @submit-success="handleReplySuccess"
    />
  </div>
</template>
 
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ReplyDialog from './ReplyDialog.vue' 
 
// 问题数据结构 
interface Question {
  id: number 
  content: string 
  images: string[]
  likeCount: number 
  replyCount: number 
  replies: Reply[]
}
 
interface Reply {
  id: number 
  content: string 
  likeCount: number 
}
 
// 组件逻辑 
const dialogVisible = ref(false)
const replyVisible = ref(false)
const currentTargetId = ref<number>()
const replyType = ref<'question' | 'reply'>('question')
 
const questionForm = reactive({
  content: '',
  images: [] as string[]
})
 
const questionList = ref<Question[]>([])
 
const rules = {
  content: [
    { required: true, message: '请输入问题内容', trigger: 'blur' },
    { max: 500, message: '长度不超过500个字符', trigger: 'blur' }
  ]
}
 
// 加载问题列表 
const loadQuestions = async () => {
  try {
    const res = await axios.get('/api/questions') 
    questionList.value  = res.data.data  
  } catch (err) {
    ElMessage.error(' 加载失败')
  }
}
 
// 提交问题 
const submitQuestion = async () => {
  try {
    await axios.post('/api/questions',  questionForm)
    dialogVisible.value  = false 
    loadQuestions()
  } catch (err) {
    ElMessage.error(' 提交失败')
  }
}
 
// 点赞处理 
const handleLike = async (targetId: number, type: 'question' | 'reply') => {
  try {
    await axios.post(`/api/like/${type}/${targetId}`) 
    loadQuestions()
  } catch (err) {
    ElMessage.error(' 操作失败')
  }
}
 
onMounted(() => {
  loadQuestions()
})
</script>
 
<style scoped>
.interaction-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
 
.qa-item {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}
 
.sub-replies {
  margin-left: 40px;
  border-left: 2px solid #eee;
  padding-left: 20px;
}
 
.question-image {
  max-width: 200px;
  margin: 10px;
}
</style>
```

```java
// QuestionController.java  
@RestController 
@RequestMapping("/api/questions")
public class QuestionController {
 
    @Autowired 
    private QuestionService questionService;
 
    @PostMapping 
    public ResultVO<Long> createQuestion(@RequestBody QuestionCreateDTO dto) {
        return ResultVO.success(questionService.createQuestion(dto)); 
    }
 
    @GetMapping 
    public ResultVO<List<QuestionVO>> getQuestions() {
        return ResultVO.success(questionService.getQuestions()); 
    }
}
 
// ReplyController.java  
@RestController 
@RequestMapping("/api/replies")
public class ReplyController {
 
    @Autowired 
    private ReplyService replyService;
 
    @PostMapping 
    public ResultVO<Long> createReply(@RequestBody ReplyCreateDTO dto) {
        return ResultVO.success(replyService.createReply(dto)); 
    }
}
 
// LikeController.java  
@RestController 
@RequestMapping("/api/like")
public class LikeController {
 
    @Autowired 
    private LikeService likeService;
 
    @PostMapping("/{type}/{targetId}")
    public ResultVO<Void> like(
        @PathVariable String type,
        @PathVariable Long targetId 
    ) {
        likeService.handleLike(type,  targetId);
        return ResultVO.success(); 
    }
}
 
// QuestionService.java  
@Service 
public class QuestionService {
 
    @Autowired 
    private QuestionMapper questionMapper;
 
    @Transactional 
    public Long createQuestion(QuestionCreateDTO dto) {
        Question question = new Question();
        BeanUtils.copyProperties(dto,  question);
        question.setCreateTime(new  Date());
        questionMapper.insert(question); 
        return question.getId(); 
    }
 
    public List<QuestionVO> getQuestions() {
        List<Question> questions = questionMapper.selectListWithReplies(); 
        return questions.stream().map(q  -> {
            QuestionVO vo = new QuestionVO();
            BeanUtils.copyProperties(q,  vo);
            vo.setReplies(replyService.getReplies(q.getId(),  2));
            return vo;
        }).collect(Collectors.toList()); 
    }
}
 
// 数据库实体 
public class Question {
    private Long id;
    private String content;
    private String images; // JSON存储图片路径 
    private Integer likeCount;
    private Integer replyCount;
    private Date createTime;
}
 
public class Reply {
    private Long id;
    private Long questionId;
    private Long parentId;
    private String content;
    private Integer likeCount;
    private Date createTime;
}
 
// MyBatis Mapper 
public interface QuestionMapper {
    @Select("SELECT * FROM question ORDER BY create_time DESC")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "replies", column = "id",
                many = @Many(select = "getRepliesByQuestionId"))
    })
    List<Question> selectListWithReplies();
 
    @Select("SELECT * FROM reply WHERE question_id = #{questionId} AND level <= 2")
    List<Reply> getRepliesByQuestionId(Long questionId);
}
```

