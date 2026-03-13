# UIKitProvider

`easemob-chat-uikit` 提供了 `UIKitProvider`（以下简称 `Provider`）组件管理数据。该组件本身不渲染任何 UI，主要作用包括：

- 为子组件提供全局 Context；
- 自动监听 SDK 相关事件；
- 在组件树中向下传递数据来驱动组件更新。

所有 UIKit 内的其他组件都必须嵌套在 `UIKitProvider` 内部才能正常工作。

## 使用示例

### 基础使用

通过 `Provider` 设置 App Key、用户 ID 和用户 Token（或用户密码）：

```jsx
import React from 'react';
import { Provider } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';
import ChatApp from './ChatApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider
    initConfig={{
      appKey: 'your app key',
      userId: 'user123',
      token: 'user_token', // 或使用 password: 'password'
    }}
  >
    <ChatApp />
  </Provider>,
);
```

### 完整配置

`Provider` 支持全方位的参数配置，允许你根据需求自定义主题、功能、本地化及交互细节。以下为完整配置示例，各参数详情请参考 [UIKitProvider 属性概览](#uikitprovider-属性概览)。

```jsx
import React from 'react';
import { Provider } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider
    initConfig={{
      appKey: 'your app key',
      userId: 'user123',
      token: 'user_token',
      translationTargetLanguage: 'zh', // 翻译目标语言
      useUserInfo: true, // 是否使用用户信息
      maxMessages: 200, // 单个会话显示最大消息数
      countMemberJoinToUnread: false, // 聊天室成员加入消息是否计入未读数
    }}
    theme={{
      mode: 'light', // 'light' | 'dark'
      primaryColor: '#00CE76', // 主题色（十六进制颜色值或色相值 0-360）
      avatarShape: 'circle', // 'circle' | 'square'
      bubbleShape: 'round', // 'round' | 'square'
      componentsShape: 'round', // 消息气泡、按钮等：'round' | 'square' 
      ripple: true, // 是否显示涟漪效果
    }}
    local={{
      fallbackLng: 'zh',
      lng: 'zh',
      resources: {
        zh: {
          translation: {
            conversationTitle: '会话列表',
            deleteCvs: '删除会话',
            // 更多翻译...
          },
        },
      },
    }}
    features={{
      conversationList: {
        search: true,
        item: {
          moreAction: true,
          deleteConversation: true,
          pinConversation: true,
          muteConversation: true,
          presence: true,
        },
      },
      chat: {
        header: {
          threadList: true,
          moreAction: true,
          clearMessage: true,
          deleteConversation: false,
          audioCall: true,
          videoCall: true,
          pinMessage: true,
        },
        message: {
          status: true,
          thread: true,
          reaction: true,
          moreAction: true,
          reply: true,
          delete: true,
          recall: true,
          translate: true,
          edit: true,
          select: true,
          forward: true,
          report: true,
          pin: true,
        },
        messageInput: {
          mention: true,
          typing: true,
          record: true,
          emoji: true,
          moreAction: true,
          file: true,
          picture: true,
          video: true,
          contactCard: true,
        },
      },
      chatroom: {
        messageInput: {
          emoji: true,
          gift: true,
        },
      },
    }}
    reactionConfig={{
      map: {
        emoji_1: <img src="customIcon1.png" alt="emoji_1" />,
        emoji_2: <img src="customIcon2.png" alt="emoji_2" />,
      },
    }}
    presenceMap={{
      Online: '/path/to/online.png',
      Offline: '/path/to/offline.png',
      Away: '/path/to/away.png',
      Busy: '/path/to/busy.png',
      'Do Not Disturb': '/path/to/dnd.png',
      Custom: '/path/to/custom.png',
    }}
  >
    <ChatApp />
  </Provider>,
);
```

## 自动登录

若在初始化时已提供 `userId` 与 `token`（或 `password`），UIKit 将在 `Provider` 加载完成后自动执行登录操作，并在其卸载时自动登出。

```jsx
<Provider
  initConfig={{
    appKey: 'your app key',
    userId: 'user123',
    token: 'user_token', // 使用 token 登录（推荐）
    // 或使用 password: 'password' // 使用密码登录
  }}
>
  <ChatApp />
</Provider>
```

若希望自行控制登录与登出的时机，可以仅传入 `appKey`，然后通过 `useClient` hook 获取客户端实例，进行登录。

```jsx
import { Provider, useClient } from 'easemob-chat-uikit';

const ChatApp = () => {
  const client = useClient();

  const login = () => {
    client.open({
      user: 'user123',
      token: 'user_token',
    });
  };

  return <button onClick={login}>登录</button>;
};

<Provider initConfig={{ appKey: 'your app key' }}>
  <ChatApp />
</Provider>;
```

## UIKitProvider 属性概览

### 初始化配置 

初始化配置 `initConfig`，包含 SDK 连接和 UIKit 行为相关的配置。

| 参数 | 类型 | 默认值 | 描述 |
| :-- | :-- | :-- | :-- |
| `appKey` | String | - | **必需**，应用的 App Key |
| `userId` | String | - | 用户 ID，若提供则自动登录 |
| `token` | String | - | 用户 Token，与 `userId` 配合进行自动登录（推荐） |
| `password` | String | - | 用户密码，与 `userId` 配合进行自动登录 |
| `translationTargetLanguage` | String | - | 翻译目标语言，如 'zh'、'en' 等 |
| `useUserInfo` | Boolean | - | 是否使用用户信息，启用后会自动获取用户信息 |
| `msyncUrl` | String | - | 自定义消息同步服务地址 |
| `restUrl` | String | - | 自定义 REST API 服务地址 |
| `isHttpDNS` | Boolean | `true` | 是否使用 HTTP DNS |
| `useReplacedMessageContents` | Boolean | - | 是否使用替换后的消息内容 |
| `deviceId` | String | - | 设备 ID |
| `maxMessages` | `number` | `200` | 单个会话显示最大消息数。超出后会自动清除，可通过拉取更多消息恢复 |
| `isFixedDeviceId` | Boolean | `true` | 是否固定设备 ID |
| `useOwnUploadFun` | Boolean | `false` | 是否使用自定义上传函数 |
| `countMemberJoinToUnread` | Boolean | `false` | 聊天室成员加入消息是否计入未读数。`false`：不计入，`true`：计入 |

### 国际化配置

对于国际化配置 `local`，你可以在初始化时配置 `i18next` 的参数。

| 参数 | 类型 | 描述 |
| :-- | :-- | :-- |
| `fallbackLng` | String | 回退语言，当前语言资源缺失时使用 |
| `lng` | String | 当前语言代码，如 'zh'、'en' 等 |
| `resources` | Object | 翻译资源对象，格式为 `{ [language]: { translation: { [key]: string } } }` |

使用示例：

```jsx
<Provider
  local={{
    fallbackLng: 'zh',
    lng: 'zh',
    resources: {
      zh: {
        translation: {
          conversationTitle: '会话列表',
          deleteCvs: '删除会话',
          send: '发送',
          // 更多翻译...
        },
      },
      en: {
        translation: {
          conversationTitle: 'Conversation List',
          deleteCvs: 'Delete Conversation',
          send: 'Send',
        },
      },
    },
  }}
>
  <ChatApp />
</Provider>
```

所有界面文本可在 [GitHub 文档](https://github.com/easemob/Easemob-UIKit-web/tree/dev/local) 中查看。

### 全局功能配置

全局功能配置 `features` 默认启用 UIKit 全部功能，但支持在组件级别进行覆盖，组件内若存在相同配置，将以组件配置为准。

#### conversationList

会话列表功能配置。

| 参数                      | 类型      | 默认值 | 描述                 |
| :------------------------ | :-------- | :----- | :------------------- |
| `search`                  | Boolean | `true` | 是否显示搜索栏       |
| `item.moreAction`         | Boolean | `true` | 是否显示更多操作菜单 |
| `item.deleteConversation` | Boolean | `true` | 是否允许删除会话     |
| `item.pinConversation`    | Boolean | `true` | 是否允许置顶会话     |
| `item.muteConversation`   | Boolean | `true` | 是否允许免打扰会话   |
| `item.presence`           | Boolean | `true` | 是否显示在线状态     |

#### chat

聊天页面功能配置。

- **header（标题栏）**

| 参数                 | 类型      | 默认值 | 描述                 |
| :------------------- | :-------- | :----- | :------------------- |
| `threadList`         | Boolean | `true` | 是否显示话题列表     |
| `moreAction`         | Boolean | `true` | 是否显示更多操作菜单 |
| `clearMessage`       | Boolean | `true` | 是否允许清除消息     |
| `deleteConversation` | Boolean | `true` | 是否允许删除会话     |
| `audioCall`          | Boolean | `true` | 是否显示语音通话按钮 |
| `videoCall`          | Boolean | `true` | 是否显示视频通话按钮 |
| `pinMessage`         | Boolean | `true` | 是否允许置顶消息     |

- **message（消息）**

| 参数         | 类型      | 默认值 | 描述                                       |
| :----------- | :-------- | :----- | :----------------------------------------- |
| `status`     | Boolean | `true` | 是否显示消息状态（已发送、已送达、已读等） |
| `thread`     | Boolean | `true` | 是否支持话题功能                           |
| `reaction`   | Boolean | `true` | 是否支持消息表情回复                       |
| `moreAction` | Boolean | `true` | 是否显示更多操作菜单                       |
| `reply`      | Boolean | `true` | 是否支持回复消息                           |
| `delete`     | Boolean | `true` | 是否允许删除消息                           |
| `recall`     | Boolean | `true` | 是否允许撤回消息                           |
| `translate`  | Boolean | `true` | 是否支持翻译消息                           |
| `edit`       | Boolean | `true` | 是否允许编辑消息                           |
| `select`     | Boolean | `true` | 是否支持多选消息                           |
| `forward`    | Boolean | `true` | 是否支持转发消息                           |
| `report`     | Boolean | `true` | 是否支持举报消息                           |
| `pin`        | Boolean | `true` | 是否允许置顶消息                           |

- **messageInput（底部输入框）**

| 参数          | 类型      | 默认值 | 描述                 |
| :------------ | :-------- | :----- | :------------------- |
| `mention`     | Boolean | `true` | 是否支持 @ 提及功能  |
| `typing`      | Boolean | `true` | 是否显示正在输入状态 |
| `record`      | Boolean | `true` | 是否支持语音录制     |
| `emoji`       | Boolean | `true` | 是否显示表情按钮     |
| `moreAction`  | Boolean | `true` | 是否显示更多操作按钮  |
| `file`        | Boolean | `true` | 是否支持发送文件     | 
| `picture`     | Boolean | `true` | 是否支持发送图片     |
| `video`       | Boolean | `true` | 是否支持发送视频     |
| `contactCard` | Boolean | `true` | 是否支持发送名片     |

#### chatroom

聊天室功能配置。

| 参数                 | 类型      | 默认值 | 描述             |
| :------------------- | :-------- | :----- | :--------------- |
| `messageInput.emoji` | Boolean | `true` | 是否显示表情按钮 |
| `messageInput.gift`  | Boolean | `true` | 是否显示礼物按钮 |

使用示例如下：

```jsx
<Provider
  features={{
    conversationList: {
      search: false, // 隐藏搜索栏
      item: {
        moreAction: false, // 隐藏更多操作菜单
      },
    },
    chat: {
      header: {
        audioCall: false, // 隐藏语音通话按钮
        videoCall: false, // 隐藏视频通话按钮
      },
      message: {
        translate: false, // 禁用翻译功能
        edit: false, // 禁用编辑功能
      },
      messageInput: {
        mention: false, // 禁用 @ 提及功能
        record: false, // 禁用语音录制
      },
    },
    chatroom: {
      messageInput: {
        emoji: false, // 隐藏表情按钮
        gift: false, // 隐藏礼物按钮
      },
    },
  }}
>
  <ChatApp />
</Provider>
```

### 消息表情回复

消息表情回复功能的表情全局配置 `reactionConfig`。若消息组件内也配置了相同参数，则优先采用组件配置。

| 参数 | 类型 | 描述 |
| :-- | :-- | :-- |
| `map` | object | 表情映射对象，格式为 `{ [key]: HTMLImageElement }`，其中 `key` 为表情标识，`value` 为图片元素 |

使用示例如下：

```jsx
<Provider
  reactionConfig={{
    map: {
      emoji_1: <img src="customIcon1.png" alt="emoji_1" />,
      emoji_2: <img src="customIcon2.png" alt="emoji_2" />,
      emoji_3: <img src="customIcon3.png" alt="emoji_3" />,
    },
  }}
>
  <ChatApp />
</Provider>
```

### 主题样式配置

主题样式配置 `theme`，用于自定义 UIKit 的视觉外观。

| 参数 | 类型 | 默认值 | 描述 |
| :-- | :-- | :-- | :-- |
| `mode` | `'light' \| 'dark'` | `'light'` | 主题模式，亮色或暗色 |
| `primaryColor` | `string \| number` | - | 主题色，可以是十六进制颜色值（如 `'#00CE76'`）或色相值（0-360 的数字） |
| `avatarShape` | `'circle' \| 'square'` | - | 头像形状，圆形或方形 |
| `bubbleShape` | `'round' \| 'square'` | - | 消息气泡形状，圆角（默认）或方形|
| `componentsShape` | `'round' \| 'square'` | - | 组件形状，圆角（默认）或方形 |
| `ripple` | `boolean` | - | 是否显示涟漪效果：默认不显示|

使用示例如下：

```jsx
<Provider
  theme={{
    mode: 'dark', // 暗色主题
    primaryColor: '#00CE76', // 主题色（十六进制）
    // 或 primaryColor: 203, // 主题色（色相值 0-360）
    avatarShape: 'circle', // 圆形头像
    bubbleShape: 'round', // 圆角气泡
    componentsShape: 'round', // 圆角组件
    ripple: true, // 显示涟漪效果
  }}
>
  <ChatApp />
</Provider>
```

### 在线状态图标映射 

在线状态图标映射 `presenceMap`，用于自定义在线状态的显示图标。

| 参数             | 类型                         | 描述           |
| :--------------- | :--------------------------- | :------------- |
| `Online`         | `String \| HTMLImageElement` | 在线状态图标   |
| `Offline`        | `String \| HTMLImageElement` | 离线状态图标   |
| `Away`           | `String \| HTMLImageElement` | 离开状态图标   |
| `Busy`           | `String \| HTMLImageElement` | 忙碌状态图标   |
| `Do Not Disturb` | `String \| HTMLImageElement` | 免打扰状态图标   |
| `Custom`         | `String \| HTMLImageElement` | 自定义状态图标 |

使用示例如下：

```jsx
import OnlineIcon from './assets/online.png';
import OfflineIcon from './assets/offline.png';

<Provider
  presenceMap={{
    Online: OnlineIcon, // 使用图片路径或图片元素
    Offline: OfflineIcon,
    Away: '/path/to/away.png',
    Busy: '/path/to/busy.png',
    'Do Not Disturb': '/path/to/dnd.png',
    Custom: '/path/to/custom.png',
  }}
>
  <ChatApp />
</Provider>;
```

## 注意事项

| 项            | 注意事项  |
| :-------------- | :----- | 
| 自动登录           | 当传入 `userId` 与 `token`（或 `password`）时，UIKit 将自动登录。`Provider` 卸载时将自动执行登出。  |
| 功能配置优先级           | 组件级别的配置优先级高于全局配置。  |
| 主题色格式           | `primaryColor` 支持以下两种格式：<br/> - 十六进制颜色值：例如 `'#00CE76'` <br/> - 色相值（取值范围 0-360）：例如 `203`  |
| 国际化资源           | 所有界面文本的翻译 key 可在 [GitHub 文档](https://github.com/easemob/Easemob-UIKit-web/tree/dev/local) 中查看。  |
| 聊天室未读数           | 通过 `countMemberJoinToUnread` 控制聊天室成员加入消息是否计入未读数。设置为 `false` 时，加入消息不计入未读数；设置为 `true` 则计入未读数。   |
