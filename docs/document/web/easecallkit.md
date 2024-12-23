# CallKit 使用指南

`CallKit` 是一套基于环信 IM 和声网音视频结合开发的音视频 UI 库，实现了一对一语音和视频通话以及多人音视频通话的功能。通过同一用户 ID 登录多台设备的场景下，当用户处理一台设备上的来电响铃后，其他所有设备都会同时停止响铃。

## 技术原理

使用 `CallKit` 实现实时音视频通讯的基本流程如下：

1. 调用 `init` 对 `CallKit` 进行初始化。
2. 主叫方调用 `startCall` 发起通话邀请，进行一对一或多人通话。
3. 被叫方收到 `onInvite` 后，选择接受或拒绝通话邀请。若接受邀请，则进入通话。
4. 通话结束时，SDK 触发 `onStateChange` 回调。

## 前提条件

集成该库之前，你需要满足以下条件：

- 创建 [环信应用](/product/enable_and_configure_IM.html)及[声网应用](https://doc.shengwang.cn/doc/rtc/javascript/get-started/enable-service#创建声网项目)；
- 实现环信 IM 的基本功能，包括登录、好友、群组以及会话等的集成；
- 上线前开通声网 Token 验证时，用户需要实现自己的 [App Server](https://github.com/easemob/easemob-im-app-server/tree/master/agora-app-server)，用于生成 Token。详见[创建 Token 服务及使用 App Server 生成 Token](https://doc.shengwang.cn/doc/rtc/javascript/basic-features/token-authentication)。

## 项目设置

1. 在终端上运行以下命令安装 `CallKit`：

```
npm install chat-callkit
```

2. 导入 `CallKit`：

```
import Callkit from 'chat-callkit';
```

## 实现音频和视频通话

本节介绍如何在你的项目中实现音频和视频通话。

### 初始化 `CallKit`

调用 `init` 初始化 `CallKit`。

```javascript
/**
 * 初始化 CallKit
 *
 * @param appId       声网 App ID。
 * @param agoraUid    声网用户 ID（UID）。
 * @param connection  IM SDK 连接实例。 
 */
CallKit.init(appId, agoraUid, connection);
```

### 发送通话邀请

主叫方调用 `startCall` 发送一对一或多人通话邀请。调用该方法时，需要指定通话类型。

- 一对一通话

一对一通话时，主叫方向被叫方发送短信作为通话邀请。

```javascript
let options = {
  /** 通话类型：
   * 0：一对一音频通话
   * 1：一对一视频通话
   * 2：多人视频通话
   * 3：多人音频通话
   */
  callType: 0,
  chatType: "singleChat",
  /** IM 用户 ID */
  to: "userId",
  /** 通话邀请消息 */
  message: "Join me on the call",
  /** 通话频道名称 */
  channel: "channel",
  /** 声网 token <Vg k="VSDK" /> */
  accessToken: "Agora token",
};
CallKit.startCall(options);
```

- 多人通话

在多人通话中，主叫方向群组或聊天室发送文本消息，同时向用户发送命令消息加入通话。

```javascript
let options = {
  /** 通话类型：
   * 0：一对一音频通话
   * 1：一对一视频通话
   * 2：多人视频通话
   * 3：多人音频通话
   */
  callType: 2,
  chatType: "groupChat",
  /** IM 用户 ID */
  to: ["userId"],
  /** 通话邀请消息 */
  message: "Join me on the call",
  /** 群组 ID */
  groupId: "groupId",
  /** 群组名称 */
  groupName: "group name",
  /** 声网 token <Vg k="VSDK" />*/
  accessToken: "Agora token",
  /** 通话频道名称 */
  channel: "channel",
};
CallKit.startCall(options);
```

下图为发送一对一视频通话邀请后的用户界面示例：

![img](/images/web/callkit_single_invite.png)

### 收到通话邀请

通话邀请发送后，如果被叫方在线且可以通话，将通过 `onInvite` 回调收到邀请。你可以弹出一个用户界面，让被叫方在该回调中接受或拒绝邀请。

```javascript
/**
 * 处理通话邀请。
 *
 * @param result 是否弹出用户界面，接听来电：
 *               - true：是。
 *               - false：否。这种情况下，你无需传入 token <Vg k="VSDK" />。
 * @param accessToken 声网 token <Vg k="VSDK" />。
 */
CallKit.answerCall(result, accessToken);
```

下图为收到一对一视频通话邀请后的用户界面示例：

![img](/images/web/callkit_single_receive.png)

### 多人通话中间发起邀请

在多人通话中，多个用户还可以向其他用户发送通话邀请。发送邀请后，SDK 会在发送方的客户端触发 `onAddPerson` 回调。在该回调中，你可以让发送方指定想要邀请加入多人通话的用户，然后调用 `startCall` 发出邀请。

### 监听回调事件

在通话中，你还可以监听以下回调事件：

```javascript
function Call() {
  // 处理会话状态变更。
  const handleCallStateChange = (info) => {
    switch (info.type) {
      case "hangup":
        // 挂断电话。
        break;
      case "accept":
        // 被叫方接受通话邀请。
        break;
      case "refuse":
        // 被叫方拒绝通话邀请。
        break;
      case "user-published":
        // 远端用户在通话中发布媒体流。
        break;
      case "user-unpublished":
        // 远端用户在通话中停止发布媒体流。
        break;
      case "user-left":
        // 远端用户离开通话。
        break;
      default:
        break;
    }
  };
  return <Callkit onStateChange={handleCallStateChange} />;
}
```

### 结束通话

一对一通话中，只要有一方挂断电话，通话即结束。多人通话中，只有本地用户挂断电话，通话才会结束。若本地用户挂断电话，SDK 会触发 `onStateChange` 回调，其中 `info.type` 中的值为 `hangup`。若远端用户挂断电话，SDK 触发 `onStateChange` 回调，其中 `info.type` 的值为 `user-left`。

## 后续步骤

本节介绍你在项目中实现音频和视频通话功能时采取的其他步骤。

### 使用 Video SDK Token 对用户进行身份验证

为了提升通讯安全性，声网建议你在加入通话前通过 Video SDK token 对应用用户进行身份验证。为此，你需要确保[项目的主要证书已启用](https://doc.shengwang.cn/doc/console/general/user-guides/manage_authentication#启用主要证书)。

Token 由声网提供的 token 生成器在应用服务器上生成。获取 token 后，需要在调用 `startCall` 和 `answerCall` 时将 token 传递给 callkit。关于在服务器上如何生成 Token 以及在客户端如何获取和更新 Token，详见[使用 Token 认证用户](https://doc.shengwang.cn/doc/rtc/javascript/basic-features/token-authentication)。

## 参考

本节提供了实现实时音频和视频通信功能时可以参考的其他信息。

### API 列表

`CallKit` 提供以下 API：

- 方法如下表所示：

| 方法                      | 描述                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `initWithConfig:delegate` | 初始化 `CallKit`。                                                                                        |
| `startCall`               | 开始通话。                                                                                                |
| `answerCall`              | 接听电话。                                                                                                |
| `setUserIdMap`            | 设置环信 IM 用户 ID 与声网用户 ID（UID）的映射，格式为 `{[uid1]: 'custom name', [uid2]: 'custom name'}`。 |

- 回调如下表所示：

| 事件            | 描述                               |
| --------------- | ---------------------------------- |
| `onAddPerson`   | 当用户邀请其他用户加入通话时触发。 |
| `onInvite`      | 收到通话邀请时触发。               |
| `onStateChange` | 当通话状态变更时发生。             |

- 属性如下表所示：

| 属性            | 描述                     |
| --------------- | ------------------------ |
| `contactAvatar` | 一对一通话时显示的头像。 |
| `groupAvatar`   | 多人通话时显示的头像。   |
| `ringingSource` | 铃声文件。               |
