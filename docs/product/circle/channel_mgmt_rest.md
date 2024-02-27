# 管理频道以及频道成员

<Toc />

频道（Channel）是一个社区下不同子话题的讨论分区，因此一个社区下可以有多个频道。社区创建时会自动创建默认频道，该频道中添加了所有社区成员，用于承载各种系统通知。从可见性角度看，频道社区分为公开和私密频道；从功能角度看，频道分为文字频道和语聊频道。用户可以根据自己需求创建频道。

**超级社区中的频道基于即时通讯 IM 的群组或聊天室（频道 ID 为群组 ID 或聊天室 ID）创建，删除群组或聊天室时需注意以下几点：**

**1. 在环信控制台、调用 RESTful API 或者通过客户端删除群组或聊天室、群组或聊天室加人、踢人等操作时请谨慎操作，需确保操作的群组或者聊天室不是超级社区使用的。**
**2. 如果将超级社区使用的频道对应的群组或者聊天室删除，会出现数据不一致情况，导致用户加入不了社区、频道、在频道内发不了消息等情况发生。**
**3. 在清理群组或者聊天室数据时，需先确认要删除的群组 ID 或聊天室 ID 与超级社区的频道 ID 是否一致。你可以调用[获取频道详情 API](#查询指定频道详情) 确认要删除的群组或聊天室是否为超级社区的频道。如果是，请不要进行删除。**
**4. 如果需要清理超级社区数据，调用[删除社区](https://docs-im.easemob.com/ccim/circle/rest/serverapi#删除社区)和[删除频道](https://docs-im.easemob.com/ccim/circle/rest/channelapi#删除频道)等 API。**

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](http://doc.easemob.com/document/server-side/enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](http://doc.easemob.com/product/limitationapi.html)。

## 公共参数

### 请求参数

| 参数    | 类型  | 是否必需 | 描述   |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `host`    | String | 是    | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见[获取环信即时通讯 IM 的信息](http://doc.easemob.com/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`  | String | 是    | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见[获取环信即时通讯 IM 的信息](http://doc.easemob.com/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `app_name`  | String | 是    | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见[获取环信即时通讯 IM 的信息](http://doc.easemob.com/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。    |
| `server_id` | String | 是    | 社区 ID。                          |
| `channel_id` | String | 是    | 频道 ID。                         |
| `user_id`   | String | 是    | 用户 ID。                           |
| `role`    | Int   | 是    | 频道成员的角色：<br/> - `0`：频道所有者；<br/> - `1`：频道的普通成员。 |

:::tip
对于分页获取数据列表，若查询参数中的 `limit` 和 `cursor` 均未设置，则服务器返回首页的数据列表。
:::

### 响应参数

| 参数     | 类型  | 描述             |
| :-------| :----- | :------------------------------------ |
| `owner`       | String   | 频道所有者。                       |
| `name`       | String   | 频道名称。                       |
| `type`       | Int   | 频道类型：<br/> - `0`：公开频道；<br/> - `1`：私密频道。       |
| `mode`       | Int   | 频道模式：<br/> - `0`：文字频道；<br/> - `1`：语聊频道。    |
| `description`   | String    | 频道描述。|
| `custom`    | String   | 频道的扩展信息。                      |
| `max_users`    | Long   | 频道最大成员数量。                      |
| `rtc_name`    | String   | RTC 频道名称。该名称在加入 RTC 频道时使用。若使用声网 RTC，该名称还用于[生成 RTC Token](https://docportal.shengwang.cn/cn/voice-call-4.x/token_server_android_ng?platform=Android)。<br/>该参数仅在创建语聊频道时返回，若创建语聊房频道时未指定 `rtc_name`，服务器将使用频道 ID 作为该参数的值返回。                    |
| `current_users_count` | Int | 当前在频道中的成员数，仅在获取语聊房频道详情时返回。        |
| `default_channel` | Int | 是否为社区的默认频道：<br/> - `0`：否；<br/> - `1`：是。         |
| `user_id`   | String   | 环信用户 ID。                           |
| `role`     | Int   | 频道成员的角色：<br/> - `0`：频道所有者；<br/> - `1`：频道的普通成员。 |
| `created`    | Long   | 频道的创建时间，Unix 时间戳，单位为毫秒。                     |
| `server_id`   | String   | 社区 ID。                          |
| `channel_category_id`   | String   | 频道分组 ID。                          |
| `channel_id`   | String   | 频道 ID。                          |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

Authorization：`Bearer ${YourAppToken}`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用环信 App Token 鉴权](/document/server-side/easemob_app_token.html)。

## 创建和管理频道

### 创建频道

每个社区最多可以创建 100 个频道。一个频道只能加入一个频道分组。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/channel
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                          |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                          |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

##### 请求 body

| 参数        | 类型   | 是否必需 | 描述                                                        |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `server_id`   | String | 是       | 社区 ID。                                                  |
| `channel_category_id`   | String | 否       | 频道分组 ID。如果指定频道分组 ID，创建的频道将添加到该分组下；若不指定，则频道添加至社区默认频道分组中。                                                  |
| `name`        | String | 是       | 频道名称，长度不能超过 50 个字符。                       |
| `type`        | Int    | 否       | 频道类型：<br/> - （默认）`0`：公开频道；<br/> - `1`：私密频道。           |
| `mode`        | Int    | 否       | 频道模式：<br/> - （默认）`0`：文字频道；<br/> - `1`：语聊频道。  |
| `maxUsers`        | Long | 否       | 频道最大成员数量。<br/> - 对于语聊频道（即 `mode` 为 `1`），该参数的取值范围为 [1,20]，默认值为 `8`。<br/> - 对于文字频道，该参数的取值范围为 [1,2000]，默认值为 `2000`。如需要提高上限请联系商务。                      |
| `description` | String | 否       | 频道描述，长度不能超过 500 个字符。                      |
| `custom`      | String | 否       | 频道扩展信息，例如可以给社区添加业务相关的标记，长度不能超过 500 个字符。 |
| `rtc_name`      | String | 否       | RTC 频道名称，长度不能超过 50 个字符。该名称在加入 RTC 频道时使用，仅在创建语聊频道时返回。若使用声网 RTC，该名称还用于[生成 RTC Token](https://docportal.shengwang.cn/cn/voice-call-4.x/token_server_android_ng?platform=Android)。<br/>若创建语聊频道时未指定 `rtc_name`，服务器将使用频道 ID 作为该参数的值返回。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型   | 描述                |
| :--------- | :----- | :------------------ |
| `code`       | Int    | 环信超级社区的服务状态码。 |
| `channel` | JSON | 频道详情。    |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

创建 IM 频道：

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel'
-d '{
    "server_id" : "19VM9oPBasxxxxxx0tvWViEsdM",
    "name" : "chat channel",
    "type" : 0,
    "mode"：0,
    "max_users" : 200,
    "description" : "chat Channel",
    "custom" : "custom"
}'
```

创建语聊房频道：

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel'
-d '{
    "server_id" : "19KM9oPBasxxxxxx0tvWViVhgk",
    "name" : "voice chatroom channel",
    "type" : 0,
    "mode"：1,
    "max_users" : 10,
    "description" : "voice chatroom Channel",
    "custom" : "custom",
    "rtc_name" : "150986"
}'
```

##### 响应示例

创建 IM 频道的响应：

```json
{
    "code": 200,
    "channel": {
        "owner": "user1",
        "name": "chat channel",
        "type": 0,
        "mode": 0,
        "description": "chat channel",
        "custom": "custom",
        "created": 1675845650856,
        "server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        "channel_category_id": "77a9860xxxxxx2b54881025861c",
        "channel_id": "2059xxxxxx1542",
        "max_users": 200,
        "default_channel": 0
    },
    "channel_id": "2059xxxxxx1542"
}
```

创建语聊房频道的响应：

```json
{
    "code": 200,
    "channel": {
        "owner": "user1",
        "name": "voice chatroom Channel",
        "type": 0,
        "mode": 1,
        "description": "voice chatroom Channel",
        "custom": "custom",
        "created": 1675845650856,
        "server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        "channel_category_id": "77a9860xxxxxx2b54881025861c",
        "channel_id": "2059xxxxxx1590",
        "max_users": 10,
        "rtc_name" : "150986",
        "default_channel": 0
    },
    "channel_id": "2059xxxxxx1590"
}
```

### 修改频道信息

修改指定频道的信息。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}?serverId={server_id}
```

##### 路径参数

参数及描述详见 [公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :----- | :----- | :------- | :-------- |
| `server_id` | String | 是 | 频道所属社区的 ID。  |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| ------------- | ------ | -------- | ------------------------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                           |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

##### 请求 body

| 参数        | 类型   | 是否必需 | 描述                                                         |
| ----------- | ------ | -------- | ------------------------------------------------------------ |
| `name`        | String | 否       | 频道名称，长度不能超过 50 个字符。                           |
| `type`        | Int    | 否       | 频道类型：<br/> - `0`：公开频道；<br/> - `1`：私密频道。 |
| `maxUsers` | Long    | 否       | 频道最大成员数量。<br/> - 对于语聊房频道，该参数的取值范围为 [1,20]。<br/> - 对于其他模式的频道，该参数的取值范围为 [1,2000]，如需要提高上限请联系商务。    |
| `description` | String | 否       | 频道描述，长度不能超过 500 个字符。                          |
| `custom`      | String | 否       | 频道的扩展信息，例如可以给社区添加业务相关的标记，长度不能超过 500 个字符。 |
| `rtc_name`      | String | 否       | 目前该名称用于使用声网 RTC 时，生成 Token 以及端上加入声网 RTC 频道时使用，长度不能超过 50 个字符。该字段目前仅在修改语聊房频道时才有效。若创建语聊房频道时未指定 `rtc_name`，服务器将使用频道 ID 作为 `rtc_name` 的值返回。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型 | 描述                |
| :------ | :--- | :------------------ |
| `code`    | Int  | 环信超级社区的服务状态码。 |
| `channel` | Json | 频道详情。    |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX' -d '{
 		"name" : "chat channel",
 		"max_users" : 200,
 		"description" : "chat Channel",
  	"custom" : "custom"
}'
```

#### 响应示例

```json
{
    "code": 200,
    "channel": {
        "owner": "user1",
        "name": "chat channel",
        "type": 0,
        "mode": 0,
        "description": "chat channel",
        "custom": "custom",
        "created": 1675845650856,
        "server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        "channel_category_id": "77a9860xxxxxx2b54881025861c",
        "channel_id": "2059xxxxxx1542",
        "max_users": 200,
        "default_channel": 0
    }
}
```

### 查询指定频道详情

查询指定的频道详情。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}?serverId={server_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `server_id` | String | 是       | 频道所属社区的 ID。     |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型 | 描述                |
| :------ | :--- | :------------------ |
| `code`    | Int  | 环信超级社区的服务状态码。 |
| `channel` | JSON | 频道详情。    |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel?serverId=XXX'
```

##### 响应示例

查询 IM 频道的响应：

```json
{
    "code": 200,
    "channel": {
        "owner": "user1",
        "name": "chat channel",
        "type": 0,
        "mode": 0,
        "description": "chat channel",
        "custom": "custom",
        "created": 1675845650856,
        "server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        "channel_category_id": "77a9860xxxxxx2b54881025861c",
        "channel_id": "2059xxxxxx1542",
        "max_users": 200,
        "default_channel": 0
    }
}
```

查询语聊房频道的响应：

```json
{
    "code": 200,
    "channel": {
        "owner": "user1",
        "name": "voice chatroom channel",
        "type": 0,
        "mode": 1,
        "description": "voice chatroom channel",
        "custom": "custom",
        "created": 1675845650856,
        "server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        "channel_category_id": "77a9860xxxxxx2b54881025861c",
        "channel_id": "2059xxxxxx1542",
        "rtc_name" : "150986",
        "max_users": 10,
        "current_users_count" : 2,
        "default_channel": 0
    }
}
```

### 获取单个社区下的所有公开频道

分页获取单个社区下的所有公开频道。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/public?serverId={server_id}&limit={limit}&cursor={cursor} 
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否所需 | 描述                        |
| :---- | :------- | :------------------| :----------------------- |
| `server_id` | String | 是       | 频道所属社区的 ID。     |
| `limit` | Int   | 否   | 每页获取的频道数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页查询时设置。 |
| `cursor` | String   | 否   | 游标，指定查询的开始位置。该参数仅在分页查询时设置。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :------------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型  | 描述                        |
| :--------- | :----- | :----------------------------- |
| `code`     | Int   | 环信超级社区的服务状态码。         |
| `count`    | Int   | 获取到的频道数量。     |
| `channels` | List | 获取到的频道详情列表。 |
| `cursor` | String | 游标，指定下次查询的起始位置。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/public?serverId=XXX&limit=1&cursor=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "channels": [
        {
            "owner": "user1",
        		"name": "chat channel",
        		"type": 0,
        		"mode": 0,
        		"description": "chat channel",
        		"custom": "custom",
        		"created": 1675845650856,
        		"server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        		"channel_category_id": "77a9860xxxxxx2b54881025861c",
        		"channel_id": "2059xxxxxx1542",
        		"max_users": 200,
        		"default_channel": 0
        }
    ],
    "cursor": "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aXXXXXXXXXXXXXX"
}
```

### 获取用户在社区创建的频道列表

查询用户在社区创建的频道列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/user/{user_id}/created/channels?serverId={server_id}&limit={limit}&cursor={cursor}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数        | 类型   | 是否必需 | 描述                                                         |
| :---------- | :----- | :------- | :----------------------------------------------------------- |
| `server_id` | String | 是       | 频道所属社区的 ID。                                          |
| `limit`     | Int    | 否       | 每页获取的频道数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页查询时设置。 |
| `cursor`    | String | 否       | 游标，指定数据查询的开始位置。该参数仅在分页查询时设置。     |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                          |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型   | 描述                           |
| :--------- | :----- | :----------------------------- |
| `code`     | Int    | 环信超级社区的服务状态码。     |
| `count`    | Int    | 获取到的频道数量。             |
| `channels` | List   | 获取到的频道详情列表。         |
| `cursor`   | String | 游标，指定下次查询的开始位置。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/user/XXX/created/channels?serverId=XXX&limit=1&cursor=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "channels": [
        {
            "owner": "user1",
        		"name": "chat channel",
        		"type": 0,
        		"mode": 0,
        		"description": "chat channel",
        		"custom": "custom",
        		"created": 1675845650856,
        		"server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        		"channel_category_id": "77a9860xxxxxx2b54881025861c",
        		"channel_id": "2059xxxxxx1542",
        		"max_users": 200,
        		"default_channel": 0
        }
    ],
    "cursor": "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aXXXXXXXXXXXXXX"
}
```

### 获取单个用户已加入的频道列表

分页获取单个用户已加入的频道列表，包括公开和私密频道。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/user/joined/list?userId={user_id}&serverId={server_id}&limit={limit}&cursor={cursor} 
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否所需 | 描述                        |
| :---- | :------- | :------------------| :----------------------- |
| `user_Id` | String | 是 | 用户 ID。 |
| `server_id` | String | 是       | 频道所属社区的 ID。     |
| `limit` | Int   | 否   | 每页获取的频道数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页查询时设置。 |
| `cursor` | String   | 否   | 游标，指定数据查询的开始位置。该参数仅在分页查询时设置。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述                        |
| :------- | :--- | :-------------------------- |
| `code`     | Int  | 环信超级社区的服务状态码。         |
| `channels` | List | 获取到的频道详情列表。 |
| `count`    | Int  | 获取到的频道数量。      |
| `cursor` | String  | 游标，指定下次查询的开始位置。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/user/joined/list?userId=XXX&serverId=XXX&limit=1&cursor=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "channels": [
        {
            "owner": "user1",
        		"name": "chat channel",
        		"type": 0,
        		"mode": 0,
        		"description": "chat channel",
        		"custom": "custom",
        		"created": 1675845650856,
        		"server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        		"channel_category_id": "77a9860xxxxxx2b54881025861c",
        		"channel_id": "2059xxxxxx1542",
        		"max_users": 200,
        		"default_channel": 0
        }
    ],
    "cursor": "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aXXXXXXXXXXXXXX"
}
```

### 获取单个社区下的所有私密频道

分页获取单个社区下的所有私密频道。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/private?serverId={server_id}&limit={limit}&cursor={cursor} 
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否所需 | 描述                        |
| :---- | :------- | :------------------| :----------------------- |
| `server_id` | String | 是       | 频道所属社区的 ID。     |
| `limit` | Int   | 否   | 每页获取的私密频道数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页查询时设置。 |
| `cursor` | String   | 否   | 游标，指定查询的开始位置。该参数仅在分页查询时设置。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述                            |
| :------- | :--- | :------------------------------ |
| `code`     | Int  | 环信超级社区的服务状态码。             |
| `count`    | Int   | 获取到的频道数量。         |
| `channels` | List | 获取到的私密频道详情列表。 |
| `cursor` | String    | 游标，指定下次查询的开始位置。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/private?serverId=XXX&limit=1&cursor=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "channels": [
        {
            "owner": "user1",
        		"name": "private chat channel",
        		"type": 1,
        		"mode": 0,
        		"description": "private chat channel",
        		"custom": "custom",
        		"created": 1675845650856,
        		"server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        		"channel_category_id": "77a9860xxxxxx2b54881025861c",
        		"channel_id": "2065xxxxxx1590",
        		"max_users": 100,
        		"default_channel": 0
        }
    ],
    "cursor": "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aXXXXXXXXXXXXXX"
}
```

### 删除频道

删除指定的频道。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}?serverId={server_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否所需 | 描述                        |
| :------------ | :----- | :------- | :------------------------------- |
| `server_id` | String | 是       | 频道所属社区的 ID。     |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述         |
| :------------ | :----- | :------- | :------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

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
curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX?serverId=XXX'
```

##### 响应示例

```json
{
    "code": 200
}
```

## 发送消息

通过 RESTful API 在频道中发送消息与在群组中发送消息的方式类似，唯一的区别在于请求体中的 `to` 参数需要设置为频道 ID，并且发送的消息不会写入会话列表。详见 [发送群聊消息](/document/server-side/message_group.html)。

## 管理消息 Reaction

### 添加消息 Reaction

添加消息 Reaction。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/reaction/user/{user_id}
```

##### 路径参数

| 参数       | 类型   | 是否必需 | 描述                             |
| :--------- | :----- | :------- | :--------------------------------- |
| `user_id`    | String | 是       | 用户 ID。                          |

其他参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                           |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

##### 请求 body

| 参数       | 类型   | 是否必需 | 描述                             |
| :--------- | :----- | :------- | :--------------------------------- |
| `message_id` | String | 是       | 消息 ID。                          |
| `message`    | String | 是       | 表情 ID，与客户端一致。长度不可超过 128 个字符。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型   | 描述                |
| :---------- | :----- | :------------------ |
| `code`        | Int    | 环信超级社区的服务状态码。 |
| `reaction_id` | String | Reaction ID。       |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/reaction/user/{user_id}'
-d '{
  "message_id" : "131345390",
  "message" : "message123456"
}'
```

##### 响应示例

```json
{
  "code" : 200,
  "reaction_id" : "15890012560"
}
```

### 获取指定消息的 Reaction

获取指定消息的 Reaction。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/reaction/user/{user_id}?msgIdList={message_id}&channelId={channel_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数          | 类型   | 是否必需 | 描述                |
| :------------ | :----- | :------- | :------------------------------ |
| `msgIdList` | String | 是 | Reaction 所属消息的 ID。 | 
| `channelId` | String | 是 | 消息所属频道的 ID。 | 

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |
| `count` | Int  | Reaction 数量。 |
| `reactions.msgId` | String  | Reaction 所属消息的 ID。 |
| `reactionList` | List  | Reaction 列表及其详细信息。 |
| `reactionList.reactionId` | String  | Reaction ID。  |
| `reactionList.message` | String  | Reaction 名称。  |
| `reactionList.state` | Bool  | 发送该请求的用户是否向消息添加了 Reaction：<br/> - `true`：是；<br/> - `false`：否。 |
| `reactionList.count` | Int  | 向消息添加了该 Reaction 的用户数量。|
| `reactionList.userList` | List  | 添加了该 Reaction 的用户 ID 列表。|

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/reaction/user/XXX?msgIdList=XXX&channelId=XXX'
```

##### 响应示例

```json
{
    "code":200,
    "count" : 1,
    "reactions":[
        {
            "msgId":"131345390",
            "reactionList":[
                {
                    "reactionId":"944330310986837168",
                    "message":"message123456",
                    "count":2,
                    "state":"该用户是否追加了此 reaction",
                    "userList":[
                        "user1",
                        "user2"
                    ]
                }
            ]
        }
    ]
}
```

### 删除指定消息的 Reaction

删除指定消息的 Reaction。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/circle/reaction/user/{user_id}?messageId={message_id}&message={message}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数          | 类型   | 是否必需 | 描述                |
| :------------ | :----- | :------- | :------------------------------ |
| `message_id` | String | 是 | Reaction 所属消息的 ID。 | 
| `message` | String | 是 | 要移除的表情的 ID。 | 

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

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
curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/reaction/user/XXX?messageId=XXX&message=XXX'
```

##### 响应示例

```json
{
  "code" : 200
}
```

## 管理频道成员

### 将用户加入频道

将用户加入频道。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}/join?userId={user_id}&serverId={server_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `user_id`        | String | 是       | 用户 ID。                           |
| `server_id` | String | 是       | 社区 ID。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型 | 描述                |
| :------ | :--- | :------------------ |
| `code`    | Int  | 环信超级社区的服务状态码。 |
| `channel` | JSON | 频道详情。    |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX/join?userId=XXX&serverId=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "channel": {
        "owner": "user1",
        "name": "chat channel",
        "type": 0,
        "mode": 0,
        "description": "chat channel",
        "custom": "custom",
        "created": 1675845650856,
        "server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        "channel_category_id": "77a9860xxxxxx2b54881025861c",
        "channel_id": "2059xxxxxx1542",
        "max_users": 200,
        "default_channel": 0
    }
}
```

### 将成员移出频道

将指定成员移出频道。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}/user/remove?userId={user_id}&serverId={server_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数          | 类型   | 是否必需 | 描述                              |
| :------------ | :----- | :------- | :--------------------------- |
| `user_id`        | String | 是       | 用户 ID。               |
| `server_id` | String | 是       | 社区 ID。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

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
curl -X POST -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX/user/remove?userId=XXX&serverId=XXX'
```

##### 响应示例

```json
{
    "code": 200
}
```

### 批量移除频道成员

一次移除多名频道成员。如果所有被移除用户均不是频道成员，则移除失败，并返回错误。移除后，这些成员也会被移除其在该频道中加入的子区。

单个请求最多可移除 20 个频道成员。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}/users/remove
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。       |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

##### 请求 body

| 参数        | 类型   | 是否必需 | 描述                                           |
| :---------- | :----- | :------- | :--------------------------------------------- |
| `server_id` | String | 是       | 社区 ID。                                      |
| `usernames` | List   | 是       | 被移除频道成员的用户 ID 列表，不能超过 20 个。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                                                         |
| :----- | :--- | :----------------------------------------------------------- |
| `code` | Int  | 环信超级社区的服务状态码。                                   |
| `data`  | List | 批量移除频道成员的信息，包含被移除的频道成员的用户 ID 和移除结果。 |
| `data.user` | String  | 被移除的频道成员的用户 ID。     |
| `data.result` | Bool  | 频道成员是否被成功移除：<br/> - `true`：移除成功；<br/> - `false`：移除失败。失败的原因可能是用户不在频道所属的社区中、用户不在频道中、用户为频道所有者等。   |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
// 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX/users/remove'
-d '{
    "server_id" : "19VM9oPBasxxxxxx0tvWViEsdM",
    "usernames" : [
    	"u1",
    	"u3",
    	"u5"
    ]
}'
```

##### 响应示例

```json
{
    "code": 200,
    "data": [
        {
            "user": "u1",
            "result": true
        },
        {
            "user": "u5",
            "result": true
        },
        {
            "user": "u3",
            "result": true
        }
    ]
}
```

### 查询用户是否在频道

查询用户是否在频道中。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}/user/{user_id}?serverId={server_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否所需 | 描述                        |
| :---- | :------- | :------------------| :----------------------- |
| `server_id` | String | 是       | 频道所属社区的 ID。     |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型    | 描述                                                         |
| :----- | :------ | :----------------------------------------------------------- |
| `code`   | Int     | 环信超级社区的服务状态码。                                          |
| `result` | Boolean | 查询结果：<br/>- `true`：用户在频道中；<br/>- `false`：用户不在频道中。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX/user/XXX?serverId=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "result": true
}
```

### 查询频道中指定成员的社区角色

查询频道中指定成员的社区角色。社区角色包社区所有者、管理员和普通成员。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}/user/role?serverId={server_id}&userId={user_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数        | 类型   | 是否必需 | 描述                    |
| :---------- | :----- | :------- | :---------------------- |
| `server_id` | String | 是       | 频道所属社区的 ID。     |
| `user_id`   | Int    | 是       | 需要查询角色的用户 ID。 |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                          |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                       |
| :----- | :--- | :------------------------- |
| `code` | Int  | 环信超级社区的服务状态码。 |
| `role` | Int  | 用户在社区中的角色：<br/> - `0`: 所有者；<br/> - `1`：管理员；<br/> - `2`：普通成员。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
// 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX/user/role?serverId=XXX&userId=XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "role": 2
}
```

### 获取频道的成员列表

获取指定频道的成员列表：

- 创建语聊频道时，创建者不加入频道。因此，频道创建者不算入频道成员数量，查询频道成员列表时不返回频道创建者。

- 创建文字频道时，创建者直接加入频道。因此，频道创建者算入频道成员数量，查询频道成员列表返回频道创建者。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}/users?serverId={server_id}&limit={limit}&cursor={cursor} 
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否所需 | 描述                        |
| :---- | :------- | :------------------| :----------------------- |
| `server_id` | String | 是       | 频道所属社区的 ID。     |
| `limit` | Int   | 否   | 每页获取的成员数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页查询时设置。 |
| `cursor` | String   | 否   | 游标，指定查询的开始位置。该参数仅在分页查询时设置。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段  | 类型 | 描述                     |
| :---- | :--- | :----------------------- |
| `code`  | Int  | 环信超级社区的服务状态码。      |
| `count` | Int  | 获取到的成员数量。     |
| `users` | List | 获取到的成员详情列表。 |
| `users.user_id` | String | 用户 ID |
| `users.role` | Int | 用户在社区中的角色：<br/> - `0`: 所有者；<br/> - `1`：管理员；<br/> - `2`：普通成员。|
| `cursor`    | String   | 游标，指定下次数据查询的起始位置。|

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX/users?serverId=XXX&limit=1&cursor=XXX'
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

### 获取频道的禁言列表

获取频道的禁言列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}/user/mute/list?serverId={server_id}&limit={limit}&cursor={cursor}
```

##### 路径参数

| 参数  | 类型 | 是否所需 | 描述                        |
| :---- | :------- | :------------------| :----------------------- |
| `server_id` | String | 是       | 频道所属社区的 ID。     |

其他参数及描述，详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数        | 类型   | 是否必需 | 描述                                                         |
| :---------- | :----- | :------- | :----------------------------------------------------------- |
| `server_id` | String | 是       | 频道所属社区的 ID。                                          |
| `limit`     | Int    | 否       | 每页获取频道内被禁言的用户数量。取值范围为 [1,20]，默认值为 20。该参数仅在分页查询时设置。 |
| `cursor`    | String | 否       | 查询游标，指定下次查询的开始位置。该参数仅在分页查询时设置。     |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型   | 描述                |
| :----- | :----- | :------------------ |
| `code`   | Int    | 环信超级社区的服务状态码。 |
| `mute_users`   | List    | 被禁言用户的详情列表。|
| `mute_users.expire` | Long   | 禁言的到期时间，Unix 时间戳，单位为毫秒。    |
| `mute_users.user`   | String | 被禁言的成员的用户 ID。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX/user/mute/list?serverId=XXX&limit=1&cursor=XXX'
```

##### 响应示例

```json
{
  "code" : 200,
  "count" : 2,
  "mute_users" : [
    {
      "expire" : 86400000,
      "user" : "u1"
    },
    {
      "expire" : 86400000,
      "user" : "u2"
    }
  ]
}
```

### 将成员加入频道禁言列表

将成员加入频道禁言列表。成员被禁言后，将无法在频道中发送消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}/user/mute
```

##### 路径参数

其它参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                           |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

##### 请求 body

| 参数      | 类型   | 是否必需 | 备注                       |
| :-------- | :----- | :------- | :------------------------- |
| `server_id` | String | 是       | 社区 ID。                |
| `user_id`   | String | 是       | 被禁言的成员的用户 ID。          |
| `duration`  | Long   | 是       | 禁言时长，单位为毫秒。若不传该参数为永久禁言。 |

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
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX/user/mute' -d '{
  "server_id" : "19UyPIsiwxxxxxxxgLrfI9Z",
  "user_id" : "u1",
  "duration" : 86400
}'
```

##### 响应示例

```json
{
    "code": 200
}
```

### 将成员移出频道禁言列表

将成员移出频道禁言列表。成员被解除禁言后，可以在频道中发送消息。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/circle/channel/{channel_id}/user/mute?serverId={server_id}&userId={user_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `server_id`        | String | 是       | 频道所属社区的 ID。                          |
| `user_id` | String | 是       | 要禁言的用户 ID。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |

其他字段及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/XXX/user/mute?serverId=XXX&userId=XXX'
```

##### 响应示例

```json
{
    "code": 200
}
```

## 管理子区

### 创建子区

创建子区。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/thread
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                           |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

##### 请求 body

| 参数       | 类型   | 是否必需 | 备注          |
| :--------- | :----- | :------- | :------------ |
| `channel_id` | String | 是       | 频道 ID。  |
| `user_id`    | String | 是       | 用户 ID。     |
| `name`       | String | 是       | 子区名称。 |
| `message_id` | String | 是       | 消息 ID。     |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型   | 描述                |
| :-------- | :----- | :------------------ |
| `code`      | Int    | 环信超级社区的服务状态码。 |
| `thread_id` | String | 子区 ID。         |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/thread' -d '{
  "channel_id" : "156900086",
  "user_id" : "user1",
  "message_id" : 0,
  "name" : "thread-name"
}'
```

##### 响应示例

```json
{
  "code" : 200,
  "thread_id" : "15890012560"
}
```

### 修改子区信息

修改指定子区的信息。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/circle/thread/{thread_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                           |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

##### 请求 body

| 参数 | 类型   | 是否必需 | 备注          |
| :--- | :----- | :------- | :------------ |
| `name` | String | 是       | 子区名称。 |

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
curl -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/thread/XXX' -d '{
  "name" :"thread-name"
}'
```

##### 响应示例

```json
{
  "code" : 200
}
```

### 查询子区的详情

查询指定子区的详情。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/thread/{thread_id}
```

##### 路径参数

其它参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |
| `id` | String | 子区 ID。    |
| `msgId` | String | 子区的父消息 ID。   |
| `channelId` | String | 子区所属频道的 ID。|
| `owner`    | String | 子区创建者的用户 ID。    |
| `created`    | Long | 子区创建时间，Unix 时间戳，单位为毫秒。   |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](https://docs-im.easemob.com/ccim/rest/errorcode)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/thread/XXX'
```

##### 响应示例

```json
{
    "code": 200,
    "id" : "1895600",
    "msgId" : "198008034121000",
    "channelId" : "156009089",
    "owner" : "user1",
    "created" : 1650856033420
}
```

### 删除子区

删除指定的子区。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/circle/thread/{thread_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| code | Int  | 环信超级社区的服务状态码。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/thread/XXX'
```

##### 响应示例

```json
{
    "code": 200
}
```

### 加入子区

加入指定的子区。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/thread/{thread_id}/user/join?userId={user_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

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
curl -X POST -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/thread/XXX/user/join?userId=XXX'
```

##### 响应示例

```json
{
  "code" : 200
}
```

### 将成员移出子区

将成员移出指定的子区。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/thread/{thread_id}/user/remove?userId={user_id}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `user_id`  | String | 是       | 要移出子区的用户 ID。                           |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](https://docs-im.easemob.com/ccim/rest/errorcode)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/thread/XXX/user/remove?userId=XXX'
```

##### 响应示例

```json
{
  "code" : 200
}
```

### 用户获取自己创建的子区

用户获取自己创建的子区。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/thread/created?userId={user_id}&channelId={channel_id}&limit={limit}&cursor={cursor}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否所需 | 描述                        |
| :---- | :------- | :------------------| :----------------------- |
| `user_id` | String | 是       | 用户 ID。     |
| `channel_id` | String | 是       | 子区所属频道的 ID。     |
| `limit` | Int   | 否   | 每页获取的频道数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页查询时设置。 |
| `cursor` | String   | 否   | 游标，指定查询的开始位置。该参数仅在分页查询时设置。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型 | 描述                       |
| :------ | :--- | :------------------------- |
| `code`    | Int  | 环信超级社区的服务状态码。        |
| `threads` | List | 获取到的子区详情列表。 |
| `count`   | Int  | 获取到的子区数量。     |
| `threads.id` | String | 子区 ID。   |
| `threads.msgId` | String | 子区的父消息 ID。   |
| `threads.channelId` | String | 子区所属频道的 ID。 |
| `threads.owner`    | String | 子区创建者的用户 ID。    |
| `threads.created`    | Long | 子区创建时间，Unix 时间戳，单位为毫秒。    |
| `cursor` | String  | 游标，指定下次查询的开始位置。|

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](https://docs-im.easemob.com/ccim/rest/errorcode)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/thread/created?userId=XXX&channelId=XXX&limit=1&cursor=XXX'
```

##### 响应示例

```json
{
  "code" : 200,
  "threads" : [
    {
      "id" : "1895600",
      "msgId" : "198008034121000",
      "channelId" : "156009089",
      "owner" : "user1",
      "created" : 1650856033420
    }
    ],
     "cursor" : "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aW06ZGlzY29yZDo2MjI0MjEwMiM5MDoy"
}
```

### 用户获取频道中的子区

分页获取频道中的子区。

#### HTTP 请求

```shell
curl -X GET https://{host}/{org_name}/{app_name}/circle/thread/list?channelId={channel_id}&limit={limit}&cursor={cursor}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否所需 | 描述                        |
| :---- | :------- | :------------------| :----------------------- |
| `channel_id` | String | 是       | 子区所属频道的 ID。     |
| `limit` | Int   | 否   | 每页获取的子区数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页查询时设置。 |
| `cursor` | String   | 否   | 游标，指定查询的开始位置。该参数仅在分页查询时设置。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型 | 描述                       |
| :------ | :--- | :------------------------- |
| `code`    | Int  | 环信超级社区的服务状态码。        |
| `threads` | List | 获取到的子区详情列表。 |
| `threads.id` | String | 子区 ID。   |
| `threads.msgId` | String | 子区的父消息 ID。   |
| `threads.channelId` | String | 子区所属频道的 ID。 |
| `threads.owner`    | String | 子区创建者的用户 ID。    |
| `threads.created`    | Long | 子区创建时间，Unix 时间戳，单位为毫秒。    |
| `cursor` | String  | 游标，指定下次查询的开始位置。|

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/thread/list?channelId=XXX&limit=1&cursor=XXX'
```

##### 响应示例

```json
{
  "code" : 200,
  "threads" : [
    {
       "id" : "1895600",
       "msgId" : "198008034121000",
       "channelId" : "156009089",
       "owner" : "user1",
       "created" : 1650856033420
    }
    ],
     "cursor" : "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aW06ZGlzY29yZDo2MjI0MjEwMiM5MDoy"
}
```

### 用户获取频道中加入的子区

用户获取频道中加入的子区。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/thread/joined?userId={user_id}&channelId={channel_id}&limit={limit}&cursor={cursor}
```

##### 路径参数

参数及描述详见[公共参数](https://docs-im.easemob.com/ccim/circle/rest/channelapi#公共参数)。

##### 查询参数

| 参数  | 类型 | 是否所需 | 描述                        |
| :---- | :------- | :------------------| :----------------------- |
| `user_id` | String | 是       | 用户 ID。     |
| `channel_id` | String | 是       | 子区所属频道的 ID。     |
| `limit` | Int   | 否   | 每页获取的子区数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页查询时设置。 |
| `cursor` | String   | 否   | 游标，指定查询的开始位置。该参数仅在分页查询时设置。 |

##### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型 | 描述                       |
| :------ | :--- | :------------------------- |
| `code`    | Int  | 环信超级社区的服务状态码。        |
| `threads` | List | 获取到的子区详情列表。 |
| `threads.id` | String | 子区 ID。   |
| `threads.msgId` | String | 子区的父消息 ID。   |
| `threads.channelId` | String | 子区所属频道的 ID。 |
| `threads.owner`    | String | 子区创建者的用户 ID。    |
| `threads.created`    | Long | 子区创建时间，Unix 时间戳，单位为毫秒。    |
| `cursor` | String  | 游标，指定下次查询的开始位置。|

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](http://doc.easemob.com/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/thread/joined?userId={user_id}&channelId=XXX&limit=1&cursor=XXX'
```

##### 响应示例

```json
{
  "code" : 200,
  "threads" : [
    {
        "id" : "1895600",
        "msgId" : "198008034121000",
        "channelId" : "156009089",
        "owner" : "user1",
        "created" : 1650856033420
    }
    ],
     "cursor" : "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aW06ZGlzY29yZDo2MjI0MjEwMiM5MDoy"
}
```