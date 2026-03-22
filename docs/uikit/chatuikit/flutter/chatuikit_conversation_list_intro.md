# 会话列表页面介绍

`ConversationsView` 用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室）。

## 页面功能

会话列表页面提供如下功能：

| 页面功能            | 描述   | 
| :-------------- | :----- | 
| 会话展示           | 展示所有单聊和群聊会话，按最新消息时间倒序排列。  | 
| 会话状态展示           | 显示会话的未读消息数和免打扰状态。  | 
| 会话搜索           | 点击搜索按钮，跳转至搜索页面进行会话查询。 | 
| 进入聊天           | 点击会话条目，跳转至对应的聊天页面。  | 
| 会话管理           | 支持会话置顶、删除、免打扰等操作。  | 
| 扩展功能           | 点击标题栏的扩展按钮，可选择创建新会话、添加好友或创建群组。  | 

## 页面组件

会话列表页面通过 `ConversationsView` 实现，由标题栏、搜索栏和会话列表组成。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/flutter/custom_conversation_list.png" title="会话列表页面 ConversationsView" />
</ImageGallery>

### 标题栏

会话列表页面与聊天页面、联系人列表页面、群详情页面、联系人详情页面的标题栏均使用 `ChatUIKitAppBar`。详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。

### 会话搜索栏

会话搜索栏 `fakeSearchBar` 的搜索功能实现会话搜索。点击搜索按钮，跳转到搜索页面，可按会话名称搜索会话。关于自定义，详见 [设置会话搜索栏](chatuikit_custom_conversation_list_searchbar.html)。

### 会话列表

会话列表组件 `ConversationListView` 按最新消息时间倒序排列，置顶会话始终显示在顶部。列表包含以下类型的会话：
- 通过标题栏右侧的加号创建的本地会话。
- 两个用户之间发送消息后创建的单聊会话。
- 群组中发送消息后创建的群组会话。

**首次加载建议**：在应用首次安装或卸载重装后，建议从服务端拉取历史会话列表，以填充本地数据库。

会话条目组件 `ChatUIKitConversationListViewItem` 实现单条会话展示，每个会话条目展示以下信息：

| 元素     | 说明                                                   |
| :------- | :----------------------------------------------------- |
| 头像     | 单聊显示对方头像（默认头像占位）；群聊显示群组默认头像。 |
| 名称     | 单聊显示对方昵称或 ID；群聊显示群组名称或 ID。           |
| 最新消息 | 显示最近一条消息的内容。                                |
| 消息时间 | 最新消息的发送时间。                                     |
| 状态标识 | 置顶、免打扰等状态图标。                                |

**交互操作**：

- **点击**：跳转至该会话的聊天页面
- **长按**：弹出操作菜单，支持免打扰、置顶、标记已读、删除

关于会话条自定义，详见 [会话列表的基本设置](chatuikit_custom_conversation_list_basic.html) 和 [高级设置](chatuikit_custom_conversation_list_advanced.html) 说明。

## 创建会话列表页面

单群聊 UIKit 提供 `ConversationsView`，添加到页面中即可使用。

示例如下：

```dart
import 'package:em_chat_uikit/chat_uikit.dart';

class ConversationListPage extends StatelessWidget {
  const ConversationListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ConversationsView(
      enableAppBar: true,
      enableSearchBar: true,
      appBarModel: ChatUIKitAppBarModel(
        title: '消息',
        showBackButton: false, // 首页不显示返回按钮
      ),
    );
  }
}
```

或者使用 `ConversationsView.arguments` 构造函数：

```dart
ConversationsView.arguments(
  ConversationsViewArguments(
    enableAppBar: true,
    enableSearchBar: true,
    appBarModel: ChatUIKitAppBarModel(
      title: '消息',
    ),
  ),
)
```

## 导航到会话列表页面

```dart
Navigator.of(context).push(
  MaterialPageRoute(
    builder: (context) => const ConversationListPage(),
  ),
);
```