# 导入 SDK

本文介绍如何将环信即时通讯 IM Web SDK 集成到你的 Web 项目。

## 开发环境要求

- 支持现代浏览器，例如 Chrome、Firefox、Safari 以及使用这些引擎的其他浏览器（例如 Microsoft Edge）。
- 不支持 Internet Explorer（IE）浏览器。
- 项目需支持 npm 包管理或能够引入浏览器脚本文件。

## 导入流程

### 步骤 1：使用 npm 安装 SDK

```bash
npm install easemob-websdk
```

### 步骤 2：引入 SDK

你可以通过以下方式引入 SDK。对于使用构建工具的 Web 项目，推荐通过 npm 安装并按需导入 SDK 模块，从而减少最终打包体积。

#### 通过 npm 导入 SDK

SDK 采用模块化设计。你可以通过 `ChatClient` 创建 SDK 实例，并根据业务需要注册对应的功能管理器（Manager），例如，消息和会话管理、好友管理、群组管理、聊天室管理、消息话题管理、在线状态管理、推送管理和用户资料管理等。

各功能模块以 Manager 的形式提供。注册对应 Manager 后，即可通过 `client.chatManager`、`client.contactManager`、`client.groupManager` 等属性访问相关功能。

:::tip
1. 若项目只使用消息收发功能，通常只需注册 `ChatManager`。
2. 若需要使用好友、群组、聊天室、在线状态、推送等功能，请按需注册对应的 Manager。
3. 小程序和 uni-app 场景由 SDK 的跨平台运行时适配能力处理，SDK 会根据当前运行环境适配请求、上传、WebSocket、本地存储等基础功能。
:::

#### 按需导入 SDK 模块

##### 1. 安装 SDK

首先，通过 npm、yarn 或其他包管理工具安装 SDK。

```bash
# npm
npm install easemob-websdk

# yarn
yarn add easemob-websdk
```

##### 2. 引入 SDK 和所需模块

根据项目需要引入 `ChatClient` 和对应的功能管理器。例如，只使用消息收发、好友和群组能力时，可按如下方式引入：

```typescript
import {
  ChatClient,
  ChatManager,
  ContactManager,
  GroupManager,
} from "easemob-websdk";
```

如果项目希望进一步控制打包入口，也可以从 Manager 子路径导入对应模块：

```typescript
import { ChatClient } from "easemob-websdk";
import { ChatManager } from "easemob-websdk/managers/chat";
import { ContactManager } from "easemob-websdk/managers/contact";
import { GroupManager } from "easemob-websdk/managers/group";
```

##### 3. 注册模块到 SDK 实例

你可以在初始化时通过 `managers` 参数注册功能管理器，也可以在初始化后通过链式 `.use()` 方法注册。

```typescript
// 方式一：初始化时注册。
const client = ChatClient.init({
  appKey: "your appKey",
  managers: [ChatManager, ContactManager, GroupManager],
});
```

```typescript
// 方式二：通过链式 use 方法注册。
const client = ChatClient.init({
  appKey: "your appKey",
})
  .use(ChatManager)
  .use(ContactManager)
  .use(GroupManager);
```

##### 4. 使用注册的模块

注册所需模块后，即可通过 SDK 实例上的对应 Manager 属性调用相关功能。

```typescript
// 创建并发送文本消息。
const message = client.chatManager.createTextMessage({
  conversationId: "userId",
  conversationType: "singleChat",
  content: "hello",
});

await client.chatManager.sendMessage(message);

// 获取好友列表。
const contacts = await client.contactManager.getContacts();
```

##### 支持按需导入的 SDK 模块

| 功能 | 导入文件 | 使用方式 |
| :--- | :--- | :--- |
| SDK 初始化与连接管理 | `import { ChatClient } from "easemob-websdk";` | `ChatClient.init({ appKey: "your appKey" });` |
| 消息和会话管理 | `import { ChatManager } from "easemob-websdk";` 或 `import { ChatManager } from "easemob-websdk/managers/chat";` | 通过 `managers` 参数或 `.use(ChatManager)` 注册后，调用 `client.chatManager`。 |
| 好友管理 | `import { ContactManager } from "easemob-websdk";` 或 `import { ContactManager } from "easemob-websdk/managers/contact";` | 通过 `managers` 参数或 `.use(ContactManager)` 注册后，调用 `client.contactManager`。 |
| 群组管理 | `import { GroupManager } from "easemob-websdk";` 或 `import { GroupManager } from "easemob-websdk/managers/group";` | 通过 `managers` 参数或 `.use(GroupManager)` 注册后，调用 `client.groupManager`。 |
| 聊天室管理 | `import { ChatRoomManager } from "easemob-websdk";` 或 `import { ChatRoomManager } from "easemob-websdk/managers/chatroom";` | 通过 `managers` 参数或 `.use(ChatRoomManager)` 注册后，调用 `client.chatRoomManager`。 |
| 消息话题管理 | `import { ChatThreadManager } from "easemob-websdk";` 或 `import { ChatThreadManager } from "easemob-websdk/managers/chat-thread";` | 通过 `managers` 参数或 `.use(ChatThreadManager)` 注册后，调用 `client.chatThreadManager`。 |
| 在线状态管理 | `import { PresenceManager } from "easemob-websdk";` 或 `import { PresenceManager } from "easemob-websdk/managers/presence";` | 通过 `managers` 参数或 `.use(PresenceManager)` 注册后，调用 `client.presenceManager`。 |
| 推送管理 | `import { PushManager } from "easemob-websdk";` 或 `import { PushManager } from "easemob-websdk/managers/push";` | 通过 `managers` 参数或 `.use(PushManager)` 注册后，调用 `client.pushManager`。 |
| 用户资料管理 | `import { UserInfoManager } from "easemob-websdk";` 或 `import { UserInfoManager } from "easemob-websdk/managers/user-info";` | 通过 `managers` 参数或 `.use(UserInfoManager)` 注册后，调用 `client.userInfoManager`。 |

#### 从官网获取并导入 SDK

如果项目不使用 npm 包管理工具，也可以下载浏览器脚本文件并在页面中引入。

1. [下载 Web SDK](https://www.easemob.com/download/im#Web)，将 SDK 浏览器脚本文件保存到你的项目中。

2. 在 `index.html` 文件中引入 SDK 脚本文件。

```html
<script src="./im-sdk-web.iife.js"></script>
<script>
  const { ChatClient, ChatManager } = window.IMSDK;

  const client = ChatClient.init({
    appKey: "your appKey",
    managers: [ChatManager],
  });
</script>
```

:::tip
通过浏览器脚本方式引入时，SDK 会挂载到全局变量 `IMSDK`。如果你使用的是从官网下载的 SDK 文件，请以实际文件名为准调整 `script` 路径。
:::

#### Nuxt 或 Next 项目中引入 SDK

对于服务端渲染框架（如 Nuxt、Next 等），需要在客户端渲染阶段引入 SDK，避免在服务端渲染阶段访问浏览器运行时能力。

1. Nuxt 项目中，可以在客户端生命周期中动态导入 SDK：

```javascript
export default {
  mounted() {
    import("easemob-websdk").then(({ ChatClient, ChatManager }) => {
      const client = ChatClient.init({
        appKey: "your appKey",
        managers: [ChatManager],
      });

      console.log(client, "easemob websdk");
    });
  },
};
```

2. Next 项目中，可以在客户端组件中引入 SDK。你可以在文件顶部添加 `use client` 指令，并在 `useEffect` 中动态导入 SDK。

```typescript
"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    import("easemob-websdk").then(({ ChatClient, ChatManager }) => {
      const client = ChatClient.init({
        appKey: "your appKey",
        managers: [ChatManager],
      });

      console.log(client, "easemob websdk");
    });
  }, []);

  return null;
}
```
