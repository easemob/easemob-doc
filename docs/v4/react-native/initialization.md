# 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

:::tip
需要在主进程中进行初始化。
:::

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见 [环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

如果使用应用专属域名，请先按 [配置应用专属域名](#配置应用专属域名) 设置服务地址，再调用初始化接口。
初始化时，你需要通过 `ChatOptions.withAppKey` 创建包含 App Key 的初始化配置。

```typescript
const options = ChatOptions.withAppKey({
  appKey,
});

ChatClient.getInstance()
  .init(options)
  .then(() => {
    console.log("init: success");
  })
  .catch((reason) => {
    console.error(reason);
  });
```

下表列明初始化配置 `ChatOptions` 封装的一些属性。`ChatOptions` 封装的所有属性，详见 [API 参考](https://doc.easemob.com/apidoc/rn/classes/ChatOptions.html)。

| 属性 | 描述 |
| :----------------- | :---------------- |
| `appKey` | `appKey` 参数为创建 App 时在环信控制台上注册的 App 唯一识别符。 |
| `autoLogin` | 是否自动登录。<br/>-（默认）`true`：自动登录。**若使用默认设置，首次登录后，后续会自动登录。这种情况下，若再手动登录，则会提示用户已登录。**<br/>- `false`：不自动登录。 |
| `autoAcceptGroupInvitation` | 是否自动接受加群邀请。<br/>-（默认）`false`：不自动接受加群申请；<br/>- `true`：自动接受加群申请。 |
| `acceptInvitationAlways` | 是否自动接受加好友邀请。<br/>-（默认）`false`：不自动接受好友邀请；<br/>- `true`：自动接受好友邀请。 |
| `apnsCertName` | APNs 证书名称，用于 iOS 离线推送。该值应与环信控制台中配置的 APNs 证书名称一致，并且只能在初始化 SDK 时设置。 |
| `pushKitCertName` | PushKit 证书名称，用于 iOS VoIP 推送。该值应与环信控制台中配置的 PushKit 证书名称一致，并且只能在初始化 SDK 时设置。 |
| `deleteMessagesAsExitChatRoom` | 退出（主动和被动退出）聊天室时是否删除聊天消息。<br/>-（默认）`true`：删除；<br/>- `false`：保留。 |
| `deleteMessagesAsExitGroup` | 退出（主动和被动退出）群组时是否删除聊天消息。<br/>-（默认）`true`：退出群组时删除群组消息；<br/>- `false`：退出群组时不删除群组消息。 |
| `isChatRoomOwnerLeaveAllowed` | 是否允许聊天室所有者离开并删除会话记录。<br/>-（默认）`true`：允许；<br/>- `false`：不允许。 |
| `enableChatroomConversation` | 设置获取本地会话列表时是否包含聊天室会话。该配置不控制聊天室会话的创建或存储，也不影响聊天室消息的正常收发。自 React Native SDK 1.21.0 起支持。<br/>- `true`：本地会话列表中包含聊天室会话。<br/>-（默认）`false`：本地会话列表中不包含聊天室会话。必须在初始化 SDK 前设置。 |
| `enableEmptyConversation` | 设置获取本地会话时是否包含空会话。<br/>- `true`：包含空会话。<br/>-（默认）`false`：不包含空会话。 |
| `autoLoadConversations` | 设置初始化 SDK 时是否自动将全部本地会话加载到内存。<br/>-（默认）`true`：自动加载全部会话。<br/>- `false`：不自动加载全部会话，可使用 `fetchConversationsFromDB` 分页加载。 |

## 设置登录后自动同步好友数据

React Native SDK 1.18.0 支持通过 `ChatOptions.withAppKey` 或 `ChatOptions.withAppId` 的 `enableAutoSyncContacts` 参数配置登录后是否自动从服务器同步好友列表和好友对象。该参数默认为 `false`；设置为 `true` 后，用户登录成功时，SDK 会同步好友数据并更新本地数据。

好友对象 `ChatContact` 包含好友用户 ID、好友备注和添加时间等信息，但不代表已经获取所有好友的昵称和头像。同步状态监听、好友列表和好友对象的本地读取方式，详见 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)。

## 开启用户信息自动管理

React Native SDK 1.18.0 支持通过 `ChatOptions` 的 `enableUserInfo` 参数配置用户信息自动管理功能。该参数默认为 `false`；设置为 `true` 后，SDK 会在用户登录成功时自动同步当前登录用户的用户属性。其他用户的用户属性会在接收相关消息、主动从服务端获取用户属性等场景下更新。

`enableUserInfo` 与 `enableAutoSyncContacts` 相互独立，开启用户信息自动管理不会在登录时自动获取所有好友的昵称和头像。用户属性更新事件、本地读取与主动获取方式，详见 [用户信息自动管理](userinfo_provider.html)。

如果两项功能都需要，可在同一次初始化中配置：

```typescript
const options = ChatOptions.withAppKey({
  appKey: 'your-org#your-app',
  enableAutoSyncContacts: true,
  enableUserInfo: true,
});

await ChatClient.getInstance().init(options);
```

## 配置应用专属域名

React Native SDK 自 **1.13.0** 起支持以下 REST 和 WebSocket 服务地址配置。使用应用专属域名时，请使用当前应用的地址配置 SDK；域名查看入口及展示规则见 [查看应用服务器域名](/product/console/app_manage.html#查看应用服务器域名)。

#### 初始化前配置地址

在控制台进入目标应用的详情页，从 **开发配置信息 > 域名配置** 中复制 **REST API** 和 **Websocket** 地址，并使用同一页面的 App Key。请按以下格式填写 SDK 参数。

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `restServer` | string | 是 | REST API 基准地址，保留 `https://` 及实际端口，例如 `https://api-your-app.example.com`；不追加组织名、应用名或业务接口路径。 |
| `webSocketServer` | string | 是 | WebSocket 主机名，例如 `ws-your-app.example.com`；不包含 `wss://`、端口或路径。 |
| `webSocketPort` | number | 是 | WSS 默认端口为 `443`；若控制台明确提供其他端口，使用实际值。 |
| `enableTLS` | boolean | 是 | 默认 `false`；本文设为 `true`。 |
| `usingHttpsOnly` | boolean | 否 | 默认 `true`；示例显式保留。 |
| `enableDNSConfig` | boolean | 是 | 默认 `true`；本文设为 `false`。 |

:::notice
选择 **创建新的正式版应用** 上线时，正式版与测试版是两个应用，应从正式版详情页重新获取 App Key 和两项地址，不能只替换 App Key。详见 [应用上线](/product/console/app_launch.html#上线事项)。
:::

以下代码替换现有初始化入口中的配置。请沿用业务所需的其他初始化设置，不要在已经初始化后通过再次调用初始化接口切换地址。

```typescript
import { ChatClient, ChatOptions } from 'react-native-chat-sdk';

async function initializeChatSdk(): Promise<void> {
  const options = ChatOptions.withAppKey({
    appKey: 'your-org#your-app',
    restServer: 'https://api-your-app.example.com',
    webSocketServer: 'ws-your-app.example.com',
    webSocketPort: 443,
    enableTLS: true,
    usingHttpsOnly: true,
    enableDNSConfig: false,
  });

  try {
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('SDK 初始化失败：', error);
    throw error;
  }
}
```

WebSocket 地址只填写主机名，端口单独设置，示例使用 `443`，通过 `enableTLS: true` 使用 WSS；REST 地址保留 `https://`，不使用 TCP 的 `imServer`。自 SDK **1.21.0** 起，依赖的 Android 4.25.1 / iOS 4.25.0 根据 REST 配置自动获取数据同步地址。

#### 检查配置结果

地址设置方法和初始化接口不提供独立的“域名连接成功”回调。初始化完成后，按 [初始化后设置监听](#初始化后设置监听) 注册连接监听，再按 [登录](login.html) 文档登录。确认连接成功，并通过 SDK 日志检查实际连接的服务主机。

分别验证消息收发、REST 请求和启用的自动同步功能。消息连接成功不代表所有请求和数据同步均已成功；失败时请记录错误信息，并对照 [错误码](error.html) 排查 App Key、域名、端口、TLS 和网络访问情况。


## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```typescript
ChatClient.getInstance().addConnectionListener({
  // SDK 成功连接到 IM 服务器时触发。
  onConnected(): void {
    console.log('LoginAndLogoutScreen.onConnected');
  },
  // SDK 与 IM 服务器断开连接时触发。
  onDisconnected(): void {
    console.log('LoginAndLogoutScreen.onDisconnected');
  },
});
ChatClient.getInstance().chatManager.addMessageListener({
   // 收到消息时触发。
   onMessagesReceived(messages: Array<ChatMessage>): void {
    console.log('onMessagesReceived: ', messages);
  },
});
```

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`restServer`](#初始化前配置地址) | `ChatOptions` | 设置 REST API 基准地址。 |
| [`webSocketServer`](#初始化前配置地址) | `ChatOptions` | 设置消息 WebSocket 主机名。 |
| [`webSocketPort`](#初始化前配置地址) | `ChatOptions` | 设置消息 WebSocket 端口。 |
| [`enableTLS`](#初始化前配置地址) | `ChatOptions` | 设置消息长连接是否启用 TLS。 |
| [`enableDNSConfig`](#初始化前配置地址) | `ChatOptions` | 配置服务地址的使用方式；使用指定地址时设为 `false`。 |
| [`withAppKey`](#初始化-sdk) / [`withAppId`](#初始化-sdk) | `ChatOptions` | `ChatOptions` | 使用 App Key 或 App ID 创建初始化配置。 |
| [`init`](#初始化-sdk) | `ChatClient` | `Promise<void>` | 使用指定配置初始化 React Native SDK。 |
| [`apnsCertName`](/v4/react-native/push/push_easemob_console.html#配置-ios-推送证书名称) | `ChatOptions` | `string \| undefined` | 设置 iOS APNs 证书名称。 |
| [`pushKitCertName`](/v4/react-native/push/push_easemob_console.html#配置-ios-推送证书名称) | `ChatOptions` | `string \| undefined` | 设置 iOS PushKit 证书名称。 |
| [`enableChatroomConversation`](conversation_list.html#从本地获取会话列表) | `ChatOptions` | `boolean` | 设置获取本地会话列表时是否包含聊天室会话。 |
| [`enableEmptyConversation`](conversation_list.html#从本地获取会话列表) | `ChatOptions` | `boolean` | 设置获取本地会话时是否包含空会话。 |
| [`autoLoadConversations`](conversation_list.html#分页获取本地会话) | `ChatOptions` | `boolean` | 设置初始化 SDK 时是否自动将全部本地会话加载到内存。 |
| [`enableAutoSyncContacts`](#设置登录后自动同步好友数据) | `ChatOptions` | `boolean` | 登录后自动同步好友数据的初始化配置。 |
| [`enableUserInfo`](#开启用户信息自动管理) | `ChatOptions` | `boolean` | 用户信息自动管理的初始化配置。 |
| [`addConnectionListener`](#初始化后设置监听) | `ChatClient` | `void` | 添加连接状态监听器。 |
| [`addMessageListener`](#初始化后设置监听) | `ChatManager` | `void` | 添加消息相关监听器。 |
