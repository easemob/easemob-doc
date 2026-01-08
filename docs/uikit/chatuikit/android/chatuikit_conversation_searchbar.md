# 设置会话搜索栏

会话列表页面支持按会话名称搜索会话。你可以设置是否使用搜索栏、自定义搜索栏的样式和自定义跳转路由。

// TODO：添加会话搜索栏图片

## 设置使用默认搜索栏

你可以设置是否使用默认搜索栏：

```kotlin
// true：使用；(默认) false: 不使用。 
ChatUIKitConversationListFragment.Builder().useSearchBar(true)   
```

## 自定义搜索栏样式

`ChatUIKitSearchView` 是 UIKit 内置的搜索栏 View，可用于会话列表、联系人等页面的“点击进入搜索”入口。

`ChatUIKitSearchView` 支持自定义搜索图标、图标 tint、图标与文字间距、hint/文本、文本颜色、文本大小、对齐方式以及背景等。

### 自定义样式属性

`ChatUIKitSearchView` 支持通过 XML 属性或 style item 自定义以下样式（对应 `declare-styleable name="ChatUIKitSearchView"`）：

| 属性描述       | XML 属性                        | Style Item                  |
| :------------- | :------------------------------ | :-------------------------- |
| 搜索图标       | `app:search_drawable_icon`      | `search_drawable_icon`      |
| 搜索图标 tint  | `app:search_drawable_icon_tint` | `search_drawable_icon_tint` |
| 图标与文字间距 | `app:search_drawable_padding`   | `search_drawable_padding`   |
| Hint 文案      | `app:search_text_hint`          | `search_text_hint`          |
| 文本颜色       | `app:search_text_color`         | `search_text_color`         |
| 文本大小       | `app:search_text_size`          | `search_text_size`          |
| 默认文本内容   | `app:search_text`               | `search_text`               |
| 整体对齐方式   | `app:search_gravity`            | `search_gravity`，可选：`center / start / end / top / bottom / center_vertical / center_horizontal`          |

// TODO：这个跟 Hint 文案有什么差别？下面两种方式种没看到这个。

你可以通过以下方式配置以上样式：

- （推荐）方式一：通过 style 统一配置

在你的 App 工程新增一个 style 继承 `ease_widget_search_view`，然后在布局中引用：

```xml
<!-- res/values/styles.xml -->
<style name="AppSearchBarStyle" parent="ease_widget_search_view">
    <item name="search_drawable_icon">@drawable/ic_search</item>
    <item name="search_drawable_icon_tint">@color/app_search_icon_tint</item>
    <item name="search_drawable_padding">8dp</item>
    <item name="search_text_hint">@string/app_search_hint</item>
    <item name="search_text_color">@color/app_search_text_color</item>
    <item name="search_text_size">@dimen/app_search_text_size</item>
    <item name="search_gravity">start</item>
    <!-- 也可以同时配置 View 本身的 padding/高度等 -->
    <item name="android:layout_height">44dp</item>
    <item name="android:paddingStart">12dp</item>
    <item name="android:paddingEnd">12dp</item>
</style>

<!-- res/layout/xxx.xml -->
<com.hyphenate.easeui.widget.ChatUIKitSearchView
    android:id="@+id/search_bar"
    style="@style/AppSearchBarStyle"/>
```

- 方式二：在布局中按需覆盖：

```xml
<com.hyphenate.easeui.widget.ChatUIKitSearchView
    android:id="@+id/search_bar"
    android:layout_width="match_parent"
    android:layout_height="44dp"
    android:paddingStart="12dp"
    android:paddingEnd="12dp"
    app:search_drawable_icon="@drawable/ic_search"
    app:search_drawable_icon_tint="@color/app_search_icon_tint"
    app:search_drawable_padding="8dp"
    app:search_text_hint="@string/app_search_hint"
    app:search_text_color="@color/app_search_text_color"
    app:search_text_size="@dimen/app_search_text_size"
    app:search_gravity="start"/>
```

### 自定义搜索栏背景

`ChatUIKitSearchView` 的背景默认来自内部根布局 `search_root` 引用的 `@style/ease_widget_search_view_root`，其默认背景为 `@drawable/uikit_search_bg`。

你可以用以下任一方式自定义：

- （推荐）**覆盖背景 drawable**
  在 App 项目中添加同名资源文件 `drawable/uikit_search_bg`，该资源将自动覆盖 SDK 内置的默认背景。
- **自定义根布局样式**
  在 App 项目中定义同名样式 `ease_widget_search_view_root`，并通过修改 `android:background` 属性来自定义背景样式。

```xml
<!-- res/values/styles.xml：同名覆盖 -->
<style name="ease_widget_search_view_root">
    <item name="android:background">@drawable/app_search_bg</item>
</style>
```

### 常用函数示例

`ChatUIKitSearchView` 提供一组 setter，可用于代码动态配置和运行时切换主题等场景。

```kotlin
val searchBar = findViewById<ChatUIKitSearchView>(R.id.search_bar)

// 图标 / tint 
searchBar.setIcon(R.drawable.ic_search)
searchBar.setIconTint(ContextCompat.getColor(this, R.color.app_search_icon_tint))

//hint / 文本
searchBar.setHint(R.string.app_search_hint)
searchBar.setText("搜索会话")

// 文本样式
searchBar.setTextColor(ContextCompat.getColor(this, R.color.app_search_text_color))
searchBar.setTextSize(R.dimen.app_search_text_size) // 推荐用 dimen（内部会转 px）

//对齐方式（等同于 XML 的 app:search_gravity）
searchBar.setGravity(Gravity.START or Gravity.CENTER_VERTICAL)

// 图标与文字间距（px）
searchBar.setDrawablePadding(resources.getDimensionPixelSize(R.dimen.app_search_drawable_padding))

// 点击事件（通常点击进入搜索页）
searchBar.setOnClickListener {
    // startActivity(Intent(this, ChatUIKitSearchActivity::class.java))
}
```

### 相关默认资源

对于以下默认资源，你可按需覆盖：

| 描述                   | Style 引用                            | 默认值/说明                 |
| :--------------------- | :------------------------------------ | :-------------------------- |
| 搜索栏整体 style       | `@style/ease_widget_search_view`      |                             |
| 搜索栏根布局背景 style | `@style/ease_widget_search_view_root` | `@drawable/uikit_search_bg` |
| 默认搜索图标           | `@style/ease_search_view_drawable`    | `@drawable/search`          |
| 默认搜索文字样式       | `@style/ease_search_view_tv_text`     |                             |

## 自定义跳转路由

搜索栏点击后默认跳转 `ChatUIKitSearchActivity` 搜索页面。如果默认的搜索无法满足用户需求，可以通过 `setCustomActivityRoute` 修改跳转路由，跳转自己的搜索页面。

```kotlin
ChatUIKitClient.setCustomActivityRoute(object : ChatUIKitCustomActivityRoute {
    override fun getActivityRoute(intent: Intent): Intent? {
        intent.component?.className?.let {
             when(it) {
                ChatUIKitSearchActivity::class.java.name -> {   
                    intent.setClass(context, MySearchActivity::class.java)    
                }
                else -> {
                    return intent
                }
             }
        }
    }
})
```


## 可重载方法标记

其他标记为 open / override fun 的方法均为可重载方法。如有需要，可重载对应方法实现自己业务逻辑。