# 离线打包集成 FCM

FCM 是 uni-app 原生离线推送支持的 Android 通道之一，适用于安装了 Google Play 服务的设备。本文介绍 FCM 特有的 Firebase 配置和 Android 离线打包流程。开始前，请先按照 [uni-app 原生离线推送集成](uniapp_push.html) 引入 [`easemob-push` UTS 插件](https://ext.dcloud.net.cn/plugin?id=29622)、启用 App Push，并将 `pushRegisterMode` 设置为 `manual`。

:::warning
FCM 必须使用 Android 离线打包。云打包和标准运行基座不包含本文所需的 Firebase/GMS 依赖，无法用于验证 FCM 通道。
:::

## 在 uni-app 中配置 FCM

完成 Firebase、环信控制台和离线打包配置后，将环信控制台中的 FCM 证书名称配置到 `pushManager.setNativePush()` 的 `certificates.fcm`。登录成功后，SDK 会通过 UTS 插件获取 FCM Token，并自动完成 Token 绑定和更新。

```typescript
import { ChatClient, PushManager } from 'easemob-websdk';
import { onRegister, unRegister } from '@/uni_modules/easemob-push';

const pushManager = new PushManager();

pushManager.setNativePush({
  plugin: { onRegister, unRegister },
  certificates: {
    // 该值为环信控制台中配置的 FCM 证书名称。
    fcm: 'FCM_CERTIFICATE_NAME',
  },
});

const client = ChatClient.init({
  appKey: 'org#app',
  managers: [pushManager],
});

pushManager.addEventHandler('fcm-push', {
  onPushTokenBound: event => {
    console.log('FCM Token 绑定成功:', event.channel, event.notifierName);
  },
  onPushTokenBindFailed: event => {
    console.warn('FCM Token 注册或绑定失败:', event.stage, event.code, event.retryable);
  },
  onPushTokenRemoveFailed: event => {
    console.warn('FCM Token 解绑失败:', event.code, event.retryable);
  },
});

await client.login({
  userId: 'alice',
  token: 'IM_TOKEN',
});
```

显式调用 `client.logout()` 时，SDK 会在清理登录状态前限时尝试解绑 FCM Token；解绑失败不会阻止本地退出。`removePushToken()` 只能在登录状态下调用；如需手动停用当前设备推送，可调用 `await pushManager.removePushToken()`。手动解绑成功后，需再次调用 `setNativePush()` 才会重新启用推送。完整生命周期和通知点击处理方式请参见 [uni-app 原生离线推送集成](uniapp_push.html)。

## 配置通知权限

离线打包时，请检查最终生成的 `AndroidManifest.xml` 是否包含网络和通知相关权限。例如：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <!-- Android 13 及以上系统的通知权限。 -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
</manifest>
```

Android 13 及以上系统还需要在运行时申请通知权限。仅在 `AndroidManifest.xml` 中声明 `POST_NOTIFICATIONS`，不会自动获得用户授权。应用可在 `App.vue` 的 `onLaunch` 中调用插件的 `requestNotificationAuthorization()`；完整示例请参见 [处理通知点击](uniapp_push.html#步骤-4-处理通知点击)。

图片、视频和文件存储权限不是接收 FCM 通知的必要条件。如果应用需要访问媒体或本地文件，应根据实际业务功能和目标 Android 版本单独申请，不要将其作为 FCM 的固定依赖。

## 配置 FCM

1. 进入 [Firebase 控制台](https://console.firebase.google.com/)，创建项目并注册 Android 应用。Firebase 中配置的 Android 包名需与实际打包应用一致。
2. 按照 [FCM Android 客户端集成文档](https://firebase.google.com/docs/cloud-messaging/android/client?hl=zh-cn)完成 Firebase 项目配置，并下载 `google-services.json`。
3. 在环信控制台配置 FCM 推送证书或凭证，并记录证书名称。该名称必须与 `certificates.fcm` 中的值一致。

![FCM配置](/images/applet/fcm_android_config.png)

## 配置 Android 离线打包工程

### 1. 配置 Firebase 依赖

`easemob-push` 插件不会为离线打包工程自动补齐 Firebase/GMS 依赖。请按照插件、Firebase 和 DCloud 当前版本的要求，在 Android 宿主工程中配置 Google Services 插件以及 Firebase Messaging、Google Play Services 等所需依赖。缺少这些依赖时，插件会跳过 FCM 通道。

Firebase 依赖版本会持续更新，不建议在 Web SDK 文档中固定版本号。请使用 Firebase 官方推荐的 BoM 或兼容版本组合，具体配置以 [FCM Android 客户端集成文档](https://firebase.google.com/docs/cloud-messaging/android/client?hl=zh-cn)、DCloud 离线打包文档和插件页面为准。

### 2. 添加 Firebase 配置文件

将从 Firebase 控制台下载的 `google-services.json` 放入 Android 工程的 App 模块目录，例如 `app/google-services.json`。文件中的包名必须与实际应用包名一致。

![FCM配置文件](/images/applet/native-app_fcm_config.png)

### 3. 打包 App 资源

使用 HBuilderX 将 uni-app 项目生成本地打包 App 资源，并将资源放入 Android 离线打包工程的 `app/src/main/assets/apps` 目录。

![构建资源](/images/applet/build_native_app_res.png)

### 4. 配置 App 资源

修改 `app/src/main/assets/data/dcloud_control.xml`，确保其中的 App ID 与 `app/src/main/assets/apps` 下的应用资源目录名称一致。

![配置资源](/images/applet/native_config_app_res.png)

### 5. 配置 DCloud AppKey

在 Android 工程的 `AndroidManifest.xml` 中配置 `dcloud_appkey`。具体文件路径可能因 DCloud 离线打包工程版本而异，请以当前工程结构和 DCloud 文档为准。

有关 AppKey 的申请和配置方式，请参见 [DCloud AppKey 配置文档](https://nativesupport.dcloud.net.cn/AppDocs/usesdk/appkey.html)。

## 打包与验证

1. 使用 Android Studio 打开离线打包工程，构建并安装应用到支持 FCM 的 Android 真机。
2. 通过 FCM 控制台发送测试消息，确认 Firebase 原生通知链路和通知权限配置有效。

   ![测试消息](/images/applet/fcm_send_test_message.png)

3. 启动应用并登录 IM，监听 `onPushTokenBound`，确认回调中的 `channel` 为 `fcm`，且 `notifierName` 与环信控制台中的 FCM 证书名称一致。
4. 终止接收方应用进程，再从另一个 IM 账号发送消息，确认设备能够收到环信离线推送通知。
5. 验证通知点击和冷启动后的页面跳转。
6. 显式调用 `client.logout()`，确认当前账号的设备 Token 已解绑；切换账号后，确认不会继续使用前一账号的绑定。
7. 如业务支持手动关闭推送，验证 `removePushToken()` 停用以及重新调用 `setNativePush()` 恢复推送的流程。

:::tip
通过 FCM 控制台发送测试消息只能验证 Firebase 原生通知链路。只有完成 IM 登录、Token 绑定，并由另一 IM 账号发送消息，才能验证环信离线推送的完整链路。
:::
