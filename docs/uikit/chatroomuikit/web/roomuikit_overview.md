# 概述

环信 ChatroomUIKit 提供 UIKit 的各种组件帮助开发者根据实际业务需求快速搭建聊天室应用。通过该 UIKit，聊天室中的用户可实时交互，发送普通弹幕消息、打赏消息和全局广播等功能。

- 若要访问源码，请点击[这里](https://github.com/easemob/Easemob-UIKit-web)。

- 要体验环信聊天室 UIKit demo，请点击[这里](https://livestream-hsb.oss-cn-beijing.aliyuncs.com/index.html)。

## 功能

ChatroomUIKit 提供以下功能：

- **通用特性**
  - 创建聊天室：ChatroomUIKit 不提供创建聊天室的功能，你可以[调用即时通讯 IM SDK 的接口创建聊天室](/document/server-side/chatroom.html#创建聊天室)。
  - 销毁聊天室：ChatroomUIKit 不提供销毁聊天室的功能，你可以[调用即时通讯 IM SDK 的接口销毁聊天室](/document/server-side/chatroom.html#删除聊天室)。
  - 离开聊天室：聊天室中的成员可自行离开聊天室，聊天室所有者也可以将成员移出聊天室。
  - 发送弹幕：用户在聊天室中向其他参与者发送文字和表情的消息。
  - 打赏：用户通过赠送虚拟礼物，向聊天室中的主播或其他用户表达赞赏或者支持
  - 全局广播：向 App 内所有在线聊天室中的所有用户发送相同的消息或通知。
  - 未读消息数：在一个聊天室中用户尚未读取的消息数量。
  - 已禁言列表：记录被禁止发言用户的列表。当用户违反了聊天室的规则时，聊天室所有者将其禁言，即添加至已禁言列表。
  - 暗黑模式：ChatroomUIKit 默认风格为明亮模式，切换为暗黑模式后，聊天室界面中所有元素将替换为暗黑风格设计，提供用户舒适的视觉体验。
- **消息扩展**
  - 消息举报：在聊天室中，用户可以举报不适当、违规或有害的消息内容以促使聊天室所有者采取适当的行动。
  - 消息翻译：将聊天室中的单条消息从一种语言转换成另一种语言。
  - 消息撤回：在聊天室中撤销已经发送的消息。所有用户只能撤回自己发送的消息，即使聊天室所有者也不能撤回其他成员发送的消息。
  - 禁言成员：聊天室所有者对聊天室中的成员禁止发言。
- **成员管理**
  - 查看成员列表：聊天室成员列表显示了该聊天室中的当前在线用户。
  - 搜索成员：在聊天室中查找指定成员的功能，支持支持本地搜索和模糊匹配。
  - 禁言成员：聊天室所有者可以在聊天室中对某个特定的成员禁言。
  - 移除成员：聊天室所有者将指定成员从聊天室中踢出。

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
      onChatroomEvent: (event: AgoraChat.EventData) => {
        if (event.operation === "muteMember") {
          // console.log('你已被禁言')
        }
        // 全部事件请参考 https://docs-im-beta.easemob.com/document/web/room_manage.html#%E7%9B%91%E5%90%AC%E8%81%8A%E5%A4%A9%E5%AE%A4%E4%BA%8B%E4%BB%B6
      },
    });
  }, []);
};
```
