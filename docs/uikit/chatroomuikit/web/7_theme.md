# 主题

ChatroomUIkit 内置浅色和深色主题，默认为浅色主题。

// TODO：将浅色和深色主题的截图贴在这里。截图

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

-[UI 设计资源](https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?node-id=137%3A38589&mode=dev)。

-[UI 设计指南](https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?node-id=137)。
