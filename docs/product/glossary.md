# Glossary

## EasyIM SDK

The EasyIM SDK is provided by EasyIM to implement instant messaging scenarios such as one-to-one chats, group chats, and chat rooms.

## EasyIM Console

The [EasyIM Console](https://console.easemob.com/user/login) is a tool for developers to manage EasyIM services.

## Daily active users

The number of daily active users (DAU) is the total number of users who interact with the EasyIM server through business operations, including but not limited to logging in and sending or receiving messages, during a calendar day.

## Conversations and messages

### Conversation

A conversation is a collection of all messages in a one-to-one chat, group chat, chat room, or message thread. Users send messages, view historical messages, clear historical messages, and perform other operations in a conversation.

### Conversation list

A conversation list is a list of conversations arranged in a specific order. The order depends on factors such as the time when the latest message in each conversation was received.

### Broadcast message

A broadcast message is sent to all users in an app through a RESTful API. When a user is offline, the message is automatically converted to a system offline push notification.

### Offline message

When a recipient is offline, the EasyIM server temporarily stores messages for them. When the user gets online, they receive the offline messages stored on the server. The storage period for offline messages varies by plan. One-to-one chats and group chats support offline messages, while chat rooms do not.

### Historical message

The EasyIM server stores historical messages for queries. Developers can download compressed historical message files through a RESTful API.

### Roaming message

During multi-device login, a message sent by a user on one client is synchronized to all other clients. This type of message is called a roaming message.

### Text message

A text message contains plain text and can include hyperlinks. After receiving a text message, the client stores it in the database and increments the unread message count. Emoji messages are customized by developers and are essentially text messages. After receiving a text message, the recipient first checks whether it is an emoji message. If so, the client displays the corresponding emoji image.

### Image message

An image message is an attachment message whose content includes the image URL, dimensions, file size, and other information. The maximum supported size is 10 MB.

### Location message

A location message contains a geographic location title, longitude, and latitude.

### Voice message

Voice data is an attachment and must include its duration in seconds. The maximum supported size is 10 MB.

### Video message

A video message contains information such as the video file URL, duration, size, and format. The default supported size is 10 MB.

### File message

A file message contains information such as the file URL, size, and format. Any format is supported, and the default supported size is 10 MB.

### Command message

A command message can be regarded as an instruction. By sending the instruction, the sender notifies the recipient of an operation to perform. After receiving the message, the recipient can process it as needed. Command messages are not stored in the local database, displayed in the UI, or counted as unread messages. You can customize their behavior based on your business requirements, such as updating an avatar or nickname.

### Custom message extension

If the basic message types do not meet your requirements, you can enhance them with custom message extensions, for example, to include the content of a quoted message.

After an extension is added, the message cannot exceed the size limit of the original message type. Custom message extensions are stored as message content in the local database.

### Custom message

A message type customized by the developer, such as a red packet message or a rock-paper-scissors message.

### Reaction

Add or delete Reactions to messages in one-to-one chats and group chats. Reactions provide an intuitive way to express emotions and improve the user experience. In a chat group, you can also use Reactions to initiate a poll and determine the result based on the number of each Reaction added.

### Message callback

For a message callback, the chat server sends a request to the customer's app server before or after an event occurs. The app server can then perform necessary data synchronization or intervene in subsequent event processing based on business requirements.

### Cloud message storage

Store one-to-one, group chat, and chat room messages sent by users on the chat server so that users can retrieve historical messages from the server after switching devices or deleting local messages. For message storage periods, see the [message storage period limits](limitation.html#message-storage) for each plan.

## Users

### User ID

A user ID, or username, uniquely identifies a user within an App Key. The “username”, “userId”, and “user” parameters in code specify a user ID. A user ID differs from the UUID created for the user by the EasyIM server.

### UUID

A unique ID created by the EasyIM server for a user within an App Key. It differs from the user ID.

### User attributes

User attributes are user information, such as a nickname, avatar, email address, phone number, gender, signature, and birthday. In a recruitment scenario, for example, you can use user attributes to store a user's gender, email address, user type (candidate), and position type (Web developer). When viewing user information, you can directly query the user attributes stored on the server.

### Presence

User presence includes online, offline, and custom states. EasyIM provides features for publishing, subscribing to, and querying user presence.

- **Online**: After a user starts the app, the client successfully establishes a network connection to the EasyIM server. The client can send messages to the EasyIM server and receive messages pushed by it. The EasyIM server stores the client's online information, such as network connection information and client platform version. While the app is running, **the EasyIM SDK sends a heartbeat packet to the server every 5 minutes to confirm the user's online status**.
- **Offline**: The state after a user successfully logs out of or disconnects from EasyIM. After logging out of EasyIM, the user cannot send or receive messages but can receive offline messages after the next login.
- **Custom state**: A user can set a custom state, such as busy, be right back, away, on a call, or out to lunch.

### Ban a user

Prevent a user from using EasyIM. After being banned, the user cannot connect to the EasyIM server.

### User blocklist

A user does not receive messages sent by users on their blocklist.

## One-to-one chat

A one-to-one chat is a conversation between two users and supports all message types. The two participants can be friends or non-friends.

## Chat group

A chat group is an instant messaging system that supports multi-user communication and relatively stable member relationships. All chat group members can send and receive messages in the chat group. Members can receive push notifications while offline. Chat groups can be public or private. Public chat groups can be found through a search and joined by non-members. Private chat groups cannot be found through a search, and the chat group owner or an admin must add users. A chat group supports multiple member roles: owner, admin, and regular member. It also provides extensive management capabilities, such as muting, blocklists, and allowlists.

### Chat group owner

The chat group creator is the owner and has the highest permissions in the chat group. The owner can appoint admins, destroy the chat group, change chat group information, and manage members.

The owner can also transfer ownership to another chat group member.

### Chat group admin

Authorized by the chat group owner to assist with management and granted certain management permissions. An admin can manage chat group members.

### Chat group member

A regular chat group member can send and receive messages and view chat group information but does not have chat group management permissions.

### Chat group blocklist

The chat group owner and admins can add members to the blocklist. Users added to the chat group blocklist cannot send messages in the chat group.

### Chat group allowlist

The chat group owner and admins can add members to the allowlist. When global mute is enabled for a chat group, only users on the allowlist can send messages in the chat group.

### Message thread

A message thread is an instant messaging system created from a message in a chat group and supports multi-user communication. Message thread members are a subset of the chat group members.

Members can send, receive, retrieve, and recall messages in a message thread.

## Chat room

A chat room is an organization that supports many participants. Chat room members do not have fixed relationships. Once offline, they do not receive any chat room messages and, except for members on the chat room allowlist, automatically leave the chat room after being offline for more than 2 minutes. Chat rooms can be used for live streaming, message broadcasting, and other scenarios.

### Chat room blocklist

The chat room creator and admins can add members to the blocklist. Users added to the chat room blocklist cannot send messages in the chat room.

### Chat room allowlist

The chat room creator and admins can add members to the allowlist. When global mute is enabled for a chat room, only users on the allowlist can send messages in the chat room.

### Chat room creator

The chat room creator has the highest permissions in the chat room. The creator can appoint admins, destroy the chat room, change chat room information, and manage members.

### Chat room admin

Authorized by the chat room owner to assist with management and granted certain management permissions. An admin can manage chat room members.

### Chat room member

A regular chat room member without chat room management permissions.

## RESTful API

EasyIM server-side APIs are provided as RESTful services. RESTful APIs are based on the simple HTTP protocol and are well supported across programming languages.

The EasyIM RESTful platform provides a multi-tenant user system and manages resources as collections. A collection can contain databases, organizations, apps, users, chat groups, messages, files, and other resources.

## Offline push

Offline push uses a vendor push service to deliver messages when an app is killed. iOS devices use Apple Push Notification service (APNs), while Android devices use Firebase Cloud Messaging (FCM).
