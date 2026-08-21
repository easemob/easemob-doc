# Key EasyIM Features

EasyIM supports message management, user management, offline push, and content moderation.

## Multi-platform support

EasyIM supports Android, iOS, Web, and other platforms, with interoperability across platforms. The following table lists the platform versions supported by EasyIM:

:::tip
SDK V5.0.0 currently fully supports Android, iOS, Web, and Mini Program. More platform versions will be officially released soon. Stay tuned for updates.
:::

| Platform     | Version supported by the SDK      | Demo | Source code | One-to-one and group chat UIKit | Chat room UIKit |
| ------------ | ------- | ------- | ------- | ------- | ------- |
| Android      | Android 5.0 or later (API level 21 or later)   | Supported | - | Supported | Supported |
| iOS          | iOS 10.0 or later     | Supported | - | Supported | Supported |
| Web          | <br/> - Internet Explorer 9 or later <br/> - Firefox 10 or later <br/> - Chrome 54 or later Safari 6 or later<br/> - Edge 12 or later <br/> - Opera 58 or later<br/> - iOS Safari 7 or later<br/> - Android Browser 4.4 (KitKat) or later | Supported | - | Supported | Supported |
| Mini Program        | Supported   | Supported | - | - | - |
| uni-app        | Supported  | - | - | Supported | - |
| HarmonyOS        | HarmonyOS NEXT (API level 12 or later)   | Supported | - | Supported | - |
| Flutter      | Flutter 2.10   | Supported | - | Supported | Supported |
| React Native | React Native 0.63.4 or later  | Supported | - | Supported | Supported |
| Unity        | Unity 2017 or later | Supported | - | - | - |
| Windows      | Windows 10 or later | Supported | - | - | - |
| Electron      | Supported | -  | - | - | - |
| Linux      | Supported | - | - | - | - |

## Account features

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

## Single-device and multi-device login

| Feature               | Description  |
| :----------------- | :---------------------- |
| Single-platform login | Only 1 of the following platforms can be online: Android, iPhone, iPad, HarmonyOS, Windows, Mac, or Web. |
| Multi-platform login | Up to 4 devices can be online simultaneously on each platform by default. |

Before using multi-device login, find **Multiple Platforms and Devices** on the **Feature Configuration** > **Basic Features** > **Users** page of the [EasyIM Console](https://console.easemob.com/user/login) and enable it. Then click **Settings** and configure the number of devices for each platform in the dialog box.

## Message types

| Type           | Description                                                         |
| :------------- | :----------------------------------------------------------- |
| Text message       | A text message contains text, including hyperlinks and emojis.|
| Location message       | A location message contains latitude and longitude information. |
| Image message       | An image message contains information such as the image size and URL.<br/> By default, the image cannot exceed 10 MB. |
| Voice message       | A voice message must include the duration in seconds and the voice file path.<br/> By default, the audio file cannot exceed 10 MB. |
| Video message       | A video message must include the duration in seconds, video file path, thumbnail path, and other information.<br/> By default, the video file cannot exceed 10 MB. |
| File message       | A file message must include the file URL, file name, and other information.<br/> The attachment cannot exceed 10 MB. |
| Command message       | Send a command to notify the recipient of an operation to perform. After receiving the message, the recipient's system can process it as needed.<br/> Command messages are not displayed in the UI or stored in the local database. |
| Custom message     | A custom message type, such as a red packet message or template message. |
| Combined message       | Combine multiple messages into one. A combined message can contain up to 300 original messages.|
| Streaming message       | A message transmission method that splits a complete message into multiple chunks and sends and receives them incrementally in sequence.|

:::tip
1. A message of any type cannot exceed 5 KB. 
2. Message extension fields are supported for transferring custom content, such as quoted message content or rich media content.
:::

## Message features

| Feature           | Description           |
| :------------- | :---------------------- |
| Send and receive messages | Send and receive all message types, including text, image, audio, video, file, location, command, custom, and combined messages.  |
| Send and receive streaming messages | Send and receive streaming messages. Streaming messages can be sent through a server-side API, while the SDK supports only receiving them.  |
| Local storage       | Store received messages locally.         |
| Historical messages       | The EasyIM server can store messages. The storage period depends on your product plan. For details, see [Product pricing](https://www.easemob.com/pricing/im). |
| Offline message push       | <br> - Send push notifications to message recipients while they are offline.<br> - Store offline messages for 7 days by default. |
| Multi-device synchronization       | Synchronize messages across multiple platforms and devices so that they receive messages simultaneously. |
| Message search  | Search for all message types in server-side and local conversations by keyword.     |
| Message recall       | Recall a successfully sent message. By default, a message can be recalled within 2 minutes after it is sent. You can set the message recall period in the EasyIM Console, up to 7 days. |
| Message receipts  | Send delivery receipts and message read receipts.    |
| Edit messages  | Edit successfully sent messages.    |
| Reactions  | Add or delete Reactions on messages.   |
| Targeted messages  | Send a message to one or more specified members in a chat group or chat room. Other members do not receive it.    |
| Global broadcast  | Send broadcast messages to all app users or chat rooms.    |
| Delete messages  | Delete server-side and local historical messages only for the current user, or clear chat history.     |
| Pin messages  | Pin and unpin messages and retrieve pinned messages.    |
| Forward messages  | Forward a successfully sent or received message from the current conversation to another conversation.    |
| Deliver only to online users  | Deliver messages only to online users.    |
| Message extensions  | If built-in message fields do not meet your business requirements, use message extension fields to include custom business data, such as quoted message information, rich media display data, or business identifiers. |
| Import and insert messages  | Import and insert messages locally.    |
| Update messages  | Modify the status or content of local messages.    |
| Typing indicator  | Implement through command messages.    |

## Conversation features

| Feature       | Description |
| :-------------- | :----- |
| Conversation list  | Retrieve a conversation list from the server or local database. |
| Conversation Do Not Disturb | Configure whether a notification is generated when a new message is received in a specified group chat conversation. |
| Conversation unread count  | Retrieve and clear the unread message count of a group chat conversation. |
| Pin a conversation  | Pin a group chat conversation to the top of the conversation list. |
| Conversation mark  | Add a mark to a group chat conversation. |
| Delete a conversation  | Delete a group chat conversation. |

## User attributes

| Feature               | Description  |
| :----------------- | :---------------------- |
| Set user attributes | Set the user nickname, avatar, email address, phone number, and other attributes. |
| Retrieve user attributes | Retrieve all user attributes for one or more specified users.  |
| Retrieve the total size of user attributes in an app (server side only) | Retrieve the size, in bytes, of the attribute data for all users in the app.  |
| Subscribe to attribute changes of non-friends | After subscription, the app promptly receives a notification when an attribute of a specified non-friend changes.|
| Delete user attributes | Delete all attributes of a single user. |

## User relationships

By default, EasyIM supports sending one-to-one messages between non-friends, meaning users can chat without adding each other as friends. To allow one-to-one messages only between friends, open the [EasyIM Console](https://console.easemob.com/user/login) and [enable friend relationship check](/product/console/basic_user.html#friend-relationship-check). 

| Feature       | Description |
| :-------------- | :----- |
| Add a friend  | Send, receive, and process friend requests. |
| Remove a friend  | Remove a friend. |
| Accept or decline a friend request  | Accept or decline a received friend request. |
| Set friend remarks  | Set remarks for a specified friend. |
| Retrieve the friend list  | After automatic friend list synchronization upon login is enabled, the SDK obtains the latest friend data through automatic synchronization. |
| Add a user to the blocklist  | Add a user to the blocklist. Any user can be added, regardless of whether they are a friend. |
| Remove a friend from the blocklist  | Remove a user from the blocklist to restore behaviors such as message sending.|
| Retrieve the blocklist  | Retrieve the blocklist from the server and local database. |

## Chat groups and chat rooms

| Feature   | Chat group  | Chat room  |
| :------ | :----------- | :-------- |
| Use case   | Similar to group chats in Signal or Skype, where all members have persistent relationships     | Members do not have persistent relationships and leaving the room means leaving the chat room     |
| Type   | Public or private. When creating a chat group, you can configure whether approval from the chat group owner or admins is required to join     | Chat rooms are not classified as public or private. All users can freely join or leave them |
| Maximum number of chat groups/chat rooms  | <br/> - Trial: 100 <br/> - Pro: Unlimited  <br/> - Enterprise: Unlimited  | <br/> -Trial: Not supported <br/> - Pro: Unlimited  <br/> - Enterprise: Unlimited     |
| Maximum number of members          | <br/> -Trial: 100 members/chat group <br/> - Pro: 300 members/chat group (adjustable*)  <br/> - Enterprise: 3000 members/chat group (adjustable*) | <br/> - Trial: 100 <br/> - Pro: Unlimited  <br/> - Enterprise: Unlimited   |
| Member list   | Visible to all members     | Visible to all members      |
| Create   | Any app user can create a chat group     | Only a chat room superadmin can create a chat room on the client     |
| Destroy   | Chat group owner     | Chat room owner     |
| Apply to join         | Supported     | Supported    |
| Join approval         | Supported     | Supported     |
| Invite to join         |  Supported    | Not supported   |
| Owner leaves         | Not supported     | Supported     |
| Appoint admins         | Supported      | Supported     |
| Remove members         | <br/> - Chat group owner <br/> - Chat group admin | <br/> - Chat room owner <br/> - Chat room admin     |
| Mute members          | Supported     | Supported     |
| Allowlist          | Supported     | Supported     |
| Blocklist         | Supported     | Supported     |
| Member change notifications         | Notifications are delivered by default for invitations, join requests, member removal, and voluntary departure     | Notifications are delivered by default when a member leaves voluntarily or is removed     |
| Role change notifications         | Notifications are delivered by default when a chat group admin is added or removed or ownership changes     | Notifications are delivered by default when a chat room admin is added or removed or ownership changes     |
| Chat group/chat room attribute change notifications   | Notifications are delivered by default when the chat group name, description, or announcement changes     | Notifications are delivered by default when the chat room name, description, announcement, or custom attributes change     |
| Chat group/chat room member status change notifications         | Notifications are delivered by default when a member is muted or added to the blocklist or allowlist, or when an admin changes      | Notifications are delivered by default when a member is muted or added to the blocklist or allowlist, or when an admin changes     |
| Message features     | <br/> - Support message sending, roaming, editing, recall, pinning, receipts, Reactions, translation, combination, forwarding, delivery only to online users, and more.<br/> - Support targeted messages sent only to one or more specified members.    | <br/> - Support most chat group message features, including targeted messages.<br/> - To use message roaming, upgrade the SDK to the specified version and contact the EasyIM business manager to activate it.<br/> - Reactions and offline messages are not supported.     | 
| Historical message storage         | Supported     |  Supported    |
| View roaming messages         | Enabled by default     | Contact the EasyIM business manager to activate     |
| View roaming messages sent before joining          |  Supported    | Supported (contact the EasyIM business manager to activate)    |
| Unread message count          | Supported     | Not supported   |
| Default message reception          | Receive online messages and support offline push     | Receive only online messages; offline push is not supported    |
| Offline message storage          | Supported     | Not supported     |
| Message reliability         | Users receive all messages sent in the chat group     | When the message volume is high, chat room messages above the threshold of 100 messages per second are discarded    |

## EasyIM Console

You can configure and manage your app in the [EasyIM Console](https://console.easemob.com/user/login).

| Feature   | Description  | 
| :------ | :----------- | 
| Create an app  | Create your app                   | 
| Upgrade the plan  | Activate the Pro or Enterprise EasyIM plan on a self-service basis                   | 
| Subscribe to value-added services  | Activate [value-added services](/product/pricing_policy.html#value-added-service-fees) such as content moderation, real-time audio and video, and Instant Push                | 
| Account center  | View order history and bills                  | 
| Activate features  | Activate features such as the server-side conversation list or multiple platforms and devices                  | 
| App overview | Display the service plan, domain configuration, and other information                  | 
| Push configuration | Manage vendor push certificates and push templates                  | 
| Message callbacks  | Configure pre-delivery and post-delivery callback rules                   | 
| IP allowlist | Allow specified IP addresses to call RESTful APIs                   | 
| User management  | Create, ban, and delete users, add friends, and perform other operations                   | 
| Chat group management  | Create and delete chat groups and view chat group members and the blocklist                    | 
| Chat room management  | Create and delete chat rooms and view chat room members, admins, the mute list, the blocklist, and other information                   | 
| Statistics | View statistics about users, chat groups, and chat rooms and message volume statistics                   | 
| Real-time queries | View the number of active users, chat groups, and chat rooms in real time, request quality, trending data, EasyIM message delivery queries, and more                   | 
| Content moderation | Configure message moderation rules, view moderation records, perform keyword-based moderation, and more                  | 

## Statistics

| Feature | Description |
| :------------- | :---------------------- |
| User data | User statistics, including the total number of registered users, today's active users, and today's new users  |
| Chat group data | Chat group statistics, including the total number of chat groups and the numbers of active, new, and destroyed chat groups  |
| Chat room data | Chat room statistics, including the total number of chat rooms, the numbers of active, new, and destroyed chat rooms, and the number of concurrent online chat room members  |
| Server data | Server statistics, including the total number of Servers, today's active Servers, today's new Servers, the total number of Channels, and today's new Channels  |
| Message volume statistics | Total message volume statistics and trend analysis by message type in one-to-one chats, group chats, and chat rooms.  |

## Real-time queries

| Feature | Description |
| :------------- | :---------------------- |
| Request quality overview | Provide periodic analysis of quality data to help you understand usage trends and track product quality.  |
| Trending data query | Provide information about the TOP 50 active users, chat groups, and chat rooms with a minimum granularity of one minute.  |
| EasyIM message delivery query | Query message delivery within the last three days.  |
| EasyIM user connection status | Query the historical connection status of a user within the last three days by user ID.  |
| EasyIM user device logs | Query logs on a user's device or upload device logs to the Easemob log server.  |
| Chat room message rate | Query the number of uplink and downlink messages per minute in a chat room by chat room ID.  |

## Value-added services

### Content moderation

Use the EasyIM [content moderation service](/value-added/moderation/moderation_overview.html) to detect message content in various scenarios, helping you manage app message content and mitigate the risk of prohibited content.

| Feature | Description |
| :------------- | :---------------------- |
| Moderate multiple message types | Intelligently identify text, images, audio, and video files.  |
| Custom message handling rules | Customize policies for message delivery or interception.  |
| Callback for message moderation results | Send message moderation results to the customer's server through a callback. |
| Unified content moderation backend | Provide a visual content moderation backend for querying moderation records and viewing moderation statistics.  |

### Real-time audio and video

| Feature             | Description                           |
| :------------- | :---------------------- |
| One-to-one audio and video calls | Support one-to-one voice and video calls.     |
| Group audio and video calls   | Support group voice and video calls.       |
| Incoming call notifications through offline push | Receive call invitations through offline push. |
| Incoming call notifications and floating windows | Display incoming call notifications in the notification bar and floating windows.   |

### Instant Push

| Feature           | Description                                         |
| :------------- | :---------------------- |
| Synchronous push to a single user | Send push notifications synchronously to a single user.             |
| Asynchronous push to a single user | Send push notifications asynchronously to a single user.             |
| Batch push to multiple users | Send push notifications asynchronously to multiple users in a batch.             |
| Tag or broadcast push  | Send push notifications to users with specified tags or all users in an app. |

### Server-side message search

| Feature               | Description                               |
| :------------- | :---------------------- |
| Historical message search       | Search historical messages by keyword.         |
| Conversation-scoped search       | Search for messages in specified conversations.           |
| Conditional search filters       | Filter messages by message type and time range. |
| Message content and extension field search | Search message content and extension fields.       |

### Message translation

| Feature           | Description                           |
| :------------- | :---------------------- |
| Text message translation   | Translate text messages only.           |
| Specify the source language | Pass the source language code for translation.   |
| Multiple target languages | Translate a message into multiple target languages at once.   |
| Translation results   | Return the translation result for each target language. |

### Speech-to-text

| Feature     | Description         |
| :------------- | :---------------------- |
| Convert a voice message to text     | Convert a successfully sent voice message to text.             |
| Convert a local voice file to text | Convert a local voice file to text.                     |
| Configure voice parameters       | Configure the format, sample rate, bit depth, and number of channels for a local voice file. |
| Read transcription results       | Read the persisted text result from a voice message body.           |

## On-premises deployment

The EasyIM on-premises service is a privately deployable solution based on core instant messaging technologies. It supports deployment in intranet physical server clusters, public clouds, private clouds, and other environments, providing a full-featured, secure, reliable, and scalable instant messaging platform. For details, see the [on-premises service documentation](https://docs-im-privatization-v3.easemob.com).
