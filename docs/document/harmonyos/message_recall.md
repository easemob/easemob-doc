# 撤回消息

## 功能说明

单聊、群聊和聊天室会话均支持撤回一条已发送成功的消息。

**适用范围**

- 除透传消息外，其他类型的消息均支持撤回。

**权限规则**

- 在单聊中，仅消息发送方可以撤回自己发送的消息；若消息已超过可撤回时限，则撤回失败。
- 在群聊和聊天室中，普通成员仅可撤回自己发送的消息；若消息已超过可撤回时限，则撤回失败。
- 在群聊和聊天室中，群主、群管理员、聊天室所有者和聊天室管理员可撤回其他成员发送的消息，且不受普通成员撤回时限的限制，即使消息过期也能撤回。

**时效限制**

- 默认情况下，消息发送方可撤回发送后 2 分钟内的消息。
- 你也可以在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯 > 基础功能 > 消息** 页面调整消息撤回时长，最长不超过 7 天。

**撤回结果**

- 消息撤回后，服务端保存的该条消息会被移除，包括历史消息、离线消息和漫游消息。
- 同时，消息发送方和接收方本地内存及数据库中的该条消息也会被移除。
- 对于附件类消息，例如图片、语音、视频和文件消息，消息被撤回后，对应的消息附件也会一并删除。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功建立连接，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 撤回消息

你可以调用 `ChatManager#recallMessage` 撤回一条已发送成功的消息。该方法返回 `Promise<void>`。

调用成功后，服务端以及消息发送方和接收方本地保存的消息（历史消息，离线消息或漫游消息）会被移除，相关用户通过 `ChatMessageListener#onMessageRecalled` 收到消息撤回事件。

:::tip
1. 撤回时可以通过 `ext` 参数携带自定义字符串，供收到撤回事件的客户端进行业务处理。该参数的默认值为空字符串。
2. 对于图片、语音、视频和文件等附件消息，撤回消息后，对应的消息附件也会被删除。
:::

```typescript
const recallExt: string = '撤回了一条消息';

ChatClient.getInstance().chatManager()?.recallMessage(message, recallExt)
  .then((): void => {
    // 消息撤回成功。
  })
  .catch((error: ChatError): void => {
    // 消息撤回失败，根据 error.errorCode 和 error.description 处理。
  });
```

## 设置消息撤回监听

你可以通过 `ChatMessageListener#onMessageRecalled` 监听消息撤回事件。该回调返回 `RecallMessageInfo` 列表：

| 方法 | 说明 |
| :--- | :--- |
| `getRecallBy()` | 获取撤回者的用户 ID。 |
| `getRecallMessageId()` | 获取被撤回消息的消息 ID。 |
| `getExt()` | 获取撤回消息时携带的扩展字符串。 |
| `getConversationId()` | 获取被撤回消息所属的会话 ID。 |
| `getRecallMessage()` | 获取被撤回的消息对象。 |

`getRecallMessage()` 的返回值与消息的接收情况有关：

- 若用户在线时已收到该消息，消息被撤回时，通常可以调用该方法获取被撤回的消息对象。
- 若消息发送及撤回期间接收方均处于离线状态，用户上线后只会收到撤回事件，此时该方法返回 `undefined`。

应用可以根据回调信息刷新消息列表，或者在 UI 中展示“某用户撤回了一条消息”等占位提示。

```typescript
const messageListener: ChatMessageListener = {
  // onMessageReceived 为必选回调。
  onMessageReceived: (messages: Array<ChatMessage>): void => {
  },
  onMessageRecalled: (recallInfoList: Array<RecallMessageInfo>): void => {
    recallInfoList.forEach((recallInfo: RecallMessageInfo): void => {
      const recaller: string = recallInfo.getRecallBy();
      const recalledMessageId: string = recallInfo.getRecallMessageId();
      const recallExt: string = recallInfo.getExt();
      const conversationId: string = recallInfo.getConversationId();
      const recalledMessage: ChatMessage | undefined = recallInfo.getRecallMessage();

      // 根据撤回信息更新消息列表和 UI。
    });
  }
};

const chatManager: ChatManager | undefined = ChatClient.getInstance().chatManager();
chatManager?.addMessageListener(messageListener);

// 不再需要监听时移除监听器。
chatManager?.removeMessageListener(messageListener);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`recallMessage`](#撤回消息) | `ChatManager` | 异步撤回一条已发送成功的消息，并可携带扩展字符串。 |
| [`getRecallBy`](#设置消息撤回监听) | `RecallMessageInfo` | 获取撤回者的用户 ID。 |
| [`getRecallMessageId`](#设置消息撤回监听) | `RecallMessageInfo` | 获取被撤回消息的消息 ID。 |
| [`getExt`](#设置消息撤回监听) | `RecallMessageInfo` | 获取撤回消息时携带的扩展字符串。 |
| [`getConversationId`](#设置消息撤回监听) | `RecallMessageInfo` | 获取被撤回消息所属的会话 ID。 |
| [`getRecallMessage`](#设置消息撤回监听) | `RecallMessageInfo` | 获取被撤回的消息对象；离线场景下可能返回 `undefined`。 |
