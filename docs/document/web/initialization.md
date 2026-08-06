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
| `enableDeliveryReceipt` | Boolean | 否 | 是否开启送达回执。开启后，收到单聊消息时 SDK 会自动向发送方回送达回执。默认 `false`。 |
| `useFixedDeviceId` | Boolean | 否 | 是否在同一浏览器内复用固定设备标识。默认 `true`；设为 `false` 时，每个 SDK 实例使用随机设备 ID。 |
| `deviceId` | String | 否 | 自定义设备标识；未传时使用 SDK 默认值。 |
| `enableSyncData` | `ReadonlyArray<'conversation' \| 'contact' \| 'group'>` | 否 | 登录后自动同步的数据类型；未传时默认 `['conversation']`。 |
| `managers` | Array | 否 | 初始化时需要自动注册的管理器列表。 |

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

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`init`](#初始化-sdk) | `ChatClient` | 初始化 SDK 单例实例。 |
| [`getConversationList`](#登录后读取同步结果) | `ChatManager` | 从本地缓存读取当前会话列表。 |
| [`getContacts`](#登录后读取同步结果) | `ContactManager` | 从本地快照读取当前好友列表视图。 |
| [`getJoinedGroupList`](#登录后读取同步结果) | `GroupManager` | 从本地快照读取当前用户已加入的群组列表。 |



