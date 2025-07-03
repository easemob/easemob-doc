# 跑通示例项目

环信提供一个开源的 ChatroomUIKit 示例项目，演示了如何使用该 UIKit 快速搭建聊天室页面，实现完整业务。

## 环境要求

- MacOS 12 或以上版本
- React-Native 0.71 或以上版本
- NodeJs 20.18 或以上版本

对于 iOS 平台

- xcode 15 或以上版本

对于 Android 平台

- Android Studio 2022.3 或以上版本

## 下载项目

克隆项目仓库：

```sh
git clone https://github.com/easemob/easemob-uikit-reactnative.git
```

## 初始化项目

```sh
cd easemob-uikit-reactnative
yarn && yarn prepare
```

## 编译运行示例项目

1. 进入示例项目目录：

```sh
cd examples/room-example
```

2. 设置 appKey：

修改 `examples/room-example/src/env.ts` 文件内容，填写 appKey 参数。

您可以在[环信即时通讯云控制台](https://console.easemob.com/)创建应用并获取 appKey。

3. 运行项目：

### iOS 平台

```sh
# 安装依赖
cd ios && pod install && cd ..

# 编译运行
yarn run ios
```

### Android 平台

```sh
# 直接编译运行
yarn run android
```

## 运行效果

成功运行后，您将看到包含以下功能的即时通讯应用：

- 用户登录
- 聊天室列表
- 聊天室

## 常见问题

// todo: 请看xx章节或者可以点击链接
