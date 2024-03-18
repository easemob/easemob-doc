# 桌面端集成说明

桌面端 SDK 为用户在 Windows/Mac OS 平台上进行开发的 js 接口及二进制文件，开发框架使用 electron 。

目前支持登录、注册、单聊、群聊、聊天室、文本消息、图片、语音、位置等消息以及透传消息，还可以实现好友管理、群组管理等功能。

**注意：** 之前的 Windows SDK 将不再维护，同时对应的 demo ，文档也一并下线。如需查看旧版文档，点击[Windows SDK 集成说明](https://docs-im.easemob.com/im/windows/intro/integration)

------

## 准备

### 开发环境需求

#### 操作系统

- win7/win8/win10 64位操作系统

- mac OS 10.10 及以上

#### 开发工具

- nodejs

版本 10.0 以上，[官网地址](http://nodejs.cn/)

- electron

版本 4.0 以上，[官网地址](https://electronjs.org/),nodejs 安装完成后，可以在命令行使用 npm 命令安装，安装命令：

```
npm install electron -g
```

------

## SDK 目录结构

Windows SDK 目录结构如下。使用时将 SDK 拷贝到工程目录下。

```
|-node
  |-modules
    |-message
  index.js
  load.js
|-easemob
  easemobMac.node
  easemobWin.node
  libcurl.dll
  libcurl.lib
  libcrypto.1.0.0.dylib
```

------

## SDK 模块介绍

SDK 采用模块化设计，每一模块的功能相对独立和完善，用户可以根据自己的需求选择使用下面的模块：

![img](@static/images/electron/sdk_design.png)

### 模块化设计

- EMClient

SDK 的入口，主要完成登录、退出、注册、配置管理等功能，管理连接监听模块 EMConnectionListener 。也是获取其他模块的入口。

- EMChatManager

管理消息的收发，完成会话管理等功能,管理会话监听模块 EMChatManagerListener 。

- EMContactManager

负责好友的添加删除，黑名单的管理等功能，管理好友变更监听模块 EMContactListener。

- EMGroupManager

负责群组的管理，创建、解散群组，管理群组成员等功能，管理群组监听模块 EMGroupManagerListener。

- EMChatroomManager

负责聊天室的查询、加入、退出功能管理，管理聊天室监听模块 EMChatroomManagerListener。

------

## SDK 对象说明

SDK 中使用到的对象包括：

- 系统配置信息 EMChatConfigs

- 群组信息 EMGroup

- 群组配置信息 EMMucSetting

- 群文件信息 EMMucSharedFile

- 聊天室信息 EMChatroom

- 会话信息 EMConversation

- 消息 EMMessage

- 文本消息体 EMFileMessageBody

- 图片消息体 EMImageMessageBody

- 文件消息体 EMTextMessageBody

- 命令消息体 EMCmdMessageBody

具体接口详见 [API 参考](https://downloads.easemob.com/doc/desktop/apidoc/index.html)。

### 依赖模块安装

electron 开发中依赖的模块及版本写在 package.json 中，安装依赖模块时，在 sdkdemoapp_windows 目录下使用命令：

```
npm install
```

如果安装过程中出现 error，可能是网络原因，可以选择使用 yarn 镜像下载安装：

```
npm install -g yarn
yarn install
```

------

### 软件调试

首先需要编译软件，运行命令：

```
npm run build:app
```

调试过程需要使用热启动，运行命令：

```
npm run hot-server
```

然后另启动一个命令行工具，运行命令：

```
npm run start:hot
```

可启动软件。调试过程中修改代码后，hot-server 会自动编译新代码，在界面上使用 F5 按键可以立即刷新界面，应用新代码。在界面上点击鼠标右键，弹出右键菜单，点击检查元素，可以打开开发者工具，查看 console 控制台输出，在 Source 中加断点调试。