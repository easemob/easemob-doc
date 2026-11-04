# 初始化

初始化是使用 SDK 的必要步骤，必须在调用其他 SDK 接口前完成。

`ChatClient` 是单例。应集中完成 `ChatOptions` 配置后再初始化，避免重复调用 `init`。

## 前提条件

已注册有效的环信即时通讯 IM 开发者账号并创建应用，获取应用的 App Key。详见 [环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

使用 `ChatOptions.withAppKey` 创建初始化配置，传入 App Key，完成其他配置后，调用 `ChatClient.getInstance.init`。该方法返回 `Future<void>`，应使用 `await` 等待调用完成，再注册业务监听和执行后续操作。

```dart
Future<void> initializeChatSdk() async {
  // 在 Flutter 插件调用前完成绑定初始化，适用于 runApp 前初始化 SDK。
  WidgetsFlutterBinding.ensureInitialized();

  // 使用控制台创建应用后获得的 App Key，替换示例值。
  final ChatOptions options = ChatOptions.withAppKey(
    'your-org#your-app',
    // 显式启用登录后的会话列表同步，避免依赖两端不同的默认值。
    dataSyncType: ChatDataSyncType.conversations,
    // 根据业务需要继续设置其他初始化配置。
  );

  // 初始化 SDK；初始化不会自动登录。
  await ChatClient.getInstance.init(options);
}
```

下表列出 `ChatOptions.withAppKey` 的常用参数，请在初始化 SDK 前完成配置。

| 参数名称 | 描述 |
| :--- | :--- |
| `appKey` | 必填位置参数，类型为 `String`。在环信控制台创建应用后获得的唯一标识，格式通常为 `orgName#appName`。 |
| `autoAcceptGroupInvitation` | 设置是否自动接受群组邀请。<br/> - `true`：自动接受群组邀请。<br/> -（默认）`false`：不自动接受群组邀请。 |
| `acceptInvitationAlways` | 设置是否自动接受好友邀请。<br/> - `true`：自动接受好友邀请。<br/> -（默认）`false`：不自动接受好友邀请。 |
| `deleteMessagesAsExitChatRoom` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/> -（默认）`true`：删除。<br/> - `false`：保留。 |
| `deleteMessagesAsExitGroup` | 设置主动或被动退出群组时是否删除该群组的本地消息。<br/> -（默认）`true`：删除。<br/> - `false`：保留。 |
| `isChatRoomOwnerLeaveAllowed` | 设置是否允许聊天室所有者离开聊天室。<br/> -（默认）`true`：允许；离开后所有者仍保留聊天室权限，但不再接收聊天室消息。<br/> - `false`：不允许。 |
| `dataSyncType` | 设置登录后自动同步的数据类型，类型为 `int?`。通过 `ChatDataSyncType.conversations`、`contacts`、`joinedGroups` 按位或组合；`ChatDataSyncType.none` 表示不同步。默认 `null`，详见 [配置方式](#配置方式)。 |
| `enableEmptyConversation` | 设置从本地数据库加载会话时是否包含空会话。<br/> - `true`：包含空会话。<br/> -（默认）`false`：不包含空会话。 |
| `requireDeliveryAck` | 设置是否发送消息送达回执，默认 `false`。|
| `enableUserInfo` | 设置是否开启用户信息自动管理，默认 `false`。详见 [用户信息自动管理](userinfo_provider.html)。 |
| `apnsCertName` | iOS APNs 推送证书名称，类型为 `String?`，默认 `null`。配置普通 APNs 推送时使用，必须在初始化前设置，运行期间不可修改。 |
| `pushKitCertName` | iOS PushKit 推送证书名称，类型为 `String?`，默认 `null`。配置 VoIP 推送时使用，必须在初始化前设置，运行期间不可修改。 |
| `debugMode` | 设置是否开启调试日志，默认 `false`。 |
| `extSettings` | 可选扩展配置，类型为 `Map<String, dynamic>?`。例如，通过 `ExtSettings.kDisableIosEnterBackground` 控制 iOS 插件的生命周期事件转发，见下文。 |

**iOS 生命周期事件转发**

Flutter SDK 支持通过 `ExtSettings.kDisableIosEnterBackground` 控制 Flutter iOS 插件是否自动向 iOS 原生 SDK 转发应用进入后台和返回前台的生命周期事件：

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

:::tip
该配置仅对 iOS 生效，只控制插件是否自动转发生命周期事件，不会禁用系统的前后台切换。通常建议保持默认行为，仅在业务需要自行接管原生 SDK 生命周期处理时关闭自动转发。
:::

## 初始化后设置监听

初始化完成后，可以注册连接状态监听和消息监听，以感知 SDK 与 IM 服务器的连接变化及新消息。应在发起登录前完成注册，避免遗漏登录、数据库打开或数据同步事件。每个处理器使用业务自定义的唯一 ID 管理，使用相同 ID 再次添加时会覆盖此前的处理器。

```dart
const String connectionHandlerId = 'connection_handler';
const String messageHandlerId = 'message_handler';

// 在初始化完成后、登录前调用。
void addChatEventHandlers() {
  ChatClient.getInstance.addConnectionEventHandler(
    connectionHandlerId,
    ConnectionEventHandler(
      onConnected: () {
        // SDK 已连接到 IM 服务器，不表示所有列表数据已经同步完成。
        debugPrint('Connected to the IM server');
      },
      onDisconnected: (int? errorCode, LoginExtensionInfo? info) {
        // 根据断开原因区分网络中断与被登出，不能一律主动重登。
        // info 仅在原生事件携带登录设备信息时有值。
        debugPrint('Disconnected: $errorCode, device: ${info?.deviceName}');
      },
      onTokenDidExpire: () {
        // Token 已过期，业务侧需获取有效 Token 并重新登录。
        // Token 过期通过此事件单独通知，不触发 onDisconnected。
        debugPrint('Token expired');
      },
    ),
  );

  ChatClient.getInstance.chatManager.addEventHandler(
    messageHandlerId,
    ChatEventHandler(
      onMessagesReceived: (List<ChatMessage> messages) {
        // 收到普通消息后，遍历消息列表并更新业务数据。
        for (final ChatMessage message in messages) {
          debugPrint('Received message: ${message.msgId}');
        }
      },
    ),
  );
}

// 页面或业务模块不再需要监听时，使用对应的 ID 移除。
void removeChatEventHandlers() {
  ChatClient.getInstance.removeConnectionEventHandler(connectionHandlerId);
  ChatClient.getInstance.chatManager.removeEventHandler(messageHandlerId);
}
```

:::tip
1. 如需监听登录后自动同步数据的开始和完成状态，详见 [监听同步状态](#监听同步状态)。
2. SDK 支持在在线登录完成前读取当前用户的本地缓存数据。应用可通过 `ConnectionEventHandler.onDatabaseOpened` 监听数据库打开结果；`error == null` 表示打开成功，但不表示在线登录或服务端数据同步完成。具体用法详见 [登录完成前使用本地数据库](login.html#登录完成前使用本地数据库)。
:::

## 设置登录后自动同步数据

### 同步的数据

SDK 支持在初始化前通过 `ChatOptions.dataSyncType` 配置登录后自动同步的数据类型。用户登录成功后，SDK 按配置同步服务端数据并更新本地缓存或数据库。该过程与登录操作本身完成、连接成功和数据库打开是不同阶段，不能仅在登录接口返回后就认为列表已同步完成。

当前支持同步会话列表、好友列表以及当前用户已加入的群组列表。各数据类型的配置项、本地读取方式如下：

| 配置项 | 登录后自动同步内容 | 本地读取方式 | 说明 |
| :--- | :--- | :--- | :--- |
| `ChatDataSyncType.conversations` | 会话列表 | `ChatClient.getInstance.chatManager.loadAllConversations()` | 返回 `Future<List<ChatConversation>>`。先读取内存，内存中没有时从本地数据库加载，不会主动拉取服务端会话列表。 |
| `ChatDataSyncType.contacts` | 好友列表 | `ChatClient.getInstance.contactManager.getAllContacts()` | 返回 `Future<List<ChatContact>>`。从本地数据库读取好友对象列表，不是 `List<String>`；对象包含用户 ID、备注等信息，不保证已获取所有好友的昵称和头像。 |
| `ChatDataSyncType.joinedGroups` | 当前用户已加入的群组列表 | `ChatClient.getInstance.groupManager.getJoinedGroups()` | 返回 `Future<List<ChatGroup>>`，从 SDK 本地缓存读取群组列表。 |

如需检查 Flutter 侧保存的初始化配置，可读取 `ChatClient.getInstance.options?.dataSyncType`。该属性仅用于读取配置，不会触发数据同步。

### 配置方式

必须在调用 `ChatClient.getInstance.init` 前通过 `ChatOptions` 设置 `dataSyncType`。初始化完成后创建新的配置对象或调用 `copyWith`，不会自动更新本次已初始化的原生 SDK。

配置规则如下：

- 未设置 `dataSyncType` 或传入 `null` 时，Flutter 桥接不覆盖原生默认值。Flutter SDK 5.0.0 所依赖的 Android 原生 SDK 5.0.0 默认不同步任何数据类型，iOS 原生 SDK 5.0.0 默认同步会话列表。
- 需要同步一种或多种数据时，使用 `ChatDataSyncType` 常量；多个类型通过按位或运算符 `|` 组合。为保证两端行为一致，建议显式配置所需类型。
- 传入 `ChatDataSyncType.none`（值为 `0`）表示不自动同步。`null` 不等同于 `none`，也不能使用 Android 的空集合写法。

以下示例表示登录成功后自动同步会话列表、好友列表和当前用户已加入的群组列表：

```dart
Future<void> initializeChatSdkWithDataSync() async {
  WidgetsFlutterBinding.ensureInitialized();

  final ChatOptions options = ChatOptions.withAppKey(
    'your-org#your-app',
    // 按位或组合需要自动同步的数据类型。
    dataSyncType: ChatDataSyncType.conversations |
        ChatDataSyncType.contacts |
        ChatDataSyncType.joinedGroups,
  );

  await ChatClient.getInstance.init(options);
  // 随后注册连接、消息及同步监听，再由业务发起 Token 登录。
}
```

如果只需要同步会话列表，在创建初始化配置时仅传入 `conversations`：

```dart
final ChatOptions options = ChatOptions.withAppKey(
  'your-org#your-app',
  dataSyncType: ChatDataSyncType.conversations,
);
```

如果需要关闭登录后的自动列表数据同步，在初始化前配置 `none`：

```dart
final ChatOptions options = ChatOptions.withAppKey(
  'your-org#your-app',
  dataSyncType: ChatDataSyncType.none,
);
```

### 监听同步状态

SDK 通过 `ConnectionEventHandler.onDataSyncStart` 和 `onDataSyncFinish` 通知某类数据同步的开始和结束。应在初始化完成后、调用登录接口前注册监听。

- `onDataSyncStart(int type)`：某类数据开始同步时触发。`type` 为数据同步类型的位掩码，使用 `ChatDataSyncType` 常量进行按位判断。
- `onDataSyncFinish(int type, ChatError? error)`：某类数据同步结束时触发。`error == null` 表示成功，否则通过 `error.code` 和 `error.description` 处理失败情况。

示例代码如下：

```dart
const String syncHandlerId = 'data_sync_handler';

void addDataSyncHandler() {
  ChatClient.getInstance.addConnectionEventHandler(
    syncHandlerId,
    ConnectionEventHandler(
      onDataSyncStart: (int type) {
        // type 为位掩码，不要与 Android 的枚举对象比较。
        debugPrint('Data sync started: $type');
      },
      onDataSyncFinish: (int type, ChatError? error) async {
        if (error != null) {
          // 同步失败，不将现有本地缓存视为本次服务端同步成功的结果。
          debugPrint('Data sync failed: $type, '
              '${error.code}, ${error.description}');
          return;
        }

        // 只读取本次同步成功的数据类型，复用下一节的读取函数。
        await readSynchronizedData(type);
      },
    ),
  );
}

// 不再需要同步状态监听时移除，避免重复回调。
void removeDataSyncHandler() {
  ChatClient.getInstance.removeConnectionEventHandler(syncHandlerId);
}
```

此处使用与前文不同的处理器 ID，避免覆盖连接状态监听。也可以在同一个 `ConnectionEventHandler` 中统一处理连接、数据库打开和数据同步事件。

### 登录后读取同步结果

收到对应类型的 `onDataSyncFinish` 且 `error == null` 后，通过相应 Manager 从 SDK 本地缓存或数据库读取同步结果，再刷新界面。

```dart
// 由上一节同步成功回调调用；使用位掩码分别判断各类数据。
Future<void> readSynchronizedData(int type) async {
  try {
    if ((type & ChatDataSyncType.conversations) != 0) {
      // 读取本地会话列表，不主动发起服务端会话列表拉取。
      final List<ChatConversation> conversations =
          await ChatClient.getInstance.chatManager.loadAllConversations();
      debugPrint('Local conversations: ${conversations.length}');
    }

    if ((type & ChatDataSyncType.contacts) != 0) {
      // 读取本地好友对象；需要用户 ID 时读取 ChatContact.userId。
      final List<ChatContact> contacts =
          await ChatClient.getInstance.contactManager.getAllContacts();
      debugPrint('Local contact IDs: ${contacts.map((item) => item.userId)}');
    }

    if ((type & ChatDataSyncType.joinedGroups) != 0) {
      // 读取当前用户已加入的本地群组列表。
      final List<ChatGroup> joinedGroups =
          await ChatClient.getInstance.groupManager.getJoinedGroups();
      debugPrint('Local joined groups: ${joinedGroups.length}');
    }
  } on ChatError catch (error) {
    // 本地读取失败与服务端数据同步失败是不同阶段，分别处理。
    debugPrint('Read local data failed: ${error.code}, ${error.description}');
  } catch (error) {
    // 处理返回数据解析等其他异常，避免异步回调中的异常未被处理。
    debugPrint('Read/parse local data failed: $error');
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`withAppKey`](#初始化-sdk) | `ChatOptions` | 使用 App Key 创建初始化配置。 |
| [`init`](#初始化-sdk) | `ChatClient` | 初始化 Flutter SDK，返回 `Future<void>`。 |
| [`dataSyncType`](#配置方式) | `ChatOptions` | 配置登录后自动同步的数据类型，必须在初始化前设置。 |
| [`options`](#同步的数据) | `ChatClient` | 获取 Flutter 侧保存的初始化配置，不是原生默认配置查询接口。 |
| [`addConnectionEventHandler`](#初始化后设置监听) | `ChatClient` | 添加连接事件处理器，也可用于监听数据库打开和数据同步状态。 |
| [`removeConnectionEventHandler`](#初始化后设置监听) | `ChatClient` | 按 ID 移除连接事件处理器。 |
| [`addEventHandler`](#初始化后设置监听) | `ChatManager` | 添加消息事件处理器。 |
| [`removeEventHandler`](#初始化后设置监听) | `ChatManager` | 按 ID 移除消息事件处理器。 |
| [`onDataSyncStart`](#监听同步状态) | `ConnectionEventHandler` | 通知指定类型的数据开始同步。 |
| [`onDataSyncFinish`](#监听同步状态) | `ConnectionEventHandler` | 通知指定类型的数据同步结束，`error == null` 表示成功。 |
| [`onDatabaseOpened`](#初始化后设置监听) | `ConnectionEventHandler` | 通知指定用户的本地数据库打开结果，不代表在线登录或数据同步成功。 |
| [`loadAllConversations`](#登录后读取同步结果) | `ChatManager` | 异步读取本地会话列表。 |
| [`getAllContacts`](#登录后读取同步结果) | `ChatContactManager` | 异步从本地数据库读取好友对象列表。 |
| [`getJoinedGroups`](#登录后读取同步结果) | `ChatGroupManager` | 异步读取本地已加入群组列表。 |
