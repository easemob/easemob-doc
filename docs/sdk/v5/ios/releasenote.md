# iOS IM SDK Release Notes

## v5.1.0 Dev 2026-9-24

#### Major changes

**1. Exclude chat room conversations from the local conversation list by default**

By default, chat room conversations are excluded when retrieving the local conversation list. To include them, set `EMOptions#enableChatroomConversation` to `true` before initializing the SDK. Read this property to query the current configuration.

For details, see [Conversation-related options](conversation_list.html#conversation-related-options).

**2. Remove data synchronization WebSocket configuration properties**

The data synchronization WebSocket address is now automatically obtained from the REST server configuration and no longer requires separate configuration. The following properties are removed:

- `syncDataWSHost`
- `syncDataWSPort`

For details, see [Private Cloud SDK IP Address/Domain Configuration](private_ip_domain.html).

#### New features

Support [retrieving the local conversation list by page](conversation_list.html#retrieve-local-conversations-by-page).

#### Improvements

- After NTP time synchronization is enabled, use NTP-calibrated time to determine whether the user token has expired, avoiding inaccurate decisions caused by device time differences.
- Support WAL mode for the local database to improve concurrent database read/write performance.

#### Fixes

- Fix incorrect ordering of chat group message callbacks and chat group event callbacks.
- Fix a potential crash when iterating through DNS configurations.
- Fix an issue where service domains cannot be set multiple times in private deployments.
- Fix an occasional failure to reconnect to the server under abnormal network conditions.
- Fix an issue where `fetchSubscribedUsers` returns an empty array after subscribing to user information.
- Fix an issue where sending an attachment message does not trigger a callback when `EMOptions#isAutoTransferMessageAttachments` is disabled and the message has an empty `remotePath`.
- Fix inaccurate conversation Do Not Disturb information caused by parsing errors during multi-device synchronization after Do Not Disturb is set.

## v5.0.0 2026-8-28

The Instant Messaging (IM) SDK v5.0.0 provides the following features:

1. **[Message sending and receiving](message_send_receive.html)**.

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

5. **[Offline push](/sdk/v5/ios/push/push_overview.html)**:

- **Integrate APNs push**: Generate a push certificate on the Apple Developer Center, upload it to the EasyIM Console, enable notifications, pass the certificate name to the SDK, and get the device token and pass it to the SDK.
- **Configure offline push notifications**: Configure push notification titles and content through APIs, push templates, and message extensions.
- **Configure push notification modes and Do Not Disturb (DND)**: A push notification mode determines how a user receives push notifications: receive all notifications, receive only notifications that mention specified users, or receive no push notifications. Do Not Disturb (DND) allows you to disable offline push notifications for an app or conversation during a specified period.
- **Push templates**: When the default server configurations do not meet your requirements, use push templates to configure global push notification titles and content.
