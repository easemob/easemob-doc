# 会话列表页面介绍

`ChatUIKitConversationListFragment` 用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并且提供会话搜索、删除、置顶和免打扰功能。

## 页面组件

会话列表页面通过 `ChatUIKitConversationListFragment` 实现，由标题栏、搜索栏和会话列表组成。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom_conversation_list.png" title="会话列表页面 ChatUIKitConversationListFragment" />
</ImageGallery>

### 标题栏

标题栏使用统一的  `ChatUIKitTitleBar` 组件，与聊天页面、联系人列表、群详情和联系人详情等页面保持一致。详见 [设置标题栏](chatuikit_custom_titlebar.html)。

### 会话搜索栏

会话搜索栏 `ChatUIKitSearchView` 实现会话搜索。点击搜索按钮，跳转到搜索页面，支持按会话名称过滤。关于自定义，详见 [设置会话搜索栏](chatuikit_custom_conversation_list_searchbar.html)。

### 会话列表

会话列表组件 `ChatUlKitConversationListLayout` 按最新消息时间倒序排列，置顶会话始终显示在顶部。列表包含以下类型的会话：

- 通过标题栏加号创建的本地会话。
- 发送消息后自动生成的单聊会话。
- 群组内发送消息后生成的群聊会话。

**首次加载建议**：在应用首次安装或卸载重装后，建议从服务端拉取历史会话列表，以填充本地数据库。

会话条目组件 `UikitItemConversationListBinding` 实现单条会话展示，每个会话条目展示以下信息：

| 元素     | 说明                                                   |
| :------- | :----------------------------------------------------- |
| 头像     | 单聊显示对方头像（默认头像占位）；群聊显示群组默认头像。 |
| 名称     | 单聊显示对方昵称或 ID；群聊显示群组名称或 ID。           |
| 最新消息 | 显示最近一条消息的内容。                                |
| 消息时间 | 最新消息的发送时间。                                     |
| 状态标识 | 置顶、免打扰等状态图标。                                |

**交互操作**：

- **点击**：跳转至该会话的聊天页面。
- **长按**：弹出操作菜单，支持免打扰、置顶、标记已读、删除。

关于会话自定义，详见 [会话列表的基础设置](chatuikit_custom_conversation_list_basic.html) 和 [高级设置](chatuikit_custom_conversation_list_advanced.html) 说明。

## 创建会话列表页面

单群聊 UIKit 提供 `ChatUIKitConversationListFragment`，添加到 Activity 中即可使用。

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
