# 群组详情

<Toc />

<img src="imgs/group_details.png" width=50%>

与联系人详情页面的自定义相似，群详情页提供三处自定义项：

1. 可以通过 `appBarModel` 进行自定义。
2. 中间部分可以通过 `actionsBuilder` 进行自定义，默认 actions 会通过 builder 返回，需要返回要展示的 actions。
3. 可以通过 `itemsBuilder` 进行自定义，默认 items 会通过 builder 回调，需要返回需要展示的 items。

直接设置

```dart
  GroupDetailsView(
    profile: ChatUIKitProfile.group(
      id: "groupId",
      groupName: "Group Name",
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

通过 arguments 设置

```dart
  static RouteSettings groupDetails(RouteSettings settings) {
    GroupDetailsViewArguments arguments =
        settings.arguments as GroupDetailsViewArguments;
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