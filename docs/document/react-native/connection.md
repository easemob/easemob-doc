# 连接

应用客户端成功连接到环信服务器后，才能使用环信即时通讯 SDK 的收发消息等功能。

你调用 `login` 方法登录后，客户端 SDK 会自动连接环信服务器。关于登录详情，请参见[登录文档](login.html)。

## 监听连接状态

你可以通过注册连接监听确认连接状态。

```typescript
ChatClient.getInstance().addConnectionListener({
  onConnected(): void {
    console.log("onConnected");
  },
  onDisconnected(): void {
    console.log("onDisconnected");
  },
  onAppActiveNumberReachLimit(): void {
    console.log("onAppActiveNumberReachLimit");
  },

  onUserDidLoginFromOtherDevice(deviceName?: string): void {
    console.log("onUserDidLoginFromOtherDevice", deviceName);
  },

  onUserDidLoginFromOtherDeviceWithInfo(params: {
    deviceName?: string;
    ext?: string;
  }): void {
    console.log("onUserDidLoginFromOtherDeviceWithInfo", params);
  },

  onUserDidRemoveFromServer(): void {
    console.log("onUserDidRemoveFromServer");
  },

  onUserDidForbidByServer(): void {
    console.log("onUserDidForbidByServer");
  },

  onUserDidChangePassword(): void {
    console.log("onUserDidChangePassword");
  },

  onUserDidLoginTooManyDevice(): void {
    console.log("onUserDidLoginTooManyDevice");
  },

  onUserKickedByOtherDevice(): void {
    console.log("onUserKickedByOtherDevice");
  },

  onUserAuthenticationFailed(): void {
    console.log("onUserAuthenticationFailed");
  },

  onOfflineMessageSyncFinish(): void {
    console.log("onOfflineMessageSyncFinish");
  },

  onOfflineMessageSyncStart(): void {
    console.log("onOfflineMessageSyncStart");
  },
} as ChatConnectEventListener);
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
