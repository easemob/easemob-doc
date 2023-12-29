# 可配置项

<Toc />

ChatroomUIKit 提供 `Chatroom` 和 `ChatroomMember` 组件，组件中包含各种属性，你可以根据需求进行设置。

## Chatroom 组件

![img](@static/images/uikit/chatroomweb/chatroom.png)

`Chatroom` 是整个聊天界面组件，由 `Header`、`MessageList`、`MessageInput` 和 `Broadcast` 子组件组成。每个组件可以用 `renderX` 方法替换成自定义的组件。

| 属性                | 是否必需 | 类型          | 描述       |
| ---------- | -------- | ----------------- | ------------ | ------------- |
| className           | 否       | String                                | 组件的类名。                 |
| prefix              | 否       | String                                | CSS 类名的前缀。             |
| style               | 否       | React.CSSProperties                   | 组件的样式。                 |
| chatroomId          | 是       | String                                | 聊天室 ID。                  |
| renderEmpty         | 否       | () => ReactNode                       | 自定义渲染没有会话时的内容。 |
| renderHeader        | 否       | (roomInfo: ChatroomInfo) => ReactNode | 自定义渲染 Header。          |
| headerProps         | 否       | HeaderProps                           | Header 组件的属性。          |
| renderMessageList   | 否       | () => ReactNode                       | 自定义渲染聊天室消息区域。     |  
| renderMessageInput | 否       | () => ReactNode                       | 自定义渲染消息输入区域。       |                                    
| messageInputProps  | 否       | MessageEditorProps                    | 消息输入区域组件的属性。       |                                           
| messageListProps    | 否       | MsgListProps                          | 聊天室消息区域组件的属性。   | 
| renderBroadcast     | 否       | () => ReactNode                       | 自定义渲染全局广播组件。     |
| broadcastProps      | 否       | BroadcastProps                        | 全局广播组件的属性。         |

例如，可以通过组件的属性传递 `className`、`style` 和 `prefix` 修改样式：

```javascript
import { Chatroom, Button } from "easemob-chat-uikit";

const ChatApp = () => {
  return (
    <div>
      <Chatroom className="customClass" prefix="custom" />
      <Button style={{ width: "100px" }}>Button</Button>
    </div>
  );
};
```

## ChatroomMember 组件

![img](@static/images/uikit/chatroomweb/chatroomMember.png)

`ChatroomMember` 用于展示聊天室所有者和聊天室成员，以及禁言列表。聊天室所有者可以对成员禁言或踢出聊天室。

| 属性    | 是否必需 | 类型              | 描述          |
| --------------- | -------- | -------------------------------------- | -------------------- |
| className       | 否       | String   | 组件的类名。         |
| prefix          | 否       | String      | CSS 类名的前缀。     |
| style           | 否       | React.CSSProperties    | 组件的样式。    |
| chatroomId      | 否       | String       | 聊天室 ID。   |
| renderHeader    | 否       | (roomInfo: ChatroomInfo) => ReactNode         | 自定义渲染 Header。  |
| headerProps     | 否       | HeaderProps          | Header 组件的属性。  |
| memberListProps | 否       | { search?: boolean; placeholder?: string; renderEmpty?: () => ReactNode; renderItem?: (item: AppUserInfo) => ReactNode; UserItemProps?: UserItemProps; } | 成员列表组件的属性。 |
| muteListProps   | 否       | { search?: boolean; placeholder?: string; renderEmpty?: () => ReactNode; renderItem?: (item: AppUserInfo) => ReactNode; UserItemProps?: UserItemProps; } | 禁言列表组件的属性。 |

```javascript
import { ChatroomMember } from "easemob-chat-uikit";

const ChatApp = () => {
  return (
    <div>
      <ChatroomMember chatroomId="chatroomId"></ChatroomMember>
    </div>
  );
};
```
