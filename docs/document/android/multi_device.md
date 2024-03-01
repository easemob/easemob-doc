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
      <td rowspan="2">设备支持自动登录时，若设备下线后自动重连时需要判断是否踢掉当前在线的最早登录设备，请联系环信商务。 </td>
    </tr>
    <tr>
      <td height="156">多端登录</td>
      <td><p>若一端的登录设备数量达到了上限，最新登录的设备会将该端最早登录的设备踢下线。</p>
      <p>即时通讯 IM 仅支持同端互踢，不支持各端之间互踢。</p></td>
    </tr>
  </tbody>
</table>
</body>
</html>

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

你可以调用 `getSelfIdsOnOtherPlatform` 方法获取其他登录设备的登录 ID 列表。选择目标登录 ID 作为消息接收方发出消息，则这些设备上的同一登录账号可以收到消息，实现不同设备之间的消息同步。

```java
// 同步方法，会阻塞当前线程。异步方法为 asyncGetSelfIdsOnOtherPlatform(EMValueCallBack)。
List<String> ids = EMClient.getInstance().contactManager().getSelfIdsOnOtherPlatform();
// 选择一个登录 ID 作为消息接收方。
String toChatUsername = ids.get(0);
// 创建一条文本消息，content 为消息文字内容，toChatUsername 传入登录 ID 作为消息接收方。
EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername); 
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message); 
```

### 获取指定账号的在线登录设备列表  

你可以调用 `getLoggedInDevicesFromServer` 或 `getLoggedInDevicesFromServerWithToken` 方法通过传入用户 ID 和登录密码或用户 token 从服务器获取指定账号的在线登录设备的列表。调用该方法后，在 SDK 返回的信息中，`EMDeviceInfo` 中的 `mDeviceName` 属性表示自定义设备名称，若未自定义设备名称，返回设备型号。

```java
    try {
        List<EMDeviceInfo> deviceInfos = EMClient.getInstance().getLoggedInDevicesFromServer("username","pwd");
    } catch (HyphenateException e) {
        e.printStackTrace();
    }

    try {
        List<EMDeviceInfo> deviceInfos = EMClient.getInstance().getLoggedInDevicesFromServerWithToken("username","token");
    } catch (HyphenateException e) {
        e.printStackTrace();
    }
```

### 设置登录设备的名称

即时通讯 IM 自 4.1.0 版本开始支持自定义设置设备名称，这样在多设备场景下，若有设备被踢下线，你就能知道是被哪个设备挤下线的。

初始化 SDK 时，你可以调用 `EMOptions#setCustomDeviceName` 方法设置登录设备的名称。设置后，若因达到了登录设备数量限制而导致在已登录的设备上强制退出时，被踢设备收到的 `EMConnectionListener#onLogout` 回调会包含导致该设备被踢下线的自定义设备名称。

:::notice
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
            public void onLogout(int errorCode, String info) {
               // 当 errorCode 为 {@link EMError#USER_LOGIN_ANOTHER_DEVICE}，info 表示将当前设备踢出/挤下线的自定义设备名称，若这种情况下设备未设置自定义名称，默认回调设备的型号。其他错误码场景下，info 为空。
            }
        });
```

### 设置登录设备的平台

即时通讯 IM 自 4.1.0 版本开始支持自定义设置登录设备的平台，例如将 Android 手机和 Android 系统的平板电脑设置为两个单独的平台，方便用户精细化控制同一平台的登录设备数量及平台间互踢等行为。

你可以按照以下步骤设置登录设备所属的平台：

1. 在环信控制台的**功能配置** > **功能配置总览**页面，点击**基础功能**页签，然后点击**多端多设备在线**对应的**设置**。在弹出的对话框中点击 **新增自定义平台**，在**添加自定义平台**对话框中设置**设备平台**和**设备数量**。

**设备平台**的取值范围为 [1,100]，**设备数量**的取值范围为 [0,4]。

![img](@static/images/common/multidevice_device_platform.png)

2. 初始化 SDK 时，调用 `EMOptions#setCustomOSPlatform` 方法自定义设置登录设备的平台。确保该方法中的 `platform` 参数的值与环信控制台的**添加自定义平台**对话框中设置的**设备平台**的值相同。

:::notice
登录成功后才会将该设置发送到服务器。
:::

```java
    EMOptions options=new EMOptions();
    options.setCustomOSPlatform(1);
    EMClient.getInstance().init(context,options);
```

### 强制指定账号从单个设备下线

你可以调用 `kickDevice` 或 `kickDeviceWithToken` 方法通过传入用户 ID 和登录密码或用户 token 将指定账号从单个登录设备踢下线。调用这两种方法前，你需要首先通过 `EMClient#getLoggedInDevicesFromServer` 和 `EMDeviceInfo#getResource` 方法获取设备 ID。

:::notice
不登录也可以使用该接口。
:::

```java
// username：账户名称，password：账户密码。需要在异步线程中执行。
List<EMDeviceInfo> deviceInfos = EMClient.getInstance().getLoggedInDevicesFromServer(username, password);
// username：账户名称，password：账户密码, resource：设备 ID。需要在异步线程中执行。
EMClient.getInstance().kickDevice(username, password, deviceInfos.get(selectedIndex).getResource());
//EMClient.getInstance().kickDeviceWithToken(username, token, deviceInfos.get(selectedIndex).getResource());
```

### 强制指定账号从所有设备下线

你可以调用 `kickAllDevices` 或 `kickAllDevicesWithToken` 方法通过传入用户 ID 和登录密码或用户 token 将指定账号从所有登录设备踢下线。

:::notice
不登录也可以使用该接口。
:::

```java
    try {
        EMClient.getInstance().kickAllDevices("username","pwd");
    } catch (HyphenateException e) {
        e.printStackTrace();
    }

    try {
        EMClient.getInstance().kickAllDevicesWithToken("username","token");
    } catch (HyphenateException e) {
        e.printStackTrace();
    }
```

### 获取其他设备上的操作

例如，账号 A 同时在设备 A 和 B 上登录，账号 A 在设备 A 上进行操作，设备 B 会收到这些操作对应的通知。

你需要先实现 `EMMultiDeviceListener` 类监听其他设备上的操作，然后调用 `addMultiDeviceListener` 方法添加多设备监听。

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

    @Override
        public void onChatThreadEvent(int event, String target, List<String> usernames) {
            EMLog.i(TAG, "onChatThreadEvent event"+event);
            switch (event) {
                case  THREAD_CREATE:
                    //当前用户在其他设备上创建子区。
                    break;
                case  THREAD_DESTROY:
                    //当前用户在其他设备上销毁子区。
                    break;
                case  THREAD_JOIN:
                    //当前用户在其他设备上加入子区。
                    break;
                case  THREAD_LEAVE:
                    //当前用户在其他设备上离开子区。
                    break;
                case  THREAD_UPDATE:
                    //当前用户在其他设备上更新子区。
                    break;
                case  THREAD_KICK:
                    //当前用户在其他设备上将成员踢出子区。
                    break;

            }
        }

        @Override
        public void onConversationEvent(int event, String conversationId, EMConversation.EMConversationType type) {
            EMLog.i(TAG, "onConversationEvent event"+event);
            switch (event) {
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

### 典型示例

当 PC 端和移动端登录同一个账号时，在移动端可以通过调用方法获取到 PC 端的登录 ID。该登录 ID 相当于特殊的好友用户 ID，可以直接使用于聊天，使用方法与好友的用户 ID 类似。

```java
List<String> selfIds = EMClient.getInstance().contactManager().getSelfIdsOnOtherPlatform();
```