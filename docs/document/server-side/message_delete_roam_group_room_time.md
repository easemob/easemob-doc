# 单向清空群组或聊天室会话某个时间点及之前的漫游消息

## 功能说明

- 清空指定用户的某个群组或聊天室会话在某个时间点及之前的的漫游消息。
- 单向删除消息：
  - 调用该接口后，该用户的漫游消息会从服务器和本地清空，该用户无法从环信服务端拉取到这些漫游消息。若清除了该会话的全部漫游消息，该用户的这个会话在服务端也会被清除，拉取会话列表时拉不到该会话。
  - 会话中的其他用户不受影响，仍然可以拉取这些漫游消息和会话。

:::tip
聊天室漫游消息默认关闭，若要使用该功能需联系环信商务开通。
:::

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/rest/message/roaming/group/user/{userId}/time?groupId={groupId}&delTime={delTime}&isNotify={isNotify}
```

| 参数      | 类型     | 是否必需 | 描述                                    |
|:--------|:-------|:-----|:----------------------|
| `userId` | String | 是       | 要清空的漫游消息的所属用户 ID。 |
| `groupId` | String  | 是    | 要清空该群组或聊天室的漫游消息。你可以传入群组 ID 或聊天室 ID。|
| `delTime` | Long  | 是    | 要清空指定的时间点及之前的群组或聊天室的漫游消息。该时间为 Unix 时间戳，单位为毫秒。 |
| `isNotify` | Boolean | 否       | 消息删除后，是否同步到消息所属用户的所有在线设备。<br/> -  （默认）`true`：是<br/> -  `false`：否 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE 'https://XXXX/XXXX/XXXX/rest/message/roaming/group/user/XXXX/time?groupId=XXXX&delTime=1659014868000&isNotify=false' \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1710309184114
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述         |
|:-------------------------|:-------|:-----------|
| `requestStatusCode`      | String | 操作结果，返回 `ok` 表示漫游消息清除成功。 |
| `timestamp`          | Number | HTTP 响应的 Unix 时间戳，单位为毫秒。    |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示       | 可能原因    | 处理建议       |
|:---------|:-------------------|:--------------|:--------------|:----------------------|
| 400      | service open exception    | this appKey not open message roaming    | 消息漫游服务未开通。 | 联系商务开通。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
