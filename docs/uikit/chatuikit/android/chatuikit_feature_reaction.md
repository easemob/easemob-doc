# 表情回复

表情回复（即 `Reaction`）指用户可以使用表情符号回复消息。表情回复可以帮助用户表达情绪、态度、进行调查或投票。在单群聊 UIKit 中，用户可以长按单条消息触发消息拓展功能菜单，选择表情回复。

目前，单群聊 UIKit 支持对消息添加表情回复。Reaction UI 和逻辑部分结构如下：

- Reaction 在消息列表中的 UI 布局实现 `ChatUIKitMessageReactionView` 自定义布局。

- Reaction 在消息长按菜单中的 UI 布局实现 `ChatUIKitMessageMenuReactionView` 自定义 `RecyclerView`。

- Reaction 表情列表的弹窗 `ChatUIKitReactionsDialog` 继承于` ChatUIKitBaseSheetFragmentDialog`。

- Reaction 成员列表 `ChatUIKitReactionUserListFragment`。

- 消息气泡中添加 view 以及显示和隐藏 Reaction 布局的逻辑在 `ChatUIKitAddExtendFunctionViewController` 中的 `addReactionViewToMessage`方法。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_reactions_android.png" title="表情回复" />
</ImageGallery>

## 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

消息表情回复特性在 `ChatUIKitConfig` 中默认关闭，即 `enableMessageReaction` 的默认值为 `false`。要开启该特性，将该参数设置为 `true`。示例代码如下：

```kotlin

    ChatUIKitClient.getConfig()?.chatConfig?.enableMessageReaction

```