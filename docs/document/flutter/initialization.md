# 初始化

初始化是使用 SDK 的必要步骤。请在调用其他 SDK API 前完成初始化，并在应用生命周期内避免重复初始化。

如果进行了多次初始化操作，只有第一次初始化以及相关的参数生效。

:::tip
Android 应在应用主进程中初始化 SDK。
:::

## 前提条件

你已拥有有效的环信即时通讯 IM 开发者账号和 App Key。关于创建应用并获取 App Key，详见 [环信控制台相关文档](/product/console/app_create.html)。

## 初始化 SDK

使用 `ChatOptions.withAppKey` 创建初始化配置，然后调用 `ChatClient.getInstance.init` 初始化 SDK：

```dart
final ChatOptions options = ChatOptions.withAppKey(appKey);
await ChatClient.getInstance.init(options);
```

### 配置 iOS 生命周期回调

Flutter SDK 4.13.0 及以上版本支持通过 `ExtSettings.kDisableIosEnterBackground` 控制 Flutter iOS 插件是否自动向 iOS 原生 SDK 转发应用进入后台和返回前台的生命周期事件：

- 未设置该参数或设置为 `false`：插件监听 iOS 生命周期通知，并分别调用原生 SDK 的 `applicationDidEnterBackground` 和 `applicationWillEnterForeground`。
- 设置为 `true`：插件不注册上述生命周期通知，也不会自动调用这两个原生 SDK 方法。

如需关闭 Flutter iOS 插件的自动转发，可进行如下配置：

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  extSettings: <String, dynamic>{
    ExtSettings.kDisableIosEnterBackground: true,
  },
);

await ChatClient.getInstance.init(options);
```

### 常用初始化配置

下表列出了 `ChatOptions.withAppKey` 的部分常用参数。全部参数请参见 [`ChatOptions` API 参考](https://doc.easemob.com/apidoc/flutter/im_flutter_sdk/ChatOptions-class.html)。

| 参数 | 类型 | 默认值 | 描述 |
| :--- | :--- | :---: | :--- |
| `appKey` | `String` | 无 | 在环信控制台创建应用后获得的 App Key，必须传入。 |
| `autoLogin` | `bool` | `true` | 是否开启自动登录。开启后，用户首次成功登录且未主动退出时，SDK 可在后续启动时自动登录。 |
| `acceptInvitationAlways` | `bool` | `false` | 是否自动接受好友邀请：<br/> -（默认）`true`：自动接受好友邀请。 <br/> -  `false`：不自动接收好友邀请。 |
| `autoAcceptGroupInvitation` | `bool` | `false` | 是否自动接受群组邀请：<br/> -（默认）`true`：自动接受加群申请； <br/> -  `false`: 不自动接受加群申请。 |
| `requireAck` | `bool` | `true` | 是否要求消息已读回执。 |
| `requireDeliveryAck` | `bool` | `false` | 是否要求消息送达回执。 |
| `deleteMessagesAsExitGroup` | `bool` | `true` | 离开群组时是否删除该群组的本地消息：<br/> -（默认）`true`: 退出群组时删除群组消息。 <br/> -  `false`: 退出群组时不删除群组消息。 |
| `deleteMessagesAsExitChatRoom` | `bool` | `true` | 离开聊天室时是否删除该聊天室的本地消息：<br/> -（默认）`true`：删除。 <br/> -  `false`：保留。 |
| `isChatRoomOwnerLeaveAllowed` | `bool` | `true` | 是否允许聊天室所有者离开聊天室：<br/> - （默认） `true`：允许。即使聊天室所有者离开，该所有者仍具有聊天室的所有权限，只不过不再接收任何消息。<br/> - `false`：不允许。 |
| `enableUserInfo` | `bool` | `false` | 是否开启用户信息自动管理功能。 |
| `enableAutoSyncContacts` | `bool` | `false` | 是否在登录后自动从服务器同步联系人列表。 |

## 初始化后设置监听

初始化完成后，可以添加连接事件处理器和消息事件处理器，监听 SDK 连接状态及消息接收事件。每个事件处理器都使用业务自定义的唯一 ID 管理；使用相同 ID 再次添加时，会覆盖此前的处理器。

```dart
const String connectionHandlerId = 'connection_handler';
const String messageHandlerId = 'message_handler';

ChatClient.getInstance.addConnectionEventHandler(
  connectionHandlerId,
  ConnectionEventHandler(
    onConnected: () {
      debugPrint('Connected to the IM server.');
    },
    onDisconnected: () {
      debugPrint('Disconnected from the IM server.');
    },
  ),
);

ChatClient.getInstance.chatManager.addEventHandler(
  messageHandlerId,
  ChatEventHandler(
    onMessagesReceived: (List<ChatMessage> messages) {
      debugPrint('Received ${messages.length} message(s).');
    },
  ),
);
```

不再需要监听时，应使用对应的 ID 移除事件处理器：

```dart
ChatClient.getInstance.removeConnectionEventHandler(connectionHandlerId);
ChatClient.getInstance.chatManager.removeEventHandler(messageHandlerId);
```

## 设置登录后自动同步联系人

Flutter SDK 4.22.0 支持在初始化 SDK 时通过 `ChatOptions.enableAutoSyncContacts` 配置登录后是否自动从服务器同步联系人列表。登录成功后，原生 SDK 按配置同步联系人数据，并更新本地数据。详见 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`withAppKey`](#初始化-sdk) | `ChatOptions` | 使用 App Key 创建初始化配置。 |
| [`init`](#初始化-sdk) | `ChatClient` | 初始化 Flutter SDK 单例。 |
| [`addConnectionEventHandler`](#初始化后设置监听) | `ChatClient` | 添加连接事件处理器。 |
| [`removeConnectionEventHandler`](#初始化后设置监听) | `ChatClient` | 移除连接事件处理器。 |
| [`addEventHandler`](#初始化后设置监听) | `ChatManager` | 添加消息事件处理器。 |
| [`removeEventHandler`](#初始化后设置监听) | `ChatManager` | 移除消息事件处理器。 |
| [`enableAutoSyncContacts`](#设置登录后自动同步联系人) | `ChatOptions` | 设置登录后是否自动同步联系人列表。 |
