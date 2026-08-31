# Global User Mute

## Feature overview

As regulatory mechanisms mature and app oversight increases, security and compliance have become essential to apps.

To strengthen app management, EasyIM provides global mute at the user ID level. Admins can globally mute users who violate rules, helping maintain a healthy content environment in the app.

You can globally mute one-to-one, group, and chat room messages for a user ID. After being muted, the user cannot call client APIs to send messages in the corresponding one-to-one chats, chat groups, or chat rooms. When the mute expires, the server automatically unmutes the user and restores their permission to send messages.

This feature can be widely used in real-time interactive apps. For example, if a user frequently sends prohibited advertisements to multiple chat rooms, you can globally mute the user in chat rooms for 15 days. If a user posts prohibited political content, you can globally mute the user permanently and unmute them after a successful appeal.

## Feature activation

Before using global user mute, activate it in the EasyIM Console. For details, see [EasyIM Console documentation](/product/console/basic_user.html#global-user-mute).

## API list

- [Set global mute for a user](user_global_mute_set.html)
- [Query the global mute settings of a user](user_global_mute_query_single.html)
- [Query all globally muted users in an app](user_global_mute_query_all.html)
