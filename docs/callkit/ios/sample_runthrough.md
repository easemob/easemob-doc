# 运行示例项目

本文帮助你快速集成和运行环信 CallKit（基于环信即时通讯 IM SDK V4.16.0 及其以上），实现一对一音视频通话和群组音视频通话功能。

## 开发环境要求

- Xcode 16.0 及以上版本 
- 最低支持系统版本：iOS 15.0
- 已为你的项目设置有效的开发者签名
- CocoaPods v1.14.3 及以上版本

## 前提条件

在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
1. [注册环信账号](/product/console/account_register.html#注册账号)。
2. [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
3. [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID 和 [用户 Token](/product/console/operation_user.html#查看用户-token)。
4. [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID。将用户加入群组。
5. [开通音视频服务](product_activation.html)。

## 操作步骤

// TODO：添加下载示例项目？



### 步骤 2 设置 App Key

在 `PublicDefines.swift` 中填写你的应用的 App Key：

```Swift
let AppKey: String = <#AppKey#>
```

### 步骤 3

在终端 cd 到 `podfile` 所在的文件目录，复制代理到终端，执行 `pod install` 命令，等待成功后点击运行即可。// TODO：这里的运行是个按钮？

```
pod install
```

### 步骤 4 运行项目

1. 登录：在登录界面输入用户 ID 和 [用户 Token](/product/console/operation_user.html#查看用户-token)，然后点击 **Login**。  
2. 发起通话：
   - 选择呼叫类型，输入呼叫用户的用户 ID，点击呼叫。
   - 一对一语音通话：选择 **audio**，输入呼叫用户的用户 ID，点击 **call**。
   - 一对一视频通话：选择 **video**，输入呼叫用户的用户 ID，点击 **call**。
   - 群组通话：选择 **group**，输入群组 ID，点击 **call**。

// TODO：下面这两个是否需要？
3. 在弹出的页面中授权必要权限（摄像头、麦克风、悬浮窗等）。
4. 点击 **log** 退出登录。

![img](/images/callkit/ios/example.png)