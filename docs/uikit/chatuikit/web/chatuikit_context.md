# 全局 state

<Toc />

聊天 UIKit 的内部 state 据全部存储在 rootStore，rootStore 数据更新会驱动各个组件更新 UI。你可以使用 rootStore 上的数据，也可以调用 UIKit 提供的方法来更新数据。

rootStore 包含以下数据模块:

- initConfig：UIKit 初始化数据。
- client：即时通讯 IM SDK 实例。
- conversationStore: 会话列表相关数据。
- messageStore： 消息相关数据。
- addressStore：通讯录相关数据。

<table>
    <tr>
        <td>store</td>
        <td>属性</td>
        <td>描述</td>
    </tr> 
    <tr>
      <td rowspan="4" >conversationStore</td>
    </<tr>
    <tr>
        <td>currentCvs</td>
        <td style=font-size:10px>当前的会话。</td>
    </tr> 
    <tr>
        <td>conversationList</td>
        <td style=font-size:10px>全部会话。</td>
    </tr> 
    <tr>
        <td>searchList</td>
        <td style=font-size:10px>搜索到的会话。</td>
    </tr> 
     <tr>
      <td rowspan="6" >messageStore</td>
    </tr>
   <tr>
        <td>message</td>
        <td style=font-size:10px>整个 app 的消息，里面包含单聊（`singleChat`）和群聊（`groupChat`）的消息以及根据消息 ID 存储的消息（`byId`）。</td style=font-size:10px>
    </tr> 
   <tr>
        <td>selectedMessage</td>
        <td style=font-size:10px>多选选中的消息</td>
    </tr>
    <tr>
        <td>repliedMessage</td>
        <td style=font-size:10px>被引用的消息</td>
    </tr>
    <tr>
        <td>typing</td>
        <td style=font-size:10px>是否正在输入</td>
    </tr>
    <tr>
        <td>unreadMessageCount</td>
        <td style=font-size:10px>当前会话中未读的消息数</td>
    </tr>
    <tr>
      <td rowspan="6" >addressStore</td>
    </tr>
    <tr>
        <td>appUsersInfo</td>
        <td style=font-size:10px>所有用户的用户属性，展示头像昵称时用到</td>
    </tr>
    <tr>
        <td>contacts</td>
        <td style=font-size:10px>所有的联系人</td>
    </tr>
    <tr>
        <td>groups</td>
        <td style=font-size:10px>所有加入的群组</td>
    </tr>
    <tr>
        <td>searchList</td>
        <td style=font-size:10px>搜索到的联系人或群组</td>
    </tr>
    <tr>
        <td>requests</td>
        <td style=font-size:10px>好友请求</td>
    </tr>
</table>

## 使用示例

```javascript
import { rootStore } from "easemob-chat-uikit";
```

## 调用 API 改变全局 state

聊天 UIKit 提供了 `useChatContext`、`useConversationContext`、`useAddressContext` 三个自定义 hooks 来获取改变 state 的 API。

## useConversationContext

该自定义的 hook 可以返回会话相关数据和数据管理方法。

### 使用示例

```javascript
import React from "react";
import { useConversationContext } from "easemob-chat-uikit";

const ChatAPP = () => {
  const { conversationList, setCurrentConversation } = useConversationContext();
  const setCurrentCvs = () => {
    setCurrentConversation({
      chatType: "singleChat",
      conversationId: "userId",
    });
  };
  return (
    <div>
      <button onClick={setCurrentCvs}>setCurrentConversation</button>
    </div>
  );
};
```

### useConversationContext 概览

<table>
    <tr>
        <td>属性/方法</td>
        <td>类型</td>
        <td>描述</td>
    </tr> 
    <tr>
        <td>currentConversation</td>
        <td style=font-size:10px>CurrentConversation</td>
        <td style=font-size:10px>当前会话。</td>
    </tr> 
    <tr>
        <td>conversationList</td>
        <td style=font-size:10px>Conversation[]</td>
        <td style=font-size:10px>所有会话。</td>
    </tr> 
    <tr>
        <td style=color:blue>setCurrentConversation</td>
        <td style=font-size:10px>(currentCvs: CurrentConversation) => void</td>
        <td style=font-size:10px>设置当前会话。</td>
    </tr>
    <tr>
        <td style=color:blue>deleteConversation</td>
        <td style=font-size:10px>(conversation: CurrentConversation) => void</td>
        <td style=font-size:10px>将会话从会话列表删除。</td>
    </tr>
    <tr>
        <td style=color:blue>topConversation</td>
        <td style=font-size:10px> (conversation: Conversation) => void</td>
        <td style=font-size:10px>置顶会话。</td>
    </tr>
    <tr>
        <td style=color:blue>addConversation</td>
        <td style=font-size:10px> (conversation: Conversation) => void</td>
        <td style=font-size:10px>将会话添加到会话列表</td>
    </tr>
    <tr>
        <td style=color:blue>modifyConversation</td>
        <td style=font-size:10px> (conversation: Conversation) => void</td>
        <td style=font-size:10px>修改会话。</td>
    </tr>
</table>

## useChatContext

该自定义 hook 可返回消息相关数据和数据管理方法。

### Usage example

```javascript
import React from "react";
import { useChatContext, useSDK } from "easemob-chat-uikit";

const ChatAPP = () => {
  const { easemobChat } = useSDK(); // 获取即时通讯 IM SDK
  const { messages, sendMessage } = useChatContext();
  const sendCustomMessage = () => {
    const customMsg = easemobChat.message.create({
      type: "custom",
      to: "targetId", // 单聊为对端用户 ID，群组聊天为当前群组 ID。
      chatType: "singleChat",
      customEvent: "CARD",
      customExts: {
        id: "userId",
      },
    });
    sendMessage(customMsg);
  };

  return (
    <div>
      <button onClick={sendCustomMessage}>sendMessage</button>
    </div>
  );
};
```

### useChatContext 概览

<table>
    <tr>
        <td>属性/方法</td>
        <td>类型</td>
        <td>描述</td>
    </tr> 
    <tr>
        <td>messages</td>
        <td style=font-size:10px>Message</td>
        <td style=font-size:10px>UIKit 中的所有消息数据。</td>
    </tr> 
    <tr>
        <td>repliedMessage</td>
        <td style=font-size:10px>easemobChat.MessagesType</td>
        <td style=font-size:10px>正在回复的消息</td>
    </tr> 
    <tr>
        <td>typing</td>
        <td style=font-size:10px>Typing</td>
        <td style=font-size:10px>正在输入的用户对象。</td>
    </tr> 
    <tr>
        <td style=color:blue>sendMessage</td>
        <td style=font-size:10px>(message: easemobChat.MessageBody) => Promise&lt;void&gt;</td>
        <td style=font-size:10px>发送消息。</td>
    </tr>
    <tr>
        <td style=color:blue>deleteMessage</td>
        <td style=font-size:10px>deleteMessage: (cvs: CurrentConversation, messageId: string | string[]) => void | Promise&lt;void&gt;</td>
        <td style=font-size:10px>删除消息。</td>
    </tr>
    <tr>
        <td style=color:blue>recallMessage</td>
        <td style=font-size:10px>(cvs: CurrentConversation, messageId: string, isChatThread?: boolean) => Promise&lt;void&gt;</td>
        <td style=font-size:10px>撤回消息。</td>
    </tr>
    <tr>
        <td style=color:blue>translateMessage</td>
        <td style=font-size:10px>(cvs: CurrentConversation, messageId: string, language: string) => Promise&lt;boolean&gt;</td>
        <td style=font-size:10px>翻译文本消息。</td>
    </tr>
    <tr>
        <td style=color:blue>modifyMessage</td>
        <td style=font-size:10px>(messageId: string, msg: easemobChat.TextMsgBody) => Promise&lt;void&gt;</td>
        <td style=font-size:10px>编辑服务器上的消息。编辑后，对端用户会显示修改后的消息。该方法仅对文本消息有效。</td>
    </tr>
    <tr>
        <td style=color:blue>modifyLocalMessage</td>
        <td style=font-size:10px>(id: string, message: easemobChat.MessageBody | RecallMessage) => void</td>
        <td style=font-size:10px>编辑本地消息。该方法对任何类型的消息均有效。</td>
    </tr>
    <tr>
        <td style=color:blue>updateMessageStatus</td>
        <td style=font-size:10px>(msgId: string, status: 'received' | 'read' | 'unread' | 'sent' | 'failed' | 'sending' | 'default') => void</td>
        <td style=font-size:10px>更新消息状态。</td>
    </tr>
    <tr>
        <td style=color:blue>sendTypingCommand</td>
        <td style=font-size:10px> (cvs: CurrentConversation) => void</td>
        <td style=font-size:10px>发送正在输入的命令。</td>
    </tr>
    <tr>
        <td style=color:blue>setRepliedMessage</td>
        <td style=font-size:10px>(message: easemobChat.MessageBody | null) => void</td>
        <td style=font-size:10px>设置回复的消息。</td>
    </tr>
    <tr>
        <td style=color:blue>clearMessages</td>
        <td style=font-size:10px>(cvs: CurrentConversation) => void</td>
        <td style=font-size:10px>清空会话的本地消息。</td>
    </tr>
</table>

## useAddressContext

该自定义 hook 可以返回联系人和群组相关的数据以及数据管理方法。

### 使用示例

```javascript
import React from "react";
import { useAddressContext } from "easemob-chat-uikit";

const ChatAPP = () => {
  const { appUsersInfo } = useAddressContext();
  console.log(appUsersInfo);
  return <div>ChatAPP</div>;
};
```

### useAddressContext 概览

<table>
    <tr>
        <td>属性/方法</td>
        <td>类型</td>
        <td>描述</td>
    </tr> 
    <tr>
        <td>appUsersInfo</td>
        <td style=font-size:10px>Record&lt;string, AppUserInfo&gt;</td>
        <td style=font-size:10px>所有用户的信息。</td>
    </tr> 
    <tr>
        <td>groups</td>
        <td style=font-size:10px>GroupItem[]</td>
        <td style=font-size:10px>所有群组。</td>
    </tr> 
    <tr>
        <td style=color:blue>setAppUserInfo</td>
        <td style=font-size:10px>(appUsersInfo: Record&lt;string, AppUserInfo&gt;) => void</td>
        <td style=font-size:10px>设置用户信息。</td>
    </tr>
    <tr>
        <td style=color:blue>setGroups</td>
        <td style=font-size:10px> (groups: GroupItem[]) => void</td>
        <td style=font-size:10px>设置群组数据。</td>
    </tr>
    <tr>
        <td style=color:blue>setGroupMemberAttributes</td>
        <td style=font-size:10px>(groupId: string, userId: string, attributes: easemobChat.MemberAttributes) => void</td>
        <td style=font-size:10px>设置群成员属性。</td>
    </tr>
</table>
