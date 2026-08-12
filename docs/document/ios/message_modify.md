# 编辑消息

## 功能说明

环信即时通讯 IM 提供消息编辑功能。用户可以修改已发送成功的消息，服务端和本地存储的消息将同步更新，无需重新发送一条消息。

### 支持范围

该功能适用于单聊、群聊和聊天室，支持范围如下：

- 文本消息和自定义消息：支持修改消息体 `body` 和扩展字段 `ext`。
- 文件、视频、音频、图片、位置及合并转发消息：仅支持修改扩展字段 `ext`，不支持修改消息体。
- 透传消息：不支持编辑。

### 消息编辑流程

1. 应用调用消息编辑 API，传入待编辑的消息及修改后的内容。    
2. SDK 将编辑请求发送至服务端；服务端完成消息更新后，将编辑后的消息返回给 SDK。  
3. SDK 更新本地数据库中的对应消息，并通过 completion 回调将编辑后的消息返回给应用。  
4. 消息所属会话的其他成员收到消息编辑事件后，可通过聊天管理器代理获取编辑后的消息并更新界面。

### 各类会话的消息编辑权限

- 对于单聊会话，只有消息发送方才能对消息进行编辑。
- 对于群组/聊天室会话，普通成员只能编辑自己发送的消息。群主/聊天室所有者和管理员除了可以编辑自己发送的消息，还可以编辑普通成员发送的消息。这种情况下，消息的发送方不变，消息体中的编辑者用户 ID 为群主、聊天室所有者或管理员的用户 ID。

### 消息编辑后的生命周期

编辑消息没有时间限制，即只要这条消息仍在服务端存储就可以编辑。消息编辑后，消息生命周期（在服务端的保存时间）会重新计算，例如，消息可在服务器上保存 180 天，用户在消息发送后的第 30 天（服务器上的保存时间剩余 150 天）编辑了消息，编辑成功后该消息还可以在服务器上保存 180 天。

## 功能开通

若使用该功能，需联系环信商务开通。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [初始化](initialization.html)文档。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- 联系环信商务开通消息编辑功能。

## 编辑消息

你可以调用 `modifyMessage` 编辑已经发送成功的消息。该方法会同时更新服务端和本地消息，消息 ID 不会变化。编辑后的消息体除内容变化外，还包含最后一次编辑者的用户 ID、编辑时间和编辑次数。除消息体和消息扩展字段 `ext` 外，消息 ID、发送方和接收方等其他信息不会变化。

`body` 和 `ext` 不能同时为 `nil`。传入非 `nil` 的 `ext` 时，新扩展字段会覆盖原消息的全部扩展字段；如需保留原有扩展字段，应先将其合并到新的 `NSDictionary` 再传入。

iOS SDK 中 `ext` 为 `NSDictionary *` 类型，Key 应为 `NSString *`，Value 支持 `NSString *` 或 `NSNumber *`，后者可用于布尔值、整数和浮点数等数值类型。

:::tip 
一条消息默认最多可编辑 10 次。
:::

```objectivec
    // 文本消息：可同时编辑消息体和消息扩展属性
    EMTextMessageBody* newMessageBody = [[EMTextMessageBody alloc] initWithText:@"new  content"];
    NSDictionary* newExt = @{@"newKey": @"newValue"};
    // textBody 和 ext 不能同时为 nil
    [EMClient.sharedClient.chatManager modifyMessage:@"messageId" body:newMessageBody ext:newExt completion:^(EMError * _Nullable error, EMChatMessage * _Nullable message) {
            
    }];
    
    // 自定义消息：可同时编辑消息体和消息扩展属性
    EMCustomMessageBody* newCustomMessageBody = [[EMCustomMessageBody alloc] initWithEvent:@"event" customExt:@{@"key": @"value"}];
    NSDictionary* newExt1 = @{@"newKey": @"newValue"};
    // customBody 和 ext 不能同时为 nil
    [EMClient.sharedClient.chatManager modifyMessage:@"messageId" body:newCustomMessageBody ext:newExt1 completion:^(EMError * _Nullable error, EMChatMessage * _Nullable message) {
            
    }];
    
    // 文件/视频/音频/图片/位置/合并转发消息：只能编辑消息扩展属性
    NSDictionary* newExt2 = @{@"newKey": @"newValue"};
    // ext 不能为 nil，body 必须为 nil
    [EMClient.sharedClient.chatManager modifyMessage:@"messageId" body:nil ext:newExt2 completion:^(EMError * _Nullable error, EMChatMessage * _Nullable message) {
            
    }];
```

消息编辑后，消息接收方以及当前账号的其他在线设备会收到 `onMessageContentChanged` 回调。该回调携带编辑后的消息、最后一次编辑消息的用户 ID 以及最新编辑时间。对于群组和聊天室会话，除执行编辑操作的用户外，群组或聊天室内的其他成员均会收到该回调。

:::tip 
若 [通过 RESTful API 编辑自定义消息](/document/server-side/message_modify.html)，消息接收方也会通过 `onMessageContentChanged` 回调接收编辑后的自定义消息。 
:::

```objectivec
// 添加监听
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 实现回调
- (void)onMessageContentChanged:(EMChatMessage *)message operatorId:(NSString *)operatorId operationTime:(NSUInteger)operationTime {
    // 新的消息体
    EMMessageBody* newBody = message.body;
    // 新的 ext
    NSDictionary* newExt = message.ext;
    // 编辑次数
    NSInteger operatorCount = message.body.operatorCount;
}
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`modifyMessage`](#编辑消息) | `IEMChatManager` | 编辑服务端和本地消息。 |



