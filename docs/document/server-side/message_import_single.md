# 导入单聊消息

## 功能说明

你可以在数据迁移时导入单聊消息：
- **单次导入**：每次调用 **仅支持导入一条单聊消息**。
- **会话约束**：导入消息不会触发单聊会话的自动创建。若两个用户之间不存在单聊会话，消息导入后仍不会生成对应的单聊会话。
- **顺序要求**：必须按消息的时间先后顺序导入，确保先发送的消息优先导入。
- **漫游拉取**：导入成功后，客户端需主动拉取漫游消息，方可查看。
- **附件消息说明**：附件类型消息的导入流程与发送附件消息不同，详见下文的 [附件消息导入流程](#消息导入流程) 和 [附件消息导入说明](#附件消息导入说明)。

## 消息导入流程

- 文本、位置、透传和自定义消息：直接调用该接口，传入相关参数进行导入。
- 图片、语音、视频和文件消息：**直接调用该接口传入业务侧附件地址，无需先调用文件上传接口**。你可以通过 `need_download=true` 参数设置是否需要下载附件并上传到服务器（需确保附件地址无访问权限限制）。

附件消息的导入流程如下：

![img](/images/server-side/message_import_single.png)

各步骤的说明如下：

1. 调用导入单聊消息 接口时，可直接在 `body.url` 中传入业务侧附件地址，无需先调用上传接口。
2. 根据业务需要决定是否将 `need_download` 设置为 `true`。
3. 若 `need_download=true`，环信服务端会主动拉取该附件，并将其保存到环信文件服务。
4. 若 `need_download=false`，附件不会自动保存到环信文件服务，后续访问仍依赖业务侧原始地址。
5. 导入成功后，客户端需按需拉取漫游消息查看结果；若附件已被保存到环信文件服务，后续也可接入 `/chatfiles/{file_uuid}` 下载链路。
6. 若后续下载的文件属于受限访问文件，则仍需按下载接口要求携带对应的访问密钥后再下载。

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
| `body`          | JSON   | 是       | 消息内容。不同类型的消息仅 `body` 字段内容存在差异。该字段的含义与发送单聊消息相同，详见 [发送单聊消息的各类消息的 body 字段描述](message_single.html#请求-body-参数)。    |
| `ext`   | JSON   | 否       | 消息扩展字段，可添加自定义信息。例如，"key1": "value1"。  |
| `msg_timestamp` | Long   | 否       | 要导入的消息的时间戳，单位为毫秒。<br/> - 不传时，环信服务器会将导入时间设为当前时间。<br/> - 该参数不能传 `0`，也不能小于 1000 毫秒。<br/> - **顺序约束**：必须大于同单聊会话中已导入的最后一条消息的时间戳，即需按时间先后顺序导入。  |
| `need_download` | Bool   | 否       | 是否需要由环信服务器拉取附件并保存到环信文件服务。<br/> - `true`：是。需确保 `body.url` 可被环信服务器直接访问，并且返回真实有效的附件内容。<br/> - （默认）`false`：否。环信不会主动保存该附件；此时附件访问仍依赖业务侧原始地址。|

### 附件消息导入说明

对于图片、语音、视频和文件等附件类型消息，**导入附件消息** 与 **发送附件消息** 的处理流程不同。导入附件消息时，可直接使用业务侧附件地址；发送附件消息时，则需要先调用文件上传接口，再使用上传后返回的环信文件地址构造消息体。

附件消息导入时，请注意以下事项：

- 调用本接口导入附件消息时，`body.url` 可以直接传入业务侧附件地址，**无需先调用文件上传接口将附件上传到环信文件服务**。
- 如果设置 `need_download` 为 `true`，环信服务器会主动拉取 `body.url` 对应的附件内容，并将其保存到环信文件服务，供后续客户端下载或播放。
- 业务侧传入的附件地址必须能被环信服务器**稳定访问**，并且能够**直接返回真实有效的附件内容**。请避免使用需要登录鉴权、临时签名快速过期、仅浏览器可访问、返回错误页或重定向到受限页面的地址。
- 如果源地址无法访问，或者返回的不是有效附件内容，消息虽然可能导入成功，但客户端仍可能出现附件无法播放、无法下载或无法正常显示的问题。

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
