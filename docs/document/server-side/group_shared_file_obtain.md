# 获取群组共享文件

## 功能说明

- 分页获取指定群组 ID 的群组共享文件。
- 获取文件后，你可以根据响应中返回的文件 ID（`file_id`）调用 [下载群组共享文件](group_shared_file_download.html) 接口下载文件，或调用 [删除群组共享文件](group_shared_file_delete.html) 接口删除文件。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files?pagenum={N}&pagesize={N}
```

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :---------------- |
| `group_id`       | String   | 是 | 群组 ID。        |
| `pagesize` | String | 否       | 每页期望返回的共享文件数。取值范围为 [1,1000]，默认为 `1000`。若传入的值超过 `1000`，返回 1000 个共享文件。  |
| `pagenum`  | Int    | 否       | 当前页码。默认从第 1 页开始获取。                              |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files?pagenum=1&pagesize=10'  \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "get",
  "application": "8bXXXX02",
  "params": {
    "pagesize": ["10"],
    "pagenum": ["1"]
  },
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files",
  "entities": [],
  "data": [
    {
      "file_id": "dbd88d20-e1d4-11ea-95fc-638fc2d59a8d",
      "file_name": "159781149272586.jpg",
      "file_owner": "u1",
      "file_size": 326127,
      "created": 1597811492594
    },
    {
      "file_id": "b30XXXX4f",
      "file_name": "159781141836993.jpg",
      "file_owner": "u1",
      "file_size": 326127,
      "created": 1597811424158
    }
  ],
  "timestamp": 1542363546590,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段的说明如下表所示：

| 字段              | 类型   | 描述                                                    |
| :---------------- | :----- | :------------------------------------------------------ |
| `data` | JSON Array | 响应数据。 |
|  - `file_id`    | String | 群组共享文件的 ID，若要下载或删除该文件需要使用该参数。 |
|  - `file_name`  | String | 群组共享文件名称。                                      |
|  - `file_owner` | String | 上传群组共享文件的用户 ID。                             |
|  - `file_size`  | Long   | 群组共享文件大小，单位为字节。                          |
|  - `created`    | Long   | 上传群组共享文件的时间。                                |

其他字段的描述如下表所示：

| 字段              | 类型   | 描述                                                    |
| :---------------- | :----- | :------------------------------------------------------ |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `params`     | JSON | 查询参数。                     |
| `params.pagesize`     | JSON | 本次请求返回的共享文件数。                   |
| `params.pagenum`     | JSON | 当前页码。                     |
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

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。