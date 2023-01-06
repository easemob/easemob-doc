# 在线状态订阅

<Toc />

用户在线状态（即 Presence）包含用户的在线、离线以及自定义状态。

本文介绍如何在即时通讯应用中发布、订阅和查询用户的在线状态。

:::notice
私有化版本不支持在线状态订阅。
:::

## 技术原理

环信 IM SDK 提供 `Presence`、`PresenceManager` 和 `IPresenceManagerDelegate` 类，用于管理在线状态订阅，包含如下核心方法：

- `SubscribePresences`：订阅用户的在线状态；
- `PublishPresence`：发布自定义在线状态；
- `AddPresenceManagerDelegate`：添加在线状态监听器；
- `OnPresenceUpdated`：被订阅用户的在线状态变更时，订阅者收到监听回调；
- `UnsubscribePresences`：无需关注用户的在线状态时，取消订阅；
- `FetchSubscribedMembers`: 获取订阅关系;
- `FetchPresenceStatus`: 主动获取在线状态；

订阅用户在线状态的基本工作流程如下：

![](@static/images/android/presence.png)

如上图所示，订阅用户在线状态的基本步骤如下：

1. 用户 A 订阅用户 B 的在线状态；
2. 用户 B 的在线状态发生变更；
3. 用户 A 收到 `onPresenceUpdated` 回调。

效果如下图：

![](@static/images/windows/status.png)

## 前提条件

使用在线状态功能前，请确保满足以下条件：

- 完成 1.0.5 或以上版本 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 已联系商务开通在线状态订阅功能。

## 实现方法

本节介绍如何使用环信 IM SDK 提供的 API 实现上述功能。

### 订阅指定用户的在线状态

默认情况下，你不关注任何其他用户的在线状态。你可以通过调用 `PresenceManager#SubscribePresences` 方法订阅指定用户的在线状态，示例代码如下：

```csharp
SDKClient.Instance.PresenceManager.SubscribePresences(members, expiry, new ValueCallBack<List<Presence>>(
    onSuccess: (list) =>
    {
        //遍历返回的在线状态列表
        foreach (var it in list)
        {
            //处理每一个在线状态
        }
    },
    onError: (code, desc) =>
    {
        Debug.Log($"SubscribePresences failed, code:{code}, desc:{desc}");
    }
));
```

成功订阅指定用户的在线状态后，SDK 通过 `onSuccess` 回调返回被订阅用户的在线状态。

在线状态变更时，订阅者会收到 `IPresenceManagerDelegate#OnPresenceUpdated` 回调。

:::notice
- 订阅时长最长为 30 天，过期需重新订阅。如果未过期的情况下重复订阅，新设置的有效期会覆盖之前的有效期。
- 每次调用接口最多只能订阅 100 个账号，若数量较大需多次调用。每个用户 ID 订阅的用户数不超过 3000。如果超过 3000，后续订阅也会成功，但默认会将订阅剩余时长较短的替代。
:::

### 发布自定义在线状态

用户在线时，可调用 `PresenceManager#PublishPresence` 方法发布自定义在线状态：

```csharp
SDKClient.Instance.PresenceManager.PublishPresence(ext, new CallBack(
    onSuccess: () => {
        Debug.Log($"PublishPresence success.");
    },
    onError: (code, desc) => {
        Debug.Log($"PublishPresence failed, code:{code}, desc:{desc}");
    }
));
```

在线状态发布后，发布者和订阅者均会收到 `IPresenceManagerDelegate#OnPresenceUpdated` 回调。

### 添加在线状态监听器

添加用户在线状态的监听器，示例代码如下：

```csharp
PresenceManagerDelegate presenceManagerDelegate = new PresenceManagerDelegate();
SDKClient.Instance.PresenceManager.AddPresenceManagerDelegate(presenceManagerDelegate);
```

参考如下示例代码，使用 `IPresenceManagerDelegate` 监听器实现以下接口。当订阅的用户在线状态发生变化时，会收到 `OnPresenceUpdated` 回调。

```csharp
public interface IPresenceManagerDelegate
{
    void OnPresenceUpdated(List<Presence> presences);
}
```

### 取消订阅指定用户的在线状态

若取消指定用户的在线状态订阅，可调用 `PresenceManager#UnsubscribePresences` 方法，示例代码如下：

```csharp
SDKClient.Instance.PresenceManager.UnsubscribePresences(mem_list, new CallBack(
    onSuccess: () => {
        Debug.Log($"UnsubscribePresences success.");
    },
    onError: (code, desc) => {
        Debug.Log($"UnsubscribePresences failed, code:{code}, desc:{desc}");
    }
));
```

### 查询被订阅用户列表

为方便用户管理订阅关系，SDK 提供 `PresenceManager#FetchSubscribedMembers` 方法，可使用户分页查询自己订阅的用户列表，示例代码如下：

```csharp
SDKClient.Instance.PresenceManager.FetchSubscribedMembers(pageNum, pageSize, new ValueCallBack<List<string>>(
    onSuccess: (list) =>
    {
        //遍历用户列表
    },
    onError: (code, desc) =>
    {
        Debug.Log($"SubscribePresences failed, code:{code}, desc:{desc}");
    }
))
```

### 获取用户的当前在线状态

如果不关注用户的在线状态变更，你可以调用 `PresenceManager#FetchPresenceStatus` 获取用户当前的在线状态，而无需订阅状态。示例代码如下：

```csharp
SDKClient.Instance.PresenceManager.FetchPresenceStatus(members, new ValueCallBack<List<Presence>>(
    onSuccess: (list) =>
    {
        //遍历在线状态列表
        foreach (var it in list)
        {
            //处理每一个在线状态
        }
    },
    onError: (code, desc) =>
    {
        Debug.Log($"FetchPresenceStatus failed, code:{code}, desc:{desc}");
    }
));
```