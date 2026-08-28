# Message Reactions

## Feature overview

EasyIM provides message reactions. Users can add or remove reactions on messages in one-to-one and group chats. Reactions visually express emotions. In group chats, reaction counts can also support lightweight voting, feedback collection, and other interactions.

The following figure shows examples of adding a Reaction, how Reactions appear in a group chat, and viewing the Reaction list.

![img](/images/android/reactions.png)

## Feature activation

Before using Reactions, activate the feature in [EasyIM Console](https://console.easyim.ai/user/login). For instructions, see the [EasyIM Console documentation](/product/console/basic_message_conversation.html#message-reactions).

## Limitations

- Reactions apply only to one-to-one and group chats. Chat rooms are not currently supported.
- For Reaction counting rules, storage duration, per-user addition limits, the number of Reactions allowed per message, and emoji ID requirements, see [Feature Limitations](limitation.html).

## Prerequisite

Before you begin, ensure that the following requirements are met:

1. Initialize the SDK. For details, see [Quickstart](quickstart.html).
2. Understand the EasyIM API [limitations](/product/limitation.html).
3. Activate the Reaction feature in [EasyIM Console](https://console.easyim.ai/user/login).

## Add a Reaction to a message

Call `asyncAddReaction` to add a Reaction to a message. For a one-to-one chat, the peer receives the `onReactionChanged` callback. For a group chat, all chat group members except the operator receive the callback. The callback information includes the conversation ID, message ID, current Reaction list for the message, and Reaction operation list. The operation list records the operator's user ID, the changed Reaction, and the operation type. Your app can use this information to update the Reactions displayed on the message in real time.

The same user can add the same Reaction to a message only once. If the user adds it repeatedly, the SDK returns error code `1301`. Your app can consistently handle this as "This Reaction has already been added."

The following is sample code:

```java
// Add a Reaction.
 EMClient.getInstance().chatManager().asyncAddReaction(message.getMsgId(), reaction, new EMCallBack() {
    @Override
    public void onSuccess() {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }

    @Override
    public void onProgress(int i, String s) {

    }
});

// Monitor Reaction updates.
EMMessageListener listener = new EMMessageListener() {
    ...
    @Override
    public void onReactionChanged(List<EMMessageReactionChange> messageReactionChangeList) {
        // Handle the Reaction update logic.
    }
    ...
};
// Register the message listener.
EMClient.getInstance().chatManager().addMessageListener(listener);
```

## Remove a Reaction from a message

Call `asyncRemoveReaction` to remove a Reaction that the current user added to a message. After removal succeeds, the peer in a one-to-one chat and all chat group members except the operator in a group chat receive the `onReactionChanged` callback. The callback information includes the conversation ID, message ID, current Reaction list for the message, and Reaction operation list. The operation list records the operator's user ID, the removed Reaction, and the operation type. Your app can use this information to update the Reactions displayed on the message in real time.

The party performing the removal can obtain the result through the `EMCallBack` of `asyncRemoveReaction` and update the current UI in the success callback.

The following is sample code:

```java
// Remove a Reaction.
EMClient.getInstance().chatManager().asyncRemoveReaction(message.getMsgId(), reaction, new EMCallBack() {
    @Override
    public void onSuccess() {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }

    @Override
    public void onProgress(int i, String s) {

    }
});

// Monitor Reaction updates.
EMMessageListener listener = new EMMessageListener() {
    ...
    @Override
    public void onReactionChanged(List<EMMessageReactionChange> messageReactionChangeList) {
        // Handle the Reaction update logic.
    }
    ...
};
// Register the message listener.
EMClient.getInstance().chatManager().addMessageListener(listener);
```

## Retrieve the Reaction list for messages

Call `asyncGetReactionList` to retrieve Reaction overviews for one or more specified messages from the server.

Each Reaction overview contains the Reaction content, the number of users who added it, and the user IDs of the first three users who added it. This user list is used only for overview display and does not represent all users. To retrieve the complete user list, call `asyncGetReactionDetail` with pagination. For messages already retrieved and cached, you can also read the Reaction list from the message through `EMMessage#getMessageReaction()`.

The following is sample code:

```java
// `chatType` supports only one-to-one chat (`EMMessage.ChatType.Chat`) and group chat (`EMMessage.ChatType.GroupChat`).
// In a group chat, also pass the corresponding `groupId`.
EMClient.getInstance().chatManager().asyncGetReactionList(msgIdList, EMMessage.ChatType.Chat, groupId, new EMValueCallBack<Map<String, List<EMMessageReaction>>>() {
    @Override
    public void onSuccess(Map<String, List<EMMessageReaction>> stringListMap) {

    }

    @Override
    public void onError(int i, String s) {

    }
});
```

## Retrieve Reaction details

Call `asyncGetReactionDetail` to retrieve details of a specified Reaction on a specified message from the server by page. The details include the Reaction content, the current number of users who added the Reaction, and the user IDs of all users who currently added it.
The API returns `EMCursorResult<EMMessageReaction>`, which contains the current page of data and a pagination cursor. If more data remains, use the cursor to query the next page.

```java
EMClient.getInstance().chatManager().asyncGetReactionDetail(mMsgId, emojiconId,
                pageCursor, 30, new EMValueCallBack<EMCursorResult<EMMessageReaction>>() {
    @Override
    public void onSuccess(EMCursorResult<EMMessageReaction> messageReactionCursorResult) {

    }

    @Override
    public void onError(int i, String s) {

    }
});
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncAddReaction`](#add-a-reaction-to-a-message) | `EMChatManager` | Asynchronously adds a message Reaction. |
| [`asyncRemoveReaction`](#remove-a-reaction-from-a-message) | `EMChatManager` | Asynchronously removes a message Reaction. |
| [`asyncGetReactionList`](#retrieve-the-reaction-list-for-messages) | `EMChatManager` | Asynchronously retrieves Reaction overviews for multiple messages. |
| [`asyncGetReactionDetail`](#retrieve-reaction-details) | `EMChatManager` | Asynchronously retrieves details of a specified Reaction by page. |
| [`getConversionID`](#add-a-reaction-to-a-message) | `EMMessageReactionChange` | Retrieves the conversation ID. |
| [`getMessageId`](#add-a-reaction-to-a-message) | `EMMessageReactionChange` | Retrieves the message ID. |
| [`getMessageReactionList`](#add-a-reaction-to-a-message) | `EMMessageReactionChange` | Retrieves the message Reaction list. |
| [`getOperations`](#add-a-reaction-to-a-message) | `EMMessageReactionChange` | Retrieves the Reaction operation list. |
