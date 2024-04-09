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

用户在端上初始化 SDK 时会生成设备识别 ID，用于多设备登录和推送。服务器会将新消息发送到已登录的设备。环信即时通讯 IM SDK 提供以下多设备场景功能：

- 获取当前用户的其他已登录设备的登录 ID 列表，并向这些设备发送消息；
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

### 获取当前用户的其他已登录设备的登录 ID 列表

你可以调用 `GetSelfIdsOnOtherPlatform` 方法获取其他登录设备的登录 ID 列表，然后选择目标登录 ID 作为消息接收方向指定设备发送消息。

```csharp
SDKClient.Instance.ContactManager.GetSelfIdsOnOtherPlatform(new ValueCallBack<List<string>>(
  onSuccess: (list) =>
  {
    // 选择一个登录 ID 作为消息接收方。
    string toChatUsername = list[0];
    string content = "content";
    // 创建一条文本消息，content 为消息文字内容，toChatUsername 传入登录 ID 作为消息接收方。
    Message msg = Message.CreateTextSendMessage(toChatUsername, content);
    // 发送消息。
    SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
	    onSuccess: () => {

	    },
	    onProgress: (progress) => {

	    },
	    onError: (code, desc) => {

	    }
    ));
  },
  onError: (code, desc) =>
  {

  }
));
```

### 获取指定账号的在线登录设备列表

你可以调用 `GetLoggedInDevicesFromServer` 或 `GetLoggedInDevicesFromServerWithToken` 方法通过传入用户 ID 和登录密码或用户 token 从服务器获取指定账号的在线登录设备的列表。

```csharp
SDKClient.Instance.GetLoggedInDevicesFromServer(username, password,
	callback: new ValueCallBack<List<DeviceInfo>>(

    onSuccess: (list) =>
    {

    },

    onError: (code, desc) =>
    {

    }
   )
);

SDKClient.Instance.GetLoggedInDevicesFromServerWithToken(username, token,
	callback: new ValueCallBack<List<DeviceInfo>>(

    onSuccess: (list) =>
    {

    },

    onError: (code, desc) =>
    {

    }
  )
);
```

调用该方法后，在 SDK 返回的信息中，`DeviceInfo` 中的 `DeviceName` 属性的含义如下：
- 若指定账号自定义了设备名称，该属性表示自定义设备名称。
- 若未自定义设备的名称，该属性默认为设备型号。

### 设置登录设备的名称

即时通讯 IM 自 1.2.0 版本开始支持自定义设置设备名称，这样在多设备场景下，若有设备被踢下线，你就能知道是被哪个设备挤下线的。

初始化 SDK 时，你可以调用 `Options#CustomDeviceName` 方法设置登录设备的名称。设置后，若因达到了登录设备数量限制而导致在已登录的设备上强制退出时，被踢设备收到的 `IConnectionDelegate#OnLoggedOtherDevice` 回调会包含导致该设备被踢下线的自定义设备名称。

:::tip
登录成功后才会将该设置发送到服务器。
:::

```csharp
// 设置设备名称并进行初始化
Options options = new Options("YouAppKey");
ooptions.CustomDeviceName = "MyDeviceName";
SDKClient.Instance.InitWithOptions(options);

// 定义监听器
public class ConnectionDelegate : IConnectionDelegate {

    public void OnLoggedOtherDevice(string deviceName)
    {

    }
  }

// 注册监听器。
ChatManagerDelegate adelegate = new ChatManagerDelegate();
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);

// 不使用监听器时需要移除监听器。
SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(adelegate);
```

### 设置登录设备的平台

即时通讯 IM 自 1.2.0 版本开始支持自定义设置登录设备的平台，方便用户精细化控制同一平台的登录设备数量及平台间互踢等行为。

你可以按照以下步骤设置登录设备所属的平台：

1. 在环信控制台的**功能配置** > **功能配置总览**页面，点击**基础功能**页签，然后点击**多端多设备在线**对应的**设置**。在弹出的对话框中点击 **新增自定义平台**，在**添加自定义平台**对话框中设置**设备平台**和**设备数量**。

**设备平台**的取值范围为 [1,100]，**设备数量**的取值范围为 [0,4]。

![img](@static/images/common/multidevice_device_platform.png)

2. 初始化 SDK 时，调用 `Options#CustomOSType` 方法自定义设置登录设备的平台。确保该方法中的 `platform` 参数的值与环信控制台的**添加自定义平台**对话框中设置的**设备平台**的值相同。

:::tip
登录成功后才会将该设置发送到服务器。
:::

```csharp
Options options = new Options("YouAppKey");
options.CustomOSType = 1;
SDKClient.Instance.InitWithOptions(options);
```


### 强制指定账号从单个设备下线

你可以调用 `KickDevice` 或 `KickDeviceWithToken` 方法通过传入用户 ID 和登录密码或用户 token 将指定账号从单个登录设备踢下线。调用这两种方法前，你需要首先通过 `SDKClient#GetLoggedInDevicesFromServer` 和 `DeviceInfo#Resource` 方法获取设备 ID。

:::tip
不登录也可以使用该接口。
:::

```csharp
// username：账户名称，password：账户密码。
SDKClient.Instance.GetLoggedInDevicesFromServer(username, password,
	callback: new ValueCallBack<List<DeviceInfo>>(

    onSuccess: (list) =>
    {
      // 此处从DeviceInfo列表中获取各个Resource
    },

    onError: (code, desc) =>
    {

    }
  )
);

// username：账户名称，password：账户密码, resource：设备 ID。
SDKClient.Instance.KickDevice(username, password, resource,
	callback: new CallBack(

    onSuccess: () =>
    {

    },

    onError: (code, desc) =>
    {

    }
  )
);

/*
SDKClient.Instance.KickDeviceWithToken(username, token, resource,
	callback: new CallBack(

    onSuccess: () =>
    {

    },

    onError: (code, desc) =>
    {

    }
  )
);
*/
```

### 强制指定账号从所有设备下线

你可以调用 `KickAllDevices` 或 `KickAllDevicesWithToken` 方法通过传入用户 ID 和登录密码或用户 token 将指定账号从所有登录设备踢下线。

:::tip
不登录也可以使用该接口。
:::

```csharp
SDKClient.Instance.KickAllDevices(username, password,
	callback: new CallBack(

    onSuccess: () =>
    {

    },

    onError: (code, desc) =>
    {

    }
  )
);

SDKClient.Instance.KickAllDevicesWithToken(username, token,
  callback: new CallBack(

    onSuccess: () =>
    {

    },

    onError: (code, desc) =>
    {

    }
   )
);
```

### 获取其他设备的好友或者群组操作

账号 A 同时在设备 A 和设备 B 上登录，账号 A 在设备 A 上进行一些操作，设备 B 上会收到这些操作对应的通知。

你需要先实现 `IMultiDeviceDelegate` 监听其他设备上的操作，再设置多设备监听器。

```csharp
//继承并实现 IMultiDeviceDelegate。
public class MultiDeviceDelegate : IMultiDeviceDelegate {
	public void onContactMultiDevicesEvent(MultiDevicesOperation operation, string target, string ext) {
            ......
            switch (operation) {
            //好友已在其他设备上被移除。
            case CONTACT_REMOVE: 
            //好友请求已在其他设备上同意。    
                break;
            case CONTACT_ACCEPT:
            //好友请求已在其他设备上被拒绝。
                break;    
            case CONTACT_DECLINE: 
            //当前用户在其他设备加某人进入黑名单。
                break;    
            case CONTACT_BAN: 
            //好友在其他设备被移出黑名单。 
                break;   
            case CONTACT_ALLOW:
                break; 
        }
    }

    public void onGroupMultiDevicesEvent(MultiDevicesOperation operation, string target, List<string> usernames) {
            ......
            switch (operation) {
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
            //当前⽤户在其他设备发起了群组申请。
            case GROUP_APPLY:
                break;
            //当前⽤户在其他设备同意了群组申请。
            case GROUP_APPLY_ACCEPT:
                break;
            //当前⽤户在其他设备拒绝了群组申请。
            case GROUP_APPLY_DECLINE:
                break;
            //当前⽤户在其他设备邀请了群成员。
            case GROUP_INVITE:
                break;
            //当前⽤户在其他设备同意了群组邀请。
            case GROUP_INVITE_ACCEPT:
                break;
            //当前⽤户在其他设备拒绝了群组邀请。
            case GROUP_INVITE_DECLINE:
                break;
            //当前⽤户在其他设备将某⼈踢出群。
            case GROUP_KICK:
                break;
            //当前⽤户在其他设备将成员加⼊群组⿊名单。
            case GROUP_BAN:
                break;
            //当前⽤户在其他设备将成员移除群组⿊名单。
            case GROUP_ALLOW:
                break;
            //当前⽤户在其他设备屏蔽群组。
            case GROUP_BLOCK:
                break;
            //当前⽤户在其他设备取消群组屏蔽。
            case GROUP_UNBLOCK:
                break;
            //当前⽤户在其他设备转移群主。
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
            default:
                break;
        }
        ......
    }
}

//注册监听器。
MultiDeviceDelegate adelegate = new MultiDeviceDelegate();
SDKClient.Instance.AddMultiDeviceDelegate(adelegate);

//移除监听器。
SDKClient.Instance.DeleteMultiDeviceDelegate(adelegate);
```