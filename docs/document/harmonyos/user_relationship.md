# 管理用户关系

SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

- 好友管理：添加好友、处理好友申请、删除好友、设置好友备注、获取好友列表。
- 黑名单管理：获取黑名单列表、以及添加和移除黑名单用户。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

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
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 添加好友事件监听

为了接收好友添加、删除和好友申请状态的变更事件，你需要添加好友事件监听。

```typescript
let contactListener: ContactListener = {
  onContactAdded : (userId: string) => {
    // 增加好友时回调此方法。
  },
  onContactDeleted : (userId: string) => {
    // 被删除好友时回调此方法。
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


### 添加好友

添加好友用于建立稳定的单聊关系。对方接受申请后，双方成为彼此的好友。当前 SDK 仅支持双向好友关系，不支持单向好友或关注关系。

典型流程如下：

1. 调用 `addContact` 发起好友申请。
2. 对方通过 `onContactInvited` 收到申请，并选择接受或拒绝。
3. 若对方接受，双方建立好友关系；若对方拒绝，本次申请结束。

你可以调用 `addContact` 发起好友申请：

```typescript
ChatClient.getInstance().contactManager()?.addContact(toAddUsername, reason);
```

接收方会通过 `onContactInvited` 回调收到该申请，可按需接受或拒绝：

- 调用 `acceptInvitation` 接受好友申请。请求方会收到 `onFriendRequestAccepted`，双方都会收到 `onContactAdded`。
- 调用 `declineInvitation` 拒绝好友申请。请求方会收到 `onFriendRequestDeclined`。

```typescript
ChatClient.getInstance().contactManager()?.acceptInvitation(userId).then(()=>{
    // success logic
});
```

```typescript
ChatClient.getInstance().contactManager()?.declineInvitation(userId).then(()=>{
    // success logic
});
```

:::tip

- 服务器不会重复下发好友申请事件。若业务需要展示待处理申请列表，建议在收到 `onContactInvited` 时本地保存申请记录。
- 当前 SDK 不提供好友申请列表拉取接口。
:::

### 删除好友

调用 `deleteContact` 删除好友后，对方好友列表中的该用户也会被移除。该操作无需对方确认，建议在应用侧增加二次确认。

```typescript
ChatClient.getInstance().contactManager()?.deleteContact(userId, isKeepConversation).then(()=> {
    // success logic
});
```

删除后，对方会收到 `onContactDeleted` 事件。

### 设置好友备注

你可以调用 `setContactRemark` 方法设置单个好友的备注。

好友备注的长度不能超过 100 个字符。

```typescript
ChatClient.getInstance().contactManager()?.setContactRemark(userId, remark).then(()=> {
    // success logic
});
```

### 获取好友列表和好友信息

### 从服务端获取好友列表

你可以调用 `fetchAllContactsFromServer` 方法从服务器一次性获取好友列表，可以调用 `fetchAllContactsFromServerByPage` 方法从服务器分页获取好友列表，其中每个好友对象包含好友的用户 ID 和好友备注。

- 一次性获取服务端好友列表。

```typescript
ChatClient.getInstance().contactManager()?.fetchAllContactsFromServer().then(contacts => {
    // success logic
});
```

- 分页获取服务端好友列表。

```typescript
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

```typescript
ChatClient.getInstance().contactManager()?.fetchAllContactsIDFromServer().then(result => {
    // success logic
});
```

### 从本地获取好友列表

你可以调用 `getContactsFromLocal` 方法一次性获取整个好友列表，其中每个好友对象包含好友的用户 ID 和好友备注。

自 1.5.3 版本开始，你可以调用 `getContact` 方法从本地获取单个好友的用户 ID 和好友备注。

:::tip
需要先从服务器获取好友列表，才能从本地读取到好友列表。
:::

- 本地获取单个好友。

```typescript
ChatClient.getInstance().contactManager()?.getContact(this.contactId).then((contact) => {
  if (contact) {
    let remark = contact.remark();
    let username = contact.userId();
  }
}).catch((e: ChatError) => {
  // failure logic
});
```

- 一次性获取本地好友列表。

```typescript
ChatClient.getInstance().contactManager()?.getContactsFromLocal().then(result => {
    // success logic
});
```

此外，你也可以调用 `allContacts` 方法从本地一次性获取所有好友的列表，该列表只包含好友的用户 ID。

示例代码如下：

```typescript
ChatClient.getInstance().contactManager()?.allContacts().then(result => {
    // success logic
});
```

### 设置仅给好友发消息

环信即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。开启后，SDK 会在用户发起单聊时检查好友关系；若用户向非好友用户发送单聊消息，SDK 会返回错误码 `221`。

## 黑名单管理

### 添加用户到黑名单

黑名单是与好友无任何关系的独立体系。可以将任何用户加入黑名单，不论该用户与你是否是好友关系。

黑名单功能包括加入黑名单，从黑名单移出用户和获取黑名单列表。对于获取黑名单，你可从服务器获取黑名单列表，也可从本地数据库获取已保存的黑名单列表。

你可以调用 `addUsersToBlocklist` 添加用户到黑名单。用户被加入黑名单后，无法向你发送消息，也无法发送好友申请。

用户可以将任何其他用户添加到黑名单列表，无论该用户是否是好友。好友被加入黑名单后仍在好友列表上显示。

```typescript
ChatClient.getInstance().contactManager()?.addUsersToBlocklist(userIds).then(()=> {
    // success logic
});
```

### 将用户从黑名单移除

你可以调用 `removeUserFromBlockList` 将用户从黑名单移除，用户发送消息等行为将恢复。

```typescript
ChatClient.getInstance().contactManager()?.removeUserFromBlockList(userId).then(()=> {
    // success logic
});
```

### 从服务器获取黑名单列表

你可以调用 `getBlockListFromServer` 从服务端获取黑名单列表。示例代码如下：

```typescript
ChatClient.getInstance().contactManager()?.getBlockListFromServer().then(result => {
    // success logic
});
```

### 从本地数据库获取黑名单列表

从服务器获取黑名单列表之后，才能从本地数据库获取到黑名单列表。

示例代码如下：

```typescript
ChatClient.getInstance().contactManager()?.blockList().then(result => {
    // success logic
});
```