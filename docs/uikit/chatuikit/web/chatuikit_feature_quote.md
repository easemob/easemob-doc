# 消息引用

消息引用指用户可以引用一条已发送的消息。消息引用可以帮助用户回复特定的消息，或强调特定的信息。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/message_reply_web.png" title="消息引用" />
</ImageGallery>

## 如何使用

消息编辑特性默认开启，若要在全局配置中关闭可以进行如下设置：

```jsx
features.chat.message.reply = false;
```