# iOS EasyIM SDK Release Notes

## v5.0.0 Dev 2026-8-12

This section highlights feature and behavior changes. For details about API removals, renames, and replacements, see the [iOS EasyIM SDK 5.0.0 Migration Guide](migration_guide.html).

#### Important changes

**Data synchronization and local data access**

The SDK adds a unified data synchronization mechanism. The app can configure the data types to automatically synchronize after login, including conversations, friends, and joined chat groups, and monitor synchronization progress through unified synchronization status callbacks.

Opening the database and synchronizing data from the server are separate stages. The app can handle them as follows:

1. **Configure the synchronization scope**: Call `EMOptions#dataSyncType` to configure the data types to automatically synchronize after login, including conversations, friends, joined chat groups, or no data. You can combine multiple data types as bit flags. We recommend that you explicitly configure this setting before calling `initializeSDKWithOptions:`.
2. **Read local data**: The `onDatabaseOpened:username:` callback indicates that the local database for the current account has been opened. After receiving this callback, you can read local data without waiting for post-login synchronization to finish, which helps accelerate the initial screen display during a cold start.
3. **Monitor server data synchronization**: Use `syncDataStartWithType:` and `syncDataFinished:type:` to monitor when synchronization of a specified data type starts and finishes.
4. **Read the latest data after this synchronization**: To display the latest data synchronized from the server after this login, wait until the corresponding `syncDataFinished:type:` callback reports success. Then read the local conversations, friends, or joined chat groups and refresh the UI.

**Chat group configuration model refactoring**

Chat group configuration has changed from the original style or options model to an independent property model. Settings such as chat group visibility, approval to join a chat group, member invitations, the maximum number of members, and extension information can be configured separately. You can also update specified fields as needed after a chat group is created.

- `EMGroupConfigs` stores the specific chat group configuration values. It replaces `EMGroupOptions` and `EMGroupStyle`.
- `EMGroupConfigsType` specifies the configuration fields to update in the current operation.
- Pass `EMGroupConfigs` when creating a chat group. When updating chat group configuration, pass both `EMGroupConfigs` and `EMGroupConfigsType`.
- `EMGroup` provides a list of chat group member user IDs. The actual data depends on whether the current chat group object contains complete chat group details.

**Message read receipts and unread count management**

Message read receipts cover both one-to-one and group chats and now use message-level configuration, batch sending, and unified receipt handling. Clearing the local unread count and sending a read receipt to the message sender are independent operations.

1. Message read receipts

- Read receipts are sent in batches and processed uniformly for one-to-one and group chats.
- Whether a read receipt is required is controlled separately for each message by `EMChatMessage#isNeedReadReceipt`.
- Real-time read receipts for one-to-one and group chats are received uniformly through `onMessageReadReceipts:`.
- Group chats support batch queries for message read receipt summaries.

2. Conversation unread count management

- The SDK provides a total count of unread messages in local conversations. This count excludes chat rooms, message threads, and conversations whose push notification mode is not `EMPushRemindTypeAll`.
- After you clear the local unread count for a specified conversation or all conversations, the result is synchronized to the current account's other devices, but no message read receipt is sent to the message sender.
- When another device clears a conversation's unread count, this device receives a multi-device conversation event. The app should then reread the local conversation and refresh the UI.

**Conversation and friend capabilities**

The SDK adds capabilities such as conversation list monitoring, conversation display information, batch conversation deletion, and local blocklist storage:

- Added `EMConversationDelegate` to monitor conversation list changes.
- Added support for retrieving conversation display names and avatars.
- Added support for deleting conversations in batches, with the option to also delete local messages.
- Added support for storing local blocklist data.

#### Improvements

**Login and account**

- The client registration API has been removed. Account registration should be implemented by the app server.
- Token-based login is now used uniformly, and password login has been removed. `loginWithUsername:token:completion:` is retained, while client registration, password login, password-to-Token exchange, and the legacy Agora Token login APIs have been removed. The app should obtain and securely store the Token through the app server.
- Automatic login-related configuration, status, and callbacks have been removed, including `EMOptions#isAutoLogin`, `EMClient#isAutoLogin`, and `autoLoginDidCompleteWithError:`. The app must manage the login state and Token itself.
- Device management now uniformly uses Token authentication. Username- and password-based multi-device query and device removal APIs have been removed. Use `getLoggedInDevicesFromServerWithUserId:token:completion:` to query devices, and `kickDeviceWithUserId:token:resource:completion:` or `kickAllDevicesWithUserId:token:completion:` to remove logged-in devices.
- Notifications that the current account has logged in on another device now uniformly use `userAccountDidLoginFromOtherDeviceWithInfo:`, with `EMLoginExtensionInfo` returning the login device and extension information.

**Message API changes**

- Initializers based on `NSData` have been removed from file and image message bodies. Create message bodies uniformly from local paths, for example, by using `initWithLocalPath:displayName:`.
- Historical message retrieval, local message search, and server-side message search now uniformly use the retained asynchronous or paginated APIs.
- Message modification, message resending, and combined message attachment download and parsing now uniformly use the retained asynchronous APIs.
- Reaction data is now uniformly read through retained methods or properties, and deprecated legacy APIs have been removed.
- `EMStreamChunk` no longer exposes `sequenceNumber`. Use `isComplete` to determine whether a streaming message is complete.

**Chat group and chat room API changes**

- APIs for paginated retrieval of the public chat group list and the `searchPublicGroupWithId` API series have been removed.
- When the chat group ID is known, you can still use `getGroupSpecificationFromServerWithId:completion:` to retrieve chat group details as authorized by your business logic.
- To join a public chat group, use `joinPublicGroup:completion:`. If admin approval is required, use `requestToJoinPublicGroup:message:completion:` to submit a request to join the chat group.
- The chat room creation and destruction APIs have been removed. The app server must call server-side REST APIs to perform the related management operations.
- To display a list of chat rooms that users can join, the app server should call server-side REST APIs to retrieve chat room information and return the results to the client for display.

**Asynchronous replacement of synchronous APIs**

Synchronous APIs for chat group member management, friend management, Token login, message recall, logout, and offline push have been removed and replaced with asynchronous APIs that include a completion. The caller should handle the result, errors, and UI refresh in the completion.

**Low-frequency and legacy API cleanup**

- The message reporting API has been removed. The app server should handle the reporting process.
- Low-frequency diagnostic APIs such as service checks have been removed. The app should perform diagnostics based on the login completion, connection status, and Token expiration callbacks.
- `EMStatisticsManager`, message statistics models, and related public APIs have been removed. To collect statistics on the number of messages, message size, or attachment size, the app must collect and calculate the data itself.
- A number of deprecated, synchronous, or legacy callback-based APIs have been removed from the conversation, message, friend, chat group, and chat room modules. When upgrading, adapt your app based on the replacement APIs or implementation recommendations in the migration guide.

#### Fixes

- Fixed an issue where an uploaded attachment might be limited to 2 MB when sending file, image, or other attachment messages without setting `displayName`. The SDK now automatically uses the local file name as the display name.
- Fixed an issue where the local client did not fully log out after the account logged in on another device, was removed by the server, or was disabled.

## v4.24.0 Dev 2026-7-10 (Development version)

#### New features

Added support for [server-side message search](/value-added/search/message_search_ios.html), which allows filtering by keyword combinations, conversation ID, message type, time range, and message content or extension attributes. For details, see [Activation instructions](/product/console/purchase_value_added.html#消息搜索).

Message search does not support the `ext` extension field by default. To search this field, contact the EasyIM business manager.

#### Fixes

- Fixed an occasional crash caused by disconnecting the EasyIM persistent connection while offline messages were being retrieved during login.
- Fixed an issue where speech-to-text failed in some scenarios.

## v4.23.0 Dev 2026-6-10 (Development version)

#### New features

Added support for [configuring a callback routing identifier for a message so that it can trigger pre-delivery and post-delivery callbacks through a specified route](message_send.html#set-callback-routing-when-sending-a-message). Currently, this feature is available only in China Regions 1 and 2.

#### Improvements

- Added [login failure error codes](error.html):
  - `350`: `EMErrorConnectionTimeout`: Timed out while connecting to the server.
  - `351`: `EMErrorConnectionDNSError`: A DNS error occurred while connecting to the server.
  - `352`: `EMErrorConnectionIOError`: An IO error occurred while connecting to the server.
  - `353`: `EMError#CONNECTION_STREAM_CLOSED`: The stream was closed while connecting to the server.
  - `354`: `EMErrorConnectionProvisionTimeout`: Authentication timed out while connecting to the server.

#### Fixes

- Fixed an occasional failure to download internal attachments in combined forwarded messages.
- Fixed an issue where Exif information was unexpectedly lost when sending images in HEIF format.

## v4.22.0 Dev 2026-6-5 (Development version)

#### New features

- Added layered resource management for image messages and improved related processing logic:
  - Added a [large-image resource type](message_send.html#send-image-messages) to distinguish original images from compressed image resources.
  - Improved [image processing when sending a non-original image](message_send.html#send-image-messages).
  - Improved [path handling for original images, large images, and thumbnails in image messages](message_receive.html#接收图片消息).
- Added automatic friend list synchronization:
  - Added [automatic friend list synchronization configuration](user_relationship.html#automatically-synchronize-the-friend-list-after-login).
  - Added [callbacks for friend list and friend information synchronization status](user_relationship.html#monitor-friend-relationship-and-friend-information-changes).
  - Enhanced friend objects: The [server](user_relationship.html#retrieve-the-friend-list-and-friend-information) and [local friend list retrieval](user_relationship.html#read-the-friend-list-locally) APIs now return friends' user attributes and the time they were added. Previously, they returned only friend user IDs and friend remarks.
- Added support for [subscribing to attribute changes for non-friend users](userprofile.html#subscribe-to-attribute-changes-of-non-friend-users).
- Added APIs to configure the WebSocket service address and port for data synchronization.

#### Improvements

- Deprecated `EMImageMessageBody#initWithData:thumbnailData:` for creating an image message body. Use [initWithLocalPath:displayName:](message_send.html#发送图片消息) instead.
- Deprecated `EMContact#initWithUserId:remark:` for initializing a friend object. Use `EMContact#initWithUserId:remark:createAt:` instead.

## v4.21.0 Dev 2026-4-28 (Development version)

#### New features

Added [speech-to-text](/value-added/stt/voice_to_text_android.html).

#### Improvements

If translation fails when a message is sent, the SDK returns error code 1113 to indicate that message translation failed (`EMErrorTranslateServiceFail`).

#### Fixes

- Fixed an incorrect error code returned when adding a nonexistent user as a friend. Error code 303, `EMErrorServerUnknownError`, has been changed to error code 204, `EMErrorUserNotFound`.
- Fixed an inaccurate member count in a chat group or chat room when a join or leave event notification arrived before the API response.

## v4.20.0 Dev 2026-3-30 (Development version)

#### New features

1. Added [automatic user information management](userinfo_provider.html).

  User information refers to user-related information displayed by the app, including [user attributes](userprofile.html), [friend remarks](user_relationship.html#set-friend-remarks), and [chat group member name cards](group_namecard.html).
   
   After `EMOptions#enableUserInfo` is enabled, the SDK supports automatically synchronizing, caching, and updating user information and chat group member name card information. The main features are as follows:
   - Automatically synchronizes the current user's information after a successful login.
   - Automatically includes sender information and the chat group member name card update time when sending a message.
   - Automatically updates local memory based on the update time after receiving a message.
  
   The following APIs have been added to implement automatic user information management:
   - `EMChatMessage#senderInfo`: Retrieves message sender information.
   - `EMUserInfoManagerDelegate`: Monitors user information update events.
   - `EMUserInfoManager#getUserInfoByIds`: Queries user information from local memory.

2. Added [chat group member name card management](group_namecard.html).
   
   This feature supports setting chat group member name cards, querying them locally, retrieving them from the server and writing them to local memory, automatically synchronizing them through messages, and monitoring changes. The following APIs and callbacks have been added:
   - Added `EMGroupManager#updateGroupNamecard` to update the current user's name card in a specified chat group.
   - Added `EMGroupManager#getGroupNamecard` to retrieve a chat group member name card from local memory.
   - The `EMGroupManager#fetchGroupMemberInfoListFromServer` returned by `EMGroupMemberInfo` now includes the `namecard` chat group member name card field.
   - Added `EMGroupManagerDelegate#onUserGroupNamecardChanged` to monitor chat group member name card changes.

## v4.19.1 Dev 2026-2-27 (Development version)

- Fixed an issue introduced in v4.19.0 that caused combined message forwarding to fail.
- Fixed an occasional app crash when `currentUsername` was called multiple times on an asynchronous thread.

## v4.19.0 Dev 2026-2-2 (Development version)

#### New features

Added support for [receiving streaming messages sent by the server](message_stream_receive.html).

Currently, streaming messages can be delivered only through the [server-side RESTful API](/document/server-side/message_stream_send_single.html). The SDK receives these messages but cannot send them.

#### Improvements

The AOSL crash detection library on which the SDK depends has been replaced with `ShengwangInfra_iOS`. When using this version of the EasyIM SDK, use the corresponding Shengwang RTC SDK, ShengwangRtcEngine_iOS 4.6.0 or later.
   
#### Fixes

- Fixed an issue where `remote_url` and `secret` information was lost when sending attachment messages.
- Fixed an issue where WebSocket could not connect properly in an IPv6 network environment.
- Fixed inaccurate msync connection status reporting.
- Fixed an issue where the push Token was not updated after another device logged in while the app was suspended.
- Fixed inconsistent behavior between synchronous and asynchronous methods when retrieving chat group details and members. The asynchronous method no longer returns the chat group object when an error occurs.

## v4.18.1 Dev 2025-11-12 (Development version)

#### Improvements

The underlying connection for private deployment can now switch between TCP and WebSocket.

#### Fixes

1. Fixed an issue introduced in 4.17.0 that prevented login with certain WebSocket server configurations.
2. Fixed an issue where the completion callback was not invoked when invalid parameters were passed to the chat room attribute retrieval methods `EMChatManager#fetchChatroomAttributes` and `EMChatManager#fetchChatroomAllAttributes`.

## v4.18.0 Dev 2025-10-31 (Development version)

:::tip
We recommend using v4.18.1.
:::

#### New features

1. Added support for configuring an IPv6-format REST address for private deployment.
2. Added underlying support for secure DNS resolution through DoH to improve connectivity.

#### Fixes

1. Fixed a file descriptor (FD) overflow when using WebSocket.
2. Fixed an occasional crash when a WebSocket connection was disconnected due to a network exception.

## v4.17.1 Dev 2025-11-12 (Development version)

#### Improvements

The underlying connection for private deployment can now switch between TCP and WebSocket.

#### Fixes

1. Fixed an issue introduced in 4.17.0 that prevented login with certain WebSocket server configurations.
2. Fixed a file descriptor (FD) overflow when using WebSocket.
3. Fixed an occasional crash when a WebSocket connection was disconnected due to a network exception.
4. Fixed an issue where the completion callback was not invoked when invalid parameters were passed to the chat room attribute retrieval methods `EMChatManager#fetchChatroomAttributes` and `EMChatManager#fetchChatroomAllAttributes`.

## v4.17.0 Dev 2025-9-28 (Development version)

:::tip
We recommend using v4.17.1.
:::

#### New features 

- Long-lived connections now support the WebSocket protocol. 
- Added support for private WebSocket deployment:
  - `EMOptions#webSocketServer`: Sets the WebSocket server address.
  - `EMOptions#webSocketPort`: Sets the WebSocket server port.
  - `EMOptions#enableTLSConnection`: Sets whether the WebSocket protocol uses WSS.

#### Improvements

Updated the AOSL crash reporting dependency library to version 1.3.0.

#### Fixes

Fixed an issue where updating chat group attributes affected the chat group avatar.

## v4.16.2 2025-11-12

#### New features

Added support for configuring an IPv6-format REST address for private deployment.

#### Improvements

Updated the AOSL library to version 1.3.0.

#### Fixes

1. Fixed an issue where updating chat group attributes affected the chat group avatar.
2. Fixed an issue where the completion callback was not invoked when invalid parameters were passed to the chat room attribute retrieval methods `EMChatManager#fetchChatroomAttributes` and `EMChatManager#fetchChatroomAllAttributes`.

## v4.16.1 Dev 2025-9-5 (Development version)

#### Fixes

Fixed an occasional failure to bind an APNs Token introduced in v4.16.0.

## v4.16.0 Dev 2025-8-19 (Development version)

#### Fixes

1. The following issues were fixed in the EasyIM SDK:
   
   Fixed an issue where members still retrieved chat group or chat room details from the server after receiving the callback that the chat group or chat room had been destroyed.

2. Added anti-fraud notices to the EasyIM Demo:
  - Added an anti-fraud background to the chat page.
  - An anti-fraud notice message is inserted when a message is sent or received.

## v4.15.1 Dev 2025-6-23 (Development version)

#### New features 

1. Added support for [retrieving messages in a conversation from the local database by keyword](message_retrieve.html#retrieve-messages-in-a-local-conversation-by-keyword). The SDK returns lists of conversation IDs and message IDs.
2. Added support for [retrieving one or more messages from the local database by message ID](message_retrieve.html#retrieve-local-messages-by-message-id).

#### Fixes

1. Fixed an issue where the `EMChatManagerDelegate#onMessageContentChanged` callback did not return modification information when modifying messages other than text and custom messages.
2. Fixed an issue where [retrieving roaming messages](message_retrieve.html#从服务器获取指定会话的消息) still created a local conversation when messages were configured not to be saved (`EMFetchServerMessagesOption#isSave` was set to `false`).   

## v4.15.0 Dev 2025-5-21 (Development version)

#### New features

- When [recalling a message](message_recall.html), allows a group owner or admin to recall messages sent by other users in the chat group.
- Chat group member join and leave events can now notify the app of multiple members joining or leaving a chat group at once. Previously, the SDK delivered a separate event callback for each member who joined or left.
  - Added chat group member join and leave events [onMembersJoined](group_manage.html#monitor-chat-group-events) and [onMembersExited](group_manage.html#monitor-chat-group-events). The original events, `onMemberJoined` and `onMemberExited`, are deprecated. Use the new events instead. 
   
#### Improvements

- Changed when the Token expiration warning event [tokenWillExpire](connection.html#监听连接状态) is triggered. The SDK now delivers the expiration warning when 80% of the Token validity period has elapsed, instead of 50% in previous versions.
- [EasyIM Demo] You no longer need to deploy an App Server to run the EasyIM Demo. For details, see the [Demo quick start](demo.html#快速跑通-demo-源码).

## v4.14.0 Dev 2025-4-21 (Development version)

#### New features

- Added support for [sending](message_send.html#发送-gif-图片消息) and [receiving GIF image messages](message_receive.html#接收-gif-图片消息).
- Added support for [chat group avatars](group_attributes.html#manage-the-chat-group-avatar).
- Added support for [message attachment authentication](message_receive.html#receive-attachment-messages). To activate this feature, contact the EasyIM business manager. After activation, you must call an SDK API to download message attachments.
- Added support for [retrieving only messages sent by specified chat group members](message_retrieve.html#retrieve-messages-sent-by-specified-group-members-from-the-server) when retrieving roaming messages.
- Added support for [loading only messages sent by specified chat group members](message_retrieve.html#retrieve-messages-sent-by-specified-group-members-locally) when loading local conversation messages.
- The [chat group member list](group_manage.html#获取群成员列表) now includes member roles and join times.

#### Improvements

- Added the device time-zone offset to log files to facilitate troubleshooting.
- When [EMChatManager#fetchMessagesFromServerBy:conversationType:cursor:pageSize:option:completion:](message_retrieve.html#从服务器获取指定会话的消息) is called to retrieve roaming messages and the last page is reached, the returned `EMCursorResult#cursor` has changed from `undefined` to an empty string.
- Upgraded the BoringSSL and SQLCipher libraries used by the SDK to avoid security risks.

#### Fixes

- Fixed an issue where SDK REST requests to the server failed briefly when the device network switched from 4G to Wi-Fi.

## v4.13.0 2025-3-12

#### Improvements

- [EasyIM SDK] The post-delivery message editing API [EMChatManager#modifyMessage](message_modify.html) now supports editing various message types:
  - Text/custom messages: Supports editing the message body and the `ext` extension.
  - File/video/audio/image/location/combined forwarded messages: Supports editing only the `ext` message extension.
  - Command messages: Editing is not supported.
- [EasyIM SDK] Improved reconnection logic by switching the reconnection address by default.
- [EasyIM SDK] Improved the logic for calling `applicationWillEnterForeground` so that sending a ping message triggers reconnection.
- [EasyIM SDK] Disabled the default constructors of `EMChatMessage`, `EMConversation`, and `EMMessageBody` to prevent crashes caused by null pointers.
- [EasyIM App (Demo)] Added an anti-fraud notice UI.

#### Fixes
- [EasyIM SDK] Fixed an issue where the latest message in a conversation retrieved by calling [EMChatManager#getConversationsFromServerWithCursor](conversation_list.html#从服务器分页获取会话列表) did not contain Reactions or translation information.

## v4.12.0 2025-1-10

#### New features

- [EasyIM SDK] After a user joins a chat room, the following information is returned in the success callback of the `joinChatroom` method:
  1. Current number of users in the chat room, `EMChatRoom#occupantsCount`. The current chat room user count is updated when a user joins or leaves the chat room.
  2. Mute-all status of the chat room, `EMChatRoom#isMuteAllMembers`. The value of this property is updated when a mute-all status change is received.
  3. Chat room creation timestamp, `EMChatRoom#createTimestamp`, which is a new property.
  4. Whether the current user is on the chat room allowlist, `EMChatRoom#isInWhitelist`. This is a new property and is updated when the member receives an allowlist change callback.
  5. Timestamp when the current user's mute expires, `EMChatRoom#muteExpireTimestamp`. This is a new property and is updated when the member receives a mute status change callback.

#### Improvements

- [EasyIM SDK] Improved some database operations.

#### Fixes

- [EasyIM SDK] Fixed an issue where completion callbacks for some API requests were not invoked on the main thread, including the following APIs:
  - All APIs in `EMUserInfoManager` and `EMPresenceManager`.
  - The `fetchMessagesFromServer`, `fetchSupportedLanguages`, `translateMessage`, and `getMessageCountWithCompletion` APIs in `EMChatManager`.

## v4.11.0 2024-12-3

#### New features

- [EasyIM SDK] When [retrieving roaming messages from the server](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server), the SDK now reads message read and delivery status from the server. This feature applies only to one-to-one messages and is disabled by default. To enable it, contact the EasyIM business manager. 
- [EasyIM SDK] Chat room member mute callback:
  - Added the chat room mute callback `EMChatroomManagerDelegate#chatroomMuteListDidUpdate:addedMutedMembers:`. In the callback, the `(NSDictionary<NSString *,NSNumber*> *)aMutes` parameter indicates the mute expiration timestamp.
  - Deprecated the original callback `EMChatroomManagerDelegate#chatroomMuteListDidUpdate:addedMutedMembers:muteExpire:`.
- [EasyIM SDK] Added crash reporting. When the SDK crashes, it reports the crash information after the next startup.

#### Fixes

- [EasyIM SDK] Fixed a crash caused by a network exception in extreme circumstances.

#### Improvements

- [EasyIM SDK] Removed APIs that were marked as deprecated before v4.0.0.

#### Note

Because crash reporting uses the `aosl.xcframework` library, integrating `HyphenateChat 4.11.0` together with `AgoraRtcEngine_iOS 4.3.0-4.4.1` causes an AOSL library conflict and an error when `pod install` is run. For details, see [Integration issues in the iOS quick start](quickstart.html#集成问题).


## v4.10.2 2024-11-22

#### Fixes

Fixed an issue where calling [EMPushManager#getSilentModeForConversations:completion:](/document/ios/push/push_notification_mode_dnd.html#获取多个会话的推送通知设置) failed to retrieve the DND status of conversations.

## v4.10.1 2024-10-28

#### Fixes

- Fixed an issue where a recalled pinned one-to-one message was not promptly removed from the pinned message cache (`EMConversation#pinnedMessages`).
- Fixed an issue where uploading a shared chat group file failed if the file name began with Chinese characters.

## v4.10.0 2024-09-30

#### New features

- [EasyIM SDK] Added `EMChatManager#getMessageCountWithCompletion:` to retrieve the total number of messages in the database. 
- [EasyIM SDK] Added [two error codes](error.html):
  - `EMErrorGroupUserInBlockList` (613): The user is on the chat group blocklist. This error is reported when a user on the chat group blocklist performs certain operations, such as joining the chat group.
  - `EMErrorChatroomUserInBlockList` (707): The user is on the chat room blocklist. This error is reported when a user on the chat room blocklist performs certain operations, such as joining the chat room.
  
#### Improvements
 
- [EasyIM SDK] A [pre-delivery callback](/document/server-side/callback_presending.html) can modify [message extension fields](/document/android/message_extension.html), which are now synchronized to the sender.
- [EasyIM SDK] After the [server-side conversation deletion API](conversation_delete.html#单向删除服务端会话及其历史消息) is successfully called, the local conversation is deleted. In previous versions, this API could be configured to delete the local messages in a conversation but could not delete the local conversation.
- [EasyIM SDK] The default error codes reported for chat group and chat room operations have changed from `EMErrorGroupMembersFull` (604) and `EMErrorChatroomMembersFull` (704) to `EMErrorGroupPermissionDenied` (603) and `EMErrorChatroomPermissionDeniedD` (703). For example, if a regular chat group member attempts to assign a chat group admin, error 603 is reported because the user lacks permission.

#### Fixes

- [EasyIM SDK] Fixed an issue where the specified thumbnail dimensions did not take effect when sending an image message.
- [EasyIM SDK] Fixed an issue where the friend list could not be updated when a friend event was received before the friend list was retrieved.

#### [EaseCallKIt](easecallkit.html)

- Upgraded the dependent `AgoraRtcEngine` version to prevent App Store upload failures caused by Bitcode included in older versions.

## v4.9.0 2024-08-30

#### New features

- [EasyIM SDK] Added event callbacks for [the start and end of retrieving offline messages from the server](connection.html#监听连接状态): `EMClientDelegate#onOfflineMessageSyncStart` and `EMClientDelegate#onOfflineMessageSyncFinish`.
- [EasyIM SDK] Added the `IEMGroupManager#isMemberInMuteListFromServerWithGroupId:completion:` API to check whether the current user is on the chat group mute list.
- [EasyIM SDK] The original message pinning APIs, `IEMChatManager#pinMessage` and `IEMChatManager#unpinMessage`, now [support pinned messages in one-to-one conversations](message_pin.html). The APIs are unchanged.
- [EasyIM SDK] Added the `EMRecallMessageInfo#conversationId` property to [return the ID of the conversation to which the recalled message belongs](message_recall.html#设置消息撤回监听) in the `messagesInfoDidRecall` message recall event.

#### Improvements

- [EasyIM SDK] When `EMClient#applicationDidEnterBackground` is called, the SDK now immediately disconnects from the server and then requests a background task, instead of requesting a background task first and disconnecting within that task.
- [EasyIM SDK] Added support for chat room message aggregation.

#### Fixes

- [EasyIM SDK] Fixed an occasional incorrect conversation unread count when multiple threads retrieved the conversation list at the same time.
- [EasyIM SDK] Fixed an issue where the original group owner failed to leave the chat group in the SDK after the group ownership was transferred by calling the [REST API](/document/server-side/group_member.html#转让群组).
- [EasyIM SDK] Fixed an occasional unread count synchronization issue caused by receiving a multi-device conversation read synchronization event after multi-device login was enabled.

## v4.8.1 2024-07-26

#### Fixes

Fixed a crash caused by missing internal member variables in the `IEMChatManager#filterConversationsFromDB:filter:` object in some scenarios.

## v4.8.0 Dev 2024-07-01 (Development version)

#### New features

- [EasyIM SDK] Added support for the AUT protocol to improve successful service connections in weak network environments.
- [EasyIM SDK] Added support for [including extension information when joining a chat room and specifying whether to leave all previously joined chat rooms](room_manage.html#join-a-chat-room):
  - Added `EMChatroomManager#joinChatroom:ext:leaveOtherRooms:completion:`, which supports including extension information when joining a chat room and specifying whether to leave all other chat rooms.
  - Added the `EMChatroomManagerDelegate#userDidJoinChatroom:user:ext:` callback. When a user includes extension information upon joining a chat room, other users in the chat room can retrieve that extension information through the callback triggered when the user joins.
- [EasyIM SDK] Added support for [local storage of conversation push notification modes](/document/ios/push/push_notification_mode_dnd.html#从服务器获取所有会话的推送通知方式设置).
  - Added `EMPushManager#syncSilentModeConversationsFromServerCompletion:` to retrieve the push notification mode settings for all conversations from the server.
  - Added the `EMConversation#disturbType` attribute to store a conversation's push notification mode locally.
  - If a user changes a conversation's push notification mode on one device, the other devices receive the `EMMultiDevicesDelegate#multiDevicesConversationEvent:conversationId:conversationType:` event.
- [EasyIM SDK] Added `EMConversation#getMessageCountStart:to:` to [retrieve the total number of messages in a conversation in the SDK's local database during a specified period](message_retrieve.html#获取会话在一定时间内的消息数).

#### Improvements

- [EasyIM SDK] User attribute setting and retrieval APIs, including [setting the current user's attributes](userprofile.html#set-all-attributes-of-the-current-user), [retrieving the user attributes of one or more users](userprofile.html#retrieve-all-user-attributes-from-the-server), and [retrieving specified user attributes of specified users](userprofile.html#retrieve-specified-user-attributes-from-the-server), now report error code 4, `EMErrorExceedServiceLimit`, when the call frequency limit is exceeded.

#### Fixes

- [EasyIM SDK] Fixed an issue where the cache was not updated promptly when a friend was banned.
- Fixed an issue where push might not work after logout and subsequent login.

## v4.7.0 Dev 2024-06-05

#### New features

- [EasyIM SDK] Added support for [including a custom message when a device logs in and passing it to the device that is kicked offline](multi_device.html#set-login-device-extension-information): 
  - `EMLoginExtensionInfo.extensionInfo`: Device extension information.
  - `EMOptions#loginExtensionInfo`: Sets the extension information carried during login.
  - `EMClientDelegate#userAccountDidLoginFromOtherDeviceWithInfo.EMLoginExtensionInfo`: In a multi-device login scenario, if the current device is kicked offline by a newly logged-in device, the event received by the kicked device contains the new device's extension information.
- [EasyIM SDK] Added support for searching local messages by multiple message types:
  - `EMChatManager#searchMessages:withTypes:timestamp:count:fromuser:searchDirection:completion:`: [Searches messages in all conversations in the local database by one or more message types](message_search_local.html#根据消息类型搜索所有会话中的消息).
  - `EMConversation#searchMessages:withTypes:timestamp:count:fromuser:searchDirection:completion:`: [Searches messages in a single conversation in the local database by one or more message types](message_search_local.html#根据消息类型搜索当前会话中的消息).
- [EasyIM SDK] Added support for [one-way deletion of chat room roaming messages from the server](message_delete.html#delete-server-side-historical-messages-for-the-current-user).

#### Improvements

- [EasyIM SDK] The `userAccountDidLoginFromOtherDevice` callback is deprecated and replaced with `userAccountDidLoginFromOtherDeviceWithInfo`. This callback is triggered when the current device is kicked offline because the currently logged-in account logs in on another device.

#### Fixes

- [EasyIM SDK] When retrieving chat groups from the server, the SDK no longer clears the local chat groups first. Instead, it compares the retrieved chat groups with the local ones, updates existing local chat groups, and inserts new chat groups locally. To clear local chat group information, call `IEMGroupManager#cleanAllGroupsFromDB`.

## v4.6.1 Dev 2024-05-20

#### New features

- [EasyIM SDK] Added error code 407 `EMErrorFileExpired`. The SDK triggers this error when a user downloads an expired message attachment or chat group shared file.

#### Fixes

- [EasyIM SDK] Fixed an issue where a second request to retrieve the friend list, including friend remarks, from the server returned no data when the friend list had not changed.
- [EasyIM SDK] Fixed an issue where a message was still sent successfully after the attachment failed to send under special circumstances.
- [EasyIM SDK] Fixed an incorrect nextkey when retrieving roaming messages.

## v4.6.0 Dev 2024-04-30

#### New features

- [EasyIM SDK] Added `filterConversationsFromDB` to support [retrieving the local conversation list with custom filters](conversation_list.html#获取本地所有或筛选的会话).
- [EasyIM SDK] Added `cleanConversationsMemoryCache` to [clear all conversations from local memory](conversation_list.html#clear-conversations-from-memory) and release memory.
- [EasyIM SDK] Added `EMOptions#autoLoadConversations` to [configure whether all conversations in the database are automatically loaded into the cache after automatic login succeeds](conversation_list.html#一次性获取本地所有会话).
- [EasyIM SDK] Added `recallMessageWithMessageId:ext:completion:` to [support carrying custom information when recalling a message](message_recall.html#实现方法).
- [EasyIM SDK] Added the `recallMessageId` property to the `EMRecallMessageInfo` object in the `messagesInfoDidRecall` message recall event to [support notifying the recipient of a message recalled while offline](message_recall.html#设置消息撤回监听).

#### Fixes

- [EasyIM SDK] Fixed an issue where, when the Web client sent a conversation read receipt (channel ack) in a chat room, the mobile SDK added a conversation with an incorrect conversation type.

#### Major changes

Starting from v4.6.0, the new Swift-based `EaseChatUIKit` and `EaseChatDemo` are used. The legacy Demo and UIKit will gradually no longer be maintained. See:
- [UIKit documentation](https://doc.easyim.ai/uikit/chatuikit/ios/chatuikit_overview.html)
- Demo source code on [GitHub](https://github.com/easemob/chat-ios/tree/SwiftDemo) or [Gitee](https://gitee.com/easemob-code/easemob-demo-ios/tree/SwiftDemo)

## v4.5.0 Dev 2024-04-03

#### New features

- [EasyIM SDK] Added [message pinning](message_pin.html).
  - Added `EMChatManager#pinMessage:completion:` to pin a message.
  - Added `EMChatManager#unpinMessage:completion:` to unpin a message.
  - Added `EMChatManager#getPinnedMessagesFromServer:completion:` to retrieve pinned messages in a specified conversation from the server.
  - Added the `EMConversation#pinnedMessages` property to return all pinned messages in a conversation.
  - Added the `EMMessagePinInfo` class, which includes the user who pinned a message and the time it was pinned.
  - Added the `EMChatMessage#pinnedInfo` property to display message pinning details.
  - Added the `EMMessageListener#onMessagePinChanged` event. When a user pins a message in a chat group or chat room conversation, other members of the chat group or chat room receive this callback.
- [EasyIM SDK] Added support for [retrieving chat room roaming messages](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server).
- [EasyIM SDK] Added `EMChatManager#markAllConversationsAsRead` to [mark all unread messages in all conversations as read](conversation_unread.html#将所有会话的未读消息数清零).
- [EasyIM SDK] The message editing callback `EMChatManagerDelegate#onMessageContentChanged:operatorId:operationTime` can now return [custom messages edited through the RESTful API](/document/server-side/message_modify.html).

#### Improvements

- [EasyIM SDK] Added support for [forwarding a single message](message_forward.html#forward-a-single-message) using the message body. Attachments in attachment messages do not need to be uploaded again.
- [EasyIM SDK] Reduced the number of chat group detail retrieval operations when receiving a large number of chat group member event notifications in some scenarios.
- [EasyIM SDK] [The number of chat room members is now updated as members join or leave](room_manage.html#update-the-chat-room-member-count-in-real-time), making the count more timely and accurate.
- [EasyIM SDK] Improved error messages for Token login to make them more specific.
- [EasyIM SDK] Improved the SDK's internal logic for randomly selecting a server address, increasing the request success rate.
- [EasyIM SDK] Optimized the timeout for joining and leaving chat rooms.
- [EasyIM SDK] Optimized reconnection after connection failures in some scenarios.


## v4.4.1 Dev 2024-03-06

#### New features

- [EasyIM SDK] Added the privacy manifest `PrivacyInfo.xcprivacy` to the SDK.

#### Fixes

- [EasyIM SDK] Fixed an occasional crash after calling `EMChatManager#updateMessage` when the `ext` extension field of the same message was modified repeatedly under extreme conditions.

## v4.4.0 Dev 2024-01-30

#### New features

- [EasyIM SDK] Added [EMChatManager#deleteAllMessagesAndConversations:completion:](message_delete.html#清空聊天记录) to clear the current user's chat history, including messages and conversations, with the option to also clear chat history from the server.
- [EasyIM SDK] Added [EMChatManager#loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:scope:completion:](message_search_local.html#根据搜索范围搜索所有会话中的消息) and [EMConversation#loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:scope:completion:](message_search_local.html#根据搜索范围搜索当前会话中的消息). When searching for messages by keyword, you can select a search scope, such as message content only, message extension information only, or both message content and extension information.
- [EasyIM SDK] Added the [EMOptions#useReplacedMessageContents](message_send.html#发送消息前的内容审核) switch. When this switch is enabled, if content moderation replaces content when a message is sent, the sender can retrieve the replaced content.
- [EasyIM SDK] Added the [EMOptions#includeSendMessageInMessageListener](message_send.html#发送文本消息) switch. When this switch is enabled, successfully sent messages are included in the `messagesDidReceive` callback.
- [EasyIM SDK] Added the [EMOptions#regardImportMessagesAsRead](message_retrieve.html#从服务器获取指定会话的消息) switch. When this switch is enabled, messages imported through the [server-side API](/document/server-side/message_import_single.html) are marked as read after they are [retrieved through message roaming](message_retrieve.html#从服务器获取指定会话的消息) on the client, and `EMConversation#unreadMessagesCount` does not change. When this switch is disabled, `EMConversation#unreadMessagesCount` increases.

#### Improvements

- [EasyIM SDK] The mute-all status of a chat group (`EMGroup#isMuteAllMembers`) is now stored in the local database and can be retrieved directly from local storage at the next login.
- [EasyIM SDK] Fixed duplicate attachment uploads when forwarding a combined message.

#### Fixes

- [EasyIM SDK] Fixed duplicate calculation of the chat group member count in some scenarios.
- [EasyIM SDK] Fixed an SQL statement error caused by the single quotation mark `‘` in a message search keyword.
- [EasyIM SDK] Fixed an occasional crash in the data reporting module.
- [EasyIM SDK] Fixed an occasional crash caused by multiple threads calling `EMClient.sharedClient.chatManager.addDelegate` at the same time.
- [EasyIM SDK] Fixed an occasional Token binding failure when binding an APNs Token.

## v4.3.0 Dev 2023-12-22

#### New features

[EasyIM SDK] Added support for [conversation tags](conversation_mark.html).
- `EMChatManager#addConversationMark:completion`: [Adds a conversation tag](conversation_mark.html#标记会话).
- `EMChatManager#removeConversationMark:completion`: [Removes a conversation tag](conversation_mark.html#取消标记会话).
- `EMChatManager#getConversationsFromServerWithCursor:filter:completion`: [Retrieves a paginated conversation list from the server by conversation tag](conversation_mark.html#根据会话标记从服务器分页查询会话列表).
- `EMConversation#marks`: [Retrieves all tags of a single local conversation](conversation_mark.html#add-conversation-tags).
- `multiDevicesConversationEvent#EMMultiDevicesEventConversationUpdateMark`: [Conversation tag event in a multi-device scenario](multi_device.html#monitor-multi-device-events). When the current user updates conversation tags on one logged-in device, including adding or removing tags, the other logged-in devices receive this event.

#### Improvements

- [EasyIM SDK] Removed the FPA feature to reduce the SDK size.
- [EasyIM SDK] Increased the size of each log file from 2 MB to 5 MB.
- [EasyIM SDK] Improved attachment uploads for attachment messages by adding multipart upload support.

## v4.2.0 Dev 2023-11-13

#### New features

- [EasyIM SDK] Added [friend remarks](user_relationship.html#set-friend-remarks).
- [EasyIM SDK] Added `getAllContactsFromServerWithCompletion` and `getContactsFromServerWithCursor` to [retrieve the friend list from the server all at once or by page](user_relationship.html#retrieve-the-friend-list-and-friend-information). Each friend object contains the friend's user ID and friend remarks.
- [EasyIM SDK] Added `getContact` to [retrieve a single friend's user ID and friend remarks locally](user_relationship.html#read-the-friend-list-locally).
- [EasyIM SDK] Added `getAllContacts` to [retrieve the friend list from local storage by page](user_relationship.html#read-the-friend-list-locally). Each friend object contains the friend's user ID and friend remarks.
- [EasyIM SDK] Added the `EMChatMessage#broadcast` attribute to determine whether a message is a global chat room broadcast message. You can [send a global chat room broadcast message by calling the REST API](/document/server-side/broadcast_to_chatrooms.html).
- [EasyIM SDK] Added `EMGroupManager#getJoinedGroupsCountFromServerWithCompletion` to [retrieve from the server the number of chat groups the current user has joined](group_manage.html#查询当前用户已加入的群组数量). 
- [EasyIM SDK] Added [error code 706](error.html), `EMErrorChatroomOwnerNotAllowLeave`, indicating that the chat room owner is not allowed to leave the chat room. If `EMOptions#canChatroomOwnerLeave` is set to `false` during initialization, this error is reported when the chat room owner calls `leaveChatroom` to leave the chat room.
- [EasyIM SDK] Added the `EMOptions#loadEmptyConversations` property to configure during initialization whether empty conversations can be returned when retrieving the conversation list.
- [EasyIM SDK] Added the `decliner` and `applicant` parameters to the `EMGroupManagerDelegate#joinGroupRequestDidDecline:reason:decliner:applicant:` callback for a rejected request to join a chat group. They represent the user IDs of the applicant and the user who rejected the request.  
- [EasyIM Demo] Friend remarks can now be added and modified on the friend details page.

#### Improvements

- [EasyIM SDK] Unified Agora Token and EaseMob Token login. The `EMClient#loginWithUsername:agoraToken:` API is deprecated; use `EMClient#loginWithUsername:token` for both. In addition, callbacks have been added for EaseMob Token expiration and upcoming expiration. `EMClientDelegate#tokenDidExpire` and `EMClientDelegate#tokenWillExpire` are now also returned when an EaseMob Token has expired or half of its validity period has elapsed.
- [EasyIM SDK] Improved retry logic when sending messages.
- [EasyIM SDK] Improved database upgrade logic.

#### Fixes

- [EasyIM SDK] Fixed an issue where the SDK reconnected 2 times when the network recovered.

## v4.1.1 Dev 2023-8-03

#### Fixes

[EasyIM SDK] Fixed an issue where the message body lacked the `from` attribute when an offline user got online and retrieved historical messages after the message was edited.

## v4.1.0 Dev 2023-7-27 (Development version)

#### New features

- [EasyIM SDK] Added support for [sending](message_send_.html#发送合并消息) and [receiving combined forwarded messages](message_receive.html#接收合并消息):
    - Added the combined message type `EMMessageBodyTypeCombine`.
    - Added the message body class `EMCombineMessageBody`.
    - Added `EMChatManager#downloadAndParseCombineMessage` to download and parse a combined message.
- [EasyIM SDK] Added [message editing](message_modify.html):
    - Added `EMChatManager#modifyMessage` to edit a message.
    - Added the `EMChatManagerDelegate#onMessageContentChanged` callback. After a message is edited, the recipient receives this callback.
- [EasyIM SDK] Added support for [customizing the device platform and name](multi_device.html#set-the-login-device-name):
    - Added the `EMOptions#customOSType` property to set a custom platform code.
    - Added the `EMOptions#customDeviceName` property to set a custom device name for the current device.
- [EasyIM SDK] Added the `EMClientDelegate#userAccountDidLoginFromOtherDevice:(NSString*)deviceName` callback.<br/>
Deprecated the `EMClientDelegate#userAccountDidLoginFromOtherDevice` callback.<br/>
After the device name is set, if a logged-in device is forcibly logged out because the number of login devices has reached the limit when another device logs in, the kicked device receives the `EMClientDelegate#userAccountDidLoginFromOtherDevice:(NSString*)deviceName` callback. The callback contains the custom name of the device that caused it to be kicked offline.
- [EasyIM SDK] Added the following methods to support user Tokens:
    - `EMClient#getLoggedInDevicesFromServerWithUserId`: Retrieves the list of online devices logged in to the specified account.
    - `EMClient#kickDeviceWithUserId`: Kicks a specified device logged in to the specified account offline.
    - `EMClient#kickAllDevicesWithUserId`: Kicks all devices logged in to the specified account offline.
- [EasyIM UIKit] Added message quoting.
- [EasyIM UIKit] Added message editing.
- [EasyIM app] Added previews for URLs in messages.

#### Improvements

- [EasyIM SDK] Improved the logic for selecting access addresses with different priorities when logging in to the EasyIM server.

#### Fixes

- [EasyIM SDK] Fixed an occasional crash when calling `EMChatManager#deleteMessagesBeforeTimestamp and EMConversation#removeMessages(long,long)`.
- [EasyIM SDK] Fixed an occasional crash when an API was called while not logged in.
- [EasyIM SDK] Fixed an occasional incorrect attachment path for file messages on the ARM 64 simulator.
- [EasyIM app] Fixed an occasional UI refresh crash in the Demo.

## v4.0.3 Dev 2023-6-19

#### New features

- [EasyIM SDK] Added `IEMChatManager#getConversationsFromServerWithCursor:pageSize:completion:` to [retrieve conversations from the server](conversation_list.html#从服务器分页获取会话列表). The original APIs `getConversationsFromServer` and `getConversationsFromServerByPage:pageSize:completion:` are marked as deprecated.
- [EasyIM SDK] Added support for pinning server-side conversations:
    - Added `IEMChatManager#pinConversation:completionBlock:` to [pin or unpin a server-side conversation](conversation_pin.html#置顶-取消置顶会话).
    - Added `IEMChatManager#getPinnedConversationsFromServerWithCursor:pageSize:completion` to [retrieve pinned server-side conversations](conversation_pin.html#获取服务端的置顶会话列表).
- [EasyIM SDK] Added `IEMChatManager#getAllConversations:` to [retrieve the sorted conversation list from local storage](conversation_list.html#获取本地会话).
- [EasyIM SDK] Added support for [sending targeted messages](message_target.html) in chat groups or chat rooms.

#### Improvements

- [EasyIM SDK] Improved slow loading of conversations from the local database when there are too many messages during login.
- [EasyIM SDK] Added support for the arm64 simulator platform.

#### Fixes

- [EasyIM UIKit] Fixed an issue where the original image was not sent when `compressionRatio` was set to 1.0 for an image message.

## v4.0.2 Dev 2023-4-26

#### New features

- [EasyIM SDK] Added Reaction callback operation types.
- [EasyIM SDK] Added `EMChatManager#fetchMessagesFromServerBy` to [retrieve historical messages in a specified conversation from the server by page based on the message retrieval parameter configuration API (`EMFetchServerMessagesOption`)](message_retrieve.html#从服务器获取指定会话的消息). `EMFetchServerMessagesOption` includes parameters such as the start timestamp, message type, and message sender.
- [EasyIM SDK] Added `EMConversation#removeMessagesStart` to delete messages within a specified time period from the local database.
- [EasyIM SDK] Added [error code 510 `EMErrorMessageSizeLimit`](error.html), which is reported when the message body exceeds the size limit while sending a message.
- [EasyIM SDK] Added [error code 8 `EMAppActiveNumbersReachLimitation`](error.html), which is reported when the app's number of daily active users (DAU) or monthly active users (MAU) reaches the limit.
- [EasyIM Demo] Added support for mentioning specified users in a group chat when sending a message.


#### Improvements

- [EasyIM SDK] The [chat room details update callback chatroomSpecificationDidUpdate](room_manage.html#监听聊天室事件) now returns the updated information.
- [EasyIM SDK] Improved the implementation of `loadMessagesWithKeyword` so that global keyword searches support custom messages.
- [EasyIM SDK] Improved log callback logic.
- [EasyIM SDK] Removed ECB encryption from the code.

## v4.0.1 Dev 2023-3-16

#### New features

- [EasyIM SDK] Added [custom chat group member attributes](group_members.html#管理群成员自定义属性) and [custom attribute update events](group_manage.html#监听群组事件), allowing chat group members to set and retrieve attributes such as nicknames and avatars within a chat group.
- [EasyIM SDK] Added the `EMChatMessage#deliverOnlineOnly` property to deliver messages only to online users. When this feature is enabled, messages are not delivered to offline users.
- [EasyIM Demo] Added support for modifying and displaying chat group member nicknames.

#### Improvements

[EasyIM SDK] Improved chat room join and leave implementations to enhance performance.

## v4.0.0 Dev 2023-2-6

#### New features

[EasyIM SDK] [Added `EMChatManager#getConversationsFromServerByPage:pageSize:completion` to retrieve the server-side conversation list by page](conversation_list.html#从服务器分页获取会话列表).

#### Improvements

- [EasyIM Demo] [Improved the login method by changing it to phone number plus verification code](demo.html).
- [EasyIM CallKit] Upgraded RTC to version 4.1.1.

## v3.9.9 Dev 2022-11-29

#### New features

[EasyIM SDK] Added [message traffic statistics](message_traffic_statis.html#获取本地消息的流量统计信息).

#### Fixes

[EasyIM SDK] Fixed an SDK crash in extreme circumstances.

## v3.9.8 Dev 2022-11-8

#### New features

- [EasyIM SDK] Added [chat room message priority](message_send.html#聊天室消息优先级与消息丢弃逻辑).
- [EasyIM SDK] The `EMGroupManagerDelegate#groupSpecificationDidUpdate` callback triggered after chat group information is updated now includes the updated chat group information.

#### Improvements

[EasyIM SDK] Fixed an inconsistency between messages in memory and in the database caused by calling `updateMessage` in some scenarios.

## v3.9.7.1 Dev 2022-9-30

#### New features

[EasyIM SDK] Added the `area` property to the `EMOptions` class to limit the range of edge nodes to connect to.

#### Improvements

[EasyIM SDK] Improved the communication protocol to reduce data volume.

#### Fixes

- [EasyIM SDK] Fixed incorrect data statistics.
- [EasyIM SDK] Fixed a crash caused by logging in extremely rare scenarios.
- [EasyIM SDK] Fixed a crash caused when full-path acceleration (FPA) was enabled.

## v3.9.6.1 Dev 2022-9-21

#### Improvements

- [EasyIM SDK] Improved the chat room custom attribute update callback `onAttributesUpdate` to return a collection of successfully modified chat room custom attributes.
- [EasyIM SDK] Improved the chat room custom attribute removal callback `onAttributesRemoved` to return an array of keys for chat room custom attributes that were successfully removed.
- [IMKit] Voice playback now uses media volume.

## v3.9.6 Dev 2022-9-16

#### New features

- [EasyIM SDK] Added [chat room custom attributes](room_attributes.html).
- [EasyIM SDK] Added the `EMLogDelegate` class to implement user log callbacks.

#### Improvements

[EasyIM SDK] Improved roaming message retrieval performance.

#### Fixes

- [EasyIM SDK] Fixed an issue where a large number of messages could not be received during synchronization or retrieval in a few scenarios.
- [Demo] Fixed some Demo bugs.

## v3.9.5 2022-8-2

#### New features

- [EasyIM SDK] Added the chat group disabled status, the isDisabled property, to chat group details. Developers must set this property on the server.
- [EasyIM SDK] Pre-delivery callback: When message sending fails, the error description returned to the app user now includes your custom error information.
- [EasyIM SDK] Added error code 1101: EMErrorPresenceCannotSubscribeSelf.

#### Improvements

- [EasyIM SDK] Improved the login process to shorten login time.
- [EasyIM SDK] Upgraded the message encryption algorithm from CBC to GCM.

#### Fixes

- [EasyIM SDK] Fixed a crash during unbinding at logout when no push certificate was configured.
- [EasyIM SDK] Corrected some misspelled APIs.
- [Demo] Fixed some Demo bugs.

## v3.9.4 2022-6-16

#### New features

- [EasyIM SDK] Added the [isOnlineState()](https://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_chat_message.html#a78d632fe28019bd04eaa9f9df8b94fd6) flag to received messages to indicate whether they are offline messages.
- [EasyIM SDK] Added the group message rate-limiting error code [EMError#MESSAGECURRENTLIMITING](error.html).
- [EasyIM SDK] Added the [EMPushManager#bindDeviceToken](https://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_client.html#abafb1f83bc8fd3f59043bc7dd6af8282) API for binding a device Token.

#### Improvements

- [EasyIM SDK] Improved message thread-related APIs and attributes. Compared with version 3.9.3, `EMChatThread` replaces `EMChatThreadInfo`, and the `EMChatThreadEvent` object replaces Chat Thread-related attributes in `EMChatThread`.
- [EasyIM SDK] The chat group invitation callback [EMGroupManagerDelegate#groupInvitationDidReceive:](https://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_group_manager_delegate-p.html#a7eb4d32b6730b232aad0492cc808f996) now returns the new chat group name (aGroupName) parameter value.
- [EasyIM SDK] Upgraded the network connection library.
- [EasyIM SDK] Added support for messages whose attachment is set to a remote address.

#### Fixes

- [EaseIMKit] Fixed an issue where the Reaction deletion API was called repeatedly.

## v3.9.3 2022-5-26

#### New features

- [EasyIM SDK] Added message threads (Message Thread).

#### Improvements

- [EasyIM SDK] Improved network connections to enhance network access performance.
- [EasyIM SDK] Improved the [roaming message retrieval API](message_retrieve.html#从服务器获取指定会话的消息) by adding a parameter that specifies the message retrieval direction.

## v3.9.2.1 2022-5-25

Fixed a dependency library issue when uploading v3.9.2 to the App Store.

## v3.9.2 2022-5-15

#### iOS SDK 3.9.2

##### New features:

- [EasyIM SDK] Added [message Reaction](reaction.html), allowing different responses to messages.
- [EasyIM SDK] Added the [reporting API](moderation.html) for content moderation.

##### Improvements:

- [EasyIM SDK] Improved retrieval of server access points (dnsconfig).
- [EasyIM SDK] Improved data reporting.
- [EasyIM SDK] Replaced the openssl dependency with boringssl.

```
**Note: This version has a dependency library issue when uploaded to the App Store. Use v3.9.2.1.**
```

#### EaseCallKit 3.9.2

##### Improvements:

- [EaseCallKIt] Upgraded the Agora RTC SDK to version 3.6.2.

## v3.9.1.1 2022-4-27

#### Fixes:

- [EasyIM SDK] Fixed an occasional issue where retrieved historical messages could not be displayed properly.

## v3.9.1 2022-4-19

:::tip
Only V3.9.1 and earlier support private deployment.
:::

#### New features:

- [EasyIM SDK] Added [presence subscription](presence.html).
- [EasyIM SDK] Updated [translation](/value-added/translation/message_translation_ios.html) with an automatic translation API, allowing users to translate on demand and automatically translate messages when sending them.

#### Improvements:

- [EasyIM SDK] Shortened the message sending timeout.
- [EasyIM SDK] Added priority settings for the DNS server address list. HTTP and TCP requests are sent according to the priority of DNS server addresses during retries, improving the request success rate.

## v3.9.0 2022-02-23

#### iOS SDK 3.9.0

##### New features:

- [EasyIM SDK] Added the [API for unidirectionally deleting a server-side conversation](https://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_chat_manager-p.html#a4ac87045ad781e99c59acc271f9af433).
- [EasyIM SDK] Added multi-device synchronization of DND events.
- [EasyIM SDK] Push platform notifications now support retrieving extension fields, subsequent actions, badge settings, command messages, and other features. For details, see [iOS push integration](https://docs-im.easemob.com/push/apppush/iossdk).
- [EasyIM SDK] Added support for sending images in PNG format.
- [EasyIM SDK] Added error code [221 EMErrorUserNotOnRoster] for preventing non-friends from sending messages.

##### Improvements:

- [EasyIM SDK] Reduced the wait time for sending messages on weak networks.
- [EasyIM SDK] Renamed EMMessage to EMChatMessage to avoid conflicts with system classes.
- [EasyIM SDK] Removed the \_Nonnull constraint from the callback EMError parameter in IEMPushManager.
- [EasyIM SDK] Improved the Swift syntax representation of API calls.

#### Fixes:

- [EasyIM SDK] Fixed an issue where a message sending retry was interrupted by a successful connection event.
- [EasyIM SDK] Fixed SDK memory leaks.
- [EasyIM SDK] Fixed a crash caused by a negative time statistic.

#### EaseIM Demo 3.9.0

##### New features:

- [EasyIM SDK] Added an entry for creating a chat group under Contacts → Group Chats.
- [EasyIM SDK] Added a notification that non-friends cannot send messages.
- [EasyIM SDK] Added an example of retrieving push content in the push command message callback.

##### Improvements:

- [EasyIM SDK] Renamed EMMessage to EMChatMessage.
- [EasyIM SDK] Enabled the “Use custom server” switch on the server configuration screen.
- [EasyIM SDK] Added a registration error prompt when the number of registered users in the free edition exceeds 100.

##### Fixes:

- [EasyIM SDK] Fixed an issue where chat group data remained in a user's conversation list after the group owner removed and banned the user.
- [EasyIM SDK] Fixed an issue where the chat room list was not refreshed after a chat room was renamed.

#### EaseIMKit 3.9.0

##### New features:

- [EasyIM SDK] Deleting a server-side conversation now also deletes the local conversation.
- [EasyIM SDK] Added multi-device synchronization of DND events.
- [EasyIM SDK] Added support for sending images in PNG format.

##### Improvements:

- [EasyIM SDK] Renamed EMMessage to EMChatMessage.
- [EasyIM SDK] Improved prompts related to recalled messages.

##### Fixes:

- [EasyIM SDK] Fixed abnormal voice message playback animation.
- [EasyIM SDK] Fixed an issue where the “listened” property of a voice message became invalid after restart.

#### EaseCallKit 3.9.0

#### Improvements:

- [EaseCallKIt] Renamed EMMessage to EMChatMessage.

## v3.8.9.1 2021-12-30

#### Fixes:

- [EasyIM SDK] Added a strategy to rebuild the database when it fails to open in extreme circumstances.

## v3.8.9 2021-12-27

#### Added

- [EasyIM SDK] Added translation APIs.
- [EasyIM SDK] Added a building name field to location messages.
- [EasyIM SDK] Added an API for deleting messages by time.
- [EasyIM SDK] Added an API for retrieving the total number of messages in a conversation.

#### Fixes

- [EasyIM SDK] Fixed some crashes.
- [EasyIM SDK] Fixed a database encryption bug.
- [EasyIM SDK] Fixed an issue where automatic login was incompatible with uninstalling and reinstalling the app.

## v3.8.8 2021-12-06

#### Added

- [EasyIM SDK] Removed the process of checking whether the user is in a chat group after receiving a group message.

#### Improvements

- [EasyIM SDK] Improved API naming.
- [EasyIM SDK] Updated the push Token process to reduce the number of server requests.
- [EasyIM SDK] Improved login speed.
- [EasyIM SDK] Changed message updates to update only the cache, fixing an issue when retrieving historical messages.
- [EasyIM SDK] Changed the SDK to use HTTPS by default.
- [EasyIM SDK] Improved Agora Token expiration handling so that the Token is not unbound after it expires.

#### Fixes

- [EasyIM SDK] Fixed inaccurate timing of the Agora Token will-expire and expired callbacks.

**Note: In this version, after switching accounts, terminating the app, and reopening it, the database cannot be opened properly. Use v3.8.9.**

## v3.8.7 2021-10-22

SDK :

- Added: Token login supports automatic login. If you do not want to log in automatically, set EMOptions.isAutoLogin to NO during initialization.
- Supported versions: The minimum supported version has been raised to iOS 10.

## v3.8.6 2021-10-12

SDK :

- [EasyIM SDK] Enhanced the security of locally stored data.
- [EasyIM SDK] Enhanced the security of data in transit.
- Added: A separate error code is returned when a globally muted user sends a message.

```
**Starting with 3.8.6, we release Dev and Stable versions in parallel. Users can choose the version that meets their needs.**
```

- Stable: Based on a development version, provides stable features, continuously fixes bugs, and can be used to release apps.
- Dev: The latest version, includes the latest features, is released periodically, and can be used for evaluation.

## v3.8.5.2 2021-09-30

SDK :

- Fixed: Offline push notifications were received repeatedly.

## v3.8.5 2021-09-10

SDK:

- Added: Sensitive data in logs is masked.
- Improved: Device IDs are generated randomly.
- Fixed: The persistent connection was disconnected after the phone was connected to Wi-Fi and remained idle for 8 minutes.
- Fixed: DND chat groups were configured incorrectly.
- Fixed: The SDK occasionally crashed on startup.

EaseIMKit:

- Fixed: Animated images were not displayed on the chat screen.
- Fixed: The chat screen crashed when the last message was deleted.
- Fixed: The chat details screen crashed when chat history was cleared.

## v3.8.4 2021-08-02

SDK:

- Added: One-to-one DND.
- Added: A synchronous-thread API for loadMessage to load messages from the database.
- [EasyIM SDK] Added an error code indicating that a spam message was intercepted.
- Improved: The SDK is now provided as HyphenateChat.XCFramework.
- Fixed: A crash when the length of the deviceToken parameter was set to 0.

EaseIMKit:

- Fixed: A UI refresh issue with multiple voice messages.
- Added: A group read receipt is sent when entering the chat page from the conversation list.
- Improved: EaseIMKit can now be downloaded as source code from CocoaPods.
- Improved: EaseIMKit source code can now be integrated locally through a podspec.

EasyIM app:

- Added a one-to-one DND switch.

## v3.8.3.1 2021-07-08

SDK:

- Fixed: An immediate crash on cellular networks in iOS 14.0-related versions.
- Fixed: Automatic login failure caused any subsequent action in the EasyIM app to crash.
- Fixed: An uppercase roaming conversation ID caused repeated retrieval.
- Fixed: updateMessage did not update the cache.
- Fixed: An occasional crash when caching the chat group DND list.
- Removed: The device “Wi-Fi name” (wifissid) is no longer retrieved.
- Deprecated: Push-related APIs in groupManage. Use the related APIs in pushManage instead.

EasyIM app:

- Fixed: Swiping a member/admin in a chat group or chat room list deleted the member/admin directly.
- Fixed: A member/admin could not be unmuted after being muted in a chat group or chat room list.
- Fixed: Inaccurate blocklist and muted member counts on the chat group management page.
- Fixed: Sending a user card to retrieve user information caused a crash.
- Added: Integrated Bugly to collect unknown exceptions.

## v3.8.3 2021-06-05

SDK:

- This version contains only minor changes and is based on v3.8.3.1.

## v3.8.2 2021-06-05

SDK:

- Added user behavior data reporting.
- Added different error descriptions for an already logged-in user and a repeated login.
- Added an error description for a message intercepted by the pre-delivery callback.
- The app ID is uploaded during login.
- Fixed a bug where attachments could not be downloaded when no Localpath was available in the conversation list.
- Fixed garbled Chinese characters in user information on iOS.

EaseIMKit:

- Fixed a bug where long-pressing a custom cell did not return the current object.
- Fixed a bug where setting rounded corners on the chat page did not take effect.
- Fixed a bug where the loading indicator became stuck when switching pages during pull-to-refresh.
- Added permission restrictions for related features. For example, the camera cannot be used without camera permission.

EasyIM app:

- Fixed an app crash when a chat group was destroyed while the chat group member page was open.
- Added permission restrictions for related features, including audio and video features.

## v3.8.1 2021-04-13

SDK:

- [EasyIM SDK] Added APIs for setting and retrieving user attributes. For integration details, see [User attributes](userprofile.html).
- Added an API for writing app-layer information to log files.

EaseIMKit:

- Added EaseIMKit pre-delivery and post-delivery callback APIs. EaseIMKit text messages now recognize URLs and open them in a browser when tapped.
- Fixed the following issues: EaseIMKit chat page avatars now support URLs; EaseIMKit did not display the default thumbnail for video messages sent from the Web client; and rounded avatar settings in EaseIMKit did not take effect.

EasyIM app:

- Added storage and display of user attributes, including avatars and nicknames.
- Added sending and display of user card messages, implemented using custom messages.

EaseCallKit (2021-05-07):

- Changed how users join a Shengwang channel to use a numeric UID, adding interoperability with Mini Programs. `This is not interoperable with previous versions`. See the [EaseCallKit User Guide](easecallkit.html).

## v3.8.0 2021-02-27

SDK:

- In v3.8.0, the SDK was renamed HyphenateChat, only EasyIM features are released, and RTC features are removed.
- v3.8.0 supports the armv7, arm64, i386, and x86_64 instruction sets.
- [EasyIM SDK] Fixed a problem requesting a Token when the username was empty in extreme circumstances.

EaseIMKit:

- v3.8.0 uses the HyphenateChat SDK.
- Changed the method for creating a chat page instance to a class method.
- Added a parameter to the chat page data set refresh method to specify whether to insert data at the end of the current list.
- Added support for user avatar URLs on the chat page.
- Fixed an issue where the unread red dot did not disappear after tapping a voice message in a group chat.

EasyIM app:

- The EasyIM app depends on Shengwang RTC.
- The calling component has been modularized as EaseCallKit.
- Fixed an issue where pinning a group conversation in the conversation list and on the chat group details page was not synchronized.
- Fixed an issue where the other party's typing status was not displayed.
- Fixed a crash in the search feature.

Note:

- **To provide better services, starting with 3.8.0 the SDK no longer provides audio and video functionality. Instead, EaseCallKit provides a reference implementation based on the Agora SDK. Calls made using this solution are not interoperable with previous versions. Choose whether to use the new solution or continue using a previous version based on your circumstances.**
- In addition to being available as a remote library, EaseIMKit source code is also published. For details, see the [EaseIMKit User Guide](https://docs-im.easemob.com/im/ios/other/easeimkit).
- The first version of EaseCallKit has been released. For details, see the [EaseCallKit User Guide](https://docs-im.easemob.com/im/ios/other/easecallkit).

## v3.7.4 2021-02-04

SDK:

- Starting with v3.7.4, the armv7 and i386 instruction sets are no longer supported.
- Starting with v3.7.4, Bitcode is supported.
- Added APIs for sending and receiving conversation read receipts.
- Added an API for retrieving the conversation list from the server.
- Added an option for retrieving chat group members when retrieving chat group details.
- Added an API for searching custom messages for specified content.
- Fixed an occasional crash when push was configured without retrieving pushOptions.

EaseIMKit:

- Changed how the chat page receives its data source: An external data source is passed in, and EaseIMKit displays the data.
- Lowered the minimum supported version to iOS 10.0.
- Added a method for specifying whether to display the local user's typing status.

EasyIM app:

- Added conversation list retrieval for the first login after the app is installed for the first time.
- The chat page retrieves historical messages from the database/server and passes them to EaseIMKit as a data source for display.
- Enabled the switch for retrieving historical messages from the server.
- Fixed a black screen when switching local video during a one-to-one video call.
- Encapsulated the search feature so that it is not used as a category.

Note:

- In addition to being available as a remote library, EaseIMKit source code is also published. For details, see the [EaseIMKit User Guide](https://docs-im.easemob.com/im/ios/other/easeimkit).

## v3.7.3 2020-12-31

New features:

- Added RTC logs to facilitate troubleshooting.
- Uses the EasyIM app and the new IMKit.

Fixes:

- Fixed a permission issue when using the location API on iOS 14.
- Fixed inconsistencies between EMPushManager and the Android API.
- Added logs for repeated logins.
- Fixed an issue where members were not retrieved together with chat room details.

Note:

- In addition to being available as a remote library, EaseIMKit source code is also published. For details, see the [EaseIMKit User Guide](https://docs-im.easemob.com/im/ios/other/easeimkit).
- The new app, EaseIM App, uses a new Appkey. You cannot use a previous account to log in and must register again.

## v3.7.2 2020-10-30

New features:

- Error code USER_NAME_TOO_LONG is returned when a registered username exceeds 64 characters.
- Processes read acknowledgments synchronized from other devices to synchronize read status across multiple devices.

Fixes:

- Fixed a wired connection detection bug and possible inaccurate network detection during chat group operations.
- Improved the speed of joining chat rooms and chat groups and reduced the number of server requests.
- Fixed a crash caused by switching the speaker during an audio or video call.
- Fixed a crash caused by a permission issue when downloading attachments.
- Fixed a bug where the original group owner's permissions did not change after chat group ownership was transferred.
- Fixed inaccurate validation of chat group announcement length.
- Fixed an issue where chat group history could not be deleted in the Demo when the network was disconnected.
- Fixed an issue where users could not invite others to a public chat group that they created in the Demo.

## v3.7.1 2020-08-27

New features:

- Added an RTC API for prioritizing video clarity.
- Added an RTC API for setting the URL used to retrieve the cluster proxy.
- Added support for configuring PushKit push.
- The EasyIM Demo now supports custom ringtones for calls.

Fixes:

- Fixed an occasional failure to create a conference in the EasyIM Demo because the Token was empty.
- Fixed an issue where a local message query returned no results when a negative timestamp was passed.

## v3.7.0 2020-07-29

New features:

- Implemented RTC quality monitoring and reporting of RTC quality data.
- Added audio-only stream publishing with configurable audio parameters.
- Added an API for pushing multiple streams to a CDN.
- Added a custom recording API.
- Enabled the push option by default for 1v1 calls in the Demo.
- Added chat file preview to the Demo.
- Added callbacks for no video or audio data due to network or other exceptions.
- Added callbacks for sending and receiving the first frame of audio and video data.
- Added callbacks for recorded and played audio data.

Fixes:

- Fixed a callback issue when the other party disconnected from the network during an audio conference.
- Fixed incorrect packet loss statistics in a conference.
- Fixed an issue where an image forwarded by the other party was not displayed while the one-to-one chat page was open.
- Fixed an issue where the first cell on the friend selection page for forwarding a message could not be selected.
- Fixed a failure to forward images.

## v3.6.9 2020-06-23

New features:

- Added an API for whiteboard enable and disable interactions.
- Added a parameter for enabling and disabling interaction when creating a whiteboard.
- Added restrictions on desktop sharing streams.
- Added a callback for failed desktop stream publishing.
- Added a setting in the Demo for whether audio and video support Mini Programs.

Fixes:

- Fixed an issue where the iOS callee sometimes could not answer a one-to-one call.
- Fixed an issue where the other party's video displayed a black screen after leaving and returning to an ongoing conference.

## v3.6.8 2020-06-09

New features:

- Added support for attachment download redirection.
- Added support for throwing a distinct exception when an image is detected as noncompliant.

Fixes:

- Fixed an issue where thumbnails were not displayed for images sent by the current user during a chat.
- Fixed inaccurate UI display after changing chat group DND settings.
- Fixed a crash after receiving a custom message.

## v3.6.7 2020-05-15

New SDK features:

- Added support for cluster proxies.
- Implemented speaker on-stage and off-stage APIs in the SDK.
- Added mute management, including muting all members and specified members.
- Added support for configuring CDN stream pushing and custom layouts.
- Added support for setting a custom video resolution.

IM_DEMO changes:

- Changed audio and video conferences to use only normal conference mode.
- Fixed duplicate images when the chat page received images consecutively.
- Fixed an issue where the volume could not be adjusted when sending a voice message.
- Fixed incorrect sorting on the friend page because some Chinese characters were not recognized.
- Fixed inaccurate unread message counts in the conversation list and tab bar.
- Fixed a failure to forward an image message sent by the current user.
- Improved message sending without a network connection so that the message content is displayed immediately together with the sending status.

## v3.6.6 2020-04-08

New features:

- Added an RTC API for kicking users.
- Added an RTC API and callback for transferring the admin role.
- Added support for setting the maximum number of hosts, nickname, and extension when joining a room.

## v3.6.5 2020-03-13

New features:

- Added allowlist and mute APIs.
- Added an API for custom message types.
- Added APIs for creating and joining a whiteboard.
- Added the joinRoom API.
- Added error messages for an incorrect password when joining an audio or video conference or when the maximum number of hosts has been reached.

Fixes:

- Fixed an issue where automatic login did not take effect after it was configured.
- Fixed an issue where the callback was invoked multiple times during custom video input.
- Fixed an infinite loop caused by a permission issue when creating the database.
- Fixed an inaccurate reason returned when leaving a chat room while offline.

## v3.6.4 2020-02-12

New features:

- Added support for setting image watermarks in video calls.
- Added a parameter to the conference creation API to support mini programs. Mini programs are not supported by default.
- Added compatibility with the iOS 13 deviceToken.

Fixes:

- Fixed a black screen issue with the iPhone 7 front camera.

## v3.6.3 2020-01-03

New features:

- Added support for external audio input APIs.
- Added support for setting private RTC server APIs.

Updates:

- Reduced the long-lived connection timeout.

Fixes:

- Fixed desktop sharing bugs.
- Fixed some UI issues.

## v3.6.2 2019-11-13

New features:

- Added the chat group receipt API. This is a value-added service; contact the EasyIM business manager for activation.

Updates:

- Added support for H264 software encoding and decoding to improve audio and video call compatibility.
- For private deployment where dns is not enabled, the SDK does not attempt to retrieve the server list.
- Added key logs for audio and video functionality to facilitate troubleshooting.

Fixes:

- Improved audio and video stability on devices such as iPhone XR, XS, and XS Max.
- Fixed some crashes on iOS 13.
- Fixed some UI issues.

## v3.6.1 2019-08-02

New features:

- Added an API that allows a host to go off-stage.
- Added an API for globally searching local messages.
- Added the muteRemote API.

Fixes:

- Fixed inaccurate call status callbacks.
- Fixed a delay in displaying the size limit message for uploaded files that exceeded the limit.
- Fixed an issue where setting the maximum bitrate for one-to-one audio and video did not take effect.
- Fixed some Demo features.

## v3.6.0 2019-05-28

New features:

- Added conference attributes, which make it easier to use audio and video conferences in specific scenarios. For details, see the audio chat Demo.
- Added background audio for audio conferences. For details, see the audio chat Demo.
- Added corresponding error codes returned when an attachment is too large and when an attachment has expired or does not exist.
- Added parameters when initiating a call and creating a conference to specify whether to enable server-side recording and whether to combine streams during recording. You can query the recording on the server by recording ID.
- Added support for customizing the size of image message thumbnails.

Updates:

- Upgraded the audio and video engine, improving noise cancellation and performance and reducing call setup time.
- Temporarily removed on-device recording starting with version 3.6.0. Mobile clients can use SDK parameters to configure whether each call is recorded on the server. If the Web client also requires recording, contact the EasyIM business manager to enable recording on all clients. Once enabled, this feature takes precedence over the SDK parameter configuration.
- Improved the batch message saving method by acknowledging messages to the server after they are saved in a batch, fixing an issue where messages were not saved correctly in extreme scenarios.
- Corresponding error codes are returned when the audio and video service has not been activated or has an overdue balance when a call is initiated or a conference is created.
- Starting with v3.6.0, the SDK supports only iOS 9.0 and later.
- Changed the custom local video data API for one-to-one video. The old API is no longer supported.

Fixes:

- Fixed an issue where the message count did not increase correctly when saving messages.
- Fixed an issue where thumbnails could not be retrieved after upgrading from an older version to a newer version.

## v3.5.5 2019-05-16

Fixes:

- Fixed a bug where an exception during received-message storage prevented messages from being stored properly.

## v3.5.4 2019-03-27

New features:

- Updated to use the new UI.

Fixes:

- Fixed an issue where status settings prevented calls from connecting in some cases.
- When a disabled user logs in, the corresponding error code EMErrorServerServingForbidden is returned.

Improvements:

- Changed the file storage path.

## v3.5.3 2019-01-18

New features:

- Updated the login and registration UI.
- Added QR code scanning for quick login in the upper-right corner of the login and registration pages. For usage details, see: https://console.easemob.com/app-detail/integration

Fixes:

- Fixed a failure to send messages with an ID containing uppercase letters in some cases.
- Fixed an issue where logs could not be disabled in Debug mode.
- Fixed an issue where repeated automatic login configuration in settings became invalid.

## v3.5.2 2018-11-06

Improvements:

- Updated the UI for one-to-one and multi-user real-time audio and video in the Demo.
- Removed methods deprecated in EasyIM SDK 3.2.0 and earlier.

Fixes:

- Fixed a bug where, if there was no network during automatic login, the IDs retrieved for the user's logins on other devices included the current device's ID.
- Fixed a bug in the server list update when connection failed in certain cases.

## v3.5.1 2018-09-13

New features:

- Added the API [IEMConferenceManager updateConference:maxVideoKbps:] for dynamically changing the maximum video bitrate in multi-user real-time audio and video.
- Added separate audio recording for one-to-one real-time audio and video through [EMCallRecorderPlugin startAudioRecordWithCompletion:] and [EMCallRecorderPlugin stopAudioRecordWithCompletion:].

Fixes:

- Fixed: Audio issues after answering and ending a regular phone call during real-time audio and video.

Improvements:

- Removed Mode-related methods from multi-user real-time audio and video, such as [IEMConferenceManager mode].

## v3.5.0 2018-08-13

New features:

- To meet the needs of different scenarios, starting with v3.5.0, real-time audio and video conferences are divided into different types. Each type corresponds to a different scenario, allowing you to easily integrate real-time audio and video into your app or website. You can pass the following types when creating a conference:

```
   1. Communication: A standard communication conference supporting up to 6 participants. Every participant can speak and publish video freely. This conference type does not re-encode audio on the server and provides the best audio quality. It is suitable for scenarios such as telemedicine and online customer service.
   2. Large Communication: A large communication conference supporting up to 30 participants. Every participant can speak freely, and up to 6 participants can publish video. This conference mode mixes audio on the server and supports more speakers. It is suitable for scenarios such as large conferences.
   3. Live: An interactive video conference supporting up to 6 hosts and 600 audience members. Audience members can interact with hosts by connecting to speak. This conference type is suitable for scenarios such as online education and interactive live streaming.
```

Improvements:

- Improved multi-user real-time audio and video conferencing.

## v3.4.3 2018-07-18

New features:

- Added the “deliver only to online users” message property to reduce message volume. Currently, only CMD messages are supported. Set this property through EMCmdMessageBody.isDeliverOnlineOnly=YES.

## v3.4.2 2018-06-15

New features:

- Added support for inviting others to a multi-user real-time audio and video conference through messages.

Fixes:

- Fixed an occasional issue where video was not displayed on iOS after receiving video in a one-to-one video call.

**Note: To provide a high-quality, consistent audio and video experience, starting with version 3.4.1, 1v1 calls are no longer compatible with version 3.1.5 and earlier. Upgrade promptly.**

## v3.4.1 2018-05-16

Improvements:

- Improved reconnection speed with the server when switching from Wi-Fi to 4G.
- Improved real-time one-to-one calls.

New features:

- Added an audio and video weak-network detection callback.
- Added support for entering a verification message when joining a chat group.
- Added a callback for being kicked out of a chat room when disconnected.

**Note: To provide a high-quality, consistent audio and video experience, starting with version 3.4.1, 1v1 calls are no longer compatible with version 3.1.5 and earlier. Upgrade promptly.**

## v3.4.0 2018-04-04

New features:

- Implemented different modes of real-time audio conferencing. See [Multi-user audio and video conferencing](https://docs-im.easemob.com/im/ios/basics/multiuserconference).
- Added the ability to dynamically change the other party's real-time video display view through [IEMConferenceManager updateConference:streamId:remoteVideoView:completion:].

## v3.3.9 2018-02-11

New features:

- Implemented chat group message read receipts in the Demo layer. The sender defines a custom field in EMMessage.ext to indicate whether a read receipt is required, and the recipient implements the read receipt using a CMD message.

- Added a custom real-time video transmission data API to the SDK. Note 1: Before starting one-to-one custom video, set EMCallOptions.enableCustomizeVideoData to YES. Before starting default one-to-one video, ensure that EMCallOptions.enableCustomizeVideoData=NO. Note 2: For custom video, set EMCallSession.localVideoView.previewDirectly = NO. Note 3: In the Demo, “3.3.9 new custom video data” has been added before the relevant code.

Feature updates:

- Simplified the Demo by removing the red packet feature. In the UI, red packet-related operations have been removed from “More” at the bottom of the chat page.
- Removed the crash collection tool from the Demo and replaced it with Bugly.framework, located in ChatDemo-UI3.0/3rdparty.
- Improved reconnection logic, resolving service connection timeouts for some users after user migration and server attacks.

## v3.3.8 2018-01-24

New features:

- Added a service diagnostics API. In the Demo UI, it appears under “Settings-Debug-Server Diagnostics”.

- Added audio bitrate configuration through [EMCallOptions maxAudioKbps].

- Added new error codes for reaching server limits when creating users, chat groups, and chat rooms.

Feature updates:

- The semantics of [EMClient isLoggedIn] have changed. It previously indicated whether the login operation had been completed; it now indicates whether login has ever succeeded.

## v3.3.7 2017-11-30

New features:

- The Demo now supports iPhone X.

Fixes:

- Fixed an issue where messages could not be loaded correctly when they had the same timestamp.
- Fixed inconsistent ordering of cmd and regular messages caused by offline messages in some scenarios.

## v3.3.6 2017-11-03

New features:

- Added multi-user audio and video.
- Added the “Whether to implement message attachment upload and download yourself” setting [EMOptions isAutoTransferMessageAttachments].
- Added the “Whether to automatically download image and video thumbnails and voice messages” setting [EMOptions isAutoDownloadThumbnail].

Fixes:

- Fixed an issue where, after a one-to-one real-time audio and video call connected and one party muted, the other party's subsequent mute operation did not take effect.
- When using the SDK download API, if a file with the same name already exists locally, a number is appended to the original filename to create the new filename.
- Fixed an issue where automatic login could not retrieve conversations when the network was disconnected.
- Fixed an issue where the progress callback returned 100% the first time the SDK upload API was used.

## v3.3.5 2017-10-23

New features:

- Increased transport security.
- Added an advertising plugin that can collect user information.

Improvements:

- Added an API for configuring dns for private deployment.
- Improved private deployment reconnection logic.
- Limited the username length to 255.
- APIs for features that require server activation now return SERVICE_NOT_ENABLED(505).
- Added the i386 library to resolve compilation issues when profiling in the simulator.

Fixes:

- Fixed an occasional message sending failure when switching between 4G and wifi.

## v3.3.4 R1 2017-08-09

Fixes:

- Fixed a bug where sending a message failed when the username contained an underscore.

## v3.3.4 2017-08-04

New features:

- Added: The same account can log in on a PC and mobile device, and the two devices can send messages to each other.
- Added: Message roaming for retrieving historical messages from the server by page.
- Added: Message recall, a value-added feature.

Fixes and improvements:

- Improved deletion of a group of conversations so that the callback is returned only once.
- The iOS SDK no longer supports i386.
- Fixed audio permission detection when recording an audio file.

## v3.3.3 2017-07-21

New features:

- Added support for logging in to the same account on multiple devices and synchronizing messages and friend and chat group operations between those devices. Multi-device login is a value-added service; contact the EasyIM business manager for activation.
- Added: A size property for shared chat group files.
- Added an API for retrieving the list of devices logged in to the same account, with the option to kick a device offline.

Fixes:

- Removed the 10 MB size limit for transferring attachments.
- Fixed a bug where no information was included when inviting chat group members.
- Fixed an issue where all joined chat groups had to be retrieved before performing chat group operations.
- Fixed a bug where an attachment download was still reported as successful when the attachment path did not exist or could not be opened.
- Fixed a crash when switching accounts in some scenarios.
- Fixed an issue where the last-page cursor was not updated when retrieving chat group members.
- Fixed an issue where a conversation could not be deleted when YES was passed to the asynchronous friend deletion API.

## v3.3.2 2017-05-18

New features:

- Added: APIs for modifying and retrieving chat group announcements, uploading, downloading, and deleting shared chat group files, and modifying chat group extension information. For API details, see [Chat group management](https://docs-im.easemob.com/im/ios/basics/group).
- Added: APIs for modifying and retrieving chat room announcements. For API details, see [Chat room management](https://docs-im.easemob.com/im/ios/basics/chatroom).
- Added: An API for configuring DND for chat groups in batches.

Fixes:

- Fixed a bug where getAllConversations sometimes returned an empty result.
- Fixed a timeout when retrieving joined chat groups.

## v3.3.1 2017-04-07

New features:

- Added: Token-based login.
- Added callbacks for chat group members joining and leaving chat groups.

Improvements:

- Changed red packet integration to use CocoaPods and added support for Alipay and JD Pay.

Fixes:

- insertMessage could crash in rare cases.
- [EMMessage setTo:] assigned an incorrect value.
- The chat room details API [IEMChatroomManager fetchChatroomInfo:includeMembersList:error:] could not retrieve members when YES was passed as the second parameter.
- admin and owner appeared in the memberlist of chat groups and chat rooms when v2.x and v3.x were interoperating.
- The corresponding EMConversation did not update its latest message after a message was sent successfully.

## v3.3.0 2017-03-07

New features:

- Added: Refactored chat groups and added a series of new APIs. For details, see [iOS 3.3.0 API changes](https://docs-im.easemob.com/im/300iosclientintegration/3.3.0apichange).
- Added: An API for retrieving the SDK log path. It compresses log files into a .gz file and returns the path of the gz file: [EMClient getLogFilesPath:].
- Updated: To use video call recording, you must call [EMVideoRecorderPlugin initGlobalConfig] before starting the call.

Improvements:

- Improved handling of DNS hijacking.
- Reduced the wait time for message resending when switching networks.

Fixes:

- Fixed the packet loss rate for audio and video calls. Previously, the number of lost packets was returned.
- Fixed a crash on iPhone 6s when the iOS dynamic library used H264 encoding.
- Fixed a crash during interoperability between new and old versions of real-time audio and video.

## v3.2.3 2016-12-29

New features/improvements:

- Added: For real-time one-to-one audio and video, when offline push is configured for an offline callee, a callback is returned if the callee is offline, allowing users to customize offline message push.
- Updated: The SDK supports Bitcode.
- Updated: The SDK uses a dynamic library. For easier integration and development, the SDK supports i386, x86_64, armv7, and arm64. When uploading an app that uses the dynamic library to the App Store, remove i386 and x86_64. See [Dynamic library integration](https://docs-im.easemob.com/im/ios/sdk/import).
- To make the SDK more concise and easy to use, deprecated APIs will be removed over the next 3–5 versions.

Red packets:
New features:

- Small random red packets.
- Added password changes to the merchant backend.

Improvements:

- Changed user verification after binding a card from four elements to two elements.
- Standardized UI display between iOS and Android.
- Improved the payment process.
- Improved the SDK registration process.
- Removed XIB.
- Added parameter checks during integration.
- Improved the risk strategy.

Fixes:

- Fixed SDKToken registration failures.
- Fixed missing parameters when sending red packets.
- Fixed garbled Emoji display.
- Fixed possible false error reports for payment passwords.
- Fixed an incorrect minimum red packet limit configured by merchants.
- Fixed incorrect display order in balance details.
- Changed the red packet claiming process to depend on backend data.
- Fixed the copy displayed when branch information was returned empty.

## v3.2.2 R2 2016-12-14

New features/improvements:

- Fixed an issue in v3.2.2 where no data was returned in some cases when HTTPS-only mode was configured.

## v3.2.2 2016-12-08

New features/improvements:

- The SDK now meets Apple ATS requirements. The usingHttpsOnly parameter was added to EMOptions and defaults to YES.
- Changed the friend deletion logic by adding an option for whether to delete the conversation.
- Fixed an issue where the call-end reason was not displayed correctly when the callee was offline.
- Added new APIs to audio and video EMCallOptions for specifying whether to use a fixed resolution, the maximum video frame rate, and the minimum video bitrate. See the [API documentation](https://www.easemob.com/apidoc/ios/chat3.0/index.html) for details.
- Changed the audio and video EMCallOptions API from videoKbps to maxVideoKbps.

## v3.2.1 2016-11-12

New features/improvements:

- Added paginated chat room list retrieval.
- usingHttps in EMOption now defaults to YES.

bug fix:

- Fixed compilation warnings in the Lite SDK.

## v3.2.0 2016-10-15

Audio and video include extensive upgrades and improvements. For details, see the integration documentation.

- Enhanced the adaptive video quality algorithm to dynamically adjust definition based on the network environment.
- Improved the voice algorithm for clearer calls.
- Added HD video support for more detailed image quality.
- Added support for switching freely between landscape and portrait orientations.
- Added support for fit and fill image modes.

Red packet improvements:

- Added person-to-person transfers.
- Added a sound effect for opening red packets.

Other improvements:

- Added compatibility with iOS 10.
- Actions beginning with “em\_” and “easemob::” in cmd messages are now reserved internal fields.
- Fixed inaccurate conversation unread message counts in certain cases.
- Fixed incorrect friend retrieval in certain cases.
- Fixed a bug where joining a chat room immediately after login failed in some cases.
- A message is displayed if the file content is too small when sending voice or video.
- Improved database read performance.

## v3.1.5 2016-8-26

New features:

1. Improved SDK stability.
2. Removed dependent libraries (libcrypto.a, libcurl.a, and libssl.a).
3. Improved database migration efficiency from the v2.x SDK.
4. Further standardized API naming. We recommend using the new APIs. For details, see the [API documentation](https://www.easemob.com/apidoc/ios/chat3.0/index.html).

bug fix:

1. Fixed a real-time video display issue.

## v3.1.4 2016-7-08

New features:

1. Added APIs for retrieving chat room members and the number of members.
2. Added the conversation API - (BOOL)appendMessage:(EMMessage \*)aMessage.
3. Improved SDK stability.
4. Added @ mentions in group messages, implemented in EaseUI and the Demo.

- Supports @all through “ext”:{“em_at_list”:“ALL”}.
- To @ one or more members, use “ext”:{“em_at_list”:[“username1”,“username2”]}.
- If the user configures push notifications to display message details, the mentioned user receives the push notification “XXX mentioned me in the chat group”.

Red packets:

1. Added exclusive red packets in chat groups, which only specified users can claim.
2. Added Alipay support.
3. Added system-sent chat group red packets, for which users can see only their own claim status.
4. Added support for binding multiple bank cards and unbinding them.
5. Added top-ups to the balance page.
6. Redesigned the balance page.
7. Added support for uploading identity card photos for third-channel verification.
8. Refined red packet UI details, including dual titles and details on each page, and standardized Android and iOS copy.
9. Organized error messages and added dialog-based guidance for key errors.
10. Improved server-side performance severalfold.
11. Improved statistical items on the red packet data platform.
12. Other improvements: Improved the code structure, separated third-party libraries to reduce conflicts with developer libraries, sent command messages only to users sending red packets instead of all chat group users, improved Token retrieval and update mechanisms, and fixed several bugs.

## v3.1.3 2016-5-27

New features:

1. Added camera switching during real-time video calls to the SDK.
2. The SDK now supports IPv6.
3. Messages can now be sorted by local time or server time.
4. The Demo now supports sending red packets in one-to-one and group chats.

bug fix:

1. Fixed a delay when automatically accepting friend requests.

SDK adjustments:

1. Separated third-party dependencies (libssl.a, libcrypto.a, and libcurl.a) from the SDK static library.

## v3.1.2 2016-4-22

New features:

1. Added message search by message type or keyword.
2. Changed the API by adding a direction parameter to the message loading method.
3. Improved the deviceToken binding logic.

bug fix:

1. Fixed an issue where the other party received garbled characters or a blank message when a system emoji was sent.

## v3.1.1 2016-4-01

New features:

1. Added weak-network and network-disconnection detection to audio and video.
2. Added audio and video stream pause and resume functionality to audio and video.
3. Added recording to audio and video.
4. Images are now compressed by default when sent, reducing data usage.

bug fix:

1. Fixed an iOS Demo crash in some cases after it entered the background.

## v3.1.0 2016-3-06

New features:

1. Added audio and video functionality, allowing users to establish one-to-one audio and video calls.

bug fix:

1. Fixed extension field parsing.
2. Fixed an issue where an ID was displayed incompletely in a conversation when the user ID contained an underscore.

## v3.0.1 2016-2-26

bug fix:

1. Fixed an app crash on startup on some devices when the network was abnormal.
2. Fixed occasional deviceToken binding failures.
3. Fixed an issue when setting the maximum number of chat group members.
4. Fixed a Demo crash when adding a friend to the blocklist.

## v3.0.0 2016-2-19

1. New communication protocol: A new private protocol based on message synchronization is more stable and uses less data on unstable networks, ensuring reliable, ordered, real-time message delivery and providing greater security. It also provides better extensibility and will support more integration and device synchronization scenarios.
2. New SDK: The SDK has been comprehensively refactored to better encapsulate the core communication module, simplify APIs, provide a clearer structure and easier integration, and improve login speed and reliability on weak networks.
