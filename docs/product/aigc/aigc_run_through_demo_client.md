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

3. 项目包含内容

- Android Project
- 安装包

## 参数配置

使用 `AndroidStudio` 运行项目，打开 `com.imchat.chanttyai/base/Constants.java` 文件，只需将 `APP_KEY` 及 `HTTP_HOST` 参数分别修改为环信 App Key 和服务端部署域名或 IP 地址。

![img](@static/images/aigc/parameter_configure.png)

## 运行示例项目

部署环境准备后，通过 [GitHub 链接下载客户端代码](https://github.com/easemob/Easemob-AIGCService-Example/tree/dev/AIGCService-AndroidClient)，跑通示例项目。