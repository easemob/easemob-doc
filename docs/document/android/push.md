# Android 第三方推送设置

<Toc />

环信即时通讯 IM 支持集成第三方厂商的消息推送服务，为 Android 开发者提供低延时、高送达、高并发、不侵犯用户个人数据的离线消息推送服务。

当客户端应用进程被关闭等原因导致用户离线，环信即时通讯 IM 服务会通过第三方厂商的消息推送服务向该离线用户的设备推送消息通知。当用户再次上线时，会收到离线期间所有消息。

目前支持的手机厂商推送服务包括：华为、小米、魅族、OPPO、VIVO、GOOGLE，本文以集成小米、华为的消息推送服务为例，介绍如何在客户端应用中实现消息推送。

## 技术原理

![image](@static/images/android/push/push_android_understand.png)

1. 判断设备支持哪种推送（App 配置了第三方推送且满足该推送的使用条件）；
2. 根据集成第三方推送 SDK 获取推送 token；
3. 上传证书名称（环信服务器用来判断使用哪种推送通道）和推送 token 到环信服务器；
4. 向某设备发送消息时，环信服务器会先判断目标设备是否在线，如果目标设备不在线，则判断目标设备使用了哪种推送通道（根据目标设备上传的证书名称），使用该推送通道通过第三方推送服务器将消息推送至目标设备。

### 环信服务器应具备的能力：

- 拥有向你的 App 发送推送消息的能力；
- 开发者通过环信后台配置 App 的推送证书，推送证书会要求填写证书名称（或者 App Key），证书名称是环信服务器用来判断目标设备使用哪种推送通道的唯一条件，所以证书名称必须与 Android 终端设备上传的证书名称一致；
- 跟终端 Android 设备一一对应的推送 token；
- 需 Android 设备上报；
- 推送 token 属于哪个推送通道；
- 需 Android 设备上报。

### Android 设备需进行的操作：

- 判断当前设备支持哪种推送通道；
- 通过集成第三方推送 SDK 获取推送 token；
- 上传证书名称（注意跟通过环信后台配置的证书名称保持一致）和推送 token 至环信服务器（该步骤必须在环信 SDK 登录成功后）。

## 前提条件

1. 已开启环信即时通讯服务，详见 [开启和配置即时通讯服务](/product/enable_and_configure_IM.html)。
2. 若使用 3.9.2 或以上版本提供的推送高级功能，包括设置推送通知模式、免打扰模式和自定义推送模板，你需要在环信即时通讯云控制后台中激活推送高级功能。

![](@static/images/android/enable_push_new.png)

各推送使用条件：

- Google FCM：需要 Google Play Service 和能连接 Google 服务器的网络；
- 小米推送：在小米系统上可用；
- 华为推送：在华为系统上可用；
- 魅族推送：在魅族系统上可用；
- OPPO 推送：在 OPPO 系统上可用；
- VIVO 推送：在 VIVO 系统上可用。

SDK 内部会按照这个顺序去检测设备的推送支持情况。

如果未设置第三方推送或者不满足使用第三方推送的条件，环信 IM SDK 会通过一些保活手段尽可能的保持与环信服务器的长连接，以确保消息及时送达。

:::tip 建议
如果你的 App 有海外使用场景，建议开启 FCM 推送；由于各推送使用条件不同，建议尽可能同时支持各家推送。
:::

使用消息推送前，需要你在对应的手机厂商推送服务上注册工程，并将设备的推送证书上传到环信即时通讯云控制台。

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
// Sets pushconfig to ChatOptions.
options.setPushConfig(builder.build());
// Initializes IM SDK.
EMClient.getInstance().init(this, options);
```

### 2. 混淆

- 如果你在项目中开启了混淆，请把以下规则添加到你的混淆规则中：

```java
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

- 第三方推送的混淆规则，需到各开发者推送平台查看。

### 3. 手机厂商推送集成

#### FCM 推送集成

1. Firebase 控制台创建项目
    - 1.1 在 [Firebase console](https://console.firebase.google.com/) 创建项目，并注册 Android 应用。
    - 1.2 按照提示去下载 google-services.json 文件到本地，并按照引导放置到项目的指定位置。
    - 1.3 跳转到 `Project settings` 页面，选择 `Cloud Messaging` 标签，即可看到 `Server ID` 和 `Server Key`。
2. 上传推送证书
    - 注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> **即时推送** —> **配置证书** —> **添加推送证书** —> **谷歌**，然后输入 Firebase 项目设置里的 `Server ID` 和 `Server Key`。
3. FCM 推送集成
    - 3.1 在项目根目录下的 `build.gradle` 中添加 FCM 服务插件
    ```gradle
    dependencies {
        // Google Firebase cloud messaging
        classpath 'com.google.gms:google-services:4.3.8'
    }
    ```
    - 3.2 在项目的 module 的 gradle 文件中（通常为 /app/build.gradle ） 配置 FCM 库的依赖。
    ```gradle
    dependencies {
        // ...

        // FCM: Import the Firebase BoM
        implementation platform('com.google.firebase:firebase-bom:28.4.1')
        // FCM: Declare the dependencies for the Firebase Cloud Messaging
        // When using the BoM, you don't specify versions in Firebase library dependencies
        implementation 'com.google.firebase:firebase-messaging'

    }
    // Add the following line:
    apply plugin: 'com.google.gms.google-services'  // Google Services plugin
    ```
    - 3.3 同步应用后，继承 `FirebaseMessagingService` 的服务，并将其在 `AndroidManifest.xml` 中注册。
    ```xml
    <service
        android:name=".java.MyFirebaseMessagingService"
        android:exported="false">
        <intent-filter>
            <action android:name="com.google.firebase.MESSAGING_EVENT" />
        </intent-filter>
    </service>
    ```
    - 3.4 在环信即时通讯 IM SDK 中启用 FCM。
    ```java
    EMOptions options = new EMOptions();
    ...
    EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
    // Replace to Your FCM sender id
    builder.enableFCM("Your FCM sender id");
    // Set pushconfig to EMOptions
    options.setPushConfig(builder.build());
    // To initialize Easemob IM SDK
    EMClient.getInstance().init(this, options);
    // After the SDK is initialized
    EMPushHelper.getInstance().setPushListener(new EMPushListener() {
        @Override
        public void onError(EMPushType pushType, long errorCode) {
            EMLog.e("PushClient", "Push client occur a error: " + pushType + " - " + errorCode);
        }
        @Override
        public boolean isSupportPush(EMPushType pushType, EMPushConfig pushConfig) {
            // Set whether FCM is supported
            if(pushType == EMPushType.FCM) {
                return GoogleApiAvailabilityLight.getInstance().isGooglePlayServicesAvailable(MainActivity.this)
                            == ConnectionResult.SUCCESS;
            }
            return super.isSupportPush(pushType, pushConfig);
        }
    });
    ```
    - 3.5 环信即时通讯 IM SDK 登录成功后，上传 FCM 的 device token。
    ```java
    // Check whether FCM is supported
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
            // Get new FCM registration token
            String token = task.getResult();
            EMClient.getInstance().sendFCMTokenToServer(token);
        }
    });
    ```
    - 3.6 监控 device token 生成。
    - 重写 `FirebaseMessagingService` 中的 `onNewToken` 方法，device token 更新后及时更新到环信即时通讯 IM SDK。
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
            // If you want to send messages to this application instance or
            // manage this apps subscriptions on the server side, send the
            // FCM registration token to your app server.
            if(EMClient.getInstance().isSdkInited()) {
                EMClient.getInstance().sendFCMTokenToServer(token);
            }
        }
    }
    ```

#### 华为 HMS 推送集成

1. 华为开发者后台创建应用<br/>
    在华为开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，详见华为官方介绍：[华为 HMS 消息推送服务集成](http://developer.huawei.com/consumer/cn/service/hms/catalog/huaweipush.html?page=hmssdk_huaweipush_devprepare)。
2. 上传推送证书<br/>
    注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> **即时推送** —> **配置证书** —> **添加推送证书** —> **华为**，然后输入你在 华为开发者后台创建的[应用信息中的 APP ID 和 SecretKey 以及程序的包名](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-config-agc-0000001050170137#section125831926193110)；
3. 华为推送集成<br/>
    - 3.1 集成 HMS Core SDK，参见 [华为官网集成文档](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-integrating-sdk-0000001050040084)。
    - 3.2 注册继承自 `HmsMessageService` 的服务到 `AndroidManifest.xml` 中。
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
    - 3.3 [获取 Token 及 自动初始化](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-client-dev-0000001050042041)。
    - 3.4 在 SDK 初始化的时候，配置启用华为推送。
    ```java
    EMOptions options = new EMOptions();
    ...
    EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
    builder.enableHWPush();
    // Set pushconfig to ChatOptions
    options.setPushConfig(builder.build());
    // To initialize Agora Chat SDK
    EMClient.getInstance().init(this, options);
    ```
    - 3.5 [华为通知消息智能分类](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-intelligent-classification-0000001050040120)。

#### 小米推送集成

环信即时通讯 IM SDK 中已经集成了小米推送（基于 `MiPush_SDK_Client_3_6_12.jar`）相关逻辑，你还需要完成以下步骤：

1. 在小米开发者站创建应用
    在 [小米开发者站](http://developer.xiaomi.com/) 创建应用，并开启 push 服务，具体可以看下小米官方介绍： [推送服务接入指南](https://dev.mi.com/console/doc/detail?pId=68)。
2. 上传推送证书
    注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> 即时推送 —> 配置证书 —> 添加推送证书 —> 小米，然后输入你在 [小米开发者站](http://developer.xiaomi.com/) 创建的应用信息中的 App ID 和 Secret Key 以及程序的包名。
3. 小米推送集成
    - 3.1 下载 [小米推送 SDK](http://dev.xiaomi.com/mipush/downpage/) ，将 Jar 包添加到项目中。
    - 3.2 配置 `AndroidManifest.xml`，详见 [官方文档](https://dev.mi.com/console/doc/detail?pId=41#_0_0) 。
    - 推送服务需要的权限列表：
    ```xml
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
    - 3.3 自定义一个继承自环信即时通讯 IM SDK 中 **EMMiMsgReceiver** 类的 `BroadcastReceiver`，并进行注册：
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
    - 3.4 在 SDK 初始化的时候，配置启用小米推送。
    ```java
    EMOptions options = new EMOptions();
    ...
    EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
    builder.enableMiPush(String appId, String appKey);
    // Set pushconfig to ChatOptions
    options.setPushConfig(builder.build());
    // To initialize Agora Chat SDK
    EMClient.getInstance().init(this, options);
    ```

#### OPPO 推送集成

环信即时通讯 IM SDK 中已经集成了 OPPO 推送相关逻辑，你还需要完成以下步骤：

1. 在 OPPO 开发者后台创建应用
    - 在 OPPO 开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，具体可以看下 OPPO 官方介绍：[ OPPO 推送服务集成](https://open.oppomobile.com/wiki/doc#id=10195)
2. 上传推送证书
    - 注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> **即时推送** —> **配置证书** —> **添加推送证书** —> **OPPO**，然后输入你在 [OPPO 开发者后台](https://open.oppomobile.com/service/oms?service_id=1000004&app_type=app&app_id=30004346)创建的应用的 `appkey` 和 `mastersecret` 以及程序的 `包名`，MasterSecret 需要到 [OPPO 推送平台](https://push.oppo.com/) - **配置管理** - **应用配置** 页面查看。
3. OPPO 推送集成
    - 3.1 配置 OPPO 推送 jar 包：去 OPPO 推送官网下载推送 SDK 包，把 jar 包放到 libs 目录下并 sync 。也可以直接使用环信 Android IM Demo 中集成的 OPPO 推送的 jar 包。
    - 3.2 配置 `AndroidManifest.xml`。
        - `OPPO 推送在 2.1.0 适配了 Android Q，在 Android Q上接收 OPPO 推送需要升级环信 SDK 到 3.7.1 以及之后的版本，并使用 OPPO 推送 2.1.0 的包。从 3.9.1 版本开始，升级 OPPO 推送版本到 3.0.0`
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

    - 3.3 在 SDK 初始化的时候，配置启用 OPPO 推送
    
    ```java
    EMOptions options = new EMOptions();
    ...
    EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
    builder.enableOppoPush(String appKey,String appSecret);
    // Set pushconfig to ChatOptions
    options.setPushConfig(builder.build());
    // To initialize Agora Chat SDK
    EMClient.getInstance().init(this, options);
    ```
    
    - 3.4 调用 OPPO 推送的初始化
    
    ```java
    HeytapPushManager.init(context, true);
    ```

#### VIVO 推送集成

环信即时通讯 IM SDK 中已经集成了 VIVO 推送（基于 `vivo_push_v2.3.1.jar`）相关逻辑，你还需要完成以下步骤：

1. 在 VIVO 开发者后台创建应用
    - 在 VIVO 开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，具体可以看下 VIVO 官方介绍：[ VIVO 推送服务集成](https://dev.vivo.com.cn/documentCenter/doc/281)
2. 上传推送证书
    - 注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> **即时推送** —> **配置证书** —> **添加推送证书** —> **VIVO**，然后输入你在 [VIVO 开发者后台](https://vpush.vivo.com.cn/#/appdetail)创建的应用的 `APP ID`，`APP KEY` 和 `APP SECRET` 以及程序的 `包名`。
3. VIVO 推送集成
    - 3.1 配置 VIVO 推送 jar 包： 去 VIVO 推送官网下载推送 SDK 包，把 jar 包放到 libs 目录下并 sync 。也可以直接使用环信 Android IM Demo 中集成的 VIVO 推送的 jar 包。
    - 3.2 配置 `AndroidManifest.xml` 。
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
                <!-- 接收 push 消息 -->
                <action android:name="com.vivo.pushclient.action.RECEIVE" />
            </intent-filter>
        </receiver>
        <!-- VIVO 推送配置 end -->
        ```
    
    - 3.3 在 SDK 初始化的时候，配置启用 VIVO 推送
    
    ```java
    EMOptions options = new EMOptions();
    ...
    EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
    builder.enableVivoPush();
    // Set pushconfig to ChatOptions
    options.setPushConfig(builder.build());
    // To initialize Agora Chat SDK
    EMClient.getInstance().init(this, options);
    ```
    
    - 3.4 VIVO 设备安装应用后默认没有打开允许通知权限，测试前请先去设置中打开该应用的允许通知权限。

[VIVO 推送官方文档](https://dev.vivo.com.cn/documentCenter/doc/158)

#### 魅族推送集成

1. 在魅族开发者后台创建应用
    - 在魅族开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，具体可以看下魅族官方介绍：[Flyme 推送服务集成](http://open-wiki.flyme.cn/index.php?title=Flyme推送接入文档)
2. 上传推送证书
    - 注册完成后，需要在环信即时通讯云控制台上传推送证书，选择你的应用 —> 即时推送 —> 配置证书 —> 添加推送证书 —> 魅族，然后输入你在[ flyme 推送平台](http://push.meizu.com/#/config/app?appId=8843&_k=dnrz9k)创建的应用的 `APP ID` 和 `APP SECRET` 以及程序的 `包名`。
3. 魅族推送集成
    - 3.1 配置魅族推送 jar 包：
    在 app level/build.gradle 中添加依赖。
    
    
    ```gradle
    dependencies{
        // 该 aar 托管在 jcenter 中，请确保当前项目已配置 jcenter 仓库。
        implementation 'com.meizu.flyme.internet:push-internal:3.7.0@aar'
    }
    ```
    
    - 3.2 配置 `AndroidManifest.xml`。
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
            <	/intent-filter>
        </receiver>
        <!-- MEIZU 推送配置 end -->
        ```
    
    - 3.3 在 SDK 初始化的时候，配置启用魅族推送。
    
    ```java
    EMOptions options = new EMOptions();
    ...
    EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
    builder.enableVivoPush();
    // Set pushconfig to ChatOptions
    options.enableMeiZuPush(String appId,String appKey);
    // To initialize Agora Chat SDK
    EMClient.getInstance().init(this, options);
    ```

### 4. 设置离线推送

环信 IM 3.9.2 及以上版本对离线消息推送进行了优化。你可以对 app 以及各类型的会话开启和关闭离线推送功能，关闭时可设置关闭时长。

环信 IM 支持你对离线推送功能进行如下配置：

- 设置推送通知，包含设置推送通知方式和免打扰模式。
- 配置推送翻译和推送模板。

其中，设置推送通知方式、免打扰模式和推送模板为推送的高级功能，使用前需要在环信即时通讯云管理后台上打开开关。

![image](@static/images/android/push/push_android_enable_push.png)

#### 4.1 设置推送通知

为优化用户在处理大量推送通知时的体验，环信 IM 在 app 和会话层面提供了推送通知和免打扰（DND）模式的细粒度选项，如下表所示：

<table>
  <tr>
    <th>模式</th>
    <th>选项</th>
    <th>App</th>
    <th>会话</th>
  </tr>
  <tr>
    <td rowspan="3">推送通知方式</td>
    <td>ALL：接收所有离线消息的推送通知。</td>
    <td>✓</td>
    <td>✓</td>
  <tr>
    <td>MENTION_ONLY：仅接收提及消息的推送通知。</td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
     <td>NONE：不接收离线消息的推送通知。</td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <tr>
    <td rowspan="2">免打扰模式</td>
    <td>SILENT_MODE_DURATION：在指定的持续时间内不接收推送通知。</td>
    <td>✓</td>
    <td>✓</td>
  <tr>
    <td>SILENT_MODE_INTERVAL：在指定的时间范围内不接收推送通知。</td>
    <td>✓</td>
    <td>✗</td>
  </tr>
  </tr>
</table>

**推送通知方式**

会话级别的推送通知方式设置优先于 app 级别的设置，未设置推送通知方式的会话默认采用 app 的设置。

例如，假设 app 的推送方式设置为 `MENTION_ONLY`，而指定会话的推送方式设置为 `ALL`。你会收到来自该会话的所有推送通知，而对于其他会话来说，你只会收到提及你的消息的推送通知。

**免打扰模式**

1. 你可以在 app 级别指定 DND 时长和 DND 时间范围。环信 IM 在这两个时间段内不发送离线推送通知。
2. 会话仅支持 DND 时长设置；DND 时间范围的设置不生效。

对于 app 和 app 中的所有会话，DND 模式的设置优先于推送通知方式的设置。

例如，假设在 app 级别指定了免打扰时间段，并将指定会话的推送通知方式设置为 `ALL`。免打扰模式与推送通知方式的设置无关，即在指定的免打扰时间段内，你不会收到任何推送通知。

或者，假设为会话指定了免打扰时间段，而 app 没有任何免打扰设置，并且其推送通知方式设置为 `ALL`。在指定的免打扰时间段内，你不会收到来自该会话的任何推送通知，而所有其他会话的推送保持不变。

##### 4.1.1 设置 app 的推送通知

你可以调用 `setSilentModeForAll` 设置 app 级别的推送通知，并通过指定 `EMSilentModeParam` 字段设置推送通知方式和免打扰模式，如下代码示例所示：

```java
//设置推送通知方式为 `MentionOnly`。
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.REMIND_TYPE)
                                .setRemindType(EMPushManager.EMPushRemindType.MENTION_ONLY);

//设置离线推送免打扰时长为 15 分钟。
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.SILENT_MODE_DURATION)
                                .setSilentModeDuration(15);

//设置离线推送的免打扰时间段为 8:30 到 15:00。
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.SILENT_MODE_INTERVAL)
                                .setSilentModeInterval(new EMSilentModeTime(8, 30), new EMSilentModeTime(15, 0));

//设置 app 的离线推送免打扰模式。
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

其中 `e` 为完全用户自定义扩展，而数据来源为 `em_apns_ext` 或者 `em_apns_ext`.extern 。

规则如下：

- 当 `extern` 不存在时，`e` 内容为 `em_apns_ext` 下 push 服务未使用字段。具体为移除 `em_push_title`，`em_push_content`，`em_push_name`，`em_push_channel_id`，`em_huawei_push_badge_class` 字段后剩余所有。
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

重写 `EMVivoMsgReceiver.onNotificationMessageClicked` 方法可以在 `UPSNotificationMessage` 对象中获取自定义扩展：

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

解析方式同华为

#### 解析魅族推送字段

解析方式同华为

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

| 参数             | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| `txtBody`        | 消息体。                                                     |
| `toChatUsername` | 消息接收方 ID。                                              |
| `em_apns_ext`    | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `test1`          | 自定义 key，用户自定义。                                     |

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

| 参数              | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| `toChatUsername`  | 消息接收方 ID。                                              |
| `em_apns_ext`     | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `em_push_title`   | 自定义字段 key，用于设置自定义的标题，该值为固定值，不可修改。 |
| `em_push_content` | 自定义字段 key，用于设置自定义的内容，该值为固定值，不可修改。 |

### 强制推送

使用该方式设置后，本条消息会忽略接收方的免打扰设置，不论是否处于免打扰时间段都会正常向对方推送通知；

```java
// 下面以 TXT 消息为例，IMAGE FILE 等类型的消息设置方法相同。
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

| 参数                    | 描述                                   |
| :---------------------- | :------------------------------------- |
| `txtBody`               | 消息体。                               |
| `toChatUsername`        | 消息接收方用户 ID。                    |
| `em_force_notification` | 标志是否为强制推送的关键字，不可修改。 |