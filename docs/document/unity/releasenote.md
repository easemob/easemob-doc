# Unity IM SDK 更新日志

<Toc />

## 版本 v1.1.0 Dev 2023-2-25（开发版）

#### 新增特性

- 依赖的原生平台 `iOS` 和 `Android` 的 SDK 升级为 v4.0.0 版本。
- 新增 `ChatManager#GetConversationsFromServerWithPage` 方法实现从服务器分页获取会话列表。
- 新增 `Message#Priority` 属性实现聊天室消息优先级功能，确保高优先级消息优先处理。
- 新增 `ChatManager#RemoveMessagesFromServer` 方法实现单向删除服务端历史消息。

#### 优化

调整 `SDKClient#InitWithOptions` 方法，增加返回结果，检查 App Key 格式。

#### 修复

修复登录时的部分 bug。

## 版本 V1.0.9 Dev 2022-12-30（开发版）

#### 新增特性

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
              
#### 优化

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

#### 新增特性

- 新增聊天室自定义属性功能。
- `ChatGroup` 中增加 `isDisabled` 属性显示群组禁用状态，需要开发者在服务端设置。该属性在调用 `IGroupManager` 中的 `GetGroupSpecificationFromServer` 方法获取群组详情时返回。
#### 优化

- 移除 SDK 一部分冗余日志；
- 将命名空间由 ChatSDK 改为 AgoraChat。
        
#### 修复

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

关于详细功能概述，请参见[产品概述](http://docs-im-beta.easemob.com/product/introduction.html)。

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