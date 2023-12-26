# 快速开始

利用 ChatroomUIKit，你可以轻松实现聊天室内的用户交互。本文介绍如何实现在聊天室中发送消息。

## 前提条件

- Xcode (推荐最新版本)。
- 安装 iOS 13.0 或更高版本的 iOS 模拟器或 Apple 设备。
- 已使用 CocoaPods 添加了 ChatroomUIKit 依赖项。
- 有效的环信即时通讯 IM 开发者账号和 App Key，详见 [环信即时通讯云控制台](https://console.easemob.com/user/login)。
- 如果你的网络环境部署了防火墙，请联系环信技术支持设置白名单。

## 创建项目

[在 Xcode 中创建一个 iOS 平台下的 App](https://developer.apple.com/cn/documentation/xcode/creating_an_xcode_project_for_an_app/)。在 **Choose options for your new project** 对话框中进行以下设置：

- **Product Name**：填入 **ChatroomUIKitQuickStart**。
- **Organization Identifier**：设置为你的标识符。
- **User Interface**：选择 **Storyboard**。
- **Language**：选择你常用的开发语言。

## 操作流程

### 第一步 初始化 ChatroomUIKit

你可以在应用加载时或使用 ChatroomUIKit 之前对其进行初始化。

初始化时，需传入 App Key。你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**应用详情**页面查看 App Key。

```swift    
import ChatroomUIKit
    
@UIApplicationMain
class AppDelegate：UIResponder，UIApplicationDelegate {
     var window：UIWindow？
     func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
         let error = ChatroomUIKitClient.shared.setup（with: "Appkey"）
     }
}
```

### 第二步 登录 ChatroomUIKit

使用用户 ID 和用户 Token 登录 ChatroomUIKit。

:::notice
若你已集成了 IM SDK，SDK 的所有用户 ID 均可用于登录 ChatroomUIKit。
:::

为了方便快速体验，你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**应用概览** > **用户认证**页面创建用户并查看用户 token。**用户认证**页面中的用户仅用于快速体验或调试目的。

在开发环境中，你需要在环信控制台[创建 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)，从你的 App Server 获取用户 token，详见[使用环信用户 token 鉴权](/product/easemob_user_token.html) 。

```swift
ChatroomUIKitClient.shared.login(with userId: "user id", token: "token", completion: <#T##(ChatError?) -> Void#>)
```

### 第三步 创建聊天室视图

创建聊天室视图的步骤如下：

1. 获取聊天室列表，加入指定的聊天室。除此之外，你还可以在环信控制台上[创建聊天室](/product/enable_and_configure_IM.html#创建聊天室)，获取聊天室 ID。

2. 创建聊天室视图 `ChatroomView`，传入的参数包括聊天室 ID、布局参数和聊天室所有者的用户 ID。

:::notice
- 建议 ChatroomView 的宽度初始化为屏幕的宽度，高度不小于以下算式的值：屏幕高度 x 1/5 + 礼物气泡行高 x 2 + 54（底部工具栏的高度）。
- 对于有刘海屏的机型，ChatroomView 的高度为以上算式的值加上底部安全区域的高度。
:::

```swift
let roomView = ChatroomUIKitClient.shared.launchRoomView(roomId: "Chat room ID",frame: CGRect, ownerId: "Chatroom owner ID")       
```

3. 将聊天室视图添加到目标区域。

4. [添加聊天室成员](https://docs-im-beta.easemob.com/product/enable_and_configure_IM.html#创建聊天室)。

// TODO：添加创建好的聊天室 UI 截图（含笑）


### 第四步 发送第一条消息

点击屏幕下方的 `说点什么` 按钮唤起键盘，输入消息内容，点击 **发送** 按钮，发送消息。

// TODO：添加截图
