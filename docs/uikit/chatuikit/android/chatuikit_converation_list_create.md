# 会话列表页面

## 概述

`ChatUIKitConversationListFragment` 用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并且提供会话搜索、删除、置顶和免打扰功能。

- 点击搜索按钮，跳转到搜索页面，搜索会话。
- 点击会话列表项，跳转到会话详情页面。
- 点击标题栏的扩展按钮，选择新会话，创建新会话。
- 长按会话列表项显示菜单，可进行删除会话、置顶会话、消息免打扰操作。

单条会话展示会话名称、最后一条消息、最后一条消息的时间以及置顶和禁言状态等。

- 对于单聊, 会话展示的名称为对端用户的昵称，若对端用户未设置昵称则展示对方的用户 ID；会话头像是对方的头像，如果没有设置则使用默认头像。
- 对于群聊，会话名称为当前群组的名称，头像为默认头像。

会话列表相关功能，详见[功能介绍文档](chatfeature_conversation.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="会话列表" />
</ImageGallery>

## 使用示例

```kotlin
class ConversationListActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_conversation_list)

        ChatUIKitConversationListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```



## 创建会话列表页面

单群聊 UIKit 提供 `ChatUIKitConversationListFragment`，添加到 Activity 中即可使用。

示例如下：

```kotlin
class ConversationListActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_conversation_list)

        ChatUIKitConversationListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```
