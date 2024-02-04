# 用户信息展示

<Toc />

使用 `ChatUIKit` 时需要你提供头像和昵称。`ChatUIKit` 提供 `ChatUIKitProvider` 类方便你设置头像昵称。

`ChatUIKit` 提供了 `ChatUIKitProfile` 类用于封装头像和昵称信息。

```dart
class ChatUIKitProfile {
  final String id; //  ID
  final String? name; // 显示昵称
  final String? avatarUrl; // 显示头像 URL
  final ChatUIKitProfileType? type; // Profile 类型，可以是 contact 或者 group。
  final Map<String, String>? extension; // 附加信息，ChatUIKit 内部不使用。
  final int timestamp; // 时间戳，如果不设置则为 0，ChatUIKit 内部不使用。

  // 显示名称。昵称存在适应昵称，否则会使用id。
  String get showName => name?.isNotEmpty == true ? name! : id;

  ChatUIKitProfile({
    required this.id,
    required this.type,
    this.name,
    this.avatarUrl,
    this.extension,
    this.timestamp = 0,
  });

  ChatUIKitProfile.contact({
    required String id,
    String? name,
    String? avatarUrl,
    Map<String, String>? extension,
    int timestamp = 0,
  }) : this(
          id: id,
          name: name,
          avatarUrl: avatarUrl,
          type: ChatUIKitProfileType.contact,
          extension: extension,
          timestamp: timestamp,
        );

  ChatUIKitProfile.group({
    required String id,
    String? name,
    String? avatarUrl,
    Map<String, String>? extension,
    int timestamp = 0,
  }) : this(
          id: id,
          name: name,
          avatarUrl: avatarUrl,
          type: ChatUIKitProfileType.group,
          extension: extension,
          timestamp: timestamp,
        );

  ChatUIKitProfile copy({
    String? name,
    String? avatarUrl,
    Map<String, String>? extension,
    int timestamp = 0,
  }) {
    return ChatUIKitProfile(
      id: id,
      name: name ?? this.name,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      type: type,
      extension: extension ?? this.extension,
      timestamp: timestamp,
    );
  }
}

```

头像昵称信息在 `ChatUIKit` 中显示时，`ChatUIKitProvider` 会从你传入的数据中获取。如果没有获取到，`ChatUIKitProvider` 还会通过 `ChatUIKitProviderProfileHandler` 向你要数据。如果你将所需的 `ChatUIKitProfile` 返回，`ChatUIKitProvider` 会缓存你返回的 `ChatUIKitProfile`，从而减少向你请求的次数。如果你没有返回，`ChatUIKitProvider` 下次用到时还会继续向要数据。

## 设置用户信息

如果你有自己的 app 和用户信息，可以在 app 启动时通过 `ChatUIKitProvider.instance.addProfiles(list)` 方法将你的用户信息传给 `ChatUIKit`。

```dart
ChatUIKitProvider.instance.addProfiles(list);
```

## 实现 Provider 回调

如果 `ChatUIKit` 中没有需要展示的头像和昵称，会在需要展示时向你要数据。

`ChatUIKitProviderProfileHandler` 的定义如下所示：

```dart
typedef ChatUIKitProviderProfileHandler = List<ChatUIKitProfile>? Function(
  // `ChatUIKit` 内部生成的默认 ChatUIKitProfiles，也是需要你返回的数据。如果你有真实数据，可以返回给 `ChatUIKit`, UIKit 会将你返回的数据缓存。
  List<ChatUIKitProfile> profiles,
);
```

`ChatUIKitProviderProfileHandler` 会回调给你当前单群聊需要使用到的 profiles，你需要根据 `ChatUIKitProfileType`，返回真实的 `ChatUIKitProfile` 数据，如果没有返回，当下次用到时仍然会找你要。

`ChatUIKitProviderProfileHandler` 的使用如下所示：

```dart
// profiles: `ChatUIKit` 内部生成的默认 ChatUIKitProfiles。
// usersProfiles: 你返回的数据。
ChatUIKitProvider.instance.profilesHandler = (profiles) {
  ...
  // 你需要在数据库或缓存中将数据返回。如果不返回，则下次需要用到时还会向你请求数据。
  return usersProfiles;
};
```

## 设置自己的头像昵称

自己的头像昵称用于消息中。当你发消息时，`ChatUIKit` 会将你的头像和昵称带入到消息中，以便在消息中展示。

```dart
ChatUIKitProvider.instance.currentUserData = UserData(
  nickname: nickname,
  avatarUrl: avatarUrl,
);
```

## 更多

### 根据群相关回调更新信息

`ChatUIKitProfile` 并不单指用户属性，在会话列表中群组的头像和显示名称也使用 `ChatUIKitProfile`。当使用群聊时，你需要监听创建群组/修改群名称的回调，从而更新 `ChatUIKitProfile`，确保会话列表中能得到正确的群名称。

添加监听并根据群相关回调更新 `ChatUIKitProfile`.

```dart
// 添加 GroupObserver。
class _UserProviderWidgetState extends State<UserProviderWidget>
    with GroupObserver {
  late SharedPreferences sharedPreferences;

  @override
  void initState() {
    super.initState();
    // 将当前类添加到 ChatUIKit 的 Observers。
    ChatUIKit.instance.addObserver(this);
  }

  @override
  void dispose() {
    // 当关闭时，需要将当前类从 ChatUIKit 的 Observers 中移除。
    ChatUIKit.instance.removeObserver(this);
    super.dispose();
  }

  // 自己创建群组回调
  @override
  void onGroupCreatedByMyself(Group group) {
    // 收到回调后，将群信息添加到 profiles中。
    ChatUIKitProvider.instance.addProfiles(
      [ChatUIKitProfile.group(id: group.groupId, name: group.name)],
    );
  }

  // 修改群名称回调
  @override
  void onGroupNameChangedByMeSelf(Group group) {
    // 收到回调后，将群信息添加到 profiles 中。
    ChatUIKitProvider.instance.addProfiles(
      [ChatUIKitProfile.group(id: group.groupId, name: group.name)],
    );
  }
}

```