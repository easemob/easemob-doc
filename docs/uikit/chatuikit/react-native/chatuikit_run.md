# 跑通示例项目

<Toc />

环信提供一个开源的聊天示例项目，演示了如何使用该 UIKit 快速搭建聊天页面，实现完整业务。

本文展示如何编译并运行 React Native 平台的聊天 UIKit 示例项目。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- MacOS 12 或以上版本；
- React Native 0.71 或以上版本；
- NodeJs 16.18 或以上版本；
- 对于 `iOS` 平台，需要 `Xcode` 工具，版本建议 14 或以上；
- 对于 `Android` 平台，需要 `Android studio` 工具，版本建议 2022 或以上。

## AppServer

该实例项目运行需要配置 AppServer。在服务端部署 AppServer 服务，在客户端实现 RESTful API 接口。

本示例项目中，配置服务器地址 `RestApi.setServer`, 提供获取手机号验证码、手机号登录、上传头像、获取 rtcToken、获取 rtcMap、获取群主头像接口。

详见 `example/src/demo/common/rest.api.ts`。

## 操作步骤

### 下载项目

可以通过 [GitHub 地址](https://github.com/easemob/react-native-chat-library)下载项目。

### 初始化项目

下载完成之后，打开文件目录。运行以下命令初始化项目：

```sh
yarn && yarn uikit-prepack
```

- 对于 iOS 平台，运行 `pod install` 初始化原生部分的依赖配置。

```sh
cd example/ios && pod install
```

- 对于 Android 平台，建议使用 Android studio sync 示例项目。

使用 `Android studio` 应用打开 `example/android` 目录，同步项目。

### 本地配置

登录[环信即时通讯控制台](https://console.easemob.com/user/login)，获取 App Key。将 App Key、用户 ID 和用户 token 填入 `example` 的配置文件 `example/src/env.ts` 中。

例如：

```js
export const useSendBox = false;
export const isDevMode = true;
export const appKey = "xxx";
export const accountType = "easemob"; // agora or easemob
export const agoraAppId = "xxx";
export const fcmSenderId = "xxx";
export const account = [{ id: "xxx", token: "xxx" }];
```

手动设置区域，目前支持国内和海外。配置文件在 `packages/react-native-chat-uikit/src/config.local.ts`

```js
export const language = "zh-Hans"; // 'en' or 'zh-Hans'
export const release_area = "china"; // 'china' or 'global'
```

### 编译和运行

在 debug 模式下，运行本地服务，在调试过程中可以修改 JavaScript 文件，查看修改后的效果。

```sh
yarn run ios
```

或者

```sh
yarn run android
```

## 可能出现的问题

1. Q：Android 平台应用编译失败，可能的原因是什么？

A: 可能需要 `Android Studio` 工具的 `cmake 3.10.2` 插件。
