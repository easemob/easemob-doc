# 群组 @ 消息

群组 @ 消息指在群组聊天中，用户可以 @ 单个、多个或所有成员，发送消息。群组中的每个成员均可使用 @ 功能，而且可以 @ 群所有成员。

:::tip
目前，该功能只支持文本消息和表情。
:::

例如，该功能的 UI 实现如下图所示：

1. 在输入框输入 "@" 字符后，选择要 @ 的群成员。
2. 选择群成员后返回聊天页面，编辑并发送消息。
3. 当前用户被 @ 时，在会话列表或消息页面显示相应提示，例如，“Somebody@You”。
4. 用户进入会话页面查看消息。

UI 实现示例图如下：

![img](/images/product/solution_common/group_mention/group_@_mobile.png)

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

群组 @ 消息的发送方式与普通群消息相同。发送方通过消息扩展字段 `em_at_list` 指定被 @ 的群成员；SDK 不会自动生成 @ 提示或处理相关 UI，应用需要自行解析该字段并展示。

实现流程如下：

1. 发送方创建群消息后，将被 @ 成员的用户 ID 写入扩展字段 `em_at_list`，然后发送消息。
2. 接收方通过 `EMMessageListener#onMessageReceived(List<EMMessage>)` 接收消息，并读取 `EMMessage` 的扩展字段。
3. 若 `em_at_list` 包含当前登录用户的用户 ID，或该字段值为 `ALL`，应用可在 UI 中显示 @ 提示；否则按普通群消息处理。

`em_at_list` 的数据格式如下：

- @ 单个或多个群成员：值为用户 ID 数组，例如 `["user1", "user2"]`。
- @ 群内所有成员：值为字符串 `ALL`。

::tip
被 @ 成员的用户 ID 不包含“@”前缀。发送方与接收方应统一约定字段名、字段值类型，以及 `ALL` 的含义。
:::

### 发送消息

发送方 @ 用户发送消息的过程如下示例代码所示。

::: tabs#code

@tab Java

```java
// 扩展字段中填写被 @ 成员的用户 ID，不要添加“@”前缀。
JSONArray atUserList = new JSONArray();
atUserList.put("user1");
atUserList.put("user2");

EMMessage msg = EMMessage.createTextSendMessage("@user1 @user2 你好", conversationId);
// 群组 @ 消息必须设置为群聊类型。
msg.setChatType(EMMessage.ChatType.GroupChat);

// @ 单个或多个成员时，将用户 ID 数组写入 em_at_list。
msg.setAttribute("em_at_list", atUserList);
// @ 所有人时，将 em_at_list 的值设置为字符串 "ALL"：
// msg.setAttribute("em_at_list", "ALL");

// 发送群组消息。
EMClient.getInstance().chatManager().sendMessage(msg);

```

@tab Kotlin

```kotlin
// 扩展字段中填写被 @ 成员的用户 ID，不要添加“@”前缀。
val atUserList = JSONArray()
atUserList.put("user1")
atUserList.put("user2")

val msg = EMMessage.createTextSendMessage("@user1 @user2 你好", conversationId)
// 群组 @ 消息必须设置为群聊类型。
msg.chatType = EMMessage.ChatType.GroupChat

// @ 单个或多个成员时，将用户 ID 数组写入 em_at_list。
msg.setAttribute("em_at_list", atUserList)
// @ 所有人时，将 em_at_list 的值设置为字符串 "ALL"：
// msg.setAttribute("em_at_list", "ALL")

// 发送群组消息。
EMClient.getInstance().chatManager().sendMessage(msg)

```
:::

### 接收消息

接收方收到消息时，接收方可根据扩展字段的值类型，调用 `getJSONArrayAttribute` 或 `getStringAttribute` 读取 `em_at_list`，检查消息是否 @ 了自己，过程如下：

::: tabs#code

@tab Java

```java
private void handleMentionedMessage(EMMessage message) {
    // 先按字符串读取，以识别 @ 所有人。
    String atAll = message.getStringAttribute("em_at_list", null);
    if ("ALL".equalsIgnoreCase(atAll)) {
        // 消息 @ 所有人，需要更新 UI。
        return;
    }

    try {
        // @ 单个或多个成员时，em_at_list 为用户 ID 数组。
        JSONArray atUserList = message.getJSONArrayAttribute("em_at_list");
        String currentUser = EMClient.getInstance().getCurrentUser();
        for (int i = 0; i < atUserList.length(); i++) {
            if (currentUser.equals(atUserList.getString(i))) {
                // 消息 @ 自己，需要更新 UI。
                return;
            }
        }
    } catch (HyphenateException | JSONException e) {
        // 扩展字段不存在或格式不正确，按普通群消息处理。
    }
}

@Override
public void onMessageReceived(List<EMMessage> messages) {
    for (EMMessage message : messages) {
        // 仅解析群聊文本消息中的 @ 扩展字段。
        if (message.getChatType() == EMMessage.ChatType.GroupChat
                && message.getType() == EMMessage.Type.TXT) {
            handleMentionedMessage(message);
        }
    }
}

```

@tab Kotlin

```kotlin
private fun handleMentionedMessage(message: EMMessage) {
    // 先按字符串读取，以识别 @ 所有人。
    val atAll = message.getStringAttribute("em_at_list", null)
    if (atAll.equals("ALL", ignoreCase = true)) {
        // 消息 @ 所有人，需要更新 UI。
        return
    }

    try {
        // @ 单个或多个成员时，em_at_list 为用户 ID 数组。
        val atUserList = message.getJSONArrayAttribute("em_at_list")
        val currentUser = EMClient.getInstance().currentUser
        for (i in 0 until atUserList.length()) {
            if (currentUser == atUserList.getString(i)) {
                // 消息 @ 自己，需要更新 UI。
                return
            }
        }
    } catch (e: Exception) {
        // 扩展字段不存在或格式不正确，按普通群消息处理。
    }
}

override fun onMessageReceived(messages: MutableList<EMMessage>?) {
    messages?.forEach { message ->
        // 仅解析群聊文本消息中的 @ 扩展字段。
        if (message.chatType == EMMessage.ChatType.GroupChat
                && message.type == EMMessage.Type.TXT) {
            handleMentionedMessage(message)
        }
    }
}

```

:::

上述 `onMessageReceived` 方法应在 `EMMessageListener` 中实现。创建监听器后进行注册，并在不再需要监听时移除：

```java
// 注册保存为成员变量的消息监听器，接收新消息回调。
EMClient.getInstance().chatManager().addMessageListener(messageListener);

// 页面或组件销毁且不再需要监听时，移除同一个监听器实例。
EMClient.getInstance().chatManager().removeMessageListener(messageListener);
```

## 常见问题

1. Q：@ 群所有人时为何没有显示 @ 提示？

   A：请检查 `em_at_list` 的值是否为字符串 `ALL`。由于 @ 功能由应用通过消息扩展实现，字段名、字段值类型或拼写不一致不会导致普通消息发送失败，但会导致接收方无法正确识别 @ 状态。比较时可使用不区分大小写的方式兼容处理。

2. Q：@ 多个成员与 @ 所有成员有什么区别？

   A：设置 `ext` 时，若 @ 单个、多个群成员，字段的值为要 @ 的用户的用户 ID 数组；@ 所有人时，字段值为 `ALL` 字符串。

3. Q：Q：SDK 是否会自动显示“有人 @ 我”提示？

   A：不会。SDK 负责传输消息及其扩展字段。应用需要在 `EMMessageListener#onMessageReceived(List<EMMessage>)` 回调中读取 `EMMessage` 的扩展字段，并自行更新会话列表或消息页面的 UI。 

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#发送消息) | `EMMessage` | 创建待发送的文本消息。 |
| [`sendMessage`](#发送消息) | `EMChatManager` | 发送群组消息。 |
| [`getCurrentUser`](#接收消息) | `EMClient` | 获取当前登录用户的用户 ID。 |







