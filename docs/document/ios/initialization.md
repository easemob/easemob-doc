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
| `restServer` | 设置 REST API 基准地址。使用应用专属域名时需要配置，详见 [配置应用专属域名](#配置应用专属域名)。 |
| `webSocketServer` | 设置消息 WebSocket 主机名，与端口和 TLS 配置配合使用，详见 [配置应用专属域名](#配置应用专属域名)。 |
| `webSocketPort` | 设置消息 WebSocket 端口。 |
| `enableTLSConnection` | 设置消息长连接是否启用 TLS。使用应用专属域名时设为 `YES`，通过 WSS 连接。 |
| `enableDnsConfig` | 默认 `YES`，SDK 自动获取服务地址，使用集群域名时无需修改。使用应用专属域名时的设置见 [配置应用专属域名](#配置应用专属域名)。 |
| `enableConsoleLog` | 是否在控制台输出日志。<br/> - `true`：输出。<br/> -（默认）`false`：不输出。 |
| `apnsCertName` | APNs 推送证书名称。必须在初始化前设置，运行期间不可修改。 |
| `pushKitCertName` | PushKit 证书名称。必须在初始化前设置，运行期间不可修改。 |
| `autoAcceptGroupInvitation` | 是否自动接受群组邀请。<br/> -（默认）`true`：自动接受。<br/> - `false`：不自动接受。 |
| `autoAcceptFriendInvitation` | 是否自动接受好友邀请。按当前 iOS 5.0.0 实现，默认值为 `false`。<br/> - `true`：自动接受。<br/> -（默认）`false`：不自动接受。 |
| `deleteMessagesOnLeaveChatroom` | 主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/> -（默认）`true`：删除。<br/> - `false`：保留。 |
| `deleteMessagesOnLeaveGroup` | 主动或被动退出群组时是否删除该群组的本地消息。<br/> -（默认）`true`：删除。<br/> - `false`：保留。 |
| `canChatroomOwnerLeave` | 是否允许聊天室所有者离开聊天室。<br/> -（默认）`true`：允许。<br/> - `false`：不允许。 |
| `disconnectNotifyThreshold` | 设置或查询断线通知宽限时间，单位为秒，默认值为 `10`，自 SDK 5.2.0 起支持。成功建立连接后，发生可恢复断线时，宽限期内重连成功则不触发断开回调；到期仍未恢复才触发。设置为小于或等于 `0` 时不启用宽限期。首次连接失败、Token 失效或被踢下线等情况仍按原有机制通知。宽限期不延迟实际连接状态变化，也不控制 APNs 的发送时间。详见 [配置断线通知宽限期](connection.html#配置断线通知宽限期)。 |
| `dataSyncType` | 配置登录后自动同步的数据类型。该属性是 `EMDataSyncType` 位选项，可组合配置会话、好友和已加入群组，默认值为 `.conversations`。 |
| `enableChatroomConversation` | 设置获取本地会话列表时是否包含聊天室会话。该配置不控制聊天室会话的创建或存储，也不影响聊天室消息的正常收发。该功能自 SDK v5.1.0 起支持。<br/> - `true`：本地会话列表中包含聊天室会话。<br/> -（默认）`false`：本地会话列表中不包含聊天室会话。必须在初始化 SDK 前设置。<br/> 读取 `EMOptions#enableChatroomConversation` 属性可以查询当前配置。 |
| `loadEmptyConversations` | 设置从本地数据库加载会话时是否包含空会话。必须在初始化 SDK 前设置。<br/> - `true`：包含空会话。<br/> -（默认）`false`：不包含空会话。 |
| `autoLoadConversations` | 设置登录成功后是否自动将本地数据库中的全部会话加载到内存。必须在初始化 SDK 前设置。<br/> -（默认）`true`：自动加载全部会话。<br/> - `false`：不自动加载全部会话，可通过分页或筛选接口按需加载。 |

关于私有化 SDK 的 IP 地址或域名配置，详见 [配置文档](private_ip_domain.html)。

## 配置应用专属域名

应用的服务器域名分为两类：**集群域名** 由同一集群内的应用共用，**应用专属域名** 按应用分配。域名查看入口及展示规则见 [查看应用服务器域名](/product/console/app_manage.html#查看应用服务器域名)。

使用集群域名时，SDK 默认自动获取服务地址，无需手动设置 REST 和消息长连接地址，保持 `enableDnsConfig` 的默认值 `YES` 即可。

使用应用专属域名时，需要使用当前应用的 REST 和 WebSocket 地址配置 SDK。iOS SDK 自 **5.0.0** 起提供以下 REST 和 WebSocket 服务地址配置属性。

#### 初始化前配置地址

在控制台进入目标应用的详情页，从 **开发配置信息 > 域名配置** 中复制 **REST API** 和 **Websocket** 地址，并使用同一页面的 App Key。请按以下格式填写 SDK 参数。

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `restServer` | NSString | 是 | REST API 基准地址，保留 `https://` 及实际端口，例如 `https://api-your-app.example.com`；不追加组织名、应用名或业务接口路径。 |
| `webSocketServer` | NSString | 是 | WebSocket 主机名，例如 `ws-your-app.example.com`；不包含 `wss://`、端口或路径。 |
| `webSocketPort` | int | 是 | WSS 默认端口为 `443`；若控制台明确提供其他端口，使用实际值。 |
| `enableTLSConnection` | BOOL | 是 | 默认 `NO`；本文设为 `YES`，使用 WSS。 |
| `usingHttpsOnly` | BOOL | 否 | 示例显式设为 `YES`，REST 请求仅使用 HTTPS；不能替代 WebSocket 的 TLS 开关。 |
| `enableDnsConfig` | BOOL | 是 | 默认 `YES`；本文设为 `NO`。必须在首次初始化前设置。 |

:::notice
选择 **创建新的正式版应用** 上线时，正式版与测试版是两个应用，应从正式版详情页重新获取 App Key 和两项地址，不能只替换 App Key。详见 [应用上线](/product/console/app_launch.html#上线事项)。
:::

以下代码替换现有初始化入口中的配置。请沿用业务所需的其他初始化设置，不要在已经初始化后通过再次调用初始化接口切换地址。以下为 Objective-C 示例，请引入 `EMOptions+PrivateDeploy.h` 后配置；Swift 项目使用对应的 `EMOptions` 属性完成相同设置。

```objectivec
#import <HyphenateChat/HyphenateChat.h>
#import <HyphenateChat/EMOptions+PrivateDeploy.h>

EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.restServer = @"https://api-your-app.example.com";
options.webSocketServer = @"ws-your-app.example.com";
options.webSocketPort = 443;
options.enableTLSConnection = YES;
options.usingHttpsOnly = YES;
options.enableDnsConfig = NO;

EMError *error = [[EMClient sharedClient] initializeSDKWithOptions:options];
if (error != nil) {
    NSLog(@"SDK 初始化失败：%@", error.errorDescription);
}
```

WebSocket 地址只填写主机名，端口和 TLS 分别配置，不使用 TCP 的 `chatServer` 和 `chatPort`。自 SDK **5.1.0** 起，数据同步地址根据 REST 配置自动获取，无需单独设置。使用 5.0.0 并启用自动同步时，需另行确认该版本的同步配置要求。

#### 检查配置结果

地址设置方法和初始化接口不提供独立的“域名连接成功”回调。初始化完成后，按 [初始化后设置监听](#初始化后设置监听) 注册连接监听，再按 [登录](login.html) 文档登录。确认连接成功，并通过 SDK 日志检查实际连接的服务主机。

分别验证消息收发、REST 请求和启用的自动同步功能。消息连接成功不代表所有请求和数据同步均已成功；失败时请记录错误信息，并对照 [错误码](error.html) 排查 App Key、域名、端口、TLS 和网络访问情况。


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
        } else if connectionState == .disconnected {
            // SDK 通知与 IM 服务器已断开；可恢复断线的通知时机受宽限期影响。
        }
    }

    func messagesDidReceive(_ messages: [EMChatMessage]) {
        // 处理收到的消息。
    }
}
```

弱网导致连接断开后，SDK 会自动重连，无需手动重连。需要区分未连接、连接中和已连接状态时，请查询 `EMClient.connectionState`，详见 [查询连接状态](connection.html#获取连接状态)。断开回调的通知时机受 [断线通知宽限期](connection.html#配置断线通知宽限期) 影响。若为监听指定了非主队列，请切换到主线程后再更新 UI。

:::tip
1. 登录后自动同步数据的开始和结束状态由 `EMClientDelegate` 回调，详见[监听同步状态](#监听同步状态)。
2. 数据库打开状态由 `onDatabaseOpened(_:username:)` 回调。数据库打开成功后，才可安全读取当前用户的本地数据库数据。
:::

## 设置登录后自动同步数据

### 同步的数据

iOS SDK 支持在初始化前通过 `EMOptions.dataSyncType` 配置登录后自动同步的数据类型。用户登录成功后，SDK 按配置同步服务端数据，并更新本地缓存或数据库。该属性默认包含 `.conversations`，即默认自动同步会话列表。

`EMDataSyncType` 是位选项，可使用数组字面量组合多个值。当前支持同步会话列表、好友列表和当前用户已加入的群组列表。

| 配置项 | 登录后自动同步内容 | 本地读取方式 | 说明 |
| :--- | :--- | :--- | :--- |
| `.conversations` | 会话列表 | `EMClient.shared().chatManager?.getAllConversations()` | 从 SDK 本地缓存或数据库读取会话。 |
| `.contacts` | 好友列表 | `EMClient.shared().contactManager?.getContacts()` 或 `getAllContacts()` | `getContacts()` 返回好友用户 ID；`getAllContacts()` 返回包含好友信息的 `EMContact` 对象。 |
| `.joinedGroups` | 当前用户已加入的群组列表 | `EMClient.shared().groupManager?.getJoinedGroups()` | 从 SDK 本地缓存或数据库读取群组列表。 |
| `.none` | 不自动同步 | — | 不同步上述数据。不要与其他选项组合。 |

### 配置方式

必须在调用 `initializeSDK(with:)` 前设置 `dataSyncType`。SDK 初始化完成后再修改，不会改变当前 SDK 实例的初始化配置。

配置规则如下：

- 未设置 `dataSyncType` 时，默认自动同步会话数据，即 `.conversations`。
- 需要同步一种或多种数据时，可使用数组字面量显式组合对应选项。
- 设置为 `.none` 表示不自动同步会话、好友或已加入群组数据。

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
`dataSyncType` 只控制登录后从服务端自动同步的数据类型，不控制是否将本地数据库中的全部会话自动加载到内存。后者由 `EMOptions#autoLoadConversations` 控制。
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

## 开启用户信息自动管理

用户信息自动管理与联系人自动同步相互独立。`EMOptions.enableUserInfo` 默认关闭；开启后会在登录成功时同步当前用户的属性，但不会在登录时自动获取所有好友的昵称和头像。其他用户属性通过消息触发、主动获取等方式更新，详见 [用户信息自动管理](userinfo_provider.html)。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`restServer`](#初始化前配置地址) | `EMOptions` | 设置 REST API 基准地址。 |
| [`webSocketServer`](#初始化前配置地址) | `EMOptions` | 设置消息 WebSocket 主机名。 |
| [`webSocketPort`](#初始化前配置地址) | `EMOptions` | 设置消息 WebSocket 端口。 |
| [`enableTLSConnection`](#初始化前配置地址) | `EMOptions` | 设置消息长连接是否启用 TLS。 |
| [`enableDnsConfig`](#初始化前配置地址) | `EMOptions` | 配置服务地址的使用方式；使用指定地址时设为 `NO`。 |
| [`initializeSDKWithOptions`](#初始化-sdk) | `EMClient` | 初始化 iOS SDK 单例，Swift 调用为 `initializeSDK(with:)`。 |
| [`dataSyncType`](#配置方式) | `EMOptions` | 设置登录后自动同步的数据类型。 |
| [`getAllConversations`](#登录后读取同步结果) | `IEMChatManager` | 读取本地会话列表。 |
| [`getContacts`](#登录后读取同步结果) | `IEMContactManager` | 读取本地好友用户 ID 列表。 |
| [`getAllContacts`](#登录后读取同步结果) | `IEMContactManager` | 读取本地好友对象列表。 |
| [`getJoinedGroups`](#登录后读取同步结果) | `IEMGroupManager` | 读取本地已加入群组列表。 |
