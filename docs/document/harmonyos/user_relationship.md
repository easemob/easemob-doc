# 管理用户关系

<Toc />

用户登录后，可进行添加联系人、获取好友列表等操作。

SDK 提供用户关系管理功能，包括好友列表管理和黑名单管理：

- 好友列表管理：查询好友列表、申请添加好友、同意好友申请、拒绝好友申请、删除好友和设置好友备注等操作。
- 黑名单管理：查询黑名单列表、添加用户至黑名单以及将用户移除黑名单等操作。

此外，环信即时通信 IM 默认支持陌生人之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)[开启好友关系检查](/product/enable_and_configure_IM.html#好友关系检查)。该功能开启后，SDK 会在用户发起单聊时检查好友关系，若用户向陌生人发送单聊消息，SDK 会提示错误码 221。

## 技术原理

环信即时通讯 IM HarmonyOS SDK 提供 `ContactManager` 类实现好友的添加移除，黑名单的添加移除等功能。

- 添加、删除好友。
- 设置和获取好友备注。
- 从服务器获取好友列表。
- 将用户添加到或移除黑名单。
- 从服务器获取黑名单列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

本节展示如何在项目中管理好友的添加移除和黑名单的添加移除。

### 添加好友

添加好友部分主要功能是发送好友请求、接收好友请求、处理好友请求和好友请求处理结果回调等。

1. 申请指定用户添加好友

示例代码如下：

```TypeScript
ChatClient.getInstance().contactManager()?.addContact(toAddUsername, reason);
```

2. 添加监听

请监听与好友请求相关事件的回调，这样当用户收到好友请求，可以调用接受请求的 RESTful API 添加好友。服务器不会重复下发与好友请求相关的事件，建议退出应用时保存相关的请求数据。设置监听示例代码如下：

```TypeScript
let contactListener: ContactListener = {
  onContactAdded : (userId: string) => {
    // 增加联系人时回调此方法。
  },
  onContactDeleted : (userId: string) => {
    // 被删除联系人时回调此方法。
  },
  onContactInvited : (userId: string, reason: string) => {
    // 收到好友邀请。
  },
  onFriendRequestAccepted : (userId: string) => {
    // 好友请求被同意。
  },
  onFriendRequestDeclined : (userId: string) => {
    // 好友请求被拒绝。
  }
}
ChatClient.getInstance().contactManager()?.addContactListener(contactListener);
```

3. 收到好友请求后，可以选择同意加好友申请或者拒绝加好友申请，示例代码如下：

```TypeScript
// 同意好友申请。
ChatClient.getInstance().contactManager()?.acceptInvitation(userId).then(()=>{
    // success logic
});
// 拒绝好友申请。
ChatClient.getInstance().contactManager()?.declineInvitation(userId).then(()=>{
    // success logic
});
```

当你同意或者拒绝后，对方会通过好友事件回调，收到 `onFriendRequestAccepted` 或者 `onFriendRequestDeclined`。

### 删除好友

删除联系人时会同时删除对方联系人列表中的该用户，建议执行双重确认，以免发生误删操作。删除操作不需要对方同意或者拒绝。

示例代码如下：

```TypeScript
ChatClient.getInstance().contactManager()?.deleteContact(userId, isKeepConversation).then(()=> {
    // success logic
});
```

调用 `deleteContact` 删除好友后，对方会收到 `onContactDeleted` 回调。

### 设置好友备注

你可以调用 `setContactRemark` 方法设置单个好友的备注。

好友备注的长度不能超过 100 个字符。

```TypeScript
ChatClient.getInstance().contactManager()?.setContactRemark(userId, remark).then(()=> {
    // success logic
});
```

### 从服务端获取好友列表

你可以调用 `fetchAllContactsFromServer` 方法从服务器一次性获取好友列表，可以调用 `fetchAllContactsFromServerByPage` 方法从服务器分页获取好友列表，其中每个好友对象包含好友的用户 ID 和好友备注。

- 一次性获取服务端好友列表。

```TypeScript
ChatClient.getInstance().contactManager()?.fetchAllContactsFromServer().then(contacts => {
    // success logic
});
```

- 分页获取服务端好友列表。

```TypeScript
// limit 的取值范围为 [1,50]
let contacts = new Array<Contact>();
let cursor = "";
let limit = 20;

this.doAsyncFetchAllContactsFromServer(contacts, cursor, limit);

private doAsyncFetchAllContactsFromServer(contacts: Array<Contact>, cursor: string, limit: number) {
  ChatClient.getInstance().contactManager()?.fetchAllContactsFromServerByPage(limit, cursor).then(result => {
    let data = result.getResult();
    let resultCursor = result.getNextCursor();
    if(data && data.length > 0) {
      contacts.concat(data);
    }
    if (resultCursor) {
      this.doAsyncFetchAllContactsFromServer(contacts, cursor, limit);
    }
  });
}
```

此外，你也可以调用 `fetchAllContactsIDFromServer` 方法从服务器获取所有好友的列表，该列表只包含好友的用户 ID。

```TypeScript
ChatClient.getInstance().contactManager()?.fetchAllContactsIDFromServer().then(result => {
    // success logic
});
```

### 从本地获取好友列表

你可以调用 `getContactsFromLocal` 方法一次性获取整个好友列表，其中每个好友对象包含好友的用户 ID 和好友备注。

:::tip
需要从服务器获取好友列表之后，才能从本地获取到好友列表。
:::

- 一次性获取本地好友列表。

```TypeScript
ChatClient.getInstance().contactManager()?.getContactsFromLocal().then(result => {
    // success logic
});
```

此外，你也可以调用 `allContacts` 方法从本地一次性获取所有好友的列表，该列表只包含好友的用户 ID。

示例代码如下：

```TypeScript
ChatClient.getInstance().contactManager()?.allContacts().then(result => {
    // success logic
});
```

### 添加用户到黑名单

黑名单是与好友无任何关系的独立体系。可以将任何用户加入黑名单，不论该用户与你是否是好友关系。

黑名单功能包括加入黑名单，从黑名单移出用户和获取黑名单列表。对于获取黑名单，你可从服务器获取黑名单列表，也可从本地数据库获取已保存的黑名单列表。

你可以调用 `addUsersToBlocklist` 添加用户到黑名单。用户被加入黑名单后，无法向你发送消息，也无法发送好友申请。

用户可以将任何其他用户添加到黑名单列表，无论该用户是否是好友。好友被加入黑名单后仍在好友列表上显示。

```TypeScript
ChatClient.getInstance().contactManager()?.addUsersToBlocklist(userIds).then(()=> {
    // success logic
});
```

### 将用户从黑名单移除

你可以调用 `removeUserFromBlockList` 将用户从黑名单移除，用户发送消息等行为将恢复。

```TypeScript
ChatClient.getInstance().contactManager()?.removeUserFromBlockList(userId).then(()=> {
    // success logic
});
```

### 从服务器获取黑名单列表

你可以调用 `getBlockListFromServer` 从服务端获取黑名单列表。示例代码如下：

```TypeScript
ChatClient.getInstance().contactManager()?.getBlockListFromServer().then(result => {
    // success logic
});
```

### 从本地数据库获取黑名单列表

从服务器获取黑名单列表之后，才能从本地数据库获取到黑名单列表。

示例代码如下：

```TypeScript
ChatClient.getInstance().contactManager()?.blockList().then(result => {
    // success logic
});
```