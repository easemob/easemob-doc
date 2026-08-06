# 环信 iOS IM SDK 4.x 到 5.0.0 迁移指南

## 升级总览

iOS IM SDK 5.0.0 是一次源代码不兼容的大版本升级，主要涉及以下四个方面：

1. **数据同步机制调整**
   登录后，SDK 可自动同步会话、好友和已加入的群组数据，并将数据保存到本地数据库，替代原先由应用主动调用服务端拉取接口。
2. **消息已读回执机制重构**
   已读回执由逐条发送调整为批量发送；清除本地未读数与向消息发送方发送已读回执相互独立；单聊和群聊使用统一的回执模型与回调。
3. **群组配置模型重构**
   `EMGroupStyle` 单一枚举拆分为 `isPublic`、`joinApprovalRequired` 和 `allowInvites` 三个布尔属性，并支持创建群组后按配置类型更新群组属性。
4. **历史 API 精简**
   移除一批同步接口、长期标记为废弃 `@Deprecated` 的接口及部分边缘能力。注册、举报和消息流量统计等功能需由业务服务或服务端 REST API 实现；密码登录接口下线，仅保留 Token 登录。

:::tip
**升级要求：** iOS IM SDK 5.0.0 包含不兼容的 Objective-C API 变更。更新 SDK 后必须重新编译，并重点验证 Token 登录、数据同步、会话未读数、单聊和群聊已读回执、群组创建和配置更新、好友、附件消息及推送设置。
:::

## 初始化与登录

### 自动登录移除

iOS SDK 5.0.0 不再提供自动登录配置、自动登录状态和自动登录完成回调。应用冷启动后，需要自行管理用户 ID 与 Token，并在适当时机主动调用 `loginWithUsername:token:completion:`。

| 删除的 API | 替代方式 | 接口说明 |
| :--- | :--- | :--- |
| `EMOptions#isAutoLogin` | 无直接替代。应用启动后主动调用 `loginWithUsername:token:completion:`。 | 配置 SDK 初始化后是否自动登录。 |
| `EMClient#isAutoLogin` | 根据业务需要读取 `EMClient.isLoggedIn` 或 `EMClient.isConnected`。 | 查询 SDK 是否处于自动登录流程或自动登录状态。 |
| `EMClientDelegate#autoLoginDidCompleteWithError:` | 在 `loginWithUsername:token:completion:` 的 completion 中处理主动登录结果。 | 通知自动登录完成及其错误。 |
| `EMClientDelegate#userAccountDidLoginFromOtherDevice:`、无参数的 `userAccountDidLoginFromOtherDevice` | `userAccountDidLoginFromOtherDeviceWithInfo:` | 通知当前账号在其他设备登录。5.0.0 统一通过 `EMLoginExtensionInfo` 返回新登录设备及扩展信息。 |

`isLoggedIn` 表示当前是否已经登录，`isConnected` 表示是否连接至聊天服务器。二者都不能替代应用对用户凭证和 Token 生命周期的管理。

### 密码登录下线

iOS SDK 5.0.0 仅保留 Token 登录方式。用户注册、密码校验和 Token 获取等账号管理操作需要 REST API 或由业务服务器完成。

| 删除的 API | 替代方式 | 接口说明 |
| :--- | :--- | :--- |
| `registerWithUsername:password:`、`registerWithUsername:password:completion:` | 无客户端替代；通过服务端 REST API 注册 IM 账号。 | 使用用户 ID 和密码注册 IM 账号。 |
| `fetchTokenWithUsername:password:completion:` | 无客户端替代；由业务服务器获取 Token 并下发客户端。 | 使用用户 ID 和密码从 SDK 请求用户 Token。 |
| `loginWithUsername:password:`、`loginWithUsername:password:completion:` | `loginWithUsername:token:completion:` | 使用用户 ID 和密码登录；4.x 中已废弃。 |
| `loginWithUsername:agoraToken:`、`loginWithUsername:agoraToken:completion:` | `loginWithUsername:token:completion:` | 使用 Agora Token 登录；4.x 中已废弃。 |
| 同步 `loginWithUsername:token:` | `loginWithUsername:token:completion:` | 使用 Token 同步登录并直接返回 `EMError`；5.0.0 仅保留异步 completion 版本。 |
| `serviceCheckWithUsername:password:completion:`、`EMServerCheckType` | 无直接替代；结合正常登录 completion、`connectionStateDidChange:` 和 Token 过期回调诊断。 | 检查账号、DNS、Token、登录或登出相关状态。 |

`renewToken:completion:` 仍用于异步更新当前登录会话的 Token；同步 `renewToken:` 也仍在 5.0.0 公共头文件中保留，但业务代码应优先使用 completion 版本处理错误。

### 登录与数据库打开解耦

iOS SDK 5.0.0 新增本地数据库打开回调。数据库打开后即可读取当前账号的本地数据，不必等待会话、好友或已加入群组的服务端同步完成，有助于加快冷启动时的首屏展示。

- `EMClientDelegate#onDatabaseOpened:username:`：当前账号本地数据库打开完成时触发；`error` 为空表示打开成功。应用如需感知本地库是否就绪，应记录该回调状态。
:::
- `EMClientDelegate#syncDataStartWithType:`：指定类型的数据开始同步时触发。
- `EMClientDelegate#syncDataFinished:type:`：指定类型的数据同步完成时触发；`error` 为空表示同步成功。

## 数据同步与服务端拉取 API 迁移

### 数据同步 API

iOS SDK 5.0.0 新增登录后自动数据同步机制。应用应在初始化 SDK 前通过 `EMOptions#dataSyncType` 指定同步的数据类型，并通过 `EMClientDelegate` 监听同步进度。同步完成后，从各模块的本地接口读取数据。

| 所属类 | API 或配置 | 接口说明 |
| :--- | :--- | :--- |
| `EMOptions` | `EMDataSyncType` | 数据同步位掩码：`EMDataSyncTypeNone`、`EMDataSyncTypeConversations`、`EMDataSyncTypeContacts` 和 `EMDataSyncTypeJoinedGroups`；多个类型可使用按位或组合。 |
| `EMOptions` | `dataSyncType` | 设置登录后自动同步的数据类型；必须在 `initializeSDKWithOptions:` 前配置。当前 5.0.0 代码实现的默认值为 `EMDataSyncTypeConversations`。 |
| `EMClientDelegate` | `syncDataStartWithType:` | 通知指定类型的数据开始同步。 |
| `EMClientDelegate` | `syncDataFinished:type:` | 通知指定类型的数据同步结束；completion 参数 `error` 为空表示成功。 |
| `EMClientDelegate` | `onDatabaseOpened:username:` | 通知指定账号的本地数据库已经打开；该事件不表示任何服务端数据已经同步完成。 |

:::tip
`EMOptions#dataSyncType` 默认为 `EMDataSyncTypeConversations`，因此配置时仅自动同步会话，不会自动同步好友或已加入群组。
:::

典型配置如下：

```objective-c
EMOptions *options = [EMOptions optionsWithAppkey:@"your-appkey"];
options.dataSyncType = EMDataSyncTypeConversations |
                       EMDataSyncTypeContacts |
                       EMDataSyncTypeJoinedGroups;
EMError *error = [[EMClient sharedClient] initializeSDKWithOptions:options];
```

### 服务端拉取 API 迁移

原先主动拉取会话、好友和已加入群组，并在 completion 中刷新数据的方式，统一调整为 **配置数据同步范围、登录后自动同步、读取本地数据，并在 `syncDataFinished:type:` 成功后刷新 UI**。

| 类 | 删除的 API | 5.0.0 推荐方式 |
| :--- | :--- | :--- |
| `IEMChatManager` | `getConversationsFromServer:`、`getConversationsFromServerByPage:pageSize:completion:`、`getConversationsFromServerWithCursor:pageSize:completion:` | 这些接口用于从服务器拉取会话列表。改用本地 `getAllConversations` 或 `getAllConversations:`，并在 `syncDataFinished:EMDataSyncTypeConversations` 成功后刷新。 |
| `IEMChatManager` | `getPinnedConversationsFromServerWithCursor:pageSize:completion:` | 该接口用于拉取服务端置顶会话。置顶状态随会话数据同步落地，改为读取本地 `EMConversation.isPinned` 和 `pinnedTime`。 |
| `IEMChatManager` | `getConversationsFromServerWithCursor:filter:completion:` | 该接口按条件拉取服务端会话。改用 `getAllConversations`，或使用本地 `filterConversationsFromDB:filter:` 过滤。 |
| `IEMGroupManager` | `getJoinedGroupsFromServerWithPage:pageSize:needMemberCount:needRole:completion:` | 该接口分页拉取已加入群组。改用本地 `getJoinedGroups`，并在 `syncDataFinished:EMDataSyncTypeJoinedGroups` 成功后刷新。 |
| `IEMContactManager` | `getAllContactsFromServerWithCompletion:`、`getContactsFromServerWithCursor:pageSize:completion:`、`getContactsFromServerWithCompletion:`、`getContactsFromServerWithError:` | 这些接口从服务器拉取好友列表。5.0.0 已无好友列表服务端拉取入口；改用本地 `getAllContacts`、`getContacts` 或 `getContact:`，并在 `syncDataFinished:EMDataSyncTypeContacts` 成功后刷新。 |
| `EMOptions` | `enableAutoSyncContacts` | 该配置控制好友自动同步。改为在 `dataSyncType` 中包含 `EMDataSyncTypeContacts`。 |

相应地，`EMContactManagerDelegate#onFriendStartSync` 和 `onFriendSyncFinished:` 已删除。请改用 `EMClientDelegate#syncDataStartWithType:` 和 `syncDataFinished:type:`，并判断 `type` 是否包含 `EMDataSyncTypeContacts`。详见 [监听器回调变化汇总](#监听器回调变化汇总)。

## 已读回执体系重构

消息已读回执由逐条发送调整为批量发送；是否需要回执通过 `EMChatMessage.isNeedReadReceipt` 按消息设置；发送消息已读回执与清理会话未读数相互独立。旧 API 不提供兼容别名，属于不兼容变更。

### 发送消息已读回执与清除未读数

| 删除的 API | 5.0.0 替代 | 说明 |
| :--- | :--- | :--- |
| `IEMChatManager#sendMessageReadAck:toUser:completion:` | `sendMessageReadReceipts:completion:` | 批量发送消息已读回执，单聊和群聊统一使用。 |
| `IEMChatManager#sendGroupMessageReadAck:toGroup:content:completion:` | `sendMessageReadReceipts:completion:` | 不再为群聊提供单独的逐条已读回执接口，也不再通过 `content` 传递群消息已读回执中携带的自定义内容。 |
| `IEMChatManager#ackConversationRead:completion:` | `clearConversationUnreadMessageCount:completion:`，并按需调用 `sendMessageReadReceipts:completion:` | 旧接口发送会话级已读回执。5.0.0 将清除当前用户未读数与通知消息发送方拆为两个操作。 |
| `IEMChatManager#markAllConversationsAsRead` | `clearAllConversationUnreadMessageCount:` | 清除所有本地会话的未读数，并同步至当前用户的其他设备。 |
| `EMConversation#markMessageAsReadWithId:completion:`、`markAllMessagesAsRead:` | `IEMChatManager#clearConversationUnreadMessageCount:completion:` | 通过会话级接口清除本地未读数；不再由 `EMConversation` 修改消息已读态。 |
| 直接设置 `EMChatMessage.isRead` | 无公开 setter；使用未读数清理接口 | `isRead` 在 5.0.0 中变为只读属性，由 SDK 内部维护。 |
| `EMOptions.enableRequireReadAck` | 发送前设置 `EMChatMessage.isNeedReadReceipt = YES` | 删除全局已读回执开关，改为按消息指定是否需要已读回执。 |

`sendMessageReadReceipts:completion:` 每次最多接收 50 条属于同一会话的消息。消息的 `isNeedReadReceipt` 必须为 `YES`；该接口不会清除或修改会话的本地未读数，completion 仅返回本批操作的 `EMError`。

### 接收消息已读回执

iOS SDK 5.0.0 将单聊和群聊的实时已读回执统一通过 `EMChatManagerDelegate` 回调，不再分别使用单聊和群聊回调。

| 4.x 回调 | 5.0.0 回调 | 说明 |
| :--- | :--- | :--- |
| `EMChatManagerDelegate#messagesDidRead:` | `EMChatManagerDelegate#onMessageReadReceipts:` | 接收单聊消息的已读回执。 |
| `EMChatManagerDelegate#groupMessageDidRead:groupAcks:` | `EMChatManagerDelegate#onMessageReadReceipts:` | 接收群聊消息的已读回执。 |
| `EMChatManagerDelegate#onConversationRead:to:` | 无直接替代 | 会话级已读回执不再单独回调；消息级已读结果由 `onMessageReadReceipts:` 通知。 |
| `EMChatManagerDelegate#groupMessageAckHasChanged` | `EMChatManagerDelegate#groupMessageReadReceiptsHasChanged` | 群聊消息已读回执状态发生变化时触发，仅调整回调命名。 |

SDK 5.0.0 新增 `EMMessageReadReceipt`，用于统一描述消息已读回执：

- `messageId`：消息 ID。
- `conversationId`：会话 ID。
- `isPeerReceipt`：单聊中，对端是否已发送该消息的已读回执。
- `readCount`：群聊中，该消息的已读人数。

### 回执详情查询

| 4.x API | 5.0.0 API | 说明 |
| :--- | :--- | :--- |
| `asyncFetchGroupMessageAcksFromServer:groupId:startGroupAckId:pageSize:completion:` | `asyncFetchGroupMessageReadUsersFromServer:groupId:readReceiptId:pageSize:completion:` | 分页获取指定群消息的已读成员详情；返回 `EMCursorResult<EMGroupReadReceipt *>`、错误和总已读数。下一页将上一页游标传入 `readReceiptId`。 |
| 无 | `getGroupMessageReadReceipts:completion:` | 从服务器批量获取群消息的已读回执汇总；每次最多传入 20 条消息，且所有消息必须属于同一会话，返回 `EMMessageReadReceipt` 列表。 |

回执详情模型由 `EMGroupMessageAck` 替换为 `EMGroupReadReceipt`：

- `messageId`：群消息 ID。
- `readReceiptId`：已读回执 ID，也用于分页游标。
- `from`：发送已读回执的群成员，类型由字符串改为 `EMGroupMemberInfo`；其中 `role` 和 `joinTimestamp` 在该场景不可用。
- `readCount`：已读回执数量。
- `timestamp`：发送已读回执的时间戳。
- 原 `content` 属性已移除，服务端不再下发 ACK 扩展内容。

### EMMessage 已读相关方法重命名

| 4.x API | 5.0.0 API | 说明 |
| :--- | :--- | :--- |
| `EMChatMessage.isReadAcked` | `EMChatMessage.isPeerRead` | 判断消息对端是否已读；5.0.0 为只读属性。 |
| 可读写的 `EMChatMessage.isRead` | 只读的 `EMChatMessage.isRead` | 属性名不变，但 setter 被删除，消息的本地已读状态由 SDK 内部维护。 |
| `EMChatMessage.isNeedGroupAck` | `EMChatMessage.isNeedReadReceipt` | 单聊和群聊均适用；发送消息前设置是否需要已读回执。 |
| `EMChatMessage.groupAckCount` | `EMChatMessage.groupReadReceiptCount` | 获取群聊消息的已读人数；5.0.0 为只读属性。 |

### 多设备事件

`EMMultiDevicesEvent` 新增以下枚举值。当前账号在其他设备清除未读数后，当前设备通过 `EMMultiDevicesDelegate#multiDevicesConversationEvent:conversationId:conversationType:` 收到通知：

- `EMMultiDevicesEventConversationUnreadMessageCountCleared = 65`：其他设备清除了指定会话的未读数。
- `EMMultiDevicesEventAllConversationUnreadMessageCountCleared = 66`：其他设备清除了所有会话的未读数。

## 群组配置模型重构

iOS SDK 5.0.0 将群组可见性、入群审批和成员邀请权限从 `EMGroupStyle` 单一枚举改为 `EMGroupConfigs` 中的独立属性。**该调整不提供兼容层，升级时需要修改建群和群组配置代码。**

### `EMGroupStyle` 与 `EMGroupConfigs` 对照

| 4.x `EMGroupStyle`（已删除） | 5.0.0 `EMGroupConfigs` 配置 |
| :--- | :--- |
| `EMGroupStylePrivateOnlyOwnerInvite` | `isPublic = NO`，`allowInvites = NO` |
| `EMGroupStylePrivateMemberCanInvite` | `isPublic = NO`，`allowInvites = YES` |
| `EMGroupStylePublicJoinNeedApproval` | `isPublic = YES`，`joinApprovalRequired = YES` |
| `EMGroupStylePublicOpenJoin` | `isPublic = YES`，`joinApprovalRequired = NO` |

### `EMGroupOptions` 与 `EMGroupConfigs` 对照

| 4.x `EMGroupOptions`（已删除） | 5.0.0 `EMGroupConfigs` |
| :--- | :--- |
| `EMGroupStyle style` | `BOOL` 类型的 `isPublic`、`joinApprovalRequired` 和 `allowInvites`；默认值均为 `NO` |
| `NSInteger maxUsers = 200` | `NSInteger maxUsers = 200`，保持不变 |
| `BOOL IsInviteNeedConfirm = YES` | 属性和默认值保持不变 |
| `NSString *ext` | 属性保持不变；5.0.0 默认值为空字符串 |

### 相关 API 变化

| 4.x API | 5.0.0 API 或适配方式 |
| :--- | :--- |
| 同步 `createGroupWithSubject:description:invitees:message:setting:error:` | 已删除。使用 `createGroupWithSubject:avatar:description:invitees:message:setting:completion:`；`setting` 类型为 `EMGroupConfigs *`。该接口异步创建群组并支持设置群头像。 |
| `createGroupWithSubject:description:invitees:message:setting:completion:`（无 `avatar:` 参数） | 已删除。使用 `createGroupWithSubject:avatar:description:invitees:message:setting:completion:`；不设置头像时将 `avatar` 传为 `nil`。 |
| `createGroupWithSubject:avatar:description:invitees:message:setting:completion:` 的 `EMGroupOptions *setting` | 方法选择器保持不变，但 `setting` 类型改为 `EMGroupConfigs *`，用于提交拆分后的群组配置。 |
| `EMGroup.settings` 的 `EMGroupOptions *` 类型 | `EMGroup.settings` 的 `EMGroupConfigs *` 类型，用于读取群组配置。 |
| 无 | `updateGroupWithId:types:configs:completion:`：创建群组后，按 `types` 指定的字段更新群组配置。 |
| 无 | `EMGroupConfigsType`：包含 `EMGroupConfigsTypeAllowInvites`、`MaxUsers`、`InviteNeedConfirm`、`JoinApprovalRequired`、`IsPublic` 和 `Ext`，可按位或组合。 |

群名称、描述和头像不属于 `EMGroupConfigsType`，仍分别使用 `updateGroupSubject:forGroup:completion:`、`updateDescription:forGroup:completion:` 和 `updateGroupAvatar:groupId:completion:` 更新。

## 设备管理与鉴权

随密码登录下线，基于“用户 ID + 密码”的设备鉴权接口一并移除，5.0.0 保留基于“用户 ID + Token”的异步接口：

| 4.x API | 5.0.0 替代方式 | 接口说明 |
| :--- | :--- | :--- |
| `getLoggedInDevicesFromServerWithUsername:password:error:`、`getLoggedInDevicesFromServerWithUsername:password:completion:` | `getLoggedInDevicesFromServerWithUserId:token:completion:` | 查询指定账号当前已登录的设备列表；同步和异步密码版本均已删除。 |
| `kickDeviceWithUsername:password:resource:`、`kickDeviceWithUsername:password:resource:completion:` | `kickDeviceWithUserId:token:resource:completion:` | 踢出指定账号的某一登录设备；通过设备列表获取 `resource`。 |
| `kickAllDevicesWithUsername:password:`、`kickAllDevicesWithUsername:password:completion:` | `kickAllDevicesWithUserId:token:completion:` | 踢出指定账号的全部登录设备。 |

调用这些接口所需的目标用户 Token 应由可信的业务服务器提供，不应在客户端保存其他用户的密码。

## 其他删除的 API

### 无客户端替代

| 所属类 | 删除的 API | 接口说明 | 迁移建议 |
| :--- | :--- | :--- | :--- |
| `EMClient` | `registerWithUsername:password:` 及 completion 版本 | 注册 IM 账号。 | 通过服务端 REST API 完成注册。 |
| `EMClient` | `fetchTokenWithUsername:password:completion:` | 使用用户名和密码获取 Token。 | 由业务服务器获取 Token 并下发客户端。 |
| `EMClient` | `serviceCheckWithUsername:password:completion:`、`EMServerCheckType` | 检查账号、DNS、Token 和登录链路。 | 结合正常登录 completion、连接状态和 Token 过期回调诊断。 |
| `EMClient` | `statisticsManager`、`IEMStatisticsManager`、`EMStatisticsManager`、`EMChatMessageStatistics` 及相关枚举 | 查询消息数量、消息大小及附件大小等 SDK 统计数据。 | 由业务侧自行采集和统计。 |
| `IEMChatManager` | `reportMessageWithId:tag:reason:completion:` | 举报消息。 | 将消息 ID、举报类型和原因提交至 App Server。 |
| `IEMChatManager` | `importConversations:completion:` | 将会话列表导入本地数据库。 | 删除相关调用；依赖 SDK 数据同步和本地会话接口维护会话列表。 |
| `IEMGroupManager` | `getPublicGroupsFromServerWithCursor:pageSize:error:` 及 completion 版本 | 分页获取服务端公开群组列表。 | 由业务服务维护可发现的群组目录。 |
| `IEMGroupManager` | `searchPublicGroupWithId:error:` 及 completion 版本 | 按 ID 搜索公开群。 | 已知群 ID 时可按业务授权使用群详情接口；公开群搜索由业务服务提供。 |
| `IEMChatroomManager` | 同步和异步 `createChatroomWithSubject:description:invitees:message:...` | 创建聊天室。 | 通过服务端 REST API 创建聊天室。 |
| `IEMChatroomManager` | `destroyChatroom:`、`destroyChatroom:completion:` | 解散聊天室。 | 通过服务端 REST API 解散聊天室。 |

### 有替代方式的 API

| 4.x API | 5.0.0 API | 接口说明 | 迁移说明 |
| :--- | :--- | :--- | :--- |
| `modifyMessage:body:completion:` | `modifyMessage:body:ext:completion:` | 修改本地和服务端消息。 | 新增 `ext` 参数；`body` 与 `ext` 不能同时为 `nil`。 |
| `resendMessage:progress:completion:` | `sendMessage:progress:completion:` | 重新发送失败消息。 | 统一使用消息发送接口重新发送原消息对象。 |
| 同步 `fetchHistoryMessagesFromServer:conversationType:...` 及旧 `asyncFetchHistoryMessagesFromServer:...` 重载 | `fetchMessagesFromServerBy:conversationType:cursor:pageSize:option:completion:` | 分页获取服务端历史消息。 | 使用新的异步分页接口及 `EMFetchServerMessagesOption`。 |
| `IEMChatManager#loadMessagesWithType:timestamp:count:fromUser:searchDirection:` 的同步和旧异步重载 | `EMConversation#loadMessagesWithType:timestamp:count:fromUser:searchDirection:completion:` | 按消息类型从指定会话的本地数据库加载消息。 | 接口归属迁移到 `EMConversation`；在 completion 中处理消息列表和错误，避免阻塞调用线程。 |
| 旧 `loadMessagesWithKeyword:...` 重载 | `loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:scope:completion:` | 按关键字搜索本地消息。 | 新接口增加 `scope`，用于指定搜索消息内容或扩展字段。 |
| `EMImageMessageBody#initWithData:thumbnailData:`、`EMFileMessageBody#initWithData:displayName:` | `initWithLocalPath:displayName:` | 创建待发送的图片或文件消息体。 | 将 `NSData` 先保存为本地文件，再传入文件路径；显示名为空时 SDK 使用本地文件名。 |
| `EMChatMessage#getReaction:` | `EMChatMessage.reactionList` | 按 Reaction 内容获取消息 Reaction。 | 遍历 `reactionList` 并匹配目标 Reaction。 |
| `EMStreamChunk.sequenceNumber` | `EMStreamChunk.isComplete` | 判断流式消息分片状态。 | 5.0.0 不再公开分片序列号；使用只读属性判断流式消息是否完成。 |
| `EMGroup.isPushNotificationEnabled` | `EMConversation.disturbType`，或 `getSilentModeForConversation:conversationType:completion:` | 查询群组会话是否启用推送提醒。 | 从群会话或推送管理模块读取会话级免打扰配置。 |
| 群组管理同步接口：`addOccupants:`、`removeOccupants:`、`blockOccupants:`、`unblockOccupants:` 等 | `addMembers:toGroup:message:completion:`、`removeMembers:fromGroup:completion:`、`blockMembers:fromGroup:completion:`、`unblockMembers:fromGroup:completion:` | 添加、移除、拉黑或移出黑名单中的群成员。 | 使用对应的异步成员管理接口及 completion。 |
| `getGroupSpecificationFromServerWithId:error:`、`getGroupSpecificationFromServerWithId:fetchMembers:error:` | 对应的 `getGroupSpecificationFromServerWithId:completion:`、`getGroupSpecificationFromServerWithId:fetchMembers:completion:` | 获取群组详情，并可选择是否同时获取成员。 | 同步版本已删除，改用 completion 版本。 |
| `getGroupMemberListFromServerWithId:cursor:pageSize:error:` | `getGroupMemberListFromServerWithId:cursor:pageSize:completion:` | 分页获取群成员列表。 | 使用 completion 返回游标结果和错误。 |
| `getGroupBlacklistFromServerWithId:pageNumber:pageSize:error:`、`getGroupMuteListFromServerWithId:pageNumber:pageSize:error:` | 对应的 completion 版本 | 分页获取群黑名单或禁言列表。 | 同步版本已删除，改用 completion 版本。 |
| `getGroupWhiteListFromServerWithId:error:`、`isMemberInWhiteListFromServerWithGroupId:error:` | `getGroupWhiteListFromServerWithId:completion:`、`isMemberInWhiteListFromServerWithGroupId:completion:` | 获取群白名单或查询当前用户是否在群白名单中。 | 同步版本已删除，改用 completion 版本。 |
| `getGroupFileListWithId:pageNumber:pageSize:error:` | `getGroupFileListWithId:pageNumber:pageSize:completion:` | 分页获取群共享文件。 | 同步版本已删除，改用 completion 版本。 |
| `getGroupAnnouncementWithId:error:` | `getGroupAnnouncementWithId:completion:` | 获取群公告。 | 同步版本已删除，改用 completion 版本。 |
| `changeGroupSubject:forGroup:error:`、`changeDescription:forGroup:error:` | `updateGroupSubject:forGroup:completion:`、`updateDescription:forGroup:completion:` | 修改群名称或群描述。 | 使用异步接口，并在 completion 中获取更新后的群对象。 |
| `leaveGroup:error:`、`destroyGroup:`、`blockGroup:error:`、`unblockGroup:error:` | `leaveGroup:completion:`、`destroyGroup:finishCompletion:`、`blockGroup:completion:`、`unblockGroup:completion:` | 退出、解散、屏蔽或取消屏蔽群组。 | 同步版本已删除，改用 completion 版本。 |
| `updateGroupOwner:newOwner:error:`、`addAdmin:toGroup:error:`、`removeAdmin:fromGroup:error:` | 对应的 `updateGroupOwner:newOwner:completion:`、`addAdmin:toGroup:completion:`、`removeAdmin:fromGroup:completion:` | 转让群主或添加、移除群管理员。 | 同步版本已删除，改用 completion 版本。 |
| `muteMembers:muteMilliseconds:fromGroup:error:`、`unmuteMembers:fromGroup:error:`、`muteAllMembersFromGroup:error:`、`unmuteAllMembersFromGroup:error:` | 对应的 completion 版本 | 设置或解除部分成员、全体成员禁言。 | 同步版本已删除，改用 completion 版本。 |
| `addWhiteListMembers:fromGroup:error:`、`removeWhiteListMembers:fromGroup:error:` | 对应的 completion 版本 | 添加或移除群白名单成员。 | 同步版本已删除，改用 completion 版本。 |
| `removeGroupSharedFileWithId:sharedFileId:error:`、`updateGroupAnnouncementWithId:announcement:error:`、`updateGroupExtWithId:ext:error:` | 对应的 completion 版本 | 删除群共享文件、更新群公告或群扩展信息。 | 同步版本已删除，改用 completion 版本。 |
| `joinPublicGroup:error:`、`applyJoinPublicGroup:message:error:` | `joinPublicGroup:completion:`、`requestToJoinPublicGroup:message:completion:` | 直接加入公开群，或申请加入需要审批的公开群。 | 同步版本已删除；申请入群接口同时调整了方法名。 |
| `getGroupsWithoutPushNotification:` | `EMConversation.disturbType`，或 `getSilentModeForConversation:conversationType:completion:` | 获取关闭推送通知的群组。 | 旧群组级查询已删除，改为查询群会话的免打扰设置。 |
| `acceptJoinApplication:`、`declineJoinApplication:`、`acceptInvitationFromGroup:`、`declineInvitationFromGroup:` 的同步版本 | `approveJoinGroupRequest:sender:completion:`、`declineJoinGroupRequest:sender:reason:completion:`、`acceptInvitationFromGroup:inviter:completion:`、`declineGroupInvitation:inviter:reason:completion:` | 审批入群申请或处理群邀请。 | 使用语义更明确的异步接口，并提供申请人或邀请人 ID。 |
| 好友同步操作：`addContact:message:`、`addUserToBlackList:`、`removeUserFromBlackList:`、`acceptInvitationForUsername:`、`declineInvitationForUsername:`、`getSelfIdsOnOtherPlatformWithError:` | 对应的 completion 版本：`addContact:message:completion:`、黑名单操作、`approveFriendRequestFromUser:completion:`、`declineFriendRequestFromUser:completion:`、`getSelfIdsOnOtherPlatformWithCompletion:` | 添加好友、管理黑名单、处理好友申请及查询其他平台登录 ID。 | 使用保留的异步接口；本地黑名单通过 `getBlackList` 获取。 |
| `getBlackListFromServerWithError:` | `getBlackListFromServerWithCompletion:` | 从服务器获取当前用户的黑名单。 | 同步版本已删除，改用 completion 返回黑名单和错误。 |
| `IEMPushManager#updatePushDisplayStyle:`、`updatePushDisplayName:`、`getPushOptionsFromServerWithError:` | `updatePushDisplayStyle:completion:`、`updatePushDisplayName:completion:`、`getPushNotificationOptionsFromServerWithCompletion:` | 更新推送显示样式、显示名或获取服务端推送配置。 | 同步版本已删除，改为在 completion 中处理结果。 |

## 主要新增 API

| 所属类 | 新增 API | 接口说明 |
| :--- | :--- | :--- |
| `EMOptions` | `dataSyncType`、`EMDataSyncType` | 配置登录后自动同步会话、好友和已加入群组，可按位组合。 |
| `EMClientDelegate` | `onDatabaseOpened:username:`、`syncDataStartWithType:`、`syncDataFinished:type:` | 监听本地数据库打开及自动数据同步的开始和结束。 |
| `IEMChatManager` | `sendMessageReadReceipts:completion:` | 批量发送单聊或群聊消息已读回执；最多 50 条且必须属于同一会话。 |
| `IEMChatManager` | `clearConversationUnreadMessageCount:completion:`、`clearAllConversationUnreadMessageCount:` | 清除指定会话或全部会话的本地未读数，并同步至当前账号其他设备，不向发送方发送消息已读回执。 |
| `IEMChatManager` | `getGroupMessageReadReceipts:completion:` | 批量查询群消息已读回执汇总；最多 20 条且必须属于同一会话。 |
| `IEMChatManager` | `getUnreadMessageCount` | 获取本地会话未读消息总数；不统计聊天室和已设置免打扰的会话。 |
| `IEMChatManager` | `addConversationDelegate:delegateQueue:`、`removeConversationDelegate:` | 注册或移除会话列表更新代理，并可指定回调队列。 |
| `EMConversation` | `conversationName`、`conversationAvatar` | 获取会话展示名称和头像；单聊返回对端用户信息，群聊返回群组信息。相关数据未同步时可能为空。 |
| `IEMContactManager` | `saveBlackList:completion:` | 批量将用户加入黑名单，并通过 completion 返回操作错误。 |
| `IEMGroupManager` | `updateGroupWithId:types:configs:completion:` | 按 `EMGroupConfigsType` 指定的字段更新群组配置。 |
| `EMGroup` | `users` | 获取群主、管理员和普通成员在内的群组全部成员 ID；SDK 按角色合并数组，不执行去重。 |
| `EMMultiDevicesEvent` | `EMMultiDevicesEventConversationUnreadMessageCountCleared`、`EMMultiDevicesEventAllConversationUnreadMessageCountCleared` | 通知其他设备清除了单个会话或全部会话的未读数。 |

## 监听器回调变化汇总

实现类即使未使用 `@selector` 检查，旧回调被删除后也可能不会立即产生编译错误，但运行时将无法收到对应事件。升级时应逐项检查代理实现和代理注册位置。

| 监听器 | 4.x 回调 | 5.0.0 回调 | 回调说明 |
| :--- | :--- | :--- | :--- |
| `EMClientDelegate` | `autoLoginDidCompleteWithError:` | 无直接替代；使用 `loginWithUsername:token:completion:` | 主动 Token 登录完成通知。 |
| `EMClientDelegate` | `userAccountDidLoginFromOtherDevice:`、无参数的 `userAccountDidLoginFromOtherDevice` | `userAccountDidLoginFromOtherDeviceWithInfo:` | 当前账号在其他设备登录的通知；5.0.0 通过 `EMLoginExtensionInfo` 提供登录设备及扩展信息。 |
| `EMClientDelegate` | 无 | `onDatabaseOpened:username:` | 当前账号本地数据库打开完成；不代表业务数据同步完成。 |
| `EMClientDelegate` | 无 | `syncDataStartWithType:`、`syncDataFinished:type:` | 指定类型的数据同步开始和结束通知。 |
| `EMContactManagerDelegate` | `onFriendStartSync`、`onFriendSyncFinished:` | `EMClientDelegate#syncDataStartWithType:`、`syncDataFinished:type:` | 好友同步回调统一迁移至客户端代理，并通过 `EMDataSyncTypeContacts` 识别类型。 |
| `EMChatManagerDelegate` | `messagesDidRead:`、`groupMessageDidRead:groupAcks:` | `onMessageReadReceipts:` | 统一接收单聊和群聊的消息已读回执。 |
| `EMChatManagerDelegate` | `groupMessageAckHasChanged` | `groupMessageReadReceiptsHasChanged` | 群聊消息已读回执状态变化通知。 |
| `EMChatManagerDelegate` | `onConversationRead:to:` | 无直接替代 | 会话级已读回执回调已删除；按消息处理 `onMessageReadReceipts:`。 |
| `EMChatManagerDelegate` | `conversationListDidUpdate:` | `EMConversationDelegate#conversationListDidUpdate:` | 会话列表更新回调迁移到独立代理；使用 `addConversationDelegate:delegateQueue:` 注册。 |
| `EMGroupManagerDelegate` | `joinGroupRequestDidDecline:reason:`、`joinGroupRequestDidDecline:reason:applicant:` | `joinGroupRequestDidDecline:reason:decliner:applicant:` | 增加拒绝者 ID，并统一保留申请者 ID；旧两参数和三参数回调均已删除。 |
| `EMGroupManagerDelegate` | `userDidJoinGroup:user:` | `userDidJoinGroup:users:` | 由单个成员参数改为成员数组，一次可通知多名成员加入群组。 |
| `EMGroupManagerDelegate` | `userDidLeaveGroup:user:` | `userDidLeaveGroup:users:` | 由单个成员参数改为成员数组，一次可通知多名成员离开群组。 |

## 行为变化

以下变化可能不会全部触发编译错误，但会影响业务逻辑：

1. **未读消息总数的统计范围发生变化**

   `IEMChatManager#getUnreadMessageCount` 获取本地单聊和群聊会话的未读消息总数。该接口的统计范围如下：
   该接口的统计范围如下：

   - 不统计聊天室会话。
   - 不统计消息话题（Thread）的未读消息数。
   - 不统计推送通知方式为 `EMPushRemindTypeMentionOnly` 或 `EMPushRemindTypeNone` 的会话。这些会话即使存在未读消息，也不纳入统计。
   - 仅统计推送通知方式为 `EMPushRemindTypeAll` 的单聊和群聊会话。
  
  如果业务需要其他统计口径，应遍历 `getAllConversations` 并根据会话类型和 `disturbType` 自行累加 `unreadMessagesCount`。

2. **清除未读数不会发送消息已读回执**

   `clearConversationUnreadMessageCount:completion:` 只清除指定会话的本地未读数，并将结果同步至当前账号的其他设备，不会向消息发送方发送已读回执。如需通知发送方，还需对消息调用 `sendMessageReadReceipts:completion:`。

3. **初始化后不再自动登录**

   `initializeSDKWithOptions:` 完成后，SDK 不会依据历史登录记录自动登录。应用需要安全保存和更新 Token，并在适当时机主动调用 `loginWithUsername:token:completion:`。

4. **消息已读状态不再允许应用直接修改**

   `EMChatMessage.isRead` 在 5.0.0 中为只读属性，`EMConversation` 的逐条和全量标记已读接口也已删除。业务应使用会话未读数清理接口；消息已读回执则通过独立的批量回执接口发送。

5. **附件消息体不再接受 `NSData` 初始化**

   图片和文件消息体的 `initWithData:...` 初始化方法已删除。应用需先将附件保存到本地文件，再使用 `initWithLocalPath:displayName:` 创建消息体，并保证发送完成前文件路径有效。

6. **大量同步接口迁移为 completion 版本**

   Token 登录、群组管理、好友管理和推送配置等多项同步接口已删除。调用方不得依赖同步返回值，应在异步 completion 中处理成功、错误和 UI 刷新，避免在主线程上模拟同步等待。

7. **自动同步完成前，本地列表可能不完整**

   `onDatabaseOpened:username:` 只表示数据库可以访问。若 `dataSyncType` 包含相应类型，需要等待 `syncDataFinished:type:` 成功后，再将会话、好友或已加入群组的本地查询结果视为本次登录后的最新数据。

8. **新增多设备未读数同步事件**

   当前账号在其他设备清除会话未读数时，本端会通过 `multiDevicesConversationEvent:conversationId:conversationType:` 收到事件。收到 `EMMultiDevicesEventConversationUnreadMessageCountCleared` 或 `EMMultiDevicesEventAllConversationUnreadMessageCountCleared` 后，应重新读取本地会话并刷新 UI。
