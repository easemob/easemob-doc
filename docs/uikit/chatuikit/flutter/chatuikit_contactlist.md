# 联系人列表

<Toc />

联系人列表 `ContactsView` 是 `ChatUIKit` 提供的主要组件, 用于展示用户列表，包括联系人搜索，添加联系人，好友申请列表入口，群组列表入口，联系人列表。

昵称在中文或者英文的情况下可以实现按首字母分类。

`ContactsView` 可以直接使用，也可以通过[路由](chatuikit_advancedusage.html#路由的使用)使用。

![img](@static/images/uikit/chatuikit/android/page_contact_list.png =400x850)  

### 添加联系人列表

添加会话列表时，只需要将 `ConversationsView` 添加到页面上即可。

```dart
@override
Widget build(BuildContext context) {
  return const ContactsView();
}
```

### 自定义联系人列表

| 参数 | 描述 |
|---|---|
| final ContactListViewController? controller | 联系人列表控制器。|
| final ChatUIKitAppBar? appBar | 自定义消息页面 `appBar`。如不设置会使用默认的。|
| final bool enableAppBar | 是否开启 `appBar`。默认开启，关闭后将不再显示 `appBar`，传入的 `appBar` 也不再生效。| 
| final String? title | 默认 `appBar` 展示的标题信息。如果使用自定义了 `appBar` 或者 `enableAppBar = false`, 则不生效。|
| final void Function(List&lt;ContactItemModel&gt; data)? onSearchTap | 联系人列表搜索点击事件回调。点击后会把当前所有的恋人回调出来，如果不设置会有默认实现。|
| final bool enableSearchBar | 是否显示联系人搜索框，默认为 `true`。|
| final String? searchHideText | 搜索框中默认展示的文字内容。|
| final List&lt;ChatUIKitListViewMoreItem&gt;? beforeItems | 展示在联系人列表前面的 widget，设置后将不再显示 `好友申请` 和 `群组列表` 入口。|
| final List&lt;ChatUIKitListViewMoreItem&gt;? afterItems | 展示在联系人列表后面的 widget。|
| final ChatUIKitContactItemBuilder? listViewItemBuilder | 联系人列表 item builder。如果如要自定义显示需要在此处设置。|
| final void Function(BuildContext context, ContactItemModel model)? onTap | 联系人列表 item 点击事件，如果不设置则默认进入联系人详情。|
| final void Function(BuildContext context, ContactItemModel model)? onLongPress | 联系人列表 item 长按事件，无默认实现，如果需要添加长按事件需要在此处设置。|
| final Widget? listViewBackground | 联系人为空时展示的背景图。如果不设置会有默认实现。|
| final String? loadErrorMessage | 联系人加载失败时现实的文字信息。如果设置会有默认实现。|
| final String? attributes | 扩展参数，会传入到下一个页面。|

## 更多

如需获取好友申请数量，参考以下示例代码：

```dart
try {
  int newRequestCount = await ChatUIKit.instance.contactRequestCount();
} catch (e) {
  // some error
}
```