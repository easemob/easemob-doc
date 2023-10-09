# SDK 集成概述

<Toc />

介绍 Android 集成相关内容。

## 前提条件

开始前，请注册有效的环信即时通讯 IM 开发者账号并取得 App key，见 [环信即时通讯云管理后台](https://console.easemob.com/user/login)。

## 集成环境

详见 [开发环境要求](quickstart.html#前提条件)。

## 添加权限

1. 找到文件 `AndroidManifest.xml`
2. SDK 最少需要添加的权限如下：

```xml
<!-- 访问网络权限 -->
<uses-permission android:name="android.permission.INTERNET" />
<!-- 获取运营商信息，用于获取网络状态 -->
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<!-- 允许程序在手机屏幕关闭后后台进程仍然运行 -->
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

## SDK 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

初始化示例代码：

```java
EMOptions options = new EMOptions();
options.setAppKey("Your appkey");
......// 其他 EMOptions 配置。
EMClient.getInstance().init(context, options);
```

:::notice
需要在主进程中进行初始化。
:::

## 注册用户

目前用户注册方式有以下几种：
- 通过控制台注册。
- 通过 REST API 接口注册。
- 调用 SDK 接口注册。

### 控制台注册

控制台的注册请到 [这里](https://console.easemob.com/app/im-service/operative-service/user)。

### REST API 注册

请参考 [注册用户](/document/server-side/account_system.html#注册用户)。

### SDK 注册

若支持 SDK 注册，需登录[环信即时通讯云控制台](https://console.easemob.com/user/login)，选择 **即时通讯** > **服务概览**，将 **设置**下的 **用户注册模式** 设置为 **开放注册**。

```java
// 注册失败会抛出 HyphenateException。
EMClient.getInstance().createAccount(mAccount, mPassword);// 同步方法。
```

:::notice
该注册模式为在客户端注册，旨在方便测试，并不推荐在正式环境中使用。
:::

## 用户登录

目前登录服务器支持手动和自动登录。手动登录有两种方式：

- 用户 ID + 密码
- 用户 ID + token

手动登录时传入的用户 ID 必须为 String 类型，支持的字符集详见[用户注册的 RESTful 接口](/document/server-side/account_system.html#注册用户)。

调用登录接口后，收到 `onConnected` 回调表明 SDK 与环信服务器连接成功。

### 手动登录

**用户 ID + 密码** 登录是传统的登录方式。用户名和密码均由你的终端用户自行决定，密码需要符合密码规则要求。

```java
EMClient.getInstance().login(mAccount, mPassword, new EMCallBack() {
    // 登录成功回调
    @Override
    public void onSuccess() {

    }

    // 登录失败回调，包含错误信息
    @Override
    public void onError(int code, String error) {

    }

});
```

**用户 ID + token** 是更加安全的登录方式。token 可以通过调用 REST API 获取。详见 [环信用户 token 的获取](/document/server-side/easemob_user_token.html)。

:::notice
使用 token 登录时需要处理 token 过期的问题，比如在每次登录时更新 token 等机制。
:::

```java
EMClient.getInstance().loginWithToken(mAccount, mToken, new EMCallBack() {
    // 登录成功回调
    @Override
    public void onSuccess() {

    }

    // 登录失败回调，包含错误信息
    @Override
    public void onError(int code, String error) {

    }
});
```

登录重试机制如下：

- 登录时，若服务器返回明确的失败原因，例如，token 不正确，SDK 不会重试登录。
- 若登录因超时失败，SDK 会重试登录。

### 自动登录

初始化时可以设置是否自动登录。如果设置为自动登录，则登录成功之后，后续启动初始化的时候会自动登录。

自动登录时，SDK 尝试连接服务器失败后，延时随机一段时间后自动重连。

## 退出登录

同步方法：

```java
EMClient.getInstance().logout(true);
```

异步方法：

```java
EMClient.getInstance().logout(true, new EMCallBack() {

    @Override
    public void onSuccess() {

    }

    @Override
    public void onError(int code, String message) {

    }
});
```

## 连接状态相关

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
    public void onTokenWillExpire() {

    }

    @Override
    public void onTokenExpired() {

    }
};
// 注册连接状态监听
EMClient.getInstance().addConnectionListener(connectionListener);
// 移除连接状态监听
EMClient.getInstance().removeConnectionListener(connectionListener);
```

### 断网自动重连

如果由于网络信号弱、切换网络等引起的连接终端，SDK 会自动尝试重连。重连成功或者失败的结果分别会收到通知 `onConnected` 和 `onDisconnected`。

### 被动退出登录

你可以通过监听回调 `EMConnectionListener#onLogout(int)` 后，调用 `EMClient#logout(boolean, EMCallBack)` 进行退出并返回登录界面。

`EMConnectionListener#onLogout(int)` 返回的 `errorCode` 有如下：

- `USER_LOGIN_ANOTHER_DEVICE=206`: 用户已经在其他设备登录
- `USER_REMOVED=207`: 用户账户已经被移除
- `USER_BIND_ANOTHER_DEVICE=213`: 用户已经绑定其他设备
- `USER_LOGIN_TOO_MANY_DEVICES=214`: 用户登录设备超出数量限制
- `USER_KICKED_BY_CHANGE_PASSWORD=216`: 由于密码变更被踢下线
- `USER_KICKED_BY_OTHER_DEVICE=217`: 由于其他设备登录被踢下线
- `USER_DEVICE_CHANGED=220`: 和上次设备不同导致下线
- `SERVER_SERVING_DISABLED=305`: 服务器服务停止

以上参数具体可以参考 [EMError](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1_e_m_error.html) 对应说明。

## 输出信息到日志文件

开发者可以在开发阶段开启 `DEBUG` 模式，获取更多的调试信息。

```java
// 需要在 SDK 初始化后调用
EMClient.getInstance().setDebugMode(true);
```

### 获取本地日志

```shell
adb pull /sdcard/android/data/{应用包名}/{App Key}/core_log/easemob.log
```

获取本地日志，需要将 `{应用包名}` 替换为应用的包名，例如 `com.hyphenate.chatuidemo`；`{App Key}` 需要替换为应用设置的环信 App Key。
