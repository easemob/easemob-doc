# Android IM SDK Release Notes

## v5.2.1 Dev 2026-11-5

#### New features

- **[Multi-body messages](message_send.html#send-multi-body-messages)**: Carry up to 20 bodies in order within one message to send and display different content together. Adds `EMMessage#createMultiBodySendMessage(...)`, `getBodies()`, `setBodies(...)`, and `appendBody(...)` to create, read, and modify body lists; adds `getContentType()` and `EMMessage.Type.MULTIBODY` to identify multi-body messages. `EMClient#isConnected()` is deprecated.
- **[Query complete connection state](connection.html#retrieve-the-connection-state)**: Distinguish disconnected, connecting, and connected states to display connection progress and determine the current state. Adds `EMClient#getConnectionState()`, returning `DISCONNECTED`, `CONNECTING`, or `CONNECTED` from `EMConnectionState`.
- **[Configure the disconnection notification grace period](connection.html#configure-the-disconnection-notification-grace-period)**: After a connection has been established successfully, the SDK can defer notifications for recoverable disconnections such as network exceptions, reducing prompts caused by brief network fluctuations. Adds `EMOptions#setDisconnectNotifyThreshold(int seconds)` and `getDisconnectNotifyThreshold()` to set and query the period, defaulting to 10 seconds.
- **[Configure background message reception](push/push_overview.html#configure-background-message-reception)**: Choose to disconnect the IM persistent connection after entering the background and receive offline notifications through a valid push channel. Adds `EMOptions#setUsePushInBackground(boolean)` and `isUsePushInBackground()` to set and query the background push switch. If enabled and the push channel is valid, the SDK actively disconnects approximately 10 seconds after the app enters the background.
- **[Query push channel validity](push/push_overview.html#confirm-push-channel-validity)**: Determine whether a valid vendor push channel has been established to help choose a background message reception strategy. Adds `EMPushHelper#isPushTokenBound()` to query current push token binding state.

#### Improvements

- **[Streaming message extension updates](message_stream_receive.html#extension)**: Previously, the local message retained the extension fields from when it was first stored in the database; subsequent chunks or complete message updates did not synchronize them. Now, extension fields from the latest processed chunk or complete message update replace all old local values. An empty new extension clears the original local fields.
- **[Multi-body attachment transfer progress and download result callbacks](message_receive.html#attachment-download-apis-and-callbacks)**: [Attachment uploads](message_send.html#retrieve-the-attachment-message-sending-progress), original file downloads, and large image downloads aggregate progress weighted by file size into message-level overall progress from 0–100. Thumbnail downloads do not provide progress callbacks. Each download request returns one final result. If any applicable attachment fails, remaining downloads stop.

#### API and behavior changes

- [`getType()` and `getContentType()`](message_send.html#send-multi-body-messages) return `EMMessage.Type.MULTIBODY` for multi-body messages. `getBody()` returns the first body; use `getBodies()` for the complete list. `setBody()` replaces the entire list; `addBody()` and `appendBody()` append bodies.
- `EMClient#isConnected()` is deprecated, but existing calls remain usable. Use [`EMClient#getConnectionState()`](connection.html#retrieve-the-connection-state).
- [Recoverable `onDisconnected(int errorCode)` notifications](connection.html#configure-the-disconnection-notification-grace-period) are delayed by 10 seconds by default. Successful reconnection within the grace period suppresses the callback; it is triggered only if the connection has not recovered by the deadline. Values less than or equal to 0 notify immediately. Initial connection failure, invalid tokens, being kicked offline, and similar situations still notify immediately. The grace period affects only callback timing; connection state changes immediately.
- [`usePushInBackground`](push/push_overview.html#configure-background-message-reception) defaults to `false`. The SDK does not actively disconnect because the app enters the background. Whether the connection can remain active still depends on system background restrictions and the app's keep-alive policy. To enable background push, set `true` before calling `EMClient#init(Context, EMOptions)`. If a connection succeeds while the app is already in the background with the switch enabled and a valid channel, the SDK disconnects immediately without waiting approximately 10 seconds.
- When [downloading multi-body attachments](message_receive.html#attachment-download-apis-and-callbacks), inapplicable bodies are skipped automatically. If no bodies are applicable, the callback reports success without downloading anything. Large image and thumbnail download APIs both download original voice files for voice bodies. Other single-body download behaviors retain their historical behavior.

#### Fixes

- Fixed automatic reconnection stopping after exhausting the server address list, which could cause an abnormal login state. The SDK now [continues connection attempts with backoff](connection.html#automatic-reconnection), improving recovery on weak networks and during service exceptions.
- Fixed [single-body attachment downloading](message_receive.html#attachment-download-apis-and-callbacks) differing from historical versions: large image downloading for a single video message again downloads the original video. Unsupported resources or download types return download failure. Multi-body applicability filtering is unchanged.
- Fixed the body cache not being synchronized after Parcel deserialization, avoiding empty bodies and message sending or attachment download exceptions.
- Fixed missing pre-send validation when [resending messages](message_send.html#resend-failed-messages). The SDK rejects messages with empty bodies, excessive body counts, or missing multi-body attachments to avoid abnormal sends or crashes.
- Fixed streaming message extensions not being [replaced and persisted correctly](message_stream_receive.html#extension) on subsequent chunks or complete message updates. Extension fields from the latest processed update replace all old local values; an empty new extension clears the original value.
- Fixed retries of an old leave request potentially causing abnormal chat room joining state after leaving and rejoining.
- Fixed other devices potentially missing chat group or chat room allowlist additions, all-member mute, and all-member unmute events in multi-device scenarios.
- Fixed inaccurate error codes for excessive group member namecard length. The SDK now returns `EMError.INVALID_PARAM`.
- Fixed requests to change only group public visibility, join approval, or invitation permissions also submitting other group attributes and potentially altering unintended settings.
- Restored [large image download progress callbacks for `EMChatManager#downloadBigImage(...)`](message_receive.html#attachment-download-apis-and-callbacks). Thumbnail downloads still do not provide progress callbacks.

## v5.1.0 Dev 2026-9-24

#### Major changes

**1. Automatically synchronize conversations after login by default**

The default value of `EMOptions#setDataSyncType` changes from `NONE` to `CONVERSATIONS`, so the conversation list is automatically synchronized after login by default.

For details, see [Automatically synchronize the conversation list after login](conversation_list.html#automatically-synchronize-the-conversation-list-after-login).

**2. Exclude chat room conversations from the local conversation list by default**

By default, chat room conversations are excluded when retrieving the local conversation list. To include them, call `EMOptions#setEnableChatroomConversation(true)` before initializing the SDK. Call `EMOptions#isEnableChatroomConversation()` to query whether the current configuration includes chat room conversations when retrieving the local conversation list.

For details, see [Retrieve the conversation list](conversation_list.html#retrieve-the-conversation-list).

**3. Remove data synchronization WebSocket configuration properties**

The data synchronization WebSocket address is now automatically obtained from the REST server configuration and no longer requires separate configuration. The following APIs are removed:
- `EMOptions#setSyncDataWebSocketServer(String)`
- `EMOptions#getSyncDataWebSocketServer()`
- `EMOptions#setSyncDataWebSocketPort(int)`
- `EMOptions#getSyncDataWebSocketPort()`

#### New features

- Support [retrieving the local conversation list by page](conversation_list.html#retrieve-local-conversations-by-page).
- Support [querying the chat group invitation confirmation configuration](group_manage.html#invite-users-to-join-a-chat-group): Add `EMGroup#isInviteNeedConfirm()` to retrieve the chat group configuration that specifies whether invited members must confirm invitations.
- Add the [chat group information update event](multi_device.html#monitor-multi-device-events) `GROUP_UPDATE` (event code `34`) for multi-device login scenarios.

#### Improvements

- **Local database performance improvements**
   - WAL mode is enabled by default for the SQLCipher database. The switch is removed, and WAL remains enabled;
   - Replace the single read connection with a bounded read connection pool (capacity: 3). Conversation loading without filter conditions uses the read connection pool to improve concurrent read performance;
   - Change the friend remark cache to lazy loading;
   - Adapt conversation/chat group synchronization timestamp reads to WAL and improve the `performMigrationToVersion51` migration process.

- **Network timeout adjustments**
   - TCP/WebSocket timeout for a single connection attempt: Change from 5s to 20s;
   - HTTP request timeout for non-attachment requests: Change from 10s to 20s;
   - Overall login timeout: Change from 30s to 70s;
   - Set both the internal reconnection wait timeout in `sendMessage` and the DNS list retrieval timeout to 20s.

- **Use NTP-calibrated time to determine token expiration** to avoid incorrect expiration decisions caused by inaccurate device time.
- **Security and compliance**:
   - Recompile `libcipherdb.so` with NDK 29;
   - Enable certificate validation for DoH chunked uploads.

#### Fixes

1. Fix an NPE crash when push token uploads and logout occur concurrently, and prevent expired upload tasks from corrupting local token state.
2. Fix an issue where the latest message of a conversation is not updated after retrieving roaming messages.
3. Fix a crash caused by receiving a message with an empty `msgid`.
4. Fix a crash when calling `asyncDeleteAllMsgsAndConversations` while not logged in.
5. Fix an issue where `sendMessage` does not trigger a callback when an attachment remote path is invalid.
6. Stop storing messages with empty content in the database or passing them to the upper layer through callbacks. Reject messages with an empty body in database read/write paths and fix the related exceptions.
7. Fix a crash when updating user attributes (`userinfo`) and a JNI local reference leak in `userinfo` callbacks.
8. Fix reconnection hangs and occasional deadlocks caused by semaphore/timer lifecycle issues (`EMSemaphoreTracker`/`EMTimer` and timing issues after connection waits are replaced).
9. Fix crashes caused by timing issues between local cleanup and callback threads when the current user leaves a chat group or the chat group is destroyed. Fix message ordering issues caused by MUC/ROSTER events being dispatched before messages are written to disk.
10. Fix an issue where setting a private REST server address a second time does not take effect.
11. Fix a crash in `resetLinkVector()`. Fix uninitialized [Presence](presence.md) timestamps and missing `pageSize` validation.
12. Fix an HTTP timeout unit conversion error for attachment uploads (seconds were not converted to milliseconds, resulting in an excessively short timeout).

## v5.0.0 Dev 2026-8-28

The EasyIM SDK v5.0.0 provides the following features:

1. **[Message sending](message_send.html) and [receiving](message_receive.html)**.

   Send and receive messages in one-to-one chats, group chats, chat rooms, and message threads.

2. **[Conversation](conversation_overview.html) and [message](message_overview.html) management**:

- **Messages**: Retrieve, recall, search for, edit, pin, import, and insert messages, among other operations.
- **Conversations**: Manage the conversation list, conversation unread counts, conversation pinning and tags, conversation deletion, and other operations.

3. **[Chat group](group_manage.html) and [chat room](room_manage.html) management**:

- **Create and manage chat groups/chat rooms**: Create and destroy chat groups, retrieve chat group/chat room details, retrieve chat group and group member lists, and display chat group/chat room operation events.
- **Manage chat group/chat room members**: Join and leave chat groups/chat rooms, and manage allowlists, blocklists, and mute lists.
- **Manage message threads**: Create a message thread based on a group message so that group members can discuss a specific topic. This feature includes creating, joining, destroying, and leaving message threads, as well as sending, receiving, recalling, and retrieving messages in message threads.
- **Manage chat group and chat room attributes**: Modify chat group/chat room names, descriptions, and announcements, and set and retrieve custom chat room attributes (key-value pairs).

4. **User-related features**:

- [**User relationships**](user_relationship.html): Add and delete friends, set friend remarks, retrieve the friend list, and manage the friend blocklist, among other operations.
- [**User attributes**](userprofile.html): User attributes are information about users who interact through real-time messages, such as user nickname, avatar, email address, phone number, gender, signature, and birthday. This feature includes setting and retrieving friend attributes, among other operations.
- [**Automatic user information management**](userinfo_provider.html): The SDK automatically synchronizes user information and updates it in memory, reducing the work required for developers to manually retrieve, store, and update user information.
- [**Presence**](presence.html): Subscribe to and unsubscribe from user presence, publish custom presence states, and query the list of subscribed users.

5. **[Offline push](/sdk/v5/android/push/push_overview.html)**:

- **Integrate Google FCM push**: Obtain a V1 certificate from the Firebase console, upload it to the EasyIM Console, configure dependencies in the project, initialize the SDK, and upload the device token.
- **Configure offline push notifications**: Configure push notification titles and content through APIs, push templates, and message extensions.
- **Configure push notification modes and Do Not Disturb (DND)**: A push notification mode determines how a user receives push notifications: receive all notifications, receive only notifications that mention specified users, or receive no push notifications. Do Not Disturb (DND) allows you to disable offline push notifications for an app or conversation during a specified period.
- **Push templates**: When the default server configurations do not meet your requirements, use push templates to configure global push notification titles and content.
