# 联系人详情

<Toc />

<img src="imgs/contact_details.jpg" width=50%>

联系人详情页提供三处自定义项，

1. 可以通过 `appBarModel` 进行自定义。
2. 中间部分可以通过 `actionsBuilder` 进行自定义，默认 actions 会通过 builder 返回，需要返回要展示的 actions。 // TODO：actions 要替换为动作？
3. 可以通过 `itemsBuilder` 进行自定义，默认 items 会通过 builder 回调，需要返回需要展示的 items。// TODO：items 是列表项？

直接设置

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

通过 arguments 设置  // TODO：通过参数设置？

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