# 集成单群聊 UIKit

<Toc />

使用单群聊 UIKit 之前，你需要将其集成到你的应用中。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- Xcode 16 或以上版木；
- iOs 13.0 或以上版木；
- CocoaPods 1.14.3 及以上版本；
- 项目中已设置有效的开发者签名。

## 安装

你可以使用 CocoaPods 安装 EaseChatUIKit 作为 Xcode 项目的依赖项。

## CocoaPods

在 `Podfile` 中添加如下依赖：

```
source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '13.0'

target 'YourTarget' do
  use_frameworks!
  
  pod 'EaseChatUIKit'
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
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

当你使用 Xcode 15 创建新工程时，编译时若出现 **Sandbox: rsync.samba(47334) deny(1) file-write-create...** 报错，你需要在 **Target > Build Settings** 中找到 **User Script Sandboxing** 选项，设置为 **NO**。

![img](/images/ios/quickstart_emulator_error.png)

![img](/images/ios/quickstart_error_solve.png)