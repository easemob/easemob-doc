# 进阶用法

<Toc />

以下是进阶用法的部分示例。会话列表页面、消息列表页和联系人列表均可单独使用。

## 初始化

与[快速开始中的初始化](chatuikit_quickstart.html##第一步-初始化)相比，这里增加了 `ChatOptions` 的参数，包括 SDK 中是否打印日志、是否自动登录以及是否默认使用用户属性的开关配置。

```Swift
let error = EaseChatUIKitClient.shared.setup(option: ChatOptions(appkey: appKey))
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

## EaseChatUIKitContext 中的 Provider

:::tip
Provider 仅用于会话列表以及联系人列表。若只通过快速开始进入聊天页面，则不需要实现 Provider。
:::

1.设置 Provider 实现类

- 使用协程异步返回会话列表相关信息，仅限于 Swift 下使用。

```
    
        //userProfileProvider 为用户数据的提供者，使用协程实现与 userProfileProviderOC 不能同时存在。userProfileProviderOC 使用闭包实现。
        EaseChatUIKitContext.shared?.userProfileProvider = self
        EaseChatUIKitContext.shared?.userProfileProviderOC = nil
        //groupProvider 原理同上
        EaseChatUIKitContext.shared?.groupProfileProvider = self
        EaseChatUIKitContext.shared?.groupProfileProviderOC = nil
```

- 使用闭包返回会话列表相关信息，Swift 和 OC 均可使用。

```
        //userProfileProvider 为用户数据的提供者，使用协程实现与 userProfileProviderOC 不能同时存在。userProfileProviderOC 使用闭包实现。
        EaseChatUIKitContext.shared?.userProfileProvider = nil
        EaseChatUIKitContext.shared?.userProfileProviderOC = self
        //groupProvider 原理同上
        EaseChatUIKitContext.shared?.groupProfileProvider = nil
        EaseChatUIKitContext.shared?.groupProfileProviderOC = self
```

2. 实现会话列表 Provider。

对于 Objective-C，实现 EaseProfileProviderOC 即可。 

下面示例代码为实现带协程功能的 Swift 特有的 provider。

```
//MARK: - EaseProfileProvider for conversations&contacts usage.
//For example using conversations controller,as follows.
extension MainViewController: EaseProfileProvider,EaseGroupProfileProvider {
    //MARK: - EaseProfileProvider
    func fetchProfiles(profileIds: [String]) async -> [any EaseChatUIKit.EaseProfileProtocol] {
        return await withTaskGroup(of: [EaseChatUIKit.EaseProfileProtocol].self, returning: [EaseChatUIKit.EaseProfileProtocol].self) { group in
            var resultProfiles: [EaseChatUIKit.EaseProfileProtocol] = []
            group.addTask {
                var resultProfiles: [EaseChatUIKit.EaseProfileProtocol] = []
                let result = await self.requestUserInfos(profileIds: profileIds)
                if let infos = result {
                    resultProfiles.append(contentsOf: infos)
                }
                return resultProfiles
            }
            //Await all task were executed.Return values.
            for await result in group {
                resultProfiles.append(contentsOf: result)
            }
            return resultProfiles
        }
    }
    //MARK: - EaseGroupProfileProvider
    func fetchGroupProfiles(profileIds: [String]) async -> [any EaseChatUIKit.EaseProfileProtocol] {
        
        return await withTaskGroup(of: [EaseChatUIKit.EaseProfileProtocol].self, returning: [EaseChatUIKit.EaseProfileProtocol].self) { group in
            var resultProfiles: [EaseChatUIKit.EaseProfileProtocol] = []
            group.addTask {
                var resultProfiles: [EaseChatUIKit.EaseProfileProtocol] = []
                let result = await self.requestGroupsInfo(groupIds: profileIds)
                if let infos = result {
                    resultProfiles.append(contentsOf: infos)
                }
                return resultProfiles
            }
            //Await all task were executed.Return values.
            for await result in group {
                resultProfiles.append(contentsOf: result)
            }
            return resultProfiles
        }
    }
    
    private func requestUserInfos(profileIds: [String]) async -> [EaseProfileProtocol]? {
        var unknownIds = [String]()
        var resultProfiles = [EaseProfileProtocol]()
        for profileId in profileIds {
            if let profile = EaseChatUIKitContext.shared?.userCache?[profileId] {
                if profile.nickname.isEmpty {
                    unknownIds.append(profile.id)
                } else {
                    resultProfiles.append(profile)
                }
            } else {
                unknownIds.append(profileId)
            }
        }
        if unknownIds.isEmpty {
            return resultProfiles
        }
        let result = await ChatClient.shared().userInfoManager?.fetchUserInfo(byId: unknownIds)
        if result?.1 == nil,let infoMap = result?.0 {
            for (userId,info) in infoMap {
                let profile = EaseChatProfile()
                let nickname = info.nickname ?? ""
                profile.id = userId
                profile.nickname = nickname
                if let remark = ChatClient.shared().contactManager?.getContact(userId)?.remark {
                    profile.remark = remark
                }
                profile.avatarURL = info.avatarUrl ?? ""
                resultProfiles.append(profile)
                if (EaseChatUIKitContext.shared?.userCache?[userId]) != nil {
                    profile.updateFFDB()
                } else {
                    profile.insert()
                }
                EaseChatUIKitContext.shared?.userCache?[userId] = profile
            }
            return resultProfiles
        }
        return []
    }
    
    private func requestGroupsInfo(groupIds: [String]) async -> [EaseProfileProtocol]? {
        var resultProfiles = [EaseProfileProtocol]()
        let groups = ChatClient.shared().groupManager?.getJoinedGroups() ?? []
        for groupId in groupIds {
            if let group = groups.first(where: { $0.groupId == groupId }) {
                let profile = EaseChatProfile()
                profile.id = groupId
                profile.nickname = group.groupName
                profile.avatarURL = group.settings.ext
                resultProfiles.append(profile)
                EaseChatUIKitContext.shared?.groupCache?[groupId] = profile
            }

        }
        return resultProfiles
    }
}
```

## 会话列表页面

1.创建会话列表页面

```Swift
    
        let vc = EaseChatUIKit.ComponentsRegister.shared.ConversationsController.init()
        vc.tabBarItem.tag = 0
```

2.监听会话列表页面事件

```Swift
        
        vc.viewModel?.registerEventsListener(listener: self)
```

## 联系人列表页面

1. 创建联系人列表页面。

继承单群聊 UIKit 提供的联系人列表页面类注册后的自定义类可以调用 ViewModel 的 `ContactViewController().viewModel.registerEventsListener` 方法监听相关事件。

```Swift
        let vc = EaseChatUIKit.ComponentsRegister.shared.ContactsController.init(headerStyle: .contact)
```

2.监听联系人列表页面事件

```Swift
        vc.viewModel?.registerEventsListener(listener: self)
```

## 初始化聊天页面

聊天页面中大部分消息处理以及页面处理逻辑均可覆盖（override），包括 `ViewModel`。

```
// 在环信即时通讯云控制台中创建一个新用户，将用户 ID 传入下面构造方法参数中，跳转到聊天页面即可。
let vc = ComponentsRegister.shared.MessageViewController.init(conversationId: <#刚创建用户的id#>, chatType: .chat)
// 继承注册后的自定义类还可以调用 ViewModel 的 registerEventsListener 方法监听聊天消息相关事件，例如消息接收、长按、点击等。 
//或者 push 或者 present 都可
ControllerStack.toDestination(vc: vc)
```

## 监听用户及与服务器的连接事件

你可以调用 `registerUserStateListener` 方法监听 EaseChatUIKit 中用户以及与服务器之间的连接状态变更的相关事件和错误。

```
EaseChatUIKitClient.shared.registerUserStateListener(self)
```

不使用该监听时，可调用 `unregisterUserStateListener` 方法移除：

```
EaseChatUIKitClient.shared.unregisterUserStateListener(self)
```

## 更多

更多进阶用法，请参考 [Demo 中源码](https://github.com/easemob/easemob-demo-ios/tree/SwiftDemo)。


