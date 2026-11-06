# 连接

应用客户端成功连接到环信服务器后，才能使用环信即时通讯 SDK 的收发消息等功能。

你调用 `loginWithToken` 或 `login` 方法登录后，客户端 SDK 会自动连接环信服务器。关于登录详情，请参见[登录文档](login.html)。

## 查询连接状态

自 SDK 4.26.0 起，你可以调用 `EMClient#getConnectionState()` 获取当前实际连接状态，返回值为 `EMConnectionState` 枚举：

| 状态 | 说明 |
| :--- | :--- |
| `DISCONNECTED` | 未连接或连接已断开，包括 SDK 未初始化、用户已登出的情况。 |
| `CONNECTING` | SDK 正在建立连接。 |
| `CONNECTED` | 已连接，可以正常收发消息。 |

```java
EMConnectionState state = EMClient.getInstance().getConnectionState();
switch (state) {
    case DISCONNECTED:
        // 显示未连接状态。
        break;
    case CONNECTING:
        // 显示正在连接状态。
        break;
    case CONNECTED:
        // 显示已连接状态。
        break;
}
```

`getConnectionState()` 返回的是查询时的状态，不会注册状态监听。在[断线通知宽限期](#配置断线通知宽限期)内，连接状态仍会即时变化；尚未开始拨号重连时返回 `DISCONNECTED`，开始建立连接后返回 `CONNECTING`。

自 SDK 4.26.0 起，`EMClient#isConnected()` 标记为废弃。该方法只能区分已连接与未连接，建议改用 `getConnectionState()` 展示和判断当前连接状态。

## 监听连接状态

你可以注册 `EMConnectionListener` 监听连接成功和断开通知。

调用 `EMClient#addConnectionListener` 后，SDK 会在工作线程检查当前状态，并向该监听器补发通知：已连接时调用 `onConnected()`；未连接但仍处于已登录状态时，调用 `onDisconnected(EMError.NETWORK_ERROR)`。这类注册时的状态通知不受断线通知宽限期控制，因此，在宽限期内新增或重新注册监听器，仍可能收到断开回调。

`onConnected()` 和 `onDisconnected(int errorCode)` 均在工作线程中调用。请勿直接在回调中更新 UI 或执行耗时操作；需要更新界面时，请切换到主线程。

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {

    }
    @Override
    // 自 SDK 4.26.0 起，发生网络异常等可通过自动重连恢复的连接中断时，SDK 会根据断线通知宽限期决定何时触发 onDisconnected。因此，不能仅凭是否收到该回调判断当前连接状态。
    public void onDisconnected(int errorCode) {

    }

    @Override
    public void onLogout(int errorCode) {

    }

    @Override
    // 自 4.15.0 版本，SDK 会在 Token 有效期达到 80% 时回调即将过期通知。
    public void onTokenWillExpire() {

    }

    @Override
    public void onTokenExpired() {

    }
    // 连接成功，开始从服务器拉取离线消息时触发。
   // 注意：如果本次登录服务器没有离线消息，不会触发该回调。
    @Override
    public void onOfflineMessageSyncStart() {

    }
    // 离线用户上线后从服务器拉取离线消息结束时触发。
   // 注意：如果再拉取离线过程中因网络或其他原因导致连接断开，不会触发该回调。
    @Override
    public void onOfflineMessageSyncFinish() {

    }
};
// 注册连接状态监听
EMClient.getInstance().addConnectionListener(connectionListener);
// 移除连接状态监听
EMClient.getInstance().removeConnectionListener(connectionListener);
```

## 配置断线通知宽限期

自 SDK 4.26.0 起，你可以通过 `EMOptions#setDisconnectNotifyThreshold(int seconds)` 配置可恢复断线的通知宽限期，减少短暂网络波动引起的断线提示。`seconds` 的单位为秒，默认值为 `10`；通过 `EMOptions#getDisconnectNotifyThreshold()` 可查询当前配置。

宽限期的行为如下：

- 仅在本次登录已成功建立连接后生效。首次连接失败不受宽限期影响；手动登录失败应通过登录接口的 `EMCallBack#onError(int code, String error)` 处理，不保证触发 `onDisconnected(int errorCode)`。
- 对于网络异常、服务器不可达等可恢复断线，SDK 自动重连。宽限期内重连成功，则取消本次暂缓的断开通知；到期仍未恢复，则触发一次断开回调。注册监听器时补发的状态通知不受此规则限制，详见 [监听连接状态](#监听连接状态)。
- 宽限期启用期间，再次处理可恢复断线错误不重新计时，回调使用最后一次断线的错误码。
- 被踢下线等不可恢复断线的通知不受宽限期延迟。Token 过期有专门的处理路径，通过 `onTokenExpired()` 通知，不应统一按 `onDisconnected(int errorCode)` 处理。
- `seconds` 小于或等于 `0` 时关闭延迟，可恢复断线通知不再等待宽限期。
- 宽限期仅延迟断开回调，不会延迟真实连接状态的变化。应用可通过 `getConnectionState()` 查询当前状态。

在 SDK 初始化前配置：

```java
EMOptions options = new EMOptions();
options.setAppKey("Your appkey");
options.setDisconnectNotifyThreshold(10);
EMClient.getInstance().init(context, options);
```

初始化后也可以通过 SDK 当前使用的 `EMOptions` 修改或查询配置：

```java
EMOptions options = EMClient.getInstance().getOptions();
// 设置为 0，关闭可恢复断线通知的延迟。
options.setDisconnectNotifyThreshold(0);
int seconds = options.getDisconnectNotifyThreshold();
```

修改配置不会直接重设已启动的计时器。改为其他正值时，当前宽限期仍使用原来的截止时间；改为小于或等于 `0` 后，若当前宽限期内再次处理可恢复断线错误，SDK 会立即触发断开通知并取消当前宽限期。后续新启动的宽限期使用最新配置。

## 网络超时

自 SDK 4.24.2 起，SDK 对网络请求和连接过程的超时时间进行了以下调整：

| 场景 | 超时时间 |
| :--- | :--- |
| TCP/WebSocket 单次连接 | 5 秒调整为 20 秒 |
| 非附件类 HTTP 请求 | 10 秒调整为 20 秒 |
| 整体登录过程 | 30 秒调整为 70 秒 |
| `sendMessage` 内部等待重连 | 20 秒 |
| 获取 DNS 地址列表 | 20 秒 |

以上为 SDK 内部超时时间。附件上传和下载请求不适用上述非附件类 HTTP 请求的 20 秒超时时间。

## 自动重连

登录后，如果由于网络信号弱、切换网络等引起连接中断，SDK 会自动尝试重连，应用无需自行发起重连。重连成功时触发 `onConnected()`；断开通知 `onDisconnected(int errorCode)` 的触发时机遵循 [断线通知宽限期](#配置断线通知宽限期)的规则，并非每次连接中断或重连失败都会立即触发。

不过，SDK 在以下情况下会停止自动重连。你需要调用 `login` 方法登录。

- 用户调用了 SDK 的登出方法 `logout` 主动退出登录。
- 登录时鉴权错误，例如， token 无效（错误码 104）或已过期（错误码 108）。
- 用户在其他的设备上更改了密码，导致此设备上自动登录失败，提示错误码 216。
- 用户的账号被从服务器端删除，提示错误码 207。
- 用户在另一设备登录，将当前设备上登录的用户踢出，提示错误码 206。 
- 用户登录设备数量超过限制，提示错误码 214。
- 应用程序的日活跃用户数量（DAU）或月活跃用户数量（MAU）达到上限，提示错误码 8。
- 开启多设备服务后，用户在其他设备上通过调用 API 或者环信控制台将当前设备登录的 ID 强制退出登录（错误码 217）。
