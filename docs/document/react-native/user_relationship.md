# 管理用户关系

<Toc />

用户登录后，可进行添加联系人、获取好友列表等操作。

SDK 提供用户关系管理功能，包括好友列表管理和黑名单管理：

- 好友列表管理：查询好友列表、申请添加好友、同意好友申请、拒绝好友申请和删除好友等操作。
- 黑名单管理：查询黑名单列表、添加用户至黑名单以及从黑名单中移出用户等操作。

本文介绍如何通过环信即时通讯 IM React Native SDK 实现上述功能。

## 技术原理

环信即时通讯 IM React Native SDK 提供 `ChatContactManager` 类实现好友的添加移除，黑名单的添加移除等功能。主要方法如下：

- `addContact` 申请添加好友。
- `deleteContact` 删除好友。
- `acceptInvitation` 同意好友申请。
- `declineInvitation` 拒绝好友申请。
- `getAllContactsFromServer` 从服务器获取好友列表。
- `getAllContactsFromDB` 从缓存获取好友列表。
- `addUserToBlockList` 添加用户到黑名单。
- `removeUserFromBlockList` 将用户从黑名单移除。
- `getBlockListFromServer` 从服务器获取黑名单列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 添加好友

1. 用户添加指定用户为好友

```typescript
// 用户 ID
const userId = "foo";
// 申请加为好友的理由
const reason = "Request to add a friend.";
ChatClient.getInstance()
  .contactManager.addContact(userId, reason)
  .then(() => {
    console.log("request send success.");
  })
  .catch((reason) => {
    console.log("request send fail.", reason);
  });
```

2. 对方收到申请，同意成为好友，或者拒绝成为好友

同意成为好友：

```typescript
// 用户 ID
const userId = "bar";
ChatClient.getInstance()
  .contactManager.acceptInvitation(userId)
  .then(() => {
    console.log("accept request success.");
  })
  .catch((reason) => {
    console.log("accept request fail.", reason);
  });
```

拒绝成为好友：

```typescript
// 用户 ID
const userId = "bar";
ChatClient.getInstance()
  .contactManager.declineInvitation(userId)
  .then(() => {
    console.log("decline request success.");
  })
  .catch((reason) => {
    console.log("decline request fail.", reason);
  });
```

3. 接收方对于同意，申请方收到监听事件 `onContactInvited`

```typescript
const contactEventListener = new (class implements ChatContactEventListener {
  that: any;
  constructor(parent: any) {
    this.that = parent;
  }
  onContactInvited(userId: string, reason?: string): void {
    console.log(`onContactInvited: ${userId}, ${reason}: `);
  }
})(this);
ChatClient.getInstance().contactManager.addContactListener(
  contactEventListener
);
```

4. 对方拒绝，收到监听事件 `onFriendRequestDeclined`

```typescript
const contactEventListener = new (class implements ChatContactEventListener {
  that: any;
  constructor(parent: any) {
    this.that = parent;
  }
  onFriendRequestDeclined(userId: string): void {
    console.log(`onFriendRequestDeclined: ${userId}: `);
  }
})(this);
ChatClient.getInstance().contactManager.addContactListener(
  contactEventListener
);
```

### 删除好友

删除好友时会同时删除对方联系人列表中的该用户，建议执行双重确认，以免发生误删操作。删除操作不需要对方同意或者拒绝。

```typescript
// 用户 ID
const userId = "tom";
// 是否保留聊天会话
const keepConversation = true;
ChatClient.getInstance()
  .contactManager.deleteContact(userId, keepConversation)
  .then(() => {
    console.log("remove success.");
  })
  .catch((reason) => {
    console.log("remove fail.", reason);
  });
```

#### 设置好友备注

自 1.3.0 版本开始，你可以调用 `setContactRemark` 方法设置单个好友的备注。

好友备注的长度不能超过 100 个字符。

```typescript
ChatClient.getInstance()
  .contactManager.setContactRemark({ userId: "xxx", remark: "user remark" })
  .then()
  .catch();
```

#### 从服务端获取好友列表

自 1.3.0 版本开始，你可以调用 `fetchAllContacts` 或者 `fetchContacts` 方法从服务器一次性或分页获取好友列表，其中每个好友对象包含好友的用户 ID 和好友备注。

- 一次性获取服务端好友列表。

```typescript
ChatClient.getInstance()
  .contactManager.fetchAllContacts()
  .then((contactList: Contact[]) => {
    // todo: 从服务器返回所有的联系人列表。包括好友备注信息。
  })
  .catch();
```

- 分页获取服务端好友列表。

```typescript
// cursor 数据获取的起始位置，获取第一页设置为 `空字符串` 或者 `undefined`。
// pageSize 获取每页的最大数目,取值范围为 [1,50]。
ChatClient.getInstance()
  .contactManager.fetchContacts({
    cursor: undefined,
    pageSize: 20,
  })
  .then((contactList: Contact[]) => {
    // todo: 从服务器返回所有的联系人列表。包括好友备注信息。
  })
  .catch();
```

此外，你也可以调用 `getAllContactsFromServer` 方法从服务器获取所有好友的列表，该列表只包含好友的用户 ID。

```typescript
 ChatClient.getInstance()
   .contactManager.getAllContactsFromServer()
   .then((value) => {
     console.log("get contact success.", value);
   })
   .catch((reason) => {
     console.log("get contact fail.", reason);
   });
 ```

#### 从本地获取好友列表

自 1.3.0 版本开始，你可以调用 `getContact` 方法从本地获取单个好友的用户 ID 和好友备注；你也可以调用 `getAllContacts` 方法一次性获取整个好友列表，其中每个好友对象包含好友的用户 ID 和好友备注。

:::tip
需要从服务器获取好友列表之后，才能从本地获取到好友列表。
:::

- 获取本地单个好友。

```typescript
// userId 获取指定用户的好友备注。
ChatClient.getInstance()
  .contactManager.getContact(userId)
  .then((contactList: Contact | undefined) => {
    // todo: 获取好友备注对象。
  })
  .catch();
```

- 一次性获取本地好友列表。

```typescript
ChatClient.getInstance()
  .contactManager.getAllContacts()
  .then((contactList: Contact[]) => {
    // todo: 从服务器返回所有的联系人列表。包括好友备注信息。
  })
  .catch();
```

此外，你也可以调用 `getAllContactsFromDB` 方法从本地一次性获取所有好友的列表，该列表只包含好友的用户 ID。

```typescript
 ChatClient.getInstance()
   .contactManager.getAllContactsFromDB()
   .then((value) => {
     console.log("get contact success.", value);
   })
   .catch((reason) => {
     console.log("get contact fail.", reason);
   });
 ```

### 将用户加入黑名单

你可以调用 `addUserToBlockList` 添加用户到黑名单。用户被加入黑名单后，无法向你发送消息，也无法发送好友申请。

用户可以将任何其他用户添加到黑名单列表，无论该用户是否是好友。好友被加入黑名单后仍在好友列表上显示。

```typescript
// 用户 ID
const userId = "tom";
// 将用户添加到黑名单
ChatClient.getInstance()
  .contactManager.addUserToBlockList(userId)
  .then(() => {
    console.log("add block list success.");
  })
  .catch((reason) => {
    console.log("add block list fail.", reason);
  });
```

### 查看当前用户黑名单列表

1. 使用本地缓存获取黑名单列表

```typescript
ChatClient.getInstance()
  .contactManager.getBlockListFromDB()
  .then((list) => {
    console.log("get block list success: ", list);
  })
  .catch((reason) => {
    console.log("get block list fail.", reason);
  });
```

2. 通过服务器获取黑名单列表

从服务器获取黑名单列表之后，才能从本地数据库获取到黑名单列表。

```typescript
ChatClient.getInstance()
  .contactManager.getBlockListFromServer()
  .then((list) => {
    console.log("get block list success: ", list);
  })
  .catch((reason) => {
    console.log("get block list fail.", reason);
  });
```

### 从黑名单中移除用户

被移出黑名单后，用户发送消息等行为将恢复。

```typescript
// 用户 ID
const userId = "tom";
// 将用户从黑名单移除
ChatClient.getInstance()
  .contactManager.removeUserFromBlockList(userId)
  .then((list) => {
    console.log("remove user to block list success: ", list);
  })
  .catch((reason) => {
    console.log("remove user to block list fail.", reason);
  });
```