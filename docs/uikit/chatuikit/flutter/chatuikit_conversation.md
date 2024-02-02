# 会话列表

<Toc />

会话列表 `ConversationsView` 是 `ChatUIKit` 提供的主要组件, 用于展示用户会话列表，包括会话名称、最后一条消息、最后一条消息的时间以及置顶和禁言状态等。

`ConversationsView` 可以直接使用，也可以通过[路由](chatuikit_advanceusage.html#路由的使用)使用。

对于单聊和群聊, 会话展示的名称为你设置的 Profile 中的昵称，若未获取到昵称，则展示 ID；会话头像为你设置的 Profile 中的头像，如果没有设置，则使用默认头像。

![img](@static/images/uikit/chatuikit/android/page_conversation.png) 

## 添加会话列表

添加会话列表时，只需要将 `ConversationsView` 添加到页面上即可。

```dart
@override
Widget build(BuildContext context) {
  return const ConversationsView();
}
```

## 自定义会话列表

如果需要自定义会话列表，可以修改以下参数：

| 参数 | 描述 |
|---|---|
| final ConversationListViewController? controller | 会话列表控制器， 如果不传内部会使用默认的控制器。|
| final ChatUIKitAppBar? appBar | 自定义会话列表 `appBar`。如不设置会使用默认的。|
| final bool enableAppBar | 是否开启 `appBar`，默认开启。关闭后将不再显示 `appBar`，传入的 `appBar` 也不再生效。|
| final String? title | 默认 `appBar` 的标题展示内容。如果传入了自定义 `appBar`, 本设置将不生效。|
| final AppBarMoreActionsBuilder? appBarMoreActionsBuilder | 默认 `appBar` 右上角**更多**按钮点击回调, 会提供一个默认操作列表，返回一个新的操作列表。|
| final void Function(List<ConversationModel> data)? onSearchTap | 会话列表搜索点击事件回调，点击后会把当前所有的会话回调出来，如果不设置会有默认实现。|
| final List<Widget>? beforeWidgets | 展示在会话列表前面的 widget。|
| final List<Widget>? afterWidgets | 展示在会话列表后面的 widget。|
| final ConversationItemBuilder? listViewItemBuilder | 会话列表 item builder。如果需要重写会话列表，在此处实现。|
| final void Function(BuildContext context, ConversationModel info)? onTap | 会话列表点击回调。如果不实现，默认会跳转到消息页面。|
| final ConversationsViewItemLongPressHandler? onLongPressHandler | 会话列表长按事件。会提供一个默认操作列表，返回一个新的操作列表。|
| final String? searchBarHideText | 搜索框中默认展示的文字内容。|
| final bool enableSearchBar | 是否使用搜索。<br/> - （默认）`true`：使用；<br/> - `false`：不使用。|
| final Widget? listViewBackground | 列表为空时展示的背景图。|
| final String? attributes | 扩展参数，会传入到下一个页面。|


## 更多

- 获取未读消息数(不包括免打扰会话)，一般用于显示会话页面的总未读数。

```dart
try {
  // withoutIds: 需要排除的id列表，可以是群组 ID 或者用户 ID。 如果不传，则为获取所有非免打扰会话的总消息未读数。
  // unreadCount: 返回的未读数, 除了 'withoutIds` 的其他非免打扰会话未读消息总数。
  int unreadCount = await ChatUIKit.instance.getUnreadMessageCount(
    withoutIds: [
      'userId1',
      'groupId1',
    ],
  );
} catch (e) {
  // 错误
}
```

- 获取指定会话未读消息数(包括免打扰会话), 一般用于显示聚合会话的总未读数。

```dart
try {
  // appointIds: 会话 ID。
  // unreadCount: `appointIds`中会话 ID 的未读消息总数，包含设置了免打扰会话的消息未读数。
  int unreadCount = await ChatUIKit.instance.getAppointUnreadCount(
    appointIds: [
      'userId1',
      'groupId1',
    ],
  );
} catch (e) {
  // 错误
}
```

获取指定会话中有未读消息的会话数量,  一般用于显示聚合会话中有新消息的会话数。

```dart
try {
  // appointIds: 指定要获取是否包含新消息的会话范围。
  // hasUnreadMessagesConversationCount: 返回传入的 `appointIds` 中有新消息的会话数量，该返回包含了设置免打扰的会话。
  int hasUnreadMessagesConversationCount =
      await ChatUIKit.instance.appointNewMessageConversationCount(
    appointIds: [
      'conversationId1',
      'conversationId2',
      'conversationId3',
    ],
  );
} catch (e) {
  // 错误
}
```
