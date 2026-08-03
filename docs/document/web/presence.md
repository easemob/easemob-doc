# 在线状态订阅

## 功能说明

用户在线状态（即 Presence）包含用户的在线、离线以及自定义状态。本文介绍如何在即时通讯应用中发布、订阅和查询用户的在线状态。

关于用户的在线、离线和自定义状态的定义、变更以及用户的实时感知，详见 [用户在线状态管理](/product/product_user_presence.html)。

## 功能开通

使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 订阅流程

订阅用户在线状态的基本工作流程如下：

![Presence_web](/images/web/presence.png)

如上图所示，订阅用户在线状态的基本步骤如下：

1. 用户 A 订阅用户 B 的在线状态。
2. 用户 B 的在线状态发生变化，例如上线、离线或更新自定义状态。
3. 用户 A 收到状态变更通知。

效果如下图：

![img](/images/web/web_chats_status_setting.png)

## 前提条件

使用在线状态功能前，请确保满足以下条件：

- 完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)。
- 已注册 `PresenceManager`，能够通过 `client.presenceManager` 调用在线状态相关接口。
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通在线状态订阅功能。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 订阅指定用户的在线状态

默认情况下，当前用户不会自动关注其他用户的在线状态。若需要实时感知指定用户的在线状态变化，可调用 `subscribePresence` 建立订阅关系。

```typescript
const result = await client.presenceManager.subscribePresence({
  // 待订阅的用户 ID 列表。每次最多 100 人。
  userIds: ['user1', 'user2'],
  // 订阅有效期，单位秒，最长 30 天。
  expiry: 7 * 24 * 3600,
});

result.forEach((item) => {
  // 状态发布者，即用户 ID。
  console.log('publisher:', item.publisher);
  // 各设备的在线状态映射，例如 { web: 1, mobile: 1 }。
  console.log('statusList:', item.statusList);
  // 自定义在线状态描述。
  console.log('ext:', item.ext);
  // 最新更新时间，毫秒时间戳。
  console.log('latestTime:', item.latestTime);
  // 状态到期时间，毫秒时间戳。
  console.log('expiryTime:', item.expiryTime);
});
```

在线状态变更时，订阅者会收到 `onPresenceStatusChange` 事件回调。

:::tip
- 订阅时长最长为 30 天，过期后如需继续关注，需重新订阅。
- 重复订阅同一用户时，新的订阅有效期会覆盖之前的有效期。
- 单次调用最多可订阅 100 个用户；如需订阅更多用户，请分批调用。
- 单个用户最多可订阅 3000 个其他用户。
- 单个用户最多可被 3000 个用户订阅。
:::

## 发布自定义在线状态

当前用户在线时，可调用 `publishPresence` 发布自定义在线状态，供订阅者感知当前状态变化。

```typescript
await client.presenceManager.publishPresence({
  // 自定义在线状态。
  customStatus: 'busy',
});
```

## 添加在线状态监听器

在线状态事件属于 `PresenceManager` 级别事件，应通过 `client.presenceManager.addEventHandler` 监听。

```typescript
client.presenceManager.addEventHandler('presence', {
  // 订阅的用户在线状态变更时触发。
  onPresenceStatusChange: (presenceList) => {
    presenceList.forEach((presence) => {
      // 状态所属用户 ID。
      console.log('用户:', presence.userId);
      // 多设备状态详情列表。
      console.log('设备状态:', presence.statusDetails);
      // 自定义在线状态描述，对应发布时的 `customStatus`。
      console.log('扩展状态:', presence.ext);
      // 状态最新的更新时间，单位为毫秒。
      console.log('更新时间:', presence.lastTime);
      // 当前订阅到期时间，单位为毫秒。
      console.log('订阅到期时间:', presence.expire);
    });
  },
});
```

其中，`statusDetails` 为多设备状态明细列表，每一项通常包含以下字段：

- `device`：设备标识，例如 `web`、`mobile`。
- `status`：该设备上的在线状态值。

## 取消订阅指定用户的在线状态

若不再需要关注指定用户的在线状态变化，可调用 `unsubscribePresence` 取消订阅。取消成功后，将不再收到这些用户的在线状态变更事件。

```typescript
await client.presenceManager.unsubscribePresence({
  // 待取消订阅的用户 ID 列表。
  userIds: ['user1', 'user2'],
});
```

## 查询被订阅用户列表

若需要管理当前用户的订阅关系，可调用 `getSubscribedPresenceList` 分页查询已订阅的用户列表。

```typescript
const result = await client.presenceManager.getSubscribedPresenceList({
  // 当前页码，从 1 开始。
  pageNum: 0,
  // 每页返回的用户数量。取值范围为 [1,100]，默认值为 1。
  pageSize: 50,
});

result.forEach((userId) => {
  // 已订阅用户的用户 ID。
  console.log('subscribed user:', userId);
});
```

该接口返回 `string[]`，即已订阅用户的 ID 列表，不返回在线状态详情。如需查询这些用户的当前在线状态，请继续调用 [getPresenceStatus](#获取用户的当前在线状态)。

## 获取用户的当前在线状态

如果你的业务只需要获取用户当前的在线状态，而不需要持续监听后续变化，可调用 `getPresenceStatus` 主动查询，而无需先订阅该用户。

```typescript
const result = await client.presenceManager.getPresenceStatus({
  // 待查询的用户 ID 列表。每次最多 100 人。
  userIds: ['user1', 'user2'],
});

result.forEach((item) => {
  // 状态发布者，即用户 ID。
  console.log('publisher:', item.publisher);
  // 各设备的在线状态映射。
  console.log('statusList:', item.statusList);
  // 自定义在线状态描述。
  console.log('ext:', item.ext);
  // 最新更新时间，毫秒时间戳。
  console.log('latestTime:', item.latestTime);
  // 状态到期时间，毫秒时间戳。
  console.log('expiryTime:', item.expiryTime);
});
```

该接口返回值与 [subscribePresence](#订阅指定用户的在线状态) 一致，均为在线状态业务对象数组。

## 接口列表

| API 名称                                             | 所属模块/类       | 说明                               |
| ---------------------------------------------------- | ----------------- | ---------------------------------- |
| [`subscribePresence`](#订阅指定用户的在线状态)       | `PresenceManager` | 订阅指定用户的在线状态。           |
| [`publishPresence`](#发布自定义在线状态)             | `PresenceManager` | 发布当前用户的自定义在线状态。     |
| [`addEventHandler`](#添加在线状态监听器)             | `PresenceManager` | 注册在线状态事件监听器。           |
| [`unsubscribePresence`](#取消订阅指定用户的在线状态) | `PresenceManager` | 取消订阅指定用户的在线状态。       |
| [`getSubscribedPresenceList`](#查询被订阅用户列表)   | `PresenceManager` | 分页查询当前用户已订阅的用户列表。 |
| [`getPresenceStatus`](#获取用户的当前在线状态)       | `PresenceManager` | 主动查询指定用户当前的在线状态。   |