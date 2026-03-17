# 会话列表页面介绍

`ConversationList` 组件用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并且提供会话搜索、删除、置顶和免打扰功能。

## 页面组件

会话列表页面通过 `ConversationList` 组件实现，由标题栏、搜索栏和会话列表组成。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/custom_conversation_list.png" title="会话列表页面 ConversationList" />
</ImageGallery>

### 标题栏

会话列表页面与聊天页面、联系人列表页面、群详情页面、联系人详情页面的标题栏均使用 `Header` 组件。详见 [设置标题栏](chatuikit_custom_titlebar)。

### 会话搜索栏 

会话搜索栏 `Search` 组件实现会话搜索。在搜索框中输入内容，可按会话名称或会话 ID 搜索会话。关于自定义，详见 [设置会话搜索栏](chatuikit_custom_conversation_list_searchbar.html)。

### 会话列表

会话列表组件 `ConversationList` 按最新消息时间倒序排列，置顶会话始终显示在顶部。列表包含以下类型的会话：

- 通过标题栏加号创建的本地会话。
- 发送消息后自动生成的单聊会话。
- 群组内发送消息后生成的群聊会话。

会话条目组件 `ConversationItem` 实现单条会话展示，每个会话条目展示以下信息：

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

关于会话自定义，详见 [会话列表的基本设置](chatuikit_custom_conversation_list_basic.html) 和 [高级设置](chatuikit_custom_conversation_list_advanced.html) 说明。

## 使用示例

```jsx
import React from 'react';
import { ConversationList } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';

const Conversation = () => {
  return (
    <div style={{ width: '30%', height: '100%' }}>
      <ConversationList />
    </div>
  );
};
```