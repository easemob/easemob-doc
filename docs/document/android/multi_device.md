# 多设备登录

## 功能说明

即时通讯 IM 支持同一账号在多个设备上登录。使用该功能前，需要在 [环信控制台](https://console.easemob.com/user/login) 开通多端多设备服务。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。

Android SDK 在登录时会为当前设备生成登录资源标识，并将设备相关信息同步到服务器。服务器根据多端多设备策略维护当前账号的在线设备状态。当同一账号在其他设备上执行好友、群组、消息话题、会话或单向删除服务端历史消息等操作时，当前设备可以通过 `EMClient#addMultiDeviceListener` 注册的 `EMMultiDeviceListener` 接收相应的多设备事件。

多端多设备登录场景下，Android SDK 支持以下功能：

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
- 设置登录设备的自定义名称和平台需在 SDK 初始化时中完成。

## 获取当前用户的其他登录设备的登录 ID 列表  

你可以调用 `asyncGetSelfIdsOnOtherPlatform` 方法获取其他登录设备的登录 ID 列表，然后选择目标登录 ID 作为消息接收方向指定设备发送消息。

该接口适用于多设备登录场景，用于查询当前账号在其他设备上的登录状态。返回结果中会自动排除当前设备，通常可用于展示已登录设备列表、识别异常登录、进行多端登录提醒，或配合服务端接口对指定设备执行下线等管理操作。

```java
// 异步方法。
EMClient.getInstance().contactManager().asyncGetSelfIdsOnOtherPlatform(new EMValueCallBack<List<String>>() {
    @Override
    public void onSuccess(List<String> ids) {
        // 选择一个登录 ID 作为消息接收方。
        String toChatUsername = ids.get(0);
        EMMessage message = EMMessage.createTextSendMessage(content, toChatUsername);
        EMClient.getInstance().chatManager().sendMessage(message);
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
    }
});
```

`EMContactManager#asyncGetSelfIdsOnOtherPlatform` 返回的每项登录 ID 均采用 `userId/resource` 格式：

- `userId`：当前用户的用户 ID。
- `resource`：已登录设备对应的资源标识，用于区分该用户的具体登录设备。

其中，`resource` 与服务端 [单设备下线接口](/document/server-side/account_offline_device_single.html)中的 `resourceId` 参数，以及服务端[获取指定账号在线设备列表](/document/server-side/account_online_device_obtain.html)返回的 `res` 字段，在语义上是一致的，均用于标识用户的某个登录设备。

Android 客户端接口返回完整的 `userId/resource` 登录 ID；服务端相关接口通常只需要 `/` 后面的 `resource`。因此，若业务需要调用服务端单设备下线接口，应先从登录 ID 中提取 `resource`，再将其作为 `resourceId` 传入。

## 获取指定账号的在线登录设备列表

调用 `EMClient#fetchLoggedInDevicesFromServerWithToken` 可通过用户 ID 和用户 Token，从服务器异步获取指定账号的在线登录设备列表。

成功时，回调返回 `List<EMDeviceInfo>`。你可以通过 `EMDeviceInfo#getDeviceName` 获取设备名称；若未自定义设备名称，通常返回设备型号；也可以通过 `EMDeviceInfo#getResource` 获取设备资源标识。

```java
// 异步方法。
EMClient.getInstance()
        .fetchLoggedInDevicesFromServerWithToken(
                username,
                token,
                new EMValueCallBack<List<EMDeviceInfo>>() {
                    @Override
                    public void onSuccess(List<EMDeviceInfo> deviceInfos) {
                        // 使用在线登录设备列表。
                    }

                    @Override
                    public void onError(int error, String errorMsg) {
                        // 处理获取失败。
                    }
                });
```

## 设置登录设备的名称

环信即时通讯 IM 支持自定义设置设备名称，这样在多设备场景下，若有设备被踢下线，被踢设备就能知道是被哪个设备挤下线的。

初始化 SDK 时，你可以调用 `EMOptions#setCustomDeviceName` 方法设置登录设备的名称。设置后，若因达到了登录设备数量限制而导致在已登录的设备上强制退出时，被踢设备收到的 `EMConnectionListener#onLogout` 回调会包含导致该设备被踢下线的自定义设备名称。

:::tip
登录成功后才会将该设置发送到服务器。
:::

```java
    EMOptions options =  new EMOptions();
    options.setCustomDeviceName("你的自定义设备名称");
    EMClient.getInstance().init(context,options);

    EMClient.getInstance().addConnectionListener(new EMConnectionListener() {
            @Override
            public void onConnected() {

            }

            @Override
            public void onDisconnected(int errorCode) {

            }

            @Override
            public void onLogout(int errorCode, EMLoginExtensionInfo info) {
                //自定义设备信息包装在 EMLoginExtensionInfo 类中。
               // 当 errorCode 为 EMError.USER_LOGIN_ANOTHER_DEVICE 时，
               // info.getDeviceInfo() 表示将当前设备踢下线的设备名称。
            }
        });
```

## 设置登录设备的平台

环信即时通讯 IM 支持自定义设置登录设备的平台，例如将 Android 手机和 Android 系统的平板电脑设置为两个单独的平台，方便用户精细化控制同一平台的登录设备数量及平台间互踢等行为。

你可以按照以下步骤设置登录设备所属的平台：

1. 在环信控制台的 **即时通讯** > **基础功能** > **用户** 页面，在**多端多设备** 区域，点击 **设置**。在弹出的对话框中点击 **新增自定义平台**，在 **添加自定义平台** 对话框中设置 **设备平台** 和 **设备数量**。

**设备平台**的取值范围为 [1,100]，**设备数量**的取值范围为 [0,4]。

![img](/images/common/multidevice_device_platform.png)

2. 初始化 SDK 时，调用 `EMOptions#setCustomOSPlatform` 方法自定义设置登录设备的平台。确保该方法中的 `platform` 参数的值与环信控制台的 **添加自定义平台** 对话框中设置的 **设备平台** 的值相同。

:::tip
登录成功后才会将该设置发送到服务器。
:::

```java
    EMOptions options=new EMOptions();
    options.setCustomOSPlatform(1);
    EMClient.getInstance().init(context,options);
```

## 设置登录设备的扩展信息

环信即时通讯 IM 支持为登录设备设置自定义扩展信息。在多设备登录场景下，该能力可用于传递当前登录设备的附加标识信息，便于业务侧进行设备识别和管理，例如，若有设备被踢下线，被踢设备能获得该设备的自定义扩展信息。

初始化 SDK 时，你可以调用 `EMOptions#setLoginCustomExt` 方法设置登录设备的自定义扩展信息（最大长度为 1024 个字符）。设置后，若因达到了登录设备数量限制而导致在已登录的设备上强制退出时（`206` 错误，`USER_LOGIN_ANOTHER_DEVICE`），被踢设备收到的 `EMConnectionListener#onLogout` 回调会包含导致该设备被踢下线的新登录设备的自定义扩展信息。

:::tip
登录成功后才会将该设置发送到服务器。
:::

```java
    EMOptions options =  new EMOptions();
    options.setLoginCustomExt("你的自定义扩展信息json字符串");
    EMClient.getInstance().init(context,options);

    EMClient.getInstance().addConnectionListener(new EMConnectionListener() {
        @Override
        public void onConnected() {

        }

        @Override
        public void onDisconnected(int errorCode) {

        }

        @Override
        public void onLogout(int errorCode, EMLoginExtensionInfo info) {
            //当前登录账号在其它设备登录时，当前的登录设备被踢下线时会触发该回调。
            //errorCode 为 {@link EMError#USER_LOGIN_ANOTHER_DEVICE}。
            //info.getDeviceExt() 是将当前设备挤下线的新登录设备的自定义扩展信息。
            //其他错误码场景下 info.getDeviceExt() 为空。
        }
    });
```

## 强制指定账号从单个设备下线

你可以调用 `kickDeviceWithToken` 方法，通过传入用户 ID、用户 token 和设备资源标识，将指定账号从单个登录设备踢下线。调用该方法前，需要先通过 `EMClient#fetchLoggedInDevicesFromServerWithToken` 获取设备列表，再通过 `EMDeviceInfo#getResource` 获取设备资源标识。

:::tip
不登录也可以使用该接口。
:::

```java
// 异步获取在线设备列表，再使用设备资源标识将指定设备踢下线。
EMClient.getInstance().fetchLoggedInDevicesFromServerWithToken(
        username,
        token,
        new EMValueCallBack<List<EMDeviceInfo>>() {
            @Override
            public void onSuccess(List<EMDeviceInfo> deviceInfos) {
                try {
                    EMClient.getInstance().kickDeviceWithToken(
                            username,
                            token,
                            deviceInfos.get(selectedIndex).getResource());
                } catch (HyphenateException e) {
                    EMLog.e(TAG, "踢出指定设备失败", e);
                }
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 处理获取设备列表失败。
            }
        });
```

## 强制指定账号从所有设备下线

你可以调用 `kickAllDevicesWithToken` 方法，通过传入用户 ID 和用户 token 将指定账号从所有登录设备踢下线。

:::tip
不登录也可以使用该接口。
:::

```java
    try {
        EMClient.getInstance().kickAllDevicesWithToken("username","token");
    } catch (HyphenateException e) {
        e.printStackTrace();
    }
```

## 监听多设备事件

例如，账号 A 同时在设备 A 和 B 上登录，账号 A 在设备 A 上进行操作，设备 B 会收到这些操作对应的通知。

你需要先实现 `EMMultiDeviceListener` 类监听其他设备上的操作，然后调用 `addMultiDeviceListener` 方法添加多设备监听。

若当前设备因同端设备数量达到上限而被踢下线，SDK 会通过 `EMConnectionListener#onLogout` 回调通知；当前设备在其他设备上的好友、群组、消息话题和会话操作，则通过 `EMMultiDeviceListener` 的对应回调通知。聊天室不产生会话管理类多设备事件，但聊天室消息仍会同步。

:::tip
多端多设备场景下，无聊天室操作相关事件，只支持聊天室中发送和接收消息的同步。
:::

```java
//实现 `EMMultiDeviceListener` 监听其他设备上的操作。
private class ChatEMMultiDeviceListener implements EMMultiDeviceListener {
//@param event 事件。
    @Override
    //@param target 好友的用户 ID； @param ext 事件扩展信息。
    public void onContactEvent(int event, String target, String ext) {
        EMLog.i(TAG, "onContactEvent event"+event);
        DemoDbHelper dbHelper = DemoDbHelper.getInstance(DemoApplication.getInstance());
        String message = null;
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

    @Override
    public void onGroupEvent(int event, String groupId, List<String> usernames) {
        EMLog.i(TAG, "onEMGroupEvent event"+event);
        String message = null;
        switch (event) {
            //当前⽤户在其他设备创建了群组。
            case GROUP_CREATE:
                break;
            //当前⽤户在其他设备销毁了群组。
            case GROUP_DESTROY:
                break;
            // 当前用户在其他设备将全部群成员禁言。
            case GROUP_ALL_BAN:
                break;
            // 当前用户在其他设备加入了群组。
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

    @Override
        public void onChatThreadEvent(int event, String target, List<String> usernames) {
            EMLog.i(TAG, "onChatThreadEvent event"+event);
            switch (event) {
                case  THREAD_CREATE:
                    //当前用户在其他设备上创建消息话题。
                    break;
                case  THREAD_DESTROY:
                    //当前用户在其他设备上销毁消息话题。
                    break;
                case  THREAD_JOIN:
                    //当前用户在其他设备上加入消息话题。
                    break;
                case  THREAD_LEAVE:
                    //当前用户在其他设备上离开消息话题。
                    break;
                case  THREAD_UPDATE:
                    //当前用户在其他设备上更新消息话题。
                    break;
                case  THREAD_KICK:
                    //当前用户在其他设备上将成员踢出消息话题。
                    break;

            }
        }

        @Override
        public void onConversationEvent(int event, String conversationId, EMConversation.EMConversationType type) {
            EMLog.i(TAG, "onConversationEvent event"+event);
            switch (event) {
                case CONVERSATION_MUTE_INFO_CHANGED:
                    // 当前用户在其他设备修改了会话免打扰设置。
                    break;
                case ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED:
                    // 当前用户在其他设备清空了全部会话的未读消息数。
                    break;
                case CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED:
                    // 当前用户在其他设备清空了指定会话的未读消息数。
                    break;
                case CONVERSATION_PINNED:
                    //当前用户在其他设备上置顶会话。
                    break;
                case CONVERSATION_UNPINNED:
                    //当前用户在其他设备上取消会话置顶。
                    break;
                case CONVERSATION_DELETED:
                    //当前用户在其他设备上删除了服务端的会话。
                    break;
                case CONVERSATION_MARK_UPDATE:
                    //当前用户在其他设备上更新了会话标记，包括添加和移除会话标记。
                    break;   
            }

        }

        @Override
        public void onMessageRemoved(String conversationId, String deviceId) {
            EMLog.i(TAG, "onMessageRemoved conversationId "+conversationId);
            // 当前用户在其他设备上单向删除服务端某个会话的历史消息。
        }
}

ChatMultiDeviceListener chatMultiDeviceListener = new ChatMultiDeviceListener();

//设置多设备监听。
EMClient.getInstance().addMultiDeviceListener(chatMultiDeviceListener);

//移除多设备监听。
EMClient.getInstance().removeMultiDeviceListener(chatMultiDeviceListener);
```

## 典型示例

当 PC 端和移动端登录同一个账号时，在移动端可以通过调用方法获取到 PC 端的登录 ID。该登录 ID 相当于特殊的好友用户 ID，可以直接使用于聊天，使用方法与好友的用户 ID 类似。

```java
try {
    List<String> selfIds = EMClient.getInstance().contactManager().getSelfIdsOnOtherPlatform();
} catch (HyphenateException e) {
    EMLog.e(TAG, "获取其他平台登录 ID 失败", e);
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getSelfIdsOnOtherPlatform`](#获取当前用户的其他登录设备的登录-id-列表) | `EMContactManager` | 获取当前用户在其他设备上的登录 ID 列表。 |
| [`asyncGetSelfIdsOnOtherPlatform`](#获取当前用户的其他登录设备的登录-id-列表) | `EMContactManager` | 异步获取当前用户在其他设备上的登录 ID 列表。 |
| [`fetchLoggedInDevicesFromServerWithToken`](#获取指定账号的在线登录设备列表) | `EMClient` | 使用用户 ID 和 Token 异步获取指定账号的在线设备列表。 |
| [`setCustomDeviceName`](#设置登录设备的名称) | `EMOptions` | 设置当前登录设备的名称。 |
| [`setCustomOSPlatform`](#设置登录设备的平台) | `EMOptions` | 设置当前登录设备的平台编号。 |
| [`setLoginCustomExt`](#设置登录设备的扩展信息) | `EMOptions` | 设置当前登录设备的扩展信息。 |
| [`kickDeviceWithToken`](#强制指定账号从单个设备下线) | `EMClient` | 将指定账号从指定设备踢下线。 |
| [`kickAllDevicesWithToken`](#强制指定账号从所有设备下线) | `EMClient` | 将指定账号从所有设备踢下线。 |
