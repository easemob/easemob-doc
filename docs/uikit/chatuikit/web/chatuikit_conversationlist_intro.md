# 会话列表页面

## 概述

会话列表页面通过 `ConversationList` 组件实现，该组件用于展示当前用户的所有会话 (包含单聊和群聊, 但是不包括聊天室)，并且提供会话搜索、删除、置顶和免打扰功能。

- 在会话列表上方的搜索框中输入关键字，搜索会话名称。
- 点击会话列表项，跳转到单聊或群聊页面。
- 点击会话列表页面的 header 中的扩展按钮，选择新会话，创建新会话。
- 点击会话列表项旁边的 `⋮` 可以进行删除会话、置顶会话和消息免打扰操作。

单条会话展示会话名称、最后一条消息、最后一条消息的时间以及置顶和禁言状态等。

- 对于单聊, 会话展示的名称为对方昵称，若对方未设置昵称则展示对方的用户 ID，会话头像是对方的头像，如果没有设置则使用默认头像。
- 对于群聊，会话名称为当前群组的名称，头像为默认头像。

会话列表相关功能，详见[功能介绍文档](chatfeature_conversation.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/conversation_list.png" title="会话列表页面" />
</ImageGallery>

## 使用示例

```jsx
import React, { useEffect, useState } from 'react';
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

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/cvs-header1.png" title="会话列表页面示例" />
</ImageGallery>