# Automatic User Information Management

## Feature overview

The EasyIM Web SDK provides automatic user information management. After this feature is enabled, the SDK automatically maintains user information synchronization, cache updates, and related event notifications, reducing the need to manually retrieve, store, and update user information.

This feature applies to conversation lists, message lists, group chat pages, and other scenarios that display user nicknames, avatars, or group member name cards.

**In this document, user information refers to user-related information displayed by your app, including [user attributes](userprofile.html) and [group member name cards](group_namecard.html).**

## Understand the tech

In the SDK, the initialization parameter `enableUserInfoSync: true` controls automatic user information management. After this feature is enabled, the SDK automatically synchronizes the currently logged-in user's attributes after login. When sending a message, the SDK automatically includes the last update time of the sender's user attributes. For a group message, it also includes the last update time of the sender's group member name card in the current group.

After receiving a message, the SDK automatically compares the update times carried in the message with the corresponding timestamps in the local cache. When it detects updated data or finds that the corresponding data is not cached locally, it automatically retrieves the latest user attributes or group member name card from the server, updates the local cache, and notifies your app through the relevant events so that it can refresh the UI.

When obtaining sender information from a message, the SDK automatically synchronizes user information, updates the cache, and refreshes the relevant display data. The process is as follows:

1. When sending a message, the SDK includes `userInfoUpdateTime`, the last update time of the current sender's user attributes, in the message. For a group message, it also includes `namecardUpdateTime`, the last update time of the sender's name card in the current group.
2. After the recipient receives the message, the SDK first uses the local cache to populate sender information in the message, such as `userId`, `nickname`, and `avatarUrl`.
3. The SDK parses the user-attribute update time carried in the message. For a group message, it also parses the group member name-card update time.
4. The SDK compares the update times in the message with the corresponding timestamps in the local cache.
5. If the update time in the message is later than that in the local cache, the SDK automatically retrieves the latest user attributes from the server. For a group message, if the group member name-card update time changed, the SDK also automatically retrieves the latest group member name card.
6. If the corresponding data is not cached locally, the SDK may retrieve the sender's user attributes once to populate them even if the message does not carry the corresponding update time. In a group chat, if the sender's name card in the current group is not cached locally, the SDK may also retrieve it once.
7. After user information is retrieved successfully, the SDK automatically updates its internal cache and refreshes the relevant display fields in conversations.
8. After the cache update finishes, the SDK notifies the app through the relevant events so that it can refresh the UI.
   User-attribute updates are generally reported through `onUserInfoUpdated` or `onOwnInfoUpdated`. Group member name-card updates are reported through `onUserGroupNamecardUpdated`.

The cache update process is as follows:

![img](/images/web/memory_update_userinfo_mgmt.png)

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK. For details, see [Quickstart](quickstart.html).
- You registered `ChatClient`, `UserInfoManager`, `GroupManager`, `ChatManager`, and `ContactManager` during SDK initialization.
- You understand the relevant EasyIM limitations. For details, see [Limitations](/product/limitation.html).

## Enable automatic user information management

When initializing the SDK, set `enableUserInfoSync` to `true`:

```typescript
const client = ChatClient.init({
  appKey: 'your-org#your-app',
  enableUserInfoSync: true,
  managers: [UserInfoManager, GroupManager],
});
```

:::tip
You must pass `enableUserInfoSync: true` when calling `ChatClient.init` to initialize the SDK and register `UserInfoManager` and `GroupManager`. Otherwise, this feature cannot be enabled correctly.
:::

## Monitor user attribute updates

The SDK provides events for monitoring changes to the current user's, other users', and friends' user attributes. The main events are:

- `onOwnInfoUpdated`: Triggered after the currently logged-in user's attributes are synchronized or updated and written to the cache.
- `onUserInfoUpdated`: Triggered after another user's attributes are updated and written to the cache, including in the following scenarios:
  - A message from another user is received, and the sender's nickname or avatar in the message changed. To implement a user-attribute update event in this scenario, enable `enableUserInfoSync` during initialization.
  - [A subscribed stranger's attributes change](userprofile.html#subscribe-to-attribute-changes-for-strangers).
- `onContactInfoUpdated`: Triggered after a friend's user attributes are updated. This is a friend event and is monitored through `contactManager`.

**We recommend registering the listeners during app initialization so that you can receive events and refresh the UI promptly during initial synchronization after login, message-triggered updates, and subscription updates.** For user-attribute change notifications in other scenarios, see [Monitor user attribute changes](userprofile.html#monitor-user-attribute-changes).

The following example adds listeners:

```typescript
client.userInfoManager.addEventHandler('profile-listener', {
  onOwnInfoUpdated: profile => {
    console.log('Current logged-in user's attributes updated:', profile.nickname, profile.avatarUrl);
  },

  onUserInfoUpdated: users => {
    users.forEach(user => {
      console.log('User attributes updated:', user.userId, user.nickname, user.avatarUrl);
    });
  },
});

client.contactManager.addEventHandler('contact-profile-listener', {
  onContactInfoUpdated: event => {
    console.log('Contact's user attributes updated:', event.userInfo.userId, event.userInfo.nickname);
  },
});
```

## Retrieve sender information from a message

If a sender includes the update time of their user attributes when sending a message, then regardless of whether the sender and recipient are friends, the SDK retrieves the user attributes again after the recipient receives the message if the sender's user-attribute update time in the message is later than that in the local cache. For a group message, if the group member name-card update time in the message is later than that in the local cache, the SDK also retrieves the corresponding group member name card. Read the sender information currently available locally through `message.sender`.

`message.sender` provides the sender's basic user attributes. The current fields are `userId`, `nickname`, and `avatarUrl`.

Friend remarks are not included in `message.sender`. To use friend remarks, combine the relevant APIs and data from [User Relationship Management](user_relationship.html). A group member name card is also not exposed through `message.sender`. In a group chat, to retrieve or maintain group member name cards, use the relevant APIs and cache described in [Manage Group Member Name Cards](group_namecard.html) and handle the `onUserGroupNamecardUpdated` event.

```typescript
client.chatManager.addEventHandler('message-listener', {
  onMessage: message => {
    const sender = message.sender;
    console.log(
      'Sender information:',
      sender.userId,
      sender.nickname,
      sender.avatarUrl
    );
  },
});
```

:::tip
`message.sender` returns sender information currently available locally and is not guaranteed to be the latest information at that time. If `enableUserInfoSync` was enabled during SDK initialization and the message triggers user information synchronization, the latest data is reported to your app through `onUserInfoUpdated` and other relevant events after the SDK finishes updating the cache.
:::

## Read user attributes from local memory

If your app needs to read friend attributes from memory, call `contactManager.getContacts` to retrieve the current friend-list view:

```typescript
const contacts = client.contactManager.getContacts();

contacts.forEach(contact => {
  console.log(
    'Contact attributes:',
    contact.userId,
    contact.userInfo.nickname,
    contact.userInfo.avatarUrl,
    contact.remark
  );
});
```

:::tip
`contactManager.getContacts` returns only the current in-memory friend list and its user-attribute view. To retrieve the latest user attributes for a stranger, call a server API such as [userInfoManager.getUserInfoByUserId](userprofile.html#retrieve-all-user-attributes-from-the-server).
:::

## Considerations

- You must pass `enableUserInfoSync: true` during `ChatClient.init` initialization.
- We recommend registering `onOwnInfoUpdated`, `onUserInfoUpdated`, and `onContactInfoUpdated` first so that you can refresh the app UI promptly after the cache is updated.
- `message.sender` is a summary of sender information currently available locally and is not guaranteed to contain the final latest values when the message is received.
- When an update time in a message is later than that in the local cache, the SDK automatically retrieves the latest data from the server and updates the cache.
- To read friend attributes from memory, use `contactManager.getContacts`.

## FAQ

#### When should I enable automatic user information management?

You must pass `enableUserInfoSync: true` when calling `ChatClient.init` to initialize the SDK. Changing this parameter after SDK initialization does not enable automatic user information management.

#### What does the SDK do automatically after this feature is enabled?

After `enableUserInfoSync` is enabled, the SDK automatically synchronizes the currently logged-in user's attributes after login. When sending a message, it automatically includes the update time of the sender's user attributes. For a group message, it also includes the update time of the sender's group member name card in the current group. After receiving a message, the SDK automatically compares the update times in the message with the corresponding timestamps in the local cache. When it detects updated data or finds missing local cache data, it automatically retrieves the latest user attributes or group member name card from the server, updates the cache, and notifies your app through the relevant events.

#### Is `message.sender` always up to date?

No. `message.sender` returns a summary of the sender's user attributes currently available locally, primarily `userId`, `nickname`, and `avatarUrl`. If the message triggers user-attribute synchronization, the SDK asynchronously retrieves the latest data, updates the cache, and then notifies your app through the relevant events so that it can refresh the UI.

#### Why should I register listeners early?

After you [enable automatic user information management](#enable-automatic-user-information-management), the SDK may notify your app during initial synchronization after login, message-triggered user information synchronization, or subscription updates. We recommend registering listeners during app initialization so that you receive events and refresh the UI promptly.

#### What is the difference between reading locally and retrieving from the server?

`contactManager.getContacts` queries only the user-attribute view of friends currently in memory and does not make a network request. It is suitable for local display. To retrieve the latest user attributes, call the corresponding [API](userprofile.html#retrieve-all-user-attributes-from-the-server).

#### Do I need to maintain a cache after this feature is enabled?

Generally, no. After `enableUserInfoSync` is enabled, the SDK compares user-attribute update times, updates the cache, and sends related event notifications. Your app generally only needs to refresh the UI in the relevant events. If you maintain additional local UI data, update it in the event callback as well.

## Related features

#### Manage group member name cards

After automatic user information management is enabled, the SDK also supports automatically synchronizing and updating group member name cards. You can implement setting, querying, and change monitoring for group member name cards. For details, see [Manage Group Member Name Cards](group_namecard.html).

#### User attributes and user information

- User information: User-related information displayed by your app, including [user attributes](userprofile.html) and [group member name cards](group_namecard.html).
- User attributes: Profile fields that a user can set and manage, such as the user nickname, avatar, email address, and phone number. Use the relevant APIs to set, update, and query these fields. For details, see [Manage User Attributes](userprofile.html). For example, call `client.userInfoManager.updateOwnInfo` to set the currently logged-in user's nickname, avatar, and other profile information. If `enableUserInfoSync` is enabled, the updated information automatically participates in version synchronization in subsequently sent messages.

#### Sender information synchronized through messages

After automatic user information management is enabled, received messages contain a summary of sender-related information. Read the sender user ID, nickname, and avatar URL currently available locally from `sender` in the message object.

## API list

| API name                                         | Module/Class       | Description                                                         |
| ------------------------------------------------ | ----------------- | ------------------------------------------------------------ |
| [`init`](#enable-automatic-user-information-management)                  | `ChatClient`      | Initializes the SDK and enables automatic user information management through `enableUserInfoSync`. |
| [`getContacts`](#read-user-attributes-from-local-memory)         | `ContactManager`  | Reads the current in-memory friend list and user-attribute view.                   |
| [`getUserInfoByUserId`](#read-user-attributes-from-local-memory) | `UserInfoManager` | Retrieves the latest user attributes for specified users from the server.                         |
| [`updateOwnInfo`](#user-attributes-and-user-information)           | `UserInfoManager` | Updates the currently logged-in user's attributes.                                 |
