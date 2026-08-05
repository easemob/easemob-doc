# 导入和插入消息

## 功能说明

本文介绍环信即时通讯 IM iOS SDK 如何将消息导入本地数据库，以及如何在本地会话中插入消息。

这些操作仅更新当前设备上的本地消息和会话数据，不会将消息发送给会话对端，也不会向服务器上传消息或同步到当前账号的其他设备。常见使用场景包括迁移历史消息、恢复本地消息记录，以及插入撤回提示、入群通知等仅用于本地展示的消息。

iOS SDK 提供以下方式：

- 批量导入消息：调用 `importMessages`，将当前用户发送或接收的多条消息异步导入本地数据库。
- 向指定会话插入消息：调用 `insertMessage`，按照消息中的 Unix 时间戳将消息插入指定会话，并更新会话的 `latestMessage` 等属性。

## 前提条件

 - 完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)。
 - 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 批量导入消息到数据库

如果需要批量导入消息到本地会话，可以调用 `importMessages`，构造 `EMChatMessage` 对象并将消息导入本地数据库。

当前用户只能导入自己发送或接收的消息。导入后，消息按照其包含的时间戳添加到对应的会话中。

推荐一次导入 1,000 条以内的数据。

```objectivec
[[EMClient sharedClient].chatManager importMessages:messages completion:^(EMError *error) {
    // 处理导入结果。
}];
```

## 插入消息

如果需要在本地会话中加入一条无需发送、仅用于本地展示的消息，例如“XXX 撤回一条消息”“XXX 入群”或“对方正在输入”等，可以调用 `insertMessage`，将消息插入指定的本地会话。

消息会按照其中的 Unix 时间戳插入本地数据库，SDK 同时更新会话的 `latestMessage` 等属性。调用前应确保消息的会话 ID 与目标会话 ID 一致。

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
EMError *error = nil;
[conversation insertMessage:message error:&error];
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`importMessages`](#批量导入消息到数据库) | `IEMChatManager` | 异步批量导入消息。 |
| [`getConversation`](#插入消息) | `IEMChatManager` | 获取或创建本地会话。 |
| [`insertMessage`](#插入消息) | `EMConversation` | 同步向本地会话插入消息。 |
