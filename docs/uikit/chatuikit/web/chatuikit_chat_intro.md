# 聊天页面

## 概述

聊天页面通过 `Chat` 组件实现，该组件提供以下功能:

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件、名片和合并类型的消息。
- 对消息进行复制、表情回复、引用、撤回、删除、置顶、翻译和编辑、重新发送和审核操作。
- 清除本地消息。
- 删除会话。
- 从服务器拉取漫游消息。

消息相关功能，详见[功能介绍文档](chatfeature_message.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/chat.png" title="聊天页面" />
</ImageGallery>

## 使用示例

```jsx
import React from "react";
import { Chat } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const ChatContainer = () => {
  return (
    <div style={{ width: "70%", height: "100%" }}>
      <Chat />
    </div>
  );
};
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/chat_default.png" title="聊天页面" />
</ImageGallery>
