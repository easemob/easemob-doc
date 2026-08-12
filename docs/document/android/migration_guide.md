# 环信 IM SDK 4.x 到 5.0.0 迁移指南

## 升级总览

Android IM SDK 5.0.0 是一次源代码不兼容的大版本升级，主要涉及以下四个方面：

1. **数据同步机制调整**
   登录后，SDK 可自动同步会话、好友和已加入的群组数据，并将数据保存到本地数据库，替代部分原先由应用主动调用的服务端拉取接口。
2. **消息已读回执机制重构**
   已读回执由逐条发送调整为批量发送；清除本地未读数与向消息发送方发送消息已读回执相互独立；单聊和群聊使用统一的回执模型与回调。
3. **群组配置模型重构**
   `EMGroupStyle` 单一枚举拆分为 `isPublic`、`joinApprovalRequired` 和 `allowInvites` 三个布尔字段，并支持创建群组后按配置类型更新群组属性。
4. **历史 API 精简**
   移除长期标记为废弃 `@Deprecated` 的接口及部分边缘能力。注册、举报和消息流量统计等功能需由业务服务或服务端 REST API 实现；密码登录接口下线，仅保留 Token 登录。

:::tip
**集成要求：** Android IM SDK 5.0.0 已全面迁移至 AndroidX。宿主 App 必须启用 AndroidX `android.useAndroidX=true`
使用旧版 `android.support.*` 依赖的工程需要先完成 AndroidX 迁移。
:::

## 初始化与登录

### 自动登录移除

Android SDK v5 不再在 `EMClient#init` 过程中自动登录。应用冷启动后，需要在适当时机主动调用 `loginWithToken` 完成登录。

4.x 中 `EMClient#init` 末尾存在基于 `getAutoLogin()` 和 `isLoggedInBefore()` 的自动登录逻辑；5.0 已移除该逻辑及相关 API。

| 删除的 API      | 替代方式  | 接口说明                      |
| :------------------- | :----- | :------------ |
| `EMOptions#setAutoLogin(boolean)` / `getAutoLogin()` | 无直接替代。应用启动后主动调用 `loginWithToken(...)`。       | 配置或获取 SDK 是否自动登录。 |
| `EMClient#isLoggedInBefore()`                        | 根据业务需求使用以下方法：<br/> - `isLoggedIn()`：当前登录态<br/> - `isConnected()`：连接状态 <br/> - `isDatabaseOpened()`：本地库就绪。 | 判断之前是否存在登录记录。    |

### 密码登录下线

Android SDK v5 仅保留 Token 登录方式。用户注册和 Token 获取等账号管理操作需要由业务服务器完成。

| 删除的 API       | 替代方式   | 接口说明              |
| :------------------- | :----- | :--------- |
| `login(String id, String password, EMCallBack)`（4.x 已废弃） | `loginWithToken(String username, String token, EMCallBack)` | 使用用户 ID 和密码登录。          |
| `loginWithAgoraToken(String, String, EMCallBack)`（4.x 已废弃） | `loginWithToken(String username, String token, EMCallBack)` | 使用 Agora Token 登录。         |
| `renewToken(String newAgoraToken)`（4.x 已废弃）             | `renewToken(String newToken, EMCallBack)`                   | 使用新 Token 更新当前登录会话。 |
| `getUserTokenFromServer(String, String, EMValueCallBack<String>)` | 无客户端替代，由 App Server 获取并下发 Token。              | 从 SDK 获取或请求用户 Token。   |
| `createAccount(String username, String password)`            | 无客户端替代，通过服务端 REST API 注册。                    | 注册 IM 账号。                  |
| `check(String, String, CheckResultListener)` 和 `EMCheckType` | 无直接替代。结合正常登录流程和连接状态回调进行连通性诊断。  | 检查账号、DNS 或登录相关状态。  |

### 登录与数据库打开解耦

Android v5.0 新增本地数据库打开回调。SDK 在本地数据库打开后即可读取本地数据，不必等待登录完成，有助于加快冷启动时的首屏展示。

- `EMConnectionListener#onDatabaseOpened(String username)`：本地数据库打开完成时触发。
- `EMClient#isDatabaseOpened()`：查询当前本地数据库是否已就绪。

## 数据同步与服务端拉取 API 迁移

### 数据同步 API

Android SDK v5.0.0 新增登录后自动数据同步机制。应用可在初始化时通过 `EMOptions#setDataSyncType` 指定需要同步的数据类型，并通过 `EMConnectionListener` 监听同步进度。同步完成后，应用应从本地接口读取数据。

| 所属类     | API 或配置    | 接口说明       |
| :------------------- | :----- | :-------------------------------------------- |
| `EMOptions`            | `EMDataSyncType`                                             | 数据同步类型枚举：`NONE(0)`、`CONVERSATIONS(1 << 0)`、`CONTACTS(1 << 1)` 和 `JOINED_GROUPS(1 << 2)`。多个类型可以组合使用。 |
| `EMOptions`            | `setDataSyncType(EnumSet<EMDataSyncType>)` / `getDataSyncType()` | 设置或获取登录后需要自动同步的数据类型。该配置应在调用 `EMClient#init` 前完成。 |
| `EMConnectionListener` | `onDataSyncStart(EMDataSyncType type)` / `onDataSyncFinish(EMDataSyncType type, int errorCode)` | 接收指定类型数据同步的开始和结束通知；`errorCode` 为 `EMError#EM_NO_ERROR` 时表示同步成功。 |

:::tip
`EMOptions#dataSyncType` 默认为 `NONE`。如果不配置，登录后不会自动同步会话、好友或已加入的群组数据。因此，`getAllConversations()`、`getAllGroups()` 和本地好友查询接口可能返回空数据。 
:::

典型配置如下：

```java
EMOptions options = new EMOptions();
options.setAppKey("your-appkey");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS,
        EMOptions.EMDataSyncType.CONTACTS,
        EMOptions.EMDataSyncType.JOINED_GROUPS));
EMClient.getInstance().init(context, options);
```

### 服务端拉取 API 迁移

原先通过主动调用服务端拉取接口并在回调中刷新数据的方式，统一调整为 **配置数据同步范围，登录后自动同步，读取本地数据，并在 `onDataSyncFinish` 回调中刷新 UI**。

| 类 | 删除的 API | 5.0.0 推荐方式 |
|---|---|---|
| `EMChatManager` | `fetchConversationsFromServer()` 及全部 4 个 `asyncFetchConversationsFromServer(...)` 重载 | `getAllConversations()` / `getAllConversationsBySort()`（本地）+ `onDataSyncFinish(CONVERSATIONS, ...)` |
| `EMChatManager` | `asyncFetchPinnedConversationsFromServer(...)` | 置顶随会话同步落地，读本地会话置顶状态 |
| `EMChatManager` | `asyncGetConversationsFromServerWithCursor(...)` | 本地查询 |
| `EMGroupManager` | `getJoinedGroupsFromServer()` / `getJoinedGroupsFromServer(pageIndex, pageSize, ...)` 及两个 async 版本 | `getAllGroups()`（本地）+ `onDataSyncFinish(JOINED_GROUPS, ...)` |
| `EMContactManager` | `getAllContactsFromServer()`、`asyncGetAllContactsFromServer(...)`、`asyncFetchAllContactsFromServer(...)`（含分页重载） | `getContactsFromLocal()` / `fetchContactFromLocal(String)` / `asyncFetchAllContactsFromLocal(...)` + `onDataSyncFinish(CONTACTS, ...)`。**5.0.0 已无任何从服务器拉取好友列表的入口** |
| `EMChatManager` | `loadAllConversations()` | 降为包私有；直接 `getAllConversations()` |
| `EMGroupManager` | `loadAllGroups()` | 降为包私有；直接 `getAllGroups()` |
| `EMOptions` | `setEnableAutoSyncContacts(boolean)` / `isEnableAutoSyncContacts()` | 并入 `setDataSyncType(...)` 的 `CONTACTS` 位 |

相应地，`EMContactListener#onContactSyncStart()` 和 `onContactSyncFinishWithError(int, String)` 已删除。请改用 `EMConnectionListener#onDataSyncStart(EMDataSyncType.CONTACTS)` 和 `onDataSyncFinish(EMDataSyncType.CONTACTS, int)` 监听好友数据同步状态。详见 [监听器回调变化汇总](#监听器回调变化汇总)。

## 已读回执体系重构

消息已读回执由逐条发送调整为批量发送；是否需要回执通过 `EMMessage#setIsNeedReadReceipt` 按消息设置；发送消息已读回执与清理会话未读数相互独立。旧 API 不提供兼容别名，属于不兼容变更。

### 发送消息已读回执与清除未读数

| 删除的 API        | 5.0.0 替代      | 说明     |
| :------------------- | :----- | :-------------------------------------------- |
| `EMChatManager#ackMessageRead(String to, String messageId)`  | `asyncSendMessageReadReceipts(List<EMMessage>, EMCallBack)`  | 批量发送消息已读回执，单聊和群聊统一使用。                   |
| `EMChatManager#ackGroupMessageRead(String to, String messageId, String ext)` | `asyncSendMessageReadReceipts(List<EMMessage>, EMCallBack)`  | 不再为群聊提供单独的逐条已读回执接口，也不再支持通过 `ext` 传递自定义消息已读回执中携带的自定义内容。                 |
| `EMChatManager#ackConversationRead(String conversationId)`   | `asyncClearConversationUnreadMessageCount(String, EMCallBack)` | 仅清除本地会话未读数并同步至当前用户的其他设备，不会向消息发送方发送已读回执。如需发送消息已读回执，需另行调用 `asyncSendMessageReadReceipts`。 |
| `EMChatManager#markAllConversationsAsRead()`                 | `asyncClearAllConversationUnreadMessageCount(EMCallBack)`    | 清除所有会话的本地未读数，并同步至当前用户的其他设备。       |
| `EMConversation#markMessageAsRead(String)` / `markAllMessagesAsRead()` | `EMChatManager#asyncClearConversationUnreadMessageCount(String, EMCallBack)` | 通过会话级接口清除本地未读数。`EMConversation` 不再提供修改消息已读状态的接口。SDK 内部维护消息的 `isRead` 状态。   |
| `EMConversation#getMessage(String, boolean markAsRead)`      | `getMessage(String)`                                         | 仅查询消息，不会自动将消息标记为已读。若需清除未读数，应单独调用未读数清除接口。 |
| `EMOptions#setRequireAck(boolean)` / `getRequireAck()`       | 无全局配置                                                   | 发送消息前，通过 `EMMessage#setIsNeedReadReceipt(true)` 为需要回执的消息单独开启。 |

`asyncSendMessageReadReceipts` 的使用约束如下：每次最多处理 50 条属于同一会话的消息。只有 `isNeedReadReceipt()` 为 `true` 且尚未发送已读回执的消息会被处理，其他消息将自动跳过。SDK 会通过 `onSuccess()` 或 `onError(int, String)` 返回本批消息的处理结果。该接口不会清除或修改会话的本地未读数。

### 接收消息已读回执

Android SDK v5 将单聊和群聊的消息已读回执统一通过 `EMMessageListener` 回调，不再分别使用单聊和群聊回调。

| 4.x 回调  | 5.0.0 回调    | 说明    |
| :------------------- | :----- | :----------------- |
| `EMMessageListener#onMessageRead(List<EMMessage>)`           | `EMMessageListener#onMessageReadReceipts(List<EMMessageReadReceipt>)` | 接收单聊消息的已读回执。                                     |
| `EMMessageListener#onGroupMessageRead(List<EMGroupReadAck>)` | `EMMessageListener#onMessageReadReceipts(List<EMMessageReadReceipt>)` | 接收群聊消息的已读回执。                                     |
| `EMConversationListener#onConversationRead(String from, String to)` | 无直接替代                                                   | 会话级已读回执不再单独回调；消息已读状态通过 `onMessageReadReceipts` 通知。`EMConversationListener` 在 v5 中仅用于会话更新通知。 |
| `EMMessageListener#onReadAckForGroupMessageUpdated()`        | `EMMessageListener#onReadReceiptForGroupMessageUpdated()`    | 群聊消息已读回执状态发生变化时触发，仅调整了回调命名。       |

SDK v5 新增 `EMMessageReadReceipt` 数据类，用于描述消息已读回执：

- `getMessageId()`：获取消息 ID。
- `getConversationId()`：获取会话 ID。
- `isPeerReceipt()`：判断单聊对端是否已发送已读回执。
- `getReadCount()`：获取群聊消息的已读人数。

### 回执详情查询

| 4.x API       | 5.0.0 API     | 说明   |
| :------------------- | :----- | :-------------- |
| `fetchGroupReadAcks(String msgId, int pageSize, String startAckId)` / `asyncFetchGroupReadAcks(...)` | `asyncFetchGroupMessageReadReceipts(String msgId, int pageSize, String startAckId, EMValueCallBack<EMCursorResult<EMGroupReadReceipt>>)` | 分页获取指定群消息的已读回执详情。`pageSize` 取值范围为 1-50，`startAckId` 用于指定分页起始位置。 |
| 无                                                           | `asyncGetGroupMessageReadReceipts(List<EMMessage>, EMValueCallBack<List<EMMessageReadReceipt>>)` | 批量获取群消息的已读回执汇总。每次最多传入 20 条消息，且消息必须属于同一会话。 |

回执数据模型由 `EMGroupReadAck` 替换为 `EMGroupReadReceipt`：

- `getAckId()`：获取已读回执 ID。
- `getMsgId()`：获取群消息 ID。
- `getFrom()`：获取发送已读回执的群成员信息，返回类型为 `EMGroupMemberInfo`。
- `getCount()`：获取已读回执数量。
- `getTimestamp()`：获取发送已读回执的时间戳。
- 原 `getContent()` 已移除，服务端不再下发 ACK 扩展内容。

### EMMessage 已读相关方法重命名

| 4.x API        | 5.0.0 API         | 说明       |
| :------------------- | :----- | :-------------------------------------------- |
| `isAcked()` / `setAcked(boolean)`                 | `isPeerRead()` / `setPeerRead(boolean)`                 | 判断消息对端是否已读。`setPeerRead` 仅供 SDK 内部使用。      |
| `isUnread()` / `setUnread(boolean)`               | `isRead()` / `setRead(boolean)`                         | 已读状态语义调整为正向表达。`setRead` 仅供 SDK 内部使用。    |
| `isNeedGroupAck()` / `setIsNeedGroupAck(boolean)` | `isNeedReadReceipt()` / `setIsNeedReadReceipt(boolean)` | 单聊和群聊均适用；发送消息前设置是否需要已读回执。           |
| `groupAckCount()` / `setGroupAckCount(int)`       | `readReceiptCount()` / `setReadReceiptCount(int)`       | 获取消息的群聊已读人数。`setReadReceiptCount` 仅供 SDK 内部使用。 |

### 多设备事件

`EMMultiDeviceListener` 新增以下事件，用于通知当前账号在其他设备上清除未读数：

- `CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 65`：其他设备清除了指定会话的未读数。
- `ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 66`：其他设备清除了所有会话的未读数。

## 群组配置模型重构

Android SDK v5 将群组的可见性、入群审批和成员邀请权限从 `EMGroupStyle` 单一枚举改为 `EMGroupConfigs` 中的独立配置字段。**该调整不提供兼容层，升级时需要修改相关建群和群组配置代码。**

### `EMGroupStyle` 与 `EMGroupConfigs` 对照

| 4.x `EMGroupManager.EMGroupStyle`（已删除） | 5.0.0 `EMGroupConfigs` 配置 |
| :---------------- | :----- |
| `EMGroupStylePrivateOnlyOwnerInvite`        | `isPublic = false`，`allowInvites = false`        |
| `EMGroupStylePrivateMemberCanInvite`        | `isPublic = false`，`allowInvites = true`         |
| `EMGroupStylePublicJoinNeedApproval`        | `isPublic = true`，`joinApprovalRequired = true`  |
| `EMGroupStylePublicOpenJoin`                | `isPublic = true`，`joinApprovalRequired = false` |

### `EMGroupOptions` 与 `EMGroupConfigs` 对照

| 4.x `EMGroupOptions`（已删除） | 5.0.0 `EMGroupConfigs`            |
| :---------------- | :----- |
| `EMGroupStyle style`           | `boolean isPublic`、`joinApprovalRequired` 和 `allowInvites`，默认值均为 `false` |
| `int maxUsers = 200`           | `int maxUsers = 200`，保持不变                               |
| `boolean inviteNeedConfirm`    | 保持不变                                                     |
| `String extField`              | 保持不变                                                     |

### 相关 API 变化

| 4.x API      | 5.0.0 API 或适配方式    |
| :---------------- | :----- |
| `createGroup(groupName, desc, allMembers, reason, EMGroupOptions)` | 该重载已删除。使用 `createGroup(String groupName, String avatar, String desc, String[] allMembers, String reason, EMGroupConfigs configs)` 或对应的 `asyncCreateGroup(...)`。 |
| `EMGroup#isMemberOnly()`                                     | `EMGroup#isJoinApprovalRequired()`。该方法仅表示公开群是否需要审批入群。 |
| 无                                                           | `updateGroupConfigs(String groupId, EnumSet<EMGroupConfigsType>, EMGroupConfigs)` 和 `asyncUpdateGroupConfigs(...)`：建群后按指定配置类型更新群组属性。 |
| 无                                                           | `EMGroupManager.EMGroupConfigsType`：包含 `IS_PUBLIC`、`JOIN_APPROVAL_REQUIRED`、`ALLOW_INVITES`、`MAX_USERS`、`INVITE_NEED_CONFIRM` 和 `EXT`。 |

`EMGroup#isPublic()` 和 `EMGroup#isMemberAllowToInvite()` 的方法签名保持不变，调用方无需修改；SDK 内部会根据 `EMGroupConfigs` 中的对应字段返回结果。

## 设备管理与鉴权

随密码登录下线，"用户 ID + 密码"鉴权接口一并移除，设备管理保留 token 版本：

| 4.x API        | 5.0.0 替代方式          | 接口说明                |
| :---------------- | :----- | :------------- |
| `kickDevice(String username, String password, String resource)` | `kickDeviceWithToken(String username, String token, String resource)` | 踢出指定登录设备。  |
| `kickAllDevices(String username, String password)`           | `kickAllDevicesWithToken(String username, String token)`     | 踢出指定账号的所有登录设备。  |
| `getLoggedInDevicesFromServer(String username, String password)` | 无直接替代。应用需改用基于 Token 的设备查询接口。            | 使用用户名和密码查询账号的登录设备，Android SDK v5 已移除。  |
| `getLoggedInDevicesFromServerWithToken(String, String)`（同步） | `fetchLoggedInDevicesFromServerWithToken(String, String, EMValueCallBack<List<EMDeviceInfo>>)`（异步） | 使用 Token 查询账号的登录设备。Android SDK v5 推荐使用异步接口获取结果。 |

## 其他删除的 API

### 无客户端替代

| 所属类   | 删除的 API      | 接口说明   | 迁移建议|
| :---------- | :----------| :-----| :--------------|
| `EMClient`          | `createAccount(...)`                                         | 注册 IM 账号。                 | 通过服务端 REST API 完成注册。                               |
| `EMClient`          | `statisticsManager()`、`EMStatisticsManager` 及相关统计模型  | SDK 消息统计能力。             | 由业务侧自行采集和统计。                                     |
| `EMChatManager`     | `reportMessage(...)`、`asyncReportMessage(...)`              | 举报消息。                     | 将举报信息提交至业务服务器。                                 |
| `EMChatManager`     | `updateParticipant(String from, String changeTo)`            | 更新历史参与者信息。           | 删除相关调用。                                               |
| `EMGroupManager`    | `getPublicGroupsFromServer(...)`、`asyncGetPublicGroupsFromServer(...)` | 获取服务端公开群组列表。       | 由业务服务维护群组目录。                                     |
| `EMGroupManager`    | `asyncUploadGroupSharedFile(...)` 的已移除重载               | 异步上传群共享文件。           | 删除该重载的调用；使用保留的群文件上传接口。                 |
| `EMChatRoomManager` | `createChatRoom(...)`、`asyncCreateChatRoom(...)`            | 创建聊天室。                   | 通过服务端 REST API 创建聊天室。                             |
| `EMChatRoomManager` | `destroyChatRoom(...)`、`asyncDestroyChatRoom(...)`          | 解散聊天室。                   | 通过服务端 REST API 解散聊天室。                             |
| `EMChatRoomManager` | `getAllChatRooms()`                                          | 获取全部聊天室。               | 聊天室为非持久化资源，按需调用 `fetchChatRoomFromServer`，不建议缓存全量聊天室列表。 |
| `EMOptions`         | `getReportServer()`、`setReportServer(String)`               | 获取或设置数据上报服务器地址。 | 删除相关配置；私有化部署需求由服务端处理。                   |

### 有替代方式的 API

| 4.x API      | 5.0.0 API      | 接口说明      | 迁移说明            |
| :---------- | :----------| :-----| :--------------|
| `EMMessage#createTxtSendMessage(...)`（已废弃）              | `createTextSendMessage(String content, String toChatUsername)` | 创建文本消息。           | 使用新方法名。                                               |
| `EMMessage#getUserName()`                                    | `getFrom()`                                                  | 获取消息发送方 ID。      | 使用 `getFrom()`。                                           |
| `EMMessage#getRecaller()`                                    | `EMRecallMessageInfo#getRecallBy()`                          | 获取撤回消息的操作者。   | 在 `onMessageRecalledWithExt` 回调中获取 `EMRecallMessageInfo`。 |
| `EMChatManager#asyncModifyMessage(msgId, body, callBack)`（三参数） | `asyncModifyMessage(msgId, body, Map<String, Object> ext, callBack)` | 修改本地和服务端消息。   | 使用四参数方法，并按消息类型传入要修改的消息体或扩展字段。   |
| 部分旧版 `EMConversation#searchMsgFromDB(...)` 调用方式      | 按场景使用同步 `searchMsgFromDB(...)` 或异步 `asyncSearchMsgFromDB(...)` | 从本地数据库搜索消息。   | Android SDK v5 未统一移除所有同步搜索接口；同步调用不得在主线程执行。 |
| `EMChatManager#fetchHistoryMessages(...)` 旧重载、`asyncFetchHistoryMessage(...)` 旧重载 | `asyncFetchHistoryMessages(String conversationId, EMConversationType, int pageSize, String cursor, EMFetchMessageOption, EMValueCallBack<EMCursorResult<EMMessage>>)` | 分页获取服务端历史消息。 | 使用新的异步分页接口。                                       |
| `EMGroupManager#getGroupFromServer(String, boolean fetchMembers)` | `getGroupFromServer(String)`                                 | 获取群组详情。           | 群成员通过独立的成员接口分页获取。                           |
| `EMChatRoomManager#fetchChatRoomFromServer(String, boolean fetchMembers)` | `fetchChatRoomFromServer(String)`                            | 获取聊天室详情。         | 聊天室成员通过独立的成员接口获取。                           |
| `EMChatRoomManager#removeChatRoomListener(...)`              | `removeChatRoomChangeListener(...)`                          | 移除聊天室事件监听器。   | 与 `addChatRoomChangeListener(...)` 配套使用。               |
| `EMOptions#setAreaCode(int)` 及旧版 `AreaCode` 整型常量      | `setAreaCode(AreaCode)`                                      | 设置服务区域。           | `AreaCode` 改为枚举，包括 `CN(1)`、`NA(2)`、`EU(4)`、`AS(8)`、`JP(16)`、`IN(32)` 和 `GLOB(-1)`；需要整型值时调用 `getValue()`。`getAreaCode()` 仍返回 `int`。 |

## 主要新增 API

| 所属类     | 新增 API | 接口说明    |
| :---------------- | :----- | :------- |
| `EMChatManager`  | `asyncDeleteConversations(List<String> conversationIds, boolean deleteMessages, EMCallBack)` | 批量删除本地会话，并按 `deleteMessages` 决定是否同时删除本地消息。 |
| `EMConversation` | `getConversationName()`、`getConversationAvatar()`           | 获取会话显示名称和头像。单聊返回对方用户信息，群聊返回群组信息；相关数据尚未同步时可能返回空字符串。 |
| `EMGroup`        | `getUsers()`                                                 | 获取群主、管理员和普通成员的用户 ID 列表。该列表按角色合并，可能包含重复的用户 ID。 |

## 监听器回调变化汇总

实现类即使未使用 `@Override`，旧回调被删除后也可能不会立即产生编译错误，但运行时将无法收到对应事件。升级时应逐项检查监听器实现。

| 监听器   | 4.x 回调      | 5.0.0 回调    | 回调说明   |
| :----- | :-------| :-----| :-------|
| `EMConnectionListener`     | `onLogout(int)`、`onLogout(int, String)`                     | `onLogout(int errorCode, EMLoginExtensionInfo info)`         | 账号登出通知。                                 |
| `EMConnectionListener`     | 无                                                           | `onDataSyncStart(EMDataSyncType)`、`onDataSyncFinish(EMDataSyncType, int)`、`onDatabaseOpened(String)` | 通知数据同步开始、结束以及本地数据库打开完成。 |
| `EMMessageListener`        | `onMessageRecalled(List<EMMessage>)`                         | `onMessageRecalledWithExt(List<EMRecallMessageInfo>)`        | 接收消息撤回通知，并获取撤回扩展信息。         |
| `EMMessageListener`        | `onMessageRead(...)`、`onGroupMessageRead(...)`              | `onMessageReadReceipts(List<EMMessageReadReceipt>)`          | 统一接收单聊和群聊消息已读回执。               |
| `EMMessageListener`        | `onReadAckForGroupMessageUpdated()`                          | `onReadReceiptForGroupMessageUpdated()`                      | 群聊消息已读回执状态变化通知。                 |
| `EMConversationListener`   | `onConversationRead(String, String)`                         | `onConversationUpdate()`                                     | 会话列表发生变化时触发。                       |
| `EMContactListener`        | `onContactSyncStart()`、`onContactSyncFinishWithError(int, String)` | `EMConnectionListener#onDataSyncStart/onDataSyncFinish(EMDataSyncType.CONTACTS, ...)` | 监听好友数据同步状态。                       |
| `EMGroupChangeListener`    | `onMemberJoined(String, String)`                             | `onMembersJoined(String, List<String>)`                      | 一次通知多个成员加入群组。                     |
| `EMGroupChangeListener`    | `onMemberExited(String, String)`                             | `onMembersExited(String, List<String>)`                      | 一次通知多个成员退出群组。                     |
| `EMGroupChangeListener`    | `onRequestToJoinDeclined(groupId, groupName, decliner, reason)` | `onRequestToJoinDeclined(..., String applicant)`             | 增加申请者 ID 参数。                           |
| `EMChatRoomChangeListener` | `onMemberJoined(String roomId, String participant)`          | `onMemberJoined(String roomId, String participant, String ext)` | 增加事件扩展信息。                             |
| `EMChatRoomChangeListener` | `onMuteListAdded(String, List<String>, long expireTime)`     | `onMuteListAdded(String, Map<String, Long> muteInfo)`        | 使用用户 ID 与禁言截止时间的映射。             |

## 行为变化

以下变化可能不会触发编译错误，但会影响业务逻辑：

1. **未读消息总数的统计范围发生变化**
   `getUnreadMessageCount` 获取本地单聊和群聊会话的未读消息总数。该接口的统计范围如下：
    - 不统计聊天室会话。
    - 不统计消息话题（Thread）的未读消息数。
    - 不统计推送通知方式为 `EMPushRemindType.MENTION_ONLY` 或 `EMPushRemindType.NONE` 的会话。这些会话即使存在未读消息，也不纳入统计。
    - 仅统计推送通知方式为 `EMPushRemindType.ALL` 的单聊和群聊会话。

    如果业务需要统计所有会话的未读数，应遍历 `getAllConversations()`，再累加各会话的 `getUnreadMsgCount()`。
   
2. **清除未读数不会发送消息已读回执**
   
   `EMChatManager#asyncClearConversationUnreadMessageCount` 只清除指定会话的本地未读数，并将清除结果同步至当前账号的其他设备，不会向消息发送方发送已读回执。  
   如果业务需要通知对方消息已读，需额外调用 `EMChatManager#asyncSendMessageReadReceipts`。
   
3. **初始化后不再自动登录**
   
   `EMClient#init` 完成后，SDK 不会自动登录。应用需要在适当时机主动调用 `EMClient#loginWithToken` 完成登录。
   
4. **查询消息不再自动修改已读状态**
   
   `EMConversation#getMessage(String)` 仅用于查询指定消息，不会因为查询操作自动将消息标记为已读。旧版 `getMessage(String, boolean markAsRead)` 中“查询消息时同步修改已读状态”的行为已移除。
   
5. **前后台状态检测机制发生变化**
   
   SDK 使用 AndroidX `ProcessLifecycleOwner` 监听应用进程的前后台状态，不再使用 `ActivityLifecycleCallbacks`。当前 SDK 已依赖 `androidx.lifecycle:lifecycle-process`，集成时应确保该依赖未被排除或冲突。
   
6. **`EMChatService` 的旧保活逻辑已移除**
   
   `EMChatService#onDestroy()` 不再根据 `isLoggedInBefore()` 判断登录状态，也不再执行 Service 自重启逻辑。应用不应再依赖该 Service 实现登录保活。
   
7. **推送 Token 上传判断逻辑发生变化**

   推送 Token 发生变化或设备重新登录时，SDK 会根据当前登录状态重新上传 Token。应用无需自行判断 Token 是否需要上传，也不应依赖旧版自动登录相关逻辑。因此，不能简单地将 Token 是否上传理解为仅由 `!isLoggedIn()` 决定。
   
8. **新增多设备未读数同步事件**
   
   当前账号在其他设备清除会话未读数时，本端会通过 `EMMultiDeviceListener#onConversationEvent` 收到对应事件。收到事件后，应用应重新调用 `EMChatManager#getAllConversations()` 获取最新会话数据并刷新 UI。
   
   - `CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 65`：其他设备清除了指定会话的未读数。
   - `ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 66`：其他设备清除了所有会话的未读数。
