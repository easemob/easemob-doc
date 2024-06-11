# Flutter IM SDK 更新日志

<Toc />

## 版本 V4.6.1 2024-6-11

### 新增特性

- 撤回消息方法 `recallMessage` 中增加了 `ext` 参数（字符串类型），支持消息撤回时携带自定义信息。
- 新增消息撤回事件 `EMChatEventHandler#onMessagesRecalledInfo`, 支持离线期间撤回的消息通知给接收方。

### 修复

- 修复服务端获取好友列表（包含好友备注）时，在好友列表无变化时，第二次请求获取不到数据的问题。
- 修复特殊情况下附件发送失败，消息仍然成功发送的问题。
- 修复拉取漫游消息时 nextkey 错误的问题。
- 修复安卓部分场景下，用户升级数据库后，在同一个进程下登录新的用户，构建数据库表失败的问题。

## 版本 V4.5.0 2024-5-7

### 新增特性

- 新增 `EMChatManager#deleteAllMessageAndConversation` 方法，用于[清空当前用户的聊天记录](message_delete.html#清空聊天记录)，包括消息和会话，同时可以选择是否清除服务端的聊天记录。
- 新增[根据搜索范围搜索消息](message_search.html#根据搜索范围搜索所有会话中的消息)：根据关键字搜索消息时，可以选择 `MessageSearchScope` 中的搜索范围。
  - `MessageSearchScope`：包含三个消息搜索范围，即搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。
  - `EMChatManager#loadMessagesWithKeyword`：根据搜索范围搜索所有会话中的消息。
  - `EMConversation#loadMessagesWithKeyword`：根据搜索范围搜索当前会话中的消息。
- 支持[会话标记](conversation_mark.html)功能。
  - `ConversationFetchOptions` 从服务器获取会话的选项，可以用来回去置顶会话或者是标记后的会话。
  - `EMChatManager#addRemoteAndLocalConversationsMark`：标记会话。
  - `EMChatManager#deleteRemoteAndLocalConversationsMark`：取消标记会话。
  - `EMChatManager#fetchConversationsByOptions`：根据 `ConversationFetchOptions` 选项从服务器分页查询会话列表。
  - `EMConversation#marks`：获取本地单个会话的所有标记。
  - `EMChatMultiDevicesEvent#CONVERSATION_UPDATE_MARK`：多设备场景下的会话标记事件。当前用户在一台登录设备上更新了会话标记，包括添加和移除会话标记，其他登录设备会收到该事件。
- 支持[聊天室漫游消息](message_retrieve.html#从服务器获取指定会话的消息)。
- 新增 `EMChatOptions#useReplacedMessageContents` 开关。开启后，发送消息时如果被内容审核进行了内容替换，发送方可以收到替换后的内容。
- 新增[置顶消息](message_pin.html)功能。
  - 新增 `EMChatManager#pinMessage` 方法，用于置顶消息。
  - 新增 `EMChatManager#unpinMessage` 方法，用于取消置顶消息。
  - 新增 `EMChatManager#fetchPinnedMessages` 方法，从服务器获取指定会话的置顶消息。
  - 新增 `EMConversation#loadPinnedMessages` 方法，返回会话下的所有置顶消息。
  - 新增 `MessagePinInfo` 类，包含消息置顶的操作者以及置顶时间。
  - 新增 `EMChatMessage#pinInfo` 方法，展示消息的置顶详情。
  - 新增 `EMChatEventHandler#onMessagePinChanged` 事件。当用户在群组或聊天室会话进行置顶操作时，群组或聊天室中的其他成员会收到该回调。
- 新增 `EMOptions#messagesReceiveCallbackIncludeSend` 开关。开启后，在 `EMChatEventHandler#onMessagesReceived` 回调里增加发送成功的消息。
- 加入聊天室时，若传入的聊天室 ID 不存在，可实现[自动创建聊天室](room_manage.html#加入聊天室)。
- 消息修改回调 `EMChatEventHandler#onMessageContentChanged` 中支持返回[通过 RESTful API 修改的自定义消息](/document/server-side/message_modify_text_custom.html)。

### 优化

- `EMChatManager#fetchConversation` 和 `EMChatManager#fetchPinnedConversations` 方法废弃，使用 `EMChatManager#fetchConversationsByOptions` 方法替代。
- 支持使用消息 body 完成[单条转发](message_forward.html)，无需重新上传附件。
- 在部分场景下，降低接收到大量群成员事件通知时获取群组详情的次数。
- 在[聊天室成员进出时更新聊天室成员人数](room_manage.html#实时更新聊天室成员人数)，使人数更新更及时准确。   
- 优化 token 登录时的错误提示信息，使错误提示更精细。   
- 优化将所有会话置为已读的时间。    
- 优化 SDK 内部随机取服务器地址的逻辑，提升请求成功率。   
- 优化进出聊天室超时时间。   
- 优化部分场景下连接失败后重连的逻辑。  
- 优化附件类型消息发送时中的附件上传，支持分片上传。    
- 优化发消息时重试的逻辑。
- Android/iOS SDK 移除网络请求时对 `NetworkOnMainThreadException` 异常的捕获。
- 数据库升级逻辑优化。  
- 单个日志文件大小由 2 MB 提升到 5 MB。
- iOS 平台增加了隐私协议 `PrivacyInfo.xcprivacy`。
- Android 平台适配 Android 14 Beta：适配以 Android 14 为目标平台时动态注册广播接收者必须设置 `RECEIVER_EXPORTED` 或者 `RECEIVER_NOT_EXPORTED` 的规定。

### 修复

- 特殊场景下，SDK 退出后再登录会丢失聊天室监听事件问题。
- 部分场景下群成员人数计算重复问题。
- 修复数据上报模块偶现的崩溃问题。
- 修复部分场景下调用 `EMChatManager#updateMessage` 方法更新消息时导致的崩溃问题。

## 版本 V4.2.0 2024-1-4

### 新增特性

- 新增[设置好友备注功能](user_relationship.html#设置好友备注)。
- 新增 `EMContactManager#fetchContacts` 和 `EMContactManager#fetchAllContacts` 方法分别[从服务器一次性和分页获取好友列表](user_relationship.html#从服务端获取好友列表)，每个好友对象包含好友的用户 ID 和好友备注。从服务器一次性获取好友列表（只包含好友的用户 ID）的原接口 `getAllContactsFromServer` 已废弃，由 `fetchAllContactIds` 替换。
- 新增 `EMContactManager#getContact` 方法[从本地获取单个好友的用户 ID 和好友备注](user_relationship.html#从本地获取好友列表)。
- 新增 `EMContactManager#getAllContacts` 方法[从本地一次性获取好友列表](user_relationship.html#从本地获取好友列表)，每个好友对象包含好友的用户 ID 和好友备注。一次性获取本地好友列表（只包含好友的用户 ID）的原接口 `getAllContactsFromDB` 已废弃，由 `getAllContactIds` 替换。
- 新增 `EMMessage#isBroadcast` 属性用于判断该消息是否为聊天室全局广播消息。可通过[调用 REST API 发送聊天室全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。
- 新增 `EMGroupManager#fetchJoinedGroupCount` 方法用于[从服务器获取当前用户已加入的群组数量](group_manage.html#查询当前用户已加入的群组数量)。
- 新增[错误码 706](/document/android/error.html)，表示聊天室所有者不允许离开聊天室。若初始化时，`EMOptions#isChatRoomOwnerLeaveAllowed` 参数设置为 false，聊天室所有者调用 `EMChatRoomManager#leaveChatroom` 方法离开聊天室时会提示该错误。
- 新增 `EMOptions#enableEmptyConversation` 属性用于在初始化时配置获取会话列表时是否允许返回空会话。
- 申请入群被拒绝的回调 `EMGroupEventHandler#onRequestToJoinDeclinedFromGroup` 中新增 decliner 和 applicant 参数表示申请者和拒绝者的用户 ID。

### 优化

- 统一 Agora Token 和 EaseMob Token 登录方式，原 `EMClient#login` 方法废弃，使用 `EMClient#loginWithToken` 和 `EMClient#loginWithPassword` 方法代替。此外，新增 EaseMob Token 即将过期及已过期的回调，即 EaseMob Token 已过期或有效期过半时也返回 `EMConnectionEventHandler#onTokenDidExpire` 和 `EMClientDelegate#onTokenWillExpire` 回调。

### 修复

- 修复网络恢复时重连 2 次的问题。
- 修复未登录时调用 leaveChatroom 方法返回的错误提示不准确。

## 版本 V4.1.3 2023-11-1

### 新增

- 支持安卓 14;
- 新增 `EMOptions#enableHonorPush` 方法用于开启荣耀推送。

### 修复

- 修复调用 `EMChatManager#getThreadConversation` 报错；
- 修复 `EMMessage#chatThread` 方法报错;
- 修复 `EMChatRoomEventHandler#onSpecificationChanged` 回调不执行；
- 修复 `EMChatThreadManager#fetchChatThreadMembers` 崩溃；
- 修复特殊场景下，安卓平台退出后再登录会丢失聊天室监听事件问题；
- 修复修改消息后，离线用户上线后拉取历史消息，消息体中缺乏 `from` 属性的问题。

## 版本 4.1.0 2023-8-16

### 新增特性

- 新增[自定义设备的平台和名称功能](multi_device.html#设置登录设备的名称)；
  - 新增 `EMOptions#osType` 属性和 `EMOptions#deviceName` 属性，用户设置设备类型和设备名称。
- 新增[合并转发消息功能](message_send_receive.html#发送和接收合并消息)：
  - 新增 `Combine` 消息类型，用于合并转发消息；
  - 新增 `EMChatManager#fetchCombineMessageDetail` 方法，获取合并消息中的原始消息列表;
- 新增[消息修改功能](message_modify.html)：
  - 新增 `EMChatManager#modifyMessage` 方法用户修改已发送的消息，目前只支持文本消息;
  - 新增 `EMChatEventHandler#onMessageContentChanged` 回调，用户监听消息修改实现；
- 新增[会话置顶功能](conversation_pin.html#置顶-取消置顶会话)：
  - 新增 `EMChatManager#pinConversation` 方法，实现在服务器会话列表中置顶/取消置顶会话；
  - 新增 `EMChatManager#fetchPinnedConversations` 方法，从服务器获取已置顶会话；
- [以下方法新增支持用户 token](multi_device.html#获取指定账号的在线登录设备列表)：  
  - 新增 `EMClient#fetchLoggedInDevices` 方法，可使用 token 获取已登录的设备列表；
  - 新增 `EMClient#kickDevice` 方法，可以使用 token 踢掉指定设备；
  - 新增 `EMClient#kickAllDevices` 方法，可以使用 token 踢掉所有已登录设备；
- 新增 `EMChatManager#fetchConversation` 方法，[获取服务器会话列表](conversation_list.html#从服务器分页获取会话列表)，原方法 `EMChatManager#getConversationsFromServer` 作废；
- 新增 `EMMessage#receiverList` 属性，用于在群组/聊天室中[发送定向消息](message_send_receive.html#发送和接收定向消息)；

### 优化

- 离开聊天室回调 `EMChatRoomEventHandler#onRemovedFromChatRoom` 中增加离开原因;
- 被其他设备踢下线 `EMConnectionEventHandler#onUserDidLoginFromOtherDevice` 回调中增加操作人的设备名称 `deviceName`;

### 修复

- 修复 ios 中无法收到 `EMConnectionEventHandler#onConnected` 和 `EMConnectionEventHandler#onDisconnected` 的问题；
- 修复某些场景下，发送方发送 Android 消息时添加的 string 类型扩展属性在接收方侧变为 int 类型的问题。

## 版本 V4.0.2

### 新增特性

- [新增管理群成员属性功能](group_members.html#管理群成员的自定义属性)：
    - 新增 `GroupManager#setMemberAttributes` 方法，用于设置群成员属性；
    - 新增 `GroupManager#fetchMemberAttributes` 和 `GroupManager#fetchMembersAttributes` 方法用于用户获取群成员属性；
    - 新增 `GroupEventHandler#onAttributesChangedOfGroupMember` 群成员属性变更回调;
- 新增 `ChatManager#fetchHistoryMessagesByOption` 方法，用于[根据消息拉取参数配置类（`FetchMessageOptions`）从服务器分页获取指定会话的历史消息](message_retrieve.html#从服务器获取指定会话的消息)。`FetchMessageOptions` 类中包括起始时间戳、消息类型和消息发送方等参数；
- 新增 `Conversation#deleteMessagesWithTs` 方法，用于从本地数据库中删除指定时间段内的消息；
- 新增 `Message#deliverOnlineOnly` 属性用于设置只向在线用户投递消息；

### 修复

- 修复安卓热重载（hot reload）后回调多次的问题；
- 修复 iOS 获取聊天室属性 key 传 null 导致的崩溃问题；

### 优化

- 为`ChatManager#fetchHistoryMessages` 方法增加获取方向；

## 版本 4.0.0+7

### 修复

- 修复初始化无返回的问题。

## 版本 4.0.0+6

### 修复

- 修复下载附件结束后状态不准确的问题。

## 版本 4.0.0+5

### 修复

- 修复下载附件回调不执行。

## 版本 4.0.0+4

### 修复

- 安卓构建视频消息崩溃的问题。

## 版本 4.0.0+3

### 修复

- 安卓 `onRemovedFromChatRoom` 不回调。

## 4.0.0+2

### 修复

- 修复`List<String>?` 转换失败；
- 修复图片消息和视频消息转换失败；

## 版本 4.0.0

### 新增特性

- 依赖的原生平台 `iOS` 和 `Android` 的 SDK 升级为 v4.0.0 版本。
- 新增 `EMChatManager#fetchConversationListFromServer` 方法实现从服务器分页获取会话列表。
- 新增 `EMMessage#chatroomMessagePriority` 属性实现聊天室消息优先级功能，确保高优先级消息优先处理。

### 优化

修改发送消息结果的回调由 `EMMessage#setMessageStatusCallBack` 修改为 `EMChatManager#addMessageEvent`。

### 修复

修复 `EMChatManager#deleteMessagesBeforeTimestamp` 执行失败的问题。

## 版本 3.9.9+1

### 修复

1. 修复 ios 群已读回执不执行；

## 新增特性

1. 增加会话根据时间删除服务器漫游消息 api `EMConversation#removeServerMessageBeforeTimeStamp(timestamp)`。

## 版本 3.9.9

### 修复：

1.修复极端情况下 SDK 崩溃的问题。

## 版本 3.9.7+4

### 修复

1. 安卓不执行 onGroupDestroyed 回调；
2. 构造位置消息时无法设置 buildingName；

## 版本 3.9.7+3

### 修复

1. 安卓不会执行 onAutoAcceptInvitationFromGroup 回调；

## 版本 3.9.7+2

### 修复

1. 修复 StartCallback() 不会回调的问题；
2. 修复 iOS 根据时间获取消息失败的问题；

## 版本 3.9.7+1

### 修复

1. 修复 安卓 fcm send id 偶现为空的问题；
2. 修复 安卓 `SilentModeResult` expireTs 为空的问题；

## 版本 3.9.7

### 新增特性

1. 新增聊天室自定义属性功能。
2. 新增 `areaCode` 方法限制连接边缘节点的范围。
3. `EMGroup` 中增加 `isDisabled` 属性显示群组禁用状态，需要开发者在服务端设置。该属性在调用 `EMGroupManager` 中的 `fetchGroupInfoFromServer` 方法获取群组详情时返回。

### 优化

1. 移除 SDK 一部分冗余日志。

### 修复

1. 修复极少数场景下，从服务器获取较大数量的消息时失败的问题。
2. 修复数据统计不正确的问题。
3. 修复极少数场景下打印日志导致的崩溃。

## 版本 3.9.5

- 将 AddManagerListener 方法标为过期；
- 增加 customEventHandler；
- 添加 EventHandler；
- 增加 PushTemplate 方法；
- 增加 Group isDisabled 属性；
- 增加 PushConfigs displayName 属性；
- 修改 Api references;
- 升级原生依赖为 3.9.5

## 版本 3.9.4+3

- 修复 安卓端 `loadAllConversations` crash.

## 版本 3.9.4+2

- 修复 `EMClient.getInstance.startCallback()` 执行时安卓偶现崩溃；

## 版本 3.9.4+1

- 增加 ChatSilentMode;

## 版本 3.9.4

- 移除过期 Api；

## 版本 3.9.3

- 新增 thread 实现；
- 修复部分 bug；
- 依赖原生 sdk 版本为 3.9.3

## 版本 3.9.2

- 增加 Reaction 实现；
- 增加举报功能；
- 增加获取群组已读 api；
- 添加下载群文件进度回调；
- 修复下载视频偶现失败；
- 修复获取群免打扰详情失败；
- 修复 startCallback 是 ios 偶现 crash;

## 版本 3.9.1

- 增加 用户在线状态 (Presence) 订阅功能；
- 增加 翻译 功能更新，增加自动翻译接口。用户可以按需翻译，和发消息自动翻译。

## 版本 3.9.0+2

- 修改用户退出/离线回调;
  - EMConnectionListener#onConnected: 长连接恢复;
  - EMConnectionListener#onDisconnected: 长连接断开;
  - EMConnectionListener#onUserDidLoginFromOtherDevice: 当前账号在其他设备登录;
  - EMConnectionListener#onUserDidRemoveFromServer: 当前账号被服务器删除;
  - EMConnectionListener#onUserDidForbidByServer: 当前账号登录被服务器拒绝;
  - EMConnectionListener#onUserDidChangePassword: 当前账号密码变更;
  - EMConnectionListener#onUserDidLoginTooManyDevice: 当前账号登录太多设备;
  - EMConnectionListener#onUserKickedByOtherDevice: 当前账号被登录的其他设备设置下线;
  - EMConnectionListener#onUserAuthenticationFailed: 当前账号鉴权失败;
- 依赖原生 sdk 版本为 3.9.2.1；
- 修复 ios group ack 问题；

## 版本 3.9.0+1

- 修复 message.attribute 不准;

- 增加 EMClient.getInstance.startCallback() 方法

  ```dart
  EMClient.getInstance.startCallback();
  ```

  只有调用该方法后，`EMContactManagerListener`、 `EMGroupEventListener` 、 `EMChatRoomEventListener` 回调才会开始执行;

- 修复删除聊天室白名单成员失败;

## 版本 3.9.0

- 增加单人推送免打扰接口；

- 增加 api referance;

- 增加 renewToken api;

- 修改消息 callback 方式；

- iOS 移除自动绑定 deviceToken，如需使用，需要在 iOS 端单独增加；

- android 移除多余权限；

- 修改已知 bug；

## 版本 3.8.9

- 增加单聊消息免打扰；
- 去除不必要的信息收集；
- 修复安卓某些场景下数据库损坏导致崩溃；
- 移除对 FCM11.4.0 的依赖；
- 修复安卓 WAKE_LOCK 权限导致的崩溃；
- 增加用户被全局禁言时发消息错误码；
- 增强数据传输安全性；
- 增强本地数据存储安全性；
- 新增使用 Token 登录时，Token 过期的回调；
- 修复拉取历史漫游消息不全的 bug；
- 默认使用 https；
- 优化登录速度；

## 版本 3.8.3+9

- 将设置推送相关操作从 EMPushConfigs 中移到 EMPushManager 中；
- 修复已知 bug；

## 版本 3.8.3+8

- 修复 ios 使用 token 登录失败；
- 修改 Login 方法和 Logout 方法返回值；

## 版本 3.8.3+6

- 修改 EMImPushConfig 为 EMPushConfigs;
- 删除 EMOptions 中的 EMPushConfig.设置推送证书时直接调用 EMOptions 即可;
- EMGroup 中移除 ShareFiles，如果需要获取共享文件，请调用 Api:
  `EMClient.getInstance.groupManager.getGroupFileListFromServer(groupId)`
- 将 isConnected 和 isLoginBefore、Token 改为从原生获取；
- 修复安卓设置群组免打扰失效的问题；
- 修复获取公开群 crash 的问题；
- 修改 throw error 的逻辑；
- 修改构造文本消息时的方法，需要传入参数名；
- 修改部分原生方法逻辑；
- 调整项目目录结构；
- 将`onConversationRead`回调方法参数改为必选；

## 版本 3.8.3+5

- 更新安卓依赖原生 sdk 版本；
- 修复获取本地群组 crash；

## 版本 3.8.3+4

- 修复消息 attribute 类型变为 bool 类型；
- 修复群组免打扰属性不准；
- 修复 ios importMessages 方法 bug；
- 修复群、聊天室禁言时不执行回调的 bug；
- 修复下载方法不执行 callback；
- 构造文件消息提供设置文件大小属性；
- 修改`EMGroupChangeListener` 为 `EMGroupEventListener`

## 版本 3.8.3+3

- 修复安卓下 resendMessage 方法发送失败时不回调 onError；
- 修复 fetchChatRoomMembers 返回类型错误；

## 3.8.3+2

- 增加群组已读回执；
- 不在提供 EMContact 类，直接返回 String 类型 username;

## 版本 3.8.3

- 增加用户属性；
- 修复已知 bug；

## 版本 1.0.0

- 用户管理；
- 群组管理；
- 聊天室管理；
- 会话管理；
- 通讯录管理；
- 推送管理；
