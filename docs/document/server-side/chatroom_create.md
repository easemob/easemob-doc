# 创建聊天室

## 功能说明

- 创建一个聊天室。
- **仅聊天室超级管理员具有在客户端创建聊天室的权限。**
- 支持设置聊天室名称、聊天室描述、聊天室成员最大人数（包括管理员）、聊天室管理员和普通成员以及聊天室扩展信息。
- 创建聊天室会触发发送后回调，详见 [创建聊天室的回调事件](callback_group_room_create.html)。

## 调用频率上限

50 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatrooms
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/chatrooms' \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>'   \
-d '{
   "name": "testchatroom1",
   "description": "test",
   "maxusers": 300,
   "owner": "user1",
   "members": [
     "user2"
   ]
 }' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数          | 类型   | 是否必需 | 描述                                                                            |
| :------------ | :----- | :------- | :------------------------------------------------------------------------------ |
| `name`        | String | 是       | 聊天室名称，最大长度为 128 个字符。                                             |
| `description` | String | 是       | 聊天室描述，最大长度为 512 个字符。                                             |
| `maxusers`    | Int    | 否       | 聊天室最大成员数（包括聊天室所有者）。取值范围为 [1, 10,000]，默认值为 `1000`。如需调整请联系商务。 |
| `owner`       | String | 是       | 聊天室所有者。                                                                |
| `members`     | Array  | 否       | 聊天室普通成员和管理员的用户 ID 数组，不包含聊天室所有者的用户 ID。该数组可包含的元素数量不超过 `maxusers` 的值。若传该参数，确保至少设置一个数组元素。<Container type="tip" title="提示"> 创建聊天室时拉入的这些用户若从未登录过，会一直存在于聊天室中。</Container>   |
| `custom`      | String | 否       | 聊天室扩展信息，例如，可以给聊天室添加业务相关的标记，不能超过 8 KB。     |

:::tip
该 API 支持基于自定义聊天室 ID 创建聊天室，即调用该 API 时传入 `roomid` 参数。
1. 使用该功能前，你需**联系环信商务**。功能开通后，你也可以 [基于自定义群组 ID 创建群组](group_create.html#请求-body-参数)。
2. `roomid` 参数最多可传入 64 个字符，只支持小写英文字母 a-z 和数字 0-9。**注意不要使用大写英文字母 A-Z 。**
:::

## 响应示例

```json
{
  "data": {
    "id": "66XXXX33"
  }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下：

| 字段      | 类型   | 描述                |
| :-------- | :----- | :------------------ |
| `data` | JSON | 实际获取的响应数据。 |
| - `id` | String | 创建的聊天室的 ID。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | invalid_parameter | XX must be provided | XX 字段没有设置。 | 请传入必传字段。|
| 400     | illegal_argument | group ID XX already exists! | groupId 重复。 | 使用新的聊天室 ID。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | exceed_limit | appKey:XX#XX has create too many chatrooms! | appKey 创建聊天室达到上限。 | 删除不用的聊天室或联系商务调整上限。 |
| 403     | exceed_limit | user XX has joined too many chatrooms! | 用户加入的聊天室达到上限。 | 退出不用的聊天室组或联系商务调整上限。 |
| 403     | exceed_limit | members size is greater than max user size ! | 创建聊天室加入的人超过最大限制（取值范围为 [1,10,000]）。 | 可联系商务提升该限制。 |
| 404     |  resource_not_found  | username XXXX doesn't exist!       | 创建聊天室时添加的用户不存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。