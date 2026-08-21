# Manage User Relationships

The SDK provides user relationship management, including friend and blocklist management.

- Friend management: Add friends, process friend requests, delete friends, set friend remarks, retrieve the friend list, and automatically synchronize the friend list and friend information after login succeeds.
- Blocklist management: Retrieve the blocklist and add or remove users. Before using this feature, activate the service in [EasyIM Console](https://console.easemob.com/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#用户黑名单).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM [limitations](/product/limitation.html).
- Activate the blocklist feature in [EasyIM Console](https://console.easemob.com/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#用户黑名单).

## Friend management

### Monitor friend relationships and friend information changes

Use `EMContactListener` to monitor friend request, acceptance, rejection, addition, deletion, and friend information change events.

```java
EMContactListener contactListener = new EMContactListener() {
    // The peer accepts a friend request. User A sends user B a friend request. After user B accepts it, user A receives this event.
    @Override
    public void onFriendRequestAccepted(String username) { }

    // The peer declines a friend request. User A sends user B a friend request. After user B declines it, user A receives this event.
    @Override
    public void onFriendRequestDeclined(String username) { }

    // A friend request is received. User B sends user A a friend request, and user A receives this event.
    @Override
    public void onContactInvited(String username, String reason) { }

    // A friend is deleted. After user B deletes user A from the friend list, user A receives this event.
    @Override
    public void onContactDeleted(String username) { }

    // A friend is added. User B sends user A a friend request. After user A accepts it, user B receives `onFriendRequestAccepted`, and both users receive `onContactAdded`.
    @Override
    public void onContactAdded(String username) { }

    // Friend information changes. Retrieve the updated friend information from contact.
    @Override
    public void onContactInfoUpdate(EMContact contact) { }
};

// Register the listener for friend relationship and friend information changes.
EMClient.getInstance().contactManager().setContactListener(contactListener);

// Remove the listener when it is no longer needed.
EMClient.getInstance().contactManager().removeContactListener(contactListener);
```

### Add a friend

Adding a friend establishes a stable one-to-one relationship. After the peer accepts the request, both users become friends. The current SDK supports only mutual friendships, not one-way friendships or following relationships.

The typical process is as follows:

1. Call `asyncAddContact` to initiate a friend request.
2. The peer receives the request through `onContactInvited` and chooses to accept or decline it.
3. If the peer accepts, a friendship is established. If the peer declines, the request ends.

Call `asyncAddContact` to initiate a friend request:

```java
// Asynchronous method.
EMClient.getInstance().contactManager().asyncAddContact(toAddUsername, reason, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
    }
});
```

The recipient receives the request through `onContactInvited` and can accept or decline it:

- Call `asyncAcceptInvitation` to accept the friend request. The requester receives `onFriendRequestAccepted`, and both users receive `onContactAdded`.
- Call `asyncDeclineInvitation` to decline the friend request. The requester receives `onFriendRequestDeclined`.

```java
// Asynchronous method.
EMClient.getInstance().contactManager().asyncAcceptInvitation(username, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
    }
});
```

```java
// Asynchronous method.
EMClient.getInstance().contactManager().asyncDeclineInvitation(username, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
    }
});
```

:::tip
- The server does not repeatedly deliver friend request events. To display a pending request list, save request records locally when `onContactInvited` is received.
- The current SDK does not provide an API for retrieving the friend request list.
:::

### Delete a friend

Call `asyncDeleteContact` to delete a friend. After deletion, the user is also removed from the peer's friend list, the friendship is removed for both parties, and the peer receives `onContactDeleted`. The operation does not require peer confirmation, so we recommend adding a confirmation in the app.

```java
String username = "userId";

EMClient.getInstance()
        .contactManager()
        .asyncDeleteContact(
                username,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The friend is deleted successfully.
                        // The corresponding local one-to-one conversation and local messages are also deleted.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Friend deletion failed. Handle the error based on the error code and error message.
                    }
                });
```

`asyncDeleteContact` does not provide a `keepConversation` parameter. After it succeeds, the SDK deletes the corresponding local one-to-one conversation and local messages by default. To retain them, call the synchronous `deleteContact` method and set `keepConversation` to `true`. Setting it to `false` also deletes the corresponding local conversation and messages.

```java
try {
    EMClient.getInstance()
            .contactManager()
            .deleteContact(username, true);
} catch (HyphenateException e) {
    // Handle the error based on the exception information.
}
```

### Set friend remarks

Call `asyncSetContactRemark` to set remarks for a friend.

```java
// Friend remarks cannot exceed 100 characters. Pass an empty string to clear the remarks.
EMClient.getInstance().contactManager().asyncSetContactRemark(userId, remark, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int code, String error) {
        
    }
});
```

### Retrieve the friend list and friend information

#### Automatically synchronize the friend list after login

The SDK obtains the latest friend data through automatic synchronization. Configure `EMDataSyncType.CONTACTS` before SDK initialization. After login succeeds, the SDK automatically synchronizes the friend list and friend information from the server and writes them locally. A `type` of `EMDataSyncType.CONTACTS` and an `errorCode` of `EMError.EM_NO_ERROR` in `onDataSyncFinish` indicate successful friend data synchronization. You can then read the friend list and friend information through local APIs.

**Enable automatic friend data synchronization**

Before calling `EMClient#init`, configure `EMDataSyncType.CONTACTS` through `EMOptions#setDataSyncType`.

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONTACTS
));

EMClient.getInstance().init(getApplicationContext(), options);
```

**Monitor friend data synchronization**

After automatic synchronization is enabled, monitor its start and completion through `EMConnectionListener`.

- `onDataSyncStart(EMDataSyncType type)`: Triggered when a data type starts synchronizing. `CONTACTS` indicates that friend data synchronization has started.
- `onDataSyncFinish(EMDataSyncType type, int errorCode)`: Triggered when synchronization finishes. `CONTACTS` indicates friend data; `errorCode == EMError.EM_NO_ERROR` indicates success.
- Monitor friend relationship and friend information changes through `EMContactListener`. See [Monitor friend relationships and friend information changes](#monitor-friend-relationships-and-friend-information-changes).
- For user attribute change notifications for friends in different scenarios, see [Monitor user attribute changes](userprofile.html#monitor-user-attribute-changes).

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
        // The SDK has successfully connected to the EasyIM server.
    }

    @Override
    public void onDisconnected(int errorCode) {
        // The SDK is disconnected from the EasyIM server. Determine the cause based on errorCode.
    }

    @Override
    public void onDataSyncStart(EMOptions.EMDataSyncType type) {
        if (type == EMOptions.EMDataSyncType.CONTACTS) {
            // Friend data synchronization starts.
        }
    }

    @Override
    public void onDataSyncFinish(EMOptions.EMDataSyncType type, int errorCode) {
        if (type != EMOptions.EMDataSyncType.CONTACTS) {
            return;
        }

        if (errorCode == EMError.EM_NO_ERROR) {
            // Friend data synchronization succeeds. The local friend list and friend information can now be read.
        } else {
            // Friend data synchronization fails. Handle the error based on errorCode.
        }
    }
};

// Register the connection and data synchronization listener.
EMClient.getInstance().addConnectionListener(connectionListener);

// Remove the listener when it is no longer needed.
EMClient.getInstance().removeConnectionListener(connectionListener);
```

#### Read the friend list locally

After friend data synchronization succeeds, read local data through the following APIs:

- `asyncFetchAllContactsFromLocal`: Asynchronously retrieves all local friend objects.
- `fetchContactFromLocal`: Synchronously retrieves a specified local friend object.
- `getContactsFromLocal`: Synchronously retrieves all local friend user IDs.

Asynchronously retrieve all local friend objects:

```java
EMClient.getInstance()
        .contactManager()
        .asyncFetchAllContactsFromLocal(
                new EMValueCallBack<List<EMContact>>() {
                    @Override
                    public void onSuccess(List<EMContact> contacts) {
                        // contacts is the local friend object list.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

Synchronously retrieve a specified local friend object:

```java
try {
    EMContact contact = EMClient.getInstance()
            .contactManager()
            .fetchContactFromLocal(userId);

    if (contact != null) {
        String username = contact.getUsername();
        String remark = contact.getRemark();
        EMUserInfo userInfo = contact.getUserInfo();
        long addTimestamp = contact.getAddTimestamp();
    }
} catch (HyphenateException e) {
    Log.e("Contact", "获取本地好友信息失败", e);
}
```

`EMContact` provides the following friend information:

- `getUsername()`: Retrieves the friend's user ID.
- `getRemark()`: Retrieves the friend's remarks.
- `getUserInfo()`: Retrieves the friend's user attributes locally. It might return `null` if the attributes are unavailable locally.
- `getAddTimestamp()`: Retrieves the millisecond timestamp when the friend was added. Returns `0` if this information is not in the current object.

Synchronously retrieve all local friend user IDs:

```java
try {
    List<String> userIds = EMClient.getInstance()
            .contactManager()
            .getContactsFromLocal();
} catch (HyphenateException e) {
    Log.e("Contact", "获取本地好友列表失败", e);
}
```

#### Retrieve a single user's attributes from local memory

To read a specified user's attributes directly from local memory, call `EMUserInfoManager#getUserInfoWithUserId(String)`. For details, see [Read user attributes from local memory](userinfo_provider.html#read-user-attributes-from-local-memory).

This API returns an `EMUserInfo` for a single user, not an `EMContact`. It does not initiate a network request and can supplement friend-list reads.

### Allow messages only between friends

By default, EasyIM supports one-to-one messages between non-friends. To allow one-to-one messages only between friends, [enable friend relationship checks](/product/console/basic_user.html#好友关系检查) in [EasyIM Console](https://console.easemob.com/user/login). After it is enabled, the SDK checks the relationship when a user sends a one-to-one message. A message to a non-friend returns error code `221`.

## Blocklist management

The blocklist is independent of friendships and manages users to block.

### Add a user to the blocklist

To block a user's messages, add the user to the blocklist. This applies to any user, whether a friend or not. A blocked user cannot send you messages or friend requests.

If the blocked user is a friend, the friendship remains in your friend list.

Call `addUserToBlackList` to add a user to the blocklist:

```java
// Asynchronous method. The synchronous addUserToBlackList method blocks the current thread.
// The second parameter is deprecated and no longer has business meaning.
EMClient.getInstance()
        .contactManager()
        .asyncAddUserToBlackList(
                username,
                false,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The user is added to the blocklist successfully.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        Log.e(
                                "Contact",
                                "加入黑名单失败：" + errorCode
                                        + ", " + errorMessage);
                    }
                });
```

### Remove a user from the blocklist

Call `removeUserFromBlackList` to remove a user from the blocklist. After removal, the user can send messages and perform other actions again.

```java
// Asynchronous method.
// The synchronous removeUserFromBlackList method blocks the current thread.
EMClient.getInstance()
        .contactManager()
        .asyncRemoveUserFromBlackList(
                username,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The user is removed from the blocklist successfully.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        Log.e(
                                "Contact",
                                "移出黑名单失败：" + errorCode
                                        + ", " + errorMessage);
                    }
                });
```

### Retrieve the blocklist from the server

Call `getBlackListFromServer` to retrieve the blocklist from the server:

```java
// Asynchronous method.
// The synchronous getBlackListFromServer method blocks the current thread.
EMClient.getInstance()
        .contactManager()
        .asyncGetBlackListFromServer(
                new EMValueCallBack<List<String>>() {
                    @Override
                    public void onSuccess(
                            List<String> blockedUserIds) {
                        // The server-side blocklist is retrieved successfully.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        Log.e(
                                "Contact",
                                "获取服务端黑名单失败：" + errorCode
                                        + ", " + errorMessage);
                    }
                });
```

### Retrieve the blocklist from the local database

`getBlackListUsernames` reads the blocklist from the local database. To ensure that the data reflects the latest server state, first call `getBlackListFromServer` to update local data, and then read it.

```java
EMClient.getInstance().contactManager().getBlackListUsernames();
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncAddContact`](#add-a-friend) | `EMContactManager` | Asynchronously initiates a friend request. |
| [`asyncAcceptInvitation`](#add-a-friend) / [`asyncDeclineInvitation`](#add-a-friend) | `EMContactManager` | Asynchronously accepts or declines a friend request. |
| [`asyncDeleteContact`](#delete-a-friend) / [`deleteContact`](#delete-a-friend) | `EMContactManager` | Asynchronously or synchronously deletes a friend. Only the synchronous two-parameter method can specify whether to retain the local conversation and messages. |
| [`asyncSetContactRemark`](#set-friend-remarks) | `EMContactManager` | Sets friend remarks. |
| [`setDataSyncType`](#automatically-synchronize-the-friend-list-after-login) | `EMOptions` | Sets the data types automatically synchronized after login. |
| [`asyncFetchAllContactsFromLocal`](#read-the-friend-list-locally) | `EMContactManager` | Asynchronously retrieves all local friend objects. |
| [`fetchContactFromLocal`](#read-the-friend-list-locally) / [`getContactsFromLocal`](#read-the-friend-list-locally) | `EMContactManager` | Synchronously reads local friend information or the user ID list. |
| [`getUserInfoWithUserId`](#retrieve-a-single-users-attributes-from-local-memory) | `EMUserInfoManager` | Reads a single user's attributes from local memory. |
| [`asyncAddUserToBlackList`](#add-a-user-to-the-blocklist) / [`addUserToBlackList`](#add-a-user-to-the-blocklist) | `EMContactManager` | Asynchronously or synchronously adds a user to the blocklist. |
| [`asyncRemoveUserFromBlackList`](#remove-a-user-from-the-blocklist) / [`removeUserFromBlackList`](#remove-a-user-from-the-blocklist) | `EMContactManager` | Asynchronously or synchronously removes a user from the blocklist. |
| [`asyncGetBlackListFromServer`](#retrieve-the-blocklist-from-the-server) / [`getBlackListFromServer`](#retrieve-the-blocklist-from-the-server) | `EMContactManager` | Asynchronously or synchronously retrieves the blocklist from the server. |
| [`getBlackListUsernames`](#retrieve-the-blocklist-from-the-local-database) | `EMContactManager` | Reads the blocklist from the local database. |
| [`getDataSyncType`](#automatically-synchronize-the-friend-list-after-login) | `EMOptions` | Retrieves the currently configured automatic synchronization data types. |
