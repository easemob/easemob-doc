# 通讯录

<Toc />

`ChatUIKitContactsListFragment` 用于展示通讯录列表，包括联系人搜索，添加联系人，好友申请列表入口，群组列表入口，联系人列表。

昵称在中文或者英文的情况下可以实现按首字母分类。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/page_contact_list.png" title="通讯录" />
</ImageGallery>

## 使用示例

```kotlin
class ContactListActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_contact_list)

        ChatUIKitContactsListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```

## 自定义联系人列表页面

你可以设置联系人页面标题栏、联系人列表 Header 和联系人列表条目。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom_contact_list.png" title="联系人列表页面" />
</ImageGallery>

### 通过 ChatUIKitContactsListFragment.Builder 自定义

`ChatUIKitContactsListFragment` 提供了 Builder 构建方式，方便开发者进行一些自定义设置。目前提供的设置项如下：

```kotlin
ChatUIKitContactsListFragment.Builder()
  .useTitleBar(true)
  .setTitleBarTitle("title")
  .enableTitleBarPressBack(true)
  .setTitleBarBackPressListener(onBackPressListener)
  .useSearchBar(false)
  .setSearchType(ChatUIKitSearchType.USER)
  .setListViewType(ChatUIKitListViewType.VIEW_TYPE_LIST_CONTACT)
  .setSideBarVisible(true)
  .setHeaderItemVisible(true)
  .setHeaderItemList(mutableListOf<ChatUIKitCustomHeaderItem>())
  .setOnHeaderItemClickListener(OnHeaderItemClickListener)
  .setOnUserListItemClickListener(OnUserListItemClickListener)
  .setOnItemLongClickListener(onItemLongClickListener)
  .setOnContactSelectedListener(OnContactSelectedListener)
  .setEmptyLayout(R.layout.layout_conversation_empty)
  .setCustomAdapter(customAdapter)
  .setCustomFragment(myContactsListFragment)
  .build()
```

`ChatUIKitContactsListFragment#Builder` 提供的方法解释：

| 方法                               | 描述                                                                                            |
|----------------------------------|-----------------------------------------------------------------------------------------------|
| useTitleBar()                    | 是否使用默认的标题栏（ChatUIKitTitleBar）。<br/> - `true`：是。 <br/> - (默认) `false`: 否。                               |
| setTitleBarTitle()               | 设置标题栏的标题。                                                                                     |
| enableTitleBarPressBack()        | 设置是否支持显示返回按钮，默认为不显示返回按钮。<br/> - `true`：是。<br/> - (默认) `false`: 否。                                |
| setTitleBarBackPressListener()   | 设置点击标题栏返回按钮的监听器。                                                                              |
| useSearchBar()                   | 设置是否使用搜索栏。<br/> - `true`：是。 <br/> - (默认) `false`: 否。                                     |
| setSearchType()                  | 设置搜索类型 ChatUIKitSearchType。<br/> - `USER` <br/> - `SELECT_USER` <br/> - `CONVERSATION`                              |
| setListViewType()                | 设置列表类型 ChatUIKitListViewType。<br/> - `LIST_CONTACT`：默认联系人列表，不带复选框；<br/> - `LIST_SELECT_CONTACT`：带复选框的联系人列表。 |
| setSideBarVisible()              | 设置是否显示首字母索引工具栏。<br/> - (默认) `true`：是。 <br/> - `false`: 否。                             |
| setHeaderItemVisible()           | 设置是否显示列表头部布局。                                                                                 |
| setHeaderItemList()              | 设置列表头部 Item 数据对象列表。                                                                             |
| setOnHeaderItemClickListener()   | 设置列表头部 Item 点击事件。                                                                               |
| setOnUserListItemClickListener() | 设置列表条目点击事件。                                                                                   |
| setOnItemLongClickListener()     | 设置条目长按事件监听器。                                                                                  |
| setOnContactSelectedListener()   | 设置条目选中事件监听器。                                                                                  |
| setEmptyLayout()                 | 设置会话列表的空白页面。                                                                                  |
| setCustomAdapter()               | 设置自定义的适配器，默认为 `ChatUIKitContactListAdapter`。                                                    |
| setCustomFragment()              | 设置自定义聊天 Fragment，需要继承自 `ChatUIKitContactsListFragment`。                                          |

### 设置标题栏

聊天页面、会话列表页面、联系人列表页面、群详情页面和联系人详情页面的标题栏均使用 `ChatUIKitTitleBar`。如果聊天页面的标题栏不满足需求，建议自定义标题栏。关于标题栏中的标题、头像、背景色、标题栏右侧按钮的显示图片和左侧的头像，详见[自定义会话列表页面的标题栏](chatuikit_custom_conversation_list.html#设置标题栏)。

### 自定义联系人列表 Header 

本节中的自定义联系人列表 header 基于使用 `ChatUIKitContactsListFragment`。

你可以通过 `ChatUIKitContactsListFragment#Builder中的setHeaderItemList` 设置联系人列表 Header List 数据源。

下面的示例代码展示如何设置数据项：

```kotlin
     
     ChatUIKitContactsListFragment.Builder().setHeaderItemList(mutableListOf(
        ChatUIKitCustomHeaderItem(
            headerId = "",              //唯一 itemId
            order = 0,                  //排列次序
            headerIconRes = -1,         //图标资源
            headerTitle = "",           //标题
            headerContent = "",         //内容
            headerEndIconRes = -1,      //尾部图标资源
            headerItemDivider = true,   //是否显示分割线
            headerItemShowArrow = false //是否显示尾部图标
        )
     ))

```

添加 Header List Item 点击事件：

```kotlin

    ChatUIKitContactsListFragment.Builder().setOnHeaderItemClickListener(object : OnHeaderItemClickListener{
            override fun onHeaderItemClick(v: View, itemIndex: Int, itemId: Int?) {
                        
            }
    })

```

### 添加自定义联系人布局

开发者可以继承 `ChatUIKitContactListAdapter` 实现自己的 `CustomContactListAdapter`，然后将 `CustomContactListAdapter` 设置到 `ChatUIKitContactsListFragment#Builder#setCustomAdapter` 中。

1. 创建自定义适配器 `CustomContactListAdapter`，继承自 `ChatUIKitContactListAdapter`，重写 `getViewHolder` 和 `getItemNotEmptyViewType` 方法。

```kotlin
class CustomContactListAdapter : ChatUIKitContactListAdapter() {
    override fun getItemNotEmptyViewType(position: Int): Int {
        // 根据消息类型设置自定义 itemViewType。
        // 如果使用默认的 itemViewType，返回 super.getItemNotEmptyViewType(position) 即可。
        return CUSTOM_YOUR_CONTACT_TYPE
    }

    override fun getViewHolder(parent: ViewGroup, viewType: Int): ViewHolder<ChatUIKitUser> {
        // 根据返回的 viewType 返回对应的 ViewHolder。
        // 返回自定义的 ViewHolder 或者使用默认的 super.getViewHolder(parent, viewType)
        return CUSTOM_YOUR_VIEW_HOLDER()
    }
}
```

2. 添加 `CustomContactListAdapter` 到 `ChatUIKitContactsListFragment#Builder`。

```kotlin
builder.setCustomAdapter(CustomContactListAdapter)
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/contactlist_configurable.png" title="可选择的联系人列表" />
</ImageGallery>

### 设置成可选择的联系人列表

例如，创建群组时需添加多个用户，可点击联系人对应的复选框进行选择。

```kotlin
builder.setSearchType(ChatUIKitSearchType.SELECT_USER)  
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/contactlist_configurable.png" title="设置成可选择的联系人列表" />
</ImageGallery>

### 设置联系人头像样式

```kotlin
 // uikit_configures.xml style 文件 支持修改以下配置：
 <!-- Set default avatar shape type: NONE = 0, ROUND = 1, RECTANGLE = 2 -->
    <integer name="ease_avatar_shape_type">2</integer>
    <!-- Set default avatar round radius -->
    <dimen name="ease_avatar_round_radius">@dimen/ease_corner_extra_small</dimen>
    <!-- Set default avatar border width -->
    <dimen name="ease_avatar_border_width">-1dp</dimen>
    <!-- Set default avatar border color -->
    <color name="ease_avatar_border_color">@color/ease_color_primary</color>
```

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/android/contactlist_avatar_squar.png" title="方形头像" />
  <ImageItem src="/images/uikit/chatuikit/android/contactlist_avatar_circle.png" title="圆形头像" />
  <ImageItem src="/images/uikit/chatuikit/android/contactlist_avatar_no.png" title="没有头像" />
</ImageGallery>

## 事件监听

```kotlin
ChatUIKitContactsListFragment.Builder()
  .setOnHeaderItemClickListener(OnHeaderItemClickListener)
  .setOnUserListItemClickListener(OnUserListItemClickListener)
  .setOnItemLongClickListener(onItemLongClickListener)
  .setOnContactSelectedListener(OnContactSelectedListener)
  .build()
```

| 方法                     | 描述           |
|----------------------|----------------|
| setOnHeaderItemClickListener()   | 设置列表头部 Item 点击事件。                                                                               |
| setOnUserListItemClickListener() | 设置列表条目点击事件。                                                                                   |
| setOnItemLongClickListener()     | 设置条目长按事件监听器。                                                                                  |
| setOnContactSelectedListener()   | 设置条目选中事件监听器。                                                                                  |


## 联系人列表页面其他设置

其他标记为 open 的方法均为可重载方法。如有需要，可重载对应方法实现自己业务逻辑。

### 获取好友请求未读数

```kotlin
val systemConversation = ChatUIKitNotificationMsgManager.getInstance().getConversation() 
systemConversation.let { cv->
    newRequestCount = cv.unreadMsgCount
}
```




