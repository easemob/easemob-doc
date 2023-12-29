# 跑通示例项目

环信提供一个开源的 ChatroomUIKit 示例项目，演示了如何使用该 UIKit 快速搭建聊天室页面，实现完整业务。

## 开发环境要求

- 即时通讯 SDK 3.0.0（包含）-4.0.0；
- Flutter 3.3.0 或以上版本；
- 有效的环信即时通讯 IM 开发者账号和 [App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)；
- `iOS` 应用：
  - Xcode 13 或以上;
  - ios 11 或以上;
- `Android` 应用：minSDKVersion 21。

## 操作步骤

可以通过 `example` 项目进行演示。`example` 文件夹中为示例项目，可以下载源码、进行编译，然后运行进行体验。

### 第一步 下载源码仓库

运行以下命令：

```sh
git clone git@github.com:easemob/UIKit_Chatroom_flutter.git
```

或者点击[这里](https://codeload.github.com/easemob/UIKit_Chatroom_flutter/zip/refs/heads/main)直接下载。

### 第二步 项目初始化

1. 进入 `example` 目录，运行 `flutter pub get` 命令。

2. 修改 `example/lib/main.dart` 中的 `appKey`。

### 第三步 运行项目

在 `vscode` 中运行。