# 转发消息

## 功能说明

转发消息是指将当前会话中发送成功或接收到的消息转发至其他会话。例如，用户 A 向用户 B 发送一条消息后，用户 B 可以将该消息转发给用户 C、群组或聊天室。

环信即时通讯 IM HarmonyOS SDK 支持以下转发方式：

- **转发单条消息**：基于原消息的消息体和扩展字段创建一条新消息，再将其发送至目标单聊、群聊或聊天室。该方式支持文本、图片、语音、视频、文件、位置、透传、自定义及合并消息等消息类型。
- **转发多条消息**：将多条消息合并为一条合并消息，再发送至目标会话。接收方可以展开合并消息，查看其中包含的消息内容。详见 [发送合并消息](message_send.html#发送合并消息)。

转发操作会生成并发送一条新消息。新消息拥有独立的消息 ID、发送方、接收方和发送时间，不会改变原消息及其所在会话的数据。对于附件消息，SDK 可以复用原消息中的服务端附件地址，无需重新上传附件；若原附件因超过存储期限已从服务器删除，接收方将无法下载该附件。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 转发单条消息

转发单条消息时，可以先调用 `ChatManager#getMessage` 根据消息 ID 获取本地消息，再通过 `ChatMessage#getBody` 获取原消息的消息体。调用 `ChatMessage#createSendMessage` 时，传入目标会话 ID、原消息体和目标会话类型，即可创建一条相同内容的新消息。如果还需保留原消息的扩展信息，可以通过 `ChatMessage#ext` 获取原消息的扩展字段，并调用新消息的 `ChatMessage#setExt` 进行设置。最后，调用 `ChatManager#sendMessage` 发送新消息。

单条消息可以转发至单聊、群聊或聊天室，支持文本、图片、语音、视频、文件、位置、透传、自定义和合并消息等消息类型。

转发附件消息时，SDK 可以复用原消息中的服务端附件地址，无需重新上传附件。如果附件因超过存储期限已从服务器删除，转发后的消息仍可包含原附件地址，但接收方将无法下载该附件。

:::tip
合并消息也可以作为单条消息直接转发。
:::

```typescript
function forwardMessage(messageId: string, to: string, chatType: ChatType): void {
  const chatManager: ChatManager | undefined = ChatClient.getInstance().chatManager();
  if (!chatManager) {
    return;
  }

  // messageId 为要转发的消息 ID。
  const targetMessage: ChatMessage | undefined = chatManager.getMessage(messageId);
  if (!targetMessage) {
    return;
  }

  const targetMessageBody: ChatMessageBody | undefined = targetMessage.getBody();
  if (!targetMessageBody) {
    return;
  }

  // to：单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID。
  // chatType：分别传入 ChatType.Chat、ChatType.GroupChat 或 ChatType.ChatRoom。
  const newMessage: ChatMessage = ChatMessage.createSendMessage(
    to,
    targetMessageBody,
    chatType
  );

  // 复制原消息的扩展字段。
  const ext: Map<string, MessageExtType> = targetMessage.ext();
  newMessage.setExt(ext);

  chatManager.sendMessage(newMessage);
}
```

## 转发多条消息

对于转发多条消息，环信即时通讯 IM 支持将多条消息合并为一条合并消息后进行转发，详见 [发送合并消息](message_send.html#发送合并消息)。

## 注意事项

- 转发消息本质上是一条新消息。转发后生成的新消息拥有独立的消息 ID、发送方、接收方和发送时间，不会改变原消息及其所在会话的数据。
- SDK 接收到单条转发消息时，返回的仍是标准 `ChatMessage` 对象，不会自动标记该消息是否由转发产生。若业务需要区分普通消息和转发消息，建议在转发时通过 `ext` 添加自定义标记，并在接收时自行解析。
- 单条转发会重新创建并发送一条消息。虽然新消息复用原消息的消息体和扩展字段，但其消息元数据已经变化，因此不应将其视为原消息本身。
- 转发附件消息时，SDK 可以复用原消息中的服务端附件地址，无需重新上传附件。若原附件因超过存储期限已被服务端删除，接收方仍可能收到转发消息，但无法下载对应附件。
- 接收合并消息时，消息类型为 `ContentType.COMBINE`。如需查看其中包含的消息内容，应调用 `ChatManager#downloadAndParseCombineMessage` 下载并解析。详见 [接收合并消息](message_receive.html#接收合并消息)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getMessage`](#转发单条消息) | `ChatManager` | 根据消息 ID 获取本地消息；未找到时返回 `undefined`。 |
| [`getBody`](#转发单条消息) | `ChatMessage` | 获取原消息的消息体。 |
| [`createSendMessage`](#转发单条消息) | `ChatMessage` | 根据目标会话、原消息体和目标会话类型创建待发送消息。 |
| [`ext`](#转发单条消息) | `ChatMessage` | 获取原消息的扩展字段。 |
| [`setExt`](#转发单条消息) | `ChatMessage` | 设置新消息的扩展字段。 |
| [`sendMessage`](#转发单条消息) | `ChatManager` | 发送转发消息。 |
| [`downloadAndParseCombineMessage`](#注意事项) | `ChatManager` | 下载并解析合并消息附件。 |
