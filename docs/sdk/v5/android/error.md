# Error Codes

This page describes the error codes returned by API calls or callbacks in the EasyIM Android SDK. Developers can use an error code to identify the cause of a failure and refer to the corresponding solution.

Android SDK error codes are defined in the [`EMError`](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1_e_m_error.html) class. For example, when registering a user, you can use `EMError.USER_ALREADY_EXIST` to determine whether the user already exists.

Example:

```java
EMClient.getInstance().loginWithToken(userId, token, new EMCallBack() {
    @Override
    public void onSuccess() {
        // Login succeeds.
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
        if (errorCode == EMError.INVALID_TOKEN
                || errorCode == EMError.TOKEN_EXPIRED) {
            // Obtain a new token and log in again.
        } else {
            // Handle other errors based on the error code and error message.
        }
    }
});
```

## General, validation, and connection errors

### General errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 0 | `EM_NO_ERROR` | The operation succeeds. |  |
| 1 | `GENERAL_ERROR` | The default SDK- or request-related error for which no specific error type is identified. For example, this error occurs if the SDK is not properly initialized internally or if a request to the server fails for an unidentified reason. | Analyze the logs and the called API. |
| 2 | `NETWORK_ERROR` | A network error occurs. This error is returned when no network service is available and indicates that the connection between the SDK and server has been disconnected. | For chat group or chat room operations, this error may be returned if the network is unavailable. Try the operation again after the network recovers. |
| 3 | `DATABASE_ERROR` | A database operation fails because the local database cannot be opened. | Analyze the called API and logs. For example, this error may be returned if `EMConversation#updateMessage` is used to update a message that does not exist locally or if another local database operation is performed before the database is opened. |
| 4 | `EXCEED_SERVICE_LIMIT` | A service limit is exceeded. For example, this error occurs when the number of created user IDs exceeds the limit of the current service plan. It is also reported when the API call frequency limit is exceeded for APIs that set or get user attributes, including [setting all attributes of the current user](userprofile.html#set-all-attributes-of-the-current-user), [getting all attributes of a user](userprofile.html#retrieve-all-user-attributes-from-the-server), and [getting specified attributes of users](userprofile.html#retrieve-specified-user-attributes-from-the-server). | Check the called API. If it takes a `limit` parameter, keep the value within the allowed range. If the error is caused by rate limiting, call the API again later. |
| 8 | `APP_ACTIVE_NUMBER_REACH_LIMITATION` | The number of daily active users (DAU) or monthly active users (MAU) of the app reaches the upper limit. | Upgrade the EasyIM service in the [EasyIM Console](https://console.easyim.ai/user/login). |
| 302 | `SERVER_BUSY` | The server is busy. Try the request again later. | Check whether the API is called repeatedly. This error may be returned if the API is called again before the result of the previous call is returned. |
| 303 | `SERVER_UNKNOWN_ERROR` | A general service request error. This is the default error when a server request fails. Because it can occur in many situations, further investigation based on the logs is required. | Provide the logs and the called API for further investigation. |

### Validation errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 100 | `INVALID_APP_KEY` | The App Key is invalid because its format is incorrect. You can view the App Key on the **App Overview** page in the [EasyIM Console](https://console.easyim.ai/user/login). | Initialize the SDK with the correct App Key. |
| 101 | `INVALID_USER_NAME` | The user ID is invalid. This error generally occurs when the user ID is empty, such as when the username parameter is an empty string while inviting a contact. | Check whether the user ID parameter passed to the API is empty. |
| 102 | `INVALID_PASSWORD` | The user password is invalid. The password provided during login is empty or incorrect. | Check whether the password parameter passed to the API is correct. |
| 103 | `INVALID_URL` | The URL is invalid. | Check whether the parameters passed to the API are correct. |
| 104 | `INVALID_TOKEN` | The user token is invalid. The token provided during login is empty or incorrect. | Check whether the token parameter passed to the API is correct. |
| 105 | `USER_NAME_TOO_LONG` | The user ID is too long. A user ID cannot exceed 64 bytes. | Check whether the user ID passed to the API exceeds the length limit. |
| 110 | `INVALID_PARAM` | A parameter is invalid. | Check whether the parameters passed to the API are valid. |

### Connection errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 108 | `TOKEN_EXPIRED` | The user token has expired because it has exceeded its validity period. | After receiving the token expiration callback, generate a new token and call `EMClient#loginWithToken` to log in again. |
| 109 | `TOKEN_WILL_EXPIRE` | The user token is about to expire. This error code starts to be returned when 80% of the token validity period has elapsed (50% before version 4.15.0). | After receiving the token expiration warning callback, generate a new token and call `EMClient#renewToken` to update it. |
| 200 | `USER_ALREADY_LOGIN` | The user is already logged in. The user ID has already logged in. | Check whether the SDK has already called a login method. |
| 201 | `USER_NOT_LOGIN` | The user is not logged in. For example, the SDK returns this error when a message is sent or a chat group API is used before a successful login. | Check whether EasyIM login has completed before calling the API. |
| 202 | `USER_AUTHENTICATION_FAILED` | User authentication fails:<br/> - When logging in with a user ID and password, this error is reported if the user ID or password is incorrect.<br/> - When logging in with a user ID and user token, this error generally indicates that the token is invalid or expired. | If the user has logged out, log in again. Otherwise, generate a new token and call `EMClient#renewToken` to update it. |
| 203 | `USER_ALREADY_EXIST` | The user already exists. This error occurs during registration if the specified user ID already exists. | Register with a different user ID. |
| 204 | `USER_NOT_FOUND` | The user does not exist. For example, the user ID does not exist when logging in or retrieving the user's conversation list. | Check whether the user ID parameter passed to the API is correct. |
| 205 | `USER_ILLEGAL_ARGUMENT` | A user parameter is invalid. For example, the user ID is empty or invalid when creating a user or updating user attributes. | Check whether the parameters passed to the API are correct. |
| 206 | `USER_LOGIN_ANOTHER_DEVICE` | The user logs in on another device. If multi-device login is disabled, logging in on another device logs out the current device, which receives this error. | When the device is logged out, the `EMConnectionListener#onLogout` event is triggered. Log in again after receiving this event. |
| 207 | `USER_REMOVED` | The user has been deleted. This error is received when the currently logged-in user ID is deleted from the [EasyIM Console](https://console.easyim.ai/user/login). | When the account is deleted, `EMConnectionListener#onLogout` is triggered. After receiving this event, return to the login page because the account is no longer available. |
| 208 | `USER_REG_FAILED` | User registration fails. For example, the [open registration feature](/rest/account_register_open.html) has not been enabled before the user is registered. | Registering accounts through the SDK is not recommended. Register accounts on the app server. |
| 209 | `USER_UPDATEINFO_FAILED` | An error occurs while updating the push configuration. For example, the user fails to update the push nickname or configure Do Not Disturb settings. | Check the API that reported the error and call it again later. |
| 210 | `USER_PERMISSION_DENIED` | The user does not have permission. For example, this error occurs when a user sends a message after being added to a blocklist. Other cases include a user modifying a message sent by another user, modifying chat group member attributes set by another user, or a regular chat group member attempting to destroy a message thread. Only the owner and administrators of the chat group containing the message thread can destroy it. | Check whether the user has permission to perform the operation. |
| 211 | `USER_BINDDEVICETOKEN_FAILED` | Binding the device token fails. | Check whether the token passed to the API for binding the device push token is empty. |
| 212 | `USER_UNBIND_DEVICETOKEN_FAILED` | Unbinding the device token fails. | If `USER_UNBIND_DEVICETOKEN_FAILED` occurs when calling `EMClient#logout``, try calling `EMClient#logout` again. To ensure that the logout operation succeeds, call `EMClient#logout` with the parameter set to `false` so that the token is not unbound. |
| 213 | `USER_BIND_ANOTHER_DEVICE` | The user is already logged in on another device. In a single-device login scenario, the device that logs in later logs out the current device by default. If priority is given to the device that logged in first, login fails on the later device and this error is returned. | Enable multi-device login, or call `EMClient#kickDeviceWithToken` to log out the other device before logging in. |
| 214 | `USER_LOGIN_TOO_MANY_DEVICES` | The number of devices on which the user is logged in exceeds the limit. | Increase the number of devices that can be online simultaneously, or call `EMClient#kickDeviceWithToken` to log out another device before logging in. |
| 215 | `USER_MUTED` | The user is muted in a chat group or chat room. This error occurs when the muted user sends a message. | A user who is muted in a chat group or chat room cannot send messages. Restrict this action in the UI. |
| 216 | `USER_KICKED_BY_CHANGE_PASSWORD` | The user's password is updated. After the password of the currently logged-in user is changed, the current connection is disconnected and this error occurs. | The `EMConnectionListener#onLogout` callback is received after the password is updated. Upon receiving the callback, call `EMClient#logout` and return to the login page. |
| 217 | `USER_KICKED_BY_OTHER_DEVICE` | The user is forcibly logged out. After multi-device login is enabled, this error occurs if the currently logged-in device is forcibly logged out through an API call or the EasyIM Console on another device. | The logged-out device receives the `EMConnectionListener#onLogout` callback. Upon receiving the callback, call `EMClient#logout` and return to the login page. |
| 218 | `USER_ALREADY_LOGIN_ANOTHER` | Another user is already logged in. A user attempts to log in with another account on the same device before logging out. | To log in to another account while an account is logged in, call `EMClient#logout` first. |
| 219 | `USER_MUTED_BY_ADMIN` | The user is muted. This error occurs when a globally muted user sends a message. | When all members are muted in a chat group or chat room, they cannot send messages. Restrict this action in the UI. |
| 220 | `USER_DEVICE_CHANGED` | The user's login device differs from the previous device.| The device on which login fails receives the `EMConnectionListener#onLogout` event. Upon receiving the event, call `EMClient#logout` and return to the login page. |
| 221 | `USER_NOT_ON_ROSTER` | Messaging non-contacts is prohibited. After the contact relationship check feature is enabled, this error occurs when users who are not contacts send messages to each other. You can enable this feature on the **Feature Configuration > Basic Features** > **Users** page in the [EasyIM Console](https://console.easyim.ai/user/login). | Call `EMContactManager#addContact` to add the user as a contact. A message can be sent after the other user accepts the contact request. |
| 300 | `SERVER_NOT_REACHABLE` | The server is unreachable. For example, this error is returned when sending or recalling a message if the SDK is not connected to the message server. It can also be returned when chat group, contact, or similar requests fail due to network instability. | If the login API returns this error code, the network may be restricted or the domain name may be blocked. Try switching the device network. If the user is in Saudi Arabia, the Philippines, or a similar region, contact the EasyIM business manager to enable TLS encryption in DNSConfig. For other operations, this error generally indicates a network issue. Switch networks or call the API again later. |
| 301 | `SERVER_TIMEOUT` | The service request times out because the server does not respond within the specified time, which is generally 30 or 60 seconds. | This is generally a network issue. Switch networks or call the API again later. |
| 304 | `SERVER_GET_DNSLIST_FAILED` | An error occurs while obtaining server configuration information. The SDK fails to obtain the server configuration of the current app. | If `EMOptions#enableDNSConfig` is set to `false`, the EasyIM or REST server to access might not be configured. Otherwise, this is generally caused by a network issue during login that prevents the dnsConfig request from succeeding. |
| 305 | `SERVER_SERVICE_RESTRICTED` | The current app is disabled. This error is returned if an API is called while the app is disabled. | The EasyIM service for the app or account is disabled. Enable it in the EasyIM Console or contact the EasyIM business manager. |
| 350 | `CONNECTION_TIMEOUT` | The connection to the server times out. | Check the device network connection first. If the network is available, wait a moment and try logging in again. |
| 351 | `CONNECTION_DNS_ERROR` | A DNS error occurs while connecting to the server. | Check the device network connection first. If the network is available, wait a moment and try logging in again. |
| 352 | `CONNECTION_IO_ERROR` | An I/O error occurs while connecting to the server. | Check the device network connection first. If the network is available, wait a moment and try logging in again. |
| 353 | `CONNECTION_STREAM_CLOSED` | The stream is closed while connecting to the server. | Check the device network connection first. If the network is available, wait a moment and try logging in again. |
| 354 | `CONNECTION_PROVISION_TIMEOUT` | Authentication times out while connecting to the server. | Check the device network connection first. If the network is available, wait a moment and try logging in again. |

## Message errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 400 | `FILE_NOT_FOUND` | The file cannot be found. For example, this error occurs if a user cannot obtain a log file or fails to download an attachment. | For an API that obtains log files, try obtaining the file again. For an attachment download API, this error indicates that the message attachment no longer exists and cannot be downloaded. |
| 401 | `FILE_INVALID` | The file is invalid. For example, this error may occur when uploading a message attachment or chat group shared file. | Select the attachment file again and call the relevant API to upload it. |
| 402 | `FILE_UPLOAD_FAILED` | File upload fails. For example, this error occurs when a message attachment fails to upload. | Analyze the called API and logs. |
| 403 | `FILE_DOWNLOAD_FAILED` | File download fails. For example, this error occurs when a message attachment fails to download. | This may be caused by a network issue or an expired message. Check the logs for more information. |
| 404 | `FILE_DELETE_FAILED` | Deleting a log file fails. When a log file is obtained through an API, the old log file is deleted before a new one is generated. This error occurs if the old log file cannot be deleted. | Check whether the app has permission to delete its log files or chat history. |
| 405 | `FILE_TOO_LARGE` | The file is too large. For example, this error occurs when a message attachment or chat group shared file exceeds the file size limit. | Message attachments and chat group shared files cannot exceed 10 MB by default. Select a file that meets the requirements or contact the EasyIM business manager to increase the supported file size. |
| 406 | `FILE_CONTENT_IMPROPER` | The file content is inappropriate. For example, this error occurs when the content of a message attachment or chat group shared file violates content rules. | Select a compliant file and send or upload it again. |
| 407 | `FILE_IS_EXPIRED` | The file has expired. For example, this error occurs when a user downloads an expired message attachment or chat group shared file. Message attachments and chat group shared files are stored for 7 days by default. To extend the storage period, contact the EasyIM business manager. | To extend the file storage period, contact the EasyIM business manager. |
| 500 | `MESSAGE_INVALID` | The message is invalid. For example, this error occurs when sending a message if the message object or message ID is empty or if the message sender ID differs from the currently logged-in ID. | Check how the message is constructed and whether the message ID, sender, and message body are configured correctly. |
| 501 | `MESSAGE_INCLUDE_ILLEGAL_CONTENT` | The message contains prohibited content. This error is returned if the filtering system identifies the message as prohibited. | The message is blocked by the sensitive-word filtering system or anti-spam system. View the blocking record in the EasyIM Console. |
| 504 | `MESSAGE_RECALL_TIME_LIMIT` | The message recall time limit is exceeded. | Display an error in the UI, or [extend the message recall period in the EasyIM Console](/product/console/basic_message.html#消息撤回) to a maximum of 7 days. |
| 505 | `SERVICE_NOT_ENABLED` | The service is not enabled. This error occurs when an unactivated feature is used. | Analyze the API and logs, and enable the corresponding feature in the EasyIM Console. |
| 506 | `MESSAGE_EXPIRED` | The message has expired. This error occurs when a read receipt for a group chat message is sent after the time limit, which is 3 days by default. | Display an error in the UI, or contact the EasyIM business manager to extend the validity period for sending group chat message read receipts. |
| 507 | `MESSAGE_ILLEGAL_WHITELIST` | The user is not on the allowlist. This error occurs when a user who is not on the allowlist sends a message while all members of a chat group or chat room are muted. | Display an error in the UI, or check whether all members of the chat group are muted. |
| 508 | `MESSAGE_EXTERNAL_LOGIC_BLOCKED` | A pre-sending callback blocks the message. This error occurs when a sent message is blocked by rules defined on the user's own server. | Display an error in the UI, or check the pre-sending callback records. |
| 509 | `MESSAGE_CURRENT_LIMITING` | The messaging frequency of an individual user ID exceeds the limit. By default, the SDK does not limit the frequency at which an individual user ID sends group chat messages. If the EasyIM business manager has configured such a limit, this error occurs when the messaging frequency of an individual user in a one-to-one chat, group chat, or chat room exceeds the configured upper limit. | Display an error in the UI, or check the messaging frequency setting. |
| 510 | `MESSAGE_SIZE_LIMIT` | The message body exceeds the size limit when a message is sent. | Display an error in the UI, or reduce the message body length. The default maximum is 5 KB. |
| 511 | `MESSAGE_EDIT_FAILED` | Message editing fails. | Analyze the logs. |
| 512 | `MESSAGE_STREAM_INTERVAL_TIMEOUT` | The interval between adjacent streaming message chunks times out. The interval cannot exceed 30 seconds. When it does, this error is returned and the streaming message is terminated. | Display an error in the UI, or check the interval between message chunks. |
| 513 | `MESSAGE_STREAM_TIMEOUT` | The total duration for sending a streaming message times out. It cannot exceed 30 minutes. If another chunk is sent after the timeout, this error is returned. | Display an error in the UI, or check the total duration for sending the streaming message. |

## Chat group errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 600 | `GROUP_INVALID_ID` | The chat group ID is invalid. This error occurs when an empty chat group ID is provided to a chat group API. | Check whether the chat group ID parameter passed to the API is empty or refers to a nonexistent or destroyed chat group. |
| 601 | `GROUP_ALREADY_JOINED` | The user is already in the chat group. For example, this error occurs if the user calls an API to join a chat group that they have already joined. | Treat this error as a successful join operation. |
| 602 | `GROUP_NOT_JOINED` | The user has not joined the chat group. This error occurs when the user attempts to send a message or perform a chat group operation in a chat group that they have not joined. | Check the logs and verify that the chat group ID passed to the API belongs to a joined chat group and that the chat group has not been destroyed. |
| 603 | `GROUP_PERMISSION_DENIED` | The user does not have permission to perform the chat group operation. For example, a regular chat group member does not have permission to set a chat group administrator. | Check whether the user has permission to call the API. |
| 604 | `GROUP_MEMBERS_FULL` | The chat group is full. The number of chat group members has reached the maximum specified when the chat group was created. | Display an error in the UI, or check whether the maximum number of members specified when the chat group was created exceeds the limit, which is 200 by default. |
| 605 | `GROUP_SHARED_FILE_INVALIDID` | The chat group shared file ID is invalid. | Check the APIs for downloading and deleting shared files and ensure that the `sharedFileId` parameter is not empty. |
| 606 | `GROUP_NOT_EXIST` | The chat group does not exist. This error occurs when an operation is attempted on a nonexistent chat group. | Check the logs and verify whether the chat group ID passed to the API is correct or refers to a destroyed chat group. |
| 607 | `GROUP_DISABLED` | The chat group is disabled. | Display an error in the UI, or ask an administrator to re-enable the chat group. |
| 608 | `GROUP_NAME_VIOLATION` | The chat group name is invalid. | Check whether the chat group name passed to the API contains sensitive information. |
| 609 | `GROUP_MEMBER_ATTRIBUTES_REACH_LIMIT` | The total length of custom attributes for a chat group member reaches the upper limit. | The total length of custom attributes for an individual chat group member cannot exceed 4 KB. |
| 610 | `GROUP_MEMBER_ATTRIBUTES_UPDATE_FAILED` | Setting custom attributes for a chat group member fails. | Analyze the called API and logs. |
| 611 | `GROUP_MEMBER_ATTRIBUTES_KEY_REACH_LIMIT` | The key of a custom chat group member attribute exceeds the length limit of 16 bytes. | Check whether the key of the chat group member attribute passed to the API exceeds the limit. |
| 612 | `GROUP_MEMBER_ATTRIBUTES_VALUE_REACH_LIMIT` | The value of a custom chat group member attribute exceeds the length limit of 512 bytes. | Check whether the value of the chat group member attribute passed to the API exceeds the limit. |
| 613 | `GROUP_USER_IN_BLOCKLIST` | The user is on the chat group blocklist. This error occurs when a user on the chat group blocklist performs certain operations, such as joining the chat group. | Display an error in the UI, or check in the EasyIM Console whether the user is on the chat group blocklist. |

## Chat room errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 700 | `CHATROOM_INVALID_ID` | The chat room ID is invalid. This error occurs when an empty chat room ID is passed to a chat room API. | Check whether the chat room ID passed to the API is empty. |
| 701 | `CHATROOM_ALREADY_JOINED` | The user is already in the chat room. This error occurs when the user calls an API to join a chat room that they have already joined. | Treat this as a successful join operation. |
| 702 | `CHATROOM_NOT_JOINED` | The user has not joined the chat room. This error occurs when the user sends a message or performs a chat room operation in a chat room that they have not joined. | Check the logs and verify whether the chat room ID passed to the API is correct or refers to a chat room that has been destroyed or that the user previously failed to join. |
| 703 | `CHATROOM_PERMISSION_DENIED` | The user does not have permission to perform the chat room operation. For example, a regular chat room member does not have permission to set a chat room administrator. | Check whether the user has permission to call the API. |
| 704 | `CHATROOM_MEMBERS_FULL` | The chat room is full. The number of chat room members has reached the maximum specified when the chat room was created. | Check the maximum number of members specified when the chat room was created. |
| 705 | `CHATROOM_NOT_EXIST` | The chat room does not exist. This error occurs when an operation is attempted on a nonexistent chat room. | Check whether the chat room ID passed to the API is correct or refers to a chat room that has been destroyed or that the user previously failed to join. |
| 706 | `CHATROOM_OWNER_NOT_ALLOW_LEAVE` | The chat room owner is not allowed to leave. If `EMOptions#allowChatroomOwnerLeave` is set to `false` during initialization, this error occurs when the chat room owner calls `EMChatRoomManager#leaveChatRoom` to leave. | Check the value of `EMOptions#allowChatroomOwnerLeave` set during SDK initialization. |
| 707 | `CHATROOM_USER_IN_BLOCKLIST` | The user is on the chat room blocklist. This error occurs when a user on the chat room blocklist performs certain operations, such as joining the chat room. | Check in the EasyIM Console whether the user is on the chat room blocklist. |

## User attribute errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 900 | `USERINFO_USERCOUNT_EXCEED` | The number of users whose attributes are being retrieved exceeds 100. | Attributes can be retrieved for a maximum of 100 users in each API call. Retrieve them in batches. |
| 901 | `USERINFO_DATALENGTH_EXCEED` | The user attributes being set are too long. All attribute data for a single user cannot exceed 2 KB, and the attribute data for all users in a single app cannot exceed 10 GB. | Check whether the user attributes set through the API exceed the limit. |

## Contact errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 1000 | `CONTACT_ADD_FAILED` | Adding a contact fails. | Analyze the called API and error description to determine why the contact could not be added. |
| 1001 | `CONTACT_REACH_LIMIT` | The inviter's number of contacts reaches the upper limit. | Display the error in the UI, or [increase the maximum number of contacts per user in the EasyIM Console](/product/console/basic_user.html#单个用户好友数上限). |
| 1002 | `CONTACT_REACH_LIMIT_PEER` | The invitee's number of contacts reaches the upper limit. | Display the error in the UI, or [increase the maximum number of contacts per user in the EasyIM Console](/product/console/basic_user.html#单个用户好友数上限). |

## Presence errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 1100 | `PRESENCE_PARAM_LENGTH_EXCEED` | - The Presence subscription feature is not enabled.<br/> - The parameter length exceeds the limit when a Presence-related method is called. | <br/>Enable the Presence feature in the EasyIM Console before using it. <br/> - When calling the [API for publishing a custom presence state](presence.html#publish-custom-presence), the presence details cannot exceed 64 bytes. |
| 1101 | `PRESENCE_CANNOT_SUBSCRIBE_YOURSELF` | You cannot subscribe to your own presence state. | Check whether the subscribed user ID passed to the API is your own user ID. |

## Translation errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 1110 | `TRANSLATE_PARAM_INVALID` | A translation parameter is invalid. | Analyze the Debug logs to identify the invalid parameter passed to the translation method. |
| 1111 | `TRANSLATE_SERVICE_NOT_ENABLE` | The translation service is not enabled. Before using this service, enable it in the [EasyIM Console](https://console.easyim.ai/user/login). | Enable the translation service in the [EasyIM Console](https://console.easyim.ai/user/login). |
| 1112 | `TRANSLATE_USAGE_LIMIT` | The translation usage reaches the upper limit. | Contact the EasyIM business manager to renew the translation quota. |
| 1113 | `TRANSLATE_MESSAGE_FAIL` | Message translation fails. | Analyze the Debug logs to determine why the translation failed. |

## Content moderation errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 1200 | `MODERATION_FAILED` | A third-party content moderation service returns **Reject** as the message moderation result. | View and analyze content moderation configurations and records in the [EasyIM Console](https://console.easyim.ai/user/login). |
| 1299 | `THIRD_SERVER_FAILED` | A service other than a third-party content moderation service returns **Reject** as the message moderation result. | View and analyze content moderation configurations and records in the [EasyIM Console](https://console.easyim.ai/user/login). |

## Reaction errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 1300 | `REACTION_REACH_LIMIT` | The number of Reactions on the message reaches the limit. | Display an error in the UI, or contact the EasyIM business manager to increase the maximum number of Reactions supported for a message. |
| 1301 | `REACTION_HAS_BEEN_OPERATED` | The user has already added this Reaction and cannot add it repeatedly. | Treat this as a successful Reaction addition. |
| 1302 | `REACTION_OPERATION_IS_ILLEGAL` | The user does not have permission to operate on this Reaction. For example, a user attempts to delete a Reaction that they have not added, or a user who is neither the sender nor the recipient of a one-to-one chat message attempts to add a Reaction to it. | Analyze the logs and check whether the parameters passed to the API are correct. |

## Message thread errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 1400 | `THREAD_NOT_EXIST` | The message thread does not exist. | Check the logs and verify whether the message thread ID passed to the API is correct. |
| 1401 | `THREAD_ALREADY_EXIST` | The message thread already exists and is being added again. | Check whether a message thread has already been created for the specified message. If so, do not create another one. |

## Offline push errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 1500 | `PUSH_NOT_SUPPORT` | Third-party push is not supported. This error occurs if the third-party push service configured by the user is not supported on the current device. | See [Offline Push Overview](/document/android/push/push_overview.html) and check for missing device manufacturer configurations. If the SDK does not support the current device, contact the EasyIM business manager. |
| 1501 | `PUSH_BIND_FAILED` | Binding a third-party push token fails. This error is returned if the third-party push token fails to upload to the server. | After `EMPushHelper#setPushListener` is registered, a binding failure triggers the `PushListener#onError` callback. Check the network and manufacturer push configuration first. If they are correct, call `EMPushManager#bindDeviceToken` to bind the push token again. |
| 1502 | `PUSH_UNBIND_FAILED` | Unbinding a third-party push token fails. | After `EMPushHelper#setPushListener` is registered, an unbinding failure triggers the `PushListener#onError` callback. Call `EMClient#logout` again. To ensure logout succeeds, set `unbindToken` to `false` to temporarily skip unbinding the push token. |
