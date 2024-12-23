# SDK 日志

环信即时通讯 IM 日志记录 SDK 相关的信息和事件。环信技术支持团队帮你排查问题时可能会请你发送 SDK 日志。

## 输出信息到日志文件

默认情况下，SDK 最多可生成和保存三个文件，`easemob.log` 和两个 `easemob_YYYY-MM-DD_HH-MM-SS.log` 文件。这些文件为 UTF-8 编码，每个不超过 2 MB。SDK 会将最新的日志写入 `easemob.log` 文件，写满时则会将其重命名为对应时间点的 `easemob_YYYY-MM-DD_HH-MM-SS.log` 文件，若日志文件超过三个，则会删除最早的文件。

例如，SDK 在 2024 年 1 月 1 日上午 8:00:00 记录日志时会生成 `easemob.log` 文件，若在 8:30:00 将 `easemob.log` 文件写满则会将其重命名为 `easemob_2024-01-01_08-30-00.log` 文件，随后在 9:30:30 和 10:30:30 分别生成了 `easemob_2024-01-01_09-30-30.log` 和 `easemob_2024-01-01_10-30-30.log` 文件，则此时 `easemob_2024-01-01_08-30-00.log` 文件会被移除。

SDK 的 `EMOptions#logLevel` 指定了日志输出级别，默认为 `EMLogLevelDebug`，即所有等级日志。

- (默认)EMLogLevelDebug：所有等级的日志；
- EMLogLevelWarning：警告及错误；
- EMLogLevelError：错误。

开发阶段若希望在 XCode console 上输出 SDK 日志，可在 SDK 初始化时打开开关。

```objectivec
EMOptions* option = [EMOptions optionsWithAppkey:@"<#appkey#>"];
// 日志输出到 XCode console
option.enableConsoleLog = YES;
// 调整日志输出级别，默认为所有级别。
option.logLevel = EMLogLevelDebug;
[EMClient.sharedClient initializeSDKWithOptions:option];
```

## 获取本地日志

SDK 会写入日志文件到本地。日志文件路径如下：沙箱 Library/Application Support/HyphenateSDK/easemobLog。

以真机为例，获取本地日志过程如下：

- 打开 Xcode，连接设备，选择 **Xcode** > **Window** > **Devices and Simulators**。
- 进入 **Devices** 选项卡，在左侧选择目标设备，例如 Easemob IM，点击设置图标，然后选择 **Download Container**。

![img](/images/ios/overview_fetchlogfile.png)

日志文件 `easemob.log` 文件在下载包的 `AppData/Library/Application Support/HyphenateSDK/easemobLog` 目录下。