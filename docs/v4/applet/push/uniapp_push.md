# 使用 uni-app 原生离线推送插件

## 功能说明

环信 uni-app 原生应用可通过 `easemob-push` UTS 插件接入 APNs、FCM、华为、小米、魅族、vivo、OPPO 和荣耀推送。本文以插件 0.2.1 为依据；HarmonyOS NEXT 自插件 0.2.0 起支持，需按 [集成 HarmonyOS 推送](uniapp_push_harmony.html) 单独配置。

UTS 插件通过函数接口获取厂商 Token，并回传通知点击。V4 SDK 在登录成功后调用插件、匹配证书并上传 Token；通知权限、通知点击、角标和通知栏清理由应用直接调用插件处理。本文替换旧版 ZIP 包、`nativeplugins` 目录及 `uni.requireNativePlugin('EMPushUniPlugin')` 的接入方式。

## 技术原理

应用先调用 `initPushModule()` 读取宿主厂商配置，再在登录前通过 `conn.usePlugin({ emPush: { onRegister }, config }, 'push')` 配置插件。登录连接建立后，SDK 调用 `onRegister()`，根据返回的 `push_type` 选择证书并将设备 Token 上传至环信服务器。离线通知由环信服务端经第三方推送通道下发；通知点击不会触发消息到达事件。

Android 优先选择已配置且具有 Firebase/GMS 依赖的 FCM，否则选择当前品牌对应且配置齐全的厂商通道；无可用通道时返回 `push_type=8`（NORMAL），不具备厂商离线推送能力。iOS 固定使用 APNs（`push_type=0`）。鸿蒙使用独立的 `push_type=9`，不能复用 Android 华为 HMS 的 `2`。

## 前提条件

- 已在 [环信控制台](https://console.easemob.com/user/login) [创建应用](/product/console/app_create.html)，并了解 [使用限制](/product/limitation.html)。
- 使用 SDK 4.14.0 或以上版本，并完成 [初始化](/v4/applet/initialization.html) 和 [登录](/v4/applet/login.html) 集成。
- 使用 HBuilderX 4.31.0 或以上版本，符合当前插件包的版本要求。Android 最低支持 Android 5.0（API 21），iOS 最低支持 iOS 12。
- 准备第三方应用参数、签名和推送证书，在包含插件原生代码的自定义基座或正式安装包上进行真机验证。标准运行基座、H5 和小程序不能运行该插件。
- 使用 FCM 时，设备需具备 Google Play 服务，且必须离线打包并加入 Firebase/GMS 依赖。
- 使用推送模板前，需在环信控制台激活推送高级功能；激活后如需关闭，请联系商务，关闭操作会删除相关配置。

## 实现流程

### 步骤 1：上传推送证书至环信控制台

1. 在第三方推送服务后台注册应用，获取应用信息并开启推送服务。
2. 在 [环信控制台](https://console.easemob.com/user/login) 上传对应的推送证书或配置通道参数，并记录证书名称。该名称需要与调用 `usePlugin()` 时配置的证书名称一致。

:::tip
更多详情，请参见 [Android 离线推送](/v4/android/push/push_overview.html) 和 [iOS 离线推送](/v4/ios/push/push_overview.html)。
:::

### 步骤 2：配置 uni-app 应用

1. 从 [DCloud 插件市场](https://ext.dcloud.net.cn/plugin?id=29622) 导入 `easemob-push`，确认插件位于业务工程的 `uni_modules/easemob-push` 目录。
2. 在 `manifest.json` 中启用 App Push，并将 `pushRegisterMode` 设置为 `manual`。不要同时启用 uniPush 1.0 或 uniPush 2.0。
3. 根据目标通道完成 Android 厂商推送参数或 iOS APNs 能力配置。FCM 的离线打包配置请参见 [离线打包集成 FCM](uniapp_push_fcm.html)。
4. 重新制作自定义基座或使用云打包。标准运行基座不包含该插件的原生代码。

:::tip
1. 修改厂商参数、包名、证书、签名或原生依赖后，需要重新制作自定义基座。各厂商的应用信息、签名和系统能力配置要求，以对应厂商及 uni-app 的文档为准。
2. Android 华为 HMS 推送配置不能用于 HarmonyOS NEXT。鸿蒙设备需单独配置 HarmonyOS Push Kit。
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

### 步骤 3：配置 V4 SDK 推送插件

UTS 的 JS 代理只导出函数，不导出 `EMPushUniPlugin` 实例。将 `onRegister` 组装为 V4 SDK 要求的 `emPush` 对象，其他插件接口由应用直接调用。

Android 必须先调用 `initPushModule()` 填充厂商配置，再让 SDK 调用 `onRegister()`。原生启动钩子仅安装生命周期监听，不会扫描这些参数；漏掉初始化时，厂商推送可能回退到 NORMAL。

在业务工程的 `utils/WebIM.js` 中创建并导出连接实例。只需配置实际使用的通道，证书名称必须与环信控制台完全一致。

```javascript
import EasemobChat from 'easemob-websdk/uniApp/Easemob-chat';
// #ifdef APP-PLUS
import { initPushModule, onRegister } from '@/uni_modules/easemob-push';
// #endif

const conn = new EasemobChat.connection({
  appKey: 'org#app',
  isFixedDeviceId: true,
});

// #ifdef APP-PLUS
initPushModule(ret => {
  console.log('已配置推送通道:', ret.pushConfigTypes);
});
conn.usePlugin({
  emPush: { onRegister },
  config: {
    APNsCertificateName: 'APNS_CERTIFICATE_NAME',
    FCMCertificateName: 'FCM_CERTIFICATE_NAME',
    HMSCertificateName: 'HUAWEI_CERTIFICATE_NAME',
    MICertificateName: 'XIAOMI_CERTIFICATE_NAME',
    MEIZUCertificateName: 'MEIZU_CERTIFICATE_NAME',
    VIVOCertificateName: 'VIVO_CERTIFICATE_NAME',
    OPPOCertificateName: 'OPPO_CERTIFICATE_NAME',
    HONORCertificateName: 'HONOR_CERTIFICATE_NAME',
  },
}, 'push');
// #endif

export default conn;
```

随后在业务登录流程中使用同一 `conn` 实例：

```javascript
import conn from '@/utils/WebIM.js';

try {
  await conn.open({ user: 'alice', accessToken: 'IM_TOKEN' });
  console.log('IM 登录成功');
} catch (error) {
  console.warn('IM 登录失败，请检查账号与 Token');
}
```

IM 登录成功不表示推送 Token 已绑定成功，Token 获取和上传在登录连接建立后执行。不要再单独调用 `onRegister()` 或 `addDeviceTokenListener()`，否则可能覆盖 SDK 正在使用的 Token 回调或重新注册厂商通道。

### 步骤 4：处理通知点击

V4 SDK 的推送插件集成只管理设备 Push Token 的生命周期，不处理通知点击、通知权限、角标或通知栏操作。应在 `App.vue` 的 `onLaunch` 中直接调用插件申请通知权限并注册点击监听，不要等待 IM 初始化或登录。

应用被杀死后，用户点击通知时原生层可能早于页面完成初始化。插件会缓存原生点击数据，应用仍应在 JS 层根据页面就绪状态暂存并消费点击事件，避免冷启动时丢失跳转信息。

Android 端还需在环信控制台的推送证书中配置插件的通知点击入口，否则可能只能打开 App，无法收到点击回调：

| 推送通道 | 证书配置项 | 值 |
| :--- | :--- | :--- |
| 华为、荣耀 | Action | `com.hyphenate.push.OnClickNotifyActivity` |
| OPPO、vivo | Activity | `com.hyphenate.push.OnClickNotifyActivity` |

Android 点击数据通常包含 `to`、`from`、`msgId`、`groupId` 和 `ext`，其中 `ext` 可能是对象或 JSON 字符串；iOS 返回 APNs 的 `userInfo` JSON，不能按 Android 的固定字段结构读取。

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
      if (this.globalData.pushClickPageReady) {
        uni.$emit('easemob-push-click', payload);
        return;
      }
      this.globalData.pendingPushClicks.push(payload);
    });
    // #endif
  },
};
```

需要处理通知跳转的常驻入口页可按以下方式注册业务监听并消费缓存。页面卸载时移除监听并重置就绪状态，避免重复跳转或丢失后续通知点击：

```javascript
export default {
  onLoad() {
    this.handlePushClick = payload => {
      // 校验 payload 和当前登录账号，再跳转到对应会话或业务页面。
    };
    uni.$on('easemob-push-click', this.handlePushClick);
    const pending = getApp().globalData.pendingPushClicks.splice(0);
    pending.forEach(this.handlePushClick);
    getApp().globalData.pushClickPageReady = true;
  },
  onUnload() {
    getApp().globalData.pushClickPageReady = false;
    uni.$off('easemob-push-click', this.handlePushClick);
  },
};
```

`addNotificationListener()` 只在用户点击系统通知后回调，不表示消息到达。Android 13 及以上系统需要用户授予通知权限；用户拒绝后，可通过插件的 `openSettingsForNotification()` 引导用户前往系统设置。角标设置和通知栏清理等功能也应由应用直接调用插件接口。

`requestNotificationAuthorization()` 回调中的 `status` 表示通知授权状态；`openSettingsForNotification()` 的 `status` 仅表示是否成功打开设置页，不代表用户已开启通知。`setBadge()` 在 iOS 和 HarmonyOS 生效，Android 实现不修改本地角标。

### 步骤 5：退出登录前解绑

退出 IM 登录或切换账号时，在原账号仍登录的状态下先解绑，再结束厂商注册和 IM 连接：

```javascript
// #ifdef APP-PLUS
import { unRegister } from '@/uni_modules/easemob-push';
// #endif
import conn from '@/utils/WebIM.js';

async function logoutWithPush() {
  try {
    await conn.unbindPushToken();
    // #ifdef APP-PLUS
    unRegister();
    // #endif
    conn.close();
  } catch (error) {
    console.warn('推送解绑失败，请处理后重试退出');
  }
}
```

`unRegister()` 不会解除环信侧绑定，不能替代 `unbindPushToken()`。V4 不使用 V5 的 `removePushToken()` 自动停用流程；保持账号登录时，不应仅凭本地注销厂商通道判断环信侧已解绑。若账号已被踢下线，无法再由原连接完成解绑，可由业务服务端调用 [绑定和解绑推送信息](/document/server-side/push_information_bind_unbind.html)。

### 步骤 6：测试离线推送

1. 在包含插件的真机安装包中登录接收方 IM 账号，确认厂商参数、证书和通知权限已配置。
2. 终止接收方 App 进程，待用户离线后，由另一 IM 账号发送消息，确认能够接收离线通知。
3. 点击通知，验证冷启动、点击回调和页面就绪后的跳转。
4. 验证原账号解绑、退出及账号切换，确认不会沿用前一账号的 Token 绑定。

不要退出 IM 并解绑后再验证离线通知。`initPushModule()` 的 `pushConfigTypes` 只用于检查宿主配置，不能作为 Token 注册或环信绑定成功的依据。

## 注意事项

- `unRegister()` 在 Android 注销当前厂商通道，在 iOS 清除本地 Token 回调；均不会解除环信侧绑定。
- 插件不支持 H5、小程序；HarmonyOS 使用独立的 [鸿蒙接入流程](uniapp_push_harmony.html)，不将 `push_type=9` 交给本文的 V4 自动通道映射。
- `setBadge()` 在 iOS 和 HarmonyOS 修改本地角标，Android 实现不修改角标；`clearAllNotification()` 清理通知栏，不等同于清零角标。

## 常见问题

### 为什么 initPushModule 返回的通道与手机品牌不同？

`pushConfigTypes` 表示宿主已配置的通道，例如只写入小米参数时可返回 `[3]`，不代表当前设备一定走小米。当前设备通道以 `onRegister()` 的 `push_type` 为准；无匹配通道时为 `8`。

### 为什么配置证书后仍收不到通知？

证书只影响环信服务端绑定，还需确认 Android 宿主参数、华为 `agconnect-services.json`、包名和签名正确，iOS 的 APNs 环境与签名一致，并已重新构建安装包。Android 点击回调还需配置本文的 Action/Activity 入口。

### App 在后台为什么没有离线通知？

只要客户端仍与环信服务器保持在线连接，用户就仍被视为在线。应在确认接收方离线后验证，不能将后台运行等同于离线。

### 是否支持多设备离线推送？

可在环信控制台的 **证书配置** 中选择所有设备离线才推送，或任一设备离线即推送。具体能力还需与应用的多设备登录配置匹配。
