# 多设备登录

## 功能说明

即时通讯 IM 支持同一账号在多个设备上登录。使用该功能前，需要在 [环信控制台](https://console.easemob.com/user/login) 开通多端多设备服务。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。

React Native SDK 在登录时会为当前设备生成登录资源标识，并将设备相关信息同步到服务器。服务器根据多端多设备策略维护当前账号的在线设备状态。当同一账号在其他设备上执行好友、群组、消息话题、会话或单向删除服务端历史消息等操作时，当前设备可以通过 `ChatClient#addMultiDeviceListener` 注册的 `ChatMultiDeviceEventListener` 接收相应的多设备事件。

多端多设备登录场景下，SDK 支持以下功能：

- 接收当前账号其他设备触发的多设备事件；
- 同步好友、群组、消息话题、会话以及单向删除服务端历史消息等操作；
- 获取当前用户的其他已登录设备的登录 ID 列表；
- 获取指定账号的在线登录设备列表；  
- 设置登录设备的名称；
- 设置登录设备的平台；
- 强制指定账号从单个设备下线；
- 强制指定账号从所有设备下线；
- 获取其他设备的好友或者群组操作。

多端登录时，即时通讯 IM 每端默认最多支持 4 个设备同时在线。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。你可以在环信控制台的 **功能配置 > 基础功能** > **用户** 页面，在弹出的对话框中设置各端设备的数量：

![img](/images/common/multidevice_device_count.png)

## 互踢策略

单端和多端登录场景下的互踢策略如下表所示：

| 单端/多端登录 | 互踢策略 |
| :---: | :--- |
| **单端登录** | 新登录的设备会将当前在线设备踢下线。 |
| **多端登录** | 若一端的登录设备数量达到了上限，最新登录的设备会将该端最早登录的设备踢下线。<br><br>即时通讯 IM 仅支持同端互踢，不支持各端之间互踢。 |

## 前提条件

- 开始前，确保将 SDK 初始化，连接到服务器。详见 [快速开始](quickstart.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通多端多设备功能。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。
- 设置登录设备的自定义名称和平台需在 SDK 初始化时完成。

## 获取当前用户的其他登录设备的登录 ID 列表

你可以调用 `ChatContactManager#getSelfIdsOnOtherPlatform` 方法获取其他登录设备的登录 ID 列表，然后选择目标登录 ID 作为消息接收方向指定设备发送消息。

该接口适用于多设备登录场景，用于查询当前账号在其他设备上的登录状态。返回结果中会自动排除当前设备，通常可用于展示已登录设备列表、识别异常登录、进行多端登录提醒，或配合服务端接口对指定设备执行下线等管理操作。

:::tip
登录成功后才能调用该接口。
:::

```typescript
async function sendToOtherDevice(content: string): Promise<void> {
  try {
    // 获取当前用户在其他设备上的登录 ID 列表
    const ids = await ChatClient.getInstance().contactManager
      .getSelfIdsOnOtherPlatform();
    // 选择一个登录 ID 作为消息接收方
    const toChatUsername = ids[0];
    if (!toChatUsername) return;
    const message = ChatMessage.createTextMessage(
      toChatUsername,
      content,
      ChatMessageChatType.PeerChat
    );
    // 向指定设备发送消息，通过回调获取最终发送结果
    await ChatClient.getInstance().chatManager.sendMessage(message, {
      onSuccess(sentMessage) {
        console.log('发送成功：', sentMessage.msgId);
      },
      onError(localMsgId, error) {
        console.error('发送失败：', localMsgId, error);
      },
    });
  } catch (error: unknown) {
    console.error('获取登录 ID 或发起发送失败：', error);
  }
}
```

`ChatContactManager#getSelfIdsOnOtherPlatform` 返回的每项登录 ID 均采用 `userId/resource` 格式：

- `userId`：当前用户的用户 ID。
- `resource`：已登录设备对应的资源标识，用于区分该用户的具体登录设备。

其中，`resource` 与服务端 [单设备下线接口](/document/server-side/account_offline_device_single.html)中的 `resourceId` 参数，以及服务端 [获取指定账号在线设备列表](/document/server-side/account_online_device_obtain.html)返回的 `res` 字段，在语义上是一致的，均用于标识用户的某个登录设备。

React Native 客户端接口返回完整的 `userId/resource` 登录 ID；服务端相关接口通常只需要 `/` 后面的 `resource`。因此，若业务需要调用服务端单设备下线接口，应先从登录 ID 中提取 `resource`，再将其作为 `resourceId` 传入。

## 获取指定账号的在线登录设备列表

调用 `ChatClient#getLoggedInDevicesFromServer` 可通过用户 ID 和用户 Token，从服务器异步获取指定账号的在线登录设备列表。

成功时，返回 `ChatDeviceInfo[]`。`ChatDeviceInfo.deviceName` 为设备名称；若未自定义设备名称，返回底层 SDK 提供的默认设备名称，Android 通常为设备型号，iOS 通常为系统设备名称；`ChatDeviceInfo.resource` 为设备资源标识。

```typescript
async function getLoggedInDevices(userId: string, token: string): Promise<void> {
  try {
    // 异步获取在线登录设备列表
    const deviceInfos = await ChatClient.getInstance()
      .getLoggedInDevicesFromServer(userId, token);
    // 使用在线登录设备列表
    console.log('在线登录设备：', deviceInfos);
  } catch (error: unknown) {
    // 处理获取失败
    console.error('获取在线设备失败：', error);
  }
}
```

## 设置登录设备的名称

环信即时通讯 IM 支持自定义设置设备名称，这样在多设备场景下，若有设备被踢下线，被踢设备就能知道是被哪个设备挤下线的。

初始化 SDK 时，你可以通过 `ChatOptions#customDeviceName` 设置登录设备的名称。设置后，若因达到了登录设备数量限制而导致在已登录的设备上强制退出时（`206` 错误，`ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE`），被踢设备可从 `ChatConnectEventListener#onDisconnected` 回调的 `info.deviceName` 中读取导致该设备被踢下线的新登录设备的自定义设备名称。`info` 或 `deviceName` 可能缺失，应用应兼容未提供设备名称的情况。// TODO：研发确认本段的最后一句话，是否需要添加？

:::tip
登录成功后才会将该设置发送到服务器。
:::

```typescript
const deviceNameListener: ChatConnectEventListener = {
  onDisconnected(errorCode, info) {
    // 错误码为 206 时，info.deviceName 表示将当前设备踢下线的设备名称
    if (errorCode === ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE) {
      console.log('新登录设备名称：', info?.deviceName);
    }
  },
};

async function initializeWithDeviceName(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: '<org_name>#<app_name>',
      // 设置登录设备的自定义名称
      customDeviceName: '你的自定义设备名称',
    });
    // 在 SDK 初始化时设置设备信息
    await ChatClient.getInstance().init(options);
    ChatClient.getInstance().addConnectionListener(deviceNameListener);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}

function removeDeviceNameListener(): void {
  // 不再需要监听时，移除同一个监听器对象
  ChatClient.getInstance().removeConnectionListener(deviceNameListener);
}
```

## 设置登录设备的平台

环信即时通讯 IM 支持自定义设置登录设备的平台，例如将 Android 手机和 Android 系统的平板电脑设置为两个单独的平台，方便用户精细化控制同一平台的登录设备数量及平台间互踢等行为。

你可以按照以下步骤设置登录设备所属的平台：

1. 在环信控制台的 **即时通讯** > **基础功能** > **用户** 页面，在**多端多设备** 区域，点击 **设置**。在弹出的对话框中点击 **新增自定义平台**，在 **添加自定义平台** 对话框中设置 **设备平台** 和 **设备数量**。

**设备平台**的取值范围为 [1,100]，**设备数量**的取值范围为 [0,4]。

![img](/images/common/multidevice_device_platform.png)

2. 初始化 SDK 时，通过 `ChatOptions.customOSType` 自定义设置登录设备的平台。确保该属性的值与环信控制台的 **添加自定义平台** 对话框中设置的 **设备平台** 的值相同。省略该属性时，不配置自定义平台，使用 SDK 的默认设备平台。

:::tip
登录成功后才会将该设置发送到服务器。
:::

```typescript
async function initializeWithCustomPlatform(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: '<org_name>#<app_name>',
      // 设置登录设备的自定义平台，与控制台配置保持一致
      customOSType: 1,
    });
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}
```

## 设置登录设备的扩展信息

环信即时通讯 IM 支持为登录设备设置自定义扩展信息。在多设备登录场景下，该能力可用于传递当前登录设备的附加标识信息，便于业务侧进行设备识别和管理，例如，若有设备被踢下线，被踢设备能获得该设备的自定义扩展信息。

初始化 SDK 时，你可以通过 `ChatOptions.loginExtraInfo` 设置登录设备的自定义扩展信息（最大长度为 1024 个字符）。设置后，若因达到了登录设备数量限制而导致在已登录的设备上强制退出时（`206` 错误，`ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE`），被踢设备可从 `ChatConnectEventListener#onDisconnected` 回调的 `info.ext` 中读取导致该设备被踢下线的新登录设备的自定义扩展信息。`info` 或 `ext` 可能缺失，应用应兼容未提供扩展信息的情况。// TODO：研发确认本段的最后一句话，是否需要添加？

:::tip
登录成功后才会将该设置发送到服务器。
:::

```typescript
const deviceExtListener: ChatConnectEventListener = {
  onDisconnected(errorCode, info) {
    // 当前账号因其他设备登录而被踢下线时，错误码为 206
    if (errorCode === ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE) {
      // info.ext 为将当前设备踢下线的新登录设备的自定义扩展信息
      console.log('新登录设备扩展信息：', info?.ext);
    }
    // 其他错误码场景下，不依赖 info.ext 获取设备扩展信息
  },
};

async function initializeWithDeviceExt(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: '<org_name>#<app_name>',
      // 设置登录设备的自定义扩展信息
      loginExtraInfo: JSON.stringify({ deviceLabel: '办公设备' }),
    });
    await ChatClient.getInstance().init(options);
    ChatClient.getInstance().addConnectionListener(deviceExtListener);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}

function removeDeviceExtListener(): void {
  // 不再需要监听时，移除同一个监听器对象
  ChatClient.getInstance().removeConnectionListener(deviceExtListener);
}
```

以上初始化示例分别演示不同配置。实际应用应在同一个 `ChatOptions` 中组合所需配置，并调用一次 `ChatClient#init`。

## 强制指定账号从单个设备下线

你可以调用 `ChatClient#kickDevice` 方法，通过传入用户 ID、用户 token 和设备资源标识，将指定账号从单个登录设备踢下线。调用该方法前，需要先通过 `ChatClient#getLoggedInDevicesFromServer` 获取设备列表，再通过 `ChatDeviceInfo.resource` 获取设备资源标识。

:::tip
不登录也可以使用该接口，但需先完成 SDK 初始化。
:::

`selectedIndex` 为业务侧选中的设备在返回列表中的索引。

```typescript
async function kickDevice(
  userId: string,
  token: string,
  selectedIndex: number
): Promise<void> {
  try {
    // 异步获取在线设备列表，再使用设备资源标识将指定设备踢下线
    const deviceInfos = await ChatClient.getInstance()
      .getLoggedInDevicesFromServer(userId, token);
    const deviceInfo = deviceInfos[selectedIndex];
    if (!deviceInfo) return;
    await ChatClient.getInstance().kickDevice(userId, token, deviceInfo.resource);
  } catch (error: unknown) {
    // 处理获取设备列表或踢出指定设备失败
    console.error('获取设备列表或踢出指定设备失败：', error);
  }
}
```

## 强制指定账号从所有设备下线

你可以调用 `ChatClient#kickAllDevices` 方法，通过传入用户 ID 和用户 token 将指定账号从所有登录设备踢下线。

:::tip
不登录也可以使用该接口，但需先完成 SDK 初始化。
:::

```typescript
async function kickAllDevices(userId: string, token: string): Promise<void> {
  try {
    // 将指定账号从所有登录设备踢下线
    await ChatClient.getInstance().kickAllDevices(userId, token);
  } catch (error: unknown) {
    console.error('踢出所有设备失败：', error);
  }
}
```

## 监听多设备事件

例如，账号 A 同时在设备 A 和 B 上登录，账号 A 在设备 A 上进行操作，设备 B 会收到这些操作对应的通知。

你需要先实现 `ChatMultiDeviceEventListener` 接口监听其他设备上的操作，然后调用 `ChatClient#addMultiDeviceListener` 方法添加多设备监听。

若当前设备因同端设备数量达到上限而被踢下线，SDK 会通过 `ChatConnectEventListener#onDisconnected` 回调通知；当前账号在其他设备上的好友、群组、消息话题和会话操作，则通过 `ChatMultiDeviceEventListener` 的对应回调通知。聊天室不产生会话管理类多设备事件，但聊天室消息仍会同步。

:::tip
1. 多端多设备场景下，无聊天室操作相关事件，只支持聊天室中发送和接收消息的同步。

2. 登录成功后才能接收多设备事件。
:::

// TODO：研发确认下面的需要添加吗？

:::notice
React Native SDK 5.0.0 的 iOS 端无法正常将消息话题多设备事件转发至 `ChatMultiDeviceEventListener#onThreadEvent`，请勿依赖该回调刷新消息话题界面。应用可按需重新查询消息话题列表或详情，详见 [管理消息话题](thread.html)。Android 端可使用该回调。
:::

回调的参数均为可选参数，应按实际返回值处理。`onContactEvent` 的 `target` 为好友的用户 ID，`ext` 为事件扩展信息；`onGroupEvent` 的 `target` 为群组 ID；`onThreadEvent` 的 `target` 为消息话题 ID，不能按群组 ID 使用。`onGroupEvent` 和 `onThreadEvent` 的第三个参数 `usernames` 为与操作相关的用户 ID 列表。`onConversationEvent` 的 `convId` 和 `convType` 分别为会话 ID 和会话类型。

`ChatMultiDeviceEvent.GROUP_UPDATE` 表示群组信息变更，`GROUP_METADATA_CHANGED` 表示群成员自定义属性变更，两者不应视为相同事件。

```typescript
// 实现 ChatMultiDeviceEventListener 监听其他设备上的操作
const multiDeviceListener: ChatMultiDeviceEventListener = {
  onContactEvent(event, target, ext) {
    console.log('好友多设备事件：', event, target, ext);
    switch (event) {
      // 当前用户在其他设备上删除好友
      case ChatMultiDeviceEvent.CONTACT_REMOVE:
        break;
      // 当前用户在其他设备上接受好友请求
      case ChatMultiDeviceEvent.CONTACT_ACCEPT:
        break;
      // 当前用户在其他设备上拒绝好友请求
      case ChatMultiDeviceEvent.CONTACT_DECLINE:
        break;
      // 当前用户在其他设备上将好友加入黑名单
      case ChatMultiDeviceEvent.CONTACT_BAN:
        break;
      // 当前用户在其他设备上将好友移出黑名单
      case ChatMultiDeviceEvent.CONTACT_ALLOW:
        break;
    }
  },
  onGroupEvent(event, groupId, usernames) {
    console.log('群组多设备事件：', event, groupId, usernames);
    switch (event) {
      // 当前用户在其他设备创建了群组
      case ChatMultiDeviceEvent.GROUP_CREATE:
        break;
      // 当前用户在其他设备销毁了群组
      case ChatMultiDeviceEvent.GROUP_DESTROY:
        break;
      // 当前用户在其他设备将全部群成员禁言
      case ChatMultiDeviceEvent.GROUP_ALL_BAN:
        break;
      // 当前用户在其他设备加入了群组
      case ChatMultiDeviceEvent.GROUP_JOIN:
        break;
      // 当前用户在其他设备离开了群组
      case ChatMultiDeviceEvent.GROUP_LEAVE:
        break;
      // 当前用户在其他设备发起了入群申请
      case ChatMultiDeviceEvent.GROUP_APPLY:
        break;
      // 当前用户在其他设备同意了入群申请
      case ChatMultiDeviceEvent.GROUP_APPLY_ACCEPT:
        break;
      // 当前用户在其他设备拒绝了入群申请
      case ChatMultiDeviceEvent.GROUP_APPLY_DECLINE:
        break;
      // 当前用户在其他设备邀请了群成员
      case ChatMultiDeviceEvent.GROUP_INVITE:
        break;
      // 当前用户在其他设备同意了入群邀请
      case ChatMultiDeviceEvent.GROUP_INVITE_ACCEPT:
        break;
      // 当前用户在其他设备拒绝了入群邀请
      case ChatMultiDeviceEvent.GROUP_INVITE_DECLINE:
        break;
      // 当前用户在其他设备将成员踢出群
      case ChatMultiDeviceEvent.GROUP_KICK:
        break;
      // 当前用户在其他设备将成员加入群组黑名单
      case ChatMultiDeviceEvent.GROUP_BAN:
        break;
      // 当前用户在其他设备将成员移除群组黑名单
      case ChatMultiDeviceEvent.GROUP_ALLOW:
        break;
      // 当前用户在其他设备屏蔽了群组
      case ChatMultiDeviceEvent.GROUP_BLOCK:
        break;
      // 当前用户在其他设备取消群组屏蔽
      case ChatMultiDeviceEvent.GROUP_UNBLOCK:
        break;
      // 当前用户在其他设备转移群所有权
      case ChatMultiDeviceEvent.GROUP_ASSIGN_OWNER:
        break;
      // 当前用户在其他设备添加管理员
      case ChatMultiDeviceEvent.GROUP_ADD_ADMIN:
        break;
      // 当前用户在其他设备移除管理员
      case ChatMultiDeviceEvent.GROUP_REMOVE_ADMIN:
        break;
      // 当前用户在其他设备禁言用户
      case ChatMultiDeviceEvent.GROUP_ADD_MUTE:
        break;
      // 当前用户在其他设备移除禁言
      case ChatMultiDeviceEvent.GROUP_REMOVE_MUTE:
        break;
      // 当前用户在其他设备设置了群成员自定义属性
      case ChatMultiDeviceEvent.GROUP_METADATA_CHANGED:
        break;
      // 当前用户在其他设备更新了群组信息
      case ChatMultiDeviceEvent.GROUP_UPDATE:
        break;
    }
  },
  onThreadEvent(event, threadId, usernames) {
    console.log('消息话题多设备事件：', event, threadId, usernames);
    switch (event) {
      case ChatMultiDeviceEvent.THREAD_CREATE:
        // 当前用户在其他设备上创建消息话题
        break;
      case ChatMultiDeviceEvent.THREAD_DESTROY:
        // 当前用户在其他设备上销毁消息话题
        break;
      case ChatMultiDeviceEvent.THREAD_JOIN:
        // 当前用户在其他设备上加入消息话题
        break;
      case ChatMultiDeviceEvent.THREAD_LEAVE:
        // 当前用户在其他设备上离开消息话题
        break;
      case ChatMultiDeviceEvent.THREAD_UPDATE:
        // 当前用户在其他设备上更新消息话题
        break;
      case ChatMultiDeviceEvent.THREAD_KICK:
        // 当前用户在其他设备上将成员踢出消息话题
        break;
    }
  },
  onConversationEvent(event, conversationId, convType) {
    console.log('会话多设备事件：', event, conversationId, convType);
    switch (event) {
      case ChatMultiDeviceEvent.CONVERSATION_MUTE_CHANGED:
        // 当前用户在其他设备修改了会话免打扰设置
        break;
      case ChatMultiDeviceEvent.ALL_CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED:
        // 当前用户在其他设备清空了全部会话的未读消息数
        break;
      case ChatMultiDeviceEvent.CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED:
        // 当前用户在其他设备清空了指定会话的未读消息数
        break;
      case ChatMultiDeviceEvent.CONVERSATION_PINNED:
        // 当前用户在其他设备上置顶会话
        break;
      case ChatMultiDeviceEvent.CONVERSATION_UNPINNED:
        // 当前用户在其他设备上取消会话置顶
        break;
      case ChatMultiDeviceEvent.CONVERSATION_DELETED:
        // 当前用户在其他设备上删除了服务端的会话
        break;
      case ChatMultiDeviceEvent.CONVERSATION_UPDATE_MARK:
        // 当前用户在其他设备上更新了会话标记，包括添加和移除会话标记
        break;
    }
  },
  onMessageRemoved(conversationId, deviceId) {
    // 当前用户在其他设备上单向删除服务端某个会话的历史消息
    console.log('历史消息被删除：', conversationId, deviceId);
  },
};

// 设置多设备监听
ChatClient.getInstance().addMultiDeviceListener(multiDeviceListener);

function removeMultiDeviceListener(): void {
  // 不再需要监听时，移除同一个监听器对象
  ChatClient.getInstance().removeMultiDeviceListener(multiDeviceListener);
}
```

## 典型示例

当 PC 端和移动端登录同一个账号时，在移动端可以通过调用方法获取到 PC 端的登录 ID。该登录 ID 相当于特殊的好友用户 ID，可以直接使用于聊天，使用方法与好友的用户 ID 类似。

```typescript
async function readOtherDeviceIds(): Promise<void> {
  try {
    // 获取当前用户在其他设备上的登录 ID 列表
    const selfIds = await ChatClient.getInstance().contactManager
      .getSelfIdsOnOtherPlatform();
    console.log('其他设备登录 ID：', selfIds);
  } catch (error: unknown) {
    console.error('获取其他平台登录 ID 失败：', error);
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getSelfIdsOnOtherPlatform`](#获取当前用户的其他登录设备的登录-id-列表) | `ChatContactManager` | 异步获取当前用户在其他设备上的登录 ID 列表。 |
| [`getLoggedInDevicesFromServer`](#获取指定账号的在线登录设备列表) | `ChatClient` | 使用用户 ID 和 Token 异步获取指定账号的在线设备列表。 |
| [`customDeviceName`](#设置登录设备的名称) | `ChatOptions` | 当前登录设备的自定义名称。 |
| [`customOSType`](#设置登录设备的平台) | `ChatOptions` | 当前登录设备的自定义平台编号。 |
| [`loginExtraInfo`](#设置登录设备的扩展信息) | `ChatOptions` | 当前登录设备的自定义扩展信息。 |
| [`kickDevice`](#强制指定账号从单个设备下线) | `ChatClient` | 将指定账号从指定设备踢下线。 |
| [`kickAllDevices`](#强制指定账号从所有设备下线) | `ChatClient` | 将指定账号从所有设备踢下线。 |
| [`addMultiDeviceListener`](#监听多设备事件) | `ChatClient` | 注册多设备事件监听器。 |
| [`removeMultiDeviceListener`](#监听多设备事件) | `ChatClient` | 移除指定的多设备事件监听器。 |
| [`onDisconnected`](#设置登录设备的名称) | `ChatConnectEventListener` | 连接断开或登录状态失效通知；错误码 206 时可读取新登录设备的信息。 |
