# 消息引用

消息引用指用户可以引用一条已发送的消息。消息引用可以帮助用户回复或强调特定的信息。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_reply_ios.png" title="消息引用" />
</ImageGallery>

目前，单群聊 UIKit 支持引用消息进行回复。消息引用 UI 和逻辑结构如下：

- `MessageQuoteBubble`：消息气泡的引用消息自定义 View。

#### 如何使用

消息引用特性默认开启，即 `ContainerProps.enableMessageQuote` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。