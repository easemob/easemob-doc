# 初始化

初始化是使用 SDK 的必要步骤，必须在调用其他 SDK 接口前完成。

`EMClient` 是单例。**同一进程内多次调用初始化接口时，只有第一次初始化及其配置生效。** 因此，请先集中完成 `EMOptions` 配置，再初始化 SDK。

:::tip
请在应用主进程中初始化 SDK。初始化成功后，再注册监听并执行登录等操作。
:::

## 前提条件

已注册有效的环信即时通讯 IM 开发者账号并创建应用，获取应用的 App Key。详见 [环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

通过 App Key 创建 `EMOptions`，根据业务需要完成其他配置后，将其传入 `EMClient.initializeSDK(with:)`。

```swift
let options = EMOptions(appkey: "your-org#your-app")

// 根据业务需要继续设置其他 EMOptions 配置。
options.enableConsoleLog = true

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription)")
}
```

`initializeSDK(with:)` 同步返回 `EMError?`：返回 `nil` 表示初始化成功；返回非空错误表示初始化失败。App Key 为空或格式不合法时，会返回参数错误。

下表列出初始化时常用的 `EMOptions` 属性。`EMOptions` 的全部属性详见 [API 参考](https://doc.easemob.com/apidoc/ios/chat3.0/interface_e_m_options.html)。

| 属性 | 描述 |
| :--- | :--- |
| `appkey` | 应用的唯一标识，通过 `EMOptions(appkey:)` 传入，通常格式为 `appName`。该属性只读。 |
| `enableConsoleLog` | 是否在控制台输出日志。<br/> - `true`：输出。<br/> -（默认）`false`：不输出。 |
| `apnsCertName` | APNs 推送证书名称。必须在初始化前设置，运行期间不可修改。 |
| `pushKitCertName` | PushKit 证书名称。必须在初始化前设置，运行期间不可修改。 |
| `autoAcceptGroupInvitation` | 是否自动接受群组邀请。<br/> -（默认）`true`：自动接受。<br/> - `false`：不自动接受。 |
| `autoAcceptFriendInvitation` | 是否自动接受好友邀请。按当前 iOS 5.0.0 实现，默认值为 `false`。<br/> - `true`：自动接受。<br/> -（默认）`false`：不自动接受。 |
| `deleteMessagesOnLeaveChatroom` | 主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/> -（默认）`true`：删除。<br/> - `false`：保留。 |
| `deleteMessagesOnLeaveGroup` | 主动或被动退出群组时是否删除该群组的本地消息。<br/> -（默认）`true`：删除。<br/> - `false`：保留。 |
| `canChatroomOwnerLeave` | 是否允许聊天室所有者离开聊天室。<br/> -（默认）`true`：允许。<br/> - `false`：不允许。 |
| `dataSyncType` | 配置登录后自动同步的数据类型。该属性是 `EMDataSyncType` 位选项，可组合配置会话、好友和已加入群组。建议在初始化前显式设置，避免依赖默认值。 |

关于私有化 SDK 的 IP 地址或域名配置，详见 [配置文档](private_ip_domain.html)。

## 初始化后设置监听

初始化完成后，可以注册连接状态监听和消息监听，感知 SDK 与 IM 服务器的连接变化以及新消息。`delegateQueue` 传 `nil` 时，当前实现会将回调分发到主队列。

```swift
final class ChatListener: NSObject, EMClientDelegate, EMChatManagerDelegate {
    func start() {
        // 注册连接状态及数据同步监听。
        EMClient.shared().add(self, delegateQueue: nil)

        // 注册消息监听。
        EMClient.shared().chatManager?.add(self, delegateQueue: nil)
    }

    func stop() {
        // 不再需要监听时移除，避免重复回调。
        EMClient.shared().removeDelegate(self)
        EMClient.shared().chatManager?.remove(self)
    }

    func connectionStateDidChange(_ connectionState: EMConnectionState) {
        if connectionState == .connected {
            // SDK 已连接到 IM 服务器。
        } else {
            // SDK 与 IM 服务器断开连接。
        }
    }

    func messagesDidReceive(_ messages: [EMChatMessage]) {
        // 处理收到的消息。
    }
}
```

弱网导致连接断开后，SDK 会自动重连，无需手动重连。若为监听指定了非主队列，请切换到主线程后再更新 UI。

:::tip
1. 登录后自动同步数据的开始和结束状态由 `EMClientDelegate` 回调，详见[监听同步状态](#监听同步状态)。
2. 数据库打开状态由 `onDatabaseOpened(_:username:)` 回调。数据库打开成功后，才可安全读取当前用户的本地数据库数据。
:::

## 设置登录后自动同步数据

### 同步的数据

iOS SDK 支持在初始化前通过 `EMOptions.dataSyncType` 配置登录后自动同步的数据类型。用户登录成功后，SDK 按配置同步服务端数据，并更新本地缓存或数据库。

`EMDataSyncType` 是位选项，可使用数组字面量组合多个值。当前支持同步会话列表、好友列表和当前用户已加入的群组列表。

| 配置项 | 登录后自动同步内容 | 本地读取方式 | 说明 |
| :--- | :--- | :--- | :--- |
| `.conversations` | 会话列表 | `EMClient.shared().chatManager?.getAllConversations()` | 从 SDK 本地缓存或数据库读取会话。 |
| `.contacts` | 好友列表 | `EMClient.shared().contactManager?.getContacts()` 或 `getAllContacts()` | `getContacts()` 返回好友用户 ID；`getAllContacts()` 返回包含好友信息的 `EMContact` 对象。 |
| `.joinedGroups` | 当前用户已加入的群组列表 | `EMClient.shared().groupManager?.getJoinedGroups()` | 从 SDK 本地缓存或数据库读取群组列表。 |
| `.none` | 不自动同步 | — | 不同步上述数据。不要与其他选项组合。 |

### 配置方式

必须在调用 `initializeSDK(with:)` 前设置 `dataSyncType`。SDK 初始化完成后再修改，不会改变当前 SDK 实例的初始化配置。

以下示例在登录成功后自动同步会话、好友和已加入群组：

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.dataSyncType = [.conversations, .contacts, .joinedGroups]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription)")
}
```

如果只需要同步会话列表，仅配置 `.conversations`：

```swift
options.dataSyncType = [.conversations]
```

如果不需要登录后自动同步，显式配置 `.none`：

```swift
options.dataSyncType = .none
```

:::tip
当前 iOS 5.0.0 实现创建 `EMOptions` 时会将 `dataSyncType` 初始化为会话同步，但公开头文件注释与变更说明中记载的默认值为 `.none`。为保证行为明确且不受版本差异影响，建议始终显式设置该属性。
:::

### 监听同步状态

SDK 通过 `EMClientDelegate` 通知每类数据同步的开始和结束：

- `syncDataStartWithType:`：某类数据开始同步时触发。
- `syncDataFinished:type:`：某类数据同步结束时触发。同步成功、失败、超时或断连结束时都会触发；`error == nil` 表示同步成功。


以下示例使用 Objective-C 声明对应的精确 selector 实现同步监听：

```objective-c
- (void)syncDataStartWithType:(EMDataSyncType)type
{
    NSLog(@"数据同步开始：%ld", (long)type);
}

- (void)syncDataFinished:(EMError * _Nullable)error
                     type:(EMDataSyncType)type
{
    if (error == nil) {
        NSLog(@"数据同步成功：%ld", (long)type);
    } else {
        NSLog(@"数据同步失败：type=%ld, error=%@", (long)type, error);
    }
}

- (void)onDatabaseOpened:(EMError * _Nullable)error
                 username:(NSString *)username
{
    if (error == nil) {
        NSLog(@"数据库已打开：%@", username);
    }
}
```


```swift
func syncDataStart(with type: EMDataSyncType) {
    print("数据同步开始：\(type)")
}

func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
    if let error {
        print("数据同步失败：type=\(type), error=\(error.errorDescription)")
    } else {
        print("数据同步成功：\(type)")
    }
}

func onDatabaseOpened(_ error: EMError?, username: String) {
    if let error {
        print("数据库打开失败：\(error.errorDescription)")
    } else {
        print("数据库已打开：\(username)")
    }
}
```

注册上述监听的对象必须遵循 `EMClientDelegate`，并通过 `addDelegate:delegateQueue:` 添加到 `EMClient`。

### 登录后读取同步结果

收到对应类型的 `syncDataFinished:type:` 回调且 `error == nil` 后，通过相应 Manager 从 SDK 本地缓存或数据库读取同步结果：

```swift
let conversations = EMClient.shared().chatManager?.getAllConversations() ?? []
let contacts = EMClient.shared().contactManager?.getAllContacts() ?? []
let joinedGroups = EMClient.shared().groupManager?.getJoinedGroups() ?? []
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`initializeSDKWithOptions`](#初始化-sdk) | `EMClient` | 初始化 iOS SDK 单例，Swift 调用为 `initializeSDK(with:)`。 |
| [`dataSyncType`](#配置方式) | `EMOptions` | 设置登录后自动同步的数据类型。 |
| [`getAllConversations`](#登录后读取同步结果) | `IEMChatManager` | 读取本地会话列表。 |
| [`getContacts`](#登录后读取同步结果) | `IEMContactManager` | 读取本地好友用户 ID 列表。 |
| [`getAllContacts`](#登录后读取同步结果) | `IEMContactManager` | 读取本地好友对象列表。 |
| [`getJoinedGroups`](#登录后读取同步结果) | `IEMGroupManager` | 读取本地已加入群组列表。 |
