# Android IM SDK Release Notes

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

## v5.0.0 2026-8-28

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
