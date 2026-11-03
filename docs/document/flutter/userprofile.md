# 管理用户属性

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名和生日等。例如，在招聘场景下，可以通过扩展字段存储用户类型（面试者）、职位类型（Web 研发）等业务信息。

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

该方法返回 `Future<ChatUserInfo>`，并将返回对象写入 Dart 层缓存。Android 桥接返回本次提交的用户属性对象，不保证包含未提交字段的完整服务端资料；如需读取完整资料，应清理 Dart 缓存后再调用 `fetchOwnInfo`。

```dart
Future<void> updateCurrentUserInfo() async {
  try {
    final ChatUserInfo userInfo =
        await ChatClient.getInstance.userInfoManager.updateUserInfo(
      // 设置昵称时参数名为 nickname，读取字段名为 ChatUserInfo.nickName。
      nickname: 'easemob',
      avatarUrl: 'https://www.easemob.com/avatar.png',
      mail: 'user@example.com',
      phone: '13333333333',
      // 显式设置性别，保留原性别时应传入已有值。
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
- `userId` 由原生 SDK 根据当前登录用户自动设置，`updateUserInfo` 不接收 `userId` 参数。
- Dart 层只传递非 `null` 参数，不能将 `null` 理解为删除服务端属性；字符串字段如需清空，可传入空字符串。
- 当前桥接会构造新的原生用户属性对象，未填写 `gender` 时原生对象使用默认值 `0`。若只更新昵称、头像等字段且需要保留既有性别，应显式传入已有的 `gender`，不能假定省略该参数就会保留原值。
:::

## 获取用户属性

### 获取当前用户的属性

调用 `ChatUserInfoManager#fetchOwnInfo` 获取当前登录用户的属性，返回 `Future<ChatUserInfo?>`。

该方法先获取当前用户 ID，再复用 `fetchUserInfoById` 的 Dart 层缓存逻辑。可通过 `expireTime` 设置缓存有效期，单位为秒，默认值为 `0`。

- `expireTime = 0`：不设置正时长的缓存有效期，通常会通过原生 SDK 重新获取属性。由于缓存有效期按毫秒判断，同一毫秒内再次调用仍可能复用缓存。如需强制绕过已有 Dart 缓存，应先调用 `clearUserInfoCache()`。
- `expireTime > 0`：从缓存对象创建时起，在指定有效期内复用数据；超过有效期后，通过原生 SDK 重新获取属性并更新缓存。命中缓存的读取不会延长有效期。

无法获取当前用户 ID 时，调用会抛出错误码为 `201` 的 `ChatError`。虽然返回类型为 `ChatUserInfo?`，但当前实现会读取结果 Map 中的第一个对象；若获取结果为空，可能抛出 `StateError`，而不是返回 `null`。业务侧不应仅依赖返回值是否为 `null` 判断获取结果。

```dart
Future<void> fetchCurrentUserInfo() async {
  try {
    final ChatUserInfo? userInfo =
        await ChatClient.getInstance.userInfoManager.fetchOwnInfo(
      // 有效期内可复用 Dart 层缓存，不保证每次都请求服务端。
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
  } on StateError catch (error) {
    // 当前实现取结果中的第一个对象，空结果可能导致 StateError。
    debugPrint('No current user info was returned: $error');
  }
}
```

### 从服务端获取用户的属性

- 调用 `ChatUserInfoManager.fetchUserInfoById` 获取一个或多个用户的全部属性。每次传入的用户 ID 数量不超过 100 个。Flutter SDK 不会自动拆分请求；超过 100 个用户时，需由业务侧分批调用。

该方法返回 `Future<Map<String, ChatUserInfo>>`，Map 的键为用户 ID，值为对应的用户属性。`expireTime` 为 Dart 层缓存有效期，具体规则见 [获取当前用户的属性](#获取当前用户的属性)。该参数的单位为秒，默认值为 `0`；设置为大于 `0` 的值时，在有效期内可复用缓存对象，减少重复请求。缓存按每个用户分别判断，只将未缓存或已过期的用户 ID 传给原生 SDK；最终结果可能同时包含缓存数据与本次获取的数据。

- 该方法不支持按指定字段获取属性。如需读取指定属性，应先获取完整的 `ChatUserInfo`，再读取 `nickName`、`avatarUrl`、`phone`、`mail` 等所需字段。

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

如果原生 SDK 获取到的用户属性更新时间戳晚于本地数据，会更新原生 SDK 本地数据并通过 `ChatUserInfoEventHandler#onUserInfoUpdate` 通知业务层。

上述原生更新通知不会自动刷新 `fetchUserInfoById` 使用的 Dart 层缓存。收到通知后，可直接使用回调数据更新界面；如需绕过已有 Dart 缓存重新获取服务端数据，可先调用 `ChatClient.getInstance.userInfoManager.clearUserInfoCache()`，再调用 `fetchUserInfoById(userIds)`。

返回结果不保证包含全部传入用户。若原生 SDK 未返回某个用户的数据，该用户已有的 Dart 缓存仍可能保留在返回的 Map 中，因此不能将返回结果中的所有对象都视为本次从服务端获取的最新数据。

### 从本地内存读取用户属性

调用 `ChatUserInfoManager#getLocalUserInfoByIds` 从原生 SDK 的本地数据中读取一个或多个用户的属性。该方法不会发起网络请求，接收 `List<String>`，返回 `Future<Map<String, ChatUserInfo>>`；本地没有数据的用户可能不会包含在返回的 Map 中。

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

开启[用户信息自动管理功能](userinfo_provider.html)后，接收方收到携带发送方用户信息的消息时，如果消息中的用户属性更新时间晚于本地缓存，SDK 会自动从服务端获取最新用户属性并更新本地缓存，该机制不受双方好友关系影响。

如需 SDK 在登录成功后自动同步好友列表及好友信息，应在初始化前通过 `ChatOptions.withAppKey` 配置 `dataSyncType`，使其包含 `ChatDataSyncType.contacts`。在 `ConnectionEventHandler.onDataSyncFinish` 的 `type` 包含好友数据且 `error == null` 后，可通过 `ChatContactManager#getAllContacts`、`getContact` 或 `getAllContactIds` 读取本地好友数据。详见 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)。

## 订阅非好友用户的属性变更

SDK 支持订阅非好友用户的属性变更。订阅后，指定非好友用户的属性发生变化时，应用可以及时收到通知。

该功能适用于以下场景：

- 非好友会话中，需要及时更新对方昵称、头像等属性。
- 临时会话、客服沟通等场景中，需要感知非好友用户的属性变更。
- 群成员展示等场景中，需要维护指定非好友用户的最新用户属性。

:::tip
使用非好友用户属性变更订阅功能前，你需要联系环信商务开通该功能。

本功能只适用于非好友用户。关于当前用户、非好友用户和好友相关的用户属性变更通知详情，详见 [监听用户属性变更](#监听用户属性变更)。
:::

### 订阅非好友用户属性变更事件

调用 `ChatUserInfoManager#subscribeUsersInfo` 订阅非好友用户属性变更事件。该方法接收 `List<String>`，返回 `Future<void>`。订阅成功后，当这些用户的属性发生变更时，SDK 会触发 [ChatUserInfoEventHandler#onUserInfoUpdate](#监听用户属性变更) 事件。

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

如果未订阅非好友用户的属性变更，应用通常需要在业务需要时主动调用 `fetchUserInfoById` 获取属性。为减少不必要的网络请求，可通过 `expireTime` 复用 Dart 层缓存，或先调用 `getLocalUserInfoByIds` 读取原生 SDK 本地数据，再按业务需要决定是否重新请求服务端。

Dart 层缓存与原生 SDK 本地数据相互独立。调用 `getLocalUserInfoByIds`、`fetchSubscribedUsers` 或收到用户属性更新事件，均不会自动刷新 Dart 层缓存。收到更新事件后，可直接使用回调数据更新界面；如需绕过已有缓存重新获取服务端数据，可先调用 `clearUserInfoCache()`，再调用 `fetchUserInfoById`。

`clearUserInfoCache()` 仅清理 Dart 层用户属性缓存，不删除原生 SDK 本地数据，也不取消用户属性订阅。调用 `logout()` 成功后，SDK 也会清理该 Dart 缓存。

## 监听用户属性变更

通过 `ChatUserInfoEventHandler` 监听当前用户及其他用户的属性更新：

- `onSelfUserInfoUpdate`：当前登录用户的属性同步或更新回调，参数类型为 `ChatUserInfo`。
- `onUserInfoUpdate`：其他用户的属性更新回调，参数类型为 `List<ChatUserInfo>`。

其他用户的属性可能在以下场景中更新：

1. **主动获取更新**：主动调用 [从服务端获取用户属性](#从服务端获取用户的属性) 或 [从服务端获取群成员信息](group_members.html#获取群成员列表) 的接口时，若请求实际到达原生 SDK 且服务端数据较新，原生 SDK 可能更新本地数据并触发事件。命中 Dart 缓存的属性读取不会因本次读取产生新的原生属性更新通知。
2. **消息携带更新**：初始化 SDK 时启用 [用户信息自动管理功能](userinfo_provider.html#开启用户信息自动管理) 后，收到消息时若发送方属性较新，原生 SDK 自动获取最新数据并触发事件。该机制对好友与非好友发送方均生效。
3. **订阅用户变更（仅限非好友）**：已调用 `subscribeUsersInfo` 的非好友用户属性发生变化时触发事件。

**特殊说明**

- **当前用户**：当前用户的属性变更通过 `onSelfUserInfoUpdate` 单独回调。
- **好友信息**：好友数据可通过 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表) 维护，好友信息更新由 `ChatContactEventHandler#onContactInfoUpdate(ChatContact contact)` 通知。该事件属于好友关系管理，不是同步完成事件，也不能假定每次用户属性更新都会同时触发该事件和 `onUserInfoUpdate`。
- 如需接收好友的用户属性变更通知，或订阅非好友用户的属性变更通知，你需要联系环信商务开通该功能后方可使用。

调用 `ChatUserInfoManager.addEventHandler` 注册事件处理器。不再需要监听时，使用相同的处理器 ID 调用 `removeEventHandler`。

```dart
const String userInfoHandlerId = 'user_info_handler';

void registerUserInfoEventHandler() {
  ChatClient.getInstance.userInfoManager.addEventHandler(
    userInfoHandlerId,
    ChatUserInfoEventHandler(
      onSelfUserInfoUpdate: (ChatUserInfo userInfo) {
        // 使用回调中的当前用户资料更新展示，不依赖旧的 Dart 缓存。
        debugPrint(
          'Self user info updated: '
          'userId=${userInfo.userId}, nickName=${userInfo.nickName}',
        );
      },
      onUserInfoUpdate: (List<ChatUserInfo> userInfos) {
        // 使用更新后的对象刷新业务资料；回调不会自动更新 Dart 层缓存。
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

`ChatUserInfo` 还包含 SDK 用于判断 Dart 层缓存有效期的 `expireTime` 字段。该字段实际记录当前 Dart 对象创建时的毫秒级时间戳，与获取方法中单位为秒的 `expireTime` 参数不同；它不是服务端用户属性，也不参与 `toJson()` 的用户属性序列化，业务不应将其作为用户资料展示或上传。

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
3. 调用 `updateUserInfo(avatarUrl: url, gender: existingGender)` 将 URL 写入当前用户的属性。`existingGender` 为已有性别，显式传入以避免原生默认值影响既有性别。
4. 调用 `fetchUserInfoById` 获取用户属性，并通过 `ChatUserInfo.avatarUrl` 在 UI 中展示头像；需要完整最新资料时，先调用 `clearUserInfoCache()` 绕过 Dart 缓存。

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

以上示例默认发送单聊名片消息；群聊时应在创建消息时设置 `chatType: ChatType.GroupChat`，并将 `targetId` 设为群组 ID。`await sendMessage` 返回表示消息已提交，最终发送成功或失败需通过 `ChatMessageEvent` 获取，详见 [发送消息统一流程](message_send.html#发送消息统一流程)。

如需展示更多名片信息，可继续在 `params` 中扩展字符串键值对。Flutter 单群聊 UIKit 的源码可参考 [GitHub](https://github.com/easemob/easemob-uikit-flutter)。

### 用户属性与用户信息

用户信息指用于业务展示的用户相关信息，包括用户属性、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。如需自动维护这些信息，详见 [用户信息自动管理](userinfo_provider.html)。

## 接口列表

| API | 所属类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`updateUserInfo`](#设置当前用户的属性) | `ChatUserInfoManager` | `Future<ChatUserInfo>` | 设置或更新当前用户的属性，返回更新结果，不保证是完整服务端资料。 |
| [`fetchOwnInfo`](#获取当前用户的属性) | `ChatUserInfoManager` | `Future<ChatUserInfo?>` | 获取当前登录用户的属性。 |
| [`fetchUserInfoById`](#从服务端获取用户的属性) | `ChatUserInfoManager` | `Future<Map<String, ChatUserInfo>>` | 按用户分别检查 Dart 缓存，需要时通过原生 SDK 获取用户属性。 |
| [`clearUserInfoCache`](#内存说明) | `ChatUserInfoManager` | `void` | 清理 Dart 层用户属性缓存，不删除原生本地数据或取消订阅。 |
| [`getLocalUserInfoByIds`](#从本地内存读取用户属性) | `ChatUserInfoManager` | `Future<Map<String, ChatUserInfo>>` | 从原生 SDK 本地数据中读取指定用户的属性，不发起网络请求。 |
| [`subscribeUsersInfo`](#订阅非好友用户属性变更事件) | `ChatUserInfoManager` | `Future<void>` | 订阅非好友用户的属性变更。 |
| [`unsubscribeUsersInfo`](#取消订阅非好友用户属性变更事件) | `ChatUserInfoManager` | `Future<void>` | 取消订阅非好友用户的属性变更。 |
| [`fetchSubscribedUsers`](#获取已订阅用户的属性列表) | `ChatUserInfoManager` | `Future<List<ChatUserInfo>>` | 获取当前用户已订阅的用户及其属性。 |
| [`addEventHandler`](#监听用户属性变更) | `ChatUserInfoManager` | `void` | 添加用户属性事件处理器。 |
| [`removeEventHandler`](#监听用户属性变更) | `ChatUserInfoManager` | `void` | 移除指定的用户属性事件处理器。 |
