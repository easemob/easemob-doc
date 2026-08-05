# 管理用户关系

SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

- 好友管理：添加好友、处理好友申请、删除好友、设置好友备注、获取好友列表，以及在登录成功后自动同步好友列表和好友信息。
- 黑名单管理：获取黑名单列表、以及添加和移除黑名单用户。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 技术原理

环信即时通讯 IM Android SDK 通过 [EMContactManager](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_contact_manager.html) 提供好友和黑名单相关功能。

- `EMContactManager#addContact/deleteContact`：添加和删除好友。
- `EMContactManager#asyncSetContactRemark`：设置好友备注。
- `EMContactManager#asyncFetchAllContactsFromServer`：从服务器获取好友列表。
- `EMContactManager#fetchContactFromLocal`：从本地获取好友信息。
- `EMOptions#setEnableAutoSyncContacts`：设置是否在登录成功后自动同步好友列表。
- `EMContactListener#onContactSyncStart/onContactSyncFinishWithError`：监听好友列表及好友信息的同步状态。
- `EMContactListener#onContactInfoUpdate`：监听好友信息变更。
- `EMContactManager#addUserToBlackList/removeUserFromBlackList`：添加或移除黑名单用户。
- `EMContactManager#getBlackListFromServer`：从服务器获取黑名单列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 添加好友事件监听

为了接收好友添加、删除和好友申请状态的变更事件，你需要添加好友事件监听。

```java
EMClient.getInstance().contactManager().setContactListener(new EMContactListener() {
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
});
```

### 添加好友

添加好友用于建立稳定的单聊关系。对方接受申请后，双方成为彼此的好友。当前 SDK 仅支持双向好友关系，不支持单向好友或关注关系。

典型流程如下：

1. 调用 `addContact` 发起好友申请。
2. 对方通过 `onContactInvited` 收到申请，并选择接受或拒绝。
3. 若对方接受，双方建立好友关系；若对方拒绝，本次申请结束。

你可以调用 `addContact` 发起好友申请：

```java
// 添加好友。
// 同步方法，会阻塞当前线程。异步方法为 asyncAddContact(String, String, EMCallBack)。
EMClient.getInstance().contactManager().addContact(toAddUsername, reason);
```

接收方会通过 `onContactInvited` 回调收到该申请，可按需接受或拒绝：

- 调用 `acceptInvitation` 接受好友申请。请求方会收到 `onFriendRequestAccepted`，双方都会收到 `onContactAdded`。
- 调用 `declineInvitation` 拒绝好友申请。请求方会收到 `onFriendRequestDeclined`。

```java
// 同步方法，会阻塞当前线程。异步方法为 asyncAcceptInvitation(String, EMCallBack)。
EMClient.getInstance().contactManager().acceptInvitation(username);
```

```java
// 同步方法，会阻塞当前线程。异步方法为 asyncDeclineInvitation(String, EMCallBack)。
EMClient.getInstance().contactManager().declineInvitation(username);
```

:::tip

- 服务器不会重复下发好友申请事件。若业务需要展示待处理申请列表，建议在收到 `onContactInvited` 时本地保存申请记录。
- 当前 SDK 不提供好友申请列表拉取接口。
:::

### 删除好友

调用 `deleteContact` 删除好友后，对方好友列表中的该用户也会被移除。该操作无需对方确认，建议在应用侧增加二次确认。

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncDeleteContact(String, EMCallBack)。
EMClient.getInstance().contactManager().deleteContact(username);
```

删除后，对方会收到 `onContactDeleted` 事件。

### 设置好友备注

自 4.2.1 版本开始，你可以调用 `asyncSetContactRemark` 设置单个好友的备注。

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

#### 从服务器获取好友列表

自 4.2.1 版本开始，你可以调用 `asyncFetchAllContactsFromServer` 从服务器一次性或分页获取好友列表。

返回结果中的每个好友对象均为 `EMContact`。你可以通过该对象获取好友用户 ID 和好友备注；自 4.22.0 起，还可以进一步获取好友用户属性和好友添加时间。

- `getUsername()`：获取好友用户 ID。
- `getRemark()`：获取好友备注。
- `getUserInfo()`：获取好友的用户属性，自 4.22.0 起支持。
- `getAddTimestamp()`：获取好友添加时间，自 4.22.0 起支持。

- 一次性获取好友列表：

```java
EMClient.getInstance().contactManager().asyncFetchAllContactsFromServer(new EMValueCallBack<List<EMContact>>() {
    @Override
    public void onSuccess(List<EMContact> value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {
        
    }
});
```

- 分页获取好友列表：

```java
// limit 的取值范围为 [1,50]
List<EMContact> contacts=new ArrayList<>();
String cursor= "";
int limit=20;
doAsyncFetchAllContactsFromServer(contacts,cursor,limit);

private void doAsyncFetchAllContactsFromServer(List<EMContact> contacts, String cursor, int limit) {
    EMClient.getInstance().contactManager().asyncFetchAllContactsFromServer(limit, cursor, new EMValueCallBack<EMCursorResult<EMContact>>() {
        @Override
        public void onSuccess(EMCursorResult<EMContact> value) {
            List<EMContact> data = value.getData();
            String resultCursor = value.getCursor();
            if(!CollectionUtils.isEmpty(data)) {
                contacts.addAll(data);
            }
            if(!TextUtils.isEmpty(resultCursor)) {
                doAsyncFetchAllContactsFromServer(contacts, resultCursor, limit);
            }
        }

        @Override
        public void onError(int error, String errorMsg) {
            
        }
    });
```

此外，你也可以调用 `getAllContactsFromServer` 从服务器获取所有好友的用户 ID：

```java
// 同步方法，会阻塞当前线程。异步方法为 asyncGetAllContactsFromServer(EMValueCallBack)。
List<String> usernames = EMClient.getInstance().contactManager().getAllContactsFromServer();
```

#### 从本地获取好友列表

自 4.2.1 版本开始，你可以调用 `fetchContactFromLocal` 获取单个好友。

本地好友列表中的每个好友对象同样为 `EMContact`。除了 `getUsername()` 和 `getRemark()`，自 4.22.0 起，还可以通过 `getUserInfo()` 和 `getAddTimestamp()` 读取更多好友资料。

- `getUsername()`：获取好友用户 ID。
- `getRemark()`：获取好友备注。
- `getUserInfo()`：获取好友的用户信息，自 4.22.0 起支持。
- `getAddTimestamp()`：获取好友添加时间，自 4.22.0 起支持。
  
此外，你也可以调用 `asyncFetchAllContactsFromLocal` 或 `getContactsFromLocal` 一次性获取本地好友列表。

:::tip
需要先从服务器获取好友列表，才能从本地读取到好友列表。
:::


- 获取本地单个好友：

```java
try {
    EMContact emContact = EMClient.getInstance().contactManager().fetchContactFromLocal(userId);
    String remark = emContact.getRemark();
    String username = emContact.getUsername();
    EMLog.e(TAG, "fetchContactFromLocal success, username:" + username + ",remark:" + remark);
} catch (HyphenateException e) {
    EMLog.e(TAG, "fetchContactFromLocal error:" + e.getMessage());
};
```

- 一次性获取本地好友列表：

```java
EMClient.getInstance().contactManager().asyncFetchAllContactsFromLocal(new EMValueCallBack<List<EMContact>>() {
    @Override
    public void onSuccess(List<EMContact> value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {
        
    }
});
```

此外，你也可以调用 `getContactsFromLocal` 从本地一次性获取所有好友的用户 ID：

```java
List<String> usernames = EMClient.getInstance().contactManager().getContactsFromLocal();
```

#### 从本地内存获取单个用户属性

如果需要直接从本地内存读取指定用户的属性，可以调用 `EMUserInfoManager#getUserInfoWithUserId(String)`。关于该接口的说明，详见 [从本地内存读取用户属性](userinfo_provider.html#从本地内存读取用户属性)。

该接口返回的是单个用户的 `EMUserInfo`，不是 `EMContact`。它不会发起网络请求，可作为好友列表读取之外的补充资料读取方式。

### 登录后自动同步好友列表

#### 开启自动同步

自 4.22.0 版本开始，你可以设置在登录成功后自动同步好友列表及好友信息。开启后，SDK 会在登录完成后自动拉取并更新本地好友数据，便于应用直接读取最新的好友列表和好友信息。

你可以通过以下接口配置该功能：

- `EMOptions#setEnableAutoSyncContacts(boolean)`：设置是否开启登录后自动同步好友列表。
- `EMOptions#isEnableAutoSyncContacts()`：获取当前是否开启该功能。

```java
EMOptions options = new EMOptions();
options.setEnableAutoSyncContacts(true);
boolean enableAutoSyncContacts = options.isEnableAutoSyncContacts();
```

#### 监听同步状态和好友信息变更

开启自动同步后，建议通过 `EMContactListener` 监听好友同步开始、同步完成以及好友信息变更等事件，以便及时更新 UI 或处理异常情况。

- `onContactSyncStart()`：好友列表及好友信息开始同步时触发。
- `onContactSyncFinishWithError(int errorCode, String error)`：好友列表及好友信息同步完成时触发。若同步失败，可通过 `errorCode` 和 `error` 获取失败原因。
- `onContactInfoUpdate(EMContact contact)`：好友信息发生变更时触发。你可以通过 `contact` 获取更新后的好友信息。

关于不同场景下好友的用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。

```java
EMClient.getInstance().contactManager().setContactListener(new EMContactListener() {
    @Override
    public void onContactSyncStart() {
    }

    @Override
    public void onContactSyncFinishWithError(int errorCode, String error) {
    }

    @Override
    public void onContactInfoUpdate(EMContact contact) {
    }
});
```

### 设置仅给好友发消息

环信即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。开启后，SDK 会在用户发起单聊时检查好友关系；若用户向非好友用户发送单聊消息，SDK 会返回错误码 `221`。

## 黑名单管理

黑名单与好友体系相互独立，主要用于管理需要屏蔽的用户。

### 添加用户到黑名单

若需屏蔽某个用户的消息，可将其加入黑名单。该操作适用于任何用户，无论是否为好友。被加入黑名单后，该用户将无法向你发送消息或好友申请。

若被加入黑名单的是好友，其好友关系仍会保留在你的好友列表中。

你可以调用 `addUserToBlackList` 将用户加入黑名单：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncAddUserToBlackList(String, boolean, EMCallBack)。
EMClient.getInstance().contactManager().addUserToBlackList(username,true);
```

### 将用户从黑名单移除

你可以调用 `removeUserFromBlackList` 将用户从黑名单中移除。移除后，用户发送消息等行为将恢复。

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncRemoveUserFromBlackList(String, EMCallBack)。
EMClient.getInstance().contactManager().removeUserFromBlackList(username);
```

### 从服务器获取黑名单列表

你可以调用 `getBlackListFromServer` 从服务器获取黑名单列表：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncGetBlackListFromServer(EMValueCallBack)。
EMClient.getInstance().contactManager().getBlackListFromServer();
```

### 从本地数据库获取黑名单列表

需要先从服务器获取黑名单列表，才能从本地数据库读取到黑名单列表。

```java
EMClient.getInstance().contactManager().getBlackListUsernames();
```
