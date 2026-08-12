# 离线打包集成 FCM

## 配置权限

Android 应用接收通知需要配置以下权限，修改 `AndroidManifest.xml` 文件：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- 基本网络权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>

    <!-- Android 13 通知运行时权限 -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>

    <!-- Android 13 媒体权限 -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO"/>

    <!-- Android 14 权限 -->
    <uses-permission android:name="android.permission.READ_MEDIA_VISUAL_USER_SELECTED"/>

    <!-- 存储权限（Android 12及以下） -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="32"/>
</manifest>
```

## FCM 配置

1. 进入 [Firebase 控制台](https://console.firebase.google.com/)，创建项目并申请应用配置。
2. 参考 [FCM 集成文档](https://firebase.google.com/docs/cloud-messaging/android/client?hl=zh-cn) 完成基本配置。

![FCM配置](/images/applet/fcm_android_config.png)

## 项目配置

### 1. 添加 FCM 依赖

   修改 app 文件夹下的 `build.gradle` 文件：

   ```gradle
   apply plugin: 'com.google.gms.google-services'

   // ...

   dependencies {
       // FCM配置
       implementation 'com.google.firebase:firebase-messaging:24.1.1'
       implementation 'com.google.android.gms:play-services-base:18.6.0'
   }
   ```

### 2. 添加配置文件

   将 `google-services.json` 放在 app 文件夹下。

   ![FCM配置文件](/images/applet/native-app_fcm_config.png)

### 3. 打包 App 资源

   使用 HBuilder 将 UniApp 打包成 App 资源，放在 `app/src/main/assets/apps` 目录中。

   ![构建资源](/images/applet/build_native_app_res.png)

### 4. 配置 App 资源

   修改 `app/src/main/assets/data/dcloud_control.xml` 文件，设置 appid 为打包的文件夹名。

   ![配置资源](/images/applet/native_config_app_res.png)

### 5. 配置 DCloud Key

   修改 `stand_alone/app/src/main/AndroidManifest.xml` 文件，设置 `dcloud_appkey`。

   [获取 AppKey](https://nativesupport.dcloud.net.cn/AppDocs/usesdk/appkey.html)

## 打包与验证

1. 使用 Android Studio 打开项目，安装应用到移动设备。
2. 通过 FCM 控制台发送测试消息验证推送功能。

   ![测试消息](/images/applet/fcm_send_test_message.png)