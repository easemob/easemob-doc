# Chat Group Overview

## Chat group basics

A chat group is an instant messaging system that supports multi-user communication and relatively stable member relationships. All chat group members can receive and send messages in the chat group. Members can receive push notifications while offline. A chat group supports multiple member roles: owner, admin, and regular member. It also provides extensive management capabilities, such as member muting, announcements, and shared files.

### Chat group types

Chat groups are classified as public or private based on whether they are visible to users.

| Chat group type | How to join   |  Retrieve chat group information       |
| :------- | :---------- | :---------- | 
| Public chat group   | A user can apply to join or be invited by a chat group owner or admin. Any user can apply to join. Whether approval from the owner or an admin is required depends on the chat group settings. | - Users can retrieve chat group details and the public chat group list without joining the chat group.<br/> - Users can retrieve chat group announcements and the shared file list only after joining the chat group. |
| Private chat group   | A user must be invited to join. Whether regular members can invite other users in addition to the chat group owner and admins depends on the chat group settings. | Users can retrieve information such as chat group details, the announcement, the shared file list, and the member list only after joining the chat group.   |

### Chat group member roles  

| Chat group member role | Description | Management permissions |
| :------ | :-------------- | :------------ |
| Regular member   | A regular member without management permissions. | A regular member can:<br/> - Send and receive messages in the chat group;<br/> - Retrieve the chat group announcement;<br/> - Upload, download, and delete shared files and retrieve shared files from the server;<br/> - Retrieve the chat group list, admin list, member list, and chat group details;<br/> - Query the number of chat groups they have joined;<br/> - Leave a chat group and block or unblock chat group messages;<br/> - Set their own custom attributes (key-value);<br/> - Create and manage message threads and send messages in message threads they belong to.<br/> - Retrieve the latest message from multiple message threads in a batch.|
| Chat group admin   | Appointed by the chat group owner to assist with management and granted certain management permissions. | In addition to the permissions of a regular member, an admin can:<br/> - Change the chat group name and description, update the announcement, and update the chat group extension field;<br/> - Approve or decline requests to join the chat group;<br/> - Invite users to join the chat group and remove members from it;<br/> - Manage the chat group allowlist, blocklist, and mute list;<br/> - Enable and disable mute all in the chat group;<br/> - Change message thread names, remove members from message threads, and destroy message threads in the chat group. |
| Chat group owner       | The chat group creator becomes the owner by default and has the highest permissions in the chat group. | In addition to admin permissions, the chat group owner can:<br/> - Add and remove admins and destroy the chat group;<br/> - Transfer ownership to another chat group member. |

### Differences between chat groups and chat rooms

Chat groups and chat rooms are both instant messaging systems that support multi-user communication. The difference is that chat group members have strong, persistent relationships and generally remain in the chat group for a long time after joining. Chat room members do not have fixed relationships. A chat room is more like an open space that users can freely join, and leaving the space means leaving the chat room. The following table compares their features:

| Feature | Chat group | Chat room |
| :----------- | :------------------- | :--------------------- |
| Use case     | Similar to group chats in Signal or Skype, where all members have persistent relationships.  | Similar to a Twitch live room, where members do not have persistent relationships and leaving the room means leaving the chat room.     |
| Creation method | Any app user can create a chat group.   | Only a [superadmin](/document/server-side/chatroom_superadmin_add.html) can create a chat room.  |
| Type | Public or private. When creating a chat group, you can configure whether approval from the chat group owner or admins is required to join, supporting different use cases. | Chat rooms are not classified as public or private. All users can freely join or leave them.      |
| Maximum number of members   | The supported member count depends on the selected plan. The highest-tier plan supports 8,000 members by default. To increase this limit, contact the Easemob business team.| The supported member count depends on the selected plan. The highest-tier plan supports 10,000 members by default. To increase this limit, contact the Easemob business team. |
| Member relationships | Member relationships are relatively stable, and users remain members after joining. | Member relationships are more temporary. Users participate in real-time interactions after joining and leave the chat room when they leave or remain offline past the timeout. |
| Management capabilities | Manage chat group members, admins, mute settings, blocklists, and more. | Manage chat room members, admins, mute settings, mute all, blocklists, allowlists, announcements, custom attributes, and more. |
| Presence | Chat group members can be offline and retain their membership while offline. | Chat rooms focus on online members. A member who remains offline for a specified period automatically leaves the chat room. Members on the allowlist are not affected by this automatic removal mechanism. |
| Message reliability | Suitable for persistent conversations and offline message delivery. Users receive all messages sent in the chat group. | Suitable for high-concurrency real-time messaging. You can set the priority of chat room messages, and high-priority messages are delivered first. When the message volume is high, chat room messages that exceed the threshold are discarded. Messages start being discarded at a threshold of 100 messages per second, which can be adjusted as needed.|
| Offline message storage | Offline message storage is supported. When users are offline, the server first stores messages sent to them and delivers the messages when the users get online. For a single end user, the server can store up to 200 offline messages for each chat group.<Container type="tip" title="Tip">If a chat group has more than 3000 members, offline push is not supported by default. To use this feature, contact the Easemob business team to activate it.</Container>  | Offline message storage is not supported. Users do not receive push notifications or messages while offline. A member, except one on the chat room allowlist, who remains offline for more than 2 minutes automatically leaves the chat room.        |
| Roaming message/historical message storage | Roaming and historical message storage is supported. The period for which the server stores roaming and historical messages depends on your subscribed EasyIM plan. For details, see [EasyIM plan features](/product/product_package_feature.html).<br/> - You can [call a REST API to retrieve a JSON file containing historical messages from the server](/document/server-side/message_historical.html).<br/> - You can also [call a client API to retrieve roaming messages in a specified conversation from the server](/document/android/message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server) and synchronize them across multiple devices. | Roaming and historical message storage is supported. The period for which the server stores roaming and historical messages depends on your subscribed EasyIM plan. For details, see [EasyIM plan features](/product/product_package_feature.html).<br/> - You can [call a REST API to retrieve a JSON file containing historical messages from the server](/document/server-side/message_historical.html).<br/> - You can also [call a client API to retrieve roaming messages in a specified conversation from the server](/document/android/message_retrieve.html#retrieve-messages-in-a-specified-conversation-from-the-server) and synchronize them across multiple devices.<br/> - To have the server send recent roaming messages when a user joins a chat room, contact the Easemob business team to activate this feature. Each conversation supports 10 messages by default, which can be increased to a maximum of 200.| 

## Chat group features

Chat group features mainly cover chat group creation and management, member management, and attribute management.

### Create and manage chat groups

| Feature               | Description  |
| :----------------- | :---------------------- |
| Create a chat group           | Any user can create a chat group, and its creator becomes the owner. When creating a chat group, you can specify its name, avatar, description, whether it is public, a list of users to add, whether approval is required, whether regular members can invite new users, extension information, and more. The limits on the number of chat groups and chat group members vary by plan. For details, see [EasyIM pricing](https://www.easemob.com/pricing/im). |
| Destroy a chat group           | Only the chat group owner can destroy the chat group. After a chat group is destroyed, all local chat group data is deleted and all members are forced to leave. |
| Ban or unban a chat group           | - Call a REST API to ban a specified chat group. For example, you can ban a chat group if its members frequently send prohibited messages. After a chat group is banned, no member can send or receive messages in the chat group or its message threads, or perform chat group or message thread management operations.<br/> - Call a REST API to unban a specified chat group. After the chat group is unbanned, members can send and receive messages in the chat group and its message threads and perform chat group and message thread management operations.|
| Block or unblock chat group messages   | All chat group members can block and unblock chat group messages. After users block chat group messages, they no longer receive messages from the specified chat group. |

### Query chat group information

| Feature               | Description  |
| :----------------- | :---------------------- |
| Retrieve chat group details     | - Chat group members can retrieve chat group details from memory. The result includes the chat group ID, name, description, basic attributes, owner, and admin list, but does not include members by default.<br/> - Chat group members can retrieve chat group details from the server. The result includes the chat group ID, name, description, basic attributes, owner, admin list, whether chat group messages are blocked, whether the chat group is disabled, and other information. You can also use a parameter to specify whether to retrieve the member list, which contains up to 200 members by default.<br/> - Users can retrieve details of a public chat group without joining it, but can retrieve details of a private chat group only after joining it. |
| Modify chat group details     | Modify details such as the chat group name, description, and extension information. |
| Retrieve the chat group member list     | All chat group users can retrieve a paginated list of chat group members from the server. Members are displayed in descending order by the timestamp when they joined the chat group. |
| Retrieve the list of chat groups in an app | Call a REST API to retrieve a paginated list of chat groups in an app. |
| Retrieve a chat group list       | Users can retrieve a list of chat groups they created or joined. |
| Query the number of chat groups the current user has joined  | Users can retrieve from the server the number of chat groups the current user has joined. |
| Retrieve all chat groups a specified user has joined  | Call a REST API to retrieve a paginated list of all chat groups a specified user has joined, based on the user ID. |
| Check whether a specified user has joined a chat group  | Call a REST API to check whether a specified user has joined a specified chat group. |

:::tip
EasyIM allows a user to log in on multiple devices. When the user performs a chat group operation on one device, the other devices receive a notification of the operation.
:::

### Chat group attribute management

| Feature             | Description                                                         |
| :--------------- | :----------------------------------------------------------- |
| Modify chat group information | The chat group owner and admins can change the chat group name, description, and extension field. |
| Modify or retrieve the chat group announcement | The chat group owner and admins can set and update the announcement, and members can retrieve it.   |
| Manage shared files     | The chat group owner and admins can upload files and delete any chat group shared file. Regular members can delete only the files they uploaded. All chat group members can download shared files and retrieve the shared file list from the server.|

### Chat group extension field

When creating a chat group, a user can set the chat group extension field, which supports JSON data and can be used to define additional chat group information. The length limit of the chat group extension field is 8 KB.

However, only the chat group owner and admins can update the chat group extension field:

- On the Web client, [call the API for modifying chat group information](/document/web/group_attributes.html#modify-chat-group-information) to update the chat group extension field.
- On clients other than Web, such as Android and iOS, [call the separate API for updating the chat group extension field](/document/android/group_attributes.html#update-the-chat-group-extension-field) to modify the field.

### Chat group member management

| Feature                   | Description                                                         |
| :--------------------- | :----------------------------------------------------------- |
| Join a chat group              | In both public and private chat groups, the owner and admins can invite users to join.<br/>A user can be required to confirm before joining. Users can also apply to join a public chat group.|
| Leave a chat group              | The chat group owner cannot leave the chat group and can only destroy it. A member can leave voluntarily or be removed by the chat group owner or an admin.         |
| Transfer chat group ownership               | The chat group owner can transfer ownership to a specified chat group member. After ownership is transferred, the original owner becomes a regular member. |
| Add, remove, or retrieve chat group admins | The chat group owner can add members to or remove admins from the admin list. All chat group members can retrieve the admin list. |
| Chat group allowlist             | The chat group owner and admins can add members to or remove members from the allowlist. Members on the allowlist can send chat group messages when mute all is enabled. Only the chat group owner and admins can retrieve the chat group allowlist. |
| Chat group blocklist             | The chat group owner and admins can add members to or remove members from the blocklist. Members on the blocklist are removed from the chat group and cannot rejoin it. Only the chat group owner and admins can retrieve the chat group blocklist. |
| Chat group mute list               | - The chat group owner and admins can add members to or remove members from the mute list. Muted members cannot send chat group messages but can receive them.<br/> - Only the chat group owner and admins can retrieve the chat group mute list.<br/> - Chat group members can check whether they are on the mute list.<br/> - The chat group owner and admins can enable or disable all-member mute. After all-member mute is enabled, only the chat group owner, admins, and members on the allowlist can send chat group messages.|
| Manage custom chat group member attributes | Set custom chat group member attributes and retrieve the custom attributes of an individual member. The chat group owner can modify the custom attributes of all members, while other members can modify only their own. |

### Chat group member extension fields

Setting chat group member extension fields means setting custom member attributes, such as a nickname and avatar in the chat group. A custom attribute uses the key-value format, where the key is the attribute name and the value is the attribute value. Setting the value to an empty string deletes the custom attribute.

- The total length of a chat group member's custom attributes cannot exceed 4 KB. For an individual custom attribute, the key cannot exceed 16 bytes and the value cannot exceed 512 bytes; otherwise, an error is reported.
- The chat group owner can modify the custom attributes of all members, while other members can modify only their own.

## Monitor chat group events

You can implement chat group event listeners. When an operation occurs in a chat group, such as a new member joining or a member leaving or being added to the mute list or blocklist, the other users in the chat group receive the corresponding event. For details, see [Monitor chat group events](/document/android/group_manage.html#monitor-chat-group-events).

## Chat group event callbacks

You can implement a post-delivery callback so that the EasyIM server synchronizes chat group events with your app server. When an operation occurs in a chat group, such as a new member joining or a member leaving or being added to the mute list or blocklist, the EasyIM server sends an HTTP/HTTPS POST request to the app server to synchronize the event. For details, see [Chat group webhook events](/document/server-side/callback_group_room_create.html).

## Chat group limitations

- For chat group limitations, including limits on the number of chat group members, chat group and member attributes, and shared files, see [Chat group limitations](/product/limitation.html#chat-groups).
- The number of chat group members varies by plan. For details, see [EasyIM plan features](/product/product_package_feature.html).
