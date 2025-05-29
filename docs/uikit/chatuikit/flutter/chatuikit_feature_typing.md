# 输入状态指示

输入状态指示功能指在单聊会话中实时显示会话的一方正在输入的状态，增强通讯互动的实时性。此功能有助于用户了解对方是否正在回复，从而优化沟通体验，提升对话流畅度。

本功能使用 SDK 的透传消息实现，详见 [SDK 相关文档](/document/product/typing_indication.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/typing_indicator_enable_ios.png" title="开启输入状态提示" />
  <ImageItem src="/images/uikit/chatuikit/feature/message/typing_indicator_disable_ios.png" title="关闭输入状态提示" />
</ImageGallery>

#### 如何使用

输入状态指示特性在 `ChatUIKitSettings.enableTypingIndicator` 中默认开启，即默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```
ChatUIKitSettings.enableTypingIndicator = false;
```