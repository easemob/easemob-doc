---
title: RESTful API Call Frequency Limits
show_content_moderation: false
---

# RESTful API Call Frequency Limits

<Toc />

## Feature overview

### Calculating API call frequency limits

Unless otherwise specified for an API, the default API call frequency limit is 100 calls/second. You can view the call frequency limit for each API by module.

In EasyIM, most client APIs are implemented through their corresponding RESTful APIs.
- A RESTful API marked with an asterisk (*) in the following tables has no corresponding client API. Therefore, its call frequency depends only on calls to that RESTful API. If the call frequency reaches the limit, contact the EasyIM business manager to request a higher limit.
- For all other APIs, the call frequency is the sum of calls to the RESTful API and its corresponding client API. If the call frequency reaches the limit, check whether the client API is being called too frequently. To request a higher call frequency limit, contact the EasyIM business manager.

### API call frequency limit period

The API rate-limit period is calculated in UTC, from 00:00:00 on the current day to 00:00:00 on the following day. In Beijing time, this corresponds to 08:00:00 on the current day to 08:00:00 on the following day.

### API call frequency add-on packages

The following tables list the server-side APIs whose call frequency limits can be adjusted for EasyIM Professional and Flagship plans, together with the size of each add-on package. The Free plan does not support these adjustments.

The size of one add-on package is the amount by which the frequency is increased per adjustment. For example, the default call frequency limit of the file upload API is 100 calls/second/App Key, and one add-on package provides 100 calls/second. After purchasing one add-on package, the API call frequency limit increases to 200 calls/second/App Key.

Each add-on package costs CNY 200/month in China and CNY 400/month outside China.

## Message management

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| * Send One-to-One Messages                 | POST   | /{org_name}/{app_name}/messages/users                | For a single app, this REST API has the following three limits:<br/> - 100 calls/second/App Key <br/> - 6000 messages/minute  <br/> - 600 users/request. Sending a message to 600 users in one request counts as 600 messages.  | 12000 messages/minute    |  
| * Send Group Messages                 | POST   | /{org_name}/{app_name}/messages/chatgroups           | For a single app, this REST API has the following three limits:<br/> - 20 messages/second/App Key   <br/> - 20 calls/second <br/> -  3 chat groups/request   | 50 messages/second   |  
| * Send Targeted Messages                 | POST   | /{org_name}/{app_name}/messages/chatgroups/users           | 100 messages/second/App Key   | 100 calls/second    |  
| * Send Chat Room Messages               | POST   | /{org_name}/{app_name}/messages/chatrooms            | For a single app, this REST API has the following three limits:<br/> - 100 messages/second  <br/> - 100 calls/second   <br/> -  10 chat rooms/request   | 100 messages/second    |  
| * Send a Broadcast Message to All App Users | POST | /{org_name}/{app_name}/messages/broadcast | <br/> - Every 30 minutes, 1 call is allowed. This limit cannot be increased.<br/> - 3 calls/day. Contact the EasyIM business manager to request a higher limit.<br/> - Messages can be sent to up to 1000 users/second. This limit cannot be increased. |          |  
| * Send a Broadcast Message to Online App Users | POST | /{org_name}/{app_name}/messages/users/broadcast | 1 call/minute and 50 calls/day. Contact the EasyIM business manager to request a higher limit. |          |  
| * Send One-to-One Stream Messages                 | POST   | /{org_name}/{app_name}/stream_message/user           | 100 messages/second/App Key   | ——   |  
| * Send Group Chat Stream Messages                 | POST   | /{org_name}/{app_name}/stream_message/chatgroup           | 100 messages/second/App Key   | ——   |  
| * Send a Global Broadcast Message to Chat Rooms | POST | /{org_name}/{app_name}/messages/chatrooms/broadcast | 10 calls/minute and 100 broadcast messages/day. | 100calls/day    |  
| Upload a File  |    POST  | /{org_name}/{app_name}/chatfiles       | 100 calls/second/App Key                                                 |  100 calls/second   |  
| Download a File      |  GET     | /{org_name}/{app_name}/chatfiles/{file_uuid}       | 100 calls/second/App Key       | 100 calls/second    |  
| * Retrieve a Historical Message File   |  GET     | /{org_name}/{app_name}/chatmessages/${time}          | 10 calls/minute/App Key  | 20 calls/minute    |  
| * Set the Storage Method for Specified Message Attachments   |  POST     | /{org_name}/{app_name}/users/{username}/chatfiles/lifetime          | 100 calls/second/App Key     |          |  
| * Recall a Message    |    POST  | /{org_name}/{app_name}/messages/recall        | 100 calls/second/App Key   | 100 calls/second    |  
| * Recall Messages in Batches    |    POST  | /{org_name}/{app_name}/messages/batch_recall        | 100 calls/second/App Key  | 100 calls/second    |  
| Delete a Conversation for One User on the Server Side   |    DELETE    | /{org_name}/{app_name}/users/{userName}/user_channel          | 5 calls/minute/single user ID, 100 calls/second/App Key   | 100 calls/second    |  
| Add a Reaction         | POST   | /{org_name}/{app_name}/reaction/user/{userId}   | 100 calls/second/App Key | 50 calls/second    |  
| Retrieve Reactions by Message ID     | GET    | /{org_name}/{app_name}/reaction/user/{userId}  | 100 calls/second/App Key  | 25 calls/second    |  
| Delete a Reaction     | DELETE | /{org_name}/{app_name}/reaction/user/{userId} | 100 calls/second/App Key  | 50 calls/second    |  
| Retrieve Reaction Information by Message ID and Emoji ID | GET    | /{org_name}/{app_name}/reaction/user/{userId}/detail | 100 calls/second/App Key  | 25 calls/second    |  
| Edit a Message | PUT  | /{org_name}/{app_name}/messages/rewrite/{msg_id} | 100 calls/second/App Key  | 50 messages/second    |  
| Delete One-to-One Chat Roaming Messages for One User by Message ID  | DELETE    | /{org_name}/{app_name}/rest/message/roaming/chat/user/{userId}?userId={userId}&msgIdList={msgIdList}    | 100 calls/second/App Key   | 50 calls/second    |  
| Delete Group Chat Roaming Messages for One User by Message ID  | DELETE    | /{org_name}/{app_name}/rest/message/roaming/group/user/{userId}?groupId={groupId}&msgIdList={msgIdList}   | 100 calls/second/App Key   |          |  
| Delete All Roaming Messages for One User | POST  | /{org_name}/{app_name}/rest/message/roaming/user/{userId}/delete/all | 100 calls/second/App Key  | 100 calls/second    |  
| Delete One-to-One Chat Roaming Messages up to a Specific Time for One User | POST  | /{org_name}/{app_name}/rest/message/roaming/chat/user/{userId}/time?userId={userId}&delTime={delTime} | 100 calls/second/App Key  | 50 calls/second    |  
| Delete Group or Chat Room Roaming Messages up to a Specific Time for One User | POST  | /{org_name}/{app_name}/rest/message/roaming/group/user/{userId}/time?groupId={groupId}&delTime={delTime} | 100 calls/second/App Key  | 50 calls/second    |  
| Import One-to-One Chat Messages | POST  | /{org_name}/{app_name}/messages/users/import | 100 messages/second/App Key    | 100 calls/second    |  

<!--
| Translate Message Content | POST  | /{org_name}/{app_name}/translate | 100 calls/second/App Key  | 50 calls/second    |  
-->
<!--
| Retrieve the Translation Language List | GET  | /{org_name}/{app_name}/translate/support/language | 100 calls/second/App Key  | 50 calls/second    | 
-->
<!--
| Detect the Source Language of Text | POST  | /{org_name}/{app_name}/translate/detect | 100 calls/second/App Key  | 50 calls/second    |   
-->

## Chat groups

### Chat group management

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Retrieve Chat Groups in an App by Page  |  GET     | /{org_name}/{app_name}/chatgroups?limit={N}&cursor={cursor}  | 100 calls/second/App Key   |  50 calls/second   |  
| Retrieve All Chat Groups Joined by a User   |  GET         | /{org_name}/{app_name}/chatgroups/user/{username}?pagesize={}&pagenum={}        | 50 calls/second/App Key   | 50 calls/second    |  
| Check Whether a User Has Joined a Chat Group | POST  | /{org_name}/{app_name}/chatgroups/{group_id}/user/{user_id}/is_joined | 100 calls/second/App Key | 100 calls/second    |  
| Retrieve Chat Group Details        |  GET        | /{org_name}/{app_name}/chatgroups/{group_ids}           | 100 calls/second/App Key  | 100 calls/second    |  
| Create a Chat Group  |    POST      | /{org_name}/{app_name}/chatgroups                  | 100 calls/second/App Key   | 100 calls/second    |  
| Ban a Chat Group  |    POST      | /{org_name}/{app_name}/chatgroups/{group_id}/disable                  | 100 calls/second/App Key   |          |  
| Unban a Chat Group  |    POST      | /{org_name}/{app_name}/chatgroups/{group_id}/enable                  | 100 calls/second/App Key   |          |  
| Modify Chat Group Information   |    PUT         | /{org_name}/{app_name}/chatgroups/{group_id}             | 100 calls/second/App Key   | 100 calls/second    |  
| Destroy a Chat Group |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}                    | 100 calls/second/App Key   | 50 calls/second    |  
| Retrieve the Chat Group Announcement     |  GET     | /{org_name}/{app_name}/chatgroups/{group_id}/announcement         | 100 calls/second/App Key     | 100 calls/second    |  
| Modify the Chat Group Announcement  |    POST| /{org_name}/{app_name}/chatgroups/{group_id}/announcement          | 100 calls/second/App Key   | 100 calls/second    |  
| Retrieve Chat Group Shared Files by Page   |  GET     | /{org_name}/{app_name}/chatgroups/{group_id}/share_files?pagenum=1&pagesize=10        | 100 calls/second/App Key    | 100 calls/second    |  
| Upload a Chat Group Shared File  |    POST  | /{org_name}/{app_name}/chatgroups/{group_id}/share_files       | 100 calls/second/App Key    |  100 calls/second   |  
| Download a Chat Group Shared File    |  GET   | /{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}   | 100 calls/second/App Key    |  100 calls/second   |  
| Delete a Chat Group Shared File   |    DELETE   | /{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}     | 100 calls/second/App Key   | 100 calls/second    |  

### Chat group member management

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Retrieve Chat Group Members by Page  |  GET     | /{org_name}/{app_name}/chatgroups/{group_id}/users       | 100 calls/second/App Key     |  100 calls/second   |  
| Add a Chat Group Member     |    POST | /{org_name}/{app_name}/chatgroups/{group_id}/users/{username}?need_notify=false    | 100 calls/second/App Key      | 50 calls/second    |  
| Add Chat Group Members in Batches    |    POST   | /{org_name}/{app_name}/chatgroups/{group_id}/users?need_notify=false           | 100 calls/second/App Key     | 50 calls/second    |  
| Remove a Chat Group Member     |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}/users/{username}?need_notify=false    | 100 calls/second/App Key    |          |  
| Remove Chat Group Members in Batches    |    DELETE     | /{org_name}/{app_name}/chatgroups/{group_id}/users/{usernames}?need_notify=false    | 100 calls/second/App Key   | 50 calls/second    |  
| Set Custom Attributes of a Chat Group Member    |  PUT       | /{org_name}/{app_name}/metadata/chatgroup/{group_id}/user/{username}              | 100 calls/second/App Key   | 100 calls/second    |  
| Set Custom Attributes of Chat Group Members in Batches    |  PUT       | /{org_name}/{app_name}/metadata/chatgroup/{group_id}/users/batch  | 100 calls/second/App Key  |          |  
| Retrieve All Custom Attributes of a Chat Group Member    |  GET       | /{org_name}/{app_name}/metadata/chatgroup/{group_id}/user/{username}            | 100 calls/second/App Key   | 100 calls/second    |  
| Retrieve Custom Attributes of Chat Group Members by Attribute Key    |  POST       | /{org_name}/{app_name}/metadata/chatgroup/{group_id}/get              | 100 calls/second/App Key     | 100 calls/second    |  
| Retrieve the Chat Group Admin List    |  GET       | /{org_name}/{app_name}/chatgroups/{group_id}/admin              | 100 calls/second/App Key   | 100 calls/second    |  
| Add a Chat Group Admin     |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/admin              | 100 calls/second/App Key  | 100 calls/second    |  
| Remove a Chat Group Admin     |    DELETE  | /{org_name}/{app_name}/chatgroups/{group_id}/admin/{oldadmin}    | 100 calls/second/App Key  | 100 calls/second    |  
| Transfer Chat Group Ownership       |    PUT | /{org_name}/{app_name}/chatgroups/{group_id}                     | 100 calls/second/App Key   |          |  
| Retrieve the Group Blocklist    |    GET   | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users       | 100 calls/second/App Key    | 50 calls/second    |  
| Add a User to the Group Blocklist   |    POST      | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{username}    | 100 calls/second/App Key | 100 calls/second    |  
| Add Users to the Group Blocklist in Batches   |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users       | 100 calls/second/App Key | 50 calls/second    |  
| Remove a User from the Group Blocklist   |    DELETE  | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{username}    | 100 calls/second/App Key  | 50 calls/second    |  
| Remove Users from the Group Blocklist in Batches  |    DELETE  | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{usernames}    | 100 calls/second/App Key   | 50 calls/second    |  
| Retrieve the Chat Group Allowlist  |    GET | /{org_name}/{app_name}/chatgroups/{group_id}/white/users        | 100 calls/second/App Key         | 100 calls/second   |  
| Add a User to the Chat Group Allowlist |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/white/users/{username}    | 100 calls/second/App Key  | 100 calls/second    |  
| Add Users to the Chat Group Allowlist in Batches|    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users       | 100 calls/second/App Key  | 50 calls/second    |  
| Remove a User from the Chat Group Allowlist |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}/white/users/{username}    | 100 calls/second/App Key    | 100 calls/second    |  
| Retrieve the Chat Group Mute List |    GET    | /{org_name}/{app_name}/chatgroups/{group_id}/mute              | 100 calls/second/App Key    | 100 calls/second    |  
| Mute a Chat Group Member    |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/mute               | 100 calls/second/App Key      | 100 calls/second    |  
| Mute All Chat Group Members    |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/ban                | 100 calls/second/App Key  | 100 calls/second    |  
| Unmute Chat Group Members   |    DELETE   | /{org_name}/{app_name}/chatgroups/{group_id}/mute/{member1}(,{member2},…)    | 100 calls/second/App Key    |  100 calls/second   |  
| Unmute All Chat Group Members |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}/ban                | 100 calls/second/App Key     | 100 calls/second    |  

### Message thread management

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Retrieve Message Threads in an App by Page  | GET  | /{org_name}/{app_name}/thread | 100 calls/second/App Key   |          |  
| Retrieve All Message Threads Joined by a User by Page  | GET     | /{org_name}/{app_name}/threads/user/{username}    | 100 calls/second/App Key   |          |  
| Retrieve All Message Threads Joined by a User in a Specified Chat Group by Page  | GET  | /{org_name}/{app_name}/threads/chatgroups/{group_id}/user/{username}    | 100 calls/second/App Key   |
| Create a Message Thread  | POST     | /{org_name}/{app_name}/thread    | 100 calls/second/App Key  |          |  
| Modify a Message Thread  | PUT     | /{org_name}/{app_name}/thread/{thread_id}    | 100 calls/second/App Key   |          |  
| Delete a Message Thread  | DELETE     | /{org_name}/{app_name}/thread/{thread_id}    | 100 calls/second/App Key   |          |  
| Retrieve the Message Thread Member List by Page  | GET     | /{org_name}/{app_name}/thread/{thread_id}/users    | 100 calls/second/App Key   |          |  
| Add Users to a Message Thread in Batches  | POST     | /{org_name}/{app_name}/thread/{thread_id}/users   | 100 calls/second/App Key   |          |  
| Remove Message Thread Members in Batches  | DELETE     | /{org_name}/{app_name}/threads/{thread_id}/users   | 100 calls/second/App Key  |          |  

## Chat rooms

### Chat room management

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Retrieve Chat Rooms in an App  |    GET   | /{org_name}/{app_name}/chatrooms?limit={N}&cursor={cursor}       | 50 calls/second/App Key          | 50 calls/second    |  
| Retrieve Chat Rooms Joined by a User |    GET       | /{org_name}/{app_name}/users/{username}/joined_chatrooms         | 50 calls/second/App Key             |  50 calls/second   |  
| Retrieve Chat Room Details     |    GET    | /{org_name}/{app_name}/chatrooms/{chatroom_id}       | 100 calls/second/App Key       | 50 calls/second    |  
| Create a Chat Room   |    POST   | /{org_name}/{app_name}/chatrooms                                 | 50 calls/second/App Key                                                  | 100 calls/second    |  
| Modify Chat Room Information |    PUT     | /{org_name}/{app_name}/chatrooms/{chatroom_id}                   | 100 calls/second/App Key                                                 |  100 calls/second   |  
| Transfer Chat Room Ownership          | PUT    | /{org_name}/{app_name}/chatrooms/{chatroom_id}              | 100 calls/second/App Key    |          |  
| Destroy a Chat Room  |  DELETE  | /{org_name}/{app_name}/chatrooms/{chatroom_id}                   | 100 calls/second/App Key     | 50 calls/second    |  
| Retrieve the Chat Room Announcement  |   GET  | /{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement      | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Modify the Chat Room Announcement   |    POST | /{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement      | 100 calls/second/App Key        | 100 calls/second    |  
| Retrieve Chat Room Custom Attributes | POST  | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id} | 100 calls/second/App Key       | 100 calls/second    |  
| Set Chat Room Custom Attributes | PUT  | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username} | 100 calls/second/App Key       |  25 calls/second   |  
| Force Set Chat Room Custom Attributes | PUT | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced | 100 calls/second/App Key        | 25 calls/second    |  
| Delete Chat Room Custom Attributes | DELETE  | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username} | 100 calls/second/App Key             | 25 calls/second    |  
| Force Delete Chat Room Custom Attributes | DELETE  | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced | 100 calls/second/App Key           | 25 calls/second    |  

### Chat room member management

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Retrieve Chat Room Members by Page   |   GET   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users          | 100 calls/second/App Key                                                 |  50 calls/second   |  
| Add a Chat Room Member    |    POST   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{username}  | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Add Chat Room Members in Batches    |    POST   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users           | 100 calls/second/App Key                                                 | 50 calls/second    |  
| Remove a Chat Room Member  |  DELETE   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{username}  | 100 calls/second/App Key                                                 |          |  
| Remove Chat Room Members in Batches |  DELETE   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{usernames}  | 100 calls/second/App Key                                                 | 50 calls/second    |  
| Retrieve the Chat Room Admin List    |   GET    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/admin          | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Add a Chat Room Admin  |    POST    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/admin          | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Remove a Chat Room Admin   |  DELETE    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/admin/{oldadmin}  | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Retrieve the Chat Room Blocklist    |   GET   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users   | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Add a User to the Chat Room Blocklist |    POST    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{username}  | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Add Users to the Chat Room Blocklist in Batches  |    POST     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users   | 100 calls/second/App Key                                                 | 50 calls/second    |  
| Remove a User from the Chat Room Blocklist   |  DELETE     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{username}  | 100 calls/second/App Key                                                 |          |  
| Remove Users from the Chat Room Blocklist in Batches   |  DELETE     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{usernames}  | 100 calls/second/App Key                                                 |  50 calls/second   |  
| Retrieve the Chat Room Allowlist   |   GET   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users   | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Add a User to the Chat Room Allowlist  |    POST     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users/{username}  | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Add Users to the Chat Room Allowlist in Batches   |    POST    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users    | 100 calls/second/App Key                                                 | 50 calls/second   |  
| Remove a User from the Chat Room Allowlist  |  DELETE       | /{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users/{username}  | 100 calls/second/App Key                                                 |  100 calls/second   |  
| Retrieve the Chat Room Mute List  |   GET   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/mute           | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Mute Chat Room Members   |    POST    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/mute           | 100 calls/second/App Key                                                 | 100 calls/second    |  
| Mute All Chat Room Members    |    POST  | /{org_name}/{app_name}/chatrooms/{chatroom_id}/ban            | 100 calls/second/App Key  | 100 calls/second    |  
| Unmute Chat Room Members   |  DELETE     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/mute/{member1}(,{member2},…)  | 100 calls/second/App Key      | 100 calls/second    |  
| Unmute All Chat Room Members    |  DELETE     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/ban            | 100 calls/second/App Key   | 100 calls/second    |  
| Mute Users by Chat Room User Tag    |  PUT     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/tag/mute    | 100 calls/second/App Key   |          |  
| Set a User's Chat Room Tags    |  PUT     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{username}/tag    | 100 calls/second/App Key   |          |  
| Retrieve a User's Chat Room Tags    |  GET     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{username}/tag    | 100 calls/second/App Key   |          |  
| Retrieve the Superadmin List   |   GET    | /{org_name}/{app_name}/chatrooms/super_admin                  | 100 calls/second/App Key  |  100 calls/second   |  
| Add a Chat Room Superadmin   |    POST    | /{org_name}/{app_name}/chatrooms/super_admin                  | 100 calls/second/App Key   | 100 calls/second    |  
| Remove a Superadmin    |  DELETE    | /{org_name}/{app_name}/chatrooms/super_admin/{superAdmin}     | 100 calls/second/App Key  | 100 calls/second    |  

## Users

### User management

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| * Obtain an App/User Token  | POST   | /{org_name}/{app_name}/token   | 300 calls/second/App Key          | Free    |  

The total default call frequency limit for the user management APIs and offline push-related APIs in the following two tables is 100 calls/second/App Key. The size of each add-on package is 50 calls/second.

| RESTful API |Method  | API URL|  
| :-------- | :----- | :---------------- | 
| Register a Single User  |  POST  | /{org_name}/{app_name}/users        |  
| * Register Users in Batches |  POST   | /{org_name}/{app_name}/users       |  
| Retrieve a Single User  |  GET | /{org_name}/{app_name}/users/{username}   |
| * Retrieve Users in Batches |  GET  | /{org_name}/{app_name}/users      |  
| * Delete a User |  DELETE  | /{org_name}/{app_name}/users/{username}         |  
| * Delete Users in Batches |  DELETE   | /{org_name}/{app_name}/users  | 30 calls/second/App Key   |  
| * Change a User's Password  |  POST | /{org_name}/{app_name}/users/{username}/password   |  
| * Retrieve User Presence  |  GET | /{org_name}/{app_name}/users/{username}/status   |  
| * Retrieve User Presence in Batches  |  POST    | /{org_name}/{app_name}/users/batch/status  |  
| * Retrieve the Offline Message Count       |  GET     | /{org_name}/{app_name}/users/{owner_username}/offline_msg_count    |
| * Retrieve the Status of an Offline Message    |  GET   | /{org_name}/{app_name}/users/{username}/offline_msg_status/{msg_id}   |  
| * Ban a User   |  POST     | /{org_name}/{app_name}/users/{username}/deactivate          |  
| * Unban a User    |  POST                    | /{org_name}/{app_name}/users/{username}/activate         |  
| * Force a User Offline         |  GET    | /{org_name}/{app_name}/users/{username}/disconnect    |  
| * Force a User Offline on a Specific Device | DELETE | /{org_name}/{app_name}/users/{username}/disconnect/{resourceId} |  
| * Retrieve the Online Login Device List for an Account    | GET  | /{org_name}/{app_name}/users/{username}/resources |  

| RESTful API |Method  | API URL|  
| :-------- | :----- | :---------------- |
| Bind and Unbind Push Information           | PUT  | /{org_name}/{app_name}/users/{userId}/push/binding |  
| Retrieve Push Binding Information for All Devices of the Current User    | GET  | /{org_name}/{app_name}/users/{userId}/push/binding |  
| Set the Nickname Displayed in Push Notifications | PUT  | /{org_name}/{app_name}/users/{userId} |
| Set the Push Notification Display Style | PUT  | /{org_name}/{app_name}/users/{userId} |

### User attributes

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Set User Attributes      | PUT     | /{org_name}/{app_name}/metadata/user/{username}            | 100 calls/second/App Key | 100 calls/second    |  
| Get User Attributes in Batches    | POST      | /{org_name}/{app_name}/metadata/user/get           | 100 calls/second/App Key    | 50 calls/second    |  
| Delete User Attributes   | DELETE     | /{org_name}/{app_name}/metadata/user/{username}      | 100 calls/second/App Key  | 100 calls/second    |  
| Retrieve All User Attributes of a Specified User/Retrieve the Total Size of User Attributes in an App    | GET     | <br/> - /{org_name}/{app_name}/metadata/user/{username} <br/> - /{org_name}/{app_name}/metadata/user/capacity      | 100 calls/second/App Key | 100 calls/second    |  

### Presence subscriptions

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Set User Presence Information  |  POST     | /{org_name}/{app_name}/users/{uid}/presence/{resource}/{status} | 50 calls/second/App Key  | 100 calls/second    |  
| Subscribe to Presence in Batches    |  POST      | /{org_name}/{app_name}/users/{uid}/presence/{expiry}         | 50 calls/second/App Key   | 50 calls/second    |  
| Retrieve Presence in Batches    |  POST   | /{org_name}/{app_name}/users/{uid}/presence                  | 50 calls/second/App Key | 50 calls/second    |  
| Retrieve the Number of Online Members in a Chat Group    |  GET   | /{org_name}/{app_name}/presence/online/{group_id}/type/{query_type}  | 100 calls/second/App Key |          |  
| Unsubscribe from the Presence of Multiple Users     |  DELETE           | /{org_name}/{app_name}/users/{uid}/presence                  | 50 calls/second/App Key    | 100 calls/second    |  
| Retrieve the Subscription List    |   GET       | /{org_name}/{app_name}/users/{uid}/presence/sublist?pageNum={pagenumber}&pageSize={pagesize} | 50 calls/second/App Key  | 100 calls/second    |  

### Global user mute

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| * Set Global Mute for a User  |  POST      | /{org_name}/{app_name}/mutes         | 100 calls/second/App Key  | 50 calls/second    |  
| * Query the Global Mute Settings of a User |   GET   | /{org_name}/{appName}/mutes/{username}  | 100 calls/second/App Key  |  100 calls/second   |  
| * Query All Globally Muted Users in an App  |   GET  | /{org_name}/{app_name}/mutes        | 100 calls/second/App Key  | 50 calls/second    |  

### User favorites

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Get User Favorites by Page      | GET  | /{org_name}/{app_name}/users/{username}/collections   | 100 calls/second/App Key |          |  
| Add a Favorite      | POST  | /{org_name}/{app_name}/users/{username}/collections   | 100 calls/second/App Key |          |  
| Add User Favorites in Batches      | POST  | /{org_name}/{app_name}/collections   | 100 calls/second/App Key |          |  
| Modify the Extension Information of a User Favorite   | PUT  | /{org_name}/{app_name}/users/{username}/collections/{collectionId}  | 100 calls/second/App Key |          |  
| Delete User Favorites   | DELETE | /{org_name}/{app_name}/users/{username}/collections  | 100 calls/second/App Key |          |  

### User relationship management

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Add a Friend   | POST   | /{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}    | 100 calls/second/App Key   | 100 calls/second    |  
| Check Friends   | POST   | /{org_name}/{app_name}/contacts/check    | 100 calls/second/App Key   | 50 calls/second    |  
| Remove a Friend    | DELETE | /{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}    | 100 calls/second/App Key                                                 |  100 calls/second   |  
| Delete All Friends    | DELETE | /{org_name}/{app_name}/contacts/users/{username}    | 100 calls/second/App Key                                                 |  50 calls/second   |  
| Set Friend Remarks | PUT | /{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username} | 100 calls/second/App Key |  |
| Retrieve the Friend List by Page    |  GET  | /{org_name}/{app_name}/user/{username}/contacts?limit={N}&cursor={cursor}&needReturnRemark={true/false}  | 100 calls/second/App Key   | 50 calls/second|  
| Retrieve the Friend List    |  GET  | /{org_name}/{app_name}/users/{owner_username}/contacts/users   | 100 calls/second/App Key   | 100 calls/second    |  
| * Import a Friend List    |  POST  | /{org_name}/{app_name}/users/{username}/contacts/import   | 100 calls/second/App Key   |      |  
| Retrieve the Blocklist     | GET   | /{org_name}/{app_name}/users/{owner_username}/blocks/users   | 50 calls/second/App Key                                                  | 100 calls/second    |  
| Check the Blocklist     | POST   | /{org_name}/{app_name}/blocks/check   | 100 calls/second/App Key                                                  | 50 calls/second    |  
| Add Users to the Blocklist    | POST  | /{org_name}/{app_name}/users/{owner_username}/blocks/users    | 50 calls/second/App Key                                                  | 100 calls/second    |  
| Remove a User from the Blocklist | DELETE  | /{org_name}/{app_name}/users/{owner_username}/blocks/users/{blocked_username}   | 50 calls/second/App Key                                                  | 100 calls/second    |  

## Offline push

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Configure Offline Push         | PUT  | /{org}/{app_name}/users/{userId}/notification/{chattype}/{key} | 100 calls/second/App Key          | The combined add-on package size for this API and the Retrieve Offline Push Settings API in the following row is 100 calls/second.    |  
| Retrieve Offline Push Settings     | GET  | /{org_name}/{app_name}/users/{userId}/notification/{chattype}/{key} | 100 calls/second/App Key  | The combined add-on package size for this API and the Configure Offline Push API in the preceding row is 100 calls/second.    |  
| Set Offline Push Nicknames in Batches     | PUT | /{org_name}/{app_name}/push/nickname | 100 calls/second/App Key  |          |  
| Set the Preferred Language for Push Notifications     | PUT  | /{org_name}/{app_name}/users/{userId}/notification/language | 100 calls/second/App Key          |          |  
| Retrieve the Preferred Language for Push Notifications | GET  | /{org_name}/{app_name}/users/{userId}/notification/language | 100 calls/second/App Key  |          |  
| Create an Offline Push Template          | POST  | /{org_name}/{app_name}/notification/template | 10 calls/second/App Key  |          |  
| Query an Offline Push Template          | GET  | /{org_name}/{app_name}/notification/template/{name} | 10 calls/second/App Key  |          |  
| Delete an Offline Push Template          | DELETE  | /{org_name}/{app_name}/notification/template/{name} | 10 calls/second/App Key  |          |  
| Set the Push Template Name for a Receiver   | PUT  | /{org_name}/{app_name}/users/{userId}/notification/template | 100 calls/second/App Key. |          |  

<!--
<HideSection :show="$frontmatter.show_content_moderation" :headings="['content-moderation']">

## Content moderation

### Proactive text moderation

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Proactive Text Moderation | POST | /{org_name}/{app_name}/moderation/txt/check  | 100 calls/second/App Key | 50 calls/second  |

### Keyword lists

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Create a Keyword List | POST | /{org_name}/{app_name}/moderation/text/list  | 100 calls/second/App Key | 50 calls/second  |
| Modify a Keyword List | PUT | /{org_name}/{app_name}/moderation/text/list/{list_id} | 100 calls/second/App Key | 50 calls/second  |
| Query Keyword Lists | POST | /{org_name}/{app_name}/moderation/text/list/search | 100 calls/second/App Key | 50 calls/second  |
| Delete a Keyword List | DELETE | /{org_name}/{app_name}/moderation/text/list/{list_id} | 100 calls/second/App Key | 50 calls/second  |
| Add Keywords  | POST | /{org_name}/{app_name}/moderation/text/list/{list_id}/word/batch | 100 calls/second/App Key | 50 calls/second  |
| Modify a Keyword | PUT | /{org_name}/{app_name}/moderation/text/list/{list_id}/word | 100 calls/second/App Key | 50 calls/second  |
| Query Keywords | POST | /{org_name}/{app_name}/moderation/text/list/{list_id}/word | 100 calls/second/App Key | 50 calls/second  |
| Delete a Keyword | DELETE | /{org_name}/{app_name}/moderation/text/list/(list_id)/word?wordId={word_id} | 100 calls/second/App Key | 50 calls/second  |
| Delete Keywords in Batches | DELETE | /{org_name}/{app_name}/moderation/text/list/(list_id)/word/batch | 100 calls/second/App Key | 50 calls/second  |

</HideSection>
-->

## Post-sending callbacks

| RESTful API |Method  | API URL| Maximum API call frequency (default) | Single add-on package size|
| :-------- | :----- | :---------------- | :--------------------- | :--------------------- |
| Query Callback Storage Details         | GET  | /{org_name}/{app_name}/callbacks/storage/info | 100 calls/second/App Key          | 50 calls/second  |
| Resend Stored Callback Information   | POST  | /{org_name}/{app_name}/callbacks/storage/retry | 100 calls/second/App Key  | 50 calls/second  |
