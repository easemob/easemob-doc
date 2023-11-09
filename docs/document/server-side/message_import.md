# 导入消息

<Toc />

数据迁移时，你可以调用接口导入单聊和群聊的历史消息到环信服务器。本文中的两个 RESTful API 只支持单条消息的导入。                   

## 前提条件

要调用环信即时通讯 REST API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

### 响应参数

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`             | String | 请求 URL。                                                                     |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                              |
| `entities`        | JSON   | 响应实体。                                                                     |
| `host`            | String | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名，与请求参数 `host` 相同。    |
| `data`            | JSON   | 实际获取的数据详情。                                                           |
| `timestamp`       | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。                                          |
| `duration`        | Int    | 从发送 HTTP 请求到响应的时长，单位为毫秒。                                     |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本篇涉及的所有消息管理 REST API 都需要使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 导入单聊消息

你可以在数据迁移时导入单聊消息。每次调用该接口只能导入一条消息。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/users/import
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :--------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数            | 类型   | 是否必需 | 描述        |
| :-------------- | :----- | :------- | :------------------------------------------------ |
| `from`          | String | 是       | 消息发送方的用户 ID。        |
| `target`        | String | 是       | 消息接收方的用户 ID。          |
| `type`          | String | 是       | 消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `body`          | JSON   | 是       | 消息内容。      |
| `is_ack_read`   | Bool   | 否       | 是否设置消息为已读。<br/> - `true`：是；<br/> - `false`：否。  |
| `msg_timestamp` | Long   | 否       | 要导入的消息的时间戳，单位为毫秒。若不传该参数，环信服务器会将导入的消息的时间戳设置为当前时间。   |
| `need_download` | Bool   | 否       | 是否需要下载附件并上传到服务器。<br/> - `true`：是。这种情况下，需确保附件地址可正常访问，不存在访问权限。若附件地址设置了访问控制权限，该参数需设置为 `false`，调用该 API 前你需自行下载附件，然后上传到服务器。<br/> - （默认）`false`：否。  |

与发送单聊消息类似，不同类型的消息只是 `body` 字段内容存在差异。详见 [发送单聊消息](message_single.html)。

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述                    |
| :------- | :----- | :---------------------- |
| `msg_id` | String | 导入消息返回的消息 ID。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

导入文本消息：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H "Authorization: Bearer <YourAppToken>" "https://XXXX/XXXX/XXXX/messages/users/import" -d '{
    "target": "username2",
    "type": "txt",
    "body": {
        "msg": "import message."
    },
    "from": "username1",
    "is_ack_read": true,
    "msg_timestamp": 1656906628428
}'
```

导入图片消息：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H "Authorization: Bearer <YourAppToken>" "https://XXXX/XXXX/XXXX/messages/users/import" -d '{
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
    "from": "username1",
    "is_ack_read": true,
    "msg_timestamp": 1656906628428,
    "need_download": true
}'
```

#### 响应示例

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

## 导入群聊消息

你可以在数据迁移时导入群聊消息。每次调用该接口只能导入一条消息。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/chatgroups/import
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述           |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数            | 类型   | 是否必需 | 描述                |
| :-------------- | :----- | :------- | :---------------------------------------------- |
| `from`          | String | 是       | 消息发送方的用户 ID。                  |
| `target`        | String | 是       | 群组 ID。                |
| `type`          | String | 是       | 消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `body`          | JSON   | 是       | 消息内容。                  |
| `is_ack_read`   | Bool   | 否       | 是否设置消息为已读。<br/> - `true`：是；<br/> - `false`：否。    |
| `msg_timestamp` | Long   | 否       | 要导入的消息的时间戳，单位为毫秒。若不传该参数，环信服务器会将导入的消息的时间戳设置为当前时间。 |
| `need_download` | Bool   | 否       | 是否需要下载附件并上传到服务器。<br/> - `true`：是。这种情况下，需确保附件地址可正常访问，不存在访问权限。若附件地址设置了访问控制权限，该参数需设置为 `false`，调用该 API 前你需自行下载附件，然后上传到服务器。<br/> - （默认）`false`：否。     |

:::notice
与发送消息类似，不同类型的消息只是 `body` 字段内容存在差异。详见 [发送群聊消息](message_group.html)。
:::

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述                    |
| :------- | :----- | :---------------------- |
| `msg_id` | String | 导入消息返回的消息 ID。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

导入文本消息：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H "Authorization: Bearer <YourAppToken> " "https://XXXX/XXXX/XXXX/messages/chatgroups/import" -d '{
    "target": "1123376564212",
    "type": "txt",
    "body": {
        "msg": "import message."
    },
    "from": "username1",
    "is_ack_read": true,
    "msg_timestamp": 1656906628428
}'
```

导入图片消息：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H "Authorization: Bearer <YourAppToken> " "https://XXXX/XXXX/XXXX/messages/chatgroups/import" -d '{
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
    "from": "username1",
    "is_ack_read": true,
    "msg_timestamp": 1656906628428,
    "need_download": true
}'

```

#### 响应示例

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
