# 管理聊天室成员

<Toc />

聊天室是支持多人沟通的即时通讯系统。本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中管理聊天室成员，并实现聊天室的相关功能。

## 技术原理

环信即时通讯 IM SDK 提供 `Room`、`IRoomManager` 和 `IRoomManagerDelegate` 类，支持对聊天室成员的管理，包括获取、添加和移出聊天室成员等，主要方法如下：

- 获取聊天室成员列表
- 将成员移出聊天室
- 管理聊天室黑名单
- 管理聊天室白名单
- 管理聊天室禁言列表
- 开启和关闭聊天室全员禁言
- 管理聊天室所有者和管理员

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)；
- 了解环信即时通讯 IM 聊天室相关限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 获取聊天室成员列表

所有聊天室成员均可调用 `FetchRoomMembers` 方法获取当前聊天室的成员列表。

示例代码如下：

```csharp
//cursor：从该游标位置开始取数据。首次调用 cursor 传空值，从最新数据开始获取。
//pageSize：每页期望返回的成员数,最大值为 1,000。
SDKClient.Instance.RoomManager.FetchRoomMembers(roomId, cursor, pageSize, callback: new ValueCallBack<CursorResult<string>>(
  // members 类型为 CursorResult<string>。
  onSuccess: (members) => {
  },
  onError: (code, desc) => {
  }
));
```

### 将成员移出聊天室

仅聊天室所有者和管理员可调用 `DeleteRoomMembers` 方法将单个或多个成员移出聊天室。

被移出后，该成员收到 `OnRemovedFromRoom` 回调，其他成员收到 `OnMemberExitedFromRoom` 回调。

被移出的成员可以重新进入聊天室。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.DeleteRoomMembers(roomId, members, new CallBack(
    onSuccess: () => {
    },
    onError: (code, desc) => {
    }
));
```

### 管理聊天室黑名单

#### 将成员加入聊天室黑名单

仅聊天室所有者和管理员可调用 `BlockRoomMembers` 方法将指定成员添加至黑名单。被加入黑名单后，该成员收到 `OnRemovedFromRoom` 回调，其他成员收到 `OnMemberExitedFromRoom` 回调。被加入黑名单后，该成员无法再收发聊天室消息并被移出聊天室，黑名单中的成员如想再次加入聊天室，聊天室所有者或管理员必须先将其移出黑名单列表。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.BlockRoomMembers(roomId, members, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

#### 将成员移出聊天室黑名单

仅聊天室所有者和管理员可以调用 `UnBlockRoomMembers` 方法将成员移出聊天室黑名单。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.UnBlockRoomMembers(roomId, members, new CallBack(
    onSuccess: () => {
    },
    onError: (code, desc) => {
    }
));
```

#### 获取聊天室黑名单列表

仅聊天室所有者和管理员可以调用 `FetchRoomBlockList` 方法获取当前聊天室黑名单。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.FetchRoomBlockList(roomId, pageNum, pageSize, callback: new ValueCallBack<List<string>>(
    // list 类型为 List<string>。
    onSuccess: (list) => {
    },
    onError: (code, desc) => {
    }
));
```

### 管理聊天室白名单

聊天室所有者和管理员默认会被加入聊天室白名单。

聊天室白名单中的成员在聊天室中发送的消息为高优先级，会优先送达，但不保证必达。当负载较高时，服务器会优先丢弃低优先级的消息。若即便如此负载仍很高，服务器也会丢弃高优先级消息。

#### 获取聊天室白名单列表

仅聊天室所有者和管理员可以调用 `FetchAllowListFromServer` 获取当前聊天室白名单成员列表。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.FetchAllowListFromServer(roomId, new ValueCallBack<List<string>>(
      onSuccess: (list) => {
      //list是返回的白名单列表
      },
      onError: (code, desc) => {
      }
  ));
```

#### 检查自己是否在聊天室白名单中

所有聊天室成员可以调用 `CheckIfInRoomAllowList` 方法检查自己是否在白名单中，示例代码如下：

```csharp
SDKClient.Instance.RoomManager.CheckIfInRoomAllowList(roomId, new ValueCallBack<bool>(
      onSuccess: (b) => {
        //b是返回的布尔类型
      },
      onError: (code, desc) => {
      }
  ));
```

#### 将成员加入聊天室白名单

仅聊天室所有者和管理员可以调用 `AddAllowListMembers` 将成员加入聊天室白名单，被添加后，该成员和其他未操作的聊天室管理员或聊天室所有者收到 `OnAddAllowListMembersFromChatroom` 回调。

示例代码如下：

```csharp
//list是添加的白名单列表
SDKClient.Instance.RoomManager.AddAllowListMembers(roomId, list, new CallBack(
      onSuccess: () => {
      },
      onError: (code, desc) => {
      }
  ));
```

#### 将成员移出聊天室白名单列表

仅聊天室所有者和管理员可以调用 `RemoveAllowListMembers` 将成员从聊天室白名单移出，被移出后，该成员和其他未操作的聊天室管理员或聊天室所有者收到 `OnRemoveAllowListMembersFromChatroom` 回调。

示例代码如下：

```csharp
//list是移除的白名单列表
SDKClient.Instance.RoomManager.RemoveAllowListMembers(roomId, list, new CallBack(
      onSuccess: () => {
      },
      onError: (code, desc) => {
      }
  ));
```

### 管理聊天室禁言列表

#### 添加成员至聊天室禁言列表

仅聊天室所有者和管理员可以调用 `MuteRoomMembers` 方法将指定成员添加至聊天室禁言列表。被禁言后，该成员和其他未操作的聊天室管理员或聊天室所有者收到 `OnMuteListAddedFromRoom` 回调。

:::notice
聊天室所有者可禁言聊天室所有成员，聊天室管理员可禁言聊天室普通成员。
:::

示例代码如下：

```csharp
// muteMilliseconds：禁言时间。若传 -1，表示永久禁言。
SDKClient.Instance.RoomManager.MuteRoomMembers(roomId, members, new CallBack(
    onSuccess: () => {
    },
    onError: (code, desc) => {
    }
));
```

#### 将成员移出聊天室禁言列表

仅聊天室所有者和管理员可以调用 `UnMuteRoomMembers` 方法将成员移出聊天室禁言列表。被解除禁言后，其他成员收到 `OnMuteListRemovedFromRoom` 回调。

:::notice
聊天室所有者可对聊天室所有成员解除禁言，聊天室管理员可对聊天室普通成员解除禁言。
:::

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.UnMuteRoomMembers(roomId, members, new CallBack(
    onSuccess: () => {
    },
    onError: (code, desc) => {
    }
));
```

#### 获取聊天室禁言列表

仅聊天室所有者和管理员可调用 `FetchRoomMuteList` 方法获取当前聊天室的禁言列表。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.FetchRoomMuteList(roomId, pageSize, pageNum, callback: new ValueCallBack<Dictionary<string, long>>(
  onSuccess: (dict) => {
  },
  onError: (code, desc) => {
  }
));
```

### 开启和关闭聊天室全员禁言

为了快捷管理聊天室发言，聊天室所有者和管理员可以开启和关闭聊天室全员禁言。全员禁言和单独的成员禁言不冲突，设置或者解除全员禁言，原禁言列表并不会变化。

#### 开启聊天室全员禁言

仅聊天室所有者和管理员可以调用 `MuteAllRoomMembers` 方法开启全员禁言。全员禁言开启后不会在一段时间内自动取消禁言，需要调用 `UnMuteAllRoomMembers` 方法取消全员禁言。

全员禁言开启后，除了在白名单中的成员，其他成员不能发言。调用成功后，聊天室成员会收到 `OnAllMemberMuteChangedFromChatroom` 回调。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.MuteAllRoomMembers(roomId, new ValueCallBack<Room>(
    onSuccess: (room) => {
    },
    onError: (code, desc) => {
    }
));
```

#### 关闭聊天室全员禁言

仅聊天室所有者和管理员可以调用 `UnMuteAllRoomMembers` 方法取消全员禁言。调用成功后，聊天室成员会收到 `OnAllMemberMuteChangedFromChatroom` 回调。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.UnMuteAllRoomMembers(roomId, new ValueCallBack<Room>(
      onSuccess: (room) => {
      },
      onError: (code, desc) => {
      }
  ));
```

### 管理聊天室所有者和管理员

#### 变更聊天室所有者

仅聊天室所有者可以调用 `ChangeRoomOwner` 方法将权限移交给聊天室中指定成员。成功移交后，原聊天室所有者变为聊天室成员，新的聊天室所有者和聊天室管理员收到 `OnOwnerChangedFromRoom` 回调。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.ChangeRoomOwner(roomId, newOwner, new CallBack(
  onSuccess: () => {
  },
  onError: (code, desc) => {
  }
));
```

#### 添加聊天室管理员

仅聊天室所有者可以调用 `AddRoomAdmin` 方法添加聊天室管理员。成功添加后，新管理员及其他管理员收到 `OnAdminAddedFromRoom` 回调。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.AddRoomAdmin(roomId, adminId, new CallBack(
  onSuccess: () => {
  },
  onError: (code, desc) => {
  }
));
```

#### 移除聊天室管理员

仅聊天室所有者可以调用 `RemoveRoomAdmin` 方法移除聊天室管理员。成功移除后，被移除的管理员及其他管理员收到 `OnAdminRemovedFromRoom` 回调。

示例代码如下：

```csharp
SDKClient.Instance.RoomManager.RemoveRoomAdmin(roomId, adminId, new CallBack(
  onSuccess: () => {
  },
  onError: (code, desc) => {
  }
));
```

### 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。
