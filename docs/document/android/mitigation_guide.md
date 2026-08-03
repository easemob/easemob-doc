# 环信 IM SDK 4.x → 5.0 迁移文档（Android）

---

## 一、升级总览

5.0 是一次**源码不兼容**的大版本升级，围绕四个主题：

1. **数据同步通道**：登录后自动同步会话/联系人/已加入群组并落本地库，替代原先一批"主动从服务器拉取"的 API。
2. **已读回执体系重构**：逐条 ack → 批量回执；"清未读数"与"发已读回执"彻底解耦；单聊/群聊回执回调统一。
3. **群组配置模型重构**：`EMGroupStyle` 单枚举拆为 `isPublic / joinApprovalRequired / allowInvites` 三布尔，支持建群后按位更新。
4. **历史 API 精简**：删除长期 `@Deprecated` 的接口与边缘能力（注册、举报、统计等下沉到服务端 REST），密码登录下线、仅保留 token 登录。

**集成要求**：5.0 已全面迁移 AndroidX（公开 API 注解由 `android.support.*` 变为 `androidx.*`），**宿主 App 必须开启 AndroidX**（`android.useAndroidX=true`），使用 support 库的工程不兼容。

---

## 二、初始化与登录

### 2.1 自动登录移除，冷启动必须显式登录

4.x 中 `EMClient.init()` 末尾存在 `if (options.getAutoLogin() && isLoggedInBefore()) { ...自动登录... }` 逻辑；5.0 该逻辑整体删除，同时删除：

| 删除的 API | 替代方式 |
|---|---|
| `EMOptions.setAutoLogin(boolean)` / `getAutoLogin()` | 无替代；App 启动时显式 `loginWithToken(...)` |
| `EMClient.isLoggedInBefore()` | `isLoggedIn()`（当前登录态）/ `isConnected()`（连接状态）/ `isDatabaseOpened()`（本地库就绪） |

### 2.2 密码登录下线，仅保留 token 登录

| 删除的 API | 替代方式 |
|---|---|
| `login(String id, String password, EMCallBack)`（4.x 已 @Deprecated） | `loginWithToken(String username, String token, EMCallBack)` |
| `loginWithAgoraToken(String, String, EMCallBack)`（@Deprecated） | 同上 `loginWithToken` |
| `renewToken(String newAgoraToken)`（@Deprecated） | `renewToken(String newToken, EMCallBack)` |
| `getUserTokenFromServer(String, String, EMValueCallBack<String>)` | 无客户端替代，token 改由 App Server 下发 |
| `createAccount(String username, String password)` | 无客户端替代，改用服务端 REST 注册 |
| `check(String, String, CheckResultListener)` 及 `EMCheckType` 整个类 | 无替代；连通性诊断依赖正常登录流程与连接回调 |

### 2.3 登录与数据库打开解耦（新能力）

登录完成前即可读本地数据，加快冷启动首屏：

- `EMConnectionListener.onDatabaseOpened(String username)`：本地数据库打开完成回调。
- `EMClient.isDatabaseOpened()`：随时查询数据库是否就绪

---

## 三、数据同步机制（新）与被替代的拉取 API

### 3.1 新增 API

| 所在类 | 新增 API | 用途 |
|---|---|---|
| `EMOptions` | `enum EMDataSyncType { NONE(0), CONVERSATIONS(1<<0), CONTACTS(1<<1), JOINED_GROUPS(1<<2) }` | 可组合的数据类型位 |
| `EMOptions` | `setDataSyncType(EnumSet<EMDataSyncType>)` / `getDataSyncType()` | 配置登录后自动同步哪些数据 |
| `EMConnectionListener` | `onDataSyncStart(EMDataSyncType type)` / `onDataSyncFinish(EMDataSyncType type, int errorCode)` | 统一的同步开始/结束回调 |

**迁移要点（最容易踩的坑）**：`EMOptions` 的 `dataSyncType` **默认值为 `NONE`**（代码确认）——不显式配置时登录后不会自动同步任何数据，`getAllConversations()` / `getAllGroups()` / 本地联系人均可能为空。典型配置：

```java
EMOptions options = new EMOptions();
options.setAppKey("your-appkey");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS,
        EMOptions.EMDataSyncType.CONTACTS,
        EMOptions.EMDataSyncType.JOINED_GROUPS));
EMClient.getInstance().init(context, options);
```

### 3.2 被数据同步替代的"从服务器拉取"API

原先"主动 fetch + 回调刷新"的写法，统一改为"**配置同步范围 → 登录后自动同步 → 读本地数据 → `onDataSyncFinish` 刷新 UI**"：

| 所在类 | 删除的 API | 5.0 推荐方式 |
|---|---|---|
| `EMChatManager` | `fetchConversationsFromServer()` 及全部 4 个 `asyncFetchConversationsFromServer(...)` 重载 | `getAllConversations()` / `getAllConversationsBySort()`（本地）+ `onDataSyncFinish(CONVERSATIONS, ...)` |
| `EMChatManager` | `asyncFetchPinnedConversationsFromServer(...)` | 置顶随会话同步落地，读本地会话置顶状态 |
| `EMChatManager` | `asyncGetConversationsFromServerWithCursor(...)` | 本地查询 |
| `EMGroupManager` | `getJoinedGroupsFromServer()` / `getJoinedGroupsFromServer(pageIndex, pageSize, ...)` 及两个 async 版本 | `getAllGroups()`（本地）+ `onDataSyncFinish(JOINED_GROUPS, ...)` |
| `EMContactManager` | `getAllContactsFromServer()`、`asyncGetAllContactsFromServer(...)`、`asyncFetchAllContactsFromServer(...)`（含分页重载） | `getContactsFromLocal()` / `fetchContactFromLocal(String)` / `asyncFetchAllContactsFromLocal(...)` + `onDataSyncFinish(CONTACTS, ...)`。**5.0 已无任何从服务器拉取联系人列表的入口** |
| `EMChatManager` | `loadAllConversations()` | 降为包私有；直接 `getAllConversations()` |
| `EMGroupManager` | `loadAllGroups()` | 降为包私有；直接 `getAllGroups()` |
| `EMOptions` | `setEnableAutoSyncContacts(boolean)` / `isEnableAutoSyncContacts()` | 并入 `setDataSyncType(...)` 的 `CONTACTS` 位 |

配套地，`EMContactListener.onContactSyncStart()` / `onContactSyncFinishWithError(int, String)` 被删除，迁移到 `EMConnectionListener.onDataSyncStart/onDataSyncFinish(EMDataSyncType.CONTACTS, ...)`（见第八节）。

---

## 四、已读回执体系重构

回执机制从"逐条 ack + 全局开关"升级为"**批量回执 + 未读数清理**"，旧 API 无兼容别名，属 break 式变更。

### 4.1 发送回执 / 清除未读

| 删除的 API | 5.0 替代 | 说明 |
|---|---|---|
| `EMChatManager.ackMessageRead(String to, String messageId)` | `asyncSendMessageReadReceipts(List<EMMessage>, EMCallBack)` | 批量发送，单聊群聊统一 |
| `EMChatManager.ackGroupMessageRead(String to, String messageId, String ext)` | 同上 | **不再支持自定义 ack 扩展内容** |
| `EMChatManager.ackConversationRead(String conversationId)` | `asyncClearConversationUnreadMessageCount(String, EMCallBack)` | ⚠️ 语义变化：仅本地清零未读 + 同步多设备，**不再向对方发已读回执**；如需告知对方，另调 `asyncSendMessageReadReceipts` |
| `EMChatManager.markAllConversationsAsRead()` | `asyncClearAllConversationUnreadMessageCount(EMCallBack)` | 新增多设备同步 |
| `EMConversation.markMessageAsRead(String)` / `markAllMessagesAsRead()` | `EMChatManager.asyncClearConversationUnreadMessageCount(...)` | 消息已读态由 SDK 内部管理 |
| `EMConversation.getMessage(String, boolean markAsRead)` | `getMessage(String)` | 查询不再附带已读副作用 |
| `EMOptions.setRequireAck(boolean)` / `getRequireAck()` | 无全局开关 | 发送前逐消息 `message.setIsNeedReadReceipt(true)` |

`asyncSendMessageReadReceipts` 约束（javadoc 确认）：单批**须同一会话、最多 50 条**；消息的 `isNeedReadReceipt()` 需为 `true`；无需回执或已回执的消息自动跳过；按整个批次回调 `onSuccess/onError`；**不改变会话未读数**。

### 4.2 接收回执

| 4.x | 5.0 |
|---|---|
| `EMMessageListener.onMessageRead(List<EMMessage>)`（单聊） | 统一为 `onMessageReadReceipts(List<EMMessageReadReceipt>)` |
| `EMMessageListener.onGroupMessageRead(List<EMGroupReadAck>)`（群聊） | 同上 |
| `EMConversationListener.onConversationRead(String from, String to)` | 经 `onMessageReadReceipts` 下发；该接口现仅剩 `onConversationUpdate()` |
| `EMMessageListener.onReadAckForGroupMessageUpdated()` | 改名 `onReadReceiptForGroupMessageUpdated()`（仅改名） |

新数据类 `EMMessageReadReceipt`：`getMessageId()` / `getConversationId()` / `isPeerReceipt()`（单聊对方是否已发回执）/ `getReadCount()`（群聊已读人数）。

### 4.3 回执详情查询

| 4.x | 5.0 |
|---|---|
| `fetchGroupReadAcks(msgId, pageSize, startAckId)` / `asyncFetchGroupReadAcks(...)` | `asyncFetchGroupMessageReadReceipts(String msgId, int pageSize, String startAckId, EMValueCallBack<EMCursorResult<EMGroupReadReceipt>>)`（分页，pageSize 1–50） |
| —（新增） | `asyncGetGroupMessageReadReceipts(List<EMMessage>, EMValueCallBack<List<EMMessageReadReceipt>>)`：批量取群消息已读详情，须同一会话、最多 20 条 |

回执数据类替换：`EMGroupReadAck` → `EMGroupReadReceipt`。注意 **`getFrom()` 返回类型由 `String` 变为 `EMGroupMemberInfo`**，`getContent()` 移除（服务器不再下发 ack 扩展内容）；`getAckId()/getMsgId()/getCount()/getTimestamp()` 保留。

### 4.4 `EMMessage` 已读相关方法重命名

| 4.x（已删除） | 5.0 | 说明 |
|---|---|---|
| `isAcked()` / `setAcked(boolean)` | `isPeerRead()` / `setPeerRead(boolean)` | 对方是否已读；setter 包级可见 |
| `isUnread()` / `setUnread(boolean)` | `isRead()` / `setRead(boolean)` | ⚠️ **语义取反**；setter 包级可见 |
| `isNeedGroupAck()` / `setIsNeedGroupAck(boolean)` | `isNeedReadReceipt()` / `setIsNeedReadReceipt(boolean)` | 单聊群聊均生效，发送前设置 |
| `groupAckCount()` / `setGroupAckCount(int)` | `readReceiptCount()` / `setReadReceiptCount(int)` | 群消息已读人数；setter 包级可见 |

### 4.5 多设备事件

`EMMultiDeviceListener` 新增常量：其他设备清除未读数时本端收到通知。

- `CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 65`（清除指定会话）
- `ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 66`（清除所有会话）

---

## 五、群组配置模型重构

群可见性配置从单一 `style` 枚举拆为三个显式布尔字段，属**无兼容层**的源码不兼容重构。

### 5.1 `EMGroupStyle` → 三布尔字段对照

| 4.x `EMGroupManager.EMGroupStyle`（已删除） | 5.0 `EMGroupConfigs` 字段组合 |
|---|---|
| `EMGroupStylePrivateOnlyOwnerInvite` | `isPublic=false, allowInvites=false` |
| `EMGroupStylePrivateMemberCanInvite` | `isPublic=false, allowInvites=true` |
| `EMGroupStylePublicJoinNeedApproval` | `isPublic=true, joinApprovalRequired=true` |
| `EMGroupStylePublicOpenJoin` | `isPublic=true, joinApprovalRequired=false` |

### 5.2 `EMGroupOptions` → `EMGroupConfigs`

| 4.x `EMGroupOptions`（类已删除） | 5.0 `EMGroupConfigs` |
|---|---|
| `EMGroupStyle style` | `boolean isPublic` / `joinApprovalRequired` / `allowInvites`（默认均 `false`） |
| `int maxUsers = 200` | `int maxUsers = 200`（不变） |
| `boolean inviteNeedConfirm` | 不变 |
| `String extField` | 不变 |

### 5.3 相关方法变化

| 4.x | 5.0 |
|---|---|
| `createGroup(groupName, desc, allMembers, reason, EMGroupOptions)`（无头像重载） | 删除；仅保留 `createGroup(String groupName, String avatar, String desc, String[] allMembers, String reason, EMGroupConfigs configs)` / `asyncCreateGroup(...)` |
| `EMGroup.isMemberOnly()` | `EMGroup.isJoinApprovalRequired()`（改名且语义收窄：仅表示公开群入群需审批） |
| —（新增） | `updateGroupConfigs(String groupId, EnumSet<EMGroupConfigsType>, EMGroupConfigs)` / `asyncUpdateGroupConfigs(...)`：建群后按位更新指定属性，避免整体覆盖 |
| —（新增） | `EMGroupManager.EMGroupConfigsType`：`IS_PUBLIC / JOIN_APPROVAL_REQUIRED / ALLOW_INVITES / MAX_USERS / INVITE_NEED_CONFIRM / EXT`（位掩码） |

`EMGroup.isPublic()`、`isMemberAllowToInvite()` 签名不变（内部改为读取显式字段），调用方无需修改。

---

## 六、设备管理与鉴权

随密码登录下线，"用户名+密码"鉴权接口一并移除，设备管理保留 token 版本：

| 删除的 API | 替代 |
|---|---|
| `kickDevice(String username, String password, String resource)` | `kickDeviceWithToken(String username, String token, String resource)` |
| `kickAllDevices(String username, String password)` | `kickAllDevicesWithToken(String username, String token)` |
| `getLoggedInDevicesFromServer(String username, String password)` | 无替代 |
| `getLoggedInDevicesFromServerWithToken(String, String)`（同步） | `fetchLoggedInDevicesFromServerWithToken(String, String, EMValueCallBack<List<EMDeviceInfo>>)`（异步） |

---

## 七、其他删除的 API

### 7.1 无客户端替代（能力下沉服务端或直接下线）

| 所在类 | 删除的 API | 建议 |
|---|---|---|
| `EMClient` | `createAccount(...)` | 服务端 REST 注册 |
| `EMClient` | `statisticsManager()` 及 `EMStatisticsManager` 整个类（含 `EMMessageStatistics`、`EMSearchMessageDirect/Type`） | 统计需求业务侧自行采集 |
| `EMChatManager` | `reportMessage(...)` / `asyncReportMessage(...)` | 举报提交到业务服务器 |
| `EMChatManager` | `updateParticipant(String from, String changeTo)` | 历史遗留，删除调用 |
| `EMGroupManager` | `getPublicGroupsFromServer(...)` / `asyncGetPublicGroupsFromServer(...)` | 服务端自建群目录 |
| `EMGroupManager` | `asyncUploadGroupSharedFile(...)`（一个 async 重载） | 删除调用（同步 `uploadGroupSharedFile(groupId, filePath, callBack)` 保留） |
| `EMChatRoomManager` | `createChatRoom(...)` / `asyncCreateChatRoom(...)` | 服务端 REST 创建聊天室 |
| `EMChatRoomManager` | `destroyChatRoom(...)` / `asyncDestroyChatRoom(...)` | 服务端 REST 销毁 |
| `EMChatRoomManager` | `getAllChatRooms()` | 聊天室非持久化资源，按需 `fetchChatRoomFromServer`，不要缓存全量 |
| `EMOptions` | `getReportServer()` / `setReportServer(String)` | 删除配置；私有化需求走服务端 |

### 7.2 有替代的调整

| 4.x | 5.0 |
|---|---|
| `EMMessage.createTxtSendMessage(...)`（@Deprecated） | `createTextSendMessage(String content, String toChatUsername)` |
| `EMMessage.getUserName()` | `getFrom()` |
| `EMMessage.getRecaller()` | `EMRecallMessageInfo.getRecallBy()`（经 `onMessageRecalledWithExt` 下发） |
| `EMChatManager.asyncModifyMessage(msgId, body, callBack)`（3 参） | `asyncModifyMessage(msgId, body, Map ext, callBack)`（4 参） |
| `EMConversation.searchMsgFromDB(...)`（同步） | `asyncSearchMsgFromDB(...)`（异步） |
| `EMChatManager.fetchHistoryMessages(...)` 两个同步重载、`asyncFetchHistoryMessage(...)` 旧重载 | 仅保留 `asyncFetchHistoryMessages(String conversationId, EMConversationType, int pageSize, String cursor, EMFetchMessageOption, EMValueCallBack<EMCursorResult<EMMessage>>)` |
| `EMGroupManager.getGroupFromServer(String, boolean fetchMembers)` | `getGroupFromServer(String)`（成员用 `fetchGroupMembers` 分页） |
| `EMChatRoomManager.fetchChatRoomFromServer(String, boolean fetchMembers)` | `fetchChatRoomFromServer(String)` |
| `EMChatRoomManager.removeChatRoomListener(...)` | `removeChatRoomChangeListener(...)` |
| `EMOptions.setAreaCode(int)` 及 `AreaCode` 的 `AREA_CODE_*` int 常量 | `setAreaCode(AreaCode)`，`AreaCode` 改为枚举 `CN(1)/NA(2)/EU(4)/AS(8)/JP(16)/IN(32)/GLOB(-1)`，取整型用 `AreaCode.CN.getValue()`；`getAreaCode()` 仍返回 `int` |

### 7.3 主要新增 API（其他）

- `EMChatManager.asyncDeleteConversations(List<String> conversationIds, boolean deleteMessages, EMCallBack)`：批量删除会话。
- `EMConversation.getConversationName()` / `getConversationAvatar()`：会话显示名/头像（单聊为对方昵称头像、群聊为群名群头像；未同步时可能返回空字符串）。
- `EMGroup.getUsers()`：群主+管理员+成员合并列表（不去重）。

---

## 八、监听器回调变化汇总

⚠️ 删除的旧回调如果你的实现类**没写 `@Override`**，升级后不会报编译错误，但回调会静默丢失——务必逐个核对。

| 接口 | 4.x（已删除） | 5.0 |
|---|---|---|
| `EMConnectionListener` | `onLogout(int)`、`onLogout(int, String)`（均 @Deprecated） | `onLogout(int errorCode, EMLoginExtensionInfo info)` |
| `EMConnectionListener` | —（新增） | `onDataSyncStart(EMDataSyncType)` / `onDataSyncFinish(EMDataSyncType, int)` / `onDatabaseOpened(String)` |
| `EMMessageListener` | `onMessageRecalled(List<EMMessage>)`（@Deprecated） | `onMessageRecalledWithExt(List<EMRecallMessageInfo>)` |
| `EMMessageListener` | `onMessageRead(...)`、`onGroupMessageRead(...)` | `onMessageReadReceipts(List<EMMessageReadReceipt>)` |
| `EMMessageListener` | `onReadAckForGroupMessageUpdated()` | `onReadReceiptForGroupMessageUpdated()` |
| `EMConversationListener` | `onConversationRead(String, String)` | 仅剩 `onConversationUpdate()` |
| `EMContactListener` | `onContactSyncStart()`、`onContactSyncFinishWithError(int, String)` | `EMConnectionListener.onDataSyncStart/onDataSyncFinish(EMDataSyncType.CONTACTS, ...)` |
| `EMGroupChangeListener` | `onMemberJoined(String, String)`（@Deprecated） | `onMembersJoined(String, List<String>)` |
| `EMGroupChangeListener` | `onMemberExited(String, String)`（@Deprecated） | `onMembersExited(String, List<String>)` |
| `EMGroupChangeListener` | `onRequestToJoinDeclined(groupId, groupName, decliner, reason)`（@Deprecated） | `onRequestToJoinDeclined(..., String applicant)`（5 参） |
| `EMChatRoomChangeListener` | `onMemberJoined(String roomId, String participant)`（@Deprecated） | `onMemberJoined(String roomId, String participant, String ext)` |
| `EMChatRoomChangeListener` | `onMuteListAdded(String, List<String>, long expireTime)`（@Deprecated） | `onMuteListAdded(String, Map<String, Long> muteInfo)` |

---

## 九、行为变化（不报错但影响逻辑）

1. **`getUnreadMessageCount()` 统计口径变化**：原来只排除聊天室；5.0 起**仅统计推送提醒类型为 `EMPushRemindType.ALL` 的会话**，免打扰会话不再计入总未读数。业务如需全量未读，自行遍历 `getAllConversations()` 累加各会话 `unreadMessagesCount()`。
2. **清未读 ≠ 发回执**：`asyncClearConversationUnreadMessageCount` 只本地清零并同步多设备，不给对方发已读回执；4.x 的 `ackConversationRead` 会给对方发会话已读回执。需要"对方看到已读"的场景必须额外调 `asyncSendMessageReadReceipts`。
3. **初始化不再自动登录**：`EMClient.init()` 后 SDK 处于未登录态，必须显式 `loginWithToken(...)`。
4. **`EMConversation.getMessage(String)` 不再标记已读**（原 `getMessage(id, true)` 副作用取消）。
5. **前后台检测实现更换**：由 `ActivityLifecycleCallbacks` 改为 `ProcessLifecycleOwner`（androidx.lifecycle），这是新增 `lifecycle-process` 依赖的原因。
6. **`EMChatService` 保活逻辑删除**：`onDestroy` 中基于 `isLoggedInBefore()` 的自重启 Service 代码块移除。
7. **推送 token 上传条件简化**：随自动登录移除，`EMPushHelper` 的上传条件简化为 `!isLoggedIn()`。
8. 新增多设备事件 65/66（见 4.5），多端未读数一致性依赖该事件刷新 UI。
