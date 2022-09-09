# 使用环信用户 token 鉴权

<Toc />

如果你的用户在客户端使用环信 token 登录和鉴权，可参考本篇获取用户 token。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](/product/enable_and_configure_IM.html)。
- 已从服务端获取 app token，详见 [使用环信 app token 鉴权](/product/easemob_app_token.html)。
- 了解环信 IM API 的调用频率限制，详见[接口频率限制](/product/limitationapi.html)。

## 公共参数

以下表格列举了环信即时通讯 RESTful API 的公共请求参数和响应参数：

### 请求参数

| 参数       | 类型   | 描述                                                                                                                 |
| :--------- | :----- | :------------------------------------------------------------------------------------------------------------------- |
| `host`     | String | 你在环信即时通讯云控制台注册项目时所在的 [集群服务器地址](/document/server-side/overview.html#请求域名)。 |
| `org_name` | String | 即时通讯服务分配给每个企业（组织）的唯一标识。你可以通过控制台获取该字段。                                           |
| `app_name` | String | 你在环信即时通讯云控制台注册项目时填入的应用名称。                                                                   |

### 响应参数

| 参数                 | 类型   | 描述                                                                                                                                          |
| :------------------- | :----- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`             | String | 请求方式。                                                                                                                                    |
| `organization`       | String | 即 `org_name`，即时通讯服务分配给每个企业（组织）的唯一标识。你可以通过控制台获取该字段。                                                     |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。                                                                                                  |
| `applicationName`    | String | 即 `app_name`，你在环信即时通讯云控制台注册项目时填入的应用名称。                                                                             |
| `uri`                | String | 请求 URL。                                                                                                                                    |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                                                                                             |
| `entities`           | JSON   | 详细信息。                                                                                                                                    |
| `entities.uuid`      | String | 用户的 UUID。即时通讯服务为该请求中的 app 或用户生成的唯一内部标识，用于生成 User Token。                                                     |
| `entities.type`      | String | 对象类型，无需关注。                                                                                                                          |
| `entities.created`   | Long   | 注册用户的 Unix 时间戳，单位为毫秒。                                                                                                          |
| `entities.modified`  | Long   | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。                                                                                              |
| `entities.username`  | String | 用户 ID，长度不可超过 64 个字节。                                                                                                             |
| `entities.activated` | Bool   | 用户是否为活跃状态：<br/> - `true`：用户为活跃状态。<br/> - `false`：用户为封禁状态。如要使用已被封禁的用户账户，你需要调用解禁用户解除封禁。 |
| `data`               | JSON   | 实际获取的数据详情。                                                                                                                          |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。                                                                                                         |
| `duration`           | Int    | 从发送 HTTP 请求到响应的时长, 单位为毫秒。                                                                                                    |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 Authorization 字段：

Authorization：`Bearer ${YourAppToken}`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文介绍的即时通讯 REST API 需使用 App Token 的鉴权方式，详见 [使用 Token 鉴权](easemob_app_token.html)。

## 获取用户 token

环信提供 2 种方式进行登录：

1. “用户 ID” 和 “密码”；
2. “用户 ID” + “用户 Token”。

方式 1：在 SDK 进行登录时，使用 “用户 ID” 和 “密码” 登录。

该方式集成相对简单，用户注册后，直接使用 “用户 ID” 和 “密码” 登录。登录成功后，SDK 会获取一个长期的用户 token。

方式 2：开发者使用 RESTful API 在自己的应用服务器管理用户 token，在客户端上登录时，由应用服务器下发用户 token，SDK 使用用户 ID 和用户 token 进行登录。

该方式开发者可以对用户 token 进行管理。获取用户 token 时，可以设置 token 有效期。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/token
```

##### 路径参数

参数及说明详见[公共参数](#公共参数)。

##### 请求 header

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `Content-Type` | String | 是       | 内容类型。请填 `application/json`。 |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。 |

##### 请求 body

| 参数         | 类型   | 是否必需<div style="width: 80px;"></div> | 描述 |
| :----------- | :----- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grant_type` | String | 是       | 授权方式，此处的值固定是 `password`，即通过密码登录。                                                                                                                                                                   |
| `username`   | String | 是       | 用户 ID。                                                                                                                                                                                                               |
| `password`   | String | 是       | 用户的登录密码。                                                                                                                                                                                                        |
| `ttl`        | String | 是       | token 有效期，单位为秒。此外，也可通过环信即时通讯云控制台设置，参见 [用户认证详情页面](https://console.easemob.com/app/applicationOverview/userManagement)。该参数值以最新设置为准。注意：VIP 5 集群该参数单位为毫秒。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 200，表示成功获取 token，响应包体中包含以下字段：

| 字段            | 类型   | 描述                                                                                     |
| :-------------- | :----- | :--------------------------------------------------------------------------------------- |
| `access_token`  | String | 有效的用户 token。                                                                       |
| `expires_in`    | Long   | token 有效期，单位为秒。在有效期内无需重复获取。<br/> 注意：VIP 5 集群该参数单位为毫秒。 |
| `user`          | JSON   | 用户相关信息。                                                                           |
| `user.username` | String | 用户 ID。                                                                                |

其他字段及说明详见[公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{
   "grant_type": "password",
   "username": "C",
   "password": "1",
   "ttl": "1024000"
 }' 'http://XXXX/XXXX/XXXX/token'
```

##### 响应示例

```json
{
    "access_token": "YWMtrR6ECkz8Eeyx6Y9j1eX9kbsMrFep3U6BvVj7KSnNonWqRx7gTPwR7Kzl-Q_xISNOAwMAAAF9UPZqbQAPoAAtYK9fWgaTNyuWoB3-6nGf_TXBx3Nt3XRZST-elU0x2A",
    "expires_in": 1024000,
    "user": {
        "uuid": "aa471ee0-XXXX-XXXX-ace5-f90
        ff121234e",
        "type": "user",
        "created": 1637740861395,
        "modified": 1637740861395,
        "username": "c",
        "activated": true
    }
}
```
