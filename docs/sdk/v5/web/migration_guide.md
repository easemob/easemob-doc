# Migration Guide: Upgrade from the Legacy SDK to the New SDK

This document describes how to migrate from the legacy `easemob-websdk` to the new Web SDK. The new SDK uses `ChatClient` as a unified entry point and separates features into multiple Managers. We recommend first migrating core functionality such as initialization, login, messages, events, and return-value handling, and then migrating user relationships, chat groups, chat rooms, conversations, push, and other modules based on the features used by your app.

## Migration notes

The new SDK retains the core EasyIM capabilities, but changes the API entry points, module organization, message-creation methods, event model, return-value structures, and type validation. During migration, pay particular attention to the following changes:

- APIs are no longer centralized on the `conn` instance. They are separated by capability into Managers such as `ChatManager`, `ContactManager`, `GroupManager`, `ChatRoomManager`, and `PushManager`.
- Messages are no longer created through the unified `WebIM.message.create({ type, ... })` method. Create each message type through the corresponding `client.chatManager.createXxxMessage` method.
- The conversation identifiers change from `to` and `chatType` to `conversationId` and `conversationType`.
- Most asynchronous APIs return business objects directly instead of wrapping them in `AsyncResult<T>`.
- Event listeners still use `addEventHandler` / `removeEventHandler`, but some event names and event-dispatch methods have changed.

## Preparation before migration

Before migration, we recommend completing the following checks:

1. Review the legacy SDK capabilities used in your project and identify the new SDK Managers that must be registered.
2. Check how all messages, message sending, conversation IDs, conversation types, and message extension fields are created or used.
3. Check all event-listener logic, especially message, chat group, chat room, and multi-device events.
4. Check all code that reads API return values through `.data`. The new SDK typically returns business data directly.
5. Check deprecated or removed legacy APIs and replace them with the corresponding new SDK APIs or server-side REST APIs.

## Overview of core changes

| Area | Legacy SDK | New SDK |
| :--- | :--- | :--- |
| Initialization entry point | `new SDK.connection({ appKey })` | `ChatClient.init({ appKey })` |
| API organization | APIs are primarily attached to the `conn` instance. | APIs are separated by feature into Managers such as `client.chatManager` and `client.groupManager`. |
| Manager usage | Managers do not need to be explicitly registered. | Register Managers through `managers` during initialization or through `.use()` after initialization. |
| Message creation | `WebIM.message.create({ type, ... })` | `client.chatManager.createXxxMessage(...)` |
| Message sending | `conn.send(msg)` | `client.chatManager.sendMessage(msg, options?)` |
| Conversation identifier | `to` + `chatType` | `conversationId` + `conversationType` |
| Return value | Most REST APIs return `Promise<AsyncResult<T>>`. | Most APIs directly return `Promise<T>` or synchronous business objects. |
| Event system | Events are dispatched by message type, while chat group and chat room operations are distinguished through aggregated events. | Messages are uniformly dispatched through `onMessage`, while chat group, chat room, and other events use separate event names. |
| Type validation | Weak typing or loose runtime validation. | More complete TypeScript types and parameter validation. |

## Manager mappings

| Legacy SDK capability | New SDK Manager | Description |
| :--- | :--- | :--- |
| Message creation, message sending, conversations, historical messages, receipts, recall, Reactions, message translation, and other features | `client.chatManager` | Manages message- and conversation-related features. |
| Friend list, friend requests, blocklist, and other features | `client.contactManager` | Manages user relationships. |
| User attributes, user-attribute subscriptions, and other features | `client.userInfoManager` | Manages user-attribute-related features. |
| Chat group creation, group information, group members, group announcements, group shared files, and other features | `client.groupManager` | Manages chat-group-related features. |
| Chat room list, details, members, announcements, custom attributes, and other features | `client.chatRoomManager` | Manages chat-room-related features. |
| Presence publishing, subscriptions, queries, and other features | `client.presenceManager` | Manages presence-related features. |
| Message thread creation, joining, leaving, members, messages, and other features | `client.chatThreadManager` | Manages message-thread-related features. |
| Offline push, Do Not Disturb, push language, and other features | `client.pushManager` | Manages push-related features. |

## Migrate installation and initialization

### Changes

The new SDK uses `ChatClient.init` to create a client instance. Register the required business modules through `managers` during initialization or through `.use()` after initialization. An unregistered Manager is not attached to `client`.

### Legacy SDK usage

```typescript
import SDK from 'easemob-websdk';

const conn = new SDK.connection({
  appKey: 'org#app',
  isHttpDNS: true,
  delivery: true,
  isFixedDeviceId: true,
});

conn.addEventHandler('handler', { onConnected: () => {} });
```

### New SDK usage

```typescript
import {
  ChatClient,
  ChatManager,
  ContactManager,
  GroupManager,
} from 'easemob-websdk';

const client = ChatClient.init({
  appKey: 'org#app',
  useFixedDeviceId: true,
  enableDeliveryReceipt: true,
  managers: [ChatManager, ContactManager, GroupManager],
});

client.addEventHandler('handler', { onConnected: () => {} });
```

You can also register Managers as needed through `.use()`:

```typescript
const client = ChatClient.init({ appKey: 'org#app' })
  .use(ChatManager)
  .use(ContactManager)
  .use(GroupManager);
```

### Initialization parameter comparison

| Legacy parameter | New parameter | Description |
| :--- | :--- | :--- |
| `appKey` | `appKey` | Unchanged. |
| `isFixedDeviceId` | `useFixedDeviceId` | Renamed. The default is `true`, which reuses a fixed device identifier in the same browser. |
| `delivery` | `enableDeliveryReceipt` | Renamed. Enables delivery receipts. |
| `isHttpDNS` | - | Handled by the new SDK by default. Explicit configuration is unnecessary. |
| `useOwnUploadFun` | `useCustomAttachmentUpload` | Renamed. |
| `useReplacedMessageContents` | `useReplacedMessageContents` | Unchanged. |
| `customDeviceName` | `customDeviceName` | Unchanged. |
| `customOSPlatform` | `customOSPlatform` | Unchanged. |
| `apiUrl` / `url` | `serviceConfig` | Service-address settings are consolidated into an object. |
| `autoReconnectNumMax` | - | The new SDK has a built-in reconnection policy and does not require configuration. |
| `isDebug` | - | Use `logger.setLevel()` to set the log level. |

### Notes

- Before your app can use modules such as `client.chatManager` and `client.groupManager`, register the corresponding Managers.
- The new SDK's runtime adaptation handles mini program, uni-app, and other runtime environments. You typically do not need to manually inject a platform adapter.
- To use delivery receipts, the recipient must set `enableDeliveryReceipt: true` during initialization.

## Migrate login and logout

### Changes

The new SDK uses `client.login` to log in and `client.logout` to log out. Login parameter names have changed, and password login is no longer recommended for clients.

### Legacy SDK usage

```typescript
await conn.open({
  user: 'userId',
  accessToken: 'token',
});

conn.close();
```

### New SDK usage

```typescript
await client.login({
  userId: 'userId',
  token: 'token',
});

await client.logout();
```

### API comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `conn.open({ user, accessToken })` | `client.login({ userId, token })` | The method and parameters have changed. |
| `conn.close()` | `client.logout()` | Renamed and returns `Promise<void>`. |
| `conn.renewToken(token)` | `client.renewToken(token)` | The method name is unchanged and returns `{ token, expireAt }`. |
| `conn.isOpened()` | `client.getConnectionState()` | Replaced with the connection-state API. |

### Notes

- When the token is about to expire, the SDK triggers `onTokenWillExpire`. Your app should obtain a new token and call `client.renewToken(newToken)`.
- `useFixedDeviceId` affects whether multiple tabs in the same browser are considered the same device. Check this behavior when migrating multi-device eviction logic.

## Migrate event listeners

### Changes

Events are still registered and removed through `addEventHandler` / `removeEventHandler`. However, the new SDK separates and renames some events and dispatches all message events uniformly through `onMessage` instead of by message type.

### Registration

```typescript
// Legacy SDK
conn.addEventHandler('handlerId', {
  onConnected: () => {},
});

conn.removeEventHandler('handlerId');

// New SDK
client.addEventHandler('handlerId', {
  onConnected: () => {},
});

client.removeEventHandler('handlerId');
```

Some Managers also provide their own event-listener entry points. For example:

```typescript
client.chatManager.addEventHandler('chat-handler', {
  onMessage: (message) => {},
});

client.groupManager.addEventHandler('group-handler', {
  onMembersJoined: (event) => {},
});
```

### Message event comparison

| Legacy SDK event | New SDK event | Description |
| :--- | :--- | :--- |
| `onTextMessage(msg)` | `onMessage(message)` | Identify a text message through `message.type === 'text'`. |
| `onImageMessage(msg)` | `onMessage(message)` | Identify an image message through `message.type === 'image'`. |
| `onAudioMessage(msg)` | `onMessage(message)` | Identify a voice message through `message.type === 'voice'`. |
| `onVideoMessage(msg)` | `onMessage(message)` | Identify a video message through `message.type === 'video'`. |
| `onFileMessage(msg)` | `onMessage(message)` | Identify a file message through `message.type === 'file'`. |
| `onLocationMessage(msg)` | `onMessage(message)` | Identify a location message through `message.type === 'location'`. |
| `onCmdMessage(msg)` | `onMessage(message)` | Identify a command message through `message.type === 'cmd'`. |
| `onCustomMessage(msg)` | `onMessage(message)` | Identify a custom message through `message.type === 'custom'`. |
| `onCombineMessage(msg)` | `onMessage(message)` | Identify a combined message through `message.type === 'combine'`. |
| `onMessage(msgs[])` | `onMessage(message)` | The legacy SDK might return an array of messages. The new SDK dispatches one message at a time. |

### Message event migration example

```typescript
// Legacy SDK
conn.addEventHandler('message-handler', {
  onTextMessage: (msg) => handleText(msg),
  onImageMessage: (msg) => handleImage(msg),
});

// New SDK
client.chatManager.addEventHandler('message-handler', {
  onMessage: (message) => {
    switch (message.type) {
      case 'text':
        handleText(message);
        break;
      case 'image':
        handleImage(message);
        break;
    }
  },
});
```

### Connection event comparison

| Legacy SDK event | New SDK event | Description |
| :--- | :--- | :--- |
| `onConnected` | `onConnected` | Unchanged. |
| `onDisconnected` | `onDisconnected` | Unchanged. |
| `onReconnecting` | `onConnecting` | Renamed. |
| `onTokenWillExpire` | `onTokenWillExpire` | Unchanged. |
| `onTokenExpired` | `onTokenExpired` | Unchanged. |
| `onOnline` | - | Removed. |
| `onOffline` | - | Removed. |
| `onError` | - | Removed. We recommend handling Promise rejections and typed errors. |

### Message-operation event comparison

| Legacy SDK event | New SDK event | Description |
| :--- | :--- | :--- |
| `onRecallMessage` | `onMessageRecalled` | Renamed. |
| `onModifiedMessage` | `onMessageUpdated` | Renamed. |
| `onReadMessage` | `onMessageRead` | Renamed. |
| `onChannelMessage` | `onConversationRead` | Corresponds to the conversation read event. |
| `onDeliveredMessage` | `onMessageDelivered` | Corresponds to the message delivery event. |
| `onReceivedMessage` | - | Removed. |
| `onMessagePinEvent` | `onPinnedMessageChanged` | Renamed. |
| `onReactionChange` | `onReactionChanged` | Renamed. |
| `onStatisticMessage` | - | Removed. |

### Migrate chat group events

The legacy SDK uses `onGroupEvent` together with the `operation` field to distinguish chat group events. The new SDK separates chat group events into individual event names.

```typescript
// Legacy SDK
conn.addEventHandler('group-handler', {
  onGroupEvent: (event) => {
    switch (event.operation) {
      case 'inviteToJoin':
        break;
      case 'memberPresence':
        break;
      case 'removeMember':
        break;
    }
  },
});

// New SDK
client.groupManager.addEventHandler('group-handler', {
  onInvitationReceived: (event) => {},
  onMembersJoined: (event) => {},
  onUserRemoved: (event) => {},
});
```

| Legacy `operation` | New event name |
| :--- | :--- |
| `inviteToJoin` | `onInvitationReceived` |
| `acceptInvite` | `onInvitationAccepted` |
| `rejectInvite` | `onInvitationDeclined` |
| `requestToJoin` | `onRequestToJoinReceived` |
| `acceptRequest` | `onRequestToJoinAccepted` |
| `joinPublicGroupDeclined` | `onRequestToJoinDeclined` |
| `directJoined` | `onAutoAcceptInvitationFromGroup` |
| `removeMember` | `onUserRemoved` |
| `destroy` | `onGroupDestroyed` |
| `memberPresence` / `membersPresence` | `onMembersJoined` |
| `memberAbsence` / `membersAbsence` | `onMembersExited` |
| `muteMember` | `onMuteListAdded` |
| `unmuteMember` | `onMuteListRemoved` |
| `muteAllMembers` / `unmuteAllMembers` | `onAllMemberMuteStateChanged` |
| `setAdmin` | `onAdminAdded` |
| `removeAdmin` | `onAdminRemoved` |
| `changeOwner` | `onOwnerChanged` |
| `updateAnnouncement` / `deleteAnnouncement` | `onAnnouncementChanged` |
| `uploadFile` | `onSharedFileAdded` |
| `deleteFile` | `onSharedFileDeleted` |
| `updateInfo` | `onGroupInfoChanged` |
| `addUserToAllowlist` | `onAllowListAdded` |
| `removeAllowlistMember` | `onAllowListRemoved` |
| `memberAttributesUpdate` | `onGroupMemberAttributeChanged` |

### Migrate chat room events

The legacy SDK uses `onChatroomEvent` together with the `operation` field to distinguish chat room events. In the new SDK, register chat room event listeners through `client.chatRoomManager.addEventHandler`. Separate event names are used for events such as chat room destruction, members joining or leaving, member removal, chat room information changes, admin changes, mute-state changes, allowlist changes, announcement changes, and custom-attribute changes.

### Friend event comparison

| Legacy SDK event | New SDK event | Description |
| :--- | :--- | :--- |
| `onContactInvited` | `onContactInvited` | Unchanged. |
| `onContactAgreed` | `onContactAgreed` | Unchanged. |
| `onContactRefuse` | `onContactRefuse` | Unchanged. |
| `onContactDeleted` | `onContactDeleted` | Unchanged. |
| `onContactAdded` | `onContactAdded` | Unchanged. |

### Migrate multi-device events

The legacy SDK uses the unified `onMultiDeviceEvent`. The new SDK separates multi-device events by business type.

| Legacy SDK               | New SDK                        | Description                                                         |
| :--- | :--- | :--- |
| `onMultiDeviceEvent` | `onMultiDeviceContact`        | Listens for multi-device friend events, such as another device adding or deleting a friend or accepting or declining a friend request. |
| `onMultiDeviceEvent` | `onMultiDeviceGroup`          | Listens for multi-device chat group events, such as another device creating, joining, or leaving a chat group, modifying group information, or managing group members. |
| `onMultiDeviceEvent` | `onMultiDeviceThread`         | Listens for multi-device message thread events, such as another device creating, joining, leaving, or destroying a message thread or modifying its information. |
| `onMultiDeviceEvent` | `onMultiDeviceConversation`   | Listens for multi-device conversation events, such as another device pinning or unpinning a conversation or adding or removing a conversation tag. |
| `onMultiDeviceEvent` | `onMultiDeviceMessageRemoved` | Listens for multi-device message-deletion events. For example, after another device deletes historical messages from the server, the current device receives the corresponding synchronization notification. |

## Migrate return values and error handling

### Changes

Most REST APIs in the legacy SDK return `Promise<AsyncResult<T>>`, and business data usually needs to be read from `.data`. Most APIs in the new SDK directly return a business object or array.

### Return-value comparison

```typescript
// Legacy SDK
const result = await conn.getGroupInfo({ groupId: 'group1' });
const groupInfo = result.data[0];

// New SDK
const groupInfo = await client.groupManager.getGroupInfo({ groupId: 'group1' });
```

### Common return-value changes

| Legacy SDK return value | New SDK return value | Description |
| :--- | :--- | :--- |
| `AsyncResult<UserId[]>` | `ReadonlyArray<Contact>` | The friend list returns friend objects. |
| `AsyncResult<GroupDetailInfo[]>` | `GroupDetail` | Chat group details are returned directly as a detail object. |
| `AsyncResult<{ groupId }>` | `CreateGroupResult` | Chat group creation directly returns the business result. |
| `AsyncResult<SendMsgResult>` | `Message` | Message sending returns the complete message object. |
| `AsyncResult<ServerConversations>` | `ReadonlyArray<ConversationItem>` or a paginated result | Depending on the API, a conversation-list API returns a local list or a server-side paginated result. |

### Error-handling syntax

The legacy SDK can handle errors through `onError` or Promise rejections. The new SDK removes the global `onError` event. We recommend using `try...catch` to catch Promise rejections and processing them based on the SDK error type.

```typescript
import { SDKError, ValidationError } from 'easemob-websdk';

try {
  await client.chatManager.sendMessage(message);
} catch (error) {
  if (error instanceof ValidationError) {
    // Parameter validation error.
  } else if (error instanceof SDKError) {
    // SDK or server-side business error. Handle it based on error.code.
  } else {
    // Other unknown error.
  }
}
```

## Migrate message creation and sending

### Changes

The legacy SDK uses `WebIM.message.create` together with the `type` field to create different message types. The new SDK separates message creation into multiple typed methods, such as `createTextMessage`, `createImageMessage`, and `createCustomMessage`. Send all messages through `client.chatManager.sendMessage`.

### Legacy SDK usage

```typescript
const msg = WebIM.message.create({
  type: 'txt',
  to: 'user2',
  chatType: 'singleChat',
  msg: 'Hello!',
  ext: { key: 'value' },
});

const result = await conn.send(msg);
```

### New SDK usage

```typescript
const msg = client.chatManager.createTextMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  content: 'Hello!',
  ext: { key: 'value' },
});

const sentMessage = await client.chatManager.sendMessage(msg);
```

### Message-creation method comparison

| Legacy SDK `type` | New SDK method | Main parameter change |
| :--- | :--- | :--- |
| `'txt'` | `createTextMessage` | `msg` changes to `content`. |
| `'img'` | `createImageMessage` | Pass the file or resource information through the image-message parameters. |
| `'audio'` | `createVoiceMessage` | `length` changes to `duration`. |
| `'video'` | `createVideoMessage` | `length` changes to `duration`. |
| `'file'` | `createFileMessage` | `filename` changes to `fileName`. |
| `'loc'` | `createLocationMessage` | `lat` / `lng` change to `latitude` / `longitude`, and `addr` changes to `address`. |
| `'cmd'` | `createCmdMessage` | `action` continues to represent the command action. |
| `'custom'` | `createCustomMessage` | Uses a custom-message event and custom parameters. |
| `'combine'` | `createCombineMessage` | Creates a combined forwarded message. |

### Conversation identifier comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `to` | `conversationId` | A user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room. |
| `chatType` | `conversationType` | Possible values are `singleChat`, `groupChat`, and `chatRoom`. |

### Migrate sending options

Some sending options in the legacy SDK might be included in the message-creation parameters. The new SDK places sending options in the second parameter of `sendMessage`:

```typescript
await client.chatManager.sendMessage(msg, {
  deliverOnlineOnly: true,
  receiverList: ['user3'],
  priority: 'high',
});
```

### Notes

- `receiverList` is used only for targeted group-message sending.
- A chat room message can set `priority`. When message volume is high, low-priority messages might be discarded.
- Migrate attachment upload progress, success, and failure handling to the sending workflow or Promise error-handling logic supported by the new SDK.

## Migrate conversation APIs

### Changes

Conversation-related APIs are migrated to `client.chatManager`. The new SDK manages conversation data through a local conversation-list cache: `getConversationList` reads the conversation list from the local cache, while `refreshSessionList` refreshes the conversation list from the server and updates the local cache.

### API comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `conn.getServerConversations(params)` | `chatManager.refreshSessionList(params)` | Refreshes the conversation list from the server and updates the local cache. |
| - | `chatManager.getConversationList(filter?)` | Reads the conversation list from the local cache and supports filtering by pinning, tags, and other conditions. |
| `conn.deleteConversation({ channel, chatType, deleteRoam })` | `chatManager.deleteConversation({ conversationId, conversationType, deleteRoamingMessages })` | Parameters renamed. |
| `conn.pinConversation({ conversationId, conversationType, isPinned })` | `chatManager.setConversationPinned({ conversationId, conversationType, isPinned })` | Method renamed. |
| `conn.getServerPinnedConversations(params)` | `chatManager.getConversationList({ isPinned: true })` | Filters pinned conversations from the local conversation-list cache. To obtain the latest server-side data, first call `refreshSessionList`. |
| `conn.markConversation({ conversations, mark, isMarked })` | `chatManager.addConversationMark(params)` / `chatManager.removeConversationMark(params)` | Split into separate APIs for adding and removing tags. |
| `conn.getServerConversationsByFilter({ filter: { mark } })` | `chatManager.getConversationList({ mark })` | Filters conversations by tag from the local conversation-list cache. To obtain the latest server-side data, first call `refreshSessionList`. |
| - | `chatManager.clearConversationUnreadMessageCount(params)` | Clears the unread count for a specified conversation. |
| - | `chatManager.clearAllConversationUnreadMessageCount()` | Clears the unread count for all conversations. |
| - | `chatManager.setCurrentConversation(params)` | Sets the current conversation. |
| - | `chatManager.resetCurrentConversation()` | Clears the current conversation. |

### Notes

- To refresh only the UI, preferentially read from the local cache through `getConversationList`.
- To actively retrieve the latest conversation list from the server, call `refreshSessionList`, and then read the local cache or use the returned result.
- When filtering by pinning or tags, use the filtering parameters of `getConversationList` to read from the local conversation-list cache. To obtain the latest server-side state, first call `refreshSessionList` to update the local cache.

## Migrate user attribute APIs

### Changes

User-attribute-related APIs are migrated from `conn.xxx` to `client.userInfoManager.xxx`. The new SDK supports querying user attributes by user ID or attribute and subscribing to user-attribute changes.

### API comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `conn.updateOwnUserInfo(params)` | `userInfoManager.updateOwnInfo(params)` | Method renamed. |
| `conn.updateOwnUserInfo('nickname', value)` | `userInfoManager.updateOwnInfoByAttribute({ attribute, value })` | Updates a single attribute. |
| `conn.fetchUserInfoById({ userId })` | `userInfoManager.getUserInfoByUserId({ userIds })` | The parameter changes to an array of user IDs. |
| - | `userInfoManager.getUserInfoByAttribute({ userIds, attributes })` | Queries specified user attributes. |
| - | `userInfoManager.subscribeUsersInfo({ userIds })` | Subscribes to user-attribute changes. |
| - | `userInfoManager.unsubscribeUsersInfo({ userIds })` | Unsubscribes from user-attribute changes. |
| - | `userInfoManager.getSubscribedUsers()` | Retrieves the list of subscribed users. |

## Migrate user relationship APIs

### Changes

User-relationship-related APIs are migrated from `conn.xxx` to `client.contactManager.xxx`. In the new SDK, some parameters change to object form, and the friend-list return value changes from an array of user IDs to an array of friend objects.

### API comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `conn.getContacts()` | `contactManager.getContacts()` | Returns `Contact[]`, including friend remarks and other information. |
| `conn.getAllContacts()` | `contactManager.getContacts()` | The new SDK uses the same API to retrieve the friend list. |
| `conn.addContact(to, msg)` | `contactManager.addContact({ userId, reason })` | Parameters change to an object. |
| `conn.deleteContact(to)` | `contactManager.deleteContact({ userId })` | Parameters change to an object. |
| `conn.acceptInvitation(to)` | `contactManager.acceptContactInvite({ userId })` | Method renamed. |
| `conn.declineInvitation(to)` | `contactManager.declineContactInvite({ userId })` | Method renamed. |
| `conn.setContactRemark({ userId, remark })` | `contactManager.setContactRemark({ userId, remark })` | Capability retained. |
| `conn.getBlocklist()` | `contactManager.getBlocklist()` | Returns `UserInfo[]`. |
| `conn.addUsersToBlocklist({ name })` | `contactManager.addUsersToBlocklist({ userIds })` | `name` changes to `userIds`, with batch operations supported. |
| `conn.removeUserFromBlocklist({ name })` | `contactManager.removeUserFromBlocklist({ userIds })` | `name` changes to `userIds`, with batch operations supported. |

## Migrate chat group APIs

### Changes

Chat-group-related APIs are migrated from `conn.xxx` to `client.groupManager.xxx`. In the new SDK, member ID parameters consistently use `userId` or `userIds`, and the page size typically uses `pageSize`.

### API comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `conn.createGroupVNext(params)` | `groupManager.createGroup(params)` | Method renamed. |
| `conn.getGroupInfo({ groupId })` | `groupManager.getGroupInfo({ groupId })` | Capability retained. |
| `conn.getJoinedGroups(params)` | `groupManager.getJoinedGroupList()` | Retrieves the list of joined chat groups. |
| `conn.listGroups(params)` | `groupManager.getPublicGroupList(params)` | Retrieves the list of public groups. |
| `conn.modifyGroup(params)` | `groupManager.updateGroupInfo(params)` | Method renamed. |
| `conn.destroyGroup({ groupId })` | `groupManager.destroyGroup({ groupId })` | Capability retained. |
| `conn.leaveGroup({ groupId })` | `groupManager.leaveGroup({ groupId })` | Capability retained. |
| `conn.changeGroupOwner(params)` | `groupManager.changeGroupOwner(params)` | Capability retained. |
| `conn.inviteUsersToGroup(params)` | `groupManager.inviteUsersToGroup({ groupId, userIds })` | `users` changes to `userIds`. |
| `conn.joinGroup({ groupId, message })` | `groupManager.joinGroup({ groupId, reason })` | `message` changes to `reason`. |
| `conn.getGroupMembers({ groupId, cursor, limit })` | `groupManager.getGroupMemberList({ groupId, cursor, pageSize })` | `limit` changes to `pageSize`. |
| `conn.removeGroupMembers(params)` | `groupManager.removeGroupMembers({ groupId, userIds })` | The member ID parameter is standardized as `userIds`. |
| `conn.setGroupAdmin({ groupId, username })` | `groupManager.addGroupAdmin({ groupId, userId })` | `username` changes to `userId`. |
| `conn.removeGroupAdmin({ groupId, username })` | `groupManager.removeGroupAdmin({ groupId, userId })` | `username` changes to `userId`. |
| `conn.getGroupMuteList(params)` | `groupManager.getGroupMuteList(params)` | Capability retained. |
| `conn.muteGroupMember({ username, muteDuration, groupId })` | `groupManager.muteGroupMembers({ groupId, userIds, duration })` | Parameters renamed, with batch operations supported. |
| `conn.unmuteGroupMember({ groupId, username })` | `groupManager.unmuteGroupMembers({ groupId, userIds })` | Batch operations supported. |
| `conn.disableSendGroupMsg({ groupId })` | `groupManager.muteAllGroupMembers({ groupId })` | Method renamed. |
| `conn.enableSendGroupMsg({ groupId })` | `groupManager.unmuteAllGroupMembers({ groupId })` | Method renamed. |
| `conn.blockGroupMembers({ groupId, usernames })` | `groupManager.blockGroupMembers({ groupId, userIds })` | `usernames` changes to `userIds`. |
| `conn.getGroupBlocklist({ groupId })` | `groupManager.getGroupBlocklist({ groupId })` | Capability retained. |
| `conn.unblockGroupMembers(params)` | `groupManager.unblockGroupMembers({ groupId, userIds })` | The member ID parameter is standardized as `userIds`. |
| `conn.fetchGroupAnnouncement({ groupId })` | `groupManager.getGroupAnnouncement({ groupId })` | Method renamed. |
| `conn.updateGroupAnnouncement(params)` | `groupManager.updateGroupAnnouncement(params)` | Capability retained. |
| `conn.uploadGroupSharedFile(params)` | `groupManager.uploadGroupSharedFile(params)` | Capability retained. |
| `conn.deleteGroupSharedFile(params)` | `groupManager.deleteGroupSharedFile(params)` | Capability retained. |
| `conn.downloadGroupSharedFile(params)` | `groupManager.downloadGroupSharedFile(params)` | Capability retained. |

## Migrate chat room APIs

### Changes

Chat-room-related APIs are migrated from `conn.xxx` to `client.chatRoomManager.xxx`. On the client, the new SDK supports chat room lists, details, joining, leaving, member management, admin management, muting, blocklists, allowlists, announcements, custom attributes, and other features. Chat rooms should generally be created through a server-side REST API.

### API comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `conn.getChatRooms(params)` | `chatRoomManager.getChatRoomList(params)` | Method renamed. |
| `conn.getChatRoomDetails({ chatRoomId })` | `chatRoomManager.getChatRoomInfo({ chatRoomId })` | Method renamed. |
| `conn.joinChatRoom({ roomId })` | `chatRoomManager.joinChatRoom({ chatRoomId })` | `roomId` changes to `chatRoomId`. |
| `conn.leaveChatRoom({ roomId })` | `chatRoomManager.leaveChatRoom({ chatRoomId })` | `roomId` changes to `chatRoomId`. |
| `conn.modifyChatRoom(params)` | `chatRoomManager.updateChatRoomInfo(params)` | Method renamed. |
| `conn.getChatRoomMembers({ chatRoomId, cursor, limit })` | `chatRoomManager.getMemberList({ chatRoomId, cursor, pageSize })` | `limit` changes to `pageSize`. |
| `conn.removeChatRoomMember(params)` | `chatRoomManager.removeMembers({ chatRoomId, userIds })` | Supports removing members in bulk. |
| `conn.setChatRoomAdmin({ chatRoomId, username })` | `chatRoomManager.addAdmin({ chatRoomId, userId })` | `username` changes to `userId`. |
| `conn.removeChatRoomAdmin({ chatRoomId, username })` | `chatRoomManager.removeAdmin({ chatRoomId, userId })` | `username` changes to `userId`. |
| `conn.getChatRoomMuteList(params)` | `chatRoomManager.getMuteList(params)` | Method renamed. |
| `conn.muteChatRoomMember(params)` | `chatRoomManager.muteMembers({ chatRoomId, userIds, duration })` | Supports muting members in bulk. |
| `conn.unmuteChatRoomMember(params)` | `chatRoomManager.unmuteMembers({ chatRoomId, userIds })` | Supports unmuting members in bulk. |
| `conn.getChatRoomBlocklist(params)` | `chatRoomManager.getBlocklist(params)` | Method renamed. |
| `conn.blockChatRoomMembers(params)` | `chatRoomManager.blockMembers({ chatRoomId, userIds })` | Supports adding members to the blocklist in bulk. |
| `conn.unblockChatRoomMembers(params)` | `chatRoomManager.unblockMembers({ chatRoomId, userIds })` | Supports removing members from the blocklist in bulk. |
| `conn.fetchChatRoomAnnouncement(params)` | `chatRoomManager.getAnnouncement(params)` | Method renamed. |
| `conn.updateChatRoomAnnouncement(params)` | `chatRoomManager.updateAnnouncement(params)` | Method renamed. |
| `conn.getChatRoomAttributes(params)` | `chatRoomManager.getAttributes(params)` | Method renamed. |
| `conn.setChatRoomAttributes(params)` | `chatRoomManager.setAttributes(params)` | Method renamed. |
| `conn.removeChatRoomAttributes(params)` | `chatRoomManager.removeAttributes(params)` | Method renamed. |

### Notes

- The new SDK also allows you to obtain a chat room entity through `chatRoomManager.getChatRoom(chatRoomId)` and then call related operations through the entity.
- Chat room messages are still sent through `client.chatManager.sendMessage`, and the message's `conversationType` must be set to `chatRoom`.
- `conn.createChatRoom()` is no longer available as a client-side capability. We recommend creating a chat room through a server-side REST API.

## Migrate presence APIs

### Changes

Presence-related APIs are migrated from `conn.xxx` to `client.presenceManager.xxx`.

### API comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `conn.publishPresence(params)` | `presenceManager.publishPresence(params)` | Publishes the current user's presence. |
| `conn.subscribePresence(params)` | `presenceManager.subscribePresence(params)` | Subscribes to user presence. |
| `conn.unsubscribePresence(params)` | `presenceManager.unsubscribePresence(params)` | Unsubscribes from user presence. |
| `conn.getSubscribedPresencelist(params)` | `presenceManager.getSubscribedPresenceList(params)` | Retrieves the subscribed presence list. |
| `conn.getPresenceStatus(params)` | `presenceManager.getPresenceStatus(params)` | Queries user presence. |

## Migrate Reaction APIs

### Changes

Reaction-related APIs are migrated to `client.chatManager`.

### API comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `conn.addReaction(params)` | `chatManager.addReaction(params)` | Adds a Reaction. |
| `conn.deleteReaction(params)` | `chatManager.removeReaction(params)` | Deletes a Reaction. |
| `conn.getReactionList(params)` | `chatManager.getReactionList(params)` | Retrieves the message Reaction list. |
| `conn.getReactionDetail(params)` | `chatManager.getReactionDetail(params)` | Retrieves Reaction details. |

## Migrate offline push APIs

### Changes

Push-related APIs are migrated from `conn.xxx` to `client.pushManager.xxx`. In the new SDK, `PushManager` manages push notification modes, Do Not Disturb, conversation-level push rules, and the push language.

### API comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `conn.uploadPushToken(params)` | `pushManager.uploadPushToken(params)` | Uploads a push token. |
| `conn.setSilentModeForAll(params)` | `pushManager.setGlobalSilentMode(params)` | Sets global push-receiving or Do Not Disturb rules. |
| `conn.getSilentModeForAll()` | `pushManager.getGlobalSilentMode()` | Retrieves the global push configuration. |
| `conn.setSilentModeForConversation(params)` | `pushManager.setConversationSilentMode(params)` | Sets conversation-level push-receiving or Do Not Disturb rules. |
| `conn.getSilentModeForConversation(params)` | `pushManager.getConversationSilentMode(params)` | Retrieves the push configuration for a single conversation. |
| `conn.getSilentModeForConversations(params)` | `pushManager.getConversationSilentModes(params)` | Retrieves push configurations for multiple conversations in bulk. |
| `conn.clearRemindTypeForConversation(params)` | `pushManager.clearConversationRemindType(params)` | Clears the conversation-level push notification mode. |
| `conn.setPushPerformLanguage(params)` | `pushManager.setPushLanguage(params)` | Sets the display language for offline push notifications. |
| `conn.getPushPerformLanguage()` | `pushManager.getPushLanguage()` | Retrieves the display language for offline push notifications. |
| - | `pushManager.getConversationListByRemindType(params)` | Filters the conversation list from the local conversation cache by push notification mode. |

## Migrate message thread APIs

### Changes

Message-thread-related APIs are migrated from `conn.xxx` to `client.chatThreadManager.xxx`.

### API comparison

| Legacy SDK | New SDK | Description |
| :--- | :--- | :--- |
| `conn.createChatThread(params)` | `chatThreadManager.createChatThread(params)` | Creates a message thread. |
| `conn.joinChatThread(params)` | `chatThreadManager.joinChatThread(params)` | Joins a message thread. |
| `conn.leaveChatThread(params)` | `chatThreadManager.leaveChatThread(params)` | Leaves a message thread. |
| `conn.destroyChatThread(params)` | `chatThreadManager.destroyChatThread(params)` | Destroys a message thread. |
| `conn.changeChatThreadName(params)` | `chatThreadManager.updateChatThreadName(params)` | Changes the message thread name. |
| `conn.getChatThreadDetail(params)` | `chatThreadManager.getChatThreadInfo(params)` | Retrieves message thread details. |
| `conn.getChatThreadLastMessage(params)` | `chatThreadManager.getChatThreadLastMessageList(params)` | Retrieves the list of last messages in message threads. |
| - | `chatThreadManager.getChatThreadList(params)` | Retrieves the list of message threads in a chat group. |
| - | `chatThreadManager.getJoinedChatThreadList(params)` | Retrieves the list of message threads joined by the current user. |
| - | `chatThreadManager.getChatThreadMemberList(params)` | Retrieves the message thread member list. |
| - | `chatThreadManager.removeChatThreadMember(params)` | Removes a member from a message thread. |

## Removed APIs

The following legacy SDK APIs have been removed or deprecated or no longer have an equivalent client-side capability in the new SDK. Adjust your implementation using the suggested replacement during migration.

| Legacy API | Status | Replacement or migration recommendation |
| :--- | :--- | :--- |
| `conn.registerUser()` | Removed | Register users through a server-side REST API. |
| `conn.listen()` | Deprecated | Register event listeners through `addEventHandler`. |
| `conn.isOpened()` | Removed | Retrieve the connection state through `client.getConnectionState()`. |
| `conn.setLoginInfoCustomExt()` | Removed | Use the login extension information capability in the initialization configuration. |
| `conn.onShow()` | Removed | The SDK's runtime adaptation handles the mini program lifecycle. |
| `conn.usePlugin()` | Removed | Register Managers through `ChatClient.init({ managers })` or `.use()`. |
| `conn.fetchHistoryMessages()` | Legacy API removed | Use `chatManager.getHistoryMessages()`. |
| `conn.createChatRoom()` | No longer available on the client | We recommend creating a chat room through a server-side REST API. |
| `conn.getGroupMsgReadUser()` | Replaced | Use `chatManager.getGroupMessageReadUsers()`. |
| `WebIM.message.create({ type: 'read' })` | Replaced | Use `chatManager.sendMessageReadReceipts({ conversationId, conversationType, messageIds })` to send message read receipts. |
| `WebIM.message.create({ type: 'delivery' })` | No longer created as a message type | Use the new delivery-receipt capability and the `enableDeliveryReceipt` setting. |
| `WebIM.message.create({ type: 'channel' })` | Replaced | Use `chatManager.clearConversationUnreadMessageCount({ conversationId, conversationType })` to clear the conversation unread count. |
| Legacy SDK deprecated aliases, such as `getBlacklist` and `getRoster` | Removed | Use the corresponding standard methods in the new SDK. |

## Migration checklist

After migration, check the following items:

| Check item | Description |
| :--- | :--- |
| Initialization entry point | Changed from `new SDK.connection` to `ChatClient.init`. |
| Manager registration | Registered the Managers required by your app, such as `ChatManager`, `GroupManager`, and `PushManager`. |
| Login parameters | Changed `{ user, accessToken }` to `{ userId, token }`. |
| Logout logic | Changed `conn.close()` to `await client.logout()`. |
| Token renewal | In `onTokenWillExpire`, calls `client.renewToken(newToken)`. |
| Message creation | Replaced `WebIM.message.create` with `createXxxMessage`. |
| Conversation identifiers | Changed `to` / `chatType` to `conversationId` / `conversationType`. |
| Message sending | Changed `conn.send` to `client.chatManager.sendMessage`. |
| Sending options | Moved `deliverOnlineOnly`, `receiverList`, `priority`, and other options to the second parameter of `sendMessage`. |
| Event listeners | Updated the listener methods for message, chat group, chat room, and multi-device events. |
| Return-value access | Removed `.data` access where it is no longer required. |
| Error handling | Changed from the global `onError` to Promise rejections and error-type handling. |
| Conversation list | Distinguishes between reading the local cache through `getConversationList` and refreshing from the server through `refreshSessionList`. |
| Removed APIs | Replaced all legacy APIs that do not have an equivalent client-side capability. |

## FAQ

#### Why does calling `client.chatManager` result in an error, or why does it not exist?

This usually occurs because `ChatManager` was not registered during initialization. When calling `ChatClient.init`, use `managers` to pass `ChatManager`, or call `.use(ChatManager)` after initialization.

#### Why can I no longer read `.data` from an API return value in the new SDK?

Most APIs in the new SDK directly return business data instead of wrapping it in `AsyncResult<T>`. During migration, change `result.data` to use the API return value directly.

#### Does `getConversationList` actively request data from the server?

No. `getConversationList` reads data from the SDK's local conversation-list cache. To actively refresh the conversation list from the server, call `refreshSessionList`.

#### Why am I not receiving chat group and chat room events?

Ensure that the corresponding Manager is registered and that the listener is registered through the correct event entry point. For example, listen for chat group events through `client.groupManager.addEventHandler` and chat room events through `client.chatRoomManager.addEventHandler`.

#### Which client API should I use to create a chat room?

The new Web SDK does not provide `createChatRoom` as a recommended client-side capability. We recommend creating a chat room through a [server-side REST API](/rest/chatroom_create.html). The client is primarily responsible for retrieving, joining, leaving, and managing existing chat rooms.
