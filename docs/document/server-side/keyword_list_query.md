# 查询关键词名单

## 功能说明

查询关键词名单。

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
POST https://{host}/{org_name}/{app_name}/moderation/text/list/search
```

#### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

#### 查询参数 --- 错误

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `size` | Int   | 否   | 每页返回的关键词数量，取值范围为 [1,200]，默认值为 `10`。| 
| `page` | Int   | 否 | 当前页码，默认值为 `0`。|  

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type` | String | 是       | 内容类型。请填 `application/json`。 |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `name`        | String | 是       | 关键词名单的名称。 |
| `tagId`        | String | 否       | 用户标签 ID。|
| page | Integer | 否 | 默认0 |
| size | Integer | 否 | 默认10 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `status` | String | 请求状态。若请求成功，返回 `OK`。 |
| `entities` | JSON Array | 关键词名单的详情。 |
| - `id` | String | 关键词名单 ID。 |
| - `name` | String  | 关键词名单的名称。 |
| - `moderationId` | String | 审核 ID。开发者可忽略该参数。 |
| - `appkey` | String | 应用的 App Key。 |
| - `category` | String | 值为 `DEFAULT`，表示关键词名单。 |
| - `scope` | String | 关键词名单的生效范围。  |
| - `tagId` | String | 标签 ID。 |
| - `fullMatch` | Boolean | 关键词与消息内容是否为精确匹配。 |
| - `suggestion` | String | 对匹配关键词的消息内容的处理建议。该字段的值以及值的含义与 `disposition` 字段相同。  |
| - `disposition` | String | 对匹配关键词的消息内容的处理。  |
| - `quantity` | Int | 名单中关键词的总数量。 |
| - `status` |  | 关键词名单的状态：<br> - `ACTIVE`：开启<br> - `CLOSE`：关闭 |
| - `createDateTime` | Long | 关键词名单的创建时间。|
| - `updateDateTime` | Long | 关键词名单的修改时间。|
| `first` | Boolean | 当前页面是否为首页：<br/> - `true`：是 <br/> - `false`：否|
| `last` | Boolean | 当前页面是否为最后一页：<br/> - `true`：是 <br/> - `false`：否|
| `size` | Int | 每页查询的关键词数量。// TODO：请确认描述是否正确。 |
| `number` | Int | 当前页码。// TODO：请确认描述是否正确。 |
| `numberOfElements` | Int | 当前页面中获取的关键词数量。// TODO：请确认描述是否正确。|
| `totalPages` | Int | 页面总数。// TODO：请确认描述是否正确。|
| `totalElements` | Int | 关键词名单包含的关键词总数量。// TODO：请确认描述是否正确。|

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/search' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "name": "323",
      "page": 1,
      "size": 10
    }' 
```

### 响应示例

```json
{
    "status": "OK",
    "entities": [
        {
            "id": "1r14gXXXXgdrpF29EgTV7VhAjpP",
            "name": "323",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "GROUP",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 1,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:51:12.314+00:00",
            "updateDataTime": "2025-02-28T08:51:12.314+00:00"
        }
    ],
    "first": true,
    "last": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 1,
    "totalPages": 1,
    "totalElements": 1
}
```

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |