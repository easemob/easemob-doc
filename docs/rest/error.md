# Common Error Codes

<Toc />

This section describes the response codes returned after REST API calls. You can use the error field in the returned data to identify the specific error.

- Response code: 200 (Success).
- Response code: 4xx (Request error), indicating that the request may contain an error that affects server processing.
- Response code: 5xx (Server error), indicating that an internal error occurred while the server was processing the request.

An example response is shown below:

![REST API error response example](/images/server-side/response_icon.png)

We recommend implementing fault-tolerant handling for the results of REST APIs called from your app server, for example:

- If you catch a timeout exception returned by an API call, try calling the API again.
- For system-level errors or errors that persist after retries, record them in system logs and promptly alert operations personnel to take corrective action, such as manual redelivery.

## Error status code overview

| HTTP status code<div style="width: 220px;"></div> | Description                                          |
| :------------------------- | :----------------------------------------------------------- |
| 400                        | (Bad Request) The server does not understand the request syntax.                         |
| 401                        | (Unauthorized) The request requires authentication. The server may return this response for APIs that require a token. |
| 403                        | (Forbidden) The server refuses the request. For example, the following two common situations cause this error for chat group/chat room services:<br/>- The call does not follow the correct logic for chat group/chat room operations, such as adding a user who is already in the chat group or removing a member who does not exist in the chat room.<br/>- The number of messages sent per second exceeds the limits of the [Send Group Messages API](message_group.html) or [Send Chat Room Messages API](message_chatroom.html). The maximum is 20 group messages per second and 100 chat room messages per second. |
| 404                        | (Not Found) The server cannot find the requested API.                           |
| 405                        | (Method Not Allowed) Follow the EasyIM REST API instructions and use the correct request method, such as GET or POST. |
| 408                        | (Request Timeout) The server timed out while waiting for the request.                       |
| 409                        | This error is reported when automatic user creation is enabled during concurrent calls to the [Obtain a user token by user ID API](easemob_user_token.html#obtain-a-user-token-by-user-id). Specifically, the error is reported when `grant_type` is set to `inherit` and `autoCreateUser` is set to `true` when calling the API. If the user for whom the token is being obtained is already registered, concurrent calls to the API do not report this error.|
| 413                        | (Payload Too Large) The message attachment uploaded by calling [Upload a File](message_upload_file.html) exceeds the maximum limit.  |
| 415                        | The request body type is unsupported.                                         |
| 429                        | (Service Unavailable) The request exceeds the API call frequency limit and is rate-limited, or it exceeds the Community plan limit. Contact the EasyIM business manager if necessary. |
| 500                        | (Internal Server Error) The server encountered an error and cannot complete the request. For example:<br/> -  no_full_text_index: "Entity ‘user’ with property named ‘username’ is not full text indexed. You cannot use the ‘contains’ operand on this field" indicates that username does not support full-text indexing and the `contains` operation cannot be performed on this field.<br/> - unsupported_service_operation: "Service operation not supported" indicates that the request URL does not support the request method.<br/> -  web_application: "javax.ws.rs.WebApplicationException" indicates that the request URL is incorrect.  |
| 501                        | (Not Implemented) The server does not support the functionality required to complete the request. For example, this code may be returned when the server cannot recognize the request method. |
| 502                        | (Bad Gateway) The server, acting as a gateway or proxy, received an invalid response from an upstream server. |
| 503                        | (Service Unavailable) The service is unavailable.                        |
| 504                        | (Gateway Timeout) The server, acting as a gateway or proxy, did not receive a timely response from an upstream server. |

## Error codes by feature

Each EasyIM REST API provides an error code list. View the API error codes by feature module.

| Feature module | Description    | Error codes    | 
| :---------- | :---------- | :---------- |
| User account management        | Register/delete users, retrieve user details, modify user passwords, ban/unban users, globally mute users, retrieve user presence, retrieve offline message data, and retrieve online logged-in devices for a specified account. | For error codes, see the error code lists for the APIs under [User Account Management](account_register_open.html). | 
| User attributes            | Set/delete/retrieve user attributes and retrieve the total size of user attributes in an app. | For error codes, see the error code lists for the APIs under [User Attributes](user_attribute_set.html). |
| User relationships            | Add/remove friends, set friend remarks, retrieve the friend list, and import a friend list. | For error codes, see the error code lists for the APIs under [User Relationship Management](user_friend_add.html).|
| Messages                | Message-related features, including sending messages, uploading/downloading files, recalling messages, deleting roaming messages, and modifying/importing messages.  | See the error code lists for the following APIs:<br/> - [Send One-to-One Messages](message_single.html) <br/> - [Send Group Messages](message_group.html) <br/> - [Send Chat Room Messages](message_chatroom.html)<br/> - [Upload and Download Files](message_upload_file.html) <br/> - [Recall Messages](message_recall_single.html)<br/> - [Delete a Conversation for One User](conversation_delete.html)<br/> - [Delete Roaming Messages for One User](message_delete_roam_single_msgid.html)<br/> - [Edit Messages](message_modify.html) <br/> - [Import Messages](message_import_single.html)  |
| Chat groups                | Chat group management, chat group member management, and message thread management.        | For error codes, see the error code lists for the APIs under [Chat Group Management](group_create.html), [Chat Group File Management](group_announcement_obtain.html), [Chat Group Member Management](group_member_add_single.html), and [Message Thread Management](group_thread_create.html). |
| Chat rooms              | Chat room management, chat room attribute management, and chat room member management.  | For error codes, see the error code lists for the APIs under [Superadmin Management](chatroom_superadmin_add.html), [Chat Room Management](chatroom_create.html), [Chat Room Attribute Management](chatroom_announcement_get.html), and [Chat Room Member Management](chatroom_member_add_single.html). |
| Presence subscriptions    | Set, subscribe to, unsubscribe from, or query user presence, and query the number of online members in a chat group.  | For error codes, see the error code lists for the APIs under [Presence](presence_set.html).           |
| Reaction   | Create/append/delete Reactions, retrieve Reactions by message ID, and retrieve Reaction information by message ID and emoji ID. | For error codes, see the error code lists for the APIs under [Reaction](reaction_add.html).  |
| Offline push    | Bind/unbind push information, query push binding information, set the nickname displayed during offline push, display mode, DND, preferred notification language, and push templates.| For error codes, see the error code lists for the APIs under [Offline Push](push_information_bind_unbind.html).  |

## Token-related error codes

1. For errors returned when calling REST APIs related to obtaining tokens, see the error code lists for [Obtain an App Token](easemob_app_token.html) and [Obtain a User Token](easemob_user_token.html).   

2. Token-related error codes that may be returned when calling REST APIs are shown in the following table:

| HTTP status code  | Error type | Error message          | Possible cause | Recommendation |
| ---- | ---------- | ----------------- | ----------------- | ----------------- |
| 401  | unauthorized          | "registration is not open, please contact the app admin" | In authorized registration mode, this error is reported when no App Token or an incorrect App Token, such as an expired or malformed token, is passed when calling the RESTful APIs to [Register a User with Authorization](account_register_authorized_single.html) or [Register Users with Authorization in Bulk](account_register_authorized_batch.html). | Pass a valid token.|
| 401  | unauthorized          | "Unable to authenticate due to expired access token"     | The App Token used to send a RESTful API request is expired, or no App Token is passed. This error code applies to all RESTful APIs except [Register a User with Authorization](account_register_authorized_single.html). | Pass a valid token.|
| 401  | auth_bad_access_token | "Unable to authenticate due to corrupt access token"     | The App Token used to send a RESTful API request has an invalid format. This error code applies to all RESTful APIs except [Register a User with Authorization](account_register_authorized_single.html). | Pass a valid token.|
| 401  | auth_bad_access_token | "Unable to authenticate"                                 | The App Token used to send a RESTful API request is invalid. Its format is correct, but it was not generated by the server receiving the request, so the server cannot recognize it. This error code applies to all RESTful APIs except [Register a User with Authorization](account_register_authorized_single.html) and [Register Users with Authorization in Bulk](account_register_authorized_batch.html). | Pass a valid token.|

## Error code for a nonexistent user ID

When calling a REST API, if the user ID parameter passed in the HTTP path does not exist, the `Service resource not found` error is reported. Examples include the REST APIs to [Retrieve User Details](account_detail_obtain_single.html), [Add a Friend](user_friend_add.html), and [Remove a Friend](user_friend_remove.html).

| HTTP status code | Error type    | Error message      | Possible cause      | 
| :---------- | :---------- | :--------- | :----------- |
| 404         | service_resource_not_found  | Service resource not found  | The user does not exist.  | 

## Error codes for services that are not activated

When calling a REST API, if the relevant service is not activated, a 400 or 403 error code is reported, as shown in the following table:

| HTTP status code | Error type    | Error message      | Possible cause      | 
| :---------- | :---------- | :--------- | :----------- |
| 403     | group_error | thread not open. | The message thread feature is not activated. | Activate the message thread service in the EasyIM Console. |
| 403      | forbidden_op | message broadcast service is unopened  | The feature for sending chat room broadcast messages is not activated.| Contact the EasyIM business manager to activate it. |
| 400      | service open exception  | this appKey not open message roaming   | Message roaming is not enabled.  | Contact the EasyIM business manager to enable it.  |
| 400         | service open exception | the app not open presence   | The presence service is not activated.  | Contact the EasyIM business manager to activate the presence service. |
| 403      | message_rewrite_error   | The rewrite message feature is not open.   | The message editing feature is not activated.  | Contact the EasyIM business manager to activate message editing.  |
| 400      | Bad Request         | this appKey is not open reaction service!   | Reaction is not activated. | Activate the Reaction service in the EasyIM Console. |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow   | The user attribute feature is not activated. | Contact the business manager to activate the user attribute feature. |

    


