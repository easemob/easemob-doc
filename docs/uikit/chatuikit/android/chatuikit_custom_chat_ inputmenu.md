
# 设置底部输入框

消息底部输入框 `ChatUIkitinputMenu` 实现各类消息的输入和发送以及消息表情等功能，包括两部分：

- 底部输入菜单 `ChatUlKitPrimaryMenu`：负责文本与语音消息的输入、发送，支持表情添加及常用功能扩展。
- 消息扩展菜单 `ChatUlKitExtendMenu`：提供附件类型消息的发送入口，支持发送图片、视频、文件，并可扩展至自定义消息类型（如名片消息等）。

// TODO：添加底部输入框的图，分为底部输入菜单+消息扩展菜单。

## 设置底部输入框背景

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

你可以获取 `ChatUIKitInputMenu` 对象，对输入菜单进行如下操作：

| 自定义配置 | 描述 |
|---------|------|
| 自定义菜单布局 | 支持替换或扩展输入菜单中的功能模块。 |
| 管理表情与扩展功能 | 可动态设置、显示或隐藏自定义表情面板及扩展功能菜单。 |
| 定制顶部区域 | 支持设置自定义的菜单顶部布局，包括引用回复条与多选消息工具条。 |
| 界面区域控制 | 可选择仅显示菜单顶部区域，隐藏底部输入与扩展面板部分。 |

  // TODO：添加顶部区域截图
  // TODO：顶部扩展区域还是顶部区域？  研发
  // TODO：表情功能还是表情面板？   研发

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom_chat_input_bar.png" title="设置输入菜单" />
</ImageGallery>

示例代码如下：

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

| 方法                         | 描述                                                         |
| :--------------------------- | :----------------------------------------------------------- |
| `setCustomPrimaryMenu()`     | 设置自定义底部输入菜单，支持 View 或 Fragment 形式。   |
| `setCustomEmojiconMenu()`    | 设置自定义表情功能，支持 View 或 Fragment 形式。             |
| `setCustomExtendMenu()`      | 设置自定义扩展功能功能，支持 View、Dialog 或 Fragment 形式。 |
| `setCustomTopExtendMenu()`   | 设置自定义顶部扩展布局，支持 View 或 Fragment 形式。         |
| `hideExtendContainer()`      | 隐藏扩展功能区域，包括表情区域和消息扩展菜单区域。               |
| `hideInputMenu()`            | 隐藏除顶部区域外的输入菜单界面。                     |
| `showEmojiconMenu()`         | 显示表情功能区域。                                           |
| `showExtendMenu()`           | 显示扩展功能区域。                                           |
| `showTopExtendMenu()`        | 显示顶部扩展区域。                                           |
| `setChatInputMenuListener()` | 设置输入菜单事件监听器。                                     |
| `chatPrimaryMenu`            | 获取底部输入菜单操作接口。                                   |
| `chatEmojiMenu`              | 获取表情面板操作接口。                                       |
| `chatExtendMenu`             | 获取扩展功能菜单操作接口。                                   |
| `chatTopExtendMenu`          | 获取顶部扩展区域操作接口。                                   |

### 设置相关操作

#### 获取并操作底部输入菜单

你可以获取 `IChatPrimaryMenu` 对象，对底部输入菜单进行自定义操作：

```kotlin
val primaryMenu: IChatPrimaryMenu? = binding?.layoutChat?.chatInputMenu?.chatPrimaryMenu
```

`IChatPrimaryMenu` 提供如下方法：

| 方法                | 描述                                     |
| ------------------- | ----------------------------------------- |
| `onTextInsert()`      | 在光标位置插入文本。                          |
| `editText`           | 获取输入框对象。                     |
| `setMenuBackground()` | 设置菜单背景。                            |

#### 设置输入框默认文本

可通过 `UIKitChatFragment.Builder` 设置输入框占位文本：

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setChatInputMenuHint(inputMenuHint)
        .build()
```

#### 监听输入内容变化 

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setOnChatInputChangeListener(onChatInputChangeListener) 
        .build()
```

#### 管理表情面板

1. 获取表情菜单对象。

```kotlin
val emojiconMenu: IChatEmojiconMenu? = binding?.layoutChat?.chatInputMenu?.chatEmojiMenu
```

2. 添加或移除自定义表情。

- **单个表情**：对应 `ChatUIKitEmojicon` 对象，必须归属于某个表情分组的 `emojiconList`。
- **表情分组**：对应 `ChatUIKitEmojiconGroupEntity`，代表表情面板中的一个 Tab 页（包含一组表情网格）。// TODO：原文是 “`ChatUIKitEmojiconGroupEntity` 对应表情面板的一个分组（一个 Tab + 分页网格）”
- **分组管理**：表情面板的增删操作以分组为单位进行。

：：：tip
表情分组 Tab（组 icon）默认不展示。ChatUIKit 的默认样式 `ease_chat_emoji_scroll_tabbar_style` 将 TabBar 的 `visibility` 设为了 `gone`。因此，即使只有 1 个组或有多个组，运行时 Tab icon 也可能不可见。
:::

`IChatEmojiconMenu` 提供如下方法：

| 方法                  | 描述               |
| --------------------- | ------------------ |
| `addEmojiconGroup()`    | 添加自定义表情分组。     |
| `removeEmojiconGroup()` | 移除指定的表情组。   |

示例代码如下：

```kotlin
val emojiconMenu: IChatEmojiconMenu? = binding?.layoutChat?.chatInputMenu?.chatEmojiMenu

// 1. 添加自定义表情组（组内包含多个 ChatUIKitEmojicon）
val customGroup = EmojiconExampleGroupData.getData() // ChatUIKitEmojiconGroupEntity
emojiconMenu?.addEmojiconGroup(customGroup)

// （可选）显示表情分组 Tab
emojiconMenu?.setTabBarVisibility(true)

// 2. 移除表情组（按 position 移除）
// 注意：默认系统表情组位于 position = 0，新增的第一个自定义组位于 position = 1。
emojiconMenu?.removeEmojiconGroup(1)

// （可选）移除后若只剩一个分组，可隐藏 TabBar
// emojiconMenu?.setTabBarVisibility(false)
```

## 设置消息扩展菜单

消息扩展菜单提供发送附件类型消息（如图片、视频、文件）、位置消息以及自定义消息的快捷入口。点击底部输入菜单中的扩展图标（默认为加号）会弹出消息扩展菜单。

// TODO：添加图

### 设置菜单样式风格

消息扩展菜单支持以下两种样式风格：

- 微信风格样式：

```kotlin
ChatUIKitClient.getConfig()?.chatConfig?.enableWxMessageStyle = true
```

- UIActionSheet 风格样式：

```kotlin
ChatUIKitClient.getConfig()?.chatConfig?.enableWxMessageStyle = false
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/message_types_1.png" title="UIActionSheet" />
  <ImageItem src="/images/uikit/chatuikit/android/message_types_2.png" title="类似微信样式" />
</ImageGallery>

### 管理扩展菜单项

你可以通过获取到的 `chatExtendMenu` 对象来动态管理扩展菜单项，包括添加、移除、排序以及处理点击事件等操作。

```kotlin
val chatExtendMenu: IChatExtendMenu? = binding?.layoutChat?.chatInputMenu?.chatExtendMenu
```

`IChatExtendMenu` 提供以下方法：

| 方法                                    | 描述                                                 |
| -------------------------------------- | ---------------------------------------------------- |
| `clear()`            | 清空所有扩展菜单项。   |
| `setMenuOrder()`     | 设置指定菜单项的显示顺序。 |
| `registerMenuItem()` | 添加新菜单项。         |

示例代码如下：

```kotlin
val chatExtendMenu: IChatExtendMenu? = binding?.layoutChat?.chatInputMenu?.chatExtendMenu

// 1. 清空所有扩展菜单项（包含默认的“拍照/相册/视频/文件”等）
chatExtendMenu?.clear()

// 2. 添加菜单项（可复用默认 itemId，或使用自定义的 itemId）
// 复用默认 itemId 可以沿用 UIKitChatFragment 默认的 onChatExtendMenuItemClick 分支中的点击处理逻辑。
chatExtendMenu?.registerMenuItem(
    nameRes = R.string.uikit_attach_take_pic,
    drawableRes = R.drawable.uikit_chat_takepic_selector, // 可替换为自定义图标
    itemId = R.id.extend_item_take_picture,
    order = 0  // order 值越小，排列越靠前
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

// 添加自定义菜单项（需现在你的 App 工程里定义 id，例如 res/values/ids.xml）
// <item name="extend_item_custom" type="id"/>
chatExtendMenu?.registerMenuItem(
    name = "自定义",
    drawableRes = R.drawable.ic_your_custom, // 替换为你的图标资源
    itemId = R.id.extend_item_custom,
    order = 300
)

// 3. 调整菜单项顺序，例如，调整“文件”项的顺序（order 越小越靠前）
chatExtendMenu?.setMenuOrder(R.id.extend_item_file, 50)
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom msg_type_list.png" title="消息类型扩展" />
</ImageGallery>

### 监听消息扩展菜单点击事件 

你可以通过以下两种方式监听消息扩展菜单项的点击事件：

**方式一：通过 `UIKitChatFragment.Builder` 设置监听器**

```kotlin
// conversationID：单聊为对端用户ID，群聊为群组ID。
// easeChatType：聊天类型，单聊为 `SINGLE_CHAT`，群聊为 `GROUP_CHAT`。
UIKitChatFragment.Builder(conversationID, easeChatType)
    .setOnChatExtendMenuItemClickListener(listener)  // 设置消息扩展菜单点击监听器
    .build()
```

**方式二：在自定义 Fragment 中重写点击方法**

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

输入菜单支持多种事件监听，可通过 `UIKitChatFragment.Builder` 进行配置：

```kotlin
// conversationID: 单聊为对端用户的用户 ID，群聊为群组 ID。
// easeChatType: 单聊和群聊分别为 SINGLE_CHAT 和 GROUP_CHAT。
UIKitChatFragment.Builder(conversationID, easeChatType)
        .setOnChatInputChangeListener(onChatInputChangeListener)   // 设置输入变化监听器
        .setChatInputMenuListener()  // 设置输入菜单监听器
        .setOnChatExtendMenuItemClickListener // 消息扩展菜单操作监听器
        .build()
```

## 自定义样式与资源

对于底部输入菜单，你可以通过覆盖同名资源文件（`drawable`/`layout`/`values`）来修改底部输入框的图标、文字、颜色等样式。

### 常用图标替换
 
对于底部输入菜单中的常用功能图标，可在 App 工程中创建同名 drawable 资源进行替换：

| 功能描述                 | 资源 ID                                        |
| :----------------------- | :--------------------------------------------- |
| 语音切换按钮（小麦克风） | `uikit_chat_primary_menu_setmode_voice_btn`    |
| 表情按钮（笑脸）         | `uikit_chatting_emoji_btn_normal`              |
| 扩展按钮（加号）         | `uikit_chat_primary_menu_more_button_selector` |

:::tip
 - **键盘切换图标**：`uikit_chat_primary_menu_setmode_keyboard_btn`（语音模式下切回键盘的图标）。
 - 如需实现“加号/发送按钮”按钮的形态随状态变化，建议替换对应的 **selector drawable** 资源。
:::

### 可同名覆盖的 drawable

可同名覆盖的 drawable，按子模块可划分为以下类别：

| 类别                                                       | 资源                                                         |
| :--------------------------------------------------------- | :----------------------------------------------------------- |
| InputMenu 容器                                             | - `uikit_live_input_cursor_bg`：输入光标背景 <br/> - `uikit_dialog_input_bg`：部分输入类弹窗背景 |
| PrimaryMenu（输入栏）                                      | - `uikit_chat_primary_menu_setmode_voice_btn`：语音切换按钮（小麦克风） <br/> - `uikit_chat_primary_menu_setmode_keyboard_btn`：键盘切换图标 <br/> - `uikit_chatting_emoji_btn_normal`：表情按钮（笑脸） <br/> - `uikit_chat_primary_menu_more_button_selector`：加号/更多 <br/> - `uikit_chat_primary_menu_send_btn_selector`：发送按钮背景 <br/> - `uikit_chat_input_primary_send_icon`：发送图标 <br/> - `uikit_chat_primary_menu_input_bg`：输入框背景 |
| ExtendMenu（更多菜单）                                     | - `uikit_chat_takepic_selector`：拍照 <br/> - `uikit_chat_image_selector`：相册 <br/> - `em_chat_video_selector`：视频 <br/> - `em_chat_file_selector`：文件 <br/> - `em_chat_card_selector`：名片 <br/> - `uikit_chat_extend_menu_wxstyle_bg`：微信风格：单个功能 icon 背景块 <br/> - `uikit_chat_menu_extend_indicator_selector`：分页指示点 <br/> - `uikit_chat_extend_menu_indicator_divider`：分页指示点间隔 |
| EmojiMenu（表情面板）                                      | - `uikit_chat_emoji_item_bg_selector`：表情 item 背景 <br/> - `uikit_chat_emoji_delete_button_bg`：删除/退格按钮背景 <br/> - `uikit_chat_emoji_pager_send_btn_selector`：发送按钮背景 <br/> - `uikit_dot_emojicon_selected` / `uikit_dot_emojicon_unselected`：分页圆点 <br/> - `uikit_chat_emoji_send`：表情面板发送图标 <br/> - `uikit_chat_emoji_backspace`：表情面板退格图标 <br/> - `uikit_icon_arrow_left_thick`：当前默认的退格箭头图标 |
| TopExtendMenu（菜单顶部扩展区域：引用回复条 / 多选工具条） | - `uikit_widget_chat_message_reply_background`：引用条整体背景 <br/> - `uikit_chat_quote_default_image`：引用图片默认占位 <br/> - `uikit_chat_quote_icon_cancel`：取消引用 <br/> - `uikit_chat_quote_icon_image` / `uikit_chat_quote_icon_video` / `uikit_chat_quote_icon_voice` <br/> - `uikit_chat_quote_icon_file` / `uikit_chat_quote_icon_user_card` / `uikit_chat_quote_icon_combine` <br/> - `uikit_video_play_btn_small_nor`：引用视频播放按钮 |

### 可同名覆盖的布局

如果需要移除控件、重排布局、插入新控件等结构性调整，可在 App 工程中同名覆盖以下布局（或按需选择覆盖）：

| 类别                              | 布局                                               |
| :------------------------------------ | :----------------------------------------------------------- |
| InputMenu 容器骨架                | `layout/uikit_widget_chat_input_menu_container.xml`          |
| PrimaryMenu（输入栏）            | `layout/uikit_widget_chat_primary_menu.xml`                  |
| ExtendMenu（更多菜单）            | - `layout/uikit_layout_chat_extend_menu.xml`：网格分页<br/> -  `layout/uikit_chat_menu_item.xml`：网格 item：微信风格<br/> -  `layout/uikit_chat_extend_indicator_item.xml`：分页指示点 item<br/> -  `layout/uikit_dialog_menu.xml`：UIActionSheet 弹窗容器<br/> -  `layout/uikit_chat_menu_item_horizontal.xml`：弹窗横向 item<br/> -  `layout/uikit_item_menu.xml`：通用横向 item |
| EmojiMenu（表情面板）            | - `layout/uikit_widget_chat_emojicon.xml` <br/> - `layout/uikit_widget_emojicon_tab_bar.xml`<br/> -  `layout/uikit_chat_emoji_scroll_tab_item.xml`<br/> -  `layout/uikit_chat_emoji_expression_gridview.xml`<br/> -  `layout/uikit_row_chat_emoji_expression.xml`<br/> -  `layout/uikit_row_chat_emoji_big_expression.xml` |
| TopExtendMenu（菜单顶部扩展区域） | - `layout/uikit_widget_chat_message_reply.xml`：引用回复条<br/> -  `layout/uikit_layout_chat_messages_multi_select_menu.xml`：多选工具条 |

### 可同名覆盖的设置

可同名覆盖的设置指对文字、开关和样式的调整：

| 类别                            | 资源与配置说明                                                |
| :------------------------------ | :----------------------------------------------------------- |
| 常用文案                    | - `uikit_chat_primary_menu_button_send`：发送按钮 <br/> - `uikit_chat_primary_menu_button_pushtotalk`：按住说话提示 `uikit_chat_primary_menu_input_hint`：输入框占位文本<br/> -  `uikit_attach_take_pic`/`uikit_attach_picture`/`uikit_attach_video`/`uikit_attach_file`/`uikit_attach_contact_card`：“更多”菜单选项文案<br/> - `uikit_chat_inputmenu_quote_reply_to`：引用回复条前缀 “Replying to” |
| 输入菜单交互行为           | - `ease_input_show_send_button`：控制输入内容时是否显示发送按钮 <br/> - `ease_input_edit_text_max_lines`：设置输入框最大显示行数 |
| 视觉样式（字号/间距/颜色/背景等属性） | - PrimaryMenu：`ease_chat_primary_menu_*` <br/> - ExtendMenu：`ease_chat_extend_menu_*` <br/> - EmojiMenu：`ease_chat_emoji_*` <br/> - 引用回复条：`ease_chat_message_reply_*` |

// TODO：`uikit_chat_primary_menu_button_pushtotalk`（按住说话）// TODO：点击录音？


## 可重载方法标记

其他标记为 open / override fun 的方法均为可重载方法。如有需要，可重载对应方法实现自己业务逻辑。
