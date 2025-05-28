# 输入状态指示

输入状态指示功能指在单聊会话中实时显示会话的一方正在输入的状态，增强通讯互动的实时性。此功能有助于用户了解对方是否正在回复，从而优化沟通体验，提升对话流畅度。

该功能在 UIKit 里的 `Typing` 组件中。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/typing_indicator_web.png" title="输入状态指示" />
</ImageGallery>

## 如何使用

输入状态指示特性默认开启。若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.messageInput.typing = false;
```

## 自定义

本功能使用 SDK 的透传消息实现，详见 [SDK 相关文档](/document/product/typing_indication.html)。