# 消息列表的基本设置

消息列表是聊天界面的核心组件，基于 `MessageListView` 实现。本文介绍如何通过 `MessagesView` 的参数实现消息列表和消息条目的基本设置。

如需通过 `MessagesViewController` 进行高级设置，详见 [消息列表的高级设置说明](chatuikit_custom_chat_advanced.md)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/flutter/chat_detail.png" title="完整的聊天页面 MessagesView" />
</ImageGallery>

## 概述

`MessagesView` 提供丰富的配置参数，便于开发者灵活自定义界面样式与交互行为。目前支持的主要设置项如下：

```dart
MessagesView(
  profile: profile,
  // AppBar 设置
  enableAppBar: true,
  appBarModel: ChatUIKitAppBarModel(
    title: '标题',
    subtitle: '副标题',
    showBackButton: true,
    onBackButtonPressed: () {},
  ),
  
  // 消息列表设置
  showMessageItemAvatar: true,  // 是否显示头像
  showMessageItemNickname: false, // 是否显示昵称
  itemBuilder: (context, model) => null, // 自定义消息项
  alertItemBuilder: (context, widget, model) => null, // 自定义提示项
  
  // 输入框设置
  inputBar: customInputBar, // 自定义输入框
  inputController: inputController, // 输入框控制器
  
  // 事件监听
  onItemTap: (message) {}, // 消息点击
  onAvatarTap: (userId) {}, // 头像点击
  onNicknameTap: (userId) {}, // 昵称点击
  onItemLongPressHandler: (message, menuItems) => menuItems, // 长按菜单
  
  // 背景和样式
  backgroundWidget: customBackground, // 自定义背景
  floatingWidget: floatingWidget, // 浮动组件
)
```

`MessagesView` 提供的主要参数如下表所示：

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `profile` | `ChatUIKitProfile` | 会话对象，包含会话 ID 和类型（必填）。 |
| `enableAppBar` | `bool` | 是否显示默认的标题栏（`ChatUIKitAppBar`）。<br/> - (默认) `true`：是。<br/> - `false`: 否。<br/> 详见 [设置标题栏](chatuikit_custom_titlebar.md)。 |
| `appBarModel` | `ChatUIKitAppBarModel?` | 设置标题栏的模型，包含标题、副标题等。<br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。 |
| `controller` | `MessagesViewController?` | 消息列表控制器，用于管理消息数据。如果不设置会自动创建。 |
| `showMessageItemAvatar` | `bool?` | 设置是否显示消息条目的头像。 |
| `showMessageItemNickname` | `bool?` | 设置是否显示消息条目的昵称。 |
| `itemBuilder` | `MessageItemBuilder?` | 设置自定义消息项构建器。 |
| `alertItemBuilder` | `AlertItemBuilder?` | 设置自定义提示项构建器。 |
| `inputBar` | `Widget?` | 设置自定义输入框。 |
| `inputController` | `ChatUIKitKeyboardPanelController?` | 设置输入框控制器。 |
| `onItemTap` | `MessageItemTapHandler?` | 设置消息项点击监听器。 |
| `onAvatarTap` | `MessageAvatarTapHandler?` | 设置头像点击监听器。 |
| `onNicknameTap` | `MessageNicknameTapHandler?` | 设置昵称点击监听器。 |
| `onItemLongPressHandler` | `MessageItemLongPressHandler?` | 设置消息项长按监听器。 |
| `backgroundWidget` | `Widget?` | 设置聊天界面背景。 |
| `emptyBackground` | `Widget?` | 设置消息列表空白页面。 |

## 设置消息列表背景

```dart
MessagesView(
  profile: profile,
  backgroundWidget: Container(
    decoration: BoxDecoration(
      image: DecorationImage(
        image: AssetImage('assets/chat_background.png'),
        fit: BoxFit.cover,
      ),
    ),
  ),
)
```

## 设置消息列表空页面

```dart
MessagesView(
  profile: profile,
  backgroundWidget: Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.chat_bubble_outline, size: 80),
        SizedBox(height: 16),
        Text('暂无消息'),
      ],
    ),
  ),
)
```

## 设置消息条目

对于消息条目，你可以进行自定义设置，例如：
- 设置头像和昵称及其样式
- 设置消息气泡
- 设置消息日期
- 设置长按消息菜单
- 设置消息事件监听
  
<div style="text-align: center">
  <img src=/images/uikit/chatuikit/android/message_item.png  width="1000" />
</div>

### 设置头像和昵称

你可以通过 `MessagesView` 的参数设置头像和昵称。

关于使用自己的头像和昵称，详见 [用户自定义信息文档中的介绍](chatuikit_userinfo.md#设置会话头像和昵称)。

```dart
MessagesView(
  profile: profile,
  showMessageItemAvatar: true,  // 是否显示头像：true：显示；(默认) true: 显示。
  showMessageItemNickname: false, // 是否显示昵称：true：显示；(默认) false: 隐藏。
)
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/bubble_hiddenable.png" title="显示头像" />
  <ImageItem src="/images/uikit/chatuikit/ios/bubble_hidden.png" title="隐藏头像" />
</ImageGallery>

### 设置消息气泡

消息气泡的样式支持以下两种方式进行设置：

1. **通过主题配置**：可在全局主题中统一定义消息气泡的样式属性，如背景色、边距、圆角等。
2. **通过自定义 `bubbleBuilder`**：可为特定消息类型或会话提供完全自定义的气泡布局与样式，实现更高灵活度的个性化设计。

以下为使用 `bubbleBuilder` 自定义气泡的示例：

```dart
MessagesView(
  profile: profile,
  bubbleBuilder: (context, message, isLeft) {
    // 自定义气泡样式
    return Container(
      decoration: BoxDecoration(
        color: isLeft ? Colors.grey[200] : Colors.blue,
        borderRadius: BorderRadius.circular(12),
      ),
      padding: EdgeInsets.all(12),
      child: Text(message.textContent ?? ''),
    );
  },
)
```

<div style="text-align: center">
  <img src=/images/uikit/chatuikit/android/message_bubble.png width="600" />
</div>

### 设置消息时间

你可以设置消息的发送和接收时间的显示格式和视觉样式。

<div style="text-align: center">
  <img src=/images/uikit/chatuikit/android/message_time.png />
</div>

#### 设置消息时间格式

`ChatUIKitTimeFormatter` 支持设置消息时间格式：

```dart
// 设置自定义时间格式化器
ChatUIKitTimeFormatter.instance.formatterHandler = (
  BuildContext context,
  ChatUIKitTimeType type,
  int timestamp,
) {
  // 自定义时间格式
  final date = DateTime.fromMillisecondsSinceEpoch(timestamp);
  if (type == ChatUIKitTimeType.message) {
    // 消息时间格式
    return '${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
  return null; // 返回 null 使用默认格式
};
```

#### 设置消息时间样式

消息时间的文字样式（如字体大小、颜色等）可通过主题配置进行统一设置：

```dart
// 在主题中设置消息时间样式
ChatUIKitTheme.instance.font.bodySmall.copyWith(
  fontSize: 12,
  color: Colors.grey[600],
);
```

## 设置长按消息菜单

在消息列表中长按任意消息，即可弹出操作菜单，支持复制、回复、转发、置顶、多选、翻译、创建话题等丰富功能。

UIKit 提供两种风格的消息长按菜单样式，你可以灵活选择实现：

- （默认）启用类似微信样式菜单：

```dart
ChatUIKitSettings.messageLongPressMenuStyle = 
    ChatUIKitMessageLongPressMenuStyle.popupMenu;
```

- 启用仿系统 `bottomSheet` 样式菜单：

```dart
ChatUIKitSettings.messageLongPressMenuStyle = 
    ChatUIKitMessageLongPressMenuStyle.bottomSheet;
```

关于菜单项的添加、删除、显示/隐藏以及样式的设置，详见 [消息列表的高级设置说明](chatuikit_custom_chat_advanced.md#设置长按消息菜单)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/message_types_2.png" title="类似微信样式" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_types_1.png" title="bottomSheet" />
</ImageGallery>

## 设置消息事件监听

通过 `MessagesView` 的参数可设置消息条目的各类交互事件监听，包括气泡区域及头像的点击与长按事件。

```dart
MessagesView(
  profile: profile,
  onItemTap: (message) {
    // 消息气泡点击事件
    print('Message tapped: ${message.msgId}');
    return false; // 返回 false 继续执行默认逻辑
  },
  onAvatarTap: (userId) {
    // 头像点击事件
    print('Avatar tapped: $userId');
  },
  onNicknameTap: (userId) {
    // 昵称点击事件
    print('Nickname tapped: $userId');
  },
  onItemLongPressHandler: (message, menuItems) {
    // 长按消息菜单处理
    // 可以修改、添加或删除菜单项
    return menuItems;
  },
)
```

## 设置消息发送回调

你可以通过 `MessagesViewController` 监听消息列表的变化。该控制器继承自 `ChangeNotifier`，你可以使用 `addListener` 方法监听其状态变化并作出响应。

```dart
final controller = MessagesViewController(profile: profile);

// 监听消息列表变化
controller.addListener(() {
  // 当消息列表更新时会触发此回调
  // 可以在这里更新 UI 或执行其他操作
  setState(() {
    // 更新 UI
  });
});

// 发送消息
controller.sendMessage(message);

// 注意：在 Widget dispose 时需要移除监听
@override
void dispose() {
  controller.removeListener(() {
    // 移除监听
  });
  controller.dispose();
  super.dispose();
}
```
