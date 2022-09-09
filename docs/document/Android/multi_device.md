# 在多个设备上登录

<Toc />

## 功能描述

环信即时通讯 IM 支持同一个用户 ID 在多个平台或者多个设备上登录；

客户端支持查询当前账号的已登录设备列表，可强制该账号从其他已登录设备下线；

环信即时通讯 IM Android SDK 支持在同一账号所有已登录设备上同步在线消息和离线消息以及对应的回执和已读状态；

同一账号所有已登录的离线设备都可以接收推送；

在同一账号所有已登录设备上同步好友相关操作；

在同一账号所有已登录设备上同步群组和聊天室相关操作；

默认最多支持 4 个设备同时在线，具体见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。

## 技术原理

用户在 Android 端上初始化 SDK 时会生成一个识别设备的 ID，主要用于多设备登录和推送。服务器会自动分发新消息到各个登录中的设备。环信即时通讯 IM Android SDK 提供如下方法来实现多个设备上的互动功能。

- `getSelfIdsOnOtherPlatform` 获取在其他设备上登录的 ID；
- `EMMultiDeviceListener` 获取其他设备上进行的好友或者群组操作。

## 前提条件

开始前，请确保满足以下条件：

完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。

## 实现方法

### 获取其他设备上登录的 ID 和给其他设备发送消息

你可以调用 `getSelfIdsOnOtherPlatform` 方法来获取在其他设备上登录的 ID，将此 ID 作为消息接收方来发出消息，则其他设备上登录的账号可以收到消息，实现不同设备上相互发送文件等功能。

```java
List<String> ids = EMClient.getInstance().contactManager().getSelfIdsOnOtherPlatform();
//选择一个 ID 作为发送目标。
String toChatUsername = ids.get(0);
//创建一条文本消息，content 为消息文字内容，toChatUsername 为接收方 ID。
EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername); 
//发送消息。
EMClient.getInstance().chatManager().sendMessage(message); 
```

### 强制该账号从一个设备下线

```java
// username：账户名称，password：该账户密码。需要在异步线程中执行。
List<EMDeviceInfo> deviceInfos = EMClient.getInstance().getLoggedInDevicesFromServer(username, password);
// username：账户名称，password：该账户密码, resource：设备ID。需要在异步线程中执行。
EMClient.getInstance().kickDevice(username, password, deviceInfos.get(selectedIndex).getResource());
```

### 获取其他设备上进行的好友或者群组操作

账号 A 同时在设备 A 和设备 B 上登录，账号 A 在设备 A 上进行一些操作，设备 B 上会收到这些操作对应的通知。

你需要先实现 `EMMultiDeviceListener` 监听其他设备上的操作，再设置多设备监听。

```java
//实现 `EMMultiDeviceListener` 监听其他设备上的操作。
private class ChatEMMultiDeviceListener implements EMMultiDeviceListener {
//@param event 事件。
    @Override
    //@param target 联系⼈ ID； @param ext 扩展信息。
    public void onContactEvent(int event, String target, String ext) {
        EMLog.i(TAG, "onContactEvent event"+event);
        DemoDbHelper dbHelper = DemoDbHelper.getInstance(DemoApplication.getInstance());
        String message = null;
        switch (event) {
            //好友已经在其他设备上被移除。
            case CONTACT_REMOVE: 
            //好友请求已经在其他设备上同意。    
                break;
            case CONTACT_ACCEPT:
            //好友请求已经在其他设备上拒绝。
                break;    
            case CONTACT_DECLINE: 
            //当前用户在其他设备加某人进入黑名单。
                break;    
            case CONTACT_BAN: 
            // 好友在其他设备被移出黑名单。 
                break;   
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
    }
}

ChatMultiDeviceListener chatMultiDeviceListener = new ChatMultiDeviceListener();

//设置多设备监听。
EMClient.getInstance().addMultiDeviceListener(chatMultiDeviceListener);

//移除多设备监听。
EMClient.getInstance().removeMultiDeviceListener(chatMultiDeviceListener);
```

### 典型示例

当 PC 端和手机端登录同一个账号时，在手机端可以通过特定方法获取到 PC 端的设备 ID，该设备 ID 相当于特殊的好友 Username，可以直接使用于聊天，使用方法与好友类似。

```java
List<String> selfIds = EMClient.getInstance().contactManager().getSelfIdsOnOtherPlatform();
```