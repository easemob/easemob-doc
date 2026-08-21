# Presence Subscription

## Feature overview

User presence includes online, offline, and custom states. Before using this feature, activate the service in [Easemob Console](https://console.easemob.com/user/login). For details, see the [Easemob Console documentation](/product/console/basic_user.html#用户离在线状态实时同步).

This page describes how to publish, subscribe to, and query user presence in an instant messaging app.

For definitions and changes of online, offline, and custom states, and how users perceive them in real time, see [Presence Management](/product/product_user_presence.html).

## Feature activation

Before using presence subscriptions, activate the service in Easemob Console. For details, see the [Easemob Console documentation](/product/console/basic_user.html#用户离在线状态实时同步).

## Subscription process

The basic workflow for subscribing to user presence is as follows:

![img](/images/ios/presence.png)

As shown in the preceding figure, the basic steps are as follows:

1. User A subscribes to user B's presence.
2. User B's presence changes.
3. User A receives the `presenceStatusDidChanged` callback.

The result is shown in the following figure:

![img](/images/ios/status.png)

## Prerequisite

Before using presence, ensure that the following requirements are met:

 - Initialize the iOS SDK and log in. For details, see [Quickstart](quickstart.html).
 - Understand the EasyIM API [limitations](/product/limitation.html).
 - Activate presence subscriptions in [Easemob Console](https://console.easemob.com/user/login). For details, see the [Easemob Console documentation](/product/console/basic_user.html#用户离在线状态实时同步).

## Subscribe to specified users' presence

By default, you do not monitor any other user's presence. You can call `subscribe` to subscribe to specified users' presence.

```objectivec
NSArray<NSString *> *members = @[@"Alice", @"Bob"];
NSTimeInterval expiry = 7 * 24 * 3600;

[[EMClient sharedClient].presenceManager subscribe:members
                                            expiry:expiry
                                        completion:^(NSArray<EMPresence *> *presences, EMError *error) {
    if (!error) {
        // presences contains the current presence of users who were successfully subscribed to.
    } else {
        // The subscription failed. Handle the failure based on error.code and error.errorDescription.
    }
}];
```

After the subscription to specified users' presence succeeds, the SDK returns the subscribed users' current presence through the completion.

When presence changes, the subscriber receives the `presenceStatusDidChanged` callback.

:::tip
 - The maximum subscription duration is 30 days. Subscribe again after it expires. If you subscribe again before expiration, the newly specified validity period replaces the previous one.
 - Each API call can subscribe to up to 100 accounts. Make multiple calls for a larger number.
 - Each user ID can subscribe to no more than 3000 users. If the number exceeds 3000, subsequent subscriptions still succeed, but by default they replace subscriptions with a shorter remaining duration.
 - Each user can have up to 3000 subscribers.
:::

## Publish custom presence

When a user is online, call `publishPresenceWithDescription` to publish custom presence. We recommend limiting the custom state description to 64 bytes. Pass `nil` to clear the custom description.

```objectivec
[[EMClient sharedClient].presenceManager publishPresenceWithDescription:@"custom presence"
                                                              completion:^(EMError *error) {
    if (!error) {
        // Published successfully.
    } else {
        // Failed to publish.
    }
}];
```

After presence is published, both the publisher and subscribers receive the `presenceStatusDidChanged` callback.

## Add a presence listener

Add a user presence listener as shown in the following sample code:

```objectivec
[[EMClient sharedClient].presenceManager addDelegate:self delegateQueue:nil];
```

Implement `EMPresenceManagerDelegate` as shown in the following sample code. When a subscribed user's presence changes, the `presenceStatusDidChanged` callback is received.

```objectivec
@interface PresenceViewController () <EMPresenceManagerDelegate>
@end

@implementation PresenceViewController

- (void)presenceStatusDidChanged:(NSArray<EMPresence *> *)presences {
    for (EMPresence *presence in presences) {
        NSString *userId = presence.publisher;
        NSString *description = presence.statusDescription;
        NSArray<EMPresenceStatusDetail *> *statusDetails = presence.statusDetails;
        // Refresh the UI based on userId, description, and statusDetails.
    }
}

@end
```

When monitoring is no longer required, call `removeDelegate` to remove the listener:

```objectivec
[[EMClient sharedClient].presenceManager removeDelegate:self];
```

## Unsubscribe from specified users' presence

To unsubscribe from specified users' presence, call `unsubscribe`:

```objectivec
NSArray<NSString *> *members = @[@"Alice"];

[[EMClient sharedClient].presenceManager unsubscribe:members completion:^(EMError *error) {
    if (!error) {
        // Unsubscribed successfully.
    } else {
        // Failed to unsubscribe.
    }
}];
```

## Query the subscribed user list

To facilitate subscription relationship management, the SDK provides `fetchSubscribedMembersWithPageNum`, which allows the current user to query the subscribed user list by page.

```objectivec
// pageNum: The current page number, starting from 1.
// pageSize: The number of users returned per page. The value range is [1,100], and the default value is 1.
NSUInteger pageNum = 1;
NSUInteger pageSize = 50;

[[EMClient sharedClient].presenceManager fetchSubscribedMembersWithPageNum:pageNum
                                                                  pageSize:pageSize
                                                                Completion:^(NSArray<NSString *> *members, EMError *error) {
    if (!error) {
        // members contains the user ID list of subscribed users on the current page.
    } else {
        // The query failed.
    }
}];
```

## Retrieve users' current presence

If you do not monitor changes in users' presence, you can call `fetchPresenceStatus` to retrieve their current presence without subscribing to it.

```objectivec
// You can pass up to 100 user IDs in each call.
NSArray<NSString *> *members = @[@"Alice", @"Tom"];

[[EMClient sharedClient].presenceManager fetchPresenceStatus:members
                                                   completion:^(NSArray<EMPresence *> *presences, EMError *error) {
    if (!error) {
        for (EMPresence *presence in presences) {
            // presence.publisher is the user ID.
            // presence.statusDetails contains the status details of each online device.
            // presence.statusDescription is the custom presence description.
        }
    } else {
        // The query failed.
    }
}];
```

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`subscribe`](#subscribe-to-specified-users-presence) | `IEMPresenceManager` | Asynchronously subscribes to specified users' presence and returns their current presence. |
| [`publishPresenceWithDescription`](#publish-custom-presence) | `IEMPresenceManager` | Asynchronously publishes the current user's custom presence. |
| [`unsubscribe`](#unsubscribe-from-specified-users-presence) | `IEMPresenceManager` | Asynchronously unsubscribes from specified users' presence. |
| [`fetchSubscribedMembersWithPageNum`](#query-the-subscribed-user-list) | `IEMPresenceManager` | Asynchronously queries the current user's subscribed user list by page. |
| [`fetchPresenceStatus`](#retrieve-users-current-presence) | `IEMPresenceManager` | Asynchronously queries specified users' current presence. |
| [`publisher`](#retrieve-users-current-presence) | `EMPresence` | Retrieves the presence publisher's user ID. |
| [`statusDetails`](#retrieve-users-current-presence) | `EMPresence` | Retrieves the status details of the publisher's online devices. |
| [`statusDescription`](#publish-custom-presence) | `EMPresence` | Retrieves the custom presence description. |
| [`lastTime`](#retrieve-users-current-presence) | `EMPresence` | Retrieves the presence update time. |
| [`expirytime`](#subscribe-to-specified-users-presence) | `EMPresence` | Retrieves the presence subscription expiration time. |
| [`device`](#retrieve-users-current-presence) / [`status`](#retrieve-users-current-presence) | `EMPresenceStatusDetail` | Retrieves the online device platform and presence. |
