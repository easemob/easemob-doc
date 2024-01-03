# 主题

<Toc />

ChatroomUIkit 内置浅色和深色主题，默认为浅色主题。

- 浅色主题

![img](@static/images/uikit/chatroomweb/light_mode.png)

- 深色主题

![img](@static/images/uikit/chatroomweb/dark_mode.png)

## 修改主题 

你可以设置 `Provider` 组件的主题属性修改主题：

```javascript
import { Chatroom, UIKitProvider } from 'easemob-chat-uikit';

const ChatApp = () => {
  return (
    <UIKitProvider
      theme={{
        mode: 'light', // 浅色（light）或深色（dark）
        primaryColor: '#00CE76', // 十六进制颜色值
      }}
    >
      <Chatroom className="customClass" prefix="custom" />
    </UIKitProvider>
  );
};
```

## 设计指南 

如果你对主题颜色，设计指南和细节有任何疑问，您可以在 Figma 设计稿中添加评论并提及我们的设计师 Stevie Jiang。

- [UI 设计资源](https://www.figma.com/community/file/1322495388317476706/chatroom-uikit)。

- [UI 设计指南](design_guide.html)。
