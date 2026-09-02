# Import the SDK

This page describes how to integrate the EasyIM SDK into your Android project.

## Development environment requirements

- Android Studio Meerkat | 2024.3.1 Patch 2 or later is recommended.
- Gradle 8.0 or later is recommended.
- `targetSdkVersion` 33 or later
- Android SDK API 21 or later
- JDK 17 or later

## Import the SDK

Choose one of the following methods to import the EasyIM SDK into your project.

:::tip

1. Choose only one of the following integration methods. Using multiple methods at the same time might cause errors.
2. See the [Release Notes](releasenote.html) for the latest version number.

:::

### Method 1: Automatically integrate with Maven Central

1. Add the `mavenCentral()` repository to the project's `build.gradle` file.

```gradle
buildscript {
    repositories {
        ...
        mavenCentral()
    }
    ...
}

allprojects {
    repositories {
        ...
        mavenCentral()
    }
}
```

2. Add the following dependency to the `module` `build.gradle` file:

```gradle
...
dependencies {
    ...
    // Replace x.x.x with a specific version number.
    // Obtain the latest version number from the SDK release notes.
    implementation 'io.hyphenate:hyphenate-chat:x.x.x'
}
```

### Method 2: Manually copy SDK files

Open the [SDK download page](http://easyim.ai/sdk#Android), download the latest EasyIM Android SDK, and decompress it.

![img](@static/images/android/sdk-files.png)

Copy the following files from the `libs` directory in the SDK package to the indicated paths in your project:

| File or folder | Project path |
| :------------------- | :--------------------- |
| `hyphenatechat_xxx.jar` file | `/app/libs/ ` |
| `arm64-v8a` folder | `/app/src/main/jniLibs/` |
| `armeabi-v7a` folder | `/app/src/main/jniLibs/` |
| `x86` folder | `/app/src/main/jniLibs/` |
| `x86_64` folder | `/app/src/main/jniLibs/` |

Finally, add the following dependency to the `module` `build.gradle` file in your project:

```gradle
...
dependencies {
    ...
    // Replace x.y.z with a specific version number.
    // Obtain the latest version number from the SDK release notes.
    implementation(files("libs/hyphenatechat_x.y.z.jar"))
}
```

If APK size is important, use the JAR method and manually copy only the `.so` files for the CPU architectures your app needs to support. You can also use `abiFilters` in Gradle to restrict the CPU architectures included in the package. When publishing the app, select supported architectures according to target-device and app-store requirements. For current mainstream 64-bit Android devices, you generally need to include at least `arm64-v8a`; retaining only `armeabi-v7a` for 32-bit ARM devices is not recommended.

### Method 3: Dynamically load .so library files

To reduce the app package size, the SDK provides `EMOptions#setNativeLibBasePath` for loading required `.so` files from a specified directory. The SDK uses the dynamic libraries `libcipherdb.so`, `libhyphenate.so`, and `libaosl.so`.

Implement this feature as follows:

1. [Download the latest SDK](http://easyim.ai/sdk#Android) and decompress it.
2. Integrate `hyphenatechat_x.y.z.jar` from the downloaded package into your project.
3. Upload the `.so` files for all architectures to your server, and ensure that the app can download the `.so` files for the target architecture over the network.
4. At runtime, the app checks whether the `.so` files exist. If they are not found, the app downloads them and saves them to your custom private app directory.
5. When calling `EMClient#init` to initialize the SDK, pass the private app directory containing the `.so` files to `EMOptions#setNativeLibBasePath`.
6. After you call `EMClient#init`, the SDK automatically loads the `.so` files from the specified path.

:::tip
1. This method applies only to manual Android SDK integration, not integration through Maven Central.
2. The path of the native libraries depends on the `path` parameter of `EMOptions#setNativeLibBasePath`:
- If `path` is set, the SDK internally uses `System.load` to find and load the native libraries from that path. The path must be a valid private app directory.
- If `path` is empty or the method is not called, the SDK internally uses `System.loadLibrary` to find and load the native libraries from the system default path.
:::

```java
// Assume that libcipherdb.so, libhyphenate.so, and libaosl.so for the current device's CPU architecture
// have been downloaded to the app's private files directory.
String filesPath = mContext.getFilesDir().getAbsolutePath();

EMOptions options = new EMOptions();
// Set the directory containing the three dynamic libraries. Call this method before SDK initialization.
options.setNativeLibBasePath(filesPath);

// Load the dynamic libraries from the directory above during SDK initialization.
EMClient.getInstance().init(mContext, options);

```

### Add project permissions

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
    <!-- Retrieves carrier information to determine the network state -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <!-- On Android 12 and earlier, request external storage read permission as needed to access attachments in external storage -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <!-- GPS access for location messages; remove it if location-related features are not used -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <!-- Allows the background process to continue running after the phone screen is turned off -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <!-- EasyIM SDK required end -->

</manifest>
```

### Prevent code obfuscation

Add the following lines to `app/proguard-rules.pro` to prevent SDK code from being obfuscated:

```java
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`setNativeLibBasePath`](#method-3-dynamically-load-so-library-files) | `EMOptions` | Sets the private app directory containing the SDK's native dynamic libraries. |
| [`init`](#method-3-dynamically-load-so-library-files) | `EMClient` | Initializes the Android SDK with the specified configuration and loads the required dynamic libraries. |
