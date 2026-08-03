# 获取历史消息

## 功能说明

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

SDK 内部使用 SQLite 保存本地消息，你可以获取本地消息。本文介绍环信即时通讯 IM SDK 如何从服务器和本地获取历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 从服务器获取指定会话的消息

你可以调用 `fetchMessagesFromServerBy`，基于 `EMFetchServerMessagesOption` 从服务端分页拉取单聊、群聊和已开通服务的聊天室历史消息。建议每次获取 20 条，最大不超过 50 条；当返回的消息数小于 `pageSize` 时，表示已无更多消息。

通过 `EMFetchServerMessagesOption`，可以设置消息发送方、消息类型、时间段、搜索方向，以及是否保存到本地数据库。对于群组聊天，你可以设置 `fromIds` 拉取群组中一个或多个指定成员发送的历史消息。
若初始化时开启 `EMOptions#regardImportMessagesAsRead`，通过 [通过服务端接口](/document/server-side/message_import_single.html) 导入的消息在拉取后为已读状态，会话的 `unreadMessagesCount` 不增加；关闭时则会增加。

:::tip
1. **默认可获取单聊和群聊历史消息；聊天室历史消息功能需联系环信商务开通。**
2. 获取单聊历史消息时读取服务端保存的送达和已读状态的功能默认关闭；如需使用，请联系环信商务开通。
3. 历史消息在服务器上的存储时间与产品套餐包相关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。
:::

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `NSString *` | 单聊传对端用户 ID；群聊传群组 ID；聊天室传聊天室 ID。 |
| `conversationType` | `EMConversationType` | 会话类型。 |
| `cursor` | `NSString *` | 分页游标。首次调用传空字符串；后续传上一次返回的 `cursor`。 |
| `pageSize` | `NSUInteger` | 每页拉取消息数，取值范围为 `[1, 50]`。 |
| `option` | `EMFetchServerMessagesOption *` | 服务端历史消息拉取选项。 |

```objectivec
EMFetchServerMessagesOption *option = [EMFetchServerMessagesOption new];
option.isSave = YES;
option.direction = EMMessageSearchDirectionDown;

[[EMClient sharedClient].chatManager fetchMessagesFromServerBy:conversationId
                                               conversationType:EMConversationTypeChat
                                                         cursor:@""
                                                       pageSize:20
                                                         option:option
                                                     completion:^(EMCursorResult<EMChatMessage *> *result, EMError *error) {
    if (!error) {
        // result.list 为当前页消息；result.cursor 用于拉取下一页。
    }
}];
```

## 从服务器获取指定群成员发送的消息

对于单个群组会话，你可以从服务器获取指定成员（而非全部成员）发送的消息。将 `fromIds` 设置为目标成员的用户 ID 列表即可。

参数说明如下：

| 参数名             | 类型                                | 描述                                                        |
| ------------------ | ----------------------------------- | ----------------------------------------------------------- |
| `conversationId`   | `NSString *`                        | 群聊传群组 ID。                                             |
| `conversationType` | `EMConversationType`                | 会话类型，此处设置为 `EMConversationTypeGroupChat`。        |
| `cursor`           | `NSString *`                        | 分页游标。首次调用传空字符串；后续传上一次返回的 `cursor`。 |
| `pageSize`         | `NSUInteger`                        | 每页拉取消息数，取值范围为 `[1, 50]`。                      |
| `option`           | `EMFetchServerMessagesOption *`     | 服务端历史消息拉取选项。                                    |
| `option.isSave`    | `BOOL`                     | 是否将拉取到的消息保存到本地数据库。                         |
| `option.direction` | `EMMessageSearchDirection` | 搜索方向。  - `EMMessageSearchDirectionUp`：按消息时间戳的降序获取；  - `EMMessageSearchDirectionDown`：按消息时间戳的升序获取。 |
| `option.fromIds`   | `NSArray<NSString *> *`             | 指定要拉取的群成员用户 ID 列表。                            |
| `messages`         | `NSMutableArray<EMChatMessage *> *` | 业务侧用于累积各分页拉取结果的数组。                        |

```objectivec
// 单聊传对端用户 ID；群聊传群组 ID；聊天室传聊天室 ID。
NSString *conversationId = @"groupId";
EMConversationType conversationType = EMConversationTypeGroupChat;

EMFetchServerMessagesOption *option = [[EMFetchServerMessagesOption alloc] init];

// 可选：将拉取到的消息保存到本地数据库。
option.isSave = YES;

// 可选：按消息时间正序拉取。
option.direction = EMMessageSearchDirectionDown;

// 可选：拉取群组中指定成员发送的消息。
option.fromIds = @[@"user1", @"user2"];

NSInteger pageSize = 40;
NSMutableArray<EMChatMessage *> *messages = [NSMutableArray array];

[self fetchHistoryMessagesWithConversationId:conversationId
                            conversationType:conversationType
                                      cursor:@""
                                    pageSize:pageSize
                                      option:option
                                    messages:messages];

- (void)fetchHistoryMessagesWithConversationId:(NSString *)conversationId
                              conversationType:(EMConversationType)conversationType
                                        cursor:(NSString *)cursor
                                      pageSize:(NSInteger)pageSize
                                        option:(EMFetchServerMessagesOption *)option
                                      messages:(NSMutableArray<EMChatMessage *> *)messages {
    [[EMClient sharedClient].chatManager fetchMessagesFromServerBy:conversationId
                                                  conversationType:conversationType
                                                            cursor:cursor
                                                          pageSize:pageSize
                                                            option:option
                                                        completion:^(EMCursorResult<EMChatMessage *> *result, EMError *error) {
        if (error) {
            // 拉取失败。
            return;
        }

        // 添加当前页消息。
        if (result.list.count > 0) {
            [messages addObjectsFromArray:result.list];
        }

        // cursor 为空字符串或 nil 表示没有更多消息。
        NSString *nextCursor = result.cursor;
        if (nextCursor.length > 0) {
            [self fetchHistoryMessagesWithConversationId:conversationId
                                        conversationType:conversationType
                                                  cursor:nextCursor
                                                pageSize:pageSize
                                                  option:option
                                                messages:messages];
        }
    }];
}
```

## 根据关键字获取本地会话中的消息

你可通过关键词获取本地数据库中会话的某些消息。SDK 返回会话 ID 与消息 ID 列表的映射关系，消息 ID 根据 `searchDirection` 按消息时间戳正序或倒序排列。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keyword` | `NSString *` | 搜索关键词。 |
| `timestamp` | `long long` | 搜索起始时间戳，单位为毫秒；传负数表示从最新消息开始。 |
| `fromUser` | `NSString *` | 指定发送方用户 ID；传 `nil` 表示不限制。 |
| `searchDirection` | `EMMessageSearchDirection` | 搜索方向。<br/> - `EMMessageSearchDirectionUp`：按消息时间戳的降序获取；<br/> - `EMMessageSearchDirectionDown`：按消息时间戳的升序获取。 |
| `scope` | `EMMessageSearchScope` | 搜索内容、扩展字段或两者。 |

```objectivec
[[EMClient sharedClient].chatManager loadConversationMessagesWithKeyword:@"时间"
                                                                 timestamp:-1
                                                                  fromUser:nil
                                                           searchDirection:EMMessageSearchDirectionUp
                                                                     scope:EMMessageSearchScopeContent
                                                                completion:^(NSDictionary<NSString *, NSArray<NSString *> *> *result, EMError *error) {
    if (!error) {
        // result 的 key 为会话 ID，value 为匹配的消息 ID 列表。
    }
}];
```

## 根据消息 ID 获取本地消息

你可以传入单个或多个消息 ID 获取单个本地会话中的消息，每次最多传入 20 个消息 ID。

```objectivec
// messageIds：消息 ID 列表。每次最多可传入 20 个消息 ID。
[[EMClient sharedClient].chatManager getMessages:messageIds
                              withConversationId:conversationId
                                      completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    if (!error) {
        // messages 为查询到的本地消息。
    }
}];
```

## 从本地获取指定群成员发送的消息

对于单个群组会话，你可以从本地获取指定成员（而非全部成员）发送的消息。

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:groupId];
if (conversation) {
    // senders 最多包含 10 个用户 ID；nil 或空数组表示不限制发送方。
    // searchDirection：消息搜索方向。EMMessageSearchDirectionUp：按消息时间戳的降序获取；EMMessageSearchDirectionDown：按消息时间戳的升序获取。
    [conversation loadMessagesWithKeyword:nil timestamp:-1 count:20 fromUsers:@[@"user1", @"user2"] searchDirection:EMMessageSearchDirectionUp scope:EMMessageSearchScopeContent completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
        if (!error) {
            // 处理搜索结果。
        }
    }];
}
```

## 从本地读取指定会话的消息

你可以调用 `loadMessagesStartFromId` 从本地数据库分页加载指定会话的消息。传入空消息 ID 时，`EMMessageSearchDirectionUp` 从最新消息开始倒序加载，`EMMessageSearchDirectionDown` 从最早消息开始正序加载。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `startMessageId` | `NSString *` | 查询起始消息 ID；传空表示按搜索方向从最新或最早消息开始。 |
| `count` | `int` | 每次加载的消息数；小于等于 `0` 时加载 1 条。 |
| `searchDirection` | `EMMessageSearchDirection` | 消息搜索方向：<br/> - `EMMessageSearchDirectionUp`：按消息时间戳的降序获取；<br/> - `EMMessageSearchDirectionDown`：按消息时间戳的升序获取。 |

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
if (conversation) {
    [conversation loadMessagesStartFromId:startMessageId count:20 
    searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
        if (!error) {
            // messages 为当前页本地消息。
        }
    }];
}
```

## 根据消息 ID 获取单个本地消息

你可以调用 `getMessageWithMessageId` 根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回 `nil`。

```objectivec
// messageId：要获取消息的消息 ID。
EMChatMessage *message = [[EMClient sharedClient].chatManager getMessageWithMessageId:messageId];
```

## 获取本地会话中特定类型的消息

你可以调用 `loadMessagesWithType` 从本地存储中获取指定会话中特定类型的消息。每次最多可获取 400 条消息；若未获取到任何消息，SDK 返回空列表。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `type` | `EMMessageBodyType` | 要搜索的消息类型。 |
| `timestamp` | `long long` | 搜索起始时间戳，单位为毫秒；传负数表示从当前时间开始。 |
| `count` | `int` | 每次搜索的消息数量，取值范围为 `[1, 400]`。 |
| `fromUser` | `NSString *` | 发送方用户 ID；传 `nil` 表示不限制。 |
| `searchDirection` | `EMMessageSearchDirection` | 消息搜索方向：<br/> - `EMMessageSearchDirectionUp`：按消息时间戳的降序获取；<br/> - `EMMessageSearchDirectionDown`：按消息时间戳的升序获取。 |

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
[conversation loadMessagesWithType:EMMessageBodyTypeText timestamp:timestamp count:50 fromUser:fromUser searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    // 处理 messages 或 error。
}];
```

## 获取一定时间内本地会话的消息

你可以调用 `loadMessagesFrom` 从本地存储中获取指定会话在一定时间内发送和接收的消息，每次最多可获取 400 条消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `startTime` | `long long` | 查询起始时间戳，单位为毫秒。 |
| `endTime` | `long long` | 查询结束时间戳，单位为毫秒。 |
| `count` | `int` | 每次获取的消息数量，取值范围为 `[1, 400]`。 |

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
[conversation loadMessagesFrom:startTime to:endTime count:50 completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    // 处理 messages 或 error。
}];
```

## 获取会话在一定时间内的消息数

你可以调用 `getMessageCountStart` 从 SDK 本地数据库中获取会话在某个时间段内的全部消息数。

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
// 统计起止时间（毫秒）范围内的本地消息数量。
NSInteger count = [conversation getMessageCountStart:startTimestamp to:endTimestamp];
```

## 接口列表

| API 名称                                                     | 所属模块/类      | 说明                                   |
| :--- | :--- | :--- |
| [`fetchMessagesFromServerBy`](#从服务器获取指定会话的消息)   | `IEMChatManager` | 从服务端分页获取指定会话的历史消息。   |
| [`loadConversationMessagesWithKeyword`](#根据关键字获取本地会话中的消息) | `IEMChatManager` | 根据关键词从本地数据库搜索消息。       |
| [`getMessages`](#根据消息-id-获取本地消息)                   | `IEMChatManager` | 根据消息 ID 获取本地消息。             |
| [`loadMessagesWithKeyword`](#从本地获取指定群成员发送的消息) | `EMConversation` | 根据关键词和发送方从本地会话搜索消息。 |
| [`loadMessagesStartFromId`](#从本地读取指定会话的消息)       | `EMConversation` | 从本地数据库分页加载会话消息。         |
| [`getMessageWithMessageId`](#根据消息-id-获取单个本地消息)   | `IEMChatManager` | 根据消息 ID 获取单条本地消息。         |
| [`loadMessagesWithType`](#获取本地会话中特定类型的消息)      | `EMConversation` | 按消息类型、时间和发送方搜索本地消息。 |
| [`loadMessagesFrom`](#获取一定时间内本地会话的消息)          | `EMConversation` | 按时间范围搜索本地会话消息。           |
| [`getMessageCountStart`](#获取会话在一定时间内的消息数)      | `EMConversation` | 统计指定时间范围内的本地消息数。       |
