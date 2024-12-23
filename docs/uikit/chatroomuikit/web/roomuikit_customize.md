# 自定义

<Toc />

本文通过几个示例介绍如何添加自己的业务逻辑，实现个性化业务需求。

## 自定义渲染 header

你可以通过容器组件的 `renderHeader` 方法渲染自定义 header：

```javascript
import {Chatroom, Header} from 'easemob-chat-uikit'

const ChatApp = () => {
  const CustomHeader = <Header back content="Custom Header">
  return(
    <div>
      <Chatroom renderHeader={(cvs) => CustomHeader}>
    </div>
  )
}
```

## 自定义渲染消息

你可以通过容器组件的 `renderMessageList` 方法渲染自定义聊天室消息区域:

```tsx
import { Chatroom, MessageList } from "easemob-chat-uikit";

const ChatApp = () => {
  const renderMessage = (message) => {
    switch (message.type) {
      case "txt":
        return <div>{message.msg}</div>;
    }
  };
  return (
    <div>
      <Chatroom
        chatroomId="chatroomId"
        renderMessageList={() => (
          <MessageList
            conversation={{
              chatType: "chatRoom",
              conversationId: "chatroomId",
            }}
            renderMessage={renderMessage}
          />
        )}
      ></Chatroom>
    </div>
  );
};
```

## 自定义礼物

你可以通过容器组件的 `messageEditorProps` 属性自定义 `giftConfig`:

```tsx
import { Chatroom, MessageList } from "easemob-chat-uikit";

const ChatApp = () => {
  const renderMessage = (message) => {
    switch (message.type) {
      case "txt":
        return <div>{message.msg}</div>;
    }
  };
  return (
    <div>
      <Chatroom
        chatroomId="chatroomId"
        messageEditorProps={{
          giftKeyboardProps: {
            giftConfig: {
              gifts: [
                {
                  giftId: "2665752a-e273-427c-ac5a-4b2a9c82b255",
                  giftIcon:
                    "https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift1.png",
                  giftName: "Heart",
                  giftPrice: "1",
                },
              ],
            },
          },
        }}
      ></Chatroom>
    </div>
  );
};
```

## Context

UIKit 使用 React Context 管理全局数据，用户可以使用自定义 hook `useChatroomContext` 获取和管理聊天室相关数据。

### 使用示例

```javascript
import React from "react";
import { useChatroomContext, Button } from "easemob-chat-uikit";

const ChatAPP = () => {
  const {
    chatroom,
    muteChatRoomMember,
    unmuteChatRoomMember,
    removerChatroomMember,
  } = useChatroomContext();

  const muteMember = () => {
    muteChatRoomMember("chatroomId", "userId");
  };
  return <Button onClick={muteMember}>mute</Button>;
};
```

### useChatroomContext 总览

| 属性/方法             | 类型                   | 描述                  |
| :-------------------- | :-------------- | :-------------------- | 
| `chatroom`       | `ChatroomInfo`       | 聊天室信息。          |
| `muteChatRoomMember`    | `(chatroomId: string, userId: string, muteDuration?: number) => Promise<void>` | 对成员禁言。 |
| `unmuteChatRoomMember`  | `(chatroomId: string, userId: string) => Promise<void>`            | 对成员解除禁言。      |
| `removerChatroomMember` | `(chatroomId: string, userId: string) => void`               | 移除成员。            |
