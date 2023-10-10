# EaseIMKit 使用指南

<Toc />

仍在使用旧版 EaseUI 的用户可参考旧版 EaseUI 的文档，旧版已不再维护。 旧版文档地址：[EaseUI 集成](https://docs-im.easemob.com/im/ios/other/easeui)

## 简介

EaseIMKit 是什么？

EaseIMKit 是基于环信 IM SDK 的一款 UI 组件库，它提供了一些通用的 UI 组件，例如 ‘会话列表’、‘聊天界面’ 和 ‘联系人列表’ 等，开发者可根据实际业务需求通过该组件库快速地搭建自定义 IM 应用。EaseIMKit 中的组件在实现 UI 功能的同时，调用 IM SDK 相应的接口实现 IM 相关逻辑和数据的处理，因而开发者在使用 EaseIMKit 时只需关注自身业务或个性化扩展即可。

EaseIMKit 源码地址

- [EaseIMKit 工程](https://github.com/easemob/easeui_ios/tree/EaseIMKit_4.1.0)

使用 EaseIMKit 环信 IM App 地址：

- [环信 IM](https://downloadsdk.easemob.com/downloads/iOS_IM_SDK_V4.1.1.zip)

## 导入

### 支持系统版本要求

- EaseIMKit 支持 iOS 10.0 及以上系统版本
- EaseIM 支持 iOS 11.0 及以上系统版本

## 快速集成

### pod 方式集成

```
pod 'EaseIMKit'
```

需要在 `Podfile` 文件加上 `use_frameworks!`

:::notice
EaseIMKit: 对应 HyphenateChat SDK（HyphenateChat 不包含实时音视频，EaseIMKit 不包含音视频，EaseIM 依赖音视频库 EaseCallKit 后实现了音视频功能）

EaseIMKit 中包含了拍照，发语音，发图片，发视频，发位置，发文件的功能，需要使用录音，摄像头，相册，地理位置的权限。需要在您项目的 info.plist 中添加对应权限。
:::

### 源码集成

<!--
- [Github 下载源码](https://github.com/easemob/easeui_ios.git)

执行命令：`git clone https://github.com/easemob/easeui_ios.git`
-->
[下载IM源码](https://downloadsdk.easemob.com/downloads/iOS_IM_SDK_V4.1.1.zip)


- 创建 `Podfile` 文件并添加 EaseIMKit 源码依赖

  1. 项目 `Podfile` 文件 和 `ProjectName.xcodeproj` 文件应在同一目录，如下图所示：

  ![img](@static/images/ios/easeimkit1.png)

  Podfile 文件示例：

  ```
  platform :ios, '11.0'

  source 'https://github.com/CocoaPods/Specs.git'

  target 'ProjectName' do
      pod 'EaseIMKit',  :path => "../EaseUI/EaseIMKit"
      pod 'HyphenateChat', '3.8.4'
  end
  ```

  2. EaseIMKit path 路径（如：pod 'EaseIMKit', :path ⇒ “../EaseUI/EaseIMKit”）需指向 EaseIMKit.podspec 文件所在目录，如下图所示：

  ![img](@static/images/ios/easeimkit2.png)

- 项目集成本地 EaseIMKit 源码

  1. 终端 cd 到 Podfile 文件所在目录，执行 pod install 命令在项目中安装 EaseIMKit 本地源码
  2. 执行完成后，则在 Xcode 项目目录 Pods/Development Pods/ 可找到 EaseIMKit 源码，如下图所示：

  <img src=@static/images/ios/easeimkit3.png  title=集成本地源码 width="400"/>

  3. 可对源码进行符合自己项目目标的自定义修改

- 成为社区贡献者

如果在源码自定义过程中有任何通用自定义都可以给我们 [Github 仓库](https://github.com/easemob/easeui_ios.git) 提交代码成为社区贡献者！

### 初始化

第 1 步：引入相关头文件

```objectivec
#import <EaseIMKit/EaseIMKit.h>
```

第 2 步：在在工程的 AppDelegate 中的以下方法中调用 EaseIMKitManager 的初始化方法一并初始化环信 SDK。(注: 此方法不需要重复调用)

```objectivec
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    EMOptions *options = [EMOptions optionsWithAppkey:@"您的APPKEY"];
    [EaseIMKitManager initWithEMOptions:options];
    //再做登录操作，可准确接收到系统通知
    return YES;
}
```

EaseIMKitManager 主要包含系统通知（好友申请，群邀请/申请）回调，未读总数回调等方法。 用户需要注册自己的类到 EaseIMKitManagerDelegate 才可收到未读总数变化回调。 用户需要添加 EaseIMKitSystemNotiDelegate 代理才可收到系统通知相关回调。

系统通知相关回调接口，系统通知构造成了一个本地会话，每个新通知构造为一条本地消息。 系统通知所构造的会话的 conversationId 为 @“emsystemnotificationid”。

#### 是否需要系统通知

```objectivec
/*!
 @method
 @brief 是否需要系统通知：好友/群 申请等
 @discussion  默认需要系统通知
 @result 返回： YES：需要； NO：不需要；
 */
- (BOOL)isNeedsSystemNotification;
```

#### 收到系统通知所展示信息回调接口

```objectivec
/*!
 @method
 @brief 收到请求返回展示信息
 @param   conversationId   会话 ID。
   * 对于单聊类型，会话 ID 同时也是对方用户的名称。
   * 对于群聊类型，会话 ID 同时也是对方群组的 ID，并不同于群组的名称。
   * 对于聊天室类型，会话 ID 同时也是聊天室的 ID，并不同于聊天室的名称。

 @param   requestUser   请求方。
 @param   reason   请求原因。
 @result    返回系统通知所展示信息。
 */
- (NSString *)requestDidReceiveShowMessage:(NSString *)conversationId requestUser:(NSString *)requestUser reason:(EaseIMKitCallBackReason)reason;
```

对于返回值处理：空字符串不产生新 message / nil：使用默认实现 / 非空字符串且长度大于 0，使用该字符串产生新 message

#### 收到系统通知扩展信息回调接口

```objectivec
/*!
 @method
 @brief 收到请求返回扩展信息
 @param   conversationId   会话 ID。
   * 对于单聊类型，会话 ID 同时也是对方用户的名称。
   * 对于群聊类型，会话 ID 同时也是对方群组的 ID，并不同于群组的名称。
   * 对于聊天室类型，会话 ID 同时也是聊天室的 ID，并不同于聊天室的名称。

 @param   requestUser   请求方。
 @param   reason   请求原因。
 @result    返回系统通知携带扩展信息字典。
 */
- (NSDictionary *)requestDidReceiveConversationExt:(NSString *)conversationId requestUser:(NSString *)requestUser reason:(EaseIMKitCallBackReason)reason;
```

#### 未读总数变化回调接口

```objectivec
/*!
 @method
 @brief 会话未读总数变化。
 @param   unreadCount     当前会话列表的总未读数。
 */
- (void)conversationsUnreadCountUpdate:(NSInteger)unreadCount;
```

## 快速搭建

### 聊天会话快速搭建

导入 EaseIMKit 头文件

```objectivec
#import <EaseIMKit/EaseIMKit.h>
```

EaseIMKit 提供现成的聊天会话 ViewController，可以通过创建 EaseChatViewController 对象实例，嵌入进自己的聊天控制器方式（参考 EaseIM 中 EMChatViewController）实现对 EaseIMKit 聊天会话的集成。 创建聊天会话页实例，需传递用户‘环信 ID’或‘群 ID’ ，会话类型（EMConversationType）以及必须传入聊天视图配置数据模型 EaseChatViewModel 实例。

```objectivec
EaseChatViewModel *viewModel = [[EaseChatViewModel alloc]init];
EaseChatViewController *chatController = [EaseChatViewController initWithConversationId:@"custom"
                                              conversationType:EMConversationTypeChat
                                                  chatViewModel:viewModel];
[self addChildViewController:chatController];
[self.view addSubview:chatController.view];
chatController.view.frame = self.view.bounds;
```

聊天控制器嵌入自己的聊天页后还需传入消息列表 messageList 以供 EaseChatViewController 展示使用

```objectivec
//isScrollBottom 是否滑动到页面底部
- (void)loadData:(BOOL)isScrollBottom
{
    __weak typeof(self) weakself = self;
    void (^block)(NSArray *aMessages, EMError *aError) = ^(NSArray *aMessages, EMError *aError) {
        dispatch_async(dispatch_get_main_queue(), ^{
            //给 EaseChatViewController 传入消息列表messageList
            //isScrollBottom 是否滑动到页面底部 isInsertBottom 消息数据集是否插入消息列表底部
            //在传入消息列表之前不需要对列表做任何处理，只需传入列表数据即可，否则会刷新 UI 失败
            [weakself.chatController refreshTableViewWithData:aMessages  isInsertBottom:NO  isScrollBottom:isScrollBottom];
        });
    };
  [self.conversation loadMessagesStartFromId:nil count:50   searchDirection:EMMessageSearchDirectionUp completion:block];
}
```

### 会话列表快速搭建

导入 EaseIMKit 头文件

```objectivec
#import <EaseIMKit/EaseIMKit.h>
```

在自己聊天控制器内可嵌入 EaseIMKit 的会话列表页，创建会话列表实例，实例化会话列表必须传入会话列表视图数据配置模型 EaseConversationViewModel 实例。

```objectivec
EaseConversationViewModel *viewModel = [[EaseConversationViewModel alloc] init];

EaseConversationsViewController *easeConvsVC = [[EaseConversationsViewController alloc] initWithModel:viewModel];
easeConvsVC.delegate = self;
[self addChildViewController:easeConvsVC];
[self.view addSubview:easeConvsVC.view];
[easeConvsVC.view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.size.equalTo(self.view);
}];
```

### 通讯录快速搭建

导入 EaseIMKit 头文件

```objectivec
#import <EaseIMKit/EaseIMKit.h>
```

在自己聊天控制器内可嵌入 EaseIMKit 的会话列表页，创建通讯录实例，必须传入通讯录视图数据模型 EaseContactsViewModel 实例以构建通讯录 UI 界面。

```objectivec
EaseContactsViewModel *model = [[EaseContactsViewModel alloc] init];
EaseContactsViewController *contactsVC = [[EaseContactsViewController alloc] initWithModel:model];
//通讯录头部功能区（加好友/群聊/聊天室 入口）
contactsVC.customHeaderItems = [self items];
contactsVC.delegate = self;
[self addChildViewController:contactsVC];
[self.view addSubview:contactsVC.view];
[contactsVC.view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.size.equalTo(self.view);
}];
//设置通讯录头部功能区实例（EaseIM APP 有效）：
- (NSArray<EaseUserDelegate> *)items {
    EMContactModel *newFriends = [[EMContactModel alloc] init];
    newFriends.huanXinId = @"newFriend";
    newFriends.nickname = @"新的好友";
    newFriends.avatar = [UIImage imageNamed:@"newFriend"];
    EMContactModel *groups = [[EMContactModel alloc] init];
    groups.huanXinId = @"groupList";
    groups.nickname = @"群聊";
    groups.avatar = [UIImage imageNamed:@"groupchat"];
    EMContactModel *chatooms = [[EMContactModel alloc] init];
    chatooms.huanXinId = @"chatroomList";
    chatooms.nickname = @"聊天室";
    chatooms.avatar = [UIImage imageNamed:@"chatroom"];
    return (NSArray<EaseUserDelegate> *)@[newFriends, groups, chatooms];
}
```

## 设置样式

### 聊天会话样式配置

聊天会话可配置参数如下：

```objectivec
@property (nonatomic, strong) UIColor *chatViewBgColor; //聊天页背景色
@property (nonatomic, strong) UIColor *chatBarBgColor; //输入区背景色
@property (nonatomic, strong) EaseExtFuncModel *extFuncModel; //输入区扩展功能数据模型
@property (nonatomic, strong) UIColor *msgTimeItemBgColor; //时间线背景色
@property (nonatomic, strong) UIColor *msgTimeItemFontColor; //时间线字体颜色
@property (nonatomic, strong) UIImage *receiveBubbleBgPicture; //所接收信息的气泡
@property (nonatomic, strong) UIImage *sendBubbleBgPicture; //所发送信息的气泡
@property (nonatomic, strong) UIColor *contentFontColor; //文本消息字体颜色
@property (nonatomic) CGFloat contentFontSize;  //文本消息字体大小
@property (nonatomic) UIEdgeInsets bubbleBgEdgeInset; //消息气泡背景图保护区域
@property (nonatomic) EaseInputBarStyle inputBarStyle; //输入区类型：(全部功能，无语音，无表情，无表情和语音，纯文本)
@property (nonatomic) EaseAvatarStyle avatarStyle; //头像风格
@property (nonatomic) CGFloat avatarCornerRadius; //头像圆角大小 默认：0 (只有头像类型是圆角生效)
//仅群聊可设置
@property (nonatomic) EaseAlignmentStyle msgAlignmentStyle; //聊天区域消息排列方式
```

其中参数：EaseExtFuncModel 输入区扩展功能数据配置模型(聊天会话页相机，相册，音视频等区域)内含可配参数：

```objectivec
@property (nonatomic, strong) UIColor *iconBgColor;//图标所在 view 背景色
@property (nonatomic, strong) UIColor *viewBgColor;//视图背景色
@property (nonatomic, strong) UIColor *fontColor;//字体颜色
@property (nonatomic, assign) CGFloat fontSize;//字体大小
@property (nonatomic, assign) CGSize collectionViewSize;//视图尺寸
```

其中参数：inputBarStyle（输入区）包含五种类型：

```objectivec
typedef NS_ENUM(NSInteger, EaseInputBarStyle) {
    EaseInputBarStyleAll = 1,          //全部功能
    EaseInputBarStyleNoAudio,          //无语音
    EaseInputBarStyleNoEmoji,          //无表情
    EaseInputBarStyleNoAudioAndEmoji,  //无表情和语音
    EaseInputBarStyleOnlyText,         //纯文本
};
```

其中参数：EaseAlignmentStyle （消息排列方式,仅群聊可生效）包含两种类型

```objectivec
typedef enum {
    EaseAlignmentNormal = 1,     //左右排列
    EaseAlignmentlLeft,          //居左排列
} EaseAlignmentStyle;
```

实例化的聊天控制器可通过重置视图 UI 配置模型刷新页面

```objectivec
//重置聊天控制器
- (void)resetChatVCWithViewModel:(EaseChatViewModel *)viewModel;
```

聊天页背景色，输入区颜色配置示例：

 <img src=@static/images/ios/easeimkit4.png  title=背景色，输入区颜色 width="200"/>

聊天会话输入区类型参数配置示例：


 <img src=@static/images/ios/easeimkit5.png  title=纯文本 width="200"/>

输入区扩展功能参数配置示例：

 <img src=@static/images/ios/easeimkit6.jpeg  title=输入区扩展 width="200"/>

聊天会话群聊消息同左排列，时间线背景色，时间字体颜色配置示例：


 <img src=@static/images/ios/easeimkit7.jpeg  title=群聊消息 width="200"/>

### 会话列表样式配置

会话列表可配置参数如下：

```objectivec
@property (nonatomic) EaseAvatarStyle avatarType;   // 头像样式
@property (nonatomic, strong) UIImage *defaultAvatarImage;  // 默认头像
@property (nonatomic) CGSize avatarSize;    // 头像尺寸
@property (nonatomic) UIEdgeInsets avatarEdgeInsets;   // 头像位置
@property (nonatomic, strong) UIFont *nameLabelFont;   // 昵称字体
@property (nonatomic, strong) UIColor *nameLabelColor;   // 昵称颜色
@property (nonatomic) UIEdgeInsets nameLabelEdgeInsets;   // 昵称位置
@property (nonatomic, strong) UIFont *detailLabelFont;   // 详情字体
@property (nonatomic, strong) UIColor *detailLabelColor;    // 详情字色
@property (nonatomic) UIEdgeInsets detailLabelEdgeInsets;   // 详情位置
@property (nonatomic, strong) UIFont *timeLabelFont;    // 时间字体
@property (nonatomic, strong) UIColor *timeLabelColor;  // 时间字色
@property (nonatomic) UIEdgeInsets timeLabelEdgeInsets; // 时间位置
@property (nonatomic) EMUnReadCountViewPosition badgeLabelPosition; // 未读数显示风格
@property (nonatomic, strong) UIFont *badgeLabelFont;   // 未读数字体
@property (nonatomic, strong) UIColor *badgeLabelTitleColor;    // 未读数字色
@property (nonatomic, strong) UIColor *badgeLabelBgColor;   // 未读数背景色
@property (nonatomic) CGFloat badgeLabelHeight;   // 未读数角标高度
@property (nonatomic) CGVector badgeLabelCenterVector;  // 未读数中心位置偏移
@property (nonatomic) int badgeMaxNum;   // 未读数显示上限, 超过上限后会显示 xx+
```

会话列表以及联系人列表共用其父类可配置参数如下：

```objectivec
@property (nonatomic) BOOL canRefresh;  // 是否可下拉刷新
@property (nonatomic, strong) UIView *bgView;   // tableView 背景图
@property (nonatomic, strong) UIColor *cellBgColor;  // UITableViewCell 背景色
@property (nonatomic) UIEdgeInsets cellSeparatorInset;  // UITableViewCell 下划线位置
@property (nonatomic, strong) UIColor *cellSeparatorColor;  // UITableViewCell 下划线颜色
```

### 通讯录样式配置

通讯录可配置参数如下：

```objectivec
@property (nonatomic) EaseAvatarStyle avatarType;   // 头像样式
@property (nonatomic, strong) UIImage *defaultAvatarImage;  // 默认头像
@property (nonatomic) CGSize avatarSize;    // 头像尺寸
@property (nonatomic) UIEdgeInsets avatarEdgeInsets;    // 头像位置
@property (nonatomic, strong) UIFont *nameLabelFont;    // 昵称字体
@property (nonatomic, strong) UIColor *nameLabelColor;  // 昵称颜色
@property (nonatomic) UIEdgeInsets nameLabelEdgeInsets;  // 昵称位置
@property (nonatomic, strong) UIFont *sectionTitleFont;  // section title 字体
@property (nonatomic, strong) UIColor *sectionTitleColor;   // section title 颜色
@property (nonatomic, strong) UIColor *sectionTitleBgColor;  // section title 背景
@property (nonatomic) UIEdgeInsets sectionTitleEdgeInsets;  // section title 位置
// section title label 高度 (section title view = sectionTitleLabelHeight + sectionTitleEdgeInsets.top + sectionTitleEdgeInsets.bottom)
@property (nonatomic) CGFloat sectionTitleLabelHeight;
```

以及通讯录和会话列表共用的参数配置

```objectivec
@property (nonatomic) BOOL canRefresh;  // 是否可下拉刷新
@property (nonatomic, strong) UIView *bgView;   // tableView 背景图
@property (nonatomic, strong) UIColor *cellBgColor;  // UITableViewCell 背景色
@property (nonatomic) UIEdgeInsets cellSeparatorInset;  // UITableViewCell 下划线位置
@property (nonatomic, strong) UIColor *cellSeparatorColor;  // UITableViewCell 下划线颜色
```

通讯录添加头部功能区：新的好友，群聊，聊天室示意图：

 <img src=@static/images/ios/easeimkit8.png  title=头部功能区 width="200"/>

## 自定义功能扩展

### 聊天会话自定义功能扩展

实例化 EaseChatViewController 之后，可选择实现 EaseChatViewControllerDelegate 协议（聊天控制器回调代理），接收 EaseChatViewController 的回调并做进一步的自定义实现。

EaseChatViewControllerDelegate

#### 下拉加载更多消息回调

下拉加载更多消息回调（可得到当前第一条消息 ID 作为下次加载更多消息的参考 ID；当前消息列表）

```objectivec
/**
 * 下拉加载更多消息回调
 *
 * @param   firstMessageId          第一条消息 ID
 * @param   messageList             当前消息列表
 */
- (void)loadMoreMessageData:(NSString *)firstMessageId currentMessageList:(NSArray<EMMessage *> *)messageList;
```

#### 自定义 cell

通过实现聊天控制回调获取自定义消息 cell，根据 messageModel，用户自己判断是否显示自定义消息 cell。如果返回 nil 会显示默认；如果返回 cell 会显示用户自定义消息 cell。

```objectivec
/*!
 @method
 @brief 获取消息自定义 cell
 @discussion 用户根据 messageModel 判断是否显示自定义 cell。返回 nil 显示默认 cell，否则显示用户自定义 cell
 @param tableView 当前消息视图的 tableView
 @param messageModel 消息的数据模型
 @result 返回用户自定义 cell
 */
- (UITableViewCell *)cellForItem:(UITableView *)tableView messageModel:(EaseMessageModel *)messageModel;
```

具体创建自定义 Cell 的示例：

```objectivec
//自定义通话记录cell
- (UITableViewCell *)cellForItem:(UITableView *)tableView messageModel:(EaseMessageModel *)messageModel
{
    //当消息是单聊音视频通话消息时，EaseIM 自定义通话记录 cell
    if (messageModel.type == EMMessageTypePictMixText) {
        EMMessageCell *cell = [[EMMessageCell alloc]initWithDirection:messageModel.direction type:messageModel.type];
        cell.model = messageModel;
        cell.delegate = self;
        return cell;
    }
    return nil;
}
```

通过自定义 cell 展示单聊音视频通话记录的效果图：

 <img src=@static/images/ios/easeimkit9.png  title=单聊音视频通话记录 width="200"/>

#### 选中消息的回调

选中消息的回调（EaseIMKit 没有对于自定义 cell 的选中事件回调，需用户自定义实现选中响应）

```objectivec
/*!
 @method
 @brief 消息点击事件
 @discussion 用户根据 messageModel 判断，是否自定义处理消息选中时间。返回 NO 为自定义处理，返回 YES 为默认处理
 @param   message         当前点击的消息
 @param   userData        当前点击的消息携带的用户资料
 @result 是否采用默认事件处理
*/
- (BOOL)didSelectMessageItem:(EMMessage*)message userData:(id<EaseUserDelegate>)userData;
```

EaseIMKit 选中是消息气泡，自定义 cell 的点击事件需自定义实现，例：EaseIM 单聊通话记录 cell 点击事件再次发起通话

```objectivec
- (void)messageCellDidSelected:(EMMessageCell *)aCell
{
    //使用‘通知’的方式发起通话，其中所定义的宏仅在 EaseIM APP 中生效
    NSString *callType = nil;
    NSDictionary *dic = aCell.model.message.ext;
    if ([[dic objectForKey:EMCOMMUNICATE_TYPE] isEqualToString:EMCOMMUNICATE_TYPE_VOICE])
        callType = EMCOMMUNICATE_TYPE_VOICE;
    if ([[dic objectForKey:EMCOMMUNICATE_TYPE] isEqualToString:EMCOMMUNICATE_TYPE_VIDEO])
        callType = EMCOMMUNICATE_TYPE_VIDEO;
    if ([callType isEqualToString:EMCOMMUNICATE_TYPE_VOICE])
        [[NSNotificationCenter defaultCenter] postNotificationName:CALL_MAKE1V1 object:@{CALL_CHATTER:aCell.model.message.conversationId, CALL_TYPE:@(EMCallTypeVoice)}];
    if ([callType isEqualToString:EMCOMMUNICATE_TYPE_VIDEO])
        [[NSNotificationCenter defaultCenter] postNotificationName:CALL_MAKE1V1 object:@{CALL_CHATTER:aCell.model.message.conversationId,   CALL_TYPE:@(EMCallTypeVideo)}];
}
```

#### 用户资料回调

用户资料回调（头像昵称等）

```objectivec
/*!
 @method
 @brief 返回用户资料
 @discussion 用户根据 huanxinID 在自己的用户体系中匹配对应的用户资料，并返回相应的信息，否则默认实现
 @param   huanxinID        环信 ID
 @result 返回与当前环信 ID 关联的用户资料
 */
- (id<EaseUserDelegate>)userData:(NSString*)huanxinID;
```

#### 用户选中头像的回调

```objectivec
/*!
 @method
 @brief 点击消息头像
 @discussion 获取用户点击头像回调
 @param   userData        当前点击的头像所指向的用户资料
 */

- (void)avatarDidSelected:(id<EaseUserDelegate>)userData;
```

获取用户选中头像回调的样例：

```objectivec
//头像点击
- (void)avatarDidSelected:(id<EaseUserDelegate>)userData
{
    //EMPersonalDataViewController 用户自定义的个人信息视图
    //样例逻辑是选中消息头像后，进入该消息发送者的个人信息页
    if (userData && userData.easeId) {
        EMPersonalDataViewController *controller = [[EMPersonalDataViewController alloc]initWithNickName:userData.easeId];
        [self.navigationController pushViewController:controller animated:YES];
    }
}
```

#### 用户长按头像的回调

```objectivec
/*!
 @method
 @brief 点击消息头像
 @discussion 获取用户长按头像回调
 @param   userData        当前长按的头像所指向的用户资料
 */

- (void)avatarDidLongPress:(id<EaseUserDelegate>)userData;
```

#### 群通知回执详情

```objectivec
/*!
 @method
 @brief 群通知回执详情
 @discussion 获取用户点击群通知的回调（仅在群聊中并且是点击用户群主有效）
 @param   message        当前群通知消息
 @param   groupId        当前消息所属群 ID
 */

- (void)groupMessageReadReceiptDetail:(EMMessage*)message groupId:(NSString*)groupId;
```

获取用户点击群通知回执详情的样例：

```objectivec
//群通知阅读回执详情
- (void)groupMessageReadReceiptDetail:(EMMessage *)message groupId:(NSString *)groupId
{
    //EMReadReceiptMsgViewController用户自定义群通知阅读回执详情页（在 EaseIM APP 中有效）
    EMReadReceiptMsgViewController *readReceiptControl = [[EMReadReceiptMsgViewController alloc] initWithMessage:message groupId:groupId];
    readReceiptControl.modalPresentationStyle = 0;
    [self presentViewController:readReceiptControl animated:YES completion:nil];
}
```

#### 输入区回调

当前会话输入扩展区数据模型组（UI 配置可在聊天视图配置数据模型中设置）

```objectivec
/*!
 @method
 @brief 当前会话输入扩展区数据模型组
 @param   defaultInputBarItems     默认功能数据模型组  （默认有序：相册，相机，位置，文件）
 @param   conversationType         当前会话类型：单聊，群聊，聊天室
 @result  返回一组输入区扩展功能
 */

- (NSMutableArray<EaseExtMenuModel*>*)inputBarExtMenuItemArray:
                (NSMutableArray<EaseExtMenuModel*>*)defaultInputBarItems
                conversationType:(EMConversationType)conversationType;
```

当前会话输入扩展区数据模型组回调示例（EaseIM APP 有效）：

```objectivec
- (NSMutableArray<EaseExtMenuModel *> *)inputBarExtMenuItemArray:(NSMutableArray<EaseExtMenuModel *> *)defaultInputBarItems conversationType:(EMConversationType)conversationType
{
NSMutableArray<EaseExtMenuModel *> *menuArray = [[NSMutableArray<EaseExtMenuModel *> alloc]init];
//相册
[menuArray addObject:[defaultInputBarItems objectAtIndex:0]];
//相机
[menuArray addObject:[defaultInputBarItems objectAtIndex:1]];
//音视频
__weak typeof(self) weakself = self;
if (conversationType != EMConversationTypeChatRoom) {
    EaseExtMenuModel *rtcMenu = [[EaseExtMenuModel alloc]initWithData:[UIImage imageNamed:@"video_conf"] funcDesc:@"音视频" handle:^(NSString * _Nonnull itemDesc, BOOL isExecuted) {
        if (isExecuted) {
            [weakself chatSealRtcAction];
        }
    }];
    [menuArray addObject:rtcMenu];
}
//位置
[menuArray addObject:[defaultInputBarItems objectAtIndex:2]];
//文件
[menuArray addObject:[defaultInputBarItems objectAtIndex:3]];
//群组回执
if (conversationType == EMConversationTypeGroupChat) {
    if ([[EMClient.sharedClient.groupManager getGroupSpecificationFromServerWithId:_conversation.conversationId error:nil].owner isEqualToString:EMClient.sharedClient.currentUsername]) {
        EaseExtMenuModel *groupReadReceiptExtModel = [[EaseExtMenuModel alloc]initWithData:[UIImage imageNamed:@"pin_readReceipt"] funcDesc:@"群组回执" handle:^(NSString * _Nonnull itemDesc, BOOL isExecuted) {
            //群组回执发送消息页
            [weakself groupReadReceiptAction];
        }];
        [menuArray addObject:groupReadReceiptExtModel];
    }
}
return menuArray;
}
```

#### 键盘输入变化回调

```objectivec
/*!
 @method
 @brief 输入区键盘输入变化回调 例：@群成员
 @result  返回键入内容是否有效
 */
- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text;
```

输入区键盘回调示例（EaseIM APP 有效）：

```objectivec
//@群成员
- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text
{
    if (self.conversation.type == EMConversationTypeGroupChat) {
        if ([text isEqualToString:@"@"]) {
            [self _willInputAt:textView];
        } else if ([text isEqualToString:@""]) {
            __block BOOL isAt = NO;
            [textView.attributedText enumerateAttributesInRange:NSMakeRange(0, textView.text.length) options:0 usingBlock:^(NSDictionary<NSAttributedStringKey,id> * _Nonnull attrs, NSRange range, BOOL * _Nonnull stop) {
                NSString *atUser = attrs[@"AtInfo"];
                if (atUser) {
                    if (textView.selectedRange.location == range.location + range.length) {
                        isAt = YES;
                        NSMutableAttributedString *result = [[NSMutableAttributedString alloc] initWithAttributedString:textView.attributedText];
                        [result deleteCharactersInRange:range];
                        textView.attributedText = result;
                        if ([atUser isEqualToString:@"All"]) {
                            [self.chatController removeAtAll];
                        } else {
                            [self.chatController removeAtUser:atUser];
                        }
                        *stop = YES;
                    }
                }
            }];
            return !isAt;
        }
    }
    return YES;
}
```

#### 输入框选中回调

```objectivec
/**
 * 输入区选中范围变化回调  例：@群成员
 */
- (void)textViewDidChangeSelection:(UITextView *)textView;
```

输入区选中范围变化回调示例（EaseIM APP 有效）：

```objectivec
- (void)textViewDidChangeSelection:(UITextView *)textView
{
    [textView.attributedText enumerateAttributesInRange:NSMakeRange(0, textView.text.length) options:0 usingBlock:^(NSDictionary<NSAttributedStringKey,id> * _Nonnull attrs, NSRange range, BOOL * _Nonnull stop) {
        if (attrs[@"AtInfo"]) {
            NSUInteger min = textView.selectedRange.location;
            NSUInteger max = textView.selectedRange.location + textView.selectedRange.length;
            if (min > range.location && min <= range.location + range.length) {
                NSUInteger location = range.location + range.length;
                NSUInteger length = 0;
                if (textView.selectedRange.location + textView.selectedRange.length > location) {
                    length = textView.selectedRange.location + textView.selectedRange.length - location;
                }
                textView.selectedRange = NSMakeRange(location, length);
                *stop = YES;
            } else if (max > range.location && max <= range.location + range.length) {
                NSUInteger location = min;
                NSUInteger length = textView.selectedRange.length - (max - range.location - range.length);
                textView.selectedRange = NSMakeRange(location, length);
                *stop = YES;
            }
        }
    }];
}
```

#### 对方正在输入状态回调

对方正在输入状态回调（单聊有效）

```objectivec
/**
 对方正在输入
*/
- (void)beginTyping;
```

对方结束输入回调（单聊有效）

```objectivec
/**
 对方结束输入
*/
- (void)endTyping;
```

#### 消息长按事件回调

默认消息 cell 长按回调

```objectivec
/*!
 @method
 @brief 默认消息 cell 长按回调
 @param   defaultLongPressItems       默认长按扩展区功能数据模型组（默认共有：复制，删除，撤回发送消息时 间距当前时间小于 2 分钟）
 @param   message                     当前长按的消息
 @result  返回默认消息长按扩展功能组
 */
- (NSMutableArray<EaseExtMenuModel*>*)messageLongPressExtMenuItemArray:(NSMutableArray<EaseExtMenuModel*>*)defaultLongPressItems message:(EMMessage*)message;
```

默认消息 cell 长按回调示例（EaseIM APP 有效）：

```objectivec
//添加转发消息
- (NSMutableArray<EaseExtMenuModel *> *)messageLongPressExtMenuItemArray:(NSMutableArray<EaseExtMenuModel *> *)defaultLongPressItems message:(EMMessage *)message
{
    NSMutableArray<EaseExtMenuModel *> *menuArray = [[NSMutableArray<EaseExtMenuModel *> alloc]initWithArray:defaultLongPressItems];
    //转发
    __weak typeof(self) weakself = self;
    if (message.body.type == EMMessageBodyTypeText || message.body.type == EMMessageBodyTypeImage || message.body.type == EMMessageBodyTypeLocation || message.body.type == EMMessageBodyTypeVideo) {
        EaseExtMenuModel *forwardMenu = [[EaseExtMenuModel alloc]initWithData:[UIImage imageNamed:@"forward"] funcDesc:@"转发" handle:^(NSString * _Nonnull itemDesc, BOOL isExecuted) {
            //用户可自定义转发 CallBack
            if (isExecuted) {
                [weakself forwardMenuItemAction:message];
            }
        }];
        [menuArray addObject:forwardMenu];
    }
    return menuArray;
}
```

#### 自定义 cell 长按回调

用户自定义消息 cell 长按事件回调

```objectivec
/*!
 @method
 @brief 当前所长按的 自定义 cell 的扩展区数据模型组
 @param   defaultLongPressItems   默认长按扩展区功能数据模型组。默认共有：复制，删除，撤回（发送消息时 间距当前时间小于 2 分钟）
 @param   customCell              当前长按的自定义 cell
 @result  返回默认消息长按扩展功能组
 */
/**
 *
 *
 * @param   defaultLongPressItems   默认长按扩展区功能数据模型组  默认共有：复制，删除，撤回（发送消息时 间距当前时间小于 2 分钟））
 * @param   customCell              当前长按的自定义 cell
 */
- (NSMutableArray<EaseExtMenuModel*>*)customCellLongPressExtMenuItemArray:(NSMutableArray<EaseExtMenuModel*>*)defaultLongPressItems customCell:(UITableViewCell*)customCell;
```

### 会话列表自定义功能扩展

实例化 `EaseConversationsViewController` 之后，可选择实现 `EaseConversationsViewControllerDelegate` 协议（会话列表回调代理），接收 `EaseConversationsViewController` 的回调并做进一步的自定义实现。

`EaseConversationsViewControllerDelegate`

#### 自定义 cell

通过实现会话列表回调获取自定义消息 cell 如果返回 nil 会显示默认；如果返回 cell 则会显示用户自定义 cell。

```objectivec
/*!
 @method
 @brief 获取消息自定义 cell
 @discussion 返回 nil 显示默认 cell，否则显示用户自定义 cell
 @param     tableView 当前消息视图的 tableView
 @param     indexPath 当前所要展示 cell 的 indexPath
 @result 返回用户自定义cell
 */
- (UITableViewCell *)easeTableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath;
```

#### 会话列表 cell 选中回调

```objectivec
/*!
 @method
 @brief 会话列表 cell 选中回调
 @param     tableView 当前消息视图的 tableView
 @param     indexPath 当前所要展示 cell 的 indexPath
 */
- (void)easeTableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath;
```

会话列表 cell 选中回调示例（EaseIM APP 有效）：

```objectivec
- (void)easeTableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    EaseConversationCell *cell = (EaseConversationCell*)[tableView cellForRowAtIndexPath:indexPath];
    //系统通知
    if ([cell.model.easeId isEqualToString:@"emsystemnotificationid"]) {
       //此实例仅为 EaseIM APP 展示系统通知
        EMNotificationViewController *controller = [[EMNotificationViewController alloc] initWithStyle:UITableViewStylePlain];
        [self.navigationController pushViewController:controller animated:YES];
        return;
    }
    //跳转至聊天页
    [[NSNotificationCenter defaultCenter] postNotificationName:CHAT_PUSHVIEWCONTROLLER object:cell.model];
}
```

#### 会话列表用户资料回调

```objectivec
/*!
 @method
 @brief 会话列表用户资料回调
 @discussion 可根据 conversationId 或 type 返回对应的用户资料数据集
 @param     conversationId 当前会话列表 cell 所拥有的会话 ID
 @param     type 当前会话列表 cell 所拥有的会话类型
 */
- (id<EaseUserDelegate>)easeUserDelegateAtConversationId:(NSString *)conversationId
                                        conversationType:(EMConversationType)type;
```

会话列表用户资料回调实例（EaseIM APP 有效）

```objectivec
- (id<EaseUserDelegate>)easeUserDelegateAtConversationId:(NSString *)conversationId conversationType:(EMConversationType)type
{
    //EMConversationUserDataModel 为自定义用户资料数据模型，实现 EaseUserDelegate 接口返回参数
    //@property (nonatomic, copy, readonly) NSString *easeId;           // 环信 ID
    //@property (nonatomic, copy, readonly) UIImage *defaultAvatar;     // 默认头像显示
    EMConversationUserDataModel *userData = [[EMConversationUserDataModel alloc]initWithEaseId:conversationId conversationType:type];
    return userData;
}
```

#### 会话列表 cell 侧滑项回调

```objectivec
/*!
 @method
 @brief 会话列表 cell 侧滑项回调
 @param     tableView 当前消息视图的 tableView
 @param     indexPath 当前所要侧滑 cell 的 indexPath
 @param     actions 返回侧滑项集合
 */
- (NSArray<UIContextualAction *> *)easeTableView:(UITableView *)tableView
           trailingSwipeActionsForRowAtIndexPath:(NSIndexPath *)indexPath
                                         actions:(NSArray<UIContextualAction *> *)actions;
```

会话列表 cell 侧滑项回调示例（EaseIM APP 有效）

```objectivec
- (NSArray<UIContextualAction *> *)easeTableView:(UITableView *)tableView trailingSwipeActionsForRowAtIndexPath:(NSIndexPath *)indexPath actions:(NSArray<UIContextualAction *> *)actions
{
    NSMutableArray<UIContextualAction *> *array = [[NSMutableArray<UIContextualAction *> alloc]init];
    __weak typeof(self) weakself = self;
    UIContextualAction *deleteAction = [UIContextualAction contextualActionWithStyle:UIContextualActionStyleNormal
                                                                               title:@"删除"
                                                                             handler:^(UIContextualAction * _Nonnull action, __kindof UIView * _Nonnull sourceView, void (^ _Nonnull completionHandler)(BOOL))
    {
        //删除操作
    }];
    deleteAction.backgroundColor = [UIColor redColor];
    [array addObject:deleteAction];
    //返回的 actions 有序：删除，置顶
    [array addObject:actions[1]];
    return [array copy];
}
```

### 通讯录自定义功能扩展

#### 获取用户联系人资料

获取用户自己的联系人列表填充到 EaseIMKit 通讯录中

```objectivec
- (void)setContacts:(NSArray<EaseUserDelegate> * _Nonnull)contacts;
```

实例化 EaseContactsViewController 之后，可选择实现 EaseContactsViewControllerDelegate 协议（通讯录代理），接收 EaseContactsViewController 的回调并做进一步的自定义实现。

EaseConversationsViewControllerDelegate

#### 即将刷新通讯录填充数据

```objectivec
- (void)willBeginRefresh;
```

即将刷新通讯录填充数据示例（EaseIM APP 有效）：

```objectivec
- (void)willBeginRefresh {
    //从服务器获取当前登录账户的联系人列表
    [EMClient.sharedClient.contactManager getContactsFromServerWithCompletion:^(NSArray *aList, EMError *aError) {
        if (!aError) {
            self->_contacts = [aList mutableCopy];
            NSMutableArray<EaseUserDelegate> *contacts = [NSMutableArray<EaseUserDelegate> array];
            for (NSString *username in aList) {
                EMContactModel *model = [[EMContactModel alloc] init];
                model.huanXinId = username;
                [contacts addObject:model];
            }
            //填充联系人列表集合到 EaseIMKit 通讯录实例中
            [self->_contactsVC setContacts:contacts];
        }
        [self->_contactsVC endRefresh];
    }];
}
```

#### 通讯录自定义 cell

```objectivec
/*!
@method
@brief 获取通讯录自定义 cell
@discussion 返回 nil 显示默认 cell，否则显示用户自定义 cell
@param     tableView 当前消息视图的 tableView
@param     contact 当前所要展示 cell 所拥有的数据模型
@result 返回用户自定义 cell
*/
- (UITableViewCell *)easeTableView:(UITableView *)tableView cellForRowAtContactModel:(EaseContactModel *) contact;
```

#### 通讯录 cell 条目选中回调

```objectivec
/*!
@method
@brief 通讯录 cell 条目选中回调
@param     tableView 当前消息视图的 tableView
@param     contact 当前所选中 cell 所拥有的数据模型
@result 返回用户自定义 cell
*/
- (void)easeTableView:(UITableView *)tableView didSelectRowAtContactModel:(EaseContactModel *) contact;
```

通讯录 cell 条目选中回调示例：

```objectivec
- (void)easeTableView:(UITableView *)tableView didSelectRowAtContactModel:(EaseContactModel *)contact {
    //跳转加好友页
    if ([contact.easeId isEqualToString:@"newFriend"]) {
        EMInviteFriendViewController *controller = [[EMInviteFriendViewController alloc] init];
        [self.navigationController pushViewController:controller animated:YES];
        return;
    }
    //跳转群组列表页
    if ([contact.easeId isEqualToString:@"groupList"]) {
        [[NSNotificationCenter defaultCenter] postNotificationName:GROUP_LIST_PUSHVIEWCONTROLLER object:@{NOTIF_NAVICONTROLLER:self.navigationController}];
        return;
    }
    //跳转聊天室列表页
    if ([contact.easeId isEqualToString:@"chatroomList"]) {
        [[NSNotificationCenter defaultCenter] postNotificationName:CHATROOM_LIST_PUSHVIEWCONTROLLER object:@{NOTIF_NAVICONTROLLER:self.navigationController}];
        return;
    }
    //跳转好友个人资料页
    [self personData:contact.easeId];
}
```

#### 通讯录 cell 侧滑回调

```objectivec
/*!
 @method
 @brief 会话列表 cell 侧滑项回调
 @param     tableView 当前消息视图的 tableView
 @param     contact 当前所侧滑 cell 拥有的联系人数据
 @param     actions 返回侧滑项集合
 */
- (NSArray<UIContextualAction *> *)easeTableView:(UITableView *)tableView
        trailingSwipeActionsForRowAtContactModel:(EaseContactModel *) contact
                                         actions:(NSArray<UIContextualAction *> * __nullable)actions;
```

通讯录 cell 侧滑回调示例：

```objectivec
- (NSArray<UIContextualAction *> *)easeTableView:(UITableView *)tableView trailingSwipeActionsForRowAtContactModel:(EaseContactModel *)contact actions:(NSArray<UIContextualAction *> *)actions
{
    //通讯录头部非联系人列表禁止侧滑
    if ([contact.easeId isEqualToString:@"newFriend"] || [contact.easeId isEqualToString:@"groupList"] || [contact.easeId isEqualToString:@"chatroomList"]) {
        return nil;
    }
    __weak typeof(self) weakself = self;
    UIContextualAction *deleteAction = [UIContextualAction contextualActionWithStyle:UIContextualActionStyleDestructive
                                                                               title:@"删除"
                                                                             handler:^(UIContextualAction * _Nonnull action, __kindof UIView * _Nonnull sourceView, void (^ _Nonnull completionHandler)(BOOL))
    {
        //删除联系人操作
    }];
    return @[deleteAction];
}
```
