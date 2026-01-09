# 设置消息列表

消息列表是聊天界面的核心组件，基于 `ChatUIKitMessageListLayout` 实现。本文介绍如何设置和自定义消息列表和消息列表 Item。

// TODO：添加图片，列明消息气泡等

## 设置消息列表背景

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setChatBackground(chatBackground)
        .build()
```

// TODO：添加图片

## 设置消息列表空白页面

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setEmptyLayout(R.layout.layout_chat_empty)
        .build()
```

// TODO：添加图片

## 设置消息列表Item

对于消息列表Item `ChatUlKitRow`，你可以进行自定义设置，例如：
- 添加自定义消息列表Item
- 设置默认的头像和昵称以及样式
- 设置消息气泡
- 设置消息时间
- 设置长按消息菜单
- 设置消息状态图标
- 设置消息事件监听

### 添加自定义消息列表Item 

你可以自定义消息表中列表项的内容，即各种消息类型的自定义消息布局。

开发者可以继承 `ChatUIKitRow`、`ChatUIKitRowViewHolder` 和 `ChatUIKitMessagesAdapter` 实现自己的 `CustomTypeChatRow`、`CustomChatTypeViewViewHolder` 和 `CustomMessageAdapter`，然后将 `CustomMessageAdapter` 设置到 `UIKitChatFragment#Builder#setCustomAdapter` 中。

1. 创建 `CustomTypeChatRow` ，继承自 `ChatUIKitRow`。

```kotlin
class CustomTypeChatRow(
    private val context: Context,
    private val attrs: AttributeSet? = null,
    private val defStyle: Int = 0,
    isSender: Boolean = false
): ChatUIKitRow(context, attrs, defStyle, isSender) {

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

2. 创建 `CustomChatTypeViewViewHolder`，继承自 `ChatUIKitRowViewHolder`。

```kotlin
class CustomChatTypeViewViewHolder(
    itemView: View
): ChatUIKitRowViewHolder(itemView) {

    override fun onBubbleClick(message: EaseMessage?) {
        super.onBubbleClick(message)
        // Add click event
    }
}
```

3. 创建自定义适配器 `CustomMessageAdapter` 继承自 `ChatUIKitMessagesAdapter`，重写 `getItemNotEmptyViewType` 和 `getViewHolder` 方法。

```kotlin
class CustomMessageAdapter: ChatUIKitMessagesAdapter() {

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
        // 返回自定义的 ViewHolder 或者 使用默认的 super.getViewHolder(parent, viewType)。
        return super.getViewHolder(parent, viewType)
    }

    companion object {
        private const val CUSTOM_TYPE = "custom_type"
        private const val VIEW_TYPE_MESSAGE_CUSTOM_VIEW_ME = 1000
        private const val VIEW_TYPE_MESSAGE_CUSTOM_VIEW_OTHER = 1001
    }
}
```

4. 添加 `CustomMessageAdapter` 到 `UIKitChatFragment#Builder`。

```kotlin
builder.setCustomAdapter(CustomMessageAdapter())
```

### 设置头像和昵称

你可以通过 `UIKitChatFragment#Builder` 设置头像和昵称。关于使用自己的头像和昵称，详见 [用户自定义信息文档中的介绍](chatuikit_userinfo.html#设置会话头像和昵称)。

```kotlin
//com.hyphenate.easeui.feature.chat.activities.UIKitChatActivity
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
val fragment = UIKitChatFragment.Builder(conversationID, easeChatType)
    .showNickname(true)                 // 是否显示昵称：true：是；(默认) false: 否。
    .hideReceiverAvatar(false)          // 是否隐藏接收方头像：true 隐藏；false 显示（默认显示）。
    .hideSenderAvatar(false)            // 是否隐藏发送方头像：true 隐藏；false 显示（默认显示）。
    .build()

fragment?.let { fragment ->
                supportFragmentManager.beginTransaction().replace(binding.flFragment.id, fragment, getFragmentTag()).commit()
            }

```

除了 `UIKitChatFragment.Builder`，你还可以通过 `ChatUIKitMessageListLayout` 设置头像和昵称，详见 [高级自定义文档](chatuikit_chat_list_advanced.html#设置头像和昵称)。

### 设置消息气泡

你可以通过 `UIKitChatFragment#Builder` 设置消息气泡。

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
val fragment = UIKitChatFragment.Builder(conversationID, easeChatType)
    .setReceivedMsgBubbleBackground(R.drawable.your_receiver_bubble_bg) // 设置接收消息气泡区域的背景。
    .setSentBubbleBackground(R.drawable.your_sender_bubble_bg)          // 设置发送消息气泡区域的背景。
    .sendMessageByOriginalImage(true)                                   // 是否发送原图：true：是；(默认) false: 否。
    .build()

fragment?.let { fragment ->
    supportFragmentManager.beginTransaction()
        .replace(binding.flFragment.id, fragment, getFragmentTag())
        .commit()
}
```

除了 `UIKitChatFragment.Builder`，你可以通过 `chatMessageListLayout` 设置消息气泡，详见 [高级自定义文档](chatuikit_chat_list_build.html#设置消息气泡)。

### 设置消息日期

你可以设置消息的发送和接收日期的格式和样式。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom_message_date.png" title="设置消息日期" />
</ImageGallery>

#### 设置日期格式

`ChatUIKitDateFormatConfig` 支持设置消息日期的格式：

| 属性                  | 描述                                                                |
| --------------------- | ------------------------------------------------------------------- |
| `chatTodayFormat`    | 消息列表当天日期格式，英文环境默认为："HH:mm"。                     |
| `chatOtherDayFormat`  | 消息列表其他日期的格式，英文环境默认为： "MMM dd, HH:mm"。          |
| `chatOtherYearFormat` | 消息列表其他年份的日期格式，英文环境默认为： "MMM dd, yyyy HH:mm"。 |

```kotlin
    // 日期语言区域切换（基于手机区域语言设置）默认值为 false 采用 ENGLISH。 
    // 举例：chatOtherDayFormat = "MMM dd, yyyy"  a.false: Sep 25, 2024  b.true(本地语言中文): 9月 25, 2024
    ChatUIKitClient.getConfig()?.dateFormatConfig?.useDefaultLocale = true  
    // 消息中当天的日期格式
    ChatUIKitClient.getConfig()?.dateFormatConfig?.chatTodayFormat = "HH:mm"
    // 消息中其他日期的日期格式
    ChatUIKitClient.getConfig()?.dateFormatConfig?.chatOtherDayFormat = "MMM dd, yyyy"
    // 消息中其他年份的日期格式
    ChatUIKitClient.getConfig()?.dateFormatConfig?.chatOtherYearFormat = "MMM dd, yyyy HH:mm"
```

#### 设置日期样式

`UIKitChatFragment#Builder` 支持设置消息时间样式：

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
val fragment = UIKitChatFragment.Builder(conversationID, easeChatType)
    .setMsgTimeTextColor(Color.GRAY)   // 设置时间文本的颜色。
    .setMsgTimeTextSize(12)            // 设置时间文本的字体大小（单位：px）。

fragment?.let { fragment ->
    supportFragmentManager.beginTransaction()
        .replace(binding.flFragment.id, fragment, getFragmentTag())
        .commit()
}      
```

:::tip
Builder 不支持设置时间背景。若设置时间背景，需使用 `ChatUIKitMessageListLayout#setTimeBackground(Drawable?)` 或 设置 XML 属性 `ease_chat_item_time_background`，详见 [高级自定义文档](chatuikit_chat_list_build.html#设置消息日期样式)。
:::

### 设置消息状态图标

#### 替换图标资源

如需自定义消息状态图标，你可在 App 工程中同名覆盖以下 Drawable 资源：

| 状态     | Drawable 资源名             |
| :------- | :-------------------------- |
| 已发送 | `uikit_msg_status_sent`     |
| 已送达 | `uikit_msg_status_received` |
| 已读   | `uikit_msg_status_read`     |

#### 状态显示规则

消息已送达和已读图标的显示行为与 SDK 初始化的 `ChatOptions` 配置有关：

- 当 `requireDeliveryAck = true` 且消息收到送达回执时，显示 **已送达** 图标；
- 当 `requireAck = true` 且消息收到已读回执时，显示消 **已读** 图标。

```kotlin
// SDK 初始化时设置（示例：参考 DemoHelper#initChatOptions）
val options = ChatOptions().apply {
    // 是否需要已读回执
    requireAck = true
    // 是否需要送达回执
    requireDeliveryAck = true
}
ChatUIKitClient.init(context, options)
```

#### 隐藏状态图标

- 方式 1：仅隐藏“已读/已送达”

将 `requireAck` 或 `requireDeliveryAck` 设为 `false`，则对应状态图标不会显示，但发送成功后仍会显示已发送图标。

- 方式 2：完全隐藏所有发送状态图标（含已发送）

需要自定义发送消息的 Row 布局/Row（例如，在 App 工程中同名覆盖各类 `uikit_row_sent_*.xml` 并移除 `tv_delivered`/`tv_ack`），或提供自定义 Row/ViewHolder 实现。

## 设置长按消息菜单

在消息列表中长按任意消息，即可弹出操作菜单，支持复制、回复、转发、置顶、多选、翻译、创建话题等丰富功能。

### 设置菜单风格

UIKit 提供两种风格的消息长按菜单样式，你可以灵活选择实现：

- 启用类似微信样式菜单：

```kotlin
ChatUIKitClient.getConfig()?.chatConfig?.enableWxMessageStyle = true
```

- 启用仿系统 `UIActionSheet` 样式菜单：

```kotlin
ChatUIKitClient.getConfig()?.chatConfig?.enableWxMessageStyle = false
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/message_longpress_1.png" title="UIActionSheet" />
  <ImageItem src="/images/uikit/chatuikit/android/message_longpress_2.png" title="类似微信样式" />
</ImageGallery>

### 设置菜单项

`ChatUIKitLayout` 提供完整的长按菜单项管理能力，如下表所示：

| 方法                         | 描述                                                             |
| ---------------------------- | ---------------------------------------------------------------- |
| `addItemMenu()`             | 添加新菜单项。                                                 |
| `clearMenu()`                | 清除菜单项。                                                     |
| `findItemVisible()`          | 设置 `itemId` 显示或隐藏指定菜单项。                           |
| `setOnMenuChangeListener() ` | 设置菜单项的点击事件监听，`UIKitChatFragment` 中已经设置该监听。 |

- 添加新菜单项：

```kotlin
binding?.let {
    it.layoutChat.addItemMenu(menuId, menuOrder, menuTile)
}
```

- 清除所有菜单项：

```kotlin
binding?.let {
    it.layoutChat.clearMenu()
}
```

- 显示或隐藏指定菜单项：
  
  通过指定 `itemId` 设置菜单项的可见性。  

```kotlin
binding?.let {
    it.layoutChat.findItemVisible(itemId: Int, visible: Boolean)
}
```

- 处理菜单事件

`UIKitChatFragment` 已预设菜单点击监听。 自定义 `Fragment` 继承 `UIKitChatFragment` 后，可重写以下方法实现监听：

```kotlin
override fun onPreMenu(helper: ChatUIKitChatMenuHelper?, message: ChatMessage?) {
    // 菜单展示前的回调事件，可以通过 helper 对象设置菜单项是否展示。
}

override fun onMenuItemClick(item: ChatUIKitMenuItem?, message: ChatMessage?): Boolean {
    // 菜单项点击事件，设置返回 true 表示拦截该事件。
    return false
}

override fun onDismiss() {
    // 处理快捷菜单的隐藏事件。
}
```

- 设置菜单样式

关于消息长按菜单的样式的设置，包括菜单背景和菜单项的图标、文字颜色和大小，详见 [高级定制文档](chatuikit_chat_list_avanced.html#设置菜单样式)。

## 设置事件监听

通过 `UIKitChatFragment#Builder` 可设置消息列表Item 的各类交互事件监听，包括气泡区域及头像的点击与长按事件。

```kotlin
    builder.setOnMessageItemClickListener(object : OnMessageItemClickListener{
            //消息气泡点击事件
            override fun onBubbleClick(message: ChatMessage?): Boolean {}
            //消息气泡长按事件，return true 消费事件，不继续向下传递（即不执行 UIKit 中的默认逻辑）
            override fun onBubbleLongClick(v: View?, message: ChatMessage?): Boolean {}
            //重发事件，用于发送消息失败后的重试操作，返回 true 消费事件 不继续向下传递（即不执行 UIKit 中的默认逻辑）
            override fun onResendClick(message: ChatMessage?): Boolean {}
            //头像点击事件
            override fun onUserAvatarClick(userId: String?) {}
            //头像长按事件
            override fun onUserAvatarLongClick(userId: String?) {}
        })   
```

## 设置消息发送回调

你可以通过 `UIKitChatFragment.Builder` 设置消息发送后回调和消息发送前回调监听。

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
val fragment = UIKitChatFragment.Builder(conversationID, easeChatType)
        .setOnMessageSendCallBack(onMessageSendCallBack) // 消息发送后回调。
        .setOnWillSendMessageListener(willSendMessageListener) // 消息发送前回调监听。 
        .build()
fragment?.let { fragment ->
        supportFragmentManager.beginTransaction()
        .replace(binding.flFragment.id, fragment, getFragmentTag())
        .commit()
}        
```

## 相关资源

在 App 工程中，可通过放置同名资源（`drawable`/`layout`/`values`）来覆盖 UIKit 默认实现，从而自定义界面与功能。详见 [高级自定义说明](chatuikit_chat_list_advanced.html)。

## 可重写方法标记

标记为 open / override fun的方法均可被子类重写方法。如有需要，可重写对应方法实现自己业务逻辑。

