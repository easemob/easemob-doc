# Chat Room Overview

## Chat room basics

A chat room is a Twitch-like organization that supports many participants and can be used for live streaming and message broadcasting. Chat room members do not have fixed relationships. Once offline, they do not receive any chat room messages and, except for members on the chat room allowlist, automatically leave the chat room after being offline for more than 2 minutes. To adjust this period, contact the EasyIM business manager.

### Chat room member roles  

| Chat room member role | Description | Management permissions |
| :------ | :-------------- | :------------ |
| Regular member   | A regular member without management permissions. | A regular member can:<br/> - Send and receive messages in the chat room;<br/> - Retrieve chat room details;<br/> - Leave the chat room;<br/> - Retrieve the chat room announcement;<br/> - Retrieve the chat room member list;<br/> - Set and delete custom attributes (key-value);<br/> - Retrieve chat room custom attributes.|
| Chat room admin   | Appointed by the chat room owner to assist with management and granted certain management permissions. | In addition to the permissions of a regular member, an admin can:<br/> - Change the chat room name and description;<br/> - Update the chat room announcement;<br/> - Remove members from the chat room;<br/> - Manage the chat room allowlist;<br/> - Manage the chat room blocklist;<br/> - Manage the chat room mute list;<br/> - Enable and disable mute all in the chat room. |
| Chat room owner       | The chat room creator becomes the chat room owner by default and has the highest permissions in the chat room. | In addition to admin permissions, the chat room owner can:<br/> - Add and remove admins;<br/> - Destroy the chat room;<br/> - Transfer chat room ownership. |

:::tip
Only a chat room superadmin can create a chat room through a [REST API](/rest/chatroom_create.html).
:::

### Differences between chat groups and chat rooms

Chat groups and chat rooms are both instant messaging systems that support multi-user communication. The difference is that chat group members have strong, persistent relationships and generally remain in the chat group for a long time after joining. Chat room members do not have fixed relationships. A chat room is more like an open space that users can freely join, and leaving the space means leaving the chat room.

For details, see [Chat group overview](product_group_overview.html).

## Feature list

### Create and manage chat rooms

| Feature           | Description                                                         |
| :------------- | :----------------------------------------------------------- |
| Create a chat room     | Only users granted [superadmin](/rest/chatroom_superadmin_add.html) permissions can create chat rooms. We recommend [calling a REST API to create a chat room](/rest/chatroom_create.html) to set the chat room name, description, maximum number of members (including admins), admins, regular members, and extension information. |
| Join a chat room     | Any app user who is not on the blocklist can freely join a chat room.                                   |
| Leave a chat room     | All chat room members can freely leave a chat room. A member may also involuntarily leave because an admin removes the member, the chat room is destroyed, or the user's account goes offline.<br/> Unlike a chat group owner, who cannot leave a chat group, a chat room owner can leave a chat room and remains its owner after rejoining. On all clients except Web, you can configure whether a chat room owner is allowed to leave the chat room during initialization.<br/>A chat room member who remains offline for more than 2 minutes because of network or other issues automatically leaves the chat room. To adjust this period, contact the EasyIM business manager. However, members on the chat room allowlist, to which the chat room owner and admins are added by default, and users added when a chat room is [created by calling a RESTful API](/rest/chatroom_create.html) do not leave if they have never logged in.<br/> When a user leaves a chat room, the SDK deletes all local messages in the chat room by default. To retain these messages, configure this behavior during SDK initialization.  |
| Destroy a chat room     | Requires chat room owner permissions.                                       |
| Retrieve chat room details | All chat room members can retrieve chat room details, including the chat room ID, name, description, maximum number of members, owner, whether mute all is enabled, and chat room role type. The chat room announcement, admin list, member list, blocklist, and mute list must be retrieved by calling separate APIs.        |
| Update the chat room member count in real time | You can update the chat room member count in real time when members frequently join or leave within a short period.| 

### Chat room member management

| Feature               | Description                                                         |
| :----------------- | :----------------------------------------------------------- |
| Retrieve the chat room member list     | All chat room members can retrieve the current chat room member list.   |
| Transfer chat room ownership       | The chat room owner can transfer ownership to a specified chat room member. After ownership is transferred, the original chat room owner becomes a regular member.   |
| Chat room mute list         | Requires chat room owner or admin permissions. You can mute or unmute an individual chat room member. Chat room members can check whether they are on the chat room mute list.   |
| Mute all chat room members         | Requires chat room owner or admin permissions. When mute all is enabled, the chat room owner and admins are not muted by default. |
| Chat room allowlist           | Requires chat room owner or admin permissions. When mute all is enabled, members on the allowlist can send messages.        |
| Chat room blocklist           | Requires chat room owner or admin permissions. A member added to the blocklist is removed from the chat room and can rejoin only after the chat room owner removes the member from the blocklist.    |
| Manage chat room admins       | Only the chat room owner can grant or revoke admin permissions for members.          |

### Chat room attribute management

| Feature               | Description                                                         |
| :----------------- | :----------------------------------------------------------- |
| Change the chat room name | Requires chat room owner permissions.                   |
| Retrieve or update the chat room announcement     | Only the chat room owner can update or delete the announcement.<br/>Announcement updates are synchronized to all members through event listeners. |
| Manage chat room custom attributes (key-value)     | Set, retrieve, delete, force-set, and force-delete chat room custom attributes. |

### Monitor chat room events

You can implement chat room event listeners. When an operation occurs in a chat room, such as a new member joining or a member leaving or being added to the mute list or blocklist, the other users in the chat room receive the corresponding event. For details, see [Monitor chat room events](/sdk/v5/android/room_manage.html#monitor-chat-room-events).

## Chat room event callbacks

You can implement a post-delivery callback so that the EasyIM server synchronizes chat room events with your app server. When an operation occurs in a chat room, such as a new member joining or a member leaving or being added to the mute list or blocklist, the EasyIM server sends an HTTP/HTTPS POST request to the app server to synchronize the event. For details, see [Chat room webhook events](/rest/callback_group_room_create.html).

## Chat room limitations

For chat room limitations, including limits on the number of chat room members and on basic and custom attributes, see [Chat room limitations](/product/limitation.html#chat-rooms).
