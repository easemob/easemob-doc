# 上传文件

本文介绍如何调用 RESTful API 将消息附件上传到环信服务器。

## 功能说明

- 对于附件类型的消息，如图片、语音、视频或其他类型文件，发送消息前需上传文件，可上传到自己的服务器或环信服务器。
- 上传响应返回的文件 ID（`file_uuid`）、文件地址（`uri`）和文件访问密钥（`share-secret`）可用于后续构造附件消息及下载附件，详见 [发送附件消息流程](message_single.html#附件消息发送流程) 和 [下载附件](message_download_file.html)。

#### 图片上传说明

- 上传图片原图后，环信服务器会自动生成缩略图。
- 若上传图片在 10 KB 以内，缩略图与原图相同。
- 若图片超过 10 KB，环信服务器会根据请求中设置的图片高度和宽度，即 `thumbnail-height` 和 `thumbnail-width` 参数，生成缩略图。若这两个参数未传，则缩略图默认宽高均默认为 170 像素。

#### 视频上传说明

- 环信服务器不会自动为视频文件生成缩略图。你需要上传视频源文件和视频缩略图（若需要的话）。
- 上传视频文件时，无需传 `thumbnail-height` 和 `thumbnail-width` 参数。
- 上传视频缩略图时，若图片在 10 KB 以内，则缩略图即为上传图片本身。
- 若上传的视频缩略图超过 10 KB，则环信服务器会根据 `thumbnail-height` 和 `thumbnail-width` 参数生成缩略图；若未传这两个参数，则默认宽高均为 170 像素。

#### 其他文件上传说明

- 语音文件和其他类型文件均支持上传。
- 对于语音文件和其他普通文件，服务端不会生成缩略图，也无需传 `thumbnail-height` 和 `thumbnail-width` 参数。

#### 文件限制

- 上传文件的大小默认不能超过 10 MB，超过会上传失败。
- **支持文件限制访问。要使用该功能，请联系商务开通。** 该功能开启后，你需要从文件上传响应中返回的 `share-secret` 通过密钥才能下载受限文件。消息回调（包含发送前回调和发送后回调）和获取历史消息涉及下载文件时，都需要在下载 URL 中拼接密钥，拼接规则为：`{{url}}?share-secret={{secret}}`。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatfiles
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

下面以上传图片为例。上传视频、语音或其他类型文件时，部分请求参数和处理方式有所不同，详见 [功能说明](#功能说明)。

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token，将 file 的路径替换为待上传文件所在的本地完整路径
curl -X POST 'https://XXXX/XXXX/XXXX/chatfiles'  \
-H 'Authorization: Bearer <YourAppToken>'   \
-H 'Content-Type: multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW'   \
-H 'restrict-access: true'   \
-H 'thumbnail-height: 180' \
-H 'thumbnail-width: 180' \
-F 'file="@/Users/test/9.2/easemob/image/IMG_2953.JPG"'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

| 参数              | 类型   | 是否必需 | 描述      |
| :---------------- | :----- | :------- | :------------------------ |
| `restrict-access` | Bool   | 否       | 是否限制访问该文件：<br/> - `true`：是。用户需要通过响应 body 中获取的文件访问密钥（`share-secret`）才能下载该文件。<br/> - `false`：否。表示不限制访问。用户可以直接下载该文件。<br/><Container type="tip" title="提示">要使用文件访问限制功能，请联系商务开通。</Container>|
| `thumbnail-height` | Int    | 否       | 缩略图的高度，单位为像素。<br/> - 若上传的原图或视频缩略图小于 10 KB，上传的图片即为缩略图。<br/> - 若上传的图片超过 10 KB，缩略图的高度取决于该参数的设置。<br/> - 若不传该参数，缩略图的高度默认为 170 像素。你也可以在 [环信控制台](https://console.easemob.com/user/login)的 **功能配置 > 基础功能** > **消息** 页面修改该默认值。 |
| `thumbnail-width`  | Int    | 否       | 缩略图的宽度，单位为像素。<br/> - 若上传的原图或视频缩略图小于 10 KB，图片原图即为缩略图。<br/> - 若上传的图片超过 10 KB，缩略图的宽度取决于该参数的设置。<br/> - 若不传该参数，缩略图的宽度默认为 170 像素。你也可以在 [环信控制台](https://console.easemob.com/user/login)的 **功能配置 > 基础功能** > **消息** 页面修改该默认值。   |

## 请求 body 参数

| 参数               | 类型   | 是否必需 | 描述        |
| :----------------- | :----- | :------- | :--------------- |
| `file`             | String | 是       | 文件本地路径。    |

## 响应示例

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

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                    | 类型   | 描述         |
| :---------------------- | :----- | :------------------ |
| `entities`       | JSON Array | 响应数据。                          |
|  - `uuid`         | String | 文件 ID，即时通讯服务分配给该文件的唯一标识符。该参数在以下场景中会用到：<br/> - [发送附件消息](message_single.html#附件消息发送流程)<br/> - [下载消息附件](message_download_file.html)<br/> -  [下载消息的缩略图](message_download_thumbnail.html)。  |
|  - `type` | String | 文件类型，为固定值 `chatfile`。   |
|  - `share-secret` | String | 文件访问密钥。你需要自行保存 `share-secret`，以便 [下载文件](message_download_file.html)时使用。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `uri`             | String | 文件地址。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示          | 可能原因          | 处理建议        |
|:---------|:-------------------|:---------------|:--------------|:------------|
| 400      | illegal_argument | file must be provided.   | 未传入请求参数 `file`。   | 输入正确的请求参数 `file`。 |
| 413      | file exceeding maximum limit | the file size exceeds the maximum limit.    | 上传文件的大小超出最大限制。 | 输入正确大小的 `file`。默认情况下，消息附件，例如图片、音频、视频和其他文件默认不能超过 10 MB。若要提升该上限，请联系商务。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。