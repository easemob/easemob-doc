# 下载群组共享文件

## 功能说明

- 根据指定的群组 ID 与文件 ID（`file_id`）下载群组共享文件。
- 文件 ID 可从 [获取群组共享文件](group_shared_file_obtain.html) 接口的响应中获取。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}
```

| 参数            | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :------- | :------------------ |
| `group_id`           | String   | 是 | 群组 ID。      |
| `file_id`           | String   | 是 | 要下载的群组共享文件的 ID。      |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/b30XXXX4f'  \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

返回上传的文件的内容。例如，上传的文件内容为"Hello world"，响应中返回"Hello world"。

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应体中为上传的文件的内容，例如，上传的文件内容为"Hello world"，响应中返回"Hello world"。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | RestGroupFeignException | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。