# 在多个设备登录

<Toc />

即时通讯 IM 支持同一账号在多个设备上登录，所有已登录的设备同步以下信息和操作：

- 在线消息、离线消息以及对应的回执和已读状态；
- 好友和群组操作；
- 子区相关操作；
- 会话相关操作。

环信服务器提供 RESTful 接口[查询每个账号已登录设备列表](/document/server-side/account_system.html#获取指定账号的在线登录设备列表)以及[将账号从已登录设备强制下线](/document/server-side/account_system.html#强制用户下线)。

使用该服务前，你需要在[环信即时通讯控制台](https://console.easemob.com/user/login)的 **即时通讯** > **功能配置** > **功能配置总览** > **基础功能** 页面上查找**多端多设备在线**，开启该功能。

多端登录时，即时通讯 IM 每端默认最多支持 4 个设备同时在线。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。你可以在环信控制台的**基础功能**页签下点击**多端多设备在线**操作栏中的**设置**，在弹出的对话框中设置各端设备的数量：

![img](@static/images/common/multidevice_device_count.png)

单端和多端登录场景下的互踢策略如下：

- 单端登录：新登录的设备会将当前在线设备踢下线。 
- 多端登录：若一端的登录设备数量达到了上限，最新登录的设备会将该端最早登录的设备踢下线。即时通讯 IM 仅支持同端互踢，不支持各端之间互踢。

:::tip
你可以调用 REST API 将指定账号强制[从单个设备下线](/document/server-side/account_system.html#强制用户从单设备下线 )和[从所有设备下线](/document/server-side/account_system.html#强制用户下线)。
:::

## 技术原理

即时通讯 IM Web SDK 在用户每次登录时会生成一个新的唯一的登录 ID，并将该 ID 发送到服务器。服务器会自动将新消息发送到用户登录的设备，可以自动监听到其他设备上进行的好友或群组操作。

## 实现方法

### 获取当前用户的其他登录设备的登录 ID 列表  

你可以调用 `getSelfIdsOnOtherPlatform` 方法获取其他登录设备的登录 ID 列表，然后选择目标登录 ID 作为消息接收方向指定设备发送消息。

```javascript
conn.getSelfIdsOnOtherPlatform().then((res) => {
  console.log(res, '获取当前用户其他登录设备的登录 Id 列表成功');
  // 选择一个登录 ID 作为消息接收方。
  const toUserId = res.data[0];
  // toUserId 作为消息接收方。
  let option = {
    type: "txt",
    msg: "message content",
    to: toUserId,
    chatType: "singleChat",
  };
  // 创建消息。
  const msg = WebIM.message.create(option);
  // 发送消息。
  conn.send(msg);
})
```

### 获取其他设备上的操作

你需要调用 `addEventHandler` 方法注册监听事件，监听其他设备上的操作。服务器同步信息之后，SDK 会回调这些事件，Web 端与其他端均会收到好友和群组相关操作的通知。

对于好友和群组的相关操作来说，多设备事件与单设备事件的名称相同，唯一区别在于事件中的 `from` 字段，即多端多设备事件中该字段的值为当前用户的用户 ID，而单设备事件中，该字段的值为操作方的用户 ID。详见[群组事件](group_manage.html#监听群组事件)和[用户关系事件](user_relationship.html#添加好友)。

子区和删除漫游消息事件会触发 `onMultiDeviceEvent` 事件，示例代码如下：

```javascript
conn.addEventHandler("handlerId", {
  onContactAgreed: (event) => {},
  onGroupEvent: (event) => {},
  onMultiDeviceEvent: (event) => {
    switch (event.operation) {
      case "chatThreadCreate":
        //当前用户在其他设备上创建子区。
        break;
      case "chatThreadDestroy":
        //当前用户在其他设备上销毁子区。
        break;
      case "chatThreadJoin":
        //当前用户在其他设备上加入子区。
        break;
      case "chatThreadLeave":
        //当前用户在其他设备上离开子区。
        break;
      case "chatThreadNameUpdate":
        //当前用户在其他设备上更新子区。
        break;
      case "deleteRoaming":
        //当前用户在其他设备上删除了服务端的会话。
        break;
      case "memberAttributesUpdate":
        //当前用户在其他设备上更新了群成员属性。
        break;
      case "deleteRoaming":
        //当前用户在其他设备上删除历史消息。
        break;
      case "deleteConversation":
        //当前用户在其他设备上删除会话。
        break;
      case "pinnedConversation":
        //当前用户在其他设备上置顶会话。
        break;
      case "unpinnedConversation":
        //当前用户在其他设备上取消置顶会话。
        break;
      case "markConversation":
        //当前用户在其他设备上标记会话。
        break;
      case "unMarkConversation":
        //当前用户在其他设备上取消标记会话。
        break;  
      default:
        break;
    }
  },
});
```
