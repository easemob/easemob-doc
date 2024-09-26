# 设置聊天页面

<Toc />

聊天消息 `MessagesView` 是 `ChatUIKit` 提供的主要组件, 用于展示用户之间的消息。

`MessagesView` 可以直接使用，也可以通过[路由](chatuikit_advancedusage.html#路由的使用)使用。

目前消息页面中提供以下功能：

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件、名片和合并类型的消息。
- 对消息进行复制、表情回复、引用、撤回、删除、置顶、编辑、重新发送和审核。
- 从服务器拉取漫游消息。
- 清除本地消息。

消息相关功能，详见[功能介绍文档](chatfeature_message.html)。

![img](/images/uikit/chatuikit/flutter/custom_chat.png)

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
| final ChatUIKitAppBarModel? appBarModel | 自定义消息页面 `appBar`, 如不设置会使用默认的。|
| final bool enableAppBar | 是否开启 `appBar`，默认开启，关闭后将不再显示 `appBar`，传入的 `appBar` 也不再生效。|
| final Widget? inputBar | 自定义输入组件。如不设置会使用默认的 `ChatUIKitInputBar`。|
| final CustomTextEditingController? inputBarTextEditingController | `inputBar` 控制器。如果自定义了 `inputBar` 此处设置将不生效。|
| final bool showMessageItemAvatar | 是否显示头像。|
| final bool showMessageItemNickname | 是否显示昵称。|
| final MessageItemTapHandler? onItemTap | 消息点击事件，默认会处理视频、图片、音频类型消息。自定义时如果需要拦截点击，返回 `true`, 如果不拦截，返回 `false`。|
| final MessageItemTapHandler? onDoubleTap | 消息双击事件，默认没有实现。自定义时如果需要拦截点击，返回 `true`, 如果不拦截，返回 `false`。|
| final MessageItemTapHandler? onAvatarTap | 头像点击事件，默认会跳转到消息发送方的联系人详情页。如果发送方不是好友，则调到添加好友详情页，自定义时如果需要拦截点击，返回 `true`；如果不拦截，返回 `false`。|
| final MessageItemTapHandler? onAvatarLongPress | 头像长按事件，默认没有实现。自定义时如果需要拦截点击，返回 `true`；如果不拦截，返回 `false`。|
| final MessageItemTapHandler? onNicknameTap | 昵称长按事件，默认没有实现。自定义时如果需要拦截点击，返回 `true`, 如果不拦截，返回 `false`。|
| final MessageItemBuilder? itemBuilder | 消息 item 自定义 builder。如果需要重写消息样式(包括头像，昵称，消息气泡, 消息引用等所有样式)，在此处实现。|
| final MessageItemBuilder? alertItemBuilder | 提示消息 item 自定义 builder。如果需要重写提示消息样式，在此处实现。|
| final List&lt;ChatUIKitBottomSheetAction&gt;? morePressActions | 默认 `inputBar` 中提供的 更多按钮菜单项。如不设置会使用默认菜单。自定义 `inputBar` 后不生效。|
| final MessagesViewMorePressHandler? onMoreActionsItemsHandler | 点击默认 `inputBar` 时回调，可以返回一个新的菜单列表。如返回 `null` 或不实现，则使用 `morePressActions` 中设置的内容。|
| final MessagesViewItemLongPressHandler? onItemLongPressHandler | 消息长按菜单项时回调，可以返回一个新的菜单列表。如返回 `null` 或不实现，则使用 `longPressActions` 中设置的内容。|
| final bool? forceLeft | 强制所有消息在左侧。|
| final Widget? emojiWidget | 表情 widget，如果不设置则使用默认的。|
| final MessageItemBuilder? replyBarBuilder | 自定义 `replyBar` 组件, 用于在消息引用时临时在输入框上方展示消息内容，如不设置会使用默认的 `ChatUIKitReplyBar`。|
| final Widget Function(BuildContext context, QuoteModel model)? quoteBuilder | 自定义消息引用在展示时的样式。如不设置则使用默认样式。|
| final MessageItemTapHandler? onErrorBtnTapHandler | 错误消息点击事件，如果设置后将会替换默认的错误消息点击事件。如果不处理可以返回 `false`。默认行为为重新发送消息。|
| final MessageItemBubbleBuilder? bubbleBuilder | 消息气泡。如果需要自定义消息气泡需要在此处实现，如果不设置则默认使用 `ChatUIKitMessageListViewBubble`。|
| final MessageBubbleContentBuilder? bubbleContentBuilder | 消息气泡内容。如果需要自定义实现气泡内容需要在此处实现，如果不设置则使用默认。|
| final String? attributes | 扩展参数，会传入到下一个页面。|
| final Widget? multiSelectBottomBar | 多选时显示的 bottom bar。 |
| final MessageReactionItemTapHandler? onReactionItemTap | 表情回复 Reaction 点击事件，如果设置后将会替换默认的反应点击事件。| 
| final MessageItemTapHandler? onReactionInfoTap | 表情回复 Reaction 信息点击事件，如果设置后将会替换默认的反应信息点击事件。|
| final MessageItemBuilder? reactionItemsBuilder | 表情回复 Reaction 构建器，如果设置后将会替换默认的反应构建器。|
| final MessageItemTapHandler? onThreadItemTap | 消息话题 Thread 点击事件，如果设置后将会替换默认的线程点击事件。|
| final MessageItemBuilder? threadItemBuilder | 消息话题 Thread 构建器，如果设置后将会替换默认的线程构建器。|
| final ChatUIKitViewObserver? viewObserver | 用于刷新页面的 Observer。 |

## 自定义 AppBar

你可通过 `enableAppBar` 设置是否显示 AppBar，也可通过 `appBarModel` 对 AppBar 进行自定义。

```dart
MessagesView(
  appBarModel: ChatUIKitAppBarModel(
    title: 'Title',
    subtitle: 'Subtitle',
  ),
);
```

关于 AppBar 的自定义详细描述，参见[进阶用法文档](chatuikit_advancedusage.html#自定义-appbar)。

## 消息列表组件

消息页面可通过以下两种方式自定义：

- 需要跳转到 `MessagesView` 页面时直接自定义。
- 通过路由跳转时对 `RouteSettings` 进行自定义。该方式详见 [路由的使用](chatuikit_advancedusage.html#路由的使用)。

### 消息列表的头像和昵称

消息列表展示遵循 `ChatUIKitProvider` 原则，如果需要设置头像和昵称，可以查看[头像和昵称](chatuikit_userinfo.html)设置。若需设置头像和昵称是否显示，可通过 `showMessageItemAvatar` 和 `showMessageItemNickname` 进行设置。

对于头像的圆角、默认头像等设置，详见[全局配置项文档](chatuikit_advancedusage.html#其他全局配置项)。

```dart
MessagesView(
  profile: ChatUIKitProfile.contact(id: 'userId', nickname: 'nickname'),
  showMessageItemAvatar: (model) {
    return true;
  },
  showMessageItemNickname: (model) {
    return true;
  },
  ...
);
```

### 自定义消息气泡

可通过 `bubbleBuilder` 自定义消息气泡，包括气泡的颜色和圆角类型。

```dart
MessagesView(
  profile: ChatUIKitProfile.contact(id: 'userId', nickname: 'nickname'),
  ...
  bubbleBuilder: (context, child, model) {
    // 自定义气泡
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
      ),
      child: child,
    );
  },
);
```

### 自定义列表组件

若需自定义消息列表项，可通过 `itemBuilder` 实现自定义。如果返回 `null`，则表示不修改本列表项，使用默认实现。

```dart
MessagesView(
  profile: ChatUIKitProfile.contact(id: 'userId', nickname: 'nickname'),
  ...
  itemBuilder: (context, model) {
    if (model.message.bodyType == MessageType.TXT) {
      return Text(model.message.textContent);
    } else {
      return null;
    }
  },
);
```

### 自定义消息时间戳

会话列表项、消息列表项、置顶消息列表项都有消息时间。默认规则为当天的消息显示具体时间，非当天的显示日期。若不满足需求，可通过 `ChatUIKitTimeFormatter` 进行自定义。

```dart
ChatUIKitTimeFormatter.instance.formatterHandler = (ctx, type, time) {
  if (type == ChatUIKitTimeType.message) {
    return 'message time';
  }
  return null;
};
```

消息时间戳由 `type` 和 `time` 两个参数决定，根据这两个参数返回格式化后的时间样式。

- `type` 为枚举类型，包括会话、消息和消息置顶三种类型。

```dart
enum ChatUIKitTimeType { conversation, message, messagePinTime }
```

- `time` 为时间戳。