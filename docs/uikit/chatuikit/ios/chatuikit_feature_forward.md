# 消息合并转发

消息转发指用户可以将消息转发给其他用户。你可以转发单条消息，也可以选择多条消息进行合并转发。

消息转发 UI 和逻辑部分结构如下：

- `MessageMultiSelectedBottomBar.swift`：底部菜单 View。
- `MessageListController.swift`：处理 UI 布局变更以及转发和删除的逻辑。
- `MessageListController.swift`：消息选择帮助类用于记录选中的消息信息并提供获取方法。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_forward_ios.png" title="消息合并转发" />
</ImageGallery>