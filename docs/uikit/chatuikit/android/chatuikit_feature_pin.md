# 消息置顶	

消息置顶指用户将重要信息固定在会话顶部，有助于用户快速访问关键会话，避免遗漏重要内容。该特性尤其适用于处理紧急事务或持续跟进的项目，帮助高效管理重要会话。

目前，单群聊 UIKit 支持消息置顶。消息置顶 UI 和逻辑结构如下：
- `ChatUIKitPinMessageListViewGroup`：消息置顶区域自定义 View。
- `ChatUIKitPinMessageController`：控制消息置顶的显示、隐藏、跳转等逻辑。
- `ChatUIKitPinMessageListAdapter`：消息置顶列表适配器。
- `ChatUIKitPinDefaultViewHolder`：置顶消息默认类型展示样式。
- `ChatUIKitPinTextMessageViewHolder`：置顶消息文本类型展示样式。
- `ChatUIKitPinImageMessageViewHolder`：置顶消息图片类型展示样式。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_pin_android.png" title="消息置顶" />
</ImageGallery>

## 如何使用

消息置顶特性在 `ChatUIKitConfig` 中默认开启，即 `enableChatPingMessage` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```kotlin

     ChatUIKitClient.getConfig()?.chatConfig?.enableChatPingMessage 

     // 先定义 pin 消息的控制器
     val chatPinMessageController:ChatUIKitPinMessageController by lazy {
        ChatUIKitPinMessageController(mContext,this@ChatUIKitLayout, conversationId, viewModel)
     }
     // 初始化 Controller 其中包含 pin 列表条目内置点击事件监听回调 （原始消息存在时）列表默认滚动到原始消息位置
     chatPinMessageController.initPinInfoView()
     // 展示pin消息列表 
     // 首先从服务端获取 pin 消息数据
     chatPinMessageController.fetchPinnedMessagesFromServer()
     // 获取成功后 调用setData 方法给控制器设置数据源 value: MutableList<ChatMessage>?
     override fun onFetchPinMessageFromServerSuccess(value: MutableList<ChatMessage>?) {
        if (value.isNullOrEmpty()){
            chatPinMessageController.hidePinInfoView()
        }else{
            chatPinMessageController.setData(value)
        }
     }
     // 主动操作 pin消息  isPinned：true 置顶消息 false 取消置顶
     chatPinMessageController.pinMessage(message,true)

     // 更新 pin 消息
     // 需要添加消息监听回调
     private val chatMessageListener = object : ChatUIKitMessageListener() {
         // pin 消息变更回调
         override fun onMessagePinChanged(
            messageId: String?,
            conversationId: String?,
            pinOperation: ChatMessagePinOperation?,
            pinInfo: ChatMessagePinInfo?
        ) {
            // 根据messageId获取本地消息对象 如果本地没有 需要从服务端获取
            val message = ChatClient.getInstance().chatManager().getMessage(messageId)
            message?.let{
                // 更新 pin 消息列表  pinInfo?.operatorId() 操作pin消息的id
                chatPinMessageController.updatePinMessage(it,pinInfo?.operatorId())
            }?:kotlin.run{
                chatPinMessageController.fetchPinnedMessagesFromServer()
            }
        }
     }

     ChatUIKitClient.addChatMessageListener(chatMessageListener)

     // 显示 pin view
     chatPinMessageController.showPinInfoView()
     // 隐藏 pin view
     chatPinMessageController.hidePinInfoView()

```
