# 导入 SDK

本文介绍如何将环信即时通讯 IM SDK 集成到你的 iOS 项目。

## 开发环境要求

- Xcode (推荐最新版本)。
- 安装 iOS 10.0 或更高版本的 iOS 模拟器或 Apple 设备。
- CocoaPods 1.10.1 或更高版本（仅使用 CocoaPods 集成时需要）。

## 导入 SDK

选择如下任意一种方式将环信即时通讯 IM SDK 导入到你的项目中。

:::tip

1. Swift Package Manager（SPM）、CocoaPods 和手动集成只需选择一种，避免重复引入 SDK。
2. 请点击查看 [发版说明](releasenote.html) 获得最新版本号。

:::

### （推荐）方法一：使用 Swift Package Manager 集成

SDK 4.19.0 及之后的大部分版本支持 SPM，请选用提供 SPM 包配置的 4.x 发布版本。

1. 在 Xcode 中打开项目，选择 **File > Add Package Dependencies…**。
2. 在搜索框中输入仓库地址：[https://github.com/easemob/HyphenateChat_iOS](https://github.com/easemob/HyphenateChat_iOS)。
3. 在 **Dependency Rule** 中选择 **Exact Version**，填入支持 SPM 的发布版本号，例如 `4.26.0`，然后点击 **Add Package**。如需使用其他版本，请先确认对应版本标签包含 `Package.swift`。
4. 在包产品选择页面，将 **HyphenateChat** 添加到你的 App Target，然后点击 **Add Package**。等待 Xcode 完成依赖解析和下载。

SDK `4.26.0` 的 SPM 包最低要求为 iOS 10.0。使用其他版本时，请以所选版本 `Package.swift` 中的系统要求为准，并相应设置 App Target 的最低部署版本。

### 方法二：使用 CocoaPods 集成（即将废弃）

CocoaPods 集成方式即将废弃，建议优先使用 SPM。

1. 在 **Terminal** 里进入项目根目录，并运行 `pod init` 命令。项目文件夹下会生成一个 **Podfile** 文本文件。
打开 **Podfile** 文件，修改文件为如下内容：

```ruby
# platform :ios, '10.0'

 target 'EMChatQuickstart' do
     pod 'HyphenateChat'
 end
 ```

2. 运行 `pod update` 命令更新本地库版本。
3. 运行 `pod install` 命令安装 HyphenateChat SDK。成功安装后，**Terminal** 中会显示 **Pod installation complete!**，此时项目文件夹下会生成一个 `xcworkspace` 文件。

### 方法三：手动复制 SDK 文件

打开 [SDK 下载页面](https://www.easemob.com/download/im#IOS)，获取最新版的环信即时通讯 IM SDK，然后解压。

将 SDK 包内的 `HyphenateChat.xcframework` 拖入到你的工程中。

:::tip
如果使用 `4.11.0` 及以上版本的SDK，需要将 `aosl.xcframework` 和 `HyphenateChat.xcframework` 同时导入到工程中。
:::
