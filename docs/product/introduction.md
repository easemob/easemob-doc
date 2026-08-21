# Product Introduction

EasyIM provides developers with highly reliable, low-latency, high-concurrency, secure, and global communications cloud services, helping them quickly build end-to-end communication scenarios. EasyIM provides SDKs and RESTful APIs that support unlimited concurrent online users, hundreds of millions of concurrent chat room messages, an average global latency of less than 200 milliseconds, and an average latency within the same region of less than 100 milliseconds.

- Support one-to-one chats, group chats, and chat rooms;
- Provide server-side RESTful APIs and [webhook services](/document/server-side/callback_overview.html);
- Provide multi-platform SDKs for Android, iOS, Web, HarmonyOS, Windows, Linux, Unity, Flutter, React Native, Mini Program, uni-app, and Electron;
- Provide demos and UIKit.

## Product architecture

EasyIM provides services for one-to-one chats, group chats, chat rooms, offline push, account authentication, user attributes, and user relationships, as well as comprehensive SDK APIs and RESTful APIs.

![EasyIM architecture](/images/product/framework.png)

## Product services

### Data centers

EasyIM has five major data centers and more than 200 edge acceleration nodes worldwide, providing network services in over 200 countries and regions. EasyIM data centers use a three-data-center deployment within each city, provide an SLA of 99.95%, and deliver excellent performance on unstable networks, with a 100% message delivery rate at 70% packet loss.

When creating an app in the EasyIM Console, you must select a data center. Your business data is stored in that data center. For details, see [Data centers](data_center.html).

### One-to-one chats

A one-to-one chat is a conversation between two users. It supports text, image, location, voice, video, custom messages such as red packets, and combined messages, as well as offline messages, message roaming, message receipts, message recall, editing, searching, Reactions, translation, message pinning, content moderation, and other features. For details, see [One-to-one messages](/product/message_single_chat.html).

### Group chats

A chat group is an instant messaging system that supports multi-user communication and relatively stable member relationships. All chat group members can receive and send messages in the chat group.

Chat groups are classified as public or private based on whether they are visible to users.

| Chat group type | How to join   | 
| :------- | :---------- | 
| Public chat group   | Any user can find the chat group, apply to join it, or be invited by an admin or the chat group owner. Whether an application requires approval from the owner or an admin depends on the chat group settings. |
| Private chat group   | Users outside the chat group cannot find it and must be invited to join. Whether regular members can invite other users in addition to the chat group owner and admins depends on the chat group settings. |

You can customize chat groups based on your requirements. For example, users can set a chat group extension field when creating a chat group to define additional information and set custom member attributes (KV), such as a member's nickname and avatar in the chat group. For details, see [Chat groups](/product/product_group_overview.html).

### Chat rooms

A chat room is a Twitch-like organization that supports many participants and can be used for live streaming and message broadcasting. Unlike chat group members, chat room members do not have fixed relationships and do not receive any chat room messages after going offline. For details, see [Chat rooms](/product/product_chatroom_overview.html).

### User attributes and user relationships

EasyIM supports user attributes and user relationships. For details, see [User attributes](/product/product_user_attribute.html) and [User relationships](/product/product_user_relationship.html).

- User attributes: User nickname, avatar, email address, phone number, gender, signature, birthday, and other information.
- User relationships: Friend lists, blocklists, and more.

### Account authentication

EasyIM supports quick integration using the app's own account system without account mapping. After integrating the SDK, authenticate the user ID and token through API calls. For details, see [User registration and login](/product/product_user_registration_login.html).

## Management and monitoring

The EasyIM Console provides management capabilities for EasyIM. In the Console, you can activate EasyIM, purchase value-added services, upgrade your plan, configure message push and callbacks, and manage users, chat groups, and chat rooms. You can also configure content moderation and view statistics.

## Server-side features 

### RESTful APIs

EasyIM provides the following RESTful APIs through the REST platform. Your business server can send HTTP requests to the EasyIM REST server to implement real-time communication on the server side. RESTful APIs provide features such as sending, retrieving, recalling, editing, importing messages, adding Reactions, and managing chat groups, chat rooms, user accounts, and user relationships. RESTful APIs provide more powerful management capabilities than the EasyIM Console. For details, see [RESTful APIs](/document/server-side/overview.html).

Some features are available only through RESTful APIs, such as banning and unbanning accounts, globally muting users, and sending app or chat room global broadcast messages.

### Message callbacks

EasyIM provides [message webhooks](/document/server-side/callback_overview.html). Before or after an event occurs, the EasyIM server sends an HTTP POST request to your app server, allowing your app backend to intervene in the event processing logic or perform necessary data synchronization.
