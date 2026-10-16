# 管理聊天室属性

## 功能说明

聊天室是支持多人沟通的即时通讯系统。聊天室属性包括聊天室名称、描述和公告等基本属性，以及自定义属性（key-value）。若基本属性不能满足业务需求，应用可以通过自定义属性保存直播聊天室类型、游戏角色和状态、语聊房麦位等业务数据，并将属性变更实时同步给聊天室成员。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解聊天室成员角色及其权限，详见 [聊天室概述](room_overview.html)。
- 已了解接口调用频率和聊天室相关数量限制，详见 [使用限制](/product/limitation.html)。
- 已了解聊天室套餐限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 管理聊天室基本属性

### 获取聊天室详情

调用 `ChatroomManager#joinChatroom` 加入聊天室成功后会返回 `Chatroom` 对象，应用可从该对象读取 SDK 已获取的聊天室详情。

:::tip
`joinChatroom` 会执行加入聊天室操作，不应仅为了查询聊天室详情而调用。获取聊天室列表可调用 `fetchPublicChatroomsFromServer`，详见 [获取聊天室列表](room_manage.html#获取聊天室列表)。
:::

```typescript
ChatClient.getInstance().chatroomManager()?.joinChatroom(chatroomId)
    .then((chatroom: Chatroom): void => {
        let id: string = chatroom.chatroomId();
        let name: string = chatroom.chatroomName();
        let description: string = chatroom.chatroomDescription();
        let owner: string = chatroom.owner();
        let memberCount: number = chatroom.memberCount();
        let currentUserRole: number = chatroom.currentUserRole();
        let allMemberMuted: boolean = chatroom.isAllMemberMuted();
    })
    .catch((error: ChatError): void => {
        // 加入聊天室失败，根据错误码和错误信息处理。
    });
```

聊天室公告应通过 `fetchChatroomAnnouncement` 单独获取；成员列表、黑名单和禁言列表应分别通过对应接口获取，详见 [管理聊天室成员](room_members.html)。

### 获取聊天室公告

聊天室所有成员均可调用 `ChatroomManager#fetchChatroomAnnouncement` 从服务器获取聊天室公告。

```typescript
ChatClient.getInstance().chatroomManager()?.fetchChatroomAnnouncement(chatroomId)
    .then((announcement: string): void => {
        // 获取聊天室公告成功。
    })
    .catch((error: ChatError): void => {
        // 获取失败，根据错误码和错误信息处理。
    });
```

### 更新聊天室公告

仅聊天室所有者和管理员可以调用 `ChatroomManager#changeChatroomAnnouncement` 设置或更新聊天室公告。聊天室公告的长度限制为 512 个字符。公告更新后，聊天室所有成员会收到 `ChatroomListener#onAnnouncementChanged` 事件。

```typescript
ChatClient.getInstance().chatroomManager()?.changeChatroomAnnouncement(
    chatroomId,
    announcement
).then((chatroom: Chatroom): void => {
    // 聊天室公告更新成功。
}).catch((error: ChatError): void => {
    // 更新失败，根据错误码和错误信息处理。
});
```

### 修改聊天室名称

仅聊天室所有者和管理员可以调用 `ChatroomManager#changeChatroomName` 设置或修改聊天室名称。聊天室名称的长度限制为 128 个字符。修改后，聊天室所有成员会收到 `ChatroomListener#onSpecificationChanged` 事件。

```typescript
ChatClient.getInstance().chatroomManager()?.changeChatroomName(
    chatroomId,
    newName
).then((chatroom: Chatroom): void => {
    // 聊天室名称修改成功。
}).catch((error: ChatError): void => {
    // 修改失败，根据错误码和错误信息处理。
});
```

### 修改聊天室描述

仅聊天室所有者和管理员可以调用 `ChatroomManager#changeChatroomDescription` 设置或修改聊天室描述。聊天室描述的长度限制为 512 个字符。修改后，聊天室所有成员会收到 `ChatroomListener#onSpecificationChanged` 事件。

```typescript
ChatClient.getInstance().chatroomManager()?.changeChatroomDescription(
    chatroomId,
    newDescription
).then((chatroom: Chatroom): void => {
    // 聊天室描述修改成功。
}).catch((error: ChatError): void => {
    // 修改失败，根据错误码和错误信息处理。
});
```

## 管理聊天室自定义属性（key-value）

聊天室自定义属性以字符串键值对形式存储。每个聊天室最多可有 100 个自定义属性；每个 key 最多包含 128 个字符，仅支持大小写英文字母、数字以及 `_`、`-`、`.`；每个 value 最多包含 4096 个字符。批量设置时，每次最多可传入 10 个键值对。

`ChatroomManager#setChatroomAttributes` 和 `ChatroomManager#removeChatroomAttributes` 均返回 `ChatroomAttributesResult`：

- `code` 为 `ChatError.EM_NO_ERROR` 时，表示全部属性操作成功。
- `code` 为 `ChatError.PARTIAL_SUCCESS` 时，表示部分属性操作成功；`errorKeyMap` 中包含操作失败的属性 key 及对应错误码。

### 获取聊天室指定自定义属性

聊天室成员可以调用 `ChatroomManager#fetchChatroomAttributes` 获取一个或多个指定的自定义属性。第二个参数可传单个 key 或 key 数组。

```typescript
let attributeKeys: string[] = ["key1", "key2"];

ChatClient.getInstance().chatroomManager()?.fetchChatroomAttributes(
    chatroomId,
    attributeKeys
).then((attributes: Map<string, string>): void => {
    let value1: string | undefined = attributes.get("key1");
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

### 获取聊天室所有自定义属性

调用 `ChatroomManager#fetchChatroomAttributes` 时省略第二个参数，即可获取聊天室的全部自定义属性。

```typescript
ChatClient.getInstance().chatroomManager()?.fetchChatroomAttributes(chatroomId)
    .then((attributes: Map<string, string>): void => {
        // attributes 为聊天室的全部自定义属性。
    })
    .catch((error: ChatError): void => {
        // 获取失败，根据错误码和错误信息处理。
    });
```

### 设置单个聊天室属性

聊天室成员可以调用 `ChatroomManager#setChatroomAttributes` 设置或更新单个聊天室自定义属性。非强制设置只能添加新属性或更新当前用户设置的属性。设置后，聊天室所有成员会收到 `ChatroomListener#onAttributesUpdate` 事件。

`autoDelete` 表示当前用户退出聊天室时是否自动删除其设置的属性，默认值为 `true`。

```typescript
let params: SetChatroomAttributeParams = {
    chatroomId: chatroomId,
    attributeKeyOrMap: "key",
    attributeValue: "value",
    autoDelete: true,
    isForced: false,
};

ChatClient.getInstance().chatroomManager()?.setChatroomAttributes(params)
    .then((result: ChatroomAttributesResult): void => {
        if (result.code === ChatError.EM_NO_ERROR) {
            // 属性设置成功。
        } else {
            // 从 errorKeyMap 获取设置失败的属性 key 及对应错误码。
            let errorCode: number | undefined = result.errorKeyMap?.get("key");
        }
    })
    .catch((error: ChatError): void => {
        // 设置失败，根据错误码和错误信息处理。
    });
```

### 强制设置单个聊天室属性

如需覆盖其他聊天室成员设置的单个属性，将 `SetChatroomAttributeParams#isForced` 设为 `true`。设置后，聊天室所有成员会收到 `ChatroomListener#onAttributesUpdate` 事件。

```typescript
let params: SetChatroomAttributeParams = {
    chatroomId: chatroomId,
    attributeKeyOrMap: "key",
    attributeValue: "newValue",
    autoDelete: true,
    isForced: true,
};

ChatClient.getInstance().chatroomManager()?.setChatroomAttributes(params)
    .then((result: ChatroomAttributesResult): void => {
        if (result.code === ChatError.EM_NO_ERROR) {
            // 属性强制设置成功。
        } else {
            let errorCode: number | undefined = result.errorKeyMap?.get("key");
        }
    })
    .catch((error: ChatError): void => {
        // 设置失败，根据错误码和错误信息处理。
    });
```

### 设置多个聊天室自定义属性

聊天室成员可以调用 `ChatroomManager#setChatroomAttributes` 设置或更新多个聊天室自定义属性。将 `attributeKeyOrMap` 设为 `Map<string, string>`，此时无需设置 `attributeValue`。非强制设置只能添加新属性或更新当前用户设置的属性。设置后，聊天室所有成员会收到 `ChatroomListener#onAttributesUpdate` 事件。

```typescript
let attributeMap: Map<string, string> = new Map<string, string>();
attributeMap.set("key1", "value1");
attributeMap.set("key2", "value2");

let params: SetChatroomAttributeParams = {
    chatroomId: chatroomId,
    attributeKeyOrMap: attributeMap,
    autoDelete: true,
    isForced: false,
};

ChatClient.getInstance().chatroomManager()?.setChatroomAttributes(params)
    .then((result: ChatroomAttributesResult): void => {
        if (result.code === ChatError.EM_NO_ERROR) {
            // 全部属性设置成功。
        } else {
            // 部分属性设置失败；errorKeyMap 中包含失败的属性 key 及对应错误码。
            let errorKeyMap: Map<string, number> | undefined = result.errorKeyMap;
        }
    })
    .catch((error: ChatError): void => {
        // 设置失败，根据错误码和错误信息处理。
    });
```

### 强制设置多个聊天室属性

如需覆盖其他聊天室成员设置的多个属性，将 `SetChatroomAttributeParams#isForced` 设为 `true`。设置后，聊天室所有成员会收到 `ChatroomListener#onAttributesUpdate` 事件。

```typescript
let attributeMap: Map<string, string> = new Map<string, string>();
attributeMap.set("key1", "newValue1");
attributeMap.set("key2", "newValue2");

let params: SetChatroomAttributeParams = {
    chatroomId: chatroomId,
    attributeKeyOrMap: attributeMap,
    autoDelete: true,
    isForced: true,
};

ChatClient.getInstance().chatroomManager()?.setChatroomAttributes(params)
    .then((result: ChatroomAttributesResult): void => {
        if (result.code === ChatError.EM_NO_ERROR) {
            // 全部属性强制设置成功。
        } else {
            let errorKeyMap: Map<string, number> | undefined = result.errorKeyMap;
        }
    })
    .catch((error: ChatError): void => {
        // 设置失败，根据错误码和错误信息处理。
    });
```

### 删除单个聊天室自定义属性

聊天室成员可以调用 `ChatroomManager#removeChatroomAttributes` 删除单个聊天室自定义属性。非强制删除只能删除当前用户设置的属性。删除后，聊天室所有成员会收到 `ChatroomListener#onAttributesRemoved` 事件。

```typescript
let params: RemoveChatroomAttributeParams = {
    chatroomId: chatroomId,
    attributeKey: "key",
    isForced: false,
};

ChatClient.getInstance().chatroomManager()?.removeChatroomAttributes(params)
    .then((result: ChatroomAttributesResult): void => {
        if (result.code === ChatError.EM_NO_ERROR) {
            // 属性删除成功。
        } else {
            let errorCode: number | undefined = result.errorKeyMap?.get("key");
        }
    })
    .catch((error: ChatError): void => {
        // 删除失败，根据错误码和错误信息处理。
    });
```

### 强制删除单个聊天室自定义属性

如需删除其他聊天室成员设置的单个属性，将 `RemoveChatroomAttributeParams#isForced` 设为 `true`。删除后，聊天室所有成员会收到 `ChatroomListener#onAttributesRemoved` 事件。

```typescript
let params: RemoveChatroomAttributeParams = {
    chatroomId: chatroomId,
    attributeKey: "key",
    isForced: true,
};

ChatClient.getInstance().chatroomManager()?.removeChatroomAttributes(params)
    .then((result: ChatroomAttributesResult): void => {
        if (result.code === ChatError.EM_NO_ERROR) {
            // 属性强制删除成功。
        } else {
            let errorCode: number | undefined = result.errorKeyMap?.get("key");
        }
    })
    .catch((error: ChatError): void => {
        // 删除失败，根据错误码和错误信息处理。
    });
```

### 删除多个聊天室自定义属性

聊天室成员可以调用 `ChatroomManager#removeChatroomAttributes` 删除多个聊天室自定义属性。将 `attributeKey` 设为非空字符串数组。非强制删除只能删除当前用户设置的属性。删除后，聊天室所有成员会收到 `ChatroomListener#onAttributesRemoved` 事件。

```typescript
let attributeKeys: string[] = ["key1", "key2"];
let params: RemoveChatroomAttributeParams = {
    chatroomId: chatroomId,
    attributeKey: attributeKeys,
    isForced: false,
};

ChatClient.getInstance().chatroomManager()?.removeChatroomAttributes(params)
    .then((result: ChatroomAttributesResult): void => {
        if (result.code === ChatError.EM_NO_ERROR) {
            // 全部属性删除成功。
        } else {
            // 部分属性删除失败；errorKeyMap 中包含失败的属性 key 及对应错误码。
            let errorKeyMap: Map<string, number> | undefined = result.errorKeyMap;
        }
    })
    .catch((error: ChatError): void => {
        // 删除失败，根据错误码和错误信息处理。
    });
```

### 强制删除多个聊天室自定义属性

如需删除其他聊天室成员设置的多个属性，将 `RemoveChatroomAttributeParams#isForced` 设为 `true`。删除后，聊天室所有成员会收到 `ChatroomListener#onAttributesRemoved` 事件。

```typescript
let attributeKeys: string[] = ["key1", "key2"];
let params: RemoveChatroomAttributeParams = {
    chatroomId: chatroomId,
    attributeKey: attributeKeys,
    isForced: true,
};

ChatClient.getInstance().chatroomManager()?.removeChatroomAttributes(params)
    .then((result: ChatroomAttributesResult): void => {
        if (result.code === ChatError.EM_NO_ERROR) {
            // 全部属性强制删除成功。
        } else {
            let errorKeyMap: Map<string, number> | undefined = result.errorKeyMap;
        }
    })
    .catch((error: ChatError): void => {
        // 删除失败，根据错误码和错误信息处理。
    });
```

## 监听聊天室事件

注册 `ChatroomListener` 可以监听聊天室公告、基本信息和自定义属性的变更。`onAttributesUpdate` 中的 `attributeMap` 为本次更新的属性，`onAttributesRemoved` 中的 `keys` 为本次删除的属性 key，`from` 为操作者的用户 ID。不再使用监听器时，应调用 `removeListener` 移除。

```typescript
let listener: ChatroomListener = {
    onAnnouncementChanged: (roomId: string, announcement: string): void => {
        // 聊天室公告已更新。
    },
    onSpecificationChanged: (chatroom: Chatroom): void => {
        // 聊天室名称、描述等基本信息已更新。
    },
    onAttributesUpdate: (
        roomId: string,
        attributeMap: Map<string, string>,
        from: string
    ): void => {
        // 聊天室自定义属性已更新。
    },
    onAttributesRemoved: (
        roomId: string,
        keys: string[],
        from: string
    ): void => {
        // 聊天室自定义属性已删除。
    },
};

ChatClient.getInstance().chatroomManager()?.addListener(listener);

// 不再需要监听时移除监听器。
ChatClient.getInstance().chatroomManager()?.removeListener(listener);
```

其他聊天室事件详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`joinChatroom`](#获取聊天室详情) | `ChatroomManager` | 加入聊天室；成功时返回 `Chatroom` 对象。HarmonyOS SDK 5.0.0 暂无单独获取聊天室详情的公开接口。 |
| [`fetchChatroomAnnouncement`](#获取聊天室公告) | `ChatroomManager` | 从服务器获取聊天室公告。 |
| [`changeChatroomAnnouncement`](#更新聊天室公告) | `ChatroomManager` | 更新聊天室公告。 |
| [`changeChatroomName`](#修改聊天室名称) | `ChatroomManager` | 修改聊天室名称。 |
| [`changeChatroomDescription`](#修改聊天室描述) | `ChatroomManager` | 修改聊天室描述。 |
| [`fetchChatroomAttributes`](#获取聊天室指定自定义属性) | `ChatroomManager` | 获取指定或全部聊天室自定义属性。 |
| [`setChatroomAttributes`](#设置单个聊天室属性) | `ChatroomManager` | 设置一个或多个聊天室自定义属性；通过 `isForced` 控制是否强制设置。 |
| [`removeChatroomAttributes`](#删除单个聊天室自定义属性) | `ChatroomManager` | 删除一个或多个聊天室自定义属性；通过 `isForced` 控制是否强制删除。 |
| [`addListener`](#监听聊天室事件) | `ChatroomManager` | 添加聊天室事件监听器。 |
| [`removeListener`](#监听聊天室事件) | `ChatroomManager` | 移除聊天室事件监听器。 |
