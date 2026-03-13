# 会话列表的基本设置

本文介绍如何通过 `ConversationsView` 实现会话列表的基本设置，包括会话列表空白页面、添加自定义会话列表和设置会话事件监听。

## 概述

`ConversationsView` 提供了丰富的参数，支持以下会话自定义设置：

- [设置会话列表空白页面](#设置会话列表空白页面)。
- [添加自定义会话列表](#添加自定义会话列表)：自定义会话列表布局。
- [设置会话事件监听](#设置事件监听)。

使用示例如下：

```dart
ConversationsView(
  enableAppBar: true,
  appBarModel: ChatUIKitAppBarModel(
    title: '消息',
    showBackButton: true,
    onBackButtonPressed: () {
      Navigator.of(context).pop();
    },
  ),
  enableSearchBar: true,
  searchBarHideText: '搜索',
  emptyBackground: CustomEmptyWidget(),
  itemBuilder: (context, model) {
    // 自定义会话项
    return null; // 返回 null 使用默认渲染
  },
  onItemTap: (context, info) {
    // 点击会话项
  },
  onItemLongPressHandler: (context, info, menuItems) {
    // 长按会话项
    return menuItems;
  },
  controller: customController,
)
```

`ConversationsView` 提供的主要参数如下表所示：

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `enableAppBar` | `bool` | 是否显示默认的标题栏 `ChatUIKitAppBar`。<br/> - (默认) `true`：是。<br/> - `false`: 否。<br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。 |
| `appBarModel` | `ChatUIKitAppBarModel?` | 设置标题栏的模型，包含标题等。<br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。 |
| `enableSearchBar` | `bool` | 设置是否使用搜索栏，默认为 `true`。 |
| `searchBarHideText` | `String?` | 设置搜索栏的占位文本。 |
| `itemBuilder` | `ConversationItemBuilder?` | 设置自定义的会话项构建器，默认为 `ChatUIKitConversationListViewItem`。 |
| `onItemTap` | `void Function(BuildContext, ConversationItemModel)?` | 设置会话条目点击事件监听器。 |
| `onItemLongPressHandler` | `ConversationsViewItemLongPressHandler?` | 设置会话条目长按事件监听器。 |
| `emptyBackground` | `Widget?` | 设置会话列表的空白页面。 |
| `controller` | `ConversationListViewController?` | 设置会话列表控制器，如果不设置会自动创建。 |
| `beforeWidgets` | `List<Widget>?` | 会话列表之前的组件列表。 |
| `afterWidgets` | `List<Widget>?` | 会话列表之后的组件列表。 |
| `onSearchTap` | `void Function(List<ConversationItemModel>)?` | 点击搜索按钮的回调。 |

## 设置会话列表空白页面

`ConversationsView` 提供 `emptyBackground` 参数设置会话列表的空白页面。

```dart
ConversationsView(
  emptyBackground: Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.chat_bubble_outline, size: 80),
        SizedBox(height: 16),
        Text('暂无会话'),
      ],
    ),
  ),
)
```

## 添加自定义会话条目

开发者可以通过 `itemBuilder` 参数实现自定义会话项：

1. 创建自定义会话项构建器。

```dart
ConversationsView(
  itemBuilder: (context, model) {
    // 根据会话类型返回自定义 Widget
    if (model.profile.type == ChatUIKitProfileType.group) {
      return CustomGroupConversationItem(model: model);
    }
    // 返回 null 使用默认渲染
    return null;
  },
)
```

2. 通过继承 `ConversationListViewController` 进行自定义设置。

创建自定义 `CustomConversationListViewController`，继承自 `ConversationListViewController`：

```dart
class CustomConversationListViewController extends ConversationListViewController {
  @override
  void fetchItemList() {
    // 自定义获取会话列表逻辑
    super.fetchItemList();
  }
}

// 使用自定义控制器
ConversationsView(
  controller: CustomConversationListViewController(),
)
```

## 设置事件监听

`ConversationsView` 提供针对会话条目及长按菜单的事件监听配置。建议通过参数进行统一设置。

```dart
ConversationsView(
  onItemTap: (context, info) {
    // 点击会话项
    print('Conversation tapped: ${info.profile.id}');
  },
  onItemLongPressHandler: (context, info, menuItems) {
    // 长按会话项，可以修改菜单项
    return menuItems;
  },
  onSearchTap: (data) {
    // 点击搜索按钮
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => SearchPage(conversations: data),
      ),
    );
  },
)
```

| 参数 | 描述 |
| :--- | :--- |
| `onItemTap` | 设置会话条目点击事件监听器。 |
| `onItemLongPressHandler` | 设置会话条目长按事件监听器。 |
| `onSearchTap` | 设置搜索按钮点击事件监听器。 |

## 默认会话操作

长按会话条目会显示会话操作菜单。会话列表页面使用 `ConversationListViewController` 中提供的方法默认实现以下操作：

| 会话操作 | 描述 |
| :------- | :--- |
| 会话免打扰 | - `makeSilentForConversation()`：设置会话免打扰。<br/> - `cancelSilentForConversation()`：取消会话免打扰。 |
| 会话置顶 | - `pinConversation()`：置顶会话。<br/> - `unpinConversation()`：取消置顶。 |
| 会话标记已读 | `makeConversationRead()`：标记会话为已读状态。 |
| 会话删除 | `deleteConversation()`：删除会话。 |
