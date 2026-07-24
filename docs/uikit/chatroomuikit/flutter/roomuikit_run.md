# 跑通示例项目

<Toc />

环信提供一个开源的 ChatroomUIKit 示例项目，演示了如何使用该 UIKit 快速搭建聊天室页面，实现完整业务。

:::tip
ChatroomUIKit 已合并到 `em_chat_uikit` 中，当前示例请使用 `easemob-uikit-flutter/example`。旧独立仓库和 `chatroom_uikit` 包不再作为当前版本的集成入口。
:::

## 开发环境要求

- Flutter 3.3.0 或以上版本；
- 有效的环信即时通讯 IM 开发者账号和 [App Key](/product/console/app_manage.html#管理应用)；
- `iOS` 应用：
  - Xcode 13 或以上;
  - iOS 12 或以上;
- `Android` 应用：minSDKVersion 24。

## 操作步骤

可以通过 `example` 项目进行演示。`example` 文件夹中为示例项目，可以下载源码、进行编译，然后运行进行体验。

### 第一步 下载源码仓库

运行以下命令：

```sh
git clone git@github.com:easemob/easemob-uikit-flutter.git
```

或者点击 [GitHub URL](https://github.com/easemob/easemob-uikit-flutter) 查看源码。

### 第二步 项目初始化

1. 进入 `easemob-uikit-flutter/example` 目录，运行 `flutter pub get` 命令。

2. 修改 `example/lib/main.dart` 中的 `appKey`。

### 第三步 运行项目

在 `vscode` 中运行。
