# 消息管理


消息：IM 交互实体，在 SDK 中对应的类型是 **EMChatMessage**。**EMChatMessage** 由 EMMessageBody 组成。

消息涉及到的环信SDK头文件如下:

```
// 消息构建部分
EMChatMessage.h
EMMessageBody.h
EMTextMessageBody.h
EMImageMessageBody.h
EMVoiceMessageBody.h
EMVideoMessageBody.h
EMFileMessageBody.h
EMLocationMessageBody.h
EMCmdMessageBody.h

// 消息方法调用部分，比如添加代理，移除代理，发送消息等，同时也包含会话相关的操作，比如创建或获取会话，获取会话列表等
IEMChatManager.h

// 消息的协议回调方法部分，比如监听接收消息的回调方法等
EMChatManagerDelegate.h
```

## 构造消息

以下构造消息的示例中，使用到的“初始化消息实例”方法的说明:

```
/*!
 *  初始化消息实例
 *
 *  @param aConversationId  会话ID
 *  @param aFrom            发送方
 *  @param aTo              接收方
 *  @param aBody            消息体实例
 *  @param aExt             扩展信息
 *
 *  @result 消息实例
 */
- (id)initWithConversationID:(NSString *)aConversationId
                        from:(NSString *)aFrom
                          to:(NSString *)aTo
                        body:(EMMessageBody *)aBody
                         ext:(NSDictionary *)aExt;
 
```

aConversationId: 会话id，比如a给b发送了一条消息，那么SDK会在a这边生成一个会话，会话id就是b，在构建消息时aConversationId与to保持一致。

to: 表示接收消息方的环信id。

from: 表示当前登录的环信id，一般使用 [EMClient sharedClient].currentUsername; 方法获取。

:::notice
如果是给群组或者聊天室发消息，那么aConversationId和to要换成群组id或者聊天室id
:::

总体来说是当前登录的环信id要给哪个环信id或哪个群组id或哪个聊天室id发消息。

### 构造文字消息

```
/*!
 *  初始化文本消息体
 *
 *  @param aText   文本内容
 *  
 *  @result 文本消息体实例
 */
- (instancetype)initWithText:(NSString *)aText;

// 调用:
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"要发送的消息"];
// 获取当前登录的环信id
NSString *from = [[EMClient sharedClient] currentUsername];

//生成Message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:nil];
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
```

### 构造表情消息

发表情消息实质上是发文本消息。接收方收到文本消息后，首先查询文本消息是否是表情消息，如果是，则显示该文本消息为对应的表情图片。可以使用[emoji标准](https://unicode.org/emoji/charts/full-emoji-list.html)来做表情图片和对应的文本字符串的映射。也可以自行维护表情图片和文本字符串的映射。

```
/*!
 *  初始化表情消息体
 *
 *  @param aText   表情消息文本串
 *  
 *  @result 表情消息体实例
 */
- (instancetype)initWithText:(NSString *)aText;

// 调用:
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"要发送的表情消息文本串"];
// 获取当前登录的环信id
NSString *from = [[EMClient sharedClient] currentUsername];

//生成Message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:nil];
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
```

### 构造图片消息

```
/*!
 *  初始化文件消息体
 *
 *  @param aData        附件数据
 *  @param aDisplayName 附件显示名（不包含路径）
 *
 *  @result 消息体实例
 */
- (instancetype)initWithData:(NSData *)aData
                 displayName:(NSString *)aDisplayName;
                 
// 调用:               
EMImageMessageBody *body = [[EMImageMessageBody alloc] initWithData:data displayName:@"image.png"];
// body.compressionRatio = 1.0f; 1.0表示发送原图不压缩。默认值是0.6，压缩的倍数是0.6倍
NSString *from = [[EMClient sharedClient] currentUsername];

//生成Message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:nil];
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
```

### 构造位置消息

```
/*!
 *  初始化位置消息体
 *
 *  @param aLatitude   纬度
 *  @param aLongitude  经度
 *  @param aAddress    地理位置信息
 *  
 *  @result 位置消息体实例
 */
- (instancetype)initWithLatitude:(double)aLatitude
                       longitude:(double)aLongitude
                         address:(NSString *)aAddress;
                         
// 调用:                         
EMLocationMessageBody *body = [[EMLocationMessageBody alloc] initWithLatitude:39 longitude:116 address:@"地址"];
NSString *from = [[EMClient sharedClient] currentUsername];

// 生成message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:nil];
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
```


### 构造语音消息

```
/*!
 *  初始化文件消息体
 *
 *  @param aLocalPath   附件本地路径
 *  @param aDisplayName 附件显示名（不包含路径）
 *
 *  @result 消息体实例
 */
- (instancetype)initWithLocalPath:(NSString *)aLocalPath
                      displayName:(NSString *)aDisplayName;

// 调用:                      
EMVoiceMessageBody *body = [[EMVoiceMessageBody alloc] initWithLocalPath:@"audioPath" displayName:@"audio"];
body.duration = duration;
NSString *from = [[EMClient sharedClient] currentUsername];

// 生成message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:nil];
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
```

### 构造视频消息

```
/*!
 *  初始化文件消息体
 *
 *  @param aLocalPath   附件本地路径
 *  @param aDisplayName 附件显示名（不包含路径）
 *
 *  @result 消息体实例
 */
- (instancetype)initWithLocalPath:(NSString *)aLocalPath
                      displayName:(NSString *)aDisplayName;
                      
// 调用:                      
EMVideoMessageBody *body = [[EMVideoMessageBody alloc] initWithLocalPath:@"videoPath" displayName:@"video.mp4"];
NSString *from = [[EMClient sharedClient] currentUsername];

// 生成message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:nil];
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
```

### 构造文件消息

```
/*!
 *  初始化文件消息体
 *
 *  @param aLocalPath   附件本地路径
 *  @param aDisplayName 附件显示名（不包含路径）
 *
 *  @result 消息体实例
 */
- (instancetype)initWithLocalPath:(NSString *)aLocalPath
                      displayName:(NSString *)aDisplayName;
                      
// 调用:                      
EMFileMessageBody *body = [[EMFileMessageBody alloc] initWithLocalPath:@"filePath" displayName:@"file"];
NSString *from = [[EMClient sharedClient] currentUsername];

// 生成message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:nil];
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
```

### 构造透传消息

SDK 提供的一种特殊类型的消息，即 CMD，不会存 db，也不会走 APNS 推送，类似一种指令型的消息。比如您的服务器要通知客户端做某些操作，您可以服务器和客户端提前约定好某个字段，当客户端收到约定好的字段时，执行某种特殊操作。另以“em_”和“easemob::”开头的action为内部保留字段，注意不要使用

```
/*!
 *  初始化命令消息体
 *  用户自己定义的字符串，接收到后，解析出自己定义的字符串，就知道某件事情发过来了。
 *  ex. 用户要做位置共享，这里的字符串就可以是"loc",解析出"loc"后，就知道这条消息是位置共享的消息了，之后其他信息可以放到.ext属性中去解析。
 *  ex. 用户如果需要做“阅后即焚”功能，这里就可以自己写一个字符串，如“Snap”，之后.ext里带上要删除的messageid，接收方收到后，就可以删除对应的message，到达阅后即焚的效果
 *
 *  @param aAction  命令内容
 *  
 *  @result 命令消息体实例
 */
- (instancetype)initWithAction:(NSString *)aAction;

// 调用:
EMCmdMessageBody *body = [[EMCmdMessageBody alloc] initWithAction:action];
NSString *from = [[EMClient sharedClient] currentUsername];

// 生成message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:nil];
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
```

### 构造自定义类型消息

:::tip
3.6.5及以上版本的SDK支持
:::

用户可以在以上几种消息之外，自己定义消息类型，方便用户的业务处理。 自定义消息类型支持用户自己设置一个消息的类型名称，这样用户可以添加多种自定义消息。 自定义消息的内容部分是key，value格式的，用户需要自己添加并解析该内容。

```
// event为需要传递的自定义消息事件，比如礼物消息，可以设置event = @"gift"
// params类型为NSDictionary<String, String>
EMCustomMessageBody *body = [[EMCustomMessageBody alloc] initWithEvent:event ext: params];
NSString *from = [[EMClient sharedClient] currentUsername];

//生成Message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:nil];  // ext:扩展消息部分
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
```

### 构造扩展消息

当 SDK 提供的消息类型不满足需求时，开发者可以通过扩展自 SDK 提供的文本、语音、图片、位置等消息类型，从而生成自己需要的消息类型。

:::tip
Key值类型必须是NSString, Value值类型必须是NSString或者 NSNumber类型的 BOOL, int, unsigned in, long long, double
:::

这里是扩展自文本消息，如果这个自定义的消息需要用到语音或者图片等，可以扩展自语音、图片消息，亦或是位置消息。

```
// 以单聊消息举例
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"要发送的消息"];
NSString *from = [[EMClient sharedClient] currentUsername];

//生成Message
NSDictionary *messageExt = @{@"key":@"value"};
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:messageExt];  // ext:扩展消息部分
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
```

### 插入消息

#### 方法一

直接插入，这样插入会不验证消息所在的EMConversation对象是否存在，直接将消息插入到数据库中

```
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"要插入的消息"];
NSString *from = [[EMClient sharedClient] currentUsername];

//生成Message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:messageExt];
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息

[[EMClient sharedClient].chatManager importMessages:@[message] completion:^(EMError *aError) {
    if (!aError) {
        NSLog(@"导入一组消息到DB成功");
    } else {
        NSLog(@"导入一组消息到DB失败的原因 --- %@", aError.errorDescription);
    }
}];
```

#### 方法二

这种插入方式，会验证所在的EMConversation对象的存在，插入后，会更新EMConversation对象中的属性，比如LatestMessage

```
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"要插入的消息"];
NSString *from = [[EMClient sharedClient] currentUsername];
    
//生成Message
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6001" from:from to:@"6001" body:body ext:nil];
message.chatType = EMChatTypeChat;// 设置为单聊消息
//message.chatType = EMChatTypeGroupChat;// 设置为群聊消息
//message.chatType = EMChatTypeChatRoom;// 设置为聊天室消息
//message.timestamp = 1509689222137; 消息时间
EMConversation *conversation =  [[EMClient sharedClient].chatManager getConversation:message.conversationId type:EMConversationTypeChat createIfNotExist:YES];
    // type: 会话类型
    //      EMConversationTypeChat // 单聊
    //      EMConversationTypeGroupChat // 群聊
    //      EMConversationTypeChatRoom // 聊天室
[conversation insertMessage:message error:nil];
```

### 更新消息属性

```
/*!
 *  更新消息到DB
 *
 *  @param aMessage         消息
 *  @param aCompletionBlock 完成的回调
 */
- (void)updateMessage:(EMMessage *)aMessage
           completion:(void (^)(EMMessage *aMessage, EMError *aError))aCompletionBlock;

//调用:
[[EMClient sharedClient].chatManager updateMessage:nil completion:^(EMMessage *aMessage, EMError *aError) {
    if (!aError) {
        NSLog(@"更新消息到DB成功");
    } else {
        NSLog(@"更新消息到DB失败的原因 --- %@", aError.errorDescription);
    }
}];
```

## 会话

会话涉及到的环信SDK头文件如下:

```
// 会话部分，包含会话id，会话类型等
EMConversation.h

// 会话方法调用部分，包含创建或获取会话，获取会话列表等
IEMChatManager.h
```

会话：操作聊天消息 **EMMessage** 的容器，在 SDK 中对应的类型是 **EMConversation**。

### 新建/获取一个会话

根据 conversationId 创建一个 conversation。

```
/*!
 *  获取一个会话
 *
 *  @param aConversationId  会话ID
 *  @param aType            会话类型
 *  @param aIfCreate        如果不存在是否创建
 *
 *  @result 会话对象
 */
- (EMConversation *)getConversation:(NSString *)aConversationId
                               type:(EMConversationType)aType
                   createIfNotExist:(BOOL)aIfCreate;
                   
// 调用:   

aConversationId:
单聊会话传接收消息方的环信id
群里会话传向群组内发消息的群组id
聊天室会话传向聊天室内发消息的聊天室id

aType:
//EMConversationTypeChat            单聊会话
//EMConversationTypeGroupChat       群聊会话
//EMConversationTypeChatRoom        聊天室会话
                
[[EMClient sharedClient].chatManager getConversation:@"8001" type:EMConversationTypeChat createIfNotExist:YES];
```

### 删除会话

#### 删除单个会话

```
/*!
 *  删除会话
 *
 *  @param aConversationId      会话ID
 *  @param aIsDeleteMessages    是否删除会话中的消息
 *  @param aCompletionBlock     完成的回调
 */
- (void)deleteConversation:(NSString *)aConversationId
          isDeleteMessages:(BOOL)aIsDeleteMessages
                completion:(void (^)(NSString *aConversationId, EMError *aError))aCompletionBlock;
                
// 调用:
[[EMClient sharedClient].chatManager deleteConversation:@"8001" isDeleteMessages:YES completion:^(NSString *aConversationId, EMError *aError) {
    if (!aError) {
        NSLog(@"删除会话成功");
    } else {
        NSLog(@"删除会话失败的原因 --- %@", aError.errorDescription);
    }
}];                
```

#### 根据 conversationId 批量删除会话

```
/*!
 *  删除一组会话
 *
 *  @param aConversations       会话列表<EMConversation>
 *  @param aIsDeleteMessages    是否删除会话中的消息
 *  @param aCompletionBlock     完成的回调
 */
- (void)deleteConversations:(NSArray *)aConversations
           isDeleteMessages:(BOOL)aIsDeleteMessages
                 completion:(void (^)(EMError *aError))aCompletionBlock;
                 
                 
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:@"8001" type:EMConversationTypeChat createIfNotExist:NO];
// 调用:
[[EMClient sharedClient].chatManager deleteConversations:@[conversation] isDeleteMessages:YES completion:^(EMError *aError) {
    if (!aError) {
        NSLog(@"删除一组会话成功");
    } else {
        NSLog(@"删除一组会话失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 获取本地会话列表

```
/*!
 *  获取所有会话，如果内存中不存在会从DB中加载
 *
 *  @result 会话列表<EMConversation>
 */
- (NSArray *)getAllConversations;

// 调用:
NSArray *conversations = [[EMClient sharedClient].chatManager getAllConversations];
```

### 从服务器获取会话列表


该功能开通后，用户默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息），如需调整会话数量请联系环信商务经理。


建议此api在首次安装应用时或者本地没有会话的时候调用，其他时候使用本地的会话api即可。默认最多返回100条数据。
```
[[EMClient sharedClient].chatManager getConversationsFromServer:^(NSArray *aCoversations, EMError *aError) {
     if (!aError && [aCoversations count] > 0) {
         //获取到会话列表后进行数据源装配和页面刷新
     }
}];
```

### 获取会话中的所有消息计数

```
// 获取会话中的消息数,以单聊为例，群组、聊天室一样                   
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:@"8001" type:EMConversationTypeChat createIfNotExist:YES];
[conversation messagesCount];
```

### 获取单个会话未读消息数

```
/*!
 *  \~chinese
 *  获取一个会话
 *
 *  @param aConversationId  会话ID
 *  @param aType            会话类型
 *  @param aIfCreate        如果不存在是否创建
 *
 *  @result 会话对象
 */
- (EMConversation *)getConversation:(NSString *)aConversationId
                               type:(EMConversationType)aType
                   createIfNotExist:(BOOL)aIfCreate;
                   
// 获取单聊会话的未读消息数                   
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:@"8001" type:EMConversationTypeChat createIfNotExist:YES];
[conversation unreadMessagesCount];

// 获取群聊会话的未读消息数                   
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:@"121828583195137" type:EMConversationTypeGroupChat createIfNotExist:YES];
[conversation unreadMessagesCount];
```

### 获取所有会话未读消息数

SDK目前没提供直接获取全部会话未读消息数的方法，只能先获取会话列表，然后遍历取出每个会话的未读消息数进行累加，计算出所有会话的未读消息数。

```
NSArray *conversations = [[EMClient sharedClient].chatManager getAllConversations];
NSInteger unreadCount = 0;
for (EMConversation *conversation in conversations) {
    unreadCount += conversation.unreadMessagesCount;
}
```

### 消息检索

可以通过关键字、消息类型、开始结束时间检索某个会话中的消息。使用EMConversation会话对象调用。

```
/*!
 *  从数据库获取指定数量的消息，取到的消息按时间排序，并且不包含参考的消息，如果参考消息的ID为空，则从最新消息取
 *
 *  @param aMessageId       参考消息的ID
 *  @param count            获取的条数
 *  @param aDirection       消息搜索方向
 *  @param aCompletionBlock 完成的回调
 */
- (void)loadMessagesStartFromId:(NSString *)aMessageId
                          count:(int)aCount
                searchDirection:(EMMessageSearchDirection)aDirection
                     completion:(void (^)(NSArray *aMessages, EMError *aError))aCompletionBlock;
                     
// 调用:
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:@"8001" type:EMConversationTypeChat createIfNotExist:YES];
[conversation loadMessagesStartFromId:messageId count:10 searchDirection:EMMessageSearchDirectionUp completion:^(NSArray *aMessages, EMError *aError) {
    if (!aError) {
        // aMessage数组中存的是EMMessage
        NSLog(@"从数据库获取消息成功 --- %@", aMessages);
    } else {
        NSLog(@"删除一组会话失败的原因 --- %@", aError.errorDescription);
    }
}];

/*!
 *  从数据库获取指定类型的消息，取到的消息按时间排序，如果参考的时间戳为负数，则从最新消息取，如果aCount小于等于0当作1处理
 *
 *  @param aType            消息类型
 *  @param aTimestamp       参考时间戳
 *  @param aCount           获取的条数
 *  @param aUsername        消息发送方，如果为空则忽略
 *  @param aDirection       消息搜索方向
 *  @param aCompletionBlock 完成的回调
 */
- (void)loadMessagesWithType:(EMMessageBodyType)aType
                   timestamp:(long long)aTimestamp
                       count:(int)aCount
                    fromUser:(NSString*)aUsername
             searchDirection:(EMMessageSearchDirection)aDirection
                  completion:(void (^)(NSArray *aMessages, EMError *aError))aCompletionBlock;

/*!
 *  从数据库获取包含指定内容的消息，取到的消息按时间排序，如果参考的时间戳为负数，则从最新消息向前取，如果aCount小于等于0当作1处理
 *
 *  @param aKeywords        搜索关键字，如果为空则忽略
 *  @param aTimestamp       参考时间戳
 *  @param aCount           获取的条数
 *  @param aSender          消息发送方，如果为空则忽略
 *  @param aDirection       消息搜索方向
 *  @param aCompletionBlock 完成的回调
 */
- (void)loadMessagesWithKeyword:(NSString*)aKeyword
                      timestamp:(long long)aTimestamp
                          count:(int)aCount
                       fromUser:(NSString*)aSender
                searchDirection:(EMMessageSearchDirection)aDirection
                     completion:(void (^)(NSArray *aMessages, EMError *aError))aCompletionBlock;

/*!
 *  从数据库获取指定时间段内的消息，取到的消息按时间排序，为了防止占用太多内存，用户应当制定加载消息的最大数
 *
 *  @param aStartTimestamp  毫秒级开始时间
 *  @param aEndTimestamp    结束时间
 *  @param aCount           加载消息最大数
 *  @param aCompletionBlock 完成的回调
 */
- (void)loadMessagesFrom:(long long)aStartTimestamp
                      to:(long long)aEndTimestamp
                   count:(int)aCount
              completion:(void (^)(NSArray *aMessages, EMError *aError))aCompletionBlock;
```

### 全局消息索引

可以通过消息类型、关键字检索所有会话中的消息。使用 [EMClient sharedClient].chatManager 单例调用。

```
/*!
 *  从数据库获取指定类型的消息，取到的消息按时间排序，如果参考的时间戳为负数，则从最新消息取，如果aCount小于等于0当作1处理
 *
 *  @param aType            消息类型
 *  @param aTimestamp       参考时间戳
 *  @param aCount           获取的条数
 *  @param aUsername        消息发送方，如果为空则忽略
 *  @param aDirection       消息搜索方向
 *  @param aCompletionBlock 完成的回调
 */
- (void)loadMessagesWithType:(EMMessageBodyType)aType
                   timestamp:(long long)aTimestamp
                       count:(int)aCount
                    fromUser:(NSString*)aUsername
             searchDirection:(EMMessageSearchDirection)aDirection
                  completion:(void (^)(NSArray *aMessages, EMError *aError))aCompletionBlock;
// 调用:
[[EMClient sharedClient].chatManager loadMessagesWithKeyword:@"您好" timestamp:1575997248290 count:10 fromUser:nil searchDirection:EMMessageSearchDirectionUp completion:^(NSArray *aMessages, EMError *aError) {
    if (!aError) {
        // aMessage数组中存的是EMMessage
        NSLog(@"从数据库获取指定类型的消息成功 --- %@", aMessages);
    } else {
        NSLog(@"从数据库获取指定类型的消息失败的原因 --- %@", aError.errorDescription);
    }
}];
                  
/*!
 *  从数据库获取包含指定内容的消息，取到的消息按时间排序，如果参考的时间戳为负数，则从最新消息向前取，如果aCount小于等于0当作1处理
 *
 *  @param aKeywords        搜索关键字，如果为空则忽略
 *  @param aTimestamp       参考时间戳
 *  @param aCount           获取的条数
 *  @param aSender          消息发送方，如果为空则忽略
 *  @param aDirection       消息搜索方向
 *  @param aCompletionBlock 完成的回调     
 */
- (void)loadMessagesWithKeyword:(NSString*)aKeywords
                      timestamp:(long long)aTimestamp
                          count:(int)aCount
                       fromUser:(NSString*)aSender
                searchDirection:(EMMessageSearchDirection)aDirection
                     completion:(void (^)(NSArray *aMessages, EMError *aError))aCompletionBlock;
// 调用:
[[EMClient sharedClient].chatManager loadMessagesWithType:EMMessageBodyTypeText timestamp:1575997248290 count:10 fromUser:nil searchDirection:EMMessageSearchDirectionUp completion:^(NSArray *aMessages, EMError *aError) {
    if (!aError) {
        // aMessage数组中存的是EMMessage
        NSLog(@"从数据库获取指定内容的消息成功 --- %@", aMessages);
    } else {
        NSLog(@"从数据库获取指定内容的消息失败的原因 --- %@", aError.errorDescription);
    }
}];
                                  
```

## 聊天

登录成功之后才能进行聊天操作。发消息时，单聊和群聊调用的是统一接口，区别只是要设置下 message.chatType。

### 发送消息

```
/*!
 *  发送消息
 *
 *  @param aMessage         消息
 *  @param aProgressBlock   附件上传进度回调block
 *  @param aCompletionBlock 发送完成回调block
 */
- (void)sendMessage:(EMMessage *)aMessage
           progress:(void (^)(int progress))aProgressBlock
         completion:(void (^)(EMMessage *message, EMError *error))aCompletionBlock;

//调用示例:
[[EMClient sharedClient].chatManager sendMessage:message progress:^(int progress) {
    NSLog(@"附件上传的进度 --- %d", progress);
} completion:^(EMMessage *message, EMError *error) {
    if (!error) {
        NSLog(@"发送消息成功");
    } else {
        NSLog(@"发送消息失败的原因 --- %@", error.errorDescription);
    }
}];
```

### 接收消息

```
协议:EMChatManagerDelegate

代理:
// 注册消息代理
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 移除消息代理
[[EMClient sharedClient].chatManager removeDelegate:self];
```

接收普通消息会走以下回调：

如果集成时使用的是环信demo中的聊天页面，聊天页面内已经注册了消息代理，监听了接收普通消息的回调方法，无需额外添加。

如果集成时是自己写的聊天页面，需要在聊天页面内自己注册消息代理，监听接收普通消息的回调方法。

另外建议在自己工程的根控制器中注册消息代理，监听接收普通消息的回调方法，用于不在聊天页面时接收消息的铃声或者本地通知提示等。

```
/*!
 @method
 @brief 接收到一条及以上非cmd消息
 */
- (void)messagesDidReceive:(NSArray *)aMessages;
```

接收透传(cmd)消息会走以下回调:

```
/*!
 @method
 @brief 接收到一条及以上cmd消息
 */
- (void)cmdMessagesDidReceive:(NSArray *)aCmdMessages;
```

### 解析普通消息(含自定义类型消息)

```
// 收到消息的回调，带有附件类型的消息可以用 SDK 提供的下载附件方法下载（后面会讲到）
- (void)messagesDidReceive:(NSArray *)aMessages {
    for (EMMessage *message in aMessages) {
    EMMessageBody *msgBody = message.body;
    switch (msgBody.type) {
        case EMMessageBodyTypeText:
        {
            // 收到的文字消息
            EMTextMessageBody *textBody = (EMTextMessageBody *)msgBody;
            NSString *txt = textBody.text;
            NSLog(@"收到的文字是 txt -- %@",txt);
        }
        break;
        case EMMessageBodyTypeImage:
        {
            // 得到一个图片消息body
            EMImageMessageBody *body = ((EMImageMessageBody *)msgBody);
            NSLog(@"大图remote路径 -- %@"   ,body.remotePath);
            NSLog(@"大图local路径 -- %@"    ,body.localPath); // // 需要使用sdk提供的下载方法后才会存在
            NSLog(@"大图的secret -- %@"    ,body.secretKey);
            NSLog(@"大图的W -- %f ,大图的H -- %f",body.size.width,body.size.height);
            NSLog(@"大图的下载状态 -- %lu",body.downloadStatus);


            // 缩略图sdk会自动下载
            NSLog(@"小图remote路径 -- %@"   ,body.thumbnailRemotePath);
            NSLog(@"小图local路径 -- %@"    ,body.thumbnailLocalPath);
            NSLog(@"小图的secret -- %@"    ,body.thumbnailSecretKey);
            NSLog(@"小图的W -- %f ,大图的H -- %f",body.thumbnailSize.width,body.thumbnailSize.height);
            NSLog(@"小图的下载状态 -- %lu",body.thumbnailDownloadStatus);
        }
        break;
        case EMMessageBodyTypeLocation:
        {
            EMLocationMessageBody *body = (EMLocationMessageBody *)msgBody;
            NSLog(@"纬度-- %f",body.latitude);
            NSLog(@"经度-- %f",body.longitude);
            NSLog(@"地址-- %@",body.address);
            }
            break;
        case EMMessageBodyTypeVoice:
        {
            // 音频sdk会自动下载
            EMVoiceMessageBody *body = (EMVoiceMessageBody *)msgBody;
            NSLog(@"音频remote路径 -- %@"      ,body.remotePath);
            NSLog(@"音频local路径 -- %@"       ,body.localPath); // 需要使用sdk提供的下载方法后才会存在（音频会自动调用）
            NSLog(@"音频的secret -- %@"        ,body.secretKey);
            NSLog(@"音频文件大小 -- %lld"       ,body.fileLength);
            NSLog(@"音频文件的下载状态 -- %lu"   ,body.downloadStatus);
            NSLog(@"音频的时间长度 -- %lu"      ,body.duration);
        }
        break;
        case EMMessageBodyTypeVideo:
        {
            EMVideoMessageBody *body = (EMVideoMessageBody *)msgBody;

            NSLog(@"视频remote路径 -- %@"      ,body.remotePath);
            NSLog(@"视频local路径 -- %@"       ,body.localPath); // 需要使用sdk提供的下载方法后才会存在
            NSLog(@"视频的secret -- %@"        ,body.secretKey);
            NSLog(@"视频文件大小 -- %lld"       ,body.fileLength);
            NSLog(@"视频文件的下载状态 -- %lu"   ,body.downloadStatus);
            NSLog(@"视频的时间长度 -- %lu"      ,body.duration);
            NSLog(@"视频的W -- %f ,视频的H -- %f", body.thumbnailSize.width, body.thumbnailSize.height);

            // 缩略图sdk会自动下载
            NSLog(@"缩略图的remote路径 -- %@"     ,body.thumbnailRemotePath);
            NSLog(@"缩略图的local路径 -- %@"      ,body.thumbnailLocalPath);
            NSLog(@"缩略图的secret -- %@"        ,body.thumbnailSecretKey);
            NSLog(@"缩略图的下载状态 -- %lu"      ,body.thumbnailDownloadStatus);
        }
        break;
        case EMMessageBodyTypeFile:
        {
            EMFileMessageBody *body = (EMFileMessageBody *)msgBody;
            NSLog(@"文件remote路径 -- %@"      ,body.remotePath);
            NSLog(@"文件local路径 -- %@"       ,body.localPath); // 需要使用sdk提供的下载方法后才会存在
            NSLog(@"文件的secret -- %@"        ,body.secretKey);
            NSLog(@"文件文件大小 -- %lld"       ,body.fileLength);
            NSLog(@"文件文件的下载状态 -- %lu"   ,body.downloadStatus);
        }
        break;
        case EMMessageBodyTypeCustom:
        {
            // 收到的自定义类型消息
            EMCustomMessageBody *body = (EMCustomMessageBody *)msgBody;
            NSLog(@"event -- %@", body.event);
            NSLog(@"ext -- %@", body.ext);
        }
        break;

        default:
        break;
    }
    }
}
```

### 解析透传消息

```
- (void)cmdMessagesDidReceive:(NSArray *)aCmdMessages {
    for (EMMessage *message in aCmdMessages) {
        EMCmdMessageBody *body = (EMCmdMessageBody *)message.body;
         NSLog(@"收到的action是 -- %@",body.action);
    }    
}
```

### 解析消息扩展属性

```
- (void)cmdMessagesDidReceive:(NSArray *)aCmdMessages {
    for (EMMessage *message in aCmdMessages) {
        // cmd消息中的扩展属性
        NSDictionary *ext = message.ext;
        NSLog(@"cmd消息中的扩展属性是 -- %@",ext)
    }    
}
// 收到消息回调
- (void)messagesDidReceive:(NSArray *)aMessages {
    for (EMMessage *message in aMessages) {
        // 消息中的扩展属性
        NSDictionary *ext = message.ext;
        NSLog(@"消息中的扩展属性是 -- %@",ext);
    }
}
```

### 自动下载消息中的附件

SDK 接收到消息后，会默认下载：图片消息的缩略图，语音消息的语音，视频消息的视频第一帧。

**请先判断你要下载附件没有下载成功之后，在调用以下下载方法，否则SDK下载方法会再次从服务器上获取附件。**

```
/*!
 *  下载缩略图（图片消息的缩略图或视频消息的第一帧图片），SDK会自动下载缩略图，所以除非自动下载失败，用户不需要自己下载缩略图
 *
 *  @param aMessage            消息
 *  @param aProgressBlock      附件下载进度回调block
 *  @param aCompletionBlock    下载完成回调block
 */
- (void)downloadMessageThumbnail:(EMMessage *)aMessage
                        progress:(void (^)(int progress))aProgressBlock
                      completion:(void (^)(EMMessage *message, EMError *error))aCompletionBlock;
                      
// 调用:                      
[[EMClient sharedClient].chatManager downloadMessageThumbnail:message progress:nil completion:^(EMMessage *message, EMError *error) {
    if (!error) {
        NSLog(@"下载缩略图成功");
    } else {
        NSLog(@"下载缩略图失败的原因 --- %@",error.errorDescription);
    }
}];
```

### 下载消息中的原始附件

```
/*!
 *  下载消息附件（语音，视频，图片原图，文件），SDK会自动下载语音消息，所以除非自动下载语音失败，用户不需要自动下载语音附件
 *
 *  异步方法
 *
 *  @param aMessage            消息
 *  @param aProgressBlock      附件下载进度回调block
 *  @param aCompletionBlock    下载完成回调block
 */
[[EMClient sharedClient].chatManager downloadMessageAttachment:message progress:nil completion:^(EMMessage *message, EMError *error) {
        if (!error) {
        NSLog(@"下载消息附件成功");
    } else {
        NSLog(@"下载消息附件失败的原因 --- %@",error.errorDescription);
    }
}];
```

### 发送会话已读消息

- 功能描述：给服务器发送一条“会话已读”消息，表示当前会话的消息已读。
- 使用场景：

若当前会话有未读消息，则发送会话“已读”消息给服务器，服务器回调给多设备id或者会话方。

- API使用示例:

```
if (self.conversation.unreadMessagesCount > 0) {
          [[EMClient sharedClient].chatManager ackConversationRead:self.conversation.conversationId completion:nil];
        }
        
```

### 接收会话已读回调

- 功能描述：表示此会话的未读消息在其他登陆的多设备上“已读“，或会话方”已读“接收的未读消息。
- 使用场景：

当有我方多设备或会话方“发送会话已读消息”，则会收到会话已读回调，收到会话已读回调后可重新刷新未读数，消息已读相关UI。

- API示例：

```
- (void)onConversationRead:(NSString *)from to:(NSString *)to;
     
```

### 消息已送达回执

SDK提供了已送达回执，当对方收到您的消息后，您会收到以下回调。

```
/*!
 @method
 @brief 接收到一条及以上已送达回执
 */
- (void)messagesDidDeliver:(NSArray *)aMessages;
```

### 消息已读回执

已读回执需要开发者主动调用的。当用户读取消息后，由开发者主动调用方法。 消息已读回执功能目前仅适用于单聊（ChatType.Chat），推荐使用方案为会话已读回执(conversation ack)+单条消息已读回执(read ack)结合实现，可减少发送read ack消息量。


#### 发送已读回执

推荐进入会话首先发送会话已读回执（conversation ack）

```
[[EMClient sharedClient].chatManager ackConversationRead:@"会话id" completion:nil];
```

在会话页面，可以在接收到消息时，根据消息类型发送消息已读回执（read ack）

```
/*!
 *  发送消息已读回执
 *
 *  异步方法
 *
 *  @param aMessage             消息id
 *  @param aUsername            已读接收方
 *  @param aCompletionBlock     完成的回调
 */
- (void)sendMessageReadAck:(NSString *)aMessageId
                    toUser:(NSString *)aUsername
                completion:(void (^)(EMError *aError))aCompletionBlock;
                
// 调用:                
// 发送已读回执。在这里写只是为了演示发送，在APP中具体在哪里发送需要开发者自己决定。
[[EMClient sharedClient].chatManager sendMessageReadAck:@"messageId" toUser:@"username" completion:^(EMError *aError) {
    if (!aError) {
         NSLog(@"发送已读回执成功");
    } else {
        NSLog(@"发送已读回执失败的原因 --- %@", aError.errorDescription);
    }
}];
```

#### 接收已读回执

接收会话已读回执

```
/**
 * \~chinese
 * 收到会话已读回调
 *
 * @param from  CHANNEL_ACK 发送方
 * @param to      CHANNEL_ACK 接收方
 *
 * \~english
 * received conversation read ack
 * @param from  the username who send channel_ack
 * @param to      the username who receive channel_ack
 */
- (void)onConversationRead:(NSString *)from to:(NSString *)to;
```

接收到会话已读回执（channel ack）回调后，SDK会将会话相关消息置为对方已读，在接收到此回调后，需进行页面刷新等操作

接收消息已读回执

```
/*!
 *  接收到一条及以上已读回执
 *
 *  @param aMessages  消息列表<EMMessage>
 */
- (void)messagesDidRead:(NSArray *)aMessages;
```

### 设置群消息是否需要已读回执

当消息为群消息时，消息发送方(目前为管理员和群主)可以设置此消息是否需要已读回执，如需要，则设置EMMessage属性isNeedGroupAck为YES，之后发送。

```
@property (nonatomic) BOOL isNeedGroupAck;
```

### 发送群消息已读回执

```
/*!
 *  \~chinese
 *  发送群消息已读回执
 *
 *  异步方法
 *
 *  @param aMessageId           消息id
 *  @param aGroupId             群id
 *  @param aContent             附加消息
 *  @param aCompletionBlock     完成的回调
 *
 *  \~english
 *  Send read acknowledgement for message
 *
 *  @param aMessageId           Message id
 *  @param aGroupId             group receiver
 *  @param aContent             Content
 *  @param aCompletionBlock     The callback of completion block
 *
 */
- (void)sendGroupMessageReadAck:(NSString *)aMessageId
                        toGroup:(NSString *)aGroupId
                        content:(NSString *)aContent
                     completion:(void (^)(EMError *aError))aCompletionBlock;
                     
    // 调用
    // 发送群消息已读回执。在这里写只是为了演示发送，在APP中具体在哪里发送需要开发者自己决定。
    [[EMClient sharedClient].chatManager sendGroupMessageReadAck:@"messageId"
                                                         toGroup:@"GroupId"
                                                         content:@"回执内容"
                                                      completion:^(EMError *aError)
    {
        if (!aError) {
            NSLog(@"发送已读回执成功");
        } else {
            NSLog(@"发送已读回执失败的原因 --- %@", aError.errorDescription);
        }
    }];
```

当发送群已读回执后，消息发送方对应EMMessage的groupAckCount属性会有相应变化；

```
@property (nonatomic, readonly) int groupAckCount;
```

### 群消息已读回调

```
/*!
 *  \~chinese
 *  收到群消息已读回执
 *
 *  @param aMessages  已读消息列表<EMGroupMessageAck>
 *
 *  \~english
 *  Invoked when receiving read acknowledgement in message list
 *
 *  @param aMessages  Acknowledged message list<EMGroupMessageAck>
 */
- (void)groupMessageDidRead:(EMMessage *)aMessage
                  groupAcks:(NSArray *)aGroupAcks;
```

### 获取群已读详情

```
/**
 *  \~chinese
 *  从服务器获取指定群已读回执
 *
 *  异步方法
 *
 *  @param  aMessageId           要获取的消息id
 *  @param  aGroupId             要获取回执对应的群id
 *  @param  aGroupAckId          要回去的群回执id
 *  @param  aPageSize            获取消息条数
 *  @param  aCompletionBlock     获取消息结束的callback
 */
- (void)asyncFetchGroupMessageAcksFromServer:(NSString *)aMessageId
                                     groupId:(NSString *)aGroupId
                             startGroupAckId:(NSString *)aGroupAckId
                                    pageSize:(int)aPageSize
                                  completion:(void (^)(EMCursorResult *aResult, EMError *error, int totalCount))aCompletionBlock;
```

### 消息漫游

SDK提供了从服务器获取历史消息的接口

```
/**
 *  从服务器获取指定会话的历史消息
 *
 *  异步方法
 *
 *  @param  aConversationId     要获取漫游消息的Conversation id
 *  @param  aConversationType   要获取漫游消息的Conversation type
 *  @param  aStartMessageId     参考起始消息的ID
 *  @param  aPageSize           获取消息条数（一次最多50条）
 *  @param  aCompletionBlock    获取消息结束的callback
 */
- (void)asyncFetchHistoryMessagesFromServer:(NSString *)aConversationId
                           conversationType:(EMConversationType)aConversationType
                             startMessageId:(NSString *)aStartMessageId
                                   pageSize:(int)aPageSize
                                 complation:(void (^)(EMCursorResult *aResult, EMError *aError))aCompletionBlock;
                                 
// 调用:
[[EMClient sharedClient].chatManager asyncFetchHistoryMessagesFromServer:@"6001" conversationType:EMConversationTypeChat startMessageId:messageId pageSize:10 completion:^(EMCursorResult *aResult, EMError *aError) {
    if (!aError) {
        NSLog(@"从服务器获取消息成功");
    } else {
        NSLog(@"从服务器获取消息失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 消息撤回

```
/*!
*  撤回消息
*
*  异步方法
*
*  @param aMessageId           消息Id
*  @param aCompletionBlock     完成的回调
*/
- (void)recallMessageWithMessageId:(NSString *)aMessageId
                        completion:(void (^)(EMError *aError))aCompletionBlock;
           
// 调用示例:
[[EMClient sharedClient].chatManager recallMessageWithMessageId:messageId completion:^(EMError *aError) {
    if (!aError) {
        NSLog(@"撤回消息成功");
    } else {
        NSLog(@"撤回消息失败的原因 --- %@", aError.errorDescription);
    }
}];
```

消息撤回回执

```
/*!
 *  收到消息撤回
 *
 *  @param aMessages  撤回消息列表<EMMessage>
 */
- (void)messagesDidRecall:(NSArray *)aMessages;
```



### 删除消息

SDK提供删除指定时间之前的所有本地消息的接口。调用过程如下

```
/*!
 *  \~chinese
 *  删除某个时间点之前的消息
 *
 *  异步方法
 *
 *  @param aTimestamp             要删除时间点，单位毫秒
 *  @param aCompletion           完成回调
 *
 *  \~english
 *  Delete messages which before a special timestamp
 *
 *
 *  @param aTimestamp             The timestamp to delete
 *  @param aCompletion           The callback block of completion
 *
 */
- (void)deleteMessagesBefore:(NSUInteger)aTimestamp
                  completion:(void(^)(EMError*error))aCompletion;
```

调用过程如下：

```
// 例如删除消息msg之前的所有消息
[[EMClient sharedClient].chatManager deleteMessagesBefore:msg.timestamp completion:nil];
```

