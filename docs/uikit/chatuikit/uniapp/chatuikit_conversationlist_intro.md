# 会话列表页面

<Toc />

## 概述

`ChatUIKit/modules/Conversation/index` 用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并且提供会话搜索、删除、置顶和免打扰功能。

### 主要功能

- **搜索会话**：点击搜索按钮，跳转到搜索页面，搜索会话
- **进入聊天**：点击会话列表项，跳转到会话聊天页面
- **扩展功能**：点击标题栏的扩展按钮，可以选择创建新会话、添加好友、创建群组
- **会话操作**：左滑会话列表项显示菜单，可进行删除会话、置顶会话、消息免打扰操作

### 会话展示规则

单条会话展示会话名称、最后一条消息、最后一条消息的时间以及置顶和免打扰状态等。

- **单聊**：会话展示的名称为对端用户的昵称，若对端用户未设置昵称则展示对方的用户 ID；会话头像是对方的头像，如果没有设置则使用默认头像
- **群聊**：会话名称为当前群组的名称，头像为群组头像，如果未设置则使用默认头像

会话列表相关功能，详见[功能介绍文档](chatfeature_conversation.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/conversation_swipe_left.png" title="会话列表" />
</ImageGallery>

## 创建会话列表页面

单群聊 UIKit 提供 `ChatUIKit/modules/Conversation/index` 页面，添加路由到 `pages.json` 即可使用。

### 配置路由

在 `pages.json` 中添加路由配置：

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
