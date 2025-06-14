# 消息置顶	

消息置顶指用户将重要信息做标记方便查看，有助于用户快速找到关键信息，避免遗漏重要内容。该特性尤其适用于处理紧急事务或持续跟进的项目，帮助高效管理重要通告。注意：这里需要先去环信开发者控制台开启此功能。

目前，单群聊 UIKit 支持消息置顶。消息置顶 UI 和逻辑结构如下：
- `Appearance.chat.enablePinMessage`：控制消息置顶功能显示与隐藏。
- `Appearance.chat.messageLongPressedActions`：包含消息长按菜单所有功能项，如果不需要置顶可删除对应项，默认带着置顶功能，但是在未开启上述开关的情况下会过滤此项。
- `MessageListController#showPinnedMessages`：显示置顶消息列表。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_pin_ios.png" title="消息置顶" />
</ImageGallery>

## 如何使用

消息置顶特性在 `Appearance.chat` 中默认开启，即 `enablePinMessage` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```swift
Appearance.chat.enablePinMessage = false
Appearance.chat.messageLongPressedActions.removeAll { $0.tag == "Pin" }
```