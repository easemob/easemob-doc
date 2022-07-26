---
title: Android 快速开始
---

# 环信即时通讯 IM Android 快速开始

[[toc]]

本文介绍如何快速集成环信即时通讯 IM Android SDK 实现单聊。

**最近遇到因 app 隐私问题下架的开发者需注意：**

- 请在点击获取隐私权限以后启动环信 SDK 初始化。
- `EMChatService` 和 `EMJobService` 为早期 SDK 内在应用退到后台后，对应用进行保活的程序，可以不进行注册；`EMMonitorReceiver` 为监听开机自启动服务，也可以不注册。

## 实现原理

下图展示在客户端发送和接收一对一文本消息的工作流程。

![img](https://docs-im.easemob.com/_media/ccim/web/sendandreceivemsg.png?w=1000&tok=312a4a)

## 前提条件

- Android Studio 3.0 或以上版本；
- Android SDK API 等级 19 或以上；
- Android 4.4 或以上版本的设备；
- 有效的环信即时通讯 IM 开发者账号和 App key，见 [环信即时通讯云控制台](https://console.easemob.com/user/login)。

## 准备开发环境

本节介绍如何创建项目，将环信即时通讯 IM Android SDK 集成到你的项目中，并添加相应的设备权限。

### 1. 创建 Android 项目

参考以下步骤创建一个 Android 项目。

1. 打开 Android Studio，点击 **Start a new Android Studio project**。
2. 在 **Select a Project Template** 界面，选择 **Phone and Tablet > Empty Activity**，然后点击 **Next**。
3. 在 **Configure Your Project** 界面，依次填入以下内容：
   - **Name**：你的 Android 项目名称，如 HelloWorld。
   - **Package name**：你的项目包的名称，如 com.hyphenate.helloworld。
   - **Save location**：项目的存储路径。
   - **Language**：项目的编程语言，如 Java。
   - **Minimum API level**：项目的最低 API 等级。

然后点击 **Finish**。根据屏幕提示，安装所需插件。

上述步骤使用 **Android Studio 3.6.2** 示例。你也可以直接参考 Android Studio 官网文档[创建首个应用](https://developer.android.com/training/basics/firstapp)。

### 2. 集成 SDK

选择如下任意一种方式将环信即时通讯 IM SDK 集成到你的项目中。

**注意**

- 以下集成方式只需选择一种，同时使用多种集成方式可能会报错。
- 请点击查看发版说明获得最新版本号。

#### 方法一：使用 mavenCentral 自动集成

该方法仅适用于 v3.8.2 或以上版本。

1. 在项目的 `build.gradle` 中添加 `mavenCentral()`仓库。

```java
buildscript {
    repositories {
        ...
        mavenCentral()
    }
    ...
}

allprojects {
    repositories {
        ...
        mavenCentral()
    }
}
```

2. 在 `module` 的 `build.gradle` 中添加如下依赖：

```java
...
dependencies {
    ...
    // x.y.z 请填写具体版本号，如：3.9.4。
    // 可通过 SDK 发版说明获得最新版本号。
    implementation 'io.hyphenate:hyphenate-chat:x.x.x'
}
```

**注意**

如果使用 3.8.0 之前的版本，gradle 依赖需要按照下面格式添加：

```java
implementation 'io.hyphenate:hyphenate-sdk:3.7.5' // 完整版本，包含音视频功能

implementation 'io.hyphenate:hyphenate-sdk-lite:3.7.5' // 精简版，只包含IM功能 
```

#### 方法二：手动复制 SDK 文件

打开 SDK 下载页面，获取最新版的环信即时通讯 IM Android SDK，然后解压。

![img](https://docs-im.easemob.com/lib/exe/fetch.php?w=200&tok=211c9a&media=https%3A%2F%2Fdocs-im.easemob.com%2F_media%2Fim%2Fandroid%2Fsdk%2Ff1a7b52fe99d623bd798b05566c46f3.png)

将 SDK 包内 libs 路径下的如下文件，拷贝到你的项目路径下：

| 文件或文件夹         | 项目路径               |
| :------------------- | :--------------------- |
| easemob_xxx.jar 文件 | /app/libs/             |
| arm64-v8a 文件夹     | /app/src/main/jniLibs/ |
| armeabi-v7a 文件夹   | /app/src/main/jniLibs/ |
| x86 文件夹           | /app/src/main/jniLibs/ |
| x86_64 文件夹        | /app/src/main/jniLibs/ |

如果对生成的 `apk` 大小比较敏感，我们建议使用 `jar` 方式，并且手工拷贝 `so`，而不是使用 `Aar`，因为 `Aar` 方式会把各个平台的 `so` 文件都包含在其中。采用 `jar` 方式，可以仅保留一个 `ARCH` 目录，建议仅保留 `armeabi-v7a`，这样虽然在对应平台执行的速度会降低，但是能有效减小 `apk` 的大小。

### 3. 添加项目权限

根据场景需要，在 /app/src/main/AndroidManifest.xml 文件中添加如下行，获取相应的设备权限：

```java
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
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <!-- 写入扩展存储权限，用于附件等的存储 -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <!-- 访问 GPS 定位，用于定位消息，如果不用定位相关可以移除 -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <!-- api 21 后被标记为 deprecated，可以移除 -->
    <uses-permission android:name="android.permission.GET_TASKS" />
    <!-- 允许程序在手机屏幕关闭后后台进程仍然运行 -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <!-- 允许程序开机自动运行，SDK 保活时使用，如果使用厂商推送，可以移除 -->
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <!-- 申请闹钟定时权限 -->
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <!-- IM SDK required end -->
    <application>

        <!-- 声明 SDK 所需的 service 的核心功能-->
        <service
            android:name="com.hyphenate.chat.EMChatService"
            android:exported="true" />
        <service
            android:name="com.hyphenate.chat.EMJobService"
            android:exported="true"
            android:permission="android.permission.BIND_JOB_SERVICE" />
        <!-- 声明 SDK 所需的 receiver -->
        <receiver
            android:name="com.hyphenate.chat.EMMonitorReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.PACKAGE_REMOVED" />
                <data android:scheme="package" />
            </intent-filter>
            <!-- 可选 filter -->
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.USER_PRESENT" />
            </intent-filter>
        </receiver>
    </application>

</manifest>
```

关于 App Key 对应的 value 获取，在 [环信即时通讯 IM 管理后台](https://console.easemob.com/user/login) 创建应用后，申请 App Key 并进行相关配置。

### 4. 防止代码混淆

在 app/proguard-rules.pro 文件中添加如下行，防止混淆 SDK 的代码：

```java
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

## 实现单聊

本节介绍如何实现单聊。

### 1. SDK 初始化

在主进程中进行初始化：

```
EMOptions options = new EMOptions();
options.setAppKey("Your appkey");
......// 其他 EMOptions 配置。
EMClient.getInstance().init(context, options);
```

### 2. 创建账号

可以使用如下代码创建账户：

```java
// 注册失败会抛出 HyphenateException。
EMClient.getInstance().createAccount(mAccount, mPassword);//同步方法。
```

**注意**

该注册模式为在客户端注册，主要用于测试，简单方便，但不推荐在正式环境中使用；正式环境中应使用服务器端调用 Restful API 注册，具体见：[注册单个用户](https://docs-im.easemob.com/ccim/rest/accountsystem#注册单个用户)。

### 3. 登录账号

使用如下代码实现用户登录：

```java
EMClient.getInstance().login(mAccount, mPassword, new EMCallBack() {
    // 登录成功回调
    @Override 
    public void onSuccess() {

    }

    // 登录失败回调，包含错误信息
    @Override 
    public void onError(final int code, final String error) {
    
    }
    
    @Override 
    public void onProgress(int i, String s) {
        
    }

});
```

**注意：**

1. 除了注册监听器，其他的 SDK 操作均需在登录之后进行。
2. 登录成功后需要调用 `EMClient.getInstance().chatManager().loadAllConversations();` 和 `EMClient.getInstance().groupManager().loadAllGroups();`，确保进入主页面后本地会话和群组均加载完毕。
3. 如果之前登录过，App 长期在后台运行后切换到前台运行可能会导致加载到内存的群组和会话为空。为了避免这种情况，可在主页面的 `oncreate` 里也添加这两种方法，不过，最好将这两种方法放在程序的开屏页。

### 4. 发送一条单聊消息

```java
// `content` 为要发送的文本内容，`toChatUsername` 为对方的账号。
EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

## 参考信息

### Android SDK 介绍

环信 IM SDK 为用户开发 IM 相关的应用提供的一套完善的开发框架。包括以下几个部分：

![img](https://docs-im.easemob.com/_media/im/android/sdk/development-framework.png)

- SDK_Core 为核心的消息同步协议实现，完成与服务器之间的信息交换。
- SDK 是基于核心协议实现的完整的 IM 功能，实现了不同类型消息的收发、会话管理、群组、好友、聊天室、子区等功能。
- EaseIMKit 是一组 IM 相关的 UI 控件，旨在帮助开发者快速集成环信 SDK。

开发者可以基于 EaseIMKit 或者环信 SDK 开发自己的应用，前者因为把消息的发送接送等功能封装到了内部，集成时开发者不需要太关心消息是怎么发送、怎么接收等逻辑。请查阅 [EaseIMKit 使用指南](https://docs-im.easemob.com/ccim/android/easeimkit)。

SDK 采用模块化设计，每一模块的功能相对独立和完善，用户可以根据自己的需求选择使用下面的模块：

![模块化设计](https://docs-im.easemob.com/_media/im/android/sdk/image005.png)

- `EMClient`: SDK 的入口，主要完成登录、退出、连接管理等功能。也是获取其他模块的入口。
- `EMChatManager`: 管理消息的收发，完成会话管理等功能。
- `EMContactManager`: 负责好友的添加删除，黑名单的管理。
- `EMGroupManager`: 负责群组的管理，如创建、删除群组，管理群组成员等功能。
- `EMChatroomManager`: 负责聊天室的管理。

### SDK 目录讲解

从官网上下载下来的包，解压后内容如下：

![img](https://docs-im.easemob.com/_media/im/android/sdk/f1a7b52fe99d623bd798b05566c46f3.png?w=200&tok=ed406e)

在这里主要介绍后面四个文件夹内容：

- doc 文件夹：SDK 相关 API 文档
- examples 文件夹：EaseIm3.0
- libs 文件夹：包含 IM 功能所需要的 jar 和 so 文件

### 第三方库介绍

#### SDK 中用到的第三方库

- `android-support-v4.jar`：这个可以说是每个 APP 中都是不可缺少的 jar 包，这里不多赘述
- `org.apache.http.legacy.jar`：在 3.6.8 版本以后 SDK 移除了这个 jar 包；在 3.6.8 之前的版本用这个库兼容，建议不要删除，否则在 6.0 系统中，SDK 会有问题

#### EaseIMKit 中用到的第三方库

- glide-4.9.0：图片处理库，显示用户头像时用到
- BaiduLBS_Android.jar：百度地图的 jar 包，在 3.8.5 版本中移除地图的相关 so 文件，jar 包仅用于编译。依赖本地 EaseIMKit 库时，如果不用百度地图，可以不在 module 中添加百度地图的相关 jar 包及 so 文件，并移除地图的相关扩展功能（具体可参考 [增加更多扩展功能](https://docs-im.easemob.com/ccim/android/easeimkit#%E5%A2%9E%E5%8A%A0%E6%9B%B4%E5%A4%9A%E6%89%A9%E5%B1%95%E5%8A%9F%E8%83%BD)）。

### SDK 中相关异步/同步处理方法介绍

- 同步方法：SDK 里大部分方法都为同步方法，即该方法执行完毕，才会走后面的代码。
- 异步方法：带有 callback 以及 API 注释里明确写明异步方法的方法，即不需要等该方法执行完毕，后边的代码也可以执行，通过 callback 得到方法执行的结果。

### 取本地 log

以 Demo 为例，获取本地的 log

```java
adb pull /sdcard/Android/data/com.hyphenate.chatuidemo/easemob-demo#chatdemoui/core_log/easemob.log
```

其中 `com.hyphenate.chatuidemo` 是 packagename，`easemob-demo#chatdemoui` 是 App Key，需要替换成自己对应的路径。

### 自动登录

即首次登录成功后，不需要再次调用登录方法，在下次 APP 启动时，SDK 会自动进行用户登录。并且如果用户自动登录失败，也可以读取到之前的会话信息（以上情况是在未调用登出的情况下实现的）。

SDK 中自动登录属性默认是 `true` 打开的，如果不需要自动登录，在初始化 SDK 初始化的时候，调用 `options.setAutoLogin(false);` 设置为 `false` 关闭。

自动登录在以下几种情况下会被取消：

- 用户调用了 SDK 的登出动作；
- 用户在别的设备上更改了密码，导致此设备上自动登录失败；
- 用户的账号被从服务器端删除；
- 用户从另一个设备登录，把当前设备上登录的用户踢出。

### 退出登录

同步方法：

```java
EMClient.getInstance().logout(true);
```

异步方法：

```java
EMClient.getInstance().logout(true, new EMCallBack() {
            
    @Override
    public void onSuccess() {
        
    }
    
    @Override
    public void onProgress(int progress, String status) {

        
    }
    
    @Override
    public void onError(int code, String message) {
        
    }
});
```

如果集成了 FCM 等第三方推送，方法里第一个参数需要设为 `true`，这样退出的时候会解绑设备 token，否则可能会出现退出了，还能收到消息的现象。

部分时候可能碰到网络问题而解绑失败，app 处理时可以弹出提示框让用户选择，是否继续退出(弹出框提示继续退出能收到消息的风险)，如果用户选择继续退出，传 `false` 再调用 `logout` 方法退出成功。

当然也可以失败后还是返回退出成功，然后在后台起个线程不断调用 `logout` 方法直到成功，这样有个风险：用户杀死了 app，然后网络恢复，用户还是会继续收到消息。

另需要注意：如果调用异步退出方法，建议在收到 `onsucess` 的回调后再调用 IM 相关的方法，比如 `login`。

### 用户被封禁后的提示

在 [环信即时通讯 IM 管理后台](http://console.easemob.com/) 可以对用户进行管理，例如可以在后台封禁用户。用户被封禁后会提示 SDK 登录会返回 `SERVER_SERVING_DISABLED(305)`，可以根据用户该方法的返回值来进行相应提示或者处理。

需要注意的是 app 整个被禁用时也会返回上述错误码，由于 app 一般不会被禁用，所以可以用来提示用户被封禁。

### 注册连接状态监听

当掉线时，Android SDK 会自动重连，无需进行任何操作，你可以通过注册连接监听来确认连接状态。

- 可以根据 `disconnect` 返回的 error 判断原因。若服务器返回的参数值为`EMError.USER_LOGIN_ANOTHER_DEVICE`，则认为是有同一个账号异地登录；若服务器返回的参数值为 `EMError.USER_REMOVED`，则是账号在后台被删除。
- 被踢下线、被封禁等错误发生后，SDK 不会尝试重新连接，需要调用 `logout` 退出登录之后才能进行重新登录。

```java
// 注册连接状态监听
EMClient.getInstance().addConnectionListener(new MyConnectionListener());

// 实现 ConnectionListener 接口
private class MyConnectionListener implements EMConnectionListener {
    @Override
    public void onConnected() {
    }
    @Override
    public void onDisconnected(int error) {
        EMLog.d("global listener", "onDisconnect" + error);
        if (error == EMError.USER_REMOVED) {
            onUserException(Constant.ACCOUNT_REMOVED);
        } else if (error == EMError.USER_LOGIN_ANOTHER_DEVICE) {
            onUserException(Constant.ACCOUNT_CONFLICT);
        } else if (error == EMError.SERVER_SERVICE_RESTRICTED) {
            onUserException(Constant.ACCOUNT_FORBIDDEN);
        } else if (error == EMError.USER_KICKED_BY_CHANGE_PASSWORD) {
            onUserException(Constant.ACCOUNT_KICKED_BY_CHANGE_PASSWORD);
        } else if (error == EMError.USER_KICKED_BY_OTHER_DEVICE) {
            onUserException(Constant.ACCOUNT_KICKED_BY_OTHER_DEVICE);
        }
    }

    @Override
    public void onLogout(int errorCode) {
        // 处理需要用户退出到登录页面的场景

    }
}


    // 遇到用户异常情况时的处理示例，例如存日志，加标签，退出登录，跳转到登录页面等。
    protected void onUserException(String exception){
        EMLog.e(TAG, "onUserException: " + exception);
        Intent intent = new Intent(appContext, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        intent.putExtra(exception, true);
        appContext.startActivity(intent);

        showToast(exception);
    }
```