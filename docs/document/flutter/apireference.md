# API 概览

声网即时通讯 IM 是一个高度可靠的全球通信平台，用户可以进行一对一单聊、群组聊天或聊天室聊天。用户可以通过发送文本消息、分享图片、音频、视频、文件、表情符号和位置进行沟通。

- **ChatClient 类**是聊天 SDK 的入口，提供登录和登出即时通讯 IM 的方法，并管理 SDK 与聊天服务器之间的连接。
- **ChatManager 类**提供发送和接收消息、管理会话（包括加载和删除会话）以及下载附件的方法。
- **ChatMessage 类**定义消息的属性。
- **Conversation 类**提供管理会话的方法。
- **ContactManager 类**提供管理聊天联系人（如添加、获取、修改和删除联系人）的方法。
- **GroupManager 类**提供群组管理的方法，如群组创建和解散以及成员管理。
- **ChatRoomManager 类**提供聊天室管理的方法，如加入和离开聊天室、获取聊天室列表，以及管理成员权限。
- **PresenceManager 类**提供管理用户在线状态订阅的方法。
- **ChatThreadManager 类**提供了管理子区的方法，包括创建、解散子区以及成员管理。
- **PushManager 类**提供了配置离线推送服务的方法。
- **UserInfoManager 类**提供了管理用户属性的方法，包括获取和更新用户属性。

## 连接与初始化

| 方法             | 描述           |
| :---------------------------------------------- | :------------------------------------------------ |
| common/androidinit              | 初始化 SDK。             |
| common/androidloginWithToken              | 使用用户 ID 和 token 登录聊天服务器。             |
| common/androidrenewToken          | 更新 token。              |
| common/androidlogout           | 退出登录账号。               |
| common/androidcurrentUserId         | 获取当前登录用户的用户 ID。              |
| common/androidisConnected          | 检查 SDK 是否已连接到聊天服务器。           |
| common/androidisLoginBefore          | 检查用户是否已登录聊天应用。             |
| common/androidaddConnectionEventHandler              | 添加监听。         |
| common/androidremoveConnectionEventHandler             | 移除监听。         |
| common/androidgroupManager           | 获取 `GroupManager` 类。               |
| common/androidpushManager              | 获取 `PushManager` 类。            |
| common/androidchatRoomManager             | 获取 `RoomManager` 类。         |
| common/androidchatManager      | 获取 `ChatManager` 类。           |
| common/androiduserInfoManager           | 获取 `UserInfoManager` 类。            |
| common/androidcontactManager      | 获取 `ContactManager` 类。            |
| common/androidpresenceManager  | 获取 `presenceManager` 类。            |
| common/androidchatThreadManager      | 获取 `ChatThreadManager` 类。         |

| 事件         | 描述            |
| :------------------------------------------------ | :------------------------------------------------ |
| common/androidonConnected            | 成功连接到 IM 服务器时触发的回调。             |
| common/androidonDisconnected             |  与 IM 服务器断开连接时触发的回调。           |
| common/androidonOfflineMessageSyncStart    | 开始从服务器拉取离线消息时触发。           |
| common/androidonOfflineMessageSyncFinish               | 从服务器拉取离线消息结束时触发。           |
| common/androidonTokenDidExpire      |  token 已过期时触发。       |
| common/androidonTokenWillExpire  | token 即将过期时触发。     |
| common/androidonUserAuthenticationFailed               | 鉴权失败回调。             |
| common/androidonUserDidChangePassword              | 用户密码变更回调。            |
| common/androidonUserDidLoginFromOtherDevice               | 其他设备登录回调。  |
| common/androidonUserDidLoginTooManyDevice               | 登录设备过多回调。  |
| common/androidonUserDidRemoveFromServer               | 当前用户被服务器移除回调。  |
| common/androidonUserKickedByOtherDevice               | 被其他设备踢掉回调。  |

## 发送消息

| 方法             | 描述             |
| :------------------------------------------------ | :------------------------------------------------ |
| common/androidsendMessage            | 发送消息。              |
| common/androidsendConversationReadAck      | 向服务器发送会话已读回执。           |
| common/androidsendMessageReadAck          | 向服务器发送会话已读回执。              |
| common/androidsendGroupMessageReadAck         | 向服务器发送群消息的已读回执。            |
| common/androidgetConversation           | 根据会话 ID 获取会话对象。              |
| common/androidimportMessages         | 将消息导入内存和本地数据库。              |
| common/androidupdateMessage          | 更新本地消息。             |
| common/androiddownloadAttachment   | 下载消息附件。             |
| common/androiddownloadThumbnail       | 下载消息缩略图。              |
| common/androidloadAllConversations           | 获取所有本地会话。            |
| common/androidfetchConversationsByOptions          | 从服务器获取会话列表。            |
| common/androiddeleteAllMessageAndConversation              | 从本地数据库中删除会话及其本地消息。     |
| common/androiddeleteRemoteConversation              | 从服务器删除指定会话及其历史消息。       |
| common/androidfetchGroupAcks       | 从服务器分页获取群消息的已读回执。              |
| common/androidsearchMsgsByOptions       | 从本地数据库中检索特定类型的消息。       |
| common/androiddeleteMessagesBefore       | 根据时间删除本地消息。            |
| common/androidreportMessage    | 举报不当消息。             |
| common/androidfetchSupportedLanguages         | 查询翻译服务支持的语言。             |
| common/androidtranslateMessage            | 翻译文本消息。             |
| common/androidaddReaction          | 添加 Reaction。              |
| common/androidremoveReaction            | 删除 Reaction。              |
| common/androidfetchReactionList       | 获取 Reaction 列表。             |
| common/androidfetchReactionDetail     | 获取 Reaction 详情。             |
| common/androidpinMessage              | 置顶消息。              |
| common/androidunpinMessage             | 取消置顶消息。              |
| common/androidmodifyMessage         | 修改消息。              |
| common/androidfetchHistoryMessagesByOption          | 从服务器拉取历史消息。              |
| common/androidaddEventHandler          | 添加监听器。              |
| common/androidremoveEventHandler          | 移除监听器。              |

| 事件           | 描述               |
| :-------------------------------------------------- | :-------------------------------------------------- |
| common/androidonMessagesReceived          | 当收到消息时触发。              |
| common/androidonCmdMessagesReceived      | 当收到透传消息时触发。              |
| common/androidonMessagesRead  | 当收到消息的已读回执时触发。            |
| common/androidonGroupMessageRead         | 当收到群消息的已读回执时触发。               |
| common/androidonReadAckForGroupMessageUpdated      | 当收到群消息已读状态更新时触发。             |
| common/androidonMessagesDelivered       | 当收到送达回执时触发。               |
| common/androidonMessagesRecalledInfo     | 当收到的消息被撤回时触发。               |
| common/androidonMessageReactionDidChange   | 当消息 Reaction 发生变化时触发。               |
| common/androidonConversationsUpdate       | 当会话列表更新时触发。               |
| common/androidonConversationRead     | 当收到会话已读回执时触发。               |
| common/androidonMessagePinChanged     | 当消息置顶状态发生变更时触发。               |
| common/androidonMessageContentChanged      | 当消息内容变更时触发。               |

## 消息与会话

| 方法              | 描述              |
| :-------------------------------------------------- | :-------------------------------------------------- |
| common/androidConversation.id | 获取会话 ID。              |
| common/androidConversation.unreadCount| 获取会话中的未读消息数量。              |
| common/androidConversation.markAllMessagesAsRead | 将所有未读消息标记为已读。              |
| common/androidConversation.getLocalMessageCount | 获取本地数据库中会话的所有消息数量。     |
| common/androidConversation.isChatThread | 检查当前会话是否为子区会话。              |
| common/androidConversation.loadMessages | 从本地数据库加载消息，从特定消息 ID 开始。              |
| common/androidConversation.markMessageAsRead | 将特定消息标记为已读。       |
| common/androidConversation.deleteMessage | 在本地数据库中删除特定消息。              |
| common/androidConversation.latestMessage | 获取会话中的最新消息。       |
| common/androidConversation.lastReceivedMessage| 获取会话中的最新接收消息。              |
| common/androidConversation.deleteAllMessages | 删除会话中的所有消息。       |
| common/androidConversation.setExt | 设置会话的扩展字段。             |
| common/androidConversation.ext | 获取会话的扩展字段。             |
| common/androidConversation.insertMessage | 在本地数据库中向会话插入消息。               |
| common/androidConversation.appendMessage | 在本地数据库中将消息插入到会话的末尾。              |
| common/androidConversation.updateMessage| 更新本地数据库中的消息。     |
| common/androidMessage.status | 消息发送或接收状态。         |
| common/androidMessage.chatType | 获取聊天消息类型。           |
| common/androidMessage.body | 消息正文。              |
| common/androidMessage.serverTime | 服务器接收消息时的 Unix 时间戳。               |
| common/androidMessage.localTime | 消息的本地时间戳。         |
| common/androidMessage.isChatThreadMessage | 消息是否为子区消息。         |
| common/androidMessage.chatThread | 获取子区的概述。         |
| common/androidMessage.from | 获取消息发送者的用户 ID。     |
| common/androidMessage.to | 消息接收者的用户 ID。         |
| common/androidMessage.msgId | 消息ID。              |
| common/androidMessage.attributes | 消息的扩展属性，类型为字典。               |
| common/androidMessage.hasRead | 消息是否已读。             |
| common/androidMessage.hasReadAck | 消息是否已成功送达。       |
| common/androidMessage.direction | 消息的收发方向。               |
| common/androidMessage.conversationId | 获取会话 ID。               |
| common/androidMessage.reactionList | 获取 Reaction 列表。             |
| common/androidMessage.onlineState| 是否在线消息。              |
| common/androidMessage.pinInfo | 消息的置顶操作信息。 |

## 联系人

| 方法              | 描述      |
| :------------------------------------------------- | :------------------------------------------------- |
| common/androidfetchAllContacts   | 从服务器获取所有联系人。              |
| common/androidaddUserToBlockList            | 将用户添加到黑名单。      |
| common/androidremoveUserFromBlockList         | 从黑名单中移除联系人。             |
| common/androidgetBlockIds        | 获取本地黑名单。      |
| common/androidfetchBlockIds | 从服务器获取黑名单。            |
| common/androidacceptInvitation    | 接受好友邀请。              |
| common/androiddeclineInvitation    | 拒绝好友邀请。              |
| common/androidgetAllContacts     | 从本地数据库获取联系人列表。            |
| common/androidgetSelfIdsOnOtherPlatform   | 获取登录用户在其他登录设备上唯一 ID |
| common/androidaddEventHandler        | 添加联系人变更监听。               |
| common/androidremoveEventHandler        | 删除联系人变更监听。               |

| 事件              | 描述              |
| :--------------------------------------------------- | :-------------------------------------------------- |
| common/androidonContactAdded              | 当用户被其他用户添加为联系人时触发。              |
| common/androidonContactDeleted              | 当用户被其他用户从联系人列表中移除时触发。    |
| common/androidonContactInvited      | 当用户收到好友请求时触发。        |
| common/androidonFriendRequestAccepted | 当好友请求被批准时触发。        |
| common/androidonFriendRequestDeclined | 当好友请求被拒绝时触发。        |

## 群组

| 方法            | 描述              |
| :-------------------------------------------------- | :-------------------------------------------------- |
| common/androidcreateGroup      | 创建群组。     |
| common/androiddestroyGroup          | 销毁群组。             |
| common/androidleaveGroup          | 离开群组。               |
| common/androidjoinPublicGroup       | 加入一个公共群组。         |
| common/androidaddMembers       | 将用户添加到群组中。      |
| common/androidremoveMembers      | 从群组中移除成员。               |
| common/androidfetchGroupInfoFromServer        | 从服务器获取群组信息。              |
| common/androidfetchJoinedGroupsFromServer        | 从服务器分页获取当前用户的所有群组。 |
| common/androidfetchPublicGroupsFromServer         | 从服务器分页获取公开群组。             |
| common/androidchangeGroupName         | 更改群组名称。       |
| common/androidchangeGroupDescription          | 更改群组描述。             |
| common/androidacceptInvitation          | 接受群组邀请。              |
| common/androiddeclineInvitation            | 拒绝群组邀请。             |
| common/androidacceptJoinApplication        | 批准群组请求。     |
| common/androiddeclineJoinApplication           | 拒绝群组请求。     |
| common/androidrequestToJoinPublicGroup          | 请求加入公共群组。     |
| common/androidblockGroup          | 阻止群组消息。        |
| common/androidunblockGroup           | 取消阻止群组消息。      |
| common/androidblockMembers         | 将用户添加到群组黑名单。             |
| common/androidunblockMembers         | 从群组黑名单中移除用户。             |
| common/androidfetchBlockListFromServer           | 获取群组黑名单（带分页）。              |
| common/androidfetchMemberListFromServer          | 获取群组成员列表（带分页）。            |
| common/androidchangeOwner            | 转移群组所有权。             |
| common/androidaddAdmin         | 添加群组管理员。           |
| common/androidremoveAdmin         | 移除群组管理员。        |
| common/androidmuteMembers          | 禁言群组成员。          |
| common/androidunMuteMembers          | 取消禁言群组成员。        |
| common/androidfetchMuteListFromServer          | 从服务器获取群组禁言列表。            |
| common/androidfetchBlockListFromServer           | 从服务器获取群组黑名单（带分页）。        |
| common/androidaddAllowList            | 将成员添加到白名单列表。               |
| common/androidremoveAllowList            | 从白名单列表中移除成员。    |
| common/androidfetchAllowListFromServer           | 从服务器获取群组白名单列表。               |
| common/androidupdateGroupAnnouncement            | 更新群组公告。               |
| common/androidfetchAnnouncementFromServer            | 从服务器获取群组公告。            |
| common/androiduploadGroupSharedFile           | 上传群组共享文件。              |
| common/androidfetchGroupFileListFromServer            | 从服务器获取共享文件列表。              |
| common/androidremoveGroupSharedFile           | 移除群组共享文件。              |
| common/androiddownloadGroupSharedFile           | 下载群组共享文件。              |
| common/androidgetJoinedGroups           | 获取当前用户的所有群组（从缓存中）。           |
| common/androidaddEventHandler            | 添加监听器。            |
| common/androidremoveEventHandler     | 移除监听器。            |

| 事件              | 描述              |
| :------------------------------------------------- | :------------------------------------------------- |
| common/androidonInvitationReceivedFromGroup           | 当用户收到群组邀请时触发。     |
| common/androidonRequestToJoinReceivedFromGroup       | 当群组所有者或管理员收到用户的加入请求时触发。 |
| common/androidonRequestToJoinAcceptedFromGroup           | 当群组请求被接受时触发。    |
| common/androidonRequestToJoinDeclinedFromGroup         | 当群组请求被拒绝时触发。    |
| common/androidonInvitationAcceptedFromGroup           | 当群组邀请被接受时触发。              |
| common/androidonInvitationDeclinedFromGroup           | 当群组邀请被拒绝时触发。 |
| common/androidonAutoAcceptInvitationFromGroup       | 当群组邀请自动接受时触发。         |
| common/androidonAdminRemovedFromGroup       | 当前用户被群组管理员移除时触发。         |
| common/androidonMuteListAddedFromGroup            | 当一个或多个群组成员被禁言时触发。            |
| common/androidonMuteListRemovedFromGroup             | 当一个或多个群组成员被取消禁言时触发。    |
| common/androidonAllowListAddedFromGroup          | 当一个或多个群组成员被添加到白名单列表时触发。             |
| common/androidonAllowListRemovedFromGroup          | 当一个或多个成员从白名单列表中移除时触发。               |
| common/androidonAllGroupMemberMuteStateChanged           | 当所有群组成员被禁言或取消禁言时触发。              |
| common/androidonAdminAddedFromGroup         | 当某个成员被设置为管理员时触发。    |
| common/androidonAdminRemovedFromGroup    | 当某个成员的管理员权限被移除时触发。             |
| common/androidonOwnerChangedFromGroup            | 当群组所有权被转移时触发。             |
| common/androidonMemberJoinedFromGroup     | 当某个成员加入群组时触发。         |
| common/androidonMemberExitedFromGroup     | 当某个成员主动离开群组时触发。    |
| common/androidonAnnouncementChangedFromGroup              | 当公告被更新时触发。    |
| common/androidonSharedFileAddedFromGroup              | 当共享文件被添加到群组时触发。              |
| common/androidonSharedFileDeletedFromGroup     | 当共享文件从群组中移除时触发。    |
| common/androidonSpecificationDidUpdate            | 当群组详细信息被更新时触发。             |
| common/androidonDisableChanged     | 当群组被启用或禁用时触发。               |

## 聊天室

| 方法              | 描述               |
| :------------------------------------------------------- | :------------------------------------------------------- |
| common/androidcreateChatRoom         | 创建聊天室。              |
| common/androiddestroyChatRoom         | 销毁聊天室。             |
| common/androidjoinChatRoom          | 加入聊天室。            |
| common/androidleaveChatRoom        | 退出聊天室。            |
| common/androidfetchPublicChatRoomsFromServer          | 从服务器获取聊天室数据，支持分页。             |
| common/androidfetchChatRoomInfoFromServer            | 从服务器获取聊天室的详细信息。     |
| common/androidchangeChatRoomName            | 修改聊天室名称。            |
| common/androidchangeChatRoomDescription          | 修改聊天室描述。    |
| common/androidfetchChatRoomMembers          | 获取聊天室成员列表。        |
| common/androidmuteChatRoomMembers            | 在聊天室中禁言成员。          |
| common/androidunMuteChatRoomMembers            | 在聊天室中取消禁言成员。        |
| common/androidaddChatRoomAdmin          | 添加聊天室管理员。           |
| common/androidremoveChatRoomAdmin           | 移除聊天室管理员的管理权限。              |
| common/androidfetchChatRoomMuteList           | 从服务器获取禁言聊天室成员列表。            |
| common/androidremoveChatRoomMembers           | 从聊天室中移除成员。      |
| common/androidblockChatRoomMembers             | 将成员添加到聊天室的黑名单中。              |
| common/androidunBlockChatRoomMembers             | 从聊天室的黑名单中移除成员。            |
| common/androidfetchChatRoomBlockList             | 获取聊天室黑名单，支持分页。              |
| common/androidaddMembersToChatRoomAllowList             | 将成员添加到聊天室的白名单中。              |
| common/androidremoveMembersFromChatRoomAllowList            | 从聊天室的白名单中移除成员。              |
| common/androidfetchChatRoomAllowListFromServer            | 从服务器获取聊天室的白名单。              |
| common/androidmuteAllChatRoomMembers           | 禁言所有成员。            |
| common/androidunMuteAllChatRoomMembers              | 取消禁言所有成员。              |
| common/androidupdateChatRoomAnnouncement             | 更新聊天室公告。    |
| common/androidfetchChatRoomAnnouncement             | 从服务器获取聊天室公告。              |
| common/androidaddAttributes           | 添加自定义聊天室属性。      |
| common/androidremoveAttributes             | 设置自定义聊天室属性。     |
| common/androidfetchChatRoomAttributes            | 根据属性键列表获取聊天室的自定义属性列表。 |
| common/androidaddEventHandler           | 添加监听器。            |
| common/androidremoveEventHandler           | 移除监听器。            |

| 事件               | 描述             |
| :------------------------------------------------- | :------------------------------------------------- |
| common/androidonRemovedFromChatRoom           | 当前用户被移出聊天室时触发。    |
| common/androidonMemberJoinedFromChatRoom               | 当其他成员加入聊天室时触发。             |
| common/androidonMemberExitedFromChatRoom          | 当其他成员退出聊天室时触发。             |
| common/androidonMuteListAddedFromChatRoom             | 当聊天室成员被添加到禁言列表时触发。      |
| common/androidonMuteListRemovedFromChatRoom              | 当聊天室成员从禁言列表中移除时触发。  |
| common/androidonAllowListAddedFromChatRoom            | 当聊天室成员被添加到白名单时触发。     |
| common/androidonAllowListRemovedFromChatRoom             | 当聊天室成员从白名单中移除时触发。 |
| common/androidonAllChatRoomMemberMuteStateChanged              | 当聊天室中的全员禁言状态变更时触发。          |
| common/androidonAdminAddedFromChatRoom               | 当聊天室成员被设置为管理员时触发。             |
| common/androidonAdminRemovedFromChatRoom               | 当聊天室成员从管理员列表中移除时触发。 |
| common/androidonOwnerChangedFromChatRoom               | 当聊天室的拥有者更改时触发。             |
| common/androidonAnnouncementChangedFromChatRoom              | 当聊天室公告更改时触发。            |
| common/androidonSpecificationChanged            | 当聊天室详情更改时触发。              |
| common/androidonAttributesUpdated                | 当自定义聊天室属性更新时触发。           |
| common/androidonAttributesRemoved               | 当自定义聊天室属性被移除时触发。           |

## 用户在线状态订阅

| 方法            | 描述            |
| :-------------------------------------------------------- | :--------------------------------------------------- |
| common/androidpublishPresence    | 发布自定义的在线状态。            |
| common/androidsubscribe    | 订阅用户的在线状态。       |
| common/androidunsubscribe | 取消订阅用户的在线状态。              |
| common/androidfetchSubscribedMembers   | 使用分页获取已订阅的用户的列表。 |
| common/androidfetchPresenceStatus           | 获取用户的当前在线状态。     |
| common/androidaddEventHandler        | 添加监听器。            |
| common/androidremoveEventHandler   | 移除监听器。            |

| 事件              | 描述    |
| :------------------------------------------------ | :------------------------------------------------ |
| common/androidonPresenceStatusChanged | 当订阅的用户的在线状态更新时触发。 |

## 子区

| 方法               | 描述             |
| :---------------------------------------------------------- | :------------------------------------------------------- |
| common/androidcreateChatThread         | 创建子区。             |
| common/androidjoinChatThread     | 加入子区。               |
| common/androiddestroyChatThread     | 销毁子区。              |
| common/androidleaveChatThread        | 离开子区。              |
| common/androidfetchChatThread         | 从服务器获取子区的详细信息。             |
| common/androidupdateChatThreadName           | 更改子区的名称。             |
| common/androidremoveMemberFromChatThread             | 从子区中移除成员。           |
| common/androidfetchChatThreadMembers           | 分页获取子区中的成员列表。            |
| common/androidfetchJoinedChatThreads         | 分页获取当前用户已加入的子区列表。        |
| common/androidfetchJoinedChatThreadsWithParentId       | 分页获取当前用户在指定组中已加入的子区列表。               |
| common/androidfetchChatThreadsWithParentId            | 分页获取指定组中的子区列表。             |
| common/androidfetchLatestMessageWithChatThreads           | 从服务器获取指定子区的最后一条回复。              |
| common/androidaddEventHandler           | 添加监听器。            |
| common/androidremoveEventHandler   | 移除监听器。            |

| 事件               | 描述               |
| :------------------------------------------------------ | :--------------------------------------------------------- |
| common/androidonChatThreadCreate    | 当子区被创建时触发。              |
| common/androidonChatThreadUpdate   | 当子区被更新时触发。              |
| common/androidonChatThreadDestroy  | 当子区被销毁时触发。            |
| common/androidonUserKickOutOfChatThread | 当当前用户被群主或群管理员从子区中移除时触发。 |

## 离线推送

| 方法              | 描述            |
| :---------------------------------------------------------- | :---------------------------------------------------- |
| common/androidfetchPushConfigsFromServer  | 从服务器获取推送配置。              |
| common/androidupdatePushNickname    | 更新当前用户的推送显示昵称。            |
| common/androidsetConversationSilentMode      | 修改会话的免打扰设置。              |
| common/androidremoveConversationSilentMode          | 清除会话的离线推送通知类型设置。 |
| common/androidfetchConversationSilentMode    | 获取会话的免打扰设置。     |
| common/androidsetSilentModeForAll   | 设置当前登录用户的免打扰设置。             |
| common/androidfetchSilentModeForAll   | 获取当前登录用户的免打扰设置。              |
| common/androidfetchSilentModeForConversations     | 批量获取指定会话的免打扰设置。            |
| common/androidbindDeviceToken         | 绑定 APNs Token。            |

## 用户属性

| 方法              | 描述      |
| :------------------------------------------------- | :------------------------------------------------- |
| common/androidfetchOwnInfo  | 获取当前用户的用户属性           |
| common/androidupdateUserInfo   | 修改当前用户的用户属性。              |
| common/androidfetchUserInfoById      | 根据用户 ID 获取用户属性。            |
