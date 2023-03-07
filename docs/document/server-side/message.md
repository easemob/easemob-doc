# 消息管理

<Toc />

本文展示如何调用环信 IM REST API 在服务端实现全类型消息，包括文本消息、图片消息、语音消息、视频消息、透传消息和自定义消息的发送与接收、消息附件上传和下载、获取历史消息记录、服务端消息撤回、服务端单向删除会话等。

## 前提条件

要调用环信即时通讯 REST API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------------------------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `username` | String | 是       | 用户 ID。      |

### 响应参数

| 参数              | 类型   | 描述         |
| :---------------- | :----- | :----------------------------------- |
| `action`          | String | 请求方法。         |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。|
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。        |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`             | String | 请求 URL。       |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。    |
| `entities`        | JSON   | 响应实体。          |
| `host`            | String | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名，与请求参数 `host` 相同。    |
| `data`            | JSON   | 实际获取的数据详情。                  |
| `uuid`            | String | 消息附件的唯一标识。该标识由系统生成，开发者无需关心。       |
| `username`        | String | 用户 ID。      |
| `timestamp`       | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。      |
| `duration`        | Int    | 从发送 HTTP 请求到响应的时长，单位为毫秒。      |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 Authorization 字段：

Authorization：`Bearer ${YourAppToken}`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本篇涉及的所有消息管理 REST API 都需要使用 App Token 的鉴权方式，详见 [使用 app token 鉴权](easemob_app_token.html)。

## 发送消息

在服务端实现用户到用户，用户到群组或用户到聊天室的消息发送与接收。消息类型包括文本、图片、语音、视频、透传以及自定义消息。

<table>
<tbody>
<tr>
<td width="161">
<p><strong>消息类型</strong></p>
</td>
<td width="189">
<p><strong>发送方式</strong></p>
</td>
<td width="279">
<p><strong>备注</strong></p>
</td>
</tr>
<tr>
<td width="161">
<p>文本/透传消息</p>
</td>
<td width="189">
<p>调用发送消息方法，在请求 body 中传入消息内容。</p>
</td>
<td rowspan="2" width="279">
<p>1.发送消息时，可选的 `from` 字段用于指定发送方。</p>
<p>2. 消息支持扩展属性 `ext`，可添加自定义信息。同时，推送通知也支持自定义扩展字段，详见 <a href="http://docs-im-beta.easemob.com/document/ios/push.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%98%BE%E7%A4%BA">APNs 自定义显示</a>和 <a href="http://docs-im-beta.easemob.com/document/android/push.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%98%BE%E7%A4%BA">Android 推送字段说明</a>。</p>
</td>
</tr>
<tr>
<td width="161">
<p>图片/语音/视频/文件消息</p>
</td>
<td width="189">
<p>1. 调用<a href="http://docs-im-beta.easemob.com/document/server-side/message.html#%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0">文件上传</a>方法上传图片、语音、视频或其他类型文件，并从响应 body 中获取文件 UUID。2. 调用发送消息方法，在请求 body 中传入该 UUID。</p>
</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>

:::notice
在接口调用过程中，请求体若超过 5 KB 会导致 413 错误，需要拆成几个更小的请求体重试。同时，请求体和扩展字段的总长度不能超过 3 KB。
:::


### 发送单聊消息

**发送频率**：通过 RESTful API 单个应用每分钟最多可发送 6000 条消息，每次最多可向 600 人发送。例如，一次向 600 人发消息，视为 600 条消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/users
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述        |
| :-------------- | :----- | :------- | :--------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。      |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。     |
| `Authorization` | String | 是       | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### 通用请求体

通用请求体为 JSON 对象，是所有消息的外层结构。不同类型的消息只是 `body` 字段内容存在差异。

| 参数          | 类型   | 是否必需 | 描述       |
| :------------ | :----- | :------- | :-------------------------- |
| `from`        | String | 否       | 消息发送方的用户 ID。若不传入该字段，服务器默认设置为管理员，即 “admin”；若传入字段但值为空字符串 (“”)，请求失败。      |
| `to`          | List   | 是       | 消息接收方的用户 ID 数组。每次最多可向 600 个用户发送消息。               |
| `type`        | String | 是       | 消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `body`        | JSON   | 是       | 消息内容。对于不同消息类型 ，body 包含的字段不同，详见 [body 字段说明](#body-字段说明)。                     |
| `sync_device` | Bool   | 否       | 消息发送成功后，是否将消息同步到发送方。<br/> - `true`：是；<br/> - （默认）`false`：否。            |
| `routetype`   | String | 否       | 若传入该参数，其值为 `ROUTE_ONLINE`，表示接收方只有在线时才能收到消息，若接收方离线则无法收到消息。若不传入该参数，无论接收方在线还是离线都能收到消息。              |
| `ext`         | JSON   | 否       | 消息支持扩展字段，可添加自定义信息。不能对该参数传入 `null`。同时，推送通知也支持自定义扩展字段，详见 [APNs 自定义显示](/document/ios/push.html#自定义显示) 和 [Android 推送字段说明](/document/android/push.html#自定义显示)。                       |
| `msg_timestamp`        | Long   | 否       | 服务器收到该消息的时间戳。若不传该参数，服务器收到消息后会自动生成一个消息接收时间戳。          |

#### body 字段说明

##### 文本消息

| 参数  | 类型   | 是否必需 | 描述       |
| :---- | :----- | :------- | :--------- |
| `msg` | String | 是       | 消息内容。 |

##### 图片消息

| 参数       | 类型   | 是否必需 | 描述       |
| :--------- | :----- | :------- | :------------------------------ |
| `filename` | String | 是       | 图片名称。                |
| `secret`   | String | 否       | 图片的访问密钥，即成功上传图片后，从 [文件上传](#文件上传) 的响应 body 中获取的 `share-secret`。如果图片文件上传时设置了文件访问限制（`restrict-access`），则该字段为必填。 |
| `size`     | JSON   | 是       | 图片尺寸，单位为像素，包含以下字段：<br/> - `height`：图片高度；<br/> - `width`：图片宽度。           |
| `url`      | String | 是       | 图片 URL 地址：`https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`。其中 `file_uuid` 为文件 ID，成功上传图片文件后，从 [文件上传](#文件上传) 的响应 body 中获取。  |

##### 语音消息

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------------------------- |
| `filename` | String | 是       | 语音文件的名称。            |
| `secret`   | String | 否       | 语音文件访问密钥，即成功上传语音文件后，从 [文件上传](#文件上传) 的响应 body 中获取的 `share-secret`。 如果语音文件上传时设置了文件访问限制（`restrict-access`），则该字段为必填。 |
| `Length`   | Int    | 是       | 语音时长，单位为秒。                 |
| `url`      | String | 是       | 语音文件 URL 地址：`https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`。`file_uuid` 为文件 ID，成功上传语音文件后，从 [文件上传](#文件上传) 的响应 body 中获取。          |

##### 视频消息

| 参数           | 类型   | 是否必需 | 描述                   |
| :------------- | :----- | :------- | :----------------------------------- |
| `thumb`        | String | 否       | 视频缩略图 URL 地址：`https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`。`file_uuid` 为视频缩略图唯一标识，成功上传缩略图文件后，从 [文件上传](#文件上传) 的响应 body 中获取。 |
| `length`       | Int    | 是       | 视频时长，单位为秒。       |
| `secret`       | String | 否       | 视频文件访问密钥，即成功上传视频文件后，从 [文件上传](#文件上传) 的响应 body 中获取的 `share-secret`。如果视频文件上传时设置了文件访问限制（`restrict-access`），则该字段为必填。        |
| `file_length`  | Long   | 是       | 视频文件大小，单位为字节。              |
| `thumb_secret` | String | 否       | 视频缩略图访问密钥，即成功上传视频文件后，从 [文件上传](#文件上传) 的响应 body 中获取的 `share-secret`。如果缩略图文件上传时设置了文件访问限制（`restrict-access`），则该字段为必填。    |
| `url`          | String | 是       | 视频文件 URL 地址：`https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`。其中 `file_uuid` 为文件 ID，成功上传视频文件后，从 [文件上传](#文件上传) 的响应 body 中获取。           |

##### 文件消息

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :----------------------------- |
| `filename` | String | 是       | 文件名称。                                                                                                                                                                 |
| `secret`   | String | 否       | 文件访问密钥，即成功上传文件后，从 [文件上传](#文件上传) 的响应 body 中获取的 `share-secret`。如果文件上传时设置了文件访问限制（`restrict-access`），则该字段为必填。      |
| `url`      | String | 是       | 文件 URL 地址：`https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`。其中 `file_uuid` 为文件 ID，成功上传视频文件后，从 [文件上传](#文件上传) 的响应 body 中获取。 |

##### 位置消息

| 参数   | 类型   | 是否必需 | 描述                   |
| :----- | :----- | :------- | :--------------------- |
| `lat`  | String | 是       | 位置的纬度，单位为度。 |
| `lng`  | String | 是       | 位置的经度，单位为度。 |
| `addr` | String | 是       | 位置的文字描述。       |

##### 透传消息

| 参数     | 类型   | 是否必需 | 描述       |
| :------- | :----- | :------- | :--------- |
| `action` | String | 是       | 命令内容。 |

##### 自定义消息

| 参数          | 类型   | 是否必需 | 描述         |
| :------------ | :----- | :------- | :--------------------------------- |
| `customEvent` | String | 否       | 用户自定义的事件类型。该参数的值必须满足正则表达式 `[a-zA-Z0-9-_/\.]{1,32}`，长度为 1-32 个字符。                      |
| `customExts`  | JSON   | 否       | 用户自定义的事件属性，类型必须是 `Map<String,String>`，最多可以包含 16 个元素。`customExts` 是可选的，不需要可以不传。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应 body 包含如下字段：

| 参数   | 类型 | 描述           |
| :----- | :--- | :----------------------------- |
| `data` | JSON | 响应中的数据详情。该字段的值为包含接收方用户 ID 和 发送的消息的 ID 的键值对。<br/>例如 "user2": "1029457500870543736"，表示向 user2 发送了消息 ID 为 1029457500870543736 的消息。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

###### 文本消息

发送给目标用户，消息无需同步给发送方：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'http://XXXX/XXXX/XXXX/messages/users' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["user2"],"type": "txt","body": {"msg": "testmessages"}}'
```

仅发送给在线用户，消息同步给发送方：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'http://XXXX/XXXX/XXXX/messages/users' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["user2"],"type": "txt","body": {"msg": "testmessages"},"routetype":"ROUTE_ONLINE", "sync_device":true}'
```

###### 图片消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/users' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["user2"],"type": "img","body": {"filename":"testimg.jpg","secret":"VfXXXXNb_","url":"https://XXXX/XXXX/XXXX/chatfiles/55f12940-XXXX-XXXX-8a5b-ff2336f03252","size":{"width":480,"height":720}}}'
```

###### 语音消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/users' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["user2"],"type": "audio","body": {"url": "https://XXXX/XXXX/XXXX/chatfiles/1dfc7f50-XXXX-XXXX-8a07-7d75b8fb3d42","filename": "testaudio.amr","length": 10,"secret": "HfXXXXCjM"}}'
```

###### 视频消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/users' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d  '{"from": "user1","to": ["user2"],"type": "video","body": {"thumb" : "https://XXXX/XXXX/XXXX/chatfiles/67279b20-7f69-11e4-8eee-21d3334b3a97","length" : 0,"secret":"VfXXXXNb_","file_length" : 58103,"thumb_secret" : "ZyXXXX2I","url" : "https://XXXX/XXXX/XXXX/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"}}'
```

###### 文件消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/users' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["user2"],"type": "file","body": {"filename":"test.txt","secret":"1-g0XXXXua","url":"https://XXXX/XXXX/XXXX/chatfiles/d7eXXXX7444"}}'
```

###### 位置消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/users"  -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["user2"],"type": "loc","body":{"lat": "39.966","lng":"116.322","addr":"中国北京市海淀区中关村"}}'
```

###### 透传消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/users" -H 'Content-Type: application/json' -H 'Accept: application/json'  -H "Authorization:Bearer <YourAppToken>" -d '{"from": "user1","to": ["user2"],"type": "cmd","body":{"action":"action1"}}'
```

###### 自定义消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/users" -H 'Content-Type: application/json' -H 'Accept: application/json'  -H "Authorization:Bearer <YourAppToken>" -d '{"from": "user1","to": ["user2"],"type": "custom","body": {"customEvent": "custom_event"}}'
```

##### 响应示例

###### 文本消息

```json
{
  "path": "/messages/users",
  "uri": "https://XXXX/XXXX/XXXX/messages/users",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "user2": "1029457500870543736"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 图片消息

```json
{
  "path": "/messages/users",
  "uri": "https://XXXX/XXXX/XXXX/messages/users",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "user2": "1029457500870543736"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 语音消息

```json
{
  "path": "/messages/users",
  "uri": "https://XXXX/XXXX/XXXX/messages/users",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "user2": "1029457500870543736"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 视频消息

```json
{
  "path": "/messages/users",
  "uri": "https://XXXX/XXXX/XXXX/messages/users",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "user2": "1029457500870543736"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 文件消息

```json
{
  "path": "/messages/users",
  "uri": "https://XXXX/XXXX/XXXX/messages/users",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "user2": "1029457500870543736"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 位置消息

```json
{
  "path": "/messages/users",
  "uri": "https://XXXX/XXXX/XXXX/messages/users",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "user2": "1029457500870543736"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 透传消息

```json
{
  "path": "/messages/users",
  "uri": "https://XXXX/XXXX/XXXX/messages/users",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "user2": "1029457500870543736"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 自定义消息

```json
{
  "path": "/messages/users",
  "uri": "https://XXXX/XXXX/XXXX/messages/users",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "user2": "1029457500870543736"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

### 发送群聊消息

**发送频率**：通过 RESTful API 单个应用每秒最多可发送 20 条消息，每次最多可向 3 个群组发送。例如，一次向 3 个群组发送消息，视为 3 条消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/chatgroups
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。    |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。      |
| `Authorization` | String | 是       | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### 通用请求体

通用请求体为 JSON 对象，是所有消息的外层结构。

| 参数 | 类型  | 是否必需 | 描述         |
| :--- | :---- | :------- | :-------------------- |
| `to` | Array | 是   | 消息接收方群组 ID 数组。每次最多可向 3 个群组发送消息。 |

:::notice
1. 群聊消息的通用请求体中的其他参数与单聊消息类似，详见 [通用请求体](#通用请求体)。<br/>
2. 与单聊消息类似，不同类型的消息只是 `body` 字段内容存在差异。详见 [body 字段说明](#body-字段说明)。
:::

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应 body 包含如下字段：

| 参数   | 类型 | 描述     |
| :----- | :--- | :---------------- |
| `data` | JSON | 返回数据详情。该字段的值为包含群组 ID 和 发送的消息的 ID 的键值对。<br/>例如 "184524748161025": "1029544257947437432"，表示在 ID 为 184524748161025 的群组中发送了消息 ID 为 1029544257947437432 的消息。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

###### 文本消息

发送给目标用户，消息无需同步给发送方：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'http://XXXX/XXXX/XXXX/messages/chatgroups' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["184524748161025"],"type": "txt","body": {"msg": "testmessages"}}'
```

仅发送给在线用户，消息同步给发送方：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'http://XXXX/XXXX/XXXX/messages/chatgroups' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["184524748161025"],"type": "txt","body": {"msg": "testmessages"},"routetype":"ROUTE_ONLINE", "sync_device":true}'
```

###### 图片消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatgroups' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["184524748161025"],"type": "img","body": {"filename":"testimg.jpg","secret":"VfXXXXNb_","url":"https://XXXX/XXXX/XXXX/chatfiles/55f12940-XXXX-XXXX-8a5b-ff2336f03252","size":{"width":480,"height":720}}}'
```

###### 语音消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatgroups' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["184524748161025"],"type": "audio","body": {"url": "https://XXXX/XXXX/XXXX/chatfiles/1dfc7f50-XXXX-XXXX-8a07-7d75b8fb3d42","filename": "testaudio.amr","length": 10,"secret": "HfXXXXCjM"}}'
```

###### 视频消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatgroups' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d  '{"from": "user1","to": ["184524748161025"],"type": "video","body": {"thumb" : "https://XXXX/XXXX/XXXX/chatfiles/67279b20-7f69-11e4-8eee-21d3334b3a97","length" : 0,"secret":"VfXXXXNb_","file_length" : 58103,"thumb_secret" : "ZyXXXX2I","url" : "https://XXXX/XXXX/XXXX/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"}}'
```

###### 文件消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatgroups' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["184524748161025"],"type": "file","body": {"filename":"test.txt","secret":"1-g0XXXXua","url":"https://XXXX/XXXX/XXXX/chatfiles/d7eXXXX7444"}}'
```

###### 位置消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/chatgroups"  -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["184524748161025"],"type": "loc","body":{"lat": "39.966","lng":"116.322","addr":"中国北京市海淀区中关村"}}'
```

###### 透传消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/chatgroups" -H 'Content-Type: application/json' -H 'Accept: application/json'  -H "Authorization:Bearer <YourAppToken>" -d '{"from": "user1","to": ["184524748161025"],"type": "cmd","body":{"action":"action1"}}'
```

###### 自定义消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/chatgroups" -H 'Content-Type: application/json' -H 'Accept: application/json'  -H "Authorization:Bearer <YourAppToken>" -d '{"from": "user1","to": ["184524748161025"],"type": "custom","body": {"customEvent": "custom_event"}}'
```

##### 响应示例

###### 文本消息

```json
{
  "path": "/messages/chatgroups",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatgroups",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "184524748161025": "1029544257947437432"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 图片消息

```json
{
  "path": "/messages/chatgroups",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatgroups",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "184524748161025": "1029544257947437432"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 语音消息

```json
{
  "path": "/messages/chatgroups",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatgroups",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "184524748161025": "1029544257947437432"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 视频消息

```json
{
  "path": "/messages/chatgroups",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatgroups",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "184524748161025": "1029544257947437432"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 文件消息

```json
{
  "path": "/messages/chatgroups",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatgroups",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "184524748161025": "1029544257947437432"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 位置消息

```json
{
  "path": "/messages/chatgroups",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatgroups",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "184524748161025": "1029544257947437432"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 透传消息

```json
{
  "path": "/messages/chatgroups",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatgroups",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "184524748161025": "1029544257947437432"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 自定义消息

```json
{
  "path": "/messages/chatgroups",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatgroups",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "184524748161025": "1029544257947437432"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

### 发送聊天室消息

**发送频率**：通过 RESTful API 单个应用每秒最多可向聊天室发送 100 条消息，每次最多可向 10 个聊天室发送消息。例如，一次向 10 个聊天室发送消息，视为 10 条消息。

对于聊天室消息，环信即时通讯提供消息分级功能，将消息的优先级划分为高、普通和低三种级别，高优先级的消息会优先送达。你可以在创建消息时对指定聊天室消息类型或指定成员的消息设置为高优先级，确保这些消息优先送达。这种方式确保在聊天室内消息并发量很大或消息发送频率过高时，重要消息能够优先送达，从而提升重要消息的可靠性。 当服务器的负载较高时，会优先丢弃低优先级的消息，将资源留给高优先级的消息。不过，消息分级功能只确保消息优先到达，并不保证必达。服务器负载过高的情况下，即使是高优先级消息依然会被丢弃。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数       | 类型   | 是否必需 | 描述             |
| :------------- | :----- | :------ | :------------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。    |
| `Accept`     | String | 是    | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### 通用请求体

通用请求体为 JSON 对象，是所有消息的外层结构。不同类型的消息只是 `body` 字段内容存在差异。

| 参数 | 类型  | 是否必需 | 描述         |
| :--- | :---- | :------- | :----------------------- |
| `to` | Array | 是       | 消息接收方聊天室 ID 数组。每次最多可向 10 个聊天室发送消息。 |
| `chatroom_msg_level` | String | 否       | 聊天室消息的送达优先级：<br/> - `high`：高；<br/> - （默认）`normal`：普通；<br/> - `low`：低。 |

:::notice

1. 聊天室消息的通用请求体中的其他参数与单聊消息类似，详见 [通用请求体](#通用请求体)。<br/>
2. 与单聊消息类似，不同类型的消息只是 `body` 字段内容存在差异。详见 [body 字段说明](#body-字段说明)。
   :::

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应 body 包含如下字段：

| 参数   | 类型 | 描述    |
| :----- | :--- | :----------- |
| `data` | JSON | 返回数据详情。该字段的值为包含聊天室 ID 和 发送的消息的 ID 的键值对。<br/>例如 "185145305923585": "1029545553039460728"，表示在 ID 为 184524748161025 的聊天室中发送了消息 ID 为 1029545553039460728 的消息。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

###### 文本消息

发送给目标用户，消息无需同步给发送方：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'http://XXXX/XXXX/XXXX/messages/chatrooms' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["185145305923585"],"type": "txt","body": {"msg": "testmessages"}}'
```

仅发送给在线用户，消息同步给发送方：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'http://XXXX/XXXX/XXXX/messages/chatrooms' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["185145305923585"],"type": "txt","body": {"msg": "testmessages"},"routetype":"ROUTE_ONLINE", "sync_device":true}'
```

###### 图片消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["185145305923585"],"type": "img","body": {"filename":"testimg.jpg","secret":"VfXXXXNb_","url":"https://XXXX/XXXX/XXXX/chatfiles/55f12940-XXXX-XXXX-8a5b-ff2336f03252","size":{"width":480,"height":720}}}'
```

###### 语音消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["185145305923585"],"type": "audio","body": {"url": "https://XXXX/XXXX/XXXX/chatfiles/1dfc7f50-XXXX-XXXX-8a07-7d75b8fb3d42","filename": "testaudio.amr","length": 10,"secret": "HfXXXXCjM"}}'
```

###### 视频消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d  '{"from": "user1","to": ["185145305923585"],"type": "video","body": {"thumb" : "https://XXXX/XXXX/XXXX/chatfiles/67279b20-7f69-11e4-8eee-21d3334b3a97","length" : 0,"secret":"VfXXXXNb_","file_length" : 58103,"thumb_secret" : "ZyXXXX2I","url" : "https://XXXX/XXXX/XXXX/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"}}'
```

###### 文件消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["185145305923585"],"type": "file","body": {"filename":"test.txt","secret":"1-g0XXXXua","url":"https://XXXX/XXXX/XXXX/chatfiles/d7eXXXX7444"}}'
```

###### 位置消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/chatrooms"  -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"from": "user1","to": ["185145305923585"],"type": "loc","body":{"lat": "39.966","lng":"116.322","addr":"中国北京市海淀区中关村"}}'
```

###### 透传消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/chatrooms" -H 'Content-Type: application/json' -H 'Accept: application/json'  -H "Authorization:Bearer <YourAppToken>" -d '{"from": "user1","to": ["185145305923585"],"type": "cmd","body":{"action":"action1"}}'
```

###### 自定义消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/chatrooms" -H 'Content-Type: application/json' -H 'Accept: application/json'  -H "Authorization:Bearer <YourAppToken>" -d '{"from": "user1","to": ["185145305923585"],"type": "custom","body": {"customEvent": "custom_event"}}'
```

##### 响应示例

###### 文本消息

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 图片消息

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 语音消息

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 视频消息

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 文件消息

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 位置消息

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 透传消息

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

###### 自定义消息

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

## 文件上传

对于附件类型的消息，如图片、语音、视频或其他类型文件，发送消息前需上传文件。图片和视频存在缩略图，文件上传详情如下：

- 图片：可调用文件上传接口上传原图，环信服务器会自动为图片生成缩略图。若上传的图片在 10 KB 以内，缩略图与原图等同；若图片超过 10 KB，环信服务器会根据你在请求中设置的图片高度和宽度，即 `thumbnail-height` 和 `thumbnail-width` 参数，生成缩略图。若这两个参数未传，则图片的高度和宽度均默认为 170 像素。
- 视频：可调用文件上传接口上传视频文件。环信服务器不会自动为视频文件生成缩略图。如果需要缩略图，你需再次调用文件上传接口上传视频缩略图。上传视频文件时，无需传 `thumbnail-height` 和 `thumbnail-width` 参数。上传视频缩略图时，若图片在 10 KB 以内，视频缩略图即为上传的图片。如果图片超过 10 KB，而且设置了这两个参数，视频缩略图的高度和宽度取决于这两个参数的设置。若这两个参数未传，则图片的高度和宽度均默认为 170 像素。

同时，为了保证聊天文件的安全，我们的 API 保证了以下几点：

- 上传文件的大小不能超过 10 MB，超过会上传失败。
- 支持对上传的文件限制访问。该功能开启后，你需要通过密钥才能下载被限制访问的文件。消息回调（包含发送前回调和发送后回调）和获取历史消息涉及下载文件时，都需要在下载 URL 中拼接密钥，才能正常下载文件，拼接规则为：`{{url}}?share-secret={{secret}}`。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatfiles
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数     | 类型   | 是否必需 | 描述          |
| :--------- | :----- | :------- | :------------ |
| `Content-Type`    | String | 否       | 内容类型。请填 `multipart/form-data`。上传文件会自动填充这个头。  |
| `Authorization`   | String | 是       | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。      |
| `restrict-access` | Bool   | 否       | 是否限制访问该文件：<br/> - `true`：是。用户需要通过响应 body 中获取的文件访问密钥（`share-secret`）才能下载该文件。<br/> - `false`：否。表示不限制访问。用户可以直接下载该文件。 |

#### 请求 body

| 参数               | 类型   | 是否必需 | 描述      |
| :----------------- | :----- | :------- | :----------------- |
| `file`             | String | 是       | 文件本地路径。         |
| `thumbnail-height` | Int    | 否       | 缩略图的高度，单位为像素。<br/> - 若上传的原图或视频缩略图小于 10 KB，上传的图片即为缩略图。<br/> - 若上传的图片超过 10 KB，缩略图的高度取决于该参数的设置。<br/> - 若不传该参数，缩略图的高度默认为 170 像素。你也可以在 [环信即时通讯控制台](https://console.easemob.com/user/login)的 `服务概览` 页面的 `设置` 区域修改该默认值。 |
| `thumbnail-width`  | Int    | 否       | 缩略图的宽度，单位为像素。<br/> - 若上传的原图或视频缩略图小于 10 KB，图片原图即为缩略图。<br/> - 若上传的图片超过 10 KB，缩略图的宽度取决于该参数的设置。<br/> - 若不传该参数，缩略图的宽度默认为 170 像素。你也可以在 [环信即时通讯控制台](https://console.easemob.com/user/login)的 `服务概览` 页面的 `设置` 区域修改该默认值。   |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型   | 描述       |
| :------------ | :----- | :----------------- |
| `entities.uuid`         | String | 文件 ID，即时通讯服务分配给该文件的唯一标识符。该参数在发送消息时需用到。  |
| `entities.type`         | String | 文件类型，为固定值 `chatfile`。    |
| `entities.share-secret` | String | 文件访问密钥。你需要自行保存 `share-secret`，以便 [下载文件](#下载文件)时使用。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token，将 file 的路径替换为待上传文件所在的本地完整路径
curl -X POST https://XXXX/XXXX/XXXX/chatfiles -H 'Authorization: Bearer <YourAppToken>' -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'  -H 'restrict-access: true' -F file=@/Users/test/9.2/easemob/image/IMG_2953.JPG
```

#### 响应示例

```json
{
  "action": "post",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "path": "/chatfiles",
  "uri": "https://XXXX/XXXX/XXXX/chatfiles",
  "entities": [
    {
      "uuid": "5fd74830-XXXX-XXXX-822a-81ea50bb049d",
      "type": "chatfile",
      "share-secret": "X9dXXXX7Yc"
    }
  ],
  "timestamp": 1554371126338,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

## 下载文件

你可利用该方法下载图片、语音、视频或其他类型的文件。

:::notice
如果上传文件时设置了文件访问限制（`restrict-access` 设置为 `true`），需要在下载请求头中包含文件上传响应中返回的 `share-secret` 和当前登录用户的 token 才能下载文件。
:::

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}
```

#### 路径参数

| 参数        | 类型   | 是否必需 | 描述            |
| :---------- | :----- | :------- | :-------------- |
| `file_uuid` | String | 是       | 服务器为文件生成的 UUID。 |

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :-------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/octet-stream`，表示下载二进制数据流格式的文件。       |
| `Authorization` | String | 是       | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |
| `share-secret`  | String | 否       | 文件访问密钥。若上传文件时限制了访问，下载该文件时则需要该访问密钥。成功上传文件后，从 [文件上传](#文件上传) 的响应 body 中获取该密钥。    |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功。参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

以下载图片为例：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/octet-stream' -H 'Authorization: Bearer <YourAppToken>' -H 'share-secret: f0Vr-uyyEeiHpHmsu53XXXXXXXXZYgyLkdfsZ4xo2Z0cSBnB' 'http://XXXX/XXXX/XXXX/chatfiles/7f456bf0-XXXX-XXXX-b630-777db304f26c'-o /Users/test/easemob/image/image.JPG
```

:::notice
上述请求示例中，`/Users/test/easemob/image/image.JPG` 为环信即时通讯 IM 的本地文件路径，使用时请替换为自己的文件路径，否则会请求失败。
:::

#### 响应示例

```json
{
  //语音/图片文件内容
}
```

## 下载缩略图

收到图片或视频消息，你可以先下载图片或视频的缩略图，如果需要再下载图片或视频原文件。下载缩略图与下载原文件的唯一区别是前者在请求 header 中多了 `thumbnail: true`。当服务器收到包含该字段的请求 header 时，返回缩略图，否则返回原文件。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}
```

#### 路径参数

| 参数        | 类型   | 是否必需 | 描述                            |
| :---------- | :----- | :------- | :------------------------------ |
| `file_uuid` | String | 是       | 服务器为缩略图文件生成的 UUID。 |

其他参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :-------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/octet-stream`，表示下载二进制数据流格式的文件。       |
| `Authorization` | String | 是       | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。        |
| `thumbnail`     | Bool   | 否       | 是否下载缩略图：<ul><li> `true`：是，下载缩略图。</li> <li>`false`：否，下载原文件。</li></ul> <Container type="notice" title="注意">若该参数为空，下载原文件。</Container> |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 200，表示请求成功。参数及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/octet-stream' -H 'Authorization: Bearer <YourAppToken>' -H 'share-secret: f0Vr-uyyEeiHpHmsu53XXXXXXXXZYgyLkdfsZ4xo2Z0cSBnB' -H 'thumbnail: true' 'http://XXXX/XXXX/XXXX/chatfiles/7f456bf0-ecb2-11e8-b630-777db304f26c'
```

#### 响应示例

若返回值为 `200`，表示下载缩略图成功。

```json
{
  //缩略图信息
}
```

若返回值 `401`，表示未授权，例如无 token、token 错误或 token 过期。

```json
{
  "error": "auth_bad_access_token",
  "timestamp": 1542350943210,
  "duration": 0,
  "exception": "org.apache.usergrid.rest.exceptions.SecurityException",
  "error_description": "Unable to authenticate due to corrupt access token"
}
```

## 获取历史消息记录

获取用户发送和接收的历史消息的记录。

- 单次请求获取从指定起始时间开始一小时内的全部历史消息记录。
- 查询历史消息记录时存在一定延时，无法实时获取。
- 过期的历史消息记录无法获取。对于不同的套餐版本，历史消息记录的默认存储时间不同。详见 [套餐包详情](https://www.easemob.com/pricing/im)。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatmessages/${time}
```

#### 路径参数

| 参数   | 类型   | 是否必需 | 描述             |
| :----- | :----- | :------- | :--------------------------- |
| `time` | String | 是       | 历史消息记录查询的起始时间。UTC 时间，使用 ISO8601 标准，格式为 yyyyMMddHH。例如 `time` 为 `2018112717`，则表示查询 2018 年 11 月 27 日 17 时至 2018 年 11 月 27 日 18 时期间的历史消息。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述        |
| :-------------- | :----- | :------- | :----------------- |
| `Accept`        | String | 是       | 内容类型，请填 `application/json`。        |
| `Authorization` | String | 是       | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数  | 类型   | 描述          |
| :---- | :----- | :----------------- |
| `url` | String | 历史消息记录的下载地址。该 URL 由历史消息记录的存储地址、到期 Unix 时间戳（`Expires`，单位为秒）、第三方云存储访问密钥（`OSSAccessKeyId`）和第三方云存储验证签名（`Signature`）组成。URL 仅在一定时间内有效，请及时通过 URL 下载聊天记录文件，URL 过期后会下载失败，需要重新调用该接口获取新的 URL。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/chatmessages/2018112717'
```

#### 响应示例

```json
{
  "action": "get",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "uri": "'http://XXXX/XXXX/XXXX/chatmessages/2018112717",
  "data": [
    {
      "url": "http://XXXX?Expires=1543316122&OSSAccessKeyId=XXXX&Signature=XXXX"
    }
  ],
  "timestamp": 1543314322601,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 历史消息记录的内容

查询历史消息记录成功后，你可以访问 URL 下载历史消息记录文件，查看历史消息记录的具体内容。

一条历史消息记录包含以下字段：

| 参数        | 类型   | 描述   |
| :---------- | :----- | :---------------------- |
| `msg_id`    | String | 消息 ID。  |
| `timestamp` | Long   | 消息发送完成的 Unix 时间戳，单位为毫秒，UTC 时间。           |
| `direction` | String | 消息方向，即该消息是当前用户发送的还是接收的：<br/> - `outgoing`：发送的消息；<br/> - `incoming`：接收的消息。 |
| `from`      | String | 消息发送方的用户 ID。        |
| `to`        | String | 消息接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。    |
| `chat_type` | String | 会话类型：<br/> - `chat`: 单聊；<br/> - `groupchat`: 群聊；<br/> - `chatroom`: 聊天室。   |
| `payload`   | JSON   | 消息的具体内容。例如，消息扩展信息、自定义扩展属性等。    |

历史消息记录为 JSON 类型，示例如下：

```json
{
  "msg_id": "5I02W-XX-8278a",
  "timestamp": 1403099033211,
  "direction": "outgoing",
  "to": "XXXX",
  "from": "XXXX",
  "chat_type": "chat",
  "payload":
  {
    "bodies": [    {
      //下面会将不同的消息类型进行说明
      }
      ],
      "ext":
      {
        "key1": "value1",              ...        },
        "from":"XXXX",
        "to":"XXXX"
  }
}
```

#### 文本消息

文本消息的 bodies 包含如下字段：

| 参数   | 类型   | 描述                             |
| :----- | :----- | :------------------------------- |
| `msg`  | String | 消息内容。                       |
| `type` | String | 消息类型，文本消息类型为 `txt`。 |

示例

```json
"bodies": [{"msg":"welcome to easemob!", "type":"txt"}]
```

#### 图片消息

图片消息的 bodies 包含如下字段：

| 参数          | 类型   | 描述        |
| :------------ | :----- | :---------------------- |
| `file_length` | Long   | 图片附件大小，单位为字节。      |
| `filename`    | String | 图片文件名称，包含文件后缀名。      |
| `secret`      | String | 图片文件访问密钥。如果 [文件上传](#文件上传) 时设置了文件访问限制，则该字段存在。 |
| `size`        | JSON   | 图片的尺寸。单位为像素。<br/> - `height`：图片高度。<br/> - `width`：图片宽度。 |
| `type`        | String | 消息类型。图片消息为 `img`。         |
| `url`         | String | 图片 URL 地址。     |

示例

```json
"bodies": [    {       "file_length":128827,       "filename":"test1.jpg",        "secret":"DRGM8OZrEeO1vaXXXXXXXXHBeKlIhDp0GCnFu54xOF3M6KLr",        "size":{"height":1325,"width":746},       "type":"img",       "url":"https://XXXX/XXXX/chatdemoui/chatfiles/65e54a4a-XXXX-XXXX-b821-ebde7b50cc4b",    }]
```

#### 位置消息

位置消息的 bodies 包含如下字段：

| 参数   | 类型   | 描述                         |
| :----- | :----- | :--------------------------- |
| `addr` | String | 位置的地址描述。             |
| `lat`  | Long   | 位置的纬度。                 |
| `lng`  | Long   | 位置的经度。                 |
| `type` | String | 消息类型。位置消息为 `loc`。 |

示例

```json
"bodies": [
  {
    "addr":"西城区西便门桥 ",
    "lat":39.9053,
    "lng":116.36302,
    "type":"loc"
    }]
```

#### 语音消息

语音消息的 bodies 包含如下字段：

| 参数          | 类型   | 描述        |
| :------------ | :----- | :----------------------- |
| `file_length` | Long   | 语音附件大小。单位为字节。   |
| `filename`    | String | 语音文件名称，包含文件后缀名。     |
| `secret`      | String | 语音文件访问密钥。如果 [文件上传](#文件上传) 时设置了文件访问限制，则该字段存在。 |
| `length`      | Int    | 语音时长。单位为秒。     |
| `type`        | String | 消息类型。语音消息为 `audio`。     |
| `url`         | String | 语音文件的 URL 地址。    |

示例

```json
"bodies":
   [
     {
  "file_length":6630,
  "filename":"test1.amr",
  "length":10,
  "secret":"DRGM8OZrEeO1vafuJSo2IjHBeKlIhDp0GCnFu54xOF3M6KLr",
  "type":"audio",
  "url":"https://XXXX/XXXX/chatdemoui/chatfiles/0637e55a-f606-XXXX-XXXX-51f25fd1215b"
      }
   ]
```

#### 视频消息

视频消息的 bodies 包含如下字段：

| 参数           | 类型   | 描述      |
| :------------- | :----- | :------------ |
| `file_length`  | Long   | 视频附件大小。单位为字节。             |
| `filename`     | String | 视频文件名称，包含文件后缀名。        |
| `secret`       | String | 视频文件的访问密钥。如果 [文件上传](#文件上传) 时设置了文件访问限制，则该字段存在。|
| `length`       | Int    | 视频时长。单位为秒。      |
| `size`         | JSON   | 视频缩略图尺寸。单位为像素。<br/> - `width`：视频缩略图的宽度；<br/> - `height`：视频缩略图的高度。|
| `thumb`        | String | 视频缩略图的 URL 地址，格式为 https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}。其中，`file_uuid` 为视频缩略图上传后，环信服务器返回的缩略图的 UUID。 |
| `thumb_secret` | String | 缩略图文件访问密钥。如果文件上传时设置了文件访问限制，则该字段存在。      |
| `type`         | String | 消息类型。视频消息为 `video`。    |
| `url`          | String | 视频文件的 URL 地址。    |

示例如下：

```json
"bodies": [   {
  "file_length": 58103,
  "filename": "14XXXX.mp4",
  "length": 10,
  "secret": "VfEpSmSvEeS7yU8dwa9rAQc-DIL2HhmpujTNfSTsrDt6eNb_",
  "size":{"height":480,"width":360},
  "thumb": "https://XXXX/XXXX/chatdemoui/chatfiles/67279b20-XXXX-XXXX-8eee-21d3334b3a97",
  "thumb_secret": "ZyebKn9pEeSSfY03ROk7ND24zUf74s7HpPN1oMV-1JxN2O2I",
  "type": "video",
  "url": "https://XXXX/XXXX/chatdemoui/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"   }]
```

#### 文件消息

文件消息的 bodies 包含如下字段：

| 参数          | 类型   | 描述    |
| :------------ | :----- | :----------------------------- |
| `file_length` | Long   | 文件大小。单位为字节。  |
| `filename`    | String | 文件名称，包含文件后缀名。                                                    |
| `secret`      | String | 文件访问密钥。如果 [文件上传](#文件上传) 时设置了文件访问限制，则该字段存在。 |
| `type`        | String | 消息类型。文件消息为 `file`。   |
| `url`         | String | 文件的 URL 地址。你可以访问该 URL 下载历史消息文件。                          |

示例如下：

```json
"bodies":
[
  {
  "file_length":3279,
  "filename":"record.md",
  "secret":"2RNXCgeeEeeXXXX-XXXXbtZXJH4cgr2admVXn560He2PD3RX",
  "type":"file",
  "url":"https://XXXX/XXXX/XXXX/chatfiles/d9135700-XXXX-XXXX-b000-a7039876610f"
  }
]
```

#### 透传消息

透传消息的 bodies 包含如下字段：

| 参数     | 类型   | 描述                         |
| :------- | :----- | :--------------------------- |
| `action` | String | 命令内容。                   |
| `type`   | String | 消息类型。透传消息为 `cmd`。 |

示例如下：

```json
"bodies":
[
  {
  "action":"run",
  "type":"cmd"
  }
]
```

#### 自定义消息

自定义消息的 bodies 包含如下字段：

| 参数          | 类型   | 描述                                             |
| :------------ | :----- | :----------------------------------------------- |
| `customExts`  | JSON   | 自定义扩展属性。你可以自行设置扩展属性中的字段。 |
| `customEvent` | String | 自定义事件类型。                                 |
| `type`        | String | 消息类型。自定义消息为 `custom`。                |

自定义类型消息格式示例如下：

```json
"bodies":
     [
       {
  "customExts":
    {
    "name":"flower",
    "size":"16",
    "price":"100"
    },
  "customEvent":"gift_1",
  "type":"custom"
       }
     ]
```

## 服务端消息撤回

应用管理员可撤回发送的消息。默认可撤回发出 2 分钟内的消息，如需调整请联系环信商务经理。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/msg_recall
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :------- | :---------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### 请求 body

| 参数        | 类型   | 是否必需 | 描述       |
| :---------- | :----- | :------- | :---------------- |
| `msg_id`    | String | 是       | 要撤回消息的消息 ID。       |
| `to`        | String | 是       | 要撤回消息的接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。<br/> 若不传入该参数，请求失败。            |
| `chat_type` | String | 是       | 要撤回消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊 ；<br/> - `chatroom`：聊天室 。        |
| `from`      | String | 否       | 消息撤回方的用户 ID。若不传该参数，默认为 `admin`。          |
| `force`     | Bool   | 是       | 是否为强制撤回：<br/> - `true`：是，支持撤回超过服务器存储时间的消息。具体见 [服务器消息保存时长](/product/limitation.html#消息存储时长限制)；<br/> - `false`：否，不支持撤回超过服务器存储时间的消息。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数       | 类型   | 描述       |
| :--------- | :----- | :----------------------- |
| `msg_id`   | String | 需要撤回的消息 ID。      |
| `recalled` | String | 消息撤回结果，成功是 `yes`。      |
| `from`     | String | 消息撤回方的用户 ID。     |
| `to`       | String | 撤回消息的送达方。<br/> - 单聊为送达方用户 ID；<br/> - 群聊为群组 ID。<br/> - 聊天室聊天为聊天室 ID。 |
| `chattype` | String | 撤回消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊；<br/> - `chatroom`：聊天室。     |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -i -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer <YourAppToken>"
"http://XXXX/XXXX/XXXX/messages/msg_recall"
-d '{
    "msg_id": "1028442084794698104",
    "to": "user2",
    "from": "user1",
    "chat_type": "chat",
    "force": true
}'
```

#### 响应示例

撤销成功：

```json
{
  "path": "/messages/msg_recall",
  "uri": "https://XXXX/XXXX/XXXX/messages/msg_recall",
  "timestamp": 1657529588473,
  "organization": "XXXX",
  "application": "09ebbf8b-XXXX-XXXX-XXXX-d47c3b38e434",
  "action": "post",
  "data": {
    "recalled": "yes",
    "chattype": "chat",
    "from": "XXXX",
    "to": "XXXX",
    "msg_id": "1028442084794698104"
  },
  "duration": 8,
  "applicationName": "XXXX"
}
```

撤销失败：

`recalled`：消息撤销失败包含以下几种情况：

- ”can’t find msg to”：未找到撤回消息的接收⽅；
- ”exceed recall time limit”：消息撤回超时；
- ”not_found msg”：消息过期或已被撤回；
- ”internal error”：后端服务出现异常。

```json
{
  "msgs": [{ "msg_id": "673296835082717140", "recalled": "not_found msg" }]
}
```

消息撤回服务未在环信即时通讯云管理后台开通，返回示例如下：

```json
{
  "error": "forbidden_op",
  "exception": "EasemobForbiddenOpException",
  "timestamp": 1644402553845,
  "duration": 0,
  "error_description": "message recall service is unopened"
}
```

## 服务端单向删除会话

该方法使聊天用户能够从服务器中删除会话。删除会话后，该用户将从服务器获取不到该会话。该会话的其他参与聊天用户仍然可以从服务器获取会话内容。


### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users/{username}/user_channel
```

#### 路径参数

| 参数       | 类型   | 是否必需 | 描述                                      |
| :--------- | :----- | :------- | :---------------------------------------- |
| `username` | String | 是       | 要删除会话的用户的唯一标识符，即用户 ID。 |

其他参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :------------------------ |
| `Authorization` | String | 是       | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### 请求 body

| 参数          | 类型   | 是否必需 | 描述          |
| :------------ | :----- | :------- | :----------------------- |
| `channel`     | String | 是       | 要删除的会话 ID。该参数的值取决于会话类型 `type` 的值:<br/> - `type` 为 `chat`，即单聊时，会话 ID 为对端用户 ID；<br/> - `type` 为 `groupchat`，即群聊时，会话 ID 为群组 ID。 |
| `type`        | String | 是       | 会话类型。<br/> - `chat`：单聊会话；<br/> -`groupchat`：群聊会话。                                                                                                            |
| `delete_roam` | Bool   | 是       | 是否删除服务端消息。<br/> - `true`：是。若删除了该会话的服务端消息，则用户无法从服务器拉取该会话的漫游消息。<br/> - `false`：否。用户仍可以从服务器拉取该会话的漫游消息。     |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述                                                  |
| :------- | :----- | :------------------- |
| `result` | String | 删除结果，`ok` 表示成功，失败则直接返回错误码和原因。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H "Authorization: Bearer <YourAppToken>" "https://XXXX/XXXX/XXXX/users/u1/user_channel" -d '{"channel":"u2", "type":"chat"，"delete_roam": true}'
```

#### 响应示例

```json
{
  "path": "/users/user_channel",
  "uri": "https://XXXX/XXXX/XXXX/users/u1/user_channel",
  "timestamp": 1638440544078,
  "organization": "XXXX",
  "application": "c3624975-XXXX-XXXX-9da2-ee91ed4c5a76",
  "entities": [],
  "action": "delete",
  "data": {
    "result": "ok"
  },
  "duration": 3,
  "applicationName": "XXXX"
}
```

## 导入单聊消息

该接口用于数据迁移时批量导入单聊消息。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/users/import
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :-------------------- |
| `Authorization` | String | 是       | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### 请求 body

| 参数            | 类型   | 是否必需 | 描述  |
| :-------------- | :----- | :------- | :------------------- |
| `from`          | String | 是       | 消息发送方的用户 ID。              |
| `target`        | String | 是       | 消息接收方的用户 ID。        |
| `type`          | String | 是       | 消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `body`          | JSON   | 是       | 消息内容。   |
| `is_ack_read`   | Bool   | 否       | 是否设置消息为已读。<br/> - `true`：是；<br/> - `false`：否。     |
| `msg_timestamp` | Long   | 否       | 要导入的消息的时间戳，单位为毫秒。若不传该参数，环信服务器会将导入的消息的时间戳设置为当前时间。    |
| `need_download` | Bool   | 否       | 是否需要下载附件并上传到服务器。<br/> - `true`：是；<br/> - （默认）`false`：否。        |

与发送消息类似，不同类型的消息只是 `body` 字段内容存在差异。详见 [body 字段说明](#body-字段说明)。

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

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/chatgroups/import
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :----------------- |
| `Authorization` | String | 是       | 该用户或管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### 请求 body

| 参数            | 类型   | 是否必需 | 描述   |
| :-------------- | :----- | :------- | :----------- |
| `from`          | String | 是       | 消息发送方的用户 ID。       |
| `target`        | String | 是       | 群组 ID。  |
| `type`          | String | 是       | 消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `body`          | JSON   | 是       | 消息内容。  |
| `is_ack_read`   | Bool   | 否       | 是否设置消息为已读。<br/> - `true`：是；<br/> - `false`：否。 |
| `msg_timestamp` | Long   | 否       | 要导入的消息的时间戳，单位为毫秒。若不传该参数，环信服务器会将导入的消息的时间戳设置为当前时间。         |
| `need_download` | Bool   | 否       | 是否需要下载附件并上传到服务器。<br/> - `true`：是；<br/> - （默认）`false`：否。     |

:::notice
与发送消息类似，不同类型的消息只是 `body` 字段内容存在差异。详见 [body 字段说明](#body-字段说明)。
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

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H "Authorization: Bearer <YourAppToken> " "https://XXXX/XXXX/XXXX/messages/chatgroups/import" -d '{
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
