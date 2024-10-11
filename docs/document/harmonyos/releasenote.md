# HarmonyOS IM SDK 更新日志

<Toc />

## 版本 V1.4.0 Dev 2024-09-30（开发版）

### 新增特性

- 新增[置顶消息功能](message_pin.html#消息置顶)。
- 新增根据多个消息类型[搜索本地消息](message_search.html)功能。
  - `ChatManager#searchMessagesFromDB`：[根据单个或多个消息类型，搜索本地数据库中所有会话的消息](message_search.html#根据消息类型搜索会话消息)。
  - `Conversation#searchMessagesByType`：[根据单个或多个消息类型，搜索本地数据库中单个会话的消息](message_search.html#根据消息类型搜索会话消息)。
- 新增 `ChatOptions#setEnableTLSConnection` 选项，支持私有部署时设置是否开启 TLS 连接。
- 支持[会话推送通知方式的本地存储](/document/harmonyos/push/push_notification_mode_dnd.html#从服务器获取所有会话的推送通知方式设置):
  - 新增 `PushManager#syncConversationsSilentModeFromServer` 方法，支持从服务器同步所有会话的推送通知方式设置。
  - 新增 `Conversation#pushRemindType` 属性，用于获取本地存储会话的推送通知方式。
  - 若用户在一台设备上变更会话的推送通知方式，其他设备会收到 `MultiDeviceListener#onConversationEvent` 事件。
- 新增 `Conversation#getMsgCountInRange` 方法，用于[获取 SDK 本地数据库中会话某个时间段内的全部消息数](message_retrieve.html#获取会话在一定时间内的消息数)。
- 新增[设备登录时允许携带自定义信息，并将其传递给被踢的设备](multi_device.html#设置登录设备的扩展信息)：
  - `ChatOptions#setLoginCustomExt`：设置设备的扩展信息；
  - `ChatOptions#getLoginCustomExt`：获取设备的扩展信息。
  - `ConnectionListener#onLogout(errorCode: number, info: LoginExtInfo)`：多设备登录场景下，若当前设备被新登录设备踢下线，被踢设备收到的事件中会携带新设备的扩展信息。
- 新增[从服务器拉取离线消息的开始和结束的事件回调](overview.html#连接状态相关): `ConnectionListener#onOfflineMessageSyncStart` 和 `ConnectionListener#onOfflineMessageSyncFinish`。
- 新增 `GroupManager#checkIfInGroupMutelist` 接口，可以[查看当前用户是否在群组禁言列表中](group_members.html#检查自己是否在禁言列表中)。
- 新增 [错误码 213 ChatError#USER_BIND_ANOTHER_DEVICE](error.html)，用于当用户达到登录设备上线时，当前设备无法登录的场景。
- 在撤回消息的 `ChatMessageListener#onMessageRecalled` 事件中[返回被撤回的消息所属的会话 ID](message_recall.html#设置消息撤回监听)。
- 支持[加入聊天室时携带扩展信息，并指定是否退出之前加入的全部聊天室](room_manage.html#加入聊天室)：
  - 新增 `ChatroomManager#joinChatroom(roomId: string, leaveOtherRooms?: boolean, ext?: string)` 方法，支持设置加入聊天室时携带的扩展信息，并指定是否退出所有其他聊天室。
  - 新增 `ChatroomListener#onMemberJoined(roomId: string, userId: string, ext?: string)` 回调，当用户加入聊天室携带了扩展信息时，聊天室内其他人可以在用户加入聊天室的回调中，获取到扩展信息。
- 支持 AUT 协议，优化弱网环境下的服务连接成功率。
- 支持文件分片上传。
- 支持[从服务端单向删除聊天室漫游消息](message_delete.html#单向删除服务端的历史消息)。

### 优化

- 支持 x86_64 架构。
- 从服务端拉取群组时，不再先清除本地群组，而是将拉取的群组与本地对比，将本地现有群组进行更新，将新增部分在本地插入。若要清除本地群组信息，可以调用 `GroupManager#clearAllLocalGroups` 方法。
- 构建附件消息时，SDK 内部会读取文件长度，并设置给 `fileLength` 参数。
- 设置和获取用户属性的接口，包括[设置当前用户的属性、获取单个或多个用户的用户属性和获取指定用户的指定用户属性](userprofile.html)，超过调用频率限制时，会上报错误码 `4` (`ChatError#EXCEED_SERVICE_LIMIT`)。

## 版本 V1.3.0 Dev 2024-09-10（开发版）

### 新增特性

- 新增[群成员自定义属性](group_members.html#管理群成员的自定义属性)功能：
  - `setMemberAttributes`：设置群成员自定义属性。
  - `fetchMemberAttributes`：获取单个群成员的所有自定义属性。
  - `fetchMembersAttributes`：根据属性 key 获取多个群成员的自定义属性。
  - `GroupListener#onGroupMemberAttributeChanged`：群组成员自定义属性变化的回调。
- 新增[设置推送通知的显示内容](/document/harmonyos/push/push_display.html) 、[推送通知方式和免打扰模式功能](/document/harmonyos/push/push_notification_mode_dnd.html)。
- 新增[在线状态订阅](presence.html)功能。
- 新增[聊天室自定义属性](room_attributes.html#管理聊天室自定义属性-key-value)功能。
  - `fetchChatroomAttributes`：获取聊天室自定义属性。
  - `setChatroomAttributes`：设置聊天室自定义属性。
  - `removeChatroomAttributes`：删除聊天室自定义属性。
  - `ChatroomListener#onAttributesUpdate`：聊天室自定义属性有更新。
  - `ChatroomListener#onAttributesRemoved`：聊天室自定义属性被移除。

### 优化

- 适配在 HarmonyOS NEXT 应用中使用 HarmonyOS APK 的 SDK 加密数据库。

### 修复

- 修复 CMD 消息不能设置 action 的问题；
- 修复消息不能设置 JSON 格式数据的问题；
  - 新增 `setJsonAttribute` 方法。
- 修复部分回调存在跨线程调用 JS 对象的问题；
- 修复枚举 `LEAVE_REASON` 没有导出的问题；
- 修复发送图片时获取图片宽高失败的问题。

**注意**：SDK V1.3.0 采用官方推荐的字节码构建方式，使用之后版本需要 DevEco Studio 升级到 5.0.3.502 及以上，并需要工程支持该构建模式。详见[快速开始](quickstart.html)。

## 版本 V1.2.0 Dev 2024-07-11（开发版）

### 新增特性

- 新增 `getAllConversationsBySort` 方法实现[从本地获取排序后的会话列表](conversation_list.html#一次性获取本地所有会话)。 
- 新增[表情回复 Reaction](reaction.html) 功能：
  - `addReaction`：在消息上添加 Reaction。
  - `removeReaction`：删除消息的 Reaction。
  - `fetchReactions`：获取消息的 Reaction 列表。
  - `fetchReactionDetail`：获取 Reaction 详情。
  - `ChatMessage.getReactions()`：从 `ChatMessage` 对象获取 Reaction 列表。
- 新增[会话标记](conversation_mark.html)功能：
  - `ChatManager#addConversationMark`：标记会话。
  - `ChatManager#removeConversationMark`：取消标记会话。
  - `ChatManager#fetchConversationsFromServerWithFilter`：根据会话标记从服务器分页查询会话列表。
  - `Conversation#marks`：获取本地单个会话的所有标记。
  - `onConversationEvent#MultiDevicesEvent.CONVERSATION_MARK_UPDATE`：[多设备场景下的会话标记事件](multi_device.html#获取其他设备上的操作)。当前用户在一台登录设备上更新了会话标记，包括添加和移除会话标记，其他登录设备会收到该事件。
- 新增[会话置顶](conversation_pin.html)功能。
  - `ChatManager#pinConversation`：设置置顶或取消置顶会话。
  - `fetchPinnedConversationsFromServer`：从服务端分页获取置顶会话列表。
- 新增[用户属性](userprofile.html)功能。
  - `UserInfoManager#updateUserInfo`：设置和修改当前用户自己的属性信息。
  - `UserInfoManager#fetchUserInfoById`：获取指定用户的属性信息。

## 版本 V1.1.0 Dev 2024-07-01（开发版）

### 新增特性

- 新增[修改消息](message_modify.html)功能。
- 新增[自定义消息](message_send_receive.html#发送自定义类型消息)功能。
- 新增[合并转发消息](message_send_receive.html#发送和接收合并消息)功能。
- 支持 [HarmonyOS 推送](/document/harmonyos/push/push_overview.html)能力。

### 优化

- `ChatClient#init` 方法中新增 `Context` 参数。
- 修改 SDK 文件路径到应用级的应用文件路径下。

## 版本 V1.0.0 Dev 2024-06-7（开发版）

### 新增特性

环信即时通讯 HarmonyOS SDK 支持单聊、群组聊天和聊天室聊天场景，实现了以下特性：

- 支持消息特性：
  - [发送和接收消息](message_send_receive.html)；
  - [获取历史消息](message_retrieve.html)；
  - [撤回消息](message_recall.html)；
  - [消息回执](message_receipt.html)；
  - [转发消息](message_forward.html)；
  - [导入和插入消息](message_import_insert.html)；
  - [更新消息](message_update.html)；
  - [删除消息](message_delete.html)；
  - [只投在线用户](message_deliver_only_online.html)。
- 支持会话特性：
  - [会话列表](conversation_list.html)；
  - [会话未读数](conversation_unread.html)；
  - [删除会话](conversation_delete.html)。
- 支持[用户关系管理](user_relationship.html)特性：
  - [添加、删除好友](user_relationship.html#添加好友)；
  - [设置好友备注](user_relationship.html#设置好友备注)；
  - [获取好友列表](user_relationship.html#从服务端获取好友列表)；
  - [好友黑名单管理](user_relationship.html#添加用户到黑名单)。
- 支持群组管理特性：
  - [创建和管理群组](group_manage.html)：创建/解散群组、获取群组详情、获取群成员列表、获取群组列表、查询当前用户已加入的群组数量、屏蔽和解除屏蔽群消息以及监听群组事件。
  - [管理群成员](group_members.html)：更换群主、添加、移除和获取群管理员、群组白名单和黑名单、群组禁言等。
  - [管理群组属性](group_attributes.html)：修改群组名称和群组描述、获取群公告、更新群扩展字段。 
- 支持聊天室管理特性：
  - [创建和管理聊天室](room_manage.html)：创建、加入和退出聊天室和监听聊天室事件。
  - [管理聊天室成员](room_members.html)：更换聊天室所有者、添加、移除和获取聊天室管理员、聊天室白名单和黑名单、聊天室禁言等。
  - [管理聊天室属性](room_attributes.html)：修改聊天室名称和描述、获取和更新聊天室公告。 
- 支持[多设备登录](multi_device.html)特性。  



