# 最佳实践

<Toc />

## 初始化

`Chatroom` 和 `ChatroomMember` 组件需要包裹在 `UIKitProvider` 组件内部使用。如果 `UIKitProvider` 在初始化完成前在组件内部使用 `useClient` 获取 SDK，则会获取失败，所以建议将 `UIKitProvider` 放在使用 `Chatroom` 或 `ChatroomMember` 组件的父组件中。

```tsx
// App.ts
// ...
const App = () => {
    return <Chatroom />
}

// idnex.ts
// ...
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <UIKitProvider>
        <App>
    </UIKitProvider>
)
```

## 登录

UIKit 提供两种登录方式：

- 初始化时指定 `userId` 和 `password/token` 进行自动登录。
- 使用 `useClient` 获取 SDK 实例进行手动登录。

```tsx
// 手动登录
// ...
const App = () => {
    const client = useClient()
    const login = () => {
        client.open({
            user: 'userId',
            token: 'token'
        })
    }
    return <Button onClick={login}>登录</Button>
}

// 自动登录
// ...
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <UIKitProvider initConfig={{
        userId: 'userId',
        token: 'token'
    }}>
        <App>
    </UIKitProvider>
)
```

## 聊天室事件

ChatroomUIKit 中提供了聊天室事件的监听接口。你可以通过注册聊天室监听器，获取聊天室事件，并作出相应处理。

ChatroomUIKit 中主动调用 API 的事件监听如下:

```javascript
import { eventHandler } from "easemob-chat-uikit";

eventHandler.addEventHandler("chatroom", {
  onError: (error) => {
    // 所有 API 调用失败除了回调相应的事件外都会回调 onError 事件
  },
  joinChatRoom: {
    error: (err) => {},
    success: () => {},
  },
  recallMessage: {
    error: (err) => {},
    success: () => {},
  },
  reportMessage: {
    // ...
  },
  sendMessage: {
    // ...
  },
  getChatroomMuteList: {
    // ...
  },
  removeUserFromMuteList: {
    // ...
  },
  unmuteChatRoomMember: {
    // ...
  },
  removerChatroomMember: {
    // ...
  },
});
```

从 UIKit 中获取 Chat SDK 实例来监听收到的聊天室事件:

```javascript
import React, { useEffect } from "react";
import { useClient } from "easemob-chat-uikit";

const ChatroomApp = () => {
  const client = useClient();

  useEffect(() => {
    client.addEventHandler("chatroom", {
      onChatroomEvent: (event: EasemobChat.EventData) => {
        if (event.operation === "muteMember") {
          // console.log('你已被禁言')
        }
        // 全部事件请参考 https://doc.easemob.com/document/web/room_manage.html#监听聊天室事件
      },
    });
  }, []);
};
```

## 参考

若要了解以上最佳实践的详情，请访问 [GitHub 仓库](https://github.com/easemob/ChatroomDemo/tree/dev/WEB/ChatroomDemo)。
