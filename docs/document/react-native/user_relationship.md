# 管理用户关系

SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

- 好友管理：添加好友、处理好友申请、删除好友、设置好友备注、获取好友列表，以及在登录成功后自动同步好友列表和好友信息。
- 黑名单管理：获取黑名单列表，以及添加和移除黑名单用户。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

React Native SDK 通过 `ChatContactManager` 提供用户关系管理 API，通过 `ChatContactEventListener` 通知好友关系及好友信息变更，通过 `ChatConnectEventListener` 通知数据同步状态。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 监听好友关系和好友信息变更

通过 `ChatContactEventListener` 监听好友申请、接受、拒绝、添加、删除及好友信息变更事件。不再需要监听时，应移除同一个监听器对象。

:::tip
如需通过 `onContactInfoUpdate` 接收好友的用户属性变更通知，你需要先联系环信商务开通该功能。关于用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。
:::

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

`reason` 为可选的申请理由，默认为空字符串。

```typescript
try {
  // 发起好友申请
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
  // 接受好友申请
  await ChatClient.getInstance().contactManager.acceptInvitation('userId');
  console.log('已接受好友申请');
} catch (error) {
  console.error('接受好友申请失败：', error);
}
```

拒绝好友申请：

```typescript
try {
  // 拒绝好友申请
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

`deleteContact` 的第二个参数 `keepConversation` 的公开含义为是否保留本地会话，默认值为 `false`，但当前版本存在以下平台差异：

:::notice
React Native SDK 5.x 的 Android 端不使用 `keepConversation` 参数，删除好友时会同时删除对应的本地单聊会话及消息。iOS 端将该参数用于控制是否删除会话：`true` 表示删除，`false` 表示保留，与公开的保留语义相反。因此，不能通过该参数实现双端一致的会话保留行为。
:::

以下示例仅展示删除好友，本地会话和消息的处理见上述平台说明：

```typescript
try {
  // 删除指定好友
  await ChatClient.getInstance().contactManager.deleteContact('userId');
  console.log('好友删除成功');
} catch (error) {
  console.error('好友删除失败：', error);
}
```

### 设置好友备注

调用 `ChatContactManager#setContactRemark` 设置单个好友的备注。

```typescript
// 好友备注长度不能超过 100 个字符。传入空字符串清空好友备注。
try {
  const contact = new ChatContact({
    userId: 'userId',
    remark: '项目负责人',
  });
  // 设置好友备注
  await ChatClient.getInstance().contactManager.setContactRemark(contact);
  console.log('好友备注设置成功');
} catch (error) {
  console.error('好友备注设置失败：', error);
}
```

### 获取好友列表和好友信息

React Native SDK 使用 `ChatContact` 表示好友对象，该对象包含用户 ID、好友备注、好友用户属性及添加好友时间。

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `userId` | `string` | 好友的用户 ID。 |
| `remark` | `string` | 好友备注；原生返回值中可能缺少该字段，展示时请兼容空值。 |
| `userInfo` | `ChatUserInfo \| undefined` | 好友的用户属性；本地没有相关属性时为 `undefined`。 |
| `addTimestamp` | `number \| undefined` | 添加好友的毫秒级 Unix 时间戳；原生没有该时间信息时通常为 `0`，字段缺失时为 `undefined`。 |

#### 登录后自动同步好友列表

SDK 通过自动同步获取最新好友数据。你需要在初始化 SDK 前配置 `ChatOptions.dataSyncType`，使其包含 `ChatDataSyncType.Contacts`。用户登录成功后，SDK 会自动从服务器同步好友列表及好友信息并写入本地。当 `ChatConnectEventListener#onDataSyncFinish` 回调中的 `type` 包含 `ChatDataSyncType.Contacts` 且 `errorCode` 为 `0` 时，表示好友数据同步成功，此时可以通过本地接口读取好友列表和好友信息。

**开启好友数据自动同步**

在调用 `ChatClient#init` 初始化 SDK 前，通过 `ChatOptions.dataSyncType` 配置 `ChatDataSyncType.Contacts`。用户登录成功后，SDK 会自动同步好友列表及好友信息并写入本地。

```typescript
try {
  const options = ChatOptions.withAppKey({
    appKey: 'your-org#your-app',
    // 登录后自动同步好友列表及好友信息
    dataSyncType: ChatDataSyncType.Contacts,
    // 开启用户属性和群成员名片的自动管理
    enableUserInfo: true,
  });
  await ChatClient.getInstance().init(options);
} catch (error: unknown) {
  console.error('初始化 SDK 失败：', error);
}
```

`dataSyncType` 为可选的位掩码配置；省略时 SDK 使用原生平台的默认同步范围，并不保证同步好友数据，因此请显式设置。若还需同步会话或已加入群组，可与 `ChatDataSyncType.Conversations`、`ChatDataSyncType.JoinedGroups` 按位或组合。`enableUserInfo` 默认为 `false`，控制 [用户信息自动管理](userinfo_provider.html)，不替代好友列表同步配置。初始化完成后再修改原配置对象，不会重新配置已初始化的 SDK。

**监听好友数据同步状态**

开启自动同步后，通过 `ChatConnectEventListener` 监听好友数据同步的开始和完成。建议在 SDK 初始化成功后、登录前注册监听器。

- `onDataSyncStart(type)`：某类数据开始同步时触发；`type` 包含 `ChatDataSyncType.Contacts` 时表示好友数据开始同步。
- `onDataSyncFinish(type, errorCode)`：某类数据同步完成时触发；`type` 包含 `ChatDataSyncType.Contacts` 时表示好友数据同步结束，`errorCode === 0` 表示成功。
- 好友关系及好友信息变更由 `ChatContactEventListener` 监听，详见 [监听好友关系和好友信息变更](#监听好友关系和好友信息变更)。
- 关于不同场景下好友的用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。

```typescript
const connectionListener: ChatConnectEventListener = {
  onDataSyncStart(type: ChatDataSyncType): void {
    if ((type & ChatDataSyncType.Contacts) !== 0) {
      // 好友数据开始同步
      console.log('好友数据开始同步');
    }
  },
  onDataSyncFinish(type: ChatDataSyncType, errorCode: number): void {
    if ((type & ChatDataSyncType.Contacts) === 0) {
      return;
    }
    if (errorCode === 0) {
      // 好友数据同步成功，可以从本地读取好友列表和好友信息
      console.log('好友数据同步成功');
    } else {
      // 好友数据同步失败，根据 errorCode 处理错误
      console.error('好友数据同步失败：', errorCode);
    }
  },
};

// 注册数据同步状态监听器
ChatClient.getInstance().addConnectionListener(connectionListener);

function removeConnectionListener(): void {
  // 不再需要监听时，移除同一个监听器对象
  ChatClient.getInstance().removeConnectionListener(connectionListener);
}
```

#### 从本地读取好友列表

好友数据同步成功后，可以调用以下接口读取本地数据：

- `ChatContactManager#getAllContacts`：获取本地全部好友对象，返回 `Promise<ChatContact[]>`。
- `ChatContactManager#getContact`：获取指定好友对象，返回 `Promise<ChatContact | undefined>`；本地不存在该好友时返回 `undefined`。
- `ChatContactManager#getAllContactsFromDB`：获取本地全部好友的用户 ID，返回 `Promise<string[]>`。

获取本地全部好友对象：

```typescript
try {
  // 获取本地好友对象列表
  const contacts = await ChatClient.getInstance()
    .contactManager.getAllContacts();
  console.log('本地好友列表：', contacts);
} catch (error: unknown) {
  console.error('读取本地好友列表失败：', error);
}
```

获取本地指定好友对象：

```typescript
try {
  const contact = await ChatClient.getInstance()
    .contactManager.getContact('userId');
  if (contact) {
    // 读取好友的用户 ID、备注、用户属性和添加时间
    const userId = contact.userId;
    const remark = contact.remark;
    const userInfo = contact.userInfo;
    const addTimestamp = contact.addTimestamp;
    console.log('本地好友信息：', { userId, remark, userInfo, addTimestamp });
  }
} catch (error: unknown) {
  console.error('读取本地好友信息失败：', error);
}
```

获取本地全部好友的用户 ID：

```typescript
try {
  // 获取本地全部好友的用户 ID
  const userIds = await ChatClient.getInstance()
    .contactManager.getAllContactsFromDB();
  console.log('本地好友用户 ID：', userIds);
} catch (error: unknown) {
  console.error('读取本地好友用户 ID 失败：', error);
}
```

#### 从本地获取用户属性

如果需要直接从本地读取指定用户的属性，可以调用 `ChatUserInfoManager#getLocalUserInfoByIds`。关于该接口的说明，详见 [从本地读取用户属性](userinfo_provider.html#从本地读取用户属性)。

该接口返回 `Promise<Map<string, ChatUserInfo>>`，不是 `ChatContact`。它不会发起网络请求，可作为好友列表读取之外的补充资料读取方式。本地不存在的用户不会包含在返回结果中。

### 设置仅给好友发消息

环信即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。开启后，SDK 会在用户发起单聊时检查好友关系；若用户向非好友用户发送单聊消息，SDK 会返回错误码 `221`。

## 黑名单管理

黑名单与好友体系相互独立，主要用于管理需要屏蔽的用户。

### 添加用户到黑名单

若需屏蔽某个用户的消息，可调用 `ChatContactManager#addUserToBlockList` 将其加入黑名单。该操作适用于任何用户，无论是否为好友。被加入黑名单后，该用户将无法向你发送消息或好友申请；若该用户是好友，其好友关系仍会保留在好友列表中。

```typescript
try {
  // 将指定用户加入黑名单
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
  // 将指定用户移出黑名单
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
  // 获取服务端黑名单列表
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
  // 读取本地黑名单列表
  const blockedUserIds = await ChatClient.getInstance()
    .contactManager.getBlockListFromDB();
  console.log('本地黑名单：', blockedUserIds);
} catch (error) {
  console.error('获取本地黑名单失败：', error);
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addContactListener`](#监听好友关系和好友信息变更) / [`removeContactListener`](#监听好友关系和好友信息变更) | `ChatContactManager` | 注册或移除好友关系和好友信息监听器。 |
| [`addContact`](#添加好友) | `ChatContactManager` | 发起好友申请。 |
| [`acceptInvitation`](#添加好友) / [`declineInvitation`](#添加好友) | `ChatContactManager` | 接受或拒绝好友申请。 |
| [`deleteContact`](#删除好友) | `ChatContactManager` | 删除好友；本地会话处理存在平台差异，详见正文。 |
| [`setContactRemark`](#设置好友备注) | `ChatContactManager` | 设置好友备注。 |
| [`dataSyncType`](#登录后自动同步好友列表) | `ChatOptions` | 登录后自动同步的数据类型配置。 |
| [`addConnectionListener`](#登录后自动同步好友列表) / [`removeConnectionListener`](#登录后自动同步好友列表) | `ChatClient` | 注册或移除连接及数据同步状态监听器。 |
| [`onDataSyncStart`](#登录后自动同步好友列表) / [`onDataSyncFinish`](#登录后自动同步好友列表) | `ChatConnectEventListener` | 数据同步开始和结束回调。 |
| [`getAllContacts`](#从本地读取好友列表) | `ChatContactManager` | 获取本地全部好友对象。 |
| [`getContact`](#从本地读取好友列表) / [`getAllContactsFromDB`](#从本地读取好友列表) | `ChatContactManager` | 读取本地好友信息或用户 ID 列表。 |
| [`getLocalUserInfoByIds`](#从本地获取用户属性) | `ChatUserInfoManager` | 从本地读取一个或多个用户的属性。 |
| [`addUserToBlockList`](#添加用户到黑名单) | `ChatContactManager` | 将用户加入黑名单。 |
| [`removeUserFromBlockList`](#将用户从黑名单移除) | `ChatContactManager` | 将用户移出黑名单。 |
| [`getBlockListFromServer`](#从服务器获取黑名单列表) | `ChatContactManager` | 从服务器获取黑名单列表。 |
| [`getBlockListFromDB`](#从本地数据库获取黑名单列表) | `ChatContactManager` | 从本地数据库读取黑名单列表。 |
| [`onContactInfoUpdate`](#监听好友关系和好友信息变更) | `ChatContactEventListener` | 好友信息变更回调。 |
