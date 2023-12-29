# 跑通示例项目

环信提供一个开源的 ChatroomUIKit 示例项目，演示了如何使用该 UIKit 快速搭建聊天室页面，实现完整业务。

本文展示如何编译并运行 iOS 平台的聊天室 UIKit 示例项目。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- Xcode 14.0 或以上版本；
- iOS 13.0 或以上版本；
- 项目中已设置有效的开发者签名。

## 操作步骤

### 第一步 下载 ChatroomUIKit 示例代码

点击 [github源码](https://github.com/easemob/UIKit_Chatroom_ios)下载示例代码到本机。

### 第二步 执行 pod 命令

1. 点击打开 **UIKit_Chatroom_ios** 文件夹。

2. 将 **Example** 文件夹拖拽到终端。

3. 在终端中输入如下命令，然后回车。

```
 pod install --repo-update
```

### 第三步 编译

编译时，需要传入 App Key、用户 ID 和用户 token。因此，编译前，你需要在[环信控制台](https://console.easemob.com/user/login)上创建有效的环信即时通讯 IM 开发者账号，并获取 App Key，[创建环信 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)。此外，还需[创建聊天室](/product/enable_and_configure_IM.html#创建聊天室)。

1. 使用 Xcode 打开 .xcworkspace 工程文件。

2. 在键盘上按下 **cmd**+**B** 进行编译，编译结果会有如下报错。

![img](@static/images/uikit/chatroomios/buildError.png)

   将获取的 App Key、用户 token 和用户 ID 分别填入上图中的 `appKey`、`chatToken` 和 `userId` 字段。

3. 在键盘上按下 **cmd**+**B** 编译程序即可跑通项目。

4. 在键盘上按下 **cmd**+**R**，选中设备运行项目，查看运行结果。

### 第四步 体验项目

1. 若仅体验 UI，点击 **UIComponent**。 

  这种情况下，第三步编译过程中的 `appKey`、`chatToken` 和 `userId` 字段可以填入空字符串。体验过程中，你可以选择是否显示 UI 功能的某些配置项。

2. 对于 UI 和业务体验（例如，发送礼物、聊天室成员管理或消息操作），点击 **UI&Business**。 

   这种情况下，第三步编译过程中的 `appKey`、`chatToken` 和 `userId` 字段需传入环信控制台的配置。

## 注意事项  

示例工程仅用于快速跑通流程，暂时未提供多成员交互测试。

## 编译常见问题

若 Xcode 15 编译出现以下报错 **Sandbox: rsync.samba(47334) deny(1) file-write-create...**，你可以在 **Build Setting** 中搜索 **ENABLE_USER_SCRIPT_SANDBOXING**，将 **User Script Sandboxing** 的设置改为 **NO**。