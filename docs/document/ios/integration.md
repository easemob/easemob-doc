# 导入 SDK

本文介绍如何将环信即时通讯 IM iOS SDK 集成到 iOS 项目中。

## 开发环境要求

- Xcode：推荐最新版本。
- 安装 iOS 10.0 或更高版本的 iOS 模拟器或 Apple 设备。
- CocoaPods 1.10.1 或更高版本（使用 CocoaPods 集成时需要）。

## 导入 SDK

选择以下任一方式将环信即时通讯 IM SDK 导入项目。

:::tip

1. CocoaPods 集成和手动集成二选一；不要同时使用两种方式。
2. SDK 最新版本号请参见 [发版说明](releasenote.html)。

:::

### 方法一：使用 CocoaPods 集成

1. 在 Terminal 中进入项目根目录，运行 `pod init`。该命令会在项目根目录生成 `Podfile`。
2. 打开 `Podfile`，配置 iOS 部署目标、App Target 和 SDK 依赖：

```ruby
platform :ios, '10.0'

target 'EMChatQuickstart' do
  pod 'HyphenateChat'
end
```

3. 运行 `pod install` 安装 SDK。安装成功后，Terminal 会显示 `Pod installation complete!`，项目根目录会生成 `.xcworkspace` 文件。
4. 后续开发请使用生成的 `.xcworkspace` 文件打开项目，而不是 `.xcodeproj` 文件。

如需更新已安装的 SDK 版本，可运行 `pod update HyphenateChat`，随后重新使用 `.xcworkspace` 打开项目。

### 方法二：手动导入 SDK

1. 打开 [SDK 下载页面](https://www.easemob.com/download/im#IOS)，下载并解压最新版环信即时通讯 IM iOS SDK。
2. 将 SDK 包内的 `HyphenateChat.xcframework` 和 `aosl.xcframework` 拖入 Xcode 项目。
3. 在 **TARGETS > Project Name > General > Frameworks, Libraries, and Embedded Content** 中确认两个 xcframework 均已添加，并将其 **Embed** 设置为 **Embed & Sign**。

添加完成后，Xcode 会自动链接 SDK 依赖的系统库。

:::tip
如果项目同时集成了特定版本的 Agora RTC SDK，且 `pod install` 提示 `aosl.xcframework` 同名冲突，请参见 [快速开始中的集成问题说明](quickstart.html#sdk-依赖的-crash-上报库冲突)。
:::
