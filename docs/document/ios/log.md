# SDK 日志

环信即时通讯 IM SDK 会记录运行过程中的相关信息和事件。排查问题时，环信技术支持团队可能会要求提供 SDK 日志。

## 输出信息到日志文件

默认情况下，SDK 最多生成并保留三个日志文件：一个当前日志文件 `easemob.log`，以及两个按时间戳命名的历史日志文件 `easemob_YYYY-MM-DD_HH-MM-SS.log`。日志文件采用 UTF-8 编码，单个文件最大为 5 MB。

SDK 将最新日志写入 `easemob.log`。该文件写满后会被重命名为对应时间点的历史日志文件，并重新创建 `easemob.log`。当日志文件数量超过三个时，SDK 会删除最早的历史日志文件。

例如，SDK 在 2024 年 1 月 1 日 08:00:00 开始记录日志时会生成 `easemob.log`。若该文件在 08:30:00 写满，则会重命名为 `easemob_2024-01-01_08-30-00.log`。后续产生新的历史日志文件时，如果日志文件总数超过三个，最早的历史日志文件会被移除。

`EMOptions#logLevel` 用于设置日志输出级别，默认值为 `EMLogLevelDebug`：

- `EMLogLevelDebug`：输出所有级别的日志。
- `EMLogLevelWarning`：输出警告和错误日志。
- `EMLogLevelError`：仅输出错误日志。

开发阶段如需在 Xcode Console 中输出 SDK 日志，可在初始化 SDK 前设置 `enableConsoleLog`：

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"<#appkey#>"];

// 输出 SDK 日志到 Xcode Console。
options.enableConsoleLog = YES;

// 设置日志级别，默认值为 EMLogLevelDebug。
options.logLevel = EMLogLevelDebug;

[[EMClient sharedClient] initializeSDKWithOptions:options];
```

## 监听日志输出

iOS SDK V5 支持通过 `EMLogDelegate` 监听 SDK 输出的日志。注册日志代理时可以指定回调队列；若传入 `nil`，SDK 默认在主队列执行回调。

```objectivec
@interface LogListener : NSObject <EMLogDelegate>
@end

@implementation LogListener

- (void)logDidOutput:(NSString *)log {
    // 处理 SDK 输出的日志。
    NSLog(@"SDK 日志：%@", log);
}

@end

LogListener *listener = [[LogListener alloc] init];

// 应持有 listener 的强引用，避免其被提前释放。
[[EMClient sharedClient] addLogDelegate:listener delegateQueue:nil];

// 不再需要监听时移除代理。
[[EMClient sharedClient] removeLogDelegate:listener];
```

## 获取本地日志

SDK 将数据写入应用沙箱的 `Library/Application Support/HyphenateSDK` 目录。日志文件位于其 `easemobLog` 子目录中：

```text
Library/Application Support/HyphenateSDK/easemobLog
```

以真机为例，获取本地日志的步骤如下：

1. 打开 Xcode，连接设备，然后选择 **Xcode > Window > Devices and Simulators**。
2. 在 **Devices** 选项卡中选择目标设备和应用。
3. 点击设置图标，选择 **Download Container** 下载应用沙箱。
4. 在下载包的 `AppData/Library/Application Support/HyphenateSDK/easemobLog` 目录中获取 `easemob.log` 及历史日志文件。

![img](/images/ios/overview_fetchlogfile.png)
