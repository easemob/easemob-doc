# 集成类问题

<Toc />

## 如何实现跨 app 聊天

如果您需要两个 app 之间可以互相通信，只要将 AppKey 写成同一个就可以实现跨 app 聊天。同时，您需要在环信控制台上传对应 app 的推送证书（可以是多个），这样可以确保您的两个 app 都能收到推送。

## 获取设备本地日志文件

在排查移动端集成或者使用问题的时候，会遇到需要查看设备本地 SDK 的 log 来确认问题，在此提供移动端获取本地 log 的方法。

### Android

#### 通过 API 获取

SDK 的 log 文件在 app 的安装目录中，可以通过 API 获取，获取时需要确保 SDK 已经完成初始化。

通过 API 获取 log 文件路径, 返回格式为 `xxxxx/xxxx/log.gz`

```java
logPath = EMClient.getInstance().compressLogs();
```

#### 从手机或者模拟器获取日志文件

确保满足以下条件：

- 确保电脑上安装了 adb 工具，可以参考 [SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools)
- 手机连接到电脑，adb 的使用可以参考：[Android Debug Bridge]( https://developer.android.com/studio/command-line/adb)

```shell
adb pull  /sdcard/android/data/(your_package_name)/(appkey)/core_log/easemob.log
```

### iOS

#### 通过 API 获取

SDK 的 Log 文件在 app 的 sandbox 中，如需获取可通过 SDK 提供的`getLogFilesPath:` 获取，获取时需要确保SDK已经完成初始化。

```
EMError *error = nil;
NSString *logPath = [EMClient.sharedClient getLogFilesPath:&error];
```

返回格式为 `xxxxx/xxxx/log.gz`。 `error` 为错误信息，无错误是返回`nil`。

#### 从手机或者模拟器获取日志文件

通过 XCode debug 时，可以连接手机或者模拟器，找到应用的 sandbox 目录，然后提取日志文件。

App_Sandbox_path/Application Support/HyphenateSDK/easemobLog

## 消息重发机制 

1. 对于 Android、iOS 、HarmonyOS、Windows 端和三个跨平台框架 Unity、React Native 和 Flutter 来说，消息重发机制如下：

客户端调用发送消息的方法后，会等待服务器返回响应，超时时间为 10 秒。若因响应超时导致发送失败，客户端会再次尝试发送消息，即通过长连接重连服务器，然后发送消息。如果再次失败，SDK 认为消息发送失败，返回服务器不可达的错误消息，即错误码 300，iOS 为 `EMErrorServerNotReachable`，Android, HarmonyOS 和 Windows 为 `SERVER_NOT_REACHABLE`。

2. 对于 Web 来说，消息重发机制如下：

发送消息时，若客户端处于重连中或 WebSocket 已断开，发送请求会立即失败，SDK 抛出 `MessageSendError`，错误码为 300 `MESSAGE_NOT_CONNECTED`。当前 Web SDK V5 不会缓存该次发送请求并在重连成功后自动重发。应用可监听 `onConnected` 事件，在连接恢复后自行重试发送。若消息已发送但未在规定时间内收到服务器 ACK，则 SDK 抛出错误码 301 `MESSAGE_ACK_TIMEOUT`。
