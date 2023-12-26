# 跑通示例项目

环信提供一个开源的 ChatroomUIKit 示例项目，演示了如何使用该 UIKit 快速搭建聊天室页面，实现完整业务。

本文展示如何编译并运行 Android 平台的聊天室 UIKit 示例项目。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- Android Studio Arctic Fox (2020.3.1) 或以上版本；
- Android API 级别 21 或以上；
- 使用 Kotlin 语言开发，1.5.21 或以上版本；
- JDK 1.8 或以上版本；
- Gradle 7.0.0 或以上版本。

## 操作步骤

### 第一步 下载 ChatroomUIKit 示例代码

点击 [github源码](https://github.com/easemob/UIKit_Chatroom_android)，将示例代码下载到本地设备。

### 第二步 添加 ChatroomUIKit 模块依赖

1. 在 Android Studio 中打开你的项目。

2. 选择 **File** > **import Module**。

3. 添加模块依赖。

- 本地依赖：

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

- 远程依赖：

在集成 ChatroomUIKit 的 app 目录下的 `build.gradle` 中添加下行代码：

```
implementation 'ChatroomUIKit'
```

### 第三步 编译

编译时，需要传入 App Key、用户 ID 和用户 token。因此，编译前，你需要在[环信控制台](https://console.easemob.com/user/login)上创建有效的环信即时通讯 IM 开发者账号，并获取 App Key，[创建环信 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)。此外，还需[创建聊天室](/product/enable_and_configure_IM.html#创建聊天室)。

1. 初始化 SDK。  // TODO：初始化 SDK 还是 ChatroomUIKit？

```kotlin
// 初始化 ChatroomUIKit   
class ChatroomApplication : Application() {

  override fun onCreate() {
    super.onCreate()

    ChatroomUIKitClient.getInstance().setUp(this, "Your AppKey")

  }
}
```

2. 登录 ChatroomUIKit。

```kotlin  
 ChatroomUIKitClient.getInstance().login("userId", "token")
```

3. 加载 ComposeChatroom 视图，传入 `roomId` 和聊天室所有者的 `UserEntity` 对象。

```kotlin  
class ChatroomActivity : ComponentActivity(){
	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		setContent {
			ComposeChatroom(roomId = roomId,roomOwner = ownerInfo)
		}
	}
}
```


### 第四步 体验项目

运行并体验该项目。

## 注意事项  

示例工程仅用于快速跑通流程，暂时未提供多成员交互测试。// 这里是想说，多个成员不能进行聊天？

