# 快速开始

<Toc />

利用环信单群聊 UIKit，你可以轻松实现单群和群聊。本文介绍如何快速实现在单聊会话中发送第一条消息。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- Xcode：推荐最新版本。
- 安装 iOS 13.0 或以上版本的 iOS 模拟器或 Apple 设备。
- CocoaPods 已经安装并且已跑通了集成。
- 已在[环信即时通讯云控制台](https://console.easemob.com/user/login)创建了有效的环信即时通讯 IM 开发者账号，并[获取了 App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。
- 如果你的网络环境部署了防火墙，请联系环信技术支持设置白名单。

## 实现发送第一条单聊消息

### 第一步 创建项目

[在 Xcode 中创建一个 iOS 平台下的 App](https://developer.apple.com/cn/documentation/xcode/creating_an_xcode_project_for_an_app/)。在 **Choose options for your new project** 对话框中进行以下设置：

- **Product Name**：填入 **EaseChatUIKitQuickStart**。
- **Organization Identifier**：设置为你的标识符。
- **User Interface**：选择 **Storyboard**。
- **Language**：选择你常用的开发语言。

### 第二步 初始化

你可以在应用加载时或使用 EaseChatUIKit 之前对其进行初始化。

初始化时，需传入 App Key。你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**应用详情**页面查看 App Key。

```
import EaseChatUIKit
    
@UIApplicationMain
class AppDelegate：UIResponder，UIApplicationDelegate {

     var window：UIWindow？


     func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
         let error = EaseChatUIKitClient.shared.setup（appkey: "Appkey"）
     }
}
```

### 第三步 登录

使用用户 ID 和用户 token 登录 EaseChatUIKit。

:::tip
若你已集成了 IM SDK，SDK 的所有用户 ID 均可用于登录 EaseChatUIKit。
:::

为了方便快速体验，你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**应用概览** > **用户认证**页面创建用户并查看用户 token。**用户认证**页面中的用户仅用于快速体验或调试目的。

在开发环境中，你需要在环信控制台[创建 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)，从你的 App Server 获取用户 token，详见[使用环信用户 token 鉴权](/product/easemob_user_token.html)。

```
public final class YourAppUser: NSObject, EaseProfileProtocol {

            public func toJsonObject() -> Dictionary<String, Any>? {
        ["ease_chat_uikit_info":["nickname":self.nickname,"avatarURL":self.avatarURL,"userId":self.id]]
    }
    
    
    public var id: String = ""
        
    public var nickname: String = ""
        
    public var selected: Bool = false
    
    public override func setValue(_ value: Any?, forUndefinedKey key: String) {
        
    }

    public var avatarURL: String = "https://accktvpic.oss-cn-beijing.aliyuncs.com/pic/sample_avatar/sample_avatar_1.png"

}
// 使用当前用户对象符合 `EaseProfileProtocol` 协议的用户信息登录 EaseChatUIKit。
 EaseChatUIKitClient.shared.login(user: YourAppUser(), token: ExampleRequiredConfig.chatToken) { error in 
 }
```

### 第四步 创建聊天页面

1. 在控制台[关闭好友关系检查功能](/product/enable_and_configure_IM.html#好友关系检查)，即无需添加好友即可聊天。
2. 调用 `init` 方法将在控制台上创建的用户的用户 ID 传入 `conversationId` 参数，向该用户发送消息。

```Swift
let vc = ComponentsRegister.shared.MessageViewController.init(conversationId: <#创建用户的id#>, chatType: .chat)
//或者 push 或者 present 都可
 ControllerStack.toDestination(vc: vc)
```

### 第五步 发送第一条消息

在聊天页面下方输入消息，然后点击**发送**按钮发送消息。

![img](@static/images/uikit/chatuikit/ios/message_first.png) 

