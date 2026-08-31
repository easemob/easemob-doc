# Manage Group Member Name Cards

## Feature overview

A group member name card is a user's personalized display information in a specific chat group. It distinguishes the user's identity across groups, such as department, position, or project role.

For example, in an enterprise group, a member can set the name card to “Department-Name” or “Position-Name” so other members can quickly identify and communicate with the user.

The EasyIM SDK supports setting group member name cards, retrieving them from the server, and monitoring changes. When automatic user information management is enabled, the SDK can also automatically synchronize name card updates through messages.

## Understand the tech

The SDK implements group member name cards through group member custom attributes, primarily using `GroupManager` and group events. It manages name cards through explicit setting or retrieval, an internal cache, event notifications, and message-triggered automatic synchronization:

1. The current user can call `client.groupManager.getGroup(groupId).setMemberAttributes` to set or update their name card in a specified group. With the required permissions, the user can also set another member's name card.
2. After a name card change is synchronized to the SDK's internal cache, the SDK notifies the business layer through `onUserGroupNamecardUpdated`.
3. The SDK supports calling `client.groupManager.getGroup(groupId).getMembersAttributes` to batch-retrieve group member attributes from the server. We recommend using `groupNamecard` as the attribute key for name cards.
4. If `enableUserInfoSync: true` is enabled during initialization, group messages automatically include the sender's name-card update time. If the recipient detects a newer update time than the local cache or no cached value, the SDK automatically retrieves the latest name card, updates its internal cache, and triggers an event.

The cache update process is shown below:

![img](/images/web/memory_update_groupcard.png)

## Prerequisite

Before integration, ensure that the following requirements are met:

- Initialize the SDK. See [Quickstart](quickstart.html).
- Register `GroupManager` and `UserInfoManager` during initialization.
- To automatically synchronize name cards through messages, register `UserInfoManager` and enable `enableUserInfoSync: true`.
- Understand service limits such as the number of group member attributes and the key length, value length, and total size. See [Limitations](/product/limitation.html).

## Monitor group member name card updates

The SDK provides `onUserGroupNamecardUpdated` for monitoring updates. Register the listener during application initialization so the UI can be refreshed promptly.

After a change is synchronized to the SDK's internal cache, it triggers `onUserGroupNamecardUpdated` in the following scenarios:

- Other **online members** receive a notification after the current user updates a name card.
- With `enableUserInfoSync: true`, a recipient triggers automatic synchronization by receiving a group message and the internal cache is updated.
- The SDK receives a group member attribute change and recognizes a name-card field in the changed content.

- Add a listener:

```typescript
client.groupManager.addEventHandler('group-namecard-listener', {
  onGroupMemberAttributeChanged: event => {
    console.log('Group member attributes changed, groupId:', event.groupId);
    console.log('Changed member:', event.user?.userId);
    console.log('Updated attributes:', event.attribute);
  },

  onUserGroupNamecardUpdated: event => {
    console.log('Group member card updated, groupId:', event.groupId);
    console.log('User ID:', event.userId);
    console.log('Group member card:', event.namecard);
  },
});
```

Event descriptions:

| Event | Trigger conditions | Description |
| :--- | :--- | :--- |
| `onGroupMemberAttributeChanged` | After group member attributes change | The payload contains `groupId`, the changed member, changed attributes, operator, and change source. |
| `onUserGroupNamecardUpdated` | After the SDK recognizes a name-card change and updates its cache | The payload contains `groupId`, `userId`, and the updated `namecard`. |

## Set a group member name card

Call `getGroup` to obtain a chat group object, and then call `setMemberAttributes` to set your name card in that group. Pass an empty string to delete it. A name card is a group member attribute and must be passed through `memberAttributes`; use `groupNamecard` consistently as its key.

```typescript
await client.groupManager.getGroup('groupId').setMemberAttributes({
  userId: 'currentUserId',
  memberAttributes: {
    groupNamecard: 'new_namecard',
  },
});

console.log('Group member card set successfully');
```

After success, other online group members receive `onGroupMemberAttributeChanged` and `onUserGroupNamecardUpdated`.
If the current user has other online devices, those devices receive `onMultiDeviceGroup` with `operation` set to `GROUP_MEMBER_METADATA_CHANGED`.

:::tip 
The SDK supports `group_namecard`, `group_name_card`, `namecard`, and `nameCard` as name-card fields. To avoid mixing fields, use `groupNamecard` consistently.
:::

## Retrieve group member name cards from the server

Call `getMembersAttributes` to batch-retrieve group member attributes from the server. To query name cards, set `keys` to `['groupNamecard']`.

To retrieve other custom attributes at the same time, pass multiple keys in `keys`. If `keys` is omitted, the server returns the available member attributes.

```typescript
const result = await client.groupManager.getGroup('groupId').getMembersAttributes({
  userIds: ['user1', 'user2'],
  keys: ['groupNamecard'],
});

Object.entries(result.items).forEach(([userId, attributes]) => {
  console.log('userId:', userId);
  console.log('namecard:', attributes.groupNamecard);
});
```

The result is a collection of group member attributes indexed by user ID:

```typescript
{
  items: {
    user1: {
      groupNamecard: 'R&D-Alice',
    },
    user2: {
      groupNamecard: 'Product-Bob',
    },
  },
}
```

## Automatically synchronize group member name cards through messages

To automatically include the name-card update time when sending group messages and update the SDK cache when receiving them, enable automatic user information management by passing `enableUserInfoSync: true` to `ChatClient.init`.

```typescript
const client = ChatClient.init({
  appKey: 'your_appkey',
  enableUserInfoSync: true,
  managers: [GroupManager, UserInfoManager],
});
```

After the feature is enabled, the SDK performs the following operations:

1. After the current user sets their name card, the SDK writes it and its update time to the internal cache.
2. When the current user sends a group message, the SDK automatically includes the name-card update time.
3. After receiving the message, the recipient compares its update time with the local cache.
4. If the message contains a later time or no corresponding name card is cached, the SDK automatically retrieves the sender's latest name card in that group.
5. After retrieval and cache update, the SDK triggers `onUserGroupNamecardUpdated`.

The `message.sender` field currently provides basic sender attributes such as `userId`, `nickname`, and `avatarUrl`; it is not a public entry point for reading a group member name card. To display a name card, use `getMembersAttributes`, `onUserGroupNamecardUpdated`, and locally maintained display data in your app. See [Automatic user information management](userinfo_provider.html#retrieve-sender-information-from-a-message).

## Considerations

- A name card is specific to a chat group and does not affect other groups.
- `onUserGroupNamecardUpdated` is delivered to online group members.
- To synchronize through messages, pass `enableUserInfoSync: true` during initialization and register `GroupManager` and `UserInfoManager`.
- With `enableUserInfoSync: true`, automatic name card updates depend on group messages. To retrieve the latest data explicitly, call the server-side API.

## FAQ

#### Why do other members not receive an update immediately after a name card is set?

After `setMemberAttributes` succeeds, other online members generally receive `onGroupMemberAttributeChanged`. If the SDK recognizes a name-card change and updates its cache, it also triggers `onUserGroupNamecardUpdated`. Offline members may retrieve the latest card later through an explicit query or message-triggered synchronization.

#### Why can't a group member name card be read directly from the SDK's local cache?

The SDK currently provides no public API for reading it locally. Call `client.groupManager.getGroup(groupId).getMembersAttributes` to query specified members from the server, or monitor `onUserGroupNamecardUpdated` for changes.

#### Is group member information retrieved from the server written to the SDK's internal cache?

During message-triggered automatic synchronization, the SDK writes the retrieved name card to its internal cache. An explicit `getMembersAttributes` call returns server-side member attributes; use the result directly for the UI or maintain local display data in the business layer.

#### Why are name cards updated automatically after automatic user information management is enabled?

With `enableUserInfoSync: true`, group messages automatically include the sender's name-card update time. The recipient compares it with the local cache and automatically retrieves and caches the latest name card if the message contains a newer time or no value is cached.

#### After automatically synchronizing a name card through messages, is explicit retrieval still required?

It depends on the use case. Automatic synchronization requires a group message. If the latest name card is needed immediately or no message triggers synchronization, explicitly call `client.groupManager.getGroup(groupId).getMembersAttributes`.

## Related documents

- [Automatic user information management](userinfo_provider.html)
- [Manage User Attributes](userprofile.html)
- [Chat Group Management](group_manage.html)
- [Limitations](/product/limitation.html)

## API list

| API name | Class/Module    | Description    |
| :--- | :--- | :--- |
| [`getGroup`](#set-a-group-member-name-card)  | `GroupManager` | Obtain a `Group` object bound to a specified chat group ID. |
| [`setMemberAttributes`](#set-a-group-member-name-card)  | `Group` | Set a group member name card through a `Group` object. |
| [`getMembersAttributes`](#retrieve-group-member-name-cards-from-the-server)  | `Group`        | Batch-retrieve group member name cards through a `Group` object. |
| [`getGroupMembersAttributes`](#retrieve-group-member-name-cards-from-the-server) | `GroupManager` | Batch-retrieve group member name cards through `GroupManager`. |
| [`ChatClient.init`](#automatically-synchronize-group-member-name-cards-through-messages) | `ChatClient`   | Initialize the SDK and optionally enable `enableUserInfoSync` for automatic information synchronization through messages. |
