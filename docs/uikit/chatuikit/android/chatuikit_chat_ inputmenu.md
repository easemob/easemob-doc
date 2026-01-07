
# 设置底部输入框

消息底部输入框 `ChatUIkitinputMenu` 实现各类消息的输入和发送以及消息表情等功能，包括两部分：

- 底部输入菜单 `ChatUlKitPrimaryMenu`：输入和发送文本和语音消息、添加表情以及扩展功能等。
- 扩展菜单 `ChatUlKitExtendMenu`：发送附件类型消息，例如，图片、视频、文件以及自定义类型消息（如名片消息）等。


// TODO：添加底部输入框的图，分为底部输入菜单+扩展菜单。

## 设置底部输入框的背景

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setChatInputMenuBackground(inputMenuBackground) 
        .build()
```

## 设置底部输入菜单

// TODO：添加截图

### 设置相关属性

你可以自定义底部输入菜单。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom_chat_input_bar.png" title="设置输入菜单" />
</ImageGallery>

你可以获取 `ChatUIKitInputMenu` 对象，对输入菜单进行如下操作：

- 设置自定义的菜单
- 设置和隐藏自定义表情和扩展功能
- 设置自定义的菜单顶部布局      // TODO：写明自定义的菜单顶部布局包括引用回复条+多选消息工具条，然后添加截图？
- 隐藏除菜单顶部区域外的区域   

// TODO：“除菜单顶部区域外的区域” 直接写明是“隐藏底部输入菜单+扩展菜单”？
// TODO："自定义的菜单顶部布局"

答：自定义的菜单顶部布局 当前库里它典型承载的就是：
引用回复条（Quote/Reply View）：ChatUIKitExtendMessageReplyView 会作为 topExtendMenu 被塞进去（见 ChatUIKitMessageReplyController 里 inputMenu.setCustomTopExtendMenu(quoteView)）。
多选消息工具条：ChatUIKitMultipleSelectMenuView 进入多选模式时也会作为 topExtendMenu 放到这里。具体见截图，上官网可以找设计另外给做一个图
看完删掉这块解释

```kotlin
    val chatInputMenu: ChatUIKitInputMenu? = binding?.layoutChat?.chatInputMenu

    chatInputMenu?.let{
        it.setCustomPrimaryMenu()           //设置自定义的输入菜单，支持 View 和 Fragment 两种方式 
        it.setCustomEmojiconMenu()          //设置自定义的表情功能，支持 View 和 Fragment 两种方式  
        it.setCustomExtendMenu()            //设置自定义的扩展功能，支持 View、Dialog 和 Fragment 三种方式 
        it.setCustomTopExtendMenu()         //设置自定义的菜单顶部布局，支持 View 和 Fragment 两种方式 

        it.hideInputMenu()                  //隐藏除了菜单顶部区域外的区域   
        it.hideExtendContainer()            //隐藏扩展区域，包括表情区域和扩展功能区域 

        it.chatPrimaryMenu                  //获取菜单项接口
        it.chatExtendMenu                   //获取扩展功能接口  
        it.chatEmojiMenu                    //获取表情功能菜单接口   

    }

    //例如，设置自定义的扩展功能
    val menuDialog = ChatUIKitExtendMenuDialog(mContext)
    binding?.layoutChat?.chatInputMenu?.setCustomExtendMenu(menuDialog)
```

`ChatUIKitInputMenu` 提供了如下方法：

| 方法                       | 描述                                                         |
| -------------------------- | ------------------------------------------------------------ |
| `setCustomPrimaryMenu()`     | 设置自定义的菜单，支持 View 和 Fragment 两种方式。 |
| `setCustomEmojiconMenu()`    | 设置自定义的表情功能，支持 View 和 Fragment 两种方式。        |
| `setCustomExtendMenu()`      | 设置自定义的扩展功能，支持 View ，Dialog 和 Fragment 三种方式。 |
| `setCustomTopExtendMenu()`   | 设置自定义的菜单顶部布局，支持 View，Fragment 两种方式。 |
| `hideExtendContainer()`      | 隐藏扩展区域，包括表情区域和扩展功能区域。                     |
| `hideInputMenu()`            | 隐藏除了菜单顶部区域外的区域。                     |
| `showEmojiconMenu()`         | 展示表情功能区域。                                             |
| `showExtendMenu()`           | 展示扩展功能区域。                                             |
| `showTopExtendMenu()`        | 展示顶部扩展功能区域。                                          |
| `setChatInputMenuListener()` | 设置输入菜单监听。                                             |
| `chatPrimaryMenu`           | 获取菜单项接口。                                               |
| `chatEmojiMenu`             | 获取表情功能菜单接口。                                         |
| `chatExtendMenu`            | 获取扩展功能接口。                                             |
| `chatTopExtendMenu`        | 获取顶部扩展功能接口。                                            |

### 设置相关操作

- 获取输入菜单项对象，进行相关操作：

```kotlin
val primaryMenu: IChatPrimaryMenu? = binding?.layoutChat?.chatInputMenu?.chatPrimaryMenu
```

`IChatPrimaryMenu` 提供如下方法：

| 方法                | 描述                                     |
| ------------------- | ----------------------------------------- |
| `onTextInsert()`      | 在光标处插入文本。                          |
| `editText`           | 获取菜单输入框对象。                     |
| `setMenuBackground()` | 设置菜单的背景。                            |

- 设置输入文本框中的默认文本：

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setChatInputMenuHint(inputMenuHint)
        .build()
```

- 设置输入变更监听： 

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setOnChatInputChangeListener(onChatInputChangeListener) 
        .build()
```

- 添加和移除表情：

1. 获取表情菜单对象。

```kotlin
val emojiconMenu: IChatEmojiconMenu? = binding?.layoutChat?.chatInputMenu?.chatEmojiMenu
```

2. 添加或移除自定义表情。

单个表情指 `ChatUIKitEmojicon`，必须归属在某个 `ChatUIKitEmojiconGroupEntity` 的 `emojiconList` 中。`ChatUIKitEmojiconGroupEntity` 对应表情面板的一个分组（一个 Tab + 分页网格），面板的增删接口以分组为单位。

：：：tip
表情分组 Tab（组 icon）默认不展示。ChatUIKit 的默认样式 `ease_chat_emoji_scroll_tabbar_style` 将 TabBar 的 `visibility` 设为了 `gone`。因此，即使只有 1 个组或有多个组，运行时你也可能看不到 Tab icon。
:::

`IChatEmojiconMenu` 提供了如下方法：

| 方法                  | 描述               |
| --------------------- | ------------------ |
| `addEmojiconGroup()`    | 添加自定义表情组。     |
| `removeEmojiconGroup()` | 移除指定的表情组。   |

示例代码如下：

```kotlin
val emojiconMenu: IChatEmojiconMenu? = binding?.layoutChat?.chatInputMenu?.chatEmojiMenu

// 1. 添加一个自定义表情组（组内包含多个 ChatUIKitEmojicon）
val customGroup = EmojiconExampleGroupData.getData() // ChatUIKitEmojiconGroupEntity
emojiconMenu?.addEmojiconGroup(customGroup)

// （可选）如果你希望展示“表情分组 Tab（组 icon）”，需要手动打开开关。
emojiconMenu?.setTabBarVisibility(true)

// 2. 移除表情组（按 position 移除）
// 注意：removeEmojiconGroup(position) 是“按组移除”，不是移除单个表情。
// 通常默认系统表情组在 position = 0，你新增的第一个组在 position = 1（即：加在默认组后面）。
emojiconMenu?.removeEmojiconGroup(1)

// （可选）移除后若只有 1 个表情组，你也可以选择隐藏 TabBar。
// emojiconMenu?.setTabBarVisibility(false)
```

// TODO：可以移掉下面的吧~
- 显示或隐藏表情分组 Tab

 ```kotlin
 val emojiconMenu: IChatEmojiconMenu? = binding?.layoutChat?.chatInputMenu?.chatEmojiMenu
 // 显示/隐藏表情分组 Tab（组 icon）
 emojiconMenu?.setTabBarVisibility(true)
 // 仅有一个组时可选择隐藏（需要你自己知道当前组数量）
 // emojiconMenu?.setTabBarVisibility(groupList.size > 1)
```

## 设置扩展菜单

发送附件类型消息（例如，图片、视频、文件）、位置消息或自定义类型消息，点击了底部输入菜单中的扩展图标（默认为加号），会弹出扩展菜单。

// TODO：添加图

### 设置菜单的风格样式

扩展菜单风格包括以下两种：

- 实现类似微信样式的菜单：

```kotlin
ChatUIKitClient.getConfig()?.chatConfig?.enableWxMessageStyle = true
```

- 实现仿系统 UIActionSheet 样式的菜单：

```kotlin
ChatUIKitClient.getConfig()?.chatConfig?.enableWxMessageStyle = false
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/message_types_1.png" title="UIActionSheet" />
  <ImageItem src="/images/uikit/chatuikit/android/message_types_2.png" title="类似微信样式" />
</ImageGallery>

### 设置扩展菜单项

```kotlin
val chatExtendMenu: IChatExtendMenu? = binding?.layoutChat?.chatInputMenu?.chatExtendMenu
```

获取到 `chatExtendMenu` 对象后，对于扩展功能可以进行添加、移除、排序以及处理扩展功能的点击事件等。

`IChatExtendMenu` 提供的方法如下表所示：

| 方法                                    | 描述                                                 |
| -------------------------------------- | ---------------------------------------------------- |
| `clear()`            | 清除所有的扩展菜单项。   |
| `setMenuOrder()`     | 对指定的菜单项进行排序。 |
| `registerMenuItem()` | 添加新的菜单项。         |

示例代码如下：

```kotlin
val chatExtendMenu: IChatExtendMenu? = binding?.layoutChat?.chatInputMenu?.chatExtendMenu

// 1. 清空所有扩展菜单项（包含默认的“拍照/相册/视频/文件”等）
chatExtendMenu?.clear()

// 2. 添加菜单项（可复用默认 itemId，也可用你自定义的 itemId）
// 复用默认 itemId 的好处：UIKitChatFragment 默认的 onChatExtendMenuItemClick 分支里已经处理了这些 id。
chatExtendMenu?.registerMenuItem(
    nameRes = R.string.uikit_attach_take_pic,
    drawableRes = R.drawable.uikit_chat_takepic_selector, // 也可替换成你自己的图标
    itemId = R.id.extend_item_take_picture,
    order = 0
)
chatExtendMenu?.registerMenuItem(
    nameRes = R.string.uikit_attach_picture,
    drawableRes = R.drawable.uikit_chat_image_selector,
    itemId = R.id.extend_item_picture,
    order = 100
)
chatExtendMenu?.registerMenuItem(
    nameRes = R.string.uikit_attach_file,
    drawableRes = R.drawable.em_chat_file_selector,
    itemId = R.id.extend_item_file,
    order = 200
)

// 添加一个自定义菜单项（建议在你的 App 工程里先定义一个 id，例如 res/values/ids.xml）
// <item name="extend_item_custom" type="id"/>
chatExtendMenu?.registerMenuItem(
    name = "自定义",
    drawableRes = R.drawable.ic_your_custom, // TODO：替换为你的资源 
    itemId = R.id.extend_item_custom,
    order = 300
)

// 3. 调整已存在菜单项的排序（order 越小越靠前）
chatExtendMenu?.setMenuOrder(R.id.extend_item_file, 50)
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom msg_type_list.png" title="消息类型扩展" />
</ImageGallery>

### 监听扩展菜单点击事件 

开发者可以利用 `UIKitChatFragment#Builder#setOnChatExtendMenuItemClickListener` 进行监听，也可以在自定义的 `Fragment` 中重写 `onChatExtendMenuItemClick` 方法。

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

## 事件监听

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setOnChatInputChangeListener(onChatInputChangeListener)   // 设置输入变更监听器
        .setChatInputMenuListener()  // 设置输入菜单监听器
        .setOnChatExtendMenuItemClickListener // 扩展菜单操作监听器
        .build()
```

## 相关资源

对于底部输入框中的相关图标、文字、颜色等资源，你可以在 App 工程中放置同名资源（`drawable`/`layout`/`values`）来覆盖 UIKit 默认实现，达到替换资源与自定义样式的目的。

### 常用图标
 
对于底部输入菜单 `ChatUlKitPrimaryMenu` 中的语音、表情和加号图标，可以在 App 工程中通过 **同名覆盖 drawable** 直接替换：

- **语音切换按钮（小麦克风）**：`uikit_chat_primary_menu_setmode_voice_btn`
- **表情按钮（笑脸）**：`uikit_chatting_emoji_btn_normal`
- **扩展按钮（加号）**：`uikit_chat_primary_menu_more_button_selector`

:::tip
 - **键盘切换图标**：`uikit_chat_primary_menu_setmode_keyboard_btn`（语音模式下切回键盘的图标）。
 - 如果你希望“加号/发送按钮”的形态随状态变化，通常覆盖的是它们的 **selector drawable**（如上所示）。// TODO：这个是哪里？
:::

### 可同名覆盖的 drawable

可同名覆盖的 drawable，按子模块可划分为以下类别：

- **InputMenu 容器**
  - `uikit_live_input_cursor_bg`（输入光标背景）
  - `uikit_dialog_input_bg`（部分输入类弹窗背景）

- **PrimaryMenu（输入栏）**
  - `uikit_chat_primary_menu_setmode_voice_btn`：语音切换按钮（小麦克风）
  - `uikit_chat_primary_menu_setmode_keyboard_btn`：键盘切换图标
  - `uikit_chatting_emoji_btn_normal`：表情按钮（笑脸）
  - `uikit_chat_primary_menu_more_button_selector`（加号/更多）
  - `uikit_chat_primary_menu_send_btn_selector`（发送按钮背景）
  - `uikit_chat_input_primary_send_icon`（发送图标）
  - `uikit_chat_primary_menu_input_bg`（输入框背景）

- **ExtendMenu（更多菜单）**
  - `uikit_chat_takepic_selector`（拍照）
  - `uikit_chat_image_selector`（相册）
  - `em_chat_video_selector`（视频）
  - `em_chat_file_selector`（文件）
  - `em_chat_card_selector`（名片）
  - `uikit_chat_extend_menu_wxstyle_bg`（微信风格：单个功能 icon 背景块）
  - `uikit_chat_menu_extend_indicator_selector`（分页指示点）
  - `uikit_chat_extend_menu_indicator_divider`（分页指示点间隔）

- **EmojiMenu（表情面板）**
  - `uikit_chat_emoji_item_bg_selector`（表情 item 背景）
  - `uikit_chat_emoji_delete_button_bg`（删除/退格按钮背景）
  - `uikit_chat_emoji_pager_send_btn_selector`（发送按钮背景）
  - `uikit_dot_emojicon_selected` / `uikit_dot_emojicon_unselected`（分页圆点）
  - `uikit_chat_emoji_send`（表情面板发送图标）
  - `uikit_chat_emoji_backspace`（表情面板退格图标）
  - `uikit_icon_arrow_left_thick`（当前默认的退格箭头图标）

- **TopExtendMenu（菜单顶部扩展区域：引用回复条 / 多选工具条）**
  - **引用回复条（Quote/Reply）** // TODO：quote 或 reply 应统一？
    - `uikit_widget_chat_message_reply_background`（引用条整体背景）
    - `uikit_chat_quote_default_image`（引用图片默认占位）
    - `uikit_chat_quote_icon_cancel`（取消引用）
    - `uikit_chat_quote_icon_image` / `uikit_chat_quote_icon_video` / `uikit_chat_quote_icon_voice`
    - `uikit_chat_quote_icon_file` / `uikit_chat_quote_icon_user_card` / `uikit_chat_quote_icon_combine`
    - `uikit_video_play_btn_small_nor`（引用视频播放按钮）

// TODO：删掉上面的
| 类别                                                       | 资源                                                         |
| :--------------------------------------------------------- | :----------------------------------------------------------- |
| InputMenu 容器                                             | - `uikit_live_input_cursor_bg`：输入光标背景 <br/> - `uikit_dialog_input_bg`：部分输入类弹窗背景 |
| PrimaryMenu（输入栏）                                      | - `uikit_chat_primary_menu_setmode_voice_btn`：语音切换按钮（小麦克风） <br/> - `uikit_chat_primary_menu_setmode_keyboard_btn`：键盘切换图标 <br/> - `uikit_chatting_emoji_btn_normal`：表情按钮（笑脸） <br/> - `uikit_chat_primary_menu_more_button_selector`：加号/更多 <br/> - `uikit_chat_primary_menu_send_btn_selector`：发送按钮背景 <br/> - `uikit_chat_input_primary_send_icon`：发送图标 <br/> - `uikit_chat_primary_menu_input_bg`：输入框背景 |
| ExtendMenu（更多菜单）                                     | - `uikit_chat_takepic_selector`：拍照 <br/> - `uikit_chat_image_selector`：相册 <br/> - `em_chat_video_selector`：视频 <br/> - `em_chat_file_selector`：文件 <br/> - `em_chat_card_selector`：名片 <br/> - `uikit_chat_extend_menu_wxstyle_bg`：微信风格：单个功能 icon 背景块 <br/> - `uikit_chat_menu_extend_indicator_selector`：分页指示点 <br/> - `uikit_chat_extend_menu_indicator_divider`：分页指示点间隔 |
| EmojiMenu（表情面板）                                      | - `uikit_chat_emoji_item_bg_selector`：表情 item 背景 <br/> - `uikit_chat_emoji_delete_button_bg`：删除/退格按钮背景 <br/> - `uikit_chat_emoji_pager_send_btn_selector`：发送按钮背景 <br/> - `uikit_dot_emojicon_selected` / `uikit_dot_emojicon_unselected`：分页圆点 <br/> - `uikit_chat_emoji_send`：表情面板发送图标 <br/> - `uikit_chat_emoji_backspace`：表情面板退格图标 <br/> - `uikit_icon_arrow_left_thick`：当前默认的退格箭头图标 |
| TopExtendMenu（菜单顶部扩展区域：引用回复条 / 多选工具条） | - `uikit_widget_chat_message_reply_background`：引用条整体背景 <br/> - `uikit_chat_quote_default_image`：引用图片默认占位 <br/> - `uikit_chat_quote_icon_cancel`：取消引用 <br/> - `uikit_chat_quote_icon_image` / `uikit_chat_quote_icon_video` / `uikit_chat_quote_icon_voice` <br/> - `uikit_chat_quote_icon_file` / `uikit_chat_quote_icon_user_card` / `uikit_chat_quote_icon_combine` <br/> - `uikit_video_play_btn_small_nor`：引用视频播放按钮 |

### 可同名覆盖的 layout

如果需要移除控件、重排布局、插入新控件等结构性调整，可在 App 工程中同名覆盖以下布局（或按需选择覆盖）：

- **InputMenu 容器骨架**
  - `layout/uikit_widget_chat_input_menu_container.xml`
- **PrimaryMenu（输入栏）**
  - `layout/uikit_widget_chat_primary_menu.xml`
- **ExtendMenu（更多菜单）**
  - `layout/uikit_layout_chat_extend_menu.xml`（网格分页）
  - `layout/uikit_chat_menu_item.xml`（网格 item：微信风格）
  - `layout/uikit_chat_extend_indicator_item.xml`（分页指示点 item）
  - `layout/uikit_dialog_menu.xml`（UIActionSheet 弹窗容器）
  - `layout/uikit_chat_menu_item_horizontal.xml`（弹窗横向 item）
  - `layout/uikit_item_menu.xml`（通用横向 item）
- **EmojiMenu（表情面板）**  // TODO：下面的加上注释
  - `layout/uikit_widget_chat_emojicon.xml`
  - `layout/uikit_widget_emojicon_tab_bar.xml`
  - `layout/uikit_chat_emoji_scroll_tab_item.xml`
  - `layout/uikit_chat_emoji_expression_gridview.xml`
  - `layout/uikit_row_chat_emoji_expression.xml`
  - `layout/uikit_row_chat_emoji_big_expression.xml`
- **TopExtendMenu（菜单顶部扩展区域）**
  - `layout/uikit_widget_chat_message_reply.xml`（引用回复条）
  - `layout/uikit_layout_chat_messages_multi_select_menu.xml`（多选工具条）


### 可同名覆盖的值

可同名覆盖的值指对文字、开关和样式的调整：

- **strings（常用会改的）**  // TODO：常用的字符串？
  - `uikit_chat_primary_menu_button_send`（发送）
  - `uikit_chat_primary_menu_button_pushtotalk`（按住说话）// TODO：点击录音？
  - `uikit_chat_primary_menu_input_hint`（输入框占位）
  - `uikit_attach_take_pic` / `uikit_attach_picture` / `uikit_attach_video` / `uikit_attach_file` / `uikit_attach_contact_card`（更多菜单文案）
  - `uikit_chat_inputmenu_quote_reply_to`（引用回复条 “Replying to”）

- **bool / integer（PrimaryMenu 行为）** // TODO：底数输入菜单的行为？
  - `ease_input_show_send_button`（是否“有内容时显示发送按钮”）
  - `ease_input_edit_text_max_lines`（输入框最大行数）

- **styles（适合改字号/间距/颜色/背景）**
  - PrimaryMenu：`ease_chat_primary_menu_*`
  - ExtendMenu：`ease_chat_extend_menu_*`
  - EmojiMenu：`ease_chat_emoji_*`
  - 引用回复条：`ease_chat_message_reply_*`

## 可重载方法标记

其他标记为 open / override fun 的方法均为可重载方法。如有需要，可重载对应方法实现自己业务逻辑。
