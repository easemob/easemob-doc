# 在线状态订阅

## 功能说明

用户在线状态（即 Presence）包含用户的在线、离线以及自定义状态。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

本文介绍如何在即时通讯应用中发布、订阅和查询用户的在线状态。

关于用户的在线、离线和自定义状态的定义、变更以及用户对状态变更的实时感知，详见 [用户在线状态管理](/product/product_user_presence.html)。

## 功能开通

使用在线状态订阅功能前，需要在环信控制台开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 订阅流程

订阅用户在线状态的基本工作流程如下：

![订阅用户在线状态的流程](/images/android/presence.png)

如上图所示，订阅用户在线状态的基本步骤如下：

1. 用户 A 订阅用户 B 的在线状态；
2. 用户 B 的在线状态发生变更；
3. 用户 A 收到 `onPresenceUpdated` 回调。

效果如下图：

![用户在线状态的展示效果](/images/android/status.png)

## 前提条件

使用在线状态功能前，请确保满足以下条件：

- 完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通在线状态订阅功能。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 订阅指定用户的在线状态

默认情况下，你不关注任何其他用户的在线状态。你可以调用 `PresenceManager#subscribePresences` 订阅单个或多个指定用户的在线状态。订阅时长 `expiry` 的单位为秒。

```typescript
const members: Array<string> = ['user1', 'user2'];
const expiry: number = 24 * 60 * 60;

ChatClient.getInstance().presenceManager()?.subscribePresences(members, expiry)
  .then((presences: Array<Presence>): void => {
    // presences 为订阅成功后返回的被订阅用户在线状态。
  })
  .catch((error: ChatError): void => {
    // 订阅失败。
  });
```

订阅成功后，SDK 返回被订阅用户的当前在线状态。被订阅用户的在线状态发生变化时，订阅者会收到 `PresenceListener#onPresenceUpdated` 回调。

:::tip
- 订阅时长最长为 30 天。订阅到期后需重新订阅；订阅尚未到期时重复订阅，新设置的有效期会覆盖原有效期。
- 每次最多订阅 100 个用户。若需订阅更多用户，应分批调用该方法。
- 每个用户最多订阅 3000 个用户的在线状态。如果超过 3000，后续订阅也会成功，但默认会将订阅剩余时长较短的替代。
- 每个用户的在线状态最多被 3000 个用户订阅。
:::

## 发布自定义在线状态

用户在线时，可调用 `PresenceManager#publishPresence` 发布自定义在线状态：

```typescript
const customStatus: string = '忙碌中';

ChatClient.getInstance().presenceManager()?.publishPresence(customStatus)
  .then((): void => {
    // 发布成功。
  })
  .catch((error: ChatError): void => {
    // 发布失败。
  });
```

在线状态发布后，发布者和订阅者均会收到 `PresenceListener#onPresenceUpdated` 回调。可通过回调中的 `Presence#getExt` 获取发布的自定义状态。

## 添加在线状态监听器

调用 `PresenceManager#addListener` 添加在线状态监听器。当订阅的用户在线状态发生变化时，会收到 `PresenceListener#onPresenceUpdated` 回调：

```typescript
const presenceListener: PresenceListener = {
  onPresenceUpdated: (presences: Array<Presence>): void => {
    for (const presence of presences) {
      const publisher: string = presence.getPublisher();
      const customStatus: string = presence.getExt();
      const statusList: Map<string, number> = presence.getStatusList();
      // 根据发布者、在线状态和自定义状态刷新界面。
    }
  }
};

ChatClient.getInstance().presenceManager()?.addListener(presenceListener);
```

`Presence#getStatusList` 返回发布者各设备的状态。Map 的 key 为设备 ID，value 为设备状态：`0` 表示离线，`1` 表示在线。

不再需要监听时，调用 `PresenceManager#removeListener` 移除监听器：

```typescript
ChatClient.getInstance().presenceManager()?.removeListener(presenceListener);
```

## 取消订阅指定用户的在线状态

若不再关注指定用户的在线状态，可调用 `PresenceManager#unsubscribePresences` 取消订阅。该方法支持传入单个用户 ID 或用户 ID 数组：

```typescript
const members: Array<string> = ['user1', 'user2'];

ChatClient.getInstance().presenceManager()?.unsubscribePresences(members)
  .then((): void => {
    // 取消订阅成功。
  })
  .catch((error: ChatError): void => {
    // 取消订阅失败。
  });
```

## 查询被订阅用户列表

为方便管理订阅关系，可调用 `PresenceManager#fetchSubscribedMembers` 分页查询当前用户订阅的用户列表。

```typescript
// pageNum：当前页码，从 1 开始。
// pageSize：每页返回的用户数量。取值范围为 [1,100]，默认值为 1。
const pageNumber: number = 1;
const pageSize: number = 20;

ChatClient.getInstance().presenceManager()?.fetchSubscribedMembers(pageNumber, pageSize)
  .then((members: Array<string>): void => {
    // members 为当前页的被订阅用户 ID 列表。
  })
  .catch((error: ChatError): void => {
    // 查询失败。
  });
```

## 获取用户的当前在线状态

如果只需获取用户当前的在线状态而无需持续关注状态变更，可调用 `PresenceManager#fetchPresenceStatus`。

```typescript
//要查询状态的用户 ID，每次最多可传 100 个用户 ID。 
const members: Array<string> = ['user1', 'user2'];

ChatClient.getInstance().presenceManager()?.fetchPresenceStatus(members)
  .then((presences: Array<Presence>): void => {
    for (const presence of presences) {
      const publisher: string = presence.getPublisher();
      const statusList: Map<string, number> = presence.getStatusList();
      const customStatus: string = presence.getExt();
      const latestTime: number = presence.getLatestTime();
      const expiryTime: number = presence.getExpiryTime();
      // 处理当前在线状态。
    }
  })
  .catch((error: ChatError): void => {
    // 查询失败。
  });
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`subscribePresences`](#订阅指定用户的在线状态) | `PresenceManager` | 订阅指定用户的在线状态。 |
| [`publishPresence`](#发布自定义在线状态) | `PresenceManager` | 发布当前用户的自定义在线状态。 |
| [`addListener`](#添加在线状态监听器) | `PresenceManager` | 添加在线状态监听器。 |
| [`removeListener`](#添加在线状态监听器) | `PresenceManager` | 移除在线状态监听器。 |
| [`unsubscribePresences`](#取消订阅指定用户的在线状态) | `PresenceManager` | 取消订阅指定用户的在线状态。 |
| [`fetchSubscribedMembers`](#查询被订阅用户列表) | `PresenceManager` | 分页查询当前用户订阅的用户列表。 |
| [`fetchPresenceStatus`](#获取用户的当前在线状态) | `PresenceManager` | 查询指定用户当前的在线状态。 |
| [`onPresenceUpdated`](#添加在线状态监听器) | `PresenceListener` | 在线状态发生变化时触发。 |
| [`getPublisher`](#获取用户的当前在线状态) | `Presence` | 获取在线状态发布者的用户 ID。 |
| [`getStatusList`](#获取用户的当前在线状态) | `Presence` | 获取发布者各设备的在线状态。 |
| [`getExt`](#发布自定义在线状态) | `Presence` | 获取自定义在线状态。 |
| [`getLatestTime`](#获取用户的当前在线状态) | `Presence` | 获取状态更新时间。 |
| [`getExpiryTime`](#订阅指定用户的在线状态) | `Presence` | 获取在线状态订阅到期时间。 |
