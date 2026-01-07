# 页面标题栏

`ChatUIKitTitleBar` 是可自定义的标题栏组件，它基于 Material Toolbar，提供了灵活的布局方式，支持显示头像、状态图标、标题、副标题、导航按钮和菜单等多种元素。

聊天页面、会话列表页面、联系人列表页面、群详情页面和联系人详情页面的标题栏均使用 `ChatUIKitTitleBar`。

- **双层架构**：底层 Toolbar + 上层自定义视图，完美结合原生功能与自定义 UI
- **丰富元素**：导航按钮、Logo、状态图标、标题、副标题、菜单
- **动态适配**：自动计算边距，避免元素重叠
- **样式定制**：支持自定义颜色、大小、图标等

// TODO：添加截图

## 架构设计

### 双层叠加结构

`ChatUIKitTitleBar` 采用独特的双层设计：

// TODO：美化图

```
┌────────────────────────────────────────────────────────────┐
│ RelativeLayout (ChatUIKitTitleBar)                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ MaterialToolbar (底层 - 功能层)                      │  │
│  │ ├─ NavigationIcon (导航按钮)                         │  │
│  │ ├─ Menu (右侧菜单)                                   │  │
│  │ └─ 原生 Title/Subtitle/Logo (隐藏不使用)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ConstraintLayout (上层 - 视图层，mark_layer)         │  │
│  │                                                        │  │
│  │  ┌────┐                                               │  │
│  │  │ 👤 │ iv_icon (Logo/头像)                          │  │
│  │  │    │  └─┐                                          │  │
│  │  └────┘    🟢 iv_status (状态指示器)                 │  │
│  │                                                        │  │
│  │         ┌─────────────────────┐                       │  │
│  │         │ Title 主标题         │ tv_title             │  │
│  │         └─────────────────────┘                       │  │
│  │         ┌─────────────────────┐                       │  │
│  │         │ Subtitle 副标题      │ tv_subtitle          │  │
│  │         └─────────────────────┘                       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 视觉布局示例
//找UI设计提供图

#### 标准聊天页面（带状态）

```
┌──────────────────────────────────────────────────┐
│ ← │ 👤🟢 │ 张三                         ⋮         │
│   │      │ 在线                                   │
└──────────────────────────────────────────────────┘
  ↑   ↑    ↑                              ↑
  │   │    └─ 标题 + 副标题                └─ 菜单
  │   └────── Logo/头像
  └────────── 导航按钮
     
状态图标（绿点表示在线）

```

#### 群聊页面

```
┌──────────────────────────────────────────────────┐
│ ← │ 👥  │ 开发组                      ⋮           │
└──────────────────────────────────────────────────┘
    
```

## 设置方式

`ChatUIKitTitleBar` 提供 `Fragment Builder`、`XML 布局` 和 `Kotlin/Java代码` 三种配置方式，可根据项目需求选择。

### 方式 1：使用 Fragment Builder 配置

UIKit 提供了聊天、会话列表、联系人列表的 Fragment Builder 类，可以快速配置标题栏：

**完整示例 - 聊天页面：**

```kotlin
class ChatActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat)
        
        val chatFragment = UIKitChatFragment.Builder(conversationId, chatType)
            .useTitleBar(true)                          // 使用标题栏
            .setTitleBarTitle("张三")                   // 设置标题
            .setTitleBarSubTitle("在线")                // 设置副标题（仅聊天页面支持）
            .enableTitleBarPressBack(true)              // 显示返回按钮
            .setTitleBarBackPressListener { finish() }  // 返回监听
            .build()
        
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, chatFragment)
            .commit()
    }
}
```

**其他场景配置：**

```kotlin
// 会话列表
val fragment = ChatUIKitConversationListFragment.Builder()
    .useTitleBar(true)
    .setTitleBarTitle("消息")
    .enableTitleBarPressBack(false)  // 首页不显示返回
    .build()

// 联系人列表
val fragment = ChatUIKitContactsListFragment.Builder()
    .useTitleBar(true)
    .setTitleBarTitle("联系人")
    .enableTitleBarPressBack(false)
    .build()
```

### 方式 2：通过 XML 布局配置

```xml
<com.hyphenate.easeui.widget.ChatUIKitTitleBar
    android:id="@+id/titleBar"
    android:layout_width="match_parent"
    android:layout_height="?attr/actionBarSize"
    app:titleBarDisplayHomeAsUpEnabled="true"
    app:titleBarTitle="聊天"
    app:titleBarSubtitle="在线"
    app:titleBarTitleCenter="false"
    app:titleBarNavigationIcon="@drawable/ic_back"
    app:titleBarMenu="@menu/chat_menu" />
```

可用属性列表如下：

| 属性名 | 类型 | 说明 |
|-------|------|------|
| `titleBarDisplayHomeAsUpEnabled` | Boolean | 是否显示返回按钮，默认值为 `true`。 | 
| `titleBarReplaceActionBar` | Boolean | 是否替换为 ActionBar，默认值为 `false`。|
| `titleBarNavigationIcon` | Drawable | 导航图标。 |
| `titleBarNavigationIconTint` | Color | 导航图标颜色。 |
| `titleBarNavigationContentDescription` | String | 导航按钮描述。 |
| `titleBarLogo` | Drawable | Logo 图标。 |
| `titleBarLogoSize` | Dimension | Logo 大小。 | 
| `titleBarLogoDescription` | String | Logo 描述。 | 
| `titleBarTitle` | String | 标题。 |
| `titleBarTitleTextColor` | Color | 标题文字颜色。 | 
| `titleBarTitleTextAppearance` | Style | 标题文字样式。 | 
| `titleBarTitleCenter` | Boolean | 标题是否居中，默认值为 `false`。 |
| `titleBarSubtitle` | String | 副标题。 |
| `titleBarSubtitleTextColor` | Color | 副标题文字颜色。 | 
| `titleBarSubtitleTextAppearance` | Style | 副标题文字样式。 | 
| `titleBarMenu` | Menu | 菜单资源。 |
| `titleBarMenuIconTint` | Color | 菜单图标颜色。 | 
| `titleBarMenuTitleColor` | Color | 菜单文字颜色。 |
| `titleBarPopupTheme` | Style | 弹出菜单主题。 |

### 方式 3：通过代码设置

```kotlin
class ChatActivity : AppCompatActivity() {
    
    private lateinit var titleBar: ChatUIKitTitleBar
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat)
        
        titleBar = findViewById(R.id.titleBar)
        
        val userId = intent.getStringExtra("userId")
        val userName = intent.getStringExtra("userName")
        val userAvatar = intent.getStringExtra("userAvatar")
        
        // 配置标题栏
        setupTitleBar(userName, userAvatar)
    }
    
    private fun setupTitleBar(userName: String?, avatarUrl: String?) {
        titleBar.apply {
            // 1. 导航按钮
            setDisplayHomeAsUpEnabled(true)
            setNavigationOnClickListener { finish() }
            
            // 2. 用户信息
            setTitle(userName ?: "未知用户")
            setSubtitle("在线")
            
            // 3. 加载头像
            setLogo(
                data = avatarUrl,
                placeResource = R.drawable.default_avatar,
                size = 40.dpToPx(this@ChatActivity)
            )
            
            // 4. 在线状态图标
            setLogoStatus(R.drawable.ic_online)
            
            // 头像点击查看资料
            setLogoClickListener {
                startActivity(Intent(this@ChatActivity, UserInfoActivity::class.java).apply {
                    putExtra("userId", userId)
                })
            }
            
            // 标题点击查看详情
            setTitleClickListener {
                //showUserDetails()
            }
            
            // 加载菜单
            inflateMenu(R.menu.chat_menu)
            setMenuIconTint(ContextCompat.getColor(context, R.color.title_bar_icon_color))
            setOnMenuItemClickListener { item ->
                when (item.itemId) {
                    R.id.menu_voice_call -> {
                        //startVoiceCall()
                        true
                    }
                    R.id.menu_video_call -> {
                        //startVideoCall()
                        true
                    }
                    R.id.menu_more -> {
                        //showMoreOptions()
                        true
                    }
                    else -> false
                }
            }
        }
    }
}
```

**menu/chat_menu.xml:**

```xml
<menu xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">
    
    <item
        android:id="@+id/menu_voice_call"
        android:icon="@drawable/ic_voice_call"
        android:title="语音通话"
        app:showAsAction="ifRoom" />
    
    <item
        android:id="@+id/menu_video_call"
        android:icon="@drawable/ic_video_call"
        android:title="视频通话"
        app:showAsAction="ifRoom" />
    
    <item
        android:id="@+id/menu_more"
        android:icon="@drawable/ic_more"
        android:title="更多"
        app:showAsAction="ifRoom" />
</menu>
```

## 核心功能

你可以通过以下 API 设置标题栏的核心功能。

### 1. 导航按钮控制

```kotlin
// 显示默认返回按钮
titleBar.setDisplayHomeAsUpEnabled(true)

// 自定义导航图标
titleBar.setNavigationIcon(R.drawable.ic_custom_back)

// 设置导航图标颜色
titleBar.setNavigationIconTint(Color.WHITE)

// 设置点击监听
titleBar.setNavigationOnClickListener {
    onBackPressed()
}

// 隐藏导航按钮
titleBar.setDisplayHomeAsUpEnabled(false)
```

### 2. Logo/头像设置

#### 基础用法

```kotlin
// 设置本地图片资源
titleBar.setLogo(R.drawable.user_avatar)

// 设置 Drawable
titleBar.setLogo(drawable)

// 设置大小，单位为 px
titleBar.setLogoSize(120) 
```

#### 加载远程图片

```kotlin
// 使用 Coil 加载网络图片
titleBar.setLogo(
    data = "https://example.com/avatar.jpg",
    placeResource = R.drawable.default_avatar,
    size = 40.dpToPx(context) // 将 dp 转为 px
)
```

#### Logo 点击事件

```kotlin
titleBar.setLogoClickListener {
    // 点击头像，查看用户信息
    startActivity(Intent(this, UserProfileActivity::class.java))
}
```

### 3. 状态图标

```kotlin
// 显示状态图标（例如：在线状态）
titleBar.setLogoStatus(R.drawable.ic_online)

// 设置状态图标大小，单位为 px
titleBar.setLogoStatusSize(24) 

// 调整状态图标位置（单位：dp）
titleBar.setLogoStatusMargin(
    start = 0,
    top = 0,
    end = 2,
    bottom = 2
)
```

### 4. 标题设置

#### 基础用法

```kotlin
// 设置标题
titleBar.setTitle("聊天室")
titleBar.setTitle(R.string.chat_title)

// 设置标题颜色
titleBar.setTitleTextColor(Color.BLACK)
titleBar.setTitleTextColor(ColorStateList.valueOf(Color.BLACK))

// 设置标题样式
titleBar.setTitleTextAppearance(context, R.style.CustomTitleStyle)

// 获取标题
val title = titleBar.getTitle()

// 获取标题 View（用于高级定制）
val titleView = titleBar.getTitleView()
titleView.maxLines = 2
```

#### 标题 TextView 内右侧图标

```kotlin
// 在标题右侧添加图标（如：认证标识）
titleBar.setTitleEndDrawable(
    resId = R.drawable.ic_verified,
    spacing = 4 // 图标与文字间距，单位：dp
)

// 移除右侧图标
titleBar.setTitleEndDrawable(resId = null)
```

#### 标题点击事件

```kotlin
titleBar.setTitleClickListener {
    // 点击标题，显示详情
    showChatDetails()
}
```

### 5. 副标题设置

```kotlin
// 设置副标题
titleBar.setSubtitle("在线")
titleBar.setSubtitle(R.string.online_status)

// 设置副标题颜色
titleBar.setSubtitleTextColor(Color.GRAY)

// 设置副标题样式
titleBar.setSubtitleTextAppearance(context, R.style.CustomSubtitleStyle)

// 获取副标题
val subtitle = titleBar.getSubtitle()
```

### 6. 菜单设置

```kotlin
// 加载菜单资源
titleBar.inflateMenu(R.menu.chat_menu)

// 设置菜单图标颜色
titleBar.setMenuIconTint(Color.WHITE)

// 设置菜单文字颜色
titleBar.setMenuTitleColor(Color.WHITE)

// 控制菜单项可见性
titleBar.setMenuIconVisible(R.id.menu_voice_call, visible = true)

// 设置菜单点击监听
titleBar.setOnMenuItemClickListener { menuItem ->
    when (menuItem.itemId) {
        R.id.menu_voice_call -> {
            startVoiceCall()
            true
        }
        R.id.menu_video_call -> {
            startVideoCall()
            true
        }
        R.id.menu_settings -> {
            openSettings()
            true
        }
        else -> false
    }
}

// 隐藏默认菜单（禁用所有菜单项）
titleBar.hideDefaultMenu()

// 获取 Toolbar 进行高级操作
val toolbar = titleBar.getToolBar()
toolbar.menu.findItem(R.id.menu_item)?.let { item ->
    item.isVisible = true
}
```

### 7. 布局模式

```kotlin
// 设置标题居中
titleBar.setTitleCentered(true)

// 设置标题左对齐（默认）
titleBar.setTitleCentered(false)
```

**居中效果：**
```
┌──────────────────────────────────────┐
│ ←          聊天室            ⋮      │
└──────────────────────────────────────┘
```

**左对齐效果：**
```
┌──────────────────────────────────────┐
│ ← │ 👤 │ 聊天室            ⋮        │
└──────────────────────────────────────┘
```

### 动态更新示例

#### 1. 更新在线状态

**调用场景：** 收到 Presence 状态更新、用户上线/下线通知时

```kotlin
// 在 Presence 监听回调中调用
override fun onPresenceUpdated(presences: List<Presence>) {
    presences.find { it.publisher == userId }?.let { presence ->
        // 判断用户是否在线：遍历 statusList，如果有任何设备在线（value = 1）则为在线
        val isOnline = presence.statusList.any { it.value == 1 }
        updateUserStatus(isOnline)
    }
}

private fun updateUserStatus(isOnline: Boolean) {
    titleBar.apply {
        if (isOnline) {
            setSubtitle("在线")
            setLogoStatus(R.drawable.ic_online)
            setSubtitleTextColor(ContextCompat.getColor(this@ChatActivity, R.color.online_color))
        } else {
            setSubtitle("离线")
            setLogoStatus(R.drawable.ic_offline)
            setSubtitleTextColor(ContextCompat.getColor(this@ChatActivity, R.color.offline_color))
        }
    }
}
```

#### 2. 更新输入状态 

**调用场景：** 收到对方正在输入的消息时

```kotlin
// 在消息监听回调中调用
override fun onCmdMessageReceived(messages: List<ChatMessage>) {
    messages.forEach { msg ->
        if (msg.getStringAttribute("action") == "typing_begin") {
            updateTypingStatus(true)
        } else if (msg.getStringAttribute("action") == "typing_end") {
            updateTypingStatus(false)
        }
    }
}

private fun updateTypingStatus(isTyping: Boolean) {
    titleBar.apply {
        if (isTyping) {
            setSubtitle("正在输入...")
            setSubtitleTextColor(ContextCompat.getColor(this@ChatActivity, R.color.typing_color))
        }
    } else {
        // 恢复原始副标题和颜色
        titleBar.apply {
            setSubtitle(originalSubtitle)
            setSubtitleTextColor(ContextCompat.getColor(this@ChatActivity, R.color.subtitle_color))
        }
    }
}
```

## API 参考

### 导航相关

| 方法 | 说明 | 参数 |
|-----|------|------|
| `setDisplayHomeAsUpEnabled(Boolean, Boolean)` | 设置是否显示返回按钮 | `enableDisplayHomeAsUp`: 是否显示<br>`replaceActionBar`: 是否替换为 ActionBar 模式 |
| `setNavigationIcon(@DrawableRes Int)` | 设置导航图标资源 | `resId`: 图标资源 ID |
| `setNavigationIcon(Drawable?)` | 设置导航图标 | `icon`: Drawable 对象 |
| `setNavigationIconTint(@ColorInt Int)` | 设置导航图标颜色 | `navigationIconTint`: 颜色值 |
| `setNavigationOnClickListener(OnClickListener?)` | 设置导航按钮点击监听 | `listener`: 点击监听器 |

### Logo 相关

| 方法 | 说明 | 参数 |
|-----|------|------|
| `setLogo(@DrawableRes Int)` | 设置 Logo 资源 | `resId`: 图标资源 ID |
| `setLogo(Drawable?)` | 设置 Logo | `drawable`: Drawable 对象 |
| `setLogo(Any?, @DrawableRes Int, Int)` | 加载远程 Logo | `data`: 数据源（URL/Uri等）<br>`placeResource`: 占位图<br>`size`: 大小（px） |
| `setLogoSize(Int)` | 设置 Logo 大小 | `size`: 大小（px） |
| `setLogoDescription(@StringRes Int)` | 设置 Logo 描述 | `resId`: 字符串资源 ID |
| `setLogoDescription(CharSequence?)` | 设置 Logo 描述 | `description`: 描述文字 |
| `setLogoClickListener(OnClickListener?)` | 设置 Logo 点击监听 | `listener`: 点击监听器 |
| `getLogoView()` | 获取 Logo 视图 | 返回 `ChatUIKitImageView?` |

### 状态图标相关

| 方法 | 说明 | 参数 |
|-----|------|------|
| `setLogoStatus(@DrawableRes Int)` | 设置状态图标资源 | `resId`: 图标资源 ID |
| `setLogoStatus(Drawable?)` | 设置状态图标 | `drawable`: Drawable 对象 |
| `setLogoStatusSize(Int)` | 设置状态图标大小 | `size`: 大小（px） |
| `setLogoStatusMargin(Int?, Int?, Int?, Int?)` | 设置状态图标边距 | `start`, `top`, `end`, `bottom`: 边距（dp） |
| `getStatusView()` | 获取状态视图 | 返回 `ChatUIKitImageView` |

### 标题相关

| 方法 | 说明 | 参数 |
|-----|------|------|
| `setTitle(@StringRes Int)` | 设置标题资源 | `resId`: 字符串资源 ID |
| `setTitle(CharSequence?)` | 设置标题 | `title`: 标题文字 |
| `getTitle()` | 获取标题 | 返回 `CharSequence?` |
| `getTitleView()` | 获取标题 TextView | 返回 `TextView`，可用于高级定制 |
| `setTitleTextColor(@ColorInt Int)` | 设置标题文字颜色 | `color`: 颜色值 |
| `setTitleTextColor(ColorStateList?)` | 设置标题文字颜色 | `color`: 颜色状态列表 |
| `setTitleTextAppearance(Context?, @StyleRes Int)` | 设置标题文字样式 | `context`: 上下文<br>`resId`: 样式资源 ID |
| `setTitleEndDrawable(@DrawableRes Int?, Int?)` | 设置标题右侧图标 | `resId`: 图标资源 ID<br>`spacing`: 间距（dp） |
| `setTitleEndDrawable(Drawable?, Int?)` | 设置标题右侧图标 | `drawable`: Drawable 对象<br>`spacing`: 间距（dp） |
| `setTitleClickListener(OnClickListener?)` | 设置标题点击监听 | `listener`: 点击监听器 |
| `setTitleCentered(Boolean)` | 设置标题居中 | `centered`: 是否居中 |

### 副标题相关

| 方法 | 说明 | 参数 |
|-----|------|------|
| `setSubtitle(@StringRes Int)` | 设置副标题资源 | `resId`: 字符串资源 ID |
| `setSubtitle(CharSequence?)` | 设置副标题 | `subtitle`: 副标题文字 |
| `getSubtitle()` | 获取副标题 | 返回 `CharSequence?` |
| `setSubtitleTextColor(@ColorInt Int)` | 设置副标题文字颜色 | `color`: 颜色值 |
| `setSubtitleTextColor(ColorStateList?)` | 设置副标题文字颜色 | `color`: 颜色状态列表 |
| `setSubtitleTextAppearance(Context?, @StyleRes Int)` | 设置副标题文字样式 | `context`: 上下文<br>`resId`: 样式资源 ID |

### 菜单相关

| 方法 | 说明 | 参数 |
|-----|------|------|
| `inflateMenu(@MenuRes Int)` | 加载菜单资源 | `resId`: 菜单资源 ID |
| `setMenuIconTint(@ColorInt Int)` | 设置菜单图标颜色 | `colorInt`: 颜色值 |
| `setMenuTitleColor(@ColorInt Int)` | 设置菜单文字颜色 | `colorInt`: 颜色值 |
| `setMenuIconVisible(Int, Boolean)` | 设置菜单项可见性 | `id`: 菜单项 ID<br>`visible`: 是否可见 |
| `setOnMenuItemClickListener(Toolbar.OnMenuItemClickListener)` | 设置菜单点击监听 | `listener`: 点击监听器 |
| `hideDefaultMenu()` | 隐藏默认菜单 | 禁用所有菜单项并移除图标 |

### 其他

| 方法 | 说明 | 返回值 |
|-----|------|-------|
| `getToolBar()` | 获取 Toolbar 对象 | `Toolbar` |

## Fragment Builder API

UIKit 提供了三个 Fragment Builder 类，用于快速配置包含标题栏的页面。这些 Builder 提供了统一的标题栏配置方法。

### 通用标题栏配置方法

以下方法在三个 Builder 类中都可用：

| Builder 类 | 说明 |
|-----------|------|
| `UIKitChatFragment.Builder` | 用于聊天页面，支持单聊、群聊、聊天室。 |
| `ChatUIKitConversationListFragment.Builder` | 用于会话列表页面。 |
| `ChatUIKitContactsListFragment.Builder` | 用于联系人列表页面。 |

### 标题栏配置方法列表

| 方法 | 说明 | 参数 | 适用 Builder |
|-----|------|------|-------------|
| `useTitleBar(Boolean)` | 是否使用标题栏 | `useTitle`: 是否显示标题栏 | 全部 |
| `useTitleBarToReplaceActionBar(Boolean)` | 是否替换为 ActionBar | `replace`: 是否替换（会调用 `setSupportActionBar`） | 全部 |
| `setTitleBarTitle(String?)` | 设置标题栏标题 | `title`: 标题文字 | 全部 |
| `setTitleBarSubTitle(String?)` | 设置标题栏副标题 | `subTitle`: 副标题文字 | 仅 `UIKitChatFragment.Builder` |
| `enableTitleBarPressBack(Boolean)` | 是否显示返回按钮 | `canBack`: 是否显示 | 全部 |
| `setTitleBarBackPressListener(OnClickListener?)` | 设置返回按钮监听 | `listener`: 点击监听器 | 全部 |


### Builder 配置 vs 直接修改代码的区别 

| 特性 | Builder 配置 | 直接操作 TitleBar |
|-----|-------------|------------------|
| **使用场景** | Fragment 初始化时 | Activity 或 Fragment 中动态修改 |
| **配置时机** | 创建 Fragment 时 | 运行时任意时刻 |
| **灵活性** | 基础配置，参数有限 | 完全控制，所有 API 可用 |
| **代码位置** | Fragment Builder 调用链 | `onCreate`/`onViewCreated` 等生命周期方法 |
| **推荐场景** | 快速搭建页面框架 | 需要动态更新标题栏内容 |

### 混合使用示例

可以先用 Builder 做基础配置，然后在 Fragment 中获取 TitleBar 进行高级定制：

```kotlin
// 1. Builder 基础配置
val chatFragment = UIKitChatFragment.Builder(conversationId, chatType)
    .useTitleBar(true)
    .setTitleBarTitle("张三")
    .enableTitleBarPressBack(true)
    .build()

// 2. 在 Fragment 中进一步定制
class MyChatFragment : UIKitChatFragment() {
    
    override fun initView(savedInstanceState: Bundle?) {
        super.initView(savedInstanceState)
        
        // 获取 TitleBar 进行高级配置
        binding?.titleBar?.apply {
            // 加载用户头像
            setLogo(
                data = avatarUrl,
                placeResource = R.drawable.default_avatar,
                size = 40.dpToPx(requireContext())
            )
            
            // 设置在线状态
            setLogoStatus(R.drawable.ic_online)
            setSubtitle("在线")
            
            // 添加菜单
            inflateMenu(R.menu.chat_menu)
            setMenuIconTint(Color.WHITE)
            
            // 头像点击事件
            setLogoClickListener {
                // 查看用户详情
            }
        }
    }
}
```


## 常见问题

### Q1: 为什么设置了 Title 但显示不出来？

**A:** 检查是否设置了 Logo 且未调整布局。Logo 和 Title 共享空间，如果 Logo 太大可能遮挡标题。

```kotlin
// 确保 Logo 大小合适
titleBar.setLogoSize(40.dpToPx(context))
```

### Q2: 菜单图标颜色不生效？

**A:** 确保在 `inflateMenu()` 之后调用颜色设置方法：

```kotlin
titleBar.inflateMenu(R.menu.chat_menu)
titleBar.setMenuIconTint(Color.WHITE) // 必须在 inflateMenu 之后
```

### Q3: 状态图标如何显示？

**A:** 状态图标默认隐藏，需要手动设置：

```kotlin
titleBar.setLogoStatus(R.drawable.ic_online)
titleBar.getStatusView().visibility = View.VISIBLE
```

### Q4: 使用 Builder 配置后如何修改标题栏？

**A:** Builder 只负责初始化配置，后续可以在 Fragment 中获取 TitleBar 对象进行修改：

```kotlin
// 在自定义的 Fragment 中
override fun initView(savedInstanceState: Bundle?) {
    super.initView(savedInstanceState)
    
    // 获取并修改 TitleBar
    binding?.titleBar?.apply {
        setTitle("新标题")
        setLogo(R.drawable.new_avatar)
    }
}
```

### Q5: Builder 的 `useTitleBarToReplaceActionBar` 什么时候使用？

**A:** 通常不需要使用此选项（默认 `false`）。只有在需要将 TitleBar 作为 Activity 的 ActionBar，并通过 `onOptionsItemSelected(android.R.id.home)` 处理返回事件时才设置为 true。

```kotlin
//（推荐）一般情况
.useTitleBarToReplaceActionBar(false)
.setTitleBarBackPressListener { activity?.finish() }

// 特殊情况（需要 ActionBar 集成）
.useTitleBarToReplaceActionBar(true)

// 然后在 Activity 中：
override fun onOptionsItemSelected(item: MenuItem): Boolean {
    if (item.itemId == android.R.id.home) {
        finish()
        return true
    }
    return super.onOptionsItemSelected(item)
}
```




