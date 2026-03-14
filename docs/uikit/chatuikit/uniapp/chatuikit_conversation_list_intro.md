# 会话列表页面

<Toc />

`ChatUIKit/modules/Conversation/index` 用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并且提供会话搜索、删除、置顶和免打扰功能。

## 页面功能

- **搜索会话**：点击搜索按钮，跳转至搜索页面进行会话查询。
- **进入聊天**：点击会话条目，跳转至对应的聊天页面。
- **扩展功能**：点击标题栏的扩展按钮，可选择创建新会话、添加好友或创建群组。
- **会话操作**：左滑会话条目可显示操作菜单，支持删除会话、置顶会话及设置消息免打扰操作。

## 会话展示

每条会话展示以下信息：

| 元素     | 说明                                                   |
| :------- | :----------------------------------------------------- |
| 头像     | 单聊显示对方头像（默认头像占位）；群聊显示群组默认头像。 |
| 名称     | 单聊显示对方昵称或 ID；群聊显示群组名称或 ID。           |
| 最新消息 | 显示最近一条消息的内容。                                |
| 消息时间 | 最新消息的发送时间。                                     |
| 状态标识 | 置顶、免打扰等状态图标。                                |

会话相关功能，详见 [功能介绍文档](chatfeature_conversation.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/conversation_swipe_left.png" title="会话列表" />
</ImageGallery>

## 创建会话列表页面

单群聊 UIKit 提供 `ChatUIKit/modules/Conversation/index` 页面，添加路由到 `pages.json` 即可使用。

```json
{
  "pages": [
    {
      "path": "ChatUIKit/modules/Conversation/index",
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "bounce": "none"
        }
      }
    }
  ]
}
```
