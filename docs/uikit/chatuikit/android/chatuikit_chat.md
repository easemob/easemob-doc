# 聊天消息

<Toc />

环信单群聊 UIKit 提供 `EaseChatActivity` 和 `EaseChatFragment` 两种方式方便用户快速集成聊天页面和自定义聊天页面。该页面提供如下功能：

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件、名片和合并类型的消息。
- 对消息进行表情回复、引用、撤回、删除、翻译和编辑的操作。
- 清除本地消息。
- 删除会话。
- 从服务器拉取历史消息（消息漫游）。

![img](@static/images/uikit/chatuikit/android/page_chat.png =300x630) 

## 使用示例

`EaseChatActivity` 页面主要进行了权限的请求，比如相机权限，语音权限等。
```kotlin
// conversationId: 1v1 is peer's userID, group chat is groupID
// chatType can be EaseChatType#SINGLE_CHAT, EaseChatType#GROUP_CHAT
EaseChatActivity.actionStart(mContext, conversationId, chatType)
```

```kotlin
class ChatActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat)
        // conversationID: 1v1 is peer's userID, group chat is groupID
        // chatType can be EaseChatType#SINGLE_CHAT, EaseChatType#GROUP_CHAT
        EaseChatFragment.Builder(conversationId, chatType)
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```

![img](@static/images/uikit/chatuikit/android/buble1.png =500x900)

## 进阶用法

### 通过 EaseChatFragment.Builder 自定义设置

`EaseChatFragment` 提供了 Builder 构建方式，方便开发者进行一些自定义设置，目前提供的设置项如下：

```kotlin
// conversationID: 1v1 is peer's userID, group chat is groupID
// easeChatType: SINGLE_CHAT, GROUP_CHAT, CHATROOM
EaseChatFragment.Builder(conversationID, easeChatType)
        .useTitleBar(true)
        .setTitleBarTitle("title")
        .setTitleBarSubTitle("subtitle")
        .enableTitleBarPressBack(true)
        .setTitleBarBackPressListener(onBackPressListener)
        .getHistoryMessageFromServerOrLocal(false)
        .setOnChatExtendMenuItemClickListener(onChatExtendMenuItemClickListener)
        .setOnChatInputChangeListener(onChatInputChangeListener)
        .setOnMessageItemClickListener(onMessageItemClickListener)
        .setOnMessageSendCallBack(onMessageSendCallBack)
        .setOnWillSendMessageListener(willSendMessageListener)
        .setOnChatRecordTouchListener(onChatRecordTouchListener)
        .setOnModifyMessageListener(onModifyMessageListener)
        .setOnReportMessageListener(onReportMessageListener)
        .setMsgTimeTextColor(msgTimeTextColor)
        .setMsgTimeTextSize(msgTimeTextSize)
        .setReceivedMsgBubbleBackground(receivedMsgBubbleBackground)
        .setSentBubbleBackground(sentBubbleBackground)
        .showNickname(false)
        .hideReceiverAvatar(false)
        .hideSenderAvatar(true)
        .setChatBackground(chatBackground)
        .setChatInputMenuBackground(inputMenuBackground)
        .setChatInputMenuHint(inputMenuHint)
        .sendMessageByOriginalImage(true)
        .setEmptyLayout(R.layout.layout_chat_empty)
        .setCustomAdapter(customAdapter)
        .setCustomFragment(myChatFragment)
        .build()
```

`EaseChatFragment#Builder` 提供的方法如下表所示：

| 方法                                   | 描述                                                         |
| -------------------------------------- | ---------------------------------------------------- |
| useTitleBar()                          | 是否使用默认的标题栏（`EaseTitleBar`）：<br/> - `true`：是。 <br/> - (默认) `false`: 否。        |
| setTitleBarTitle()                     | 设置标题栏的标题。                                        |
| setTitleBarSubTitle()                  | 设置标题栏的子标题。                                       |
| enableTitleBarPressBack()              | 设置是否支持显示返回按钮：<br/> - `true`：是。 <br/> - (默认) `false`: 否。                 |
| setTitleBarBackPressListener()         | 设置点击标题栏返回按钮的监听事件。                          |
| getHistoryMessageFromServerOrLocal()   | 设置优先从服务器还是本地获取消息。                          |
| setOnChatExtendMenuItemClickListener() | 设置扩展功能的条目点击事件监听。                             |
| setOnChatInputChangeListener()         | 设置菜单中文本变化的监听。                                   |
| setOnMessageItemClickListener()        | 设置消息条目的点击事件监听，包括气泡区域及头像的点击及长按事件。 |
| setOnMessageSendCallBack()             | 设置发送消息的结果回调监听。                                   |
| setOnWillSendMessageListener()         | 设置发送消息前添加消息扩展属性的回调。                       |
| setOnChatRecordTouchListener()         | 设置录音按钮的触摸事件回调。                                 |
| setOnModifyMessageListener()           | 设置编辑消息的结果回调监听。                                 |
| setOnReportMessageListener()           | 设置举报消息的结果回调监听。                                 |
| setMsgTimeTextColor()                  | 设置时间线文本的颜色。                                        |
| setMsgTimeTextSize()                   | 设置时间线文本的字体大小。                                  |
| setReceivedMsgBubbleBackground()       | 设置接收消息气泡区域的背景。                            |
| setSentBubbleBackground()              | 设置发送消息气泡区域的背景。                              |
| showNickname()                         | 是否显示昵称：<br/> - `true`：是。 <br/> - (默认) `false`: 否。    |
| hideReceiverAvatar()                   | 设置不展示接收方头像，默认展示接收方头像。      |
| hideSenderAvatar()                     | 设置不展示发送方头像，默认展示发送方头像。  |
| setChatBackground()                    | 设置聊天列表区域的背景。   |
| setChatInputMenuBackground()           | 设置菜单区域的背景。       |
| setChatInputMenuHint()                 | 设置菜单区域输入文本框的提示文字。    |
| sendMessageByOriginalImage()           | 设置图片消息是否发送原图：<br/> - `true`：是。 <br/> - (默认) `false`: 否。   |
| setEmptyLayout()                       | 设置聊天列表的空白页面。      |
| setCustomAdapter()                     | 设置自定义的适配器，默认为 `EaseMessageAdapter`。   |
| setCustomFragment()                    | 设置自定义聊天 Fragment，需要继承自 `EaseChatFragment`。  |

### 添加自定义消息布局

开发者可以继承 `EaseMessageAdapter`、`EaseChatRowViewHolder` 和 `EaseChatRow`，实现自己的 `CustomMessageAdapter`、`CustomChatTypeViewViewHolder` 和 `CustomTypeChatRow`，然后将 `CustomMessageAdapter` 设置到 `EaseChatFragment#Builder#setCustomAdapter` 中。

1. 创建自定义适配器 `CustomMessageAdapter` 继承自 `EaseMessageAdapter`，重写 `getViewHolder` 和 `getItemNotEmptyViewType` 方法。

```kotlin
class CustomMessageAdapter: EaseMessagesAdapter() {

    override fun getItemNotEmptyViewType(position: Int): Int {
        // 根据消息类型设置自己的 itemViewType。
        // 如果要使用默认的，返回 super.getItemNotEmptyViewType(position) 即可。
        return CUSTOM_YOUR_MESSAGE_TYPE
    }

    override fun getViewHolder(parent: ViewGroup, viewType: Int): ViewHolder<EaseMessage> {
        // 根据返回的 viewType 返回对应的 ViewHolder。
        // 返回自定义的 ViewHolder 或者使用默认的 super.getViewHolder(parent, viewType)。
        return CUSTOM_VIEW_HOLDER()
    }
}
```

2. 创建` CustomTypeChatRow` ，继承自 `EaseChatRow`。

```kotlin
class CustomTypeChatRow(
    private val context: Context,
    private val attrs: AttributeSet? = null,
    private val defStyle: Int = 0,
    isSender: Boolean = false
): EaseChatRow(context, attrs, defStyle, isSender) {

    override fun onInflateView() {
        inflater.inflate(if (!isSender) R.layout.layout_row_received_custom_type
        else R.layout.layout_row_sent_custom_type,
            this)
    }

    override fun onSetUpView() {
        (message?.getMessage()?.body as? ChatTextMessageBody)?.let { txtBody ->
            contentView.text = txtBody.message
        }
    }
}
```

3. 创建 `CustomChatTypeViewViewHolder`，继承自 `EaseChatRowViewHolder`。

```kotlin
class CustomChatTypeViewViewHolder(
    itemView: View
): EaseChatRowViewHolder(itemView) {

    override fun onBubbleClick(message: EaseMessage?) {
        super.onBubbleClick(message)
        // Add click event
    }
}
```

4. 完善 `CustomMessageAdapter`。

```kotlin
class CustomMessageAdapter: EaseMessagesAdapter() {

    override fun getItemNotEmptyViewType(position: Int): Int {
        // 根据消息类型设置自己的 itemViewType。
        mData?.get(position)?.getMessage()?.let { msg ->
            msg.getStringAttribute("type", null)?.let { type ->
                if (type == CUSTOM_TYPE) {
                    return if (msg.direct() == ChatMessageDirection.SEND) {
                        VIEW_TYPE_MESSAGE_CUSTOM_VIEW_ME
                    } else {
                        VIEW_TYPE_MESSAGE_CUSTOM_VIEW_OTHER
                    }
                }
            }
        }
        // 如果要使用默认的，返回 super.getItemNotEmptyViewType(position) 即可。
        return super.getItemNotEmptyViewType(position)
    }

    override fun getViewHolder(parent: ViewGroup, viewType: Int): ViewHolder<EaseMessage> {
        // 根据返回的 viewType 返回对应的 ViewHolder。
        if (viewType == VIEW_TYPE_MESSAGE_CUSTOM_VIEW_ME || viewType == VIEW_TYPE_MESSAGE_CUSTOM_VIEW_OTHER) {
            CustomChatTypeViewViewHolder(
                CustomTypeChatRow(parent.context, isSender = viewType == VIEW_TYPE_MESSAGE_CUSTOM_VIEW_ME)
            )
        }
        // 返回自定义的 ViewHolder 或者 使用默认的 super.getViewHolder(parent, viewType)
        return super.getViewHolder(parent, viewType)
    }

    companion object {
        private const val CUSTOM_TYPE = "custom_type"
        private const val VIEW_TYPE_MESSAGE_CUSTOM_VIEW_ME = 1000
        private const val VIEW_TYPE_MESSAGE_CUSTOM_VIEW_OTHER = 1001
    }
}
```

5. 添加 `CustomMessageAdapter` 到 `EaseChatFragment#Builder`。

```kotlin
builder.setCustomAdapter(CustomMessageAdapter())
```

![img](@static/images/uikit/chatuikit/android/buble2.png =400x750)

### 列表控件相关功能设置

```kotlin
val chatMessageListLayout:EaseChatMessageListLayout? = binding?.layoutChat?.chatMessageListLayout
```

`EaseChatMessageListLayout` 提供了如下方法：

| 方法                        | 描述                                                        |
| ------------------------------ | ---------------------------------------------------- |
| setViewModel()              | UIKit 中提供了默认的实现 `EaseMessageListViewModel`，开发者可以继承 `IChatMessageListRequest` 添加自己的数据逻辑。 |
| setMessagesAdapter()        | 设置消息列表的适配器，需要是 `EaseMessagesAdapter` 的子类。                                         |
| getMessagesAdapter()        | 返回消息列表的适配器。                                         |
| addHeaderAdapter()          | 添加消息列表的头布局的适配器。                                |
| addFooterAdapter()          | 添加消息列表的尾布局的适配器。                                 |
| removeAdapter()             | 移除指定适配器。                                              |
| addItemDecoration()         | 添加消息列表的装饰器。                                        |
| removeItemDecoration()      | 移除消息列表的装饰器。                                        |
| setAvatarDefaultSrc()       | 设置条目的默认头像。                                         |
| setAvatarShapeType()        | 设置头像的样式，分为默认样式，圆形和矩形三种样式。   |
| showNickname()              | 是否展示条目的昵称，`EaseChatFragment#Builder` 也提供了此功能的设置方法。 |
| setItemSenderBackground()   | 设置发送方的背景，`EaseChatFragment#Builder` 也提供了此功能的设置方法。 |
| setItemReceiverBackground() | 设置接收方的背景，`EaseChatFragment#Builder` 也提供了此功能的设置方法。 |
| setItemTextSize()           | 设置文本消息的字体大小。                                       |
| setItemTextColor()          | 设置文本消息的字体颜色。                                       |
| setTimeTextSize()           | 设置时间线文本的字体大小，`EaseChatFragment#Builder` 也提供了此功能的设置方法。 |
| setTimeTextColor()          | 设置时间线文本的颜色，`EaseChatFragment#Builder` 也提供了此功能的设置方法。 |
| setTimeBackground()         | 设置时间线的背景。                                             |
| hideChatReceiveAvatar()     | 不展示接收方头像，默认为展示，`EaseChatFragment#Builder` 也提供了此功能的设置方法。 |
| hideChatSendAvatar()        | 不展示发送方头像，默认为展示，`EaseChatFragment#Builder` 也提供了此功能的设置方法。 |
| setOnChatErrorListener()    | 设置发送消息时的错误回调，`EaseChatFragment#Builder` 也提供了此功能的设置方法。 |


### 扩展功能设置

```kotlin
val chatExtendMenu: IChatExtendMenu? = binding?.layoutChat?.chatInputMenu?.chatExtendMenu
```

获取到 `chatExtendMenu` 对象后，对于扩展功能可以进行添加，移除，排序以及处理扩展功能的点击事件等。

`IChatExtendMenu` 提供的方法如下表所示：

| 方法                                    | 描述                                                 |
| -------------------------------------- | ---------------------------------------------------- |
| clear()            | 清除所有的扩展菜单项。   |
| setMenuOrder()     | 对指定的菜单项进行排序。 |
| registerMenuItem() | 添加新的菜单项。         |

![img](@static/images/uikit/chatuikit/android/editor2.png =500x900)

### 监听扩展条目点击事件

开发者可以利用 `EaseChatFragment#Builder#setOnChatExtendMenuItemClickListener` 进行监听，也可以在自定义的 `Fragment` 中重写 `onChatExtendMenuItemClick` 方法。

```kotlin
override fun onChatExtendMenuItemClick(view: View?, itemId: Int): Boolean {
    if(itemId == CUSTOM_YOUR_EXTEND_MENU_ID) {
        // 处理你自己的点击事件逻辑
        // 如果要自定义点击事件需要返回 `true`
        return true
    }
    return super.onChatExtendMenuItemClick(view, itemId)
}
```

### 长按菜单功能设置

- 增加自定义菜单条目

```kotlin
binding?.let {
    it.layoutChat.addItemMenu(menuId, menuOrder, menuTile)
}
```

`EaseChatLayout` 提供的长按菜单方法如下表所示：

| 方法                                | 描述                                                         |
| -------------------------------------- | ---------------------------------------------------- |
| clearMenu()                         | 清除菜单项。                                                  |
| addItemMenu()                       | 添加新的菜单项。                                               |
| findItemVisible()                   | 通过指定 `itemId` 设置菜单项的可见性。                           |
| setOnMenuChangeListener()           | 设置菜单项的点击事件监听，`EaseChatFragment` 中已经设置此监听。  |

- 处理菜单的事件

  在自定义的 `Fragment` 中重写以下方法：

```kotlin
override fun onPreMenu(helper: EaseChatMenuHelper?, message: ChatMessage?) {
    // 菜单展示前的回调事件，可以通过 helper 对象在这里设置菜单条目是否展示。
}

override fun onMenuItemClick(item: EaseMenuItem?, message: ChatMessage?): Boolean {
    // 如果要拦截某个点击事件，需要设置返回 `true`。
    return false
}

override fun onDismiss() {
    // 可以在这里处理快捷菜单的隐藏事件。
}
```


### 设置输入菜单相关属性

- 获取 `EaseChatInputMenu` 对象：

```kotlin
val chatInputMenu: EaseChatInputMenu? = binding?.layoutChat?.chatInputMenu
```

`EaseChatInputMenu` 提供了如下方法：

| 方法                       | 描述                                                         |
| -------------------------- | ------------------------------------------------------------ |
| setCustomPrimaryMenu()     | 设置自定义的菜单项，支持 View 和 Fragment 两种方式。           |
| setCustomEmojiconMenu()    | 设置自定义的表情功能，支持 View 和 Fragment 两种方式。        |
| setCustomExtendMenu()      | 设置自定义的扩展功能，支持 View ，Dialog 和 Fragment 三种方式。 |
| setCustomTopExtendMenu()   | 设置自定义的菜单顶部布局，支持 View ，Fragment 两种方式。 |
| hideExtendContainer()      | 隐藏扩展区域，包括表情区域和扩展功能区域。                     |
| hideInputMenu()            | 隐藏除了菜单顶部区域外的区域。                     |
| showEmojiconMenu()         | 展示表情功能区域。                                             |
| showExtendMenu()           | 展示扩展功能区域。                                             |
| showTopExtendMenu()        | 展示顶部扩展功能区域。                                          |
| setChatInputMenuListener() | 设置输入菜单监听。                                             |
| chatPrimaryMenu           | 获取菜单项接口。                                               |
| chatEmojiMenu             | 获取表情功能菜单接口。                                         |
| chatExtendMenu            | 获取扩展功能接口。                                             |
| chatTopExtendMenu        | 获取顶部扩展功能接口。                                            |

- 获取菜单项对象：

```kotlin
val primaryMenu: IChatPrimaryMenu? = binding?.layoutChat?.chatInputMenu?.chatPrimaryMenu
```

IChatPrimaryMenu 提供了如下方法：

| 方法                | 描述                                     |
| ------------------- | ----------------------------------------- |
| onTextInsert()      | 在光标处插入文本                          |
| editText            | 获取菜单输入框对象                        |
| setMenuBackground() | 设置菜单的背景                            |

- 获取表情菜单对象：

```kotlin
val emojiconMenu: IChatEmojiconMenu? = binding?.layoutChat?.chatInputMenu?.chatEmojiMenu
```

`IChatEmojiconMenu` 提供了如下方法：

| 方法                  | 描述               |
| --------------------- | ------------------ |
| addEmojiconGroup()    | 添加自定义表情。     |
| removeEmojiconGroup() | 移除指定的表情组。   |
| setTabBarVisibility() | 设置 `TabBar` 可见性。 |

添加自定义表情：

```kotlin
binding?.let {
    it.layoutChat.chatInputMenu?.chatEmojiMenu?.addEmojiconGroup(EmojiconExampleGroupData.getData())
}
```




