# 消息话题

消息话题（即 `Thread`）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。

单群聊 UIKit 中实现了 Thread，可在 `Appearance.swift` 中开启或关闭。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_thread_ios.png" title="消息话题" />
</ImageGallery>

## 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

Thread 特性在 `Appearance.swift` 中默认关闭，即` Appearance.chat.contentStyle` 数组中默认不包含 `.withMessageThread`。

要开启该特性，需在该数组中添加 `.withMessageThread`。**注意不要重复添加**。

```swift
Appearance.chat.contentStyle.append(.withMessageThread)

```