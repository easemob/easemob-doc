# 管理用户关系

SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

- 好友管理：添加好友、处理好友申请、删除好友、设置好友备注、获取好友列表，以及在登录成功后自动同步好友列表和好友信息。
- 黑名单管理：获取黑名单列表，以及添加和移除黑名单用户。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

Flutter SDK 通过 `ChatContactManager` 提供相关 API，并通过 `ChatContactEventHandler` 通知好友关系、好友同步状态及好友信息变更。所有 Manager 均通过 `ChatClient.getInstance` 获取。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 监听好友关系和好友信息变更

通过 `ChatContactEventHandler` 监听好友申请、接受、拒绝、添加、删除、好友同步状态及好友信息变更。调用 `ChatContactManager.addEventHandler` 时需要传入唯一的处理器 ID；不再需要监听时，使用相同 ID 调用 `removeEventHandler`。

```dart
const String contactHandlerId = 'contact_handler';

void registerContactEventHandler() {
  ChatClient.getInstance.contactManager.addEventHandler(
    contactHandlerId,
    ChatContactEventHandler(
      // 好友已添加。双方建立好友关系后，双方都会收到该事件。
      onContactAdded: (String userId) {
        debugPrint('Contact added: $userId');
      },
      // 好友被对方删除。用户 B 将用户 A 从好友列表中删除后，用户 A 收到该事件。
      onContactDeleted: (String userId) {
        debugPrint('Contact deleted: $userId');
      },
      // 收到好友申请。用户 B 向用户 A 发送好友请求，用户 A 收到该事件。
      onContactInvited: (String userId, String? reason) {
        debugPrint('Contact invited: userId=$userId, reason=$reason');
      },
      // 发出的好友申请被对方接受。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，同意加好友，则用户 A 收到该事件。
      onFriendRequestAccepted: (String userId) {
        debugPrint('Friend request accepted: $userId');
      },
      // 发出的好友申请被对方拒绝。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，拒绝加好友，则用户 A 收到该事件。
      onFriendRequestDeclined: (String userId) {
        debugPrint('Friend request declined: $userId');
      },
      // SDK 开始从服务器同步好友列表。
      onContactSyncStart: () {
        debugPrint('Contact sync started.');
      },
      // SDK 完成好友列表同步；error 为 null 表示同步成功。
      onContactSyncFinish: (ChatError? error) {
        if (error == null) {
          debugPrint('Contact sync succeeded.');
        } else {
          debugPrint(
            'Contact sync failed: '
            'code=${error.code}, description=${error.description}',
          );
        }
      },
      // 好友信息发生变更，contact 为更新后的好友对象。
      onContactInfoUpdate: (ChatContact contact) {
        debugPrint(
          'Contact info updated: '
          'userId=${contact.userId}, remark=${contact.remark}',
        );
      },
    ),
  );
}
// 不再需要监听时，移除监听器。
void unregisterContactEventHandler() {
  ChatClient.getInstance.contactManager.removeEventHandler(contactHandlerId);
}
```

:::tip
`addEventHandler` 以 `identifier` 为键保存事件处理器。使用同一个 `identifier` 再次添加处理器会替换原处理器，因此不同业务监听应使用不同且稳定的 ID。
:::

### 添加好友

添加好友用于建立稳定的单聊关系。对方接受申请后，双方成为彼此的好友。当前 SDK 仅支持双向好友关系，不支持单向好友或关注关系。

典型流程如下：

1. 调用 `ChatContactManager#addContact` 发起好友申请。
2. 对方通过 `ChatContactEventHandler#onContactInvited` 收到申请，并选择接受或拒绝。
3. 若对方接受，双方建立好友关系；若对方拒绝，本次申请结束。

你可以调用 `addContact` 发起好友申请：

```dart
Future<void> sendContactInvitation() async {
  const String userId = 'userId';
  const String reason = 'Request to add a friend.';

  try {
    await ChatClient.getInstance.contactManager.addContact(
      userId,
      reason: reason,
    );
    debugPrint('Contact invitation sent.');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to send contact invitation: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

接收方通过 `onContactInvited` 收到申请后，可按需接受或拒绝：

- 调用 `acceptInvitation` 接受好友申请。请求方会收到 `onFriendRequestAccepted`，双方都会收到 `onContactAdded`。
- 调用 `declineInvitation` 拒绝好友申请。请求方会收到 `onFriendRequestDeclined`。

接受好友申请：

```dart
Future<void> acceptContactInvitation(String userId) async {
  try {
    await ChatClient.getInstance.contactManager.acceptInvitation(userId);
  } on ChatError catch (error) {
    debugPrint(
      'Failed to accept invitation: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

拒绝好友申请：

```dart
Future<void> declineContactInvitation(String userId) async {
  try {
    await ChatClient.getInstance.contactManager.declineInvitation(userId);
  } on ChatError catch (error) {
    debugPrint(
      'Failed to decline invitation: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

:::tip
- 服务器不会重复下发好友申请事件。若业务需要展示待处理申请列表，建议在收到 `onContactInvited` 时在应用侧保存申请记录。
- 当前 SDK 不提供好友申请列表拉取接口。
:::

### 删除好友

调用 `ChatContactManager#deleteContact` 删除好友。删除好友后，对方好友列表中的该用户也会被移除，双方的好友关系都会解除，对方会收到 `onContactDeleted` 事件。该操作无需对方确认，建议在应用侧增加二次确认。

该接口提供 `keepConversation` 参数，用于控制是否保留与该好友相关的本地会话：

- `true`：保留本地会话及其消息。
- `false`：不保留本地会话及其消息，默认值为 `false`。

```dart
Future<void> deleteContact(String userId) async {
  try {
    await ChatClient.getInstance.contactManager.deleteContact(
      userId,
      keepConversation: true,
    );
    debugPrint('Contact deleted.');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to delete contact: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

### 设置好友备注

调用 `ChatContactManager#setContactRemark` 设置单个好友的备注。好友备注长度不能超过 100 个字符；传入空字符串可清空好友备注。

```dart
Future<void> updateContactRemark({
  required String userId,
  required String remark,
}) async {
  try {
    await ChatClient.getInstance.contactManager.setContactRemark(
      userId: userId,
      remark: remark,
    );
  } on ChatError catch (error) {
    debugPrint(
      'Failed to set contact remark: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

### 获取好友列表和好友信息

Flutter SDK 使用 `ChatContact` 表示好友对象。该对象包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `userId` | `String` | 好友的用户 ID。 |
| `remark` | `String` | 好友备注；未设置备注时通常为空字符串。 |
| `userInfo` | `ChatUserInfo?` | 好友的用户属性；本地没有相关属性时为 `null`。 该字段在 SDK 4.22.0 及以上版本支持。 |
| `addTimestamp` | `int?` | 添加好友的毫秒级时间戳；当前对象不包含该信息时为 `null`。该字段在 SDK 4.22.0 及以上版本支持。 |

#### 登录后自动同步好友列表

自 SDK 4.22.0 开始，可在初始化 SDK 前将 `ChatOptions#enableAutoSyncContacts` 设置为 `true`。用户登录成功后，SDK 会自动从服务器同步好友列表及好友信息，并更新原生 SDK 的本地数据。

```dart
Future<void> initializeChatSdk() async {
  final ChatOptions options = ChatOptions.withAppKey(
    'your_app_key',
    enableAutoSyncContacts: true,
  );

  await ChatClient.getInstance.init(options);
}
```

:::tip
必须在调用 `ChatClient.getInstance.init(options)` 前配置 `enableAutoSyncContacts: true`。该配置的默认值为 `false`。
:::

#### 监听同步状态

开启自动同步后，通过 `ChatContactEventHandler` 的以下回调监听同步状态：

- `onContactSyncStart`：SDK 开始从服务器同步好友列表时触发，类型为 `void Function()?`。
- `onContactSyncFinish`：同步结束时触发，类型为 `void Function(ChatError? error)?`。`error == null` 表示同步成功，否则可通过 `error.code` 和 `error.description` 获取失败信息。
- `onContactInfoUpdate`：好友信息发生变更时触发，类型为 `void Function(ChatContact contact)?`。

事件处理器的完整注册方式见 [监听好友关系和好友信息变更](#监听好友关系和好友信息变更)。同步成功后，可通过 `getAllContacts`、`getContact` 或 `getAllContactIds` 读取本地好友数据。

#### 主动从服务器获取好友列表

除登录后自动同步外，也可按业务需要主动从服务器获取好友列表：

- `fetchAllContacts`：一次性获取全部 `ChatContact` 对象，返回 `Future<List<ChatContact>>`。
- `fetchContacts`：分页获取 `ChatContact` 对象，返回 `Future<ChatCursorResult<ChatContact>>`。
- `fetchAllContactIds`：一次性获取全部好友用户 ID，返回 `Future<List<String>>`。

关于好友对象 `ChatContact` 包含的字段详见 [获取好友列表和好友信息](#获取好友列表和好友信息)。

- 一次性获取全部好友对象：

```dart
Future<void> fetchAllContacts() async {
  try {
    final List<ChatContact> contacts =
        await ChatClient.getInstance.contactManager.fetchAllContacts();

    for (final ChatContact contact in contacts) {
      debugPrint(
        'userId=${contact.userId}, remark=${contact.remark}, '
        'userInfo=${contact.userInfo}, '
        'addTimestamp=${contact.addTimestamp}',
      );
    }
  } on ChatError catch (error) {
    debugPrint(
      'Failed to fetch contacts: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

- 分页获取好友对象：

```dart
Future<String?> fetchContactsByPage({String? cursor}) async {
  try {
    final ChatCursorResult<ChatContact> result =
        await ChatClient.getInstance.contactManager.fetchContacts(
      // 首次调用可传 `null` 或省略    
      cursor: cursor,
      // 默认值为 `20`，取值范围为 1–50。
      pageSize: 20,
    );

    final List<ChatContact> contacts = result.data;
    debugPrint('Fetched ${contacts.length} contacts.');

    // 下一次请求传入该游标；为 null 或空字符串时表示没有更多数据。
    return result.cursor;
  } on ChatError catch (error) {
    debugPrint(
      'Failed to fetch contacts by page: '
      'code=${error.code}, description=${error.description}',
    );
    rethrow;
  }
}
```

- 仅获取好友用户 ID：

```dart
Future<void> fetchAllContactIds() async {
  try {
    final List<String> userIds =
        await ChatClient.getInstance.contactManager.fetchAllContactIds();
    debugPrint('Contact IDs: $userIds');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to fetch contact IDs: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

#### 从本地读取好友列表

好友数据同步成功或主动从服务器获取好友数据后，可以调用以下接口读取原生 SDK 的本地数据：

- `getAllContacts`：获取本地全部好友对象，返回 `Future<List<ChatContact>>`。
- `getContact`：获取本地指定好友对象，返回 `Future<ChatContact?>`；本地不存在该好友时返回 `null`。
- `getAllContactIds`：获取本地全部好友用户 ID，返回 `Future<List<String>>`。

关于好友对象 `ChatContact` 包含的字段详见 [获取好友列表和好友信息](#获取好友列表和好友信息)。

- 获取本地全部好友对象：

```dart
Future<void> getAllLocalContacts() async {
  try {
    final List<ChatContact> contacts =
        await ChatClient.getInstance.contactManager.getAllContacts();
    debugPrint('Local contacts: ${contacts.length}');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to get local contacts: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

- 获取本地指定好友对象：

```dart
Future<void> getLocalContact(String userId) async {
  try {
    final ChatContact? contact =
        await ChatClient.getInstance.contactManager.getContact(
      userId: userId,
    );

    if (contact != null) {
      final String contactUserId = contact.userId;
      final String remark = contact.remark;
      final ChatUserInfo? userInfo = contact.userInfo;
      final int? addTimestamp = contact.addTimestamp;

      debugPrint(
        'userId=$contactUserId, remark=$remark, '
        'userInfo=$userInfo, addTimestamp=$addTimestamp',
      );
    }
  } on ChatError catch (error) {
    debugPrint(
      'Failed to get local contact: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

- 获取本地全部好友用户 ID：

```dart
Future<void> getAllLocalContactIds() async {
  try {
    final List<String> userIds =
        await ChatClient.getInstance.contactManager.getAllContactIds();
    debugPrint('Local contact IDs: $userIds');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to get local contact IDs: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

#### 从本地内存获取用户属性

如果需要直接从原生 SDK 的本地内存读取一个或多个用户的属性，可以调用 `ChatUserInfoManager.getLocalUserInfoByIds`。该接口接收 `List<String>`，返回 `Future<Map<String, ChatUserInfo>>`；Map 的键为用户 ID，值为对应的 `ChatUserInfo`，而不是 `ChatContact`，可作为好友列表读取之外的补充资料读取方式。

关于该接口的说明，详见 [从本地内存读取用户属性](userinfo_provider.html#从本地内存读取用户属性)。

### 设置仅给好友发消息

即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。开启后，SDK 会在用户发起单聊时检查好友关系；若用户向非好友用户发送单聊消息，SDK 会返回错误码 `221`。

## 黑名单管理

黑名单与好友体系相互独立，主要用于管理需要屏蔽的用户。

### 添加用户到黑名单

若需屏蔽某个用户的消息，可调用 `ChatContactManager#ddUserToBlockList` 将其加入黑名单。该操作适用于任何用户，无论是否为好友。被加入黑名单后，该用户将无法向你发送消息或好友申请；若该用户是好友，其好友关系仍会保留在好友列表中。

```dart
Future<void> addUserToBlockList(String userId) async {
  try {
    await ChatClient.getInstance.contactManager.addUserToBlockList(userId);
    debugPrint('User added to block list.');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to add user to block list: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

### 将用户从黑名单移除

调用 `ChatContactManager#removeUserFromBlockList` 将用户从黑名单中移除。移除后，该用户发送消息或好友申请等行为将恢复。

```dart
Future<void> removeUserFromBlockList(String userId) async {
  try {
    await ChatClient.getInstance.contactManager.removeUserFromBlockList(userId);
    debugPrint('User removed from block list.');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to remove user from block list: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

### 从服务器获取黑名单列表

调用 `ChatContactManager.fetchBlockIds` 从服务器获取黑名单用户 ID 列表，返回类型为 `Future<List<String>>`。成功获取后，原生 SDK 会同步更新本地黑名单数据。

```dart
Future<void> fetchBlockIds() async {
  try {
    final List<String> blockedUserIds =
        await ChatClient.getInstance.contactManager.fetchBlockIds();
    debugPrint('Server block IDs: $blockedUserIds');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to fetch block IDs: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

### 从本地数据库获取黑名单列表

调用 `ChatContactManager.getBlockIds` 读取本地数据库中的黑名单用户 ID 列表，返回类型为 `Future<List<String>>`。若需要确保数据为服务端最新状态，可先调用 `fetchBlockIds` 更新本地数据，再进行读取。

```dart
Future<void> getLocalBlockIds() async {
  try {
    final List<String> blockedUserIds =
        await ChatClient.getInstance.contactManager.getBlockIds();
    debugPrint('Local block IDs: $blockedUserIds');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to get local block IDs: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`addEventHandler`](#监听好友关系和好友信息变更) | `ChatContactManager` | `void` | 添加联系人事件处理器。 |
| [`removeEventHandler`](#监听好友关系和好友信息变更) | `ChatContactManager` | `void` | 按处理器 ID 移除联系人事件处理器。 |
| [`addContact`](#添加好友) | `ChatContactManager` | `Future<void>` | 发起好友申请。 |
| [`acceptInvitation`](#添加好友) / [`declineInvitation`](#添加好友) | `ChatContactManager` | `Future<void>` | 接受或拒绝好友申请。 |
| [`deleteContact`](#删除好友) | `ChatContactManager` | `Future<void>` | 删除好友，并通过 `keepConversation` 决定是否保留本地会话及消息。 |
| [`setContactRemark`](#设置好友备注) | `ChatContactManager` | `Future<void>` | 设置或清空好友备注。 |
| [`withAppKey`](#登录后自动同步好友列表) | `ChatOptions` | `ChatOptions` | 创建 SDK 配置，并通过 `enableAutoSyncContacts` 开启登录后自动同步好友数据。 |
| [`init`](#登录后自动同步好友列表) | `ChatClient` | `Future<void>` | 使用指定配置初始化 SDK。 |
| [`fetchAllContacts`](#主动从服务器获取好友列表) | `ChatContactManager` | `Future<List<ChatContact>>` | 从服务器一次性获取全部好友对象。 |
| [`fetchContacts`](#主动从服务器获取好友列表) | `ChatContactManager` | `Future<ChatCursorResult<ChatContact>>` | 从服务器分页获取好友对象。 |
| [`fetchAllContactIds`](#主动从服务器获取好友列表) | `ChatContactManager` | `Future<List<String>>` | 从服务器一次性获取全部好友用户 ID。 |
| [`getAllContacts`](#从本地读取好友列表) | `ChatContactManager` | `Future<List<ChatContact>>` | 获取本地全部好友对象。 |
| [`getContact`](#从本地读取好友列表) | `ChatContactManager` | `Future<ChatContact?>` | 获取本地指定好友对象。 |
| [`getAllContactIds`](#从本地读取好友列表) | `ChatContactManager` | `Future<List<String>>` | 获取本地全部好友用户 ID。 |
| [`getLocalUserInfoByIds`](#从本地内存获取用户属性) | `ChatUserInfoManager` | `Future<Map<String, ChatUserInfo>>` | 从本地内存读取一个或多个用户的用户属性。 |
| [`addUserToBlockList`](#添加用户到黑名单) | `ChatContactManager` | `Future<void>` | 将用户加入黑名单。 |
| [`removeUserFromBlockList`](#将用户从黑名单移除) | `ChatContactManager` | `Future<void>` | 将用户移出黑名单。 |
| [`fetchBlockIds`](#从服务器获取黑名单列表) | `ChatContactManager` | `Future<List<String>>` | 从服务器获取黑名单用户 ID 列表。 |
| [`getBlockIds`](#从本地数据库获取黑名单列表) | `ChatContactManager` | `Future<List<String>>` | 从本地数据库读取黑名单用户 ID 列表。 |
| [`onContactSyncStart`](#监听同步状态) | `ChatContactEventHandler` | `void Function()?` | 好友同步开始回调。 |
| [`onContactSyncFinish`](#监听同步状态) | `ChatContactEventHandler` | `void Function(ChatError?)?` | 好友同步完成回调；参数为 `null` 表示成功。 |
| [`onContactInfoUpdate`](#监听同步状态) | `ChatContactEventHandler` | `void Function(ChatContact)?` | 好友信息变更回调。 |
