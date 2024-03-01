# 进阶用法

<Toc />

本文介绍进阶用法的示例。

## 通过路由跳转实现自定义页面

`ChatUIKit` 内部优先使用 `Navigator.of(context).pushNamed` 方式进行跳转。每个可使用的 View 均提供 `routeName`, 当需要自定义 `ChatUIKit` 的 View 或者拦截跳转页面时，可以使用路由传参的方式进行拦截和自定义。

| routeName | 对应字符串| 描述 | 
|---|---|---|
| ChatUIKitRouteNames.changeInfoView | '/ChangeInfoView' | 修改信息页面。| 
| ChatUIKitRouteNames.contactDetailsView | '/ContactDetailsView' | 联系人详情页面。|
| ChatUIKitRouteNames.contactsView  | '/ContactsView' | 联系人列表页面。|
| ChatUIKitRouteNames.conversationsView | '/ConversationsView' | 会话列表页面。|
| ChatUIKitRouteNames.createGroupView | '/CreateGroupView' | 创建群组页面。|
| ChatUIKitRouteNames.currentUserInfoView | '/CurrentUserInfoView' | 当前用户详情页面。|
| ChatUIKitRouteNames.groupAddMembersView | '/GroupAddMembersView' | 添加群成员页面。|
| ChatUIKitRouteNames.groupChangeOwnerView | '/GroupChangeOwnerView' | 修改群主页面。|
| ChatUIKitRouteNames.groupDeleteMembersView | '/GroupDeleteMembersView' | 删除群成员页面。|
| ChatUIKitRouteNames.groupDetailsView | '/GroupDetailsView' | 群详情页面。|
| ChatUIKitRouteNames.groupsView | '/GroupsView' | 群组列表页面。|
| ChatUIKitRouteNames.groupMembersView | '/GroupMembersView' | 群成员列表页面。|
| ChatUIKitRouteNames.groupMentionView | '/GroupMentionView' | 群@选择成员页面。|
| ChatUIKitRouteNames.selectContactsView | '/SelectContactsView' | 选择联系人页面。|
| ChatUIKitRouteNames.newRequestDetailsView | '/NewRequestDetailsView' | 新请求详情页面。|
| ChatUIKitRouteNames.newRequestsView | '/NewRequestsView' | 新请求列表页面。|
| ChatUIKitRouteNames.searchUsersView | '/SearchUsersView' | 搜索联系人页面。|
| ChatUIKitRouteNames.searchGroupMembersView | '/SearchGroupMembersView' | 搜索群成员页面。|
| ChatUIKitRouteNames.messagesView | '/MessagesView' | 消息页面。|
| ChatUIKitRouteNames.showImageView | '/ShowImageView' | 查看图片页面。|
| ChatUIKitRouteNames.showVideoView | '/ShowVideoView' | 查看视频页面。|
| ChatUIKitRouteNames.reportMessageView | '/ReportMessageView' | 消息举报页面。|

### 路由的使用

使用路由 `ChatUIKitRoute` 时，需执行 `ChatUIKitRoute.instance`，然后再配合 `MaterialApp.onGenerateRoute` 使用。

:::tip
若执行 `ChatUIKitRoute.instance`，则认为使用 `ChatUIKitRoute`。如果没有使用 `ChatUIKitRoute.generateRoute` 拦截，则会报错。
:::

```dart
final ChatUIKitRoute _route = ChatUIKitRoute.instance;
@override
Widget build(BuildContext context) {
  return MaterialApp(
    ...
    onGenerateRoute: (settings) {
      return _route.generateRoute(settings) ??
          MaterialPageRoute(
            builder: (context) {
              return ...
            },
          );
    },
  );
}
```

优先使用 `ChatUIKitRoute.generateRoute` 进行拦截，如果返回 `null`，则继续使用你 app 中的默认逻辑进行处理。

### 路由拦截

如果需要拦截会话列表页面跳转至消息页面并修改气泡样式，则需要判断 `settings.name == ChatUIKitRouteNames.messagesView`，并重新设置拦截到的 `MessagesViewArguments` 属性。

```dart
final ChatUIKitRoute _route = ChatUIKitRoute.instance;
@override
Widget build(BuildContext context) {
  return MaterialApp(
    ...
      onGenerateRoute: (settings) {
        RouteSettings newSettings = settings;
        if (newSettings.name == ChatUIKitRouteNames.messagesView) {
          MessagesViewArguments arguments =
              settings.arguments as MessagesViewArguments;
          MessagesViewArguments newArguments = arguments.copyWith(
            bubbleBuilder: (context, child, message) {
              //  设置一个新的气泡。
              return Container(
                padding: const EdgeInsets.all(4),
                color: Colors.red,
                child: child,
              );
            },
          );
          newSettings = RouteSettings(
            name: newSettings.name,
            arguments: newArguments,
          );
        }
        return _route.generateRoute(newSettings);
      },
  );
}
```

除了 `MessagesViewArguments`，每个 View 都提供对应的 `ViewArguments`。

| 类型 | 定义 |
|--|--|
| ChangeInfoViewArguments | 修改信息页面参数包装类。|
| ContactDetailsViewArguments | 联系人详情页面参数包装类。|
| ContactsViewArguments | 联系人列表页面参数包装类。|
| ConversationsViewArguments | 会话列表页面参数包装类。|
| CreateGroupViewArguments | 创建群组页面参数包装类。|
| CurrentUserInfoViewArguments | 当前用户详情页面参数包装类。|
| GroupAddMembersViewArguments | 添加群成员页面参数包装类。|
| GroupChangeOwnerViewArguments | 修改群主页面参数包装类。|
| GroupDeleteMembersViewArguments | 删除群成员页面参数包装类。|
| GroupDetailsViewArguments | 群详情页面参数包装类。|
| GroupMembersViewArguments | 群成员列表参数包装类。|
| GroupMentionViewArguments | @群成员页面参数包装类。|
| GroupsViewArguments | 群列表页面参数包装类。|
| MessagesViewArguments | 消息页面参数包装类。|
| NewRequestDetailsViewArguments | 好友申请详情页面参数包装类。|
| NewRequestsViewArguments | 好友申请列表参数包装类。|
| ReportMessageViewArguments | 消息举报页面参数包装类。|
| SearchGroupMembersViewArguments | 搜索群成员页面。|
| SearchUsersViewArguments | 搜索用户页面参数包装类。|
| SelectContactViewArguments | 选择联系人页面参数包装类。|
| ShowImageViewArguments | 展示图片页面参数包装类。|
| ShowVideoViewArguments | 展示视频页面参数包装类。|

## 配置消息和会话显示的时间格式

```dart
ChatUIKitTimeFormatter.instance.formatterHandler = (context, type, time) {
  if (type == ChatUIKitTimeType.conversation) { // 会话列表使用的时间，需要根据 time 返回完整时间内容，如 ’xx月xx日 xx:xx‘
    return '...';
  } else if (type == ChatUIKitTimeType.message) { // 消息使用的时间格式, 需要根据 time 返回完整时间内容，如 ’xx月xx日 xx:xx‘
    return '...';
  }
  return null; // 如果返回 null，则表示不做更改。
};
```

## 监听单群聊事件

单群聊提供了两类事件回调，以便于你在使用时可以及时得到操作结果。

当实现 `ChatSDKEventsObserver` 后，环信 IM SDK（`im_flutter_sdk`）方法调用开始时会通过 `void onChatSDKEventBegin(ChatSDKEvent event)` 回调通知你调用开始，当结束时会通过 `void onChatSDKEventEnd(ChatSDKEvent event, ChatError? error)` 方法告知你调用结束，同时是否报错也会通过这里的 `error` 告知。

当实现 `ChatUIKitEventsObservers` 后，单群聊 UIKit 相关的事件会通过 `void onChatUIKitEventsReceived(ChatUIKitEvent event)` 回调通知你。

```dart
class _ToastPageState extends State<ToastPage> with ChatSDKEventsObserver, ChatUIKitEventsObservers {
  @override
  void initState() {
    super.initState();
    // 注册监听
    ChatUIKit.instance.addObserver(this);
  }

  @override
  void dispose() {
    // 移除监听
    ChatUIKit.instance.removeObserver(this);
    super.dispose();
  }

  // 环信 IM SDK 方法调用开始。
  @override
  void onChatSDKEventBegin(ChatSDKEvent event) {
  }

  // 环信 IM SDK 方法调用结束。
  @override
  void onChatSDKEventEnd(ChatSDKEvent event, ChatError? error) {
  }

  // 单群聊 UIKit 事件。
  @override
  void onChatUIKitEventsReceived(ChatUIKitEvent event) {
  }
}

```

## 其他全局配置项

默认配置项需要在应用启动时配置。

### 配置头像圆角

默认为 `CornerRadius.medium`。

```dart
ChatUIKitSettings.avatarRadius = CornerRadius.large;
```

### 配置搜索框圆角

默认为 `CornerRadius.small`。

```dart
ChatUIKitSettings.searchBarRadius = CornerRadius.large;
```

### 配置默认头像

默认为 `packages/em_chat_uikit/assets/images/default_avatar.png`。

```dart
ChatUIKitSettings.avatarPlaceholder = const AssetImage(
  'packages/em_chat_uikit/assets/images/default_avatar.png',
);
```

### 配置 Dialog 圆角

默认为 `ChatUIKitDialogRectangleType.filletCorner`。

```dart
ChatUIKitSettings.dialogRectangleType = ChatUIKitDialogRectangleType.circular;
```

### 配置会话列表是否显示头像

默认为 `true`。

```dart
ChatUIKitSettings.showConversationListAvatar = true;
```

### 配置会话列表是否显示未读数

默认为 `true`。

```dart
ChatUIKitSettings.showConversationListUnreadCount = true;
```

### 配置会话列表显示的静音图标

默认为 `packages/em_chat_uikit/assets/images/no_disturb.png`。

```dart
ChatUIKitSettings.conversationListMuteImage = const AssetImage(
  'packages/em_chat_uikit/assets/images/no_disturb.png',
)
```

### 配置"撤回消息" Item 显示的时长

配置 `撤回消息` Item 显示的时长。若超过该时长，长按消息后将不再显示 `撤回消息`。

该时长默认为 `120秒`。

```dart
ChatUIKitSettings.recallExpandTime = 120;
```

### 设置消息举报中的举报原因

```dart
ChatUIKitSettings.reportMessageReason = {
  '1': '广告',
  '2': '政治',
  '3': '色情',
  '4': '辱骂',
  '5': '其他',
};
```