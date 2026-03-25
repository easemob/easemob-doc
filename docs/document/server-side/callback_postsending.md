# 发送后回调

## 功能说明

发送后回调用于在消息发送成功后，将对应事件实时回调到你的业务服务器。该功能适用于通过 SDK 和 RESTful API 发送的聊天消息，包括单聊、群聊和聊天室消息，以及各类操作事件。

发送后回调通常用于以下场景：

- 将消息实时同步至业务系统，满足数据联动或审计需求；
- 基于消息内容触发自动回复、机器人处理或业务流程编排；
- 在应用服务器侧及时归档聊天记录、离线消息或业务事件数据。

:::tip
1. 如果你的业务对消息同步没有强实时要求，建议优先使用免费的 [聊天记录文件拉取 RESTful API](message_historical.html#历史消息记录的内容) 获取历史消息，无需开通发送后回调。
2. 如果 App 已开通反垃圾或敏感词过滤，被识别并拦截的消息不会发送成功，因此不会触发发送后回调。
:::

![](/images/server-side/im-callback1.png)

## 适用范围

发送后回调适用于单聊、群聊和聊天室中的消息回调，支持通过客户端 SDK 或 RESTful API 发送的消息。除消息回调外，该功能还支持部分服务端和客户端操作事件的回调，例如用户登录与登出、消息相关事件，以及群组和聊天室相关操作事件。实际支持的事件范围以 [控制台回调规则配置项](/product/console/basic_webhook.html#配置消息回调规则) 为准。

## 开通与配置

使用发送后回调前，请先完成以下配置：

1. 在 [环信控制台](https://console.easemob.com/user/login) [开通回调服务](/product/console/basic_webhook.html)。
2. 根据业务需求配置回调规则，例如，提供可访问的 HTTP 或 HTTPS 回调地址，用于接收环信服务器发起的回调请求。详见 [规则配置说明](/product/console/basic_webhook.html#配置消息回调规则)。

完成上述配置后，当消息发送完成或相关事件发生时，环信服务器会按照已配置规则向你的业务服务器发起回调。

## 回调规则

要使用发送后回调，你需要先在 [环信控制台](https://console.easemob.com/user/login) 中完成回调规则配置，详见 [规则配置说明](/product/console/basic_webhook.html#配置消息回调规则)。

同一个 App 可分别为聊天消息和离线消息配置不同的回调规则。若你的业务同时需要接收这两类回调，建议为不同类型配置独立的回调地址，便于服务端解耦、日志追踪和异常排查；如果共用同一个回调地址，也可以通过请求体中的 `eventType` 字段区分具体回调类型。

## 回调时延

发送后回调时延指环信消息服务器接收到消息后，到该消息成功回调至你指定业务服务器之间的时间间隔。

服务保障目标为 99.95% 的回调请求在 30 秒内送达。

## 重试与封禁机制

### 重试机制

当环信服务器向你的回调地址发起请求后，如果收到的 HTTP 响应状态码不是 `200`，则判定本次回调失败，并立即触发一次重试。

默认重试策略如下：

- 单条回调消息仅重试 1 次；
- 首次回调失败后立即重试；
- 若重试仍失败，则该条回调不再继续自动投递。

如果你已开通 [回调异常存储](callback_postsending_exception_storage.html)，则重试失败的回调消息会进入异常存储，便于后续查询和补发。

### 封禁机制

若 30 秒内累计失败达到 90 次，系统会临时封禁该 App 的回调规则。

封禁规则如下：

- 24 小时内连续封禁次数最多按 5 次计数：若封禁次数超过 5 次，仍计为 5；
- 第 1 次封禁时长为 5 分钟；
- 第 2 次至第 5 次封禁时长按“封禁次数 × 5 分钟”递增；
- 超过第 5 次后，封禁时长固定为 25 分钟。

对应封禁时长如下：

| 封禁次数 | 封禁时长 |
| :--- | :--- |
| 第 1 次 | 5 分钟 |
| 第 2 次 | 10 分钟 |
| 第 3 次 | 15 分钟 |
| 第 4 次 | 20 分钟 |
| 第 5 次及以后 | 25 分钟 |

:::tip
1. **重试失败后的回调消息** 以及 **回调规则被封禁期间产生的回调消息** 均不会被系统自动补录。你可以通过历史消息记录功能自行恢复。
2. 如果业务对“回调消息不丢失”有严格要求，请开通 [回调异常存储](callback_postsending_exception_storage.html) 服务，并结合 [查询异常存储数据](callback_postsending_exception_storage.html#查询异常缓存数据) 和 [补发异常回调数据](callback_postsending_exception_storage.html#补发异常回调数据) 接口进行补偿处理。
:::

## 回调示例

### 回调请求

消息发送或相关事件发生后，环信服务器会向你的业务服务器发起 `HTTP/HTTPS POST` 请求。请求体为 `UTF-8` 编码的 JSON 字符串。

为便于服务端校验请求合法性，环信服务器会对回调请求进行签名。当前签名算法使用 MD5，对应实现为 `org.apache.commons.codec.digest.DigestUtils#md5Hex`。

#### 请求示例

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
    // 具体的消息内容
  },
  "securityVersion": "1.0.0",
  "security": "2ca02c394bef9e7abc83958bcc3156d3"
}
```

#### 请求参数说明

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `callId` | String | 回调唯一标识，格式为 `{appkey}_{uuid}`，其中 `uuid` 为随机生成的唯一值。 |
| `eventType` | String | 回调事件类型：<br/> - `chat` 聊天消息；<br/> - `chat_offline` 离线消息。  |
| `timestamp` | Long | 环信 IM 服务器接收到该消息时的 Unix 时间戳，单位为毫秒。 |
| `chat_type` | String | 会话类型：<br/> - `chat` 单聊；<br/> - `groupchat` 群聊，包含群组和聊天室的消息回调，默认全选。|
| `group_id` | String | 消息所属群组 ID，仅在 `chat_type` 为 `groupchat` 时返回。 |
| `from` | String | 消息发送方。 |
| `to` | String | 消息接收方。 |
| `msg_id` | String | 消息 ID。 |
| `payload` | Object | 消息内容，与通过 RESTful API 发送时的消息体结构一致，详见 [消息格式文档](message_historical.html#历史消息记录的内容)。 |
| `securityVersion` | String | 安全校验版本，当前固定为 `1.0.0`。该字段当前可忽略。 |
| `security` | String | 请求签名，计算方式为 `MD5(callId + Secret + timestamp)`。其中 `Secret` 的配置方式详见 [规则配置说明](/product/console/basic_webhook.html#配置消息回调规则)。 |

### 回调响应

环信 IM 服务器不会校验响应体内容，只要你的业务服务器返回的 HTTP 状态码为 `200`，即视为本次回调处理成功。

你的业务服务器在处理回调请求时，需要满足以下要求：

- 响应体内容长度不能超过 1,000 个字符；
- 若持续返回超长响应内容，并在 30 秒内累计达到 90 次，同样可能触发 [回调规则封禁](#封禁机制)。

