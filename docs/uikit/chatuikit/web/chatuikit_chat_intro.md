# 聊天页面介绍

环信单群聊 UIKit 提供 `Chat` 组件方便用户快速集成聊天页面和自定义聊天页面。该页面提供如下功能：

- 发送和接收消息，包括文本、表情、图片、语音、视频、文件和名片消息。
- 对消息进行复制、引用、撤回、删除、编辑、重新发送和审核。
- 清除本地消息。

## 页面组件

聊天页面通过 `Chat` 组件实现，由标题栏 `Header`、消息列表 `MessageList` 和底部输入栏 `MessageInput` 组成。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/custom_chat.png" title="聊天页面 Chat" />
</ImageGallery>

### 标题栏

聊天页面的标题栏使用 `Header` 组件，支持自定义标题、头像、副标题、右侧操作按钮等。详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。

### 消息列表

消息列表 `MessageList` 用于展示发送和接收的消息，以及对消息进行操作：

- **发送和接收消息**：包括文本、表情、图片、语音、视频、文件和名片等消息。
- **消息操作**：对消息进行复制、引用、撤回、删除、编辑、重新发送、举报、翻译、转发、多选、置顶操作。

### 底部输入框

消息底部输入框 `MessageInput` 实现各类消息的输入和发送以及表情等功能：

- 输入和发送文本和语音消息、添加表情以及扩展功能等。
- 发送附件类型消息，例如，图片、视频、文件以及自定义类型消息（如名片消息）等。

## 使用示例

```jsx
import React from 'react';
import { Chat } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';

const ChatContainer = () => {
  return (
    <div style={{ width: '70%', height: '100%' }}>
      <Chat />
    </div>
  );
};
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/chat_default.png" title="聊天页面" />
</ImageGallery>