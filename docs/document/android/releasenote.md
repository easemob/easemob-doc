## v5.0.0 Dev 2026-7-28（开发版）

#### 新增功能

**数据同步与本地数据访问**

提供统一的数据同步配置和状态回调，并支持在数据库打开后提前读取本地数据。

- 新增独立的数据同步通道。通过 `EMOptions#setDataSyncType(EnumSet<EMDataSyncType>)` 配置登录后自动同步的会话、联系人和已加入群组数据。
- `EMDataSyncType` 支持 `CONVERSATIONS`、`CONTACTS`、`JOINED_GROUPS` 和 `NONE`，可按业务需要组合配置。
- 通过 `EMConnectionListener#onDataSyncStart(EMDataSyncType)` 和 `onDataSyncFinish(EMDataSyncType, int)` 获取各类数据的同步状态。
- 数据同步连接空闲 60 秒后自动断开；停止接收消息时，SDK 会同时释放同步连接。
- 支持在登录完成前访问本地数据。应用可通过 `EMConnectionListener#onDatabaseOpened(String)` 感知数据库打开完成，并通过 `EMClient#isDatabaseOpened()` 查询数据库状态。

**服务端列表同步调整**

联系人、会话和已加入群组改为自动同步到本地，业务侧统一从本地接口读取。

各类数据的删除 API 变更如下：

| 数据类别 | 删除的 API | 替代 API 或使用方式 |
|---|---|---|
| 联系人 | - `EMContactManager#getAllContactsFromServer()`<br>- `asyncGetAllContactsFromServer(...)`<br>- `asyncFetchAllContactsFromServer(...)` | - `getContactsFromLocal()`<br>- `fetchContactFromLocal(...)`<br>- `asyncFetchAllContactsFromLocal(...)` |
| 会话 | - `EMChatManager#asyncFetchConversationsFromServer(...)`<br>- `asyncFetchPinnedConversationsFromServer(...)`<br>- `asyncGetConversationsFromServerWithCursor(...)` | - `getAllConversations()`<br>- `getAllConversationsBySort()` |
| 已加入群组 | - `EMGroupManager#getJoinedGroupsFromServer(...)`<br>- `asyncGetJoinedGroupsFromServer(...)` | `getAllGroups()` |
| 联系人同步回调 | - `EMContactListener#onContactSyncStart()`<br>- `EMContactListener#onContactSyncFinishWithError(...)` | 使用 `EMConnectionListener#onDataSyncStart(...)` 和 `onDataSyncFinish(...)`，并通过 `EMDataSyncType.CONTACTS` 识别联系人同步事件 |

各类数据的整为 SDK 内部的 API 如下：

| 数据类别 | 调整为 SDK 内部的接口 | 替代 API 或使用方式 |
|---|---|---|
| 加载本地会话 | `EMChatManager#loadAllConversations()` | 在 `onDataSyncFinish(...)` 回调后调用 `getAllConversations()`，读取本地会话并刷新界面 |
| 加载本地群组 | `EMGroupManager#loadAllGroups()` | 在 `onDataSyncFinish(...)` 回调后调用 `getAllGroups()`，读取本地群组并刷新界面 |

**群组配置模型重构**

群组配置拆分为多个独立属性，并支持创建群组后按需更新指定配置。

- 使用 `EMGroupConfigs` 取代 `EMGroupOptions` 和 `EMGroupStyle`，通过 `isPublic`、`joinApprovalRequired` 和 `allowInvites` 分别描述群组公开性、入群审批和成员邀请权限。
- `createGroup(...)` 和 `asyncCreateGroup(...)` 的配置参数改为 `EMGroupConfigs`；`EMGroup#isMemberOnly()` 更名为 `isJoinApprovalRequired()`。
- 新增 `EMGroupManager#updateGroupConfigs(...)` 和 `asyncUpdateGroupConfigs(...)`，可通过 `EMGroupConfigsType` 按需更新指定群组配置。

**消息已读回执升级**

已读回执和未读数管理统一为批量、异步的处理方式，覆盖单聊和群聊场景。

- 新增 `EMChatManager#asyncSendMessageReadReceipts(...)`、`asyncGetGroupMessageReadReceipts(...)` 和 `asyncFetchGroupMessageReadReceipts(...)`，统一支持单聊和群聊消息已读回执。
- 通过 `EMMessageListener#onMessageReadReceipts(...)` 统一接收单聊和群聊已读回执。
- 新增 `asyncClearConversationUnreadMessageCount(...)` 和 `asyncClearAllConversationUnreadMessageCount(...)`，用于异步清除未读数并同步到其他设备；清除未读数不会向对方发送消息已读回执。
- 原有的单条消息回执、会话回执和全局回执开关已调整为批量回执和未读数清理接口；是否需要已读回执改为通过 `EMMessage#setIsNeedReadReceipt(true)` 为每条消息单独设置。
- `EMGroupReadAck` 更名为 `EMGroupReadReceipt`，并新增 `EMMessageReadReceipt`。

**会话与设备管理**

补充批量删除会话、Token 设备查询和会话展示信息等常用管理能力。

- 新增 `EMChatManager#asyncDeleteConversations(...)`，支持批量删除会话，并可选择是否同时删除消息。
- 新增 `EMClient#fetchLoggedInDevicesFromServerWithToken(...)`，支持通过 Token 异步获取已登录设备列表。
- 新增 `EMConversation#getConversationName()` 和 `getConversationAvatar()` ，用于获取会话的显示名称和头像。单聊返回对方的昵称和头像，群聊返回群组名称和群组头像；相关信息未同步时可能返回空字符串。
- 新增 `EMGroup#getUsers()`：用于从本地群组对象获取成员，也就是说，如已获取 `EMGroup` 对象，可调用 `EMGroup#getUsers()` 获取该对象中包含的全部成员用户 ID，包括群主、管理员和普通成员。

#### 优化

**登录、鉴权与 API 整理**

- `EMOptions.AreaCode` 由整型常量类改为枚举，`EMOptions#setAreaCode(int)` 调整为 `setAreaCode(AreaCode)`；原 `AREA_CODE_*` 常量改为 `CN`、`NA`、`EU`、`AS`、`JP`、`IN` 和 `GLOB`。
- 移除 `EMOptions#setAutoLogin(...)`、`getAutoLogin()` 和 `EMClient#isLoggedInBefore()`，改为通过 `loginWithToken(...)` 显式登录。
- 联系人自动同步开关并入 `EMOptions#setDataSyncType(...)`。
- 登录和设备管理统一使用 Token 鉴权，移除密码登录、密码换取 Token 及密码鉴权设备管理接口。

**低频与历史 API 清理**

- 移除消息举报 `reportMessage(...)`、`asyncReportMessage(...)`，改由业务服务器处理。
- 移除客户端注册、公开群列表、聊天室创建和销毁、群共享文件上传、消息统计等低频 API。
- 移除 `EMClient#check(...)`、`EMCheckType`、上报服务器配置和全量聊天室列表等历史接口。
- 统一 Token 登录、消息撤回、退出登录、群组成员和聊天室成员变更等 API 的命名与回调签名。
- 历史消息获取、消息搜索以及群组和聊天室成员获取统一使用推荐的异步或分页接口。

**平台与性能**

- 迁移至 AndroidX，并使用 `ProcessLifecycleOwner` 监听应用前后台状态。
- 优化本地数据库性能：复用批量消息写入语句、减少未读数持久化次数、优化消息查询，并增加不区分会话 ID 大小写的查询索引。
- 调整 `EMChatManager#getUnreadMessageCount()` 的统计规则，不再统计推送通知方式 `EMPushRemindType` 不是 `ALL` 的会话。
- 优化附件分片上传的超时策略，减少日志记录过程中的非必要序列化。

#### 修复

**登录与账号状态**

- 修复账号被服务端强制断开后，本地登录状态可能未及时清理的问题。
- 修复切换账号登录时，Android 层可能复用上一账号数据库缓存的问题。

**消息与群组**

- 修复修改消息时复用请求标识可能导致响应匹配异常的问题。
- 修复部分场景下群名片无法设置为空字符串的问题。

**附件、网络与并发**

- 修复关闭附件 MD5 校验后，上传附件仍可能执行 MD5 预校验的问题。
- 修复网络传输、任务队列和数据库缓存中的若干并发安全问题。
