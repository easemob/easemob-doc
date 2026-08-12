# 批量设置群成员自定义属性

## 功能说明

- 批量设置群成员的自定义属性（key-value），例如，在群组中的昵称和头像等。
- 每次请求最多可为 20 个群成员设置多个属性，而且可对不同群成员设置不同属性。
- 传入相同用户 ID 时，若其属性名称不同，则添加，相同则更新。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/users/batch
```

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  是       | 群组 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X PUT 'https://XXXX/XXXX/XXXX/metadata/chatgroup/XXXX/users/batch' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '[
    {
        "username": "user1",
        "metadata": {
            "metadataKey1": "value1",
            "metadataKey2": "value2"
        }
    },
    {
        "username": "user2",
        "metadata": {
            "metadataKey3": "value3",
            "metadataKey4": ""
        }
    }
]'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数       | 类型 | 是否必需 | 描述        |
| :--------- | :--- | :------- | :-------------- |
| `username` | JSON | 是       | 要设置自定义属性的群成员用户 ID，为 key-value 键值对。对于单个键值对：<br/> - key 为固定字段，固定为 `username` 。<br/> - value 填写要设置自定义属性的单个用户 ID，不可为空。 |
| `metadata` | JSON | 是       | 要为该用户设置的群自定义属性，可包含多个 key-value 键值对。对于单个键值对：<br/> - key 为要为该用户设置的属性名称，不能超过 16 字节，且不能为空。<br/> - value 为要设置的属性的值，不能超过 512 个字节。若 value 设置为空字符串则删除该自定义属性。<Container type="tip" title="注意">单个群成员的自定义属性总长度不能超过 4 KB。</Container> |

## 响应示例

```json
{
    "timestamp": 1727593257722,
    "data": {
        "updateMetadataFailed:": [],
        "updateMetadataSucceeded:": [
            {
                "username": "user1",
                "metadata": {
                    "metadataKey1": "value1",
                    "metadataKey2": "value2"
                }
            },
            {
                "username": "user2",
                "metadata": {
                    "metadataKey3": "value3"
                }
            }
        ]
    },
    "duration": 483
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                     |
| :----- | :--- | :----------------------- |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `data` | JSON | 设置的群成员自定义属性，包含更新成功和失败的信息。 |
| `data.updateMetadataFailed` | JSON Array | 失败的更新记录，包含更新失败的用户 ID 和对应的错误信息。 |
| `data.updateMetadataSucceeded` | JSON Array | 成功的更新记录，包含用户 ID 及其在当前群中的自定义属性。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | metadata_error | exceeds chatgroup user metadata single key limit | 添加的群成员属性的 key 过长。 | 调整群成员属性名称的长度。属性 key 不能超过 16 字节。 |
| 400     | metadata_error | exceeds chatgroup user metadata single value limit | 添加的群成员属性的 value 过长。 | 调整群成员属性值的长度。属性 value 不能超过 512 个字节。 |
| 400     | metadata_error | Some users are not in the group: user99 | 部分用户不在群内 | 验证返回的用户是否在群内，如不在群内，请先添加至群聊或从请求中移除。 |
| 400     | metadata_error | exceeds chatgroup metadata batch put users limit | 批量修改的群成员数量达到上限。 | 调整批量设置自定义属性的群成员数量，单次请求修改不能超过 20 个群成员。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | metadata_error | chatgroup user metadata service not allow | 自定义群成员属性功能未开通。 | 请联系商务开通。 |
| 404     | metadata_error | group not exists | 群聊不存在。 | 请检查请求中的group_id 是否存在。 |
| 409     | metadata_error | Failed to operate user metadata. Concurrent operation not allowed | 对相同用户并发请求操作其 metadata | 由于该接口为批量接口，尽量避免对相同用户并发操作的使用场景，可以通过一次性传入用户所需的全部 metadata 进行设置。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
