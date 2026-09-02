# Manage Chat Room Attributes

## Feature overview

A chat room is an instant messaging system that supports multi-user communication. Chat room attributes include basic attributes, such as the chat room name, description, and announcement, and custom attributes (key-value). If the basic attributes do not meet your business requirements, users can add custom attributes and synchronize them with all members. You can use custom attributes to store the type of a live-streaming chat room, role information and game status in games such as Werewolf, and manage and synchronize mic positions in a voice chat room. Chat room custom attributes are stored as key-value pairs, where both the key and value are strings. Attribute changes are synchronized with chat room members in real time.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Complete SDK initialization. For details, see [Quickstart](quickstart.html);
- Understand the EasyIM [limitations](/product/limitation.html);
- Understand the limits on the number of chat rooms. For details, see [Plan details](http://easyim.ai/pricing).

## Manage basic chat room attributes

### Retrieve chat room details

All chat room members can call `asyncFetchChatRoomFromServer` to retrieve chat room details, including the chat room ID, name, description, maximum number of members, owner, whether mute all is enabled, and the current user's role type in the chat room. The chat room announcement, admin list, member list, blocklist, and mute list must be retrieved by calling the corresponding APIs separately.

Example code:

```java
// Asynchronous method.
EMClient.getInstance()
        .chatroomManager()
        .asyncFetchChatRoomFromServer(
                chatRoomId,
                new EMValueCallBack<EMChatRoom>() {
                    @Override
                    public void onSuccess(EMChatRoom chatRoom) {
                        // The chat room details are retrieved successfully.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Failed to retrieve the chat room details.
                    }
                });
```

### Retrieve the chat room announcement

All chat room members can call the `asyncFetchChatRoomAnnouncement` method to retrieve the chat room announcement.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncFetchChatRoomAnnouncement(
        chatRoomId,
        new EMValueCallBack<String>() {
            @Override
            public void onSuccess(String announcement) {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### Update the chat room announcement

Only the chat room owner and admins can call the `asyncUpdateChatRoomAnnouncement` method to set and update the chat room announcement. The announcement cannot exceed 512 characters. After it is updated, the other chat room members receive the `onAnnouncementChanged` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncUpdateChatRoomAnnouncement(
        chatRoomId,
        announcement,
        new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }

            @Override
            public void onProgress(int progress, String status) {
            }
        });
```

### Change the chat room name

Only the chat room owner and admins can call the `asyncChangeChatRoomSubject` method to set and change the chat room name. The name cannot exceed 128 characters.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncChangeChatRoomSubject(
        chatRoomId,
        newSubject,
        new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom chatRoom) {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### Change the chat room description

Only the chat room owner and admins can call the `asyncChangeChatroomDescription` method to set and change the chat room description. The description cannot exceed 512 characters.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncChangeChatroomDescription(
        chatRoomId,
        newDescription,
        new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom chatRoom) {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

## Manage chat room custom attributes (key-value)

### Retrieve specified chat room custom attributes

All chat room members can call the `asyncFetchChatroomAttributesFromServer` method to retrieve specified custom attributes of a chat room.

Example code:

```java
// Asynchronous method.
// `keyList` is the list of keys to retrieve. Pass `null` to retrieve all attributes.
EMClient.getInstance().chatroomManager().asyncFetchChatroomAttributesFromServer(
    conversationId, 
    keyList, 
    new EMValueCallBack<Map<String, String>>() {
        @Override
        public void onSuccess(Map<String, String> value) {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
});
```

### Retrieve all chat room custom attributes

Chat room members can call the `asyncFetchChatRoomAllAttributesFromServer` method to retrieve all custom attributes of a chat room.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncFetchChatRoomAllAttributesFromServer(
    conversationId, 
    new EMValueCallBack<Map<String, String>>() {
        @Override
        public void onSuccess(Map<String, String> value) {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
});
```

### Set a single chat room custom attribute

Chat room members can call the `asyncSetChatroomAttribute` method to set or update a single chat room custom attribute. This method can add only a new custom attribute field or update an existing attribute set by the current user. After the attribute is set, the other chat room members receive the `onAttributesUpdate` callback.

Example code:

```java
// Asynchronous method.
// `autoDelete` specifies whether to delete the attribute automatically upon exit. The default is `true`. 
EMClient.getInstance().chatroomManager().asyncSetChatroomAttribute(
    conversationId,
    attributeKey,
    attributeValue,
    autoDelete, 
    new EMCallBack() {
        @Override
        public void onSuccess() {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
});
```

### Force-set a single chat room custom attribute

To set or update a single custom attribute regardless of whether it was set by you or another chat room member, call the `asyncSetChatroomAttributeForced` method. After the attribute is set, the other chat room members receive the `onAttributesUpdate` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncSetChatroomAttributeForced(
    conversationId,
    attributeKey,
    attributeValue,
    // Whether to delete the attribute automatically upon exit. The default is `true`.
    autoDelete, 
    new EMCallBack() {
        @Override
        public void onSuccess() {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
});
```

### Set multiple chat room custom attributes

Chat room members can call the `asyncSetChatroomAttributes` method to set or update multiple chat room custom attributes. This method can add only new attribute fields or update fields previously added by the current user. After the attributes are set, the other chat room members receive the `onAttributesUpdate` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncSetChatroomAttributes(
    conversationId, 
    // Attribute key-value pairs of the `Map<String,String>` type.
    attributeMap, 
    // Whether to delete the attributes automatically upon exit. The default is `true`.
    autoDelete, 
    new EMResultCallBack<Map<String, Integer>>() {
        @Override
        public void onResult(int code, Map<String, Integer> value) {
            if (code == EMError.EM_NO_ERROR) { // A code value of EMError.EM_NO_ERROR returned by onResult indicates that the custom attributes are added successfully.

            }else { // A code value other than EMError.EM_NO_ERROR returned by onResult indicates that some custom attributes failed to be added because they exceeded the length limit or for other reasons.

            }
        }
});
```

### Force-set multiple chat room custom attributes

To set multiple custom attributes, including overwriting attributes set by other chat room members, call the `asyncSetChatroomAttributesForced` method. After the attributes are set, the other chat room members receive the `onAttributesUpdate` callback.

Example code:

```java
// Asynchronous method.
// `autoDelete` specifies whether to delete the attributes automatically upon exit. The default is `true`.
EMClient.getInstance().chatroomManager().asyncSetChatroomAttributesForced(
    conversationId, 
    attributeMap, 
    autoDelete, 
    new EMResultCallBack<Map<String, Integer>>() {
        @Override
        public void onResult(int code, Map<String, Integer> value) {
            if (code == EMError.EM_NO_ERROR) { // A code value of EMError.EM_NO_ERROR returned by onResult indicates that the custom attributes are added successfully.

            }else { // A code value other than EMError.EM_NO_ERROR returned by onResult indicates that some custom attributes failed to be added because they exceeded the length limit or for other reasons.

            }
        }
});
```

### Delete a single chat room custom attribute

Chat room members can call the `asyncRemoveChatRoomAttributeFromServer` method to delete a single chat room custom attribute. This method can delete only a custom attribute set by the current user. After the attribute is deleted, the other chat room members receive the `onAttributesRemoved` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributeFromServer(
    conversationId,
    key, 
    new EMCallBack() {
        @Override
        public void onSuccess() {
        }

        @Override
        public void onError(int code, String error) {
        }
});
```

### Force-delete a single chat room custom attribute

To delete a single custom attribute regardless of whether it was set by you or another chat room member, call the `asyncRemoveChatRoomAttributeFromServerForced` method. After the attribute is deleted, the other chat room members receive the `onAttributesRemoved` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributeFromServerForced(
    conversationId,
    key, 
    new EMCallBack() {
        @Override
        public void onSuccess() {
        }

        @Override
        public void onError(int code, String error) {
        }
});
```

### Delete multiple chat room custom attributes

Chat room members can call the `asyncRemoveChatRoomAttributesFromServer` method to delete multiple chat room custom attributes. This method can delete only custom attributes set by the current user. After the attributes are deleted, the other chat room members receive the `onAttributesRemoved` callback.

Example code:

```java
// Asynchronous method.
// `keyList` is the list of attribute keys to delete and cannot be empty. The list is of the `List<String>` type.
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributesFromServer(
    conversationId,
    keyList,
    new EMResultCallBack<Map<String, Integer>>() {
        @Override
        public void onResult(int code, Map<String, Integer> value) {
            // If code is EMError.EM_NO_ERROR, all attributes are deleted successfully;
            // value contains the keys of attributes that failed to be deleted and their corresponding error codes.
        }
    });
```

### Force-delete multiple chat room custom attributes

To delete multiple custom attributes, including attributes set by other chat room members, call the `asyncRemoveChatRoomAttributesFromServerForced` method. After the attributes are deleted, the other chat room members receive the `onAttributesRemoved` callback.

Example code:

```java
// Asynchronous method.
// `keyList` is the list of attribute keys to delete and cannot be empty. The list is of the `List<String>` type.
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributesFromServerForced(
    conversationId,
    keyList, 
    new EMResultCallBack<Map<String, Integer>>() {
        @Override
        public void onResult(int code,Map<String, Integer> value) {

        }
});
```

## Monitor chat room events

For details, see [Monitor chat room events](room_manage.html#monitor-chat-room-events).

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncFetchChatRoomFromServer`](#retrieve-chat-room-details) | `EMChatRoomManager` | Asynchronously retrieve chat room details from the server. |
| [`asyncFetchChatRoomAnnouncement`](#retrieve-the-chat-room-announcement) | `EMChatRoomManager` | Asynchronously retrieve the chat room announcement. |
| [`asyncUpdateChatRoomAnnouncement`](#update-the-chat-room-announcement) | `EMChatRoomManager` | Asynchronously update the chat room announcement. |
| [`asyncChangeChatRoomSubject`](#change-the-chat-room-name) | `EMChatRoomManager` | Asynchronously change the chat room name. |
| [`asyncChangeChatroomDescription`](#change-the-chat-room-description) | `EMChatRoomManager` | Asynchronously change the chat room description. |
| [`asyncFetchChatroomAttributesFromServer`](#retrieve-specified-chat-room-custom-attributes) | `EMChatRoomManager` | Retrieve specified custom attributes. |
| [`asyncFetchChatRoomAllAttributesFromServer`](#retrieve-all-chat-room-custom-attributes) | `EMChatRoomManager` | Retrieve all custom attributes. |
| [`asyncSetChatroomAttribute`](#set-a-single-chat-room-custom-attribute) | `EMChatRoomManager` | Set or update a single custom attribute. |
| [`asyncSetChatroomAttributes`](#set-multiple-chat-room-custom-attributes) | `EMChatRoomManager` | Set or update multiple custom attributes. |
| [`asyncRemoveChatRoomAttributeFromServer`](#delete-a-single-chat-room-custom-attribute) | `EMChatRoomManager` | Delete a single custom attribute. |
| [`asyncRemoveChatRoomAttributesFromServer`](#delete-multiple-chat-room-custom-attributes) | `EMChatRoomManager` | Delete multiple custom attributes. |



