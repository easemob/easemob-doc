# 连接

应用客户端成功连接到环信服务器后，才能使用环信即时通讯 SDK 的收发消息等功能。

你调用 `login` 方法登录后，客户端 SDK 会自动连接环信服务器。关于登录详情，请参见[登录文档](login.html)。

## 查询连接状态

自 SDK 4.26.0 起，你可以通过 `[EMClient sharedClient].connectionState` 查询 SDK 当前连接到聊天服务器的状态，便于展示连接进度或根据当前状态处理业务。

`connectionState` 为只读属性，返回 `EMConnectionState`，包含以下状态：

| 枚举值 | 说明 |
| :--- | :--- |
| `EMConnectionDisconnected` | 未连接到聊天服务器。SDK 尚未初始化时也返回此状态。 |
| `EMConnectionConnecting` | 正在连接聊天服务器。 |
| `EMConnectionConnected` | 已连接到聊天服务器。 |

```objectivec
EMConnectionState state = [EMClient sharedClient].connectionState;
switch (state) {
    case EMConnectionDisconnected:
        // 展示未连接状态。
        break;
    case EMConnectionConnecting:
        // 展示正在连接状态。
        break;
    case EMConnectionConnected:
        // 展示已连接状态。
        break;
}
```

`isConnected` 属性自 SDK 4.26.0 起标记为废弃，现有调用仍可使用。建议改用 `connectionState`，以区分未连接、连接中和已连接三种状态。

## 监听连接状态

你可以通过注册连接监听接收已连接或断开连接的通知。需要了解连接中的状态时，请查询 `connectionState` 属性。断开连接回调的触发时机还受到 [断线通知宽限期](#配置断线通知宽限期) 的影响。

```swift
override func viewDidLoad() {
    ...
    // 注册连接状态监听，在 SDK 初始化之后调用。
    EMClient.shared().add(self, delegateQueue: nil)
    ...
}

extension ViewController: EMClientDelegate {
    // 连接成功，开始从服务器拉取离线消息时触发。
    // 注意：如果本次登录服务器没有离线消息，不会触发该回调。
    func onOfflineMessageSyncStart() {
    }
    // 离线用户上线后从服务器拉取离线消息结束时触发。
    // 注意：如果再拉取离线过程中因网络或其他原因导致连接断开，不会触发该回调。
    func onOfflineMessageSyncFinish() {
    }
    
    // 连接状态变更时触发该回调
    func connectionStateDidChange(_ aConnectionState: EMConnectionState) {
        
    }
    // 自 4.15.0 版本，SDK 会在 Token 有效期达到 80% 时回调即将过期通知。
    func tokenWillExpire(_ aErrorCode: EMErrorCode) {
        // 通过 App Server 获取新的 token,然后调用 sdk 的 renewToken 方法更新 token
        EMClient.shared().renewToken("newToken") { e in
            
        }
    }
    
    // token 已过期
    func tokenDidExpire(_ aErrorCode: EMErrorCode) {
        
        
    }
    
}

```

## 配置断线通知宽限期

自 SDK 4.26.0 起，你可以通过 `EMOptions.disconnectNotifyThreshold` 设置或查询断线通知宽限时间，单位为秒，默认值为 `10`。

成功建立连接后，发生网络异常等可恢复断线时，SDK 会暂缓向应用发送断开连接回调，减少短暂网络波动引起的断线提示。具体规则如下：

- 宽限期内重连成功，不触发断开连接回调。
- 宽限期到期仍未恢复连接，才触发断开连接回调。
- 设置为小于或等于 `0` 时，不启用宽限期，直接通知。
- 首次连接失败、token 过期或被踢下线等情况不受宽限期影响，仍按原有机制通知。例如，token 过期仍通过 `tokenDidExpire:` 通知。

在 [初始化 SDK](initialization.html#初始化-sdk) 前，通过 `EMOptions` 配置宽限期：

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"Your appkey"];
// 设置断线通知宽限期为 10 秒。设置为 0 或负数可关闭宽限期。
options.disconnectNotifyThreshold = 10;
// 读取当前配置的宽限时间，单位为秒。
NSInteger threshold = options.disconnectNotifyThreshold;

EMError *error = [[EMClient sharedClient] initializeSDKWithOptions:options];
if (error) {
    // 处理初始化失败。
}
```

宽限期仅影响断开连接回调的时机，不延迟连接状态的变化。即使尚未收到断开连接回调，通过 `connectionState` 查询的结果也可能已经是未连接或连接中。需要判断当前状态时，请读取该属性。

## 自动重连

登录后，如果由于网络信号弱、切换网络等引起的连接中断，SDK 会自动尝试重连。你可以结合 `connectionState` 查询和 `connectionStateDidChange` 回调了解连接情况。自 SDK 4.26.0 起，可恢复断线的通知受 [断线通知宽限期](#配置断线通知宽限期) 影响，短暂断线后在宽限期内重连成功时，不会收到断开连接回调。

不过，SDK 在以下情况下会停止自动重连。你需要调用 `login` 方法登录。

- 用户调用了 SDK 的登出方法 `logout` 主动退出登录。
- 登录时鉴权错误，例如， token 无效（错误码 104）或已过期（错误码 108）。
- 用户在其他的设备上更改了密码，导致此设备上自动登录失败，提示错误码 216。
- 用户的账号被从服务器端删除，提示错误码 207。
- 用户在另一设备登录，将当前设备上登录的用户踢出，提示错误码 206。 
- 用户登录设备数量超过限制，提示错误码 214。
- 应用程序的日活跃用户数量（DAU）或月活跃用户数量（MAU）达到上限，提示错误码 8。
- 开启多设备服务后，用户在其他设备上通过调用 API 或者环信控制台将当前设备登录的 ID 强制退出登录（错误码 217）。