
# SDK 日志

环信即时通讯 IM 日志记录 SDK 相关的信息和事件。环信技术支持团队帮你排查问题时可能会请你发送 SDK 日志。

## 开启调试日志

如果开启日志调试模式，会通过控制台输出 SDK 日志。初始化 SDK 时，将 `ChatOptions#debugModel` 设置为 `true`，默认值为 `false`。该配置同时用于 JavaScript 层日志输出和原生 SDK 的调试输出；生产环境建议关闭调试模式。

```typescript
async function initializeSdk(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: '<your appKey>',
      // 开启调试日志输出
      debugModel: true,
    });
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}
```

## 获取原生 SDK 日志

SDK 初始化完成后，可调用 `ChatClient#compressLogs` 获取打包后的原生 SDK 日志文件路径，返回 `Promise<string | undefined>`。应用可按需将该文件导出并提供给技术支持。该接口不会自动收集 JavaScript 控制台日志，也不会自动上传日志。

```typescript
async function exportSdkLogs(): Promise<void> {
  try {
    // 获取打包后的原生 SDK 日志文件路径
    const logPath = await ChatClient.getInstance().compressLogs();
    if (logPath) {
      console.log('SDK 日志文件路径：', logPath);
    } else {
      console.warn('未返回 SDK 日志文件路径');
    }
  } catch (error: unknown) {
    console.error('获取 SDK 日志失败：', error);
  }
}
```
