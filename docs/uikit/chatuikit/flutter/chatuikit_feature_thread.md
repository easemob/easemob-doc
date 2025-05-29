# 消息话题

消息话题（即 `Thread`）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_thread_ios.png" title="消息话题" />
</ImageGallery>

#### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

消息话题特性在 `ChatUIKitSettings.enableChatThreadMessage` 中提供开关，默认值为 `false`。要开启该特性，需将该参数设置为 `true`。

示例代码如下：

```dart
ChatUIKitSettings.enableMessageThread = true;
```
