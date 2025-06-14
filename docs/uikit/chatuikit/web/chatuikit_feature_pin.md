# 消息置顶

消息置顶指用户将重要信息固定在会话顶部，有助于用户快速访问关键会话，避免遗漏重要内容。该特性尤其适用于处理紧急事务或持续跟进的项目，帮助高效管理重要会话。

目前，单群聊 UIKit 支持消息置顶。该功能在 UIKit 的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等，置顶消息列表功能在 `PinnedMessage` 组件中。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/message_pin_web.png" title="消息置顶" />
</ImageGallery>

### 如何使用

消息置顶特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.header.pinMessage = false;
features.chat.message.pin = false;
```