# 消息引用	

消息引用是指用户可以引用一条已发送的消息。消息引用可以帮助用户回复特定的消息，或强调特定的信息。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_reply_ios.png" title="消息引用" />
</ImageGallery>

消息引用特性默认开启，若不需要可将其隐藏，示例代码如下：

```swift
Appearance.chat.contentStyle: [MessageContentDisplayStyle] = [.withReply,.withAvatar,.withNickName,.withDateAndTime,.withMessageThread,.withMessageReaction]

        if hiddenTopic {
            Appearance.chat.contentStyle.removeAll { $0 == .withReply }
        }
```