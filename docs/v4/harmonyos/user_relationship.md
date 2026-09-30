# 管理用户关系

HarmonyOS IM SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

- 好友管理：添加好友、处理好友申请、删除好友、设置好友备注、获取好友列表，以及在登录成功后自动同步好友列表和好友信息。
- 黑名单管理：获取黑名单列表，以及添加和移除黑名单用户。使用该功能前，需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务，详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化、登录 IM 并连接到服务器，详见 [初始化](initialization.html) 和 [登录](login.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 使用黑名单功能前，已在 [环信控制台](https://console.easemob.com/user/login) 开通该功能，详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 监听好友关系和好友信息变更

通过 `ContactListener` 监听好友申请、接受、拒绝、添加、删除、好友同步以及好友信息变更事件。使用 `ContactManager.addContactListener` 注册监听器，不再需要时使用 `removeContactListener` 移除同一个监听器实例。

```typescript
const contactListener: ContactListener = {
  // 对方接受了当前用户发出的好友请求。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，同意加好友，则用户 A 收到该事件。
  onFriendRequestAccepted: (userId: string): void => {
  },

  // 对方拒绝了当前用户发出的好友请求。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，拒绝加好友，则用户 A 收到该事件。
  onFriendRequestDeclined: (userId: string): void => {
  },

  // 当前用户收到好友请求。用户 B 向用户 A 发送好友请求，用户 A 收到该事件。
  onContactInvited: (userId: string, reason: string): void => {
  },

  // 对方删除当前用户后，当前用户收到该回调。用户 B 将用户 A 从好友列表中删除后，用户 A 收到该事件。
  onContactDeleted: (userId: string): void => {
  },

  // 好友关系建立后，双方都会收到该回调。用户 B 向用户 A 发送好友请求，用户 A 接受后，用户 B 收到 `onFriendRequestAccepted` 事件，双方用户收到 `onContactAdded` 事件。
  onContactAdded: (userId: string): void => {
  },

  // 登录后的好友自动同步开始。
  onContactSyncStart: (): void => {
  },

  // 联系人自动同步结束。errorCode 为 ChatError.EM_NO_ERROR 时表示成功。
  onContactSyncFinishWithError: (errorCode: number, error: string): void => {
    if (errorCode === ChatError.EM_NO_ERROR) {
      // 可以从本地读取好友列表和好友信息。
    }
  },

  // 好友信息发生变更。
  onContactInfoUpdate: (contact: Contact): void => {
    const userId = contact.userId();
    const remark = contact.remark();
    const userInfo = contact.getUserInfo();
  }
};

const contactManager = ChatClient.getInstance().contactManager();
contactManager?.addContactListener(contactListener);

// 页面或组件销毁时移除同一个监听器实例。
contactManager?.removeContactListener(contactListener);
```

### 添加好友

添加好友用于建立稳定的单聊关系。对方接受申请后，双方成为彼此的好友。当前 SDK 仅支持双向好友关系，不支持单向好友或关注关系。

典型流程如下：

1. 调用 `ContactManager#addContact` 发起好友申请。
2. 对方通过 `onContactInvited` 收到申请，并选择接受或拒绝。
3. 对方接受后，双方建立好友关系；对方拒绝后，本次申请结束。

调用 `addContact(userId, reason)` 发起好友申请。`reason` 为可选参数：

```typescript
const userId = 'user2';
const reason = '申请添加好友';

ChatClient.getInstance().contactManager()?.addContact(userId, reason)
  .then(() => {
    // 好友申请发送成功。
  })
  .catch((error: ChatError) => {
    // error.errorCode 为错误码，error.description 为错误描述。
  });
```

接收方会通过 `onContactInvited` 回调收到该申请，可按需接受或拒绝：
- 调用 `acceptInvitation` 接受好友申请，请求方会收到 `onFriendRequestAccepted`，双方都会收到 `onContactAdded`。
- 调用 `declineInvitation` 拒绝好友申请。请求方会收到 `onFriendRequestDeclined`。


```typescript
ChatClient.getInstance().contactManager()?.acceptInvitation(userId)
  .then(() => {
    // 已接受好友申请。
  })
  .catch((error: ChatError) => {
    // 接受失败。
  });
```

```typescript
ChatClient.getInstance().contactManager()?.declineInvitation(userId)
  .then(() => {
    // 已拒绝好友申请。
  })
  .catch((error: ChatError) => {
    // 拒绝失败。
  });
```

:::tip
- 服务器不会重复下发好友申请事件。若业务需要展示待处理申请列表，建议在收到 `onContactInvited` 时在应用本地保存申请记录。
- 当前 HarmonyOS SDK 不提供好友申请列表拉取接口。
:::

### 删除好友

调用 `ContactManager#deleteContact(userId, keepConversation)` 删除好友。删除成功后，双方的好友关系都会解除，对方会收到 `onContactDeleted`。该操作无需对方确认，建议在应用侧增加二次确认。

`keepConversation` 用于控制是否保留本地单聊会话及消息：

- `true`：保留与该好友的本地会话和消息。
- `false`：删除对应的本地会话和消息。该参数默认值为 `false`。

```typescript
const userId = 'user2';

ChatClient.getInstance().contactManager()?.deleteContact(userId, true)
  .then(() => {
    // 好友已删除，本地会话和消息被保留。
  })
  .catch((error: ChatError) => {
    // 删除失败。
  });
```

### 设置好友备注

调用 `ContactManager#setContactRemark(userId, remark)` 设置单个好友的备注。

好友备注更新后，可通过 `Contact#remark()` 读取。好友备注仅对当前用户可见，对端用户不会因该操作收到好友关系或好友信息变更回调。

```typescript
// 好友备注长度不能超过 100 个字符；传入空字符串可清空备注。

ChatClient.getInstance().contactManager()
  ?.setContactRemark('user2', '项目联系人')
  .then(() => {
    // 好友备注设置成功。
  })
  .catch((error: ChatError) => {
    // 设置失败。
  });
```

### 获取好友列表和好友信息

#### 登录后自动同步好友列表

HarmonyOS SDK 1.14.0 可以在用户登录成功后自动从服务器同步好友列表，并写入本地缓存。该功能默认关闭，你需要在初始化 SDK 前通过 `ChatOptions#setEnableAutoSyncContacts(true)` 开启。

如果还需要通过 `Contact#getUserInfo()` 读取好友昵称、头像等用户属性，应同时通过 `ChatOptions#setEnableUserInfo(true)` 开启用户信息管理功能。

```typescript
const options = new ChatOptions({ appKey: 'your-org#your-app' });
options.setEnableAutoSyncContacts(true);
options.setEnableUserInfo(true);

// 使用 options 调用 ChatClient.init 初始化 SDK。
ChatClient.getInstance().init(context, options);
```

自动同步开始时触发 `ContactListener#onContactSyncStart`。同步结束时触发 `ContactListener#onContactSyncFinishWithError(errorCode, error)`；`errorCode === ChatError.EM_NO_ERROR` 表示同步成功，此时可以通过本地接口读取好友列表和好友信息。

:::tip
好友关系和好友信息的其他变化也通过 `ContactListener` 通知。关于用户属性回调，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。
:::

#### 从本地读取好友列表

好友数据同步成功后，可以通过以下 API 读取本地数据：

- `getContactsFromLocal()`：获取本地全部 `Contact` 对象。
- `getContact(userId)`：获取本地指定 `Contact` 对象；不存在时返回 `undefined`。
- `allContacts()`：获取缓存中的全部好友用户 ID；如果尚未从数据库加载，SDK 会先从数据库读取。

获取本地全部好友对象：

```typescript
ChatClient.getInstance().contactManager()?.getContactsFromLocal()
  .then((contacts: Contact[]) => {
    contacts.forEach((contact: Contact) => {
      const userId = contact.userId();
      const remark = contact.remark();
      const userInfo = contact.getUserInfo();
      const addTimestamp = contact.getAddTimestamp();
    });
  })
  .catch((error: ChatError) => {
    // 读取失败。
  });
```

获取本地指定好友对象：

```typescript
ChatClient.getInstance().contactManager()?.getContact('user2')
  .then((contact: Contact | undefined) => {
    if (!contact) {
      return;
    }
    const userId = contact.userId();
    const remark = contact.remark();
    const userInfo = contact.getUserInfo();
    const addTimestamp = contact.getAddTimestamp();
  })
  .catch((error: ChatError) => {
    // 读取失败。
  });
```

获取本地全部好友用户 ID：

```typescript
ChatClient.getInstance().contactManager()?.allContacts()
  .then((userIds: string[]) => {
    // userIds 为缓存中的好友用户 ID。
  })
  .catch((error: ChatError) => {
    // 读取失败。
  });
```

`Contact` 提供以下好友信息：

- `userId()`：好友用户 ID。
- `remark()`：好友备注。
- `getUserInfo()`：从用户属性本地缓存读取好友的 `UserInfo`；本地不存在时返回 `undefined`。
- `getAddTimestamp()`：好友添加时间的毫秒级时间戳；当前对象不包含该信息时返回 `0`。

#### 从服务端主动获取好友列表

如果未开启登录后自动同步，或业务需要主动刷新好友数据，可以调用以下接口：

- `fetchAllContactsIDFromServer()`：从服务端获取全部好友用户 ID，返回 `Promise<string[]>`。
- `fetchAllContactsFromServer()`：从服务端获取全部 `Contact` 对象，返回 `Promise<Contact[]>`。
- `fetchAllContactsFromServerByPage(pageSize, cursor)`：分页获取 `Contact` 对象。

```typescript
// `pageSize` 取值范围为 1 到 50；
// 首次调用可省略 `cursor`，后续传入上次结果的 `getNextCursor()`。
ChatClient.getInstance().contactManager()
  ?.fetchAllContactsFromServerByPage(50)
  .then((result: CursorResult<Contact>) => {
    const contacts: Contact[] = result.getResult();
    const nextCursor: string = result.getNextCursor();
  })
  .catch((error: ChatError) => {
    // 获取失败。
  });
```

#### 从本地缓存获取单个用户属性

如果需要直接从本地用户属性缓存读取指定用户的属性，可以调用 `UserInfoManager#getUserInfoWithUserId(userId)`。

该接口同步返回单个 `UserInfo`，不会发起网络请求；本地缓存中不存在该用户、用户 ID 为空或读取失败时返回 `undefined`。它返回的不是 `Contact` 对象，可作为好友列表读取之外的补充资料读取方式。

```typescript
const userInfo: UserInfo | undefined = ChatClient.getInstance()
  .userInfoManager()
  ?.getUserInfoWithUserId('user2');
```

关于本地用户属性缓存，详见 [从本地缓存读取用户属性](userprofile.html#从本地缓存读取用户属性)。

### 设置仅给好友发消息

环信即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。

开启后，SDK 会在用户发起单聊时检查好友关系。向非好友用户发送单聊消息时，HarmonyOS SDK 会返回错误码 `221` `ChatError.USER_NOT_ON_ROSTER`。

## 黑名单管理

黑名单与好友体系相互独立，主要用于管理需要屏蔽的用户。

### 添加用户到黑名单

若需屏蔽某个用户的消息，可以将其加入黑名单。该操作适用于任何用户，无论是否为好友。用户被加入黑名单后，将无法向当前用户发送消息或好友申请。

如果被加入黑名单的是好友，好友关系仍会保留在当前用户的好友列表中。

调用 `ContactManager#addUsersToBlocklist` 将一个或多个用户加入黑名单：

```typescript
const userIds: string[] = ['user2', 'user3'];

ChatClient.getInstance().contactManager()?.addUsersToBlocklist(userIds)
  .then(() => {
    // 用户已加入黑名单。
  })
  .catch((error: ChatError) => {
    // 添加失败。
  });
```

添加单个用户时也可直接传入字符串：

```typescript
ChatClient.getInstance().contactManager()
  ?.addUsersToBlocklist('user2');
```

### 将用户从黑名单移除

调用 `ContactManager#removeUserFromBlockList(userId)` 将指定用户从黑名单移除。移除后，该用户发送消息或好友申请等行为将恢复。

```typescript
ChatClient.getInstance().contactManager()?.removeUserFromBlockList('user2')
  .then(() => {
    // 用户已移出黑名单。
  })
  .catch((error: ChatError) => {
    // 移除失败。
  });
```

### 从服务器获取黑名单列表

调用 `ContactManager#getBlockListFromServer()` 从服务器获取黑名单中的用户 ID。

```typescript
ChatClient.getInstance().contactManager()?.getBlockListFromServer()
  .then((blockedUserIds: string[]) => {
    // blockedUserIds 为服务端黑名单列表。
  })
  .catch((error: ChatError) => {
    // 获取失败。
  });
```

### 从本地数据库获取黑名单列表

`ContactManager#blockList()` 用于读取 SDK 本地缓存中的黑名单列表，不会主动发起服务端请求。如果需要确保数据为服务端最新状态，可先调用 `getBlockListFromServer()` 更新数据，再调用 `blockList()` 读取本地结果。

```typescript
ChatClient.getInstance().contactManager()?.blockList()
  .then((blockedUserIds: string[]) => {
    // blockedUserIds 为本地缓存中的黑名单列表。
  })
  .catch((error: ChatError) => {
    // 读取失败。
  });
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addContact`](#添加好友) | `ContactManager` | 发起好友申请。 |
| [`acceptInvitation`](#添加好友) / [`declineInvitation`](#添加好友) | `ContactManager` | 接受或拒绝好友申请。 |
| [`deleteContact`](#删除好友) | `ContactManager` | 删除好友，并通过 `keepConversation` 控制是否保留本地会话和消息。 |
| [`setContactRemark`](#设置好友备注) | `ContactManager` | 设置或清空好友备注。 |
| [`addContactListener`](#监听好友关系和好友信息变更) / [`removeContactListener`](#监听好友关系和好友信息变更) | `ContactManager` | 添加或移除联系人监听器。 |
| [`setEnableAutoSyncContacts`](#登录后自动同步好友列表) / [`isEnableAutoSyncContacts`](#登录后自动同步好友列表) | `ChatOptions` | 设置或查询登录后自动同步好友列表的开关。 |
| [`getContactsFromLocal`](#从本地读取好友列表) | `ContactManager` | 获取本地全部好友对象。 |
| [`getContact`](#从本地读取好友列表) | `ContactManager` | 获取本地指定好友对象。 |
| [`allContacts`](#从本地读取好友列表) | `ContactManager` | 获取缓存中的全部好友用户 ID。 |
| [`fetchAllContactsIDFromServer`](#从服务端主动获取好友列表) | `ContactManager` | 从服务端获取全部好友用户 ID。 |
| [`fetchAllContactsFromServer`](#从服务端主动获取好友列表) | `ContactManager` | 从服务端获取全部好友对象。 |
| [`fetchAllContactsFromServerByPage`](#从服务端主动获取好友列表) | `ContactManager` | 从服务端分页获取好友对象。 |
| [`getUserInfoWithUserId`](#从本地缓存获取单个用户属性) | `UserInfoManager` | 从本地用户属性缓存同步读取单个用户属性。 |
| [`addUsersToBlocklist`](#添加用户到黑名单) | `ContactManager` | 将一个或多个用户加入黑名单。 |
| [`removeUserFromBlockList`](#将用户从黑名单移除) | `ContactManager` | 将指定用户移出黑名单。 |
| [`getBlockListFromServer`](#从服务器获取黑名单列表) | `ContactManager` | 从服务器获取黑名单列表。 |
| [`blockList`](#从本地数据库获取黑名单列表) | `ContactManager` | 从本地缓存读取黑名单列表。 |
