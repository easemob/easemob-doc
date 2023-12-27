# 快速开始

利用 ChatroomUIKit，你可以轻松实现聊天室内的用户交互。本文介绍如何实现在聊天室中发送消息。

## 前提条件

- Android Studio Arctic Fox (2020.3.1) 或以上版本；
- Android API 级别 21 或以上；
- 使用 Kotlin 语言开发，1.5.21 或以上版本；
- JDK 1.8 或以上版本；
- Gradle 7.0.0 或以上版本；
- 已在[环信即时通讯云控制台](https://console.easemob.com/user/login)创建了有效的环信即时通讯 IM 开发者账号，并[获取了 App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。
- 如果你的网络环境部署了防火墙，请联系环信技术支持设置白名单。

## 创建项目引入 ChatroomUIKit 模块

1. 在 Android Studio 中创建一个 Android 平台下的 App 或者打开自己现有项目。

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

### 第一步 初始化 ChatroomUIKit

你可以在应用加载时或使用 ChatroomUIKit 之前对其进行初始化。

初始化时，需传入 App Key。你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**应用详情**页面查看 App Key。

```kotlin
// 初始化 ChatroomUIKit   
class ChatroomApplication : Application() {

  override fun onCreate() {
    super.onCreate()

    ChatroomUIKitClient.getInstance().setUp(this, "Your AppKey")

  }
}
```

### 第二步 登录 ChatroomUIKit

使用用户 ID 和用户 Token 登录 ChatroomUIKit。

:::tip
若你已集成了 IM SDK，SDK 的所有用户 ID 均可用于登录 ChatroomUIKit。
:::

为了方便快速体验，你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**应用概览** > **用户认证**页面创建用户并查看用户 token。**用户认证**页面中的用户仅用于快速体验或调试目的。

在开发环境中，你需要在环信控制台[创建 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)，从你的 App Server 获取用户 token，详见[使用环信用户 token 鉴权](/product/easemob_user_token.html) 。


```kotlin  
 ChatroomUIKitClient.getInstance().login("userId", "token")
```

### 第三步 创建聊天室视图

创建聊天室视图的步骤如下：

1. 获取聊天室列表，加入指定的聊天室。除此之外，你还可以在环信即时通讯云控制台上[创建聊天室](/product/enable_and_configure_IM.html#创建聊天室)，获取聊天室 ID。

2. 加载聊天室视图 `ComposeChatroom`，传入的参数包括聊天室 ID 和聊天室所有者的用户 ID。

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

3. [添加聊天室成员](https://docs-im-beta.easemob.com/product/enable_and_configure_IM.html#创建聊天室)。

// TODO：添加创建好的聊天室 UI 截图（含笑）


### 第四步 发送消息

点击屏幕下方的 `说点什么` 按钮唤起键盘，输入消息内容，点击 **发送** 按钮，发送消息。

// TODO：添加截图
