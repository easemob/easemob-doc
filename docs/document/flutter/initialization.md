# SDK 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

:::tip
需要在主进程中进行初始化。
:::

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信即时通讯云控制台的相关文档](/product/enable_and_configure_IM.html#创建应用)。

## 初始化

初始化示例代码：

```dart
EMOptions options = EMOptions.withAppKey(appKey);
await EMClient.getInstance.init(options);
```

对于 Flutter SDK 4.13.0 及以上版本，初始化时支持设置 `ExtSettings.kDisableIosEnterBackground` 参数，用于控制是否在 iOS 端应用进入和返回后台时调用 iOS SDK 的以下两种方法：

- `applicationDidEnterBackground`：调用该方法会断开连接。
- `applicationWillEnterForeground` ：调用该方法后会重新链接。

该功能默认开启，若要关闭，可进行如下设置：

```dart
EMOptions options = EMOptions.withAppKey(
    appKey,
    extSettings: {ExtSettings.kDisableIosEnterBackground: true},
);
await EMClient.getInstance.init(options);
```
