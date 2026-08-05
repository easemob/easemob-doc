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
- 同时，消息发送方和接收方本地内存及数据库中的该条消息也会被一并移除。
- 对于附件类消息，例如图片、音频、视频和文件消息，消息被撤回后，其对应的消息附件也会一并删除。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功建立连接，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已注册 `ChatManager`，能够通过 `client.chatManager` 调用消息撤回相关接口。

## 撤回消息

你可以调用 `recallMessage` 方法撤回一条已发送成功的消息。

调用成功后，服务端保存的该条消息会被移除；会话中的所有相关成员都会收到 `onMessageRecalled` 事件。对于群聊和聊天室场景，若群主、管理员或聊天室管理员撤回了其他成员发送的消息，被撤回消息的发送方也会收到该事件。

```typescript
const result = await client.chatManager.recallMessage({
  messageId: 'msgServerId', // 消息的服务端 ID
  conversationId: 'user2',
  conversationType: 'singleChat',
  // 可选：撤回时附带的扩展信息（如"撤回了一条消息并编辑"）
  ext: { reason: '发错了' },
});
```

## 设置消息撤回监听

你可以通过 `onMessageRecalled` 监听消息撤回事件。当消息被撤回后，会话中的相关成员会收到该事件。事件载荷中包含被撤回的消息 ID `messageId`、消息所属的会话 ID `conversationId`、会话类型 `conversationType` 以及撤回时间 `timestamp`。如需更新本地消息列表、撤回占位文案或附件展示状态，需由业务侧自行处理。需要注意的是，当前 SDK 不会提供撤回者的用户 ID、扩展信息或被撤回消息的完整内容，若业务需展示此类信息，建议结合本地消息数据或业务缓存自行补充。

```typescript
client.addEventHandler('recall', {
  onMessageRecalled: (event) => {
    console.log('消息被撤回:', event.messageId);
    console.log('会话 ID:', event.conversationId);
    console.log('撤回时间:', event.timestamp);
    // 在 UI 上根据 messageId 将对应消息替换为“消息已撤回”等占位提示
  },
});
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`recallMessage`](#撤回消息) | `ChatManager` | 撤回消息。 |