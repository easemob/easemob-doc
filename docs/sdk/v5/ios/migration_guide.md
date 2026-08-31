# EasyIM iOS SDK 4.x to 5.0.0 Migration Guide

## Upgrade overview

EasyIM iOS SDK 5.0.0 is a major release that is not source-compatible. The upgrade mainly involves the following four areas:

1. **Data synchronization mechanism changes**
   After login, the SDK can automatically synchronize conversations, contacts, and joined chat groups and save the data to the local database, replacing the server data retrieval APIs previously called by the app.
2. **Message read receipt mechanism redesign**
   Read receipts are now sent in bulk instead of individually. Clearing the local unread count is independent of sending read receipts to message senders. One-to-one and group chats use a unified receipt model and callback.
3. **Chat group configuration model redesign**
   The single `EMGroupStyle` enum is split into the three Boolean properties `isPublic`, `joinApprovalRequired`, and `allowInvites`. Chat group properties can also be updated by configuration type after a chat group is created.
4. **Legacy API cleanup**
   A number of synchronous APIs, APIs long marked as deprecated with `@Deprecated`, and some peripheral capabilities are removed. Registration, reporting, message traffic statistics, and other features must be implemented by a business service or server-side REST APIs. Password-based login is removed, and only Token-based login is retained.

:::tip
**Upgrade requirements:** EasyIM iOS SDK 5.0.0 includes incompatible Objective-C API changes. After updating the SDK, you must recompile your app and thoroughly verify Token-based login, data synchronization, conversation unread counts, one-to-one and group chat read receipts, chat group creation and configuration updates, contacts, attachment messages, and push settings.
:::

## Initialization and login

### Removal of automatic login

EasyIM iOS SDK 5.0.0 no longer provides automatic login configuration, automatic login status, or an automatic login completion callback. After a cold start, the app must manage the user ID and Token itself and actively call `loginWithUsername:token:completion:` at the appropriate time.

| Removed API | Alternative | Description |
| :--- | :--- | :--- |
| `EMOptions#isAutoLogin` | No direct alternative. Actively call `loginWithUsername:token:completion:` after the app starts. | Configures whether the SDK automatically logs in after initialization. |
| `EMClient#isAutoLogin` | Read `EMClient.isLoggedIn` or `EMClient.isConnected` as needed by your business. | Queries whether the SDK is in the automatic login process or automatic login state. |
| `EMClientDelegate#autoLoginDidCompleteWithError:` | Handle the active login result in the completion of `loginWithUsername:token:completion:`. | Notifies the app that automatic login is complete and provides any error. |
| `EMClientDelegate#userAccountDidLoginFromOtherDevice:` and the parameterless `userAccountDidLoginFromOtherDevice` | `userAccountDidLoginFromOtherDeviceWithInfo:` | Notifies the current account that it has logged in on another device. In 5.0.0, `EMLoginExtensionInfo` uniformly returns the newly logged-in device and extension information. |

`isLoggedIn` indicates whether the current user is logged in, and `isConnected` indicates whether the SDK is connected to the chat server. Neither replaces app-side management of user credentials and the Token lifecycle.

### Removal of password-based login

EasyIM iOS SDK 5.0.0 retains only Token-based login. Account management operations such as user registration, password validation, and Token retrieval must be performed through REST APIs or by a business server.

| Removed API | Alternative | Description |
| :--- | :--- | :--- |
| `registerWithUsername:password:` and `registerWithUsername:password:completion:` | No client-side alternative. Register EasyIM accounts through server-side REST APIs. | Registers an EasyIM account with a user ID and password. |
| `fetchTokenWithUsername:password:completion:` | No client-side alternative. The business server obtains a Token and delivers it to the client. | Requests a user Token from the SDK with a user ID and password. |
| `loginWithUsername:password:` and `loginWithUsername:password:completion:` | `loginWithUsername:token:completion:` | Logs in with a user ID and password. These APIs were deprecated in 4.x. |
| `loginWithUsername:agoraToken:` and `loginWithUsername:agoraToken:completion:` | `loginWithUsername:token:completion:` | Logs in with an Agora Token. These APIs were deprecated in 4.x. |
| Synchronous `loginWithUsername:token:` | `loginWithUsername:token:completion:` | Logs in synchronously with a Token and directly returns `EMError`. In 5.0.0, only the asynchronous completion version is retained. |
| `serviceCheckWithUsername:password:completion:` and `EMServerCheckType` | No direct alternative. Diagnose issues by using the normal login completion, `connectionStateDidChange:`, and Token expiration callbacks. | Checks account, DNS, Token, login, or logout status. |

`renewToken:completion:` is still used to asynchronously update the Token for the current login session. The synchronous `renewToken:` also remains in the 5.0.0 public header, but business code should preferentially use the completion version to handle errors.

### Decoupling login from database opening

EasyIM iOS SDK 5.0.0 adds a local database opening callback. After the database is opened, the app can read local data for the current account without waiting for server synchronization of conversations, contacts, or joined chat groups to finish. This helps accelerate the first-screen display after a cold start.

- `EMClientDelegate#onDatabaseOpened:username:`: Triggered when the local database for the current account finishes opening. A nil `error` indicates success. If the app needs to know whether the local database is ready, it should record the callback state.
:::
- `EMClientDelegate#syncDataStartWithType:`: Triggered when synchronization starts for the specified data type.
- `EMClientDelegate#syncDataFinished:type:`: Triggered when synchronization finishes for the specified data type. A nil `error` indicates success.

## Data synchronization and server data retrieval API migration

### Data synchronization APIs

EasyIM iOS SDK 5.0.0 adds automatic data synchronization after login. Before initializing the SDK, specify the data types to synchronize through `EMOptions#dataSyncType`, and monitor synchronization progress through `EMClientDelegate`. After synchronization finishes, read data through the local APIs of the corresponding modules.

| Class | API or configuration | Description |
| :--- | :--- | :--- |
| `EMOptions` | `EMDataSyncType` | Data synchronization bitmask: `EMDataSyncTypeNone`, `EMDataSyncTypeConversations`, `EMDataSyncTypeContacts`, and `EMDataSyncTypeJoinedGroups`. Multiple types can be combined with a bitwise OR. |
| `EMOptions` | `dataSyncType` | Sets the data types to synchronize automatically after login. Configure it before `initializeSDKWithOptions:`. The default value in the current 5.0.0 implementation is `EMDataSyncTypeConversations`. |
| `EMClientDelegate` | `syncDataStartWithType:` | Notifies the app that synchronization has started for the specified data type. |
| `EMClientDelegate` | `syncDataFinished:type:` | Notifies the app that synchronization has finished for the specified data type. A nil completion parameter `error` indicates success. |
| `EMClientDelegate` | `onDatabaseOpened:username:` | Notifies the app that the local database for the specified account is open. This event does not indicate that any server data has finished synchronizing. |

:::tip
`EMOptions#dataSyncType` defaults to `EMDataSyncTypeConversations`. Therefore, with the default configuration, only conversations are synchronized automatically, not contacts or joined chat groups.
:::

A typical configuration is as follows:

```objective-c
EMOptions *options = [EMOptions optionsWithAppkey:@"your-appkey"];
options.dataSyncType = EMDataSyncTypeConversations |
                       EMDataSyncTypeContacts |
                       EMDataSyncTypeJoinedGroups;
EMError *error = [[EMClient sharedClient] initializeSDKWithOptions:options];
```

### Server data retrieval API migration

The previous approach of actively retrieving conversations, contacts, and joined chat groups and refreshing data in completions is now uniformly changed to **configure the synchronization scope, automatically synchronize after login, read local data, and refresh the UI after `syncDataFinished:type:` succeeds**.

| Class | Removed API | Recommended approach in 5.0.0 |
| :--- | :--- | :--- |
| `IEMChatManager` | `getConversationsFromServer:`, `getConversationsFromServerByPage:pageSize:completion:`, and `getConversationsFromServerWithCursor:pageSize:completion:` | These APIs retrieve the conversation list from the server. Use the local `getAllConversations` or `getAllConversations:` API and refresh after `syncDataFinished:EMDataSyncTypeConversations` succeeds. |
| `IEMChatManager` | `getPinnedConversationsFromServerWithCursor:pageSize:completion:` | This API retrieves pinned conversations from the server. Pinning status is persisted with synchronized conversation data. Read the local `EMConversation.isPinned` and `pinnedTime` properties instead. |
| `IEMChatManager` | `getConversationsFromServerWithCursor:filter:completion:` | This API retrieves server conversations by condition. Use `getAllConversations`, or filter locally with `filterConversationsFromDB:filter:`. |
| `IEMGroupManager` | `getJoinedGroupsFromServerWithPage:pageSize:needMemberCount:needRole:completion:` | This API retrieves joined chat groups by page. Use the local `getJoinedGroups` API and refresh after `syncDataFinished:EMDataSyncTypeJoinedGroups` succeeds. |
| `IEMContactManager` | `getAllContactsFromServerWithCompletion:`, `getContactsFromServerWithCursor:pageSize:completion:`, `getContactsFromServerWithCompletion:`, and `getContactsFromServerWithError:` | These APIs retrieve the contact list from the server. In 5.0.0, no server contact-list retrieval API remains. Use the local `getAllContacts`, `getContacts`, or `getContact:` API and refresh after `syncDataFinished:EMDataSyncTypeContacts` succeeds. |
| `EMOptions` | `enableAutoSyncContacts` | This configuration controls automatic contact synchronization. Include `EMDataSyncTypeContacts` in `dataSyncType` instead. |

Accordingly, `EMContactManagerDelegate#onFriendStartSync` and `onFriendSyncFinished:` are removed. Use `EMClientDelegate#syncDataStartWithType:` and `syncDataFinished:type:` and determine whether `type` contains `EMDataSyncTypeContacts`. For details, see [Summary of listener callback changes](#summary-of-listener-callback-changes).

## Read receipt mechanism redesign

Message read receipts are now sent in bulk instead of individually. Whether a receipt is required is set per message through `EMChatMessage.isNeedReadReceipt`. Sending message read receipts is independent of clearing conversation unread counts. The old APIs have no compatibility aliases, so these are incompatible changes.

### Sending message read receipts and clearing unread counts

| Removed API | 5.0.0 alternative | Description |
| :--- | :--- | :--- |
| `IEMChatManager#sendMessageReadAck:toUser:completion:` | `sendMessageReadReceipts:completion:` | Sends message read receipts in bulk. The same API is used for one-to-one and group chats. |
| `IEMChatManager#sendGroupMessageReadAck:toGroup:content:completion:` | `sendMessageReadReceipts:completion:` | A separate API is no longer provided for individual group message read receipts, and `content` can no longer carry custom content in a group message read receipt. |
| `IEMChatManager#ackConversationRead:completion:` | `clearConversationUnreadMessageCount:completion:`, and call `sendMessageReadReceipts:completion:` as needed | The old API sends a conversation-level read receipt. In 5.0.0, clearing the current user's unread count and notifying message senders are separate operations. |
| `IEMChatManager#markAllConversationsAsRead` | `clearAllConversationUnreadMessageCount:` | Clears unread counts for all local conversations and synchronizes the result to the current user's other devices. |
| `EMConversation#markMessageAsReadWithId:completion:` and `markAllMessagesAsRead:` | `IEMChatManager#clearConversationUnreadMessageCount:completion:` | Clears the local unread count through a conversation-level API. `EMConversation` no longer modifies message read status. |
| Directly setting `EMChatMessage.isRead` | No public setter. Use an unread-count clearing API. | In 5.0.0, `isRead` becomes a read-only property maintained internally by the SDK. |
| `EMOptions.enableRequireReadAck` | Set `EMChatMessage.isNeedReadReceipt = YES` before sending | Removes the global read receipt switch and specifies whether a read receipt is required per message. |

`sendMessageReadReceipts:completion:` accepts up to 50 messages from the same conversation per call. The messages' `isNeedReadReceipt` must be `YES`. This API does not clear or modify the conversation's local unread count, and the completion returns only the `EMError` for the batch operation.

### Receiving message read receipts

EasyIM iOS SDK 5.0.0 uniformly delivers real-time read receipts for one-to-one and group chats through `EMChatManagerDelegate`, instead of using separate one-to-one and group chat callbacks.

| 4.x callback | 5.0.0 callback | Description |
| :--- | :--- | :--- |
| `EMChatManagerDelegate#messagesDidRead:` | `EMChatManagerDelegate#onMessageReadReceipts:` | Receives read receipts for one-to-one messages. |
| `EMChatManagerDelegate#groupMessageDidRead:groupAcks:` | `EMChatManagerDelegate#onMessageReadReceipts:` | Receives read receipts for group chat messages. |
| `EMChatManagerDelegate#onConversationRead:to:` | No direct alternative | Conversation-level read receipts are no longer delivered through a separate callback. Message-level read results are delivered through `onMessageReadReceipts:`. |
| `EMChatManagerDelegate#groupMessageAckHasChanged` | `EMChatManagerDelegate#onMessageReadReceipts:` | Receives read receipts for group chat messages. |

SDK 5.0.0 adds `EMMessageReadReceipt` to uniformly describe message read receipts:

- `messageId`: Message ID.
- `conversationId`: Conversation ID.
- `isPeerReceipt`: Whether the peer in a one-to-one chat has sent a read receipt for the message.
- `readCount`: Number of users who have read the message in a group chat.

### Querying receipt details

| 4.x API | 5.0.0 API | Description |
| :--- | :--- | :--- |
| `asyncFetchGroupMessageAcksFromServer:groupId:startGroupAckId:pageSize:completion:` | `asyncFetchGroupMessageReadUsersFromServer:groupId:readReceiptId:pageSize:completion:` | Retrieves by page the details of members who have read a specified group message. Returns `EMCursorResult<EMGroupReadReceipt *>`, an error, and the total read count. Pass the cursor from the previous page as `readReceiptId` for the next page. |
| None | `getGroupMessageReadReceipts:completion:` | Retrieves read receipt summaries for group messages from the server in bulk. Pass up to 20 messages per call, and all messages must belong to the same conversation. Returns a list of `EMMessageReadReceipt` objects. |

The receipt details model changes from `EMGroupMessageAck` to `EMGroupReadReceipt`:

- `messageId`: Group message ID.
- `readReceiptId`: Read receipt ID, also used as the pagination cursor.
- `from`: Chat group member who sent the read receipt. Its type changes from a string to `EMGroupMemberInfo`. In this context, `role` and `joinTimestamp` are unavailable.
- `readCount`: Number of read receipts.
- `timestamp`: Timestamp when the read receipt was sent.
- The original `content` property is removed, and the server no longer delivers ACK extension content.

### Renamed EMMessage read-related methods

| 4.x API | 5.0.0 API | Description |
| :--- | :--- | :--- |
| `EMChatMessage.isReadAcked` | `EMChatMessage.isPeerRead` | Indicates whether the peer has read the message. In 5.0.0, this is a read-only property. |
| Read-write `EMChatMessage.isRead` | Read-only `EMChatMessage.isRead` | The property name is unchanged, but the setter is removed. Local message read status is maintained internally by the SDK. |
| `EMChatMessage.isNeedGroupAck` | `EMChatMessage.isNeedReadReceipt` | Applies to both one-to-one and group chats. Set it before sending a message to specify whether a read receipt is required. |
| `EMChatMessage.groupAckCount` | `EMChatMessage.groupReadReceiptCount` | Gets the number of users who have read a group chat message. In 5.0.0, this is a read-only property. |

### Multi-device events

The following enum values are added to `EMMultiDevicesEvent`. After the current account clears unread counts on another device, the current device receives a notification through `EMMultiDevicesDelegate#multiDevicesConversationEvent:conversationId:conversationType:`:

- `EMMultiDevicesEventConversationUnreadMessageCountCleared = 65`: Another device cleared the unread count of the specified conversation.
- `EMMultiDevicesEventAllConversationUnreadMessageCountCleared = 66`: Another device cleared the unread counts of all conversations.

## Chat group configuration model redesign

EasyIM iOS SDK 5.0.0 replaces the single `EMGroupStyle` enum for chat group visibility, join approval, and member invitation permissions with independent properties in `EMGroupConfigs`. **No compatibility layer is provided for this change. You must modify chat group creation and configuration code during the upgrade.**

### Mapping between `EMGroupStyle` and `EMGroupConfigs`

| 4.x `EMGroupStyle` (removed) | 5.0.0 `EMGroupConfigs` configuration |
| :--- | :--- |
| `EMGroupStylePrivateOnlyOwnerInvite` | `isPublic = NO`, `allowInvites = NO` |
| `EMGroupStylePrivateMemberCanInvite` | `isPublic = NO`, `allowInvites = YES` |
| `EMGroupStylePublicJoinNeedApproval` | `isPublic = YES`, `joinApprovalRequired = YES` |
| `EMGroupStylePublicOpenJoin` | `isPublic = YES`, `joinApprovalRequired = NO` |

### Mapping between `EMGroupOptions` and `EMGroupConfigs`

| 4.x `EMGroupOptions` (removed) | 5.0.0 `EMGroupConfigs` |
| :--- | :--- |
| `EMGroupStyle style` | `isPublic`, `joinApprovalRequired`, and `allowInvites` of type `BOOL`. All default to `NO`. |
| `NSInteger maxUsers = 200` | `NSInteger maxUsers = 200`, unchanged |
| `BOOL IsInviteNeedConfirm = YES` | The property and default value are unchanged. |
| `NSString *ext` | The property is unchanged. In 5.0.0, the default is an empty string. |

### Related API changes

| 4.x API | 5.0.0 API or adaptation |
| :--- | :--- |
| Synchronous `createGroupWithSubject:description:invitees:message:setting:error:` | Removed. Use `createGroupWithSubject:avatar:description:invitees:message:setting:completion:`. The type of `setting` is `EMGroupConfigs *`. This API asynchronously creates a chat group and supports setting a chat group avatar. |
| `createGroupWithSubject:description:invitees:message:setting:completion:` (without the `avatar:` parameter) | Removed. Use `createGroupWithSubject:avatar:description:invitees:message:setting:completion:`. Pass `nil` for `avatar` if no avatar is set. |
| `EMGroupOptions *setting` in `createGroupWithSubject:avatar:description:invitees:message:setting:completion:` | The method selector is unchanged, but the type of `setting` changes to `EMGroupConfigs *` to submit the split chat group configurations. |
| Type `EMGroupOptions *` of `EMGroup.settings` | Type `EMGroupConfigs *` of `EMGroup.settings`, used to read chat group configurations. |
| None | `updateGroupWithId:types:configs:completion:`: After creating a chat group, updates the fields specified by `types` in the chat group configuration. |
| None | `EMGroupConfigsType`: Includes `EMGroupConfigsTypeAllowInvites`, `MaxUsers`, `InviteNeedConfirm`, `JoinApprovalRequired`, `IsPublic`, and `Ext`, which can be combined with a bitwise OR. |

The chat group name, description, and avatar are not part of `EMGroupConfigsType`. Continue to update them with `updateGroupSubject:forGroup:completion:`, `updateDescription:forGroup:completion:`, and `updateGroupAvatar:groupId:completion:`, respectively.

## Device management and authentication

With the removal of password-based login, device authentication APIs based on "user ID + password" are also removed. Version 5.0.0 retains asynchronous APIs based on "user ID + Token":

| 4.x API | 5.0.0 alternative | Description |
| :--- | :--- | :--- |
| `getLoggedInDevicesFromServerWithUsername:password:error:` and `getLoggedInDevicesFromServerWithUsername:password:completion:` | `getLoggedInDevicesFromServerWithUserId:token:completion:` | Queries the devices on which a specified account is currently logged in. Both the synchronous and asynchronous password versions are removed. |
| `kickDeviceWithUsername:password:resource:` and `kickDeviceWithUsername:password:resource:completion:` | `kickDeviceWithUserId:token:resource:completion:` | Kicks a specified login device of an account. Obtain `resource` from the device list. |
| `kickAllDevicesWithUsername:password:` and `kickAllDevicesWithUsername:password:completion:` | `kickAllDevicesWithUserId:token:completion:` | Kicks all login devices of a specified account. |

The target user Token required by these APIs should be provided by a trusted business server. Do not store other users' passwords on the client.

## Other removed APIs

### APIs with no client-side alternative

| Class | Removed API | Description | Migration recommendation |
| :--- | :--- | :--- | :--- |
| `EMClient` | `registerWithUsername:password:` and its completion version | Registers an EasyIM account. | Register through server-side REST APIs. |
| `EMClient` | `fetchTokenWithUsername:password:completion:` | Obtains a Token with a username and password. | Have the business server obtain the Token and deliver it to the client. |
| `EMClient` | `serviceCheckWithUsername:password:completion:` and `EMServerCheckType` | Checks the account, DNS, Token, and login path. | Diagnose issues by using the normal login completion, connection status, and Token expiration callbacks. |
| `EMClient` | `statisticsManager`, `IEMStatisticsManager`, `EMStatisticsManager`, `EMChatMessageStatistics`, and related enums | Queries SDK statistics such as message count, message size, and attachment size. | Collect and calculate statistics on the business side. |
| `IEMChatManager` | `reportMessageWithId:tag:reason:completion:` | Reports a message. | Submit the message ID, report type, and reason to the App Server. |
| `IEMChatManager` | `importConversations:completion:` | Imports a conversation list into the local database. | Remove the call. Rely on SDK data synchronization and local conversation APIs to maintain the conversation list. |
| `IEMGroupManager` | `getPublicGroupsFromServerWithCursor:pageSize:error:` and its completion version | Retrieves the server public chat group list by page. | Have the business service maintain a discoverable chat group directory. |
| `IEMGroupManager` | `searchPublicGroupWithId:error:` and its completion version | Searches for a public chat group by ID. | If the chat group ID is known, use a chat group details API according to business authorization. The business service provides public chat group search. |
| `IEMChatroomManager` | Synchronous and asynchronous `createChatroomWithSubject:description:invitees:message:...` | Creates a chat room. | Create the chat room through server-side REST APIs. |
| `IEMChatroomManager` | `destroyChatroom:` and `destroyChatroom:completion:` | Destroys a chat room. | Destroy the chat room through server-side REST APIs. |

### APIs with alternatives

| 4.x API | 5.0.0 API | Description | Migration instructions |
| :--- | :--- | :--- | :--- |
| `modifyMessage:body:completion:` | `modifyMessage:body:ext:completion:` | Modifies a local and server message. | Adds the `ext` parameter. `body` and `ext` cannot both be `nil`. |
| `resendMessage:progress:completion:` | `sendMessage:progress:completion:` | Resends a failed message. | Use the unified message sending API to resend the original message object. |
| Synchronous `fetchHistoryMessagesFromServer:conversationType:...` and old `asyncFetchHistoryMessagesFromServer:...` overloads | `fetchMessagesFromServerBy:conversationType:cursor:pageSize:option:completion:` | Retrieves historical messages from the server by page. | Use the new asynchronous pagination API and `EMFetchServerMessagesOption`. |
| Synchronous and old asynchronous overloads of `IEMChatManager#loadMessagesWithType:timestamp:count:fromUser:searchDirection:` | `EMConversation#loadMessagesWithType:timestamp:count:fromUser:searchDirection:completion:` | Loads messages of a specified type from the local database for a specified conversation. | The API moves to `EMConversation`. Process the message list and error in the completion to avoid blocking the calling thread. |
| Old `loadMessagesWithKeyword:...` overloads | `loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:scope:completion:` | Searches local messages by keyword. | The new API adds `scope` to specify whether to search message content or extension fields. |
| `EMImageMessageBody#initWithData:thumbnailData:` and `EMFileMessageBody#initWithData:displayName:` | `initWithLocalPath:displayName:` | Creates an image or file message body to send. | Save `NSData` as a local file first and then pass the file path. If the display name is empty, the SDK uses the local filename. |
| `EMChatMessage#getReaction:` | `EMChatMessage.reactionList` | Gets a message Reaction by its content. | Iterate through `reactionList` and match the target Reaction. |
| `EMStreamChunk.sequenceNumber` | `EMStreamChunk.isComplete` | Determines the streaming message chunk status. | Version 5.0.0 no longer exposes the chunk sequence number. Use the read-only property to determine whether the streaming message is complete. |
| `EMGroup.isPushNotificationEnabled` | `EMConversation.disturbType`, or `getSilentModeForConversation:conversationType:completion:` | Queries whether push reminders are enabled for a chat group conversation. | Read the conversation-level do-not-disturb setting from the chat group conversation or push module. |
| Synchronous chat group management APIs such as `addOccupants:`, `removeOccupants:`, `blockOccupants:`, and `unblockOccupants:` | `addMembers:toGroup:message:completion:`, `removeMembers:fromGroup:completion:`, `blockMembers:fromGroup:completion:`, and `unblockMembers:fromGroup:completion:` | Adds, removes, adds to the blocklist, or removes from the blocklist chat group members. | Use the corresponding asynchronous member management API and completion. |
| `getGroupSpecificationFromServerWithId:error:` and `getGroupSpecificationFromServerWithId:fetchMembers:error:` | Corresponding `getGroupSpecificationFromServerWithId:completion:` and `getGroupSpecificationFromServerWithId:fetchMembers:completion:` | Retrieves chat group details and can also retrieve members. | The synchronous versions are removed. Use the completion versions. |
| `getGroupMemberListFromServerWithId:cursor:pageSize:error:` | `getGroupMemberListFromServerWithId:cursor:pageSize:completion:` | Retrieves the chat group member list by page. | Use the completion to return the cursor result and error. |
| `getGroupBlacklistFromServerWithId:pageNumber:pageSize:error:` and `getGroupMuteListFromServerWithId:pageNumber:pageSize:error:` | Corresponding completion versions | Retrieves the chat group blocklist or mute list by page. | The synchronous versions are removed. Use the completion versions. |
| `getGroupWhiteListFromServerWithId:error:` and `isMemberInWhiteListFromServerWithGroupId:error:` | `getGroupWhiteListFromServerWithId:completion:` and `isMemberInWhiteListFromServerWithGroupId:completion:` | Retrieves the chat group allowlist or checks whether the current user is on the chat group allowlist. | The synchronous versions are removed. Use the completion versions. |
| `getGroupFileListWithId:pageNumber:pageSize:error:` | `getGroupFileListWithId:pageNumber:pageSize:completion:` | Retrieves chat group shared files by page. | The synchronous version is removed. Use the completion version. |
| `getGroupAnnouncementWithId:error:` | `getGroupAnnouncementWithId:completion:` | Retrieves the chat group announcement. | The synchronous version is removed. Use the completion version. |
| `changeGroupSubject:forGroup:error:` and `changeDescription:forGroup:error:` | `updateGroupSubject:forGroup:completion:` and `updateDescription:forGroup:completion:` | Changes the chat group name or description. | Use the asynchronous APIs and obtain the updated chat group object in the completion. |
| `leaveGroup:error:`, `destroyGroup:`, `blockGroup:error:`, and `unblockGroup:error:` | `leaveGroup:completion:`, `destroyGroup:finishCompletion:`, `blockGroup:completion:`, and `unblockGroup:completion:` | Leaves, destroys, blocks, or unblocks a chat group. | The synchronous versions are removed. Use the completion versions. |
| `updateGroupOwner:newOwner:error:`, `addAdmin:toGroup:error:`, and `removeAdmin:fromGroup:error:` | Corresponding `updateGroupOwner:newOwner:completion:`, `addAdmin:toGroup:completion:`, and `removeAdmin:fromGroup:completion:` | Transfers chat group ownership or adds or removes a chat group admin. | The synchronous versions are removed. Use the completion versions. |
| `muteMembers:muteMilliseconds:fromGroup:error:`, `unmuteMembers:fromGroup:error:`, `muteAllMembersFromGroup:error:`, and `unmuteAllMembersFromGroup:error:` | Corresponding completion versions | Mutes or unmutes specified members or all members. | The synchronous versions are removed. Use the completion versions. |
| `addWhiteListMembers:fromGroup:error:` and `removeWhiteListMembers:fromGroup:error:` | Corresponding completion versions | Adds users to or removes users from the chat group allowlist. | The synchronous versions are removed. Use the completion versions. |
| `removeGroupSharedFileWithId:sharedFileId:error:`, `updateGroupAnnouncementWithId:announcement:error:`, and `updateGroupExtWithId:ext:error:` | Corresponding completion versions | Deletes a chat group shared file or updates a chat group announcement or extension information. | The synchronous versions are removed. Use the completion versions. |
| `joinPublicGroup:error:` and `applyJoinPublicGroup:message:error:` | `joinPublicGroup:completion:` and `requestToJoinPublicGroup:message:completion:` | Directly joins a public chat group or requests to join a public chat group that requires approval. | The synchronous versions are removed, and the request-to-join method is also renamed. |
| `getGroupsWithoutPushNotification:` | `EMConversation.disturbType`, or `getSilentModeForConversation:conversationType:completion:` | Retrieves chat groups for which push notifications are disabled. | The old chat group-level query is removed. Query the do-not-disturb setting of the chat group conversation instead. |
| Synchronous versions of `acceptJoinApplication:`, `declineJoinApplication:`, `acceptInvitationFromGroup:`, and `declineInvitationFromGroup:` | `approveJoinGroupRequest:sender:completion:`, `declineJoinGroupRequest:sender:reason:completion:`, `acceptInvitationFromGroup:inviter:completion:`, and `declineGroupInvitation:inviter:reason:completion:` | Approves or declines a join request or handles a chat group invitation. | Use the asynchronous APIs with clearer semantics and provide the applicant or inviter ID. |
| Synchronous contact operations: `addContact:message:`, `addUserToBlackList:`, `removeUserFromBlackList:`, `acceptInvitationForUsername:`, `declineInvitationForUsername:`, and `getSelfIdsOnOtherPlatformWithError:` | Corresponding completion versions: `addContact:message:completion:`, blocklist operations, `approveFriendRequestFromUser:completion:`, `declineFriendRequestFromUser:completion:`, and `getSelfIdsOnOtherPlatformWithCompletion:` | Adds contacts, manages the blocklist, handles contact requests, and queries login IDs on other platforms. | Use the retained asynchronous APIs. Retrieve the local blocklist through `getBlackList`. |
| `getBlackListFromServerWithError:` | `getBlackListFromServerWithCompletion:` | Retrieves the current user's blocklist from the server. | The synchronous version is removed. Return the blocklist and error through the completion. |
| `IEMPushManager#updatePushDisplayStyle:`, `updatePushDisplayName:`, and `getPushOptionsFromServerWithError:` | `updatePushDisplayStyle:completion:`, `updatePushDisplayName:completion:`, and `getPushNotificationOptionsFromServerWithCompletion:` | Updates the push display style or display name, or retrieves server push configurations. | The synchronous versions are removed. Process the result in the completion. |

## Major new APIs

| Class | New API | Description |
| :--- | :--- | :--- |
| `EMOptions` | `dataSyncType` and `EMDataSyncType` | Configures automatic synchronization of conversations, contacts, and joined chat groups after login. Types can be combined with a bitwise OR. |
| `EMClientDelegate` | `onDatabaseOpened:username:`, `syncDataStartWithType:`, and `syncDataFinished:type:` | Monitors local database opening and the start and end of automatic data synchronization. |
| `IEMChatManager` | `sendMessageReadReceipts:completion:` | Sends read receipts for one-to-one or group chat messages in bulk. Pass up to 50 messages, which must belong to the same conversation. |
| `IEMChatManager` | `clearConversationUnreadMessageCount:completion:` and `clearAllConversationUnreadMessageCount:` | Clears the local unread count for a specified conversation or all conversations and synchronizes the result to the current account's other devices, without sending message read receipts to senders. |
| `IEMChatManager` | `getGroupMessageReadReceipts:completion:` | Queries group message read receipt summaries in bulk. Pass up to 20 messages, which must belong to the same conversation. |
| `IEMChatManager` | `getUnreadMessageCount` | Gets the total unread message count of local conversations. Chat rooms and conversations in do-not-disturb mode are excluded. |
| `IEMChatManager` | `addConversationDelegate:delegateQueue:` and `removeConversationDelegate:` | Registers or removes a conversation list update delegate and allows the callback queue to be specified. |
| `EMConversation` | `conversationName` and `conversationAvatar` | Gets the conversation display name and avatar. For a one-to-one chat, returns the peer's user information; for a group chat, returns the chat group information. The value may be empty if the relevant data has not been synchronized. |
| `IEMContactManager` | `saveBlackList:completion:` | Adds users to the blocklist in bulk and returns any operation error through the completion. |
| `IEMGroupManager` | `updateGroupWithId:types:configs:completion:` | Updates the fields specified by `EMGroupConfigsType` in the chat group configuration. |
| `EMGroup` | `users` | Gets the IDs of all chat group members, including the owner, admins, and regular members. The SDK merges the arrays by role without deduplication. |
| `EMMultiDevicesEvent` | `EMMultiDevicesEventConversationUnreadMessageCountCleared` and `EMMultiDevicesEventAllConversationUnreadMessageCountCleared` | Notifies other devices that the unread count of one conversation or all conversations has been cleared. |

## Summary of listener callback changes

Even if an implementation class does not use an `@selector` check, removal of an old callback might not immediately produce a compilation error, but the corresponding event cannot be received at runtime. During the upgrade, check every delegate implementation and registration location.

| Listener | 4.x callback | 5.0.0 callback | Description |
| :--- | :--- | :--- | :--- |
| `EMClientDelegate` | `autoLoginDidCompleteWithError:` | No direct alternative. Use `loginWithUsername:token:completion:`. | Active Token-based login completion notification. |
| `EMClientDelegate` | `userAccountDidLoginFromOtherDevice:` and the parameterless `userAccountDidLoginFromOtherDevice` | `userAccountDidLoginFromOtherDeviceWithInfo:` | Notifies the current account that it has logged in on another device. In 5.0.0, `EMLoginExtensionInfo` provides the login device and extension information. |
| `EMClientDelegate` | None | `onDatabaseOpened:username:` | The local database for the current account has finished opening. This does not indicate that business data synchronization is complete. |
| `EMClientDelegate` | None | `syncDataStartWithType:` and `syncDataFinished:type:` | Notifies the app that synchronization starts and ends for the specified data type. |
| `EMContactManagerDelegate` | `onFriendStartSync` and `onFriendSyncFinished:` | `EMClientDelegate#syncDataStartWithType:` and `syncDataFinished:type:` | Contact synchronization callbacks move to the client delegate and are identified by `EMDataSyncTypeContacts`. |
| `EMChatManagerDelegate` | `messagesDidRead:` and `groupMessageDidRead:groupAcks:` | `onMessageReadReceipts:` | Uniformly receives message read receipts for one-to-one and group chats. |
| `EMChatManagerDelegate` | `groupMessageAckHasChanged` | `onMessageReadReceipts:` | Notification that group chat message read receipt status has changed. |
| `EMChatManagerDelegate` | `onConversationRead:to:` | No direct alternative | The conversation-level read receipt callback is removed. Process messages through `onMessageReadReceipts:`. |
| `EMChatManagerDelegate` | `conversationListDidUpdate:` | `EMConversationDelegate#conversationListDidUpdate:` | The conversation list update callback moves to a separate delegate. Register it with `addConversationDelegate:delegateQueue:`. |
| `EMGroupManagerDelegate` | `joinGroupRequestDidDecline:reason:` and `joinGroupRequestDidDecline:reason:applicant:` | `joinGroupRequestDidDecline:reason:decliner:applicant:` | Adds the decliner ID and consistently retains the applicant ID. The old two- and three-parameter callbacks are removed. |
| `EMGroupManagerDelegate` | `userDidJoinGroup:user:` | `userDidJoinGroup:users:` | Changes the single-member parameter to a member array so that multiple members joining a chat group can be reported at once. |
| `EMGroupManagerDelegate` | `userDidLeaveGroup:user:` | `userDidLeaveGroup:users:` | Changes the single-member parameter to a member array so that multiple members leaving a chat group can be reported at once. |

## Behavior changes

The following changes might not all produce compilation errors, but they affect business logic:

1. **Change to the scope of the total unread message count**

   `IEMChatManager#getUnreadMessageCount` gets the total unread message count of local one-to-one and group chat conversations. Its counting scope is as follows:
   Its counting scope is as follows:

   - Chat room conversations are excluded.
   - Unread messages in message threads are excluded.
   - Conversations whose push notification method is `EMPushRemindTypeMentionOnly` or `EMPushRemindTypeNone` are excluded. Even if these conversations contain unread messages, they are not included in the count.
   - Only one-to-one and group chat conversations whose push notification method is `EMPushRemindTypeAll` are included.
  
  If your business requires a different counting scope, iterate through `getAllConversations` and add up `unreadMessagesCount` based on the conversation type and `disturbType`.

2. **Clearing unread counts does not send message read receipts**

   `clearConversationUnreadMessageCount:completion:` only clears the local unread count of the specified conversation and synchronizes the result to the current account's other devices. It does not send read receipts to message senders. To notify senders, also call `sendMessageReadReceipts:completion:` for the messages.

3. **The SDK no longer logs in automatically after initialization**

   After `initializeSDKWithOptions:` completes, the SDK does not automatically log in based on historical login records. The app must securely store and update the Token and actively call `loginWithUsername:token:completion:` at the appropriate time.

4. **The app can no longer modify message read status directly**

   In 5.0.0, `EMChatMessage.isRead` is a read-only property, and the per-message and mark-all-as-read APIs of `EMConversation` are also removed. Use the conversation unread-count clearing APIs. Send message read receipts through the separate batch receipt API.

5. **Attachment message bodies no longer accept `NSData` initializers**

   The `initWithData:...` initializers for image and file message bodies are removed. The app must first save the attachment as a local file, then create the message body with `initWithLocalPath:displayName:`, and ensure that the file path remains valid until sending is complete.

6. **Many synchronous APIs move to completion versions**

   Many synchronous APIs for Token-based login, chat group management, contact management, and push configurations are removed. Callers must not rely on synchronous return values. Process success, errors, and UI refreshes in asynchronous completions, and avoid simulating synchronous waits on the main thread.

7. **Local lists may be incomplete before automatic synchronization finishes**

   `onDatabaseOpened:username:` indicates only that the database is accessible. If `dataSyncType` contains the corresponding type, wait for `syncDataFinished:type:` to succeed before treating the local conversation, contact, or joined chat group query result as the latest data after the current login.

8. **New multi-device unread-count synchronization events**

   When the current account clears conversation unread counts on another device, the local device receives an event through `multiDevicesConversationEvent:conversationId:conversationType:`. After receiving `EMMultiDevicesEventConversationUnreadMessageCountCleared` or `EMMultiDevicesEventAllConversationUnreadMessageCountCleared`, reread the local conversations and refresh the UI.
