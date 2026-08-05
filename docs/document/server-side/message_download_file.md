# 下载文件

本文介绍如何调用 RESTful API 从环信服务器下载图片、语音、视频或其他类型的文件。

## 功能说明

- 支持下载图片、语音、视频或其他类型的文件。
- 支持文件访问限制：如果上传文件时设置了文件访问限制（`restrict-access` 设置为 `true`），需要在下载请求头中包含文件上传响应中返回的 `share-secret` 和当前登录用户的 token 才能下载文件。
- [上传文件接口](message_upload_file.html#响应-body-字段) 响应中返回的文件 ID（`file_uuid`）、文件地址（`uri`）和文件访问密钥（`share-secret`）可用于后续构造附件消息及下载附件，详见 [发送附件消息流程](message_single.html#附件消息发送流程) 和 [下载附件](message_download_file.html)。若文件上传时开启了受限访问，即 `restrict-access=true`，则后续无论下载原文件还是缩略图，都需要传入 `share-secret`。

## 调用频率上限

100 次/秒/App Key
  
## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}
```

| 参数        | 类型   | 是否必需 | 描述                      |
| :---------- | :----- | :------- | :------------------------ |
| `file_uuid` | String | 是       | 服务器为文件生成的 UUID。你可以从 [文件上传](message_upload_file.html#响应-body-字段) 接口的响应中获取文件 UUID。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

以下载图片为例：

```bash
# 将 <YourToken> 替换为你的用户 token 或在服务端生成的 App Token 

curl -X GET 'https://XXXX/XXXX/XXXX/chatfiles/7f456bf0-XXXX-XXXX-b630-777db304f26c'-o /Users/test/easemob/image/image.JPG    \
-H 'Accept: application/octet-stream'    \
-H 'Authorization: Bearer <YourToken>'     \
-H 'share-secret: f0Vr-uyyEeiHpHmsu53XXXXXXXXZYgyLkdfsZ4xo2Z0cSBnB' 
```

:::tip
上述请求示例中，`/Users/test/easemob/image/image.JPG` 为环信即时通讯 IM 的本地文件路径，使用时请替换为自己的文件路径，否则会请求失败。
:::

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

| 参数            | 类型   | 是否必需 | 描述           |
| :-------------- | :----- | :------- | :--------------- |
| `share-secret`  | String | 否       | 文件访问密钥。若上传文件时限制了访问，下载该文件时则需要该访问密钥。成功上传文件后，从 [文件上传](message_upload_file.html#响应-body-字段) 的响应 body 中获取该密钥。 |

## 响应示例

```json
{
  //语音/图片文件内容
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功。参数及说明详见 [上传文件](message_upload_file.html)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型               | 错误提示                  | 可能原因    | 处理建议      |
|:---------|:-------------------|:----------------------|:--------|:----------|
| 404      | entity_not_found | file may not exists | 传入的 `file_uuid` 不存在。 | 输入正确的路径参数 `file_uuid`。 |
| 404      | file_expired | file xxxxx is expired | 文件已过期。 | 默认情况下，消息附件，例如图片、音频、视频和其他文件可存储 7 天。若要提升该上限，请联系商务。  |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。