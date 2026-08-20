# Manage Chat Room Attributes

## Feature overview

A chat room is an instant messaging system that supports multi-user communication. Chat room attributes include basic attributes, such as the chat room name, description, and announcement, as well as custom attributes (key-value). If the basic attributes do not meet your business requirements, you can add custom attributes and synchronize them with all members. Custom attributes can store information such as the type of a live-streaming chat room, role information and game status in games such as Werewolf, and voice chat room seat information for management and synchronization. Chat room custom attributes are stored as key-value pairs. Both the key and value are strings, and attribute changes are synchronized with chat room members in real time.

## Prerequisite

Before you begin, ensure that the following requirements are met:

 - Initialize the SDK. See [Quickstart](quickstart.html).
 - Understand the EasyIM [usage restrictions](/product/limitation.html).
 - Understand the limit on the number of chat rooms. See [Plan details](https://www.easemob.com/pricing/im).

## Manage basic chat room attributes

### Retrieve chat room details

All chat room members can call `getChatroomSpecificationFromServerWithId` to retrieve chat room details, including the chat room name and description. Call the corresponding APIs separately to retrieve the chat room announcement, admin list, member list, blocklist, and mute list.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager getChatroomSpecificationFromServerWithId:@"chatroomId"
                                                                   completion:^(EMChatroom *chatroom, EMError *error) {
    if (!error) {
        NSString *subject = chatroom.subject;
        NSString *description = chatroom.description;
    }
}];
```

### Retrieve the chat room announcement

All chat room members can call `getChatroomAnnouncementWithId` to retrieve the chat room announcement.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager getChatroomAnnouncementWithId:@"chatroomId"
                                                        completion:^(NSString *announcement, EMError *error) {
    if (!error) {
        // announcement is the chat room announcement.
    }
}];
```

### Update the chat room announcement

Only the chat room owner and admins can call `updateChatroomAnnouncementWithId` to set or update the chat room announcement. The announcement can contain up to 512 characters. After the announcement is updated, other chat room members receive the `chatroomAnnouncementDidUpdate` callback.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager updateChatroomAnnouncementWithId:chatroomId
                                                           announcement:textString
                                                            completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the update result.
}];
```

### Change the chat room name

Only the chat room owner and admins can call `updateSubject` to set or change the chat room name. The name can contain up to 128 characters.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager updateSubject:textString
                                        forChatroom:chatroomId
                                         completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the update result.
}];
```

### Change the chat room description

Only the chat room owner and admins can call `updateDescription` to set or change the chat room description. The description can contain up to 512 characters.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager updateDescription:textString
                                            forChatroom:chatroomId
                                             completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the update result.
}];
```

## Manage custom chat room attributes (key-value)

### Retrieve specified custom chat room attributes

All chat room members can call `fetchChatroomAttributes` to retrieve specified custom chat room attributes.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager fetchChatroomAttributes:chatroomId
                                                        keys:@[@"123"]
                                                  completion:^(EMError *error, NSDictionary<NSString *, NSString *> *properties) {
    // properties contains the retrieved attributes.
}];
```

### Retrieve all custom chat room attributes

Chat room members can call `fetchChatroomAllAttributes` to retrieve all custom chat room attributes.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager fetchChatroomAllAttributes:chatroomId
                                                      completion:^(EMError *error, NSDictionary<NSString *, NSString *> *properties) {
    // properties contains the retrieved attributes.
}];
```

### Set a single custom chat room attribute

Chat room members can call `setChatroomAttribute` to set or update a single custom chat room attribute. This method can only add a new custom attribute or update an existing attribute set by the current user. After the attribute is set, other chat room members receive the `chatroomAttributesDidUpdated` callback.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager setChatroomAttribute:chatroomId
                                                       key:@"234"
                                                     value:@"123"
                                                autoDelete:YES
                                           completionBlock:^(EMError *error) {
    // Process the setting result.
}];
```

### Forcibly set a single custom chat room attribute

To overwrite a single custom attribute set by another chat room member in addition to setting your own attribute, call `setChatroomAttributeForced`. After the attribute is set successfully, other chat room members receive the `chatroomAttributesDidUpdated` callback.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager setChatroomAttributeForced:chatroomId
                                                             key:@"234"
                                                           value:@"123"
                                                      autoDelete:YES
                                                 completionBlock:^(EMError *error) {
    // Process the setting result.
}];
```

### Set multiple custom chat room attributes

Chat room members can call `setChatroomAttributes` to set multiple custom chat room attributes. This method can only add new attributes or update attributes added by the current user. After the attributes are set successfully, other chat room members receive the `chatroomAttributesDidUpdated` callback.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager setChatroomAttributes:chatroomId
                                                attributes:@{@"testKey": @"123"}
                                               autoDelete:YES
                                          completionBlock:^(EMError *error, NSDictionary<NSString *, EMError *> *failureKeys) {
    // failureKeys contains the attributes that failed to be set and their corresponding errors.
}];
```

### Forcibly set multiple custom chat room attributes

To overwrite multiple custom attributes set by other chat room members in addition to setting your own attributes, call `setChatroomAttributesForced`. After the attributes are set successfully, other chat room members receive the `chatroomAttributesDidUpdated` callback.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager setChatroomAttributesForced:chatroomId
                                                      attributes:@{@"testKey": @"123"}
                                                     autoDelete:YES
                                                completionBlock:^(EMError *error, NSDictionary<NSString *, EMError *> *failureKeys) {
    // failureKeys contains the attributes that failed to be set and their corresponding errors.
}];
```

### Delete a single custom chat room attribute

Chat room members can call `removeChatroomAttribute` to delete a single custom chat room attribute. This method can only delete an attribute set by the current user. After the attribute is removed, other chat room members receive the `chatroomAttributesDidRemoved` callback.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager removeChatroomAttribute:chatroomId
                                                          key:@"234"
                                               completionBlock:^(EMError *error) {
    // Process the deletion result.
}];
```

### Forcibly delete a single custom chat room attribute

To delete a single custom attribute set by another chat room member in addition to deleting your own attribute, call `removeChatroomAttributeForced`. After the attribute is deleted, other chat room members receive the `chatroomAttributesDidRemoved` callback.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager removeChatroomAttributeForced:chatroomId
                                                                key:@"234"
                                                     completionBlock:^(EMError *error) {
    // Process the deletion result.
}];
```

### Delete multiple custom chat room attributes

Chat room members can call `removeChatroomAttributes` to delete multiple custom chat room attributes. This method can only delete attributes set by the current user. After the attributes are deleted, other chat room members receive the `chatroomAttributesDidRemoved` callback.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager removeChatroomAttributes:chatroomId
                                                    attributes:@[@"testKey"]
                                               completionBlock:^(EMError *error, NSDictionary<NSString *, EMError *> *failureKeys) {
    // failureKeys contains the attributes that failed to be deleted and their corresponding errors.
}];
```

### Forcibly delete multiple custom chat room attributes

To delete multiple custom attributes set by other chat room members in addition to deleting your own attributes, call `removeChatroomAttributesForced`. After the attributes are deleted, other chat room members receive the `chatroomAttributesDidRemoved` callback.

Example code:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager removeChatroomAttributesForced:chatroomId
                                                          attributes:@[@"testKey"]
                                                     completionBlock:^(EMError *error, NSDictionary<NSString *, EMError *> *failureKeys) {
    // failureKeys contains the attributes that failed to be deleted and their corresponding errors.
}];
```

## Monitor chat room events

See [Monitor chat room events](room_manage.html#monitor-chat-room-events).

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`getChatroomSpecificationFromServerWithId`](#retrieve-chat-room-details) | `IEMChatroomManager` | Asynchronously retrieve chat room details. |
| [`getChatroomAnnouncementWithId`](#retrieve-the-chat-room-announcement) | `IEMChatroomManager` | Asynchronously retrieve the announcement. |
| [`updateChatroomAnnouncementWithId`](#update-the-chat-room-announcement) | `IEMChatroomManager` | Asynchronously update the announcement. |
| [`updateSubject`](#change-the-chat-room-name) | `IEMChatroomManager` | Asynchronously change the chat room name. |
| [`updateDescription`](#change-the-chat-room-description) | `IEMChatroomManager` | Asynchronously change the chat room description. |
| [`fetchChatroomAttributes`](#retrieve-specified-custom-chat-room-attributes) | `IEMChatroomManager` | Asynchronously retrieve specified custom attributes. |
| [`fetchChatroomAllAttributes`](#retrieve-all-custom-chat-room-attributes) | `IEMChatroomManager` | Asynchronously retrieve all custom attributes. |
| [`setChatroomAttribute`](#set-a-single-custom-chat-room-attribute) | `IEMChatroomManager` | Asynchronously set a single custom attribute. |
| [`setChatroomAttributes`](#set-multiple-custom-chat-room-attributes) | `IEMChatroomManager` | Asynchronously set multiple custom attributes. |
| [`removeChatroomAttribute`](#delete-a-single-custom-chat-room-attribute) | `IEMChatroomManager` | Asynchronously delete a single custom attribute. |
| [`removeChatroomAttributes`](#delete-multiple-custom-chat-room-attributes) | `IEMChatroomManager` | Asynchronously delete multiple custom attributes. |
