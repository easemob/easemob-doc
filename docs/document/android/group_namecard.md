# 管理群成员名片

## 功能说明

群成员名片是用户在特定群组内的个性化显示信息，用于区分该用户在不同群组中的身份展示，例如，展示部门、岗位、项目角色等群内身份信息。

例如，在企业群组中，成员可将在群组中的名片设置为“部门-姓名”或“岗位-姓名”的格式，便于群内成员快速识别和沟通。

环信即时通讯 IM Android SDK 提供群成员名片管理功能，支持群成员名片的设置、本地查询、服务端获取和变更监听。开启 [用户信息自动管理功能](userinfo_provider.html) 后，SDK 还支持通过消息自动同步群成员名片更新。

## 技术原理

群成员名片管理功能主要由 `EMGroupManager` 和 `EMGroupChangeListener` 提供。SDK 通过“主动设置或拉取、本地内存存储、事件通知、消息触发自动同步”的机制管理群成员名片，具体如下：

1. 当前登录用户可通过 `EMGroupManager#asyncUpdateGroupNamecard` 设置或更新自己在指定群组中的群成员名片。
2. 当群成员名片发生变更并同步到本地内存后，SDK 会通过 `EMGroupChangeListener#onUserGroupNamecardUpdated` 事件通知业务层。
3. SDK 支持通过 `EMGroupManager#asyncFetchGroupMembersInfo` 从服务端批量获取群成员信息，并将返回的群成员名片写入本地内存。
4. SDK 支持通过 `EMGroupManager#getGroupNamecard` 从本地内存读取指定成员在指定群组中的群成员名片。
5. 若同时开启 `EMOptions#setEnableUserInfo(true)`，发送消息时会自动附带发送方群成员名片更新时间；接收方在检测到消息中的更新时间晚于本地内存时，会自动从服务端拉取最新群成员名片、更新本地内存，并触发事件通知业务层。本地内存中的群成员名片数据来源于服务端主动获取和消息触发自动同步两种方式。

内存更新流程如下图所示：

![img](/images/android/memory_update_groupcard.png)

## 前提条件

开始接入前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解即时通讯 IM 的相关使用限制。详见[使用限制](/product/limitation.html)。

## 监听群成员名片更新

SDK 提供 `EMGroupChangeListener`，用于监听群成员名片更新事件。建议在业务初始化阶段完成监听注册，以便在群成员名片更新后及时刷新界面。

当群成员名片发生变更并同步到本地内存后，SDK 会触发 `EMGroupChangeListener#onUserGroupNamecardUpdated` 事件。该事件适用于以下场景：

- 当前登录用户更新群成员名片后，群内其他 **在线成员** 收到变更通知。
- 调用服务端接口获取到最新群成员信息并更新本地内存后。
- 开启 `EMOptions#setEnableUserInfo(true)` 后，接收方因接收消息触发自动同步并更新本地内存后。

- 添加监听：

```java
EMClient.getInstance().groupManager().addGroupChangeListener(new EMGroupChangeListener() {
    @Override
    public void onUserGroupNamecardUpdated(String groupId, String userId, String groupNamecard) {
        EMLog.d("GroupNamecard", "群成员名片更新 - groupId:" + groupId
                + ", userId:" + userId
                + ", namecard:" + groupNamecard);
    }
});
```

## 设置群成员名片

调用 `EMGroupManager#asyncUpdateGroupNamecard` 设置或更新当前登录用户在指定群组中的群成员名片，传入 `null` 可删除自己的群名片。群内其他在线成员在接收到对应的群成员名片变更通知后，会触发 `EMGroupChangeListener#onUserGroupNamecardUpdated` 事件。

```java
// 异步方法。
// 传入的 `namecard` 为 `null` 时，清除当前用户在该群组中的名片。
EMClient.getInstance().groupManager().asyncUpdateGroupNamecard("groupId", "new_namecard", new EMCallBack() {
    @Override
    public void onSuccess() {
        EMLog.d("GroupNamecard", "设置群成员名片成功");
    }

    @Override
    public void onError(int code, String error) {
        EMLog.e("GroupNamecard", "设置群成员名片失败：" + code + ", " + error);
    }
});
```

## 从服务端获取群成员名片

调用 `EMGroupManager#asyncFetchGroupMembersInfo` 从服务器分页获取群成员信息。若需获取群成员的群名片、昵称和头像，应在初始化 SDK 前调用 `EMOptions#setEnableUserInfo(true)` 开启 [用户信息自动管理功能](userinfo_provider.html)；否则，返回的 `EMGroupMemberInfo` 不包含 `namecard`、`nickname` 和 `avatarUrl`。获取成功后，相关数据会自动更新至本地内存。

```java
// 异步方法。
// `pageSize` 的取值范围为 1-50。
// 首次调用时可将 `cursor` 传入 `null`，后续传入上次返回的游标。
EMClient.getInstance().groupManager().asyncFetchGroupMembersInfo("groupId", "", 20,
        new EMValueCallBack<EMCursorResult<EMGroupMemberInfo>>() {
            @Override
            public void onSuccess(EMCursorResult<EMGroupMemberInfo> result) {
                for (EMGroupMemberInfo member : result.getData()) {
                    String userId = member.getUserId();
                    String nickname = member.getNickname();
                    String avatarUrl = member.getAvatarUrl();
                    String namecard = member.getNamecard();
                    EMLog.d("GroupNamecard", "userId:" + userId
                            + ", nickname:" + nickname
                            + ", avatarUrl:" + avatarUrl
                            + ", namecard:" + namecard);
                }
            }

            @Override
            public void onError(int code, String error) {
                EMLog.e("GroupNamecard", "获取群成员信息失败：" + code + ", " + error);
            }
        });
```

## 从本地内存获取群成员名片

调用 `EMGroupManager#getGroupNamecard` 可从本地内存读取指定成员在指定群组中的群成员名片。该接口不会发起网络请求，适用于本地展示场景。

```java
String namecard = EMClient.getInstance().groupManager().getGroupNamecard("groupId", "userId");
EMLog.d("GroupNamecard", "群成员名片：" + namecard);
```

## 通过消息自动同步群成员名片

如果希望在发送消息时自动携带群成员名片信息，并在接收消息时自动更新本地内存，需要开启 [用户信息自动管理功能](userinfo_provider.html)，即调用 `EMOptions#setEnableUserInfo(true)`。

```java
EMOptions options = new EMOptions();
options.setAppKey("your_appkey");
options.setEnableUserInfo(true);
EMClient.getInstance().init(context, options);
```

:::tip
必须在调用 `EMClient.getInstance().init(context, options)` 之前调用 `EMOptions#setEnableUserInfo(true)`，否则自动同步功能不会生效。
:::

用户信息自动管理功能开启后，SDK 会执行以下操作：

1. 当前登录用户更新群成员名片后，后续发送的消息会自动附带群成员名片更新时间。
2. 接收方收到消息后，SDK 会将消息中的群成员名片更新时间与本地内存进行比较。
3. 如果消息中的更新时间晚于本地内存，SDK 会自动从服务端拉取最新群成员名片。
4. 获取成功后，SDK 会更新本地内存，并触发 `EMGroupChangeListener#onUserGroupNamecardUpdated` 事件。

此外，你还可以通过 `EMMessage#getSenderInfo()` 获取消息发送方当前可用的群成员名片信息。详见 [用户信息自动管理](userinfo_provider.html#通过消息获取发送方信息)。

## 注意事项

- 群成员名片是用户在特定群组中的显示信息，不同群组之间互不影响。
- `EMGroupManager#getGroupNamecard` 仅查询本地内存，不会主动从服务端获取最新数据。
- `EMGroupManager#asyncFetchGroupMembersInfo` 返回的群成员信息会自动更新本地内存。只有 [开启用户信息自动管理功能](userinfo_provider.html) 后，该接口返回的信息才包含群名片、昵称和头像。
- `EMGroupChangeListener#onUserGroupNamecardUpdated` 仅对在线用户投递。
- 若需通过消息自动同步群成员名片，必须在 SDK 初始化前调用 `EMOptions#setEnableUserInfo(true)`。
- 开启 `EMOptions#setEnableUserInfo(true)` 后，群成员名片的自动更新依赖消息触发；若业务需要主动获取最新数据，仍应调用服务端接口。

## 常见问题

#### 设置群成员名片后，为何其他成员未立即收到事件？

调用 `EMGroupManager#asyncUpdateGroupNamecard` 后，当前登录用户在指定群组中的群成员名片会更新。其他 **在线成员** 在接收到对应的群成员名片变更通知后，才会触发 `EMGroupChangeListener#onUserGroupNamecardUpdated` 事件。

#### 为何调用 getGroupNamecard 获取不到群成员名片？

`EMGroupManager#getGroupNamecard` 仅从本地内存读取数据，不会主动从服务端获取最新信息。如果本地尚未内存对应成员的群成员名片，返回结果可能为空。此时可先调用 `EMGroupManager#asyncFetchGroupMembersInfo` 从服务端获取群成员信息。

#### 从服务端获取的群成员信息是否写内存？

会。调用 `EMGroupManager#asyncFetchGroupMembersInfo` 从服务端获取群成员信息成功后，返回结果中的群成员名片等数据会写入本地内存，后续可通过 `EMGroupManager#getGroupNamecard` 直接读取。

#### 开启用户信息自动管理后，群成员名片为何会自动更新？

开启用户信息自动管理 `EMOptions#setEnableUserInfo(true)` 后，发送消息时会自动附带发送方群成员名片更新时间。接收方收到消息后，SDK 会将消息中的更新时间与本地内存进行比较。如果消息中的更新时间晚于本地内存，SDK 会自动从服务端拉取最新群成员名片并更新本地内存。

#### 通过消息自动同步群成员名片后，还需主动从服务端获取吗？

视业务场景而定。通过消息自动同步依赖消息触发；如果业务需要立即获取最新群成员名片，或当前没有消息触发同步，仍建议调用 `EMGroupManager#asyncFetchGroupMembersInfo` 主动从服务端获取最新数据。

## 相关文档

- [用户信息自动管理](userinfo_provider.html)
- [管理用户属性](userprofile.html)
- [使用限制](/product/limitation.html)

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncUpdateGroupNamecard`](#设置群成员名片) | `EMGroupManager` | 设置、更新或清除当前用户在指定群组中的名片。 |
| [`asyncFetchGroupMembersInfo`](#从服务端获取群成员名片) | `EMGroupManager` | 从服务器分页获取群成员信息。 |
| [`getGroupNamecard`](#从本地内存获取群成员名片) | `EMGroupManager` | 从本地内存读取指定成员的群名片。 |
| [`setAppKey`](#通过消息自动同步群成员名片) | `EMOptions` | 设置应用的 App Key。 |
| [`setEnableUserInfo`](#通过消息自动同步群成员名片) | `EMOptions` | 开启或关闭用户信息自动管理功能。 |
| [`init`](#通过消息自动同步群成员名片) | `EMClient` | 使用指定配置初始化 SDK。 |
