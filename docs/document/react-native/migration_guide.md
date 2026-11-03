# 环信 React Native IM SDK 4.x 到 5.0.0 迁移指南

## 升级总览

React Native IM SDK 5.0.0 是一次源代码不兼容的大版本升级，主要涉及以下五个方面：

1. **版本号与原生 SDK 对齐**
   自 5.0.0 起，React Native SDK 的版本号与底层原生 SDK 保持一致（iOS 5.0.0 和 Android 5.0.0），不再单独维护 `1.x` 版本序列。
2. **iOS 集成方式变化**
   iOS 侧推荐使用 Swift Package Manager（SPM）集成。启用该路径需要宿主环境提供 `spm_dependency`，并使用 `USE_FRAMEWORKS=dynamic pod install`。其他情况，包括默认 `pod install` 和静态链接，继续通过 CocoaPods 集成原生 SDK。
3. **数据同步机制调整**
   登录后，SDK 可自动同步会话、好友和已加入的群组数据，并将数据保存到本地数据库，替代原先由应用主动调用服务端拉取接口。
4. **消息已读回执机制重构**
   已读回执由逐条发送调整为批量发送；清除本地未读数与向消息发送方发送已读回执相互独立；单聊和群聊使用统一的回执模型与回调。
5. **群组配置模型与历史 API 精简**
   `ChatGroupStyle` 枚举和 `ChatGroupOptions` 类拆分为 `ChatGroupConfigs` 与 `ChatGroupConfigsType`；移除一批服务端拉取接口、长期标记为废弃的接口及部分边缘能力。注册、举报、聊天室创建与解散、公开群列表等能力需由业务服务或服务端 REST API 实现；密码登录接口下线，仅保留 Token 登录。

:::tip
**升级要求：** React Native IM SDK 5.0.0 包含不兼容的 TypeScript API 变更，且依赖的原生 SDK 也包含不兼容的原生 API 变更。更新 SDK 后必须重新编译 iOS 和 Android 工程，并重点验证 Token 登录、数据同步、会话未读数、单聊和群聊已读回执、群组创建和配置更新、好友、附件消息及推送设置。
:::

## SDK 集成与版本要求

### 版本号与原生依赖对齐

本指南选取 `1.20.0`（原生 SDK 4.24.1）作为主要比较基线。基于原生 SDK 4.x 的 React Native SDK 还包括 `1.21.0`，从该版本升级时，应结合该版本已经提供的功能核对差异。更早的版本（例如 npm 上的 `1.18.0`，对应原生 SDK 4.22.1）同样适用，只需注意其原生依赖版本不同。

| 项目 | 4.x（以 `1.20.0` 为例） | 5.0.0 |
| :--- | :--- | :--- |
| React Native SDK 版本号 | `1.x`（如 `1.20.0`） | `5.0.0`，与原生 SDK 同步 |
| iOS 原生 SDK（`HyphenateChat`） | `~> 4.24.1` | `~> 5.0.0` |
| Android 原生 SDK（`io.hyphenate:hyphenate-chat`） | `4.24.1` | `5.0.0` |
| iOS 集成方式 | CocoaPods 为默认，SPM 已可选（`USE_FRAMEWORKS=dynamic`） | SPM 为推荐方式，需要满足动态链接等启用条件；默认 `pod install` 继续使用 CocoaPods。 |

### iOS 集成方式选择

`ChatSdk.podspec` 会根据宿主应用环境自动选择 `HyphenateChat` 的集成方式：

| 条件 | 集成方式 |
| :--- | :--- |
| 宿主环境提供 `spm_dependency`（React Native >= 0.75）且使用 `USE_FRAMEWORKS=dynamic pod install` | Swift Package Manager（推荐，满足左侧条件时启用） |
| 其他情况（React Native < 0.75、静态链接、默认 `pod install`） | CocoaPods（继续支持） |

使用 SPM 集成时执行：

```sh
cd ios && USE_FRAMEWORKS=dynamic pod install
```

- `pod install` 后请重新打开 `.xcworkspace`，让 Xcode 刷新 SPM 包状态。
- 首次安装需要联网下载 SPM 包及其二进制 xcframework。
- 静态链接（默认或 `USE_FRAMEWORKS=static`）下请勿使用 SPM 路径，否则可能遇到 duplicate symbols 或 undefined symbols 链接错误；此时会自动回退到 CocoaPods。
- 源码中的 `#import <HyphenateChat/EMClient.h>` 等导入方式在两种集成方式下均无需修改。

:::tip
CocoaPods trunk 将于 2026-12-02 进入只读状态，已发布版本仍可 `pod install`，但无法再从 trunk 获取新版本。这也是 5.0.0 起推荐 SPM 的原因之一。
:::

### 其他环境要求

- 插件自身的 Android 编译配置与 4.x 一致（`minSdkVersion 24`、`compileSdkVersion 36`）；`android/build.gradle` 相对 4.x 只改了原生 SDK 依赖版本。
- 但原生 SDK 5.0.0 的传递依赖有增加：Android 侧新增 `androidx.core:core:1.12.0`、`androidx.annotation:annotation:1.6.0` 和 `androidx.lifecycle:lifecycle-process:2.6.2`（4.24.1 只有 `cn.shengwang.infra:aosl`）。宿主工程如果 `compileSdk` 偏低，或锁定、排除了 androidx 版本，可能出现依赖解析或编译失败，需要相应放开。
- 本项目在 React Native 0.83（仅新架构，`newArchEnabled=true`）上完成验证。新架构要求在 4.x 已经存在（Android 侧固定按 TurboModule 注册，`IS_NEW_ARCHITECTURE_ENABLED = true`），5.0.0 延续该要求：宿主工程需要已经启用新架构。跨 React Native 大版本升级（如 0.72 到 0.83）时，JSON 数据传输契约与桥接方式不受影响，但需注意 React Native 自身的类型重命名等变化。

## 初始化与登录

### 自动登录移除

React Native SDK 5.0.0 不再提供自动登录配置和自动登录状态查询。应用冷启动后，需要自行管理用户 ID 与 Token，并在适当时机主动调用 `ChatClient#loginWithToken`。

| 删除的 API | 替代方式 | 接口说明 |
| :--- | :--- | :--- |
| `ChatOptions.autoLogin` | 无直接替代。应用启动后主动调用 `ChatClient#loginWithToken`。 | 配置 SDK 初始化后是否自动登录。 |
| `ChatClient#isLoginBefore` | 根据业务需要调用 `ChatClient#isConnected()` 或缓存登录状态。 | 查询 SDK 是否处于自动登录流程或自动登录状态。 |

`isConnected()` 表示是否连接至聊天服务器，不能替代应用对用户凭证和 Token 生命周期的管理。

### 密码登录下线

React Native SDK 5.0.0 仅保留 Token 登录方式。用户注册、密码校验和 Token 获取等账号管理操作需要 REST API 或由业务服务器完成。

| 删除的 API | 替代方式 | 接口说明 |
| :--- | :--- | :--- |
| `ChatClient#createAccount(userId, password)` | 无客户端替代；通过服务端 REST API 注册 IM 账号。 | 使用用户 ID 和密码注册 IM 账号。 |
| `ChatClient#login(userId, pwdOrToken, isPassword)` | `ChatClient#loginWithToken(userId, token)` | 使用用户 ID 和密码登录；4.x 中已废弃。 |
| `ChatClient#loginWithAgoraToken(userId, agoraToken)` | `ChatClient#loginWithToken(userId, token)` | 使用 Agora Token 登录；4.x 中已废弃。 |
| `ChatClient#renewAgoraToken(agoraToken)` | `ChatClient#renewToken(token)` | 更新当前登录会话的 Token，方法名和参数名同步调整。 |

`renewToken(token)` 仍用于异步更新当前登录会话的 Token，业务代码应优先使用该方法处理 Token 更新与错误。

自动登录下线后，Token 生命周期需要应用自己闭环管理：

1. 由业务服务器验证当前用户的业务身份，通过环信服务端 REST API 获取或按环信规则生成该用户的 User Token，并安全下发到客户端。
2. 监听 `ChatConnectEventListener#onTokenWillExpire`（Token 有效期剩余约 20% 时触发），向业务服务器申请新 Token 后调用 `renewToken(token)` 更新当前会话。
3. 监听 `onTokenDidExpire`，此时登录态已失效，需要重新获取 Token 并调用 `loginWithToken`。
4. 冷启动时读取本地保存的用户 ID 与 Token，主动调用 `loginWithToken`。

Token 登录示例如下，`userId` 和 `token` 为应用获取的用户 ID 和 User Token。本文各初始化示例为独立场景，应用中应合并所需配置，在首次初始化前统一设置。

```typescript
// 初始化：使用其他业务接口前调用
const options = ChatOptions.withAppKey({
  appKey: '<your app key>',
  // 登录后自动同步会话、好友和已加入的群组
  dataSyncType:
    ChatDataSyncType.Conversations |
    ChatDataSyncType.Contacts |
    ChatDataSyncType.JoinedGroups,
});
try {
  await ChatClient.getInstance().init(options);

  // 登录：应用自行管理 userId 与 token 的生命周期
  await ChatClient.getInstance().loginWithToken(userId, token);
} catch (error: unknown) {
  console.error('初始化或登录失败：', error);
}
```

### 登录与数据库打开解耦

React Native SDK 5.0.0 新增本地数据库打开回调。数据库打开后即可读取当前账号的本地数据，不必等待会话、好友或已加入群组的服务端同步完成，有助于加快冷启动时的首屏展示。

- `ChatConnectEventListener#onDatabaseOpened(username, errorCode)`：当前账号本地数据库打开完成时触发；`errorCode` 为 `0` 表示打开成功。

### 服务器强制下线回调收敛

4.x 中 8 类服务器强制下线场景（对应 9 个回调名，其中 `onUserDidLoginFromOtherDevice` 是已废弃的旧版）全部删除，统一为 `ChatConnectEventListener#onDisconnected(errorCode?, info?)`。

| 删除的回调 | 替代方式 | 回调说明 |
| :--- | :--- | :--- |
| `onUserDidLoginFromOtherDevice(deviceName?)`、`onUserDidLoginFromOtherDeviceWithInfo(params)` | `onDisconnected(errorCode, info)`，判断 `errorCode === ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE`（206） | 当前账号在其他设备登录；设备名和扩展信息从 `info` 读取。 |
| `onUserDidRemoveFromServer()` | `onDisconnected(errorCode, info)`，判断 `errorCode === ChatDisconnectErrorCode.USER_REMOVED_FROM_SERVER`（207） | 当前账号被服务端删除。 |
| `onUserDidForbidByServer()` | `onDisconnected(errorCode, info)`，判断 `errorCode === ChatDisconnectErrorCode.SERVER_SERVICE_RESTRICTED`（305） | 当前账号被服务端禁用。 |
| `onUserDidChangePassword()` | `onDisconnected(errorCode, info)`，判断 `errorCode === ChatDisconnectErrorCode.USER_KICKED_BY_CHANGE_PASSWORD`（216） | 当前账号密码被修改。 |
| `onUserDidLoginTooManyDevice()` | `onDisconnected(errorCode, info)`，判断 `errorCode === ChatDisconnectErrorCode.USER_LOGIN_TOO_MANY_DEVICES`（214） | 当前账号登录设备数超限。 |
| `onUserKickedByOtherDevice()` | `onDisconnected(errorCode, info)`，判断 `errorCode === ChatDisconnectErrorCode.USER_KICKED_BY_OTHER_DEVICE`（217） | 当前账号被其他设备踢下线。 |
| `onAppActiveNumberReachLimit()` | `onDisconnected(errorCode, info)`，判断 `errorCode === ChatDisconnectErrorCode.APP_ACTIVE_NUMBER_REACH_LIMIT`（8） | 应用日活或月活数量达到上限。 |
| `onUserAuthenticationFailed()` | `onDisconnected(errorCode, info)`，判断 `errorCode === ChatDisconnectErrorCode.USER_AUTHENTICATION_FAILED`（202） | 用户认证失败。 |

新增的 `ChatDisconnectErrorCode` 枚举取值与原生 SDK 的错误码一致，分为两组，**处理方式不同**：

- **退出原因**：本地登录态已失效，需要回到登录页重新登录。
  `APP_ACTIVE_NUMBER_REACH_LIMIT = 8`、`INVALID_TOKEN = 104`、`INVALID_PARAM = 110`、`USER_AUTHENTICATION_FAILED = 202`、`USER_NOT_FOUND = 204`、`USER_LOGIN_FROM_OTHER_DEVICE = 206`、`USER_REMOVED_FROM_SERVER = 207`、`USER_BIND_ANOTHER_DEVICE = 213`、`USER_LOGIN_TOO_MANY_DEVICES = 214`、`USER_KICKED_BY_CHANGE_PASSWORD = 216`、`USER_KICKED_BY_OTHER_DEVICE = 217`、`USER_DEVICE_CHANGED = 220`、`SERVER_GET_DNSLIST_FAILED = 304`、`SERVER_SERVICE_RESTRICTED = 305`。
- **连接原因**：用户仍处于登录态，SDK 会自动重连，**不要跳转登录页**。
  `NETWORK_ERROR = 2`、`EXCEED_SERVICE_LIMIT = 4`、`SERVER_NOT_REACHABLE = 300`、`SERVER_UNKNOWN_ERROR = 303`、`SERVER_DECRYPTION_FAILED = 306`。

处理该回调时需要注意：

- `errorCode` 由 SDK 原样透传并不过滤，枚举未列出的码（包括原生 SDK 后续新增的码）也会送达，默认按连接原因处理。
- 无 `errorCode` 表示平台未提供具体原因（例如 iOS 网络断开），同样按连接事件处理。
- `info.deviceName` 和 `info.ext` 仅在 `errorCode` 为 206 时携带。
- Token 过期导致的登出 **不会** 触发 `onDisconnected`，仍然只触发 `onTokenDidExpire`。接入方需要同时处理这两个回调才能覆盖所有登出场景。

```typescript
const listener: ChatConnectEventListener = {
  onDisconnected: (
    errorCode?: number,
    info?: { deviceName?: string; ext?: string }
  ) => {
    switch (errorCode) {
      case ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE:
        // 206：其他设备登录，info.deviceName / info.ext 携带登录设备信息
        // 登录态已失效，提示用户重新登录
        break;
      case ChatDisconnectErrorCode.APP_ACTIVE_NUMBER_REACH_LIMIT:
      case ChatDisconnectErrorCode.INVALID_TOKEN:
      case ChatDisconnectErrorCode.INVALID_PARAM:
      case ChatDisconnectErrorCode.USER_AUTHENTICATION_FAILED:
      case ChatDisconnectErrorCode.USER_NOT_FOUND:
      case ChatDisconnectErrorCode.USER_REMOVED_FROM_SERVER:
      case ChatDisconnectErrorCode.USER_BIND_ANOTHER_DEVICE:
      case ChatDisconnectErrorCode.USER_LOGIN_TOO_MANY_DEVICES:
      case ChatDisconnectErrorCode.USER_KICKED_BY_CHANGE_PASSWORD:
      case ChatDisconnectErrorCode.USER_KICKED_BY_OTHER_DEVICE:
      case ChatDisconnectErrorCode.USER_DEVICE_CHANGED:
      case ChatDisconnectErrorCode.SERVER_GET_DNSLIST_FAILED:
      case ChatDisconnectErrorCode.SERVER_SERVICE_RESTRICTED:
        // 其他退出原因：登录态已失效，按原因处理并重新登录
        break;
      case ChatDisconnectErrorCode.NETWORK_ERROR:
      case ChatDisconnectErrorCode.SERVER_NOT_REACHABLE:
        // 连接原因：保持登录态，等待 SDK 自动重连
        break;
      default:
        // 枚举未列出的码默认按连接原因处理
        break;
    }
  },
};
ChatClient.getInstance().addConnectionListener(listener);

function removeConnectionListener(): void {
  // 不再需要监听时，移除同一个监听器对象
  ChatClient.getInstance().removeConnectionListener(listener);
}
```

## 数据同步与服务端拉取 API 迁移

### 数据同步 API

React Native SDK 5.0.0 新增登录后自动数据同步机制。应用应在初始化 SDK 前通过 `ChatOptions.dataSyncType` 指定同步的数据类型，并通过 `ChatConnectEventListener` 监听同步进度。同步完成后，从各模块的本地接口读取数据。

| 所属类 | API 或配置 | 接口说明 |
| :--- | :--- | :--- |
| `ChatOptions` | `ChatDataSyncType` | 数据同步位掩码：`None = 0`、`Conversations = 1`、`Contacts = 2`、`JoinedGroups = 4`；多个类型可使用按位或组合。 |
| `ChatOptions` | `dataSyncType` | 设置登录后自动同步的数据类型；必须在 `ChatClient#init` 前配置。**未设置时沿用原生 SDK 默认值，而 iOS 与 Android 的默认值不一致**，建议显式配置。 |
| `ChatConnectEventListener` | `onDataSyncStart(type)` | 通知指定类型的数据开始同步。 |
| `ChatConnectEventListener` | `onDataSyncFinish(type, errorCode)` | 通知指定类型的数据同步结束；`errorCode` 为 `0` 表示成功。 |
| `ChatConnectEventListener` | `onDatabaseOpened(username, errorCode)` | 通知指定账号的本地数据库已经打开；该事件不表示任何服务端数据已经同步完成。`errorCode` 为 `0` 表示成功；**Android 原生回调不带错误码，桥接层固定回填 `0`**，只有 iOS 会返回真实的打开失败错误码。 |

:::tip
在 React Native SDK 5.0.0 中，`ChatOptions.dataSyncType` 不设置时，SDK 不会下发该字段，由原生 SDK 使用自身默认值决定同步范围：iOS 5.0.0 默认同步会话（`Conversations`），Android 5.0.0 默认不自动同步（`None`）。为保证双端行为一致，建议显式设置 `dataSyncType`。
:::

典型配置如下：

```typescript
const options = ChatOptions.withAppKey({
  appKey: '<your app key>',
  dataSyncType:
    ChatDataSyncType.Conversations |
    ChatDataSyncType.Contacts |
    ChatDataSyncType.JoinedGroups,
});
const listener: ChatConnectEventListener = {
  onDatabaseOpened: (username: string, errorCode: number) => {
    if (errorCode !== 0) {
      console.error('本地数据库打开失败：', username, errorCode);
      return;
    }
    // 本地数据库已可读，可先渲染上次登录的本地数据
  },
  onDataSyncStart: (type: ChatDataSyncType) => {
    // 指定类型的数据开始同步
  },
  onDataSyncFinish: (type: ChatDataSyncType, errorCode: number) => {
    if (errorCode === 0) {
      // 该类型数据同步完成，刷新对应列表
    } else {
      console.error('数据同步失败：', type, errorCode);
    }
  },
};
ChatClient.getInstance().addConnectionListener(listener);

try {
  // 在登录前完成同步配置和监听器注册
  await ChatClient.getInstance().init(options);
} catch (error: unknown) {
  ChatClient.getInstance().removeConnectionListener(listener);
  console.error('初始化失败：', error);
}

function removeDataSyncListener(): void {
  // 不再需要监听时，移除同一个监听器对象
  ChatClient.getInstance().removeConnectionListener(listener);
}
```

### 服务端拉取 API 迁移

原先主动拉取会话、好友和已加入群组，再在回调中刷新数据的方式，统一调整为 **配置数据同步范围、登录后自动同步、读取本地数据，并在 `onDataSyncFinish` 成功后刷新 UI**。

| 类 | 删除的 API | 5.0.0 推荐方式 |
| :--- | :--- | :--- |
| `ChatManager` | `fetchAllConversations`、`fetchConversationsFromServerWithPage`、`fetchConversationsFromServerWithCursor` | 这些接口用于从服务器拉取会话列表。改用本地 `getAllConversations`，并在 `onDataSyncFinish` 收到 `ChatDataSyncType.Conversations` 成功后刷新。 |
| `ChatManager` | `fetchPinnedConversationsFromServerWithCursor` | 该接口用于拉取服务端置顶会话。置顶状态随会话数据同步落地，改为读取本地 `ChatConversation.isPinned` 和 `pinnedTime`。 |
| `ChatManager` | `fetchConversationsByOptions`、`ChatConversationFetchOptions` | 该接口按条件拉取服务端会话，底层能力已整体移除且无客户端替代。改用本地 `getAllConversations` 后自行过滤。 |
| `ChatGroupManager` | `fetchJoinedGroupsFromServer` | 该接口分页拉取已加入群组。改用本地 `getJoinedGroups`，并在 `onDataSyncFinish` 收到 `ChatDataSyncType.JoinedGroups` 成功后刷新。 |
| `ChatContactManager` | `getAllContactsFromServer`、`fetchAllContacts`、`fetchContacts` | 这些接口从服务器拉取好友列表。5.0.0 已无好友列表服务端拉取入口；改用本地 `getAllContacts`（返回 `ChatContact` 列表）、`getAllContactsFromDB`（返回用户 ID 列表）或 `getContact`，并在 `onDataSyncFinish` 收到 `ChatDataSyncType.Contacts` 成功后刷新。 |
| `ChatOptions` | `enableAutoSyncContacts` | 该配置控制好友自动同步。改为在 `dataSyncType` 中包含 `ChatDataSyncType.Contacts`。 |

相应地，`ChatContactEventListener#onContactSyncStart` 和 `onContactSyncFinish` 已删除。请改用 `ChatConnectEventListener#onDataSyncStart` 和 `onDataSyncFinish`，并判断 `type` 是否包含 `ChatDataSyncType.Contacts`。详见 [监听器回调变化汇总](#监听器回调变化汇总)。

## 已读回执体系重构

消息已读回执由逐条发送调整为批量发送；是否需要回执通过 `ChatMessage.isNeedReadReceipt` 按消息设置；发送消息已读回执与清理会话未读数相互独立。旧 API 不提供兼容别名，属于不兼容变更。

### 发送消息已读回执与清除未读数

| 删除的 API | 5.0.0 替代 | 说明 |
| :--- | :--- | :--- |
| `ChatManager#sendMessageReadAck(message)` | `ChatManager#sendMessageReadReceipts(msgIds)` | 批量发送消息已读回执，单聊和群聊统一使用。 |
| `ChatManager#sendGroupMessageReadAck(...)` | `ChatManager#sendMessageReadReceipts(msgIds)` | 不再为群聊提供单独的逐条已读回执接口，也不再支持在群消息已读回执中携带自定义内容。 |
| `ChatManager#sendConversationReadAck(convId)` | `ChatManager#clearConversationUnreadMessageCount(convId)`，并按需调用 `sendMessageReadReceipts` | 旧接口发送会话级已读回执。5.0.0 将清除当前用户未读数与通知消息发送方拆为两个操作。 |
| `ChatManager#markAllConversationsAsRead()` | `ChatManager#clearAllConversationUnreadMessageCount()` | 清除所有本地会话的未读数，并尝试同步至当前用户的其他设备。 |
| `ChatManager#markMessageAsRead(convId, convType, msgId, isChatThread)`、`markAllMessagesAsRead(convId, convType, isChatThread)` | `ChatManager#clearConversationUnreadMessageCount(convId)` | 通过会话级接口清除本地未读数；不再由消息维度修改已读态。 |
| `ChatConversation#markMessageAsRead(msgId)`、`ChatConversation#markAllMessagesAsRead()` | `ChatManager#clearConversationUnreadMessageCount(convId)` | 通过会话级接口清除本地未读数；不再由 `ChatConversation` 修改消息已读态。 |
| `ChatOptions.requireAck` | 发送前设置 `ChatMessage.isNeedReadReceipt = true` | 删除全局已读回执开关，改为按消息指定是否需要已读回执。4.x 的 `requireAck` 默认为 `true`，但群消息仍需设置 `needGroupAck = true`（默认 `false`）。5.0.0 的 `isNeedReadReceipt` 默认为 `false`，单聊和群聊中需要回执的消息均须显式开启。 |

`sendMessageReadReceipts` 每次最多接收 50 条属于同一会话的消息。消息的 `isNeedReadReceipt` 必须为 `true`；该接口不会清除或修改会话的本地未读数。

两个批量回执接口（`sendMessageReadReceipts`、`getGroupMessageReadReceipts`）的桥接层都先按消息 ID 读取**本地消息对象**：本地不存在的 ID 会被静默忽略，若整批都取不到消息，原生返回 `INVALID_PARAM`（110）。调用前请确认这些消息已存在于本地。

`clearConversationUnreadMessageCount` 和 `clearAllConversationUnreadMessageCount` 会先清除本地未读数，再尝试同步至当前账号的其他设备。Promise 正常结束不代表其他设备已完成同步；接收端应以实际收到的多设备事件为准刷新界面。

```typescript
try {
  // 批量发送已读回执（消息须属于同一会话，且 isNeedReadReceipt 为 true）
  await ChatClient.getInstance().chatManager.sendMessageReadReceipts([
    'msgId1',
    'msgId2',
  ]);

  // 清除会话未读数，并尝试同步至其他设备；不会向消息发送方发送已读回执
  await ChatClient.getInstance().chatManager.clearConversationUnreadMessageCount(
    'convId'
  );
} catch (error: unknown) {
  console.error('发送已读回执或清除未读数失败：', error);
}
```

### 接收消息已读回执

React Native SDK 5.0.0 将单聊和群聊的实时已读回执统一通过 `ChatMessageEventListener#onMessageReadReceipts` 回调，不再分别使用单聊和群聊回调。

| 4.x 回调 | 5.0.0 回调 | 说明 |
| :--- | :--- | :--- |
| `ChatMessageEventListener#onMessagesRead(messages)` | `ChatMessageEventListener#onMessageReadReceipts(receipts)` | 接收单聊消息的已读回执。 |
| `ChatMessageEventListener#onGroupMessageRead(groupMessageAcks)` | `ChatMessageEventListener#onMessageReadReceipts(receipts)` | 接收群聊消息的已读回执。 |
| `ChatMessageEventListener#onConversationRead(from, to?)` | 无直接替代 | 会话级已读回执不再单独回调；消息级已读结果由 `onMessageReadReceipts` 通知。 |

5.0.0 新增 `ChatMessageReadReceipt`，用于统一描述消息已读回执：

- `msgId`：消息 ID。
- `convId`：会话 ID。
- `isPeerReceipt`：单聊回执的来源标识，`true` 表示来自对端用户，`false` 表示来自当前用户的其他登录设备。群聊回执汇总不应通过该字段判断已读成员或设备来源。
- `readCount`：群聊中该消息的已读人数；单聊恒为 `0`。

### 回执详情查询

| 4.x API | 5.0.0 API | 说明 |
| :--- | :--- | :--- |
| `ChatManager#fetchGroupAcks(msgId, groupId, startAckId, pageSize)` | `ChatManager#fetchGroupMessageReadReceipts(msgId, groupId, cursor?, pageSize?)` | 分页获取指定群消息的已读成员详情；返回 `ChatCursorResult<ChatGroupReadReceipt>`。4.x 的第 3 个参数 `startAckId` 改名为 `cursor`，与 `pageSize` 一起变为可选（默认 `''` 和 `20`）；下一页将上一页返回的游标传入 `cursor`。 |
| `ChatManager#groupAckCount(msgId)` | `ChatMessage.groupReadReceiptCount` | 群消息已读人数改为从消息对象读取，且为只读属性。 |
| `ChatMessage.groupReadCount`（返回 Promise 的只读 getter，内部调用 `groupAckCount`） | `ChatMessage.groupReadReceiptCount`，或 `ChatManager#getGroupMessageReadReceipts(msgIds)` | 该 getter 已删除。单条消息改用同步只读属性 `groupReadReceiptCount`；需要批量或最新数据时用 `getGroupMessageReadReceipts`。 |
| 无 | `ChatManager#getGroupMessageReadReceipts(msgIds)` | 从服务器批量获取群消息的已读回执汇总；每次最多传入 20 条消息，且所有消息必须属于同一群聊会话，返回 `ChatMessageReadReceipt` 列表。桥接层先读取本地消息对象，不代表汇总结果来自本地数据库。 |

回执详情模型由 `ChatGroupMessageAck` 替换为 `ChatGroupReadReceipt`，**字段名同时由下划线命名改为驼峰命名**：

- `msg_id` → `msgId`：群消息 ID。
- `ack_id` → `ackId`：已读回执 ID，也用于分页游标。
- `from`：发送已读回执的群成员，类型由字符串（用户 ID）改为 `ChatGroupMemberInfo` 对象；原先直接使用 `from` 的位置改为 `from.memberId`。
- `count`：已读回执数量。
- `timestamp`：发送已读回执的时间戳。
- 原 `content` 属性已移除，服务端不再下发 ACK 扩展内容。

`ChatGroupMemberInfo` 是 5.0.0 新增的模型，字段如下：

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `memberId` | `string` | 群成员的用户 ID。 |
| `joinedTimestamp` | `number` | 入群时间，Unix 时间戳（毫秒）。 |
| `role` | `ChatGroupPermissionType` | 成员角色：`Member`、`Admin`、`Owner`；未知为 `None`（`-1`）。 |
| `namecard?` | `string` | 群名片。 |
| `nickname?` | `string` | 昵称。 |
| `avatarUrl?` | `string` | 头像 URL。 |

:::tip
`fetchGroupMessageReadReceipts` 存在平台差异：`groupId` 参数在 Android 侧被忽略；返回结果的 `totalCount` 字段（`ChatCursorResult` 在 5.0.0 新增）**仅 iOS 提供**，Android 为 `undefined`，业务代码需按可选字段处理。
:::


:::warning
已知问题：React Native SDK 5.0.0 的 Android 端给 `fetchGroupMessageReadReceipts` 传入本地不存在的 `msgId` 会导致原生崩溃（`NullPointerException`）。调用前请通过 `ChatManager#getMessage` 确认目标消息在本地存在，并避免在请求完成前删除该消息。iOS 使用消息 ID 和群组 ID 发起服务端查询，不保证本地缺少消息时一定返回空结果。
:::

### ChatMessage 已读相关属性重命名

| 4.x 属性 | 5.0.0 属性 | 说明 |
| :--- | :--- | :--- |
| `ChatMessage.hasReadAck` | `ChatMessage.isPeerRead` | 判断消息对端是否已读；5.0.0 为只读属性。 |
| 可读写的 `ChatMessage.hasRead` | 只读的 `ChatMessage.isRead` | 属性名变更且 setter 被删除，消息的本地已读状态由 SDK 内部维护。 |
| `ChatMessage.needGroupAck` | `ChatMessage.isNeedReadReceipt` | 单聊和群聊均适用；发送消息前设置是否需要已读回执，是唯一保留的可写已读相关属性。 |
| `ChatMessage.groupAckCount` | `ChatMessage.groupReadReceiptCount` | 获取群聊消息的已读人数；5.0.0 为只读属性。 |
| `ChatMessage.groupReadCount`（返回 Promise 的 getter） | 已删除 | 该 getter 内部调用 `groupAckCount`；改用同步只读属性 `groupReadReceiptCount`。 |

:::tip
以上改名后的四个属性同时参与消息的序列化与反序列化，升级后从本地数据库或服务端读取的消息对象使用新属性名，旧属性名将读取到 `undefined`。请全局搜索并替换业务代码中的旧属性引用。
:::

:::warning
默认集成方式（npm 依赖）下无需关心桥接层，本节仅适用于基于本仓库自行维护原生 wrapper 的场景：桥接层使用的 JSON 字段名同步改名（`hasReadAck` → `isPeerRead`、`hasRead` → `isRead`、`needGroupAck` → `isNeedReadReceipt`、`groupAckCount` → `groupReadReceiptCount`），其中只有 `isNeedReadReceipt` 保留写入语义，其余三个字段的 setter 已移除。
:::

### 多设备事件

`ChatMultiDeviceEvent` 新增以下枚举值。当前账号在其他设备清除未读数后，当前设备通过 `ChatMultiDeviceEventListener#onConversationEvent(event, convId, convType)` 收到通知：

- `CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED = 65`：其他设备清除了指定会话的未读数。
- `ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED = 66`：其他设备清除了所有会话的未读数。

同时新增 `GROUP_UPDATE`（原生值 `34`）：用于通知当前账号在其他设备上更新了群组信息，通过 `ChatMultiDeviceEventListener#onGroupEvent(event, target, usernames)` 接收。`GROUP_METADATA_CHANGED`（`52`，4.x 已有）表示群成员自定义属性变化，与群组信息更新不是同一事件，不能作为 `GROUP_UPDATE` 的替代。

## 群组配置模型重构

React Native SDK 5.0.0 将群组可见性、入群审批和成员邀请权限从 `ChatGroupStyle` 单一枚举改为 `ChatGroupConfigs` 中的独立属性。**该调整不提供兼容层，升级时需要修改建群和群组配置代码。**

### ChatGroupStyle 与 ChatGroupConfigs 对照

| 4.x `ChatGroupStyle`（已删除） | 5.0.0 `ChatGroupConfigs` 配置 |
| :--- | :--- |
| `PrivateOnlyOwnerInvite` | `isPublic = false`，`allowInvites = false` |
| `PrivateMemberCanInvite` | `isPublic = false`，`allowInvites = true` |
| `PublicJoinNeedApproval` | `isPublic = true`，`joinApprovalRequired = true` |
| `PublicOpenJoin` | `isPublic = true`，`joinApprovalRequired = false` |

### ChatGroupOptions 与 ChatGroupConfigs 对照

| 4.x `ChatGroupOptions`（已删除） | 5.0.0 `ChatGroupConfigs` |
| :--- | :--- |
| `style: ChatGroupStyle` | `isPublic`、`joinApprovalRequired`、`allowInvites` 三个布尔属性；默认值均为 `false` |
| `maxCount: number = 200` | `maxCount: number = 200`，保持不变；iOS 侧头文件标注取值范围 `[3, 2000]` |
| `inviteNeedConfirm: boolean` | 属性和默认值保持不变（默认 `false`） |
| `ext?: string` | 属性保持不变 |

:::warning
**默认群类型发生变化。** 4.x 中 `new ChatGroupOptions({})` 未指定 `style` 时默认为 `PublicJoinNeedApproval`（公开群 + 入群需审批）；5.0.0 中 `new ChatGroupConfigs({})` 的三个布尔属性默认全为 `false`，等价于「私有群 + 仅群主可邀请」。原先依赖默认值建群的代码升级后会静默创建出另一种群，请显式设置 `isPublic`、`joinApprovalRequired`、`allowInvites`。
:::

其中 `allowInvites` 仅对私有群生效，`joinApprovalRequired` 仅对公开群生效。

### 相关 API 变化

| 4.x API | 5.0.0 API 或适配方式 |
| :--- | :--- |
| `ChatGroupManager#createGroup(options, groupName, desc?, inviteMembers?, inviteReason?)` | 已删除。使用 `ChatGroupManager#createGroupEx(params)`；位置参数改为单个 `params` 对象，`params.configs` 类型为 `ChatGroupConfigs`，并支持设置群头像（`groupAvatar`）。 |
| `createGroupEx` 的 `options?: ChatGroupOptions` | 方法名不变，参数改为 `configs: ChatGroupConfigs`，用于提交拆分后的群组配置。 |
| `ChatGroup.options` 的 `ChatGroupOptions` 类型 | `ChatGroup.configs` 的 `ChatGroupConfigs` 类型，用于读取群组配置；原 `options` 属性已删除。 |
| `ChatGroupOptions.isDisabled` | 提升为顶层的 `ChatGroup.isDisabled`，读取路径由 `group.options.isDisabled` 改为 `group.isDisabled`；该字段只读，`ChatGroupConfigs` 和 `ChatGroupConfigsType` 中都没有对应项。 |
| 无 | `ChatGroupManager#updateGroupConfigs(groupId, types, configs)`：创建群组后，按 `types` 指定的字段更新群组配置；**仅群主和管理员可调用**。 |
| 无 | `ChatGroupConfigsType`：包含 `AllowInvites = 1`、`MaxUsers = 2`、`InviteNeedConfirm = 4`、`JoinApprovalRequired = 8`、`IsPublic = 16`、`Ext = 32`，可按位或组合。 |

群名称、描述和头像不属于 `ChatGroupConfigsType`，仍分别使用 `changeGroupName`、`changeGroupDescription` 和 `updateGroupAvatar` 更新。

建群与更新群配置示例如下：

```typescript
// 创建群组：对应 4.x 的 ChatGroupStyle.PublicJoinNeedApproval
const configs = new ChatGroupConfigs({
  isPublic: true,
  joinApprovalRequired: true,
  allowInvites: false,
  maxCount: 200,
});
try {
  const group = await ChatClient.getInstance().groupManager.createGroupEx({
    groupName: 'groupName',
    configs,
    inviteMembers: ['userId1'],
  });

  // 创建后按类型更新群配置：只更新最大成员数和群扩展
  await ChatClient.getInstance().groupManager.updateGroupConfigs(
    group.groupId,
    ChatGroupConfigsType.MaxUsers | ChatGroupConfigsType.Ext,
    new ChatGroupConfigs({ maxCount: 500, ext: '{"key":"value"}' })
  );
} catch (error: unknown) {
  console.error('创建群组或更新群配置失败：', error);
}
```

## 设备管理与鉴权

4.x 的三个设备管理接口用最后一个参数 `isPassword?: boolean` 区分密码/Token 鉴权；5.0.0 删除了 `isPassword` 参数，第二个参数固定为 Token：

| 4.x API | 5.0.0 API | 接口说明 |
| :--- | :--- | :--- |
| `getLoggedInDevicesFromServer(userId, pwdOrToken, isPassword?)` | `getLoggedInDevicesFromServer(userId, token)` | 查询指定账号当前已登录的设备列表。 |
| `kickDevice(userId, pwdOrToken, resource, isPassword?)` | `kickDevice(userId, token, resource)` | 踢出指定账号的某一登录设备；通过设备列表获取 `resource`。 |
| `kickAllDevices(userId, pwdOrToken, isPassword?)` | `kickAllDevices(userId, token)` | 踢出指定账号的全部登录设备。 |

即使 4.x 已经用 Token 调用（`isPassword` 传 `false` 或省略），也需要删除多余的实参，否则 TypeScript 会因参数个数不匹配报错。

调用这些接口所需的目标用户 Token 应由可信的业务服务器提供，不应在客户端保存其他用户的密码。

## 推送与设备 Token

4.x 通过 `ChatOptions.pushConfig`（`ChatPushConfig` 对象）在初始化时下发厂商推送参数与证书名，运行时再用 `ChatClient#updatePushConfig(config)` 上报设备 Token。5.0.0 把推送配置拆成两部分：**初始化时配置 iOS 证书名**，**运行时绑定设备 Token**：

| 4.x API | 5.0.0 API | 接口说明 |
| :--- | :--- | :--- |
| `ChatOptions.pushConfig`（`ChatPushConfig`） | 已删除。iOS 证书名改用 `ChatOptions.apnsCertName` / `ChatOptions.pushKitCertName`；Android 厂商凭据改用 `ChatClient#bindDeviceToken` 的 `notifierName` 参数 | 初始化配置。 |
| `ChatClient#updatePushConfig(config)` | `ChatClient#bindDeviceToken({ deviceToken, notifierName? })` | 绑定设备推送 Token；`notifierName` 仅 Android 使用。 |
| `ChatPushConfig.deviceToken` | `ChatClient#bindDeviceToken` 的 `deviceToken` | 设备 Token，取值来源不变（厂商推送 SDK 或 APNs 回调）。 |
| `ChatPushConfig.deviceId`（iOS 为 APNs 证书名，Android 为厂商推送凭据） | iOS：`ChatOptions.apnsCertName`；Android：`ChatClient#bindDeviceToken` 的 `notifierName` | 该字段两端语义不同，5.0.0 按平台拆分到不同入口。 |

```typescript
try {
  // 初始化：iOS 证书名只能在 init 时下发
  await ChatClient.getInstance().init(
    ChatOptions.withAppKey({
      appKey: appKey,
      // 仅 iOS 生效，其他平台忽略
      apnsCertName: 'your_apns_cert_name',
    })
  );

  // 应用完成 Token 登录后，绑定 APNs 或厂商推送 SDK 返回的设备 Token
  await ChatClient.getInstance().loginWithToken(userId, token);
  await ChatClient.getInstance().bindDeviceToken({
    deviceToken: deviceToken,
    // Android 必填的厂商推送凭据（下例为 FCM Sender ID），iOS 忽略
    notifierName: 'your_fcm_sender_id',
  });
} catch (error: unknown) {
  console.error('初始化、登录或绑定推送 Token 失败：', error);
}
```

:::warning
**Android 厂商推送的初始化责任转移到业务侧**：4.x 由 `ChatOptions.pushConfig` 的 `manufacturer` / `deviceId` 自动构建原生 `EMPushConfig`（`enableFCM` / `enableHWPush` / `enableOppoPush` 等）；5.0.0 删除该入口后，厂商推送的依赖、manifest 配置与 `EMPushConfig` 初始化都需要在原生 Android 工程侧完成（可借助 `react-native-push-collection` 等推送插件），SDK 侧只负责用 `bindDeviceToken` 上报 Token。
:::

:::warning
**iOS 的证书名只能在初始化时设置，运行时不可修改**：`ChatOptions.apnsCertName` 与 `ChatOptions.pushKitCertName` 在 `ChatClient#init` 时下发给原生 `EMOptions`，原生在绑定 Token 时读取该属性。因此：

- `bindDeviceToken` 的 `notifierName` 在 **iOS 上被忽略**（不再写入证书名）。仅依赖 4.x 写法（在 `pushConfig.deviceId` 或 `updatePushConfig` 里传证书名）的应用，升级后必须在 `ChatOptions.apnsCertName` 中配置，否则绑定失败（原生返回 `EMErrorUserIllegalArgument`，提示证书名为空）；
- 证书名无法在运行中修改。需要变更时，应更新初始化配置，并在应用进程重新启动后生效；对已初始化的实例再次调用 `ChatClient#init` 不会更新原生证书配置。
:::

`notifierName` 在 Android 上是**厂商推送凭据**，不是厂商标识串，传空或传错会直接导致推送不可用（原生返回参数非法错误）：

| 平台 / 厂商 | 取值 | 4.x 对应来源 |
| :--- | :--- | :--- |
| iOS | 忽略该参数，证书名见 `ChatOptions.apnsCertName` | `ChatPushConfig.deviceId` 或 `updatePushConfig` 的 `deviceId` |
| Android FCM | Sender ID | `ChatPushConfig.deviceId` |
| Android 小米 / 魅族 | App ID | `ChatPushConfig.deviceId` |
| Android OPPO | App Key | `ChatPushConfig.deviceId` |
| Android 华为 HMS / 荣耀 | App ID | 原生工程配置 |
| Android VIVO | `App ID` + `#` + `App Key` | 原生工程配置 |

### PushKit（VoIP 推送）

VoIP 推送使用独立的 PushKit 证书与 PushKit token，与上面的普通推送（APNs / 厂商推送）不是同一套配置：`bindDeviceToken` 只处理普通推送 token，VoIP 推送需要下面这几个 **iOS 专用**入口。

相对本文选用的 `1.20.0` 基线，5.0.0 提供以下 iOS 推送证书配置及 PushKit Token 管理入口。`1.21.0` 已提供这些入口，从该版本升级时可继续按对应用途使用，不应将其视为 5.0.0 才首次提供的能力。

| API | 接口说明 |
| :--- | :--- |
| `ChatOptions.pushKitCertName` | 控制台配置的 **PushKit 证书名**（不是 APNs 证书名）。与 `apnsCertName` 一样，仅初始化时生效、运行时不可修改。 |
| `ChatClient#bindPushKitToken({ deviceToken })` | 绑定 PushKit token；`deviceToken` 传 `PKPushRegistry` 回调返回的十六进制 token。内部调用原生异步接口 `registerPushKitToken:completion:`。 |
| `ChatClient#unbindPushKitToken()` | 单独解绑 PushKit Token，不必退出登录。登出时的联动解绑条件见下文。 |

使用要点：

- **仅 iOS 有效**：TypeScript 层在其他平台直接返回、不做任何处理，跨平台代码无需自行判断平台；Android 侧的原生 SDK 没有 PushKit API，对应原生路由只会返回「不支持」错误（正常调用路径不可达）。
- PushKit token 需要业务在 iOS 工程侧自行实现 `PKPushRegistry`（`pushRegistry(_:didUpdate:for:)` 回调）拿到后传入；SDK 不负责申请 VoIP 推送权限，证书也需在控制台与原生工程侧配置完成。
- 原生 SDK 会先缓存有效的 Token 再尝试绑定：未登录时调用会失败（用户未登录），登录成功后 SDK 会根据缓存再次尝试绑定，但不保证绑定一定成功。
- 绑定失败最常见的原因是 `ChatOptions.pushKitCertName` 未配置或为空（原生返回 `EMErrorUserIllegalArgument`），其次是未登录（`EMErrorUserNotLogin`）。

在 iOS 端，已配置 `ChatOptions.apnsCertName` 且普通推送 Token 解绑成功时，`ChatClient#logout(true)` 会继续解绑 PushKit Token。`logout` 的 `unbindDeviceToken` 默认为 `true`；传 `false` 表示登出时不解绑。

:::notice
React Native SDK 5.x 的 iOS 端未配置 `ChatOptions.apnsCertName` 时，登出会跳过 Token 解绑，即使 `unbindDeviceToken` 为 `true`。若仅使用 PushKit 推送且需要在登出时解绑，请先调用 `ChatClient#unbindPushKitToken`，确认成功后再退出登录。
:::

```typescript
try {
  // iOS：初始化时配置 PushKit 证书名
  await ChatClient.getInstance().init(
    ChatOptions.withAppKey({
      appKey: appKey,
      apnsCertName: 'your_apns_cert_name',
      pushKitCertName: 'your_pushkit_cert_name',
    })
  );
  await ChatClient.getInstance().loginWithToken(userId, token);

  // 拿到 PKPushRegistry 回调的 Token 后绑定
  await ChatClient.getInstance().bindPushKitToken({
    deviceToken: voipPushToken,
  });
} catch (error: unknown) {
  console.error('初始化、登录或绑定 PushKit Token 失败：', error);
}

async function unbindVoipToken(): Promise<void> {
  try {
    // 不再使用 VoIP 推送时，单独解绑 PushKit Token
    await ChatClient.getInstance().unbindPushKitToken();
  } catch (error: unknown) {
    console.error('解绑 PushKit Token 失败：', error);
  }
}
```

## 其他删除的 API

### 无客户端替代

| 所属类 | 删除的 API | 接口说明 | 迁移建议 |
| :--- | :--- | :--- | :--- |
| `ChatClient` | `createAccount(userId, password)` | 注册 IM 账号。 | 通过服务端 REST API 完成注册。 |
| `ChatManager` | `reportMessage(msgId, tag, reason)` | 举报消息。 | 将消息 ID、举报类型和原因提交至 App Server。 |
| `ChatGroupManager` | `fetchPublicGroupsFromServer(pageSize, cursor?)` | 分页获取服务端公开群组列表。 | 由业务服务维护可发现的群组目录。 |
| `ChatRoomManager` | `createChatRoom(subject, description?, welcome?, members?, maxCount)` | 创建聊天室。 | 通过服务端 REST API 创建聊天室。 |
| `ChatRoomManager` | `destroyChatRoom(roomId)` | 解散聊天室。 | 通过服务端 REST API 解散聊天室。 |
| `ChatPushConfig` | `ChatOptions.pushConfig` 不再序列化，承载厂商推送参数与证书名的 `ChatPushConfig` 类已删除。 | 初始化时配置厂商推送与证书名。 | iOS 证书名改由 `ChatOptions.apnsCertName` / `pushKitCertName` 承担，Android 厂商凭据改由 `ChatClient#bindDeviceToken` 的 `notifierName` 承担；Android 厂商推送初始化需在原生工程侧完成，详见[推送与设备 Token](#推送与设备-token)。 |

### 有替代方式的 API

| 4.x API | 5.0.0 API | 接口说明 | 迁移说明 |
| :--- | :--- | :--- | :--- |
| `ChatManager#modifyMessageBody(msgId, body)` | `ChatManager#modifyMsgBody({ msgId, body?, ext? })` | 修改本地和服务端消息。 | 位置参数改为单个 `params` 对象；`modifyMsgBody` 支持同时修改消息体与扩展信息，`modifyMessageBody` 已删除。 |
| `ChatManager#fetchHistoryMessages(convId, convType, { pageSize?, startMsgId?, direction? })` | `ChatManager#fetchHistoryMessagesByOptions(convId, convType, { options?, cursor?, pageSize? })` | 分页获取服务端历史消息。 | **分页锚点由 `startMsgId` 改为 `cursor`**：首次调用传空或省略，后续把上一页返回的 `ChatCursorResult.cursor` 传入。需要按发送方、消息类型或时间范围过滤时构造 `ChatFetchMessageOptions`（其 `startTs`、`endTs`、`direction`、`needSave` 为必填字段）；`options` 整体可省略，`pageSize` 默认 20。 |
| `ChatManager#getMessagesWithMsgType(...)` | `ChatManager#getMsgsWithMsgType({ convId, convType, ... })` | 按消息类型从指定会话的本地数据库加载消息。 | 方法名由 `getMessages*` 调整为 `getMsgs*`。 |
| `ChatManager#getMessages(...)` | `ChatManager#getMsgs({ convId, convType, ... })` | 从指定会话的本地数据库加载消息。 | 同上。 |
| `ChatManager#getMessagesWithKeyword(convId, convType, keywords, ...)` | `ChatManager#getConvMsgsWithKeyword({ convId, convType, keywords, ... })` | 按关键字搜索指定会话的本地消息。 | 方法名由 `getMessagesWithKeyword` 调整为 `getConvMsgsWithKeyword`，参数改为单个 `params` 对象。 |
| `ChatManager#getMessageWithTimestamp(...)` | `ChatManager#getMsgWithTimestamp({ convId, convType, ... })` | 按时间戳从本地数据库获取消息。 | 同上。 |
| `ChatConversation#getMessagesWithMsgType(...)`、`getMessages(...)`、`getMessagesWithKeyword(...)`、`getMessageWithTimestamp(...)` | `ChatConversation#getMsgsWithMsgType(params)`、`getMsgs(params)`、`getMsgsWithKeyword(params)`、`getMsgWithTimestamp(params)` | `ChatConversation` 上的本地消息加载方法。 | 方法名同步由 `getMessages*` 调整为 `getMsgs*`，参数由位置参数改为单个 `params` 对象。 |
| `ChatManager#searchMsgFromDB(...)` | `ChatManager#getMsgsWithKeyword(params)` | 按关键字搜索本地消息。 | 使用保留的本地搜索接口；该方法的 `from?` 参数表示发送方，仍然可用。 |
| `ChatManager#getConvMsgsWithKeyword`、`ChatConversation#getMsgsWithKeyword` 的 `sender` 参数 | `senders: Array<string>` 参数 | 按关键字搜索指定会话的本地消息，可按发送方过滤。 | 长期废弃的单个 `sender` 参数已删除，统一使用 `senders` 数组。 |
| `ChatRoomManager#joinChatRoom(roomId)` | `ChatRoomManager#joinChatRoomEx(params)` | 加入聊天室。 | 使用支持扩展信息的新接口。 |
| `ChatGroupManager#fetchGroupInfoFromServer(groupId, isFetchMembers?)` | `ChatGroupManager#fetchGroupInfoWithoutMembersFromServer(groupId)` | 获取群组详情。 | 新接口不主动拉取成员列表；返回的 `memberList` 可能包含本地已有数据，不能视为完整、最新的列表。原先传 `isFetchMembers = true` 的场景，需要另外调用 `fetchMemberListFromServer(groupId, pageSize?, cursor?)`（成员 ID）或 `fetchMemberInfoListFromServer(groupId, cursor, limit?)`（含角色和入群时间）。 |
| `ChatImageMessageBody.thumbnailSecret` | `ChatImageMessageBody.secret` | 图片缩略图鉴权密钥。 | 属性改名。 |
| `ChatFetchMessageOptions.from` | `ChatFetchMessageOptions.senders` | 拉取历史消息时按发送方过滤。 | 属性改名并支持多个发送方。 |
| `ChatRoom.muteList` | `ChatRoom.muteKVList` | 聊天室禁言列表。 | 属性改名。 |
| `ChatGroupEventListener#onMemberJoined`、`onMemberExited` | `ChatGroupEventListener#onMembersJoined`、`onMembersExited` | 群成员加入或离开通知。 | 由单成员回调改为成员数组回调；单成员版本已删除。 |
| `ChatRoomEventListener#onMuteListAdded` | `ChatRoomEventListener#onMuteListAddedV2` | 聊天室禁言名单变化通知。 | 使用新回调；负载中的 `expireTime` 不再下发，`mutes` 由 `Array<string>` 改为 `Record<string, number>`（成员 ID → 禁言到期时间）。 |
| 公开的 `new ChatOptions(params)` 构造函数 | `ChatOptions#withAppKey(params)` 或 `ChatOptions#withAppId(params)` | 构造 SDK 初始化配置。 | 构造函数已改为私有，使用静态工厂方法。 |
| 事件常量 `onMessagesRecalled`、`onMessageReadAck`、`onMessageDeliveryAck`、`onMessageStatusChanged` | `onMessagesRecalledInfo` 等现有回调 | 消息撤回、已读回执、送达回执和消息状态变化事件。 | 这些常量属于桥接层内部实现（不对外导出），仅在使用本仓库源码编译时相关；已废弃的事件常量删除后，对应事件由 `onMessagesRecalledInfo` 等回调承载。 |
| `ChatClient#updatePushConfig(config)` | `ChatClient#bindDeviceToken({ deviceToken, notifierName? })` | 上报设备推送 Token。 | 方法改名并调整参数：原 `deviceId` 在 iOS 上是 APNs 证书名（改用初始化配置 `ChatOptions.apnsCertName`）、在 Android 上是厂商推送凭据（改用 `notifierName`）；原 `deviceToken` 名称不变。详见[推送与设备 Token](#推送与设备-token)。 |

## 主要新增 API

下表以本文选取的 `1.20.0` 为主要比较基线。其中，APNs / PushKit 证书配置及 PushKit Token 绑定、解绑入口在 `1.21.0` 中已提供，并非 5.0.0 首次新增。

| 所属类 | 新增 API | 接口说明 |
| :--- | :--- | :--- |
| `ChatOptions` | `dataSyncType`、`ChatDataSyncType` | 配置登录后自动同步会话、好友和已加入群组，可按位组合。 |
| `ChatConnectEventListener` | `onDatabaseOpened(username, errorCode)`、`onDataSyncStart(type)`、`onDataSyncFinish(type, errorCode)` | 监听本地数据库打开及自动数据同步的开始和结束。 |
| `ChatConnectEventListener` | `onDisconnected(errorCode?, info?)`、`ChatDisconnectErrorCode` | 统一的服务器断开回调，`errorCode` 表示断开原因。 |
| `ChatManager` | `sendMessageReadReceipts(msgIds)` | 批量发送单聊或群聊消息已读回执；最多 50 条且必须属于同一会话。 |
| `ChatManager` | `clearConversationUnreadMessageCount(convId)`、`clearAllConversationUnreadMessageCount()` | 清除指定会话或全部会话的本地未读数，并尝试同步至当前账号其他设备，不向发送方发送消息已读回执。 |
| `ChatManager` | `getGroupMessageReadReceipts(msgIds)` | 批量查询群消息已读回执汇总；最多 20 条且必须属于同一会话。 |
| `ChatManager` | `fetchGroupMessageReadReceipts(msgId, groupId, cursor?, pageSize?)` | 分页查询指定群消息的已读成员详情。 |
| `ChatManager` | `deleteConversations(convIds, deleteMessages?)` | 批量删除本地会话，`deleteMessages` 默认为 `true`（同时删除会话中的本地历史消息）；不存在的会话 ID 会被忽略。 |
| `ChatConversation` | `displayName?`、`displayAvatar?` | 会话展示名称和头像（只读可选属性）；单聊对应对端用户昵称/头像，群聊对应群名称/群头像。相关数据未同步时可能为空字符串或 `undefined`；如需主动查询名称，可调用既有的异步方法 `ChatConversation#name()`，该方法不返回头像。 |
| `ChatCursorResult` | `totalCount?` | 分页结果的总条数；目前仅 `fetchGroupMessageReadReceipts` 在 iOS 侧返回，其余场景与 Android 为 `undefined`。 |
| `ChatGroupManager` | `updateGroupConfigs(groupId, types, configs)` | 按 `ChatGroupConfigsType` 指定的字段更新群组配置。 |
| `ChatMultiDeviceEvent` | `CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED`、`ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED`、`GROUP_UPDATE` | 通知其他设备清除了单个会话或全部会话的未读数，以及其他设备更新了群组信息。 |
| 模型 | `ChatMessageReadReceipt`、`ChatGroupReadReceipt`、`ChatGroupConfigs`、`ChatGroupConfigsType`、`ChatGroupMemberInfo`、`ChatDataSyncType`、`ChatDisconnectErrorCode` | 5.0.0 新增或替换的数据模型与枚举。 |
| `ChatOptions` | `apnsCertName`、`pushKitCertName` | iOS 专用：APNs 与 PushKit 推送证书名，仅初始化时生效、运行时不可修改；承接 4.x `ChatPushConfig.deviceId` 与推送证书配置。 |
| `ChatClient` | `bindDeviceToken({ deviceToken, notifierName? })` | 绑定设备推送 token（双端公用）；取代已移除的 `ChatClient#updatePushConfig`，`notifierName` 仅在 Android 使用。 |
| `ChatClient` | `bindPushKitToken({ deviceToken })`、`unbindPushKitToken()` | 仅 iOS 有效；绑定和解绑 Apple PushKit（VoIP 推送）token，证书名由 `ChatOptions.pushKitCertName` 提供，详见[推送与设备 Token](#推送与设备-token)一节。 |

## 监听器回调变化汇总

React Native SDK 的监听器回调都是可选方法（`?`）。保留已删除的回调不一定产生编译错误：类实现若仍含有接口中的有效成员，通常允许额外保留旧方法；但仅保留旧方法、与接口没有共同成员时，可能触发类型检查错误。带显式接口类型的对象字面量直接声明旧回调时，也会因存在未知属性报错。无论是否出现编译错误，已删除的回调均不会收到事件，升级时应逐项检查监听器实现和监听器注册位置。

| 监听器 | 4.x 回调 | 5.0.0 回调 | 回调说明 |
| :--- | :--- | :--- | :--- |
| `ChatConnectEventListener` | 无 | `onDatabaseOpened(username, errorCode)` | 当前账号本地数据库打开完成；不代表业务数据同步完成。 |
| `ChatConnectEventListener` | 无 | `onDataSyncStart(type)`、`onDataSyncFinish(type, errorCode)` | 指定类型的数据同步开始和结束通知。 |
| `ChatConnectEventListener` | `onUserDidLoginFromOtherDevice(deviceName?)`、`onUserDidLoginFromOtherDeviceWithInfo(params)` | `onDisconnected(errorCode, info)` | 当前账号在其他设备登录的通知；`errorCode` 为 206，设备信息从 `info` 读取。 |
| `ChatConnectEventListener` | `onUserDidRemoveFromServer()`、`onUserDidForbidByServer()`、`onUserDidChangePassword()`、`onUserDidLoginTooManyDevice()`、`onUserKickedByOtherDevice()`、`onAppActiveNumberReachLimit()`、`onUserAuthenticationFailed()` | `onDisconnected(errorCode, info)` | 服务器强制下线回调统一收敛；按 `errorCode` 区分具体原因，详见[服务器强制下线回调收敛](#服务器强制下线回调收敛)。 |
| `ChatConnectEventListener` | 无参数的 `onDisconnected()` | `onDisconnected(errorCode?, info?)` | 回调签名扩展，携带断开原因和设备信息。原无参数实现不会编译报错（参数更少的实现兼容新签名），但拿不到原因，需要按需扩展签名。 |
| `ChatContactEventListener` | `onContactSyncStart()`、`onContactSyncFinish(error?)` | `ChatConnectEventListener#onDataSyncStart`、`onDataSyncFinish` | 好友同步回调统一迁移至连接监听器，并通过 `ChatDataSyncType.Contacts` 识别类型。 |
| `ChatMessageEventListener` | `onMessagesRead(messages)`、`onGroupMessageRead(groupMessageAcks)` | `onMessageReadReceipts(receipts)` | 统一接收单聊和群聊的消息已读回执。 |
| `ChatMessageEventListener` | `onConversationRead(from, to?)` | 无直接替代 | 会话级已读回执回调已删除；按消息处理 `onMessageReadReceipts`。 |
| `ChatGroupEventListener` | `onMemberJoined({ groupId, member })` | `onMembersJoined({ groupId, members })` | 由单个成员参数改为成员数组，一次可通知多名成员加入群组。 |
| `ChatGroupEventListener` | `onMemberExited({ groupId, member })` | `onMembersExited({ groupId, members })` | 由单个成员参数改为成员数组，一次可通知多名成员离开群组。 |
| `ChatRoomEventListener` | `onMuteListAdded({ roomId, mutes: Array<string>, expireTime? })` | `onMuteListAddedV2({ roomId, mutes: Record<string, number> })` | 聊天室禁言名单变化通知；`expireTime` 不再下发，`mutes` 改为成员 ID 到禁言到期时间的映射。 |

`ChatGroupEventListener#onRequestToJoinDeclined` 的回调负载包含 `applicant`（入群申请被拒者的用户 ID）和 `decliner`（拒绝者的用户 ID）。其中 `decliner` 在 4.x 的接口中已声明，但 iOS 侧不下发（恒为 `undefined`），5.0.0 起双端都会填充；`applicant` 双端一直正常下发，语义不变。

### 回调负载修复

以下字段在 4.x 的 TypeScript 接口中已声明，但因为桥接层读取的键名与原生下发的键名不一致，运行时恒为 `undefined`；5.0.0 已修复，双端都会正常填充。业务代码如果为此写过兜底逻辑（例如另行拉取管理员信息），升级后可以移除：

| 回调或模型 | 字段 | 说明 |
| :--- | :--- | :--- |
| `ChatGroupEventListener#onAdminAdded`、`onAdminRemoved` | `admin` | 被添加或移除的群管理员用户 ID。 |
| `ChatGroupEventListener#onAllGroupMemberMuteStateChanged`、`ChatRoomEventListener#onAllChatRoomMemberMuteStateChanged` | `isAllMuted` | 是否全员禁言。 |
| `ChatGroupEventListener#onRequestToJoinDeclined` | `decliner` | 拒绝入群申请的用户 ID；4.x 中 iOS 侧不下发该字段。 |
| `ChatRecalledMessageInfo` | `recalledConvId` | 被撤回消息所属的会话 ID。 |

另外，Android 侧 `ChatManager#getConvMsgsWithKeyword` 省略 `senders` 参数时，4.x 会向原生传入包含空字符串的发送方列表，导致本地关键字搜索恒返回空结果；5.0.0 修复为「省略即不按发送方过滤」，搜索结果会从空变为正常命中。

## 行为变化

以下变化可能不会触发编译错误，但会影响业务逻辑：

1. **未读消息总数的统计范围发生变化**

   `ChatManager#getUnreadCount` 获取本地单聊和群聊会话的未读消息总数。该方法在 4.x 中已存在且签名不变，本次**仅统计范围收窄**：

   - 不统计聊天室会话。
   - 不统计消息话题（Thread）的未读消息数。
   - 不统计设置了免打扰（推送通知方式为 `ChatPushRemindType.MENTION_ONLY` 或 `ChatPushRemindType.NONE`）的会话。这些会话即使存在未读消息，也不纳入统计。
   - 仅统计推送通知方式为 `ChatPushRemindType.ALL` 的单聊和群聊会话。

   如果业务需要其他统计口径，应遍历 `getAllConversations` 并根据会话类型和 `remindType` 自行累加各会话的 `getUnreadCount()` 结果。

2. **清除未读数不会发送消息已读回执**

   `clearConversationUnreadMessageCount` 清除指定会话的本地未读数，并尝试将结果同步至当前账号的其他设备，不会向消息发送方发送已读回执。Promise 正常结束不代表其他设备已完成同步。如需通知发送方，还需对消息调用 `sendMessageReadReceipts`。

3. **初始化后不再自动登录**

   `ChatClient#init` 完成后，SDK 不会依据历史登录记录自动登录。应用需要安全保存和更新 Token，并在适当时机主动调用 `loginWithToken`。

4. **消息已读状态不再允许应用直接修改**

   `ChatMessage.isRead`、`isPeerRead` 和 `groupReadReceiptCount` 在 5.0.0 中均为只读属性，`ChatConversation` 的逐条和全量标记已读接口也已删除。业务应使用会话未读数清理接口；消息已读回执则通过独立的批量回执接口发送。`ChatManager#getMessage` 只查询消息，不会改变其已读状态。

5. **已读回执改为按消息显式开启**

   4.x 的 `ChatOptions.requireAck` 默认为 `true`，但群消息还需设置 `needGroupAck = true`（默认 `false`），并非所有消息默认都会请求回执。5.0.0 删除了该全局开关，改为按消息设置 `ChatMessage.isNeedReadReceipt`，且默认为 `false`。单聊和群聊中需要已读回执的消息均须在发送前显式设置为 `true`。

6. **默认群类型发生变化**

   4.x 的 `ChatGroupOptions` 未指定 `style` 时默认为 `PublicJoinNeedApproval`（公开群 + 入群需审批）；5.0.0 的 `ChatGroupConfigs` 三个布尔属性默认全为 `false`，等价于私有群且仅群主可邀请。依赖默认值建群的代码需要显式设置 `isPublic`、`joinApprovalRequired`、`allowInvites`。

7. **自动同步完成前，本地列表可能不完整**

   `onDatabaseOpened` 只表示数据库可以访问。若 `dataSyncType` 包含相应类型，需要等待 `onDataSyncFinish` 返回成功（`errorCode === 0`）后，再将会话、好友或已加入群组的本地查询结果视为本次登录后的最新数据。

8. **新增多设备未读数同步事件**

   当前账号在其他设备清除会话未读数时，本端会通过 `onConversationEvent(event, convId, convType)` 收到事件。收到 `CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED` 或 `ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED` 后，应重新读取本地会话并刷新 UI。

9. **需显式配置数据同步范围以保证双端行为一致**

   `dataSyncType` 未设置时，iOS 默认同步会话，Android 默认不同步任何数据。依赖自动同步的业务应显式设置 `dataSyncType`。

10. **部分回调字段从恒为 `undefined` 变为有值**

    `onAdminAdded`/`onAdminRemoved` 的 `admin`、`onAllGroupMemberMuteStateChanged`/`onAllChatRoomMemberMuteStateChanged` 的 `isAllMuted`、`onRequestToJoinDeclined` 的 `decliner`（iOS）和 `ChatRecalledMessageInfo.recalledConvId` 已修复，详见[回调负载修复](#回调负载修复)。Android 侧 `getConvMsgsWithKeyword` 省略 `senders` 时的搜索结果也从恒空变为正常命中。

11. **iOS 集成方式变化需要重新安装依赖**

    使用 SPM 集成时，`pod install` 需要显式传入 `USE_FRAMEWORKS=dynamic`，且首次安装需要联网下载 SPM 包。

12. **Android 侧新增原生传递依赖**

    原生 SDK 5.0.0 引入 `androidx.core:core:1.12.0`、`androidx.annotation:annotation:1.6.0` 和 `androidx.lifecycle:lifecycle-process:2.6.2`（前后台检测改用 `ProcessLifecycleOwner`）。宿主工程 `compileSdk` 过低，或锁定、排除了 androidx 版本时，需要相应调整。

13. **Android 厂商推送初始化改由原生工程承担**

    `ChatOptions.pushConfig` 删除后，SDK 不再构建原生 `EMPushConfig`（`enableFCM` / `enableHWPush` / `enableOppoPush` 等）。厂商推送的依赖、manifest 配置与初始化必须在原生 Android 工程侧完成，否则 `bindDeviceToken` 上报的 Token 不会生效。

14. **iOS 推送证书名只能在初始化时配置**

    `ChatOptions.apnsCertName` / `pushKitCertName` 只在 `ChatClient#init` 时下发给原生，运行中无法修改；`bindDeviceToken` 的 `notifierName` 在 iOS 上也不生效。升级后若只依赖旧写法（`pushConfig.deviceId` 或 `updatePushConfig` 里传证书名），绑定会失败并返回证书名为空的非法参数错误。

15. **PushKit 接口仅 iOS 有效**

    `ChatClient#bindPushKitToken` / `unbindPushKitToken` 在 TypeScript 层对非 iOS 平台是空实现（Android 原生 SDK 没有 PushKit 能力，其原生路由返回「不支持」错误）；VoIP 推送的证书申请、`PKPushRegistry` 注册与 token 获取都由业务侧 iOS 工程承担，SDK 只负责在初始化时下发证书名（`ChatOptions.pushKitCertName`）并绑定运行时拿到的 token。

## 4.x 到 5.0.0 迁移检查清单

建议按以下顺序执行升级并逐项验证：

- [ ] **依赖与工程**：将 `react-native-chat-sdk` 升级到 `5.0.0`；iOS 侧执行 `pod install`（使用 SPM 时加 `USE_FRAMEWORKS=dynamic`），Android 侧重新执行 Gradle 构建。
- [ ] **登录改造**：删除 `createAccount`、`login`、`loginWithAgoraToken`、`isLoginBefore` 调用，改为服务端下发 Token 后调用 `loginWithToken`；将 `renewAgoraToken` 替换为 `renewToken`。
- [ ] **初始化配置**：移除 `autoLogin`、`requireAck`、`enableAutoSyncContacts` 配置；按需设置 `dataSyncType`；确认 `ChatOptions` 通过 `withAppKey` 或 `withAppId` 构造。
- [ ] **数据同步**：移除会话、好友、已加入群组的服务端拉取调用，改为读取本地接口，并在 `onDataSyncFinish` 成功后刷新 UI；将 `onContactSyncStart`/`onContactSyncFinish` 迁移到连接监听器。
- [ ] **连接事件**：将 8 类强制下线回调统一为 `onDisconnected(errorCode, info)`；按“退出原因/连接原因”区分处理，并同时处理 `onTokenDidExpire`。
- [ ] **已读回执**：给需要回执的单聊和群聊消息在发送前设置 `isNeedReadReceipt = true`（默认 `false`；4.x 群消息的 `needGroupAck` 也默认关闭）；将逐条已读回执改为 `sendMessageReadReceipts`；将清除未读数改为 `clearConversationUnreadMessageCount`/`clearAllConversationUnreadMessageCount`；将 `onMessagesRead`/`onGroupMessageRead`/`onConversationRead` 迁移到 `onMessageReadReceipts`；替换 `hasReadAck`、`needGroupAck`、`groupAckCount` 属性引用，移除对 `hasRead` 的赋值（已改名为只读的 `isRead`），并把 `groupReadCount` getter 改为 `groupReadReceiptCount`；将 `fetchGroupAcks` 改为 `fetchGroupMessageReadReceipts`，同时把 `ChatGroupMessageAck` 的 `msg_id`/`ack_id`/`from`（字符串）改为 `ChatGroupReadReceipt` 的 `msgId`/`ackId`/`from.memberId`。
- [ ] **群组**：将建群参数从 `ChatGroupOptions`/`ChatGroupStyle` 迁移到 `ChatGroupConfigs`，并**显式设置** `isPublic`/`joinApprovalRequired`/`allowInvites`（默认群类型已变化）；将 `ChatGroup.options` 读取改为 `ChatGroup.configs`、`group.options.isDisabled` 改为 `group.isDisabled`；按需接入 `updateGroupConfigs`（仅群主和管理员）；将 `fetchGroupInfoFromServer(groupId, true)` 拆为 `fetchGroupInfoWithoutMembersFromServer` + `fetchMemberListFromServer`/`fetchMemberInfoListFromServer`；移除 `fetchJoinedGroupsFromServer`、`fetchPublicGroupsFromServer` 调用。
- [ ] **本地消息接口**：将 `getMessages*`、`searchMsgFromDB`、`modifyMessageBody` 等调用替换为 `getMsgs*`、`getMsgsWithKeyword`、`modifyMsgBody`；将 `fetchHistoryMessages` 替换为 `fetchHistoryMessagesByOptions`，分页锚点由 `startMsgId` 改为 `cursor`。
- [ ] **其他重命名**：`joinChatRoom` → `joinChatRoomEx`；`ChatImageMessageBody.thumbnailSecret` → `secret`；`ChatFetchMessageOptions.from` → `senders`；`ChatRoom.muteList` → `muteKVList`；`onMemberJoined`/`onMemberExited` → `onMembersJoined`/`onMembersExited`（单成员改为数组）；`onMuteListAdded` → `onMuteListAddedV2`（`mutes` 改为 `Record<string, number>`）。
- [ ] **设备管理**：设备管理接口改为 Token 鉴权，Token 由业务服务器下发；删除多余的 `isPassword` 实参。
- [ ] **推送配置**：将 `ChatClient#updatePushConfig` 改为 `ChatClient#bindDeviceToken`；删除 `ChatOptions.pushConfig` 与 `ChatPushConfig` 引用；确认 `notifierName` 仅在 Android 使用、值为厂商推送凭据。
- [ ] **iOS 证书名**：已在 `ChatOptions` 初始化时配置 `apnsCertName`（需要 VoIP 推送时还有 `pushKitCertName`），且未依赖运行期修改证书名。
- [ ] **Android 厂商推送**：厂商推送依赖、manifest 与 `EMPushConfig` 已在原生工程侧配置完成（SDK 不再负责）。
- [ ] **VoIP 推送**：需要 VoIP 推送时，iOS 侧已实现 `PKPushRegistry` 并改用 `ChatClient#bindPushKitToken({ deviceToken })`（与普通推送 token 相互独立，其他平台调用为空实现）。
- [ ] **Token 生命周期**：接入 `onTokenWillExpire`（申请新 Token 后调 `renewToken`）与 `onTokenDidExpire`（重新登录），并在冷启动时主动 `loginWithToken`。
- [ ] **构建与验证**：iOS 与 Android 分别重新编译（Android 注意新增的 androidx 传递依赖能否正常解析）；重点验证 Token 登录、数据同步、会话未读数、单聊和群聊已读回执、群组创建与配置更新、好友列表、附件消息、推送设置和多端事件。
