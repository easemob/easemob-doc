# 设置消息列表

消息列表是聊天界面的核心组件，基于 `ChatUIKitMessageListLayout` 实现。本文介绍如何设置和自定义消息列表和消息列表 Item。

// TODO：添加图片，列明消息气泡等

## 设置头像和昵称

你可以通过 `ChatUIKitMessageListLayout` 设置头像和昵称。

关于使用自己的头像和昵称，详见 [用户自定义信息文档中的介绍](chatuikit_userinfo.html#设置会话头像和昵称)。

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

除了 `ChatUIKitMessageListLayout`，你可以通过 `UIKitChatFragment.Builder` 设置头像和昵称，详见 [基础自定义文档](chatuikit_chat_list_basic.html#设置头像和昵称)。两种方式的区别如下表所示：

| 项         | ChatUIKitMessageListLayout | UIKitChatFragment.Builder | 说明                  |
| :------------- | :------------------------- | :------------------------ | :-------------------- |
| 默认头像       | `setAvatarDefaultSrc()`    | 不支持                    | 设置默认头像。      |
| 发送方头像显示/隐藏 | `hideChatSendAvatar()`     | `hideSenderAvatar()`      | - `true`：隐藏<br/> -（默认）`false`：显示 |
| 接收方头像显示/隐藏 | `hideChatReceiveAvatar()`  | `hideReceiverAvatar()`    | - `true`：隐藏<br/> -（默认）`false`：显示 |
| 昵称显示/隐藏       | `showNickname()`           | `showNickname()`          | - `true`：显示<br/> -（默认）`false`：隐藏 |

## 设置消息气泡

你可以通过 `chatMessageListLayout` 设置消息气泡。

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

除了 `chatMessageListLayout`，你可以通过 `UIKitChatFragment.Builder` 设置消息气泡，详见 [基础自定义文档](chatuikit_chat_list_basic.html#设置消息气泡)。两种方式的区别如下表所示：

| 项         | ChatUIKitMessageListLayout | UIKitChatFragment.Builder | 说明                  |
| :------------- | :------------------------- | :------------------------ | :-------------------- |
| 发送消息气泡的背景       | `setItemSenderBackground`     | `setSentBubbleBackground`                    |      |
| 接收消息气泡的背景 | `setItemReceiverBackground`     | `setReceivedMsgBubbleBackground`     |  |
| 文本消息的字体大小 | `setItemTextSize`  | 不支持   | 单位为 sp 或 px，以实际实现为准。|
| 文本消息的字体颜色       | `setItemTextColor`          | 不支持      | 
| 是否发送原图       | 不支持    |  `sendMessageByOriginalImage`     | - `true`：是 <br/> - (默认) `false`: 否     | 

## 设置消息日期样式

`ChatUIKitMessageListLayout` 提供了如下方法设置消息时间的样式：

| 方法                | 描述                                                                               |
| ------------------- | ---------------------------------------------------------------------------------- |
| `setTimeTextSize()`   | 设置消息日期文本的字体大小，`UIKitChatFragment#Builder` 也提供了此功能的设置方法。 |
| `setTimeTextColor()`  | 设置消息日期文本的颜色，`UIKitChatFragment#Builder` 也提供了此功能的设置方法。     |
| `setTimeBackground()` | 设置消息日期的背景。                                                               |

示例代码如下：

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

关于设置消息日期的格式以及通过 `UIKitChatFragment.Builder` 设置消息时间样式，详见 [基础自定义文档](chatuikit_chat_list_basic.html#设置消息日期)。

## 设置长按消息菜单样式

在消息列表中长按任意消息，即可弹出操作菜单，支持复制、回复、转发、置顶、多选、翻译、创建话题等丰富功能。

UIKit 支持设置消息长按菜单的样式，包括菜单背景和菜单项的图标、文字颜色和大小。

关于选择微信样式菜单或仿系统 `UIActionSheet` 样式菜单、添加、移除、显示/隐藏菜单项以及事件设置，详见 [消息列表基础自定义文档](#chatuikit_chat_list_basic.html)。

### 设置菜单背景色

菜单背景颜色同样通过资源覆盖的方式进行自定义：

| 菜单样式                        | 背景调整方式                                                 |
| :------------------------------ | :----------------------------------------------------------- |
| 微信样式（PopupWindow）     | 覆盖 `drawable/uikit_shape_popup_radius_8` 资源，可修改背景色、圆角、描边等样式。 |
| 底部弹窗样式（BottomSheet） | 菜单列表的布局文件位于 `res/layout/uikit_dialog_menu.xml` 中。若需自定义背景，可在您的 App 工程中覆盖以下样式：<br>  - `ease_item_menu_top_layout_style`<br>  - `ease_conv_item_menu_list`<br>  - `ease_conv_item_menu_divider`<br>  - `ease_conv_item_menu_cancel` |

### 设置菜单项图标

你可以在 `onPreMenu()` 中通过 `ChatUIKitChatMenuHelper` 动态控制菜单项的图标：

| 菜单项 | 默认 ID                   | 默认图标资源                  |
| :----- | :------------------------ | :---------------------------- |
| 复制   | `R.id.action_chat_copy`   | `uikit_chat_item_menu_copy`   |
| 删除   | `R.id.action_chat_delete` | `uikit_chat_item_menu_delete` |
| 撤回   | `R.id.action_chat_recall` | `uikit_chat_item_menu_unsent` |
| 编辑   | `R.id.action_chat_edit`   | `uikit_chat_item_menu_edit`   |
| 回复   | `R.id.action_chat_reply`  | `uikit_chat_item_menu_reply`  |

自定义方式如下：

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

### 设置菜单项文字颜色和大小

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

## 相关资源

在 App 工程中，可通过放置同名资源（`drawable`/`layout`/`values`）来覆盖 UIKit 默认实现，从而自定义界面与功能。

消息类型和消息操作相关的资源设置如下表所示：

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

