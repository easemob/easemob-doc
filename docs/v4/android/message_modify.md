# 编辑消息

环信即时通讯 IM 提供编辑消息功能，支持对发送成功的消息进行编辑，然后再发送，提高沟通效率和准确性，例如，发送消息后发觉消息内容中包含错别字、遗漏了的关键信息、内容不够完善清晰、甚至临时想更改自己的想法，可以编辑消息后再次发送。

## 功能开通和版本支持

对于单聊、群组和聊天室聊天会话中已经发送成功的消息，SDK 支持对这些消息的内容进行编辑。若使用该功能，**需联系环信商务开通**。

- SDK 4.13.0 之前的版本仅支持对单聊和群组会话中发送后的文本消息进行编辑。
- SDK 4.13.0 及之后版本支持对单聊、群组和聊天室会话中各类消息进行编辑：
  - 文本/自定义消息：支持编辑消息内容（body）和扩展字段 `ext`。
  - 文件/视频/音频/图片/位置/合并转发消息：只支持编辑消息扩展字段 `ext`。
  - 透传消息：不支持编辑。

## 技术原理

环信即时通讯 IM 通过 [EMChatManager](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_manager.html) 和 [EMMessageListener](https://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_message_listener.html) 实现消息编辑。

### 消息编辑流程

1. 用户调用 SDK 的 API 编辑一条消息。
2. 服务端存储的该条消息，编辑成功后回调给 SDK。
3. SDK 编辑客户端上的该条消息。成功后，SDK 将编辑后的消息回调给用户。

### 各类会话的消息编辑权限

- 对于单聊会话，只有消息发送方才能对消息进行编辑。
- 对于群组/聊天室会话，普通成员只能编辑自己发送的消息。群主/聊天室所有者和管理员除了可以编辑自己发送的消息，还可以编辑普通成员发送的消息。这种情况下，消息的发送方不变，消息体中的编辑者的用户 ID 属性为群主/聊天室所有者或管理员的用户 ID。

### 消息编辑后的生命周期

编辑消息没有时间限制，即只要这条消息仍在服务端存储就可以编辑。消息编辑后，消息生命周期（在服务端的保存时间）会重新计算，例如，消息可在服务器上保存 180 天，用户在消息发送后的第 30 天（服务器上的保存时间剩余 150 天）编辑了消息，编辑成功后该消息还可以在服务器上保存 180 天。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [初始化](initialization.html)文档。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- 联系环信商务开通消息编辑功能。

## 实现方法

你可以调用 `EMChatManager#asyncModifyMessage` 方法编辑已经发送成功的消息。该方法会同时更新服务器和本地的消息。对于编辑后的消息，消息体中除了内容变化，还新增了编辑者的用户 ID、编辑时间和编辑次数属性。除消息体和消息扩展属性 `ext` 外，该消息的其他信息（例如，消息 ID、消息发送方、接收方）均不会发生变化。

**一条消息默认最多可编辑 10 次。**

```java
// 文本消息：可同时编辑消息体和消息扩展属性
EMTextMessageBody textBody = new EMTextMessageBody("new content");
Map<String, Object> ext = new HashMap<>();
ext.put("newkey", "new value");

// textBody 和 ext 不能同时为 null
EMClient.getInstance().chatManager().asyncModifyMessage(this.messageId, textBody, ext, new EMValueCallBack<EMMessage>() {
            @Override
            public void onSuccess(EMMessage emMessage) {
                // 编辑成功
            }

            @Override
            public void onError(int i, String s) {
                // 编辑失败
            }
        });


// 自定义消息：可同时编辑消息体和消息扩展属性
EMCustomMessageBody customBody = new EMCustomMessageBody("new action");
Map<String, Object> newExt = new HashMap<>();
newExt.put("newkey1", "newkey1");
newExt.put("newkey2", 123);

EMClient.getInstance().chatManager().asyncModifyMessage(this.messageId, customBody, newExt, new EMValueCallBack<EMMessage>() {
            @Override
            public void onSuccess(EMMessage emMessage) {
                // 编辑成功
            }

            @Override
            public void onError(int i, String s) {
                // 编辑失败
            }
        });
        

// 文件/视频/音频/图片/位置/合并转发消息：只能编辑消息扩展属性
Map<String, Object> newExt = new HashMap<>();
newExt.put("newkey1", false);
newExt.put("newkey2", "new value");

EMClient.getInstance().chatManager().asyncModifyMessage(this.messageId, null, newExt, new EMValueCallBack<EMMessage>() {
            @Override
            public void onSuccess(EMMessage emMessage) {
                // 编辑成功
            }

            @Override
            public void onError(int i, String s) {
                // 编辑失败
            }
        });
```

消息编辑后，消息的接收方会收到 `EMMessageListener#onMessageContentChanged` 事件，该事件中会携带编辑后的消息对象、最新一次编辑消息的用户以及消息的最新编辑时间。对于群组和聊天室会话，除了编辑消息的用户，群组/聊天室内的其他成员均会收到该事件。

:::tip 
若通过 RESTful API 编辑自定义消息，消息的接收方也通过 `EMMessageListener#onMessageContentChanged` 事件接收编辑后的自定义消息。
:::

```java
EMClient.getInstance().chatManager().addMessageListener(new EMMessageListener() {
    @Override
    public void onMessageReceived(List<EMMessage> messages) {

    }
    
    @Override
    public void onMessageContentChanged(EMMessage messageModified, String operatorId, long operationTime) {
        int operationCount = messageModified.getBody().operationCount();
        operatorId、operationTime也可通过以下方式来获取,数据与上述行参保持一致
        String id = messageModified.getBody().operatorId();
        long time = messageModified.getBody().operationTime();
            //消息编辑后的扩展字段，可通过以下方式获取
        Map<String, Object> newExt = messageModified.ext();
        for (Map.Entry<String, Object> entry : newExt.entrySet()) {
            EMLog.e(TAG, "onMessageContentChanged onSuccess key:" + entry.getKey() + " value:" + entry.getValue());
        }
    }
});
```



