# 环信即时通讯 IM iOS 快速开始

<Toc />

本文介绍如何快速集成环信即时通讯 IM iOS SDK 实现单聊。

## 实现原理

下图展示在客户端发送和接收一对一文本消息的工作流程。

![img](@static/images/android/sendandreceivemsg.png)

## 前提条件

- Xcode (推荐最新版本)。
- 安装 iOS 10.0 或更高版本的 iOS 模拟器或 Apple 设备。
- CocoaPods [1.10.1 或更高版本](https://cocoapods.org/)。
- 有效的环信即时通讯 IM 开发者账号和 App Key，见 [环信即时通讯云管理后台](https://console.easemob.com/user/login)。
- 如果你的网络环境部署了防火墙，请联系环信技术支持设置白名单。

## 1. 准备开发环境

### 创建 Xcode 项目

参考以下步骤在 Xcode 中创建一个 iOS 平台下的 Single View App，项目设置如下：

- **Product Name** 设为 `HyphenateChatQuickstart`。
- **Organization Identifier** 设为 `hyphenatechat`。
- **User Interface** 选择 **Storyboard**。
- **Language** 选择 **Objective-C**。

## 2. 集成 SDK

SDK 支持 **CocoaPods 导入**和**手动导入**两种方式。

### 方法一：使用 CocoaPods 集成 SDK。

1. 在 **Terminal** 里进入项目根目录，并运行 `pod init` 命令。项目文件夹下会生成一个 **Podfile** 文本文件。
2. 打开 **Podfile** 文件，修改文件为如下内容：

```pod
# platform :ios, '10.0'

 target 'EMChatQuickstart' do
     pod 'HyphenateChat'
 end
```

3. 运行 `pod update` 命令更新本地库版本。
4. 运行 `pod install` 命令安装 HyphenateChat SDK。成功安装后，**Terminal** 中会显示 `Pod installation complete!`，此时项目文件夹下会生成一个 **workspace** 文件。

国内开发者如果遇到网络问题导致 pod 命令无法执行，可使用国内镜像源，例如 [Gitee 镜像源](https://gitee.com/mirrors/CocoaPods-Specs) 或 [TUNA 镜像源](https://mirrors.tuna.tsinghua.edu.cn/help/CocoaPods/)。

### 方法二：手动导入 SDK v3.8.9.1 及以上版本

1. 下载最新版的 [HyphenateChat iOS SDK](https://downloadsdk.easemob.com/downloads/iOS_IM_SDK_V3.8.9.1.zip) 并解压。
2. 复制 SDK 包中的 `HyphenateChat.framework` 至项目路径下。
3. 打开 Xcode，进入 **TARGETS > Project Name > General > Frameworks, Libraries, and Embedded Content**菜单。
4. 点击 **+ > Add Other… > Add Files** 添加对应动态库，并确保添加的动态库 **Embed** 属性设置为 **Embed & Sign**。

添加完成后，项目会自动链接所需系统库。

## 3.初始化 SDK

在工程的 AppDelegate 中的以下方法中，调用 SDK 对应方法。

```objectivec
(BOOL)application:(UIApplication *)applicationdidFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    // appkey 替换成你在环信即时通讯 IM 管理后台注册应用中的 App Key
    EMOptions *options = [EMOptions optionsWithAppkey:@"<#appkey#>"];
    // apnsCertName是证书名称，可以先传 nil，等后期配置 APNs 推送时在传入证书名称
    options.apnsCertName = nil;
    [[EMClient sharedClient] initializeSDKWithOptions:options];
    return YES;
}
```

## 4.初始化聊天页面

向工程中导入 Chat 文件。

```objectivec
// ConversationId 接收消息方的环信ID:@"user2"
// type 聊天类型:EMConversationTypeChat    单聊类型
// createIfNotExist 如果会话不存在是否创建会话：YES
 EMChatViewController *chatViewController = [[EMChatViewController alloc] initWithConversationId:@"user2" conversationType:EMConversationTypeChat];
    [self.navigationController pushViewController:chatViewController animated:YES];
```

有导航的话，可以用 push 方式跳转到聊天页面发消息测试，也就是用登录的 user1 给 user2 发消息，没有导航的话，可以用 present 方式跳转到聊天页面。

## 5.创建账号

设置用户名和密码创建账号。

```objectivec
// 异步方法
[[EMClient sharedClient] registerWithUsername:@"username"
                                         password:@"your password"
                                       completion:^(NSString *aUsername, EMError *aError) {
                                   }];
```

## 6. 登录账号

利用创建的用户名和密码登录环信 IM。

```objectivec
[[EMClient sharedClient] loginWithUsername:@"username"
                                     password:@"your password"
                                   completion:^(NSString *aUsername, EMError *aError) {

}];
```

## 7.发送消息

利用创建的用户名和密码登录环信 IM，向对端用户发送消息。在下面示例中，向 user 2 发送文本消息。

```objectivec
// 创建消息
EMTextMessageBody* textBody = [[EMTextMessageBody alloc] initWithText:@"hello"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:@"user2"
                                                              from:@"user1"
                                                                to:@"user2"
                                                              body:textBody
                                                               ext:@{}];
// 发送消息
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {}];
```
