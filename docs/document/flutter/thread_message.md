# 子区消息管理 Flutter

<Toc />

子区消息消息类型属于群聊消息类型，与普通群组消息的区别是需要添加 `isChatThread` 标记。本文介绍即时通讯 IM Flutter SDK 如何发送、接收以及撤回子区消息。

## 技术原理

即时通讯 IM Flutter SDK 提供 `EMChatThreadManager`、`EMMessage` 和 `EMChatThread` 类，用于管理子区消息，支持你通过调用 API 在项目中实现如下功能：

- 发送子区消息
- 接收子区消息
- 撤回子区消息
- 获取子区消息

下图展示在客户端发送和接收消息的工作流程：

![img](@static/images/android/sendandreceivemsg.png)

如上图所示，消息收发流程如下：

1. 用户 A 发送一条消息到消息服务器；
2. 对于子区消息，服务器投递给子区内其他每一个成员；
3. 用户收到消息。

子区创建和查看如下图：

![](@static/images/ios/threads.png)

## 前提条件

开始前，请确保满足以下条件：

- 已集成 `1.0.5 或版本` SDK 的基本功能，完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 联系商务开通子区功能。

## 实现方法

本节介绍如何使用即时通讯 IM Flutter SDK 提供的 API 实现上述功能。

### 发送子区消息

发送子区消息和发送群组消息的方法基本一致，详情请参考 [发送消息](message_send_receive.html#发送消息)。唯一不同的是，发送子区消息需要指定标记 `isChatThreadMessage` 为 `true`。

示例代码如下：

```dart
// targetGroup 为群组 ID
EMMessage msg = EMMessage.createTxtSendMessage(
  targetId: targetGroup,
  content: content,
);
// 设置为群组消息
msg.chatType = ChatType.GroupChat;
// isChatThreadMessage: 是否是子区消息，这里设置为 `true`，即是子区消息
msg.isChatThreadMessage = true;
EMClient.getInstance.chatManager.sendMessage(msg);
```

### 接收子区消息

接收消息的具体逻辑，请参考 [接收消息](message_send_receive.html#接收消息)，此处只介绍子区消息和其他消息的区别。

子区有新增消息时，子区所属群组的所有成员收到 `EMChatThreadEventHandler#onChatThreadUpdated` 事件，子区成员收到 `EMChatEventHandler#onMessagesReceived` 事件。

示例代码如下：

```dart
// 注册子区监听
EMClient.getInstance.chatThreadManager.addEventHandler(
      "UNIQUE_HANDLER_ID",
  EMChatThreadEventHandler(
    onChatThreadUpdate: (event) {},
      ),
    );

// 添加消息监听
EMClient.getInstance.chatManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  EMChatEventHandler(
    onMessagesReceived: (messages) {},
      ),
    );

// 移除子区监听
EMClient.getInstance.chatThreadManager.removeEventHandler("UNIQUE_HANDLER_ID");
    // 移除消息监听
    EMClient.getInstance.chatManager.removeEventHandler("UNIQUE_HANDLER_ID");
```

### 撤回子区消息

接收消息的具体逻辑，请参考 [撤回消息](message_send_receive.html#撤回消息)，此处只介绍子区消息和其他消息的区别。

子区有消息撤回时，子区所属群组的所有成员收到 `EMChatThreadEventHandler#onChatThreadUpdated` 事件，子区成员收到 `EMChatEventHandler#onMessagesRecalled` 事件。

示例代码如下：

```dart
// 注册子区监听
EMClient.getInstance.chatThreadManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  EMChatThreadEventHandler(
    onChatThreadUpdate: (event) {},
  ),
);

// 添加消息监听
EMClient.getInstance.chatManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  EMChatEventHandler(
    onMessagesRecalled: (messages) {},
  ),
);

// 移除子区监听
EMClient.getInstance.chatThreadManager.removeEventHandler("UNIQUE_HANDLER_ID");
// 移除消息监听
EMClient.getInstance.chatManager.removeEventHandler("UNIQUE_HANDLER_ID");
```

### 从服务器获取子区消息 (消息漫游)

从服务器获取子区消息，请参考 [从服务器获取消息 (消息漫游)](message_retrieve.html)。