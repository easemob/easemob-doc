# 登录

初始化 IM SDK 后，你需要调用 `client.login` 登录 SDK。登录成功后，SDK 会建立到消息服务的长连接，恢复本地缓存，按初始化配置同步会话列表、好友列表、群组和用户属性等数据。登录成功后，才能使用收发消息、会话管理、好友关系、群组管理等 IM 能力。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 登录、续期、退出登录及获取当前登录状态等能力通过 `ChatClient` 实例调用，无需额外注册 Manager。
- 已获取合法的用户 ID 和 Token。

## 用户注册

登录 SDK 前，你需要先创建环信 IM 用户。创建用户前，需先在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯 > 基础功能** > **用户** 页面设置用户注册模式。

用户注册模式分为以下两种：

- **授权注册**：通过环信提供的 REST API 注册用户。该方式适用于正式生产环境，注册成功后，你可以将用户账号保存到你的应用服务器或返回给客户端。
- **开放注册**：允许客户端或 REST API 直接注册用户。该方式一般用于体验 Demo 和测试环境，正式环境不推荐使用。

设置注册模式后，你可以通过以下方式创建用户：

1. **调用 REST API 创建用户**

   - 授权注册：调用 [授权注册单个用户](/document/server-side/account_register_authorized_single.html) 或 [批量授权注册用户](/document/server-side/account_register_authorized_batch.html) 接口创建用户。
   - 开放注册：开启开放注册后，可通过客户端或 [REST API 开放注册用户](/document/server-side/account_register_open.html) 创建用户。

2. **通过环信控制台创建用户**

   你可以在 [环信控制台](https://console.easemob.com/user/login) 创建正式环境或测试环境下的用户，详见 [创建用户](/product/console/operation_user.html#创建用户)。

## 登录

SDK 通过用户 ID 和 IM Token 登录。调用 `client.login` 时，需传入 `userId` 和 `token`。登录成功后，SDK 会建立到消息服务的长连接；`login` 返回的 Promise resolve，不携带返回值。

测试环境下，你在 [环信控制台](https://console.easemob.com/user/login) 创建用户后，环信服务器会自动为这些用户分配用户 Token，详见 [创建用户](/product/console/operation_user.html#创建用户)。

生产环境中，建议在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html)，由客户端从你的应用服务器获取用户 Token 后再登录 SDK。

```typescript
const client = ChatClient.init({
  appKey: 'easemob-demo#chatdemoui',
});

await client.login({
  userId: 'username',
  token: 'token',
});
```

登录时需注意以下事项：

- `userId` 和 `token` 均为必填参数。
- 建议在调用 `login` 前注册连接事件监听，以便接收连接成功、连接断开以及 Token 生命周期相关事件。
- 若 SDK 已处于连接中或已连接状态，再次调用 `login` 会失败。
- 如需切换登录用户，请先调用 `logout` 登出当前用户，再使用新的用户 ID 和 Token 登录。

示例代码如下：

```typescript
client.addEventHandler('login-listener', {
  onConnected: event => {
    console.log('登录并连接成功:', event);
  },
  onDisconnected: event => {
    console.log('连接断开:', event.reason, event.errorCode, event.errorMessage);
  },
  onTokenWillExpire: async () => {
    const newToken = await fetchNewTokenFromServer();
    await client.renewToken(newToken);
  },
  onTokenExpired: () => {
    console.log('Token 已过期，需要重新获取 Token 后登录');
  },
});

await client.login({
  userId: 'username',
  token: 'token',
});
```

:::tip
如果后续需要使用消息、会话、好友、群组等能力，请在初始化 SDK 时注册对应的 Manager。例如，使用消息和会话能力时需注册 `ChatManager`。
:::

## 获取当前登录状态和信息

登录成功后，你可以调用以下方法获取当前连接状态、登录用户和设备资源标识。

| 方法 | 返回值 | 描述 |
| :--- | :--- | :--- |
| `getConnectionState` | String | 获取当前连接状态。取值包括 `disconnected`、`connecting`、`connected`、`reconnecting` 和 `reconnectFailed`。 |
| `getCurrentUserId` | String \| null | 获取当前登录用户 ID。未登录时返回 `null`。 |
| `getClientResource` | String \| null | 获取当前连接的设备资源标识。未连接或尚未完成登录握手时返回 `null`。 |
| `getRestContext` | RestContext | 获取当前登录会话的 REST 访问上下文，包括 REST 地址、App Key、用户 ID、Token 和设备资源标识。未登录或上下文不完整时会抛出错误。 |

```typescript
const state = client.getConnectionState();
const userId = client.getCurrentUserId();
const clientResource = client.getClientResource();

console.log('连接状态:', state);
console.log('当前登录用户:', userId);
console.log('设备资源标识:', clientResource);

if (state === 'connected') {
  const restContext = client.getRestContext();
  console.log('REST 访问上下文:', restContext);
}
```

:::tip
`getConnectionState` 返回的是连接状态，不是单独的登录状态。通常可结合 `getCurrentUserId` 判断当前 SDK 是否已有登录用户。
:::

## Token 续期

SDK 会根据当前登录 Token 的过期时间管理 Token 生命周期：

- 当 Token 即将过期时，SDK 触发 `onTokenWillExpire`。该事件通常在 Token 生命周期达到约 80% 时触发。
- 当 Token 已过期时，SDK 触发 `onTokenExpired`，并断开当前连接。

收到 `onTokenWillExpire` 后，建议从你的应用服务器获取新的 IM Token，并调用 `renewToken` 更新 Token。更新成功后，`renewToken` 返回新的 `token` 和 `expireAt`，分别表示当前已生效的 Token 以及 Token 过期时间戳，单位为毫秒。

```typescript
client.addEventHandler('token-listener', {
  onTokenWillExpire: async () => {
    const newToken = await fetchNewTokenFromServer();
    const result = await client.renewToken(newToken);
    console.log('Token 续期成功，过期时间:', result.expireAt);
  },
  onTokenExpired: () => {
    console.log('Token 已过期，需要重新获取 Token 后登录');
  },
});
```

`renewToken` 仅在 SDK 已连接时可调用。若 Token 已过期并触发 `onTokenExpired`，需要重新获取 Token 后调用 `login` 登录 SDK。

## 退出登录

你可以调用 `logout` 主动退出登录：

```typescript
await client.logout();
```

调用 `logout` 后，SDK 会关闭当前连接，取消正在进行的同步任务，清理当前登录用户、Token、设备资源标识、运行时缓存引用和日志上报状态，并将连接状态更新为 `disconnected`。如果需要继续使用 IM 能力，需要重新调用 `login` 登录 SDK。

## 多设备登录

除了单端单设备登录，环信即时通讯 IM 支持同一账号在多端的多个设备上登录。多设备登录时，若同端设备数量超过限制，新登录的设备可能会将之前登录的设备踢下线。具体设备数量限制、互踢策略以及信息同步规则，详见 [多设备登录](multi_device.html)。

**初始化参数控制设备标识**

你可以通过以下初始化参数控制设备标识：

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `useFixedDeviceId` | Boolean | 是否在同一浏览器中复用固定设备标识。默认值为 `true`，同一浏览器中的多个标签页通常视为同一设备；设置为 `false` 时，每个 SDK 实例使用随机设备 ID。 |
| `deviceId` | String | 自定义设备标识；未传时使用 SDK 默认值。 |
| `customOSPlatform` | Number | 自定义平台编号，取值范围为 1-100，用于区分不同端。 |
| `customDeviceName` | String | 自定义设备名称，通常与 `customOSPlatform` 搭配使用。 |
| `loginExtensionInfo` | String | 登录自定义扩展信息。当多设备登录策略导致当前设备被踢下线时，可用于传递踢下线相关扩展信息，最大长度为 1024 个字符。 |

示例代码如下：

```typescript
const client = ChatClient.init({
  appKey: 'easemob-demo#chatdemoui',
  useFixedDeviceId: true,
  customOSPlatform: 10,
  customDeviceName: 'web-custom-device',
  loginExtensionInfo: 'login from web',
});
```

**设备互踢**

当多设备登录策略导致当前设备被踢下线时，SDK 会触发 `onDisconnected` 事件。你可以通过事件回调中的 `errorCode` 和 `errorMessage` 判断断开原因，并按业务需要提示用户或引导用户重新登录。

常见多设备相关错误码如下：

| 场景 | 错误码 / Key | 说明 |
| :--- | :--- | :--- |
| 用户在另一设备登录并踢出当前设备 | `206` / `USER_LOGIN_ANOTHER_DEVICE` | 通常需要提示用户当前账号已在其他设备登录。 |
| 用户因修改密码被踢下线 | `216` / `USER_KICKED_BY_CHANGE_PASSWORD` | 通常需重新获取 Token 后登录。 |
| 用户在其他设备、通过 API 或控制台被强制退出 | `217` / `USER_KICKED_BY_OTHER_DEVICE` | 可提示用户被强制退出，如需继续使用再重新登录。 |
| 登录设备数超过限制 | `214` / `AUTH_LOGIN_TOO_MANY_DEVICES` | 需先处理设备数限制，不能仅靠重复登录解决。 |
| 绑定到其他设备或登录资源变化 | `213` / `AUTH_BIND_ANOTHER_DEVICE`，或 `220` / `USER_DEVICE_CHANGED` | 通常需要重新登录或引导用户处理设备状态。 |

**获取其他设备登录信息**

你可以调用 `getSelfIdsOnOtherPlatform` 获取当前账号在其他已登录设备上的登录 ID：

```typescript
const otherDeviceIds = await client.getSelfIdsOnOtherPlatform();
console.log(otherDeviceIds);
```

登录 ID 由用户 ID 和设备资源标识组成，格式为 `userId/resource`。

- `userId`：当前登录用户的用户 ID。
- `resource`：设备资源标识，也就是当前登录设备的识别号。

例如，登录 ID 为 `alice/web_7f3a9c` 时，`alice` 是用户 ID，`web_7f3a9c` 是该次登录对应的设备资源标识。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`login`](#登录) | `ChatClient` | 使用用户 ID 和 Token 登录 SDK。 |
| [`getConnectionState`](#获取当前登录状态和信息) | `ChatClient` | 获取当前连接状态。 |
| [`getCurrentUserId`](#获取当前登录状态和信息) | `ChatClient` | 获取当前登录用户 ID。 |
| [`getClientResource`](#获取当前登录状态和信息) | `ChatClient` | 获取当前连接的设备资源标识。 |
| [`getRestContext`](#获取当前登录状态和信息) | `ChatClient` | 获取当前登录会话的 REST 上下文。 |
| [`renewToken`](#token-续期) | `ChatClient` | 为当前登录会话续期 Token。 |
| [`logout`](#退出登录) | `ChatClient` | 退出当前登录会话。 |
| [`getSelfIdsOnOtherPlatform`](#多设备登录) | `ChatClient` | 获取当前账号在其他已登录设备上的登录 ID。 |
