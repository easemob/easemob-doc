# 第三方推送集成

## 说明

当 App 在后台运行时环信 IM SDK 默认通过一个后台服务保持一条连接环信服务器的长连接，但 Android 为了解决系统待机性能差的问题，随着 Android 版本的升级逐渐禁止了 App 级别的后台服务的运行。所以在一些版本比较高的 Android 系统上会有接收不到消息的情况。为了提高消息的到达率，我们 SDK 增加了对第三方推送服务的支持，包括小米推送，华为推送，OPPO 推送，魅族推送，VIVO 推送，Google FCM 推送。

目前小米、魅族、OPPO、VIVO 推送的主要实现集成在了环信 IM SDK 中，尽量提供给开发者最简单的集成三方推送的形式。Google FCM 和华为推送的实现仍在 Demo 层，需要开发者自己集成，详情请参考环信的 Google FCM 和华为的推送集成文档。

**注意：**`SDK V3.5.4 及以上版本才支持第三方各平台推送，但 SDK V3.5.4 在华为注册推送的时候会出现异常，该 Bug 在 V3.5.5 及之后的版本中已修复，这里建议未集成的用户或者已是 V3.5.4 的用户升级到更高的 SDK 版本。`

##### 各推送使用条件：

- Google FCM：需要 Google Play Service 和能连接 Google 服务器的网络；
- 小米推送：在小米系统上可用；
- 华为推送：在华为系统上可用；
- 魅族推送：在魅族系统上可用；
- OPPO 推送：在 OPPO 系统上可用；
- VIVO 推送：在 VIVO 系统上可用；
- SDK 内部会按照这个顺序去检测设备的推送支持情况。
- 如果未设置第三方推送或者不满足使用第三方推送的条件，环信 IM SDK 会通过一些保活手段尽可能的保持与环信服务器的长连接，以确保消息的及时送达。

:::tip
建议：如果你的 App 有海外使用场景，建议开启 FCM 推送；由于各推送使用条件不同，建议尽可能同时支持小米和华为推送。
:::

#### 消息推送流程：

![img](@static/images/privitization/image010.png)

1. 判断设备支持哪种推送（App 配置了第三方推送并且满足该推送的使用条件）；
2. 根据集成第三方推送 SDK 获取推送 token；
3. 上传证书名称（环信服务器用来判断使用哪种推送通道）和推送 token 到环信服务器；
4. 向某设备发送消息时，环信服务器会先判断目标设备是否在线，如果目标设备不在线，则判断目标设备使用了哪种推送通道（根据目标设备上传的证书名称），使用该推送通道通过第三方推送服务器将消息推送至目标设备。

##### 环信服务器应具备的能力：

- 拥有向你的 App 发送推送消息的能力；
- 开发者通过环信后台配置 App 的推送证书，推送证书会要求填写证书名称（或者 App Key），证书名称是环信服务器用来判断目标设备使用哪种推送通道的唯一条件，所以`证书名称必须与 Android 终端设备上传的证书名称一致`
- 跟终端 Android 设备一一对应的推送 token；
- 需 Android 设备上报；
- 推送 token 属于哪个推送通道；
- 需 Android 设备上报。

##### Android 设备需要做的事：

- 判断当前设备支持哪种推送通道；
- 通过集成第三方推送 SDK 获取推送 token；
- 上传证书名称（注意跟通过环信后台配置的证书名称保持一致）和推送 token 至环信服务器（该步骤必须在环信 SDK 登录成功后）。

## 配置推送接口

开发者配置推送的接口：

```
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
        builder.enableVivoPush() // 推送证书相关信息配置在 AndroidManifest.xml 中
                .enableMeiZuPush(String appId, String appKey)
                .enableMiPush(String appId, String appKey)
                .enableOppoPush(String appKey, String appSecret)
                .enableHWPush() //开发者需要调用该方法来开启华为推送
                .enableFCM(String senderId); //开发者需要调用该方法来开启 FCM 推送

EMOptions options = new EMOptions();
options.setPushConfig(builder.build());
```

开发者需要把上述配置中的相关信息换成开发者自己申请的各平台的配置。建议开发者尽可能多的配置三方推送，以确保离线消息的到达率。

**请注意： 开发者需要在 SDK 初始化之前配置相关的推送信息。**

开发者可以调用以下代码监听推送相关事件（仅支持小米、魅族、OPPO、VIVO）：

```
EMPushHelper.getInstance().setPushListener(new PushListener() {
    @Override
    public void onError(EMPushType pushType, long errorCode) {
        EMLog.e("PushClient", "Push client occur a error: " + pushType + " - " + errorCode);
// TODO: 开发者会在这个回调中收到使用推送的相关错误信息，各推送类型的 error code 开发者可以自己去各推送平台官网查询错误原因。
    }

    @Override
    public boolean isSupportPush(EMPushType pushType, EMPushConfig pushConfig) {
        return super.isSupportPush(pushType, pushConfig);
// TODO：开发者可以复写该方法控制设备是否支持某推送的判断。
    }
});
```

## 关于混淆

- 如果您在项目中开启了混淆，请把以下规则添加到您的混淆规则中：

```
# 环信 push
  -dontwarn com.hyphenate.push.***
  -keep class com.hyphenate.push.*** {*;}
  
```

- 关于环信推送中集成的第三方推送的混淆规则，可以自行到各开发者推送平台查看

## Google FCM 推送集成


SDK 3.4.2 版本开始默认优先使用 FCM 推送，在一些带 Google Play Service 的华为设备上，开发者可通过设置 EMOptions#setUseFCM(false) 关闭 FCM 推送的使用，来达到使用华为推送的目的。SDK 3.8.5 版本开始废弃了 EMOptions#setUseFCM(false)，由应用层去控制是否优先使用 FCM 推送。


### 说明

- FCM 使用主要针对海外用户；
- FCM 要求设备安装有 Google Play 服务、 Google Play 商店 和 能连接 Google 服务器的网络。

### 服务端

1.登录[Firebase管理后台](https://console.firebase.google.com/)

2.在Firebase欢迎界面点击 **Add Project**，输入相应内容并点击 **Create Project**。

3.在Firebase欢迎界面选择 **Add Firebase to your Android App**。

4.选择应用类型后需要输入包名、项目昵称、SHA-1，然后点击 **Register App**。

5.进入引导页，如下图，点击按钮下载 google-services.json 文件到本地。**注意该 json 文件在 Android 项目中的放置位置。**

![img](@static/images/privitization/3.3.5_config_download.png)


6.跳过引导页，点击 Cloud Messaging tab 页，复制 Server Key 和 Sender ID。

![img](@static/images/privitization/3.3.5_cloud_messaging.png)


7.登录[环信管理后台](/document/v1/privatization/uc_configure.html#配置推送证书)，首页-应用列表—管理-即时推送—配置证书，证书的名称要求填上方复制 Sender ID，证书秘钥填写上方复制的 Server Key。

![img](@static/images/privitization/添加谷歌证书.png)

![img](@static/images/privitization/3.3.5_certificate_add_success.png)

### 移动端

:::notice
从 SDK 3.8.5 版本开始，移除了 SDK 内置的 11.4.0 的 FCM 推送的相关依赖，将 FCM 推送集成从 SDK 中转移到应用层，集成方式会有变化，参考后续的文档。
:::

#### SDK 3.8.5 版本之前集成方式

1.添加 Google Play Service 相关依赖库

用于检查设备是否支持 Google FCM 推送，`该步骤在 FCM 官方集成文档上不存在，由于国内特殊的使用环境，所以我们增加了该配置用于辅助检测`。

把 `compile 'com.google.android.gms:play-services-base:11.4.0`' 该行配置添加到项目相应的 build.gradle 文件中，SDK demo 中的配置在 easeui/build.gradle 中，如下：

```
dependencies {
    // 添加此行
    compile 'com.google.android.gms:play-services-base:11.4.0'
}
注意:Google 推送相关依赖库版本必须对应（该文档中均为：11.4.0），否则可能会出现类冲突的错误。
```

2.在 project-level 的 build.gradle 中添加 FCM 相关库文件配置：

```
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        // 添加此行
        classpath 'com.google.gms:google-services:3.1.1'
    }
}

allprojects {
    repositories {
        // 添加此行
        maven { url 'https://maven.google.com' }
    }
}
```

3.在 app-level 的 build.gradle 中添加 FCM 相关库文件配置：Push

```
dependencies {
// 添加此行，Google Firebase cloud messaging
    compile 'com.google.firebase:firebase-messaging:11.4.0'
}

// 此行添加在文件末尾
apply plugin: 'com.google.gms.google-services'
注意:Google 推送相关依赖库版本必须对应（该文档中均为：11.4.0），否则可能会出现类冲突的错误。
```

4.放置下载的 google-services.json 在 app-level 的根目录下


![img](@static/images/privitization/3.3.5_config_location.png)

5.实现一个继承自 FirebaseInstanceIdService 的自定义 service，该类用于监听 FCM token 的创建和更新。一个设备对应一个 FCM token，该 token 用于服务端向该设备推送消息，所以该 token 创建或更新后需及时上传至环信服务器。

自定义 FirebaseInstanceIdService：

```
public class EMFCMTokenRefreshService extends FirebaseInstanceIdService {
    private static final String TAG = "FCMTokenRefreshService";

    @Override
    public void onTokenRefresh() {
        super.onTokenRefresh();
        String token = FirebaseInstanceId.getInstance().getToken();
        Log.i(TAG, "onTokenRefresh: " + token);
        // Important, send the fcm token to the server
        EMClient.getInstance().sendFCMTokenToServer(token);
    }
}
```

AndroidManifest.xml：

```
<service android:name=".fcm.EMFCMTokenRefreshService">
    <intent-filter>
        <action android:name="com.google.firebase.INSTANCE_ID_EVENT" />
    </intent-filter>
</service>
```

6.实现一个继承自 FirebaseMessagingService 的自定义 service，该类用于 FCM 在后台进行接收应用推送消息的处理。并把该 service 注册到 AndroidManifest.xml 中。

自定义 FirebaseMessagingService：

```
public class EMFCMMSGService extends FirebaseMessagingService {
    private static final String TAG = "EMFCMMSGService";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        if (remoteMessage.getData().size() > 0) {
            String message = remoteMessage.getData().get("alert");
            Log.i(TAG, "onMessageReceived: " + message);
        }
    }
}
```

AndroidManifest.xml：

```
<service android:name=".fcm.EMFCMMSGService">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

7.通过 EMOptions#setUseFCM(true) 接口设置允许使用 FCM 推送，SDK 会进行 FCM 推送条件的检查，并在 FCM 推送条件满足的情况下使用 FCM 推送。接口使用可参考 Demo 中的 DemoHelper。

8.启用 FCM 推送

- `SDK3.5.4 及以后版本:`

```
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
builder.enableFCM(String senderId);
options.setPushConfig(builder.build());
```

- SDK 3.5.3 及之前版本：

```
EMOptions options = new EMOptions();
options.setFCMNumber(senderId);
```

### 推送服务测试

为了确保推送服务的成功集成，可按如下步骤进行测试：

1. 运行 App 并进行登录
2. 杀掉该 App 进程(通过 Android 任务列表滑动结束进程不是按 Home 键让 App 进入后台；`通过 设置→应用→强行停止 结束 App 进程，App 无法接收到 FCM 推送，详情请查阅 Google 官方对该操作的解释`。)
3. 向该登录账号发送消息，App 会收到通过推送服务送达的消息。

## 华为 HMS 推送集成

### 创建华为应用

首先就是去华为开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，具体可以看下华为官方介绍：[ 华为 HMS 消息推送服务集成](http://developer.huawei.com/consumer/cn/service/hms/catalog/huaweipush.html?page=hmssdk_huaweipush_devprepare)

### 上传推送证书


注册完整后，登录[环信管理后台](/document/v1/privatization/uc_configure.html#配置推送证书)，首页-应用列表—管理-即时推送—配置证书-Huawei，然后输入你在[华为开发者后台](http://developer.huawei.com/consumer/cn/devunion/openPlatform/html/memberCenter.html#/appManager)创建的应用信息中的 `APPID` 和 `SecretKey` 以及程序的 `包名`；

### 华为 4.0 推送集成

从华为 EMUI 10.0 版本开始华为推送将通知消息智能分成两个级别：一般与重要。[ 华为通知消息智能分类](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-intelligent-classification-0000001050040120)

可以参考环信最新的 demo 去集成 4.0 版本的华为推送:

1、将华为推送后台项目应用下的 “agconnect-services.json” 文件拷贝到应用级根目录下。

2、在项目级根目录的 build.gradle 里配置以下：

```
allprojects {
    repositories {
        google()
        mavenCentral()
        maven {url 'https://developer.huawei.com/repo/'}
        jcenter()//马上弃用
    }
}
buildscript {
    repositories {
        google()
        mavenCentral()
        maven {url 'https://developer.huawei.com/repo/'}
        jcenter()//马上弃用
    }
    dependencies {
        classpath 'com.huawei.agconnect:agcp:1.3.1.300'
    }
}
```

3、在应用级的 build.gradle 里添加如下编译依赖：

```
apply plugin: 'com.huawei.agconnect'

dependencies {
     //其它已存在的依赖不要删除
     implementation 'com.huawei.hms:push:4.0.2.300'
}
```

4、demo 中的 HMSPushHelper 里封装了华为申请 token 的代码，可以参考实现。

5、需要继承 HmsMessageService，重写 onNewToken，在里面去上传推送 token，可参考 demo 中的 HMSPushService，并配置到清单文件里。

```
<!--华为 HMS Config-->
<service android:name=".service.HMSPushService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.huawei.push.action.MESSAGING_EVENT" />
    </intent-filter>
</service>
<!-- huawei push end -->
```

6、在 SDK 初始化的时候，配置启用华为推送。

```
EMOptions options = new EMOptions();
//其他配置设置
...
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
builder.enableHWPush();
//其他推送配置设置
...
options.setPushConfig(builder.build());
```

**注意**：我们默认的推送文案会被智能分类到一般，APP端收到的就是静默通知，需要给消息设置自定义推送的标题和内容，具体分类标准可咨询华为官网。

### 华为推送角标

需要在消息扩展里设置上应用入口activity，如环信demo是com.hyphenate.chatuidemo.ui.SplashActivity

```
// 设置自定义推送提示
JSONObject extObject = new JSONObject();
try {
    extObject.put("em_huawei_push_badge_class", "com.hyphenate.chatuidemo.ui.SplashActivity");
} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中
message.setAttribute("em_apns_ext", extObject);
```

清空角标数参考[ 华为官方文档](http://obs.cn-north-1.myhwclouds.com/consumer/docattachment/87918b190abda6d7b7a568a7ef1dfc314cd9ad040faccf1a999dcff158ec7d79/badge.pdf)

### SDK3.4.x - SDK3.5.4 版本 华为推送集成说明

为了方便用户自己升级华为推送相关 SDK，环信 SDK 在 `3.4.x` 之后的版本中将华为推送的集成从 `SDK` 中 `转移到应用层`，SDK 提供上传华为推送 token 的接口供用户调用，方便华为推送升级时用户自行升级，以后的版本就需要开发者自己去集成华为推送相关功能，然后调用下边的方法将 token 发送到环信服务器：

```
// 上传 token 方法，token 是通过广播接收器接收到的
EMClient.getInstance().sendHMSPushTokenToServer("华为appId", "注册华为的 token");
```

`PS:`需要注意，此方法必须是登录成功后才能调用，所以请求华为 token 需要放在登录成功之后，所以我们请求华为推送 token 一般放在 MainActivity 类中，环信 IM 的 Demo 也已经集成了华为最新推送 SDK，开发者也可以参考 demo 进行集成，token 的获去就是在广播接收器中，Demo 中有实现`HMSPushReceiver`类，可以看下 demo 的代码

这是华为官方集成文档，开发者可以自己根据华为官方文档进行集成华为推送 `华为消息推送服务集成官方文档`

Demo 中将华为的 HMSAgent 做成了一个 module 进行引用（`这里没有对华为 HMSAgent 进行任何封装和修改`），开发者可以直接进行使用，也可以直接下载华为官方最新的 `HMSAgent` 自己进行集成，如果使用 demo 中的 module 需要修改以下几个地方：

```
<application>
    <!-- 接入 HMSSDK 需要注册的 appid 参数。value 的值中 “10492024” 用实际申请的 appid 替换，来源于开发者联盟网站应用的权益详情。格式 android:value="appid=xxxxxx"-->
    <meta-data
        android:name="com.huawei.hms.client.appid"
        android:value="appid=10492024" />
    <!-- 接入 HMSSDK 需要注册的 provider，authorities 一定不能与其他应用一样，所以这边 com.hyphenate.chatuidemo 要替换上您应用的包名-->
    <provider
        android:name="com.huawei.hms.update.provider.UpdateProvider"
        android:authorities="com.hyphenate.chatuidemo.hms.update.provider"
        android:exported="false"
        android:grantUriPermissions="true" />
    <!-- 接入 HMSSDK 需要注册的 provider，authorities 一定不能与其他应用一样，所以这边 com.hyphenate.chatuidemo 要替换上您应用的包名-->
    <provider
        android:name="com.huawei.updatesdk.fileprovider.UpdateSdkFileProvider"
        android:authorities="com.hyphenate.chatuidemo.updateSdk.fileProvider"
        android:exported="false"
        android:grantUriPermissions="true"/>
        ...
</application>
```

Demo 在集成华为推送时将调用华为推送的几个方法都放在了 `HMSPushHelper` 类中，开发者可以进行参考使用

配置完这些之后，在 `满足条件的华为设备` 上就可以使用华为推送接收离线推送通知了; 这里的满足条件是指：华为设备必须安装 2.6.+ 以上的华为移动服务，以及开启当前 App 的`自启动权限`；

## 小米推送集成

小米推送需要在Android端导入小米推送的jar包，在清单AndroidManifest.xml里加上小米相关的权限和配置。并请参考Android端API文档对小米推送的appid和appkey进行设置。更多详情请参考小米官方文档。

服务器端证书配置请使用环信console后台。

## 魅族推送集成

魅族推送包含该两种推送类型：Flyme 推送和集成推送。二者的区别是：Flyme 推送是魅族自己的推送；集成推送除了有魅族自己的 Flyme 推送外还可以通过配置集成小米、华为等第三方推送。环信 SDK 内部使用的是 Flyme 推送[参考文档](http://open-wiki.flyme.cn/index.php?title=Flyme推送接入文档)

**注意**：环信 SDK 从 **3.5.4** 版本开始支持 **魅族** 推送，如您使用的是之前版本的 SDK ，请先进行升级。

### 创建魅族应用

首先就是去魅族开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，具体可以看下魅族官方介绍：[ flyme 推送服务集成](http://open-wiki.flyme.cn/index.php?title=Flyme推送接入文档)

### 上传推送证书

注册完整后，需要在[环信开发者后台](/document/v1/privatization/uc_configure.html#配置推送证书)上传推送证书，选择你的应用—>推送证书—>魅族—>新增证书，然后输入你在[ flyme 推送平台](http://push.meizu.com/#/config/app?appId=8843&_k=dnrz9k)创建的应用的`APP ID`和`APP SECRET`以及程序的`包名`；

### 接入流程

1.在 app level/build.gradle 中添加 dependency ：

```
dependencies{
// 该aar托管在jcenter中，请确保当前项目已配置jcenter仓库。
implementation 'com.meizu.flyme.internet:push-internal:3.7.0@aar'
}
```

2.在 AndroidManifest.xml 的 manifest 标签下添加：

```
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

3.在 AndroidManifest.xml 的 application 标签下添加：

```
<!-- MEIZU推送配置 start -->
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
        <!-- MEIZU推送配置 end -->
```

4.启用魅族推送：

```
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
builder.enableMeiZuPush(String appId,String appKey);
options.setPushConfig(builder.build());
```

注意把上方的 APP ID 和 APP KEY 替换成开发者自己申请的内容。

注意：如果开发者自己集成了魅族Flame推送且实现了 MzPushMessageReceiver ，请把该父类替换为环信 SDK 提供的 EMMzMsgReceiver ，开发者自行判断业务逻辑，非开发者自有业务逻辑请通过 super 方法交给环信 SDK 处理。

## OPPO 推送集成

**注意**：环信 SDK 从 **3.5.4** 版本开始支持 **OPPO** 推送，如您使用的是之前版本的 SDK ，请先进行升级。`OPPO推送在2.1.0适配了android Q，在android Q上接收OPPO推送需要升级环信SDK到3.7.1以及之后的版本，并使用OPPO推送2.1.0的包。从3.9.1版本开始，升级OPPO推送版本到3.0.0`

### 创建 OPPO 应用

首先就是去 OPPO 开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，具体可以看下 OPPO 官方介绍：[ OPPO 推送服务集成](https://open.oppomobile.com/wiki/doc#id=10195)

### 上传推送证书

注册完整后，需要在[环信开发者后台](/document/v1/privatization/uc_configure.html#配置推送证书)上传推送证书，选择你的应用—>推送证书—>OPPO—>新增证书，然后输入你在[ OPPO 开发者后台](https://open.oppomobile.com/service/oms?service_id=1000004&app_type=app&app_id=30004346)创建的应用的`appkey`和`mastersecret`以及程序的`包名`；

### 接入流程

由于申请 OPPO 推送的时候提交的环信 Android IM Demo 的包名被占用，所以更换为 com.hyphenate.chatuidemo.push ,使用环信 Android IM Demo 测试 OPPO 推送时，请更换 app level/build.gradle 中的 applicationId 。如果还配置了 Google FCM 推送，请同时替换google-services.json 中的 package_name 字段。 OPPO 设备安装应用后默认没有打开允许通知权限，测试前请先去设置中打开该应用的允许通知权限。 [OPPO推送官方文档](https://open.oppomobile.com/wiki/doc#id=10196)

1.配置 OPPO 推送 jar 包： 去 OPPO 推送官网下载推送 SDK 包，把 jar 包放到 libs 目录下并 sync 。也可以直接使用环信 Android IM Demo 中集成的 OPPO 推送的jar 包。

2.在 AndroidManifest.xml 的 manifest 标签下添加：

```
<!-- OPPO推送配置 start -->
<uses-permission android:name="com.coloros.mcs.permission.RECIEVE_MCS_MESSAGE"/>
<uses-permission android:name="com.heytap.mcs.permission.RECIEVE_MCS_MESSAGE"/>
<!-- OPPO推送配置 end -->
```

3.在 AndroidManifest.xml 的 application 标签下添加：

```
<!-- Oppo推送配置 start -->
<service
   android:name="com.heytap.msp.push.service.CompatibleDataMessageCallbackService"
   android:permission="com.coloros.mcs.permission.SEND_MCS_MESSAGE">
   <intent-filter>
      <action android:name="com.coloros.mcs.action.RECEIVE_MCS_MESSAGE"/>
   </intent-filter>
</service> <!--兼容Q以下版本-->

<service
   android:name="com.heytap.msp.push.service.DataMessageCallbackService"
   android:permission="com.heytap.mcs.permission.SEND_PUSH_MESSAGE">
   <intent-filter>
      <action android:name="com.heytap.mcs.action.RECEIVE_MCS_MESSAGE"/>
      <action android:name="com.heytap.msp.push.RECEIVE_MCS_MESSAGE"/>
   </intent-filter>
</service> <!--兼容Q版本-->
<!-- Oppo推送配置 end -->
```

4.启用 OPPO 推送：

```
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
builder.enableOppoPush(String appKey,String appSecret);
options.setPushConfig(builder.build()); 
```

注意把上方的 APP KEY 和 APP SECRET 替换成开发者自己申请的内容。

5.调用OPPO推送的初始化

```
//OPPO SDK升级到2.1.0后需要进行初始化
HeytapPushManager.init(context, true);
```

## VIVO 推送集成

**注意**：环信 SDK 从 **3.5.4** 版本开始支持 **VIVO** 推送，如您使用的是之前版本的 SDK ，请先进行升级。 Vivo 需要应用上架应用商店才能正式使用VIVO推送。`从3.9.1版本开始，升级Vivo推送版本到3.0.0.4_484。` `Vivo默认是推送运营消息，需要联系我们配置为系统消息（重新上传证书也需要重新配置）`

### 创建 VIVO 应用

首先就是去 VIVO 开发者后台创建应用，并开启 push 服务，并上传对应的证书指纹，具体可以看下 VIVO 官方介绍：[ VIVO 推送服务集成](https://dev.vivo.com.cn/documentCenter/doc/281)

### 上传推送证书

注册完整后，需要在[环信开发者后台](/document/v1/privatization/uc_configure.html#配置推送证书)上传推送证书，选择你的应用—>推送证书—>VIVO—>新增证书，然后输入你在[ VIVO 开发者后台](https://vpush.vivo.com.cn/#/appdetail)创建的应用的`APP ID`，`APP KEY`和`APP SECRET`以及程序的`包名`；

### 接入流程

VIVO设备安装应用后默认没有打开允许通知权限，测试前请先去设置中打开该应用的允许通知权限。 [VIVO 推送官方文档](https://dev.vivo.com.cn/documentCenter/doc/158)

1.配置 VIVO 推送 jar 包： 去 VIVO 推送官网下载推送 SDK 包，把 jar 包放到 libs 目录下并 sync 。也可以直接使用环信 Android IM Demo 中集成的 VIVO 推送的 jar 包。

2.在 AndroidManifest.xml 的 application 标签下添加：

```
<!-- VIVO 推送配置 start -->
        <!--Vivo Push SDK的版本信息-->
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
            android:value="开发者自己申请的appKey" />
        <meta-data
            android:name="com.vivo.push.app_id"
            android:value="开发者自己申请的appId" />

        <receiver android:name="com.hyphenate.push.platform.vivo.EMVivoMsgReceiver" >
            <intent-filter>
                <!-- 接收 push 消息 -->
                <action android:name="com.vivo.pushclient.action.RECEIVE" />
            </intent-filter>
        </receiver>
        <!-- VIVO 推送配置 end -->
```

3.启用 VIVO 推送：

```
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
builder.enableVivoPush();
options.setPushConfig(builder.build());
```

注意：如果开发者自己集成了 VIVO 推送且实现了 OpenClientPushMessageReceiver ，请把该父类替换为环信 SDK 提供的 EMVivoMsgReceiver ，开发者自行判断业务逻辑，非开发者自有业务逻辑请通过 super 方法交给环信 SDK 处理。

## 解绑 token

使用第三方推送时需要在退出登录时解绑设备 token，调用`EMClient#getInstance()#logout(true)`或者`EMClient#getInstance()#logout(true,callback)`方法，如果是被踢的情况下，则要求设置为 false。

------

## 推送的配置选项

用户可以在消息扩展中增加特定的字段来实现消息的推送配置。

### 发送静默消息（不推送）

([Android 发消息](message))

```
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("test");
message.setTo("6006");
// 设置自定义扩展字段
message.setAttribute("em_ignore_notification", true);
// 设置消息回调
message.setMessageStatusCallback(new EMCallBack() {...});
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

### 强制推送

([Android 发消息](message))

```
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("test");
message.setTo("6006");
// 设置自定义扩展字段
message.setAttribute("em_force_notification", true);
// 设置消息回调
message.setMessageStatusCallback(new EMCallBack() {...});
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

### 自定义推送提示

([Android 发消息](message))

```
// 这里只是一 TXT 消息为例，IMAGE FILE 等类型的消息设置方法相同
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("消息内容");
message.setTo("6006");
// 设置自定义推送提示
JSONObject extObject = new JSONObject();
try {
    extObject.put("em_push_name", "离线推送标题");
    extObject.put("em_push_content", "离线推送内容部分");
} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中
message.setAttribute("em_apns_ext", extObject);
// 设置消息回调
message.setMessageStatusCallback(new EMCallBack() {...});
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```