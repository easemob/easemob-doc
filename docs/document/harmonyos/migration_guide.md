# 环信 IM HarmonyOS SDK 1.x 到 5.0.0 迁移指南

## 升级总览

HarmonyOS IM SDK 5.0.0 是一次源代码不兼容的大版本升级，主要涉及以下四个方面：

1. **初始化不再自动登录，密码登录下线**
   
  `init` 仅完成 SDK 初始化，不再基于本地凭据自动登录；账号密码登录、账号注册及自动登录相关接口全部移除，仅保留 Token 登录。

2. **数据同步机制调整**
   
  登录后，SDK 可自动同步会话、好友和已加入的群组数据并保存到本地数据库，替代原先由应用主动调用的服务端拉取接口。

3. **消息已读回执机制重构**
   
  已读回执由逐条发送调整为批量发送；清除本地未读数与向消息发送方发送消息已读回执相互独立；单聊和群聊使用统一的回执模型与回调。

4. **群组配置模型重构**
   
  `GroupStyle` 单一枚举拆分为 `isPublic`、`joinApprovalRequired` 和 `allowInvites` 三个布尔字段，并支持创建群组后按配置类型更新群组属性。

:::tip
**升级方式：** 通过 ohpm 将 SDK 依赖更新至 5.0.0。升级后需按本文逐项检查代码中已删除的 API 和回调，旧接口不提供兼容别名。
:::

## 初始化与登录

### 初始化后不再自动登录

SDK 5.0.0 在 `ChatClient.init` 过程中不再读取本地持久化凭据，也不会发起自动登录。应用冷启动后，需要在适当时机主动调用 `loginWithToken` 完成登录。

1.x 中 `init` 末尾存在基于自动登录开关的自动登录逻辑；5.0 已移除该逻辑及相关 API。此外，升级到 5.0.0 后首次调用 `logout` 时，SDK 会清除历史版本保存的自动登录凭据。

| 删除的 API                                               | 替代方式                                                                                        | 接口说明              |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------- |
| `ChatOptions#setAutoLogin(boolean)` / `isAutoLogin()` | 无直接替代。应用启动后主动调用 `loginWithToken(...)`。                                                      | 配置或获取 SDK 是否自动登录。 |
| `ChatClient#isAutoLogin()`                            | 根据业务需求使用以下方法： - `isLoggedIn()`：当前登录态 - `isConnected()`：连接状态 - `isDatabaseOpened()`：本地库是否就绪。 | 查询是否处于自动登录状态。     |

### 密码登录下线

SDK 5.0.0 仅保留 Token 登录方式。用户注册和 Token 获取等账号管理操作需要由业务服务器完成。

| 删除的 API                                      | 替代方式                            | 接口说明                |
| -------------------------------------------- | ------------------------------- | ------------------- |
| `ChatClient#login(userId, password)`         | `loginWithToken(userId, token)` | 使用用户 ID 和 Token 登录。 |
| `ChatClient#createAccount(userId, password)` | 无客户端替代，通过服务端 REST API 注册。       | 注册 IM 账号。           

### 登录与数据库打开解耦

SDK 5.0.0 新增本地数据库打开回调。SDK 在本地数据库打开后即可读取本地数据，不必等待登录完成。

- `ConnectionListener#onDatabaseOpened(username)`：本地数据库打开完成时触发。该回调仅表示本地数据库就绪，不代表登录成功，不能代替 `onConnected`。
- `ChatClient#isDatabaseOpened()`：查询当前本地数据库是否已就绪，返回 `boolean`。同样不能代替 `isLoggedIn` 或连接状态回调。

### 日志能力补齐

SDK 5.0 补齐了以下日志能力：

- `ChatClient#addLogListener(listener)` / `removeLogListener(listener)`：添加或移除日志监听器。`ChatLogListener#onLog(log)` 在 SDK 产生一条日志时触发，可用于采集和上报 SDK 日志。
- `ChatClient#compressLogs(): Promise<string>`：将当前 SDK 日志压缩为单个 gz 文件，返回压缩文件的本地绝对路径，供应用自行上传。

## 数据同步与服务端拉取 API 迁移

### 数据同步 API

SDK 5.0.0 新增登录后自动数据同步机制。应用可在初始化时通过 `ChatOptions#setDataSyncType` 指定需要同步的数据类型，并通过 `ConnectionListener` 监听同步进度。同步完成后，应用应从本地接口读取数据。

| 所属类     | API 或配置     | 接口说明        |
| :------------------- | :----- | :-------------------------------------------- |
| `ChatOptions`        | `DataSyncType`                                                                                | 数据同步类型枚举：`NONE(0)`、`CONVERSATIONS(1)`、`CONTACTS(2)` 和 `JOINED_GROUPS(4)`。多个类型可以组合使用。 |
| `ChatOptions`        | `setDataSyncType(types: DataSyncType \| DataSyncType[])/getDataSyncType(): DataSyncType[]` | 设置或获取登录后需要自动同步的数据类型。该配置应在调用 `ChatClient#init` 前完成。单个值或数组均可。                          |
| `ConnectionListener` | `onDataSyncStart(type)` / `onDataSyncFinish(type, errorCode)`                                 | 接收指定类型数据同步的开始和结束通知；`errorCode` 为 `EMError#EM_NO_ERROR` 时表示同步成功。                      |

:::tip
`dataSyncType` **默认为** `[DataSyncType.CONVERSATIONS]`，即登录后自动同步会话数据。好友和已加入群组数据需显式配置 `CONTACTS`、`JOINED_GROUPS` 才会自动同步，否则 `getAllGroups()` 和本地好友查询接口可能返回空数据。这一点与 1.x 不同：1.x 中依赖登录后主动拉取的数据，升级后按同步类型自动到位，未配置的类型需要业务服务自行维护。
:::

典型配置如下：

```typescript
let options: ChatOptions = new ChatOptions();
options.setAppKey("your-appkey");
options.setDataSyncType([
    DataSyncType.CONVERSATIONS,
    DataSyncType.CONTACTS,
    DataSyncType.JOINED_GROUPS,
]);
ChatClient.getInstance().init(context, options);
```

### 服务端拉取 API 迁移

原先通过主动调用服务端拉取接口并在回调中刷新数据的方式，统一调整为 **配置数据同步范围，登录后自动同步，读取本地数据，并在 `onDataSyncFinish` 回调中刷新 UI**。

| 类  | 删除的 API                                  | 5.0.0 推荐方式        |
| :------------------- | :----- | :-------------------------------------------- |
| `ChatManager`    | `fetchConversationsFromServer(limit, cursor)`、`fetchConversationsFromServerWithFilter(filter)`                        | `getAllConversationsBySort()` / `getConversations()`（本地）+ `onDataSyncFinish(CONVERSATIONS, ...)` |
| `ChatManager`    | `fetchPinnedConversationsFromServer(limit, cursor)`                                                                   | 置顶会话随会话数据同步落地，读本地置顶状态：`getConversations()` 过滤 `Conversation#isPinned()`。                         |
| `GroupManager`   | `fetchJoinedGroupsFromServer(pageNum, pageSize)`                                                                      | `getAllGroups()`（本地）+ `onDataSyncFinish(JOINED_GROUPS, ...)`                                     |
| `GroupManager`   | `fetchPublicGroupsFromServer(pageSize, cursor?)`                                                                      | 无直接替代。公开群组目录需由业务服务维护。                                                                            |
| `ContactManager` | `fetchAllContactsIDFromServer()`、`fetchAllContactsFromServer()`、`fetchAllContactsFromServerByPage(pageSize, cursor?)` | `fetchAllContactsFromLocal()` + `onDataSyncFinish(CONTACTS, ...)`。**5.0.0 已无任何从服务器拉取好友列表的入口**    |
| `ChatOptions`    | `setEnableAutoSyncContacts(boolean)` / `isEnableAutoSyncContacts()`                                                   | 并入 `setDataSyncType(...)` 的 `CONTACTS` 位                                                         |

相应地，`ContactListener#onContactSyncStart()` 和 `onContactSyncFinishWithError(errorCode, error)` 已删除。请改用 `ConnectionListener#onDataSyncStart(DataSyncType.CONTACTS)` 和 `onDataSyncFinish(DataSyncType.CONTACTS, errorCode)` 监听好友数据同步状态。详见 [监听器回调变化汇总](#监听器回调变化汇总)。

## 已读回执体系重构

消息已读回执由逐条发送调整为批量发送；是否需要回执通过 `ChatMessage#setIsNeedReadReceipt` 按消息设置；发送消息已读回执与清理会话未读数相互独立。旧 API 不提供兼容别名，属于不兼容变更。

### 发送消息已读回执与清除未读数

| 删除的 API    | 5.0.0 替代         | 说明      |
| :------------------- | :----- | :-------------------------------------------- |
| `ChatManager#ackMessageRead(to, messageId)`                         | `sendMessageReadReceipts(messages)`                               | 批量发送消息已读回执，单聊和群聊统一使用。                                                              |
| `ChatManager#ackGroupMessageRead(message, ext)`                     | `sendMessageReadReceipts(messages)`                               | 不再为群聊提供单独的逐条已读回执接口，也不再支持通过 `ext` 传递自定义内容。                                          |
| `ChatManager#ackConversationRead(conversationId)`                   | `clearConversationUnreadMessageCount(conversationId)`             | 仅清除本地会话未读数并同步至当前用户的其他设备，不会向消息发送方发送已读回执。如需发送消息已读回执，需另行调用 `sendMessageReadReceipts`。 |
| `ChatManager#markAllConversationsAsRead()`                          | `clearAllConversationUnreadMessageCount()`                        | 清除所有会话的本地未读数，并同步至当前用户的其他设备。                                                        |
| `Conversation#markMessageAsRead(msgId)` / `markAllMessagesAsRead()` | `ChatManager#clearConversationUnreadMessageCount(conversationId)` | `Conversation` 不再提供修改消息已读状态的接口。SDK 内部维护消息的 `isRead` 状态。                            |
| `ChatOptions#setRequireReadAck(boolean)` / `isRequireReadAck()`     | 无全局配置                                                             | 发送消息前，通过 `ChatMessage#setIsNeedReadReceipt(true)` 为需要回执的消息单独开启。                    |

`sendMessageReadReceipts` 的使用约束如下：

- 每次最多处理 50 条**属于同一会话**的消息，超限返回 `INVALID_PARAM`。
- 只有 `isNeedReadReceipt()` 为 `true` 且尚未发送已读回执的消息会被处理；未设置需要回执的、已回执的以及自己发送的消息会被自动跳过且不报错。若过滤后没有待处理消息，调用成功返回，但不会发起任何网络请求。
- 该接口不会清除或修改会话的本地未读数。

`clearConversationUnreadMessageCount` 先更新本地未读数，再同步至当前用户的其他设备；服务端确认超时或断连时本地清零结果保留，不会回滚。

### 接收消息已读回执

SDK 5.0.0 将单聊和群聊的消息已读回执统一通过 `ChatMessageListener` 回调，不再分别使用单聊和群聊回调。

| 1.x 回调   | 5.0.0 回调  | 说明  |
| :------------------- | :----- | :----------------- |
| `ChatMessageListener#onMessageRead(messages)`           | `ChatMessageListener#onMessageReadReceipts(receipts)` | 接收单聊消息的已读回执。           |
| `ChatMessageListener#onGroupMessageRead(groupReadAcks)` | `ChatMessageListener#onMessageReadReceipts(receipts)` | 接收群聊消息的已读回执。        |
| `ChatMessageListener#onReadAckForGroupMessageUpdated()` | 无直接替代                                                 | 群消息已读回执状态变化不再单独回调，统一通过 `onMessageReadReceipts` 通知。   |
| `ConversationListener#onConversationRead(from, to)`     | 无直接替代                                                 | 会话级已读回执不再单独回调；消息已读状态通过 `onMessageReadReceipts` 通知。`ConversationListener` 在 5.0.0 中仅保留 `onConversationUpdate`。 |

注意回调参数的变化：1.x 传入的是消息对象数组，5.0 传入的是回执对象数组 `ChatMessageReadReceipt[]`，其中包含会话 ID 和已读人数等信息。

SDK 5.0.0 新增 `ChatMessageReadReceipt` 数据类，用于描述消息已读回执：

- `getMessageId()`：获取消息 ID。
- `getConversationId()`：获取会话 ID。
- `isPeerReceipt()`：判断单聊对端是否已发送已读回执。
- `getReadCount()`：获取群聊消息的已读人数。

### 回执详情查询

| 1.x API             | 5.0.0 API                      | 说明         |
| :------------------- | :----- | :-------------- |
| `fetchGroupReadAcks(msgId, pageSize, startAckId)` | `fetchGroupMessageReadReceipts(messageId, pageSize, startReceiptId): Promise<CursorResult<GroupReadReceipt>>` | 分页获取指定群消息的已读回执详情。`startReceiptId` 为空表示从最新回执开始，按服务器接收回执时间倒序分页。调用前消息必须存在、属于群聊且 `isNeedReadReceipt()` 为 `true`，否则返回 `INVALID_PARAM`。 |
| 无                                                 | `getGroupMessageReadReceipts(messages: ChatMessage \| ChatMessage[]): Promise<ChatMessageReadReceipt[]>`       | 批量获取群消息的已读回执汇总。消息必须属于同一群聊会话，建议每次不超过 20 条（上限由服务端约束）。                                                                               |

回执数据模型由 `GroupReadAck` 替换为 `GroupReadReceipt`：

- `getAckId()`：获取已读回执 ID。
- `getMsgId()`：获取该回执对应的群消息 ID。
- `getFrom(): GroupMember | undefined`：获取发送已读回执的群成员信息。服务器未下发回执发送者的群成员信息时返回 `undefined`。
- `getCount()`：获取该成员发送回执时的已读人数快照。
- `getTimestamp()`：获取发送已读回执的时间戳。
- 原 `getContent()` 已移除，服务端不再下发 ACK 扩展内容。

### ChatMessage 已读相关方法调整

| 1.x API                                                                    | 5.0.0 API                       | 说明                                               |
| :------------------- | :----- | :-------------------------------------------- |
| `isNeedGroupAck()`                                                         | `isNeedReadReceipt()`           | 单聊和群聊均适用；发送消息前设置是否需要已读回执。值为 `false` 的消息不能发送已读回执。 |
| `setIsNeedGroupAck(boolean)`                                               | `setIsNeedReadReceipt(boolean)` | 同上。                                              |
| `groupAckCount()`                                                          | `readReceiptCount()`            | 获取消息的群聊已读人数。                                     |
| `isReceiverRead()`                                                         | `isPeerRead()`                  | 判断消息对端是否已读。                                      |
| `isUnread()`                                                               | `isRead()`                      | 已读状态语义调整为正向表达。                                   |
| `setReceiverRead(boolean)`、`setUnread(boolean)`、`setGroupAckCount(number)` | 无（已删除）                          | 5.0.0 移除这些公开 setter，消息已读状态由 SDK 内部维护。            |

此外，`ChatMessage#getRecaller()` 已删除。需要获取撤回消息的操作者时，请使用 `ChatMessageListener#onMessageRecalled` 回调中 `RecallMessageInfo` 的 `getRecallBy()`。

### 接收消息默认已读

`ChatMessage.createReceiveMessage(...)` 创建的接收消息对象默认标记为已读（`isRead() === true`），不会计入会话未读数。依赖"接收消息默认未读"行为的 UI 逻辑需自行调整。

## 群组配置模型重构

SDK 5.0.0 将群组的可见性、入群审批和成员邀请权限从 `GroupStyle` 单一枚举改为独立布尔配置字段。**该调整不提供兼容层，升级时需要修改相关建群和群组配置代码。**

### `GroupStyle` 与布尔配置字段对照

| 1.x `GroupStyle`（已删除）              | 5.0.0 配置字段                                                               |
| :---------------- | :----- |
| `GroupStylePrivateOnlyOwnerInvite` | `isPublic = false`，`joinApprovalRequired = false`，`allowInvites = false` |
| `GroupStylePrivateMemberCanInvite` | `isPublic = false`，`joinApprovalRequired = false`，`allowInvites = true`  |
| `GroupStylePublicJoinNeedApproval` | `isPublic = true`，`joinApprovalRequired = true`，`allowInvites = false`   |
| `GroupStylePublicOpenJoin`         | `isPublic = true`，`joinApprovalRequired = false`，`allowInvites = false`  |

### 创建群组参数变化

HarmonyOS 5.0.0 的 `createGroup(option?: GroupOptions)` 调用形式保持不变，群配置字段直接平铺在 `GroupOptions` 中：

```typescript
let option: GroupOptions = {
    groupName: "group name",
    desc: "group desc",
    members: ["user1", "user2"],
    reason: "join reason",
    // 群配置字段（均可选，未传时使用默认值）
    maxUsers: 200,
    isPublic: true,
    joinApprovalRequired: true,
    allowInvites: false,
    inviteNeedConfirm: false,
    extField: "custom ext",
};
let group: Group = await ChatClient.getInstance().groupManager().createGroup(option);
```

`GroupOptions` 配置字段的默认值：`maxUsers = 200`、`isPublic = false`、`joinApprovalRequired = false`、`allowInvites = false`、`inviteNeedConfirm = true`、`extField` 为空。原 `style?: GroupStyle` 字段已删除。

### 群配置更新

SDK 5.0.0 新增建群后按配置类型更新群组属性的能力：

- `GroupManager#updateGroupConfigs(groupId, types, configs): Promise<Group>`：仅应用 `types` 中指定的配置项，`configs` 中未选中的字段不会下发。该接口仅群主和群管理员可调用，返回更新后的 `Group`。
- `GroupConfigsType` 枚举：`IS_PUBLIC(1)`、`JOIN_APPROVAL_REQUIRED(2)`、`ALLOW_INVITES(4)`、`MAX_USERS(8)`、`INVITE_NEED_CONFIRM(16)`、`EXT(32)`。其中 `EXT` 对应 `extField`。
- `GroupConfigs` 类承载上述六项配置，默认值与 `GroupOptions` 一致。

### 群组访问器变化

| 1.x API    | 5.0.0 API    | 说明          |
| :---------------- | :----- | :------------- |
| `Group#canJoinDirectly()` | 已删除                              | 不再提供该判断。请改用 `isPublic()` 与 `isJoinApprovalRequired()` 组合表达可见性与审批语义。    |
| 无                         | `Group#isJoinApprovalRequired()` | 判断群组是否需要审批入群。群配置缺失时返回 `true`。                                          |
| 无                         | `Group#isInviteNeedConfirm()`    | 判断邀请用户进群是否需要对方确认，仅在 `GroupManager#inviteUser` 邀请入群时生效。群配置缺失时返回 `true`。 |
| 无                         | `Group#getUsers(): string[]`     | 获取群主、管理员和普通成员的用户 ID 列表，按 owner → admins → members 顺序合并，可能包含重复的用户 ID。   |

`Group#isPublic()` 和 `Group#isMemberAllowToInvite()` 的方法签名保持不变，调用方无需修改。

### 群组监听器变化

- `onRequestToJoinDeclined` **参数顺序调整**：由 `(groupId, groupName, decliner, applicant, reason)` 调整为 `(groupId, groupName, decliner, reason, applicant)`，即 `reason` 与 `applicant` 位置互换。注意 `groupName` 来自本地群组缓存，本地不存在该群时为空字符串。
- **单成员回调删除**：`onMemberJoined(groupId, member)` 和 `onMemberExited(groupId, member)` 已删除，仅保留批量回调 `onMembersJoined(groupId, members: string[])` 和 `onMembersExited(groupId, members: string[])`。聊天室监听器 `ChatroomListener` 的单成员回调不受影响，仍保留。

## 聊天室监听器变化

| 1.x 回调        | 5.0.0 回调         | 说明                 |
| :---------- | :----------| :-----|
| `onMutelistAdded(roomId, mutes: string[], expireTime)` | `onMutelistAdded(roomId, mutes: Map<string, number>)`          | 改为用户 ID 与禁言截止时间（Unix 毫秒时间戳）的映射。     |
| `onMuteMapAdded(roomId, mutes)`（已废弃）                   | `onMutelistAdded(roomId, mutes: Map<string, number>)`          | 两个旧回调合并为一个。            |
| `onRemovedFromChatroom(reason, roomId, roomName)`      | `onRemovedFromChatroom(reason, roomId, roomName, participant)` | 新增 `participant` 参数，表示被移出的成员。该回调仅在本人被移出聊天室时触发，`participant` 为当前登录用户 ID。 |

## 会话管理变化

| 1.x API      | 5.0.0 API       | 说明         |
| :---------------- | :----- | :------- |
| 单个会话删除接口循环调用 | `deleteConversations(conversationIds: string \| string[], deleteMessages)` | 支持传入单个会话 ID 或 ID 数组批量删除本地会话。`deleteMessages` 决定是否同时删除本地历史消息。空数组返回 `INVALID_PARAM`。 |
| 无            | `Conversation#getConversationName(): string`                              | 获取会话显示名称。单聊返回对方用户信息，群聊返回群组信息；相关数据尚未同步时返回空字符串。  |
| 无            | `Conversation#getConversationAvatar(): string`                            | 获取会话头像。数据尚未同步时返回空字符串。        |

## 监听器回调变化汇总

旧回调被删除后可能不会立即产生编译错误（例如实现类未显式覆盖对应方法），但运行时将无法收到对应事件。升级时应逐项检查监听器实现。

| 监听器    | 1.x 回调     | 5.0.0 回调    | 回调说明                           |
| :----- | :-------| :-----| :-------|
| `ConnectionListener`   | 无                                                                                  | `onDataSyncStart(type)`、`onDataSyncFinish(type, errorCode)`、`onDatabaseOpened(username)` | 通知数据同步开始、结束以及本地数据库打开完成。        |
| `ContactListener`      | `onContactSyncStart()`、`onContactSyncFinishWithError(errorCode, error)`            | `ConnectionListener#onDataSyncStart/onDataSyncFinish(DataSyncType.CONTACTS, ...)`        | 监听好友数据同步状态。                    |
| `ChatMessageListener`  | `onMessageRead(...)`、`onGroupMessageRead(...)`、`onReadAckForGroupMessageUpdated()` | `onMessageReadReceipts(receipts: ChatMessageReadReceipt[])`                              | 统一接收单聊和群聊消息已读回执。               |
| `ConversationListener` | `onConversationRead(from, to)`                                                     | 无（仅保留 `onConversationUpdate`）                                                            | 会话级已读回执不再单独回调。                 |
| `GroupListener`        | `onMemberJoined(groupId, member)`                                                  | `onMembersJoined(groupId, members: string[])`                                            | 一次通知多个成员加入群组。                  |
| `GroupListener`        | `onMemberExited(groupId, member)`                                                  | `onMembersExited(groupId, members: string[])`                                            | 一次通知多个成员退出群组。                  |
| `GroupListener`        | `onRequestToJoinDeclined(groupId, groupName, decliner, applicant, reason)`         | `onRequestToJoinDeclined(groupId, groupName, decliner, reason, applicant)`               | `reason` 与 `applicant` 参数位置互换。 |
| `ChatroomListener`     | `onMutelistAdded(roomId, string[], expireTime)`、`onMuteMapAdded`                   | `onMutelistAdded(roomId, Map<string, number>)`                                           | 禁言列表改为 Map 结构。                 |
| `ChatroomListener`     | `onRemovedFromChatroom(reason, roomId, roomName)`                                  | `onRemovedFromChatroom(reason, roomId, roomName, participant)`                           | 新增被移出成员参数。                     |

## 行为变化

以下变化可能不会触发编译错误，但会影响业务逻辑：

1. **初始化后不再自动登录**
   
  `ChatClient.init` 完成后，SDK 不会自动登录。应用需要在适当时机主动调用 `loginWithToken` 完成登录。升级后首次 `logout` 会清除历史版本保存的自动登录凭据。

2. **数据同步范围默认只包含会话**

  `dataSyncType` 默认为 `[DataSyncType.CONVERSATIONS]`，登录后仅自动同步会话数据。好友和已加入的群组需通过 `setDataSyncType` 显式配置，否则相关本地查询接口可能返回空数据。

3. **清除未读数不会发送消息已读回执**
   
  `clearConversationUnreadMessageCount` 只清除指定会话的本地未读数并同步至当前账号的其他设备，不会向消息发送方发送已读回执。如需通知对方消息已读，需额外调用 `sendMessageReadReceipts`。

4. **查询消息不再自动修改已读状态**
   
  `Conversation#getMessage(msgId)` 仅用于查询指定消息，不会因为查询操作自动将消息标记为已读。旧版中"查询消息时同步标记已读"的行为已随 `markMessageAsRead` 一并移除。

5. **接收消息默认已读**
   
  `createReceiveMessage` 创建的接收消息默认 `isRead() === true`，不再计入会话未读数。

6. **推送 Token 上传判断逻辑发生变化**
   
  推送 Token 发生变化或设备重新登录时，SDK 会在登录成功后自动检查并上传 Token。应用无需自行判断 Token 是否需要上传，也不应依赖旧版自动登录相关逻辑处理 Token 上传。

7. **新增多设备未读数同步事件**
   
  `MultiDevicesListener` 新增以下事件，用于通知当前账号在其他设备上清除未读数：
  - `CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 65`：其他设备清除了指定会话的未读数。
  - `ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 66`：其他设备清除了所有会话的未读数。

  收到事件后，应用应重新调用 `ChatManager#getAllConversationsBySort()` 获取最新会话数据并刷新 UI。

8. **获取在线设备与踢设备接口暂未开放**
   
  5.0.0 暂不提供查询账号在线设备列表和踢出设备的接口，`DeviceInfo` 类型未对外导出。原密码鉴权版本接口已随密码登录一并删除。

