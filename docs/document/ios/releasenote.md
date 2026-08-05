# iOS IM SDK 更新日志

## v5.0.0 Dev

该版本于 2026 年 8 月 15 日发布。

本文重点说明功能和行为变化，具体的接口删除、重命名及替代方式请参见 [IM iOS SDK 5.0.0 迁移指南](migration_guide.html)。

#### 重要变更

**数据同步与本地数据访问**

SDK 新增统一的数据同步机制。应用可配置登录后需要自动同步的数据类型，包括会话、联系人和已加入群组，并通过统一的同步状态回调监听同步进度。

数据库打开和服务端数据同步分别对应不同阶段，应用可按以下步骤处理：

1. **配置同步范围**：通过 `EMOptions#dataSyncType` 配置登录后自动同步的数据类型，包括会话、联系人、已加入群组和不同步数据等。多个数据类型可按位组合，建议在调用 `initializeSDKWithOptions:` 前显式设置。
2. **读取本地数据**：`onDatabaseOpened:username:` 回调表示当前账号的本地数据库已打开。收到该回调后即可读取本地数据，不必等待登录完成，有助于加快冷启动时的首屏展示。
3. **监听服务端数据同步**：通过 `syncDataStartWithType:` 和 `syncDataFinished:type:` 监听指定类型的数据同步开始和结束。
4. **读取本次同步后的最新数据**：如需展示本次登录后从服务端同步的最新数据，应等待对应类型的 `syncDataFinished:type:` 回调成功后，再读取本地会话、联系人或已加入群组数据并刷新界面。

**群组配置模型重构**

群组配置由原来的样式或选项模型调整为独立属性模型。群组的公开性、入群审批、成员邀请、最大成员数和扩展信息等配置可以分别设置，并支持在群组创建后按需更新指定字段。

- `EMGroupConfigs` 用于保存群组配置的具体值。取代 `EMGroupOptions` 和 `EMGroupStyle`。
- `EMGroupConfigsType` 用于指定本次需要更新的配置字段。
- 创建群组时传入 `EMGroupConfigs`；更新群组配置时，同时传入 `EMGroupConfigs` 和 `EMGroupConfigsType`。
- `EMGroup` 提供群组成员用户 ID 列表，具体数据内容取决于当前群组对象是否已包含完整群详情。

**消息已读回执与未读数管理**

消息已读回执覆盖单聊和群聊场景，并调整为“消息级设置、批量发送、统一接收”的处理方式。清除本地未读数与向消息发送方发送已读回执相互独立。

1. 消息已读回执

- 已读回执改为批量发送，单聊和群聊统一处理。
- 是否需要发送已读回执，由每条消息的 `EMChatMessage#isNeedReadReceipt` 单独控制。
- 单聊和群聊的实时已读回执统一通过 `onMessageReadReceipts:` 接收。
- 群聊支持批量查询消息已读回执汇总。

2. 会话未读数管理

- SDK 提供本地会话未读消息总数统计。该统计不包含聊天室、消息话题以及推送通知方式不是 `EMPushRemindTypeAll` 的会话。
- 清除指定会话或全部会话的本地未读数后，清理结果会同步至当前账号的其他设备，但不会向消息发送方发送消息已读回执。
- 当其他设备清除会话未读数时，本端会收到多设备会话事件，应用应据此重新读取本地会话并刷新界面。

**会话与联系人能力**

SDK 补充会话列表监听、会话展示信息、批量删除会话和本地黑名单保存等能力：

- 新增 `EMConversationDelegate`，用于监听会话列表变化。
- 支持获取会话显示名称和头像。
- 支持批量删除会话，并可选择是否同时删除本地消息。
- 支持保存本地黑名单数据。

#### 优化

**登录与账号**

- 客户端注册接口已移除，账号注册应由业务服务器实现。
- 登录统一使用 Token，移除密码登录：保留 `loginWithUsername:token:completion:`，移除客户端注册、密码登录、密码换取 Token 以及旧 Agora Token 登录接口。应用应由业务服务器获取并安全保存 Token。
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

群组成员管理、联系人管理、Token 登录、消息撤回和登出、离线推送等同步接口已移除，改用带 completion 的异步接口。调用方应在 completion 中处理执行结果、错误和界面刷新。

**低频与历史 API 清理**

- 消息举报接口已移除，举报流程应由业务服务器处理。
- 服务检查等低频诊断接口已移除，应用应结合登录 completion、连接状态和 Token 过期回调进行诊断。
- `EMStatisticsManager`、消息统计模型及相关公开 API 已移除。如需统计消息数量、消息大小或附件大小，应由业务侧自行采集和计算。
- 移除会话、消息、联系人、群组和聊天室模块中一批已废弃、同步或使用旧式回调的 API。升级时应根据迁移指南中的替代 API 或实现建议完成适配。

#### 修复

- 修复发送文件、图片等附件消息时，若未设置 `displayName`，上传附件可能会有 2 MB 大小限制的问题。SDK 会自动使用本地文件名作为显示名。
- 修复账号在其他设备登录、被服务端移除或被禁用时，本地客户端状态未完整登出的问题。
