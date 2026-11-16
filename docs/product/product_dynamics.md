# Product Dynamics

## 2026-11

#### EasyIM Android SDK v5.2.1 / iOS SDK v5.2.0 release

| Update | Description | Release date | Related documentation |
| :--- | :--- | :--- | :--- |
| Android SDK v5.2.1 / iOS SDK v5.2.0 development release | **New features**:<br/> - **Multi-body messages**: Combine text, image, video, voice, file, location, or custom bodies in order in one message, up to 20 bodies, for mixed text and images or multiple-image content. See [Android](/sdk/v5/android/message_send.html#send-multi-body-messages) and [iOS](/sdk/v5/ios/message_send.html#send-multi-body-messages).<br/> - **Query complete connection state**: Distinguish disconnected, connecting, and connected states to display connection progress and determine the current state. See [Android](/sdk/v5/android/connection.html#retrieve-the-connection-state) and [iOS](/sdk/v5/ios/connection.html#retrieve-the-connection-state).<br/> - **Configure the disconnection notification grace period**: After a connection has been established successfully, the SDK can defer notifications for recoverable disconnections such as network exceptions, reducing prompts caused by brief network fluctuations. The default is 10 seconds and can be adjusted. See [Android](/sdk/v5/android/connection.html#configure-the-disconnection-notification-grace-period) and [iOS](/sdk/v5/ios/connection.html#configure-the-disconnection-notification-grace-period).<br/> - **[Configure background message reception](/sdk/v5/android/push/push_overview.html#configure-background-message-reception) (Android only)**: Choose to disconnect the IM persistent connection after entering the background and receive offline notifications through a valid push channel. If enabled and the push channel is valid, the SDK actively disconnects approximately 10 seconds after the app enters the background.<br/> - **[Query push channel validity](/sdk/v5/android/push/push_overview.html#confirm-push-channel-validity) (Android only)**: Determine whether a valid vendor push channel has been established to help choose a background message reception strategy.<br/> **Improvements**:<br/> - **Streaming message extension updates**: Previously, the local message retained extension fields from when it was first stored in the database; subsequent chunks or complete message updates did not synchronize them. Now, extension fields from the latest processed chunk or complete message update replace all old local values and are saved to the database. An empty new extension clears the original local fields. See [Android](/sdk/v5/android/message_stream_receive.html#extension) and [iOS](/sdk/v5/ios/message_stream_receive.html#extension). | 2026-11-5 | [Android SDK v5.2.1 release notes](/sdk/v5/android/releasenote.html#v5-2-1-dev-2026-11-5)<br/>[iOS SDK v5.2.0 release notes](/sdk/v5/ios/releasenote.html#v5-2-0-dev-2026-11-5) |

#### EasyIM Web SDK v5.2.0 release

| Update | Description | Release date | Related documentation |
| :--- | :--- | :--- | :--- |
| Web SDK v5.2.0 development release | **New features**:<br/> - **[Multi-body messages](/sdk/v5/web/message_send.html#send-multi-body-messages)**: Combine text, image, file, voice, video, location, and custom content in order in one message, with 2–20 segments, for displays such as mixed text and images or multiple images. Supports [receiving and downloading attachments](/sdk/v5/web/message_receive.html#receive-multi-body-messages) and combined forwarding with multi-body messages as children.<br/> - **[Query the SDK version](/sdk/v5/web/initialization.html#retrieve-the-sdk-version)**: Obtain the currently integrated SDK version to confirm the version and troubleshoot version-related issues. | 2026-11-5 | [Web SDK v5.2.0 release notes](/sdk/v5/web/releasenote.html#v5-2-0-dev-2026-11-5-development) |

## 2026-09

#### EasyIM Android/iOS SDK v5.1.0 release

| Update   | Description | Release date       | Related documentation          |
| :----- | :------- | :---------------- | :---------------- |
| Android/iOS SDK v5.1.0 development release   | **Major changes**:<br/> - Android [automatically synchronizes the conversation list after login by default](/sdk/v5/android/conversation_list.html#automatically-synchronize-the-conversation-list-after-login).<br/> - The local conversation list on Android and iOS excludes chat room conversations by default. <br/> - Android and iOS remove the data synchronization WebSocket configuration APIs. The data synchronization WebSocket address is now automatically obtained from the REST server configuration.<br/> **New features**:<br/> - Android and iOS support retrieving the local conversation list by page. <br/> - Android supports [querying whether a chat group invitation requires confirmation by the invited user](/sdk/v5/android/group_manage.html#invite-users-to-join-a-chat-group).<br/> - Android adds the [chat group information update event for multi-device login scenarios](/sdk/v5/android/multi_device.html). | 2026-9-24     | - [Android SDK v5.1.0 release notes](/sdk/v5/android/releasenote.html#v5-1-0-dev-2026-9-24) <br/> - [iOS SDK v5.1.0 release notes](/sdk/v5/ios/releasenote.html#v5-1-0-dev-2026-9-24)  |

#### EasyIM Web SDK v5.1.2 release

| Update | Description | Release date | Related documentation |
| :--- | :--- | :--- | :--- |
| Web SDK v5.1.2 release | - **Enhanced log management**: Disable SDK console logs separately and receive sanitized structured SDK logs through callbacks. See [SDK Logs](/sdk/v5/web/log.html).<br/> - **Query all-member mute status for a chat room**: Chat room details indicate whether all-member mute is enabled. See [Retrieve chat room details](/sdk/v5/web/room_attributes.html#retrieve-chat-room-details).<br/> - **Customize the login timeout**: The default total login timeout is 30 seconds. You can customize it when calling `login`. See [Login](/sdk/v5/web/login.html#login). | 2026-9-20 | [Web SDK v5.1.2 release notes](/sdk/v5/web/releasenote.html#v5-1-2-dev-2026-9-20-development) |

## 2026-08

#### EasyIM Android/iOS/Web SDK v5.0.0 release

The EasyIM SDK v5.0.0 provides the following features:

1. **Message sending and receiving**.

   [Send](/sdk/v5/android/message_send.html) and [receive messages](/sdk/v5/android/message_receive.html) in one-to-one chats, group chats, chat rooms, and message threads.

2. **Conversation and message management**:

- **[Messages](/sdk/v5/android/message_overview.html)**: Retrieve, recall, search for, edit, pin, import, and insert messages, among other operations.
- **[Conversations](/sdk/v5/android/conversation_overview.html)**: Manage the conversation list, conversation unread counts, conversation pinning and tags, conversation deletion, and other operations.

3. **Chat group and chat room management**:

- **Create and manage [chat groups](/sdk/v5/android/group_manage.html)/[chat rooms](/sdk/v5/android/room_manage.html)**: Create and destroy chat groups, retrieve chat group/chat room details, retrieve chat group and group member lists, and display chat group/chat room operation events.
- **Manage chat group/chat room members**: Join and leave chat groups/chat rooms, and manage allowlists, blocklists, and mute lists.
- **Manage message threads**: Create a message thread based on a group message so that group members can discuss a specific topic. This feature includes creating, joining, destroying, and leaving message threads, as well as sending, receiving, recalling, and retrieving messages in message threads.
- **Manage chat group and chat room attributes**: Modify chat group/chat room names, descriptions, and announcements, and set and retrieve custom chat room attributes (key-value pairs).

4. **User-related features**:

- **[User relationships](/sdk/v5/android/user_relationship.html)**: Add and delete friends, set friend remarks, retrieve the friend list, and manage the friend blocklist, among other operations.
- **[User attributes](/sdk/v5/android/userprofile.html)**: User attributes are information about users who interact through real-time messages, such as user nickname, avatar, email address, phone number, gender, signature, and birthday. This feature includes setting and retrieving friend attributes, among other operations.
- **[Automatic user information management](/sdk/v5/android/userinfo_provider.html)**: The SDK automatically synchronizes user information and updates it in memory, reducing the work required for developers to manually retrieve, store, and update user information.
- **[Presence](/sdk/v5/android/presence.html)**: Subscribe to and unsubscribe from user presence, publish custom presence states, and query the list of subscribed users.

5. **Offline push**:

- **Integrate [Google FCM push](/sdk/v5/android/push/push_overview.html)/[APNs Push](/sdk/v5/android/push/push_overview.html)**: Upload the push certificate to the EasyIM Console and get the device token and pass it to the SDK.
- **Configure offline push notifications**: Configure push notification titles and content through APIs, push templates, and message extensions.
- **Configure push notification modes and Do Not Disturb (DND)**: A push notification mode determines how a user receives push notifications: receive all notifications, receive only notifications that mention specified users, or receive no push notifications. Do Not Disturb (DND) allows you to disable offline push notifications for an app or conversation during a specified period.
- **Push templates**: When the default server configurations do not meet your requirements, use push templates to configure global push notification titles and content.

:::tip
The IM Web SDK does not natively support offline push notifications. It only supports offline push notification configurations.
:::

#### Release Notes

- [Android SDK 5.0.0 release notes](/sdk/v5/android/releasenote.html#v5-0-0-dev-2026-8-12)
- [iOS SDK 5.0.0 release notes](/sdk/v5/ios/releasenote.html#v5-0-0-dev-2026-8-12)  
- [Web SDK 5.0.0 release notes](/sdk/v5/ios/releasenote.html#v5-0-0-dev-2026-8-12)
