# 消息引用

## 功能说明

消息引用是指用户回复某一条已发送消息，并在新消息中携带被引用消息的摘要信息，便于接收方理解回复上下文。

除透传消息外，各类消息均可通过新消息的扩展字段携带引用信息。SDK 不会校验被引用原消息的发送状态或是否真实存在。

:::tip
消息引用场景下，`msgQuote` 作为新消息 `ext` 中的业务自定义字段，需与其他扩展字段一起保持 JSON 可序列化，并满足消息发送时的整体大小限制。
:::

各类型消息的引用 UI 展示示例如下：

| 消息类型 | 原消息存在 | 原消息不存在 |
| :--- | :--- | :--- |
| 文本消息 | ![img](/images/product/solution_common/message_reply/text_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/text_no_mobile.png) |
| 图片消息 | ![img](/images/product/solution_common/message_reply/image_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/image_no_mobile.png) |
| 语音消息 | ![img](/images/product/solution_common/message_reply/voice_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/voice_no_mobile.png) |
| 视频消息 | ![img](/images/product/solution_common/message_reply/video_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/video_no_mobile.png) |
| 文件消息 | ![img](/images/product/solution_common/message_reply/file_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/file_no_mobile.png) |
| 名片消息 | ![img](/images/product/solution_common/message_reply/card_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/card_no_mobile.png) |
| 合并消息 | ![img](/images/product/solution_common/message_reply/combine_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/combine_no_mobile.png) |

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化和登录，详见[快速开始](quickstart.html)。
- 已具备基础的消息发送和接收能力。
- 了解即时通讯 IM 的使用限制，详见[使用限制](/product/limitation.html)。

## 实现过程

消息引用的实现方式如下：

1. 业务侧在发送回复消息前获取被引用原消息的关键信息。
2. 创建新的回复消息，并将原消息摘要写入新消息的扩展字段 `msgQuote`。
3. 接收方收到新消息后解析 `msgQuote`，在消息列表中渲染引用区域。
4. 如需支持点击引用区域跳转到原消息，可根据 `msgQuote.msgID` 在本地消息列表中定位原消息。

`msgQuote` 的数据结构由业务侧自行约定，可以参考以下结构：

```json
{
  "msgQuote": {
    "msgID": "原消息 ID",
    "msgPreview": "原消息的预览内容",
    "msgSender": "原消息发送方的用户 ID",
    "msgType": "原消息类型"
  }
}
```

各字段说明如下：

- `msgID`：业务侧记录的被引用消息 ID，用于定位原消息。
- `msgPreview`：被引用消息的预览内容，用于原消息无法找到时的降级展示。
- `msgSender`：业务侧记录的被引用消息发送方。
- `msgType`：业务侧记录的被引用消息类型，用于按类型渲染引用摘要。

在消息列表中展示时，可以根据 `msgQuote` 中的信息组合引用摘要，例如 `${msgSender}: ${msgPreview}`。

如需支持点击引用区域跳转至原消息，可以根据 `msgID` 在本地消息列表中定位该消息，然后滚动到对应位置并高亮展示。如果被引用消息已被删除或尚未加载到本地消息列表，可以展示 `msgPreview`，或提示 **引用内容不存在**。

### 发送引用的消息

以回复文本消息为例，发送引用消息的过程如下：

::: tabs#code

@tab Java

```java
EMMessage message = EMMessage.createTextSendMessage(
        "好的，收到！",
        conversationId);

// 群聊设置为 GroupChat，聊天室设置为 ChatRoom；单聊默认为 Chat。
message.setChatType(EMMessage.ChatType.Chat);

JSONObject quote = new JSONObject();
try {
    // 写入被引用消息的摘要信息。
    quote.put("msgID", "original-message-id");
    quote.put("msgPreview", "原消息内容预览");
    quote.put("msgSender", "user1");
    quote.put("msgType", "text");
} catch (JSONException exception) {
    EMLog.e("MessageQuote", exception.getMessage());
    return;
}

// 将引用信息作为新消息的扩展字段发送。
message.setAttribute("msgQuote", quote);
EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

@tab Kotlin

```kotlin
val message = EMMessage.createTextSendMessage(
    "好的，收到！",
    conversationId
)

// 群聊设置为 GroupChat，聊天室设置为 ChatRoom；单聊默认为 Chat。
message.chatType = EMMessage.ChatType.Chat

val quote = JSONObject()
try {
    // 写入被引用消息的摘要信息。
    quote.put("msgID", "original-message-id")
    quote.put("msgPreview", "原消息内容预览")
    quote.put("msgSender", "user1")
    quote.put("msgType", "text")
} catch (exception: JSONException) {
    EMLog.e("MessageQuote", exception.message)
    return
}

// 将引用信息作为新消息的扩展字段发送。
message.setAttribute("msgQuote", quote)
EMClient.getInstance()
    .chatManager()
    .sendMessage(message)
```

:::

### 接收方解析收到的消息

接收方收到消息后，可以检查消息扩展字段中是否包含 `msgQuote`。若包含，则调用 `EMMessage#getJSONObjectAttribute` 解析引用信息并刷新 UI。

::: tabs#code

@tab Java

```java
private void handleQuotedMessage(EMMessage message) {
    Map<String, Object> ext = message.ext();
    if (ext == null || !ext.containsKey("msgQuote")) {
        return;
    }

    try {
        JSONObject quote = message.getJSONObjectAttribute("msgQuote");

        // 读取被引用消息的摘要信息并更新 UI。
        String quotedMessageId = quote.optString("msgID");
        String quotedSender = quote.optString("msgSender");
        String quotedType = quote.optString("msgType");
        String quotedPreview = quote.optString("msgPreview");
    } catch (HyphenateException exception) {
        EMLog.e("MessageQuote", exception.getMessage());
    }
}

private final EMMessageListener messageListener =
        new EMMessageListener() {
            @Override
            public void onMessageReceived(List<EMMessage> messages) {
                for (EMMessage message : messages) {
                    handleQuotedMessage(message);
                }
            }
        };

EMClient.getInstance()
        .chatManager()
        .addMessageListener(messageListener);
```

@tab Kotlin

```kotlin
private fun handleQuotedMessage(message: EMMessage) {
    val ext = message.ext()
    if (ext == null || !ext.containsKey("msgQuote")) {
        return
    }

    try {
        val quote = message.getJSONObjectAttribute("msgQuote")

        // 读取被引用消息的摘要信息并更新 UI。
        val quotedMessageId = quote.optString("msgID")
        val quotedSender = quote.optString("msgSender")
        val quotedType = quote.optString("msgType")
        val quotedPreview = quote.optString("msgPreview")
    } catch (exception: HyphenateException) {
        EMLog.e("MessageQuote", exception.message)
    }
}

private val messageListener = object : EMMessageListener {
    override fun onMessageReceived(messages: MutableList<EMMessage>?) {
        messages?.forEach { message ->
            handleQuotedMessage(message)
        }
    }
}

EMClient.getInstance()
    .chatManager()
    .addMessageListener(messageListener)
```

:::

不再需要监听消息时，应移除监听器：

```java
EMClient.getInstance()
        .chatManager()
        .removeMessageListener(messageListener);
```

## 常见问题

1. Q: SDK 是否提供专用的引用消息创建 API？
   A: 不提供。当前通过新消息的扩展字段 `msgQuote` 实现引用消息。

2. Q: 被引用消息不存在时，如何显示？
   A: 可以显示 `msgPreview` 内容，也可以显示 **引用内容不存在**。

3. Q: SDK 是否会自动校验被引用消息是否真实存在？
   A: 不会。`msgQuote` 主要用于业务展示，原消息定位以及原消息不存在时的降级展示逻辑需由业务侧自行处理。

4. Q: 跳转到被引用消息时，如果当前消息与被引用消息之间的消息数量过多，怎么办？
   A: 如果一次性将两条消息之间的全部消息加载到 UI，可能会占用较多内存。建议设置单次加载消息数量的阈值；超过阈值时停止继续加载或不执行跳转。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#发送引用的消息) | `EMMessage` | 创建用于回复原消息的文本消息。 |
| [`sendMessage`](#发送引用的消息) | `EMChatManager` | 发送携带引用信息的消息。 |
| [`ext`](#接收方解析收到的消息) | `EMMessage` | 获取消息的全部扩展字段。 |
