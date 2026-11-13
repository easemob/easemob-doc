# Initialization

Initialization is required to use the SDK and must be completed before you call other SDK APIs.

`EMClient` is a singleton. **If `init` is called multiple times in the same process, only the first initialization and its configuration take effect.** Therefore, complete all `EMOptions` configuration before initialization.

:::tip
Initialize the SDK in the app's main process and pass the Application Context to avoid repeated initialization in a multi-process scenario.
:::

## Prerequisite

Register a valid EasyIM developer account, create an app, and obtain its App Key. For details, see the [EasyIM Console documentation](/product/console/app_create.html).

## Initialize the SDK

Create `EMOptions`, call `setAppKey` to set the App Key, complete the remaining initialization configuration, and then pass the `Context` and `EMOptions` to `EMClient.init`.

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
// Continue setting other EMOptions configurations according to your business requirements.
EMClient.getInstance().init(getApplicationContext(), options);
```

The following table lists common `EMOptions` methods used during initialization. Complete these calls before initializing the SDK.

| Method | Description |
| :--- | :--- |
| `setAppKey(String appkey)` | Sets the App Key. `appkey` is the unique identifier obtained after creating an app in EasyIM Console. Its format is generally `orgName#appName`. |
| `setPushConfig(EMPushConfig pushConfig)` | Sets the offline push configuration. Pass a constructed `EMPushConfig` before `init`. If it is not set, the SDK creates a default push configuration. |
| `setAutoAcceptGroupInvitation(boolean value)` | Sets whether to automatically accept chat group invitations.<br/> - (Default) `true`: Automatically accepts chat group invitations.<br/> - `false`: Does not automatically accept chat group invitations. |
| `setAcceptInvitationAlways(boolean value)` | Sets whether to automatically accept friend invitations.<br/> - (Default) `true`: Automatically accepts friend invitations.<br/> - `false`: Does not automatically accept friend invitations. |
| `setDeleteMessagesAsExitChatRoom(boolean delete)` | Sets whether to delete a chat room's local messages when the user actively or passively leaves it.<br/> - (Default) `true`: Deletes them.<br/>- `false`: Retains them. |
| `setDeleteMessagesAsExitGroup(boolean delete)` | Sets whether to delete a chat group's local messages when the user actively or passively leaves it.<br/> - (Default) `true`: Deletes them.<br/> - `false`: Retains them. |
| `allowChatroomOwnerLeave(boolean allowed)` | Sets whether to allow the chat room owner to leave the chat room.<br/> - (Default) `true`: Allows the owner to leave. After leaving, the owner retains chat room privileges but no longer receives chat room messages.<br/> - `false`: Does not allow the owner to leave. |
| `setDataSyncType(EnumSet<EMDataSyncType> types)` | Sets the data types automatically synchronized after login. Possible values are `CONVERSATIONS`, `CONTACTS`, and `JOINED_GROUPS`. Pass `NONE`, `null`, or an empty set to disable synchronization. Starting from SDK v5.1.0, the default value is `CONVERSATIONS`. |
| `setEnableChatroomConversation(boolean enable)`              | Sets whether to include chat room conversations when retrieving the local conversation list. This configuration does not control the creation or storage of chat room conversations and does not affect the normal sending or receiving of chat room messages. This feature is supported starting from SDK v5.1.0.<br/> - `true`: Includes chat room conversations in the local conversation list.<br/> - (Default) `false`: Excludes chat room conversations from the local conversation list.<br/> Call `isEnableChatroomConversation()` to query whether the current configuration includes chat room conversations when retrieving the local conversation list. |
| `setLoadEmptyConversations(boolean isLoadEmptyConversations)` | Sets whether to include empty conversations when loading conversations from the local database.<br/> - `true`: Includes empty conversations.<br/> - (Default) `false`: Excludes empty conversations. |
| `setAutoLoadAllConversations(boolean autoLoadAllConversations)` | Sets whether to automatically load all conversations from the local database into memory after login succeeds. This feature is supported starting from SDK v5.1.0.<br/> - (Default) `true`: Automatically loads all conversations.<br/> - `false`: Does not automatically load all conversations. You can load them as needed through pagination or filtering APIs. |

For details about configuring an IP address or domain for the private-cloud SDK, see [Private Cloud SDK IP Address/Domain Configuration](private_ip_domain.html).

## Set listeners after initialization

After initialization is complete, register connection-state and message listeners to detect connection changes between the SDK and the EasyIM server and receive new messages. Connection listener callbacks run on a worker thread. Do not directly update the UI or perform time-consuming operations in them. The SDK automatically reconnects after a weak-network disconnection, so manual reconnection is unnecessary.

```java
private final EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
        // The SDK has successfully connected to the EasyIM server.
    }

    @Override
    public void onDisconnected(int errorCode) {
        // The SDK is disconnected from the EasyIM server. Determine the cause based on errorCode.
    }
};

private final EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        // After receiving new messages, iterate through the message list and update business data.
    }
};

// Register the listeners.
EMClient.getInstance().addConnectionListener(connectionListener);
EMClient.getInstance().chatManager().addMessageListener(messageListener);

// Remove the listeners when the page or component is destroyed or they are no longer needed to avoid duplicate callbacks and memory leaks.
EMClient.getInstance().removeConnectionListener(connectionListener);
// Remove the listener.
EMClient.getInstance().chatManager().removeMessageListener(messageListener);
```

:::tip
1. To monitor the start and completion of automatic data synchronization after login, see [Monitor synchronization state](#monitor-synchronization-state).
2. The SDK supports reading the current user's locally cached data before login is complete. Use `EMConnectionListener#onDatabaseOpened` to monitor when the database is opened. For details, see [Use the local database before login is complete](login.html#use-the-local-database-before-login-is-complete).
:::

## Set auto data synchronization after login

### Synchronized data

The SDK supports configuring the data types automatically synchronized after login through `EMOptions#setDataSyncType` before initialization. After login succeeds, the SDK synchronizes server-side data according to the configuration and updates the local cache or database. Starting from SDK v5.1.0, this configuration includes `EMDataSyncType.CONVERSATIONS` by default, which automatically synchronizes the conversation list.

The SDK currently supports synchronizing the conversation list, friend list, and list of chat groups that the current user has joined. The configuration and local read method for each data type are as follows:

| Configuration | Data automatically synchronized after login | Local read method | Description |
| :--- | :--- | :--- | :--- |
| `EMDataSyncType.CONVERSATIONS` | Conversation list | `EMClient.getInstance().chatManager().getAllConversations()` | Reads from memory. If no conversations are in memory, the SDK loads them from the local database. |
| `EMDataSyncType.CONTACTS` | Friend list | `EMClient.getInstance().contactManager().getContactsFromLocal()` | Reads the friend ID list from the local database. The call might throw `HyphenateException`. |
| `EMDataSyncType.JOINED_GROUPS` | List of chat groups that the current user has joined | `EMClient.getInstance().groupManager().getAllGroups()` | Reads the chat group list from the SDK's local cache. |

To check the currently configured automatic data synchronization types, call `EMOptions#getDataSyncType()`. This API only reads the configuration and does not trigger data synchronization.

### Configuration method

Call `setDataSyncType` before `EMClient.init`. Changes made after SDK initialization do not apply to the SDK instance already created.

The configuration rules are as follows:

- Starting from Android SDK v5.1.0, if `setDataSyncType` is not called, conversation data is automatically synchronized by default, which is `EMDataSyncType.CONVERSATIONS`.
- To synchronize one or more data types, explicitly pass the corresponding enum values using `EnumSet.of(...)`.
- Pass `EnumSet.of(EMDataSyncType.NONE)`, `null`, or an empty set to disable automatic synchronization.

The following example automatically synchronizes the conversation list, friend list, and list of chat groups that the current user has joined after login succeeds:

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS,
        EMOptions.EMDataSyncType.CONTACTS,
        EMOptions.EMDataSyncType.JOINED_GROUPS
));

EMClient.getInstance().init(getApplicationContext(), options);
```

To synchronize only the conversation list, configure only `CONVERSATIONS`:

```java
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS
));
```

To disable automatic synchronization after login, configure `NONE`:

```java
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.NONE
));
```

### Monitor synchronization state

The SDK uses `onDataSyncStart` and `onDataSyncFinish` to notify your app when synchronization of a data type starts and finishes.

- `onDataSyncStart(EMDataSyncType type)`: Triggered when synchronization of a data type starts. `type` can be `CONVERSATIONS`, `CONTACTS`, or `JOINED_GROUPS`.
- `onDataSyncFinish(EMDataSyncType type, int errorCode)`: Triggered when synchronization of a data type finishes. `errorCode == EMError.EM_NO_ERROR` indicates success. Otherwise, handle the failure according to the error code.

The following is sample code:

```java
EMConnectionListener syncListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
    }

    @Override
    public void onDisconnected(int errorCode) {
    }

    @Override
    public void onDataSyncStart(EMOptions.EMDataSyncType type) {
        Log.d("ChatSDK", "Data synchronization started: " + type);
    }

    @Override
    public void onDataSyncFinish(EMOptions.EMDataSyncType type, int errorCode) {
        if (errorCode == EMError.EM_NO_ERROR) {
            Log.d("ChatSDK", "Data synchronization succeeded: " + type);
        } else {
            Log.e("ChatSDK", "Data synchronization failed: " + type + ", errorCode=" + errorCode);
        }
    }
};

EMClient.getInstance().addConnectionListener(syncListener);
```

### Read synchronization results after login

After receiving `onDataSyncFinish` for the corresponding type with an `errorCode` of `EMError.EM_NO_ERROR`, read the synchronization results from the SDK's local cache or database through the corresponding Manager.

```java
Map<String, EMConversation> conversations =
        EMClient.getInstance().chatManager().getAllConversations();

try {
    List<String> contacts =
            EMClient.getInstance().contactManager().getContactsFromLocal();
} catch (HyphenateException e) {
    Log.e("ChatSDK", "Failed to read local contacts", e);
}

List<EMGroup> joinedGroups =
        EMClient.getInstance().groupManager().getAllGroups();
```

## Enable automatic user information management

The Android SDK supports configuring automatic user information management through `EMOptions#setEnableUserInfo(boolean enableUserInfo)`. This parameter defaults to `false`. When it is set to `true`, the SDK automatically synchronizes the current user's attributes after login succeeds. Other users' attributes are updated when relevant messages are received, user attributes are actively retrieved from the server, or in other applicable scenarios. Set this configuration before initializing the SDK.

Automatic user information management and automatic contact synchronization are independent. Android SDK 5.x uses `EMOptions#setDataSyncType` to configure the data types automatically synchronized after login. `EMOptions.EMDataSyncType.CONTACTS` synchronizes contact data. Enabling automatic user information management does not automatically retrieve all friends' nicknames and avatars at login. For user attribute update events, local reading, and active retrieval, see [Automatic User Information Management](userinfo_provider.html).

If you need both features, configure them during the same initialization. The following example also retains the default conversation data synchronization:

```java
import java.util.EnumSet;

EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS,
        EMOptions.EMDataSyncType.CONTACTS
));
options.setEnableUserInfo(true);

EMClient.getInstance().init(context.getApplicationContext(), options);
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`init`](#initialize-the-sdk) | `EMClient` | Initializes the Android SDK singleton. |
| [`setDataSyncType`](#configuration-method) | `EMOptions` | Sets the data types automatically synchronized after login. |
| [`getAllConversations`](#read-synchronization-results-after-login) | `EMChatManager` | Reads the local conversation list. |
| [`getContactsFromLocal`](#read-synchronization-results-after-login) | `EMContactManager` | Reads the friend list from the local database. |
| [`getAllGroups`](#read-synchronization-results-after-login) | `EMGroupManager` | Reads the local chat group list. |
| [`getDataSyncType`](#synchronized-data) | `EMOptions` | Retrieves the currently configured data types automatically synchronized after login. |
