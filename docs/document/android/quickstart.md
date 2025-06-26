# 快速开始

<Toc />

本文介绍如何快速集成环信即时通讯 IM Android SDK 实现单聊。

## 实现原理

下图展示在客户端发送和接收一对一文本消息的工作流程。

![img](/images/android/sendandreceivemsg.png)

## 前提条件

- 推荐 Android Studio Meerkat | 2024.3.1 Patch 2及以上
- 推荐 Gradle 8.0 及以上
- targetVersion 33 及以上
- Android SDK API 21 及以上
- JDK 17 及以上
- 有效的环信即时通讯 IM 开发者账号和 App key，见 [环信即时通讯云控制台](https://console.easemob.com/user/login)。

## 准备开发环境

本节介绍如何创建项目，将环信即时通讯 IM Android SDK 集成到你的项目中，并添加相应的设备权限。

### 1. 创建 Android 项目

参考以下步骤创建一个 Android 项目。

1. 打开 Android Studio，点击左上角菜单 **File > New > New Project**。
2. 在 **New Project** 界面，**Phone and Tablet** 标签下，选择 **Empty Views Activity**，然后点击 **Next**。
3. 在 **Empty Views Activity** 界面，依次填入以下内容：
   - **Name**：你的 Android 项目名称，如 HelloWorld。
   - **Package name**：你的项目包的名称，如 com.easemob.helloworld。
   - **Save location**：项目的存储路径。
   - **Language**：项目的编程语言，如 Java。
   - **Minimum SDK**：项目的最低 API 等级，如 API 21。
   - **Build configuration language**：工程构建语言，如Groovy DSL(build.gradle)。

然后点击 **Finish**。根据屏幕提示，安装所需插件。

上述步骤使用 **Android Studio Ladybug | 2024.2.1 Patch 3** 示例。你也可以直接参考 Android Studio 官网文档 [创建应用](https://developer.android.com/studio/projects/create-project)。

### 2. 集成 SDK

你可以使用 mavenCentral 自动集成。

1. 在 Project 工程项目根目录的 `settings.gradle` 文件中添加 `mavenCentral()` 仓库。

```gradle
pluginManagement {
    repositories {
        ……
        mavenCentral()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        ……
        mavenCentral()
    }
}
```

2. 在 app(module) 目录的 `build.gradle` 文件中添加如下依赖：

```gradle
dependencies {
    ...
    // x.y.z 请填写具体版本号，如：4.13.0。
    implementation("io.hyphenate:hyphenate-chat:x.y.z")
}
```
若要了解最新版本号，请查看 [更新日志](releasenote.html)。

除此之外，你还可以通过手动复制 SDK 文件和动态加载 `.so` 库文件的方法集成 IM SDK，详见 [集成文档](integration.html)。

### 3. 添加项目权限

根据场景需要，在 `/app/src/main/AndroidManifest.xml` 文件中添加如下行，获取相应的设备权限：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="https://schemas.android.com/apk/res/android"
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
    <!-- 获取读存储权限，用于附件等的获取 -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <!-- 访问 GPS 定位，用于定位消息，如果不用定位相关可以移除 -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <!-- 允许程序在手机屏幕关闭后后台进程仍然运行 -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <!-- 申请闹钟定时权限，SDK 心跳中使用，3.9.8及以后版本可以不添加 -->
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <!-- IM SDK required end -->

</manifest>
```

关于 App Key 对应的 value 获取，在 [环信控制台](https://console.easemob.com/user/login) 创建应用后，申请 App Key 并进行相关配置。

### 4. 防止代码混淆

在 `app/proguard-rules.pro` 文件中添加如下行，防止混淆 SDK 的代码：

```java
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

### 5. 其他集成问题

当同时集成环信 SDK 4.11.0 和声网 RTM SDK 2.2.0 或 RTC SDK 4.3.0 及以上版本时，由于同时包含 `libaosl.so` 库，编译时可能会出现以下错误：

```java
com.android.builder.merge.DuplicateRelativeFileException: More than one file was found with OS independent path 'lib/x86/libaosl.so'
```

可在 app 的 `build.gradle` 文件的 Android 节点中添加 `packagingOptions` 节点，指定在构建过程中优先选择第一个匹配的文件：

```gradle
android {
  ...
  packagingOptions {
    pickFirst 'lib/x86/libaosl.so'
    pickFirst 'lib/x86_64/libaosl.so'
    pickFirst 'lib/armeabi-v7a/libaosl.so'
    pickFirst 'lib/arm64-v8a/libaosl.so'
  }
}
```

然后 Gradle 文件同步，重新构建项目。

如欲了解详情，请参见 [声网官方文档](https://doc.shengwang.cn/faq/integration-issues/rtm2-rtc-integration-issue)。

## 实现单聊

本节介绍如何实现单聊。

### 1. SDK 初始化

在**主进程**中进行初始化：

```java
// 导包
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMOptions;

EMOptions options = new EMOptions();
options.setAppKey("Your appkey");
......// 其他 EMOptions 配置。
// context 为上下文，在 Application 或者 Activity 中可以用 this 代替
EMClient.getInstance().init(context, options);
```
### 2. 创建用户

在 [环信控制台](https://console.easemob.com/user/login) 创建用户，获取用户 ID 和用户 Token。详见 [创建用户文档](/product/enable_and_configure_IM.html#创建-im-用户)。

在生产环境中，为了安全考虑，你需要在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，使你的用户从你的应用服务器获取 Token。

### 3. 登录账号

获取账号的用户 ID 和 Token 后，使用如下代码实现用户登录：

```java
// 导包
import com.hyphenate.EMCallBack;
import com.hyphenate.chat.EMClient;

EMClient.getInstance().loginWithToken(mAccount, mPassword, new EMCallBack() {
    // 登录成功回调
    @Override
    public void onSuccess() {
      // 回调位于异步线程，处理 UI 相关需切换到主线程
    }

    // 登录失败回调，包含错误信息
    @Override
    public void onError(final int code, final String error) {
      // 回调位于异步线程，处理 UI 相关需切换到主线程
    }

});
```

:::tip
1. 除了注册监听器，其他的 SDK 操作均需在登录之后进行。
2. 登录成功后需要调用 `EMClient.getInstance().chatManager().loadAllConversations();` 和 `EMClient.getInstance().groupManager().loadAllGroups();`，确保进入主页面后本地会话和群组均加载完毕。
3. 如果之前登录过，App 长期在后台运行后切换到前台运行可能会导致加载到内存的群组和会话为空。为了避免这种情况，可在主页面的 `onCreate` 里也添加这两种方法，不过，最好将这两种方法放在程序的开屏页。
:::

### 4. 发送一条单聊消息

```java
// 导包
import com.hyphenate.EMCallBack;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMMessage;

// `content` 为要发送的文本内容，`toChatUsername` 为对方的账号。
EMMessage message = EMMessage.createTextSendMessage(content, toChatUsername);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```
