# 会话列表

## 功能说明

- **本地会话列表：** 对于单聊、群组聊天和聊天室会话，用户收发消息时，SDK 会在本地创建或更新对应会话，并将其维护在本地会话列表缓存中。应用可从本地内存或数据库读取会话列表，用于展示会话名称、头像、最后一条消息、未读数、置顶状态和会话标记等信息。自 5.1.0 起，本地会话列表默认不包含聊天室会话；如需包含，必须在初始化前将 `ChatOptions.enableChatroomConversation` 设置为 `true`。
- **服务端与本地数据：** 环信服务器和 SDK 本地均可维护会话列表数据：服务端保存当前用户的会话状态，SDK 本地缓存用于客户端快速读取和展示会话列表。完成 SDK 初始化并成功登录后，SDK 会自动维护本地会话列表；会话同步、收发消息、删除会话、清空未读数、设置或取消置顶、添加或移除会话标记等操作均可能更新本地列表。
- **同步与变更通知：** 自 5.1.0 起，两端均默认在登录后同步服务端会话数据。应用也可在初始化前通过 `ChatOptions.dataSyncType` 显式指定同步范围。当前账号的本地数据库成功打开后，即可读取已有的本地会话列表；如需本次从服务端同步的最新数据，应等待会话同步成功后再读取。本地会话新增或删除时，SDK 会通过会话列表更新事件通知应用；同一账号在其他设备上设置或取消会话置顶时，当前设备也可通过多设备事件感知该变更。

## 功能开通

如需将服务端会话列表同步到本地，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。本地数据接口需在当前账号的数据库打开后调用。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 获取会话列表

应用应按照登录后自动同步、监听同步完成和读取本地会话列表的流程获取最新会话数据。

### 登录后自动同步会话列表

React Native SDK 5.1.0 在 Android 和 iOS 上均默认同步会话列表。也可在调用 `ChatClient#init` 前，通过 `ChatOptions.dataSyncType` 显式配置 `ChatDataSyncType.Conversations` 或其他同步类型：

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

若还需要同步好友列表或已加入的群组列表，可以使用按位或组合 `ChatDataSyncType.Contacts` 或 `ChatDataSyncType.JoinedGroups`。`ChatDataSyncType.None` 表示关闭自动数据同步。未设置 `dataSyncType` 时使用原生默认配置，不等同于 `None`；从 5.0.0 升级到 5.1.0 及以上版本时，需注意 Android 的默认值已经改变。

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
| `dataSyncType` | 设置登录成功后自动同步的数据类型。必须在初始化 SDK 前设置。<br/> - 包含 `ChatDataSyncType.Conversations`：同步会话列表。<br/> - `ChatDataSyncType.None`：关闭自动数据同步。<br/> - 未设置：5.1.0 两端均默认同步会话列表。 |
| `enableChatroomConversation` | 自 5.1.0 起支持。设置本地会话列表是否包含聊天室会话。<br/> - `true`：包含。<br/> -（默认）`false`：不包含。仅在初始化时生效。 |
| `autoLoadConversations` | 自 5.1.0 起支持。设置是否自动将全部本地会话加载到内存。<br/> -（默认）`true`：自动全量加载。<br/> - `false`：按需加载，调用 `getConversationsFromDB` 前必须设置。仅在初始化时生效。 |
| `deleteMessagesAsExitChatRoom` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/> - （默认）`true`：删除本地消息。<br/> - `false`：保留本地消息。 |
| `enableEmptyConversation` | 设置从本地数据库加载会话时是否包含空会话。必须在初始化 SDK 前设置。<br/> - `true`：包含空会话。<br/> - （默认）`false`：不包含空会话。 |

### 分页获取本地会话

自 React Native SDK 5.1.0 起，可从本地数据库按需分页读取会话，减少首次加载的数据量。调用 `ChatManager#getConversationsFromDB` 前，必须在初始化时将 `ChatOptions.autoLoadConversations` 设置为 `false`，关闭本地会话自动全量加载。该配置与登录后自动同步服务端数据相互独立。

先在应用统一的 SDK 初始化流程中配置，以下初始化示例与其他章节的初始化示例按需合并，不要重复初始化：

```typescript
const options = ChatOptions.withAppKey({
  appKey: 'your-org#your-app',
  autoLoadConversations: false,
  // 如需在本地会话列表中包含聊天室会话，可设为 true。
  enableChatroomConversation: false,
});
await ChatClient.getInstance().init(options);
```

当前账号的本地数据库打开成功后可以读取已有缓存；如需本次登录后从服务端同步的最新会话，应等待会话数据同步成功。以下示例每次读取一页，将返回的游标保存后用于下一页：

```typescript
let nextConversationCursor = '';
let hasMoreConversations = true;
let loadingConversations = false;

async function loadNextConversationPage(
  refresh = false
): Promise<ChatConversation[]> {
  if (loadingConversations) {
    throw new Error('正在读取会话，请等待当前请求完成');
  }
  if (refresh) {
    nextConversationCursor = '';
    hasMoreConversations = true;
  }
  if (!hasMoreConversations) {
    return [];
  }

  loadingConversations = true;
  try {
    const result = await ChatClient.getInstance().chatManager
      .getConversationsFromDB({
        cursor: nextConversationCursor,
        pageSize: 20,
      });
    nextConversationCursor = result.cursor;
    hasMoreConversations = result.cursor.length > 0;
    return result.list ?? [];
  } finally {
    loadingConversations = false;
  }
}
```

调用方应处理 Promise 拒绝并更新界面；加载下一页时追加返回列表，刷新时传入 `true` 并用第一页替换已有列表。账号切换或列表变化后应重置分页状态，避免继续使用旧游标。

| 参数或返回字段 | 说明 |
| :--- | :--- |
| `params` | 必传的分页参数对象。使用默认参数时传入 `{}`。 |
| `params.cursor` | 类型为 `string`，可选。不传或传空字符串时获取第一页；后续传入上一页返回的游标。 |
| `params.pageSize` | 类型为 `number`，可选，取值范围为 1–100，默认 20。 |
| `ChatCursorResult.list` | 当前页的会话列表，类型为 `ChatConversation[] \| undefined`，可使用 `result.list ?? []` 读取。 |
| `ChatCursorResult.cursor` | 下一页游标，类型为 `string`；返回空字符串表示已到最后一页。 |

接口返回 `Promise<ChatCursorResult<ChatConversation>>`，失败时通过 `ChatError` 报错；无效游标对应原生错误码 `110`。不要依赖可选的 `totalCount` 判断是否还有下一页。排序规则详见 [本地会话排序规则](#本地会话排序规则)。

### 一次性获取本地所有会话

调用 `ChatManager#getAllConversations` 可以获取本地会话列表。SDK 优先读取内存，内存中无会话时读取本地数据库。该接口返回 `Promise<ChatConversation[]>`，不会主动向服务器请求会话列表。自 5.1.0 起，`isSort` 默认为 `true`，两端均置顶优先，并按最近一条消息时间倒序排列；传入 `false` 时不保证顺序。排序规则详见 [本地会话排序规则](#本地会话排序规则)。

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

如需自行排序，可关闭 SDK 排序：

```typescript
const conversations = await ChatClient.getInstance().chatManager
  .getAllConversations(false);
```

分页模式下，应使用 `getConversationsFromDB` 持续读取，避免调用全量接口抵消按需加载的效果。

### 本地会话排序规则

`getConversationsFromDB` 和启用排序的 `getAllConversations` 均按以下优先级排列会话：

1. 置顶状态优先：置顶会话排在非置顶会话之前。
2. 最近一条消息的时间戳倒序：置顶状态相同时，消息时间较新的会话排在前面。

分页接口 `getConversationsFromDB` 使用最近一条消息的服务器时间戳；置顶状态和时间戳均相同时，继续按会话 ID 倒序排列，比较时不区分大小写。

`getAllConversations` 未约定时间戳相同时的会话 ID 顺序，当多个会话的置顶状态和最新消息时间戳均相同时，`getAllConversations` 不保证这些会话的排列顺序与 `getConversationsFromDB` 的分页结果一致。`isSort` 默认为 `true`；设为 `false` 时，不保证返回顺序。

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

本地会话新增或删除时，SDK 会触发 `ChatMessageEventListener#onConversationsUpdate`。该回调不直接返回完整会话列表。全量模式下，应用应重新调用 `ChatManager#getAllConversations` 获取最新结果并刷新 UI；分页模式下，应重置游标并重新分页读取。以下示例适用于全量加载模式。

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
| 获取最新会话列表 | 使用 5.1.0 默认会话同步配置，或在初始化前显式指定 `ChatDataSyncType.Conversations`；在会话同步成功后读取本地数据。 |
| 展示会话列表 | 全量读取使用默认排序的 `getAllConversations()`；自行排序时传入 `false`；按需分页时在初始化设置 `autoLoadConversations: false`，再调用 `getConversationsFromDB`。 |
| 响应会话变化 | 注册 `ChatMessageEventListener`；收到 `ChatMessageEventListener#onConversationsUpdate` 后，按当前全量或分页模式重新读取并刷新 UI。 |
| 管理监听器 | 页面或组件销毁时移除 `ChatConnectEventListener` 和 `ChatMessageEventListener`，避免重复回调和内存泄漏。 |
| 释放并恢复会话内存 | 5.1.0 可通过 `autoLoadConversations: false` 和分页接口按需加载；未提供会话缓存清理及自定义数据库筛选的公开接口，不使用会话删除代替内存清理。 |

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`withAppKey`](#登录后自动同步会话列表) | `ChatOptions` | 使用应用的 App Key 创建初始化配置。 |
| [`dataSyncType`](#登录后自动同步会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`enableEmptyConversation`](#会话相关选项) | `ChatOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
| [`deleteMessagesAsExitChatRoom`](#会话相关选项) | `ChatOptions` | 设置退出聊天室时是否删除该聊天室的本地消息。 |
| [`init`](#登录后自动同步会话列表) | `ChatClient` | 使用指定配置初始化 React Native SDK。 |
| [`getAllConversations`](#一次性获取本地所有会话) | `ChatManager` | 获取本地会话列表，`isSort` 默认为 `true`。 |
| [`getConversationsFromDB`](#分页获取本地会话) | `ChatManager` | 从本地数据库分页读取会话及下一页游标。 |
| [`autoLoadConversations`](#会话相关选项) | `ChatOptions` | 设置是否自动全量加载本地会话，默认 `true`；分页前须设为 `false`。 |
| [`enableChatroomConversation`](#会话相关选项) | `ChatOptions` | 设置本地会话列表是否包含聊天室会话，默认 `false`。 |
| [`displayName` / `displayAvatar`](#获取会话名称和头像) | `ChatConversation` | 单聊或群聊会话的显示名称和头像。 |
| [`pinConversation`](#会话列表数据更新场景) | `ChatManager` | 设置或取消会话置顶。 |
| [`addRemoteAndLocalConversationsMark` / `deleteRemoteAndLocalConversationsMark`](#会话列表数据更新场景) | `ChatManager` | 添加或移除会话标记。 |
| [`deleteConversation`](#会话列表数据更新场景) | `ChatManager` | 删除本地会话，并按参数决定是否删除本地消息。 |
| [`removeConversationFromServer`](#会话列表数据更新场景) | `ChatManager` | 删除服务端和本地的指定会话。 |
| [`clearConversationUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 清空指定会话的未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 清空全部会话的未读消息数。 |
| [`onConversationsUpdate`](#监听会话列表更新) | `ChatMessageEventListener` | 监听本地会话新增或删除。 |
