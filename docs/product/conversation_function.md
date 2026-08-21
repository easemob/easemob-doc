# Feature Details

EasyIM supports one-to-one, group chat, chat room, and Super Community conversations. This document describes the main features of each conversation type, as well as user management, offline push, and content moderation features.

## One-to-one conversations

A one-to-one conversation is a chat between two users. By default, EasyIM allows two non-friends to chat and does not verify their friend relationship when they send messages. EasyIM creates a conversation, and users receive push notifications while offline if a third-party offline push service is integrated.

### Message features 

| Feature           | Description           |
| :------------- | :---------------------- |
| Send and receive messages | Send and receive all message types, including text, image, audio, video, file, location, command, custom, and combined messages.  |
| Send and receive streaming messages | The server side supports sending streaming messages, and the SDK supports receiving them.  |
| Local storage       | Store received messages locally.         |
| Historical messages       | The EasyIM server can store messages. The storage period depends on your product plan. For details, see [Product pricing](https://www.easemob.com/pricing/im). |
| Offline message push       | <br> - Send push notifications to message recipients while they are offline.<br> - Store offline messages for 7 days by default. |
| Search for messages  | Search for all message types in server-side and local conversations by keyword.     |
| Recall messages       | Recall a successfully sent message. By default, a message can be recalled within 2 minutes after it is sent. You can set the message recall period in the EasyIM Console, up to 7 days. |
| Message receipts  | Send delivery receipts and message read receipts.    |
| Edit messages  | Edit successfully sent messages.    |
| Reactions  | Add or delete Reactions on messages.   |
| Forward messages  | Forward a successfully sent or received message from the current conversation to another conversation.   |
| Delete messages  | Delete server-side and local historical messages only for the current user, or clear chat history.     |
| Pin messages  | Pin and unpin messages and retrieve pinned messages.    |
| Translate messages | Translate text messages on demand or automatically.    |
| Deliver only to online users  | Deliver messages only to online users.    |
| Import and insert messages  | Import and insert messages locally.    |
| Update messages  | Update existing messages in the local memory and database of the current device.  |

### Conversation features

| Feature       | Description |
| :-------------- | :----- |
| Conversation list  | Retrieve a conversation list from the server or local database. |
| Conversation Do Not Disturb | Configure whether a notification is generated when a new message is received in a specified one-to-one conversation. |
| Conversation unread count  | Retrieve and clear the unread message count of a one-to-one conversation. |
| Pin a conversation  | Pin a one-to-one conversation to the top of the conversation list. |
| Conversation mark  | Add a mark to a one-to-one conversation. |
| Delete a conversation  | Delete a one-to-one conversation. |

### User relationships

By default, EasyIM supports sending one-to-one messages between non-friends, meaning users can chat without adding each other as friends. To allow one-to-one messages only between friends, open the [EasyIM Console](https://console.easyim.ai/user/login) and [enable friend relationship check](/product/console/basic_user.html#friend-relationship-check). 

| Feature       | Description |
| :-------------- | :----- |
| Add a friend  | Send, receive, and process friend requests. |
| Remove a friend  | Remove a friend. |
| Set friend remarks  | Set remarks for a specified friend. |
| Retrieve the friend list  | The SDK obtains the latest friend data through automatic synchronization. After a user logs in successfully, the SDK automatically synchronizes the friend list and friend information from the server and writes them to the local database. |
| Blocklist     | To stop receiving messages from a specified user, add the user to the blocklist. Any user can be added, regardless of whether they are a friend. A blocked user remains in the friend list but cannot send you messages or friend requests. |

## Group chat conversations

A chat group is an instant messaging system that supports multi-user communication and relatively stable member relationships. All chat group members can receive and send messages in the chat group. Members can receive push notifications while offline. A chat group supports multiple member roles: owner, admin, and regular member. It also provides extensive management capabilities, such as member muting, announcements, and shared files.

### Message features

| Feature           | Description           |
| :------------- | :---------------------- |
| Send and receive messages | Send and receive all message types, including text, image, audio, video, file, location, command, custom, and combined messages.  |
| Send and receive streaming messages | The server side supports sending streaming messages, and the SDK supports receiving them.  |
| Local storage       | Store received messages locally.         |
| Historical messages       | The EasyIM server can store messages. The storage period depends on your product plan. For details, see [Product pricing](https://www.easemob.com/pricing/im). |
| Offline message push       | <br> - Send push notifications to message recipients while they are offline.<br> - Store offline messages for 7 days by default. |
| Search for messages  | Search for all message types in local conversations by keyword.     |
| Recall messages       | Recall a successfully sent message. By default, a message can be recalled within 2 minutes after it is sent. You can set the message recall period in the EasyIM Console, up to 7 days. |
| Message receipts  | Send delivery receipts and message read receipts.    |
| Edit messages  | Edit successfully sent messages.    |
| Reactions  | Add or delete Reactions on messages.   |
| Targeted messages  | Send a message to one or more specified chat group members. Other members do not receive it.|
| Forward messages  | Forward a successfully sent or received message from the current conversation to another conversation.   |
| Combined messages  | Combine multiple messages and forward them together.    |
| Import and insert messages  | Import and insert messages locally.    |
| Delete messages  | Delete server-side and local historical messages only for the current user, or clear chat history.     |
| Pin messages  | Pin and unpin messages and retrieve pinned messages.    |
| Translate messages | Translate text messages on demand or automatically.     |
| Deliver only to online users  | Deliver messages only to online users.    |
| Import and insert messages  | Import and insert messages locally.    |
| Update messages  | Update existing messages in the local memory and database of the current device.  |

:::tip
For messages, the difference between group chat and one-to-one conversations is that group chats support targeted messages.
:::

### Conversation features

| Feature       | Description |
| :-------------- | :----- |
| Conversation list  | Retrieve a conversation list from the server or local database. |
| Conversation Do Not Disturb | Configure whether a notification is generated when a new message is received in a specified group chat conversation. |
| Conversation unread count  | Retrieve and clear the unread message count of a group chat conversation. |
| Pin a conversation  | Pin a group chat conversation to the top of the conversation list. |
| Conversation mark  | Add a mark to a group chat conversation. |
| Delete a conversation  | Delete a group chat conversation. |

### Create and manage chat groups

| Feature               | Description  |
| :----------------- | :---------------------- |
| Create a chat group           | Any user can create a chat group, and its creator becomes the owner. |
| Destroy a chat group           | Only the chat group owner can destroy the chat group.|
| Ban or unban a chat group           | Ban or unban a chat group.|
| Block or unblock chat group messages   | All chat group members can block or unblock chat group messages. Blocking means that they do not receive chat group messages.|

### Query chat group information

| Feature               | Description  |
| :----------------- | :---------------------- |
| Retrieve chat group details     | Chat group members can retrieve chat group details, such as the chat group ID, name, and description, from memory.|
| Modify chat group details     | Modify details such as the chat group name, description, and extension information. |
| Retrieve the chat group member list     | Retrieve a paginated list of chat group members from the server. |
| Retrieve the list of chat groups in an app | Call a REST API to retrieve a paginated list of chat groups in an app. |
| Retrieve a chat group list       | Users can retrieve a list of chat groups they created or joined. |
| Query the number of chat groups the current user has joined  | Users can retrieve from the server the number of chat groups the current user has joined. |
| Retrieve a list of chat groups a specified user has joined | Retrieve all chat groups joined by a specified user based on the user ID. You can also configure the SDK to retrieve the latest joined chat group data after login. |
| Check whether a specified user has joined a chat group  | Call a REST API to check whether a specified user has joined a specified chat group. |

### Chat group attribute management

| Feature             | Description                                                         |
| :--------------- | :----------------------------------------------------------- |
| Modify chat group information | The chat group owner and admins can change the chat group name, avatar, description, and extension field. |
| Modify or retrieve the chat group announcement | The chat group owner and admins can set the announcement, and members can retrieve it.   |
| Manage shared files     | Chat group members can upload, download, and manage shared files. The chat group owner and admins can upload files and delete any shared file, while regular members can delete only the files they uploaded.|

### Chat group member management

| Feature                   | Description                                                         |
| :--------------------- | :----------------------------------------------------------- |
| Join a chat group              | <br/> - For public and private chat groups, the owner and admins can invite users to join.<br/> - Users can also apply to join a public chat group.|
| Leave a chat group              | A member can leave voluntarily or be removed by the chat group owner or an admin.<br/> The chat group owner cannot leave and can only destroy the chat group.        |
| Transfer chat group ownership               | The chat group owner can transfer ownership to a specified chat group member.|
| Add, remove, or retrieve chat group admins | The chat group owner can add members to or remove admins from the admin list.|
| Chat group allowlist             | The chat group owner and admins can add members to or remove members from the allowlist.<br/> Members on the allowlist can send chat group messages when mute all is enabled. |
| Chat group blocklist             | The chat group owner and admins can add members to or remove members from the blocklist.<br/>Members on the blocklist are removed from the chat group and cannot rejoin it. |
| Chat group mute list               | - The chat group owner and admins can add members to or remove members from the mute list. Muted members cannot send chat group messages but can receive them.<br/> - Mute all can be enabled or disabled.|
| Manage custom chat group member attributes | Set custom chat group member attributes and retrieve the custom attributes of an individual member, such as a chat group nickname and avatar.<br/> The chat group owner can modify the custom attributes of all members, while other members can modify only their own. |

### Message threads (Thread)

A chat group member can create a message thread from a chat group message. The message thread is a subset of the chat group, and the chat group message used to create it is called the parent message.

#### Message thread management

| Feature       | Description   |
| :--------- | :----- |
| Create a message thread       | Any chat group member can create a message thread from a chat group message.   |
| Destroy a message thread       | Only the owner and admins of the chat group containing the message thread can destroy the message thread.  |
| Join a message thread     | All members of the chat group containing the message thread can join the message thread. You can call a REST API to add members to a message thread in a batch.  |
| Leave a message thread     | A message thread member can leave voluntarily or be removed by the chat group owner or admins. |
| Change a message thread name      | Only the chat group owner and admins and the message thread creator can change the message thread name.  |
| Retrieve message thread details     | All members of the chat group containing a message thread can retrieve its details from the server.  |
| Retrieve the message thread member list      | All members of the chat group containing a message thread can retrieve its paginated member list from the server.   |
| Retrieve a list of message threads     | Retrieve from the server a paginated list of message threads that the current user joined or created in an app or a specified chat group. |
| Retrieve the latest messages from message threads in a batch      | A user can retrieve the latest message from multiple message threads in a batch from the server.  |
| Retrieve message threads | Retrieve all message threads in an app, all message threads a specified user has joined, and all message threads the user has joined in a specified chat group.|

#### Message management in a message thread

| Feature       | Description   |
| :--------- | :----- |
| Send a message in a message thread  | Sending a message in a message thread is essentially the same as sending a chat group message. The only difference is that a message sent in a message thread must include a flag indicating that it belongs to the message thread.|
| Receive a message in a message thread      | Receiving messages in a message thread is the same as receiving messages in one-to-one chats, group chats, and chat rooms.   |
| Recall a message in a message thread      | The logic for recalling a message in a message thread is the same as that for recalling a message in a one-to-one chat, group chat, or chat room.|
| Retrieve messages in a message thread      | Retrieve messages in a specified message thread from the server or the local database.  |

## Chat room conversations

A chat room is a Twitch-like organization that supports many participants and can be used for live streaming and message broadcasting. Chat room members do not have fixed relationships and do not receive any chat room messages after going offline.
By default, a chat room supports up to 10,000 members, including the owner. To adjust this limit, contact the EasyIM business manager.

### Message features 

| Feature           | Description           |
| :------------- | :---------------------- |
| Send and receive messages | Send and receive all message types, including text, image, audio, video, file, location, command, custom, and combined messages.  |
| Send and receive streaming messages | The server side supports sending streaming messages, and the SDK supports receiving them.  |
| Historical messages       | The EasyIM server can store messages. The storage period depends on your product plan. For details, see [Product pricing](https://www.easemob.com/pricing/im). To retrieve historical chat room messages from the server, upgrade the SDK to the specified version and contact the EasyIM business manager to activate the feature. |
| Recall messages       | Recall a successfully sent message. By default, a message can be recalled within 2 minutes after it is sent. You can set the message recall period in the EasyIM Console, up to 7 days. |
| Edit messages  | Edit successfully sent messages.    |
| Targeted messages  | Send a message to one or more specified chat room members. Other members do not receive it.|
| Combined messages  | Combine multiple messages and forward them together.    |
| Delete messages  | Delete server-side historical messages only for the current user, or clear chat history.     |
| Pin messages  | Pin and unpin messages and retrieve pinned messages. To retrieve historical chat room messages from the server, upgrade the SDK to the specified version and contact the EasyIM business manager to activate the feature.    |
| Translate messages | Translate text messages on demand or automatically.    |
| Import and insert messages  | Import and insert messages locally.    |
| Update messages  | Update existing messages in the local memory and database of the current device.  |

:::tip
Unlike one-to-one and group chats, chat rooms do not support offline message push or local message operations.
:::

### Create and manage chat rooms

| Feature           | Description                                                         |
| :------------- | :----------------------------------------------------------- |
| Create a chat room     | Only users granted [superadmin](/document/server-side/chatroom_superadmin_add.html) permissions can create chat rooms. We recommend [calling a REST API to create a chat room](/document/server-side/chatroom_create.html). |
| Join a chat room     | Any app user who is not on the blocklist can freely join a chat room.                                   |
| Leave a chat room     | Leave voluntarily or be removed from the chat room.  |
| Destroy a chat room     | The chat room owner can destroy the chat room.                                       |
| Retrieve chat room details | All chat room members can retrieve details such as the chat room ID, name, and description.        |
| Update the chat room member count in real time | Update the member count in real time when members frequently join or leave within a short period.|

### Chat room member management

| Feature               | Description                                                         |
| :----------------- | :----------------------------------------------------------- |
| Retrieve the chat room member list     | All chat room members can retrieve the current chat room member list.   |
| Transfer chat room ownership       | The chat room owner can transfer ownership to a specified chat room member.|
| Chat room mute list         | The chat room owner or admins can mute or unmute an individual chat room member.  |
| Mute all chat room members         | The chat room owner or admins can mute all members. By default, the chat room owner and admins are not muted. |
| Mute chat room members by tag (server side)| Set tags for users in a chat room and mute users by tag. |
| Chat room allowlist           | The chat room owner or admins can add members to or remove members from the allowlist. When mute all is enabled, members on the allowlist can send messages.        |
| Chat room blocklist           | The chat room owner or admins can add members to or remove members from the blocklist.<br/>A member on the blocklist can rejoin the chat room only after the chat room owner removes the member from the blocklist.    |
| Manage chat room admins       | Only the chat room owner can add or remove admins.          |

### Chat room attribute management

| Feature      | Description                   |
| :----------------- | :------------ |
| Change the chat room name | Only the chat room owner can change the chat room name.                   |
| Retrieve or update the chat room announcement     | Only the chat room owner can update or delete the announcement.<br/>All members can retrieve the announcement. |
| Manage chat room custom attributes (key-value)     | Set, retrieve, delete, force-set, and force-delete chat room custom attributes. |

### Message thread management

|Feature|Description|
| :- | :- |
|Create a message thread|Channel members can create message threads in a channel.|
|Join a message thread|Channel members can join message threads in a channel.|
|Leave a message thread|Message thread members can voluntarily leave or be removed from a message thread they joined.|
|Delete a message thread|The community owner can delete a message thread in the channel.|
|Retrieve message thread details|Channel members can retrieve message thread details.|
|Retrieve a list of message threads created in a channel|Channel members can retrieve a list of message threads created in a specified channel.|
|Retrieve a list of message threads joined in a channel|Channel members can retrieve message threads they joined in a channel.|
|Retrieve a channel's message thread list|Channel members can retrieve a list of all message threads in a channel.|
|Change a message thread name|The community owner, community admins, and message thread creator can change the message thread name.|

## Users

### User account management

You can perform the following user account operations by calling RESTful APIs:

| Feature               | Description  |
| :----------------- | :---------------------- |
| Register users | Register up to 60 user IDs in a single request. |
| Retrieve user details  | Retrieve information such as the username, creation time, and push settings.  |
| Delete user accounts | Delete a specified number of user accounts from an app. |
| Change a user password | Change a user's login password without providing the original password. |
| Ban or unban users  | Ban users, immediately force them offline, and prevent them from logging in to EasyIM until they are unbanned. |
| Force a user offline | Change a user's status to offline. The user must log in again to resume normal use. |
| Retrieve user presence | Check whether a user is online or offline. |
| Retrieve the list of online devices for an account | Retrieve the list of devices on which a specified account is currently logged in. |

### User attributes

| Feature               | Description  |
| :----------------- | :---------------------- |
| Set user attributes | Set the user nickname, avatar, email address, phone number, and other attributes. |
| Retrieve user attributes | Retrieve all user attributes for one or more specified users.  |
| Retrieve the total size of user attributes in an app (server side only) | Retrieve the size, in bytes, of the attribute data for all users in the app.  |
| Subscribe to attribute changes of non-friends | After subscription, the app promptly receives a notification when an attribute of a specified non-friend changes.  |
| Delete user attributes | Delete all attributes of a single user. |

### Presence subscriptions

| Feature               | Description  |
| :----------------- | :---------------------- |
| Subscribe to a specified user's presence | Each user ID can subscribe to up to 3000 users. |
| Publish a custom presence state | Publish a custom presence state.  |
| Unsubscribe from a specified user's presence | Stop subscribing to a specified user's presence.  |
| Query subscribed users | Query the list of users you subscribe to by page. |
| Retrieve a user's current presence | Retrieve a user's current presence, including that of an unsubscribed user. |

### Global user mute

You can implement global user mute by calling RESTful APIs:

| Feature               | Description  |
| :----------------- | :---------------------- |
| Set global user mute | Mute a single user ID in all one-to-one chats, chat groups, or chat rooms so that the user cannot send messages. |
| Query global mute for a user ID | Query the global mute details of a user in one-to-one chats, group chats, and chat rooms. |
| Query all globally muted users in an app | Query all globally muted users in an app and their remaining mute duration. |

## Offline push

The EasyIM SDKs support offline push. Supported mobile vendor push services include APNs and Google FCM.

| Feature               | Description  |
| :----------------- | :---------------------- |
| Bind and unbind push information | Bind or unbind a device and push information, including the device ID, push certificate, and device token. |
| Set the push title and content | Set the push title and content in the following ways:<br/> - Call a method;<br/> - Use a push template<br/> - Use message extension fields |
| Set the push nickname | Set the message sender nickname displayed in the notification bar for offline push. |
| Set the push notification mode | The following three modes are available:<br/> - Receive push notifications for all offline messages.<br/> - Receive push notifications only for messages that mention specified users.<br/> - Do not receive push notifications for offline messages. |
| Set Do Not Disturb mode | Set a Do Not Disturb period and duration. |
| Set the preferred language for push notifications | If translation is enabled, the SDK sends both the original and translated messages. If the language of the translated message matches your setting, the translated message is displayed in the push notification. Otherwise, the original message is displayed. |
| Set push extensions | Use extension fields to customize push settings, such as forced push and silent messages. |
| Query offline push result statistics | Query offline push results in the [EasyIM Console](https://console.easyim.ai/user/login). |

## Content moderation

Use the EasyIM [content moderation service](/value-added/moderation/moderation_overview.html) to detect message content in various scenarios, helping you manage app message content and mitigate the risk of prohibited content.

| Feature | Description |
| :------------- | :---------------------- |
| Moderate multiple message types | Intelligently identify text, images, audio, and video files.  |
| Custom message handling rules | Customize policies for message delivery or interception.  |
| Callback for message moderation results | Send message moderation results to the customer's server through a callback. |
| Unified content moderation backend | Provide a visual content moderation backend for querying moderation records and viewing moderation statistics.  |







