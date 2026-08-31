# Product Dynamics

## 2026-08

#### EasyIM Android/iOS/Web SDK v5.0.0 release

The EasyIM SDK v5.0.0 provides the following features:

1. **Message sending and receiving**.

   [Send](/docs/v5/android/message_send.html) and [receive messages](/docs/v5/android/message_receive.html) in one-to-one chats, group chats, chat rooms, and message threads.

2. **Conversation and message management**:

- **[Messages](/docs/v5/android/message_overview.html)**: Retrieve, recall, search for, edit, pin, import, and insert messages, among other operations.
- **[Conversations](/docs/v5/android/conversation_overview.html)**: Manage the conversation list, conversation unread counts, conversation pinning and tags, conversation deletion, and other operations.

3. **Chat group and chat room management**:

- **Create and manage [chat groups](/docs/v5/android/group_manage.html)/[chat rooms](/docs/v5/android/room_manage.html)**: Create and destroy chat groups, retrieve chat group/chat room details, retrieve chat group and group member lists, and display chat group/chat room operation events.
- **Manage chat group/chat room members**: Join and leave chat groups/chat rooms, and manage allowlists, blocklists, and mute lists.
- **Manage message threads**: Create a message thread based on a group message so that group members can discuss a specific topic. This feature includes creating, joining, destroying, and leaving message threads, as well as sending, receiving, recalling, and retrieving messages in message threads.
- **Manage chat group and chat room attributes**: Modify chat group/chat room names, descriptions, and announcements, and set and retrieve custom chat room attributes (key-value pairs).

4. **User-related features**:

- **[User relationships](/docs/v5/android/user_relationship.html)**: Add and delete friends, set friend remarks, retrieve the friend list, and manage the friend blocklist, among other operations.
- **[User attributes](/docs/v5/android/userprofile.html)**: User attributes are information about users who interact through real-time messages, such as user nickname, avatar, email address, phone number, gender, signature, and birthday. This feature includes setting and retrieving friend attributes, among other operations.
- **[Automatic user information management](/docs/v5/android/userinfo_provider.html)**: The SDK automatically synchronizes user information and updates it in memory, reducing the work required for developers to manually retrieve, store, and update user information.
- **[Presence](/docs/v5/android/presence.html)**: Subscribe to and unsubscribe from user presence, publish custom presence states, and query the list of subscribed users.

5. **Offline push**:

- **Integrate [Google FCM push](/sdk/v5/android/push/push_overview.html)/[APNs Push](/sdk/v5/android/push/push_overview.html)**: Upload the push certificate to the EasyIM Console and get the device token and pass it to the SDK.
- **Configure offline push notifications**: Configure push notification titles and content through APIs, push templates, and message extensions.
- **Configure push notification modes and Do Not Disturb (DND)**: A push notification mode determines how a user receives push notifications: receive all notifications, receive only notifications that mention specified users, or receive no push notifications. Do Not Disturb (DND) allows you to disable offline push notifications for an app or conversation during a specified period.
- **Push templates**: When the default server configurations do not meet your requirements, use push templates to configure global push notification titles and content.

:::tip
The IM Web SDK does not natively support offline push notifications. It only supports offline push notification configurations.
:::

#### Release Notes

- [Android SDK 5.0.0 release notes](/docs/v5/android/releasenote.html#v5-0-0-dev-2026-8-12)
- [iOS SDK 5.0.0 release notes](/docs/v5/ios/releasenote.html#v5-0-0-dev-2026-8-12)  
- [Web SDK 5.0.0 release notes](/docs/v5/ios/releasenote.html#v5-0-0-dev-2026-8-12)
