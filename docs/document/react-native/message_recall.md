# 撤回消息

## 功能说明

单聊、群聊和聊天室会话均支持撤回一条已发送成功的消息。

**适用范围**

除透传消息外，其他类型的消息均支持撤回。

**权限规则**

- 在单聊中，仅消息发送方可以撤回自己发送的消息；若消息已超过可撤回时限，则撤回失败。
- 在群聊和聊天室中，普通成员仅可撤回自己发送的消息；若消息已超过可撤回时限，则撤回失败。
- 在群聊和聊天室中，群主、群管理员、聊天室所有者和聊天室管理员可撤回其他成员发送的消息，且不受普通成员撤回时限的限制，即使消息过期也能撤回。

**时效限制**

- 默认可撤回发送后 2 分钟内的消息。
- 可以在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯 > 基础功能 > 消息与会话** 页面调整撤回时长，最长不超过 7 天。

**撤回结果**

- 消息撤回后，服务端保存的该条消息会被移除，包括历史消息、离线消息和漫游消息。
- 同时，消息发送方和接收方本地内存及数据库中的该条消息也会被移除。
- 对于附件类消息，例如图片、语音、视频和文件消息，消息被撤回后，对应的消息附件也会一并删除。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录、建立连接，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。

## 撤回消息

调用 `ChatManager#recallMessage(msgId, { ext })` 撤回一条已发送成功的消息，返回 `Promise<void>`。其中 `msgId` 为消息 ID，`ext` 为可选的自定义字符串，可用于在收到撤回事件时处理业务提示。

React Native 的 Android 桥接会根据 `msgId` 读取本地消息，因此应确保消息存在于当前设备的本地数据库中。

```typescript
async function recallSentMessage(msgId: string): Promise<void> {
  const manager = ChatClient.getInstance().chatManager;
  try {
    const message = await manager.getMessage(msgId);
    if (!message) {
      console.warn('本地未找到待撤回消息');
      return;
    }
    await manager.recallMessage(msgId, { ext: '撤回了一条消息' });
    console.log('消息撤回成功，请刷新消息列表');
  } catch (error: unknown) {
    console.error('撤回消息失败：', error);
  }
}
```

:::tip
1. 撤回时可以通过 `ext` 参数携带自定义字符串，供收到撤回事件的客户端进行业务处理。该参数的默认值为空字符串。
2. 对于图片、语音、视频和文件等附件消息，撤回消息后，对应的消息附件也会被删除。
:::

## 设置消息撤回监听

通过 `ChatMessageEventListener#onMessagesRecalledInfo` 监听消息撤回事件。该回调返回 `ChatRecalledMessageInfo[]`：

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `recalledBy` | `string` | 撤回者的用户 ID。 |
| `recalledMessageId` | `string` | 被撤回消息的消息 ID。 |
| `recalledExt` | `string \| undefined` | 撤回时携带的扩展字符串。 |
| `recalledConvId` | `string \| undefined` | 被撤回消息所属的会话 ID。 |
| `recalledMessage` | `ChatMessage \| undefined` | 被撤回的消息对象。 |

`recalledMessage` 的值与消息接收情况有关：
- 若用户在线时已收到消息，通常可取得该对象；
- 若消息发送和撤回期间接收方一直离线，用户上线后只会收到撤回事件，而该属性为 `undefined`。
应用应优先使用消息 ID 更新界面，或者在 UI 中展示“某用户撤回了一条消息”等占位提示，不要依赖消息对象始终存在。

```typescript
const manager = ChatClient.getInstance().chatManager;
const listener: ChatMessageEventListener = {
  onMessagesRecalledInfo: (infos) => {
    for (const info of infos) {
      console.log('撤回消息：', {
        msgId: info.recalledMessageId,
        convId: info.recalledConvId,
        operator: info.recalledBy,
        ext: info.recalledExt,
        originalMessage: info.recalledMessage,
      });
      // 根据消息 ID 移除原消息，或展示撤回占位提示
    }
  },
};
manager.addMessageListener(listener);

// 页面或组件销毁、不再需要监听时执行
// manager.removeMessageListener(listener);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`recallMessage`](#撤回消息-1) | `ChatManager` | 异步撤回消息，可携带扩展字符串。 |
| [`getMessage`](#撤回消息-1) | `ChatManager` | 检查待撤回消息是否在本地存在。 |
| [`onMessagesRecalledInfo`](#设置消息撤回监听) | `ChatMessageEventListener` | 接收撤回者、消息 ID、会话 ID 等信息。 |
| [`addMessageListener`](#设置消息撤回监听) / [`removeMessageListener`](#设置消息撤回监听) | `ChatManager` | 注册和移除同一个消息监听器。 |
