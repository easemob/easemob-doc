# 删除离线推送模板

## 功能说明

删除离线推送模板。

## 调用频率上限

10 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/notification/template/{name}
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```bash
curl -X DELETE 'https://XXXX/XXXX/XXXX/notification/template/XXXX' \
-H 'Authorization: Bearer {YourAppToken}'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "uri": "https://XXXX/XXXX/XXXX/notification/template/XXXX",
  "timestamp": 1646989686393,
  "organization": "hx",
  "application": "17fe201b-XXXX-XXXX-XXXX-1ed1ebd7b227",
  "action": "delete",
  "data": {
    "name": "test7",
    "createAt": 1646989584124,
    "updateAt": 1646989584124,
    "title_pattern": "你好,{0}",
    "content_pattern": "推送测试,{0}"
  },
  "duration": 11,
  "applicationName": "XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含以下字段：

| 参数                   | 类型   | 描述                                           |
| :--------------------- | :----- | :--------------------------------------------- |
| `data`                 | JSON   | 删除的推送模板的相关信息。                     |
| `data.name`            | String | 推送模板的名称。                               |
| `data.createAt`        | Number | 推送模板的创建时间戳，单位为毫秒。             |
| `data.updateAt`        | Number | 最近一次修改模板时的 Unix 时间戳，单位为毫秒。 |
| `data.title_pattern`   | String | 推送模板的自定义标题。                         |
| `data.content_pattern` | String | 推送模板的自定义内容。                         |

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

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [常见错误码](push_error.html) 了解可能的原因。