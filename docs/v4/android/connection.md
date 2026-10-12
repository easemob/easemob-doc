# 连接

应用客户端成功连接到环信服务器后，才能使用环信即时通讯 SDK 的收发消息等功能。

你调用 `loginWithToken` 或 `login` 方法登录后，客户端 SDK 会自动连接环信服务器。关于登录详情，请参见[登录文档](login.html)。

## 监听连接状态

你可以通过注册连接监听确认连接状态。

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {

    }
    @Override
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

登录后，如果由于网络信号弱、切换网络等引起的连接中断，SDK 会自动尝试重连。重连成功或者失败时分别会收到 `onConnected` 和 `onDisconnected` 通知。

不过，SDK 在以下情况下会停止自动重连。你需要调用 `login` 方法登录。

- 用户调用了 SDK 的登出方法 `logout` 主动退出登录。
- 登录时鉴权错误，例如， token 无效（错误码 104）或已过期（错误码 108）。
- 用户在其他的设备上更改了密码，导致此设备上自动登录失败，提示错误码 216。
- 用户的账号被从服务器端删除，提示错误码 207。
- 用户在另一设备登录，将当前设备上登录的用户踢出，提示错误码 206。 
- 用户登录设备数量超过限制，提示错误码 214。
- 应用程序的日活跃用户数量（DAU）或月活跃用户数量（MAU）达到上限，提示错误码 8。
- 开启多设备服务后，用户在其他设备上通过调用 API 或者环信控制台将当前设备登录的 ID 强制退出登录（错误码 217）。
