# 管理用户关系

[[toc]]

用户完成登录后，就会进行添加联系人、获取好友列表等操作。

本文介绍如何通过环信即时通讯 IM React Native SDK 管理好友关系，包括添加、同意、拒绝、删除、查询好友，以及管理黑名单，包括添加、移出、查询黑名单。

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

删除好友建议执行双重确认，以免发生误删操作。删除操作是不需要对方同意或者拒绝操作的。

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

### 将联系人加入黑名单

加入黑名单后，对方将无法发送消息给自己。

```typescript
// 用户 ID
const userId = "tom";
// 将好友添加到黑名单
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

被移除黑名单后，用户发送消息等行为将恢复。

```typescript
// 用户 ID
const userId = "tom";
// 将好友从黑名单移除
ChatClient.getInstance()
  .contactManager.removeUserFromBlockList(userId)
  .then((list) => {
    console.log("remove user to block list success: ", list);
  })
  .catch((reason) => {
    console.log("remove user to block list fail.", reason);
  });
```