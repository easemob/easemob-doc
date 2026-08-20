# Java Server SDK 1.0

<Toc />

## Feature overview

The Server SDK is a wrapper for the EasyIM [REST API](overview.html). It saves server-side developers time when integrating with the EasyIM API. To use it, you only need to configure your App Key information.

The Server SDK provides APIs for managing resources such as users, messages, chat groups, and chat rooms.

## Prerequisites

- Java 1.8
- [Reactor](https://projectreactor.io/)(io.projectreactor:reactor-bom:2020.0.4)
- A valid EasyIM developer account, App Key, Client ID, and ClientSecret. Log in to the [Easemob Console](https://console.easemob.com/user/login), go to **App List**, and click **View** to obtain the App Key, Client ID, and ClientSecret.

## Implementation

### Installation

If your project uses Maven, add the following code to pom.xml:

```xml
<dependency>
    <groupId>com.easemob.im</groupId>
    <artifactId>im-sdk-core</artifactId>
    <version>0.8.56</version>
</dependency>
```

If your project uses Gradle, add the following code to build.gradle:

```gradle
implementation 'com.easemob.im:im-sdk-core:0.8.56'
```

### Usage

[EMService](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/EMService.html) is the entry point for all APIs. Initialize it as follows:

#### 1. Using Easemob App Credentials

```java
建议写到配置类中，示例如下：
@Configuration
public class Config {

    @Bean
    public EMService service() {

        EMProperties properties = EMProperties.builder()
                .setAppkey("Appkey")
                .setClientId("Client ID")
                .setClientSecret("ClientSecret")
                .build();

        return new EMService(properties);
    }
}
```

The APIs are organized by resource as follows:

- [Chat File](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ChatFileApi.html): Uploads and downloads attachments.
- [Block](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/BlockApi.html): Restricts access, such as adding users to the blocklist or muting chat group or chat room members.
- [Contact](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ContactApi.html): Manages contacts, such as adding contacts.
- [Group](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/GroupApi.html): Manages chat groups.
- [Message](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html): Sends messages.
- [User](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/UserApi.html): Manages users.
- [UserMetadata](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MetadataApi.html): Manages user attributes.
- [Push](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/PushApi.html): Manages user push settings, such as setting Do Not Disturb.
- [Token](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/TokenApi.html): Obtains user tokens.
- [Room](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/RoomApi.html): Manages chat rooms.
- [Presence](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/PresenceApi.html): Manages presence subscriptions.

Each resource corresponds to a method. For example, all user-related APIs are available through `.user()`.

For example, use the following code to register a user:

```java
@Service
public class UserService {

    @Autowired
    private EMService service;

    private void createUser() {
        try {
            EMUser user = service.user().create("username", "password").block();
        } catch (EMException e) {
            e.getErrorCode();
            e.getMessage();
        }

    }
}
```

API return values are reactive. To block execution, use `.block()` as shown in the preceding example.

:::tip
If your project does not use reactive programming, append `.block()` to each Server SDK API call.
Wrap API calls in try/catch. If an API call does not throw an exception, the request succeeded; otherwise, it failed. Obtain the error code and description from the `EMException` object by calling `getErrorCode()/getMessage()`.
:::

#### 2. Private deployment configuration

Pass your private REST server address to `setBaseUri`.

We recommend placing the configuration in a configuration class, as shown below:

```java
@Configuration
public class Config {

    @Bean
    public EMService service() {

        EMProperties properties = EMProperties.builder()
                 .setBaseUri("https://Your privatized address name")
                .setAppkey("Appkey")
                .setClientId("Client ID")
                .setClientSecret("ClientSecret")
                .build();

        return new EMService(properties);
    }
}
```

## References

- [Server SDK API documentation](https://easemob.github.io/easemob-im-server-sdk/).
- [Server SDK source code](https://github.com/easemob/easemob-im-server-sdk).

## FAQs

### Integration issues

To view Server SDK requests and responses, add the following setting to the configuration file:

```properties
logging.level.com.easemob.im.http=debug
```

If a DNS warning occurs when you use the Server SDK on macOS, add the following setting to the configuration file:

```properties
logging.level.com.easemob.im.shaded.io.netty=error
```

### Usage issues

Some developers encounter a `Connection reset by peer` exception when using the Server SDK. Because the Server SDK uses Netty to send requests, Netty throws this exception. The official Netty issue provides some [solutions](https://github.com/reactor/reactor-netty/issues/1774), but they require configuring Netty's `ConnectionProvider`. The Server SDK therefore provides corresponding settings in `EMProperties`, allowing you to configure Netty's `ConnectionProvider` for your use case, such as the number of connections and connection idle time. If the Server SDK handles a large volume of requests, you can increase the number of connections.

Example:

```java
@Configuration
public class Config {

    @Bean
    public EMService service() {

        EMProperties properties = EMProperties.builder()
                    .setBaseUri("https://Your privatized address name")
                    .setAppkey("Appkey")
                    .setClientId("Client ID")
                    .setClientSecret("Client Secret")
                    .setHttpConnectionPoolSize(500)
                    .setHttpConnectionMaxIdleTime(20000)
                    .setHttpConnectionMaxLifeTime(60000)
                    .setHttpConnectionPendingAcquireTimeout(60000)
                    .setHttpConnectionEvictInBackground(120000)
                    .setServerTimezone("+8")
                    .build();

        return new EMService(properties);
    }
}
```

## Considerations

1. The Server SDK is a wrapper for the EasyIM [REST API](overview.html), but it does not wrap every API. It covers only the APIs commonly used by developers. Click [here](#usage) to view the Server SDK APIs.

The Server SDK applies its own rules when registering an EasyIM ID. The regular expression is `^[a-z][0-9a-z-]{1,32}$`. These rules differ from the EasyIM ID rules described in the [official REST API documentation](account_register_open.html). For example, the user ID is limited to 32 bytes. The existing EasyIM ID registration rules allow a broad range of values, so the Server SDK narrows the range to enforce a more standardized format.

To disable the Server SDK restrictions on registering EasyIM IDs, add turnOffUserNameValidation() during initialization. This requires SDK version 0.3.5 or later.

```java
// We strongly recommend that you do not register an EasyIM ID consisting only of digits or a predictable string. Otherwise, the user may be vulnerable to attacks or spam.
EMProperties properties = EMProperties.builder()
        .setAppkey("appkey")
        .setClientId("Client ID")
        .setClientSecret("ClientSecret")
        .turnOffUserNameValidation()
        .build();
```

1. Using a proxy

Your proxy must support the `CONNECT` method. Ensure that connectport 80 is present in your proxy configuration file.

If your proxy does not require authentication, provide its IP address and port.

```java
EMProxy proxy = EMProxy.builder()
                .setIP("ip")
                .setPort(80)
                .build();

EMProperties properties = EMProperties.builder()
        .setProxy(proxy)
        .setAppkey("appkey")
        .setClientId("Client ID")
        .setClientSecret("ClientSecret")
        .build();
```

If your proxy requires authentication, provide its IP address, port, account, and password.

```java
EMProxy proxy = EMProxy.builder()
                .setIP("ip")
                .setPort(80)
                .setUsername("username")
                .setPassword("password")
                .build();

EMProperties properties = EMProperties.builder()
        .setProxy(proxy)
        .setAppkey("appkey")
        .setClientId("Client ID")
        .setClientSecret("ClientSecret")
        .build();
```

## Changelog

### V0.8.56 2024-11-20

1. Changed the password length limit for user creation.

For details about these updates, see UserApi.

### V0.8.55 2024-09-09

1. Added the Presence feature.
2. Updated the SDK Javadoc.

For details about these updates, see PresenceApi.

### V0.8.54 2024-07-29

1. Added the chat group avatar attribute when creating a chat group.
2. Added support for changing the chat group avatar when modifying chat group information.
3. Added the chat group avatar attribute to chat group details.
4. Added the chat group avatar attribute to the list of chat groups that a user has joined.

For details about these updates, see GroupApi.

### V0.8.53 2024-06-28

1. Added the feature for setting nicknames displayed in offline push notifications in a batch.

For details about these updates, see PushApi.

### V0.8.52 2024-06-07

Added the feature for specifying a push nickname when creating a user.

For details about these updates, see UserApi.

### V0.8.51 2024-04-08

- Added the feature for deleting roaming messages in a conversation for one user.
- Added the feature for editing text or custom messages.
- Added the features for setting friend remarks and retrieving the contact list by page.

For details about these updates, see MessageApi and ContactApi.

###  V0.8.2 2024-01-11

- Added the feature for sending a global broadcast message to chat rooms.
- Added the features for banning and unbanning chat groups.

For details about these updates, see GroupApi and MessageApi.

### V0.8.1 2024-01-2

- Added the feature for creating a large chat group.
- Removed the feature for sending messages to large and small chat rooms.
- Removed the user list size check when adding or removing chat group members in a batch.
- Revised the comments for the feature that obtains a user token.

For details about these updates, see GroupApi, MessageApi, and TokenApi.

### V0.8.0 2023-12-21

- Added the feature for sending targeted messages to chat rooms.

For details about these updates, see MessageApi.

### V0.7.9 2023-11-28

Added the feature for checking whether a specified user has joined a chat group.

For details about these updates, see GroupApi.

### V0.7.8 2023-11-03

Added the feature for sending messages on behalf of a specified group owner.

For details about these updates, see MessageApi.

### V0.7.7 2023-10-18

Fixed an issue that caused historical message file downloads to fail.

### V0.7.6 2023-08-30

Added the feature for retrieving details of multiple chat rooms.

For details about these updates, see RoomApi.

### V0.7.5 2023-08-24

- Added settings to `EMProperties` for configuring `ConnectionProvider` to resolve Netty request connection issues.
- Added support for changing a chat group between public and private.
For details about these updates, see `EMProperties` and `GroupApi`.

### V0.7.3 2023-07-05

- Added the `chatroom_msg_level` option for sending chat room messages.

For details about these updates, see MessageApi.

### V0.7.2 2023-06-29

- Added the features for muting and unmuting all chat group members.
- Added features related to custom chat group member attributes.
- Fixed an issue where an empty Response did not throw an exception when the REST service encountered an error.

For details about these updates, see BlockApi and MetadataApi.

### V0.7.1  2023-06-14

- Added support for applying ttl when obtaining an EasyIM user token.

For details about these updates, see TokenApi.

### V0.7.0   2023-06-06

- Added the feature for retrieving chat group details in a batch.
- Added the feature for muting or unmuting chat room members in a batch.
- Added the feature for including the group owner when retrieving the chat group member list.
- Added support in `EMProperties` for setting `pendingAcquireMaxCount`.
- Corrected errors in some method usage examples.

For details about these updates, see `EMProperties/GroupApi/RoomApi/BlockApi`.

### V0.6.9  2023-04-07

- Added the feature for registering users in a batch.
- Added the feature for muting chat group members in a batch.

For details about these updates, see UserApi/BlockApi.

### V0.6.8  2023-03-17

Updated the internal implementation of the methods for sending and recalling messages.

### V0.6.7  2023-02-07

Fixed an issue that caused the attachment download method to fail.

### V0.6.7  2022-12-02

Fixed an issue that caused registration to fail when a username contained uppercase letters.

### V0.6.6 2022-12-02

Fixed an issue that caused an exception when uppercase letters were used with the methods for creating, retrieving, or deleting users.

### V0.6.3

1. Added the feature for configuring offline push.
2. Added the feature for retrieving by page the list of chat groups that a user has joined.
3. Added the feature for retrieving user attributes in a batch.
4. Added the feature for creating a chat group with a specified chat group ID. Contact the Easemob business team to activate this feature.
5. Fixed some bugs.

For details about these updates, see PushApi/GroupApi/MetadataApi.

### V0.6.0

1. Added the features for muting and unmuting all chat room members.
2. Added the current member count to the returned chat room details.
3. Added the member list to the returned chat room details.
4. Added a method for sending messages without returning message IDs.
5. Added support for including the `sync_device` field when sending messages.

6. Fixed an issue where an exception could not be caught when an incorrect parameter was used to add a chat group admin.

For details about these updates, see `RoomApi/MessageApi`.

### V0.5.5

1. Added the message recall feature.
2. Added the feature for deleting a conversation for one user.
3. Added a parameter that specifies whether the chat group name requires moderation when creating a chat group.
4. Added a parameter that specifies whether to sort results when retrieving chat group members.
5. Added the chat group name, description, and other data to the returned chat group details.
6. Fixed an issue where removing a single member with the batch chat group member removal method threw an exception.

For details about these updates, see `GroupApi`/`MessageApi`.

### V0.5.4

Added features for setting a global user mute, querying the remaining global mute duration for a single user, and querying the remaining global mute duration for all users.

For details about these updates, see `MuteApi`.

### V0.5.3

1. Added the `needInviteConfirm` parameter, which specifies whether invited users must confirm a chat group invitation, to the method for creating a chat group.
2. Added the `custom` parameter to the method for creating a chat room.
3. Added a method for transferring chat room ownership.

For details about these updates, see `GroupApi`/`RoomApi`.

### V0.5.2

1. Added the `custom` parameter to the method for modifying chat group information.
2. Added a method for transferring chat group ownership.

For details about these updates, see `GroupApi`.
