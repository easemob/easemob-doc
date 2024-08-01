# 客户端跑通示例项目

通过配置服务端和客户端，利用环信即时通信 IM 服务器回调功能，在 IM 中引入 AI 服务（以 miniMax 中文大语言模型为例），创建机器人账号，从而跑通示例项目。

本文介绍通过跑通示例项目如何配置客户端，跑通示例项目。

## 环境准备

1. 开发环境

- 工具：Android Studio
- 系统：MacOS
- 代码：Java

2. 运行环境

系统: Android 6.0 +

## 下载代码

通过 [GitHub 链接下载客户端代码](https://github.com/easemob/Easemob-AIGCService-Example/tree/dev/AIGCService-AndroidClient)。

## 参数配置

使用 `AndroidStudio` 运行项目，打开 `com.imchat.chanttyai/base/Constants.java` 文件，只需将 `APP_KEY` 及 `HTTP_HOST` 参数分别修改为环信 App Key 和服务端部署域名或 IP 地址。

![img](@static/images/aigc/parameter_configure.png)

## 运行示例项目

跑通示例项目，跑通后的界面以及聊天界面如下图所示：

- 启动页面和机器人列表用户界面如下图所示：
  
<img src=@static/images/aigc/ai_start.png  title=启动页面 width="200"/>&nbsp;&nbsp;
<img src=@static/images/aigc/ai_user_list.png  title="机器人用户列表" width="200"/>

- 聊天页面如下图所示：
  
<img src=@static/images/aigc/ai_chat1.png  title="聊天页面" width="200"/>&nbsp;&nbsp;
<img src=@static/images/aigc/ai_chat2.png  title="聊天页面" width="200"/>