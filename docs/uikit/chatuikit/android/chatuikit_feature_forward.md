# 消息合并转发

消息转发指用户可以将消息转发给其他用户。你可以转发单条消息，也可以选择多条消息进行合并转发。

消息转发 UI 和逻辑部分结构如下：

- `Forward ChatUIKitMultipleSelectMenuView`：底部菜单 View。
- `Forward ChatUIKitMessageMultipleSelectController`：处理 UI 布局变更(隐藏/显示 `ChatUIKitLayout` 中的 `ChatUIKitInputMenu` 输入菜单)以及转发和删除的逻辑。
- `Forward ChatUIKitMessageMultiSelectHelper`：消息选择帮助类用于记录选中的消息信息并提供获取方法。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_forward_android.png" title="消息合并转发" />
</ImageGallery>

## 如何使用

消息转发特性在 `ChatUIKitConfig` 中默认开启，即 `enableSendCombineMessage` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```kotlin

	 ChatUIKitClient.getConfig()?.chatConfig?.enableSendCombineMessage

```