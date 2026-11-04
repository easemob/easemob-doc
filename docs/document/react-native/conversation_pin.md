# 会话置顶

## 功能说明

会话置顶用于将重要的单聊、群聊或聊天室会话固定在会话列表靠前位置，方便用户快速找到高频或重点会话。置顶状态会保存到服务端，并同步到当前用户的其他设备和本地会话数据。

## 功能开通

会话置顶属于服务端会话列表功能的一部分。使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。本地数据接口需在当前账号的数据库打开后调用。
- 已开通[服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 设置或取消置顶会话

调用 `ChatManager#pinConversation` 设置或取消会话置顶。置顶状态会存储在服务器上，状态变更会同时更新服务端和本地。`isPinned` 为 `true` 时置顶，为 `false` 时取消置顶。
多设备登录时，当前用户在一台设备上设置或取消会话置顶后，其他在线设备会通过 `ChatMultiDeviceEventListener#onConversationEvent` 收到多设备会话事件。设置置顶对应 `ChatMultiDeviceEvent.CONVERSATION_PINNED`，取消置顶对应 `ChatMultiDeviceEvent.CONVERSATION_UNPINNED`。

你最多可以置顶 50 个会话。

```typescript
async function pinConversation(convId: string): Promise<void> {
  const isPinned = true;
  try {
    await ChatClient.getInstance().chatManager.pinConversation(
      // 单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID
      convId,
      // 为 true 时置顶，为 false 时取消置顶
      isPinned
    );
    // 会话置顶状态设置成功
  } catch (error: unknown) {
    // 根据错误码和错误信息处理
    console.error('设置会话置顶状态失败：', error);
  }
}
```

参数说明如下：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `convId` | `string` | 会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `isPinned` | `boolean` | 是否置顶：`true` 表示置顶，`false` 表示取消置顶。 |

`ChatManager#pinConversation` 返回 `Promise<void>`，不直接返回更新后的会话对象。调用成功后，可重新读取本地会话，并通过以下属性获取置顶状态：

```typescript
async function readPinnedState(
  convId: string,
  convType: ChatConversationType
): Promise<void> {
  try {
    const conversation = await ChatClient.getInstance().chatManager
      .getConversation(convId, convType, false);
    if (conversation) {
      const pinned = conversation.isPinned;
      // 返回会话置顶时的 UNIX 时间戳，单位为毫秒；会话未置顶时返回 0
      const pinnedTime = conversation.pinnedTime;
    }
  } catch (error: unknown) {
    console.error('读取会话置顶状态失败：', error);
  }
}
```

## 获取置顶会话列表

置顶状态随会话数据在登录后自动同步并写入本地。当前账号的本地数据库成功打开后，即可读取已有的本地置顶状态；如需本次从服务端同步的最新置顶状态，应等待会话同步成功后再读取本地会话列表。

在初始化前配置 `ChatOptions.dataSyncType` 包含 `ChatDataSyncType.Conversations`：

```typescript
async function initializePinSync(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: 'your-org#your-app',
      // 登录成功后自动同步会话列表及置顶状态
      dataSyncType: ChatDataSyncType.Conversations,
    });
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}
```

当 `ChatConnectEventListener#onDataSyncFinish` 回调中的 `type` 位掩码包含 `ChatDataSyncType.Conversations` 且 `errorCode` 为 `0` 时，可调用 `ChatManager#getAllConversations` 获取本地会话列表，再筛选置顶会话：

```typescript
async function readPinnedConversations(): Promise<void> {
  try {
    const conversations = await ChatClient.getInstance().chatManager
      .getAllConversations();
    // 筛选置顶会话
    const pinnedConversations = conversations.filter(
      (conversation) => conversation.isPinned === true
    );
    console.log('置顶会话列表：', pinnedConversations);
  } catch (error: unknown) {
    console.error('读取置顶会话列表失败：', error);
  }
}
```

`ChatConversation` 中与会话置顶相关的属性如下：

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `convId` | `string` | 会话 ID。 |
| `convType` | `ChatConversationType` | 会话类型。 |
| `isPinned` | `boolean \| undefined` | 会话是否置顶。模型未提供值时默认为 `false`。 |
| `pinnedTime` | `number \| undefined` | 会话置顶时间戳，单位为毫秒；未置顶时为 `0`。 |

:::tip
若需要从本地数据库加载空会话，应在初始化 SDK 前设置 `ChatOptions.enableEmptyConversation` 为 `true`。否则，从本地数据库加载会话时默认不包含空会话。
:::

## 监听本地会话列表更新

本地会话新增或删除时，SDK 会触发 `ChatMessageEventListener#onConversationsUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。本端设置或取消置顶后，也应在操作成功时重新读取列表。

```typescript
const manager = ChatClient.getInstance().chatManager;
const conversationListener: ChatMessageEventListener = {
  onConversationsUpdate(): void {
    void manager.getAllConversations()
      .then((conversations) => {
        // 使用最新会话列表刷新界面
        console.log('最新会话列表：', conversations);
      })
      .catch((error: unknown) => console.error('读取会话列表失败：', error));
  },
};
manager.addMessageListener(conversationListener);

// 不再需要监听时移除监听器
// manager.removeMessageListener(conversationListener);
```

## 监听多设备会话置顶事件

同一用户在其他设备上设置或取消会话置顶时，当前设备可通过 `ChatMultiDeviceEventListener#onConversationEvent` 接收多设备会话事件：

| 事件 | 说明 |
| :--- | :--- |
| `ChatMultiDeviceEvent.CONVERSATION_PINNED` | 当前用户在其他设备上置顶会话。 |
| `ChatMultiDeviceEvent.CONVERSATION_UNPINNED` | 当前用户在其他设备上取消会话置顶。 |

```typescript
const client = ChatClient.getInstance();
const multiDeviceListener: ChatMultiDeviceEventListener = {
  onConversationEvent(event, convId, convType): void {
    if (
      event === ChatMultiDeviceEvent.CONVERSATION_PINNED ||
      event === ChatMultiDeviceEvent.CONVERSATION_UNPINNED
    ) {
      void client.chatManager.getAllConversations()
        .then((conversations) => {
          // 使用最新会话列表刷新界面
          console.log('最新会话列表：', conversations);
        })
        .catch((error: unknown) => console.error('读取会话列表失败：', error));
    }
  },
};
client.addMultiDeviceListener(multiDeviceListener);

// 不再需要监听时移除监听器
// client.removeMultiDeviceListener(multiDeviceListener);
```

:::tip
多设备事件通知当前用户的其他在线设备。当前设备发起置顶操作后，应以 `ChatManager#pinConversation` 的 Promise 结果为操作结果，并按需重新读取本地会话列表。
:::

## 注意事项

- 会话置顶支持单聊、群聊和聊天室会话。
- `convId` 不能为空；调用失败时，应根据错误码和错误信息处理。
- 最多可以置顶 50 个会话。
- 会话置顶状态保存在服务端，并同步到当前用户的其他设备。
- 如需本次从服务端同步的最新置顶状态，应在会话数据同步成功后，通过本地接口读取并筛选置顶会话。
- 会话置顶不影响消息收发、会话未读数、消息已读状态或会话标记。
- 本地会话列表默认不包含从数据库加载的空会话；如需包含，应在初始化 SDK 前设置 `ChatOptions.enableEmptyConversation` 为 `true`。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`pinConversation`](#设置或取消置顶会话) | `ChatManager` | 设置或取消指定会话的置顶状态。 |
| [`getConversation`](#设置或取消置顶会话) | `ChatManager` | 获取指定的本地会话对象。 |
| [`withAppKey`](#获取置顶会话列表) | `ChatOptions` | 使用应用的 App Key 创建初始化配置。 |
| [`dataSyncType`](#获取置顶会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#获取置顶会话列表) | `ChatClient` | 使用指定配置初始化 SDK。 |
| [`getAllConversations`](#获取置顶会话列表) | `ChatManager` | 获取本地会话列表。 |
| [`convId` / `convType`](#获取置顶会话列表) | `ChatConversation` | 会话 ID 和会话类型。 |
| [`isPinned` / `pinnedTime`](#获取置顶会话列表) | `ChatConversation` | 会话置顶状态和置顶时间。 |
| [`enableEmptyConversation`](#获取置顶会话列表) | `ChatOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
