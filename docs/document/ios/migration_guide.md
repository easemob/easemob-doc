# iOS IM SDK 5.0.0 迁移指南

## 概述

本文档说明如何将 iOS IM SDK 从 v4.x 升级至 v5.0.0。v5.0.0 包含不兼容的 API 变更，升级后必须重新编译并完成本文档中的代码适配。

升级时遵循以下原则：

- 对于名称或模型调整的 API，使用本文档列出的 5.0 API 替换原调用。
- 对于已移除且没有 SDK 替代 API 的能力，将其迁移至业务服务或由应用自行实现。
- 不应继续依赖已移除的同步接口；应使用保留的异步 API 及其完成回调处理结果。

## 升级步骤

1. 更新项目中的 iOS IM SDK 至 v5.0.0，并重新编译项目以定位不兼容的 API 调用。
2. 调整登录流程：将注册、密码登录和 Token 获取逻辑移至 App Server；客户端通过 Token 登录接口登录。
3. 按本文档的 API 迁移对照处理模型更名、方法移除和参数变更，重点检查已读回执、数据同步、群组配置与附件消息创建代码。
4. 完成以下功能验证：Token 登录、会话及未读数、单聊和群聊消息已读回执、群组创建与属性更新，以及文件和图片消息发送。

## API 迁移对照

### 客户端与初始化

| 4.x API 或配置 | 5.0.0 适配方式 | 说明 |
| --- | --- | --- |
| `registerWithUsername:password:` | 移至 App Server | SDK 不再提供用户注册能力。 |
| `fetchTokenWithUsername:password:`、`loginWithUsername:password:` | 在 App Server 获取 Token，调用 `loginWithUsername:token:completion:` | 客户端不再提供密码登录与 Token 获取能力。 |
| `EMOptions#isAutoLogin`、`EMClient#isAutoLogin`、`autoLoginDidCompleteWithError:` | 由应用管理登录态和 Token，并在适当时机调用 Token 登录 | SDK 不再提供自动登录配置、状态和回调。 |
| 基于用户名/密码的多设备查询和强制登出接口 | 使用保留的 `userId + token` 多设备接口 | 需由业务服务为目标用户提供有效 Token。 |
| `serviceCheckWithUsername:password:completion:`、`EMServerCheckType` | 无 SDK 替代接口 | 服务检查能力已从公开 API 中移除。 |
| `EMOptions#enableAutoSyncContacts` | 使用 `EMOptions#dataSyncType` | `dataSyncType` 为位掩码，可组合 `EMDataSyncTypeConversations`、`EMDataSyncTypeContacts` 与 `EMDataSyncTypeJoinedGroups`。 |
| `EMOptions#enableRequireReadAck` | 发送前设置 `EMChatMessage#isNeedReadReceipt` | 已读回执配置由全局选项调整为消息级选项。 |

如需感知登录后的本地数据库打开或数据同步进度，可实现 `EMClientDelegate` 的以下回调：

- `onDatabaseOpened:username:`；
- `syncDataStartWithType:`；
- `syncDataFinished:type:`。

`onDatabaseOpened:username:` 仅表示当前账号的本地数据库已经打开，不表示会话、联系人或已加入群组已经完成同步。需要最新业务数据时，应等待相应类型的 `syncDataFinished:type:` 成功回调。

### 消息与会话

| 4.x API 或配置 | 5.0.0 适配方式 | 说明 |
| --- | --- | --- |
| `isNeedGroupAck`、`groupAckCount`、`isReadAcked` | `isNeedReadReceipt`、`groupReadReceiptCount`、`isPeerRead` | 已读回执字段统一使用 `ReadReceipt` 命名。 |
| `sendMessageReadAck:`、`sendGroupMessageReadAck:` | `sendMessageReadReceipts:completion:` | 单聊和群聊统一使用；单次最多传入 50 条消息，消息必须属于同一会话且 `isNeedReadReceipt` 为 `YES`。 |
| `messagesDidRead:`、`groupMessageDidRead:groupAcks:` | `onMessageReadReceipts:` | 单聊和群聊的实时已读回执统一通过 `EMMessageReadReceipt` 列表返回。 |
| `groupMessageAckHasChanged` | `groupMessageReadReceiptsHasChanged` | 群消息已读回执状态变化回调已更名。 |
| `EMGroupMessageAck`、`asyncFetchGroupMessageAcksFromServer:` | `EMGroupReadReceipt`、`asyncFetchGroupMessageReadUsersFromServer:` | 获取单条群消息的已读成员详情时使用新模型和新接口。 |
| 无 | `getGroupMessageReadReceipts:completion:` | 从服务器批量获取群消息回执汇总；单次最多传入 20 条属于同一会话的消息。 |
| 无 | 实现 `EMConversationDelegate`，并调用 `addConversationDelegate:delegateQueue:` | 用于监听会话列表更新。 |
| 无 | `conversationName`、`conversationAvatar`、`getUnreadMessageCount` | 用于会话展示和未读汇总；未读总数不包含聊天室和免打扰会话。 |
| 服务端会话查询、导入和置顶会话查询等旧 API | 会话列表数据同步结束后，使用保留的本地会话接口 | 以本地会话列表作为展示数据来源。 |
| 同步历史消息接口、`asyncFetchHistoryMessagesFromServer:…` | `fetchMessagesFromServerBy:conversationType:cursor:pageSize:option:completion:` | 服务端历史消息统一通过保留的异步分页接口获取。 |
| 旧式本地消息加载、消息重发、`modifyMessage:body:` | 使用保留的异步消息加载接口、`sendMessage:progress:completion:`、`modifyMessage:body:ext:completion:` | 需按原业务场景选择对应的异步接口；修改消息时 `body` 和 `ext` 不能同时为 `nil`。 |
| 文件或图片消息体基于 `NSData` 的初始化方式 | `initWithLocalPath:displayName:` | 创建待发送的附件消息时使用本地文件路径；`displayName` 为空时，SDK 会使用本地文件名。 |
| `markMessageAsReadWithId:completion:`、`markAllMessagesAsRead:`、`markAllConversationsAsRead`、直接修改 `EMChatMessage#isRead` | `clearConversationUnreadMessageCount:completion:` 或 `clearAllConversationUnreadMessageCount:` | `isRead` 在 5.0 中为只读属性。清除本地未读数与向发送方发送消息已读回执是两个独立操作。 |
| `ackConversationRead:`、`onConversationRead:to:` | 分别使用未读数清理接口和消息级 `sendMessageReadReceipts:completion:` | 5.0 不再提供会话级已读回执接口，应按业务目的分别处理本地未读数和消息已读回执。 |
| `EMChatMessage#getReaction:` | 遍历 `EMChatMessage#reactionList` | 按 Reaction 内容从列表中查找对应对象。 |
| `EMStreamChunk#sequenceNumber` | `EMStreamChunk#isComplete` | 5.0 不再公开分片序列号；通过只读属性 `isComplete` 判断流式消息是否已经完成。 |

### 群组

| 4.x API 或配置 | 5.0.0 适配方式 | 说明 |
| --- | --- | --- |
| `EMGroupOptions`、`EMGroupStyle` | `EMGroupConfigs`、`EMGroupConfigsType` | `style` 不再是单一枚举，需根据原群类型分别设置 `isPublic`、`joinApprovalRequired` 和 `allowInvites`；群组配置对象和配置字段枚举均已更名。 |
| 创建群组方法的 `EMGroupOptions *setting` 参数 | 传入 `EMGroupConfigs *setting` | 创建群组时同步替换配置对象类型。 |
| 群成员上限、公开属性、入群审批、邀请确认、成员邀请权限和群扩展等配置更新接口 | `updateGroupWithId:types:configs:completion:` | `types` 仅支持 `EMGroupConfigsType` 定义的配置字段；通过 `configs` 提供字段值。 |
| 群名称、描述和头像更新接口 | `updateGroupSubject:forGroup:completion:`、`updateDescription:forGroup:completion:`、`updateGroupAvatar:groupId:completion:` | 这些字段不属于 `EMGroupConfigsType`，仍使用各自的异步更新接口。 |
| `EMGroup#isPushNotificationEnabled` | `EMConversation#disturbType`，或 `getSilentModeForConversation:conversationType:completion:` | 群组对象不再直接提供推送开关状态；应从群会话或推送管理模块查询会话级推送设置。 |
| 已移除的同步群组查询和管理 API | 使用保留的异步群组接口及完成回调 | 重新编译后按方法签名选择对应的异步接口完成适配。 |

### 联系人、聊天室与推送

| 模块 | 4.x API 或配置 | 5.0.0 适配方式 |
| --- | --- | --- |
| 联系人 | `getAllContactsFromServerWithCompletion:`、`getContactsFromServerWithCursor:pageSize:completion:` 等服务端好友列表接口 | 初始化前将 `EMOptions#dataSyncType` 配置为包含 `EMDataSyncTypeContacts`，同步完成后通过 `getAllContacts`、`getContact:` 等本地接口读取。 |
| 联系人 | `onFriendStartSync`、`onFriendSyncFinished:` | 使用 `EMClientDelegate#syncDataStartWithType:` 和 `syncDataFinished:type:`，并判断数据类型是否包含 `EMDataSyncTypeContacts`。 |
| 联系人 | 添加好友、处理好友申请和黑名单管理等同步接口 | 使用同名或对应的异步接口及 completion；本地黑名单通过 `getBlackList` 获取。 |
| 聊天室 | `createChatroomWithSubject:…`、`destroyChatroom:…` | SDK 不再提供聊天室创建和销毁接口；由 App Server 或业务服务完成相应管理操作。 |
| 推送 | `updatePushDisplayStyle:`、`updatePushDisplayName:`、`getPushOptionsFromServerWithError:` | 分别改用 `updatePushDisplayStyle:completion:`、`updatePushDisplayName:completion:`、`getPushNotificationOptionsFromServerWithCompletion:`。 |

### 统计

`IEMStatisticsManager`、`EMStatisticsManager`、`EMChatMessageStatistics` 及消息数量、消息大小等统计 API 已移除。
