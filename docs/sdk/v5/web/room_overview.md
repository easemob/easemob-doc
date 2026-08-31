# Chat Room Overview

## Introduction

A chat room is a form of conversation that supports real-time interaction among a massive number of users. It is suitable for high-concurrency, real-time use cases such as live streaming rooms, voice chat rooms, online classrooms, and large interactive events. Users in a chat room have no fixed relationships and come and go frequently. They can participate in interactions immediately after joining. After leaving or being offline for 2 minutes (except for members on the allowlist), they are automatically removed from the online member list.

## Chat room roles

A chat room mainly includes the following roles:

| Role | Description |
| :--- | :--- |
| Chat room owner | The role with the highest permissions in a chat room. The owner can manage chat room information, members, admins, the mute list, blocklist, allowlist, announcement, custom attributes, and more. |
| Chat room admin | Assists the chat room owner in managing the chat room and can manage members, the mute list, blocklist, allowlist, announcement, and more, depending on their permissions. |
| Regular member | Can send and receive messages in the chat room after joining. A muted regular member cannot send messages, and a regular member on the blocklist cannot join the chat room. |



## Differences between chat groups and chat rooms

Although both chat groups and chat rooms support real-time communication among multiple users, they are designed for distinctly different business scenarios and member relationships. Chat groups are better suited to scenarios with relatively stable member relationships that require the long-term retention of conversation content and member relationships. Chat rooms are better suited to scenarios with a large and frequently changing membership where real-time interaction is central.

## Feature comparison between chat groups and chat rooms

See [Chat Group Overview](group_overview.html).

## Feature list

### Chat room operations

The Web SDK supports operations on existing chat rooms, including retrieving, joining, leaving, updating information, and sending and receiving messages. Chat rooms are generally created and destroyed through the server-side REST API or EasyIM Console. The Web SDK primarily provides chat room operations performed by the client at runtime.

| Feature | Description |
| :--- | :--- |
| Join a chat room | A user joins the specified chat room. After joining successfully, the user can send and receive messages in the chat room. |
| Leave a chat room | The current user voluntarily leaves the specified chat room or is removed by the chat room owner or an admin. A member also automatically leaves after being offline for more than 2 minutes. After leaving, the user no longer participates as an online chat room member. |
| Retrieve the chat room list | Retrieves the list of chat rooms in the current app, which can be used to display entry points for chat rooms that users can join. |
| Retrieve chat room details | Retrieves chat room details by chat room ID, including the chat room name, description, and member count. |
| Update chat room information | Updates basic information such as the chat room name, description, and maximum number of members. This operation requires the corresponding chat room management permissions. |
| Send chat room messages | Sends messages through `client.chatManager` with `conversationType` set to `chatRoom`. |
| Set chat room message priority | Sets the message priority when sending a chat room message. When chat room message traffic is high, low-priority messages may be discarded, while high-priority messages are delivered first. |
| Manage the chat room announcement | Retrieves the chat room announcement or allows an authorized user to update it. |
| Manage chat room custom attributes | Retrieves, sets, or deletes chat room custom attributes used to store temporary business states related to the chat room, such as the live streaming status, room topic, or mic position status. |
| Monitor chat room events | Monitors events such as chat room destruction, members joining or leaving, member removal, chat room information changes, owner changes, admin changes, mute state changes, allowlist changes, announcement changes, and custom attribute changes, and refreshes the business UI accordingly. |

:::tip
In addition to directly calling the relevant methods of `client.chatRoomManager`, you can first obtain a chat room entity object and then use it to retrieve chat room details, update information, manage members and announcements, and perform other operations.
:::

### Chat room member management

The Web SDK supports retrieving and managing chat room members. Different operations require the current user to have the corresponding permissions, such as chat room owner or admin permissions.


| Feature               | Description                                                         |
| :----------------- | :----------------------------------------------------------- |
| Retrieve the member list | Retrieves the chat room member list by page. |
| Mute/Unmute members   | Adds specified chat room members to or removes them from the mute list.
| Mute all members     | Requires chat room owner or admin permissions. By default, the chat room owner and admins are not muted when all members are muted. |
| Allowlist management         | Requires chat room owner or admin permissions. Members on the allowlist can send messages when all members are muted.        |
| Manage chat room admins       | Only the chat room owner can grant or revoke admin permissions for members.          |
| Blocklist management         | Requires chat room owner or admin permissions. A member added to the blocklist is removed from the chat room and cannot rejoin until the chat room owner removes the member from the blocklist.    |
