# 上传和下载文件

<Toc />

对于附件类型的消息，如图片、语音、视频或其他类型文件，发送消息前需上传文件。你可以将文件上传到自己的服务器，也可以上传至环信服务器。若你将文件上传至自己的服务器，需注意以下两点：

- 对于图片，发送图片消息时不存在图片缩略图。这是因为图片上传至环信服务器时，环信服务器会自动生成缩略图，发送图片消息时无需传入缩略图 URL 地址。
- 对于视频，你需要将视频和缩略图均上传至你的服务器，发送视频消息时需传入这两个文件的 URL 地址。

本文介绍如何调用 RESTful API 将文件上传到环信服务器、下载图片、语音、视频或其他类型的文件以及下载图片和视频文件的缩略图。

## 前提条件

要调用环信即时通讯 REST API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数 

### 请求参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

### 响应参数

| 参数              | 类型   | 描述          |
| :---------------- | :----- | :------------------------------- |
| `action`          | String | 请求方法。        |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。     |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`             | String | 请求 URL。      |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。  |
| `entities`        | JSON | 响应实体。  |
| `timestamp`       | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。  |
| `duration`        | Int    | 从发送 HTTP 请求到响应的时长，单位为毫秒。   |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文涉及的所有消息管理 REST API 都需要使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 上传文件

对于附件类型的消息，如图片、语音、视频或其他类型文件，发送消息前需上传文件。图片和视频存在缩略图，文件上传详情如下：

- 图片：可调用文件上传接口上传原图，环信服务器会自动为图片生成缩略图。若上传的图片在 10 KB 以内，缩略图与原图等同；若图片超过 10 KB，环信服务器会根据你在请求中设置的图片高度和宽度，即 `thumbnail-height` 和 `thumbnail-width` 参数，生成缩略图。若这两个参数未传，则图片的高度和宽度均默认为 170 像素。
- 视频：环信服务器不会自动为视频文件生成缩略图。若需要视频缩略图，需先调用文件上传接口上传缩略图。然后，再次调用文件上传接口上传视频源文件。上传视频文件时，无需传 `thumbnail-height` 和 `thumbnail-width` 参数。上传视频缩略图时，若图片在 10 KB 以内，视频缩略图即为上传的图片。如果图片超过 10 KB，而且设置了这两个参数，视频缩略图的高度和宽度取决于这两个参数的设置。若这两个参数未传，则图片的高度和宽度均默认为 170 像素。

同时，为了保证聊天文件的安全，我们的 API 保证了以下几点：

- 上传文件的大小不能超过 10 MB，超过会上传失败。
- 支持对上传的文件限制访问。要使用该功能，请联系商务开通。该功能开启后，你需要从文件上传响应中返回的 `share-secret` 通过密钥才能下载被限制访问的文件。消息回调（包含发送前回调和发送后回调）和获取历史消息涉及下载文件时，都需要在下载 URL 中拼接密钥，才能正常下载文件，拼接规则为：`{{url}}?share-secret={{secret}}`。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatfiles
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数              | 类型   | 是否必需 | 描述      |
| :---------------- | :----- | :------- | :------------------------ |
| `Content-Type`    | String | 否       | 内容类型： `multipart/form-data`。上传文件会自动填充该请求头。  |
| `Authorization`   | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |
| `restrict-access` | Bool   | 否       | 是否限制访问该文件：<br/> - `true`：是。用户需要通过响应 body 中获取的文件访问密钥（`share-secret`）才能下载该文件。<br/> - `false`：否。表示不限制访问。用户可以直接下载该文件。<br/><Container type="tip" title="提示">要使用文件访问限制功能，请联系商务开通。</Container>|

#### 请求 body

| 参数               | 类型   | 是否必需 | 描述        |
| :----------------- | :----- | :------- | :--------------- |
| `file`             | String | 是       | 文件本地路径。    |
| `thumbnail-height` | Int    | 否       | 缩略图的高度，单位为像素。<br/> - 若上传的原图或视频缩略图小于 10 KB，上传的图片即为缩略图。<br/> - 若上传的图片超过 10 KB，缩略图的高度取决于该参数的设置。<br/> - 若不传该参数，缩略图的高度默认为 170 像素。你也可以在 [环信即时通讯控制台](https://console.easemob.com/user/login)的 `服务概览` 页面的 `设置` 区域修改该默认值。 |
| `thumbnail-width`  | Int    | 否       | 缩略图的宽度，单位为像素。<br/> - 若上传的原图或视频缩略图小于 10 KB，图片原图即为缩略图。<br/> - 若上传的图片超过 10 KB，缩略图的宽度取决于该参数的设置。<br/> - 若不传该参数，缩略图的宽度默认为 170 像素。你也可以在 [环信即时通讯控制台](https://console.easemob.com/user/login)的 `服务概览` 页面的 `设置` 区域修改该默认值。   |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                    | 类型   | 描述         |
| :---------------------- | :----- | :------------------ |
| `entities`       | JSON Array | 响应数据。                          |
|  - `uuid`         | String | 文件 ID，即时通讯服务分配给该文件的唯一标识符。该参数在发送消息时需用到。  |
|  - `type` | String | 文件类型，为固定值 `chatfile`。   |
|  - `share-secret` | String | 文件访问密钥。你需要自行保存 `share-secret`，以便 [下载文件](#下载文件)时使用。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token，将 file 的路径替换为待上传文件所在的本地完整路径
curl -X POST 'https://XXXX/XXXX/XXXX/chatfiles'  \
-H 'Authorization: Bearer <YourAppToken>'   \
-H 'Content-Type: multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW'   \
-H 'restrict-access: true'   \
-F 'file="@/Users/test/9.2/easemob/image/IMG_2953.JPG"'
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

:::tip
如果上传文件时设置了文件访问限制（`restrict-access` 设置为 `true`），需要在下载请求头中包含文件上传响应中返回的 `share-secret` 和当前登录用户的 token 才能下载文件。
:::

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}
```

#### 路径参数

| 参数        | 类型   | 是否必需 | 描述                      |
| :---------- | :----- | :------- | :------------------------ |
| `file_uuid` | String | 是       | 服务器为文件生成的 UUID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述           |
| :-------------- | :----- | :------- | :--------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/octet-stream`，表示下载二进制数据流格式的文件。   |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。     |
| `share-secret`  | String | 否       | 文件访问密钥。若上传文件时限制了访问，下载该文件时则需要该访问密钥。成功上传文件后，从 [文件上传](#上传文件) 的响应 body 中获取该密钥。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功。参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

以下载图片为例：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/octet-stream' -H 'Authorization: Bearer <YourAppToken>' -H 'share-secret: f0Vr-uyyEeiHpHmsu53XXXXXXXXZYgyLkdfsZ4xo2Z0cSBnB' 'https://XXXX/XXXX/XXXX/chatfiles/7f456bf0-XXXX-XXXX-b630-777db304f26c'-o /Users/test/easemob/image/image.JPG
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

收到图片或视频消息，你可以先下载图片或视频的缩略图，需要时再下载图片或视频原文件。下载缩略图与下载原文件的唯一区别是前者在请求 header 中多了 `thumbnail: true`。当服务器收到包含该字段的请求 header 时，返回缩略图，否则返回原文件。

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

| 参数            | 类型   | 是否必需       | 描述       |
| :-------------- | :----- | :--------------------- | :------------------ |
| `Accept`        | String | 是      | 内容类型。请填 `application/octet-stream`，表示下载二进制数据流格式的文件。        |
| `Authorization` | String | 是      | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。                                                        |
| `thumbnail`     | Bool   | 否      | 是否下载缩略图：<ul><li> `true`：是，下载缩略图。</li><li>`false`：否，下载原文件。</li></ul> <Container type="notice" title="注意">若该参数为空，下载原文件。</Container> |
| `share-secret`  | String | 否    | 缩略图访问密钥。若上传图片时限制了访问（`restrict-access` 设置为 `true`），下载缩略图时则需要该访问密钥。成功上传图片后，从 [文件上传](#上传文件) 的响应 body 中获取该密钥。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 200，表示请求成功。参数及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/octet-stream' -H 'Authorization: Bearer <YourAppToken>' -H 'share-secret: f0Vr-uyyEeiHpHmsu53XXXXXXXXZYgyLkdfsZ4xo2Z0cSBnB' -H 'thumbnail: true' 'https://XXXX/XXXX/XXXX/chatfiles/7f456bf0-ecb2-11e8-b630-777db304f26c'
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