# 管理聊天室属性

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，属性信息变更会实时同步给聊天室成员。

本文介绍如何管理聊天室属性信息。

## 技术原理

环信即时通讯 IM Flutter SDK 提供 `EMChatRoom`、`EMRoomManager` 和 `EMChatRoomEventHandler` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- 获取和更新聊天室基本属性；
- 获取聊天室自定义属性；
- 设置聊天室自定义属性；
- 删除聊天室自定义属性。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/document/v2/privatization/uc_limitation.html)。

## 实现方法

本节介绍如何使用环信即时通讯 IM Flutter SDK 提供的 API 实现上述功能。

### 管理聊天室基本属性

对于聊天室名称和描述，你可以调用 `EMChatManager#fetchChatRoomInfoFromServer` 方法[获取聊天室详情](room_manage.html#获取聊天室详情)时查看。

#### 获取聊天室公告

聊天室所有成员均可调用 `EMChatRoomManager#fetchChatRoomAnnouncement` 方法获取聊天室公告。

示例代码如下：

```dart
try {
  String? announcement =
      await EMClient.getInstance.chatRoomManager.fetchChatRoomAnnouncement(
    roomId,
  );
} on EMError catch (e) {
}
```

#### 更新聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `EMChatRoomManager#updateChatRoomAnnouncement` 方法设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `EMChatRoomEventHandler#onAnnouncementChangedFromChatRoom` 事件。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.updateChatRoomAnnouncement(
    roomId,
    newAnnouncement,
  );
} on EMError catch (e) {
}
```

#### 修改聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `EMChatRoomManager#changeChatRoomName` 方法设置和修改聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.changeChatRoomName(
    roomId,
    newName,
  );
} on EMError catch (e) {
}
```

#### 修改聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `EMChatRoomManager#changeChatRoomDescription` 方法设置和修改聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.changeChatRoomDescription(
    roomId,
    newDesc,
  );
} on EMError catch (e) {
}
```

### 管理聊天室自定义属性（key-value）

#### 获取聊天室自定义属性

聊天室所有成员均可调用 `fetchChatRoomAttributes` 方法获取聊天室自定义属性。

示例代码如下：

```dart
/// Param [roomId]                                聊天室 ID。
/// Param [keys]                                  聊天室自定义属性的 Key 列表。传 `null` 或空字符串时返回所有自定义属性。
/// **Return** Map<String,String> attributes      结果回调。
/// **Throws**                                    发生错误时会抛出 EMError 错误。

try {
  Map<String, String>? attributes =
      await EMClient.getInstance.chatRoomManager.fetchChatRoomAttributes(
    roomId,
    keys,
  );
} on EMError catch (e) {}
```

#### 设置聊天室自定义属性

所有聊天室成员均可调用 `addAttributes` 方法设置一个或多个聊天室自定义属性。利用该方法可设置新属性，也可以修改自己或其他成员设置的现有属性。设置后，其他聊天室成员收到 `EMChatRoomEventHandler#onAttributesUpdated` 回调。

示例代码如下：

```dart

/// Param [roomId]                            聊天室 ID。
/// Param [attributes]                        要添加的属性。
/// Param [deleteWhenExit]                    当前成员退出聊天室时是否自动删除其设置的自定义属性。
///       - `true`：是；
///       - （默认）`false`：否。
/// Param [forced]                            是否覆盖其他成员设置的 key 相同的属性。
///       - `true`：是；
///       - （默认）`false`：否。
/// **Return** Map<String,int> failInfo       设置失败的 key 以及错误原因。
/// **Throws**                                发生错误时会抛出 EMError 错误。

try {
  Map<String, int>? failInfo =
      await EMClient.getInstance.chatRoomManager.addAttributes(
    roomId,
    attributes: attributes,
    deleteWhenLeft: true,
    overwrite: true,
  );
} on EMError catch (e) {}
```

#### 删除聊天室自定义属性

所有聊天室成员均可以调用 `removeAttributes` 方法删除一个或多个聊天室自定义属性。利用该方法可删除自己和其他成员设置的自定义属性。删除后，聊天室其他成员收到 `EMChatRoomEventHandler#onAttributesRemoved` 回调。

示例代码如下：

```dart
/// Param [roomId]                            聊天室 ID。
/// Param [key]                               要移除的自定义属性的 key。
/// Param [forced]                            是否移除其他成员设置的 key 相同的属性。
///       - `true`：是；
///       - （默认）`false`：否。
/// **Return** Map<String,int> failInfo       移除失败的 key 以及错误原因。
/// **Throws**  
try {
  Map<String, int>? failInfo =
      await EMClient.getInstance.chatRoomManager.removeAttributes(
    roomId,
    keys: keys,
    force: true,
  );
} on EMError catch (e) {}
```

### 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。