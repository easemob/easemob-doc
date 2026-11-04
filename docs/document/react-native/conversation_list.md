# 会话列表

## 功能说明

- **本地会话列表：** 对于单聊、群组聊天和聊天室会话，用户收发消息时，SDK 会在本地创建或更新对应会话，并将其维护在本地会话列表缓存中。应用可从本地内存或数据库读取会话列表，用于展示会话名称、头像、最后一条消息、未读数、置顶状态和会话标记等信息。
- **服务端与本地数据：** 环信服务器和 SDK 本地均可维护会话列表数据：服务端保存当前用户的会话状态，SDK 本地缓存用于客户端快速读取和展示会话列表。完成 SDK 初始化并成功登录后，SDK 会自动维护本地会话列表；会话同步、收发消息、删除会话、清空未读数、设置或取消置顶、添加或移除会话标记等操作均可能更新本地列表。
- **同步与变更通知：** 初始化前配置 `ChatOptions.dataSyncType` 包含 `ChatDataSyncType.Conversations` 后，用户登录成功时，SDK 会自动同步服务端会话数据。当前账号的本地数据库成功打开后，即可读取已有的本地会话列表；如需本次从服务端同步的最新数据，应等待会话同步成功后再读取。本地会话新增或删除时，SDK 会通过会话列表更新事件通知应用；同一账号在其他设备上设置或取消会话置顶时，当前设备也可通过多设备事件感知该变更。

## 功能开通

如需将服务端会话列表同步到本地，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。本地数据接口需在当前账号的数据库打开后调用。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 获取会话列表

应用应按照登录后自动同步、监听同步完成和读取本地会话列表的流程获取最新会话数据。

### 登录后自动同步会话列表

在调用 `ChatClient#init` 初始化 SDK 前，配置 `ChatOptions.dataSyncType` 包含 `ChatDataSyncType.Conversations`。用户登录成功后，SDK 会自动同步会话列表并写入本地。

```typescript
async function initializeForConversations(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: 'your-org#your-app',
      // 登录成功后自动同步会话列表
      dataSyncType: ChatDataSyncType.Conversations,
    });
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}
```

若还需要同步好友列表或已加入的群组列表，可以使用按位或组合 `ChatDataSyncType.Contacts` 或 `ChatDataSyncType.JoinedGroups`。`ChatDataSyncType.None` 表示关闭自动数据同步。

### 监听会话列表同步状态

通过 `ChatConnectEventListener` 监听会话列表同步状态。当 `type` 位掩码包含 `ChatDataSyncType.Conversations` 时，表示当前同步包含会话列表。建议在 SDK 初始化完成后、用户登录前注册监听器。

```typescript
const client = ChatClient.getInstance();
const connectionListener: ChatConnectEventListener = {
  onConnected(): void {
    // SDK 已成功连接到 IM 服务器
  },
  onDisconnected(errorCode): void {
    // SDK 与 IM 服务器断开连接，可根据 errorCode 判断原因
  },
  onDataSyncStart(type): void {
    if ((type & ChatDataSyncType.Conversations) !== 0) {
      // 会话列表开始同步
    }
  },
  onDataSyncFinish(type, errorCode): void {
    if ((type & ChatDataSyncType.Conversations) === 0) {
      return;
    }
    if (errorCode === 0) {
      // 会话列表同步成功，可以读取本地会话列表
    } else {
      // 会话列表同步失败，根据 errorCode 处理错误
      console.error('会话列表同步失败：', errorCode);
    }
  },
};
client.addConnectionListener(connectionListener);

// 不再需要监听时移除
// client.removeConnectionListener(connectionListener);
```

`ChatConnectEventListener#onDatabaseOpened(username, errorCode)` 表示当前账号的本地数据库打开完成，`errorCode` 为 `0` 时可以读取本地缓存。该事件不表示服务端会话数据已经同步完成；需要本次登录后的最新数据时，应等待会话同步成功。

### 会话相关选项

初始化时，你可以在 `ChatOptions` 中设置以下会话相关选项：

| 选项 | 描述 |
| :--- | :--- |
| `dataSyncType` | 设置登录成功后自动同步的数据类型。必须在初始化 SDK 前设置。<br/> - 包含 `ChatDataSyncType.Conversations`：同步会话列表。<br/> - `ChatDataSyncType.None`：关闭自动数据同步。<br/> - 未设置：沿用原生默认配置，建议显式指定。 |
| `deleteMessagesAsExitChatRoom` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/> - （默认）`true`：删除本地消息。<br/> - `false`：保留本地消息。 |
| `enableEmptyConversation` | 设置从本地数据库加载会话时是否包含空会话。必须在初始化 SDK 前设置。<br/> - `true`：包含空会话。<br/> - （默认）`false`：不包含空会话。 |

### 一次性获取本地所有会话

调用 `ChatManager#getAllConversations` 可以获取本地会话列表。该接口返回 `Promise<ChatConversation[]>`，不会主动向服务器请求会话列表。React Native SDK 5.0.0 在两端的返回顺序如下：

- Android：置顶会话排在非置顶会话之前；置顶和非置顶会话内部均按照最后一条消息的时间戳倒序排列。
- iOS：按最近一条消息的时间倒序排列，不保证置顶会话优先。

```typescript
async function readAllConversations(): Promise<void> {
  try {
    // 获取本地会话列表
    const conversations = await ChatClient.getInstance().chatManager
      .getAllConversations();
    console.log('本地会话列表：', conversations);
  } catch (error: unknown) {
    console.error('读取本地会话列表失败：', error);
  }
}
```

## 获取会话名称和头像

通过只读可选属性 `ChatConversation.displayName` 和 `ChatConversation.displayAvatar` 可获取会话的显示名称和头像：

- 单聊会话：分别为对端用户的昵称和头像。
- 群聊会话：分别为群名称和群头像。
- 相关用户或群组数据尚未同步时，这两个属性可能为空字符串或 `undefined`。

```typescript
// conversation 为已获取的 ChatConversation 对象
const conversationName = conversation.displayName;
const conversationAvatar = conversation.displayAvatar;
```

## 会话列表数据更新场景

| 场景 | 是否影响服务端数据 | 是否影响本地会话列表 |
| :--- | :--- | :--- |
| 登录后从服务端同步会话数据并写入本地，不修改服务端会话状态 | 否 | 是 |
| 收发消息时，SDK 创建或更新本地会话的最后一条消息、排序和未读数 | 视服务端配置而定 | 是 |
| 设置或取消会话置顶，同时更新服务端和本地置顶状态<br/>方法：`ChatManager#pinConversation` | 是 | 是 |
| 添加或移除服务端及本地会话标记<br/>方法：`ChatManager#addRemoteAndLocalConversationsMark` / `ChatManager#deleteRemoteAndLocalConversationsMark` | 是 | 是 |
| 删除本地会话，由 `withMessage` 参数决定是否同时删除本地消息<br/>方法：`ChatManager#deleteConversation` | 否 | 是 |
| 删除服务端和本地的指定会话，由 `isDeleteMessage` 参数决定是否删除服务端历史消息<br/>方法：`ChatManager#removeConversationFromServer` | 是 | 是 |
| 清空指定会话的未读消息数并尝试同步多设备状态<br/>方法：`ChatManager#clearConversationUnreadMessageCount` | 同步成功时影响 | 是 |
| 清空全部会话的未读消息数并尝试同步多设备状态<br/>方法：`ChatManager#clearAllConversationUnreadMessageCount` | 同步成功时影响 | 是 |

## 监听会话列表更新

本地会话新增或删除时，SDK 会触发 `ChatMessageEventListener#onConversationsUpdate`。该回调不直接返回完整会话列表，应用应重新调用 `ChatManager#getAllConversations` 获取最新结果并刷新 UI。

```typescript
const manager = ChatClient.getInstance().chatManager;
const conversationListener: ChatMessageEventListener = {
  onConversationsUpdate(): void {
    void manager.getAllConversations()
      .then((conversations) => {
        // 使用最新会话列表刷新 UI
        console.log('最新会话列表：', conversations);
      })
      .catch((error: unknown) => console.error('读取会话列表失败：', error));
  },
};
manager.addMessageListener(conversationListener);

// 不再需要监听时移除
// manager.removeMessageListener(conversationListener);
```

本端置顶、标记或清零未读数后，应在操作成功时按需重新查询列表；新消息、同步完成和多设备事件也可作为刷新入口，不依赖 `onConversationsUpdate` 覆盖所有变化。

## 接口最佳实践

| 场景 | 推荐做法 |
| :--- | :--- |
| 获取最新会话列表 | 在初始化 SDK 前显式配置 `ChatDataSyncType.Conversations`；在会话同步成功后读取本地数据。 |
| 展示会话列表 | 调用 `ChatManager#getAllConversations`，注意 Android 和 iOS 的排序差异；需要统一顺序时在应用侧排序。 |
| 响应会话变化 | 注册 `ChatMessageEventListener`；收到 `ChatMessageEventListener#onConversationsUpdate` 后重新读取本地会话列表并刷新 UI。 |
| 管理监听器 | 页面或组件销毁时移除 `ChatConnectEventListener` 和 `ChatMessageEventListener`，避免重复回调和内存泄漏。 |
| 释放并恢复会话内存 | React Native SDK 5.0.0 未提供会话缓存清理及数据库筛选的公开接口，不使用会话删除代替内存清理。 |

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`withAppKey`](#登录后自动同步会话列表) | `ChatOptions` | 使用应用的 App Key 创建初始化配置。 |
| [`dataSyncType`](#登录后自动同步会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`enableEmptyConversation`](#会话相关选项) | `ChatOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
| [`deleteMessagesAsExitChatRoom`](#会话相关选项) | `ChatOptions` | 设置退出聊天室时是否删除该聊天室的本地消息。 |
| [`init`](#登录后自动同步会话列表) | `ChatClient` | 使用指定配置初始化 React Native SDK。 |
| [`getAllConversations`](#一次性获取本地所有会话) | `ChatManager` | 获取本地会话列表。 |
| [`displayName` / `displayAvatar`](#获取会话名称和头像) | `ChatConversation` | 单聊或群聊会话的显示名称和头像。 |
| [`pinConversation`](#会话列表数据更新场景) | `ChatManager` | 设置或取消会话置顶。 |
| [`addRemoteAndLocalConversationsMark` / `deleteRemoteAndLocalConversationsMark`](#会话列表数据更新场景) | `ChatManager` | 添加或移除会话标记。 |
| [`deleteConversation`](#会话列表数据更新场景) | `ChatManager` | 删除本地会话，并按参数决定是否删除本地消息。 |
| [`removeConversationFromServer`](#会话列表数据更新场景) | `ChatManager` | 删除服务端和本地的指定会话。 |
| [`clearConversationUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 清空指定会话的未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 清空全部会话的未读消息数。 |
| [`onConversationsUpdate`](#监听会话列表更新) | `ChatMessageEventListener` | 监听本地会话新增或删除。 |
