# 初始化

初始化是使用 SDK 的必要步骤，必须在调用其他 SDK 接口前完成。

`EMClient` 是单例。**对同一进程多次调用 `init` 时，只有第一次初始化及其配置生效**，因此应集中完成 `EMOptions` 配置后再初始化。

:::tip
请在应用主进程中初始化 SDK，并传入 Application Context，避免在多进程场景下重复初始化。
:::

## 前提条件

已注册有效的环信即时通讯 IM 开发者账号并创建应用，获取应用的 App Key。详见[环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

创建 `EMOptions`，调用 `setAppKey` 设置 App Key，完成其他初始化配置后，将 `Context` 和 `EMOptions` 传入 `EMClient.init`。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
// 根据业务需要继续设置其他 EMOptions 配置。
EMClient.getInstance().init(getApplicationContext(), options);
```

下表列出初始化时常用的 `EMOptions` 方法。`EMOptions` 的全部方法详见 [API 参考](https://doc.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_options.html)。

| 方法名称 | 描述 |
| :--- | :--- |
| `setAppKey(String appkey)` | 设置 App Key。`appkey` 是在环信控制台创建应用后获得的唯一标识，格式通常为 `orgName#appName`。 |
| `setPushConfig(EMPushConfig pushConfig)` | 设置离线推送配置。应在 `init` 前传入已构建的 `EMPushConfig`；未设置时，SDK 会创建默认推送配置。 |
| `setAutoAcceptGroupInvitation(boolean value)` | 设置是否自动接受群组邀请。<br/> -（默认）`true`：自动接受群组邀请。<br/> - `false`：不自动接受群组邀请。 |
| `setAcceptInvitationAlways(boolean value)` | 设置是否自动接受好友邀请。<br/> -（默认）`true`：自动接受好友邀请。<br/> - `false`：不自动接受好友邀请。 |
| `setDeleteMessagesAsExitChatRoom(boolean delete)` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/> -（默认）`true`：删除。<br/>- `false`：保留。 |
| `setDeleteMessagesAsExitGroup(boolean delete)` | 设置主动或被动退出群组时是否删除该群组的本地消息。<br/> -（默认）`true`：删除。<br/> - `false`：保留。 |
| `allowChatroomOwnerLeave(boolean allowed)` | 设置是否允许聊天室所有者离开聊天室。<br/> -（默认）`true`：允许；离开后所有者仍保留聊天室权限，但不再接收聊天室消息。<br/> - `false`：不允许。 |
| `setDataSyncType(EnumSet<EMDataSyncType> types)` | 设置登录后自动同步的数据类型。可选 `CONVERSATIONS`、`CONTACTS`、`JOINED_GROUPS`；传入 `NONE`、`null` 或空集合表示不同步。必须在 `init` 前设置。 |

关于私有化 SDK 的 IP 地址或域名配置，详见 [配置文档](private_ip_domain.html)。

## 初始化后设置监听

初始化完成后，可以注册连接状态监听和消息监听，以感知 SDK 与 IM 服务器的连接变化及新消息。连接监听回调运行在工作线程，不要直接更新 UI，也不要执行耗时操作；弱网断开后 SDK 会自动重连，无需手动重连。

```java
private final EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
        // SDK 已成功连接到 IM 服务器。
    }

    @Override
    public void onDisconnected(int errorCode) {
        // SDK 与 IM 服务器断开连接，可根据 errorCode 区分原因。
    }
};

private final EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        // 收到新消息后，遍历消息列表并更新业务数据。
    }
};

// 注册监听。
EMClient.getInstance().addConnectionListener(connectionListener);
EMClient.getInstance().chatManager().addMessageListener(messageListener);

// 页面或组件销毁、不再需要监听时移除，避免重复回调和内存泄漏。
EMClient.getInstance().removeConnectionListener(connectionListener);
// 移除监听
EMClient.getInstance().chatManager().removeMessageListener(messageListener);
```

:::tip
1. 如需监听登录后自动同步数据的开始和完成状态，详见[监听同步状态](#监听同步状态)。
2. SDK 支持在登录完成前读取当前用户的本地缓存数据。应用可通过 `EMConnectionListener#onDatabaseOpened` 监听数据库打开状态。具体用法详见[登录完成前使用本地数据库](login.html#登录完成前使用本地数据库)。
:::

## 设置登录后自动同步数据

### 同步的数据

SDK 支持在初始化前通过 `EMOptions.setDataSyncType` 配置登录后自动同步的数据类型。用户登录成功后，SDK 按配置同步服务端数据并更新本地缓存或数据库。

当前支持同步会话列表、好友列表以及当前用户已加入的群组列表。各数据类型的配置项、本地读取方式如下：

| 配置项 | 登录后自动同步内容 | 本地读取方式 | 说明 |
| :--- | :--- | :--- | :--- |
| `EMDataSyncType.CONVERSATIONS` | 会话列表 | `EMClient.getInstance().chatManager().getAllConversations()` | 从内存读取；内存中没有会话时，SDK 会从本地数据库加载。 |
| `EMDataSyncType.CONTACTS` | 好友列表 | `EMClient.getInstance().contactManager().getContactsFromLocal()` | 从本地数据库读取好友 ID 列表；调用可能抛出 `HyphenateException`。 |
| `EMDataSyncType.JOINED_GROUPS` | 当前用户已加入的群组列表 | `EMClient.getInstance().groupManager().getAllGroups()` | 从 SDK 本地缓存读取群组列表。 |

如需检查当前配置的自动同步数据类型，可调用 `EMOptions#getDataSyncType()`。该接口仅用于读取配置，不会触发数据同步。

### 配置方式

必须在调用 `EMClient.init` 前设置 `setDataSyncType`。SDK 初始化完成后再修改该配置，不应用于本次已创建的 SDK 实例。

配置规则如下：

- 未调用 `setDataSyncType` 时，默认不自动同步数据，即 `EMDataSyncType.NONE`。
- 需要同步一种或多种数据时，使用 `EnumSet.of(...)` 显式传入对应枚举值。
- 传入 `EnumSet.of(EMDataSyncType.NONE)`、`null` 或空集合表示不自动同步。

以下示例表示登录成功后自动同步会话列表、好友列表和当前用户已加入的群组列表：

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS,
        EMOptions.EMDataSyncType.CONTACTS,
        EMOptions.EMDataSyncType.JOINED_GROUPS
));

EMClient.getInstance().init(getApplicationContext(), options);
```

如果只需要同步会话列表，可仅配置 `CONVERSATIONS`：

```java
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS
));
```

如果需要关闭登录后的自动同步，可配置 `NONE`：

```java
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.NONE
));
```

### 监听同步状态

SDK 通过 `onDataSyncStart` 和 `onDataSyncFinish` 通知某一类数据同步的开始和结束。

- `onDataSyncStart(EMDataSyncType type)`：某类数据开始同步时触发。`type` 可能为 `CONVERSATIONS`、`CONTACTS` 或 `JOINED_GROUPS`。
- `onDataSyncFinish(EMDataSyncType type, int errorCode)`：某类数据同步结束时触发。`errorCode == EMError.EM_NO_ERROR` 表示同步成功，否则可根据错误码处理失败情况。

示例代码如下：

```java
EMConnectionListener syncListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
    }

    @Override
    public void onDisconnected(int errorCode) {
    }

    @Override
    public void onDataSyncStart(EMOptions.EMDataSyncType type) {
        Log.d("ChatSDK", "数据同步开始：" + type);
    }

    @Override
    public void onDataSyncFinish(EMOptions.EMDataSyncType type, int errorCode) {
        if (errorCode == EMError.EM_NO_ERROR) {
            Log.d("ChatSDK", "数据同步成功：" + type);
        } else {
            Log.e("ChatSDK", "数据同步失败：" + type + ", errorCode=" + errorCode);
        }
    }
};

EMClient.getInstance().addConnectionListener(syncListener);
```

### 登录后读取同步结果

收到对应类型的 `onDataSyncFinish` 且 `errorCode` 为 `EMError.EM_NO_ERROR` 后，可通过相应 Manager 从 SDK 本地缓存或数据库读取同步结果。

```java
Map<String, EMConversation> conversations =
        EMClient.getInstance().chatManager().getAllConversations();

try {
    List<String> contacts =
            EMClient.getInstance().contactManager().getContactsFromLocal();
} catch (HyphenateException e) {
    Log.e("ChatSDK", "读取本地好友失败", e);
}

List<EMGroup> joinedGroups =
        EMClient.getInstance().groupManager().getAllGroups();
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`init`](#初始化-sdk) | `EMClient` | 初始化 Android SDK 单例。 |
| [`setDataSyncType`](#配置方式) | `EMOptions` | 设置登录后自动同步的数据类型。 |
| [`getAllConversations`](#登录后读取同步结果) | `EMChatManager` | 读取本地会话列表。 |
| [`getContactsFromLocal`](#登录后读取同步结果) | `EMContactManager` | 从本地数据库读取好友列表。 |
| [`getAllGroups`](#登录后读取同步结果) | `EMGroupManager` | 读取本地群组列表。 |
| [`getDataSyncType`](#同步的数据) | `EMOptions` | 获取当前配置的登录后自动同步数据类型。 |
