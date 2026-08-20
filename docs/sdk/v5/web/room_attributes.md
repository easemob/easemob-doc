# Manage Chat Room Attributes

## Feature overview

A chat room is an instant messaging system that supports multi-user communication. Chat room attributes include basic attributes, such as the chat room name, description, and announcement, and custom attributes (key-value). If the basic attributes do not meet your business requirements, users can add custom attributes and synchronize them with all members. You can use custom attributes to store the type of a live-streaming chat room, role information and game status in games such as Werewolf, and manage and synchronize mic positions in a voice chat room. Chat room custom attributes are stored as key-value pairs, where both the key and value are strings. Attribute changes are synchronized with chat room members in real time.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK and logged in successfully.
- You registered `ChatRoomManager` during SDK initialization and can call chat room APIs through `client.chatRoomManager`.
- The current user has the chat room role or permissions required for the intended operation. For example, the chat room owner and admins can generally update basic chat room information and the announcement, while chat room members can retrieve or set chat room custom attributes.
- You understand service limitations such as the number of chat rooms, number of chat room members, chat room attribute size, announcement length, and API call frequency. For details, see [Limitations](/product/limitation.html).

## Get a chat room object

Before managing the attributes of a single chat room, we recommend calling `getChatRoom` to obtain a `ChatRoom` object for that chat room. This method only creates or reuses a local object for operating the chat room and does not initiate a network request.

```typescript
const chatRoom = client.chatRoomManager.getChatRoom('chatroomId');
```

The following examples use a `ChatRoom` object for a single chat room where possible. To operate directly by `chatRoomId`, you can also use the corresponding `ChatRoomManager` API.

## Manage basic chat room attributes

### Retrieve chat room details

You can retrieve chat room details through a `ChatRoom` object:

- `getInfo`: Retrieves details of the current chat room.
- `refresh`: Refreshes and returns details of the current chat room. This is equivalent to `getInfo`.

```typescript
const chatRoom = client.chatRoomManager.getChatRoom('chatroomId');

const detail = await chatRoom.getInfo();
console.log(detail);

const latestDetail = await chatRoom.refresh();
console.log(latestDetail);
```

The chat room details are returned as `ChatRoomDetail`, whose main fields are as follows:

| Group | Field | Type | Description |
| :--- | :--- | :--- | :--- |
| Basic information | `chatRoomId` | String | Chat room ID. |
| Basic information | `name` | String | Chat room name. |
| Basic information | `description` | String | Chat room description. |
| Basic information | `owner` | UserInfo | Information about the chat room owner. |
| Basic information | `ext` | String | Chat room extension information. |
| Basic information | `announcement` | String | Chat room announcement. | 
| Basic information | `createdAt` | Number | Chat room creation timestamp. The specific unit is determined by the server response. |
| Configuration | `maxMembers` | Number | Maximum number of chat room members. |
| Configuration | `disabled` | Boolean | Whether the chat room is disabled. |
| Basic statistics | `memberCount` | Number | Current number of members. |
| Current-user information | `permissionType` | String | Permission type of the current user in the chat room. Possible values are `owner`, `admin`, `member`, and `none`. |
| Current-user information | `currentUserStatus` | Object | Snapshot of the current user's status in the chat room, such as whether the user is on the allowlist or muted. |

`currentUserStatus` contains the following main fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `inAllowlist` | Boolean | Whether the current user is on the allowlist. |
| `muted` | Boolean | Whether the current user is muted. |
| `muteExpireAt` | Number | Time when the current user's mute expires. |
| `permissionType` | String | Permission type of the current user in the chat room. |

### Update chat room information

The chat room owner or an admin can use a `ChatRoom` object to update the chat room name, description, or maximum number of members. After the update succeeds, the other online chat room members receive the `onChatRoomInfoChanged` event.

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').updateInfo({
  name: 'new chatroom name',
  description: 'new chatroom description',
  maxMembers: 5000,
});

console.log(result.nameUpdated);
console.log(result.descriptionUpdated);
console.log(result.maxMembersUpdated);
```

The main parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `chatRoomId` | String | Yes | Chat room ID. When using a `ChatRoom` object to call `updateInfo`, you do not need to pass this parameter. |
| `name` | String | No | New chat room name. |
| `description` | String | No | New chat room description. |
| `maxMembers` | Number | No | New maximum number of chat room members. |

:::tip
`updateInfo` updates only the fields that you pass. Fields that are not passed remain unchanged. You must pass at least one of `name`, `description`, and `maxMembers` when calling this method.
:::

### Retrieve the chat room announcement

We recommend calling `getAnnouncement` to retrieve the current chat room announcement:

```typescript
const announcement = await client.chatRoomManager.getChatRoom('chatroomId').getAnnouncement();
console.log(announcement.announcement);
```

### Set the chat room announcement

The chat room owner or an admin can call `updateAnnouncement` to set or update the chat room announcement. After the announcement is updated, chat room members receive the `onAnnouncementChanged` event.

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').updateAnnouncement({
  // The chat room announcement cannot exceed 512 characters.
  announcement: '欢迎来到直播间！',
});
```

The main parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `announcement` | String | Yes | New chat room announcement. |

## Manage chat room custom attributes

Chat room custom attributes use a key-value structure, and both the key and value must be strings. You can use custom attributes to store business data such as mic positions, the room topic, and game status and synchronize the data with chat room members through events.

### Retrieve chat room custom attributes

Call `getAttributes` to retrieve custom attributes of the current chat room. If `keys` is not passed, all attributes are retrieved. If `keys` is passed, only the specified attributes are retrieved.

```typescript
const snapshot = await client.chatRoomManager.getChatRoom('chatroomId').getAttributes({
  keys: ['seat1', 'seat2'],
});

console.log(snapshot.chatRoomId);
console.log(snapshot.attributes);
```

The main parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `keys` | Array | No | List of attribute keys to retrieve. If this parameter is not passed, all attributes are retrieved. |

### Set chat room custom attributes

Call `setAttributes` to set one or more chat room custom attributes. After the attributes are set successfully, chat room members receive the `onAttributesUpdate` event.

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').setAttributes({
  attributes: {
    seat1: JSON.stringify({ userId: 'user1', status: 'occupied' }),
    seat2: JSON.stringify({ userId: '', status: 'empty' }),
  },
  autoDelete: true,
  isForced: false,
});

console.log(result.appliedKeys);
console.log(result.failedKeys);
```

The main parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `attributes` | Object | Yes | Key-value pairs of the attributes to set. Both the key and value must be strings, and the object cannot be empty. |
| `autoDelete` | Boolean | No | Whether to automatically delete attributes set by a member when the member leaves the chat room. The default is `true`. |
| `isForced` | Boolean | No | Whether to allow attributes set by other members to be overwritten. The default is `false`. |

The result is returned as `ChatRoomAttributeMutationResult`, whose main fields are as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `chatRoomId` | String | Chat room ID. |
| `appliedKeys` | Array | List of attribute keys applied successfully. |
| `failedKeys` | Object | Map from attribute keys that failed to be set to their corresponding error information. |

### Delete chat room custom attributes

Call `removeAttributes` to delete one or more chat room custom attributes. After the attributes are deleted successfully, chat room members receive the `onAttributesRemoved` event.

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').removeAttributes({
  keys: ['seat1'],
  isForced: false,
});

console.log(result.appliedKeys);
console.log(result.failedKeys);
```

The main parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `keys` | Array | Yes | List of attribute keys to delete. The array cannot be empty. |
| `isForced` | Boolean | No | Whether to allow attributes set by other members to be deleted. The default is `false`. |

## Monitor chat room attribute events

When basic chat room information, the announcement, or custom attributes change, the SDK triggers the corresponding chat room event. You can call `addEventHandler` to register a chat room event listener.

```typescript
client.chatRoomManager.addEventHandler('chatroom-attribute-events', {
  // The chat room details change. All chat room members receive this event.
  onChatRoomInfoChanged: event => {
    console.log('聊天室信息变更:', event.chatRoomId, event.chatRoomInfo);
  },
  // The chat room announcement changes. All chat room members receive this event.
  onAnnouncementChanged: event => {
    console.log('聊天室公告变更:', event.chatRoomId, event.announcement);
  },
  // Chat room custom attributes are updated. All chat room members receive this event.
  onAttributesUpdate: event => {
    console.log('聊天室属性更新:', event.chatRoomId, event.attributes, event.from);
  },
  // Chat room custom attributes are removed. All chat room members receive this event.
  onAttributesRemoved: event => {
    console.log('聊天室属性删除:', event.chatRoomId, event.keyList, event.from);
  },
});
```

To remove the listener, call `removeEventHandler`:

```typescript
client.chatRoomManager.removeEventHandler('chatroom-attribute-events');
```

## Considerations

- `getChatRoom` only returns an object bound to the specified chat room ID and does not initiate a network request.
- Both `getInfo` and `refresh` retrieve chat room details. `refresh` is equivalent to `getInfo`.
- `updateInfo` updates only the fields that you pass. Passing an empty object is not recommended.
- Both the key and value of a chat room custom attribute must be strings. The `attributes` object and `keys` array cannot be empty.
- `setAttributes` and `removeAttributes` support batch operations. In the result, `appliedKeys` contains successful keys, while `failedKeys` contains failed keys and their error information. If all keys fail, the SDK throws an error.
- `isForced` is an optional parameter that specifies whether to force changes to chat room custom attributes.
- `autoDelete` is an optional parameter that specifies whether to automatically delete custom attributes set by a chat room member after that member leaves.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`getChatRoom`](#get-a-chat-room-object) | `ChatRoomManager` | Obtain a `ChatRoom` object bound to the specified chat room ID. |
| [`getInfo`](#retrieve-chat-room-details) | `ChatRoom` | Retrieve details of the current chat room. |
| [`refresh`](#retrieve-chat-room-details) | `ChatRoom` | Refresh and return details of the current chat room. This is equivalent to `getInfo`. |
| [`updateInfo`](#update-chat-room-information) | `ChatRoom` | Update the chat room name, description, or maximum number of members through a `ChatRoom` object. |
| [`getAnnouncement`](#retrieve-the-chat-room-announcement) | `ChatRoom` | Retrieve the chat room announcement through a `ChatRoom` object. |
| [`updateAnnouncement`](#set-the-chat-room-announcement) | `ChatRoom` | Set or update the chat room announcement through a `ChatRoom` object. |
| [`getAttributes`](#retrieve-chat-room-custom-attributes) | `ChatRoom` | Retrieve chat room custom attributes through a `ChatRoom` object. |
| [`setAttributes`](#set-chat-room-custom-attributes) | `ChatRoom` | Set chat room custom attributes through a `ChatRoom` object. |
| [`removeAttributes`](#delete-chat-room-custom-attributes) | `ChatRoom` | Delete chat room custom attributes through a `ChatRoom` object. |
