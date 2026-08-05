# 消息表情回复 Reaction

## 功能说明

环信即时通讯 IM 提供消息表情回复（下称“Reaction”）功能。用户可以在单聊和群聊中对消息添加或删除表情。表情可以直观表达情绪；在群聊场景下，也可以结合不同表情的数量实现轻量投票、反馈收集等互动能力。

Reaction 场景示例如下，分别展示如何添加 Reaction、群聊中 Reaction 的效果，以及查看 Reaction 列表。

![img](/images/ios/reactions.png)

## 功能开通

使用 Reaction 前，需在 [环信控制台](https://console.easemob.com/user/login) 开通该功能，具体操作请参见 [环信控制台文档](/product/console/basic_message.html#消息表情回复)。

## 使用限制

 - Reaction 仅适用于单聊和群聊，聊天室暂不支持。
 - Reaction 的计数规则和存储时间、用户添加限制、每条消息可添加的 Reaction 数量，以及表情 ID 规范，详见 [使用限制文档](limitation.html)。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 iOS SDK 初始化并登录，详见 [快速开始](quickstart.html)。
2. 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
3. 已在 [环信控制台](https://console.easemob.com/user/login) 开通 Reaction 功能。

## 在消息上添加 Reaction

调用 `addReaction` 可为消息添加 Reaction。

对于单聊，会话对端用户会收到 `messageReactionDidChange` 回调；对于群聊，除操作者外的其他群成员会收到该回调。回调信息包括会话 ID、消息 ID、当前消息的 Reaction 列表以及 Reaction 操作列表。操作列表记录操作者用户 ID、发生变化的 Reaction 和操作类型，业务侧可据此实时更新消息上的 Reaction 展示。

同一用户对同一条消息上的同一个 Reaction 只能添加一次。重复添加时，SDK 返回错误码 `1301`，即 `EMErrorReactionHasBeenOperated`，业务侧可按“该 Reaction 已添加过”处理。

示例代码如下：

```objectivec
NSString *messageId = message.messageId;
NSString *reaction = @"👍";

[[EMClient sharedClient].chatManager addReaction:reaction
                                        toMessage:messageId
                                       completion:^(EMError *error) {
    if (!error) {
        // 添加成功。
    } else {
        // 添加失败。
    }
}];
```

## 删除消息的 Reaction

调用 `removeReaction` 删除当前用户为消息添加的 Reaction。

删除成功后，单聊中的对端用户以及群聊中除操作者外的其他成员会收到 `messageReactionDidChange` 回调。回调信息包括会话 ID、消息 ID、当前消息的 Reaction 列表和 Reaction 操作列表；操作列表会记录操作者用户 ID、被删除的 Reaction 以及操作类型。业务侧可据此实时更新消息上的 Reaction 展示。

执行删除操作的一方可通过 completion 获取操作结果，并在成功后更新当前界面。

示例代码如下：

```objectivec
NSString *messageId = message.messageId;
NSString *reaction = @"👍";

[[EMClient sharedClient].chatManager removeReaction:reaction
                                          fromMessage:messageId
                                          completion:^(EMError *error) {
    if (!error) {
        // 删除成功。
    } else {
        // 删除失败。
    }
}];
```

## 获取消息的 Reaction 列表

调用 `getReactionList` 可从服务器获取一条或多条指定消息的 Reaction 概览。

每条 Reaction 概览包含 Reaction 内容、添加该 Reaction 的用户数量、当前用户是否添加过该 Reaction，以及最早添加 Reaction 的三个用户的用户 ID。用户列表仅用于概览展示，并不代表全部用户。对于已获取并缓存的消息，也可以通过 `reactionList` 读取消息中的 Reaction 列表。若需要获取群聊消息中指定 Reaction 的完整用户列表，可调用 `getReactionDetail` 分页查询。

示例代码如下：

```objectivec
NSArray<NSString *> *messageIds = @[@"messageId1", @"messageId2"];

// 单聊时传 EMChatTypeChat，groupId 传 nil；群聊时传 EMChatTypeGroupChat 和对应群组 ID。
[[EMClient sharedClient].chatManager getReactionList:messageIds
                                              groupId:nil
                                            chatType:EMChatTypeChat
                                          completion:^(NSDictionary<NSString *, NSArray<EMMessageReaction *> *> *result, EMError *error) {
    if (!error) {
        NSArray<EMMessageReaction *> *reactions = result[@"messageId1"];
        // reactions 为消息的 Reaction 概览列表。
    } else {
        // 获取失败。
    }
}];
```

## 获取 Reaction 详情

调用 `getReactionDetail` 可从服务器分页获取指定 **群聊消息** 中指定 Reaction 的详细信息，包括 Reaction 内容、当前添加该 Reaction 的用户数量，以及当前页的用户 ID 列表。

```objectivec
// 首次调用时，`cursor` 传 `nil` 或 `@""`，SDK 按 Reaction 创建时间正序获取数据。completion 中返回下一页游标，当 cursor 为 `nil` 时表示已获取全部数据。
// `pageSize` 取值范围为 `[1,100]`。
[[EMClient sharedClient].chatManager getReactionDetail:@"messageId"
                                              reaction:@"👍"
                                                cursor:nil
                                              pageSize:30
                                            completion:^(EMMessageReaction *reaction, NSString *cursor, EMError *error) {
    if (!error) {
        NSArray<NSString *> *userList = reaction.userList;
        // 使用 userList 显示当前页的用户；cursor 非 nil 时可继续分页查询。
    } else {
        // 获取失败。
    }
}];
```

## 监听 Reaction 更新

实现 `messageReactionDidChange` 可接收被订阅消息的 Reaction 更新。使用前注册监听器；不再需要时应移除，避免重复回调和生命周期问题。

```objectivec
@interface ReactionViewController () <EMChatManagerDelegate>
@end

@implementation ReactionViewController

- (void)startObserveReactions {
    [[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];
}

- (void)stopObserveReactions {
    [[EMClient sharedClient].chatManager removeDelegate:self];
}

- (void)messageReactionDidChange:(NSArray<EMMessageReactionChange *> *)changes {
    for (EMMessageReactionChange *change in changes) {
        NSString *conversationId = change.conversationId;
        NSString *messageId = change.messageId;
        NSArray<EMMessageReaction *> *reactions = change.reactions;
        NSArray<EMMessageReactionOperation *> *operations = change.operations;
        // 根据 conversationId、messageId、reactions 和 operations 更新 UI。
    }
}

@end
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`addReaction`](#在消息上添加-reaction) | `IEMChatManager` | 异步添加消息 Reaction。 |
| [`removeReaction`](#删除消息的-reaction) | `IEMChatManager` | 异步删除当前用户添加的消息 Reaction。 |
| [`getReactionList`](#获取消息的-reaction-列表) | `IEMChatManager` | 异步获取一条或多条消息的 Reaction 概览。 |
| [`getReactionDetail`](#获取-reaction-详情) | `IEMChatManager` | 异步分页获取群聊消息中指定 Reaction 的详情。 |
| [`reactionList`](#获取消息的-reaction-列表) | `EMChatMessage` | 从消息对象获取已缓存的 Reaction 列表。 |
| [`conversationId`](#监听-reaction-更新) | `EMMessageReactionChange` | 获取 Reaction 变更所属的会话 ID。 |
| [`messageId`](#监听-reaction-更新) | `EMMessageReactionChange` | 获取发生 Reaction 变更的消息 ID。 |
| [`reactions`](#监听-reaction-更新) | `EMMessageReactionChange` | 获取变更后的 Reaction 列表。 |
| [`operations`](#监听-reaction-更新) | `EMMessageReactionChange` | 获取发生变化的操作详情。 |
| [`userId`](#监听-reaction-更新) | `EMMessageReactionOperation` | 获取 Reaction 操作者用户 ID。 |
| [`reaction`](#监听-reaction-更新) / [`operate`](#监听-reaction-更新) | `EMMessageReactionOperation` | 获取发生变化的 Reaction 和操作类型。 |
| [`reaction`](#获取-reaction-详情) | `EMMessageReaction` | 获取 Reaction 内容。 |
| [`count`](#获取消息的-reaction-列表) | `EMMessageReaction` | 获取添加该 Reaction 的用户数量。 |
| [`userList`](#获取-reaction-详情) | `EMMessageReaction` | 获取当前页或概览中的 Reaction 用户列表。 |
