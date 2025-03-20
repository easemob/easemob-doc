# 连接

应用客户端成功连接到环信服务器后，才能使用环信即时通讯 SDK 的收发消息等功能。

你调用 `loginWithToken` 或 `login` 方法登录后，客户端 SDK 会自动连接环信服务器。关于登录详情，请参见[登录文档](login.html)。

## 监听连接状态

你可以通过注册连接监听确认连接状态。

```csharp

// 监听器建议在初始化完成之后，登录之前设置，这样可确保收到登录通知。
class ConnectionDelegate : IConnectionDelegate
{
    public void OnConnected()
    {
    }
    public void OnDisconnected()
    {
    }
    public void OnAuthFailed()
    {
    }
    public void OnRemovedFromServer()
    {
    }
    public void OnLoginTooManyDevice()
    {
    }
    public void OnChangedIMPwd()
    {
    }
    public void OnKickedByOtherDevice()
    {
    }
    public void OnLoggedOtherDevice(string deviceName)
    {
    }
    public void OnForbidByServer()
    {
    }
    public void OnTokenExpired()
    {
    }
    public void OnTokenWillExpire()
    {
    }
    public void OnAppActiveNumberReachLimitation()
    {
    }
    // 连接成功，开始从服务器拉取离线消息时触发。
    // 注意：如果本次登录服务器没有离线消息，不会触发该回调。
    public void OnOfflineMessageSyncStart()
    {
    }
    // 离线用户上线后从服务器拉取离线消息结束时触发。
    // 注意：如果再拉取离线过程中因网络或其他原因导致连接断开，不会触发该回调。
    public void OnOfflineMessageSyncFinish()
    {
    }
}
// 添加连接监听器
ConnectionDelegate connectionDelegate = new ConnectionDelegate();
SDKClient.Instance.AddConnectionDelegate(connectionDelegate);

// 移除连接监听器（退出程序时建议移除）
SDKClient.Instance.DeleteConnectionDelegate(connectionDelegate);
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