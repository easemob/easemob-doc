# 消息引用

消息引用是指用户可以引用一条已发送的消息。消息引用可以帮助用户回复特定的消息，或强调特定的信息。

除了透传消息，各类发送成功的消息均支持该功能，发送失败的消息不支持该功能。

对引用的消息进行回复时，你可以发送各种类型（除透传消息外）的消息。

:::tip
消息引用时，回复消息的长度为默认的消息长度限制，即消息内容和扩展字段的总和不超过 5 KB。
:::

各类型的消息引用的 UI 展示示例如下表所示：

| 消息类型  | 原消息存在 | 原消息不存在 |
| :--------- | :----- | :------- |
| 文本消息 | ![img](/images/product/solution_common/message_reply/text_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/text_no_mobile.png) |
| 图片消息 | ![img](/images/product/solution_common/message_reply/image_normal_mobile.png)  | ![img](/images/product/solution_common/message_reply/image_no_mobile.png)|
| 语音消息 | ![img](/images/product/solution_common/message_reply/voice_normal_mobile.png)| ![img](/images/product/solution_common/message_reply/voice_no_mobile.png)|
| 视频消息 | ![img](/images/product/solution_common/message_reply/video_normal_mobile.png)| ![img](/images/product/solution_common/message_reply/video_no_mobile.png)|
| 文件消息 | ![img](/images/product/solution_common/message_reply/file_normal_mobile.png)| ![img](/images/product/solution_common/message_reply/file_no_mobile.png)|
| 名片消息 | ![img](/images/product/solution_common/message_reply/card_no_mobile.png) | ![img](/images/product/solution_common/message_reply/card_normal_mobile.png)|
| 合并消息 | ![img](/images/product/solution_common/message_reply/combine_normal_mobile.png)| ![img](/images/product/solution_common/message_reply/combine_no_mobile.png)| 

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

为展示原消息的引用，需要在发送消息时，将原消息的信息传入新消息的拓展字段中。

以下为扩展字段的数据结构的示例：

```
"msgQuote": {
   "msgID": 原消息的 ID，字符串类型。
   "msgPreview": 本地找不到原消息时的默认文本展示，字符串类型。
   "msgSender": 原消息的发送方的用户 ID，字符串类型。
   "msgType": 原消息类型，字符串类型。
}
```

在消息列表中展示时，可从新消息的拓展字段中提取上述 JSON 信息，拼接展示 "${msgSender}: ${messageAbstract}"。

如需支持点击展示引用消息的区域，跳转至被引用的原消息。可根据上述 JSON 中的 `msgID` 字段，在消息列表中找到该消息进行跳转。

如果被引用消息已经删除，可以提示 **引用内容不存在**。

### 发送引用的消息

以回复文本消息为例，发送引用消息的过程如下：

::: tabs#code

@tab Java

```java

EMMessage msg = EMMessage.createTextSendMessage("hi", conversationId);
 JSONObject jsonObject = new JSONObject();
 try {
     jsonObject.put("msgID","quoted messageId");
     jsonObject.put("msgPreview","quoted message text");
     jsonObject.put("msgSender","quoted message senderId");
     jsonObject.put("msgType","txt");
 } catch (JSONException e) {
     throw new RuntimeException(e);
 }
 msg.setAttribute("msgQuote",jsonObject);
 EMClient.getInstance().chatManager().sendMessage(msg);


```

@tab Kotlin

```kotlin

 val msg = EMMessage.createTextSendMessage("hi", conversationId)
 val jsonObject = JSONObject()
 try {
     jsonObject.put("msgID", "quoted messageId")
     jsonObject.put("msgPreview", "quoted message text")
     jsonObject.put("msgSender", "quoted message senderId")
     jsonObject.put("msgType", "txt")
 } catch (e: JSONException) {
     throw RuntimeException(e)
 }
 msg.setAttribute("msgQuote", jsonObject)
 EMClient.getInstance().chatManager().sendMessage(msg)

```

:::

### 接收方解析收到的消息

接收方收到消息时，通过解析 `ext`，检查消息是否是引用消息。

::: tabs#code

@tab Java

```java
private void handleQuotedMessage(EMMessage message) {
  if(message.ext() != null && message.ext().containsKey("msgQuote")) {
      String msgQuote = message.getStringAttribute("msgQuote","");
      JSONObject jsonObject = null;
      try {
          if (!TextUtils.isEmpty(msgQuote)){
              try {
                  jsonObject = new JSONObject(msgQuote);
              } catch (JSONException e) {
                  e.printStackTrace();
              }
          }else {
              jsonObject = message.getJSONObjectAttribute("msgQuote");
          }
      } catch (ChatException e) {
          EMLog.e(TAG, "error message: "+e.getMessage());
      }

      if(jsonObject != null){
         try {
            // 读取 msgQuote 中的源消息信息
            String quoteMsgID = jsonObject.getString("msgID");
            String quoteSender = jsonObject.getString("msgSender");
            String quoteType = jsonObject.getString("msgType");
            String quoteContent = jsonObject.getString("msgPreview");
            //获取引用消息数据 更新 UI
        } catch (JSONException e) {
            e.printStackTrace();
        }
  }
}

@Override
 public void onMessageReceived(List<EMMessage> messages) {
    super.onMessageReceived(messages);
    for (EMMessage message : messages) {
       handleQuotedMessage(message)
    }
 }
```

@tab Kotlin

```kotlin
    private fun handleMentionedMessage(message: EMMessage) {
        message.ext()?.let {
            if (it.containsKey("msgQuote")){
                val msgQuote = message.getStringAttribute("msgQuote","")
                var jsonObject:JSONObject? = null
                try {
                    if (!msgQuote.isNullOrEmpty()){
                        try {
                            jsonObject = JSONObject(msgQuote)
                        }catch (e:JSONException){
                            e.printStackTrace();
                        }
                    }else{
                        jsonObject = message.getJSONObjectAttribute("msgQuote")
                    }
                }catch (e:HyphenateException){
                    EMLog.e(TAG, "error message: "+e.getMessage());
                }
                jsonObject?.let {
                    try {
                        // 读取 msgQuote 中的源消息信息
                        val quoteMsgID = jsonObject.getString("msgID")
                        val quoteSender = jsonObject.getString("msgSender")
                        val quoteType = jsonObject.getString("msgType")
                        val quoteContent = jsonObject.getString("msgPreview")
                        //获取引用消息数据 更新 UI
                    }catch (e:JSONException){
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    override fun onMessageReceived(messages: MutableList<EMMessage>?) {
        super.onMessageReceived(messages);
        messages?.forEach {
             handleMentionedMessage(it)
        }
    }

```

:::

## 常见问题

1. Q: 被引用消息不存在时，如何显示？ 
   A: 可以显示 `msgPreview` 内容，也可以显示**引用内容不存在**。
   
2. Q: 跳转到被引用消息时，如果被引用消息加载到当前消息的条数太多，怎么办？
   A: 这种情况下，将当前消息与被引用的消息之间的所有消息都展示到 UI 会导致内存占用太多，你需要设置一个加载消息数量的阈值，超过该阈值就不再跳转。










