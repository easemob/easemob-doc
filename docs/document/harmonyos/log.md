# SDK 日志

环信即时通讯 IM 日志记录 SDK 相关的信息和事件。环信技术支持团队帮你排查问题时可能会请你发送 SDK 日志。

## 输出信息到日志文件

环信即时通讯 IM 日志记录 SDK 相关的信息和事件。环信技术支持团队帮你排查问题时可能会请你发送 SDK 日志。

默认情况下，SDK 的普通日志保留一个正在写入的 `easemob.log`，以及最多三个 `easemob_YYYY-MM-DD_HH-MM-SS.log` 历史文件，共最多四个文件。SDK 在写入日志后检查累计大小，达到 5 MB 的文件切换阈值时，将 `easemob.log` 按当时的系统本地时间重命名为历史文件。如果历史文件超过三个，则按文件名中的时间戳顺序删除最早的文件，直到剩余三个，随后新建 `easemob.log` 继续写入。由于大小检查发生在写入之后，单个文件的实际大小可能超过该阈值。

例如，SDK 在 2024 年 1 月 1 日 8:00:00 创建 `easemob.log`，8:30:00 达到文件切换阈值后，将其重命名为 `easemob_2024-01-01_08-30-00.log`，并新建 `easemob.log` 继续写入。此后，假设又分别在 9:30:30、10:30:30 和 11:30:30 达到文件切换阈值，则依次生成对应时间的历史文件。10:30:30 生成第三个历史文件时，历史文件数为三个，无需删除；11:30:30 生成第四个历史文件时，SDK 删除最早的 `easemob_2024-01-01_08-30-00.log`，保留最新的三个历史文件和一个正在写入的 `easemob.log`。

SDK 默认输出调试信息（所有日志，包括调试信息、警告和错误）。如果只需输出错误日志，在初始化 SDK 前通过 `ChatOptions` 将日志级别设置为 `ERROR_LEVEL`。

```typescript
const options = new ChatOptions({ appKey: "your_org#your_app" });
options.setLogLevel(ChatLogLevel.ERROR_LEVEL);
ChatClient.getInstance().init(context, options);
```

## 获取本地日志

打开以下目录，获取本地日志。

```
hdc file recv "/data/app/el2/100/base/{应用包名}/haps/{模块名}/{应用标识}/core_log"
```

获取本地日志时，需要将 `{应用包名}` 替换为应用的包名，例如 `com.hyphenate.chatuidemo`；`{模块名}` 替换为应用的模块名，例如 `entry`；`{应用标识}` 根据初始化 SDK 时使用的应用标识，替换为环信 App Key 或 App ID。
