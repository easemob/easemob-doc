# 运行示例项目

本文帮助你快速集成和运行环信 CallKit，实现一对一音视频通话和群组音视频通话功能。

## 开发环境 // TODO：推荐环境还是最低要求？

- Xcode 16.0 及以上版本 
- 最低支持系统版本：iOS 15.0
- 已为你的项目设置有效的开发者签名
- CocoaPods v1.14.3 及以上版本

// TODO：推荐流程？
第一步：开通音视频服务
第二步：下载示例代码
第三步：编译/项目配置？（其实是设置 App Key+自定义用户信息，不需要克隆或下载项目？）
第四步：运行项目

## 前提条件

在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
1. [注册环信账号](/product/console/account_register.html#注册账号)。
2. [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
3. [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID。
4. [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID。将用户加入群组。

## 操作步骤

### 步骤 1 开通音视频服务

使用环信提供的音视频服务前，你需要首先在环信控制台为应用 [开通音视频服务](service_activation.html)。// TODO：最终替换

### 步骤 2 设置 App Key

在 `Appdelegate.swift` 中填写你的应用的 App Key：

```Swift
let option = ChatOptions(appkey: <#环信AppKey#>)
```

### 步骤 3 （可选）自定义用户信息

若在通话中使用自定义昵称或头像，在 `ViewController.swift` 中的 `loginAction` 方法中填入当前用户的昵称和头像，即 `profile.nickname` 和 `profile.avatarURL`。

### 步骤 4 运行项目

1. 运行项目，在登录界面输入用户 ID 和用户 Token，然后点击 **登录**。  // TODO：不写如何运行项目？添加代码？

2. 选择呼叫类型，输入呼叫用户的用户 ID，点击呼叫。

// TODO：请提供截图

// TODO：包含这几个步骤？