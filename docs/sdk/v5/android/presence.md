# Presence Subscription

## Feature overview

User presence includes online, offline, and custom states. Before using this feature, activate the service in [Easemob Console](https://console.easemob.com/user/login). For details, see the [Easemob Console documentation](/product/console/basic_user.html#用户离在线状态实时同步).

This page describes how to publish, subscribe to, and query user presence in an instant messaging app.

For definitions and changes of online, offline, and custom states, and how users perceive them in real time, see [Presence Management](/product/product_user_presence.html).

## Feature activation

Before using presence subscriptions, activate the service in Easemob Console. For details, see the [Easemob Console documentation](/product/console/basic_user.html#用户离在线状态实时同步).

## Subscription process

The basic workflow for subscribing to user presence is as follows:

![img](/images/android/presence.png)

As shown in the preceding figure, the basic steps are as follows:

1. User A subscribes to user B's presence.
2. User B's presence changes.
3. User A receives the `onPresenceUpdated` callback.

The result is shown in the following figure:

![img](/images/android/status.png)

## Prerequisite

Before using presence, ensure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).
- Activate presence subscriptions in [Easemob Console](https://console.easemob.com/user/login). For details, see the [Easemob Console documentation](/product/console/basic_user.html#用户离在线状态实时同步).

## Subscribe to specified users' presence

By default, you do not monitor any other user's presence. Call `EMPresenceManager#subscribePresences` to subscribe to specified users' presence, as shown in the following sample code:

```java
EMClient.getInstance().presenceManager().subscribePresences(contactsFromServer, 1 * 24 * 3600, new EMValueCallBack<List<EMPresence>>() {
    @Override
    public void onSuccess(List<EMPresence> presences) {
        
    }

    @Override
    public void onError(int errorCode, String errorMsg) {
        
    }
});             
```

After the subscription succeeds, the SDK returns the subscribed users' presence through the `onSuccess` callback.

When presence changes, subscribers receive the `EMPresenceListener#onPresenceUpdated` callback.

:::tip
- The maximum subscription duration is 30 days. Subscribe again after it expires. If you subscribe again before expiration, the newly specified validity period replaces the previous one.
- Each API call can subscribe to up to 100 accounts. Make multiple calls for a larger number.
- Each user ID can subscribe to no more than 3000 users. If the number exceeds 3000, subsequent subscriptions still succeed, but by default they replace subscriptions with a shorter remaining duration.
- Each user can have up to 3000 subscribers.
:::

## Publish custom presence

When a user is online, call `EMPresenceManager#publishPresence` to publish custom presence:

```java
EMClient.getInstance().presenceManager().publishPresence("自定义状态", new EMCallBack() {
    @Override
    public void onSuccess() {

    }

    @Override
    public void onError(int code, String error) {

    }
});
```

After presence is published, both the publisher and subscribers receive the `EMPresenceListener#onPresenceUpdated` callback.

## Add a presence listener

Add a user presence listener as shown in the following sample code:

```java
EMPresenceListener presenceListener = new MyPresenceListener();
EMClient.getInstance().presenceManager().addListener(presenceListener);
```

Implement the following API using an `EMPresenceListener`, as shown in the sample code. When a subscribed user's presence changes, `onPresenceUpdated` is triggered.

```java
public interface EMPresenceListener {
    void onPresenceUpdated(List<EMPresence> presences);
}
```

When monitoring is no longer needed, call `EMPresenceManager#removeListener` to remove the listener:

```java
EMClient.getInstance().presenceManager().removeListener(presenceListener);
```

## Unsubscribe from specified users' presence

To unsubscribe from specified users' presence, call `EMPresenceManager#unsubscribePresences`, as shown in the following sample code:

```java
EMClient.getInstance().presenceManager().unsubscribePresences(contactsFromServer, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int errorCode, String errorMsg) {
        
    }
});
```

## Query the subscribed user list

To help users manage subscriptions, the SDK provides `EMPresenceManager#fetchSubscribedMembers` to query the user's subscribed user list by page, as shown in the following sample code:

```java
// pageNum: Current page number, starting from 1.
// pageSize: Number of users returned per page. The range is [1,100], and the default value is 1.
EMClient.getInstance().presenceManager().fetchSubscribedMembers(pageNum, pageSize, new EMValueCallBack<List<String>>() {
    @Override
    public void onSuccess(List<String> subscribedMembers) {
        
    }

    @Override
    public void onError(int errorCode, String errorMsg) {
        
    }
});
```

## Retrieve users' current presence

If you do not need to monitor presence changes, call `EMPresenceManager#fetchPresenceStatus` to retrieve users' current presence without subscribing, as shown in the following sample code:

```java
// contactsList: User IDs whose presence is queried. Pass up to 100 user IDs per call.
EMClient.getInstance().presenceManager().fetchPresenceStatus(contactsList, new EMValueCallBack<List<EMPresence>>() {
    @Override
    public void onSuccess(List<EMPresence> presences) {
        
    }

    @Override
    public void onError(int errorCode, String errorMsg) {
        
    }
});
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`subscribePresences`](#subscribe-to-specified-users-presence) | `EMPresenceManager` | Subscribes to specified users' presence. |
| [`publishPresence`](#publish-custom-presence) | `EMPresenceManager` | Publishes the current user's custom presence. |
| [`unsubscribePresences`](#unsubscribe-from-specified-users-presence) | `EMPresenceManager` | Unsubscribes from specified users' presence. |
| [`fetchSubscribedMembers`](#query-the-subscribed-user-list) | `EMPresenceManager` | Queries the current user's subscribed user list by page. |
| [`fetchPresenceStatus`](#retrieve-users-current-presence) | `EMPresenceManager` | Queries specified users' current presence. |
| [`getPublisher`](#retrieve-users-current-presence) | `EMPresence` | Retrieves the presence publisher ID. |
| [`getStatusList`](#retrieve-users-current-presence) | `EMPresence` | Retrieves the publisher's presence on each device. |
| [`getExt`](#publish-custom-presence) | `EMPresence` | Retrieves custom presence extension information. |
| [`getLatestTime`](#retrieve-users-current-presence) | `EMPresence` | Retrieves the state update time. |
| [`getExpiryTime`](#subscribe-to-specified-users-presence) | `EMPresence` | Retrieves the subscription expiration time. |
