# 消息列表的基本设置

消息列表是聊天界面的核心组件，基于 `ChatUIKitMessageListLayout` 实现。本文介绍如何通过 `UIKitChatFragment.Builder` 实现消息列表和消息条目的基本设置。

如需通过 `ChatUIKitMessageListLayout` 进行高级设置，详见 [消息列表的高级设置说明](chatuikit_custom_chat_advanced.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/chat_detail.png" title="完整的聊天页面 UIKitChatFragment" />
</ImageGallery>

## 概述

`UIKitChatFragment` 提供了 Builder 构建方式，方便开发者进行自定义设置。目前提供的设置项如下：

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
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

`UIKitChatFragment#Builder` 提供的方法如下表所示：

| 方法                                                         | 描述                           |
| :----------------------------------------------------------- | :--------------------------------- |
| `useTitleBar`                                         | 是否使用默认的标题栏（`ChatUIKitTitleBar`）。 <br/> - `true`：是。 <br/> - (默认) `false`: 否。<br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。     |
| `setTitleBarTitle`                                 | 设置标题栏的主标题。 <br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。      |
| `setTitleBarSubTitle`                           | 设置标题栏的副标题。 <br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。                  |
| `enableTitleBarPressBack`                             | 设置是否支持显示返回按钮，默认为不显示。<br/> - `true`：显示。<br/> - (默认) `false`: 不显示。<br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。  |
| `setTitleBarBackPressListener`         | 设置标题栏返回按钮点击监听器。       |
| `getHistoryMessageFromServerOrLocal`                 | 设置是否从服务器或本地获取历史消息。 |
| `setOnChatExtendMenuItemClickListener` | 设置聊天扩展菜单项点击监听器。       |
| `setOnChatInputChangeListener`   | 设置聊天输入变化监听器。             |
| `setOnMessageItemClickListener` | 设置消息项点击监听器。              |
| `setOnMessageSendCallBack`           | 设置消息发送回调。                   |
| `setOnWillSendMessageListener`     | 设置即将发送消息的监听器。          |
| `setOnChatRecordTouchListener`   | 设置聊天记录触摸监听器。             |
| `setOnModifyMessageListener`       | 设置修改消息监听器。                 |
| `setOnReportMessageListener`       | 设置举报消息监听器。                 |
| `setMsgTimeTextColor`                     | 设置消息时间文本颜色。               |
| `setMsgTimeTextSize`                       | 设置消息时间文本大小。               |
| `setReceivedMsgBubbleBackground` | 设置接收消息的气泡背景。             |
| `setSentBubbleBackground`             | 设置发送消息的气泡背景。             |
| `showNickname`                                       | 设置是否显示昵称。                       |
| `.hideReceiverAvatar`                                 | 设置是否隐藏接收者头像。                 |
| `.hideSenderAvatar`                                    | 设置是否隐藏发送者头像。                 |
| `setChatBackground`                         | 设置聊天界面背景。                   |
| `setChatInputMenuBackground`           | 设置聊天输入菜单背景。               |
| `setChatInputMenuHint`                       | 设置聊天输入菜单提示文本。           |
| `sendMessageByOriginalImage`                          | 是否发送原图。<br/> - `true`：是；<br/> - (默认) `false`: 否。                       |
| `setEmptyLayout`                | 设置空布局。                         |
| `setCustomAdapter`                           | 设置自定义适配器。                   |
| `setCustomFragment`                         | 设置自定义Fragment。                 |

## 设置消息列表背景

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setChatBackground(chatBackground)
        .build()
```

## 设置消息列表空页面

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setEmptyLayout(R.layout.layout_chat_empty)
        .build()
```

## 设置消息条目

对于消息条目 `ChatUlKitRow`，你可以进行自定义设置，例如：
- 设置默认的头像和昵称及其样式
- 设置消息气泡
- 设置消息日期


<div style="text-align: center">
  <img src=/images/uikit/chatuikit/android/message_item.png />
</div>

### 设置头像和昵称

你可以通过 `UIKitChatFragment#Builder` 设置头像和昵称。

关于使用自己的头像和昵称，详见 [用户自定义信息文档中的介绍](chatuikit_userinfo.html#设置会话头像和昵称)。

```kotlin
//com.hyphenate.easeui.feature.chat.activities.UIKitChatActivity
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
val fragment = UIKitChatFragment.Builder(conversationID, easeChatType)
    .showNickname(true)                 // 是否显示昵称：true：显示；(默认) false: 隐藏。
    .hideReceiverAvatar(false)          // 是否隐藏接收方头像：true：隐藏；（默认）false：显示。
    .hideSenderAvatar(false)            // 是否隐藏发送方头像：true：隐藏；false：显示。
    .build()

fragment?.let { fragment ->
                supportFragmentManager.beginTransaction().replace(binding.flFragment.id, fragment, getFragmentTag()).commit()
            }

```

除了 `UIKitChatFragment.Builder`，你还可以通过 `ChatUIKitMessageListLayout` 设置头像和昵称，详见 [消息列表的高级设置说明](chatuikit_custom_chat_advanced.html#设置头像和昵称)。

### 设置消息气泡

你可以通过 `UIKitChatFragment#Builder` 设置消息气泡。

<div style="text-align: center">
  <img src=/images/uikit/chatuikit/android/message_bubble.png width="400" />
</div>

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

除了 `UIKitChatFragment.Builder`，你可以通过 `chatMessageListLayout` 设置消息气泡，详见 [消息列表的高级设置说明](chatuikit_custom_chat_advanced.html#设置消息气泡)。

### 设置消息时间

你可以设置消息的发送和接收时间的格式和样式。

<div style="text-align: center">
  <img src=/images/uikit/chatuikit/android/message_time.png />
</div>

#### 设置消息时间格式

`ChatUIKitDateFormatConfig` 支持设置消息时间格式：

| 属性                  | 描述                                                                |
| --------------------- | ------------------------------------------------------------------- |
| `chatTodayFormat`    | 消息列表当天的时间格式，英文环境默认为："HH:mm"。                     |
| `chatOtherDayFormat`  | 消息列表其他日期的格式，英文环境默认为： "MMM dd, HH:mm"。          |
| `chatOtherYearFormat` | 消息列表其他年份的时间格式，英文环境默认为： "MMM dd, yyyy HH:mm"。 |

```kotlin
    // 日期语言区域切换（基于手机区域语言设置）默认值为 false 采用 ENGLISH。 
    // 举例：chatOtherDayFormat = "MMM dd, yyyy"  a.false: Sep 25, 2024  b.true(本地语言中文): 9月 25, 2024
    ChatUIKitClient.getConfig()?.dateFormatConfig?.useDefaultLocale = true  
    // 消息中当天的时间格式
    ChatUIKitClient.getConfig()?.dateFormatConfig?.chatTodayFormat = "HH:mm"
    // 消息中其他日期的时间格式
    ChatUIKitClient.getConfig()?.dateFormatConfig?.chatOtherDayFormat = "MMM dd, yyyy"
    // 消息中其他年份的时间格式
    ChatUIKitClient.getConfig()?.dateFormatConfig?.chatOtherYearFormat = "MMM dd, yyyy HH:mm"
```

#### 设置消息时间样式

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
Builder 不支持设置时间背景。若设置时间背景，需使用 `ChatUIKitMessageListLayout#setTimeBackground(Drawable?)` 或 设置 XML 属性 `ease_chat_item_time_background`，详见 [消息列表的高级设置说明](chatuikit_custom_chat_advanced.html#设置消息时间样式)。
:::

## 设置长按消息菜单

在消息列表中长按任意消息，即可弹出操作菜单，支持复制、回复、转发、置顶、多选、翻译、创建话题等丰富功能。

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
  <ImageItem src="/images/uikit/chatuikit/android/message_longpress_1.png" title="类似 UIActionSheet 样式" />
  <ImageItem src="/images/uikit/chatuikit/android/message_longpress_2.png" title="类似微信样式" />
</ImageGallery>

关于菜单项的添加、删除、显示/隐藏以及样式的设置，详见 [消息列表的高级设置说明](chatuikit_chat_list_avanced.html#设置长按消息菜单)。

## 设置消息事件监听

通过 `UIKitChatFragment#Builder` 可设置消息条目的各类交互事件监听，包括气泡区域及头像的点击与长按事件。

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

## 可重写方法标记

标记为 open / override fun的方法均可被子类重写方法。如有需要，可重写对应方法实现自己业务逻辑。

