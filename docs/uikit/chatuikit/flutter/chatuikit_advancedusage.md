# 进阶用法

<Toc />

本文介绍进阶用法的示例。

## 通过路由跳转实现自定义页面

`ChatUIKit` 内部优先使用 `Navigator.of(context).pushNamed` 方式进行跳转。每个可使用的 View 均提供 `routeName`, 当需要自定义 `ChatUIKit` 的 View 或者拦截跳转页面时，可以使用路由传参的方式进行拦截和自定义。

| routeName | 对应字符串| 描述 |
|---|---|---|
| ChatUIKitRouteNames.changeInfoView |  '/ChangeInfoView' | 修改信息页面。|
| ChatUIKitRouteNames.contactDetailsView |  '/ContactDetailsView' | 联系人详情页面。|
| ChatUIKitRouteNames.contactsView |  '/ContactsView' | 联系人列表页面。|
| ChatUIKitRouteNames.conversationsView |  '/ConversationsView' | 会话列表页面。|
| ChatUIKitRouteNames.createGroupView |  '/CreateGroupView' | 创建群组时选人页面。|
| ChatUIKitRouteNames.currentUserInfoView |  '/CurrentUserInfoView' | 当前用户详情页面。|
| ChatUIKitRouteNames.forwardMessageSelectView |  '/forwardMessageSelectView' | 消息转发选择页面。|
| ChatUIKitRouteNames.forwardMessagesView |  '/forwardMessagesView' | 消息转发消息展示页面。|
| ChatUIKitRouteNames.groupChangeOwnerView |  '/GroupChangeOwnerView' | 修改群主页面。|
| ChatUIKitRouteNames.groupDetailsView |  '/GroupDetailsView' | 群详情页面。|
| ChatUIKitRouteNames.groupsView |  '/GroupsView' | 群组列表页面。|
| ChatUIKitRouteNames.groupMembersView |  '/GroupMembersView' | 群成员列表页面。|
| ChatUIKitRouteNames.groupMentionView |  '/GroupMentionView' | 群@选择成员页面。|
| ChatUIKitRouteNames.groupDeleteMembersView |  '/GroupDeleteMembersView' | 删除群成员页面。|
| ChatUIKitRouteNames.groupAddMembersView |  '/GroupAddMembersView' | 添加群成员页面。|
| ChatUIKitRouteNames.messagesView |  '/MessagesView' | 消息页面。|
| ChatUIKitRouteNames.newRequestDetailsView |  '/NewRequestDetailsView' | 新请求详情页面。|
| ChatUIKitRouteNames.newRequestsView |  '/NewRequestsView' | 新请求列表页面。|
| ChatUIKitRouteNames.reportMessageView |  '/ReportMessageView' | 消息举报页面。|
| ChatUIKitRouteNames.searchUsersView |  '/SearchUsersView' | 搜索联系人页面。|
| ChatUIKitRouteNames.searchGroupMembersView |  '/SearchGroupMembersView' | 搜索群成员页面。|
| ChatUIKitRouteNames.selectContactsView |  '/SelectContactsView' | 选择联系人页面 |
| ChatUIKitRouteNames.showImageView |  '/ShowImageView' | 查看图片页面。|
| ChatUIKitRouteNames.showVideoView |  '/ShowVideoView' | 查看视频页面。|
| ChatUIKitRouteNames.searchHistoryView |  '/SearchHistoryView' | 搜索历史消息页面|
| ChatUIKitRouteNames.threadMessagesView |  '/ThreadMessagesView' | Thread 消息页面。|
| ChatUIKitRouteNames.threadMembersView |  '/ThreadMembersView' | Thread 成员页面。|
| ChatUIKitRouteNames.threadsView |  '/ThreadsView'; | Thread 列表页面。|


### 路由的使用

需要自定义页面跳转或者页面样式时可以对路由进行拦截和自定义，然后将自定义的 `RouteSettings` 传给 `ChatUIKitRoute.generateRoute`。

```dart
final ChatUIKitRoute _route = ChatUIKitRoute.instance;
@override
Widget build(BuildContext context) {
  return MaterialApp(
    ...
    onGenerateRoute: (settings) {
      return ChatUIKitRoute().generateRoute(settings) ??
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
        return ChatUIKitRoute().generateRoute(newSettings);
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
| ForwardMessageSelectViewArguments | 消息转发选择参数包装类。 |
| ForwardMessagesViewArguments| 消息转发内容查看参数包装类。 |
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
| SearchGroupMembersViewArguments | 搜索群成员页面包装类。|
| SearchHistoryViewArguments |搜索消息页面包装类。 |
| SearchViewArguments | 搜索用户页面参数包装类。|
| SelectContactViewArguments | 选择联系人页面参数包装类。|
| ShowImageViewArguments | 展示图片页面参数包装类。|
| ShowVideoViewArguments | 展示视频页面参数包装类。|
| ThreadMembersViewArguments | Thread 成员列表页面参数包装类。|
| ThreadMessagesViewArguments | Thread 消息列表页面参数包装类。|
| ThreadsViewArguments| Thread 列表页面参数包装类。|

## 配置消息和会话时间格式

```dart
ChatUIKitTimeFormatter.instance.formatterHandler = (context, type, time) {
  if (type == ChatUIKitTimeType.conversation) { // 会话列表使用的时间，需要根据 time 返回完整时间内容，格式为 xx月xx日 HH:mm。
    return '...';
  } else if (type == ChatUIKitTimeType.message) { // 消息使用的时间格式, 需要根据 time 返回完整时间内容，格式为 xx月xx日 HH:mm。
    return '...';
  }
  return null; // 如果返回 null，则表示不做更改。
};
```

## 配置联系人首字母排序

当用户昵称中出现中文时，需要将中文中的姓氏转化为字母才能正确的在联系人列表中索引。此时，可以通过以下方式将 `showName` 的值改为字符返回。

```dart
ChatUIKitAlphabetSortHelper.instance.sortHandler = (showName) {
  // 将 showName 的第一个字母返回。如果中文，可以用第三方库进行转换，之后返回。
  return '#';
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

## 自定义 AppBar

在包含 AppBar 的页面中，可以通过 `appBarModel` 进行自定义。

```dart
  /// ChatUIKitAppBarModel 构造函数
  /// [title] 标题
  /// [centerWidget] 中间控件, 优先级高于 title 和 subtitle，如果设置了 centerWidget，title 和 subtitle 将不会显示
  /// [titleTextStyle] 标题样式
  /// [subtitle] 副标题
  /// [subTitleTextStyle] 副标题样式
  /// [leadingActions] 左侧控件
  /// [leadingActionsBuilder] 左侧控件构建器, 当存在默认值时会回调
  /// [trailingActions] 右侧控件
  /// [trailingActionsBuilder] 右侧控件构建器, 当存在默认值时会回调
  /// [showBackButton] 是否显示返回键
  /// [onBackButtonPressed] 返回键点击事件, 不设置是默认为返回上一页
  /// [centerTitle] 是否居中显示标题
  /// [systemOverlayStyle] 状态栏样式
  /// [backgroundColor] 状态栏样式
  /// [bottomLine] 是否显示底部分割线
  /// [bottomLineColor] 底部分割线颜色

  ChatUIKitAppBarModel({
    this.title,
    this.centerWidget,
    this.titleTextStyle,
    this.subtitle,
    this.subTitleTextStyle,
    this.leadingActions,
    this.leadingActionsBuilder,
    this.trailingActions,
    this.trailingActionsBuilder,
    this.showBackButton = true,
    this.onBackButtonPressed,
    this.centerTitle = false,
    this.systemOverlayStyle,
    this.backgroundColor,
    this.bottomLine,
    this.bottomLineColor,
  });
```

#### 示例

```dart
appBarModel: ChatUIKitAppBarModel(
  title: "聊天",
  leadingActions: ["返回"].map((e) {
    return ChatUIKitAppBarAction(
      child: Text(
        e,
        style: const TextStyle(fontSize: 18),
      ),
      onTap: (context) {
        Navigator.of(context).pop();
      },
    );
  }).toList(),
  showBackButton: false,
  centerTitle: true,
),
```

## 自定义 ListItemBuilder

包含 list 的组件都可以通过 `itemBuilder` 对单独的 `item` 进行自定义。

#### 示例

```dart
itemBuilder: (context, model) {
  return ListTile(
    title: Text(model.showName),
    subtitle: const Text('子标题'),
    onTap: () {
      Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => MessagesView(profile: model.profile)),
      );
    },
  );
},
```

