# Web IM SDK 更新日志

## v5.0.0 2026-7-31

#### 新增功能

- **SDK 入口统一**：新增 `ChatClient` 统一入口，负责 SDK 初始化、登录登出、连接生命周期、事件分发和 Manager 注册。业务可通过 `ChatClient.init({ appKey, managers })` 初始化 SDK，也可在初始化后通过 `.use()` 按需注册功能模块。
- **支持模块化 Manager 能力拆分**：消息和会话由 `ChatManager` 管理，好友关系由 `ContactManager` 管理，用户属性由 `UserInfoManager` 管理，群组由 `GroupManager` 管理，聊天室由 `ChatRoomManager` 管理，在线状态由 `PresenceManager` 管理，消息话题由 `ChatThreadManager` 管理，推送由 `PushManager` 管理。
- **支持类型化消息创建接口**：通过 `createTextMessage`、`createImageMessage`、`createFileMessage`、`createVoiceMessage`、`createVideoMessage`、`createLocationMessage`、`createCmdMessage`、`createCustomMessage` 和 `createCombineMessage` 创建不同类型消息，并通过 `sendMessage` 统一发送。
- **支持统一的消息已读回执能力**：可通过 `sendMessageReadReceipts` 批量发送单聊或群聊消息已读回执，发送方通过 `onMessageReadReceipts` 接收回执；群聊还支持通过 `getGroupMessageReadUsers` 查询单条群消息已读成员列表，并通过 `getGroupMessageReadReceipts` 批量查询群消息已读数量。
- **支持会话列表本地缓存与自动同步**：登录后可通过 `enableSyncData` 配置自动同步会话、联系人和已加入群组数据，并通过 `onSyncDataStart`、`onSyncDataFinished` 监听同步状态；会话列表变化通过 `onConversationListUpdate` 通知业务层。
- **会话管理完善**：支持会话置顶、会话标记、会话删除和会话未读数清零能力，并提供 `clearConversationUnreadMessageCount` 和 `clearAllConversationUnreadMessageCount` 清除指定会话或全部会话未读数。
- **支持用户属性订阅和用户信息自动管理**：可通过 `subscribeUsersInfo` 订阅用户信息变更；开启 `enableUserInfoSync` 后，SDK 可在消息收发过程中自动同步用户属性和群成员名片更新时间。
- **支持消息扩展能力**：包括消息撤回、消息编辑、消息置顶、引用消息、Reaction、历史消息拉取、服务端消息搜索、消息翻译、合并消息解析和流式消息接收。
- **多场景能力统一**：支持群组、聊天室、消息话题、在线状态和推送通知相关能力，并提供 Group、ChatRoom 和 ChatThread 实体对象风格 API，便于围绕单个实体连续操作。
- **支持跨平台运行时适配层**：可在 Web、微信小程序、uni-app、React Native 和 Electron 等环境中适配请求、上传、WebSocket 和本地存储等基础能力。

#### 重要变更

v5.0.0 包含不兼容的 API 变更。从旧版 Web SDK 升级时，请参见 [Web IM SDK 迁移指南](migration_guide.html) 完成代码适配。

- **初始化方式调整**：SDK 初始化入口由 `new SDK.connection({ appKey })` 调整为 `ChatClient.init({ appKey })`。需要使用的业务模块必须通过 `managers` 参数或 `.use()` 注册，否则对应的 `client.xxxManager` 不会挂载。
- **模块职责拆分**：API 不再集中挂载在 `conn` 实例上，而是按业务能力拆分到各 Manager，例如 `client.chatManager`、`client.contactManager`、`client.groupManager` 和 `client.chatRoomManager`。
- **消息处理调整**：消息创建方式由 `WebIM.message.create({ type, ... })` 调整为按消息类型调用 `client.chatManager.createXxxMessage(...)`；消息发送统一使用 `client.chatManager.sendMessage(message, options?)`。
- **会话字段统一**：会话定位字段由旧版的 `to`、`chatType` 调整为 `conversationId`、`conversationType`，会话类型取值统一为 `singleChat`、`groupChat` 或 `chatRoom`。
- **登录方式调整**：登录参数调整为 `{ userId, token }`，SDK 客户端不再推荐或提供用户名/密码登录流程；Token 即将过期时，业务侧应在 `onTokenWillExpire` 中获取新 Token 并调用 `client.renewToken(newToken)`。
- **事件模型调整**：消息接收统一通过 `onMessage` 分发，再根据 `message.type` 区分消息类型；群组、聊天室、消息话题、多设备等事件拆分为独立事件名。
- **异步返回简化**：多数异步 API 直接返回业务对象或业务列表，不再要求业务侧从旧版 `AsyncResult<T>.data` 中读取数据。
- **异常处理调整**：全局 `onError` 事件已移除。业务侧应通过 `try...catch` 捕获 Promise reject，并结合 `ValidationError`、`ConnectionError`、`AuthenticationError`、`SDKError`、`MessageSendError` 等错误类型处理异常。
- **功能范围调整**：注册用户、部分旧式设备管理、旧小程序生命周期处理、旧插件注册方式和一批已废弃的别名已移除；无客户端等价能力的管理操作应由 App Server 调用服务端 REST API 完成。
- **聊天室创建调整**：聊天室创建通常应通过服务端 REST API 完成；Web SDK 客户端侧主要提供聊天室列表、详情、加入、退出、成员、公告和自定义属性等管理能力。

#### 优化与修复

- **优化 TypeScript 类型体验**：公开 API 的参数、返回值和事件载荷均提供类型定义，有助于在编译期发现参数错误，并提升 IDE 补全和重构体验。
- **优化模块化集成体验**：支持从主包或 Manager 子路径按需导入功能模块，未注册的 Manager 不会挂载到 SDK 实例，便于控制项目集成范围。
- **优化事件处理体验**：消息、群组、聊天室、消息话题、Presence、推送和多设备事件均按业务语义拆分，降低业务侧自行解析 `operation` 的成本。
- **优化会话列表处理**：SDK 维护本地会话列表缓存，收发消息、会话同步、置顶、标记、删除和清零未读数等操作会更新本地缓存，并通过 `onConversationListUpdate` 通知业务层。
- **优化数据同步流程**：支持登录后自动同步会话、联系人和已加入群组数据，并提供同步开始、完成和失败状态通知。
- **优化用户资料展示链路**：开启 `enableUserInfoSync` 后，SDK 可根据消息中携带的资料更新时间自动拉取最新用户资料或群成员名片，并触发对应资料更新事件。
- **优化错误处理模型**：SDK 对参数校验、连接、认证、服务端业务错误、附件上传和消息发送等异常提供结构化错误类型，便于业务侧区分重试、提示和兜底策略。
- **优化跨平台一致性**：通过统一平台适配层处理 Web、小程序、uni-app、React Native 和 Electron 等运行环境差异，降低不同端集成时的代码分叉。
- **优化 AI 辅助集成体验**：提供 Markdown 文档、TypeScript 类型和 API 注释，便于 IDE、AI 编程工具和集成辅助工具读取和生成代码。

#### 注意事项

- 使用任何 Manager 能力前，必须先在初始化时通过 `managers` 注册，或在初始化后通过 `.use()` 注册对应 Manager。
- Web SDK v5 使用 Token 登录。应用需通过自身 App Server 获取用户 Token，再调用 `client.login({ userId, token })` 登录。
- 未传入 `enableSyncData` 时，SDK 默认登录后同步会话列表；如需同步联系人或群组，请显式配置 `enableSyncData` 并注册对应 Manager。
- 如果使用固定服务地址的私有部署环境，并开启联系人或群组等同步能力，请同时配置 `serviceConfig.serverUrls` 中的同步服务地址。
- 消息送达回执仅支持单聊；消息已读回执仅支持单聊和群聊，聊天室不支持消息送达回执和消息已读回执。
- 群聊消息已读回执需要在环信控制台开通，并受群规模、有效期和权限配置限制。
- `sendMessageReadReceipts` 只表示指定消息已读，不会推进会话级已读位置，也不会直接清零本地会话未读数；如需清零未读数，请调用会话未读数清零接口。
- 从旧版 Web SDK 升级时，应重点检查初始化入口、Manager 注册、登录参数、消息创建、事件监听、返回值读取和已移除 API。