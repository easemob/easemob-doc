# 消息引用

## 功能说明

消息引用是指用户回复某一条已发送消息，并在新消息中携带被引用消息的摘要信息，便于接收方理解回复上下文。

除透传消息外，各类发送成功的消息均可通过新消息的扩展字段携带引用信息。SDK 不提供专用的引用消息创建 API，也不会校验被引用原消息是否真实存在、是否属于当前会话，或是否确实为已发送消息。引用信息由业务侧作为新消息 `ext` 中的自定义字段传入，因此可传入任意字符串作为消息 ID。

建议业务侧自行校验被引用消息 ID 是否属于当前会话，并同时在 `ext` 中保存 `msgPreview`、`msgSender`、`msgType` 等摘要字段。这样即使原消息已删除或本地未加载，也能正常展示引用内容。

:::tip
`msgQuote` 是新消息 `ext` 中的业务自定义字段，需与其他扩展字段一起保持 JSON 可序列化，并满足消息发送时的整体大小限制。
:::

各类型消息的引用 UI 展示示例如下：

| 消息类型 | 原消息存在 | 原消息不存在 |
| :--- | :--- | :--- |
| 文本消息 | ![img](/images/product/solution_common/message_reply/text_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/text_no_mobile.png) |
| 图片消息 | ![img](/images/product/solution_common/message_reply/image_normal_mobile.png)  | ![img](/images/product/solution_common/message_reply/image_no_mobile.png)|
| 语音消息 | ![img](/images/product/solution_common/message_reply/voice_normal_mobile.png)| ![img](/images/product/solution_common/message_reply/voice_no_mobile.png)|
| 视频消息 | ![img](/images/product/solution_common/message_reply/video_normal_mobile.png)| ![img](/images/product/solution_common/message_reply/video_no_mobile.png)|
| 文件消息 | ![img](/images/product/solution_common/message_reply/file_normal_mobile.png)| ![img](/images/product/solution_common/message_reply/file_no_mobile.png)|
| 名片消息 | ![img](/images/product/solution_common/message_reply/card_no_mobile.png) | ![img](/images/product/solution_common/message_reply/card_normal_mobile.png)|
| 合并消息 | ![img](/images/product/solution_common/message_reply/combine_normal_mobile.png)| ![img](/images/product/solution_common/message_reply/combine_no_mobile.png)| 

## 前提条件

开始前，请确保满足以下条件：

 - 完成 SDK 初始化和登录，详见 [快速开始](quickstart.html)。
 - 已具备基础的消息发送和接收能力。
 - 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

消息引用的实现方式如下：

1. 业务侧在发送回复消息前，获取被引用原消息的关键信息，并校验该消息是否属于当前会话。
2. 创建新的 `EMChatMessage`，并将原消息摘要写入新消息 `ext` 中的 `msgQuote` 字段。
3. 接收方收到新消息后，读取 `EMChatMessage#ext` 并解析 `msgQuote`，在消息列表中渲染引用区域。
4. 如需支持点击引用区域跳转至原消息，可根据 `msgQuote` 中的 `msgID` 在本地消息列表中定位原消息。若原消息已删除或尚未加载，可使用摘要信息进行降级展示。

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

- `msgID`：业务侧记录的被引用消息 ID。建议校验该 ID 是否属于当前会话，用于定位原消息。
- `msgPreview`：被引用消息的预览内容，用于原消息无法找到时的降级展示。
- `msgSender`：业务侧记录的被引用消息发送方用户 ID。
- `msgType`：业务侧记录的被引用消息类型，用于按类型渲染引用摘要。

在消息列表中展示时，可以根据 `EMChatMessage#ext` 中 `msgQuote` 的信息组合引用摘要，例如 `${msgSender}: ${msgPreview}`。

如需支持点击引用区域跳转至原消息，可以根据 `msgID` 在本地消息列表中定位该消息，然后滚动到对应位置并高亮展示。如果被引用消息已被删除或尚未加载到本地消息列表，可以展示 `msgPreview`，或提示 **引用内容不存在**。

### 发送引用的消息

以回复文本消息为例，发送引用消息的过程如下：

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"好的，收到！"];
NSDictionary *quote = @{
    @"msgID": @"original-message-id",
    @"msgPreview": @"原消息内容预览",
    @"msgSender": @"user1",
    @"msgType": @"text"
};
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId
                                                                   body:body
                                                                    ext:@{@"msgQuote": quote}];

[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
    // 处理发送结果。
}];
```

### 接收方解析收到的消息

接收方收到消息后，可以检查 `EMChatMessage#ext` 中是否包含 `msgQuote`。若包含，则从 `ext[@"msgQuote"]` 读取并解析引用信息，然后刷新 UI。

```objectivec
- (void)handleQuotedMessage:(EMChatMessage *)message {
    NSDictionary *quote = message.ext[@"msgQuote"];
    if (![quote isKindOfClass:[NSDictionary class]]) {
        return;
    }

    NSString *quotedMessageId = quote[@"msgID"];
    NSString *quotedPreview = quote[@"msgPreview"];
    NSString *quotedSender = quote[@"msgSender"];
    NSString *quotedType = quote[@"msgType"];
    // 使用引用信息更新 UI。
}

- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        [self handleQuotedMessage:message];
    }
}
```

不再需要监听消息时，应移除消息代理：

```objectivec
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## 常见问题

1. Q: SDK 是否提供专用的引用消息创建 API？
   A: 不提供。当前通过新消息的扩展字段 `msgQuote` 实现引用消息。

2. Q: 被引用消息不存在时，如何显示？
   A: 可以显示 `msgPreview` 内容，也可以显示 **引用内容不存在**。

3. Q: 跳转到被引用消息时，如果当前消息与被引用消息之间的消息数量过多，怎么办？
   A: 如果一次性将两条消息之间的全部消息加载到 UI，可能会占用较多内存。建议设置单次加载数量阈值；超过阈值时停止继续加载，或不执行跳转。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`initWithConversationID`](#发送引用的消息) | `EMChatMessage` | 创建用于回复原消息的消息。 |
| [`ext`](#接收方解析收到的消息) | `EMChatMessage` | 获取消息扩展字段。 |
| [`sendMessage`](#发送引用的消息) | `IEMChatManager` | 发送携带引用信息的消息。 |
