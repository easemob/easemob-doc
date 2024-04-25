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
| ChatUIKitRouteNames.showImageView |  '/ShowImageView'; | 查看图片页面。|
| ChatUIKitRouteNames.showVideoView |  '/ShowVideoView'; | 查看视频页面。|
| ChatUIKitRouteNames.searchHistoryView |  '/SearchHistoryView'; | 搜索历史消息页面|
| ChatUIKitRouteNames.threadMessagesView |  '/ThreadMessagesView'; | Thread 消息页面。|
| ChatUIKitRouteNames.threadMembersView |  '/ThreadMembersView'; | Thread 成员页面。|
| ChatUIKitRouteNames.threadsView |  '/ThreadsView'; | Thread 列表页面。|
  

### 路由的使用

需要自定义页面跳转或者页面样式时可以对路由进行拦截和自定义，之后将自定义的 `RouteSettings` 传给 `ChatUIKitRoute.generateRoute`;

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
| ThreadMembersViewArguments | thread 成员列表页面参数包装类。|
| ThreadMessagesViewArguments | thread 消息列表页面参数包装类。|
| ThreadsViewArguments| thread 列表页面参数包装类。|

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

## 配置联系人首字母排序


当用户昵称中出现中文时需要将中文中的姓氏转化为字母才能正确的在联系人列表中索引，此时可以通过以下方式将showName的值改为字符返回。

```dart
ChatUIKitAlphabetSortHelper.instance.sortHandler = (showName) {
  // 将showName的第一个字母返回，如果中文，可以用第三方库进行转换，之后返回。
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

### 设置消息长按顺序

消息长按时回弹出对消息的操作菜单，可以通过 `ChatUIKitSettings.msgItemLongPressActions` 进行默认值修改，默认为：

```dart
  static List<MessageLongPressActionType> msgItemLongPressActions = [
    MessageLongPressActionType.reaction,
    MessageLongPressActionType.copy, // only text message
    MessageLongPressActionType.reply,
    MessageLongPressActionType.forward,
    MessageLongPressActionType.multiSelect,
    MessageLongPressActionType.translate, // only text message
    MessageLongPressActionType.thread, // only group message
    MessageLongPressActionType.edit, // only text message
    MessageLongPressActionType.report,
    MessageLongPressActionType.recall,
    MessageLongPressActionType.delete,
  ];
```

此时长按消息时，可以通过调整顺序和内容对弹出的菜单进行修改，如去掉 `ChatUIKitSettings.msgItemLongPressActions` 中的 `MessageLongPressActionType.copy`, 长按文本消息时将不再显示"copy"。


### 设置是否开启 消息话题 功能

话题（即 `Thread`）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/)上已申请试用该功能。

消息话题特性在 `ChatUIKitSettings.enableChatThreadMessage` 中提供开关，默认值为 `false`。要开启该特性，需将该参数设置为 `true`。

示例代码如下：

```dart
    ChatUIKitSettings.enableMessageThread = true;
```

### 设置是否开启 消息翻译 功能

消息翻译是指用户可以将一条消息翻译成其他语言。消息翻译可以帮助使用不同语言的用户进行沟通。

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/)上已申请试用该功能。

1. 开启消息翻译特性。

单群聊 UiKit 的 `ChatUIKitSettings` 对象中提供了  `ChatUIKitSettings.enableMessageTranslation` 设置是否开启消息翻译功能，默认值为 `false`。要开启该特性，需将该参数设置为 `true`。示例代码如下：

```dart
   ChatUIKitSettings.enableMessageTranslation = true;
```

1. 设置翻译的目标语言。

单群聊 UiKit 的 `ChatUIKitSettings` 对象中提供了 `translateTargetLanguage` 属性设置目标翻译语言。

```dart
   ChatUIKitSettings.translateTargetLanguage = 'zh-Hans';
```

更多翻译目标语言请参考 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)

### 设置是否开启表情回复功能

表情回复（即 `Reaction`）指用户可以使用表情符号回复消息。表情回复可以帮助用户表达情绪、态度、进行调查或投票。在单群聊 UIKit 中，用户可以长按单条消息触发消息拓展功能菜单，选择表情回复。

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/)上已申请试用该功能。

单群聊 UiKit 的 `ChatUIKitSettings` 对象中提供了 `enableMessageReaction` 属性用于设置是否开启 `Reaction` 功能, 默认值为 `false`。要开启该功能，将该参数设置为 `true`。示例代码如下：

```dart
    ChatUIKitSettings.enableMessageReaction = true;
```


### 设置是否开启消息引用

消息引用，即长按消息时对消息进行回复，在回复发出去后会在回复的消息中展示原消息内容。该功能默认 `true`， 如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageReply = false;
```

### 设置是否开启消息撤回功能

消息撤回，即消息的发送方可以在规定时间内对消息进行撤回的操作。该功能默认 `true`， 如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageRecall = false;
```

配置 `撤回消息` Item 显示的时长。若超过该时长，长按消息后将不再显示 `撤回消息`。

该时长默认为 `120秒`。

```dart
ChatUIKitSettings.recallExpandTime = 120;
```


### 设置是否开启消息编辑

消息编辑，即对自己发出的文字消息进行编辑，该功能默认为 `true`, 如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageEdit = false;
```

### 设置是否开启消息举报

消息举报，即对发送或者收到的消息进行举报，该功能默认为 `true`, 如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageReport = false;
```

设置举报内容，举报内容是一组 k-v. Map<String, String>，即 report tag 和 report reason。uikit中提供了设置 report tag的方式，对应的reason需要在国际化文件中进行填写。代码如下：

```dart
  /// 消息举报tag, 可以用于自定义，举报的 reason 需要写在国际化文件中，国际化文件中的reason的key要和tag一致。可以参考 [ChatUIKitLocal.reportTarget1]
  static List<String> reportMessageReason = [
    'tag1',
    'tag2',
    'tag3',
    'tag4',
    'tag5',
    'tag6',
    'tag7',
    'tag8',
    'tag9',
  ];
```

### 是否开启消息合并转发功能

合并转发，即同时选择多条消息进行转发，该功能默认为 `true`, 如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageMultiSelect = false;
```

### 是否开启单条消息转发功能

单条消息转发，即转发收到或者发送成功的消息，该功能默认为 `true`, 如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageForward = false;
```

### 联系人首字母索引顺序

联系人首字母索引顺序，即通讯录中联系人排序顺序，默认为 `ABCDEFGHIJKLMNOPQRSTUVWXYZ#`, 如果需要修改，可以参考一下代码

```dart
// 将首字母排序中的#号排到最前面
ChatUIKitSettings.sortAlphabetical = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
```