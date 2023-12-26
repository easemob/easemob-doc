# 快速开始

利用 ChatroomUIKit，你可以轻松实现聊天室内的用户交互。本文介绍如何实现在聊天室中发送第一条消息。

## 前提条件

- React 16.8.0 或以上版本；
- React DOM 16.8.0 或以上版本；
- 有效的 Easemob IM 开发者账号，并获取 App Key。

## 支持的浏览器

| 浏览器            | 支持的版本 |
| ----------------- | ---------- |
| Internet Explorer | 11 或以上  |
| Edge              | 43 或以上  |
| Firefox           | 10 或以上  |
| Chrome            | 54 或以上  |
| Safari            | 11 或以上  |

## 操作流程

### 第一步 创建项目

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

### 第二步 安装 easemob-chat-uikit

- 通过 npm 安装，运行以下命令：

```bash
npm install easemob-chat-uikit --save
```

- 通过 yarn 安装，运行以下命令：

```bash
yarn add easemob-chat-uikit
```

### 第三步 使用 easemob-chat-uikit 组件构建应用

将 easemob-chat-uikit 库导入到你的代码中：

```javascript
// App.js
import React, { Component, useEffect } from "react";
import {
  Provider,
  Chatroom,
  useClient,
  rootStore,
  ChatroomMember,
} from "agora-chat-uikit";
import "agora-chat-uikit/style.css";

const ChatroomApp = observer(() => {
  const client = useClient();
  const chatroomId = ""; // 要加入的聊天室
  const appKey = ""; // 你的 App Key

  useEffect(() => {
    if (client.addEventHandler) {
      client.addEventHandler("chatroom", {
        onConnected: () => {
          console.log("登录成功");
        },
      });
    }
  }, [client]);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const login = () => {
    client
      .open({
        user: userId,
        pwd: password,
        //accessToken: '',
      })
      .then((res) => {
        console.log("获取token成功");
      });
  };
  return (
    <>
      <Provider
        theme={{
          mode: "dark",
        }}
        initConfig={{
          appKey: appKey,
        }}
      >
        <div>
          <div>
            <label>userID</label>
            <input
              onChange={(e) => {
                setUserId(e.target.value);
              }}
            ></input>
          </div>
          <div>
            <label>password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
          </div>
          <div>
            <button onClick={login}>login</button>
          </div>
        </div>

        <div style={{ width: "350px" }}>
          <Chatroom chatroomId={chatroomId}></Chatroom>
        </div>
        <div style={{ width: "350px" }}>
          <ChatroomMember chatroomId={chatroomId}></ChatroomMember>
        </div>
      </Provider>
    </>
  );
});
export default ChatroomApp;
```

### 第四步 运行项目

```bash
npm run start
```

### 第五步 发送第一条消息

输入消息内容，点击 **发送** 按钮，发送消息。

[chatroom](./chatroom.png)
