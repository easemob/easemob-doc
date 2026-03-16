# 会话列表的基本设置

本文介绍如何通过 `ChatUIKitConversationListFragment` 实现会话列表的基本设置，包括会话列表空白页面、添加自定义会话列表和设置会话事件监听。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title= "会话列表 ChatUIKitConversationListFragment" />
</ImageGallery>

## 概述

`ChatUIKitConversationListFragment` 提供了 `Builder` 构建方式，支持以下会话自定义设置：

- [设置会话列表空白页面](#设置会话列表空页面)。
- [添加自定义会话列表](#添加自定义会话列表)：自定义会话列表布局。
- [设置会话事件监听](#设置事件监听)。

使用示例如下：

```kotlin
ChatUIKitConversationListFragment.Builder()
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

`ChatUIKitConversationListFragment#Builder` 提供的方法如下表所示：

| 方法                            | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `useTitleBar()`                   | 是否使用默认的标题栏 `ChatUIKitTitleBar`。 <br/> - `true`：是。 <br/> - (默认) `false`: 否。<br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。 |
| `setTitleBarTitle()`              | 设置标题栏的标题。 <br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。                                          |
| `enableTitleBarPressBack()`       | 设置是否支持显示返回按钮，默认为不显示。<br/> - `true`：显示。<br/> - (默认) `false`: 不显示。<br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。 |
| `setTitleBarBackPressListener()`  | 设置点击标题栏返回按钮的监听器。<br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。                             |
| `setItemClickListener()`          | 设置会话条目点击事件监听器。                                     |
| `setOnItemLongClickListener()`    | 设置会话条目长按事件监听器。                                     |
| `setOnMenuItemClickListener()`    | 设置会话菜单点击事件监听器。                                 |
| `setConversationChangeListener()` | 设置会话变化的监听器。                                       |
| `setEmptyLayout()`                | 设置会话列表的空白页面。                                     |
| `setCustomAdapter()`              | 设置自定义的适配器，默认为 `ChatUIKitConversationListAdapter`。 |
| `setCustomFragment()`             | 设置自定义聊天 `Fragment`，需要继承自 `ChatUIKitConversationListFragment`。 |

## 设置会话列表空页面

`ChatUIKitConversationListFragment#Builder` 提供 `setEmptyLayout()` 设置会话列表的空白页面。

```kotlin
ChatUIKitConversationListFragment.Builder()
    .setEmptyLayout(R.layout.layout_conversation_empty)
    .build()
```

## 添加自定义会话列表

开发者可以继承 `ChatUIKitConversationListAdapter` 实现自己的 `CustomConversationListAdapter`，然后将 `CustomConversationListAdapter` 设置到 `ChatUIKitConversationListFragment#Builder#setCustomAdapter` 中。

1. 创建自定义适配器 `CustomConversationListAdapter`，继承自 `ChatUIKitConversationListAdapter`，重写 `getViewHolder` 和 `getItemNotEmptyViewType` 方法。

```kotlin
class CustomConversationListAdapter (
    config: ChatUIKitConvItemConfig = ChatUIKitConvItemConfig()
): ChatUIKitConversationListAdapter(config) {
    companion object {
        private const val typeSingleChat = 1
        private const val typeGroupChat = 2
    }

    override fun getItemNotEmptyViewType(position: Int): Int {
        //伪代码
        //假设这里以不同的 conversationType 返回不同的 viewType 示例，你可以根据你自己的业务需求调整
        val conversationType = getItem(position)?.conversationType
        when (conversationType) {
            ChatConversationType.Chat -> {
                return typeSingleChat
            }
            ChatConversationType.GroupChat -> {
                return typeGroupChat
            }
            else -> {
                return typeSingleChat
            }
        }
    }

    override fun getViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ViewHolder<ChatUIKitConversation> {
        //伪代码
        when (viewType) {
            typeSingleChat -> {
                return MySingleChatViewHolder(
                    MySingleChatItemViewBinding
                        .inflate(LayoutInflater.from(parent.context), parent, false), config
                )
            }
            else -> {
                return MyGroupChatViewHolder(
                    MyGroupChatItemViewBinding
                        .inflate(LayoutInflater.from(parent.context), parent, false), config
                )
            }
        }
    }
}
```

```kotlin
class MySingleChatViewHolder( private val viewBinding: MySingleChatItemViewBinding,
                              var config: ChatUIKitConvItemConfig? = ChatUIKitConvItemConfig()
) : ChatUIKitBaseRecyclerViewAdapter.ViewHolder<ChatUIKitConversation>(binding = viewBinding) {

    init {
        // 这里可以进行一些初始化操作
        // 比如设置特定的样式或配置
        config?.bindView(viewBinding)
    }

    override fun initView(itemView: View?) {
        super.initView(itemView)
        // 这里可以进行一些视图的初始化操作
    }

    override fun setData(item: ChatUIKitConversation?, position: Int) {
        //根据你的UI来设置数据
    }
}
```

2. 添加 `CustomConversationListAdapter` 到 `ChatUIKitConversationListFragment#Builder`。

```kotlin
var mConversationListFragment = ChatUIKitConversationListFragment.Builder()
    .setCustomAdapter(CustomConversationListAdapter())
    .build()
```

3. 通过继承 `ChatUIKitConversationListFragment` 进行自定义设置。

创建自定义 `CustomConversationListFragment`，继承自 `ChatUIKitConversationListFragment`，并设置到 `ChatUIKitConversationListFragment#Builder` 中。

```kotlin
val customConversationListFragment = CustomConversationListFragment()
val mConversationListFragment = ChatUIKitConversationListFragment.Builder()
    .setCustomFragment(customConversationListFragment)
    .build()
```

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/android/conversation_list_custom_all.png" title="会话列表完整展示" />
  <ImageItem src="/images/uikit/chatuikit/android/conversation_list_custom_noavatar.png" title="会话列表无头像" />
  <ImageItem src="/images/uikit/chatuikit/android/conversation_list_custom_noavatarsutbtitle.png" title="会话列表无头像、无最新消息" />
</ImageGallery>

## 设置事件监听

`ChatUIKitConversationListFragment.Builder` 提供针对会话条目及长按菜单的事件监听配置。建议通过 Builder 进行统一设置。

```kotlin
ChatUIKitConversationListFragment.Builder()
    .setItemClickListener(onItemClickListener)
    .setOnItemLongClickListener(onItemLongClickListener)
    .setOnMenuItemClickListener(onMenuItemClickListener)
    .setConversationChangeListener(conversationChangeListener)
    .build()
```

| 方法        | 描述                          |
| :-------------- | :----- | 
| `setItemClickListener`          | 设置会话条目点击事件监听器。                                        |
| `setOnItemLongClickListener`    | 设置会话条目长按事件监听器。                                        |
| `setOnMenuItemClickListener`    | 设置会话条目长按后弹出的菜单项的点击事件监听器。                                    |
| `setConversationChangeListener` | 设置会话变化的监听器，例如会话被删除时触发。                    |

## 默认会话操作

长按会话条目会显示会话操作菜单。会话列表页面使用 `ChatUIKitConversationListViewModel` 中提供的方法默认实现以下操作：

| 会话操作            | 描述   |
| :-------------- | :----- | 
| 会话免打扰       | - `makeSilentForConversation`：设置会话免打扰。<br/> - `cancelSilentForConversation` ：取消会话免打扰。   |
| 会话置顶            | - `pinConversation`：置顶会话。<br/> - `unpinConversation`：取消置顶。     |
| 会话标记已读           | `makeConversionRead`：标记会话为已读状态。    |
| 会话删除            | `deleteConversation`：删除会话。   |

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_long_press.png" title="会话长按显示的操作" />
</ImageGallery>

## 可重载方法标记

其他标记为 open / override fun 的方法均为可重载方法。如有需要，可重载对应方法实现自己业务逻辑。
