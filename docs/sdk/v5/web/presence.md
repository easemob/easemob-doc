# Presence Subscription

## Feature overview

User presence includes online, offline, and custom states. This document describes how to publish, subscribe to, and query user presence in an instant messaging app.

For definitions and changes of users' online, offline, and custom states and how users receive real-time updates, see [User Presence Management](/product/product_user_presence.html).

## Feature activation

Before using this feature, enable the service in the [Easemob Console](https://console.easemob.com/user/login). For details, see the [Easemob Console documentation](/product/console/basic_user.html#用户离在线状态实时同步).

## Subscription process

The basic process for subscribing to user presence is as follows:

![Presence_web](/images/web/presence.png)

As shown in the preceding diagram, the basic steps are as follows:

1. User A subscribes to User B's presence.
2. User B's presence changes. For example, User B goes online or offline or updates a custom state.
3. User A receives a state-change notification.

The following image shows the result:

![img](/images/web/web_chats_status_setting.png)

## Prerequisite

Before using presence, ensure that the following requirements are met:

- You have initialized and logged in to the SDK. For details, see [Quickstart](quickstart.html).
- You have registered `PresenceManager` and can call presence APIs through `client.presenceManager`.
- You understand the EasyIM API [limitations](/product/limitation.html).
- You have enabled presence subscription in the [Easemob Console](https://console.easemob.com/user/login). For details, see the [Easemob Console documentation](/product/console/basic_user.html#用户离在线状态实时同步).

## Subscribe to specified users' presence

By default, the current user does not automatically follow other users' presence. To receive real-time updates when specified users' presence changes, call `subscribePresence` to establish subscriptions.

```typescript
const result = await client.presenceManager.subscribePresence({
  // List of user IDs to subscribe to. You can subscribe to up to 100 users per call.
  userIds: ['user1', 'user2'],
  // Subscription duration in seconds, up to 30 days.
  expiry: 7 * 24 * 3600,
});

result.forEach((item) => {
  // Presence publisher, which is the user ID.
  console.log('publisher:', item.publisher);
  // Map of each device's presence, such as { web: 1, mobile: 1 }.
  console.log('statusList:', item.statusList);
  // Custom presence description.
  console.log('ext:', item.ext);
  // Latest update time as a millisecond timestamp.
  console.log('latestTime:', item.latestTime);
  // Presence expiration time as a millisecond timestamp.
  console.log('expiryTime:', item.expiryTime);
});
```

When presence changes, the subscriber receives the `onPresenceStatusChange` callback.

:::tip
- A subscription can be valid for up to 30 days. To continue following the user after it expires, subscribe again.
- When you subscribe to the same user again, the new subscription duration overwrites the previous duration.
- You can subscribe to up to 100 users per call. To subscribe to more users, make multiple calls.
- A user can subscribe to up to 3000 other users.
- A user can have up to 3000 subscribers.
:::

## Publish a custom presence state

When the current user is online, call `publishPresence` to publish a custom presence state so that subscribers can receive updates about the current state.

```typescript
await client.presenceManager.publishPresence({
  // Custom presence state.
  customStatus: 'busy',
});
```

## Add a presence listener

Presence events are `PresenceManager`-level events. Monitor them through `client.presenceManager.addEventHandler`.

```typescript
client.presenceManager.addEventHandler('presence', {
  // Triggered when a subscribed user's presence changes.
  onPresenceStatusChange: (presenceList) => {
    presenceList.forEach((presence) => {
      // User ID associated with the presence.
      console.log('用户:', presence.userId);
      // Detailed list of multi-device states.
      console.log('设备状态:', presence.statusDetails);
      // Custom presence description corresponding to `customStatus` when published.
      console.log('扩展状态:', presence.ext);
      // Latest update time in milliseconds.
      console.log('更新时间:', presence.lastTime);
      // Current subscription expiration time in milliseconds.
      console.log('订阅到期时间:', presence.expire);
    });
  },
});
```

`statusDetails` is a detailed list of multi-device states. Each item generally contains the following fields:

- `device`: Device identifier, such as `web` or `mobile`.
- `status`: Presence value on the device.

## Unsubscribe from specified users' presence

When you no longer need to follow changes in specified users' presence, call `unsubscribePresence`. After the call succeeds, you no longer receive presence-change events for these users.

```typescript
await client.presenceManager.unsubscribePresence({
  // List of user IDs to unsubscribe from.
  userIds: ['user1', 'user2'],
});
```

## Query the subscribed-user list

To manage the current user's subscriptions, call `getSubscribedPresenceList` to query the subscribed-user list with pagination.

```typescript
const result = await client.presenceManager.getSubscribedPresenceList({
  // Current page number, starting from 1.
  pageNum: 0,
  // Number of users returned per page. The value range is [1,100], and the default is 1.
  pageSize: 50,
});

result.forEach((userId) => {
  // User ID of a subscribed user.
  console.log('subscribed user:', userId);
});
```

This API returns `string[]`, a list of subscribed user IDs, without presence details. To query the current presence of these users, call [getPresenceStatus](#retrieve-users-current-presence).

## Retrieve users' current presence

If your app needs only users' current presence and does not need to continuously monitor subsequent changes, call `getPresenceStatus` to query it without subscribing to the users first.

```typescript
const result = await client.presenceManager.getPresenceStatus({
  // List of user IDs to query. You can query up to 100 users per call.
  userIds: ['user1', 'user2'],
});

result.forEach((item) => {
  // Presence publisher, which is the user ID.
  console.log('publisher:', item.publisher);
  // Map of each device's presence.
  console.log('statusList:', item.statusList);
  // Custom presence description.
  console.log('ext:', item.ext);
  // Latest update time as a millisecond timestamp.
  console.log('latestTime:', item.latestTime);
  // Presence expiration time as a millisecond timestamp.
  console.log('expiryTime:', item.expiryTime);
});
```

This API and [subscribePresence](#subscribe-to-specified-users-presence) both return an array of presence business objects.

## API list

| API name                                             | Module/Class       | Description                               |
| ---------------------------------------------------- | ----------------- | ---------------------------------- |
| [`subscribePresence`](#subscribe-to-specified-users-presence)       | `PresenceManager` | Subscribes to specified users' presence.           |
| [`publishPresence`](#publish-a-custom-presence-state)             | `PresenceManager` | Publishes the current user's custom presence state.     |
| [`unsubscribePresence`](#unsubscribe-from-specified-users-presence) | `PresenceManager` | Unsubscribes from specified users' presence.       |
| [`getSubscribedPresenceList`](#query-the-subscribed-user-list)   | `PresenceManager` | Queries the current user's subscribed-user list with pagination. |
| [`getPresenceStatus`](#retrieve-users-current-presence)       | `PresenceManager` | Queries specified users' current presence.   |
