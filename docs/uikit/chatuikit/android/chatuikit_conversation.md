# 会话列表

<Toc />

`EaseConversationListFragment` 用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并且提供会话搜索、删除、置顶和免打扰功能。
- 对于单聊, 会话展示的名称为对端用户的昵称，若对端用户未设置昵称则展示对方的用户 ID；会话头像是对方的头像，如果没有设置则使用默认头像。
- 对于群聊，会话名称为当前群组的名称，头像为默认头像。

![img](@static/images/uikit/chatuikit/android/page_conversation.png) 

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

## 进阶用法

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
        // 如果使用默认的 itemViewTyp，返回 super.getItemNotEmptyViewType(position) 即可。
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

### 通过继承 EaseConversationListFragment 进行自定义设置

创建自定义 `CustomConversationListFragment`，继承自 `EaseConversationListFragment`，并设置到 `EaseConversationListFragment#Builder` 中。

```kotlin
builder.setCustomFragment(customConversationListFragment);
```

![img](@static/images/uikit/chatuikit/android/conversation_list_custom.png =200x450)

### 设置会话头像和昵称

```kotlin
EaseIM.setConversationInfoProvider(object : EaseConversationInfoProvider {
    // 同步获取会话信息
    override fun getProfile(id: String?, type: ChatConversationType): EaseProfile? {
        return when(type) {
            ChatConversationType.Chat ->{
                // 可以从本地数据库或者缓存中获取用户信息，并返回，不可进行异步操作。
                loadUserInfoFromLocal(id)
            }

            ChatConversationType.GroupChat -> {
                // 可以从本地数据库或者缓存中获取群组信息，并返回，不可进行异步操作。
                loadGroupInfoFromLocal(id)
            }

            else -> null
        }
        return null
    }

    override fun fetchProfiles(
        idsMap: Map<ChatConversationType, List<String>>,
        onValueSuccess: OnValueSuccess<List<EaseProfile>>
    ) {
        fetchProfilesFromServer(idsMap, onValueSuccess)
    }

})
```

![img](@static/images/uikit/chatuikit/android/cvs-nick.png =200x450)

## EaseConversationListFragment 中默认实现的功能

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

![img](@static/images/uikit/chatuikit/android/cvs-action.png =200x450)

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










