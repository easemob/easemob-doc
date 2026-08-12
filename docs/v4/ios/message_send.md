# 发送消息

环信即时通讯 IM iOS SDK 通过 `ChatManager` 类和 `EMChatMessage` 类实现文本、图片、音频、视频和文件等类型的消息的发送。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送文本消息

你可以利用 `EMChatMessage` 类构造一条消息，然后通过 `ChatManager` 将该消息发出。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509 `EMErrorMessageCurrentLimiting`。示例代码如下：

```objectivec
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

## 发送附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

发送附件消息分为以下两步：

1. 创建和发送附件类型消息。
2. SDK 将附件上传到环信服务器。另外，你也可以 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。

消息附件大小和存储限制，详见 [消息附件限制说明](limitation.html#消息存储)。

### 发送语音消息

1. 发送语音消息前，在应用层录制语音文件。  
2. 发送方调用 `initWithLocalPath` 和 `initWithConversationID` 方法传入语音文件的 本地路径、语音时长和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建语音消息，然后调用 `sendMessage` 方法发送消息。SDK 会将文件上传至环信服务器。

```objectivec
// `localPath` 为语音文件本地资源路径，`displayName` 为附件的显示名称。
EMVoiceMessageBody *body = [[EMVoiceMessageBody alloc] initWithLocalPath:localPath displayName:displayName];
body.duration = duration;// 语音时长。
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

### 发送图片消息

自 SDK 4.22.0 版本新增大图资源，一条图片消息通常包含三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：服务端基于原图进行等比压缩后的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

发送图片消息的流程如下：

1. 获取图片的本地路径。

2. 调用 `initWithLocalPath:displayName:` 和 `initWithConversationID` 创建图片消息。
   
   创建消息时，需要传入图片的本地路径、设置是否发送原图的标志，以及接收方的用户 ID。若为群聊或聊天室消息，则分别传入群组 ID 或聊天室 ID。

  `isOriginalImage` 属性用于控制实际上传的图片资源：`YES` 表示 SDK 上传原图，`NO` 表示上传大图。

3. 调用 `sendMessage` 方法发送消息。
   
   如果开启了 `EMOptions#isAutoTransferMessageAttachments`，SDK 会自动上传图片附件。服务器自动生成图片缩略图。

```objectivec
// `localPath` 为图片本地资源路径，`displayName` 为附件的显示名称。
EMImageMessageBody *body = [[EMImageMessageBody alloc] initWithLocalPath:localPath displayName:displayName];
// 是否发送原图。`YES` 表示上传原图，`NO` 表示上传大图，默认为 `NO`。
body.isOriginalImage = NO;
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];

// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

### 发送 GIF 图片消息

- 自 iOS SDK 4.14.0 开始，支持发送 GIF 图片消息。
- GIF 图片消息是一种特殊的图片消息，与普通图片消息不同，**GIF 图片发送时不能压缩**。
- 图片缩略图的生成与普通图片消息相同，详见 [发送图片消息](#发送图片消息)。

发送 GIF 图片消息的过程如下：

1. 构造 `EMImageMessageBody` 后，设置 `isGif` 为 `true`。
2. 使用 `EMImageMessageBody#initWithGifFilePath:displayName` 方法构造图片消息体。
3. 调用 `ChatManager#sendMessage` 方法发送消息。

```objectivec
// `localGifFilePath` 为 GIF 图片本地路径，`displayName` 为附件的显示名称。
EMImageMessageBody *body = [[EMImageMessageBody alloc] initWithGifFilePath:localGifFilePath displayName:displayName];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];

// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

### 发送视频消息

发送视频消息前，需要先准备视频文件、本地缩略图路径和视频时长。其中，缩略图和时长主要用于消息展示。

发送视频消息的流程如下：

1. 在应用层完成视频文件的选取或录制，并准备视频文件的本地路径、视频时长和缩略图路径。
2. 调用 `initWithLocalPath` 方法传入视频文件的本地路径、消息的显示名称和视频时长，构建视频消息体。然后，调用 `initWithConversationID` 方法传入会话 ID 和视频消息体，构建视频消息。
3. 调用 `sendMessage` 方法发送消息。 
   发送过程中，SDK 会将视频文件上传至环信消息服务器，自动将视频的首帧作为视频缩略图。上传完成后再发送消息。你可以结合消息状态或相关回调感知上传进度以及发送结果。

```objectivec
// `localPath` 为本地资源路径，`displayName` 为视频的显示名称。
EMVideoMessageBody *body = [[EMVideoMessageBody alloc] initWithLocalPath:localPath displayName:@"displayName"];
body.duration = duration;// 视频时长。

EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

### 发送文件消息

1. 发送方调用 `initWithData` 和 `initWithConversationID` 方法传入文件的本地资源标志符和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建文件消息。
2. 发送方调用 `sendMessage` 方法发送文件消息。SDK 将文件上传至环信服务器。

```objectivec
// `fileData` 为本地资源，`fileName` 为附件的显示名称。
EMFileMessageBody *body = [[EMFileMessageBody alloc] initWithData:fileData displayName:fileName];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

## 发送位置消息

1. 发送方调用 `initWithLatitude` 方法和 `initWithConversationID` 方法创建位置消息。
2. 发送方调用 `sendMessage` 方法发送位置消息。
  
发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。  

```objectivec
// `latitude` 为纬度，`longitude` 为经度，`address` 为具体位置内容。
EMLocationMessageBody *body = [[EMLocationMessageBody alloc] initWithLatitude:latitude longitude:longitude address:aAddress];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

## 发送透传消息

可将透传消息理解为一条指令，通过发送这条指令给对方，通知对方要执行的操作，收到消息可以自定义处理。
具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 `action` 为内部保留字段，注意不要使用。
透传消息适用于更新头像、更新昵称等场景。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

发送透传消息的过程如下：

1. 发送方调用 `initWithAction` 方法创建透传消息。
2. 发送方调用 `sendMessage` 方法发送透传消息。

```objectivec
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

## 发送自定义类型消息

你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

1. 发送方调用 `initWithEvent` 和 `initWithConversationID` 方法创建自定义消息。
2. 发送方调用 `sendMessage` 方法发送自定义消息。

```objectivec
// event 为需要传递的自定义消息事件，比如名片消息，可以设置 "userCard"；`customExt` 为事件扩展字段，比如可以设置 `uid`，`nickname`，`avatar`。
EMCustomMessageBody* body = [[EMCustomMessageBody alloc] initWithEvent:@"userCard" customExt:@{@"uid":aUid ,@"nickname":aNickName,@"avatar":aUrl}];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:fromChatUsername to:toChatUsername body:body ext:messageExt];
// 设置 `EMChatMessage` 类的 `ChatType` 属性，可设置为 `EMChatTypeChat`、`EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`，即单聊、群聊或聊天室消息，默认为单聊。
message.chatType = EMChatTypeGroupChat;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

## 发送合并消息

为了方便消息互动，即时通讯 IM 自 4.1.0 版本开始支持将多个消息合并在一起进行转发。你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。

你可以调用 `EMCombineMessageBody#initWithTitle:summary:compatibleText:messageIdList` 方法构造一条合并消息体，然后创建消息 `EMChatMessage` 并调用 `sendMessage` 方法发送该条消息。

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
4. 对于转发合并消息，例如，用户 A 向 用户 B 发送了合并消息，用户 B 将该合并消息转发给用户 C，需要调用转发单条合并消息的 API。详见[转发单条消息](message_forward.html#转发单条消息)。
:::

示例代码如下：

```objectivec
EMCombineMessageBody* combineMsgBody = [[EMCombineMessageBody alloc] initWithTitle:@"combineTitle" summary:@"combineSummary" compatibleText:@"combineCompatibleText" messageIdList:@[@"messageId1",@"messageId2"]];
EMChatMessage* msg = [[EMChatMessage alloc] initWithConversationID:@"conversationId" body:combineMsgBody ext:nil];
[EMClient.sharedClient.chatManager sendMessage:msg progress:nil completion:^(EMChatMessage * _Nullable message, EMError * _Nullable error) {

}];
```

## 更多

### 上传消息附件至自有服务器

发消息时，若要将消息附件上传至你自己的服务器（而非环信服务器），需执行以下操作：

1. 在 SDK 初始化时将 `EMOptions#isAutoTransferMessageAttachments` 参数设置为 `NO`，使 SDK **不再自动上传或下载附件**。设置后，`EMChatManager#sendMessage()` 将不再处理图片、视频等附件的自动处理与上传逻辑。
2. 图片上传到你的服务器后，将附件 URL 填入消息体，然后发送消息。
   以图片消息为例，上传后获取其 URL，通过 `sendPrivateUrlImg` 设置到消息体中，然后调用 `sendMessage()` 发送消息。

```objectivec
- (void)sendPrivateUrlImg:(NSString*)urlPath
{
    // 构造图片消息
    EMImageMessageBody* body = [[EMImageMessageBody alloc] initWithLocalPath:@"localPath" displayName:@"IMG_111.png"];
    body.remotePath = urlPath; // 图片远程路径
    body.size = CGSizeMake(100, 100); // 图片尺寸
    body.fileLength = 10000; // 图片文件大小，单位为字节
    EMChatMessage* message = [[EMChatMessage alloc] initWithConversationID:@"toUserId" body:body ext:nil];
    // 发送图片消息
    [EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:^(EMChatMessage * _Nullable message, EMError * _Nullable error) {
            
    }];
}
```

### 聊天室消息优先级与消息丢弃逻辑

- **消息优先级**：对于聊天室消息，环信即时通讯提供消息分级功能，支持高、普通和低三种优先级，高优先级的消息会优先送达。你可以在创建消息时对指定消息类型或指定成员的消息设置为高优先级，确保这些消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

- **消息丢弃逻辑**：对于单个聊天室，每秒发送的消息数量默认超过 20 条，则会触发消息丢弃逻辑，即首先丢弃低优先级的消息，优先保留高优先级的消息。若带有优先级的消息超过了 20 条/秒，则按照消息发送时间顺序处理，丢弃后发送的消息。

```objectivec
EMTextMessageBody* textBody = [[EMTextMessageBody alloc] initWithText:@"Hi"];
EMChatMessage* message = [[EMChatMessage alloc] initWithConversationID:@"roomId" body:textBody ext:nil];
message.chatType = EMChatTypeChatRoom;
// 聊天室消息的优先级。如果不设置，默认值为 `Normal`，即“普通”优先级。
message.priority = EMChatRoomMessagePriorityHigh;
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

### 语聊房麦位管理

基于 [聊天室自定义属性](room_attributes.html)，实现语聊房的麦位状态管理与多端实时同步。将麦位列表（含用户信息、麦位状态、音量等字段）作为房间属性存储，任何麦位变更通过更新属性触发全房间广播，确保所有客户端状态一致。详见 [聊天室自定义属性](room_attributes.html)。

### 获取发送附件消息的进度

发送附件类型消息时，可以在 `progress` 回调中获取附件上传的进度，以百分比表示，示例代码如下：

```objectivec
// 发送消息时可以设置 completion 回调，在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
[[EMClient sharedClient].chatManager sendMessage:message progress:^(int progress) {
        // progress 为附件上传进度块的百分比。
} completion:^(EMChatMessage *message, EMError *error) {
    // error 为发送结果，message 为发送的消息。
}];
```

### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/value-added/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

默认情况下，内容审核替换后的内容仅下发至接收方。发送方如需同步接收替换内容，需 **联系环信商务开通权限**，并在初始化 SDK 时将 `EMOptions#useReplacedMessageContents` 参数设为 `true`。开启后，发送方将在消息被审核替换时收到新内容；若开关关闭（默认状态），则发送方仍保留原始发送内容，不会感知替换结果。

### 消息大小和存储限制

各类消息的大小和存储限制，详见 [消息限制说明](limitation.html#消息大小)。

### 发消息时设置回调路由

回调路由允许你在同一个 App Key 下，将不同消息按回调环境维度分别投递到不同的回调地址。发送消息时，你可以在消息中携带回调环境字段（如 `dev`、`test`、`prod`），环信服务器收到消息后，根据该字段匹配控制台中配置的 [回调路由规则](/product/console/basic_webhook.html#配置消息回调规则)，并将当前消息回调至对应的 [发送前回调](/document/server-side/callback_presending.html) 或 [发送后回调](/document/server-side/callback_postsending.html) 地址。

:::tip
目前，该功能仅面向国内 1 区和国内 2 区开放。
:::

**适用场景**

| 场景               | 说明                                                         |
| :----------------- | :----------------------------------------------------------- |
| 多环境隔离     | 同一 App Key 下区分开发、测试、生产环境，消息分别回调至各自的服务地址。 |
| 灰度发布      | 部分消息回调至新链路验证，其余消息仍走旧链路。               |
| 多业务线分流   | 不同业务模块的消息回调至各自的审核、风控或同步服务。         |
| 降低发送前时延 | 避免消息先统一回调至一个入口，再由业务服务器二次转发。       |

**适用范围**

| 回调类型    | 生效范围       | 说明      |
| :------------- | :------- | :---------------- |
| [发送前回调](/document/server-side/callback_presending.html) | 仅对 **SDK 发送的消息** 生效（不支持群组/聊天室的定向消息）。 | 消息下发给目标用户前，你的服务器可判断是否拦截或修改消息内容。 |
| [发送后回调](/document/server-side/callback_postsending.html) | 对 **SDK 和 REST API 发送的消息** 均生效。  | 消息成功发送后，通知你的服务器。   |

**工作流程**

1. 在控制台为发送前回调或发送后回调 [配置回调路由](/product/console/basic_webhook.html#配置消息回调规则)。
2. 客户端发送消息时，设置回调环境值。
3. 环信服务器收到消息后，根据消息中的回调环境值匹配当前阶段的回调地址。
4. 命中有效路由后，服务器将回调请求发送到对应地址。

**示例代码**

发消息时你可以调用 `webhookEnv` 设置回调环境。

关于 `webhookEnv`，建议遵循以下规则：

| 参数 |类型 | 是否必需 | 说明 |
| :--- | :--- |  :--- | :--- |
| `webhookEnv` | String |否 | 回调环境值。回调环境仅支持字母和数字，长度不超过 8 个字符。服务器根据该值匹配控制台中的回调路由。建议与控制台中配置的回调环境保持一致，例如 `dev`、`test`、`prod`。 |

```swift
func sendTextMessage(to userId: String, text: String, webhookEnv: String?) {
      // 创建文本消息体
      let body = EMTextMessageBody(text: text)

      // 设置回调环境字段。
      // 建议与控制台中配置的回调环境保持一致，例如 dev、test、prod。

      // 创建消息
      let message = EMChatMessage(
          conversationID: userId,
          body: body,
          ext: ext
      )

      // 单聊；群聊/聊天室时改为 .groupChat 或 .chatRoom
      message.chatType = .chat

      message.webhookEnv = "dev"
      // 发送消息
      EMClient.shared().chatManager?.sendMessage(
          message,
          progress: nil
      ) { sentMessage, error in
          if let error = error {
              print("发送失败: \(error.errorDescription ?? "")")
              return
          }

          print("发送成功, messageId: \(sentMessage?.messageId ?? "")")
      }
  }
```

**消息中的回调环境字段命中规则**

| 场景                                     | 路由结果                                                     |
| :--------------------------------------- | :----------------------------------------------------------- |
| 携带环境值且命中有效路由           | 按该环境值路由至对应的回调地址。                             |
| 携带环境值但未命中有效路由           | **不触发回调**，控制台中的 `default` 兜底配置在此场景下 **不生效**。 |
| 未携带环境值                         | 自动路由至 `default` 环境对应的回调地址。                    |
| 同一消息需同时触发发送前与发送后回调 | 两个阶段必须使用 **相同的环境值**。例如，发送前配置 `test -> url1`，发送后配置 `test -> url2`，则消息中携带 `test` 即可同时生效于两阶段。 |

