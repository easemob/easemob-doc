# GDPR Security and Compliance

EasyIM provides a set of data deletion and export APIs to protect data security and user privacy and ensure compliance with the General Data Protection Regulation (GDPR).

## Data deletion

To protect user privacy, EasyIM provides data deletion REST APIs that developers can use to delete user-related data stored on EasyIM servers, such as user accounts and attributes, and to destroy chat groups and chat rooms.

### Authentication method

EasyIM RESTful APIs require Bearer HTTP authentication. Each HTTP request must include the following `Authorization` field in the request header:

`Authorization：Bearer YourAppToken`

To improve project security, EasyIM uses tokens, which are dynamic keys, to authenticate users who are about to log in to the instant messaging system. EasyIM RESTful APIs support only app token authentication. For details, see [Authenticate with an App Token](/document/server-side/easemob_app_token.html).

### REST API overview

#### Delete a user account

[Delete a specified user from an app](/document/server-side/account_delete_single.html). The deleted user data mainly includes the user's conversation list, user attributes, and friend relationships.

#### Delete user attributes

[Delete the user attributes of a specified user from an app](/document/server-side/user_attribute_delete.html).

#### Destroy a chat group

[Delete the chat group with a specified chat group ID from an app](/document/server-side/group_delete.html).

#### Destroy a chat room

[Delete the chat room with a specified ID from an app](/document/server-side/chatroom_delete.html).

## Data export

### Feature overview

To ensure users' right to manage their private data, EasyIM provides data export REST APIs that developers can use to export data stored on EasyIM servers, including user data, chat group data, chat room data, historical messages, and attachments.

### REST API overview

This document describes the data export APIs.

#### Export user data

| REST API                                                     | Description                                |
| :----------------------------------------------------------- | :---------------------------------- |
| [Retrieve information about a single user](/document/server-side/account_detail_obtain_single.html)<br>[Retrieve information about users in a batch](/document/server-side/account_detail_obtain_batch.html) | Retrieve information about users with specified user IDs in an app. |
| [Retrieve user attributes](/document/server-side/user_attribute_obtain_single.html) | Retrieve the attributes of a user with a specified user ID in an app. |

#### Export chat group data

| REST API                                                     | Description                                      |
| :----------------------------------------------------------- | :---------------------------------------- |
| [Chat group details](/document/server-side/group_obtain_detail.html) | Retrieve details of a chat group with a specified chat group ID in an app.       |
| [All chat groups in an app](/document/server-side/group_obtain_total.html) | Retrieve a list of all chat groups in an app.           |
| [Chat group admin list](/document/server-side/group_admin_list_get.html) | Retrieve the admin list of a chat group with a specified chat group ID in an app. |
| [Chat group member list](/document/server-side/group_member_list_obtain.html) | Retrieve the member list of a chat group with a specified chat group ID in an app.    |
| [Chat group announcement](/document/server-side/group_announcement_obtain.html) | Retrieve the announcement of a chat group with a specified chat group ID in an app.       |
| [Chat group shared files](/document/server-side/group_shared_file_obtain.html) | Retrieve the shared files of a chat group with a specified chat group ID in an app.   |
| [Chat group blocklist](/document/server-side/group_member_blocklist_obtain.html) | Retrieve the blocklist of a chat group with a specified chat group ID in an app. |
| [Chat group mute list](/document/server-side/group_member_mutelist_obtain.html) | Retrieve the mute list of a chat group with a specified chat group ID in an app.   |

#### Export chat room data

| REST API                                                     | Description                                          |
| :----------------------------------------------------------- | :-------------------------------------------- |
| [Retrieve chat room details](/document/server-side/chatroom_obtain_detail.html) | Retrieve details of a chat room with a specified chat room ID in an app.       |
| [All chat rooms in an app](/document/server-side/chatroom_obtain_total.html) | Retrieve a list of all chat rooms in an app.                 |
| [Chat rooms joined by a user](/document/server-side/chatroom_obtain_joined.html) | Retrieve a list of chat rooms joined by a user with a specified user ID in an app.     |
| [Chat room admin list](/document/server-side/chatroom_admin_list_get.html) | Retrieve the admin list of a chat room with a specified chat room ID in an app. |
| [Chat room member list](/document/server-side/chatroom_member_list_obtain.html) | Retrieve the member list of a chat room with a specified chat room ID in an app.   |
| [Chat room mute list](/document/server-side/chatroom_member_mutelist_obtain.html) | Retrieve the mute list of a chat room with a specified chat room ID in an app.   |

#### Retrieve historical messages

This API can retrieve only one hour of historical messages at a time.

| REST API                                                     | Description                                  |
| :----------------------------------------------------------- | :------------------------------------ |
| [Retrieve historical messages](/document/server-side/message_historical.html) | Retrieve a historical message file for a specified period from an app. |

#### Export attachments

Attachments include images, voice files, videos, and other files.

| REST API                                                     | Description                          |
| :----------------------------------------------------------- | :---------------------------- |
| [Download an attachment](/document/server-side/message_download_file.html) | Download the attachment with a specified UUID from an app. |
