# 下载文件缩略图

本文介绍如何调用 RESTful API 下载图片和视频文件的缩略图。

## 功能说明

- 收到图片或视频消息，你可以先下载图片或视频的缩略图，需要时再下载图片或视频原文件。
- 下载缩略图与下载原文件的唯一区别是前者在请求 header 中多了 `thumbnail: true`。当服务器收到包含该字段的请求 header 时，返回缩略图，否则返回原文件。
- [上传文件接口](message_upload_file.html#响应-body-字段) 响应中返回的文件 ID（`file_uuid`）和文件访问密钥（`share-secret`）可用于下载附件，详见 [发送附件消息流程](message_single.html#附件消息发送流程)。若文件上传时开启了受限访问，即 `restrict-access=true`，则后续无论下载原文件还是缩略图，都需要传入 `share-secret`。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}
```

| 参数        | 类型   | 是否必需 | 描述                            |
| :---------- | :----- | :------- | :------------------------------ |
| `file_uuid` | String | 是       | 服务器为缩略图文件生成的 UUID。你可以从 [文件上传](message_upload_file.html#响应-body-字段) 接口的响应中获取文件 UUID。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatfiles/7f456bf0-ecb2-11e8-b630-777db304f26c' \
-H 'Accept: application/octet-stream'   \
-H 'Authorization: Bearer <YourAppToken>'   \
-H 'share-secret: f0Vr-uyyEeiHpHmsu53XXXXXXXXZYgyLkdfsZ4xo2Z0cSBnB'  \
-H 'thumbnail: true' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

| 参数            | 类型   | 是否必需       | 描述       |
| :-------------- | :----- | :--------------------- | :------------------ |
| `thumbnail`     | Bool   | 否      | 是否下载缩略图：<ul><li> `true`：是，下载缩略图。</li><li>（默认）`false`：否，下载原文件。</li></ul> <Container type="notice" title="注意">若该参数为空，下载原文件。</Container> |
| `share-secret`  | String | 否    | 缩略图访问密钥。若上传图片时限制了访问（`restrict-access` 设置为 `true`），下载缩略图时则需要该访问密钥。成功上传图片后，从 [文件上传](message_upload_file.html) 的响应 body 中获取该密钥。 |

## 响应示例

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

## 响应 body 字段

如果返回的 HTTP 状态码为 200，表示请求成功。参数及描述详见 [上传文件](message_upload_file.html)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型               | 错误提示                  | 可能原因    | 处理建议      |
|:---------|:-------------------|:----------------------|:--------|:----------|
| 404      | entity_not_found | file may not exists | 传入的 `file_uuid` 不存在。 | 输入正确的路径参数 `file_uuid`。 |
| 404      | file_expired | file xxxxx is expired | 文件已过期。 | 默认情况下，消息附件，例如图片、音频、视频和其他文件可存储 7 天。若要提升该上限，请联系商务。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。