# 集成 SDK

本文介绍如何将环信即时通讯 IM SDK 集成到你的 iOS 项目。

## 开发环境要求

- Xcode (推荐最新版本)。
- 安装 iOS 10.0 或更高版本的 iOS 模拟器或 Apple 设备。
- CocoaPods 1.10.1 或更高版本。

## 集成 SDK

选择如下任意一种方式将环信即时通讯 IM SDK 集成到你的项目中。

:::tip

1. 以下集成方式只需选择一种，同时使用多种集成方式可能会报错。
2. 请点击查看 [发版说明](releasenote.html) 获得最新版本号。

:::

### 方法一：使用 Cocoapods 自动集成

1. 在 **Terminal** 里进入项目根目录，并运行 pod init 命令。项目文件夹下会生成一个 **Podfile** 文本文件。
打开 **Podfile** 文件，修改文件为如下内容：

```ruby
# platform :ios, '10.0'

 target 'EMChatQuickstart' do
     pod 'HyphenateChat'
 end
 ```

2. 运行 `pod update` 命令更新本地库版本。
3. 运行 `pod install` 命令安装 HyphenateChat SDK。成功安装后，**Terminal** 中会显示 **Pod installation complete!**，此时项目文件夹下会生成一个 `xcworkspace` 文件。

### 方法二：手动复制 SDK 文件

打开 [SDK 下载页面](https://www.easemob.com/download/im)，获取最新版的环信即时通讯 IM SDK，然后解压。

将 SDK 包内的 `HyphenateChat.xcframework` 拖入到你的工程中。

:::tip
如果使用 `4.11.0` 及以上版本的SDK，需要将 `aosl.xcframework` 和 `HyphenateChat.xcframework` 同时导入到工程中。
:::
