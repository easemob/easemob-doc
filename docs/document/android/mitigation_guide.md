# Android IM SDK 5.0.0 迁移指南

## 概述

本文档说明如何将 Android IM SDK 从 v4.x 升级至 v5.0.0。v5.0.0 包含不兼容的 API 变更，升级后必须重新编译项目并完成本文档中的代码适配。

升级时遵循以下原则：

- 对于名称或模型调整的 API，使用本文档列出的 5.0 API 替换原调用。
- 对于已移除且没有 SDK 替代 API 的能力，将其迁移至业务服务或由应用自行实现。
- Android V5 同时保留部分同步和异步 API。优先在非阻塞场景使用异步 API 并通过 `EMCallBack` 或 `EMValueCallBack` 处理结果；调用同步 API 时，不要在主线程执行。

## 升级步骤

1. 更新项目中的 Android IM SDK 至 v5.0.0，并重新编译项目以定位不兼容的 API 调用。
2. 调整登录流程：将注册、密码登录和 Token 获取逻辑移至 App Server；客户端通过 Token 登录接口登录。
3. 按本文档的 API 迁移对照处理模型更名、方法移除和参数变更，重点检查已读回执、数据同步、群组配置与附件消息创建代码。
4. 完成以下功能验证：Token 登录、会话及未读数、单聊和群聊消息已读回执、群组创建与属性更新，以及文件和图片消息发送。

## API 迁移对照

### 客户端与初始化

| 4.x API 或配置 | 5.0.0 适配方式 | 说明 |
| --- | --- | --- |
| 注册、用户名/密码登录及 Token 获取 API | 移至 App Server；客户端调用 `EMClient#loginWithToken(String, String, EMCallBack)` | SDK 不再提供用户注册、密码登录和 Token 获取能力。 |
| 基于用户名/密码的多设备查询和强制登出接口 | 使用 `EMClient#fetchLoggedInDevicesFromServerWithToken`、`EMClient#kickDeviceWithToken` 或 `EMClient#kickAllDevicesWithToken` | 需由业务服务为目标用户提供有效 Token。 |
| 旧的联系人自动同步配置 | 使用 `EMOptions#setDataSyncType(EnumSet<EMOptions.EMDataSyncType>)` | `EMDataSyncType` 可组合 `CONVERSATIONS`、`CONTACTS` 和 `JOINED_GROUPS`。 |
| 全局消息已读回执配置 | 发送前调用 `EMMessage#setIsNeedReadReceipt(boolean)` | 已读回执配置调整为消息级配置。 |

如需感知登录后的本地数据库打开或数据同步进度，可实现 `EMConnectionListener` 的以下回调：

- `onDatabaseOpened(String username)`；
- `onDataSyncStart(EMOptions.EMDataSyncType type)`；
- `onDataSyncFinish(EMOptions.EMDataSyncType type, int errorCode)`。

`onDatabaseOpened(String username)` 仅表示当前账号的本地数据库已经打开，不表示会话、联系人或已加入群组已经完成同步。需要最新业务数据时，应等待相应类型的 `onDataSyncFinish` 成功回调。

### 消息与会话

| 4.x API 或配置 | 5.0.0 适配方式 | 说明 |
| --- | --- | --- |
| `isNeedGroupAck`、群消息已读人数及对端已读状态等旧 Ack 字段 | `EMMessage#isNeedReadReceipt`、`EMMessageReadReceipt#getReadCount`、`EMMessageReadReceipt#isPeerReceipt` | 已读回执相关模型和字段统一使用 `ReadReceipt` 命名。 |
| 单聊或群聊的旧消息已读回执发送接口 | `EMChatManager#asyncSendMessageReadReceipts(List<EMMessage>, EMCallBack)` | 单聊和群聊统一使用；单次最多传入 50 条消息，消息必须属于同一会话且需设置已读回执。 |
| 单聊和群聊的旧已读回执事件 | `EMMessageListener#onMessageReadReceipts(List<EMMessageReadReceipt>)` | 单聊和群聊的实时已读回执通过统一回调返回。 |
| 群消息已读状态变化的旧 Ack 回调 | `EMMessageListener#onReadReceiptForGroupMessageUpdated()` | 群消息已读回执状态变化回调已统一为 ReadReceipt 命名。 |
| 旧群消息已读成员详情模型或接口 | `EMGroupReadReceipt`、`EMChatManager#asyncFetchGroupMessageReadReceipts` | 分页获取单条群消息的已读成员详情。 |
| 无 | `EMChatManager#asyncGetGroupMessageReadReceipts` | 批量获取群消息的已读回执汇总。 |
| 无 | `EMConversationListener`，以及 `EMChatManager#addConversationListener` | 用于监听会话列表更新。 |
| 无 | `EMConversation#getConversationName`、`EMConversation#getConversationAvatar`、`EMChatManager#getUnreadMessageCount` | 用于会话展示和未读汇总；未读总数不包含聊天室和免打扰会话。 |
| 旧服务端会话查询、导入或置顶会话查询接口 | 数据同步结束后，使用保留的本地会话接口 | 以本地会话列表作为展示数据来源。 |
| 同步历史消息接口或旧服务端历史消息接口 | `EMChatManager#asyncFetchHistoryMessages` | 服务端历史消息统一通过异步分页接口获取。 |
| 旧式本地消息加载、消息重发或编辑消息接口 | 使用保留的异步消息加载接口、`EMChatManager#sendMessage`、`EMChatManager#asyncModifyMessage` | 按原业务场景选择对应接口；编辑消息时，按消息类型传入需要更新的消息体或扩展字段。 |
| 基于字节数组创建文件或图片消息体的方式 | 使用 `EMMessage#createFileSendMessage` 或 `EMMessage#createImageSendMessage`，传入本地文件路径或 `Uri` | 创建待发送附件消息时使用本地文件或本地 URI；未设置显示名时，SDK 使用本地文件名。 |
| 直接修改消息 `isRead` 或旧的标记已读接口 | `EMChatManager#asyncClearConversationUnreadMessageCount` 或 `EMChatManager#asyncClearAllConversationUnreadMessageCount` | 清除本地未读数与向发送方发送消息已读回执是两个独立操作。 |
| 会话级已读回执接口 | 分别调用未读数清理接口和 `asyncSendMessageReadReceipts` | V5 不再提供会话级已读回执；应按业务目的分别处理本地未读数和消息已读回执。 |
| 旧的单个 Reaction 查询方式 | 遍历 `EMMessage#getMessageReaction()` 返回的 `List<EMMessageReaction>` | 按 Reaction 内容从列表中查找对应对象。 |
| `EMStreamChunk` 的分片序列号 | `EMStreamChunk#isCompleted` | V5 不再公开分片序列号；通过 `isCompleted` 判断流式消息是否已完成。 |

### 群组

| 4.x API 或配置 | 5.0.0 适配方式 | 说明 |
| --- | --- | --- |
| `EMGroupOptions`、`EMGroupStyle` | `EMGroupConfigs`、`EMGroupManager.EMGroupConfigsType` | 群类型不再是单一枚举；需按原业务场景分别设置 `isPublic`、`joinApprovalRequired` 和 `allowInvites`。 |
| 创建群组方法的 `EMGroupOptions` 参数 | 传入 `EMGroupConfigs` | 创建群组时同步替换配置对象类型。 |
| 群成员上限、公开属性、入群审批、邀请确认、成员邀请权限和群扩展等配置更新接口 | `EMGroupManager#asyncUpdateGroupConfigs` | 通过 `EnumSet<EMGroupConfigsType>` 指定要更新的字段，并通过 `EMGroupConfigs` 提供字段值。 |
| 群名称、描述和头像更新接口 | 使用对应的异步更新接口 | 这些字段不属于 `EMGroupConfigsType`，仍使用各自的更新接口。 |
| 群对象上的推送开关状态 | 从 `EMConversation` 或 `EMPushManager` 查询会话级推送设置 | 群组对象不再作为会话推送设置的数据来源。 |
| 已移除的同步群组查询和管理 API | 使用保留的异步群组接口及回调 | 重新编译后按方法签名选择对应异步接口完成适配。 |

### 联系人、聊天室与推送

| 模块 | 4.x API 或配置 | 5.0.0 适配方式 |
| --- | --- | --- |
| 联系人 | 服务端好友列表查询接口 | 初始化前将 `EMOptions#setDataSyncType` 配置为包含 `CONTACTS`；同步完成后通过本地联系人接口读取。 |
| 联系人 | 好友同步开始与结束事件 | 使用 `EMConnectionListener#onDataSyncStart` 和 `onDataSyncFinish`，并判断数据类型是否为 `CONTACTS`。 |
| 联系人 | 添加好友、处理好友申请和黑名单管理等同步接口 | 使用同名或对应的异步接口及回调；本地黑名单通过 `EMContactManager#getBlackListUsernames` 获取。 |
| 聊天室 | 聊天室创建和销毁接口 | SDK 不再提供聊天室创建和销毁能力；由 App Server 或业务服务完成相应管理操作。 |
| 推送 | 更新推送显示属性或查询服务端推送配置的接口 | Android v5 同时保留同步和异步接口。UI 场景建议使用异步接口及回调；调用同步接口时不要在主线程执行。 |

### 统计

Android SDK V5 仍保留消息流量统计配置，例如 `EMOptions#setEnableStatistics`。如应用已使用该能力，升级至 V5 后无需因统计配置进行迁移；请以当前 Android SDK 的公开 API 为准完成编译检查。
