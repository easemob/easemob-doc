# 在多个设备上登录

<Toc />

环信即时通讯 IM 支持同一账号在多个设备上登录，所有已登录的设备同步以下信息和操作：

- 消息：包括在线消息、离线消息、推送通知（若开启了第三方推送服务，离线设备收到）以及对应的回执和已读状态等；
- 好友和群组相关操作；
- 子区相关操作；
- 会话相关操作。

多端登录时，即时通讯 IM 每端默认最多支持 4 个设备同时在线。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。

你可以在环信控制台的**功能配置** > **功能配置总览**页面的**基础功能**页签下点击**多端多设备在线**操作栏中的**设置**，在弹出的对话框中设置设置各端设备的数量：

![img](@static/images/common/multidevice_device_count.png)

单端和多端登录场景下的互踢策略和自动登录时安全检查如下：

<html>
<head>
<meta charset="utf-8">
<title>无标题文档</title>
</head>

<body>
<table width="1060" height="327" border="1">
  <tbody>
    <tr>
      <td width="109" height="49">单端/多端登录</td>
      <td width="519">互踢策略</td>
      <td width="410">自动登录安全检查</td>
    </tr>
    <tr>
      <td height="52">单端登录</td>
      <td>新登录的设备会将当前在线设备踢下线。</td>
      <td rowspan="2">设备支持自动登录时，若设备下线后自动重连时需要判断是否踢掉当前在线的最早登录设备，请联系环信商务。 </td>
    </tr>
    <tr>
      <td height="156">多端登录</td>
      <td>若一端的登录设备数量达到了上限，最新登录的设备会将该端最早登录的设备踢下线。&lt;br/&gt;即时通讯 IM 仅支持同端互踢，不支持各端之间互踢。</td>
    </tr>
  </tbody>
</table>
</body>
</html>

## 技术原理

用户在 React Native 端上初始化 SDK 时会生成登录 ID 用于在多设备登录和消息推送时识别设备，并将该 ID 发送到服务器。服务器会自动将新消息发送到用户登录的设备，可以自动监听到其他设备上进行的操作。环信即时通讯 IM React Native SDK 提供如下方法实现多个设备上的互动功能

- 获取当前用户的其他登录设备的登录 ID 列表；
- 获取指定账号的在线登录设备列表；
- 强制指定账号从单个设备下线；
- 强制指定账号从所有设备下线；
- 设置登录设备的名称；
- 设置登录设备的平台；
- 多端同步通知。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 的套餐包，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 实现方法

### 获取当前用户的其他登录设备的登录 ID 列表

你可以调用 `getSelfIdsOnOtherPlatform` 方法获取其他登录设备的登录 ID 列表。

选择目标登录 ID 作为消息接收方发出消息，则其他端均会收到该消息，实现不同设备之间的消息同步。

```typescript
ChatClient.getInstance()
  .contactManager.getSelfIdsOnOtherPlatform()
  .then((ids) => {
    console.log("get ids success.", ids);
    // content: 设置文本内容
// targetId: 来自 `getSelfIdsOnOtherPlatform` 方法的异步结果
// chatType: 会话类型
const targetId = ids[0];
const msg = ChatMessage.createTextMessage(targetId, content, chatType);
// 执行消息发送
ChatClient.getInstance()
  .chatManager.sendMessage(msg！, new ChatMessageCallback())
  .then(() => {
    // 消息发送动作完成，会在这里打印日志。
    // 消息的发送结果通过回调返回
    console.log("send message operation success.");
  })
  .catch((reason) => {
    // 消息发送动作失败，会在这里打印日志。
    console.log("send message operation fail.", reason);
  });
  })
  .catch((reason) => {
    console.log("get ids fail.", reason);
  });

```

### 获取指定账号的在线登录设备列表

你可以调用 `getLoggedInDevicesFromServer` 方法从服务器获取指定账号的在线登录设备的列表。调用该方法后，在 SDK 返回的信息中，`ChatDeviceInfo` 中的 `deviceName` 属性表示自定义设备名称，若未自定义设备名称，返回设备型号。

```typescript
// userId: 用户 ID.
// pwdOrToken: 密码或者token
// isPassword: 是否使用密码登录
ChatClient.getInstance()
  .getLoggedInDevicesFromServer(userId, pwdOrToken, isPassword)
  .then((result) => {
    console.log("devices list:", result);
  })
  .catch((error) => {
    console.warn(error);
  });
```

### 设置登录设备的名称

即时通讯 IM 自 1.2.0 版本开始支持自定义设置登录设备的名称。这样在多设备场景下，若有设备被踢下线，你就能知道是被哪个设备挤下线的。设备名称 `deviceName` 可以通过 `getLoggedInDevicesFromServer` 返回对象 `ChatDeviceInfo` 获取。如果没有设置则返回默认值，即设备型号。

:::notice
登录成功后才会将该设置发送到服务器。
:::

```typescript
// customDeviceName: 自定义设备名称。
ChatClient.getInstance()
  .init(
    new ChatOptions({
      appKey: appKey,
      customDeviceName: customDeviceName,
    })
  )
  .then(() => {
    console.log("init success");
  })
  .catch((reason) => {
    console.error(reason);
  });
```

### 设置登录设备的平台

即时通讯 IM 自 1.2.0 版本开始支持自定义设置登录设备的平台，例如将 Android 手机和 Android 系统的平板电脑设置为两个单独的平台，方便用户精细化控制同一平台的登录设备数量及平台间互踢等行为。

你可以按照以下步骤设置登录设备所属的平台：

1. 在环信控制台的**功能配置** > **功能配置总览**页面，点击**基础功能**页签，然后点击**多端多设备在线**对应的**设置**。在弹出的对话框中点击 **新增自定义平台**，在**添加自定义平台**对话框中设置**设备平台**和**设备数量**。

**设备平台**的取值范围为 [1,100]，**设备数量**的取值范围为 [0,4]。

![img](@static/images/common/multidevice_device_platform.png)

2. 初始化 SDK。确保该方法中的 `customOSType` 参数的值与环信控制台的**添加自定义平台**对话框中设置的**设备平台**的值相同。

:::notice
登录成功后才会将该设置发送到服务器。
:::

```typescript
// customOSType: 自定义设备类型。取值范围 [1,100]。
ChatClient.getInstance()
  .init(
    new ChatOptions({
      appKey: appKey,
      customOSType: customOSType,
    })
  )
  .then(() => {
    console.log("init success");
  })
  .catch((reason) => {
    console.error(reason);
  });
```

### 强制指定账号从单个设备下线

你可以调用 `kickDevice` 方法将指定账号从单个登录设备踢下线。调用该方法前，你需要首先通过 `ChatClient#getLoggedInDevicesFromServer` 方法获取设备 ID。

:::notice
不登录也可以使用该接口。
:::

```typescript
// resource: 可以通过 `getLoggedInDevicesFromServer` 获取。
const deviceInfo = await ChatClient.getInstance().getLoggedInDevicesFromServer(
  userId,
  pwdOrToken,
  isPassword
);
ChatClient.getInstance()
  .kickDevice(userId, pwdOrToken, deviceInfo.resource, isPassword)
  .then(() => {
    console.log("success");
  })
  .catch((error) => {
    console.warn(error);
  });
```

### 强制指定账号从所有设备下线

你可以调用 `kickAllDevices` 方法通过传入用户 ID 和登录密码或用户 token 将指定账号从所有登录设备踢下线。

:::notice
不登录也可以使用该接口。
:::

```typescript
ChatClient.getInstance()
  .kickAllDevices(userId, pwdOrToken, isPassword)
  .then(() => {
    console.log("success");
  })
  .catch((error) => {
    console.warn(error);
  });
```

### 多端同步通知

账号 A 同时在设备 A 和设备 B 上登录，账号 A 在设备 A 上进行一些操作，设备 B 上会收到这些操作对应的通知。

你需要先实现 `ChatMultiDeviceEventListener` 监听其他设备上的操作，再设置多设备监听器。

```typescript
let listener: ChatMultiDeviceEventListener = new (class
  implements ChatMultiDeviceEventListener
{
  onContactEvent?(
    event?: ChatMultiDeviceEvent,
    target?: string,
    ext?: string
  ): void {
    // 联系人相关多设备通知。
  }

  onGroupEvent?(
    event?: ChatMultiDeviceEvent,
    target?: string,
    usernames?: Array<string>
  ): void {
    // 群组相关多设备通知。
  }

  onThreadEvent?(
    event?: ChatMultiDeviceEvent,
    target?: string,
    usernames?: Array<string>
  ): void {
    // 子区消息多设备通知。
  }

  onMessageRemoved?(convId?: string, deviceId?: string): void {
    // 漫游消息删除通知。
  }

  onConversationEvent?(
    event?: ChatMultiDeviceEvent,
    convId?: string,
    convType?: ChatConversationType
  ): void {
    // 会话变更通知。
  }
})();

// 清空监听器
ChatClient.getInstance().removeAllMultiDeviceListener();

// 添加监听器
ChatClient.getInstance().addMultiDeviceListener(listener);
```