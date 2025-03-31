# 用户自定义信息

<Toc />

单群聊 UIKit 中的聊天页面、会话列表页面以及通讯录页面等都用到用户信息，这些用户信息需要开发者提供。本节介绍开发者如何向 UIKIt 提供用户信息。

## 当前登录用户信息

开发者可以在登录后，调用 `ChatUIKitClient#setCurrentUser` 方法对当前用户的信息进行设置和更新。

```typescript
ChatClient.getInstance().userInfoManager()?.fetchUserInfoById(currentUserId)
    .then((result) => {
        if (result.has(currentUserId)) {
            let user = result.get(currentUserId);
            // 设置或者更新当前登录用户信息
            ChatUIKitClient.setCurrentUser({
                id: currentUserId,
                name: user?.nickname,
                avatar: user?.avatarUrl
            })
        }
    })
```

:::tip
如果设置了当前登录用户信息，使用 `ChatUIKit` 发送消息时，会将用户昵称和用户头像等信息通过消息扩展的方式携带。具体逻辑可参考 `MessageViewModel#sendMessage` 方法。
:::

## 用户信息或者群组信息提供

单群聊 UIKit 提供 `ChatUIKitClient.setProfileProvider` 接口提供用户信息或者群组信息，包括联系人或者群组的信息。

使用方法如下所示：

```typescript
ChatUIKitClient.setProfileProvider({
    fetchProfile: (userId?: string | string[],
      groupId?: string | undefined): Promise<ChatUserProfile | ChatUserProfile[] | ChatGroupProfile> => {
      return new Promise((resolve)=> {
        if (typeof userId === 'undefined') {
          if (groupId) {
            // 处理获取群组信息的逻辑
            ......
            let info = new ChatGroupProfile();
            ......
            resolve(info);
          }
        } else if (typeof userId === 'string') {
          // 处理获取单个联系人信息的逻辑
          ......
          let user = new ChatUserProfile();
          ......
          resolve(user);
        } else {
          // 处理获取多个联系人信息的逻辑
          ......
          let result: ChatUserProfile[] = [];
          ......
          resolve(result);
        }
      })
    }
  })
```

## UIKit 信息处理逻辑

1. 如果信息已经缓存到内存，当页面需要显示信息时，UIKit 会首先从内存中获取缓存数据并进行页面的渲染。

2. 如果没有缓存数据，你可以从 app 的本地数据库或内存中获取数据，构建 `ChatUserProfile` 对象，使用 `fetchProfile` 方法返回 `ChatUserProfile` 。这样，UIKit 会利用 `ChatUserProfile` 对象更新 UI 上的信息。

## 更新 UIKit 缓存信息

因为单群聊 UIKit 会对信息进行缓存。如果用户的信息发生变化，可以通过 UIKit 提供的 `update` 方法对缓存信息进行更新。

```typescript
// 更新当前用户信息
ChatUIKitClient.setCurrentUser(currentUserProfile);
// 更新单聊用户/群组信息
ChatUIKitClient.updateUserProfiles(usersOrGroupInfo);
```