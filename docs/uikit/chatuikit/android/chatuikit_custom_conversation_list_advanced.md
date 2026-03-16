# 会话列表的高级设置

本文介绍如何通过 `ChatUIKitConversationListLayout` 实现会话列表的高级设置，包括会话条目的样式、头像、长按菜单以及图标等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_list.png" title="会话列表组件 ChatUIKitConversationListLayout" />
</ImageGallery>

## 概述

要设置会话条目的内容，你需要先获取 `ChatUIKitConversationListLayout` 对象，进行如下配置：

```kotlin
    binding?.listConversation?.let{
        it.setItemBackGround()      //设置会话条目的背景。
        it.setItemHeight()          //设置会话条目的高度。
        it.setAvatarDefaultSrc()    //设置会话条目的默认头像。
        it.setAvatarSize()          //设置会话条目头像的大小。
        it.setAvatarShapeType()     //设置会话条目头像的样式，分为默认 ImageView 样式，圆形和矩形三种样式。
        it.setAvatarRadius()        //设置会话条目头像的圆角半径，样式设置为矩形时有效。
        it.setAvatarBorderWidth()   //设置会话条目头像边框的宽度。 
        it.setAvatarBorderColor()   //设置会话条目头像边框的颜色。
        it.setNameTextSize()        //设置会话条目标题的文字大小。
        it.setNameTextColor()       //设置会话条目标题的文字颜色。 
        it.setMessageTextSize()     //设置会话条目内容的文字大小。
        it.setMessageTextColor()    //设置会话条目内容的文字颜色。 
        it.setDateTextSize()        //设置会话条目日期的文字大小。
        it.setDateTextColor()       //设置会话条目日期的文字颜色。

        it.setListAdapter()         //设置自定义会话列表适配器。
        it.getListAdapter()         //获取会话列表适配器。 
        it.addHeaderAdapter()       //添加会话列表的头布局的适配器。
        it.addFooterAdapter()       //添加会话列表的尾布局的适配器。
        it.addItemDecoration()      //添加会话列表的装饰器。
        it.removeItemDecoration()   //移除会话列表的装饰器。
        it.addItemMenu()            //添加长按单项。 
        it.clearMenu()              //清除长按菜单项。
        it.findItemVisible()        //设置指定菜单项是否可见。   
    }
```

## 设置会话条目背景

```kotlin
    binding?.listConversation?.let{
        it.setItemBackGround()     
    }
```

## 设置会话条目高度

```kotlin
    binding?.listConversation?.let{
        it.setItemHeight()        
    }
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_rowHeight.png" title="会话条目的高度" />
</ImageGallery>

## 设置会话条目标题

会话条目的标题通常显示会话名称，规则如下：
- 单聊会话：优先显示 `UserProfileProvider` 提供的好友备注/昵称（`remark/name`），否则显示对端 `userId`。
- 群聊会话：优先显示 `GroupProfileProvider` 提供的群名称（`name`），其次查找本地群组信息，若存在则显示群名称，否则显示群组 ID。

你可通过以下方法调整标题样式：
- `setNameTextSize(textSizePx: Int)`：设置标题文字大小，单位为 px。
- `setNameTextColor(@ColorInt textColor: Int)`：设置标题文字颜色。

:::tip
`setNameTextSize()` 参数单位为 px（内部使用 `TypedValue.COMPLEX_UNIT_PX`），建议使用 `resources.getDimensionPixelSize()` 或进行 sp 转 px 计算后传入。
:::

```kotlin
val nameSizePx = resources.getDimensionPixelSize(R.dimen.ease_text_size_16)
val nameColor = ContextCompat.getColor(requireContext(), R.color.ease_color_on_background_high)

binding?.listConversation?.let {
    it.setNameTextSize(nameSizePx)
    it.setNameTextColor(nameColor)
}
```

## 设置会话条目内容

默认情况下，会话条目的内容区域显示 **最新一条消息摘要**，例如，文字、图片、语音等会转换为对应的摘要文本。

你可以通过以下方法调整内容样式：
- `setMessageTextSize(textSizePx: Int)`：设置内容文字大小，单位为 px。
- `setMessageTextColor(@ColorInt textColor: Int)`：设置内容文字颜色。

```kotlin
val msgSizePx = resources.getDimensionPixelSize(R.dimen.ease_text_size_14)
val msgColor = ContextCompat.getColor(requireContext(), R.color.ease_color_on_background_medium)

binding?.listConversation?.let {
    it.setMessageTextSize(msgSizePx)
    it.setMessageTextColor(msgColor)
}
```

## 设置会话条目时间

默认情况下，会话条目的时间区域显示 **最新一条消息的时间**（格式化后的时间字符串）。

你可以通过以下方法调整时间样式：
- `setDateTextSize(textSizePx: Int)`：设置时间的文字大小，单位为 px。
- `setDateTextColor(@ColorInt textColor: Int)`：设置时间的文字颜色。

```kotlin
val timeSizePx = resources.getDimensionPixelSize(R.dimen.ease_text_size_12)
val timeColor = ContextCompat.getColor(requireContext(), R.color.ease_color_on_background_low)

binding?.listConversation?.let {
    it.setDateTextSize(timeSizePx)
    it.setDateTextColor(timeColor)
}
```

## 设置会话条目头像

你可以设置默认头像以及头像的样式，如下图所示：

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/ios/avatar_square.png" title="方形头像" />
  <ImageItem src="/images/uikit/chatuikit/ios/avatar_circle.png" title="圆形头像" />
  <ImageItem src="/images/uikit/chatuikit/ios/avatar_no.png" title="无头像" />
</ImageGallery>

#### 设置默认头像

会话条目的默认头像设置位于 `com.hyphenate.easeui.feature.conversation.viewholders.ChatUIKitConversationViewHolder#setData` 函数，会根据会话类型指向特定 ID 资源。如需修改默认头像，可通过以下两种方式实现：
- App 工程 `res/drawable/` 中同名覆盖以下资源：
  - `uikit_default_avatar`：单聊默认头像。
  - `uikit_default_group_avatar`：群聊默认头像。
- 直接修改源码中的相关资源引用。

:::tip
若使用自己的头像，详见 [用户自定义信息文档中](chatuikit_userinfo.html#设置会话头像和昵称)。
:::

#### 设置头像样式

你可以设置头像的大小、样式、圆角半径、头像边框宽度和颜色：

```kotlin
    binding?.listConversation?.let{
      
        it.setAvatarSize()          //设置会话条目的头像大小。
        it.setAvatarShapeType()     //设置会话条目的头像样式，分为默认 ImageView 样式，圆形和矩形三种样式。
        it.setAvatarRadius()        //设置会话条目的头像圆角半径，样式设置为矩形时有效。
        it.setAvatarBorderWidth()   //设置会话条目的头像边框宽度。 
        it.setAvatarBorderColor()   //设置会话条目的头像边框颜色。
    }
```

#### 隐藏会话条目头像

UIKit 暂未提供直接隐藏会话条目头像的开关选项。头像组件位于 `res/layout/uikit_item_conversation_list.xml` 中的 `@+id/avatar`（`ChatUIKitImageView`），并通过 `ChatUIKitConversationViewHolder` 进行头像图片的绑定。你可以通过以下三种方式实现头像隐藏：

-（推荐）方式一：覆盖样式，将头像 View 设为 `gone`：

在会话条目布局中，头像使用 `style="@style/ease_conv_item_avatar"`，你可以在 App 工程同名覆盖该样式，实现全局头像隐藏：

```xml
<!-- App 工程：res/values/uikit_conversation_styles.xml（文件名随意，style 名字一致即可生效） -->
<resources>
    <style name="ease_conv_item_avatar">
        <item name="android:layout_width">0dp</item>
        <item name="android:layout_height">0dp</item>
        <item name="android:layout_marginStart">0dp</item>
        <item name="android:visibility">gone</item>
    </style>
</resources>
```

:::tip
左侧未读标记（圆点/数字）默认围绕头像布局。隐藏头像后可能需要调整其位置。若使用右侧未读样式，则影响较小。
:::

- 方式二：同名覆盖布局，将 `@+id/avatar` 设置为 `gone`，并调整相关约束。

在 App 工程中创建同名布局 `res/layout/uikit_item_conversation_list.xml`，保留 `android:id="@+id/avatar"`，并将其隐藏。

同时，建议将 `name/message` 等控件的 `Start_toEndOf="@+id/avatar"` 约束改为 `Start_toStartOf="parent"`，并添加合适的 marginStart。

```xml
<com.hyphenate.easeui.widget.ChatUIKitImageView
    android:id="@+id/avatar"
    android:layout_width="0dp"
    android:layout_height="0dp"
    android:layout_marginStart="0dp"
    android:visibility="gone" />
```

- 方式三：自定义 Adapter/ViewHolder（支持“只隐藏部分会话”的头像）

如需根据会话类型或业务逻辑选择性隐藏头像，建议自定义 `CustomConversationListAdapter`/`ViewHolder`：

```kotlin
override fun setData(item: ChatUIKitConversation?, position: Int) {
    super.setData(item, position)
    // 例如：按需隐藏头像
    viewBinding.avatar.visibility = View.GONE
}
```

## 设置会话条目长按菜单

长按会话条目会显示会话操作菜单。会话列表页面使用 `ChatUIKitConversationListViewModel` 中提供的方法默认实现会话免打扰、会话置顶、会话标记已读和会话删除操作，详见 [基础自定义说明](chatuikit_custom_conversation_list_basic.html#默认会话操作)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_long_press.png" title="会话长按显示的操作" />
</ImageGallery>

#### 设置会话操作

你可以通过以下方法管理长按菜单项：

```kotlin
    binding?.listConversation?.let{
        it.addItemMenu()            //添加自定义菜单项。 
        it.clearMenu()              //清除所有菜单项。
        it.findItemVisible()        //设置指定菜单项可见性。   
    }
```

#### 设置菜单样式

会话长按菜单采用 `ChatUIKitMenuDialog`（`BottomSheet`）渲染，菜单项布局为 `uikit_item_menu.xml`，相关样式定义在 `ease-im-kit/src/main/res/values/uikit_conversation_styles.xml` 中。

- 设置菜单项文字颜色
  
菜单项文字颜色通过 `ChatUIKitMenuItem.titleColor` 属性控制。你可以在菜单显示前（`setOnMenuPreShowListener`）修改默认的菜单项颜色，或在添加菜单项时直接指定。

```kotlin
// 例：在菜单显示前，把“删除”菜单文字改成红色
binding?.listConversation?.setOnMenuPreShowListener { menuHelper, _ ->
    menuHelper.findItem(R.id.ease_action_conv_menu_delete)?.titleColor =
        ContextCompat.getColor(requireContext(), R.color.ease_color_error)
}
```

- 设置菜单项文字大小
  

菜单项文字大小默认使用样式 `ease_conv_menu_item_title`（其 `textAppearance` 引用 `Ease.TextAppearance.Body.Large`）。

建议在 App 工程中通过 **同名覆盖** `ease_conv_menu_item_title`（或 `Ease.TextAppearance.Body.Large`）来调整字号。

- 设置菜单内相关颜色

菜单列表、顶部区域、取消按钮背景均引用 `@color/ease_dialog_menu_bg_color`（定义于 `uikit_dialog_menu.xml`）。

建议在 App 工程中通过**同名覆盖**以下颜色资源：
    - `ease_dialog_menu_bg_color`：菜单背景色
        - `ease_conv_menu_item_title_color`：菜单项文字默认颜色
        - `ease_conv_menu_item_divider_color`：分割线颜色
        - `ease_dialog_menu_cancel_color`：取消按钮文字颜色

- 其他菜单设置
  
如需调整菜单方向、对齐方式或取消按钮显示，可通过 `getConvMenuHelper()` 获取 `ChatUIKitMenuHelper`，调用 `setMenuOrientation()` / `setMenuGravity()` / `showCancel()`。

## 设置会话免打扰图标

会话免打扰图标对应会话条目中的 `ImageView(msg_mute)`，当 `conversation.isSilent()` 返回 `true` 时显示。

- **默认图标**：`@drawable/uikit_conversation_muted`（定义于 `uikit_item_conversation_list.xml` 中 `msg_mute` 使用的样式 `ease_conv_item_mute`）。
- **替换图标**：在你的 App 工程里提供同名 drawable 资源 `uikit_conversation_muted` 即可覆盖默认图标。
- **隐藏图标**：当前版本未提供独立的显示开关。如需完全隐藏，建议通过 `ChatUIKitConversationListFragment.Builder#setCustomAdapter()` 提供自定义的 `ChatUIKitConversationListAdapter/ViewHolder`，并在数据绑定时将 `msg_mute.visibility` 设置为 `View.GONE`。

## 设置消息未读计数图标

会话列表的未读提示支持 **数字** 与 **小蓝点** 两种样式，并可设置在项的左或右侧。

默认以数字形式显示在会话项右侧。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_unread.png" title="消息未读计数图标" />
</ImageGallery>

#### 设置计数展示方式

你可以通过以下三种方式设置未读提示的样式（NUM / DOT）及位置（LEFT / RIGHT）。

- （推荐）方式一：通过代码设置：

```kotlin
ChatUIKitConversationListFragment.Builder()
    .setUnreadPosition(UnreadDotPosition.RIGHT) // LEFT / RIGHT
    .setUnreadStyle(UnreadStyle.NUM)            // NUM / DOT
    .build()
```

- 方式二：通过 `ChatUIKitConversationListLayout` 设置：

```kotlin
binding?.listConversation?.apply {
    showUnreadDotPosition(UnreadDotPosition.RIGHT)
    setUnreadStyle(UnreadStyle.NUM)
}
```

- 方式三：通过 XML 属性设置：
  

若在布局中直接使用 `ChatUIKitConversationListLayout`，可通过以下属性设置：
  - `app:ease_con_item_unread_dot_position="left|right"`
  - `app:ease_con_item_unread_style="num|dot"`

#### 替换背景与图标

- **未读提示背景**：数字与蓝点的背景均基于 drawable 资源，未固化在代码中。
  - 蓝点背景：`@drawable/uikit_conv_item_unread_dot_bg`
  - 数字背景：`@drawable/uikit_conv_item_unread_count_bg`
  - 两者默认均引用颜色资源：`@color/uikit_conv_item_unread_dot_bg`

- **将蓝点替换为红点**：最简单的方式是在你的 App 工程中通过资源同名覆盖修改颜色值 `uikit_conv_item_unread_dot_bg`。

```xml
<!-- res/values/colors.xml（App 工程） -->
<color name="uikit_conv_item_unread_dot_bg">#00FF00</color>
```

- **使用自定义 drawable 背景**：直接同名覆盖 `uikit_conv_item_unread_dot_bg.xml` 或 `uikit_conv_item_unread_count_bg.xml`，定义为你需要的 shape、selector 或图片即可。

- **注意（免打扰会话）**：当会话处于免打扰状态时，SDK 默认会将未读数字样式降级显示为红点（相关逻辑位于 `ChatUIKitConvItemConfigBinding#showUnreadCount`）。

#### 隐藏未读图标

单群聊 UIKit 未提供独立的开关控制未读提示的显示与隐藏。如需完全隐藏（既不显示数字也不显示红点），建议使用自定义 Adapter/ViewHolder，在数据绑定时将与 `unread_msg_number`、`unread_msg_dot` 等相关的视图设置为 `GONE`，或重写未读提示的展示逻辑。

## 设置事件监听

`ChatUIKitConversationListFragment.Builder` 提供了针对会话条目及长按菜单的事件监听配置。建议通过 Builder 进行统一设置。

```kotlin
ChatUIKitConversationListFragment.Builder()
    .setItemClickListener(onItemClickListener)
    .setOnItemLongClickListener(onItemLongClickListener)
    .setOnMenuItemClickListener(onMenuItemClickListener)
    .setConversationChangeListener(conversationChangeListener)
    .build()
```

| 方法                             | 描述                                                         |
| -------------------------------- | ------------------------------------------------------------|
| `setItemClickListener()`          | 设置会话条目点击事件监听器。                                        |
| `setOnItemLongClickListener()`    | 设置会话条目长按事件监听器。                                        |
| `setOnMenuItemClickListener()`    | 设置会话列条目长按后弹出的菜单项的点击事件监听器。                                    |
| `setConversationChangeListener()` | 设置会话变更的监听器，例如会话被删除时触发。                    |

此外，如果你直接操作 `ChatUIKitConversationListLayout`（`binding.listConversation`），还可以额外配置以下两个常用监听器：

- **菜单显示前的回调**：`setOnMenuPreShowListener(OnMenuPreShowListener)` 可用于动态增删、显示/隐藏或修改菜单项。
- **会话列表加载回调**：`setLoadConversationListener(OnLoadConversationListener)`

例如，在 Fragment 的 `onViewCreated` 或 `initListener` 方法中设置：

```kotlin
binding?.listConversation?.setOnMenuPreShowListener { menuHelper, position ->
    // 例：在显示菜单前，动态调整菜单项
    // menuHelper?.addItemMenu(...)
    // menuHelper?.findItemVisible(...)
}

binding?.listConversation?.setLoadConversationListener(object : OnLoadConversationListener {
    override fun loadConversationListSuccess(userList: List<ChatUIKitConversation>) {
        // 例：获取到当前加载的会话列表
    }

    override fun loadConversationListFail(code: Int, error: String) {
        // 例：加载失败兜底提示
    }
})
```

## 自定义资源

除以上的页面设置，本节全面列明了会话列表相关资源，包括图标、文字和颜色等。你可以在 App 工程中放置同名资源（`drawable`/`layout`/`values`）来覆盖 UIKit 默认实现，从而替换资源。

#### 可同名覆盖的 drawable

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
<p>用途说明</p>
</td>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2">
<p>通用/默认头像</p>
</td>
<td>
<p>uikit_default_avatar</p>
</td>
<td>
<p>单聊默认头像</p>
</td>
</tr>
<tr>
<td>
<p>uikit_default_group_avatar</p>
</td>
<td>
<p>群聊默认头像</p>
</td>
</tr>
<tr>
<td rowspan="2">
<p>会话条目的背景/状态</p>
</td>
<td>
<p>uikit_view_default_touch_shadow_bg</p>
</td>
<td>
<p>会话条目的默认背景/按压背景</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_item_pinned</p>
</td>
<td>
<p>会话条目的置顶态背景</p>
</td>
</tr>
<tr>
<td>
<p>免打扰（Mute/DND）</p>
</td>
<td>
<p>uikit_conversation_muted</p>
</td>
<td>
<p>会话免打扰图标，显示在会话条目的标题右侧</p>
</td>
</tr>
<tr>
<td rowspan="2">
<p>未读数/未读点</p>
</td>
<td>
<p>uikit_conv_item_unread_dot_bg</p>
</td>
<td>
<p>未读点背景，默认是一个圆形 shape</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_item_unread_count_bg</p>
</td>
<td>
<p>未读数字背景，默认是一个圆角矩形 shape</p>
</td>
</tr>
<tr>
<td rowspan="3">
<p>会话页面的&ldquo;更多&rdquo;弹窗</p>
</td>
<td>
<p>uikit_conv_new_chat</p>
</td>
<td>
<p>新建会话图标（新会话/加好友/建群弹窗中）</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_add_contact</p>
</td>
<td>
<p>添加联系人图标（新会话/加好友/建群弹窗中）</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_new_group</p>
</td>
<td>
<p>创建群组图标（新会话/加好友/建群弹窗中）</p>
</td>
</tr>
</tbody>
</table>

#### 可同名覆盖的文案

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
<p>用途说明</p>
</td>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="7">
<p>会话条目的长按菜单</p>
</td>
<td>
<p>uikit_conv_menu_item_silent</p>
</td>
<td>
<p>免打扰菜单项图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_menu_item_unsilent</p>
</td>
<td>
<p>取消免打扰菜单项图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_menu_item_pin</p>
</td>
<td>
<p>置顶菜单项图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_menu_item_unpin</p>
</td>
<td>
<p>取消置顶菜单项图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_menu_item_read</p>
</td>
<td>
<p>标记已读菜单项图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_menu_item_delete</p>
</td>
<td>
<p>删除菜单项图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_cancel</p>
</td>
<td>
<p>菜单弹窗的"取消"按钮图标或文本</p>
</td>
</tr>
<tr>
<td rowspan="4">
<p>会话页面“更多”弹窗</p>
</td>
<td>
<p>uikit_conv_action_new_conversation</p>
</td>
<td>
<p>新会话操作图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_action_add_contact</p>
</td>
<td>
<p>添加联系人操作图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_action_create_group</p>
</td>
<td>
<p>创建群组操作图标</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_dialog_add_contact</p>
</td>
<td>
<p>添加联系人弹窗提示文案</p>
</td>
</tr>
<tr>
<td rowspan="2">
<p>会话条目的内部提示</p>
</td>
<td>
<p>uikit_chat_were_mentioned</p>
</td>
<td>
<p>群@特定成员提示文案</p>
</td>
</tr>
<tr>
<td>
<p>uikit_chat_were_mentioned_all</p>
</td>
<td>
<p>群@全体成员提示文案</p>
</td>
</tr>
</tbody>
</table>

#### 可同名覆盖的颜色

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
<p>用途说明</p>
</td>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="7">
<p>会话条目的文字/分割线/状态</p>
</td>
<td>
<p>ease_conv_item_title_color</p>
</td>
<td>
<p>标题颜色</p>
</td>
</tr>
<tr>
<td>
<p>ease_conv_item_content_color</p>
</td>
<td>
<p>摘要/最后一条消息颜色</p>
</td>
</tr>
<tr>
<td>
<p>ease_conv_item_date_color</p>
</td>
<td>
<p>时间颜色</p>
</td>
</tr>
<tr>
<td>
<p>ease_conv_item_number_color</p>
</td>
<td>
<p>未读数字文字颜色</p>
</td>
</tr>
<tr>
<td>
<p>ease_conv_item_mention_color</p>
</td>
<td>
<p>@提示颜色</p>
</td>
</tr>
<tr>
<td>
<p>ease_conv_item_divider_color</p>
</td>
<td>
<p>底部分割线颜色</p>
</td>
</tr>
<tr>
<td>
<p>uikit_conv_item_unread_dot_bg</p>
</td>
<td>
<p>未读点/未读数背景主色（被&nbsp;uikit_conv_item_unread_dot_bg&nbsp;和&nbsp;uikit_conv_item_unread_count_bg&nbsp;引用）</p>
</td>
</tr>
<tr>
<td rowspan="4">
<p>会话长按菜单（BottomSheet）</p>
</td>
<td>
<p>ease_dialog_menu_bg_color</p>
</td>
<td>
<p>菜单弹窗背景色（列表/顶部/取消按钮区域）</p>
</td>
</tr>
<tr>
<td>
<p>ease_dialog_menu_cancel_color</p>
</td>
<td>
<p>取消按钮文字颜色</p>
</td>
</tr>
<tr>
<td>
<p>ease_conv_menu_item_title_color</p>
</td>
<td>
<p>菜单项文字默认颜色</p>
</td>
</tr>
<tr>
<td>
<p>ease_conv_menu_item_divider_color</p>
</td>
<td>
<p>菜单项分割线颜色</p>
</td>
</tr>
</tbody>
</table>

#### 可同名覆盖的布局

如果需要移除控件、重排布局、插入新控件等结构调整，可根据需求在 App 工程中同名覆盖以下布局：

| 布局文件路径                                   | 说明                                             |
| :--------------------------------------------- | :--------------------------------------------------- |
| `layout/uikit_item_conversation_list.xml`      | 单个会话条目布局。                               |
| `layout/uikit_dialog_menu.xml`                 | 会话条目长按菜单：底部弹窗容器布局。             |
| `layout/uikit_item_menu.xml`                   | 会话条目长按菜单：菜单项布局。                   |
| `layout/fragment_conversation_list_layout.xml` | 会话页整体结构布局：包含 TitleBar、SearchBar、List。 |

## 可重载方法标记

其他标记为 open / override fun 的方法均为可重载方法。如有需要，可重载对应方法实现自己业务逻辑。







