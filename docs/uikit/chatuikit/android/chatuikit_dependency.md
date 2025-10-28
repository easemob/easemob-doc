# 安装依赖

<Toc />

使用单群聊 UIKit 之前，你需要将其集成到你的应用中。

## 前提条件

- Android Studio 4.0 及以上
- Gradle 4.10.x 及以上
- targetVersion 26 及以上
- Android SDK API 21 及以上
- JDK 11 及以上

## Module 远程依赖

在 app 项目 `build.gradle.kts` 中添加以下依赖：

```kotlin
implementation("io.hyphenate:ease-chat-kit:4.11.1")
```
若要查看最新版本号，请点击[这里](https://central.sonatype.com/artifact/io.hyphenate/ease-chat-kit/versions)。

## 本地依赖

从 GitHub 获取[单群聊 UIKit](https://github.com/easemob/chatuikit-android) 源码，按照下面的方式集成：

1. 在 Project 根目录 `settings.gradle.kts` 文件中添加如下代码：

```kotlin
include(":ease-im-kit")
project(":ease-im-kit").projectDir = File("../chatuikit-android/ease-im-kit")
```

2. 在 app 的 `build.gradle.kts` 文件中添加如下代码：

```kotlin
implementation(project(mapOf("path" to ":ease-im-kit")))
```

## 防止代码混淆

在 `app/proguard-rules.pro` 文件中添加如下行，防止代码混淆：

```kotlin
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

