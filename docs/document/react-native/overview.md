# SDK 集成概述

<Toc />

介绍 React Native 集成相关内容。

## 前提条件

开始前，请注册有效的环信即时通讯 IM 开发者账号和取得 App key，见 [环信即时通讯云管理后台](https://console.easemob.com/user/login)。

## 集成环境

具体见 [开发环境要求](quickstart.html)。

## 增加隐私权限

对于 Android 平台：

1. 找到文件 `android/app/src/main/AndroidManifest.xml`
2. SDK 必需要添加的权限如下：

```xml
<!-- access network permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<!-- Get carrier information -->
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<!-- Wake up permission -->
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

## SDK 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。初始化的结果通过异步的方式返回。

初始化示例代码：

```typescript
ChatClient.getInstance()
  .init(
    new ChatOptions({
      appKey: "<your app key>",
      autoLogin: false,
      debugModel: true,
    })
  )
  .then(() => {
    console.log("init success");
  })
  .catch((error) => {
    console.log("init fail: ", error);
  });
```

初始化参数非常多，这里做主要参数介绍。参数聚合在 `ChatOptions` 类型中。

- `appKey`：App 在控制台注册完成之后会生成该参数，这是 App 在系统中的唯一标识。
- `autoLogin`：是否自动登录。该参数设置为 `true`，则在登录成功之后，后续 App 启动之后自动执行登录操作。如果登录失败会返回错误提示。
- `debugModel`：是否启用日志输出功能。设置为 `true` 则会启用日志输出功能，在调试开发阶段帮助定位和分析问题。
- `acceptInvitationAlways`：是否自动接受申请。设置为 `true` 则当有人申请好友时，自动接受申请。
- `autoAcceptGroupInvitation`：是否自动接受邀请。设置为 `true` 则当有人邀请当前用户入群时，自动接受邀请。
- `requireAck`：是否需要发送已读回执。设置为 `true` 则消息需要已读回执。详见 [消息回执章节](message_receipt.html)。
- `requireDeliveryAck`：是否需要发送送达回执。设置为 `true` 则消息需要送达回执。详见消息回执章节。
- `deleteMessagesAsExitGroup`：是否需要在离开群组时自动删除聊天历史消息。设置为 `true` 则在退出群组的时候，会删除聊天记录。
- `deleteMessagesAsExitChatRoom`：是否需要在离开聊天室时自动删除聊天历史消息。设置为 `true` 则在退出聊天室的时候，会删除记录。
- `isChatRoomOwnerLeaveAllowed`：是否允许聊天室所有者离开聊天室。设置为 `true` 则允许。详见 [聊天室](room_overview.html) 章节。
- `isAutoDownload`: 是否开启自动下载。设置为 `true` 则收到图片、视频、音频、语音消息会自动下载。详见 [消息](message_overview.html) 章节。

## 注册用户

目前注册的方式有以下几种：
- 通过控制台注册。
- 通过 REST API 接口注册。
- 调用 SDK 接口注册。该方法需在 [控制台](https://console.easemob.com/app/im-service/detail) 设置允许 **开放注册**。

### 控制台注册

控制台的注册请到 [这里](https://console.easemob.com/app/im-service/operative-service/user)。

### REST API 注册

请参考 [注册用户](/document/server-side/account_system.html#注册用户)。

### SDK 注册

```typescript
ChatClient.getInstance()
  .createAccount(username, password)
  .then((value: any) => {
    console.log("createAccount: success", value);
  })
  .catch((reason: any) => {
    console.log("createAccount: fail", reason);
  });
```

## 用户登录

目前登录服务器有两种方式：

- 用户 ID + 密码
- 用户 ID + token

手动登录时传入的用户 ID 必须为 String 类型，支持的字符集详见[用户注册的 RESTful 接口](/document/server-side/account_system.html#注册用户)。

调用登录接口后，收到 `onConnected` 回调表明 SDK 与环信服务器连接成功。

### 手动登录

**用户 ID +密码** 登录是传统的登录方式。用户名和密码都是你的终端用户自行决定，密码需要符合密码规则要求。

```typescript
ChatClient.getInstance()
  .login(username, password, true)
  .then((value: any) => {
    console.log(`login success`, value);
  })
  .catch((reason: any) => {
    console.log(`login fail`, reason);
  });
```

**用户 ID + token** 是更加安全的登录方式。token 可以通过调用 REST API 获取。 详见 [环信用户 token 的获取](/document/server-side/easemob_user_token.html)。

:::notice
使用 token 登录时需要处理 token 过期的问题，比如在每次登录时更新 token 等机制。
:::

```typescript
ChatClient.getInstance()
  .login(username, token, false)
  .then((value: any) => {
    console.log(`login success`, value);
  })
  .catch((reason: any) => {
    console.log(`login fail`, reason);
  });
```

登录重试机制如下：

- 登录时，若服务器返回明确的失败原因，例如，token 不正确，SDK 不会重试登录。
- 若登录因超时失败，SDK 会重试登录。

### 自动登录

在初始化的时候，可以设置是否自动登录。如果设置为自动登录，则登录成功之后，后续启动初始化的时候会自动登录，登录结果异步返回。

自动登录时，SDK 尝试连接服务器失败后，延时随机一段时间后自动重连。

## 退出登录

登出也是异步返回。

```typescript
ChatClient.getInstance()
  .logout()
  .then(() => {
    console.log(`logout success`);
  })
  .catch((reason: any) => {
    console.log(`logout fail`, reason);
  });
```

## 连接状态相关

你需添加 `ChatConnectEventListener#onConnected` 回调。

```typescript
// 监听器建议在初始化完成之后，登录之前设置，这样可以恰当地收到登录通知。
let listener = new (class s implements ChatConnectEventListener {
  // token即将过期
  onTokenWillExpire(): void {
    console.log("onTokenWillExpire");
  }
  // token已过期
  onTokenDidExpire(): void {
    console.log("onTokenDidExpire");
  }
  onConnected(): void {
    console.log("onConnected");
  }
  onDisconnected(errorCode?: number): void {
    console.log("onDisconnected: ", errorCode);
  }
})();
ChatClient.getInstance().removeAllConnectionListener();
ChatClient.getInstance().addConnectionListener(listener);
```

### 断网自动重连

如果由于网络信号弱、切换网络等引起的连接终端，系统会自动尝试重连。重连成功或者失败的结果分别会收到通知 `onConnected` 和 `onDisconnected`。

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

如果开启日志调试模式，会通过控制台输出日志。`debugModel` 设置为 `true`。

```typescript
chatlog.log(`${ChatClient.TAG}: login: `, userName, "******", isPassword);
```