# Error Code

This document describes the error codes that the EasyIM Web SDK may return when an API call fails. Use `code` and `message` in the error object and server information in `details` to determine the specific cause of failure.

For most APIs, the SDK throws an error object when the call fails. In a `try...catch` block, we recommend handling the error primarily according to `error.code` and `error.message`. If the error object contains `details.serverCode` or `details.canonicalCode`, use them for troubleshooting.

Example code:

```typescript
try {
  const message = client.chatManager.createTextMessage({
    conversationId: 'user_1',
    conversationType: 'singleChat',
    content: 'hello',
  });

  await client.chatManager.sendMessage(message);
} catch (error: any) {
  console.log('Error code:', error.code);
  console.log('Error message:', error.message);
  console.log('Server-side error code:', error.details?.serverCode);
  console.log('canonicalCode:', error.details?.canonicalCode);
}
```

:::tip
The same public error code may correspond to multiple error messages or trigger scenarios. We recommend basing your app's handling logic primarily on `error.code`. Use `error.message` and `details` for display, logging, and troubleshooting.
:::

## General, validation, and connection errors

### General errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 1 | `CONNECTION_NOT_CREATED` / `CONNECTION_CANCELLED` / `MESSAGE_SENDER_DESTROYED` / `UPLOAD_ABORTED` / `UNKNOWN` | General error. Common causes include a connection object that has not been created, a canceled request, a destroyed message sender, a canceled upload, or an unknown error that the SDK cannot classify further. | Check the call timing, object lifecycle, and current connection state. If the error is temporary, try again later. |
| 2 | `COMBINE_DOWNLOAD_FAILED` / `REST_NETWORK_ERROR` | A network request or combined-message download failed. | Check the network, login state, service address, and resource address, and try again. |
| 3 | `STORAGE_OPERATION_FAILED` | A local storage operation failed. For example, the current runtime environment does not support the required storage capability, permission is restricted, or storage space is insufficient. | Check local-storage permissions, capacity, and availability in the browser or Mini Program runtime. |
| 4 | `COMBINE_LEVEL_EXCEEDED` / `COMBINE_ITEM_LIMIT_EXCEEDED` / `SERVICE_LIMIT_EXCEEDED` | A service limit was reached. Common scenarios include exceeding the nesting-level or item-count limit for combined messages, request frequency or service quota limits, blocklist or attribute-count limits, or limits on the DAU, MAU, or number of online users. | Use `error.message` or `details` to identify the specific limit, and reduce the size of each request or the call frequency. For a service quota limit, contact the EasyIM business manager to increase the quota. |
| 302 | `SERVER_BUSY` | The server is busy. | Try again later. If the issue persists, contact the EasyIM technical support team to investigate the server state. |
| 303 | `MESSAGE_SEND_FAILED` / `STREAM_SEND_NOT_SUPPORTED` / `REST_HTTP_ERROR` / `REST_BUSINESS_UNKNOWN` | Message sending failed, the current runtime environment does not support stream sending, or a REST request returned an unnormalized business error. | Check the API parameters, current connection state, runtime capabilities, and server response. If necessary, try again later or contact the EasyIM technical support team. |

### Validation errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 100 | `UPLOAD_INVALID_APPKEY` | The `appKey` used for the upload is invalid. | Check whether the `appKey` passed during SDK initialization is correct. |
| 107 | `INVALID_CONVERSATION` | The conversation parameters are invalid. | Check whether `conversationId` and `conversationType` are correct. `conversationType` must use a value supported by the Web SDK. |
| 110 | `VALIDATION_REQUIRED` / `VALIDATION_INVALID_FORMAT` / `VALIDATION_UNKNOWN` / `COMBINE_INVALID_INPUT` / `UPLOAD_REQUIRED_FIELD_MISSING` | A parameter is missing or has an invalid format, the combined-message input is invalid, or an upload is missing a required field. | Add the required fields according to the corresponding API parameter description, and check field types, value ranges, and formats. |
| 111 | `OPERATION_UNSUPPORTED` | The current operation or message type does not support this capability. | Use a capability supported by the Web SDK or adjust the calling scenario. |
| 112 | `QUERY_PARAM_REACHES_LIMIT` | The number of historical messages to delete in a single call exceeds the limit. | Reduce the number of messages deleted in a single call and try again. |
| 204 | `CONTACT_ADD_USER_NOT_FOUND` / `CONTACT_BLOCKLIST_USER_NOT_FOUND` | The target user does not exist. | Check whether `userId` is correct and confirm that the target user is registered. |
| 221 | `USER_NOT_ON_ROSTER` | The current user and target user are not friends, or the target user is outside the relationship scope allowed by the current operation. | Establish a friend relationship first, or check the relationship restrictions configured in the EasyIM Console or on the server. |
| 223 | `CONTACT_SET_REMARK_NOT_FRIEND` | An attempt was made to set friend remarks for a user who is not a friend. | Confirm that the user is a friend before setting friend remarks. |

### Connection errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 108 | `AUTH_TOKEN_EXPIRED` | The user token has expired. | Retrieve a new user token and call `renewToken`. If the connection has been disconnected, call `login` again. |
| 200 | `AUTH_ALREADY_LOGIN` | The current SDK instance is logged in, and the login API was called again. | Avoid repeated login calls. To switch accounts, call `logout` first and then log in as the new user. |
| 201 | `AUTH_NOT_LOGIN` | The current user is not logged in, or the login state is unavailable. | Log in and confirm that the connection state is normal before calling the API. |
| 202 | `AUTH_UNAUTHORIZED` / `CONNECTION_PROVISION_REJECTED` | Authentication failed. The token may be invalid or not match the user, the signature may be incorrect, the user may not exist, or the server may have rejected connection authentication. | Check the `appKey`, `userId`, token, and user state. If necessary, retrieve a new token and log in again. |
| 206 | `USER_LOGIN_ANOTHER_DEVICE` | The user logged in on another device, which kicked the current device offline. The device-kicking policy depends on the server-side multi-device configuration. | Notify the user that the current account has logged in on another device. To support simultaneous multi-device login, verify the multi-device policy configuration. For details, see [Multi-device Login](multi_device.html). |
| 207 | `USER_REMOVED` | The currently logged-in user was deleted or deregistered. | Notify the user that the account is unavailable, and verify the account state on the server or in the EasyIM Console. |
| 210 | `AUTH_FORBIDDEN` / `CONTACT_ADD_BLOCKED_BY_USER` | The current user does not have permission to perform the operation, or the other user has added the current user to the blocklist or prohibited friend requests. | Check the current account permissions, friend relationship, blocklist state, and activation state of the relevant service. |
| 213 | `AUTH_BIND_ANOTHER_DEVICE` | The current login state is bound to another device, or the device binding does not comply with the current login policy. | Check the multi-device login policy, device ID, and device binding. |
| 214 | `AUTH_LOGIN_TOO_MANY_DEVICES` | The number of devices on which the user is logged in exceeds the limit. | Reduce the number of online devices or contact the EasyIM business manager to increase the simultaneous-online-device limit. |
| 215 | `AUTH_USER_MUTED` | The user is muted and cannot perform the relevant sending operation. | Wait until the mute is lifted or contact an admin. |
| 216 | `USER_KICKED_BY_CHANGE_PASSWORD` | After the user changed the password, the current login state became invalid and the user was kicked offline. | Notify the user that the password changed, retrieve a new token, and log in again. |
| 217 | `USER_KICKED_BY_OTHER_DEVICE` | After the multi-device service is enabled, the user calls an API on another device or uses the EasyIM Console to forcibly log out the current device. | Notify the user that the current device was forcibly logged out. Log in again to continue. |
| 218 | `USER_ALREADY_LOGIN_ANOTHER` | The user is already logged in on another device, and the current login policy does not permit another login. | Ask the user to log out of the other device according to your business strategy, or adjust the multi-device configuration. |
| 219 | `USER_MUTED_BY_ADMIN` | The user is globally muted by an admin. | Notify the user of the mute and wait for it to be lifted or contact an admin. |
| 220 | `USER_DEVICE_CHANGED` | The current login device does not match the expected device, or the device identifier changed. | Check automatic login, the multi-device policy, and device-identifier configuration. If necessary, log in again. |
| 300 | `CONNECTION_WEBSOCKET_ERROR` / `CONNECTION_CLOSED_BEFORE_READY` / `CONNECTION_PROVISION_CLOSED` / `MESSAGE_NOT_CONNECTED` | The WebSocket connection failed, the connection closed before it was ready, or a message was sent while disconnected. | Wait until the connection succeeds and try again. Check the network, connection state, and service-address configuration. |
| 301 | `CONNECTION_TIMEOUT` / `CONNECTION_PROVISION_TIMEOUT` / `MESSAGE_ACK_TIMEOUT` / `MESSAGE_ACK_MISSING` / `REST_TIMEOUT` / `UPLOAD_TIMEOUT` | A request, connection authentication, message ACK, REST request, or upload timed out. | Check the network environment and try again. If the issue occurs frequently, check the service configuration and client timeout strategy. |
| 304 | `CONNECTION_DNSLIST_FAILED` | Failed to retrieve the server-address configuration. | Check the network, `appKey`, DNS configuration, and service availability. |
| 305 | `SERVER_SERVING_DISABLED` | The service is disabled or the current capability is unavailable. | Check whether the corresponding service is enabled. To use the capability, enable it in the EasyIM Console or contact the EasyIM business manager. |

## Message errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 400 | `ATTACHMENT_NOT_FOUND` | The attachment does not exist. Its address, file ID, or resource may have expired. | Check whether the attachment address, file ID, or resource still exists. |
| 401 | `ATTACHMENT_INVALID` | The attachment is invalid. Its metadata, file format, or download parameters may be invalid. | Check the attachment metadata, file format, and download parameters. |
| 402 | `COMBINE_UPLOAD_FAILED` / `UPLOAD_REQUEST_FAILED` | A combined-message upload or regular attachment upload request failed. | Check the file, network, upload permission, and upload-adapter configuration, and try again. |
| 403 | `FILE_DOWNLOAD_FAILED` | The file download failed, possibly because of a network error, authentication failure, or invalid download URL. | Check the network, login state, and download URL, and try again. |
| 405 | `FILE_TOO_LARGE` / `UPLOAD_SIZE_EXCEEDED` | The file exceeds the size limit. | Compress the file or use a smaller file and try again. |
| 406 | `FILE_CONTENT_IMPROPER` | The file content is noncompliant. | Use compliant file content and try again. |
| 407 | `ATTACHMENT_EXPIRED` / `VOICE_TO_TEXT_FILE_INVALID` | The attachment has expired, or the input file for voice-to-text conversion is invalid. | Upload the attachment again or use a valid voice file. |
| 408 | `VOICE_TO_TEXT_FILE_DURATION_TOO_LONG` | The voice duration exceeds the voice-to-text service limit. | Shorten the voice duration and try again. |
| 409 | `VOICE_TO_TEXT_FAILED` | Voice-to-text conversion failed, possibly because of a service error or because the voice-file quality does not meet recognition requirements. | Try again later or check the voice-file quality. |
| 410 | `VOICE_TO_TEXT_FILE_NOT_FOUND` | The file required for voice-to-text conversion does not exist. | Confirm that the voice file was uploaded successfully and is still accessible. |
| 411 | `VOICE_TO_TEXT_FILE_TOO_LARGE` | The voice-to-text file is too large. | Compress the voice file or use a smaller one. |
| 500 | `MESSAGE_ENCODE_FAILED` / `MESSAGE_DECODE_FAILED` / `STREAM_CHUNK_INVALID` / `STREAM_TIMEOUT_BY_SERVER` / `STREAM_STATE_CONFLICT` / `COMBINE_ENCODE_FAILED` / `COMBINE_PARSE_FAILED` | Message encoding or decoding failed, a streaming message chunk was invalid, the stream state conflicted, or combined-message construction or parsing failed. | Check whether the message-body structure, extension, attachment information, and combined-message content are valid. |
| 501 | `MESSAGE_INCLUDE_ILLEGAL_CONTENT` | The message contains illegal or sensitive content and was identified as noncompliant by content filtering. | Modify the message content and try again. |
| 502 | `MESSAGE_SEND_TRAFFIC_LIMIT` | Message-sending traffic or frequency is limited. | Reduce the sending frequency. If the limit is caused by a server policy, contact the EasyIM business manager or an admin to adjust it. |
| 504 | `MESSAGE_RECALL_TIME_LIMIT` | The message recall time limit was exceeded. | Notify the user that the recall period has expired. To adjust the recall period, [configure the message recall period in the EasyIM Console](/product/console/basic_message_conversation.html#message-recall). |
| 505 | `SERVICE_NOT_ENABLED` | The relevant service is not enabled. Examples include message recall, message roaming, message search, group message read receipts, Reaction, translation, and voice-to-text conversion. | Use `error.message` to identify the capability, enable the corresponding service in the [EasyIM Console](https://console.easyim.ai/user/login), and try again. |
| 506 | `MESSAGE_EXPIRED` | The message has expired. For example, the group message read receipt validity period has expired, or the server no longer records the relevant state for the message. | Confirm that the message is still valid. If it has expired, do not query or send receipts for it. |
| 507 | `MESSAGE_ILLEGAL_WHITELIST` | The current user is not on the allowlist for sending messages. This commonly occurs when all members of a chat group or chat room are muted and a user who is not on the allowlist continues sending messages. | Check the chat group or chat room allowlist and mute settings. If necessary, add the user to the allowlist or lift the mute. |
| 508 | `MESSAGE_EXTERNAL_LOGIC_BLOCKED` | The message was blocked by external moderation or business logic. For example, after anti-spam or third-party content moderation is enabled, the moderation result rejects the message. | Modify the content according to business rules or contact the server-side team to investigate the reason for moderation or blocking. |
| 509 | `MESSAGE_CURRENT_LIMITING` | The current user is sending messages too frequently and is rate-limited. | Reduce the sending frequency and try again. |
| 510 | `MESSAGE_SIZE_LIMIT` | The message body exceeds the size limit. | Shorten the text, reduce the extension fields, or split the message. For message-body size limits, see [Message Overview](/product/product_message_overview.html#message-types). |
| 511 | `MESSAGE_EDIT_FAILED` | Message editing failed. The message may not support editing, the user may lack permission, the edit-count limit may have been reached, or the server may have rejected the edit. | Check the message type, sender, edit count, and server response, and try again. |

## Conversation errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 811001 | `SESSION_LIST_SOCKET_FAILED` | The conversation-list synchronization channel failed, possibly because the synchronization WebSocket failed to connect or the connection failed during synchronization. | Check the connection state and network, and try again. |
| 811002 | `SESSION_LIST_PROTO_DECODE_FAILED` | Conversation-list synchronization protocol decoding failed. | Check the synchronized response data. If the issue persists, upgrade the SDK or contact the EasyIM technical support team. |
| 811003 | `SESSION_LIST_REQUEST_INVALID` | The conversation-list synchronization request is invalid, possibly because of invalid request parameters or cursor. | Check the request parameters and cursor. If necessary, start synchronization again. |
| 811004 | `SESSION_LIST_FETCH_FAILED` | Failed to retrieve the conversation list during synchronization. | Try again later and check the server-side conversation-list service state. |
| 811005 | `SESSION_LIST_SERVICE_DISABLED` | The conversation-list synchronization service is not enabled or is unavailable. | Check whether the server-side conversation-list capability is enabled. |
| 811006 | `SESSION_LIST_CANCELLED` | Conversation-list synchronization was canceled. | If synchronization is still required, start it again or log in again to trigger automatic synchronization. |

## Chat group errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 600 | `GROUP_INVALID_ID` | The chat group ID is invalid. | Check whether `groupId` is correct. |
| 601 | `GROUP_ALREADY_JOINED` | The current user is already in the chat group. | Do not join again or invite a user who is already in the chat group. |
| 602 | `GROUP_NOT_JOINED` | The current user has not joined the chat group, or the target user is not in the chat group. | Confirm that the current user or target user has joined the chat group before performing the operation. |
| 603 | `GROUP_PERMISSION_DENIED` | The current user does not have permission to perform the chat group operation. For example, a regular member performs an operation available only to the group owner or group admin, or the group owner attempts to leave the chat group directly. | Use the group owner or group admin account and try again. To leave the chat group, the group owner must transfer ownership first. |
| 604 | `GROUP_MEMBERS_FULL` | The number of chat group members has reached the limit. | Remove chat group members or increase the member limit according to your plan. |
| 605 | `GROUP_SHARED_FILE_INVALID_ID` | The chat group shared-file ID is invalid, or the file does not exist. | Check whether the chat group shared-file ID is correct and the file still exists. |
| 606 | `GROUP_NOT_EXIST` | The chat group does not exist, or the specified `groupId` is incorrect. | Check whether `groupId` is correct and confirm that the chat group still exists. |
| 607 | `GROUP_DISABLED` | The chat group is disabled. | Restore the chat group to an available state before performing the operation. |
| 608 | `GROUP_NAME_VIOLATION` | The chat group name does not comply with server rules or violates a content restriction. | Use a compliant chat group name and try again. |
| 609 | `GROUP_MEMBER_ATTRIBUTES_REACH_LIMIT` | The number of chat group member attributes has reached the limit. | Reduce the number of chat group member attribute entries and try again. |
| 610 | `GROUP_MEMBER_ATTRIBUTES_UPDATE_FAILED` | Failed to update chat group member attributes. The attribute content may be invalid, permission may be insufficient, or the current chat group state may not permit the operation. | Check the attribute content, current user permissions, and chat group state, and try again. |
| 611 | `GROUP_MEMBER_ATTRIBUTES_KEY_REACH_LIMIT` | A chat group member attribute key exceeds the length limit. | Shorten the attribute key. |
| 612 | `GROUP_MEMBER_ATTRIBUTES_VALUE_REACH_LIMIT` | A chat group member attribute value exceeds the length limit. | Shorten the attribute value. |
| 613 | `GROUP_USER_IN_BLOCKLIST` | The user is on the chat group blocklist and cannot perform the current chat group operation. | Contact the group owner or group admin to remove the user from the blocklist, and try again. |

## Chat room errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 700 | `CHATROOM_INVALID_ID` | The chat room ID is invalid. | Check whether `chatRoomId` is correct. |
| 702 | `CHATROOM_NOT_JOINED` | The current user has not joined the chat room, or the target user is not in the chat room. | Join the chat room first or confirm that the target user is in it. |
| 703 | `CHATROOM_PERMISSION_DENIED` | The current user does not have permission to perform the chat room operation. For example, a regular member performs an operation available only to the chat room owner or chat room admin. | Use a chat room owner or chat room admin account and try again, or check the permission configuration. |
| 704 | `CHATROOM_MEMBERS_FULL` | The number of chat room members has reached the limit. | Wait until another member leaves, or contact an admin or the EasyIM business manager to increase the limit. |
| 705 | `CHATROOM_NOT_EXIST` | The chat room does not exist, or the specified `chatRoomId` is incorrect. | Check whether `chatRoomId` is correct and confirm that the chat room still exists. |
| 706 | `CHATROOM_OWNER_NOT_ALLOW_LEAVE` | The chat room owner cannot leave the chat room directly. | Transfer chat room ownership first or perform an operation permitted by the current chat room rules. |
| 707 | `CHATROOM_USER_IN_BLOCKLIST` | The user is on the chat room blocklist and cannot join or perform the current chat room operation. | Contact a chat room admin to remove the user from the blocklist, and try again. |

## Friend errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 204 | `CONTACT_ADD_USER_NOT_FOUND` / `CONTACT_BLOCKLIST_USER_NOT_FOUND` | The target friend does not exist. | Check whether `userId` is correct and confirm that the target user is registered. |
| 210 | `CONTACT_ADD_BLOCKED_BY_USER` | Failed to add the friend. The other user may have added the current user to the blocklist, or the server may prohibit the friend request. | Check the relationship state, blocklist state, and server-side friend policy. |
| 223 | `CONTACT_SET_REMARK_NOT_FRIEND` | An attempt was made to set friend remarks for a user who is not a friend. | Add the user as a friend before setting friend remarks. |
| 1000 | `CONTACT_ADD_ALREADY_FRIEND` | The user is already a friend and was added again. | Do not add the user again. |
| 1001 | `CONTACT_REACH_LIMIT` | The current user's number of friends has reached the limit. | Delete friends who are no longer needed, or contact the EasyIM business manager to increase the limit. |
| 1002 | `CONTACT_REACH_LIMIT_PEER` | The other user's number of friends has reached the limit. | Ask the other user to remove unnecessary friends and try again. |

Friend-synchronization errors:

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 1700 | `CONTACT_SYNC_METADATA_FAILED` | Failed to retrieve friend-synchronization metadata. | Retry synchronization and check the network and server state. |
| 1701 | `CONTACT_SYNC_SOCKET_FAILED` | The friend-synchronization channel failed. | Check the connection state and try again. |
| 1702 | `CONTACT_SYNC_CURSOR_INVALID` | The friend-synchronization cursor is invalid. | Log in again or restart synchronization to rebuild the cursor. |
| 1703 | `CONTACT_SYNC_PROTO_DECODE_FAILED` | Friend-synchronization protocol decoding failed. | Check the returned data. If the issue persists, upgrade the SDK or contact the EasyIM technical support team. |
| 1704 | `CONTACT_SYNC_CANCELLED` | Friend synchronization was canceled. | If synchronization is still required, start it again or log in again to trigger automatic synchronization. |

## User profile errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 900 | `USERINFO_USERCOUNT_EXCEED` | The number of user profiles in a single query exceeds the limit. | Reduce the number of users in a single query and try again. |
| 901 | `USERINFO_DATALENGTH_EXCEED` | The total length of the user profile fields exceeds the limit. | Shorten the user profile field content and try again. |
| 1600 | `USER_INFO_SUBSCRIPTION_LIMIT_EXCEEDED` | The number of users whose profiles are subscribed to has reached the limit. | Reduce the number of subscription targets or contact the EasyIM business manager to increase the quota. |
| 1601 | `USER_INFO_SUBSCRIPTION_TARGET_LIMIT_EXCEEDED` | The number of subscribers to the target user has reached the limit. | Use another subscription target or contact the EasyIM business manager to increase the quota. |

## Presence errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 1100 | `PRESENCE_PARAM_LENGTH_EXCEED` | A Presence parameter length or pagination parameter exceeds the limit. | When publishing a custom presence state, limit the length of `customStatus`. When querying the subscription list, check whether `pageNum` and `pageSize` meet the requirements. For details, see [Publish a custom presence state](presence.html#publish-a-custom-presence-state). |
| 1101 | `PRESENCE_CANNOT_SUBSCRIBE_YOURSELF` | A user cannot subscribe to their own presence. | Remove the current user from the subscription list. |

## Translation errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 1110 | `TRANSLATE_PARAM_INVALID` | A translation parameter is invalid. For example, the target language is invalid, the text to translate is empty, or the message type does not support translation. | Check the target language code and input content, and call the translation API only for supported messages. |
| 1111 | `TRANSLATE_SERVICE_NOT_ENABLED` | The translation service is not enabled. | Enable the translation service in the EasyIM Console and try again. |
| 1112 | `TRANSLATE_USAGE_LIMIT` | Translation-service usage has reached the limit. | Wait for the quota to reset or contact the EasyIM business manager to increase it. |
| 1113 | `TRANSLATE_FAILED` | The translation service encountered an error, or translation failed. | Try again later. If the issue persists, contact the EasyIM technical support team. |

## Content moderation errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 1200 | `THIRD_MODERATION_FAILED` | Third-party content moderation explicitly rejected the noncompliant message content. | Modify the message content and try again, or contact the moderation service for investigation. |
| 1299 | `THIRD_DEFAULT_FAILED` | Third-party content moderation or an external capability returned an unspecified default failure. | Investigate further using the information returned by the server. |

## Reaction errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 1300 | `REACTION_REACH_LIMIT` | The number of Reactions has reached the limit. | Reduce the number of Reactions and try again. |
| 1301 | `REACTION_ALREADY_OPERATED` | The current user has already performed the same type of Reaction operation on the message. | Do not repeatedly add or remove the same Reaction. |
| 1302 | `REACTION_OPERATION_ILLEGAL` | The Reaction operation is invalid. For example, a user who has not added the Reaction attempts to remove it, or the current user does not have permission to add a Reaction to the message. | Check the relationship between the current user and the message and whether the Reaction operation complies with the rules. |

## Offline push errors

| Error code | Error message | Description and possible causes | Recommendation |
| :--- | :--- | :--- | :--- |
| 1500 | `PUSH_TOKEN_UPLOAD_FAILED` | Failed to upload the push token. | Check the login state, `deviceToken`, `notifierName`, and push configuration, and try again. |
| 1501 | `PUSH_SILENT_MODE_OPERATION_FAILED` | Failed to configure do-not-disturb settings. | Check the do-not-disturb parameters, conversation ID, conversation type, and service state. |
| 1502 | `PUSH_LANGUAGE_OPERATION_FAILED` | Failed to set the push language. | Check whether the language parameter is correct. |
