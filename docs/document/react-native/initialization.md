# 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

:::tip
需要在主进程中进行初始化。
:::

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见 [环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

初始化时，你需要通过 `ChatOptions` 中封装的 `appKey` 设置你的 App Key。

```typescript
ChatClient.getInstance()
  .init(
    new ChatOptions({
      appKey: appKey,
    }),
  )
  .then(() => {
    console.log("init: success");
  })
  .catch((reason) => {
    console.error(reason);
  });
```

下表列明初始化配置 `ChatOptions` 封装的一些属性。`ChatOptions` 封装的所有属性，详见 [API 参考](https://doc.easemob.com/apidoc/rn/classes/ChatOptions.html)。

| 属性 | 描述 |
| :----------------- | :---------------- |
| `appKey` | `appKey` 参数为创建 App 时在环信控制台上注册的 App 唯一识别符。 |
| `autoLogin` | 是否自动登录。<br/>-（默认）`true`：自动登录。**若使用默认设置，首次登录后，后续会自动登录。这种情况下，若再手动登录，则会提示用户已登录。**<br/>- `false`：不自动登录。 |
| `autoAcceptGroupInvitation` | 是否自动接受加群邀请。<br/>-（默认）`false`：不自动接受加群申请；<br/>- `true`：自动接受加群申请。 |
| `acceptInvitationAlways` | 是否自动接受加好友邀请。<br/>-（默认）`false`：不自动接受好友邀请；<br/>- `true`：自动接受好友邀请。 |
| `deleteMessagesAsExitChatRoom` | 退出（主动和被动退出）聊天室时是否删除聊天消息。<br/>-（默认）`true`：删除；<br/>- `false`：保留。 |
| `deleteMessagesAsExitGroup` | 退出（主动和被动退出）群组时是否删除聊天消息。<br/>-（默认）`true`：退出群组时删除群组消息；<br/>- `false`：退出群组时不删除群组消息。 |
| `isChatRoomOwnerLeaveAllowed` | 是否允许聊天室所有者离开并删除会话记录。<br/>-（默认）`true`：允许；<br/>- `false`：不允许。 |

## 设置登录后自动同步好友数据

React Native SDK 1.18.0 支持通过 `ChatOptions.withAppKey` 或 `ChatOptions.withAppId` 的 `enableAutoSyncContacts` 参数配置登录后是否自动从服务器同步好友列表和好友对象。该参数默认为 `false`；设置为 `true` 后，用户登录成功时，SDK 会同步好友数据并更新本地数据。

好友对象 `ChatContact` 包含好友用户 ID、好友备注和添加时间等信息，但不代表已经获取所有好友的昵称和头像。同步状态监听、好友列表和好友对象的本地读取方式，详见 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)。

## 开启用户信息自动管理

React Native SDK 1.18.0 支持通过 `ChatOptions` 的 `enableUserInfo` 参数配置用户信息自动管理功能。该参数默认为 `false`；设置为 `true` 后，SDK 会在用户登录成功时自动同步当前登录用户的用户属性。其他用户的用户属性会在接收相关消息、主动从服务端获取用户属性等场景下更新。

`enableUserInfo` 与 `enableAutoSyncContacts` 相互独立，开启用户信息自动管理不会在登录时自动获取所有好友的昵称和头像。用户属性更新事件、本地读取与主动获取方式，详见 [用户信息自动管理](userinfo_provider.html)。

如果两项功能都需要，可在同一次初始化中配置：

```typescript
const options = ChatOptions.withAppKey({
  appKey: 'your-org#your-app',
  enableAutoSyncContacts: true,
  enableUserInfo: true,
});

await ChatClient.getInstance().init(options);
```

## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```ts
ChatClient.getInstance().addConnectionListener({
  // SDK 成功连接到 IM 服务器时触发。
  onConnected(): void {
    console.log('LoginAndLogoutScreen.onConnected');
  },
  // SDK 与 IM 服务器断开连接时触发。
  onDisconnected(): void {
    console.log('LoginAndLogoutScreen.onDisconnected');
  },
});
ChatClient.getInstance().chatManager.addMessageListener({
   // 收到消息时触发。
   onMessagesReceived(messages: Array<ChatMessage>): void {
    console.log('onMessagesReceived: ', messages);
  },
});
```

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`withAppKey`](#初始化-sdk) / [`withAppId`](#初始化-sdk) | `ChatOptions` | `ChatOptions` | 使用 App Key 或 App ID 创建初始化配置。 |
| [`init`](#初始化-sdk) | `ChatClient` | `Promise<void>` | 使用指定配置初始化 React Native SDK。 |
| [`enableAutoSyncContacts`](#设置登录后自动同步好友数据) | `ChatOptions` | `boolean` | 登录后自动同步好友数据的初始化配置。 |
| [`enableUserInfo`](#开启用户信息自动管理) | `ChatOptions` | `boolean` | 用户信息自动管理的初始化配置。 |
| [`addContactListener`](#初始化后设置监听) | `ChatContactManager` | `void` | 添加好友关系、同步状态及好友信息监听器。 |
| [`addMessageListener`](#初始化后设置监听) | `ChatContactManager` | `void` | 添加消息相关监听器。 |

