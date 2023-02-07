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
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE”/>
<!-- 允许程序在手机屏幕关闭后后台进程仍然运行 -->
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

## SDK 初始化

初始化是使用 SDK 的必要步骤，需在执行所有接口方法调用前完成。

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

可以使用如下代码创建账号：

```java
// 注册失败会抛出 HyphenateException。
EMClient.getInstance().createAccount(mAccount, mPassword);// 同步方法。
```

:::notice
- 以上注册模式为在客户端注册，旨在方便测试，并不推荐在正式环境中使用；
- 正式环境应使用服务器端调用 REST API 接口[注册用户](https://docs-im.easemob.com/ccim/rest/accountsystem#注册用户)。
:::

## 用户登录

目前登录服务器支持手动和自动登录。手动登录有两种方式：

- 通过 **用户 ID + 密码** 登录；
- 通过 **用户 ID + token** 登录；

:::notice
使用 token 登录时需要处理 token 过期的问题，比如在每次登录时更新 token 等机制。
:::

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

```java
EMClient.getInstance().loginWithToken(mAccount, mPassword, new EMCallBack() {
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

### 自动登录

初始化时可以设置是否自动登录。如果设置为自动登录，则登录成功之后，后续启动初始化的时候会自动登录。

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

以上参数具体可以参考 [EMError](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1_e_m_error.html) 对应说明。

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