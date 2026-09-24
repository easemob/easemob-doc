---
containerClass: oppo-push-page
---

# 在即时通讯 IM 中集成 OPPO 推送

环信即时通讯 IM SDK 已集成 OPPO 推送能力。接入 OPPO 推送前，你需要在 OPPO 开发者后台创建应用、在环信控制台配置推送证书，并在 Android 项目中完成推送 SDK 的集成与初始化。

## OPPO 推送类型与每日推送量

OPPO 推送分为测试推送和正式推送，两种推送类型的每日推送量限制如下：

| 推送类型 | 可推送总数（条/日） | 说明 |
| :------- | :----------------- | :--- |
| 测试推送 | 最多 1,000 条 | 仅用于接入测试。 |
| 正式推送 | 前一天累计用户数的 2 倍 | 对于新接入的应用，平台提供最低保护阈值；当日最低可推送量为 20,000 条。 |

## 集成 OPPO 推送

### 步骤一 在 OPPO 开发者后台创建应用

在 [OPPO 开发者后台](https://open.oppomobile.com/new/loginForHeyTap?location=https%3A%2F%2Fopen.oppomobile.com)创建应用，开启推送服务，上传对应的证书指纹，详见 OPPO 官方介绍：[OPPO 推送服务集成](https://open.oppomobile.com/new/developmentDoc/info?id=10195)。

### 步骤二 上传推送证书

1. 登录 [环信控制台](https://console.easemob.com/user/login)，在 **应用管理** 页面点击测试版或正式版的应用的 App Key。
   
2. 选择 **即时通讯** > **推送配置**。
   
3. 在 **证书配置** 页面，点击 **添加推送证书**。在 **添加推送证书** 对话框中选择 **OPPO** 页签，配置 OPPO 推送参数。你可以在 [OPPO 推送平台](https://open.oppomobile.com/)的 **配置管理** > **应用配置** 页面查看应用的 AppKey 和 MasterSecret。

![image](/images/android/push/add_oppo_push_certificate.png)

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :------- | :--- |
| `证书名称` | String | 是 | OPPO AppKey。 |
| `推送密钥` | String | 是 | OPPO MasterSecret。<br/>该字段对应 OPPO 应用信息中的 `appserversecret` 字段，而不是客户端 SDK 使用的 AppSecret。 |
| `应用包名` | String | 是 | 在 OPPO 推送平台注册的 Android 应用包名。 |
| `Channel ID` | String | 否 | OPPO 通知通道 ID。该参数仅对离线推送有效。 |
| `Activity` | String | 否 | 用户点击通知后跳转的 Activity。该参数仅对离线推送有效。 |
| `Category` | String | 否 | 选择 OPPO 消息分类。该参数仅对离线推送有效。 |
| `NotifyLevel` | String | 否 | 选择通知提醒等级：<br/> - `1` 表示通知栏；<br/> - `2` 表示通知栏和锁屏；<br/> - `16` 表示通知栏、锁屏、横幅、震动和铃声。<br/>该参数仅对离线推送有效。 |

### 步骤三 集成 OPPO 推送

1. 参考 [OPPO 推送快速接入指南](https://open.oppomobile.com/documentation/page/info?id=11221) 下载 OPPO 推送 SDK，将 `aar` 包存放在项目的 `libs` 目录中，并按照官方文档添加依赖。
   
   此外，也可以直接使用环信 Android IM Demo 中集成的 OPPO 推送的 `aar` 包。

2. 配置 `AndroidManifest.xml`。

   - 推送服务需要的权限列表：

   ```xml
   <!-- OPPO 推送配置 start -->
   <uses-permission android:name="com.coloros.mcs.permission.RECIEVE_MCS_MESSAGE"/>
   <uses-permission android:name="com.heytap.mcs.permission.RECIEVE_MCS_MESSAGE"/>
   <!-- OPPO 推送配置 end -->
   ```

   - 推送服务需要的 service：

   ```xml
   <!-- OPPO 推送配置 start -->
   <service
       android:name="com.heytap.msp.push.service.CompatibleDataMessageCallbackService"
       android:exported="true"
       android:permission="com.coloros.mcs.permission.SEND_MCS_MESSAGE">
       <intent-filter>
           <action android:name="com.coloros.mcs.action.RECEIVE_MCS_MESSAGE"/>
       </intent-filter>
   </service> <!-- 兼容 Android Q 以下版本 -->

   <service
       android:name="com.heytap.msp.push.service.DataMessageCallbackService"
       android:exported="true"
       android:permission="com.heytap.mcs.permission.SEND_PUSH_MESSAGE">
       <intent-filter>
           <action android:name="com.heytap.mcs.action.RECEIVE_MCS_MESSAGE"/>
           <action android:name="com.heytap.msp.push.RECEIVE_MCS_MESSAGE"/>
       </intent-filter>
   </service> <!-- 兼容 Android Q 及以上版本 -->
   <!-- OPPO 推送配置 end -->
   ```

   若应用需要在 Android 13 及以上版本的设备上显示通知，还需在 `AndroidManifest.xml` 中声明通知权限，并在运行时向用户申请该权限：

   ```xml
   <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
   ```

3. 调用 OPPO 推送的初始化方法。建议在 `Application` 类的 `onCreate` 方法中通过主线程调用该方法，并确保在其他 OPPO Push 操作前完成初始化。`needLog` 表示是否输出 OPPO Push 日志，生产环境建议设为 `false`。

   ```java
   @Override
   public void onCreate() {
       super.onCreate();
       HeytapPushManager.init(this, BuildConfig.DEBUG);
   }
   ```

4. 在即时通讯 IM SDK 初始化时，配置启用 OPPO 推送。

   `enableOppoPush` 方法的参数说明如下：

   - `appKey`：OPPO AppKey，与 [步骤二](#步骤二-上传推送证书) 中环信控制台配置的 **证书名称** 相同。
   - `appSecret`：OPPO AppSecret，用于 OPPO 客户端 SDK 初始化，无需上传至环信控制台。该参数不是步骤二中 **推送密钥** 使用的 MasterSecret。

   ```java
   EMOptions options = new EMOptions();
   ...
   EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
   builder.enableOppoPush(appKey, appSecret);
   // 将 pushconfig 设置为 ChatOptions
   options.setPushConfig(builder.build());
   // 初始化 IM SDK
   EMClient.getInstance().init(this, options);
   ```
