## v5.0.0 2026-7-31

#### 重大变更

**数据同步与本地数据访问**

新增统一的数据同步配置与状态回调。应用可通过 `EMOptions#dataSyncType` 配置登录后自动同步的会话、联系人和已加入群组数据，并通过 `EMClientDelegate` 获取各类数据的同步状态。

- `EMDataSyncType` 支持 `EMDataSyncTypeConversations`、`EMDataSyncTypeContacts`、`EMDataSyncTypeJoinedGroups` 和 `EMDataSyncTypeNone`，多个类型可按位组合。建议应用在调用 `initializeSDKWithOptions:` 前设置需要同步的数据类型。
- 新增 `syncDataStartWithType:` 和 `syncDataFinished:type:`，分别通知指定类型的数据同步开始和结束。
- 新增 `onDatabaseOpened:username:`。数据库打开后即可读取当前账号的本地数据，不必等待登录完成，有助于加快冷启动时的首屏展示。若需要展示本次登录后从服务端同步的最新数据，应等待对应类型的 `syncDataFinished:type:` 成功后再刷新界面。

联系人、会话和已加入群组数据可由 SDK 自动同步到本地，应用统一通过本地接口读取。主要接口变更如下：

| 数据类别     | 4.x API 或配置      | 5.0 API 或配置   | 
| :-------------- | :----- | :------- | 
| 联系人列表（联系人详情）   | `IEMContactManager#getAllContactsFromServerWithCompletion:`  | `IEMContactManager#getAllContacts`                           |
| 联系人列表（联系人用户 ID 列表）      | `IEMContactManager#getContactsFromServerWithCompletion:` <br/> `IEMContactManager#getContactsFromServerWithError:`   | `IEMContactManager#getContacts`                              | 
| 联系人分页列表   | `IEMContactManager#getContactsFromServerWithCursor:pageSize:completion:` | `IEMContactManager#getAllContacts`、`getContacts` 或 `getContact:` | 
| 会话列表         | `IEMChatManager#getConversationsFromServer:` <br/> `IEMChatManager#getConversationsFromServerByPage:pageSize:completion:`  <br/> `IEMChatManager#getConversationsFromServerWithCursor:pageSize:completion:`            | `IEMChatManager#getAllConversations` <br/> `getAllConversations:` | 
| 置顶会话         | `IEMChatManager#getPinnedConversationsFromServerWithCursor:pageSize:completion:` | `IEMChatManager#getAllConversations`  <br/> `getAllConversations:`，并读取 `EMConversation#isPinned` 和 `pinnedTime` | 
| 会话筛选         | `IEMChatManager#getConversationsFromServerWithCursor:filter:completion:` | `IEMChatManager#filterConversationsFromDB:filter:`  <br/> `getAllConversations` | 
| 已加入群组       | `IEMGroupManager#getJoinedGroupsFromServerWithPage:pageSize:needMemberCount:needRole:completion:` | `IEMGroupManager#getJoinedGroups`                            | 

**群组配置模型重构**

群组配置拆分为多个独立属性，并支持创建群组后按需更新指定配置。

- 新增 `EMGroupConfigs` 取代 `EMGroupOptions` 和 `EMGroupStyle`，使用 `isPublic`、`joinApprovalRequired`、`allowInvites`、`IsInviteNeedConfirm`、`maxUsers` 和 `ext` 等独立属性描述群组配置。
- 新增 `EMGroupConfigsType`，支持按位组合需要更新的配置字段。
- 新增 `updateGroupWithId:types:configs:completion:`，可在群组创建后按需更新指定配置。
- `EMGroup` 新增只读属性 `users`，用于读取该群组对象当前包含的群主、管理员和普通成员的用户 ID。群成员数据是否完整取决于该对象所包含的群详情数据。

**消息已读回执与未读数管理**

原有的单条消息回执、会话回执和全局回执开关已调整为批量消息回执和未读数清理接口，覆盖单聊和群聊场景。

- 新增 `sendMessageReadReceipts:completion:`，用于批量发送单聊或群聊消息的已读回执；同一批消息必须属于同一会话，且最多 50 条。
- 是否需要已读回执通过 `EMChatMessage#isNeedReadReceipt` 按消息设置。该属性取代旧的单聊全局配置方式，并同时适用于单聊和群聊。
- 新增 `EMMessageReadReceipt`，统一描述单聊和群聊消息已读回执；`onMessageReadReceipts:` 统一接收两类实时已读回执。
- 新增 `getGroupMessageReadReceipts:completion:`，可批量获取同一会话中最多 20 条群消息的已读回执汇总。
- 新增 `clearConversationUnreadMessageCount:completion:` 和 `clearAllConversationUnreadMessageCount:`，用于清除指定会话或全部会话的本地未读数，并将清理结果同步至当前账号的其他设备。清除未读数不会向消息发送方发送消息已读回执。
- 新增 `IEMChatManager#getUnreadMessageCount`，用于统计本地单聊和群聊会话的未读消息总数。该统计不包含聊天室、消息话题以及推送通知方式不是 `EMPushRemindTypeAll` 的会话。
- `EMMultiDevicesDelegate#multiDevicesConversationEvent:conversationId:conversationType:` 新增会话未读数清理事件，用于通知其他设备刷新本地会话状态。

**会话与联系人能力**

- 新增 `EMConversationDelegate`。通过 `addConversationDelegate:delegateQueue:` 注册后，可由 `conversationListDidUpdate:` 接收会话列表更新通知。
- 新增 `deleteConversations:isDeleteMessages:completion:`，支持批量删除会话，并可选择是否同时删除本地消息。
- `EMConversation` 新增 `conversationName` 和 `conversationAvatar`，用于获取会话显示名称和头像。单聊返回对端用户的信息，群聊返回群组的信息；相关资料尚未同步时可能为空。
- 新增 `IEMContactManager#saveBlackList:completion:`，用于保存本地黑名单数据。

#### 优化

**登录与账号**

- 客户端注册接口已移除，账号注册应由业务服务器实现。
- 登录统一使用 Token：保留 `loginWithUsername:token:completion:`，移除客户端注册、密码登录、密码换取 Token 以及旧 Agora Token 登录接口。应用应由业务服务器获取并安全保存 Token。
- 移除自动登录相关配置、状态和回调，包括 `EMOptions#isAutoLogin`、`EMClient#isAutoLogin` 和 `autoLoginDidCompleteWithError:`；应用需自行管理登录态和 Token。
- 设备管理统一使用 Token 鉴权。基于用户名和密码的多设备查询、踢出设备接口已移除，通过 `getLoggedInDevicesFromServerWithUserId:token:completion:` 查询设备，并通过 `kickDeviceWithUserId:token:resource:completion:` 或 `kickAllDevicesWithUserId:token:completion:` 移除登录设备。
- 当前账号在其他设备登录的通知统一为 `userAccountDidLoginFromOtherDeviceWithInfo:`，并通过 `EMLoginExtensionInfo` 返回登录设备及扩展信息。

**消息接口调整**

- 文件和图片消息体移除基于 `NSData` 的初始化方式，统一使用本地路径创建消息体，例如 `initWithLocalPath:displayName:`。
- 历史消息获取、本地消息搜索和服务端消息搜索接口统一使用保留的异步或分页接口。
- 消息修改、消息重发及合并消息附件下载解析等能力统一使用保留的异步接口。
- Reaction 相关接口统一通过保留的方法或属性读取数据，并移除已废弃的旧接口。
- `EMStreamChunk` 不再公开 `sequenceNumber`，使用 `isComplete` 判断流式消息是否已经完成。

**群组和聊天室接口调整**

- 移除分页获取公开群组列表及 `searchPublicGroupWithId` 系列接口。
- 已知群 ID 时，仍可按业务授权使用 `getGroupSpecificationFromServerWithId:completion:` 获取群详情。
- 加入公开群时，使用 `joinPublicGroup:completion:`；需要管理员审批时，使用 `requestToJoinPublicGroup:message:completion:` 提交入群申请。
- 聊天室创建和销毁接口已移除，相关管理操作需由 App Server 调用服务端 REST API 完成。
- 如需展示可加入的聊天室列表，应用应由业务服务器调用服务端 REST API 获取聊天室信息，再将结果返回给客户端展示。

**同步接口异步化**

- 群组成员管理、联系人管理、Token 登录、消息撤回和登出等同步接口已移除，改用带 completion 的异步接口。调用方应在 completion 中处理执行结果、错误和界面刷新。

**推送接口调整**

- 推送设置的同步接口已移除：
  - `updatePushDisplayStyle:` 改用 `updatePushDisplayStyle:completion:`。
  - `updatePushDisplayName:` 改用 `updatePushDisplayName:completion:`。
  - `getPushOptionsFromServerWithError:` 改用 `getPushNotificationOptionsFromServerWithCompletion:`。

**低频与历史 API 清理**

- 消息举报接口已移除，举报流程应由业务服务器处理。
- 服务检查等低频诊断接口已移除，应用应结合登录 completion、连接状态和 Token 过期回调进行诊断。
- `EMStatisticsManager`、消息统计模型及相关公开 API 已移除。如需统计消息数量、消息大小或附件大小，应由业务侧自行采集和计算。
- 移除会话、消息、联系人、群组和聊天室模块中一批已废弃、同步或使用旧式回调的 API。升级时应根据迁移指南中的替代 API 或实现建议完成适配。

#### 修复

- 修复发送文件、图片等附件消息时，若未设置 `displayName`，上传附件可能会有 2 MB 大小限制的问题。SDK 会自动使用本地文件名作为显示名。
- 修复账号在其他设备登录、被服务端移除或被禁用时，本地客户端状态未完整登出的问题。
