# 在线状态订阅

## 功能说明

用户在线状态（即 Presence）包含用户的在线、离线以及自定义状态。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

本文介绍如何在即时通讯应用中发布、订阅和查询用户的在线状态。

关于用户的在线、离线和自定义状态的定义、变更以及用户的实时感知，详见 [用户在线状态管理](/product/product_user_presence.html)。

## 功能开通

使用在线状态订阅功能前，需要在环信控制台开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 订阅流程

订阅用户在线状态的基本工作流程如下：

![img](/images/ios/presence.png)

如上图所示，订阅用户在线状态的基本步骤如下：

1. 用户 A 订阅用户 B 的在线状态；
2. 用户 B 的在线状态发生变更；
3. 用户 A 收到 `presenceStatusDidChanged` 回调。

效果如下图：

![img](/images/ios/status.png)

## 前提条件

使用在线状态功能前，请确保满足以下条件：

 - 完成 iOS SDK 初始化并登录，详见 [快速开始](quickstart.html)。
 - 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
 - 已在 [环信控制台](https://console.easemob.com/user/login) 开通在线状态订阅功能。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 订阅指定用户的在线状态

默认情况下，你不关注任何其他用户的在线状态。你可以调用 `subscribe` 订阅指定用户的在线状态。

```objectivec
NSArray<NSString *> *members = @[@"Alice", @"Bob"];
NSTimeInterval expiry = 7 * 24 * 3600;

[[EMClient sharedClient].presenceManager subscribe:members
                                            expiry:expiry
                                        completion:^(NSArray<EMPresence *> *presences, EMError *error) {
    if (!error) {
        // presences 为成功订阅用户的当前在线状态。
    } else {
        // 订阅失败，根据 error.code 和 error.errorDescription 处理。
    }
}];
```

成功订阅指定用户的在线状态后，SDK 通过 completion 返回被订阅用户的当前在线状态。

在线状态变更时，订阅者会收到 `presenceStatusDidChanged` 回调。

:::tip
 - 订阅时长最长为 30 天，过期需重新订阅。如果未过期的情况下重复订阅，新设置的有效期会覆盖之前的有效期。
 - 每次调用接口最多只能订阅 100 个账号，若数量较大需多次调用。
 - 每个用户 ID 订阅的用户数不超过 3000。如果超过 3000，后续订阅也会成功，但默认会将订阅剩余时长较短的替代。
 - 每个用户最多可被 3000 个用户订阅。
:::

## 发布自定义在线状态

用户在线时，可调用 `publishPresenceWithDescription` 发布自定义在线状态。自定义状态描述建议不超过 64 字节；传入 `nil` 可清空自定义描述。

```objectivec
[[EMClient sharedClient].presenceManager publishPresenceWithDescription:@"custom presence"
                                                              completion:^(EMError *error) {
    if (!error) {
        // 发布成功。
    } else {
        // 发布失败。
    }
}];
```

在线状态发布后，发布者和订阅者均会收到 `presenceStatusDidChanged` 回调。

## 添加在线状态监听器

添加用户在线状态监听器，示例代码如下：

```objectivec
[[EMClient sharedClient].presenceManager addDelegate:self delegateQueue:nil];
```

参考如下示例代码，实现 `EMPresenceManagerDelegate`。当被订阅用户的在线状态发生变化时，会收到 `presenceStatusDidChanged` 回调。

```objectivec
@interface PresenceViewController () <EMPresenceManagerDelegate>
@end

@implementation PresenceViewController

- (void)presenceStatusDidChanged:(NSArray<EMPresence *> *)presences {
    for (EMPresence *presence in presences) {
        NSString *userId = presence.publisher;
        NSString *description = presence.statusDescription;
        NSArray<EMPresenceStatusDetail *> *statusDetails = presence.statusDetails;
        // 根据 userId、description 和 statusDetails 刷新 UI。
    }
}

@end
```

不再需要监听时，可调用 `removeDelegate` 移除监听器：

```objectivec
[[EMClient sharedClient].presenceManager removeDelegate:self];
```

## 取消订阅指定用户的在线状态

若取消指定用户的在线状态订阅，可调用 `unsubscribe`：

```objectivec
NSArray<NSString *> *members = @[@"Alice"];

[[EMClient sharedClient].presenceManager unsubscribe:members completion:^(EMError *error) {
    if (!error) {
        // 取消订阅成功。
    } else {
        // 取消订阅失败。
    }
}];
```

## 查询被订阅用户列表

为方便管理订阅关系，SDK 提供 `fetchSubscribedMembersWithPageNum`，可分页查询当前用户订阅的用户列表。

```objectivec
// pageNum：当前页码，从 1 开始。
// pageSize：每页返回的用户数量。取值范围为 [1,100]，默认值为 1。
NSUInteger pageNum = 1;
NSUInteger pageSize = 50;

[[EMClient sharedClient].presenceManager fetchSubscribedMembersWithPageNum:pageNum
                                                                  pageSize:pageSize
                                                                Completion:^(NSArray<NSString *> *members, EMError *error) {
    if (!error) {
        // members 为当前页已订阅用户的用户 ID 列表。
    } else {
        // 查询失败。
    }
}];
```

## 获取用户的当前在线状态

如果不关注用户的在线状态变更，你可以调用 `fetchPresenceStatus` 获取用户当前的在线状态，而无需订阅状态。

```objectivec
// 每次最多可传入 100 个用户 ID。
NSArray<NSString *> *members = @[@"Alice", @"Tom"];

[[EMClient sharedClient].presenceManager fetchPresenceStatus:members
                                                   completion:^(NSArray<EMPresence *> *presences, EMError *error) {
    if (!error) {
        for (EMPresence *presence in presences) {
            // presence.publisher 为用户 ID。
            // presence.statusDetails 为各在线设备的状态详情。
            // presence.statusDescription 为自定义在线状态描述。
        }
    } else {
        // 查询失败。
    }
}];
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`subscribe`](#订阅指定用户的在线状态) | `IEMPresenceManager` | 异步订阅指定用户的在线状态，并返回当前在线状态。 |
| [`publishPresenceWithDescription`](#发布自定义在线状态) | `IEMPresenceManager` | 异步发布当前用户的自定义在线状态。 |
| [`unsubscribe`](#取消订阅指定用户的在线状态) | `IEMPresenceManager` | 异步取消订阅指定用户的在线状态。 |
| [`fetchSubscribedMembersWithPageNum`](#查询被订阅用户列表) | `IEMPresenceManager` | 异步分页查询当前用户已订阅的用户列表。 |
| [`fetchPresenceStatus`](#获取用户的当前在线状态) | `IEMPresenceManager` | 异步查询指定用户的当前在线状态。 |
| [`publisher`](#获取用户的当前在线状态) | `EMPresence` | 获取在线状态发布者的用户 ID。 |
| [`statusDetails`](#获取用户的当前在线状态) | `EMPresence` | 获取发布者各在线设备的状态详情。 |
| [`statusDescription`](#发布自定义在线状态) | `EMPresence` | 获取自定义在线状态描述。 |
| [`lastTime`](#获取用户的当前在线状态) | `EMPresence` | 获取在线状态更新时间。 |
| [`expirytime`](#订阅指定用户的在线状态) | `EMPresence` | 获取在线状态订阅到期时间。 |
| [`device`](#获取用户的当前在线状态) / [`status`](#获取用户的当前在线状态) | `EMPresenceStatusDetail` | 获取在线设备的平台和在线状态。 |
