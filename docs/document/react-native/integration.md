# 集成 SDK

本文介绍如何将环信即时通讯 IM SDK 集成到你的 React Native 项目中。

## 开发环境需求

- React Native 0.66.5 or above
- NodeJs 16 or above (Recommended 18 or above)

## 集成到项目中

打开终端，添加依赖到项目中：

```sh
yarn add react-native-chat-sdk
```

or

```sh
npm i --save react-native-chat-sdk
```

## 添加权限

目前需要基本的网络通讯权限。

对于 iOS 平台：内置网络权限。

对于 Android 平台：

更新 `AndroidManifest.xml` 文件内容，增加需要的权限。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
</manifest>
```
