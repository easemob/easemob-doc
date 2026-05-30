## v1.4.0

v1.4.0 was released on XXXX, 2026.

## New Features

- Supported reading server-side message read and delivery statuses when retrieving roaming messages from the server. This feature applies only to one-to-one chats and is disabled by default. To enable it, please contact [technical support](mailto:support@agora.io).
- Added the new chat room mute event `ChatRoomChangeListener#onMuteListAdded(java.lang.String, java.util.Map<java.lang.String,java.lang.Long>)` to provide muted user IDs and their mute expiration timestamps via the `Map<String,Long> muteInfo` parameter, deprecating the old event `ChatRoomChangeListener#onMuteListAdded(java.lang.String, java.util.List<java.lang.String>, long)`.
- Added Native Crash reporting capabilities: When a crash occurs in the SDK's native layer, the crash information will be reported upon the next application startup.
- Enabled users to receive the following information upon joining a chat room:
  - Current chat room member count: Retrieved via the `ChatRoom#getMemberCount` method. This count updates when users join or leave the chat room.
  - Chat room-wide mute status: Retrieved via the `ChatRoom#isAllMemberMuted` method. This status updates upon receiving mute/unmute status change events.
  - Chat room creation timestamp: Retrieved via the newly added `ChatRoom#getCreateTimestamp` method.
  - Whether the current user is on the chat room allow list: Retrieved via the newly added `ChatRoom#isInWhitelist` method to check if the user is on the chat room allow list.
  - Mute expiration timestamp of the current user: Retrieved via the `ChatRoom#getMuteExpireTimestamp` method.
- Supported sending and receiving GIF image messages.
- Supported setting, updating, and retrieving group avatars.
- Supported retrieving roaming messages sent by specific group members.
- Supported retrieving messages sent by specific members within a local group conversation.
- Supported retrieving a group member list that includes each member's role and join time.
- Allowed group owners, chat room owners, and administrators to recall messages sent by other users.
- Supported batch notifications via group member join/leave events. Previously, the SDK triggered a separate event for each individual member. The new events `GroupChangeListener#onMembersJoined` and `GroupChangeListener#onMembersExited` are introduced to replace the deprecated `GroupChangeListener#onMemberJoined` and `GroupChangeListener#onMemberExited` events.
- Supported searching for messages in a local conversation by keyword, returning the conversation ID and a list of matching message IDs.
- Supported retrieving one or more local messages by message ID.
- Supported modifying various message types via the message modification API `ChatManager#asyncModifyMessage`:
  - Text and custom messages: Modifying both the message body and extensions (`ext`).
  - File, video, voice, image, location, and combined messages: Modifying extensions (`ext`) only.
  - Command messages: Not supported.
- Supported configuring RESTful addresses in IPv6 format for private deployment scenarios.

## Improvements

- Adjusted the trigger threshold for the `ConnectionListener#onTokenWillExpire` event; the notification is now triggered when 80% of the token's validity period has elapsed (previously 50%).
- Removed APIs that were deprecated prior to Android SDK version 1.1.0.
- Optimized specific database operations.
- Added exception clearing mechanisms and null pointer protection to the JNI layer.
- Optimized the reconnection logic to automatically switch reconnection addresses by default.
- Added the device timezone offset to log files to facilitate troubleshooting.
- Changed `CursorResult#cursor` from `undefined` to an empty string ("") when `ChatManager#asyncFetchHistoryMessages` reaches the final page of roaming messages.

- Removed the reflection-based approach for obtaining absolute file paths from `FileProvider`.
- Upgraded BoringSSL and SQLCipher dependencies to their latest versions to mitigate potential security risks.
- Improved the loading performance of the local conversation list when the latest message is an attachment by eliminating redundant file length checks.
- Upgraded the AOSL library to version 1.3.0.

## Issues Fixed

- Messages in memory were not deleted when their corresponding local conversation was removed.
- The `TYPE` field was empty in the `ChatThreadChangeListener#onChatThreadUserRemoved` event.
- A crash occurred on certain device models when retrieving the start and end times of conversation Do-Not-Disturb (DND) settings.
- `MessageListener#onMessageContentChanged` failed to return modification details when editing messages other than text and custom messages.
- Group or chat room members still incorrectly requested details from the server after a disbandment event was triggered.
- The database was mistakenly rebuilt upon encountering a `SQLITE_BUSY` error.
- The latest message in a conversation retrieved from the server via `ChatManager#asyncFetchConversationsFromServer` did not contain translations or message Reactions.
- An exception during logout caused by nesting SDK API calls within SDK events.
- A crash caused by extreme network conditions.
