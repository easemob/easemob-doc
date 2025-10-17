# 跑通示例项目

<Toc />

环信提供一个开源的 ChatroomUIKit 示例项目，演示了如何使用该 UIKit 快速搭建聊天室页面，实现完整业务。

本文展示如何编译并运行 Android 平台的聊天室 UIKit 示例项目。

## 推荐环境

开始前，确保你的开发环境满足如下条件：

- Android Studio Arctic Fox (2020.3.1) 或以上版本；
- Android API 级别 21 或以上；
- 使用 Kotlin 语言开发，1.5.21 或以上版本；
- JDK 1.8 或以上版本；
- Gradle 8.0 或以上版本。

## 操作步骤

1. 下载 ChatroomUIKit 示例代码
点击 [github源码](https://github.com/easemob/UIKit_Chatroom_android)，将示例代码下载到本地设备。

```bash
git clone https://github.com/easemob/UIKit_Chatroom_android.git
```

2. 在 Android Studio 中打开项目。

选择 **File** > **New** > **Import Project**，导入下载或克隆的项目 `UIKit_Chatroom_android`。

3. 点击 `Sync Project with Gradle Files` 同步工程。

:::tip
注意：
1. 项目中编译使用的 Gradle 版本默认为 8.0，推荐Gradle JDK 版本为 19 及以下。以Mac 版 Android Studio 为例，可以在左上角 **Android Studio** > **Settings** > **Build, Execution, Deployment** > **Build Tools** > **Gradle** > **Gradle JDK**,选择版本为 19 及以下的 JDK，然后点击OK。如果没有合适的 JDK 版本，可以点击 **Download JDK** 下载。
2. 开发者也可调整 Gradle 及对应的 Gradle JDK 版本。配置地址为  **项目工程根目录** > **gradle** > **gradle-wrapper.properties** > **调整`distributionUrl`值**。

:::

4. 运行项目

运行时，需要传入 App Key、用户 ID 和用户 token。因此，你需要在[环信控制台](https://console.easemob.com/user/login)上创建有效的环信即时通讯 IM 开发者账号，并获取 App Key，[创建环信 IM 用户](/product/console/operation_user.html#创建用户)。此外，还需 [创建聊天室](/product/console/operation_chatroom.html#创建聊天室)。

4.1 初始化 ChatroomUIKit。

```kotlin
class ChatroomApplication : Application() {

  override fun onCreate() {
    super.onCreate()

    ChatroomUIKitClient.getInstance().setUp(this, "Your AppKey")

  }
}
```

4.2 登录 ChatroomUIKit。

```kotlin  
 ChatroomUIKitClient.getInstance().login("userId", "token")
```

4.3 加载 ComposeChatroom 视图，传入 `roomId` 和聊天室所有者的 `UserEntity` 对象。

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

5. 体验项目

在 Android Studio 中，点击 `Run ‘app’` 按钮，将应用运行到你的设备或者模拟器上。

## 注意事项  

示例工程仅用于快速跑通流程，暂时未提供多成员交互测试。
