# 查询聊天室详情

## 功能说明

查询一个或多个聊天室的详情。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |

关于请求 URL 中的其他参数的说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatrooms/662XXXX13' \ 
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "data": {
    "id": "662XXXX13",
    "name": "testchatroom1",
    "description": "test",
    "membersonly": false,
    "allowinvites": false,
    "maxusers": 200,
    "owner": "user1",
    "created": 1542542951527,
    "custom": "",
    "affiliations_count": 2,
    "affiliations": [
      {
        "member": "user2"
      },
      {
        "owner": "user1"
      }
    ],
    "public": true,
    "mute": false
  }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应体中的 `data` 参数说明如下表所示：

| 字段                      | 类型   | 描述      |
| :------------------------ | :----- | :----------------- |
| `data`               | JSON | 实际获取的数据详情。    |
| - `id`                 | String | 聊天室 ID，聊天室唯一标识符，由环信即时通讯 IM 服务器生成。    |
| - `name`               | String | 聊天室名称。    |
| - `description`        | String | 聊天室描述。    |
| - `membersonly`        | Bool   | 加入聊天室是否需要聊天室所有者或者聊天室管理员审批：<br/> - `true`：是。<br/> - `false`：否。    |
| - `allowinvites`       | Bool   | 是否允许聊天室成员邀请其他用户加入该聊天室：<br/> - `true`：允许聊天室成员邀请他人加入该聊天室。<br/> - `false`：仅聊天室所有者和管理员可邀请他人加入该聊天室。 |
| - `maxusers`           | Int    | 聊天室成员数上限，创建聊天室时设置。                                                                                                                            |
| - `owner`              | String | 聊天室所有者的用户 ID。例如：{"owner": "user1"}。                                                                                                               |
| - `created`            | Long   | 创建聊天室时间，Unix 时间戳，单位为毫秒。                                                                                                                       |
| - `custom`             | String | 聊天室扩展信息。 |
| - `affiliations_count` | Int    | 现有聊天室成员总数。 |
| - `affiliations`       | Array  | 现有聊天室成员列表，包含聊天室所有者和成员（包括聊天室管理员）。例如："affiliations":[{"owner": "user1"},{"member":"user2"},{"member":"user3"}]。服务器不对成员排序，因此，返回的成员列表不保证有序。|
| - `public`             | Bool   | 预留字段，无需关注。 |
| - `mute` | Bool | 是否为全员禁言状态：<br/> - `true`：是<br/> - `false`：否。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | do not find this group:XX | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。