# 从旧 SDK 升级到新 SDK 迁移指南

本文档介绍如何从旧版 `easemob-websdk` 迁移到新版 Web SDK。新版 SDK 以 `ChatClient` 为统一入口，并按功能拆分为多个 Manager。迁移时，建议先完成初始化、登录、消息、事件和返回值处理等核心改造，再按业务使用范围迁移用户关系、群组、聊天室、会话、推送等模块。

## 迁移说明

新版 SDK 保留了即时通讯的核心业务能力，但 API 入口、模块组织、消息创建方式、事件模型、返回值结构和类型校验方式均有调整。迁移过程中需要重点关注以下变化：

- API 不再集中挂载在 `conn` 实例上，而是按业务能力拆分到 `ChatManager`、`ContactManager`、`GroupManager`、`ChatRoomManager`、`PushManager` 等 Manager。
- 消息不再通过 `WebIM.message.create({ type, ... })` 统一创建，而是通过 `client.chatManager.createXxxMessage` 按消息类型创建。
- 会话标识从 `to` 和 `chatType` 调整为 `conversationId` 和 `conversationType`。
- 多数异步 API 直接返回业务对象，不再通过 `AsyncResult<T>` 包装。
- 事件监听仍使用 `addEventHandler` / `removeEventHandler`，但部分事件名和事件分发方式发生变化。

## 迁移前准备

迁移前建议先完成以下检查：

1. 梳理项目中使用到的旧 SDK 能力，确认需要注册的新 SDK Manager。
2. 检查所有消息创建、消息发送、会话 ID、会话类型和消息扩展字段的使用方式。
3. 检查所有事件监听逻辑，尤其是消息事件、群组事件、聊天室事件和多设备事件。
4. 检查所有通过 `.data` 读取接口返回值的代码，新 SDK 通常直接返回业务数据。
5. 检查已废弃或已移除的旧 API，并替换为新 SDK 的对应接口或服务端 REST API。

## 核心变化概览

| 维度 | 旧 SDK | 新 SDK |
| :--- | :--- | :--- |
| 初始化入口 | `new SDK.connection({ appKey })` | `ChatClient.init({ appKey })` |
| API 挂载方式 | API 主要挂载在 `conn` 实例上。 | 按功能拆分到各 Manager，例如 `client.chatManager`、`client.groupManager`。 |
| Manager 使用方式 | 无需显式注册 Manager。 | 初始化时通过 `managers` 注册，或初始化后通过 `.use()` 注册。 |
| 消息创建 | `WebIM.message.create({ type, ... })` | `client.chatManager.createXxxMessage(...)` |
| 消息发送 | `conn.send(msg)` | `client.chatManager.sendMessage(msg, options?)` |
| 会话标识 | `to` + `chatType` | `conversationId` + `conversationType` |
| 返回值 | 多数 REST API 返回 `Promise<AsyncResult<T>>`。 | 多数 API 直接返回 `Promise<T>` 或同步业务对象。 |
| 事件系统 | 按消息类型分发事件，群组和聊天室事件通过聚合事件区分操作。 | 消息统一通过 `onMessage` 分发，群组、聊天室等事件拆分为独立事件名。 |
| 类型校验 | 弱类型或运行时松散校验。 | 提供更完整的 TypeScript 类型和参数校验。 |

## Manager 映射关系

| 旧 SDK 能力 | 新 SDK Manager | 说明 |
| :--- | :--- | :--- |
| 消息创建、消息发送、会话、历史消息、回执、撤回、表情回复（Reaction）、消息翻译等 | `client.chatManager` | 负责消息和会话相关能力。 |
| 好友列表、好友申请、黑名单等 | `client.contactManager` | 负责用户关系管理。 |
| 用户属性、用户属性订阅等 | `client.userInfoManager` | 负责用户属性相关能力。 |
| 群组创建、群信息、群成员、群公告、群共享文件等 | `client.groupManager` | 负责群组相关能力。 |
| 聊天室列表、详情、成员、公告、自定义属性等 | `client.chatRoomManager` | 负责聊天室相关能力。 |
| 在线状态（Presence）发布、订阅、查询等 | `client.presenceManager` | 负责 Presence 相关能力。 |
| 消息话题（Thread）创建、加入、退出、成员和消息等 | `client.chatThreadManager` | 负责 Thread 相关能力。 |
| 离线推送、免打扰、推送语言等 | `client.pushManager` | 负责推送相关能力。 |

## 安装与初始化迁移

### 变更说明

新版 SDK 使用 `ChatClient.init` 创建客户端实例。需要使用的业务模块可在初始化时通过 `managers` 注册，也可以在初始化后通过 `.use()` 注册。未注册的 Manager 不会挂载到 `client` 上。

### 旧版 SDK 用法

```typescript
import SDK from 'easemob-websdk';

const conn = new SDK.connection({
  appKey: 'org#app',
  isHttpDNS: true,
  delivery: true,
  isFixedDeviceId: true,
});

conn.addEventHandler('handler', { onConnected: () => {} });
```

### 新版 SDK 用法

```typescript
import {
  ChatClient,
  ChatManager,
  ContactManager,
  GroupManager,
} from 'easemob-websdk';

const client = ChatClient.init({
  appKey: 'org#app',
  useFixedDeviceId: true,
  enableDeliveryReceipt: true,
  managers: [ChatManager, ContactManager, GroupManager],
});

client.addEventHandler('handler', { onConnected: () => {} });
```

也可以通过 `.use()` 按需注册 Manager：

```typescript
const client = ChatClient.init({ appKey: 'org#app' })
  .use(ChatManager)
  .use(ContactManager)
  .use(GroupManager);
```

### 初始化参数对照

| 旧参数 | 新参数 | 说明 |
| :--- | :--- | :--- |
| `appKey` | `appKey` | 保持一致。 |
| `isFixedDeviceId` | `useFixedDeviceId` | 参数重命名。默认 `true`，同一浏览器内复用固定设备标识。 |
| `delivery` | `enableDeliveryReceipt` | 参数重命名，用于开启送达回执。 |
| `isHttpDNS` | - | 新 SDK 默认处理，无需显式配置。 |
| `useOwnUploadFun` | `useCustomAttachmentUpload` | 参数重命名。 |
| `useReplacedMessageContents` | `useReplacedMessageContents` | 保持一致。 |
| `customDeviceName` | `customDeviceName` | 保持一致。 |
| `customOSPlatform` | `customOSPlatform` | 保持一致。 |
| `apiUrl` / `url` | `serviceConfig` | 服务地址配置合并为对象。 |
| `autoReconnectNumMax` | - | 新 SDK 内置重连策略，无需配置。 |
| `isDebug` | - | 使用 `logger.setLevel()` 设置日志级别。 |

### 注意事项

- 如果业务代码需要使用 `client.chatManager`、`client.groupManager` 等模块，必须先注册对应 Manager。
- 小程序、uni-app 等运行环境由新 SDK 的运行时适配能力处理，通常无需手动注入平台适配器。
- 如需送达回执，接收方初始化时需设置 `enableDeliveryReceipt: true`。

## 登录与登出迁移

### 变更说明

新版 SDK 使用 `client.login` 登录，使用 `client.logout` 登出。登录参数名称发生变化，密码登录参数不再作为客户端推荐方式使用。

### 旧版 SDK 用法

```typescript
await conn.open({
  user: 'userId',
  accessToken: 'token',
});

conn.close();
```

### 新版 SDK 用法

```typescript
await client.login({
  userId: 'userId',
  token: 'token',
});

await client.logout();
```

### API 对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `conn.open({ user, accessToken })` | `client.login({ userId, token })` | 方法和参数均调整。 |
| `conn.close()` | `client.logout()` | 方法重命名，且返回 `Promise<void>`。 |
| `conn.renewToken(token)` | `client.renewToken(token)` | 方法名不变，返回 `{ token, expireAt }`。 |
| `conn.isOpened()` | `client.getConnectionState()` | 用连接状态接口替代。 |

### 注意事项

- Token 即将过期时，SDK 会触发 `onTokenWillExpire` 事件，业务侧应获取新 Token 并调用 `client.renewToken(newToken)`。
- `useFixedDeviceId` 会影响同一浏览器多标签页是否被视为同一设备，迁移多端互踢逻辑时需要同步检查。

## 事件监听迁移

### 变更说明

事件注册和移除方式仍为 `addEventHandler` / `removeEventHandler`。但新版 SDK 对部分事件进行了拆分和重命名，消息事件也从按类型分发调整为统一通过 `onMessage` 分发。

### 注册方式

```typescript
// 旧 SDK
conn.addEventHandler('handlerId', {
  onConnected: () => {},
});

conn.removeEventHandler('handlerId');

// 新 SDK
client.addEventHandler('handlerId', {
  onConnected: () => {},
});

client.removeEventHandler('handlerId');
```

部分 Manager 也提供自己的事件监听入口，例如：

```typescript
client.chatManager.addEventHandler('chat-handler', {
  onMessage: (message) => {},
});

client.groupManager.addEventHandler('group-handler', {
  onMembersJoined: (event) => {},
});
```

### 消息事件对照

| 旧 SDK 事件 | 新 SDK 事件 | 说明 |
| :--- | :--- | :--- |
| `onTextMessage(msg)` | `onMessage(message)` | 通过 `message.type === 'text'` 判断文本消息。 |
| `onImageMessage(msg)` | `onMessage(message)` | 通过 `message.type === 'image'` 判断图片消息。 |
| `onAudioMessage(msg)` | `onMessage(message)` | 通过 `message.type === 'voice'` 判断语音消息。 |
| `onVideoMessage(msg)` | `onMessage(message)` | 通过 `message.type === 'video'` 判断视频消息。 |
| `onFileMessage(msg)` | `onMessage(message)` | 通过 `message.type === 'file'` 判断文件消息。 |
| `onLocationMessage(msg)` | `onMessage(message)` | 通过 `message.type === 'location'` 判断位置消息。 |
| `onCmdMessage(msg)` | `onMessage(message)` | 通过 `message.type === 'cmd'` 判断命令消息。 |
| `onCustomMessage(msg)` | `onMessage(message)` | 通过 `message.type === 'custom'` 判断自定义消息。 |
| `onCombineMessage(msg)` | `onMessage(message)` | 通过 `message.type === 'combine'` 判断合并消息。 |
| `onMessage(msgs[])` | `onMessage(message)` | 旧 SDK 可能返回消息数组，新 SDK 按单条消息分发。 |

### 消息事件迁移示例

```typescript
// 旧 SDK
conn.addEventHandler('message-handler', {
  onTextMessage: (msg) => handleText(msg),
  onImageMessage: (msg) => handleImage(msg),
});

// 新 SDK
client.chatManager.addEventHandler('message-handler', {
  onMessage: (message) => {
    switch (message.type) {
      case 'text':
        handleText(message);
        break;
      case 'image':
        handleImage(message);
        break;
    }
  },
});
```

### 连接事件对照

| 旧 SDK 事件 | 新 SDK 事件 | 说明 |
| :--- | :--- | :--- |
| `onConnected` | `onConnected` | 保持一致。 |
| `onDisconnected` | `onDisconnected` | 保持一致。 |
| `onReconnecting` | `onConnecting` | 事件名调整。 |
| `onTokenWillExpire` | `onTokenWillExpire` | 保持一致。 |
| `onTokenExpired` | `onTokenExpired` | 保持一致。 |
| `onOnline` | - | 已移除。 |
| `onOffline` | - | 已移除。 |
| `onError` | - | 已移除，建议通过 Promise reject 和类型化错误处理。 |

### 消息操作事件对照

| 旧 SDK 事件 | 新 SDK 事件 | 说明 |
| :--- | :--- | :--- |
| `onRecallMessage` | `onMessageRecalled` | 事件名调整。 |
| `onModifiedMessage` | `onMessageUpdated` | 事件名调整。 |
| `onReadMessage` | `onMessageRead` | 事件名调整。 |
| `onChannelMessage` | `onConversationRead` | 对应会话已读事件。 |
| `onDeliveredMessage` | `onMessageDelivered` | 对应消息送达事件。 |
| `onReceivedMessage` | - | 已移除。 |
| `onMessagePinEvent` | `onPinnedMessageChanged` | 事件名调整。 |
| `onReactionChange` | `onReactionChanged` | 事件名调整。 |
| `onStatisticMessage` | - | 已移除。 |

### 群组事件迁移

旧版 SDK 使用 `onGroupEvent` 加 `operation` 字段区分群组事件。新版 SDK 将群组事件拆分为独立事件名。

```typescript
// 旧 SDK
conn.addEventHandler('group-handler', {
  onGroupEvent: (event) => {
    switch (event.operation) {
      case 'inviteToJoin':
        break;
      case 'memberPresence':
        break;
      case 'removeMember':
        break;
    }
  },
});

// 新 SDK
client.groupManager.addEventHandler('group-handler', {
  onInvitationReceived: (event) => {},
  onMembersJoined: (event) => {},
  onUserRemoved: (event) => {},
});
```

| 旧 `operation` | 新事件名 |
| :--- | :--- |
| `inviteToJoin` | `onInvitationReceived` |
| `acceptInvite` | `onInvitationAccepted` |
| `rejectInvite` | `onInvitationDeclined` |
| `requestToJoin` | `onRequestToJoinReceived` |
| `acceptRequest` | `onRequestToJoinAccepted` |
| `joinPublicGroupDeclined` | `onRequestToJoinDeclined` |
| `directJoined` | `onAutoAcceptInvitationFromGroup` |
| `removeMember` | `onUserRemoved` |
| `destroy` | `onGroupDestroyed` |
| `memberPresence` / `membersPresence` | `onMembersJoined` |
| `memberAbsence` / `membersAbsence` | `onMembersExited` |
| `muteMember` | `onMuteListAdded` |
| `unmuteMember` | `onMuteListRemoved` |
| `muteAllMembers` / `unmuteAllMembers` | `onAllMemberMuteStateChanged` |
| `setAdmin` | `onAdminAdded` |
| `removeAdmin` | `onAdminRemoved` |
| `changeOwner` | `onOwnerChanged` |
| `updateAnnouncement` / `deleteAnnouncement` | `onAnnouncementChanged` |
| `uploadFile` | `onSharedFileAdded` |
| `deleteFile` | `onSharedFileDeleted` |
| `updateInfo` | `onGroupInfoChanged` |
| `addUserToAllowlist` | `onAllowListAdded` |
| `removeAllowlistMember` | `onAllowListRemoved` |
| `memberAttributesUpdate` | `onGroupMemberAttributeChanged` |

### 聊天室事件迁移

旧 SDK 使用 `onChatroomEvent` 加 `operation` 字段区分聊天室事件。新版 SDK 通过 `client.chatRoomManager.addEventHandler` 注册聊天室事件监听器，并使用独立事件名，例如，聊天室销毁、成员加入或退出、成员被移除、聊天室信息变更、管理员变更、禁言状态变更、白名单变更、公告变更和自定义属性变更等。

### 好友事件对照

| 旧 SDK 事件 | 新 SDK 事件 | 说明 |
| :--- | :--- | :--- |
| `onContactInvited` | `onContactInvited` | 保持一致。 |
| `onContactAgreed` | `onContactAgreed` | 保持一致。 |
| `onContactRefuse` | `onContactRefuse` | 保持一致。 |
| `onContactDeleted` | `onContactDeleted` | 保持一致。 |
| `onContactAdded` | `onContactAdded` | 保持一致。 |

### 多设备事件迁移

旧 SDK 使用统一的 `onMultiDeviceEvent`。新版 SDK 按业务类型拆分多设备事件。

| 旧 SDK               | 新 SDK                        | 说明                                                         |
| :--- | :--- | :--- |
| `onMultiDeviceEvent` | `onMultiDeviceContact`        | 监听多设备好友事件，例如，其他设备添加、删除好友，接受或拒绝好友申请等。 |
| `onMultiDeviceEvent` | `onMultiDeviceGroup`          | 监听多设备群组事件，例如，其他设备创建群组、加入或退出群组、修改群组信息、管理群成员等。 |
| `onMultiDeviceEvent` | `onMultiDeviceThread`         | 监听多设备消息话题事件，例如，其他设备创建、加入、退出、解散消息话题或修改消息话题的信息等。 |
| `onMultiDeviceEvent` | `onMultiDeviceConversation`   | 监听多设备会话事件，例如，其他设备设置或取消会话置顶、添加或移除会话标记等。 |
| `onMultiDeviceEvent` | `onMultiDeviceMessageRemoved` | 监听多设备消息删除事件，例如，其他设备删除服务端历史消息后，当前设备收到对应同步通知。 |

## 返回值与错误处理迁移

### 变更说明

旧 SDK 多数 REST API 返回 `Promise<AsyncResult<T>>`，业务数据通常需要从 `.data` 中读取。新版 SDK 多数接口直接返回业务对象或业务数组。

### 返回值写法对照

```typescript
// 旧 SDK
const result = await conn.getGroupInfo({ groupId: 'group1' });
const groupInfo = result.data[0];

// 新 SDK
const groupInfo = await client.groupManager.getGroupInfo({ groupId: 'group1' });
```

### 常见返回值变化

| 旧 SDK 返回 | 新 SDK 返回 | 说明 |
| :--- | :--- | :--- |
| `AsyncResult<UserId[]>` | `ReadonlyArray<Contact>` | 好友列表返回好友对象。 |
| `AsyncResult<GroupDetailInfo[]>` | `GroupDetail` | 群组详情直接返回详情对象。 |
| `AsyncResult<{ groupId }>` | `CreateGroupResult` | 创建群组直接返回业务结果。 |
| `AsyncResult<SendMsgResult>` | `Message` | 发送消息后返回完整消息对象。 |
| `AsyncResult<ServerConversations>` | `ReadonlyArray<ConversationItem>` 或分页结果 | 会话列表接口按具体 API 返回本地列表或服务端分页结果。 |

### 错误处理写法

旧 SDK 可通过 `onError` 或 Promise reject 处理错误。新版 SDK 移除了全局 `onError` 事件，建议通过 `try...catch` 捕获 Promise reject，并结合 SDK 错误类型处理。

```typescript
import { SDKError, ValidationError } from 'easemob-websdk';

try {
  await client.chatManager.sendMessage(message);
} catch (error) {
  if (error instanceof ValidationError) {
    // 参数校验错误。
  } else if (error instanceof SDKError) {
    // SDK 或服务端业务错误，可根据 error.code 处理。
  } else {
    // 其他未知错误。
  }
}
```

## 消息创建与发送迁移

### 变更说明

旧 SDK 通过 `WebIM.message.create` 结合 `type` 字段创建不同类型的消息。新版 SDK 将消息创建拆分为多个类型化方法，例如 `createTextMessage`、`createImageMessage`、`createCustomMessage` 等。发送消息统一调用 `client.chatManager.sendMessage`。

### 旧版 SDK 用法

```typescript
const msg = WebIM.message.create({
  type: 'txt',
  to: 'user2',
  chatType: 'singleChat',
  msg: 'Hello!',
  ext: { key: 'value' },
});

const result = await conn.send(msg);
```

### 新版 SDK 用法

```typescript
const msg = client.chatManager.createTextMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  content: 'Hello!',
  ext: { key: 'value' },
});

const sentMessage = await client.chatManager.sendMessage(msg);
```

### 消息创建方法对照

| 旧 SDK `type` | 新 SDK 方法 | 主要参数变化 |
| :--- | :--- | :--- |
| `'txt'` | `createTextMessage` | `msg` 改为 `content`。 |
| `'img'` | `createImageMessage` | 通过图片消息参数传入文件或资源信息。 |
| `'audio'` | `createVoiceMessage` | `length` 改为 `duration`。 |
| `'video'` | `createVideoMessage` | `length` 改为 `duration`。 |
| `'file'` | `createFileMessage` | `filename` 改为 `fileName`。 |
| `'loc'` | `createLocationMessage` | `lat` / `lng` 改为 `latitude` / `longitude`，`addr` 改为 `address`。 |
| `'cmd'` | `createCmdMessage` | `action` 继续表示命令动作。 |
| `'custom'` | `createCustomMessage` | 使用自定义消息事件和自定义参数。 |
| `'combine'` | `createCombineMessage` | 用于创建合并转发消息。 |

### 会话标识对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `to` | `conversationId` | 单聊为用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `chatType` | `conversationType` | 取值为 `singleChat`、`groupChat` 或 `chatRoom`。 |

### 发送选项迁移

旧 SDK 中部分发送选项可能放在消息创建参数中。新版 SDK 将发送选项放在 `sendMessage` 的第二个参数中：

```typescript
await client.chatManager.sendMessage(msg, {
  deliverOnlineOnly: true,
  receiverList: ['user3'],
  priority: 'high',
});
```

### 注意事项

- `receiverList` 仅用于群聊消息的定向发送场景。
- 聊天室消息可设置 `priority`，消息量较大时低优先级消息可能被丢弃。
- 附件上传进度、成功和失败处理应迁移到新版 SDK 支持的发送流程或 Promise 错误处理逻辑中。

## 会话 API 迁移

### 变更说明

会话相关 API 迁移到 `client.chatManager`。新版 SDK 通过本地会话列表缓存管理会话数据：`getConversationList` 从本地缓存读取会话列表，`refreshSessionList` 从服务端刷新会话列表并更新本地缓存。

### API 对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `conn.getServerConversations(params)` | `chatManager.refreshSessionList(params)` | 从服务端刷新会话列表并更新本地缓存。 |
| - | `chatManager.getConversationList(filter?)` | 从本地缓存读取会话列表，支持按置顶、标记等条件筛选。 |
| `conn.deleteConversation({ channel, chatType, deleteRoam })` | `chatManager.deleteConversation({ conversationId, conversationType, deleteRoamingMessages })` | 参数重命名。 |
| `conn.pinConversation({ conversationId, conversationType, isPinned })` | `chatManager.setConversationPinned({ conversationId, conversationType, isPinned })` | 方法重命名。 |
| `conn.getServerPinnedConversations(params)` | `chatManager.getConversationList({ isPinned: true })` | 从本地会话列表缓存筛选置顶会话；如需服务端最新数据，先调用 `refreshSessionList`。 |
| `conn.markConversation({ conversations, mark, isMarked })` | `chatManager.addConversationMark(params)` / `chatManager.removeConversationMark(params)` | 拆分为添加标记和移除标记两个接口。 |
| `conn.getServerConversationsByFilter({ filter: { mark } })` | `chatManager.getConversationList({ mark })` | 从本地会话列表缓存按标记筛选会话；如需服务端最新数据，先调用 `refreshSessionList`。 |
| - | `chatManager.clearConversationUnreadMessageCount(params)` | 清空指定会话未读数。 |
| - | `chatManager.clearAllConversationUnreadMessageCount()` | 清空全部会话未读数。 |
| - | `chatManager.setCurrentConversation(params)` | 设置当前会话。 |
| - | `chatManager.resetCurrentConversation()` | 清除当前会话。 |

### 注意事项

- 如果只需要刷新 UI，优先从 `getConversationList` 读取本地缓存。
- 如果需要主动拉取服务端最新会话列表，调用 `refreshSessionList`，然后再读取本地缓存或使用返回结果。
- 按置顶和标记筛选时，使用 `getConversationList` 的过滤参数从本地会话列表缓存读取；如需服务端最新状态，先调用 `refreshSessionList` 更新本地缓存。

## 用户属性 API 迁移

### 变更说明

用户属性相关 API 从 `conn.xxx` 迁移到 `client.userInfoManager.xxx`。新版 SDK 支持按用户 ID 或属性查询用户属性，也支持订阅用户属性变更。

### API 对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `conn.updateOwnUserInfo(params)` | `userInfoManager.updateOwnInfo(params)` | 方法重命名。 |
| `conn.updateOwnUserInfo('nickname', value)` | `userInfoManager.updateOwnInfoByAttribute({ attribute, value })` | 按单个属性更新。 |
| `conn.fetchUserInfoById({ userId })` | `userInfoManager.getUserInfoByUserId({ userIds })` | 参数改为用户 ID 数组。 |
| - | `userInfoManager.getUserInfoByAttribute({ userIds, attributes })` | 按指定属性查询用户属性。 |
| - | `userInfoManager.subscribeUsersInfo({ userIds })` | 订阅用户属性变更。 |
| - | `userInfoManager.unsubscribeUsersInfo({ userIds })` | 取消订阅用户属性变更。 |
| - | `userInfoManager.getSubscribedUsers()` | 获取已订阅的用户列表。 |

## 用户关系 API 迁移

### 变更说明

用户关系相关 API 从 `conn.xxx` 迁移到 `client.contactManager.xxx`。新版 SDK 中部分参数改为对象形式，好友列表返回值也从用户 ID 数组调整为好友对象数组。

### API 对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `conn.getContacts()` | `contactManager.getContacts()` | 返回 `Contact[]`，包含好友备注等信息。 |
| `conn.getAllContacts()` | `contactManager.getContacts()` | 新 SDK 使用同一接口获取好友列表。 |
| `conn.addContact(to, msg)` | `contactManager.addContact({ userId, reason })` | 参数对象化。 |
| `conn.deleteContact(to)` | `contactManager.deleteContact({ userId })` | 参数对象化。 |
| `conn.acceptInvitation(to)` | `contactManager.acceptContactInvite({ userId })` | 方法重命名。 |
| `conn.declineInvitation(to)` | `contactManager.declineContactInvite({ userId })` | 方法重命名。 |
| `conn.setContactRemark({ userId, remark })` | `contactManager.setContactRemark({ userId, remark })` | 能力保留。 |
| `conn.getBlocklist()` | `contactManager.getBlocklist()` | 返回 `UserInfo[]`。 |
| `conn.addUsersToBlocklist({ name })` | `contactManager.addUsersToBlocklist({ userIds })` | `name` 改为 `userIds`，支持批量。 |
| `conn.removeUserFromBlocklist({ name })` | `contactManager.removeUserFromBlocklist({ userIds })` | `name` 改为 `userIds`，支持批量。 |

## 群组 API 迁移

### 变更说明

群组相关 API 从 `conn.xxx` 迁移到 `client.groupManager.xxx`。新版 SDK 中成员 ID 参数统一使用 `userId` 或 `userIds`，分页大小通常使用 `pageSize`。

### API 对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `conn.createGroupVNext(params)` | `groupManager.createGroup(params)` | 方法重命名。 |
| `conn.getGroupInfo({ groupId })` | `groupManager.getGroupInfo({ groupId })` | 能力保留。 |
| `conn.getJoinedGroups(params)` | `groupManager.getJoinedGroupList()` | 获取已加入群组列表。 |
| `conn.listGroups(params)` | `groupManager.getPublicGroupList(params)` | 获取公开群列表。 |
| `conn.modifyGroup(params)` | `groupManager.updateGroupInfo(params)` | 方法重命名。 |
| `conn.destroyGroup({ groupId })` | `groupManager.destroyGroup({ groupId })` | 能力保留。 |
| `conn.leaveGroup({ groupId })` | `groupManager.leaveGroup({ groupId })` | 能力保留。 |
| `conn.changeGroupOwner(params)` | `groupManager.changeGroupOwner(params)` | 能力保留。 |
| `conn.inviteUsersToGroup(params)` | `groupManager.inviteUsersToGroup({ groupId, userIds })` | `users` 改为 `userIds`。 |
| `conn.joinGroup({ groupId, message })` | `groupManager.joinGroup({ groupId, reason })` | `message` 改为 `reason`。 |
| `conn.getGroupMembers({ groupId, cursor, limit })` | `groupManager.getGroupMemberList({ groupId, cursor, pageSize })` | `limit` 改为 `pageSize`。 |
| `conn.removeGroupMembers(params)` | `groupManager.removeGroupMembers({ groupId, userIds })` | 成员 ID 参数统一为 `userIds`。 |
| `conn.setGroupAdmin({ groupId, username })` | `groupManager.addGroupAdmin({ groupId, userId })` | `username` 改为 `userId`。 |
| `conn.removeGroupAdmin({ groupId, username })` | `groupManager.removeGroupAdmin({ groupId, userId })` | `username` 改为 `userId`。 |
| `conn.getGroupMuteList(params)` | `groupManager.getGroupMuteList(params)` | 能力保留。 |
| `conn.muteGroupMember({ username, muteDuration, groupId })` | `groupManager.muteGroupMembers({ groupId, userIds, duration })` | 参数重命名，支持批量。 |
| `conn.unmuteGroupMember({ groupId, username })` | `groupManager.unmuteGroupMembers({ groupId, userIds })` | 支持批量。 |
| `conn.disableSendGroupMsg({ groupId })` | `groupManager.muteAllGroupMembers({ groupId })` | 方法重命名。 |
| `conn.enableSendGroupMsg({ groupId })` | `groupManager.unmuteAllGroupMembers({ groupId })` | 方法重命名。 |
| `conn.blockGroupMembers({ groupId, usernames })` | `groupManager.blockGroupMembers({ groupId, userIds })` | `usernames` 改为 `userIds`。 |
| `conn.getGroupBlocklist({ groupId })` | `groupManager.getGroupBlocklist({ groupId })` | 能力保留。 |
| `conn.unblockGroupMembers(params)` | `groupManager.unblockGroupMembers({ groupId, userIds })` | 成员 ID 参数统一为 `userIds`。 |
| `conn.fetchGroupAnnouncement({ groupId })` | `groupManager.getGroupAnnouncement({ groupId })` | 方法重命名。 |
| `conn.updateGroupAnnouncement(params)` | `groupManager.updateGroupAnnouncement(params)` | 能力保留。 |
| `conn.uploadGroupSharedFile(params)` | `groupManager.uploadGroupSharedFile(params)` | 能力保留。 |
| `conn.deleteGroupSharedFile(params)` | `groupManager.deleteGroupSharedFile(params)` | 能力保留。 |
| `conn.downloadGroupSharedFile(params)` | `groupManager.downloadGroupSharedFile(params)` | 能力保留。 |

## 聊天室 API 迁移

### 变更说明

聊天室相关 API 从 `conn.xxx` 迁移到 `client.chatRoomManager.xxx`。新版 SDK 客户端侧支持聊天室列表、详情、加入、退出、成员管理、管理员管理、禁言、黑名单、白名单、公告和自定义属性等能力。创建聊天室通常应通过服务端 REST API 完成。

### API 对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `conn.getChatRooms(params)` | `chatRoomManager.getChatRoomList(params)` | 方法重命名。 |
| `conn.getChatRoomDetails({ chatRoomId })` | `chatRoomManager.getChatRoomInfo({ chatRoomId })` | 方法重命名。 |
| `conn.joinChatRoom({ roomId })` | `chatRoomManager.joinChatRoom({ chatRoomId })` | `roomId` 改为 `chatRoomId`。 |
| `conn.leaveChatRoom({ roomId })` | `chatRoomManager.leaveChatRoom({ chatRoomId })` | `roomId` 改为 `chatRoomId`。 |
| `conn.modifyChatRoom(params)` | `chatRoomManager.updateChatRoomInfo(params)` | 方法重命名。 |
| `conn.getChatRoomMembers({ chatRoomId, cursor, limit })` | `chatRoomManager.getMemberList({ chatRoomId, cursor, pageSize })` | `limit` 改为 `pageSize`。 |
| `conn.removeChatRoomMember(params)` | `chatRoomManager.removeMembers({ chatRoomId, userIds })` | 支持批量移除。 |
| `conn.setChatRoomAdmin({ chatRoomId, username })` | `chatRoomManager.addAdmin({ chatRoomId, userId })` | `username` 改为 `userId`。 |
| `conn.removeChatRoomAdmin({ chatRoomId, username })` | `chatRoomManager.removeAdmin({ chatRoomId, userId })` | `username` 改为 `userId`。 |
| `conn.getChatRoomMuteList(params)` | `chatRoomManager.getMuteList(params)` | 方法重命名。 |
| `conn.muteChatRoomMember(params)` | `chatRoomManager.muteMembers({ chatRoomId, userIds, duration })` | 支持批量禁言。 |
| `conn.unmuteChatRoomMember(params)` | `chatRoomManager.unmuteMembers({ chatRoomId, userIds })` | 支持批量解除禁言。 |
| `conn.getChatRoomBlocklist(params)` | `chatRoomManager.getBlocklist(params)` | 方法重命名。 |
| `conn.blockChatRoomMembers(params)` | `chatRoomManager.blockMembers({ chatRoomId, userIds })` | 支持批量加入黑名单。 |
| `conn.unblockChatRoomMembers(params)` | `chatRoomManager.unblockMembers({ chatRoomId, userIds })` | 支持批量移出黑名单。 |
| `conn.fetchChatRoomAnnouncement(params)` | `chatRoomManager.getAnnouncement(params)` | 方法重命名。 |
| `conn.updateChatRoomAnnouncement(params)` | `chatRoomManager.updateAnnouncement(params)` | 方法重命名。 |
| `conn.getChatRoomAttributes(params)` | `chatRoomManager.getAttributes(params)` | 方法重命名。 |
| `conn.setChatRoomAttributes(params)` | `chatRoomManager.setAttributes(params)` | 方法重命名。 |
| `conn.removeChatRoomAttributes(params)` | `chatRoomManager.removeAttributes(params)` | 方法重命名。 |

### 注意事项

- 新版 SDK 还支持通过 `chatRoomManager.getChatRoom(chatRoomId)` 获取聊天室实体对象，再通过实体对象调用相关操作。
- 聊天室消息发送仍通过 `client.chatManager.sendMessage` 完成，消息的 `conversationType` 需设置为 `chatRoom`。
- `conn.createChatRoom()` 不再作为客户端侧能力使用，创建聊天室建议通过服务端 REST API 完成。

## 用户在线状态 API 迁移

### 变更说明

用户在线状态（Presence）相关 API 从 `conn.xxx` 迁移到 `client.presenceManager.xxx`。

### API 对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `conn.publishPresence(params)` | `presenceManager.publishPresence(params)` | 发布当前用户在线状态。 |
| `conn.subscribePresence(params)` | `presenceManager.subscribePresence(params)` | 订阅用户在线状态。 |
| `conn.unsubscribePresence(params)` | `presenceManager.unsubscribePresence(params)` | 取消订阅用户在线状态。 |
| `conn.getSubscribedPresencelist(params)` | `presenceManager.getSubscribedPresenceList(params)` | 获取已订阅的在线状态列表。 |
| `conn.getPresenceStatus(params)` | `presenceManager.getPresenceStatus(params)` | 查询用户在线状态。 |

## 表情回复 API 迁移

### 变更说明

表情回复（Reaction） 相关 API 迁移到 `client.chatManager`。

### API 对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `conn.addReaction(params)` | `chatManager.addReaction(params)` | 添加 Reaction。 |
| `conn.deleteReaction(params)` | `chatManager.removeReaction(params)` | 删除 Reaction。 |
| `conn.getReactionList(params)` | `chatManager.getReactionList(params)` | 获取消息 Reaction 列表。 |
| `conn.getReactionDetail(params)` | `chatManager.getReactionDetail(params)` | 获取 Reaction 详情。 |

## 离线推送 API 迁移

### 变更说明

推送相关 API 从 `conn.xxx` 迁移到 `client.pushManager.xxx`。新版 SDK 中推送通知方式、免打扰、会话级推送规则和推送语言均由 `PushManager` 管理。

### API 对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `conn.uploadPushToken(params)` | `pushManager.uploadPushToken(params)` | 上传推送 Token。 |
| `conn.setSilentModeForAll(params)` | `pushManager.setGlobalSilentMode(params)` | 设置全局推送接收规则或免打扰规则。 |
| `conn.getSilentModeForAll()` | `pushManager.getGlobalSilentMode()` | 获取全局推送配置。 |
| `conn.setSilentModeForConversation(params)` | `pushManager.setConversationSilentMode(params)` | 设置会话级推送接收规则或免打扰规则。 |
| `conn.getSilentModeForConversation(params)` | `pushManager.getConversationSilentMode(params)` | 获取单个会话的推送配置。 |
| `conn.getSilentModeForConversations(params)` | `pushManager.getConversationSilentModes(params)` | 批量获取多个会话的推送配置。 |
| `conn.clearRemindTypeForConversation(params)` | `pushManager.clearConversationRemindType(params)` | 清除会话级推送提醒类型。 |
| `conn.setPushPerformLanguage(params)` | `pushManager.setPushLanguage(params)` | 设置离线推送通知展示语言。 |
| `conn.getPushPerformLanguage()` | `pushManager.getPushLanguage()` | 获取离线推送通知展示语言。 |
| - | `pushManager.getConversationListByRemindType(params)` | 按提醒类型从本地会话缓存筛选会话列表。 |

## 消息话题 API 迁移

### 变更说明

消息话题（Thread）相关 API 从 `conn.xxx` 迁移到 `client.chatThreadManager.xxx`。

### API 对照

| 旧 SDK | 新 SDK | 说明 |
| :--- | :--- | :--- |
| `conn.createChatThread(params)` | `chatThreadManager.createChatThread(params)` | 创建消息话题。 |
| `conn.joinChatThread(params)` | `chatThreadManager.joinChatThread(params)` | 加入消息话题。 |
| `conn.leaveChatThread(params)` | `chatThreadManager.leaveChatThread(params)` | 退出消息话题。 |
| `conn.destroyChatThread(params)` | `chatThreadManager.destroyChatThread(params)` | 解散消息话题。 |
| `conn.changeChatThreadName(params)` | `chatThreadManager.updateChatThreadName(params)` | 修改消息话题名称。 |
| `conn.getChatThreadDetail(params)` | `chatThreadManager.getChatThreadInfo(params)` | 获取消息话题详情。 |
| `conn.getChatThreadLastMessage(params)` | `chatThreadManager.getChatThreadLastMessageList(params)` | 获取消息话题中最后一条消息列表。 |
| - | `chatThreadManager.getChatThreadList(params)` | 获取群组下的消息话题列表。 |
| - | `chatThreadManager.getJoinedChatThreadList(params)` | 获取当前用户加入的消息话题列表。 |
| - | `chatThreadManager.getChatThreadMemberList(params)` | 获取消息话题的成员列表。 |
| - | `chatThreadManager.removeChatThreadMember(params)` | 移除消息话题的成员。 |

## 已移除的 API

以下旧 SDK API 在新 SDK 中已移除、废弃或不再提供客户端侧等价能力。迁移时应按替代方式调整。

| 旧 API | 状态 | 替代方式或迁移建议 |
| :--- | :--- | :--- |
| `conn.registerUser()` | 已移除 | 注册用户应通过服务端 REST API 完成。 |
| `conn.listen()` | 已废弃 | 使用 `addEventHandler` 注册事件监听器。 |
| `conn.isOpened()` | 已移除 | 使用 `client.getConnectionState()` 获取连接状态。 |
| `conn.setLoginInfoCustomExt()` | 已移除 | 使用初始化配置中的登录扩展信息能力。 |
| `conn.onShow()` | 已移除 | 小程序生命周期由 SDK 运行时适配能力处理。 |
| `conn.usePlugin()` | 已移除 | 使用 `ChatClient.init({ managers })` 或 `.use()` 注册 Manager。 |
| `conn.fetchHistoryMessages()` | 旧接口移除 | 使用 `chatManager.getHistoryMessages()`。 |
| `conn.createChatRoom()` | 客户端侧不再提供 | 创建聊天室建议通过服务端 REST API 完成。 |
| `conn.getGroupMsgReadUser()` | 已替换 | 使用 `chatManager.getGroupMessageReadUsers()`。 |
| `WebIM.message.create({ type: 'read' })` | 已替换 | 使用 `chatManager.sendMessageReadReceipts({ conversationId, conversationType, messageIds })` 发送消息已读回执。 |
| `WebIM.message.create({ type: 'delivery' })` | 不再按消息类型创建 | 使用新版送达回执能力和 `enableDeliveryReceipt` 配置。 |
| `WebIM.message.create({ type: 'channel' })` | 已替换 | 使用 `chatManager.clearConversationUnreadMessageCount({ conversationId, conversationType })` 清空会话未读数。 |
| 旧 SDK deprecated 别名，例如 `getBlacklist`、`getRoster` 等 | 已移除 | 使用新版 SDK 对应的标准方法。 |

## 迁移检查清单

迁移完成后，建议按以下清单检查：

| 检查项 | 说明 |
| :--- | :--- |
| 初始化入口 | 是否已从 `new SDK.connection` 调整为 `ChatClient.init`。 |
| Manager 注册 | 是否已注册业务所需的 `ChatManager`、`GroupManager`、`PushManager` 等 Manager。 |
| 登录参数 | 是否已将 `{ user, accessToken }` 调整为 `{ userId, token }`。 |
| 登出逻辑 | 是否已将 `conn.close()` 调整为 `await client.logout()`。 |
| Token 续期 | 是否在 `onTokenWillExpire` 中调用 `client.renewToken(newToken)`。 |
| 消息创建 | 是否已将 `WebIM.message.create` 替换为 `createXxxMessage`。 |
| 会话标识 | 是否已将 `to` / `chatType` 调整为 `conversationId` / `conversationType`。 |
| 消息发送 | 是否已将 `conn.send` 调整为 `client.chatManager.sendMessage`。 |
| 发送选项 | 是否已将 `deliverOnlineOnly`、`receiverList`、`priority` 等放入 `sendMessage` 第二个参数。 |
| 事件监听 | 是否已调整消息事件、群组事件、聊天室事件和多设备事件的监听方式。 |
| 返回值访问 | 是否已移除不再需要的 `.data` 访问。 |
| 错误处理 | 是否已从全局 `onError` 调整为 Promise reject 和错误类型处理。 |
| 会话列表 | 是否区分了本地缓存读取 `getConversationList` 和服务端刷新 `refreshSessionList`。 |
| 已移除 API | 是否已替换所有无等价客户端能力的旧 API。 |

## 常见问题

#### 为什么调用 `client.chatManager` 报错或不存在？

通常是因为初始化时没有注册 `ChatManager`。请在 `ChatClient.init` 的 `managers` 中传入 `ChatManager`，或初始化后调用 `.use(ChatManager)`。

#### 新 SDK 中为什么不能再从接口返回值里读取 `.data`？

新版 SDK 多数 API 直接返回业务数据，不再通过 `AsyncResult<T>` 包装。迁移时需要将 `result.data` 改为直接使用接口返回值。

#### `getConversationList` 是否会主动请求服务端？

不会。`getConversationList` 从 SDK 本地会话列表缓存读取数据。如需主动从服务端刷新会话列表，请调用 `refreshSessionList`。

#### 群组和聊天室事件为什么收不到？

请确认对应 Manager 已注册，并通过正确的事件入口注册监听器。例如群组事件通过 `client.groupManager.addEventHandler` 监听，聊天室事件通过 `client.chatRoomManager.addEventHandler` 监听。

#### 创建聊天室应该使用哪个客户端 API？

新版 Web SDK 客户端侧不提供 `createChatRoom` 作为推荐能力。创建聊天室建议通过 [服务端 REST API](/document/server-side/chatroom_create.html) 完成，客户端侧主要负责获取、加入、退出和管理已有聊天室。
