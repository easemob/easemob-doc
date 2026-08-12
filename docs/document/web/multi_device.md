# 多设备登录

## 功能说明

即时通讯 IM 支持同一账号在多个设备上登录。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。

即时通讯 IM SDK 在登录时会基于初始化参数生成当前设备的登录标识，并将该设备信息发送到服务器。服务器根据多端多设备策略维护当前账号的在线设备状态；当同一账号在其他设备上执行好友、群组、消息话题、会话或漫游消息删除等操作时，SDK 会将这些操作归一化为多设备事件，并通过 `client.addEventHandler` 注册的对应回调通知当前设备。

多端多设备登录场景下要支持以下功能：

- 在当前设备接收其他设备触发的多设备事件通知；
- 同步好友、群组、消息话题、会话以及漫游消息删除等多设备操作事件；
- 支持查询当前账号在其他设备上的登录标识；
- 支持通过初始化参数自定义设备标识、平台和设备名称。

多端登录时，即时通讯 IM 每端默认最多支持 4 个设备同时在线。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。你可以在环信控制台的 **即时通讯 > 基础功能** > **用户** 页面，在弹出的对话框中设置各端设备的数量：

![img](/images/common/multidevice_device_count.png)

## 互踢策略

- 单端登录

新登录的设备会将当前在线设备踢下线。

- 多端登录

若一端的登录设备数量达到了上限，最新登录的设备会将该端最早登录的设备踢下线。即时通讯 IM 仅支持同端互踢，不支持各端之间互踢。<br/>多端登录时，是否使用固定的设备 ID 对设备互踢策略存在影响。<br/>多端登录时，`useFixedDeviceId`、`deviceId`、`customOSPlatform` 和 `customDeviceName` 会共同影响设备标识的生成方式：<br/>- （默认）`useFixedDeviceId: true`：SDK 会复用固定设备标识；若使用默认 `deviceId`，同一浏览器环境会复用已缓存的设备标识。<br/>- `useFixedDeviceId: false`：SDK 不复用本地缓存的固定设备标识；若使用默认 `deviceId`，会生成新的随机设备标识。<br/>- 若传入自定义 `deviceId` 且未设置 `customOSPlatform`，SDK 会基于该值构造设备标识，并不一定每次都生成随机设备 ID。<br/>- `customDeviceName` 仅在设置了 `customOSPlatform` 时生效。

环信服务器提供 RESTful 接口 [查询每个账号已登录设备列表](/document/server-side/account_online_device_obtain.html)、[将账号从已登录设备强制下线](/document/server-side/account_offline_forced.html)和将指定账号强制 [从单个设备下线](/document/server-side/account_offline_device_single.html)。

## 前提条件

- 开始前，确保将 SDK 初始化并连接到服务器。详见 [快速开始](quickstart.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通多端多设备功能。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。
- 若需设置登录设备的自定义名称、自定义平台或登录扩展信息，需要在 SDK 初始化时完成配置。

## 获取当前用户的其他登录设备的登录 ID 列表

你可以调用 `getSelfIdsOnOtherPlatform` 方法获取当前用户在其他设备上的登录 ID 列表，并按需对目标登录设备执行后续业务操作。

该接口适用于多设备登录场景，用于查询当前账号在其他设备上的登录状态。返回结果中会自动排除当前设备，通常可用于展示已登录设备列表、识别异常登录、进行多端登录提醒，或配合服务端接口对指定设备执行下线等管理操作。

```typescript
const otherDeviceIds = await client.getSelfIdsOnOtherPlatform();
console.log('其他设备登录 ID:', otherDeviceIds);
```

接口返回结果中的每一项登录 ID 均采用 `userId/resource` 格式，其中，`userId` 表示当前用户 ID，`resource` 表示某一已登录设备对应的资源标识。该 `resource` 与 [服务端单设备下线接口](/document/server-side/account_offline_device_single.html) 中的 `resourceId` 参数或 [服务端获取指定账号的在线登录设备列表](/document/server-side/account_online_device_obtain.html) 中的 `res` 参数在语义上保持一致，均用于唯一标识用户的某个登录设备。区别在于，客户端接口返回的是完整登录 ID，而服务端接口仅需要其中 `/` 后面的 `resource` 部分。因此，当业务侧需要调用服务端单设备下线接口时，可先从登录 ID 中提取 `resource`，再将其作为 `resourceId` 传入。

## 设置登录设备的平台

SDK 支持自定义设置登录设备的平台，例如，若要将小程序平台和 Web 浏览器平台进行区分，设置成两个单独的平台，可以更精细地控制每个平台登录设备的数量。

你可以按照以下步骤设置登录设备所属的平台：

1. 在环信控制台的 **即时通讯** > **基础功能** > **用户** 页面，在 **多端多设备** 区域，点击 **设置**。在弹出的对话框中点击 **新增自定义平台**，在 **添加自定义平台** 对话框中设置 **设备平台** 和 **设备数量**。

**设备平台** 的取值范围为 [1,100]，**设备数量** 的取值范围为 [0,4]。

![img](/images/common/multidevice_device_platform.png)

2. 初始化 SDK 时，设置 `customOSPlatform` 参数。如需为该平台设置自定义设备名称，可同时设置 `customDeviceName`。请确保 `customOSPlatform` 的值与控制台中设置的设备平台值一致。

```typescript
const client = ChatClient.init({
  appKey: 'your appKey',
  // 设置是否复用固定设备标识；默认值为 `true`。
  useFixedDeviceId: true,
  // 自定义设备标识基值；未传时默认使用 `webim`。
  deviceId: 'webim',
  // 自定义平台编号，取值范围为 [1,100]。
  customOSPlatform: 1,
  // 自定义设备名称；仅在设置了 `customOSPlatform` 时生效。
  customDeviceName: '自定义平台1',
  managers: [],
});
```

## 设置登录设备的扩展信息

环信即时通讯 IM 支持为登录设备设置自定义扩展信息。在多设备登录场景下，该能力可用于传递当前登录设备的附加标识信息，便于业务侧进行设备识别和管理，例如，若有设备被踢下线，被踢设备能获得该设备的自定义扩展信息。

初始化 SDK 时，你可以通过 `loginExtensionInfo` 参数设置当前登录设备的自定义扩展信息。该参数最大长度为 1024 个字符。

当多设备登录策略触发设备下线，例如，当前设备因其他设备登录而被踢下线时，SDK 会触发连接断开事件（`onDisconnected`）。业务侧可结合断开原因判断当前设备是否因多设备登录策略而下线；在此类场景下，`loginExtensionInfo` 可作为多设备登录场景中的设备标识传递信息使用，帮助业务侧区分触发当前登录状态变化的设备来源。

:::tip
`loginExtensionInfo` 会在登录成功后随当前设备登录状态一并生效。
:::

```typescript
const client = ChatClient.init({
  appKey: 'your appKey',
  // 登录设备自定义扩展信息。
  loginExtensionInfo: JSON.stringify({
    source: 'web',
    deviceName: 'Chrome-1',
  }),
  managers: [],
});
```

## 监听多设备事件

你需要调用 `addEventHandler` 方法注册监听事件，监听其他设备上的操作。服务器同步信息之后，SDK 会回调这些多设备事件。当前 SDK 支持以下五类多设备事件：

- `onMultiDeviceContact`：好友相关多设备事件；
- `onMultiDeviceGroup`：群组相关多设备事件；
- `onMultiDeviceThread`：消息话题相关多设备事件；
- `onMultiDeviceConversation`：会话相关多设备事件；
- `onMultiDeviceMessageRemoved`：漫游消息删除相关多设备事件。

:::tip
多端多设备场景下，无聊天室操作相关事件，只支持聊天室中发送和接收消息的同步。
:::

```typescript
client.addEventHandler('multiDevice', {
  // 好友相关多设备事件
  onMultiDeviceContact: event => {
    console.log('好友多设备操作:', event.operation);
    console.log('目标用户 ID:', event.targetUserId);
    console.log('来源设备 ID:', event.deviceId);
  },
  // 群组相关多设备事件
  onMultiDeviceGroup: event => {
    console.log('群组多设备操作:', event.operation);
    console.log('群组 ID:', event.groupId);
    console.log('相关用户 ID 列表:', event.userIds);
    console.log('来源设备 ID:', event.deviceId);
  },
  // 消息话题相关多设备事件
  onMultiDeviceThread: event => {
    console.log('Thread 多设备操作:', event.operation);
    console.log('话题 ID:', event.threadId);
    console.log('父消息 ID:', event.parentId);
    console.log('来源设备 ID:', event.deviceId);
  },
  // 会话相关多设备事件
  onMultiDeviceConversation: event => {
    console.log('会话多设备操作:', event.operation);
    console.log('会话 ID:', event.conversationId);
    console.log('会话类型:', event.conversationType);
    console.log('来源设备 ID:', event.deviceId);
  },
  // 漫游消息删除多设备事件
  onMultiDeviceMessageRemoved: event => {
    console.log('消息删除多设备操作:', event.operation);
    console.log('会话 ID:', event.conversationId);
    console.log('消息 ID 列表:', event.messageIds);
    console.log('删除时间戳上限:', event.beforeTimestamp);
    console.log('来源设备 ID:', event.deviceId);
  },
});
```

## 常见问题

Q: 多端多设备场景下，如何将 Uniapp 移动端设置为单独一端？

A：对于使用 Uniapp 打包的移动端和小程序端，在环信侧多端多设备场景中默认视为 web 端。如果你希望这些端被视为独立的平台，你可以利用自定义平台功能为这些端单独配置平台编号和设备数量。

例如，将 Uniapp 移动端设置为单独一端，支持一台设备。你需在控制台设置设备平台 ID 和支持的设备数量，并在客户端初始化时设置对应的 `customOSPlatform` 与 `customDeviceName`，如下所示：

![img](/images/web/multidevice_uniapp_mobile.png)

客户端示例代码如下：

```typescript
const client = ChatClient.init({
  appKey: 'your appKey',
  // 这里传入的自定义平台 ID 必须与控制台上设置的相同。
  customOSPlatform: 1,
  // 自定义设备名称。
  customDeviceName: 'Uniapp-mobile',
  managers: [],
});
```

## 接口列表

| API 名称                                                     | 所属模块/类  | 说明                                                         |
| ------------------------------------------------------------ | ------------ | ------------------------------------------------------------ |
| [`ChatClient.init`](#设置登录设备的平台)                     | `ChatClient` | 初始化 SDK，并配置多端登录相关参数，例如 `useFixedDeviceId`、`deviceId`、`customOSPlatform`、`customDeviceName` 和 `loginExtensionInfo`。 |
| [`getSelfIdsOnOtherPlatform`](#获取当前用户的其他登录设备的登录-id-列表) | `ChatClient` | 获取当前用户在其他已登录设备上的 `userId/resource` 列表，当前设备会被自动过滤。 |
