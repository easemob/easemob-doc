# 设置指定消息附件的存储方式 

## 功能说明

- 支持对用户指定的消息附件设置存储方式，可延长存储时间或实现永久存储。
- 支持通过客户端和 RESTful API 发送图片、语音、视频、文件消息和合并消息时上传的附件（包括图片和视频的缩略图）。
- 对于永久存储的消息附件，用户可以随时获取这些附件。
- 关于消息附件存储时间限制，详见 [消息附件存储文档](/product/message_store.html#历史消息存储)。
- 若使用该接口，需 **联系环信商务开通**。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/users/{username}/chatfiles/lifetime
```

| 参数     | 类型   | 是否必需 | 描述                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `username`  | String    |  是       | 用户 ID。 对该用户指定的消息附件设置存储方式 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourUserToken> 替换为你的用户 Token
curl -X PUT "https://localhost/{org}/{app}/users/{username}/chatfiles/lifetime" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <YourUserToken>" \
-d '{
          "lifetime": "default",
          "chatfile_ids": [
            "2fe7f0b0-0b55-XXXX-XXXX-231441e42458"
          ]
    }'
```

## 请求 Header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。
    
## 请求 body 参数

| 参数       | 类型   | 是否必需 | 描述          |
| :--------- | :----- | :------- | :-------------------------------------------- |
| `lifetime`      | String   | 是 | 消息附件保存时间：<br/> - （默认）`default`：配置的消息附件的默认有效期；<br/> - `refresh`：刷新消息附件的有效期，相当于重新设置存储时间，延长了存储时长。例如，消息附件可存储 7 天，在存储的第五天时调用了该接口，即将附件的存储时间设置为 7 天，则附件的剩余存储时间为 7 天。该设置可用于延长合并消息的附件存储时间，例如，发送合并消息时，原始图片的存储时间只剩余 1 天，调用该接口时利用该设置可将存储时间延长。<br/> - `forever`：永久有效。 |
| `chatfile_ids`      | Array   | 是 | 消息附件的文件 UUID，最多可传入 100 个。 | 

## 响应示例

```json
{
  "path": "/users/test/chatfiles/lifetime",
  "uri": "https://XXXX/XXXX/XXXX/users/test/chatfiles/lifetime",
  "timestamp": 1731382587142,
  "organization": "XXXX",
  "application": "2a8f5b13-XXXX-XXXX-958a-838fd47f1223",
  "action": "put",
  "data": {
      "359f9c50-XXXX-XXXX-92cd-07eff71e8a37": "success"
  },
  "duration": 102,
  "applicationName": "XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 参数                 | 类型   | 描述            |
| :------------------- | :----- | :-------------------------------------------- |
| `data`               | JSON   | 是否成功设置消息附件的存储：<br/> - `success`：成功；<br/> - `failed`：失败。 |

响应包体中的其他字段的说明如下：

| 参数                 | 类型   | 描述            |
| :------------------- | :----- | :-------------------------------------------- |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`                | String | 请求 URL。                |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。       |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。          |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。          |
| `action`             | String | 请求方法。                                   |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。     |
| `applicationName`    | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。    |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码)了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 403                 | forbidden_op        |                 | 设置消息附件存储的功能未开通。          | 联系环信商务开通该功能。          |
| 400                 | illegal_argument   | chatfile_ids size is too large    | 请求中传入的消息附件的文件 ID `chatfile_ids` 超过了上限 100.  | 消息附件的文件 ID 最多可传 100 个。|
| 400               | illegal_argument   |  lifetime must be either 'forever' or 'default' or 'refresh'。     | 消息附件保存时间 `lifetime` 传入了 `forever`、`default` 或 `refresh` 之外的值。       | 消息附件保存时间 `lifetime` 只能设置为 `forever`、`default` 或 `refresh`，不能传入其他值。          |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。
