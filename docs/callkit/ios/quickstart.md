# 快速开始

利用环信 CallKit，你可以轻松实现一对一通话和群组通话功能。本文介绍如何快速实现发起音视频通话。

## 开发环境要求

- Xcode 16.0 及以上版本 
- 最低支持系统版本：iOS 15.0
- 已为你的项目设置有效的开发者签名
- CocoaPods v1.14.3 及以上版本

## 前提条件 

在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
1. [注册环信账号](/product/console/account_register.html#注册账号)。
2. [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
3. [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID。
4. [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID。将用户加入群组。
5. [开通音视频服务](product_activation.html)。
   
## 快速开始

### 步骤 1 创建项目

参考以下步骤在 Xcode 中创建一个 iOS 平台下的 App，项目设置如下：

- **Product Name** 设为 **EaseCallUIKitQuickStart**。
- **Organization Identifier** 设为你的 **identifier**。
- **User Interface** 选择 **Storyboard**。
- **Language** 选择你的常用开发语言。
- 添加权限：在项目 `info.plist` 中添加权限：

```
Privacy - Photo Library Usage Description //相册权限  
Privacy - Microphone Usage Description //麦克风权限
Privacy - Camera Usage Description //相机权限
```

### 步骤 2 初始化 EaseCallUIKit  // TODO：Android 用的是 CallKit，需要统一

你可以在应用程序加载时或使用前初始化 EaseCallUIKit：
1. 初始化 IM SDK。CallKit 基于即时通讯 IM 作为信令通道，因此需先初始化 IM SDK。
   - 填入你的应用的 App Key。
   - 设置即时通讯 IM SDK 中的一些选项（`EMOptions` 类），例如，开启 Console 日志和是否自动登录。建议开启自动登录，可参考 [IM Demo 源码](https://github.com/easemob/easemob-demo-ios)。
2. 初始化 CallKit。你可以自定义铃声和通话超时时间。

在整个应用生命周期中，初始化一次即可。

```Swift
import EaseCallUIKit

@UIApplicationMain
class AppDelegate：UIResponder，UIApplicationDelegate {

     var window: UIWindow？

     func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        let option = ChatSDKOptions(appkey: AppKey)//首先需要登录SDK
        option.enableConsoleLog = true//开启日志
        option.isAutoLogin = false//此处只是示例项目，使用时请参考环信 Demo 源码，自动登录更方便。
        ChatClient.shared().initializeSDK(with: option)//初始化 IM SDK
        CallKitManager.shared.setup()//初始化 EaseCallUIKit
     }
}
```

### 步骤 3 登录 IM SDK

调用即时通讯 IM SDK 的 `login` 方法传入用户 ID 和 Token 登录 IM。

如有需要，也可透传用户头像和昵称。// TODO：有问题吗？

``` Swift
        ChatClient.shared().login(withUsername: userId, token: token) { [weak self] userId,error  in
            if let error = error {
                self?.showCallToast(toast: "Login failed: \(error.errorDescription ?? "")")
            } else {
                self?.showCallToast(toast: "Login successful")
//if !userId.isEmpty { //如有需要透传头像昵称请打开
//    let profile = CallUserProfile()
//    profile.id = userId
//    profile.avatarURL = "https://xxxxx"
//    profile.nickname = "\(userId)昵称"
//    CallKitManager.shared.currentUserInfo = profile
//}
                self?.userIdField.isHidden = true
                self?.tokenField.isHidden = true
                self?.loginButton.isHidden = true 
            }
        }
```

### 步骤 5 发起首次通话

在呼叫页面添加呼叫按钮和输入框：
- 一对一音视频通话：输入对方用户 ID，点击呼叫按钮。
- 群组通话：输入群组 ID，点击呼叫按钮。

```Swift
        // 在Console中创建一个新用户，新用户使用一样的快速开始工程登录后，将这个用id复制后传入下面构造方法参数中，跳转页面即可。
        func callAction(type: CallType) {
                
            guard let input = inputField.text?.trimmingCharacters(in: .whitespacesAndNewlines), !input.isEmpty else {
                self.showCallToast(toast: "Please enter a valid username or group id")
                return
            }
            if type != .groupCall {
                CallKitManager.shared.call(with: input, type: type)
            } else {
                CallKitManager.shared.groupCall(groupId: input)
            }
        }

```
