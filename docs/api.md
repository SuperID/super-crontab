# API接口

所有请求均需要提交以下基本参数：

参数名称      | 类型    | 说明
------------:|-------:|-----------
access_token | string | 授权码，用于识别当前客户端的身份

所有结果均使用JSON格式返回

-------

## 列出所有分组

**GET /api/groups**

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
match        | string | *           | v1.*.daily  | 仅仅匹配包含指定规则的名称

返回格式：

```
{
  status: "OK",
  result: {
    count: 10,
    groups: [
      {
        name: "default", // 分组名称
        jobs: {
          count: 100,   // 任务总数量
          running: 10,  // 正在执行的任务
          stopped: 90   // 已经停止的任务
        }
      }
    ]
  }
}
```

-------

## 列出所有任务

**GET /api/jobs**

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
group        | stirng | default     | v1          | 分组名称
match        | string | *           | v1.*.daily  | 仅仅匹配包含指定规则的名称

返回格式：

```jabascript
{
  status: "OK",
  result: {
    count: 10,
    jobs: [
      {
        name: "名称",
        version: "版本",
        description: "简介"
      },
      // ...
    ]
  }
}
```

## 查询指定任务的基本信息

**GET /api/job/:name**

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
group        | stirng | default     | v1          | 分组名称
version      | string | latest      | 0.0.1       | 指定版本号，latest表示最后一个版本

返回格式：

```jabascript
{
  status: "OK",
  result: {
    job: {
      name: "名称",
      version: "版本",
      description: "简介",
      // ...包含task,json上的所有属性
      allVersions: [ // 所有历史版本
        "0.0.1", "0.0.2", "0.0.3" // ...
      ],
      result: {} // 任务最后一次执行的结果
    }
  }
}
```

## 查询指定任务的项目打包文件

**GET /api/job/:name/package**

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
group        | stirng | default     | v1          | 分组名称
version      | string | latest      | 0.0.1       | 指定版本号，latest表示最后一个版本

返回格式：

```jabascript
{
  status: "OK",
  result: {
    package: {
      sha1: "文件的SHA1签名",
      size: 1234, // 文件尺寸，Byte
      file: "文件下载地址"
    }
  }
}
```

## 发布项目

**POST /api/job/:name/publish**

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
group        | stirng | default     | v1          | 分组名称
sha1         | string | 必填         | 无          | 文件的SHA1签名
package      | file   | 必填         | 无          | .tar.gz 格式
force        | string | false       | true        | 当指定版本存在时，是否强制覆盖

返回格式：

```jabascript
{
  status: "OK",
  result: {
    package: {
      sha1: "文件的SHA1签名",
      size: 1234, // 文件尺寸，Byte
      file: "文件下载地址"
    }
  }
}
```

## 删除项目

**POST /api/job/:name/remove**

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
group        | stirng | default     | v1          | 分组名称
data         | string | false       | true        | 是否删除历史数据

返回格式：

```jabascript
{
  status: "OK",
  result: {}
}
```

## 启用项目

**POST /api/job/:name/enable**

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
group        | stirng | default     | v1          | 分组名称

返回格式：

```jabascript
{
  status: "OK",
  result: {
    name: "名称",
    version: "版本"
  }
}
```

## 停用项目

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
group        | stirng | default     | v1          | 分组名称

**POST /api/job/:name/disable**

返回格式：

```jabascript
{
  status: "OK",
  result: {
    name: "名称",
    version: "版本"
  }
}
```

## 立即执行项目

**POST /api/job/:name/run**

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
group        | stirng | default     | v1          | 分组名称

返回格式：

```jabascript
{
  status: "OK",
  result: {
    name: "名称",
    version: "版本"
  }
}
```

## 强制停止正在执行的任务

**POST /api/job/:name/stop**

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
group        | stirng | default     | v1          | 分组名称

返回格式：

```javascript
{
  status: "OK",
  result: {
    name: "名称",
    version: "版本"
  }
}
```

## 订阅任务日志

**GET /api/job/:name/logs**

参数名称      | 类型    | 默认值       | 示例                 |说明
------------:|-------:|------------:|---------------------:|-------------
group        | stirng | default     | v1                   | 分组名称
filter       | string | *           | stdout,stderr,status | 要订阅地日志类型

日志类型：

+ **stdout** - 任务执行时的stdout输出
+ **stderr** - 任务执行时的stderr输出
+ **status** - 任务状态变更通知，比如start,stop,publish,delpoy,error等
+ **result** - 任务执行结果

返回格式：

```jabascript
// 保持连接不断开，每次输出一行JSON格式的数据

// stdout和stderr
{time: "2016-02-19 14:20:00", type: "stdout", data: "这里是输出的内容"}

// status
{time: "2016-02-19 14:20:30", type: "status", data: {command: "publish", "version: "0.0.1"}}

// result
{time: "2016-02-19 14:25:13", type: "result", data: {ok: true}}
```

## 查询任务历史日志

**GET /api/job/:name/history_logs**

参数名称      | 类型    | 默认值               | 示例                 |说明
------------:|-------:|--------------------:|---------------------:|-------------
group        | stirng | default             | v1                   | 分组名称
filter       | string | *                   | stdout,stderr,status | 要订阅地日志类型
before       | string | 2099-12-31 14:28:49 | 2016-02-19 14:28:49  | 筛选在此之前的时间
after        | string | 1970-1-1 0:00:00    | 2016-02-19 14:28:49  | 筛选在此之后的时间

返回格式与**/job/:name/logs**相同

## 查询任务执行结果

**GET /api/job/:name/results**

参数名称      | 类型    | 默认值               | 示例                 |说明
------------:|-------:|--------------------:|---------------------:|-------------
group        | stirng | default             | v1                   | 分组名称
before       | string | 2099-12-31 14:28:49 | 2016-02-19 14:28:49  | 筛选在此之前的时间
after        | string | 1970-1-1 0:00:00    | 2016-02-19 14:28:49  | 筛选在此之后的时间
offset       | number | 0                   | 100                  | 跳过指定数量的结果
limit        | number | 10                  | 100                  | 返回指定数量的结果

返回格式：

```javascript
{
  status: "OK",
  result: {
    results: [
      {time: "2016-02-19 14:25:13", type: "result", data: {ok: true}},
      {time: "2016-02-19 14:25:13", type: "result", data: {ok: true}},
      // ...
    ]
  }
}
```

说明：此处返回结果的数据内容与**GET /api/job/:name/history_logs?filter=result**返回的一致

-------

## 查询在线Work

**GET /api/workers**

参数名称      | 类型    | 默认值       | 示例         |说明
------------:|-------:|------------:|------------:|-------------
group        | stirng | default     | v1          | 分组名称
match        | string | *           | v1.*.daily  | 仅仅匹配包含指定规则的名称

返回格式：

```jabascript
{
  status: "OK",
  result: {
    count: 10,
    workers: [
      {
        name: "名称",
        ip: "来源IP",
        port: "来源端口"
      },
      // ...
    ]
  }
}
```

