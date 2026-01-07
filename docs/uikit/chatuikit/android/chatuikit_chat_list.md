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
- 设置消息撤回时间
- 设置长按消息菜单
- 设置消息翻译
- 设置消息已送达和已读图标
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

你可以通过 `ChatUIKitMessageListLayout` 或 `UIKitChatFragment#Builder` 设置头像和昵称。关于使用自己的头像和昵称，详见 [用户自定义信息文档中的介绍](chatuikit_userinfo.html#设置会话头像和昵称)。

| 项         | ChatUIKitMessageListLayout | UIKitChatFragment.Builder | 说明                  |
| :------------- | :------------------------- | :------------------------ | :-------------------- |
| 默认头像       | `setAvatarDefaultSrc()`    | 不支持                    | 设置默认头像。      |
| 发送方头像显示/隐藏 | `hideChatSendAvatar()`     | `hideSenderAvatar()`      | - `true`：隐藏<br/> -（默认）`false`：显示 |
| 接收方头像显示/隐藏 | `hideChatReceiveAvatar()`  | `hideReceiverAvatar()`    | - `true`：隐藏<br/> -（默认）`false`：显示 |
| 昵称显示/隐藏       | `showNickname()`           | `showNickname()`          | - `true`：显示<br/> -（默认）`false`：隐藏 |

- 通过 `ChatUIKitMessageListLayout` 设置：

```kotlin
// 获取 ChatUIKitMessageListLayout 对象
val chatMessageListLayout: ChatUIKitMessageListLayout? = binding?.layoutChat?.chatMessageListLayout
chatMessageListLayout?.let { layout ->
    // 设置消息列表 Item 的默认头像（placeholder）
    layout.setAvatarDefaultSrc(ContextCompat.getDrawable(layout.context, R.drawable.your_default_avatar))
    // 是否隐藏头像：true 隐藏；false 显示（默认显示）
    layout.hideChatSendAvatar(false)
    layout.hideChatReceiveAvatar(false)
    // 是否显示消息列表 Item 的昵称：true 显示；false 隐藏
    layout.showNickname(true)
    // 修改配置后建议刷新列表
    layout.notifyDataSetChanged()
}
```

- 通过 `UIKitChatFragment#Builder` 设置：

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

### 设置消息气泡

你可以通过 `chatMessageListLayout` 或 `UIKitChatFragment#Builder` 设置消息气泡。

| 项         | ChatUIKitMessageListLayout | UIKitChatFragment.Builder | 说明                  |
| :------------- | :------------------------- | :------------------------ | :-------------------- |
| 发送消息气泡的背景       | `setItemSenderBackground`     | `setSentBubbleBackground`                    |      |
| 接收消息气泡的背景 | `setItemReceiverBackground`     | `setReceivedMsgBubbleBackground`     |  |
| 文本消息的字体大小 | `setItemTextSize`  | 不支持   | 单位为 sp 或 px，以实际实现为准。|
| 文本消息的字体颜色       | `setItemTextColor`          | 不支持      | 
| 是否发送原图       | 不支持    |  `sendMessageByOriginalImage`     | - `true`：是 <br/> - (默认) `false`: 否     | 

- 通过 `chatMessageListLayout` 进行消息气泡的如下配置：

```kotlin
// 获取 ChatUIKitMessageListLayout 对象
val chatMessageListLayout:ChatUIKitMessageListLayout? = binding?.layoutChat?.chatMessageListLayout
chatMessageListLayout?.let{
    it.setItemSenderBackground(R.drawable.your_sender_bubble_bg)     // 设置发送消息气泡区域的背景。
    it.setItemReceiverBackground(R.drawable.your_receiver_bubble_bg) // 设置接收消息气泡区域的背景。
    it.setItemTextSize(14)                                           // 设置文本消息的字体大小（单位：sp/px 以实际实现为准）。
    it.setItemTextColor(Color.BLACK)                                 // 设置文本消息的字体颜色。
    ...
} 
```

- 通过 `UIKitChatFragment#Builder` 进行消息气泡的如下配置：

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

- `ChatUIKitMessageListLayout` 提供了如下方法设置消息时间的样式：

| 方法                | 描述                                                                               |
| ------------------- | ---------------------------------------------------------------------------------- |
| `setTimeTextSize()`   | 设置消息日期文本的字体大小，`UIKitChatFragment#Builder` 也提供了此功能的设置方法。 |
| `setTimeTextColor()`  | 设置消息日期文本的颜色，`UIKitChatFragment#Builder` 也提供了此功能的设置方法。     |
| `setTimeBackground()` | 设置消息日期的背景。                                                               |

```kotlin
// 获取 ChatUIKitMessageListLayout 对象
val chatMessageListLayout:ChatUIKitMessageListLayout? = binding?.layoutChat?.chatMessageListLayout
chatMessageListLayout?.let{
    it.setTimeTextSize(12)  // 设置消息日期文本的字体大小（单位：px ）
    it.setTimeTextColor(Color.GRAY) // 设置消息日期文本的颜色
    it.setTimeBackground(ContextCompat.getDrawable(it.context, R.drawable.your_time_bg)) // 设置消息日期的背景
    ...
} 
```

- `UIKitChatFragment#Builder` 中也提供了一些消息列表相关配置项：

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
Builder 不支持设置时间背景。若设置时间背景，需使用 `ChatUIKitMessageListLayout#setTimeBackground(Drawable?)` 或 设置 XML 属性 `ease_chat_item_time_background`。
:::

## 设置消息撤回时间

你可以通过 `ChatUIKitClient.getConfig()?.chatConfig?.timePeriodCanRecallMessage` 设置聊天页面消息撤回的有效时间，默认为 120 秒。

## 设置消息翻译

- 开启翻译功能：

你可以设置 `ChatUIKitClient.getConfig()?.chatConfig?.enableTranslationMessage` 为 `true` 开启文本消息长按翻译功能。默认为 `false`，即该功能默认关闭。

- 设置目标翻译语言：

你可以通过 `ChatUIKitClient.getConfig()?.chatConfig?.targetTranslationLanguage = "zh"`：翻译目标语言，默认为中文。文本消息长按后出现 **翻译** 菜单，点击 **翻译** 后设置翻译的目标语言。使用前，你需在 [环信控制台](https://console.easemob.com/user/login) [开启翻译功能](/product/console/purchase_value_added.html#消息翻译)，然后将 `ChatUIKitClient.getConfig()?.chatConfig?.enableTranslationMessage` 设置为 `true`，才会出现文本消息长按的翻译功能。若该功能未开启，前端无法成功调用 API 进行翻译。

- 设置翻译文本样式：
  - `<style name="ease_chat_message_received_translation_content_style">`：消息接收方翻译文本样式 可以自行修改文本任意属性。
  - `<style name="ease_chat_message_sent_translation_content_style">`：消息发送方翻译文本样式 可以自行修改文本任意属性。

## 设置消息状态图标

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

- 方式一：仅隐藏“已读/已送达”

将 `requireAck` 或 `requireDeliveryAck` 设为 `false`，则对应状态图标不会显示，但发送成功后仍会显示已发送图标。

- 方式二：完全隐藏所有发送状态图标（含已发送）

需要自定义发送消息的 Row 布局/Row（例如，在 App 工程中同名覆盖各类 `uikit_row_sent_*.xml` 并移除 `tv_delivered`/`tv_ack`），或提供自定义 Row/ViewHolder 实现。

## 设置长按消息菜单

在消息列表中长按任意消息，即可弹出操作菜单，支持复制、回复、转发、置顶、多选、翻译、创建话题等丰富功能。

### 设置菜单样式

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

- 显示或隐藏指定菜单项：
  
  通过指定 `itemId` 设置菜单项的可见性。  

```kotlin
binding?.let {
    it.layoutChat.findItemVisible(itemId: Int, visible: Boolean)
}
```

- 清除所有菜单项：

```kotlin
binding?.let {
    it.layoutChat.clearMenu()
}
```

- 处理菜单的事件

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

- 设置菜单项的图标

你可以在 `onPreMenu()` 中通过 `ChatUIKitChatMenuHelper` 动态控制菜单项的图标：

| 菜单项 | 默认 ID                   | 默认图标资源                  |
| :----- | :------------------------ | :---------------------------- |
| 复制   | `R.id.action_chat_copy`   | `uikit_chat_item_menu_copy`   |
| 删除   | `R.id.action_chat_delete` | `uikit_chat_item_menu_delete` |
| 撤回   | `R.id.action_chat_recall` | `uikit_chat_item_menu_unsent` |
| 编辑   | `R.id.action_chat_edit`   | `uikit_chat_item_menu_edit`   |
| 回复   | `R.id.action_chat_reply`  | `uikit_chat_item_menu_reply`  |

**自定义方式**：

- **替换图标**：修改 `resourceId` 属性，或在 App 工程中**同名覆盖**默认 drawable。
- **隐藏图标**：将 `resourceId` 设置为 `-1`，则隐藏图标，仅显示文字。
- **显示/隐藏**：使用 `findItemVisible()` 方法显示或隐藏菜单项。

示例代码如下：

```kotlin
override fun onPreMenu(helper: ChatUIKitChatMenuHelper?, message: ChatMessage?) {
    helper ?: return
    // 隐藏“编辑”菜单项
    helper.findItemVisible(R.id.action_chat_edit, false)

    // 替换“复制”图标
    helper.findItem(R.id.action_chat_copy)?.resourceId = R.drawable.ic_copy_custom

    // “撤回”仅显示文字，不显示图标
    helper.findItem(R.id.action_chat_recall)?.resourceId = -1
}
```

- 设置菜单项的文字颜色和大小

1. `ChatUIKitMenuItem` 支持通过 `titleColor` 设置 **文字颜色**（同时会作为 icon tint 颜色）：

```kotlin
override fun onPreMenu(helper: ChatUIKitChatMenuHelper?, message: ChatMessage?) {
    helper?.findItem(R.id.action_chat_delete)?.titleColor = Color.RED
}
```

2. 根据菜单样式的不同，文字大小的调整方式有所区别：

| 菜单样式                        | 调整方式                                                     |
| :------------------------------ | :----------------------------------------------------------- |
| 微信样式（PopupWindow）    | 在 App 工程中**同名覆盖** `layout/uikit_item_select_text_pop.xml`，修改 `tv_pop_func` 的 `android:textSize` 属性。 |
| 底部弹窗样式（BottomSheet） | 在 App 工程中**同名覆盖**以下样式之一： <br/> - `ease_chat_extend_menu_item_title` <br/> - `ease_chat_extend_menu_horizontal_item_title` <br/>调整其中的 `textAppearance` 或 `textSize` 属性。（对应布局文件：`uikit_chat_menu_item.xml` / `uikit_chat_menu_item_horizontal.xml`） |

- 设置菜单背景色

菜单背景颜色同样通过资源覆盖的方式进行自定义：

| 菜单样式                        | 背景调整方式                                                 |
| :------------------------------ | :----------------------------------------------------------- |
| 微信样式（PopupWindow）     | 覆盖 `drawable/uikit_shape_popup_radius_8` 资源，可修改背景色、圆角、描边等样式。 |
| 底部弹窗样式（BottomSheet） | 菜单列表的布局文件位于 `res/layout/uikit_dialog_menu.xml` 中。若需自定义背景，可在您的 App 工程中覆盖以下样式：<br>  - `ease_item_menu_top_layout_style`<br>  - `ease_conv_item_menu_list`<br>  - `ease_conv_item_menu_divider`<br>  - `ease_conv_item_menu_cancel` |

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

你可以在 App 工程中放置同名资源（`drawable`/`layout`/`values`）来覆盖 UIKit 默认实现，达到替换资源的目的。

### 可同名覆盖的 drawable

1. 消息类型和消息操作相关的资源设置如下表所示：

<table>
<thead>
<tr>
<td>
<p>分类</p>
</td>
<td>
<p>资源名称</p>
</td>
<td>
<p>说明</p>
</td>
</tr>
</thead>
<tbody>
<tr>
<td>
<p>通用/默认</p>
</td>
<td>
<p>uikit_default_avatar</p>
</td>
<td>
<p>默认头像</p>
</td>
</tr>
<tr>
<td rowspan="2">
<p>消息气泡容器</p>
</td>
<td>
<p>uikit_chat_row_receive_bubble_bg</p>
</td>
<td>
<p>接收方气泡背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_row_sent_bubble_bg</p>
</td>
<td>
<p>发送方气泡背景</p>
</td>
</tr>
<tr>
<td rowspan="4">
<p>发送状态/失败重发</p>
</td>
<td>
<p>uikit_msg_status_sent</p>
</td>
<td>
<p>已发送图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_msg_status_received</p>
</td>
<td>
<p>已送达图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_msg_status_read</p>
</td>
<td>
<p>已读图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_msg_state_failed_resend</p>
</td>
<td>
<p>发送失败重发图标</p>
</td>
</tr>
<tr>
<td rowspan="4">
<p>图片/视频</p>
</td>
<td>
<p>uikit_default_image</p>
</td>
<td>
<p>图片占位图</p>
</td>
</tr>
<tr>
<td>
<p>uikit_default_video_thumbnail</p>
</td>
<td>
<p>视频缩略图占位图</p>
</td>
</tr>
<tr>
<td>
<p>uikit_video_play_btn_small_nor</p>
</td>
<td>
<p>视频播放按钮</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_row_video_length_bg</p>
</td>
<td>
<p>视频时长背景</p>
</td>
</tr>
<tr>
<td rowspan="5">
<p>语音</p>
</td>
<td>
<p>uikit_chatfrom_voice_playing</p>
</td>
<td>
<p>接收方语音图标/动画</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chatto_voice_playing</p>
</td>
<td>
<p>发送方语音图标/动画</p>
</td>
</tr>
<tr>
<td>
<p>voice_from_icon</p>
</td>
<td>
<p>语音播放帧动画（接收方）</p>
</td>
</tr>
<tr>
<td>
<p>voice_to_icon</p>
</td>
<td>
<p>语音播放帧动画（发送方）</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_voice_unread_icon</p>
</td>
<td>
<p>语音未读标记</p>
</td>
</tr>
<tr>
<td rowspan="2">
<p>文件</p>
</td>
<td>
<p>uikit_chat_row_file_icon</p>
</td>
<td>
<p>文件消息图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_row_file_icon_bg</p>
</td>
<td>
<p>文件消息图标背景</p>
</td>
</tr>
<tr>
<td rowspan="5">
<p>位置</p>
</td>
<td>
<p>uikit_chat_location</p>
</td>
<td>
<p>位置图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_row_receive_location_bubble_bg</p>
</td>
<td>
<p>接收方位置气泡背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_row_send_location_bubble_bg</p>
</td>
<td>
<p>发送方位置气泡背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_row_receive_location_content_bg</p>
</td>
<td>
<p>接收方位置内容区域背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_row_send_location_content_bg</p>
</td>
<td>
<p>发送方位置内容区域背景</p>
</td>
</tr>
<tr>
<td rowspan="2">
<p>链接预览</p>
</td>
<td>
<p>uikit_url_preview_receive_bubble_bg</p>
</td>
<td>
<p>接收方链接预览气泡背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_url_preview_sent_bubble_bg</p>
</td>
<td>
<p>发送方链接预览气泡背景</p>
</td>
</tr>
<tr>
<td rowspan="6">
<p>引用回复</p>
</td>
<td>
<p>uikit_widget_chat_message_reply_background</p>
</td>
<td>
<p>引用回复整体背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_row_receive_message_reply_bg</p>
</td>
<td>
<p>接收方消息行中的回复背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_row_send_message_reply_bg</p>
</td>
<td>
<p>发送方消息行中的回复背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_quote_default_image</p>
</td>
<td>
<p>引用图片默认占位图</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_quote_icon_image</p>
</td>
<td>
<p>引用图片图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_quote_icon_cancel</p>
</td>
<td>
<p>取消引用图标</p>
</td>
</tr>
<tr>
<td rowspan="4">
<p>话题/置顶</p>
</td>
<td>
<p>uikit_thread_region_bubble</p>
</td>
<td>
<p>话题区域气泡背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_item_menu_topic</p>
</td>
<td>
<p>话题入口图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_topic_count_icon</p>
</td>
<td>
<p>话题数量图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_icon_chat_pininfo_light</p>
</td>
<td>
<p>置顶图标</p>
</td>
</tr>
<tr>
<td rowspan="6">
<p>多选/转发/合并/未读提示等</p>
</td>
<td>
<p>uikit_chat_item_multi_selector</p>
</td>
<td>
<p>多选态item背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_icon_combine</p>
</td>
<td>
<p>合并消息图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_shape_message_forward_tab_layout_indicator</p>
</td>
<td>
<p>转发/合并等页面标签指示器</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_forward_btn_bg_selector</p>
</td>
<td>
<p>转发按钮背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_icon_down_arrow</p>
</td>
<td>
<p>未读提示下拉箭头</p>
</td>
</tr>
<tr>
<td>
<p>uikit_title_menu</p>
</td>
<td>
<p>标题/菜单图标（部分消息组件使用）</p>
</td>
</tr>
<tr>
<td rowspan="2">
<p>消息编辑</p>
</td>
<td>
<p>uikit_chat_message_edit_root_bg</p>
</td>
<td>
<p>编辑弹窗根背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_message_edit_button_selector</p>
</td>
<td>
<p>编辑弹窗按钮背景</p>
<p>&nbsp;</p>
</td>
</tr>
</tbody>
</table>

2. 消息列表相关的菜单的资源设置如下表所示：

<table>
<thead>
<tr>
<td>
<p>分类</p>
</td>
<td width="348">
<p>资源名称</p>
</td>
<td width="81">
<p>说明</p>
</td>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2">
<p>长按消息菜单（微信样式 PopupWindow）</p>
</td>
<td width="348">
<p>uikit_shape_popup_radius_8</p>
</td>
<td width="81">
<p>菜单容器背景：圆角/背景色/描边</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_ic_arrow</p>
</td>
<td width="81">
<p>气泡箭头</p>
</td>
</tr>
<tr>
<td rowspan="11">
<p>菜单项默认图标</p>
</td>
<td width="348">
<p>uikit_chat_item_menu_copy</p>
</td>
<td width="81">
<p>复制菜单图标</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_item_menu_reply</p>
</td>
<td width="81">
<p>回复菜单图标</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_item_menu_unsent</p>
</td>
<td width="81">
<p>撤回菜单图标</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_item_menu_edit</p>
</td>
<td width="81">
<p>编辑菜单图标</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_item_menu_delete</p>
</td>
<td width="81">
<p>删除菜单图标</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_item_menu_report</p>
</td>
<td width="81">
<p>举报菜单图标</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_item_menu_translation</p>
</td>
<td width="81">
<p>翻译菜单图标</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_item_menu_forward</p>
</td>
<td width="81">
<p>转发菜单图标</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_item_menu_multi</p>
</td>
<td width="81">
<p>多选菜单图标</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_item_menu_topic</p>
</td>
<td width="81">
<p>话题菜单图标</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_item_menu_location</p>
</td>
<td width="81">
<p>位置菜单图标</p>
</td>
</tr>
<tr>
<td rowspan="6">
<p>Reaction（表情回复）</p>
</td>
<td width="348">
<p>uikit_chat_message_menu_reaction_item_bg_selector</p>
</td>
<td width="81">
<p>表情菜单item背景选择器</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_message_reaction_item_bg_selector</p>
</td>
<td width="81">
<p>消息气泡下方reaction气泡背景选择器</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_message_reaction_tab_item_bg_selector</p>
</td>
<td width="81">
<p>更多表情tab item背景选择器</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_emoji_item_bg_selector</p>
</td>
<td width="81">
<p>更多表情面板item背景选择器</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_emoji_delete_button_bg</p>
</td>
<td width="81">
<p>表情删除按钮背景</p>
</td>
</tr>
<tr>
<td width="348">
<p>uikit_chat_emoji_pager_send_btn_selector</p>
</td>
<td width="81">
<p>表情面板发送按钮背景选择器</p>
</td>
</tr>
</tbody>
</table>


:::tip
同名覆盖属于“资源层替换”，适合做 UI 资源替换与结构调整。如果你需要基于消息类型做更强的业务逻辑控制，建议通过自定义 Row/ViewHolder（自定义 `ChatUIKitMessagesAdapter` / `ChatUIKitViewHolderFactory`）实现。
:::


## 可重写方法标记

标记为 open / override fun的方法均可被子类重写方法。如有需要，可重写对应方法实现自己业务逻辑。

