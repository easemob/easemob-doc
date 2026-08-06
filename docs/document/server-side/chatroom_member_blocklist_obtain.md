# 查询聊天室黑名单

## 功能说明

获取指定聊天室的黑名单。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users
```

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users'   \
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "get",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "uri": "http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users",
  "entities": [],
  "data": [
    "user2",
    "user3"
  ],
  "timestamp": 1543466293681,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "XXXX",
  "count": 2
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应体中的 `data` 字段如下所示：

| 参数 | 类型   | 描述     |
| :------ | :----- | :--------- |
| `data`  | Array | 聊天组黑名单中的用户 ID。   |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `count` | Int | 聊天组黑名单中的用户数量。 |
