# 在多个设备上登录

[[toc]]

环信即时通讯 IM 支持同一个用户 ID 在多个平台或者多个设备上登录；

客户端支持查询当前账号的已登录设备列表，可强制该账号从其他已登录设备下线；

环信即时通讯 IM SDK 支持在同一账号所有已登录设备上同步在线和离线消息以及对应的回执和已读状态、接收离线推送通知、同步好友、群组以及聊天室相关的操作。

默认最多支持 4 个设备同时在线，具体见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。

## 技术原理

用户在端上初始化 SDK 时会生成设备识别 ID，用于多设备登录和推送。服务器会将新消息发送到已登录的设备。环信即时通讯 IM SDK 提供如下方法实现多个设备上的互动功能。

- `GetSelfIdsOnOtherPlatform` 获取其他登录设备的 ID；
- `IMultiDeviceDelegate` 获取其他设备上进行的好友或者群组操作。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](https://docs-im.easemob.com/ccim/unity/quickstart)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](https://docs-im.easemob.com/ccim/limitation)。
- 了解环信即时通讯 IM 的套餐包，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 实现方法

### 获取其他登录设备的 ID 和对其他设备发送消息

你可以调用 `GetSelfIdsOnOtherPlatform` 方法获取其他登录设备的 ID。你在当前设备上发送消息时，其他设备通过这些 ID 接收消息，实现不同设备之间的消息传输。

```csharp
SDKClient.Instance.ContactManager.GetSelfIdsOnOtherPlatform(new ValueCallBack<List<string>>(

  // GetSelfIdsOnOtherPlatform 返回成功，list 类型为 List<string>。
  onSuccess: (list) => {

    //选择一个 设备 ID 作为发送目标。
    string toChatUsername = list[0];

    //创建一条文本消息，content 为消息文本，`toChatUsername` 为接收方的用户 ID。
    Message msg = Message.CreateTextSendMessage(toChatUsername, content);

    //发送消息。
    SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
       onSuccess: () => {
       },
       onError:(code, desc) => {
        }            
     ));
  },

  // `GetSelfIdsOnOtherPlatform` 返回失败。
  onError: (code, desc) => {
  }
));
```

### 获取其他设备上进行的好友或者群组操作

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