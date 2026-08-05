# 搜索消息

## 功能说明

调用本文中的消息搜索方法可以搜索本地数据库中除透传消息之外的所有类型的消息，因为透传消息不在本地数据库中存储。

:::tip
若要搜索服务端的消息，请联系商务开通。详见 [服务端消息搜索文档](/value-added/search/message_search_android.html)。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，并已 [打开当前用户的本地数据库](login.html#登录完成前使用本地数据库)，详见 [快速开始](quickstart.html)。本地消息搜索不要求客户端保持服务器连接。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 根据关键字搜索会话中的用户发送的消息  

你可以调用 `loadMessagesWithKeyword` 方法根据关键字搜索本地数据库中单个会话中指定用户发送的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `NSString *` | 要搜索的本地会话 ID。 |
| `keyword` | `NSString *` | 搜索关键词。 |
| `timeStamp` | `long long` | 搜索起始时间戳，单位为毫秒；传负数表示从当前时间开始。返回结果不包含时间戳与 `timeStamp` 相同的消息。 |
| `count` | `int` | 每次返回的消息数量；小于等于 `0` 时返回 1 条。 |
| `fromUsers` | `NSArray<NSString *> *` | 指定发送方用户 ID 列表；传 `nil` 表示不限制。 |
| `searchDirection` | `EMMessageSearchDirection` | 消息搜索方向：<br/> - `EMMessageSearchDirectionUp`：按消息时间戳降序搜索。<br/> - `EMMessageSearchDirectionDown`：按消息时间戳升序搜索。 |
| `scope` | `EMMessageSearchScope` | 搜索消息内容、扩展字段或两者。 |

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:@"conversationId"];
// 异步按关键词、发送方和范围搜索当前会话的本地消息。
[conversation loadMessagesWithKeyword:@"keyword" timestamp:-1 count:50 fromUsers:nil searchDirection:EMMessageSearchDirectionDown scope:EMMessageSearchScopeContent completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    if (!error) {
        // 处理搜索结果。
    }
}];
```

## 根据搜索范围搜索所有会话中的消息 

你可以调用 `loadMessagesWithKeyword`，除设置关键字、消息时间戳、消息数量、发送方和搜索方向外，还可以选择仅搜索消息内容、仅搜索消息扩展信息或同时搜索两者。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keyword` | `NSString *` | 搜索关键词。 |
| `timestamp` | `long long` | 搜索起始时间戳，单位为毫秒；传负数表示从当前时间开始。 |
| `count` | `int` | 每次返回的消息数量；小于等于 `0` 时返回 1 条。 |
| `fromUser` | `NSString *` | 指定发送方用户 ID；传 `nil` 表示不限制。 |
| `searchDirection` | `EMMessageSearchDirection` | 消息搜索方向：<br/> - `EMMessageSearchDirectionUp`：按消息时间戳降序搜索。<br/> - `EMMessageSearchDirectionDown`：按消息时间戳升序搜索。|
| `scope` | `EMMessageSearchScope` | 仅搜索消息内容、仅搜索消息扩展字段，或同时搜索二者。 |

```swift
EMClient.shared().chatManager?.loadMessages(withKeyword: "keyword", timestamp: 0, count: 50, fromUser: nil, searchDirection: .down, scope: .content, completion: { messages, aError in
            
        })
```

## 根据搜索范围搜索当前会话中的消息 

你可以调用 `loadMessagesWithKeyword`，除设置关键字、消息时间戳、消息数量、发送方和搜索方向外，还可以选择仅搜索消息内容、仅搜索消息扩展信息或同时搜索两者。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `NSString *` | 要搜索的本地会话 ID。 |
| `keyword` | `NSString *` | 搜索关键词。 |
| `timestamp` | `long long` | 搜索起始时间戳，单位为毫秒；传负数表示从当前时间开始。 |
| `count` | `int` | 每次返回的消息数量；小于等于 `0` 时返回 1 条。 |
| `fromUsers` | `NSArray<NSString *> *` | 指定发送方用户 ID 列表；传 `nil` 表示不限制。 |
| `searchDirection` | `EMMessageSearchDirection` | 消息搜索方向：<br/> - `EMMessageSearchDirectionUp`：按消息时间戳降序搜索。<br/> - `EMMessageSearchDirectionDown`：按消息时间戳升序搜索。 |
| `scope` | `EMMessageSearchScope` | 仅搜索消息内容、仅搜索消息扩展字段，或同时搜索二者。 |

```swift
if let conversation = EMClient.shared().chatManager?.getConversationWithConvId("conversationsId") {
    conversation.loadMessages(withKeyword: "keyword", timestamp: 0, count: 50, fromUsers: nil, searchDirection: .down, scope: .content, completion: { messages, aError in
                
    })
}
```

## 根据消息类型搜索所有会话中的消息

你可以调用 `searchMessagesWithTypes`，除设置消息时间戳、消息数量、发送方和搜索方向外，还可以设置单个或多个消息类型搜索本地数据库中所有会话的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `types` | `NSArray<NSNumber *> *` | 要搜索的消息类型数组，元素为 `EMMessageBodyType` 枚举值。 |
| `timestamp` | `long long` | 搜索起始时间戳，单位为毫秒；传负数表示从当前时间开始。 |
| `count` | `int` | 每次返回的消息数量，取值范围为 `[1, 400]`。 |
| `fromUser` | `NSString *` | 指定发送方用户 ID；传 `nil` 表示不限制。 |
| `searchDirection` | `EMMessageSearchDirection` | 消息搜索方向：<br/> - `EMMessageSearchDirectionUp`：按消息时间戳降序搜索。<br/> - `EMMessageSearchDirectionDown`：按消息时间戳升序搜索。 |

```swift
NSArray<NSNumber *> *types = @[@(EMMessageBodyTypeText), @(EMMessageBodyTypeImage)];
[[EMClient sharedClient].chatManager searchMessagesWithTypes:types timestamp:-1 count:10 fromUser:@"user123" searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    // 处理 messages 或 error。
}];
``` 

## 根据消息类型搜索当前会话中的消息

你可以调用 `searchMessagesWithTypes`，除设置消息时间戳、消息数量、发送方和搜索方向外，还可以设置单个或多个消息类型搜索本地数据库中单个会话的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `NSString *` | 要搜索的本地会话 ID。 |
| `types` | `NSArray<NSNumber *> *` | 要搜索的消息类型数组，元素为 `EMMessageBodyType` 枚举值。 |
| `timestamp` | `long long` | 搜索起始时间戳，单位为毫秒；传负数表示从当前时间开始。 |
| `count` | `int` | 每次返回的消息数量，取值范围为 `[1, 400]`。 |
| `fromUser` | `NSString *` | 指定发送方用户 ID；传 `nil` 表示不限制。 |
| `searchDirection` | `EMMessageSearchDirection` | 消息搜索方向：<br/> - `EMMessageSearchDirectionUp`：按消息时间戳降序搜索。<br/> - `EMMessageSearchDirectionDown`：按消息时间戳升序搜索。 |

```swift
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:@"conversationId"];
NSArray<NSNumber *> *types = @[@(EMMessageBodyTypeText), @(EMMessageBodyTypeImage)];
[conversation searchMessagesWithTypes:types timestamp:-1 count:20 fromUser:@"user123" searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    // 处理 messages 或 error。
}];
```     

## 关键字搜索规则

调用以下消息搜索 API 搜索不同类型的消息时，其中的 `keywords` 参数对应不同的内容。

- [根据关键字搜索本地数据库中单个会话中指定用户发送的消息](#根据关键字搜索会话中的用户发送的消息)。
- [根据关键字搜索消息时，可以选择搜索范围在所有会话中进行消息搜索](#根据搜索范围搜索所有会话中的消息)。
- [根据关键字搜索消息时，可以选择搜索范围在当前会话中进行消息搜索](#根据搜索范围搜索当前会话中的消息)。

### 只搜索消息内容

|消息类型 | 关键字匹配的消息内容 | 关键字搜索内容示例 |
| :-------------- | :----- |:----- |
|文本消息  |  `EMTextMessageBody#text`   | 文本消息的实际内容“你好世界”。|
|图片消息  | `EMImageMessageBody#displayName`       | 图片文件名“photo.jpg”。|
|语音消息  | `EMVoiceMessageBody#displayName`       | 语音文件名“audio.amr”。|
|视频消息  | `EMVideoMessageBody#displayName`       | 视频文件名“video.mp4”。|
|文件消息  |  `EMFileMessageBody#displayName`  | 文件名“report.pdf”。|
|位置消息  |  `EMLocationMessageBody#address 和 EMLocationMessageBody#buildingName`      | 地址\建筑物名称“北京市朝阳区\国贸大厦”|
|自定义消息|   `EMCustomMessageBody#event`     | 自定义事件名“gift”|
|合并消息  |   `EMCombineMessageBody#title 和 EMCombineMessageBody#summary`     | 标题\摘要“聊天记录\包含5条消息”|

### 只搜索扩展信息

若只搜索消息的扩展属性（`ext`）JSON 字符串，`keywords` 字段匹配用户自定义添加的扩展属性，例如：

```json
{"key1":"value1", "key2":"value2"}
```

### 全搜索

同时搜索消息内容和扩展信息，任一匹配即返回。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`loadMessagesWithKeyword`](#根据关键字搜索会话中的用户发送的消息) | `EMConversation` | 异步按关键字搜索当前会话的本地消息。 |
| [`loadMessagesWithKeyword`](#根据搜索范围搜索所有会话中的消息) | `IEMChatManager` | 异步按关键字和搜索范围搜索所有会话的本地消息。 |
| [`loadMessagesWithKeyword`](#根据搜索范围搜索当前会话中的消息) | `EMConversation` | 异步按关键字和搜索范围搜索当前会话的本地消息。 |
| [`searchMessagesWithTypes`](#根据消息类型搜索所有会话中的消息) | `IEMChatManager` | 异步按消息类型搜索所有会话的本地消息。 |
| [`searchMessagesWithTypes`](#根据消息类型搜索当前会话中的消息) | `EMConversation` | 异步按消息类型搜索当前会话的本地消息。 |
