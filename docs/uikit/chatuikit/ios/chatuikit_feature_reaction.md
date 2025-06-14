# 表情回复

表情回复（即 Reaction）指用户可以使用表情符号回复消息。表情回复可以帮助用户表达情绪、态度、进行调查或投票。在单群聊 UIKit 中，用户可以长按单条消息触发消息拓展功能菜单，选择表情回复。

目前，单群聊 UIKit 支持 Reaction，可在 `Appearance.swift` 中开启或关闭。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_reactions_ios.png" title="表情回复" />
</ImageGallery>

## 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

消息表情回复特性在 `Appearance.swift` 中默认关闭，即 `Appearance.chat.contentStyle` 数组中默认不包含 `.withMessageReaction`。

要开启该特性，需在该数组中添加 `.withMessageReaction`。**注意不要重复添加**。

示例代码如下：

```swift
Appearance.chat.contentStyle.append(.withMessageReaction)

```