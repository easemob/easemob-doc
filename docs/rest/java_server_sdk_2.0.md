# Java Server SDK 2.0

## Feature overview

The Server SDK 2.0 is a wrapper for the EasyIM [REST API](overview.html). It saves server-side developers time when integrating with the EasyIM API. To use it, you only need to configure your App Key information.

The Server SDK 2.0 provides APIs for managing resources such as users, messages, chat groups, and chat rooms.

## Prerequisites

- Java 1.8
- A valid EasyIM developer account, App Key, Client ID, ClientSecret, and BasePath. The BasePath represents your RESTful API domain name. To find it, go to the **Overview** page in the EasyIM Console and locate the RESTful API server domain under the **Development Configuration** section.

## Implementation

### Installation

If your project uses Maven, add the following code to pom.xml:

```xml
<dependency>
    <groupId>com.easemob.im</groupId>
    <artifactId>im-sdk-core</artifactId>
    <version>1.0.19</version>
</dependency>
```

If your project uses Gradle, add the following code to build.gradle:

```gradle
implementation 'com.easemob.im:im-sdk-core:V1.0.19'
```

### Usage

Initialize the Java Server SDK before using it. The following example uses EasyIM App Credentials:

```java
// It is recommended to initialize the SDK in a configuration class, as shown below:
@Configuration
public class Config {

    static {
        try {
            com.easemob.im.Configuration.setDefaultApiClient(ApiClient.builder()
            // BasePath is the corresponding RESTful API domain name. In the EasyIM Console, go to the App Overview page and find the RESTful API server domain name in the Development Information section.
                    .setBasePath("BasePath")
                    .setAppKey("Appkey")
                    .setClientId("Client ID")
                    .setClientSecret("Client Secret")
                    .build());
        } catch (ApiException e) {
            // exception handling
        }
    }

}
```

The APIs are organized by resource as follows:

- [ChatFile](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ChatFileApi.html): Uploads and downloads attachments.
- [Block](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/BlockApi.html): Restricts access, such as adding users to the blocklist.
- [Contact](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ContactApi.html): Manages contacts, such as adding contacts.
- [Group](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/GroupApi.html): Manages chat groups.
- [Thread](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ThreadApi.html): Manages message threads in chat groups.
- [Message](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html): Sends messages.
- [HistoryMessage](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/HistoryMessageApi.html): Downloads historical message records.
- [User](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/UserApi.html): Manages users.
- [Metadata](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MetadataApi.html): Manages user attributes and chat group member attributes.
- [Token](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/TokenApi.html): Obtains user tokens.
- [Room](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/RoomApi.html): Manages chat rooms.
- [Push](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/PushApi.html): Manages push settings.
- [Presence](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/PresenceApi.html): Manages user presence subscriptions.
- [Reaction](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ReactionApi.html): Manages message Reactions.

Each resource corresponds to a class. For example, all user-related APIs are available in `UserAPi`.

For example, use the following code to register a user:

Note: Ensure that SDK initialization is complete before using any resource API.

```java
@Service
public class UserService {

    private UserApi userApi = new UserApi();

    private void createUser() {
        List<EMCreateUser> emCreateUserList = new ArrayList<>();
        EMCreateUser createUser = new EMCreateUser();
        createUser.setUsername("user1");
        createUser.setPassword("123");
        emCreateUserList.add(createUser);
      
        try {
            EMCreateUsersResult result = userApi.createUsers(emCreateUserList);
        } catch (EMException e) {
            e.getMessage();
        }

    }
}
```

For examples of using the resource APIs, see the [integration tests](https://github.com/easemob/easemob-im-server-sdk/tree/master_java_2.0/src/test/java/com/easemob/im/api).

## References

- [Server SDK source code](https://github.com/easemob/easemob-im-server-sdk/tree/master_java_2.0).

## FAQs

### Usage issues

If your application sends a large volume of API requests, you can tune settings such as the number of connections in the connection pool and the connection idle time.

Example:

```java
try {
        Configuration.setDefaultApiClient(ApiClient.builder()
                .setBasePath("Rest BasePath")
                .setAppKey("Appkey")
                .setClientId("Client ID")
                .setClientSecret("Client Secret")
                .setMaxIdleConnections(100)
                .setConnectKeepAliveMilliSeconds(10000)
                .setConnectTimeoutMilliSeconds(10000)
                .setDispatcherMaxRequests(200)   // This parameter is supported in version 1.0.15 or later. Upgrade the SDK to use it.
                .setDispatcherMaxRequestsPerHost(200) // This parameter is supported in version 1.0.15 or later. Upgrade the SDK to use it.
                .build());
        } catch (ApiException e) {
            throw new RuntimeException(e);
        }
```

## Considerations

1. Using a proxy

Your proxy must support the `CONNECT` method. Ensure that connectport 80 is present in your proxy configuration file.

If your proxy does not require authentication, provide its IP address and port.

```java
ApiClient.EMProxy proxy = ApiClient.EMProxy.builder()
                .setIP("ip")
                .setPort(80)
                .build();

try {
    Configuration.setDefaultApiClient(ApiClient.builder()
            .setProxy(proxy) 
            .setBasePath("Rest BasePath")
            .setAppKey("Appkey")
            .setClientId("Client ID")
            .setClientSecret("Client Secret")
            .build());
} catch (ApiException e) {
    throw new RuntimeException(e);
}
```

If your proxy requires authentication, provide its IP address, port, account, and password.

```java
ApiClient.EMProxy proxy = ApiClient.EMProxy.builder()
                .setIP("ip")
                .setPort(80)
                .setUsername("username")
                .setPassword("password")
                .build();

try {
    Configuration.setDefaultApiClient(ApiClient.builder()
            .setProxy(proxy)                       
            .setBasePath("Rest BasePath")
            .setAppKey("Appkey")
            .setClientId("Client ID")
            .setClientSecret("Client Secret")
            .build());
} catch (ApiException e) {
    throw new RuntimeException(e);
}
```

## Changelog

### V1.0.19 2026-06-24

| New feature                     | Description                                                    |
| :--------------------------- | :----------------------------------------------------------- |
| Recall messages in a batch | `batchRecallMessages`/`batchRecallMessagesAsync`: Recalls multiple successfully sent messages at a time, with a maximum of 30 messages per request.<br/>For details, see the [API description in MessageApi](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html#batchRecallMessages(com.easemob.im.api.model.EMBatchRecallMessages)).|
| Check the blocklist | `userBlockCheck`/`userBlockCheckAsync`: Checks in a batch whether users are on the blocklist.<br/>For details, see the [API description in BlockApi](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/BlockApi.html#userBlockCheck(com.easemob.im.api.model.EMUserBlockCheck)).|
| Translate message content | `translateMessage`/`translateMessageAsync`: Translates the content of text messages. Only text messages are supported.<br/>For details, see the [API description in MessageApi](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html#translateMessage(com.easemob.im.api.model.EMMessageTranslate)). |
| Retrieve the list of supported translation languages | `getTranslateSupportLanguages`: Retrieves the list of supported translation languages.<br/>For details, see the [API description in MessageApi](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html#getTranslateSupportLanguages()).|
| Detect the source language of text | `detectTranslateLanguage`: Detects the source language of text.<br/>For details, see the [API description in MessageApi](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html#detectTranslateLanguage(com.easemob.im.api.model.EMDetectTranslateLanguage)).|

### V1.0.18 2026-05-22

| New feature                     | Description                                                    |
| :--------------------------- | :----------------------------------------------------------- |
| Remove chat room members in a batch | See [RoomApi](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/RoomApi.html) for details. |

### V1.0.17 2026-04-03

| New feature                     | Description                                                    |
| :--------------------------- | :----------------------------------------------------------- |
| Check whether users are contacts | - `userContactCheck`: Checks whether specified users are contacts.<br/> - For details, see [ContactApi.userContactCheck](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ContactApi.html#userContactCheck(com.easemob.im.api.model.EMUserContactCheck)). |
| Add an extension parameter for message recall | - `recallMessageExtensionInfo`: Specifies the extension information passed when recalling a message.<br/> - For details, see [EMRecallMessage](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/model/EMRecallMessage.html). |
| Add an owner change parameter for modifying a chat room | - `newowner`: A new parameter of the API for modifying a chat room, used to change the chat room owner.<br/> - **Documentation**: [EMModifyRoom](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/model/EMModifyRoom.html) |

### V1.0.16 2025-07-25

1. Added the feature for retrieving user attributes in a batch.
2. Added the feature for retrieving the number of chat group members.
3. Added the feature for retrieving the number of chat room members.

For details about these updates, see MetadataApi, GroupApi, and RoomApi.

### v1.0.15 2025-07-01

To help optimize performance in high-concurrency request scenarios, `ApiClient` adds the following two parameters. Use them to tune the Server SDK when requests experience high latency.

| New API                          | Description                                                         |
| :-------------------------------- | :----------------------------------------------------------- |
| `setDispatcherMaxRequests`        | Sets the maximum number of requests that the entire `OkHttpClient` instance can process concurrently, including requests that are executing or queued. For details, see the [API description](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/ApiClient.Builder.html#setDispatcherMaxRequests(int)). |
| `setDispatcherMaxRequestsPerHost` | Sets the maximum number of requests that can be processed concurrently for each host. For details, see the [API description](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/ApiClient.Builder.html#setDispatcherMaxRequestsPerHost(int)). |

### V1.0.13 2025-04-22

1. Added the feature for sending a broadcast message to online app users.
2. Added compatibility with TLS 1.0/1.1.

For details about these updates, see MessageApi.

### V1.0.12 2025-03-04

1. In `EMCreateMessage`, added the `roamIgnoreUsers` parameter, which specifies the users who cannot retrieve the message as a roaming message.
2. Added the feature for unmuting chat group members.

For details about these updates, see EMCreateMessage and GroupApi.

### V1.0.11 2024-11-20

1. Added the feature for setting custom chat group member attributes in a batch.

For details about these updates, see MetadataApi.

### V1.0.10 2024-09-21

1. Added the feature for [deleting one-to-one roaming messages by message ID for one user](message_delete_roam_single_msgid.html).
2. Added the feature for [deleting group chat roaming messages by message ID for one user](message_delete_roam_group_room_msgid.html).
3. Added the feature for creating a chat room with a specified ID.
4. Added the feature for creating a chat group with a specified ID.

For details about these updates, see MessageApi, RoomApi, and GroupApi.

### V1.0.9 2024-07-29

1. Added the feature for [sending a global broadcast message to chat rooms](broadcast_to_chatrooms.html).
2. Added the feature for [importing a contact list](user_friend_import.html).
3. Added the feature for [forcing a user offline on a single device](account_offline_device_single.html).
4. [Added the chat group avatar attribute when creating a chat group](group_create.html).
5. [Added support for changing the chat group avatar when modifying chat group information](group_modify.html).
6. [Added the chat group avatar attribute when retrieving chat group details](group_obtain_detail.html).
7. Added the chat group avatar attribute when [retrieving the list of chat groups that a user has joined](group_obtain_joined).

For details about these updates, see MessageApi, ContactApi, UserApi, and GroupApi.

### V1.0.8 2024-07-15

1. Resolved dependency conflicts.

### V1.0.7 2024-06-28

1. Added the feature for [modifying user push nicknames in a batch](push_nickname_set_batch.html).

2. Added examples for sending image, voice, video, file, command, extension, and custom messages.

For details about these updates, see UserApi and MessageApiTest.

### V1.0.6 2024-06-07

1. Added the feature for [removing chat group members in a batch](group_members_remove_batch.html).

2. Added the feature for [retrieving the contact list at one time](user_friend_list_obtain.html).

3. Added the push nickname parameter for [registering users](account_register_open.html).

For details about these updates, see GroupApi, ContactApi, and UserApi.

### V1.0.5 2024-04-08

Resolved conflicts caused when the okhttp and gson dependency versions referenced by developers differed from those referenced internally by the SDK.

### V1.0.4 2024-04-08

Fixed an issue that prevented the targeted message feature for chat groups and chat rooms from taking effect.

For details about these updates, see MessageApi.

### V1.0.3 2024-03-28

1. Added the feature for deleting roaming messages for one user.

2. Added the feature for editing text or custom messages.

3. Added the feature for sending targeted messages to chat groups and chat rooms.

4. Revised the membersonly comments in the methods for creating a chat group and modifying chat group information.

5. Added the total parameter to the return value of the method for retrieving all chat groups that a user has joined.

For details about these updates, see MessageApi, EMCreateMessage, EMCreateGroup, EMModifyGroup, and EMGetUserJoinedGroupsResult.

###  V1.0.2 2024-03-21

1. Added Push, Presence, and Reaction management features.

2. Downgraded the OkHttp version to avoid conflicts with versions introduced by developers.

###  V1.0.0 2024-03-08

1. Released Java Server SDK 2.0.
