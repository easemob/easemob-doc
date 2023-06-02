# 在多个设备上登录

<Toc />

环信即时通讯 IM 支持同一账号在多个设备上登录，所有已登录的设备同步以下信息和操作：

- 在线消息、离线消息、推送通知（若开启了第三方推送服务，离线设备收到）以及对应的回执和已读状态；
- 好友和群组相关操作。

即时通讯 IM 默认最多支持 4 个设备同时在线，详见[环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。

## 技术原理  

iOS SDK 初始化时会生成登录 ID 用于在多设备登录和消息推送时识别设备，并将该 ID 发送到服务器。服务器会自动将新消息发送到用户登录的设备，可以自动监听到其他设备上进行的好友或群组操作。即时通讯 IM iOS SDK 提供以下功能实现多个设备之间的同步：

- 获取其他登录设备的设备 ID；
- 获取其他设备上的好友或者群组操作。

## 前提条件

开始前，需确保完成 SDK 初始化，并连接到服务器。详见[快速开始](quickstart.html)。

## 实现方法

### 获取其他已登录设备的登录 ID 列表并向这些设备发送消息

你可以调用 `getSelfIdsOnOtherPlatformWithCompletion:` 方法获取其他登录设备的登录 ID 列表。选择目标登录 ID 作为消息接收方发出消息，则这些设备上的同一登录账号可以收到消息，实现不同设备之间的消息同步。

```objectivec
[EMClient.sharedClient.contactManager getSelfIdsOnOtherPlatformWithCompletion:^(NSArray<NSString *> * _Nullable aList, EMError * _Nullable aError) {
    // 选择一个登录 ID 作为消息发送方。
    NSString *to = aList.firstObject;
    if (to.length > 0) {
        EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"Hello World"];
        // 创建一条文本消息，content 为消息文字内容，to 传入登录 ID 作为消息发送方。
        EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:to body:body ext:nil];
        // 发送消息。
        [EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:^(EMChatMessage * _Nullable message, EMError * _Nullable error) {
        }];
    }
}];
```

### 强制账号从单个设备下线

```objectivec
// username：账户名称，password：账户密码。
NSString *username = @"";
NSString *password = @"";
[EMClient.sharedClient getLoggedInDevicesFromServerWithUsername:username password:password completion:^(NSArray<EMDeviceConfig *> * _Nullable aList, EMError * _Nullable aError) {
    NSString *resource = aList.firstObject.resource;
    if (resource.length > 0) {
        // username：账户名称，password：账户密码, resource：设备 ID。
        [EMClient.sharedClient kickDeviceWithUsername:username password:password resource:resource completion:^(EMError * _Nullable aError) {
        }];
    }
}];
```

### 获取其他设备的好友或者群组操作

例如，账号 A 同时在设备 A 和 B 上登录，账号 A 在设备 A 上进行操作，设备 B 会收到这些操作对应的通知。

你需要先实现 `EMMultiDevicesDelegate` 类监听其他设备上的操作，然后调用 `addMultiDevicesDelegate:delegateQueue:` 方法添加多设备监听。

```objectivec
 //实现 `EMMultiDevicesDelegate` 监听其他设备上的操作。
@interface ViewController () <EMMultiDevicesDelegate>

@end

@implementation ViewController

- (void)viewDidLoad 
{
    [super viewDidLoad];
    [EMClient.sharedClient addMultiDevicesDelegate:self delegateQueue:nil];
}

- (void)dealloc 
{
    [EMClient.sharedClient removeMultiDevicesDelegate:self];
}

#pragma mark - EMMultiDevicesDelegate
- (void)multiDevicesContactEventDidReceive:(EMMultiDevicesEvent)aEvent
                                  username:(NSString *)aUsername
                                       ext:(NSString *)aExt 
{
    switch (aEvent) {
        //好友已经在其他设备上被移除。
        case EMMultiDevicesEventContactRemove:
            break;
        //好友请求已经在其他设备上被同意。
        case EMMultiDevicesEventContactAccept:
            break;
        //好友请求已经在其他设备上被拒绝。
        case EMMultiDevicesEventContactDecline:
            break;
        //当前用户在其他设备加某人进入黑名单。
        case EMMultiDevicesEventContactBan:
            break;
        //好友在其他设备被移出黑名单。
        case EMMultiDevicesEventContactAllow:
            break;
        default:
            break;
   }
}

- (void)multiDevicesGroupEventDidReceive:(EMMultiDevicesEvent)aEvent
                                 groupId:(NSString *)aGroupId
                                     ext:(id)aExt {
    switch (aEvent) {
        //当前⽤户在其他设备创建了群组。
        case EMMultiDevicesEventGroupCreate:
            break;
        //当前⽤户在其他设备销毁了群组。
        case EMMultiDevicesEventGroupDestroy:
            break;
        //当前⽤户在其他设备已经加⼊群组。
        case EMMultiDevicesEventGroupJoin:
            break;
        //当前⽤户在其他设备已经离开群组。
        case EMMultiDevicesEventGroupLeave:
            break;
        //当前⽤户在其他设备发起了群组申请。
        case EMMultiDevicesEventGroupApply:
            break;
        //当前⽤户在其他设备同意了群组申请。
        case EMMultiDevicesEventGroupApplyAccept:
            break;
        //当前⽤户在其他设备拒绝了群组申请。
        case EMMultiDevicesEventGroupApplyDecline:
            break;
        //当前⽤户在其他设备邀请了群成员。
        case EMMultiDevicesEventGroupInvite:
            break;
        //当前⽤户在其他设备同意了群组邀请。
        case EMMultiDevicesEventGroupInviteAccept:
            break;
        //当前⽤户在其他设备拒绝了群组邀请。
        case EMMultiDevicesEventGroupInviteDecline:
            break;
        //当前⽤户在其他设备将某⼈踢出群。
        case EMMultiDevicesEventGroupKick:
            break;
        //当前⽤户在其他设备将成员加⼊群组⿊名单。
        case EMMultiDevicesEventGroupBan:
            break;
        //当前⽤户在其他设备将成员移除群组⿊名单。
        case EMMultiDevicesEventGroupAllow:
            break;
        //当前⽤户在其他设备屏蔽群组。
        case EMMultiDevicesEventGroupBlock:
            break;
        //当前⽤户在其他设备取消群组屏蔽。
        case EMMultiDevicesEventGroupUnBlock:
            break;
        //当前⽤户在其他设备转移群主。
        case EMMultiDevicesEventGroupAssignOwner:
            break;
        //当前⽤户在其他设备添加管理员。
        case EMMultiDevicesEventGroupAddAdmin:
            break;
        //当前⽤户在其他设备移除管理员。
        case EMMultiDevicesEventGroupRemoveAdmin:
            break;
        //当前⽤户在其他设备禁⾔⽤户。
        case EMMultiDevicesEventGroupAddMute:
            break;
        //当前⽤户在其他设备移除禁⾔。
        case EMMultiDevicesEventGroupRemoveMute:
            break;
        //当前⽤户在其他设备设置了群成员自定义属性。
        case EMMultiDevicesEventGroupMemberAttributesChanged:
            break;
        default:
            break;
    }
}

- (void)multiDevicesConversationEvent:(EMMultiDevicesEvent)aEvent conversationId:(NSString *)conversationId conversationType:(EMConversationType)conversationType
{
    switch (aEvent) {
        // 会话置顶。
        case EMMultiDevicesEventConversationPinned:
            break;
        // 会话取消置顶。
        case EMMultiDevicesEventConversationUnpinned:
            break;
        // 会话被删除。
        case EMMultiDevicesEventConversationDelete:
            break;
        default:
            break;
    }
}

// 当前⽤户在其他设备单向删除服务端的历史消息。
- (void)multiDevicesMessageBeRemoved:(NSString *)conversationId deviceId:(NSString *)deviceId
{
    
}
```

### 典型示例

当 PC 端和移动端登录同一个账号时，在移动端可以通过调用方法获取到 PC 端的登录 ID。该登录 ID 相当于特殊的好友用户 ID，可以直接使用于聊天，使用方法与好友的用户 ID 类似。

```objectivec
 NSArray *otherPlatformIds = [[EMClient sharedClient].contactManager getSelfIdsOnOtherPlatformWithError:nil];
if ([otherPlatformIds count] > 0) {
    NSString *chatter = otherPlatformIds[0];
    //获取会话
    EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:chatter type:EMConversationTypeChat createIfNotExist:YES];

    //发送消息
    NSString *sendText = @"test";
    EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:sendText];
    NSString *from = [[EMClient sharedClient] currentUsername];
    EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversation.conversationId from:from to:chatter body:body ext:nil];
    message.chatType = EMChatTypeChat;
    [[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
 }
```
