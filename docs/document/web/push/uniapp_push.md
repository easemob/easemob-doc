# 使用 Uni-app 离线推送插件

自 SDK 5.1.2 起，即时通讯 IM 支持 uni-app 原生推送插件。该插件集成了第三方离线消息推送服务, 为开发者提供低延时、高送达、高并发、不侵犯用户个人数据的离线消息推送服务。当客户端断开连接或应用进程被关闭等原因导致用户离线时，即时通讯 IM 会通过第三方消息推送服务向该离线用户的设备推送消息通知。

目前支持的手机厂商推送服务包括：华为、荣耀、小米、OPPO、vivo、魅族、APNs 和 FCM。

## 前提条件

1. 在 [环信控制台](https://console.easemob.com/user/login) [注册账号](/product/console/account_register.html)，[创建应用](/product/console/app_create.html)。
2. 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
3. 将 SDK 升级至 5.1.2 或以上版本。
4. 若使用推送模板，你需要在 [环信控制台](https://console.easemob.com/user/login)的 **即时通讯 > 推送配置 > 离线推送配置** 页面激活。**激活后，如需关闭推送模板功能，必须联系商务，因为该操作会删除推送模板相关的所有配置。**
5. 各推送使用的条件：
    - 小米推送：在小米设备上可用；
    - 华为推送：在华为设备上可用；
    - 魅族推送：在魅族设备上可用；
    - OPPO 推送：在 OPPO 设备上可用；
    - vivo 推送：在 vivo 设备上可用；
    - 荣耀 推送：在荣耀设备上可用；
    - APNS 推送：在苹果设备上可用；
    - FCM 推送：在安装了 Google Play 服务的设备上可用。

插件内部会按照以上顺序检测设备的推送支持情况。如果未设置第三方推送或者不满足使用第三方推送的条件，环信 IM SDK 会通过一些保活手段尽可能的保持与环信服务器的长连接，以确保消息及时送达。

## 实现流程

### 步骤 1： 上传推送证书至环信控制台

1. 在第三方推送服务后台注册应用，获取应用信息，开启推送服务。

2. 在[环信控制台](https://console.easemob.com/user/login)配置获取到的应用信息，上传推送证书，实现第三方推送服务与环信即时通讯 IM 的通信。

:::tip
更多详情，参见 [Android 离线推送](/document/android/push/push_fcm.html)和 [APNs 离线推送](/document/ios/push/push_apns.html)。
:::

### 步骤 2 配置 uni-app 应用支持推送插件

1. 将 `easemob-push` UTS 插件放入业务工程的 `uni_modules/easemob-push` 目录。
2. 在 `manifest.json` 中启用 App Push，并将 `pushRegisterMode` 设置为 `manual`；不要同时勾选 uniPush 1.0 或 uniPush 2.0。
3. 在环信控制台上传 APNs、FCM 或 Android 厂商推送证书，并记录证书名称。FCM 的离线打包配置请参见 [离线打包集成 FCM](uniapp_push_fcm.html)。
4. 使用自定义基座或云打包测试原生插件；标准运行基座不包含插件原生代码。

:::tip
华为等 Android 厂商推送还需要在对应厂商平台配置应用信息。各厂商的原生配置和签名要求以厂商及 uni-app 文档为准。
:::

### 步骤 3 集成 uni-app 原生推送

`PushManager` 负责调用插件获取设备 Push Token、根据通道匹配环信证书并完成绑定和更新。登录后 SDK 会自动执行 Token 绑定；退出登录时会自动尝试解绑。业务侧也可以调用 `removePushToken()` 手动停用当前设备的离线推送，再次调用 `setNativePush()` 重新启用。

```typescript
import { ChatClient, PushManager } from 'easemob-websdk';
import { onRegister, unRegister } from '@/uni_modules/easemob-push';

const pushManager = new PushManager();

pushManager.setNativePush({
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
});

const client = ChatClient.init({
  appKey: 'org#app',
  managers: [pushManager],
});

await client.login({
  userId: 'alice',
  token: 'IM_TOKEN',
});

// 业务侧需要立即停用当前设备推送时调用；成功后需再次 setNativePush() 才会恢复。
await client.pushManager.removePushToken();
```

`setNativePush()` 可以在登录前或登录后调用。登录前配置会在登录完成后执行绑定，登录后配置会立即启动；Token 的获取和上传在后台完成，不改变 `login()` 的返回结果。配置中至少需要提供一个有效的通道证书。


### 步骤 4 测试离线推送

消息接收方登录 IM 账户后，SDK 会自动获取并绑定设备 Push Token。终止应用进程后，从其他设备发送消息进行验证；设备收到离线推送后，可在通知栏查看通知。

## 常见问题

1. 即时通讯 IM 在哪些情况不会发送离线推送通知？

- 若应用在后台运行，则用户仍为在线状态，即时通讯 IM 不会向用户推送消息通知。

- 应用在后台运行或手机锁屏等情况，若客户端未断开与服务器的连接，则即时通讯 IM 不会收到离线推送通知。

2. 即时通讯 IM 是否支持多设备离线推送？

你可在 [环信控制台](https://console.easemob.com/user/login) 的 **证书管理** 页面配置多设备推送策略。该策略配置对所有推送通道生效：

- 所有设备离线时，才发送推送消息；
- 任一设备离线时，都发送推送消息。
