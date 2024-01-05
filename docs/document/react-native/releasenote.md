# React-Native IM SDK 更新日志

<Toc />

## 版本 V1.3.0 2024-1-4

#### 新增特性

- 依赖的原生 SDK 升级到版本（`iOS` 4.2.0 和`Android` 4.2.1）。添加原生 SDK 提供的新功能。
- 新增[设置好友备注功能](user_relationship.html#设置好友备注)。
- 新增 `ChatContactManager.fetchAllContacts` 和 `ChatContactManager.fetchContacts` 方法分别[从服务器一次性和分页获取好友列表](user_relationship.html#从服务端获取好友列表)，每个好友对象包含好友的用户 ID 和好友备注。
- 新增 `ChatContactManager.getContact` 方法[从本地获取单个好友的用户 ID 和好友备注](user_relationship.html#从本地获取好友列表)。
- 新增 `ChatContactManager.getAllContacts` 方法[从本地一次性获取好友列表](user_relationship.html#从本地获取好友列表)，每个好友对象包含好友的用户 ID 和好友备注。
- 新增 `ChatMessage.isBroadcast` 属性用于判断通该消息是否为聊天室全局广播消息。可通过[调用 REST API 发送聊天室全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。
- 新增 `ChatGroupManager.fetchJoinedGroupCount` 方法用于从服务器获取当前用户已加入的群组数量。
- [申请入群被拒绝的回调](group_manage.html#监听群组事件) `EMGroupEventHandler#onRequestToJoinDeclinedFromGroup` 中新增 `decliner` 和 `applicant` 参数表示申请者和拒绝者的用户 ID。

## 版本 V1.2.1 2023-8-16

### 修复

- 移除创建消息对象的参数 `secret`。该参数由服务器生成，在发送消息成功之后会获取到。

## 版本 V1.2.0 2023-8-16

### 新增特性

- React-Native 从 0.66.5 升级到 0.71.11。
- 依赖的原生 SDK（iOS 和 Android）升级到版本 4.1.1。添加原生 SDK 提供的新功能。
- 新增 `ChatManager.fetchConversationsFromServerWithCursor` 方法[从服务器分页获取会话列表](conversation_list.html#获取会话列表)。
- 新增[置顶服务器会话的功能](conversation_list.html#获取服务端的置顶会话列表)：
  - 新增 `ChatManager.pinConversation` 方法，实现置顶或取消置顶服务器会话；
  - 新增 `ChatManager.fetchPinnedConversationsFromServerWithCursor` 从服务器分页获取置顶会话列表。
- 新增 `ChatManager.modifyMessageBody` 方法，用于修改本地消息或服务器端消息。
- 新增[消息合并转发功能](message_send_receive.html#发送和接收合并消息)：
  - 新增 `ChatMessage.createCombineMessage` 方法构建合并消息。
  - 新增 `ChatManager.fetchCombineMessageDetail` 方法获取合并消息的信息。
- 新增[自定义登录设备的名称和平台的功能](multi_device.html#设置登录设备的名称)。  
- 新增 `ChatPushManager.selectPushTemplate` 方法基于自定义推送模板进行离线推送。
- 新增 `ChatPushManager.fetchSelectedPushTemplate` 获取选定的推送模板以进行离线推送。
- 在 `ChatClient.getLoggedInDevicesFromServer` 方法中添加 token 参数可使用用户 token 获取在线设备列表。
- [在 `ChatClient.kickDevice` 和 `ChatClient.kickAllDevices` 方法中添加 token 参数可使用用户 token 将指定用户的某个或全部的登录设备踢下线](multi_device.html#强制指定账号从单个设备下线)。
- 更新监听器：
  - `ChatEvents.ChatConnectEventListener.onUserDidLoginFromOtherDevice`：添加 `deviceName` 参数。
  - `ChatEvents.ChatConnectEventListener`：添加 `onUserDidRemoveFromServer`、`onUserDidForbidByServer`、`onUserDidChangePassword`、`onUserDidLoginTooManyDevice`、`onUserKickedByOtherDevice` 和 `onUserAuthenticationFailed` 事件通知。
  - `ChatEvents.ChatConnectEventListener.onDisconnected`：删除代码参数。
  - `ChatEvents.ChatMultiDeviceEventListener`：添加 `onMessageRemoved` 事件。
  - `ChatEvents.ChatMultiDeviceEventListener`：添加 `onConversationEvent` 事件。
  - `ChatEvents.ChatMessageEventListener`：添加 `onMessageContentChanged` 事件。
  - `ChatRoomEventListener.onRemoved`：添加 `reason` 参数。
- 更新以下数据对象：
  - `ChatConversation`：添加 `isPinned` 和 `pinnedTime` 属性。
  - `ChatMessage.ChatMessageType`：添加 `COMBINE` 类型消息正文。
  - `ChatMessage`：添加 `receiverList` 属性。
  - 创建发送消息：添加 `secret` 参数。
  - `ChatMessage.ChatMessageBody`：添加 `lastModifyOperatorId`、`lastModifyTime` 和 `modifyCount` 属性。
  - `ChatOptions`：添加 `enableEmptyConversation`、`customDeviceName` 和 `customOSType` 属性。
  - `ChatEvents.ChatMultiDeviceEvent`：添加 `CONVERSATION_PINNED`、`CONVERSATION_UNPINNED` 和 `CONVERSATION_DELETED`事件。
- 添加数据对象：
`ChatMessage.ChatCombineMessageBody`：添加组合消息正文对象。

### 优化

- 优化断线通知，分离出服务器主动断线的通知，用户可以具体处理服务器主动断线的原因。
- 使用 commitlint 优化 git 提交规范，确保提交的代码符合规范。
- 使用 lefthook 优化 git commit。添加使用 gitleaks 检查敏感信息。
- 在 `ChatManager` 对象中，`deleteAllMessages` 重命名为 `deleteConversationAllMessages`。
- 在 `ChatEvents.ChatRoomEventListener` 对象中，`onRemoved` 重命名为 `onMemberRemoved`。
- 在 `ChatEvents.ChatGroupEventListener` 对象中，`onUserRemoved` 重命名为 `onMemberRemoved`。
- 在 `ChatEvents.ChatRoomEventListener` 对象中，`onChatRoomDestroyed` 重命名为 `onDestroyed`。
- 在 `ChatEvents.ChatGroupEventListener` 对象中，`onGroupDestroyed` 重命名为 `onDestroyed`。
- 弃用 `ChatManager.fetchAllConversations`，改用 `ChatManager.fetchConversationsFromServerWithCursor`。

### 修复

修复 Android 平台下由于添加表情响应导致应用程序崩溃的问题。

## 版本 V1.1.2 2023-6-28

#### 新增特性

- 原生平台 Android 和 iOS 的 SDK 升级到 v4.0.2。
- 新增 `ChatClient.version` 属性用于获取当前 SDK 的版本号。
- 新增 `ChatGroupManager.setMemberAttribute` 方法用于[设置单个群组成员的属性](group_members.html#设置群组成员自定义属性)。
- 新增 `ChatGroupManager.fetchMemberAttributes` 方法用于[从服务器获取单个群成员的所有自定义属性](group_members.html#获取单个群成员的所有自定义属性)以及[根据属性 key 获取多个群成员的自定义属性](group_members.html#根据属性-key-获取多个群成员的自定义属性)。
- 添加 `ChatManager.fetchHistoryMessagesByOptions` 根据消息拉取参数配置类（`ChatFetchMessageOptions`）从服务器分页获取指定会话的历史消息。`ChatFetchMessageOptions` 类中包括起始时间戳、消息类型和消息发送方等参数。
- 新增 `ChatManager.deleteMessagesWithTimestamp` 方法实现[删除指定时间段内的本地消息](message_manage.html#删除指定时间段的本地消息)。
- 新增 [`ChatGroupEventListener.onMemberAttributesChanged` 事件](group_manage.html#监听群组事件)，在单个群成员的属性发生变更时，群内其他成员会收到该事件。
- 新增 `ChatConnectEventListener.onAppActiveNumberReachLimit` 事件，在应用程序的日活跃用户数量（DAU）或月活跃用户数量（MAU）达到上限时触发该事件。
- 新增日志回调接口 `handler`。

#### 优化

- 删除敏感信息。
- 优化 `ChatManager.fetchHistoryMessages` 方法，更新接口声明。
- 优化 iOS 文件类型的消息，当发送消息时本地路径带有 `file://` 时发送成功。

#### 修复

- 修复更新 token 方法 `renewAgoraToken` 中的问题。
- 修复 Android 平台发送视频消息失败的问题。

## 版本 V1.1.1 2023-3-8

#### 修复

修复调用 `ChatGroupManager#fetchJoinedGroupsFromServer` 方法时获取加入的公开群的扩展属性为空的问题。

## 版本 V1.1.0 2023-2-24

#### 新增特性

- 依赖的原生平台 `iOS` 和 `Android` 的 SDK 升级为 v4.0.0 版本。
- 新增 `ChatManager#fetchConversationsFromServerWithPage` 方法实现从服务器分页获取会话列表。
- 新增 `ChatMessage#messagePriority` 方法实现聊天室消息优先级功能，确保高优先级消息优先处理。

#### 优化

- 移除测试数据的敏感信息。
- `ChatGroupManager` 类中的方法 `inviterUser` 重命名为 `inviteUser`。
- `ChatMultiDeviceEvent` 枚举类型 `GROUP_ADD_USER_WHITE_LIST` 重命名为 `GROUP_ADD_USER_ALLOW_LIST`。
- `ChatMultiDeviceEvent` 枚举类型 `GROUP_REMOVE_USER_WHITE_LIST` 重命名为 `GROUP_REMOVE_USER_ALLOW_LIST`。

#### 修复

- 修复原生平台部分不安全代码。
- 修复获取会话可能失败的问题。
- 修复回调方法可能多次进入主线程导致死锁的问题。该问题只可能发生在 iOS 平台。

## 版本 V1.0.11 Dev 2022-12-12

#### 优化

依赖的 iOS 和 Android SDK 升级为 3.9.9 版本。

#### 修复

- 修复极端情况下 SDK 崩溃的问题。
- 修复某些场景下调用 `updateMessage` 方法导致的内存与数据库中的消息不一致问题。
- 适配 Android 12，修复依赖环信即时通讯云 SDK 的 APK 在 Android 12 版本的部分手机上第一次安装后打开时出现异常弹框的问题。

## 版本 V1.0.10 Dev 2022-10-13

#### 修复

修复 Android 平台进行 JSON 转换可能出现的超限问题。该问题影响返回数组类型数据的接口，若此类接口返回的数据元素超过 50 个，则可能抛出异常。

## 版本 V1.0.9 Dev 2022-10-08

#### 新增特性

`ChatGroupEventListener` 中新增两个事件：
- `onDetailChanged`：群组详情变更事件。
- `onStateChanged`：群组禁用状态变更事件。

#### 修复

修复聊天室自定义属性问题。

## 版本 V1.0.8 Dev 2022-09-30

#### 新增特性

- 新增聊天室自定义属性功能。
- 在 `ChatOptions` 类中新增 `areaCode` 参数限制连接边缘节点的范围。
- `ChatGroupOptions` 中增加 `isDisabled` 属性显示群组禁用状态，需要开发者在服务端设置。该属性在调用 `ChatGroupManager` 中的 `fetchGroupInfoFromServer` 方法获取群组详情时返回。

#### 修复

- 修复极少数场景下，从服务器获取较大数量的消息时失败的问题。
- 修复数据统计不正确的问题。
- 修复极少数场景下打印日志导致的崩溃。


## 版本 V1.0.7 2022-09-07

#### 兼容性变更

`unSubscribe` 方法重命名为 `unsubscribe`。

#### 新增特性

- 新增 `setConversationExtension` 方法用于设置会话扩展。
- 新增 `insertMessage` 方法插入消息。
- 新增 `deleteMessagesBeforeTimestamp` 方法删除指定时间戳之前的消息。
- 新增 `getThreadConversation` 方法获取或创建子区会话。
- `ChatConversation` 类中添加 `isChatThread` 属性确认会话是否为子区会话。
- 新增 `ChatPushManager` 类支持推送通知设置。
- 新增 `ChatPushConfig` 类支持 FCM 推送配置。
- 在 `ChatOptions` 类中新增 `pushConfig` 方法支持推送初始化设置。
- 在 `ChatClient` 类中新增 `updatePushConfig` 方法支持推送配置更新。

#### 优化

- 依赖的原生的 SDK（iOS 和 Android）升级到 V1.0.7。
- 监听方法调整为可选。
- 更新发布脚本。
- 更新 demo。

#### 问题修复

修复相关方法中的 `type` 字段的 JSON 解析错误。

## 版本 V1.0.6 2022-7-22

#### 兼容性变更

1. 以下方法进行了重命名：

- `deleteRemoteConversation` 方法重命名为 `removeConversationFromServer`。
- `loadAllConversations` 方法重命名为 `getAllConversations`。
- `getConversationsFromServer` 方法重命名为 `fetchAllConversations`。
- `getUnreadMessageCount` 方法重命名为 `getUnreadCount`。
- `fetchLatestMessage` 方法重命名为 `getLatestMessage`。
- `fetchLastReceivedMessage` 方法重命名为 `getLatestReceivedMessage`。
- `unreadCount` 方法重命名为 `getConversationUnreadCount`。
- `getMessagesFromTime` 方法重命名为 `getMessageWithTimestamp`。
- 白名单和黑名单相关的方法名进行了重命名：
  - 白名单相关的方法名中的 `WhiteList` 修改为 `AllowList`，如 `getGroupWhiteListFromServer` 修改为 `getGroupAllowListFromServer`；
  - 黑名单相关的方法名中的 `BlackList` 修改为 `BlockList`，如 `getGroupBlackListFromServer` 修改为 `getGroupBlockListFromServer`。

2. 删除了以下方法：

- `getMessageById`
- `insertMessage`
- `appendMessage`

#### 新增特性

消息中新增 `isOnline` 字段。

#### 优化

- 更新了接口示例应用。
- 依赖的 SDK（Android 和 iOS）升级至 V3.9.4。
- React-Native 升级至 0.66.4 LTS 版本。
- Android 平台无需再执行其他操作。
- `agora-react-native-chat` 重命名为 `react-native-agora-chat`。
  

#### 修复

类型声明切入点不正确。

## 版本 V1.0.5 2022-6-21

这是 React Native SDK 第一个正式发布的版本，包含以下功能：

- 在单聊、群聊、聊天室和子区中发送和接收消息；
- 管理会话和消息；
- 管理群组和聊天室；
- 用户在线状态订阅；
- 消息表情回复；
- 管理子区等。

关于详细功能概述请参见： [产品概述](/product/introduction.html).

具体集成请参考以下文档：

- [开通配置环信即时通讯 IM 服务](/product/enable_and_configure_IM.html)
- [环信即时通讯 IM React-Native 快速开始](quickstart.html)
- [消息管理 React Native](message_overview.html)
- [群组](group_overview.html)
- [聊天室](room_overview.html)
- [用户在线状态订阅 Presence](presence.html)
- [消息表情回复](reaction.html)
- [子区管理](thread.html)
- [API Reference](apireference.html)