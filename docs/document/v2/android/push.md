# Android 第三方推送设置

<Toc />

即时通讯 IM 支持集成第三方消息推送服务，为 Android 开发者提供低延时、高送达、高并发、不侵犯用户个人数据的离线消息推送服务。

客户端断开连接或应用进程被关闭等原因导致用户离线时，即时通讯 IM 会通过第三方消息推送服务向该离线用户的设备推送消息通知。当用户再次上线时，服务器会将离线期间的消息发送给用户（这里角标表示的是离线消息数，并不是实际的未读消息数）。例如，当你离线时，有用户向你发送了消息，你的手机的通知中心会弹出消息通知，当你再次打开 app 并登录成功，即时通讯 IM SDK 会主动拉取你不在线时的消息。

若应用在后台运行，则用户仍为在线状态，即时通讯 IM 不会向用户推送消息通知。多设备登录时，可在环信控制台的**证书管理**页面配置推送在所有设备离线或任一设备离线时发送推送消息，该配置对所有推送通道生效。

<div class="alert note">1. 应用在后台运行或手机锁屏等情况，若客户端未断开与服务器的连接，则即时通讯 IM 不会收到离线推送通知。<br/>2. 多端登录时若有设备被踢下线，即使接入了 IM 离线推送，也收不到离线推送消息。</div>

除了满足用户离线条件外，要使用第三方离线推送，用户还需在环信控制台配置推送证书信息，例如，对于华为推送，需配置**证书名称**和**推送密钥**，并调用客户端 SDK 提供的 API 向环信服务器上传 device token。

目前支持的手机厂商推送服务包括：Google、华为、荣耀、小米、OPPO、VIVO 和魅族。本文介绍如何在客户端应用中实现各厂商的推送服务。

## 技术原理

![image](@static/images/android/push/push_android_understand.png)

消息推送流程如下：

1. 用户 B（消息接收者）检查设备支持哪种推送渠道，即 app 配置了哪种第三方推送服务且满足该推送的使用条件。
2. 用户 B 根据配置的第三方推送 SDK 从第三方推送服务器获取推送 token。
3. 第三方推送服务器向用户 B 返回推送 token。
4. 用户 B 向环信服务器上传推送证书名称和推送 token。
5. 用户 A 向 用户 B 发送消息。
6. 环信服务器检查用户 B 是否在线。若在线，环信服务器直接将消息发送给用户 B。
7. 若用户 B 离线，环信服务器判断该用户的设备使用的推送服务类型。
8. 环信服务器将将消息发送给第三方推送服务器。
9. 第三方推送服务器将消息发送给用户 B。

:::tip

1. 开发者通过环信即时通讯云控制台配置 App 的推送证书，需填写证书名称（或者 App Key）。该步骤须在登录环信 IM SDK 成功后进行。
2. 证书名称是环信服务器用来判断目标设备使用哪种推送通道的唯一条件，因此必须确保与 Android 终端设备上传的证书名称一致。
:::

## 前提条件

- 已开启环信即时通讯服务，详见 [开启和配置即时通讯服务](/product/enable_and_configure_IM.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 你已在 [环信控制台](https://console.easemob.com/user/login)中激活推送高级功能。高级功能激活后，你可以设置推送通知方式、免打扰模式和自定义推送模板。如需关闭推送高级功能必须联系商务，因为该操作会删除所有相关配置。

各推送使用条件：

- Google FCM：需要 Google Play Service 和能连接 Google 服务器的网络；
- 小米推送：在小米系统上可用；
- 华为推送：在华为系统上可用；
- 魅族推送：在魅族系统上可用；
- OPPO 推送：在 OPPO 系统上可用；
- VIVO 推送：在 VIVO 系统上可用。

SDK 内部会按照该顺序检测设备的推送支持情况。如果未设置第三方推送或者不满足使用第三方推送的条件，环信 IM SDK 会通过一些保活手段尽可能的保持与环信服务器的长连接，以确保消息及时送达。

:::tip
如果你的 App 有海外使用场景，建议开启 FCM 推送；由于各推送使用条件不同，建议尽可能同时支持各家推送。
:::

使用消息推送前，需要你在对应的厂商推送服务上注册项目，并将设备的推送证书上传到环信即时通讯云控制台。

### 上传到设备证书到环信即时通讯云控制台

![image](@static/images/android/push/push_android_certificate_add.png)

## 在客户端实现推送

### 1. 配置推送接口

你需要在 SDK 初始化的时候进行推送接口的配置。

```java
EMOptions options = new EMOptions();
...
EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
// 设置支持哪家手机厂商推送。
builder.enableMiPush(String appId, String appKey)
       //开发者需要调用该方法开启华为推送。
       .enableHWPush();
// 将 pushconfig 设置为 ChatOptions.
options.setPushConfig(builder.build());
// 初始化即时通讯 IM SDK。
EMClient.getInstance().init(this, options);
```

### 2. 混淆

如果你在项目中开启了混淆，请将以下规则添加到你的混淆规则中：

```java
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

除此之外，你还需要添加第三方推送的混淆规则，详见各厂商的开发者平台文档。

### 3. 手机厂商推送集成

#### FCM 推送集成

**步骤一：在 [Firebase 控制台](https://console.firebase.google.com/)添加 Firebase。**

详见 [FCM 的官网介绍](https://firebase.google.com/docs/android/setup?hl=zh-cn#console)。<br/>

**步骤二：上传推送证书。**

注册完成后，在[环信即时通讯云控制台](https://console.easemob.com/user/login)上传推送证书，选择你的应用 > **即时通讯** > **功能配置** > **消息推送** > **证书配置**，点击 **添加推送证书**。即时通讯 IM 支持 FCM 的旧版证书和 v1 版证书。

- 若 **证书类型** 选择 **旧版**，你需要将 **证书名称** 设置为 FCM 的发送者 ID，**推送秘钥** 设置为 FCM 的服务器密钥。你需在 [Firebase 控制台](https://console.firebase.google.com/?hl=zh-cn)的 **项目设置 > 云消息传递** 页面中，在 **Cloud Messaging API（旧版）** 区域中获取发送者 ID 和服务器密钥，如下图所示。配置完毕，设置 **铃声**、**推送优先级设置** 和 **推送消息类型** 参数。

![image](@static/images/android/push/fcm_old_version.png)

- 若 **证书类型** 选择 **V1**，你需要上传证书文件（.json 文件）并将 **证书名称** 设置为 FCM 的发送者 ID。你需要在[Firebase 控制台](https://console.firebase.google.com/?hl=zh-cn)的 **项目设置** > **服务账号** 页面，点击 **生成新的私钥**，下载推送证书文件（.json），然后在 **项目设置** > **云消息传递** 页面中，在 **Firebase Cloud Messaging API（V1）** 区域中获取 发送者 ID。配置完毕，设置 **铃声**、**推送优先级设置** 和 **推送消息类型** 参数。

![image](@static/images/android/push/fcm_v1.png)

**步骤三：FCM 推送集成。**

1. 在项目根目录下的 `build.gradle` 中添加 FCM 服务插件。

```gradle
dependencies {
   // FCM 推送
   classpath 'com.google.gms:google-services:4.3.8'
}
```

2. 在项目的 module 的 gradle 文件中（通常为 /app/build.gradle ）配置 FCM 库的依赖。

```gradle
dependencies {
   // ...

   // FCM：导入 Firebase BoM
   implementation platform('com.google.firebase:firebase-bom:28.4.1')
   // FCM：声明 FCM 的依赖项
   // 使用 BoM 时，不要在 Firebase 库依赖中指定版本
   implementation 'com.google.firebase:firebase-messaging'

}
// 添加下行代码：
apply plugin: 'com.google.gms.google-services'  // Google 服务插件
```

3. 同步应用后，继承 `FirebaseMessagingService` 的服务，并将其在 `AndroidManifest.xml` 中注册。

```xml
<service
  android:name=".java.MyFirebaseMessagingService"
  android:exported="false">
  <intent-filter>
      <action android:name="com.google.firebase.MESSAGING_EVENT" />
  </intent-filter>
</service>
```

4. 在环信即时通讯 IM SDK 中启用 FCM。

```java
EMOptions options = new EMOptions();
...
EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
// 替换为你的 FCM 发送方的用户 ID
builder.enableFCM("Your FCM sender id");
// 将 pushconfig 设置到 EMOptions 中
options.setPushConfig(builder.build());
// 初始化即时通讯 IM SDK
EMClient.getInstance().init(this, options);
// 即时通讯 IM SDK 初始化后
EMPushHelper.getInstance().setPushListener(new EMPushListener() {
   @Override
   public void onError(EMPushType pushType, long errorCode) {
       EMLog.e("PushClient", "Push client occur a error: " + pushType + " - " + errorCode);
   }
   @Override
   public boolean isSupportPush(EMPushType pushType, EMPushConfig pushConfig) {
       // 设置是否支持 FCM
       if(pushType == EMPushType.FCM) {
           return GoogleApiAvailabilityLight.getInstance().isGooglePlayServicesAvailable(MainActivity.this)
                    == ConnectionResult.SUCCESS;
       }
       return super.isSupportPush(pushType, pushConfig);
   }
});
```

5. 环信即时通讯 IM SDK 登录成功后，上传 FCM 的 device token。

```java

// 查看是否支持 FCM
if(GoogleApiAvailabilityLight.getInstance().isGooglePlayServicesAvailable(MainActivity.this) != ConnectionResult.SUCCESS) {
return;
}
FirebaseMessaging.getInstance().getToken().addOnCompleteListener(new OnCompleteListener<String>() {
@Override
public void onComplete(@NonNull Task<String> task) {
if (!task.isSuccessful()) {
EMLog.d("PushClient", "Fetching FCM registration token failed:"+task.getException());
return;
}
// 获取新的 FCM 注册 token
String token = task.getResult();
EMClient.getInstance().sendFCMTokenToServer(token);
}
});

```

6. 监控 device token 生成。

重写 `FirebaseMessagingService` 中的 `onNewToken` 方法，device token 更新后及时更新到环信即时通讯 IM SDK。

```java
public class EMFCMMSGService extends FirebaseMessagingService {
    private static final String TAG = "EMFCMMSGService";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        if (remoteMessage.getData().size() > 0) {
            String message = remoteMessage.getData().get("alert");
            Log.d(TAG, "onMessageReceived: " + message);
        }
    }

    @Override
    public void onNewToken(@NonNull String token) {
        Log.i("MessagingService", "onNewToken: " + token);
        // 若要对该应用实例发送消息或管理服务端的应用订阅，将 FCM 注册 token 发送至你的应用服务器。
        if(EMClient.getInstance().isSdkInited()) {
            EMClient.getInstance().sendFCMTokenToServer(token);
        }
    }
}
```

#### 华为 HMS 推送集成

**步骤一、华为开发者后台创建应用。**

在华为开发者后台创建应用，并开启推送服务，并上传对应的证书指纹，详见华为官方介绍：[华为 HMS 消息推送服务集成](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-config-agc-0000001050170137#section19884105518498)。

**步骤二、上传推送证书。**

注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> **即时推送** —> **配置证书** —> **添加推送证书** —> **华为**，然后输入你在 华为开发者后台创建的[应用信息中的 APP ID 和 SecretKey 以及程序的包名](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-config-agc-0000001050170137#section125831926193110)。

**步骤三、华为推送集成**

1. 集成 HMS Core SDK，参见 [华为官网集成文档](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-integrating-sdk-0000001050040084)。

2. 注册继承自 `HmsMessageService` 的服务到 `AndroidManifest.xml` 中。

   ```xml
   <!--华为 HMS Config-->
   <service android:name=".service.HMSPushService"
       android:exported="false">
       <intent-filter>
           <action android:name="com.huawei.push.action.MESSAGING_EVENT" />
       </intent-filter>
   </service>
   <!-- huawei push end -->
   ```

3. [获取 Token 及 自动初始化](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-client-dev-0000001050042041)。

4. 在 SDK 初始化的时候，配置启用华为推送。

   ```java
   EMOptions options = new EMOptions();
   ...
   EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
   builder.enableHWPush();
   // 将 pushconfig 设置为 ChatOptions
   options.setPushConfig(builder.build());
   // 初始化 IM SDK
   EMClient.getInstance().init(this, options);
   ```

5. [华为通知消息智能分类](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-intelligent-classification-0000001050040120)。

#### 荣耀推送集成

环信即时通讯 IM SDK 4.0.3 版本中集成了荣耀推送。本节介绍如何集成荣耀厂商的离线推送通道，使消息通过荣耀推送服务推送至离线的用户。

**步骤 1：在[荣耀开发者服务平台](https://developer.hihonor.com/cn/)创建应用，申请开通推送服务。**

详见[荣耀推送官网说明](https://developer.hihonor.com/cn/kitdoc?category=%E5%9F%BA%E7%A1%80%E6%9C%8D%E5%8A%A1&kitId=11002&navigation=guides&docId=kit-history.md&token=)。

**步骤 2：在[环信即时通讯云控制台](https://console.easemob.com/user/login)上传荣耀推送证书。**

1. 在环信即时通讯云控制台首页的`应用列表`中，点击目标应用的**操作**栏中的**查看**。
2. 在右侧导航栏中，选择**即时通讯** > **功能配置** > **消息推送** > **证书管理**，点击**添加推送证书**。
3. 在**添加推送证书**对话框中选择**荣耀**，配置荣耀推送参数。

![image](@static/images/android/push/add_honor_push_template.png)

| 推送证书参数    | 类型   | 是否必需 | 描述                                                                                               |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------- |
| `App ID`        | String | 是       | 应用标识符，应用的唯一标识，在荣耀开发者服务平台开通对应用的荣耀推送服务时生成。                   |
| `Client ID`     | String | 是       | 应用的客户 ID，用于获取发送消息令牌的 ID，在荣耀开发者服务平台开通对应应用的荣耀推送服务时生成。   |
| `Client Secret` | String | 是       | 应用的客户密钥，用于获取发送消息令牌的密钥，在荣耀开发者服务平台开通对应应用的荣耀推送服务时生成。 |
| `Badge Class`   | String | 否       | 应用入口 Activity 类全路径，例如 com.example.test.MainActivity。                                   |
| `Action`        | String | 否       | 消息接收方在收到离线推送通知时单击通知栏时打开的应用指定页面的自定义标记。                                     |

:::tip
关于**App ID**、**Client ID**和**Client Secret**，可在荣耀开发者服务平台申请开通推送服务后，在**推送服务**页面选择创建的应用，在[**查看推送服务**](https://developer.hihonor.com/cn/kitdoc?category=%E5%9F%BA%E7%A1%80%E6%9C%8D%E5%8A%A1&kitId=11002&navigation=guides&docId=app-registration.md&token=#申请开通推送服务)页面查看。
:::

![image](@static/images/android/push/view_push_service.png)

**步骤 3：在环信即时通讯云 IM 中集成荣耀推送。**

本节以荣耀推送 SDK 7.0 版本为例介绍如何在 IM 中集成荣耀推送。关于如何集成荣耀推送 SDK 7.1 或 7.0 以下版本，详见[荣耀官网](https://developer.hihonor.com/cn/kitdoc?category=%E5%9F%BA%E7%A1%80%E6%9C%8D%E5%8A%A1&kitId=11002&navigation=guides&docId=intergrate.md&token=)。

1. 选择本地或远程集成方式。

- 在荣耀官网[下载荣耀推送 SDK](https://developer.hihonor.com/cn/kitdoc?category=%E5%9F%BA%E7%A1%80%E6%9C%8D%E5%8A%A1&kitId=11002&navigation=sdk&docId=android.md)，将 SDK 导入项目，添加本地依赖。

- 在应用级的 `build.gradle` 文件中添加远程依赖。

  ```
  implementation 'com.hihonor.mcs:push:7.0.41.301'
  ```

2. 从荣耀推送平台获取 `mcs-services.json` 配置文件放入应用级根目录下。

  如果 App 中已添加 `mcs-services.json` 文件，则需要在 `buildscript` > `dependencies` 中添加 asplugin 插件配置。

  ```
  buildscript {
      repositories {
          google()
          jcenter()
          // 配置 SDK 的 Maven 仓地址。
          maven {url 'https://developer.hihonor.com/repo'}
      }
      dependencies {
          ...
          // 增加 asplugin 插件配置，推荐使用最新版本。
          classpath 'com.hihonor.mcs:asplugin:2.0.0'
          // 增加 gradle 插件配置，根据 gradle 版本选择对应的插件版本号。
          classpath 'com.android.tools.build:gradle:7.0'
      }
  }
  ```

  打开项目级 `settings.gradle` 文件，配置 SDK 的 Maven 仓地址。

  ```
  dependencyResolutionManagement {
    ...
    repositories {
        google()
        jcenter()
        // 配置 SDK 的 Maven 仓地址。
        maven {
            url 'https://developer.hihonor.com/repo'
        }
    }
  }
  ```

3. 初始化配置。可以参考 Demo 中 demoHelper 的 `initPush()`方法中的荣耀推送配置。

```
// 初始化 IM，开启荣耀推送。
EMOptions options = new EMOptions();
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
builder.enableHonorPush();// 需要在 AndroidManifest.xml 中配置 App ID。
options.setPushConfig(builder.build());

// 荣耀推送 7.0.41.301 及以上版本，无需调用 `init` 方法初始化荣耀推送 SDK 即可调用以下方法。
// 检查是否支持荣耀推送。
boolean isSupport = HonorPushClient.getInstance().checkSupportHonorPush(context);
if (isSupport) {
   // true：调用初始化接口时，SDK 会同时进行异步请求 device token，会触发 HonorMessageService.onNewToken(String) 回调。
   // false：不会异步请求 device token，需要应用主动请求获取 device token。建议用 `false`，自己控制获取 device token 的时机。
   HonorPushClient.getInstance().init(context, false);
}
// 设置推送配置监听。若推送初始化失败，返回相应错误。
EMPushHelper.getInstance().setPushListener(new PushListener() {
    @Override
    public void onError(EMPushType pushType, long errorCode) {
        // TODO: 返回的 errorCode 仅 9xx 为环信内部错误，可从 EMError 中查询，其他错误请根据 pushType 去相应第三方推送网站查询。
        EMLog.e("PushClient", "Push client occur a error: " + pushType + " - " + errorCode);
    }

    @Override
    public boolean isSupportPush(EMPushType pushType, EMPushConfig pushConfig) {
        // 由外部实现代码判断设备是否支持荣耀推送。
        if (pushType == EMPushType.HONORPUSH){
            return isSupport;
        }
        return super.isSupportPush(pushType, pushConfig);
    }
});
```

**步骤 4：清单文件配置。**

在 `AndroidManifest.xml` 文件中，配置荣耀推送 App ID 和注册荣耀推送服务。

```
<!-- 荣耀推送配置 start -->
<meta-data
    android:name="com.hihonor.push.app_id"
    android:value="${HONOR_PUSH_APPID}" />

<service
    android:name=".common.service.HONORPushService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.hihonor.push.action.MESSAGING_EVENT" />
    </intent-filter>
</service>
<!-- 荣耀推送配置 end -->
```

对于注册荣耀推送服务，需自定义 Service，继承荣耀推送的 `HonorMessageService` 类，重写 `onNewToken` 方法。

```
public class HONORPushService extends HonorMessageService {
  //Device token 发生变化时，会触发 `onNewToken` 回调返回新 Token。
  @Override
  public void onNewToken(String token) {
      if(token != null && !token.equals("")){
          EMLog.d("HONORPush", "service register honor push token success token:" + token);
        // IM SDK 提供的上传 device token 的 API
          EMClient.getInstance().sendHonorPushTokenToServer(token);
      }else{
          EMLog.e("HONORPush", "service register honor push token fail!");
      }
  }
  @Override
  public void onMessageReceived(HonorPushDataMsg honorPushDataMsg) {
      EMLog.d("HONORPush", "onMessageReceived" + honorPushDataMsg.getData());
  }
}
```

**步骤 5：打开应用，初始化环信 IM SDK 成功且成功登录后，获取一次 device token，将 token 上传至环信服务器，与 IM 的登录账号绑定。**

如果当前 IM 的登录账号已经绑定了 device token，则 IM SDK 不会上传 token。

```
if (HonorPushClient.getInstance().checkSupportHonorPush(this)){
    // 获取荣耀 device token。
    HonorPushClient.getInstance().getPushToken(new HonorPushCallback<String>() {
        @Override
        public void onSuccess(String token) {
            EMLog.d("HonorPushClient","getPushToken onSuccess: " + token);
            EMClient.getInstance().sendHonorPushTokenToServer(token);
        }

        @Override
        public void onFailure(int code, String error) {
            EMLog.e("HonorPushClient","getPushToken onFailure: " + code + " error:" + error);
        }
    });
}
```

**步骤 6：实现通知栏消息点击动作。**

通知栏消息点击动作分为以下两类：
- （默认）点击后打开应用首页；
- 打开应用自定义页面。

下面详细介绍如何实现点击通知栏消息打开应用自定义页面。通过如下三步实现打开应用自定义页面并携带数据给应用。

1. 设置 `action` 参数。

在环信即时通讯云控制台的**添加推送证书**对话框中设置 `action` 参数。该参数需要与客户端 `AndroidManifest.xml` 文件中注册启动的 `Activity` 类中 `intent-filter` 标签中设置的 `action` 一致。该配置只能实现跳转到无需前置参数的页面。若启动应用自定义页面需要前置参数，你还需要在消息扩展中添加前置参数。

若推送不同的消息时，接收方收到后点击推送通知栏打开不同应用自定义页面，你可以添加相应的消息扩展属性实现。

以下为环信 IM 提供的通知栏消息点击动作的扩展字段：

```java
{
    "payload":{
        "ext":{
            "em_android_push_ext":{
                "honor_click_action":"com.hyphenate.chatdemo.section.me.action"
            }
        }
    }
}
```

示例代码如下：

```java
// 下面以 TXT 消息为例，图片、文件等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("test");
// 设置接收方：单聊为对端用户的用户 ID；群聊为群组 ID；聊天室聊天为聊天室 ID。
message.setTo("toChatUsername");
JSONObject jsonObject = new JSONObject();
jsonObject.put("honor_click_action","com.hyphenate.chatdemo.section.me.action");// 设置点击推送通知栏打开的应用自定义页面的自定义标记。
message.setAttribute("em_android_push_ext",jsonObject);// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

2. 在 `AndroidMainfest.xml` 中配置 Activity intent-filter。

```
  <activity android:name=".YourActivity">
    <intent-filter>
        <!-- `name` 为 Activity 类全路径，例如 com.example.test.MainActivity。 -->
        <action android:name="com.honor.push.intent.action.test" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
  </activity>
```

3. 接收数据。

客户端应用主 Activity 中接收数据。在 `YourActivity` 类的 `onCreate` 方法中实现数据读取。

```
private void getIntentData(Intent intent) {
  if (null != intent) {
      // 获取 data 里的值
      Bundle bundle = intent.getExtras();
      if (bundle != null) {
          for (String key : bundle.keySet()) {
              String content = bundle.getString(key);
              Log.i(TAG, "receive data from push, key = " + key + ", content = " + content);
          }
      }
  }
}
```

**步骤 7. 配置混淆脚本。**

你编译 APK 前需要配置混淆配置文件，避免混淆荣耀推送 SDK 导致功能异常。

在应用级根目录下打开混淆配置文件 `proguard-rules.pro`，加入排除荣耀推送 SDK 的混淆配置脚本。

```
  -ignorewarnings
  -keepattributes *Annotation*
  -keepattributes Exceptions
  -keepattributes InnerClasses
  -keepattributes Signature
  -keepattributes SourceFile,LineNumberTable
```

关于荣耀推送详情，请参见[荣耀推送官网](https://developer.hihonor.com/cn/kitdoc?category=%E5%9F%BA%E7%A1%80%E6%9C%8D%E5%8A%A1&kitId=11002&navigation=guides&docId=introduction.md&token=)。


#### 小米推送集成

环信即时通讯 IM SDK 中已经集成了小米推送（基于 `MiPush_SDK_Client_3_6_12.jar`）相关逻辑，你还需要完成以下步骤：

**步骤一、在小米开放平台创建应用。**

在 [小米开放平台](https://dev.mi.com/platform) 创建应用，开启推送服务。详见小米官方网站的 [推送服务接入指南](https://dev.mi.com/console/doc/detail?pId=68)。

**步骤二、上传推送证书。**

注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> 即时推送 —> 配置证书 —> 添加推送证书 —> 小米，然后输入你在 [小米开放平台](https://dev.mi.com/platform) 创建的应用信息中的 App ID 和 Secret Key 以及程序的包名。

**步骤三 集成小米推送 SDK。**

1. 下载 [小米推送 SDK](https://admin.xmpush.xiaomi.com/zh_CN/mipush/downpage) ，将 Jar 包添加到项目中。

2. 配置 `AndroidManifest.xml`，详见 [官方文档](https://dev.mi.com/console/doc/detail?pId=41#_0_0)。

   - 推送服务需要的权限列表：

   ```xml
   <!--注：若使用小米推送 SDK 3.6.12 版本，需要添加以下权限-->
   <!-- <uses-permission android:name="android.permission.GET_TASKS"/>-->  
   
   <!--注：以下三个权限在小米推送 SDK 4.8.0 及以上版本不再依赖-->
   <!-- <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />-->
   <!-- <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />-->
   <!-- <uses-permission android:name="android.permission.READ_PHONE_STATE" />-->

   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
   <uses-permission android:name="android.permission.VIBRATE"/>
   <permission android:name="com.xiaomi.mipushdemo.permission.MIPUSH_RECEIVE"
   android:protectionLevel="signature" /> <!--这里 `com.xiaomi.mipushdemo` 改成 app 的包名-->
   <uses-permission android:name="com.xiaomi.mipushdemo.permission.MIPUSH_RECEIVE" /><!--这里 `com.xiaomi.mipushdemo` 改成 app 的包名-->
   ```

   - 推送服务需要配置的 service 和 receiver：

   ```xml
   <service
       android:name="com.xiaomi.push.service.XMPushService"
       android:enabled="true"
       android:process=":pushservice" />

   <!--注：此 service 必须在小米推送 SDK 3.0.1 版本以后（包括小米推送 SDK 3.0.1 版本）加入-->
   <service
       android:name="com.xiaomi.push.service.XMJobService"
       android:enabled="true"
       android:exported="false"
       android:permission="android.permission.BIND_JOB_SERVICE"
       android:process=":pushservice" />

   <!--注：com.xiaomi.xmsf.permission.MIPUSH_RECEIVE 这里的包名不能改为 app 的包名-->
   <service
       android:name="com.xiaomi.mipush.sdk.PushMessageHandler"
       android:enabled="true"
       android:exported="true"
       android:permission="com.xiaomi.xmsf.permission.MIPUSH_RECEIVE" />

   <!--注：此 service 必须在小米推送 SDK 2.2.5 版本以后（包括小米推送 SDK 2.2.5 版本）加入-->
   <service
       android:name="com.xiaomi.mipush.sdk.MessageHandleService"
       android:enabled="true" />

   <receiver
       android:name="com.xiaomi.push.service.receivers.NetworkStatusReceiver"
       android:exported="true">
       <intent-filter>
           <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
           <category android:name="android.intent.category.DEFAULT" />
       </intent-filter>
   </receiver>

   <receiver
       android:name="com.xiaomi.push.service.receivers.PingReceiver"
       android:exported="false"
       android:process=":pushservice">
       <intent-filter>
           <action android:name="com.xiaomi.push.PING_TIMER" />
       </intent-filter>
   </receiver>
   ```

3. 自定义一个继承自环信即时通讯 IM SDK 中 **EMMiMsgReceiver** 类的 `BroadcastReceiver`，并进行注册：

   ```xml
   <receiver android:name=".common.receiver.MiMsgReceiver">
       <intent-filter>
           <action android:name="com.xiaomi.mipush.RECEIVE_MESSAGE" />
       </intent-filter>
       <intent-filter>
           <action android:name="com.xiaomi.mipush.MESSAGE_ARRIVED" />
       </intent-filter>
       <intent-filter>
           <action android:name="com.xiaomi.mipush.ERROR" />
       </intent-filter>
   </receiver>
   ```

4. 在 SDK 初始化的时候，配置启用小米推送。

   ```java
   EMOptions options = new EMOptions();
   ...
   EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
   builder.enableMiPush(String appId, String appKey);
   // 将 pushconfig 设置为 ChatOptions
   options.setPushConfig(builder.build());
   // 初始化 IM SDK
   EMClient.getInstance().init(this, options);
   ```

#### OPPO 推送集成

环信即时通讯 IM SDK 中已经集成了 OPPO 推送相关逻辑，你还需要完成以下步骤：

**步骤一、在 OPPO 开发者后台创建应用。**

在 OPPO 开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，详见 OPPO 官方介绍：[ OPPO 推送服务集成](https://open.oppomobile.com/new/developmentDoc/info?id=10195)

**步骤二、上传推送证书。**

   注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> **即时推送** —> **配置证书** —> **添加推送证书** —> **OPPO**，然后输入你在 [OPPO 开发者后台](https://open.oppomobile.com/service/oms?service_id=1000004&app_type=app&app_id=30004346)创建的应用的 `appkey` 和 `mastersecret` 以及程序的 `包名`，MasterSecret 需要到 [OPPO 推送平台](https://open.oppomobile.com/) - **配置管理** - **应用配置** 页面查看。

**步骤三、集成 OPPO 推送 SDK。**

1. 配置 OPPO 推送 jar 包：在 OPPO 推送官网下载推送 SDK 包，把 jar 包放到 libs 目录下并 sync 。也可以直接使用环信 Android IM Demo 中集成的 OPPO 推送的 jar 包。

2. 配置 `AndroidManifest.xml`。

:::tip
OPPO 推送在 2.1.0 适配了 Android Q，在 Android Q 上接收 OPPO 推送需要升级环信 SDK 到 3.7.1 以及之后的版本，并使用 OPPO 推送 2.1.0 的包。从 3.9.1 版本开始，升级 OPPO 推送版本到 3.0.0。
:::

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
   android:permission="com.coloros.mcs.permission.SEND_MCS_MESSAGE">
   <intent-filter>
       <action android:name="com.coloros.mcs.action.RECEIVE_MCS_MESSAGE"/>
   </intent-filter>
   </service> <!--兼容 Q 以下版本-->

   <service
   android:name="com.heytap.msp.push.service.DataMessageCallbackService"
   android:permission="com.heytap.mcs.permission.SEND_PUSH_MESSAGE">
   <intent-filter>
       <action android:name="com.heytap.mcs.action.RECEIVE_MCS_MESSAGE"/>
       <action android:name="com.heytap.msp.push.RECEIVE_MCS_MESSAGE"/>
   </intent-filter>
   </service> <!--兼容 Q 版本-->
   <!-- OPPO 推送配置 end -->
   ```

3. 在 SDK 初始化的时候，配置启用 OPPO 推送。

   ```java
   EMOptions options = new EMOptions();
   ...
   EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
   builder.enableOppoPush(String appKey,String appSecret);
   // 将 pushconfig 设置为 ChatOptions
   options.setPushConfig(builder.build());
   // 初始化 IM SDK
   EMClient.getInstance().init(this, options);
   ```

4. 调用 OPPO 推送的初始化。

   ```java
   HeytapPushManager.init(context, true);
   ```

#### VIVO 推送集成

环信即时通讯 IM SDK 中已经集成了 VIVO 推送（基于 `vivo_push_v2.3.1.jar`）相关逻辑，你还需要完成以下步骤：

**步骤一、在 VIVO 开发者后台创建应用。**

在 VIVO 开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，详见 VIVO 官方介绍：[ VIVO 推送服务集成](https://dev.vivo.com.cn/documentCenter/doc/281)。

**步骤二、上传推送证书。**

注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> **即时推送** —> **配置证书** —> **添加推送证书** —> **VIVO**，然后输入你在 [VIVO 开发者后台](https://vpush.vivo.com.cn/#/appdetail)创建的应用的 `APP ID`，`APP KEY` 和 `APP SECRET` 以及程序的 `包名`。

**步骤三、集成 VIVO 推送 SDK。**

1. 配置 VIVO 推送 jar 包：在 VIVO 推送官网下载推送 SDK 包，将 jar 包放到 libs 目录下并 sync 。也可以直接使用环信 Android IM Demo 中集成的 VIVO 推送的 jar 包。

2. 配置 `AndroidManifest.xml` 。

   - 推送服务需要的 service 和 receiver，并且需要配置 VIVO 的 app_id 和 app_key：

   ```xml
   <!-- VIVO 推送配置 start -->
   <!--VIVO Push SDK 的版本信息-->
   <meta-data
       android:name="sdk_version_vivo"
       android:value="484"/>
   <meta-data
       android:name="local_iv"
       android:value="MzMsMzQsMzUsMzYsMzcsMzgsMzksNDAsNDEsMzIsMzgsMzcsMzYsMzUsMzQsMzMsI0AzNCwzMiwzMywzNywzMywzNCwzMiwzMywzMywzMywzNCw0MSwzNSwzNSwzMiwzMiwjQDMzLDM0LDM1LDM2LDM3LDM4LDM5LDQwLDQxLDMyLDM4LDM3LDMzLDM1LDM0LDMzLCNAMzQsMzIsMzMsMzcsMzMsMzQsMzIsMzMsMzMsMzMsMzQsNDEsMzUsMzIsMzIsMzI" />
   <service
       android:name="com.vivo.push.sdk.service.CommandClientService"
       android:permission="com.push.permission.UPSTAGESERVICE"
       android:exported="true" />
   <activity
       android:name="com.vivo.push.sdk.LinkProxyClientActivity"
       android:exported="false"
       android:screenOrientation="portrait"
       android:theme="@android:style/Theme.Translucent.NoTitleBar" />
   <!--推送配置项-->
   <meta-data
       android:name="com.vivo.push.api_key"
       android:value="开发者自己申请的 appKey" />
   <meta-data
       android:name="com.vivo.push.app_id"
       android:value="开发者自己申请的 appId" />

   <receiver android:name="com.hyphenate.push.platform.vivo.EMVivoMsgReceiver" >
       <intent-filter>
           <!-- 接收推送消息 -->
           <action android:name="com.vivo.pushclient.action.RECEIVE" />
       </intent-filter>
   </receiver>
   <!-- VIVO 推送配置 end -->
   ```

3. 在 SDK 初始化的时候，配置启用 VIVO 推送。

   ```java
   EMOptions options = new EMOptions();
   ...
   EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
   builder.enableVivoPush();
   // 将 pushconfig 设置为 ChatOptions
   options.setPushConfig(builder.build());
   // 初始化 IM SDK
   EMClient.getInstance().init(this, options);
   ```

4. VIVO 设备安装应用后默认没有打开允许通知权限，测试前请先去设置中打开该应用的允许通知权限。

   [VIVO 推送官方文档](https://dev.vivo.com.cn/documentCenter/doc/363)

#### 魅族推送集成

**步骤一、在魅族开发者后台创建应用。**

在魅族开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，详见魅族官方介绍：[Flyme 推送服务集成](https://open.flyme.cn/docs?id=129)。

**步骤二、上传推送证书。**

注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> **即时推送** —> **配置证书** —> **添加推送证书** —> **魅族**，然后输入你在[ flyme 推送平台](https://push.meizu.com/#/config/app?appId=8843&_k=dnrz9k)创建的应用的 `APP ID` 和 `APP SECRET` 以及程序的 `包名`。

**步骤三、集成魅族推送 SDK。**

1. 配置魅族推送 jar 包：
   在 app level/build.gradle 中添加依赖。

   ```gradle
   dependencies{
       // 该 jar 托管在 jcenter 中，请确保当前项目已配置 jcenter 仓库。
       implementation 'com.meizu.flyme.internet:push-internal:3.7.0@aar'
   }
   ```

2. 配置 `AndroidManifest.xml`。

   - 推送服务需要的权限列表：

   ```xml
   <!-- 魅族推送配置 start-->
   <!-- 兼容 flyme5.0 以下版本，魅族内部集成 pushSDK 必填，不然无法收到消息-->
   <uses-permission android:name="com.meizu.flyme.push.permission.RECEIVE" />
   <permission
       android:name="${applicationId}.push.permission.MESSAGE"
       android:protectionLevel="signature" />
   <uses-permission android:name="${applicationId}.push.permission.MESSAGE" />
   <!-- 兼容 flyme3.0 配置权限-->
   <uses-permission android:name="com.meizu.c2dm.permission.RECEIVE" />
   <permission
       android:name="${applicationId}.permission.C2D_MESSAGE"
       android:protectionLevel="signature" />
   <uses-permission android:name="${applicationId}.permission.C2D_MESSAGE" />
   <!-- 魅族推送配置 end-->
   ```

   - 推送服务需要的 receiver：

   ```xml
   <!-- MEIZU 推送配置 start -->
   <receiver android:name="com.hyphenate.push.platform.meizu.EMMzMsgReceiver">
       <intent-filter>
           <!-- 接收 push 消息 -->
           <action android:name="com.meizu.flyme.push.intent.MESSAGE"
               />
           <!-- 接收 register 消息 -->
           <action
               android:name="com.meizu.flyme.push.intent.REGISTER.FEEDBACK" />
           <!-- 接收 unregister 消息-->
           <action
               android:name="com.meizu.flyme.push.intent.UNREGISTER.FEEDBACK"/>
           <!-- 兼容低版本 Flyme3 推送服务配置 -->
           <action android:name="com.meizu.c2dm.intent.REGISTRATION"
               />
           <action android:name="com.meizu.c2dm.intent.RECEIVE" />
           <category android:name="${applicationId}"></category>
       </intent-filter>
   </receiver>
   <!-- MEIZU 推送配置 end -->
   ```

3. 在 SDK 初始化的时候，配置启用魅族推送。

   ```java
   EMOptions options = new EMOptions();
   ...
   EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
   builder.enableMeiZuPush(String appId,String appKey);
   // 将 pushconfig 设置为 ChatOptions
   options.setPushConfig(builder.build());
   // 初始化 IM SDK
   EMClient.getInstance().init(this, options);
   ```

### 4. 设置离线推送

环信 IM 3.9.2 及以上版本对离线消息推送进行了优化。你可以对 app 以及各类型的会话开启和关闭离线推送功能，关闭时可设置关闭时长。

环信 IM 支持你对离线推送功能进行如下配置：

- 设置推送通知，包含设置推送通知方式和免打扰模式。
- 配置推送翻译和推送模板。

其中，设置推送通知方式、免打扰模式和推送模板为推送的高级功能，使用前需要在[环信即时通讯云控制后台](https://console.easemob.com/user/login)上开通。

![image](@static/images/android/push/push_android_enable_push.png)

#### 4.1 设置推送通知

为优化用户在处理大量推送通知时的体验，环信 IM 在 app 和会话层面提供了推送通知方式和免打扰模式的细粒度选项。

**推送通知方式**

<table>
<tbody>
<tr>
<td width="184">
<p><strong>推送通知方式参数</strong></p>
</td>
<td width="420">
<p><strong>描述</strong></p>
</td>
<td width="321">
<p><strong>应用范围</strong></p>
</td>
</tr>
<tr>
<td width="184">
<p>ALL</p>
</td>
<td width="420">
<p>接收所有离线消息的推送通知。</p>
</td>
<td rowspan="3" width="321">
<p>&nbsp;</p>
<p>App 或单聊/群聊会话</p>
</td>
</tr>
<tr>
<td width="184">
<p>MENTION_ONLY</p>
</td>
<td width="420">
<p>仅接收提及某些用户的消息的推送通知。</p>
<p>该参数推荐在群聊中使用。若提及一个或多个用户，需在创建消息时对 ext 字段传 "em_at_list":["user1", "user2" ...]；若提及所有人，对该字段传 "em_at_list":"all"。</p>
</td>
</tr>
<tr>
<td width="184">
<p>NONE</p>
</td>
<td width="420">
<p>不接收离线消息的推送通知。</p>
</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
会话级别的推送通知方式设置优先于 app 级别的设置，未设置推送通知方式的会话默认采用 app 的设置。

例如，假设 app 的推送方式设置为 `MENTION_ONLY`，而指定会话的推送方式设置为 `ALL`。你会收到来自该会话的所有推送通知，而对于其他会话来说，你只会收到提及你的消息的推送通知。

**免打扰模式**

你可以在 app 级别指定免打扰时间段和免打扰时长，环信 IM 在这两个时间段内不发送离线推送通知。若既设置了免打扰时间段，又设置了免打扰时长，免打扰模式的生效时间为这两个时间段的累加。

免打扰时间参数的说明如下表所示：

| 免打扰时间参数       | 描述           | 应用范围           |
| :------------------- | :--------------------------- | :------------------- |
| SILENT_MODE_INTERVAL | 免打扰时间段，精确到分钟，格式为 HH:MM-HH:MM，例如 08:30-10:00。该时间为 24 小时制，免打扰时间段的开始时间和结束时间中的小时数和分钟数的取值范围分别为 [00,23] 和 [00,59]。免打扰时间段的设置说明如下：<br/> - 开始时间和结束时间的设置立即生效，免打扰模式每天定时触发。例如，开始时间为 `08:00`，结束时间为 `10:00`，免打扰模式在每天的 8:00-10:00 内生效。若你在 11:00 设置开始时间为 `08:00`，结束时间为 `12:00`，则免打扰模式在当天的 11:00-12:00 生效，以后每天均在 8:00-12:00 生效。<br/> - 若开始时间和结束时间相同，免打扰模式则全天生效。<br/> - 若结束时间早于开始时间，则免打扰模式在每天的开始时间到次日的结束时间内生效。例如，开始时间为 `10:00`，结束时间为 `08:00`，则免打扰模式的在当天的 10:00 到次日的 8:00 生效。<br/> - 目前仅支持在每天的一个指定时间段内开启免打扰模式，不支持多个免打扰时间段，新的设置会覆盖之前的设置。<br/> - 若不设置该参数，传空字符串。 | 仅用于 app 级别，对单聊或群聊会话不生效。 |
| SILENT_MODE_DURATION | 免打扰时长，单位为毫秒。免打扰时长的取值范围为 [0,604800000]，`0` 表示该参数无效，`604800000` 表示免打扰模式持续 7 天。<br/> 与免打扰时间段的设置长久有效不同，该参数为一次有效。    | App 或单聊/群聊会话。                     |

:::tip
若在免打扰时段或时长生效期间需要对指定用户推送消息，需设置[强制推送](#强制推送)。
:::

**推送通知方式与免打扰时间设置之间的关系**

对于 app 和 app 中的所有会话，免打扰模式的设置优先于推送通知方式的设置。例如，假设在 app 级别指定了免打扰时间段，并将指定会话的推送通知方式设置为 `ALL`。免打扰模式与推送通知方式的设置无关，即在指定的免打扰时间段内，你不会收到任何推送通知。

或者，假设为会话指定了免打扰时间段，而 app 没有任何免打扰设置，并且其推送通知方式设置为 `ALL`。在指定的免打扰时间段内，你不会收到来自该会话的任何推送通知，而所有其他会话的推送保持不变。

##### 4.1.1 设置 app 的推送通知

你可以调用 `setSilentModeForAll` 设置 app 级别的推送通知，并通过指定 `EMSilentModeParam` 字段设置推送通知方式和免打扰模式，如下代码示例所示：

```java
//设置推送通知方式为 `MENTION_ONLY`。
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.REMIND_TYPE)
                                .setRemindType(EMPushManager.EMPushRemindType.MENTION_ONLY);

//设置离线推送免打扰时长为 15 分钟。
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.SILENT_MODE_DURATION)
                                .setSilentModeDuration(15);

//设置离线推送的免打扰时间段为 8:30 到 15:00。
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.SILENT_MODE_INTERVAL)
                                .setSilentModeInterval(new EMSilentModeTime(8, 30), new EMSilentModeTime(15, 0));

//设置 app 的离线推送。
EMClient.getInstance().pushManager().setSilentModeForAll(param, new EMValueCallBack<EMSilentModeResult>(){});
```

##### 4.1.2 获取 app 的推送通知设置

你可以调用 `getSilentModeForAll` 获取 app 级别的推送通知设置，如以下代码示例所示：

```java
EMClient.getInstance().pushManager().getSilentModeForAll(new EMValueCallBack<EMSilentModeResult>(){
    @Override
    public void onSuccess(EMSilentModeResult result) {
        //获取 app 的推送通知方式。
        EMPushManager.EMPushRemindType remindType = result.getRemindType();

        //获取 app 的离线推送免打扰过期的 Unix 时间戳。
        long timestamp = result.getExpireTimestamp();

        //获取 app 的离线推送免打扰时间段的开始时间。
        EMSilentModeTime startTime = result.getSilentModeStartTime();
        startTime.getHour();//免打扰时间段的开始时间中的小时数。
        startTime.getMinute();//免打扰时间段的开始时间中的分钟数。

        //获取 app 的离线推送免打扰时间段的结束时间。
        EMSilentModeTime endTime = result.getSilentModeEndTime();
    }

    @Override
    public void onError(int error, String errorMsg) {}
});
```

##### 4.1.3 设置单个会话的推送通知

你可以调用 `setSilentModeForConversation` 设置指定会话的推送通知，并通过指定 `EMSilentModeParam` 字段设置推送通知方式和免打扰模式，如以下代码示例所示：

```java
// 设置推送通知方式为 `MENTION_ONLY`。
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.REMIND_TYPE)
                                .setRemindType(EMPushManager.EMPushRemindType.MENTION_ONLY);

// 设置离线推送免打扰时长为 15 分钟。
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.SILENT_MODE_DURATION)
                                .setSilentDuration(15);
// 设置会话的离线推送免打扰模式。目前暂不支持设置会话免打扰时间段。
EMClient.getInstance().pushManager().setSilentModeForConversation(conversationId, conversationType, param, new EMValueCallBack<EMSilentModeResult>(){});
```

##### 4.1.4 获取单个会话的推送通知设置

你可以调用 `getSilentModeForConversation` 获取指定会话的推送通知设置，如以下代码示例所示：

```java
EMClient.getInstance().pushManager().getSilentModeForConversation(conversationId, conversationType, new EMValueCallBack<EMSilentModeResult>(){
    @Override
    public void onSuccess(EMSilentModeResult result) {
        // 获取会话是否设置了推送通知方式。
        boolean enable = result.isConversationRemindTypeEnabled();
        // 检查会话是否设置了推送通知方式。
        if(enable){
            // 获取会话的推送通知方式。
            EMPushManager.EMPushRemindType remindType = result.getRemindType();
        }

        // 获取会话的离线推送免打扰过期 Unix 时间戳。
        long timestamp = result.getExpireTimestamp();
    }

    @Override
    public void onError(int error, String errorMsg) {}
});
```

##### 4.1.5 获取多个会话的推送通知设置

1. 你可以在每次调用中最多获取 20 个会话的设置。
2. 如果会话继承了 app 设置或其推送通知设置已过期，则返回的字典不包含此会话。

你可以调用 `getSilentModeForConversations` 获取多个会话的推送通知设置，如以下代码示例所示：

```java
EMClient.getInstance().pushManager().getSilentModeForConversations(conversationList, new EMValueCallBack<Map<String, EMSilentModeResult>>(){
    @Override
    public void onSuccess(Map<String, SilentModeResult> value) {}

    @Override
    public void onError(int error, String errorMsg) {}
});
```

##### 4.1.6 清除单个会话的推送通知方式的设置

你可以调用 `clearRemindTypeForConversation` 清除指定会话的推送通知方式的设置。清除后，默认情况下，此会话会继承 app 的设置。

以下代码示例显示了如何清除会话的推送通知方式：

```java
// 清除指定会话的推送通知方式设置。清除后，该会话会采取 app 的设置。
EMClient.getInstance().pushManager().clearRemindTypeForConversation(conversationId, conversationType, new EMCallBack(){});
```

#### 4.2 设置显示属性

##### 4.2.1 设置推送通知的显示属性

你可以调用 `updatePushNickname` 设置推送通知中显示的昵称，如以下代码示例所示：

```java
// 需要异步处理。
EMClient.getInstance().pushManager().updatePushNickname("pushNickname");
```

你也可以调用 `updatePushDisplayStyle` 设置推送通知的显示样式，如下代码示例所示：

```java
// 设置为简单样式。
EMPushManager.DisplayStyle displayStyle = EMPushManager.DisplayStyle.SimpleBanner;
// 需要异步处理。
EMClient.getInstance().pushManager().updatePushDisplayStyle(displayStyle);
```

`DisplayStyle` 是枚举类型。

| 参数             | 描述                    |
| :--------------- | :---------------------- |
| `SimpleBanner`   | 显示 “你有一条新消息”。 |
| `MessageSummary` | 显示消息内容。          |

##### 4.2.2 获取推送通知的显示属性

你可以调用 `getPushConfigsFromServer` 获取推送通知中的显示属性，如以下代码示例所示：

```java
EMPushConfigs pushConfigs = EMClient.getInstance().pushManager().getPushConfigsFromServer();
// 获取推送显示昵称。
String nickname = pushConfigs.getDisplayNickname();
// 获取推送通知的显示样式。
EMPushManager.DisplayStyle style = pushConfigs.getDisplayStyle();
```

#### 4.3 设置推送翻译

如果用户启用 [自动翻译](message_translation.html) 功能并发送消息，SDK 会同时发送原始消息和翻译后的消息。

推送通知与翻译功能协同工作。作为接收方，你可以设置你在离线时希望接收的推送通知的首选语言。如果翻译消息的语言符合你的设置，则翻译消息显示在推送通知中；否则，将显示原始消息。

以下代码示例显示了如何设置和获取推送通知的首选语言：

```java
// 设置离线推送的首选语言。
EMClient.getInstance().pushManager().setPreferredNotificationLanguage("en", new EMCallBack(){});

// 获取设置的离线推送的首选语言。
EMClient.getInstance().pushManager().getPreferredNotificationLanguage(new EMValueCallBack<String>(){});
```

#### 4.4 设置推送模板

环信 IM 支持自定义推送通知模板。使用前，你可参考以下步骤在环信即时通讯云管理后台上创建推送模板：

1. 登录环信 IM Console，进入首页。
2. 在 **应用列表** 区域中，点击对应 app 的 **操作** 一栏中的 **查看** 按钮。
3. 在环信 IM 配置页面的左侧导航栏，选择 **即时通讯 > 功能配置 > 消息推送 > 模板管理**，进入推送模板管理页面。
   ![image](@static/images/android/push/push_android_template_mgmt.png)
4. 点击 **添加推送模板**。弹出以下页面，进行参数配置。
   ![image](@static/images/android/push/push_android_template_add.png)

在环信即时通讯云管理后台中完成模板创建后，用户可以在发送消息时选择此推送模板作为默认布局，如下代码示例所示：

```java
// 下面以文本消息为例，其他类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("消息内容");
message.setTo("6006");
// 设置推送模板。设置前需在环信即时通讯云管理后台上创建推送模板。
JSONObject pushObject = new JSONObject();
JSONArray titleArgs = new JSONArray();
JSONArray contentArgs = new JSONArray();
try {
    // 设置推送模板名称。
    pushObject.put("name", "test7");
    // 设置填写模板标题的 value 数组。
    titleArgs.put("value1");
    //...
    pushObject.put("title_args", titleArgs);
    // 设置填写模板内容的 value 数组。
    contentArgs.put("value1");
    //...
    pushObject.put("content_args", contentArgs);
} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中。
message.setAttribute("em_push_template", pushObject);
// 设置消息状态回调。
message.setMessageStatusCallback(new EMCallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

### 5. 解析收到的推送字段

#### 收到的推送字段解释

| 参数 | 描述                                           |
| :--- | :--------------------------------------------- |
| `t`  | 接收者 ID 。                                   |
| `f`  | 发送者 ID 。                                   |
| `m`  | 消息 ID 。                                     |
| `g`  | 群组 ID ，当消息是群组消息时，这个值会被赋值。 |
| `e`  | 用户自定义扩展。                               |

其中 `e` 为完全用户自定义扩展，而数据来源为 `em_apns_ext` 或者 `em_apns_ext.extern`。

规则如下：

- 当 `extern` 不存在时，`e` 内容为 `em_apns_ext` 下推送服务未使用字段，即除 `em_push_title`，`em_push_content`，`em_push_name`，`em_push_channel_id`，`em_huawei_push_badge_class` 之外的其他字段。
- 当 `extern` 存在时，使用 `extern` 下字段。

#### 解析 FCM 推送字段

重写 `FirebaseMessagingService.onMessageReceived` 方法可以在 `RemoteMessage` 对象中获取自定义扩展：

```java
public class EMFCMMSGService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        if (remoteMessage.getData().size() > 0) {
            String f = remoteMessage.getData().get("f");
            String t = remoteMessage.getData().get("t");
            String m = remoteMessage.getData().get("m");
            String g = remoteMessage.getData().get("g");
            Object e = remoteMessage.getData().get("e");
        }
    }
}
```

#### 解析华为推送字段

华为推送字段默认在应用启动页的 `onCreate` 方法中可以获取到，如下：

```java
public class SplashActivity extends BaseActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            String t = extras.getString("t");
            String f = extras.getString("f");
            String m = extras.getString("m");
            String g = extras.getString("g");
            Object e = extras.get("e");
            //handle
        }
    }
}
```

#### 解析荣耀推送字段

解析方式同华为。

#### 解析小米推送字段

重写 `EMMiMsgReceiver.onNotificationMessageClicked` 方法可以在 `MiPushMessage` 对象中获取自定义扩展：

```java
public class MiMsgReceiver extends EMMiMsgReceiver {

    @Override
    public void onNotificationMessageClicked(Context context, MiPushMessage miPushMessage) {
        String extStr = miPushMessage.getContent();
        JSONObject extras = new JSONObject(extStr);
        if (extras !=null ){
          String t = extras.getString("t");
          String f = extras.getString("f");
          String m = extras.getString("m");
          String g = extras.getString("g");
          Object e = extras.get("e");
          //handle
        }
    }

}
```

#### 解析 VIVO 推送字段

对于版本号为 480，版本名为 3.0.0.0 及之后的推送 SDK，在启动的 `activty` 的 `intent` 中获取自定义扩展。

对于版本号为 480，版本名为 3.0.0.0 之前的推送 SDK，重写 `EMVivoMsgReceiver.onNotificationMessageClicked` 方法可以在 `UPSNotificationMessage` 对象中获取自定义扩展。

```java
public class MyVivoMsgReceiver extends EMVivoMsgReceiver {
    @Override
    public void onNotificationMessageClicked(Context context, UPSNotificationMessage upsNotificationMessage) {
        Map<String, String> map = upsNotificationMessage.getParams();
        if(!map.isEmpty()) {
            String t = map.get("t");
            String f = map.get("f");
            String m = map.get("m");
            String g = map.get("g");
            Object e = map.get("e");
        }
    }
}
```

#### 解析 OPPO 推送字段

解析方式同华为。

#### 解析魅族推送字段

解析方式同华为。

## 更多功能

### 自定义字段

向推送中添加你自己的业务字段以满足业务需求，比如通过这条推送跳转到某个活动页面（需要应用在前台时）。

```java
// 下面以 TXT 消息为例，IMAGE FILE 等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("message content");
// 设置要发送的用户 ID。
message.setTo("toChatUsername");
// 设置自定义推送提示。
JSONObject extObject = new JSONObject();
try {
    extObject.put("test1", "test 01");
} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中。
message.setAttribute("em_apns_ext", extObject);
// 设置消息体。
message.addBody(txtBody);
// 设置消息回调。
message.setMessageStatusCallback(new CallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

| 参数             | 描述                                                                     |
| :--------------- | :----------------------------------------------------------------------- |
| `txtBody`        | 消息体。                                                                 |
| `toChatUsername` | 消息接收方 ID。                                                          |
| `em_apns_ext`    | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `test1`          | 自定义 key，用户自定义。                                                 |

应用端解析自定义字段，参见 [解析收到的推送字段](#_5-解析收到的推送字段)。

### 自定义显示

自定义显示内容时，你可以随意设置通知时显示的内容。

```java
// 这里只是以 TXT 消息为例，IMAGE FILE 等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("message content");
// 设置要发送用户的用户 ID。
message.setTo("toChatUsername");
// 设置自定义推送提示。
JSONObject extObject = new JSONObject();
try {
    extObject.put("em_push_title", "custom push title");
    extObject.put("em_push_content", "custom push content");
} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中。
message.setAttribute("em_apns_ext", extObject);
// 设置消息体。
message.addBody(txtBody);
// 设置消息回调。
message.setMessageStatusCallback(new CallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

| 参数              | 描述                                                                     |
| :---------------- | :----------------------------------------------------------------------- |
| `toChatUsername`  | 消息接收方 ID。                                                          |
| `em_apns_ext`     | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `em_push_title`   | 自定义字段 key，用于设置自定义的标题，该值为固定值，不可修改。           |
| `em_push_content` | 自定义字段 key，用于设置自定义的内容，该值为固定值，不可修改。           |

### 强制推送

使用该方式设置后，本条消息会忽略接收方的免打扰设置，不论是否处于免打扰时间段都会正常向对方推送通知；

```java
// 下面以 TXT 消息为例，图片、文件等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("test");
// 设置要发送用户的用户 ID。
message.setTo("toChatUsername");
// 设置自定义扩展字段。
message.setAttribute("em_force_notification", true);
// 设置消息回调。
message.setMessageStatusCallback(new CallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

| 参数                    | 描述                                                                                                   |
| :---------------------- | :----------------------------------------------------------------------------------------------------- |
| `txtBody`               | 消息体。                                                                                               |
| `toChatUsername`        | 消息接收方：<br/> - 单聊为对端用户的用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。    |
| `em_force_notification` | 是否为强制推送：<br/> - `YES`：强制推送<br/> - （默认）`NO`：非强制推送。<br/>该字段名固定，不可修改。 |

### 发送静默消息

发送静默消息指发送方在发送消息时设置不推送消息，即用户离线时，环信即时通讯 IM 服务不会通过第三方厂商的消息推送服务向该用户的设备推送消息通知。因此，用户不会收到消息推送通知。当用户再次上线时，会收到离线期间的所有消息。

发送静默消息和免打扰模式下均为不推送消息，区别在于发送静默消息为发送方在发送消息时设置，而免打扰模式为接收方设置在指定时间段内不接收推送通知。

```java
// 下面以 TXT 消息为例，图片、文件等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("test");
// 设置接收方：单聊为对端用户的用户 ID；群聊为群组 ID；聊天室聊天为聊天室 ID。
message.setTo("toChatUsername");
// 设置自定义扩展字段。
message.setAttribute("em_ignore_notification", true);
// 设置消息回调。
message.setMessageStatusCallback(new CallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

| 参数                     | 描述                                                                                                           |
| :----------------------- | :------------------------------------------------------------------------------------------------------------- |
| `txtBody`                | 消息体。                                                                                                       |
| `toChatUsername`         | 消息接收方：<br/> - 单聊为对端用户的用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。            |
| `em_ignore_notification` | 是否发送静默消息。<br/> - `true`：发送静默消息；<br/> - （默认）`false`：推送该消息。<br/>该字段名固定，不可修改。 |
