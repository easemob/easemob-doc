## v1.4.0

v1.4.0 was released on XXXX, 2026.

## New Features

- Supported reading server-side message read and delivery statuses when retrieving roaming messages from the server. This feature applies only to one-to-one chats and is disabled by default. To enable it, please contact [technical support](mailto:support@agora.io).

加入聊天室 joinChatRoom 成功的回调新增 info 字段，包含如下信息，即用户加入聊天室后会收到如下信息：
聊天室创建时间：createTimestamp。
用户是否开启全员禁言：isAllMembersMuted。
用户是否在白名单中：isInAllowlist。
当前聊天室成员数：memberCount。
用户禁言到期时间：muteExpireTimestamp。


- Supported sending and receiving GIF image messages.
- Supported setting, updating, and retrieving group avatars.
- Supported retrieving roaming messages sent by specific group members.
- Supported retrieving messages sent by specific members within a local group conversation.
- Supported retrieving a group member list that includes each member's role and join time.
- Allowed group owners, chat room owners, and administrators to recall messages sent by other users.




群组成员进出事件支持一次通知多个成员进出群组。调整前，SDK 会为每个加入/退出的成员单独回调一条事件。
新增群成员进出事件 membersPresence 和 membersAbsence。原事件 memberPresence 和 membersAbsence 仍有效。

1. 支持 自定义设备平台。
2. 支持获取 群组/聊天室成员列表 时，列明成员的用户 ID 和角色。


## Improvements

- Supported modifying various message types via the message modification API `modifyMessage`:
  - Text and custom messages: Modifying both the message body and extensions (`ext`).
  - File, video, voice, image, location, and combined messages: Modifying extensions (`ext`) only.
  - Command messages: Not supported.
- Optimized the reconnection logic to automatically switch reconnection addresses by default.

- Adjusted the trigger threshold for the `onTokenWillExpire` event; the notification is now triggered when 80% of the token's validity period has elapsed (previously 50%).

1. 聊天室公告修改事件中增加公告内容：updateAnnouncement 事件中增加 announcement 字段，表示更新的公告。
2.新增两个错误码：
WEBIM_USER_ALREADY_LOGIN 208：用户已登录。单设备登录时，若调用 open 方法用户已经登录，会提示该错误。
MESSAGE_SEND_TIMEOUT 512：发送消息超时。例如，发消息时连接断开，会提示该错误。

3. 调整了登录方法的 open().then 与连接成功事件 onConnected 的触发时机。优化后，调用登录方法 open 后，先触发连接成功与否的事件 onConnected 或 onDisconnected，然后再触发登录 open().then 或者 open().catch，以确保连接完全建立后再进行后续处理。之前版本为调用登录方法，先触发登录回调，然后触发连接事件，导致需要等待连接成功事件 onConnected 触发后才能发送消息。同时，优化后，鉴权失败等登录错误会在 open.catch 中抛出。

4. 聊天室禁言回调 muteMember 新增 muteTimestamp 参数，表示禁言过期时间。
5.  群组/聊天室禁言事件 muteMember 新增 userId 字段，表示被禁言的成员。
6. SDK 的 message 对象中新增 parseDownloadResponse、download 方法。目前，SDK 的 utils 对象和 message 对象中均包含 parseDownloadResponse、download 方法。
7. 消息修改事件 onModifiedMessage 中增加消息 ext 字段。添加该字段后，修改消息后，接收方会收到发送方修改的扩展信息。
8.原创建群组方法 createGroup 方法废弃，使用 createGroupVNext 方法代替。

## Issues Fixed

1. 修复消息置顶事件 onMessagePinEvent 中的 conversationId 参数值错误的问题。
2. 修复偶现无法拉取消息的问题。