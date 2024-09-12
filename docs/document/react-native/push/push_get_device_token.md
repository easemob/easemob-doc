# 获取或更新推送 Token

推送 token（device token）由第三方推送服务提供，用于标识每台设备上的每个应用，推送服务通过该 token 明确消息是发送给哪个设备的，然后将消息转发给设备，设备再通知应用程序。例如，对于 FCM 推送，初次启动你的应用时，FCM SDK 为客户端应用实例生成的注册令牌 (registration token)。你可以调用 `FirebaseMessaging.getInstance().getToken()` 方法获得 token。

另外，如果退出即时通讯 IM 登录时不解绑推送 token（调用 `logout` 方法时对 `unbindDeviceToken` 参数传 `false` 时不解绑推送 token，传 `true` 表示解绑 token），用户在推送证书有效期和 token 有效期内仍会接收到离线推送通知。

本文介绍如何在 React Native 平台集成 APNs、FCM、华为、荣耀、vivo、OPPO、小米、魅族等推送服务，获取或更新推送 token。

## 获取或更新推送 Token 的流程

### 1. 创建项目

**若已有项目，请跳过该步骤。**

创建项目，例如，项目名称为 `PushProjectDemo`：

```sh
# 指定常用版本号，减少存储，且减少未知问题。
npx react-native@latest init --version 0.73.2 PushProjectDemo
```

添加依赖：

```sh
yarn add react-native-push-collection
```

### 2. iOS 平台设置

对于 iOS 平台，你可以在初始化时（调用 `ChatPushClient.init`）选择使用 APNs 或 FCM 服务。不支持动态切换。

:::tip
1. 对于 APNs 推送服务，请忽略[下载必要证书文件](#步骤一-下载必要证书文件)和[配置工程](#步骤二-配置工程)两个步骤。
2. 若不需要 iOS 平台，请跳过本节配置步骤。
:::

#### 步骤一 下载必要证书文件

对于 FCM，下载文件 `GoogleService-Info.plist`，放在 app 的 iOS 根部目录下，例如 `example/ios/PushProjectDemo/GoogleService-Info.plist`。

#### 步骤二 配置工程

对于 FCM，完成以下配置：

1. 将 `GoogleService-Info.plist` 添加到 app 的 iOS 工程。

![img](/images/react-native/push/fcm-add-file-to-project.png)

2. 在 App 中添加推送权限。

![img](/images/react-native/push/fcm-add-push-option.png)

3. 在 `Info.plist`文件中，设置自动初始化为 `false`。

```xml
<plist version="1.0">
<dict>
	<key>FirebaseMessagingAutoInitEnabled</key>
	<false/>
</dict>
</plist>
```

4. 修改应用的 `Podfile` 文件内容，添加如下内容：

```ruby
target 'PushProjectDemo' do
  # ...

  pod 'GoogleUtilities', :modular_headers => true
  pod 'FirebaseAuth', '>=10.0.0', :modular_headers => true
  pod 'FirebaseCore', '>=10.0.0', :modular_headers => true
  pod 'FirebaseMessaging', '>=10.0.0', :modular_headers => true

  # ...
end
```

#### 步骤三 获取或更新 Token（iOS）

添加 iOS 平台的必要代码，获取或更新 token。

以 `objc` 版本为例。在 `AppDelegate.mm` 中，添加如下代码。

1. 添加头文件：

```objc
#import <react-native-push-collection/PushClient.h>
```

2. 在 `AppDelegate` 的 `- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(nullable NSDictionary<UIApplicationLaunchOptionsKey, id> *)launchOptions` 中添加代码：

```objc
[[PushClient sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
```

**下面的代码实现可选，如果没有实现，则内部有默认调用。**

在 `AppDelegate` 的 `- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken` 中添加代码：

```objc
[[PushClient sharedInstance] application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
```

在 `AppDelegate` 的 `- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error;` 中添加代码：

```objc
[[PushClient sharedInstance] application:application didFailToRegisterForRemoteNotificationsWithError:error];
```

在 `AppDelegate` 的 `- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler` 中添加代码：

```objc
[[PushClient sharedInstance] application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
```

### 3. Android 平台设置

对于 Android 平台，用户可以选择 FCM、华为、荣耀、OPPO、vivo、小米或魅族推送。不支持动态切换。

**若不需要 Android 平台，请跳过本节配置步骤。**

#### 步骤一 下载必要证书文件

对于 FCM、华为和荣耀推送，即使你只使用其中一种推送服务，也需要下载其他推送证书。例如，若你只使用 FCM 推送，你需要下载 FCM、华为和荣耀推送证书。简单起见，可以使用 `react-native-push-collection` 包下的 `template` 文件夹下的对应文件占位。

| 推送类型       | 下载证书   |
| :--------- | :------------------------- |
| FCM 推送    | 下载文件 `google-services.json`，放在 App 的 Android 根目录下，例如， `example/android/app/google-services.json`。  |
| 华为推送   | 下载文件 `agconnect-services.json`，放在 App 的 Android 根目录下，例如，`example/android/app/agconnect-services.json`。 |
| 荣耀推送   | 下载文件 `mcs-services.json`，放在 App 的 Android 根目录下，例如，`example/android/app/mcs-services.json`。 |
| 其他推送服务   | 对于魅族、OPPO、vivo 和小米推送，无需下载证书放在 App 的 Android 根目录下。  |

#### 步骤二 配置工程

1. 配置项目级别的 `build.gradle`。

```groove
buildscript {
    // ...
    repositories {
        // ...
        google()
        mavenCentral()
      maven { url 'https://developer.hihonor.com/repo' }
      maven { url 'https://developer.huawei.com/repo/' }
    }
    dependencies {
        // ...
        classpath("com.android.tools.build:gradle:7.3.1")
        classpath("com.facebook.react:react-native-gradle-plugin")

      // FCM 推送配置
      // 注意：若使用 React Native 0.71 或更低版本，不能将 google-services 创建升级至 4.3.15 以上版本，因为这些版本要求 gradle 7.3.0 或更高版本。
      classpath 'com.google.gms:google-services:4.3.15'

      // 荣耀推送配置
      // 增加 ASPlugin 配置，推荐使用最新版本。
      classpath 'com.hihonor.mcs:asplugin:2.0.1.300'

      // 华为推送配置
      // 增加 AppGallery Connect (AGC) 插件配置，请参见 AGC 插件依赖关系选择合适的 AGC 插件版本。
      classpath 'com.huawei.agconnect:agcp:1.9.1.301'
    }
}

allprojects {
  repositories {
    // ...
    google()
    mavenCentral()
    maven { url 'https://developer.hihonor.com/repo' }
    maven { url 'https://developer.huawei.com/repo/' }
  }
}

```

2. 配置 app 的 `build.gradle`。

```groove
// 添加到顶部
apply plugin: "com.android.application"
apply plugin: "com.facebook.react"

// FCM 配置
apply plugin: 'com.google.gms.google-services'

// 荣耀推送配置
apply plugin: 'com.hihonor.mcs.asplugin'

// 华为推送配置
apply plugin: 'com.huawei.agconnect'
```

3. 在 `local.properties` 文件中，配置各推送服务相关的必要参数。

```
# ...
MEIZU_PUSH_APPKEY=xxx
MEIZU_PUSH_APPID=xxx
OPPO_PUSH_APPID=xxx
OPPO_PUSH_APPKEY=xxx
OPPO_PUSH_APPSECRET=xxx
VIVO_PUSH_APPID=xxx
VIVO_PUSH_APPKEY=xxx
MI_PUSH_APPKEY=xxx
MI_PUSH_APPID=xxx
FCM_SENDERID=xxx
HONOR_PUSH_APPID=xxx
HUAWEI_PUSH_APPID=xxx
```

:::tip
配置会在同步项目时生成对应文件，完成静态配置。
:::

#### 步骤三 获取或更新推送 Token（Android）

添加必要的 Android 平台代码，获取或更新推送 token。

在 `MainApplication` 文件中，在方法 `onCreate` 中添加如下代码：

```java
registerActivityLifecycleCallbacks(new PushActivityLifecycleCallbacks());
```

**`MainApplication` 为入口文件。**

```xml
  <application
      android:name=".MainApplication">
  </application>
```

### 4. 获取推送 Token（React Native）

完成 Android 或 iOS 平台配置后，编写 TypeScript/JavaScript 代码获取推送 token。

#### 步骤一 初始化推送 SDK

```tsx
import {
  ChatPushClient,
  getPlatform,
  getDeviceType,
  type PushType,
  type ChatPushListener,
} from "react-native-push-collection";

// todo: 获取当前设备平台 `ios` 或者 `android` 
const platform = getPlatform();
let pushType: PushType;
if (platform === "ios") {
  // todo: 可以设置为 `fcm` 或者 `apns`
  pushType = "fcm";
} else {
  // todo: 通过 `getDeviceType()` 方法自动获取当前类型。具体详见源码。
  pushType = (getDeviceType() ?? "unknown") as PushType;
}

// todo: 1. 初始化推送 SDK
ChatPushClient.getInstance()
  .init({
    platform: getPlatform(),
    pushType: pushType as any,
  })
  .then(() => {
    // todo: 添加推送监听器，通过该监听器获取推送 token 或者失败结果
  })
  .catch((e) => {
    ToastAndroid.show("init error:" + e.toString(), ToastAndroid.SHORT);
  });
```

#### 步骤二 添加推送监听器

添加推送监听器，通过该监听器获取推送 token 或者失败结果。

```tsx
ChatPushClient.getInstance().addListener({
  onError: (error) => {
    ToastAndroid.show("onError" + JSON.stringify(error), ToastAndroid.SHORT);
  },
  onReceivePushToken: (token) => {
    ToastAndroid.show("onReceivePushToken" + token, ToastAndroid.SHORT);
  },
} as ChatPushListener);
```

#### 步骤三 接收推送 Token

通过 `onReceivePushToken` 接收推送 Token。

```tsx
ChatPushClient.getInstance()
  .getTokenAsync()
  .then(() => {
    ToastAndroid.show("get token success", ToastAndroid.SHORT);
  })
  .catch((e) => {
    ToastAndroid.show("get token error:" + e.toString(), ToastAndroid.SHORT);
  });
```

## 注意事项

1. 该 npm 不能和 `@react-native-firebase/messaging` 一起使用。如果需要使用，则请不要使用该库。
2. 国内用户如果需要使用 FCM，可能需要正常访问外网。
3. 对于 iOS 平台，如果使用 `apns`，返回的 `token` 是经过 `base64` 编码的字符串，如果传给原生，需要 `base64` 解码操作。
4. iOS 平台使用了 `[UNUserNotificationCenter currentNotificationCenter].delegate = self;`，可能导致用户无法使用该代理接收通知。

## 常见问题

1. 直接依赖 `.aar` 文件导致编译警告，如何处理？

答：该问题可以忽略，详见[Github Issues](https://github.com/facebook/react-native/issues/33062)。

2. 在国产手机中，无法使用 FCM 推送，可能是什么原因？

答：例如，华为手机没有安装谷歌套件，无法使用 FCM 推送接收离线消息。日志提示 `Google Play services missing or without correct permission`.

同样，其它国产手机，如果没有安装谷歌套件，也无法获取 token。报错信息类似：`Topic sync or token retrieval failed on hard failure exceptions: java.util.concurrent.ExecutionException: java.io.IOException: SERVICE_NOT_AVAILABLE. Won't retry the operation`.

## 参考资料

- [小米推送 SDK 集成至 Android 应用](https://dev.mi.com/console/doc/detail?pId=41)
- [魅族推送 SDK 集成至 Android 应用](https://open-res.flyme.cn/fileserver/upload/file/202407/4d053b4a33434f20b4639e177130ac78.pdf)
- [OPPO 推送 SDK 集成至 Android 应用](https://open.oppomobile.com/new/developmentDoc/info?id=11221)
- [vivo 推送 SDK 集成至 Android 应用](https://dev.vivo.com.cn/documentCenter/doc/363)
- [Registering your app with APNs](https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns)
- [FCM 推送指南](https://firebase.google.com/docs/cloud-messaging?hl=zh-cn)
- [FCM 推送-获取和注销 Token](https://developer.huawei.com/consumer/cn/doc/HMSCore-Guides/android-client-dev-0000001050042041)
- [华为推送-获取和注销 Token](https://developer.huawei.com/consumer/cn/doc/HMSCore-Guides/android-client-dev-0000001050042041)
- [荣耀推送指南](https://developer.honor.com/cn/docs/11002/guides/kit-history)
- [在 React Native 平台集成 FCM](https://rnfirebase.io/)
- [将 Firebase 添加到您的 Android 项目](https://firebase.google.com/docs/android/setup?hl=zh-cn#kotlin)
- [在 React Native 平台集成华为推送服务](https://github.com/HMS-Core/hms-react-native-plugin/tree/master/react-native-hms-push)
- [魅族推送 PushSDK3 说明文档](https://github.com/MEIZUPUSH/PushDemo?tab=readme-ov-file)
- [vivo 推送使用指南](https://dev.vivo.com.cn/documentCenter/doc/364)
- [小米推送 SDK 在 Android 客户端的集成指南](https://dev.mi.com/distribute/doc/details?pId=1544)
- [在您的应用中初始化 Firebase](https://firebase.google.com/docs/ios/setup?hl=zh-cn#objective-c)
