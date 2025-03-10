# 聊天室黑名单管理

<Toc />

环信即时通讯 IM 提供多个接口实现聊天室黑名单管理，包括查询聊天室黑名单、将成员添加和移除聊天室黑名单。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见[接口频率限制](limitationapi.html)。
- 了解聊天室成员相关限制，详见[使用限制](/product/limitation.html#聊天室成员)。

## 公共参数

#### 请求参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `chatroom_id` | String | 是       | 聊天室 ID。  |

#### 响应参数

| 参数                 | 类型   | 描述   |
| :------------------- | :----- | :------------ |
| `action`             | String | 请求方法。  |
| `host`               | String | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名，与请求参数 `host` 相同。    |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。      |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。  |
| `applicationName`    | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。   |
| `uri`                | String | 请求 URL。   |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。   |
| `id`                 | String | 聊天室 ID，聊天室唯一标识，由环信即时通讯 IM 服务器生成。    |
| `entities`           | JSON   | 响应实体。  |
| `data`               | JSON   | 数据详情。 |
| `username`           | String | 用户 ID。     |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。   |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长，单位为毫秒。     |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 REST API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 查询聊天室黑名单

获取指定聊天室的黑名单。

**调用频率**：100 次/秒/App Key

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users
```

##### 路径参数

具体参数及详细说明请参见[公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。|
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的HTTP状态码为 `200`，表示请求成功，`data` 响应体中字段包含以下参数。


| 参数 | 类型   | 描述     |
| :------ | :----- | :--------- |
| `data`  | Array | 聊天组黑名单中的用户 ID。   |
| `count` | Int | 聊天组黑名单中的用户数量。 |

其他字段及说明请参见[公共参数](#公共参数)。

如果返回的 HTTP 状态码不是 200，则表示请求失败，可能的原因请参见 [错误码](#错误码)。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "uri": "http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users",
  "entities": [],
  "data": [
    "user2",
    "user3"
  ],
  "timestamp": 1543466293681,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "XXXX",
  "count": 2
}

```

## 将单个用户添加到聊天室黑名单

将指定用户添加到聊天室黑名单。一旦添加到聊天室黑名单，用户将无法再加入聊天室，既不能在聊天室中发送消息，也不能接收消息。

不能将聊天室所有者添加到聊天室黑名单。

**调用频率**：100 次/秒/App Key

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{username}
```

##### 路径参数

| 参数            | 类型   | 是否必需 | 描述                |
| :-------------- | :----- | :------- | :----------------------- |
| `username`  | String | 是       | 要添加到聊天室黑名单中的用户 ID。|

其他字段及说明请参见[公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。|
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的HTTP状态码为 `200`，表示请求成功，响应体中的 `data` 字段包含如下参数。

| 参数 | 类型   | 描述     |
| :------ | :----- | :--------- |
| `result` | Bool | 用户是否成功添加至聊天室黑名单。<br/> - `true`：是 <br/> - `false`：否 |
| `user`   | String   | 已添加到聊天室黑名单的用户名。                |

具体参数及详细说明请参见[公共参数](#公共参数)。

如果返回的 HTTP 状态码不是`200`，则表示请求失败。您可以参考[错误码](#错误码)了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users/user1'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "uri": "http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users/user1",
  "entities": [],
  "data": {
    "result": true,
    "action": "add_blocks",
    "user": "user1",
    "chatroomid": "XXXX"
  },
  "timestamp": 1542539577124,
  "duration": 27,
  "organization": "XXXX",
  "applicationName": "XXXX"
}

```

## 将多个用户添加到聊天室黑名单

将多个用户添加到聊天室黑名单。一旦被添加到聊天室黑名单，用户将无法再加入聊天室，既不能在聊天室中发送消息，也不能接收消息。

每次最多可添加 60 位用户到聊天室黑名单，但不可将聊天室所有者添加到聊天室黑名单。

**调用频率**：100 次/秒/App Key

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users
```

##### 路径参数

参数及详细说明请参见[公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。|
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数 | 类型   | 描述     |
| :------ | :----- | :--------- |
| `usernames` | Array | 要添加到聊天室黑名单的用户名数组。每次最多可以指定 60 个用户名，以逗号 (,) 分隔。 |

#### HTTP 响应

##### 响应 body

如果返回的HTTP状态码为 `200`，表示请求成功，响应体中的 `data` 字段包含如下参数。

| 参数 | 类型   | 描述     |
| :------ | :----- | :--------- |
| `result` | Boolean | 用户是否成功添加至聊天室黑名单。<br/> - `true`： 是<br/> - `false`：否 |
| `reason` | String   | 用户无法加入聊天室黑名单的原因。    |
| `user`   | String   | 成功添加到聊天室黑名单的用户 ID。    |

具体参数及详细说明请参见[公共参数](#公共参数)。

如果返回的 HTTP 状态码不是`200`，则表示请求失败。您可以参考[错误码](#错误码)了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{  
   "usernames": [  
     "user3","user4"  
   ]  
 }' 'http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users'

```

##### 响应示例

```json
{
  "action": "post",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "uri": "http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users",
  "entities": [],
  "data": [
    {
      "result": false,
      "action": "add_blocks",
      "reason": "user: user3 doesn't exist in chatroom: XXXX",
      "user": "user3",
      "chatroomid": "XXXX"
    },
    {
      "result": true,
      "action": "add_blocks",
      "user": "user4",
      "chatroomid": "XXXX"
    }
  ],
  "timestamp": 1542540095540,
  "duration": 16,
  "organization": "XXXX",
  "applicationName": "XXXX"
}

```

## 从聊天室黑名单移除单个用户

从聊天室黑名单中删除指定用户。要将黑名单中的用户重新添加回聊天室，你需要先将该用户从黑名单中移除。

**调用频率**：100 次/秒/App Key

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{username}
```

##### 路径参数

具体参数及详细说明请参见[公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。|
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的HTTP状态码为`200`，表示请求成功，响应体中的data字段包含如下参数。

| 参数 | 类型   | 描述     |
| :------ | :----- | :--------- |
| `result` | Boolean | 用户是否成功从聊天室黑名单中删除。<br/> - `true`：是 <br/> - `false`：否 |
| `user`   | String   | 该用户 ID 已从聊天室黑名单中删除。|

具体参数及详细说明请参见[公共参数](#公共参数)。

如果返回的 HTTP 状态码不是`200`，则表示请求失败。你可以参考[错误码](#错误码)了解可能的原因。

#### 示例

##### 请求示例

```shell

# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users/user1'

```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "uri": "http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users/user1",
  "entities": [],
  "data": {
    "result": true,
    "action": "remove_blocks",
    "user": "user1",
    "chatroomid": "XXXX"
  },
  "timestamp": 1542540470679,
  "duration": 45,
  "organization": "XXXX",
  "applicationName": "XXXX"
}

```

## 从聊天室黑名单移除多个用户

从聊天室黑名单中移除多个指定用户。要将黑名单中的用户重新添加回聊天室，你需要先将这些用户从黑名单中移除。每次最多可以从聊天室黑名单中移除 60 个用户。

**调用频率**：100 次/秒/App Key

#### HTTP请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{usernames}

```

##### 路径参数

参数及详细说明请参见[公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。|
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 header

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应体中的 `data` 字段包含如下参数。

| 参数            | 类型   | 是否必需 | 描述             |
| :-------------- | :----- | :------- | :--------------------------- |
| `username` | String | 是   | 要从聊天室黑名单中删除的用户 ID。每次最多可以指定 60 个用户 ID，以逗号 (,) 分隔。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为`200`，表示请求成功，响应体中的 `data` 字段包含如下参数。

| 参数 | 类型   | 描述     |
| :------ | :----- | :--------- |
| `result` | Bool | 用户是否成功从聊天室黑名单中删除。<br/> - `true`： 是<br/> - `false`：否 |
| `user`   | String   | 从聊天室黑名单中删除的用户 ID。   |

具体参数及详细说明请参见[公共参数](#公共参数)。

如果返回的 HTTP 状态码不是`200`，则表示请求失败。你可以参考[错误码](#错误码)了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users/user1%2Cuser2'

```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "uri": "http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users/user1%2Cuser2",
  "entities": [],
  "data": [
    {
      "result": true,
      "action": "remove_blocks",
      "user": "user1",
      "chatroomid": "XXXX" 
    },
    {
      "result": true,
      "action": "remove_blocks",
      "user": "user2",
      "chatroomid": "XXXX"
    }
  ],
  "timestamp": 1542541014655,
  "duration": 29,
  "organization": "XXXX",
  "applicationName": "XXXX"
}

```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | invalid_parameter | removeBlacklist: list size more than max limit : 60 | 批量删除超过上限 60。 | 调整要移除的数量在限制以下。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | forbidden_op | users [XX] are not members of this group! | 要移除黑名单的用户 ID 不在聊天室中。 | 传入聊天室黑名单中的成员的用户 ID。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室不存在。 | 使用合法的聊天室 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。