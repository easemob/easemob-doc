# Unity IM SDK 更新日志

<Toc />

## 版本 V1.2.0 Dev 2023-8-30 （开发版）

### 新增特性

- [IM SDK] 新增[合并转发消息功能](message_send_receive.html#发送和接收合并消息)：
  - `MessageBodyType#COMBINE`：合并消息类型；
  - `CombineBody`：消息体类 ；
  - `Message#CreateCombineSendMessage`：创建合并消息；
  - `ChatManager#FetchCombineMessageDetail`：下载并解析合并消息。
- [IM SDK] 新增[消息修改功能](message_modify.html)：
  - `ChatManager#ModifyMessage`：修改消息；
  - `IChatManagerDelegate#OnMessageContentChanged`：消息修改回调，接收方会收到该回调。
  - `IMessageBody#OperationTime`：修改消息中内容修改的时间。
  - `IMessageBody#OperatorId`：修改消息中的操作人的用户 ID。
  - `IMessageBody#OperationCount`：发送后消息修改的次数。
- [IM SDK] 调整 `IConnectionDelegate#OnLoggedOtherDevice(intString)` 回调，新增当前设备踢下线的设备名称。
- [IM SDK] 新增 `IConnectionDelegate#OnAppActiveNumberReachLimitation` 回调，App 激活数量已达限制值。
- [IM SDK] 新增 `IMultiDeviceDelegate#OnRoamDeleteMultiDevicesEvent` 回调，多端多设备单个会话删除漫游消息事件。
- [IM SDK] 新增 `IMultiDeviceDelegate#OnConversationMultiDevicesEvent` 回调，多端多设备会话操作事件。
- [IM SDK] 新增以下方法支持用户 token：
  - `SDKClient#GetLoggedInDevicesFromServerWithToken`：获取指定账号下登录的在线设备列表；
  - `SDKClient#KickDeviceWithToken`：将指定账号登录的指定设备踢下线；
  - `SDKClient#KickAllDevicesWithToken`：将指定账号登录的所有设备都踢下线。
- [IM SDK] 新增[会话置顶功能](conversation_pin.html#置顶-取消置顶会话)：
  - `IChatManager#PinConversation`：置顶或取消置顶会话；
  - `Conversation#IsPinned`：判断该会话是否被置顶；
  - `Conversation#PinnedTime`：会话置顶时间戳。
- [IM SDK] 新增 `ChatManager#FetchHistoryMessagesFromServerBy` 方法[根据消息拉取参数配置类 `FetchServerMessagesOption` 从服务器获取历史消息](message_retrieve.html#从服务器获取指定会话的历史消息)。<br/>
  作废 `ChatManager#GetConversationsFromServer`。
- [IM SDK] 新增消息拉取参数配置类 `FetchServerMessagesOption`：
  - `FetchServerMessagesOption#IsSave`：获取的消息是否保存到数据库;
  - `FetchServerMessagesOption#Direction`：消息搜索方向;
  - `FetchServerMessagesOption#From`：消息发送方的用户 ID;
  - `FetchServerMessagesOption#MsgTypes`：要查询的消息类型列表;
  - `FetchServerMessagesOption#StartTime`：消息查询的起始时间;
  - `FetchServerMessagesOption#EndTime`：消息查询的结束时间。
- [IM SDK] 新增 `GetConversationsFromServerWithCursor` 方法[从服务端分页获取会话列表](conversation_list.html#从服务器分页获取会话列表)。
- [IM SDK] 新增[在群组或聊天室中发送定向消息功能](message_send_receive.html#发送和接收定向消息)：
  - `Message#ReceiverList`：设置群组或聊天室消息接收列表。
- [IM SDK] 新增 `Conversation#DeleteMessages`方法删除本地数据库中指定时间段的消息。
- [IM SDK] 新增[群组成员自定义属性管理功能](group_members.html#管理群成员的自定义属性)：
  - `GroupManager#FetchMemberAttributes`：获取群组成员自定义属性；
  - `GroupManager#SetMemberAttributes`：设置群组用户自定义属性；
  - `IGroupManagerDelegate#OnUpdateMemberAttributesFromGroup`：群成员自定义属性发生改变。
- [IM SDK] 新增多设备操作事件：
  - `MultiDevicesOperation#SET_METADATA`：在其他设备上设置了群组成员自定义属性；
  - `MultiDevicesOperation#DELETE_METADATA`：在其他设备上删除了群组成员自定义属性；
  - `MultiDevicesOperation#GROUP_MEMBER_METADATA_CHANGED`：群组成员自定义属性发生改变；
  - `MultiDevicesOperation#CONVERSATION_PINNED`：会话被置顶；
  - `MultiDevicesOperation#CONVERSATION_UNPINNED`：会话被取消置顶；
  - `MultiDevicesOperation#CONVERSATION_DELETED`：会话被删除。
- [IM SDK] 新增 Reaction 操作类 `MessageReactionOperation`：
  - `MessageReactionOperation#UserId`：操作者；
  - `MessageReactionOperation#Reaction`：发生变化的 Reaction。
- [IM SDK] 新增[自定义设备的平台和名称功能](multi_device.html#设置登录设备的名称)：
  - `Options#CustomOSType`：设置自定义平台代号；
  - `Options#CustomDeviceName`：设置当前设备自定义设备名称。
- [IM SDK] 新增 `Message#DeliverOnlineOnly` 字段设置消息是否只投递给在线用户；
- [IM SDK] 新增以下 `Options` 选项：
  - `Options#SDKDataPath`：设置 SDK 数据的底层存储路径；
  - `Options#MyUUID`：设置自定义设备 UUID；
  - `Options#EnableEmptyConversation`：从数据库加载会话时，是否允许加载空会话。

### 优化

- [IM SDK] 支持 masOS 上 ARM64 模式。
- [IM SDK] `kickAllDevice` 重命名为 `KickAllDevice`。
- [IM SDK] 修改 `MessageReaction` 中拼写错误：`Rection` 修改为 `Reaction`。
- [IM SDK] 修改 `MessageBody` 中以下属性名称中的拼写错误：
  - `ThumbnaiRemotePath` 修改为 `ThumbnailRemotePath`；
  - `ThumbnaiSecret` 修改为 `ThumbnailSecret`；
  - `ThumbnaiDownStatus` 修改为 `ThumbnailDownStatus`。

### 修复

- [IM SDK] 修复 SDK 回调时找不到回调句柄的问题；
- [IM SDK] 修复 SDK 在未初始化时对底层资源的释放；
- [IM SDK] 修复安卓、IOS 在更新用户属性时的一些问题；

## 版本 V1.1.1 Dev 2023-5-29 

### 修复

1. 修复 [`ChatManager#FetchHistoryMessageFromServer`](conversation_list.html#从服务器分页获取会话列表) 方法在安卓环境下调用失败的问题。
2. 修复在安卓环境下发送视频消息没有回调的问题。

## 版本 V1.1.0 Dev 2023-2-25

### 新增特性

- 依赖的原生平台 `iOS` 和 `Android` 的 SDK 升级为 v4.0.0 版本。
- 新增 `ChatManager#GetConversationsFromServerWithPage` 方法实现从服务器分页获取会话列表。
- 新增 `Message#Priority` 属性实现聊天室消息优先级功能，确保高优先级消息优先处理。

### 优化

调整 `SDKClient#InitWithOptions` 方法，增加返回结果，检查 App Key 格式。

### 修复

- 修复登录时的部分 bug。
- 修复发送的消息的已读标识为 `false` 的问题。修复后，发送消息时将已读标识设置为 `true`。
- 数据库加密文件名生成错误问题。该问题只发生在 Unity 框架下的 Window 和 Mac 平台。建议升级到 v1.1.0 后，使用历史数据时首先从服务端拉取数据。

## 版本 V1.0.9 Dev 2022-12-30（开发版）

### 新增特性

1. `SDKClient` 类中新增以下方法:

- `GetLoggedInDevicesFromServer`：获取通过指定账号登录的在线设备列表。
- `KickDevice`：将指定账号登录的指定设备踢下线。
- `kickAllDevices`：将指定账号登录的所有设备都踢下线。

2. `RoomManager` 类中新增以下方法：

- `FetchAllowListFromServer`：从服务器获取聊天室白名单列表。
- `CheckIfInRoomAllowList`：检查当前用户是否在聊天室白名单中。
- `GetChatRoom`：从内存中获取指定聊天室的详情。
- `UnMuteAllRoomMembers`：解除对所有聊天室成员的禁言。

3. `IRoomManagerDelegate` 类中新增以下回调方法:

- `OnSpecificationChangedFromRoom`：聊天室信息有更新。
- `OnAddAllowListMembersFromChatroom`：有成员加入聊天室白名单。
- `OnRemoveAllowListMembersFromChatroom`：有成员被移出聊天室白名单。
- `OnRemoveFromRoomByOffline`：成员因为离线被移出聊天室。

4. `IConnectionDelegate` 类中新增以下回调方法：

- `OnLoggedOtherDevice`：当前登录账号在其它设备登录时会收到此回调。
- `OnRemovedFromServer`：当前登录账号已经被从服务器端删除时会收到该回调。
- `OnForbidByServer`：当前用户账号被禁用时会收到该回调。
- `OnChangedIMPwd`：当前登录账号因密码被修改被强制退出。
- `OnLoginTooManyDevice`：当前登录账号因达到登录设备数量上限被强制退出。
- `OnKickedByOtherDevice`：当前登录设备账号被登录其他设备的同账号踢下线。
- `OnAuthFailed`：当前登录设备账号因鉴权失败强制退出。

5. `Group` 类中新增以下属性：

- `IsMemberOnly`：表示群组不能自由加入，需要申请或者被邀请。
- `IsMemberAllowToInvite`：群组是否允许成员邀请。
- `MaxUserCount`：群允许加入的最大成员数。
- `Ext`：自定义群组扩展信息。
- `IsDisabled`：群组是否禁用。  


### 优化

1. 命名空间由 ChatSDK 修改为 AgoraChat。
2. 各方法中的 `handle` 参数重命名为 `callback`。
3. 移除了 `pushmanager` 类。
4. `UserInfo` 类中的字段名均改为首字母大写。
5. `Message` 类中的 `AttributeValue` 子类移除了 `UINT32` 和 `JSONSTRING` 类型。
6. `OnDisconnected` 方法中移除整型参数 `i`。
7. 以下方法的返回结果进行了调整：

- `importmessage` 的返回结果由直接返回调整为异步回调。
- `GetGroupMuteListFromServer` 的返回结果的数据类型由 `List<string>` 调整为 `Dictionary<string, string>`。
- `FetchRoomMuteList` 的返回结果的数据类型由 `List<string>` 调整为 `Dictionary<string, string>`。

8. `GroupManager` 类中的以下方法进行了重命名:

- `AddGroupWhiteList` 重命名为 `AddGroupAllowList`。
- `CheckIfInGroupWhiteList` 重命名为 `CheckIfInGroupAllowList`。
- `GetGroupWhiteListFromServer` 重命名为 `GetGroupAllowListFromServer`。
- `RemoveGroupWhiteList` 重命名为 `RemoveGroupAllowList`。

9. `RoomManager` 类中的以下方法进行了重命名:

- `AddWhiteListMembers` 重命名为 `AddAllowListMembers`。
- `RemoveWhiteListMembers` 重命名为 `RemoveAllowListMembers`。

10. `Message` 类中的 `ReactionList` 由属性调整为了方法。
11. `Group` 类的 `Options` 中的属性仅对内开放，不对外开放。
12. `IGroupManagerDelegate` 类中进行了以下调整:

- `OnAddWhiteListMembersFromGroup` 方法重命名为 `OnAddAllowListMembersFromGroup`。
- `OnRemoveWhiteListMembersFromGroup` 方法重命名为 `OnRemoveAllowListMembersFromGroup`。
- `OnInvitationAcceptedFromGroup` 方法中移除了 `reason` 参数。
- `OnRequestToJoinDeclinedFromGroup` 方法中移除了 `groupName` 和 `decliner` 参数。

## 版本 V1.0.8 Dev 2022-9-30（开发版）

### 新增特性

- 新增聊天室自定义属性功能。
- `ChatGroup` 中增加 `isDisabled` 属性显示群组禁用状态，需要开发者在服务端设置。该属性在调用 `IGroupManager` 中的 `GetGroupSpecificationFromServer` 方法获取群组详情时返回。

#### 优化

- 移除 SDK 一部分冗余日志；
- 将命名空间由 ChatSDK 改为 AgoraChat。

### 修复

1. 修复极少数场景下，从服务器获取较大数量的消息时失败的问题。
2. 修复数据统计不正确的问题。
3. 修复极少数场景下打印日志导致的崩溃。
4. 修复连接监听器有时无法接收到连接回调的问题。

## 版本 V1.0.5 2022-08-12

这是环信即时通讯 IM Unity SDK 第一个正式发布的版本，包含以下功能：

- 在单聊、群聊、聊天室和子区中发送和接收消息；
- 管理会话和消息；
- 管理群组和聊天室；
- 用户在线状态订阅；
- 消息表情回复；
- 管理子区等。

关于详细功能概述，请参见[产品概述](https://doc.easemob.com/product/introduction.html)。

具体集成请参考以下文档：

- [开通配置环信即时通讯 IM 服务](/product/enable_and_configure_IM.html)
- [环信即时通讯 IM Unity 快速入门](quickstart.html)
- [消息管理 Unity](message_overview.html)
- [群组 Unity](group_overview.html)
- [聊天室 Unity](room_overview.html)
- [在线状态订阅 Unity](presence.html)
- [消息表情回复 Unity](reaction.html)
- [管理子区 Unity](thread.html)
- [Unity API Reference](apireference.html)
