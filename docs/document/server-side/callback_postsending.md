# 发送后回调

## 概述

发送后回调对所有聊天消息有效，包含通过 SDK 和 RESTful API 发送的单聊、群组和聊天室的消息。发送后回调通常用于 app 后台需要实现必要的数据同步的场景，例如：
- 针对客户消息的内容进行自动回复；
- 在你的应用服务器端及时保存聊天历史记录或者离线消息。

:::tip
1. 如果你对聊天消息没有时效性需求，可以直接通过免费的[聊天记录文件拉取 REST API](message_historical.html#历史消息记录的内容) 获取聊天记录，无需使用发送后回调。
2. 如果 app 开通了反垃圾/敏感词过滤，被识别的消息会在服务器被拦截并禁止发送，将不会回调。
:::

![](/images/server-side/im-callback1.png)

## 实现步骤

1. 开通回调服务：在[环信即时通讯云控制台](https://console.easemob.com/user/login)[开通回调服务](/product/enable_and_configure_IM.html#开通消息回调)。
2. 配置发送后回调规则：详见[规则配置说明](/product/enable_and_configure_IM.html#配置回调规则)。
3. 发送消息或进行群组、聊天室或联系人相关操作后，环信服务器向你的应用服务器发送回调请求。

## 发送后回调规则

要使用发送后回调，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)配置回调规则，详见[规则配置说明](/product/enable_and_configure_IM.html#配置回调规则)。

对于同一个 app 可以针对聊天消息、离线消息和通过 REST API 发送的消息配置不同的规则。如果 app 同时需要聊天消息和离线消息两种消息，建议区分回调地址。不过，规则也可以将这两种消息同时回调至一个指定服务器地址，在接收到消息后，可以对 `eventType` 判断，区分消息类型。

## 发送后回调延时

发送后回调接收延时指消息服务器接收到客户端聊天消息、再将消息成功回调至客户指定服务器地址的时间间隔。消息接收延时保障是 99.95% 的消息在 30s 内。

## 发送后回调重试

发送后回调重试，当环信服务器执行发出回调后，响应状态码非 200，则认为回调失败，然后立即重试。若再次失败，再记录一次失败。针对一条回调仅重试一次，重试失败后即丢弃。若开通了[补发回调存储信息功能](#补发回调存储信息)，则将消息放入异常存储中。

若 30 秒内累计 90 次失败，会封禁该 app 的回调规则。封禁规则为，24 小时内连续封禁计数最大为 5（若封禁次数超过 5 次，仍计为 5），首次封禁默认 5 分钟，后续封禁时间为封禁次数 * 5 分钟，即第一次封禁 5 分钟，第二次封禁 10 分钟，第三次封禁 15 分钟，第四次封禁 20 分钟，第五次封禁 25 分钟，后续封禁时间与第 5 次保持一致为 25 分钟。重试失败以及封禁期间的回调不会自动补录，可以下载历史消息记录自行补充。

:::tip
若有特殊需求不能丢失回调消息的情况下，请联系环信商务经理开通回调异常缓存功能，并使用[查询回调异常缓存](#查询回调存储详情)和[补发回调储存信息](#补发回调存储信息) 接口。
:::

## 回调示例

消息发送或相关操作发生后，环信服务器会向你的应用服务器发送 HTTP/HTTPS POST 请求，正文部分为 JSON 格式的字符串，字符集为 UTF-8。

回调时，环信服务器会对发送的正文进行 MD5 签名，使用的 MD5 为 `org.apache.commons.codec.digest.DigestUtils#md5Hex`。

### 请求示例

```json
{
  "callId": "XXXX-demo#XXXX-dp01-XXXX-8696-cf3b48b20e7e",
  "eventType": "chat_offline",
  "timestamp": 1600060847294,
  "chat_type": "groupchat",
  "group_id": "169XXXX21545",
  "from": "user1",
  "to": "user2",
  "msg_id": "8924312242322",
  "payload": {
    // 具体的消息内容。
  },
  "securityVersion": "1.0.0",
  "security": "2ca02c394bef9e7abc83958bcc3156d3"
}
```

| 参数              | 类型             |
| :---------------- | :------------------------------ |
| `callId`          | callId 为 `{appkey}\_{uuid}` 其中 UUID 为随机生成，作为每条回调的唯一标识。 |
| `eventType`       | - `chat` 聊天消息；<br/> - `chat_offline` 离线消息。  |
| `timestamp`       | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为毫秒。  |
| `chat_type`       | - `chat` 单聊回调；<br/> - `groupchat` 群聊回调包含了群组和聊天室的消息回调，默认全选。 |
| `group_id`        | 回调消息所在的群组，群聊时才有此参数，即 `chat_type` 为 `groupchat`。       |
| `from`            | 消息的发送方。         |
| `to`              | 消息的接收方。    |
| `msg_id`          | 消息的 ID。         |
| `payload`         | 消息内容，与通过 RESTful API 发送过来的一致，查看 [消息格式文档](message_historical.html#历史消息记录的内容)。 |
| `securityVersion` | 安全校验版本，目前为 1.0.0。请忽略此参数。      | 
| `security`        | 签名，格式如下: MD5（callId+Secret+timestamp）。关于 Secret，详见[规则配置说明](/product/enable_and_configure_IM.html#配置回调规则)。   | 

### 回调响应

环信 IM 服务器不会验证响应的内容，只要应用服务器返回的 HTTP 状态码为 200，即视为消息回调成功。

应用服务器收到回调消息后，向环信服务器发送的响应内容不能超过 1,000 个字符长度。如果连续发送超长的响应内容（30 秒内累计 90 次），会导致[回调规则封禁](#发送后回调重试)。

## 查询回调存储详情

查询 App Key 下由于异常（例如，连接超时、响应超时、回调规则封禁等）回调失败时存储的消息和事件类型集合，按每十分钟一个 date key 存储，然后用户可以根据消息集合按需拉取。

### 功能限制

- 异常存储过期时间默认 3 天，若有存储需及时补发。
- 补发重试次数建议控制在 10 次以内。

### 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization：Bearer YourAppToken`

为提高项目的安全性，使用 token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 支持使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/callbacks/storage/info    
```

### 路径参数

| 参数       | 类型   | 是否必需 | 描述       |
| :--------- | :----- | :------- | :--------------------- |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见[获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见[获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                     |
| :-------------- | :----- | :------- | :--------------------------------------- |
| `Authorization` | String | 是       | 鉴权 Token，管理员 Token（含）以上权限。 |

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应 body 包含如下字段：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :------------------ |
| `path`            | string | 请求路径。              |
| `uri`             | string | 请求路径的 URI。                                                               |
| `timestamp`       | long   | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为毫秒。                         |
| `organization`    | string | 你在环信 IM 管理后台注册的组织唯一标识。                                       |
| `application`     | string | 你在环信 IM 管理后台注册的 App 唯一标识。                                      |
| `action`          | string | 请求方法。   |
| `duration`        | long   | 请求耗时，单位为毫秒。                                                         |
| `applicationName` | string | 你在环信 IM 管理后台注册的 App 名称。                                          |
| `data`            | object | 响应数据内容。包括以下三个参数：`date`、`size` 和 `retry`。                    |
| - `date`            | String | 当前的 date key，即每 10 分钟内的消息和事件。key 为 10 分钟的起点。              |
| - `size`            | Int    | 该 date key 内的消息数量。                                                               |
| - `retry`           | Int    | 该 date key 内的数据已经重试补发的次数。未重试时值为 `0`。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](#响应状态码)了解可能的原因。

### 示例

#### 请求示例

```shell
curl -X GET 'https://a1.easemob.com/easemob-demo/easeim/callbacks/storage/info' \
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
  "path": "/callbacks",
  "uri": "https://XXXX/XXXX/XXXX/callbacks",
  "timestamp": 1631193031254,
  "organization": "XXXX",
  "application": "8dfb1641-XXXX-XXXX-bbe9-d8d45a3be39f",
  "action": "post",
  "data": [
    {
      "date": "202109091440",
      "size": 15,
      "retry": 0
    },
    {
      "date": "202109091450",
      "size": 103,
      "retry": 1
    }
  ],
  "duration": 153,
  "applicationName": "XXXX"
}
```

## 补发回调存储信息

调用接口根据存储集合进行回调补发。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/callbacks/storage/retry  
```

#### 路径参数

| 参数       | 类型   | 是否必需 | 描述           |
| :--------- | :----- | :------- | :---------------------------- |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见[获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见[获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                      |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型，请填 `application/json`。                                       |
| `Authorization` | String | 是       | 鉴权 App Token 的值。详见[使用 App Token 鉴权](easemob_app_token.html)。 |

#### 请求 body

| 参数        | 类型   | 是否必需 | 描述                                                                   |
| :---------- | :----- | :------- | :--------------------------------------------------------------------- |
| `date`      | String | 是       | 可以补发的一个十分钟 date key，key 为十分钟的起点。                    |
| `retry`     | Int    | 否       | 开发已重试的次数。考虑到补发也可能失败，服务器会继续存储。最开始是 0。 |
| `targetUrl` | String | 否       | 补发消息的回调地址，如果为空，则使用原回调规则的回调地址。             |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应 body 包含如下字段：

| 参数           | 类型   | 描述                                                                           |
| :------------- | :----- | :----------------------------------------------------------------------------- |
| `path`         | String | 请求路径。                                                                     |
| `uri`          | String | 请求路径的 URI。                                                               |
| `timestamp`    | long   | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为毫秒。                         |
| `organization` | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`  | String | 你在环信 IM 管理后台注册的 app 唯一标识。                                      |
| `action`       | String | 请求方法。                                                                     |
| `data`         | Bool   | - `success`：成功；<br/> - `failure`：失败。                                   |
| `duration`     | long   | 请求耗时，单位为毫秒。                                                         |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](#响应状态码)了解可能的原因。

### 示例

#### 请求示例

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/callback/storage/retry' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
--data-raw '{
    "date": "202108272230",
    "retry": 0,
    "targetUrl": "https://localhost:8000/test"
}'
```

#### 响应示例

```json
{
  "path": "/callbacks",
  "uri": "https://XXXX/XXXX/XXXX/callbacks",
  "timestamp": 1631194031721,
  "organization": "XXXX",
  "application": "8dfb1641-XXXX-XXXX-bbe9-d8d45a3be39f",
  "action": "post",
  "data": "success",
  "duration": 225,
  "applicationName": "XXXX"
}
```

### 响应状态码

| 状态码 | 描述                               |
| :----- | :--------------------------------- |
| 200    | 请求成功。                         |
| 400    | 请求参数错误，请根据返回提示检查。 |
| 401    | 用户权限错误。                     |
| 403    | 服务未开通或权限不足。             |
| 429    | 单位时间内请求过多。               |
| 500    | 服务器内部错误。                   |
