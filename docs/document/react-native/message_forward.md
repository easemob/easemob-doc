# 转发消息

## 功能说明

转发消息是指将当前会话中发送成功或接收到的消息转发至其他会话。例如，用户 A 向用户 B 发送一条消息后，用户 B 可以将该消息转发给用户 C、群组或聊天室。

环信即时通讯 IM React Native SDK 支持以下转发方式：

- **转发单条消息**：基于原消息的消息体创建一条新消息，按需复制扩展字段，再发送至目标单聊、群聊、聊天室或消息话题。支持文本、图片、语音、视频、文件、位置、透传、自定义及合并消息等消息类型。
- **转发多条消息**：将多条消息合并为一条合并消息，再发送至目标会话。接收方可以展开合并消息，查看其中包含的消息内容。详见 [发送合并消息](message_send.html#发送合并消息)。

转发会生成并发送一条新消息，新消息拥有独立的消息 ID、发送方、接收方和发送时间，不会改变原消息及其所在会话的数据。对于附件消息，SDK 可以复用原消息中的服务端附件地址；若原附件已超过存储期限而被服务器删除，接收方将无法下载该附件。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)。
- 原消息为发送成功或已收到的消息；转发附件时，原服务端附件仍可访问。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 转发单条消息

1. 调用 `ChatManager#getMessage` 获取原消息。找不到本地消息时，应先获取原消息，而非继续转发空对象。
2. 调用 `ChatMessage#createSendMessage`，传入原消息的 `body`、目标 ID 和会话类型，创建新的发送消息。不要展开原消息并沿用其消息 ID 或发送状态。
3. 如需保留业务扩展字段，将原消息的 `attributes` 复制到新消息。只保留适用于目标会话的业务数据。
4. 调用 `ChatManager#sendMessage` 发送新消息，并通过发送状态回调观察结果。

单条消息可以转发至单聊、群聊、聊天室或消息话题(设置 `isChatThread: true`)，支持文本、图片、音频、视频、文件、位置、自定义和合并消息等消息类型。

转发附件消息时，SDK 可以复用原消息中的服务端附件地址，无需重新上传附件。如果附件因超过存储期限已从服务器删除，转发后的消息仍可包含原附件地址，但接收方将无法下载该附件。

:::tip
合并消息也可以作为单条消息直接转发。
:::

```typescript
async function forwardMessage(messageId: string): Promise<void> {
  const manager = ChatClient.getInstance().chatManager;
  try {
    const originalMessage = await manager.getMessage(messageId);
    if (!originalMessage) {
      console.warn('本地未找到待转发消息');
      return;
    }

    const forwardedMessage = ChatMessage.createSendMessage({
      body: originalMessage.body,
      targetId: '<target_group_id>',
      // 默认为单聊。转发到群聊或聊天室时，分别设置为 GroupChat 或 ChatRoom。
      chatType: ChatMessageChatType.GroupChat,
      // 转发到消息话题时，目标 ID 使用话题 ID，并设置为 true
      isChatThread: false,
    });
    // 将原消息中 SDK 支持类型的扩展字段复制到新消息。
    forwardedMessage.attributes = {
      ...originalMessage.attributes,
      forwarded: true,
    };

    await manager.sendMessage(forwardedMessage, {
      onSuccess: (sentMessage) => {
        console.log('转发成功：', sentMessage.msgId);
      },
      onError: (localMsgId, error) => {
        console.error('转发失败：', localMsgId, error.code, error.description);
      },
    });
  } catch (error: unknown) {
    console.error('获取原消息或发起转发失败：', error);
  }
}
```

## 转发多条消息

环信即时通讯 IM 支持将多条消息合并后转发，详见 [发送合并消息](message_send.html#发送合并消息)。接收方调用 `ChatManager#fetchCombineMessageDetail` 下载并解析合并消息附件，详见 [接收合并消息](message_receive.html#接收合并消息)。

## 注意事项

- 转发消息本质上是一条新消息。转发后生成的新消息拥有独立的消息 ID、发送方、接收方和发送时间，不会改变原消息及其所在会话的数据。
- 接收到单条转发消息时，仍返回标准 `ChatMessage` 对象，不会自动标记该消息是否由转发产生。若业务需要区分普通消息和转发消息，建议在转发时通过 `attributes` 添加自定义标记，并在接收时自行解析。
- 单条转发会重新创建并发送一条消息。虽然新消息通常复用原消息的消息体和扩展字段，但其消息元数据已发生变化，因此不应将其视为原消息本身。
- 转发附件消息时，SDK 可以复用原消息中的服务端附件地址，无需重新上传附件。若原附件因超过存储期限已被服务端删除，接收方仍可能收到转发消息，但无法下载对应附件。
- 接收合并消息时，`message.body.type` 为 `ChatMessageType.COMBINE`。如需查看其中包含的消息内容，可调用 `ChatManager#fetchCombineMessageDetail(message)` 下载并解析，返回包含原始消息的 `ChatMessage[]`。
- 若消息被转发至消息话题，可通过 `ChatMessage#isChatThread` 属性判断其是否为消息话题消息；如需获取会话 ID 和会话类型，可分别读取 `ChatMessage#conversationId` 和 `ChatMessage#chatType` 属性。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getMessage`](#转发单条消息) | `ChatManager` | 根据消息 ID 获取本地消息。 |
| [`createSendMessage`](#转发单条消息) | `ChatMessage` | 根据消息体创建新的发送消息。 |
| [`attributes`](#转发单条消息) | `ChatMessage` | 设置新消息的业务扩展字段。 |
| [`sendMessage`](#转发单条消息) | `ChatManager` | 发送转发消息。 |
| [`fetchCombineMessageDetail`](#转发多条消息) | `ChatManager` | 下载并解析合并消息。 |








