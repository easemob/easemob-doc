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

聊天室所有成员均可调用 `fetchChatRoomInfoFromServer` 获取聊天室详情，包括聊天室 ID、聊天室名称、聊天室描述、最大成员数、聊天室所有者、是否全员禁言以及当前用户在聊天室中的角色类型。聊天室公告、成员列表、管理员列表、黑名单列表和禁言列表需要分别调用对应接口获取。例如，若需获取成员列表，请调用 `fetchChatRoomMembers`。

示例代码如下：

```dart
try {
  final ChatRoom chatRoom = await ChatClient
      .getInstance.chatRoomManager
      .fetchChatRoomInfoFromServer(chatRoomId);
  // 获取聊天室详情成功。
} on ChatError catch (e) {
  // 获取聊天室详情失败。
}
```

### 获取聊天室公告

聊天室所有成员均可调用 `fetchChatRoomAnnouncement` 方法获取聊天室公告。

示例代码如下：

```dart
try {
  final String? announcement = await ChatClient
      .getInstance.chatRoomManager
      .fetchChatRoomAnnouncement(chatRoomId);
  // 获取聊天室公告成功。
} on ChatError catch (e) {
  // 获取聊天室公告失败。
}
```

### 更新聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `updateChatRoomAnnouncement` 方法设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `onAnnouncementChangedFromChatRoom` 回调。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.updateChatRoomAnnouncement(
    chatRoomId,
    announcement,
  );
  // 更新聊天室公告成功。
} on ChatError catch (e) {
  // 更新聊天室公告失败。
}
```

### 修改聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `changeChatRoomName` 方法设置和修改聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.changeChatRoomName(
    chatRoomId,
    newName,
  );
  // 修改聊天室名称成功。
} on ChatError catch (e) {
  // 修改聊天室名称失败。
}
```

### 修改聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `changeChatRoomDescription` 方法设置和修改聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.changeChatRoomDescription(
    chatRoomId,
    newDescription,
  );
  // 修改聊天室描述成功。
} on ChatError catch (e) {
  // 修改聊天室描述失败。
}
```

## 管理聊天室自定义属性（key-value）

聊天室自定义属性以字符串键值对形式存储。每个聊天室最多可有 100 个自定义属性；每个 key 最多包含 128 个字符，仅支持大小写英文字母、数字以及 `_`、`-`、`.`；每个 value 最多包含 4096 个字符。批量设置时，每次最多可传入 10 个键值对。

`ChatRoomManager.addAttributes` 和 `ChatRoomManager.removeAttributes` 均通过 `Future<Map<String, int>?>` 返回操作结果：

- 返回的 Map 为空时，表示全部属性操作成功。
- 返回的 Map 不为空时，表示部分属性操作失败，其中包含操作失败的属性 key 及对应错误码。
- 若操作整体失败，方法会抛出 `ChatError`。

### 获取聊天室指定自定义属性

聊天室所有成员均可调用 `fetchChatRoomAttributes` 方法获取聊天室指定自定义属性。

示例代码如下：

```dart
try {
  // keys 表示要获取的 key 列表。
  final Map<String, String>? attributes = await ChatClient
      .getInstance.chatRoomManager
      .fetchChatRoomAttributes(
        roomId: chatRoomId,
        keys: keys,
      );
} on ChatError catch (e) {
}
```

### 获取聊天室所有自定义属性

聊天室成员可以调用 `fetchChatRoomAttributes` 方法获取聊天室所有自定义属性。调用时不传 `keys`，或传入 `null` 或空列表。

示例代码如下：

```dart
try {
  final Map<String, String>? attributes = await ChatClient
      .getInstance.chatRoomManager
      .fetchChatRoomAttributes(roomId: chatRoomId);
} on ChatError catch (e) {
}
```

### 设置单个聊天室属性

聊天室成员可以调用 `addAttributes` 方法设置或更新单个聊天室自定义属性。该方法只可添加新自定义属性字段和更新自己设置的现有属性。设置后，其他聊天室成员收到 `onAttributesUpdated` 回调。

示例代码如下：

```dart
try {
  final Map<String, int>? failureKeys = await ChatClient
      .getInstance.chatRoomManager
      .addAttributes(
        chatRoomId,
        attributes: <String, String>{attributeKey: attributeValue},
        // 退出时是否自动删除，默认 false。
        deleteWhenLeft: false,
        overwrite: false,
      );
} on ChatError catch (e) {
}
```

### 强制设置单个聊天室属性

如果除了设置或更新自己的单个自定义属性还需覆盖其他聊天室成员设置的该属性，调用 `addAttributes` 方法时需将 `overwrite` 设置为 `true`。设置后，其他聊天室成员收到 `onAttributesUpdated` 回调。

示例代码如下：

```dart
try {
  final Map<String, int>? failureKeys = await ChatClient
      .getInstance.chatRoomManager
      .addAttributes(
        chatRoomId,
        attributes: <String, String>{attributeKey: attributeValue},
        // 退出时是否自动删除，默认 false。
        deleteWhenLeft: false,
        overwrite: true,
      );
} on ChatError catch (e) {
}
```

### 设置多个聊天室自定义属性

聊天室成员可以调用 `addAttributes` 方法设置或更新多个聊天室自定义属性。该方法只能添加新属性字段以及更新当前用户已添加的属性字段。设置后，其他聊天室成员收到 `onAttributesUpdated` 回调。

示例代码如下：

```dart
try {
  final Map<String, int>? failureKeys = await ChatClient
      .getInstance.chatRoomManager
      .addAttributes(
        chatRoomId,
        // 属性键值对。Map<String, String> 类型。
        attributes: attributeMap,
        // 退出时是否自动删除，默认 false。
        deleteWhenLeft: false,
        overwrite: false,
      );

  if (failureKeys == null || failureKeys.isEmpty) {
    // 全部自定义属性设置成功。
  } else {
    // failureKeys 包含设置失败的属性 key 及对应错误码。
  }
} on ChatError catch (e) {
}
```

### 强制设置多个聊天室属性

如果除了设置自己的多个自定义属性还需覆盖其他聊天室成员设置的这些属性，调用 `addAttributes` 方法时需将 `overwrite` 设置为 `true`。设置后，其他聊天室成员收到 `onAttributesUpdated` 回调。

示例代码如下：

```dart
try {
  final Map<String, int>? failureKeys = await ChatClient
      .getInstance.chatRoomManager
      .addAttributes(
        chatRoomId,
        attributes: attributeMap,
        // 退出时是否自动删除，默认 false。
        deleteWhenLeft: false,
        overwrite: true,
      );

  if (failureKeys == null || failureKeys.isEmpty) {
    // 全部自定义属性设置成功。
  } else {
    // failureKeys 包含设置失败的属性 key 及对应错误码。
  }
} on ChatError catch (e) {
}
```

### 删除单个聊天室自定义属性

聊天室成员可以调用 `removeAttributes` 方法删除单个聊天室自定义属性。该方法只能删除自己设置的自定义属性。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```dart
try {
  final Map<String, int>? failureKeys = await ChatClient
      .getInstance.chatRoomManager
      .removeAttributes(
        chatRoomId,
        keys: <String>[key],
        force: false,
      );
} on ChatError catch (e) {
}
```

### 强制删除单个聊天室自定义属性

如果除了删除自己设置的单个自定义属性还需删除其他聊天室成员设置的该属性，调用 `removeAttributes` 方法时需将 `force` 设置为 `true`。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```dart
try {
  final Map<String, int>? failureKeys = await ChatClient
      .getInstance.chatRoomManager
      .removeAttributes(
        chatRoomId,
        keys: <String>[key],
        force: true,
      );
} on ChatError catch (e) {
}
```

### 删除多个聊天室自定义属性

聊天室成员可以调用 `removeAttributes` 方法删除多个聊天室自定义属性。该方法只能删除自己设置的自定义属性。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```dart
try {
  // keys 表示要删除的属性 key 列表，不能为空。
  final Map<String, int>? failureKeys = await ChatClient
      .getInstance.chatRoomManager
      .removeAttributes(
        chatRoomId,
        keys: keys,
        force: false,
      );

  // failureKeys 为空时，全部属性删除成功；
  // 否则，其中包含未成功删除的属性 key 及对应错误码。
} on ChatError catch (e) {
}
```

### 强制删除多个聊天室自定义属性

如果除了删除自己设置的多个自定义属性还需删除其他聊天室成员设置的这些属性，调用 `removeAttributes` 方法时需将 `force` 设置为 `true`。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```dart
try {
  // keys 表示要删除的属性 key 列表，不能为空。
  final Map<String, int>? failureKeys = await ChatClient
      .getInstance.chatRoomManager
      .removeAttributes(
        chatRoomId,
        keys: keys,
        force: true,
      );
} on ChatError catch (e) {
}
```

## 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchChatRoomInfoFromServer`](#获取聊天室详情) | `ChatRoomManager` | 从服务器获取聊天室详情。 |
| [`fetchChatRoomAnnouncement`](#获取聊天室公告) | `ChatRoomManager` | 获取聊天室公告。 |
| [`updateChatRoomAnnouncement`](#更新聊天室公告) | `ChatRoomManager` | 更新聊天室公告。 |
| [`changeChatRoomName`](#修改聊天室名称) | `ChatRoomManager` | 修改聊天室名称。 |
| [`changeChatRoomDescription`](#修改聊天室描述) | `ChatRoomManager` | 修改聊天室描述。 |
| [`fetchChatRoomAttributes`](#获取聊天室指定自定义属性) | `ChatRoomManager` | 获取指定或全部自定义属性。 |
| [`addAttributes`](#设置单个聊天室属性) | `ChatRoomManager` | 设置或更新单个或多个自定义属性。 |
| [`removeAttributes`](#删除单个聊天室自定义属性) | `ChatRoomManager` | 删除单个或多个自定义属性。 |
