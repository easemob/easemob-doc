# UIKitProvider

<Toc />

`easemob-chat-uikit` 提供 `UIKitProvider` 组件管理数据。`UIKitProvider` 不渲染任何 UI, 只用于为其他组件提供全局的 context，自动监听 SDK 事件, 在组件树中向下传递数据来驱动组件更新。单群聊 UIKit 中其他组件必须用 `UIKitProvider` 包裹。

## 使用示例

```jsx
import React from 'react';
import { UIKitProvider } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';
import ChatApp from './ChatApp'
ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <div>
    <UIKitProvider
      initConfig={{
        appKey: 'your app key',
        userId: 'userId',
        token: 'token',
        translationTargetLanguage: 'zh-Hans', // 翻译功能的目标语言
        useUserInfo: true, // 是否使用用户属性功能展示头像昵称（UIKit 内部会获取用户属性，需要用户自己设置）
      }}
      // 查看所有 UI 文本: https://github.com/easemob/Easemob-UIKit-web/tree/dev/local
      local={{
        fallbackLng: 'en',
        lng: 'en',
        resources: {
          en: {
            translation: {
              'conversationTitle': 'Conversation List',
              'deleteCvs': 'Delete Conversation',
              // ...
            },
          },
        },
      }}
      theme={{
        primaryColor: '#33ffaa',
        mode: 'light',
        componentsShape: 'square'
      }}
      reactionConfig={{
        map: {
            'emoji_1': <img src={'customIcon'} alt={'emoji_1'} />,
            'emoji_2': <img src={'customIcon'} alt={'emoji_2'} />,
        }
      }}

      features={{
        conversationList: {
          // search: false,
          item: {
            moreAction: false,
            deleteConversation: false,
          },
        },
        chat: {
          header: {
            threadList: true,
            moreAction: true,
            clearMessage: true,
            deleteConversation: false,
            audioCall: false,
          },
          message: {
            status: false,
            reaction: true,
            thread: true,
            recall: true,
            translate: false,
            edit: false,
          },
          messageEditor: {
            mention: false,
            typing: false,
            record: true,
            emoji: false,
            moreAction: true,
            picture: true,
          },
        },
      }}
    >
      <ChatApp></ChatApp>
    </UIKitProvider>
  </div>,
);
```

## 头像和昵称

### 联系人

UIKit 直接使用不做任何设置时，默认展示用户的用户 ID, 头像默认为用户 ID 的前两个字母。UIKit 提供两种方式设置用户的头像和昵称：

- 如果用户的头像和昵称存放在环信的服务器，UIKit 内部默认使用用户属性功能获取头像昵称。用户首次登录可以调用 SDK 的 API 设置自己的头像和昵称。

示例代码：

```javascript
rootStore.client.updateUserInfo({
  nickname: 'nickname',
  avatarurl: 'https://example.com/image',
});
```

对于在联系人列表、会话列表、会话、群成员等位置，UIKit 内部会自动获取其他用户的个人信息展示头像和昵称。

- 如果用户头像和昵称的不存放在环信服务器，初始化时需要配置不使用用户属性功能：

```jsx

// ...

<UIKitProvider initConfig={{
    useUserInfo: false // 关闭自动使用用户属性
}}>
    <ChatApp>
</UIKitProvider>

```

然后监听联系人数据，自己获取每个用户的头像和昵称后设置到 UIKit 中，示例代码如下所示：

```jsx
import { useEffect } from 'react';

useEffect(() => {
  if (rootStore.loginState) {
    // 筛选出没有用户信息的用户 ID。
    const userIds = rootStore.addressStore.contacts
      .filter(item => !rootStore.addressStore.appUsersInfo[item.id])
      .map(item => {
        return item.id;
      });
    // 从自己的服务器获取用户头像昵称。
    getUserInfo(userIds).then(usersInfo => {
      //usersInfo: {[userId]: {avatarurl: '', nickname: '', userId: ''}}
      rootStore.addressStore.setAppUserInfo(usersInfo);
    });
  }
}, [rootStore.loginState, rootStore.addressStore.contacts.length]);
```

在群组会话中， UIKit 内部发消息时会在消息扩展中携带发送方的头像和昵称，收到消息的成员会根据消息中的信息展示头像和昵称，同时 UIKit 也会将这些信息存储到 `appUsersInfo` 中。当你需要查看群成员列表时，UIKit 会首先在 `appUsersInfo` 中获取个人信息，你需要查看哪些群成员的信息没有在 `appUsersInfo` 中，然后获取这些成员的个人信息设置到 `appUsersInfo` 中。

### 群头像

UIKit 内部没有获取群头像，需要用户自己设置到 UIKit 内部，形式和设置与个人信息类似。

示例代码：

```jsx
useEffect(() => {
  if (rootStore.loginState) {
    const groupIds =
      rootStore.addressStore.groups
        .filter(item => !item.avatarUrl)
        .map(item => {
          return item.groupid;
        }) || [];
    // 获取群组头像
    getGroupAvatar(groupIds).then(res => {
      // res: {[groupId]: 'avatarurl'}
      for (let groupId in res) {
        rootStore.addressStore.updateGroupAvatar(groupId, res[groupId]);
      }
    });
  }
}, [rootStore.loginState, rootStore.addressStore.groups.length]);
```


## UIKitProvider 属性概览

<table>
    <tr>
        <td>属性</td>
        <td>类型</td>
        <td>描述</td>
    </tr>
    <tr>
      <td style=font-size:15px>
        initConfig
      </td>
      <td style=font-size:15px>
        ProviderProps['initConfig']
      </td>
	  <td style=font-size:15px>初始化参数，如设置 appKey、userId、token、是否使用用户属性、翻译的目标语言</td>
      </tr>
	   <tr>
	   <td style=font-size:15px>
       local
        </td>
        <td style=font-size:15px>
       ProviderProps['local']
        </td>
	   <td style=font-size:15px>国际化配置参数，你可以在初始化时配置 i18next 的参数。</td>
	   </tr>
        <tr>
	   <td style=font-size:15px>
       features
        </td>
        <td style=font-size:15px>
       ProviderProps['features']
        </td>
	   <td style=font-size:15px>全局配置你需要的功能，UIKit 默认展示全部的功能。如果在相应的组件中也配置了需要的功能，以组件中的配置为准。</td> 
	   </tr>
        <tr>
	   <td style=font-size:15px>
       reactionConfig
        </td>
        <td style=font-size:15px>
       ProviderProps['reactionConfig']
        </td>
	   <td style=font-size:15px>全局配置消息表情回复功能的表情。如果在消息组件中也设置了这个参数，以消息组件中设置的为准。</td>
	   </tr>
     <tr>
     <td style=font-size:15px>
       theme
        </td>
        <td style=font-size:15px>
       ProviderProps['theme']
        </td>
	   <td style=font-size:15px>主题相关配置，如主要色、明暗主题、组件圆角。</td> 
	   </tr>
</table>
