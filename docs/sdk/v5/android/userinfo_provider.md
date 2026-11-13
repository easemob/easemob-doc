# Automatic User Information Management

## Feature overview

EasyIM provides automatic user information management. After this feature is enabled, the SDK automatically maintains user information synchronization and cache updates, reducing the work required to manually retrieve, store, and update user information.

This feature applies to scenarios such as conversation lists, message lists, and group chat pages that display user nicknames, avatars, friend remarks, or group member name cards.

**User information on this page refers to user-related information displayed by your app, including [user attributes](userprofile.html), [friend remarks](user_relationship.html#set-friend-remarks), and [group member name cards](group_namecard.html).**

## Understand the tech

Automatic user information management is controlled by `EMOptions#setEnableUserInfo(true)`. After it is enabled, the SDK automatically synchronizes the currently logged-in user's attributes after login succeeds. When sending a message, it automatically includes the update time of the sender's user attributes. For a group message, it also includes the update time of the sender's group member name card in the current chat group.

After receiving a message, the SDK automatically compares the update times carried in the message with the corresponding timestamps in the local cache. If it detects updated data or missing local cache data, it automatically retrieves the latest user attributes or group member name card from the server, updates the local cache, and notifies the business layer through the relevant event to refresh the UI. Friend remarks are read from the recipient's local friend data. They are not sent with messages or synchronized through the update-time comparison mechanism described above. For details, see [Obtain sender information through a message](#obtain-sender-information-through-a-message).

When sender information is obtained through a message, the SDK automatically synchronizes user information, updates the cache, and refreshes related display data as follows:

1. After login succeeds, the SDK automatically retrieves the currently logged-in user's information from the server and writes it to the local cache.
2. After the user updates their information, subsequent messages carry the corresponding information update time. Group messages also carry the update time of the sender's member name card in the current group.
3. After the recipient receives a message, the SDK parses the user attribute update time carried in it. For group messages, it also parses the group member name card update time.
4. The SDK compares the update times in the message with the corresponding timestamps in the local cache.
5. If the message carries a valid update time and either that time is later than the corresponding timestamp in the local cache or the corresponding local data is missing, the SDK automatically [retrieves the latest user attributes from the server](userprofile.html#retrieve-all-user-attributes-from-the-server) or the [group member name card](group_namecard.html#retrieve-group-member-name-cards-from-the-server). Group member name cards apply only to group messages.
6. After retrieval succeeds, the SDK automatically updates the local cache.
7. The SDK notifies the upper-layer app through an event, which the business layer can use to refresh the UI.

The cache update process is as follows:

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
- `EMUserInfoManagerListener#onSelfUserInfoUpdate`: Triggered after the currently logged-in user's attributes are synchronized or updated and written to the local cache.
- `EMUserInfoManagerListener#onUserInfoUpdate`: Triggered after another user's attributes are updated and written to the local cache, including these scenarios:
  - A subscribed user's attributes change.
  - After [automatic user information management](userinfo_provider.html) is enabled, a message is received from another user and carries a valid update time for the sender's user attributes, such as nickname or avatar. If that time is later than the timestamp in the local cache or the corresponding data is missing locally, the SDK automatically retrieves the user attributes and updates the local cache.
  - Your app explicitly [retrieves user attributes from the server](userprofile.html#retrieve-all-user-attributes-from-the-server).
  - Your app explicitly [retrieves chat group member information from the server](group_members.html#retrieve-the-group-member-list).

**We recommend registering the listener during business initialization so that the app promptly receives events and refreshes the UI during initial synchronization after login, message-triggered updates, or explicit retrieval.** For user attribute change notifications in other scenarios, see [Monitor user attribute changes](userprofile.html#monitor-user-attribute-changes).

:::tip
To receive notifications of changes to friends' user attributes or subscribe to attribute-change notifications for strangers, first contact the EasyIM business manager to enable the corresponding feature. For details, see [Monitor user attribute changes](userprofile.html#monitor-user-attribute-changes) and [Subscribe to stranger attribute changes](userprofile.html#subscribe-to-stranger-attribute-changes).
:::

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

Friend remarks are friend data, not the sender's user attributes, and are not synchronized through the user attribute update time carried in messages. After automatic user information management is enabled, when the recipient's SDK assembles the `EMSenderInfo` returned by `EMMessage#getSenderInfo`, it reads the remark that the current user has set for the message sender from local friend information. The business layer can call `EMSenderInfo#getRemark` to retrieve the remark for unified display. The remark is not sent with the message or passed to the peer.

`EMMessage#getSenderInfo()` returns `EMSenderInfo` and may return `null`. After obtaining `EMSenderInfo`, read sender information through the following methods. Each method may return `null`:

| Method | Return type | Description |
| :--- | :--- | :--- |
| `getUserId()` | `String` | The message sender's user ID. |
| `getNickname()` | `String` | The message sender's nickname. |
| `getAvatar()` | `String` | The message sender's avatar URL. |
| `getRemark()` | `String` | The friend remark that the current user has set for the message sender. Friend remarks are private friend data belonging to the recipient. The recipient's SDK reads them from local friend information. They are not sent with the message by the sender or passed to the peer. |
| `getNamecard()` | `String` | The sender's member name card in the current group. |

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
`EMMessage#getSenderInfo()` returns the currently available local sender information. If the message triggers a user information update, the SDK notifies the business layer through the relevant event after it finishes updating the local cache with the latest data.
:::

## Read user attributes from the local cache

To read multiple users' attributes directly from the local cache, call `EMUserInfoManager#getUserInfoWithUserIds`. The API returns a mapping from user IDs to `EMUserInfo` objects through a callback. It reads specified users' attributes directly from the local cache and does not initiate a network request, so it can supplement the friend-list read capability.

To synchronously read a single user's attributes, call `EMUserInfoManager#getUserInfoWithUserId`. It returns `null` if the user is not in the local cache.

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
This API returns only data in the local cache. To explicitly retrieve the latest user attributes from the server, call `EMUserInfoManager#fetchUserInfoByUserId`. For details, see [Manage User Attributes](userprofile.html#retrieve-all-user-attributes-from-the-server).
:::

## Considerations

- Call `EMOptions#setEnableUserInfo(true)` before SDK initialization.
- Prefer registering `EMUserInfoManagerListener` early so that your business UI can be refreshed promptly after the local cache is updated.
- `EMMessage#getSenderInfo()` represents the currently available local sender information and is not guaranteed to be the final latest value immediately after a message is received.
- When the update time in a message is later than that in the local cache, the SDK automatically retrieves the latest data from the server and updates the local cache.
- `EMUserInfoManager#getUserInfoWithUserIds` queries only the local cache and does not explicitly retrieve the latest data from the server.

## FAQ

#### When should automatic user information management be enabled?

Call `EMOptions#setEnableUserInfo(true)` before `EMClient.getInstance().init(context, options)` initializes the SDK. If it is set after SDK initialization is complete, automatic user information management does not take effect.

#### What does the SDK do automatically after the feature is enabled?

After automatic user information management is enabled with `EMOptions#setEnableUserInfo(true)`, the SDK automatically synchronizes the currently logged-in user's information after login succeeds; includes sender information and its update time when sending messages; compares the update time in a received message with the local cache; retrieves the latest information from the server and updates the local cache when it detects updated data; and notifies the business layer through an event.

#### Is EMMessage#getSenderInfo() always up to date?

No. `EMMessage#getSenderInfo()` returns the currently available local sender information. If the message triggers a user information update, the SDK first retrieves the latest data from the server and updates the local cache, and then notifies the business layer through the relevant event to refresh the UI.

#### Why should the listener be registered early?

After [automatic user information management is enabled](#enable-automatic-user-information-management), the SDK might notify the business layer during initial synchronization after login or message-triggered user information updates. We recommend registering `EMUserInfoManagerListener` during business initialization so that the app can promptly receive events and refresh the UI.

#### What is the difference between reading locally and retrieving from the server?

`EMUserInfoManager#getUserInfoWithUserIds` queries only the local cache and does not initiate a network request, making it suitable for local display. To obtain the latest user attributes, explicitly call the corresponding [API](userprofile.html#retrieve-all-user-attributes-from-the-server).

#### Must the app maintain the cache after the feature is enabled?

Generally, no. After `EMOptions#setEnableUserInfo(true)` is enabled, the SDK automatically synchronizes user information, compares update times, updates the local cache, and sends event notifications. The business layer generally only needs to read data from the local cache and refresh the UI in the relevant events.

## Related features

### Manage group member name cards

After automatic user information management is enabled, the SDK supports message-triggered automatic synchronization and updates of group member name cards. You can further implement setting, querying, and change monitoring for group member name cards. For details, see [Manage Group Member Name Cards](group_namecard.html).

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
| [`getUserInfoWithUserId`](#read-user-attributes-from-the-local-cache) / [`getUserInfoWithUserIds`](#read-user-attributes-from-the-local-cache) | `EMUserInfoManager` | Reads one or more users' attributes from the local cache. |
| [`fetchUserInfoByUserId`](#read-user-attributes-from-the-local-cache) | `EMUserInfoManager` | Retrieves one or more users' attributes from the server. |
| [`updateOwnInfo`](#user-attributes-and-user-information) | `EMUserInfoManager` | Sets or updates multiple attributes of the currently logged-in user. |
