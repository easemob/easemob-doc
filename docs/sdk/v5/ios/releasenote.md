# iOS IM SDK Release Notes

## v5.2.0 Dev 2026-11-5

#### New features

- **[Multi-body messages](message_send.html#send-multi-body-messages)**: A message can contain multiple text, image, video, voice, file, location, or custom bodies in order for mixed text and images or multiple-image content. Adds `-[EMChatMessage initWithConversationID:bodies:ext:]`, the `bodies` property to set or read the complete ordered body list, `appendBody:` to append bodies, and `contentType` to identify the content type. Each message supports up to 20 bodies.
- **[Query complete connection state](connection.html#retrieve-the-connection-state)**: `[EMClient sharedClient].connectionState` returns `EMConnectionState`, distinguishing disconnected, connecting, and connected states to display connection progress and determine the current state. `isConnected` is deprecated, but existing calls remain usable. Use the new property.
- **[Configure the disconnection notification grace period](connection.html#configure-the-disconnection-notification-grace-period)**: After a connection has been established successfully, the SDK can defer notifications for recoverable disconnections such as network exceptions, reducing prompts caused by brief network fluctuations. Adds `EMOptions.disconnectNotifyThreshold` to set or query the period in seconds, defaulting to 10 seconds.

#### Improvements

- **[Streaming message extension updates](message_stream_receive.html#extension)**: Previously, the local message retained the extension fields from when it was first stored in the database; subsequent chunks or complete message updates did not synchronize them. Now, extension fields (`ext`) from the latest processed chunk or complete message update replace all old local values and are saved to the database. An empty new extension clears the original local fields.
- **[Multi-body attachment transfer](message_receive.html#attachment-download-apis-and-callbacks)**: Handles multiple attachments in a message, aggregating progress weighted by file size through existing progress callbacks to report overall upload or download progress for the whole message. Thumbnail downloads report only completion, without progress.

#### Fixes

- Fixed a potential crash when parsing error information after an attachment download failed with an empty server error response.
- Fixed the SDK potentially stopping automatic reconnection after exhausting available server addresses during a network exception.
- Fixed attachment download callbacks potentially overwriting sending callbacks for the same message, causing sending and download results to interfere with each other.
- Fixed message state potentially remaining in the sending state after pre-send validation failed.

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

## v5.0.0 Dev 2026-8-28

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
