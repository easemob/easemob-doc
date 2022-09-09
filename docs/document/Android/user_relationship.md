# 用户关系管理

<Toc />

用户登录后，可进行添加联系人、获取好友列表等操作。
本文介绍如何通过环信即时通讯 IM SDK 管理好友关系，包括添加、同意、拒绝、删除、查询好友，以及管理黑名单，包括添加、移出、查询黑名单。

SDK 提供用户关系管理功能，包括好友列表管理和黑名单管理：

- 好友列表管理：查询好友列表、申请添加好友、同意好友申请、拒绝好友申请和删除好友等操作。
- 黑名单管理：查询黑名单列表、添加用户至黑名单以及将用户移除黑名单等操作。

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMContactManager` 类实现好友的添加移除，黑名单的添加移除等功能。主要方法如下：

- `addContact` 申请添加好友。
- `acceptInvitation` 同意好友申请。
- `declineInvitation` 拒绝好友申请。
- `deleteContact` 删除好友。
- `getAllContactsFromServer` 从服务器获取好友列表。
- `addUserToBlackList` 添加用户到黑名单。
- `removeUserFromBlackList` 将用户从黑名单移除。
- `getBlackListFromServer` 从服务器获取黑名单列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

本节展示如何在项目中管理好友的添加移除和黑名单的添加移除。

### 添加好友

好友申请部分主要功能是发送好友请求、接收好友请求、处理好友请求和好友请求处理结果回调等。

1. 申请指定用户添加好友

示例代码如下：

```java
// 添加好友。
EMClient.getInstance().contactManager().addContact(toAddUsername, reason);
```

2. 添加监听

请监听与好友请求相关事件的回调，这样当用户收到好友请求，可以调用接受请求的 RESTful API 添加好友。服务器不会重复下发与好友请求相关的事件，建议退出应用时保存相关的请求数据。设置监听示例代码如下：

```java
EMClient.getInstance().contactManager().setContactListener(new EMContactListener() {
    // 对方同意了好友请求。
    @Override
    public void onFriendRequestAccepted(String username) { }

    // 对方拒绝了好友请求。
    @Override
    public void onFriendRequestDeclined(String username) { }

    // 接收到好友请求。
    @Override
    public void onContactInvited(String username, String reason) { }

    // 联系人被删除。
    @Override
    public void onContactDeleted(String username) { }

    // 联系人已添加。
    @Override
    public void onContactAdded(String username) { }
});
```

3. 收到好友请求后，可以选择同意加好友申请或者拒绝加好友申请，示例代码如下：

```java
// 同意好友申请。
EMClient.getInstance().contactManager().acceptInvitation(username);
// 拒绝好友申请。
EMClient.getInstance().contactManager().declineInvitation(username);
```

当你同意或者拒绝后，对方会通过好友事件回调，收到 `onContactAgreed` 或者 `onContactRefused`。

### 删除好友

删除联系人时会同时删除对方联系人列表中的该用户，建议执行双重确认，以免发生误删操作。删除操作不需要对方同意或者拒绝。

示例代码如下：

```java
EMClient.getInstance().contactManager().deleteContact(username);
```

调用 `deleteContact` 删除好友后，对方会收到 `onContactDeleted` 回调。

### 获取好友列表

你可以从服务器获取好友列表，也可以从本地数据库获取已保存的好友列表。

:::notice
需要从服务器获取好友列表之后，才能从本地数据库获取到好友列表。
:::

示例代码如下：

```java
// 从服务器获取好友列表。
List<String> usernames = EMClient.getInstance().contactManager().getAllContactsFromServer();
// 从本地数据库获取好友列表。
List<String> usernames = EMClient.getInstance().contactManager().getContactsFromLocal();
```
### 添加用户到黑名单

将指定用户加入黑名单后，对方将无法给你发送消息。黑名单部分主要功能是获取黑名单列表、添加用户至黑名单以及将用户从黑名单移除等。获取黑名单时，可从服务器获取黑名单列表，也可从本地数据库获取已保存的黑名单列表。

黑名单是与好友无任何关系的独立体系。可以将任何用户加入黑名单，不论该用户与你是否是好友关系。好友加入黑名单后仍在好友列表上显示。

你可以调用 `addUserToBlackList` 添加用户到黑名单，示例代码如下：

```java
EMClient.getInstance().contactManager().addUserToBlackList(username,true);
```

### 将用户从黑名单移除

你可以调用 `removeUserFromBlackList` 将用户从黑名单移除，示例代码如下：

```java
EMClient.getInstance().contactManager().removeUserFromBlackList(username);
```

### 查看当前用户黑名单列表

#### 从服务器获取黑名单列表

你可以调用 `getBlackListFromServer` 从服务端获取黑名单列表。示例代码如下：

```java
EMClient.getInstance().contactManager().getBlackListFromServer();
```

#### 从本地数据库获取黑名单列表

从服务器获取黑名单列表之后，才能从本地数据库获取到黑名单列表。

示例代码如下：

```java
EMClient.getInstance().contactManager().getBlackListUsernames();
```