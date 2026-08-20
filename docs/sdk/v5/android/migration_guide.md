# EasyIM SDK 4.x to 5.0.0 Migration Guide

## Upgrade overview

Android EasyIM SDK 5.0.0 is a major release that is not source-compatible with earlier versions. The upgrade mainly involves the following four areas:

1. **Data synchronization mechanism changes**
   After login, the SDK can automatically synchronize conversations, contacts, and joined chat groups and save the data to the local database, replacing some APIs that previously required the app to actively retrieve data from the server.
2. **Read receipt mechanism redesign**
   Read receipts are now sent in batches instead of individually. Clearing the local unread count and sending message read receipts to message senders are now independent operations. One-to-one chats and group chats use a unified receipt model and callback.
3. **Chat group configuration model redesign**
   The single `EMGroupStyle` enum has been replaced with three Boolean fields: `isPublic`, `joinApprovalRequired`, and `allowInvites`. Chat group properties can also be updated by configuration type after a chat group is created.
4. **Legacy API cleanup**
   APIs that have long been marked as `@Deprecated` and some rarely used capabilities have been removed. Features such as registration, reporting, and message traffic statistics must now be implemented through the app server or server-side REST APIs. Password-based login has been removed, and only token-based login is supported.

:::tip
**Integration requirement:** Android EasyIM SDK 5.0.0 has fully migrated to AndroidX. The host app must enable AndroidX by setting `android.useAndroidX=true`.
Projects that use legacy `android.support.*` dependencies must migrate to AndroidX first.
:::

## Initialization and login

### Removal of automatic login

Android SDK v5 no longer automatically logs in during `EMClient#init`. After the app cold starts, call `loginWithToken` at an appropriate time to log in.

In 4.x, automatic login logic based on `getAutoLogin()` and `isLoggedInBefore()` ran at the end of `EMClient#init`. This logic and the related APIs have been removed in 5.0.

| Removed API | Alternative | Description |
| :------------------- | :----- | :------------ |
| `EMOptions#setAutoLogin(boolean)` / `getAutoLogin()` | No direct alternative. After the app starts, actively call `loginWithToken(...)`. | Sets or retrieves whether the SDK automatically logs in. |
| `EMClient#isLoggedInBefore()` | Use the following methods based on your business requirements:<br/> - `isLoggedIn()`: current login state<br/> - `isConnected()`: connection state <br/> - `isDatabaseOpened()`: local database readiness | Determines whether a previous login record exists. |

### Removal of password-based login

Android SDK v5 supports only token-based login. Account management operations such as user registration and token acquisition must be handled by the app server.

| Removed API | Alternative | Description |
| :------------------- | :----- | :--------- |
| `login(String id, String password, EMCallBack)` (deprecated in 4.x) | `loginWithToken(String username, String token, EMCallBack)` | Logs in with a user ID and password. |
| `loginWithAgoraToken(String, String, EMCallBack)` (deprecated in 4.x) | `loginWithToken(String username, String token, EMCallBack)` | Logs in with an Agora token. |
| `renewToken(String newAgoraToken)` (deprecated in 4.x) | `renewToken(String newToken, EMCallBack)` | Updates the current login session with a new token. |
| `getUserTokenFromServer(String, String, EMValueCallBack<String>)` | No client-side alternative. The app server obtains and delivers the token. | Obtains or requests a user token through the SDK. |
| `createAccount(String username, String password)` | No client-side alternative. Register through a server-side REST API. | Registers an EasyIM account. |
| `check(String, String, CheckResultListener)` and `EMCheckType` | No direct alternative. Diagnose connectivity through the normal login flow and connection status callbacks. | Checks account, DNS, or login-related status. |

### Decoupling login from database opening

Android v5.0 adds a callback for opening the local database. Once the local database is open, the SDK can read local data without waiting for login to complete, helping the app display its first screen faster after a cold start.

- `EMConnectionListener#onDatabaseOpened(String username)`: Triggered when the local database is opened.
- `EMClient#isDatabaseOpened()`: Checks whether the local database is currently ready.

## Data synchronization and server data retrieval API migration

### Data synchronization APIs

Android SDK v5.0.0 adds automatic data synchronization after login. During initialization, the app can use `EMOptions#setDataSyncType` to specify the data types to synchronize and use `EMConnectionListener` to monitor synchronization progress. After synchronization is complete, the app should read data through local APIs.

| Class | API or configuration | Description |
| :------------------- | :----- | :-------------------------------------------- |
| `EMOptions` | `EMDataSyncType` | Data synchronization type enum: `NONE(0)`, `CONVERSATIONS(1 << 0)`, `CONTACTS(1 << 1)`, and `JOINED_GROUPS(1 << 2)`. Multiple types can be combined. |
| `EMOptions` | `setDataSyncType(EnumSet<EMDataSyncType>)` / `getDataSyncType()` | Sets or retrieves the data types to automatically synchronize after login. Configure this option before calling `EMClient#init`. |
| `EMConnectionListener` | `onDataSyncStart(EMDataSyncType type)` / `onDataSyncFinish(EMDataSyncType type, int errorCode)` | Receives start and completion notifications for synchronization of the specified data type. Synchronization succeeds when `errorCode` is `EMError#EM_NO_ERROR`. |

:::tip
`EMOptions#dataSyncType` defaults to `NONE`. If it is not configured, conversations, contacts, and joined chat groups are not automatically synchronized after login. Consequently, `getAllConversations()`, `getAllGroups()`, and local contact query APIs may return no data. 
:::

A typical configuration is as follows:

```java
EMOptions options = new EMOptions();
options.setAppKey("your-appkey");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS,
        EMOptions.EMDataSyncType.CONTACTS,
        EMOptions.EMDataSyncType.JOINED_GROUPS));
EMClient.getInstance().init(context, options);
```

### Server data retrieval API migration

The previous workflow—actively calling server data retrieval APIs and refreshing data in callbacks—has been replaced by a unified workflow: **configure the data synchronization scope, automatically synchronize after login, read local data, and refresh the UI in the `onDataSyncFinish` callback**.

| Class | Removed API | Recommended approach in 5.0.0 |
|---|---|---|
| `EMChatManager` | `fetchConversationsFromServer()` and all 4 `asyncFetchConversationsFromServer(...)` overloads | `getAllConversations()` / `getAllConversationsBySort()` (local) + `onDataSyncFinish(CONVERSATIONS, ...)` |
| `EMChatManager` | `asyncFetchPinnedConversationsFromServer(...)` | Pinned status is saved locally during conversation synchronization. Read the local conversation's pinned status. |
| `EMChatManager` | `asyncGetConversationsFromServerWithCursor(...)` | Query locally. |
| `EMGroupManager` | `getJoinedGroupsFromServer()` / `getJoinedGroupsFromServer(pageIndex, pageSize, ...)` and the two async versions | `getAllGroups()` (local) + `onDataSyncFinish(JOINED_GROUPS, ...)` |
| `EMContactManager` | `getAllContactsFromServer()`, `asyncGetAllContactsFromServer(...)`, and `asyncFetchAllContactsFromServer(...)` (including the paginated overload) | `getContactsFromLocal()` / `fetchContactFromLocal(String)` / `asyncFetchAllContactsFromLocal(...)` + `onDataSyncFinish(CONTACTS, ...)`. **In 5.0.0, there is no longer any API for retrieving the contact list from the server.** |
| `EMChatManager` | `loadAllConversations()` | Changed to package-private. Call `getAllConversations()` directly. |
| `EMGroupManager` | `loadAllGroups()` | Changed to package-private. Call `getAllGroups()` directly. |
| `EMOptions` | `setEnableAutoSyncContacts(boolean)` / `isEnableAutoSyncContacts()` | Replaced by the `CONTACTS` value in `setDataSyncType(...)`. |

Accordingly, `EMContactListener#onContactSyncStart()` and `onContactSyncFinishWithError(int, String)` have been removed. Use `EMConnectionListener#onDataSyncStart(EMDataSyncType.CONTACTS)` and `onDataSyncFinish(EMDataSyncType.CONTACTS, int)` to monitor contact data synchronization. For details, see [Summary of listener callback changes](#summary-of-listener-callback-changes).

## Read receipt mechanism redesign

Message read receipts are now sent in batches instead of individually. Whether a receipt is required is configured per message through `EMMessage#setIsNeedReadReceipt`. Sending message read receipts and clearing a conversation's unread count are independent operations. The old APIs have no compatibility aliases, making this a breaking change.

### Sending message read receipts and clearing unread counts

| Removed API | Alternative in 5.0.0 | Description |
| :------------------- | :----- | :-------------------------------------------- |
| `EMChatManager#ackMessageRead(String to, String messageId)` | `asyncSendMessageReadReceipts(List<EMMessage>, EMCallBack)` | Sends message read receipts in batches. The same API is used for one-to-one chats and group chats. |
| `EMChatManager#ackGroupMessageRead(String to, String messageId, String ext)` | `asyncSendMessageReadReceipts(List<EMMessage>, EMCallBack)` | A separate API for sending individual group message read receipts is no longer provided, and custom content can no longer be included in a read receipt through `ext`. |
| `EMChatManager#ackConversationRead(String conversationId)` | `asyncClearConversationUnreadMessageCount(String, EMCallBack)` | Clears only the local unread count for the conversation and synchronizes the change to the current user's other devices. It does not send read receipts to message senders. To send message read receipts, call `asyncSendMessageReadReceipts` separately. |
| `EMChatManager#markAllConversationsAsRead()` | `asyncClearAllConversationUnreadMessageCount(EMCallBack)` | Clears the local unread counts of all conversations and synchronizes the change to the current user's other devices. |
| `EMConversation#markMessageAsRead(String)` / `markAllMessagesAsRead()` | `EMChatManager#asyncClearConversationUnreadMessageCount(String, EMCallBack)` | Clears the local unread count through a conversation-level API. `EMConversation` no longer provides APIs for changing the read state of messages. The SDK maintains the `isRead` state internally. |
| `EMConversation#getMessage(String, boolean markAsRead)` | `getMessage(String)` | Queries a message without automatically marking it as read. To clear the unread count, call the unread-count clearing API separately. |
| `EMOptions#setRequireAck(boolean)` / `getRequireAck()` | No global configuration | Before sending a message, enable read receipts for that message by calling `EMMessage#setIsNeedReadReceipt(true)`. |

`asyncSendMessageReadReceipts` has the following constraints: Each call can process a maximum of 50 messages from the same conversation. Only messages for which `isNeedReadReceipt()` is `true` and whose read receipts have not yet been sent are processed; other messages are automatically skipped. The SDK returns the processing result for the batch through `onSuccess()` or `onError(int, String)`. This API does not clear or change the conversation's local unread count.

### Receiving message read receipts

In Android SDK v5, read receipts for one-to-one and group chat messages are both delivered through an `EMMessageListener` callback instead of separate callbacks.

| 4.x callback | 5.0.0 callback | Description |
| :------------------- | :----- | :----------------- |
| `EMMessageListener#onMessageRead(List<EMMessage>)` | `EMMessageListener#onMessageReadReceipts(List<EMMessageReadReceipt>)` | Receives read receipts for one-to-one chat messages. |
| `EMMessageListener#onGroupMessageRead(List<EMGroupReadAck>)` | `EMMessageListener#onMessageReadReceipts(List<EMMessageReadReceipt>)` | Receives read receipts for group chat messages. |
| `EMConversationListener#onConversationRead(String from, String to)` | No direct alternative | Conversation-level read receipts no longer have a separate callback. Message read state changes are delivered through `onMessageReadReceipts`. In v5, `EMConversationListener` is used only for conversation update notifications. |
| `EMMessageListener#onReadAckForGroupMessageUpdated()` | `EMMessageListener#onReadReceiptForGroupMessageUpdated()` | Triggered when the read receipt state of a group chat message changes. Only the callback name has changed. |

SDK v5 adds the `EMMessageReadReceipt` data class to describe message read receipts:

- `getMessageId()`: Gets the message ID.
- `getConversationId()`: Gets the conversation ID.
- `isPeerReceipt()`: Determines whether the peer in a one-to-one chat has sent a read receipt.
- `getReadCount()`: Gets the number of users who have read a group chat message.

### Querying receipt details

| 4.x API | 5.0.0 API | Description |
| :------------------- | :----- | :-------------- |
| `fetchGroupReadAcks(String msgId, int pageSize, String startAckId)` / `asyncFetchGroupReadAcks(...)` | `asyncFetchGroupMessageReadReceipts(String msgId, int pageSize, String startAckId, EMValueCallBack<EMCursorResult<EMGroupReadReceipt>>)` | Retrieves details of read receipts for a specified group chat message by page. The value of `pageSize` ranges from 1 to 50, and `startAckId` specifies where pagination starts. |
| None | `asyncGetGroupMessageReadReceipts(List<EMMessage>, EMValueCallBack<List<EMMessageReadReceipt>>)` | Retrieves read receipt summaries for group chat messages in batches. Each call accepts a maximum of 20 messages, and all messages must belong to the same conversation. |

The `EMGroupReadAck` receipt data model has been replaced by `EMGroupReadReceipt`:

- `getAckId()`: Gets the read receipt ID.
- `getMsgId()`: Gets the group chat message ID.
- `getFrom()`: Gets information about the chat group member who sent the read receipt. The return type is `EMGroupMemberInfo`.
- `getCount()`: Gets the number of read receipts.
- `getTimestamp()`: Gets the timestamp when the read receipt was sent.
- The original `getContent()` has been removed. The server no longer delivers ACK extension content.

### Renamed EMMessage read-related methods

| 4.x API | 5.0.0 API | Description |
| :------------------- | :----- | :-------------------------------------------- |
| `isAcked()` / `setAcked(boolean)` | `isPeerRead()` / `setPeerRead(boolean)` | Determines whether the peer has read the message. `setPeerRead` is for internal SDK use only. |
| `isUnread()` / `setUnread(boolean)` | `isRead()` / `setRead(boolean)` | The read state now uses affirmative semantics. `setRead` is for internal SDK use only. |
| `isNeedGroupAck()` / `setIsNeedGroupAck(boolean)` | `isNeedReadReceipt()` / `setIsNeedReadReceipt(boolean)` | Applies to both one-to-one chats and group chats. Before sending a message, specify whether it requires a read receipt. |
| `groupAckCount()` / `setGroupAckCount(int)` | `readReceiptCount()` / `setReadReceiptCount(int)` | Gets the number of users who have read the group chat message. `setReadReceiptCount` is for internal SDK use only. |

### Multi-device events

The following events have been added to `EMMultiDeviceListener` to notify the current account when unread counts are cleared on another device:

- `CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 65`: The unread count of a specified conversation was cleared on another device.
- `ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 66`: The unread counts of all conversations were cleared on another device.

## Chat group configuration model redesign

Android SDK v5 replaces the single `EMGroupStyle` enum for chat group visibility, join approval, and member invitation permission with independent configuration fields in `EMGroupConfigs`. **No compatibility layer is provided for this change. When upgrading, update the related chat group creation and configuration code.**

### Mapping between `EMGroupStyle` and `EMGroupConfigs`

| 4.x `EMGroupManager.EMGroupStyle` (removed) | 5.0.0 `EMGroupConfigs` configuration |
| :---------------- | :----- |
| `EMGroupStylePrivateOnlyOwnerInvite` | `isPublic = false`, `allowInvites = false` |
| `EMGroupStylePrivateMemberCanInvite` | `isPublic = false`, `allowInvites = true` |
| `EMGroupStylePublicJoinNeedApproval` | `isPublic = true`, `joinApprovalRequired = true` |
| `EMGroupStylePublicOpenJoin` | `isPublic = true`, `joinApprovalRequired = false` |

### Mapping between `EMGroupOptions` and `EMGroupConfigs`

| 4.x `EMGroupOptions` (removed) | 5.0.0 `EMGroupConfigs` |
| :---------------- | :----- |
| `EMGroupStyle style` | `boolean isPublic`, `joinApprovalRequired`, and `allowInvites`, all of which default to `false` |
| `int maxUsers = 200` | `int maxUsers = 200`, unchanged |
| `boolean inviteNeedConfirm` | Unchanged |
| `String extField` | Unchanged |

### Related API changes

| 4.x API | 5.0.0 API or adaptation |
| :---------------- | :----- |
| `createGroup(groupName, desc, allMembers, reason, EMGroupOptions)` | This overload has been removed. Use `createGroup(String groupName, String avatar, String desc, String[] allMembers, String reason, EMGroupConfigs configs)` or the corresponding `asyncCreateGroup(...)`. |
| `EMGroup#isMemberOnly()` | `EMGroup#isJoinApprovalRequired()`. This method indicates only whether approval is required to join a public chat group. |
| None | `updateGroupConfigs(String groupId, EnumSet<EMGroupConfigsType>, EMGroupConfigs)` and `asyncUpdateGroupConfigs(...)`: Update chat group properties by specified configuration type after the chat group is created. |
| None | `EMGroupManager.EMGroupConfigsType`: Includes `IS_PUBLIC`, `JOIN_APPROVAL_REQUIRED`, `ALLOW_INVITES`, `MAX_USERS`, `INVITE_NEED_CONFIRM`, and `EXT`. |

The method signatures of `EMGroup#isPublic()` and `EMGroup#isMemberAllowToInvite()` remain unchanged, so callers do not need to make changes. The SDK returns results based on the corresponding fields in `EMGroupConfigs`.

## Device management and authentication

With the removal of password-based login, authentication APIs that use a user ID and password have also been removed. Token-based device management APIs remain available:

| 4.x API | Alternative in 5.0.0 | Description |
| :---------------- | :----- | :------------- |
| `kickDevice(String username, String password, String resource)` | `kickDeviceWithToken(String username, String token, String resource)` | Logs out a specified device. |
| `kickAllDevices(String username, String password)` | `kickAllDevicesWithToken(String username, String token)` | Logs out all devices for a specified account. |
| `getLoggedInDevicesFromServer(String username, String password)` | No direct alternative. The app must use a token-based device query API. | Queries the devices logged in to the account by using a username and password. This API has been removed in Android SDK v5. |
| `getLoggedInDevicesFromServerWithToken(String, String)` (synchronous) | `fetchLoggedInDevicesFromServerWithToken(String, String, EMValueCallBack<List<EMDeviceInfo>>)` (asynchronous) | Queries the devices logged in to the account by using a token. Android SDK v5 recommends using the asynchronous API to obtain the results. |

## Other removed APIs

### APIs with no client-side alternative

| Class | Removed API | Description | Migration recommendation|
| :---------- | :----------| :-----| :--------------|
| `EMClient` | `createAccount(...)` | Registers an EasyIM account. | Register through a server-side REST API. |
| `EMClient` | `statisticsManager()`, `EMStatisticsManager`, and related statistics models | SDK message statistics capabilities. | Collect and calculate statistics on the app side. |
| `EMChatManager` | `reportMessage(...)`, `asyncReportMessage(...)` | Reports a message. | Submit report information to the app server. |
| `EMChatManager` | `updateParticipant(String from, String changeTo)` | Updates historical participant information. | Remove calls to this API. |
| `EMGroupManager` | `getPublicGroupsFromServer(...)`, `asyncGetPublicGroupsFromServer(...)` | Retrieves the list of public chat groups from the server. | Maintain the chat group directory through the app server. |
| `EMGroupManager` | Removed overload of `asyncUploadGroupSharedFile(...)` | Asynchronously uploads a chat group shared file. | Remove calls to this overload and use the retained chat group file upload API. |
| `EMChatRoomManager` | `createChatRoom(...)`, `asyncCreateChatRoom(...)` | Creates a chat room. | Create chat rooms through a server-side REST API. |
| `EMChatRoomManager` | `destroyChatRoom(...)`, `asyncDestroyChatRoom(...)` | Destroys a chat room. | Destroy chat rooms through a server-side REST API. |
| `EMChatRoomManager` | `getAllChatRooms()` | Retrieves all chat rooms. | Chat rooms are non-persistent resources. Call `fetchChatRoomFromServer` as needed. Caching a complete chat room list is not recommended. |
| `EMOptions` | `getReportServer()`, `setReportServer(String)` | Gets or sets the data reporting server address. | Remove the related configuration. Handle private deployment requirements on the server side. |

### APIs with alternatives

| 4.x API | 5.0.0 API | Description | Migration instructions |
| :---------- | :----------| :-----| :--------------|
| `EMMessage#createTxtSendMessage(...)` (deprecated) | `createTextSendMessage(String content, String toChatUsername)` | Creates a text message. | Use the new method name. |
| `EMMessage#getUserName()` | `getFrom()` | Gets the message sender ID. | Use `getFrom()`. |
| `EMMessage#getRecaller()` | `EMRecallMessageInfo#getRecallBy()` | Gets the operator who recalled the message. | Obtain `EMRecallMessageInfo` in the `onMessageRecalledWithExt` callback. |
| `EMChatManager#asyncModifyMessage(msgId, body, callBack)` (three parameters) | `asyncModifyMessage(msgId, body, Map<String, Object> ext, callBack)` | Modifies the local and server-side message. | Use the four-parameter method and pass the message body or extension fields to modify according to the message type. |
| Some legacy `EMConversation#searchMsgFromDB(...)` usages | Use synchronous `searchMsgFromDB(...)` or asynchronous `asyncSearchMsgFromDB(...)` depending on the scenario. | Searches for messages in the local database. | Android SDK v5 has not removed all synchronous search APIs. Do not make synchronous calls on the main thread. |
| Legacy overloads of `EMChatManager#fetchHistoryMessages(...)` and `asyncFetchHistoryMessage(...)` | `asyncFetchHistoryMessages(String conversationId, EMConversationType, int pageSize, String cursor, EMFetchMessageOption, EMValueCallBack<EMCursorResult<EMMessage>>)` | Retrieves historical messages from the server by page. | Use the new asynchronous pagination API. |
| `EMGroupManager#getGroupFromServer(String, boolean fetchMembers)` | `getGroupFromServer(String)` | Gets chat group details. | Retrieve chat group members separately through the paginated member API. |
| `EMChatRoomManager#fetchChatRoomFromServer(String, boolean fetchMembers)` | `fetchChatRoomFromServer(String)` | Gets chat room details. | Retrieve chat room members separately through the member API. |
| `EMChatRoomManager#removeChatRoomListener(...)` | `removeChatRoomChangeListener(...)` | Removes a chat room event listener. | Use it together with `addChatRoomChangeListener(...)`. |
| `EMOptions#setAreaCode(int)` and the legacy integer constants of `AreaCode` | `setAreaCode(AreaCode)` | Sets the service area. | `AreaCode` is now an enum that includes `CN(1)`, `NA(2)`, `EU(4)`, `AS(8)`, `JP(16)`, `IN(32)`, and `GLOB(-1)`. Call `getValue()` when an integer value is required. `getAreaCode()` still returns an `int`. |

## Major new APIs

| Class | New API | Description |
| :---------------- | :----- | :------- |
| `EMChatManager` | `asyncDeleteConversations(List<String> conversationIds, boolean deleteMessages, EMCallBack)` | Deletes local conversations in batches and, depending on `deleteMessages`, also deletes their local messages. |
| `EMConversation` | `getConversationName()`, `getConversationAvatar()` | Gets the conversation display name and avatar. For a one-to-one chat, the peer's user information is returned. For a group chat, chat group information is returned. An empty string may be returned if the related data has not yet been synchronized. |
| `EMGroup` | `getUsers()` | Gets a list of the user IDs of the chat group owner, administrators, and regular members. The list combines users by role and may contain duplicate user IDs. |

## Summary of listener callback changes

Even if an implementation class does not use `@Override`, removing old callbacks might not immediately cause a compilation error, but the corresponding events will no longer be received at runtime. When upgrading, check each listener implementation individually.

| Listener | 4.x callback | 5.0.0 callback | Description |
| :----- | :-------| :-----| :-------|
| `EMConnectionListener` | `onLogout(int)`, `onLogout(int, String)` | `onLogout(int errorCode, EMLoginExtensionInfo info)` | Notifies the account that it has been logged out. |
| `EMConnectionListener` | None | `onDataSyncStart(EMDataSyncType)`, `onDataSyncFinish(EMDataSyncType, int)`, `onDatabaseOpened(String)` | Notifies the app when data synchronization starts and finishes and when the local database is opened. |
| `EMMessageListener` | `onMessageRecalled(List<EMMessage>)` | `onMessageRecalledWithExt(List<EMRecallMessageInfo>)` | Receives message recall notifications and obtains recall extension information. |
| `EMMessageListener` | `onMessageRead(...)`, `onGroupMessageRead(...)` | `onMessageReadReceipts(List<EMMessageReadReceipt>)` | Receives read receipts for one-to-one and group chat messages through a unified callback. |
| `EMMessageListener` | `onReadAckForGroupMessageUpdated()` | `onReadReceiptForGroupMessageUpdated()` | Notifies the app that the read receipt state of a group chat message has changed. |
| `EMConversationListener` | `onConversationRead(String, String)` | `onConversationUpdate()` | Triggered when the conversation list changes. |
| `EMContactListener` | `onContactSyncStart()`, `onContactSyncFinishWithError(int, String)` | `EMConnectionListener#onDataSyncStart/onDataSyncFinish(EMDataSyncType.CONTACTS, ...)` | Monitors contact data synchronization status. |
| `EMGroupChangeListener` | `onMemberJoined(String, String)` | `onMembersJoined(String, List<String>)` | Notifies the app that multiple members have joined the chat group. |
| `EMGroupChangeListener` | `onMemberExited(String, String)` | `onMembersExited(String, List<String>)` | Notifies the app that multiple members have left the chat group. |
| `EMGroupChangeListener` | `onRequestToJoinDeclined(groupId, groupName, decliner, reason)` | `onRequestToJoinDeclined(..., String applicant)` | Adds the applicant ID parameter. |
| `EMChatRoomChangeListener` | `onMemberJoined(String roomId, String participant)` | `onMemberJoined(String roomId, String participant, String ext)` | Adds event extension information. |
| `EMChatRoomChangeListener` | `onMuteListAdded(String, List<String>, long expireTime)` | `onMuteListAdded(String, Map<String, Long> muteInfo)` | Uses a mapping between user IDs and mute expiration times. |

## Behavior changes

The following changes might not cause compilation errors but can affect app logic:

1. **The scope of the total unread message count has changed**
   `getUnreadMessageCount` gets the total number of unread messages in local one-to-one and group chat conversations. The API uses the following scope:
    - Chat room conversations are excluded.
    - Unread messages in message threads are excluded.
    - Conversations whose push notification mode is `EMPushRemindType.MENTION_ONLY` or `EMPushRemindType.NONE` are excluded. Even if these conversations contain unread messages, they are not included in the count.
    - Only one-to-one and group chat conversations whose push notification mode is `EMPushRemindType.ALL` are included.

    If the app needs to count unread messages in all conversations, iterate through `getAllConversations()` and add the value returned by `getUnreadMsgCount()` for each conversation.
   
2. **Clearing unread counts does not send message read receipts**
   
   `EMChatManager#asyncClearConversationUnreadMessageCount` only clears the local unread count of the specified conversation and synchronizes the result to the current account's other devices. It does not send read receipts to message senders.  
   If the app needs to notify the peer that messages have been read, it must also call `EMChatManager#asyncSendMessageReadReceipts`.
   
3. **The SDK no longer automatically logs in after initialization**
   
   After `EMClient#init` completes, the SDK does not automatically log in. The app must actively call `EMClient#loginWithToken` at an appropriate time to log in.
   
4. **Querying a message no longer automatically changes its read state**
   
   `EMConversation#getMessage(String)` only queries the specified message and does not automatically mark the message as read. The behavior of the legacy `getMessage(String, boolean markAsRead)`, which changed the read state when querying a message, has been removed.
   
5. **The foreground and background state detection mechanism has changed**
   
   The SDK uses the AndroidX `ProcessLifecycleOwner` to monitor whether the app process is in the foreground or background. It no longer uses `ActivityLifecycleCallbacks`. The SDK now depends on `androidx.lifecycle:lifecycle-process`. During integration, ensure that this dependency is neither excluded nor in conflict.
   
6. **The legacy keep-alive logic of `EMChatService` has been removed**
   
   `EMChatService#onDestroy()` no longer uses `isLoggedInBefore()` to determine login status, nor does it restart the service. The app should no longer rely on this service to keep the login session alive.
   
7. **The push token upload decision logic has changed**

   When the push token changes or the device logs in again, the SDK reuploads the token based on the current login state. The app does not need to determine whether the token needs to be uploaded and should not rely on legacy automatic login logic. Therefore, whether the token is uploaded cannot be understood as being determined solely by `!isLoggedIn()`.
   
8. **New multi-device unread-count synchronization events**
   
   When the current account clears a conversation's unread count on another device, the local device receives the corresponding event through `EMMultiDeviceListener#onConversationEvent`. After receiving the event, the app should call `EMChatManager#getAllConversations()` again to obtain the latest conversation data and refresh the UI.
   
   - `CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 65`: The unread count of the specified conversation was cleared on another device.
   - `ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED = 66`: The unread counts of all conversations were cleared on another device.
