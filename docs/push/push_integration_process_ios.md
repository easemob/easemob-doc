# 环信 EMPush iOS 集成

本文介绍如何集成环信推送 EMPush iOS SDK。

## 前提条件

系统版本要求：

EMPush 支持 iOS 10.0 及以上系统版本。

## 集成 EMPush iOS SDK

EMPush iOS SDK 支持使用 pod 集成或本地集成。

### 一、导入 iOS EMPush SDK

#### 安装 Cocoapods 工具

1. 开始前确保你已安装 Cocoapods。参考 [Getting Started with CocoaPods](https://guides.cocoapods.org/using/getting-started.html#getting-started) 安装说明。
2. 在终端里进入项目根目录，并运行 `pod init` 命令。项目文件夹下会生成 `Podfile` 文件。

#### pod 方式集成 EMPush

1. 打开 `Podfile` 文件，添加 EPush 依赖。

注意将 `ProjectName` 替换为你的 target 名称。

```pod
platform :ios, '11.0'

# Import CocoaPods sources
source 'https://github.com/CocoaPods/Specs.git'

target 'ProjectName' do
    pod 'EPush'
end
```

2. 在终端 Terminal cd 到 `podfile` 文件所在目录，执行如下命令集成 SDK。

```pod
pod install
```

3. 成功安装后，Terminal 中会显示 `Pod installation complete!`。此时项目文件夹下会生成一个 `xcworkspace` 文件。

4. 打开新生成的 `xcworkspace` 文件运行项目。

#### 本地集成

##### 手动导入 EMPush iOS SDK

1. 下载最新版的 [EMpush iOS SDK](https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/EMPush_iOS/EMPush_1_0_0.zip) 并解压。
2. 复制 SDK 包中的 `EMPush.framework` 至项目路径。
3. 打开 Xcode，进入 **TARGETS > Project Name > General > Frameworks, Libraries, and Embedded Content**菜单。
4. 点击 **+ > Add Other… > Add Files** 添加对应动态库，并确保添加的动态库 **Embed** 属性设置为 **Embed & Sign**。

添加完成后，项目会自动链接所需系统库。

### 二、初始化

#### 1. 引入头文件

```objectiveC
#import <EMPush/EMPush.h>
```

#### 2. 初始化 EMPush

```objectiveC
EMPushClientOptions *option = [EMPushClientOptions optionsWithAppkey:@"appkey"];
option.enableConsoleLog = YES;
option.isAutoLogin = YES;
option.apnsCertName = @"apnsname";
[EMPushClient initializeSDKWithOptions:option launchDelegate:self completion:^(EMError *aError) {
    }];
```

#### 3. 注册

注册模式分两种，开放注册和授权注册。只有开放注册时，才可以客户端注册。

强烈建议开发者通过后台调用 REST 接口去注册环信 ID，不建议使用客户端注册。

```objectiveC
[EMPushClient  registerWithUsername:@"name" password:@"pswd" completion:^(NSString *aUsername, EMError *aError) {
        if (!aError) {
            // 注册完成。
        } else {
          // 注册失败，aError 包含错误原因。
        }
    }];
```

#### 4. 连接服务器

```objectiveC
[EMPushClient connectWithUsername:name password:pswd completion:^(NSString *aUsername, EMError *aError) {
        if (!aError) {
            // 连接到服务器。
        } else {
          // 连接服务器失败，aError 包含错误原因。
        }
    }];
```

#### 5. 断开服务器连接

```objectiveC
[EMPushClient disConnect:YES completion:^(EMError *aError) {
        if (!aError) {
            // 断开服务器连接。
        } else {
          // 断开连接有错误，aError 包含错误原因。
        }
    }];
```

#### 6. 添加登录状态代理

添加代理的类必须实现 `EMClientDelegate`，进行代理实现。

```objectiveC
[EMPushClient addConnectDelegate:self delegateQueue:nil];
```