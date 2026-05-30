## v1.4.0

v1.4.0 was released on XXXX, 2026.

## New Features

- Supported reading server-side message read and delivery statuses when retrieving roaming messages from the server. This feature applies only to one-to-one chats and is disabled by default. To enable it, please contact [technical support](mailto:support@agora.io).
- Added the new chat room mute event `IRoomManagerDelegate#OnMuteListAddedFromRoom(string roomId, Dictionary<string, long> mutes)` to provide muted user IDs and their mute expiration timestamps via the `Dictionary<string, long>` parameter, deprecating the old event `IRoomManagerDelegate#OnMuteListAddedFromRoom(string roomId, List<string> mutes, long expireTime)`.  
- Added Native Crash reporting capabilities: When a crash occurs in the underlying native layer of the SDK, the crash information will be reported upon the next application startup.
- Enabled users to receive the following information upon joining a chat room:
  - Current chat room member count: Retrieved via the `Room#MemberCount` attribute. This count updates when users join or leave the chat room.
  - Chat room-wide mute status: Retrieved via the `Room#IsAllMemberMuted` attribute. This status updates upon receiving mute/unmute status change events.
  - Chat room creation timestamp: Retrieved via the newly added `Room#CreateTimeStamp` attribute.
  - Whether the current user is on the chat room allowlist: Retrieved via the newly added `Room#IsInAllowList` attribute to check if the user is on the chat room allowlist.
  - Mute expiration timestamp of the current user: Retrieved via the `Room#MuteUntilTimeStamp` attribute.  
- Supported sending and receiving GIF image messages.
- Supported setting, updating, and retrieving group avatars.
- Supported retrieving roaming messages sent by specific group members.
- Supported retrieving messages sent by specific members within a local group conversation.
- Allowed group owners, chat room owners, and administrators to recall messages sent by other users.
- Supported batch notifications via group member join/leave events. Previously, the SDK triggered a separate event for each individual member. The new events `IGroupManagerDelegate#OnMembersJoinedFromGroup` and `IGroupManagerDelegate#OnMembersExitedFromGroup` are introduced to replace the deprecated `IGroupManagerDelegate#OnMemberJoinedFromGroup` and `IGroupManagerDelegate#OnMemberExitedFromGroup` events.  
- Supported searching for messages in a local conversation by keyword, returning the conversation ID and a list of matching message IDs.
- Supported retrieving one (via `ChatManager#LoadMessage`) or more (`ChatManager#LoadMessages`) local messages by message ID. 
- Supported modifying various message types via the message modification API `ChatManager#ModifyMessage`:
  - Text and custom messages: Modifying both the message body and extensions (`attributes`).
  - File, video, voice, image, location, and combined messages: Modifying extensions (`attributes`) only.
  - Command messages: Not supported.
- Supported configuring RESTful addresses (via `Options#RestServer`) in IPv6 format for private deployment scenarios.

## Improvements

- Adjusted the trigger threshold for the `IConnectionDelegate#OnTokenWillExpire` event; the notification is now triggered when 80% of the token's validity period has elapsed (previously 50%).
- Improved the loading performance of the local conversation list when the latest message is an attachment by eliminating redundant file length checks.
- Optimized specific database operations.
- Optimized the reconnection logic to automatically switch reconnection addresses by default.
- Added the device timezone offset to log files to facilitate troubleshooting.
- Upgraded the AOSL library to version 1.3.0.

## Issues Fixed

- Memory messages were not deleted when their corresponding local conversations were removed.
- The `TYPE` field was empty in the `IChatThreadManagerDelegate#OnUserKickOutOfChatThread` event.
- `IChatManagerDelegate#OnMessageContentChanged` failed to return modification details when editing messages other than text and custom messages.
- Group or chat room members still incorrectly requested details from the server after a disbandment event was triggered.
- The database was mistakenly rebuilt upon encountering a `SQLITE_BUSY` error.
- The latest messages in conversations retrieved from the server via `ChatManager#GetConversationsFromServerWithCursor` or `ChatManager#GetConversationsFromServerWithPage` did not contain translations or message Reactions.
- A crash caused by extreme network conditions.

