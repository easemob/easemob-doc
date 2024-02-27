# 管理社区频道分组

<Toc />

环信超级社区（Circle）支持频道分组方便频道管理。例如，可将歌剧频道、民歌频道和流行歌曲频道划分为声乐频道分组。

社区创建时会创建默认的频道分组，包含默认频道。

**超级社区中的频道基于即时通讯 IM 的群组或聊天室（频道 ID 为群组 ID 或聊天室 ID）创建，删除群组或聊天室时需注意以下几点：**

**1. 在环信控制台或者调用 RESTful API 删除群组或聊天室、群组或聊天室加人、踢人等操作时请谨慎操作，需确保操作的群组或者聊天室不是超级社区使用的。**
**2. 如果将超级社区使用的频道对应的群组或者聊天室删除，会出现数据不一致情况，导致用户加入不了社区、频道、在频道内发不了消息等情况发生。**
**3. 在清理群组或者聊天室数据时，需先确认要删除的群组 ID 或聊天室 ID 与超级社区的频道 ID 是否一致。你可以调用[获取频道详情 API](channel_mgmt_rest.html#查询指定频道详情) 确认要删除的群组或聊天室是否为超级社区的频道。如果是，请不要进行删除。**
**4. 如果需要清理超级社区数据，调用[删除社区](server_mgmt_rest.html#删除社区)和[删除频道](channel_mgmt_rest.html#删除频道)等 API。**

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](/document/server-side/enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](/product/limitationapi.html)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `host`       | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见[获取环信即时通讯 IM 的信息](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`   | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见[获取环信即时通讯 IM 的信息](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `app_name`   | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见[获取环信即时通讯 IM 的信息](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `server_id`  | String | 是       | 社区 ID。                                                  |
| `channel_id` | String | 是       | 频道 ID。                                                 |
| `channel_category_id` | String | 是       | 频道分组 ID。                                                 |
| `user_id`    | String | 是       | 用户 ID。                                                    |

:::tip
对于分页获取数据列表，若查询参数中的 `limit` 和 `cursor` 均未设置，则服务器返回首页的数据列表。
:::

### 响应参数

| 参数       | 类型   | 描述                             |
| :-----------------| :----- | :----------------------------------------------------------- |
| `channels.owner`   | String   | 频道创建者。                           |
| `channels.name`       | String   | 频道名称。                       |
| `channels.type`       | Int   | 频道类型：<br/> - `0`：公开频道；<br/> - `1`：私密频道。           |
| `channels.mode`       | Int   | 频道模式：<br/> - `0`：文字频道；<br/> - `1`：语聊频道。  |
| `channels.description`   | String    | 频道描述。|
| `channels.custom`    | String   | 频道的扩展信息。                      |
| `channels.created`    | Long   | 频道的创建时间，Unix 时间戳，单位为毫秒。       |
| `channels.server_id`   | String   | 社区 ID。                          |
| `channels.channel_category_id`   | String   | 频道分组 ID。        |
| `channels.channel_id`   | String   | 频道 ID。                          |
| `channels.max_users`    | Long   | 频道最大成员数量。                      |
| `channels.default_channel` | Int | 是否为社区的默认频道：<br/> - `0`：否；<br/> - `1`：是。         |
| `rtc_name`    | String   | RTC 频道名称。该名称在加入 RTC 频道时使用。若使用声网 RTC，该名称还用于[生成 RTC Token](https://docportal.shengwang.cn/cn/voice-call-4.x/token_server_android_ng?platform=Android)。<br/>该参数仅在创建语聊频道时返回，若创建语聊房频道时未指定 `rtc_name`，服务器将使用频道 ID 作为该参数的值返回。                   |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

Authorization：`Bearer ${YourToken}`

为提高项目的安全性，环信使用 App Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 需使用 App Token 的鉴权方式，详见 [使用环信 App Token 鉴权](/product/easemob_app_token.html)。

## 创建频道分组

在社区下创建一个频道分组，将多个频道归入一个频道分组方便管理。

每个社区下最多可以创建 50 个频道分组。每个频道只能加入一个频道分组。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/circle/channel/category
```

#### 路径参数

参数及描述详见[公共参数](#公共参数)。

#### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                            |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### 请求 body

| 参数        | 类型   | 是否必需 | 备注                                                         |
| :---------- | :----- | :------- | :----------------------------------------------------------- |
| `server_id` | String | 是       | 社区 ID，即频道分组所属的社区。           |
| `name` | String | 是       | 频道分组名称，长度不能超过 50 个字符。                        |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型   | 描述                |
| :-------- | :----- | :------------------ |
| `code`      | Int    | 环信超级社区的服务状态码。 |
| `channel_category_id` | String | 频道分组 ID。   |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/category' -d '{
 		"server_id" : "19SW5Q85jHxxxxx6T5kexvn",
 		"name" : "channel category name"
}'
```

#### 响应示例

```json
{
    "code": 200,
    "channel_category_id": "77a9860xxxxxx2b54881025861c",
}
```

## 修改频道分组的名称

修改指定社区下的特定频道分组的名称。

### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/circle/channel/category/{channel_category_id}
```

#### 路径参数

参数及描述详见[公共参数](#公共参数)。

#### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                            |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

#### 请求 body

| 参数        | 类型   | 是否必需 | 备注                                                         |
| :---------- | :----- | :------- | :----------------------------------------------------------- |
| `server_id`  | String | 是       | 社区 ID，即要修改的频道分组所属社区的 ID。           |
| `name`    | String | 是       | 修改后的频道分组名称，长度不能超过 50 个字符。                        |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                |
| :----- | :--- | :------------------ |
| `code`   | Int  | 环信超级社区的服务状态码。 |
| `channelCategory` | JSON | 频道分组的数据。       |
| `channelCategory.name`       | String   | 修改后的频道分组名称。                       |
| `channelCategory.created`    | Long   | 频道分组的创建时间，Unix 时间戳，单位为毫秒。                     |
| `channelCategory.channel_category_id`   | String   | 频道分组 ID。                          |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](/document/server-side/error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/category/XXX' -d '{
 		"server_id" : "19SW5Q85jHxxxxx6T5kexvn",
 		"name" : "update channel category name"
}'
```

#### 响应示例

```json
{
    "code": 200,
    "channelCategory": {
				"name": "update channel category name",
				"created": 1667471759201,
				"server_id": "19SW5Q85jHxxxxx6T5kexvn",
				"channel_category_id": "77a9860xxxxxx2b54881025861c"
		}
}
```

## 删除社区下的频道分组

删除指定社区下的特定频道分组。删除频道分组后，该频道分组下的所有频道会添加到社区的默认频道分组中。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/circle/channel/category/{channel_category_id}?serverId={server_id}
```

#### 路径参数

参数及描述详见[公共参数](#公共参数)。

#### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段 | 类型 | 描述                |
| :--- | :--- | :------------------ |
| `code` | Int  | 环信超级社区的服务状态码。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/category/XXX?serverId=XXX'
```

#### 响应示例

```json
{
    "code": 200
}
```

## 更换频道的频道分组

将指定频道从当前频道分组转移至其他频道分组。

### HTTP 请求

```http
POST 
http://{host}/{org_name}/{app_name}/circle/channel/category/member/transfer?serverId={server_id}&channelCategoryId={channel_category_id}&channelId={channel_id}
```

#### 路径参数

参数及描述详见[公共参数](#公共参数)。

#### 查询参数

| 参数                  | 类型   | 是否必需 | 描述                                                         |
| :-------------------- | :----- | :------- | :----------------------------------------------------------- |
| `server_id`           | String | 是       | 社区 ID。                                                    |
| `channel_category_id` | String | 否       | 频道分组 ID。请求时若设置了该参数，会将频道转移至指定的频道分组中；若不设置该参数，则将频道转移至社区的默认频道分组中。   |
| `channel_id`          | String | 是       | 要转移频道分组的频道 ID。                                                    |

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                          |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段         | 类型   | 描述                                                 |
| :----------- | :----- | :--------------------------------------------------- |
| `code`       | Int    | 环信超级社区的服务状态码。                           |

其他字段及描述详见[公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/category/member/transfer?serverId=XXX&channelCategoryId=XXX&channelId=XXX'
```

#### 响应示例

```json
{
    "code": 200
}
```

## 获取社区下的频道分组列表

分页获取指定社区下的频道分组列表。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/category/list?serverId={server_id}&limit={limit}&cursor={cursor} 
```

#### 路径参数

参数及描述详见[公共参数](#公共参数)。

#### 查询参数

| 参数 | 类型   | 是否必需 | 描述                                                         |
| :--- | :----- | :------- | :----------------------------------------------------------- |
| `server_id` | String | 是       | 社区 ID。|
| `limit` | Int    | 否  | 每页获取的社区下的频道分组数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页获取时为必需。 |
| `cursor`     | String  | 否  | 游标，指定数据查询的起始位置。该参数仅在分页获取时为必需。       |

#### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                            |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型 | 描述                   |
| :------ | :--- | :--------------------- |
| `code`    | Int  | 环信超级社区的服务状态码。    |
| `count`   | Int  | 获取的频道分组数量。 |
| `channelCategoryList` | List | 获取的频道分组列表。 |
| `channelCategoryList.name` | String| 频道分组名称。 |
| `channelCategoryList.created` | Long | 频道分组的创建时间。 |
| `channelCategoryList.channel_category_id` | String | 频道分组 ID。 |
| `cursor`    | String   | 查询游标，指定下次数据查询的起始位置。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/category/list?serverId=XXX'
```
#### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "channelCategoryList": [
        {
        		"name": "channel category name",
				"created": 1667471759201,
				"server_id": "19SW5Q85jHxxxxx6T5kexvn",
				"channel_category_id": "77a9860xxxxxx2b54881025861c"
        }
    ],
    "cursor": "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aXXXXXXXXXXXXXX"
}
```

## 获取指定频道分组下的频道列表

分页获取指定频道分组下的所有频道的列表（包括公开和私密频道）。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/category/{channel_category_id}/member/list?serverId={server_id}&limit={limit}&cursor={cursor} 
```

#### 路径参数

参数及描述详见[公共参数](#公共参数)。

#### 查询参数

| 参数 | 类型   | 是否必需 | 描述                                                         |
| :--- | :----- | :------- | :----------------------------------------------------------- |
| `server_id` | String | 是       | 社区 ID。|
| `limit` | Int    | 否  | 每页获取的频道数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页获取时为必需。|
| `cursor`     | String  | 否  | 游标，指定数据查询的起始位置。该参数仅在分页获取时为必需。       |

#### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段  | 类型 | 描述                 |
| :---- | :--- | :------------------- |
| `code`  | Int  | 环信超级社区的服务状态码。  |
| `count` | Int  | 获取的指定频道分组下的频道数量。 |
| `channels` | List | 获取的频道列表。 |
| `cursor` | String  | 游标，指定下次数据查询的起始位置。 |

其他字段及描述详见[公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/category/XXX/member/list?serverId=xxx?limit={limit}&cursor={cursor}'
```

#### 响应示例

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

## 获取指定频道分组下的公开频道列表

分页获取指定频道分组下的公开频道列表。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/category/{channel_category_id}/public/member/list?serverId={server_id}&limit={limit}&cursor={cursor} 
```

#### 路径参数

参数及描述详见[公共参数](#公共参数)。

#### 查询参数

| 参数 | 类型   | 是否必需 | 描述                                                         |
| :--- | :----- | :------- | :----------------------------------------------------------- |
| `server_id` | String | 是       | 社区 ID。|
| `channel_category_id` | String | 是       | 频道分组 ID。|
| `limit` | Int    | 否  | 每页获取的公开频道数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页获取时为必需。|
| `cursor`     | String  | 否  | 游标，指定数据查询的起始位置。该参数仅在分页获取时为必需。       |

#### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段  | 类型 | 描述                 |
| :---- | :--- | :------------------- |
| `code`  | Int  | 环信超级社区的服务状态码。  |
| `count` | Int  | 获取的公开频道数量。 |
| `channels` | List | 获取的指定频道分组下的公开频道列表。 |
| `cursor` | String  | 游标，指定下次数据查询的起始位置。 |

其他字段及描述详见[公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/category/XXX/public/member/list?serverId=XXX'
```

#### 响应示例

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
## 获取指定频道分组下的私密频道列表

分页获取频道分组下的私密频道列表。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/category/{channel_category_id}/private/member/list?serverId={server_id}&limit={limit}&cursor={cursor} 
```

#### 路径参数

参数及描述详见[公共参数](#公共参数)。

#### 查询参数

| 参数 | 类型   | 是否必需 | 描述                                                         |
| :--- | :----- | :------- | :----------------------------------------------------------- |
| `server_id` | String | 是       | 社区 ID。|
| `limit` | Int    | 否  | 每页获取的社区频道分组下私密频道数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页获取时为必需。 |
| `cursor`     | String  | 否  | 游标，指定数据查询的起始位置。该参数仅在分页获取时为必需。       |

#### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段  | 类型 | 描述                 |
| :---- | :--- | :------------------- |
| `code`  | Int  | 环信超级社区的服务状态码。  |
| `count` | Int  | 获取的私密频道数量。 |
| `channels` | List | 获取的指定频道分组下的私密频道列表。 |
| `cursor` | String  | 游标，指定下次数据查询的起始位置。 |

其他字段及描述详见[公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/category/XXX/private/member/list?serverId=XXX'
```

#### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "channels": [
        {
        		"owner": "user1",
        		"name": "chat channel",
        		"type": 1,
        		"mode": 0,
        		"description": "chat channel",
        		"custom": "custom",
        		"created": 1675845650856,
        		"server_id": "19VM9oPBasxxxxxx0tvWViEsdM",
        		"channel_category_id": "77a9860xxxxxx2b54881025861c",
        		"channel_id": "2090xxxxxx2369",
        		"max_users": 200,
        		"default_channel": 0
        }
    ],
    "cursor": "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aXXXXXXXXXXXXXX"
}
```

## 获取指定频道分组下用户加入的频道列表

分页获取指定频道分组下用户加入的频道 ID 列表。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/circle/channel/category/{channel_category_id}/user/joined/member/list?serverId={server_id}&userId={user_id}&limit={limit}&cursor={cursor} 
```

#### 路径参数

参数及描述详见[公共参数](#公共参数)。

#### 查询参数

| 参数 | 类型   | 是否必需 | 描述                                                         |
| :--- | :----- | :------- | :----------------------------------------------------------- |
| `server_id` | String | 是       | 社区 ID。|
| `user_id` | String | 是       | 用户 ID。|
| `limit` | Int    | 否  | 每页获取的用户在指定频道分组下加入的频道数量。取值范围为 [1,20]，默认值为 `20`。该参数仅在分页获取时为必需。|
| `cursor`     | String  | 否  | 游标，指定数据查询的起始位置。该参数仅在分页获取时为必需。       |

#### 请求 header

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。                           |
| `Authorization` | String | 是       | 该管理员的鉴权 App Token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 App Token 值。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段  | 类型 | 描述                 |
| :---- | :--- | :------------------- |
| `code`  | Int  | 环信超级社区的服务状态码。  |
| `count` | Int  | 获取的用户在指定的频道分组下加入的频道数量。 |
| `channelIds` | List | 获取的用户在指定的频道分组下加入的频道 ID 列表。 |
| `cursor` | String  | 游标，指定下次数据查询的起始位置。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/circle/channel/category/XXX/user/joined/member/list?serverId=XXX&userId=XXX'
```

#### 响应示例

```json
{
    "code": 200,
    "count": 1,
    "channelIds": [
        "2090xxxxxx2369"
    ],
    "cursor": "ZGNiMjRmNGY1YjczYjlhYTNkYjk1MDY2YmEyNzFmODQ6aXXXXXXXXXXXXXX"
}
```


