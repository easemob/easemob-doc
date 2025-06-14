# 输入状态指示

输入状态指示功能指在单聊会话中实时显示会话的一方正在输入的状态，增强通讯互动的实时性。此功能有助于用户了解对方是否正在回复，从而优化沟通体验，提升对话流畅度。

输入状态指示的 UI 和逻辑结构如下：
- `ChatUIKitTitleBar` 中的 `subtitle` 控件显示用户的状态以及输入状态指示，收到输入状态后会先显示输入状态，用户取消输入状态后显示用户的状态，输入状态消失。
- 输入状态相关回调和方法：
  - 输入状态投递为透传消息，接收到透传消息后，通过 `UIKitChatFragment.Builder` 提供的 `setOnPeerTypingListener` 监听对方输入状态。
  - 输入状态回调为 `onPeerTyping(action: String?)`，其中 `action` 代表状态 `ChatUIKitLayout.ACTION_TYPING_BEGI` ｜ `ChatUIKitLayout.ACTION_TYPING_END`。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/typing_indicator_enable_android.png" title="开启输入状态提示" />
  <ImageItem src="/images/uikit/chatuikit/feature/message/typing_indicator_disable_android.png" title="关闭输入状态提示" />
</ImageGallery>

## 如何使用

输入状态指示特性在 `ChatUIKitClient.getConfig()?.chatConfig?.enableChatTyping` 中默认开启，即 `enableChatTyping` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

同时也支持通过代码进行设置，`UIKitChatFragment.Builder` 提供开启或关闭的 API `builder.turnOnTypingMonitor(true|false)`。通过代码设置优先级更高。

示例代码如下：

```kotlin
    
    ChatUIKitClient.getConfig()?.chatConfig?.enableChatTyping = true

```

## 自定义输入状态指示 UI

本功能使用 SDK 的透传消息实现，详见 [SDK 相关文档](/document/product/typing_indication.html)。

用户需要监听透传消息回调处理导航相关 UI 显示效果。