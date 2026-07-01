# 编辑消息

## 功能说明

环信即时通讯 IM 支持在服务端编辑单聊、群组聊天和聊天室中发送成功的消息：

 - 文本消息：支持编辑消息内容字段 `msg` 和扩展字段 `ext`。
 - 自定义消息：支持编辑 `customEvent` 、`customExts` 和扩展字段 `ext`。
 - 图片/语音/视频/文件/位置消息：仅支持编辑扩展字段 `ext`。
 - 透传消息：不支持编辑。

#### 消息编辑后的生命周期

编辑消息没有时间限制，即只要这条消息仍在服务端存储就可以编辑。消息编辑后，消息生命周期（在服务端的保存时间）会重新计算，例如，消息可在服务器上保存 180 天，用户在消息发送后的第 30 天（服务器上的保存时间剩余 150 天）编辑了消息，编辑成功后该消息还可以在服务器上保存 180 天。

#### 消息编辑后的变化

对于编辑后的消息，消息体中除了内容或扩展字段变化，还新增了编辑者的用户 ID、编辑时间和编辑次数属性。除消息体外，该消息的其他信息（例如，消息发送方、接收方）均不会发生变化。

## 功能开通

若使用该功能，需要 **联系环信商务开通**。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/messages/rewrite/{msg_id}
```

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :------------------------------------------ |
| `msg_id`  | String | 是  | 要编辑的消息 ID。     |

## 请求示例

- 编辑发送成功的文本消息：支持编辑 `msg` 和 `ext` 字段

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -i 'https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "user": "user1",
  "new_msg": { 
    "type": "txt",
    "msg": "update message content"
  },
  "new_ext": { 
    "key1": "value1",
    "key2": "value2"
  },
  "is_combine_ext": true
}'
```

- 编辑发送成功的自定义消息：支持编辑 `customEvent`、`customExts` 和 `ext` 字段

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -i 'https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "user": "user1",
  "new_msg": { 
    "type": "custom",
    "customEvent": "custom_event",
    "customExts":{
      "ext_key1":"ext_value1"
    }
  },
  "new_ext": { 
    "key1": "value1",
    "key2": "value2"
  },
  "is_combine_ext": true
}'
```

- 编辑发送成功的位置、图片、音频、视频和文件消息：支持编辑 `ext` 字段
  
  例如，编辑发送后的图片消息（不同类型的消息只是 `type` 字段的值不同）：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -i 'https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "user": "user1",
  "new_msg": { 
    "type": "image"
  },
  "new_ext": { 
    "key1": "value1",
    "key2": "value2"
  },
  "is_combine_ext": true
}'
```


## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :--------------- |
| `user`| String | 否 | 编辑消息的用户。|
| `new_msg` | JSON | 是 | 编辑后的消息。|
| `new_msg.type` | String | 是 | 编辑的消息类型：<br/> - `txt`：文本消息<br/> - `loc`：位置消息<br/> - `img`：图片消息 <br/> - `audio` ：音频消息<br/> - `video`：视频消息<br/> - `file`：文件消息<br/> - `custom`：自定义消息|
| `new_msg.msg` | String | 是 | 编辑后的消息内容。**该字段只对文本消息生效。**|
| `new_msg.customEvent` | String | 否      | 用户自定义的事件类型。该参数的值必须满足正则表达式 `[a-zA-Z0-9-_/\.]{1,32}`，长度为 1-32 个字符。**该字段只对自定义消息生效。**  |
| `new_msg.customExts`  | JSON   | 否       | 用户自定义的事件属性，类型必须是 `Map<String,String>`，最多可以包含 16 个元素。**该字段只对自定义消息生效。** |
| `new_ext` | JSON | 否 | 编辑后的消息扩展信息。该字段对文本、自定义、位置、图片、音频、视频和文件消息均有效。|
| `is_combine_ext` | Boolean | 否 | 编辑后的消息扩展信息与原有扩展信息是合并还是替换。<br/> - （默认）`true`：合并<br/> - `false`：替换|

## 响应示例

```json
{
  "path": "/messages/rewrite/1235807318835202004",
  "uri": "https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004",
  "timestamp": 1705372388118,
  "organization": "XXXX",
  "application": "ff678832-XXXX-XXXX-8130-58ac38cb6c15",
  "action": "put",
  "data": "success",
  "duration": 49,
  "applicationName": "XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 参数              | 类型   | 描述          |
| :---------------- | :----- | :------------------------------- |
| `data` | String | 值为 `success`，表示消息成功编辑。| 

其他字段的说明如下：

| 参数              | 类型   | 描述          |
| :---------------- | :----- | :------------------------------- |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。      |
| `uri`             | String | 请求 URL。     |
| `timestamp`       | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。  |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `action`          | String | 请求方法。     |
| `duration`        | Int    | 从发送 HTTP 请求到响应的时长，单位为毫秒。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 错误码

调用该 REST API 如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型   | 错误提示   | 可能原因      | 处理建议     |
|:---------|:-------------------|:----------------------|:------------------|:----------------------|
| 400      | invalid_request_body   | Request body is invalid. Please check body is correct.   | 请求体格式不正确。 | 检查请求体内容是否合法(字段类型是否正确)。 |
| 400      |  illegal_argument  | new_msg is required     | 请求参数 `new_msg` 是空。  | 输入正确的请求参数 `new_msg`。 |
| 400      | message_rewrite_error    | The message is of a type that is currently not supported for modification. | 请求参数 `msg.type` 内容不正确。 | 输入正确的请求参数 `msg.type`。|
| 400 | InvalidMessageIdException  | The provided message ID is not a valid number.  | 消息 ID 必须是数字。 | 消息 ID 只能传入数字。   |
| 404      | message_rewrite_error  | The message is unavailable or has expired.   | 请求参数 `msg_id` 不存在。 | 输入正确的请求参数 `msg_id`。     |
| 401      | message_rewrite_error   | You are not authorized to edit this message.   | 请求参数 `msg_id` 不正确。 |  输入正确的请求参数 `msg_id`。 |
| 403      | message_rewrite_error   | The message has reached its edit limit and cannot be modified further.   | 消息 `msg_id` 的编辑次数到达上线。 | 消息编辑次数限制在 10 次以内。   |
| 403      | message_rewrite_error   | The rewrite message feature is not open.   | 消息编辑功能未开通。  |  联系商务开通消息编辑功能。  |
| 404 | MessageUnavailableException  | The message is unavailable or has expired.   | 编辑的消息不存在或者已经过期。 | 只能编辑服务端存储的消息，若消息不存在或已过期，则不能编辑。|
| 409         | concurrent_operation_error         | The message has been edited by another.    | 并发调用了编辑消息接口编辑同一消息。 | 避免同时请求编辑同一消息。  |
| 500 | RewriteMessageInternalErrorException | An unknown error occurred while processing the request.   | 内部服务异常，编辑消息失败。 |    |

关于其他异常，你可以参考 [响应状态码](error.html) 了解可能的原因。



