# Initialization

Initialization is required to use the SDK and must be completed before you call other SDK APIs.

`EMClient` is a singleton. **If the initialization API is called multiple times in the same process, only the first initialization and its configuration take effect.** Therefore, complete all `EMOptions` configuration before initializing the SDK.

:::tip
Initialize the SDK in the app's main process. After initialization succeeds, register listeners and perform operations such as login.
:::

## Prerequisite

Register a valid EasyIM developer account, create an app, and obtain the app's App Key. For details, see the [EasyIM Console documentation](/product/console/app_create.html).

## Initialize the SDK

Create `EMOptions` with the App Key, complete other configuration according to your business requirements, and pass it to `EMClient.initializeSDK(with:)`.

```swift
let options = EMOptions(appkey: "your-org#your-app")

// Continue setting other EMOptions configurations according to your business requirements.
options.enableConsoleLog = true

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK initialization failed: \(error.errorDescription)")
}
```

`initializeSDK(with:)` synchronously returns `EMError?`: `nil` indicates that initialization succeeded, while a non-empty error indicates that initialization failed. A parameter error is returned if the App Key is empty or has an invalid format.

The following table lists commonly used `EMOptions` properties for initialization. For all `EMOptions` properties, see the [API reference](https://doc.easyim.ai/apidoc/ios/chat3.0/interface_e_m_options.html).

| Property | Description |
| :--- | :--- |
| `appkey` | The unique identifier of the app, passed through `EMOptions(appkey:)`. Its format is generally `appName`. This property is read-only. |
| `enableConsoleLog` | Whether to output logs to the console.<br/> - `true`: Outputs logs.<br/> - (Default) `false`: Does not output logs. |
| `apnsCertName` | The APNs push certificate name. It must be set before initialization and cannot be changed at runtime. |
| `pushKitCertName` | The PushKit certificate name. It must be set before initialization and cannot be changed at runtime. |
| `autoAcceptGroupInvitation` | Whether to automatically accept chat group invitations.<br/> - (Default) `true`: Automatically accepts them.<br/> - `false`: Does not automatically accept them. |
| `autoAcceptFriendInvitation` | Whether to automatically accept friend invitations. In the current iOS 5.0.0 implementation, the default value is `false`.<br/> - `true`: Automatically accepts them.<br/> - (Default) `false`: Does not automatically accept them. |
| `deleteMessagesOnLeaveChatroom` | Whether to delete a chat room's local messages when the user actively or passively leaves the chat room.<br/> - (Default) `true`: Deletes them.<br/> - `false`: Retains them. |
| `deleteMessagesOnLeaveGroup` | Whether to delete a chat group's local messages when the user actively or passively leaves the chat group.<br/> - (Default) `true`: Deletes them.<br/> - `false`: Retains them. |
| `canChatroomOwnerLeave` | Whether to allow the chat room owner to leave the chat room.<br/> - (Default) `true`: Allows the owner to leave.<br/> - `false`: Does not allow the owner to leave. |
| `dataSyncType` | Configures the data types automatically synchronized after login. This property is an `EMDataSyncType` bit option and can combine conversations, friends, and joined chat groups. We recommend explicitly setting it before initialization instead of relying on the default value. |

For details about configuring an IP address or domain for the private-cloud SDK, see [Private Cloud SDK IP Address/Domain Configuration](private_ip_domain.html).

## Set listeners after initialization

After initialization is complete, you can register connection-state and message listeners to detect connection changes between the SDK and the EasyIM server and receive new messages. When `nil` is passed to `delegateQueue`, the current implementation dispatches callbacks to the main queue.

```swift
final class ChatListener: NSObject, EMClientDelegate, EMChatManagerDelegate {
    func start() {
        // Register listeners for connection state and data synchronization.
        EMClient.shared().add(self, delegateQueue: nil)

        // Register the message listener.
        EMClient.shared().chatManager?.add(self, delegateQueue: nil)
    }

    func stop() {
        // Remove the listeners when they are no longer required to avoid duplicate callbacks.
        EMClient.shared().removeDelegate(self)
        EMClient.shared().chatManager?.remove(self)
    }

    func connectionStateDidChange(_ connectionState: EMConnectionState) {
        if connectionState == .connected {
            // The SDK is connected to the EasyIM server.
        } else {
            // The SDK is disconnected from the EasyIM server.
        }
    }

    func messagesDidReceive(_ messages: [EMChatMessage]) {
        // Process the received messages.
    }
}
```

The SDK automatically reconnects after a weak-network disconnection, so manual reconnection is unnecessary. If a non-main queue is specified for a listener, switch to the main thread before updating the UI.

:::tip
1. The start and completion states of automatic data synchronization after login are returned through `EMClientDelegate` callbacks. For details, see [Monitor synchronization status](#monitor-synchronization-status).
2. The database open state is returned through the `onDatabaseOpened(_:username:)` callback. You can safely read the current user's local database data only after the database has been opened successfully.
:::

## Set automatic data synchronization after login

### Synchronized data

The iOS SDK supports configuring the data types automatically synchronized after login through `EMOptions.dataSyncType` before initialization. After a user logs in successfully, the SDK synchronizes server-side data according to the configuration and updates the local cache or database.

`EMDataSyncType` is a bit option. You can use an array literal to combine multiple values. Currently, the SDK supports synchronizing the conversation list, friend list, and list of chat groups that the current user has joined.

| Configuration | Data automatically synchronized after login | Local read method | Description |
| :--- | :--- | :--- | :--- |
| `.conversations` | Conversation list | `EMClient.shared().chatManager?.getAllConversations()` | Reads conversations from the SDK's local cache or database. |
| `.contacts` | Friend list | `EMClient.shared().contactManager?.getContacts()` or `getAllContacts()` | `getContacts()` returns friend user IDs; `getAllContacts()` returns `EMContact` objects that contain friend information. |
| `.joinedGroups` | List of chat groups that the current user has joined | `EMClient.shared().groupManager?.getJoinedGroups()` | Reads the chat group list from the SDK's local cache or database. |
| `.none` | No automatic synchronization | — | Does not synchronize the preceding data. Do not combine it with other options. |

### Configuration method

You must set `dataSyncType` before calling `initializeSDK(with:)`. Changing it after SDK initialization is complete does not change the initialization configuration of the current SDK instance.

The following example automatically synchronizes conversations, friends, and joined chat groups after login succeeds:

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.dataSyncType = [.conversations, .contacts, .joinedGroups]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK initialization failed: \(error.errorDescription)")
}
```

To synchronize only the conversation list, configure only `.conversations`:

```swift
options.dataSyncType = [.conversations]
```

If automatic synchronization after login is not required, explicitly configure `.none`:

```swift
options.dataSyncType = .none
```

:::tip
When the current iOS 5.0.0 implementation creates `EMOptions`, it initializes `dataSyncType` to synchronize conversations, but the public header comments and change notes document the default value as `.none`. To ensure explicit behavior that is not affected by version differences, we recommend always setting this property explicitly.
:::

### Monitor synchronization status

The SDK uses `EMClientDelegate` to notify you when synchronization of each data type starts and finishes:

- `syncDataStartWithType:`: Triggered when synchronization of a data type starts.
- `syncDataFinished:type:`: Triggered when synchronization of a data type finishes. It is triggered when synchronization succeeds, fails, times out, or ends because of a disconnection. `error == nil` indicates that synchronization succeeded.


The following example uses Objective-C to declare the corresponding exact selectors for monitoring synchronization:

```objective-c
- (void)syncDataStartWithType:(EMDataSyncType)type
{
    NSLog(@"Data synchronization started: %ld", (long)type);
}

- (void)syncDataFinished:(EMError * _Nullable)error
                     type:(EMDataSyncType)type
{
    if (error == nil) {
        NSLog(@"Data synchronization succeeded: %ld", (long)type);
    } else {
        NSLog(@"Data synchronization failed: type=%ld, error=%@", (long)type, error);
    }
}

- (void)onDatabaseOpened:(EMError * _Nullable)error
                 username:(NSString *)username
{
    if (error == nil) {
        NSLog(@"Database opened: %@", username);
    }
}
```


```swift
func syncDataStart(with type: EMDataSyncType) {
    print("Data synchronization started: \(type)")
}

func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
    if let error {
        print("Data synchronization failed: type=\(type), error=\(error.errorDescription)")
    } else {
        print("Data synchronization succeeded: \(type)")
    }
}

func onDatabaseOpened(_ error: EMError?, username: String) {
    if let error {
        print("Failed to open the database: \(error.errorDescription)")
    } else {
        print("Database opened: \(username)")
    }
}
```

The object that registers the preceding listeners must conform to `EMClientDelegate` and be added to `EMClient` through `addDelegate:delegateQueue:`.

### Read synchronization results after login

After the `syncDataFinished:type:` callback for the corresponding type is received with `error == nil`, read the synchronization results from the SDK's local cache or database through the corresponding Manager:

```swift
let conversations = EMClient.shared().chatManager?.getAllConversations() ?? []
let contacts = EMClient.shared().contactManager?.getAllContacts() ?? []
let joinedGroups = EMClient.shared().groupManager?.getJoinedGroups() ?? []
```

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`initializeSDKWithOptions`](#initialize-the-sdk) | `EMClient` | Initializes the iOS SDK singleton. The Swift call is `initializeSDK(with:)`. |
| [`dataSyncType`](#configuration-method) | `EMOptions` | Sets the data types automatically synchronized after login. |
| [`getAllConversations`](#read-synchronization-results-after-login) | `IEMChatManager` | Reads the local conversation list. |
| [`getContacts`](#read-synchronization-results-after-login) | `IEMContactManager` | Reads the local friend user ID list. |
| [`getAllContacts`](#read-synchronization-results-after-login) | `IEMContactManager` | Reads the local friend object list. |
| [`getJoinedGroups`](#read-synchronization-results-after-login) | `IEMGroupManager` | Reads the local list of joined chat groups. |
