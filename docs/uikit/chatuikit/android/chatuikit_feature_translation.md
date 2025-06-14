# 消息翻译

消息翻译是指用户可以将一条消息翻译成其他语言。消息翻译可以帮助使用不同语言的用户进行沟通。

目前，单群聊 UIKit 支持翻译文本消息。消息翻译的 UI 和逻辑部分结构如下：

- 消息翻译的 UI 布局为 `ChatUIKitMessageTranslationView` 自定义布局。

- 消息气泡中添加 view 以及显示和隐藏翻译布局的逻辑在 `ChatUIKitAddExtendFunctionViewController` 中的 `addTranslationViewToMessage` 方法。

- 长按消息气泡弹出的显示和隐藏翻译菜单的逻辑在 `ChatUIKitMessageTranslationController` 中。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_translate_android.png" title="消息翻译" />
</ImageGallery>

## 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已申请试用该功能。

1. 开启消息翻译特性。

消息翻译特性在 `ChatUIKitConfig` 中默认关闭，即 `enableTranslationMessage` 的默认值为 `false`。要开启该特性，需将该参数设置为 `true`。示例代码如下：

```kotlin

   ChatUIKitClient.getConfig()?.chatConfig?.enableTranslationMessage

```

2. 设置翻译的目标语言。

单群聊 UiKit 的 `UIKitChatFragment.Builder` 对象中提供了 `setTargetTranslation` 方法设置目标翻译语言。

如果未设置翻译的目标语言，则默认使用中文。

更多翻译目标语言，请参考 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

```kotlin

   val builder = UIKitChatFragment.Builder
   builder.setTargetTranslation(ChatUIKitTranslationLanguageType.English)

```