# 创建离线推送模板

## 功能说明

创建离线推送消息模板，包括默认模板 **default**、**detail** 和自定义模板。你可以通过 [环信控制台](https://console.easemob.com/user/login) 创建推送模板，详见 [推送模板配置文档](/document/android/push/push_template.html#开通功能)。

若使用默认模板 **default** 和 **detail**，消息推送时自动使用默认模板，创建消息时无需传入模板名称。

## 调用频率上限

10 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/notification/template
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```bash
curl -X POST 'https://XXXX/XXXX/XXXX/notification/template' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "name": "test7",
    "title_pattern": "你好,{0}",
    "content_pattern": "推送测试,{0}"
}'
```

## 请求 header 参数

关于 `Content-Type` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数              | 类型   | 描述                                  | 是否必需 |
| :---------------- | :----- | :------------------------------------ | :------- |
| `name`            | String | 要添加的推送模板的名称。模板名称最多可包含 64 个字符，支持以下字符集：<br/>- 26 个小写英文字母 a-z；<br/>- 26 个大写英文字母 A-Z；<br/>- 10 个数字 0-9。              | 是       |
| `title_pattern`   | String | 自定义推送标题，例如： 标题 {0}。     | 是       |
| `content_pattern` | String | 自定义推送内容，例如：内容 {0}, {1}。 | 是       |

`title_pattern` 和 `content_pattern` 的设置方式如下：
- 输入固定的内容，例如，标题为 “您好”，内容为“您有一条新消息”。
- 内置参数填充：
  - `{$dynamicFrom}`：按优先级从高到底的顺序填充好友备注、[群昵称](push_template_send_message.html)和推送昵称。
  - `{$fromNickname}`：推送昵称。  
  - `{$msg}`：消息内容。
- 自定义参数填充：模板输入数组索引占位符，格式为: {0} {1} {2} ... {n}

 对于推送标题和内容来说，前两种设置方式在创建消息时无需传入该参数，服务器自动获取，第三种设置方式则需要通过扩展字段 `ext.em_push_template` 传入，JSON 结构如下：

  ```json
  {
      "ext":{
          "em_push_template":{
              "title_args":[
                  "环信"
              ],
              "content_args":[
                  "欢迎使用im-push",
                  "加油"
              ]
          }
      }
  }
  
  # title: {0} = "环信"
  # content: {0} = "欢迎使用im-push" {1} = "加油"
  ```

群昵称即群成员在群组中的昵称，群成员在发送群消息时通过扩展字段设置，JSON 结构如下：

```json
  {
    "ext":{
            "em_push_ext":{
                "group_user_nickname":"Jane"
            }
        }
  }      
```        

## 响应示例

```json
{
  "uri": "https://XXXX/XXXX/XXXX/notification/template",
  "timestamp": 1646989584108,
  "organization": "hx",
  "application": "17fe201b-XXXX-XXXX-XXXX-1ed1ebd7b227",
  "action": "post",
  "data": {
    "name": "test7",
    "createAt": 1646989584124,
    "updateAt": 1646989584124,
    "title_pattern": "你好,{0}",
    "content_pattern": "推送测试,{0}"
  },
  "duration": 26,
  "applicationName": "XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含以下字段：

| 参数                   | 类型   | 描述                                         |
| :--------------------- | :----- | :------------------------------------------- |
| `data`                 | JSON   | 推送模板的相关信息。                         |
| `data.name`            | String | 推送模板的名称。                             |
| `data.createAt`        | Number | 创建模板的 Unix 时间戳，单位为毫秒。         |
| `data.updateAt`        | Number | 最近一次修改模板的 Unix 时间戳，单位为毫秒。 |
| `data.title_pattern`   | String | 推送模板的自定义标题。                       |
| `data.content_pattern` | String | 推送模板的自定义内容。                       |

响应体中的其他参数说明如下表所示：

| 字段           | 类型   | 描述                        |
| :------------- | :----- | :---------------------- |
| `uri`             | String | 请求 URL。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `action`          | String | 请求方法。                                                                     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [常见错误码](push_error.html) 了解可能的原因。