# 用户自定义信息

<Toc />

单群聊 UIKit 中多处用到用户信息，而这些用户信息需要开发者提供，本节介绍开发者如何提供给 UIKit 用户信息。

## 当前登录用户信息

用户调用 `ChatUIKitClient.login` 方法登录时需要传入一个 `ChatUIKitProfile` 对象，包含 `id`、`name` 和 `avatar` 三个属性。`id` 为必填参数，`name` 和 `avatar` 用于展示当前用户昵称和头像。发送消息时，将 `name` 和 `avatar` 属性设置到消息的 `ext` 中，方便其他用户进行展示。

如果登录时没有传入 `name` 和 `avatar` 属性，可以在登录后，调用 `ChatUIKitClient.updateCurrentUser` 方法对当前用户的信息进行更新。

```kotlin
ChatUIKitClient.login(
    user = ChatUIKitProfile(
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

## 用户信息提供

单群聊 UIKit 提供 `ChatUIKitClient.setUserProfileProvider` 接口提供用户信息，包括联系人和群组成员的信息。

`ChatUIKitUserProfileProvider` 接口如下所示：

```kotlin
interface ChatUIKitUserProfileProvider {
    // 同步获取用户信息
    fun getUser(userId: String?): ChatUIKitProfile?

    // 异步获取用户信息
    fun fetchUsers(userIds: List<String>, onValueSuccess: OnValueSuccess<List<ChatUIKitProfile>>)
}
```

使用方法如下所示：

```kotlin
ChatUIKitClient.setUserProfileProvider(object : ChatUIKitUserProfileProvider {
    override fun getUser(userId: String?): ChatUIKitProfile? {
        return getLocalUserInfo(userId)
    }

    override fun fetchUsers(
        userIds: List<String>,
        onValueSuccess: OnValueSuccess<List<ChatUIKitProfile>>
    ) {
        fetchUserInfoFromServer(idsMap, onValueSuccess)
    }

})

```

## 群组信息提供

单群聊 UIKit 提供 `ChatUIKitClient.setGroupProfileProvider` 接口进行群组信息的提供。

`ChatUIKitGroupProfileProvider` 接口如下所示：

```kotlin
interface ChatUIKitGroupProfileProvider {
    // 同步获取群组信息
    fun getGroup(id: String?): ChatUIKitGroupProfile?

    // 异步获取群组信息
    fun fetchGroups(groupIds: List<String>, onValueSuccess: OnValueSuccess<List<ChatUIKitGroupProfile>>)
}
```

使用方法如下：

```kotlin
ChatUIKitClient.setGroupProfileProvider(object : ChatUIKitGroupProfileProvider {
    override fun getGroup(id: String?): ChatUIKitGroupProfile? {
        ChatClient.getInstance().groupManager().getGroup(id)?.let {
            return ChatUIKitGroupProfile(it.groupId, it.groupName, it.extension)
        }
        return null
    }

    override fun fetchGroups(
        groupIds: List<String>,
        onValueSuccess: OnValueSuccess<List<ChatUIKitGroupProfile>>
    ) {
        // 根据 groupId 列表获取群组相关的信息通过 onValueSuccess() 进行返回，并更新缓存信息。
    }
})

```

## 设置会话头像和昵称

```kotlin

 // 调用 setUserProfileProvider 设置单聊时的用户属性，包括用户头像和昵称。
 ChatUIKitClient.setUserProfileProvider(object : ChatUIKitUserProfileProvider {
     override fun getUser(userId: String?): ChatUIKitProfile? {
         // 返回对应 userId 的本地用户属性
         return DemoHelper.getInstance().getDataModel().getAllContacts()[userId]?.toProfile()
     }

     override fun fetchUsers(
         userIds: List<String>,
         onValueSuccess: OnValueSuccess<List<ChatUIKitProfile>>
     ) {
         // Provider 提供者。用户可以根据 userId 列表从自己服务器获取对应 ID 的 Profile 信息，通过 onValueSuccess() 进行返回。
         // 同时可以将获取到的信息通过 ChatUIKitClient.updateUsersInfo() 更新到缓存中。获取 Profile 时，UIKit 会先从缓存中查询。
     }
 })
 // 通过 setGroupProfileProvider 设置群组信息
 ChatUIKitClient.setGroupProfileProvider(object : ChatUIKitGroupProfileProvider {

    override fun getGroup(id: String?): ChatUIKitGroupProfile? {
        ChatClient.getInstance().groupManager().getGroup(id)?.let {
            return ChatUIKitGroupProfile(it.groupId, it.groupName, it.extension)
        }
        return null
    }

    override fun fetchGroups(
        groupIds: List<String>,
        onValueSuccess: OnValueSuccess<List<ChatUIKitGroupProfile>>
    ) {
        // 根据 groupId 列表获取群组相关的信息通过 onValueSuccess() 并更新缓存信息。
    }
})
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_list_custom_all.png" title="会话头像和昵称" />
</ImageGallery>

## UIKit 信息处理逻辑

1. 如果信息已经缓存到内存，当页面需要显示信息时，UIKit 会首先从内存中获取缓存数据并进行页面的渲染。

2. 如果没有缓存数据，你可以从 app 的本地数据库或内存中获取数据，构建 `ChatUIKitProfile` 对象，使用 `getUser` 方法返回 `ChatUIKitProfile` 对象。这样，UIKit 会利用 `ChatUIKitProfile` 对象更新 UI 上的信息。

3. 若通过 `getUser` 方法未获取到数据，UIKit provider 会通过 `fetchUsers` 方法从你的服务器中获取数据：列表页面停止滑动时，UIKit 会首先从缓存中获取数据，提供不存在缓存数据的用户 ID 列表，从服务器查询这些用户的数据。你可以构建 `List<ChatUIKitProfile>` 对象，调用 `fetchUsers` 方法时，会通过 `onValueSuccess(List<ChatUIKitProfile>)` 返回数据。

## 更新 UIKit 缓存信息

因为单群聊 UIKit 会对信息进行缓存。如果用户的信息发生改变，可以通过 UIKit 提供的 `update` 方法对缓存信息进行更新。

```kotlin
// 更新当前用户信息
ChatUIKitClient.updateCurrentUser(currentUserProfile)
// 更新单聊用户/群成员信息
ChatUIKitClient.updateUsersInfo(userProfileList)
```