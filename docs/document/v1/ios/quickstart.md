# iOS SDK 快速集成

在您阅读此文档时，我们假定您已经具备了基础的 iOS 应用开发经验，并能够理解相关基础概念，最新版本的 SDK 只支持 **iOS 10** 及以上 iOS 系统版本。


`特殊提示：如果使用的是 xcode11 打包，那么需要先将环信 SDK 内的模拟器框架去掉，否则会报 “IPA processing failed” 的错误。` （如何剔除 SDK 内的模拟器框架，见 iOS SDK 快速集成中的'集成动态库上传 AppStore'）


## DEMO 体验

[EaseIM 源码地址](https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/iOS_IM_SDK_V3.7.4.7.zip)



## 注册并创建应用

注册环信开发者账号并创建后台应用

详细操作步骤见[开发者注册及管理后台](/document/v1/privatization/uc_configure.html#创建应用)。

Appkey：一个 APP 的唯一标识

IM 用户：一个 Appkey 下的唯一标识用户，用来登录环信服务器进行收发消息的用户。 可以在创建好的应用内注册两个 IM 用户(也可以称为环信 ID)，例如： 账号：user1，密码：123 ； 账号：user2，密码：123，用来通过 SDK 登录环信服务器，收发消息测试。

在环信 Console 后台，点击创建好的应用 → IM 用户 → [创建 IM 用户](/document/v1/privatization/uc_configure.html#用户管理)，建议创建两个 IM 用户，用于后面集成 SDK 之后聊天使用。例如登录 user1 ，在初始化聊天页面时传入 user2 ，user1 给 user2 发消息测试。


![img](@static/images/privitization/deploy_user_manage.png)




## iOS SDK 介绍

环信 SDK 为用户开发 IM 相关的应用提供的一套完善的开发框架。包括以下几个部分：

![img](@static/images/privitization/image006.png)

- SDK_Core: 为核心的消息同步协议实现，完成与服务器之间的信息交换。

- SDK: 是基于核心协议实现的完整的 IM 功能，实现了不同类型消息的收发、会话管理、群组、好友、聊天室等功能。

- UI：[见集成 UI](#集成-ui)

用户可以基于我们提供的 Demo 实现自己的应用，也可以基于 SDK 开发自己应用。

SDK 采用模块化设计，每一模块的功能相对独立和完善，用户可以根据自己的需求选择使用下面的模块：

![img](@static/images/privitization/image005.png)

- EMClient: 是 SDK 的入口，主要完成登录、退出、连接管理等功能。也是获取其他模块的入口。

- EMChatManager: 管理消息的收发，完成会话管理等功能。

- EMContactManager: 负责好友的添加删除，黑名单的管理。

- EMGroupManager: 负责群组的管理，创建、删除群组，管理群组成员等功能。

- EMChatroomManager: 负责聊天室的管理。



## 集成 SDK

环信 SDK 支持 **pod 方式导入**，**手动导入**两种方式任选其一即可，下面分别介绍两种导入方式。

:::notice
从 3.6.0 版本开始，SDK 只支持 iOS 9.0 及以上版本。
:::

### Pod 导入 SDK

推荐使用 `Cocoapods` 集成环信 SDK。 Cocoapods 提供了一个简单的依赖管理系统，避免手动导入产生的错误（首先需要确认已经安装了 Cocoapods，如果没有安装过 Cocoapods，参考安装使用指南：https://www.cnblogs.com/wangluochong/p/5567082.html）。

```
sudo gem install cocoapods
pod setup
```

在 `Xcode` 项目的根目录下，新建一个空文件，命名为 `Podfile`，向此文件添加以下行：

```
pod 'HyphenateChat'
```

在 `Podfile` 目录下，执行以下指令：

```
pod install --repo-update 
```

执行完 pod install，打开工程目录，找到 .xcworkspace 文件运行即可。

------

### 手动导入 SDK

[下载环信demo](https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/iOS_IM_SDK_V3.7.4.7.zip)

- HyphenateChat 开发使用 SDK

开发者最开始集成，如果选择手动导入文件集成的方式，只需要向工程中添 `HyphenateChat` 就可以，下面会介绍具体的集成方式。

demo 中的 SDK 文件夹为 Hyphenate SDK，将 SDK 文件夹拖入到工程中，并勾选截图中标注的三项。

![img](@static/images/privitization/choice.png)

#### 设置工程属性

Xcode 中，向 General → Embedded Binaries 中添加依赖库。

**注意要将 'Do Not Embed' 改成 'Embed & Sign'** 

![img](@static/images/privitization/prepare1.png)



### Demo 目录介绍

目录 EaseIM —>Class 中的 Demo 目录介绍


![img](@static/images/privitization/prepare2.png)


- Account：主要是 demo 的注册，登录

- AppDelegate：主要是 demo 中初始化环信 SDK，注册推送等

- Communicate：demo 的语音视频通话功能页面（包含 1v1 实时通话以及多人实时通话的功能）

- Chat：demo 的聊天功能页面

- Contact：demo 的好友功能页面

- Conversation：demo 的会话列表功能页面

- EaseIMHelper：demo 的单例类，主要是全局监听接收消息，好友，群组，聊天室等相关事件的回调，从而进行对应的处理

- Group：demo 的群组功能页面

- Helper：demo 的功能性文件，全局通用的配置

- Home：demo 的根控制器页面

- Notification：demo 的好友，群组相关请求通知的页面

- Settings：demo 的功能设置页面



## 集成 UI

环信的 UI 模块在 demo 中的该路径下 EaseIM—Class

demo 中有几大 UI 功能模块，在集成时将对应的模块添加到工程中即可。

- Helper——自定义库和页面，第三方库，全局通用模块

- Chat——聊天模块

- Conversation——会话列表模块

- Communicate——实时音视频模块（包含 1v1 实时通话以及多人实时通话的功能）

- Contact——好友列表模块

- Group——群组模块

- Chatroom——聊天室模块

在集成时，必须要先向自己的工程中导入 `Helper` 模块，然后在根据自己的需求导入其他模块。

环信的 UI 模块依赖于以下三方库：

- Masonry

- MJRefresh

- MBProgressHUD

- SDWebImage

- FLAnimatedImage

保证这些三方库在自己的工程中存在。

**注意**：三方推荐使用 pod 方式导入，手动导入需要修改 `info.plist` 重复等报错。



## 增加隐私权限

在工程`info.plist`文件中增加隐私权限

用于 Chat 聊天模块中发送图片，语音，视频，位置消息使用，如您的工程中已经添加过请忽略：

- Privacy - Photo Library Usage Description 需要访问您的相册

- Privacy - Microphone Usage Description 需要访问您的麦克风

- Privacy - Camera Usage Description 需要访问您的摄像机

- Privacy - Location Always Usage Description 需要您的同意,才能始终访问位置



## 添加 SDK 以及 UI 头文件

建议在 `PCH` 文件中引入 SDK 以及 UI 的头文件。如果工程中没有 `pch` 文件，需要新建一个，并在 `Build Settings` 中设置 `Prefix Header` 为该 pch 文件，例如：`iOS/PrefixHeader.pch`。

在 pch 文件文件中添加如下代码：

```
#ifdef __OBJC__
#import <HyphenateChat/HyphenateChat.h>
// UI 头文件
#import "EMHeaders.h"
#endif
```

如果自己工程中的 pch 文件还引入了其他的头文件，那么所有的头文件都需要放到。

```
#ifdef __OBJC__

// 存放 pch 文件中所有的头文件

#endif 的内部
```


## 初始化及登录

初始化 SDK 以及登录环信服务器

### 初始化 SDK

在工程的 `AppDelegate` 中的以下方法中，调用 SDK 对应方法。

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Appkey 替换成自己在环信管理后台注册应用中的 Appkey
EMOptions *options = [EMOptions optionsWithAppkey:@"appkey"];
// apnsCertName是证书名称，可以先传nil，等后期配置apns推送时在传入证书名称
    options.apnsCertName = nil;
    [[EMClient sharedClient] initializeSDKWithOptions:options];
    return YES;
}
```

### 登录环信服务器

建议使用异步登录方法，防止网络不好的情况下，出现卡 UI 主线程的情况出现。

```
// 传入在应用（appkey）下注册的IM用户user1，密码123，用于登录环信服务器

[[EMClient sharedClient] loginWithUsername:@"user1" password:@"123" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"登录成功");
    } else {
        NSLog(@"登录失败的原因---%@", aError.errorDescription);
    }
}];
```

- 如果在集成调试阶段，可以在初始化环信 SDK 完成之后，就调用登录方法。

- 如果项目上线，建议开发者在登录自己服务器成功之后，再调用环信 SDK 登录方法使用用户绑定的环信 ID 登录环信服务器（开发者给自己用户在自己服务器创建账号的同时，调用环信的 REST 接口在给用户授权注册一个环信 ID，一起返回给 App 端，App 端拿到用户的账号密码以及环信 ID 密码分别登录自己的服务器以及环信服务器）。


## 初始化聊天页面

向工程中导入 `Chat` 文件

```
// ConversationId 接收消息方的环信 ID:@"user2"
// type 聊天类型:EMConversationTypeChat    单聊类型
// createIfNotExist 如果会话不存在是否创建会话：YES
EMChatViewController *chatController = [[EMChatViewController alloc] initWithConversationId:@"user2" conversationType:EMConversationTypeChat createIfNotExist:YES];

[self.navigationController pushViewController:chatController animated:YES];
```

有导航的话，可以用 `push` 方式跳转到聊天页面发消息测试，也就是用登录的 user1 给 user2 发消息，没有导航的话，可以用 `present` 方式跳转到聊天页面。


## 集成实时音视频通话

向工程中导入 `Communicate` 文件

在初始化 SDK 完成之后，在初始化SDK所在的类引入头文件：

```
#import "SingleCallController.h"  // 1v1 实时通话功能的头文件
#import "ConferenceController.h"  // 多人实时通话功能的头文件
 添加：
[SingleCallController sharedManager];  // 初始化 1v1 实时通话功能的单例
[ConferenceController sharedManager];  // 初始化多人实时通话功能的单例
```

在聊天页面中下方，点击视频通话图标按钮即可使用。



## 集成其他模块

集成这些模块，涉及到一些回调方法的监听与页面的跳转，需要在初始化环信 SDK 之后，添加 [EMDemoHelper shareHelper];

### 会话列表

向工程中导入 `Conversation` 文件

头文件：`#import “EMConversationsViewController.h”`

初始化页面跳转(导航跳转示例)：

```
EMConversationsViewController *conversationVC = [[EMConversationsViewController alloc] init];
[self.navigationController pushViewController:conversationVC animated:YES];
```

### 好友列表

向工程中导入 `Contact` 文件

头文件：`#import “EMContactsViewController.h”`

初始化页面跳转(导航跳转示例)：

```
EMContactsViewController *contactVC= [[EMContactsViewController alloc] init];
[self.navigationController pushViewController:contactVC animated:YES];
```

### 群组

向工程中导入 `Group` 文件

头文件：`#import “EMGroupsViewController.h”`

初始化页面跳转(导航跳转示例)：

```
EMGroupsViewController *groupVC= [[EMContactsViewController alloc] init];
[self.navigationController pushViewController:groupVC animated:YES];
```

### 聊天室

向工程中导入 `Chatroom` 文件

头文件：`#import “EMChatroomsViewController.h”`

初始化页面跳转(导航跳转示例)：

```
EMChatroomsViewController *chatRoomVC= [[EMChatroomsViewController alloc] init];
[self.navigationController pushViewController:chatRoomVC animated:YES];
```

------

## 集成动态库上传 AppStore

从 3.7.4 版本 SDK 开始支持 bitcode 打包，并且不再支持 armv7,i386 指令集，打包时需去除 armv7 指令。
Xcode11 需在 Build Settings - Valid Architectures 设置项去除 armv7 指令；
Xcode12 需在 Build Settings - Excluded Architectures 设置项添加 armv7 指令，若是 iOS11 以上无需此操作；

由于 iOS 编译的特殊性，为了方便开发者使用，我们将 `x86_64`,`arm64` 两个平台都合并到了一起，所以使用动态库上传 AppStore 时需要将 `x86_64` 平台删除后，才能正常提交审核。

首先将 SDK 进行备份。因为剔除过 SDK 的项目只能真机运行，要想继续模拟器运行，要换回未剔除的 SDK。

然后进入到 Launchpad 中，找到其他—打开终端，然后 cd 到 SDK 的所在目录。
简单的方式就是找到项目中的环信 SDK，然后终端先输入 cd，然后按空格键，将环信 SDK 拖拽到终端内，会自动生成SDK的路径，然后环信 SDK 名称 .framework 删除掉，不要 cd 到环信 SDK，只 cd 到 SDK 所在的目录下即可。
示例：
比如环信 SDK 的路径是
/Users/easemob-dn0164/Desktop/iOS_IM_SDK_V3.6.0/HyphenateFullSDK/Hyphenate.framework
那么只需要 cd 到
/Users/easemob-dn0164/Desktop/iOS_IM_SDK_V3.6.0/HyphenateFullSDK/
就可以了。

后续在 SDK 当前路径下执行以下命令删除 x86_64 平台
实时音视频版本`Hyphenate.framework`

```
【首先进入Hyphenate.framework所在目录】
// 移除支持 x86_64 的二进制文件
lipo Hyphenate.framework/Hyphenate -remove x86_64 -output Hyphenate
//替换framwork内部二进制文件
mv Hyphenate Hyphenate.framework/Hyphenate
//查看剥离后的二进制文件支持的CPU架构，如果显示 arm64，就完成剥离，可上传AppStore
lipo -info Hyphenate.framework/Hyphenate
```

不包含实时音视频版本 `HyphenateLite.framework`

```
【首先进入HyphenateLite.framework所在目录】
// 移除支持 x86_64 的二进制文件
lipo HyphenateLite.framework/HyphenateLite -remove x86_64 -output HyphenateLite
//替换 framwork 内部二进制文件[记得备份]
mv HyphenateLite HyphenateLite.framework/HyphenateLite
//查看剥离后的二进制文件支持的CPU架构，如果显示 arm64，就完成剥离，可上传 AppStore
lipo -info HyphenateLite.framework/HyphenateLite
```