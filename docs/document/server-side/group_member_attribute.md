# 群成员属性管理

<Toc />

环信即时通讯 IM 提供了 RESTful API 管理 App 中群组的成员的属性，包括设置和获取单个或多个群成员的属性。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯 IM 管理后台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。
- 群成员的相关限制，详见 [使用限制](limitation.html#群组)。

## 公共参数

#### 请求参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `group_id` | String | 是       | 群组 ID。    |
| `username` | String | 是       | 用户 ID。             |

#### 响应参数

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`             | String | 请求 URL。                                                                     |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                              |
| `entities`        | JSON   | 响应实体。                                                                     |
| `data`            | JSON   | 实际获取的数据详情。                                                           |
| `created`         | Long   | 群组创建时间，Unix 时间戳，单位为毫秒。                                        |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `properties`      | String | 响应属性。                                                                     |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 设置群成员自定义属性

设置群成员的自定义属性（key-value），例如在群组中的昵称和头像等。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/user/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :----------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数       | 类型 | 是否必需 | 描述        |
| :--------- | :--- | :------- | :----------------------------------------- |
| `metaData` | JSON | 是       | 要设置的群成员自定义属性，为 key-value 键值对。对于单个键值对：<br/> - key 表示属性名称，不能超过 16 字节。<br/> - value 表示属性值，不能超过 512 个字节。若 value 设置为空字符串即删除该自定义属性。<Container type="notice" title="注意">单个群成员的自定义属性总长度不能超过 4 KB。</Container> |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                     |
| :----- | :--- | :----------------------- |
| `data` | JSON | 设置的群成员自定义属性。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X PUT 'https://XXXX/XXXX/XXXX/metadata/chatgroup/XXXX/user/XXXX' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "metaData": {
          "key1": "value1"
    }
}'
```

##### 响应示例

```json
{
  "timestamp": 1678674135533,
  "data": {
    "key1": "value1"
  },
  "duration": 53
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | metadata_error | exceeds chatgroup user metadata single key limit | 添加的群成员属性的 key 过长。 | 调整群成员属性 key 的长度。属性 key 不能超过 16 字节。 |
| 400     | metadata_error | exceeds chatgroup user metadata single value limit | 添加的群成员属性的 value 过长。 | 调整群成员属性 value 的长度。value 不能超过 512 个字节。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 批量设置群成员自定义属性

批量设置群成员的自定义属性（key-value），例如，在群组中的昵称和头像等。每次请求最多可为 20 个群成员设置多个属性，而且可对不同群成员设置不同属性。传入相同用户 ID 时，若其属性名称不同，则添加，相同则更新。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/users/batch
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。|
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数       | 类型 | 是否必需 | 描述        |
| :--------- | :--- | :------- | :-------------- |
| `username` | JSON | 是       | 要设置自定义属性的群成员用户 ID，为 key-value 键值对。对于单个键值对：<br/> - key 为固定字段，固定为 `username` 。<br/> - value 填写要设置自定义属性的单个用户 ID，不可为空。 |
| `metadata` | JSON | 是       | 要为该用户设置的群自定义属性，可包含多个 key-value 键值对。对于单个键值对：<br/> - key 为要为该用户设置的属性名称，不能超过 16 字节，且不能为空。<br/> - value 为要设置的属性的值，不能超过 512 个字节。若 value 设置为空字符串则删除该自定义属性。<Container type="tip" title="注意">单个群成员的自定义属性总长度不能超过 4 KB。</Container> |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                     |
| :----- | :--- | :----------------------- |
| `data` | JSON | 设置的群成员自定义属性，包含更新成功和失败的信息。 |
| `updateMetadataFailed` | JSON Array | 失败的更新记录，包含更新失败的用户 ID 和对应的错误信息。 |
| `updateMetadataSucceeded` | JSON Array | 成功的更新记录，包含用户 ID 及其在当前群中的自定义属性。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X PUT 'http://XXXX/XXXX/XXXX/metadata/chatgroup/XXXX/users/batch' \
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

##### 响应示例

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

#### 错误码

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

## 获取单个群成员的所有自定义属性

获取单个群成员的所有自定义属性。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/user/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述           |
| :-------------- | :----- | :------- | :---------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。     |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                     |
| :----- | :--- | :----------------------- |
| `data` | JSON | 获取的群成员自定义属性。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X GET 'https://a1-hsb.easemob.com/easemob-demo/testy/metadata/chatgroup/207059303858177/user/test2' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'
-H 'Authorization: Bearer YWMtozZwfsFFEe2oQTE6aob5eQAAAAAAAAAAAAAAAAAAAAExCXvf5bRGAJBgXNYFJVQ9AQMAAAGG2MUClwBPGgDsI1GYg1QtapTEdGyrm29Eu6L8qx60lDZ9TJRDOQjEsw' \
--data-raw ''
```

##### 响应示例

```json
{
  "timestamp": 1678674211840,
  "data": {
    "key1": "value1"
  },
  "duration": 6
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | MetadataException | user not in group | 用户不在群组内。 | 使用正确的群组成员的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 根据属性 key 获取多个群成员的自定义属性

根据指定的属性 key 获取多个群成员的自定义属性。每次最多可获取 10 个群成员的自定义属性。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/get
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :---------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。     |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数         | 类型       | 是否必需 | 描述                     |
| :----------- | :--------- | :------- | :--------------------------------- |
| `targets`    | JSON Array | 是       | 要获取自定义属性的群成员的用户 ID。一次最多可传 10 个用户 ID。                                |
| `properties` | JSON Array | 是       | 要获取自定义属性的 key 的数组。若该参数设置为空数组或不传，则获取这些群成员的所有自定义属性。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述               |
| :----- | :--- | :------------------ |
| `data` | JSON | 获取的群成员的自定义属性。如下响应示例中的 `test1` 和 `test2` 为自定义属性所属的群成员的用户 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X POST 'https://XXXX/XXXX/XXXX/metadata/chatgroup/XXXX/get'\
-H'Content-Type: application/json'\
-H'Accept: application/json'\
-H'Authorization: Bearer <YourAppToken>'\
-d '{
    "targets":["test1","test2"],
    "properties":["key1","key2"]
}'
```

##### 响应示例

```json
{
  "timestamp": 1678674292783,
  "data": {
    "test1": {
      "key1": "value1"
    },
    "test2": {
      "key1": "value1"
    }
  },
  "duration": 2
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | metadata_error | query param reaches limit. | 批量查询数量达到限制。 | 减少要查询的用户 ID。每次最多可获取 10 个群成员的自定义属性。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

