# v5.1.2 Dev 2026-9-20 (Development)

## New features

- **Enhanced log management**: Disable SDK console logs separately and receive sanitized structured SDK logs through `onLog` callbacks for collection and processing in your app. Disabling console output does not affect log callbacks. See [SDK Logs](log.html).
- **Query all-member mute status for a chat room**: Chat room details include the new `muteAllMembers` field, which indicates whether all-member mute is enabled. See [Retrieve chat room details](room_attributes.html#retrieve-chat-room-details).
- **Customize the login timeout**: The default total login timeout is 30 seconds. You can customize the timeout when calling `login`. See [Login](login.html#login).

## Improvements

- **Batch user-profile query results**: `getUserInfoByUserId` and `getUserInfoByAttribute` return complete results in the request order. Users whose profiles are not found are represented by `{ userId }`, so you can match results to the request without filling in missing entries or reordering results.
- **Reconnection after a session ends**: After a session ends, for example because the user is kicked offline, the demo page displays the corresponding state. Restoring the page or network no longer triggers automatic reconnection.

## Fixes

Fixed issues with encoding and decoding combined messages.

## Compatibility changes

**Chat room detail fields**: [Chat room details](room_attributes.html#retrieve-chat-room-details) no longer include the announcement or return the current user's individual mute status, allowlist status, or mute expiration time through `currentUserStatus`:

- To retrieve the announcement, use [the announcement query API](room_attributes.html#retrieve-the-chat-room-announcement).
- To check whether the current user is on the allowlist, see [Check whether the current user is on the chat room allowlist](room_members.html#check-whether-the-current-user-is-on-the-chat-room-allowlist).
- To check whether the current user is individually muted, see [Check whether the current user is muted](room_members.html#check-whether-the-current-user-is-muted).
- The current user's chat room permission is still available through `permissionType`.
- Use the new `muteAllMembers` field to determine whether all-member mute is enabled.
- The `ChatRoomCurrentUserStatus` type is removed together with the `currentUserStatus` field.

# v5.0.0 2026-8-28

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
- [**User attributes**](userprofile.html): User attributes are information about users who interact through real-time messages, such as user nickname, avatar, email address, phone number, gender, signature, and birthday. This feature includes setting and retrieving friend attributes, among other operations. To subscribe to attribute changes for strangers through `subscribeUsersInfo`, first contact the EasyIM business manager to enable this feature.
- [**Automatic user information management**](userinfo_provider.html): The SDK automatically synchronizes user information and updates it in memory, reducing the work required for developers to manually retrieve, store, and update user information.
- [**Presence**](presence.html): Subscribe to and unsubscribe from user presence, publish custom presence states, and query the list of subscribed users.

5. **[Offline push](/sdk/v5/web/push/push_overview.html)**:

The IM Web SDK does not natively support offline push notifications. It only supports configuring offline push notifications for mobile terminals, including:

- **Configure offline push notifications**: Configure push notification titles and content through APIs, push templates, and message extensions.
- **Configure push notification modes and Do Not Disturb (DND)**: A push notification mode determines how a user receives push notifications: receive all notifications, receive only notifications that mention specified users, or receive no push notifications. Do Not Disturb (DND) allows you to disable offline push notifications for an app or conversation during a specified period.
