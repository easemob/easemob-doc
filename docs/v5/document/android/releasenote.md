# Android IM SDK 更新日志

## v5.0.0 2026-7-31

#### 新增功能

- 支持统一的消息已读回执能力：单聊和群聊消息均可在发送前通过 `EMMessage#setIsNeedReadReceipt` 标记需要已读回执，并支持批量发送消息已读回执；发送方可通过 `EMMessageListener#onMessageReadReceipts` 统一接收单聊和群聊消息的已读回执。
- 新增 `EMMessageReadReceipt`，用于获取消息 ID、会话 ID、单聊对端回执状态和群聊消息已读人数。
- 支持监听会话列表变更：新增 `EMConversationListener`，并提供 `EMChatManager#addConversationListener` 和 `EMChatManager#removeConversationListener` 接口。
- `EMConversation` 新增 `getConversationName` 和 `getConversationAvatar` 方法。单聊会话返回对端用户的昵称和头像，群聊会话返回群组名称和头像。
- 支持获取本地全部会话的未读消息总数：调用 `EMChatManager#getUnreadMessageCount`。该统计不包含聊天室会话和已开启免打扰的会话。
- 新增登录后自动数据同步配置：通过 `EMOptions#setDataSyncType` 可选择同步会话、联系人和已加入的群组数据，并可通过 `EMConnectionListener` 监听各类数据同步的开始和结束。

#### 重要变更

v5.0.0 包含不兼容的 API 变更。从 v4.x 升级时，请根据 Android SDK V5 的迁移文档完成代码适配。

- 登录与账号相关 API 已收敛：移除 SDK 内的注册、用户名/密码登录及部分设备管理接口，应用应使用 `EMClient#loginWithToken` 进行 Token 登录。
- 数据同步与消息已读回执的配置方式已调整：原有联系人自动同步配置已移除，使用 `EMOptions#setDataSyncType` 统一配置；已读回执改为消息级配置，通过 `EMMessage#setIsNeedReadReceipt` 设置。
- 群组配置模型已调整：使用 `EMGroupConfigs` 和 `EMGroupManager#EMGroupConfigsType` 配置和更新群组属性；更新群组配置时需按字段指定要修改的配置类型。
- 消息已读回执相关模型、字段和方法的命名统一由 `Ack` 调整为 `ReadReceipt`；单聊和群聊使用统一的已读回执发送与回调机制。
- 会话、消息、联系人、群组和聊天室中一批已废弃、同步或旧式回调 API 已移除；请使用 V5 对应的异步 API、监听器或替代接口完成适配。

#### 优化与修复

- 修复发送文件、图片等附件消息时，若未设置 `displayName`，上传附件可能会有 2 MB 大小限制的问题。SDK 会自动使用本地文件名作为显示名。
- 修复账号在其他设备登录、被服务端移除或被禁用时，本地客户端状态未完整登出的问题。

#### 注意事项

- SDK 不再提供注册与用户名/密码登录能力。应用需通过自身 App Server 获取 Token，再调用 `EMClient#loginWithToken` 登录。
- 创建文件和图片消息时，使用本地文件路径或本地 `Uri`；原有基于字节数组的文件或图片消息体初始化方式已移除。
