# 主动文本审核

## 功能说明

1. 该 REST API 用于主动审核输入的文本内容。
2. 该 API 和 [文本审核服务](/value-added/moderation/moderation_rule_config.html#添加文本审核规则) 的区别如下表所示。你可以根据业务场景选择使用。

|  文本审核类型     | 审核对象| 使用方式 |  服务开通 |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| 主动文本审核 REST API  | 业务服务器传入的文本内容。   | 调用文本审核 API，业务服务器传入需审核的文本内容，环信服务器进行审核，返回审核结果。| 1. 在环信控制台 [开通文本审核服务](/value-added/moderation/moderation_enable.html)。<br/> 2. 联系环信商务开通该 API 的使用。 |                                                          |
| 文本审核服务            | 即时通讯 IM 发送的文本类型消息。   | 文本审核服务开箱即用。你基于业务的审核规则，配置单聊、群组或聊天室会话的 [文本审核规则](/value-added/moderation/moderation_rule_config.html#添加文本审核规则)。  | 在环信控制台 [开通文本审核服务](/value-added/moderation/moderation_enable.html)。                                                         |

## 开通服务

使用该 API 前，你需要：
 - 在环信控制台 [开通文本审核服务](/value-added/moderation/moderation_enable.html)。
 - **联系环信商务** 开通该 API 的使用。

## 调用频率上限

- 默认 100 次/秒/App Key。
- 支持上调该上限，单个叠加包 50 次/秒。
- 其他 API 的调用频率上限，详见 [REST API 调用频率限制说明](limitationapi.html)。

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/moderation/txt/check
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'https://XXXX/XXX/XXX/moderation/txt/check' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "content":"【放心借】新户福利！抖音钱包-放心借为您下发了一张30天0息券，戳 https://z.douyin.com/3gq2Eis 拒收请回复R"
}'
```

### 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

### 请求 body 参数

| 参数    | 类型   | 是否必需 | 描述           |
| :------ | :----- | :------- | :------------- |
| `content` | String | 是       | 要审核的文本内容。内容长度限制取决于内容审核厂商。 |

## 响应示例

```json
{
    "code": 200,
    "data": {
        "type": "REJECT",
        "riskType": "广告:联系方式:网址", 
        "riskLabel": "AD",
        "exchangeText": "*********************************************************************",
        "sensitiveWords": [
            "【放心借】新户福利！抖音钱包-放心借为您下发了一张30天0息券，戳 https://z.douyin.com/3gq2Eis 拒收请回复R"
        ]
    },
    "meta": {
        "timestamp": 1753260864654,
        "requestId": ""
    }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段               | 类型       | 描述                           |
| :----------------- | :--------- | :----------------------------- |
| `code`             | Int        | 请求状态。若请求成功，返回 `200`。 |
| `data`             | JSON Array | 响应中的数据详情。                     |
| - `type`           | String     | 审核结果: <br/> - `PASS`：通过，即文本无风险。<br/> - `REVIEWED`：疑似，即文本可能有风险。<br/> - `REJECT`：拒绝，即文本存在风险。<br/> - `UNKNOWN`：未知，即文本风险未知。 |
| - `riskType`       | String     | 风险类型，例如，`无风险`、`涉政`、`仇恨言论`、`色情`、`成人内容`、`暴恐`、`违禁`、`广告`、`二维码` 和 `未知`。 |
| - `riskLabel`      | String     | 风险标签，例如，`NONE`：无；`POLITICS`：涉政；`VIOLENCE`：暴恐；`PORN`：色情；`BAN`：违禁；`ABUSE`：辱骂；`AD`：广告；`QR`：二维码；`UNKNOWN`：未知。 |
| - `exchangeText`   | String     | 替换后的文本。该字段的返回内容取决于内容审核厂商。 |
| - `sensitiveWords` | JSON Array | 审核的文本内容中包含的敏感词。   |
| - `probability`    | Double     | 文本审核恶意值，值越高表示恶意程度越高。只有微软内容审核服务提供该字段。|
| `meta`             |            | 元数据。<br/> - `requestId`：String 类型，预留字段，开发者可忽略。<br/> - `timestamp`：Long 类型，表示 HTTP 响应的 Unix 时间戳，单位为毫秒。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型     | 错误代码 | 错误提示                         | 可能原因                              | 处理建议              |
| :---------- | :----------- | :------- | :------------------------------- | :------------------------------------ | --------------------- |
| 401         | unauthorized |          | Unable to authenticate (OAuth)   | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 400         | Bad request  | 4000005  | message content is empty or null | 消息内容为空。                         | 传输正确的消息内容。    |
| 400         | Bad request  | 4000303  | orgName not found                | `org_name` 不正确。                      | 请传入正确的 `org_name`。   |
| 400         | Bad request  | 4000303  | application not found            | `app_name` 不正确。                        | 请传入正确的 `app_name`。  |
| 400         | Bad request  | 4000404  | text moderation not open         | 文本审核未开通。                        | 调用该接口前需在 [环信控制台](https://console.easemob.com/user/login)[开通文本审核服务](/value-added/moderation/moderation_enable.html#开通流程)。|
| 400         | Bad request  | 4000303  | text rule moderation not exist   | 该接口对应的审核规则不存在，请联系环信商务。开通该接口服务后，[环信控制台](https://console.easemob.com/user/login) 会单独创建一条规则，用于该接口进行内容审核。请勿删除该规则。 | 联系环信商务在 [环信控制台](https://console.easemob.com/user/login) 创建该接口对应的文本审核规则。   |
| 400         | Bad request  | 4000404  | text rule moderation not active  | 开通该接口服务后，[环信控制台](https://console.easemob.com/user/login) 会单独创建一条规则，用于该接口进行内容审核。使用该接口前，需要开启该条规则，若关闭规则会上报该错误。        | 调用接口前，你应该在 [环信控制台](https://console.easemob.com/user/login) [开启该接口对应的文本审核规则](/value-added/moderation/moderation_rule_config.html)。   |
