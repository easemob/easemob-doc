# 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK 

初始化时，你需要通过 `appKey` 参数设置你的 App Key。

```typescript
let options = new ChatOptions({
  appKey: "你的 AppKey"
});
......// 其他 ChatOptions 配置。
// 初始化时传入上下文以及 options
ChatClient.getInstance().init(context, options);
```

自 SDK 1.8.0 开始，支持通过字面量的方式设置初始化时的条件，示例代码如下：
  
```typescript
ChatClient.getInstance().init(this.context, {
  appKey: "您的AppKey",
  appIDForPush: "您在 AppGallery Connect 获取到的 ClientID。",
  // 关闭自动登录
  isAutoLogin: false,
  // 其他更多设置
});
```

下表列明初始化配置 `ChatOptions` 封装的一些方法。`ChatOptions` 封装的所有方法，详见 [API 参考](https://doc.easemob.com/apidoc/harmony/chat3.0/classes/ChatOptions.ChatOptions.html)。

| 方法名称           | 描述            |
| :----------------- | :---------------- |
| `setAppKey(appKey)`                                   | 设置 App Key。<br/>`appKey` 参数为创建 app 时在环信控制台上注册的 app 唯一识别符。 |
| `setAutoLogin(autoLogin)`                            | 开启/关闭自动登录。<br/>`autoLogin` 参数表示是否开启自动登录： <br/> -（默认）`true`：自动登录。**若使用默认设置，首次登录后，后续会自动登录。这种情况下，若再手动登录，则会提示用户已登录。**<br/> -  `false`：不自动登录。 |
| `setAppIDForPush(appId)`                     | 设置用于推送的 app ID。         |
| `setAutoAcceptGroupInvitations(isAutoAcceptGroups)`                | 设置是否自动接受加群邀请。<br/>`isAutoAcceptGroups` 参数表示是否自动接受加群邀请。 <br/> -（默认）`true`：自动接受加群申请； <br/> -  `false`: 不自动接受加群申请。 |
| `setAcceptInvitationAlways(isAutoAccept)`                   | 设置是否自动接受加好友邀请。 <br/>`isAutoAccept` 参数表示是否自动接受加好友邀请。 <br/> -（默认）`true`：自动接受好友邀请。 <br/> -  `false`：不自动接收好友邀请。 |
| `setDeleteMessagesOnLeaveChatroom(isDeleteMessageOnLeaveChatroom)`            | 设置退出（主动或被动退出）聊天室时是否删除聊天消息。<br/>`isDeleteMessageOnLeaveChatroom` 的值如下：<br/> -（默认）`true`：删除。 <br/> -  `false`：保留。 |
| `setDeleteMessagesOnLeaveGroup(isDeleteMessagesOnLeaveGroup)`               | 设置退出（主动或被动退出）群组时是否删除聊天消息。<br/>`isDeleteMessagesOnLeaveGroup` 的值如下：<br/> -（默认）`true`：删除。 <br/> -  `false`：保留。 |
| `allowChatroomOwnerLeave(isChatroomOwnerLeaveAllowed)`                   | 设置是否允许聊天室所有者离开并删除会话记录。`isChatroomOwnerLeaveAllowed` 的值如下：<br/> - （默认） `true`：允许。即使聊天室所有者离开，该所有者仍具有聊天室的所有权限，只不过不再接收任何消息。<br/> - `false`：不允许。 |
| `setEnableAutoSyncContacts(enableAutoSyncContacts)` | 设置登录成功后是否自动同步好友列表和好友信息。<br/> - `true`：自动同步。<br/> -（默认）`false`：不自动同步。必须在 `init` 前设置。 |
| `setEnableUserInfo(enableUserInfo)` | 设置是否开启用户信息自动管理。<br/> - `true`：开启。<br/> -（默认）`false`：关闭。必须在 `init` 前设置。 |

关于私有云 SDK 的 IP 地址/域名配置，详见 [配置文档](private_ip_domain.html)。

## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```typescript
    // 设置连接状态监听器。
    ChatClient.getInstance().addConnectionListener({
      onConnected: (): void => {
        // SDK 成功连接到 IM 服务器时触发。
      },
      onDisconnected: (errorCode: number): void => {
        // SDK 与 IM 服务器断开连接时触发。
      }
    });
    // 设置消息监听器。
    ChatClient.getInstance().chatManager()?.addMessageListener({
      onMessageReceived: (messages: ChatMessage[]): void => {
        // 处理接收到的消息
      }
    });
```

## 设置登录后自动同步好友数据

HarmonyOS SDK 1.14.0 可通过 `ChatOptions#setEnableAutoSyncContacts` 设置登录后是否自动同步好友列表和好友对象。该配置默认为 `false`；如需开启，必须在初始化 SDK 前设置为 `true`。好友对象包含用户 ID、备注和添加时间等信息，不代表已获取所有好友的昵称和头像。

可调用 `ChatOptions#isEnableAutoSyncContacts` 查询当前是否已开启该功能。

同步状态监听、好友列表和好友对象的本地读取方式，详见[登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)。

## 开启用户信息自动管理

自 HarmonyOS SDK 1.13.0 起，可通过 `ChatOptions#setEnableUserInfo` 设置用户信息自动管理功能。该配置默认为 `false`。设置为 `true` 后，SDK 会在登录成功时自动同步**当前登录用户**的属性；其他用户的属性可在接收相关消息和主动从服务端拉取用户属性等场景下更新。该配置与 `setEnableAutoSyncContacts` 相互独立，**不会在登录时自动获取所有好友的昵称和头像**。

可调用 `ChatOptions#isEnableUserInfo` 查询当前是否已开启该功能。

如果两项功能都需要，可在同一次初始化中配置：

```typescript
const options = new ChatOptions({
  appKey: 'your_app_key'
});

options.setEnableAutoSyncContacts(true);
options.setEnableUserInfo(true);

ChatClient.getInstance().init(context, options);
```

用户属性更新事件、本地读取与主动获取方式，详见[用户信息自动管理](userinfo_provider.html)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`init`](#初始化-sdk) | `ChatClient` | 使用指定配置初始化 HarmonyOS SDK。 |
| [`addConnectionListener`](#初始化后设置监听) | `ChatClient` | 添加连接状态监听器。 |
| [`addMessageListener`](#初始化后设置监听) | `ChatManager` | 添加消息监听器。 |
| [`setEnableAutoSyncContacts`](#设置登录后自动同步好友数据) | `ChatOptions` | 设置登录后是否自动同步好友列表和好友对象。 |
| [`isEnableAutoSyncContacts`](#设置登录后自动同步好友数据) | `ChatOptions` | 查询登录后是否自动同步好友数据。 |
| [`setEnableUserInfo`](#开启用户信息自动管理) | `ChatOptions` | 设置是否开启用户信息自动管理。 |
| [`isEnableUserInfo`](#开启用户信息自动管理) | `ChatOptions` | 查询是否已开启用户信息自动管理。 |
