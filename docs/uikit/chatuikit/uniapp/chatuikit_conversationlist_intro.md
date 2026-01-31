# 会话列表页面

<Toc />

## 概述

`ChatUIKit/modules/Conversation/index` 用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并且提供会话搜索、删除、置顶和免打扰功能。

### 页面功能

- **搜索会话**：点击搜索按钮，跳转至搜索页面进行会话查询。
- **进入聊天**：点击会话条目，跳转至对应的聊天页面。
- **扩展功能**：点击标题栏的扩展按钮，可选择创建新会话、添加好友或创建群组。
- **会话操作**：左滑会话条目可显示操作菜单，支持删除会话、置顶会话及设置消息免打扰操作。

### 会话展示

每条会话显示会话名称、最后一条消息内容、消息时间以及置顶与免打扰状态。

- **单聊**：会话名称为对方用户的昵称；若对方未设置昵称，则显示其用户 ID。会话头像使用对方用户头像，未设置则显示默认头像。
- **群聊**：会话名称为群组名称，会话头像为群组头像，未设置则使用默认头像。

会话列表相关功能，详见[功能介绍文档](chatfeature_conversation.html)。

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
