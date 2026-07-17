# 搜索服务端消息

## 功能说明

服务端消息搜索用于按关键词从服务端搜索当前用户可见的历史消息，适用于全局消息搜索、会话内搜索、按消息类型过滤搜索以及按时间范围检索消息等场景。

iOS SDK 提供 `IEMChatManager#searchMessagesFromServerWithOption:pageSize:pageNum:completion:` 方法进行服务端消息搜索。该接口支持以下功能：

- 支持使用一个或多个关键词搜索历史消息，并设置多关键词匹配关系。
- 支持按指定会话、消息类型和消息发送时间范围筛选结果。
- 支持搜索消息内容、消息扩展字段（`ext`）或同时搜索两者。
- 搜索范围仅限于当前用户参与且有权访问的会话。
- 搜索结果按照相关性排序，支持分页查询和关键词高亮。

## 功能开通

要使用服务端消息搜索功能，需 **联系环信商务开通**。

目前仅国内二区集群支持该功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 iOS SDK v4.24.0 或以上版本的 [初始化](initilization.html) 并 [登录](login.html) 成功。
- 当前应用已开通消息搜索服务。
- 已了解消息搜索服务的使用限制和接口调用频率限制，详见 [使用限制](/product/limitation.html)。

## 搜索服务端消息

### 调用方法

你可以创建 `EMMessageSearchOption` 对象设置搜索条件，然后调用 `IEMChatManager#searchMessagesFromServerWithOption:pageSize:pageNum:completion:` 从服务端异步搜索历史消息。

#### 搜索条件和内容

服务端消息搜索支持以下搜索条件和内容：

| 搜索维度 | 支持能力 | 设置属性 |
| :--- | :--- | :--- |
| 关键词 | 支持使用一个或多个关键词搜索历史消息，并可设置匹配任一关键词或匹配全部关键词。 | `keywordList`、`keywordMatchType` |
| 会话 | 支持搜索全部会话，也可以指定单聊、群聊或聊天室会话。单聊传对方用户 ID，群聊或聊天室传对应的群组 ID 或聊天室 ID。 | `conversationId` |
| 消息类型 | 支持搜索文本、图片、视频、位置、文件、自定义和合并消息，不支持搜索语音消息和透传消息。 | `msgTypes` |
| 时间范围 | 支持按消息发送时间范围搜索。开始时间和结束时间必须同时设置。 | `startTime`、`endTime` |
| 搜索内容 | 支持仅搜索消息内容、仅搜索消息扩展字段（`ext`），或同时搜索两者。消息内容包括文本消息内容以及自动翻译后的文本内容。 | `searchScope` |

#### 消息可见范围

服务端消息搜索仅返回当前用户参与且有权访问的会话中的消息：

- 单聊可返回当前用户作为发送方或接收方的消息。
- 搜索群聊或聊天室消息时，需指定对应的群组 ID 或聊天室 ID，并通过服务端成员身份校验。
- 当前用户已单方面删除的消息不会出现在搜索结果中。

#### 示例代码

```objective-c
EMMessageSearchOption *option = [[EMMessageSearchOption alloc] init];

// 设置关键词列表。
option.keywordList = @[@"hello"];

// 多关键词之间默认使用 OR 关系。
option.keywordMatchType = EMKeywordListMatchTypeOR;

// 可选。单聊传对方用户 ID，群聊传群组 ID，聊天室传聊天室 ID。
option.conversationId = @"groupId";

// 可选。服务端消息搜索不支持语音消息和透传消息。
option.msgTypes = @[@(EMMessageBodyTypeText), @(EMMessageBodyTypeImage)];

// 可选。起止时间必须同时设置，单位为毫秒。
option.startTime = 1700000000000;
option.endTime = 1700100000000;

// 可选。默认仅搜索消息内容。
option.searchScope = EMMessageSearchScopeAll;

NSInteger pageSize = 20;
NSInteger pageNum = 1;

[[EMClient sharedClient].chatManager
    // 搜索选项 `EMMessageSearchOption`。不能为 `nil`。
    searchMessagesFromServerWithOption:option
    // 每页返回的结果数量，取值范围为 1-100。
    pageSize:pageSize
    // 当前页码，从 1 开始。
    pageNum:pageNum
    completion:^(EMPageResult<EMSearchServerMessageResult *> * _Nullable result,
                 EMError * _Nullable error) {
        if (error) {
            // 处理搜索失败。
            return;
        }

        NSArray<EMSearchServerMessageResult *> *messages = result.list;
        NSInteger count = result.count;

        for (EMSearchServerMessageResult *message in messages) {
            NSString *messageId = message.messageId;
            EMMessageBody *body = message.body;
            NSArray<NSString *> *highlightTexts = message.highlightTexts;
        }
    }];
```

#### 搜索参数

`EMMessageSearchOption` 属性说明如下：

| 属性 | 属性类型 | 是否必需 | 描述 |
| --- | --- | --- | --- |
| `keywordList` | `NSArray<NSString *> *` | 是 | 设置关键词列表。每个关键词长度为 1–120 个字符，所有关键词总长度不超过 120 个字符，最多设置 5 个关键词。 |
| `keywordMatchType` | `EMKeywordListMatchType` | 否 | 设置多关键词匹配关系。<br/> - （默认）`EMKeywordListMatchTypeOR` 表示匹配任一关键词。<br/> - `EMKeywordListMatchTypeAND` 表示同时匹配全部关键词。|
| `conversationId` | `NSString *` | 否 | 设置会话 ID。单聊传对方用户 ID；群聊传群组 ID；聊天室传聊天室 ID。为 `nil` 或空表示搜索所有会话。注意：iOS SDK 不需要额外传入会话类型。 |
| `msgTypes` | `NSArray<NSNumber *> *` | 否 | 设置消息类型过滤条件。数组元素为 `EMMessageBodyType` 枚举值，可使用 `EMMessageBodyTypeText`、`EMMessageBodyTypeImage`、`EMMessageBodyTypeVideo`、`EMMessageBodyTypeLocation`、`EMMessageBodyTypeFile`、`EMMessageBodyTypeCustom` 和 `EMMessageBodyTypeCombine`。不支持 `EMMessageBodyTypeVoice` 和 `EMMessageBodyTypeCmd`。 |
| `startTime` | `NSInteger` | 否 | 设置查询开始时间，Unix 时间戳，单位为毫秒。需与结束时间同时设置。 |
| `endTime` | `NSInteger` | 否 | 设置查询结束时间，Unix 时间戳，单位为毫秒。需与开始时间同时设置，而且不应早于开始时间。 |
| `searchScope` | `EMMessageSearchScope` | 否 | 设置搜索范围。<br/> - （默认）`EMMessageSearchScopeContent`：仅搜索消息内容。<br/> - `EMMessageSearchScopeExt`：仅搜索消息扩展字段。<br/> - `EMMessageSearchScopeAll`：搜索消息内容和扩展字段。|

#### 返回结果

搜索结果由服务端按照相关性排序，支持分页查询，并返回与关键词匹配的高亮文本。

搜索完成后，SDK 通过完成回调返回 `EMPageResult<EMSearchServerMessageResult *>` 和 `EMError`：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `list` | `NSArray<EMSearchServerMessageResult *> *` | 当前页的搜索结果列表。搜索无结果时可能为 `nil`。 |
| `count` | `NSInteger` | 当前结果列表的数目。 |

搜索结果为 `EMSearchServerMessageResult` 对象列表。你可以从结果对象中获取消息 ID、消息体、扩展字段、发送方、接收方、会话 ID、会话类型、消息时间戳以及服务端返回的高亮文本列表。

`EMSearchServerMessageResult` 提供以下只读属性：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `messageId` | `NSString *` | 消息 ID。 |
| `body` | `EMMessageBody *` | 消息体，可能为 `nil`。可根据实际消息体类型转换为 `EMTextMessageBody`、`EMImageMessageBody` 等具体类型。 |
| `ext` | `NSDictionary *` | 消息扩展属性，可能为 `nil`。 |
| `from` | `NSString *` | 消息发送方。 |
| `to` | `NSString *` | 消息接收方。 |
| `conversationId` | `NSString *` | 会话 ID。 |
| `chatType` | `EMChatType` | 会话类型，可能为 `EMChatTypeChat`、`EMChatTypeGroupChat` 或 `EMChatTypeChatRoom`。 |
| `timestamp` | `NSInteger` | 消息时间戳，单位为毫秒。 |
| `highlightTexts` | `NSArray<NSString *> *` | 服务端返回的搜索高亮文本列表，可能为 `nil`。 |

### 常见搜索场景

#### 搜索指定会话的消息

如果需要搜索指定会话中的消息，只需设置 `conversationId`。

```objective-c
EMMessageSearchOption *option = [[EMMessageSearchOption alloc] init];
option.keywordList = @[@"订单"];
option.conversationId = @"userId";

[[EMClient sharedClient].chatManager
    searchMessagesFromServerWithOption:option
    pageSize:20
    pageNum:1
    completion:^(EMPageResult<EMSearchServerMessageResult *> * _Nullable result,
                 EMError * _Nullable error) {
        if (!error) {
            NSArray<EMSearchServerMessageResult *> *messages = result.list;
        }
    }];
```

#### 使用多个关键词搜索

如果需要搜索多个关键词，可通过 `EMKeywordListMatchType` 指定匹配方式。

```objective-c
EMMessageSearchOption *option = [[EMMessageSearchOption alloc] init];

// 关键词列表最多包含 5 个关键词；每个关键词长度为 1–120 个字符；
// 所有关键词总长度不超过 120 个字符。
option.keywordList = @[@"会议", @"明天"];
option.keywordMatchType = EMKeywordListMatchTypeAND;

[[EMClient sharedClient].chatManager
    searchMessagesFromServerWithOption:option
    pageSize:20
    pageNum:1
    completion:^(EMPageResult<EMSearchServerMessageResult *> * _Nullable result,
                 EMError * _Nullable error) {
        if (!error) {
            NSArray<EMSearchServerMessageResult *> *messages = result.list;
        }
    }];
```

## 注意事项

- 当前用户已单方面删除的消息不会出现在搜索结果中。
- 搜索服务需要单独开通。若未开通，服务端可能返回 `EMErrorServiceNotEnable`（错误码 `505`）。
- 参数错误可能通过完成回调返回 `EMErrorInvalidParam`（错误码 `110`）；鉴权失败可能返回 `EMErrorUserAuthenticationFailed`（错误码 `202`）；未知服务端错误可能返回 `EMErrorServerUnknownError`（错误码 `303`）。
