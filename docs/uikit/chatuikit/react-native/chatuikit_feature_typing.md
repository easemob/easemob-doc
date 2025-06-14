# 输入状态指示

输入状态指示功能指在单聊会话中实时显示会话的一方正在输入的状态，增强通讯互动的实时性。此功能有助于用户了解对方是否正在回复，从而优化沟通体验，提升对话流畅度。

在单聊页面中，当前用户持续输入文本字符，该行为会通过服务器将该状态传输给对方，对方收到输入状态，将状态显示在 UI 上。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/typing_indicator_enable_ios.png" title="开启输入状态提示" />
  <ImageItem src="/images/uikit/chatuikit/feature/message/typing_indicator_disable_ios.png" title="关闭输入状态提示" />
</ImageGallery>

## 如何使用

输入状态指示特性默认开启，默认值为 `true`。要关闭该特性，需将 `ContainerProps.enableTyping` 参数设置为 `false`。

示例代码如下：

```tsx
export function App() {
  // 设置是否启用正在输入状态
  const enableTypingRef = React.useRef(false);

  return (
    <UIKitContainer enableTyping={enableTypingRef.current}>
      {/* your custom component */}
      <ToastView />
    </UIKitContainer>
  );
}
```

## 自定义输入状态指示 UI

本功能使用 SDK 的透传消息实现，详见 [SDK 相关文档](/document/product/typing_indication.html)。

如果需要自定义正在输入组件样式，需要自定义聊天页面组件的导航栏组件，可以参考 `ConversationDetailNavigationBar` 组件。