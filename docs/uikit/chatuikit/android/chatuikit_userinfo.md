# 用户自定义信息

<Toc />

单群聊 UIKit 中多处用到用户信息，而这些用户信息需要开发者提供，本节介绍开发者如何提供给 UIKit 用户信息。

## 当前登录用户信息

用户调用 `EaseIM.login` 方法登录时需要传入一个 `EaseProfile` 对象，包含 `id`、`name` 和 `avatar` 三个属性。`id` 为必填参数，`name` 和 `avatar` 用于展示当前用户昵称和头像。发送消息时，将 `name` 和 `avatar` 属性设置到消息的 `ext` 中，方便其他用户进行展示。

如果登录时没有传入 `name` 和 `avatar` 属性，可以在登录后，调用 `EaseIM.updateCurrentUser` 方法对当前用户的信息进行更新。

```kotlin
EaseIM.login(
    user = EaseProfile(
        id = "",
        name = "",
        avatar = ""
    ),
    token = "", 
    onSuccess = {
                        
    }, 
    onError = {code,error ->
                
    }
)
```

## 会话列表信息提供

单群聊 UIKit 提供 `EaseIM.setConversationInfoProvider` 接口进行会话列表信息的提供。

`EaseConversationInfoProvider` 接口如下所示：

```kotlin
interface EaseConversationInfoProvider {
    // 同步获取会话信息
    fun getProfile(id: String?, type: ChatConversationType = ChatConversationType.Chat): EaseProfile?

    // 异步获取会话信息
    fun fetchProfiles(idsMap: Map<ChatConversationType, List<String>>, onValueSuccess: OnValueSuccess<List<EaseProfile>>)
}
```

使用方法如下所示：

```kotlin
EaseIM.setConversationInfoProvider(object : EaseConversationInfoProvider {
    // 同步获取会话信息
    override fun getProfile(id: String?, type: ChatConversationType): EaseProfile? {
        return when(type) {
            ChatConversationType.Chat ->{
                // 可以从本地数据库或者缓存中获取用户信息，并返回，不可进行异步操作。
                loadUserInfoFromLocal(id)
            }

            ChatConversationType.GroupChat -> {
                // 可以从本地数据库或者缓存中获取群组信息，并返回，不可进行异步操作。
                loadGroupInfoFromLocal(id)
            }

            else -> null
        }
        return null
    }

    override fun fetchProfiles(
        idsMap: Map<ChatConversationType, List<String>>,
        onValueSuccess: OnValueSuccess<List<EaseProfile>>
    ) {
        fetchProfilesFromServer(idsMap, onValueSuccess)
    }

})

```

## 联系人信息提供

单群聊 UIKit 提供 `EaseIM.setUserProfileProvider` 接口进行联系人信息的提供。

`EaseUserProfileProvider` 接口如下所示：

```kotlin
interface EaseUserProfileProvider {
    // 同步获取联系人信息
    fun getUser(userId: String?): EaseProfile?

    // 异步获取联系人信息
    fun fetchUsers(userIds: List<String>, onValueSuccess: OnValueSuccess<List<EaseProfile>>)
}
```

使用方法如下所示：

```kotlin
EaseIM.setUserProfileProvider(object : EaseUserProfileProvider {
    // 同步获取会话信息
    override fun getUser(userId: String?): EaseProfile? {
        return getLocalUserInfo(userId)
    }

    override fun fetchUsers(
        userIds: List<String>,
        onValueSuccess: OnValueSuccess<List<EaseProfile>>
    ) {
        fetchUserInfoFromServer(idsMap, onValueSuccess)
    }

})

```

## 群组成员信息提供

单群聊 UIKit 提供 `EaseIM.setGroupMemberProfileProvider` 接口进行联系人信息的提供。

`EaseGroupMemberProfileProvider` 接口如下所示：

```kotlin
interface EaseGroupMemberProfileProvider {
    // 同步获取群成员信息
    fun getMemberProfile(groupId: String?, username: String?): EaseProfile?

    // 异步获取群成员信息
    fun fetchMembers(members: Map<String, List<String>>, onValueSuccess: OnValueSuccess<Map<String, EaseProfile>>)
}
```

使用方法如下：

```kotlin
EaseIM.setGroupMemberProfileProvider(object : EaseGroupMemberProfileProvider {
    // 同步获取会话信息
    override fun getMemberProfile(groupId: String?, username: String?): EaseProfile? {
        return getLocalGroupMemberInfo(groupId, username)
    }

    override fun fetchMembers(
        members: Map<String, List<String>>,
        onValueSuccess: OnValueSuccess<Map<String, EaseProfile>>
    ) {
        fetchGroupMemberInfoFromServer(members, onValueSuccess)
    }

})

```

## UIKit 信息处理逻辑

1. 如果信息已经缓存到内存，当页面需要显示信息时，UIKit 会首先从内存中获取缓存数据并进行页面的渲染。如果缓存没有，则进入下一步。

2. 单群聊 UIKit 调用 provider 同步方法从应用本地获取信息，开发者可以从应用本地的数据库或者内存中获取并提供对应信息。

   UIKit 获取到信息后进行页面的渲染。同时，对获取到的信息进行缓存。

3. 如果同步方法获取数据为空，当列表页面停止滑动时，UIKit 会将当前页面可见的条目所需的信息，在排除缓存和同步方法提供的数据后，通过 provider 提供的异步方法返给开发者。

   开发者从服务器获取对应的信息后，通过 `onValueSuccess` 提供给 UIKit。UIKit 收到数据后，会对列表进行刷新并更新对应的数据。

## 更新 UIKit 缓存信息

因为单群聊 UIKit 会对信息进行缓存。如果用户的信息发生改变，可以通过 UIKit 提供的 update 方法对缓存信息进行更新。

```kotlin
// 更新当前用户信息
EaseIM.updateCurrentUser(currentUserProfile)
// 更新会话信息
EaseIM.updateConversationInfo(conversationProfileList)
// 更新联系人信息
EaseIM.updateUsersInfo(userProfileList)
// 更新群组成员信息
EaseIM.updateGroupMemberProfiles(groupId, groupMemberProfileList)
```