# 消息转发

消息转发指用户可以将消息转发给其他用户。你可以转发单条消息，也可以选择多条消息进行合并转发。

## 消息合并转发

消息转发指用户可以将消息转发给其他用户。你可以转发单条消息，也可以选择多条消息进行合并转发。

消息合并转发 UI 和逻辑部分结构如下：

- 选择转发消息接收人页面 `ForwardMessageSelectView`。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_forward_ios.png" title="消息合并转发" />
</ImageGallery>

#### 如何使用

消息转发特性在 `ChatUIKitSettings.enableMessageMultiSelect` 中提供开关，默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```dart
ChatUIKitSettings.enableMessageMultiSelect = true;
```

## 单条消息转发

单条消息转发是指将收到或者发送成功的单条消息转发给其他用户。

单条消息转发 UI 和逻辑部分结构如下：

- 选择转发消息接收人页面 `ForwardMessageSelectView`。

#### 如何使用

该功能默认开启，即 `ChatUIKitSettings.enableMessageForward` 的默认值为 `true`。如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageForward = false;
```