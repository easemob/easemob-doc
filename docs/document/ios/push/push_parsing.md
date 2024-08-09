# 解析收到的推送字段

当设备收到推送通知并点击时，iOS 系统会将推送通知中的自定义推送内容（JSON）传递给 app，这样你就可以根据推送内容自定义点击推送通知触发的行为，例如，页面跳转等。当收到推送通知并点击时，app 获取推送内容的方式如下：

- 若 app 中使用了 `SceneDelegate`，app 的启动流程通过场景系统进行管理。当你点击离线推送的消息打开 app 时，app 将首先启动场景，然后调用 `SceneDelegate` 中的相应方法处理场景的连接和配置。你需要在 `SceneDelegate` 的 `scene(_:willConnectTo:options:)` 方法中查看 `connectionOptions` 参数获取推送内容，示例代码如下：

```objectivec
- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions {
    // 获取启动选项
    NSDictionary *launchOptions = connectionOptions.notificationResponse.notification.request.content.userInfo;
    // 进行相应的处理
    // ...
}
```

- 若 app 中不使用 `SceneDelegate`，iOS 系统会通过 `application:didFinishLaunchingWithOptions:` 方法中的 `launchOptions` 将推送中的用户自定义信息传递给 app。你需要查看 `launchOptions` 参数获取推送内容。

```plaintext
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
      NSDictionary *userInfo = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
  }
  
```

推送中的用户自定义信息的数据结构：

```plaintext
{
    "aps":{
        "alert":{
            "body":"你有一条新消息"
        },   
        "badge":1,               
        "sound":"default"   
    },
    "f":"6001",                  
    "t":"6006", 
    "g":"1421300621769",    
    "m":"373360335316321408"
}
```

| 参数    | 描述                    |
| :------ | :----------------------|
| `body`  | 显示内容。              |
| `badge` | 角标数。                |
| `sound` | 提示铃声。              |
| `f`     | 消息发送方的用户 ID。    |
| `t`     | 消息接收方的与用户 ID。  |
| `g`     | 群组 ID，单聊无该字段。  |
| `m`     | 消息 ID。               |