# 会话列表

<Toc />

`EaseConversationListFragment` 用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并且提供会话搜索、删除、置顶和免打扰功能。

- 点击搜索按钮，跳转到搜索页面，搜索会话。
- 点击会话列表项，跳转到会话详情页面。
- 点击标题栏的扩展按钮，选择新会话，创建新会话。
- 长按会话列表项显示菜单，可进行删除会话、置顶会话、消息免打扰操作。

单条会话展示会话名称、最后一条消息、最后一条消息的时间以及置顶和禁言状态等。

- 对于单聊, 会话展示的名称为对端用户的昵称，若对端用户未设置昵称则展示对方的用户 ID；会话头像是对方的头像，如果没有设置则使用默认头像。
- 对于群聊，会话名称为当前群组的名称，头像为默认头像。

会话列表相关功能，详见[功能介绍文档](chatfeature_conversation.html)。

![img](/images/uikit/chatuikit/android/page_conversation.png =400x840) 

## 使用示例

```kotlin
class ConversationListActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_conversation_list)

        EaseConversationListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```

## 自定义会话列表页面

你可以配置会话列表页面的标题栏、会话列表项。

![img](/images/uikit/chatuikit/android/custom_conversation_list.png)

### 通过 EaseConversationListFragment.Builder 自定义设置

`EaseConversationListFragment` 提供了 Builder 构建方式，方便开发者进行一些自定义设置，目前提供的设置项如下：

```kotlin
EaseConversationListFragment.Builder()
    .useTitleBar(true)
    .setTitleBarTitle("title")
    .enableTitleBarPressBack(true)
    .setTitleBarBackPressListener(onBackPressListener)
    .useSearchBar(false)
    .setItemClickListener(onItemClickListener)
    .setOnItemLongClickListener(onItemLongClickListener)
    .setOnMenuItemClickListener(onMenuItemClickListener)
    .setConversationChangeListener(conversationChangeListener)
    .setEmptyLayout(R.layout.layout_conversation_empty)
    .setCustomAdapter(customAdapter)
    .setCustomFragment(myConversationListFragment)
    .build()
```

`EaseConversationListFragment#Builder` 提供的方法如下表所示：

| 方法                             | 描述                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| useTitleBar()                      | 是否使用默认的标题栏（`EaseTitleBar`）。<br/> - `true`：是。 <br/> - (默认) `false`: 否。           |
| setTitleBarTitle()                 | 设置标题栏的标题。                                            |
| enableTitleBarPressBack()          | 设置是否支持显示返回按钮，默认为不显示返回按钮。<br/> - `true`：是。 <br/> - (默认) `false`: 否。              |
| setTitleBarBackPressListener()    | 设置点击标题栏返回按钮的监听器。                               |
| setItemClickListener()          | 设置条目点击事件监听器。                                       |
| setOnItemLongClickListener()    | 设置条目长按事件监听器。                                       |
| setOnMenuItemClickListener()    | 设置条目菜单点击事件监听器。                                       |
| setConversationChangeListener() | 设置会话变化的监听器。                                        |
| setEmptyLayout()                | 设置会话列表的空白页面。                                       |
| setCustomAdapter()              | 设置自定义的适配器，默认为 `EaseConversationListAdapter`。       |
| setCustomFragment()             | 设置自定义聊天 `Fragment`，需要继承自 `EaseConversationListFragment`。 |

### 添加自定义会话布局

开发者可以继承 `EaseConversationListAdapter` 实现自己的 `CustomConversationListAdapter`，然后将 `CustomConversationListAdapter` 设置到 `EaseConversationListFragment#Builder#setCustomAdapter` 中。

1. 创建自定义适配器 `CustomConversationListAdapter`，继承自 `EaseConversationListAdapter`，重写 `getViewHolder` 和 `getItemNotEmptyViewType` 方法。

```kotlin
class CustomConversationListAdapter : EaseConversationListAdapter() {
    override fun getItemNotEmptyViewType(position: Int): Int {
        // 根据消息类型设置自定义 itemViewType。
        // 如果使用默认的 itemViewType，返回 super.getItemNotEmptyViewType(position) 即可。
        return CUSTOM_YOUR_CONVERSATION_TYPE
    }

    override fun getViewHolder(parent: ViewGroup, viewType: Int): ViewHolder<EaseConversation> {
        // 根据返回的 viewType 返回对应的 ViewHolder。
        // 返回自定义的 ViewHolder 或者使用默认的 super.getViewHolder(parent, viewType)
        return CUSTOM_YOUR_VIEW_HOLDER()
    }
}
```

2. 添加 `CustomConversationListAdapter` 到 `EaseConversationListFragment#Builder`。

```kotlin
builder.setCustomAdapter(customConversationListAdapter);
```

3. 通过继承 `EaseConversationListFragment` 进行自定义设置。

创建自定义 `CustomConversationListFragment`，继承自 `EaseConversationListFragment`，并设置到 `EaseConversationListFragment#Builder` 中。

```kotlin
builder.setCustomFragment(customConversationListFragment);
```

![img](/images/uikit/chatuikit/android/conversation_list_custom.png)

### 设置标题栏

会话列表页面、聊天页面、联系人列表页面、群详情页面和联系人详情页面的标题栏均使用 `EaseTitleBar`。如果会话列表页面的标题栏不满足需求，建议根据自身需求设置标题栏。

会话列表页面的标题栏包含左、中、右三个区域，本节介绍如何在使用 `EaseConversationListFragment` 的前提下配置这些区域。

#### 设置是否启用标题栏

```kotlin

//是否使用默认的标题栏（EaseTitleBar）：true：是；(默认) false: 否。
EaseConversationListFragment.Builder().useTitleBar()
    
```

#### 设置左侧头像

```kotlin
//使用 binding?.titleConversations 可以直接获取到 EaseTitleBar

binding?.titleConversations?.let { titlebar->
    // 获取 logoView
    titlebar.getLogoView()
    // 设置头像
    titlebar.setLogo()
    // 获取 StatusView 
    titlebar.getStatusView()
    // 设置用户状态
    titlebar.setLogoStatus()
    // 设置用户状态的外间距
    titlebar.setLogoStatusMargin()
    // 设置用户状态图标大小
    titlebar.setLogoStatusSize()
}
    
```

#### 设置左侧头像及文本区域点击事件

```kotlin
// logo 图标区域点击事件 
binding?.titleConversations?.setLogoClickListener {}
// logo status 文本区域点击事件
binding?.titleConversations?.setTitleClickListener {}
    
```

#### 设置中部标题

```kotlin
// 文本设置
EaseConversationListFragment.Builder().setTitleBarTitle("title")
// 图片设置
binding?.titleConversations?.setTitleEndDrawable(R.drawable.conversation_title)
    
```

#### 设置右侧显示图标

一般情况下，右侧会支持设置多个图标。我们采用设置 Menu 的方式进行设置。

`EaseConversationListFragment` 中有默认实现一个 `defaultMenu()` 的方法 添加默认的 menu 菜单。若默认菜单不满足需求，可以替换为自己的 menu 菜单，重写 `defaultMenu()` 方法。   

```kotlin
    // 添加 menu
    override fun defaultMenu() {
        // 自定义满足自身需求的 menu 文件
        binding?.titleConversations?.inflateMenu(R.menu.my_menu)
    }

    // 设置 menu 点击事件
    override fun setMenuItemClick(item: MenuItem): Boolean {
        when(item.itemId) {
            R.id.action_my_menu -> {
                // todo：实现点击指定 menu 后的逻辑处理
                return true
            }
            else -> return false
        }
    }

    // 支持通过 tint 属性设置 menu icon 颜色
    setMenuIconTint(@ColorInt colorInt: Int)
    // 支持设置 menu 文本颜色
    setMenuTitleColor(@ColorInt colorInt: Int)
    // 支持设置隐藏/显示指定 menu 项
    setMenuIconVisible(id:Int,visible:Boolean)

```

#### 设置返回按钮和事件监听

```kotlin

//设置是否支持显示返回按钮：true：是；(默认) false: 否。   
EaseConversationListFragment.Builder().enableTitleBarPressBack()
//设置点击标题栏返回按钮的监听器。 
EaseConversationListFragment.Builder().setTitleBarBackPressListener() 
    
```

#### 设置背景色

设置标题栏的背景色：

```kotlin

binding?.titleConversations?.setBackgroundColor(ContextCompat.getColor(mContext,R.color.blue))
    
```

### 设置搜索区域

#### 设置是否需要搜索功能

```kotlin

// 是否使用默认的搜索功能（跳转 EaseSearchActivity 搜索页面）。目前支持搜索用户、会话、消息、黑名单用户。
// true：是；(默认) false: 否。 
EaseConversationListFragment.Builder().useSearchBar(true)
    
```

#### 自定义搜索

如果默认的搜索无法满足用户需求，可以通过 `setCustomActivityRoute` 修改跳转路由，跳转自己的搜索页面。

```kotlin
EaseIM.setCustomActivityRoute(object : EaseCustomActivityRoute {
    override fun getActivityRoute(intent: Intent): Intent? {
        intent.component?.className?.let {
             when(it) {
                EaseSearchActivity::class.java.name -> {   
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

### 设置会话列表项

要设置会话列表中列表项的内容，你需要执行以下步骤：

需要先获取到 `EaseConversationListLayout` 对象，该对象提供了更加细致的设置项：

```kotlin
    binding?.listConversation?.let{
        it.setItemBackGround()      //设置条目的背景。
        it.setItemHeight()          //设置条目的高度。
        it.setAvatarDefaultSrc()    //设置条目的默认头像。
        it.setAvatarSize()          //设置条目头像的大小。
        it.setAvatarShapeType()     //设置条目头像的样式，分为默认 ImageView 样式，圆形和矩形三种样式。
        it.setAvatarRadius()        //设置条目头像的圆角半径，样式设置为矩形时有效。
        it.setAvatarBorderWidth()   //设置条目头像边框的宽度。 
        it.setAvatarBorderColor()   //设置条目头像边框的颜色。
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

关于设置会话头像和昵称，详见[用户自定义信息文档中的介绍](chatuikit_userinfo.html#设置会话头像和昵称)。

## EaseConversationListFragment 中默认实现的功能

`EaseConversationListFragment` 中默认实现会话免打扰、会话置顶、会话已读和会话删除功能。

![img](/images/uikit/chatuikit/android/cvs-action.png =350x600)

### 免打扰

使用 `EaseConversationListViewModel` 提供的方法设置免打扰，例如:

- `makeSilentForConversation`：设置会话免打扰。
- `cancelSilentForConversation` ：取消会话免打扰。

### 会话置顶

使用 `EaseConversationListViewModel` 提供的方法设置会话置顶，例如:

- `pinConversation`：置顶一个会话。
- `unpinConversation`：取消会话置顶。

### 会话标记已读

使用 `EaseConversationListViewModel` 提供的 `makeConversionRead` 方法标记会话已读。

### 会话删除

使用 `EaseConversationListViewModel` 提供的方法 `deleteConversation` 方法删除会话。

## 事件监听

`EaseConversationListFragment#Builder` 提供的如下监听：

```kotlin
EaseConversationListFragment.Builder()
    .setTitleBarBackPressListener()
    .setItemClickListener(onItemClickListener)
    .setOnItemLongClickListener(onItemLongClickListener)
    .setOnMenuItemClickListener(onMenuItemClickListener)
    .setConversationChangeListener(conversationChangeListener)
    .build()
```

| 方法                             | 描述                                                         |
| -------------------------------- | ------------------------------------------------------------|
| setTitleBarBackPressListener()  | 设置点击标题栏返回按钮的监听器。                                 |
| setItemClickListener()          | 设置条目点击事件监听器。                                        |
| setOnItemLongClickListener()    | 设置条目长按事件监听器。                                        |
| setOnMenuItemClickListener()    | 设置条目菜单点击事件监听器。                                    |
| setConversationChangeListener() | 设置会话变化的监听器。                                         |










