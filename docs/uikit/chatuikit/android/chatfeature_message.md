# 消息特性

<Toc />

本文介绍消息相关特性，包括消息复制、删除、撤回、编辑、引用、翻译、表情回复、话题和转发。

对于消息引用、翻译、表情回复、话题和转发，你可以决定是否开启或关闭该特性。

## 消息复制

消息复制是指用户可以将一条消息复制到剪贴板。消息复制可以帮助用户将消息保存到其他地方，或将其粘贴到其他应用程序中。

![img](/images/uikit/chatuikit/feature/message/message_copy.png =600x600) 

## 消息删除	

消息删除是指用户可以删除一条消息。消息删除可以帮助用户删除错误发送的消息，或删除不想保留的消息。

![img](/images/uikit/chatuikit/feature/message/message_delete.png) 

## 消息撤回

消息撤回是指用户可以撤回一条已发送的消息。消息撤回可以帮助用户撤回错误发送的消息，或撤回不想让其他用户看到的消息。

![img](/images/uikit/chatuikit/feature/message/message_recall.png) 

## 消息编辑

消息编辑是指用户可以编辑一条已发送的消息。消息编辑可以帮助用户纠正错误，或添加新信息。

![img](/images/uikit/chatuikit/feature/message/message_edit.png) 

## 消息引用	

消息引用指用户可以引用一条已发送的消息。消息引用可以帮助用户回复特定的消息，或强调特定的信息。

目前，单群聊 UIKit 支持引用消息进行回复。消息引用 UI 和逻辑结构如下：
- `EaseChatMessageReplyView`：消息气泡的引用消息自定义 View。
- `EaseChatExtendMessageReplyView`：底部输入框组件上方展示的引用消息自定义 View。
- `EaseChatMessageReplyController`：控制引用功能的显示、隐藏、跳转等逻辑。

![img](/images/uikit/chatuikit/feature/message/message_reply.png) 

#### 如何使用

消息转发特性在 `EaseChatConfig` 中默认开启，即 `enableReplyMessage` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```kotlin

	 EaseIM.getConfig()?.chatConfig?.enableReplyMessage

```

## 消息翻译

消息翻译是指用户可以将一条消息翻译成其他语言。消息翻译可以帮助使用不同语言的用户进行沟通。

目前，单群聊 UIKit 支持翻译文本消息。消息翻译的 UI 和逻辑部分结构如下：

- 消息翻译的 UI 布局为 `EaseChatMessageTranslationView` 自定义布局。

- 消息气泡中添加 view 以及显示和隐藏翻译布局的逻辑在 `EaseChatAddExtendFunctionViewController` 中的 `addTranslationViewToMessage` 方法。

- 长按消息气泡弹出的显示和隐藏翻译菜单的逻辑在 `EaseChatMessageTranslationController` 中。

![img](/images/uikit/chatuikit/feature/message/message_translate.png) 

#### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已申请试用该功能。

1. 开启消息翻译特性。

消息翻译特性在 `EaseChatConfig` 中默认关闭，即 `enableTranslationMessage` 的默认值为 `false`。要开启该特性，需将该参数设置为 `true`。示例代码如下：

```kotlin

   EaseIM.getConfig()?.chatConfig?.enableTranslationMessage

```

2. 设置翻译的目标语言。

单群聊 UiKit 的 `EaseChatFragment.Builder` 对象中提供了 `setTargetTranslation` 方法设置目标翻译语言。

如果未设置翻译的目标语言，则默认使用中文。

更多翻译目标语言，请参考 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

```kotlin

   val builder = EaseChatFragment.Builder
   builder.setTargetTranslation(EaseTranslationLanguageType.English)

```

## 表情回复

表情回复（即 `Reaction`）指用户可以使用表情符号回复消息。表情回复可以帮助用户表达情绪、态度、进行调查或投票。在单群聊 UIKit 中，用户可以长按单条消息触发消息拓展功能菜单，选择表情回复。

目前，单群聊 UIKit 支持对消息添加表情回复。Reaction UI 和逻辑部分结构如下：

- Reaction 在消息列表中的 UI 布局实现 `EaseChatMessageReactionView` 自定义布局。

- Reaction 在消息长按菜单中的 UI 布局实现 `EaseMessageMenuReactionView` 自定义 `RecyclerView`。

- Reaction 表情列表的弹窗 `EaseChatReactionsDialog` 继承于` EaseBaseSheetFragmentDialog`。

- Reaction 成员列表 `EaseReactionUserListFragment`。

- 消息气泡中添加 view 以及显示和隐藏 Reaction 布局的逻辑在 `EaseChatAddExtendFunctionViewController` 中的 `addReactionViewToMessage`方法。

![img](/images/uikit/chatuikit/feature/message/message_reactions.png) 

#### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

消息表情回复特性在 `EaseChatConfig` 中默认关闭，即 `enableMessageReaction` 的默认值为 `false`。要开启该特性，将该参数设置为 `true`。示例代码如下：

```kotlin

    EaseIM.getConfig()?.chatConfig?.enableMessageReaction

```

## 消息话题

消息话题（即 `Thread`）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。

单群聊 UIKit 中实现了 Thread 页面 `EaseChatThreadActivity`，开发者只需要调用 `EaseChatThreadActivity.actionStart` 启动该页面传入需要的参数即可。

![img](/images/uikit/chatuikit/feature/message/message_thread.png) 

#### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

消息话题特性在 `EaseChatConfig` 中默认关闭，即 `enableChatThreadMessage` 的默认值为 `false`。要开启该特性，需将该参数设置为 `true`。

示例代码如下：

```kotlin

    EaseIM.getConfig()?.chatConfig?.enableChatThreadMessage

```

#### 如何自定义

你可以通过继承 `EaseChatThreadActivity` 添加自己的逻辑，示例如下：

```kotlin

class ChatThreadActivity:EaseChatThreadActivity() {
    override fun setChildSettings(builder: EaseChatFragment.Builder) {
        super.setChildSettings(builder)
    }
}

```

## 消息合并转发

消息转发指用户可以将消息转发给其他用户。你可以转发单条消息，也可以选择多条消息进行合并转发。

消息转发 UI 和逻辑部分结构如下：

- `Forward EaseChatMultipleSelectMenuView`：底部菜单 View。
- `Forward EaseChatMessageMultipleSelectController`：处理 UI 布局变更(隐藏/显示 `EaseChatLayout` 中的 `EaseChatInputMenu` 输入菜单)以及转发和删除的逻辑。
- `Forward EaseChatMessageMultiSelectHelper`：消息选择帮助类用于记录选中的消息信息并提供获取方法。

![img](/images/uikit/chatuikit/feature/message/message_forward.png) 

#### 如何使用

消息转发特性在 `EaseChatConfig` 中默认开启，即 `enableSendCombineMessage` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```kotlin

	 EaseIM.getConfig()?.chatConfig?.enableSendCombineMessage

```

## 消息置顶	

消息置顶指用户将重要信息固定在会话顶部，有助于用户快速访问关键会话，避免遗漏重要内容。该特性尤其适用于处理紧急事务或持续跟进的项目，帮助高效管理重要会话。

目前，单群聊 UIKit 支持消息置顶。消息置顶 UI 和逻辑结构如下：
- `EaseChatPinMessageListViewGroup`：消息置顶区域自定义 View。
- `EaseChatPinMessageController`：控制消息置顶的显示、隐藏、跳转等逻辑。
- `EaseChatPinMessageListAdapter`：消息置顶列表适配器。
- `EaseChatPinDefaultViewHolder`：置顶消息默认类型展示样式。
- `EaseChatPinTextMessageViewHolder`：置顶消息文本类型展示样式。
- `EaseChatPinImageMessageViewHolder`：置顶消息图片类型展示样式。

![img](/images/uikit/chatuikit/feature/message/message_pin.png) 

#### 如何使用

消息置顶特性在 `EaseChatConfig` 中默认开启，即 `enableChatPingMessage` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```kotlin

     EaseIM.getConfig()?.chatConfig?.enableChatPingMessage 

     // 先定义 pin 消息的控制器
     val chatPinMessageController:EaseChatPinMessageController by lazy {
        EaseChatPinMessageController(mContext,this@EaseChatLayout, conversationId, viewModel)
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
     private val chatMessageListener = object : EaseMessageListener() {
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

     EaseIM.addChatMessageListener(chatMessageListener)

     // 显示 pin view
     chatPinMessageController.showPinInfoView()
     // 隐藏 pin view
     chatPinMessageController.hidePinInfoView()

```

## 输入状态指示

输入状态指示功能指在单聊会话中实时显示会话的一方正在输入的状态，增强通讯互动的实时性。此功能有助于用户了解对方是否正在回复，从而优化沟通体验，提升对话流畅度。

输入状态指示的 UI 和逻辑结构如下：
- `EaseTitleBar` 中的 `subtitle` 控件显示用户的状态以及输入状态指示，收到输入状态后会先显示输入状态，用户取消输入状态后显示用户的状态，输入状态消失。
- 输入状态相关回调和方法：
  - 输入状态投递为透传消息，接收到透传消息后，通过 `EaseChatFragment.Builder` 提供的 `setOnPeerTypingListener` 监听对方输入状态。
  - 输入状态回调为 `onPeerTyping(action: String?)`，其中 `action` 代表状态 `EaseChatLayout.ACTION_TYPING_BEGI` ｜ `EaseChatLayout.ACTION_TYPING_END`。

| 开启输入状态提示            | 关闭输入状态提示   | 
| :-------------- | :----- | 
| <img src=/images/uikit/chatuikit/feature/common/typing_indicator_enable.png width="300"/> |<img src=/images/uikit/chatuikit/feature/common/typing_indicator_disable.png  width="300"/>  | 

#### 如何使用

输入状态指示特性在 `EaseIM.getConfig()?.chatConfig?.enableChatTyping` 中默认开启，即 `enableChatTyping` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

同时也支持通过代码进行设置，`EaseChatFragment.Builder` 提供开启或关闭的 API `builder.turnOnTypingMonitor(true|false)`。通过代码设置优先级更高。

示例代码如下：

```kotlin
    
    EaseIM.getConfig()?.chatConfig?.enableChatTyping = true

```

#### 自定义输入状态指示 UI

本功能使用 SDK 的透传消息实现，详见 [SDK 相关文档](/document/android/message_send_receive.html#通过透传消息实现输入指示器)。

用户需要监听透传消息回调处理导航相关 UI 显示效果。







