# 跑通示例项目

<Toc />

环信提供一个开源的聊天示例项目，演示了如何使用该 UIKit 快速搭建聊天页面，实现完整业务。

本文展示如何编译并运行 Flutter 平台的聊天 UIKit 示例项目。

## 前提条件

开始前，请确保你的开发环境满足以下条件：

```yaml
environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: ">=3.3.0"
```

## 操作步骤

1. 示例项目在 `Example` 目录中，如果需要运行示例，需要先将项目 [下载](https://github.com/easemob/chatuikit-flutter) 到本地，进入到 `Example` 目录。

2. 执行 `flutter pub get` 更新依赖库，执行 `flutter run` 运行该示例项目。

```bash
flutter pub get
flutter run
```