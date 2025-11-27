# 导入群聊消息

## 功能说明

- 你可以在数据迁移时导入群聊消息。每次调用该接口只能导入一条消息。
- 导入消息后不会生成对应的单聊会话。例如，用户 A 和用户 B 之间未创建过单聊会话，即未发送过任何消息，导入了这两个用户的单聊消息，也不会创建他们的单聊会话。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatgroups/import
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

导入文本消息：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST "https://XXXX/XXXX/XXXX/messages/chatgroups/import" \
-H "Authorization: Bearer <YourAppToken> "  \
-d '{
    "target": "1123376564212",
    "type": "txt",
    "body": {
        "msg": "import message."
    },
    "ext": {
        "key1": "value1"
    }, 
    "from": "username1",
    "msg_timestamp": 1656906628428
}'
```

导入图片消息：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST "https://XXXX/XXXX/XXXX/messages/chatgroups/import"   \
-H "Authorization: Bearer <YourAppToken> "   \
-d '{
    "target": "1123376564212",
    "type": "img",
    "body": {
        "url": "<YourImageUrl>",
        "filename": "<ImageFileName>",
        "size": {
            "width": 1080,
            "height": 1920
        }
    },
    "ext": {
        "key1": "value1"
    }, 
    "from": "username1",
    "msg_timestamp": 1656906628428,
    "need_download": true
}'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述                |
| :-------------- | :----- | :------- | :---------------------------------------------- |
| `from`          | String | 是       | 消息发送方的用户 ID。                  |
| `target`        | String | 是       | 群组 ID。                |
| `type`          | String | 是       | 消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `body`          | JSON   | 是       | 消息内容。                  |
| `ext`   | JSON   | 否       | 消息支持扩展字段，可添加自定义信息。例如，请求中的 "key1": "value1"。  |
| `msg_timestamp` | Long   | 否       | 要导入的消息的时间戳，单位为毫秒。<br/> - 若不传该参数，环信服务器会将导入的消息的时间戳设置为当前时间。<br/> - 该参数不能传 `0`，也不能小于 1000 毫秒。 设置的时间戳必须大于群组创建时间，小于当前时间。 |
| `need_download` | Bool   | 否       | 是否需要下载附件并上传到服务器。<br/> - `true`：是。这种情况下，需确保附件地址可直接访问，没有访问权限的限制。<br/> - （默认）`false`：否。     |

:::tip
与发送消息类似，不同类型的消息只是 `body` 字段内容存在差异。详见 [发送群聊消息](message_group.html)。
:::

## 响应示例

```json
{
  "path": "/messages/users/import",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatgroups/import",
  "timestamp": 1638440544078,
  "organization": "XXXX",
  "application": "c3624975-XXXX-XXXX-9da2-ee91ed4c5a76",
  "entities": [],
  "action": "post",
  "data": {
    "msg_id": "10212123848595"
  },
  "duration": 3,
  "applicationName": "XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述                    |
| :------- | :----- | :---------------------- |
| `msg_id` | String | 导入消息返回的消息 ID。 |

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

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型       | 错误提示   | 可能原因    | 处理建议                  |
|:---------|:-------------------|:----------------|:--------------|:----------------------|
| 400      | invalid_request_body | Request body is invalid. Please check body is correct.   | 请求体格式不正确。  | 检查请求体内容是否合法(字段类型是否正确)。 |
| 400      | illegal_argument   | message body not allow empty    | 请求参数 `body` 是空。    | 输入正确的请求参数 `body`。  |
| 400      | illegal_argument  | type not allow empty   | 请求参数 `type` 是空字符串。 | 输入正确的请求参数 `type`。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。