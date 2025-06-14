# 消息翻译

消息翻译是指用户可以将一条消息翻译成其他语言。消息翻译可以帮助使用不同语言的用户进行沟通。

该功能在 UIKit 里的 `TextMessage` 组件中。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/message_translate_web.png" title="消息翻译" />
</ImageGallery>

## 如何使用

1. 使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已申请试用该功能。

消息翻译特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.translate = false;
```

2. 设置翻译的目标语言。

初始化 UIKit 的配置 `initConfig.translationTargetLanguage` 设置为翻译的目标语言。

如果未设置翻译的目标语言，则默认使用中文。

更多翻译目标语言，请参考 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。
