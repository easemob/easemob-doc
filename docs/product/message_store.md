# Message Storage

Messages are stored both locally and on the server. For example, when client A sends a message to client B, client A sends the message to the EasyIM server, while the SDK saves the message to a local database. The SDK creates this database internally, and you cannot operate on it directly. When the EasyIM server delivers the message to client B, the server also records the message. After client B receives the message, the SDK stores it in the local database. 

## SDK storage

The SDK uses SQLite internally to store local messages. You can retrieve or delete these messages.

:::tip
The Web and Mini Program SDKs do not store messages locally.
:::

## Server-side storage

### Historical message storage

The storage period for historical messages on the server depends on your subscribed plan. For details, see [EasyIM plan features](/product/product_package_feature.html). EasyIM provides message roaming, which stores the historical messages from all of a user's conversations on the message server. Users can retrieve their historical messages on any device, maintaining a consistent conversation experience when switching between devices. By default, users can retrieve historical messages from one-to-one chats and group chats. **To retrieve historical chat room messages, contact the EasyIM business manager**.

### Message attachment storage

- Attachment size: By default, message attachments, such as images, audio, video, and other files, cannot exceed 10 MB.
- Storage period: Message attachments, including images, audio, video, and other files, are stored for 7 days by default. To extend the storage period, contact the EasyIM business manager. The message attachment size limit (10 MB by default) and storage period limit are the same as those for chat group shared files. If the maximum storage period for either is increased, the other is automatically adjusted accordingly, and vice versa.
- Storage capacity: By default, 1 TB of storage is provided for attachments such as images, voice files, and other files. If you expect to require more storage, you can [upload attachments to your own server](/document/android/message_send.html#upload-message-attachments-to-your-own-server) or contact the EasyIM business manager to increase the storage limit.
- Traffic allowance: By default, every 10,000 DAU includes 100 GB of traffic per month for attachments such as images, voice files, and other files. Attachment download speeds may be limited after this allowance is exceeded. If you expect to require more traffic, you can [upload attachments to your own server](/document/android/message_send.html#upload-message-attachments-to-your-own-server) or contact the EasyIM business manager to increase the traffic limit.

### Offline message storage

For one-to-one chats and group chats, offline messages are stored for **7** days by default. For each end user, all one-to-one conversations can store 500 offline messages, and all group chat conversations can store 200 offline messages. If either the storage period or message count limit is exceeded, the newest offline messages replace the oldest ones. To increase these limits, contact the EasyIM business manager.

### Event notification storage

All types of event notifications have the same storage period as historical messages.
