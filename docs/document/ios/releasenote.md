# iOS IM SDK 更新日志

<Toc />

## 版本 V4.7.0 Dev 2024-06-04（开发版）

### 新增特性

- [IM SDK] 新增[设备登录时允许携带自定义消息，并将其传递给被踢的设备]()。
  - `EMLoginExtensionInfo.extensionInfo`：设备的登录扩展信息。
  - `EMOptions#loginExtensionInfo`：设置登录时携带的扩展信息。
  - `EMClientDelegate#userAccountDidLoginFromOtherDeviceWithInfo.EMLoginExtensionInfo`：多设备登录场景下，若当前设备被新登录设备踢下线，被踢设备收到的登录事件中会携带新设备的扩展信息。
- [IM SDK] 新增根据多个消息类型搜索本地消息：
  - `EMChatManager#searchMessages:withTypes:timestamp:count:fromuser:searchDirection:completion:`：[根据单个或多个消息类型，搜索本地数据库中所有会话的消息]()。
  - `EMConversation#searchMessages:withTypes:timestamp:count:fromuser:searchDirection:completion:` [根据单个或多个消息类型，搜索本地数据库中单个会话的消息]()。
- [IM SDK] 支持[从服务端单向删除聊天室漫游消息](message_delete.html#单向删除服务端的历史消息)。

# 修复

[IM SDK] 本地获取群组记录不再清除，用户可以调用IEMGroupManager#cleanAllGroupsFromDB清除本地数据库以及缓存中的群组信息。

## 版本 V4.6.1 Dev 2024-05-20（开发版）

### 新增特性

[IM SDK] 新增错误码 407 `EMErrorFileExpired`。若用户下载已过期的消息附件或群共享文件时，SDK 会触发该错误。

### 修复

- [IM SDK] 修复服务端获取好友列表（包含好友备注）时，在好友列表无变化时，第二次请求获取不到数据的问题。
- [IM SDK] 修复特殊情况下附件发送失败，消息仍然成功发送的问题。
- [IM SDK] 修复拉取漫游消息时 nextkey 错误的问题。

## 版本 V4.6.0 Dev 2024-04-30（开发版）

### 新增特性

- [IM SDK] 新增 `filterConversationsFromDB` 方法，支持[自定义筛选获取本地会话列表](conversation_list.html#获取本地所有或筛选的会话)。
- [IM SDK] 新增 `cleanConversationsMemoryCache` 方法，[清除本地内存中的所有会话](conversation_list.html#清除内存中的会话)释放内存。
- [IM SDK] 新增 `EMOptions#autoLoadConversations` 方法，[设置是否在登录成功后将数据库中的所有会话自动加载到缓存](conversation_list.html#一次性获取本地所有会话)。
- [IM SDK] 新增 `recallMessageWithMessageId:ext:completion:` 方法，[支持消息撤回时携带自定义信息](message_recall.html#实现方法)。
- [IM SDK] 消息撤回事件 `messagesInfoDidRecall` 的 `EMRecallMessageInfo` 对象中新增 `recallMessageId` 属性，[支持离线期间撤回的消息通知给接收方](message_recall.html#设置消息撤回监听)。

### 修复

[IM SDK] 修复 Web 端在聊天室中发送会话已读回执（channel ack）时，移动端 SDK 会新增会话且会话类型错误的问题。

### 重大变更

从 V4.6.0 版本开始会启用 Swift 语言编写的新的 `EaseChatUIKit` 与 `EaseChatDemo`，老版本 Demo 和 UIKit 逐渐不再维护，请参考：
- [UIKit 文档](https://doc.easemob.com/uikit/chatuikit/ios/chatuikit_overview.html)
- [Demo 源码](https://github.com/easemob/chat-ios/tree/SwiftDemo)

## 版本 V4.5.0 Dev 2024-04-03（开发版）

### 新增特性

- [IM SDK] 新增[置顶消息功能](message_pin.html)。
  - 新增 `EMChatManager#pinMessage:completion:` 方法，用于置顶消息。
  - 新增 `EMChatManager#unpinMessage:completion:` 方法，用于取消置顶消息。
  - 新增 `EMChatManager#getPinnedMessagesFromServer:completion:` 方法，用于从服务器获取指定会话的置顶消息。
  - 新增 `EMConversation#pinnedMessages` 属性，用于返回会话下的所有置顶消息。
  - 新增 `EMMessagePinInfo` 类，包含消息置顶的操作者以及置顶时间。
  - 新增 `EMChatMessage#pinnedInfo` 属性，展示消息的置顶详情。
  - 新增 `EMMessageListener#onMessagePinChanged` 事件。当用户在群组或聊天室会话进行置顶操作时，群组或聊天室中的其他成员会收到该回调。 
- [IM SDK] 加入聊天室时，若传入的聊天室 ID 不存在，可实现[自动创建聊天室](room_manage.html#加入聊天室)。
- [IM SDK] 支持[获取聊天室漫游消息](message_retrieve.html#从服务器获取指定会话的消息)。
- [IM SDK] 新增 `EMChatManager#markAllConversationsAsRead` 方法[将所有会话的未读消息设为已读](conversation_unread.html#将所有会话的未读消息数清零)。
- [IM SDK] 消息修改回调 `EMChatManagerDelegate#onMessageContentChanged:operatorId:operationTime` 中支持[通过 RESTful API 修改的自定义消息](/document/server-side/message_modify_text_custom.html)。

### 优化

- [IM SDK] 支持使用消息 body 完成[单条转发](message_forward.html#转发单条消息)，附件消息无需重新上传附件。
- [IM SDK] 在部分场景下，降低接收到大量群成员事件通知时获取群组详情的次数。
- [IM SDK] [在聊天室成员进出时更新聊天室成员人数](room_manage.html#实时更新聊天室成员人数)，使人数更新更及时准确。
- [IM SDK] 优化 token 登录时的错误提示信息，使错误提示更精细。
- [IM SDK] 优化 SDK 内部随机取服务器地址的逻辑，提升请求成功率。
- [IM SDK] 优化聊天室进出的超时时间。
- [IM SDK] 部分场景下连接失败重连的优化。


## 版本 V4.4.1 Dev 2024-03-06（开发版）

### 新增特性

- [IM SDK] SDK 中增加了隐私协议 `PrivacyInfo.xcprivacy`。

### 修复

- [IM SDK] 修复极端情况下，连续修改同一条消息的扩展字段 `ext`，调用 `EMChatManager#updateMessage` 后偶现的崩溃问题。

## 版本 V4.4.0 Dev 2024-01-30（开发版）

### 新增特性

- [IM SDK] 新增 [EMChatManager#deleteAllMessagesAndConversations:completion:](message_delete.html#清空聊天记录) 方法，用于清空当前用户的聊天记录，包括消息和会话，同时可以选择是否清除服务端的聊天记录。
- [IM SDK] 新增 [EMChatManager#loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:scope:completion:](message_search.html#根据搜索范围搜索所有会话中的消息) 和[EMConversation#loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:scope:completion:](message_search.html#根据搜索范围搜索当前会话中的消息)，可以在根据关键字搜索消息时，选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。
- [IM SDK] 新增 [EMOptions#useReplacedMessageContents](message_send_receive.html#发送文本消息) 开关。开启后，发送消息时如果被内容审核进行了内容替换，发送方可以获取替换后的内容。
- [IM SDK] 新增 [EMOptions#includeSendMessageInMessageListener](message_send_receive.html#接收消息) 开关。开启后，在 `messagesDidReceive` 回调里增加发送成功的消息。
- [IM SDK] 新增 [EMOptions#regardImportMessagesAsRead](message_retrieve.html#从服务器获取指定会话的消息) 开关。开启后，[利用服务端接口](/document/server-side/message_import.html)导入的消息，客户端上通过[漫游拉取](message_retrieve.html#从服务器获取指定会话的消息)到后，这些消息为已读状态，会话中未读取的消息数量 `EMConversation#unreadMessagesCount` 不发生变化。若该开关为关闭状态，`EMConversation#unreadMessagesCount` 的数量会增加。

### 优化

- [IM SDK] 群组全员禁言状态（`EMGroup#isMuteAllMembers`）存储到本地数据库，下次登录时可以直接从本地获取到。
- [IM SDK] 转发合并消息时导致的附件重复上传问题。

### 修复

- [IM SDK] 部分场景下群成员人数计算重复问题。
- [IM SDK] 搜索消息的关键字中带有单引号 `‘` 引起的 SQL 语句报错问题。
- [IM SDK] 修复数据上报模块偶现的崩溃问题。
- [IM SDK] 修复多线程同时调用 `EMClient.sharedClient.chatManager.addDelegate` 导致的偶现崩溃问题。
- [IM SDK] 修复绑定 APNs Token 时，偶现的 Token 绑定失败的问题。

## 版本 V4.3.0 Dev 2023-12-22（开发版）

### 新增特性

[IM SDK] 支持[会话标记功能](conversation_mark.html)。
- `EMChatManager#addConversationMark:completion`：[标记会话](conversation_mark.html#标记会话)。
- `EMChatManager#removeConversationMark:completion`：[取消标记会话](conversation_mark.html#取消标记会话)。
- `EMChatManager#getConversationsFromServerWithCursor:filter:completion`：[根据会话标记从服务器分页查询会话列表](conversation_mark.html#根据会话标记从服务器分页查询会话列表)。
- `EMConversation#marks`：[获取本地单个会话的所有标记](conversation_mark.html#获取本地单个会话的所有标记)。
- `multiDevicesConversationEvent#EMMultiDevicesEventConversationUpdateMark`：[多设备场景下的会话标记事件](multi_device.html#获取其他设备上的操作)。当前用户在一台登录设备上更新了会话标记，包括添加和移除会话标记，其他登录设备会收到该事件。

### 优化

- [IM SDK] 移除 FPA 功能，减小 SDK 体积。
- [IM SDK] 单个日志文件大小由 2 MB 提升到 5 MB。
- [IM SDK] 优化附件类型消息发送时中的附件上传，支持分片上传。

## 版本 V4.2.0 Dev 2023-11-13

### 新增特性

- [IM SDK] 新增[设置好友备注功能](user_relationship.html#设置好友备注)。
- [IM SDK] 新增 `getAllContactsFromServerWithCompletion` 和 `getContactsFromServerWithCursor` 方法分别[从服务器一次性和分页获取好友列表](user_relationship.html#从服务端获取好友列表)，每个好友对象包含好友的用户 ID 和好友备注。
- [IM SDK] 新增 `getContact` 方法[从本地获取单个好友的用户 ID 和好友备注](user_relationship.html#从本地获取好友列表)。
- [IM SDK] 新增 `getAllContacts` 方法[从本地分页获取好友列表](user_relationship.html#从本地获取好友列表)，每个好友对象包含好友的用户 ID 和好友备注。
- [IM SDK] 新增 `EMChatMessage#broadcast` 属性用于判断该消息是否为聊天室全局广播消息。可通过[调用 REST API 发送聊天室全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。
- [IM SDK] 新增 `EMGroupManager#getJoinedGroupsCountFromServerWithCompletion` 方法用于[从服务器获取当前用户已加入的群组数量](group_manage.html#查询当前用户已加入的群组数量)。
- [IM SDK] 新增[错误码 706](error.html) `EMErrorChatroomOwnerNotAllowLeave`，表示聊天室所有者不允许离开聊天室。若初始化时，`EMOptions#canChatroomOwnerLeave` 参数设置为 `false`，聊天室所有者调用 `leaveChatroom` 方法离开聊天室时会提示该错误。
- [IM SDK] 新增 `EMOptions#loadEmptyConversations` 属性用于在初始化时配置获取会话列表时是否允许返回空会话。
- [IM SDK] 申请入群被拒绝的回调 `EMGroupManagerDelegate#joinGroupRequestDidDecline:reason:decliner:applicant:` 中新增 `decliner` 和 `applicant` 参数表示申请者和拒绝者的用户 ID。  
- [IM Demo] 好友详情页面可添加和修改好友备注。

### 优化

- [IM SDK] 统一 Agora Token 和 EaseMob Token 登录方式：`EMClient#loginWithUsername:agoraToken:` 接口废弃，统一使用 `EMClient#loginWithUsername:token` 接口。此外，新增 EaseMob Token 即将过期及已过期的回调，即 EaseMob Token 已过期或有效期过半时也返回 `EMClientDelegate#tokenDidExpire` 和 `EMClientDelegate#tokenWillExpire` 回调。
- [IM SDK] 优化发消息时重试的逻辑。
- [IM SDK] 数据库升级逻辑优化。

### 修复

- [IM SDK] 修复网络恢复时重连 2 次的问题。

## 版本 V4.1.1 Dev 2023-8-03

### 修复

[IM SDK] 修复修改消息后，离线用户上线后拉取历史消息，消息体中缺乏 `from` 属性的问题。

## 版本 V4.1.0 Dev 2023-7-27（开发版）

### 新增特性

- [IM SDK] 新增[合并转发消息功能](message_send_receive.html#发送和接收合并消息)：
    - 新增合并消息类型 `EMMessageBodyTypeCombine`；
    - 新增消息体类 `EMCombineMessageBody` ；
    - 新增 `EMChatManager#downloadAndParseCombineMessage` 方法，用于下载并解析合并消息。
- [IM SDK] 新增[消息修改功能](message_modify.html)：
    - 新增 `EMChatManager#modifyMessage` 方法，用于修改消息；
    - 新增 `EMChatManagerDelegate#onMessageContentChanged` 回调。消息修改后，接收方会收到该回调。
- [IM SDK] 新增[自定义设备的平台和名称功能](multi_device.html#设置登录设备的名称)。
    - 新增 `EMOptions#customOSType` 属性，用于设置自定义平台代号；
    - 新增 `EMOptions#customDeviceName` 属性，用于设置当前设备的自定义设备名称。
- [IM SDK] 新增 `EMClientDelegate#userAccountDidLoginFromOtherDevice:(NSString*)deviceName` 回调。<br/>
作废`EMClientDelegate#userAccountDidLoginFromOtherDevice` 回调。<br/>
设置设备名称后，若登录设备时因达到了登录设备数量限制而导致在已登录的设备上强制退出时，被踢设备收到 `EMClientDelegate#userAccountDidLoginFromOtherDevice:(NSString*)deviceName` 回调，其中包含导致该设备被踢下线的自定义设备名称。
- [IM SDK] 新增以下方法支持用户 token：
    - `EMClient#getLoggedInDevicesFromServerWithUserId`：获取指定账号下登录的在线设备列表；
    - `EMClient#kickDeviceWithUserId`：将指定账号登录的指定设备踢下线：
    - `EMClient#kickAllDevicesWithUserId`：将指定账号登录的所有设备都踢下线。
- [IM UIKit] 新增消息引用功能。
- [IM UIKit] 新增消息修改功能。
- [IM APP] 新增消息中 URL 的预览功能。

### 优化

- [IM SDK] 优化登录 IM 服务器时对不同优先级接入地址选择的逻辑。

### 修复

- [IM SDK] 修复调用 `EMChatManager#deleteMessagesBeforeTimestamp 和 EMConversation#removeMessages(long,long)` 方法偶现崩溃的问题；
- [IM SDK] 修复偶现的因未登录导致调用接口时崩溃的问题；
- [IM SDK] 修复在 ARM 64 模拟器下偶现的文件类消息附件路径不对的问题；
- [IM APP] 修复 Demo 偶现的 UI 刷新崩溃的问题。

## 版本 V4.0.3 Dev 2023-6-19

### 新增特性

- [IM SDK] 新增 `IEMChatManager#getConversationsFromServerWithCursor:pageSize:completion:` 方法，实现[从服务器拉取会话](conversation_list.html#从服务器分页获取会话列表)的功能，原接口 `getConversationsFromServer` 和 `getConversationsFromServerByPage:pageSize:completion:` 标记为已废弃。
- [IM SDK] 新增置顶服务器会话的功能：
    - 新增 `IEMChatManager#pinConversation:completionBlock:` 方法，实现[置顶或取消置顶服务器会话](conversation_pin.html#置顶-取消置顶会话)：
    - 新增 `IEMChatManager#getPinnedConversationsFromServerWithCursor:pageSize:completion` 方法，实现[获取置顶的服务器会话](conversation_pin.html#获取服务端的置顶会话列表)。
- [IM SDK] 新增 `IEMChatManager#getAllConversations:` 方法，实现[从本地获取排序后的会话列表](conversation_list.html#获取本地会话)。
- [IM SDK] 新增在群组或聊天室中[发送定向消息](message_send_receive.html#发送和接收定向消息)功能。

### 优化

- [IM SDK] 优化登录时若消息过多，从本地数据库加载会话太慢的问题；
- [IM SDK] 增加对 arm64 模拟器平台的支持。

### 修复

- [IM UIKit] 修复发送图片消息时，`compressionRatio` 配置为 1.0 未发送原图的问题。

## 版本 V4.0.2 Dev 2023-4-26

### 新增特性

- [IM SDK] 新增 Reaction 回调操作类型。
- [IM SDK] 新增 `EMChatManager#fetchMessagesFromServerBy` 方法，[根据消息拉取参数配置接口（`EMFetchServerMessagesOption`）从服务器分页获取指定会话的历史消息](message_retrieve.html#从服务器获取指定会话的消息)。`EMFetchServerMessagesOption` 接口中包括起始时间戳、消息类型和消息发送方等参数。
- [IM SDK] 新增 `EMConversation#removeMessagesStart` 方法，实现从本地数据库中删除指定时间段内的消息。
- [IM SDK] 新增[错误码 510 `EMErrorMessageSizeLimit`](error.html)，发送消息时若消息体大小超过上限时提示错误。
- [IM SDK] 新增[错误码 8 `EMAppActiveNumbersReachLimitation`](error.html)，应用程序的日活跃用户数量（DAU）或月活跃用户数量（MAU）达到上限时提示错误。
- [IM Demo] 新增群组聊天时可提及某些用户，对其发送消息。


### 优化

- [IM SDK] [聊天室详情更新回调 chatroomSpecificationDidUpdate](room_manage.html#监听聊天室事件) 返回更新的信息。
- [IM SDK] 优化 `loadMessagesWithKeyword` 方法实现按关键字全局搜索消息支持搜索自定义消息。
- [IM SDK] 优化日志回调逻辑。
- [IM SDK] 移除代码中使用的 ECB 加密。

## 版本 V4.0.1 Dev 2023-3-16

### 新增特性

- [IM SDK] 新增[群成员自定义属性功能](group_members.html#管理群成员自定义属性)并增加[自定义属性更新事件](group_manage.html#监听群组事件)实现群成员设置和获取在群组中的昵称和头像等属性。
- [IM SDK] 新增 `EMChatMessage#deliverOnlineOnly` 属性实现发消息只投递给在线用户。若开启了该功能，用户离线时消息不投递。
- [IM Demo] 新增群成员昵称修改与展示功能。

### 优化

[IM SDK] 优化聊天室进入和退出实现，提升性能。

## 版本 V4.0.0 Dev 2023-2-6

### 新增特性

[IM SDK] [新增 `EMChatManager#getConversationsFromServerByPage:pageSize:completion` 方法实现从服务端分页获取会话列表](conversation_list.html#从服务器分页获取会话列表)。

### 优化

- [IM Demo] [优化登录方式，修改为手机号+验证码](demo.html)。
- [IM CallKit] 升级 RTC 版本至 4.1.1 版本。

## 版本 V3.9.9 Dev 2022-11-29

### 新增特性

[IM SDK] 新增[消息流量统计功能](message_traffic_statis.html#获取本地消息的流量统计信息)。

### 修复

[IM SDK] 修复极端情况下 SDK 崩溃的问题。

## 版本 V3.9.8 Dev 2022-11-8

### 新增特性

- [IM SDK] 新增[聊天室消息优先级](message_send_receive.html)。
- [IM SDK] 群组信息更新后的 `EMGroupManagerDelegate#groupSpecificationDidUpdate` 回调中添加更新后的群组信息。

### 优化

[IM SDK] 修复某些场景下调用 `updateMessage` 方法导致的内存与数据库消息不一致问题。

## 版本 V3.9.7.1 Dev 2022-9-30

### 新增特性

[IM SDK] 在 `EMOptions` 类 中增加 `area` 属性限制连接边缘节点的范围。

### 优化

[IM SDK] 优化通信协议，减少数据量。

### 修复

- [IM SDK] 修复数据统计不正确的问题。
- [IM SDK] 修复极少数场景下打印日志导致崩溃的问题。
- [IM SDK] 修复开启全链路加入（FPA）功能时导致崩溃的问题。

## 版本 V3.9.6.1 Dev 2022-9-21

### 优化

- [IM SDK] 优化聊天室自定义属性更新的回调方法 `onAttributesUpdate`，返回修改成功的聊天室自定义属性的集合。
- [IM SDK] 优化聊天室自定义属性移除的回调方法 `onAttributesRemoved`，返回成功移除的聊天室自定义属性的 key 数组。
- [IMKit] 语音播放切换至媒体音量。

## 版本 V3.9.6 Dev 2022-9-16

### 新增特性

- [IM SDK] 新增[聊天室自定义属性功能](room_attributes.html)。
- [IM SDK] 新增 `EMLogDelegate` 类，实现用户日志回调。

### 优化

[IM SDK] 优化获取漫游消息的性能。

### 修复

- [IM SDK] 修复少数场景下，同步或拉取消息时消息量较大时收取失败的问题。
- [Demo] 修复部分 Demo bug。

## 版本 V3.9.5 2022-8-2

### 新增特性

- [IM SDK] 新增群组详情中群组禁用状态：isDisabled 属性，该属性需要开发者在服务端设置；
- [IM SDK] 发送前回调：发送失败时返回给 app 用户的错误描述中增加你自定义的错误信息；
- [IM SDK] 新增错误码 1101：EMErrorPresenceCannotSubscribeSelf。

### 优化

- [IM SDK] 优化登录过程，缩短登录时间；
- [IM SDK] 消息加密算法由 CBC 升级为 GCM；

### 修复

- [IM SDK] 修复退出账号时，若未设置推送证书，解绑 crash 的问题；
- [IM SDK] 纠正部分拼写错误的接口；
- [Demo] 修复部分 Demo bug。

## 版本 V3.9.4 2022-6-16

### 新增特性

- [IM SDK] 接收的消息中增加是否是离线消息 [isOnlineState()](https://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_chat_message.html#a78d632fe28019bd04eaa9f9df8b94fd6) 的标记；
- [IM SDK] 新增群聊消息限流错误码 [EMError#MESSAGECURRENTLIMITING](error.html)
- [IM SDK] 新增绑定设备 token 的接口 [EMPushManager#bindDeviceToken](https://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_client.html#abafb1f83bc8fd3f59043bc7dd6af8282)。

### 优化

- [IM SDK] 优化子区相关接口及属性；对比 3.9.3 版本，用 `EMChatThread` 替换 `EMChatThreadInfo`，`EMChatThreadEvent` 中的 Chat Thread 相关属性用 `EMChatThread` 对象替换；
- [IM SDK] 群邀请回调 [EMGroupManagerDelegate#groupInvitationDidReceive:](https://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_group_manager_delegate-p.html#a7eb4d32b6730b232aad0492cc808f996) 中返回新增 群名称（aGroupName） 参数值；
- [IM SDK] 升级网络链路库；
- [IM SDK] 支持设置附件为远程地址的消息。

### 修复

- [EaseIMKit] 修复删除 Reaction 接口重复调用的问题。

## 版本 V3.9.3 2022-5-26

### 新增特性

- [IM SDK] 新增消息子区（Message Thread）功能；

### 优化

- [IM SDK] 优化网络链路，提升网络访问性能；
- [IM SDK] 优化 [拉取漫游消息接口](message_retrieve.html#从服务器获取指定会话的消息)，增加指定拉取消息方向的参数；

## 版本 V3.9.2.1 2022-5-25

修复 3.9.2 上传 AppStore 时的依赖库问题

## 版本 V3.9.2 2022-5-15

### iOS SDK 3.9.2

### 新增特性:

- [IM SDK] 新增 [消息 Reaction](reaction.html) 功能，可以对消息进行不同的响应。
- [IM SDK] 新增 [举报 API](moderation.html) 用于内容审核。

### 优化：

- [IM SDK] 优化获取服务器接入点 (dnsconfig) 的功能。
- [IM SDK] 优化数据上报功能。
- [IM SDK] 依赖的 openssl 替换为 boringssl。

```
**请注意： 该版本上传AppStore存在依赖库问题，请使用3.9.2.1。**
```

### EaseCallKit 3.9.2

### 优化：

- [EaseCallKIt] 升级 Agora RTC SDK 版本到 3.6.2。

## 版本 V3.9.1.1 2022-4-27

### 修复：

- [IM SDK] 修复偶发的拉取历史消息不能正常显示的问题。

## 版本 V3.9.1 2022-4-19

:::tip
仅 V3.9.1 及以下版本支持私有化部署。
:::

### 新增特性:

- [IM SDK] [用户在线状态 (Presence) 订阅](presence.html)功能。
- [IM SDK] [翻译](message_translation.html)功能更新，增加自动翻译接口。实现用户按需翻译和发消息自动翻译。

### 优化：

- [IM SDK] 缩短发送消息超时时间。
- [IM SDK] DNS 服务器地址列表支持优先级设置，HTTP 和 TCP 请求重试时按 DNS 服务器地址的优先级发送请求，提升请求成功率。

## 版本 V3.9.0 2022-02-23

### iOS SDK 3.9.0

### 新增特性：

- [IM SDK] [单向删除服务端会话 API](https://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_chat_manager-p.html#a4ac87045ad781e99c59acc271f9af433)；
- [IM SDK] 免打扰事件的多设备间同步；
- [IM SDK] Push 平台推送支持扩展字段获取、后续动作、角标设置、透传消息等功能，具体见：[iOS 推送集成](https://docs-im.easemob.com/push/apppush/iossdk)；
- [IM SDK] 发送图片支持 PNG 格式；
- [IM SDK] 非好友不能发送消息错误码 [221 EMErrorUserNotOnRoster]；

### 优化：

- [IM SDK] 减少弱网时发送消息的等待时间；
- [IM SDK] EMMessage 重命名为 EMChatMessage，避免与系统类冲突；
- [IM SDK] 移除 IEMPushManager 中 callBack EMError 参数的 \_Nonnull 约束。
- [IM SDK] API 调用在 Swift 语法的表现形式。

### 修复：

- [IM SDK] 消息发送重试被连接成功事件中断；
- [IM SDK] SDK 内存泄漏；
- [IM SDK] 因时间统计为负数导致崩溃问题。

### EaseIM Demo 3.9.0

### 新增特性：

- [IM SDK] 通讯录 → 群聊下添加创建群组入口；
- [IM SDK] 非好友不能发送消息提醒；
- [IM SDK] 推送透传消息回调中增加获取推送内容示例。

### 优化：

- [IM SDK] EMMessage 重命名为 EMChatMessage；
- [IM SDK] 服务器配置界面，“使用自定义服务器”开关生效；
- [IM SDK] 免费版注册用户数超过 100 时，提示注册错误。

### 修复：

- [IM SDK] 用户被群主移除和拉黑后，其会话列表仍显示该群组的数据；
- [IM SDK] 聊天室重命名后，聊天室列表未刷新。

### EaseIMKit 3.9.0

### 新增特性：

- [IM SDK] 删除服务器会话时同时会删除本地会话；
- [IM SDK] 免打扰事件的多设备间同步；
- [IM SDK] 发送图片支持 PNG 格式。

### 优化：

- [IM SDK] EMMessage 重命名为 EMChatMessage；
- [IM SDK] 优化撤回消息的相关提示信息。

### 修复：

- [IM SDK] 语音消息动画播放异常；
- [IM SDK] 语音消息“已听”属性重启后失效。

### EaseCallKit 3.9.0

### 优化：

- [EaseCallKIt] EMMessage 重命名为 EMChatMessage。

## 版本 V3.8.9.1 2021-12-30

### 修复：

- [IM SDK] 增加极端情况下打开数据库失败时重建数据库的策略。

## 版本 V3.8.9 2021-12-27

### 新增

- [IM SDK] 增加翻译功能 API；
- [IM SDK] 位置消息增加建筑物名称字段；
- [IM SDK] 增加按照时间删除消息的 API；
- [IM SDK] 增加获取会话中消息总数的 API；

### 修复

- [IM SDK] 修复部分崩溃的问题；
- [IM SDK] 修复数据库加密的 bug；
- [IM SDK] 修复自动登录不兼容卸载重装问题。

## 版本 V3.8.8 2021-12-06

### 新增

- [IM SDK] 增加 取消收到群组消息后检查是否在群组中的过程。

### 优化

- [IM SDK] 优化 API naming；
- [IM SDK] 更新推送 Token 过程，降低服务器请求次数；
- [IM SDK] 登录过程速度；
- [IM SDK] 更新消息时只更新 cache，修复拉取历史消息时的问题；
- [IM SDK] 修改 SDK 中修改为默认使用 HTTPS；
- [IM SDK] 优化 Agora Token 过期后不做解绑 Token 操作。

### 修复

- [IM SDK] 修复 Agora Token 即将过期和已经过期回调时机不准确问题。

**请注意： 此版本有切换账号杀掉应用后再打开应用，不能正常打开数据库的问题，请使用 3.8.9 版本。**

## 版本 V3.8.7 2021-10-22

SDK :

- 增加：token 登录支持自动登录，如果不希望自动登录，请在初始化时将 EMOptions.isAutoLogin 设置为 NO
- 支持版本：提升到 iOS 10 为最低版本

## 版本 V3.8.6 2021-10-12

SDK :

- 增强本地存储数据的安全性；
- 增强传输数据的安全性；
- 增加: 用户被全局禁言时发消息的会提示单独的错误码；

```
**请注意： 从 3.8.6 开始我们采用 Dev 和 Stable 版本并行的方式，用户可以根据需求选择使用的版本。**
```

- 稳定版（Stable）：基于开发版本，提供稳定的功能，持续修复 Bug，可用于发布应用；
- 开发版（Dev）：最新版本，体现最新的功能和特性，不定期发布版本，可用于体验。

## 版本 V3.8.5.2 2021-09-30

SDK :

- 修复：重复收到离线推送

## 版本 V3.8.5 2021-09-10

SDK:

- 增加: 对 log 日志敏感数据脱敏
- 优化: 设备 id 使用随机生成的方式
- 修复：手机链接 wifi,静置 8 分钟长链接断开问题
- 修复：设置免打扰群组不正确问题
- 修复：SDK 偶现启动 crash 问题

EaseIMKit:

- 修复：聊天界面动图不展示
- 修复：聊天界面删除最后一条消息 crash 问题
- 修复：聊天详情中清空聊天记录 crash 问题

## 版本 V3.8.4 2021-08-02

SDK:

- 增加：单聊 1v1 免打扰功能；
- 增加：loadMessage 从 DB 加载消息的同步线程 API ；
- 增加：垃圾消息被拦截的错误码；
- 优化：SDK 开始以 HyphenateChat.XCFramework 方式提供；
- 修复：设置 deviceToken 参数长度为 0 时 crash 问题；

EaseIMKit:

- 修复：多条语音消息 UI 刷新问题；
- 增加：从会话列表进入聊天页发送群组已读回执；
- 优化：EaseIMKit 开始以源码方式从 cocoapods 下载；
- 优化：本地以 podspec 方式集成 EaseIMKit 源码；

环信 app：

- 增加单聊 1v1 免打扰开关。

## 版本 V3.8.3.1 2021-07-08

SDK：

- 修复：ios14.0 相关版本移动网络下直接 crash；
- 修复：自动登录失败，导致进入 EaseIM app 之后的任何行为导致 crash；
- 修复：拉取漫游会话 id 大写导致重复拉取；
- 修复：updateMessage 不更新缓存；
- 修复：缓存群组免打扰列表偶现 crash；
- 删除：不再获取设备”wifi 名称“（wifissid）信息；
- 废弃：groupManage 推送相关 api，（改用 pushManage 相关 api）。

环信 app：

- 修复：群组，聊天室 成员/管理员列表侧滑直接删除;
- 修复：群组，聊天室 成员/管理员列表禁言之后无法取消禁言;
- 修复：群组，群管理页黑名单，禁言人数不准确；
- 修复：为获取用户资料发送用户名片 crash;
- 增加：集成 Bugly 收集未知异常。

## 版本 V3.8.3 2021-06-05

SDK:

- 此版本仅小幅改动，以 3.8.3.1 版本为基准

## 版本 V3.8.2 2021-06-05

SDK：

- 添加用户行为数据上报
- 用户已登录和再重复登录区分错误描述
- 添加发送前回调消息被拦截错误描述
- 登录上传 appid
- 修复会话列表没有 Localpath 无法下载附件 bug
- iOS 修复用户资料中文乱码 bug

EaseIMKit：

- 修复自定义 cell 长按不返回当前对象 bug
- 修复聊天页面设置圆角无效 bug
- 修复下拉刷新时切换页面加载圈卡死 bug
- 添加没有相关权限限制相关功能使用（例：无相机权限可使用相机）

环信 app：

- 处于群成员页，群被解散 app 即 crash 问题
- 添加没有相关权限限制相关功能使用（音视频功能）

## 版本 V3.8.1 2021-04-13

SDK：

- 新增设置、获取用户属性的接口，集成参见：[用户属性](userprofile.html)
- 新增 App 层输出信息到日志文件的接口

EaseIMKit：

- 添加 EaseIMKit 发送消息前回调接口，EaseIMKit 发送消息后回调接口，EaseIMKit 文本消息支持 URL 识别并点击跳转浏览器
- 修复 EaseIMKit 聊天页面头像支持 url，web 发视频消息，EaseIMKit 不展示默认缩略图，EaseIMKit 头像圆角设置无效

环信 app：

- 新增用户属性（头像、昵称）的存储、显示
- 新增用户名片消息的发送与展示（使用自定义消息实现）

EaseCallKit（2021-05-07）：

- 修改加入声网频道的方式，改为使用数字 uid 加入，增加与小程序的互通，`与之前版本不互通`,参见[EaseCallKit 使用指南](easecallkit.html)

## 版本 V3.8.0 2021-02-27

SDK：

- 3.8.0 版本 SDK 更新名为 HyphenateChat，只发布 IM 功能，移除 RTC 功能；
- 3.8.0 版本支持 armv7,arm64,i386,x86_64 指令集；
- 修复极端情况用户名为空时请求 token 的的问题；

EaseIMKit：

- 3.8.0 使用 HyphenateChat SDK；
- 修改聊天页创建实例方法为类方法；
- 聊天页传入数据集刷新页面方法添加是否插入当前列表尾部参数；
- 聊天页支持用户头像 URL；
- 修复群聊，点击语音未读状态红点不消失问题；

环信 APP:

- 环信 app 依赖声网 RTC；
- 通话部分模块化为 EaseCallKit；
- 修复会话列表群聊会话置顶和群详情页置顶不同步问题；
- 修复对方输入状态不显示问题；
- 修复搜索功能崩溃问题；

注意:

- **为提供更好的服务，从 3.8.0 开始 SDK 中不再提供音视频功能，而是在 EaseCallKit 中基于声网的 SDK 给出了音视频功能的参考实现。该方案呼叫功能不能与之前版本之间互通，请根据情况选择使用新方案或者继续使用之前的版本**
- EaseIMKit 除了可以远程库外，也公布了源码，详情请见：[EaseIMKit 使用指南](https://docs-im.easemob.com/im/ios/other/easeimkit);
- EaseCallKit 初版发布，详情请见[EaseCallKit 使用指南](https://docs-im.easemob.com/im/ios/other/easecallkit)

## 版本 V3.7.4 2021-02-04

SDK：

- 3.7.4 版本开始不支持 armv7,i386 指令集;
- 从 3.7.4 版本开始支持 bitcode;
- 增加发送/接收会话已读 API;
- 增加从服务器拉取会话列表 API;
- 增加获取群详情时获取群成员选项 API;
- 增加搜索指定内容的自定义消息 API;
- 修复未获取 pushOptions 时直接设置推送偶现的 crash;

EaseIMKit：

- 修改聊天页接收数据源方式：外部传入数据源，EaseIMKit 展示数据;
- 降最低版本到 iOS 10.0;
- 增加是否显示己方输入状态方法;

环信 APP:

- 增加拉取会话列表功能(首次安装 APP 且第一次登录);
- 聊天页从数据库/服务器获取历史消息作为数据源传入 EaseIMKit 展示;
- 从服务器获取历史消息开关生效;
- 修复 1v1 视频通话切换本地视频黑屏问题;
- 搜索功能包装，不作为分类使用;

注意:

- EaseIMKit 除了可以远程库外，也公布了源码，详情请见：[EaseIMKit 使用指南](https://docs-im.easemob.com/im/ios/other/easeimkit);

## 版本 V3.7.3 2020-12-31

新功能：

- 增加 RTC 部分 log，方便排查问题；
- 使用环信 app 和新版 IMKit；

修复：

- 修复 iOS14 下使用位置 api 权限的问题；
- EMPushManager 和安卓 api 不一致的问题;
- 添加重复登录日志；
- 修复获取聊天室详情时不同时获取成员的问题；

注意:

- EaseIMKit 除了可以远程库外，也公布了源码，详情请见：[EaseIMKit 使用指南](https://docs-im.easemob.com/im/ios/other/easeimkit);
- 新版 App（EaseIM App）采用了新的 appkey，不可用之前的账号进行登录，需要重新进行注册。

## 版本 V3.7.2 2020-10-30

新功能：

- 注册用户名超过 64 位时返回错误码： USER_NAME_TOO_LONG;
- 处理从其他设备上同步的 read ack，实现已读状态在多个设备上的同步;

修复：

- 修复有线连接判断的 bug，修复群组操作的可能网络判断不准确的 bug;
- 改进加入聊天室，群组的速度，减少请求服务器次数;
- 修复音视频通话时切换扬声器导致的 crash;
- 修复下载附件时因权限问题导致的 crash;
- 修复转移群组时旧群主权限不变的 bug;
- 修复群组公告长度判断不准的问题;
- 修复 demo 中断网无法删除群组聊天记录的问题;
- 修复 demo 中自己创建的公开群无法邀请他人进入的问题;

## 版本 V3.7.1 2020-08-27

新功能：

- RTC 增加设置视频清晰度优先的 api；
- RTC 增加设置获取集群代理的 url 的 api；
- 支持设置 pushKit 推送；
- IM demo 呼叫时支持自定义铃声

修复：

- 修复 IM Demo 创建会议时偶现的因 Token 为空导致创建失败的问题
- 修复本地查询消息，传参时间戳为负数时查不到的问题

## 版本 V3.7.0 2020-07-29

新功能：

- 实现 RTC 质量监控,上报 RTC 质量数据;
- 增加纯音频推流功能,可设置音频参数;
- 增加多路推流到 CDN 接口的 api;
- 增加自定义录制接口的 api;
- Demo 中把 1v1 呼叫时的推送选项默认打开;
- Demo 中增加聊天文件可预览功能
- 增加网络等异常无视频 音频数据，无数据回调接口;
- 增加发送接收音视频首帧数据的回调；
- 增加录制、播放的音频数据的回调

修复：

- 修复语音会议对方断网的回调问题
- 修复会议中丢包率统计错误问题
- 修复处于单聊页面，对方转发图片过来不显示问题
- 修复转发消息选择联系人页面第一条 cell 不可选中问题
- 修复转发图片失败问题

## 版本 V3.6.9 2020-06-23

新功能：

- 增加白板开启关闭交互的 api；
- 增加创建白板时的参数开启关闭交互；
- 增加共享桌面流的限制；
- 增加发布桌面流失败的回调；
- demo 中增加音视频是否支持小程序的设置

修复：

- 修复 1v1 通话中 iOS 作为被叫方有时接听不起来的问题
- 修复会议进行中切出去后再切回来，对方视频黑屏的问题

## 版本 V3.6.8 2020-06-09

新功能：

- 支持附件下载重定向;
- 支持图片检测违规抛出单独的异常;

修复：

- 修复聊天时，自己发图片没有显示缩略图的问题；
- 修改群组免打扰后，ui 显示不准确的问题；
- 修复接收自定义消息后 crash 的问题；

## 版本 V3.6.7 2020-05-15

SDK 新功能:

- 支持集群代理功能；
- 实现上下麦 api；
- 实现静音管理功能，包括全体静音及指定成员静音；
- 支持设置 cdn 推流及自定义布局功能；
- 支持设置视频自定义分辨率。

IM_DEMO 修改：

- 更改音视频会议只使用普通会议模式
- 修复聊天页连续接收图片，图片重复问题
- 修复发送语音时无法调节音量问题
- 修复联系人页个别汉字不识别，排序错误问题
- 修复会话列表和 tabbar 未读消息数显示不准确问题
- 修复转发自己发送的图片消息失败问题
- 优化无网络状态发消息，消息内容立即上屏且显示发送状态

## 版本 V3.6.6 2020-04-08

新功能:

- RTC 增加踢人 api；
- RTC 增加管理员转移 api 和回调；
- 加入房间时支持设置最大主播人数，nickname 和扩展。

## 版本 V3.6.5 2020-03-13

新功能:

- 支持白名单 api，禁言 api；
- 增加自定义消息类型的 api；
- 增加创建白板和加入白板的 api；
- 增加 joinRoom 的 api；
- 添加对于对于加入音视频会议密码错误，或者主播已经满的错误提示；

修复:

- 修复自动登录设置后不起作用的问题；
- 修复自定义视频输入时回调执行多次的问题；
- 修复创建 db 时因权限问题导致的死循环；
- 修复离线离开聊天室返回 reason 不准的问题；

## 版本 V3.6.4 2020-02-12

新功能:

- 支持视频通话设置图片水印功能
- 创建会议 api，增加参数支持小程序，默认为不支持；
- 兼容 ios13 deviceToken；

修复：

- 修复 iPhone 7 前置摄像头黑屏的功能

## 版本 V3.6.3 2020-01-03

新功能:

- 支持外部输入音频 api
- 支持设置私有部署的 RTC 服务器 api

更新：

- 降低长连接超时时间

修复：

- 修复共享桌面的 bug
- 修复部分 ui 问题；

## 版本 V3.6.2 2019-11-13

新功能:

- 添加群组回执功能接口（增值服务，需要联系商务开通）

更新：

- 支持 H264 软编解码，提高音视频通话的兼容性；
- 私有部署且未启用 dns 时，不尝试取服务器列表；
- 添加音视频功能的一些关键 log，方便排查问题；

修复：

- 增强 iOS xr、xs、xs max 等设备在音视频时的稳定性；
- 修复 ios13 时一些 crash 问题；
- 修复部分 ui 问题；

## 版本 V3.6.1 2019-08-02

新功能:

- 添加主播自己下麦的接口
- 添加本地消息全局搜索的接口
- 添加 muteRemote 接口

修复:

- 修复通话状态回调不准确的问题
- 修复上传的文件大小超过限制提示慢问题
- 修复 1v1 音视频设置最大码率无效
- 修复 demo 部分功能

## 版本 V3.6.0 2019-05-28

新功能：

- 增加会议属性功能，可以方便使用音视频会议实现特定的一些场景，具体可以参见语聊 demo；
- 增加语音会议伴音功能，具体可以参见语聊 demo；
- 在附件过大时返回相应的错误码，在附件过期或不存在时，返回相应的错误码；
- 发起通话和创建会议时添加参数，是否开启服务端的录制和录制时是否合并流，通过录制 id 可以在服务器端查询；
- 支持自定义图片消息缩略图的大小；

更新：

- 升级音视频引擎，优化噪声消除，改进性能，减少建立通话的时间等；
- 从 3.6.0 版本中暂时移除了端上的录制功能，移动端可通过 SDK 参数配置每个通话是否录制，Web 端如果也需要录制则需联系商务打开全端录制功能，该功能开启后优先级将高于 SDK 参数配置；
- 优化批量消息保存方法，在批量保存后再给服务器确认消息，修复极端场景下消息未正确保存的问题；
- 发起通话和创建会议时如果音视频服务未开通或者欠费，会返回相应的错误码；
- 从 3.6.0 版本开始，sdk 只支持 ios9.0 以上版本。
- 修改一对一视频中自定义本地视频数据接口，旧的不再支持。

修复：

- 修复保存消息时消息数没有正确增加的问题；
- 修复旧版本升级到新版本时无法获取缩略图的问题;

## 版本 V3.5.5 2019-05-16

修复：

- 修复接收消息存储过程中发生异常，导致消息不能正常存储的 bug。

## 版本 V3.5.4 2019-03-27

新功能：

- 更新使用新版 UI

修复：

- 修复个别上因为状态设置影响通话接通的问题；
- 用户被禁用时登录，返回相应的错误码 EMErrorServerServingForbidden；

优化：

- 修改文件存储路径；

## 版本 V3.5.3 2019-01-18

新功能：

- 登录和注册 UI 更新
- 登录和注册页面右上角添加扫描二维码快速登录功能，使用方式详见：https://console.easemob.com/app-detail/integration

修复：

- 某些情况下使用含大写字母的 id 发消息失败
- Debug 下 log 不能关闭
- 设置中自动登录多次配置失效问题

## 版本 V3.5.2 2018-11-06

优化：

- 更新 Demo 中 1 对 1 和多人实时音视频的 UI
- 移除 IM SDK3.2.0 及以前 deprecated 的方法

修复：

- 自动登录时无网络，导致获取自己在其他设备登录的 id 包含自己的 bug
- 个别情况下，连接失败时更新服务器列表的 bug

## 版本 V3.5.1 2018-09-13

新功能：

- 多人实时音视频添加动态修改最大视频码率接口[IEMConferenceManager updateConference:maxVideoKbps:]
- 1v1 实时音视频单独录制音频的功能[EMCallRecorderPlugin startAudioRecordWithCompletion:]和[EMCallRecorderPlugin stopAudioRecordWithCompletion:]

修复：

- Fix：实时音视频中接听普通电话，挂断后音频有问题

优化：

- 去掉了多人实时音视频中 Mode 相关方法，比如[IEMConferenceManager mode]

## 版本 V3.5.0 2018-08-13

新功能：

- 为满足不同场景需求，3.5.0 版本开始将实时音视频会议划分了不同的类型，不同类型对应了不同场景，使你能够轻松地将实时音视频功能集成到你的应用或者网站中。在创建会议时可以传入以下几种类型：

```
   1. Communication：普通通信会议，最多支持参会者6人，会议里的每个参会者都可以自由说话和发布视频，该会议类型在服务器不做语音的再编码，音质最好，适用于远程医疗，在线客服等场景；
   2. Large Communication：大型通信会议，最多参会者30人，会议里的每个参会者都可以自由说话，最多支持6个人发布视频，该会议模式在服务器做混音处理，支持更多的人说话，适用于大型会议等场景；
   3. Live：互动视频会议，会议里支持最多6个主播和600个观众，观众可以通过连麦与主播互动，该会议类型适用于在线教育，互动直播等场景。
```

优化：

- 优化实时音视频多人会议功能

## 版本 V3.4.3 2018-07-18

新功能：

- 增加'只投递在线用户'消息属性，以节约消息量，目前只支持 CMD 类型消息。通过 EMCmdMessageBody.isDeliverOnlineOnly=YES 接口设置该属性

## 版本 V3.4.2 2018-06-15

新功能：

- 通过消息邀请参加其他人参加多人实时音视频会议

修复：

- 1v1 视频通话，iOS 端接收视频后，偶尔会不显示视频画面

**请注意：为提供高质量且一致的音视频体验，从 3.4.1 版本开始，1v1 通话不再与 3.1.5 及以前版本兼容，请及时升级。**

## 版本 V3.4.1 2018-05-16

优化:

- 优化 WiFi 切 4G 时与服务器重连速度
- 优化实时 1 对 1 通话

新功能：

- 新增音视频弱网检测回调
- 新增加群时填写验证消息
- 新增聊天室断线时被踢出聊天室回调

**请注意：为提供高质量且一致的音视频体验，从 3.4.1 版本开始，1v1 通话不再与 3.1.5 及以前版本兼容，请及时升级。**

## 版本 V3.4.0 2018-04-04

新功能：

- 实现不同模式的实时语音会议功能 [多人音视频会议](https://docs-im.easemob.com/im/ios/basics/multiuserconference)
- 添加动态更换对方实时视频显示页面的功能[IEMConferenceManager updateConference:streamId:remoteVideoView:completion:]

## 版本 V3.3.9 2018-02-11

新功能：

- Demo 层实现群组消息已读功能（发送方在 EMMessage.ext 中自定义字段用以表示是否需要已读回执，接收方用 CMD 消息实现已读回执）

- SDK 新增自定义实时视频传输数据接口（注意 1：进行 1v1 自定义视频之前，必须设置 EMCallOptions.enableCustomizeVideoData 为 YES，在进行默认 1v1 视频之前，必须确认 EMCallOptions.enableCustomizeVideoData=NO；注意 2：自定义视频必须设置 EMCallSession.localVideoView.previewDirectly = NO; 注意 3：Demo 中相关代码前都添加了“3.3.9 new 自定义视频数据”）

功能更新：

- 精简 Demo 的功能，移除 Demo 中的红包功能，UI 上体现在聊天页面底部“更多”去掉了红包相关的操作
- 去掉 Demo 中的 crash 收集工具，替换成了 Bugly.framework，存放在 ChatDemo-UI3.0/3rdparty
- 优化重连逻辑,解决用户迁移和服务器受攻击后部分用户连接服务超时的问题;

## 版本 V3.3.8 2018-01-24

新功能：

- 服务诊断接口， demo UI 体现在“setting-debug-服务器诊断”

- 设置音频码率, 接口[EMCallOptions maxAudioKbps]

- 添加新的错误码（达到服务器上限），体现在创建用户，创建群组，创建聊天室

功能更新：

- [EMClient isLoggedIn]语义有所改变，原意是是否已经完成登录操作，现在的意思是是否成功登录过

## 版本 V3.3.7 2017-11-30

新功能:

- demo 支持 iPhoneX

功能修复:

- 消息时间戳相同时导致消息不能正确加载；
- 离线消息在某些情况下会导致 cmd 与普通消息顺序不一致。

## 版本 V3.3.6 2017-11-03

新功能:

- 多人音视频功能
- 增加“是否自己实现消息附件上传下载”设置项 [EMOptions isAutoTransferMessageAttachments]
- 增加“是否自动下载图片和视频缩略图及语音消息”设置项 [EMOptions isAutoDownloadThumbnail]

功能修复:

- 1v1 实时音视频，接通后，一方静音后，另一方再触发静音操作不起作用；
- 使用 SDK 下载接口，如果本地已经有同名文件，新的文件名会在原有文件名后边追加数字；
- 断网情况下，自动登录无法获取会话
- 使用 SDK 上传接口，进度回调第一次会返回 100%

## 版本 V3.3.5 2017-10-23

新功能:

- 增加了传输安全性
- 增加广告插件，可以收集用户信息

优化:

- 私有部署设置 dns 的接口
- 优化私有部署重连逻辑
- 限制用户名长度为 255
- 需要服务器开通的功能接口返回 SERVICE_NOT_ENABLED(505)
- 添加 i386 库解决模拟器 profile 时的编译问题

功能修复:

- 修复 4G 与 wifi 切换时偶然出现发送消息失败的 bug

## 版本 V3.3.4 R1 2017-08-09

功能修复:

- 修复在用户名有下划线时发送消息失败的 bug；

## 版本 V3.3.4 2017-08-04

新功能:

- 新增：PC 端和手机端登录同一个账号，两个设备之间互发消息；
- 新增：消息漫游，从服务器分页获取历史消息；
- 新增：消息撤回(增值功能)。

功能修复及优化：

- 优化删除一组会话时，回调只返回一次；
- iOS SDK 不再支持 i386；
- 修复录制音频文件时，音频权限判断。

## 版本 V3.3.3 2017-07-21

新功能:

- 新增：支持在多个设备登录同一个账号，多个设备间可以同步消息，好友及群组的操作(多设备登录属于增值服务，需要联系商务开通)；
- 新增：群共享文件的大小属性；
- 新增：获取同一账号登录的设备列表的接口，并可以选择踢掉某个设备上的登录；

问题修复：

- 移除传输附件大小 10M 以内的限制；
- 修复邀请群成员时没有附带信息的 bug；
- 修复群组操作时必须获取所有已加入群组的问题；
- 修复下载附件路径不存在或者打开错误时仍然下载成功的 bug；
- 修复切换账号时某些场景下崩溃的 bug；
- 修复获取群成员时最后一页 cursor 未更新的问题；
- 修复调用异步删除好友接口，参数传“YES”不能删除会话。

## 版本 V3.3.2 2017-05-18

新功能：

- 新增：修改获取群公告，上传下载删除群共享文件，修改群扩展信息接口（接口详情请查看文档[群组管理](https://docs-im.easemob.com/im/ios/basics/group)）
- 新增：修改获取聊天室公告（接口详情请查看文档[聊天室管理](https://docs-im.easemob.com/im/ios/basics/chatroom)）
- 新增：批量设置群组免打扰接口

修复:

- 修复有时调用 getAllConversations 时返回为空的 bug
- 修复获取已加入群组超时的 bug

## 版本 V3.3.1 2017-04-07

新功能：

- 新增：使用 token 登录
- 新增：群组群成员进出群组回调

优化:

- 红包改用 cocoapods 方式集成，支持支付宝和京东支付

修复:

- insertMessage 小概率下会崩溃
- [EMMessage setTo:]赋值错误
- 聊天室获取详情接口[IEMChatroomManager fetchChatroomInfo:includeMembersList:error:]第 2 个参数传入 YES 时不能获取成员
- 2.x 和 3.x 互通情况下，群组和聊天室的 memberlist 中出现 admin 和 owner
- 发送消息成功后,对应的 EMConversation 没有更新最后一条消息

## 版本 V3.3.0 2017-03-07

新功能：

- 新增：群组改造,增加一系列新接口，具体查看[iOS 3.3.0 api 修改](https://docs-im.easemob.com/im/300iosclientintegration/3.3.0apichange)
- 新增：获取 SDK 日志路径接口，将日志文件压缩成.gz 文件，返回 gz 文件路径，[EMClient getLogFilesPath:]
- 更新：使用视频通话录制功能时，必须在开始通话之前调用[EMVideoRecorderPlugin initGlobalConfig]

优化:

- 优化 DNS 劫持时的处理
- 切换网络时，减小消息重发的等待时间

修复:

- 音视频通话丢包率（以前返回的是丢包数）
- iOS 动态库用 H264 编码在 iPhone6s 上崩溃
- 实时音视频新旧版互通崩溃

## 版本 V3.2.3 2016-12-29

新功能/优化：

- 新增：实时 1v1 音视频，设置了对方不在线发送离线推送的前提下，当对方不在线时返回回调，以便于用户自定义离线消息推送
- 更新：SDK 支持 bitcode
- 更新：SDK 使用动态库(为了方便集成开发,sdk 支持 i386,x86_64,armv7,arm64，当使用动态库上传 appstore 时，需要删除 i386,x86_64)，[动态库集成方式](https://docs-im.easemob.com/im/ios/sdk/import)
- 为了使 SDK 更简洁易用,过时的 API 会在后续 3~5 个版本进行删除

红包相关:
新增:

- 小额随机红包
- 商户后台增加修改密码功能

优化:

- 绑卡后的用户验证四要素改为验证二要素
- iOS 和 Android 两端 UI 展示一致性
- 支付流程的优化
- SDK 注册流程
- 去掉 XIB
- 集成过程的参数检查
- 风险策略

修复:

- SDKToken 注册失败的问题
- 发红包缺少参数的问题
- 修复 Emoji 表情显示乱码
- 修复支付密码可能误报出错
- 修复商户自主配置红包最低限额错误
- 修复零钱明细显示顺序错误问题
- 修改抢红包流程为依赖后端数据
- 修复支行信息返回为空时的文案

## 版本 V3.2.2 R2 2016-12-14

新功能/优化：

- 修复 3.2.2 版本设置只使用 https，某些情况下无法返回数据的问题

## 版本 V3.2.2 2016-12-08

新功能/优化：

- SDK 满足 apple ATS 的要求(EMOptions 添加 usingHttpsOnly 参数,默认使用 YES)
- 删除好友逻辑的修改(增加是否删除会话选项)
- 修复呼叫时对方不在线，不能正确显示通话结束原因的问题
- 音视频 EMCallOptions 中添加了新接口,增加是否固定分辨率,最大视频帧率,最小视频码率接口.[详情参考 API Doc](https://www.easemob.com/apidoc/ios/chat3.0/index.html)
- 音视频 EMCallOptions 中接口改动 videoKbps → maxVideoKbps

## 版本 V3.2.1 2016-11-12

新功能/优化：

- 聊天室列表支持分页获取
- EMOption 中 usingHttps 默认为 YES

bug fix:

- 修复 Lite 版本 SDK 编译 warning 的问题

## 版本 V3.2.0 2016-10-15

音视频包含大量升级改进，细节请参考集成文档

- 增强的自适应视频质量算法，根据网络环境动态调整清晰度；
- 优化了语音算法，通话更清晰；
- 支持高清视频，画质更细腻；
- 支持横屏和竖屏自由转换；
- 支持画面 fit 和 fill 模式；

红包功能改进：

- 增加个人间转账功能
- 增加拆红包音效

其他改进：

- iOS10 进行适配
- cmd 消息增加“em\_” 和 “easemob::” 开头的 action 为内部保留字段；
- Fix 个别情况下会话未读消息数显示不准确的 bug；
- Fix 个别情况下获取联系人不正确的 bug；
- Fix 登录户马上加入聊天室某些情况下会失败的 bug；
- 发送语音或者视频时，如果文件内容过小会给出提示；
- 优化读取数据库的性能；

## 版本 V3.1.5 2016-8-26

新功能：

1. 提高 SDK 稳定性
2. 去除依赖库(libcrypto.a,libcurl.a,libssl.a)
3. 提高从 2.x 版本 SDK 数据库迁移效率
4. 进一步修改 api 命名的规范性，建议使用新的 api,具体详情可以参考[接口文档](https://www.easemob.com/apidoc/ios/chat3.0/index.html)

bug fix:

1. 修改实时视频显示问题

## 版本 V3.1.4 2016-7-08

新功能：

1. 聊天室增加可以获取成员和成员数的接口
2. 会话增加接口- (BOOL)appendMessage:(EMMessage \*)aMessage
3. 提高 SDK 稳定性
4. 支持群消息@功能（在 EaseUI 和 Demo 中实现）

- 支持@all， “ext”:{“em_at_list”:“ALL”}支持
- @单个或多个成员， “ext”:{“em_at_list”:[“username1”,“username2”]}
- 如果用户设置了推送显示消息详情，被@的用户会收到推送 “XXX 在群中@了我”

红包相关:

1. 支持群内的专属红包，只有指定用户才能抢红包；
2. 支持支付宝；
3. 支持系统发的群红包，用户只能看到自己的领取情况；
4. 支持绑定多张银行卡，支持解绑银行卡；
5. 零钱页支持充值；
6. 改版零钱页；
7. 支持上传身份证照片做第三通道验证；
8. 红包 UI 细节打磨，包括双 title 和各个页面细节，安卓和 iOS 文案统一；
9. 错误信息梳理，关键错误基于对话框引导；
10. 服务端性能数倍的提升；
11. 红包数据平台完善统计项；
12. 其他优化：优化代码结构，剥离第三方库减少和开发者库的冲突；透传消息仅给发红包用户而非群内全部用户；优化 token 获取和更新机制；修复若干 bug。

## 版本 V3.1.3 2016-5-27

新功能：

1. SDK 增加实时视频通话切换摄像头功能。
2. SDK 支持 ipv6。
3. 消息支持按照本地时间或者服务器时间排序。
4. Demo 支持单聊发送红包和群聊发送红包。

bug fix:

1. 修复自动同意好友请求有延迟的问题。

SDK 细节调整:

1. SDK 将第三方依赖从 SDK 静态库分离出来(libssl.a,libcrypto.a,libcurl.a)

## 版本 V3.1.2 2016-4-22

新功能：

1. 增加消息搜索功能，可以根据消息类型或者关键字搜索。
2. API 修改，加载消息方法增加方向参数。
3. 优化绑定 deviceToken 逻辑。

bug fix:

1. Fix 修复发送系统表情时对方接到为乱码或空白的问题。

## 版本 V3.1.1 2016-4-01

新功能：

1. 音视频增加弱网/断网检测功能。
2. 音视频增加音频、视频流暂停、恢复功能。
3. 音视频增加录制功能。
4. 发送图片默认压缩图片，节约流量。

bug fix:

1. Fix iOS demo 退到后台后某些情况下 crash 的 bug。

## 版本 V3.1.0 2016-3-06

新功能：

1. 增加了音视频功能，用户可以建立一对一的音频通话，视频通话。

bug fix:

1. 修复了扩展字段解析的问题。
2. 修复了用户 ID 中有下划线时，会话中 ID 显示不完整的问题。

## 版本 V3.0.1 2016-2-26

bug fix:

1. 修复部分设备在网络异常时启动 APP crash 的问题。
2. 修复有时绑定 deviceToken 失败问题。
3. 修复设置群组最大人数问题。
4. 修复 Demo 添加好友黑名单 crash 的问题。

## 版本 V3.0.0 2016-2-19

1. 全新的通信协议：全新的基于消息同步的私有协议，在不稳定网络环境下更稳定更省流量，确保消息投递的可靠、顺序以及实时性，并具有更高的安全性。同时提供了更好的扩展性，将支持更多的对接和设备同步场景。
2. 全新的 SDK：全面重构，将核心通信模块做了更好的封装；简化了接口，结构更清晰，集成更容易；提升了登录速度和弱网络环境下的可靠性编辑。
