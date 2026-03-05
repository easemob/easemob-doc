# 管理群组成员

<Toc />

群组是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中实现群组成员管理相关功能。

## 技术原理

环信即时通讯 IM SDK 提供 `Group`、`IGroupManager` 和 `IGroupManagerDelegate` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

- 加入、退出群组
- 管理群成员的自定义属性
- 管理群主及群管理员
- 管理群组黑名单
- 管理群组禁言
- 管理群组白名单

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)；
- 了解群成员角色，详见 [群组概述](group_overview.html)；
- 了解群组和群成员的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 加入群组

用户进群分为两种方式：主动申请入群和群成员邀请入群。

公开群和私有群在两种入群方式方面存在差别：

| 入群方式                   | 公开群       | 私有群          |
| :------------------------- | :------------------ | :------------------------------------ |
| 用户申请入群       | 支持 <br/>任何用户均可申请入群，是否需要群主和群管理员审批，取决于群组类型 [GroupStyle](https://doc.easemob.com/apidoc/unity/namespace_agora_chat.html#a78c8dcc8960a647beb75fb8dd1ebfa1c) 的设置。 | 不支持                                                                                             |
| 群成员邀请用户入群 | 支持 <br/>只能由群主和管理员邀请。    | 支持 <br/>除了群主和群管理员，群成员是否也能邀请其他用户进群取决于群组类型 [GroupStyle](https://doc.easemob.com/apidoc/unity/namespace_agora_chat.html#a78c8dcc8960a647beb75fb8dd1ebfa1c) 的设置。 |

#### 用户申请入群

只有公开群支持用户申请入群，私有群不支持。用户可获取公开群列表，选择相应的群组 ID，然后调用相应方法加入该群组。

任何用户均可申请入群，是否需要群主和群管理员审批，取决于群组类型 [GroupStyle](https://doc.easemob.com/apidoc/unity/namespace_agora_chat.html#a78c8dcc8960a647beb75fb8dd1ebfa1c) 的设置：

- `GroupStyle` 为 `PublicJoinNeedApproval` 时，群主和群管理员审批后，用户才能加入群组；
- `GroupStyle` 为 `PublicOpenJoin` 时，用户可直接加入群组，无需群主和群管理员审批。

若申请加入公开群，申请人需执行以下步骤：

1. 调用 `FetchPublicGroupsFromServer` 方法从服务器获取公开群列表，查询到想要加入的群组 ID。示例代码如下：

```csharp
SDKClient.Instance.GroupManager.FetchPublicGroupsFromServer(callback: new ValueCallBack<CursorResult<GroupInfo>>(
    onSuccess: (result) =>
    {
        List<GroupInfo> gl = result.Data;
        string cursor = result.Cursor;
    },
    onError: (code, desc) =>
    {
    }
));
```

2. 调用 `JoinPublicGroup` 或 `applyJoinToGroup` 方法传入群组 ID，申请加入对应群组。

   - 调用 `JoinPublicGroup` 方法加入无需群主或管理员审批的公开群，即 `GroupStyle` 设置为 `PublicOpenJoin`。申请人不会收到任何回调，其他群成员会收到 `IGroupManagerDelegate#OnMemberJoinedFromGroup` 和  `IGroupManagerDelegate#OnMembersJoinedFromGroup` 回调。

   示例代码如下：

   ```csharp
   SDKClient.Instance.GroupManager.JoinPublicGroup(groupId, new CallBack(
      onSuccess: () => {  },
      onError: (code, desc) => {  }
  ));
   ```

   - 调用 `applyJoinToGroup` 方法加入需要群主或管理员审批的公开群，即 `GroupStyle` 设置为 `PublicJoinNeedApproval`。示例代码如下：

   ```csharp
   SDKClient.Instance.GroupManager.applyJoinToGroup(groupId, "your reason", callback: new CallBack(
        onSuccess: () => {  },
        onError: (code, desc) => {  }
    ));
   ```

   群主或群管理员收到 `IGroupManagerDelegate#OnRequestToJoinReceivedFromGroup` 回调：

   - 若同意加入群组，需要调用 `AcceptGroupJoinApplication` 方法。

   申请人会收到 `IGroupManagerDelegate#OnRequestToJoinAcceptedFromGroup` 回调，其他群成员会收到 `IGroupManagerDelegate#OnMemberJoinedFromGroup`  和  `IGroupManagerDelegate#OnMembersJoinedFromGroup`回调。

   示例代码如下：

   ```csharp
   SDKClient.Instance.GroupManager.AcceptGroupJoinApplication(groupId, applicant, new CallBack(
      onSuccess: () =>
      {
      },
      onError: (code, desc) =>
      {
      }
   ));
   ```

   - 若群主或群管理员拒绝申请人入群，需要调用 `DeclineGroupInvitation` 方法。申请人会收到 `IGroupManagerDelegate#OnRequestToJoinDeclinedFromGroup` 回调。

   示例代码如下：

   ```csharp
   SDKClient.Instance.GroupManager.DeclineGroupInvitation(currentGroupId, "your reason", callback: new CallBack(
      onSuccess: () =>
      {
      },
      onError: (code, desc) =>
      {
      }
   ));
   ```

#### 邀请用户入群

邀请用户入群的方式详见 [邀请用户入群的配置](group_manage.html#创建群组)。

邀请用户入群流程如下：

1. 群成员邀请用户入群。

   - 群主或群管理员加人，需要调用 `AddGroupMembers` 方法：

   ```csharp
    SDKClient.Instance.GroupManager.AddGroupMembers(currentGroupId, members, new CallBack(
        onSuccess: () =>
        {
        },
        onError: (code, desc) =>
        {
        }
    ));
   ```

   - 普通成员邀请人入群，需要调用 `inviteUser` 方法：  (秀文请注意: unity中暂时没有inviteUser, 后续版本我会平版上, 所以下面4行内容请忽略!!)

   对于私有群，`GroupStyle` 设置为 `PrivateMemberCanInvite` 时，所有群成员均可以邀请人进群。

   ```java
   EMClient.getInstance().groupManager().inviteUser(groupId, newmembers, "your reason");
   ```

2. 受邀用户自动进群或确认是否加入群组：

   - 受邀用户同意加入群组，需要调用 `AcceptGroupInvitation` 方法。

   ```csharp
    SDKClient.Instance.GroupManager.AcceptGroupInvitation(groupId, new ValueCallBack<Group>(
        onSuccess: (group) =>
        {
        },
        onError: (code, desc) =>
        {
        }
    ));
   ```

   - 受邀人拒绝入群组，需要调用 `DeclineGroupInvitation` 方法。

   ```csharp
    SDKClient.Instance.GroupManager.DeclineGroupInvitation(groupId, “your reason”, callback: new CallBack(
        onSuccess: () =>
        {
        },
        onError: (code, desc) =>
        {
        }
    ));
   ```

### 退出群组

#### 群成员主动退出群组

群成员可以调用 `LeaveGroup` 方法退出群组，其他成员收到 `IGroupManagerDelegate#OnMembersExitedFromGroup` 回调。退出群组后，该用户将不再收到群消息。群主不能调用该接口退出群组，只能调用 [DestroyGroup](group_manage.html#解散群组) 方法解散群组。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.LeaveGroup(groupId, new CallBack(
    onSuccess: () =>
    {
    },
    onError:(code, desc) =>
    {
    }
));
```

#### 群成员被移出群组

仅群主和群管理员可以调用 `DeleteGroupMembers` 方法将单个或多个成员移出群组。被移出后，该成员收到 `IGroupManagerDelegate#OnUserRemovedFromGroup` 回调，其他群成员收到 `IGroupManagerDelegate#OnMembersExitedFromGroup` 回调。被移出群组后，该用户还可以再次加入群组。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.DeleteGroupMembers(groupId, list, new CallBack (
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 管理群成员的自定义属性

群成员可设置自定义属性（key-value），例如在群组中的昵称和头像等。

- 单个群成员的自定义属性总长度不能超过 4 KB。对于单个自定义属性，属性 key 不能超过 16 字节，value 不能超过 512 个字节，否则会报错。

- 群主可修改所有群成员的自定义属性，其他群成员只能修改自己的自定义属性。

#### 设置群成员自定义属性

你可以调用 `GroupManager#SetMemberAttributes` 方法设置指定群成员的自定义属性。自定义属性为 key-value 格式，key 表示属性名称，value 表示属性值，若 value 设置为空字符串即删除该自定义属性。

设置后，群内其他成员会收到 `IGroupManagerDelegate#OnUpdateMemberAttributesFromGroup` 事件。

示例代码如下：

```csharp
Dictionary<string, string> dict = new Dictionary<string, string>();
dict.Add("key", "value");

SDKClient.Instance.GroupManager.SetMemberAttributes(groupId, userId, dict, new CallBack(
    onSuccess: () =>
    {
        Console.WriteLine($"SetMemberAttributes success.");
    },
    onError: (code, desc) =>
    {
        Console.WriteLine($"SetMemberAttributes failed, code:{code}, desc:{desc}");
    }
));
```

#### 根据属性 key 获取多个群成员的自定义属性

你可调用 `GroupManager#FetchMemberAttributes` 方法根据指定的属性 key 获取多个群成员的自定义属性。

:::tip
每次最多可获取 10 个群成员的自定义属性。
:::

示例代码如下：

```csharp
List<string> userList = new List<string>();
userList.Add("user");

// keyList：要获取自定义属性的 key 的数组。若 keyList 为空数组或不传则获取这些成员的所有自定义属性。
List<string> keyList = new List<string>();
keyList.Add("key");

SDKClient.Instance.GroupManager.FetchMemberAttributes(groupId, userList, keyList, new ValueCallBack<Dictionary<string, Dictionary<string, string>>>(
    onSuccess: (dict) =>
    {

    },
    onError: (code, desc) =>
    {

    }
));
```


### 管理群主和群管理员

#### 变更群主

仅群主可以调用 `ChangeGroupOwner` 方法将权限移交给群组中指定成员。成功移交后，原群主变为普通成员，新群主收到 `IGroupManagerDelegate#OnOwnerChangedFromGroup` 回调。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.ChangeGroupOwner(groupId, newOwner, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 添加群组管理员

仅群主可以调用 `AddGroupAdmin` 方法添加群管理员。成功添加后，新管理员及其他管理员收到 `IGroupManagerDelegate#OnAdminAddedFromGroup` 回调。

管理员除了不能解散群组等少数权限外，拥有对群组的绝大部分权限。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.AddGroupAdmin(groupId, adminId, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 移除群组管理员权限

仅群主可以调用 `RemoveGroupAdmin` 方法移除群管理员。成功移除后，被移除的管理员及其他管理员收到 `IGroupManagerDelegate#OnAdminRemovedFromGroup` 回调。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.RemoveGroupAdmin(groupId, adminId, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 管理群组黑名单

#### 将成员加入群组黑名单

仅群主和群管理员可以调用 `BlockGroupMembers` 方法将指定成员添加至黑名单。被加入黑名单后，该成员收到 `IGroupManagerDelegate#OnUserRemovedFromGroup` 回调。默认情况下，其他群成员不会收到事件通知。如需该事件，请联系商务开通。

被加入黑名单后，该成员无法再收发群组消息并被移出群组，黑名单中的成员如想再次加入群组，群主或群管理员必须先将其移除黑名单。

```csharp
SDKClient.Instance.GroupManager.BlockGroupMembers(groupId, members, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 将成员移出群组黑名单

仅群主和群管理员可以调用 `UnBlockGroupMembers` 方法将成员移出群组黑名单。指定用户被群主或者群管理员移出群黑名单后，可以再次申请加入群组。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.UnBlockGroupMembers(groupId, members, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 获取群组的黑名单用户列表

仅群主和群管理员可以调用 `GetGroupBlockListFromServer` 方法获取当前群组的黑名单。默认最多取 200 个。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.GetGroupBlockListFromServer(groupId, pageNum, pageSize, callback: new ValueCallBack<List<string>>(
    onSuccess: (list) =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 管理群组禁言

#### 将成员加入群组禁言列表

仅群主和群管理员可以调用 `MuteGroupMembers` 方法将指定成员添加至群组禁言列表。被禁言后，该成员和其他未操作的管理员或者群主收到 `IGroupManagerDelegate#OnMuteListAddedFromGroup` 回调。群成员被加入群禁言列表后，不能在该群组中发言，即使被加入群白名单也不能发言。

示例代码如下：

```csharp
// muteMilliseconds：禁言时间。若传 -1，表示永久禁言。
SDKClient.Instance.GroupManager.MuteGroupMembers(groupId, members, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 将成员移出群组禁言列表

仅群主和群管理员可以调用 `UnMuteGroupMembers` 方法将指定成员移出群组禁言列表。被解除禁言后，该成员和其他未做操作的群管理员或者群主收到 `IGroupManagerDelegate#OnMuteListRemovedFromGroup` 回调。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.UnMuteGroupMembers(groupId, members, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 获取群组禁言列表

仅群主和群管理员可以调用 `GetGroupMuteListFromServer` 方法从服务器获取当前群组的禁言列表。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.GetGroupMuteListFromServer(groupId, callback: new ValueCallBack<Dictionary<string, long>>(
    onSuccess: (dict) => {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 检查自己是否在群组禁言列表

群成员可以调用 `CheckIfInGroupMuteList` 方法查看自己是否在群组禁言列表中。

```csharp
SDKClient.Instance.GroupManager.CheckIfInGroupMuteList(groupId, new ValueCallBack<bool>(
   onSuccess: (ret) => {

   },
   onError: (code, desc) => {

   }
));
```

### 开启和关闭群组全员禁言

#### 开启群组全员禁言

仅群主和群管理员可以调用 `MuteGroupAllMembers` 方法开启全员禁言。全员禁言开启后不会在一段时间内自动取消禁言，需要调用 `UnMuteGroupAllMembers` 方法取消全员禁言。

群组全员禁言开启后，除了在白名单中的群成员，其他成员不能发言。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.MuteGroupAllMembers(groupId, new CallBack(
    onSuccess: () => {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 关闭群组全员禁言

仅群主和群管理员可以调用 `UnMuteGroupAllMembers` 方法取消全员禁言，示例代码如下：

```csharp
SDKClient.Instance.GroupManager.UnMuteGroupAllMembers(groupId, new CallBack(
    onSuccess: () => {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 管理群组白名单

群主和群组中的管理员默认会被加入群组白名单。

#### 将成员加入群组白名单

仅群主和群管理员可以调用 `AddGroupAllowList` 方法将指定群成员加入群白名单。白名单用户不受全员禁言的限制，但是如果白名单用户在群禁言列表中，则该用户不能发言。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.AddGroupAllowList(groupId, members, new CallBack(
    onSuccess: () => {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 将成员移出群组白名单

仅群主和群管理员可以调用 `RemoveGroupAllowList` 方法将指定群成员移出群白名单。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.RemoveGroupAllowList(groupId, members, new CallBack(
    onSuccess: () => {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 检查自己是否在白名单中

所有群成员可以调用 `CheckIfInGroupAllowList` 方法检查自己是否在群白名单中，示例代码如下：

```csharp
public void CheckIfInGroupAllowList(final String groupId, EMValueCallBack<Boolean> callBack)
SDKClient.Instance.GroupManager.CheckIfInGroupAllowList(groupId, new ValueCallBack<bool>(
    onSuccess: (ret) => {
    },
    onError: (code, desc)=> {
    }
));
```

#### 获取群组白名单

仅群主和群管理员可以调用 `GetGroupAllowListFromServer` 方法从服务器获取当前群组的白名单。

示例代码如下：

```csharp
SDKClient.Instance.GroupManager.GetGroupAllowListFromServer(currentGroupId, callback: new ValueCallBack<List<string>>(
    onSuccess: (list) => {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 监听群组事件

详见 [监听群组事件](group_manage.html#监听群组事件)。
