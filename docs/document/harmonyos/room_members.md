# 管理聊天室成员

## 功能说明

聊天室是支持多人实时互动的即时通讯场景，适用于直播互动、开放讨论和消息广播等业务。本文介绍如何使用 HarmonyOS SDK 查询聊天室成员，并管理聊天室所有者、管理员、白名单、黑名单和禁言状态。

成员加入、退出和被移出聊天室的操作详见 [创建和管理聊天室](room_manage.html)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 当前用户已加入目标聊天室，并具备执行目标操作所需的角色和权限。
- 已了解接口调用频率和聊天室相关数量限制，详见 [使用限制](/product/limitation.html)。
- 已了解聊天室套餐限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 获取聊天室成员列表

聊天室成员可以调用 `ChatroomManager#fetchChatroomMembers`，从服务器分页获取当前聊天室的成员用户 ID。服务器不对成员进行排序，因此返回结果不保证有序。

返回的 `CursorResult<string>` 中，`getResult()` 为当前页成员的用户 ID，`getNextCursor()` 为下一页游标；下一页游标为空字符串时表示没有更多数据。

```typescript
// cursor：从该游标位置开始取数据。首次调用时传空值，从最新数据开始获取。
// pageSize：每页期望返回的成员数，最大值为 1,000。
let cursor: string = "";
let pageSize: number = 50;

ChatClient.getInstance().chatroomManager()?.fetchChatroomMembers(
    chatroomId,
    cursor,
    pageSize
).then((result: CursorResult<string>): void => {
    let memberIds: string[] = result.getResult();
    let nextCursor: string = result.getNextCursor();

    if (nextCursor !== "") {
        // 保存 nextCursor，获取下一页时作为 cursor 传入。
    }
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

## 管理聊天室黑名单

聊天室黑名单中的成员不能加入聊天室，也不能在该聊天室中收发消息。

### 将成员加入聊天室黑名单

仅聊天室所有者和管理员可以调用 `ChatroomManager#blockChatroomMembers`，将一个或多个普通成员加入黑名单。

成员被加入黑名单后会被移出聊天室，并收到 `ChatroomListener#onRemovedFromChatroom` 事件，其中 `reason` 为 `LEAVE_REASON.BE_KICK`。默认情况下，聊天室内其他成员不会收到黑名单变更事件，如需该事件，请联系环信商务开通。

被加入黑名单后，该成员无法再收发聊天室消息并被移出聊天室，黑名单中的成员如想再次加入聊天室，聊天室所有者或管理员必须先将其移出黑名单列表。

```typescript
let members: string[] = ["user1", "user2"];

ChatClient.getInstance().chatroomManager()?.blockChatroomMembers(
    chatroomId,
    members
).then((chatroom: Chatroom): void => {
    // 加入黑名单成功。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误码和错误信息处理。
});
```

### 将成员移出聊天室黑名单

仅聊天室所有者和管理员可以调用 `ChatroomManager#unblockChatroomMembers`，将一个或多个成员移出聊天室黑名单。移出后，这些成员可以重新加入聊天室。

```typescript
let members: string[] = ["user1", "user2"];

ChatClient.getInstance().chatroomManager()?.unblockChatroomMembers(
    chatroomId,
    members
).then((chatroom: Chatroom): void => {
    // 移出黑名单成功。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误码和错误信息处理。
});
```

### 获取聊天室黑名单列表

仅聊天室所有者和管理员可以调用 `ChatroomManager#fetchChatroomBlocklist`，分页获取聊天室黑名单。

```typescript
// pageNum	当前页码，从 1 开始。
// pageSize	每页期望获取的黑名单中的成员数。取值范围为 [1,50]。
let pageNum: number = 1;
let pageSize: number = 50;

ChatClient.getInstance().chatroomManager()?.fetchChatroomBlocklist(
    chatroomId,
    pageNum,
    pageSize
).then((blocklist: string[]): void => {
    // blocklist 为当前页黑名单成员的用户 ID。
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

## 管理聊天室白名单

聊天室所有者和管理员默认在聊天室白名单中。白名单成员发送的聊天室消息为高优先级消息，服务端会优先投递，但不保证必达。当负载较高时，服务器会优先丢弃低优先级的消息。若即便如此负载仍很高，服务器也会丢弃高优先级消息。

开启全员禁言后，聊天室所有者、管理员和白名单成员仍可发送消息；若成员同时被单独禁言，则仍不能发送消息。

### 获取聊天室白名单列表

仅聊天室所有者和管理员可以调用 `ChatroomManager#fetchChatroomWhitelist`，一次性获取聊天室白名单成员的用户 ID。

```typescript
ChatClient.getInstance().chatroomManager()?.fetchChatroomWhitelist(chatroomId)
    .then((whitelist: string[]): void => {
        // whitelist 为聊天室白名单成员的用户 ID。
    })
    .catch((error: ChatError): void => {
        // 获取失败，根据错误码和错误信息处理。
    });
```

### 检查自己是否在聊天室白名单中

聊天室成员可以调用 `ChatroomManager#checkIfInWhitelist`，检查当前登录用户是否在聊天室白名单中。

```typescript
ChatClient.getInstance().chatroomManager()?.checkIfInWhitelist(chatroomId)
    .then((inWhitelist: boolean): void => {
        if (inWhitelist) {
            // 当前用户在聊天室白名单中。
        }
    })
    .catch((error: ChatError): void => {
        // 查询失败，根据错误码和错误信息处理。
    });
```

### 将成员加入聊天室白名单

仅聊天室所有者和管理员可以调用 `ChatroomManager#addToChatroomWhitelist`，将一个或多个成员加入聊天室白名单。被添加的成员会收到 `ChatroomListener#onWhitelistAdded` 事件。

```typescript
let members: string[] = ["user1", "user2"];

ChatClient.getInstance().chatroomManager()?.addToChatroomWhitelist(
    chatroomId,
    members
).then((chatroom: Chatroom): void => {
    // 加入白名单成功。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误码和错误信息处理。
});
```

### 将成员移出聊天室白名单列表

仅聊天室所有者和管理员可以调用 `ChatroomManager#removeFromChatroomWhitelist`，将一个或多个成员移出聊天室白名单。被移出的成员会收到 `ChatroomListener#onWhitelistRemoved` 事件。

```typescript
let members: string[] = ["user1", "user2"];

ChatClient.getInstance().chatroomManager()?.removeFromChatroomWhitelist(
    chatroomId,
    members
).then((chatroom: Chatroom): void => {
    // 移出白名单成功。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误码和错误信息处理。
});
```

## 管理聊天室禁言列表

被单独禁言的成员不能在聊天室中发送消息。即使该成员同时在白名单中，单独禁言仍然生效。

### 添加成员至聊天室禁言列表

仅聊天室所有者和管理员可以调用 `ChatroomManager#muteChatroomMembers`，将一个或多个成员加入聊天室禁言列表。聊天室所有者可以禁言管理员和普通成员；管理员只能禁言普通成员。

被禁言的成员会收到 `ChatroomListener#onMutelistAdded` 事件，事件中的 `Map` 记录用户 ID 与禁言到期时间戳。

```typescript
let members: string[] = ["user1", "user2"];
let muteDuration: number = 60 * 60 * 1000;
// `muteDuration` 为禁言时长，单位为毫秒；传 `-1` 表示永久禁言。
ChatClient.getInstance().chatroomManager()?.muteChatroomMembers(
    chatroomId,
    members,
    muteDuration
).then((chatroom: Chatroom): void => {
    // 禁言成功。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误码和错误信息处理。
});
```

### 将成员移出聊天室禁言列表

聊天室所有者和管理员可以调用 `ChatroomManager#unmuteChatroomMembers`，为一个或多个成员解除禁言。聊天室所有者可以为管理员和普通成员解除禁言；管理员只能为普通成员解除禁言。

被解除禁言的成员会收到 `ChatroomListener#onMutelistRemoved` 事件。

```typescript
let members: string[] = ["user1", "user2"];

ChatClient.getInstance().chatroomManager()?.unmuteChatroomMembers(
    chatroomId,
    members
).then((chatroom: Chatroom): void => {
    // 解除禁言成功。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误码和错误信息处理。
});
```

### 获取聊天室禁言列表

仅聊天室所有者和管理员可以调用 `ChatroomManager#fetchChatroomMutes`，分页获取聊天室禁言列表。

返回的 `Map<string, number>` 中，`key` 为成员用户 ID，`value` 为禁言时长，单位为毫秒。

```typescript
// pageNum	当前页码，从 1 开始。
// pageSize	每页期望返回的禁言成员数。取值范围为 [1,50]。
let pageNum: number = 1;
let pageSize: number = 50;

ChatClient.getInstance().chatroomManager()?.fetchChatroomMutes(
    chatroomId,
    pageNum,
    pageSize
).then((mutes: Map<string, number>): void => {
    mutes.forEach((muteTime: number, userId: string): void => {
        // 处理被禁言成员及其禁言时间。
    });
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

### 检查自己是否在聊天室禁言列表

聊天室成员可以调用 `ChatroomManager#checkIfInMutelist`，检查当前登录用户是否在聊天室禁言列表中。

```typescript
ChatClient.getInstance().chatroomManager()?.checkIfInMutelist(chatroomId)
    .then((inMutelist: boolean): void => {
        if (inMutelist) {
            // 当前用户在聊天室禁言列表中。
        }
    })
    .catch((error: ChatError): void => {
        // 查询失败，根据错误码和错误信息处理。
    });
```

## 开启和关闭聊天室全员禁言

聊天室所有者和管理员可以开启或关闭全员禁言。全员禁言与单独的成员禁言相互独立；开启或关闭全员禁言不会改变现有的成员禁言列表。

### 开启全员禁言

仅聊天室所有者和管理员可以调用 `ChatroomManager#muteAllMembers` 开启全员禁言。开启后不会自动解除，需调用 `unmuteAllMembers` 主动关闭。

开启全员禁言后，聊天室所有者、管理员和白名单成员仍可发送消息，其他成员不能发送消息。聊天室所有成员会收到 `ChatroomListener#onAllMemberMuteStateChanged` 事件，其中 `isMuted` 为 `true`。

```typescript
ChatClient.getInstance().chatroomManager()?.muteAllMembers(chatroomId)
    .then((chatroom: Chatroom): void => {
        // 已开启全员禁言。
    })
    .catch((error: ChatError): void => {
        // 操作失败，根据错误码和错误信息处理。
    });
```

### 关闭全员禁言

仅聊天室所有者和管理员可以调用 `ChatroomManager#unmuteAllMembers` 关闭全员禁言。聊天室所有成员会收到 `ChatroomListener#onAllMemberMuteStateChanged` 事件，其中 `isMuted` 为 `false`。

```typescript
ChatClient.getInstance().chatroomManager()?.unmuteAllMembers(chatroomId)
    .then((chatroom: Chatroom): void => {
        // 已关闭全员禁言。
    })
    .catch((error: ChatError): void => {
        // 操作失败，根据错误码和错误信息处理。
    });
```

## 管理聊天室所有者和管理员

聊天室所有者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。

### 变更聊天室所有者

仅聊天室所有者可以调用 `ChatroomManager#changeChatroomOwner`，将所有权转让给聊天室中的指定成员。转让成功后，原所有者变为普通成员，聊天室所有成员会收到 `ChatroomListener#onOwnerChanged` 事件。

```typescript
ChatClient.getInstance().chatroomManager()?.changeChatroomOwner(
    chatroomId,
    newOwner
).then((chatroom: Chatroom): void => {
    // 聊天室所有者变更成功。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误码和错误信息处理。
});
```

### 添加聊天室管理员

仅聊天室所有者可以调用 `ChatroomManager#addChatroomAdmin`，将聊天室中的指定普通成员设为管理员。聊天室所有者、新管理员和其他管理员（除操作者外）会收到 `ChatroomListener#onAdminAdded` 事件。

```typescript
ChatClient.getInstance().chatroomManager()?.addChatroomAdmin(
    chatroomId,
    adminId
).then((chatroom: Chatroom): void => {
    // 管理员添加成功。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误码和错误信息处理。
});
```

### 移除聊天室管理员

仅聊天室所有者可以调用 `ChatroomManager#removeChatroomAdmin`，移除指定管理员的管理员权限。被移除的管理员将成为普通成员，聊天室所有者、被移除的管理员和其他管理员（除操作者外）会收到 `ChatroomListener#onAdminRemoved` 事件。

```typescript
ChatClient.getInstance().chatroomManager()?.removeChatroomAdmin(
    chatroomId,
    adminId
).then((chatroom: Chatroom): void => {
    // 管理员移除成功。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误码和错误信息处理。
});
```

## 监听聊天室事件

聊天室成员、白名单、禁言状态、所有者和管理员发生变化时，SDK 会通过 `ChatroomListener` 通知应用。监听器的注册方式、事件签名及移除方法详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchChatroomMembers`](#获取聊天室成员列表) | `ChatroomManager` | 分页获取聊天室成员用户 ID。 |
| [`blockChatroomMembers`](#将成员加入聊天室黑名单) | `ChatroomManager` | 将成员加入聊天室黑名单。 |
| [`unblockChatroomMembers`](#将成员移出聊天室黑名单) | `ChatroomManager` | 将成员移出聊天室黑名单。 |
| [`fetchChatroomBlocklist`](#获取聊天室黑名单列表) | `ChatroomManager` | 分页获取聊天室黑名单。 |
| [`fetchChatroomWhitelist`](#获取聊天室白名单列表) | `ChatroomManager` | 获取聊天室白名单。 |
| [`checkIfInWhitelist`](#检查自己是否在聊天室白名单中) | `ChatroomManager` | 检查当前用户是否在聊天室白名单中。 |
| [`addToChatroomWhitelist`](#将成员加入聊天室白名单) | `ChatroomManager` | 将成员加入聊天室白名单。 |
| [`removeFromChatroomWhitelist`](#将成员移出聊天室白名单列表) | `ChatroomManager` | 将成员移出聊天室白名单。 |
| [`muteChatroomMembers`](#添加成员至聊天室禁言列表) | `ChatroomManager` | 将成员加入聊天室禁言列表。 |
| [`unmuteChatroomMembers`](#将成员移出聊天室禁言列表) | `ChatroomManager` | 将成员移出聊天室禁言列表。 |
| [`fetchChatroomMutes`](#获取聊天室禁言列表) | `ChatroomManager` | 分页获取聊天室禁言列表。 |
| [`checkIfInMutelist`](#检查自己是否在聊天室禁言列表) | `ChatroomManager` | 检查当前用户是否在聊天室禁言列表中。 |
| [`muteAllMembers`](#开启全员禁言) | `ChatroomManager` | 开启聊天室全员禁言。 |
| [`unmuteAllMembers`](#关闭全员禁言) | `ChatroomManager` | 关闭聊天室全员禁言。 |
| [`changeChatroomOwner`](#变更聊天室所有者) | `ChatroomManager` | 变更聊天室所有者。 |
| [`addChatroomAdmin`](#添加聊天室管理员) | `ChatroomManager` | 添加聊天室管理员。 |
| [`removeChatroomAdmin`](#移除聊天室管理员) | `ChatroomManager` | 移除聊天室管理员。 |
