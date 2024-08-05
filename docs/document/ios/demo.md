# Demo（EaseIM App）介绍

<Toc />

环信即时通讯 IM iOS 端提供示例应用可供体验。

1. [下载 Demo](https://www.easemob.com/download/demo)。

2. 输入你的手机号，获取验证码，然后输入。

3. 选择同意《环信服务条款》与《环信隐私协议》，然后点击 **登录** 登录 Demo。

![img](/images/demo/ios_login.png =350x750)

## 代码下载

您可以通过以下两种方式获取到源代码：

- 下载代码压缩包：[IM SDK 及 Demo 下载](https://www.easemob.com/download/im)
- 下载源代码：[github 源码地址](https://github.com/easemob/chat-ios/tree/SwiftDemo)

## 运行 EaseChatDemo 工程

从 [IM SDK 及 Demo 下载](https://www.easemob.com/download/im) 下载 iOS SDK 压缩包，然后解压。解压后在 `EaseChatDemo` 文件夹下，即为 `EaseChatDemo` 的工程目录。

终端 cd 到 EaseChatDemo 的 `podfile` 目录下，终端执行 `pod install` 命令，等待下载完所有的 pod 依赖库，即可打开 `EaseChatDemo.xcworkspace`，运行 EaseIM demo 进行自定义再次开发。

## 使用到的 pod 库

- 环信IM SDK pod 'HyphenateChat'
- 环信 IM UI 库 pod 'EaseChatUIKit'
- 环信音视频 UI 库 pod 'EaseCallKit'
- 声网音视频 SDK pod 'AgoraRtcEngine_iOS'

三方库包含：

```
- Swift JSON 解析库 pod 'KakaJSON'
- 封装FFDB的便捷化数据库 pod 'SwiftFFDBHotFix'
```

## 主要模块介绍

Demo 中有几大 UI 功能模块，在集成时将对应的模块添加到工程中即可。

- Utils——工具类。
- Main——主界面模块 包含 Provider 实现 以及 1v1 实时通话以及多人实时通话的功能。
- LoginViewController——登录模块 EaseChatUIKit 在 Demo 中的登录应用。
- AppDelegate&SceneDelegate——EaseChatUIKit 在 Demo 中初始化以及配置项、继承注册等应用。
- CustomConstants——自定义常量模块，主要包含需要用户填入的 AppKey 以及 ServerHost。
- IntegratedFromEaseChatUIKit——继承 EaseChatUIKit 中的类并进行二次自定义开发相关的类模块。
- Me——个人信息以及 EaseChatUIKit 相关配置项及其如何生效示例。

## 主要类介绍

- **MainViewController**：此页面中包含了包含 Provider 实现 以及 1v1 实时通话以及多人实时通话的功能的初始化与回调处理。
- **MineMessageListViewController&MineContactDetailViewController&MineGroupDetailViewController**：中 `EaseCallManager.shared()` 是如何发起音视频通话的示例代码。
- **DemoLanguage**：Demo 层语言偏好设置切换。
- **MineMessageListViewController**：Demo 中聊天页面。
- **EasemobBusinessRequest**：实现了 RESTful 的几种基本业务请求工具类，可以根据请求时需要返回参数类型来返回对应模型无需用户解析但是依赖第三方解析库 `Kakajson`，也有只返回 Dictionary 的请求方法，便于用户使用。
- **Appdelegate&NotificationService**：推送相关设置。

## 部分 UI 展示

![img](/images/demo/ios_contact.png)

![img](/images/demo/ios_chat.png)
