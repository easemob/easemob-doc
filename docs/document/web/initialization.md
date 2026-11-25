# 初始化

初始化是使用 SDK 的必要步骤,需在所有接口方法调用前完成。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见 [环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

通过 `ChatClient.init` 传入配置创建 SDK 单例实例。

```typescript
import { ChatClient } from 'easemob-websdk';

const client = ChatClient.init({
  appKey: 'your-org#your-app',
});
```

:::tip
- 本文示例中的 `client` 为通过 `ChatClient.init` 创建的 SDK 实例。
- 如需使用聊天、好友、群组等功能，还需在初始化时通过 `managers` 参数或后续 `use` 方法注册对应管理器。
:::

下表明确初始化 SDK 时的一些参数。

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `appKey` | String | 是 | 应用唯一标识，格式为 `org#app`。 |
| `serviceConfig.serverUrls` | ServerUrlsConfig | 按需 | 指定服务地址。仅配置 REST 和消息 WebSocket 两项地址的方案自 SDK 5.1.2 起支持。使用应用专属域名时需要配置，详见 [配置应用专属域名](#配置应用专属域名)。 |
| `serviceConfig.serverUrls.restApiUrl` | String | 按需 | 设置 REST API 基准地址，与 `wsUrl` 同时配置。 |
| `serviceConfig.serverUrls.wsUrl` | String | 按需 | 设置完整消息 WSS URL，与 `restApiUrl` 同时配置。 |
| `enableDeliveryReceipt` | Boolean | 否 | 是否开启送达回执。开启后，收到单聊消息时 SDK 会自动向发送方回送达回执。默认 `false`。 |
| `useFixedDeviceId` | Boolean | 否 | 是否在同一浏览器内复用固定设备标识。默认 `true`；设为 `false` 时，每个 SDK 实例使用随机设备 ID。 |
| `deviceId` | String | 否 | 自定义设备标识；未传时使用 SDK 默认值。 |
| `enableSyncData` | `ReadonlyArray<'conversation' \| 'contact' \| 'group'>` | 否 | 登录后自动同步的数据类型；未传时默认 `['conversation']`。 |
| `managers` | Array | 否 | 初始化时需要自动注册的管理器列表。 |

## 配置应用专属域名

应用的服务器域名分为两类：**集群域名** 由同一集群内的应用共用，**应用专属域名** 按应用分配。域名查看入口及展示规则见 [查看应用服务器域名](/product/console/app_manage.html#查看应用服务器域名)。

使用集群域名时，SDK 默认自动获取服务地址，无需手动设置 REST 和消息 WebSocket 地址；保持默认配置，不传入 `serviceConfig.serverUrls` 即可。

使用应用专属域名时，需要使用当前应用的 REST 和 WebSocket 地址配置 SDK。Web/小程序 SDK 自 **5.1.2** 起支持以下两项服务地址配置方案；更早的 V5 版本请先升级。

#### 初始化前配置地址

在控制台进入目标应用的详情页，从 **开发配置信息 > 域名配置** 中复制 **REST API** 和 **Websocket** 地址，并使用同一页面的 App Key。请按以下格式填写 SDK 参数。

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `serviceConfig.serverUrls` | ServerUrlsConfig | 是 | 选择固定服务地址模式。配置对象中需同时提供 REST 和 WebSocket 地址。 |
| `restApiUrl` | string | 是 | REST API 基准地址，保留 `https://` 及实际端口，例如 `https://api-your-app.example.com`；不追加组织名、应用名或业务接口路径。 |
| `wsUrl` | string | 是 | 完整 WSS URL，例如 `wss://ws-your-app.example.com`；未提供路径时 SDK 自动补齐 `/websocket`。 |
| `managers` | Array | 按需 | 示例注册 `ChatManager`。实际业务所需的其他管理器仍需按功能文档注册。 |

:::notice
选择 **创建新的正式版应用** 上线时，正式版与测试版是两个应用，应从正式版详情页重新获取 App Key 和两项地址，不能只替换 App Key。详见 [应用上线](/product/console/app_launch.html#上线事项)。
:::

以下代码替换现有初始化入口中的配置。请沿用业务所需的其他初始化设置，不要在已经初始化后通过再次调用初始化接口切换地址。

```typescript
import { ChatClient, ChatManager } from 'easemob-websdk';

const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager],
  serviceConfig: {
    serverUrls: {
      restApiUrl: 'https://api-your-app.example.com',
      wsUrl: 'wss://ws-your-app.example.com',
    },
  },
});

client.addEventHandler('domain-connection', {
  onConnected: () => console.log('消息连接已建立'),
  onDisconnected: (event) => console.log('消息连接已断开', event.reason),
});

console.log('固定服务地址配置：', client.getServerUrlsConfig());
```

通过 `serviceConfig.serverUrls` 指定两项服务地址，不同时配置 `serviceConfig.dnsConfigUrls`。`wsUrl` 为完整 WSS URL，未提供路径时 SDK 自动补齐 `/websocket`；同步 REST 请求复用 `restApiUrl`，数据同步 WebSocket 地址根据 REST 地址自动确定，无需额外配置。小程序还需按 [配置服务器域名](serverconfig.html) 添加合法域名。

#### 检查配置结果

地址设置方法和初始化接口不提供独立的“域名连接成功”回调。初始化完成后，按 [初始化后设置监听](#初始化后设置监听) 注册连接监听，再按 [登录](login.html) 文档登录。确认连接成功，并通过 SDK 日志检查实际连接的服务主机。

分别验证消息收发、REST 请求和启用的自动同步功能。消息连接成功不代表所有请求和数据同步均已成功；失败时请记录错误信息，并对照 [错误码](error.html) 排查 App Key、域名、端口、TLS 和网络访问情况。


## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```typescript
client.addEventHandler('connection', {
  onConnecting: () => console.log('正在连接...'),
  onConnected: () => console.log('连接成功'),
  onDisconnected: (event) => console.log('连接断开', event.reason, event),
  onTokenWillExpire: () => console.log('Token 即将过期'),
  onTokenExpired: () => console.log('Token 已过期'),
});

client.addEventHandler('message', {
  onMessage: (message) => console.log('收到消息', message),
});
```

如需监听登录后自动同步数据的开始和完成状态，详见 [监听同步状态](#监听同步状态)。

## 设置登录后自动同步数据

### 同步的数据

SDK 支持在初始化时通过 `enableSyncData` 配置登录后自动同步的数据类型。用户登录成功后，SDK 会根据该配置同步对应数据，并更新本地缓存或本地快照。

目前支持自动同步会话列表、好友列表及好友信息、当前用户已加入的群组列表。各数据类型的配置项、读取方式和 Manager 注册要求如下：

| 配置项 | 登录后自动同步内容 | 本地读取方式 | 需要注册的 Manager | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `conversation` | 会话列表 | `client.chatManager.getConversationList` | `ChatManager` | 默认开启。同步后可读取当前本地会话列表快照。 |
| `contact` | 好友列表及好友信息 | `client.contactManager.getContacts` | `ContactManager`、`UserInfoManager` | 不包含黑名单；黑名单需调用 `client.contactManager.getBlocklist` 获取。<br/> 建议注册 `UserInfoManager`，以满足好友属性读取能力。 |
| `group` | 当前用户已加入的群组列表 | `client.groupManager.getJoinedGroupList` | `GroupManager` | 同步后可读取当前本地已加入群组列表。 |

### 配置方式

你需要在调用 `ChatClient.init` 初始化 SDK 时设置 `enableSyncData`。SDK 初始化完成后再修改该参数，不会影响当前 SDK 实例的自动同步行为。

`enableSyncData` 的配置规则如下：

- 未传入 `enableSyncData` 时，SDK 默认使用 `['conversation']`，即登录后自动同步会话列表。
- 若需要在默认会话列表同步的基础上增加好友或群组同步，需要显式保留 `conversation`，例如 `['conversation', 'contact']` 或 `['conversation', 'contact', 'group']`。
- 若设置为 `[]`，则关闭登录后的自动同步。

以下示例表示登录成功后自动同步会话列表、好友列表及好友信息、当前用户已加入的群组列表：

```typescript
import {
  ChatClient,
  ChatManager,
  ContactManager,
  GroupManager,
  UserInfoManager,
} from 'easemob-websdk';

const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager, ContactManager, GroupManager, UserInfoManager],
  enableSyncData: ['conversation', 'contact', 'group'],
});
```

如果只希望保留默认的会话列表同步，可不传 `enableSyncData`：

```typescript
const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager],
});
```

如果需要关闭登录后的自动同步，可设置为空数组：

```typescript
const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager],
  enableSyncData: [],
});
```

### 监听同步状态

SDK 通过 `onSyncDataStart` 和 `onSyncDataFinished` 通知同步开始和结束。

- `onSyncDataStart`：某类数据开始同步时触发。`payload.dataType` 表示同步的数据类型，取值为 `conversation`、`contact` 或 `group`。
- `onSyncDataFinished`：某类数据同步完成时触发。`payload.status` 表示同步结果，取值为 `success` 或 `failed`；同步失败时，可通过 `payload.error` 查看错误详情。

示例代码如下：

```typescript
client.addEventHandler('sync-listener', {
  onSyncDataStart: payload => {
    console.log('同步开始:', payload.dataType);
  },
  onSyncDataFinished: payload => {
    if (payload.status === 'success') {
      console.log('同步成功:', payload.dataType);
      return;
    }

    console.log('同步失败:', payload.dataType, payload.error);
  },
});
```

### 登录后读取同步结果

自动同步完成后，可通过对应 Manager 从 SDK 本地缓存或本地快照中读取数据。

```typescript
await client.login({
  userId: 'your-user-id',
  token: 'your-token',
});

const conversations = client.chatManager.getConversationList();
const contacts = client.contactManager.getContacts();
const joinedGroups = client.groupManager.getJoinedGroupList();

console.log(conversations);
console.log(contacts);
console.log(joinedGroups);
```

## 开启用户信息自动管理

用户信息自动管理与联系人自动同步相互独立。`enableUserInfoSync` 默认关闭；开启后会在登录成功时同步当前用户的属性，但不会在登录时自动获取所有好友的昵称和头像。其他用户属性通过消息触发、主动获取等方式更新，详见 [用户信息自动管理](userinfo_provider.html)。

## 获取 SDK 版本号

从 5.2.0 开始，可调用 `client.getVersion()` 获取当前集成的 SDK 版本号，用于确认版本或排查问题。该方法同步返回版本号字符串，无需注册 Manager，也无需登录。

```typescript
const version = client.getVersion();
console.log('SDK 版本:', version); // 例如 '5.2.0'
```

其中 `client` 为通过 `ChatClient.init()` 创建的 SDK 实例。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`serviceConfig`](#初始化前配置地址) | `ChatClient` | 配置 REST API 和消息 WebSocket 服务地址。 |
| [`getVersion`](#获取-sdk-版本号) | `ChatClient` | 获取 SDK 版本号。 |
| [`init`](#初始化-sdk) | `ChatClient` | 初始化 SDK 单例实例。 |
| [`getConversationList`](#登录后读取同步结果) | `ChatManager` | 从本地缓存读取当前会话列表。 |
| [`getContacts`](#登录后读取同步结果) | `ContactManager` | 从本地快照读取当前好友列表视图。 |
| [`getJoinedGroupList`](#登录后读取同步结果) | `GroupManager` | 从本地快照读取当前用户已加入的群组列表。 |



