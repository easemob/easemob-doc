# 群组 @ 消息

群组 @ 消息指在群组聊天中，用户可以 @ 单个、多个或所有成员，发送消息。群组中的每个成员均可使用 @ 功能，而且可以 @ 群所有成员。

:::tip
目前，该功能只支持文本消息和表情。
:::

例如，该功能的 UI 实现如下图所示：

1. 在输入框输入 "@" 字符后，选择要 @ 的群成员。
2. 选择群成员后，返回聊天界面，编辑消息，然后发送。
3. 如果有消息 @ 我，会收到会话更新，例如，“Somebody@You”。
4. 打开会话页面，查看消息。

|  客户端                 | Web 端   |
| :------------------- | :----- | 
| Android/iOS | ![img](@static/images/product/solution_common/group_mention/group_@_mobile.png)  |
| Web | ![img](@static/images/product/solution_common/group_mention/group_@_web.png)  |

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见各端快速开始，例如[Android 端](/document/android/quickstart.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

在群组中，@ 某人发送消息与发送普通消息没有区别，只是被 @ 的用户在 UI 上显示会有不同。该功能可以通过扩展消息实现：

1. 发送方将要 @ 的用户的用户 ID 通过扩展字段添加到消息，并将消息发送到群组。
2. 群组成员收到消息时，检查对应的扩展字段是否存在。若存在，检查当前登录的用户 ID 是否包含在扩展字段中。
3. 若包含，需要对被 @ 的用户在 UI 上进行特殊处理，显示出相应的提示信息，如“[Somebody@You]”。若不包含，表明用户没有被 @，则 UI 无需处理。

群组 @ 消息的扩展数据结构如下：

- @ 单个或多个群组成员："em_at_list": [user1, user2, user3]
- @ 群全体成员："em_at_list":"All"

### 发送消息

发送方 @ 用户发送消息的过程如下示例代码所示。

#### Android 代码

::: tabs#code

@tab Java

```Java
JSONArray atUserList = new JSONArray();
atUserList.put("@User1");
atUserList.put("@User2");
EMMessage msg = EMMessage.createTextSendMessage("@userId 你好", conversationID);
msg.setChatType(EMMessage.ChatType.GroupChat);
// @ 指定用户的消息构造如下。
msg.setAttribute("em_at_list",atUserList);
// 如果要 @ 所有人，ext 可以设置为 ["em_at_list": "ALL"]。
//msg.setAttribute("em_at_list","ALL");
EMClient.getInstance().chatManager().sendMessage(msg);

```

@tab Kotlin

```Kotlin
  val atUserList = JSONArray()
  atUserList.put("@User1")
  atUserList.put("@User2")
  val msg = EMMessage.createTextSendMessage("@userId 你好", conversationID)
  msg.chatType = EMMessage.ChatType.GroupChat
  // @ 指定用户的消息构造如下。
  msg.setAttribute("em_at_list", atUserList)
  // 如果要 @ 所有人，ext 可以设置为 ["em_at_list": "ALL"]。
  //msg.setAttribute("em_at_list","ALL");
  EMClient.getInstance().chatManager().sendMessage(msg)

```

:::

#### iOS/Web 代码

::: tabs#code

@tab iOS

```swift
let textBody = EMTextMessageBody(text: "@userId1 你好")
// @ 指定用户的消息构造如下。如果要 @ 所有人，ext 可以设置为 ["em_at_list": "All"]。
let msg = EMMessage(conversationID: "groupId", body: textBody, ext: ["em_at_list": ["userId1"]])
// 指定聊天类型为群组。
msg.chatType = .groupChat
// 发送消息
EMClient.shared().chatManager?.send(msg, progress: nil, completion: { msg, err in
    if err == nil {
        print("send success")
    }
})
```

@tab Web

```javascript
const message = chatSDK.message.create({
  to: "userId",
  chatType: "groupChat",
  type: "txt",
  msg: "hello",
  ext: {
    em_at_list: "ALL" || ["user1", "user2"],
  },
});

client.send(message);
```

:::

### 接收消息

接收方收到消息时，通过解析消息扩展字段 `ext`，检查消息是否 @ 了自己，过程如下。

#### Android 代码

::: tabs#code

@tab Java

```Java
private void handleMentionedMessage(EMMessage messages) {
   try {
      String groupId = msg.getTo();
      JSONArray jsonArray = msg.getJSONArrayAttribute("em_at_list");
      for(int i = 0; i < jsonArray.length(); i++){
           String username = jsonArray.getString(i);
           if(EMClient.getInstance().getCurrentUser().equals(username)){
               // 消息 @ 自己，需要更新 UI。
            }
      }

   }
   catch (Exception e1) {
       //确认是否是 @ 所有人
       String usernameStr = msg.getStringAttribute("em_at_list", null);
       if(usernameStr != null){
           String s = usernameStr.toUpperCase();
           if(s.equals("ALL")){
               // 消息 @ 所有人，需要更新 UI。
           }
      }
   } 
}

 @Override
 public void onMessageReceived(List<EMMessage> messages) {
    super.onMessageReceived(messages);
    for (EMMessage message : messages) {
       if (message.getChatType() == EMMessage.ChatType.GroupChat && message.getType()== EMMessage.Type.TXT){
          handleMentionedMessage(message)
       }
    }
 }

```

@tab Kotlin

```Kotlin
    private fun handleMentionedMessage(messages: EMMessage) {
        try {
            val groupId: String = messages.to
            val jsonArray: JSONArray = messages.getJSONArrayAttribute("em_at_list")
            for (i in 0 until jsonArray.length()) {
                val username = jsonArray.getString(i)
                if (EMClient.getInstance().currentUser == username) {
                    // 消息 @ 自己，需要更新 UI。
                }
            }
        } catch (e1: java.lang.Exception) {
            //确认是否是 @ 所有人
            val usernameStr: String = messages.getStringAttribute("em_at_list", null)
            val s = usernameStr.uppercase(Locale.getDefault())
            if (s == "ALL") {
                // 消息 @ 所有人，需要更新 UI。
            }
        }
    }

    override fun onMessageReceived(messages: MutableList<EMMessage>?) {
        super.onMessageReceived(messages);
        messages?.forEach {
            if (it.chatType == EMMessage.ChatType.GroupChat && it.type == EMMessage.Type.TXT){
                handleMentionedMessage(it)
            }
        }
    }

```

:::

#### iOS/Web 代码

::: tabs#code

@tab iOS

```swift
func handleMentionedMessage(_ message: EMChatMessage) {
    let atListInfo = message.ext?["em_at_list"]
        if let atListInfo = atListInfo as? String, 
            atListInfo.lowercased() == "all" {
            // 消息 @ 所有人，需要更新 UI。
        }
        if let atListInfo = atListInfo as? [String],
           let currentUserId = EMClient.shared().currentUsername,
           atListInfo.contains(currentUserId) {
            // 消息 @ 自己，需要更新 UI。
        }
}
func messagesDidReceive(_ aMessages: [EMChatMessage]) {
    for msg in aMessages {
        if msg.chatType == .groupChat,
           msg.body.type == .text {
            handleMentionedMessage(msg)
        }
    }
}
```

@tab Web

```javascript
receiveMessage(message){
    let mentionList = message?.ext?.em_at_list;
    // 收到文本消息            
    if (mentionList && message.from !== client.user && message.type === 'txt') {
        // 消息 @ 所有人或包含自己时，需要更新 UI。
        if (mentionList === "ALL" || mentionList.includes(client.user)) {
        }
    }
}

```

:::

## 常见问题

1. Q：@ 群所有人时为何发消息失败？

   A：可能是 `ALL` 的拼写错误，比较时可兼容处理先统一转为小写或者大写。

2. Q：@ 多人与 @ 所有人有什么区别？  

   A：设置 `ext` 时，若 @ 单个、多个群成员，字段的值为要 @ 的用户的用户 ID 数组；@ 所有人时，字段值为 `ALL` 字符串。







