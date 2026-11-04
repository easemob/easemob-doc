# 导入和插入消息

<Toc />

本文介绍环信即时通讯 IM React Native SDK 如何将消息导入本地数据库，以及如何在本地会话中插入消息。

这些操作仅更新当前设备上的本地消息和会话数据，不会将消息发送给会话对端，也不会向服务器上传消息或同步到当前账号的其他设备。常见使用场景包括迁移历史消息、恢复本地消息记录，以及插入撤回提示、入群通知等仅用于本地展示的消息。

## 技术原理

React Native SDK 提供以下方式：

- 批量导入消息：调用 `ChatManager#importMessages`，将当前用户发送或接收的多条消息导入本地数据库，但不会更新对应会话的最新消息等会话信息。
- 插入单条消息：调用 `ChatManager#insertMessage`，SDK 根据消息的会话信息确定目标会话，并按照消息中的 Unix 时间戳插入，同时更新会话的最新消息等会话信息。

批量导入消息时，如果对应会话尚无最新消息记录，从本地数据库加载会话且过滤空会话时，该会话会被过滤，不会出现在返回的会话列表中。`ChatOptions.enableEmptyConversation` 默认为 `false`，即不加载空会话。该配置自 React Native SDK 1.21.0 起支持。

因此，建议按会话划分待导入的消息，将每个会话中按消息时间排序的最新一条消息预留出来，其余消息通过 `ChatManager#importMessages` 批量导入，待批量导入完成后，再通过 `ChatManager#insertMessage` 插入预留的消息，以更新会话信息。“最新”以 SDK 当前消息排序配置使用的时间戳为准。例如，同一个会话有 10:00、10:01 和 10:02 三条待导入的消息，可先通过 `ChatManager#importMessages` 导入前两条，再通过 `ChatManager#insertMessage` 插入 10:02 的消息。不要先将三条消息全部批量导入，再重复插入 10:02 的消息，否则 SDK 会因消息已存在而直接返回，不会更新会话信息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [初始化](initialization.html)及[连接](connection.html)文档。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 批量导入消息到数据库

你可以调用 `importMessages` 方法通过导入消息列表插入多条消息。典型应用为导入历史消息到本地数据库。

当前用户只能导入自己发送或接收的消息。导入后，消息保存在本地数据库中，但不会更新对应会话的最新消息等会话信息。

推荐一次导入 1,000 条以内的数据。

```typescript
// msgs：将要插入的消息数组
ChatClient.getInstance()
  .chatManager.importMessages(msgs)
  .then(() => {
    console.log("update message success");
  })
  .catch((reason) => {
    console.log("update message fail.", reason);
  });
```

### 插入消息

如果你需要在本地会话中加入一条消息，比如收到某些通知消息时，可以构造一条消息写入会话。

例如插入一条无需发送但有需要显示给用户看的内容，类似 “XXX 撤回一条消息”、“XXX 入群”、“对方正在输入” 等。

消息会根据消息中的 Unix 时间戳插入本地数据库，SDK 会更新会话的 `latestMessage` 等属性。

示例代码如下：

```typescript
ChatClient.getInstance().chatManager.insertMessage(msg).then(() => {
    console.log('insert message success.');
}).catch((e) => {
    console.log('insert message failed.');
});
```
