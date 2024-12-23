# Uni-app 离线推送

环信 uni-app 原生推送插件集成了第三方离线消息推送服务, 为开发者提供低延时、高送达、高并发、不侵犯用户个人数据的离线消息推送服务。当客户端断开连接或应用进程被关闭等原因导致用户离线时，即时通讯 IM 会通过第三方消息推送服务向该离线用户的设备推送消息通知。

目前支持的手机厂商推送服务包括：华为、荣耀、小米、OPPO、vivo ，魅族和 APNs。

## 前提条件

1. 已开启环信即时通讯服务，详见 [开启和配置即时通讯服务](/product/enable_and_configure_IM.html)。
2. 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
3. 你已在 [环信即时通讯控制台](https://console.easemob.com/user/login)的**即时通讯 > 功能配置 > 功能配置总览**页面激活推送高级功能。高级功能激活后，你可以设置推送通知方式、免打扰模式和自定义推送模板。**如需关闭推送高级功能必须联系商务，因为该操作会删除所有相关配置。**
4. 各推送使用的条件：
    - 小米推送：在小米设备上可用；
    - 华为推送：在华为设备上可用；
    - 魅族推送：在魅族设备上可用；
    - OPPO 推送：在 OPPO 设备上可用；
    - vivo 推送：在 vivo 设备上可用;
    - 荣耀 推送：在荣耀设备上可用;
    - APNS 推送：在苹果设备上可用。

插件内部会按照以上顺序检测设备的推送支持情况。如果未设置第三方推送或者不满足使用第三方推送的条件，环信 IM SDK 会通过一些保活手段尽可能的保持与环信服务器的长连接，以确保消息及时送达。

## 实现流程

### 步骤一 上传推送证书至环信即时通讯控制台

1. 在第三方推送服务后台注册应用，获取应用信息，开启推送服务。
   
2. 在[环信即时通讯云控制台](https://console.easemob.com/user/login)配置获取到的应用信息，上传推送证书，实现第三方推送服务与环信即时通讯 IM 的通信。

:::tip
更多详情，参见 [Android 离线推送](/document/android/push/push_fcm.html)和 [APNs 离线推送](/document/ios/push/push_apns.html)。
:::

### 步骤二 配置 uni-app 应用支持推送插件

1. 新建 uni-app 工程，并引入[环信 uni-app 推送插件](https://downloadsdk.easemob.com/downloads/WEB_SDK/EMPushUniPlugin_V1.0.0.zip)。
   
在你的 uni-app 应用根目录下新建 `nativeplugins` 文件夹，然后将下载的插件放置于 `nativeplugins` 文件夹下。如下图所示：

 ![img](/images/applet/push_tip.png)

:::tip
华为注册厂商推送服务时，包含 `agconnect-services.json` 文件。你需下载该文件，并将其放至你的 uni-app 应用根目录下的 `nativeplugins/EMPushUniPlugin/android/assets` 文件夹下。
:::

2. 配置 uni-app 项目支持推送。选择 **App模块配置**，勾选 **Push（消息推送）**。

 ![img](/images/applet/push_tip1.png)

:::tip
不要勾选 **uniPush 1.0** 或者 **uniPush 2.0**。
:::

3. 添加 `EMPushUniPlugin` 原生插件, 并配置需要推送的第三方厂商应用信息。
   
![img](/images/applet/push_tip2.png)

:::tip
请配置第三方厂商推送相关信息。
:::

![img](/images/applet/push_tip3.png)

4. 生成自定义基座。
   
自定义基座是 uni-app 应用运行的底层原生环境。当应用程序使用了原生层插件（如推送插件等），这些插件需要在原生环境中执行，这时就必须打包自定义基座。

:::tip
- 配置原生插件，必须打包自定义基座进行测试。
- 打包自定义基座时，需要提供安卓/苹果平台签名证书。安卓平台签名证书是开发者后续更新升级已发布 APK 的凭证。开发者需要自行生成证书文件并保管，具体请参考[Android 平台签名证书(.keystore)生成指南](https://ask.dcloud.net.cn/article/35777)和[iOS 证书(.p12)和描述文件(.mobileprovision)申请](https://ask.dcloud.net.cn/article/152)。
:::

- 制作自定义调试基座：

![img](/images/applet/push_tip4.png)

- 配置 Android 基座打包信息：
  
![img](/images/applet/push_tip5.png)

- 配置 iOS 基座打包信息： 
  
![img](/images/applet/push_tip6.png)

### 步骤三 集成 EMPushUniPlugin 插件

:::tip
SDK 4.9.1 及以上版本支持 uni-app 推送。
:::

1. 安装并引入环信 uni-app SDK。

```javascript
// 安装环信 SDK
npm install easemob-websdk 
// 在 App.vue 文件中引入 SDK
import websdk from "easemob-websdk/uniApp/Easemob-chat";
```

2. 初始化 IM SDK 并集成推送插件。
   
```javascript
// 初始化 IM SDK
const conn = websdk.connection({
  appKey: 'xxxxx', // 你的环信 app Key
  isFixedDeviceId: true // 推荐使用固定的设备 ID, SDK 会默认从本地缓存中获取设备ID
});

// #ifdef APP-PLUS
// 引入 EMPushUniPlugin 推送插件
const EMPushUniPlugin = uni.requireNativePlugin('EMPushUniPlugin');

// 配置推送插件
const pushOption = {
    // @ts-ignore
		emPush: EMPushUniPlugin,
    // 配置需要推送的证书名称
		config: {
			MICertificateName: 'xxxxxx', // 小米推送证书名称
			OPPOCertificateName: 'xxxxxx', // oppo 推送证书名称
			HMSCertificateName: 'xxxxxx', // 华为推送证书名称
			VIVOCertificateName: 'xxxxxx',// vivo 推送证书名称
			HONORCertificateName: 'xxxxxx',// 荣耀推送证书名称
			MEIZUCertificateName: 'xxxxxx', // 魅族推送证书名称
			APNsCertificateName: 'xxxxxx', // APNs推送证书名称
		}
}

// 调用 IM SDK 方法，注册推送插件
conn.usePlugin({
  pushOption,
  'push' // 为固定值
})
// #endif

// 如果退出 IM 登录、多设备互踢时, 需要解绑 device token, 可以调用该方法
const unbindPushToken = () => {
  conn.unbindPushToken()
}

// 在 uniapp onLaunch 事件中初始化推送插件
onLaunch(() => {
  // #ifdef APP-PLUS
	EMPushUniPlugin.initPushModule();
  // #endif
});

```

### 步骤四 测试离线推送

消息接收方登录 IM 账户后，SDK 会自动上传对应的推送证书, 杀死应用，收到离线消息，能够接收到推送消息。

## 常见问题

1. 即时通讯 IM 在哪些情况不会发送离线推送通知？

- 若应用在后台运行，则用户仍为在线状态，即时通讯 IM 不会向用户推送消息通知。
   
- 应用在后台运行或手机锁屏等情况，若客户端未断开与服务器的连接，则即时通讯 IM 不会收到离线推送通知。

2. 即时通讯 IM 是否支持多设备离线推送？

你可在[环信即时通讯控制台](https://console.easemob.com/user/login)的**证书管理**页面配置多设备推送策略。该策略配置对所有推送通道生效：

- 所有设备离线时，才发送推送消息；
- 任一设备离线时，都发送推送消息。

