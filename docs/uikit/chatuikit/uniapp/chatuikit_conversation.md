# 自定义会话列表页面

<Toc />

如果默认的会话列表页面不能满足需求，你可以通过修改源码 `ChatUIKit/modules/Conversation` 进行自定义开发。

## 自定义会话列表样式

你可以自定义会话列表的背景颜色、大小、间距等样式。

修改 `ChatUIKit/modules/Conversation/components/ConversationItem/style.scss` 文件来定义样式：

```scss
.conversation-item-wrap {
  display: flex;
  padding: 0 15px;
  align-items: center;
  background: #abcdef;
}
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/cvs_item_bg.jpg" title="自定义会话列表页面示例" />
</ImageGallery>

## 隐藏会话列表功能

如果你不需要 UIKit 的某些功能，可以在 UIKit 初始化后，调用 `ChatUIKit.hideFeature` 方法隐藏。例如，隐藏置顶会话功能：

```js
ChatUIKit.hideFeature(['pinConversation'])
```

你可以在 `ChatUIKit/configType.ts` 文件查看所有可隐藏的功能，或参考 [可隐藏的功能列表](/uikit/chatuikit/uniapp/chatuikit_advantage.html#可隐藏的功能列表)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/cvs_feature_hide.jpg" title="隐藏置顶会话功能" />
</ImageGallery>
