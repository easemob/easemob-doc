# 发送和接收消息

<Toc />

环信即时通讯 IM iOS SDK 通过 `ChatManager` 类和 `EMChatMessage` 类实现文本、图片、音频、视频和文件等类型的消息的发送和接收。

- 对于单聊，环信即时通信 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要[开启好友关系检查](/product/enable_and_configure_IM.html#好友关系检查)。

- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。

单聊、群组聊天和聊天室的消息发送控制，详见[消息发送控制](/product/product_message_overview.html#消息发送控制)文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送和接收文本消息

1. 你可以利用 `EMChatMessage` 类构造一条消息，然后通过 `ChatManager` 将该消息发出。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509 `EMErrorMessageCurrentLimiting`。示例代码如下：

```objective-c
// 调用 initWithText 创建文本消息。`content` 为文本消息的内容。
EMTextMessageBody *textMessageBody = [[EMTextMessageBody alloc] initWithText:content];
// 消息接收方，单聊为对端用户的 ID，群聊为群组 ID，聊天室为聊天室 ID。
NSString* conversationId = @"remoteUserId";
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId
                                                      body:textMessageBody
                                                               ext:messageExt];
// 会话类型，单聊为 `EMChatTypeChat`，群聊为 `EMChatTypeGroupChat`，聊天室为 `EMChatTypeChatRoom`，默认为单聊。
message.chatType = EMChatTypeChatRoom;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message
                                        progress:nil
                                      completion:nil];

```

2. 你可以用注册监听 `EMChatManagerDelegate` 接收消息。该 `EMChatManagerDelegate` 可以多次添加，请记得在不需要的时候移除 `Delegate`，如在 `ViewController` `dealloc()` 时。

在新消息到来时，你会收到 `messagesDidReceive` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。若在初始化时打开了 `EMOptions#includeSendMessageInMessageListener` 开关，则该回调中会返回发送成功的消息。

对于聊天室消息，你可以通过消息的 `EMChatMessage#broadcast` 属性判断该消息是否为[通过 REST API 发送的聊天室全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。

```objective-c
// 添加代理。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 收到消息回调。

- (void)messagesDidReceive:(NSArray *)aMessages
  {
  // 收到消息，遍历消息列表。
  for (EMChatMessage *message in aMessages) {
    // 消息解析和展示。
  }
  }

// 移除代理。

- (void)dealloc
  {
  [[EMClient sharedClient].chatManager removeDelegate:self];
  }
```

## 发送和接收附件类型的消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

附件消息的发送和接收过程如下：

1. 创建和发送附件类型消息。SDK 将附件上传到环信服务器。
2. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用 `downloadAttachment` 方法。
3. 获取附件的服务器地址和本地路径。

### 发送和接收语音消息

发送和接收语音消息的过程如下：

1. 发送语音消息前，在应用层录制语音文件。
   
2. 发送方调用 `initWithLocalPath` 和 `initWithConversationID` 方法传入语音文件的 URI、语音时长和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建语音消息，然后调用 `sendMessage` 方法发送消息。SDK 会将文件上传至环信服务器。

```objective-c
// `localPath` 为语音文件本地资源路径，`displayName` 为附件的显示名称。
EMVoiceMessageBody *body = [[EMVoiceMessageBody alloc] initWithLocalPath:localPath displayName:displayName];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

3. 接收方收到语音消息时，自动下载语音文件。

4. 接收方收到 [messagesDidReceive 回调](#发送和接收文本消息)，调用 `remotePath` 或 `localPath` 方法获取语音文件的服务器地址或本地路径，从而获取语音文件。

```objective-c
EMVoiceMessageBody *voiceBody = (EMVoiceMessageBody *)message.body;
// 获取语音文件在服务器的地址。
NSString *voiceRemotePath = voiceBody.remotePath;
// 本地语音文件的资源路径。
NSString *voiceLocalPath = voiceBody.localPath;
```

### 发送和接收图片消息

发送和接收图片消息的流程如下：

1. 发送方调用 `initWithData` 和 `initWithConversationID` 方法传入图片的本地资源标志符 URI、设置是否发送原图以及接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建图片消息，然后调用 `sendMessage` 方法发送该消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。

```objective-c
// `imageData` 为图片本地资源，`displayName` 为附件的显示名称。
EMImageMessageBody *body = [[EMImageMessageBody alloc] initWithData:imageData displayName:displayName];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];

// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

```objective-c
// 发送成功后，获取图片消息缩略图及附件。
EMImageMessageBody *body = (EMImageMessageBody *)message.body;
// 从服务器端获取图片文件。
NSString *remotePath = body.remotePath;
// 从服务器端获取图片缩略图。
NSString *thumbnailPath = body.thumbnailRemotePath;
// 从本地获取图片文件。
NSString *localPath = body.localPath;
// 从本地获取图片缩略图。
NSString *thumbnailLocalPath = body.thumbnailLocalPath;
```

2. 接收方收到图片消息，自动下载图片缩略图。

- 默认情况下，SDK 自动下载缩略图，即 `[EMClient sharedClient].options.isAutoDownloadThumbnail;` 为 `YES`。
- 若设置为手动下载缩略图，即 `[EMClient sharedClient].options.isAutoDownloadThumbnail(NO);`，需调用 `[[EMClient sharedClient].chatManager downloadMessageThumbnail:message progress:nil completion:nil];` 下载。

3. 接收方收到 [messagesDidReceive 回调](#发送和接收文本消息)，调用 `downloadMessageAttachment` 下载原图。

下载完成后，在回调里调用相应消息 `body` 的 `thumbnailLocalPath` 获取缩略图路径。

```objective-c
EMImageMessageBody *imageBody = (EMImageMessageBody *)message.body;
// 图片文件的本地缩略图资源路径。
NSString *thumbnailLocalPath = imageBody.thumbnailLocalPath;
```

4. 获取图片消息的附件。

```objective-c
[[EMClient sharedClient].chatManager downloadMessageAttachment:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
            if (!error) {
                EMImageMessageBody *imageBody = (EMImageMessageBody *)message.body;
                NSString *localPath = imageBody.localPath;
            }
        }];
```

### 发送和接收视频消息

发送和接收视频消息的流程如下：

1. 发送视频消息前，在应用层完成视频文件的选取或者录制。

2. 发送方调用 `initWithLocalPath` 方法传入视频文件的本地资源标志符、消息的显示名称和视频时长，构建视频消息体。然后，调用 `initWithConversationID` 方法传入会话 ID 和视频消息体，构建视频消息。最后，调用 `sendMessage` 方法发送消息。SDK 会将视频文件上传至环信消息服务器，自动将视频的首帧作为视频缩略图。

```objective-c
// `localPath` 为本地资源路径，`displayName` 为视频的显示名称。
EMVideoMessageBody *body = [[EMVideoMessageBody alloc] initWithLocalPath:localPath displayName:@"displayName"];
body.duration = duration;// 视频时长。

EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

3. 接收方收到视频消息时，自动下载视频缩略图。你可以设置自动或手动下载视频缩略图，该设置与图片缩略图相同，详见[设置图片缩略图自动下载](#发送和接收图片消息)。

4. 接收方收到 [messagesDidReceive 回调](#发送和接收文本消息)，可以调用 `downloadMessageAttachment` 方法下载视频原文件。

5. 获取视频缩略图和视频原文件。

```objective-c
// 发送成功后，获取视频消息缩略图及附件。
EMVideoMessageBody *body = (EMVideoMessageBody *)message.body;
// 从服务器端获取视频文件的地址。
NSString *remotePath = body.remotePath;
// 从服务器端获取视频缩略图。
NSString *thumbnailPath = body.thumbnailRemotePath;
// 从本地获取视频文件。
NSString *localPath = body.localPath;
// 从本地获取视频缩略图。
NSString *thumbnailLocalPath = body.thumbnailLocalPath;
```

### 发送和接收文件消息

发送和接收文件消息的流程如下：

1. 发送方调用 `initWithData` 和 `initWithConversationID` 方法传入文件的本地资源标志符和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建文件消息，然后调用 `sendMessage` 方法发送文件消息。SDK 将文件上传至环信服务器。

```objective-c
// `fileData` 为本地资源，`fileName` 为附件的显示名称。
EMFileMessageBody *body = [[EMFileMessageBody alloc] initWithData:fileData displayName:fileName];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

2. 接收方收到 [messagesDidReceive 回调](#发送和接收文本消息)，调用 `downloadMessageAttachment` 方法下载文件。

```objective-c
[[EMClient sharedClient].chatManager downloadMessageAttachment:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
            if (!error) {
                // 附件下载成功
            }
        }];
```

3. 调用以下方法从服务器或本地获取文件附件：

```objective-c
EMFileMessageBody *body = (EMFileMessageBody *)message.body;
// 从服务器端获取文件路径。
NSString *remotePath = body.remotePath;
// 从本地获取文件路径。
NSString *localPath = body.localPath;
```

## 发送和接收位置消息

1. 创建和发送位置消息。
  
发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。  

```objective-c
// `latitude` 为纬度，`longitude` 为经度，`address` 为具体位置内容。
EMLocationMessageBody *body = [[EMLocationMessageBody alloc] initWithLatitude:latitude longitude:longitude address:aAddress];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
message.chatType = EMChatTypeChat;
// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

2. 接收位置消息与文本消息一致，详见[接收文本消息](#发送和接收文本消息)。
   
 接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

## 发送和接收透传消息

可将透传消息理解为一条指令，通过发送这条指令给对方，通知对方要执行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 `action` 为内部保留字段，注意不要使用。

透传消息适用于更新头像、更新昵称等场景。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

1. 创建和发送透传消息。

```objective-c
// `action` 自定义 `NSString` 类型的命令内容。
EMCmdMessageBody *body = [[EMCmdMessageBody alloc] initWithAction:action];
    EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
    // 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
    // 若为群聊，添加下行代码。
    message.chatType = EMChatTypeGroupChat;
    // 若为聊天室，添加下行代码。
    //message.chatType = EMChatTypeChatRoom;
    // 发送消息。
    [[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

2. 接收方通过 `cmdMessagesDidReceive` 回调接收透传消息，方便用户进行不同的处理。

```objective-c
// 收到透传消息。
- (void)cmdMessagesDidReceive:(NSArray *)aCmdMessages{
  for (EMChatMessage *message in aCmdMessages) {
        EMCmdMessageBody *body = (EMCmdMessageBody *)message.body;
        // 进行透传消息 body 解析。
    }
  }
```

## 发送和接收自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

1. 创建和发送自定义类型消息。

```objective-c
// event 为需要传递的自定义消息事件，比如名片消息，可以设置 "userCard"；`ext` 为事件扩展字段，比如可以设置 `uid`，`nickname`，`avatar`。
EMCustomMessageBody* body = [[EMCustomMessageBody alloc] initWithEvent:@"userCard" ext:@{@"uid":aUid ,@"nickname":aNickName,@"avatar":aUrl}];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
message.chatType = EMChatTypeChat;
// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

2. 接收自定义消息与其他类型消息一致，详见[接收文本消息](#发送和接收文本消息)。

## 发送和接收合并消息

为了方便消息互动，即时通讯 IM 自 4.1.0 版本开始支持将多个消息合并在一起进行转发。你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。
3. 对端收到合并消息后进行解析，获取原始消息列表。

:::tip
对于转发合并消息，例如，用户 A 向 用户 B 发送了合并消息，用户 B 将该合并消息转发给用户 C，需要调用转发单条合并消息的 API。详见[转发单条消息](message_forward.html#转发单条消息)。
:::

#### 创建和发送合并消息

你可以调用 `EMCombineMessageBody#initWithTitle:summary:compatibleText:messageList` 方法构造一条合并消息体，然后创建消息 `EMChatMessage` 并调用 `sendMessage` 方法发送该条消息。

创建合并消息体时，需要设置以下参数：

| 属性             | 类型   | 描述           |
| :--------------- | :----- | :------------------------------- |
| `title`          | String | 合并消息的标题。      |
| `summary`        | String | 合并消息的概要。      |
| `compatibleText` | String | 合并消息的兼容文本。<br/>兼容文本起向下兼容不支持消息合并转发的版本的作用。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。 |
| `messageIdList`  | List   | 合并消息的原始消息 ID 列表。该列表最多包含 300 个消息 ID。       |

:::tip

1. 合并转发支持嵌套，最多支持 10 层嵌套，每层最多 300 条消息。
2. 只有成功发送或接收的消息才能合并转发。
3. 不论 `EMOptions#isAutoTransferMessageAttachments` 设置为 `false` 或 `true`，SDK 都会将合并消息附件上传到环信服务器。
:::

示例代码如下：

```objective-c
EMCombineMessageBody* combineMsgBody = [[EMCombineMessageBody alloc] initWithTitle:@"combineTitle" summary:@"combineSummary" compatibleText:@"combineCompatibleText" messageIdList:@[@"messageId1",@"messageId2"]];
EMChatMessage* msg = [[EMChatMessage alloc] initWithConversationID:@"conversationId" body:combineMsgBody ext:nil];
[EMClient.sharedClient.chatManager sendMessage:msg progress:nil completion:^(EMChatMessage * _Nullable message, EMError * _Nullable error) {

}];
```

#### 接收和解析合并消息

接收合并消息与接收普通消息的操作相同，详见[接收消息](#发送和接收文本消息)。

对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。

合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `downloadAndParseCombineMessage` 方法下载合并消息附件并解析出原始消息列表。

对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：

- 若附件已存在，该方法会直接解析附件并返回原始消息列表。
- 若附件不存在，该方法首先下载附件，然后解析附件并返回原始消息列表。

```objective-c
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)aMessages
{

    for (EMChatMessage* msg in aMessages) {
        if (msg.body.type == EMMessageBodyTypeCombine) {
            // 合并消息类型，解析合并消息
            [EMClient.sharedClient.chatManager downloadAndParseCombineMessage:msg completion:^(NSArray<EMChatMessage *> * _Nullable messages, EMError * _Nullable error) {

            }];
        }
    }
}
```

## 发送和接收定向消息

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

该功能适用于文本消息、图片消息和音视频消息等全类型消息，最多可向群组或聊天室的 20 个成员发送定向消息。

:::tip
1. 仅 SDK 4.0.3 及以上版本支持。
2. 定向消息不写入服务端会话列表，不计入服务端会话的未读消息数。
3. 群组定向消息的漫游功能默认关闭，使用前需联系商务开通。
4. 聊天室定向消息的漫游功能默认关闭，使用前需联系商务开通聊天室消息漫游和定向消息漫游功能。
:::

发送定向消息的流程与发送普通消息相似，唯一区别是需要设置消息的接收方，具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的接收方。
3. 发送定向消息。

下面以文本消息为例介绍如何发送定向消息，示例代码如下：

```objective-c
// 创建一条文本消息。
EMTextMessageBody* textBody = [[EMTextMessageBody alloc] initWithText:@"hello"];
EMChatMessage* msg = [[EMChatMessage alloc] initWithConversationID:@"groupId" body:textBody ext:nil];
// 会话类型：群组和聊天室聊天，分别为 `EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`。
msg.chatType = EMChatTypeGroupChat;
// 设置消息接收方列表。最多可传 20 个接收方的用户 ID。若传入 `nil`，则消息发送给群组或聊天室的所有成员。
msg.receiverList = @[@"A",@"B"];
// 发送消息。
[EMClient.sharedClient.chatManager sendMessage:msg progress:nil completion:^(EMChatMessage * _Nullable message, EMError * _Nullable error) {

}];
```

接收定向消息与接收普通消息的操作相同，详见[接收文本消息](#发送和接收文本消息)。

## 使用消息扩展字段

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段来传递自定义的内容，从而生成自己需要的消息类型。

当目前消息类型不满足用户需求时，可以在扩展部分保存更多信息，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```objective-c
EMTextMessageBody *textMessageBody = [[EMTextMessageBody alloc] initWithText:content];
// 增加自定义属性。
NSDictionary *messageExt = @{@"attribute":@"value"};
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:textMessageBody ext:messageExt];
message.chatType = EMChatTypeChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];

// 接收消息的时候获取扩展属性。
- (void)messagesDidReceive:(NSArray *)aMessages
  {
  // 收到消息，遍历消息列表。
  for (EMChatMessage *message in aMessages) {
     // value 为消息扩展里 attribute 字段的值。
     NSString *value = [message.ext objectForKey:@"attribute"];  }
  }
```

## 更多

### 设置聊天室消息优先级

针对聊天室消息并发量较大的场景，即时通讯服务提供消息分级功能。你可以通过设置消息优先级，将消息划分为高、普通和低三种级别。你可以在创建消息时，将指定消息类型，或指定成员的所有消息设置为高优先级，确保此类消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

对于聊天室消息，可设置消息优先级。示例代码如下：

```objective-c
EMTextMessageBody* textBody = [[EMTextMessageBody alloc] initWithText:@"Hi"];
EMChatMessage* message = [[EMChatMessage alloc] initWithConversationID:@"roomId" body:textBody ext:nil];
message.chatType = EMChatTypeChatRoom;
// 聊天室消息的优先级。如果不设置，默认值为 `Normal`，即“普通”优先级。
message.priority = EMChatRoomMessagePriorityHigh;
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

### 获取发送附件消息的进度

发送附件类型消息时，可以在 `progress` 回调中获取附件上传的进度，以百分比表示，示例代码如下：

```objective-c
// 发送消息时可以设置 completion 回调，在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
[[EMClient sharedClient].chatManager sendMessage:message progress:^(int progress) {
        // progress 为附件上传进度块的百分比。
} completion:^(EMChatMessage *message, EMError *error) {
    // error 为发送结果，message 为发送的消息。
}];
```

### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/product/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

若初始化时打开了 `EMOptions#useReplacedMessageContents` 开关，发送文本消息时如果被内容审核（Moderation）进行了内容替换，发送方会收到替换后的内容。若该开关为关闭状态，则发送方不会收到替换后的内容。该属性只能在调用 `initializeSDKWithOptions` 时设置，而且 app 运行过程中不能修改该参数的设置。

