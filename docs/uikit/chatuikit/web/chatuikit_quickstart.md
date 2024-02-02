# 快速开始

<Toc />

利用环信单群聊 UIKit，你可以轻松实现单群和群聊。本文介绍如何快速实现在单聊会话中发送消息。

## 前提条件

开启单群聊 UIKit 服务前，需确保已经具备以下条件：

- React 16.8.0 或以上版本；
- React DOM 16.8.0 或以上版本；
- 已在[环信即时通讯云控制台](https://console.easemob.com/user/login)创建了有效的环信即时通讯 IM 开发者账号，并[获取了 App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。

## 支持的浏览器

| 浏览器    | 支持的版本 |
| --------- | ---------- |
| IE 浏览器  | 11 或以上  |
| Edge      | 43 或以上  |
| Firefox   | 10 或以上  |
| Chrome    | 54 或以上  |
| Safari    | 11 或以上  |

## 实现发送第一条单聊消息

### 第一步 创建 chat-uikit 项目

```bash
# 安装 CLI 工具。
npm install create-react-app
# 构建一个 my-app 的项目。
npx create-react-app my-app
cd my-app
```

```
项目目录：
├── package.json
├── public                  # Webpack 的静态目录。
│   ├── favicon.ico
│   ├── index.html          # 默认的单页面应用。
│   └── manifest.json
├── src
│   ├── App.css             # App 根组件的 CSS。
│   ├── App.js              # App 组件代码。
│   ├── App.test.js
│   ├── index.css           # 启动文件样式。
│   ├── index.js            # 启动文件。
│   ├── logo.svg
│   └── serviceWorker.js
└── yarn.lock
```

### 第二步 集成 easemob-chat-uikit

#### 安装 easemob-chat-uikit

- 若通过 npm 安装，运行以下命令：

```bash
npm install easemob-chat-uikit --save
```

- 若通过 yarn 安装，运行以下命令：

```bash
yarn add easemob-chat-uikit
```

#### 使用 easemob-chat-uikit 组件构建应用

为了方便快速体验，你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**应用概览** > **用户认证**页面创建用户并查看用户 token。**用户认证**页面中的用户仅用于快速体验或调试目的。

在开发环境中，你需要在环信控制台[创建 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)，从你的 App Server 获取用户 token，详见[使用环信用户 token 鉴权](/product/easemob_user_token.html) 。

将 easemob-chat-uikit 库导入你的代码中：

```javascript
// App.js
import React, { Component, useEffect } from "react";
import {
  Provider,
  Chat,
  ConversationList,
  useClient,
  rootStore,
} from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const ChatApp = () => {
  const client = useClient();
  useEffect(() => {
    client &&
      client
        .open({
          user: "",
          token: "",
        })
        .then((res) => {
          // 创建会话
          rootStore.conversationStore.addConversation({
            chatType: "singleChat", // 单聊和群聊分别为 'singleChat' 和 'groupChat'。
            conversationId: "userId", // 单聊为对端用户 ID，群聊为群组 ID。
            name: "用户1", // 单聊为对端用户昵称，群聊为群组名称。
            lastMessage: {},
          });
        });
  }, [client]);

  return (
    <div>
      <div>
        <ConversationList />
      </div>
      <div>
        <Chat />
      </div>
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <Provider
        initConfig={{
          appKey: "your app key",
        }}
      >
        <ChatApp />
      </Provider>
    );
  }
}

export default App;
```

### 第三步 运行项目并发送你的第一条消息

1. 运行项目：

```bash
npm run start
```

在浏览器可看到你的应用。

2. 输入你的第一条消息并发送。

:::tip
使用自定义 App Key 时，由于没有联系人，需先添加好友。
:::

![img](@static/images/uikit/chatweb/chat.png = 480x350)
