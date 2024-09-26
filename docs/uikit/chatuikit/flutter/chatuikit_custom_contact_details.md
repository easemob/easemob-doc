# 设置联系人详情页面

<Toc />

你可以配置联系人详情页面的 App Bar、页面中间的按钮和联系人详情自定义列表项等。

![img](/images/uikit/chatuikit/flutter/custom_contact_details.png)

联系人详情页提供三处自定义项：

1. `AppBar`：可以通过 `appBarModel` 进行自定义。
2. 中间的按钮，包括发消息、搜索消息、音频通话和视频通话等：可以通过 `actionsBuilder` 进行自定义，默认事件会通过 builder 返回，需要返回要展示的事件。
3. 页面的列表项，包括消息免打扰、清空聊天记录等：可以通过 `itemsBuilder` 进行自定义，默认列表项会通过 builder 回调，需要返回需要展示的列表项。
   
- 直接在 `ContactDetailsView` 中设置：

```dart
  ContactDetailsView(
    profile: ChatUIKitProfile.contact(
      id: "userId",
      nickname: "nickname",
    ),
    appBarModel: ChatUIKitAppBarModel(
      centerTitle: true,
      title: "测试",
    ),
    itemsBuilder: (context, profile, defaultItems) {
      return [
        ...defaultItems,
        ChatUIKitDetailsListViewItemModel.space(),
        ChatUIKitDetailsListViewItemModel(
          title: "添加内容",
          onTap: () {},
        )
      ];
    },
    actionsBuilder: (context, defaultList) {
      return [
        ...defaultList ?? [],
        ChatUIKitDetailContentAction(
          iconSize: const Size(30, 35),
          icon: 'assets/images/chat.png',
          title: "聊天",
          onTap: (ctx) {},
        ),
      ];
    },
  );
```

- 通过 `ContactDetailsViewArguments` 设置：

```dart
  static RouteSettings contactDetails(RouteSettings settings) {
    ContactDetailsViewArguments arguments =
        settings.arguments as ContactDetailsViewArguments;
    arguments = arguments.copyWith(
      appBarModel: ChatUIKitAppBarModel(
        centerTitle: true,
        title: "测试",
      ),
      itemsBuilder: (context, profile, defaultItems) {
        return [
          ...defaultItems,
          ChatUIKitDetailsListViewItemModel.space(),
          ChatUIKitDetailsListViewItemModel(
            title: "添加内容",
            onTap: () {},
          )
        ];
      },
      actionsBuilder: (context, defaultList) {
        return [
          ...defaultList ?? [],
          ChatUIKitDetailContentAction(
            iconSize: const Size(30, 35),
            icon: 'assets/images/chat.png',
            title: "聊天",
            onTap: (ctx) {},
          ),
        ];
      },
    );

    return RouteSettings(name: settings.name, arguments: arguments);
  }
```