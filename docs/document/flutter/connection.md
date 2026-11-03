# 连接

## 功能说明

应用客户端成功连接到环信服务器后，才能使用即时通讯 SDK 的消息收发及需要访问服务器的相关功能。

调用 `ChatClient.getInstance.loginWithToken` 登录后，SDK 会建立并维护长连接。连接运行期间，SDK 通过 `ConnectionEventHandler` 通知应用连接状态、异常退出、Token 生命周期、本地数据库打开、离线消息同步和登录后自动数据同步等状态变化。

关于登录、登出和登录状态，详见[登录](login.html)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 已获取有效的用户 ID 和用户 Token。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 连接生命周期

Flutter SDK 的连接生命周期通常包括以下阶段：

1. 调用 `ChatClient.getInstance.init` 初始化 SDK。Flutter SDK 5.x 初始化后不会自动登录。
2. 调用 `addConnectionEventHandler` 注册连接监听，建议在登录前完成注册。
3. 调用 `loginWithToken` 登录 SDK 并建立长连接。
4. 用户本地数据库打开后触发 `onDatabaseOpened`。该回调仅表示本地数据库可用，不表示在线连接成功或服务端数据同步完成。
5. 成功连接服务器后触发 `onConnected`。SDK 随后按初始化配置同步离线消息和业务数据。
6. 连接中断后，SDK 根据断开原因自动重连，或通过 `onDisconnected` 通知应用处理不可恢复的异常退出。
7. 调用 `logout` 主动登出并关闭当前连接。

```dart
const String connectionHandlerId = 'app-connection';

ChatClient.getInstance.addConnectionEventHandler(
  connectionHandlerId,
  ConnectionEventHandler(
    onConnected: () {
      // SDK 已成功连接到服务器。
    },
    onDisconnected: (errorCode, info) {
      // 根据 errorCode 区分可恢复的连接中断与异常退出。
    },
  ),
);

try {
  await ChatClient.getInstance.loginWithToken(userId, token);
  // 登录成功。业务数据同步可能仍在进行。
} on ChatError catch (e) {
  // 登录失败，根据错误码和错误信息处理。
  debugPrint('登录失败：$e');
}
```

## 获取连接状态

调用 `ChatClient.getInstance.isConnected` 查询 SDK 当前是否已连接到服务器：

```dart
final bool connected = await ChatClient.getInstance.isConnected();
```

| API | 说明 |
| :--- | :--- |
| `isConnected()` | 返回 SDK 当前是否已连接到服务器。 |
| `currentUserId` | 返回 Dart 侧缓存的当前用户 ID；不能单独用于判断是否已登录。 |
| `getCurrentUserId()` | 从原生 SDK 获取当前用户 ID 并更新 Dart 侧缓存；不能替代业务侧登录态管理。 |

:::tip
1. 连接状态与登录状态含义不同。弱网或切换网络时，用户可能仍处于登录状态，但长连接暂时断开并由 SDK 自动重连。应用应自行维护登录态，并结合连接回调驱动 UI，不要只依赖一次状态查询。
2. 请勿使用 `currentUserId == null` 判断是否已登录。Android 在未登录时也可能返回本地持久化的上次登录用户；而且 `currentUserId` 是 Dart 侧缓存，被踢下线或 Token 过期时不会自动清空。业务侧应安全保存用户凭证，并在异常退出分支更新自身登录态。
:::

## 监听连接变化

通过 `ChatClient.getInstance.addConnectionEventHandler` 注册 `ConnectionEventHandler`。建议在调用 `loginWithToken` 前注册，以免遗漏登录建连和后续同步状态。每个监听使用唯一 ID；不再需要时，传入同一 ID 调用 `removeConnectionEventHandler`。

### 回调说明

| 回调 | 触发时机 | 说明 |
| :--- | :--- | :--- |
| `onConnected()` | SDK 成功连接到服务器时触发。 | 首次登录连接成功或自动重连成功后均可能触发。 |
| `onDisconnected(int?, LoginExtensionInfo?)` | SDK 与服务器断开连接或因不可恢复原因退出时触发。 | `errorCode` 表示原因；断开不一定表示已退出。可恢复场景由 SDK 自动重连。仅其他设备登录导致退出时，`info` 可能携带新设备信息。 |
| `onDatabaseOpened(String, ChatError?)` | 指定用户的本地数据库打开完成时触发。 | `error == null` 表示成功。该事件不表示在线连接或数据同步已完成。 |
| `onTokenWillExpire()` | Token 即将过期时触发。 | 获取新 Token，并调用 `renewToken` 续期。 |
| `onTokenDidExpire()` | Token 已过期时触发。 | 用户已退出，需要获取新 Token 后重新登录；该场景不会再触发 `onDisconnected`。 |
| `onOfflineMessageSyncStart()` | SDK 开始从服务器同步离线消息时触发。 | 没有离线消息时可能不触发。 |
| `onOfflineMessageSyncFinish()` | SDK 完成离线消息同步时触发。 | 同步过程中若连接中断，可能不触发。 |
| `onDataSyncStart(int)` | 登录后某类业务数据开始自动同步时触发。 | `type` 是 `ChatDataSyncType` 位掩码，表示会话、好友或已加入群组等数据类型。 |
| `onDataSyncFinish(int, ChatError?)` | 某类业务数据同步结束时触发。 | `error == null` 表示同步成功。 |

### 示例代码

```dart
const String connectionHandlerId = 'app-connection';

ChatClient.getInstance.addConnectionEventHandler(
  connectionHandlerId,
  ConnectionEventHandler(
    onConnected: () {
      // 连接成功。
    },
    onDisconnected: (errorCode, info) {
      // 在“连接恢复与异常处理”一节所示的退出码集合中判断。
    },
    onDatabaseOpened: (username, error) {
      if (error == null) {
        // username 对应的本地数据库已打开，可读取本地缓存。
      }
    },
    onTokenWillExpire: () async {
      final newToken = await fetchTokenFromAppServer();
      await ChatClient.getInstance.renewToken(newToken);
    },
    onTokenDidExpire: () {
      // Token 已过期，更新业务登录态并返回登录页。
    },
    onOfflineMessageSyncStart: () {
      // 开始同步离线消息。
    },
    onOfflineMessageSyncFinish: () {
      // 离线消息同步完成。
    },
    onDataSyncStart: (type) {
      // type 对应的数据开始自动同步。
    },
    onDataSyncFinish: (type, error) {
      if (error != null) return;

      if ((type & ChatDataSyncType.conversations) != 0) {
        // 会话数据已同步，刷新会话列表。
      }
      if ((type & ChatDataSyncType.contacts) != 0) {
        // 好友数据已同步，刷新联系人列表。
      }
      if ((type & ChatDataSyncType.joinedGroups) != 0) {
        // 已加入群组数据已同步，刷新群组列表。
      }
    },
  ),
);

// 不再需要监听时移除。
ChatClient.getInstance.removeConnectionEventHandler(connectionHandlerId);
```

:::tip
不要在连接回调中执行大量耗时操作。更新 Flutter UI 前，还应确认相关页面仍处于挂载状态。
:::

## 连接恢复与异常处理

### 自动重连

登录成功后，如果因网络信号弱、网络切换或其他可恢复原因导致连接中断，SDK 会自动尝试重连，无需应用手动调用登录接口。

连接断开时触发 `onDisconnected`；重连成功后触发 `onConnected`。Flutter SDK 5.0.0 不提供独立的 `onConnecting` 或 `onReconnectFailed` 回调，应用应结合这两个回调、`isConnected()` 以及网络状态展示连接状态。

以下情况不会仅靠自动重连恢复，应用需要根据回调错误码处理账号、Token、设备或服务限制：

- 用户主动调用 `logout`。
- Token 无效或已过期。
- 账号被删除、在其他设备登录或被强制退出。
- 登录设备数、应用活跃用户数或服务配额达到限制。

### 连接断开和异常退出处理

Flutter SDK 5.x 将断开回调统一为 `onDisconnected(int? errorCode, LoginExtensionInfo? info)`。`errorCode` 与原生 SDK 错误码一致并原样透传，未列出的原因码也可能收到。

`ChatDisconnectErrorCode` 将本版本已知原因分为两类：

- **退出原因**：本地登录态已失效，需要重新登录。
- **连接原因**：连接暂时中断，但用户仍处于登录态，SDK 会自动重连。

| 类型 | 常量（错误码） | 说明 |
| :--- | :--- | :--- |
| 退出 | `APP_ACTIVE_NUMBER_REACH_LIMITATION`（8） | 应用的日活跃或月活跃用户数达到上限。 |
| 退出 | `INVALID_TOKEN`（104） | Token 与登录信息不匹配。 |
| 退出 | `INVALID_PARAM`（110） | 建立连接所用的参数无效。 |
| 退出 | `USER_NOT_FOUND`（204） | 用户不存在。 |
| 退出 | `USER_LOGIN_ANOTHER_DEVICE`（206） | 当前账号在其他设备登录。仅该原因可能通过 `info` 携带新设备名称和扩展信息。 |
| 退出 | `USER_REMOVED`（207） | 当前账号已被服务器删除。 |
| 退出 | `USER_BIND_ANOTHER_DEVICE`（213） | 账号已与其他设备绑定。 |
| 退出 | `USER_LOGIN_TOO_MANY_DEVICES`（214） | 登录设备数超过限制。 |
| 退出 | `USER_KICKED_BY_CHANGE_PASSWORD`（216） | 当前账号密码已被修改。 |
| 退出 | `USER_KICKED_BY_OTHER_DEVICE`（217） | 当前账号被其他设备、API 或控制台强制退出。 |
| 退出 | `USER_DEVICE_CHANGED`（220） | 登录设备发生变化，需要重新登录。 |
| 退出 | `SERVER_GET_DNSLIST_FAILED`（304） | 无法获取可用的服务器地址。 |
| 退出 | `SERVER_SERVICE_RESTRICTED`（305） | 应用服务被服务器禁用。 |
| 连接 | `NETWORK_ERROR`（2） | 网络不可用。iOS 通用网络断开通常返回 `null`。 |
| 连接 | `EXCEED_SERVICE_LIMIT`（4） | 应用的用户数或服务额度超限。 |
| 连接 | `SERVER_NOT_REACHABLE`（300） | 连接超时、DNS 解析失败或连接被拒绝；弱网下较常见。 |
| 连接 | `SERVER_UNKNOWN_ERROR`（303） | IO 错误或连接流异常关闭。 |
| 连接 | `SERVER_DECRYPTION_FAILED`（306） | 传输解密失败。 |

:::warning
请勿使用“原因码不等于 2 即视为强制下线”之类的规则。弱网下常见原因码还包括 `300` 和 `303`。平台未提供原因时 `errorCode` 为 `null`，也应按连接层事件处理，不要据此跳转登录页。
:::

可以维护退出原因集合，统一处理异常退出：

```dart
const Set<int> disconnectLogoutCodes = <int>{
  ChatDisconnectErrorCode.APP_ACTIVE_NUMBER_REACH_LIMITATION,
  ChatDisconnectErrorCode.INVALID_TOKEN,
  ChatDisconnectErrorCode.INVALID_PARAM,
  ChatDisconnectErrorCode.USER_NOT_FOUND,
  ChatDisconnectErrorCode.USER_LOGIN_ANOTHER_DEVICE,
  ChatDisconnectErrorCode.USER_REMOVED,
  ChatDisconnectErrorCode.USER_BIND_ANOTHER_DEVICE,
  ChatDisconnectErrorCode.USER_LOGIN_TOO_MANY_DEVICES,
  ChatDisconnectErrorCode.USER_KICKED_BY_CHANGE_PASSWORD,
  ChatDisconnectErrorCode.USER_KICKED_BY_OTHER_DEVICE,
  ChatDisconnectErrorCode.USER_DEVICE_CHANGED,
  ChatDisconnectErrorCode.SERVER_GET_DNSLIST_FAILED,
  ChatDisconnectErrorCode.SERVER_SERVICE_RESTRICTED,
  202, // USER_AUTHENTICATION_FAILED，仅作平台后续行为变化的防御项。
};

ConnectionEventHandler(
  onConnected: () => setReconnecting(false),
  onDisconnected: (errorCode, info) {
    if (errorCode != null && disconnectLogoutCodes.contains(errorCode)) {
      if (errorCode ==
          ChatDisconnectErrorCode.USER_LOGIN_ANOTHER_DEVICE) {
        showKickedByDevice(info?.deviceName, info?.ext);
      }
      updateAppLoginState(false);
      backToLogin();
      return;
    }

    // 连接层事件，SDK 会自动重连。
    setReconnecting(true);
  },
  onTokenDidExpire: () {
    // Token 过期是另一个退出事件通道，不会触发 onDisconnected。
    updateAppLoginState(false);
    backToLogin();
  },
);
```

:::warning
异常退出时，平台可能先派发事件、后完成底层登出，而且事件为异步派发。请勿在 `onDisconnected` 或 `onTokenDidExpire` 内依赖 `isConnected()`、`currentUserId` 等状态反推是否已退出，也不要在回调中发起依赖登录态的 API 调用。
:::

### Token 生命周期

SDK 根据登录 Token 的有效期触发以下回调：

- `onTokenWillExpire`：Token 即将过期。建议从应用服务器获取新 Token，并调用 `renewToken`。
- `onTokenDidExpire`：Token 已过期，用户已退出。获取新 Token 后重新调用 `loginWithToken`，而不是继续依赖自动重连。

```dart
onTokenWillExpire: () async {
  try {
    final newToken = await fetchTokenFromAppServer();
    await ChatClient.getInstance.renewToken(newToken);
  } on ChatError catch (e) {
    debugPrint('Token 续期失败：$e');
  }
},
onTokenDidExpire: () {
  updateAppLoginState(false);
  backToLogin();
},
```

### 离线消息和业务数据同步

登录成功或连接恢复后，如果服务端存在离线消息，SDK 会自动同步。可通过 `onOfflineMessageSyncStart` 和 `onOfflineMessageSyncFinish` 监听同步过程。

会话、好友和已加入群组等数据的登录后自动同步状态，则通过 `onDataSyncStart` 和 `onDataSyncFinish` 监听。两类同步回调含义不同，不应混用。

初始化时，可通过 `ChatOptions.dataSyncType` 显式配置同步范围：

```dart
final options = ChatOptions.withAppKey(
  appKey,
  dataSyncType: ChatDataSyncType.conversations |
      ChatDataSyncType.contacts |
      ChatDataSyncType.joinedGroups,
);
await ChatClient.getInstance.init(options);
```
// TODO
:::warning
对于 Flutter SDK 5.0.0，Flutter 层未设置 `dataSyncType` 时会使用原生平台默认值，而 Android SDK 5.0.0 与 iOS SDK 5.0.0 的默认值不同。若需要跨平台一致的同步行为，请显式配置该字段。`loginWithToken` 返回成功也不表示业务数据已经同步完成；应结合 `onDatabaseOpened` 展示本地缓存，并在 `onDataSyncFinish` 成功后刷新最新数据。
:::

## 最佳实践

- 在调用 `loginWithToken` 前注册 `ConnectionEventHandler`，避免遗漏连接、Token 和同步状态回调。
- Flutter SDK 5.x 初始化后不会自动登录。应用应安全管理用户 ID 和 Token，并主动调用 `loginWithToken`。
- 弱网断开后不要立即重复调用登录接口；可恢复场景由 SDK 自动重连。
- 使用 `isConnected()` 查询当前连接状态，并优先以回调驱动 UI。调用发送消息或加入群组、聊天室等 API 前无需手动判断连接状态，SDK 会执行连接校验并返回相应结果。
- 同时处理 `onDisconnected` 中的退出原因和 `onTokenDidExpire`，避免遗漏退出场景。
- 收到 `onTokenWillExpire` 后尽快续期 Token；收到 `onTokenDidExpire` 后获取新 Token 并重新登录。
- 不再需要监听时调用 `removeConnectionEventHandler`，避免重复回调。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`init`](#连接生命周期) | `ChatClient` | 初始化 Flutter SDK。 |
| [`loginWithToken`](#连接生命周期) | `ChatClient` | 使用用户 ID 和 Token 登录并建立连接。 |
| [`logout`](#连接生命周期) | `ChatClient` | 主动登出并关闭当前连接。 |
| [`isConnected`](#获取连接状态) | `ChatClient` | 查询 SDK 当前是否已连接到服务器。 |
| [`getCurrentUserId`](#获取连接状态) | `ChatClient` | 从原生 SDK 获取当前用户 ID；不能单独用于判断登录态。 |
| [`addConnectionEventHandler`](#监听连接变化) | `ChatClient` | 添加连接事件监听。 |
| [`removeConnectionEventHandler`](#监听连接变化) | `ChatClient` | 按监听 ID 移除连接事件监听。 |
| [`renewToken`](#token-生命周期) | `ChatClient` | 更新当前登录用户的 Token。 |
