# 消息置顶

消息置顶指将会话中的消息固定在会话顶部，方便会话中的所有用户快速查看重要消息。

- 若使用**群组和聊天室**的消息置顶功能，你需要将 IM SDK 升级至 4.5.0 版本并联系环信商务开通。
- 若要使用**单聊、群组和聊天室**的消息置顶功能，你需要将 IM SDK 升级至 4.9.0 版本并联系环信商务开通。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持消息置顶，主要方法如下：

- `EMChatManager#pinMessage`：置顶消息。
- `EMChatManager#unpinMessage`：取消置顶消息。
- `EMChatManager#getPinnedMessagesFromServer`：从服务端获取单个会话的置顶消息列表。

## 置顶消息

你可以调用 `EMChatManager#pinMessage` 方法置顶消息。消息置顶状态变化后，会话中的其他成员会收到 `EMChatManagerDelegate#onMessagePinChanged` 事件。多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他设备分别会收到 `EMChatManagerDelegate#onMessagePinChanged` 事件。

在会话中，支持多个用户置顶同一条消息，最新的消息置顶信息会覆盖较早的信息，即 `EMMessagePinInfo` 的置顶消息的操作者的用户 ID 和置顶时间为最新置顶操作的相关信息。

若消息在本地存储，而在服务端因过期而删除，则消息置顶失败。

对于单个会话来说，默认可置顶 20 条消息。你可以联系环信商务提升该上限，最大可调整至 100。

```swift
EMClient.shared().chatManager?.pinMessage("messageId", completion: { message, err in
    if err == nil {
        // 置顶成功
    }
})
```

## 取消置顶消息

你可以调用 `EMChatManager#unpinMessage` 方法取消置顶消息。与置顶消息相同，取消置顶消息后，会话中的其他成员会收到 `EMChatManagerDelegate#onMessagePinChanged` 事件。多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他设备分别会收到 `EMChatManagerDelegate#onMessagePinChanged` 事件。

单聊、群组或聊天室中的所有成员均可取消置顶消息，不论该消息是由哪个成员进行置顶的。取消置顶消息后，`EMMessagePinInfo` 中的信息为空，该会话的置顶消息列表中也不再包含该消息。

```swift
EMClient.shared().chatManager?.unpinMessage("messageId", completion: { message, err in
    if err == nil {
        // 取消置顶成功
    }
})
```

## 获取单个会话中的置顶消息

你可以调用 `EMChatManager#getPinnedMessagesFromServer` 方法从服务端获取单个会话的置顶消息列表。SDK 按照消息置顶时间的倒序返回。

:::tip
1. 若消息置顶后，消息在服务端过期或用户从服务端单向删除了该消息，当前用户拉漫游消息时拉不到该消息，但当前用户和其他用户均可以在置顶消息列表中拉取到该消息。
2. 若消息置顶后，用户撤回了该消息，则该消息从服务端移除，所有用户在从服务器拉取置顶消息列表时无法拉取到该消息。
:::

```swift
EMClient.shared().chatManager?.getPinnedMessages(fromServer: "conversationId", completion: { messages, err in
    if err == nil, let messages = messages {
        // 获取置顶消息列表成功
    }
})
```
