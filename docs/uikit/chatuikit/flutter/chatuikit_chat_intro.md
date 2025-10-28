# 聊天页面

## 概述

聊天消息 `MessagesView` 是 `ChatUIKit` 提供的主要组件, 用于展示用户之间的消息。

`MessagesView` 可以直接使用，也可以通过[路由](chatuikit_advancedusage.html#路由的使用)使用。

目前消息页面中提供以下功能：

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件、名片和合并类型的消息。
- 对消息进行复制、表情回复、引用、撤回、删除、置顶、编辑、重新发送和审核。
- 清除本地消息。

消息相关功能，详见[功能介绍文档](chatfeature_message.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/flutter/custom_chat.png" title="聊天页面" />
</ImageGallery>

## 创建消息页面

添加聊天页面时，可以直接添加到你需要展示的位置并传入 `ChatUIKitProfile` 信息。`ChatUIKitProfile` 为用户信息包装类，详见[用户信息展示](chatuikit_userinfo.html)。

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