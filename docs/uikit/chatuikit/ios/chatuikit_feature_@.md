# 群组 @ 提及

群组 @ 提及功能使用户能在群聊中通过 @ 符号直接提及特定成员，被提及者将收到特别通知。该功能便于高效传递重要信息，确保关键消息得到及时关注和回应。

群组@提及功能的 UI 和逻辑结构如下：

首先在 `MessageListController` 的 `MessageListView` 中的 `MessageInputBar`中输入 `@` 字符后会告知 `ViewModel` 以及 `Controller` 用户输入了 `@` 字符，选择 @ 的用户后，输入框中会显示被 @ 的用户的名字或者昵称。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/ios/group_@.png" title="群组 @ 提及" />
</ImageGallery>

## 如何使用

群组 @ 提及特性默认开启。要关闭该特性，则不需理会 `MessageListController#onInputBoxEventsOccur` 方法，即重载此方法后不需要处理 mention 事件即可。

示例代码如下：

```swift
    public func onInputBoxEventsOccur(action type: MessageInputBarActionType, attributeText: NSAttributedString?) {
        switch type {
        case .audio: self.audioDialog()
        case .mention:  self.mentionAction()
        case .attachment: self.attachmentDialog()
        default:
            break
        }
  }
```