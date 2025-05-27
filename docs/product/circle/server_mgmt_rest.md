# 管理社区及其成员

<Toc />

社区（Server）是一群有着共同兴趣爱好的人的专属天地，也可以是同学朋友的社交圈子。社区是环信圈子三层基础架构的最上层，各种消息事件均发生在社区内。社区分为公开社区和私密社区。用户可查询公开社区列表，但无法查询私密社区列表。

**超级社区中的频道基于即时通讯 IM 的群组或聊天室（频道 ID 为群组 ID 或聊天室 ID）创建，解散群组或聊天室时需注意以下几点：**

**1. 在环信控制台或者调用 RESTful API 解散群组或聊天室、群组或聊天室加人、踢人等操作时请谨慎操作，需确保操作的群组或者聊天室不是超级社区使用的。**
**2. 如果将超级社区使用的频道对应的群组或者聊天室删除，会出现数据不一致情况，导致用户加入不了社区、频道、在频道内发不了消息等情况发生。**
**3. 在清理群组或者聊天室数据时，需先确认要删除的群组 ID 或聊天室 ID 与超级社区的频道 ID 是否一致。你可以调用[获取频道详情 API](https://docs-im.easemob.com/ccim/circle/rest/channelapi#查询指定频道详情) 确认要删除的群组或聊天室是否为超级社区的频道。如果是，请不要进行删除。**
**4. 如果需要清理超级社区数据，调用[删除社区](https://docs-im.easemob.com/ccim/circle/rest/serverapi#删除社区)和[删除频道](https://docs-im.easemob.com/ccim/circle/rest/channelapi#删除频道)等 API。**

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](http://doc.easemob.com/document/server-side/enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](http://doc.easemob.com/product/limitationapi.html)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `host`       | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见[获取环信即时通讯 IM 的信息](http://doc.easemob.com/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`   | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见[获取环信即时通讯 IM 的信息](http://doc.easemob.com/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `app_name`   | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见[获取环信即时通讯 IM 的信息](http://doc.easemob.com/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `server_id` | String | 是       | 社区 ID。                                                  |
| `channel_id` | String | 是       | 频道 ID。                                                 |
| `user_id`  | String | 是       | 用户 ID。                                                    |
| `role`       | Int    | 是       | 用户的角色：<br/> - `0`：社区所有者；<br/> - `1`：社区管理员；<br/> - `2`：社区的普通成员。 |

:::tip
对于分页获取数据列表，若查询参数中的 `limit` 和 `cursor` 均未设置，则服务器返回首页的数据列表。
:::

### 响应参数

| 参数             | 类型    | 描述                                                         |
| :-----------------| :----- | :----------------------------------------------------------- |
| `name`              | String | 社区名称。                                              |
| `owner`             | String | 社区的所有者。                                            |
| `type`             | Int | 社区的类型：<br/> - `0`：公开社区；<br/> - `1`：私密社区。                                            |
| `description`      | String  | 社区描述。                                              |
| `custom`            | String | 社区的扩展信息。                                            |
| `icon_url`         | String  | 社区头像的 URL。                                          |
| `background_url`         | String  | 社区背景的 URL。                                          |
| `server_tag_id`   | String   | 社区标签 ID。                                           |
| `tag_name`        | String   | 社区标签名称。                                          |
| `tag_count`       | Int   | 社区标签数量。                                          |
| `server_id`       | String   | 社区 ID。                                                  |
| `default_channel_id` | String | 社区的默认频道的 ID。                                   |
| `user_id`           | String | 环信用户 ID。                                                |
| `role`              | Int | 社区成员的角色：<br/> - `0`：社区所有者；<br/> - `1`：社区管理员；<br/> - `2`：社区的普通成员。 |
| `created`          | Long  | 社区的创建时间，Unix 时间戳，单位为毫秒。                                          |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

Authorization：`Bearer ${YourAppToken}`

为提高项目的安全性，环信使用 App Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 需使用 App Token 的鉴权方式，详见 [使用环信 App Token 鉴权](http://doc.easemob.com/product/easemob_app_token.html)。

### 查询环信超级社区用户是否存在

查询环信超级社区用户是否存在。

#### HTTP 请求

```http
GET https://{host}/{org_name_}/{app_name}/circle/user/{user_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型    | 描述                                              |
| :----- | :------ | :------------------------------------------------ |
| `code`   | Int     | 环信超级社区的服务状态码。                               |
| `result` | Boolean | 查询结果：<br/> - `true`：用户存在；<br/> - `false`：用户不存在。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/user/{user_id}'
```

##### 响应示例

```json
{
    "code": 200,
    "result" : true
}
```

### 获取 App 下的社区列表

查询 App 下的社区列表，包括公开和私密社区。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/server/list/by-app?limit={limit}&cursor={cursor}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数     | 类型   | 是否必需 | 描述                                                         |
| :------- | :----- | :------- | :----------------------------------------------------------- |
| `limit`  | Int    | 否       | 每页获取的社区数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页查询时设置。 |
| `cursor` | String | 否       | 游标，指定数据查询的开始位置。该参数仅在分页查询时设置。     |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                          |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型   | 描述                           |
| :-------- | :----- | :----------------------------- |
| `code`    | Int    | 环信超级社区的服务状态码。     |
| `count`   | Int    | 获取到的社区数量。             |
| `servers` | List   | 获取到的社区详情。             |
| `cursor`  | String | 游标，下次数据查询的起始位置。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/list/by-app?limit=1&cursor=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "servers": [
        {
          "name": "server",
          "owner": "user1",
          "type": 0,
          "description": "community",
          "custom": "custom",
          "created": 1658126097514,
          "server_id": "19SW5Q85jHxxxxx6T5kexvn",
          "icon_url": "http://discord.oss/19b1d7b0-7079-11e9-9bd8-25c5e81b42a1",
          "background_url" : "http://circle.oss/89c2e7p8-8794-3u4k-80n5-56m9e8c28b29",
          "default_channel_id": "187xxxx09"
        }
    ],
    "cursor": "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aXXXXXXXXXXXXXX"
}
```

## 创建和管理社区

### 创建社区

社区分为公开社区和私密社区。每个用户最多可以创建 100 个社区。

创建社区时，需设置社区名称、社区类型、社区头像的 URL、社区描述、社区背景 URL 和社区扩展信息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/server
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                            |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

##### 请求 body

| 参数        | 类型   | 是否必需 | 描述                                                        |
| :---------- | :----- | :------- | :----------------------------------------------------------- |
| `owner`      | String | 是       | 社区创建者（即社区所有者）的用户 ID，长度不能超过 64 字节。           |
| `name`    | String | 是       | 社区名称，长度不能超过 50 个字符。                        |
| `type`    | Int | 否       | 社区的类型：<br/> - （默认）`0`：公开社区；<br/> - `1`：私密社区。                         |
| `icon_url`    | String | 否       | 社区头像的 URL，长度不能超过 500 个字符。                   |
| `background_url`    | String | 否       | 社区背景的 URL，长度不能超过 500 个字符。                   |
| `description` | String | 否       | 社区描述，长度不能超过 500 个字符。                       |
| `default_channel_category_name` | String | 否       | 默认频道分组的名称。如果不指定，该频道分组的名称默认为 `文字频道`。   |
| `default_channel_name` | String | 否       | 默认频道的名称。如果不指定，该频道的名称默认为 `通用`。                       |
| `custom`      | String | 否       | 社区的扩展信息，例如，你可以给社区添加业务相关的标记，长度不能超过 500 个字符。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型   | 描述                |
| :-------- | :----- | :------------------ |
| `code`      | Int    | 环信超级社区的服务状态码。 |
| `server_id` | String | 社区 ID。         |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server' -d '{
 "owner" : "user1",
 "name" : "server",
 "type" : 0,
 "icon_url" : "http://circle.oss/19b1d7b0-7079-11e9-9bd8-25c5e81b42a1",
 "background_url" : "http://circle.oss/89c2e7p8-8794-3u4k-80n5-56m9e8c28b29",
 "description" : "community",
 "default_channel_category_name" : "category0", 
 "default_channel_name" : "channel0",
 "custom" : "custom"
}'
```

##### 响应示例

```json
{
    "code": 200,
    "server_id": "19VM9oPBasxxxxxx0tvWViEsdM"
}
```

### 修改社区信息

修改指定社区的信息。你可以修改社区名称、社区头像的 URL、社区描述和社区的扩展信息。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/circle/server/{server_id} 
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                            |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

##### 请求 body

| 参数        | 类型   | 是否必需 | 备注                                                         |
| :---------- | :----- | :------- | :----------------------------------------------------------- |
| `name`    | String | 否       | 社区名称，长度不能超过 50 个字符。                        |
| `type`    | Int | 否       | 社区类型：<br/> - `0`：公开社区；<br/> - `1`：私密社区。          |
| `icon_url`    | String | 否       | 社区头像的 URL，长度不能超过 500 个字符。                     |
| `background_url`    | String | 否       | 社区背景的 URL，长度不能超过 500 个字符。                   |
| `description` | String | 否       | 社区描述，长度不能超过 500 个字符。                       |
| `custom`      | String | 否       | 社区的扩展信息，例如，可以给社区添加业务相关的标记，长度不能超过 500 个字符。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                |
| :----- | :--- | :------------------ |
| `code`   | Int  | 环信超级社区的服务状态码。 |
| `server` | List | 社区数据。       |
| `tags` | List | 社区标签数据。       |

其他字段及描述详见 [公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX' -d '{
 "name" : "easemob",
 "icon_url" : "http://discord.oss/19b1d7b0-7079-11e9-9bd8-25c5e81b42a1",
 "description" : "community",
 "custom" : ""custom"
}'
```

##### 响应示例

```json
{
    "code": 200,
    "server": {
        "name": "server",
        "owner": "user1",
        "type": 0,
        "description": "community",
        "custom": "custom",
        "tags": [
            {
                "server_tag_id": "1",
                "tag_name": "社交"
            }
        ],
        "tag_count": 1,
        "created": 1658126097514,
        "server_id": "19SW5Q85jHxxxxx6T5kexvn",
        "icon_url": "http://discord.oss/19b1d7b0-7079-11e9-9bd8-25c5e81b42a1",
        "background_url" : "http://circle.oss/89c2e7p8-8794-3u4k-80n5-56m9e8c28b29",
        "default_channel_id": "187xxxx09"
    }
}
```

### 为指定社区添加标签

每个社区最多可以添加 10 个标签。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/server/{server_id}/tag/add
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                            |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

##### 请求 body

| 参数 | 类型 | 是否必需 | 描述                                                         |
| :--- | :--- | :------- | :----------------------------------------------------------- |
| `tags` | List | 是       | 为社区添加标签的数组，最多可以添加 10 个标签，每个标签的长度不能超过 20 个字符。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |
| `tags` | List | 社区标签数据。       |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX/tag/add' -d '{
 "tags": ["社交"]
}'
```

##### 响应示例

```json
{
    "code": 200,
    "tags": [
        {
            "server_tag_id": "1",
            "tag_name": "社交"
        }
    ]
}
```

### 获取社区标签

获取指定社区的标签。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/server/{server_id}/tag
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |
| `count` | Int | 社区标签数量。       |
| `tags` | List | 社区标签数据。       |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken>' 'http://XXX/XXX/XXX/circle/server/XXX/tag'
```

##### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "tags": [
        {
            "server_tag_id": "78",
            "tag_name": "uur2"
        }
    ]
}
```

### 移除指定社区的标签

根据标签的 ID 移除标签，不能使用标签名进行移除。移除标签之前，你可以通过[获取社区详情](https://docs-im.easemob.com/ccim/circle/rest/serverapi#获取指定社区的详情)获取标签 ID。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/server/{server_id}/tag/remove
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                           |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

##### 请求 body

| 参数   | 类型 | 是否必需 | 描述                                                         |
| :----- | :--- | :------- | :----------------------------------------------------------- |
| `tagIds` | List | 是       | 要移除的社区标签 ID 的数组，一次移除的标签不能超过 10 个。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX/tag/remove' -d '{
 "tagIds" : ["1", "2"]
}'
```

##### 响应示例

```json
{
    "code": 200
}
```

### 搜索公共社区

你可以根据社区名称或者标签名称搜索公共社区。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/server/search/{name}?type=0&limit={limit}&cursor={cursor} 
```

##### 路径参数

| 参数 | 类型   | 是否必需 | 描述                                                         |
| :--- | :----- | :------- | :----------------------------------------------------------- |
| `name` | String | 是       | 社区名称或社区标签名称。社区名称不能超过 50 个字符，标签名称不能超过 20 个字符。<br/> - 根据社区名称搜索，支持基于通过社区全名搜索和模糊搜索分页获取数据。若使用模糊搜索，你需要传入社区名称中最左侧的单个字或词汇，或包含该字或词汇的关键字，例如社区名称为 `足球社区01`，传入 `足` 或 `足球` 都可搜索出该社区，而使用 `球` 或 `社区01` 则搜索不到该社区。<br/> - 若根据标签名称搜索，需传入完整的标签名称，不支持模糊搜索。|

其他参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 查询参数

| 参数 | 类型   | 是否必需 | 描述                                                         |
| :--- | :----- | :------- | :----------------------------------------------------------- |
| `type` | Int | 否       | 搜索类型：<br/> - （默认）`0`：根据社区名称分页获取社区列表。这种情况下，需将路径参数中的 `name` 设置为社区名称并设置 `limit` 和 `cursor`；<br/> - `1`：根据标签名称获取社区列表，直接获取带有该标签的所有社区。这种情况下，需将路径参数中的 `name` 设置为社区标签名称，而无需设置 `limit` 和 `cursor`。   |
| `limit` | Int    | 否  | 每页获取的社区数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页获取时为必需。|
| `cursor`     | String  | 否  | 游标，指定数据查询的起始位置。该参数仅在分页获取时为必需。       |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
|  `Accept`       | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型 | 描述                   |
| :------ | :--- | :--------------------- |
| `code`    | Int  | 环信超级社区的服务状态码。    |
| `servers` | List | 获取的社区详情。 |
| `count`   | Int  | 获取的社区数量。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/search/XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "servers": [
        {
          "name": "server",
          "owner": "user1",
          "type": 0,
          "description": "community",
          "custom": "custom",
          "created": 1658126097514,
          "server_id": "19SW5Q85jHxxxxx6T5kexvn",
          "icon_url": "http://discord.oss/19b1d7b0-7079-11e9-9bd8-25c5e81b42a1",
          "background_url" : "http://circle.oss/89c2e7p8-8794-3u4k-80n5-56m9e8c28b29",
          "default_channel_id": "187xxxx09"
        }
    ]
}
```

### 获取指定社区的详情

获取指定社区的详情。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/server/{server_id}/by-id
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
|  `Accept`       | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                |
| :----- | :--- | :------------------ |
| `code`   | Int  | 环信超级社区的服务状态码。 |
| `server` | List | 社区的详情。     |
| `tags` | List | 社区标签数据。     |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX/by-id'
```

##### 响应示例

```json
{
    "code": 200,
    "server": {
        "name": "server",
        "owner": "user1",
        "type": 0,
        "description": "community",
        "custom": "custom",
        "tags": [
            {
                "server_tag_id": "1",
                "tag_name": "社交"
            }
        ],
        "tag_count": 1,
        "created": 1658126097514,
        "server_id": "19SW5Q85jHxxxxx6T5kexvn",
        "icon_url": "http://discord.oss/19b1d7b0-7079-11e9-9bd8-25c5e81b42a1",
        "background_url" : "http://circle.oss/89c2e7p8-8794-3u4k-80n5-56m9e8c28b29",
        "default_channel_id": "187xxxx09"
    }
}
```

### 获取推荐的社区的详情

目前，该方法返回最新创建的 5 个社区的详情。若社区数量少于 5 个，则返回实际的社区数量。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/server/recommend/list
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
|  `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型 | 描述                 |
| :------ | :--- | :------------------- |
| `code`    | Int  | 环信超级社区的服务状态码。  |
| `servers` | List | 推荐的社区的详情。 |
| `tags` | List | 推荐的社区的标签数据。 |
| `count`   | Int  | 推荐的社区的数量。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/recommend/list'
```

##### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "servers": [
        {
          "name": "server",
          "owner": "user1",
          "type": 0,
          "description": "community",
          "custom": "custom",
          "tags": [
              {
                  "server_tag_id": "1",
                  "tag_name": "社交"
              }
          ],
          "tag_count": 1,
          "created": 1658126097514,
          "server_id": "19SW5Q85jHxxxxx6T5kexvn",
          "icon_url": "http://discord.oss/19b1d7b0-7079-11e9-9bd8-25c5e81b42a1",
          "background_url" : "http://circle.oss/89c2e7p8-8794-3u4k-80n5-56m9e8c28b29",
          "default_channel_id": "187xxxx09"
        }
    ]
}
```

### 获取当前用户加入的社区的详情

分页获取当前用户加入的社区的详情。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/server/list?userId={user_id}&limit={limit}&cursor={cursor} 
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否必需 | 描述           |
| :---- | :------- | :--------------- |:--------------- |
| `user_id` | String | 是 | 用户 ID。|
| `limit` | Int    | 否  | 每页获取的社区数量。取值范围为 [1,20]，默认值为 `20`。 |
| `cursor`     | String  | 否  | 游标，指定数据查询的起始位置。  |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型 | 描述                   |
| :------ | :--- | :--------------------- |
| `code`    | Int  | 环信超级社区的服务状态码。    |
| `count`   | Int  | 获取到的社区数量。 |
| `servers` | List | 获取到的社区详情。 |
| `tags` | List | 用户加入的社区的标签数据。 |
| `cursor`  | String  | 游标，下次数据查询的起始位置。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/list?userId=XXX&limit=1&cursor=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "servers": [
        {
          "name": "server",
          "owner": "user1",
          "type": 0,
          "description": "community",
          "custom": "custom",
          "tags": [
              {
                  "server_tag_id": "1",
                  "tag_name": "社交"
              }
          ],
          "tag_count": 1,
          "created": 1658126097514,
          "server_id": "19SW5Q85jHxxxxx6T5kexvn",
          "icon_url": "http://discord.oss/19b1d7b0-7079-11e9-9bd8-25c5e81b42a1",
          "background_url" : "http://circle.oss/89c2e7p8-8794-3u4k-80n5-56m9e8c28b29",
          "default_channel_id": "187xxxx09"
        }
    ],
    "cursor": "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aXXXXXXXXXXXXXX"
}
```

### 删除社区

删除指定的社区。删除社区后，该社区中的频道分组和频道也将被删除。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/circle/server/{server_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX'
```

##### 响应示例

```json
{
    "code": 200
}
```

## 管理社区成员

### 获取社区成员列表

分页获取社区成员列表。

#### HTTP 请求

```shell
GET https://{host}/{org_name}/{app_name}/circle/server/{server_id}/users?limit={limit}&cursor={cursor} 
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否必需 | 描述                                        |
| :---- | :------- | :--------------------------------- |:------------------ |
| `limit` | Int   | 否   | 每页获取的社区成员数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页获取时为必需。 |
| `cursor`     | String | 否       | 游标，指定数据查询的起始位置。该参数仅在分页获取时为必需。       |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
|  `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段  | 类型 | 描述                 |
| :---- | :--- | :------------------- |
| `code`  | Int  | 环信超级社区的服务状态码。  |
| `count` | Int  | 获取到的社区成员数量。 |
| `users` | List | 获取到的社区成员详情。 |
| `cursor` | String  | 游标，下次数据查询的起始位置。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX/users?limit=1&cursor=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "users": [
        {
            "user_id" : "user1",
            "role" : 0
        }
    ],
    "cursor": "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aXXXXXXXXXXXXXX"
}
```

### 获取社区内的成员总数

查询社区内的成员总数。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/server/{server_id}/users/count
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                          |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型 | 描述                       |
| :---------- | :--- | :------------------------- |
| `code`      | Int  | 环信超级社区的服务状态码。 |
| `users_count` | Long | 社区内成员总数。           |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX/users/count'
```

##### 响应示例

```json
{
    "code": 200,
    "users_count" : 10
}
```

### 将用户加入社区

将单个用户加入社区，每个用户最多可加入 100 个社区。

用户加入社区时会自动加入社区的默认频道。默认情况下，社区的默认频道最多可包含 2000 个用户。若达到该阈值，则用户加入社区失败。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/server/{server_id}/join?userId={user_id}&isJoinDefaultChannel={true/false}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 查询参数

| 参数          | 类型   | 是否必需 | 描述                    |
| :------------ | :----- | :------- | :-------------------- |
|  `user_id`       | String | 是       | 用户 ID。    |
|  `isJoinDefaultChannel`       | Boolean | 否       | 是否加入社区的默认频道：<br/> - （默认）`true`：加入默认频道； - `false`：不加入社区下的任何频道。    |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                    |
| :------------ | :----- | :------- | :-------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |
| `server` | List  | 用户加入的社区的详情。 |
| `tags` | List  | 用户加入的社区的标签数据。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX/join?userId=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "server": {
        "name": "server",
        "owner": "user1",
        "type": 0,
        "description": "community",
        "custom": "custom",
        "tags": [
            {
                "server_tag_id": "1",
                "tag_name": "社交"
            }
        ],
        "tag_count": 1,
        "created": 1658126097514,
        "server_id": "19SW5Q85jHxxxxx6T5kexvn",
        "icon_url": "http://discord.oss/19b1d7b0-7079-11e9-9bd8-25c5e81b42a1",
        "background_url" : "http://circle.oss/89c2e7p8-8794-3u4k-80n5-56m9e8c28b29",
        "default_channel_id": "187xxxx09"
    }
}
```

### 查询用户是否在社区内

查询用户是否在社区内。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/server/{server_id}/user/{user_id} 
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型    | 描述                                                         |
| :----- | :------ | :----------------------------------------------------------- |
| `code`   | Int     | 环信超级社区的服务状态码。                                          |
| `result` | Boolean | 查询结果：<br/> - `true`：用户在社区中；<br/> - `false`：用户不在社区中。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](https://docs-im.easemob.com/ccim/rest/errorcode)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX/user/XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "result": true
}
```

### 查询指定成员在社区内的角色

查询指定成员在社区内的角色。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/server/{server_id}/user/role?userId={user_id} 
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 查询参数

| 参数 | 类型 | 描述 | 是否必需 |
| :----- | :----- | :------- | -------- |
| `user_id` | String  |  用户 ID。  | 是  |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                                                         |
| :--- | :--- | :----------------------------------------------------------- |
| `code` | Int  | 环信超级社区的服务状态码。                                          |

其他字段及描述详见 [公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX/user/role?userId=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "role" : 1
}
```

### 修改社区中指定成员的角色

修改社区中指定成员的角色。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/circle/server/{server_id}/user/role?userId={user_id}&role={role} 
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 查询参数

| 参数 | 类型 | 是否必需 | 描述                   |
| :--- | :--- | :--------------- | :--------------- |
| `user_id` | String | 是  | 用户 ID。 |
| `role` | Int | 是  | 要修改的成员角色，只能传以下值：<br/> - `1`：表示社区管理员；<br/> - `2`：表示普通成员。<br/>若传 `0`（表示社区所有者）或其他无效值时会报错。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
|  `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourApp Token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X PUT -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX/user/role?userId=XXX&role=XXX'
```

##### 响应示例

```json
{
    "code": 200
}
```

### 将成员移出社区

将指定成员移出社区。一旦成员被移出社区，该成员会自动被移出该社区下的所有频道。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/server/{server_id}/user/remove?userId={user_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/serverapi#公共参数)。

##### 查询参数

| 参数          | 类型   | 是否必需 | 描述                      |
| :------------ | :----- | :------- | :---------------------- |
| `user_id` | String | 是 | 用户 ID。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/server/XXX/user/remove?userId=XXX'
```

##### 响应示例

```json
{
    "code": 200
}
```