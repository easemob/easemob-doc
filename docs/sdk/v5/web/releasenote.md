# EasyIM Web/Mini Program SDK Release Notes

## v5.0.0 Dev

This version was released on 2026-8-15.

This section focuses on feature and behavior changes. For details about removed or renamed APIs and their replacements, see the [EasyIM Web/Mini Program SDK 5.0.0.0 Migration Guide](migration_guide.html).

#### New features

- **Unified SDK entry point**: Adds `ChatClient` as the unified entry point for SDK initialization, login and logout, the connection lifecycle, event dispatch, and Manager registration. Initialize the SDK through `ChatClient.init({ appKey, managers })`, or register feature modules as needed through `.use()` after initialization.
- **Modular Manager separation**: `ChatManager` manages messages and conversations, `ContactManager` manages friend relationships, `UserInfoManager` manages user attributes, `GroupManager` manages chat groups, `ChatRoomManager` manages chat rooms, `PresenceManager` manages presence, `ChatThreadManager` manages message threads, and `PushManager` manages push.
- **Typed message-creation APIs**: Create different message types through `createTextMessage`, `createImageMessage`, `createFileMessage`, `createVoiceMessage`, `createVideoMessage`, `createLocationMessage`, `createCmdMessage`, `createCustomMessage`, and `createCombineMessage`, and send all message types through `sendMessage`.
- **Unified message read receipts**: Send read receipts for one-to-one or group messages in batches through `sendMessageReadReceipts`. The sender receives receipts through `onMessageReadReceipts`. For group chats, query the list of members who have read a group message through `getGroupMessageReadUsers` and query read counts for group messages in batches through `getGroupMessageReadReceipts`.
- **Local conversation-list cache and automatic synchronization**: After login, configure automatic synchronization of conversations, friends, and joined chat groups through `enableSyncData`, and monitor synchronization through `onSyncDataStart` and `onSyncDataFinished`. `onConversationListUpdate` notifies the app of conversation-list changes.
- **Improved conversation management**: Supports pinning, tagging, and deleting conversations and clearing conversation unread counts. Use `clearConversationUnreadMessageCount` and `clearAllConversationUnreadMessageCount` to clear unread counts for a specified conversation or all conversations.
- **User-attribute subscription and automatic user-information management**: Subscribe to user-information changes through `subscribeUsersInfo`. After `enableUserInfoSync` is enabled, the SDK can automatically synchronize user-attribute and group-member-card update times while sending and receiving messages.
- **Message features**: Supports message recall, message editing, message pinning, quoted messages, Reactions, historical-message retrieval, server-side message search, message translation, combined-message parsing, and stream-message receiving.
- **Unified multi-scenario capabilities**: Supports chat group, chat room, message thread, presence, and push-notification capabilities and provides entity-style APIs for Group, ChatRoom, and ChatThread to facilitate consecutive operations on a single entity.
- **Cross-platform runtime adaptation layer**: Adapts basic capabilities such as requests, uploads, WebSocket, and local storage in Web, WeChat Mini Program, uni-app, React Native, Electron, and other environments.

#### Important changes

- **Initialization changes**: The SDK initialization entry point changes from `new SDK.connection({ appKey })` to `ChatClient.init({ appKey })`. Register required business modules through the `managers` parameter or `.use()`. Otherwise, the corresponding `client.xxxManager` is not attached.
- **Module responsibility separation**: APIs are no longer centralized on the `conn` instance. They are separated by business capability into Managers such as `client.chatManager`, `client.contactManager`, `client.groupManager`, and `client.chatRoomManager`.
- **Message-processing changes**: Message creation changes from `WebIM.message.create({ type, ... })` to calling `client.chatManager.createXxxMessage(...)` based on the message type. Send all messages through `client.chatManager.sendMessage(message, options?)`.
- **Unified conversation fields**: Conversation-identification fields change from `to` and `chatType` to `conversationId` and `conversationType`. Conversation-type values are standardized as `singleChat`, `groupChat`, and `chatRoom`.
- **Login changes**: Login parameters change to `{ userId, token }`. The SDK client no longer recommends or provides a username/password login flow. When a token is about to expire, your app should obtain a new token in `onTokenWillExpire` and call `client.renewToken(newToken)`.
- **Event-model changes**: All received messages are dispatched through `onMessage` and distinguished by `message.type`. Chat group, chat room, message thread, multi-device, and other events use separate event names.
- **Simplified asynchronous return values**: Most asynchronous APIs return business objects or lists directly. Your app no longer needs to read data from the legacy `AsyncResult<T>.data`.
- **Error-handling changes**: The global `onError` event is removed. Use `try...catch` to catch Promise rejections and handle exceptions using error types such as `ValidationError`, `ConnectionError`, `AuthenticationError`, `SDKError`, and `MessageSendError`.
- **Feature-scope changes**: User registration, some legacy device-management capabilities, legacy mini program lifecycle handling, the legacy plugin registration method, and multiple deprecated aliases are removed. An App Server should call server-side REST APIs for administrative operations without an equivalent client-side capability.
- **Chat room creation changes**: Chat rooms should generally be created through a server-side REST API. The Web SDK client primarily provides management capabilities for chat room lists, details, joining, leaving, members, announcements, and custom attributes.

#### Improvements and fixes

- **Improved TypeScript experience**: Type definitions are provided for public API parameters, return values, and event payloads. This helps find parameter errors at compile time and improves IDE completion and refactoring.
- **Improved modular integration**: Supports importing feature modules as needed from the main package or a Manager subpath. Unregistered Managers are not attached to the SDK instance, helping control the scope of project integration.
- **Improved event handling**: Message, chat group, chat room, message thread, presence, push, and multi-device events are separated by business semantics, reducing the need for apps to parse `operation` themselves.
- **Improved conversation-list handling**: The SDK maintains a local conversation-list cache. Sending and receiving messages, conversation synchronization, pinning, tagging, deletion, and clearing unread counts update the local cache and notify the app through `onConversationListUpdate`.
- **Improved data synchronization**: Supports automatically synchronizing conversations, friends, and joined chat groups after login and provides notifications when synchronization starts, completes, or fails.
- **Improved user-profile display flow**: After `enableUserInfoSync` is enabled, the SDK can automatically retrieve the latest user profile or group member card based on the profile-update time carried in a message and trigger the corresponding profile-update event.
- **Improved error-handling model**: The SDK provides structured error types for parameter validation, connections, authentication, server-side business errors, attachment uploads, message sending, and other exceptions, helping apps distinguish retry, prompt, and fallback strategies.
- **Improved cross-platform consistency**: A unified platform adaptation layer handles runtime differences among Web, mini program, uni-app, React Native, Electron, and other environments, reducing code branching across platforms.
- **Improved AI-assisted integration**: Provides Markdown documentation, TypeScript types, and API comments that IDEs, AI coding tools, and integration-assistance tools can read and use to generate code.

#### Notes

- Before using any Manager capability, register the corresponding Manager through `managers` during initialization or through `.use()` after initialization.
- Web SDK v5 uses token login. The app must obtain a user token through its own App Server and then call `client.login({ userId, token })` to log in.
- If `enableSyncData` is not passed, the SDK synchronizes the conversation list after login by default. To synchronize friends or chat groups, explicitly configure `enableSyncData` and register the corresponding Manager.
- If you use a privately deployed environment with fixed service addresses and enable friend, group, or other synchronization capabilities, also configure the synchronization service address in `serviceConfig.serverUrls`.
- Message delivery receipts support only one-to-one chats. Message read receipts support only one-to-one and group chats. Chat rooms do not support delivery or read receipts.
- Group-message read receipts must be enabled in the EasyIM Console and are subject to group-size, validity-period, and permission-configuration restrictions.
- `sendMessageReadReceipts` only marks the specified messages as read. It does not advance the conversation-level read position or directly clear the local conversation unread count. To clear the unread count, call the API for clearing conversation unread counts.
- When upgrading from the legacy Web SDK, pay particular attention to the initialization entry point, Manager registration, login parameters, message creation, event listeners, return-value access, and removed APIs.

## v4.24.1 Dev 2026-7-10 (Dev version)

#### New features

Supports [server-side message search](/value-added/search/message_search_web.html), which can filter messages by keyword combinations, conversation ID, message type, time range, and message content or extension attributes. To use this feature, contact the EasyIM business manager to enable it. For details, see [Feature activation](/product/console/purchase_value_added.html#消息搜索).

Message search does not support the `ext` extension field by default. To search this field, contact the EasyIM business manager.

## v4.23.0 Dev 2026-6-10 (Dev version)

####  New features

Supports [configuring a callback route identifier for a message so that it triggers pre-delivery and post-delivery callbacks through the specified route](message_send.html#set-callback-routing-when-sending-a-message). This feature is currently available only in China regions 1 and 2.

## v4.22.0 Dev 2026-6-5 (Dev version)

#### New features

Supports layered resource management for image messages and related processing improvements:
  - Adds a ["large image" resource type](message_send.html#send-image-messages) to distinguish the original image from the compressed image resource.
  - Improves [image-processing logic when the original image is not sent](message_send.html#send-image-messages).
  - Improves [thumbnail and attachment-path processing for image messages](message_receive.html#receive-image-messages).

## v4.21.0 Dev 2026-4-28 (Dev version)

#### New features

Adds [speech-to-text](/value-added/stt/voice_to_text_web.html).

#### Fixes

Fixes a compatibility error that occurred when importing the SDK for use with Vite 8.

## 4.19.1 Dev 2026-2-27 (Dev version)

#### New features

Supports [receiving stream messages sent by the server](message_stream_receive.html).

Currently, stream messages can be delivered only through the [server-side RESTful API](/document/server-side/message_stream_send_single.html). The SDK receives but cannot send them.

#### Fixes

Fixes upload failures when sending attachment messages such as files and images.

## 4.19.0 Dev 2026-2-4 (Dev version)

Fixes a runtime error in React Native environments.

## 4.17.1 2025-12-12

#### Improvements

- Improves the format and content of log output.

#### Fixes

- Fixes SDK type-definition issues.

## v4.17.0 2025-9-30

#### New features

1. Supports retrieving empty conversations when [retrieving the server-side conversation list](conversation_list.html#retrieve-the-conversation-list-from-the-server).
2. Supports retrieving empty conversations when [retrieving the list of pinned conversations from the server](conversation_pin.html#retrieve-pinned-conversations).

## v4.15.1 2025-6-9

#### New features

1. Supports [querying the number of chat groups joined by the current user](group_manage.html#query-the-number-of-groups-joined-by-the-current-user).
2. Supports [blocking group messages](group_manage.html#屏蔽群消息), [unblocking group messages](group_manage.html#解除屏蔽群消息), and [checking whether the current user has blocked group messages](group_manage.html#check-whether-the-current-user-blocks-group-messages).

#### Fixes

Fixes an error when recalling a message.

## v4.15.0 2025-5-21

#### New features

- When retrieving a [chat group](group_manage.html#获取群成员列表) or [chat room member list](room_members.html#retrieve-the-chat-room-member-list), supports listing each member's user ID and role.
- When [recalling a message](message_recall.html), allows a group owner or admin to recall messages sent by other users in the chat group.
- Group member join and leave events can notify multiple members joining or leaving a group at once. Previously, the SDK invoked a separate event callback for each member who joined or left.
  - Adds the group-member join and leave events [membersPresence](group_manage.html#monitor-chat-group-events) and [membersAbsence](group_manage.html#monitor-chat-group-events). The original `memberPresence` and `membersAbsence` events remain valid. 
   
#### Improvements

- Changes when the [token-will-expire event `onTokenWillExpire`](connection.html#monitor-connection-changes) is triggered. The SDK invokes the token-will-expire notification when 80% of the token validity period has elapsed, compared with 50% in earlier versions.
- [EasyIM Demo] You do not need to deploy an App Server to run the EasyIM Demo. For details, see [Run the Demo source code](demo_react.html#run-the-demo-source-code).
- Deprecates the original `listGroupMembers` method for retrieving the group member list. Use [getGroupMembers](group_manage.html#获取群成员列表) instead.
- Deprecates the original `listChatRoomMembers` method for retrieving the chat room member list. Use [getChatRoomMembers](room_members.html#retrieve-the-chat-room-member-list) instead.

## v4.14.0 2025-4-21

#### New features

- Supports [sending](message_send.html#send-gif-images) and [receiving GIF image messages](message_receive.html#receive-gif-image-messages).
- Supports [chat group avatars](group_attributes.html#manage-the-chat-group-avatar).
- Supports [message attachment authentication](message_receive.html#接收附件消息). Contact the EasyIM business manager to enable this feature. After it is enabled, you must call an SDK API to download message attachments.
- Supports [custom device platforms](multi_device.html#set-the-login-device-platform).

#### Improvements

- Deprecates the original `createGroup` method for creating chat groups. Use [createGroupVNext](group_manage.html#create-a-chat-group) instead.

## v4.13.0 2025-3-12

#### New features

- [EasyIM SDK] The post-send message-editing API [modifyMessage](message_modify.html) supports editing all message types:
  - Text messages: Supports editing the `msg` and `ext` fields.
  - Custom messages: Supports editing the `customEvent`, `customExts`, and `ext` fields.
  - Image/voice/video/file/location/combined messages: Supports editing only the `ext` field.
  - Command messages: Editing is not supported.
  
- [EasyIM Demo] Adds an anti-fraud reminder UI.

#### Improvements

[EasyIM SDK] The SDK internally catches errors caused by failed DNS retries.

## v4.12.0 2025-1-10

#### New features

- Adds the message `ext` field to the message-editing event `onModifiedMessage`. After this field is added, the recipient receives the extension information edited by the sender when the message is edited.
-  Adds an `info` field to the successful callback of `joinChatRoom`. It contains the following information, which the user receives after joining a chat room:
   - Chat room creation time: `createTimestamp`.
   - Whether all members are muted: `isAllMembersMuted`.
   - Whether the user is on the allowlist: `isInAllowlist`.
   - Current chat room member count: `memberCount`.
   - User mute expiration time: `muteExpireTimestamp`. 

#### Fixes

- [EasyIM SDK] Fixes an occasional failure to retrieve messages.

## v4.11.0 2024-12-3

#### New features

- [EasyIM SDK] Adds reading of server-side message read and delivery states when [retrieving roaming messages from the server](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server-with-pagination). This feature applies only to one-to-one messages and is disabled by default. To use it, contact the EasyIM business manager.
- [EasyIM SDK] Adds the `muteTimestamp` parameter to the chat room mute callback `muteMember`. This parameter indicates when the mute expires.
- [EasyIM SDK] Adds the `userId` field to the group/chat room mute event `muteMember`. This field identifies the muted member.

#### Improvements

[EasyIM SDK] Adds the `parseDownloadResponse` and `download` methods to the SDK message object. Both the SDK utils object and message object now contain the `parseDownloadResponse` and `download` methods.

#### Fixes

[EasyIM SDK] Fixes an incorrect `conversationId` parameter value in the message-pinning event `onMessagePinEvent`.

## v4.10.0 2024-10-11 (Dev version)

#### New features

- Adds announcement content to chat room announcement-update events: Adds the `announcement` field to the `updateAnnouncement` event to represent the updated announcement.
- Adds two [error codes](error.html):
  - `WEBIM_USER_ALREADY_LOGIN` 208: The user is already logged in. During single-device login, this error is reported if the user is already logged in when the `open` method is called.
  - `MESSAGE_SEND_TIMEOUT` 512: Message sending timed out. For example, this error is reported if the connection is disconnected while sending a message.
   
#### Improvements

Adjusts the timing of `open().then` in the login method and the connection-success event `onConnected`. After this improvement, calling the open login method first triggers the `onConnected` or `onDisconnected` event to indicate whether the connection succeeded, and then triggers `open().then` or `open().catch`. This ensures the connection is fully established before subsequent processing. In previous versions, calling the login method first triggered the login callback and then the connection event, so a message could not be sent until `onConnected` was triggered. After this improvement, authentication failures and other login errors are also thrown in `open.catch`.

## v4.9.2 2024-09-20 (Dev version)

#### New features

- [EasyIM SDK] The `removeHistoryMessages` method supports [one-way deletion of server-side chat room messages](message_delete.html#delete-server-side-historical-messages-for-the-current-user).

## v4.9.1 Dev 2024-09-06 (Dev version)

#### Fixes
  
- [EasyIM SDK] Fixes some type issues.

## v4.9.0 2024-08-30 (Dev version)

#### New features

- [EasyIM SDK] Adds the `getSilentModeRemindTypeConversations` method to retrieve all conversations with a configured push notification mode by page.
- [EasyIM SDK] Adds the event callbacks `onOfflineMessageSyncStart` and `onOfflineMessageSyncFinish` for [the start and end of retrieving offline messages from the server](connection.html#monitor-connection-changes).
- [EasyIM SDK] The original message-pinning APIs `pinMessage` and `unpinMessage` [add support for pinned messages in one-to-one conversations](message_pin.html). The APIs remain unchanged.
- [EasyIM SDK] Adds the following two offline-push-related multi-device notification events to `onMultiDeviceEvent`: 
  - `setSilentModeForConversation`: If you call the `setSilentModeForConversation` API to [set the push notification mode or Do Not Disturb period for a specified conversation](/document/web/push/push_notification_mode_dnd.html#set-push-receiving-rules-for-a-specified-conversation), other devices receive this event.
  - `removeSilentModeForConversation`: If you call the `clearRemindTypeForConversation` API to [clear the push notification mode for a specified conversation](/document/web/push/push_notification_mode_dnd.html#clear-the-push-notification-mode-for-a-specified-conversation), other devices receive this event.
- [EasyIM SDK] The SDK `message` object adds the `getFileUrl` method. Both the SDK `utils` object and `message` object now contain the `getFileUrl` method. 

#### Improvements

- [EasyIM SDK] Improves EasyIM reconnection logic.
- [EasyIM SDK] Adds a callback for DNS request failures.

#### Fixes

- [EasyIM SDK] Fixes some type issues.
- [EasyIM SDK] Adds the `reason` field for the request reason to the group-join event `requestToJoin` received by the chat group and group admins. 

## v4.8.1 Dev 2024-07-17

#### New features

- [EasyIM SDK] Adds [log reporting](log.html#log-reporting), which uploads logs to the EasyIM server. This feature is disabled by default. To use it, contact the EasyIM business manager.

## v4.8.0 Dev 2024-07-01

#### New features

- [EasyIM SDK] Adds a disconnection-reason callback parameter to the [`onDisconnected` event](connection.html) to tell the user what triggered `onDisconnected`.
- [EasyIM SDK] Adds support for [carrying a custom message when a device logs in and passing it to the device that is kicked offline](multi_device.html#set-login-device-extension-information): 
  - `setLoginInfoCustomExt`: Sets login device extension information.
  - `onDisconnected`: In a multi-device login scenario, if the current device is kicked offline by a newly logged-in device, the event received by the kicked device carries the new device's extension information.
- [EasyIM SDK] Supports [carrying extension information when joining a chat room and specifying whether to leave all previously joined chat rooms](room_manage.html#join-a-chat-room):
  - Adds the `ext` and `leaveOtherRooms` parameters to `joinChatRoom`, which carry extension information when joining a chat room and specify whether to leave all other chat rooms.
  - Adds the `ext` extension field to `ChatroomEvent`. When a user carries extension information while joining a chat room, other users in the chat room can obtain it from the user-join callback.
- [EasyIM SDK] Adds the `ConnectionParameters#isFixedDeviceId` initialization parameter, which defaults to `true`, to [use a fixed device ID](multi_device.html). Previously, the SDK used a different random string as the device identifier whenever an SDK instance connected.
- [EasyIM SDK] The `destroyChatRoom` method allows a chat room owner to [destroy a chat room](room_manage.html#destroy-a-chat-room).

#### Fixes

- [EasyIM SDK] Fixes an issue where the SDK could not automatically reconnect on the uniapp Vue3 platform.
- [EasyIM SDK] Changes the [database-operation failure error code](error.html) `LOCAL_DB_OPERATION_FAILED` from `55` to `800`.

## v4.7.0 Dev 2024-04-30

#### New features

- [EasyIM SDK] Adds the `getJoinedChatRooms` method to [retrieve the list of chat rooms joined by the current user](room_manage.html#retrieve-the-chat-room-list).
- [EasyIM SDK] Adds the `ext` parameter to the [recall message](message_recall.html#recall-a-message) API `recallMessage`, allowing a custom string to be passed as extension information.
- [EasyIM SDK] Adds the `setConsoleLogVisibility` method to the SDK logger to [set whether logs are printed to the console](log.html#输出信息到日志文件).

#### Fixes

- [EasyIM SDK] Fixes an incorrect message `allowGroupAck` state.

## v4.6.0 Dev 2024-04-02

#### New features

- [EasyIM SDK] Adds [message pinning](message_pin.html).
  - `pinMessage`: Pins a message.
  - `unpinMessage`: Unpins a message.
  - `getServerPinnedMessages`: Retrieves pinned messages for a specified conversation from the server.
  - `onMessagePinEvent`: When a user pins or unpins a message in a group or chat room conversation, other members of the group or chat room receive this callback.
- [EasyIM SDK] The message-editing callback `onModifiedMessage` supports returning [custom messages edited through a RESTful API](/document/server-side/message_modify.html).
- [EasyIM SDK] Supports [retrieving roaming messages from a chat room](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server-with-pagination).

#### Improvements

- [EasyIM SDK] Improves error messages for token login by providing more specific information.

#### Fixes

- [EasyIM SDK] Fixes an incorrect message `onlineState` state.

## v4.5.1 Dev 2024-02-22

#### Improvements

- [EasyIM SDK] Standardizes URL formats for message attachments.

## v4.5.0 Dev 2024-01-30

#### New features

- [EasyIM SDK] [Adds the `memberCount` field for the member count to chat room and chat group member join and leave events](room_manage.html#update-the-chat-room-member-count-in-real-time).
- [EasyIM SDK] Adds the [deleteAllMessagesAndConversations](message_delete.html#clear-chat-history-for-the-current-user) method to clear the current user's chat history, including messages and conversations.
- [EasyIM SDK] Adds the [getSelfIdsOnOtherPlatform](multi_device.html#retrieve-the-list-of-login-ids-for-the-current-user-on-other-devices) method to retrieve the list of login IDs for the current user on other logged-in devices and send messages to a specified device.
- [EasyIM SDK] Adds the [useReplacedMessageContents](message_send.html#content-moderation-before-sending-messages) switch. When enabled, the sender can obtain content replaced by content moderation while sending a message.

#### Improvements

- [EasyIM SDK] Removes unnecessary unique fields from the Web local database.
- [EasyIM SDK] Formats the `customExts` field of the latest custom message in the conversation list.
- [EasyIM SDK] Improves the issue of repeatedly retrieving messages.

#### Fixes

- [EasyIM SDK] Fixes incorrect message order in the `onMessage` callback.
- [EasyIM SDK] Fixes an error when importing the MiniCore plugin in Vite Electron.
- [EasyIM SDK] Fixes incorrect request parameters for the `updateOwnUserInfo` API after the WeChat SDK is imported in H5.

## v4.4.0 Dev 2023-12-22

#### New features

- [EasyIM SDK] Adds [conversation tags](conversation_mark.html).
  - `addConversationMark`: [Adds a tag to conversations](conversation_mark.html#add-conversation-tags).
  - `removeConversationMark`: [Removes a tag from conversations](conversation_mark.html#remove-conversation-tags).
  - `getServerConversationsByFilter`: [Retrieves the conversation list from the server by page and conversation tag](conversation_mark.html#filter-the-conversation-list-by-tag).
  - `onMultiDeviceEvent#markConversation/unMarkConversation`: [Conversation-tag events in multi-device scenarios](multi_device.html#listen-for-multi-device-events). When the current user updates conversation tags on one logged-in device, including adding and removing tags, other logged-in devices receive this event.
- [EasyIM SDK] Adds the `onMessage` callback. When text, image, video, voice, location, file, and other messages are received, they are returned to the app in batches through this callback.
- [EasyIM SDK] Adds a thumbnail of the first video frame to video messages, accessible through `videoMessage.thumb`.

#### Fixes

- [EasyIM SDK] Fixes SDK types.
- [EasyIM SDK] Fixes an error when importing the MiniCore SDK in Vite.
- [EasyIM SDK] Improves attachment uploads when sending attachment messages by supporting multipart upload.

## v4.3.1 Dev 2023-12-13

#### New features

- [EasyIM SDK] Adds the `message` field to the successful callback parameter `SendMsgResult` of the [message-sending method `Send`](message_send.html). This field returns the successfully sent message object.
- [EasyIM SDK] Adds a logger instance to the MiniCore SDK.

#### Improvements

- [EasyIM SDK] Improves slow SDK reconnection after network disconnection on some device models.

#### Fixes

- [EasyIM SDK] Fixes a 404 error when calling the `isInGroupMutelist` API.

## v4.3.0 Dev 2023-11-17

#### New features

- [EasyIM SDK] Adds [friend remarks](user_relationship.html#set-friend-remarks).
- [EasyIM SDK] Adds the `getAllContacts` and `getContactsWithCursor` methods to [retrieve the friend list from the server all at once or by page](user_relationship.html#retrieve-the-friend-list-and-friend-information). Each friend object contains the friend's user ID and friend remarks.
- [EasyIM SDK] Adds the `broadcast` field to the message structure to indicate whether a message is a chat room global broadcast message. You can [send a chat room global broadcast message through a REST API](/document/server-side/broadcast_to_chatrooms.html).

#### Improvements

- [EasyIM SDK] Adds token-will-expire and token-expired callbacks to token login. `onTokenExpired` and `onTokenWillExpire` are triggered when the token has expired or half of its validity period has elapsed, respectively.

#### Fixes

- [EasyIM SDK] Fixes an issue where `reaction` could not be obtained from the latest message in the conversation list.

## v4.2.1 Dev 2023-09-27

#### New features

- [EasyIM SDK] Adds the `LocalCache` module to [manage local conversation data](conversation_local.html).
- [EasyIM SDK] Adds the applicant's user ID to the `joinPublicGroupDeclined` callback triggered when a user's request to join a group is declined.

## v4.2.0 Dev 2023-07-27

#### New features

- [EasyIM SDK] Adds [sending](message_send.html#send-combined-messages) and [receiving combined forwarded messages](message_receive.html#receive-combined-messages).
- [EasyIM SDK] Adds [message editing](message_modify.html).

#### Fixes

Fixes the sending of unnecessary message delivery receipts.

## v4.1.7 Dev 2023-06-08

#### New features

1. Adds the `pinConversation` method to [pin and unpin conversations](conversation_pin.html#pin-or-unpin-a-conversation).
2. Adds the `getServerPinnedConversations` method to [retrieve the server-side pinned conversation list by page](conversation_pin.html#retrieve-pinned-conversations).
3. Adds the `getServerConversations` method to [retrieve the sorted server-side conversation list by page](conversation_list.html#retrieve-the-conversation-list-from-the-server). The original `getConversationlist` API is deprecated.
4. Adds [targeted messages in group or chat room conversations](message_target.html). To use this feature, add the `receiverList` parameter to the message-construction method `create`.
5. Adds the `isLast` field to the data returned by the server-side historical-message retrieval method `getHistoryMessages` to indicate whether the returned data is the last page.
6. Adds the [`thumbnailWidth` and `thumbnailHeight`](message_send.html#send-image-messages) parameters to the image-message construction method `create` to set thumbnail width and height.
7. Adds the following SDK login failure reasons for display in the console:
 - [Error code 50, MAX_LIMIT](error.html): Adds prompts for the app exceeding the number of daily active users (DAU), online users, or monthly active users (MAU).
 - [Error code 2, WEBIM_CONNCTION_AUTH_ERROR](error.html): Adds an invalid-token prompt.
8. Adds successful and failed callbacks (Promises) to the following [friend-management methods](user_relationship.html):
 - addContact: Adds a friend.
 - deleteContact: Deletes a friend.
 - acceptContactInvite: Accepts a friend invitation.
 - declineContactInvite: Declines a friend invitation.
 - addUsersToBlocklist: Adds friends to the blocklist.
 - removeUserFromBlocklist: Removes friends from the blocklist.

## v4.1.6 Dev 2023-04-17

#### New features

- [EasyIM SDK] Adds the `searchOptions` parameter object, which contains `from`, `msgTypes`, `startTime`, and `endTime`. This object allows users to call `getHistoryMessages` to [retrieve historical messages from the server by sender, message type, or time range](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server-with-pagination).
- [EasyIM SDK] Adds error code 511, MESSAGE_SIZE_LIMIT, which prompts the user when the [message body size exceeds the limit](message_overview.html#message-types).

## v4.1.4 Dev 2023-03-16

#### New features

- [EasyIM SDK] Adds [custom group member attributes](group_members.html#manage-custom-group-member-attributes) and a [custom-attribute update event](group_manage.html#monitor-chat-group-events), allowing group members to set and retrieve attributes such as their nickname and avatar in a chat group.
- [EasyIM SDK] Adds the `deliverOnlineOnly` field to message-creation parameters so that messages are delivered only to online users. If this feature is enabled, messages are not delivered when the user is offline.
- [EasyIM Demo] Adds group-member nickname editing and display. 

#### Improvements

[EasyIM SDK] Improves chat room join and leave implementation for better performance.

#### Fixes

- [EasyIM SDK] Fixes some type errors in TypeScript code.
- [EasyIM SDK] Fixes an issue where errors from the `getHistoryMessages` method could not be caught.

## v4.1.3 Dev 2023-02-21

#### New features

- [EasyIM SDK] Adds the pagination parameters `pageNum` and `pageSize` to the `getConversationlist` method to support [retrieving the conversation list by page](conversation_list.html#retrieve-the-conversation-list-from-the-server).
- [EasyIM SDK] Adds the [chat group creation event `create`](group_manage.html#monitor-chat-group-events). After a chat group is created, the group owner's other devices receive this event.

#### Improvements

- [EasyIM SDK] Reduces the size of MiniCore.
- [EasyIM SDK] Improves reconnection logic.

#### Fixes

- [EasyIM SDK] Fixes some type errors in TypeScript code.
- [EasyIM SDK] Fixes the missing `customExts` field in the return value of the `getConversationlist` method.
- [EasyIM SDK] Fixes an issue where the `size` field in an image message did not take effect when `useOwnUploadFun` allowed the user to upload the image.

## v4.1.2 Dev 2022-11-08

#### New features

- [EasyIM SDK] Adds the `ext` field to the [chat group creation method `createGroup`](group_manage.html#create-a-chat-group) and [group-information modification method `modifyGroup`](group_attributes.html#update-chat-group-information) to support group extension information.
- [EasyIM SDK] Adds the [group-information update event `updateInfo`](group_manage.html#monitor-chat-group-events) to chat group notification events.
- [EasyIM SDK] Adds [chat room message priority](message_send.html#chat-room-message-priority-and-message-dropping).
- [EasyIM SDK] Supports [muting and unmuting multiple group members at the same time](group_members.html#manage-chat-group-muting).

#### Improvements

[EasyIM SDK] Improves the callback invoked when a network disconnection causes message sending to fail.

#### Fixes

[EasyIM SDK] Fixes an issue where the `file_length` parameter did not take effect when calling `create` to create an attachment message.

## v4.1.1 Dev 2022-9-26

#### Improvements

- [EasyIM SDK] [miniCore](import_sdk_minicore.html) supports private deployment configuration.
- Improves reconnection logic.

#### Fixes

- [EasyIM SDK] Fixes issues with custom chat room attributes;
- [EasyIM SDK] Fixes issues with the `uploadFile` method in `miniCore`.

## v4.1.0 Dev 2022-9-16

#### New features

- [EasyIM SDK] Adds [custom chat room attributes](room_attributes.html).
- [EasyIM SDK] Adds the `onLog` method to implement user log callbacks.
- [EasyIM SDK] Adds the `needAffiliations` and `needRole` parameters to `getJoinedGroups` to support retrieving the group member count and the current user's role.

#### Improvements

- [EasyIM SDK] Splits the SDK into modules.
- [EasyIM SDK] Removes deprecated methods (`subscribe`, `subscribed`, `unsubscribed`, `removeRoster`, `getRoster`, `callback: onRoster`, `onMutedMessage`, `onCreateGroup`, and `onBlacklistUpdate`).

#### Fixes

- [EasyIM SDK] Fixes an issue where no callback was triggered after a file upload failed.
- [EasyIM SDK] Fixes compatibility issues in Internet Explorer.
- [EasyIM SDK] Fixes errors related to the `addEventListener` method reported when EasyIM Uniapp runs on a mobile phone.

## v4.0.9 2022-7-29

#### New features

- [EasyIM SDK] Adds a disaster-recovery policy.
- [EasyIM SDK] Internally adds `resourceId` to some chat group and chat room API requests to add multi-device operation notifications.

#### Improvements

- [EasyIM SDK] Optimizes the protocol to reduce data volume.
- [EasyIM SDK] Fixes message delays in some cases.

## v4.0.8 2022-6-17

#### New features

- [EasyIM SDK] Adds the chat group event callback [onGroupEvent](https://doc.easemob.com/jsdoc/interfaces/Types.EventHandlerType.EventHandlerType.html#onGroupEvent) and chat room event callback [onChatroomEvent](https://doc.easemob.com/jsdoc/interfaces/Types.EventHandlerType.EventHandlerType.html#onChatroomEvent). The original callbacks remain available;
- [EasyIM SDK] Adds the group-message rate-limit error code [MESSAGE_CURRENT_LIMITING](error.html)
- [EasyIM SDK] Adds the group-name parameter value to the return value of the group-chat invitation callback onGroupChange.

#### Improvements

- [EasyIM SDK] Supports querying chat group details in batches through [getGroupInfo](group_manage.html#获取群组详情信息).
- [EasyIM SDK] Improves method names related to blocklists and allowlists.
  - Changes `Whitelist` to `Allowlist` in allowlist-related method names, such as changing `getGroupWhitelist` to `getGroupAllowlist`;
  - Changes `Blacklist` to `Blocklist` in blocklist-related method names, such as changing `getGroupBlacklist` to `getGroupBlocklist`.

## v4.0.7 2022-5-25

#### New features:

- [EasyIM SDK] Adds message threads;
- [EasyIM SDK] Adds the [getConversationlist](conversation_list.html#retrieve-the-conversation-list-from-the-server) method to parse the latest message in a conversation;

#### Improvements:

- [EasyIM SDK] Adds the onlineState field to message event listeners to indicate the message's online state.

## v4.0.5 2022-5-16

#### New features:

- [EasyIM SDK] Adds [message Reactions](reaction.html), allowing different responses to messages;
- [EasyIM SDK] Adds a [reporting API](moderation.html) for content moderation;
- [EasyIM SDK] Adds push-setting APIs that support different push configurations;
- [EasyIM SDK] Adds data reporting;

#### Improvements:

- [EasyIM SDK] Updates the API for retrieving joined chat groups to support pagination;
- [EasyIM SDK] Supports setting the group size when creating a chat group;
- [EasyIM SDK] Adds thumbnail URLs to received image messages;

#### Fixes:

- [EasyIM SDK] Fixes cached group messages after switching accounts.

## v4.0.4 2022-4-19

:::tip
Only V4.0.4 and earlier versions support private deployment.
:::

#### New features:

- [EasyIM SDK] Adds [presence](presence.html) subscriptions.
- [EasyIM SDK] [Translation](/value-added/translation/message_translation_web.html): Adds an automatic translation API that supports on-demand translation and automatic translation when sending messages.

#### Improvements:

- [EasyIM SDK] Mini programs do not require the isHttpDNS parameter.

#### Fixes:

- [EasyIM SDK] Fixes an issue where Uni_SDK could not run in a browser.
- [EasyIM SDK] Fixes an issue where the group description could not be modified when creating a group.
- [EasyIM SDK] Fixes SSR compatibility.

## v4.0.3 2022-1-19

- [EasyIM SDK] Fixes the missing 'downloadGroupSharedFile' method.
- [EasyIM SDK] 'fetchGroupSharedFileList' supports pagination.

## v4.0.2 2022-1-14

- [EasyIM SDK] Adds the one-way conversation-deletion API deleteSession.
- [EasyIM SDK] Adds the “buildingName” field to location messages.
- [EasyIM SDK] Adds error type 221 for failure to send a message to a non-friend.
- [EasyIM SDK] Adds error type 219 for failure to send a message due to global mute.
- [EasyIM SDK] Fixes an issue where the “onChannelMessage” event was not invoked.
- [EasyIM SDK] Fixes other known issues.

## v4.0.1 2021-12-10

- [EasyIM SDK] Fixes type errors.
- [EasyIM SDK] Fixes delivery acknowledgments not being received.
- [EasyIM SDK] Fixes an issue where a group announcement could not be set to empty.
- [EasyIM SDK] Fixes an error when a user is muted in a chat.
- [EasyIM SDK] Updates some function names and comments.
- [EasyIM SDK] Adds some error codes.

## v4.0.0 2021-10-22

- [EasyIM SDK] Supports TypeScript;
- [EasyIM SDK] Supports Promises for message sending and friend operations;
- [EasyIM SDK] Adds eventHandler as a new event-listening method;
- [EasyIM SDK] Adds new message-construction APIs;
- [EasyIM SDK] Improves some APIs by removing unnecessary parameters and adding error prompts;
- [EasyIM SDK] Fixes some known issues.

## v3.6.3 2021-07-30

- [EasyIM SDK] Adds secret validation for file downloads;
- [EasyIM SDK] Adds an error type for messages blocked by a custom rule;
- [EasyIM SDK] Adds the onFileUploadProgress upload-progress callback for attachment messages;
- [EasyIM SDK] Improves the roaming-message API by adding the start parameter to specify where to begin retrieving messages;
- [EasyIM SDK] Improves reconnection logic;
- [EasyIM SDK] Fixes an error when sending a message while an attachment is being uploaded;
- [EasyIM SDK] Fixes an error when using user attributes in React Native;
- [EasyIM SDK] Fixes an error when used in Electron.

## v3.6.0 2021-06-30

- [EasyIM SDK] Updates dnsconfig;
- [EasyIM SDK] Uses a dynamic port when DNS is enabled;
- [EasyIM SDK] Improves log output.

## v3.5.1 2021-04-14

- [EasyIM SDK] Adds [user attributes](userprofile.html);
- [EasyIM SDK] Adds an API for changing the push nickname;
- [EasyIM SDK] Adds the message request-information parameter to the joinGroup method for requesting to join a group;
- [EasyIM SDK] Fixes cached messages not being cleared after leaving a chat room;
- [demo] Adds user profiles;
- [demo] Adds contact-card messages.

## v3.5.0 2021-03-01

- [EasyIM SDK] Removes the apiUrl parameter from the login API;
- [EasyIM SDK] Disables log collection by default;
- [EasyIM SDK] Fixes an error when sending a message before login;
- [EasyIM SDK] Fixes message congestion in large chat rooms;
- [EasyIM SDK] Fixes repeated errors when dnsConfig is enabled;
- [demo] Uses the Agora audio and video SDK to implement audio and video calls in the Demo.

## v3.4.2 2021-01-09

- [EasyIM SDK] Adds conversation-list retrieval;
- [EasyIM SDK] Adds channel acknowledgment messages;
- [EasyIM SDK] Fixes IE10 compatibility;
- [EasyIM SDK] Fixes a login error when H5 is generated by uniapp;
- [EasyIM SDK] Fixes some known issues;

## v3.4.1 2020-12-24

- [Multi-party audio and video] Uses DNS config by default
- [Multi-party audio and video] Fixes a missing hang-up reason for one-to-one calls
- [Multi-party audio and video] Fixes incorrect desktop-sharing display in Electron
- [Multi-party audio and video] Fixes an incorrect notification that another user left when leaving a meeting
- [Multi-party audio and video] Fixes frozen video after switching to 4G in WeChat on an Android phone
- [Multi-party audio and video] Fixes an occasional failure to display a shared desktop
- [Multi-party audio and video] Supports clicking **Stop Sharing** during desktop sharing
- [Multi-party audio and video] Fixes an issue where switching cameras on a mobile phone did not take effect
- [Multi-party audio and video] Fixes an issue where the deviceId of the selected device did not take effect when publishing a stream on the Web client

## v3.4.0 2020-12-10

- [EasyIM SDK] Adds an API for uploading a push token on mobile clients
- [EasyIM SDK] Adds the from and to fields to recalled-message and read-message events
- [EasyIM SDK] Adds the type field to CMD and custom messages
- [EasyIM SDK] Fixes compatibility issues in IE

## v3.3.2 2020-10-19

- [EasyIM SDK] Adds support for setting a fixed deviceId
- [EasyIM SDK] Removes the apiUrl parameter from the getGroup method
- [EasyIM SDK] Fixes an issue with retrieving historical messages
- [EasyIM SDK] Fixes compatibility with APIs earlier than 3.3.0 when sending attachment messages

## v3.3.0 2020-09-16

- [EasyIM SDK] Adds Promise support
- [EasyIM SDK] Adds the friend-related callbacks onContactInvited, onContactDeleted, onContactAdded, onContactRefuse, and onContactAgreed
- [EasyIM SDK] Adds the friend-operation APIs addContact, deleteContact, acceptInvitation, and declineInvitation to replace the original subscribe, removeRoster, subscribed, and unsubscribed APIs
- [EasyIM SDK] Changes the default resource to distinguish users on the Web and mini program clients
- [EasyIM SDK] Removes the apiUrl parameter from the getChatRooms API for retrieving chat rooms
- [EasyIM SDK] Removes the msg parameter from the API for constructing cmd messages
- [EasyIM SDK] Improves message-construction APIs by using chatType to distinguish message types (one-to-one chat/group chat/chat room)
- [EasyIM SDK] Fixes an issue where the success callback was not invoked after a location message was sent successfully
- [EasyIM SDK] Adds fault-tolerance handling

## v3.2.2 2020-08-25

- [EasyIM SDK] Adds a parameter specifying whether invitees must accept when creating a chat group
- [EasyIM SDK] Fixes message delays in the Toutiao Mini Program
- [EasyIM SDK] Adds an error message to the onError callback
- [EasyIM SDK] Changes attachment-message redirection
- [EasyIM SDK] Supports server-side rendering with vue-ssr-renderer
- [Multi-party audio and video] Supports quality-monitoring reporting during meetings
- [Multi-party audio and video] Supports monitoring weak-network and disconnected-network states for video during meetings
- [Multi-party audio and video] Supports specifying an RTCConfig URL for multi-cluster deployment
- [Multi-party audio and video] Fixes an issue where video could not be published without a microphone when publishing a video stream in a multi-party meeting
- [Multi-party audio and video] Fixes an issue where muting all members did not take effect after creating a meeting
- [One-to-one audio and video] Supports monitoring network disconnection on one client during a call

## v3.2.1 2020-07-28

- [Multi-party audio and video] The desktop-sharing API no longer requires a plugin in Chrome 72 or later
- [Multi-party audio and video] Adds a multi-stream publishing API
- [Multi-party audio and video] Supports publishing audio-only streams to a CDN
- [Multi-party audio and video] Fixes an issue where the authorization API could not be used in EasyIM
- [Multi-party audio and video] Fixes a failure to call another user after first calling an offline user in a 1-to-1 video call
- [One-to-one audio and video] Adds call push
- [EasyIM SDK] Removes the owner parameter from the API for creating a chat room
- [EasyIM SDK] Adds log collection

## v3.2.0 2020-07-09

- [EasyIM SDK] Adds APIs for creating chat rooms; querying and modifying chat room details; and querying, setting, and removing admins
- [EasyIM SDK] Fixes incorrect parsing of message-extension types
- [EasyIM SDK] Fixes failed downloads when directly sending a URL in an image or file message
- [EasyIM SDK] Changes message-sending failures caused by mute, blocklisting, and other restrictions to be returned through the fail callback instead of the global onError callback
- [Multi-party audio and video] Supports configuring mini program compatibility when creating a room through joinRoom

## v3.1.5 2020-06-23

- [Multi-party audio and video] Supports customizing the number of shared desktops when creating a meeting
- [Multi-party audio and video] Fixes Safari compatibility
- [Multi-party audio and video] Supports desktop sharing in Electron

## v3.1.4 2020-06-11

- [EasyIM SDK] Supports attachment-download redirection
- [EasyIM SDK] Supports throwing a separate exception when an image violates moderation rules
- [EasyIM SDK] Adds an API for retrieving chat room members by page

## v3.1.2 2020-05-14

- [EasyIM SDK] Adds APIs for uploading and modifying group/chat room announcements; retrieving group/chat room announcements; uploading, downloading, and deleting group/chat room files; and retrieving group/chat room file lists
- [EasyIM SDK] Changes the reconnection interval
- [EasyIM SDK] Removes the upload file-size limit and lets the server enforce it
- [EasyIM SDK] Adds APIs for muting and unmuting chat room members, retrieving the mute list, adding members to and removing members from the blocklist, and retrieving the blocklist
- [Multi-party audio and video] Adds APIs for requesting and leaving the stage, requesting to become a host, muting and unmuting all members, and muting and unmuting an individual member
- [Multi-party audio and video] Adds an API supporting multi-cluster deployment
- [Multi-party audio and video] Adds APIs for publishing a stream to a CDN and updating the stream layout
- [Multi-party audio and video] Fixes a regenerator-runtime error when importing WebRTC

## v3.1.0 2020-04-20

- [Multi-party audio and video] The joinRoom API constructs a URL using the appkey

## v3.0.10 2020-03-28

- [sdk] Supports chat group/chat room operations such as muting all members and allowlists
- [sdk] Supports sending custom messages
- [sdk] Adds ContentsType to the message body to indicate the message type
- [sdk] Fixes an issue where message extensions could not use number-type data
- [sdk] Changes 'Content-type' in the login API to 'application/json'
- [sdk] Fixes congestion caused by replying with unnecessary receipts
- [sdk] Fixes dnsconfig configuration
- [Multi-party audio and video] Adds the joinRoom API for joining a room
- [Multi-party audio and video] Adds the admin-change callback onAdminChanged
- [Multi-party audio and video] Adds meeting-attribute-related APIs
- [Multi-party audio and video] Defines the video stream type StreamType
- [Multi-party audio and video] Adds the desktop-sharing **Stop Sharing** callback function option.stopSharedCallback

## v3.0.7 2019-12-31

- [sdk] Adds DNS configuration under HTTPS
- [sdk] Adds group receipts
- [sdk] Fixes resource errors and other issues

## v3.0.6 2019-09-20

- [sdk] Adds recording and merging settings to audio and video
- [sdk] Adds message deduplication to the SDK
- [sdk] Adds timestamps to callback messages

## v3.0.5 2019-08-22

- [sdk] Simplifies methods for adding friends and removing users from the blocklist
- [sdk] Supports JSON objects in message extensions
- [sdk] Does not execute onclose when logging out
- [sdk] Fixes an issue where a connection could not be established in Electron

## v3.0.4 2019-07-25

#### Fixes

- [sdk] Fixes message-extension issues
- [sdk] Fixes issues recalling group messages
- [sdk] Improves historical messages
- [sdk] Fixes callback issues when sending voice and video messages

## v3.0.2 2019-07-09

#### New features

- [sdk] Uploads files through DNS when DNS is enabled

#### Fixes

- [sdk] Fixes an inability to retrieve historical messages
- [sdk] Fixes messageId issues in loc/cmd messages

## v3.0.0 2019-06-29

#### New features

- [sdk] Rewrites the SDK based on a proprietary protocol
- [sdk] Adds an API for retrieving historical messages
- [sdk] Adds an API for recalling messages
- [sdk] Adds an API for accepting group invitations
- [demo] Adds acceptance of group invitations
- [demo] Adds and adjusts some group-operation notifications

#### Fixes

- [demo] Fixes an incorrect display name during an audio or video call
- [demo] Fixes an issue where the group list was not updated in real time after joining a group
- [demo] Fixes an issue where an uppercase username prevented admins from being identified in a group

## v1.11.1 2019-03-18

#### New features

- [sdk] Improves automatic reconnection in the SDK by setting isHttpDNS to true and obtaining the DNS configuration file from the server
- [demo] Adds the isHttpDNS setting to the configuration file
- [demo] Adds isHttpDNS to SDK initialization in the project
- [demo] Fixes missing video and audio in Safari

## v1.10.0 2018-09-17

#### New features

- [demo] Multi-party audio and video

#### Fixes

- [demo] Fixes an issue where video continued after navigating away from the video page
- [demo] Fixes an issue where Firefox invited Chrome to a multi-party meeting but neither received a video notification
- [demo] Fixes an issue where no incoming video-call notification was received when no conversation was selected
- [demo] Fixes the state of the video toggle in multi-party video
- [demo] Fixes an issue where Chrome did not display video from a Firefox user during a multi-party audio and video meeting
- [demo] Fixes an issue where, when two accounts logged in using one browser, one account's UI often did not receive video invitations

## v1.6.0 2018-01-29

#### New features

- [demo] Multi-party audio and video
- [sdk] Multi-party audio and video

#### Fixes

- [demo] Fixes an inability to send emojis

## v1.5.0 2017-11-17

#### New features

- [demo] Adds Rest Interface test cases
- [demo] Makes SDK/Demo uploads compatible with IE8

#### Fixes

- [demo] Fixes abnormal multi-device login
- [demo] Fixes an issue where joining a new public group requiring approval did not follow the approval process
- [demo] Displays a **Muted** tooltip when the pointer hovers over the group-mute icon
- [demo] Imports the SDK from a CDN in demo.html
- [demo] Fixes inaccurate offline-message counts
- [demo] Changes window.history.pushState to window.location.href because of compatibility issues in Chrome on Windows
- [demo] When window.location.href = xxxx changes href.search parameters (?a=x&b=y), opening local index.html through file causes direct page navigation and prevents login. Changes the implementation to modify href.hash parameters (#a=x&b=y)
- [demo] Displays the operations available to group admins

## v1.4.13 2017-09-12

#### New features

- [sdk] Adds jsdoc

#### Fixes

- [sdk] Fixes abnormal read and delivery receipts in iOS (8.1) WebView
- [sdk] Fixes abnormal multi-device login
- [demo] Fixes abnormal multi-device login

## v1.4.12 2017-07-17

#### New features

- [sdk] Changes the formats of delivery ack and read ack
- [sdk] When a user sends a message while offline, the SDK automatically reconnects and sends messages that failed to send
- [sdk] WEBIM supports multiple devices and adds a chat room join event
- [sdk] Adds the from field to delivered and ack
- [demo] Adds Rest Interface test cases
- [demo] Makes SDK/Demo uploads compatible with IE8

#### Fixes

- [sdk] Improves IE8 compatibility
- [sdk] No longer sends a read ack for a self-sent message back to the sender
- [demo] Fixes an issue where joining a new public group requiring approval did not follow the approval process
- [demo] Displays a **Muted** tooltip when the pointer hovers over the group-mute icon
- [demo] Imports the SDK from a CDN in demo.html
- [demo] Fixes inaccurate offline-message counts
- [demo] Changes window.history.pushState to window.location.href because of compatibility issues in Chrome on Windows
- [demo] When window.location.href = xxxx changes href.search parameters (?a=x&b=y), opening local index.html through file causes direct page navigation and prevents login. Changes the implementation to modify href.hash parameters (#a=x&b=y)
- [demo] Displays the operations available to group admins

## v1.4.11 2017-06-14

#### New features

- [sdk] Integrates debug.js into the SDK and improves log output
- [sdk] Blocks chat groups through REST
- [sdk] Sends group-join requests through REST
- [sdk] Retrieves the chat group list through REST
- [sdk] Retrieves chat group details by groupid through REST
- [sdk] Lists all chat groups joined by a user through REST
- [sdk] Lists all members of a chat group through REST
- [sdk] Mutes group users through REST
- [sdk] Unmutes users through REST
- [sdk] Retrieves all admins in a chat group through REST
- [sdk] Retrieves all muted members in a chat group through REST
- [sdk] Sets a group admin through REST
- [sdk] Removes a group admin through REST
- [sdk] Approves a user's request to join a chat group through REST
- [sdk] Declines a user's request to join a chat group through REST
- [sdk] Adds a user to the group blocklist through REST (single user)
- [sdk] Adds users to the group blocklist through REST (batch)
- [sdk] Removes a user from the group blocklist through REST (single user)
- [sdk] Removes users from the group blocklist through REST (batch)
- [demo] Allows chat records in a chat window to be cleared
- [demo] Displays the state of the sender's chat records in the chat window (undelivered, delivered, or read)
- [demo] Displays chat room members
- [demo] Opens a conversation with a friend directly through a link
- [demo] Adds a panel for requesting to join a public group
- [demo] Supports pull-down pagination to retrieve public groups in the public-group join-request panel
- [demo] Supports clicking a group name to view group details in the public-group join-request panel
- [demo] Supports searching for a group and viewing its details in the public-group join-request panel
- [demo] Supports requesting to join a group on the group-details page in the public-group join-request panel
- [demo] Allows the group owner to approve or decline group-join requests
- [demo] Adds buttons for adding/removing admins and muting/unmuting group members to the group owner's group-member list

#### Fixes

- [sdk] Fixes unnecessary subscription messages generated when adding a friend
- [sdk] Fixes duplicate message IDs caused by sending messages frequently
- [sdk] Adapts the SDK to file and image sizes when sending them
- [demo] Improves sdk/demo.html and fixes missing dependency files
- [demo] Fixes inaccurate offline-message counts

## v1.4.10 2017-02-16

#### New features

- [sdk] Adds voice calls to WebRTC

#### Fixes

- [sdk] WebRTC: Fixes an issue in Firefox after a call ends
- [sdk] WebRTC: Fixes confused logic after connecting and hanging up multiple times
- [sdk] WebRTC: Prevents a normal hang-up from reporting offline
- [sdk] WebRTC: Fixes an inability to process audio and video IQ messages after reconnection

## v1.4.9 2017-01-20

#### Fixes

- [sdk] Fixes an error when successful or failed callback functions are undefined

## v1.4.8 2017-01-03

#### New features

- [demo] Adds an audio toggle for WebRTC video chat
- [demo] Creates chatWindow dynamically to improve webpage performance
- [demo] Adds an overlay to chatWindow when switching leftbar and directly returns to the previously selected cate and chatWindow when returning to the previous leftbar
- [demo] Refreshing the page after successful login no longer returns to the login page

#### Fixes

- [sdk] Removes all log methods from the SDK
- [sdk] Sends an additional unavailable presence stanza when leaving a muc group room

## v1.4.7 2016-12-21

#### New features

- [demo] Adds video chat and video-file sending to demo.html

#### Fixes

- [sdk] Fixes an inability to reconnect after disconnection when a mobile browser runs in the background
- [demo] When WebIM creates a chat group, waits until server-side creation succeeds before retrieving group information and updating the group list in the UI
- [demo] When WebIM adds a user to a group, both the group owner and the added member receive a notification
- [demo] When the WebIM group owner removes a member from the group blocklist, the member is deleted directly instead of returning to the group-member list

## v1.4.6 2016-12-20

#### New features

- [sdk] Adds demo.html to demonstrate how to call SDK APIs

#### Fixes

- [demo] Refreshes the group list immediately after successful group creation instead of waiting 1 second
- [sdk] Decouples the SDK from the upper-layer Demo and deletes Demo-related code
- [sdk] Deletes connection.prototype.createRoom, which the server does not support

## v1.4.5 2016-12-01

#### New features

- GNU-style version numbering: major version.minor version.patch version (1.4.5 under the new rule = 1.1.4.5 under the old rule)
- [demo] Friends can use WebRTC for video chats (supports only HTTPS + WebKit browsers)
- [demo] Supports up to 8 tabs logged in to the same account with isMultiLoginSessions:true
- [demo] Adds an IP policy for HTTP access to prevent DNS hijacking with isHttpDNS:true
- [sdk] Adds two installation methods (for details, see [Integration methods](https://docs-im.easemob.com/im/web/intro/integration))
  - Add a `<script>` tag and access websdk through the WebIM namespace
  - NPM (websdk is published to NPM): require it before accessing WebIM

#### Fixes

- [sdk] Fixes an issue where destroying a chat group did not update the UI
- [sdk] Fixes an issue where the callback function could not be invoked after a cmd message was sent successfully

## v1.1.3 2016-11-01

#### Improvements

- [demo] Supports the Windows SDK. You can [download the Web SDK from the Easemob website](https://www.easemob.com/download/im#Web).
- [demo] Adds the blocklist feature.
- [demo] Retrieves the chat room list with pagination and pull-to-refresh and adds the following 2 parameters: pagenum and pagesize.
- [demo] Adds the following chat group features: create a chat group, change the group name, change the group description, manage group members, and join a public group.
- [sdk] Upgrades strophe from v1.2.2 to v1.2.8, uses strophe-1.2.8.min.js in production mode, and uses strophe.js in development mode.
- [sdk] Supports automatic reconnection by adding the `autoReconnectNumMax` and `autoReconnectInterval` parameters to webim.config.js.

#### Fixes

- [demo] Adds `babel-core/browser-polyfill.js` to fix the lack of HTML5 element support in IE.
- [demo] Fixes an issue where clicking a friend did not take effect when unread messages existed.
- [sdk] Fixes a BOSH error when using strophe.js v1.2.8 in IE9. [https://github.com/strophe/strophejs/issues/213](https://github.com/strophe/strophejs/issues/213)
- [sdk] Fixes delays in sending and receiving messages when a large number of offline messages exist. The client limits ack response messages to 5 per second without affecting other normal messages.
- [sdk] Changes heartbeat messages from JSON messages with an empty body to ping/pong IQ. The former are cached by the XMPP server as offline messages.

## v1.1.2 2016-8-12

#### Improvements

- New Demo
- Adds the isAutoLogoin parameter and enables setPresence by default
- Splits the SDK into four files and packages them into one webim.im.sdk.js file
- Adds try catch to minimize disconnections caused by external errors
- Changes error codes so that error messages are no longer returned and are instead documented

#### Fixes

- Fixes an inability to pass file_length
- Fixes special characters not being displayed
- Fixes a toLowercase error when an EasyIM user is a number
- Adds a duration parameter for sending audio

## v1.1.1 2016-6-27

#### Improvements

- Adds successful and failed callbacks for joining a chat room
- Adds the network-monitoring callbacks onOnline and onOffline
- Handles compatibility between EasyIM Web and Android/iOS SDK 3.x and 2.x
- Adds file sending to the Demo
- Automatically converts received AMR audio to MP3

#### Fixes

- Fixes heartbeat messages creating multiple timers
- Fixes style issues caused by long friend names
- Fixes failed attachment sending in IE9
- Fixes an error when adding friends in IE9

## v1.1.0 2016-4-6

#### Improvements

- Removes the emoji package from the SDK and allows custom emojis to be imported.
- Adds a parameter supporting multiple resources for XMPP connections.
- Automatically falls back to HTTPS long polling when WSS is unsupported, such as in browsers using the qqX5 engine.
- Adds chat room features.
- Some APIs in v1.1.0 are incompatible with earlier SDK versions. Adds shim.js for backward compatibility.
- Adds successful and failed callbacks for message sending.
- Improves code and fixes a WebSocket error during logout.

## v1.0.7 2015-8-25

#### Improvements

- Adds connection heartbeats to keep the client connection active.
- Adds support for multiple resources on XMPP connections.
- Implements WebSocket support in the EasyIM Web SDK.
- Adds token login.
- Uses a third-party plugin (swfupload) in the Demo to support browsers that do not support asynchronous uploads.
- Uses jPlayer to play voice messages in browsers that do not support the audio tag. This solution currently supports only MP3.
- Reorganizes the directory structure. SDK-related files are in the sdk folder. Adds easemob.im.config.js, in which only the related fields need to be configured.
- Improves code to support rapid debugging in multiple environments.
- Supports IE7, IE8, and IE9. In the Demo, only received audio messages in MP3 format can be played.

## v1.0.5 2015-3-11

#### New features

- Improves the underlying connection to reduce system login time.
- Adds command-message support. Register the onCmdMessage event to listen for command messages pushed by the server.
- Automatically sends a response message to the server after receiving a message.
- Retries an image download once by default if it fails.

## v1.0.4.1 2015-1-15

#### New features

- Receives file-message notifications. Downloading is not yet supported.
- Receives video-message notifications. Downloading is not yet supported.

#### Fixes

- Fixes an issue where messages were lost at the next login if the browser was closed directly without clicking **Log Out**.

## v1.0.4 2014-12-17

#### Fixes

- Fixes an issue where group-chat location messages were processed as one-to-one messages.
- Fixes an issue where messages from strangers were not displayed when the friend list was empty.

## v1.0.3 2014-12-11

#### New features

- Adds chat with strangers.
- Adds new-user registration.
- Supports HTTPS access.
- Supports token login.
- Supports voice messages.
- Supports custom message-body extensions by adding the ext property.
- The Demo supports unread-message reminders.

#### Improvements

- Fixes Demo style issues when there are too many friends.
- Fixes an issue where messages could not be received if the variable name in conn = new Easemob.im.Connection(); was not conn or conn was not a global variable.
- Fixes an issue where group offline messages were processed as messages from strangers.
- Fixes an issue where a friend name was obscured in IE when a received text message began with a newline character.
- Fixes an issue where an online user invited to a group was not displayed in real time and had to log in again.
- Expands related documentation.

