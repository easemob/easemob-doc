# 自定义聊天页面

<Toc />

如果默认的聊天页面不能满足需求，你可以通过修改源码 `ChatUIKit/modules/Chat` 进行自定义开发。

## 设置消息气泡样式

以修改发送的消息气泡背景为例，修改源码 `ChatUIKit/modules/Chat/index/components/Message/messageItem.vue` 文件中的样式：

```scss
.msg-bubble-self-bg {
  padding: 8px;
  background: #60cf73;
  color: #fff;
}

.msg-bubble-self-bg:before {
  content: "";
  position: absolute;
  right: -9px;
  bottom: 10px;
  border: 5px solid transparent;
  border-left: 5px solid #60cf73;
}
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/msg_item_bubble_bg.jpg" title="发送方消息气泡设置为绿色" />
</ImageGallery>

## 隐藏聊天页面功能

如果你不需要 UIKit 的某些功能，可以在 UIKit 初始化后，调用 `ChatUIKit.hideFeature` 方法隐藏。

你可以在 `ChatUIKit/configType.ts` 文件查看所有可隐藏的功能，或参考 [可隐藏的功能列表](/uikit/chatuikit/uniapp/chatuikit_advantage.html#可隐藏的功能列表)。

### 隐藏消息操作功能

例如，隐藏消息引用功能：

```js
ChatUIKit.hideFeature(['replyMessage'])
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/msg_item_feature_hide.jpg" title="隐藏消息引用功能" />
</ImageGallery>

### 隐藏输入栏功能

你可以配置消息输入框的功能，包括是否显示发送语音按钮、是否显示表情功能等。例如，隐藏发送图片和表情功能：

```js
ChatUIKit.hideFeature(['inputEmoji', 'inputImage'])
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/input_feature_hide.jpg" title="隐藏发送图片和表情功能" />
</ImageGallery>
