# SDK 日志

环信即时通讯 IM 日志记录 SDK 相关的信息和事件。环信技术支持团队帮你排查问题时可能会请你发送 SDK 日志。

## 输出信息到日志文件

默认情况下，SDK 最多可生成和保存三个文件，`easemob.log` 和两个 `easemob_YYYY-MM-DD_HH-MM-SS.log` 文件。这些文件为 UTF-8 编码，每个不超过 2 MB。SDK 会将最新的日志写入 `easemob.log` 文件，写满时则会将其重命名为对应时间点的 `easemob_YYYY-MM-DD_HH-MM-SS.log` 文件，若日志文件超过三个，则会删除最早的文件。

例如，SDK 在 2024 年 1 月 1 日上午 8:00:00 记录日志时会生成 `easemob.log` 文件，若在 8:30:00 将 `easemob.log` 文件写满则会将其重命名为 `easemob_2024-01-01_08-30-00.log` 文件，随后在 9:30:30 和 10:30:30 分别生成了 `easemob_2024-01-01_09-30-30.log` 和 `easemob_2024-01-01_10-30-30.log` 文件，则此时 `easemob_2024-01-01_08-30-00.log` 文件会被移除。

SDK 默认不输出调试信息（所有日志，包括调试信息、警告和错误），只需输出错误日志。若需调试信息，首先要开启调试模式。

```csharp
Options options = new Options("YourAppKey");
options.DebugMode = true;
SDKClient.Instance.InitWithOptions(options);
```

## 获取本地日志

Unity 分为 4 个端：Unity Mac、Unity Windows、Unity iOS、Unity Android。

- Unity Mac

日志路径： /Users/XXX/Library/Application Support/YYY/ZZZ/sdkdata/easemobLog 或者 /Users/XXX/Library/Application Support/com.YYY.ZZZ/sdkdata/easemobLog

XXX: Mac 用户名; YYY: Unity 中设置的公司名称，如果没有设置则为 `DefaultCompany`，ZZZ 为 app 名称。

- Unity Windows

日志路径：C:\Users\XXX\AppData\LocalLow\YYY\ZZZ\sdkdata\easemobLog

XXX：Windows 用户名; YYY: Unity 中设置的公司名称，如果没有设置则为 `DefaultCompany`，ZZZ 为 app 名称。

- Unity iOS 

本地日志的获取与 iOS 的相同，详见 [iOS 本地日志的获取](/document/ios/log.html#获取本地日志)。

日志路径：沙箱 Library/Application Support/HyphenateSDK/easemobLog。

以真机为例，获取本地日志过程如下：

- 打开 Xcode，连接设备，选择 **Xcode** > **Window** > **Devices and Simulators**。
- 进入 **Devices** 选项卡，在左侧选择目标设备，例如 Easemob IM，点击设置图标，然后选择 **Download Container**。

![img](/images/ios/overview_fetchlogfile.png)

日志文件 `easemob.log` 文件在下载包的 AppData/Library/Application Support/HyphenateSDK/easemobLog 目录下。

- Unity Android

在 Android Studio 中，选择 **View** > **Tool Windows** > **Device File Explorer**，然后浏览设备上的文件夹。

日志路径为 /data/data/<your_package_name>/sdkdata/easemobLog。