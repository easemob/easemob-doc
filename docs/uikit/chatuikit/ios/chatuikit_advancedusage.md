# 进阶用法

<Toc />

以下是进阶用法的部分示例。会话列表页面、消息列表页和联系人列表均可单独使用。

## 初始化

与[快速开始中的初始化](chatuikit_quickstart.html##第一步-初始化)相比，这里增加了 `ChatOptions` 的参数，包括 SDK 中是否打印日志、是否自动登录以及是否默认使用用户属性的开关配置。

```
let error = EaseChatUIKitClient.shared.setup(
    with: "Your appkey",
    option: EaseChatUIKitInitialOptions.ChatOptions()
)
```

## 登录

使用当前用户对象符合 `EaseProfileProtocol` 协议的用户信息登录 EaseChatUIKit。

[在环信控制台上创建用户](/product/enable_and_configure_IM.html#创建-im-用户)，将用户 ID 传入以下代码中的 `userId`。

:::tip
若你已集成了 IM SDK，SDK 的所有用户 ID 均可用于登录 EaseChatUIKit。
:::

```
public final class YourAppUser: NSObject, EaseProfileProtocol {

    public func toJsonObject() -> Dictionary<String, Any>? {
        ["ease_chat_uikit_info":["nickname":self.nickname,"avatarURL":self.avatarURL,"userId":self.id]]
    }

    public var userId: String = <#T##String#>

    public var nickname: String = "Jack"

    public var avatarURL: String = "https://accktvpic.oss-cn-beijing.aliyuncs.com/pic/sample_avatar/sample_avatar_1.png"

}
 EaseChatUIKitClient.shared.login(user: YourAppUser(), token: ExampleRequiredConfig.chatToken) { error in 
 }
```

## 会话列表页面及 Provider

1. 创建会话列表页面。

继承单群聊 UIKit 提供的会话列表页面类注册后的自定义类可以调用 ViewModel 的 `registerEventsListener` 方法监听相关事件。

- 使用协程异步返回会话列表相关信息，仅限于 Swift 下使用。

```
let conversations = EaseChatUIKit.ComponentsRegister.shared.ConversationsController.init(provider: self)
```

- 使用闭包返回会话列表相关信息，Swift 和 OC 均可使用。

```
let conversations = EaseChatUIKit.ComponentsRegister.shared.ConversationsController.init(providerOC: self)
```

2. 实现会话列表 Provider。

对于 Objective-C，实现 EaseProfileProviderOC 即可。 

下面示例代码为实现带协程功能的 Swift 特有的 provider。

```
extension YourViewController: EaseProfileProvider {

    func fetchProfiles(profilesMap: [EaseChatUIKit.EaseProfileProviderType : [String]]) async -> [EaseChatUIKit.EaseProfileProtocol] {
        //Create a task group 
        return await withTaskGroup(of: [EaseChatUIKit.EaseProfileProtocol].self, returning: [EaseChatUIKit.EaseProfileProtocol].self) { group in
            var resultProfiles: [EaseChatUIKit.EaseProfileProtocol] = []
            for (type,profileIds) in profilesMap {
                //According to condition, add task execution 
                if type == .chat {
                    group.addTask {
                        var resultProfiles: [EaseChatUIKit.EaseProfileProtocol] = []
                        let result = await ChatClient.shared().userInfoManager?.fetchUserInfo(byId: profileIds, type: [NSNumber(integerLiteral: UserInfoType.avatarURL.rawValue),NSNumber(integerLiteral: UserInfoType.nickName.rawValue)])
                        if result?.1 != nil {
                            return resultProfiles
                        } else {
                            let userInfoMap = result?.0 ?? [:]
                            for (key, value) in userInfoMap {
                                let profile = EaseProfile()
                                profile.id = key
                                profile.nickname = value.nickname ?? ""
                                profile.avatarURL = value.avatarUrl ?? ""
                                resultProfiles.append(profile)
                            }
                            return resultProfiles
                        }
                    }
                } else {
                    group.addTask {
                    var resultProfiles: [EaseChatUIKit.EaseProfileProtocol] = []
                    // 此处仅为示例，你需要根据 profileIds 调用你们服务器获取对应群组的头像和昵称信息，并且返回下面的数组中。
                        return resultProfiles
                    }
                }
            }
            //等所有任务都执行完毕，返回值。
            for await result in group {
                resultProfiles.append(contentsOf: result)
            }
            return resultProfiles
        }

        
    }
}
```

## 联系人列表页面及其 Provider

1. 创建联系人列表页面。

继承单群聊 UIKit 提供的联系人列表页面类注册后的自定义类可以调用 ViewModel 的 `registerEventsListener` 方法监听相关事件。

- 使用协程异步返回联系人相关信息，仅限于 Swift 下使用。

```
let vc = EaseChatUIKit.ComponentsRegister.shared.ContactsController.init(provider: self)
```

- 使用闭包返回会话列表相关信息，Swift 和 OC 均可使用。

```
let vc = EaseChatUIKit.ComponentsRegister.shared.ContactsController.init(providerOC: self)
```

2. 实现联系人列表 Provider。

实现联系人列表 Provider 与[实现会话列表 Provider 相似](#会话列表页面及-provider)。实现 EaseProfileProvider 协议后，使用协程异步返回你要显示的联系人信息。对于 Objective-C，实现 EaseProfileProviderOC 即可。 

## 初始化聊天页面

聊天页面中大部分消息处理以及页面处理逻辑均可覆盖（override），包括 ViewModel。

```
// 在环信即时通讯云控制台中创建一个新用户，将用户 ID 传入下面构造方法参数中，跳转到聊天页面即可。
let vc = ComponentsRegister.shared.MessageViewController.init(conversationId: <#刚创建用户的id#>, chatType: .chat)
// 继承注册后的自定义类还可以调用 ViewModel 的 registerEventsListener 方法监听聊天消息相关事件，例如消息接收、长按、点击等。 
//或者 push 或者 present 都可
ControllerStack.toDestination(vc: vc)
```

## 监听用户及 UIKit 与服务器的连接状态的相关事件

你可以调用 `registerUserStateListener` 方法监听 EaseChatUIKit 中用户以及连接状态变更相关的事件和错误。

```
EaseChatUIKitClient.shared.registerUserEventsListener(self)
```

不使用该监听时，可调用 `unregisterUserEventsListener` 方法移除：

```
EaseChatUIKitClient.shared.unregisterUserEventsListener(self)
```



