# 消息合并转发

消息转发指用户可以将消息转发给其他用户。你可以转发单条消息，也可以选择多条消息进行合并转发。

消息转发 UI 和逻辑部分结构如下：

- 选择转发消息接收人页面 `MessageForwardSelector`。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_forward_ios.png" title="消息合并转发" />
</ImageGallery>

#### 如何使用

消息转发特性在 `ContainerProps.enableMessageMultiSelect` 中提供开关，默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。
