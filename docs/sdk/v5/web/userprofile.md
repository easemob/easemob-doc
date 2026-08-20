# Manage User Attributes

The EasyIM Web SDK supports managing user attributes.

User attributes are information about users who interact through real-time messages, such as the user nickname, avatar, email address, phone number, gender, signature, and birthday. For example, in a recruiting scenario, user attributes can store gender, email address, user type (candidate), and position type (Web development).

This document describes how to set, update, retrieve, monitor, and subscribe to user attributes.

:::tip
To protect user information, the SDK allows a user to set or update only their own user attributes.
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK. For details, see [Quickstart](quickstart.html).
- You registered `UserInfoManager`, `ContactManager`, and `ChatManager` during SDK initialization.
- You understand the EasyIM limitations. For details, see [Limitations](/product/limitation.html).

## Limitations

- All attributes of a user can total up to 2 KB.
- All user-attribute data in an app can total up to 10 GB.
- If calls to APIs for setting or retrieving user attributes exceed the frequency limit, error code `4` with `rate_limit` is returned.

## Set the current user's attributes

### Set all attributes of the current user

Call `updateOwnInfo` to set or update multiple attributes of the current user.

```typescript
const profile = await client.userInfoManager.updateOwnInfo({
  nickname: 'easemob',
  avatarUrl: 'https://www.easemob.com/avatar.png',
  birth: '2000-10-10',
  sign: 'hello world',
  phone: '13333333333',
  mail: '123456@qq.com',
  gender: 1,
  ext: '{"role":"candidate"}',
});

console.log(profile.userId, profile.nickname);
```

The client uses the following keys to store user attributes by default. When [setting](/document/server-side/user_attribute_set.html) or [deleting user attributes](/document/server-side/user_attribute_delete.html) through a RESTful API, use the same keys so that the client can read the attributes correctly.

| Field | Type | Description |
| :--- | :--- | :--- |
| `nickname` | String | User nickname. The maximum length is 64 characters. |
| `avatarurl` | String | User avatar URL. The maximum length is 256 characters. When this field is [set](/document/server-side/user_attribute_set.html) or [deleted](/document/server-side/user_attribute_delete.html) through a RESTful API, its server-side key is `avatarurl`. |
| `phone` | String | User contact information. The maximum length is 32 characters. |
| `mail` | String | User email address. The maximum length is 64 characters. |
| `gender` | Number | User gender:<br/> - `1`: Male.<br/> - `2`: Female.<br/> - (Default) `0`: Unknown.<br/> - Other values are invalid.  |
| `sign` | String | User signature. The maximum length is 256 characters. |
| `birth` | String | User birthday. The maximum length is 64 characters. |
| `ext` | String | Extension field. |

### Set an individual attribute of the current user

Call `updateOwnInfoByAttribute` to set an individual attribute of the current user. For example, change the current user's avatar:

```typescript
const profile = await client.userInfoManager.updateOwnInfoByAttribute(
  'avatarUrl',
  'https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png'
);

console.log(profile.avatarUrl);
```

## Retrieve user attributes

### Retrieve all user attributes from the server

Call `getUserInfoByUserId` to retrieve all attributes of one or more users from the server. Each call can retrieve the user attributes of up to 100 users. After the call succeeds, the SDK writes the returned user attributes to the local cache and directly returns the result to the caller. To immediately refresh the UI after the call, we recommend updating it directly with the API return value.

```typescript
// Pass no more than 100 user IDs per call.
const users = await client.userInfoManager.getUserInfoByUserId({
  userIds: ['user1', 'user2'],
});

console.log(users);
```

### Retrieve specified user attributes from the server

Call `getUserInfoByAttribute` to retrieve one or more attributes of specified users. After the call succeeds, the SDK writes the returned user attributes to the local cache and directly returns the result to the caller. To immediately refresh the UI after the call, we recommend updating it directly with the API return value.

```typescript
const users = await client.userInfoManager.getUserInfoByAttribute({
  userIds: ['user1'],
  attributes: ['nickname', 'avatarUrl'],
});

console.log(users[0]?.nickname, users[0]?.avatarUrl);
```

## Read user attributes from local memory

If your app needs to read friend attributes from memory, call `contactManager.getContacts` to retrieve the current friend list and its user-attribute view.

```typescript
const contacts = client.contactManager.getContacts();

contacts.forEach(contact => {
  console.log(
    '好友属性:',
    contact.userId,
    contact.userInfo.nickname,
    contact.userInfo.avatarUrl,
    contact.remark
  );
});
```

:::tip
1. To retrieve the attributes of non-friend users, call [userInfoManager.getUserInfoByUserId](#retrieve-all-user-attributes-from-the-server).
2. To have the SDK automatically synchronize the friend list and friend information after a successful login, include `contact` in `enableSyncData` and register `ContactManager` and `UserInfoManager` during SDK initialization. After synchronization finishes, call `contactManager.getContacts` to read the locally synchronized friend-attribute view. For automatic data synchronization after login, see [Initialization](initialization.html).
:::

## Subscribe to attribute changes for non-friend users

The SDK supports subscribing to attribute changes for non-friend users. After subscribing, your app promptly receives a notification when a specified non-friend user's attributes change.

This feature applies to the following scenarios:

- In a conversation with a non-friend user, the other user's nickname, avatar, and other attributes must be updated promptly.
- In a temporary conversation, customer-support interaction, or similar scenario, the app needs to detect attribute changes for a non-friend user.
- When displaying group members or in similar scenarios, the app needs to maintain the latest user attributes of specified non-friend users.

:::tip
This feature applies only to non-friend users. For user-attribute change notifications related to the current user, non-friend users, and friends, see [Monitor user attribute changes](#monitor-user-attribute-changes).
:::

### Subscribe to attribute-change events for non-friend users

Call `subscribeUsersInfo` to subscribe to attribute-change events for non-friend users. After subscription succeeds, the SDK triggers `onUserInfoUpdated` when these users' attributes change.

```typescript
await client.userInfoManager.subscribeUsersInfo({
  userIds: ['user1', 'user2'],
});
```

### Unsubscribe from attribute-change events for non-friend users

Call `unsubscribeUsersInfo` to unsubscribe from attribute-change events for non-friend users.

```typescript
await client.userInfoManager.unsubscribeUsersInfo({
  userIds: ['user1', 'user2'],
});
```

### Retrieve the list of users subscribed to for attribute-change events

Call `getSubscribedUsers` to retrieve the list of users subscribed to for attribute-change events. The list contains the user IDs and user attributes of subscribed non-friend users.

```typescript
const users = await client.userInfoManager.getSubscribedUsers();

console.log(users.map(user => user.userId));
```

### Memory considerations

If your app does not subscribe to attribute changes for non-friend users, it generally calls the [retrieval API](#retrieve-all-user-attributes-from-the-server) to retrieve attributes when needed.

The current SDK internally maintains a user-attribute cache. To reduce repeated requests, use either of the following methods according to your business scenario:

- Cache retrieved user-attribute results in your app.
- Enable `enableUserInfoSync` during initialization to automatically refresh the relevant display information through on-demand user-attribute updates after messages are received.

## Monitor user attribute changes

Receive attribute updates for friend and non-friend users through the `onUserInfoUpdated` event registered with `client.userInfoManager.addEventHandler`. This primarily includes the following scenarios:

1. **A message carries an update time**: If `enableUserInfoSync` was enabled during SDK initialization, when a received message carries a sender user-attribute update time later than that in the local cache, the SDK automatically retrieves the latest user attributes, updates the local data, and then triggers `onUserInfoUpdated`. This mechanism may apply to both friend and non-friend senders.
2. **A subscribed user changes (non-friend users only)**: If your app subscribed to attribute-change events for non-friend users, the SDK triggers `onUserInfoUpdated` when one of these users' attributes changes.

**Special notes**

- **Current user**: Attribute changes for the current user are reported separately through `onOwnInfoUpdated` and do not follow the `onUserInfoUpdated` logic.
- **Friend users**: When a friend's attributes change, the SDK triggers `onContactInfoUpdated`, registered through `client.contactManager.addEventHandler`. This is a friend event, not a `userInfoManager` event.
- **Active user-attribute retrieval**: After calling the API to [retrieve user attributes from the server](userprofile.html#retrieve-all-user-attributes-from-the-server), if the return value contains updated user attributes, we recommend using the return value to refresh the UI directly instead of relying on `onUserInfoUpdated`.

```typescript
client.userInfoManager.addEventHandler('profile-listener', {
  // Triggered after the current user's attributes are updated.
  // For example, this event is received after the current user successfully calls updateOwnInfo or updateOwnInfoByAttribute.
  onOwnInfoUpdated: profile => {
    console.log('当前用户属性更新:', profile);
  },
  // Triggered after another user's attributes are updated.
  // For example:
  // 1. A subscribed non-friend user's attributes change.
  // 2. After `enableUserInfoSync` is enabled, the SDK detects updated user attributes while processing a message and retrieves the latest user attributes.
  onUserInfoUpdated: users => {
    console.log('订阅用户或消息同步触发的属性更新:', users);
  },
});

client.contactManager.addEventHandler('contact-profile-listener', {
  // Triggered after a friend's user attributes are updated.
  // This event applies only to friend users and must be monitored through contactManager. It is not a userInfoManager event.
  onContactInfoUpdated: event => {
    console.log('好友的用户属性更新:', event.userInfo);
  },
});
```

## FAQ

#### Why can't I retrieve the user nickname I set?

If you set a user nickname through the client or RESTful API but cannot subsequently retrieve it, generally check the following:

- When setting a user nickname through the RESTful API, the request must use the `nickname` key. Otherwise, the client cannot read the attribute correctly.
- The `nickname` returned by the RESTful APIs [Get User Details](/document/server-side/account_detail_obtain_single.html) and [Delete a User Account](/document/server-side/account_delete_single.html) is the push nickname displayed in offline push notifications, which differs from the nickname in user attributes. However, we recommend keeping them consistent. When changing one nickname, update the other as well.

The Web SDK **does not provide a dedicated API for setting the push nickname**. To set it, see [Configure Display Attributes for Offline Push Notifications](/document/server-side/push_nickname_set_single.html) in the RESTful API documentation.

#### Why is error code 4 returned?

APIs for setting, retrieving, and subscribing to user attributes return error code `4` when the call frequency limit is exceeded.

## Related features

#### User avatar management

The Web SDK supports storing only the avatar URL, `avatarUrl`, in user attributes and does not store the avatar file itself. To manage user avatars, we recommend first uploading the avatar file to your app's file service or another accessible storage service and then writing the generated avatar URL to the user attributes.

The typical process is as follows:

1. Enable a third-party file-storage service.
2. Upload the avatar file to third-party storage and obtain its URL.
3. Call [updateOwnInfo](#set-all-attributes-of-the-current-user) or [updateOwnInfoByAttribute](#set-an-individual-attribute-of-the-current-user) to write the avatar URL to the current user's `avatarUrl` attribute. If using a RESTful API, use the server-side field name `avatarurl`.
4. Call `getUserInfoByUserId` or `getUserInfoByAttribute` to retrieve the avatar URL and render it in the local UI.

#### Contact card messages

In the Web SDK, a contact card message is generally implemented as a custom message and carries attributes of a specified user, such as the user ID, nickname, avatar, email address, and phone number.

We recommend implementing it as follows:

1. Use `createCustomMessage` to create a custom message.
2. Set the message event name `event` to `userCard` to identify the message as a contact card message.
3. First query the target user's attribute fields through the user-attribute API, and then pass these fields in `params` in the custom message body.

To display more contact-card information, add more fields to `params`. To attach message-level extension information, pass it through the message extension `ext`.

The following example creates and sends a contact card message:

```typescript
const users = await client.userInfoManager.getUserInfoByAttribute({
  userIds: ['user_card_target'],
  attributes: ['nickname', 'avatarUrl', 'mail', 'phone', 'gender', 'birth', 'sign'],
});

const profile = users[0];

const message = client.chatManager.createCustomMessage({
  conversationId: 'username',
  conversationType: 'singleChat',
  event: 'userCard',
  params: {
    userId: profile.userId,
    nickname: profile.nickname ?? '',
    avatarUrl: profile.avatarUrl ?? '',
    mail: profile.mail ?? '',
    phone: profile.phone ?? '',
    gender: String(profile.gender ?? ''),
    birth: profile.birth ?? '',
    sign: profile.sign ?? '',
  },
});

await client.chatManager.sendMessage(message);
```

You can also construct the contact card message directly without querying user attributes first:

```typescript
const message = client.chatManager.createCustomMessage({
  conversationId: 'username',
  conversationType: 'singleChat',
  event: 'userCard',
  params: {
    userId: 'user_card_target',
    nickname: '昵称',
    avatarUrl: 'https://example.com/avatar.png',
    mail: '123@qq.com',
    phone: '16888888888',
    gender: 'female',
    birth: '2000-01-01',
    sign: 'a sign',
  },
});

await client.chatManager.sendMessage(message);
```

#### User attributes and user information

User information refers to user-related information displayed by your app, including user attributes and [group member name cards](group_namecard.html).

## API list

| API name                                                     | Module/Class       | Description                                       |
| ------------------------------------------------------------ | ----------------- | ------------------------------------------ |
| [`updateOwnInfo`](#set-all-attributes-of-the-current-user)                   | `UserInfoManager` | Sets or updates multiple attributes of the current user.             |
| [`updateOwnInfoByAttribute`](#set-an-individual-attribute-of-the-current-user)        | `UserInfoManager` | Sets or updates an individual attribute of the current user.             |
| [`getUserInfoByUserId`](#retrieve-all-user-attributes-from-the-server)         | `UserInfoManager` | Retrieves all default attributes of one or more users.         |
| [`getUserInfoByAttribute`](#retrieve-specified-user-attributes-from-the-server)      | `UserInfoManager` | Retrieves specified attributes of specified users.                   |
| [`getContacts`](#read-user-attributes-from-local-memory)                     | `ContactManager`  | Reads the current in-memory friend list and user-attribute view. |
| [`subscribeUsersInfo`](#subscribe-to-attribute-change-events-for-non-friend-users)          | `UserInfoManager` | Subscribes to attribute-change events for non-friend users.               |
| [`unsubscribeUsersInfo`](#unsubscribe-from-attribute-change-events-for-non-friend-users)    | `UserInfoManager` | Unsubscribes from attribute-change events for non-friend users.           |
| [`getSubscribedUsers`](#retrieve-the-list-of-users-subscribed-to-for-attribute-change-events) | `UserInfoManager` | Retrieves the list of users subscribed to for attribute-change events.     |
| [`createCustomMessage`](#contact-card-messages)                           | `ChatManager`     | Creates a custom message that encapsulates contact-card content.     |
| [`sendMessage`](#contact-card-messages)                                   | `ChatManager`     | Sends a contact card message.                             |
