# 在多个设备上登录

<Toc />


环信即时通讯 IM 支持同一个用户 ID 在多个平台或者多个设备上登录；

客户端支持查询当前账号的已登录设备列表，可强制该账号从其他已登录设备下线；

环信即时通讯 IM iOS SDK 支持在同一账号的所有已登录设备上同步在线消息和离线消息以及对应的回执和已读状态；

同一账号的所有已登录的离线设备都可以接收推送；

在同一账号的所有已登录设备上同步好友相关操作；

在同一账号的所有已登录设备上同步群组和聊天室相关操作；

默认最多支持 4 个设备同时在线，具体见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。如需增加支持的设备数量，可以联系环信商务。

## 技术原理

用户在 iOS 端上初始化 SDK 时会生成一个识别设备的 ID，主要用于多设备登录和推送。服务器会自动分发新消息到各登录设备。环信即时通讯 IM iOS SDK 提供如下方法来实现多个设备上的互动功能。

- `getSelfIdsOnOtherPlatform` 获取在其他设备上登录的 ID。
- `EMMultiDevicesDelegate` 获取其他设备上进行的好友或者群组操作。

## 前提条件

开始前，请确保满足以下条件：

完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。

## 实现方法

### 获取其他设备上登录的 ID 和给其他设备发送消息

你可以调用 `getSelfIdsOnOtherPlatform` 方法来获取在其他设备上登录的 ID，将此 ID 作为消息接收方来发出消息，则其他设备上登录的账号可以收到消息，实现不同设备上相互发送文件等功能。

```objectivec
NSArray *ids = [EMClient.sharedClient.contactManager getSelfIdsOnOtherPlatformWithError:nil];
//选择一个 ID 作为发送目标。
NSString *toChatUsername = ids[0];
//创建一条文本消息，content 为消息文字内容，toChatUsername 为接收方 ID。
EMTextMessageBody *textBody = [[EMTextMessageBody alloc] initWithText:content];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername from:EMClient.sharedClient.currentUsername to:toChatUsername body:textBody ext:nil];

//发送消息。
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

### 强制该账号从一个设备下线

```objectivec
[EMClient.sharedClient kickDeviceWithUsername:@"ID" password:@"password" resource:@"deviceResource" completion:nil];
```

### 获取其他设备上进行的好友或者群组操作

账号 A 同时在设备 A 和设备 B 上登录，账号 A 在设备 A 上进行一些操作，设备 B 上会收到这些操作对应的通知。

你需要先实现 `EMMultiDevicesDelegate` 监听其他设备上的操作，再设置多设备监听。

```objectivec
//实现 `EMMultiDevicesDelegate` 监听其他设备上的操作。
@interface ViewController () <EMMultiDevicesDelegate>

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [EMClient.sharedClient addMultiDevicesDelegate:self delegateQueue:nil];
}

- (void)dealloc {
    [EMClient.sharedClient removeMultiDevicesDelegate:self];
}


#pragma mark - EMMultiDevicesDelegate
- (void)multiDevicesContactEventDidReceive:(EMMultiDevicesEvent)aEvent
                                  username:(NSString *)aUsername
                                       ext:(NSString *)aExt {

    switch (aEvent) {
            //在其他设备上发起好友请求
        case EMMultiDevicesEventContactAdd:

            break;
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
// 当前⽤户在其他设备单向删除服务端的历史消息。
- (void)multiDevicesMessageBeRemoved:(NSString *_Nonnull)conversationId deviceId:(NSString *_Nonnull)deviceId;
```

### 典型示例

当 PC 端和手机端登录同一个账号时，在手机端可以通过特定方法获取到 PC 端的设备 ID，该设备 ID 相当于特殊的好友 Username，可以直接使用于聊天，使用方法与好友类似。

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