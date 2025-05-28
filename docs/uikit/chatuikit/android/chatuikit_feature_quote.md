# 消息引用	

消息引用指用户可以引用一条已发送的消息。消息引用可以帮助用户回复特定的消息，或强调特定的信息。

目前，单群聊 UIKit 支持引用消息进行回复。消息引用 UI 和逻辑结构如下：
- `ChatUIKitMessageReplyView`：消息气泡的引用消息自定义 View。
- `ChatUIKitExtendMessageReplyView`：底部输入框组件上方展示的引用消息自定义 View。
- `ChatUIKitMessageReplyController`：控制引用功能的显示、隐藏、跳转等逻辑。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_reply_android.png" title="消息引用" />
</ImageGallery>

## 如何使用

消息引用特性在 `ChatUIKitConfig` 中默认开启，即 `enableReplyMessage` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```kotlin

	 ChatUIKitClient.getConfig()?.chatConfig?.enableReplyMessage

```