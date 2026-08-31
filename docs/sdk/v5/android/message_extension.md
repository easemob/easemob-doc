# Message Extensions

## Feature overview

When built-in message fields cannot meet your business requirements, you can use message extensions to carry custom business data, such as information about a replied-to message, rich-media message display data, or business identifiers.

The Android SDK uses `EMMessage#setAttribute` to set message extensions and supports the `Boolean`, `Int`, `Long`, `Float`, `Double`, `String`, `JSONObject`, and `JSONArray` types. After receiving a message, the recipient can call the attribute retrieval method for the corresponding type to obtain the custom data. The recipient can also call `EMMessage#getAttributes` to obtain all extensions in the message and process them as required.

## Example code

```java
EMMessage message = EMMessage.createTextSendMessage(content, toChatUsername);
// Add custom attributes.
message.setAttribute("attribute1", "value");
message.setAttribute("attribute2", true);
// Send the message with extensions.
EMClient.getInstance().chatManager().sendMessage(message);

// Read custom attributes after receiving the message. If an attribute does not exist, return the default value specified by parameter 2.
String attribute1 = message.getStringAttribute("attribute1", null);
boolean attribute2 = message.getBooleanAttribute("attribute2", false);

// Retrieve all extensions in the message.
Map<String, Object> attributes = message.getAttributes();
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#example-code) | `EMMessage` | Create a text message to send. |
| [`sendMessage`](#example-code) | `EMChatManager` | Send a message with extensions. |
