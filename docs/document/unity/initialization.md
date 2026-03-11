# 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

:::tip
需要在主进程中进行初始化。
:::

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK 

初始化时，你需要通过 `EMOptions` 中封装的 `appKey` 设置你的 App Key。

```csharp
var options = new Options("appkey"); //将该参数设置为你的 App Key
//其他 Options 配置。
SDKClient.Instance.InitWithOptions(options);
```

下表列明初始化配置 `Options` 封装的一些属性。`Options` 封装的所有属性，详见 [API 参考](https://doc.easemob.com/apidoc/unity/class_agora_chat_1_1_options.html)。

| 属性           | 描述            |
| :----------------- | :---------------- |
| `appKey`     | `appkey` 参数为创建 app 时在环信控制台上注册的 app 唯一识别符。 |
| `AutoLogin`                            | 是否自动登录。<br/> -（默认）`true`：自动登录。**若使用默认设置，首次登录后，后续会自动登录。这种情况下，若再手动登录，则会提示用户已登录。**<br/> -  `false`：不自动登录。 |
| `AutoAcceptGroupInvitation`         | 是否自动接受加群邀请。<br/> -（默认）`true`：自动接受加群申请； <br/> -  `false`: 不自动接受加群申请。 |
| `AcceptInvitationAlways`                   | 是否自动接受加好友邀请。 <br/> -（默认）`true`：自动接受好友邀请。 <br/> -  `false`：不自动接收好友邀请。 |
| `DeleteMessagesAsExitRoom`         | 退出(主动和被动退出)聊天室时是否删除聊天消息。<br/> -（默认）`true`：删除。 <br/> -  `false`：保留。 |
| `DeleteMessagesAsExitGroup`               | 退出(主动和被动退出)群组时是否删除聊天消息。<br/> -（默认）`true`: 退出群组时删除群组消息。 <br/> -  `false`: 退出群组时不删除群组消息。 |
| `IsRoomOwnerLeaveAllowed`                   | 是否允许聊天室所有者离开并删除会话记录。<br/> - （默认） `true`：允许。即使聊天室所有者离开，该所有者仍具有聊天室的所有权限，只不过不再接收任何消息。<br/> - `false`：不允许。 |

## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```csharp
// 添加连接监听器
class ConnectionDelegate : IConnectionDelegate
{
    public void OnConnected()
    {
         // SDK 成功连接到 IM 服务器时触发。
    }
    public void OnDisconnected()
    {
        // SDK 与 IM 服务器断开连接时触发。
    }
}
ConnectionDelegate connectionDelegate = new ConnectionDelegate();
SDKClient.Instance.AddConnectionDelegate(connectionDelegate);
// 设置消息监听器。
public class ChatManagerDelegate : IChatManagerDelegate {

    //实现 OnMessagesReceived 回调。
    public void OnMessagesReceived(List<Message> messages)
    {
     // 处理接收到的消息
    }
}
ChatManagerDelegate adelegate = new ChatManagerDelegate();
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);
```
