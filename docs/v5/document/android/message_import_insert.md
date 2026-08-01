# 导入和插入消息

## 功能说明

本文介绍环信即时通讯 IM Android SDK 如何将消息导入本地数据库，以及如何在本地会话中插入消息。

这些操作仅更新当前设备上的本地消息和会话数据，不会将消息发送给会话对端，也不会向服务器上传消息或同步到当前账号的其他设备。常见使用场景包括迁移历史消息、恢复本地消息记录，以及插入撤回提示、入群通知等仅用于本地展示的消息。

Android SDK 提供以下方式：

- 批量导入消息：调用 `EMChatManager#importMessages`，将当前用户发送或接收的多条消息导入本地数据库。
- 向指定会话插入消息：调用 `EMConversation#insertMessage`，按照消息中的 Unix 时间戳将消息插入指定会话。
- 直接保存消息：调用 `EMChatManager#saveMessage`，将消息保存到内存和本地数据库；若对应会话不存在，SDK 会自动创建会话。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，并已 [打开当前用户的本地数据库](initialization.html#设置登录后自动同步数据)，详见[快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。


## 批量导入消息到数据库

如果你需要使用批量导入方式在本地会话中插入消息，可以调用 `importMessages` 方法，构造 `EMMessage` 对象，将消息导入本地数据库。

当前用户只能导入自己发送或接收的消息。导入后，消息按照其包含的时间戳添加到对应的会话中。

推荐一次导入 1,000 条以内的数据。

示例代码如下：

```java
EMClient.getInstance()
        .chatManager()
        .importMessages(messages);
```

## 插入消息

如果需要在本地会话中加入一条无需发送、仅用于本地展示的消息，例如“XXX 撤回一条消息”“XXX 入群”或“对方正在输入”等，可以使用以下两种方式：

- 调用 `EMConversation#insertMessage`，将消息插入指定的已有会话。消息会按照其中的 Unix 时间戳插入本地数据库，SDK 同时更新会话的 `latestMessage` 等属性。调用前应确保消息的会话 ID 与目标会话 ID 一致。
- 调用 `EMChatManager#saveMessage`，将消息保存到内存和本地数据库。SDK 会根据消息的会话类型和收发方向确定会话；若对应会话不存在，SDK 会自动创建会话。命令消息不会保存到本地。

以上两个接口仅更新当前设备的本地数据，不会将消息发送到服务器或会话对端，也不会同步到当前账号的其他设备。

示例代码如下：

```java
// 方式一：将消息插入指定的已有会话。
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

if (conversation != null) {
    // 消息的会话 ID 应与目标会话 ID 一致。
    // SDK 按消息中的 Unix 时间戳确定插入位置。
    boolean inserted = conversation.insertMessage(message);
}

// 方式二：直接保存消息。
// SDK 会根据消息信息确定会话；若会话不存在，则自动创建。
// 注意：命令消息不会保存到本地。
EMClient.getInstance()
        .chatManager()
        .saveMessage(message);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`importMessages`](#批量导入消息到数据库) | `EMChatManager` | 将当前用户发送或接收的消息批量导入本地数据库。 |
| [`getConversation`](#插入消息) | `EMChatManager` | 获取指定 ID 的本地会话；未找到时返回 `null`。 |
| [`insertMessage`](#插入消息) | `EMConversation` | 按消息中的 Unix 时间戳将消息插入指定本地会话。 |
| [`saveMessage`](#插入消息) | `EMChatManager` | 将消息保存到内存和本地数据库；必要时自动创建会话。 |
