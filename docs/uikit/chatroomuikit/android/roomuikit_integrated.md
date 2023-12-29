# 集成 ChatroomUIKit

<Toc />

使用 ChatroomUIKit 之前，你需要将 ChatroomUIKit 集成到你的应用中。

## 前提条件

要集成 ChatroomUIKit，你的开发环境需要满足以下需求：

- Android Studio Arctic Fox (2020.3.1) 或以上版本；
- Android API 级别 21 或以上版本；
- 使用 Kotlin 语言开发，1.5.21 或以上版本；
- JDK 1.8 或以上版本；
- Gradle 7.0.0 或以上版本。

## 添加 ChatroomUIKit 模块依赖
 
### 本地依赖

找到下载的 **ChatroomUIKit** 模块添加为本地依赖。将 [ChatroomUIKit](https://github.com/easemob/UIKit_Chatroom_android/tree/dev/ChatroomUIKit) 和 [ChatroomService](https://github.com/easemob/UIKit_Chatroom_android/tree/dev/ChatroomService) 模块导入到项目中。

```kotlin
// settings.gradle
include ':ChatroomUIKit'
include ':ChatroomService'
project(':ChatroomUIKit').projectDir = new File('../ChatroomUIKit/ChatroomUIKit')
project(':ChatroomService').projectDir = new File('../ChatroomUIKit/ChatroomService')

// app/build.gradle
dependencies {
  implementation(project(mapOf("path" to ":ChatroomUIKit")))
}
```

### 远程依赖 

在集成 ChatroomUIKit 的 app 目录下的 `build.gradle` 中添加下行代码：

```
implementation 'ChatroomUIKit'
```

