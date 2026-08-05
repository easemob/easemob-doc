# 更新消息

<Toc />

本文介绍环信即时通讯 IM SDK 如何更新本地消息。
 
## 技术原理

环信即时通讯 IM iOS SDK 支持更新本地数据库中的消息，其中包含如下主要方法：

- `IEMChatManager.updateMessage` 更新消息到本地数据库；

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 更新消息到本地数据库

你可以调用 `updateMessage` 方法更新本地数据库中的消息。

```objectivec
// 异步方法
[EMClient.sharedClient.chatManager updateMessage:message completion:^(EMChatMessage *aMessage, EMError *aError) {
    if (!aError) {
        // 更新本地消息完成。
    }
}];
```

