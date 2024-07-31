# AI 智能

环信即时通讯云提供 REST API 获取 app 下的机器人列表。**如果需要该功能相关的其他 REST API，请联系环信商务。**

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯云控制台 [开通配置环信即时通讯 IM 服务](/product/enable_and_configure_IM.html)。
- 已从服务端获取 app token，详见 [使用 App Token 鉴权](/product/easemob_app_token.html)。
- 了解环信 IM API 的调用频率限制，详见 [接口频率限制](/product/limitationapi.html)。

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文介绍的即时通讯所有 REST API 均需使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](/product/easemob_app_token.html)。

## 获取 app 下的机器人列表

你可以调用该 API 获取你的 app 下的机器人列表。

**调用频率上限**：100 次/秒/App Key 

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/robot/rule?&page={page}&size={size}
```

#### 路径参数

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :------------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

#### 查询参数

| 字段   | 类型     | 是否必选 | 备注         |
| :-------------- | :----- | :------- | :--------------------------------------- |
| `page` | Int   | 是 | 当前页码，默认值为 `0`。|  
| `size` | Int   | 是   | 每页返回的机器人数量，取值范围为 [1,20]，默认值为 `10`。| 

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                     |
| :-------------- | :----- | :------- | :--------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |     

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的字段描述如下：

| 字段                | 类型  | 描述                                    | 
| :------------------ | :----- | :-------------------------------------- |
| `status`  | String   | 是否成功获取 app 下的机器人列表。`OK` 表示成功获取。 |
| `entities` | JSONArray | app 下的机器人详情。  |
|  - `id`   | String  | 机器人 ID。   |
|  - `name` | String  | 机器人名称。  |
|  - `appkey`  | String  | 应用的唯一标识，由 `Orgname` 和 `Appname` 组成，生成后不允许修改。在[环信即时通讯云控制台](https://console.easemob.com/user/login)的 **应用详情** 页面查看。 |
|  - `robotId` | String | robot ID。   |
|  - `robotAppId`   | String       | robot ID 对应的 robot app ID。   |  
|  - `msgType` | String  | 消息类型，目前固定值为 `txt`，即文本消息。 |
|  - `targetType`  | String | 会话类型，目前固定值为 `chat`，即单聊。 |
|  - `targetId`  | List | 机器人对应的 IM 的用户 ID。目前只有一个用户 ID。 |
|  - `providerType`  | String | AI 大模型厂商，目前固定值为 `MINIMAX`。 |
|  - `providerId`   | String       | 机器人对应的厂商 ID。  |
|  - `timeout`  | Int  | 超时时间，目前未启用。 |
|  - `status`   | String | 机器人的状态，`ACTIVE` 为启用状态，默认是启用。  |
|  - `createDateTime`  | DATETIME       | 开通使用 MINIMAX AI 聊天服务的时间。  | 
|  - `updateDateTime`   | DATETIME      | 更新 MINIMAX AI 聊天服务开通状态的时间。 |
|  - `providerTextApi`  | String | 厂商支持的 AI 接口，默认使用 `chatcompletion_pro`，当前不支持可选。 |
|  - `providerModel`  | String  | 厂商支持的 AI 模型类别。|
|  - `providerAttribute`  |  JSONObject   | 机器人的一些属性。 |
|    - `historyNum`          | Int  | 传递给机器人的历史消息数，固定为 `10`。开发者忽略该字段。 |
|    - `avatar`         | String  | 机器人头像图片链接。                      |
|    - `restMsgLimit`  | Int   | 发送的 REST 消息大小值。该字段为内部使用，开发者可忽略。  |
|  - `providerPayload`  | JSONObject   | 调用厂商接口时的一些参数。 |
|    - `top_p`          | Int | 控制生成环节采样范围，参数值越小，生成结果越稳定。关于该参数的更多详情，请参阅 [MiniMax 官方文档](https://platform.minimaxi.com/document/ChatCompletion%20Pro?key=66718f6ba427f0c8a57015ff)。 |
|    - `tokens_to_generate`  | Int  | 机器人回复的最大生成 token 数。关于该参数的更多详情，请参阅 [MiniMax 官方文档](https://platform.minimaxi.com/document/ChatCompletion%20Pro?key=66718f6ba427f0c8a57015ff)。 |
|    - `temperature`         | Int  |  控制生成环境采样随机性，参数值越小，生成结果越稳定。关于该参数的更多详情，请参阅 [MiniMax 官方文档](https://platform.minimaxi.com/document/ChatCompletion%20Pro?key=66718f6ba427f0c8a57015ff)。 |
|  - `providerContent` |  String    | 具体机器人的设定，长度影响接口性能。  |
|  - `textType`  | String  | 固定值，该字段为内部使用，开发者可忽略。                    |
| `size`  | Int  | 当前页面返回的机器人数量。  |
| `page`   | Int  | 当前页码。 |
| `elements`  | Int  | 当前页面返回的机器人数量。 |
| `totalPages`  | Int  | 总页数。  |
| `totalElements` | Int | App 下的机器人总数。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl --location 'http://XXXX/XXXX/XXXX/robot/rule?page=0&size=10'  
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
    "status": "OK",
    "entities": [
        {
            "id": "1eUOZ3RFpJA2BFSsaB8n5EFrETh",
            "name": "Kyler_Robel",
            "appkey": "easemob-demo#test",
            "robotId": "f5f07c60ce95ca4f496870665d0e868d",
            "robotAppId": "1eRg1UCOhrvkMw1q47G7tToUduJ",
            "msgType": "TEXT",
            "targetType": "CHAT",
            "targetId": [
                "some_user_id371-916-6147"
            ],
            "providerType": "MINIMAX",
            "providerId": "1eUOZ28DChC1LUc5a5YSvSoPPnq",
            "timeout": 3000,
            "status": "ACTIVE",
            "createDateTime": "2024-05-29T09:30:56.427220Z",
            "updateDateTime": "2024-05-29T09:37:40.969794Z",
            "providerTextApi": "chatcompletion_pro",
            "providerModel": "abab6.5-chat",
            "providerAttribute": {
                "historyNum": 10,
                "avatar": "http://placeimg.com/640/480",
                "restMsgLimit": 1024
            },
            "providerPayload": {
                "top_p": 0.9,
                "tokens_to_generate": 2048,
                "temperature": 0.1
            },
            "providerContent": "putMessage我是助理222",
            "textType": "DEFAULT"
        },
        {
            "id": "1eUbgljnq7yhHqgQ7cjKw5mOUxC",
            "name": "Dessie81",
            "appkey": "easemob-demo#test",
            "robotId": "f5f07c60ce95ca4f496870665d0e868d",
            "robotAppId": "1eRg1UCOhrvkMw1q47G7tToUduJ",
            "msgType": "TEXT",
            "targetType": "CHAT",
            "targetId": [
                "some_user_id379-312-1146"
            ],
            "providerType": "MINIMAX",
            "providerId": "1eUbgjWOKkzbaRCysbLozPy4E4h",
            "timeout": 3000,
            "status": "ACTIVE",
            "createDateTime": "2024-05-29T11:18:51.454156Z",
            "updateDateTime": "2024-05-29T11:46:19.333387Z",
            "providerTextApi": "chatcompletion_pro",
            "providerModel": "abab6.5-chat",
            "providerAttribute": {
                "historyNum": 10,
                "avatar": "http://placeimg.com/640/480",
                "restMsgLimit": 1024
            },
            "providerPayload": {
                "top_p": 0.9,
                "tokens_to_generate": 2048,
                "temperature": 0.1
            },
            "providerContent": "putMessage我是助理222",
            "textType": "DEFAULT"
        }
    ],
    "size": 10,
    "page": 0,
    "elements": 2,
    "totalPages": 1,
    "totalElements": 2
}
```

### 错误码

| HTTP 状态码    | 错误类型 | 错误提示   | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 500     | Internal Server Error | Internal Server Error | 服务内部错误。 | 检查请求参数是否合理。|
| 400     | Bad Request | Request param error | 请求参数错误。 | 检查请求参数是否合理。|

关于其他错误，你可以参考 [响应状态码](/document/server-side/overview.html) 了解可能的原因。




