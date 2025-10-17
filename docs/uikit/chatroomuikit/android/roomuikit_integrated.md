# 集成 ChatroomUIKit

<Toc />

使用 ChatroomUIKit 之前，你需要将 ChatroomUIKit 集成到你的应用中。

## 推荐环境

- Android Studio Arctic Fox (2020.3.1) 或以上版本；
- Android API 级别 21 或以上版本；
- 使用 Kotlin 语言开发，1.5.21 或以上版本；
- JDK 1.8 或以上版本；
- Gradle 8.0 或以上版本。

##  添加依赖

### 方式一：（推荐）Gradle 远程依赖

1. 在 Project 工程根目录下的 `settings.gradle.kts` 文件内，添加 `mavenCentral()` 仓库：

```kotlin
pluginManagement {
   repositories {
      ...
      mavenCentral()
   }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        ...
        mavenCentral()
    }
}
```

2. 在 app(module) 目录的 `build.gradle.kts` 文件中添加以下依赖。关于 ChatroomUIKit 的最新版本，详见 [Maven 仓库](https://central.sonatype.com/artifact/io.hyphenate/ease-chatroomui-kit/versions)。

```kotlin
dependencies {
    ...
    implementation ("io.hyphenate:ease-chatroomui-kit:1.1.0")
}
```

### 方式二：本地源码集成

从 GitHub 获取音视频 [ChatroomUIKit](https://github.com/easemob/UIKit_Chatroom_android/tree/dev)，克隆到本地。按照以下步骤集成：

1. 在 Project 工程根目录下的 `settings.gradle.kts` 文件中添加如下代码：

```kotlin
include(":ChatroomUIKit")
// "../UIKit_Chatroom_android" 要替换成你克隆的实际工程路径，后边要拼接 "/ChatroomUIKit"
project(":ChatroomUIKit").projectDir = File("../UIKit_Chatroom_android/ChatroomUIKit")
```

2. 在 app(module) 目录的 `build.gradle.kts` 文件中添加如下代码：

```kotlin
dependencies {
    ...
    implementation(project(mapOf("path" to ":ChatroomUIKit")))
}
```

## 跑通项目
详见[快速开始](./roomuikit_quickstart.md#跑通项目)。

