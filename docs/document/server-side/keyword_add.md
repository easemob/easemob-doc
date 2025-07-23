# 添加关键词

## 功能说明

- 添加关键词。
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

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文介绍的即时通讯所有 REST API 均需使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/moderation/text/list/{list_id}/word/batch
```

### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `list_id`    | String | 是       | 关键词名单 ID。将关键词添加到该名单中。  |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type` | String | 是       | 内容类型。请填 `application/json`。 |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### 请求 body

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `wordContents`        | Array | 是 | 要添加的关键词列表。 一次最多可添加 100 个关键词。 |
| `userId`        | String | 是       | 添加关键词的用户 ID。 |

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
| - `fullMatch` | Boolean | 关键词与消息内容是否为精确匹配。 |
| - `disposition` | String | 对匹配关键词的消息内容的处理。|
| - `quantity` | Int | 关键词名单中的关键词总数量。|
| - `status` | String | 关键词名单的状态。<br> - `ACTIVE`：开启<br> - `CLOSE`：关闭 |
| - `createDataTime` | Long | 关键词名单创建时间。|
| - `updateDataTime` | Long | 关键词名单修改时间。|
| - `textList` | JSON Array | 关键词列表。对于每个关键词，详情如下：<br/> - `id`：String，关键词 ID <br/> - `appId`：String，App ID <br/> - `word`：String，关键词名称 <br/> - `userId`：String，添加关键词的用户 ID <br/> - `listId`：String，关键词名单 ID <br/> - `status`：String，关键词状态。开发者可忽略该参数。<br/> - `createDateTime`：Long，关键词添加时间 <br/> - `updateDateTime`：Long，关键词修改时间 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/{list_id}/word/batch' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "wordContents": [
      "music",
      "musicradio",
      "musicvideo"
      ],
      "userId": "v1"
    }' 
```

### 响应示例

```json
{
    "status": "OK",
    "entity": {
        "id": "1r14SOXXXXiSBbR3WTczWj92qsq",
        "name": "1",
        "moderationId": "159Rss4cL0XXXXcBfVAZ0IRQNwW",
        "appkey": "XXXX#XXXX",
        "category": "DEFAULT",
        "scope": "ALL",
        "tagId": null,
        "fullMatch": false,
        "suggestion": "PASS",
        "disposition": "PASS",
        "quantity": 4,
        "status": "ACTIVE",
        "createDataTime": 1740732560873,
        "updateDataTime": 1752501847616,
        "textList": [
            {
                "id": "1xDQ86NiiXXXXmGNMBGgNEZ6jj9",
                "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
                "word": "music",
                "userId": "v1",
                "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
                "status": true,
                "createDateTime": 1752489316741,
                "updateDateTime": 1752490995382
            },
            {
                "id": "1xXXXXUjdvN1LE68wFeILywpks2",
                "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
                "word": "musicradio",
                "userId": "v1",
                "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
                "status": true,
                "createDateTime": 1752501847581,
                "updateDateTime": 1752501847581
            },
            {
                "id": "1xDpWuXXXXqAfXzk0Y2OZ3JOhJt",
                "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
                "word": "musicvideo",
                "userId": "v1",
                "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
                "status": true,
                "createDateTime": 1752501847581,
                "updateDateTime": 1752501847581
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
| 400 | Bad Request | The text count exceeds the maximum number | 关键词数量超限。 | 减少关键词数量。每个名单最多可添加 10,000 个关键词，每个应用最多可配置 100,000 个词条。|
| 400 | Bad Request | request data is empty | 新增名单为空。 | 添加关键词名单。 |
| 400 | Bad Request | textList data is empty | 不存在关键词名单。 | 先创建名单，再操作。 |
| 400 | Bad Request | The textList already contains the text | 关键词重复。 | 去除重复关键词。 |

关于其他错误，你可以参考 [错误码页面](error.html) 了解可能的原因。
