# 管理服务端消息

<Toc />

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。本文介绍用户如何获取和删除服务端的会话和消息。

## 技术原理

使用环信即时通讯 IM iOS SDK 可以管理服务端的会话和历史消息。

- `asyncFetchHistoryMessagesFromServer`：获取服务器保存的指定会话中的消息；
- `removeMessagesFromServerWithTimeStamp`/`removeMessagesFromServerMessageIds`：按消息时间或消息 ID 单向删除服务端的历史消息；

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 分页获取指定会话的历史消息

你可以调用 `asyncFetchHistoryMessagesFromServer` 方法从服务器获取指定会话的消息（消息漫游）。你可以指定消息查询方向，即明确按时间顺序或逆序获取。为确保数据可靠，我们建议你每次最多获取 50 条消息，可多次获取。拉取后，SDK 会自动将消息更新到本地数据库。

:::notice
1. 历史消息和离线消息在服务器上的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。
2. 各类事件通知发送时，若接收的用户离线时，事件通知的存储时间与离线消息的存储时间一致，即也取决于你订阅的套餐包。
:::

```objectivec
// 异步方法
 [[EMClient sharedClient].chatManager asyncFetchHistoryMessagesFromServer:conversation.conversationId conversationType:conversation.type startMessageId:self.moreMsgId pageSize:10 completion:^(EMCursorResult *aResult, EMError *aError) {
             [self.conversation loadMessagesStartFromId:self.moreMsgId count:10 searchDirection:EMMessageSearchDirectionUp completion:block];
          }];
```

### 单向删除服务端的历史消息

你可以调用 `removeMessagesFromServerWithTimeStamp` 或 `removeMessagesFromServerMessageIds` 方法按消息时间或消息 ID 单向删除服务端的历史消息。每次最多可删除 50 条消息。消息删除后，该用户无法从服务端拉取到该消息。其他用户不受该操作影响。登录该账号的其他设备会收到 `EMMultiDevicesDelegate` 中的 `multiDevicesMessageBeRemoved` 回调，已删除的消息自动从设备本地移除。

:::tip
若使用该功能，需将 SDK 升级至 V3.9.8 或以上版本并联系商务开通。
:::

示例代码如下：

```Objectivec
// 按时间删除消息
[self.conversation removeMessagesFromServerWithTimeStamp:message.timestamp completion:^(EMError * _Nullable aError) {

}];

// 按消息 ID 删除消息
[self.conversation removeMessagesFromServerMessageIds:@[@"123314142214"] completion:^(EMError * _Nullable aError) {

}];
```

