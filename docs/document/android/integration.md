# 导入 SDK

本文介绍如何将环信即时通讯 IM SDK 集成到你的 Android 项目。

## 开发环境要求

- 推荐 Android Studio Meerkat | 2024.3.1 Patch 2及以上
- 推荐 Gradle 8.0 及以上
- `targetSdkVersion` 33 及以上
- Android SDK API 21 及以上
- JDK 17 及以上

## 导入 SDK

选择如下任意一种方式将环信即时通讯 IM SDK 导入到你的项目中。

:::tip

1. 以下集成方式只需选择一种，同时使用多种集成方式可能会报错。
2. 请点击查看[发版说明](releasenote.html)获得最新版本号。

:::

### 方法一：使用 mavenCentral 自动集成

1. 在项目的 `build.gradle` 中添加 `mavenCentral()` 仓库。

```gradle
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

```gradle
...
dependencies {
    ...
    // x.x.x 请填写具体版本号
    // 可通过 SDK 发版说明获得最新版本号。
    implementation 'io.hyphenate:hyphenate-chat:x.x.x'
}
```

### 方法二：手动复制 SDK 文件

打开 [SDK 下载页面](https://www.easemob.com/download/im#Android)，获取最新版的环信即时通讯 IM Android SDK，然后解压。

![img](@static/images/android/sdk-files.png)

将 SDK 包内 libs 路径下的如下文件，拷贝到你的项目路径下：

| 文件或文件夹         | 项目路径               |
| :------------------- | :--------------------- |
| `hyphenatechat_xxx.jar` 文件 | `/app/libs/ `            |
| `arm64-v8a` 文件夹     | `/app/src/main/jniLibs/` |
| `armeabi-v7a` 文件夹   | `/app/src/main/jniLibs/` |
| `x86` 文件夹           | `/app/src/main/jniLibs/` |
| `x86_64` 文件夹        | `/app/src/main/jniLibs/` |

最后在你的项目中 `module` 的 `build.gradle` 中添加如下依赖：

```gradle
...
dependencies {
    ...
    // x.y.z 请填写具体版本号
    // 可通过 SDK 发版说明获得最新版本号。
    implementation(files("libs/hyphenatechat_x.y.z.jar"))
}
```

如果对生成的 `apk` 大小比较敏感，可以使用 `jar` 方式，并仅手动拷贝应用需要支持的 CPU 架构对应的 `.so` 文件；也可以在 Gradle 中通过 `abiFilters` 限制打包的 CPU 架构。发布应用时，应根据目标设备和应用商店要求选择支持的架构。面向当前主流的 64 位 Android 设备发布时，通常至少需要包含 `arm64-v8a`，不建议只保留用于 32 位 ARM 设备的 `armeabi-v7a`。

### 方法三：动态加载 .so 库文件

为了减少应用安装包的大小，SDK 提供了 `EMOptions#setNativeLibBasePath` 方法支持从指定目录加载 SDK 所需的 `.so` 文件。SDK 使用的动态库包括 `libcipherdb.so`、`libhyphenate.so` 和 `libaosl.so`。

该功能的实现步骤如下：

1. [下载最新版本的 SDK](https://www.easemob.com/download/im#Android) 并解压缩。
2. 将下载包中的 `hyphenatechat_x.y.z.jar` 集成到项目中。
3. 将所有架构的 `.so` 文件上传到你的服务器，并确保应用程序可以通过网络下载目标架构的 `.so` 文件。
4. 应用运行时，会检查 `.so` 文件是否存在。如果未找到，应用会下载该 `.so` 文件并将其保存到你自定义的应用程序的私有目录中。
5. 调用 `EMClient#init` 初始化时，将 `.so` 文件所在的 app 私有目录作为参数设置进 `EMOptions#setNativeLibBasePath` 方法中。
6. 调用 `EMClient#init` 初始化后，SDK 会自动从指定路径加载 `.so` 文件。

:::tip
1. 该方法仅适合手动集成 Android SDK，不适用于通过 Maven Central 集成。
2. so 库的路径取决于 `EMOptions#setNativeLibBasePath` 方法的 `path` 参数：
- 若设置了 `path` 参数，SDK 内部会使用 `System.load` 从设置的路径下搜索和加载 so 库。该路径必须为有效的 app 的私有目录路径。
- `path` 参数为空或者不调用该方法时，SDK 内部会使用 `System.loadLibrary` 从系统默认路径中搜索并加载 so 库。
:::

```java
// 假设已将当前设备 CPU 架构对应的 libcipherdb.so、libhyphenate.so 和
// libaosl.so 下载到应用的 files 私有目录。
String filesPath = mContext.getFilesDir().getAbsolutePath();

EMOptions options = new EMOptions();
// 设置三个动态库所在的目录；必须在初始化 SDK 前调用。
options.setNativeLibBasePath(filesPath);

// SDK 初始化时从上述目录加载动态库。
EMClient.getInstance().init(mContext, options);

```

### 添加项目权限

根据场景需要，在 `/app/src/main/AndroidManifest.xml` 文件中添加如下行，获取相应的设备权限：

```xml
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
    <!-- Android 12 及以下按业务需要申请读取外部存储权限，用于访问外部存储中的附件 -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <!-- 访问 GPS 定位，用于定位消息，如果不用定位相关可以移除 -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <!-- 允许程序在手机屏幕关闭后后台进程仍然运行 -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <!-- IM SDK required end -->

</manifest>
```

### 防止代码混淆

在 `app/proguard-rules.pro` 文件中添加如下行，防止混淆 SDK 的代码：

```java
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setNativeLibBasePath`](#方法三-动态加载-so-库文件) | `EMOptions` | 设置 SDK 原生动态库所在的应用私有目录。 |
| [`init`](#方法三-动态加载-so-库文件) | `EMClient` | 使用指定配置初始化 Android SDK，并加载所需动态库。 |
