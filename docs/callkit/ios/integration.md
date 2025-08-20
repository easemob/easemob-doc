# CallKit 集成指南

以下是进阶用法的部分示例。会话列表页面、消息列表页、联系人列表均可分开使用。// TODO: 替换为下面的?

使用环信 CallKit 之前，你需要将其集成到你的应用中。

## 推荐环境

- Xcode 16.0 及以上版本 
- 最低支持系统版本：iOS 15.0
- 已为你的项目设置有效的开发者签名
- CocoaPods v1.14.3 及以上版本

## 前提条件  
// TODO：现在注册账号后，Console 会自动创建一个应用吗？

在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
1. [注册环信账号](/product/console/account_register.html#注册账号)。
2. [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
3. [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID。
4. [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID。将用户加入群组。

## 1.初始化 EaseCallUIKit

CallKit 的初始化包括如下步骤：

1. 初始化 IM SDK。CallKit 基于即时通讯 IM 作为信令通道，因此需先初始化 IM SDK。
   - 填入你的应用的 App Key。
   - 设置即时通讯 IM SDK 中的一些选项（`EMOptions` 类），例如，对 SDK 中是否打印日志、是否自动登录和是否默认使用用户属性等。
2. 初始化 CallKit。
3. 开启 VoIP 和画中画功能。

在整个应用生命周期中，初始化一次即可。

```Swift
    private func setupCallKit() {
        let options = EMOptions(appkey: appKey)
        #if DEBUG
        options.apnsCertName = "EaseIM_APNS_Developer"
        options.pushKitCertName = "EasemobVoipDev"
        #else
        options.apnsCertName = "EaseIM_APNS_Product"
        options.pushKitCertName = "EasemobVoipPro"
        #endif
        EMClient.shared().initializeSDK(with: options)
        //初始化环信 CallKit
        let config = EaseCallUIKit.CallKitConfig()
        config.enableVOIP = true//开启voip功能后会自动开启LiveCommunicationKit，需要在develop.apple.com申请证书时勾选
        config.enablePIPOn1V1VideoScene = true//开启画中画，同时需要开启应用后台摄像头采集权限，详见[PictureInPicture.md](./PictureInPicture.md)。
        CallKitManager.shared.setup(config)
    }
```

## 2.登录

```Swift
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
// token生成参见快速开始中登录步骤中链接。
// 需要从您的应用服务器获取token。 您也可以使用控制台生成的临时Token登录。
// 在控制台生成用户和临时用户 token，请参见
// https://docs-im-beta.easemob.com/product/enable_and_configure_IM.html#%E5%88%9B%E5%BB%BA-im-%E7%94%A8%E6%88%B7。
```

## 3.EaseCallUIKit中的Provider

- 注: 仅用于会话列表以及联系人列表,在只是用快速开始进入聊天页面时不需要实现Provider

Provider是一个数据提供者，当会话列表展示并且滑动减速时候，EaseCallUIKit会向你请求一些当前屏幕上要显示会话的展示信息例如头像昵称等。下面是Provider的具体示例以及用法。

```Swift
        CallKitManager.shared.profileProvider = self//Swift
        //CallKitManager.shared.profileProviderOC = self//OC 与上面profileProvider二者只能设置一个
        CallKitManager.shared.addListener(self)//添加监听，均为可选方法

//MARK: - CallUserProfileProvider 
//For example using conversations controller,as follows.
extension MainViewController: CallUserProfileProvider {
    func fetchGroupProfiles(profileIds: [String]) async -> [any EaseCallUIKit.CallProfileProtocol] {
        consoleLogInfo("fetchGroupProfiles", type: .error)
        return await withTaskGroup(of: [EaseCallUIKit.CallProfileProtocol].self, returning: [EaseCallUIKit.CallProfileProtocol].self) { group in
            var resultProfiles: [EaseCallUIKit.CallProfileProtocol] = []
            group.addTask {
                var resultProfiles: [EaseCallUIKit.CallProfileProtocol] = []
                let result = await self.requestGroupsInfo(groupIds: profileIds)
                if let infos = result {
                    for groupInfo in infos {
                        let profile = EaseCallUIKit.CallUserProfile()
                        profile.id = groupInfo.id
                        profile.nickname = groupInfo.nickname
                        profile.avatarURL = groupInfo.avatarURL
                        resultProfiles.append(profile)
                    }
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
    
    func fetchUserProfiles(profileIds: [String]) async -> [any EaseCallUIKit.CallProfileProtocol] {
        return await withTaskGroup(of: [EaseCallUIKit.CallProfileProtocol].self, returning: [EaseCallUIKit.CallProfileProtocol].self) { group in
            var resultProfiles: [EaseCallUIKit.CallProfileProtocol] = []
            group.addTask {
                var resultProfiles: [EaseCallUIKit.CallProfileProtocol] = []
                let result = await self.requestUserInfos(profileIds: profileIds) ?? []
                for userInfo in result {
                    let profile = EaseCallUIKit.CallUserProfile()
                    profile.id = userInfo.id
                    profile.nickname = userInfo.nickname
                    profile.avatarURL = userInfo.avatarURL
                    resultProfiles.append(profile)
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
    
    private func requestUserInfos(profileIds: [String]) async -> [ChatUserProfileProtocol]? {
        var unknownIds = [String]()
        var resultProfiles = [ChatUserProfileProtocol]()
        for profileId in profileIds {
            if let profile = ChatUIKitContext.shared?.userCache?[profileId] {
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
                let profile = ChatUserProfile()
                let nickname = info.nickname ?? ""
                profile.id = userId
                profile.nickname = nickname
                if let remark = ChatClient.shared().contactManager?.getContact(userId)?.remark {
                    profile.remark = remark
                }
                profile.avatarURL = info.avatarUrl ?? ""
                resultProfiles.append(profile)
                if (ChatUIKitContext.shared?.userCache?[userId]) != nil {
                    profile.updateFFDB()
                } else {
                    profile.insert()
                }
                ChatUIKitContext.shared?.userCache?[userId] = profile
            }
            return resultProfiles
        }
        return []
    }
    
    private func requestGroupsInfo(groupIds: [String]) async -> [ChatUserProfileProtocol]? {
        var resultProfiles = [ChatUserProfileProtocol]()
        let groups = ChatClient.shared().groupManager?.getJoinedGroups() ?? []
        for groupId in groupIds {
            if let group = groups.first(where: { $0.groupId == groupId }) {
                let profile = ChatUserProfile()
                profile.id = groupId
                profile.nickname = group.groupName
                profile.avatarURL = group.settings.ext
                resultProfiles.append(profile)
                ChatUIKitContext.shared?.groupCache?[groupId] = profile
            }

        }
        return resultProfiles
    }
}
```

## 4.创建呼叫页面并调用呼叫Api

- 页面随用户自行创建即可，可以给AI说明我需要一个呼叫页面名字叫XXX，然后页面中有一个输入框输入呼叫人userId，一个segment选择器选择呼叫类型，一个按钮点击后进行呼叫。待AI给出代码后复制粘贴即可

```Swift 
        //在需要呼叫的页面中调用下面方法即可
        CallKitManager.shared.call(with: input, type: type)//type为CallType枚举类型，详见CallMessageService.swift
        //如果是群组通话则调用下面方法
        CallKitManager.shared.groupCall(groupId: input)
```

## 5.监听EaseCallUIKit事件和错误

您可以调用下面方法来监听 EaseCallUIKit中用户相关状态变更的事件和错误。

```Swift        
        CallKitManager.shared.addListener(self)//添加监听，均为可选方法
```
下面是监听事件的示例代码。
```Swift 
extension MainViewController: CallServiceListener {
    
    func didOccurError(error: CallError) {
        DispatchQueue.main.async {
            self.showToast(toast: "Occur error:\(error.errorMessage) on module:\(error.module.rawValue)")
        }
        switch error { //Swift error handler
        case .im(.invalidURL):
            print("Invalid URL")
        case .rtc(.invalidToken):
            print("Invalid Token")
        case .business(.state):
            print("State error")
        case .business(.param):
            print("Param error")
        default:
            // 注意这里要通过 error.error.message 访问
            print("Other error: \(error.error.message)")
        }
//        switch error.module {//OC error handler
//        case .im:
//            switch error.getIMError() {
//            case .invalidURL:
//                print("")
//            default:
//                break
//            }
//        case .rtc:
//            switch error.getRTCError() {
//            case .invalidToken:
//                print("")
//            default:
//                break
//            }
//        case .business:
//            switch error.getCallBusinessError() {
//            case .state:
//                print("")
//            case .param:
//                print("")
//            case .signaling:
//                print("")
//            default:
//                break
//            }
//        default:
//            break
//        }
    }
        
    func didUpdateCallEndReason(reason: CallEndReason, info: CallInfo) {
        print("didUpdateCallEndReason: \(String(describing: info.inviteMessage?.ext))")
        if let message = info.inviteMessage {
            NotificationCenter.default.post(name: Notification.Name("didUpdateCallEndReason"), object: message)
        }
        
    }
    
    func remoteUserDidJoined(userId: String, uid: UInt, channelName: String, type: CallType) {
        
    }
    
    func remoteUserDidLeft(userId: String, uid: UInt, channelName: String, type: CallType) {
        
    }
    
}
```