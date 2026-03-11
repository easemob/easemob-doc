# 接收方配置模板名称

## 功能说明

接收方可以调用该 API 设置推送模板。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/users/{userId}/notification/template
```

| 参数       | 类型   | 描述          | 是否必需 |
| :--------- | :----- | :--------------------------------- | :------- |
| `userId` | String | 当前用户的用户 ID。    | 是       | 

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X PUT 'https://XXXX/XXXX/XXXX/users/XXXX/notification/template' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourUserToken>' \
-d '{    
  "templateName": "hxtest"
 }
```

## 请求 header 参数

关于 `Content-Type` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数       | 类型   | 是否必需 | 描述          |
| :--------- | :----- | :------- | :------------ |
| `templateName` | String | 是   | 模板名称。| 

## 响应示例

```json
{
    "path": "/users",
    "uri": "http://XXX/XXX/XXX/users/XXX/notification/template",
    "timestamp": 1705470003984,
    "organization": "XXX",
    "application": "cc7380d5-XXXX-XXXX-a93e-51d6d590b475",
    "action": "put",
    "data": {
        "templateName": "hxtest"
    },
    "duration": 43,
    "applicationName": "XXX"
}
```


## 响应 body 字段

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中 `data` 字段说明如下：

| 参数           | 类型   | 描述           |
| :------------- | :----- | :------------- |
| `data`         | JSON   | 响应数据。     |
| `data.templateName` | String | 模板名称。     |

响应体中的其他参数说明如下表所示：

| 字段           | 类型   | 描述                        |
| :------------- | :----- | :---------------------- |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
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