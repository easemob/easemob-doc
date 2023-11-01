# 修改消息

对于单聊或群组聊天会话中已经发送成功的文本消息，SDK 支持对这些消息进行修改，消息修改成功后会同步给会话中的接收方。对于修改后的消息，消息体中除了内容变化，还新增了修改者的用户 ID、修改时间和修改次数属性。除消息体外，该消息的其他信息（例如，消息发送方和接收方）均不会发生变化。

- 对于单聊会话，只有消息发送方才能对消息进行修改。
- 对于群聊会话，普通群成员只能修改自己发送的消息。群主和群管理员除了可以修改自己发送的消息，还可以修改普通群成员发送的消息。这种情况下，消息的发送方不变，消息体中的修改者的用户 ID 属性为群主或群管理员。

修改消息没有时间限制，即只要这条消息仍在服务端存储就可以修改。消息修改后，消息生命周期（可在服务端上保存的时间）会重新计算。

:::notice
1. 若使用该功能，需将 SDK 升级至 4.1.0 或以上版本。
2. 聊天室会话不支持消息修改功能。
:::

你可以调用 `com.hyphenate.chat.EMChatManager#asyncModifyMessage` 方法修改已经发送成功的消息。一条消息默认最多可修改 10 次，若要提升修改次数，需联系商务。

示例代码如下：

```java
    EMTextMessageBody messageBody=new EMTextMessageBody("new content");
    EMClient.getInstance().chatManager().asyncModifyMessage(msgId, messageBody, new EMCallBack() {
        @Override
        public void onSuccess() {
            
        }

        @Override
        public void onError(int code, String error) {

        }
    });

```
消息修改后，消息的接收方会收到 `com.hyphenate.EMMessageListener#onMessageContentChanged` 事件，该事件中会携带修改后的消息对象、最新一次修改消息的用户以及消息的最新修改时间。对于群聊会话，除了修改消息的用户，群组内的其他成员均会收到该事件。

```java
    EMClient.getInstance().chatManager().addMessageListener(new EMMessageListener() {
        @Override
        public void onMessageReceived(List<EMMessage> messages) {

        }
        
        @Override
        public void onMessageContentChanged(EMMessage messageModified, String operatorId, long operationTime) {
//                int operationCount = messageModified.getBody().operationCount();
                   // operatorId、operationTime也可通过以下方式来获取,数据与上述行参保持一致
//                String id = messageModified.getBody().operatorId();
//                long time = messageModified.getBody().operationTime();
        }
    });

```



