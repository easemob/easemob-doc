# Group @ Messages

## Feature overview

Group @ messages notify specified group members or all group members in a group chat. When sending a group message, the sender can include @ information in the message extension. After receiving the message, recipients can use the extension to determine whether it @ mentions the current user or all members.

:::tip
Group @ messages are generally used with group text messages. Emojis can be sent as part of the text message content.
:::

For example, the UI can be implemented as follows:

1. Enter `@` in the input box and select the group members to mention.
2. After selecting the members, return to the chat page, continue editing the message, and send it.
3. When a message mentions the current user, display a corresponding prompt in the conversation list, such as “Somebody@You”.
4. Open the conversation page to view the message.

The following image shows an example UI:

![img](/images/product/solution_common/group_mention/group_@_web.png)

## Prerequisite

Before using group @ messages, complete the following preparations:

- Initialize the SDK and log in successfully. For details, see [Quickstart](quickstart.html).
- Ensure that the current user has joined the target chat group.
- To @ mention specified group members, obtain their user IDs.

## Implementation

Sending an @ message in a chat group is largely the same as sending a regular group message, except that the sender must include the mentioned users' IDs in the message extension. After receiving the message, group members can use the extension to determine whether the current user was mentioned and display a corresponding UI prompt.

Implement an @ message as follows:

1. The sender adds the mentioned users' IDs to the message extension and sends the message to the chat group.
2. After receiving the message, a group member checks whether the corresponding extension exists. If it does, the member then checks whether the current user's ID is included.
3. If included, the current user was mentioned and the UI can display a prompt such as “[Somebody@You]”. Otherwise, no special prompt is required.

The SDK identifies group @ information through `ext.em_at_list`. The rules for `em_at_list` values are as follows:

| Value | Type | Description |
| :--- | :--- | :--- |
| `["userId1", "userId2"]` | String[] | @ mentions one or more specified group members. Each array element is the user ID of a mentioned user. |
| `"all"` | String | @ mentions all group members. |

:::tip
Group @ messages apply only to group messages whose `conversationType` is `groupChat`.
:::

### Send group @ messages

When creating a group message, set the @ information through `ext.em_at_list`, and then call `client.chatManager.sendMessage` to send the message.

#### @ mention specified group members

Example code:

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'groupId',
  conversationType: 'groupChat',
  content: '@user1 @user2 Please check this message',
  ext: {
    em_at_list: ['user1', 'user2'],
  },
});

await client.chatManager.sendMessage(message);
```

#### @ mention all group members

Example code:

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'groupId',
  conversationType: 'groupChat',
  content: '@All Please check this message',
  ext: {
    em_at_list: 'all',
  },
});

await client.chatManager.sendMessage(message);
```

The parameters are as follows:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | String | Chat group ID. |
| `conversationType` | String | Conversation type. Set it to `groupChat` for group @ messages. |
| `content` | String | Text message content. The @ text is displayed by the client; the actual @ relationship is determined by `ext.em_at_list`. |
| `ext.em_at_list` | String[] \| String | Group @ information. Pass an array of user IDs to mention specified members, or `all` to mention all group members. |

### Receive group @ messages

After receiving a group message, read the @ information from `ext.em_at_list` in the message object and determine whether it mentions the current user.

Example code:

```typescript
client.addEventHandler('group-at-message', {
  onTextMessage: message => {
    if (message.conversationType !== 'groupChat') {
      return;
    }

    const atList = message.ext?.em_at_list;
    const currentUserId = client.user;

    if (atList === 'all') {
      console.log('Received a group message mentioning all members：', message);
      return;
    }

    if (Array.isArray(atList) && atList.includes(currentUserId)) {
      console.log('Received a group message mentioning the current user：', message);
    }
  },
});
```

Depending on your business requirements, the client can display prompts such as “Someone @ mentioned me” or “@ everyone” in the conversation list or message list.

### Relationship with offline push

If the recipient's conversation [push notification mode](/document/web/push/push_notification_mode_dnd.html#push-notification-modes) is set to `AT` (receive only @ message notifications), the server uses `ext.em_at_list` to determine whether the group message triggers offline push. Therefore, correctly set `em_at_list` when sending a group @ message.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextMessage`](#send-group-messages) | `ChatManager` | Create a text message and set group @ information through `ext.em_at_list`. |
| [`sendMessage`](#send-group-messages) | `ChatManager` | Send a group message containing group @ information. |
