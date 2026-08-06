# uni-app 构建移动 App 和小程序

## 概述

本文面向 HBuilderX 4.x / 5.x 的 uni-app Vue 3 项目，介绍如何集成当前版本的环信 Web SDK，并构建 Android 和 iOS 原生应用。不同 HBuilderX 补丁版本提供的宿主 API 可能存在差异，最终应以目标版本和真机验证结果为准。

当前 SDK 使用 `ChatClient.init()` 创建客户端，通过 Manager 注册消息、好友、群组等领域能力。

uni-app 原生 App 中，SDK 通过平台适配层调用 `uni.request`、`uni.connectSocket`、`uni.uploadFile`、文件系统、网络状态和应用前后台等宿主能力。

## 前置条件

开始前，请准备：

- 最新稳定版 HBuilderX；
- DCloud 开发者账号；
- 环信账号以及已经创建的应用，参见 [注册并创建应用](/product/console/app_create.html)；
- 应用的 `appKey`；
- 由业务服务端获取的用户 ID 和用户 Token；
- 用于运行和调试应用的 Android 或 iOS 设备。

:::warning
用户 Token 应由业务服务端获取，不要将 App Secret、固定测试 Token 或其他敏感凭证写入前端源码。
:::

## 快速开始

建议按照以下流程完成首次接入：

1. 安装 HBuilderX，并登录 DCloud 开发者账号；
2. 创建 uni-app Vue 3 项目，或打开 SDK 仓库中的 `uniapp-demo/`；
3. 安装 `easemob-websdk`；
4. 使用 `ChatClient.init()` 初始化 SDK，并注册 `ChatManager`；
5. 注册连接和消息事件；
6. 使用用户 ID 和 Token 登录；
7. 在真机上验证消息收发和附件上传；
8. 使用 HBuilderX 进行云打包或离线打包。

## 运行配套 Demo

当前 SDK 仓库提供 `uniapp-demo/`，覆盖以下主路径：

- SDK 初始化、登录和登出；
- 文本、图片、语音、视频、文件、位置、命令和自定义消息收发；
- uni-app 请求、WebSocket、上传、存储、文件和运行时适配；
- 合并消息下载与解析。

然后使用 HBuilderX 打开 `uniapp-demo/`，选择 **运行** > **运行到手机或模拟器**，再选择 Android 或 iOS 设备。

## 集成 SDK

在已有 uni-app 项目中安装 SDK：

```bash
npm install easemob-websdk
```

通过包根入口导入需要的公开能力：

```typescript
import { ChatClient, ChatManager } from 'easemob-websdk';
```

## 初始化 SDK

### 最小消息能力配置

如果应用只验证登录和消息收发，可以关闭登录后的会话、好友和群组数据同步，只配置 REST 与消息 WebSocket 地址：

```typescript
import { ChatClient, ChatManager } from 'easemob-websdk';

const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager],
  enableSyncData: [],
});
```

`ChatClient` 是单例。同一个进程中重复调用 `ChatClient.init()` 时必须使用相同配置；如果需要修改 `appKey` 或服务地址，应重启应用后重新初始化。

### 数据同步配置

`enableSyncData` 控制登录后自动同步的数据类型，可选值为：

- `conversation`：会话列表；
- `contact`：好友；
- `group`：已加入群组。

当前 SDK 未显式传入 `enableSyncData` 时，默认启用 `conversation`。如果使用固定地址模式并启用数据同步，应配置 `syncWsUrl`；只需要消息收发时，建议显式设置 `enableSyncData: []`。

好友和群组能力还需要注册对应 Manager。例如：

```typescript
import {
  ChatClient,
  ChatManager,
  ContactManager,
  GroupManager,
  UserInfoManager,
} from 'easemob-websdk';

const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager, ContactManager, GroupManager, UserInfoManager],
  enableSyncData: ['conversation', 'contact', 'group'],
});
```

## 注册事件

使用唯一 ID 注册事件处理器，并在页面或应用销毁时使用相同 ID 移除：

```typescript
client.addEventHandler('uniapp-im', {
  onConnecting: () => {
    console.log('IM 连接中');
  },
  onConnected: () => {
    console.log('IM 已连接');
  },
  onDisconnected: event => {
    console.warn('IM 连接断开', event);
  },
  onReconnectFailed: event => {
    console.error('IM 自动重连失败', event);
  },
  onTokenWillExpire: () => {
    // 从业务服务端获取新 Token，然后调用 client.renewToken(...)。
  },
  onTokenExpired: () => {
    // Token 已过期，需要重新获取 Token 并登录。
  },
});

// 页面或应用销毁时移除。
client.removeEventHandler('uniapp-im');
```

SDK 已通过 uni-app 平台适配层监听网络变化和应用前后台状态，不需要业务代码直接操作底层 WebSocket。

## 登录与登出

```typescript
try {
  await client.login({
    userId: 'user_1',
    token: 'token-returned-by-your-server',
  });
  console.log('登录成功', client.getConnectionState());
} catch (error) {
  console.error('登录失败', error);
}
```

退出登录：

```typescript
await client.logout();
```

登录失败会通过 `login()` 的 Promise 抛出错误；连接变化、断线和重连结果通过事件回调通知。

## 发送消息

### 文本消息

消息能力位于 `client.chatManager`。先创建消息，再发送：

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'user_2',
  conversationType: 'singleChat',
  content: 'hello',
});

const sentMessage = await client.chatManager.sendMessage(message);
console.log('发送成功', sentMessage);
```

`conversationType` 可取：

- `singleChat`：单聊，`conversationId` 为对方用户 ID；
- `groupChat`：群聊，`conversationId` 为群组 ID；
- `chatRoom`：聊天室，`conversationId` 为聊天室 ID。

### 图片和文件消息

uni-app 选择文件后，将临时路径及文件信息作为跨端文件对象传给 SDK。附件会在 `sendMessage()` 阶段由 SDK 自动上传，无需业务代码先上传到环信服务器。

```typescript
uni.chooseImage({
  count: 1,
  success: async result => {
    const path = result.tempFilePaths[0];
    const fileInfo = result.tempFiles[0];
    if (!path || !fileInfo) {
      return;
    }

    const message = client.chatManager.createImageMessage({
      conversationId: 'user_2',
      conversationType: 'singleChat',
      filename: path.split('/').pop() || 'image.jpg',
      filetype: 'image/jpeg',
      data: {
        path,
        name: path.split('/').pop() || 'image.jpg',
        type: 'image/jpeg',
        size: fileInfo.size,
      },
    });

    await client.chatManager.sendMessage(message);
  },
});
```

语音、视频和文件消息分别使用 `createVoiceMessage()`、`createVideoMessage()` 和 `createFileMessage()` 创建。不同 uni-app 运行端的文件选择 API 不完全一致，应以目标端实际支持的 `uni.chooseImage`、`uni.chooseVideo`、录音管理器和文件选择能力为准。


## 打包发布

HBuilderX 支持云打包和离线打包两种方式。

### 打包前检查

打包前确认：

- `manifest.json` 中的应用名称、版本号、应用标识和 Vue 版本；
- App 图标和启动页；
- Android 包名、签名和系统权限；
- iOS Bundle ID、证书、描述文件和系统权限说明；
- 相机、麦克风、相册、文件和定位等业务实际使用的权限；
- 生产环境 `appKey`、REST、消息 WebSocket，以及按需使用的数据同步地址；
- Android 与 iOS 网络安全策略允许访问 `https://`、`wss://` 服务；
- Token 由业务服务端获取，前端包内不包含 App Secret；
- 真机已验证登录、断网重连、前后台切换、消息收发和附件上传。

### 云打包

在 HBuilderX 中选择 **发行** > **原生 App-云打包**，根据页面提示完成 Android 或 iOS 配置。

### 离线打包

需要修改原生工程、集成原生插件或进行深度定制时，在 HBuilderX 中选择 **发行** > **生成本地打包 App 资源**，再按照 DCloud 对应版本的原生 App 离线打包指南操作。

### 发布前验证

安装打包后的应用，并在真机上验证登录、断网重连、前后台切换、消息收发和附件上传等功能。

## 兼容性说明

- uni-app H5、小程序和原生 App 的文件、上传、WebSocket 及文件系统能力存在差异，应分别进行真机验证；
- Android 和 iOS 应优先使用 `https://` 与 `wss://` 地址，避免系统网络安全策略拦截明文请求；
- 不要只依赖 HBuilderX 标准运行基座验证原生插件和权限，发布前应使用自定义基座或正式包验证；
- 文件选择能力在不同平台并不完全一致，必要时使用条件编译提供平台专属实现；
- 应在应用销毁时移除事件处理器，避免页面重复进入后出现重复回调。

## 常见问题

#### 为什么初始化后修改地址没有生效？

`ChatClient` 是单例，重复初始化时配置必须一致。修改 `appKey` 或服务地址后，请重启应用并重新初始化。

#### 为什么固定地址模式下会话同步不可用？

未传 `enableSyncData` 时默认同步会话。如果只需要消息能力，设置 `enableSyncData: []`；如果需要会话、好友或群组同步，请为固定地址模式配置 `syncWsUrl`，并注册相应 Manager。

#### 为什么原生 App 中提示缺少 request、socket 或 upload 能力？

确认初始化时传入了 `platformAdapterOptions.runtimeInput: { uni }`，并确认当前运行端提供 `uni.request`、`uni.connectSocket` 和 `uni.uploadFile`。附件发送还需要对应的文件系统和图片处理能力。

#### 为什么附件消息创建成功但发送失败？

检查传入的 `data.path` 是否仍然有效、应用是否具有文件访问权限，以及当前运行端是否支持 `uni.uploadFile`。临时文件可能在应用重启或系统清理后失效，应在选择文件后及时发送。

## 参考

- [环信 SDK 下载页面](https://www.easemob.com/download/im#uni-app)
- [HBuilderX 官网](https://www.dcloud.io/hbuilderx.html)
- [DCloud 开发者中心](https://dev.dcloud.net.cn/)
- [uni-app 文档](https://uniapp.dcloud.net.cn/)
