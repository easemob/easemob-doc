# 管理用户关系

SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

- 好友管理：添加好友、处理好友申请、删除好友、设置好友备注、获取好友列表，以及在登录成功后自动同步好友列表和好友信息。
- 黑名单管理：获取黑名单列表、以及添加和移除黑名单用户。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 监听好友关系和好友信息变更

通过 `EMContactListener` 监听好友申请、接受、拒绝、添加、删除及好友信息变更事件。

```java
EMContactListener contactListener = new EMContactListener() {
    // 对方接受了好友请求。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，同意加好友，则用户 A 收到该事件。
    @Override
    public void onFriendRequestAccepted(String username) { }

    // 对方拒绝了好友请求。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，拒绝加好友，则用户 A 收到该事件。
    @Override
    public void onFriendRequestDeclined(String username) { }

    // 接收到好友请求。用户 B 向用户 A 发送好友请求，用户 A 收到该事件。
    @Override
    public void onContactInvited(String username, String reason) { }

    // 好友被删除。用户 B 将用户 A 从好友列表中删除后，用户 A 收到该事件。
    @Override
    public void onContactDeleted(String username) { }

    // 好友已添加。用户 B 向用户 A 发送好友请求，用户 A 接受后，用户 B 收到 `onFriendRequestAccepted` 事件，双方用户收到 `onContactAdded` 事件。
    @Override
    public void onContactAdded(String username) { }

    // 好友信息发生变更，可通过 contact 获取更新后的好友信息。
    @Override
    public void onContactInfoUpdate(EMContact contact) { }
};

// 注册好友关系和好友信息变更监听器。
EMClient.getInstance().contactManager().setContactListener(contactListener);

// 不再需要监听时，移除监听器。
EMClient.getInstance().contactManager().removeContactListener(contactListener);
```

### 添加好友

添加好友用于建立稳定的单聊关系。对方接受申请后，双方成为彼此的好友。当前 SDK 仅支持双向好友关系，不支持单向好友或关注关系。

典型流程如下：

1. 调用 `asyncAddContact` 发起好友申请。
2. 对方通过 `onContactInvited` 收到申请，并选择接受或拒绝。
3. 若对方接受，双方建立好友关系；若对方拒绝，本次申请结束。

你可以调用 `asyncAddContact` 发起好友申请：

```java
// 异步方法。
EMClient.getInstance().contactManager().asyncAddContact(toAddUsername, reason, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
    }
});
```

接收方会通过 `onContactInvited` 回调收到该申请，可按需接受或拒绝：

- 调用 `asyncAcceptInvitation` 接受好友申请。请求方会收到 `onFriendRequestAccepted`，双方都会收到 `onContactAdded`。
- 调用 `asyncDeclineInvitation` 拒绝好友申请。请求方会收到 `onFriendRequestDeclined`。

```java
// 异步方法。
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
// 异步方法。
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
- 服务器不会重复下发好友申请事件。若业务需要展示待处理申请列表，建议在收到 `onContactInvited` 时本地保存申请记录。
- 当前 SDK 不提供好友申请列表拉取接口。
:::

### 删除好友

调用 `asyncDeleteContact` 删除好友。删除好友后，对方好友列表中的该用户也会被移除，双方的好友关系都会解除，对方会收到 `onContactDeleted` 事件。该删除操作无需对方确认，建议在应用侧增加二次确认。

```java
String username = "userId";

EMClient.getInstance()
        .contactManager()
        .asyncDeleteContact(
                username,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 好友删除成功。
                        // 对应的本地单聊会话及本地消息也会被删除。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 好友删除失败，根据错误码和错误信息进行处理。
                    }
                });
```

`asyncDeleteContact` 不提供 `keepConversation` 参数，调用成功后，SDK 默认删除与该好友对应的本地单聊会话及本地消息。如果需要保留本地会话及消息，需调用同步方法 `deleteContact`，并将 `keepConversation` 设置为 `true`；设置为 `false` 时会同时删除对应的本地会话及消息。

```java
try {
    EMClient.getInstance()
            .contactManager()
            .deleteContact(username, true);
} catch (HyphenateException e) {
    // 根据异常信息进行处理。
}
```

### 设置好友备注

你可以调用 `asyncSetContactRemark` 设置单个好友的备注。

```java
// 好友备注长度不能超过 100 个字符。传入空字符串清空好友备注。
EMClient.getInstance().contactManager().asyncSetContactRemark(userId, remark, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int code, String error) {
        
    }
});
```

### 获取好友列表和好友信息

#### 登录后自动同步好友列表

SDK 通过自动同步获取最新好友数据。你需要在初始化 SDK 前配置 `EMDataSyncType.CONTACTS`。用户登录成功后，SDK 会自动从服务器同步好友列表及好友信息并写入本地。当 `onDataSyncFinish` 回调中的 `type` 为 `EMDataSyncType.CONTACTS` 且 `errorCode` 为 `EMError.EM_NO_ERROR` 时，表示好友数据同步成功，此时可以通过本地接口读取好友列表和好友信息。

**开启好友数据自动同步**

在调用 `EMClient#init` 初始化 SDK 前，通过 `EMOptions#setDataSyncType` 配置 `EMDataSyncType.CONTACTS`。用户登录成功后，SDK 会自动同步好友列表及好友信息并写入本地。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONTACTS
));

EMClient.getInstance().init(getApplicationContext(), options);
```

**监听好友数据同步状态**

开启自动同步后，通过 `EMConnectionListener` 监听好友数据同步的开始和完成。

- `onDataSyncStart(EMDataSyncType type)`：某类数据开始同步时触发；`type` 为 `CONTACTS` 时表示好友数据开始同步。
- `onDataSyncFinish(EMDataSyncType type, int errorCode)`：某类数据同步完成时触发；`type` 为 `CONTACTS` 时表示好友数据同步结束，`errorCode == EMError.EM_NO_ERROR` 表示成功。
- 好友关系及好友信息变更由 `EMContactListener` 监听，详见 [监听好友关系和好友信息变更](#监听好友关系和好友信息变更)。
- 关于不同场景下好友的用户属性变更通知机制，详见[监听用户属性变更](userprofile.html#监听用户属性变更)。

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
        // SDK 已成功连接到 IM 服务器。
    }

    @Override
    public void onDisconnected(int errorCode) {
        // SDK 与 IM 服务器断开连接，可根据 errorCode 判断断开原因。
    }

    @Override
    public void onDataSyncStart(EMOptions.EMDataSyncType type) {
        if (type == EMOptions.EMDataSyncType.CONTACTS) {
            // 好友数据开始同步。
        }
    }

    @Override
    public void onDataSyncFinish(EMOptions.EMDataSyncType type, int errorCode) {
        if (type != EMOptions.EMDataSyncType.CONTACTS) {
            return;
        }

        if (errorCode == EMError.EM_NO_ERROR) {
            // 好友数据同步成功，可以从本地读取好友列表和好友信息。
        } else {
            // 好友数据同步失败，根据 errorCode 处理错误。
        }
    }
};

// 注册连接及数据同步状态监听器。
EMClient.getInstance().addConnectionListener(connectionListener);

// 不再需要监听时，移除监听器。
EMClient.getInstance().removeConnectionListener(connectionListener);
```

#### 从本地读取好友列表

好友数据同步成功后，可以调用以下接口读取本地数据：

- `asyncFetchAllContactsFromLocal`：异步获取本地全部好友对象。
- `fetchContactFromLocal`：同步获取指定好友对象。
- `getContactsFromLocal`：同步获取本地全部好友的用户 ID。

异步获取本地全部好友对象：

```java
EMClient.getInstance()
        .contactManager()
        .asyncFetchAllContactsFromLocal(
                new EMValueCallBack<List<EMContact>>() {
                    @Override
                    public void onSuccess(List<EMContact> contacts) {
                        // contacts 为本地好友对象列表。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

同步获取指定好友对象：

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

`EMContact` 提供以下好友信息：

- `getUsername()`：获取好友用户 ID。
- `getRemark()`：获取好友备注。
- `getUserInfo()`：从本地获取好友的用户属性；本地不存在相关属性时可能返回 `null`。
- `getAddTimestamp()`：获取好友添加时间的毫秒级时间戳；当前对象不包含该信息时返回 `0`。

同步获取本地全部好友的用户 ID：

```java
try {
    List<String> userIds = EMClient.getInstance()
            .contactManager()
            .getContactsFromLocal();
} catch (HyphenateException e) {
    Log.e("Contact", "获取本地好友列表失败", e);
}
```

#### 从本地内存获取单个用户属性

如果需要直接从本地内存读取指定用户的属性，可以调用 `EMUserInfoManager#getUserInfoWithUserId(String)`。关于该接口的说明，详见 [从本地内存读取用户属性](userinfo_provider.html#从本地内存读取用户属性)。

该接口返回的是单个用户的 `EMUserInfo`，不是 `EMContact`。它不会发起网络请求，可作为好友列表读取之外的补充资料读取方式。

### 设置仅给好友发消息

环信即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。开启后，SDK 会在用户发起单聊时检查好友关系；若用户向非好友用户发送单聊消息，SDK 会返回错误码 `221`。

## 黑名单管理

黑名单与好友体系相互独立，主要用于管理需要屏蔽的用户。

### 添加用户到黑名单

若需屏蔽某个用户的消息，可将其加入黑名单。该操作适用于任何用户，无论是否为好友。被加入黑名单后，该用户将无法向你发送消息或好友申请。

若被加入黑名单的是好友，其好友关系仍会保留在你的好友列表中。

你可以调用 `addUserToBlackList` 将用户加入黑名单：

```java
// 异步方法。同步方法为 addUserToBlackList，会阻塞当前线程
// 第二个参数已废弃，不再具有业务语义。
EMClient.getInstance()
        .contactManager()
        .asyncAddUserToBlackList(
                username,
                false,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 用户加入黑名单成功。
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

### 将用户从黑名单移除

你可以调用 `removeUserFromBlackList` 将用户从黑名单中移除。移除后，用户发送消息等行为将恢复。

```java
// 异步方法。
// 同步方法为 removeUserFromBlackList，会阻塞当前线程。
EMClient.getInstance()
        .contactManager()
        .asyncRemoveUserFromBlackList(
                username,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 用户移出黑名单成功。
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

### 从服务器获取黑名单列表

你可以调用 `getBlackListFromServer` 从服务器获取黑名单列表：

```java
// 异步方法。
// 同步方法为 getBlackListFromServer，会阻塞当前线程。
EMClient.getInstance()
        .contactManager()
        .asyncGetBlackListFromServer(
                new EMValueCallBack<List<String>>() {
                    @Override
                    public void onSuccess(
                            List<String> blockedUserIds) {
                        // 成功获取服务端黑名单列表。
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

### 从本地数据库获取黑名单列表

`getBlackListUsernames` 用于读取本地数据库中的黑名单列表。若需要确保数据为服务端最新状态，可先调用 `getBlackListFromServer` 更新本地数据，再进行读取。

```java
EMClient.getInstance().contactManager().getBlackListUsernames();
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncAddContact`](#添加好友) | `EMContactManager` | 异步发起好友申请。 |
| [`asyncAcceptInvitation`](#添加好友) / [`asyncDeclineInvitation`](#添加好友) | `EMContactManager` | 异步接受或拒绝好友申请。 |
| [`asyncDeleteContact`](#删除好友) / [`deleteContact`](#删除好友) | `EMContactManager` | 异步或同步删除好友；仅同步双参数方法可设置是否保留本地会话和消息。 |
| [`asyncSetContactRemark`](#设置好友备注) | `EMContactManager` | 设置好友备注。 |
| [`setDataSyncType`](#登录后自动同步好友列表) | `EMOptions` | 设置登录后自动同步的数据类型。 |
| [`asyncFetchAllContactsFromLocal`](#从本地读取好友列表) | `EMContactManager` | 异步获取本地全部好友对象。 |
| [`fetchContactFromLocal`](#从本地读取好友列表) / [`getContactsFromLocal`](#从本地读取好友列表) | `EMContactManager` | 同步读取本地好友信息或用户 ID 列表。 |
| [`getUserInfoWithUserId`](#从本地内存获取单个用户属性) | `EMUserInfoManager` | 从本地内存读取单个用户属性。 |
| [`asyncAddUserToBlackList`](#添加用户到黑名单) / [`addUserToBlackList`](#添加用户到黑名单) | `EMContactManager` | 异步或同步将用户加入黑名单。 |
| [`asyncRemoveUserFromBlackList`](#将用户从黑名单移除) / [`removeUserFromBlackList`](#将用户从黑名单移除) | `EMContactManager` | 异步或同步将用户移出黑名单。 |
| [`asyncGetBlackListFromServer`](#从服务器获取黑名单列表) / [`getBlackListFromServer`](#从服务器获取黑名单列表) | `EMContactManager` | 异步或同步从服务器获取黑名单列表。 |
| [`getBlackListUsernames`](#从本地数据库获取黑名单列表) | `EMContactManager` | 从本地数据库读取黑名单列表。 |
| [`getDataSyncType`](#登录后自动同步好友列表) | `EMOptions` | 获取当前配置的自动同步数据类型。 |
