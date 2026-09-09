# 管理群成员名片

## 功能说明

群成员名片是用户在特定群组内的个性化显示信息，用于区分该用户在不同群组中的身份展示，例如展示部门、岗位、项目角色等群内身份信息。

例如，在企业群组中，成员可将在群组中的名片设置为“部门-姓名”或“岗位-姓名”的格式，便于群内成员快速识别和沟通。

即时通讯 IM Flutter SDK 提供群成员名片管理功能，支持群成员名片的设置、本地查询、服务端获取和变更监听。开启 [用户信息自动管理功能](userinfo_provider.html) 后，SDK 还支持通过消息自动同步群成员名片更新。

**本功能从 Flutter SDK 4.22.0 版本开始支持。**

## 技术原理

Flutter SDK 对 Android 和 iOS 平台的群成员名片能力进行了统一封装。具体技术原理请参见对应平台文档：

- [Android 群成员名片技术原理](/document/android/group_namecard.html#技术原理)
- [iOS 群成员名片技术原理](/document/ios/group_namecard.html#技术原理)

## 前提条件

开始接入前，请确保满足以下条件：

- 已将 Flutter SDK 升级至 v4.22.0 或以上版本。
- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解即时通讯 IM 的相关使用限制，详见 [使用限制](/product/limitation.html)。

## 监听群成员名片更新

SDK 通过 `ChatGroupEventHandler#onUserGroupNamecardChanged` 监听群成员名片更新。建议在业务初始化阶段注册事件处理器，并在不再需要时使用相同的处理器 ID 移除，避免重复监听。

当群成员名片发生变更并同步到原生 SDK 的本地内存后，可能触发该事件，常见场景包括：

- 当前登录用户更新群成员名片后，群内其他 **在线成员** 收到变更通知。
- 调用服务端接口获取到最新群成员信息并更新本地内存后。
- 开启 `ChatOptions#enableUserInfo` 后，接收方因收到消息触发自动同步并更新本地内存后。

添加和移除事件处理器的示例代码如下所示：

```dart
const String groupNamecardHandlerId = 'group_namecard_handler';

void registerGroupNamecardHandler() {
  ChatClient.getInstance.groupManager.addEventHandler(
    groupNamecardHandlerId,
    ChatGroupEventHandler(
      onUserGroupNamecardChanged: (
        String groupId,
        String userId,
        String? namecard,
      ) {
        debugPrint(
          'Group namecard changed: groupId=$groupId, '
          'userId=$userId, namecard=$namecard',
        );
      },
    ),
  );
}

void unregisterGroupNamecardHandler() {
  ChatClient.getInstance.groupManager.removeEventHandler(
    groupNamecardHandlerId,
  );
}
```

:::tip
`addEventHandler` 以 `identifier` 为键保存事件处理器。对同一个 `identifier` 再次调用该方法会替换原有处理器，因此应为不同业务监听使用不同且稳定的 ID。
:::

## 设置群成员名片

调用 `ChatGroupManager#updateGroupNamecard` 设置或更新当前登录用户在指定群组中的群成员名片。`namecard` 为 `null` 或省略该参数时，会移除当前用户在该群组中的群成员名片。

群内其他在线成员收到群成员名片变更通知后，会触发 `ChatGroupEventHandler#onUserGroupNamecardChanged`。

```dart
// 传入的 `namecard` 为 `null` 时，清除当前用户在该群组中的名片。
Future<void> updateMyGroupNamecard() async {
  try {
    await ChatClient.getInstance.groupManager.updateGroupNamecard(
      groupId: 'groupId',
      namecard: 'new_namecard',
    );
    debugPrint('Group namecard updated.');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to update group namecard: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :---: | :--- |
| `groupId` | String | 是 | 群组 ID。 |
| `namecard` | String | 否 | 新的群成员名片。传 `null` 或省略时移除自己的群成员名片。 |

## 从服务端获取群成员名片

调用 `ChatGroupManager#fetchGroupMembersInfo` 从服务端分页获取群成员信息。若需获取群成员的群名片、昵称和头像，应在初始化 SDK 前将 `ChatOptions#enableUserInfo` 设置为 `true`，开启 [用户信息自动管理功能](userinfo_provider.html)；否则返回的 `GroupMemberInfo` 可能不包含 `namecard`、`nickname` 和 `avatarUrl`。

获取成功后，相关数据会自动更新至原生 SDK 的本地内存。

```dart
Future<String?> fetchGroupMemberNamecards({String? cursor}) async {
  try {
    final ChatCursorResult<GroupMemberInfo> result =
        await ChatClient.getInstance.groupManager.fetchGroupMembersInfo(
      groupId: 'groupId',
      cursor: cursor,
      limit: 20,
    );

    for (final GroupMemberInfo member in result.data) {
      debugPrint(
        'userId=${member.userId}, joinedTs=${member.joinedTs}, '
        'role=${member.role}, nickname=${member.nickname}, '
        'avatarUrl=${member.avatarUrl}, namecard=${member.namecard}',
      );
    }

    // 在下一次请求中使用此游标。值为 null 或空字符串表示没有更多数据。
    return result.cursor;
  } on ChatError catch (error) {
    debugPrint(
      'Failed to fetch group members: '
      'code=${error.code}, description=${error.description}',
    );
    rethrow;
  }
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :---: | :--- |
| `groupId` | String | 是 | 群组 ID。 |
| `cursor` | String | 否 | 分页游标。首次调用传 `null` 或省略，后续传入上一次返回的 `ChatCursorResult#cursor`。 |
| `limit` | int | 否 | 每页获取的成员数量，默认值为 `20`，有效范围为 1–50。 |

`GroupMemberInfo` 的主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `userId` | String | 群成员用户 ID。 |
| `joinedTs` | int | 用户加入群组的时间戳。 |
| `role` | `ChatGroupPermissionType` | 群成员角色。 |
| `namecard` | String | 群成员名片。 |
| `nickname` | String | 群成员昵称。 |
| `avatarUrl` | String | 群成员头像 URL。 |

## 从本地内存获取群成员名片

调用 `ChatGroupManager#getGroupNamecard` 从原生 SDK 的本地内存读取指定成员在指定群组中的群成员名片。该方法不会发起网络请求，适用于本地展示场景。

虽然数据来自本地内存，但 Flutter 需要通过 MethodChannel 访问原生层，因此该方法仍是异步方法，返回 `Future<String?>`。

```dart
Future<void> getLocalGroupNamecard() async {
  try {
    final String? namecard =
        await ChatClient.getInstance.groupManager.getGroupNamecard(
      groupId: 'groupId',
      userId: 'userId',
    );
    debugPrint('Local group namecard: $namecard');
  } on ChatError catch (error) {
    debugPrint(
      'Failed to get local group namecard: '
      'code=${error.code}, description=${error.description}',
    );
  }
}
```

#### 关键参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :---: | :--- |
| `groupId` | `String` | 是 | 群组 ID。 |
| `userId` | `String` | 是 | 群成员的用户 ID。 |

## 通过消息自动同步群成员名片

如果希望发送消息时自动携带群成员名片更新时间，并在接收消息时自动更新本地内存，需要在 SDK 初始化前将 `ChatOptions#enableUserInfo` 设置为 `true`。

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
必须在调用 `ChatClient.getInstance.init(options)` 之前配置 `enableUserInfo: true`。SDK 初始化完成后再修改局部变量不会重新配置原生 SDK，自动同步功能也不会因此生效。
:::

开启用户信息自动管理后，SDK 会执行以下操作：

1. 当前登录用户更新群成员名片后，后续发送的消息会自动附带群成员名片更新时间。
2. 接收方收到消息后，原生 SDK 将消息中的群成员名片更新时间与本地内存进行比较。
3. 如果消息中的更新时间晚于本地内存，原生 SDK 会自动从服务端拉取最新群成员名片。
4. 获取成功后，原生 SDK 更新本地内存，并通过 Flutter SDK 触发 `ChatGroupEventHandler.onUserGroupNamecardChanged`。

此外，对于 SDK 下发的消息，可以通过 `ChatMessage#senderInfo` 获取消息发送方当前可用的信息，并通过 `ChatMessageSenderInfo#groupNameCard` 读取群成员名片：

```dart
void readSenderGroupNamecard(ChatMessage message) {
  final ChatMessageSenderInfo? senderInfo = message.senderInfo;
  final String? groupNamecard = senderInfo?.groupNameCard;
  debugPrint('Sender group namecard: $groupNamecard');
}
```

`ChatMessage.senderInfo` 是可空字段，由服务器下发，仅对收到的消息有效。`ChatMessageSenderInfo.groupNameCard` 的大小写与 `GroupMemberInfo.namecard` 不同，使用时请注意。

## 注意事项

- 群成员名片是用户在特定群组中的显示信息，不同群组之间互不影响。
- `ChatGroupManager.updateGroupNamecard` 只能设置、更新或移除当前登录用户自己的群成员名片。
- `ChatGroupManager.getGroupNamecard` 只查询原生 SDK 的本地内存，不会主动从服务端获取最新数据。
- `ChatGroupManager.fetchGroupMembersInfo` 返回的数据会更新原生 SDK 的本地内存。只有开启用户信息自动管理后，返回信息才会包含可用的群名片、昵称和头像数据。
- `ChatGroupEventHandler.onUserGroupNamecardChanged` 的 `namecard` 参数类型为 `String?`；群成员名片被移除时可能为 `null`。
- 群成员名片变更通知只投递给在线用户。离线期间未收到通知时，应在需要最新数据的场景主动调用 `fetchGroupMembersInfo`。
- 若需通过消息自动同步群成员名片，必须在 SDK 初始化前配置 `enableUserInfo: true`。
- 通过消息自动更新依赖消息触发。若业务需要立即获得最新数据，仍应调用 `fetchGroupMembersInfo` 主动从服务端获取。
- Flutter 4.22.0 的公开 API 统一使用 `Chat*` 命名；不要在新代码中使用已弃用的旧名称。

## 常见问题

#### 设置群成员名片后，为何其他成员未立即收到事件？

调用 `ChatGroupManager.updateGroupNamecard` 后，当前登录用户在指定群组中的群成员名片会更新。其他在线成员收到对应的群成员名片变更通知后，才会触发 `ChatGroupEventHandler.onUserGroupNamecardChanged`。离线成员不会实时收到该通知。

#### 为何调用 getGroupNamecard 获取不到群成员名片？

`ChatGroupManager.getGroupNamecard` 只从原生 SDK 的本地内存读取数据，不会主动发起网络请求。如果本地内存中尚无对应成员的群成员名片，返回值为 `null`。可以先调用 `ChatGroupManager.fetchGroupMembersInfo` 从服务端获取群成员信息，再进行本地查询。

#### 从服务端获取的群成员信息是否写入本地内存？

会。调用 `ChatGroupManager.fetchGroupMembersInfo` 成功后，返回结果中的群成员名片等数据会写入原生 SDK 的本地内存，后续可以通过 `ChatGroupManager.getGroupNamecard` 读取。

#### 开启用户信息自动管理后，群成员名片为何会自动更新？

初始化时配置 `ChatOptions.withAppKey('appKey', enableUserInfo: true)` 后，发送消息时会自动附带发送方群成员名片更新时间。接收方收到消息后，原生 SDK 会将消息中的更新时间与本地内存进行比较。如果消息中的更新时间较新，SDK 会从服务端拉取最新群成员名片、更新本地内存，并触发 `onUserGroupNamecardChanged`。

#### 通过消息自动同步群成员名片后，还需主动从服务端获取吗？

视业务场景而定。通过消息自动同步依赖消息触发；如果业务需要立即获取最新群成员名片，或者当前没有消息触发同步，仍建议调用 `ChatGroupManager.fetchGroupMembersInfo` 主动从服务端获取最新数据。

#### namecard 与 groupNameCard 有什么区别？

- `GroupMemberInfo.namecard`、`updateGroupNamecard` 的 `namecard` 参数和 `onUserGroupNamecardChanged` 的 `namecard` 参数均使用小写字母 `c`。
- `ChatMessageSenderInfo.groupNameCard` 使用大写字母 `C`。

两者都表示群成员名片，但属于不同的 Flutter 类型，字段名必须按代码定义使用。

## 相关文档

- [用户信息自动管理](userinfo_provider.html)
- [管理用户属性](userprofile.html)
- [使用限制](/product/limitation.html)

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`updateGroupNamecard`](#设置群成员名片) | `ChatGroupManager` | `Future<void>` | 设置、更新或移除当前登录用户在指定群组中的群成员名片。 |
| [`fetchGroupMembersInfo`](#从服务端获取群成员名片) | `ChatGroupManager` | `Future<ChatCursorResult<GroupMemberInfo>>` | 从服务端分页获取群成员信息。 |
| [`getGroupNamecard`](#从本地内存获取群成员名片) | `ChatGroupManager` | `Future<String?>` | 从原生 SDK 的本地内存读取指定成员的群成员名片。 |
| [`addEventHandler`](#监听群成员名片更新) | `ChatGroupManager` | `void` | 添加群组事件处理器。 |
| [`removeEventHandler`](#监听群成员名片更新) | `ChatGroupManager` | `void` | 按处理器 ID 移除群组事件处理器。 |
| [`onUserGroupNamecardChanged`](#监听群成员名片更新) | `ChatGroupEventHandler` | `void Function(String, String, String?)?` | 群成员名片变更回调。 |
| [`withAppKey`](#通过消息自动同步群成员名片) | `ChatOptions` | `ChatOptions` | 创建 SDK 配置并通过 `enableUserInfo` 开启用户信息自动管理。 |
| [`init`](#通过消息自动同步群成员名片) | `ChatClient` | `Future<void>` | 使用指定配置初始化 SDK。 |
