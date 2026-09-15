# 管理用户关系

SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

- 好友管理：添加好友、处理好友申请、删除好友、设置好友备注、获取好友列表，以及在登录成功后自动同步好友列表和好友信息。
- 黑名单管理：获取黑名单列表，以及添加和移除黑名单用户。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

React Native SDK 通过 `ChatContactManager` 提供用户关系管理 API，并通过 `ChatContactEventListener` 通知好友关系、好友同步状态及好友信息变更。

## 前提条件

开始前，请确保满足以下条件：
- 完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 监听好友关系和好友信息变更

通过 `ChatContactEventListener` 监听好友申请、接受、拒绝、添加、删除、好友同步状态及好友信息变更。建议在 SDK 初始化成功后、登录前注册监听器，以免遗漏登录后自动同步事件；不再需要监听时，应移除同一个监听器对象。

```typescript
const contactListener: ChatContactEventListener = {
  // 双方建立好友关系后，双方都会收到该事件。
  onContactAdded(userName) {
    console.log('好友已添加：', userName);
  },

  // 对方删除当前用户后，当前用户收到该事件。用户 B 将用户 A 从好友列表中删除后，用户 A 收到该事件。
  onContactDeleted(userName) {
    console.log('好友已删除：', userName);
  },

  // 收到好友申请。用户 B 向用户 A 发送好友申请，用户 A 收到该事件。
  onContactInvited(userName, reason) {
    console.log('收到好友申请：', { userName, reason });
  },

  // 当前用户发出的好友申请被对方接受。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，同意加好友，则用户 A 收到该事件。
  onFriendRequestAccepted(userName) {
    console.log('好友申请已接受：', userName);
  },

  // 当前用户发出的好友申请被对方拒绝。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，拒绝加好友，则用户 A 收到该事件。
  onFriendRequestDeclined(userName) {
    console.log('好友申请已拒绝：', userName);
  },

  // SDK 开始从服务器自动同步好友数据。
  onContactSyncStart() {
    console.log('好友数据开始同步');
  },

  // error 为 undefined 表示自动同步成功。
  onContactSyncFinish(error) {
    if (error === undefined) {
      console.log('好友数据同步成功');
    } else {
      console.error('好友数据同步失败：', error.code, error.description);
    }
  },

  // 好友信息发生变更，contact 为更新后的好友对象。
  onContactInfoUpdate(contact) {
    console.log('好友信息已更新：', contact);
  },
};

const contactManager = ChatClient.getInstance().contactManager;
contactManager.addContactListener(contactListener);

// 在页面或组件卸载时调用，移除同一个监听器对象。
function removeContactListener(): void {
  contactManager.removeContactListener(contactListener);
}
```

### 添加好友

添加好友用于建立稳定的单聊关系。对方接受申请后，双方成为彼此的好友。当前 SDK 仅支持双向好友关系，不支持单向好友或关注关系。

典型流程如下：

1. 调用 `ChatContactManager#addContact` 发起好友申请。
2. 对方通过 `ChatContactEventListener#onContactInvited` 收到申请，并选择接受或拒绝。
3. 若对方接受，双方建立好友关系；若对方拒绝，本次申请结束。

调用 `addContact` 发起好友申请：

```typescript
try {
  await ChatClient.getInstance().contactManager.addContact(
    'userId',
    'Request to add a friend.'
  );
  console.log('好友申请发送成功');
} catch (error) {
  console.error('好友申请发送失败：', error);
}
```

接收方通过 `onContactInvited` 收到申请后，可按需接受或拒绝：

- 调用 `acceptInvitation` 接受好友申请。请求方会收到 `onFriendRequestAccepted`，双方都会收到 `onContactAdded`。
- 调用 `declineInvitation` 拒绝好友申请。请求方会收到 `onFriendRequestDeclined`。

接受好友申请：

```typescript
try {
  await ChatClient.getInstance().contactManager.acceptInvitation('userId');
  console.log('已接受好友申请');
} catch (error) {
  console.error('接受好友申请失败：', error);
}
```

拒绝好友申请：

```typescript
try {
  await ChatClient.getInstance().contactManager.declineInvitation('userId');
  console.log('已拒绝好友申请');
} catch (error) {
  console.error('拒绝好友申请失败：', error);
}
```

:::tip
- 服务器不会重复下发好友申请事件。若业务需要展示待处理申请列表，建议在收到 `onContactInvited` 时在应用侧保存申请记录。
- 当前 SDK 不提供好友申请列表拉取接口。
:::

### 删除好友

调用 `ChatContactManager#deleteContact` 删除好友。删除好友后，对方好友列表中的该用户也会被移除，双方的好友关系都会解除，对方会收到 `onContactDeleted` 事件。该操作无需对方确认，建议在应用侧增加二次确认。

`deleteContact` 的第二个参数 `keepConversation` 用于表示是否保留与该好友相关的本地单聊会话及消息，默认值为 `false`：

```typescript
import { ChatClient } from 'react-native-chat-sdk';

try {
  await ChatClient.getInstance().contactManager.deleteContact(
    'userId',
    true
  );
  console.log('好友删除成功');
} catch (error) {
  console.error('好友删除失败：', error);
}
```

// TODO：需要保留吗？

:::warning
React Native SDK 1.18.0 的 Android 原生桥接层调用不带 `keepConversation` 参数的异步删除接口，因此该参数在 Android 平台不会传递给原生 SDK，无法用它保证保留本地会话和消息。Android 平台会采用原生异步删除接口的默认行为。iOS 平台会将该参数传递给原生 SDK。
:::

### 设置好友备注

调用 `ChatContactManager#setContactRemark` 设置单个好友的备注。

```typescript
// 好友备注长度不能超过 100 个字符。传入空字符串清空好友备注。
try {
  const contact = new ChatContact({
    userId: 'userId',
    remark: '项目负责人',
  });
  await ChatClient.getInstance().contactManager.setContactRemark(contact);
  console.log('好友备注设置成功');
} catch (error) {
  console.error('好友备注设置失败：', error);
}
```

### 获取好友列表和好友信息

React Native SDK 使用 `ChatContact` 表示好友对象。自 SDK 1.18.0 版本开始，该对象除用户 ID 和好友备注外，还可以包含好友用户属性及添加好友时间。

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `userId` | `string` | 好友的用户 ID。 |
| `remark` | `string` | 好友备注；未设置备注时通常为空字符串。 |
| `userInfo` | `ChatUserInfo \| undefined` | 好友的用户属性；本地没有相关属性时为 `undefined`。 |
| `addTimestamp` | `number \| undefined` | 添加好友的毫秒级 Unix 时间戳；当前对象不包含该信息时为 `undefined`。 |

#### 登录后自动同步好友列表

自 SDK 1.18.0 版本开始，可在初始化 SDK 时将 `ChatOptions#enableAutoSyncContacts` 设置为 `true`。用户登录成功后，SDK 会自动从服务器同步好友列表，并更新原生 SDK 的本地数据。

若要自动管理好友的 `userInfo` 用户属性，需同时将 `ChatOptions#enableUserInfo` 设置为 `true`：

```typescript
import { ChatClient, ChatOptions } from 'react-native-chat-sdk';

const options = ChatOptions.withAppKey({
  appKey: 'your-org#your-app',
  enableAutoSyncContacts: true,
  enableUserInfo: true,
});

await ChatClient.getInstance().init(options);
```

:::tip
- `enableAutoSyncContacts` 和 `enableUserInfo` 的默认值均为 `false`。
- 必须在调用 `ChatClient#getInstance().init(options)` 时传入上述配置。初始化完成后再修改原选项对象，不会重新配置已初始化的原生 SDK。
- 建议在 SDK 初始化成功后、调用登录接口前注册 `ChatContactEventListener`，以接收本次登录触发的同步事件。
:::

自动同步状态通过 `ChatContactEventListener` 的以下回调通知：

- `onContactSyncStart()`：SDK 开始从服务器同步好友数据时触发。
- `onContactSyncFinish(error?)`：同步结束时触发；`error === undefined` 表示成功，否则可通过 `error.code` 和 `error.description` 获取失败信息。
- `onContactInfoUpdate(contact)`：好友信息发生变更时触发，参数为更新后的 `ChatContact`。

完整监听示例见 [监听好友关系和好友信息变更](#监听好友关系和好友信息变更)。

#### 主动从服务器获取好友列表

除登录后自动同步外，还可以按业务需要主动从服务器获取好友列表：

- `fetchAllContacts`：一次性获取全部 `ChatContact` 对象，返回 `Promise<ChatContact[]>`。
- `fetchContacts`：分页获取 `ChatContact` 对象，返回 `Promise<ChatCursorResult<ChatContact>>`。
- `getAllContactsFromServer`：一次性获取全部好友的用户 ID，返回 `Promise<string[]>`。

一次性获取全部好友对象：

```typescript
try {
  const contacts = await ChatClient.getInstance()
    .contactManager.fetchAllContacts();

  for (const contact of contacts) {
    console.log('好友信息：', {
      userId: contact.userId,
      remark: contact.remark,
      userInfo: contact.userInfo,
      addTimestamp: contact.addTimestamp,
    });
  }
} catch (error) {
  console.error('获取好友列表失败：', error);
}
```

分页获取好友对象：

```typescript
try {
  const result = await ChatClient.getInstance()
    .contactManager.fetchContacts({
      // 首次调用可省略 cursor 或传入空字符串。
      cursor: undefined,
      // 默认值为 20，取值范围为 1-50。
      pageSize: 20,
    });

  for (const contact of result.list ?? []) {
    console.log('好友：', contact);
  }

  // 获取下一页时，将 result.cursor 作为 cursor 传入。
  console.log('下一页游标：', result.cursor);
} catch (error) {
  console.error('分页获取好友列表失败：', error);
}
```

仅获取全部好友用户 ID：

```typescript
const userIds = await ChatClient.getInstance()
  .contactManager.getAllContactsFromServer();
console.log('好友用户 ID：', userIds);
```

#### 从本地读取好友列表

好友数据自动同步成功或主动从服务器获取好友数据后，可以调用以下接口读取原生 SDK 的本地数据：

- `getAllContacts`：获取本地全部好友对象，返回 `Promise<ChatContact[]>`。
- `getContact`：获取本地指定好友对象，返回 `Promise<ChatContact | undefined>`；本地不存在该好友时返回 `undefined`。
- `getAllContactsFromDB`：获取本地全部好友用户 ID，返回 `Promise<string[]>`。

获取本地全部好友对象：

```typescript
try {
  const contacts = await ChatClient.getInstance()
    .contactManager.getAllContacts();
  console.log('本地好友列表：', contacts);
} catch (error) {
  console.error('读取本地好友列表失败：', error);
}
```

获取本地指定好友对象：

```typescript
try {
  const contact = await ChatClient.getInstance()
    .contactManager.getContact('userId');

  if (contact !== undefined) {
    console.log('本地好友信息：', {
      userId: contact.userId,
      remark: contact.remark,
      userInfo: contact.userInfo,
      addTimestamp: contact.addTimestamp,
    });
  }
} catch (error) {
  console.error('读取本地好友信息失败：', error);
}
```

获取本地全部好友用户 ID：

```typescript
const userIds = await ChatClient.getInstance()
  .contactManager.getAllContactsFromDB();
console.log('本地好友用户 ID：', userIds);
```

#### 从本地获取用户属性

如果需要直接从原生 SDK 的本地数据中读取一个或多个用户的属性，可以调用 `ChatUserInfoManager#getLocalUserInfoByIds`。该接口返回 `Promise<Map<string, ChatUserInfo>>`，Map 的键为用户 ID、值为对应的 `ChatUserInfo`，返回的不是 `ChatContact`。

该接口不会发起网络请求，可作为好友列表读取之外的补充资料读取方式。若本地没有某个用户的属性，返回的 Map 中不会包含该用户。

```typescript
try {
  const userInfoMap = await ChatClient.getInstance()
    .userManager.getLocalUserInfoByIds(['userId1', 'userId2']);

  const userInfo = userInfoMap.get('userId1');
  console.log('本地用户属性：', userInfo);
} catch (error) {
  console.error('读取本地用户属性失败：', error);
}
```

有关用户属性的更多说明，详见 [管理用户属性](userprofile.html)。

### 设置仅给好友发消息

环信即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。开启后，SDK 会在用户发起单聊时检查好友关系；若用户向非好友用户发送单聊消息，SDK 会返回错误码 `221`。

## 黑名单管理

黑名单与好友体系相互独立，主要用于管理需要屏蔽的用户。

### 添加用户到黑名单

若需屏蔽某个用户的消息，可调用 `ChatContactManager#addUserToBlockList` 将其加入黑名单。该操作适用于任何用户，无论是否为好友。被加入黑名单后，该用户将无法向你发送消息或好友申请；若该用户是好友，其好友关系仍会保留在好友列表中。

```typescript
import { ChatClient } from 'react-native-chat-sdk';

try {
  await ChatClient.getInstance()
    .contactManager.addUserToBlockList('userId');
  console.log('用户已加入黑名单');
} catch (error) {
  console.error('加入黑名单失败：', error);
}
```

### 将用户从黑名单移除

调用 `ChatContactManager#removeUserFromBlockList` 将用户从黑名单中移除。移除后，该用户发送消息或好友申请等行为将恢复。

```typescript
try {
  await ChatClient.getInstance()
    .contactManager.removeUserFromBlockList('userId');
  console.log('用户已移出黑名单');
} catch (error) {
  console.error('移出黑名单失败：', error);
}
```

### 从服务器获取黑名单列表

调用 `ChatContactManager#getBlockListFromServer` 从服务器获取黑名单用户 ID 列表，返回类型为 `Promise<string[]>`。成功获取后，原生 SDK 会同步更新本地黑名单数据。

```typescript
try {
  const blockedUserIds = await ChatClient.getInstance()
    .contactManager.getBlockListFromServer();
  console.log('服务端黑名单：', blockedUserIds);
} catch (error) {
  console.error('获取服务端黑名单失败：', error);
}
```

### 从本地数据库获取黑名单列表

调用 `ChatContactManager#getBlockListFromDB` 读取本地数据库中的黑名单用户 ID 列表，返回类型为 `Promise<string[]>`。若需要确保数据为服务端最新状态，可先调用 `getBlockListFromServer` 更新本地数据，再进行读取。

```typescript
try {
  const blockedUserIds = await ChatClient.getInstance()
    .contactManager.getBlockListFromDB();
  console.log('本地黑名单：', blockedUserIds);
} catch (error) {
  console.error('获取本地黑名单失败：', error);
}
```

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`addContactListener`](#监听好友关系和好友信息变更) | `ChatContactManager` | `void` | 添加好友关系、同步状态及好友信息监听器。 |
| [`removeContactListener`](#监听好友关系和好友信息变更) | `ChatContactManager` | `void` | 移除指定的联系人监听器。 |
| [`addContact`](#添加好友) | `ChatContactManager` | `Promise<void>` | 发起好友申请。 |
| [`acceptInvitation`](#添加好友) / [`declineInvitation`](#添加好友) | `ChatContactManager` | `Promise<void>` | 接受或拒绝好友申请。 |
| [`deleteContact`](#删除好友) | `ChatContactManager` | `Promise<void>` | 删除好友；`keepConversation` 在 Android 平台存在不透传限制。 |
| [`setContactRemark`](#设置好友备注) | `ChatContactManager` | `Promise<void>` | 设置或清空好友备注。 |
| [`withAppKey`](#登录后自动同步好友列表) | `ChatOptions` | `ChatOptions` | 创建 SDK 配置，并通过 `enableAutoSyncContacts` 开启登录后自动同步好友数据。 |
| [`init`](#登录后自动同步好友列表) | `ChatClient` | `Promise<void>` | 使用指定配置初始化 SDK。 |
| [`fetchAllContacts`](#主动从服务器获取好友列表) | `ChatContactManager` | `Promise<ChatContact[]>` | 从服务器一次性获取全部好友对象。 |
| [`fetchContacts`](#主动从服务器获取好友列表) | `ChatContactManager` | `Promise<ChatCursorResult<ChatContact>>` | 从服务器分页获取好友对象。 |
| [`getAllContactsFromServer`](#主动从服务器获取好友列表) | `ChatContactManager` | `Promise<string[]>` | 从服务器获取全部好友用户 ID。 |
| [`getAllContacts`](#从本地读取好友列表) | `ChatContactManager` | `Promise<ChatContact[]>` | 获取本地全部好友对象。 |
| [`getContact`](#从本地读取好友列表) | `ChatContactManager` | `Promise<ChatContact \| undefined>` | 获取本地指定好友对象。 |
| [`getAllContactsFromDB`](#从本地读取好友列表) | `ChatContactManager` | `Promise<string[]>` | 获取本地全部好友用户 ID。 |
| [`getLocalUserInfoByIds`](#从本地获取用户属性) | `ChatUserInfoManager` | `Promise<Map<string, ChatUserInfo>>` | 从本地读取一个或多个用户的用户属性。 |
| [`addUserToBlockList`](#添加用户到黑名单) | `ChatContactManager` | `Promise<void>` | 将用户加入黑名单。 |
| [`removeUserFromBlockList`](#将用户从黑名单移除) | `ChatContactManager` | `Promise<void>` | 将用户移出黑名单。 |
| [`getBlockListFromServer`](#从服务器获取黑名单列表) | `ChatContactManager` | `Promise<string[]>` | 从服务器获取黑名单用户 ID。 |
| [`getBlockListFromDB`](#从本地数据库获取黑名单列表) | `ChatContactManager` | `Promise<string[]>` | 从本地数据库获取黑名单用户 ID。 |
| [`onContactSyncStart`](#登录后自动同步好友列表) | `ChatContactEventListener` | `void` | 好友数据同步开始回调。 |
| [`onContactSyncFinish`](#登录后自动同步好友列表) | `ChatContactEventListener` | `void` | 好友数据同步完成回调；`error` 为 `undefined` 表示成功。 |
| [`onContactInfoUpdate`](#监听好友关系和好友信息变更) | `ChatContactEventListener` | `void` | 好友信息变更回调。 |
