# 在线状态订阅

## 功能说明

用户在线状态（即 Presence）包含用户的在线、离线以及自定义状态。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

本文介绍如何在即时通讯应用中发布、订阅和查询用户的在线状态。

关于用户的在线、离线和自定义状态的定义、变更以及用户的实时感知，详见[用户在线状态管理](/product/product_user_presence.html)。

## 功能开通

使用在线状态订阅功能前，需要在环信控制台开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 订阅流程

订阅用户在线状态的基本工作流程如下：

![img](/images/android/presence.png)

如上图所示，订阅用户在线状态的基本步骤如下：

1. 用户 A 订阅用户 B 的在线状态；
2. 用户 B 的在线状态发生变更；
3. 用户 A 收到 `onPresenceStatusChanged` 回调。

效果如下图：

![img](/images/android/status.png)

## 前提条件

使用在线状态功能前，请确保满足以下条件：

- 完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 已在[环信控制台](https://console.easemob.com/user/login)开通在线状态订阅功能。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 订阅指定用户的在线状态

默认情况下，你不关注任何其他用户的在线状态。你可以通过调用 `ChatPresenceManager.subscribe` 方法订阅指定用户的在线状态，示例代码如下：

```dart
try {
  final List<ChatPresence> presences =
      await ChatClient.getInstance.presenceManager.subscribe(
    members: userIds,
    expiry: 1 * 24 * 3600,
  );
} on ChatError catch (error) {
  // 订阅失败。
}
```

成功订阅指定用户的在线状态后，SDK 通过方法返回值返回被订阅用户的在线状态。

被订阅用户的在线状态发生变化时，订阅者会收到 `ChatPresenceEventHandler.onPresenceStatusChanged` 回调。

:::tip
- 订阅时长最长为 30 天，过期需重新订阅。如果未过期的情况下重复订阅，新设置的有效期会覆盖之前的有效期。
- 每次调用接口最多只能订阅 100 个账号，若数量较大需多次调用。
- 每个用户 ID 订阅的用户数不超过 3000。如果超过 3000，后续订阅也会成功，但默认会将订阅剩余时长较短的替代。
- 每个用户最多可被 3000 个用户订阅。
:::

## 发布自定义在线状态

用户在线时，可调用 `ChatPresenceManager.publishPresence` 方法发布自定义在线状态：

```dart
try {
  await ChatClient.getInstance.presenceManager.publishPresence('自定义状态');
} on ChatError catch (error) {
  // 发布失败。
}
```

在线状态发布后，发布者和订阅者均会收到 `ChatPresenceEventHandler.onPresenceStatusChanged` 回调。

## 添加在线状态监听器

添加用户在线状态的监听器，示例代码如下：

```dart
const String presenceHandlerId = 'PRESENCE_HANDLER_ID';

final ChatPresenceEventHandler presenceEventHandler =
    ChatPresenceEventHandler(
  onPresenceStatusChanged: (List<ChatPresence> presences) {
    // 处理在线状态更新。
  },
);

ChatClient.getInstance.presenceManager.addEventHandler(
  presenceHandlerId,
  presenceEventHandler,
);
```

使用 `ChatPresenceEventHandler` 监听器实现 `onPresenceStatusChanged` 回调。当订阅的用户在线状态发生变化时，会收到该回调。

不再需要监听时，可调用 `ChatPresenceManager.removeEventHandler` 移除监听器：

```dart
ChatClient.getInstance.presenceManager.removeEventHandler(presenceHandlerId);
```

## 取消订阅指定用户的在线状态

若取消指定用户的在线状态订阅，可调用 `ChatPresenceManager.unsubscribe` 方法，示例代码如下：

```dart
try {
  await ChatClient.getInstance.presenceManager.unsubscribe(
    members: userIds,
  );
} on ChatError catch (error) {
  // 取消订阅失败。
}
```

## 查询被订阅用户列表

为方便用户管理订阅关系，SDK 提供 `ChatPresenceManager.fetchSubscribedMembers` 方法，可使用户分页查询自己订阅的用户列表，示例代码如下：

```dart
// pageNum：当前页码，从 1 开始。
// pageSize：每页返回的用户数量。取值范围为 [1, 100]，默认值为 20。
try {
  final List<String> subscribedMembers =
      await ChatClient.getInstance.presenceManager.fetchSubscribedMembers(
    pageNum: pageNum,
    pageSize: pageSize,
  );
} on ChatError catch (error) {
  // 查询失败。
}
```

## 获取用户的当前在线状态

如果不关注用户的在线状态变更，你可以调用 `ChatPresenceManager.fetchPresenceStatus` 获取用户当前的在线状态，而无需订阅状态。示例代码如下：

```dart
// userIds：要查询状态的用户 ID，每次最多可传 100 个用户 ID。
try {
  final List<ChatPresence> presences =
      await ChatClient.getInstance.presenceManager.fetchPresenceStatus(
    members: userIds,
  );
} on ChatError catch (error) {
  // 查询失败。
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`subscribe`](#订阅指定用户的在线状态) | `ChatPresenceManager` | 订阅指定用户的在线状态。 |
| [`publishPresence`](#发布自定义在线状态) | `ChatPresenceManager` | 发布当前用户的自定义在线状态。 |
| [`unsubscribe`](#取消订阅指定用户的在线状态) | `ChatPresenceManager` | 取消订阅指定用户的在线状态。 |
| [`fetchSubscribedMembers`](#查询被订阅用户列表) | `ChatPresenceManager` | 分页查询当前用户已订阅的用户列表。 |
| [`fetchPresenceStatus`](#获取用户的当前在线状态) | `ChatPresenceManager` | 查询指定用户当前的在线状态。 |
| [`publisher`](#获取用户的当前在线状态) | `ChatPresence` | 获取在线状态发布者 ID。 |
| [`statusDetails`](#获取用户的当前在线状态) | `ChatPresence` | 获取发布者各设备的在线状态。 |
| [`statusDescription`](#发布自定义在线状态) | `ChatPresence` | 获取自定义在线状态扩展信息。 |
| [`lastTime`](#获取用户的当前在线状态) | `ChatPresence` | 获取状态更新时间。 |
| [`expiryTime`](#订阅指定用户的在线状态) | `ChatPresence` | 获取订阅到期时间。 |
