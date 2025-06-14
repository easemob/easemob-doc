# 消息置顶	

消息置顶指用户将重要信息固定在会话顶部，有助于用户快速访问关键会话，避免遗漏重要内容。该特性尤其适用于处理紧急事务或持续跟进的项目，帮助高效管理重要会话。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_pin_ios.png" title="消息置顶" />
</ImageGallery>

## 如何使用

消息置顶功能默认开启，即 `ChatUIKitSettings.enablePinMsg` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```dart
ChatUIKitSettings.enablePinMsg = false;
```