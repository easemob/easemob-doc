# 多设备登录

## 功能说明

即时通讯 IM 支持同一账号在多个设备上登录。使用该功能前，需要在 [环信控制台](https://console.easemob.com/user/login) 开通多端多设备服务。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。

Flutter SDK 在登录时会为当前设备生成登录资源标识，并将设备相关信息同步到服务器。服务器根据多端多设备策略维护当前账号的在线设备状态。当同一账号在其他设备上执行好友、群组、消息话题、会话或单向删除服务端历史消息等操作时，当前设备可以通过 `ChatMultiDeviceEventHandler` 接收相应的多设备事件。

多端多设备登录场景下，Flutter SDK 支持以下功能：

- 接收当前账号其他设备触发的多设备事件；
- 同步好友、群组、消息话题、会话以及单向删除服务端历史消息等操作；
- 获取当前用户的其他已登录设备的登录 ID 列表；
- 获取指定账号的在线登录设备列表；
- 设置登录设备的名称、平台和扩展信息；
- 强制指定账号从单个设备或所有设备下线。

多端登录时，即时通讯 IM 每端默认最多支持 4 个设备同时在线。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。你可以在环信控制台的 **功能配置 > 基础功能 > 用户** 页面，在弹出的对话框中设置各端设备的数量：

![img](/images/common/multidevice_device_count.png)

## 互踢策略

单端和多端登录场景下的互踢策略如下表所示：

| 单端/多端登录 | 互踢策略 |
| :---: | :--- |
| **单端登录** | 新登录的设备会将当前在线设备踢下线。 |
| **多端登录** | 若一端的登录设备数量达到上限，最新登录的设备会将该端最早登录的设备踢下线。<br><br>即时通讯 IM 仅支持同端互踢，不支持各端之间互踢。 |

## 前提条件

- 已完成 SDK 初始化并使用 Token 登录，详见 [快速开始](quickstart.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通多端多设备功能。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。
- 登录设备的自定义名称和平台需在 SDK 初始化时通过 `ChatOptions` 设置。

## 获取当前用户的其他登录设备的登录 ID 列表

调用 `ChatClient.getInstance.contactManager.getSelfIdsOnOtherPlatform` 获取当前账号在其他设备上的登录 ID 列表。返回结果会排除当前设备。你可以选择一个登录 ID 作为消息接收方，向指定设备发送消息。

该接口适用于多设备登录场景，用于查询当前账号在其他设备上的登录状态。返回结果中会自动排除当前设备，通常可用于展示已登录设备列表、识别异常登录、进行多端登录提醒，或配合服务端接口对指定设备执行下线等管理操作。

```dart
try {
  final ids = await ChatClient.getInstance.contactManager
      .getSelfIdsOnOtherPlatform();

  if (ids.isNotEmpty) {
    final message = ChatMessage.createTxtSendMessage(
      targetId: ids.first,
      content: 'content',
    );
    await ChatClient.getInstance.chatManager.sendMessage(message);
  }
} on ChatError catch (e) {
  debugPrint('获取其他设备登录 ID 失败：$e');
}
```

返回的每项登录 ID 采用 `userId/resource` 格式：

- `userId`：当前用户的用户 ID。
- `resource`：已登录设备对应的资源标识，用于区分该用户的具体登录设备。

其中，`resource` 与服务端 [单设备下线接口](/document/server-side/account_offline_device_single.html) 中的 `resourceId` 参数，以及服务端 [获取指定账号在线设备列表](/document/server-side/account_online_device_obtain.html) 返回的 `res` 字段，在语义上是一致的。若业务需要调用服务端单设备下线接口，应从完整登录 ID 中提取 `/` 后面的 `resource`。

## 获取指定账号的在线登录设备列表

调用 `ChatClient.getInstance.fetchLoggedInDevices`，传入用户 ID 和用户 Token，从服务器获取指定账号的在线登录设备列表。

成功时返回 `List<ChatDeviceInfo>`：

- `deviceName`：设备名称；若未设置自定义名称，通常为设备型号。
- `resource`：设备资源标识，可用于将指定设备踢下线。
- `deviceUUID`：设备的唯一标识。

```dart
try {
  final deviceInfos = await ChatClient.getInstance.fetchLoggedInDevices(
    userId: userId,
    token: userToken,
  );

  for (final device in deviceInfos) {
    debugPrint(
      'name=${device.deviceName}, resource=${device.resource}',
    );
  }
} on ChatError catch (e) {
  debugPrint('获取在线设备列表失败：$e');
}
```

## 设置登录设备的名称

自定义设备名称可帮助业务在多设备场景中识别将当前设备挤下线的新设备。

初始化 SDK 时，通过 `ChatOptions.deviceName` 设置登录设备名称。设置后，若新设备登录导致当前设备被踢下线，当前设备会收到 `ConnectionEventHandler.onDisconnected`；当 `errorCode` 为 `ChatDisconnectErrorCode.USER_LOGIN_ANOTHER_DEVICE`（206）时，`info?.deviceName` 表示新登录设备的名称。

:::tip
登录成功后，SDK 才会将该设置发送到服务器。
:::

```dart
final options = ChatOptions.withAppKey(
  appKey,
  deviceName: '我的 iPad',
);
await ChatClient.getInstance.init(options);

ChatClient.getInstance.addConnectionEventHandler(
  'multi-device-connection',
  ConnectionEventHandler(
    onDisconnected: (errorCode, info) {
      if (errorCode ==
          ChatDisconnectErrorCode.USER_LOGIN_ANOTHER_DEVICE) {
        debugPrint('被设备 ${info?.deviceName} 挤下线');
      }
    },
  ),
);
```

## 设置登录设备的平台

你可以自定义登录设备的平台，例如将 Android 手机和 Android 平板电脑设置为两个平台，以便精细化控制同一平台的登录设备数量及平台间互踢行为。

1. 在环信控制台的 **即时通讯 > 基础功能 > 用户** 页面，在 **多端多设备** 区域点击**设置**。在弹出的对话框中点击 **新增自定义平台**，设置 **设备平台** 和 **设备数量**。

   **设备平台** 的取值范围为 [1,100]，**设备数量** 的取值范围为 [0,4]。

   ![img](/images/common/multidevice_device_platform.png)

2. 初始化 SDK 时，通过 `ChatOptions.osType` 设置登录设备的平台。`osType` 必须与环信控制台的 **添加自定义平台** 对话框中设置的 **设备平台** 的值相同。值相同。

:::tip
登录成功后，SDK 才会将该设置发送到服务器。
:::

```dart
final options = ChatOptions.withAppKey(
  appKey,
  osType: 1,
);
await ChatClient.getInstance.init(options);
```

## 设置登录设备的扩展信息

登录设备的自定义扩展信息可用于传递附加标识，便于业务侧识别和管理设备，例如，若有设备被踢下线，被踢设备能获得该设备的自定义扩展信息。

初始化 SDK 时，通过 `ChatOptions.loginExtension` 设置扩展信息，最大长度为 1024 个字符。

设置后，若新设备登录导致当前设备被踢下线，当前设备的 `ConnectionEventHandler.onDisconnected` 会收到错误码 `USER_LOGIN_ANOTHER_DEVICE`（206），`info?.ext` 表示新登录设备设置的扩展信息。

:::tip
登录成功后，SDK 才会将该设置发送到服务器。只有 `USER_LOGIN_ANOTHER_DEVICE` 原因可能携带 `LoginExtensionInfo`；其他断开原因下 `info` 为 `null`。
:::

```dart
final options = ChatOptions.withAppKey(
  appKey,
  loginExtension: '{"deviceId":"business-device-id"}',
);
await ChatClient.getInstance.init(options);

ChatClient.getInstance.addConnectionEventHandler(
  'multi-device-connection',
  ConnectionEventHandler(
    onDisconnected: (errorCode, info) {
      if (errorCode ==
          ChatDisconnectErrorCode.USER_LOGIN_ANOTHER_DEVICE) {
        debugPrint('新设备名称：${info?.deviceName}');
        debugPrint('新设备扩展信息：${info?.ext}');
      }
    },
  ),
);
```

## 强制指定账号从单个设备下线

调用 `kickDevice`，传入用户 ID、用户 Token 和设备资源标识，将指定账号从单个登录设备踢下线。调用前，先通过 `fetchLoggedInDevices` 获取设备列表，再读取目标 `ChatDeviceInfo.resource`。

被踢设备会通过 `ConnectionEventHandler.onDisconnected` 收到 `ChatDisconnectErrorCode.USER_KICKED_BY_OTHER_DEVICE`（217）。

:::tip
不登录也可以使用该接口，但必须传入有效的用户 ID 和用户 Token。
:::

```dart
try {
  final deviceInfos = await ChatClient.getInstance.fetchLoggedInDevices(
    userId: userId,
    token: userToken,
  );

  final resource = deviceInfos[selectedIndex].resource;
  if (resource == null || resource.isEmpty) {
    throw StateError('目标设备缺少 resource');
  }

  await ChatClient.getInstance.kickDevice(
    userId: userId,
    token: userToken,
    resource: resource,
  );
} on ChatError catch (e) {
  debugPrint('踢出指定设备失败：$e');
}
```

## 强制指定账号从所有设备下线

调用 `kickAllDevices`，传入用户 ID 和用户 Token，将指定账号从所有登录设备踢下线。

:::tip
不登录也可以使用该接口，但必须传入有效的用户 ID 和用户 Token。
:::

```dart
try {
  await ChatClient.getInstance.kickAllDevices(
    userId: userId,
    token: userToken,
  );
} on ChatError catch (e) {
  debugPrint('踢出全部设备失败：$e');
}
```

## 监听多设备事件

例如，账号 A 同时在设备 A 和 B 上登录，账号 A 在设备 A 上进行操作，设备 B 会收到这些操作对应的通知。

通过 `ChatClient.getInstance.addMultiDeviceEventHandler` 注册 `ChatMultiDeviceEventHandler`。每个监听使用唯一 ID；不再需要时，传入同一 ID 调用 `removeMultiDeviceEventHandler`。

若当前设备因同端设备数量达到上限而被踢下线，SDK 通过 `ConnectionEventHandler.onDisconnected` 通知；当前账号在其他设备上的好友、群组、消息话题和会话操作，则通过 `ChatMultiDeviceEventHandler` 的对应回调通知。

| 回调 | 事件范围 |
| :--- | :--- |
| `onContactEvent` | 删除好友、接受或拒绝好友请求、加入或移出黑名单。 |
| `onGroupEvent` | 建群、解散、加入、离开、邀请、申请、成员管理、禁言、白名单、群成员属性等群组操作。 |
| `onChatThreadEvent` | 创建、解散、加入、离开、更新消息话题，以及将成员移出消息话题。 |
| `onConversationEvent` | 会话置顶、取消置顶、删除、更新标记、免打扰变化，以及清除单个或全部会话未读数。 |
| `onRemoteMessagesRemoved` | 其他设备单向删除某个会话的服务端历史消息。 |

:::tip
多端多设备场景下，不提供聊天室操作类多设备事件，只同步聊天室消息的发送和接收。
:::

```dart
// refreshLocalConversations 为业务侧实现的本地会话列表刷新方法。
const String multiDeviceHandlerId = 'multi-device';

final handler = ChatMultiDeviceEventHandler(
  // 当前账号在其他设备上的好友操作，ext 为可空的附加信息。
  onContactEvent: (event, userId, ext) {
    switch (event) {
      case ChatMultiDevicesEvent.CONTACT_REMOVE:
        // 删除好友。
        debugPrint('其他设备删除好友：$userId');
        break;
      case ChatMultiDevicesEvent.CONTACT_ACCEPT:
        // 接受好友请求。
        debugPrint('其他设备接受好友请求：$userId');
        break;
      case ChatMultiDevicesEvent.CONTACT_DECLINE:
        // 拒绝好友请求。
        debugPrint('其他设备拒绝好友请求：$userId');
        break;
      case ChatMultiDevicesEvent.CONTACT_BAN:
        // 将用户加入黑名单。
        debugPrint('其他设备将用户加入黑名单：$userId');
        break;
      case ChatMultiDevicesEvent.CONTACT_ALLOW:
        // 将用户移出黑名单。
        debugPrint('其他设备将用户移出黑名单：$userId');
        break;
      case ChatMultiDevicesEvent.UnKnow:
        // 原生事件值无法识别时的兜底事件。
        debugPrint('未知好友多设备事件：$userId，ext=$ext');
        break;
      default:
        // 对不属于好友操作的事件进行兼容处理。
        debugPrint('未处理的好友多设备事件：$event');
        break;
    }
  },
  // 当前账号在其他设备上的群组操作，userIds 为可空的相关用户列表。
  onGroupEvent: (event, groupId, userIds) {
    switch (event) {
      case ChatMultiDevicesEvent.GROUP_CREATE:
        // 创建群组。
        debugPrint('其他设备创建群组：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_DESTROY:
        // 解散群组。
        debugPrint('其他设备解散群组：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_JOIN:
        // 加入群组。
        debugPrint('其他设备加入群组：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_LEAVE:
        // 退出群组。
        debugPrint('其他设备退出群组：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_APPLY:
        // 申请加入群组。
        debugPrint('其他设备申请加入群组：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_APPLY_ACCEPT:
        // 接受入群申请。
        debugPrint('其他设备接受入群申请：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_APPLY_DECLINE:
        // 拒绝入群申请。
        debugPrint('其他设备拒绝入群申请：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_INVITE:
        // 邀请用户加入群组。
        debugPrint('其他设备邀请用户入群：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_INVITE_ACCEPT:
        // 接受群组邀请。
        debugPrint('其他设备接受群组邀请：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_INVITE_DECLINE:
        // 拒绝群组邀请。
        debugPrint('其他设备拒绝群组邀请：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_KICK:
        // 将成员移出群组。
        debugPrint('其他设备移出群成员：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_BAN:
        // 将成员加入群组黑名单。
        debugPrint('其他设备添加群组黑名单：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_ALLOW:
        // 将成员移出群组黑名单。
        debugPrint('其他设备移除群组黑名单：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_BLOCK:
        // 屏蔽群组消息。
        debugPrint('其他设备屏蔽群组消息：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_UNBLOCK:
        // 取消屏蔽群组消息。
        debugPrint('其他设备取消屏蔽群组消息：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_ASSIGN_OWNER:
        // 转移群主。
        debugPrint('其他设备转移群主：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_ADD_ADMIN:
        // 添加群组管理员。
        debugPrint('其他设备添加群管理员：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_REMOVE_ADMIN:
        // 移除群组管理员。
        debugPrint('其他设备移除群管理员：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_ADD_MUTE:
        // 禁言群成员。
        debugPrint('其他设备禁言群成员：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_REMOVE_MUTE:
        // 解除群成员禁言。
        debugPrint('其他设备解除群成员禁言：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_ADD_USER_ALLOW_LIST:
        // 将成员加入群组白名单。
        debugPrint('其他设备添加群组白名单：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_REMOVE_USER_ALLOW_LIST:
        // 将成员移出群组白名单。
        debugPrint('其他设备移除群组白名单：$groupId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.GROUP_ALL_BAN:
        // 开启全员禁言。
        debugPrint('其他设备开启全员禁言：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_REMOVE_ALL_BAN:
        // 解除全员禁言。
        debugPrint('其他设备解除全员禁言：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_MEMBER_ATTRIBUTES_CHANGED:
        // 更新群成员的自定义属性。
        debugPrint('其他设备更新群成员属性：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_UPDATE:
        // 该多设备事件当前仅 iOS 下发，跨端感知群信息变化时
        // 应使用 ChatGroupEventHandler.onSpecificationDidUpdate。
        debugPrint('其他设备更新群信息：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_DISABLED:
        // 群组功能被关闭。枚举已定义，但当前 Dart 事件转换未映射，
        // 不能依赖此分支收到通知；此处仅展示完整枚举的处理位置。
        debugPrint('群组功能关闭事件（预留分支）：$groupId');
        break;
      case ChatMultiDevicesEvent.GROUP_ABLE:
        // 群组功能被开启。枚举已定义，但当前 Dart 事件转换未映射，
        // 不能依赖此分支收到通知；此处仅展示完整枚举的处理位置。
        debugPrint('群组功能开启事件（预留分支）：$groupId');
        break;
      case ChatMultiDevicesEvent.UnKnow:
        // 原生事件值无法识别时的兜底事件。
        debugPrint('未知群组多设备事件：$groupId，相关用户：$userIds');
        break;
      default:
        // 对不属于群组操作的事件进行兼容处理。
        debugPrint('未处理的群组多设备事件：$event');
        break;
    }
  },
  // 当前账号在其他设备上的消息话题操作。
  onChatThreadEvent: (event, chatThreadId, userIds) {
    switch (event) {
      case ChatMultiDevicesEvent.CHAT_THREAD_CREATE:
        // 创建消息话题。
        debugPrint('其他设备创建消息话题：$chatThreadId');
        break;
      case ChatMultiDevicesEvent.CHAT_THREAD_DESTROY:
        // 解散消息话题。
        debugPrint('其他设备解散消息话题：$chatThreadId');
        break;
      case ChatMultiDevicesEvent.CHAT_THREAD_JOIN:
        // 加入消息话题。
        debugPrint('其他设备加入消息话题：$chatThreadId');
        break;
      case ChatMultiDevicesEvent.CHAT_THREAD_LEAVE:
        // 退出消息话题。
        debugPrint('其他设备退出消息话题：$chatThreadId');
        break;
      case ChatMultiDevicesEvent.CHAT_THREAD_UPDATE:
        // 更新消息话题信息。
        debugPrint('其他设备更新消息话题：$chatThreadId');
        break;
      case ChatMultiDevicesEvent.CHAT_THREAD_KICK:
        // 将成员移出消息话题。
        debugPrint('其他设备移出消息话题成员：$chatThreadId，相关用户：$userIds');
        break;
      case ChatMultiDevicesEvent.UnKnow:
        // 原生事件值无法识别时的兜底事件。
        debugPrint('未知消息话题多设备事件：$chatThreadId');
        break;
      default:
        // 对不属于消息话题操作的事件进行兼容处理。
        debugPrint('未处理的消息话题多设备事件：$event');
        break;
    }
  },
  // 当前账号在其他设备上的会话操作，type 表示会话类型。
  onConversationEvent: (event, conversationId, type) {
    switch (event) {
      case ChatMultiDevicesEvent.CONVERSATION_PINNED:
        // 置顶会话，重新读取本地会话并刷新 UI。
        debugPrint('其他设备置顶会话：$conversationId，类型：$type');
        refreshLocalConversations();
        break;
      case ChatMultiDevicesEvent.CONVERSATION_UNPINNED:
        // 取消置顶会话。
        debugPrint('其他设备取消置顶会话：$conversationId，类型：$type');
        refreshLocalConversations();
        break;
      case ChatMultiDevicesEvent.CONVERSATION_DELETE:
        // 删除会话。
        debugPrint('其他设备删除会话：$conversationId，类型：$type');
        refreshLocalConversations();
        break;
      case ChatMultiDevicesEvent.CONVERSATION_UPDATE_MARK:
        // 更新会话标记。
        debugPrint('其他设备更新会话标记：$conversationId，类型：$type');
        refreshLocalConversations();
        break;
      case ChatMultiDevicesEvent.CONVERSATION_MUTE_INFO_CHANGED:
        // 更新会话免打扰设置。
        debugPrint('其他设备更新会话免打扰：$conversationId，类型：$type');
        refreshLocalConversations();
        break;
      case ChatMultiDevicesEvent.CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED:
        // 清除指定会话的未读数。
        debugPrint('其他设备清除会话未读数：$conversationId，类型：$type');
        refreshLocalConversations();
        break;
      case ChatMultiDevicesEvent.ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED:
        // 清除全部会话的未读数，不应仅刷新 conversationId 对应的会话。
        debugPrint('其他设备清除全部会话未读数');
        refreshLocalConversations();
        break;
      case ChatMultiDevicesEvent.UnKnow:
        // 原生事件值无法识别时的兜底事件。
        debugPrint('未知会话多设备事件：$conversationId，类型：$type');
        break;
      default:
        // 对不属于会话操作的事件进行兼容处理。
        debugPrint('未处理的会话多设备事件：$event');
        break;
    }
  },
  // 其他设备单向删除服务端历史消息，独立回调，不对应上述事件枚举。
  onRemoteMessagesRemoved: (conversationId, deviceId) {
    debugPrint(
      '设备 $deviceId 删除了会话 $conversationId 的服务端历史消息',
    );
  },
);

ChatClient.getInstance.addMultiDeviceEventHandler(
  multiDeviceHandlerId,
  handler,
);

// 不再需要监听时移除。
ChatClient.getInstance.removeMultiDeviceEventHandler(multiDeviceHandlerId);
```

`GROUP_UPDATE` 当前仅由 iOS 原生 SDK 下发。需要跨端感知群信息变化时，应监听 `ChatGroupEventHandler.onSpecificationDidUpdate`，不要依赖该多设备事件。

`GROUP_DISABLED` 和 `GROUP_ABLE` 已在 `ChatMultiDevicesEvent` 中定义，但当前 Flutter V5 的原生事件值到 Dart 枚举的转换未映射这两个事件，示例仅保留其处理位置，不代表当前能够收到对应通知。无法识别的原生事件值会转换为 `UnKnow`，应做好兜底处理。

## 典型示例

当 PC 端和移动端登录同一个账号时，在移动端可以获取 PC 端的登录 ID。该登录 ID 相当于特殊的好友用户 ID，可以直接作为单聊消息接收方。

```dart
try {
  final ids = await ChatClient.getInstance.contactManager
      .getSelfIdsOnOtherPlatform();
  if (ids.isNotEmpty) {
    debugPrint('其他设备登录 ID：${ids.first}');
  }
} on ChatError catch (e) {
  debugPrint('获取失败：$e');
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getSelfIdsOnOtherPlatform`](#获取当前用户的其他登录设备的登录-id-列表) | `ChatContactManager` | 获取当前用户在其他设备上的登录 ID 列表。 |
| [`fetchLoggedInDevices`](#获取指定账号的在线登录设备列表) | `ChatClient` | 使用用户 ID 和 Token 获取指定账号的在线设备列表。 |
| [`deviceName`](#设置登录设备的名称) | `ChatOptions` | 设置当前登录设备的名称。 |
| [`osType`](#设置登录设备的平台) | `ChatOptions` | 设置当前登录设备的平台编号。 |
| [`loginExtension`](#设置登录设备的扩展信息) | `ChatOptions` | 设置当前登录设备的扩展信息。 |
| [`kickDevice`](#强制指定账号从单个设备下线) | `ChatClient` | 将指定账号从指定设备踢下线。 |
| [`kickAllDevices`](#强制指定账号从所有设备下线) | `ChatClient` | 将指定账号从所有设备踢下线。 |
| [`addMultiDeviceEventHandler`](#监听多设备事件) | `ChatClient` | 添加多设备事件监听。 |
| [`removeMultiDeviceEventHandler`](#监听多设备事件) | `ChatClient` | 按监听 ID 移除多设备事件监听。 |
