# 连接

应用客户端成功连接到环信服务器后，才能使用环信即时通讯 SDK 的收发消息等功能。

你调用 `loginWithToken` 或 `login` 方法登录后，客户端 SDK 会自动连接环信服务器。关于登录详情，请参见[登录文档](login.html)。

## 监听连接状态

你可以通过注册连接监听确认连接状态。

```typescript
let connectionListener: ConnectionListener = {
  onConnected: (): void => {
    // 长连接建立
  },
  onDisconnected: (errorCode: number): void => {
    // 长连接断开
  },
  onLogout: (errorCode: number, info: LoginExtInfo): void => {
    // 触发退出，需要主动调用 ChatClient#logout 方法
  },
  onTokenExpired: (): void => {
    // 使用 token 登录时，token 过期触发。
  },
  onTokenWillExpire: (): void => {
    // 使用 token 登录时，token 将要过期时触发。
    // 注意：如果本次登录服务器没有离线消息，不会触发该回调。
  },
  onOfflineMessageSyncStart: () => {
    // 连接成功，开始从服务器拉取离线消息时触发。
  },
  onOfflineMessageSyncFinish: () => {
    // 离线用户上线后从服务器拉取离线消息结束时触发。
    // 注意：如果再拉取离线过程中因网络或其他原因导致连接断开，不会触发该回调。
  }
}
// 注册连接状态监听
ChatClient.getInstance().addConnectionListener(connectionListener);
// 移除连接状态监听
ChatClient.getInstance().removeConnectionListener(connectionListener);
```

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