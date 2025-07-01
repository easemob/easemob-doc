# 环信即时通讯 IM iOS 快速开始

<Toc />

本文介绍如何快速集成环信即时通讯 IM iOS SDK 实现单聊。

## 实现原理

下图展示在客户端发送和接收一对一文本消息的工作流程。

![img](/images/android/sendandreceivemsg.png)

## 前提条件

- Xcode (推荐最新版本)。
- 安装 iOS 10.0 或以上版本的 iOS 模拟器或 Apple 设备。
- CocoaPods [1.10.1 或以上版本](https://cocoapods.org/)。
- 有效的环信即时通讯 IM 开发者账号和 App Key，详见 [环信控制台文档](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。
- 如果你的网络环境部署了防火墙，请联系环信技术支持设置白名单。

## 1. 准备开发环境

### 创建 Xcode 项目

参考以下步骤在 Xcode 中创建一个 iOS 平台下的 App，项目设置如下：

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

 target 'HyphenateChatQuickstart' do
     pod 'HyphenateChat'
 end
```

3. 运行 `pod update` 命令更新本地库版本。
4. 运行 `pod install` 命令安装 HyphenateChat SDK。成功安装后，**Terminal** 中会显示 `Pod installation complete!`，此时项目文件夹下会生成一个 **workspace** 文件。

国内开发者如果遇到网络问题导致 pod 命令无法执行，可使用国内镜像源，例如 [Gitee 镜像源](https://gitee.com/mirrors/CocoaPods-Specs) 或 [TUNA 镜像源](https://mirrors.tuna.tsinghua.edu.cn/help/CocoaPods/)。

### 方法二：手动导入 SDK v3.8.9.1 及以上版本

1. 下载最新版的 [HyphenateChat iOS SDK](https://www.easemob.com/download/im) 并解压。
2. 复制 SDK 包中的 `HyphenateChat.framework` 至项目路径下。
3. 打开 Xcode，进入 **TARGETS > Project Name > General > Frameworks, Libraries, and Embedded Content**菜单。
4. 点击 **+ > Add Other… > Add Files** 添加对应动态库，并确保添加的动态库 **Embed** 属性设置为 **Embed & Sign**。

添加完成后，项目会自动链接所需系统库。

## 3. 初始化 SDK

导入SDK头文件
```
#import <HyphenateChat/HyphenateChat.h>
```

在工程的 AppDelegate 中的以下方法中，调用 SDK 对应方法。

```objectivec
(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    // appkey 替换成你在环信控制台注册应用中的 App Key
    EMOptions *options = [EMOptions optionsWithAppkey:@"<#appkey#>"];
    // apnsCertName是证书名称，可以先传 nil，等后期配置 APNs 推送时在传入证书名称
    options.apnsCertName = nil;
    [[EMClient sharedClient] initializeSDKWithOptions:options];
    return YES;
}
```

## 4. 创建账号

在 [环信控制台](https://console.easemob.com/user/login) 创建用户，获取用户 ID 和用户 token。详见 [创建用户文档](/product/enable_and_configure_IM.html#创建-im-用户)。

在生产环境中，为了安全考虑，你需要在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，使你的用户从你的应用服务器获取 Token。

## 5. 登录账号

利用创建的用户名和token登录环信 IM。

```objectivec
[[EMClient sharedClient] loginWithUsername:@"username"
                                     token:@"your token"
                                   completion:^(NSString *aUsername, EMError *aError) {

}];
```

## 6. 发送消息

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

## 常见问题

### 集成问题

由于 Crash 上报使用了 `aosl.xcframework` 库，如果同时集成了 `HyphenateChat 4.11.0` 和 `AgoraRtcEngine_iOS 4.3.0-4.4.1` 的版本，会有 AOSL 库冲突的问题，执行 `pod install` 时会出现如下报错：

```
[!] The 'Pods-EaseChatDemo' target has frameworks with conflicting names: aosl.xcframework.
```

要修复该问题，需要修改 `Podfile` 文件，添加如下脚本：

```ruby
pre_install do |installer|
  # 定义 AgoraRtcEngine_iOS framework 的路径
  rtc_pod_path = File.join(installer.sandbox.root, 'AgoraRtcEngine_iOS')

  # aosl.xcframework 的完整路径
  aosl_xcframework_path = File.join(rtc_pod_path, 'aosl.xcframework')

  # 检查文件是否存在，如果存在则删除
  if File.exist?(aosl_xcframework_path)
    puts "Deleting aosl.xcframework from #{aosl_xcframework_path}"
    FileUtils.rm_rf(aosl_xcframework_path)
  else
    puts "aosl.xcframework not found, skipping deletion."
  end
end
```

然后重新执行 `pod install`。

如欲了解详情，请参见 [声网官网文档](https://doc.shengwang.cn/faq/integration-issues/rtm2-rtc-integration-issue)。

### 模拟器运行报错

当你使用 Xcode 15 创建新工程时，编译时若出现 **Sandbox: rsync.samba(47334) deny(1) file-write-create...** 报错，你需要在 **Target > Build Settings** 中查找 **User Script Sandboxing** 选项，设置为 **NO**。

![img](/images/ios/quickstart_emulator_error.png)


![img](/images/ios/quickstart_error_solve.png)

