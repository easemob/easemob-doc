# 查询群组白名单

## 功能说明

查询群组白名单中的用户列表。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/white/users
```

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  是       | 群组 ID。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups/{groupid}/white/users'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "get",
  "application": "XXXX",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/12XXXX53/white/users",
  "entities": [],
  "data": [
    "wzy_test", 
    "wzy_vivo", 
    "wzy_huawei", 
    "wzy_xiaomi", 
    "wzXXXXzu"
    ],
  "timestamp": 1594724947117,
  "duration": 3,
  "organization": "XXXX",
  "applicationName": "XXXX",
  "count": 5
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下：

| 字段   | 类型  | 描述                         |
| :----- | :---- | :--------------------------- |
| `data` | Array | 群组白名单中的用户 ID 列表。 |

其他字段的说明如下：

| 字段          | 类型 | 描述                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。    |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `count`           | Int | 群组白名单中的用户数量。   |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。