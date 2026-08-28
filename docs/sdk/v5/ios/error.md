# Error Codes

This page describes error codes returned by API calls or callbacks in the EasyIM iOS SDK. You can use a specific error code to determine the cause of an error.

The error code class on iOS is `EMError`.

For example, you can detect the error indicating that a user already exists during registration as follows: `EMError.code == EMErrorUserAlreadyExist`.

An iOS error code is returned only when an operation fails. Otherwise, `nil` is returned.


Example:

```objectivec
[[EMClient sharedClient] loginWithUsername:userId
                                     token:token
                               completion:^(NSString *username, EMError *error) {
    if (error) {
        if (error.code == EMErrorInvalidToken ||
            error.code == EMErrorTokenExpire) {
            // Obtain a new Token and log in again.
        } else {
            // Handle other errors based on the error code and error information.
        }
        return;
    }

    // Login succeeds.
}];
```

## General, validation, and connection errors

### General errors

| Error code | Error | Description and possible cause | Solution |
| :--- | :--- | :--- | :--- |
| 0      |   `EMErrorNoError`  | The operation succeeds. |  |
| 1      |           `EMErrorGeneral`            | The default SDK- or request-related error for which no specific error type is identified. For example, this error occurs if the SDK is not properly initialized internally or if a request to the server fails for an unidentified reason. | Analyze the logs and the called API. |
| 2      |      `EMErrorNetworkUnavailable`      | A network error occurs. This error is returned when no network service is available and indicates that the connection between the SDK and server has been disconnected. | For chat group or chat room operations, this error may be returned if the network is unavailable. Try the operation again after the network recovers. |
| 3      |   `EMErrorDatabaseOperationFailed`    | A database operation fails because the local database cannot be opened. | Analyze the called API and logs. For example, this error may be returned if `EMConversation#updateMessage` is used to update a message that does not exist locally or if another local database operation is performed before the database is opened. |
| 4      |      `EMErrorExceedServiceLimit`      | A service limit is exceeded. For example, this error occurs when the number of created user IDs exceeds the limit of the current service plan. It is also reported when the API call frequency limit is exceeded for APIs that set or get user attributes, including [setting all attributes of the current user](userprofile.html#set-all-attributes-of-the-current-user), [getting all attributes of a user](userprofile.html#retrieve-all-user-attributes-from-the-server), and [getting specified attributes of users](userprofile.html#retrieve-specified-user-attributes-from-the-server). | Check the called API. If it takes a `limit` parameter, keep the value within the allowed range. If the error is caused by rate limiting, call the API again later. |
| 8      |      `EMAppActiveNumbersReachLimitation`       | The number of daily active users (DAU) or monthly active users (MAU) of the app reaches the upper limit. | Upgrade the EasyIM service in the [EasyIM Console](https://console.easyim.ai/user/login). |
| 302    |          `EMErrorServerBusy`          | The server is busy. Try the request again later. | Check whether the API is called repeatedly. This error may be returned if the API is called again before the result of the previous call is returned. |
| 303    |      `EMErrorServerUnknownError`      | A general service request error. This is the default error when a server request fails. Because it can occur in many situations, further investigation based on the logs is required. | Provide the logs and the called API for further investigation. |

### Validation errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 100    |        `EMErrorInvalidAppkey`         | The App Key is invalid because its format is incorrect. You can view the App Key on the **App Overview** page in the [EasyIM Console](https://console.easyim.ai/user/login). | Initialize the SDK with the correct App Key. |
| 101    |       `EMErrorInvalidUsername`        | The user ID is invalid. This error generally occurs when the user ID is empty, such as when the username parameter is an empty string while inviting a contact. | Check whether the user ID parameter passed to the API is empty. |
| 102    |       `EMErrorInvalidPassword`        | The user password is invalid. The password provided during login is empty or incorrect. | Check whether the password parameter passed to the API is correct. |
| 103    |          `EMErrorInvalidURL`          | The URL is invalid. | Check whether the parameters passed to the API are correct. |
| 104    |          `EMErrorInvalidToken`        | The user token is invalid. The token provided during login is empty or incorrect. | Check whether the token parameter passed to the API is correct. |
| 105    |       `EMErrorUsernameTooLong`        | The user ID is too long. A user ID cannot exceed 64 bytes. | Check whether the user ID passed to the API exceeds the length limit. |
| 110    |       `EMErrorInvalidParam`        | A parameter is invalid. | Check whether the parameters passed to the API are valid. |

### Connection errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 108    |       `EMErrorTokenExpire`     | The user token has expired because it has exceeded its validity period. | After receiving the token expiration callback, generate a new token and call `login` to log in again. |
| 109    |       `EMErrorTokeWillExpire`      | The user token is about to expire. This error code starts to be returned when 80% of the token validity period has elapsed. | After receiving the token expiration warning callback, generate a new token and call `EMClient#renewToken` to update it. |
| 200    |     `EMErrorUserAlreadyLoginSame`     | The user is already logged in. The user ID has already logged in. | Check whether the SDK has already called a login method. |
| 201    |         `EMErrorUserNotLogin`         | The user is not logged in. For example, this error is returned when a message sending or chat group operation API is called before login succeeds. | Check whether EasyIM login has completed when calling the API. |
| 202    |   `EMErrorUserAuthenticationFailed`   | User authentication fails:<br/> - When logging in with a user ID and password, this error is reported if the user ID or password is incorrect.<br/> - When logging in with a user ID and user token, this error generally indicates that the token is invalid or expired. | If the user has logged out, log in again. Otherwise, generate a new token and call `EMClient#renewToken` to update it. |
| 203    |       `EMErrorUserAlreadyExist`       | The user already exists. This error occurs during registration if the specified user ID already exists. | Register with a different user ID. |
| 204    |         `EMErrorUserNotFound`         | The user does not exist. For example, the user ID does not exist when logging in or retrieving the user's conversation list. | Check whether the user ID parameter passed to the API is correct. |
| 205    |     `EMErrorUserIllegalArgument`      | A user parameter is invalid. For example, the user ID is empty or invalid when creating a user or updating user attributes. | Check whether the parameters passed to the API are correct. |
| 206    |   `EMErrorUserLoginOnAnotherDevice`   | The user logs in on another device. If multi-device login is disabled, logging in on another device logs out the current device, which receives this error. | When the device is logged out, the `EMClientDelegate#userAccountDidLoginFromOtherDevice` event is triggered. Log in again after receiving this event. |
| 207    |         `EMErrorUserRemoved`          | The user has been deleted. This error is received when the currently logged-in user ID is deleted from the [EasyIM Console](https://console.easyim.ai/user/login). | When the account is deleted, `EMClientDelegate#userAccountDidRemoveFromServer` is triggered. After receiving this event, return to the login page because the account is no longer available. |
| 208    |      `EMErrorUserRegisterFailed`      | User registration fails. For example, the [open registration feature](/rest/account_register_open.html) has not been enabled before the user is registered. | Registering accounts through the SDK is not recommended. Register accounts on the app server. |
| 209    |   `EMErrorUpdateApnsConfigsFailed`    | An error occurs while updating the push configuration. For example, the user fails to update the push nickname or configure Do Not Disturb settings. | Check the API that reported the error and call it again later. |
| 210    |     `EMErrorUserPermissionDenied`     | The user does not have permission. For example, this error occurs when a user sends a message after being added to a blocklist. Other cases include a user modifying a message sent by another user, modifying chat group member attributes set by another user, or a regular chat group member attempting to destroy a message thread. Only the owner and administrators of the chat group containing the message thread can destroy it. | Check whether the user has permission to perform the operation. |
| 211    |  `EMErrorUserBindDeviceTokenFailed`   | Binding the device token fails. | Check whether the token passed to the API for binding the device push token is empty. |
| 213    |    `EMErrorUserBindAnotherDevice`     | The user is already logged in on another device. In a single-device login scenario, the device that logs in later logs out the current device by default. If priority is given to the device that logged in first, login fails on the later device and this error is returned. | Enable multi-device login, or call `EMClient#kickDevice` to log out the other device before logging in. |
| 214    |   `EMErrorUserLoginTooManyDevices`    | The number of devices on which the user is logged in exceeds the limit. | Increase the number of devices that can be online simultaneously, or call `EMClient#kickDevice` to log out another device before logging in. |
| 215    |          `EMErrorUserMuted`           | The user is muted in a chat group or chat room. This error occurs when the muted user sends a message. | A user who is muted in a chat group or chat room cannot send messages. Restrict this action in the UI. |
| 216    |  `EMErrorUserKickedByChangePassword`  | The user's password is updated. After the password of the currently logged-in user is changed, the current connection is disconnected and this error occurs. | The `EMClientDelegate#userAccountDidForcedToLogout` callback is received after the password is updated. Upon receiving the callback, call `EMClient#logout` and return to the login page. |
| 217    |   `EMErrorUserKickedByOtherDevice`    | The user is forcibly logged out. After multi-device login is enabled, this error occurs if the currently logged-in device is forcibly logged out through an API call or the EasyIM Console on another device. | The logged-out device receives the `EMClientDelegate#userAccountDidForcedToLogout` callback. Upon receiving the callback, call `EMClient#logout` and return to the login page. |
| 218    |   `EMErrorUserAlreadyLoginAnother`    | Another user is already logged in. A user attempts to log in with another account on the same device before logging out. | To log in to another account while an account is logged in, call `EMClient#logut` first. |
| 219    |       `EMErrorUserMutedByAdmin`       | The user is muted. This error occurs when a globally muted user sends a message. | When all members are muted in a chat group or chat room, they cannot send messages. Restrict this action in the UI. |
| 220    |       `EMErrorUserDeviceChanged`       | The user's login device differs from the previous device.| The device on which login fails receives the `EMClientDelegate#userAccountDidLoginFromOtherDevice` event. Upon receiving the event, call `EMClient#logout` and return to the login page. |
| 221    |      `EMErrorUserNotOnRoster`   | Messaging non-contacts is prohibited. After the contact relationship check feature is enabled, this error occurs when users who are not contacts send messages to each other. You can enable this feature on the **Feature Configuration > Basic Features** > **Users** page in the [EasyIM Console](https://console.easyim.ai/user/login). | Call `EMContactManager#addContact` to add the user as a contact. A message can be sent after the other user accepts the contact request. |
| 300    |      `EMErrorServerNotReachable`      | The server is unreachable. For example, this error is returned when sending or recalling a message if the SDK is not connected to the message server. It can also be returned when chat group, contact, or similar requests fail due to network instability. | If the login API returns this error code, the network may be restricted or the domain name may be blocked. Try switching the device network. If the user is in Saudi Arabia, the Philippines, or a similar region, contact the EasyIM business manager to enable TLS encryption in DNSConfig. For other operations, this error generally indicates a network issue. Switch networks or call the API again later. |
| 301    |        `EMErrorServerTimeout`         | The service request times out because the server does not respond within the specified time, which is generally 30 or 60 seconds. | This is generally a network issue. Switch networks or call the API again later. |
| 304    |   `EMErrorServerGetDNSConfigFailed`   | An error occurs while obtaining server configuration information. The SDK fails to obtain the server configuration of the current app. | If `EMOptions#enableDnsConfig` is set to `No`, the EasyIM or REST server to access might not be configured. Otherwise, this is generally caused by a network issue during login that prevents the dnsConfig request from succeeding. |
| 305    |    `EMErrorServerServingForbidden`    | The current app is disabled. This error is returned if an API is called while the app is disabled. | The EasyIM service for the app or account is disabled. Enable it in the EasyIM Console or contact the EasyIM business manager. |
| 350    | `EMErrorConnectionTimeout`     | The connection to the server times out. | Check the device network connection first. If the network is available, wait a moment and try logging in again. |
| 351    | `EMErrorConnectionDNSError`     | A DNS error occurs while connecting to the server. | Check the device network connection first. If the network is available, wait a moment and try logging in again. |
| 352    | `EMErrorConnectionIOError`     | An I/O error occurs while connecting to the server. | Check the device network connection first. If the network is available, wait a moment and try logging in again. |
| 353    | `EMErrorConnectionStreamClosed`  | The stream is closed while connecting to the server. | Check the device network connection first. If the network is available, wait a moment and try logging in again. |
| 354    | `EMErrorConnectionProvisionTimeout`  | Authentication times out while connecting to the server. | Check the device network connection first. If the network is available, wait a moment and try logging in again. |

## Message errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 400    |         `EMErrorFileNotFound`         | The file cannot be found. For example, this error occurs if a user cannot obtain a log file or fails to download an attachment. | For an API that obtains log files, try obtaining the file again. For an attachment download API, this error indicates that the message attachment no longer exists and cannot be downloaded. |
| 401    |         `EMErrorFileInvalid`          | The file is invalid. For example, this error may occur when uploading a message attachment or chat group shared file. | Select the attachment file again and call the relevant API to upload it. |
| 402    |       `EMErrorFileUploadFailed`       | File upload fails. For example, this error occurs when a message attachment fails to upload. | Analyze the called API and logs. |
| 403    |      `EMErrorFileDownloadFailed`      | File download fails. For example, this error occurs when a message attachment fails to download. | This may be caused by a network issue or an expired message. Check the logs for more information. |
| 404    |       `EMErrorFileDeleteFailed`       | <br/> - Deleting a log file fails: When a log file is obtained through an API, the old log file is deleted before a new one is generated. This error occurs if the old log file cannot be deleted.<br/> - Clearing chat history fails: When `EMChatManager#deleteAllMessagesAndConversations` is called, this error is also returned if the local conversation path cannot be deleted. | Check whether the app has permission to delete its log files or chat history. |
| 405    |         `EMErrorFileTooLarge`         | The file is too large. For example, this error occurs when a message attachment or chat group shared file exceeds the file size limit. | Message attachments and chat group shared files cannot exceed 10 MB by default. Select a file that meets the requirements or contact the EasyIM business manager to increase the supported file size. |
| 406    |     `EMErrorFileContentImproper`      | The file content is inappropriate. For example, this error occurs when the content of a message attachment or chat group shared file violates content rules. | Select a compliant file and send or upload it again. |
| 407    |      `EMErrorFileExpired`      | The file has expired. For example, this error occurs when a user downloads an expired message attachment or chat group shared file. Message attachments and chat group shared files are stored for 7 days by default. To extend the storage period, contact the EasyIM business manager. | To extend the file storage period, contact the EasyIM business manager. |
| 500    |        `EMErrorMessageInvalid`        | The message is invalid. For example, this error occurs when sending a message if the message object or message ID is empty or if the message sender ID differs from the currently logged-in ID. | Check how the message is constructed and whether the message ID, sender, and message body are configured correctly. |
| 501    | `EMErrorMessageIncludeIllegalContent` | The message contains prohibited content. This error is returned if the filtering system identifies the message as prohibited. | The message is blocked by the sensitive-word filtering system or anti-spam system. View the blocking record in the EasyIM Console. |
| 504    |    `EMErrorMessageRecallTimeLimit`    | The message recall time limit is exceeded. | Display an error in the UI, or [extend the message recall period in the EasyIM Console](/product/console/basic_message.html#消息撤回) to a maximum of 7 days. |
| 505    |       `EMErrorServiceNotEnable`       | The service is not enabled. This error occurs when an unactivated feature is used. | Analyze the API and logs, and enable the corresponding feature in the EasyIM Console. |
| 506    |        `EMErrorMessageExpired`        | The message has expired. This error occurs when a read receipt for a group chat message is sent after the time limit, which is 3 days by default. | Display an error in the UI, or contact the EasyIM business manager to extend the validity period for sending group chat message read receipts. |
| 507    |   `EMErrorMessageIllegalWhiteList`    | The user is not on the allowlist. This error occurs when a user who is not on the allowlist sends a message while all members of a chat group or chat room are muted. | Display an error in the UI, or check whether all members of the chat group are muted. |
| 508    | `EMErrorMessageExternalLogicBlocked`  | A pre-sending callback blocks the message. This error occurs when a sent message is blocked by rules defined on the user's own server. | Display an error in the UI, or check the pre-sending callback records. |
| 509    |    `EMErrorMessageCurrentLimiting`    | The messaging frequency of an individual user ID exceeds the limit. By default, the SDK does not limit the frequency at which an individual user ID sends group chat messages. If the EasyIM business manager has configured such a limit, this error occurs when the messaging frequency of an individual user in a one-to-one chat, group chat, or chat room exceeds the configured upper limit. | Display an error in the UI, or check the messaging frequency setting. |
| 510    |    `EMErrorMessageSizeLimit`    | The message body exceeds the size limit when a message is sent. | Display an error in the UI, or reduce the message body length. The default maximum is 5 KB. |
| 511   | `EMErrorEditFailed`  | Message editing fails. | Analyze the logs. |
| 512    | `EMErrorStreamIntervalTimeout`                 | The interval between adjacent streaming message chunks times out. The interval cannot exceed 30 seconds. When it does, this error is returned and the streaming message is terminated. | Display an error in the UI, or check the interval between message chunks. |
| 513    | `EMErrorMessageStreamTimeout`                 | The total duration for sending a streaming message times out. It cannot exceed 30 minutes. If another chunk is sent after the timeout, this error is returned. | Display an error in the UI, or check the total duration for sending the streaming message. |

## Chat group errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 600    |        `EMErrorGroupInvalidId`        | The chat group ID is invalid. This error occurs when an empty chat group ID is provided to a chat group API. | Check whether the chat group ID parameter passed to the API is empty or refers to a nonexistent or destroyed chat group. |
| 601    |      `EMErrorGroupAlreadyJoined`      | The user is already in the chat group. For example, this error occurs if the user calls an API to join a chat group that they have already joined. | Treat this error as a successful join operation. |
| 602    |        `EMErrorGroupNotJoined`        | The user has not joined the chat group. This error occurs when the user attempts to send a message or perform a chat group operation in a chat group that they have not joined. | Check the logs and verify that the chat group ID passed to the API belongs to a joined chat group and that the chat group has not been destroyed. |
| 603    |    `EMErrorGroupPermissionDenied`     | The user does not have permission to perform the chat group operation. For example, a regular chat group member does not have permission to set a chat group administrator. | Check whether the user has permission to call the API. |
| 604    |       `EMErrorGroupMembersFull`       | The chat group is full. The number of chat group members has reached the maximum specified when the chat group was created. | Display an error in the UI, or check whether the maximum number of members specified when the chat group was created exceeds the limit, which is 200 by default. |
| 605    |   `EMErrorGroupSharedFileInvalidId`   | The chat group shared file ID is invalid. | Check the APIs for downloading and deleting shared files and ensure that the `sharedFileId` parameter is not empty. |
| 606    |        `EMErrorGroupNotExist`         | The chat group does not exist. This error occurs when an operation is attempted on a nonexistent chat group. | Check the logs and verify whether the chat group ID passed to the API is correct or refers to a destroyed chat group. |
| 607    |        `EMErrorGroupDisabled`        | The chat group is disabled. | Display an error in the UI, or ask an administrator to re-enable the chat group. |
| 608    |        `EMErrorGroupNameViolation`        | The chat group name is invalid. | Check whether the chat group name passed to the API contains sensitive information. |
| 609    |   `EMErrorGroupMemberAttributesReachLimit`   | The total length of custom attributes for a chat group member reaches the upper limit. | The total length of custom attributes for an individual chat group member cannot exceed 4 KB. |
| 610    |   `EMErrorGroupMemberAttributesUpdateFailed`   | Setting custom attributes for a chat group member fails. | Analyze the called API and logs. |
| 611    |   `EMErrorGroupMemberAttributesKeyReachLimit`   | The key of a custom chat group member attribute exceeds the length limit of 16 bytes. | Check whether the key of the chat group member attribute passed to the API exceeds the limit. |
| 612    |   `EMErrorGroupMemberAttributesValueReachLimit`   | The value of a custom chat group member attribute exceeds the length limit of 512 bytes. | Check whether the value of the chat group member attribute passed to the API exceeds the limit. |
| 613   | `EMErrorGroupUserInBlockList`    | The user is on the chat group blocklist. This error occurs when a user on the chat group blocklist performs certain operations, such as joining the chat group. | Display an error in the UI, or check in the EasyIM Console whether the user is on the chat group blocklist. |

## Chat room errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 700    |      `EMErrorChatroomInvalidId`       | The chat room ID is invalid. This error occurs when an empty chat room ID is passed to a chat room API. | Check whether the chat room ID passed to the API is empty. |
| 701    |    `EMErrorChatroomAlreadyJoined`     | The user is already in the chat room. This error occurs when the user calls an API to join a chat room that they have already joined. | Treat this as a successful join operation. |
| 702    |      `EMErrorChatroomNotJoined`       | The user has not joined the chat room. This error occurs when the user sends a message or performs a chat room operation in a chat room that they have not joined. | Check the logs and verify whether the chat room ID passed to the API is correct or refers to a chat room that has been destroyed or that the user previously failed to join. |
| 703    |   `EMErrorChatroomPermissionDenied`   | The user does not have permission to perform the chat room operation. For example, a regular chat room member does not have permission to set a chat room administrator. | Check whether the user has permission to call the API. |
| 704    |     `EMErrorChatroomMembersFull`      | The chat room is full. The number of chat room members has reached the maximum specified when the chat room was created. | Check the maximum number of members specified when the chat room was created. |
| 705    |       `EMErrorChatroomNotExist`       | The chat room does not exist. This error occurs when an operation is attempted on a nonexistent chat room. | Check whether the chat room ID passed to the API is correct or refers to a chat room that has been destroyed or that the user previously failed to join. |
| 706 | `EMErrorChatroomOwnerNotAllowLeave` | The chat room owner is not allowed to leave. If `EMOptions#allowChatroomOwnerLeave` is set to `false` during initialization, this error occurs when the chat room owner calls `leaveChatroom` to leave. | Check the value of `EMOptions#allowChatroomOwnerLeave` set during SDK initialization. |
| 707    | `EMErrorChatroomUserInBlockList`        | The user is on the chat room blocklist. This error occurs when a user on the chat room blocklist performs certain operations, such as joining the chat room. | Check in the EasyIM Console whether the user is on the chat room blocklist. |

## User attribute errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 900    |       `EMErrorUserCountExceed`        | The number of users whose attributes are being retrieved exceeds 100. | Attributes can be retrieved for a maximum of 100 users in each API call. Retrieve them in batches. |
| 901    |   `EMErrorUserInfoDataLengthExceed`   | The user attributes being set are too long. All attribute data for a single user cannot exceed 2 KB, and the attribute data for all users in a single app cannot exceed 10 GB. | Check whether the user attributes set through the API exceed the limit. |

## Contact errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 1000   |       `EMErrorContactAddFailed`       | Adding a contact fails. | Analyze the called API and `EMError#errorDescription` to determine why the contact could not be added. |
| 1001   |      `EMErrorContactReachLimit`       | The inviter's number of contacts reaches the upper limit. | Display the error in the UI, or [increase the maximum number of contacts per user in the EasyIM Console](/product/console/basic_user.html#单个用户好友数上限). |
| 1002   |    `EMErrorContactReachLimitPeer`     | The invitee's number of contacts reaches the upper limit. | Display the error in the UI, or [increase the maximum number of contacts per user in the EasyIM Console](/product/console/basic_user.html#单个用户好友数上限). |

## Presence errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 1100   |     `EMErrorPresenceParamExceed`      | - The Presence subscription feature is not enabled.<br/> - The parameter length exceeds the limit when a Presence-related method is called. | <br/>Enable the Presence feature in the EasyIM Console before using it. <br/> - When calling the [API for publishing a custom presence state](presence.html#publish-custom-presence), the presence details cannot exceed 64 bytes. |
| 1101   | `EMErrorPresenceCannotSubscribeSelf`  | You cannot subscribe to your own presence state. | Check whether the subscribed user ID passed to the API is your own user ID. |

## Translation errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 1110   |     `EMErrorTranslateParamError`      | A translation parameter is invalid. | Analyze the Debug logs to identify the invalid parameter passed to the translation method. |
| 1111   |  `EMErrorTranslateServiceNotEnabled`  | The translation service is not enabled. Before using this service, enable it in the [EasyIM Console](https://console.easyim.ai/user/login). | Enable the translation service in the [EasyIM Console](https://console.easyim.ai/user/login). |
| 1112   |     `EMErrorTranslateUsageLimit`      | The translation usage reaches the upper limit. | Contact the EasyIM business manager to renew the translation quota. |
| 1113   |     `EMErrorTranslateServiceFail`     | Message translation fails. | Analyze the Debug logs to determine why the translation failed. |

## Content moderation errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 1200   |     `EMErrorModerationFailed`           | A third-party content moderation service returns **Reject** as the message moderation result. | View and analyze content moderation configurations and records in the [EasyIM Console](https://console.easyim.ai/user/login). |
| 1299   |     `EMErrorThirdServiceFailed`        | A service other than a third-party content moderation service returns **Reject** as the message moderation result. | View and analyze content moderation configurations and records in the [EasyIM Console](https://console.easyim.ai/user/login). |

## Reaction errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 1300   |     `EMErrorReactionReachLimit`      | The number of Reactions on the message reaches the limit. | Display an error in the UI, or contact the EasyIM business manager to increase the maximum number of Reactions supported for a message. |
| 1301   |   `EMErrorReactionHasBeenOperated`    | The user has already added this Reaction and cannot add it repeatedly. | Treat this as a successful Reaction addition. |
| 1302   |  `EMErrorReactionOperationIsIllegal`  | The user does not have permission to operate on this Reaction. For example, a user attempts to delete a Reaction that they have not added, or a user who is neither the sender nor the recipient of a one-to-one chat message attempts to add a Reaction to it. | Analyze the logs and check whether the parameters passed to the API are correct. |

## Message thread errors

| Error code | Error | Description and possible cause | Solution |
| :----- | :------------ | :--------------------------- | :--------------------------- |
| 1400   |  `EMErrorThreadNotExist`        | The message thread does not exist. | Check the logs and verify whether the message thread ID passed to the API is correct. |
| 1401   |        `EMErrorThreadAlreadyExist`         | The message thread already exists and is being added again. | Check whether a message thread has already been created for the specified message. If so, do not create another one. |
