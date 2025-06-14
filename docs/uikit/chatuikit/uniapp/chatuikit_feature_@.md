# 群组 @ 提及 

群组 @ 提及功能使用户能在群聊中通过 @ 符号直接提及特定成员，被提及者将收到特别通知。该功能便于高效传递重要信息，确保关键消息得到及时关注和回应。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/group_@.png" title="群组 @ 提及" />
</ImageGallery>

#### 如何使用

群组 @ 提及特性默认开启。要关闭该特性，则可以调用 `ChatUIKit.hideFeature`方法隐藏。

示例代码如下：

```javascript
    ChatUIKit.hideFeature(['inputMention'])
```