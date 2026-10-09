# 创建和管理聊天室

## 功能说明

聊天室是支持大量用户实时互动的即时通讯场景，常用于直播互动、消息广播和开放讨论等业务。聊天室成员没有固定关系，用户离线后通常不会继续接收聊天室消息；除聊天室白名单成员外，普通成员离线超过约 2 分钟会自动退出聊天室。如需调整自动退出时间，请联系环信商务经理。

聊天室成员角色如下表所示：

| 成员角色 | 描述 | 管理权限 |
| :--- | :--- | :--- |
| 普通成员 | 加入聊天室后参与互动的用户。 | 可以发送和接收聊天室消息、获取聊天室详情和成员列表等。 |
| 聊天室管理员 | 由聊天室所有者设置，协助管理聊天室。 | 可以移除成员、管理禁言列表、白名单、黑名单和聊天室公告等。 |
| 聊天室所有者 | 聊天室创建者或被转让所有权的用户。 | 拥有聊天室最高管理权限，可解散聊天室、添加或移除管理员、修改聊天室信息等。 |

本文介绍如何创建、解散、加入、退出和管理聊天室，并监听聊天室相关事件。聊天室消息的发送、接收和管理，参见 [消息管理](message_overview.html)。

:::tip
聊天室所有者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解聊天室成员角色及其权限。
- 已了解接口调用频率和聊天室相关数量限制，详见 [使用限制](/product/limitation.html)。
- 已了解聊天室套餐限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。
- 创建聊天室前，已通过 RESTful API 添加超级管理员，详见 [添加聊天室超级管理员](/document/server-side/chatroom_superadmin_add.html)。

## 创建聊天室

创建聊天室需调用服务端 REST API [从服务端创建聊天室](/document/server-side/chatroom_create.html)。

创建成功后，客户端可以 [加入该聊天室](#加入聊天室)。加入成功时，`ChatroomManager#joinChatroom` 返回 `Chatroom` 对象，可从中读取 SDK 已获取的聊天室信息。详情参见 [获取聊天室详情](room_attributes.html#获取聊天室详情)。

## 解散聊天室

解散聊天室需调用服务端 REST API [解散聊天室](/document/server-side/chatroom_delete.html)。

聊天室解散后，聊天室内在线成员会收到 `ChatroomListener#onRemovedFromChatroom` 事件，其中 `reason` 为 `LEAVE_REASON.ROOM_DESTROYED`，并被移出聊天室。

## 加入聊天室

获取聊天室 ID 后，可以调用 `ChatroomManager#joinChatroom` 加入聊天室。该方法的签名如下：

```typescript
joinChatroom(
    roomId: string,
    leaveOtherRooms?: boolean,
    ext?: string
): Promise<Chatroom>
```

参数说明如下：

| 参数 | 描述 |
| :--- | :--- |
| `roomId` | 要加入的聊天室 ID。 |
| `leaveOtherRooms` | 加入当前聊天室时是否退出已加入的其他聊天室，默认值为 `false`。 |
| `ext` | 加入聊天室时携带的自定义扩展信息，默认值为空字符串。 |

应用可以先调用 `fetchPublicChatroomsFromServer` 获取聊天室 ID，再调用 `joinChatroom` 加入聊天室。新成员加入后，聊天室内其他成员会收到 `ChatroomListener#onMemberJoined` 事件。

```typescript
let pageNum: number = 1;
let pageSize: number = 20;

ChatClient.getInstance().chatroomManager()?.fetchPublicChatroomsFromServer(
    pageNum,
    pageSize
).then((chatrooms: Chatroom[]): void => {
    if (chatrooms.length === 0) {
        return;
    }

    let chatroomId: string = chatrooms[0].chatroomId();
    ChatClient.getInstance().chatroomManager()?.joinChatroom(chatroomId)
        .then((chatroom: Chatroom): void => {
            // 加入聊天室成功。
        })
        .catch((error: ChatError): void => {
            // 加入失败，根据错误码和错误信息处理。
        });
}).catch((error: ChatError): void => {
    // 获取聊天室列表失败，根据错误码和错误信息处理。
});
```

### 携带扩展信息加入聊天室

需要在加入聊天室时传递自定义业务信息，或控制是否退出已加入的其他聊天室时，可传入 `leaveOtherRooms` 和 `ext` 参数。

加入成功后，聊天室内其他成员可通过 `ChatroomListener#onMemberJoined(roomId, userId, ext)` 的 `ext` 参数获取该扩展信息。

```typescript
let listener: ChatroomListener = {
    onMemberJoined: (
        roomId: string,
        userId: string,
        ext?: string
    ): void => {
        // ext 为该成员加入聊天室时携带的扩展信息。
    },
};

ChatClient.getInstance().chatroomManager()?.addListener(listener);

let leaveOtherRooms: boolean = true;
let ext: string = "your ext info";

ChatClient.getInstance().chatroomManager()?.joinChatroom(
    chatroomId,
    leaveOtherRooms,
    ext
).then((chatroom: Chatroom): void => {
    // 携带扩展信息加入聊天室成功。
}).catch((error: ChatError): void => {
    // 加入失败，根据错误码和错误信息处理。
});
```

## 退出聊天室

### 主动退出

聊天室成员可以调用 `ChatroomManager#leaveChatroom` 主动退出聊天室。成员退出后，聊天室内其他成员会收到 `ChatroomListener#onMemberExited` 事件。

```typescript
ChatClient.getInstance().chatroomManager()?.leaveChatroom(chatroomId)
    .then((): void => {
        // 退出聊天室成功。
    })
    .catch((error: ChatError): void => {
        // 退出失败，根据错误码和错误信息处理。
    });
```

默认情况下，主动或被动退出聊天室时，SDK 会删除该聊天室的本地消息。若需保留本地消息，应在调用 `ChatClient#init` 前将 `ChatOptions#setDeleteMessagesOnLeaveChatroom` 设为 `false`。

聊天室所有者默认可以退出聊天室，重新加入后仍为该聊天室的所有者。若在初始化前调用 `ChatOptions#allowChatroomOwnerLeave(false)`，所有者调用 `leaveChatroom` 时会返回错误码 `706`（`ChatError.CHATROOM_OWNER_NOT_ALLOW_LEAVE`）。

```typescript
let options: ChatOptions = new ChatOptions();
options.setAppKey("your-appkey");

// 退出聊天室时保留本地消息。
options.setDeleteMessagesOnLeaveChatroom(false);

// 不允许聊天室所有者退出聊天室。该选项默认值为 true。
options.allowChatroomOwnerLeave(false);

ChatClient.getInstance().init(context, options);
```

### 被移出

仅聊天室所有者和管理员可调用 `ChatroomManager#removeChatroomMembers`，将一个或多个普通成员移出聊天室。

被移出的成员会收到 `ChatroomListener#onRemovedFromChatroom` 事件，其中 `reason` 为 `LEAVE_REASON.BE_KICK`；聊天室内其他成员会收到 `ChatroomListener#onMemberExited` 事件。被移出的成员可以重新加入聊天室。

```typescript
let members: string[] = ["user1", "user2"];

ChatClient.getInstance().chatroomManager()?.removeChatroomMembers(
    chatroomId,
    members
).then((chatroom: Chatroom): void => {
    // 成员移出成功。
}).catch((error: ChatError): void => {
    // 移出失败，根据错误码和错误信息处理。
});
```

### 离线后自动退出

由于网络等原因，聊天室普通成员离线超过约 2 分钟后会自动退出聊天室。被自动移出的当前用户会收到 `ChatroomListener#onRemovedFromChatroom` 事件，其中 `reason` 为 `LEAVE_REASON.BE_KICKED_FOR_OFFLINE`。若需调整自动退出时间，请联系环信商务经理。

以下两类成员即使离线也不会退出聊天室：

- 聊天室白名单成员。聊天室所有者和管理员默认在白名单中。
- [调用 RESTful API 创建聊天室](/document/server-side/chatroom_create.html) 时预先加入、但从未登录过的用户。

若开启了聊天室多端多设备功能，聊天室白名单中的成员在一台设备上离线重连后，无法收到聊天室的消息。若使该设备收到收到聊天室的消息，需要登录后手动调用 `joinChatroom` 加入聊天室。

## 获取聊天室列表

调用 `ChatroomManager#fetchPublicChatroomsFromServer` 可以分页获取当前应用下的聊天室列表，不仅限于当前用户已加入的聊天室。

该方法直接返回当前页的 `Chatroom[]`；若返回数量小于 `pageSize`，表示没有更多数据。

```typescript
// `pageNum` 从 `1` 开始，`pageSize` 的取值范围为 `[1, 1000]`。
let pageNum: number = 1;
let pageSize: number = 20;

ChatClient.getInstance().chatroomManager()?.fetchPublicChatroomsFromServer(
    pageNum,
    pageSize
).then((chatrooms: Chatroom[]): void => {
    for (let chatroom of chatrooms) {
        let id: string = chatroom.chatroomId();
        let name: string = chatroom.chatroomName();
        let description: string = chatroom.chatroomDescription();
        let owner: string = chatroom.owner();
        let memberCount: number = chatroom.memberCount();
        let createTimestamp: number = chatroom.createTimestamp();
    }

    if (chatrooms.length === pageSize) {
        // 可能还有下一页，递增 pageNum 后继续获取。
    }
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

若业务需要展示已加入的聊天室，应保存 `joinChatroom` 返回的 `Chatroom` 对象或在业务侧维护聊天室 ID。

## 监听聊天室事件

`ChatroomListener` 提供聊天室成员、角色、禁言、白名单、基本属性和自定义属性等变更事件。通过 `ChatroomManager#addListener` 添加监听器；不再使用时，应调用 `removeListener` 移除同一个监听器对象。

```typescript
let listener: ChatroomListener = {
    // 有用户加入聊天室。聊天室的所有成员（除新成员外）会收到该事件。
    onMemberJoined: (
        roomId: string,
        userId: string,
        ext?: string
    ): void => {
    },

    // 有成员主动退出或被移出聊天室。聊天室的所有成员（除退出的成员）会收到该事件。
    onMemberExited: (
        roomId: string,
        roomName: string,
        userId: string
    ): void => {
    },

    // 当前用户被移出、因离线被移出或聊天室被解散时触发。被移出的成员收到该事件。
    onRemovedFromChatroom: (
        // `reason` 取值如下：
        // `LEAVE_REASON.BE_KICK`：当前用户被聊天室所有者或管理员移出聊天室。
        // `LEAVE_REASON.ROOM_DESTROYED`：聊天室已解散。
        // `LEAVE_REASON.BE_KICKED_FOR_OFFLINE`：当前用户因离线超过服务端配置的时长而被移出聊天室。
        reason: LEAVE_REASON,
        roomId: string,
        roomName: string,
        participant: string
    ): void => {
        // participant 为当前登录用户的用户 ID。
    },

    // 有成员被加入禁言列表。被添加的成员收到该事件。
    onMutelistAdded: (
        roomId: string,
        mutes: Map<string, number>
    ): void => {
        // key 为用户 ID，value 为禁言到期的 Unix 时间戳，单位为毫秒。
    },

    // 有成员被移出禁言列表。被解除禁言的成员会收到该事件。
    onMutelistRemoved: (
        roomId: string,
        mutes: string[]
    ): void => {
    },

    // 有成员被加入白名单列表。被添加的成员收到该事件。
    onWhitelistAdded: (
        roomId: string,
        whitelist: string[]
    ): void => {
    },

    // 有成员被移出白名单列表。被移出白名单的成员会收到该事件。
    onWhitelistRemoved: (
        roomId: string,
        whitelist: string[]
    ): void => {
    },

    // 全员禁言状态变更。聊天室所有成员会收到该事件。
    onAllMemberMuteStateChanged: (
        roomId: string,
        isMuted: boolean
    ): void => {
    },

    // 有成员被设为管理员。聊天室所有者、被添加的管理员以及其他管理员（除操作者外）会收到该事件。
    onAdminAdded: (
        roomId: string,
        adminId: string
    ): void => {
    },

    // 有成员被移出管理员列表。聊天室所有者、被移除的管理员以及其他管理员（除操作者外）会收到该事件。
    onAdminRemoved: (
        roomId: string,
        adminId: string
    ): void => {
    },

    // 聊天室所有者发生变化。聊天室所有成员会收到该事件。
    onOwnerChanged: (
        roomId: string,
        newOwner: string,
        oldOwner: string
    ): void => {
    },

    // 聊天室公告发生变化。聊天室的所有成员会收到该事件。
    onAnnouncementChanged: (
        roomId: string,
        announcement: string
    ): void => {
    },

    // 聊天室名称、描述等基本信息发生变化。聊天室的所有成员会收到该事件。
    onSpecificationChanged: (chatroom: Chatroom): void => {
    },

    // 聊天室自定义属性发生更新。聊天室所有成员会收到该事件。
    onAttributesUpdate: (
        roomId: string,
        attributeMap: Map<string, string>,
        from: string
    ): void => {
    },

    // 聊天室自定义属性被删除。聊天室所有成员会收到该事件。
    onAttributesRemoved: (
        roomId: string,
        keys: string[],
        from: string
    ): void => {
    },
};

ChatClient.getInstance().chatroomManager()?.addListener(listener);

// 不再需要监听时，移除同一个监听器对象。
ChatClient.getInstance().chatroomManager()?.removeListener(listener);
```

## 实时更新聊天室成员人数

如果聊天室短时间内有成员频繁加入或退出时，实时更新聊天室成员人数的逻辑如下：

`ChatroomManager#joinChatroom` 返回的 `Chatroom` 对象会维护当前在线成员数。聊天室有成员加入或退出时，SDK 会更新该对象中的 `memberCount`；应用可在 `onMemberJoined` 和 `onMemberExited` 事件中重新读取该值。

```typescript
let currentChatroom: Chatroom | undefined;
let memberCount: number = 0;

let listener: ChatroomListener = {
    onMemberJoined: (
        roomId: string,
        userId: string,
        ext?: string
    ): void => {
        if (currentChatroom && currentChatroom.chatroomId() === roomId) {
            memberCount = currentChatroom.memberCount();
            // 使用最新 memberCount 刷新界面。
        }
    },
    onMemberExited: (
        roomId: string,
        roomName: string,
        userId: string
    ): void => {
        if (currentChatroom && currentChatroom.chatroomId() === roomId) {
            memberCount = currentChatroom.memberCount();
            // 使用最新 memberCount 刷新界面。
        }
    },
};

ChatClient.getInstance().chatroomManager()?.addListener(listener);

ChatClient.getInstance().chatroomManager()?.joinChatroom(chatroomId)
    .then((chatroom: Chatroom): void => {
        currentChatroom = chatroom;
        memberCount = chatroom.memberCount();
    })
    .catch((error: ChatError): void => {
        // 加入失败，根据错误码和错误信息处理。
    });
```

:::tip
`memberCount` 表示当前在线成员数。聊天室成员频繁进出时，界面更新应避免执行耗时操作。
:::

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchPublicChatroomsFromServer`](#获取聊天室列表) | `ChatroomManager` | 分页获取当前应用下的公开聊天室列表。 |
| [`joinChatroom`](#加入聊天室) | `ChatroomManager` | 加入聊天室，可携带扩展信息并控制是否退出其他聊天室。 |
| [`leaveChatroom`](#主动退出) | `ChatroomManager` | 主动退出聊天室。 |
| [`removeChatroomMembers`](#被移出) | `ChatroomManager` | 将一个或多个成员移出聊天室。 |
| [`setDeleteMessagesOnLeaveChatroom`](#主动退出) | `ChatOptions` | 设置退出聊天室时是否删除本地消息。 |
| [`allowChatroomOwnerLeave`](#主动退出) | `ChatOptions` | 设置是否允许聊天室所有者退出聊天室。 |
| [`addListener`](#监听聊天室事件) | `ChatroomManager` | 添加聊天室事件监听器。 |
| [`removeListener`](#监听聊天室事件) | `ChatroomManager` | 移除聊天室事件监听器。 |
| [`memberCount`](#实时更新聊天室成员人数) | `Chatroom` | 获取聊天室当前在线成员数。 |
