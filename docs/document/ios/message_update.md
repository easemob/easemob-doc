# 更新消息

## 功能说明

环信即时通讯 IM iOS SDK 支持更新当前设备本地内存和数据库中已有的消息。应用可以根据业务需求修改消息的本地状态或内容，并刷新会话中的消息展示。更新时不能修改消息 ID。

本地消息更新仅对当前设备生效，不会修改服务端保存的消息，也不会将变更同步给消息接收方或当前账号的其他设备。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 更新消息到本地数据库

你可以调用 `updateMessage` 异步更新本地内存和数据库中的消息。该操作不会修改服务端消息，也不会通知消息接收方或当前账号的其他设备。

```objectivec
// 异步方法。
[[EMClient sharedClient].chatManager updateMessage:message
                                        completion:^(EMChatMessage *updatedMessage, EMError *error) {
    if (!error) {
        // 更新本地消息完成。
    }
}];
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`updateMessage:completion`](#更新消息到本地数据库) | `IEMChatManager` | 异步更新当前设备本地内存和数据库中的消息。 |
