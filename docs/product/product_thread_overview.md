# Message Threads

A chat group member can create a message thread from a chat group message. The message thread is a subset of the chat group, and the chat group message used to create it is called the parent message.

## Message thread management

| Feature       | Description   | 
| :--------- | :----- | 
| Create a message thread       | Any chat group member can create a message thread from a chat group message.   | 
| Destroy a message thread       | Only the owner and admins of the chat group containing the message thread can destroy the message thread.  | 
| Join a message thread     | All members of the chat group containing the message thread can join the message thread. You can call a REST API to add members to a message thread in bulk.  | 
| Leave a message thread     | Message thread members can leave the message thread. You can call a REST API to remove members from a message thread in bulk. After a member leaves the message thread, they no longer receive messages in it:<br/> - A message thread member voluntarily leaves the message thread;<br/> - A message thread member is removed from the message thread. Only the chat group owner and admins have permission to remove members. | 
| Change a message thread name      | Only the chat group owner and admins and the message thread creator can change the message thread name.  | 
| Retrieve message thread details     | All members of the chat group containing a message thread can retrieve its details from the server.  | 
| Retrieve the message thread member list      | All members of the chat group containing a message thread can retrieve its paginated member list from the server.   | 
| Retrieve a list of message threads     | - A user can retrieve a paginated list of message threads they joined or created from the server. <br/> - A user can retrieve a paginated list of message threads they joined or created in a specified chat group from the server. | 
| Retrieve the latest messages from message threads in bulk      | A user can retrieve the latest message from multiple message threads in bulk from the server.  | 
| Retrieve message threads | You can call REST APIs to retrieve message threads: <br/> - Retrieve all message threads in an app.<br/> - Retrieve all message threads that a specified user has joined.<br/> - Retrieve all message threads that the current user has joined. <br/> - Retrieve all message threads that a specified user has joined in a specified chat group.| 

## Message management in a message thread

| Feature       | Description   | 
| :--------- | :----- | 
| Send a message in a message thread  | Sending a message in a message thread is essentially the same as sending a chat group message. The only difference is that a message sent in a message thread must include a flag indicating that it belongs to the message thread.| 
| Receive a message in a message thread      | Receiving messages in a message thread is the same as receiving messages in one-to-one chats, group chats, and chat rooms. For details, see [Receive messages](/sdk/v5/android/message_receive.htm).   | 
| Recall a message in a message thread      | The logic for recalling a message in a message thread is the same as that for recalling a message in a one-to-one chat, group chat, or chat room. After a message is recalled, all members of the chat group containing the message thread receive a message thread update callback, while message thread members receive a callback indicating that a message in the message thread was recalled. | 
| Retrieve messages in a message thread      | You can retrieve messages in a specified message thread from the server or the local database.  | 

## Monitor message thread events

You can implement message thread event listeners. When an operation occurs in a message thread, including message thread creation, name changes, destruction, or member removal, the other users in the message thread receive the corresponding event. For details, see [Monitor message thread events](/sdk/v5/android/thread.html#monitor-message-thread-events).

## Message thread event callbacks

You can implement a post-delivery callback so that the EasyIM server synchronizes message thread events with your app server through HTTP/HTTPS POST requests. Such events include operations on a message in a message thread, such as sending, recalling, or editing the message. For details, see [Message thread webhook events](/rest/callback_thread.html).

## Message thread limitations

For message thread limitations, see [Message thread limitations](/product/limitation.html#message-threads).
