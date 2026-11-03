# 用户信息自动管理

## 功能说明

即时通讯 IM 提供用户信息自动管理功能。开启该功能后，SDK 可自动维护用户信息的同步与原生 SDK 本地内存更新，帮助开发者减少手动拉取、存储和更新用户信息的工作量。

该功能适用于会话列表、消息列表、群聊页面等需要展示用户昵称、头像、好友备注和群成员名片的场景。

**本文提及的用户信息指用于业务展示的用户相关信息，包括 [用户属性](userprofile.html)、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。**

## 技术原理

用户信息自动管理功能由 `ChatOptions#enableUserInfo` 控制。初始化 SDK 时开启该功能后，原生 SDK 会在登录成功后自动同步当前登录用户的用户信息；发送消息时自动携带发送方用户属性的更新时间，对于群聊消息还会携带发送方群成员名片的更新时间。

接收消息后，原生 SDK 会比较消息中携带的更新时间与本地内存中的对应时间戳。如果消息中的数据较新或本地缺少相关数据，原生 SDK 会从服务器获取最新的用户属性或群成员名片，更新本地内存，并通过 Flutter SDK 的事件处理器通知业务层刷新 UI。

`enableUserInfo` 与登录后列表同步配置 `dataSyncType` 相互独立。开启用户信息自动管理不等于开启会话、好友或已加入群组列表同步，也不表示登录后会自动获取所有好友的完整用户属性。列表同步配置详见 [初始化](initialization.html#设置登录后自动同步数据)。

Flutter 还会为 `fetchUserInfoById` 的结果维护一份 Dart 层缓存，该缓存与原生 SDK 的本地数据相互独立。用户属性更新事件不会自动刷新这份 Dart 缓存，也不会自动修改已创建的 Dart 消息对象；业务层需要根据事件数据更新自己的展示状态。

Flutter SDK 对 Android 和 iOS 平台的用户信息自动管理能力进行了统一封装。有关各平台的具体实现原理，请参见：

- [Android 用户信息自动管理技术原理](/document/android/userinfo_provider.html#技术原理)
- [iOS 用户信息自动管理技术原理](/document/ios/userinfo_provider.html#技术原理)

## 前提条件

开始接入前，请确保满足以下条件：

- 已集成 Flutter SDK 5.0.0，详见 [快速开始](quickstart.html)。请在初始化时开启本功能，在登录后读取用户属性或进行订阅。
- 已了解即时通讯 IM 的相关使用限制，详见 [使用限制](/product/limitation.html)。

## 开启用户信息自动管理

在 SDK 初始化前，通过 `ChatOptions.withAppKey` 的 `enableUserInfo` 参数开启用户信息自动管理功能，然后调用 `ChatClient.init` 初始化 SDK。

```dart
Future<void> initializeChatSdk() async {
  final ChatOptions options = ChatOptions.withAppKey(
    'your_app_key',
    enableUserInfo: true,
  );

  await ChatClient.getInstance.init(options);
}
```

:::tip
必须在调用 `ChatClient.getInstance.init(options)` 前配置 `enableUserInfo: true`。SDK 初始化后再修改局部配置变量不会重新配置原生 SDK，该功能也不会因此生效。
:::

## 监听用户属性更新

SDK 通过 `ChatUserInfoEventHandler` 监听用户属性更新事件：

- `onSelfUserInfoUpdate`：当前登录用户的属性同步或更新并写入原生 SDK 本地内存后触发。
- `onUserInfoUpdate`：其他用户的属性更新并写入原生 SDK 本地数据后触发，参数类型为 `List<ChatUserInfo>`。可能触发更新的场景包括：
  - 开启用户信息自动管理后，收到消息时发现发送方的用户属性已更新。
  - 主动 [从服务器获取用户属性](userprofile.html#从服务端获取用户的属性)，请求实际到达原生 SDK，且获取到较新的属性数据。若命中 Dart 层缓存，本次读取不会触发新的原生属性更新事件。
  - 主动 [从服务器获取群成员信息](group_members.html#获取群成员列表)，原生 SDK 获取到较新的成员用户属性。
  - 已通过 `ChatUserInfoManager#subscribeUsersInfo` 订阅的非好友用户属性发生变更。

**建议在业务初始化阶段注册事件处理器，以便及时接收登录后的初始同步、消息触发或主动获取等场景产生的事件。** 关于其他场景下用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。

:::tip
如需接收好友的用户属性变更通知，或订阅非好友用户的属性变更通知，你需要先联系环信商务开通相应功能。详见 [监听用户属性变更](userprofile.html#监听用户属性变更) 和 [订阅非好友用户的属性变更](userprofile.html#订阅非好友用户的属性变更)。
:::

```dart
const String userInfoHandlerId = 'user_info_handler';

void registerUserInfoEventHandler() {
  ChatClient.getInstance.userInfoManager.addEventHandler(
    userInfoHandlerId,
    ChatUserInfoEventHandler(
      onSelfUserInfoUpdate: (ChatUserInfo userInfo) {
        // 使用回调返回的当前用户属性更新界面。
        debugPrint(
          'Self user info updated: '
          'userId=${userInfo.userId}, '
          'nickName=${userInfo.nickName}, '
          'avatarUrl=${userInfo.avatarUrl}',
        );
      },
      onUserInfoUpdate: (List<ChatUserInfo> userInfos) {
        for (final ChatUserInfo userInfo in userInfos) {
          // 使用 userId 定位展示项，并使用本次回调数据更新昵称、头像等。
          // 该事件不会自动刷新 fetchUserInfoById 使用的 Dart 层缓存。
          debugPrint(
            'User info updated: '
            'userId=${userInfo.userId}, '
            'nickName=${userInfo.nickName}, '
            'avatarUrl=${userInfo.avatarUrl}',
          );
        }
      },
    ),
  );
}

void unregisterUserInfoEventHandler() {
  ChatClient.getInstance.userInfoManager.removeEventHandler(userInfoHandlerId);
}
```

:::tip
`addEventHandler` 以 `identifier` 为键保存事件处理器。使用同一个 `identifier` 再次添加处理器会替换原处理器，因此不同业务监听应使用不同且稳定的 ID。不再需要监听时，应使用相同 ID 调用 `removeEventHandler`。
:::

如需持续接收指定非好友用户的属性变更，可在登录后调用 `subscribeUsersInfo(List<String> userIds)` 订阅，并在不再需要时调用 `unsubscribeUsersInfo(List<String> userIds)` 取消订阅。订阅用户的属性更新后，通过 `onUserInfoUpdate` 返回。移除 Dart 事件处理器不会自动取消订阅。完整用法详见 [订阅非好友用户的属性变更](userprofile.html#订阅非好友用户的属性变更)。

```dart
Future<void> subscribeUserInfo(List<String> userIds) async {
  try {
    // userIds 为需要订阅属性变更的非好友用户 ID 列表，不能为空。
    await ChatClient.getInstance.userInfoManager.subscribeUsersInfo(userIds);
  } on ChatError catch (error) {
    debugPrint(
      'Failed to subscribe user info: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

## 通过消息获取发送方信息

开启用户信息自动管理后，发送消息时，原生 SDK 会自动携带发送方用户属性的更新时间；发送群聊消息时，还会携带发送方在当前群中的群成员名片更新时间。应用无需手动将这些更新时间或完整用户属性添加到消息扩展中。

无论发送方与接收方是否为好友，当接收方收到消息，且消息中的发送方用户属性较新或本地缺少对应数据时，原生 SDK 会获取最新用户属性、更新本地数据，并通过 `ChatUserInfoEventHandler#onUserInfoUpdate` 通知业务层。

在消息接收回调中，可以通过 `ChatMessage#senderInfo` 获取当前可用的发送方信息，包括昵称、头像、备注和群成员名片。如果接收方已为该发送方设置好友备注，还可通过 `senderInfo.remark` 获取该备注。好友备注属于接收方的私有好友数据，由接收方 SDK 从本地好友信息中读取，不会由消息发送方随消息发送，也不会传递给对方。

```dart
const String messageHandlerId = 'message_sender_info_handler';

void registerMessageEventHandler() {
  ChatClient.getInstance.chatManager.addEventHandler(
    messageHandlerId,
    ChatEventHandler(
      onMessagesReceived: (List<ChatMessage> messages) {
        for (final ChatMessage message in messages) {
          final ChatMessageSenderInfo? senderInfo = message.senderInfo;
          if (senderInfo == null) {
            // 当前消息未提供发送方信息，可先使用 message.from 展示用户 ID。
            continue;
          }

          // 发送方用户 ID。
          final String? userId = senderInfo.userId;
          // 发送方昵称；注意这里使用 nickname，而非 ChatUserInfo.nickName。
          final String? nickname = senderInfo.nickname;
          // 发送方头像 URL。
          final String? avatarUrl = senderInfo.avatarUrl;
          // 当前用户为发送方设置的好友备注，不由发送方随消息传输。
          final String? remark = senderInfo.remark;
          // 发送方在当前群组中的群成员名片，非群聊场景可能为空。
          final String? groupNameCard = senderInfo.groupNameCard;

          debugPrint(
            'Sender info: userId=$userId, nickname=$nickname, '
            'avatarUrl=$avatarUrl, remark=$remark, '
            'groupNameCard=$groupNameCard',
          );
        }
      },
    ),
  );
}

void unregisterMessageEventHandler() {
  ChatClient.getInstance.chatManager.removeEventHandler(messageHandlerId);
}
```

`ChatMessageSenderInfo` 的字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `userId` | `String?` | 消息发送方的用户 ID。 |
| `nickname` | `String?` | 消息发送方的昵称。 |
| `avatarUrl` | `String?` | 消息发送方的头像 URL。 |
| `remark` | `String?` | 当前用户为消息发送方设置的好友备注。 |
| `groupNameCard` | `String?` | 消息发送方在当前群组中的群成员名片。 |

:::tip
`senderInfo` 是原生消息转换为 Dart 对象时的发送方信息快照，可能为 `null`，其中各字段也可能为空。后续用户属性或群成员名片更新事件不会自动改写已有 `ChatMessage` 对象。收到更新事件后，应使用事件数据刷新界面；如需读取当前本地用户属性，可调用 `getLocalUserInfoByIds`，群成员名片则通过 `ChatGroupManager.getGroupNamecard` 读取，详见 [管理群成员名片](group_namecard.html)。
:::

## 从本地内存读取用户属性

调用 `ChatUserInfoManager.getLocalUserInfoByIds` 从原生 SDK 的本地数据读取一个或多个用户的属性。该方法接收 `List<String>`，返回 `Future<Map<String, ChatUserInfo>>`；Map 的键为用户 ID，值为对应的用户属性。本地没有某个用户的数据时，返回的 Map 中可能不包含该用户 ID。该方法不会发起网络请求，也不会读取或更新 `fetchUserInfoById` 使用的 Dart 层缓存。

```dart
Future<void> getLocalUserInfo() async {
  const List<String> userIds = <String>['userId1', 'userId2'];

  try {
    final Map<String, ChatUserInfo> userInfoMap =
        await ChatClient.getInstance.userInfoManager.getLocalUserInfoByIds(
      userIds,
    );

    // 返回结果可能不包含所有传入用户，仅遍历本次实际读取到的数据。
    for (final MapEntry<String, ChatUserInfo> entry
        in userInfoMap.entries) {
      final ChatUserInfo userInfo = entry.value;
      debugPrint(
        'Local user info: key=${entry.key}, '
        'userId=${userInfo.userId}, '
        'nickName=${userInfo.nickName}, '
        'avatarUrl=${userInfo.avatarUrl}',
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

`ChatUserInfo` 的主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `userId` | `String` | 用户 ID。 |
| `nickName` | `String?` | 用户昵称。注意字段名中的 `N` 为大写。 |
| `avatarUrl` | `String?` | 用户头像 URL。 |
| `mail` | `String?` | 用户邮箱。 |
| `phone` | `String?` | 用户手机号。 |
| `gender` | `int` | 用户性别：`0` 为未知，`1` 为男，`2` 为女。 |
| `sign` | `String?` | 用户签名。 |
| `birth` | `String?` | 用户生日。 |
| `ext` | `String?` | 用户自定义属性。 |

:::tip
如需主动获取服务端用户属性，可调用 `ChatUserInfoManager#fetchUserInfoById`。该方法先检查 Dart 缓存，`expireTime` 指定缓存有效期，单位为秒，默认值为 `0`；对未缓存或缓存已过期的用户，才调用原生接口获取数据。若需确保本次请求不命中已有 Dart 缓存，应先调用 `ChatClient.getInstance.userInfoManager.clearUserInfoCache()`，再调用 `fetchUserInfoById(userIds)`。清理操作仅影响 Dart 缓存，不删除原生 SDK 本地数据，也不取消订阅。详见 [管理用户属性](userprofile.html#从服务端获取用户的属性)。
:::

## 注意事项

- `enableUserInfo: true` 必须在 SDK 初始化前配置，默认值为 `false`。
- 建议在 SDK 登录前注册 `ChatUserInfoEventHandler`，以便及时收到登录后的初始同步事件。
- `ChatMessage.senderInfo` 表示当前本地可用的发送方信息，不保证一定是刚收到消息时的最终最新值。
- 原生 SDK 的用户属性更新事件和 `getLocalUserInfoByIds` 不会自动刷新 Dart 用户属性缓存。收到事件后，优先使用回调数据更新 UI；不要将仍在有效期内的 Dart 缓存当作最新服务端数据。
- `ChatUserInfoEventHandler` 用于用户属性更新，群成员名片变更使用 `ChatGroupEventHandler.onUserGroupNamecardChanged`；读取用户属性不会返回好友备注或群成员名片。
- `ChatUserInfo.nickName` 使用大写字母 `N`，而 `ChatMessageSenderInfo.nickname` 使用小写字母 `n`，两者不可混用。
- `ChatMessageSenderInfo.groupNameCard` 使用大写字母 `C`；群成员模型 `GroupMemberInfo.namecard` 使用小写字母 `c`。
- `enableUserInfo` 不控制登录后会话、好友或群组列表的自动同步；列表同步需单独配置 `dataSyncType`。

## 常见问题

#### 何时开启用户信息自动管理？

必须在调用 `ChatClient.getInstance.init(options)` 前，通过 `ChatOptions.withAppKey` 设置 `enableUserInfo: true`。若 SDK 已经初始化，再修改局部配置变量不会重新配置原生 SDK。

#### 功能开启后，SDK 会自动执行哪些操作？

开启后，原生 SDK 会在登录成功后同步当前登录用户的用户属性；发送消息时携带发送方信息的更新时间；接收消息时比较消息与本地内存中的时间戳；检测到数据较新或本地缺少数据时，自动从服务器获取最新信息、更新本地内存并通知 Flutter 业务层。

#### ChatMessage#senderInfo 一定是最新数据吗？

不一定。`senderInfo` 是原生消息转换为 Dart `ChatMessage` 时可用的发送方信息快照。如果消息触发了后续用户属性更新，SDK 会通过 `onUserInfoUpdate` 等事件通知业务层，但不会自动改写已创建的 Dart `ChatMessage` 对象。业务层应在事件回调中刷新展示数据。

#### 为何建议尽早注册事件处理器？

开启用户信息自动管理后，SDK 可能在登录后的初始同步、消息触发更新或主动获取数据时通知业务层。尽早注册 `ChatUserInfoEventHandler` 可避免错过这些事件。

#### 本地读取和主动获取有何区别？

`getLocalUserInfoByIds` 只查询原生 SDK 的本地数据，不发起网络请求，也不更新 Dart 用户属性缓存。`fetchUserInfoById` 会先检查 Dart 层缓存是否在 `expireTime` 指定的有效期内；缓存缺失或过期时才通过原生层获取用户属性。用户属性更新事件不会自动刷新这份 Dart 缓存；如需绕过已有缓存主动获取服务端数据，应先调用 `clearUserInfoCache()`。

#### 功能开启后需要自己维护原生 SDK 的本地内存吗？

通常不需要。开启 `enableUserInfo` 后，原生 SDK 会负责用户信息同步、更新时间比较、本地内存更新和事件通知。Flutter 业务层仍需要维护自己的 UI 状态，并在事件到达时刷新展示数据。如果业务还使用 `fetchUserInfoById` 的 Dart 缓存，需要另外处理该缓存的有效期和清理，不能将原生自动管理等同于 Dart 缓存自动更新。

## 相关功能

### 管理群成员名片

启用用户信息自动管理后，SDK 支持群成员名片的自动同步与更新。群成员名片变更通过 `ChatGroupEventHandler.onUserGroupNamecardChanged` 通知，可通过 `ChatGroupManager.getGroupNamecard` 读取本地名片。它不属于 `ChatUserInfo` 的属性字段，详见 [管理群成员名片](group_namecard.html)。

### 用户属性与用户信息

- 用户信息：用于业务展示的用户相关信息，包括 [用户属性](userprofile.html)、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。
- 用户属性：用户可设置和管理的资料字段，包括昵称、头像、邮箱、电话号码等。可通过 `ChatUserInfoManager#updateUserInfo` 更新当前登录用户的属性，通过 `fetchUserInfoById` 主动获取指定用户的属性。开启 `enableUserInfo` 后，更新后的信息会参与后续的消息同步。

### 通过消息同步的发送方信息

开启用户信息自动管理后，可通过收到消息的 `ChatMessage#senderInfo` 读取当时可用的发送方用户 ID、昵称、头像、好友备注和群成员名片。好友备注来自接收方的本地好友数据，并非发送方随消息传输的资料；相关数据尚不可用时，对应字段可能为空。

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`withAppKey`](#开启用户信息自动管理) | `ChatOptions` | `ChatOptions` | 创建 SDK 配置，并通过 `enableUserInfo` 开启用户信息自动管理。 |
| [`init`](#开启用户信息自动管理) | `ChatClient` | `Future<void>` | 使用指定配置初始化 SDK。 |
| [`addEventHandler`](#监听用户属性更新) | `ChatUserInfoManager` | `void` | 添加用户属性事件处理器。 |
| [`removeEventHandler`](#监听用户属性更新) | `ChatUserInfoManager` | `void` | 按处理器 ID 移除用户属性事件处理器。 |
| [`onSelfUserInfoUpdate`](#监听用户属性更新) | `ChatUserInfoEventHandler` | `void Function(ChatUserInfo)?` | 当前登录用户属性更新回调。 |
| [`onUserInfoUpdate`](#监听用户属性更新) | `ChatUserInfoEventHandler` | `void Function(List<ChatUserInfo>)?` | 其他用户属性更新回调。 |
| [`subscribeUsersInfo`](#监听用户属性更新) | `ChatUserInfoManager` | `Future<void>` | 订阅指定非好友用户的属性更新。 |
| [`unsubscribeUsersInfo`](#监听用户属性更新) | `ChatUserInfoManager` | `Future<void>` | 取消订阅指定非好友用户的属性更新。 |
| [`senderInfo`](#通过消息获取发送方信息) | `ChatMessage` | `ChatMessageSenderInfo?` | 获取收到消息转换为 Dart 对象时的发送方信息快照。 |
| [`getLocalUserInfoByIds`](#从本地内存读取用户属性) | `ChatUserInfoManager` | `Future<Map<String, ChatUserInfo>>` | 从原生 SDK 本地读取用户属性，不请求网络，也不更新 Dart 缓存。 |
| [`fetchUserInfoById`](#从本地内存读取用户属性) | `ChatUserInfoManager` | `Future<Map<String, ChatUserInfo>>` | 优先复用有效 Dart 缓存，缓存缺失或过期时通过原生接口获取用户属性。 |
| [`clearUserInfoCache`](#从本地内存读取用户属性) | `ChatUserInfoManager` | `void` | 清理 Dart 层用户属性缓存，不删除原生 SDK 本地数据。 |
| [`updateUserInfo`](#用户属性与用户信息) | `ChatUserInfoManager` | `Future<ChatUserInfo>` | 更新当前登录用户的多个用户属性。 |
