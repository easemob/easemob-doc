# 用户信息自动管理

## 功能说明

**自 V4.20.0 起**，环信即时通讯 IM 提供用户信息自动管理功能。开启该功能后，SDK 可自动维护用户信息的同步与内存更新，帮助开发者减少手动拉取、存储和更新用户信息的工作量。

该功能适用于会话列表、消息列表、群聊页面等需要展示用户昵称、头像、备注、群成员名片的场景。

**本文提及的用户信息指用于业务展示的用户相关信息，包括 [用户属性](userprofile.html)、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。**

## 技术原理

用户信息自动管理功能由 `EMOptions#setEnableUserInfo(true)` 控制。开启后，SDK 按以下流程处理用户信息同步与内存更新：

1. 用户登录成功后，SDK 自动从服务端获取当前登录用户的信息，并写入本地内存。
2. 当用户更新自身信息后，后续发送的消息会携带对应信息的更新时间。
3. 接收方收到消息后，SDK 会解析消息中的发送方信息及更新时间。
4. SDK 会将消息中的更新时间与本地内存中的时间戳进行比较。
5. 如果消息中的更新时间晚于本地内存，SDK 会自动 [从服务端拉取最新用户属性](userprofile.html#从服务端获取用户的所有属性) 或 [群成员名片](group_namecard.html#从本地内存获取群成员名片)。
6. 拉取成功后，SDK 会自动更新本地内存。
7. 本地内存更新完成后，SDK 会通过事件通知上层应用，业务层可据此刷新 UI。

**该功能的核心是：SDK 自动完成用户信息获取、更新检测、本地内存更新和变更通知。**

内存更新流程如下：

![img](/images/android/memory_update_userinfo_mgmt.png)

## 前提条件

开始接入前，请确保满足以下条件：

- 已将 SDK 升级至 v4.20.0 或以上版本。
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
- `EMUserInfoManagerListener#onSelfUserInfoUpdate`：当前登录用户的属性同步或更新并写入本地内存后触发该事件。
- `EMUserInfoManagerListener#onUserInfoUpdate`：其他用户属性更新并写入本地内存后触发，包括以下场景：
  - 收到其他用户的消息，消息中发送方的用户昵称、头像有变更。若实现这种场景下的用户属性更新事件，需要将 SDK 升级至 4.20.0 及以上版本，并开启用户信息自动管理。
  - 主动 [从服务端获取用户属性](userprofile.html#从服务端获取用户的所有属性)。
  - 主动 [从服务端获取群成员信息](group_manage.html#从服务端获取群成员列表)。

**建议在业务初始化阶段完成监听注册，以便在登录后的初始同步、消息触发或主动拉取等场景中及时接收事件并刷新界面。** 关于其他场景下用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。

- 添加监听：

```java
EMClient.getInstance().userInfoManager().addUserInfoManagerListener(new EMUserInfoManagerListener() {
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
});
```

## 通过消息获取发送方信息

对于 4.20.0，开启用户信息自动管理后，如果发送方在发送消息时携带了自己的用户信息，则无论发送方与接收方是否为好友关系，当接收方收到该消息，且消息中携带的发送方用户属性更新时间晚于本地缓存时，SDK 会重新拉取该用户属性，并触发 `EMUserInfoManagerListener#onUserInfoUpdate` 事件。

你可以通过 `EMMessage#getSenderInfo()` 获取当前可用的发送方信息，包括昵称、头像、备注和群成员名片。

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
`EMMessage#getSenderInfo()` 返回的是当前本地可用的发送方信息。如果消息触发了用户信息更新，最新数据会在 SDK 完成本地内存更新后，通过相关事件通知业务层。
:::

## 从本地内存读取用户属性

如需直接从本地内存读取用户属性，可以调用 `EMUserInfoManager#getUserInfoWithUserId`。该接口返回的是单个用户的 `EMUserInfo`。它适用于直接从本地内存读取指定用户的资料，不会发起网络请求，因此可以作为好友列表读取能力之外的补充资料读取方式。

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
该接口仅返回本地内存的数据。如需主动从服务端获取最新用户属性，请调用 `EMUserInfoManager#fetchUserInfoByUserId` 方法。详见 [管理用户属性](userprofile.html#从服务端获取用户的所有属性)。
:::

## 注意事项

- `EMOptions#setEnableUserInfo(true)` 必须在 SDK 初始化前调用。
- 建议优先注册 `EMUserInfoManagerListener`，以便在本地内存更新后及时刷新业务界面。
- `EMMessage#getSenderInfo()` 表示当前本地可用的发送方信息，不保证一定是刚收到消息时的最终最新值。
- 当消息中的更新时间晚于本地内存时，SDK 会自动从服务端拉取最新数据并更新本地内存。
- `EMUserInfoManager#getUserInfoWithUserIds` 仅查询本地内存，不会主动从服务端拉取最新数据。

## 常见问题

#### 何时开启用户信息自动管理？

必须在调用 `EMClient.getInstance().init(context, options)` 初始化 SDK 之前调用 `EMOptions#setEnableUserInfo(true)`。若在 SDK 初始化完成后再设置，用户信息自动管理功能不会生效。

#### 功能开启后，SDK 会自动执行哪些操作？

开启用户信息自动管理 `EMOptions#setEnableUserInfo(true)` 后，SDK 会在登录成功后自动同步当前登录用户信息；在发送消息时自动附带发送方信息及更新时间；在接收消息后自动比较消息中的更新时间与本地内存；在检测到数据更新时自动从服务端拉取最新信息并更新本地内存，同时通过事件通知业务层。

#### EMMessage#getSenderInfo() 一定最新？

不一定。`EMMessage#getSenderInfo()` 返回的是当前本地可用的发送方信息。如果消息触发了用户信息更新，SDK 会先从服务端拉取最新数据并更新本地内存，随后通过相关事件通知业务层刷新界面。

#### 为何建议尽早注册监听？

[开启用户信息自动管理功能](#开启用户信息自动管理) 后，SDK 可能在登录后的初始同步以及消息触发的用户信息更新场景中通知业务层。建议在业务初始化阶段完成注册监听 `EMUserInfoManagerListener`，以便及时接收事件并刷新界面。

#### 本地读取和服务端获取有何区别？

`EMUserInfoManager#getUserInfoWithUserIds` 仅查询本地内存，不会发起网络请求，适用于本地展示场景。如果业务需要获取最新的用户属性，应调用对应的 [接口](userprofile.html#从服务端获取用户的所有属性) 主动获取。

#### 功能开启后需自己维护内存吗？

通常不需要。开启 `EMOptions#setEnableUserInfo(true)` 后，SDK 会负责用户信息的自动同步、更新时间比较、本地内存更新和事件通知。业务层通常只需从本地内存读取数据，并在相关事件中刷新界面。

## 相关功能

### 管理群成员名片

启用用户信息自动管理后，SDK 也支持群成员名片的自动同步与更新。你可以进一步实现群成员名片的设置、查询和变更监听。详见 [管理群成员名片](group_namecard.html)。

### 用户属性与用户信息

- 用户信息：指用于业务展示的用户相关信息，包括 [用户属性](userprofile.html)、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。
- 用户属性：指用户可设置和管理的资料字段，例如，用户昵称、头像、邮箱、电话号码等。你可通过相关接口对这些字段进行设置、更新和查询。详见 [管理用户属性](userprofile.html)。例如，你可以通过 `EMUserInfoManager#updateOwnInfo` 设置当前登录用户的昵称、头像等资料。若用户信息自动管理功能开通（调用 `EMOptions#setEnableUserInfo(true)`），更新后的信息会在后续发送消息时自动参与同步。

### 通过消息同步的发送方信息

开启用户信息自动管理后，接收到的消息中会包含发送方相关信息，包括昵称、头像、备注和群成员名片。


