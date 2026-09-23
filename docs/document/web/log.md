# SDK 日志

环信即时通讯 IM 日志记录 SDK 相关的信息。环信技术支持团队帮你排查问题时可能会请你发送 SDK 日志。

## 日志级别

SDK 支持以下日志级别：

| 级别 | 值 | 说明 |
| :--- | :--- | :--- |
| 调试 | `'DEBUG'` | 输出调试日志。 |
| 警告 | `'WARN'` | 输出警告日志。 |
| 错误 | `'ERROR'` | 输出错误日志。 |

配置日志级别的示例代码如下：

```typescript
setLogLevel('WARN');
```

## 控制台输出和日志回调

自 SDK 5.1.2 起，你可以调用 `setConsoleLogEnabled` 单独控制 SDK 是否向运行环境控制台输出日志。SDK 还支持通过 `onLog` 事件接收已经组装并脱敏的结构化日志，日志条目包含 `timestamp`、`level`、`message` 和 `args` 字段。关闭控制台输出不会影响 `onLog` 回调或日志上报。

```typescript
// 关闭 SDK 控制台日志；不影响 onLog 和日志上报。
setConsoleLogEnabled(false);

client.addEventHandler('log-listener', {
  onLog: entry => {
    // entry 已由 SDK 脱敏，业务侧可统一收集和处理。
    applicationLogger.write(entry);
  },
});
```

## 日志上报

SDK 支持日志上报功能, 即将日志会上报到环信的服务器。该功能默认关闭，如有需要, 可联系商务开通。