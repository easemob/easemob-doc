# 管理用户关系

SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

- 好友管理：添加好友、处理好友申请、删除好友、设置好友备注、获取好友列表，以及在登录成功后自动同步好友列表和好友信息。
- 黑名单管理：获取黑名单列表，以及添加和移除黑名单用户。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 监听好友关系和好友信息变更

通过 `ChatContactEventHandler` 监听好友申请、接受、拒绝、添加、删除及好友信息变更。调用 `ChatContactManager.addEventHandler` 时需要传入唯一的处理器 ID；不再需要监听时，使用相同 ID 调用 `removeEventHandler`。好友数据同步状态通过 `ConnectionEventHandler` 监听，详见 [监听同步状态](#监听同步状态)。

:::tip
如需接收好友的用户属性变更通知，你需要先联系环信商务开通该功能。关于用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。
:::

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

该接口通过 `keepConversation` 参数控制是否保留与该好友的本地会话。按照 Dart API 定义及 Android 端的实际行为：

- `true`：保留本地会话及其消息。
- `false`：不保留本地会话及其消息，默认值为 `false`。

:::warning
Flutter 的 iOS 实现中，`keepConversation` 的行为与 Android 相反：`true` 删除本地会话，`false` 保留本地会话。因此，以下示例不能直接用于 iOS 保留会话的场景。集成时请确认所用版本是否已修复，并使用测试账号验证。
:::

```dart
Future<void> deleteContact(String userId) async {
  try {
    await ChatClient.getInstance.contactManager.deleteContact(
      userId,
      // 按 Dart API 定义保留会话；当前 iOS 桥接差异见上方警告。
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
| `userInfo` | `ChatUserInfo?` | 好友的用户属性；本地没有相关属性时为 `null`。 |
| `addTimestamp` | `int?` | 添加好友的毫秒级时间戳；当前对象不包含该信息时为 `null`。 |

#### 登录后自动同步好友列表

Flutter SDK 使用统一的数据同步配置。初始化 SDK 前，应在 `ChatOptions.dataSyncType` 中包含 `ChatDataSyncType.contacts`，以便用户登录成功后自动同步好友列表及好友信息，并更新原生 SDK 的本地数据。

```dart
Future<void> initializeChatSdk() async {
  final ChatOptions options = ChatOptions.withAppKey(
    'your_app_key',
    // 按位或组合需要同步的数据类型，contacts 表示好友数据。
    dataSyncType: ChatDataSyncType.conversations |
        ChatDataSyncType.contacts |
        ChatDataSyncType.joinedGroups,
  );

  await ChatClient.getInstance.init(options);
}
```

:::tip
必须在调用 `ChatClient.getInstance.init(options)` 前配置 `dataSyncType`。Flutter 层未设置时使用原生默认值，Android 5.0.0 与 iOS 5.0.0 的默认同步范围不同，因此应显式配置。`loginWithToken` 返回成功不代表好友数据已同步完成，应等待包含 `ChatDataSyncType.contacts` 的同步完成事件后读取最新本地数据。
:::

#### 监听同步状态

开启好友数据同步后，通过 `ConnectionEventHandler` 监听同步状态，使用 `type` 位掩码判断事件是否包含好友数据：

- `onDataSyncStart`：指定数据类型开始同步时触发，类型为 `void Function(int type)?`。
- `onDataSyncFinish`：指定数据类型同步结束时触发，类型为 `void Function(int type, ChatError? error)?`。`error == null` 表示同步成功，否则可通过 `error.code` 和 `error.description` 获取失败信息。
- `onContactInfoUpdate`：属于 `ChatContactEventHandler`，不是同步完成回调。原生 SDK 检测到好友信息更新时触发，返回更新后的 `ChatContact`，但不标识具体变更字段。类型为 `void Function(ChatContact contact)?`。用户属性更新还可通过 `ChatUserInfoEventHandler.onUserInfoUpdate` 处理。

以下示例在登录前注册同步监听器，并在好友数据同步成功后读取本地好友列表：

```dart
const String contactSyncHandlerId = 'contact_sync_handler';

void registerContactSyncEventHandler() {
  ChatClient.getInstance.addConnectionEventHandler(
    contactSyncHandlerId,
    ConnectionEventHandler(
      onDataSyncStart: (int type) {
        if ((type & ChatDataSyncType.contacts) != 0) {
          debugPrint('Contact sync started.');
        }
      },
      onDataSyncFinish: (int type, ChatError? error) async {
        // 只处理包含好友数据的同步事件。
        if ((type & ChatDataSyncType.contacts) == 0) return;
        if (error != null) {
          debugPrint(
            'Contact sync failed: '
            'code=${error.code}, description=${error.description}',
          );
          return;
        }

        try {
          // 同步成功后从本地读取好友数据，并按业务需要刷新 UI。
          final List<ChatContact> contacts =
              await ChatClient.getInstance.contactManager.getAllContacts();
          debugPrint('Synced contacts: ${contacts.length}');
        } on ChatError catch (readError) {
          debugPrint('Failed to read synced contacts: $readError');
        }
      },
    ),
  );
}

// 不再需要监听时，使用与注册时相同的 ID 移除监听器。
void unregisterContactSyncEventHandler() {
  ChatClient.getInstance.removeConnectionEventHandler(contactSyncHandlerId);
}
```

好友关系和信息变更的注册方式见 [监听好友关系和好友信息变更](#监听好友关系和好友信息变更)。同步成功后，可通过 `getAllContacts`、`getContact` 或 `getAllContactIds` 读取本地好友数据。

#### 从本地读取好友列表

好友数据同步成功后，可以调用以下接口读取原生 SDK 的本地数据。同步尚未完成时，读取结果可能为空或仍为上次同步的数据，不能据此判定服务端没有好友：

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

该读取方式不会发起网络请求，也不等同于 `fetchUserInfoById` 使用的 Dart 层缓存。关于该接口的说明，详见 [从本地内存读取用户属性](userprofile.html#从本地内存读取用户属性)。

### 设置仅给好友发消息

即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。开启后，服务端按好友关系校验消息投递；若用户向非好友用户发送单聊消息，发送会失败，错误码为 `221`（`USER_NOT_ON_ROSTER`）。Flutter 通过 `ChatMessageEvent.onError` 通知最终发送失败，不应仅根据 `await sendMessage` 返回判断发送成功，详见 [发送消息统一流程](message_send.html#发送消息统一流程)。

## 黑名单管理

黑名单与好友体系相互独立，主要用于管理需要屏蔽的用户。

### 添加用户到黑名单

若需屏蔽某个用户的消息，可调用 `ChatContactManager#addUserToBlockList` 将其加入黑名单。该操作适用于任何用户，无论是否为好友。被加入黑名单后，该用户将无法向你发送消息或好友申请；若该用户是好友，其好友关系仍会保留在好友列表中。

黑名单限制不是双向禁止发送：当前用户仍可向黑名单中的用户发送消息。

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
| [`deleteContact`](#删除好友) | `ChatContactManager` | `Future<void>` | 删除好友；`keepConversation` 的现有 iOS 桥接差异见对应章节。 |
| [`setContactRemark`](#设置好友备注) | `ChatContactManager` | `Future<void>` | 设置或清空好友备注。 |
| [`withAppKey`](#登录后自动同步好友列表) | `ChatOptions` | `ChatOptions` | 创建 SDK 配置，在 `dataSyncType` 中包含 `ChatDataSyncType.contacts` 以开启好友数据同步。 |
| [`dataSyncType`](#登录后自动同步好友列表) | `ChatOptions` | `int?`（属性） | 指定登录后自动同步的数据类型，多个类型使用按位或组合。 |
| [`init`](#登录后自动同步好友列表) | `ChatClient` | `Future<void>` | 使用指定配置初始化 SDK。 |
| [`getAllContacts`](#从本地读取好友列表) | `ChatContactManager` | `Future<List<ChatContact>>` | 获取本地全部好友对象。 |
| [`getContact`](#从本地读取好友列表) | `ChatContactManager` | `Future<ChatContact?>` | 获取本地指定好友对象。 |
| [`getAllContactIds`](#从本地读取好友列表) | `ChatContactManager` | `Future<List<String>>` | 获取本地全部好友用户 ID。 |
| [`getLocalUserInfoByIds`](#从本地内存获取用户属性) | `ChatUserInfoManager` | `Future<Map<String, ChatUserInfo>>` | 从原生 SDK 的本地数据读取一个或多个用户的属性，不发起网络请求。 |
| [`addUserToBlockList`](#添加用户到黑名单) | `ChatContactManager` | `Future<void>` | 将用户加入黑名单。 |
| [`removeUserFromBlockList`](#将用户从黑名单移除) | `ChatContactManager` | `Future<void>` | 将用户移出黑名单。 |
| [`fetchBlockIds`](#从服务器获取黑名单列表) | `ChatContactManager` | `Future<List<String>>` | 从服务器获取黑名单用户 ID 列表。 |
| [`getBlockIds`](#从本地数据库获取黑名单列表) | `ChatContactManager` | `Future<List<String>>` | 从本地数据库读取黑名单用户 ID 列表。 |
| [`addConnectionEventHandler`](#监听同步状态) | `ChatClient` | `void` | 添加数据同步等连接事件监听器。 |
| [`removeConnectionEventHandler`](#监听同步状态) | `ChatClient` | `void` | 按监听器 ID 移除连接事件监听器。 |
| [`onDataSyncStart`](#监听同步状态) | `ConnectionEventHandler` | `void Function(int)?` | 数据同步开始回调，需按位掩码判断是否包含好友数据。 |
| [`onDataSyncFinish`](#监听同步状态) | `ConnectionEventHandler` | `void Function(int, ChatError?)?` | 数据同步完成回调，需按位掩码筛选好友数据；错误为 `null` 表示成功。 |
| [`onContactInfoUpdate`](#监听同步状态) | `ChatContactEventHandler` | `void Function(ChatContact)?` | 好友信息变更回调。 |
