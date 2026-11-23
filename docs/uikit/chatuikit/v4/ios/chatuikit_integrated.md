# 集成单群聊 UIKit

<Toc />

使用单群聊 UIKit 之前，你需要将其集成到你的应用中。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- Xcode 16 或以上版本；
- iOS 14.0 或以上版本；使用 EaseChatUIKit 4.26.0 的 SPM 包时，最低要求为 iOS 15.0，其他版本请以对应 `Package.swift` 为准；
- CocoaPods 1.14.3 及以上版本（仅使用 CocoaPods 集成时需要）；
- 项目中已设置有效的开发者签名。

## 安装

推荐使用 Swift Package Manager（SPM）安装 EaseChatUIKit。SPM 和 CocoaPods 只需选择一种，避免重复引入依赖。

### （推荐）方法一：使用 Swift Package Manager 集成

EaseChatUIKit 自 4.26.0 起提供 SPM 集成方式。请选用支持 SPM 的发布版本。

1. 在 Xcode 中打开项目，选择 **File > Add Package Dependencies…**。
2. 在搜索框中输入仓库地址：[https://github.com/easemob/easemob-uikit-ios.git](https://github.com/easemob/easemob-uikit-ios.git)。
3. 在 **Dependency Rule** 中选择 **Exact Version**，填入支持 SPM 的发布版本号，例如 `4.26.0`，然后点击 **Add Package**。如需使用其他版本，请先确认对应版本标签包含 `Package.swift`。
4. 在包产品选择页面，将 **EaseChatUIKit** 添加到你的 App Target，然后点击 **Add Package**。等待 Xcode 完成依赖解析和下载。

将 App Target 的最低部署版本设为 iOS 15.0 或以上，以满足 EaseChatUIKit 4.26.0 的 SPM 包要求。SPM 会根据包配置解析 IM SDK 等依赖；若项目已集成 IM SDK，请确认版本兼容，并避免重复引入。

### 方法二：使用 CocoaPods 集成（即将废弃）

CocoaPods 集成方式即将废弃，建议优先使用 SPM。

在 `Podfile` 中添加如下依赖：

```
source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '14.0'

target 'YourTarget' do
  use_frameworks!
  
  pod 'EaseChatUIKit'
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '14.0'
      config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = "arm64"
    end
  end
end
```

执行 cd 命令转到终端下 `podfile` 所在文件夹目录，然后执行以下命令：

```
pod install --repo-update
```

## 常见问题

### 沙盒选项问题

当你使用 Xcode 15 创建新工程时，编译时若出现 **Sandbox: rsync.samba(47334) deny(1) file-write-create...** 报错，你需要在 **Target > Build Settings** 中查找 **User Script Sandboxing** 选项，设置为 **NO**。

![img](/images/ios/quickstart_emulator_error.png)

![img](/images/ios/quickstart_error_solve.png)
