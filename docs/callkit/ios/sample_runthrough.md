# 运行示例项目

本文帮助你快速集成和运行环信 CallKit（基于环信即时通讯 IM SDK V4.16.0 或以上版本），实现一对一音视频通话和群组音视频通话功能。

## 开发环境要求

- Xcode 16.0 或以上版本 
- 最低支持系统版本：iOS 15.0
- 已为你的项目设置有效的开发者签名
- CocoaPods v1.14.3 或以上版本

## 前提条件

在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
1. [注册环信账号](/product/console/account_register.html#注册账号)。
2. [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
3. [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID 和 [用户 Token](/product/console/operation_user.html#查看用户-token)。
4. [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID，将用户加入群组。
5. [开通音视频服务](product_activation.html)。

## 操作步骤

### 步骤 1 配置项目 

在 [Github](https://github.com/easemob/easemob-callkit-iOS) 中克隆或下载代码。

```bash
git clone https://github.com/easemob/easemob-callkit-iOS 
```

### 步骤 2 设置 App Key

在 `PublicDefines.swift` 中填写你的应用的 App Key：

```Swift
let AppKey: String = <#AppKey#>
```

### 步骤 3 安装本地依赖

在终端使用 cd 命令到 `podfile` 所在的文件目录下，执行 `pod install` 命令，等待成功后点击 **运行**。

```
pod install
```

### 步骤 4 运行项目

1. 登录：在登录界面输入用户 ID 和 [用户 Token](/product/console/operation_user.html#查看用户-token)，然后点击 **Login**。  
2. 发起通话：
   - 一对一语音通话：选择 **audio**，输入呼叫用户的用户 ID，点击 **call**。
   - 一对一视频通话：选择 **video**，输入呼叫用户的用户 ID，点击 **call**。
   - 群组通话：选择 **group**，输入群组 ID，点击 **call**。

你可以点击 **log** 查看 CallKit 相关日志，搜索 `EaseCallUIKit` 过滤 CallKit 日志。

// TODO：作图

<img src="/images/callkit/ios/example.png" width="400">