# iOS IM SDK 更新日志

## v5.0.0 2026-7-31

#### 新增功能

- 支持统一的消息已读回执能力：单聊和群聊消息均可在发送前通过 `EMChatMessage#isNeedReadReceipt` 标记需要已读回执，并支持批量发送消息已读回执；发送方可通过 `EMChatManagerDelegate#onMessageReadReceipts` 统一接收单聊和群聊消息的已读回执。
- 新增 `EMMessageReadReceipt`，用于获取消息 ID、会话 ID、单聊对端回执状态和群聊消息已读人数。
- 支持监听会话列表变更：新增 `EMConversationDelegate`，并提供会话代理的添加和移除接口。
- `EMConversation` 新增会话名称和会话头像获取方法。单聊会话返回对方用户的昵称和头像，群聊会话返回群组名称和头像。
- 支持获取本地所有会话的未读消息总数；该统计不包含聊天室会话和已开启免打扰的会话。
- 新增登录后自动数据同步配置：通过 `EMOptions#dataSyncType` 可选择同步会话、联系人和已加入的群组数据，并可通过 `EMClientDelegate` 监听各类数据同步的开始和结束。

#### 重要变更

v5.0.0 包含不兼容的 API 变更。从 v4.x 升级时，请参见 [iOS IM SDK 5.0.0 迁移指南](SDK_5.0.0_迁移指南.md) 完成代码适配。

- 登录与账号相关 API 已收敛：移除 SDK 内的注册、用户名/密码登录及部分设备管理接口，应用应使用 Token 登录方式。
- 数据同步与消息已读回执的配置方式已调整：`EMOptions#enableAutoSyncContacts` 和全局 `enableRequireReadAck` 已移除，分别使用 `EMOptions#dataSyncType` 和消息级 `EMChatMessage#isNeedReadReceipt` 配置。
- 群组配置模型已调整：`EMGroupOptions` 和 `EMGroupStyle` 替换为 `EMGroupConfigs` 和 `EMGroupConfigsType`；更新群组属性时使用按字段指定的配置模型。
- 消息已读回执相关模型、字段和方法的命名统一由 `Ack` 调整为 `ReadReceipt`；单聊和群聊使用统一的回执发送与回调机制。
- 统计模块已移除：`EMStatisticsManager`、及消息统计相关公开 API 不再提供。
- 会话、消息、联系人、群组和聊天室中一批已废弃、同步或旧式回调 API 已移除；请根据迁移指南中的替代 API 或实现建议完成适配。

#### 优化与修复

- 修复发送文件、图片等附件消息时，若未设置 `displayName`，上传附件可能会有2MB大小限制的问题。SDK 会自动使用本地文件名作为显示名。
- 修复账号在其他设备登录、被服务端移除或被禁用时，本地客户端状态未完整登出的问题。

#### 注意事项

- SDK 不再提供注册与用户名/密码登录能力。应用需通过自身 App Server 获取 Token，再调用 Token 登录接口。
- 文件和图片消息体仅支持使用本地文件路径创建；原有基于 `NSData` 的文件或图片消息体初始化方式已移除。
