# 跑通示例项目

本文档基于 MainActivity 示例，帮助你快速集成和运行环信 CallKit，实现一对一音视频通话和群组音视频通话功能。

## 推荐环境

- Android SDK: API Level 24 及以上
- Android Studio: 推荐最新版本
- Kotlin: 2.0.21
- JDK: 17
- Gradle：gradle-8.9-bin.zip

## 前提条件

在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
1. [注册环信账号](/product/console/account_register.html#注册账号)。
2. [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
3. [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID。
4. [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID。将用户加入群组。
5. [开通音视频服务](product_activation.html)。

//todo 将以上链接替换成绝对路径，因为本文件要拷贝到callkit源码工程里作为readme使用

## 操作步骤

### 步骤 1 配置项目 

1. 克隆或下载项目。

```bash
git clone https://github.com/easemob/easemob-callkit-android 
```

2. 在 Android Studio 中打开项目。

选择 **File** > **New** > **Import Project**，导入下载或克隆的项目 `chatcallkit-android`。

3. 等待 Gradle 同步完成。

4. 在 `MainActivity.kt` 中进行如下修改：

```kotlin
private val selfUserID = "your_user_id"        // 你的用户 ID
private val remoteUserID = "target_user_id"    // 对方用户 ID，用于一对一音视频通话
private val groupID = "your_group_id"          // 群组 ID
private val imAppkey = "your_org#your_app"     // 你的 App Key
```

### 步骤 2 运行应用

1. 连接 Android 设备或启动模拟器。
2. 点击 **Run ‘app’** 运行应用。

### 步骤 3 开始通话

1. 点击 **登录**。
2. 等待连接：观察连接状态指示器变绿。
3. 发起通话：
   - 一对一视频通话：点击 **发起一对一视频通话**。
   - 一对一音频通话：点击 **发起一对一音频通话**。
   - 群组通话：点击 **发起群组音视频通话**。
4. 在弹出的页面中授权必要权限（摄像头、麦克风、悬浮窗等）。
5. 点击 **登出** 退出登录。

![img](/images/callkit/android/project_runthrough.png)