# 添加关键词

## 功能说明

- 添加关键词。
- 每个应用最多可配置 10 个名单, 每个名单最多可添加 10,000 个关键词，即每个应用最多可配置 100,000 个词条。

**调用频率上限**：100 次/秒/App Key 

## HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/moderation/text/list/text/list/{list_id}/word/batch
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
| - `scope` | String | 关键词名单的生效范围。  |
| - `tagId` | String | 标签 ID。 |
| - `fullMatch` | Boolean | 关键词与消息内容是否为精确匹配。 |
| - `disposition` | String | 对匹配关键词的消息内容的处理。  |
| - `quantity` | Int | 添加的关键词数量。 |
| - `status` | String | 关键词名单的状态。<br> - `ACTIVE`：开启<br> - `CLOSE`：关闭 |
| - `createDateTime` | Long | 关键词名单创建时间。|
| - `updateDateTime` | Long | 关键词名单修改时间。|
| - `textList` | JSON Array | 关键词列表。对于每个关键词，详情如下：<br/> - `id`：关键词 ID；<br/> - `word`：关键词名称；<br/> - `userId`：添加关键词的用户 ID；<br/> - `listId`：关键词名单 ID；<br/> - `createDateTime`：关键词添加时间；<br/> - `updateDateTime`：关键词修改时间。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

// TODO：请提供请求示例和响应示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/text/list/{list_id}/word/batch' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "wordContents": [
      "music"
      ],
      "userId": "user1"
    }' 
```

### 响应示例

```json
{
  "status": "OK",
  "entity": {
    "id": "string",
    "name": "list_0",
    "moderationId": "string",
    "appkey": "XXXX#XXXX",
    "scope": "ALL",
    "tagId": "entertainment",
    "fullMatch": true,
    "disposition": "PASS",
    "quantity": 0,
    "status": "enabled",
    "createDateTime": 0,
    "updateDateTime": 0,
    "textList": [
      {
        "id": "1wOTD0XXXXduCtnnHJwWzyqzMye", 
        "word": "music",
        "userId": "user1",
        "listId": "list_0",
        "createDateTime": 1594724293063,
        "updateDateTime": 1696724294063
      }
    ]
  }
}
```

## 错误码

// TODO：请添加错误码，例如传入的关键词数量超限，或用户 ID 不存在等。

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |









关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
