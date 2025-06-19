# HarmonyOS IM SDK 更新日志

<Toc />

## 版本 V1.8.0 Dev 2025-6-6（开发版）

### 新增特性

- [撤回消息](message_recall.html) 时，支持群主/聊天室所有者和管理员撤回其他用户发送的消息。
- 群组成员进出事件支持一次通知多个成员进出群组。调整前，SDK 会为每个加入/退出的成员单独回调一条事件。
  - 新增群成员进出事件 [onMembersJoined](group_manage.html#监听群组事件) 和 [onMembersExited](group_manage.html#监听群组事件)。已废弃原事件 `onMemberJoined` 和 `onMemberExited`，请使用新事件代替。 
- 支持 [获取群成员信息列表](group_manage.html#获取群成员列表) 时除了用户 ID 还包括成员角色和加群时间。
  
### 优化

- 修改 Token 即将过期事件 [onTokenWillExpire](connection.html#监听连接状态) 的触发时机。SDK 在 Token 有效期达到 80% 左右时（之前版本为 50% ）回调即将过期通知。
- 支持用户通过字面量的方式设置初始化时的条件。详见 [初始化文档](initialization.html)。
- 对 `ChatManager` 和 `Conversation` 中 [本地搜索消息接口](message_search.html) 增加默认参数，方便用户调用。

## 版本 V1.7.0 Dev 2025-5-15（开发版）

### 新增特性

- 支持 [发送](message_send.html#发送-gif-图片消息) 和 [接收 GIF 图片消息](message_receive.html#接收-gif-图片消息)。
- 支持 [群组头像功能](group_attributes.html#管理群组头像)。 
- 支持 [消息附件下载鉴权功能](message_receive.html#接收附件消息)。该功能需要联系商务开通，开通后必须调用 SDK 的 API 才能下载消息附件。
- 支持拉取漫游消息时，[只拉取指定的群成员发送的消息](message_retrieve.html#从服务器获取指定群成员发送的消息)。
- 支持加载本地会话消息时，[只加载指定群成员发送的消息](message_retrieve.html#从本地获取指定群成员发送的消息)。
- 支持 [根据搜索范围搜索所有会话中的消息](message_search.html#根据搜索范围搜索所有会话中的消息) 和 [单个会话中的消息](message_search.html#根据搜索范围搜索当前会话中的消息)：可以根据关键字搜索消息时，选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。

### 优化

- 升级 SDK 使用的 BoringSSL 和 SQLCipher 库，避免安全风险。
- 日志文件中增加设备时区偏移，方便排查问题。
- 调用方法 [ChatManager#fetchHistoryMessages](message_retrieve.html#从服务器获取指定会话的消息) 拉取漫游消息，拉取到最后一页时，返回的 `CursorResult#getNextCursor` 由字符串 `undefined` 改为空字符串。

### 修复

- 修复删除本地会话时缓存中的消息未删除的问题。
- 修复消息扩展属性 `ext` 判断字符串为 JSON 类型时转换有误的问题。

## 版本 V1.6.0 Dev 2025-4-9（开发版）

### 优化

- 发送后修改消息接口 [ContactManager#modifyMessage](message_modify.html) 支持修改各类消息：
  - 文本/自定义消息：支持修改消息内容（body）和扩展 `ext`。
  - 文件/视频/音频/图片/位置/合并转发消息：只支持修改消息扩展 `ext`。
  - 命令消息：不支持修改。
- [ChatMessage.setExt](message_extension.html)支持 object 类型的扩展字段。
- SDK 优化切换到前台后的重连逻辑。
- 优化重连逻辑，默认切换重连的地址。

## 版本 V1.5.3 Dev 2025-3-17（开发版）

### 新增特性

- 新增 [ContactManager#getContact](user_relationship.html#从本地获取好友列表) 方法，用于获取本地单个联系人的信息。

### 优化

- `PushListener#onError` 回调，增加回调 SDK 内部调用系统库 PushKit 获取 push token 失败的信息。
- 底层长连接使用 poll 代替 select，解决文件描述符（fd）最大数量 1024 的限制问题。

## 版本 V1.5.2 Dev 2025-3-10（开发版）

### 新增特性

- 新增 `ChatManager#deleteAllConversationsAndMessages` 方法，用于[清空当前用户的聊天记录](message_delete.html#清空聊天记录)，包括消息和会话，同时可以选择是否清除服务端的聊天记录。
- 新增 `ChatClient#isConnected` 方法，用于检查 SDK 是否连接到环信服务器。自动登录的场景下，登录状态变为已登录时，可能 SDK 未成功连接至服务端，这种情况下与服务器交互的操作会失败，比如发消息。此时，可调用 `isConnected` 接口判断 SDK 与服务器的连接状态。

### 修复

- 修复设置 `Conversation#searchMessagesByType` 传入 `ContentType#TXT` 时报错的问题。
- 修复 `不是 TextMessageBody` 时获取消息修改信息崩溃的问题。
- 修复 `UserInfoManager#updateUserInfo` 传入 `UserInfoType#GENDER` 时，返回类型有误的问题。
- 修复自动登录时偶现崩溃的问题。

## 版本 V1.5.1 Dev 2025-1-24（开发版）

### 修复

- 修复设置 `ChatOptions#setCustomOSPlatform` 不生效的问题。
- 修复未拉取好友时收到好友事件，导致好友列表不能更新的问题。

## 版本 V1.5.0 Dev 2025-1-10（开发版）

### 新增特性

- 用户加入聊天室可获取如下信息：
  1. 聊天室当前人数：新增  `Chatroom#memberCount` 方法获取。有用户加入或离开聊天室时，当前聊天室人数会更新。
  2. 聊天室全体禁言状态：通过 `Chatroom#isAllMemberMuted` 方法获取。该状态值在收到全体禁言状态变更时会更新。
  3. 聊天室创建时间戳：新增 `Chatroom#createTimestamp` 方法获取。
  4. 当前用户是否在聊天室白名单中：新增 `Chatroom#isInWhitelist` 方法获取。
  5. 当前用户被禁言截止时间戳：新增 `Chatroom#muteExpireTimestamp` 方法获取。

- 新增[自定义设备的平台和名称功能](multi_device.html#设置登录设备的名称)：
  - `ChatOptions#setCustomOSPlatform` 和 `ChatOptions#getCustomDeviceName`，用于设置和获取当前设备自定义平台代号；
  - `ChatOptions#setCustomDeviceName` 和 `ChatOptions#getCustomDeviceName`，用于设置和获取当前设备自定义设备名称。
- 新增 `ChatManager#getDBMsgsCount` 方法，用于获取数据库中的消息总数。
- 新增[两个错误码](error.html)：
  - `ChatError#GROUP_USER_IN_BLOCKLIST`（613）：该用户在群组黑名单中。群组黑名单中的用户进行某些操作时，例如，加入群组，会提示该错误。
  - `ChatError#CHATROOM_USER_IN_BLOCKLIST`（707）：该用户在聊天室黑名单中。聊天室黑名单中的用户进行某些操作时，例如，加入聊天室，会提示该错误。
- 聊天室成员禁言回调：
  - 新增聊天室禁言回调 [ChatroomListener#onMuteMapAdded](room_manage.html#监听聊天室事件)，参数 Map 的 key 表示被禁言的用户 ID ，value 表示禁言到期时间戳；
  - 废弃原来的回调 `ChatroomListener#onMutelistAdded`。
- 新增[拉取服务器漫游消息](message_retrieve.html#从服务器获取指定会话的消息)时会读取服务端的消息已读和送达状态。该功能只适用于单聊消息，默认关闭，如果需要，请联系环信商务开通。

### 优化

- 废弃 `ChatOptions` 传入字符串的构造函数，新增传入 [AppParam](initialization.html#初始化) 的构造方法。
- [发送前回调](/document/server-side/callback_presending.html)时修改的 [消息扩展字段](message_extension.html)，会同步到发送方。
- 调用[删除服务端会话 API](conversation_delete.html#单向删除服务端会话及其历史消息)，成功后会删除本地会话。之前版本调用该接口可设置删除会话的本地消息，不能删除本地会话。
- 群组和聊天室操作的默认错误码提示由 `GROUP_MEMBERS_FULL`（604）和 `CHATROOM_MEMBERS_FULL`（704）调整为 `GROUP_PERMISSION_DENIED`（603）和 `CHATROOM_PERMISSION_DENIED`（703）。例如，群组普通成员设置群组管理员时，由于缺乏权限，会提示 603 错误。
- 优化部分数据库操作。

### 修复

- 修复置顶的单聊消息被撤回后，该消息未能及时地从置顶消息缓存（`Conversation#getPinnedMessages`）中移除的问题。
- 修复调用 [PushManager#getSilentModeForConversations](/document/harmonyos/push/push_notification_mode_dnd.html#获取多个会话的推送通知设置) 方法获取会话的免打扰状态失败的问题。
- 修复极端情况下因网络异常导致的 Crash。
- 修复多次设置 `ChatMessage#setMessageStatusCallback` 时导致崩溃的问题。

## 版本 V1.4.2 Dev 2024-11-04（开发版）

### 优化

- 优化 [ChatManager#fetchHistoryMessages](message_retrieve.html#从服务器获取指定会话的消息) 中自动下载缩略图的逻辑。

### 修复

- 修复消息扩展属性中不支持其他平台整型、浮点型等数据类型的问题。

## 版本 V1.4.1 Dev 2024-10-28（开发版）

### 新增特性

- 基于 1.4.0 版本，在 DevEco Studio NEXT Release(5.0.3.900) 下重新编译。

### 优化

- 优化分片上传逻辑。

### 修复

- 修复 SDK 内部监听网络变化时偶现崩溃的问题。

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
- 新增[从服务器拉取离线消息的开始和结束的事件回调](connection.html#监听连接状态): `ConnectionListener#onOfflineMessageSyncStart` 和 `ConnectionListener#onOfflineMessageSyncFinish`。
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
- 新增 [发送](message_send.html#发送自定义类型消息) 和 [接收自定义消息](message_receive.html#接收自定义类型消息)功能。
- 新增 [发送](message_send.html#发送合并消息) 和 [接收合并转发消息](message_receive.html#接收合并消息) 功能。
- 支持 [HarmonyOS 推送](/document/harmonyos/push/push_overview.html)能力。

### 优化

- `ChatClient#init` 方法中新增 `Context` 参数。
- 修改 SDK 文件路径到应用级的应用文件路径下。

## 版本 V1.0.0 Dev 2024-06-7（开发版）

### 新增特性

环信即时通讯 HarmonyOS SDK 支持单聊、群组聊天和聊天室聊天场景，实现了以下特性：

- 支持消息特性：
  - [发送消息](message_send.html)；
  - [接收消息](message_receive.html)；
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



