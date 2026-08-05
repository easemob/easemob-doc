# 消息置顶

## 功能说明

消息置顶是指将会话中的重要消息标记为置顶，方便会话成员集中查看和快速定位。**单聊、群聊和聊天室均支持该功能。** 置顶状态保存在服务端，并在同一会话的相关用户之间同步。

同一会话可以同时置顶多条消息。应用可以从服务端获取指定会话的置顶消息列表，并通过消息置顶事件及时更新页面。对于单条消息，还可以读取置顶操作者和置顶时间等详细信息。

## 功能开通

使用消息置顶功能前，需要联系环信商务开通。

## 前提条件

开始前，请确保满足以下条件：

 - 完成 SDK 初始化并连接到服务器，详见[快速开始](quickstart.html)。
 - 已联系环信商务开通消息置顶功能。
 - 了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 置顶消息

你可以调用 `pinMessage`，传入非空的消息 ID，在会话中置顶指定消息。置顶成功后，会话中的其他用户会收到 `onMessagePinChanged` 回调。多设备登录场景下，当前账号的其他在线设备同步到该状态变化后，也会收到该回调。

同一条消息允许被多个用户重复置顶，但仅保留最近一次置顶操作的信息。因此，通过 `EMMessagePinInfo` 获取的操作者用户 ID 和置顶时间均对应最近一次置顶操作。

需要注意的是，只有仍保存在服务端的消息才能置顶。如果消息仅存在于本地，但已因超过保存期限从服务端删除，置顶会失败。

**单个会话默认最多置顶 20 条消息；如需提高上限，可联系环信商务调整，最高支持 100 条。**

```objectivec
// 获取要置顶的消息 ID。
NSString *messageId = message.messageId;

// 异步置顶指定消息。
[[EMClient sharedClient].chatManager pinMessage:messageId
                                     completion:^(EMChatMessage *message, EMError *error) {
    if (!error) {
        // 消息置顶成功；message 为置顶后的消息。
    } else {
        // 消息置顶失败。
    }
}];
```

## 取消置顶消息

你可以调用 `unpinMessage`，传入非空的消息 ID，取消置顶消息。取消置顶成功后，会话中的其他用户会收到 `onMessagePinChanged` 回调。多设备登录场景下，当前账号的其他在线设备同步到该状态变化后，也会收到该回调。

单聊、群聊或聊天室中的所有用户均可取消置顶消息，不论该消息最初由哪个用户置顶。取消成功后，`pinnedInfo` 返回 `nil`，从服务端获取的该会话置顶消息列表中也不再包含该消息。

```objectivec
// 获取要取消置顶的消息 ID。
NSString *messageId = message.messageId;

// 异步取消置顶指定消息。
[[EMClient sharedClient].chatManager unpinMessage:messageId
                                       completion:^(EMChatMessage *message, EMError *error) {
    if (!error) {
        // 取消置顶成功；message 为取消置顶后的消息。
    } else {
        // 取消置顶失败。
    }
}];
```

## 获取单个会话中的置顶消息

你可以调用 `getPinnedMessagesFromServer` 从服务端获取指定会话中的全部置顶消息。SDK 按消息置顶时间倒序返回结果。

:::tip
1. 消息置顶后，如果该消息在服务端过期，或当前用户从服务端单向删除了该消息，则当前用户无法再通过消息漫游获取该消息，但当前用户和其他用户均可以在置顶消息列表中拉取到该消息。
2. 消息置顶后，如果用户撤回该消息，该消息会从服务端移除，所有用户均无法再从置顶消息列表中获取该消息。
:::

```objectivec
// conversationId 不能为空：单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID。
[[EMClient sharedClient].chatManager getPinnedMessagesFromServer:conversationId
                                                       completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    if (!error) {
        // messages 为该会话按置顶时间倒序排列的置顶消息列表。
    } else {
        // 获取置顶消息列表失败。
    }
}];
```

## 获取单条消息的置顶详情

你可以通过 `pinnedInfo` 获取单条消息的置顶详情：

 - 若消息已置顶，返回的 `EMMessagePinInfo` 包含最近一次置顶操作的操作者用户 ID 和置顶时间。
 - 若消息未置顶，该属性返回 `nil`。

```objectivec
// 从消息中读取置顶详情；未置顶时 pinInfo 为 nil。
EMMessagePinInfo *pinInfo = message.pinnedInfo;
if (pinInfo) {
    // 最近一次置顶操作的时间，单位为毫秒。
    NSInteger pinTime = pinInfo.pinTime;

    // 最近一次置顶操作的操作者用户 ID。
    NSString *operatorId = pinInfo.operatorId;
} else {
    // 该消息当前未置顶。
}
```

## 监听消息置顶事件

你可以注册 `EMChatManagerDelegate`，通过 `onMessagePinChanged` 监听消息置顶状态变化。`pinOperation` 为 `EMMessagePin` 时表示消息被置顶，为 `EMMessageUnpin` 时表示消息被取消置顶。

```objectivec
// 实现 EMChatManagerDelegate 中的消息置顶状态变化回调。
- (void)onMessagePinChanged:(NSString *)messageId
             conversationId:(NSString *)conversationId
                  operation:(EMMessagePinOperation)pinOperation
                    pinInfo:(EMMessagePinInfo *)pinInfo {
    switch (pinOperation) {
        case EMMessagePin:
            // 消息已置顶，可以根据 pinInfo 刷新置顶信息。
            break;
        case EMMessageUnpin:
            // 消息已取消置顶。
            break;
    }
}

// 注册消息代理以接收 onMessagePinChanged 回调。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 不再需要监听时移除消息代理。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`messageId`](#置顶消息) | `EMChatMessage` | 获取消息 ID。 |
| [`pinMessage`](#置顶消息) | `IEMChatManager` | 异步置顶指定消息。 |
| [`unpinMessage`](#取消置顶消息) | `IEMChatManager` | 异步取消置顶指定消息。 |
| [`getPinnedMessagesFromServer`](#获取单个会话中的置顶消息) | `IEMChatManager` | 异步从服务端获取指定会话的置顶消息列表。 |
| [`pinnedInfo`](#获取单条消息的置顶详情) | `EMChatMessage` | 获取单条消息的置顶详情；未置顶时返回 `nil`。 |
| [`pinTime`](#获取单条消息的置顶详情) | `EMMessagePinInfo` | 获取最近一次置顶操作的时间。 |
| [`operatorId`](#获取单条消息的置顶详情) | `EMMessagePinInfo` | 获取最近一次置顶操作的操作者用户 ID。 |
