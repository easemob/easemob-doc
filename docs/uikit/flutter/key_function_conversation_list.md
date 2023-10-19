# 会话列表页面

会话列表页面展示了用户当前所有的单聊、群聊和聊天室会话。你可以创建会话列表界面，并设置自定义头像、昵称和界面的展示样式，添加自定义点击事件。

## 创建会话列表界面

em_chat_uikit 提供了 `ChatConversationsView`，添加到 `build` 中并传入相应的参数。

```dart
import 'package:flutter/material.dart'; 
import 'package:em_chat_uikit/em_chat_uikit.dart';

class ConversationsPage extends StatefulWidget {
  const ConversationsPage({super.key});

  @override
  State<ConversationsPage> createState() => _ConversationsPageState();
}

class _ConversationsPageState extends State<ConversationsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ConversationPage'),
      ),
      body: ChatConversationsView(),
    );
  }
}
```

效果图如下所示：

<img src=@static/images/uikitflutter/ChatConversationsView.png  width="300" height="700"/>

参数详情如下表所示：

通过 `ChatConversationsView`，你可以快速显示和管理当前会话。

| 属性 | 描述 |
| :-------------- | :----- |
| `controller` | `ChatConversationsView` Controller。 |
| `itemBuilder` | 会话列表条目 builder。若需进行自定义，会返回 widget。 |
| `avatarBuilder` | 头像 builder。若该属性未实现或你返回了 `null`，会使用默认头像。|
| `nicknameBuilder` | 昵称 builder。若你未设置该属性或返回了 `null`，会显示会话 ID。 |
| `onItemTap` | 会话列表条目的点击事件的回调。 |
| `backgroundWidgetWhenListEmpty` | 列表为空时为背景 widget。 |

## 自定义实现

### 设置会话头像

通过设置 `ChatConversationsView` 中的 `avatarBuilder` 实现自定义头像的功能。

```dart
class _ConversationsPageState extends State<ConversationsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ConversationPage'),
      ),
      body: ChatConversationsView(
        avatarBuilder: (context, conversation) {
          return const CircleAvatar(
            child: Text('Avatar'),
          );
        },
      ),
    );
  }
}
```

效果如下图所示：

<img src=@static/images/uikitflutter/ChatConversationsView_avatar.png  width="300" height="700"/>

### 设置会话名称

通过设置 `ChatConversationsView` 中的 `nicknameBuilder` 实现显示昵称功能。

```dart
class _ConversationsPageState extends State<ConversationsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ConversationPage'),
      ),
      body: ChatConversationsView(
        nicknameBuilder: (context, conversation) {
          return Text('nickname');
        },
      ),
    );
  }
}
```

效果如下图所示：

<img src=@static/images/uikitflutter/ChatConversationsView_nickname.png  width="300" height="700"/>

### 自定义显示样式

通过设置 `ChatConversationsView` 中的 `itemBuilder` 实现自定义显示会话。

```dart
class _ConversationsPageState extends State<ConversationsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ConversationPage'),
      ),
      body: ChatConversationsView(
        itemBuilder: (context, index, conversation) {
          return ListTile(
            title: Text(conversation.id),
            subtitle: Text('subtitle'),
          );
        },
      ),
    );
  }
}
```
效果如下图所示：

<img src=@static/images/uikitflutter/ChatConversationsView_custom.png  width="300" height="700"/>

### 自定义点击事件

通过设置 `ChatConversationsView` 中的 `onItemTap` 实现会话列表点击。

```dart
class _ConversationsPageState extends State<ConversationsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ConversationPage'),
      ),
      body: ChatConversationsView(
       onItemTap: (conversation) {
          print(conversation.id);
       },
      ),
    );
  }
}
```
效果如下图所示：

<img src=@static/images/uikitflutter/ChatConversationsView_click.png  width="300" height="700"/>
