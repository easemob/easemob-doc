# 导入单聊消息

## 功能说明

你可以在数据迁移时导入单聊消息：
- **单次导入**：每次调用 **仅支持导入一条单聊消息**。
- **会话约束**：导入消息不会触发单聊会话的自动创建。若两个用户之间不存在单聊会话，消息导入后仍不会生成对应的单聊会话。
- **顺序要求**：必须按消息的时间先后顺序导入，确保先发送的消息优先导入。
- **漫游拉取**：导入成功后，客户端需主动拉取漫游消息，方可查看。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/messages/users/import
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

导入文本消息：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST "https://XXXX/XXXX/XXXX/messages/users/import"   \
-H "Authorization: Bearer <YourAppToken>"    \
-d '{
    "target": "username2",
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

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST "https://XXXX/XXXX/XXXX/messages/users/import"   \
-H "Authorization: Bearer <YourAppToken>"   \
-d '{
    "target": "username2",
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

| 参数            | 类型   | 是否必需 | 描述        |
| :-------------- | :----- | :------- | :------------------------------------------------ |
| `from`          | String | 是       | 消息发送方的用户 ID。        |
| `target`        | String | 是       | 消息接收方的用户 ID。          |
| `type`          | String | 是       | 消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `body`          | JSON   | 是       | 消息内容。      |
| `ext`   | JSON   | 否       | 消息扩展字段，可添加自定义信息。例如，"key1": "value1"。  |
| `msg_timestamp` | Long   | 否       | 要导入的消息的时间戳，单位为毫秒。<br/> - 不传时，环信服务器会将导入时间设为当前时间。<br/> - 该参数不能传 `0`，也不能小于 1000 毫秒。<br/> - **顺序约束**：必须大于同单聊会话中已导入的最后一条消息的时间戳，即需按时间先后顺序导入。  |
| `need_download` | Bool   | 否       | 是否需要下载附件并上传到服务器。<br/> - `true`：是。需确保附件地址可直接访问（无权限限制）<br/> - （默认）`false`：否。  |

与发送单聊消息类似，不同类型的消息仅 `body` 字段内容存在差异。详见 [发送单聊消息](message_single.html)。

## 响应示例

```json
{
  "path": "/messages/users/import",
  "uri": "https://XXXX/XXXX/XXXX/messages/users/import",
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

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 包含以下字段：

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
| `application`     | String | 应用在系统内的唯一标识，由系统生成，开发者无需关心。                     |
| `action`          | String | 请求方法。                                                                     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示       | 可能原因    | 处理建议       |
|:---------|:-------------------|:--------------|:--------------|:----------------------|
| 400      | invalid_request_body     | Request body is invalid. Please check body is correct.    | 请求体格式不正确。  | 检查请求体内容是否合法(如字段类型是否正确)。 |
| 400      | illegal_argument   | message body not allow empty  | 请求参数 `body` 为空。  | 填写正确的 `body`。         |
| 400      | illegal_argument    | type not allow empty  | 请求参数 `type` 是空字符串。 | 填写正确的请求参数 `type`。         |

关于其他错误码，请参考 [响应状态码](error.html) 了解可能的原因。