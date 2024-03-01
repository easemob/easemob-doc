# 消息表情回复 Reaction

<Toc />

环信即时通讯 IM 提供消息表情回复（下文统称 “Reaction”）功能。用户可以在单聊和群聊中对消息添加、删除表情。表情可以直观地表达情绪，利用 Reaction 可以提升用户的使用体验。同时在群组中，利用 Reaction 可以发起投票，根据不同表情的追加数量来确认投票。

:::notice

目前 Reaction 仅适用于单聊和群组。聊天室暂不支持 Reaction 功能。

:::

## 技术原理

环信即时通讯 IM SDK 支持你通过调用 API 在项目中实现如下功能：

- `AddReaction` 在消息上添加 Reaction；
- `RemoveReaction` 删除消息的 Reaction；
- `GetReactionList` 获取消息的 Reaction 列表；
- `GetReactionDetail` 获取 Reaction 详情；
- `Message.ReactionList` 从 `Message` 对象获取 Reaction 列表。

Reaction 场景示例如下：

![img](@static/images/android/reactions.png)

分别展示如何添加 Reaction，群聊中 Reaction 的效果，以及查看 Reaction 列表。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 `1.0.5 或 以上版本` SDK 初始化，详见 [快速开始](quickstart.html)。
2. 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
3. 已联系商务开通 Reaction 功能。

## 实现方法

### 在消息上添加 Reaction

调用 `AddReaction` 在消息上添加 Reaction。对于单聊会话，对端用户会收到 `MessageReactionDidChange` 事件，而群聊会话中，除操作者之外的其他群组成员均会收到该事件。该事件中的信息包括会话 ID、消息 ID，该消息的 Reaction 列表和 Reaction 操作列表（列明添加者的用户 ID、添加的 Reaction 的 ID 以及明确该操作为添加操作）。

对于同一条 Reaction，一个用户只能添加一次，重复添加会报错误 1301。

示例代码如下：

```csharp
// 添加 Reaction。
SDKClient.Instance.ChatManager.AddReaction(msg_id, reaction, new CallBack(
     onSuccess: () =>
     {
         Debug.Log($"AddReaction success.");
     },
     onError: (code, desc) =>
     {
         Debug.Log($"AddReaction failed, code:{code}, desc:{desc}");
     }
));

// 监听 Reaction 更新。
class ReactionManagerDelegate : IReactionManagerDelegate
{
    public void MessageReactionDidChange(List<MessageReactionChange> list)
    {
        if (list.Count == 0) return;
        foreach(var it in list)
        {
            //此处添加遍历列表代码
        }
    }
}

//添加 Reaction 监听器
ReactionManagerDelegate reactionManagerDelegate = new ReactionManagerDelegate();
SDKClient.Instance.ChatManager.AddReactionManagerDelegate(reactionManagerDelegate);
```

### 删除消息的 Reaction

调用 `RemoveReaction` 删除消息的 Reaction。对于单聊会话，对端用户会收到 `MessageReactionDidChange` 事件，而群聊会话中，除操作者之外的其他群组成员均会收到该事件。该事件中的信息包括会话 ID、消息 ID，该消息的 Reaction 列表和 Reaction 操作列表（列明添加者的用户 ID、添加的 Reaction 的 ID 以及明确该操作为删除操作）。

示例代码如下：

```csharp
// 删除 Reaction。
SDKClient.Instance.ChatManager.RemoveReaction(msg_id, reaction, new CallBack(
     onSuccess: () =>
     {
         Debug.Log($"RemoveReaction success.");
     },
     onError: (code, desc) =>
     {
         Debug.Log($"RemoveReaction failed, code:{code}, desc:{desc}");
     }
));

// 监听 Reaction 更新。
class ReactionManagerDelegate : IReactionManagerDelegate
{
    public void MessageReactionDidChange(List<MessageReactionChange> list)
    {
        if (list.Count == 0) return;
        foreach(var it in list)
        {
            //此处添加遍历列表代码
        }
    }
}

//添加 Reaction 监听器
ReactionManagerDelegate reactionManagerDelegate = new ReactionManagerDelegate();
SDKClient.Instance.ChatManager.AddReactionManagerDelegate(reactionManagerDelegate);
```

### 获取消息的 Reaction 列表

调用 `GetReactionList` 可以从服务器获取指定消息的 Reaction 概览列表，列表内容包含 Reaction 内容、添加或移除 Reaction 的用户数量以及添加或移除 Reaction 的前三个用户的用户 ID。示例代码如下：

```csharp
SDKClient.Instance.ChatManager.GetReactionList(messageIdList, chatType, groupId, new ValueCallBack<Dictionary<string, List<MessageReaction>>>(
onSuccess: (dict) =>
{
    //遍历返回的 Reaction 字典
    foreach (var it in dict)
    {
        //遍历字典每一个 List<MessageReaction>
        List<MessageReaction> rl = it.Value;
        foreach (var lit in rl)
        {
            //处理每一个 Reaction
        }
    }
},
onError: (code, desc) =>
{
    Debug.Log($"GetReactionList failed, code:{code}, desc:{desc}");
}
));
```

### 获取 Reaction 详情

调用 `GetReactionDetail` 可以从服务器获取指定 Reaction 的详情，包括 Reaction 内容、添加或移除 Reaction 的用户数量以及添加或移除 Reaction 的全部用户列表。示例代码如下：

```csharp
SDKClient.Instance.ChatManager.GetReactionDetail(msg_id, reaction, cursor, pageSize, new ValueCallBack<CursorResult<MessageReaction>>(
onSuccess: (ret) =>
{
    Debug.Log($"GetReactionDetail success");
    if (ret.Data.Count > 0)
    {
        MessageReaction mr = ret.Data[0];
        //处理获取到的 Reaction
    }
},
onError: (code, desc) =>
{
    Debug($"GetReactionDetail failed, code:{code}, desc:{desc}");
}
));
```
