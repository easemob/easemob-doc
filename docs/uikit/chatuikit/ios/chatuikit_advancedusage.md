# 进阶用法

<Toc />

以下是进阶用法的部分示例。会话列表页面、消息列表页和联系人列表均可单独使用。

## 初始化

与[快速开始中的初始化](chatuikit_quickstart.html##第一步-初始化)相比，这里增加了 `ChatOptions` 的参数，包括 SDK 中是否打印日志、是否自动登录以及是否默认使用用户属性的开关配置。

```swift
let error = ChatUIKitClient.shared.setup(option: ChatOptions(appKey: appKey))
```

## 登录

使用当前用户对象符合 `ChatUserProfileProtocol` 协议的用户信息登录 EaseChatUIKit。

[在环信控制台上创建用户](/product/console/operation_user.html#创建用户)，将用户 ID 传入以下代码中的 `userId`。

:::tip
若你已集成了 IM SDK，SDK 的所有用户 ID 均可用于登录 EaseChatUIKit。
:::

```
public final class YourAppUser: NSObject, ChatUserProfileProtocol {

    public func toJsonObject() -> Dictionary<String, Any>? {
        ["ease_chat_uikit_user_info":["nickname":self.nickname,"avatarURL":self.avatarURL,"userId":self.id]]
    }

    public var userId: String = <#T##String#>

    public var nickname: String = "Jack"
    
    public var remark: String = "Jack 1"

    public var avatarURL: String = "https://accktvpic.oss-cn-beijing.aliyuncs.com/pic/sample_avatar/sample_avatar_1.png"

}
 ChatUIKitClient.shared.login(user: YourAppUser(), token: ExampleRequiredConfig.chatToken) { error in 
 }
```

## 会话列表页面

1. 创建会话列表页面

```swift
    
        let vc = EaseChatUIKit.ComponentsRegister.shared.ConversationsController.init()
        
```

2. 监听会话列表页面事件

```swift
        
        vc.viewModel?.registerEventsListener(listener: self)
```

## 联系人列表页面

1. 创建联系人列表页面

继承单群聊 UIKit 提供的联系人列表页面类注册后的自定义类可以调用 ViewModel 的 `ContactViewController().viewModel.registerEventsListener` 方法监听相关事件。

```swift
        let vc = EaseChatUIKit.ComponentsRegister.shared.ContactsController.init(headerStyle: .contact)
```

2. 监听联系人列表页面事件

```swift
        vc.viewModel?.registerEventsListener(listener: self)
```

## 初始化聊天页面

聊天页面中大部分消息处理以及页面处理逻辑均可覆盖（override），包括 `ViewModel`。

```
// 在环信控制台中创建一个新用户，将用户 ID 传入下面构造方法参数中，跳转到聊天页面即可。
let vc = ComponentsRegister.shared.MessageViewController.init(conversationId: <#刚创建用户的id#>, chatType: .chat)
// 继承注册后的自定义类还可以调用 ViewModel 的 registerEventsListener 方法监听聊天消息相关事件，例如消息接收、长按、点击等。 
//或者 push 或者 present 都可
vc.modalPresentationStyle = .fullScreen
ControllerStack.toDestination(vc: vc)
```

## 监听用户及与服务器的连接事件

你可以调用 `registerUserStateListener` 方法监听 EaseChatUIKit 中用户以及与服务器之间的连接状态变更的相关事件和错误。

ChatUIKitClient.shared.registerUserStateListener(self)
```

不使用该监听时，可调用 `unregisterUserStateListener` 方法移除：

```
ChatUIKitClient.shared.unregisterUserStateListener(self)
```

## 更多

更多进阶用法，请参考 [Demo 中源码](https://github.com/easemob/easemob-demo-ios)。


