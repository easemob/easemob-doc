# 上传群组共享文件

## 功能说明

- 上传指定群组 ID 的群组共享文件。
- 上传的文件大小不能超过 10 MB。
- 分页获取指定群组 ID 的群组共享文件后，可根据响应中返回的文件 ID（`file_id`）调用 [下载群组共享文件](group_shared_file_download.html) 接口下载该文件，或调用 [删除群组共享文件](group_shared_file_delete.html) 接口删除该文件。
- 上传群组共享文件会触发发送后回调，详见 [群组共享文件上传事件](callback_group_shared_file.html#群组共享文件上传事件)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files
```

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/chatgroups/66021836783617/share_files'   \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'  \
-F file=@/Users/test/image/IMG_3.JPG
```

## 请求 header 参数

| 参数              | 类型   | 是否必需 | 描述            |
| :---------------- | :----- | :------- | :----------------------------- |
| `Content-Type`    | String | 是       | 内容类型。请填 `multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW`。      |
| `file`            | String | 是       | 待上传文件的本地路径。      |

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "post",
  "application": "7fXXXXef",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files",
  "entities": [],
  "data": {
    "file_url": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/c6XXXXc0",
    "group_id": "6XXXX7",
    "file_name": "img_3.jpg",
    "created": 1599050554954,
    "file_id": "c6XXXXc0",
    "file_size": 13512
  },
  "timestamp": 1599050554978,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段             | 类型   | 描述                                                       |
| :--------------- | :----- | :--------------------------------------------------------- |
| `data.file_url`  | String | 群组共享文件的 URL，在环信即时通讯 IM 服务器上保存的地址。 |
| `data.group_id`  | String | 群组 ID。                                                  |
| `data.file_name` | String | 群组共享文件名称。                                         |
| `data.created`   | Long   | 上传群组共享文件的时间。                                   |
| `data.file_id`   | String | 群组共享文件 ID，可以用于下载和删除共享文件。              |
| `data.file_size` | Long   | 群组共享文件大小，单位为字节。                             |

其他字段的描述如下表所示：

| 参数              | 类型   | 描述        |
| :---------------- | :----- | :----------- |
| `action`          | String | 请求方法。   |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。   |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | RestGroupFeignException | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 400     | IllegalArgumentException | file must be provided. | 群共享文件未提供 | 上传群共享文件 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。