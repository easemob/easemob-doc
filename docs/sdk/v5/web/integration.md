# Import the SDK

This document describes how to integrate the EasyIM Web SDK into your Web project.

## Development environment requirements

- A modern browser such as Chrome, Firefox, Safari, or another browser that uses one of these browser engines, such as Microsoft Edge, is supported.
- Internet Explorer (IE) is not supported.
- Your project must support npm package management or allow you to include browser script files.

## Import process

### Step 1: Install the SDK using npm

```bash
npm install easemob-websdk
```

### Step 2: Import the SDK

You can import the SDK in the following ways. For Web projects that use a build tool, we recommend installing the SDK through npm and importing SDK modules on demand to reduce the final bundle size.

#### Import the SDK through npm

The SDK has a modular design. You can use `ChatClient` to create an SDK instance and register the required feature managers based on your business requirements. These managers provide capabilities such as message and conversation management, friend management, chat group management, chat room management, message thread management, presence management, push management, and user profile management.

Each feature module is provided as a Manager. After registering a Manager, access its features through properties such as `client.chatManager`, `client.contactManager`, and `client.groupManager`.

:::tip
1. If your project uses only message sending and receiving, you generally need to register only `ChatManager`.
2. To use friends, chat groups, chat rooms, presence, push, and other features, register the corresponding Managers as needed.
3. For Mini Program and uni-app projects, the SDK's cross-platform runtime adaptation capabilities handle basic functions such as requests, uploads, WebSocket, and local storage based on the current runtime environment.
:::

#### Import SDK modules on demand

##### 1. Install the SDK

First, install the SDK using npm, yarn, or another package manager.

```bash
# npm
npm install easemob-websdk

# yarn
yarn add easemob-websdk
```

##### 2. Import the SDK and required modules

Import `ChatClient` and the required feature managers. For example, to use only message sending and receiving, friend, and chat group capabilities, import them as follows:

```typescript
import {
  ChatClient,
  ChatManager,
  ContactManager,
  GroupManager,
} from "easemob-websdk";
```

To further control the bundle entry points, you can also import the corresponding modules from the Manager subpaths:

```typescript
import { ChatClient } from "easemob-websdk";
import { ChatManager } from "easemob-websdk/managers/chat";
import { ContactManager } from "easemob-websdk/managers/contact";
import { GroupManager } from "easemob-websdk/managers/group";
```

##### 3. Register modules with the SDK instance

Register feature managers through the `managers` parameter during initialization or through the chained `.use()` method after initialization.

```typescript
// Method one: Register the managers during initialization.
const client = ChatClient.init({
  appKey: "your appKey",
  managers: [ChatManager, ContactManager, GroupManager],
});
```

```typescript
// Method two: Register the managers through the chained use method.
const client = ChatClient.init({
  appKey: "your appKey",
})
  .use(ChatManager)
  .use(ContactManager)
  .use(GroupManager);
```

##### 4. Use the registered modules

After registering the required modules, call their features through the corresponding Manager properties on the SDK instance.

```typescript
// Create and send a text message.
const message = client.chatManager.createTextMessage({
  conversationId: "userId",
  conversationType: "singleChat",
  content: "hello",
});

await client.chatManager.sendMessage(message);

// Retrieve the friend list.
const contacts = await client.contactManager.getContacts();
```

##### SDK modules that support on-demand importing

| Feature | Import statement | Usage |
| :--- | :--- | :--- |
| SDK initialization and connection management | `import { ChatClient } from "easemob-websdk";` | `ChatClient.init({ appKey: "your appKey" });` |
| Message and conversation management | `import { ChatManager } from "easemob-websdk";` or `import { ChatManager } from "easemob-websdk/managers/chat";` | Register it through the `managers` parameter or `.use(ChatManager)`, and then call `client.chatManager`. |
| Friend management | `import { ContactManager } from "easemob-websdk";` or `import { ContactManager } from "easemob-websdk/managers/contact";` | Register it through the `managers` parameter or `.use(ContactManager)`, and then call `client.contactManager`. |
| Chat group management | `import { GroupManager } from "easemob-websdk";` or `import { GroupManager } from "easemob-websdk/managers/group";` | Register it through the `managers` parameter or `.use(GroupManager)`, and then call `client.groupManager`. |
| Chat room management | `import { ChatRoomManager } from "easemob-websdk";` or `import { ChatRoomManager } from "easemob-websdk/managers/chatroom";` | Register it through the `managers` parameter or `.use(ChatRoomManager)`, and then call `client.chatRoomManager`. |
| Message thread management | `import { ChatThreadManager } from "easemob-websdk";` or `import { ChatThreadManager } from "easemob-websdk/managers/chat-thread";` | Register it through the `managers` parameter or `.use(ChatThreadManager)`, and then call `client.chatThreadManager`. |
| Presence management | `import { PresenceManager } from "easemob-websdk";` or `import { PresenceManager } from "easemob-websdk/managers/presence";` | Register it through the `managers` parameter or `.use(PresenceManager)`, and then call `client.presenceManager`. |
| Push management | `import { PushManager } from "easemob-websdk";` or `import { PushManager } from "easemob-websdk/managers/push";` | Register it through the `managers` parameter or `.use(PushManager)`, and then call `client.pushManager`. |
| User profile management | `import { UserInfoManager } from "easemob-websdk";` or `import { UserInfoManager } from "easemob-websdk/managers/user-info";` | Register it through the `managers` parameter or `.use(UserInfoManager)`, and then call `client.userInfoManager`. |

#### Download and import the SDK from the official website

If your project does not use an npm package manager, download the browser script file and include it on the page.

1. [Download the Web SDK](http://easyim.ai/sdk#Web) and save the SDK browser script file in your project.

2. Include the SDK script file in `index.html`.

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
When imported through a browser script, the SDK is mounted on the global variable `IMSDK`. If you use an SDK file downloaded from the official website, adjust the `script` path to match the actual filename.
:::

#### Import the SDK into a Nuxt or Next project

For a server-side rendering framework such as Nuxt or Next, import the SDK during client-side rendering to avoid accessing browser runtime capabilities during server-side rendering.

1. In a Nuxt project, dynamically import the SDK during a client lifecycle hook:

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

2. In a Next project, import the SDK in a client component. Add the `use client` directive at the top of the file and dynamically import the SDK in `useEffect`.

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
