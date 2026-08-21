# Product Limitations

This document briefly describes EasyIM usage limitations, including call frequency, string size, and encoding format.

## Messages

### Message size

The following table lists the message length limit for each message type:

| Message type       | Message length limit            |
| :------------- | :----------------------------------- |
| Text message       | 5 KB.                                 |
| Image message       | The image cannot exceed 10 MB. The size limit for an image message is 5 KB.      |
| Voice message       | The audio file cannot exceed 10 MB. The size limit for a voice message is 5 KB.  |
| Video message       | The video file cannot exceed 10 MB. The size limit for a video message is 5 KB.  |
| File message       | The attachment cannot exceed 10 MB. The size limit for a file message is 5 KB.  |
| Command message       | 5 KB.                                 |
| Custom message     | 5 KB.                                 |
| Combined message       | 5 KB.                                 |
| Targeted message       | 5 KB.                                 |

:::tip
By default, message attachments, such as images, audio, video, and other files, cannot exceed 10 MB. For other attachment limitations, see [Message storage](#message-storage).
:::

### Message storage

- **Historical messages**: The server-side storage period depends on your subscribed plan: 3 days for the Free plan, 7 days for the Pro plan, and 90 days for the Enterprise plan. You can contact the EasyIM business manager to increase the message storage period for the Pro and Enterprise plans.
- **Chat history files**: You can retrieve user chat history files from the server.
  - A single request retrieves the chat history file containing messages sent within one hour from the specified start time.
  - You can retrieve chat history from up to the last 3 days. To increase this limit, contact the EasyIM business manager.
  - Historical message queries have some latency and cannot return results in real time.
- **Message attachments/files**:
  - Attachment size: By default, message attachments, including images, audio, video, and other files, cannot exceed 10 MB.
  - Storage period: Message attachments, including images, audio, video, and other files, are stored for 7 days by default. To extend the storage period, contact the EasyIM business manager. The message attachment size limit (10 MB by default) and storage period limit are the same as those for chat group shared files. If the maximum storage period for either is increased, the other is automatically adjusted accordingly, and vice versa.
  - Storage capacity: By default, 1 TB of storage is provided for attachments such as images, voice files, and other files. If you expect to require more storage, you can [upload attachments to your own server](/document/android/message_send.html#upload-message-attachments-to-your-own-server) or contact the EasyIM business manager to increase the storage limit.
  - Traffic allowance: By default, every 10,000 DAU includes 100 GB of traffic per month for attachments such as images, voice files, and other files. Attachment download speeds may be limited after this allowance is exceeded. If you expect to require more traffic, you can [upload attachments to your own server](/document/android/message_send.html#upload-message-attachments-to-your-own-server) or contact the EasyIM business manager to increase the traffic limit.
- **Offline messages**: For one-to-one chats and group chats, offline messages are stored for 7 days by default. For each end user, all one-to-one conversations can store 500 offline messages, and all group chat conversations can store 200 offline messages. If either the storage period or message count limit is exceeded, the newest offline messages replace the oldest ones. To increase these limits, contact the EasyIM business manager.
- **Event notifications**: Event notifications have the same storage period as messages.

### Streaming messages

When sending **one text streaming message**, you must comply with the following rules:

- **Interval between chunks**: The interval between adjacent chunks cannot exceed 30 seconds. If it does, [error 14033](/document/server-side/message_stream_send_single.html#error-code) is returned and the streaming message is terminated.
- **Total transmission duration**: The total transmission duration of all chunks cannot exceed 30 minutes. If another chunk is sent after the timeout, [error 14034](/document/server-side/message_stream_send_single.html#error-code) is returned.
- **Total length**: The total length of the text content in all chunks cannot exceed 128 KB. If it does, [error 14032](/document/server-side/message_stream_send_single.html#error-code) is returned and the streaming message is terminated.

### Message recall

By default, a sender can recall a message within 2 minutes after sending it. You can set the message recall period, up to 7 days, on the **Feature Configuration** > **Basic Features** > **Messages** page of the [EasyIM Console](https://console.easyim.ai/user/login).

:::tip
All message types except command messages can be recalled.
:::

### Message receipts

- One-to-one conversations support delivery receipts, conversation read receipts, and message read receipts.
- Group chat conversations support only message read receipts.

The following table lists the limitations of read receipts for chat group messages:

| Limitation| Default | Description | 
| :--------- | :----- | :------- | 
| Feature activation   | Disabled   | To use this feature, on the **Feature Configuration** > **Basic Features** > **Messages** tab of the [EasyIM Console](https://console.easyim.ai/user/login), find **Message Read Receipt (Group Chat)** and activate the feature. For pricing, see [Billing policy](/product/pricing_policy.html#value-added-service-fees).   | 
| Permission  | All chat group members    | By default, all chat group members can request a read receipt when sending a message. To allow only the chat group owner and admins to request read receipts, contact the EasyIM business manager.   | 
| Read receipt validity period    | 3 days    | A group chat read receipt is valid for 3 days. If a message was sent more than 3 days ago, the server does not record which chat group members read the message or send read receipts.   | 
| Chat group size    |  200 members   | This feature supports chat groups with up to 200 members. If a chat group has more than 200 members, messages sent by members do not return read receipts. This limit cannot currently be increased. | 
| Who can view the number of returned read receipts    | Message sender | By default, only the message sender can view the number of returned read receipts or the number of users who returned them. To allow all chat group members to view this information, contact the EasyIM business manager to activate the feature. | 

### Edit messages

This feature applies to one-to-one chats, group chats, and chat rooms and has the following scope:

- Text and custom messages: The message body and extension fields can be edited.
- File, video, voice, image, location, and combined forwarded messages: Only extension fields can be edited; the message body cannot be edited.
- Command messages: Editing is not supported.

By default, a message can be edited up to 10 times.

### Forward messages

Combined forwarding supports up to 10 nested levels and up to 300 messages at each level.

### Targeted messages

- Applies to chat group or chat room conversations.
- A targeted message can be sent to up to 20 members.
- Applies to all message types, including text, image, audio, and video messages.
- In a one-to-one conversation, only the message sender can edit the message.
- In a group chat conversation, regular members can edit only messages they sent. In addition to their own messages, the chat group owner and admins can edit messages sent by regular members.

### Chat room global broadcast messages

You can [call a REST API to send a chat room global broadcast message](/document/server-side/broadcast_to_chatrooms.html). This feature is disabled by default. To activate it, contact the EasyIM business manager.

### Pin messages

By default, up to 20 messages can be pinned in a conversation. You can contact the EasyIM business manager to increase this limit to a maximum of 100.

### Deliver messages only to online users

This feature supports only one-to-one and group chats, not chat rooms.

### Reactions

- **Reaction counting**: If multiple users add the same Reaction to a message, such as "👍", the SDK displays it as one Reaction and counts the users who added it. If multiple users add different Reactions, such as "👍" and "❤️", the SDK counts and displays each Reaction separately.
- **Per-user limit**: A user can add the same Reaction to the same message only once. Adding it again returns error code 1301.
- **Quantity limit**: By default, up to 20 Reactions can be added to each message. To increase this limit, contact the EasyIM business manager.
- **Reaction ID requirements**:
  - A Reaction ID cannot exceed 128 characters.
  - The character set is unrestricted, but the server and client settings must be consistent.
  - If special characters are used, URL-encode them when retrieving or deleting a Reaction.
- **Storage period**:
  - The default Reaction storage period is 7 days for the Pro and Enterprise EasyIM plans.
  - To adjust it, contact the EasyIM business manager. We recommend keeping the Reaction storage period consistent with that of the corresponding message.

### Retrieve message traffic statistics

- The SDK can collect statistics only for messages sent and received within the last 30 days after this feature is enabled.
- Only the Android and iOS SDKs support this feature.

## Conversations

### Conversation list

By default, the server stores 100 conversations for each end user. To increase this limit, contact the EasyIM business manager. If the number of conversations exceeds the limit, new conversations overwrite older inactive conversations.

### Pinned conversations

You can pin up to 50 conversations.

### Conversation marks

- Marks can be added to one-to-one and group chat conversations but not chat room conversations.
- Up to 20 marks can be added to a conversation.
- Marks can be added to up to 20 conversations at a time.
- The same mark can be removed from up to 20 conversations at a time.

## Chat groups

### Number of chat groups and chat group members

- The total number of chat groups, number of members in a chat group, and number of chat groups a user can join depend on the plan. For details, see [EasyIM plan features](/product/product_package_feature.html).
- In a chat group, the total number of the owner and admins cannot exceed 100, meaning that up to 99 admins can be added.
- If a chat group has more than 3000 members, offline push is not supported by default. To use this feature, contact the EasyIM business manager to activate it.

### Chat group and member attributes

- Chat group name: String. The maximum length is 128 characters.
- Chat group description: String. The maximum length is 512 characters.
- The length limit for a chat group announcement is 512 characters.
- Chat group extension information, such as business-related tags added to the chat group, cannot exceed 8 KB.
- The total length of a chat group member's custom attributes (key-value) cannot exceed 4 KB. For an individual custom attribute, the key cannot exceed 16 bytes and the value cannot exceed 512 bytes.

### Chat group shared files

- By default, the maximum size of a single chat group shared file is 10 MB. To increase this limit, contact the EasyIM business manager.
  This limit is the same as the message attachment size limit. If the message attachment size limit is increased, the chat group shared file size limit is automatically adjusted accordingly, and vice versa.
- Up to 10,000 shared files can be uploaded to a chat group.
- Chat group shared files have the same server-side storage period as message attachments, which is 7 days by default. To increase this limit, contact the EasyIM business manager.
  If the server-side storage period for message attachments is increased, the storage period for chat group shared files is automatically adjusted accordingly, and vice versa.

### Message threads

- By default, a single app can have up to 100,000 message threads. To adjust this limit, contact the EasyIM business manager.
- A message thread name cannot exceed 64 characters.

## Chat rooms

For the total number of chat rooms supported by each plan, see [EasyIM plan features](/product/product_package_feature.html).

### Chat room members

- The maximum number of chat room members, including the chat room owner, is 10,000 by default. To adjust this limit, contact the EasyIM business manager.
- The total number of chat room creators and admins cannot exceed 100, meaning that up to 99 admins can be added.
- Chat room members, except those on the chat room allowlist, automatically leave the chat room after being offline for more than 2 minutes.

### Basic chat room attributes

- Chat room name: String. The maximum length is 128 characters.
- Chat room description: String. The maximum length is 512 characters.
- Chat room announcement: String. The maximum length is 512 characters.
- Chat room extension information cannot exceed 8 KB.

### Chat room custom attributes (key-value)

Each chat room supports up to 100 custom attributes, and the total size of chat room custom attributes in each app cannot exceed 10 GB.

Chat room custom attributes are key-value pairs. A key cannot exceed 128 characters and supports the following character set:
- 26 lowercase English letters, a-z;
- 26 uppercase English letters, A-Z;
- 10 digits, 0-9;
- "_", "-", and ".".

Each chat room attribute value cannot exceed 4096 characters.

## Users

### User registration

- User ID: The length cannot exceed 64 bytes. The following characters are supported:
  - 26 lowercase English letters, a-z;
  - 10 digits, 0-9;
  - "_", "-", and ".".

:::tip
- Do not use uppercase English letters, A-Z.
- Ensure that the user ID is unique within an app.
- A user ID is public information. Do not use sensitive information such as a UUID, email address, or phone number.
:::

- Password: User login password. The length cannot exceed 64 characters.

### User attributes

- By default, the total length of a single user's attributes cannot exceed 2 KB.
- By default, the total length of all user attributes in a single app cannot exceed 10 GB.

### User relationships

- The maximum number of friends per user within an App Key depends on the plan. For details, see [EasyIM plan features](/product/product_package_feature.html).
- Friend remarks cannot exceed 100 characters.
- Each user's blocklist can contain up to 500 users.

### Presence subscriptions

- The maximum subscription period is 30 days. You must resubscribe after it expires. If you resubscribe before the current subscription expires, the newly configured validity period overwrites the previous one.
- You can subscribe to up to 100 accounts in each API call. For more accounts, make multiple calls.
- Each user ID can subscribe to up to 3000 users.
- Each user can have up to 3000 subscribers.

## Offline push

### Push nickname

You can customize the sender nickname displayed in the recipient's push notification bar for offline push. The nickname cannot exceed 100 characters and supports the following character set:  
- 26 lowercase English letters, a-z;
- 26 uppercase English letters, A-Z;
- 10 digits, 0-9;
- Chinese characters;
- Special characters.

### Push template name

- When adding the default push template, set its name to `default`.
- A custom template name can contain up to 64 characters from the following character set:
  - 26 lowercase English letters, a-z;
  - 26 uppercase English letters, A-Z;
  - 10 digits, 0-9.    

### Multi-device login

- During multi-device login, EasyIM supports up to 4 devices online simultaneously on each client platform by default. To increase this limit, contact the EasyIM business manager.

- When customizing login device platforms, the device platform value range is [1,100], and the device count value range is [0,4].

## Call frequency limit

For REST API call frequency limits, see [REST API call frequency limits](/document/server-side/limitationapi.html).

