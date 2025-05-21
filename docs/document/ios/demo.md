# 环信即时通讯 IM iOS Demo 

环信即时通讯 IM iOS Demo 提供用户登录、单聊、群组、聊天室、子区、消息(文字、表情、语音、视频、图片、文件等)发送及管理、会话管理、好友管理、用户属性、用户在线状态（Presence）以及实时音视频通话等功能。

## 体验 Demo 

环信即时通讯 IM iOS 端提供示例应用可供体验。

1. [下载 Demo](https://www.easemob.com/download/demo)。
2. 输入你的手机号，获取验证码，然后输入。
3. 选择同意《环信服务条款》与《环信隐私协议》，然后点击 **登录** 登录 Demo。

![img](/images/demo/ios_login.png =350x650)

下面为部分 UI 界面的展示：

<ImageGallery :columns="2">
  <ImageItem src="/images/uikit/chatuikit/ios/main_chat.png" title="单聊页面" />
  <ImageItem src="/images/uikit/chatuikit/ios/main_chat_group.png" title="群聊页面" />
  <ImageItem src="/images/uikit/chatuikit/ios/main_conversation_list.png" title="会话列表" />
  <ImageItem src="/images/uikit/chatuikit/ios/main_contact_list.png" title="通讯录" />
</ImageGallery>

## 快速跑通 Demo

### 开发环境要求

- XCode 16.0 及以上版本
- Cocoapods 1.14.3及以上版本
- 运行的iOS系统版本为14.0及以上

### 跑通步骤

1. [创建应用](/product/enable_and_configure_IM.html)。 
2. [获取应用的 App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。
3. [创建用户](/product/enable_and_configure_IM.html#创建-im-用户)。
4. [下载即时通讯 IM Demo 项目源码](https://github.com/easemob/easemob-demo-ios)。
5. 下载完毕，打开 `EaseChatDemo` 目录，运行 `pod install`。
6. 打开 `EaseChatDemo/CustomConstants/PublicDefines.swift` 文件，修改文件中的占位符，`AppKey` 填入步骤 2 获取的 App Key，`ServerHost` 和 `CallKitAppId` 可以填入空字符串。
7. 使用 XCode 打开 `EaseChatDemo.xcworkspace`，编译运行项目。
8. 使用注册的用户 ID 和密码登录。

### App Server

为方便开发者快速体验即时通讯 IM 功能，跑通本工程 Demo 源码默认使用开发者注册的用户 ID 和密码直接登录，不需要依赖部署服务端 App Server。但是在此模式下，手机验证码、用户头像和 EaseCallKit 实时音视频等相关功能不可用，你可以通过部署 App Server 完整体验这些功能。

App Server 为 Demo 提供以下功能：

- 通过手机号获取验证码。
- 通过手机号和验证码返回环信用户 ID 和环信用户 Token。
- 上传头像并返回地址。
- 根据用户的信息生成 [EaseCallKit](https://doc.easemob.com/document/ios/easecallkit.html) 登录所需的 Token。
- 获取音视频通话时环信用户 ID 和 Agora UID 的映射关系。

你通过以下步骤部署 App Server：

1. 部署 App Server。详见 [服务端源码](https://github.com/easemob/easemob-im-app-server/tree/dev-demo)。  
2. 在 Demo 工程目录下 `EaseChatDemo/CustomConstants/PublicDefines.swift` 文件中，填写 App Server 的域名或 IP 地址。
3. 在 Demo 工程根目录下 `EaseChatDemo/CustomConstants/PublicDefines.swift` 文件中，填写声网AppId。

**服务端中的 App Key 要跟客户端的 App Key 保持一致。**

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
