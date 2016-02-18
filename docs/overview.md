# 概览

## 任务项目

通过项目根目录的`task.json`文件指定：

```javascript
{
  "name": "daily.newUserCount",
  "version": "1.2.1701",
  "description": "统计每日新增用户数量",
  "scripts": {
    "start": "node app.js",
    "delpoy": "任务首次部署到服务器时执行"
  },
  "schedules": [
    "* 5 * * * * *",   // 支持cron语法，可以有多个执行时机
    "* 10 * * * * *"
  ],
  "env": {
    "APP_VERSION": "v1" // 环境变量
  }
}
```

## 服务器

### 配置

```javascript
module.exports = function (config) {
  // config是一个Namespace实例，参考lei-ns模块

  // 配置指定分组的环境变量
  config.set('group.test.env.APP_VERSION', 'test');

}
```

### 授权

worker 和 cli-tool 在连接到到服务器时均需要验证身份。使用授权字符串来识别，授权字符串在管理后台生成。

+ cli-tool 授权主要用于限制可将代码提交到哪个分组
+ worker 授权主要用于限制外部非法连接

## 命令行工具

### 登录服务器

```bash
$ super-crontab autn <在服务器端生成的授权码>
```

### 提交任务

```bash
# 在任务项目根目录下执行
$ super-crontab submit
```

以下为可选参数：

+ `--logs` - 提交完成后不退出程序，继续监控当前任务的执行日志输出
+ `--run-now` - 提交完成后马上执行一次当前任务
+ `--group <name>` - 将当前任务提交到指定分组（如果没有指定，默认为`default`）

### 查看任务日志（stdout和stderr）

```bash
# 在任务项目根目录下执行
$ super-crontab logs
```

### 马上执行一次任务

```bash
# 在任务项目根目录下执行
$ super-crontab run
```

### 马上在本地执行一次任务（开发阶段）

```bash
# 在任务项目根目录下执行
$ super-crontab run-local
```

### 停止任务

```bash
# 在任务项目根目录下执行
$ super-crontab stop
```

### 恢复任务

```bash
# 在任务项目根目录下执行
$ super-crontab start
```

## Worker节点

### 启动

```bash
$ super-crontab-worker start --server <host>:<port> --auth <授权字符串>
```

以下为可选参数：

+ `--group <name>` - 指定worker所属的分组，默认`default`
+ `--max-jobs <num>` - 最大同时执行作业数，默认不限制
+ `--path <dir>` - 任务临时数据存储目录，默认`~/.super-crontab/tmp`
