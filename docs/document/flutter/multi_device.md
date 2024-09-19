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
      <td rowspan="2">对于自动登录的设备，下线后设备会自动重连环信服务器。若重连成功，默认会踢掉当前登录设备（对于多设备登录，则踢掉最早的登录设备）。若要保留当前登录设备不被踢下线，请联系环信商务。该场景下，自动登录的设备登录失败，收到错误 214，提示当前登录的设备数量超过限制。</td>
    </tr>
    <tr>
      <td height="156">多端登录</td>
      <td><p>若一端的登录设备数量达到了上限，最新登录的设备会将该端最早登录的设备踢下线。</p>
      <p>即时通讯 IM 仅支持同端互踢，不支持各端之间互踢。</p></td>
    </tr>
  </tbody>
</table>

## 技术原理  

Android SDK 初始化时会生成登录 ID 用于在多设备登录和消息推送时识别设备，并将该 ID 发送到服务器。服务器会自动将新消息发送到用户登录的设备，可以自动监听到其他设备上进行的好友或群组操作。即时通讯 IM Android SDK 提供以下多设备场景功能：

- 获取当前用户的其他已登录设备的登录 ID 列表；
- 获取指定账号的在线登录设备列表；  
- 设置登录设备的名称；
- 设置登录设备的平台；
- 强制指定账号从单个设备下线；
- 强制指定账号从所有设备下线；
- 获取其他设备的好友或者群组操作。

## 前提条件

开始前，确保将 SDK 初始化，连接到服务器。详见[快速开始](quickstart.html)。

设置登录设备的自定义名称和平台需在 SDK 初始化时中完成。

## 实现方法   

### 获取当前用户的其他登录设备的登录 ID 列表  

你可以调用 `getSelfIdsOnOtherPlatform` 方法获取其他登录设备的登录 ID 列表，然后选择目标登录 ID 作为消息接收方向指定设备发送消息。

```dart
try {
  List<String> ids = await EMClient.getInstance.contactManager.getSelfIdsOnOtherPlatform();
  if (ids.isNotEmpty) {
    final msg = EMMessage.createTxtSendMessage(
        targetId: ids.first, content: 'content');
    EMClient.getInstance.chatManager.sendMessage(msg);
  }
} on EMError catch (e) {
  debugPrint('$e');
}
```

### 获取指定账号的在线登录设备列表  

你可以调用 `fetchLoggedInDevices` 方法通过传入用户 ID 和登录密码或用户 token 从服务器获取指定账号的在线登录设备的列表。调用该方法后，在 SDK 返回的信息中，`EMDeviceInfo` 中的 `deviceName` 属性表示自定义设备名称，若未自定义设备名称，返回设备型号。

```dart
try {
  List<EMDeviceInfo> deviceInfos = await EMClient.getInstance.fetchLoggedInDevices(
    userId: 'userId',
    pwdOrToken: 'password',
    isPwd: true,
  );
} on EMError catch (e) {
  debugPrint('$e');
}
```

### 设置登录设备的名称

即时通讯 IM 自 4.1.0 版本开始支持自定义设置设备名称，这样在多设备场景下，若有设备被踢下线，你就能知道是被哪个设备挤下线的。

初始化 SDK 时，你可以调用 `EMOptions#deviceName` 方法设置登录设备的名称。设置后，若因达到了登录设备数量限制而导致在已登录的设备上强制退出时，被踢设备收到的 `EMConnectionListener#onUserDidLoginFromOtherDevice` 回调会包含导致该设备被踢下线的自定义设备名称。

:::notice
登录成功后才会将该设置发送到服务器。
:::

```dart
final options = EMOptions(appKey: appKey, deviceName: '你自定义的设备名称');
EMClient.getInstance.init(options);

EMClient.getInstance.addConnectionEventHandler(
  'identifier',
  EMConnectionEventHandler(
    onUserDidLoginFromOtherDevice: (deviceName) {
      debugPrint('onUserDidLoginFromOtherDevice: $deviceName');
    },
  ),
);
```

### 设置登录设备的平台

即时通讯 IM 自 4.1.0 版本开始支持自定义设置登录设备的平台，例如将 Android 手机和 Android 系统的平板电脑设置为两个单独的平台，方便用户精细化控制同一平台的登录设备数量及平台间互踢等行为。

你可以按照以下步骤设置登录设备所属的平台：

1. 在环信控制台的**功能配置** > **功能配置总览**页面，点击**基础功能**页签，然后点击**多端多设备在线**对应的**设置**。在弹出的对话框中点击 **新增自定义平台**，在**添加自定义平台**对话框中设置**设备平台**和**设备数量**。

**设备平台**的取值范围为 [1,100]，**设备数量**的取值范围为 [0,4]。

![img](/images/common/multidevice_device_platform.png)

2. 初始化 SDK 时，调用 `EMOptions#osType` 方法自定义设置登录设备的平台。确保该方法中的 `osType` 参数的值与环信控制台的**添加自定义平台**对话框中设置的**设备平台**的值相同。

:::notice
登录成功后才会将该设置发送到服务器。
:::

```dart
final options = EMOptions(appKey: appKey, osType: 1);
EMClient.getInstance.init(options);
```

### 强制指定账号从单个设备下线

你可以调用 `kickDevice` 方法通过传入用户 ID 和登录密码或用户 token 将指定账号从单个登录设备踢下线。被踢设备会收到 `onUserKickedByOtherDevice` 回调。调用该方法前，你需要首先通过 `EMClient#fetchLoggedInDevices` 方法获取设备 ID。

:::notice
不登录也可以使用该接口。
:::

```dart
try {
  // 获取已登录设备列表
  List<EMDeviceInfo> deviceInfos =
      await EMClient.getInstance.fetchLoggedInDevices(
    userId: 'userId',
    pwdOrToken: 'password',
    isPwd: true,
  );

  // 踢出指定设备
  await EMClient.getInstance.kickDevice(
    userId: 'userId',
    pwdOrToken: 'password',
    isPwd: true,
    resource: deviceInfos.first.resource ?? '',
  );
} on EMError catch (e) {
  debugPrint('$e');
}
```

### 强制指定账号从所有设备下线

你可以调用 `kickAllDevices` 方法通过传入用户 ID 和登录密码或用户 token 将指定账号从所有登录设备踢下线。

:::notice
不登录也可以使用该接口。
:::

```dart
try {
  await EMClient.getInstance.kickAllDevices(
    userId: 'userId',
    pwdOrToken: 'password',
    isPwd: true,
  );
} on EMError catch (e) {
  debugPrint('$e');
}
```

### 获取其他设备上的操作

例如，账号 A 同时在设备 A 和 B 上登录，账号 A 在设备 A 上进行操作，设备 B 会收到这些操作对应的通知。

可以通过 `EMMultiDeviceEventHandler` 类监听其他设备上的操作。

:::tip
多端多设备场景下，无聊天室操作相关事件，只支持聊天室中发送和接收消息的同步。
:::

```dart
//实现 `EMMultiDeviceEventHandler` 监听其他设备上的操作。
final multiDeviceEventHandler = EMMultiDeviceEventHandler(
  onChatThreadEvent: (EMMultiDevicesEvent event, String chatThreadId,
      List<String> userIds) {
    switch (event) {
      // 当前用户在其他设备上创建子区。
      case EMMultiDevicesEvent.CHAT_THREAD_CREATE:
        debugPrint('chat thread create: $chatThreadId');
        break;
      // 当前用户在其他设备上销毁子区。
      case EMMultiDevicesEvent.CHAT_THREAD_DESTROY:
        debugPrint('chat thread destroy: $chatThreadId');
        break;
      // 当前用户在其他设备上加入子区。
      case EMMultiDevicesEvent.CHAT_THREAD_JOIN:
        debugPrint('chat thread join: $chatThreadId');
        break;
      // 当前用户在其他设备上离开子区。
      case EMMultiDevicesEvent.CHAT_THREAD_LEAVE:
        debugPrint('chat thread leave: $chatThreadId');
        break;
      // 当前用户在其他设备上更新子区。
      case EMMultiDevicesEvent.CHAT_THREAD_UPDATE:
        debugPrint('chat thread update: $chatThreadId');
        break;
      // 当前用户在其他设备上将成员踢出子区。
      case EMMultiDevicesEvent.CHAT_THREAD_KICK:
        debugPrint('chat thread kick: $chatThreadId');
        break;
      default:
        break;
    }
  },
  onContactEvent: (EMMultiDevicesEvent event, String userId, String? ext) {
    switch (event) {
      // 当前用户在其他设备上接受好友请求。
      case EMMultiDevicesEvent.CONTACT_ACCEPT:
        debugPrint('contact accept: $userId');
        break;
      // 当前用户在其他设备上将好友加入黑名单。 
      case EMMultiDevicesEvent.CONTACT_BAN:
        debugPrint('contact ban: $userId');
        break;
      // 当前用户在其他设备上将好友移出黑名单。 
      case EMMultiDevicesEvent.CONTACT_ALLOW:
        debugPrint('contact allow: $userId');
        break;
      // 当前用户在其他设备上拒绝好友请求。  
      case EMMultiDevicesEvent.CONTACT_DECLINE:
        debugPrint('contact decline: $userId');
        break;
      //当前用户在其他设备上删除好友。
      case EMMultiDevicesEvent.CONTACT_REMOVE:
        debugPrint('contact remove: $userId');
        break;
      default:
        break;
    }
  },
  onGroupEvent:
      (EMMultiDevicesEvent event, String groupId, List<String>? userIds) {
    switch (event) {
      // 当前用户在其他设备上创建群组。
      case EMMultiDevicesEvent.GROUP_CREATE:
        debugPrint('group create: $groupId');
        break;
      // 当前用户在其他设备上解散群组。
      case EMMultiDevicesEvent.GROUP_DESTROY:
        debugPrint('group destroy: $groupId');
        break;
      // 当前用户在其他设备上加入群组。
      case EMMultiDevicesEvent.GROUP_JOIN:
        debugPrint('group join: $groupId');
        break;
      // 当前用户在其他设备离开群组。
      case EMMultiDevicesEvent.GROUP_LEAVE:
        debugPrint('group leave: $groupId');
        break;
      // 当前用户在其他设备上申请加入群组。
      case EMMultiDevicesEvent.GROUP_APPLY:
        debugPrint('group apply: $groupId');
        break;
      // 当前用户在其他设备接受入群申请。
      case EMMultiDevicesEvent.GROUP_APPLY_ACCEPT:
        debugPrint('group apply accept: $groupId');
        break;
      // 当前用户在其他设备上拒绝入群申请。
      case EMMultiDevicesEvent.GROUP_APPLY_DECLINE:
        debugPrint('group apply decline: $groupId');
        break;
      // 当前用户在其他设备上接受了入群邀请。
      case EMMultiDevicesEvent.GROUP_INVITE_ACCEPT:
        debugPrint('group invite accept: $groupId');
        break;
      // 当前用户在其他设备上拒绝了入群邀请。
      case EMMultiDevicesEvent.GROUP_INVITE_DECLINE:
        debugPrint('group invite decline: $groupId');
        break;
      // 当前用户在其他设备上将成员踢出群。
      case EMMultiDevicesEvent.GROUP_KICK:
        debugPrint('group kick: $groupId');
        break;
      // 当前用户在其他设备上将成员移除群组黑名单。
      case EMMultiDevicesEvent.GROUP_BAN:
        debugPrint('group ban: $groupId');
        break;
      // 当前用户在其他设备上屏蔽群组。
      case EMMultiDevicesEvent.GROUP_ALLOW:
        debugPrint('group allow: $groupId');
        break;
      // 当前用户在其他设备上屏蔽群组。
      case EMMultiDevicesEvent.GROUP_BLOCK:
        debugPrint('group block: $groupId');
        break;
      // 当前用户在其他设备上取消群组屏蔽。
      case EMMultiDevicesEvent.GROUP_UNBLOCK:
        debugPrint('group unblock: $groupId');
        break;
      // 当前用户在其他设备上转移群组所有权。
      case EMMultiDevicesEvent.GROUP_ASSIGN_OWNER:
        debugPrint('group assign owner: $groupId');
        break;
      // 当前用户在其他设备上添加管理员。
      case EMMultiDevicesEvent.GROUP_ADD_ADMIN:
        debugPrint('group add admin: $groupId');
        break;
      // 当前用户在其他设备上移除管理员。
      case EMMultiDevicesEvent.GROUP_REMOVE_ADMIN:
        debugPrint('group remove admin: $groupId');
        break;
      // 当前用户在其他设备上禁言成员。
      case EMMultiDevicesEvent.GROUP_ADD_MUTE:
        debugPrint('group add mute: $groupId');
        break;
      // 当前用户在其他设备上解除禁言。
      case EMMultiDevicesEvent.GROUP_REMOVE_MUTE:
        debugPrint('group remove mute: $groupId');
        break;
      // 当前用户在其他设备将其他用户加入到群组白名单。
      case EMMultiDevicesEvent.GROUP_ADD_USER_ALLOW_LIST:
        debugPrint('group add user allow list: $groupId');
        break;
      // 当前用户在其他设备将其他用户移除群组白名单。
      case EMMultiDevicesEvent.GROUP_REMOVE_USER_ALLOW_LIST:
        debugPrint('group remove user allow list: $groupId');
        break;
      // 当前用户在其他设备上修改群组成员属性。
      case EMMultiDevicesEvent.GROUP_MEMBER_ATTRIBUTES_CHANGED:
        debugPrint('group member attributes changed: $groupId');
        break;
      default:
        break;
    }
  },
  // 开启多设备后单个会话操作的多设备事件回调。
  onConversationEvent: (EMMultiDevicesEvent event, String conversationId,
      EMConversationType type) {
    switch (event) {
      // 当前用户在其他设备上置顶会话。
      case EMMultiDevicesEvent.CONVERSATION_PINNED:
        debugPrint('conversation update: $conversationId');
        break;
      // 当前用户在其他设备上取消会话置顶。
      case EMMultiDevicesEvent.CONVERSATION_UNPINNED:
        debugPrint('conversation update: $conversationId');
        break;
      // 当前用户在其他设备上删除了服务端的会话。
      case EMMultiDevicesEvent.CONVERSATION_DELETE:
        debugPrint('conversation update: $conversationId');
        break;
      default:
        break;
    }
  },
  // 当前用户在其他设备上单向删除服务端某个会话的历史消息。
  onRemoteMessagesRemoved: (String conversationId, String? deviceId) {
    debugPrint('remote messages removed: $conversationId');
  },
);

// 添加多设备监听
EMClient.getInstance.addMultiDeviceEventHandler(
  'UNIQUE_HANDLER_ID',
  multiDeviceEventHandler,
);

// 移除多设备监听
EMClient.getInstance.removeMultiDeviceEventHandler('UNIQUE_HANDLER_ID');

```

### 典型示例

当 PC 端和移动端登录同一个账号时，在移动端可以通过调用方法获取到 PC 端的登录 ID。该登录 ID 相当于特殊的好友用户 ID，可以直接使用于聊天，使用方法与好友的用户 ID 类似。

```dart
try {
  List<String> ids = await EMClient.getInstance.contactManager.getSelfIdsOnOtherPlatform();
} on EMError catch (e) {}
```