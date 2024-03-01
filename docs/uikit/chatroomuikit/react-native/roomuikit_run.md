# 跑通示例项目

环信提供一个开源的 ChatroomUIKit 示例项目，演示了如何使用该 UIKit 快速搭建聊天室页面，实现完整业务。

## 开发环境要求

- MacOS 12 或以上版本；
- React-Native 0.66 或以上版本；
- NodeJs 16.18 或以上版本；
- iOS 应用：Xcode 13 或以上版本，以及它的相关依赖工具。
- Android 应用：Android Studio 2021 或以上版本，以及它的相关依赖工具。

## 操作步骤

### 第一步 在项目中安装 ChatroomUIKit

```tsx
npm install react-native-chat-room 
// or     
yarn add react-native-chat-room
// or
npx expo install react-native-chat-room
```

### 第二步 示例项目演示

`example` 文件夹中为示例项目，可以下载源码、进行编译，然后运行进行体验。

下载源码仓库：

```sh
git clone https://github.com/agora/rncr/react-native-chat-room
```

或者，你可以下载源码压缩包：

```sh
curl -L -o file.zip  https://github.com/AsteriskZuo/react-native-chat-room/archive/refs/heads/main.zip
```

### 第三步 项目初始化

1. 进入项目根目录，运行 `yarn & yarn env` 命令完成初始化。

2. 在生成的文件 `example/src/env.ts` 中，修改必要的配置项。

- 对于 `iOS` 应用：

  需要运行 `pod install` 命令进行初始化。

- 对于 `Android` 应用：

  需要执行 `gradle sync` 命令进行初始化。

### 第四步 运行项目

在 `react-native-chat-room/tree/main/example` 目录下运行以下命令：

```sh
yarn run ios
// or
yarn run android
```