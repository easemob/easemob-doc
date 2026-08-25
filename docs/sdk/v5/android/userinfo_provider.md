# Automatic User Information Management

## Feature overview

EasyIM provides automatic user information management. After this feature is enabled, the SDK automatically maintains user information synchronization and in-memory updates, reducing the work required to manually retrieve, store, and update user information.

This feature applies to scenarios such as conversation lists, message lists, and group chat pages that display user nicknames, avatars, remarks, or group member name cards.

**User information on this page refers to user-related information displayed by your app, including [user attributes](userprofile.html), [friend remarks](user_relationship.html#set-friend-remarks), and [group member name cards](group_namecard.html).**

## Understand the tech

Automatic user information management is controlled by `EMOptions#setEnableUserInfo(true)`. After it is enabled, the SDK automatically synchronizes the currently logged-in user's attributes after login succeeds. When sending a message, it automatically includes the update time of the sender's user attributes. For a group message, it also includes the update time of the sender's group member name card in the current chat group.

After receiving a message, the SDK automatically compares the update times carried in the message with the corresponding timestamps in the local cache. If it detects updated data or missing local cache data, it automatically retrieves the latest user attributes or group member name card from the server, updates the local cache, and notifies the business layer through the relevant event to refresh the UI.

When sender information is obtained through a message, the SDK automatically synchronizes user information, updates memory, and refreshes related display data as follows:

1. After login succeeds, the SDK automatically retrieves the currently logged-in user's information from the server and writes it to local memory.
2. After the user updates their information, subsequent messages carry the corresponding information update time.
3. After the recipient receives a message, the SDK parses the sender information and update time in it.
4. The SDK compares the update time in the message with the timestamp in local memory.
5. If the update time in the message is later, the SDK automatically [retrieves the latest user attributes from the server](userprofile.html#retrieve-all-user-attributes-from-the-server) or the [group member name card](group_namecard.html#从服务端获取群成员名片).
6. After retrieval succeeds, the SDK automatically updates local memory.
7. After local memory is updated, the SDK notifies the upper-layer app through an event, which the business layer can use to refresh the UI.

The memory update process is as follows:

![img](/images/android/memory_update_userinfo_mgmt.png)

## Prerequisite

Before integration, ensure that the following requirements are met:

- Initialize the SDK. For details, see [Quickstart](quickstart.html).
- Understand the relevant EasyIM [limitations](/product/limitation.html).

## Enable automatic user information management

Call `EMOptions#setEnableUserInfo(true)` before SDK initialization:

```java
EMOptions options = new EMOptions();
options.setAppKey("your_appkey");
options.setEnableUserInfo(true);
EMClient.getInstance().init(context, options);
```

:::tip
Call `EMOptions#setEnableUserInfo(true)` before `EMClient.getInstance().init(context, options)` initializes the SDK. Otherwise, the feature does not take effect.
:::

## Monitor user attribute updates

The SDK provides `EMUserInfoManagerListener` to monitor user attribute update events, primarily including:
- `EMUserInfoManagerListener#onSelfUserInfoUpdate`: Triggered after the currently logged-in user's attributes are synchronized or updated and written to local memory.
- `EMUserInfoManagerListener#onUserInfoUpdate`: Triggered after another user's attributes are updated and written to local memory, including these scenarios:
  - A message is received from another user, and the sender's nickname or avatar in the message has changed. To receive user attribute update events in this scenario, enable automatic user information management.
  - Your app explicitly [retrieves user attributes from the server](userprofile.html#retrieve-all-user-attributes-from-the-server).
  - Your app explicitly [retrieves chat group member information from the server](group_members.html#获取群成员列表).

**We recommend registering the listener during business initialization so that the app promptly receives events and refreshes the UI during initial synchronization after login, message-triggered updates, or explicit retrieval.** For user attribute change notifications in other scenarios, see [Monitor user attribute changes](userprofile.html#monitor-user-attribute-changes).

- Add a listener:

```java
EMUserInfoManagerListener userInfoListener = new EMUserInfoManagerListener() {
    @Override
    public void onSelfUserInfoUpdate(EMUserInfo userInfo) {
        EMLog.d("UserInfo", "Current user's attributes updated - nickname:" + userInfo.getNickname()
                + ", avatarUrl:" + userInfo.getAvatarUrl());
    }

    @Override
    public void onUserInfoUpdate(List<EMUserInfo> userInfoList) {
        for (EMUserInfo userInfo : userInfoList) {
            EMLog.d("UserInfo", "User attributes updated - userId:" + userInfo.getUserId()
                    + ", nickname:" + userInfo.getNickname()
                    + ", avatarUrl:" + userInfo.getAvatarUrl());
        }
    }
};

EMClient.getInstance()
        .userInfoManager()
        .addUserInfoManagerListener(userInfoListener);
```

Remove the listener when it is no longer needed:

```java
EMClient.getInstance()
        .userInfoManager()
        .removeUserInfoManagerListener(userInfoListener);
```

## Obtain sender information through a message

After automatic user information management is enabled, if a sender includes their user information when sending a message, the SDK retrieves those user attributes again and triggers `EMUserInfoManagerListener#onUserInfoUpdate` when the recipient receives the message and the sender's user attribute update time carried in the message is later than the local cache. This applies regardless of whether the sender and recipient are friends.

Call `EMMessage#getSenderInfo()` to retrieve the currently available sender information, including the nickname, avatar, remarks, and group member name card.

```java
public void onMessageReceived(List<EMMessage> messages) {
    for (EMMessage message : messages) {
        EMSenderInfo senderInfo = message.getSenderInfo();
        if (senderInfo != null) {
            String nickname = senderInfo.getNickname();
            String avatar = senderInfo.getAvatar();
            String remark = senderInfo.getRemark();
            String namecard = senderInfo.getNamecard();
            EMLog.d("UserInfo", "Sender information - nickname:" + nickname
                    + ", avatar:" + avatar
                    + ", remark:" + remark
                    + ", namecard:" + namecard);
        }
    }
}
```

:::tip
`EMMessage#getSenderInfo()` returns the currently available local sender information. If the message triggers a user information update, the SDK notifies the business layer through the relevant event after it finishes updating local memory with the latest data.
:::

## Read user attributes from local memory

To read multiple users' attributes directly from local memory, call `EMUserInfoManager#getUserInfoWithUserIds`. The API returns a mapping from user IDs to `EMUserInfo` objects through a callback. It reads specified users' attributes directly from local memory and does not initiate a network request, so it can supplement the friend-list read capability.

To synchronously read a single user's attributes, call `EMUserInfoManager#getUserInfoWithUserId`. It returns `null` if the user is not in local memory.

```java
EMClient.getInstance().userInfoManager().getUserInfoWithUserIds(
        new String[] {"userId1", "userId2"},
        new EMValueCallBack<Map<String, EMUserInfo>>() {
            @Override
            public void onSuccess(Map<String, EMUserInfo> userInfoMap) {
                for (Map.Entry<String, EMUserInfo> entry : userInfoMap.entrySet()) {
                    EMUserInfo userInfo = entry.getValue();
                    EMLog.d("UserInfo", "User attributes - userId:" + entry.getKey()
                            + ", nickname:" + userInfo.getNickname()
                            + ", avatarUrl:" + userInfo.getAvatarUrl());
                }
            }

            @Override
            public void onError(int code, String error) {
                EMLog.e("UserInfo", "Failed to read local user attributes: " + code + ", " + error);
            }
        });
```

:::tip
This API returns only data in local memory. To explicitly retrieve the latest user attributes from the server, call `EMUserInfoManager#fetchUserInfoByUserId`. For details, see [Manage User Attributes](userprofile.html#retrieve-all-user-attributes-from-the-server).
:::

## Considerations

- Call `EMOptions#setEnableUserInfo(true)` before SDK initialization.
- Prefer registering `EMUserInfoManagerListener` early so that your business UI can be refreshed promptly after local memory is updated.
- `EMMessage#getSenderInfo()` represents the currently available local sender information and is not guaranteed to be the final latest value immediately after a message is received.
- When the update time in a message is later than that in local memory, the SDK automatically retrieves the latest data from the server and updates local memory.
- `EMUserInfoManager#getUserInfoWithUserIds` queries only local memory and does not explicitly retrieve the latest data from the server.

## FAQ

#### When should automatic user information management be enabled?

Call `EMOptions#setEnableUserInfo(true)` before `EMClient.getInstance().init(context, options)` initializes the SDK. If it is set after SDK initialization is complete, automatic user information management does not take effect.

#### What does the SDK do automatically after the feature is enabled?

After automatic user information management is enabled with `EMOptions#setEnableUserInfo(true)`, the SDK automatically synchronizes the currently logged-in user's information after login succeeds; includes sender information and its update time when sending messages; compares the update time in a received message with local memory; retrieves the latest information from the server and updates local memory when it detects updated data; and notifies the business layer through an event.

#### Is EMMessage#getSenderInfo() always up to date?

No. `EMMessage#getSenderInfo()` returns the currently available local sender information. If the message triggers a user information update, the SDK first retrieves the latest data from the server and updates local memory, and then notifies the business layer through the relevant event to refresh the UI.

#### Why should the listener be registered early?

After [automatic user information management is enabled](#enable-automatic-user-information-management), the SDK might notify the business layer during initial synchronization after login or message-triggered user information updates. We recommend registering `EMUserInfoManagerListener` during business initialization so that the app can promptly receive events and refresh the UI.

#### What is the difference between reading locally and retrieving from the server?

`EMUserInfoManager#getUserInfoWithUserIds` queries only local memory and does not initiate a network request, making it suitable for local display. To obtain the latest user attributes, explicitly call the corresponding [API](userprofile.html#retrieve-all-user-attributes-from-the-server).

#### Must the app maintain memory after the feature is enabled?

Generally, no. After `EMOptions#setEnableUserInfo(true)` is enabled, the SDK automatically synchronizes user information, compares update times, updates local memory, and sends event notifications. The business layer generally only needs to read data from local memory and refresh the UI in the relevant events.

## Related features

### Manage group member name cards

After automatic user information management is enabled, the SDK also automatically synchronizes and updates group member name cards. You can further implement setting, querying, and change monitoring for group member name cards. For details, see [Manage Group Member Name Cards](group_namecard.html).

### User attributes and user information

- User information refers to user-related information displayed by your app, including [user attributes](userprofile.html), [friend remarks](user_relationship.html#set-friend-remarks), and [group member name cards](group_namecard.html).
- User attributes are profile fields that users can set and manage, such as nickname, avatar, email address, and phone number. Set, update, and query these fields through the relevant APIs. For details, see [Manage User Attributes](userprofile.html). For example, call `EMUserInfoManager#updateOwnInfo` to set the currently logged-in user's nickname, avatar, and other information. If automatic user information management is enabled by calling `EMOptions#setEnableUserInfo(true)`, the updated information is automatically synchronized in subsequent messages.

### Sender information synchronized through messages

After automatic user information management is enabled, received messages contain sender-related information, including the nickname, avatar, remarks, and group member name card.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`setAppKey`](#enable-automatic-user-information-management) | `EMOptions` | Sets the App Key of the app. |
| [`setEnableUserInfo`](#enable-automatic-user-information-management) | `EMOptions` | Enables or disables automatic user information management. |
| [`init`](#enable-automatic-user-information-management) | `EMClient` | Initializes the SDK with the specified configuration. |
| [`getUserInfoWithUserId`](#read-user-attributes-from-local-memory) / [`getUserInfoWithUserIds`](#read-user-attributes-from-local-memory) | `EMUserInfoManager` | Reads one or more users' attributes from local memory. |
| [`fetchUserInfoByUserId`](#read-user-attributes-from-local-memory) | `EMUserInfoManager` | Retrieves one or more users' attributes from the server. |
| [`updateOwnInfo`](#user-attributes-and-user-information) | `EMUserInfoManager` | Sets or updates multiple attributes of the currently logged-in user. |
