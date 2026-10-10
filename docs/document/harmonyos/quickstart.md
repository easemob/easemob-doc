# 快速开始

<Toc />

本文介绍如何快速集成环信即时通讯 IM HarmonyOS SDK 实现单聊。


## 实现原理

下图展示在客户端发送和接收一对一文本消息的工作流程。

![img](/images/android/sendandreceivemsg.png)

## 前提条件

- DevEco Studio NEXT Release（5.0.3.900）及以上；
- HarmonyOS SDK API 12 及以上；
- HarmonyOS 5.x（API 12）或以上版本的真机或模拟器；
- 有效的环信即时通讯 IM 开发者账号和 App Key，见 [环信控制台](https://console.easemob.com/user/login)。

## 准备开发环境

本节介绍如何创建项目，将环信即时通讯 IM HarmonyOS SDK 集成到你的项目中，并添加相应的设备权限。

### 1. 创建 HarmonyOS 项目

参考以下步骤创建一个 HarmonyOS 项目。

1. 打开 DevEco Studio，点击 **Create Project**。
2. 在 **Choose Your Ability Template** 界面，选择 **Application > Empty Ability**，然后点击 **Next**。
3. 在 **Configure Your Project** 界面，依次填入以下内容：
   - **Project name**：你的 HarmonyOS 项目名称，如 HelloWorld。
   - **Bundle name**：你的项目包的名称，如 com.hyphenate.helloworld。
   - **Save location**：项目的存储路径。
   - **Compatible SDK**：项目的支持的最低 API 等级，选择 `5.0.0(12)` 及以上。
   - **Module name**：模块名称，默认为 `entry`。

4. 点击 **Finish**。根据屏幕提示，安装所需插件。

上述步骤使用 **DevEco Studio NEXT Release（5.0.3.900）** 示例。

### 2. 在工程 `build-profile.json5` 中设置支持字节码 HAR 包。

修改工程级 `build-profile.json5` 文件，在 `products` 节点下设置 `useNormalizedOHMUrl` 为 `true`。

```json5
{
  "app": {
    "products": [
      {
         "buildOption": {
           "strictMode": {
             "useNormalizedOHMUrl": true
           }
         }
      }
    ]
  }
}
```

:::tip
- HarmonyOS SDK v5.x 采用字节码 HAR 方式打包，必须将 `useNormalizedOHMUrl` 设置为 `true`。
- 工程包含多个 product 时，应在实际参与构建的各个 product 中设置该选项。
:::

### 2. 集成 SDK

打开 [SDK 下载](https://www.easemob.com/download/im#HarmonyOS) 页面，下载环信即时通讯 IM HarmonyOS SDK 5.x，得到 HAR 文件。

将 SDK 文件复制到需要使用 SDK 的模块中，例如放至 `HelloWorld` 工程的 `entry/libs` 目录。

修改模块目录的 `oh-package.json5` 文件，在 `dependencies` 节点增加依赖声明。

```json5
{
  "name": "entry",
  "version": "1.0.0",
  "description": "Please describe the basic information.",
  "main": "",
  "author": "",
  "license": "",
  "dependencies": {
    "@easemob/chatsdk": "file:./libs/chatsdk-x.x.x.har"
  }
}
```

最后单击 **File > Sync and Refresh Project** 按钮，直到同步完成。

### 3. 添加项目权限

在模块的 `module.json5`（例如 `HelloWorld` 工程中 `entry` 模块的 `module.json5`）中声明 SDK 所需的网络权限：

```json5
{
  module: {
    requestPermissions: [
      {
        name: "ohos.permission.GET_NETWORK_INFO",
      },
      {
        name: "ohos.permission.INTERNET",
      },
    ],
  },
}
```

若应用还使用录音、读取媒体文件等功能，需根据实际功能另行声明并申请对应权限。

## 实现单聊

本节介绍如何实现单聊。

### 1. SDK 初始化

```typescript
import { ChatClient, ChatOptions } from '@easemob/chatsdk';

const options = new ChatOptions({
  appKey: 'your-org#your-app'
});

// 按需设置其他 ChatOptions 配置。
// 初始化时传入应用上下文和配置。
ChatClient.getInstance().init(context, options);
```

### 2. 创建账号

在 [环信控制台](https://console.easemob.com/user/login) 创建用户，获取用户 ID 和用户 Token。详见 [创建用户文档](/product/console/operation_user.html#创建用户)。

在生产环境中，为了安全考虑，你需要在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，使你的用户从你的应用服务器获取 Token。

### 3. 登录账号

利用用户 ID 和用户 Token 实现用户登录：

```typescript
import { ChatClient, ChatError } from '@easemob/chatsdk';

ChatClient.getInstance()
  .loginWithToken(userId, token)
  .then((): void => {
    // 登录成功。
  })
  .catch((error: ChatError): void => {
    // 登录失败，根据错误码和错误信息处理。
  });
```

:::tip
消息监听器可在 SDK 初始化完成后、登录前注册。调用需要访问服务器的接口前，应等待登录成功；本地数据库接口可在对应用户的数据库打开后使用，详见 [登录文档](login.html#登录完成前使用本地数据库)。
:::

### 4. 发送一条单聊消息

```typescript
import { ChatClient, ChatMessage } from '@easemob/chatsdk';

// `content` 为要发送的文本内容，`toChatUsername` 为对方的账号。
const message: ChatMessage | undefined =
  ChatMessage.createTextSendMessage(toChatUsername, content);

if (message) {
  message.setMessageStatusCallback({
    onSuccess: (): void => {
      // 消息发送成功。
    },
    onError: (errorCode: number, errorMessage: string): void => {
      // 消息发送失败，根据错误码和错误信息处理。
    }
  });

  ChatClient.getInstance().chatManager()?.sendMessage(message);
}
```

如需接收对方发送的消息，应注册 `ChatMessageListener`。不再需要监听时，应移除同一个监听器实例：

```typescript
import {
  ChatClient,
  ChatMessage,
  ChatMessageListener
} from '@easemob/chatsdk';

const messageListener: ChatMessageListener = {
  onMessageReceived: (messages: Array<ChatMessage>): void => {
    // 处理收到的单聊消息并刷新界面。
  }
};

const chatManager = ChatClient.getInstance().chatManager();
chatManager?.addMessageListener(messageListener);

// 在页面或组件销毁时调用。
function releaseMessageListener(): void {
  chatManager?.removeMessageListener(messageListener);
}
```

更多消息发送和接收方式，详见 [发送消息](message_send.html) 和 [接收消息](message_receive.html)。
