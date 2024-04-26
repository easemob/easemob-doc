# 跑通示例项目

<Toc />

环信提供一个开源的聊天示例项目，演示了如何使用该 UIKit 快速搭建聊天页面，实现完整业务。

本文展示如何编译并运行 iOS 平台的聊天 UIKit 示例项目。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- Xcode 15.0 或以上版本；
- iOS 13.0 或以上版本；
- 项目中已设置有效的开发者签名。

## 操作步骤

### 第一步 下载示例代码

前往 [GitHub 源码](https://github.com/easemob/chatuikit-ios)下载示例代码到本机。

### 第二步 执行 pod 命令

1. 点击打开 `chatuikit-ios` 文件夹。

2. 将 `Example` 文件夹拖拽到终端。

3. 终端中输入如下命令，然后回车：

```
pod install --repo-update
```

### 第三步 编译

1. 使用 Xcode 双击打开 `.xcworkspace` 工程文件。

2. 在键盘上按 `cmd+B` 进行编译，编译结果会报错，如下图所示：

![img](@static/images/uikit/chatuikit/ios/buildError.png) 

3. 在[环信即时通讯控制台](https://console.easemob.com/user/login)创建有效的环信即时通讯 IM 开发者账号和 [App Key](/product/enable_and_configure_IM.html#创建应用)。然后，将 App Key 填入 `appKey` 字段，运行项目。

在键盘上按 `cmd+B` 重新编译程序即可跑通项目。

4. [创建有效的环信 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)，将用户的 ID 和 token 分别填入下图的两个输入框，点击 **Login**。

![img](@static/images/uikit/chatuikit/ios/login.png)

### 第四步 体验项目

双击 `.xcworkspace` 文件打开项目，在键盘上按 `cmd+R` 运行项目即可在真机上体验。该 UIKit 支持 x86_64 架构模拟器，但不支持 M1 下模拟器，原因是 UIKIt 使用了一个将音频文件转为 AMR 格式的 FFmpeg 的静态库。

## 注意事项

示例工程仅用于快速跑通流程以及体验单群聊 UIKit 所有功能。