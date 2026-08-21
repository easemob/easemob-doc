# Initialization

Initialization is required before using the SDK and must be completed before you call any API method.

## Prerequisite

You have a valid EasyIM developer account and App Key. For details, see the [EasyIM Console documentation](/product/console/app_create.html).

## Initialize the SDK

Pass the configuration to `ChatClient.init` to create the singleton SDK instance.

```typescript
import { ChatClient } from 'easemob-websdk';

const client = ChatClient.init({
  appKey: 'your-org#your-app',
});
```

:::tip
- In the examples in this document, `client` is the SDK instance created through `ChatClient.init`.
- To use chat, friend, chat group, and other features, register the corresponding managers through the `managers` parameter during initialization or through the `use` method afterward.
:::

The following table describes some of the parameters for SDK initialization.

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `appKey` | String | Yes | Unique app identifier in the format `org#app`. |
| `enableDeliveryReceipt` | Boolean | No | Whether to enable delivery receipts. When enabled, after receiving a one-to-one message, the SDK automatically sends a delivery receipt to the sender. The default value is `false`. |
| `useFixedDeviceId` | Boolean | No | Whether to reuse a fixed device identifier in the same browser. The default value is `true`. If set to `false`, each SDK instance uses a random device ID. |
| `deviceId` | String | No | Custom device identifier. If omitted, the SDK default is used. |
| `enableSyncData` | `ReadonlyArray<'conversation' \| 'contact' \| 'group'>` | No | Types of data to automatically synchronize after login. If omitted, the default value is `['conversation']`. |
| `managers` | Array | No | List of managers to automatically register during initialization. |

## Set listeners after initialization

After initialization, set the required listeners, such as connection and message listeners, to promptly learn when the persistent connection is established and when messages are sent or received.

```typescript
client.addEventHandler('connection', {
  onConnecting: () => console.log('正在连接...'),
  onConnected: () => console.log('连接成功'),
  onDisconnected: (event) => console.log('连接断开', event.reason, event),
  onTokenWillExpire: () => console.log('Token 即将过期'),
  onTokenExpired: () => console.log('Token 已过期'),
});

client.addEventHandler('message', {
  onMessage: (message) => console.log('收到消息', message),
});
```

To monitor the start and completion of automatic data synchronization after login, see [Monitor the synchronization state](#monitor-the-synchronization-state).

## Configure automatic data synchronization after login

### Synchronized data

During initialization, use `enableSyncData` to configure the types of data to automatically synchronize after login. After a user logs in successfully, the SDK synchronizes the configured data and updates the local cache or snapshot.

The SDK currently supports automatically synchronizing the conversation list, friend list and friend information, and the list of chat groups that the current user has joined. The following table lists each data type's configuration value, local retrieval method, and Manager registration requirements:

| Configuration value | Data automatically synchronized after login | Local retrieval method | Required Manager | Description |
| :--- | :--- | :--- | :--- | :--- |
| `conversation` | Conversation list | `client.chatManager.getConversationList` | `ChatManager` | Enabled by default. After synchronization, you can read the current local conversation-list snapshot. |
| `contact` | Friend list and friend information | `client.contactManager.getContacts` | `ContactManager`, `UserInfoManager` | Does not include the blocklist. Call `client.contactManager.getBlocklist` to retrieve the blocklist.<br/> We recommend registering `UserInfoManager` to support reading friend attributes. |
| `group` | List of chat groups that the current user has joined | `client.groupManager.getJoinedGroupList` | `GroupManager` | After synchronization, you can read the current local list of joined chat groups. |

### Configuration

Set `enableSyncData` when calling `ChatClient.init` to initialize the SDK. Changing this parameter after SDK initialization does not affect the automatic synchronization behavior of the current SDK instance.

The configuration rules for `enableSyncData` are as follows:

- If `enableSyncData` is omitted, the SDK uses `['conversation']` by default and automatically synchronizes the conversation list after login.
- To add friend or chat group synchronization while retaining the default conversation-list synchronization, explicitly include `conversation`, for example, `['conversation', 'contact']` or `['conversation', 'contact', 'group']`.
- Set it to `[]` to disable automatic synchronization after login.

The following example automatically synchronizes the conversation list, friend list and friend information, and the list of chat groups that the current user has joined after a successful login:

```typescript
import {
  ChatClient,
  ChatManager,
  ContactManager,
  GroupManager,
  UserInfoManager,
} from 'easemob-websdk';

const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager, ContactManager, GroupManager, UserInfoManager],
  enableSyncData: ['conversation', 'contact', 'group'],
});
```

To retain only the default conversation-list synchronization, omit `enableSyncData`:

```typescript
const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager],
});
```

To disable automatic synchronization after login, set it to an empty array:

```typescript
const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager],
  enableSyncData: [],
});
```

### Monitor the synchronization state

The SDK uses `onSyncDataStart` and `onSyncDataFinished` to notify you when synchronization starts and finishes.

- `onSyncDataStart`: Triggered when synchronization of a data type starts. `payload.dataType` specifies the data type and can be `conversation`, `contact`, or `group`.
- `onSyncDataFinished`: Triggered when synchronization of a data type finishes. `payload.status` specifies the synchronization result and can be `success` or `failed`. If synchronization fails, view error details through `payload.error`.

Example code:

```typescript
client.addEventHandler('sync-listener', {
  onSyncDataStart: payload => {
    console.log('同步开始:', payload.dataType);
  },
  onSyncDataFinished: payload => {
    if (payload.status === 'success') {
      console.log('同步成功:', payload.dataType);
      return;
    }

    console.log('同步失败:', payload.dataType, payload.error);
  },
});
```

### Read synchronized data after login

After automatic synchronization finishes, read the data from the SDK's local cache or snapshot through the corresponding Manager.

```typescript
await client.login({
  userId: 'your-user-id',
  token: 'your-token',
});

const conversations = client.chatManager.getConversationList();
const contacts = client.contactManager.getContacts();
const joinedGroups = client.groupManager.getJoinedGroupList();

console.log(conversations);
console.log(contacts);
console.log(joinedGroups);
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`init`](#initialize-the-sdk) | `ChatClient` | Initializes the singleton SDK instance. |
| [`getConversationList`](#read-synchronized-data-after-login) | `ChatManager` | Reads the current conversation list from the local cache. |
| [`getContacts`](#read-synchronized-data-after-login) | `ContactManager` | Reads the current friend-list view from the local snapshot. |
| [`getJoinedGroupList`](#read-synchronized-data-after-login) | `GroupManager` | Reads the list of chat groups that the current user has joined from the local snapshot. |


