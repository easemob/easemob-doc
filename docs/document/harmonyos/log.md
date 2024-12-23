# SDK 日志

环信即时通讯 IM 日志记录 SDK 相关的信息和事件。环信技术支持团队帮你排查问题时可能会请你发送 SDK 日志。

## 输出信息到日志文件

环信即时通讯 IM 日志记录 SDK 相关的信息和事件。环信技术支持团队帮你排查问题时可能会请你发送 SDK 日志。

默认情况下，SDK 最多可生成和保存三个文件，`easemob.log` 和两个 `easemob_YYYY-MM-DD_HH-MM-SS.log` 文件。这些文件为 UTF-8 编码，每个不超过 2 MB。SDK 会将最新的日志写入 `easemob.log` 文件，写满时则会将其重命名为对应时间点的 `easemob_YYYY-MM-DD_HH-MM-SS.log` 文件，若日志文件超过三个，则会删除最早的文件。

例如，SDK 在 2024 年 1 月 1 日上午 8:00:00 记录日志时会生成 `easemob.log` 文件，若在 8:30:00 将 `easemob.log` 文件写满则会将其重命名为 `easemob_2024-01-01_08-30-00.log` 文件，随后在 9:30:30 和 10:30:30 分别生成了 `easemob_2024-01-01_09-30-30.log` 和 `easemob_2024-01-01_10-30-30.log` 文件，则此时 `easemob_2024-01-01_08-30-00.log` 文件会被移除。

SDK 默认输出调试信息（所有日志，包括调试信息、警告和错误），如果只需输出错误日志，需要关闭调试模式。

```typescript
ChatLog.setLogLevel(ChatLogLevel.ERROR_LEVEL);
```

## 获取本地日志

打开以下目录，获取本地日志。

```
hdc file recv /data/app/el2/100/base/{应用包名}/{App Key}/core_log
```

获取本地日志，需要将 `{应用包名}` 替换为应用的包名，例如 `com.hyphenate.chatuidemo`；`{App Key}` 需要替换为应用的环信 App Key。