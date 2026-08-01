# 按需导入 SDK

环信即时通讯 IM Web SDK 采用模块化设计。你可以通过 `ChatClient` 创建 SDK 实例，并根据业务需要注册对应的功能管理器（Manager），例如消息管理、联系人管理、群组管理、聊天室管理、在线状态管理和推送管理等。注册对应 Manager 后，即可通过 `client.chatManager`、`client.contactManager`、`client.groupManager` 等属性访问相关功能。

:::tip
1. 若项目只使用消息收发功能，通常只需注册 `ChatManager`。
2. 若需要使用好友、群组、聊天室、在线状态、推送等能力，请按需注册对应的 Manager。
3. 小程序和 uni-app 场景由 SDK 的跨平台运行时适配能力处理，SDK 会根据当前运行环境适配请求、上传、WebSocket、本地存储等基础能力。
:::

## 支持按需导入的 SDK 模块

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
| 用户属性管理 | `import { UserInfoManager } from "easemob-websdk";` 或 `import { UserInfoManager } from "easemob-websdk/managers/user-info";` | 通过 `managers` 参数或 `.use(UserInfoManager)` 注册后，调用 `client.userInfoManager`。 |

## 按需导入 SDK 模块

### 1. 安装 SDK

首先，通过 npm、yarn 或其他包管理工具安装 SDK。

```bash
# npm
npm install easemob-websdk

# yarn
yarn add easemob-websdk
```

### 2. 引入 SDK 和所需模块

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

### 3. 注册模块到 SDK 实例

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

### 4. 使用注册的模块

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

// 创建群组。
const group = await client.groupManager.createGroup({
  name: "test group",
  description: "group description",
  memberIds: ["user1", "user2"],
  public: true,
  joinApprovalRequired: false,
  allowInvites: true,
  inviteNeedConfirm: false,
});
```

## 与整体导入的接口差别

SDK 的主包会导出 `ChatClient` 以及各功能 Manager。无论你从主包统一导入，还是从 `easemob-websdk/managers/*` 子路径按需导入，接口调用方式保持一致：先通过 `ChatClient.init` 创建 SDK 实例，再注册所需 Manager，最后通过 `client.xxxManager` 调用对应功能。

本节以登录、登出、事件监听和发送消息为例进行说明。

### 登录与登出

示例代码如下：

```typescript
await client.login({
  userId: "userId",
  token: "token",
});

await client.logout();
```

### 事件监听

示例代码如下：

```typescript
client.addEventHandler("handlerId", {
  onConnected: () => {
    console.log("连接成功");
  },
  onDisconnected: reason => {
    console.log("连接断开", reason);
  },
  onTextMessage: message => {
    console.log("收到文本消息", message);
  },
});
```

如需移除监听器，可调用 `removeEventHandler`。

```typescript
client.removeEventHandler("handlerId");
```

### 发送消息

示例代码如下：

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: "userId",
  conversationType: "singleChat",
  content: "hello",
});

const sentMessage = await client.chatManager.sendMessage(message);
console.log("发送成功", sentMessage);
```

