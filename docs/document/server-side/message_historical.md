# 获取历史消息记录

<Toc />

你可以从服务端获取用户发送的历史消息的记录。

- 单次请求获取从指定起始时间开始一小时内的发送的历史消息记录。
- 你最多可以获取最近 3 天的历史消息记录。若要提升该限制，你需要联系环信商务。
- 查询历史消息记录时存在一定延时，无法实时获取。

## 前提条件

要调用环信即时通讯 REST API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述      |
| :--------- | :----- | :------- | :------------- |
| `host`  | String | 是  | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是   | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `app_name` | String | 是   | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。|

### 响应参数

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`             | String | 请求 URL。                                                                     |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                              |
| `timestamp`       | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。                                          |
| `duration`        | Int    | 从发送 HTTP 请求到响应的时长，单位为毫秒。                                     |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本篇涉及的所有消息管理 REST API 都需要使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatmessages/{time}
```

### 路径参数

| 参数   | 类型   | 是否必需 | 描述         |
| :----- | :----- | :------- | :------------- |
| `time` | String | 是       | 历史消息记录查询的起始时间。UTC 时间，使用 ISO8601 标准，格式为 yyyyMMddHH。例如 `time` 为 `2018112717`，则表示查询 2018 年 11 月 27 日 17 时至 2018 年 11 月 27 日 18 时期间的历史消息。若海外集群为 UTC 时区，需要根据自己所在的时区进行时间转换。 |

其他参数及描述详见 [公共参数](#公共参数)。

### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------------ |
| `Accept`        | String | 是       | 内容类型，请填 `application/json`。       |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数       | 类型   | 描述     |
| :--------- | :----- | :------------------ |
| `data`  | JSON   | 实际获取的数据详情。  |
| `data.url` | String | 历史消息记录的下载地址。该 URL 由历史消息记录的存储地址、到期 Unix 时间戳（`Expires`，单位为秒）、第三方云存储访问密钥（`OSSAccessKeyId`）和第三方云存储验证签名（`Signature`）组成。URL 仅在一定时间内有效，请及时通过 URL 下载聊天记录文件，URL 过期后会下载失败，需要重新调用该接口获取新的 URL。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatmessages/2018112717'
```

### 响应示例

```json
{
  "action": "get",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "uri": "'https://XXXX/XXXX/XXXX/chatmessages/2018112717",
  "data": [
    {
      "url": "https://XXXX?Expires=1543316122&OSSAccessKeyId=XXXX&Signature=XXXX"
    }
  ],
  "timestamp": 1543314322601,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 历史消息记录的内容

查询历史消息记录成功后，你可以访问 URL 下载历史消息记录文件，查看历史消息记录的具体内容。

一条历史消息记录包含以下字段：

| 参数        | 类型   | 描述              |
| :---------- | :----- | :---------------------- |
| `msg_id`    | String | 消息 ID。       |
| `timestamp` | Long   | 消息发送完成的 UNIX 时间戳，单位为毫秒，UTC 时间。         |
| `direction` | String | 消息方向，值为 `outgoing`，即当前用户发送的消息。 |
| `chat_type` | String | 会话类型：<br/> - `chat`: 单聊；<br/> - `groupchat`: 群聊；<br/> - `chatroom`: 聊天室。 |
| `payload`   | JSON   | 消息的具体内容。例如，消息扩展信息等。   |
| `payload.from`      | String | 消息发送方的用户 ID。       |
| `payload.to`        | String | 消息接收方：<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。  |

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

### 文本消息

文本消息的 bodies 包含如下字段：

| 参数   | 类型   | 描述                             |
| :----- | :----- | :------------------------------- |
| `msg`  | String | 消息内容。                       |
| `type` | String | 消息类型，文本消息类型为 `txt`。 |

示例

```json
"bodies": [{"msg":"welcome to easemob!", "type":"txt"}]
```

### 图片消息

图片消息的 bodies 包含如下字段：

| 参数          | 类型   | 描述                                                                              |
| :------------ | :----- | :-------------------------------------------------------------------------------- |
| `file_length` | Long   | 图片附件大小，单位为字节。                                                        |
| `filename`    | String | 图片文件名称，包含文件后缀名。                                                    |
| `secret`      | String | 图片文件访问密钥。如果 [文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。 |
| `size`        | JSON   | 图片的尺寸。单位为像素。<br/> - `height`：图片高度。<br/> - `width`：图片宽度。   |
| `type`        | String | 消息类型。图片消息为 `img`。                                                      |
| `url`         | String | 图片 URL 地址。                                                                   |

示例

```json
{
  "bodies": [
    {
      "file_length": 128827,
      "filename": "test1.jpg",
      "secret": "DRGM8OZrEeO1vaXXXXXXXXHBeKlIhDp0GCnFu54xOF3M6KLr",
      "size": {
        "height": 1325,
        "width": 746
      },
      "type": "img",
      "url": "https://XXXX/XXXX/chatdemoui/chatfiles/65e54a4a-XXXX-XXXX-b821-ebde7b50cc4b"
    }
  ]
}
```

### 位置消息

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

### 语音消息

语音消息的 bodies 包含如下字段：

| 参数          | 类型   | 描述                                                                              |
| :------------ | :----- | :------------------------------------------ |
| `file_length` | Long   | 语音附件大小。单位为字节。                                                        |
| `filename`    | String | 语音文件名称，包含文件后缀名。                                                    |
| `secret`      | String | 语音文件访问密钥。如果 [文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。 |
| `length`      | Int    | 语音时长。单位为秒。                                                              |
| `type`        | String | 消息类型。语音消息为 `audio`。                                                    |
| `url`         | String | 语音文件的 URL 地址。                                                             |

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

### 视频消息

视频消息的 bodies 包含如下字段：

| 参数           | 类型   | 描述                |
| :------------- | :----- | :--------------------------------- |
| `file_length`  | Long   | 视频附件大小。单位为字节。           |
| `filename`     | String | 视频文件名称，包含文件后缀名。             |
| `secret`       | String | 视频文件的访问密钥。如果 [文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。     |
| `length`       | Int    | 视频时长。单位为秒。                          |
| `size`         | JSON   | 视频缩略图尺寸。单位为像素。<br/> - `width`：视频缩略图的宽度；<br/> - `height`：视频缩略图的高度。    |
| `thumb`        | String | 视频缩略图的 URL 地址，格式为 https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}。其中，`file_uuid` 为视频缩略图上传后，环信服务器返回的缩略图的 UUID。 |
| `thumb_secret` | String | 缩略图文件访问密钥。如果文件上传时设置了文件访问限制，则该字段存在。          |
| `type`         | String | 消息类型。视频消息为 `video`。                                        |
| `url`          | String | 视频文件的 URL 地址。              |

示例如下：

```json
"bodies": 
[   
 {
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

### 文件消息

文件消息的 bodies 包含如下字段：

| 参数          | 类型   | 描述                                                                          |
| :------------ | :----- | :---------------------------------------------------------------------------- |
| `file_length` | Long   | 文件大小。单位为字节。                                                        |
| `filename`    | String | 文件名称，包含文件后缀名。                                                    |
| `secret`      | String | 文件访问密钥。如果 [文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。 |
| `type`        | String | 消息类型。文件消息为 `file`。                                                 |
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

### 透传消息

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

### 自定义消息

自定义消息的 bodies 包含如下字段：

| 参数          | 类型   | 描述                                             |
| :------------ | :----- | :----------------------------------------------- |
| `customExts`/`v2:customExts`  | Array/JSON     | 用户自定义的事件属性。该参数为可选，不需要可以不传。<br/> - `customExts` 为旧版参数，数组类型，最多可包含 16 个元素。<br/> - `v2:customExts` 为新版参数，Map<String,String> 类型，最多可以包含 16 个元素。推荐使用该新版参数。 |
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

### 合并消息

合并消息的 bodies 包含如下字段：

| 参数          | 类型   | 描述                                             |
| :------------ | :----- | :----------------------------------------------- |
| `combineLevel`  | Int   | 合并消息的嵌套层级数。 |
| `file_length` | Int | 合并消息附件的大小，单位为字节。               |
| `filename`        | String | 合并消息的附件名称。     |
| `secret`        | String | 合并消息附件的访问密钥。如果[文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。  |
| `subType`        | String | 表示消息类型为合并消息。                |
| `summary`        | String | 合并消息的概要。                |
| `title`        | String | 合并消息的标题。                |
| `url`        | String | 合并消息的附件的 URL 地址。你可以访问该 URL 下载该附件。                |

例如，下面示例为源消息包括文本、图片和文件消息的合并消息格式：

```json
"bodies": 
[
   {
      "combineLevel": 1,
      "file_length": 550,
      "filename": "17289718748990036",
      "secret": "a_OTmoq6Ee-CygH0PRzcUyFniZDmSsX1ur0j-9RtCj3tK6Gr",
      "subType": "sub_combine",
      "summary": ":yyuu\n:[图片]\n:[文件]\n",
      "title": "聊天记录",
      "url": "https://XXXX/XXXX/XXXX/chatfiles/6bf39390-8aba-11ef-a8ae-6f545c50ca23"
    }
]
```



## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型   | 错误提示      | 可能原因    | 处理建议   |
|:---------|:-------------------|:--------------------|:---------|:--------------|
| 400      | illegal_argument | illegal arguments: appkey: XXXX#XXXX, time: xxxxxx | 请求参数 `time` 格式不正确。  | 输入正确的请求参数 `time`:UTC 时间，使用 ISO8601 标准，格式为 yyyyMMddHH。例如 time 为 2018112717，则表示查询 2018 年 11 月 27 日 17 时至 2018 年 11 月 27 日 18 时期间的历史消息。若海外集群为 UTC 时区，需要根据自己所在的时区进行时间转换。 |
| 400      | illegal_argument | illegal arguments: appkey: XXXX#XXXX, time: xxxxxx, maybe chat message history is expired or unstored" | `time` 对应时间段内的历史文件已过期或者暂未存储。消息的保留时间取决于产品套餐，详见[消息存储时长限制](limitation.html#消息存储时长限制)。 | 输入正确的请求参数 `time`。 |
| 404      | storage_object_not_found | Failed to find chat message history download url for appkey: XXXX#XXXX, time: xxxxxx" | 对应 `time` 对应时间段内不存在历史文件。      | 如果确定设置的时间内有历史消息，请联系[环信技术支持](mailto:support@easemob.com)。 |

