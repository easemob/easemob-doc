# 使用 uni-app 原生离线推送插件

自 SDK 5.1.2 起，即时通讯 IM 支持在 uni-app 原生 App 中接入 [`easemob-push` UTS 插件](https://ext.dcloud.net.cn/plugin?id=29622)。当用户离线时，即时通讯 IM 可通过已配置的第三方推送通道向用户设备发送消息通知。

目前支持 APNs、FCM、华为、小米、魅族、vivo、OPPO 和荣耀推送。

`easemob-push` 插件负责向厂商通道或 APNs 注册、获取设备 Push Token，并将用户点击系统通知的数据回传给应用；离线通知由环信服务端经第三方推送通道下发并显示，插件本身不负责生成或展示通知。SDK 中的 `PushManager` 负责调用插件、匹配环信证书、绑定和更新 Token，以及退出登录时的解绑。通知点击、通知权限、角标和通知栏操作由应用直接调用插件处理。

:::tip
本文介绍通过 `uni_modules/easemob-push` 集成的 UTS 插件。旧版 `EMPushUniPlugin` 原生插件及 `uni.requireNativePlugin('EMPushUniPlugin')` 不再是推荐接入方式。该插件不支持 H5、小程序和 HarmonyOS NEXT。
:::

## 前提条件

1. 在 [环信控制台](https://console.easemob.com/user/login) [注册账号](/product/console/account_register.html)，并[创建应用](/product/console/app_create.html)。
2. 了解环信即时通讯 IM 的使用限制，详见[使用限制](/product/limitation.html)。
3. 将 Web SDK 升级至 5.1.2 或以上版本。
4. 安装 HBuilderX 3.97.0 或以上版本。
5. 在第三方推送服务中创建应用，并准备相应的应用配置、签名或证书。
6. 使用自定义基座或云打包版本在真机上运行。标准运行基座不包含该插件的原生代码。
7. 若使用推送模板，需在环信控制台激活该功能。激活后如需关闭推送模板功能，请联系商务；关闭操作会删除推送模板的相关配置。

各推送通道的适用条件如下：

- 小米推送：适用于小米和 Redmi 设备。
- 华为推送：适用于华为设备和使用 EMUI 的老荣耀设备。
- 魅族推送：适用于魅族设备。
- OPPO 推送：适用于 OPPO、一加和 realme 设备。
- vivo 推送：适用于 vivo 和 iQOO 设备。
- 荣耀推送：适用于使用 MagicOS 的新荣耀设备。
- APNs：适用于 Apple 设备。
- FCM：适用于安装了 Google Play 服务的 Android 设备，且必须使用离线打包。

Android 插件只会为当前设备选择一条推送通道：优先使用已配置且具备 Firebase/GMS 依赖的 FCM；否则选择当前品牌对应的厂商通道；均不满足时回退到 `normal`。`normal` 不具备厂商离线推送能力。iOS 固定使用 APNs。

## 实现流程

### 步骤 1：上传推送证书至环信控制台

1. 在第三方推送服务后台注册应用，获取应用信息并开启推送服务。
2. 在 [环信控制台](https://console.easemob.com/user/login) 上传对应的推送证书或配置通道参数，并记录证书名称。该名称需要与调用 `setNativePush()` 时配置的证书名称一致。

:::tip
更多详情，请参见 [Android 离线推送](/document/android/push/push_overview.html)和 [iOS 离线推送](/document/ios/push/push_overview.html)。
:::

### 步骤 2：配置 uni-app 应用

1. 从 [DCloud 插件市场](https://ext.dcloud.net.cn/plugin?id=29622) 导入 `easemob-push`，确认插件位于业务工程的 `uni_modules/easemob-push` 目录。
2. 在 `manifest.json` 中启用 App Push，并将 `pushRegisterMode` 设置为 `manual`。不要同时启用 uniPush 1.0 或 uniPush 2.0。
3. 根据目标通道完成 Android 厂商推送参数或 iOS APNs 能力配置。FCM 的离线打包配置请参见 [离线打包集成 FCM](uniapp_push_fcm.html)。
4. 重新制作自定义基座或使用云打包。标准运行基座不包含该插件的原生代码。

:::tip
1. 修改厂商参数、包名、证书、签名或原生依赖后，需要重新制作自定义基座。各厂商的应用信息、签名和系统能力配置要求，以对应厂商及 uni-app 的文档为准。
2. 华为推送通道仅支持 Android，不支持 HarmonyOS NEXT。
:::

#### 配置 Android 厂商参数

环信证书名称只用于服务端绑定。Android 厂商 SDK 还需要在宿主工程中配置 App ID、App Key 或证书文件，并确保包名和签名与厂商开放平台中的配置一致。

在 uni-app 工程根目录创建 `AndroidManifest.xml`，按需配置使用的厂商通道：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="你的应用包名">
    <application>
        <!-- 小米：纯数字建议添加 push_ 前缀，避免被解析为数值。 -->
        <meta-data android:name="XIAO_MI_APP_ID" android:value="push_你的小米AppId" />
        <meta-data android:name="XIAO_MI_APP_KEY" android:value="push_你的小米AppKey" />

        <meta-data android:name="OPPO_APP_KEY" android:value="你的OPPO_AppKey" />
        <meta-data android:name="OPPO_APP_SECRET" android:value="你的OPPO_AppSecret" />

        <meta-data android:name="com.vivo.push.app_id" android:value="你的vivo_AppId" />
        <meta-data android:name="com.vivo.push.api_key" android:value="你的vivo_AppKey" />

        <meta-data android:name="MEI_ZU_APP_ID" android:value="push_你的魅族AppId" />
        <meta-data android:name="MEI_ZU_APP_KEY" android:value="你的魅族AppKey" />

        <meta-data android:name="com.hihonor.push.app_id" android:value="你的荣耀AppId" />
    </application>
</manifest>
```

- 只需配置实际使用的厂商通道，`package` 必须与云打包或自定义基座使用的 Android 包名一致。
- 华为推送还需要将 `agconnect-services.json` 放到 `nativeResources/android/assets/agconnect-services.json`，并确保包名、App ID 和签名指纹与 AppGallery Connect 中的配置一致。
- FCM 需要离线打包并在 Android 宿主工程中加入 Firebase 依赖和 `google-services.json`，详见 [离线打包集成 FCM](uniapp_push_fcm.html)。

#### 配置 iOS 推送

在 `manifest.json` 中启用 App Push 并将 `pushRegisterMode` 设为 `manual`，同时在 Apple Developer 中为 Bundle ID 开启 Push Notifications。自定义基座和正式包使用的描述文件、签名以及环信控制台中的 APNs 证书环境必须相互匹配。

### 步骤 3：配置原生推送

UTS 插件以函数形式导出接口。应用只需将 `onRegister` 和 `unRegister` 组装为插件对象，并通过 `pushManager.setNativePush()` 配置插件和通道证书。不要将通知点击、权限、角标等其他插件接口传给 `PushManager`。

```typescript
import { ChatClient, PushManager } from 'easemob-websdk';
import { onRegister, unRegister } from '@/uni_modules/easemob-push';

const pushManager = new PushManager();

const nativePushOptions = {
  plugin: { onRegister, unRegister },
  certificates: {
    apns: 'APNS_CERTIFICATE_NAME',
    fcm: 'FCM_CERTIFICATE_NAME',
    huawei: 'HUAWEI_CERTIFICATE_NAME',
    xiaomi: 'XIAOMI_CERTIFICATE_NAME',
    meizu: 'MEIZU_CERTIFICATE_NAME',
    vivo: 'VIVO_CERTIFICATE_NAME',
    oppo: 'OPPO_CERTIFICATE_NAME',
    honor: 'HONOR_CERTIFICATE_NAME',
  },
};

pushManager.setNativePush(nativePushOptions);

const client = ChatClient.init({
  appKey: 'org#app',
  managers: [pushManager],
});

pushManager.addEventHandler('native-push', {
  onPushTokenBound: event => {
    console.log('Push Token 绑定成功:', event.channel, event.notifierName);
  },
  onPushTokenBindFailed: event => {
    console.warn('Push Token 注册或绑定失败:', event.stage, event.code, event.retryable);
  },
  onPushTokenRemoveFailed: event => {
    console.warn('Push Token 解绑失败:', event.code, event.retryable);
  },
});

await client.login({
  userId: 'alice',
  token: 'IM_TOKEN',
});
```

`certificates` 的字段与推送通道对应关系如下。只需配置实际使用的通道，证书名称必须与环信控制台中的名称完全一致。

| 字段 | 推送通道 |
| :--- | :--- |
| `apns` | APNs |
| `fcm` | FCM |
| `huawei` | 华为 |
| `xiaomi` | 小米 |
| `meizu` | 魅族 |
| `vivo` | vivo |
| `oppo` | OPPO |
| `honor` | 荣耀 |

配置时需注意以下事项：

- `setNativePush()` 可以在登录前或登录后调用。登录前配置会在登录完成后启动 Token 注册和绑定；登录后配置会立即启动。
- Token 的获取和绑定在后台进行，不改变 `login()` 的返回结果。可通过 `onPushTokenBound` 和 `onPushTokenBindFailed` 获取绑定结果。
- `certificates` 至少需要包含一个有效的通道证书名称。插件返回某一推送通道时，必须存在与该通道对应的证书配置。
- 在启用状态下重复设置相同配置属于幂等操作。如需更换插件或证书，必须先成功调用 `removePushToken()`，再通过 `setNativePush()` 设置新配置。
- 推送事件不会返回设备 Push Token 或 IM Token。请勿在业务日志中输出 `onRegister` 的完整返回值。

### 步骤 4：处理通知点击

`PushManager` 只管理设备 Push Token 的生命周期，不处理通知点击、通知权限、角标或通知栏操作。应在 `App.vue` 的 `onLaunch` 中直接调用插件申请通知权限并注册点击监听，不要等待 `ChatClient` 初始化或登录。

应用被杀死后，用户点击通知时原生层可能早于页面完成初始化。插件会缓存一次原生点击数据，应用仍应在 JS 层根据页面就绪状态暂存并消费点击事件，避免冷启动时丢失跳转信息。

```javascript
import {
  addNotificationListener,
  requestNotificationAuthorization,
} from '@/uni_modules/easemob-push';

export default {
  globalData: {
    pushClickPageReady: false,
    pendingPushClicks: [],
  },
  onLaunch() {
    // #ifdef APP-PLUS
    requestNotificationAuthorization(ret => {
      console.log('通知权限状态:', ret.status);
    });

    addNotificationListener(payload => {
      // 仅在用户点击系统通知后回调，不表示消息已经到达。
      if (getApp().globalData.pushClickPageReady) {
        uni.$emit('easemob-push-click', payload);
        return;
      }
      getApp().globalData.pendingPushClicks.push(payload);
    });
    // #endif
  },
};
```

需要处理通知跳转的页面在 `onLoad` 中注册业务监听，并消费冷启动期间暂存的点击数据：

```javascript
onLoad() {
  const handlePushClick = payload => {
    console.log('通知点击数据:', payload);
    // 根据 payload 跳转到对应会话或业务页面。
  };

  uni.$on('easemob-push-click', handlePushClick);

  const pending = getApp().globalData.pendingPushClicks.splice(0);
  pending.forEach(handlePushClick);
  getApp().globalData.pushClickPageReady = true;
}
```

`addNotificationListener()` 只在用户点击系统通知后回调，不表示消息到达。Android 13 及以上系统需要用户授予通知权限；用户拒绝后，可通过插件的 `openSettingsForNotification()` 引导用户前往系统设置。角标设置和通知栏清理等功能也应由应用直接调用插件接口。

### 步骤 5：停用或重新启用推送

登录后，可以调用 `removePushToken()` 停用并解绑当前设备的原生推送。解绑成功后，即使发生临时断线、自动重连或再次登录，SDK 也不会自动恢复推送；如需恢复，需再次调用 `setNativePush()`。

```typescript
// 停用并解绑当前设备推送。
await pushManager.removePushToken();

// 重新启用推送。
pushManager.setNativePush(nativePushOptions);
```

- `removePushToken()` 需要在登录状态下调用。
- 服务端解绑失败时，Promise 会抛出错误，原配置和绑定状态保持不变，可按业务需要重试。
- 显式调用 `client.logout()` 时，SDK 会在清理登录状态前限时尝试解绑 Push Token，随后结束插件注册。解绑失败不会阻止本地退出。
- 应用进入后台、进程被终止或发生可恢复断线时，SDK 不会执行解绑。

### 步骤 6：测试离线推送

浏览器和标准运行基座无法执行 UTS 原生代码。发布前应使用 Android 或 iOS 自定义基座、云打包版本或正式安装包，在真机上验证以下场景：

- 厂商推送或 APNs Token 注册及绑定。
- Token 更新后的重新绑定。
- 终止应用进程后的离线通知接收。
- 通知点击、冷启动及页面跳转。
- 显式退出登录后的 Token 解绑。
- 手动停用和重新启用推送。
- 账号切换后不再使用前一账号的 Token 绑定。

推荐按以下流程验证完整链路：接收方登录后确认 `onPushTokenBound` 回调成功，保持登录并终止应用进程，再由另一账号发送消息。退出登录后 Token 已解绑，不应继续用该状态验证离线推送。

## 常见问题

#### 即时通讯 IM 在哪些情况下不会发送离线推送通知？

应用进入后台或设备锁屏后，如果客户端仍与环信服务器保持在线连接，用户仍被视为在线，不会触发离线推送。客户端断开连接并进入离线状态后，服务端才会根据推送配置发送离线通知。

#### 即时通讯 IM 是否支持多设备离线推送？

你可以在[环信控制台](https://console.easemob.com/user/login)的 **证书配置** 页面配置多设备推送策略。该策略对所有推送通道生效：

- 所有设备离线时，才发送推送消息。
- 任一设备离线时，都发送推送消息。

#### `unRegister()` 和环信侧解绑有什么区别？

`unRegister()` 只结束插件向厂商 SDK 注册和监听 Token，不会单独解除环信服务端的 Token 绑定。Web SDK 5.1.2 及以上版本中，显式调用 `client.logout()` 会自动尝试解绑；如需在保持登录的情况下关闭当前设备的离线推送，请调用 `pushManager.removePushToken()`。

#### 为什么已经配置证书名称，仍然收不到推送？

证书名称只用于环信服务端匹配推送通道。还需确认 Android 厂商 App ID、App Key 或证书文件已写入宿主工程，包名和签名与厂商开放平台一致，并在修改原生配置后重新制作自定义基座。登录后可通过 `onPushTokenBound` 返回的 `channel` 和 `notifierName` 确认实际绑定通道及证书。

#### 标准运行基座可以测试插件吗？

不可以。该插件包含原生代码，必须使用自定义基座、云打包版本或正式安装包在真机上测试；FCM 还必须使用离线打包。
