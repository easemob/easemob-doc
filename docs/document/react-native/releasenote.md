# React-Native IM SDK 更新日志

<Toc />

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