# 消息翻译

消息翻译是指用户可以将一条消息翻译成其他语言。消息翻译可以帮助使用不同语言的用户进行沟通。

目前，单群聊 UIKit 支持翻译文本消息。消息翻译的 UI 和逻辑部分在 `Appearance.swift` 中。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_translate_ios.png" title="消息翻译" />
</ImageGallery>

## 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已申请试用该功能。

1. 开启消息翻译特性。

消息翻译特性在 `Appearance.swift` 中默认关闭，即 `Appearance.chat.enableTranslation` 的默认值为 `false`。要开启该特性，需将该参数设置为 `true`。

2. 设置翻译的目标语言。

单群聊 UiKit 的 `Appearance.swift` 中提供了 `Appearance.chat.targetLanguage` 设置目标翻译语言。

如果未设置翻译的目标语言，则默认使用中文。

更多翻译目标语言，请参考 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

示例代码如下：

```swift
Appearance.chat.enableTranslation = true
Appearance.chat.targetLanguage = .English
```