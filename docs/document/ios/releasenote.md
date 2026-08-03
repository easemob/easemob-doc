# iOS IM SDK 更新日志

## v5.0.0 2026-7-31

#### 新增功能

- 支持统一的消息已读回执能力：单聊和群聊消息均可在发送前通过 `EMChatMessage#isNeedReadReceipt` 标记需要已读回执，并支持批量发送消息已读回执；发送方可通过 `EMChatManagerDelegate#onMessageReadReceipts` 统一接收单聊和群聊消息的已读回执。
- 新增 `EMMessageReadReceipt`，用于获取消息 ID、会话 ID、单聊对端回执状态和群聊消息已读人数。
- 支持监听会话列表变更：新增 `EMConversationDelegate`，并提供会话代理的添加和移除接口。
- `EMConversation` 新增会话名称和会话头像获取方法。单聊会话返回对方用户的昵称和头像，群聊会话返回群组名称和头像。
- 支持获取本地所有会话的未读消息总数；该统计不包含聊天室会话和已开启免打扰的会话。
- 新增登录后自动数据同步配置：通过 `EMOptions#dataSyncType` 可选择同步会话、联系人和已加入的群组数据，并可通过 `EMClientDelegate` 监听各类数据同步的开始和结束。
- 新增 `EMClientDelegate#onDatabaseOpened:username:` 回调，用于感知登录后的本地数据库打开结果；数据库打开与登录后数据同步分别通过不同回调通知。
- 新增 `clearConversationUnreadMessageCount:completion:` 和 `clearAllConversationUnreadMessageCount:`，用于清除指定会话或全部会话的未读消息数。
- 新增 `getGroupMessageReadReceipts:completion:`，支持批量获取同一会话中最多 20 条群消息的已读回执汇总。

#### 重要变更

v5.0.0 包含不兼容的 API 变更。从 v4.x 升级时，请参见 [iOS IM SDK 5.0.0 迁移指南](migration_guide.html) 完成代码适配。

- 登录与账号相关 API 已收敛：移除 SDK 内的注册、用户名/密码登录及获取 Token 的接口，应用应通过 App Server 获取 Token，并使用 Token 登录方式。
- 自动登录相关配置、状态和回调已移除，包括 `EMOptions#isAutoLogin`、`EMClient#isAutoLogin` 和 `autoLoginDidCompleteWithError:`；应用需自行管理登录态和 Token。
- 基于用户名和密码的多设备查询、踢出设备接口已移除；如需管理登录设备，应使用保留的用户 ID 与 Token 版本接口。
- 数据同步与消息已读回执的配置方式已调整：`EMOptions#enableAutoSyncContacts` 和全局 `enableRequireReadAck` 已移除，分别使用 `EMOptions#dataSyncType` 和消息级 `EMChatMessage#isNeedReadReceipt` 配置。
- 群组配置模型已调整：`EMGroupOptions` 和 `EMGroupStyle` 替换为 `EMGroupConfigs` 和 `EMGroupConfigsType`；更新群组属性时使用按字段指定的配置模型。
- 消息已读回执相关模型、字段和方法的命名统一由 `Ack` 调整为 `ReadReceipt`；单聊和群聊使用统一的回执发送与回调机制。
- `EMChatMessage#isRead` 调整为只读属性。若需清除本地未读数，应调用会话未读数清理接口，不再直接修改该属性。
- 服务端会话列表查询、会话导入和服务端置顶会话查询等旧接口已移除。需要最新会话数据时，应通过 `EMOptions#dataSyncType` 同步会话，再读取本地会话列表。
- 服务端好友列表查询接口及好友同步开始、结束旧回调已移除。需要最新好友数据时，应通过 `EMOptions#dataSyncType` 同步联系人，再读取本地好友数据。
- 聊天室创建和销毁接口已移除；相关管理操作需由 App Server 调用服务端接口完成。
- 推送设置的同步接口已移除：`updatePushDisplayStyle:`、`updatePushDisplayName:` 和 `getPushOptionsFromServerWithError:` 分别改用 `updatePushDisplayStyle:completion:`、`updatePushDisplayName:completion:` 和 `getPushNotificationOptionsFromServerWithCompletion:`。
- 统计模块已移除：`EMStatisticsManager`、及消息统计相关公开 API 不再提供。
- 会话、消息、联系人、群组和聊天室中一批已废弃、同步或旧式回调 API 已移除；请根据迁移指南中的替代 API 或实现建议完成适配。

#### 优化与修复

- 修复发送文件、图片等附件消息时，若未设置 `displayName`，上传附件可能会有 2 MB 大小限制的问题。SDK 会自动使用本地文件名作为显示名。
- 修复账号在其他设备登录、被服务端移除或被禁用时，本地客户端状态未完整登出的问题。

#### 注意事项

- SDK 不再提供注册与用户名/密码登录能力。应用需通过自身 App Server 获取 Token，再调用 Token 登录接口。
- SDK 不再负责自动登录。应用启动后应根据自身保存的登录状态和 Token 有效期决定是否调用 Token 登录接口。
- 文件和图片消息体仅支持使用本地文件路径创建；原有基于 `NSData` 的文件或图片消息体初始化方式已移除。`displayName` 为空时，SDK 会使用本地文件名作为附件显示名称。
