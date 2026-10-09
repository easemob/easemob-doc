# 安装依赖

<Toc />

使用单群聊 UIKit 之前，你需要将其集成到你的应用中。

## 前提条件

- Android Studio Ladybug 2024.2.2 及以上
- Gradle 8.7 及以上
- compileSdk 34 及以上
- Android SDK API 21 及以上
- JDK 17 及以上

## Module 远程依赖

在 app 项目 `build.gradle.kts` 中添加以下依赖：

```kotlin
implementation("io.hyphenate:ease-chat-kit:5.1.0")
```
若要查看最新版本号，请查看 [Maven 中央仓库](https://central.sonatype.com/artifact/io.hyphenate/ease-chat-kit/versions)。

## 本地依赖

从 [GitHub](https://github.com/easemob/easemob-uikit-android) 或 [Gitee](https://gitee.com/easemob-code/easemob-uikit-android) 获取单群聊 UIKit 源码，按照下面的方式集成：

1. 在 Project 根目录 `settings.gradle.kts` 文件中添加如下代码：

```kotlin
include(":ease-chat-kit")
project(":ease-chat-kit").projectDir = File("../easemob-uikit-android/ease-im-kit")
```

其中 `:ease-chat-kit` 为 UIKit 源码模块 `ease-im-kit` 在工程中的别名，`../easemob-uikit-android/ease-im-kit` 为 UIKit 源码在本地的相对路径，请根据实际存放位置调整。

2. 在 app 的 `build.gradle.kts` 文件中添加如下代码：

```kotlin
implementation(project(mapOf("path" to ":ease-chat-kit")))
```

## 防止代码混淆

在 `app/proguard-rules.pro` 文件中添加如下行，防止代码混淆：

```kotlin
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

