# Manage User Relationships

## Feature overview

The SDK provides user relationship management, including friend and blocklist management.

- Friend management: Add friends, handle friend requests, delete friends, set friend remarks, retrieve the friend list, and automatically synchronize the friend list and friend information after a successful login.
- Blocklist management: Retrieve the blocklist and add users to or remove users from it. Before using this feature, enable the service in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#user-blocklist).

## Prerequisite

Before you begin, ensure that the following requirements are met:
- You have initialized the SDK and connected to the server. For details, see [Quickstart](quickstart.html).
- You have registered `ContactManager` and can call friend and blocklist APIs through `client.contactManager`.
- You understand the EasyIM limitations. For details, see [Limitations](/product/limitation.html).
- You have enabled the blocklist feature in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#user-blocklist).

## Friend management

### Add a friend-event listener

To receive friend-addition, friend-deletion, and friend-request state-change events, add a friend-event listener.

```typescript
client.contactManager.addEventHandler('contact-listener', {
  // The other user accepted the friend request. User A receives this event after User A sends a friend request to User B and User B accepts it.
  onContactAgreed: event => {
    console.log('The peer accepted the contact request:', event.from);
  },

  // The other user declined the friend request. User A receives this event after User A sends a friend request to User B and User B declines it.
  onContactRefuse: event => {
    console.log('The peer declined the contact request:', event.from);
  },

  // A friend request was received. User A receives this event after User B sends a friend request to User A.
  onContactInvited: event => {
    console.log('Contact request received:', event.from, 'Message:', event.status);
  },

  // A friend was deleted. User A receives this event after User B removes User A from User B's friend list.
  onContactDeleted: event => {
    console.log('Removed as a contact:', event.userInfo.userId);
  },

  // A friend was added. Both users receive this event after the friend relationship is established.
  onContactAdded: event => {
    console.log('Contact added:', event.userInfo.userId);
  },

  // Triggered when a friend's user attributes are updated.
  onContactInfoUpdated: event => {
    console.log('Contact attributes updated:', event.userInfo.userId, event.userInfo);
  },
});
```

### Add a friend

Adding a friend establishes a persistent one-to-one relationship. After the other user accepts the request, both users become friends. The current SDK supports only mutual friend relationships, not one-way friends or following relationships.

The typical process is as follows:

1. Call `addContact` to send a friend request.
2. The other user receives the request through `onContactInvited` and chooses to accept or decline it.
3. If the other user accepts, the friend relationship is established. If the other user declines, the request ends.

Call `addContact` to send a friend request:

```typescript
await client.contactManager.addContact({
  userId: 'user2',
  message: 'Hello, I'm user1. I'd like to add you as a contact',
});
```

The recipient receives the request through `onContactInvited` and can accept or decline it:

- Call `acceptContactInvite` to accept the friend request. The requester receives `onContactAgreed`, and both users receive `onContactAdded`.
- Call `declineContactInvite` to decline the friend request. The requester receives `onContactRefuse`.

```typescript
await client.contactManager.acceptContactInvite({ userId: 'user1' });
```

```typescript
await client.contactManager.declineContactInvite({ userId: 'user1' });
```

:::tip

- The server does not repeatedly deliver friend-request events. If your app needs to display a pending-request list, we recommend saving a local request record when `onContactInvited` is received.
- The current SDK does not provide an API for retrieving the friend-request list.
:::

### Delete a friend

After you call `deleteContact` to delete a friend, you are also removed from the other user's friend list. This operation does not require the other user's confirmation. We recommend adding a confirmation step in your app.

```typescript
await client.contactManager.deleteContact({ userId: 'user2' });
```

After deletion, the other user receives the `onContactDeleted` event.

### Set friend remarks

Call `setContactRemark` to set remarks for an individual friend.

```typescript
await client.contactManager.setContactRemark({
  userId: 'user2',
  remark: 'Colleague Alex', // Friend remarks cannot exceed 100 characters. Pass an empty string to clear them.
});
```

### Retrieve the friend list and friend information

#### Retrieve the friend list from the server

To actively refresh the friend list and friend information from the server, call `client.refreshContactSnapshot`. This method triggers friend-data synchronization but does not directly return the friend-list result. After the refresh finishes, call `client.contactManager.getContacts` to read the current in-memory friend-list view.

Each friend object in the return value is a `Contact`. Read the following friend information from this object:
- `userId`: Friend user ID.
- `remark`: Friend remarks.
- `userInfo`: Friend user attributes.
- `addTs`: Time when the friend was added.

```typescript
await client.refreshContactSnapshot();

const contacts = client.contactManager.getContacts();
contacts.forEach(contact => {
  console.log(contact.userId, contact.remark, contact.userInfo, contact.addTs);
});
```

#### Retrieve the friend list locally

Call `getContacts` to read the current in-memory friend-list view. This method does not make a network request.

Each friend object in the local friend list is also a `Contact`. Read the following friend information from this object:
- `userId`: Friend user ID.
- `remark`: Friend remarks.
- `userInfo`: Friend user attributes.
- `addTs`: Time when the friend was added.

:::tip
To retrieve the latest friend list and friend information, we recommend calling `client.refreshContactSnapshot` first or [enabling automatic friend-list synchronization after login](#enable-automatic-synchronization) during initialization.
:::

```typescript
const contacts = client.contactManager.getContacts();

contacts.forEach(contact => {
  console.log(contact.userId);
  console.log(contact.remark);
  console.log(contact.userInfo);
  console.log(contact.addTs);
});
```

#### Retrieve an individual user's attributes from local memory

To read an individual friend's user attributes from memory, select the target friend from the friend list returned by `client.contactManager.getContacts`. For details about this API, see [Read user attributes from local memory](userinfo_provider.html#read-user-attributes-from-local-memory).

To retrieve the latest user attributes, call [client.userInfoManager.getUserInfoByUserId](userprofile.html#retrieve-all-user-attributes-from-the-server) to query the server.

### Automatically synchronize the friend list after login

#### Enable automatic synchronization

The SDK uses the initialization parameter `enableSyncData: ['contact']` to control automatic synchronization of the friend list and friend information after login. When enabled, the SDK automatically triggers friend-data synchronization after a successful login and updates the local friend snapshot.

Configure this feature during `ChatClient.init` and register `ContactManager` and `UserInfoManager`. After synchronization finishes, call `client.contactManager.getContacts` to read the current in-memory friend-list view.

```typescript
const client = ChatClient.init({
  appKey: 'easemob-demo#chatdemoui',
  enableSyncData: ['conversation', 'contact'],
  managers: [ContactManager, UserInfoManager],
});
```

#### Monitor the synchronization state and friend-information changes

After enabling automatic synchronization, we recommend using `client.addEventHandler` to monitor friend-synchronization start and completion events and `client.contactManager.addEventHandler` to monitor friend-attribute update events so that you can promptly update the UI or handle errors.

- `onSyncDataStart`: Triggered when synchronization of the friend list and friend information starts.
- `onSyncDataFinished`: Triggered when synchronization of the friend list and friend information finishes. If synchronization fails, use `status` and `error` to retrieve the result and reason for failure.
- `onContactInfoUpdated`: Triggered when a friend's attributes change. Read the updated friend information through `event.userInfo` or `event.contact`.

Example code:

```typescript
// Monitor the synchronization state of the friend list and friend information.
client.addEventHandler('contact-sync-listener', {
  onSyncDataStart: payload => {
    if (payload.dataType === 'contact') {
      console.log('Contact synchronization started');
    }
  },

  onSyncDataFinished: payload => {
    if (payload.dataType === 'contact') {
      if (payload.status === 'success') {
        console.log('Contact synchronization completed');
      } else {
        console.log('Contact synchronization failed:', payload.error);
      }
    }
  },
});

// Monitor friend-attribute updates.
client.contactManager.addEventHandler('contact-profile-listener', {
  onContactInfoUpdated: event => {
    console.log('Contact user ID:', event.userInfo.userId);
    console.log('Contact attributes:', event.userInfo);

    if (event.contact) {
      console.log('Contact remarks:', event.contact.remark);
      console.log('Contact added time:', event.contact.addTs);
    }

    // Refresh the friend list, friend-details page, or avatar, nickname, and other displayed information in the conversation list here.
  },
});
```

For friend user-attribute change notifications in different scenarios, see [Monitor user attribute changes](userprofile.html#monitor-user-attribute-changes).

### Allow only friends to send messages

By default, EasyIM allows one-to-one messages between users who are not friends, so they can chat without adding each other as friends. To allow one-to-one messages only between friends, go to the [EasyIM Console](https://console.easyim.ai/user/login) and [enable friend relationship checks](/product/console/basic_user.html#friend-relationship-check). After this feature is enabled, the SDK checks the friend relationship when a user initiates a one-to-one chat. If the user sends a one-to-one message to a non-friend user, the SDK returns error code `221`.

## Blocklist management

The blocklist is independent of the friend system and is primarily used to manage users to block.

### Add users to the blocklist

To block messages from a user, add the user to the blocklist. This operation applies to any user, whether or not they are a friend. After being added to the blocklist, the user cannot send you messages or friend requests.

If the user added to the blocklist is a friend, the friend relationship remains in your friend list.

Call `addUsersToBlocklist` to add one or more users to the blocklist:

```typescript
const result = await client.contactManager.addUsersToBlocklist({
  userIds: ['user3'],
});

console.log(result.succeeded, result.failed);
```

### Remove users from the blocklist

Call `removeUserFromBlocklist` to remove one or more users from the blocklist. After removal, the users can send messages and perform other actions again.

```typescript
await client.contactManager.removeUserFromBlocklist({
  userIds: ['user3'],
});
```

### Retrieve the blocklist from the server

Call `getBlocklist` to retrieve the blocklist from the server:

```typescript
const blocklist = await client.contactManager.getBlocklist();
console.log(blocklist);
```

### Retrieve the blocklist from the local cache

The first call to `getBlocklist` in the current login session retrieves the blocklist from the server and writes it to the blocklist snapshot maintained internally by the SDK. After the snapshot finishes loading, subsequent calls to `getBlocklist` in the same session return the current cached blocklist snapshot first instead of actively retrieving it from the server again.

```typescript
const blocklist = await client.contactManager.getBlocklist();
console.log(blocklist);
```

## API list

| API name                                             | Module/Class       | Description                                                         |
| ---------------------------------------------------- | ----------------- | ------------------------------------------------------------ |
| [`addContact`](#add-a-friend)                            | `ContactManager`  | Sends a friend request.                                               |
| [`acceptContactInvite`](#add-a-friend)                   | `ContactManager`  | Accepts a friend request.                                               |
| [`declineContactInvite`](#add-a-friend)                  | `ContactManager`  | Declines a friend request.                                               |
| [`deleteContact`](#delete-a-friend)                         | `ContactManager`  | Deletes a friend.                                                   |
| [`setContactRemark`](#set-friend-remarks)                  | `ContactManager`  | Sets or clears friend remarks.                                         |
| [`refreshContactSnapshot`](#retrieve-the-friend-list-from-the-server)    | `ChatClient`      | Actively refreshes synchronization of the friend list and friend information.                         |
| [`getContacts`](#retrieve-the-friend-list-locally)                 | `ContactManager`  | Reads the current in-memory friend-list view.                               |
| [`getUserInfoByUserId`](#retrieve-an-individual-users-attributes-from-local-memory) | `UserInfoManager` | Retrieves the latest user attributes for specified users from the server.                         |
| [`ChatClient.init`](#enable-automatic-synchronization)                   | `ChatClient`      | Configures automatic synchronization of the friend list and friend information after login through `enableSyncData`. |
| [`addUsersToBlocklist`](#add-users-to-the-blocklist)           | `ContactManager`  | Adds users to the blocklist in batches.                                         |
| [`removeUserFromBlocklist`](#remove-users-from-the-blocklist)     | `ContactManager`  | Removes users from the blocklist in batches.                                         |
| [`getBlocklist`](#retrieve-the-blocklist-from-the-server)            | `ContactManager`  | Retrieves the blocklist for the current login session.                             |
