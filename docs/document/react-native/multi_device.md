# 在多个设备上登录

<Toc />

即时通讯 IM 支持同一账号在多个设备上登录，使用该服务前，你需要在[环信即时通讯控制台](https://console.easemob.com/user/login)的 **即时通讯** > **功能配置** > **功能配置总览** > **基础功能** 页面上查找**多端多设备在线**，开启该功能。

多端多设备登录场景下，所有已登录的设备同步以下信息和操作：

- 消息：包括在线消息、离线消息、推送通知（若开启了第三方推送服务，离线设备收到）以及对应的回执和已读状态等；
- 好友和群组相关操作；
- 子区相关操作；
- 会话相关操作。

多端登录时，即时通讯 IM 每端默认最多支持 4 个设备同时在线。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。你可以在环信控制台的**基础功能**页签下点击**多端多设备在线**操作栏中的**设置**，在弹出的对话框中设置各端设备的数量：

![img](/images/common/multidevice_device_count.png)

单端和多端登录场景下的互踢策略和自动登录时安全检查如下：

<table width="807" height="327" border="1">
  <tbody>
    <tr>
      <td width="109" height="49">单端/多端登录</td>
      <td width="384">互踢策略</td>
      <td width="292">自动登录安全检查</td>
    </tr>
    <tr>
      <td height="52">单端登录</td>
      <td>新登录的设备会将当前在线设备踢下线。</td>
      <td rowspan="2">对于自动登录的设备，下线后设备会自动重连环信服务器。若重连成功，默认会踢掉当前登录设备（对于多设备登录，则踢掉最早的登录设备）。若要保留当前登录设备不被踢下线，请联系环信商务。该场景下，自动登录的设备登录失败，收到错误 214，提示当前登录的设备数量超过限制。 </td>
    </tr>
    <tr>
      <td height="156">多端登录</td>
      <td><p>若一端的登录设备数量达到了上限，最新登录的设备会将该端最早登录的设备踢下线。</p>
      <p>即时通讯 IM 仅支持同端互踢，不支持各端之间互踢。</p></td>
    </tr>
  </tbody>
</table>

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

开始前，请确保满足完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。

## 实现方法

### 获取当前用户的其他登录设备的登录 ID 列表

你可以调用 `getSelfIdsOnOtherPlatform` 方法获取其他登录设备的登录 ID 列表，然后选择目标登录 ID 作为消息接收方向指定设备发送消息。

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

![img](/images/common/multidevice_device_platform.png)

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
    switch (event) {
      //当前用户在其他设备上删除好友。
      case CONTACT_REMOVE:
        break;
      //当前用户在其他设备上接受好友请求。
      case CONTACT_ACCEPT:
        break;
      //当前用户在其他设备上拒绝好友请求。
      case CONTACT_DECLINE:
        break;
      //当前用户在其他设备上将好友加入黑名单。
      case CONTACT_BAN:
        break;
      //当前用户在其他设备上将好友移出黑名单。
      case CONTACT_ALLOW:
        break;
    }
  }

  onGroupEvent?(
    event?: ChatMultiDeviceEvent,
    target?: string,
    usernames?: Array<string>
  ): void {
    // 群组相关多设备通知。
    switch (event) {
      //当前⽤户在其他设备创建了群组。
      case GROUP_CREATE:
        break;
      //当前⽤户在其他设备销毁了群组。
      case GROUP_DESTROY:
        break;
      //当前⽤户在其他设备加⼊了群组。
      case GROUP_JOIN:
        break;
      //当前⽤户在其他设备离开了群组。
      case GROUP_LEAVE:
        break;
      //当前⽤户在其他设备发起了入群申请。
      case GROUP_APPLY:
        break;
      //当前⽤户在其他设备同意了入群申请。
      case GROUP_APPLY_ACCEPT:
        break;
      //当前⽤户在其他设备拒绝了入群申请。
      case GROUP_APPLY_DECLINE:
        break;
      //当前⽤户在其他设备邀请了群成员。
      case GROUP_INVITE:
        break;
      //当前⽤户在其他设备同意了入群邀请。
      case GROUP_INVITE_ACCEPT:
        break;
      //当前⽤户在其他设备拒绝了入群邀请。
      case GROUP_INVITE_DECLINE:
        break;
      //当前⽤户在其他设备将成员踢出群。
      case GROUP_KICK:
        break;
      //当前⽤户在其他设备将成员加⼊群组⿊名单。
      case GROUP_BAN:
        break;
      //当前⽤户在其他设备将成员移除群组⿊名单。
      case GROUP_ALLOW:
        break;
      //当前⽤户在其他设备屏蔽了群组。
      case GROUP_BLOCK:
        break;
      //当前⽤户在其他设备取消群组屏蔽。
      case GROUP_UNBLOCK:
        break;
      //当前⽤户在其他设备转移群所有权。
      case GROUP_ASSIGN_OWNER:
        break;
      //当前⽤户在其他设备添加管理员。
      case GROUP_ADD_ADMIN:
        break;
      //当前⽤户在其他设备移除管理员。
      case GROUP_REMOVE_ADMIN:
        break;
      //当前⽤户在其他设备禁⾔⽤户。
      case GROUP_ADD_MUTE:
        break;
      //当前⽤户在其他设备移除禁⾔。
      case GROUP_REMOVE_MUTE:
        break;
      //当前⽤户在其他设备设置了群成员自定义属性。
      case GROUP_METADATA_CHANGED:
        break;
      default:
        break;
    }
  }

  onThreadEvent?(
    event?: ChatMultiDeviceEvent,
    target?: string,
    usernames?: Array<string>
  ): void {
    // 子区消息多设备通知。
    switch (event) {
      case THREAD_CREATE:
        //当前用户在其他设备上创建子区。
        break;
      case THREAD_DESTROY:
        //当前用户在其他设备上销毁子区。
        break;
      case THREAD_JOIN:
        //当前用户在其他设备上加入子区。
        break;
      case THREAD_LEAVE:
        //当前用户在其他设备上离开子区。
        break;
      case THREAD_UPDATE:
        //当前用户在其他设备上更新子区。
        break;
      case THREAD_KICK:
        //当前用户在其他设备上将成员踢出子区。
        break;
    }
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
    switch (event) {
      case CONVERSATION_PINNED:
        //当前用户在其他设备上给某个会话置顶
        break;
      case CONVERSATION_UNPINNED:
        //当前用户在其他设备上给某个会话取消置顶
        break;
      case CONVERSATION_DELETED:
        //当前用户在其他设备上删除某个会话
        break;
      default:
        break;
    }
  }
})();

// 清空监听器
ChatClient.getInstance().removeAllMultiDeviceListener();

// 添加监听器
ChatClient.getInstance().addMultiDeviceListener(listener);
```
