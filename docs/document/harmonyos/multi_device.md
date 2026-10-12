# 多设备登录

## 功能说明

即时通讯 IM 支持同一账号在多个设备上登录。使用该功能前，需要在 [环信控制台](https://console.easemob.com/user/login) 开通多端多设备服务。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。

HarmonyOS SDK 登录时会为当前设备生成登录资源标识，并将设备信息同步到服务器。服务器根据多端多设备策略维护当前账号的在线设备状态。当同一账号在其他设备上执行好友、群组、会话或单向删除服务端历史消息等操作时，当前设备可以通过 `ChatClient#addMultiDevicesListener` 注册的 `MultiDevicesListener` 接收相应的多设备事件。

多端多设备登录场景下，HarmonyOS SDK 支持以下功能：

- 接收当前账号其他设备触发的多设备事件；
- 同步好友、群组、会话以及单向删除服务端历史消息等操作；
- 获取当前用户的其他登录设备的登录 ID 列表；
- 设置登录设备的名称、平台和扩展信息；
- 获取其他设备的好友、群组和会话操作。

多端登录时，即时通讯 IM 每端默认最多支持 4 个设备同时在线。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。你可以在环信控制台的 **功能配置 > 基础功能 > 用户** 页面，在弹出的对话框中设置各端设备的数量：

![img](/images/common/multidevice_device_count.png)

## 互踢策略

单端和多端登录场景下的互踢策略如下表所示：

| 单端/多端登录 | 互踢策略 |
| :---: | :--- |
| **单端登录** | 新登录的设备会将当前在线设备踢下线。 |
| **多端登录** | 若一端的登录设备数量达到上限，最新登录的设备会将该端最早登录的设备踢下线。<br><br>即时通讯 IM 仅支持同端互踢，不支持各端之间互踢。 |

当前设备被其他设备挤下线时，`ConnectionListener#onLogout` 回调中的错误码为 `ChatError.USER_LOGIN_ANOTHER_DEVICE`（206）。登录设备数超过限制时，错误码为 `ChatError.USER_LOGIN_TOO_MANY_DEVICES`（214）。HarmonyOS SDK 5.x 初始化后不会自动登录；设备退出登录后，应用需要重新获取有效 Token，并主动调用 `loginWithToken` 登录。

## 前提条件

- 开始前，确保已初始化 SDK 并登录。详见 [快速开始](quickstart.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通多端多设备功能。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。
- 首次初始化时，如需设置登录设备的自定义名称、平台或扩展信息，应先配置 `ChatOptions`，再调用 `ChatClient#init`。

## 获取当前用户的其他登录设备的登录 ID 列表

调用 `ContactManager#getSelfIdsOnOtherPlatform` 从服务器获取当前账号在其他设备上的登录 ID 列表。返回结果不包含当前设备；当前账号没有其他在线设备时，返回空数组。

登录 ID 的格式为 `userId/resource`：

- `userId`：当前用户的用户 ID。
- `resource`：登录设备的资源标识，用于区分该用户的不同登录设备。

登录 ID 可以作为特殊的用户 ID，用于向当前账号的指定设备发送单聊消息。服务端 [单设备下线接口](/document/server-side/account_offline_device_single.html) 使用 `/` 后面的 `resource` 作为 `resourceId`。

```typescript
const contactManager = ChatClient.getInstance().contactManager();
const chatManager = ChatClient.getInstance().chatManager();

contactManager?.getSelfIdsOnOtherPlatform()
  .then((ids: Array<string>): void => {
    if (ids.length === 0) {
      return;
    }

    // 选择一个登录 ID 作为消息接收方。
    const message: ChatMessage | undefined = ChatMessage.createTextSendMessage(
      ids[0],
      "hello"
    );
    if (message) {
      chatManager?.sendMessage(message);
    }
  })
  .catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
  });
```

## 设置登录设备的名称

通过 `ChatOptions#setCustomDeviceName` 设置当前登录设备的名称，可以在多设备场景下区分设备。该参数不支持空字符串。

设置后，若当前设备因其他设备登录而被挤下线，`ConnectionListener#onLogout` 回调中的 `LoginExtInfo#deviceInfo` 为新登录设备的自定义名称；若新登录设备未设置自定义名称，通常为该设备的型号。其他错误码场景下，`deviceInfo` 为空字符串。

:::tip
登录成功后，SDK 才会将该设置发送到服务器。
:::

```typescript
const options = new ChatOptions({
  appKey: "您的 App Key"
});
options.setCustomDeviceName("您的自定义设备名称");

const chatClient = ChatClient.getInstance();
chatClient.init(this.context, options);

const connectionListener: ConnectionListener = {
  onConnected: (): void => {
  },
  onDisconnected: (errorCode: number): void => {
  },
  onLogout: (errorCode: number, info: LoginExtInfo): void => {
    if (errorCode === ChatError.USER_LOGIN_ANOTHER_DEVICE) {
      // info.deviceInfo 为将当前设备挤下线的新登录设备的名称。
    }
  }
};

chatClient.addConnectionListener(connectionListener);
// 不再需要监听时移除监听器。
// chatClient.removeConnectionListener(connectionListener);
```

## 设置登录设备的平台

即时通讯 IM 支持自定义登录设备的平台。例如，可以将 HarmonyOS 手机和平板电脑设置为两个不同平台，以便分别控制各平台允许同时在线的设备数量。

你可以按照以下步骤设置登录设备所属的平台：

1. 在环信控制台的 **功能配置 > 基础功能 > 用户** 页面，在 **多端多设备** 区域点击 **设置**。在弹出的对话框中点击 **新增自定义平台**，设置 **设备平台** 和 **设备数量**。

   **设备平台**的取值范围为 [1,100]，**设备数量**的取值范围为 [0,4]。

   ![img](/images/common/multidevice_device_platform.png)

2. 初始化 SDK 时，调用 `ChatOptions#setCustomOSPlatform` 设置登录设备的平台。`platform` 参数的值必须与环信控制台中配置的 **设备平台** 值一致。

:::tip
登录成功后，SDK 才会将该设置发送到服务器。
:::

```typescript
const options = new ChatOptions({
  appKey: "您的 App Key"
});
options.setCustomOSPlatform(1); // 取值范围为 [1,100]。

ChatClient.getInstance().init(this.context, options);
```

## 设置登录设备的扩展信息

通过 `ChatOptions#setLoginCustomExt` 设置当前登录设备的自定义扩展信息，便于业务识别和管理设备。扩展信息的最大长度为 1024 个字符。

设置后，若当前设备因其他设备登录而被挤下线，`ConnectionListener#onLogout` 回调中的 `LoginExtInfo#deviceExt` 为新登录设备的自定义扩展信息。其他错误码场景下，`deviceExt` 为空字符串。

:::tip
未初始化 SDK 时，应在调用 `ChatClient#init` 前设置该信息；SDK 已初始化且使用手动登录时，应在下一次调用 `login` 或 `loginWithToken` 前设置。登录成功后，SDK 才会将该设置发送到服务器。
:::

```typescript
const options = new ChatOptions({
  appKey: "您的 App Key"
});
options.setLoginCustomExt("您的自定义扩展信息");

const chatClient = ChatClient.getInstance();
chatClient.init(this.context, options);

const connectionListener: ConnectionListener = {
  onConnected: (): void => {
  },
  onDisconnected: (errorCode: number): void => {
  },
  onLogout: (errorCode: number, info: LoginExtInfo): void => {
    if (errorCode === ChatError.USER_LOGIN_ANOTHER_DEVICE) {
      // info.deviceExt 为将当前设备挤下线的新登录设备的自定义扩展信息。
    }
  }
};

chatClient.addConnectionListener(connectionListener);
// 不再需要监听时移除监听器。
// chatClient.removeConnectionListener(connectionListener);
```

## 监听多设备事件

例如，账号 A 同时在设备 A 和设备 B 上登录。账号 A 在设备 A 上进行操作，设备 B 会收到该操作对应的多设备事件。

实现 `MultiDevicesListener`，然后调用 `ChatClient#addMultiDevicesListener` 添加监听器。该监听器提供以下回调：

- `onContactEvent`：好友操作事件。
- `onGroupEvent`：群组操作事件。
- `onConversationEvent`：会话操作事件。该回调为可选回调。
- `onMessageRemoved`：其他设备单向删除服务端历史消息的事件。

:::tip
多端多设备场景下，无聊天室操作相关事件，只支持聊天室中发送和接收消息的同步。
:::

```typescript
const multiDevicesListener: MultiDevicesListener = {
  onContactEvent: (
    event: MultiDevicesEvent,
    target: string,
    ext: string
  ): void => {
    switch (event) {
      case MultiDevicesEvent.CONTACT_REMOVE:
        // 当前用户在其他设备删除好友。
        break;
      case MultiDevicesEvent.CONTACT_ACCEPT:
        // 当前用户在其他设备接受好友请求。
        break;
      case MultiDevicesEvent.CONTACT_DECLINE:
        // 当前用户在其他设备拒绝好友请求。
        break;
      case MultiDevicesEvent.CONTACT_BAN:
        // 当前用户在其他设备将好友加入黑名单。
        break;
      case MultiDevicesEvent.CONTACT_ALLOW:
        // 当前用户在其他设备将好友移出黑名单。
        break;
      default:
        break;
    }
  },

  onGroupEvent: (
    event: MultiDevicesEvent,
    groupId: string,
    userIds: Array<string>
  ): void => {
    switch (event) {
      case MultiDevicesEvent.GROUP_CREATE:
        // 当前用户在其他设备创建群组。
        break;
      case MultiDevicesEvent.GROUP_DESTROY:
        // 当前用户在其他设备解散群组。
        break;
      case MultiDevicesEvent.GROUP_JOIN:
        // 当前用户在其他设备加入群组。
        break;
      case MultiDevicesEvent.GROUP_LEAVE:
        // 当前用户在其他设备离开群组。
        break;
      case MultiDevicesEvent.GROUP_APPLY:
        // 当前用户在其他设备申请加入群组。
        break;
      case MultiDevicesEvent.GROUP_APPLY_ACCEPT:
        // 当前用户在其他设备接受入群申请。
        break;
      case MultiDevicesEvent.GROUP_APPLY_DECLINE:
        // 当前用户在其他设备拒绝入群申请。
        break;
      case MultiDevicesEvent.GROUP_INVITE:
        // 当前用户在其他设备邀请用户入群。
        break;
      case MultiDevicesEvent.GROUP_INVITE_ACCEPT:
        // 当前用户在其他设备接受入群邀请。
        break;
      case MultiDevicesEvent.GROUP_INVITE_DECLINE:
        // 当前用户在其他设备拒绝入群邀请。
        break;
      case MultiDevicesEvent.GROUP_KICK:
        // 当前用户在其他设备将成员踢出群组。
        break;
      case MultiDevicesEvent.GROUP_BAN:
        // 当前用户在其他设备将成员加入群组黑名单。
        break;
      case MultiDevicesEvent.GROUP_ALLOW:
        // 当前用户在其他设备将成员移出群组黑名单。
        break;
      case MultiDevicesEvent.GROUP_BLOCK:
        // 当前用户在其他设备屏蔽群组。
        break;
      case MultiDevicesEvent.GROUP_UNBLOCK:
        // 当前用户在其他设备取消屏蔽群组。
        break;
      case MultiDevicesEvent.GROUP_ASSIGN_OWNER:
        // 当前用户在其他设备转移群组所有权。
        break;
      case MultiDevicesEvent.GROUP_ADD_ADMIN:
        // 当前用户在其他设备添加群管理员。
        break;
      case MultiDevicesEvent.GROUP_REMOVE_ADMIN:
        // 当前用户在其他设备移除群管理员。
        break;
      case MultiDevicesEvent.GROUP_ADD_MUTE:
        // 当前用户在其他设备禁言群成员。
        break;
      case MultiDevicesEvent.GROUP_REMOVE_MUTE:
        // 当前用户在其他设备解除群成员禁言。
        break;
      case MultiDevicesEvent.GROUP_ADD_USER_WHITE_LIST:
        // 当前用户在其他设备将成员加入群组白名单。
        break;
      case MultiDevicesEvent.GROUP_REMOVE_USER_WHITE_LIST:
        // 当前用户在其他设备将成员移出群组白名单。
        break;
      case MultiDevicesEvent.GROUP_ALL_BAN:
        // 当前用户在其他设备开启群组全员禁言。
        break;
      case MultiDevicesEvent.GROUP_REMOVE_ALL_BAN:
        // 当前用户在其他设备解除群组全员禁言。
        break;
      default:
        break;
    }
  },

  onConversationEvent: (
    event: MultiDevicesEvent,
    conversationId: string,
    type: ConversationType
  ): void => {
    switch (event) {
      case MultiDevicesEvent.CONVERSATION_PINNED:
        // 当前用户在其他设备置顶会话。
        break;
      case MultiDevicesEvent.CONVERSATION_UNPINNED:
        // 当前用户在其他设备取消置顶会话。
        break;
      case MultiDevicesEvent.CONVERSATION_DELETED:
        // 当前用户在其他设备删除服务端会话。
        break;
      case MultiDevicesEvent.CONVERSATION_MARK_UPDATE:
        // 当前用户在其他设备更新会话标记。
        break;
      case MultiDevicesEvent.CONVERSATION_MUTE_INFO_CHANGED:
        // 当前用户在其他设备更新会话免打扰设置。
        break;
      case MultiDevicesEvent.CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED:
        // 当前用户在其他设备清空指定会话的未读消息数。
        break;
      case MultiDevicesEvent.ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED:
        // 当前用户在其他设备清空全部会话的未读消息数。
        // 此事件中的 conversationId 和 type 不表示某个具体会话。
        break;
      default:
        break;
    }
  },

  onMessageRemoved: (conversationId: string, deviceId: string): void => {
    // 当前用户在其他设备单向删除服务端某个会话的历史消息。
  }
};

const chatClient = ChatClient.getInstance();
chatClient.addMultiDevicesListener(multiDevicesListener);

// 不再需要监听时移除监听器。
// chatClient.removeMultiDevicesListener(multiDevicesListener);
```

收到会话事件后，可重新调用 `ChatManager#getConversations` 或 `ChatManager#getAllConversationsBySort` 读取本地会话列表并刷新界面。

## 典型示例

当 PC 端和移动端登录同一个账号时，移动端可以获取 PC 端的登录 ID。该登录 ID 相当于特殊的用户 ID，可以直接作为单聊消息的接收方。

```typescript
const contactManager = ChatClient.getInstance().contactManager();

contactManager?.getSelfIdsOnOtherPlatform()
  .then((ids: Array<string>): void => {
    // ids 为当前账号其他设备的登录 ID 列表，不包含当前设备。
  })
  .catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
  });
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getSelfIdsOnOtherPlatform`](#获取当前用户的其他登录设备的登录-id-列表) | `ContactManager` | 获取当前用户在其他设备上的登录 ID 列表。 |
| [`setCustomDeviceName`](#设置登录设备的名称) | `ChatOptions` | 设置当前登录设备的名称。 |
| [`setCustomOSPlatform`](#设置登录设备的平台) | `ChatOptions` | 设置当前登录设备的平台编号。 |
| [`setLoginCustomExt`](#设置登录设备的扩展信息) | `ChatOptions` | 设置当前登录设备的扩展信息。 |
| [`addConnectionListener`](#设置登录设备的名称) | `ChatClient` | 添加连接状态监听器，用于接收退出登录事件及设备信息。 |
| [`removeConnectionListener`](#设置登录设备的名称) | `ChatClient` | 移除连接状态监听器。 |
| [`addMultiDevicesListener`](#监听多设备事件) | `ChatClient` | 添加多设备事件监听器。 |
| [`removeMultiDevicesListener`](#监听多设备事件) | `ChatClient` | 移除多设备事件监听器。 |
