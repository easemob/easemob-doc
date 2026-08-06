# 管理用户关系

## 功能说明

SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

- 好友管理：添加好友、处理好友申请、删除好友、设置好友备注、获取好友列表，以及在登录成功后自动同步好友列表和好友信息。
- 黑名单管理：获取黑名单列表、以及添加和移除黑名单用户。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 前提条件

开始前，请确保满足以下条件：
- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 已注册 `ContactManager`，能够通过 `client.contactManager` 调用好友和黑名单相关接口。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 添加好友事件监听

为了接收好友添加、删除和好友申请状态的变更事件，你需要添加好友事件监听。

```typescript
client.contactManager.addEventHandler('contact-listener', {
  // 对方接受了好友请求。用户 A 向用户 B 发送好友请求，用户 B 同意后，用户 A 收到该事件。
  onContactAgreed: event => {
    console.log('对方已接受好友请求:', event.from);
  },

  // 对方拒绝了好友请求。用户 A 向用户 B 发送好友请求，用户 B 拒绝后，用户 A 收到该事件。
  onContactRefuse: event => {
    console.log('对方已拒绝好友请求:', event.from);
  },

  // 接收到好友请求。用户 B 向用户 A 发送好友请求，用户 A 收到该事件。
  onContactInvited: event => {
    console.log('收到好友请求:', event.from, '附言:', event.status);
  },

  // 好友被删除。用户 B 将用户 A 从好友列表中删除后，用户 A 收到该事件。
  onContactDeleted: event => {
    console.log('被删除好友:', event.userInfo.userId);
  },

  // 好友已添加。好友关系建立后，双方都会收到该事件。
  onContactAdded: event => {
    console.log('新增好友:', event.userInfo.userId);
  },

  // 好友的用户属性发生更新时触发。
  onContactInfoUpdated: event => {
    console.log('好友属性更新:', event.userInfo.userId, event.userInfo);
  },
});
```

### 添加好友

添加好友用于建立稳定的单聊关系。对方接受申请后，双方成为彼此的好友。当前 SDK 仅支持双向好友关系，不支持单向好友或关注关系。

典型流程如下：

1. 调用 `addContact` 发起好友申请。
2. 对方通过 `onContactInvited` 收到申请，并选择接受或拒绝。
3. 若对方接受，双方建立好友关系；若对方拒绝，本次申请结束。

你可以调用 `addContact` 发起好友申请：

```typescript
await client.contactManager.addContact({
  userId: 'user2',
  message: '你好，我是 user1，想加你为好友',
});
```

接收方会通过 `onContactInvited` 回调收到该申请，可按需接受或拒绝：

- 调用 `acceptContactInvite` 接受好友申请。请求方会收到 `onContactAgreed`，双方都会收到 `onContactAdded`。
- 调用 `declineContactInvite` 拒绝好友申请。请求方会收到 `onContactRefuse`。

```typescript
await client.contactManager.acceptContactInvite({ userId: 'user1' });
```

```typescript
await client.contactManager.declineContactInvite({ userId: 'user1' });
```

:::tip

- 服务器不会重复下发好友申请事件。若业务需要展示待处理申请列表，建议在收到 `onContactInvited` 时本地保存申请记录。
- 当前 SDK 不提供好友申请列表拉取接口。
:::

### 删除好友

调用 `deleteContact` 删除好友后，对方好友列表中的该用户也会被移除。该操作无需对方确认，建议在应用侧增加二次确认。

```typescript
await client.contactManager.deleteContact({ userId: 'user2' });
```

删除后，对方会收到 `onContactDeleted` 事件。

### 设置好友备注

你可以调用 `setContactRemark` 设置单个好友的备注。

```typescript
await client.contactManager.setContactRemark({
  userId: 'user2',
  remark: '同事小王', // 好友备注长度不能超过 100 个字符。传入空字符串清空好友备注。
});
```

### 获取好友列表和好友信息

#### 从服务器获取好友列表

如需主动从服务端刷新好友列表及好友信息，可调用 `client.refreshContactSnapshot`。该方法会触发好友数据同步，但不会直接返回好友列表结果。刷新完成后，你可以再调用 `client.contactManager.getContacts` 读取当前内存中的好友列表视图。

返回结果中的每个好友对象均为 `Contact`。你可以通过该对象获取好友的信息：
- `userId`：好友用户 ID。
- `remark`：好友备注。
- `userInfo`：好友用户属性。
- `addTs`：好友添加时间。

```typescript
await client.refreshContactSnapshot();

const contacts = client.contactManager.getContacts();
contacts.forEach(contact => {
  console.log(contact.userId, contact.remark, contact.userInfo, contact.addTs);
});
```

#### 从本地获取好友列表

你可以调用 `getContacts` 读取当前内存中的好友列表视图。该方法不会发起网络请求。

本地好友列表中的每个好友对象同样为 `Contact`。你可以通过该对象获取好友的信息：
- `userId`：好友用户 ID。
- `remark`：好友备注。
- `userInfo`：好友用户属性。
- `addTs`：好友添加时间。

:::tip
若需要最新的好友列表和好友信息，建议先调用 `client.refreshContactSnapshot`，或在初始化时 [开启登录后自动同步好友列表功能](#开启自动同步)。
:::

```typescript
const contacts = client.contactManager.getContacts();

contacts.forEach(contact => {
  console.log(contact.userId);
  console.log(contact.remark);
  console.log(contact.userInfo);
  console.log(contact.addTs);
});
```

#### 从本地内存获取单个用户属性

如果你需要读取当前内存中的单个好友的用户属性，可从 `client.contactManager.getContacts` 返回的好友列表中选择目标好友。关于该接口的说明，详见 [从本地内存读取用户属性](userinfo_provider.html#从本地内存读取用户属性)。

如果你需要获取最新的用户属性，应调用 [client.userInfoManager.getUserInfoByUserId](userprofile.html#从服务端获取用户的所有属性) 从服务端查询。

### 登录后自动同步好友列表

#### 开启自动同步

SDK 通过初始化参数 `enableSyncData: ['contact']` 控制登录后自动同步好友列表及好友信息。开启后，SDK 会在登录成功后自动触发好友数据同步，并更新本地好友快照。

该功能需要在 `ChatClient.init` 时配置，并注册 `ContactManager` 和 `UserInfoManager`。同步完成后，你可以通过 `client.contactManager.getContacts` 读取当前内存中的好友列表视图。

```typescript
const client = ChatClient.init({
  appKey: 'easemob-demo#chatdemoui',
  enableSyncData: ['conversation', 'contact'],
  managers: [ContactManager, UserInfoManager],
});
```

#### 监听同步状态和好友信息变更

开启自动同步后，建议通过 `client.addEventHandler` 监听好友同步开始和完成事件，并通过 `client.contactManager.addEventHandler` 监听好友属性更新事件，以便及时更新 UI 或处理异常情况。

- `onSyncDataStart`：好友列表及好友信息开始同步时触发。
- `onSyncDataFinished`：好友列表及好友信息同步完成时触发。若同步失败，可通过 `status` 和 `error` 获取同步结果及失败原因。
- `onContactInfoUpdated`：好友属性发生变更时触发。你可以通过 `event.userInfo` 或 `event.contact` 获取更新后的好友信息。

示例代码如下：

```typescript
// 监听好友列表及好友信息的同步状态。
client.addEventHandler('contact-sync-listener', {
  onSyncDataStart: payload => {
    if (payload.dataType === 'contact') {
      console.log('好友同步开始');
    }
  },

  onSyncDataFinished: payload => {
    if (payload.dataType === 'contact') {
      if (payload.status === 'success') {
        console.log('好友同步完成');
      } else {
        console.log('好友同步失败:', payload.error);
      }
    }
  },
});

// 监听好友属性更新。
client.contactManager.addEventHandler('contact-profile-listener', {
  onContactInfoUpdated: event => {
    console.log('好友用户 ID:', event.userInfo.userId);
    console.log('好友属性:', event.userInfo);

    if (event.contact) {
      console.log('好友备注:', event.contact.remark);
      console.log('好友添加时间:', event.contact.addTs);
    }

    // 可在此处刷新好友列表、好友详情页或会话列表中的头像和昵称等展示信息。
  },
});
```

关于不同场景下好友用户属性的变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。

### 设置仅给好友发消息

环信即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。开启后，SDK 会在用户发起单聊时检查好友关系；若用户向非好友用户发送单聊消息，SDK 会返回错误码 `221`。

## 黑名单管理

黑名单与好友体系相互独立，主要用于管理需要屏蔽的用户。

### 添加用户到黑名单

若需屏蔽某个用户的消息，可将其加入黑名单。该操作适用于任何用户，无论是否为好友。被加入黑名单后，该用户将无法向你发送消息或好友申请。

若被加入黑名单的是好友，其好友关系仍会保留在你的好友列表中。

你可以调用 `addUsersToBlocklist` 将一个或多个用户加入黑名单：

```typescript
const result = await client.contactManager.addUsersToBlocklist({
  userIds: ['user3'],
});

console.log(result.succeeded, result.failed);
```

### 将用户从黑名单移除

你可以调用 `removeUserFromBlocklist` 将一个或多个用户从黑名单中移除。移除后，用户发送消息等行为将恢复。

```typescript
await client.contactManager.removeUserFromBlocklist({
  userIds: ['user3'],
});
```

### 从服务器获取黑名单列表

你可以调用 `getBlocklist` 从服务端获取黑名单列表：

```typescript
const blocklist = await client.contactManager.getBlocklist();
console.log(blocklist);
```

### 从本地缓存获取黑名单列表

`getBlocklist` 在当前登录会话下首次调用时，会从服务端拉取黑名单列表，并写入 SDK 内部维护的黑名单快照。黑名单快照加载完成后，在同一会话内再次调用 `getBlocklist` 时，SDK 会优先返回当前缓存中的黑名单快照，而不会再次主动从服务端拉取。

```typescript
const blocklist = await client.contactManager.getBlocklist();
console.log(blocklist);
```

## 接口列表

| API 名称                                             | 所属模块/类       | 说明                                                         |
| ---------------------------------------------------- | ----------------- | ------------------------------------------------------------ |
| [`addContact`](#添加好友)                            | `ContactManager`  | 发起好友申请。                                               |
| [`acceptContactInvite`](#添加好友)                   | `ContactManager`  | 接受好友申请。                                               |
| [`declineContactInvite`](#添加好友)                  | `ContactManager`  | 拒绝好友申请。                                               |
| [`deleteContact`](#删除好友)                         | `ContactManager`  | 删除好友。                                                   |
| [`setContactRemark`](#设置好友备注)                  | `ContactManager`  | 设置或清空好友备注。                                         |
| [`refreshContactSnapshot`](#从服务器获取好友列表)    | `ChatClient`      | 主动触发好友列表及好友信息同步刷新。                         |
| [`getContacts`](#从本地获取好友列表)                 | `ContactManager`  | 读取当前内存中的好友列表视图。                               |
| [`getUserInfoByUserId`](#从本地内存获取单个用户属性) | `UserInfoManager` | 从服务端获取指定用户的最新用户属性。                         |
| [`ChatClient.init`](#开启自动同步)                   | `ChatClient`      | 通过 `enableSyncData` 配置登录后自动同步好友列表及好友信息。 |
| [`addUsersToBlocklist`](#添加用户到黑名单)           | `ContactManager`  | 批量添加黑名单用户。                                         |
| [`removeUserFromBlocklist`](#将用户从黑名单移除)     | `ContactManager`  | 批量移除黑名单用户。                                         |
| [`getBlocklist`](#从服务器获取黑名单列表)            | `ContactManager`  | 获取当前登录会话下的黑名单列表。                             |
