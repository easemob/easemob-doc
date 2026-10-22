# 用户信息自动管理

## 功能说明

Android SDK 提供用户信息自动管理功能。开启该功能后，SDK 可自动维护用户信息的同步与缓存更新，帮助开发者减少手动拉取、存储和更新用户信息的工作量。

该功能适用于会话列表、消息列表、群聊页面等需要展示用户昵称、头像、好友备注、群成员名片的场景。

**本文提及的用户信息指用于业务展示的用户相关信息，包括 [用户属性](userprofile.html)、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。**

## 技术原理

用户信息自动管理功能由 `EMOptions#setEnableUserInfo(true)` 控制。开启该功能后，SDK 会在登录成功后自动同步当前登录用户的用户属性；在发送消息时自动附带发送方用户属性的更新时间；对于群聊消息，还会额外附带发送方在当前群中的群成员名片更新时间。

接收消息后，SDK 会自动将消息中携带的更新时间与本地缓存中的对应时间戳进行比较；当检测到数据已更新或本地缺少相关缓存时，会自动从服务端拉取最新的用户属性或群成员名片，并更新本地缓存，同时通过相关事件通知业务层刷新界面。好友备注从接收方本地好友数据中读取，不随消息发送，也不通过上述更新时间比较机制同步。详见 [通过消息获取发送方信息](#通过消息获取发送方信息)。

在通过消息获取发送方信息的过程中，SDK 会自动完成用户信息的同步、缓存更新以及相关展示数据刷新。处理流程如下：

1. 用户登录成功后，SDK 自动从服务端获取当前登录用户的信息，并写入本地缓存。
2. 当用户更新自身信息后，后续发送的消息会携带对应信息的更新时间；对于群聊消息，还会携带发送方在当前群组中的群成员名片更新时间。
3. 接收方收到消息后，SDK 会解析消息中携带的用户属性更新时间；对于群聊消息，还会解析群成员名片更新时间。
4. SDK 会将消息中的更新时间与本地缓存中的对应时间戳进行比较。
5. 如果消息携带有效的更新时间，且该时间晚于本地缓存中的对应时间戳，或本地缺少对应数据，SDK 会自动 [从服务端拉取最新用户属性](userprofile.html#从服务端获取用户的所有属性) 或 [群成员名片](group_namecard.html#从服务端获取群成员名片)。其中，群成员名片仅适用于群聊消息。
6. 拉取成功后，SDK 会自动更新本地缓存。
7. SDK 会通过事件通知上层应用，业务层可据此刷新 UI。

缓存更新流程如下：

![img](/images/android/memory_update_userinfo_mgmt.png)

## 前提条件

开始接入前，请确保满足以下条件：

- 已完成 SDK 初始化。详见[快速开始](quickstart.html)。
- 已了解即时通讯 IM 的相关使用限制。详见[使用限制](/product/limitation.html)。

## 开启用户信息自动管理

在 SDK 初始化前，调用 `EMOptions#setEnableUserInfo(true)`：

```java
EMOptions options = new EMOptions();
options.setAppKey("your_appkey");
options.setEnableUserInfo(true);
EMClient.getInstance().init(context, options);
```

:::tip
必须在调用 `EMClient.getInstance().init(context, options)` 初始化 SDK 之前调用 `EMOptions#setEnableUserInfo(true)`，否则该功能不会生效。
:::

## 监听用户属性更新

SDK 提供 `EMUserInfoManagerListener`，用于监听用户属性更新事件，主要包括：
- `EMUserInfoManagerListener#onSelfUserInfoUpdate`：当前登录用户的属性同步或更新并写入本地缓存后触发该事件。
- `EMUserInfoManagerListener#onUserInfoUpdate`：其他用户属性更新并写入本地缓存后触发，包括以下场景：
  - 已订阅用户的属性发生变化。
  - 开启 [用户信息自动管理](userinfo_provider.html) 后，收到其他用户的消息，且消息携带有效的发送方用户属性（例如，用户昵称、头像）更新时间，该时间晚于本地缓存中的时间戳，或本地缺少对应数据，SDK 自动拉取用户属性并更新本地缓存。
  - 主动 [从服务端获取用户属性](userprofile.html#从服务端获取用户的所有属性)。
  - 主动 [从服务端获取群成员信息](group_members.html#获取群成员列表)。

**建议在业务初始化阶段完成监听注册，以便在登录后的初始同步、消息触发或主动拉取等场景中及时接收事件并刷新界面。** 关于其他场景下用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。

:::tip
如需接收好友的用户属性变更通知，或订阅非好友用户的属性变更通知，你需要先联系环信商务开通相应功能。详见 [监听用户属性变更](userprofile.html#监听用户属性变更) 和 [订阅非好友用户的属性变更](userprofile.html#订阅非好友用户的属性变更)。
:::

- 添加监听：

```java
EMUserInfoManagerListener userInfoListener = new EMUserInfoManagerListener() {
    @Override
    public void onSelfUserInfoUpdate(EMUserInfo userInfo) {
        EMLog.d("UserInfo", "当前登录用户属性更新 - nickname:" + userInfo.getNickname()
                + ", avatarUrl:" + userInfo.getAvatarUrl());
    }

    @Override
    public void onUserInfoUpdate(List<EMUserInfo> userInfoList) {
        for (EMUserInfo userInfo : userInfoList) {
            EMLog.d("UserInfo", "用户属性更新 - userId:" + userInfo.getUserId()
                    + ", nickname:" + userInfo.getNickname()
                    + ", avatarUrl:" + userInfo.getAvatarUrl());
        }
    }
};

EMClient.getInstance()
        .userInfoManager()
        .addUserInfoManagerListener(userInfoListener);
```

不再需要监听时，应移除监听器：

```java
EMClient.getInstance()
        .userInfoManager()
        .removeUserInfoManagerListener(userInfoListener);
```

## 通过消息获取发送方信息

开启用户信息自动管理后，发送消息时，SDK 会自动携带发送方用户属性的更新时间；发送群聊消息时，还会携带发送方在当前群中的群成员名片更新时间。应用无需手动将这些信息或完整用户属性添加到消息扩展中。当接收方收到该消息，且消息中携带的发送方用户属性更新时间晚于本地缓存时，SDK 会从服务端拉取该用户属性，并触发 `EMUserInfoManagerListener#onUserInfoUpdate` 事件。

你可以通过 `EMMessage#getSenderInfo()` 获取当前可用的发送方信息，包括昵称、头像、备注和群成员名片。如果接收方已为该发送方设置好友备注，还可调用 `EMSenderInfo#getRemark()` 获取该备注。好友备注属于接收方的私有好友数据，由接收方 SDK 从本地好友信息中读取，不会由消息发送方随消息发送，也不会传递给对方。

好友备注属于好友数据，不属于发送方的用户属性，也不通过消息携带的用户属性更新时间来同步。开启用户信息自动管理功能后，接收方 SDK 在组装 `EMMessage#getSenderInfo` 返回的 `EMSenderInfo` 时，会从本地好友信息中读取当前用户为消息发送方设置的好友备注，业务层可通过 `EMSenderInfo#getRemark` 获取该备注，方便统一展示。该备注不会随消息发送，也不会传递给对方。

`EMMessage#getSenderInfo()` 的返回类型为 `EMSenderInfo`，可能返回 `null`。获取到 `EMSenderInfo` 后，可通过以下方法读取发送方信息，各方法的返回值均可能为 `null`：

| 方法            | 返回类型 | 描述                                                         |
| :-------------- | :------- | :----------------------------------------------------------- |
| `getUserId()`   | `String` | 消息发送方的用户 ID。                                        |
| `getNickname()` | `String` | 消息发送方的昵称。                                           |
| `getAvatar()`   | `String` | 消息发送方的头像 URL。                                       |
| `getRemark()`   | `String` | 当前用户为该消息发送方设置的好友备注。 好友备注属于接收方的私有好友数据，由接收方 SDK 从本地好友信息中读取，不会由消息发送方随消息发送，也不会传递给对方。 |
| `getNamecard()` | `String` | 消息发送方在当前群组中的群成员名片。                         |

```java
public void onMessageReceived(List<EMMessage> messages) {
    for (EMMessage message : messages) {
        EMSenderInfo senderInfo = message.getSenderInfo();
        if (senderInfo != null) {
            String nickname = senderInfo.getNickname();
            String avatar = senderInfo.getAvatar();
            String remark = senderInfo.getRemark();
            String namecard = senderInfo.getNamecard();
            EMLog.d("UserInfo", "发送方信息 - nickname:" + nickname
                    + ", avatar:" + avatar
                    + ", remark:" + remark
                    + ", namecard:" + namecard);
        }
    }
}
```

:::tip
`EMMessage#getSenderInfo()` 返回的是当前本地可用的发送方信息。如果消息触发了用户信息更新，最新数据会在 SDK 完成本地缓存更新后，通过相关事件通知业务层。
:::

## 从本地缓存读取用户属性

如需直接从本地缓存读取多个用户的属性，可以调用 `EMUserInfoManager#getUserInfoWithUserIds`。该接口通过回调返回用户 ID 与 `EMUserInfo` 的映射。它适用于直接从本地缓存读取指定用户的属性，不会发起网络请求，因此可以作为好友列表读取能力之外的补充资料读取方式。

若只需同步读取单个用户的属性，可以调用 `EMUserInfoManager#getUserInfoWithUserId`；本地缓存中不存在该用户时返回 `null`。

```java
EMClient.getInstance().userInfoManager().getUserInfoWithUserIds(
        new String[] {"userId1", "userId2"},
        new EMValueCallBack<Map<String, EMUserInfo>>() {
            @Override
            public void onSuccess(Map<String, EMUserInfo> userInfoMap) {
                for (Map.Entry<String, EMUserInfo> entry : userInfoMap.entrySet()) {
                    EMUserInfo userInfo = entry.getValue();
                    EMLog.d("UserInfo", "用户属性 - userId:" + entry.getKey()
                            + ", nickname:" + userInfo.getNickname()
                            + ", avatarUrl:" + userInfo.getAvatarUrl());
                }
            }

            @Override
            public void onError(int code, String error) {
                EMLog.e("UserInfo", "读取本地用户属性失败：" + code + ", " + error);
            }
        });
```

:::tip
该接口仅返回本地缓存的数据。如需主动从服务端获取最新用户属性，请调用 `EMUserInfoManager#fetchUserInfoByUserId` 方法。详见 [管理用户属性](userprofile.html#从服务端获取用户的所有属性)。
:::

## 注意事项

- `EMOptions#setEnableUserInfo(true)` 必须在 SDK 初始化前调用。
- 建议优先注册 `EMUserInfoManagerListener`，以便在本地缓存更新后及时刷新业务界面。
- `EMMessage#getSenderInfo()` 表示当前本地可用的发送方信息，不保证一定是刚收到消息时的最终最新值。
- 当消息中的更新时间晚于本地缓存时，SDK 会自动从服务端拉取最新数据并更新本地缓存。
- `EMUserInfoManager#getUserInfoWithUserIds` 仅查询本地缓存，不会主动从服务端拉取最新数据。

## 常见问题

#### 何时开启用户信息自动管理？

必须在调用 `EMClient.getInstance().init(context, options)` 初始化 SDK 之前调用 `EMOptions#setEnableUserInfo(true)`。若在 SDK 初始化完成后再设置，用户信息自动管理功能不会生效。

#### 功能开启后，SDK 会自动执行哪些操作？

开启用户信息自动管理 `EMOptions#setEnableUserInfo(true)` 后，SDK 会在登录成功后自动同步当前登录用户信息；在发送消息时自动附带发送方信息及更新时间；在接收消息后自动比较消息中的更新时间与本地缓存；在检测到数据更新时自动从服务端拉取最新信息并更新本地缓存，同时通过事件通知业务层。

#### EMMessage#getSenderInfo() 一定最新？

不一定。`EMMessage#getSenderInfo()` 返回的是当前本地可用的发送方信息。如果消息触发了用户信息更新，SDK 会先从服务端拉取最新数据并更新本地缓存，随后通过相关事件通知业务层刷新界面。

#### 为何建议尽早注册监听？

[开启用户信息自动管理功能](#开启用户信息自动管理) 后，SDK 可能在登录后的初始同步以及消息触发的用户信息更新场景中通知业务层。建议在业务初始化阶段完成注册监听 `EMUserInfoManagerListener`，以便及时接收事件并刷新界面。

#### 本地读取和服务端获取有何区别？

`EMUserInfoManager#getUserInfoWithUserIds` 仅查询本地缓存，不会发起网络请求，适用于本地展示场景。如果业务需要获取最新的用户属性，应调用对应的 [接口](userprofile.html#从服务端获取用户的所有属性) 主动获取。

#### 功能开启后需自己维护缓存吗？

通常不需要。开启 `EMOptions#setEnableUserInfo(true)` 后，SDK 会负责用户信息的自动同步、更新时间比较、本地缓存更新和事件通知。业务层通常只需从本地缓存读取数据，并在相关事件中刷新界面。

## 相关功能

### 管理群成员名片

启用用户信息自动管理后，SDK 支持群成员名片的消息触发自动同步与更新。你可以进一步实现群成员名片的设置、查询和变更监听。详见 [管理群成员名片](group_namecard.html)。

### 用户属性与用户信息

- 用户信息：指用于业务展示的用户相关信息，包括 [用户属性](userprofile.html)、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。
- 用户属性：指用户可设置和管理的资料字段，例如，用户昵称、头像、邮箱、电话号码等。你可通过相关接口对这些字段进行设置、更新和查询。详见 [管理用户属性](userprofile.html)。例如，你可以通过 `EMUserInfoManager#updateOwnInfo` 设置当前登录用户的昵称、头像等资料。若用户信息自动管理功能开通（调用 `EMOptions#setEnableUserInfo(true)`），更新后的信息会在后续发送消息时自动参与同步。

### 通过消息同步的发送方信息

开启用户信息自动管理后，接收到的消息中会包含发送方相关信息，包括昵称、头像、备注和群成员名片。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setAppKey`](#开启用户信息自动管理) | `EMOptions` | 设置应用的 App Key。 |
| [`setEnableUserInfo`](#开启用户信息自动管理) | `EMOptions` | 开启或关闭用户信息自动管理功能。 |
| [`init`](#开启用户信息自动管理) | `EMClient` | 使用指定配置初始化 SDK。 |
| [`getUserInfoWithUserId`](#从本地缓存读取用户属性) / [`getUserInfoWithUserIds`](#从本地缓存读取用户属性) | `EMUserInfoManager` | 从本地缓存读取单个或多个用户的属性。 |
| [`fetchUserInfoByUserId`](#从本地缓存读取用户属性) | `EMUserInfoManager` | 从服务器获取一个或多个用户的属性。 |
| [`updateOwnInfo`](#用户属性与用户信息) | `EMUserInfoManager` | 设置或更新当前登录用户的多个属性。 |


