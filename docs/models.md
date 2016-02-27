# 数据模型

```javascript
// 任务包
Package = {
  name: String,       // 包名
  version: String,    // 版本
  publishedAt: Date,  // 发布日期
  info: Object,       // task.json内容
  fileHash: String,   // 任务打包文件的Hash
  filePath: String,   // 任务代码路径
};

// 分组
Group = {
  name: String,       // 分组名称
  eanble: Boolean,    // 是否启用
  env: Object,        // 分组任务的默认环境变量
};

// 任务
Job = {
  package: String,    // 包名
  version: String,    // 版本
  group: String,      // 分组
  rule: String,       // 执行规则
  status: Object,     // 状态
};

// 执行结果
Result = {
  package: String,    // 包名
  version: String,    // 版本
  group: String,      // 分组
  startedAt: Date,    // 执行时间
  stoppedAt: Date,    // 结束时间
  data: Object,       // 结果
};
```
