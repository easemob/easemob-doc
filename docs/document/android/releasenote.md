## v5.0.0 Dev 2026-8-15（开发版）

本文重点说明功能和行为变化，具体的接口删除、重命名及替代方式请参见 [IM Android SDK 5.0.0.0 迁移指南](migration_guide.html)。

#### 重大变更

**数据同步与本地数据访问**

SDK 新增统一的数据同步机制。应用可配置登录后需要自动同步的数据类型，包括会话、联系人和已加入群组，并通过统一的同步状态回调监听同步进度。

数据库打开和服务端数据同步分别对应不同阶段，应用可按以下步骤处理：

1. **配置同步范围**：通过 `EMOptions#setDataSyncType(EnumSet<EMDataSyncType>)` 配置登录后自动同步的数据类型，包括会话、联系人、已加入群组和不同步数据等。多个数据类型可按位组合，建议在调用 `EMClient.getInstance().init(context, options)` 前显式设置。
2. **读取本地数据**：`EMConnectionListener#onDatabaseOpened(String username)` 回调表示当前账号的本地数据库已打开。收到该回调后即可读取本地数据，不必等待登录后同步完成，有助于加快冷启动时的首屏展示。
3. **监听服务端数据同步**：通过 `EMConnectionListener#onDataSyncStart(EMDataSyncType type)` 和 `EMConnectionListener#onDataSyncFinish(EMDataSyncType type, int errorCode)` 监听指定类型的数据同步开始和结束。
4. **读取本次同步后的最新数据**：如需展示本次登录后从服务端同步的最新数据，应等待对应类型的 `onDataSyncFinish(...)` 回调成功后，再读取本地会话、联系人或已加入群组数据并刷新界面。

**群组配置模型重构**

群组配置从单一样式枚举改为多个独立字段，建群后也可以按需更新指定配置。

- `EMGroupConfigs` 用于保存群组配置值，包含 `isPublic`、`joinApprovalRequired`、`allowInvites`、`maxUsers`、`inviteNeedConfirm` 和 `extField` 等字段。
- `EMGroupConfigsType` 用于标记需要更新的配置项。
- 建群接口和群组配置更新接口已切换到新的配置模型。

**消息已读回执与未读数管理**

消息回执和未读数清理机制已统一调整为批量处理方式，单聊和群聊共用一套回执体系。

1. 消息已读回执

- 已读回执改为批量发送，单聊和群聊统一处理。
- 是否需要发送已读回执，由每条消息的 `EMMessage#setIsNeedReadReceipt(true)` 单独控制。
- 单聊和群聊的已读回执统一通过 `EMMessageListener#onMessageReadReceipts(List<EMMessageReadReceipt>)` 接收。
- 群聊支持批量查询消息已读回执汇总。

2. 会话未读数管理

- SDK 提供本地会话未读消息总数统计，该统计不包含聊天室会话，也不包含推送提醒类型不是 `EMPushRemindType.ALL` 的会话。
- 清除指定会话或全部会话的本地未读数后，清理结果会同步至当前账号的其他设备，但不会向消息发送方发送消息已读回执。
- 当其他设备清除会话未读数时，本端会收到多设备会话事件，应用应据此重新读取本地会话并刷新界面。

**会话与群成员能力**

SDK 补充会话展示信息、批量删除会话和群成员读取等能力：

- 新增会话显示名称和头像接口，方便列表展示。
- 支持批量删除会话，并可按需删除会话消息。
- 新增群成员读取接口，可直接从群对象中读取成员信息。

#### 优化

**登录、鉴权与 API 整理**

- 客户端注册接口已移除，账号注册应由业务服务器实现。
- 登录和设备管理统一使用 Token 鉴权，移除密码登录及密码鉴权设备管理接口。
- SDK 不再支持自动登录：移除 `EMOptions#setAutoLogin(...)`、`getAutoLogin()` 和 `EMClient#isLoggedInBefore()`，改为通过 `loginWithToken(...)` 登录。
- 联系人自动同步开关并入 `EMOptions#setDataSyncType(...)`。
- `EMOptions.AreaCode` 由整型常量类改为枚举，`EMOptions#setAreaCode(int)` 调整为 `setAreaCode(AreaCode)`；原 `AREA_CODE_*` 常量改为 `CN`、`NA`、`EU`、`AS`、`JP`、`IN` 和 `GLOB`。

**低频与历史 API 清理**

- 移除消息举报 `reportMessage(...)`、`asyncReportMessage(...)`，改由业务服务器处理。
- 移除客户端注册、公开群列表、聊天室创建和销毁、消息统计等低频 API。
- 移除 `EMClient#check(...)`、`EMCheckType`、上报服务器配置和全量聊天室列表等历史接口。
- 统一 Token 登录、消息撤回、退出登录、群组成员和聊天室成员变更等 API 的命名与回调签名。
- 历史消息获取、消息搜索以及群组和聊天室成员获取统一使用推荐的异步或分页接口。

**平台与性能**

- 迁移至 AndroidX，并使用 `ProcessLifecycleOwner` 监听应用前后台状态。
- 优化本地数据库性能：复用批量消息写入语句、减少未读数持久化次数、优化消息查询，并增加不区分会话 ID 大小写的查询索引。
- 调整 `EMChatManager#getUnreadMessageCount()` 的统计规则，不再统计推送通知方式 `EMPushRemindType` 不是 `ALL` 的会话。
- 优化附件分片上传的超时策略，减少日志记录过程中的非必要序列化。

#### 修复

- 修复账号被服务端强制断开后，本地登录状态可能未及时清理的问题。
- 修复切换账号登录时，Android 层可能复用上一账号数据库缓存的问题。
- 修复修改消息时复用请求标识可能导致响应匹配异常的问题。
- 修复部分场景下群名片无法设置为空字符串的问题。
- 修复关闭附件 MD5 校验后，上传附件仍可能执行 MD5 预校验的问题。
- 修复网络传输、任务队列和数据库缓存中的若干并发安全问题。
