# 通讯录

<Toc />

`EaseContactsListFragment` 用于展示通讯录列表。昵称在中文或者英文的情况下可以实现按首字母分类。

// TODO：添加组件图，研发提供

## 使用示例

```kotlin
class ContactListActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_contact_list)

        EaseContactsListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```

## 进阶用法

### 通过 EaseContactsListFragment.Builder 自定义设置

`EaseContactsListFragment` 提供了 Builder 构建方式，方便开发者进行一些自定义设置。目前提供的设置项如下：

```kotlin
EaseContactsListFragment.Builder()
  .useTitleBar(true)
  .setTitleBarTitle("title")
  .enableTitleBarPressBack(true)
  .setTitleBarBackPressListener(onBackPressListener)
  .useSearchBar(false)
  .setSearchType(EaseSearchType.USER)
  .setListViewType(EaseListViewType.VIEW_TYPE_LIST_CONTACT)
  .setSideBarVisible(true)
  .setHeaderItemVisible(true)
  .setHeaderItemList(mutableListOf<EaseCustomHeaderItem>())
  .setOnHeaderItemClickListener(OnHeaderItemClickListener)
  .setOnUserListItemClickListener(OnUserListItemClickListener)
  .setOnItemLongClickListener(onItemLongClickListener)
  .setOnContactSelectedListener(OnContactSelectedListener)
  .setEmptyLayout(R.layout.layout_conversation_empty)
  .setCustomAdapter(customAdapter)
  .setCustomFragment(myContactsListFragment)
  .build()
```

`EaseContactsListFragment#Builder` 提供的方法解释：

| 方法                               | 描述                                                                                            |
|----------------------------------|-----------------------------------------------------------------------------------------------|
| useTitleBar()                    | 是否使用默认的标题栏（EaseTitleBar）。<br/> - `true`：是。 <br/> - (默认) `false`: 否。                               |
| setTitleBarTitle()               | 设置标题栏的标题。                                                                                     |
| enableTitleBarPressBack()        | 设置是否支持显示返回按钮，默认为不显示返回按钮。<br/> - `true`：是。<br/> - (默认) `false`: 否。                                |
| setTitleBarBackPressListener()   | 设置点击标题栏返回按钮的监听器。                                                                              |
| useSearchBar()                   | 设置是否使用搜索栏。<br/> - `true`：是。 <br/> - (默认) `false`: 否。                                     |
| setSearchType()                  | 设置搜索类型 EaseSearchType。<br/> - `USER` <br/> - `SELECT_USER` <br/> - `CONVERSATION`                              |
| setListViewType()                | 设置列表类型 EaseListViewType。<br/> - `LIST_CONTACT`：默认联系人列表，不带复选框；<br/> - `LIST_SELECT_CONTACT`：带复选框的联系人列表。 |
| setSideBarVisible()              | 设置是否显示首字母索引工具栏。<br/> - (默认) `true`：是。 <br/> - `false`: 否。                             |
| setHeaderItemVisible()           | 设置是否显示列表头部布局。                                                                                 |
| setHeaderItemList()              | 设置列表头部 Item 数据对象列表。                                                                             |
| setOnHeaderItemClickListener()   | 设置列表头部 Item 点击事件。                                                                               |
| setOnUserListItemClickListener() | 设置列表条目点击事件。                                                                                   |
| setOnItemLongClickListener()     | 设置条目长按事件监听器。                                                                                  |
| setOnContactSelectedListener()   | 设置条目选中事件监听器。                                                                                  |
| setEmptyLayout()                 | 设置会话列表的空白页面。                                                                                  |
| setCustomAdapter()               | 设置自定义的适配器，默认为 `EaseConversationListAdapter`。                                                    |
| setCustomFragment()              | 设置自定义聊天 Fragment，需要继承自 `EaseConversationListFragment`。                                          |

## 自定义联系人列表

### 添加自定义联系人布局

开发者可以继承 `EaseContactListAdapter` 实现自己的 `CustomContactListAdapter`，然后将 `CustomContactListAdapter` 设置到 `EaseContactsListFragment#Builder#setCustomAdapter` 中。

1. 创建自定义适配器 `CustomContactListAdapter`，继承自 `EaseContactListAdapter`，重写 `getViewHolder` 和 `getItemNotEmptyViewType` 方法。

```kotlin
class CustomContactListAdapter : EaseContactListAdapter() {
    override fun getItemNotEmptyViewType(position: Int): Int {
        // 根据消息类型设置自定义 itemViewType。
        // 如果使用默认的 itemViewTyp，返回 super.getItemNotEmptyViewType(position) 即可。
        return CUSTOM_YOUR_CONTACT_TYPE
    }

    override fun getViewHolder(parent: ViewGroup, viewType: Int): ViewHolder<EaseUser> {
        // 根据返回的 viewType 返回对应的 ViewHolder。
        // 返回自定义的 ViewHolder 或者使用默认的 super.getViewHolder(parent, viewType)
        return CUSTOM_YOUR_VIEW_HOLDER()
    }
}
```

2. 添加 `CustomContactListAdapter` 到 `EaseContactsListFragment#Builder`。

```kotlin
builder.setCustomAdapter(CustomContactListAdapter)
```

//TODO：添加图片，研发提供

### 设置成可选择的联系人列表

例如，创建群组时需添加多个用户，可点击联系人对应的复选框进行选择。

```kotlin
builder.setSearchType(EaseSearchType.SELECT_USER)  
```

//TODO：添加图片，研发提供

## 事件监听

```kotlin
EaseContactsListFragment.Builder()
  .setOnHeaderItemClickListener(OnHeaderItemClickListener)
  .setOnUserListItemClickListener(OnUserListItemClickListener)
  .setOnItemLongClickListener(onItemLongClickListener)
  .setOnContactSelectedListener(OnContactSelectedListener)
  .build()
```

| 方法                               | 描述                                                                                            |
|----------------------------------|-----------------------------------------------------------------------------------------------|
| setOnHeaderItemClickListener()   | 设置列表头部 Item 点击事件。                                                                               |
| setOnUserListItemClickListener() | 设置列表条目点击事件。                                                                                   |
| setOnItemLongClickListener()     | 设置条目长按事件监听器。                                                                                  |
| setOnContactSelectedListener()   | 设置条目选中事件监听器。                                                                                  |


## 更多

```kotlin
val systemConversation = EaseNotificationMsgManager.getInstance().getConversation() 
systemConversation.let { cv->
    newRequestCount = cv.unreadMsgCount
}
```




