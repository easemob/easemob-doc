# Android SDK 快速集成


## Android SDK 介绍

环信 SDK 为用户开发 IM 相关的应用提供的一套完善的开发框架。包括以下几个部分：

![img](@static/images/privitization/development-framework.png)

- SDK_Core 为核心的消息同步协议实现，完成与服务器之间的信息交换。
- SDK 是基于核心协议实现的完整的 IM 功能，实现了不同类型消息的收发、会话管理、群组、好友、聊天室等功能。
- EaseIMKit 是一组 IM 相关的 UI 控件，旨在帮助开发者快速集成环信 SDK。

开发者可以基于 EaseIMKit 或者环信 SDK 开发自己的应用，前者因为把消息的发送接送等功能封装到了内部，集成时开发者不需要太关心消息是怎么发送、怎么接收等逻辑。请查阅 [EaseIMKit 使用指南](easeimkit)。

SDK 采用模块化设计，每一模块的功能相对独立和完善，用户可以根据自己的需求选择使用下面的模块：

![img](@static/images/privitization/image005.png)

- EMClient: SDK 的入口，主要完成登录、退出、连接管理等功能。也是获取其他模块的入口。
- EMChatManager: 管理消息的收发，完成会话管理等功能。
- EMContactManager: 负责好友的添加删除，黑名单的管理。
- EMGroupManager: 负责群组的管理，创建、删除群组，管理群组成员等功能。
- EMChatroomManager: 负责聊天室的管理。


## 视频教程

以下是 SDK 集成参考视频，您可以通过视频学习如何集成环信 SDK。

- [Android_SDK 集成](https://ke.qq.com/webcourse/index.html#cid=320169&term_id=100380031&taid=2357945635758761&vid=t14287kwfgl)

## Android SDK 导入

### 集成前准备

[注册并创建应用](/document/v1/privatization/uc_configure.html#创建应用)

### 手动复制 jar 包及 so 导入

[下载环信 SDK](https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/downloads/easemob-sdk-3.7.6.3.zip)。

在下载的 SDK 中，有个 libs 文件夹，libs 文件夹里是 jar 包和 so 文件。

### 通过 gradle 远程链接导入

首先在你的项目根目录 `build.gradle` 文件的 `allprojects→repositories` 属性下加入远程库地址

```
repositories {
        google()
        mavenCentral()
        maven { url 'http://developer.huawei.com/repo'} //如果需要使用华为推送HMS，则需要加上此句
    }
```

然后在你的 module 的 `build.gradle` 里加入以下代码

```
android {
    //use legacy for android 6.0（3.6.8版本之后移除apache library）
    //useLibrary 'org.apache.http.legacy'
    
    //自 3.6.0 开始需要 java8 的支持
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
dependencies {
    //其他必要依赖
    ......
    implementation 'io.hyphenate:hyphenate-chat:xxx版本号'
}
```

SDK 版本号参考[Release Note](releasenote)

**请注意：** 如果使用 3.8.0 之前的版本，gradle 依赖需要按照下面格式添加：

```
implementation 'io.hyphenate:hyphenate-sdk:3.7.5' //完整版本，包含音视频功能
//implementation 'io.hyphenate:hyphenate-sdk-lite:3.7.5' //精简版，只包含IM功能 
**重大变动**
```

因 JFrog 在 2021 年 2 月份宣布 2021 年 3 月 31 日后 JCenter 不再提供依赖库的更新，且到 2022 年 2 月 1 日后不再支持远程库的下载，详见[JFrog 声明](https://jfrog.com/blog/into-the-sunset-bintray-jcenter-gocenter-and-chartcenter/)。

IM SDK 从 3.8.1 版本后只支持从 mavenCentral 仓库下载，开发者在使用 mavenCentral() 仓库时，需要做如下配置：

1、在项目的 build.gradle 中添加 mavenCentral() 仓库。

```
buildscript {
    repositories {
        ...
        mavenCentral()
    }
}


allprojects {
    repositories {
        ...
        mavenCentral()
    }
}
```

2、修改 SDK 依赖的域名，由 “com.hyphenate” 修改为 “io.hyphenate”，如下：

```
implementation 'io.hyphenate:hyphenate-chat:xxx'
```

SDK 3.8.0 之前的版本也可以从 mavenCentral 中下载，因 IM SDK3.8.0 之前 SDK 分为含音视频版和不含音视频版，添加依赖略有不同，如下：

1、含音视频版

```
implementation 'io.hyphenate:hyphenate-sdk:xxx'
```

注：hyphenate-sdk 支持 3.8.0 之前的版本。

2、不含音视频版

```
implementation 'io.hyphenate:hyphenate-sdk-lite:xxx'
```

注：hyphenate-sdk-lite 支持 3.8.0 之前的版本。

### SDK 目录讲解

从官网上下载下来的包，解压后内容如下：

![img](@static/images/privitization/upload.png)

在这里主要介绍后面四个文件夹内容：

- doc 文件夹：SDK 相关 API 文档
- examples 文件夹：EaseIm3.0
- libs 文件夹：包含 IM 功能所需要的 jar 和 so 文件

### 第三方库介绍

#### SDK 中用到的第三方库

- android-support-v4.jar：这个可以说是每个 APP 中都是不可缺少的 jar 包，这里不多赘述
- org.apache.http.legacy.jar：在 3.6.8 版本以后 SDK 移除了这个 jar 包；在 3.6.8 之前的版本用这个库兼容，建议不要删除，否则在 6.0 系统中，SDK 会有问题

#### EaseIMKit 中用到的第三方库

- glide-4.9.0：图片处理库，显示用户头像时用到
- BaiduLBS_Android.jar：百度地图的 jar 包，在 3.8.5 版本中移除地图的相关 so 文件，jar 包仅用于编译。依赖本地 EaseIMKit 库时，如果不用百度地图，可以不在 module 中添加百度地图的相关 jar 包及 so 文件，并移除地图的相关扩展功能（具体可参考[增加更多扩展功能](easeimkit.html#功能扩)）。

### 配置工程

#### 导入 SDK

在自行开发的应用中，集成环信聊天需要把 libs 文件夹下的 jar 及 so 文件复制到你的项目的 libs 文件夹相应位置。

[![img](https://docs-im.easemob.com/_media/im/android/sdk/f1a7b52fe99d623bd798b05566c46f3.png?w=200&tok=ed406e)](https://docs-im.easemob.com/_detail/im/android/sdk/f1a7b52fe99d623bd798b05566c46f3.png?id=im%3Aandroid%3Asdk%3Aimport)

#### 配置信息

在清单文件 AndroidManifest.xml 里加入以下权限，以及写上你注册的 AppKey。

权限配置（实际开发中可能需要更多的权限，可参考 Demo）：

```
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="Your Package"
    android:versionCode="100"
    android:versionName="1.0.0">
  
    <!-- IM SDK required start -->
    <!-- 允许程序振动，用于本地通知设置振动 -->
    <uses-permission android:name="android.permission.VIBRATE" />
    <!-- 访问网络权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- 麦克风权限，用于语音消息时录制语音，不使用录制语音可以移除 -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <!-- 相机权限，用于图片消息时拍摄图片，不使用拍照可以移除 -->
    <uses-permission android:name="android.permission.CAMERA" />
    <!-- 获取运营商信息，用于获取网络状态 -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE”/>
    <!-- 写入扩展存储权限，用于附件等的存储 -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE”/>
    <!-- 访问GPS定位，用于定位消息，如果不用定位相关可以移除 -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <!-- api 21后被标记为deprecated，可以移除 -->
    <uses-permission android:name="android.permission.GET_TASKS" />
    <!-- 允许程序在手机屏幕关闭后后台进程仍然运行 -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <!-- 允许程序开机自动运行，SDK保活时使用，如果使用厂商推送，可以移除 -->
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <!-- IM SDK required end -->	
 
    <application
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:name="Your Application">
   	<!-- 设置环信应用的 AppKey -->
    	<meta-data android:name="EASEMOB_APPKEY"  android:value="Your AppKey" />
    </application>
</manifest>
```

关于 EASEMOB_APPKEY 对应的 value 获取，在创建应用后，申请 AppKey 并进行相关配置。

如果对生成的 apk 大小比较敏感，我们建议使用 jar 方式，并且手工拷贝 so，而不是使用 Aar，因为 Aar 方式会把各个平台的 so 文件都包含在其中。采用 jar 方式，可以仅保留一个 ARCH 目录，如果对大小非常敏感，建议仅保留 armeabi-v7a，这样虽然在对应平台执行的速度会降低，但是能有效减小 apk 的大小。

### 常见问题汇总

1. 用户集成 SDK 后使用 HttpClient 报错

```
建议将 SDK 升级到 3.6.8 以上版本，SDK3.6.8 以后版本移除了 apache library。
```

3.6.8 版本之前的版本请按照下面进行配置：

\- Android 6.0 及以上版本需要在 `module-level/build.gradle` android block 中添加：

```
android {
    //use legacy for android > 6.0
    useLibrary 'org.apache.http.legacy'
   }
```

\- Android 9.0 还需在 `AndroidManifest.xml` 的 `application` 标签中添加：

```
<application>
    <uses-library android:name="org.apache.http.legacy" android:required="false"/>
   </application>
```

2. Android 9.0 上强制使用 https 的问题

表现：会出现出现 `UnknownServiceException: CLEARTEXT communication to localhost not permitted by network security policy` 或者 `IOException java.io.IOException: Cleartext HTTP traffic to * not permitted` 报错

解决办法可以参考：[StackOverFlow](https://stackoverflow.com/questions/45940861/android-8-cleartext-http-traffic-not-permitted)，也可以直接在 `AndroidManifest.xml` 文件的 `application` 标签中设置 android:usesCleartextTraffic=“true”

```
<application
        android:usesCleartextTraffic="true" >
  </application>
```

3. 升级到 AndroidX 且使用 3.7.3 版本以上 SDK 报找不到 LocalBroadcastManager 的问题

报错详情如下：

```
java.lang.NoClassDefFoundError: Failed resolution of: Landroidx/localbroadcastmanager/content/LocalBroadcastManager;
        at com.hyphenate.chat.core.EMAdvanceDebugManager.h(Unknown Source:13)
        at com.hyphenate.chat.core.EMAdvanceDebugManager.a(Unknown Source:2)
        at com.hyphenate.chat.EMClient.onNewLogin(Unknown Source:62)
        at com.hyphenate.chat.EMClient$7.run(Unknown Source:197)
        ......
     Caused by: java.lang.ClassNotFoundException: Didn't find class "androidx.localbroadcastmanager.content.LocalBroadcastManager" on path: DexPathList[[zip file "/data/app/com.hyphenate.easeim-3yS1c2quwGEzgNmhDyf7dA==/base.apk"],nativeLibraryDirectories=[/data/app/com.hyphenate.easeim-3yS1c2quwGEzgNmhDyf7dA==/lib/arm64, /data/app/com.hyphenate.easeim-3yS1c2quwGEzgNmhDyf7dA==/base.apk!/lib/arm64-v8a, /system/lib64, /product/lib64]]
        ......
        at com.hyphenate.chat.core.EMAdvanceDebugManager.h(Unknown Source:13) 
        at com.hyphenate.chat.core.EMAdvanceDebugManager.a(Unknown Source:2) 
        at com.hyphenate.chat.EMClient.onNewLogin(Unknown Source:62) 
        at com.hyphenate.chat.EMClient$7.run(Unknown Source:197) 
        ...... 
```

解决办法： 含音视频：将 SDK 升级到 3.7.6 版本； 

## APP 打包混淆

在 ProGuard 文件中加入以下 keep。

```
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
//3.6.8 版本之后移除 apache，无需再添加
-keep class internal.org.apache.http.entity.** {*;}
//如果使用了实时音视频功能
-keep class com.superrtc.** {*;}
-dontwarn  com.superrtc.**
```