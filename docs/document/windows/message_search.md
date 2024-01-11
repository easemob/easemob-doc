# 搜索消息

<Toc />

本文介绍即时通讯 IM SDK 如何搜索本地消息。

## 技术原理

环信即时通讯 IM SDK 通过 `IChatManager` 类支持搜索用户设备上存储的消息数据，其中包含如下主要方法：

- `LoadMessagesWithKeyword` 根据关键字搜索会话消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 根据关键字搜索会话消息

你可以调用 `LoadMessagesWithKeyword` 方法根据关键字搜索本地数据库中单个会话中指定用户发送的消息，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation("convId");

conv.LoadMessagesWithKeyword(
        // 搜索关键字。
        "key", 
        // 消息发送方。
        sender: "tom",
        // 搜索开始的 Unix 时间戳，单位为毫秒。
        timestamp: 1653971593000,
        // 搜索的最大消息数。
        count: 10, 
        // 消息的搜索方向：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
        direction: MessageSearchDirection.UP, 
        // 回调处理
        new ValueCallBack<List<Message>>(
    onSuccess: (list) => {
        // 遍历消息列表
        foreach(var it in list)
        {
        }
    },
    onError: (code, desc) => {
    }
));
```
