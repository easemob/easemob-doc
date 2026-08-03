## v5.0.0 Dev 2026-7-28（开发版）

#### 新增功能

- 新增独立的数据同步通道。通过 `EMOptions#setDataSyncType(EnumSet<EMDataSyncType>)` 配置登录后自动同步的会话列表、联系人和已加入群组；通过 `EMConnectionListener#onDataSyncStart(EMDataSyncType)` 和 `onDataSyncFinish(EMDataSyncType, int)` 获取各类数据的同步开始与完成状态。`EMDataSyncType` 支持 `CONVERSATIONS`、`CONTACTS`、`JOINED_GROUPS` 和 `NONE`。数据同步连接空闲 60 秒后自动断开，停止接收消息时同步释放连接。
- 数据同步替代了主动拉取服务端列表的方式，因此移除以下 API：
  - 联系人：`EMContactManager#getAllContactsFromServer()`、`asyncGetAllContactsFromServer(...)`、`asyncFetchAllContactsFromServer(...)`。改用 `getContactsFromLocal()`、`fetchContactFromLocal(...)` 或 `asyncFetchAllContactsFromLocal(...)`。
  - 会话：`EMChatManager#asyncFetchConversationsFromServer(...)`、`asyncFetchPinnedConversationsFromServer(...)`、`asyncGetConversationsFromServerWithCursor(...)`。改用 `getAllConversations()` 或 `getAllConversationsBySort()`。
  - 已加入群组：`EMGroupManager#getJoinedGroupsFromServer(...)`、`asyncGetJoinedGroupsFromServer(...)`。改用 `getAllGroups()`。
  - `EMChatManager#loadAllConversations()` 和 `EMGroupManager#loadAllGroups()` 调整为 SDK 内部接口。应用读取本地数据后，通过 `onDataSyncFinish(...)` 刷新界面。
- 联系人独立同步回调 `EMContactListener#onContactSyncStart()` 和 `onContactSyncFinishWithError(...)` 移除，统一迁移到 `EMConnectionListener#onDataSyncStart(...)` 和 `onDataSyncFinish(...)`，并通过 `EMDataSyncType.CONTACTS` 区分联系人同步事件。
- 支持在登录完成前访问本地数据。通过 `EMConnectionListener#onDatabaseOpened(String)` 获取数据库打开完成回调，通过 `EMClient#isDatabaseOpened()` 查询数据库状态，便于应用提前加载本地缓存数据，缩短首屏等待时间。
- 重构群组配置模型。使用 `EMGroupConfigs` 取代 `EMGroupOptions` 和 `EMGroupStyle`，通过 `isPublic`、`joinApprovalRequired` 和 `allowInvites` 分别描述群组公开性、入群审批和成员邀请权限；`createGroup(...)` 和 `asyncCreateGroup(...)` 的配置参数同步改为 `EMGroupConfigs`，`EMGroup#isMemberOnly()` 更名为 `isJoinApprovalRequired()`。
- 新增 `EMGroupManager#updateGroupConfigs(...)` 和 `asyncUpdateGroupConfigs(...)`，可通过 `EMGroupConfigsType` 按需更新指定群组配置。
- 升级消息已读回执能力。新增 `EMChatManager#asyncSendMessageReadReceipts(...)`、`asyncGetGroupMessageReadReceipts(...)` 和 `asyncFetchGroupMessageReadReceipts(...)`，并通过 `EMMessageListener#onMessageReadReceipts(...)` 统一接收单聊和群聊的已读回执。
- 新增 `EMChatManager#asyncClearConversationUnreadMessageCount(...)` 和 `asyncClearAllConversationUnreadMessageCount(...)`，用于异步清除未读数并通过多设备事件同步。清除未读数不再向对方发送消息已读回执。
- 已读回执相关 API 同步调整：原逐条消息回执、会话回执和全局回执开关移除，改用批量回执、未读数清理接口和逐消息 `EMMessage#setIsNeedReadReceipt(true)`；`EMGroupReadAck` 更名为 `EMGroupReadReceipt`，并新增 `EMMessageReadReceipt`。
- 新增 `EMChatManager#asyncDeleteConversations(...)`，支持批量删除会话，并可选择是否同时删除消息。
- 新增 `EMClient#fetchLoggedInDevicesFromServerWithToken(...)`，支持通过 Token 异步获取已登录设备列表。
- 新增 `EMConversation#getConversationName()`、`getConversationAvatar()` 和 `EMGroup#getUsers()`。

#### 优化

- `EMOptions.AreaCode` 由整型常量类改为枚举，`EMOptions#setAreaCode(int)` 调整为 `setAreaCode(AreaCode)`。原 `AREA_CODE_*` 常量改为 `CN`、`NA`、`EU`、`AS`、`JP`、`IN`、`GLOB` 枚举值。
- 移除 `EMOptions#setAutoLogin(...)`、`getAutoLogin()` 和 `EMClient#isLoggedInBefore()`，改为通过 `loginWithToken(...)` 显式登录；联系人自动同步开关统一并入 `setDataSyncType(...)`。
- 登录和设备管理统一使用 Token 鉴权。移除密码登录、密码换取 Token 及密码鉴权设备管理接口。
- 移除消息举报 `reportMessage(...)`、`asyncReportMessage(...)`，改由应用服务器处理。
- 移除客户端注册、公开群列表、聊天室创建/销毁、群共享文件上传、消息统计等低频 API，并清理其他已废弃接口。
- 统一部分 API 命名和回调签名，包括 Token 登录、消息撤回、退出登录、群组和聊天室成员变更等接口。
- 移除 `EMClient#check(...)`、`EMCheckType`、上报服务器配置、全量聊天室列表等历史接口；历史消息获取、消息搜索和群/聊天室成员获取统一使用推荐的异步或分页接口。
- 迁移至 AndroidX，并使用 `LifecycleOwner` 监听应用前后台状态。
- 优化本地数据库性能，复用批量消息写入语句、减少未读数持久化次数、优化消息查询，并增加会话 ID 不区分大小写的查询索引。
- 调整 `EMChatManager#getUnreadMessageCount()` 的统计规则，不再统计免打扰等提醒类型非 `ALL` 的会话。
- 优化附件分片上传的超时策略，并减少日志记录过程中的非必要序列化。

#### 修复

- 修复账号被服务端强制断开后，本地登录状态可能未及时清理的问题。
- 修复切换账号登录时，Android 层可能复用上一账号数据库缓存的问题。
- 修复修改消息时复用请求标识可能导致响应匹配异常的问题。
- 修复部分场景下群名片无法设置为空字符串的问题。
- 修复关闭附件 MD5 校验后，上传附件仍可能执行 MD5 预校验的问题。
- 修复网络传输、任务队列和数据库缓存中的若干并发安全问题。
