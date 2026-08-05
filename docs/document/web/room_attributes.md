# 聊天室属性管理

## 功能说明

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，key 和 value 均为字符串，属性信息变更会实时同步给聊天室成员。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录成功。
- 初始化 SDK 时已注册 `ChatRoomManager`，能够通过 `client.chatRoomManager` 调用聊天室相关接口。
- 当前登录用户已具备执行目标操作所需的聊天室角色或权限。例如，聊天室所有者和管理员通常可修改聊天室基础信息和公告；聊天室成员可读取或设置聊天室自定义属性。
- 已了解聊天室数量、聊天室成员数量、聊天室属性大小、公告长度和接口调用频率等服务限制，详见 [使用限制](/product/limitation.html)。

## 获取聊天室操作对象

在管理单个聊天室属性前，推荐先调用 `getChatRoom` 获取 `ChatRoom` 单聊天室对象。该方法只创建或复用本地单聊天室操作对象，不会发起网络请求。

```typescript
const chatRoom = client.chatRoomManager.getChatRoom('chatroomId');
```

后续示例优先使用 `ChatRoom` 单聊天室对象写法；如需直接按 `chatRoomId` 调用，也可以使用对应的 `ChatRoomManager` 接口。

## 管理聊天室基本属性

### 获取聊天室详情

你可以通过 `ChatRoom` 单聊天室对象获取聊天室详情：

- `getInfo`：获取当前聊天室详情。
- `refresh`：刷新并返回当前聊天室详情，相当于 `getInfo`。

```typescript
const chatRoom = client.chatRoomManager.getChatRoom('chatroomId');

const detail = await chatRoom.getInfo();
console.log(detail);

const latestDetail = await chatRoom.refresh();
console.log(latestDetail);
```

聊天室详情结果为 `ChatRoomDetail`，主要字段如下：

| 分组 | 字段 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| 基础资料 | `chatRoomId` | String | 聊天室 ID。 |
| 基础资料 | `name` | String | 聊天室名称。 |
| 基础资料 | `description` | String | 聊天室描述。 |
| 基础资料 | `owner` | UserInfo | 聊天室所有者资料。 |
| 基础资料 | `ext` | String | 聊天室扩展信息。 |
| 基础资料 | `announcement` | String | 聊天室公告。 | 
| 基础资料 | `createdAt` | Number | 聊天室创建时间戳，具体单位以服务端返回为准。 |
| 配置 | `maxMembers` | Number | 聊天室最大成员数。 |
| 配置 | `disabled` | Boolean | 聊天室是否被禁用。 |
| 基础统计 | `memberCount` | Number | 当前成员数量。 |
| 当前用户相关信息 | `permissionType` | String | 当前用户在聊天室中的权限类型，可能为 `owner`、`admin`、`member` 或 `none`。 |
| 当前用户相关信息 | `currentUserStatus` | Object | 当前用户在聊天室中的状态快照，例如是否在白名单中、是否被禁言等。 |

`currentUserStatus` 包含如下主要字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `inAllowlist` | Boolean | 当前用户是否在白名单中。 |
| `muted` | Boolean | 当前用户是否处于禁言状态。 |
| `muteExpireAt` | Number | 当前用户禁言到期时间。 |
| `permissionType` | String | 当前用户在聊天室中的权限类型。 |

### 修改聊天室信息

聊天室所有者或管理员可以通过 `ChatRoom` 对象修改聊天室名称、描述或最大成员数。修改成功后，聊天室内其他在线成员会收到 `onChatRoomInfoChanged` 事件。

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').updateInfo({
  name: 'new chatroom name',
  description: 'new chatroom description',
  maxMembers: 5000,
});

console.log(result.nameUpdated);
console.log(result.descriptionUpdated);
console.log(result.maxMembersUpdated);
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `chatRoomId` | String | 是 | 聊天室 ID。使用 `ChatRoom` 对象调用 `updateInfo` 时无需传入。 |
| `name` | String | 否 | 新的聊天室名称。 |
| `description` | String | 否 | 新的聊天室描述。 |
| `maxMembers` | Number | 否 | 新的聊天室最大成员数。 |

:::tip
`updateInfo` 只更新传入的字段；未传入的字段不会被修改。调用时，`name`、`description`、`maxMembers` 至少需要传入一项。
:::

### 获取聊天室公告

推荐调用 `getAnnouncement` 获取当前聊天室公告：

```typescript
const announcement = await client.chatRoomManager.getChatRoom('chatroomId').getAnnouncement();
console.log(announcement.announcement);
```

### 设置聊天室公告

聊天室所有者或管理员可调用 `updateAnnouncement` 设置或更新聊天室公告。公告更新后，聊天室成员会收到 `onAnnouncementChanged` 事件。

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').updateAnnouncement({
  // 聊天室公告的长度限制为 512 个字符。
  announcement: '欢迎来到直播间！',
});
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `announcement` | String | 是 | 新的聊天室公告内容。 |

## 管理聊天室自定义属性

聊天室自定义属性采用 key-value 结构，key 和 value 均必须为字符串。你可以通过自定义属性保存麦位、房间主题、游戏状态等业务数据，并通过事件同步给聊天室成员。

### 获取聊天室自定义属性

调用 `getAttributes` 可获取当前聊天室自定义属性。`keys` 不传时获取全部属性；传入 `keys` 时仅获取指定属性。

```typescript
const snapshot = await client.chatRoomManager.getChatRoom('chatroomId').getAttributes({
  keys: ['seat1', 'seat2'],
});

console.log(snapshot.chatRoomId);
console.log(snapshot.attributes);
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `keys` | Array | 否 | 要查询的属性 key 列表。不传时获取全部属性。 |

### 设置聊天室自定义属性

调用 `setAttributes` 可设置单个或多个聊天室自定义属性。设置成功后，聊天室成员会收到 `onAttributesUpdate` 事件。

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').setAttributes({
  attributes: {
    seat1: JSON.stringify({ userId: 'user1', status: 'occupied' }),
    seat2: JSON.stringify({ userId: '', status: 'empty' }),
  },
  autoDelete: true,
  isForced: false,
});

console.log(result.appliedKeys);
console.log(result.failedKeys);
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `attributes` | Object | 是 | 待设置的属性键值对。key 和 value 均必须为字符串，且不能为空对象。 |
| `autoDelete` | Boolean | 否 | 成员退出聊天室时，是否自动删除其设置的属性。默认值为 `true`。 |
| `isForced` | Boolean | 否 | 是否允许覆盖其他成员设置的属性。默认值为 `false`。 |

返回结果为 `ChatRoomAttributeMutationResult`，主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `chatRoomId` | String | 聊天室 ID。 |
| `appliedKeys` | Array | 已成功应用的属性 key 列表。 |
| `failedKeys` | Object | 设置失败的属性 key 与错误信息映射。 |

### 删除聊天室自定义属性

调用 `removeAttributes` 可删除一个或多个聊天室自定义属性。删除成功后，聊天室成员会收到 `onAttributesRemoved` 事件。

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').removeAttributes({
  keys: ['seat1'],
  isForced: false,
});

console.log(result.appliedKeys);
console.log(result.failedKeys);
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `keys` | Array | 是 | 待删除的属性 key 列表，不能为空数组。 |
| `isForced` | Boolean | 否 | 是否允许删除其他成员设置的属性。默认值为 `false`。 |

## 监听聊天室属性事件

修改聊天室基础信息、公告或自定义属性后，SDK 会触发对应聊天室事件。你可以调用 `addEventHandler` 注册聊天室事件监听器。

```typescript
client.chatRoomManager.addEventHandler('chatroom-attribute-events', {
  // 聊天室详情有变更。聊天室的所有成员会收到该事件。
  onChatRoomInfoChanged: event => {
    console.log('聊天室信息变更:', event.chatRoomId, event.chatRoomInfo);
  },
  // 聊天室公告变更。聊天室的所有成员会收到该事件。
  onAnnouncementChanged: event => {
    console.log('聊天室公告变更:', event.chatRoomId, event.announcement);
  },
  // 聊天室自定义属性有更新。聊天室所有成员会收到该事件。
  onAttributesUpdate: event => {
    console.log('聊天室属性更新:', event.chatRoomId, event.attributes, event.from);
  },
  // 有聊天室自定义属性被移除。聊天室所有成员会收到该事件。
  onAttributesRemoved: event => {
    console.log('聊天室属性删除:', event.chatRoomId, event.keyList, event.from);
  },
});
```

如需移除监听器，可调用 `removeEventHandler`：

```typescript
client.chatRoomManager.removeEventHandler('chatroom-attribute-events');
```

## 注意事项

- `getChatRoom` 只返回绑定指定聊天室 ID 的单聊天室对象，不会发起网络请求。
- `getInfo` 和 `refresh` 均用于获取聊天室详情，`refresh` 等同于 `getInfo`。
- `updateInfo` 只更新传入的字段，不建议传入空对象。
- 聊天室自定义属性的 key 和 value 均必须为字符串；`attributes` 不能为空对象，`keys` 不能为空数组。
- `setAttributes` 和 `removeAttributes` 支持批量操作。返回结果中 `appliedKeys` 表示成功的 key，`failedKeys` 表示失败的 key 及错误信息；如果全部 key 都失败，SDK 会抛出错误。
- `isForced` 为可选参数，表示是否强制修改聊天室自定义属性。
- `autoDelete` 为可选参数，表示聊天室成员离开后是否自动删除该成员设置的自定义属性。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getChatRoom`](#获取聊天室操作对象) | `ChatRoomManager` | 获取绑定指定聊天室 ID 的 `ChatRoom` 单聊天室对象。 |
| [`getInfo`](#获取聊天室详情) | `ChatRoom` | 获取当前聊天室详情。 |
| [`refresh`](#获取聊天室详情) | `ChatRoom` | 刷新并返回当前聊天室详情，等价于 `getInfo`。 |
| [`updateInfo`](#修改聊天室信息) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象修改聊天室名称、描述或最大成员数。 |
| [`getAnnouncement`](#获取聊天室公告) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象获取聊天室公告。 |
| [`updateAnnouncement`](#设置聊天室公告) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象设置或更新聊天室公告。 |
| [`getAttributes`](#获取聊天室自定义属性) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象获取聊天室自定义属性。 |
| [`setAttributes`](#设置聊天室自定义属性) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象设置聊天室自定义属性。 |
| [`removeAttributes`](#删除聊天室自定义属性) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象删除聊天室自定义属性。 |
