# 表情回复

表情回复（即 `Reaction`）指用户可以使用表情符号回复消息。表情回复可以帮助用户表达情绪、态度、进行调查或投票。在单群聊 UIKit 中，用户可以长按单条消息触发消息拓展功能菜单，选择表情回复。

目前，单群聊 UIKit 支持对消息添加表情回复。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/message_reactions_web.png" title="表情回复" />
</ImageGallery>

## 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

表情回复特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.reaction = false;
```