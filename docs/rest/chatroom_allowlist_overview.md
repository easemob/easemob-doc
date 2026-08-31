# Chat Room Allowlist Management

## Overview

EasyIM provides multiple APIs for managing the chat room allowlist, including retrieving users on the allowlist and adding users to or removing users from the allowlist.

Members on the chat room allowlist have the following characteristics:

- **Chat room owners and admins are added to the chat room allowlist by default.**
- **Messages they send in the chat room have high priority.** When message concurrency or the message sending frequency in a chat room is high, messages from allowlisted members are delivered first, but delivery is not guaranteed. Under high load, the server first discards low-priority messages. If the load remains high, the server also discards high-priority messages.
- **They are not removed from the chat room when offline:** Regular chat room members automatically leave the chat room after being offline for more than 2 minutes by default. Members on the chat room allowlist remain in the chat room when offline and are not removed.
- **They can still send chat room messages even when all members are muted.**
- **Members on the chat room mute list cannot send messages in the chat room even if they are added to the chat room allowlist.**

## API list

Chat room allowlist management includes the following APIs:

- [Retrieve the chat room allowlist](chatroom_allowlist_obtain.html)
- [Add users to the chat room allowlist in bulk](chatroom_allowlist_add_batch.html)
- [Add a user to the chat room allowlist](chatroom_allowlist_add_single.html)
- [Remove users from the chat room allowlist](chatroom_allowlist_remove.html)
