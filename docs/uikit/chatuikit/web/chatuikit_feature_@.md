# 群组 @ 提及

群组 @ 提及功能使用户能在群聊中通过 @ 符号直接提及特定成员，被提及者将收到特别通知。该功能便于高效传递重要信息，确保关键消息得到及时关注和回应。

该功能在 UIKit 里的 `MessageInput`、`TextMessage` 和 `ConversationItem` 组件中。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/common/group_@.png" title="消息审核" />
</ImageGallery>

## 如何使用

群组 @ 提及特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.messageInput.mention = false;
```