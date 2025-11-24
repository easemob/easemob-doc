# 会话列表页面

## 概述

会话列表 `ConversationsView` 是 `ChatUIKit` 提供的主要组件, 用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并且提供会话搜索、删除、置顶和免打扰功能。单条会话展示用户会话列表，包括会话名称、最后一条消息、最后一条消息的时间以及置顶和禁言状态等。

`ConversationsView` 可以直接使用，也可以通过[路由](chatuikit_advancedusage.html#路由的使用)使用。

对于单聊和群聊, 会话展示的名称为你设置的 Profile 中的昵称，若未获取到昵称，则展示 ID；会话头像为你设置的 Profile 中的头像，如果没有设置，则使用默认头像。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/flutter/custom_conversation_list.png" title="会话列表" />
</ImageGallery>

## 创建会话列表页面

添加会话列表时，只需要将 `ConversationsView` 添加到页面上即可。

```dart
@override
Widget build(BuildContext context) {
  return const ConversationsView();
}
```