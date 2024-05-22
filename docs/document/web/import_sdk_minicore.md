# 按需导入 SDK

<Toc />

SDK 提供了灵活的模块化设计，允许开发者根据需求引入功能模块，并将其注册到 miniCore 中使用。

miniCore 是一个基座，支持登录登出和发送消息等[基础功能](https://doc.easemob.com/jsdoc/classes/Connection.Connection-1.html)，而且包含消息对象。因此，若只使用收发消息功能，则只需引入 miniCore。若使用其他功能，miniCore 支持使用插件的方式引入其他功能模块。按需引入模块的方式实现了不同模块的灵活组合，从而避免不必要的代码加载，减小了应用程序的体积。

:::tip
只有按需导入 SDK 的方式才支持[本地会话管理功能](conversation_local.html)。
:::

## 支持按需导入的 SDK 模块

| 功能        | 导入文件     | 使用方式          |
| :--------------- | :--------------------------- | :---------------- |
| 联系人和消息管理 | import \* as contactPlugin from "easemob-websdk/contact/contact";     | miniCore.usePlugin(contactPlugin, "contact");         |
| 群组             | import \* as groupPlugin from "easemob-websdk/group/group";    | miniCore.usePlugin(groupPlugin, "group");             |
| 聊天室           | import \* as chatroomPlugin from "easemob-websdk/chatroom/chatroom";  | miniCore.usePlugin(chatroomPlugin, "chatroom");       |
| 子区             | import \* as threadPlugin from "easemob-websdk/thread/thread";    | miniCore.usePlugin(threadPlugin, "thread");           |
| 翻译             | import \* as translationPlugin from "easemob-websdk/translation/translation"; | miniCore.usePlugin(translationPlugin, "translation"); |
| 在线状态订阅     | import \* as presencePlugin from "easemob-websdk/presence/presence";   | miniCore.usePlugin(presencePlugin, "presence");       |

## 按需导入 SDK 模块

### 1. 安装 SDK

首先，通过 npm、yarn 或者其他包管理工具进行安装 SDK。

```bash
# npm
npm install easemob-websdk

# yarn
yarn add easemob-websdk
```

### 2. 引入 SDK 和所需模块

根据项目需求引入相应的功能模块。例如，引入用户关系模块：

```javascript
import MiniCore from "easemob-websdk/miniCore/miniCore";
import * as contactPlugin from "easemob-websdk/contact/contact";
```

### 3. 注册模块到 miniCore

将引入的功能模块注册到 miniCore 中：

```javascript
const miniCore = new MiniCore({
  appKey: "your appKey",
});

// "contact" 为固定值
miniCore.usePlugin(contactPlugin, "contact");
```

### 4. 使用注册的模块

注册所需模块后，即可在项目中使用这些模块提供的功能：

```javascript
// 获取联系人列表
miniCore.contact.getContacts();
```

## 与整体导入方式的接口差别

通过按需导入的 SDK 与[整体导入](overview.html#引入-sdk)的 SDK 在接口使用方面类似，唯一差别是后者将所有方法都挂载到 connection 类, 而使用 miniCore 时，基础的登录登出方法挂载在 miniCore 上，其他功能模块上的方法挂载在相应的模块上。

本节以登录/登出、事件监听和发送消息为例进行说明。

### 登录与登出

示例代码如下：

```javascript
// 登录
miniCore.open({
  username: "username",
  password: "password",
  // accessToken: 'token'
});

// 登出
miniCore.close();
```

### 事件监听

示例代码如下：

```javascript
miniCore.addEventHandler("handlerId", {
  onTextMessage: (message) => {
    console.log(message);
  },
});
```

### 发送消息

示例代码如下：

```javascript
import { EasemobChat } from "easemob-websdk";
//发送文本消息
const sendTextMsg = () => {
  const option: EasemobChat.CreateTextMsgParameters = {
    chatType: "singleChat",
    type: "txt",
    to: "to",
    msg: "hello",
  };
  const msg = miniCore.Message.create(option);
  miniCore
    .send(msg)
    .then((res: any) => {
      console.log("发送成功", res, msg);
    })
    .catch((err: any) => {
      console.log("发送失败", err);
    });
};
```
