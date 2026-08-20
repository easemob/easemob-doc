# Parse Received Push Fields

When a device receives and taps a push notification, the iOS system passes the custom push content (JSON) in the notification to the app. You can then customize the behavior triggered by tapping the push notification based on the push content, such as page navigation. The app obtains push content in the following way when a push notification is received and tapped:

- If `SceneDelegate` is used in the app, the app launch flow is managed by the scene system. When you tap an offline push notification to open the app, the app first starts the scene and then calls the corresponding methods in `SceneDelegate` to handle the scene connection and configuration. You need to check the `connectionOptions` parameter in the `scene(_:willConnectTo:options:)` method of `SceneDelegate` to get the push content. The sample code is as follows:

```objectivec
- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions {
    // Get launch options.
    NSDictionary *launchOptions = connectionOptions.notificationResponse.notification.request.content.userInfo;
    // Perform the corresponding processing.
    // ...
}
```

- If `SceneDelegate` is not used in the app, the iOS system passes the custom user information in the push notification to the app through `launchOptions` in the `application:didFinishLaunchingWithOptions:` method. You need to check the `launchOptions` parameter to get the push content.

```objectivec
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
      NSDictionary *userInfo = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
  }
  
```

Data structure of the custom user information in the push notification:

```json
{
    "aps":{
        "alert":{
            "body":"You have a new message"
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

| Parameter | Description |
| :------ | :----------------------|
| `body` | Display content. |
| `badge` | Badge count. |
| `sound` | Notification sound. |
| `f` | User ID of the message sender. |
| `t` | User ID of the message receiver. |
| `g` | Group ID. This field does not exist for one-to-one chat. |
| `m` | Message ID. |
