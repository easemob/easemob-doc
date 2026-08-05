# 消息扩展

## 功能说明

当内置消息字段无法满足业务需求时，你可以通过消息扩展字段携带自定义业务数据，例如被回复消息信息、图文消息展示数据或业务标识等。

Android SDK 通过 `EMMessage#setAttribute` 设置消息扩展字段，支持 `Boolean`、`Int`、`Long`、`Float`、`Double`、`String`、`JSONObject` 和 `JSONArray` 类型。接收方收到消息后，可以调用对应类型的属性读取方法获取自定义数据，也可以调用 `EMMessage#getAttributes` 获取消息中的全部扩展字段，并根据业务需求进行处理。

## 示例代码

```java
EMMessage message = EMMessage.createTextSendMessage(content, toChatUsername);
// 增加自定义属性。
message.setAttribute("attribute1", "value");
message.setAttribute("attribute2", true);
// 发送携带扩展字段的消息。
EMClient.getInstance().chatManager().sendMessage(message);

// 接收消息后读取自定义属性。属性不存在时，返回第 2 个参数指定的默认值。
String attribute1 = message.getStringAttribute("attribute1", null);
boolean attribute2 = message.getBooleanAttribute("attribute2", false);

// 获取消息中的全部扩展字段。
Map<String, Object> attributes = message.getAttributes();
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#示例代码) | `EMMessage` | 创建待发送的文本消息。 |
| [`sendMessage`](#示例代码) | `EMChatManager` | 发送携带扩展字段的消息。 |
