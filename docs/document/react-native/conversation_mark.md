# 会话标记

## 功能说明

会话标记用于为会话添加业务分类，例如标星、待处理或重要客户等。SDK 支持为单聊、群聊和聊天室会话添加或移除标记。

SDK 提供 `ChatConversationMarkType.Type0` 至 `ChatConversationMarkType.Type19` 共 20 个标记，单个会话最多可同时包含 20 个标记。各标记的业务含义由应用自行定义和维护。

```typescript
const markMapping = new Map<ChatConversationMarkType, string>([
  [ChatConversationMarkType.Type0, 'important'],
  [ChatConversationMarkType.Type1, 'pending'],
  [ChatConversationMarkType.Type2, 'customer'],
]);
```

:::tip
会话标记只用于会话分类和筛选，不会影响会话未读数、消息收发、置顶状态或消息已读状态。
:::

## 功能开通

会话标记属于服务端会话列表功能的一部分。使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。本地数据接口需在当前账号的数据库打开后调用。
- 已开通[服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 添加会话标记

调用 `ChatManager#addRemoteAndLocalConversationsMark` 为一个或多个会话添加指定标记。该操作会同时更新服务端和本地的会话标记。单次最多可传入 20 个会话 ID。

初始化前配置 `ChatOptions.dataSyncType` 包含 `ChatDataSyncType.Conversations` 后，SDK 会在登录后自动同步会话列表及其标记并写入本地。添加会话标记后，标记数据会同时更新至服务端和本地。同步完成后，可通过本地会话列表接口获取 `ChatConversation` 对象，再读取 `ChatConversation.marks` 获取该会话的全部标记。

若服务端会话列表达到数量限制（默认最多 100 个会话），服务端可能根据会话活跃度移除不活跃会话。对应会话的标记也可能不再随服务端会话列表同步到本地。

:::tip
会话标记仅用于业务分类和筛选，不会影响消息收发、会话未读数、消息已读状态或会话置顶状态。
:::

```typescript
async function addConversationMark(): Promise<void> {
  const convIds = ['<peer_user_id>', '<group_id>'];
  try {
    // 为一个或多个会话添加指定标记
    await ChatClient.getInstance().chatManager
      .addRemoteAndLocalConversationsMark(convIds, ChatConversationMarkType.Type0);
    // 会话标记添加成功
  } catch (error: unknown) {
    // 根据错误码和错误信息处理
    console.error('添加会话标记失败：', error);
  }
}
```

参数说明如下：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `convIds` | `string[]` | 会话 ID 列表，不能为空；单次最多传入 20 个会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `mark` | `ChatConversationMarkType` | 添加的标记，取值为 `Type0` 至 `Type19`。 |

操作结果通过 `Promise<void>` 返回，失败时通过 Promise 报错。操作成功后，应重新读取本地会话获取最新标记。

## 移除会话标记

调用 `ChatManager#deleteRemoteAndLocalConversationsMark` 从一个或多个会话中移除指定标记。该操作会同时更新服务端和本地的会话标记。单次最多可传入 20 个会话 ID。

```typescript
async function removeConversationMark(): Promise<void> {
  const convIds = ['<peer_user_id>', '<group_id>'];
  try {
    // 从一个或多个会话中移除指定标记
    await ChatClient.getInstance().chatManager
      .deleteRemoteAndLocalConversationsMark(convIds, ChatConversationMarkType.Type0);
    // 会话标记移除成功
  } catch (error: unknown) {
    // 根据错误码和错误信息处理
    console.error('移除会话标记失败：', error);
  }
}
```

`ChatManager#deleteRemoteAndLocalConversationsMark` 的参数规则与 `ChatManager#addRemoteAndLocalConversationsMark` 相同。

## 按标记筛选会话列表

会话标记随会话数据在登录后自动同步并写入本地。当前账号的本地数据库成功打开后，即可读取已有的本地会话标记；如需本次从服务端同步的最新标记状态，应等待会话同步成功后再读取本地会话列表，并通过 `ChatConversation.marks` 筛选带有指定标记的会话。

在初始化前配置 `ChatOptions.dataSyncType` 包含 `ChatDataSyncType.Conversations`：

```typescript
async function initializeMarkSync(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: 'your-org#your-app',
      // 登录成功后自动同步会话列表及其标记
      dataSyncType: ChatDataSyncType.Conversations,
    });
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}
```

当 `ChatConnectEventListener#onDataSyncFinish` 回调中的 `type` 位掩码包含 `ChatDataSyncType.Conversations` 且 `errorCode` 为 `0` 时，可以读取本地会话列表并按标记筛选：

```typescript
async function readMarkedConversations(): Promise<void> {
  try {
    const conversations = await ChatClient.getInstance().chatManager
      .getAllConversations();
    // 筛选包含指定标记的会话
    const markedConversations = conversations.filter((conversation) =>
      conversation.marks?.includes(ChatConversationMarkType.Type0)
    );
    console.log('带有指定标记的会话：', markedConversations);
  } catch (error: unknown) {
    console.error('读取会话标记失败：', error);
  }
}
```

如需获取单个本地会话的全部标记，可以先调用 `ChatManager#getConversation` 获取会话对象，再读取 `ChatConversation.marks`：

```typescript
async function readConversationMarks(convId: string): Promise<void> {
  try {
    const conversation = await ChatClient.getInstance().chatManager
      .getConversation(convId, ChatConversationType.PeerChat, false);
    const marks = conversation?.marks ?? [];
    console.log('会话的全部标记：', marks);
  } catch (error: unknown) {
    console.error('读取会话标记失败：', error);
  }
}
```

:::tip
`ChatManager#getAllConversations` 和 `ChatManager#getConversation` 读取本地会话，不会主动向服务器请求数据。若需要最新的服务端标记状态，应先等待会话数据同步完成。
:::

## 监听会话列表更新

本地会话新增或删除时，SDK 会触发 `ChatMessageEventListener#onConversationsUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。本端添加或移除标记后，也应在操作成功时重新读取列表。

```typescript
const manager = ChatClient.getInstance().chatManager;
const conversationListener: ChatMessageEventListener = {
  onConversationsUpdate(): void {
    void manager.getAllConversations()
      .then((conversations) => {
        // 重新筛选带有目标标记的会话并刷新界面
        console.log('最新会话列表：', conversations);
      })
      .catch((error: unknown) => console.error('读取会话列表失败：', error));
  },
};
manager.addMessageListener(conversationListener);

// 不再需要监听时移除监听器
// manager.removeMessageListener(conversationListener);
```

同一用户在其他设备上更新会话标记时，当前设备可通过 `ChatMultiDeviceEventListener#onConversationEvent` 接收 `ChatMultiDeviceEvent.CONVERSATION_UPDATE_MARK` 事件。收到事件后，可重新读取本地会话列表并刷新界面。

```typescript
const client = ChatClient.getInstance();
const multiDeviceListener: ChatMultiDeviceEventListener = {
  onConversationEvent(event, convId, convType): void {
    if (event === ChatMultiDeviceEvent.CONVERSATION_UPDATE_MARK) {
      // 其他设备更新了会话标记，重新读取本地会话列表
    }
  },
};
client.addMultiDeviceListener(multiDeviceListener);

// 不再需要监听时移除监听器
// client.removeMultiDeviceListener(multiDeviceListener);
```

## 注意事项

- 会话标记支持单聊、群聊和聊天室会话。
- 会话标记取值为 `Type0` 至 `Type19`，各标记的业务含义由应用维护。
- 单个会话最多可以同时包含 20 个标记。
- `ChatManager#addRemoteAndLocalConversationsMark` 和 `ChatManager#deleteRemoteAndLocalConversationsMark` 可同时操作多个会话，单次最多传入 20 个会话 ID。
- 会话 ID 列表不能为空，标记不能为空；调用失败时，应根据错误码和错误信息处理。
- 会话标记会同时更新服务端和本地会话数据，并同步到当前用户的其他设备。
- 会话标记不影响会话未读数、消息已读状态、消息收发或会话置顶状态。
- 如需本次从服务端同步的最新标记状态，应在会话数据同步成功后，通过本地接口读取并筛选会话。
- 若服务端会话列表达到数量限制，不活跃会话可能被移出服务端会话列表，对应标记也可能不再随会话列表返回。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addRemoteAndLocalConversationsMark`](#添加会话标记) | `ChatManager` | 为一个或多个会话添加指定标记。 |
| [`deleteRemoteAndLocalConversationsMark`](#移除会话标记) | `ChatManager` | 从一个或多个会话中移除指定标记。 |
| [`withAppKey`](#按标记筛选会话列表) | `ChatOptions` | 使用应用的 App Key 创建初始化配置。 |
| [`dataSyncType`](#按标记筛选会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#按标记筛选会话列表) | `ChatClient` | 使用指定配置初始化 SDK。 |
| [`getAllConversations`](#按标记筛选会话列表) | `ChatManager` | 获取本地会话列表。 |
| [`getConversation`](#按标记筛选会话列表) | `ChatManager` | 获取指定的本地会话对象。 |
| [`marks`](#按标记筛选会话列表) | `ChatConversation` | 会话标记数组。 |
