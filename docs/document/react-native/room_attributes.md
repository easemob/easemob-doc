# 管理聊天室属性

## 功能说明

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，key 和 value 均为字符串，属性信息变更会实时同步给聊天室成员。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)；
- 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 管理聊天室基本属性

### 获取聊天室详情

聊天室所有成员均可调用 `ChatRoomManager#fetchChatRoomInfoFromServer` 获取聊天室详情，包括聊天室 ID、聊天室名称、聊天室描述、最大成员数、聊天室所有者、是否全员禁言以及当前用户在聊天室中的角色类型（`ChatRoom.permissionType`）。返回 `Promise<ChatRoom | undefined>`。聊天室公告、管理员列表、成员列表、黑名单列表和禁言列表需要分别调用对应接口获取。

示例代码如下：

```typescript
try {
  // 从服务器获取聊天室详情
  const result = await ChatClient.getInstance().roomManager
    .fetchChatRoomInfoFromServer('<room_id>');
  // 获取聊天室详情成功；返回值可能为 undefined
  console.log(result);
} catch (error: unknown) {
  // 获取聊天室详情失败
  console.error('获取聊天室详情失败：', error);
}
```

### 获取聊天室公告

聊天室所有成员均可调用 `ChatRoomManager#fetchChatRoomAnnouncement` 方法获取聊天室公告。

示例代码如下：

```typescript
try {
  // 获取聊天室公告
  const result = await ChatClient.getInstance().roomManager
    .fetchChatRoomAnnouncement('<room_id>');
  console.log('聊天室公告：', result);
} catch (error: unknown) {
  // 获取聊天室公告失败
  console.error('获取聊天室公告失败：', error);
}
```

### 更新聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `ChatRoomManager#updateChatRoomAnnouncement` 方法设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `ChatRoomEventListener#onAnnouncementChanged` 回调。

示例代码如下：

```typescript
try {
  // 设置和更新聊天室公告
  await ChatClient.getInstance().roomManager
    .updateChatRoomAnnouncement('<room_id>', '欢迎进入聊天室');
} catch (error: unknown) {
  // 更新聊天室公告失败
  console.error('更新聊天室公告失败：', error);
}
```

### 修改聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `ChatRoomManager#changeChatRoomSubject` 方法设置和修改聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```typescript
try {
  // 设置和修改聊天室名称
  await ChatClient.getInstance().roomManager
    .changeChatRoomSubject('<room_id>', '音乐直播间');
} catch (error: unknown) {
  // 修改聊天室名称失败
  console.error('修改聊天室名称失败：', error);
}
```

### 修改聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `ChatRoomManager#changeChatRoomDescription` 方法设置和修改聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```typescript
try {
  // 设置和修改聊天室描述
  await ChatClient.getInstance().roomManager
    .changeChatRoomDescription('<room_id>', '分享音乐与生活');
} catch (error: unknown) {
  // 修改聊天室描述失败
  console.error('修改聊天室描述失败：', error);
}
```

## 管理聊天室自定义属性（key-value）

聊天室自定义属性以字符串键值对形式存储。每个聊天室最多可有 100 个自定义属性；每个 key 最多包含 128 个字符，仅支持大小写英文字母、数字以及 `_`、`-`、`.`；每个 value 最多包含 4096 个字符。批量设置时，每次最多可传入 10 个键值对。

SDK 通过 `ChatRoomManager#addAttributes` 统一设置单个、多个和强制覆盖属性，通过 `ChatRoomManager#removeAttributes` 统一删除单个、多个和强制删除属性。两个 API 均声明返回 `Promise<Map<string, string>>`：

- Promise 成功且返回的 Map 为空时，表示全部属性操作成功。
- Promise 成功且 Map 非空时，其中包含操作失败的属性 key 及对应错误码，不能视为全部成功。
- Promise 拒绝时，表示整体调用失败，应捕获错误。

当前双端返回的失败项值实际为数值错误码，尽管公开类型声明为 `string`，不应直接调用字符串专属方法。

### 获取聊天室指定自定义属性

聊天室所有成员均可调用 `ChatRoomManager#fetchChatRoomAttributes` 方法获取聊天室指定自定义属性。

示例代码如下：

```typescript
try {
  // 传入要获取的属性 Key 列表；传 [] 获取全部属性
  const result = await ChatClient.getInstance().roomManager
    .fetchChatRoomAttributes('<room_id>', ['<attribute_key>']);
  console.log('自定义属性：', result);
} catch (error: unknown) {
  // 获取自定义属性失败
  console.error('获取自定义属性失败：', error);
}
```

### 获取聊天室所有自定义属性

聊天室成员可以调用 `ChatRoomManager#fetchChatRoomAttributes` 方法获取聊天室所有自定义属性，`keys` 传入空数组 `[]`。虽然该参数在公开签名中为可选值，为兼容 Android 端，请显式传入数组，不要省略或传入 `null`。

示例代码如下：

```typescript
try {
  // 获取全部聊天室自定义属性，显式传入空数组
  const result = await ChatClient.getInstance().roomManager
    .fetchChatRoomAttributes('<room_id>', []);
  console.log('全部自定义属性：', result);
} catch (error: unknown) {
  // 获取全部自定义属性失败
  console.error('获取全部自定义属性失败：', error);
}
```

### 设置单个聊天室属性

聊天室成员可以调用 `ChatRoomManager#addAttributes` 方法设置或更新单个聊天室自定义属性。该方法只可添加新自定义属性字段和更新自己设置的现有属性。设置后，其他聊天室成员收到 `ChatRoomEventListener#onAttributesUpdated` 回调。

示例代码如下：

```typescript
try {
  // 设置或更新单个聊天室自定义属性
  const failures = await ChatClient.getInstance().roomManager.addAttributes({
    roomId: '<room_id>',
    // 属性键值对象数组，单个属性也使用数组
    attributes: [{ topic: 'music' }],
    // 退出时是否自动删除，默认 false
    deleteWhenLeft: false,
    // 不允许覆盖其他成员设置的同名属性，默认 false
    overwrite: false,
  });
  if (failures.size === 0) {
    // 全部属性设置成功
    console.log('设置自定义属性成功');
  } else {
    // 返回未成功设置的属性 Key 及对应错误码
    console.log('设置自定义属性失败项：', failures);
  }
} catch (error: unknown) {
  console.error('设置自定义属性失败：', error);
}
```

### 强制设置单个聊天室属性

如果除了设置或更新自己的单个自定义属性还需覆盖其他聊天室成员设置的该属性，需调用 `ChatRoomManager#addAttributes` 方法，并将 `overwrite` 设置为 `true`。设置后，其他聊天室成员收到 `ChatRoomEventListener#onAttributesUpdated` 回调。

示例代码如下：

```typescript
try {
  // 强制设置单个聊天室自定义属性
  const failures = await ChatClient.getInstance().roomManager.addAttributes({
    roomId: '<room_id>',
    // 属性键值对象数组，单个属性也使用数组
    attributes: [{ topic: 'music' }],
    // 退出时是否自动删除，默认 false
    deleteWhenLeft: false,
    // 允许覆盖其他成员设置的同名属性，默认 false
    overwrite: true,
  });
  if (failures.size === 0) {
    // 全部属性设置成功
    console.log('设置自定义属性成功');
  } else {
    // 返回未成功设置的属性 Key 及对应错误码
    console.log('设置自定义属性失败项：', failures);
  }
} catch (error: unknown) {
  console.error('设置自定义属性失败：', error);
}
```

### 设置多个聊天室自定义属性

聊天室成员可以调用 `ChatRoomManager#addAttributes` 方法设置或更新多个聊天室自定义属性。该方法只能添加新属性字段以及更新当前用户已添加的属性字段。设置后，其他聊天室成员收到 `ChatRoomEventListener#onAttributesUpdated` 回调。

示例代码如下：

```typescript
try {
  // 设置或更新多个聊天室自定义属性
  const failures = await ChatClient.getInstance().roomManager.addAttributes({
    roomId: '<room_id>',
    // 属性键值对象数组，每次最多 10 个键值对
    attributes: [{ topic: 'music' }, { language: 'zh' }],
    // 退出时是否自动删除，默认 false
    deleteWhenLeft: false,
    // 不允许覆盖其他成员设置的同名属性，默认 false
    overwrite: false,
  });
  if (failures.size === 0) {
    // 全部属性设置成功
    console.log('设置自定义属性成功');
  } else {
    // 返回未成功设置的属性 Key 及对应错误码
    console.log('设置自定义属性失败项：', failures);
  }
} catch (error: unknown) {
  console.error('设置自定义属性失败：', error);
}
```

### 强制设置多个聊天室属性

如果除了设置自己的多个自定义属性还需覆盖其他聊天室成员设置的这些属性，需调用 `ChatRoomManager#addAttributes` 方法，并将 `overwrite` 设置为 `true`。设置后，其他聊天室成员收到 `ChatRoomEventListener#onAttributesUpdated` 回调。

示例代码如下：

```typescript
try {
  // 强制设置多个聊天室自定义属性
  const failures = await ChatClient.getInstance().roomManager.addAttributes({
    roomId: '<room_id>',
    // 属性键值对象数组，每次最多 10 个键值对
    attributes: [{ topic: 'music' }, { language: 'zh' }],
    // 退出时是否自动删除，默认 false
    deleteWhenLeft: false,
    // 允许覆盖其他成员设置的同名属性，默认 false
    overwrite: true,
  });
  if (failures.size === 0) {
    // 全部属性设置成功
    console.log('设置自定义属性成功');
  } else {
    // 返回未成功设置的属性 Key 及对应错误码
    console.log('设置自定义属性失败项：', failures);
  }
} catch (error: unknown) {
  console.error('设置自定义属性失败：', error);
}
```

### 删除单个聊天室自定义属性

聊天室成员可以调用 `ChatRoomManager#removeAttributes` 方法删除单个聊天室自定义属性。`forced` 为 `false`（默认）时，该方法只能删除自己设置的自定义属性。删除后，聊天室其他成员收到 `ChatRoomEventListener#onAttributesRemoved` 回调。

示例代码如下：

```typescript
try {
  // 删除单个聊天室自定义属性
  const failures = await ChatClient.getInstance().roomManager.removeAttributes({
    roomId: '<room_id>',
    // 要删除的属性 Key 列表，不能为空
    keys: ['topic'],
    // 不允许删除其他成员设置的属性，默认 false
    forced: false,
  });
  if (failures.size === 0) {
    // 全部属性删除成功
    console.log('删除自定义属性成功');
  } else {
    // 返回未成功删除的属性 Key 及对应错误码
    console.log('删除自定义属性失败项：', failures);
  }
} catch (error: unknown) {
  console.error('删除自定义属性失败：', error);
}
```

### 强制删除单个聊天室自定义属性

如果除了删除自己设置的单个自定义属性还需删除其他聊天室成员设置的该属性，需调用 `ChatRoomManager#removeAttributes` 方法，并将 `forced` 设置为 `true`。删除后，聊天室其他成员收到 `ChatRoomEventListener#onAttributesRemoved` 回调。

示例代码如下：

```typescript
try {
  // 强制删除单个聊天室自定义属性
  const failures = await ChatClient.getInstance().roomManager.removeAttributes({
    roomId: '<room_id>',
    // 要删除的属性 Key 列表，不能为空
    keys: ['topic'],
    // 允许删除其他成员设置的属性，默认 false
    forced: true,
  });
  if (failures.size === 0) {
    // 全部属性删除成功
    console.log('删除自定义属性成功');
  } else {
    // 返回未成功删除的属性 Key 及对应错误码
    console.log('删除自定义属性失败项：', failures);
  }
} catch (error: unknown) {
  console.error('删除自定义属性失败：', error);
}
```

### 删除多个聊天室自定义属性

聊天室成员可以调用 `ChatRoomManager#removeAttributes` 方法删除多个聊天室自定义属性。`forced` 为 `false`（默认）时，该方法只能删除自己设置的自定义属性。删除后，聊天室其他成员收到 `ChatRoomEventListener#onAttributesRemoved` 回调。

示例代码如下：

```typescript
try {
  // 删除多个聊天室自定义属性
  const failures = await ChatClient.getInstance().roomManager.removeAttributes({
    roomId: '<room_id>',
    // 要删除的属性 Key 列表，不能为空
    keys: ['topic', 'language'],
    // 不允许删除其他成员设置的属性，默认 false
    forced: false,
  });
  if (failures.size === 0) {
    // 全部属性删除成功
    console.log('删除自定义属性成功');
  } else {
    // 返回未成功删除的属性 Key 及对应错误码
    console.log('删除自定义属性失败项：', failures);
  }
} catch (error: unknown) {
  console.error('删除自定义属性失败：', error);
}
```

### 强制删除多个聊天室自定义属性

如果除了删除自己设置的多个自定义属性还需删除其他聊天室成员设置的这些属性，需调用 `ChatRoomManager#removeAttributes` 方法，并将 `forced` 设置为 `true`。删除后，聊天室其他成员收到 `ChatRoomEventListener#onAttributesRemoved` 回调。

示例代码如下：

```typescript
try {
  // 强制删除多个聊天室自定义属性
  const failures = await ChatClient.getInstance().roomManager.removeAttributes({
    roomId: '<room_id>',
    // 要删除的属性 Key 列表，不能为空
    keys: ['topic', 'language'],
    // 允许删除其他成员设置的属性，默认 false
    forced: true,
  });
  if (failures.size === 0) {
    // 全部属性删除成功
    console.log('删除自定义属性成功');
  } else {
    // 返回未成功删除的属性 Key 及对应错误码
    console.log('删除自定义属性失败项：', failures);
  }
} catch (error: unknown) {
  console.error('删除自定义属性失败：', error);
}
```

## 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。React Native SDK 5.0.0 的 `ChatRoomEventListener#onAttributesUpdated` 不能直接按属性名读取 `attributes`，请将回调作为变更通知，再通过 `ChatRoomManager#fetchChatRoomAttributes` 查询当前属性。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchChatRoomInfoFromServer`](#获取聊天室详情) | `ChatRoomManager` | 异步从服务器获取聊天室详情。 |
| [`fetchChatRoomAnnouncement`](#获取聊天室公告) | `ChatRoomManager` | 异步获取聊天室公告。 |
| [`updateChatRoomAnnouncement`](#更新聊天室公告) | `ChatRoomManager` | 异步更新聊天室公告。 |
| [`changeChatRoomSubject`](#修改聊天室名称) | `ChatRoomManager` | 异步修改聊天室名称。 |
| [`changeChatRoomDescription`](#修改聊天室描述) | `ChatRoomManager` | 异步修改聊天室描述。 |
| [`fetchChatRoomAttributes`](#获取聊天室指定自定义属性) | `ChatRoomManager` | 获取指定或全部自定义属性。 |
| [`addAttributes`](#设置单个聊天室属性) | `ChatRoomManager` | 设置或更新单个、多个自定义属性，支持强制覆盖。 |
| [`removeAttributes`](#删除单个聊天室自定义属性) | `ChatRoomManager` | 删除单个、多个自定义属性，支持强制删除。 |
