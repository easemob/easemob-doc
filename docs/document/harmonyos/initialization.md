# 初始化

初始化是使用 SDK 的必要步骤，必须在调用其他 SDK 接口前完成。

`ChatClient` 是单例。**对同一进程多次调用 `init` 时，只有第一次初始化及其配置生效**，因此应集中完成 `ChatOptions` 配置后再初始化。

:::tip
HarmonyOS SDK 5.0.0 初始化后不会自动登录。初始化完成后，应用需要在适当时机主动调用 `loginWithToken`，详见 [登录](login.html#登录)。
:::

## 前提条件

已注册有效的环信即时通讯 IM 开发者账号并创建应用，获取应用的 App Key。详见 [环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

创建 `ChatOptions`，通过构造参数设置 App Key，完成其他初始化配置后，将上下文和 `ChatOptions` 传入 `ChatClient#init`。

```typescript
let options: ChatOptions = new ChatOptions({
  appKey: 'your-org#your-app'
});
// 根据业务需要继续设置其他 ChatOptions 配置。

ChatClient.getInstance().init(context, options);
```

也可以通过 `ChatOptionsParam` 字面量直接传入初始化配置：

```typescript
ChatClient.getInstance().init(context, {
  appKey: 'your-org#your-app',
  isAutoAcceptGroupInvitations: true,
  isAcceptInvitationAlways: true,
  dataSyncTypes: DataSyncType.CONVERSATIONS
});
```

下表列出初始化时常用的 `ChatOptions` 方法。全部配置项详见 [API 参考](apireference.html)。

| 方法名称 | 描述 |
| :--- | :--- |
| `setAppKey(appKey: string)` | 设置 App Key。`appKey` 是在环信控制台创建应用后获得的唯一标识，格式通常为 `orgName#appName`。也可在 `ChatOptions` 构造参数中设置。 |
| `setAppIDForPush(appId: string)` | 设置离线推送使用的 App ID。 |
| `setAutoAcceptGroupInvitations(isAutoAcceptGroups: boolean)` | 设置是否自动接受群组邀请。<br/>-（默认）`true`：自动接受。<br/>- `false`：不自动接受。 |
| `setAcceptInvitationAlways(isAutoAccept: boolean)` | 设置是否自动接受好友邀请。<br/>-（默认）`true`：自动接受。<br/>- `false`：不自动接受。 |
| `setDeleteMessagesOnLeaveChatroom(isDeleteMessageOnLeaveChatroom: boolean)` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/>-（默认）`true`：删除。<br/>- `false`：保留。 |
| `setDeleteMessagesOnLeaveGroup(isDeleteMessagesOnLeaveGroup: boolean)` | 设置主动或被动退出群组时是否删除该群组的本地消息。<br/>-（默认）`true`：删除。<br/>- `false`：保留。 |
| `allowChatroomOwnerLeave(isChatroomOwnerLeaveAllowed: boolean)` | 设置是否允许聊天室所有者离开聊天室。<br/>-（默认）`true`：允许；离开后所有者仍保留聊天室权限，但不再接收聊天室消息。<br/>- `false`：不允许。 |
| `setDataSyncType(types: DataSyncType \| DataSyncType[])` | 设置登录后自动同步的数据类型。可选 `CONVERSATIONS`、`CONTACTS`、`JOINED_GROUPS`；传入 `NONE` 或空数组表示不同步。必须在 `init` 前设置。默认值为 `CONVERSATIONS`。 |
| `setEnableUserInfo(enableUserInfo: boolean)` | 设置是否开启用户信息自动管理。<br/>- `true`：开启。<br/>-（默认）`false`：关闭。必须在 `init` 前设置。 |

关于私有化 SDK 的 IP 地址或域名配置，详见 [配置文档](private_ip_domain.html)。

## 初始化后设置监听

初始化完成后，可以注册连接状态监听和消息监听，以感知 SDK 与 IM 服务器的连接变化及新消息。弱网断开后 SDK 会自动重连，无需手动重连。

```typescript
let connectionListener: ConnectionListener = {
  onConnected: (): void => {
    // SDK 已成功连接到 IM 服务器。
  },
  onDisconnected: (errorCode: number): void => {
    // SDK 与 IM 服务器断开连接，可根据 errorCode 区分原因。
  }
};

let messageListener: ChatMessageListener = {
  onMessageReceived: (messages: Array<ChatMessage>): void => {
    // 收到新消息后，遍历消息列表并更新业务数据。
  }
};

// 注册监听器。
ChatClient.getInstance().addConnectionListener(connectionListener);
ChatClient.getInstance().chatManager()?.addMessageListener(messageListener);

// 页面或组件销毁且不再需要监听时，移除同一个监听器实例。
ChatClient.getInstance().removeConnectionListener(connectionListener);
ChatClient.getInstance().chatManager()?.removeMessageListener(messageListener);
```

:::tip
1. 如需监听登录后自动同步数据的开始和完成状态，详见 [监听同步状态](#监听同步状态)。
2. `ConnectionListener#onDatabaseOpened` 只表示当前用户的本地数据库已经打开，可以读取本地数据；该事件不表示在线登录成功，也不能代替 `onConnected`。
:::

## 设置登录后自动同步数据

### 同步的数据

SDK 支持在初始化前通过 `ChatOptions#setDataSyncType` 配置登录后自动同步的数据类型。用户登录成功后，SDK 按配置同步服务端数据并更新本地数据库或缓存。自 HarmonyOS SDK 5.0.0 起，默认同步会话数据，即默认值为 `[DataSyncType.CONVERSATIONS]`。

当前支持同步会话列表、好友列表以及当前用户已加入的群组列表。各数据类型的配置项和本地读取方式如下：

| 配置项 | 登录后自动同步内容 | 本地读取方式 | 说明 |
| :--- | :--- | :--- | :--- |
| `DataSyncType.CONVERSATIONS` | 会话列表 | `ChatManager#getAllConversationsBySort` | 从本地数据库读取会话，并按置顶状态和最后一条消息时间排序。该类型默认启用。 |
| `DataSyncType.CONTACTS` | 好友列表和好友信息 | `ContactManager#getContactsFromLocal` | 异步返回本地 `Contact[]`；未配置好友同步时，本地结果可能为空或不是服务端最新数据。 |
| `DataSyncType.JOINED_GROUPS` | 当前用户已加入的群组列表 | `GroupManager#getAllGroups` | 首次调用从数据库加载，之后从内存读取，异步返回 `Group[]`。 |

如需检查当前配置的自动同步数据类型，可调用 `ChatOptions#getDataSyncType()`。该方法仅用于读取配置，不会触发数据同步。

### 配置方式

必须在调用 `ChatClient#init` 前设置 `setDataSyncType`。若本次登录的数据自动同步已经开始，之后修改配置不会影响正在进行的同步，新配置将在下次登录时生效。

配置规则如下：

- 未调用 `setDataSyncType` 时，默认自动同步会话数据，即 `DataSyncType.CONVERSATIONS`。
- 需要同步一种数据时，可以传入单个 `DataSyncType`；需要同步多种数据时，传入对应枚举值数组。
- 传入 `DataSyncType.NONE` 或空数组表示不自动同步数据。

以下示例表示登录成功后自动同步会话列表、好友列表和当前用户已加入的群组列表：

```typescript
let options: ChatOptions = new ChatOptions({
  appKey: 'your-org#your-app'
});
options.setDataSyncType([
  DataSyncType.CONVERSATIONS,
  DataSyncType.CONTACTS,
  DataSyncType.JOINED_GROUPS
]);

ChatClient.getInstance().init(context, options);
```

如果只需要同步会话列表，可仅配置 `CONVERSATIONS`：

```typescript
options.setDataSyncType(DataSyncType.CONVERSATIONS);
```

如果需要关闭登录后的自动同步，可配置 `NONE`：

```typescript
options.setDataSyncType(DataSyncType.NONE);
```

也可以使用字面量配置同步范围：

```typescript
ChatClient.getInstance().init(context, {
  appKey: 'your-org#your-app',
  dataSyncTypes: [
    DataSyncType.CONVERSATIONS,
    DataSyncType.CONTACTS,
    DataSyncType.JOINED_GROUPS
  ]
});
```

### 监听同步状态

SDK 通过 `ConnectionListener#onDataSyncStart` 和 `onDataSyncFinish` 通知某一类数据同步的开始和结束。建议在主动登录前注册监听器，以免遗漏同步事件。

- `onDataSyncStart(type: DataSyncType)`：某类数据开始同步时触发。`type` 可能为 `CONVERSATIONS`、`CONTACTS` 或 `JOINED_GROUPS`。
- `onDataSyncFinish(type: DataSyncType, errorCode: number)`：某类数据同步结束时触发。`errorCode === ChatError.EM_NO_ERROR` 表示同步成功，否则可根据错误码处理失败情况。

示例代码如下：

```typescript
let syncListener: ConnectionListener = {
  onConnected: (): void => {
  },
  onDisconnected: (errorCode: number): void => {
  },
  onDataSyncStart: (type: DataSyncType): void => {
    // type 对应的数据开始同步。
  },
  onDataSyncFinish: (type: DataSyncType, errorCode: number): void => {
    if (errorCode === ChatError.EM_NO_ERROR) {
      // type 对应的数据同步成功，可从本地读取最新结果。
    } else {
      // 数据同步失败，根据 type 和 errorCode 处理。
    }
  }
};

ChatClient.getInstance().addConnectionListener(syncListener);
```

### 登录后读取同步结果

收到对应类型的 `onDataSyncFinish` 且 `errorCode` 为 `ChatError.EM_NO_ERROR` 后，可通过相应 Manager 从 SDK 本地数据库或缓存读取同步结果。

```typescript
// 读取并排序本地会话列表。
let conversations: Conversation[] = ChatClient.getInstance()
  .chatManager()
  ?.getAllConversationsBySort() ?? [];

// 从本地数据库读取好友列表和好友信息。
ChatClient.getInstance().contactManager()?.getContactsFromLocal()
  .then((contacts: Contact[]): void => {
    // 使用 contacts 刷新好友列表。
  })
  .catch((error: ChatError): void => {
    // 读取本地好友失败。
  });

// 读取本地已加入群组列表。
ChatClient.getInstance().groupManager()?.getAllGroups()
  .then((joinedGroups: Group[]): void => {
    // 使用 joinedGroups 刷新群组列表。
  })
  .catch((error: ChatError): void => {
    // 读取本地群组失败。
  });
```

如果只需优先展示设备上的已有数据，可在收到 `ConnectionListener#onDatabaseOpened` 后读取本地数据；如需展示本次登录后从服务端同步的最新数据，应等待对应类型的 `onDataSyncFinish` 成功后再次读取并刷新界面。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`init`](#初始化-sdk) | `ChatClient` | 使用指定配置初始化 HarmonyOS SDK 单例。 |
| [`setDataSyncType`](#配置方式) | `ChatOptions` | 设置登录后自动同步的数据类型。 |
| [`getAllConversationsBySort`](#登录后读取同步结果) | `ChatManager` | 从本地数据库读取排序后的会话列表。 |
| [`getContactsFromLocal`](#登录后读取同步结果) | `ContactManager` | 从本地数据库读取好友列表和好友信息。 |
| [`getAllGroups`](#登录后读取同步结果) | `GroupManager` | 读取本地已加入群组列表。 |
| [`getDataSyncType`](#同步的数据) | `ChatOptions` | 获取当前配置的登录后自动同步数据类型。 |
