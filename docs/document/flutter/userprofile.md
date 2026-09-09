# 管理用户属性

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名和生日等。例如，在招聘场景下，可以通过扩展字段存储用户类型（面试者）、职位类型（Web 研发）等业务信息。

SDK 通过 `ChatUserInfoManager` 提供用户属性的设置、获取、订阅和事件监听能力。所有 Manager 均通过 `ChatClient.getInstance` 获取。

:::tip
为保证用户信息安全，SDK 仅支持当前登录用户设置或更新自己的用户属性。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM 的相关使用限制，详见 [使用限制](/product/limitation.html)。

## 使用限制

- 单个用户的全部属性最大不超过 2 KB。
- 单个 app 的全部用户属性数据最大不超过 10 GB。
- 调用设置或获取用户属性的相关接口超过频率限制时，会返回错误码 `4`（`EXCEED_SERVICE_LIMIT`）。

## 设置当前用户的属性

调用 `ChatUserInfoManager#updateUserInfo` 设置或更新当前登录用户的一个或多个属性。

```dart
Future<void> updateCurrentUserInfo() async {
  try {
    final ChatUserInfo userInfo =
        await ChatClient.getInstance.userInfoManager.updateUserInfo(
      nickname: 'easemob',
      avatarUrl: 'https://www.easemob.com/avatar.png',
      mail: 'user@example.com',
      phone: '13333333333',
      gender: 1,
      sign: 'hello world',
      birth: '2000.10.10',
      ext: '{"userType":"candidate","jobType":"web"}',
    );

    debugPrint(
      'User info updated: '
      'userId=${userInfo.userId}, nickName=${userInfo.nickName}',
    );
  } on ChatError catch (error) {
    debugPrint(
      'Failed to update user info: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

关于用户属性，客户端针对用户的昵称、头像 URL、联系方式、邮箱、性别、签名、生日和扩展字段默认使用以下键名。[调用 RESTful 接口设置](/document/server-side/user_attribute_set.html) 或 [删除用户属性](/document/server-side/user_attribute_delete.html) 时，若要确保在客户端能够获取设置，请求中必须传以下键名与客户端保持一致，键值可根据实际使用场景确定。

| 字段        | 类型   | 描述                                                                                              |
| :---------- | :----- | :------------------------------------------------------------------------------------------------ |
| `nickname`  | String | 用户昵称。长度不超过 64 字符。                                                                    |
| `avatarurl` | String | 用户头像 URL。长度不超过 256 字符。                                                               |
| `phone`     | String | 用户联系方式。长度不超过 32 字符。                                                                |
| `mail`      | String | 用户邮箱。长度不超过 64 字符。                                                                    |
| `gender`    | Int    | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 其他值无效。       |
| `sign`      | String | 用户签名。长度不超过 256 字符。                                                                   |
| `birth`     | String | 用户生日。长度不超过 64 字符。                                                                    |
| `ext`       | String | 扩展字段。                                                                                        |

:::tip
`userId` 由原生 SDK 根据当前登录用户自动设置，`updateUserInfo` 不接收 `userId` 参数。
:::

## 获取用户属性

### 获取当前用户的属性

调用 `ChatUserInfoManager#fetchOwnInfo` 获取当前登录用户的属性。该方法返回 `Future<ChatUserInfo?>`。

可通过 `expireTime` 设置 Dart 层缓存有效期，单位为秒，默认值为 `0`。

在缓存有效期内再次调用时，SDK 返回上次获取的数据；缓存过期后重新请求原生层。用户未登录时，调用会抛出 `ChatError`。

```dart
Future<void> fetchCurrentUserInfo() async {
  try {
    final ChatUserInfo? userInfo =
        await ChatClient.getInstance.userInfoManager.fetchOwnInfo(
          
      expireTime: 120,
    );

    if (userInfo != null) {
      debugPrint(
        'Current user: '
        'userId=${userInfo.userId}, nickName=${userInfo.nickName}',
      );
    }
  } on ChatError catch (error) {
    debugPrint(
      'Failed to fetch current user info: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

### 从服务端获取用户的所有属性

调用 `ChatUserInfoManager.fetchUserInfoById` 获取一个或多个用户的全部属性。每次传入的用户 ID 数量不超过 100 个。

该方法返回 `Future<Map<String, ChatUserInfo>>`，Map 的键为用户 ID，值为对应的用户属性。`expireTime` 为 Dart 层缓存有效期，单位为秒，默认值为 `0`；设置为大于 `0` 的值时，在有效期内可复用上次获取的数据，减少重复请求。

```dart
Future<void> fetchUsersInfo() async {
  const List<String> userIds = <String>['user1', 'user2'];

  try {
    final Map<String, ChatUserInfo> userInfoMap =
        await ChatClient.getInstance.userInfoManager.fetchUserInfoById(
      userIds,
      expireTime: 120,
    );

    for (final MapEntry<String, ChatUserInfo> entry
        in userInfoMap.entries) {
      debugPrint(
        'User info: key=${entry.key}, '
        'nickName=${entry.value.nickName}, '
        'avatarUrl=${entry.value.avatarUrl}',
      );
    }
  } on ChatError catch (error) {
    debugPrint(
      'Failed to fetch user info: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

开启 [用户信息自动管理功能](userinfo_provider.html) 后，如果原生 SDK 获取到的用户属性更新时间戳晚于本地数据，会更新原生 SDK 本地数据并通过 `ChatUserInfoEventHandler#onUserInfoUpdate` 通知业务层。

### 从服务端获取用户的指定属性

如需读取指定属性，可调用 `fetchUserInfoById` 获取用户的完整 `ChatUserInfo`，再读取 `nickName`、`avatarUrl`、`phone`、`mail` 等所需字段。

### 从服务器获取当前用户的属性

调用 `fetchOwnInfo` 获取当前用户的用户属性，并支持缓存：
- （默认）`expireTime` = `0`：直接从服务器获取。
- `expireTime` > `0`：缓存未过期时返回缓存数据；缓存过期后从服务器获取。

```dart
try {
  ChatUserInfo? userInfo =
      await ChatClient.getInstance.userInfoManager.fetchOwnInfo(
    expireTime: 120,
  );
} on ChatError catch (e) {
  // 获取当前用户属性失败，返回错误信息。
}
```

### 从本地内存读取用户属性

调用 `ChatUserInfoManager#getLocalUserInfoByIds` 从 原生 SDK 的本地数据中读取一个或多个用户的属性。该方法不会发起网络请求，接收 `List<String>`，返回 `Future<Map<String, ChatUserInfo>>`；本地没有数据的用户可能不会包含在返回的 Map 中。

```dart
Future<void> getLocalUsersInfo() async {
  const List<String> userIds = <String>['user1', 'user2'];

  try {
    final Map<String, ChatUserInfo> userInfoMap =
        await ChatClient.getInstance.userInfoManager.getLocalUserInfoByIds(
      userIds,
    );

    for (final ChatUserInfo userInfo in userInfoMap.values) {
      debugPrint(
        'Local user info: '
        'userId=${userInfo.userId}, nickName=${userInfo.nickName}',
      );
    }
  } on ChatError catch (error) {
    debugPrint(
      'Failed to get local user info: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

:::tip
如需 SDK 在登录成功后自动同步好友列表及好友信息，需在初始化前设置 `ChatOptions.withAppKey` 的 `enableAutoSyncContacts: true`。同步完成后，可通过 `ChatContactManager#getAllContacts`、`getContact` 或 `getAllContactIds` 读取本地好友数据。详见 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)。
:::

## 订阅非好友用户的属性变更

SDK 从 4.22.0 版本开始支持订阅非好友用户的属性变更。订阅后，非好友用户的属性发生变化时，应用可以及时收到通知。

该功能适用于以下场景：

- 非好友会话中，需要及时更新对方昵称、头像等属性。
- 临时会话、客服沟通等场景中，需要感知非好友用户的属性变更。
- 群成员展示等场景中，需要维护指定非好友用户的最新用户属性。

:::tip
本功能只适用于非好友用户。关于当前用户、非好友用户和好友相关的用户属性变更通知，详见 [监听用户属性变更](#监听用户属性变更)。
:::

### 订阅非好友用户属性变更事件

调用 `ChatUserInfoManager#subscribeUsersInfo` 订阅订阅非好友用户属性变更事件。该方法接收 `List<String>`，返回 `Future<void>`。订阅成功后，当这些用户的属性发生变更时，SDK 会触发 [ChatUserInfoEventHandler#onUserInfoUpdate](#监听用户属性变更) 事件。

```dart
Future<void> subscribeUsersInfo() async {
  const List<String> userIds = <String>['user1', 'user2'];

  try {
    await ChatClient.getInstance.userInfoManager.subscribeUsersInfo(userIds);
    debugPrint('Subscribed to user info updates.');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to subscribe: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

### 取消订阅非好友用户属性变更事件

调用 `ChatUserInfoManager.unsubscribeUsersInfo` 取消订阅非好友用户的属性变更事件。

```dart
Future<void> unsubscribeUsersInfo() async {
  const List<String> userIds = <String>['user1', 'user2'];

  try {
    await ChatClient.getInstance.userInfoManager.unsubscribeUsersInfo(userIds);
    debugPrint('Unsubscribed from user info updates.');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to unsubscribe: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

### 获取已订阅用户的属性列表

调用 `ChatUserInfoManager.fetchSubscribedUsers` 获取当前用户已订阅的用户列表及其用户属性。该方法返回 `Future<List<ChatUserInfo>>`，包含被订阅的非好友用户的用户 ID 及其用户属性。

```dart
Future<void> fetchSubscribedUsers() async {
  try {
    final List<ChatUserInfo> users =
        await ChatClient.getInstance.userInfoManager.fetchSubscribedUsers();

    for (final ChatUserInfo userInfo in users) {
      debugPrint(
        'Subscribed user: '
        'userId=${userInfo.userId}, nickName=${userInfo.nickName}',
      );
    }
  } on ChatError catch (error) {
    debugPrint(
      'Failed to fetch subscribed users: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

### 内存说明

如果未订阅非好友用户的属性变更，应用通常需要在业务需要时主动调用 `fetchUserInfoById` 获取最新属性。为减少不必要的网络请求，可通过 `expireTime` 复用 Dart 层缓存，或先调用 `getLocalUserInfoByIds` 读取原生 SDK 本地数据，再按业务需要决定是否重新请求服务端。

## 监听用户属性变更

通过 `ChatUserInfoEventHandler` 监听当前用户及其他用户的属性更新：

- `onSelfUserInfoUpdate`：当前登录用户的属性同步或更新回调，参数类型为 `ChatUserInfo`。
- `onUserInfoUpdate`：其他用户的属性更新回调，参数类型为 `List<ChatUserInfo>`。

其他用户的属性可能在以下场景中更新：

1. **主动获取更新**：调用 [从服务端获取用户属性](#从服务端获取用户的所有属性) 或 [从服务端获取群成员信息](group_members.html#获取群成员列表)，若服务端数据较新，原生 SDK 更新本地数据并触发事件。
2. **消息携带更新**：初始化 SDK 时启用 [用户信息自动管理功能](userinfo_provider.html#开启用户信息自动管理) 后，收到消息时若发送方属性较新，原生 SDK 自动获取最新数据并触发事件。该机制对好友与非好友发送方均生效。
3. **订阅用户变更（仅限非好友）**：已调用 `subscribeUsersInfo` 的非好友用户属性发生变化时触发事件。

**特殊说明**

- **当前用户**：当前用户的属性变更通过 `onSelfUserInfoUpdate` 单独回调。
- **好友信息**：如果启用了 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)，好友信息发生变化时还会触发 `ChatContactEventHandler#onContactInfoUpdate(ChatContact contact)`。该事件属于好友关系管理，与 `onUserInfoUpdate` 区分。

调用 `ChatUserInfoManager.addEventHandler` 注册事件处理器。不再需要监听时，使用相同的处理器 ID 调用 `removeEventHandler`。

```dart
const String userInfoHandlerId = 'user_info_handler';

void registerUserInfoEventHandler() {
  ChatClient.getInstance.userInfoManager.addEventHandler(
    userInfoHandlerId,
    ChatUserInfoEventHandler(
      onSelfUserInfoUpdate: (ChatUserInfo userInfo) {
        debugPrint(
          'Self user info updated: '
          'userId=${userInfo.userId}, nickName=${userInfo.nickName}',
        );
      },
      onUserInfoUpdate: (List<ChatUserInfo> userInfos) {
        for (final ChatUserInfo userInfo in userInfos) {
          debugPrint(
            'User info updated: '
            'userId=${userInfo.userId}, nickName=${userInfo.nickName}',
          );
        }
      },
    ),
  );
}

void unregisterUserInfoEventHandler() {
  ChatClient.getInstance.userInfoManager.removeEventHandler(
    userInfoHandlerId,
  );
}
```

:::tip
事件处理器以 `identifier` 为键保存。使用同一个 ID 再次调用 `addEventHandler` 会替换原处理器，因此不同业务监听应使用不同且稳定的 ID。建议在登录前完成注册，以免遗漏登录后的初始同步事件。
:::

## `ChatUserInfo` 数据结构

`ChatUserInfo` 的公开字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `userId` | `String` | 用户 ID。 |
| `nickName` | `String?` | 用户昵称。注意字段名为 `nickName`。 |
| `avatarUrl` | `String?` | 用户头像 URL。 |
| `mail` | `String?` | 用户邮箱。 |
| `phone` | `String?` | 用户手机号。 |
| `gender` | `int` | 用户性别：`0` 为未知，`1` 为男，`2` 为女。 |
| `sign` | `String?` | 用户签名。 |
| `birth` | `String?` | 用户生日。 |
| `ext` | `String?` | 用户自定义扩展信息。 |

`ChatUserInfo` 还包含 SDK 用于判断 Dart 层缓存有效期的 `expireTime` 字段。该字段不是服务端用户属性，业务不应将其作为用户资料展示或上传。

## 常见问题

### 设置了用户昵称，为什么获取不到？

如果已通过客户端或 RESTful API 设置用户昵称，但后续未能正确获取，请检查以下事项：

- 调用 RESTful 接口设置用户昵称时，请求中必须使用 `nickname` 键名；SDK 中对应的读取字段为 `ChatUserInfo.nickName`。
- RESTful API [获取用户详情](/document/server-side/account_detail_obtain_single.html) 和 [删除用户账户](/document/server-side/account_delete_single.html) 返回的 `nickname` 表示推送昵称，即离线推送通知中显示的昵称，与用户属性昵称不同。建议两者保持一致；修改其中一个昵称时，也同步更新另一个昵称。

SDK 可调用 `ChatPushManager.updatePushNickname(String nickname)` 更新推送昵称：

```dart
await ChatClient.getInstance.pushManager.updatePushNickname('easemob');
```

### 为什么会返回错误码 4？

设置和获取用户属性的相关接口超过调用频率限制时，会抛出错误码为 `4`（`EXCEED_SERVICE_LIMIT`）的 `ChatError`。请降低调用频率，并合理使用 `expireTime` 和本地读取接口减少重复请求。

## 相关功能

### 用户头像管理

如果你的业务涉及用户头像管理，可参考以下流程：

1. 开通第三方文件存储服务。
2. 将头像文件上传到第三方存储，并获取文件 URL。
3. 调用 `updateUserInfo(avatarUrl: url)` 将 URL 写入当前用户的属性。
4. 调用 `fetchUserInfoById` 获取用户属性，并通过 `ChatUserInfo.avatarUrl` 在 UI 中展示头像。

### 名片消息

如果业务中需要发送名片消息，可以使用 `ChatMessage.createCustomSendMessage` 创建自定义消息，将事件名设置为 `userCard`，并在 `params` 中添加展示名片所需的用户 ID、昵称和头像 URL：

```dart
Future<void> sendUserCard(
  String targetId,
  ChatUserInfo userInfo,
) async {
  final Map<String, String> params = <String, String>{
    'userId': userInfo.userId,
  };

  if (userInfo.nickName != null) {
    params['nickname'] = userInfo.nickName!;
  }
  if (userInfo.avatarUrl != null) {
    params['avatarUrl'] = userInfo.avatarUrl!;
  }

  final ChatMessage message = ChatMessage.createCustomSendMessage(
    targetId: targetId,
    event: 'userCard',
    params: params,
  );

  await ChatClient.getInstance.chatManager.sendMessage(message);
}
```

如需展示更多名片信息，可继续在 `params` 中扩展字符串键值对。Flutter 单群聊 UIKit 的源码可参考 [GitHub](https://github.com/easemob/easemob-uikit-flutter)。

### 用户属性与用户信息

用户信息指用于业务展示的用户相关信息，包括用户属性、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。如需自动维护这些信息，详见 [用户信息自动管理](userinfo_provider.html)。

## 接口列表

| API | 所属类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`updateUserInfo`](#设置当前用户的所有属性) | `ChatUserInfoManager` | `Future<ChatUserInfo>` | 设置或更新当前用户的一个或多个属性。 |
| [`fetchOwnInfo`](#获取当前用户的属性) | `ChatUserInfoManager` | `Future<ChatUserInfo?>` | 获取当前登录用户的属性。 |
| [`fetchUserInfoById`](#从服务端获取用户的所有属性) | `ChatUserInfoManager` | `Future<Map<String, ChatUserInfo>>` | 获取一个或多个用户的全部属性。 |
| [`getLocalUserInfoByIds`](#从本地内存读取用户属性) | `ChatUserInfoManager` | `Future<Map<String, ChatUserInfo>>` | 从原生 SDK 本地数据中读取指定用户的属性，不发起网络请求。 |
| [`subscribeUsersInfo`](#订阅非好友用户属性变更事件) | `ChatUserInfoManager` | `Future<void>` | 订阅非好友用户的属性变更。 |
| [`unsubscribeUsersInfo`](#取消订阅非好友用户属性变更事件) | `ChatUserInfoManager` | `Future<void>` | 取消订阅非好友用户的属性变更。 |
| [`fetchSubscribedUsers`](#获取已订阅用户的属性列表) | `ChatUserInfoManager` | `Future<List<ChatUserInfo>>` | 获取当前用户已订阅的用户及其属性。 |
| [`addEventHandler`](#监听用户属性变更) | `ChatUserInfoManager` | `void` | 添加用户属性事件处理器。 |
| [`removeEventHandler`](#监听用户属性变更) | `ChatUserInfoManager` | `void` | 移除指定的用户属性事件处理器。 |
