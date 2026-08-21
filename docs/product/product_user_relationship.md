# User Relationships

EasyIM supports user relationship management and provides a complete solution for managing social relationships:

- Store user relationships, including friend relationships and user blocklists.
- Manage user relationships, including:
  - Add a friend;
  - Delete a friend; 
  - Add a friend to the blocklist;
  - Remove a friend from the blocklist.
- Provide easy-to-use client-side and server-side APIs for various business scenarios.

## Friend list

You can manage the friend list by adding and deleting friends, retrieving the friend list from the server and local database, and importing a friend list.

For friend list limitations, such as the maximum number of friends per user, see [Product limitations](/product/limitation.html).

### Add a friend

EasyIM supports adding one friend at a time. The process is as follows:

- Server side: Call a REST API to add a user directly to the friend list. The friend does not need to confirm.
- Client side: For example, if user A adds user B as a friend, user A sends a friend request to user B. After receiving the request, user B accepts or declines it. If user B accepts, users A and B are added to each other's friend lists. If user B declines, they are not added as friends.

A friend entry contains the following information:

- The user to whose friend list the friend is added.
- The friend's user ID.
- Friend remarks, if set by calling the API for adding friend remarks.
  
### Delete a friend

EasyIM supports deleting one friend at a time. Deleting a friend also deletes the user from the other user's friend list.

The other user does not need to accept or decline the deletion. When deleting a friend, you can also choose whether to retain the conversation and messages with the user.

### Retrieve the friend list

- Using a server-side API:
  - You can [call the recommended API to retrieve a paginated friend list](/document/server-side/user_friend_list_paged.html). Each friend object contains the friend's user ID and remarks.
  - You can also [call the earlier API to retrieve the entire friend list at once](/document/server-side/user_friend_list_obtain.html). This list contains only the user IDs of the friends.
- Using a client-side API:
  - You can call the recommended API to [retrieve the friend list from the server all at once or a page at a time](/document/android/user_relationship.html#retrieve-the-friend-list-from-the-server). Each friend object contains the friend's user ID and remarks. You can also call the earlier API to retrieve the entire friend list at once. This list contains only the user IDs of the friends. 
  - You can retrieve the local friend list or information about an individual friend, including the friend's user ID and remarks, at once.
   
:::tip
You must retrieve the friend list from the server before you can retrieve it locally.
:::

### Import a friend list

You can [call a REST API](/document/server-side/user_friend_import.html) to import multiple friends at once.

### Enable or disable message sending permission control

One-to-one message communication can occur between friends or non-friends. For example, colleagues in an enterprise mobile office app may be allowed to send messages to one another without message sending permission control. In a dating app, however, messages may be allowed only between friends. Non-friends must send a friend request and can send messages only after the request is accepted.

By default, EasyIM supports sending one-to-one messages between non-friends, meaning users can chat without adding each other as friends. To allow one-to-one messages only between friends, enable friend relationship check as follows:

1. In the left navigation pane of the EasyIM Console, select **EasyIM > Basic Features** > **Users**.
2. Click the enable button for **Friend Relationship Check**.
   After this feature is enabled, the SDK checks the friend relationship when a user initiates a one-to-one chat. If a user sends a one-to-one message to a non-friend, the SDK reports error code 221.

## Blocklist

Each user has a blocklist that stores blocked users. Up to 500 users can be added to the blocklist.

A user can add any user to the blocklist, regardless of whether they are friends. A user on your blocklist cannot send you messages or friend requests. A friend who is added to the blocklist remains in the friend list.

You can [add a user to the blocklist](/document/android/user_relationship.html#add-a-user-to-the-blocklist), [remove a user from the blocklist](/document/android/user_relationship.html#remove-a-user-from-the-blocklist), and [retrieve the blocklist from the server and local database](/document/android/user_relationship.html#retrieve-the-blocklist-from-the-server).











