# Quickstart

This page describes how to quickly integrate the EasyIM Android SDK to implement one-to-one chat.

## Implementation principles

The following figure shows the workflow for sending and receiving one-to-one text messages on a client.

![img](/images/android/sendandreceivemsg.png)

## Prerequisite

- Android Studio Meerkat | 2024.3.1 Patch 2 or later is recommended.
- Gradle 8.0 or later is recommended.
- targetVersion 33 or later
- Android SDK API 21 or later
- JDK 17 or later
- A valid EasyIM developer account and App Key. See [EasyIM Console](https://console.easyim.ai/user/login).

## Prepare the development environment

This section describes how to create a project, integrate the EasyIM Android SDK into it, and add the corresponding device permissions.

### 1. Create an Android project

Create an Android project as follows:

1. Open Android Studio and click **File > New > New Project** in the upper-left menu.
2. On the **New Project** page, select **Empty Views Activity** under the **Phone and Tablet** tab, and click **Next**.
3. On the **Empty Views Activity** page, enter the following information:
   - **Name**: Name of your Android project, such as HelloWorld.
   - **Package name**: Name of your project package, such as com.easemob.helloworld.
   - **Save location**: Storage path of the project.
   - **Language**: Programming language of the project, such as Java.
   - **Minimum SDK**: Minimum API level of the project, such as API 21.
   - **Build configuration language**: Project build language, such as Groovy DSL (build.gradle).

Then click **Finish**. Install the required plugins as prompted.

The preceding steps use **Android Studio Ladybug | 2024.2.1 Patch 3** as an example. You can also see [Create a Project](https://developer.android.com/studio/projects/create-project) in the official Android Studio documentation.

### 2. Integrate the SDK

You can automatically integrate the SDK with Maven Central.

1. Add the `mavenCentral()` repository to the `settings.gradle` file in the Project root directory.

```gradle
pluginManagement {
    repositories {
        ……
        mavenCentral()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        ……
        mavenCentral()
    }
}
```

2. Add the following dependency to the `build.gradle` file in the app (module) directory:

```gradle
dependencies {
    ...
    // Replace x.y.z with the Android SDK version to integrate.
    implementation("io.hyphenate:hyphenate-chat:x.y.z")
}
```
For the latest version number, see the [Release Notes](releasenote.html).

You can also integrate the EasyIM SDK by manually copying SDK files or dynamically loading `.so` library files. For details, see [Import the SDK](integration.html).

### 3. Add project permissions

Add the following lines to `/app/src/main/AndroidManifest.xml` as required by your scenario to obtain the corresponding device permissions:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="Your Package"
    android:versionCode="100"
    android:versionName="1.0.0">

    <!-- EasyIM SDK required start -->
    <!-- Allows vibration for local notifications -->
    <uses-permission android:name="android.permission.VIBRATE" />
    <!-- Network access permission -->
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- Microphone permission for recording voice messages; remove it if voice recording is not used -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <!-- Camera permission for taking pictures for image messages; remove it if the camera is not used -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature
        android:name="android.hardware.camera"
        android:required="false" />
    <!-- Retrieves carrier information to determine the network state -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <!-- Storage read permission for retrieving attachments and other files -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <!-- GPS access for location messages; remove it if location-related features are not used -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <!-- Allows the background process to continue running after the phone screen is turned off -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <!-- Exact alarm permission used by the SDK heartbeat; it is optional in version 3.9.8 and later -->
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <!-- EasyIM SDK required end -->

</manifest>
```

To obtain the value corresponding to the App Key, create an app in [EasyIM Console](https://console.easyim.ai/user/login), apply for an App Key, and complete the relevant configuration.

### 4. Prevent code obfuscation

Add the following lines to `app/proguard-rules.pro` to prevent SDK code from being obfuscated:

```java
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

## Implement one-to-one chat

This section describes how to implement one-to-one chat.

### 1. Initialize the SDK

Initialize the SDK in the **main process**:

```java
// Import packages.
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMOptions;

EMOptions options = new EMOptions();
options.setAppKey("Your appkey");
......// Other EMOptions configurations.
// context is the context. You can replace it with this in an Application or Activity.
EMClient.getInstance().init(context, options);
```
### 2. Create a user

Create a user in [EasyIM Console](https://console.easyim.ai/user/login), and obtain the user ID and user token. For details, see [Create Users](/product/console/operation_user.html#create-a-user).

For security in production, integrate the [Get App Token API](/rest/easemob_app_token.html) and [Get User Token API](/rest/easemob_user_token.html) into your app server to implement token retrieval, so users obtain tokens from your app server.

### 3. Log in to an account

After obtaining the account's user ID and token, log in as follows:

```java
// Import packages.
import com.hyphenate.EMCallBack;
import com.hyphenate.chat.EMClient;

EMClient.getInstance().loginWithToken(mAccount, mToken, new EMCallBack() {
    // Login success callback
    @Override
    public void onSuccess() {
      // The callback runs on an asynchronous thread. Switch to the main thread to handle UI-related operations.
    }

    // Login failure callback containing error information
    @Override
    public void onError(final int code, final String error) {
      // The callback runs on an asynchronous thread. Switch to the main thread to handle UI-related operations.
    }

});
```

:::tip
1. SDK operations that require server access must be performed after login and connection establishment. SDK initialization can be completed before login. The local database opens during login. For details, see [Login](login.html).
2. After login succeeds, the SDK automatically loads local conversation and chat group data. On the main page, directly call the local read APIs for [conversations](conversation_list.html#一次性获取本地所有会话) and the [chat group list](group_manage.html#获取当前用户加入的群组列表).
:::

### 4. Send a one-to-one message

```java
// Import packages.
import com.hyphenate.EMCallBack;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMMessage;

// `content` is the text to send, and `toChatUsername` is the peer account.
EMMessage message = EMMessage.createTextSendMessage(content, toChatUsername);
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

## FAQ

### Conflict in the Crash reporting library required by the SDK

When both the EasyIM SDK and Agora RTM SDK 2.2.0 or RTC SDK 4.3.0 or later are integrated, compilation might produce the following error because both include `libaosl.so`:

```java
com.android.builder.merge.DuplicateRelativeFileException: More than one file was found with OS independent path 'lib/x86/libaosl.so'
```

Add a `packagingOptions` block to the Android block in the app's `build.gradle` file to select the first matching file during the build:

```gradle
android {
  ...
  packagingOptions {
    pickFirst 'lib/x86/libaosl.so'
    pickFirst 'lib/x86_64/libaosl.so'
    pickFirst 'lib/armeabi-v7a/libaosl.so'
    pickFirst 'lib/arm64-v8a/libaosl.so'
  }
}
```

Then synchronize the Gradle file and rebuild the project. For details, see the [official Agora documentation](https://doc.shengwang.cn/faq/integration-issues/rtm2-rtc-integration-issue).

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`init`](#1-initialize-the-sdk) | `EMClient` | Initializes the Android SDK. |
| [`setAppKey`](#1-initialize-the-sdk) | `EMOptions` | Sets the App Key of the app. |
| [`loginWithToken`](#3-log-in-to-an-account) | `EMClient` | Logs in with a user ID and token. |
| [`createTextSendMessage`](#4-send-a-one-to-one-message) | `EMMessage` | Creates a text message. |
| [`sendMessage`](#4-send-a-one-to-one-message) | `EMChatManager` | Sends a message. |
