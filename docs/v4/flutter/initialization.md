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
| `restServer` | `String?` | `null` | 自 SDK 4.0.0 起支持。设置 REST API 基准地址。国内 2 区应用使用应用专属域名时需要配置，详见 [配置应用专属域名](#配置应用专属域名)。 |
| `webSocketServer` | `String?` | `null` | 自 SDK 4.17.0 起支持。设置消息 WebSocket 主机名，与端口和 TLS 配置配合使用，详见 [配置应用专属域名](#配置应用专属域名)。 |
| `webSocketPort` | `int?` | `null` | 自 SDK 4.17.0 起支持。设置消息 WebSocket 端口。 |
| `enableTLS` | `bool` | `false` | 自 SDK 4.5.0 起支持。设置消息长连接是否启用 TLS。国内 2 区应用使用应用专属域名时设为 `true`，通过 WSS 连接。 |
| `enableDNSConfig` | `bool` | `true` | 自 SDK 4.0.0 起支持。默认 `true`，SDK 自动获取服务地址，使用集群域名时无需修改。国内 2 区应用使用应用专属域名时的设置见 [配置应用专属域名](#配置应用专属域名)。 |
| `autoLogin` | `bool` | `true` | 是否开启自动登录。开启后，用户首次成功登录且未主动退出时，SDK 可在后续启动时自动登录。 |
| `acceptInvitationAlways` | `bool` | `false` | 是否自动接受好友邀请：<br/> - `true`：自动接受好友邀请。 <br/> -  `false`：不自动接收好友邀请。 |
| `autoAcceptGroupInvitation` | `bool` | `false` | 是否自动接受群组邀请：<br/> - `true`：自动接受加群申请； <br/> -  `false`: 不自动接受加群申请。 |
| `requireAck` | `bool` | `true` | 是否要求消息已读回执。 |
| `requireDeliveryAck` | `bool` | `false` | 是否要求消息送达回执。 |
| `deleteMessagesAsExitGroup` | `bool` | `true` | 离开群组时是否删除该群组的本地消息：<br/> -（默认）`true`: 退出群组时删除群组消息。 <br/> -  `false`: 退出群组时不删除群组消息。 |
| `deleteMessagesAsExitChatRoom` | `bool` | `true` | 离开聊天室时是否删除该聊天室的本地消息：<br/> -（默认）`true`：删除。 <br/> -  `false`：保留。 |
| `isChatRoomOwnerLeaveAllowed` | `bool` | `true` | 是否允许聊天室所有者离开聊天室：<br/> - （默认） `true`：允许。即使聊天室所有者离开，该所有者仍具有聊天室的所有权限，只不过不再接收任何消息。<br/> - `false`：不允许。 |
| `enableUserInfo` | `bool` | `false` | 是否开启用户信息自动管理功能。 |
| `enableAutoSyncContacts` | `bool` | `false` | 是否在登录后自动从服务器同步联系人列表。 |
| `enableEmptyConversation` | 设置从本地数据库加载会话时是否包含空会话，必须在初始化 SDK 前设置。<br/> - `true`：包含空会话。<br/> -（默认）`false`：不包含空会话。 |
| `autoLoadConversations` | 设置初始化时是否自动将本地数据库中的全部会话加载到内存。该功能自 Flutter SDK 4.25.0 起支持，必须在初始化 SDK 前设置。<br/> -（默认）`true`：自动加载全部会话。<br/> - `false`：不自动加载全部会话，可通过 `fetchConversationsFromDB` 按页加载。 |
| `enableChatroomConversation` | 设置获取本地会话列表时是否包含聊天室会话。该配置不控制聊天室会话的创建或存储，也不影响聊天室消息的正常收发。自 Flutter SDK 4.25.0 起支持。<br/>- `true`：本地会话列表中包含聊天室会话。<br/>-（默认）`false`：本地会话列表中不包含聊天室会话。必须在初始化 SDK 前设置。 |
| `apnsCertName` | `String?` | `null` | APNs 推送证书名称，仅对 iOS 生效。必须在 SDK 初始化时设置，运行期间不可修改。自 Flutter SDK 4.25.0 起支持。 |
| `pushKitCertName` | `String?` | `null` | PushKit 推送证书名称，用于 iOS VoIP 推送，仅对 iOS 生效。必须在 SDK 初始化时设置，运行期间不可修改。自 Flutter SDK 4.25.0 起支持。 |

## 配置应用专属域名

目前仅国内 2 区支持应用专属域名。国内 2 区应用的服务器域名分为两类：**集群域名** 由同一集群内的应用共用，**应用专属域名** 按应用分配。其他数据中心使用集群域名。域名查看入口及展示规则见 [查看应用服务器域名](/product/console/app_manage.html#查看应用服务器域名)。

**自 2026 年 11 月 27 日起在国内 2 区创建的应用，必须使用为该应用分配的专属域名。**

使用集群域名时，SDK 默认自动获取服务地址，无需手动设置 REST 和消息长连接地址，保持 `enableDNSConfig` 的默认值 `true` 即可。

国内 2 区应用使用应用专属域名时，需要使用当前应用的 REST 和 WebSocket 地址配置 SDK。Flutter SDK 自 **4.17.0** 起支持以下 REST 和 WebSocket 服务地址配置。

#### 初始化前配置地址

在控制台进入目标应用的详情页，从 **开发配置信息 > 域名配置** 中复制 **REST API** 和 **Websocket** 地址，并使用同一页面的 App Key。请按以下格式填写 SDK 参数。

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `restServer` | String? | 是 | REST API 基准地址，保留 `https://` 及实际端口，例如 `https://api-your-app.example.com`；不追加组织名、应用名或业务接口路径。 |
| `webSocketServer` | String? | 是 | WebSocket 主机名，例如 `ws-your-app.example.com`；不包含 `wss://`、端口或路径。 |
| `webSocketPort` | int? | 是 | WSS 默认端口为 `443`；若控制台明确提供其他端口，使用实际值。 |
| `enableTLS` | bool | 是 | 默认 `false`；本文设为 `true`。 |
| `usingHttpsOnly` | bool | 否 | 默认 `true`；示例显式保留。 |
| `enableDNSConfig` | bool | 是 | 默认 `true`；本文设为 `false`。注意 `DNS` 的大小写。 |

:::notice
选择 **创建新的正式版应用** 上线时，正式版与测试版是两个应用，应从正式版详情页重新获取 App Key 和两项地址，不能只替换 App Key。详见 [应用上线](/product/console/app_launch.html#上线事项)。
:::

以下代码替换现有初始化入口中的配置。请沿用业务所需的其他初始化设置，不要在已经初始化后通过再次调用初始化接口切换地址。

```dart
import 'package:flutter/widgets.dart';
import 'package:im_flutter_sdk/im_flutter_sdk.dart';

Future<void> initializeChatSdk() async {
  WidgetsFlutterBinding.ensureInitialized();

  final options = ChatOptions.withAppKey(
    'your-org#your-app',
    restServer: 'https://api-your-app.example.com',
    webSocketServer: 'ws-your-app.example.com',
    webSocketPort: 443,
    enableTLS: true,
    usingHttpsOnly: true,
    enableDNSConfig: false,
  );

  try {
    await ChatClient.getInstance.init(options);
  } catch (error) {
    debugPrint('SDK 初始化失败：$error');
    rethrow;
  }
}
```

WebSocket 地址只填写主机名，端口单独设置，示例使用 `443`，通过 `enableTLS: true` 使用 WSS；REST 地址保留 `https://`，不使用 TCP 的 `imServer`。自 SDK **4.25.0** 起，依赖的 Android 4.25.1 / iOS 4.25.0 根据 REST 配置自动获取数据同步地址。

#### 检查配置结果

地址设置方法和初始化接口不提供独立的“域名连接成功”回调。初始化完成后，按 [初始化后设置监听](#初始化后设置监听) 注册连接监听，再按 [登录](login.html) 文档登录。确认连接成功，并通过 SDK 日志检查实际连接的服务主机。

分别验证消息收发、REST 请求和启用的自动同步功能。消息连接成功不代表所有请求和数据同步均已成功；失败时请记录错误信息，并对照 [错误码](error.html) 排查 App Key、域名、端口、TLS 和网络访问情况。


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

## 设置登录后自动同步好友数据

Flutter SDK 4.22.0 可通过 `ChatOptions.withAppKey` 的 `enableAutoSyncContacts` 参数设置登录后是否自动同步好友列表和好友对象。该参数默认为 `false`；如需开启，必须在初始化 SDK 时设置为 `true`。好友对象包含用户 ID、备注和添加时间等信息，不代表已获取所有好友的昵称和头像。

同步状态监听、好友列表和好友对象的本地读取方式，详见[登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)。

## 开启用户信息自动管理

Flutter SDK 4.22.0 可通过 `enableUserInfo` 参数设置用户信息自动管理功能。该参数默认为 `false`，设置为 `true` 后，原生 SDK 会在登录成功时自动同步 **当前登录用户** 的属性；其他用户的属性可在接收相关消息和主动从服务端拉取用户属性等场景下更新。它与 `enableAutoSyncContacts` 相互独立，**不会在登录时自动获取所有好友的昵称和头像**。

如果两项功能都需要，可在同一次初始化中配置：

```dart
final ChatOptions options = ChatOptions.withAppKey(
  'your_app_key',
  enableAutoSyncContacts: true,
  enableUserInfo: true,
);

await ChatClient.getInstance.init(options);
```

用户属性更新事件、本地读取与主动获取方式，详见[用户信息自动管理](userinfo_provider.html)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`restServer`](#初始化前配置地址) | `ChatOptions` | 设置 REST API 基准地址。 |
| [`webSocketServer`](#初始化前配置地址) | `ChatOptions` | 设置消息 WebSocket 主机名。 |
| [`webSocketPort`](#初始化前配置地址) | `ChatOptions` | 设置消息 WebSocket 端口。 |
| [`enableTLS`](#初始化前配置地址) | `ChatOptions` | 设置消息长连接是否启用 TLS。 |
| [`enableDNSConfig`](#初始化前配置地址) | `ChatOptions` | 配置服务地址的使用方式；使用指定地址时设为 `false`。 |
| [`withAppKey`](#初始化-sdk) | `ChatOptions` | 使用 App Key 创建初始化配置。 |
| [`init`](#初始化-sdk) | `ChatClient` | 初始化 Flutter SDK 单例。 |
| [`addConnectionEventHandler`](#初始化后设置监听) | `ChatClient` | 添加连接事件处理器。 |
| [`removeConnectionEventHandler`](#初始化后设置监听) | `ChatClient` | 移除连接事件处理器。 |
| [`addEventHandler`](#初始化后设置监听) | `ChatManager` | 添加消息事件处理器。 |
| [`removeEventHandler`](#初始化后设置监听) | `ChatManager` | 移除消息事件处理器。 |
| [`enableAutoSyncContacts`](#设置登录后自动同步好友数据) | `ChatOptions` | 登录后自动同步好友数据的初始化配置。 |
| [`enableUserInfo`](#开启用户信息自动管理) | `ChatOptions` | 用户属性自动管理的初始化配置。 |
| [`apnsCertName`](#常用初始化配置) | `ChatOptions` | iOS APNs 推送证书名称的初始化配置。 |
| [`pushKitCertName`](#常用初始化配置) | `ChatOptions` | iOS PushKit 推送证书名称的初始化配置。 |
| [`enableChatroomConversation`](#常用初始化配置) | 设置获取本地会话列表时是否包含聊天室会话。该配置不控制聊天室会话的创建或存储，也不影响聊天室消息的正常收发。自 Flutter SDK 4.25.0 起支持。 |
| [`enableEmptyConversation`](#常用初始化配置) | 设置从本地数据库加载会话时是否包含空会话，必须在初始化 SDK 前设置。 |
| [`autoLoadConversations`](#常用初始化配置) | 设置初始化时是否自动将本地数据库中的全部会话加载到内存。该功能自 Flutter SDK 4.25.0 起支持，必须在初始化 SDK 前设置。 |
