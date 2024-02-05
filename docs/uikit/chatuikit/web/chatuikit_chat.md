# 聊天消息

<Toc />

`Chat` 组件提供了以下功能:

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件和名片消息。
- 对消息进行复制、引用、撤回、删除、编辑、重新发送和审核。
- 从服务器拉取漫游消息。

消息相关功能，详见[功能介绍文档](chatfeature_message.html)。

![img](@static/images/uikit/chatuikit/web/page_chat.png) 

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

![img](@static/images/uikit/chatuikit/web/buble1.png =400x450)

## 自定义

### 修改消息气泡样式

以文本消息为例，你可以按如下方式修改消息气泡样式：

- 使用 `renderMessageList` 方法自定义渲染消息列表。
- 使用 `renderMessage` 方法自定义渲染消息。
- 通过 `TextMessage` 的属性自定义文本消息。

```jsx
import React from "react";
import { Chat, MessageList, TextMessage } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const ChatContainer = () => {
  const renderTxtMsg = (msg) => {
    return (
      <TextMessage
        bubbleStyle={{ background: "hsl(135.79deg 88.79% 36.46%)" }}
        shape="square"
        status={msg.status}
        avatar={<Avatar style={{ background: "pink" }}>A</Avatar>}
        textMessage={msg}
      ></TextMessage>
    );
  };

  const renderMessage = (msg) => {
    if (msg.type === "txt") {
      return renderTxtMsg(msg);
    }
  };

  return (
    <div style={{ width: "70%", height: "100%" }}>
      <Chat
        renderMessageList={() => <MessageList renderMessage={renderMessage} />}
      />
    </div>
  );
};
```

![img](@static/images/uikit/chatuikit/web/buble2.png =400x530)

### 在消息编辑器中添加自定义图标

在消息编辑器添加一个自定义图标，实现指定的功能:

1. 使用 `renderMessageInput` 方法自定义渲染消息编辑器。
2. 使用 `actions` 自定义 `MessageInput` 组件。

```jsx
import React from "react";
import { Chat, Icon, MessageInput } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const ChatContainer = () => {
  // 在消息编辑器中添加图标
  const CustomIcon = {
    visible: true,
    name: "CUSTOM",
    icon: (
      <Icon
        type="DOC"
        onClick={() => {
          console.log("click custom icon");
        }}
      ></Icon>
    ),
  };

  const actions = [...MessageInput.defaultActions];
  // 在 textarea 后面插入自定义图标
  actions.splice(2, 0, CustomIcon);
  return (
    <div style={{ width: "70%", height: "100%" }}>
      <Chat renderMessageInput={() => <MessageInput actions={actions} />} />
    </div>
  );
};
```

![img](@static/images/uikit/chatuikit/web/editor2.png =500x650)

### 实现发送自定义消息

1. 使用 `messageStore` 中提供的 `sendMessage` 方法发送自定义消息。
2. 使用 `renderMessage` 渲染自定义消息。

:::tip
为了保证消息在当前会话中展示，消息中的 `to` 字段必须是对方的用户 ID 或者群组的 ID。
:::

```jsx
import React from "react";
import {
  Chat,
  MessageList,
  TextMessage,
  rootStore,
  MessageInput,
  Icon,
} from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const ChatContainer = () => {
  // 展示自定义消息
  const renderCustomMsg = (msg) => {
    return (
      <div>
        <h1>Business Card </h1>
        <div>{msg.customExts.id}</div>
      </div>
    );
  };
  const renderMessage = (msg) => {
    if (msg.type === "custom") {
      return renderCustomMsg(msg);
    }
  };

  // 在消息编辑器中添加图标
  const CustomIcon = {
    visible: true,
    name: "CUSTOM",
    icon: (
      <Icon
        type="DOC"
        onClick={() => {
          sendCustomMessage();
        }}
      ></Icon>
    ),
  };
  const actions = [...MessageInput.defaultActions];
  actions.splice(2, 0, CustomIcon);

  // 实现发送自定义消息
  const sendCustomMessage = () => {
    const customMsg = AgoraChat.message.create({
      type: "custom",
      to: "targetId", //消息接收方：单聊为对端用户 ID，群聊为群组 ID。
      chatType: "singleChat",
      customEvent: "CARD",
      customExts: {
        id: "userId3",
      },
    });
    rootStore.messageStore.sendMessage(customMsg).then(() => {
      console.log("send success");
    });
  };
  return (
    <div style={{ width: "70%", height: "100%" }}>
      <Chat
        renderMessageList={() => <MessageList renderMessage={renderMessage} />}
        renderMessageInput={() => <MessageInput actions={actions} />}
      />
    </div>
  );
};
```

![img](@static/images/uikit/chatuikit/web/custom-msg.png =400x500)

### 修改聊天相关的主题

`Chat` 组件提供了聊天页面主题相关的变量支持自定义，如下所示。关于如何修改主题，请点击[这里](chatuikit_theme.html)。

```scss
$chat-bg: $component-background;
$msg-base-font-size: $font-size-lg;
$msg-base-color: $font-color;
$msg-base-margin: $margin-xs 0;
$msg-base-padding: 0 $padding-lg;
$msg-bubble-border-radius-left: 12px 16px 16px 4px;
$msg-bubble-border-radius-right: 16px 12px 4px 16px;
$msg-bubble-arrow-border-size: 6px;
$msg-bubble-arrow-bottom: 8px;
$msg-bubble-arrow-left: -11px;
$msg-bubble-arrow-right: -11px;
$msg-bubble-color-secondly: $blue-95;
$msg-bubble-color-primary: $blue-5;
$msg-bubble-font-color-secondly: $font-color;
$msg-bubble-font-color-primary: $gray-98;
$msg-base-content-margin: 0 $margin-xs 0 $margin-sm;
$msg-base-content-padding: $padding-xs $padding-sm;
$msg-base-content-minheight: 24px;
$msg-bubble-none-bg: transparent;
$msg-bubble-none-color: $font-color;
$msg-bubble-square-border-radius: 4px;
$msg-info-margin-left: $margin-sm;
$msg-nickname-font-size: $font-size-sm;
$msg-nickname-font-weight: 500;
$msg-nickname-font-color: #5270ad;
$msg-nickname-height: 16px;
$msg-time-font-size: $font-size-sm;
$msg-time-font-weight: 400;
$msg-time-font-color: $gray-7;
$msg-time-height: 16px;
$msg-time-margin: 0 $margin-xss;
$msg-time-width: 106px;
```

## Chat 组件属性总览

`Chat` 组件包含以下属性：

<table>
<tr>
        <td>属性</td>
        <td>类型</td>
        <td>描述</td>
    </tr>
 <tr>
      <td style=font-size:15px>
	className
	  </td>
      <td style=font-size:15px>
	String
	  </td>
	  <td style=font-size:15px>
	  组件的类名。
	  </td>
	  <tr>
	    <td style=font-size:15px>prefix</td>
        <td style=font-size:15px>String</td>
		<td style=font-size:15px>CSS 类名前缀。</td>
	  </tr>
	  <tr>
	    <td style=font-size:15px>headerProps</td>
        <td style=font-size:15px>HeaderProps</td>
		<td style=font-size:15px>Header 组件中的属性。</td>
	  </tr>
	  <tr>
	    <td style=font-size:15px>messageListProps</td>
        <td style=font-size:15px>MsgListProps</td>
		<td style=font-size:15px>MessageList 组件中的属性。</td>
	  </tr>
	  <tr>
	    <td style=font-size:15px>messageInputProps</td>
        <td style=font-size:15px> MessageInputProps</td>
		<td style=font-size:15px>MessageInput 组件中的属性。</td>
	  </tr>
	  <tr>
	    <td style=font-size:15px>renderHeader</td>
        <td style=font-size:15px>(cvs: CurrentCvs) => React.ReactNode</td>
		<td style=font-size:15px>自定义渲染 Header 组件的方法。</td>  
	  </tr>
	   <tr>
	    <td style=font-size:15px>renderMessageList</td>
        <td style=font-size:15px>() => ReactNode; </td>
		<td style=font-size:15px>自定义渲染 MessageList 组件的方法。</td>
	  </tr>
	  <tr>
	    <td style=font-size:15px>renderMessageInput </td>
         <td style=font-size:15px>() => ReactNode; </td>
		<td style=font-size:15px>自定义渲染 MessageInput 组件的方法。</td>
	  </tr>
	  <tr>
	    <td style=font-size:15px>renderEmpty</td>
        <td style=font-size:15px>() => ReactNode; </td>
		<td style=font-size:15px>自定义渲染空内容组件的方法。</td>  
	  </tr>
   </tr>
</table>
