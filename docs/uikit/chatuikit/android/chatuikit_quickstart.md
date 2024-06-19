# 快速开始

<Toc />

利用环信单群聊 UIKit，你可以轻松实现单群和群聊。本文介绍如何快速实现在单聊会话中发送消息。

## 前提条件

开始前，请确保你的开发环境满足以下条件：

- Android Studio 4.0 及以上
- Gradle 4.10.x 及以上
- targetVersion 26 及以上
- Android SDK API 21 及以上
- JDK 11 及以上

## 项目准备

本节介绍将单群聊 UIKit 引入项目中的必要环境配置。

1. 使用 **Android Studio** 创建一个[新项目](https://developer.android.com/studio/projects/create-project)。
  - 在 **Phone and Tablet** 标签选择 **Empty Views Activity**。
  - **Minimum SDK** 选择 **API 21: Android 5.0 (Lollipop)**。
  - **Language** 选择 **Kotlin**。
  
  创建项目成功后，请确保项目同步完成。

2. 检查工程是否引入 **mavenCentral** 仓库。

  - Gradle 7.0 之前 

    在 `/Gradle Scripts/build.gradle.kts(Project: <projectname>)` 文件内，检查是否有 **mavenCentral** 仓库。

    ```kotlin
    buildscript {
       repositories {
           mavenCentral()
       }
    }
    ```
  - Gradle 7.0 即之后

    在 `/Gradle Scripts/settings.gradle.kts(Project Settings)` 文件内，检查是否有 **mavenCentral** 仓库。

    ```kotlin
    dependencyResolutionManagement {
        repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
        repositories {
            mavenCentral()
        }
    }
    ```
3. 在项目中引入单群聊 UIKit。

**Module 远程依赖**

在 app 项目 build.gradle.kts 中添加以下依赖：

```kotlin
implementation("io.hyphenate:ease-chat-kit:4.5.0")
```

**本地依赖**

从 GitHub 获取[单群聊 UIKit](https://github.com/easemob/chatuikit-android) 源码，按照下面的方式集成：

- 在根目录 `settings.gradle.kts` 文件（/Gradle Scripts/settings.gradle.kts）中添加如下代码：

```kotlin
include(":ease-im-kit")
project(":ease-im-kit").projectDir = File("../chatuikit-android/ease-im-kit")
```

- 在 app 的 `build.gradle.kts` 文件（/Gradle Scripts/build.gradle）中添加如下代码：

```kotlin
//chatuikit-android
implementation(project(mapOf("path" to ":ease-im-kit")))
```

4. 防止代码混淆

在 `/Gradle Scripts/proguard-rules.pro` 文件中添加如下代码：

  ```
  -keep class com.hyphenate.** {*;}
    -dontwarn  com.hyphenate.**
  ```
  
## 实现发送第一条单聊消息

本节介绍如何通过单群聊 UIKit 实现发送第一条单聊消息。

### 第一步 创建快速开始页面 

1. 打开 `app/res/values/strings.xml` 文件，并替换为如下内容：

```xml
<resources>
    <string name="app_name">quickstart</string>

    <string name="app_key">[你申请的 app key]</string>
</resources>

```
:::tip
你需要将 **app_key** 替换为你申请的 App Key。
:::

2. 打开 `app/res/layout/activity_main.xml` 文件，并替换为如下内容：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".MainActivity">

    <EditText
        android:id="@+id/et_userId"
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:layout_margin="20dp"
        android:hint="UserId"/>

    <EditText
        android:id="@+id/et_password"
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:layout_margin="20dp"
        android:hint="Password"/>

    <Button
        android:id="@+id/btn_login"
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:layout_margin="20dp"
        android:onClick="login"
        android:text="Login"/>

    <Button
        android:id="@+id/btn_logout"
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:layout_margin="20dp"
        android:onClick="logout"
        android:text="Logout"/>

    <EditText
        android:id="@+id/et_peerId"
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:layout_margin="20dp"
        android:hint="PeerId"/>

    <Button
        android:id="@+id/btn_chat"
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:layout_margin="20dp"
        android:onClick="startChat"
        android:text="Start Chat"/>

</LinearLayout>
```

### 第二步 实现代码逻辑

1. 实现登录和退出页面。

:::tip
若你已集成了即时通讯 IM SDK，SDK 的所有用户 ID 均可用于登录单群聊 UIKit。
:::

你需要在环信控制台[创建 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)，登录时传入用户 ID 和密码。

打开 `MainActivity` 文件，并替换为如下代码：

```kotlin
package com.easemob.quickstart

import android.content.Context
import androidx.appcompat.app.AppCompactActivity
import android.os.Bundle
import android.view.View
import android.widget.Toast
import com.easemob.quickstart.databinding.ActivityMainBinding
import com.hyphenate.easeui.EaseIM
import com.hyphenate.easeui.common.ChatConnectionListener
import com.hyphenate.easeui.common.ChatLog
import com.hyphenate.easeui.common.ChatOptions
import com.hyphenate.easeui.feature.messages.EaseChatType
import com.hyphenate.easeui.feature.messages.activities.EaseChatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompactActivity(), ChatConnectionListener {
    private val binding: ActivityMainBinding by lazy { ActivityMainBinding.inflate(layoutInflater) }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)
        initSDK()
        initListener()
    }

    private fun initSDK() {
        val appkey = getString(R.string.app_key)
        if (appkey.isNullOrEmpty()) {
            showToast("You should set your AppKey first!")
            ChatLog.e(TAG, "You should set your AppKey first!")
            return
        }
        ChatOptions().apply {
            // 设置你自己的 app key
            this.appKey = appkey
            // 设置为手动登录
            this.autoLogin = false
            // 设置是否需要接收方发送已达回执。默认为 `false`，即不需要。
            this.requireDeliveryAck = true
        }.let {
            EaseIM.init(applicationContext, it)
        }
    }

    private fun initListener() {
        EaseIM.subscribeConnectionDelegates(this)
    }

    fun login(view: View) {
        val username = binding.etUserId.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()
        if (username.isEmpty() || password.isEmpty()) {
            showToast("Username or password cannot be empty!")
            ChatLog.e(TAG, "Username or password cannot be empty!")
            return
        }
        if (!EaseIM.isInited()) {
            showToast("Please init first!")
            ChatLog.e(TAG, "Please init first!")
            return
        }
        EaseIM.login(username, password
            , onSuccess = {
                showToast("Login successfully!")
                ChatLog.e(TAG, "Login successfully!")
            }, onError = { code, message ->
                showToast("Login failed: $message")
                ChatLog.e(TAG, "Login failed: $message")
            }
        )
    }

    fun logout(view: View) {
        if (!EaseIM.isInited()) {  
            showToast("Please init first!")
            ChatLog.e(TAG, "Please init first!")
            return
        }
        EaseIM.logout(false
            , onSuccess = {
                showToast("Logout successfully!")
                ChatLog.e(TAG, "Logout successfully!")
            }
        )
    }
// 跳转到聊天页面
    fun startChat(view: View) {
        val username = binding.etPeerId.text.toString().trim()
        if (username.isEmpty()) {
            showToast("Peer id cannot be empty!")
            ChatLog.e(TAG, "Peer id cannot be empty!")
            return
        }
        if (!EaseIM.isLoggedIn()) {
            showToast("Please login first!")
            ChatLog.e(TAG, "Please login first!")
            return
        }
        EaseChatActivity.actionStart(this, username, EaseChatType.SINGLE_CHAT)
    }

    override fun onConnected() {}

    override fun onDisconnected(errorCode: Int) {}

    override fun onLogout(errorCode: Int, info: String?) {
        super.onLogout(errorCode, info)
        showToast("You have been logged out, please log in again!")
        ChatLog.e(TAG, "")
    }

    override fun onDestroy() {
        super.onDestroy()
        EaseIM.unsubscribeConnectionDelegates(this)
    }

    companion object {
        private const val TAG = "MainActivity"
    }
}

fun Context.showToast(msg: String) {
    CoroutineScope(Dispatchers.Main).launch {
        Toast.makeText(this@showToast, msg, Toast.LENGTH_SHORT).show()
    }
}
```

2. 点击 `Sync Project with Gradle Files` 同步工程。现在可以测试你的应用了。

### 第三步 发送第一条消息

在聊天页面下方输入消息，然后点击**发送**按钮发送消息。

![img](@static/images/uikit/chatuikit/android/message_first.png =300x650) 

## 测试应用

1. 在 Android Studio 中，点击 `Run ‘app’` 按钮，将应用运行到你的设备或者模拟器上。

2. 输入用户 ID 和密码，点击 `Login` 按钮进行登录，登录成功或者失败有 `Toast` 提示，或者通过 Logcat 查看。

3. 在另一台设备或者模拟器上登录另一个账号。

4. 两台设别或者模拟器分别输入对方的账号，并点击 `Start Chat` 按钮，进入聊天页面。现在你可以在两个账号间进行聊天了。