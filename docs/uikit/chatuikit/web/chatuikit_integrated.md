# 集成单群聊 UIKit

<Toc />

使用单群聊 UIKit 之前，你需要将其集成到你的应用中。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- React 16.8.0 或以上版本；
- React DOM 16.8.0 或以上版本；
- 即时通讯 IM 项目和 App Key。

## 操作步骤

### 第一步 安装单群聊 UIKit

使用 `npm` 或者 `yarn` 安装 `easemob-chat-uikit`：

```bash
npm i easemob-chat-uikit --save;
```

### 第二步 引入所需组件

将单群聊 UIKit 组件导入到你的 React 项目中。

```jsx
// 导入组件
import {
  UIKitProvider,
  Chat,
  ConversationList,
  // ...
} from "easemob-chat-uikit";

// 导入样式
import "easemob-chat-uikit/style.css";
```

### 第三步 初始化

项目中用到的组件都需要在 `UIKitProvider` 内部使用。使用单群聊 UIKit 时，首先要配置 `UIKitProvider` 参数，示例如下：

若要实现自动登录，初始化时需传入 `userId`、`password` 或 `token`。 

你需要在环信控制台[创建 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)，获取用户 ID 和密码。如果使用 token，你需要从你的 App Server 获取用户 token，详见[使用环信用户 token 鉴权](/product/easemob_user_token.html) 。

```jsx
import React from 'react';
import { UIKitProvider } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';
ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <div>
    <UIKitProvider
      initConfig={{
        appKey: 'your app key', // 你的 app key
        userId: 'user ID', // 用户 ID
        password: 'password', // 如果使用密码登录，传入密码。
      }}
    />
  </div>
)
```

如要了解更多配置，详见 [`UIKitProvider` 文档](chatuikit_provider.html)。

### 第四步 登录

当 Provider 渲染和销毁时，单群聊 UIKit 内部会自动完成登录登出。

关于自动和手动登录，详见[登录文档](chatuikit_login.html)。

### 第五步 搭建界面

单群聊 UIKit 提供会话列表、聊天、群组设置和通讯录等组件。你可以使用这些组件搭建界面，这些组件支持自定义，具体可以参考相应组件的文档。

单群聊 UIKit 提供的 container 级别组件使用 flex 布局，默认宽高均为 100%，所以需要自己实现布局，然后将组件放在布局的容器组件中。

下面以会话列表和聊天组件组成的界面为例：

```jsx
import React from "react";
import { Chat, MessageList, TextMessage } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const App = () => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "30%", height: "100%" }}>
        <ConversationList />
      </div>
      <div style={{ width: "70%", height: "100%" }}>
        <Chat />
      </div>
    </div>
  );
};
```

## 相关参考

- [组件库源码](https://github.com/easemob/Easemob-UIKit-web)
- [其他示例 demo](https://github.com/easemob/Easemob-UIKit-web/demo)
