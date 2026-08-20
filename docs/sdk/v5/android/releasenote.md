# Android EasyIM SDK Release Notes

## v5.0.0 Dev

This version was released on August 15, 2026.

This section highlights feature and behavior changes. For details about API removals, renames, and replacements, see the [Android EasyIM SDK 5.0.0.0 Migration Guide](migration_guide.html).

#### Important changes

**Data synchronization and local data access**

The SDK adds a unified data synchronization mechanism. The app can configure the data types to automatically synchronize after login, including conversations, friends, and joined chat groups, and monitor synchronization progress through unified synchronization status callbacks.

Opening the database and synchronizing data from the server are separate stages. The app can handle them as follows:

1. **Configure the synchronization scope**: Call `EMOptions#setDataSyncType(EnumSet<EMDataSyncType>)` to configure the data types to automatically synchronize after login, including conversations, friends, joined chat groups, or no data. You can combine multiple data types as bit flags. We recommend that you explicitly configure this setting before calling `EMClient.getInstance().init(context, options)`.
2. **Read local data**: The `EMConnectionListener#onDatabaseOpened(String username)` callback indicates that the local database for the current account has been opened. After receiving this callback, you can read local data without waiting for post-login synchronization to finish, which helps accelerate the initial screen display during a cold start.
3. **Monitor server data synchronization**: Use `EMConnectionListener#onDataSyncStart(EMDataSyncType type)` and `EMConnectionListener#onDataSyncFinish(EMDataSyncType type, int errorCode)` to monitor when synchronization of a specified data type starts and finishes.
4. **Read the latest data after this synchronization**: To display the latest data synchronized from the server after this login, wait until the corresponding `onDataSyncFinish(...)` callback reports success. Then read the local conversations, friends, or joined chat groups and refresh the UI.

**Chat group configuration model refactoring**

Chat group configuration has changed from a single style enumeration to multiple independent fields. After creating a chat group, you can also update specific settings as needed.

- `EMGroupConfigs` stores chat group configuration values, including `isPublic`, `joinApprovalRequired`, `allowInvites`, `maxUsers`, `inviteNeedConfirm`, and `extField`.
- `EMGroupConfigsType` identifies the configuration items to update.
- The chat group creation and configuration update APIs now use the new configuration model.

**Message read receipts and unread count management**

Message receipts and unread-count clearing now use a unified batch-processing mechanism for both one-to-one and group chats.

1. Message read receipts

- Read receipts are sent in batches and processed uniformly for one-to-one and group chats.
- Whether a read receipt is required is controlled separately for each message by `EMMessage#setIsNeedReadReceipt(true)`.
- Read receipts for one-to-one and group chats are uniformly received through `EMMessageListener#onMessageReadReceipts(List<EMMessageReadReceipt>)`.
- Group chats support batch queries for message read receipt summaries.

2. Conversation unread count management

- The SDK provides the total number of unread messages in local conversations. This count excludes chat room conversations and conversations whose push reminder type is not `EMPushRemindType.ALL`.
- After you clear the local unread count for a specified conversation or all conversations, the result is synchronized to the current account's other devices, but no message read receipt is sent to the message sender.
- When another device clears a conversation's unread count, this device receives a multi-device conversation event. The app should then reread the local conversation and refresh the UI.

**Conversation and chat group member capabilities**

The SDK adds capabilities for conversation display information, batch conversation deletion, and chat group member retrieval:

- New APIs provide conversation display names and avatars for convenient list display.
- You can delete conversations in batches and optionally delete their messages.
- A new chat group member retrieval API lets you read member information directly from a chat group object.

#### Improvements

**Login, authentication, and API organization**

- The client registration API has been removed. Account registration should be implemented by the app server.
- Login and device management now uniformly use Token authentication. Password login and password-authenticated device management APIs have been removed.
- The SDK no longer supports automatic login: `EMOptions#setAutoLogin(...)`, `getAutoLogin()`, and `EMClient#isLoggedInBefore()` have been removed. Use `loginWithToken(...)` to log in.
- The automatic friend synchronization switch has been incorporated into `EMOptions#setDataSyncType(...)`.
- `EMOptions.AreaCode` has changed from an integer constant class to an enumeration, and `EMOptions#setAreaCode(int)` has changed to `setAreaCode(AreaCode)`. The original `AREA_CODE_*` constants have changed to `CN`, `NA`, `EU`, `AS`, `JP`, `IN`, and `GLOB`.

**Low-frequency and legacy API cleanup**

- Message reporting APIs `reportMessage(...)` and `asyncReportMessage(...)` have been removed. Handle message reporting through the app server instead.
- Low-frequency APIs for client registration, public chat group lists, chat room creation and destruction, and message statistics have been removed.
- Legacy APIs such as `EMClient#check(...)`, `EMCheckType`, server configuration reporting, and the complete chat room list have been removed.
- API names and callback signatures have been standardized for Token login, message recall, logout, and chat group and chat room member changes.
- Historical message retrieval, message search, and chat group and chat room member retrieval now uniformly use the recommended asynchronous or paginated APIs.

**Platform and performance**

- The SDK has migrated to AndroidX and uses `ProcessLifecycleOwner` to monitor whether the app is in the foreground or background.
- Local database performance has been improved by reusing batch message insertion statements, reducing unread-count persistence, optimizing message queries, and adding a case-insensitive index for conversation ID queries.
- The counting rules for `EMChatManager#getUnreadMessageCount()` have been adjusted. Conversations whose `EMPushRemindType` push notification mode is not `ALL` are no longer counted.
- The timeout policy for multipart attachment uploads has been improved, and unnecessary serialization during logging has been reduced.

#### Fixes

- Fixed an issue where the local login state might not be cleared promptly after an account was forcibly disconnected by the server.
- Fixed an issue where the Android layer might reuse the previous account's database cache when switching accounts to log in.
- Fixed an issue where reusing a request identifier when modifying a message might cause incorrect response matching.
- Fixed an issue where a chat group member name card could not be set to an empty string in some scenarios.
- Fixed an issue where attachment MD5 pre-validation might still run during upload after attachment MD5 validation was disabled.
- Fixed several concurrency-safety issues in network transmission, task queues, and database caching.

## v4.24.0 Dev 2026-7-10 (Development version)

#### New features

- Added support for [server-side message search](/value-added/search/message_search_android.html), which lets you filter by keyword combinations, conversation ID, message type, time range, and message content or extension attributes. To use this feature, contact the Easemob business team for activation. For details, see the [activation instructions](/product/console/purchase_value_added.html#消息搜索).
  By default, message search does not support the `ext` extension field. To search this field, contact the Easemob business team.
- Added an asynchronous API to [update the chat group extension field](group_attributes.html#update-the-chat-group-extension).
- Added an asynchronous API to [retrieve server-side push configurations](/document/android/push/push_display_attribute.html#获取推送通知的显示属性).

#### Improvements

- Improved the status and result reporting logic for automatic friend synchronization.
- Improved data synchronization handling when message reception is stopped. The data synchronization WebSocket connection is now also disconnected.
- Improved the retry policy for data synchronization connections. DNS configuration is refreshed only when DNS is enabled.

#### Fixes

- Fixed an issue where the push Token might not be rebound after logging in again following a logout or failed push Token upload.
- Fixed a potential lock-wait issue during offline message synchronization and disconnection.
- Fixed an issue where malformed JSON data in message extension attributes might trigger a JNI exception.
- Fixed an issue where voice files failed to send in some scenarios.

## v4.23.0 Dev 2026-6-10 (Development version)

####  New features

Added support for [configuring a callback routing identifier for a message so that it can trigger pre-delivery and post-delivery callbacks through a specified route](message_send.html#set-callback-routing-when-sending-a-message). Currently, this feature is available only in China Regions 1 and 2.

#### Improvements

- Added [login failure error codes](error.html):
  - `350`: `EMError#CONNECTION_TIMEOUT`: Timed out while connecting to the server.
  - `351`: `EMError#CONNECTION_DNS_ERROR`: A DNS error occurred while connecting to the server.
  - `352`: `EMError#CONNECTION_IO_ERROR`: An IO error occurred while connecting to the server.
  - `353`: `EMError#CONNECTION_STREAM_CLOSED`: The stream was closed while connecting to the server.
  - `354`: `EMError#CONNECTION_PROVISION_TIMEOUT`: Authentication timed out while connecting to the server.
- Improved parameter validation for `EMClient#changeAppkey` and `EMClient#changeAppId` by adding null-value validation.

#### Fixes

- Fixed an occasional attachment download failure for combined forwarded messages.
- Fixed an issue where the client could not parse DoH configuration information.
- Fixed an issue where, after an image or video message failed to send because the platform layer failed to copy the image, the message status was not updated from `inprogress` to `fail`.
- Fixed an issue where `asyncFetchGroupMembersInfo`, the [chat group member list retrieval API](group_manage.html#获取群成员列表), could not retrieve nicknames and avatars.

## v4.22.0 Dev 2026-6-5 (Development version)

#### New features

- Added layered resource management for image messages and improved related processing logic:
  - Added a [large-image resource type](message_send.html#send-image-messages) to distinguish original images from compressed image resources.
  - Improved [image processing when sending a non-original image](message_send.html#send-image-messages).
  - Improved thumbnail and attachment path handling for [image](message_receive.html#receive-image-messages) and [video messages](message_receive.html#receive-video-messages).
- Added automatic friend list synchronization:
  - Added [automatic friend list synchronization configuration](user_relationship.html#automatically-synchronize-the-friend-list-after-login).
  - Added [callbacks for friend list and friend information synchronization status](user_relationship.html#monitor-friend-relationships-and-friend-information-changes).
  - Enhanced friend objects: The [server](user_relationship.html#retrieve-the-friend-list-and-friend-information) and [local friend list retrieval](user_relationship.html#read-the-friend-list-locally) APIs now return friends' user attributes and the time they were added. Previously, they returned only friend user IDs and friend remarks.
- Added support for [subscribing to attribute changes for non-friend users](userprofile.html#subscribe-to-non-friend-user-attribute-changes).
- Added APIs to configure the WebSocket service address and port for data synchronization.

#### Improvements

The error code returned when DNS retrieval fails has changed from `305` to `304`.
- Deprecated the original method for determining whether an original image was sent, `EMImageMessageBody#isSendOriginalImage()`. Use [EMImageMessageBody#isOriginalImage()](message_send.html#send-image-messages) instead.
- Deprecated the original message attachment download method, `EMChatManager#downloadAttachment(EMMessage msg)`. Use the attachment download method with a callback, [EMChatManager#downloadAttachment(EMMessage msg, EMCallBack callback)](message_receive.html#receive-image-messages), instead.
- Deprecated the original method for setting a thumbnail secret, `EMImageMessageBody#setThumbnailSecret(String)`. Use `EMFileMessageBody#setSecret(String)` instead.
- Deprecated the original method for retrieving a thumbnail secret, `EMImageMessageBody#getThumbnailSecret()`. Use `EMFileMessageBody#getSecret()` instead.

#### Fixes

1. Fixed a deadlock in the `checkdns` function in some scenarios.
2. Fixed an issue where setting a thumbnail to null before sending a message caused image and video messages to be sent abnormally.

## v4.21.0 Dev 2026-4-28 (Development version)

#### New features

Added [speech-to-text](/value-added/stt/voice_to_text_android.html).

#### Improvements

- The underlying curl HTTP requests now support SSL certificate validation.
- If translation fails when a message is sent, the SDK returns error code 1113 to indicate that message translation failed (`TRANSLATE_MESSAGE_FAIL`).

#### Fixes

- Fixed an inaccurate error code returned when adding a nonexistent user as a friend.
- Fixed an inaccurate chat group member count caused when a member change notification arrived before the REST API response.
- Fixed multipart upload failures caused by the lack of a corresponding Android platform-layer implementation and the inability to recognize local file URIs in `file://` format.

## v4.20.0 Dev 2026-3-30 (Development version)

#### New features

1. Added [automatic user information management](userinfo_provider.html).

   User information refers to user-related information displayed by the app, including [user attributes](userprofile.html), [friend remarks](user_relationship.html#set-friend-remarks), and [chat group member name cards](group_namecard.html).
   
   After `EMOptions#setEnableUserInfo(true)` is enabled, the SDK can automatically synchronize, cache, and update user information. The main features are as follows:
   - Automatically synchronizes the current user's information after a successful login.
   - Automatically includes sender information and the chat group member name card update time when sending a message.
   - Automatically updates local memory based on the update time after receiving a message.
  
   The following APIs have been added to implement automatic user information management:
   - `EMMessage#getSenderInfo()`: Retrieves message sender information.
   - `EMUserInfoManagerListener`: Monitors user information update events.
   - `EMUserInfoManager#getUserInfoWithUserIds`: Queries user information from local memory.

2. Added [chat group member name card management](group_namecard.html).
   
   This feature supports setting chat group member name cards, querying them locally, retrieving them from the server and writing them to local memory, automatically synchronizing them through messages, and monitoring changes. The following APIs and callbacks have been added:
   - Added `EMGroupManager#asyncUpdateGroupNamecard` to update the current user's name card in a specified chat group.
   - Added `EMGroupManager#getGroupNamecard` to retrieve a chat group member name card from local memory.
   - The `EMGroupMemberInfo` returned by `EMGroupManager#asyncFetchGroupMembersInfo` now includes the `namecard` chat group member name card field.
   - Added `EMGroupChangeListener#onUserGroupNamecardUpdated` to monitor chat group member name card changes.

## v4.19.2 Dev 2026-4-15 (Development version)

Fixed an issue where large image messages failed to send when Flutter was integrated.

## v4.19.1 Dev 2026-2-27 (Development version)

#### Improvements

Improved handling when the `login` method is called before the SDK is initialized.

#### Fixes

Fixed an issue where forwarded attachment messages failed to send.

## v4.19.0 Dev 2026-2-2 (Development version)

#### New features

Added support for [receiving stream messages sent by the server](message_stream_receive.html).

Currently, stream messages can be delivered only through the [server-side RESTful API](/document/server-side/message_stream_send_single.html). The SDK receives these messages but cannot send them.

#### Improvements

The AOSL crash reporting library used by the SDK has been replaced with `cn.shengwang.infra:aosl:1.3.0`.

#### Fixes

- **Push service**: Fixed an exception when binding a push access token.
- **Initialization validation**: Added initialization-state checks to methods in the `EMClient` class to prevent them from being called before initialization.
- **Attachment messages**: Fixed an issue where `remote_url` and `secret` information was lost when sending an attachment message.
- **Network compatibility**: Fixed an issue where WebSocket could not connect properly in an IPv6 network environment.
- **Connection status**: Fixed inaccurate msync connection status reporting.

## v4.18.1 Dev 2025-11-12 (Development version)

#### Improvements

The underlying connection for private deployment can now switch between TCP and WebSocket.

#### Fixes

Fixed an issue introduced in 4.17.0 that prevented login with certain WebSocket server configurations.

## v4.18.0 Dev 2025-10-31 (Development version)

:::tip
We recommend using v4.18.1.
:::

#### New features 

1. Added underlying support for secure DNS resolution through DoH to improve connectivity.
2. Added support for configuring an IPv6-format REST address for private deployment.

#### Fixes

1. Fixed an occasional crash caused by a JSONString-type extension in a message.
2. Fixed a file descriptor (FD) overflow when using the underlying WebSocket connection.
3. Fixed an occasional crash when a WebSocket connection was disconnected due to a network exception.

## v4.17.1 Dev 2025-11-12 (Development version)

#### Improvements

The underlying connection for private deployment can now switch between TCP and WebSocket.

#### Fixes

1. Fixed an issue introduced in 4.17.0 that prevented login with certain WebSocket server configurations.
2. Fixed a file descriptor (FD) overflow when using WebSocket.
3. Fixed an occasional crash when a WebSocket connection was disconnected due to a network exception.

## v4.17.0 Dev 2025-9-25 (Development version)

:::tip
We recommend using v4.17.1.
:::

#### New features 

1. Long-lived connections now support the WebSocket protocol. 
2. Added support for private WebSocket deployment:
   - `EMOptions#setWebSocketServer`: Sets the WebSocket server address.
   - `EMOptions#getWebSocketServer`: Retrieves the configured WebSocket server address.
   - `EMOptions#setWebSocketPort`: Sets the WebSocket server port.
   - `EMOptions#getWebSocketPort`: Retrieves the configured WebSocket server port.
3. Added the logout protocol when a user actively logs out.

#### Improvements

- The SDK can now be found in Google Play SDK Index searches.
- Updated the AOSL library to version 1.3.0.

#### Fixes

- Fixed an issue where updating chat group attributes affected the chat group avatar.
- Fixed a crash caused by retrieving `content` from `messagebody` in a multithreaded scenario.

## v4.16.1 2025-11-12

#### New features

Added support for configuring an IPv6-format REST address for private deployment.

#### Improvements

Updated the AOSL library to version 1.3.0.

#### Fixes

Fixed an issue where updating chat group attributes affected the chat group avatar.

## v4.16.0 Dev 2025-8-19 (Development version)

#### Fixes

1. The following issues were fixed in the EasyIM SDK:
  - Fixed an issue where members still retrieved chat group or chat room details from the server after receiving the callback that the chat group or chat room had been destroyed.
  - Fixed an issue where the database was rebuilt after encountering `SQLITE_BUSY`.
2. Added anti-fraud notices to the EasyIM Demo:
  - Added an anti-fraud background to the chat page.
  - An anti-fraud notice message is inserted when a message is sent or received.

## v4.15.2 Dev 2025-7-22 (Development version)

#### Improvements

- Improved loading performance for the local conversation list when the latest message is an attachment message by reducing unnecessary file-length retrieval operations.

## v4.15.1 Dev 2025-6-23 (Development version)

#### New features 

1. Added support for [retrieving messages in a conversation from the local database by keyword](message_retrieve.html#retrieve-messages-in-a-local-conversation-by-keyword). The SDK returns lists of conversation IDs and message IDs.
2. Added support for [retrieving one or more messages from the local database by message ID](message_retrieve.html#retrieve-local-messages-by-message-id).

#### Fixes

1. Fixed an issue where the `EMMessageListener#onMessageContentChanged` callback did not return modification information when modifying messages other than text and custom messages.
2. Fixed an issue where [retrieving roaming messages](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server) still created a local conversation when messages were configured not to be saved (`EMFetchMessageOption#setIsSave` was set to `false`).   
3. Fixed an issue where [GIF image messages](message_send.html#send-gif-images) failed to send in some scenarios.

## v4.15.0 Dev 2025-5-21 (Development version)

#### New features

- When [recalling a message](message_recall.html), the group owner, chat room owner, and admins can now recall messages sent by other users.
- Chat group member join and leave events can now notify the app of multiple members joining or leaving a chat group at once. Previously, the SDK delivered a separate event callback for each member who joined or left.
  - Added chat group member join and leave events [onMembersJoined](group_manage.html#monitor-chat-group-events) and [onMembersExited](group_manage.html#monitor-chat-group-events). The original events, `onMemberJoined` and `onMemberExited`, are deprecated. Use the new events instead. 
  
#### Improvements

- Changed when the Token expiration warning event [onTokenWillExpire](connection.html#monitor-connection-changes) is triggered. The SDK now delivers the expiration warning when 80% of the Token validity period has elapsed, instead of 50% in previous versions.
- [EasyIM Demo] You no longer need to deploy an App Server to run the EasyIM Demo. For details, see the [Demo quick start](/document/android/demo.html#快速跑通-demo-源码).

#### Fixes

- Fixed an issue where the `TYPE` of the `EMChatThreadEvent` returned by the [EMChatThreadChangeListener#onChatThreadUserRemoved](thread.html#be-removed-from-a-message-thread) event was `null`.
- Fixed a crash on some device models when retrieving a conversation's Do Not Disturb start and end times.

## v4.14.0 Dev 2025-4-21 (Development version)

#### New features

- Added support for [sending](message_send.html#send-gif-images) and [receiving GIF image messages](message_receive.html#receive-gif-image-messages).
- Added support for [chat group avatars](group_attributes.html#manage-the-chat-group-avatar).
- Added support for [message attachment authentication](message_receive.html#receive-attachment-messages). To activate this feature, contact the Easemob business team. After activation, you must call an SDK API to download message attachments.
- Added support for [retrieving only messages sent by specified chat group members](message_retrieve.html#retrieve-messages-sent-by-specified-group-members-from-the-server) when retrieving roaming messages.
- Added support for [loading only messages sent by specified chat group members](message_retrieve.html#retrieve-messages-sent-by-specified-group-members-locally) when loading local conversation messages.
- The [chat group member list](group_manage.html#获取群成员列表) now includes member roles and join times.

#### Improvements

- Added the device time-zone offset to log files to facilitate troubleshooting.
- When `EMChatManager#asyncFetchHistoryMessages` is called to [retrieve roaming messages](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server) and the last page is reached, the returned `EMCursorResult#cursor` has changed from `undefined` to an empty string.
- Removed the reflection-based implementation for retrieving an absolute file path from `FileProvider`.
- Upgraded the BoringSSL and SQLCipher libraries used by the SDK to avoid security risks.

#### Fixes

- Fixed an issue where cached messages were not deleted when a local conversation was deleted.

## v4.13.0 2025-3-12

#### Improvements

- [EasyIM SDK] The post-delivery message editing API [EMChatManager#asyncModifyMessage](message_modify.html) now supports modifying all message types:
  - Text/custom messages: Supports editing the message body and the `ext` extension.
  - File/video/audio/image/location/combined forwarded messages: Supports editing only the `ext` message extension.
  - Command messages: Modification is not supported.
- [EasyIM SDK] Improved reconnection logic by switching the reconnection address by default.
- [EasyIM App (Demo)] Added an anti-fraud notice UI.

#### Fixes

[EasyIM SDK] Fixed an issue where the last message in a conversation retrieved from the server by calling [EMChatManager#asyncFetchConversationsFromServer](conversation_list.html#retrieve-the-conversation-list) did not include translation or message Reaction information.

## v4.12.0 2025-1-10

#### New features

- [EasyIM SDK] When a user joins a chat room, the following information is now available:
  1. Current number of users in the chat room: Call `EMChatRoom#getMemberCount` to retrieve this value. The current number of chat room members is updated when a user joins or leaves the chat room.
  2. Mute-all status of the chat room: Call `EMChatRoom#isAllMemberMuted` to retrieve this value. It is updated when a mute-all status change is received.
  3. Chat room creation timestamp: Call the new `EMChatRoom#getCreateTimestamp` method to retrieve it.
  4. Whether the current user is on the chat room allowlist: Call the new `EMChatRoom#isInWhitelist` method to retrieve this value.
  5. Timestamp when the current user's mute expires: `EMChatRoom#getMuteExpireTimestamp`.

#### Improvements

- [EasyIM SDK] Removed APIs deprecated before Android SDK 4.0.0.
- [EasyIM SDK] Improved some database operations.
- [EasyIM SDK] Added exception clearing and null protection mechanisms to the JNI layer.
  
#### Fixes

- [EasyIM SDK] Fixed exceptions during logout caused by nested calls to SDK APIs within SDK callbacks.

## v4.11.0 2024-12-3

#### New features

- [EasyIM SDK] When [retrieving roaming messages from the server](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server), the SDK now reads message read and delivery status from the server. This feature applies only to one-to-one messages and is disabled by default. To enable it, contact the Easemob business team. 
- [EasyIM SDK] Chat room member mute callback:
  - Added the chat room mute callback `EMChatRoomChangeListener#onMuteListAdded(java.lang.String, java.util.Map<java.lang.String,java.lang.Long>)`. In the callback, the `Map<String,Long> muteInfo` parameter contains the user IDs of muted users and their mute expiration timestamps.
  - Deprecated the original callback `EMChatRoomChangeListener#onMuteListAdded(java.lang.String, java.util.List<java.lang.String>, long)`.
- [EasyIM SDK] Added Native Crash reporting. When SDK native-layer code crashes, the crash information is reported after the next startup.

#### Fixes

- [EasyIM SDK] Fixed a crash caused by a network exception in extreme circumstances.

#### Note

When EasyIM SDK 4.11.0 and Agora RTM SDK 2.2.0 or RTC SDK 4.3.0 or later are integrated together, a compilation error may occur because both include the `libaosl.so` library. For details, see the [integration issue description in Android Quick Start](quickstart.html#_5-其他集成问题).

## v4.10.3 2024-11-25

#### Fixes

Fixed an issue where calling [EMPushManager#getSilentModeForConversations](/document/android/push/push_notification_mode_dnd.html#获取多个会话的推送通知设置) failed to retrieve the Do Not Disturb status of conversations.

## v4.10.2 2024-11-04

#### Fixes

Fixed an issue where a recalled pinned one-to-one message was not promptly removed from the pinned message cache (`EMConversation#pinnedMessages`).

## v4.10.1 2024-10-11

#### Improvements

1. Recompiled the `cipherdb.so` library using ndk-27.
2. Improved the underlying error-code handling logic when the service is restricted.

## v4.10.0 2024-09-30

#### New features

- [EasyIM SDK] Added `EMChatManager#asyncGetMessageCount` to retrieve the total number of messages in the database. 
- [EasyIM SDK] Added [two error codes](error.html):
  - `EMError#GROUP_USER_IN_BLOCKLIST` (613): The user is on the chat group blocklist. This error is reported when a user on the chat group blocklist performs certain operations, such as joining the chat group.
  - `EMError#CHATROOM_USER_IN_BLOCKLIST` (707): The user is on the chat room blocklist. This error is reported when a user on the chat room blocklist performs certain operations, such as joining the chat room.
  
#### Improvements
 
- [EasyIM SDK] A [pre-delivery callback](/document/server-side/callback_presending.html) can modify [message extension fields](/document/android/message_extension.html), which are now synchronized to the sender.
- [EasyIM SDK] After the [server-side conversation deletion API](conversation_delete.html#单向删除服务端会话及本地会话) is successfully called, the local conversation is deleted. In previous versions, this API could be configured to delete the local messages in a conversation but could not delete the local conversation.
- [EasyIM SDK] Added support for the 16K page size on Android 15.
- [EasyIM SDK] The default error codes reported for chat group and chat room operations have changed from `GROUP_MEMBERS_FULL` (604) and `CHATROOM_MEMBERS_FULL` (704) to `GROUP_PERMISSION_DENIED` (603) and `CHATROOM_PERMISSION_DENIED` (703). For example, if a regular chat group member attempts to assign a chat group admin, error 603 is reported because the user lacks permission.
- [EasyIM SDK] The underlying long-lived connection now uses poll instead of select, resolving the maximum file descriptor (fd) limit of 1024.

#### Fixes

- [EasyIM SDK] Fixed an issue where the specified thumbnail dimensions did not take effect when sending an image message.
- [EasyIM SDK] Fixed an issue where the friend list could not be updated when a friend event was received before the friend list was retrieved.

#### [One-to-one and group chat UIKit](/uikit/chatuikit/android/chatuikit_overview.html)

- Fixed an issue where some emojis sent by the sender did not match those received by the recipient.

#### [EaseCallKIt](easecallkit.html)

- Fixed an issue on some phones where the call status was displayed incorrectly after switching to a floating window while dialing and then returning.
- Fixed an issue where the floating window flashed once when switching to it.

#### EasyIM App (Demo)

- Added a privacy policy date statement.

Note: You can refer to the source code on [GitHub](https://github.com/easemob/easemob-demo-android) or [Gitee](https://gitee.com/easemob-code/easemob-demo-android).

## v4.9.0 2024-08-30

#### New features

- [EasyIM SDK] Added event callbacks for [the start and end of retrieving offline messages from the server](/document/android/connection): `EMConnectionListener#onOfflineMessageSyncStart` and `EMConnectionListener#onOfflineMessageSyncFinish`.
- [EasyIM SDK] Added the `EMGroupManager#asyncCheckIfInMuteList` API to check whether the current user is on the chat group mute list.
- [EasyIM SDK] The original message pinning APIs, `EMChatManager#asyncPinMessage` and `EMChatManager#asyncUnPinMessage`, now [support pinned messages in one-to-one conversations](message_pin.html). The APIs are unchanged.
- [EasyIM SDK] Added the `EMRecallMessageInfo#getConversationId` API to [return the ID of the conversation containing the recalled message](message_recall.html#monitor-message-recalls) in the `EMMessageListener#onMessageRecalledWithExt` message recall event.

#### Improvements

- [EasyIM SDK] Added a synchronization lock to `EMMessage#getBody`.
- [EasyIM SDK] Improved chat room message aggregation.
- [EasyIM SDK] Deprecated the `EMClient#check()` API.
- [EasyIM SDK] Removed the `EMConversationType#DiscussionGroup` and `EMConversationType#HelpDesk` types.

#### Fixes

[EasyIM SDK] Fixed an issue where unread counts for multi-device offline messages were not synchronized in some scenarios.

#### [One-to-one and group chat UIKit](/uikit/chatuikit/android/chatfeature_message.html#消息置顶)

- **Added**: Message pinning now supports one-to-one conversations.
- **Fixed**:
  - Some memory leaks.
  - Incorrect thumbnail display on the recipient's device.

## v4.8.2 2024-07-26

#### Fixes

Fixed a crash caused by missing internal member variables in the `conversation` object returned by the `EMCustomConversationFilter#filter` callback in some scenarios.

#### CallKit

[Added an Agora private deployment API and exposed RTCEngine](easecallkit.html#私有化部署).

## v4.8.1 2024-07-18

#### Improvements

[EasyIM SDK] Updated third-party push SDK versions:
- Updated OPPO Push to `oppo_push_3.5.2.aar`.
  OPPO Push now supports REALME devices.
- Updated vivo Push to `vivo_push_v4.0.4.0_504.aar`.
- Updated Xiaomi Push to `MiPush_SDK_Client_6_0_1-C_3rd.aar`.
- Updated Meizu Push to `com.meizu.flyme.internet:push-internal:4.3.0`.

## v4.8.0 2024-07-01

#### New features

- [EasyIM SDK] Added support for the AUT protocol to improve successful service connections in weak network environments.
- [EasyIM SDK] Added support for [including extension information when joining a chat room and specifying whether to leave all previously joined chat rooms](room_manage.html#join-a-chat-room):
  - Added `EMChatRoomManager#joinChatRoom(java.lang.String, boolean, java.lang.String, EMValueCallBack<EMChatRoom>)`, which supports including extension information when joining a chat room and specifying whether to leave all other chat rooms.
  - Added the `EMChatRoomChangeListener#onMemberJoined(java.lang.String, java.lang.String, java.lang.String)` callback. When a user includes extension information upon joining a chat room, other users in the chat room can retrieve that extension information through the callback triggered when the user joins.
- [EasyIM SDK] Added support for [local storage of conversation push notification modes](/document/android/push/push_notification_mode_dnd.html#从服务器获取所有会话的推送通知方式设置).
  - Added `EMPushManager#syncSilentModeConversationsFromServer` to retrieve the push notification mode settings for all conversations from the server.
  - Added the `EMConversation#pushRemindType` attribute to store a conversation's push notification mode locally.
  - If a user changes a conversation's push notification mode on one device, the other devices receive the `EMMultiDeviceListener#onConversationEvent` event.
- [EasyIM SDK] Added `EMConversation#getAllMsgCount(long, long)` to [retrieve the total number of messages in a conversation in the SDK's local database during a specified period](message_retrieve.html#retrieve-the-message-count-in-a-conversation-within-a-specified-period).

#### Improvements

- [EasyIM SDK] When APIs for setting and retrieving user attributes exceed the call frequency limit, error code 4 `EXCEED_SERVICE_LIMIT` is reported. These APIs include [setting all attributes of the current user](userprofile.html#set-all-attributes-of-the-current-user), [setting a single attribute of the current user](userprofile.html#set-a-single-attribute-of-the-current-user), [retrieving a user's attributes](userprofile.html#retrieve-all-user-attributes-from-the-server), and [retrieving specified attributes of a user](userprofile.html#retrieve-specified-user-attributes-from-the-server).

#### Fixes

- [EasyIM SDK] Fixed an issue where the cache was not updated promptly when a friend was banned.
- [EasyIM SDK] Fixed a crash caused by repeatedly calling `EMCustomMessageBody#setParams` in a multithreaded scenario.
- [EaseIMKIt] Fixed an issue where the conversation list was not displayed in some scenarios.

## v4.7.1 2024-07-01

#### Improvements

Changed the obfuscation rules.

## v4.7.0 Dev 2024-06-05 (Development version)

#### New features

- [EasyIM SDK] Added support for [including a custom message when a device logs in and passing it to the device that is kicked offline](multi_device.html#set-login-device-extension-information): 
  - `EMOptions#setLoginCustomExt`: Sets the device's extension information.
  - `EMOptions#getLoginCustomExt`: Retrieves the device's extension information.
  - `EMConnectionListener#onLogout(int, EMLoginExtensionInfo)`: In a multi-device login scenario, if the current device is kicked offline by a newly logged-in device, the event received by the kicked device contains the new device's extension information.
- [EasyIM SDK] Added support for searching local messages by multiple message types:
  - `EMChatManager#searchMsgFromDB(java.util.Set<EMMessage.Type>, long, int, java.lang.String, EMConversation.EMSearchDirection)`: [Searches messages in all conversations in the local database by one or more message types](message_search_local.html#search-messages-in-all-conversations-by-message-type).
  - `EMConversation#searchMsgFromDB(java.util.Set<EMMessage.Type>, long, int, java.lang.String, EMConversation.EMSearchDirection)`: [Searches messages in a single conversation in the local database by one or more message types](message_search_local.html#search-messages-in-the-current-conversation-by-message-type).
- [EasyIM SDK] Added support for [one-way deletion of chat room roaming messages from the server](message_delete.html#delete-server-side-historical-messages-for-the-current-user).

#### Improvements

- [EasyIM SDK] When retrieving chat groups from the server, the SDK no longer clears the local chat groups first. Instead, it compares the retrieved chat groups with the local ones, updates existing local chat groups, and inserts new chat groups locally. To clear local chat group information, call `EMGroupManager#cleanAllGroupsFromLocal`.
- [EasyIM SDK] The logout method `EMConnectionListener#onLogout(int, java.lang.String)` is deprecated. Use `onLogout(int errorCode, EMLoginExtensionInfo info)` instead.

#### Fixes

- [EasyIM SDK] Fixed an issue where database table creation failed when a new user logged in within the same process after another user upgraded the database.


## v4.6.1 Dev 2024-05-20

#### New features

- [EasyIM SDK] Added error code 407 `FILE_IS_EXPIRED`. The SDK triggers this error when a user downloads an expired message attachment or chat group shared file.

#### Fixes

- [EasyIM SDK] Fixed an issue where a second request to retrieve the friend list, including friend remarks, from the server returned no data when the friend list had not changed.
- [EasyIM SDK] Fixed an issue where a message was still sent successfully after the attachment failed to send under special circumstances.
- [EasyIM SDK] Fixed an incorrect nextkey when retrieving roaming messages.

## v4.6.0 Dev 2024-04-30

#### New features

- [EasyIM SDK] Added `asyncFilterConversationsFromDB` to support [custom filtering when retrieving the local conversation list](conversation_list.html#retrieve-all-or-filtered-local-conversations). When using this API, you must set `EMOptions#setAutoLoadAllConversations` to `false`.
  - Added the `EMCustomConversationFilter` API, which developers implement as a conversation filter.
- [EasyIM SDK] Added `cleanConversationsMemoryCache` to [clear all conversations from local memory](conversation_list.html#clear-conversations-from-memory) and release memory.
- [EasyIM SDK] Added `EMOptions#setAutoLoadAllConversations` to [configure whether all conversations in the database are automatically loaded into the cache after automatic login succeeds](conversation_list.html#retrieve-all-local-conversations-at-once).
- [EasyIM SDK] Added `recallMessage(message,ext)` to [include custom information when recalling a message](message_recall.html#实现方法). The `ext` parameter is a string.
- [EasyIM SDK] Added the [message recall event](message_recall.html#monitor-message-recalls) `onMessageRecalledWithExt`, which supports notifying the recipient of messages recalled while offline.

#### Improvements

- [EasyIM SDK] Added a callback for successful push token binding. For details, see the description of enabling FCM in the EasyIM SDK in step four of [FCM push integration](/document/android/push/push_fcm.html).
- [EasyIM SDK] `onMessageRecalled` is deprecated. Use `onMessageRecalledWithExt` instead.

#### Fixes

- [EasyIM SDK] Fixed a crash caused when `to` was empty while sending a message.
- [EasyIM SDK] Fixed an issue where, when the Web client sent a conversation read receipt (channel ack) in a chat room, the mobile SDK added a conversation with an incorrect conversation type.

#### Major changes

Starting with V4.6.0, new EaseIM App and EaseIMKIt projects written in Kotlin are enabled. Older projects will gradually no longer be maintained. See:
- [EaseIMKIt documentation](/uikit/chatuikit/android/chatuikit_overview.html) 
- EaseIM App project: [GitHub](https://github.com/easemob/easemob-demo-android) or [Gitee](https://gitee.com/easemob-code/easemob-demo-android).

## v4.5.0 Dev 2024-04-03

#### New features

- [EasyIM SDK] Added [message pinning](message_pin.html).
  - Added `EMChatManager#asyncPinMessage` to pin a message.
  - Added `EMChatManager#asyncUnPinMessage` to unpin a message.
  - Added `EMChatManager#asyncGetPinnedMessagesFromServer` to retrieve pinned messages in a specified conversation from the server.
  - Added `EMConversation#pinnedMessages` to return all pinned messages in a conversation.
  - Added the `EMMessagePinInfo` class, which includes the user who pinned a message and the time it was pinned.
  - Added `EMChatMessage#pinnedInfo` to display message pinning details.
  - Added the `EMMessageListener#onMessagePinChanged` event. When a user pins a message in a chat group or chat room conversation, other members of the chat group or chat room receive this callback.
- [EasyIM SDK] The message editing callback `EMMessageListener#onMessageContentChanged` can now return [custom messages edited through the RESTful API](/document/server-side/message_modify.html).
- [EasyIM SDK] Added support for [retrieving chat room roaming messages](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server).
- [EasyIM SDK] Added support for [dynamically loading .so library files](quickstart.html#方法三-动态加载-so-库文件).

#### Improvements

- [EasyIM SDK] Added support for [forwarding a single message](message_forward.html#forward-a-single-message) using the message body. Attachments in attachment messages do not need to be uploaded again.
- [EasyIM SDK] Reduced the number of chat group detail retrieval operations when receiving a large number of chat group member event notifications in some scenarios.
- [EasyIM SDK] [The number of chat room members is now updated as members join or leave](room_manage.html#update-the-chat-room-member-count-in-real-time), making the count more timely and accurate.
- [EasyIM SDK] Improved error messages for Token login to make them more specific.
- [EasyIM SDK] Improved the efficiency of marking all conversations as read, reducing the time required to call `EMChatManager#markAllConversationsAsRead`, which clears the unread message counts of all conversations.
- [EasyIM SDK] Improved the SDK's internal logic for randomly selecting a server address, increasing the request success rate.


## v4.4.1 Dev 2024-03-06

#### Fixes

- [EasyIM SDK] Fixed a crash caused by calling `EMChatManager#updateMessage` to update a message in some scenarios.
- [EasyIM SDK] Fixed duplicate instantiation caused by calling `EMClient#init` multiple times to initialize the SDK in a multithreaded scenario.

## v4.4.0 Dev 2024-01-30

#### New features

- [EasyIM SDK] Added [EMChatManager#asyncDeleteAllMsgsAndConversations](message_delete.html#clear-chat-history-for-the-current-user) to clear chat history for the current user, including messages and conversations, with the option to also clear server-side chat history.
- [EasyIM SDK] Added [EMChatManager#searchMsgFromDB(java.lang.String, long, int, java.lang.String, EMConversation.EMSearchDirection, EMConversation.EMMessageSearchScope)](message_search_local.html#search-messages-in-all-conversations-by-search-scope) and [EMConversation#searchMsgFromDB(java.lang.String, long, int, java.lang.String, EMConversation.EMSearchDirection, EMConversation.EMMessageSearchScope)](message_search_local.html#search-messages-in-the-current-conversation-by-search-scope). When searching for messages by keyword, you can select a search scope, such as only message content, only message extension information, or both message content and extension information.
- [EasyIM SDK] Added the [EMOptions#setUseReplacedMessageContents](message_send.html#content-moderation-before-sending-messages) switch. When this switch is enabled, if content moderation replaces content when a message is sent, the sender can retrieve the replaced content.
- [EasyIM SDK] Added the [EMOptions#setIncludeSendMessageInMessageListener](message_receive.html#receive-text-messages) switch. When this switch is enabled, successfully sent messages are included in the `EMMessageListener#onMessageReceived` callback.
- [EasyIM SDK] Added the [EMOptions#setRegardImportedMsgAsRead](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server) switch. When enabled, messages imported through the [server-side API](/document/server-side/message_import_single.html) are in the read state after they are [retrieved as roaming messages](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server) on the client. The number of unread messages in the conversation, or the value returned by `EMConversation#getUnreadMsgCount`, does not change. If this switch is disabled, the value returned by `EMConversation#getUnreadMsgCount` increases.

#### Improvements

- [EasyIM SDK] The chat group's mute-all status, returned by `isAllMemberMuted`, is stored in the local database and can be retrieved directly from local storage at the next login.
- [EasyIM SDK] Fixed duplicate attachment uploads when forwarding a combined message.

#### Fixes

- [EasyIM SDK] Fixed duplicate calculation of the chat group member count in some scenarios.
- [EasyIM SDK] Fixed an SQL statement error caused by the single quotation mark `‘` in a message search keyword.
- [EasyIM SDK] Fixed an occasional crash in the data reporting module.

## v4.3.0 Dev 2023-12-22

#### New features

[EasyIM SDK] Added support for [conversation tags](conversation_mark.html).
- `EMChatManager#asyncAddConversationMark`: [Adds a conversation tag](conversation_mark.html#add-conversation-tags).
- `EMChatManager#asyncRemoveConversationMark`: [Removes a conversation tag](conversation_mark.html#remove-conversation-tags).
- `EMChatManager#asyncGetConversationsFromServerWithCursor`: [Retrieves a paginated conversation list from the server by conversation tag](conversation_mark.html#filter-the-conversation-list-by-tag).
- `EMConversation#marks`: [Retrieves all tags of a single local conversation](conversation_mark.html#add-conversation-tags).
- `onConversationEvent#CONVERSATION_MARK_UPDATE`: [Conversation tag event in a multi-device scenario](multi_device.html#monitor-multi-device-events). When the current user updates conversation tags on one logged-in device, including adding or removing tags, the other logged-in devices receive this event.

#### Improvements

- [EasyIM SDK] Removed FPA, recompiled the boringssl, cipherdb, and libevent libraries, and reduced the SDK size.
- [EasyIM SDK] Increased the size of each log file from 2 MB to 5 MB.
- [EasyIM SDK] Improved attachment uploads for attachment messages by adding multipart upload support.

## v4.2.1 Dev 2023-11-17

#### New features

- [EasyIM SDK] Added [friend remarks](user_relationship.html#set-friend-remarks).
- [EasyIM SDK] Added `asyncFetchAllContactsFromServer` to [retrieve the friend list from the server all at once or by page](user_relationship.html#retrieve-the-friend-list-and-friend-information). Each friend object contains the friend's user ID and friend remarks.
- [EasyIM SDK] Added `fetchContactFromLocal` to [retrieve a single friend's user ID and friend remarks locally](user_relationship.html#read-the-friend-list-locally).
- [EasyIM SDK] Added `asyncFetchAllContactsFromLocal` to [retrieve the friend list from local storage by page](user_relationship.html#read-the-friend-list-locally). Each friend object contains the friend's user ID and friend remarks.
- [EasyIM SDK] Added the `EMMessage#isBroadcast` attribute to determine whether a message is a global chat room broadcast message. You can [send a global chat room broadcast message by calling the REST API](/document/server-side/broadcast_to_chatrooms.html).
- [EasyIM SDK] Added `EMGroupManager#asyncGetJoinedGroupsCountFromServer` to [retrieve from the server the number of chat groups the current user has joined](group_manage.html#query-the-number-of-groups-joined-by-the-current-user). 
- [EasyIM SDK] Added [error code 706](error.html), `CHATROOM_OWNER_NOT_ALLOW_LEAVE`, indicating that the chat room owner is not allowed to leave the chat room. If `EMOptions#allowChatroomOwnerLeave` is set to `false` during initialization, this error is reported when the chat room owner calls `leaveChatRoom` to leave the chat room.
- [EasyIM SDK] Added `EMOptions#setLoadEmptyConversations` to configure during initialization whether empty conversations can be returned when retrieving the conversation list.
- [EasyIM SDK] Added the `decliner` and `applicant` parameters to the [callback for a rejected request to join a chat group](group_manage.html#monitor-chat-group-events), `EMGroupChangeListener#onRequestToJoinDeclined`. They represent the user IDs of the applicant and the user who rejected the request.  
- [EasyIM Demo] Friend remarks can now be added and modified on the friend details page.

#### Improvements

- [EasyIM SDK] Unified Agora Token and EaseMob Token login. The `EMClient#loginWithAgoraToken` API is deprecated; use `EMClient#loginWithToken` for both. In addition, callbacks have been added for EaseMob Token expiration and upcoming expiration. `EMConnectionListener#onTokenExpired` and `EMConnectionListener#onTokenWillExpire` are now also returned when an EaseMob Token has expired or half of its validity period has elapsed.
- [EasyIM SDK] Improved retry logic when sending messages.
- [EasyIM SDK] Removed the handling of `NetworkOnMainThreadException` exceptions during network requests.
- [EasyIM SDK] Improved database upgrade logic.

#### Fixes

- [EasyIM SDK] Fixed an issue where the SDK reconnected 2 times when the network recovered.
- [EasyIM SDK] Fixed an inaccurate error message returned when calling `leaveChatroom` while logged out.
- [EasyIM CallKit] Fixed an issue where, during a one-to-one video call that the callee did not answer, the floating window did not refresh after the caller entered floating-window mode. 
- [EasyIM CallKit] Fixed an issue where the audio or video page remained visible in the recent tasks window after hanging up and minimizing the app. 
- [EasyIM CallKit] Fixed an issue where the floating window required two clicks to respond.
- [EasyIM CallKit] Fixed an issue where, if the caller muted before a group audio or video call, the callee could not see the caller's UI after answering.

## v4.1.3 Dev 2023-9-25

#### Fixes

- [EasyIM SDK] Fixed an issue where chat room listener events were lost after the SDK logged out and logged back in under special circumstances.

## v4.1.2 Dev 2023-9-5

#### Improvements

- [EasyIM SDK] Added compatibility with Android 14 Beta.
  - Added compatibility with the requirement that `RECEIVER_EXPORTED` or `RECEIVER_NOT_EXPORTED` must be specified when dynamically registering a broadcast receiver for apps targeting Android 14.

## v4.1.1 Dev 2023-8-3

#### Fixes

[EasyIM SDK] Fixed an issue where the message body lacked the `from` attribute when an offline user got online and retrieved historical messages after the message was edited.

## v4.1.0 Dev 2023-7-27 (Development version)

#### New features

- [EasyIM SDK] Added support for [sending](message_send.html#send-combined-messages) and [receiving combined forwarded messages](message_receive.html#receive-combined-messages):
    - Added the combined message type `EMMessage#Type#COMBINE`.
    - Added the message body class `EMCombineMessageBody`.
    - Added `EMMessage#createCombinedSendMessage` to create a combined message.
    - Added `EMChatManager#downloadAndParseCombineMessage` to download and parse a combined message.
- [EasyIM SDK] Added [message editing](message_modify.html):
    - Added `EMChatManager#asyncModifyMessage` to edit a message.
    - Added the `EMMessageListener#onMessageContentChanged` callback. After a message is edited, the recipient receives this callback.
- [EasyIM SDK] Added support for [customizing the device platform and name](multi_device.html#set-a-login-device-name):
    - Added `EMOptions#setCustomOSPlatform` to set a custom platform code.
    - Added `EMOptions#getCustomOSPlatform` to retrieve the current device's custom platform.
    - Added `EMOptions#setCustomDeviceName` to set the current device's custom name.
    - Added `EMOptions#getCustomDeviceName` to retrieve the current device's custom name.
- [EasyIM SDK] Added the `EMConnectionListener#onLogout(int, String)` callback, which includes the name of the device that kicked the current device offline.<br/>
           Deprecated the `EMConnectionListener#onLogout(int)` callback.<br/>
- [EasyIM SDK] Added `EMChatRoomManager#leaveChatRoom(String, EMCallBack)`. A member leaving a chat room receives a callback indicating whether the operation succeeded or failed.
- [EasyIM SDK] Added the following methods to support user Tokens:
    - `EMClient#getLoggedInDevicesFromServerWithToken`: Retrieves the list of online devices logged in to the specified account.
    - `EMClient#kickDeviceWithToken`: Kicks a specified device logged in to the specified account offline.
    - `EMClient#kickAllDevicesWithToken`: Kicks all devices logged in to the specified account offline.
- [EasyIM UIKit] Added message quoting.
- [EasyIM UIKit] Added message editing.
- [EasyIM app] Added previews for URLs in messages.

#### Improvements

- [EasyIM SDK] Improved `EMClient#addConnectionListener` callback logic: When the listener is set, `EMConnectionListener#onDisconnected` is called back only when logged in.
- [EasyIM SDK] Improved the logic for selecting access addresses with different priorities when logging in to the EasyIM server.

#### Fixes

- [EasyIM SDK] Fixed occasional crashes when calling `EMChatManager#deleteMessagesBeforeTimestamp` and `EMConversation#removeMessages(long,long)`.
- [EasyIM UIKit] Fixed an issue where a voice message could not be downloaded again by tapping the voice icon after automatic download failed.

## v4.0.3 Dev 2023-6-19

#### New features

- [EasyIM SDK] Added `EMChatManager#asyncFetchConversationsFromServer` to [retrieve conversations from the server](conversation_list.html#retrieve-the-conversation-list). The original API is deprecated.
- [EasyIM SDK] Added support for pinning server-side conversations:
    - Added `EMChatManager#asyncPinConversation` to [pin or unpin a server-side conversation](conversation_pin.html#pin-or-unpin-a-conversation).
    - Added `EMChatManager#asyncFetchPinnedConversationsFromServer` to [retrieve pinned server-side conversations](conversation_pin.html#retrieve-pinned-conversations).
- [EasyIM SDK] Added `EMChatManager#getAllConversationsBySort` to [retrieve the sorted conversation list from local storage](conversation_list.html#retrieve-all-or-filtered-local-conversations).
- [EasyIM SDK] Added support for [sending targeted messages](message_target.html) in chat groups and chat rooms.
- [EasyIM SDK] Added [HONOR Push](/document/android/push/push_honor.html).

#### Improvements

- [EasyIM SDK] Improved slow loading of conversations from the local database when there are too many messages during login.
- [EasyIM SDK] Improved the logic for binding and unbinding push devices.

#### Fixes

- [EasyIM UIKit] Fixed some null-pointer issues.
- [EasyIM UIKit] Fixed an issue where custom avatars were not displayed in some scenarios.

## v4.0.2 Dev 2023-4-26

#### New features

- [EasyIM SDK] Added Reaction callback operation types.
- [EasyIM SDK] Added `EMChatManager#asyncFetchHistoryMessages` to [retrieve historical messages in a specified conversation from the server by page based on the message retrieval option class (`EMFetchMessageOption`)](message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server). The `EMFetchMessageOption` class includes parameters such as the start timestamp, message type, and message sender.
- [EasyIM SDK] Added an overloaded `EMConversation#removeMessages` method to delete messages within a specified period from the local database.
- [EasyIM SDK] Added [error code 510 `MESSAGE_SIZE_LIMIT`](error.html), which is reported when the message body exceeds the size limit while sending a message.
- [EasyIM SDK] Added [error code 8 `APP_ACTIVE_NUMBER_REACH_LIMITATION`](error.html), which is reported when the app's number of daily active users (DAU) or monthly active users (MAU) reaches the limit.

#### Improvements

- [EasyIM SDK] The [chat room details update callback onSpecificationChanged](room_manage.html#monitor-chat-room-events) now returns the updated information.
- [EasyIM SDK] Improved the implementation of `searchMsgFromDB` so that global keyword searches support custom messages.
- [EasyIM SDK] Improved the logic for uploading and binding push certificates.
- [EasyIM SDK] Improved the timing of database loading during automatic login.
- [EasyIM SDK] Improved log callback logic.
- [EasyIM Demo] Improved the anti-fraud UI style.

#### Fixes

- [EasyIM SDK] Fixed a crash when the chat group ID was empty while [retrieving chat group details](group_manage.html#retrieve-the-groups-joined-by-the-current-user).
- [EasyIM SDK] Fixed an issue where cached data in the platform layer was not updated in some scenarios.
- [EasyIM SDK] Fixed an issue where an attachment was not downloaded to the private directory when a user called the message attachment download API in some scenarios.
- [EasyIM SDK] Fixed an issue where the message read status was not updated in some scenarios.

## v4.0.1 Dev 2023-3-16

#### New features

- [EasyIM SDK] Added [custom chat group member attributes](group_members.html#manage-custom-group-member-attributes) and [custom attribute update events](group_manage.html#monitor-chat-group-events), allowing chat group members to set and retrieve attributes such as nicknames and avatars within a chat group.
- [EasyIM SDK] Added `EMMessage#deliverOnlineOnly` and `EMMessage#isDeliverOnlineOnly` to deliver messages only to online users. When this feature is enabled, messages are not delivered while the user is offline.
- [EasyIM Demo] Added support for modifying and displaying chat group member nicknames.

#### Improvements

[EasyIM SDK] Improved chat room join and leave implementations to enhance performance.

#### Fixes

- [EasyIM SDK] Fixed a crash when the first frame was set to null while sending a video message.
- [EasyIM UIKit] Fixed an issue where the video file could not be found after a video message failed to send.
- [EasyIM UIKit] Fixed an issue where tapping a failed video message opened the video message download page.
- [EasyIM CallKit] Fixed an issue where, after RTC was upgraded to 4.1.0, the callee failed to join the channel when switching to audio to answer a video call.

## v4.0.0 Dev 2023-2-6

#### New features

[EasyIM SDK] [Added `EMChatManager#asyncFetchConversationsFromServer(int, int, EMValueCallBack)` to retrieve the server-side conversation list by page](conversation_list.html#retrieve-the-conversation-list).

#### Improvements

- [EasyIM Demo] [Improved the login method by changing it to phone number plus verification code](demo.html).
- [EasyIM CallKit] Upgraded RTC to version 4.1.0.

#### Fixes

- [EasyIM SDK] Fixed an issue where the callbacks for uploading and downloading chat group shared files were executed twice. For file uploads, `EMGroupManager#asyncUploadGroupSharedFile(String, String, EMCallBack)` is deprecated. Use `EMGroupManager#asyncUploadGroupSharedFile(String, String, EMValueCallBack)` instead.
- [EasyIM SDK] Fixed a crash caused by calling `EMConversation#removeMessagesFromServer` to perform one-way deletion of server-side historical messages in some scenarios.
- [EasyIM Demo] Fixed some memory leaks.
- [EasyIM CallKit] Fixed some audio and video call issues.

## v3.9.9 Dev 2022-11-29

#### New features

[EasyIM SDK] Added [message traffic statistics](message_traffic_statis.html#获取本地消息的流量统计信息).

#### Fixes

[EasyIM SDK] Fixed an SDK crash in extreme circumstances.

## v3.9.8 Dev 2022-11-8

#### New features

- [EasyIM SDK] Added [chat room message priority](message_send.html#chat-room-message-priority-and-message-dropping).
- [EasyIM SDK] The `EMGroupChangeListener#onSpecificationChanged` callback triggered after chat group information is updated now includes the updated chat group information.

#### Improvements

- [EasyIM Demo] Modified the `activity` attribute configuration in `manifest` so that the current app is displayed in the recent task manager while the user is in an audio or video call.

- [EasyIM SDK] The following APIs and event names have been renamed:

| Original name     | New name   | Description |
| :-------------- | :----- | :------- | 
| EMConversationListener#onCoversationUpdate  | EMConversationListener#onConversationUpdate   | Conversation update callback. | 
| EMChatManager#aysncRecallMessage | EMChatManager#asyncRecallMessage | Recalls a message. | 
| EMContactManager#aysncAddContact | EMContactManager#asyncAddContact   | Adds a friend.  | 
| EMContactManager#aysncDeleteContact   | EMContactManager#asyncDeleteContact   | Deletes a friend.   | 
| EMContactManager#aysncGetAllContactsFromServer  | EMContactManager#asyncGetAllContactsFromServer  | Retrieves the friend list from the server.  | 
| EMContactManager#aysncAddUserToBlackList | EMContactManager#asyncAddUserToBlackList | Adds a friend to the blocklist.  | 
| EMContactManager#aysncRemoveUserFromBlackList | EMContactManager#asyncRemoveUserFromBlackList | Removes a friend from the user list. |
| EMContactManager#aysncGetBlackListFromServer  | EMContactManager#asyncGetBlackListFromServer | Retrieves the blocklist from the server.   | 
| EMContactManager#aysncGetSelfIdsOnOtherPlatform  | EMContactManager#asyncGetSelfIdsOnOtherPlatform   | Retrieves the IDs of the current user's other logged-in devices.  | 
| EMGroupManager#aysncMuteGroupMembers | EMGroupManager#asyncMuteGroupMembers  | Adds chat group members to the mute list.   | 

#### Fixes

- [EasyIM SDK] Fixed an occasional SDK ANR caused by OPPO Push changes.
- [EasyIM CallKit] Fixed an issue where, if the caller returned to the home screen before the callee answered an audio call, the callee could not tap Answer or Hang Up.
- [EasyIM UIKit] Fixed image rotation after taking a photo on some device models.
- [EasyIM SDK] Added compatibility with Android 12 and fixed an unexpected dialog that appeared when an APK depending on the EasyIM SDK was opened after its first installation on some Android 12 phones.
- [EasyIM SDK] Fixed an inconsistency between messages in memory and in the database caused by calling `updateMessage` in some scenarios.

## v3.9.7 Dev 2022-9-30

#### New features

[EasyIM SDK] Added `setAreaCode` to restrict the range of edge nodes to connect to.

#### Improvements

[EasyIM SDK] Improved the communication protocol to reduce data volume.

#### Fixes

- [EasyIM SDK] Fixed incorrect data statistics.
- [EasyIM SDK] Fixed a crash caused by logging in extremely rare scenarios.
- [EasyIM SDK] Fixed a crash caused when full-path acceleration (FPA) was enabled.
- [EasyIM SDK] Fixed an issue where the error code returned when some chat room custom attributes failed to be set was a string. It has been changed to an Int.

## v3.9.6.1 Dev 2022-9-21

#### New features

Added `getJoinedGroupsFromServer` to retrieve the chat groups joined by the current user from the server by page.

#### Improvements

- [EasyIM SDK] Improved the chat room custom attribute update callback `onAttributesUpdate` to return a collection of successfully modified chat room custom attributes.
- [EasyIM SDK] Improved the chat room custom attribute removal callback `onAttributesRemoved` to return an array of keys for chat room custom attributes that were successfully removed.
- [IMKit] Voice playback now uses media volume.

## v3.9.6 Dev 2022-9-16

#### New features

- [EasyIM SDK] Added [chat room custom attributes](room_attributes.html).
- [EasyIM SDK] Added the `EMLogListener` class to implement user log callbacks.

#### Improvements

- [EasyIM SDK] Improved roaming message retrieval performance.
- [Demo] Demo registration now uses phone verification.
- [IMKit/CallKit] Improved `isMainProcess`; the `GET_TASKS` permission is no longer required when calling it.

#### Fixes

- [EasyIM SDK] Fixed an issue where a large number of messages could not be received during synchronization or retrieval in a few scenarios.
- [Demo] Fixed some Demo bugs.

## v3.9.5 2022-8-2

#### New features:

- [EasyIM SDK] Added the chat group disabled status attribute [EMGroup#isDisabled()](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_group.html#acd072d7fc16e6ff89110173979ed318b) to chat group details. Developers must set this attribute on the server.
- [EasyIM SDK] Improved the strategy for updating access points when connection issues occur, enhancing availability.
- [EasyIM SDK] [Pre-delivery callback](/document/server-side/callback_presending.html): Custom error information is now added to the error description returned to the app user when sending fails, namely the code information in the [response body fields](/document/server-side/callback_presending.html#响应-body).
- [EasyIM SDK] In [EMError](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1_e_m_error.html), added error code 1101, [EMError#PRESENCE_CANNOT_SUBSCRIBE_YOURSELF](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1_e_m_error.html#abc9130b164d5cccb3559585ec38e8e99), indicating that a user cannot subscribe to their own presence.

#### Improvements:

- [EasyIM SDK] Improved the login process to shorten login time.
- [EasyIM SDK] Upgraded the message encryption algorithm from CBC to GCM.
- [EasyIM SDK] HTTPS requests from the SDK now support TLS 1.3.

Fixes:

- [EasyIM SDK] Fixed an issue where [EMConversation#getAllMessage](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conversation.html#a5482db46052c03f30de813e31ab607c1) did not deduplicate messages.
- [EasyIM SDK] Fixed an occasional crash during password login.

## v3.9.4 2022-6-16

#### New features:

- [EasyIM SDK] Added the `isOnlineState` field to [EMMessage](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_message.html#acda7d83054f842b5208496370a9decaa) to indicate whether a received message is an offline message.
- [EasyIM SDK] Added error code 509 `MESSAGE_CURRENT_LIMITING` to the [EMError](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1_e_m_error.html#aa61ecbf9d24db24d0d852f6f631560f4) class, indicating that group chat messages have been rate-limited.
- [EasyIM SDK] Added `bindDeviceToken` to [EMPushManager](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_push_manager.html#a3c49e8245c25954b2cc1a13e93b57e0f) to bind a device Token.

#### Improvements:

- [EasyIM SDK] Improved message thread-related APIs and attributes. Compared with version 3.9.3, `EMChatThread` replaces `EMChatThreadInfo`, and the `EMChatThread` object replaces Chat Thread-related attributes in `EMChatThreadEvent`.
- [EasyIM SDK] Added the chat group name (groupName) parameter value to the chat group invitation callback [EMGroupChangeListener#onInvitationReceived](https://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_group_change_listener.html#ab3591c00dc3f5b4138fa57073cc29589).
- [EasyIM SDK] Removed the CBC and ECB encryption algorithms from the platform layer.
- [EasyIM SDK] Upgraded the network connection library.
- [EasyIM SDK] Added support for sending messages whose attachment URL is set to a remote URL.

#### Fixes:

- [EasyIM SDK] Fixed an issue where a retrieved Reaction object could be null.
- [EasyIM SDK] Fixed a database loading failure on older phones.

## v3.9.3 2022-5-26

#### New features:

- [EasyIM SDK] Added [message threads (Message Thread)](thread_message.html).

#### Improvements:

- [EasyIM SDK] Improved network connections to enhance network access performance.
- [EasyIM SDK] Improved the [roaming message retrieval API](message_retrieve.html) by adding a parameter that specifies the message retrieval direction.

## v3.9.2.1 2022-5-17

#### New features:

- [EasyIM SDK] Added [message Reaction](reaction.html), allowing different responses to messages.
- [EasyIM SDK] Added the [reporting API](moderation.html) for content moderation.

#### Improvements:

- [EasyIM SDK] Improved retrieval of server access points (dnsconfig).
- [EasyIM SDK] Improved data reporting.
- [EasyIM SDK] Changed the libsqlcipher filename to avoid conflicts when using the official AAR.
- [EasyIM SDK] Added support for setting double- and float-type attributes in the ext attribute of the EMMessage class.
- [EasyIM SDK] Replaced the openssl dependency with boringssl.
- [EasyIM SDK] Changed the minimum supported SDK version to 21 (Android5.0).
- [EaseCallKIt] Upgraded the Agora RTC SDK to version 3.6.2.

#### Fixes:

- [EasyIM SDK] Fixed an encryption algorithm issue reported when publishing on Google Play.
- [EasyIM SDK] Fixed an issue where the Translation API did not work.

## v3.9.1.1 2022-4-27

#### Fixes

- [EasyIM SDK] Fixed an occasional issue where retrieved historical messages could not be displayed properly.

## v3.9.1 2022-4-19

:::tip
Only V3.9.1 and earlier support private deployment.
:::

#### New features

- [EasyIM SDK] Added [presence subscription](presence.html).

#### Improvements

- [EasyIM SDK] Shortened the message sending timeout.
- [EasyIM SDK] Added priority settings for the DNS server address list. HTTP and TCP requests are sent according to the priority of DNS server addresses during retries, improving the request success rate.
- [EasyIM SDK] Upgraded the SDK versions of OPPO Push, from version 2.1.0 to version 3.0.0, and vivo Push, from version 2.3.1 to version 3.0.0.4_484, on which the EasyIM SDK depends.

#### Fixes

- [EasyIM SDK] Fixed a PendingIntent issue and removed an EasyIM warning when publishing on Google Play.

## v3.9.0 2022-2-22

#### New features

- [EasyIM SDK] [EaseIMKIt] Added the [one-way server-side conversation deletion API](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_manager.html#a345e81b9caf2658c8796855fe63fe752).
- [EasyIM SDK] The Push platform now supports retrieving push extension fields, follow-up actions, badge settings, command messages, and other features. See [Android push integration](https://docs-im.easemob.com/push/apppush/androidsdk).
- [EasyIM SDK] Added error code [221 USER_NOT_ON_ROSTER], indicating that non-friends cannot send messages.
- [EasyIM SDK] [EaseIMKIt] Added support for recalling messages through the REST API.

#### Improvements

- [EasyIM SDK] Reduced the wait time for sending messages on weak networks.

#### Fixes

- [EasyIM SDK] Fixed an issue where a message sending retry was interrupted by the connection success event.
- [EasyIM SDK] Fixed a memory leak.
- [EasyIM SDK] Fixed a crash caused by negative time statistics.

## v3.8.9.1 2021-12-30

#### Fixes

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

## v3.8.8 2021-12-06

#### Added

- [EasyIM SDK] Added an API for retrieving login status.

#### Updates

- [EasyIM SDK] Updated some function names and comments.
- [EasyIM SDK] Improved push token update logic to reduce the number of server requests.
- [EasyIM SDK] Improved login speed.
- [EasyIM SDK] Improved handling of chat group messages when the Token expires.
- [EasyIM SDK] EMOptions now uses HTTPS only by default.

#### Fixes

- [EasyIM SDK] Fixed incomplete retrieval of historical roaming messages.
- [EasyIM SDK] Added push support for HONOR phones.
- [EasyIM SDK] Fixed crashes in some scenarios.
- [EaseIMKIt] Fixed incorrect unread-message status display in some scenarios.
- [EaseIMKIt] Fixed crashes in some scenarios on older devices.
- [EaseIM App] Fixed an issue where user information was not completely cleared during logout.

**`Note:`** **This version has an occasional issue where the database cannot be opened properly. Use version 3.8.9.1.**

## v3.8.7 2021-10-22

#### Added

- When using Token login, the upper-layer app now receives a callback when the Token expires.

#### Changes

- Fixed a transport encryption issue in some scenarios.

## v3.8.6.1 2021-10-12

#### New features

- [EasyIM SDK] Enhanced the security of locally stored data.
- [EasyIM SDK] Enhanced the security of data in transit.
- [EasyIM SDK] Added a distinct error code reported when a globally muted user sends a message.

#### Updates

- [EaseIMKIt] Moved the voice message button event on the chat page to the APP layer.
- [EasyIM SDK] Checks whether to is empty when sending ReadAck.

#### Fixes

- [EasyIM SDK] Fixed an app crash caused by the WAKE_LOCK permission.
- [EasyIM SDK] Removed custom certificate exception logging.
- [EaseIMKIt] Fixed an issue where the user nickname was not displayed after a location message was received in the regular conversation list.

**`Note:`**

1. **Starting with 3.8.6.1, we release Dev and Stable versions in parallel. Users can choose the version that meets their needs.**
   Stable: Based on a development version, provides stable features, continuously fixes bugs, and can be used to release apps.
   Dev: The latest version, includes the latest features, is released periodically, and can be used for evaluation.
2. **`V3.8.6.1 Dev supports HTTPS only.` If your project (Appkey) is configured to use HTTP, do not upgrade to this version; otherwise, HTTP users will be unable to log in normally. If you do not upgrade to this version, you are not affected.**

## v3.8.5 2021-09-10

#### New features

- [EasyIM SDK] Strengthened security protections for user logs.

#### Updates

- [EasyIM SDK] Device IDs are now generated randomly.
- [EasyIM SDK] Removed the dependency on FCM 11.4.0 and moved FCM logic to the app layer.
- [EasyIM SDK] If EMOptions#setAutoTransferMessageAttachments(false) is set, the SDK no longer checks whether attachments exist when sending messages.
- [EaseIMKit] Exposed the successful message sending callback onChatSuccess in EaseChatFragment.
- [EaseIM] Moved FCM logic to the app layer and upgraded FCM Messaging to version 22.0.0. [See FCM integration details](https://docs-im.easemob.com/im/android/push/thirdpartypush#sdk_385_版本之后集成方式).

#### Fixes

- [EasyIM SDK] Fixed a crash caused by database corruption in some scenarios.
- [EaseIMKit] Fixed inaccurate initial-letter recognition in the contact list.
- [EaseIMKit] Removed the Baidu Maps so file.
- [EaseCallKit] Fixed an issue where setting the Agora appId did not take effect.
- [EaseCallKit] Fixed a crash caused by an empty user ID in some scenarios.
- [EaseCallKit] Fixed an issue on Android 11 phones where audio and video were interrupted when the audio and video screen was moved to the background.

## v3.8.4 2021-08-03

#### New features

- [EasyIM SDK] Added one-to-one 1v1 Do Not Disturb.

#### Updates

- [EaseIM App] Added a one-to-one 1v1 Do Not Disturb switch.
- [EasyIM SDK] Added a deprecation annotation to EMCmdMessageBody#getParams.
- [EasyIM SDK] Updated API comments.
- [EasyIM SDK] Removed the collection of unnecessary device information.
- [EasyIM SDK] Added an error code indicating that a spam message was intercepted.

#### Fixes

- [EasyIM SDK] Fixed an issue where the APP incorrectly determined whether it was running in the foreground or background.
- [EaseIM App] Fixed an issue where a pinned conversation was not kept at the top when a new message arrived.
- [EaseIM App] Fixed an issue where users who had not been added as friends appeared in the friend list.
- [EaseIMKIt] Fixed an issue where long-press events did not work when text supported hyperlinks.

## v3.8.3 2021-07-09

#### Updates

- [EasyIM SDK] Added protections for some methods in EMClient.
- [EasyIM SDK] Removed location retrieval logic from the SDK.
- [EasyIM SDK] Removed permission declarations from AndroidManifest in the SDK.

#### Fixes

- [EaseIMKIt] Fixed an issue where the send-failure icon and read indicator overlapped in some scenarios.
- [EaseIMKIt] Fixed a crash when long-pressing a chat item in some scenarios.
- [EaseIMKIt] Fixed an issue where an empty layout was displayed when no header layout was configured for the friend list.
- [EaseIMKIt] Fixed a crash caused when received image or video covers did not have width and height set.
- [EaseIM] Fixed an issue where an admin could no longer add a user as a friend after adding that chat group member to the blocklist.
- [EaseIM] Fixed an issue where contact cards could not be sent in chat groups and chat rooms.
- [EaseIM] Fixed an issue where chat group names were not displayed in the conversation list.

## v3.8.2 2021-06-05

#### New features:

- [EasyIM SDK] Added exception event reporting. It must be enabled and does not report by default.
- [EasyIM SDK] Added an error code for messages intercepted by a pre-delivery callback.
- [EasyIM SDK] Added support for different apps with the same Appkey using different message filtering rules.

#### Fixes:

- [EasyIM SDK] Added localpath to the conversation list so that voice/video/image messages in a retrieved conversation list can be downloaded.
- [EasyIM SDK] Fixed an issue where the app could go offline after remaining in the foreground for a long time in certain scenarios.
- [EasyIM SDK] Fixed an attachment upload failure when the attachment contained %.
- [EasyIM SDK] Added descriptive information when the login API is used while a user is already logged in, distinguishing the currently logged-in user.
- [CallKit] Added interoperability with mini programs and display of user avatars and nicknames.

## v3.8.1 2021-04-13

#### New features:

- [EasyIM SDK] Added APIs for setting and retrieving user attributes. For integration details, see [User attributes](userprofile.html).
- [EaseIM App] Added storage and display of user profiles, such as avatars and nicknames.
- [EaseIM App] Added sending and display of user contact card messages, implemented using custom messages.

#### Fixes:

- [EaseIMKIt] Fixed an issue where duplicate messages were sent when sending multiple messages with attachments.
- [EaseIMKIt] Fixed a display issue caused by sorting when registering chat types.
- [EaseIMKIt] Added an API for setting message attributes before sending a message (OnAddMsgAttrsBeforeSendEvent).
- [EaseIMKIt] Fixed an issue where an avatar set for an item on the chat page was obscured by the default avatar.
- [EaseIMKIt] Improved file upload logic and fixed an issue where files could not be uploaded in some scenarios (EaseFileUtils).
- [EasyIM SDK] Fixed an issue where the file length was not set when uploading a file message.
- [EasyIM SDK] Fixed an issue where conversation list messages were incomplete after the database was migrated from 2.0 to 3.0 in SDK versions after 3.5.3.

#### Update (2021-05-08):

- [EaseCallkit] Changed the method for joining an Agora channel to use a numeric uid, adding interoperability with mini programs. `This is not interoperable with previous versions.` See the [EaseCallKit User Guide](easecallkit.html).

```
**Major change:**
```

All remote repositories have migrated from JCenter to `MavenCentral`, and the dependency library domain has changed from “com.hyphenate” to `“io.hyphenate”`. For details, see [Android SDK introduction and import](https://docs-im.easemob.com/im/android/sdk/import).

## v3.8.0 2021-02-27

New features:

- [EaseCallkit] Released EaseCallKit, modularizing the call functionality as EaseCallKit.
- [EasyIM SDK] Added APIs for batch operations on chat group members.
- [EasyIM SDK] Added the getContactsFromLocal() method.

#### Updates:

- [EasyIM SDK] Starting with 3.8.0, the SDK is renamed com.hyphenate:hyphenate-chat:x.x.x, publishes only EasyIM functionality, and removes EasyIM audio and video functionality.
- [EaseIM App] The EasyIM app now depends on Agora audio and video functionality.

#### Fixes:

- [EasyIM SDK] Fixed a problem requesting a Token when the username was empty in extreme circumstances.
- [EasyIM SDK] Added the PermissionType attribute to EMGroup and EMChatRoom to determine roles.
- [EasyIM SDK] Fixed an issue where the file length was not set when sending a file message.
- [EaseIMKit] Fixed an issue where an empty layout was not displayed after all data was deleted from the conversation list page.

#### Note

- **To provide better services, starting with 3.8.0 the SDK no longer provides audio and video functionality. Instead, EaseCallKit provides a reference implementation based on the Agora SDK. Calls made using this solution are not interoperable with previous versions. Choose whether to use the new solution or continue using a previous version based on your circumstances.**
- In addition to being available as a remote library, EaseCallKit source code is also published. For details, see the [EaseCallKit User Guide](https://docs-im.easemob.com/im/android/other/easecallkit).

## v3.7.6 2021-09-17

#### Fixes:

- [EasyIM SDK] Removed location retrieval logic from the SDK.
- [EasyIM SDK] Removed permission declarations from Android Manifest in the SDK.
- [EasyIM SDK] Removed the collection of unnecessary device information.
- [EasyIM SDK] Fixed an occasional null-pointer bug in audio and video calls.

## v3.7.5 2021-06-05

Fixes:

- [EasyIM SDK] Fixed a bug where the app could go offline after remaining in the foreground for a long time in certain scenarios.

`**Note:**` This version can be retrieved only from `MavenCentral`, and the dependency library domain has changed from “com.hyphenate” to `“io.hyphenate”`. For details, see [Android SDK introduction and import](https://docs-im.easemob.com/im/android/sdk/import).

## v3.7.4 2021-02-04

New features:

- [EasyIM SDK] Added a conversation read ack API.
- [EasyIM SDK] Added an API for retrieving the conversation list.
- [EasyIM SDK] Added an API for searching custom messages, whose message type is CUSTOM.

Updates:

- [EaseIMKit] EaseChatLayout now provides a method for intercepting presses on the recording button (OnChatRecordTouchListener).
- [EaseIMKit] Added an API for setting message attributes, such as ext, before sending a message (OnAddMsgAttrsBeforeSendEvent).
- [EaseIMKit] Added logic for sending conversation read receipts, reducing the number of message receipts (read ack) sent.
- [EaseIM App] Added logic for retrieving the conversation list from the server. Activation is required.

Fixes:

- [EasyIM SDK] Fixed some duplicate HTTP requests.
- [EasyIM SDK] Removed logic for retrieving the device IMEI.
- [EaseIMKit] Fixed an issue where animated images did not send read receipts (read ack).
- [EaseIMKit] Fixed an issue where nicknames or Easemob IDs were not displayed on the chat group conversation page.
- [EaseIMKit] Fixed an issue where retrieved historical messages were not displayed after message roaming was enabled.
- [EaseIMKit] Fixed an issue where the copy function was intercepted after the message long-press event was intercepted on the chat page.
- [EaseIMKit] Fixed an issue where the "typing" status on the chat page did not disappear.
- [EaseIM App] Fixed an occasional issue where chat group names were not displayed after logging in following the app's initial installation.
- [EaseIM App] Fixed a crash when the group owner @-mentioned members in a group chat.
- [EaseIM App] Fixed an issue where the unread count on the home-page conversation tab was not updated after a conversation was deleted.
- [EaseIM App] Fixed an issue where chat group messages were not received after Do Not Disturb was enabled for chat group messages.
- [EaseIM App] Fixed a crash when searching for a public chat group by ID.

## v3.7.3 2020-12-31

#### New features:

- [EaseIMKit] EaseIMKit, the upgraded version of EaseUI, was officially released as a remote dependency library. Its version number is the same as the EasyIM SDK version. For details, see the [EaseIMKit User Guide](https://docs-im.easemob.com/im/android/other/easeimkit).

#### Updates:

- [EasyIM SDK] Increased the audio bitrate during Android audio and video calls to improve sound quality.

#### Fixes:

- [EasyIM SDK] Fixed a crash caused by transport encryption under special circumstances.
- [EasyIM SDK] Fixed some Android security issues and removed unnecessary app monitor keep-alive functionality.
- [EasyIM SDK] Fixed an issue where the message body could not be updated when calling the updateMessage API.
- [EasyIM SDK] Fixed an issue where the filename could not be retrieved correctly when sending an image message on phones running Android Q or later.
- [EasyIM SDK] Fixed an issue where calling the ackMessageRead API to send a read receipt failed after a local message was deleted.

**Note:**

1. In addition to being available as a remote library, EaseIMKit source code is also published. For details, see the [EaseIMKit User Guide](https://docs-im.easemob.com/im/android/other/easeimkit).
2. The new app, EaseIM App, uses a new Appkey. You cannot use a previous account to log in and must register again.

## v3.7.2 2020-10-30

- Processed read ack sent by the same ID on other devices, synchronizing the read status across multiple devices.
- Fixed inaccurate network connection detection for devices using wired networks.
- Improved the speed of joining chat rooms and chat groups and reduced the number of server requests.
- Error code USER_NAME_TOO_LONG is returned when a registered username exceeds 64 characters.
- Fixed chat group announcement length validation.
- Fixed a bug where quality-first 1v1 did not take effect for the callee.
- Fixed a bug where local previews were not displayed properly when external data was input.
- Fixed message callback errors in extreme circumstances.
- Fixed an occasional ExecutorService null-pointer issue.
- Fixed an issue where the invitation text when adding chat group members could only be “welcome”.
- Fixed a security risk in setHostnameVerifier.
- Fixed an exception in delete requests on Android API versions earlier than 21, excluding 21.
- Added a synchronization lock to getCurrentUser in Emclient, fixing an occasional crash.

## v3.7.1 2020-08-27

#### New features:

- Added an RTC API for setting quality priority.
- Added an RTC API for setting the URL used to retrieve the cluster proxy.
- Added an API for displaying push details.

#### Updates:

- Upgraded the OPPO Push SDK to version 2.1.0.
- Modified the API for updating the push nickname.

#### Fixes:

- Fixed an issue where the recipient could not retrieve the image width and height when an original image was sent.

## v3.7.0 2020-07-29

#### New features:

- Implemented RTC quality monitoring and reporting of RTC quality data.
- Added audio-only stream publishing with configurable audio parameters.
- Added an API for publishing group streams to a CDN.
- Added an API for custom recording when publishing streams to a CDN.
- Added an API for specifying whether to retain a conversation when leaving a chat room.
- Added an API for setting the heartbeat interval.
- Enabled the push option by default for 1v1 calls in the Demo.
- Added small floating windows for 1V1 audio and video calls.
- Added callbacks for no video or audio data due to network or other exceptions.
- Added callbacks for sending and receiving the first frame of audio and video data.

#### Fixes:

- Fixed a bug where localpath was empty when constructing an image message.
- Fixed a bug where sending an image message might delete the original image.

## v3.6.9.1 2020-06-29

#### Fixes:

- Fixed an issue where the REST Server port setting did not take effect.

## v3.6.9 2020-06-23

New features:

- Added an API for enabling and disabling whiteboard interaction.
- Added a parameter for enabling and disabling interaction when creating a whiteboard.
- Added restrictions on desktop sharing streams.
- Added a callback for failed desktop stream publishing.

Fixes:

- Fixed blurry local previews.
- Fixed an issue where the remote display was abnormal when the local device was in landscape orientation.
- Fixed an issue where the local camera could not be switched when a video call was disconnected.
- Fixed an issue where the Demo returned directly to the home screen after leaving a conference on a Huawei p20 pro phone.

## v3.6.8 2020-06-09

New features:

- Added support for attachment download redirection.
- Added support for throwing a distinct exception when an image is detected as noncompliant.

Updates:

- Added compatibility with AndroidQ, including support for uploading attachments through Uri. For details, see [Send messages](https://docs-im.easemob.com/im/android/basics/message).
- Removed the apache jar package.

Fixes:

- Fixed an issue where admins could not be invited to an audio or video conference initiated by a chat group.

**Note: To make the SDK compatible with AndroidQ, the EaseUi library has also been updated accordingly. After upgrading the SDK to this version, you must update the EaseUi library dependency.**

## v3.6.7 2020-05-15

New features:

- Added support for cluster proxies.
- Implemented speaker on-stage and off-stage APIs in the SDK.
- Implemented mute management in the SDK.
- Added support for publishing streams to a CDN in the SDK.
- Added support for updating the layout of streams published to a CDN in the SDK.
- Added NV12 format support for external video input.
- Audio and video conferences in the Demo now use only standard mode.

Updates:

- Fixed an issue where the minimum video bitrate did not take effect.
- Fixed an issue in Android and iOS 1V1 video calls where, when Android switched between large and small screens, the remote device displayed a mirrored image.
- Upgraded the OPPO Push SDK to version 2.0.2. For manifest and other configurations, see Message push → Third-party push integration → OPPO Push integration.
- Added compatibility with AndroidQ.

## v3.6.6 2020-04-09

New features:

- Added an API for removing users from audio and video conferences.
- Added an API and callback for transferring the admin role in audio and video conferences.
- Added support for setting the maximum number of hosts, nickname, and extension when joining a room.
- Increased the default resolution to 480p.
- Added support for x86_64-bit so files.

Updates:

- Fixed an issue where the local image was displayed upside down in 1v1 landscape mode.
- Fixed interoperability between Android video conferences and mini programs in version 3.6.5.
- Fixed a crash when calling the unpublish() API twice in succession.

## v3.6.5 2020-03-13

New features:

- Added support for chat group and chat room allowlist management and mute-all functionality.
- Added support for user-defined message types.
- Added APIs for creating and joining a whiteboard.
- Added the video conference joinRoom API.
- Added error messages for an incorrect password when joining an audio or video conference or when the maximum number of hosts has been reached.
- Enabled DTX to reduce data usage while a user is muted.

Updates:

- Fixed a bug where others could not hear audio when only an audio stream was published in live mode.
- Fixed abnormal images caused by stretched display in video fill mode.

**Note: This version has a bug where mini program clients cannot see images in video conferences. Users who require interoperability should upgrade to the latest version as soon as possible.**

## v3.6.4 2020-02-12

New features:

- Added support for setting a video watermark.
- Added a parameter to the conference creation API to support mini programs. Mini programs are not supported by default.

Updates:

- Fixed a bug affecting interoperability with mini programs when joining an audio or video conference.
- Fixed an issue where the local view displayed the image upside down when the phone was rotated 90 degrees during a call.
- Fixed a crash when a speaker went off-stage.

## v3.6.3 2020-01-03

New features:

- Added support for external audio input APIs.
- Added support for setting private RTC server APIs.

Updates:

- Reduced the long-lived connection timeout.
- Fixed an issue where the read receipt callback was not triggered in extreme scenarios when synchronizing messages and read receipts across multiple devices.

## v3.6.2 2019-11-13

New features:

- Added the chat group receipt API. This is a value-added service; contact the Easemob business team for activation.
- Added a reminder callback when no audio or video data is received from the remote end.

Updates:

- Added support for H264 software encoding and decoding to improve audio and video call compatibility.
- For private deployment where dns is not enabled, the SDK does not attempt to retrieve the server list.
- Added key logs for audio and video functionality to facilitate troubleshooting.

Fixes:

- Fixed an issue where secret information was not saved correctly in specific scenarios.
- Fixed a reconnection bug when the network changed.
- Fixed a bug where bitrate limits did not take effect in some scenarios.

## v3.6.1 2019-07-20

New features:

- Added an API that allows a host to go off-stage.
- Added an API for globally searching local messages.
- Added an API for muting remote streams.

Updates:

- Improved how the SDK loads dynamic libraries.
- Removed the unnecessary libsqlcipher.so to reduce SDK size.
- Upgraded the glide library in Easeui to version 4.x.

Fixes:

- Fixed inaccurate call status callbacks.
- Fixed slow connection rebuilding on some devices when the app returned from the background to the foreground.
- Fixed an issue where setRotation() did not take effect in some scenarios during audio and video calls.
- Fixed a delay in displaying the size limit message for uploaded files that exceeded the limit.

## v3.6.0.1 2019-06-21

Fixes:

- Fixed an issue where initiating a group conference failed in some cases when loading the full SDK through gradle.

## v3.6.0 2019-05-28

New features:

- Added conference attributes, which make it easier to use audio and video conferences in specific scenarios. For details, see the audio chat Demo.
- Added background audio for audio conferences. For details, see the audio chat Demo.
- Added corresponding error codes returned when an attachment is too large and when an attachment has expired or does not exist.
- Added parameters when initiating a call and creating a conference to specify whether to enable server-side recording and whether to combine streams during recording. You can query the recording on the server by recording ID.
- Added support for customizing the size of image message thumbnails.

Updates:

- Upgraded the audio and video engine, improving noise cancellation and performance and reducing call setup time.
- Temporarily removed on-device recording starting with version 3.6.0. Mobile clients can use SDK parameters to configure whether each call is recorded on the server. If the Web client also requires recording, contact the Easemob business team to enable recording on all clients. Once enabled, this feature takes precedence over the SDK parameter configuration.
- Improved the batch message saving method by acknowledging messages to the server after they are saved in a batch, fixing an issue where messages were not saved correctly in extreme scenarios.
- Corresponding error codes are returned when the audio and video service has not been activated or has an overdue balance when a call is initiated or a conference is created.
- Modified the custom local video data API for one-to-one video calls.

Fixes:

- Fixed an issue where the message count did not increase correctly when saving messages.

## v3.5.6 2019-05-16

- Fixed a bug where an exception during received-message storage prevented messages from being stored properly.
- When adding the dependency using gradle, use: api 'com.hyphenate:hyphenate-sdk:3.5.6.1'

## v3.5.5 2019-04-24

- Added the EMStreamParam#setUsingExternalSource(boolean) API to support using the EMConferenceManager#inputExternalVideoData() API in audio and video conference mode.
- Fixed an issue where 1v1 calls between chrome 72+ and Android devices could not connect.
- Fixed a potential crash when using third-party push in the SDK.
- Fixed some bugs in the Demo layer.

## v3.5.4 2019-03-26

New features:

- Added support for Oppo, Vivo, and Meizu Push. For details, see [Third-party push integration](https://docs-im.easemob.com/im/android/push/thirdpartypush).

Improvements:

- Improved the third-party push integration APIs. For details, see [Third-party push integration](https://docs-im.easemob.com/im/android/push/thirdpartypush).
- Improved some error code return values to provide more specific causes.

Fixes:

- Fixed audio and video call connection failures in certain cases.
- Fixed some bugs in the Demo layer.

**Note:**

- For OPPO Push, we changed the Demo package name to com.hyphenate.chatuidemo.push. To test OPPO Push in the EasyIM Demo, change the Demo package name yourself.

- `When registering for push on a Huawei phone in V3.5.4, an exception occurs. This bug was fixed in V3.5.5 and later. We recommend that users who have not integrated the SDK or are using V3.5.4 upgrade to a later SDK version.`

## v3.5.3 2019-01-18

Fixes:

- Fixed an issue where sending messages with an ID containing uppercase letters failed in some cases.
- Fixed an issue where debug log could not be disabled.
- Fixed an issue where the current user ID could still be retrieved during logout.
- Fixed an issue where joining an audio or video conference for the second time failed in some scenarios.
- Fixed an issue where audio and video calls could not be made on a shared network.
- Fixed an issue where a conversation could not be loaded when sending a message to yourself.
- Fixed an issue where setting the video call resolution in the Demo settings did not take effect.

Improvements:

- Upgraded sqlite to 3.26.0.
- Improved audio and video call logic to increase the audio and video call connection rate.
- Added compatibility with android 9.0.

```
Currently, the EasyIM SDK and Demo are fully compatible with 9.0. The build environment configuration is as follows:
 - Android Studio version: 3.2.1
 - project-level/build.gradle version config:
   buildscript {
    ext.kotlin_version = '1.2.71'
    repositories {
        jcenter()
        maven {
            url 'https://maven.google.com/'
            name 'Google'
        }
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.2.1'
    }
   }
 - module-level/build.gradle version config:
   android {
    compileSdkVersion 28
    buildToolsVersion '28.0.3'
    defaultConfig {
        minSdkVersion 16
        targetSdkVersion 28
    }
   }
 - gradle version (path: project-dir/gradle/wrapper/gradle-wrapper.properties):
   distributionUrl=https\://services.gradle.org/distributions/gradle-4.6-all.zip
 - Android Support-Library related:
   'com.android.support:design:28.0.0-alpha1'

 Tip: Version updates download the corresponding build tools from Google websites and may require network access.
```

## v3.5.2 2018-11-02

New features:

- Removed methods deprecated in EasyIM SDK 3.2.0 and earlier.

```
The API changes are as follows. '-' indicates a deprecated API and '+' indicates its replacement.

-  public int EMChatRoom#getAffiliationsCount();
+  public int EMChatRoom#getMemberCount();

-  public int EMGroup#getAffiliationsCount();
+  public int EMGroup#getMemberCount();

-  public void EMContact#setNick(String nick);
+  public void EMContact#setNickname(String nick);

-  public String EMContact#getNick();
+  public String EMContact#getNickname();
```

- Added the EMCallSurfaceView#setCoverImage(Bitmap bitmap) API. When the EMCallSurfaceView is set through EMConferenceManager#updateLocalSurfaceView(EMCallSurfaceView) or EMConferenceManager#updateRemoteSurfaceView(String, EMCallSurfaceView), the view displays the Bitmap before the stream arrives.

Fixes:

- Fixed a potential memory leak after an audio or video call.
- Fixed a bug where, if there was no network during automatic login, the IDs retrieved for the user's logins on other devices included the current device's ID.
- Fixed a bug in the server list update when connection failed in certain cases.
- Fixed a bug where the value retrieved after EMMessage#setLocalTime(long serverTime) was set was negative on 32-bit devices.

## v3.5.1 2018-09-13

New features:

- Added EMConferenceManager#updateVideoMaxKbps(int maxKbps), an API for dynamically modifying the maximum video bitrate for group real-time audio and video.
- Added EMVideoCallHelper#startAudioRecord(String dirPath) and EMVideoCallHelper#stopAudioRecord(), which record audio separately for 1v1 real-time audio and video.

Fixes:

- Fix: Fixed an issue with answering a regular phone call during a real-time audio or video call in the Demo.

Improvements:

- Improved screen sharing performance.

## v3.5.0 2018-08-13

New features:

- To meet the needs of different scenarios, starting with version 3.5.0, real-time audio and video conferences are divided into different types. Each type corresponds to different scenarios, allowing you to easily integrate real-time audio and video into your app or website. The types are as follows:

```
   1. Communication: A standard communication conference supporting up to 6 participants. Every participant can speak and publish video freely. This conference type does not re-encode audio on the server and provides the best audio quality. It is suitable for scenarios such as telemedicine and online customer service.
   2. Large Communication: A large communication conference supporting up to 30 participants. Every participant can speak freely, and up to 6 participants can publish video. This conference mode mixes audio on the server and supports more speakers. It is suitable for scenarios such as large conferences.
   3. Live: An interactive video conference supporting up to 6 hosts and 600 audience members. Audience members can interact with hosts by connecting to speak. This conference type is suitable for scenarios such as online education and interactive live streaming.
```

## v3.4.3 2018-07-17

1. Fixed a crash when selecting 'Take photo' from the extension options in a chat on devices running Android 7.0 or later.
2. Added the 'deliver only to online users' message attribute to reduce message volume. Currently, it supports only CMD messages. Set this attribute through `EMCmdMessageBody#deliverOnlineOnly(true)`.

## v3.4.2 2018-06-19

New features:

1. Added the joinConferenceWithTicket() API to group conferences.
2. Added conference invitations through messages.
3. Added compatibility with Android 8.

Fixes:

1. Fixed a bug where video was not displayed during a video call between a mobile client and chrome.
2. Fixed an Android call crash when hanging up in extreme circumstances.

Improvements:

1. Implemented a new UI for audio and video conferences.
2. Improved the logic when a device has both FCM and Huawei Push. Use the `EMOption#setUseFCM()` API.

**The EMOption#setUseFCM() API lets you specify whether to enable Google Push without configuring it in the backend. It defaults to true, meaning FCM Push is preferred if the user's phone has google play service and an FCM number is configured. If you have only users in China, we recommend disabling this option. For details, see the Demo implementation.**

**Note: To provide a high-quality, consistent audio and video experience, starting with version 3.4.1, 1v1 calls are no longer compatible with version 3.1.5 and earlier. Upgrade promptly.**

## v3.4.1 2018-05-11

SDK:

1. Fixed inaccurate conversation unread message counts on Android.
2. Fixed an issue where Huawei Push was sometimes unavailable during automatic login.
3. Fixed a potential nullpointer error during initialization when the app was run for the first time after installation.
4. Attempted to resolve a crash in the sendDeviceToServer() method.
5. Implemented weak network detection and alerts for audio and video.
6. Implemented verification message entry when joining a chat group.
7. Added a notification indicating that a user was kicked out of a chat room when the chat room was disconnected.
8. Improved 1v1 calls.

EaseUI:

1. Updated message sending logic to resolve duplicate and out-of-order messages.

**Note: To provide a high-quality, consistent audio and video experience, starting with version 3.4.1, 1v1 calls are no longer compatible with version 3.1.5 and earlier. Upgrade promptly.**

## v3.4.0.1 2018-04-13

New features:

1. Moved Huawei Push integration from the SDK to the app layer. The SDK provides an API that users call to upload a Huawei Push Token, allowing them to upgrade Huawei Push themselves when it is updated. See the [3.4.0.1 Huawei Push change documentation](https://docs-im.easemob.com/im/android/push/thirdpartypush#华为hms推送集成).

## v3.4.0 2018-04-04

New features:

1. Added an API for specifying whether to use FCM Push. Configure it through the `setUserFCM()` method of `EMOptions`.
2. Added audio conferences. See [Group audio and video conferences](https://docs-im.easemob.com/im/android/basics/multiuserconference).

Fixes:

1. Fixed a bug where Huawei Push notifications could not be received after an overwrite installation.
2. Fixed a bug where the Token was not updated when downloading an attachment.

## v3.3.9 2018-02-11

1. Implemented chat group message read receipts in the Demo layer. The sender defines a custom field in EMMessage.ext to indicate whether a read receipt is required, and the recipient implements the read receipt using a CMD message.
2. Simplified the Demo implementation and removed red packets from the Demo.
3. Improved reconnection logic, resolving service connection timeouts for some users after user migration and server attacks.
4. Fixed an inaccurate conversation message count returned by EMConversation#getAllMsgCount().
5. Fixed a bug where sending multiple messages with attachments while loading more historical messages from the database caused duplicate messages to be displayed on weak networks.
6. Added compatibility for an issue where SharedPreferences#Editor#apply() did not take effect on some '1+' phones.

## v3.3.8 2018-01-24

1. Added a service diagnostics API.
2. Added an API for setting the audio bitrate.
3. Improved reconnection logic to reduce the number of reconnections.
4. Added messages indicating that the limits for registered users and created chat groups/chat rooms have been reached in the Community Edition SDK.

## v3.3.7 2017-11-30

Fixes:

1. Fixed a null-pointer issue when registering a Huawei Push Token while using Huawei Push.
2. Fixed a crash in callbacks received by other chat room members when a chat room announcement was updated.
3. Fixed duplicate messages in memory caused when the timestamps of saved or inserted messages differed from those of existing local messages.
4. Fixed an issue where messages could not be loaded correctly when they had the same timestamp.
5. Fixed inconsistent ordering of cmd and regular messages caused by offline messages in some scenarios.

## v3.3.6 2017-11-03

New features:

1. For new APIs, see [3.3.6 API changes](https://docs-im.easemob.com/im/android/sdk/3.3.6apichange).
2. Added support for setting the audio source when using an external audio input source for audio and video calls.
3. Added an option for handling attachment uploads and downloads yourself.
4. Added an option for automatically downloading attachments in attachment messages, including thumbnails and voice files.
5. Added group audio and video conferencing. For details, see the integration documentation for [Group audio and video conferences](https://docs-im.easemob.com/im/android/basics/multiuserconference).

Improvements:

1. Changed the EaseChatRow implementation in easeui to ensure that message sending callbacks execute properly.
2. When using the SDK download API, if a file with the same name already exists locally, a number is appended to the original filename to create the new filename.

Fixes:

1. Fixed a null-pointer issue when registering a Huawei Push Token while using Huawei Push.
2. Fixed a crash in callbacks received by other chat room members when a chat room announcement was updated.
3. Fixed duplicate messages in memory caused when the timestamps of saved or inserted messages differed from those of existing local messages.

## v3.3.5_r1 2017-10-25

Fixes:

1. The SDK no longer attempts to load sqlcipher. Some phones have sqlcipher integrated into the system and search for the corresponding Java code, causing 3.3.5 to fail to load.

## v3.3.5 2017-10-23

New features:

1. Increased transport security.
2. Added FCM Push support.

Improvements:

1. Added an API for configuring dns for private deployment.
2. Improved private deployment reconnection logic.
3. Limited the username length to 255.
4. APIs for features that require server activation now return SERVICE_NOT_ENABLED(505).

Fixes:

1. Fixed an occasional message sending failure when switching between 4G and wifi.
2. Fixed a JobService crash on VIVO phones.

## v3.3.4 R1 2017-08-09

Fixed a bug where sending a message failed when the username contained an underscore.

## v3.3.4 2017-08-04

New features

1. For newly added APIs, see [3.3.4api changes](https://docs-im.easemob.com/im/200androidclientintegration/3.3.4apichange).
2. Added an API for retrieving historical messages (message roaming). `Contact the Easemob business team to activate this feature.`
3. Added support for sending messages and files between PC and mobile clients.
4. Added message recall APIs and callbacks. `Contact the Easemob business team to activate this feature.`
5. Added support for the new Huawei Push functionality (HMS).

## v3.3.3 2017-07-21

New features

1. For newly added APIs, see [3.3.3api changes](https://docs-im.easemob.com/im/200androidclientintegration/3.3.3apichange).
2. Added support for logging in to the same account on multiple devices and synchronizing messages and friend and chat group operations between those devices. Multi-device login is a value-added service; contact the Easemob business team for activation.
3. Added the file size attribute to chat group shared files.
4. Added an API for retrieving the list of devices logged in to the same account, with the option to kick a device offline.

Issue fixes

1. Fixed an issue where cursor could not be passed to the API for retrieving chat room members by page.
2. Fixed a bug where no information was included when inviting chat group members.
3. Fixed an issue where all joined chat groups had to be retrieved before performing chat group operations.
4. Fixed an issue where the name of an attachment message was not displayed correctly when right-clicking and saving it in EasyIM Web.
5. Fixed garbled display of Chinese shared filenames on android.
6. Fixed a bug where an attachment download was still reported as successful when the attachment path did not exist or could not be opened.
7. Fixed a crash when switching accounts in some scenarios.
8. Fixed an issue where the last-page cursor was not updated when retrieving chat group members.

## v3.3.2 2017-05-18

1. Added APIs related to chat group and chat room announcements.
2. Chat groups now support uploading and downloading shared files.
3. Chat groups now support setting extension attributes.
4. EMLocalSurfaceView and EMOppositeSurfaceView have been merged into the EMCallSurfaceView control.
5. The Demo and EaseUI now use a pure Android Studio structure and no longer support Eclicpse import.
6. easeui does not include the SDK jar and so files. To use it, copy the library files under libs yourself or run copyLibs.sh to copy them.

## v3.3.1 2017-04-07

New features:

1. Added the Token login API.
2. Added callbacks for chat group members joining and leaving chat groups.

Improvements:

1. Changed red packet integration in the Demo to aar, with Alipay channel payments supported by default.

Fixes

1. Previously, the message corresponding to EMChatManager.getMessage was stored in the cache. Messages produced by getMessage are no longer cached. The previous implementation caused some loadMoreMessage messages not to be displayed.
2. In the 3.3.0 Demo, the list displayed by the chat group @ key did not include chat group admins.
3. EMGroup.getMuteList crashed in version 3.3.0.
4. EMChatRoom had an incorrect hash code in version 3.3.0.
5. Fixed an issue where multiple apps received notifications when they were the callee in an audio or video call.

## v3.3.0 2017-03-07

New features:

1. Revamped chat groups and chat rooms: Added admin permissions, muting, and admin addition and removal; added support for retrieving member, mute, and admin lists in batches; and added comprehensive chat room functionality. For newly added APIs, see [3.3.0api changes](https://docs-im.easemob.com/im/200androidclientintegration/3.3.0apichange).
2. Improved handling of dns hijacking.
3. Added EMConversation.latestMessageFromOthers, representing the last message received from the other party.
4. Added EMClient.compressLogs to compress logs and added an example of sending logs by email to the Demo.
5. libs.without.audio continues to support armeabi, resolving support issues for armeabi-v5te.

Bug fixes:

1. Fixed a bug where the message unread count was 0 after upgrading from 2.x to 3.x.
2. Fixed an issue where the caller's ringtone was not played during a video call in the Demo.
3. Fixed incorrect text displayed after the caller successfully established a connection during a video call in the Demo.
4. Fixed an incorrect unread message count displayed after clearing messages from the Demo chat window, receiving a new message, and returning to the conversation list.
5. Fixed JobService errors on Oppo and Vivo phones.
6. Fixed an overflow error when the EMGroupManager.createGroup member list contained more than 512 entries.
7. Fixed slow message sending on some phones when switching networks.

## v3.2.3 2016-12-29

New features/improvements:

1. The SDK supports aar and gradle integration. For details, see [Import aar using gradle](https://docs-im.easemob.com/im/android/sdk/import#手动复制jar包及so导入).
2. Added APIs related to offline push settings. For details, see the EMPushManager API documentation.
3. To make the SDK simpler and easier to use, some APIs have been modified and others marked as "deprecated." For details, see [3.2.3api changes](https://docs-im.easemob.com/im/200androidclientintegration/3.2.3apichange). Deprecated APIs will be removed in 3-5 subsequent versions.
4. Improved loadAllConversationsFromDB() by changing it from a join query to separate queries of two tables, resolving slow execution on some LeTV phones.
5. Improved the login module to reduce the probability of login failures.
6. Because most phones on the market use armeabi-v7a or later architectures, starting with this version, standard armeabi so files are no longer provided, reducing app size during packaging.

Red packets:

Added:

1. Small random red packets.
2. Added advertising red packets. Contact the Easemob business team separately to use them.
3. Added advertising red packet configuration and statistics to the merchant backend.
4. Added password changes to the merchant backend.

Improvements:

1. Changed user verification after binding a card from four elements to two elements.
2. Added the ability to dismiss the keyboard by tapping a blank area on pages such as Send red packet.
3. Added support for common surnames and Chinese characters to the chat group member list index.

Bug fixes:

1. The recipient list on the red packet details page was incomplete.
2. The password field could not receive focus on Huawei P8 phones.
3. Some correctly entered bank card numbers were reported as incorrect.
4. Red packet greetings containing line breaks were displayed incorrectly.
5. Fixed garbled Emoji display.
6. Fixed an incorrect minimum red packet limit configured by merchants.
7. Fixed incorrect display order in balance details.

## v3.2.2 2016-12-2

New features/improvements:

1. Added APIs for setting audio and video parameters and specifying whether to send a push notification when the callee is offline.
2. Added an API for modifying the chat group description.
3. Changed the logic for deleting a friend: Added an API for deleting a friend and optionally deleting messages based on a parameter. Conversation messages are no longer deleted when the current user is passively deleted. To delete the conversation and its messages, call EMClient.getInstance().chatManager().deleteConversation(username, true) in onContactDeleted().

Bug Fix:

1. Fixed frequent heartbeats in some scenarios in version 3.2.1, reducing data and power consumption. We recommend upgrading to the latest version.
2. Fixed an issue where the call-end reason was not displayed correctly when the callee was offline.
3. Fixed a crash when retrieving the chat group member list in certain special circumstances.
4. Fixed a crash during logout in certain special circumstances.

Demo:

1. Added an audio and video parameter settings page to the Demo.

## v3.2.1 2016-11-12

New features/improvements:

1. Added paginated chat room list retrieval.
2. Added the ext parameter to the call initiation API to allow custom content.
3. Added the setUseHttps() API to EMOption.
4. Improved conversation loading speed.

Bug fixes:

1. Fixed a bug where the phone speaker might have no sound after using audio and video.
2. Fixed a potential phone crash when deleting an attachment immediately after sending a message.
3. Fixed an audio and video call freeze on some Meizu Blue phones.
4. Fixed a bug where there was no ringtone during calls in the Demo.
5. Fixed incorrect image display when using the rear camera during a video call.

## v3.2.0 2016-10-15

Audio and video include extensive upgrades and improvements. For details, see the integration documentation.

- Enhanced the adaptive video quality algorithm to dynamically adjust definition based on the network environment.
- Improved the voice algorithm for clearer calls.
- Added HD video support for more detailed image quality.
- Added client video and audio data callbacks.
- Added support for switching freely between landscape and portrait orientations.
- Added support for fit and fill image modes.

Red packet improvements:

- Added person-to-person transfers.
- Added a sound effect for opening red packets.

Other improvements:

- Actions beginning with “em\_” and “easemob::” in cmd messages are now reserved internal fields.
- Fixed inaccurate conversation unread message counts in certain cases.
- Fixed incorrect friend retrieval in certain cases.
- Fixed a bug where joining a chat room immediately after login failed in some cases.
- A message is displayed if the file content is too small when sending voice or video.
- Improved database read performance.

## v3.1.5 2016-8-26

1. Changed some API names, mainly to correct misspelled APIs. For details, see [3.1.5api changes](https://docs-im.easemob.com/im/200androidclientintegration/3.1.5apichange).
2. Improved friend retrieval speed.
3. Fixed a bug where calling login immediately in the callback of the logout method failed to log in.
4. Fixed an HTTPS security vulnerability and improved security.
5. Fixed a bug where pausing audio did not take effect during a real-time call.
6. Fixed a bug where `NetUtils.hasDataConnection()` returned false when using a wired connection.
7. Fixed a memory leak caused when sending a message.

## v3.1.4 2016-7-8

New features/improvements:

1. Added support for Huawei Push.
2. After retrieving chat room details, you can use the corresponding APIs to retrieve the member list and member count.
3. Added @ messages to easeui and the Demo.

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

## v3.1.3 R2 2016-6-15

1. Fixed an issue in R1 where third-party apps or SDKs could not catch app crashes.
2. Fixed a crash when using real-time calls on systems earlier than Android4.2.2 in R1.

## v3.1.3 2016-6-3

New features/improvements:

1. Added support for sorting messages by local time or server time.
2. Added dynamic bitrate support for real-time audio and video.
3. Added red packets, including one-to-one and group chat red packets, to the Demo.
4. Added compatibility with Android 6.0 runtime permissions to the Demo. The app now runs normally when targetSdkVersion is set to 23.

Bug fixes:

1. Fixed a delay when automatically accepting friend requests.
2. Fixed a potential video call crash when targetSdkVersion was set to 23.

## v3.1.2 R2 2016-4-29

Fixed a bug in R1 where calling `NetUtils.hasDataConnection()` on 4G returned false.

## v3.1.2 2016-4-25

New features:

1. Added the camera switching API for video calls: EMClient.getInstance().callManager().switchCamera().
2. Added the message search API: conversation.searchMsgFromDB().
3. Added support for setting and retrieving long-type extension fields.
4. Accelerated reconnection when the APP switches from the background to the foreground.
5. Improved GCM Push.

Bug fixes:

1. Fixed a bug where system emojis sent by some phones were received as garbled characters or blank content.
2. Fixed a bug in the previous version where the original image was deleted when a small image was sent as an image message.

## v3.1.1 2016-4-1

New features:

1. Added weak-network and network-disconnection detection to audio and video.
2. Added audio and video stream pause and resume functionality to audio and video.
3. Added recording to audio and video.
4. Images are now compressed by default when sent, reducing data usage.

## v3.1.0 2016-3-7

New features:

1. Added audio and video functionality, allowing users to establish one-to-one audio and video calls.
2. Added Android studio support.
3. Added x86 dynamic libraries for debugging in an emulator.

Bug fixes:

1. Fixed extension field parsing.
2. Fixed incomplete conversation ID display when a user ID contained an underscore.
3. Fixed an issue where creating a cmd message failed in some scenarios.

## v3.0.1 2016-2-26

1. Fixed an issue where some conversations could not be displayed after an overwrite installation upgrading from version 2.x to version 3.0.
2. Fixed an issue where push-related information was not uploaded successfully in some scenarios.

## v3.0.0 2016-2-19

1. New communication protocol: A new private protocol based on message synchronization is more stable and uses less data on unstable networks, ensuring reliable, ordered, real-time message delivery and providing greater security. It also provides better extensibility and will support more integration and device synchronization scenarios.
2. New SDK: The SDK has been comprehensively refactored to better encapsulate the core communication module, simplify APIs, provide a clearer structure and easier integration, and improve login speed and reliability on weak networks.
