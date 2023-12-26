# 集成 ChatroomUIKit

使用 ChatroomUIKit 之前，你需要将 ChatroomUIKit 集成到你的应用中。

## 前提条件

要集成 ChatroomUIKit，你的开发环境需要满足以下需求：

- Xcode 14.0 或以上版本；
- iOS 13.0 或以上版本；
- 项目中已设置有效的开发者签名。
 
## 使用 CocoaPods 集成 ChatroomUIKit

你可以使用 CocoaPods 将 ChatroomUIKit 添加为 Xcode 项目的依赖项。

1. 在 `Podfile` 文件中添加如下依赖：

```
source 'https://github.com/CocoaPods/Specs.git'
platform :ios, '13.0'

target 'YourTarget' do
  use_frameworks!
  
  pod 'ChatroomUIKit'
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
    end
  end
end
```

2. 打开终端，cd 到 `Podfile` 所在的目录，然后执行以下命令集成 ChatroomUIKit。

```
pod install --repo-update
```

若 Xcode 15 编译出现以下报错 **Sandbox: rsync.samba(47334) deny(1) file-write-create...**，你可以在 **Build Setting** 中搜索 **ENABLE_USER_SCRIPT_SANDBOXING**，将 **User Script Sandboxing** 的设置修改为 **NO**。
