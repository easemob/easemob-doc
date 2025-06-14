# 消息特性

<Toc />

本文介绍消息相关特性，包括消息删除、撤回、编辑、引用、翻译、表情回复、话题和转发。你可以决定是否开启或关闭这些特性。

## 消息复制

消息复制是指用户可以将一条消息复制到剪贴板。消息复制可以帮助用户将消息保存到其他地方，或将其粘贴到其他应用程序中。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/message_copy_web.png" title="消息复制" />
</ImageGallery>

## 消息删除

消息删除是指用户可以删除一条消息。消息删除可以帮助用户删除错误发送的消息，或删除不想保留的消息。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/message_delete_web.png" title="消息删除" />
</ImageGallery>

#### 如何使用

消息删除特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.delete = false;
```

## 消息撤回

消息撤回是指用户可以撤回一条已发送的消息。消息撤回可以帮助用户撤回错误发送的消息，或撤回不想让其他用户看到的消息。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage` 和 `FileMessage` 等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/message_recall_web.png" title="消息撤回" />
</ImageGallery>

#### 如何使用

消息撤回特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.recall = false;
```

## 消息编辑

消息编辑是指用户可以编辑一条已发送的消息。消息编辑可以帮助用户纠正错误，或添加新信息。无论单聊还是群组聊天，该特性只支持用户编辑自己发送的消息，不能编辑其他用户发送的消息。

该功能在 UIKit 里的 `TextMessage` 组件中。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/message_edit_web.png" title="消息编辑" />
</ImageGallery>

#### 如何使用

消息编辑特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.edit = false;
```

## 其他消息特性

对于消息回执、消息引用、翻译、表情回复、话题、转发和置顶，你可以查看以下文档：

- [消息回执](chatuikit_feature_receipt.html)
- [消息引用](chatuikit_feature_quote.html)
- [消息翻译](chatuikit_feature_translation.html)
- [表情回复](chatuikit_feature_reaction.html)
- [消息话题](chatuikit_feature_thread.html)
- [消息转发](chatuikit_feature_forward.html)
- [消息置顶](chatuikit_feature_pin.html)



