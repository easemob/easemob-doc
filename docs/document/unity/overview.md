# 集成概述

<Toc />

介绍 Unity 集成相关内容。

## 前提条件

开始前，请注册有效的环信即时通讯 IM 开发者账号和获取 App key，参见 [环信即时通讯云管理后台](https://console.easemob.com/user/login)。

## 集成环境

具体见 [集成环境要求](quickstart.html#前提条件)。

## SDK 初始化

初始化是使用 SDK 的第一步，需在调用任何方法前完成。
如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

初始化示例代码：

```csharp
Options options = new Options(appkey);
options.AutoLogin = false;
options.UsingHttpsOnly = true;
options.DebugMode = true;
SDKClient.Instance.InitWithOptions(options);
```

初始化参数非常多，这里对主要参数进行介绍。参数聚合在 `Options` 类型中。

| 参数             | 描述                                                         |
| :----------| :----------------------------------------------------------- |
| `AppKey` | App 在控制台注册完成之后会生成该参数，这是 App 在系统中的唯一标识。                                  |
| `AutoLogin`  | 是否自动登录。该参数设置为 `true`，则在登录成功之后，后续 App 启动之后自动执行登录操作。如果登录失败会返回错误提示。 |
| `DebugMode` | 是否启用日志输出功能。设置为 `true` 则会启用日志输出功能，在调试开发阶段帮助定位和分析问题。 |
| `AcceptInvitationAlways` | 是否自动接受申请。设置为 `true` 则当用户申请好友时，自动接受申请。 |
| `AutoAcceptGroupInvitation` | 是否自动接受邀请。设置为 `true` 则当有人邀请当前用户入群时，自动接受邀请。  |
| `RequireAck` | 是否需要发送已读回执。设置为 `true` 则消息需要已读回执。详见 [消息回执章节](message_receipt.html)。 |
| `RequireDeliveryAck` | 是否需要发送送达回执。设置为 `true` 则消息需要送达回执。[消息回执章节](message_receipt.html) |
| `DeleteMessagesAsExitGroup` | 是否需要在离开群组时自动删除聊天历史消息。设置为 `true` 则在退出群组的时候，会删除聊天记录。  |
| `DeleteMessagesAsExitRoom` | 是否需要在离开聊天室时自动删除聊天历史消息。设置为 `true` 则在退出聊天室的时候，会删除记录。 |
| `IsRoomOwnerLeaveAllowed`  | 是否允许聊天室所有者离开聊天室。设置为 `true` 则允许。详见 [聊天室](room_overview.html) 章节。  |
| `IsAutoDownload`  | 是否开启自动下载。设置为 `true` 则收到图片、视频、音频、语音消息会自动下载。详见 [消息](message_send_receive.html#接收消息) 章节。 |

## 注册用户

目前注册的方式有几种。第一种是通过控制台注册。第二种通过 REST API 接口注册。第三种是调用 SDK 接口注册（该方法需在 [控制台](https://console.easemob.com/app/im-service/detail) 设置允许 **开放注册**)。

### 控制台注册

控制台的注册请到 [这里](https://console.easemob.com/app/im-service/operative-service/user)。

### REST API 注册

请参考 [注册用户](/document/server-side/account_system.html#注册用户)。

### SDK 注册

```csharp
SDKClient.Instance.CreateAccount(username, password,
    handle: new CallBack(

        onSuccess: () => {
            Debug.Log("CreateAccount succeed");
        },

        onError: (code, desc) => {
            Debug.Log($"CreateAccount failed, code: {code} ; desc: {desc}");
        }
    )
);
```

## 用户登录

目前登录服务器有两种方式：
- 用户 ID + 密码；
- 用户 ID + token（Unity SDK 暂不支持）；
- 用户 ID + agoraToken。

:::notice
使用 token 登录时需要处理 token 过期的问题，比如在每次登录时更新 token 等机制。
:::

### 手动登录

**用户 ID + 密码** 登录是传统的登录方式。

```csharp
SDKClient.Instance.Login(username, password,
    handle: new CallBack(

        onSuccess: () =>
        {
            Debug.Log("login succeed");
        },

        onError: (code, desc) =>
        {
            if (code == 200)
            {
                Debug.Log("Already login.");;
            }
            else 
            {
                Debug.Log($"login failed, code: {code} ; desc: {desc}");
            }
        }
    )
);
```

**用户 ID + agoraToken** 是支持声网 token 直接登录的方式，一般同时使用声网和环信产品时利用该方法登录。token 获取请参考 [使用声网 user token 鉴权](https://docs.agora.io/en/agora-chat/generate_user_tokens?platform=React%20Native)。

```csharp
SDKClient.Instance.LoginWithAgoraToken(username, token, 
    handle: new CallBack(
    
        onSuccess: () =>
        {
            Debug.Log("LoginWithAgoraToken succeed");
        },
    
        onError: (code, desc) =>
        {
            if (code == 200)
            {
                Debug.Log($"Already login");
            }
            else
            {
                Debug.Log($"Login failed, code:{code}, desc:{desc}");
            }
        }
    ));
```

### 自动登录（Unity SDK 暂不支持）

在初始化的时候，可以设置是否自动登录。如果设置为自动登录，则登录成功之后，后续启动初始化的时候会自动登录，登录结果通过回调返回。

## 退出登录

登出也是异步返回。

```csharp
SDKClient.Instance.Logout(false,
    handle: new CallBack(
    onSuccess: () =>
    {
        Debug.Log("Logout succeed");
    },

    onError: (code, desc) =>
    {
        Debug.Log($"Logout failed, code:{code}, desc:{desc}");
    }
    )
);
```

## 连接状态相关

你需添加 `IConnectionDelegate#OnConnected` 回调。

```csharp
// 监听器建议在初始化完成之后，登录之前设置，这样可确保收到登录通知。
class ConnectionDelegate : IConnectionDelegate
{
    // 连接回调
    public void OnConnected()
    {
        Debug.Log("OnConnected");
    }
    // 断开连接回调
    public void OnDisconnected(int i)
    {
        Debug.Log($"OnDisconnected: {i}");
    }
    // Token 过期回调
    public void OnTokenExpired()
    {
        Debug.Log($"OnTokenExpired");
    }
    // Token 即将过期回调
    public void OnTokenWillExpire()
    {
        Debug.Log($"OnTokenWillExpire");
    }
}
// 添加连接监听器
ConnectionDelegate connectionDelegate = new ConnectionDelegate();
SDKClient.Instance.AddConnectionDelegate(connectionDelegate);

// 移除连接监听器（退出程序时建议移除）
SDKClient.Instance.DeleteConnectionDelegate(connectionDelegate);
```

### 断网自动重连

如果由于网络信号弱、切换网络等引起的连接终端，系统会自动尝试重连。重连成功或者失败的结果分别会收到通知`onConnected` 和 `onDisconnected`。

### 被动退出登录

对于 `onDisconnected` 通知，这些 `errorCode` 需要用户关注，收到这些通知，建议 APP 返回登录界面。

- `USER_LOGIN_ANOTHER_DEVICE=206`: 用户已经在其他设备登录
- `USER_REMOVED=207`: 用户账户已经被移除
- `USER_BIND_ANOTHER_DEVICE=213`: 用户已经绑定其他设备
- `SERVER_SERVING_DISABLED=305`: 服务器服务停止
- `USER_LOGIN_TOO_MANY_DEVICES=214`: 用户登录设备超出数量限制
- `USER_KICKED_BY_CHANGE_PASSWORD=216`: 由于密码变更被踢下线
- `USER_KICKED_BY_OTHER_DEVICE=217`: 由于其他设备登录被踢下线
- `USER_DEVICE_CHANGED=220`: 和上次设备不同导致下线

以上参数具体可以参考原生平台对应说明。

## 输出信息到日志文件

如果开启日志调试模式，会通过控制台输出日志。`DebugMode` 设置为 `true`。
