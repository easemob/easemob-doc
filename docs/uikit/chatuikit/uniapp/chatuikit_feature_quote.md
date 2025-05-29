# 消息引用	

消息引用指用户可以引用一条已发送的消息。消息引用可以帮助用户回复特定的消息，或强调特定的信息。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/message_reply.png" title="消息引用" />
</ImageGallery>

#### 如何使用

消息引用特性在 `ChatUIKit` 中默认开启。要关闭该特性，则可以调用 `ChatUIKit.hideFeature`方法隐藏。

示例代码如下：

```javascript
    ChatUIKit.hideFeature(['replyMessage'])
```