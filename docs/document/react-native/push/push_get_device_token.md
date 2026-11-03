# 获取或更新推送 Token

推送 Token（Device Token）由第三方推送服务提供，用于标识设备上的应用实例，推送服务通过该 Token 将通知投递至目标应用。例如，FCM SDK 为客户端应用实例生成注册令牌（registration token）。推送 Token 与登录 IM 使用的用户 Token 不同，不能混用。

React Native SDK 不提供获取推送 Token 的接口。应用需接入对应厂商的原生推送 SDK 或 React Native 推送插件，获取 Token 后，在 IM 登录成功时将其绑定至环信服务器。Token 发生变化后，应重新绑定最新 Token，详见 [发送推送 Token 到环信服务器](push_send_token_to_server.html)。

本文以独立的可选插件 `react-native-push-collection` 为例，介绍如何获取或更新推送 Token。该插件不是 IM SDK 的内置依赖；如果项目已经集成其他推送方案，可直接使用该方案获取 Token，无需重复安装此插件。

:::notice
本文插件示例依据 `react-native-push-collection` 1.0.1 的接口编写。插件与 IM SDK 的版本相互独立，集成前需确认其与项目 React Native 版本、原生构建工具和其他推送依赖的兼容性。添加插件后需重新编译原生工程，仅刷新 JavaScript 代码不能完成集成。
:::

## 实现流程

### 1. 准备项目

**若已有项目，请跳过创建项目的步骤。** 新项目的创建和 IM SDK 集成方式详见 [集成 SDK](/document/react-native/integration.html)，无需为使用推送插件将现有工程降级至旧版 React Native。

在项目根目录添加推送插件依赖。以下版本与本文插件示例对应，不表示 IM SDK 的版本要求：

```sh
yarn add react-native-push-collection@1.0.1
```

### 2. iOS 平台设置

普通 IM 离线推送使用 APNs Device Token。使用本插件时，应在调用 `ChatPushClient#init` 时将 `pushType` 设为 `apns`，不能将插件的 iOS FCM 注册令牌或 PushKit Token 作为普通 APNs Token 绑定。

**若不需要 iOS 平台，请跳过本节配置步骤。**

#### 步骤一 配置工程

1. 在 Apple Developer 中为应用开启推送能力，并确保 App ID、Bundle ID、签名和推送环境匹配，详见 [iOS APNs 推送集成文档](/document/ios/push/push_apns.html)。
2. 在 Xcode 中为应用开启 **Push Notifications** 能力。若业务还需要后台处理远程通知，再按 Apple 要求配置对应的后台模式。

   ![配置推送能力](/images/react-native/push/fcm-add-push-option.png)

3. 按插件的 CocoaPods 集成要求安装原生依赖并重新编译工程。本插件 1.0.1 的 Podspec 包含 Firebase 依赖，即使选择 APNs，也需要正确处理这些依赖；这不表示必须通过 Firebase 获取 APNs Device Token。不要将插件的依赖管理方式与 IM SDK 自身的集成方式混淆。
4. 在环信控制台上传 APNs 证书，并在 IM SDK 初始化时设置 `ChatOptions.apnsCertName`，详见 [配置 iOS 推送证书名称](push_easemob_console.html#配置-ios-推送证书名称)。

APNs Token 的获取不要求配置 Firebase 项目或下载 `GoogleService-Info.plist`。若应用另有 Firebase 业务，应按相应服务的要求独立配置。

#### 步骤二 转发原生推送回调

使用本插件时，需确保 APNs 注册成功、注册失败和远程通知回调能够转发给插件。以 Objective-C 版本的 `AppDelegate.mm` 为例。

1. 添加头文件：

```objectivec
#import <react-native-push-collection/PushClient.h>
```

2. 在 `application:didFinishLaunchingWithOptions:` 中添加以下调用，保留现有 React Native 初始化代码：

```objectivec
[[PushClient sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
```

3. 检查以下回调的转发。如果应用已实现这些方法，应将调用合并到现有实现，不重复定义方法：

在 `application:didRegisterForRemoteNotificationsWithDeviceToken:` 中转发 Token：

```objectivec
[[PushClient sharedInstance] application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
```

在 `application:didFailToRegisterForRemoteNotificationsWithError:` 中转发注册错误：

```objectivec
[[PushClient sharedInstance] application:application didFailToRegisterForRemoteNotificationsWithError:error];
```

在 `application:didReceiveRemoteNotification:fetchCompletionHandler:` 中转发通知：

```objectivec
[[PushClient sharedInstance] application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
```

插件对部分 `RCTAppDelegate` 工程提供默认转发，但不能据此假定自定义或 Swift AppDelegate 已正确转发。请按工程实际结构接入，避免重复转发或重复调用通知的完成回调。

### 3. Android 平台设置

对于 Android 平台，应用可以选择 FCM、华为、荣耀、OPPO、vivo、小米或魅族推送，并在插件初始化时指定所用渠道。

**若不需要 Android 平台，请跳过本节配置步骤。**

#### 步骤一 下载必要配置文件

所用推送服务的配置文件必须来自当前应用对应的厂商项目，不能使用占位文件获取真实 Token。

| 推送类型 | 配置文件 |
| :--- | :--- |
| FCM 推送 | 下载 `google-services.json`，放在应用模块目录，例如 `android/app/google-services.json`。 |
| 华为推送 | 下载 `agconnect-services.json`，放在应用模块目录，例如 `android/app/agconnect-services.json`。 |
| 荣耀推送 | 下载 `mcs-services.json`，放在应用模块目录，例如 `android/app/mcs-services.json`。 |
| 其他推送服务 | 魅族、OPPO、vivo 和小米推送不使用上述三个配置文件，按对应厂商要求配置应用凭据。 |

本插件的多厂商集成方案可能要求同时提供 FCM、华为和荣耀的配置文件。对于未使用的渠道，可按插件的集成说明使用其 `template` 目录中的占位文件；占位文件不代表该渠道可用。这是插件工程配置要求，不是 IM SDK 对所有应用的通用要求。

#### 步骤二 配置工程

1. 按所用推送服务和插件的要求配置项目级 `build.gradle`。保留项目现有的 Android Gradle Plugin 和 React Native Gradle Plugin 配置，不照搬旧工程的工具版本。以下展示插件 1.0.1 使用的厂商仓库与构建插件配置，合并时需检查与现有工程的兼容性：

```groovy
buildscript {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://developer.hihonor.com/repo' }
        maven { url 'https://developer.huawei.com/repo/' }
    }
    dependencies {
        // 保留现有 Android 和 React Native 构建插件配置
        // FCM 推送配置
        classpath 'com.google.gms:google-services:4.4.2'
        // 荣耀推送配置
        classpath 'com.hihonor.mcs:asplugin:2.0.1.300'
        // 华为推送配置
        classpath 'com.huawei.agconnect:agcp:1.9.1.301'
    }
}
```

依赖仓库还需在项目实际使用的仓库配置位置添加。若通过 `settings.gradle` 集中管理依赖仓库，应在该位置合并以下仓库，而不是再添加冲突的 `allprojects.repositories`：

```groovy
repositories {
    google()
    mavenCentral()
    maven { url 'https://developer.hihonor.com/repo' }
    maven { url 'https://developer.huawei.com/repo/' }
}
```

2. 按插件集成方案在应用模块的 `build.gradle` 中应用相应厂商插件，保留现有应用及 React Native 插件配置：

```groovy
// FCM 配置
apply plugin: 'com.google.gms.google-services'
// 荣耀推送配置
apply plugin: 'com.hihonor.mcs.asplugin'
// 华为推送配置
apply plugin: 'com.huawei.agconnect'
```

3. 在 `android/local.properties` 中配置所用渠道需要的参数。以下占位值需替换为厂商后台当前应用的实际配置，未使用渠道的处理以插件要求为准：

```properties
MEIZU_PUSH_APPKEY=your_meizu_app_key
MEIZU_PUSH_APPID=your_meizu_app_id
OPPO_PUSH_APPKEY=your_oppo_app_key
OPPO_PUSH_APPSECRET=your_oppo_client_app_secret
OPPO_CHANNEL_ID=your_oppo_channel_id
OPPO_CHANNEL_NAME=your_oppo_channel_name
VIVO_PUSH_APPID=your_vivo_app_id
VIVO_PUSH_APPKEY=your_vivo_app_key
MI_PUSH_APPKEY=your_xiaomi_app_key
MI_PUSH_APPID=your_xiaomi_app_id
FCM_SENDERID=your_fcm_sender_id
HONOR_PUSH_APPID=your_honor_app_id
HUAWEI_PUSH_APPID=your_huawei_app_id
```

插件会在构建时读取上述参数并生成原生配置。这里只能放厂商要求随客户端集成的参数，不要放入环信 App Secret、Firebase 服务账号私钥等服务端密钥。

4. 按目标 Android 版本和厂商要求配置通知权限、通知渠道及 Manifest。Token 获取成功不等于应用已获得通知展示权限。

:::notice
React Native SDK 5.0.0 不再通过 `ChatOptions.pushConfig` 配置厂商推送。Android 厂商推送依赖、Manifest 和原生 `EMPushConfig` 初始化需在原生工程侧完成。此插件负责获取厂商 Token，不会替代 IM SDK 所需的原生推送配置；仅获取和绑定 Token 不能代替完整集成。
:::

#### 步骤三 添加应用生命周期代码

使用本插件时，在 `MainApplication` 的 `onCreate` 中注册其生命周期监听。以下为 Java 示例，类的完整名称为 `com.pushcollection.PushActivityLifecycleCallbacks`：

```java
// 注册推送插件的应用生命周期监听
registerActivityLifecycleCallbacks(new com.pushcollection.PushActivityLifecycleCallbacks());
```

确认 Manifest 中的应用入口与实际类一致：

```xml
<application
    android:name=".MainApplication">
</application>
```

### 4. 获取推送 Token（React Native）

完成 Android 或 iOS 原生配置后，按以下顺序调用插件。`ChatPushClient`、`ChatPushListener`、`PushType` 和 `getPlatform` 均来自 `react-native-push-collection`，不是 IM SDK 的接口。

#### 步骤一 定义推送监听器

通过 `ChatPushListener#onReceivePushToken` 接收首次获取或后续更新的 Token。应用应保存最新值，在 IM 登录成功后绑定；已登录时收到新 Token，应重新绑定，详见 [绑定普通推送 Token](push_send_token_to_server.html#绑定普通推送-token)。不要在日志中输出完整 Token。

```typescript
const pushClient = ChatPushClient.getInstance();
let latestPushToken: string | undefined;

const pushListener: ChatPushListener = {
  onReceivePushToken(token) {
    // 保存最新 Token，供登录成功后绑定；已登录时应重新绑定
    latestPushToken = token;
    console.log('已获取或更新推送 Token');
  },
  onError(error) {
    // 处理推送插件报告的错误
    console.error('推送服务错误：', error);
  },
};
```

#### 步骤二 注册监听器并初始化推送插件

先注册监听器，再初始化，避免遗漏初始化期间产生的 Token 回调。以下示例在 iOS 上固定使用 `apns`；Android 渠道由业务传入，必须已完成对应厂商的集成且设备支持该服务。例如，已配置并可使用 FCM 时调用 `initializePush('fcm')`。同一应用运行期间不要反复初始化或随意切换渠道。

```typescript
async function initializePush(
  androidPushType: Exclude<PushType, 'apns' | 'unknown'>
): Promise<boolean> {
  const platform = getPlatform();
  if (platform !== 'ios' && platform !== 'android') return false;

  // iOS 普通 IM 离线推送使用 APNs Token
  const pushType = platform === 'ios' ? 'apns' : androidPushType;
  // 初始化前注册监听器
  pushClient.addListener(pushListener);
  try {
    await pushClient.init({ platform, pushType });
    return true;
  } catch (error: unknown) {
    pushClient.removeListener(pushListener);
    console.error('初始化推送插件失败：', error);
    return false;
  }
}
```

插件的 `getDeviceType` 仅根据设备厂商名称进行映射，可能返回 `unknown`，不能据此判断设备是否具备 Google Play 服务、厂商推送能力或正确凭据。不要将结果强制转换后直接作为可用渠道。

#### 步骤三 请求 Token 并在不再需要时移除监听器

`initializePush` 返回 `true` 后，调用 `ChatPushClient#getTokenFlow` 触发获取流程。该方法返回 `Promise<void>`，Token 通过监听器返回；Promise 正常结束不代表已经获取 Token，需以 `onReceivePushToken` 为准。`ChatPushClient#getToken` 可读取已取得的 Token，返回 `Promise<string | undefined>`，不用于保证生成新的 Token。

```typescript
async function requestPushToken(): Promise<void> {
  try {
    // 触发 Token 获取流程，通过 onReceivePushToken 接收结果
    await pushClient.getTokenFlow();
  } catch (error: unknown) {
    console.error('获取推送 Token 失败：', error);
  }
}

function removePushListener(): void {
  // 不再需要监听时，移除同一个监听器对象
  pushClient.removeListener(pushListener);
}
```

应用应在需要接收 Token 更新期间保留监听；移除监听器只停止业务回调，不等于注销厂商推送或解绑环信服务器上的 Token。

## 获取 PushKit Token

PushKit 用于 iOS VoIP 推送，与普通 APNs 推送使用独立的 Token。应用需在 iOS 原生工程中通过 `PKPushRegistry` 注册 VoIP 推送，在凭据更新回调中取得 Token，并转换为十六进制字符串后交给业务层。本文的 `apns` 插件示例不负责获取 PushKit Token。

获取后通过专用接口绑定，详见 [绑定 PushKit Token](push_send_token_to_server.html#绑定-pushkit-token)。不要将 PushKit Token 传给普通推送绑定接口。

## 注意事项

1. 本插件的集成说明不支持与 `@react-native-firebase/messaging` 同时使用。若项目已使用该方案，请沿用已有方案获取 Token，避免重复集成。
2. FCM 需要设备具备相应的 Google Play 服务，并能正常访问 Firebase 服务。
3. 本文插件 1.0.1 的 `apns` 渠道返回十六进制 Token 字符串，可直接用于普通 APNs Token 绑定，不需要 Base64 解码。若自行从原生获取 `NSData`，需先转换为十六进制字符串。
4. 本插件会设置 `UNUserNotificationCenter` 的 `delegate`。若应用或其他组件也使用该代理，需协调通知处理，避免覆盖现有逻辑。
5. 更新 Token 后应同步更新环信服务器的绑定；登录前取得的普通推送 Token 由应用保存，在登录成功后绑定。解绑、登出参数默认值及 iOS 限制见 [管理推送 Token](push_send_token_to_server.html#管理推送-token)。

## 常见问题

1. 直接依赖 `.aar` 文件导致构建提示，如何处理？

答：先区分警告与导致构建失败的错误，不要一律忽略。若出现 `Direct local .aar file dependencies are not supported when building an AAR`，可参考 [React Native GitHub Issue](https://github.com/facebook/react-native/issues/33062)，并结合当前插件版本及构建方式排查。

2. 在部分 Android 设备中，无法使用 FCM 推送，可能是什么原因？

答：例如，设备未安装可用的 Google Play 服务，日志可能提示 `Google Play services missing or without correct permission`。请确认服务可用且具有相应权限，必要时改用设备支持的厂商推送。

若出现 `SERVICE_NOT_AVAILABLE`，还需检查网络、Firebase 项目配置和服务可用性，不能仅凭该错误认定设备不支持 FCM。

## 参考资料

- [推送插件集成说明](https://github.com/easemob/react-native-push-collection/blob/main/docs/cn/index.md)
- [小米推送 SDK 集成至 Android 应用](https://dev.mi.com/console/doc/detail?pId=41)
- [魅族推送 SDK 集成至 Android 应用](https://open-res.flyme.cn/fileserver/upload/file/202407/4d053b4a33434f20b4639e177130ac78.pdf)
- [OPPO 推送 SDK 集成至 Android 应用](https://open.oppomobile.com/new/developmentDoc/info?id=11221)
- [vivo 推送 SDK 集成至 Android 应用](https://dev.vivo.com.cn/documentCenter/doc/363)
- [Registering your app with APNs](https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns)
- [PushKit](https://developer.apple.com/documentation/pushkit)
- [FCM 推送指南](https://firebase.google.com/docs/cloud-messaging?hl=zh-cn)
- [FCM 推送——获取注册令牌](https://firebase.google.com/docs/cloud-messaging/android/client?hl=zh-cn#retrieve-the-current-registration-token)
- [华为推送——获取和注销 Token](https://developer.huawei.com/consumer/cn/doc/HMSCore-Guides/android-client-dev-0000001050042041)
- [荣耀推送指南](https://developer.honor.com/cn/docs/11002/guides/kit-history)
- [在 React Native 平台集成 FCM](https://rnfirebase.io/)
- [将 Firebase 添加到 Android 项目](https://firebase.google.com/docs/android/setup?hl=zh-cn#kotlin)
- [在 React Native 平台集成华为推送服务](https://github.com/HMS-Core/hms-react-native-plugin/tree/master/react-native-hms-push)
- [魅族推送 PushSDK3 说明文档](https://github.com/MEIZUPUSH/PushDemo?tab=readme-ov-file)
- [vivo 推送使用指南](https://dev.vivo.com.cn/documentCenter/doc/364)
- [小米推送 SDK 在 Android 客户端的集成指南](https://dev.mi.com/distribute/doc/details?pId=1544)
