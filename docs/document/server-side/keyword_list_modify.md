# 修改关键词名单

## 功能说明

修改单个关键词名单，包括名单的名称、生效范围、匹配的标签、对匹配的消息内容的审核处理、与消息内容是否为精确匹配等参数。

**调用频率上限**：100 次/秒/App Key 

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯云控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 已从服务端获取 app token，详见 [使用 App Token 鉴权](easemob_app_token.html)。
- 了解环信 IM API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文介绍的即时通讯所有 RESTful API 均需使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/moderation/text/list/{list_id}
```

### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `list_id`        | String | 是       | 关键词名单 ID。 |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type` | String | 是       | 内容类型。请填 `application/json`。 |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### 请求 body

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `name`        | String | 是       | 关键词名单的名称，不能超过 32 个字符。 |
| `scope` | String | 是       | 关键词名单的生效范围：<br/> - `ALL`：对所有会话均生效；<br/> - `CHAT`：仅对单聊会话生效；<br/> - `GROUP`：仅对群组会话生效；<br/> - `ROOM`：仅对聊天室会话生效；<br/> - `TAG`：仅对指定标签下的用户、群组或聊天室生效。|
| `tagId`        | String | 否       | 标签 ID。该参数仅在 `scope` 为 `TAG` 时必须设置。   |
| `disposition`        | String | 是       | 对匹配关键词的消息内容的审核处理：<br/> - `PASS`：忽略，对匹配的关键词不处理。<br/> - `REJECT`：拦截，对内容匹配关键词的消息进行拦截，不下发给接收方。<br/> - `EXCHANGE`：替换为 `***`。  |
| `fullMatch`        | Boolean | 否       | 关键词与消息内容是否为精确匹配：<br/> - `true`：是  <br/> - (默认) `false`：否  |
| `userId`        | String | 否       | 用户 ID。  |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `status` | String | 请求状态。若请求成功，返回 `OK`。 |
| `entity` | JSON | 关键词名单的详情。 |
| - `id` | String | 关键词名单 ID。 |
| - `name` | String  | 关键词名单的名称。 |
| - `moderationId` | String | 审核 ID。开发者可忽略该参数。 |
| - `appkey` | String | 应用的 App Key。 |
| - `scope` | String | 关键词名单的生效范围。  |
| - `tagId` | String | 用户标签 ID。 |
| - `fullMatch` | Boolean | 关键词与消息内容是否为精确匹配。 |
| - `suggestion` | String | 对匹配关键词的消息内容的处理建议。该字段的值以及值的含义与 `disposition` 字段相同。  |
| - `disposition` | String | 对匹配关键词的消息内容的处理。  |
| - `quantity` | Int | 关键词数量。 |
| - `status` | String | 关键词名单的状态。<br> - `ACTIVE`：开启<br> - `CLOSE`：关闭。 |
| - `createDataTime` | Long | 关键词名单的创建时间。 |
| - `updateDataTime` | Long | 关键词名单的修改时间。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT 'https://XXXX/XXXX/XXXX/moderation/text/list/1xXXXXVlodF52URYQk7rZmd5s8k' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "name": "list_1",
      "scope": "ALL",
      "disposition": "PASS",
      "fullMatch": true,
      "userId": "v1"
    }' 
```

### 响应示例

```json
{
    "status": "OK",
    "entity": {
        "id": "1xXXXXVlodF52URYQk7rZmd5s8k",
        "name": "list_1",
        "moderationId": "159XXXXL0ylUvcBfVAZ0IRQNwW",
        "appkey": "XXXX#XXXX",
        "category": "DEFAULT",
        "scope": "ALL",
        "tagId": null,
        "fullMatch": true,
        "suggestion": "PASS",
        "disposition": "PASS",
        "quantity": 3,
        "status": "ACTIVE",
        "createDataTime": "2025-07-16T02:04:07.613+00:00",
        "updateDataTime": "2025-07-16T03:57:04.193+00:00"
    }
}
```

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------: | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 400 | Bad request | textList data is empty | 请求中传入的关键词名单 ID 参数 `list_id` 不存在，App Key 与 `list_id `无法对应。 | 传输正确的 `list_id` 参数。 |
| 400 | Bad request | The textList already exists | 请求中传入的关键词名单名称 `name` 重复。 | 修改 `name` 的值。 |
| 400 | Bad request | textList id is empty | 请求中传入的关键词名单 ID 参数 `list_id` 为空。 | 请传入正确的 `list_id`。 |

关于其他错误，你可以参考 [错误码页面](error.html) 了解可能的原因。
