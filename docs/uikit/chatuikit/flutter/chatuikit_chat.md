# 聊天消息

<Toc />

聊天消息 `MessagesView` 是 `ChatUIKit` 提供的主要组件, 用于展示用户之间的消息。

`MessagesView` 可以直接使用，也可以通过[路由](chatuikit_advanceusage.html#路由的使用)使用。

目前消息页面中提供以下功能：

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件和名片消息。
- 对消息进行复制、引用、撤回、删除、编辑、重新发送和审核。
- 从服务器拉取漫游消息。
- 清除本地消息。

消息相关功能，详见[功能介绍文档](chatfeature_message.html)。

![img](@static/images/uikit/chatuikit/android/page_chat.png =300x630) 

## 添加消息页面

添加消息页面时，可以直接添加到你需要展示的位置并传入 `ChatUIKitProfile` 信息。`ChatUIKitProfile` 为用户信息包装类，详见[用户信息展示](chatuikit_userinfo.html)。

同时，在[会话列表](chatuikit_conversation.html) 中点击会话，也会跳转至消息页面。

```dart
@override
Widget build(BuildContext context) {
  return MessagesView(
    profile: ChatUIKitProfile.contact(
      id: chatterId,
    ),
  );
}
```

## 自定义消息页面

如果需要自定义消息页面，可以修改以下参数：

| 参数 | 描述 |
|---|---|
| final ChatUIKitProfile profile | 用户信息包装类，具体可以参考 [用户信息展示](chatuikit_userinfo.html)。|
| final MessageListViewController? controller | 消息列表控制器。|
| final ChatUIKitAppBar? appBar | 自定义消息页面 `appBar` 如不设置会使用默认的。|
| final bool enableAppBar | 是否开启 `appBar`，默认开启，关闭后将不再显示 `appBar`，传入的 `appBar` 也不再生效。|
| final String? title | 默认 `appBar` 展示的标题信息。如果使用自定义了 `appBar` 或者 `enableAppBar = false`, 则不生效。|
| final Widget? inputBar | 自定义输入组件。如不设置会使用默认的 `ChatUIKitInputBar`。|
| final CustomTextEditingController? inputBarTextEditingController | `inputBar` 控制器。如果自定义了 `inputBar` 此处设置将不生效。|
| final bool showAvatar | 是否显示头像。|
| final bool showNickname | 是否显示昵称。|
| final MessageItemTapHandler? onItemTap | 消息点击事件，默认会处理视频、图片、音频类型消息。自定义时如果需要拦截点击，返回 `true`, 如果不拦截，返回 `false`。|
| final MessageItemTapHandler? onItemLongPress | 消息长按事件，长按后默认会弹出菜单，自定义时如果需要拦截点击，返回 `true`, 如果不拦截，返回 `false`。|
| final MessageItemTapHandler? onDoubleTap | 消息双击事件，默认没有实现。自定义时如果需要拦截点击，返回 `true`, 如果不拦截，返回 `false`。|
| final MessageItemTapHandler? onAvatarTap | 头像点击事件，默认会跳转到消息发送方的联系人详情页。如果发送方不是好友，则调到添加好友详情页，自定义时如果需要拦截点击，返回 `true`；如果不拦截，返回 `false`。|
| final MessageItemTapHandler? onAvatarLongPress | 头像长按事件，默认没有实现。自定义时如果需要拦截点击，返回 `true`；如果不拦截，返回 `false`。|
| final MessageItemTapHandler? onNicknameTap | 昵称长按事件，默认没有实现。自定义时如果需要拦截点击，返回 `true`, 如果不拦截，返回 `false`。|
| final ChatUIKitMessageListViewBubbleStyle bubbleStyle | 消息气泡样式。目前提供两种样式 `ChatUIKitMessageListViewBubbleStyle.arrow`(默认), `ChatUIKitMessageListViewBubbleStyle.noArrow`。|
| final MessageItemBuilder? itemBuilder | 消息 item 自定义 builder。如果需要重写消息样式(包括头像，昵称，消息气泡, 消息引用等所有样式)，在此处实现。|
| final MessageItemBuilder? alertItemBuilder | 提示消息 item 自定义 builder。如果需要重写提示消息样式，在此处实现。|
| final FocusNode? focusNode | 输入控件焦点控制器，不建议设置。如果自定义了 `inputBar` 则设置不生效。|
| final List&lt;ChatUIKitBottomSheetItem&gt;? morePressActions | 默认 `inputBar` 中提供的 更多按钮菜单项。如不设置会使用默认菜单。自定义`inputBar` 后不生效。|
| final MessagesViewMorePressHandler? onMoreActionsItemsHandler | 点击 默认 `inputBar` 时回调，可以返回一个新的菜单列表。如返回 `null` 或不实现，则使用 `morePressActions` 中设置的内容，如果没设置 `morePressActions` 则使用默认的。|
| final List&lt;ChatUIKitBottomSheetItem&gt;? longPressActions | 消息长按菜单, 如不设置会使用默认菜单。|
| final MessagesViewItemLongPressHandler? onItemLongPressHandler | 消息长按菜单项时回调，可以返回一个新的菜单列表。如返回 `null` 或不实现，则使用 `longPressActions` 中设置的内容，如果没设置 `longPressActions` 则使用默认的。|
| final bool? forceLeft | 强制所有消息在左侧。|
| final Widget? emojiWidget | 表情 widget，如果不设置则使用默认的。|
| final MessageItemBuilder? replyBarBuilder | 自定义 `replyBar` 组件, 用于在消息引用时临时在输入框上方展示消息内容，如不设置会使用默认的 `ChatUIKitReplyBar`。|
| final Widget Function(BuildContext context, QuoteModel model)? quoteBuilder | 自定义消息引用在展示时的样式。如不设置则使用默认样式。|
| final bool Function(BuildContext context, Message message)? onErrorTapHandler; | 点击消息发送失败红点时回调。如不设置则会触发重发消息。|
| final MessageItemBubbleBuilder? bubbleBuilder | 消息气泡。如果需要自定义消息气泡需要在此处实现，如果不设置则默认使用 `ChatUIKitMessageListViewBubble`。|
| final MessageBubbleContentBuilder? bubbleContentBuilder | 消息气泡内容。如果需要自定义实现气泡内容需要在此处实现，如果不设置则使用默认。|
| final String? attributes | 扩展参数，会传入到下一个页面。|