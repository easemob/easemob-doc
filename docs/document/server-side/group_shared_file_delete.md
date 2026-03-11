# 删除群组共享文件

## 功能说明

- 根据指定的群组 ID 与 文件 ID（`file_id`）删除群组共享文件。
- 文件 ID 可从 [获取群组共享文件](group_shared_file_download.html) 接口的响应中获取。
- 删除群组共享文件会触发发送后回调，详见 [群组共享文件删除事件](callback_group_shared_file.html#群组共享文件删除事件)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}
```

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/b30XXXX4f'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
```

## 请求 Header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 Header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/b30XXXX4f",
  "entities": [],
  "data": {
    "group_id": "6XXXX7",
    "file_id": "b30XXXX4f",
    "result": true
  },
  "timestamp": 1599049350114,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段的说明如下表所示：

| 字段            | 类型   | 描述         |
| :-------------- | :----- | :-------------------- |
| `data.group_id` | String | 群组 ID。                                                                     |
| `data.file_id`  | String | 群组共享文件 ID。在下载共享文件时需提供该参数。                               |
| `data.result`   | Bool   | 删除群组共享文件的结果：<br/> - `true`：删除成功；<br/> - `false`：删除失败。 |

其他字段的描述如下表所示：

| 字段              | 类型   | 描述                                                    |
| :---------------- | :----- | :------------------------------------------------------ |
| `action`          | String | 请求方法。       |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `uri`             | String | 请求 URL。            |
| `entities`        | JSON Array   | 响应实体。      |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。    |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | RestGroupFeignException | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。