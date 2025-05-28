# 用户信息提供

ChatUIKitContext 中的 Provider **仅用于会话列表以及联系人列表**。若只通过快速开始进入聊天页面，则不需要实现 Provider。

## 1. 设置 Provider 实现类

- 使用协程异步返回会话列表相关信息，仅限于 Swift 下使用。

```
    
        //userProfileProvider 为用户数据的提供者，使用协程实现与 userProfileProviderOC 不能同时存在。userProfileProviderOC 使用闭包实现。
        ChatUIKitContext.shared?.userProfileProvider = self
        ChatUIKitContext.shared?.userProfileProviderOC = nil
        //groupProvider 原理同上
        ChatUIKitContext.shared?.groupProfileProvider = self
        ChatUIKitContext.shared?.groupProfileProviderOC = nil
```

- 使用闭包返回会话列表相关信息，Swift 和 OC 均可使用。

```
        //userProfileProvider 为用户数据的提供者，使用协程实现与 userProfileProviderOC 不能同时存在。userProfileProviderOC 使用闭包实现。
        ChatUIKitContext.shared?.userProfileProvider = nil
        ChatUIKitContext.shared?.userProfileProviderOC = self
        //groupProvider 原理同上
        ChatUIKitContext.shared?.groupProfileProvider = nil
        ChatUIKitContext.shared?.groupProfileProviderOC = self
```

## 2. 实现会话列表 Provider

对于 Objective-C，实现 ChatProfileProviderOC 即可。 

下面示例代码为实现带协程功能的 Swift 特有的 provider。

```
//MARK: - ChatProfileProvider for conversations&contacts usage.
//For example using conversations controller,as follows.
extension MainViewController: ChatProfileProvider,ChatGroupProfileProvider {
    //MARK: - ChatProfileProvider
    func fetchProfiles(profileIds: [String]) async -> [any chat_uikit.ChatUserProfileProtocol] {
        return await withTaskGroup(of: [chat_uikit.ChatUserProfileProtocol].self, returning: [chat_uikit.ChatUserProfileProtocol].self) { group in
            var resultProfiles: [chat_uikit.ChatUserProfileProtocol] = []
            group.addTask {
                var resultProfiles: [chat_uikit.ChatUserProfileProtocol] = []
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
    func fetchGroupProfiles(profileIds: [String]) async -> [any chat_uikit.ChatUserProfileProtocol] {
        
        return await withTaskGroup(of: [chat_uikit.ChatUserProfileProtocol].self, returning: [chat_uikit.ChatUserProfileProtocol].self) { group in
            var resultProfiles: [chat_uikit.ChatUserProfileProtocol] = []
            group.addTask {
                var resultProfiles: [chat_uikit.ChatUserProfileProtocol] = []
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
                let profile = ExampleRequiredConfig.YourAppUser()
                let nickname = info.nickname ?? ""
                profile.id = userId
                profile.nickname = nickname
                if let remark = ChatClient.shared().contactManager?.getContact(userId)?.remark {
                    profile.remark = remark
                }
                profile.avatarURL = info.avatarUrl ?? ""
                resultProfiles.append(profile)
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
                let profile = ExampleRequiredConfig.YourAppUser()
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