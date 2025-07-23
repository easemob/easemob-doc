# 创建关键词名单

## 功能说明

- 创建关键词名单。
- 关键词名单为增值服务，在 [文本审核规则](/product/moderation/moderation_rule_config.html#设置审核规则) 中应用。使用前，你需要开通 [文本审核服务](/product/moderation/moderation_enable.html), 配置 [文本审核规则](/product/moderation/moderation_rule_config.html#设置审核规则)，并开通 [关键词名单服务](/product/moderation/keyword_review.html#使用关键词审核)。
- 创建的名单会在环信控制台的 **关键词名单** 列表（**即时通讯** > **内容审核** > **文本审核** > **关键词名单**）中展示。你可以在环信控制台编辑、删除名单或进行添加/删除关键词等操作。
- 每个应用最多可配置 10 个名单, 每个名单最多可添加 10,000 个关键词，即每个应用最多可配置 100,000 个词条。

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
POST https://{host}/{org_name}/{app_name}/moderation/text/list
```

### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

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
| `tagId`        | String | 否       | 标签 ID。该参数仅在 `scope` 为 `TAG` 时必须设置。  |
| `disposition`        | String | 是       | 对匹配关键词的消息内容的审核处理：<br/> - `PASS`：忽略，对匹配的关键词不处理。<br/> - `REJECT`：拦截，对内容匹配关键词的消息进行拦截，不下发给接收方。<br/> - `EXCHANGE`：替换为 `***`。|
| `fullMatch`        | Boolean | 否       | 关键词与消息内容是否为精确匹配：<br/> - `true`：是  <br/> - (默认) `false`：否  |
| `userId`        | String | 否       | 创建关键词名单的用户 ID。   |
| `textContexts`        | Array | 是       | 关键词。每次最多可包含 200 个关键词，每个关键词的不能超过 128 个字符。  |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `status` | String | 请求状态。若请求成功，返回 `OK`。 |
| `entity` | JSON | 关键词名单的详情。 |
| - `id` | String | 关键词名单 ID。 |
| - `name` | String  | 关键词名单的名称。 |
| - `moderationId` | String | 审核 ID。开发者可忽略该参数。|
| - `appkey` | String | 应用的 App Key。 |
| - `category` | String | 值为 `DEFAULT`，表示关键词名单。 |
| - `scope` | String | 关键词名单的生效范围。  |
| - `tagId` | String | 标签 ID。 |
| - `fullMatch` | Boolean | 关键词与消息内容是否要精确匹配。 |
| - `suggestion` | String | 对匹配关键词的消息内容的处理建议。该字段的值以及值的含义与 `disposition` 字段相同。  |
| - `disposition` | String | 对匹配关键词的消息内容的处理。关于该字段的说明，详见 [请求 body](#请求-body) 中的 `disposition`。 |
| - `quantity` | Int | 关键词数量。 |
| - `status` | String | 关键词名单的状态：<br> - `ACTIVE`：开启<br> - `CLOSE`：关闭 |
| - `createDataTime` | Long | 关键词名单的创建时间。|
| - `updateDataTime` | Long | 关键词名单的修改时间。 |
| - `textList` | Array | 关键词列表。<br> - `id`：String, 关键词 ID。 <br> - `appId`：String，应用 ID。 <br> - `word`：String, 关键词。  <br> - `userId`：String，添加关键词的用户 ID。 <br/> - `listId`：String，关键词名单 ID。 <br/> - `status`：String，关键词状态。开发者可忽略该参数。<br> - `createDateTime`：Long，关键词添加时间。 <br> - `updateDateTime`：Long，关键词更新时间。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "name": "list_1",
      "scope": "ALL",
      "disposition": "PASS",
      "fullMatch": true,
      "userId": "v1",
      "textContexts": ["music", "sport", "entertainment"]
    }' 
```

### 响应示例

```json
{
    "status": "OK",
    "entity": {
        "id": "1xIXXXXlodF52URYQk7rZmd5s8k",
        "name": "list_1",
        "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
        "appkey": "XXXX#XXXX",
        "category": "DEFAULT",
        "scope": "ALL",
        "tagId": null,
        "fullMatch": true,
        "suggestion": "PASS",
        "disposition": "PASS",
        "quantity": 3,
        "status": "ACTIVE",
        "createDataTime": 1752631447613,
        "updateDataTime": 1752631447613,
        "textList": [
            {
                "id": "1xXXXXzCd7dhlkbkgE9REtO760H",
                "appId": "1XXXXAi7wabrqsrjCV449Kljh98",
                "word": "music",
                "userId": "v1",
                "listId": "1xXXXXlodF52URYQk7rZmd5s8k",
                "status": true,
                "createDateTime": 1752631447638,
                "updateDateTime": 1752631447638
            },
            {
                "id": "1xXXXXSXWJyUAkatENR9VM9cM8H",
                "appId": "1DHFtAi7wabrqsrjCV449Kljh98",
                "word": "entertainment",
                "userId": "v1",
                "listId": "1xXXXXlodF52URYQk7rZmd5s8k",
                "status": true,
                "createDateTime": 1752631447638,
                "updateDateTime": 1752631447638
            },
            {
                "id": "1xXXXXMwaoioOHkiGr74Ru6xArO",
                "appId": "1DHFtAi7wabrqsrjCV449Kljh98",
                "word": "sport",
                "userId": "v1",
                "listId": "1xXXXXlodF52URYQk7rZmd5s8k",
                "status": true,
                "createDateTime": 1752631447638,
                "updateDateTime": 1752631447638
            }
        ]
    }
}
```

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 400 | Bad Request | request param is empty | 生效范围、关键词名单的名称、对匹配关键词的消息内容的审核处理为空。 | 检查必填参数。 |
| 400 | Bad Request | The textList count exceeds the maximum number | 关键词名单数量超过上限。每个应用最多可配置 10 个名单。 | 减少关键词名单数量。 |
| 400 | Bad Request | The text count exceeds the maximum number | 关键词数量超过上限。 | 减少关键词数量。 |
| 400 | Bad Request | The textList already exists | 关键词名单名称已存在。 | 修改关键词名单名称。 |
| 400 | Bad Request | moderation org data is empty | 你未开通内容审核服务。 | 开通内容审核服务。 |
| 400 | Bad Request | the number of words exceeds the limit | 应用下面的关键词总数超过上限。每个应用最多可配置 10 个名单, 每个名单最多可添加 10,000 个关键词，即每个应用最多可配置 100,000 个词条。| 减少关键词数量。 |
| 400 | MODERATION_002 | "request param is empty | 若未设置必填参数，例如 `name` 或 `scope`，会提示该错误。 | 请传入必填参数。 |

关于其他错误，你可以参考 [错误码页面](error.html) 了解可能的原因。