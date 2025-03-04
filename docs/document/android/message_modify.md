# 修改消息

对于会话中已经发送成功的消息，SDK 支持对这些消息的内容及扩展属性ext进行修改。
限制：
- 文本/自定义消息：支持修改消息内容（body）和扩展 `ext`。
- 文件/视频/音频/图片/位置/合并转发消息：只支持修改消息扩展 `ext`。
- 命令消息：不支持修改。
- 该方法会同时更新服务器和本地的消息，消息 ID 不会更新。

:::tip
1. 若使用该功能，需将 SDK 升级至 4.13.0 或以上版本。
2. 若使用该功能，需联系环信商务开通。
:::

## 技术原理

环信即时通讯 IM 通过 [EMChatManager](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_manager.html) 和 [EMMessageListener](https://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_message_listener.html) 实现消息修改。

消息内容修改流程如下：

1. 用户调用 SDK 的 API 修改一条消息。
2. 服务端存储的该条消息，修改成功后回调给 SDK。
3. SDK 修改客户端上的该条消息。成功后，SDK 将修改后的消息回调给用户。

修改消息没有时间限制，即只要这条消息仍在服务端存储就可以修改。消息修改后，消息生命周期（在服务端的保存时间）会重新计算，例如，消息可在服务器上保存 180 天，用户在消息发送后的第 30 天（服务器上的保存时间剩余 150 天）修改了消息，修改成功后该消息还可以在服务器上保存 180 天。

对于修改后的消息，消息体中除了内容变化，还新增了修改者的用户 ID、修改时间和修改次数属性。除消息体外和消息扩展属性`ext`，该消息的其他信息（例如，消息发送方、接收方）均不会发生变化。

- 对于单聊会话，只有消息发送方才能对消息进行修改。
- 对于群组和聊天室会话，普通群成员只能修改自己发送的消息。群主和群管理员除了可以修改自己发送的消息，还可以修改普通群成员发送的消息。这种情况下，消息的发送方不变，消息体中的修改者的用户 ID 属性为群主或群管理员的用户 ID。


## 实现方法

你可以调用 `EMChatManager#asyncModifyMessage` 方法修改已经发送成功的消息。一条消息默认最多可修改 10 次。

示例代码如下：

```java
    EMTextMessageBody newMessageBody=new EMTextMessageBody("new content");

    Map<String, Object> newExt = new HashMap<>();
    newExt.put("new key1", "new value1");
    newExt.put("new key2", 1);
    newExt.put("new key3", true);
    //如果不想修改消息内容(body)，newMessageBody参数可以传入null
    //如果不想修改原有消息的ext,newExt参数可以传null。如果想清除原有的ext,newExt参数可以传一个空的Map。
    //newMessageBody和newExt不能同时都为null
    EMClient.getInstance().chatManager().asyncModifyMessage(msgId, newMessageBody,newExt, new EMValueCallBack<EMMessage>() {
        @Override
        public void onSuccess(EMMessage messageModified) {
            
        }
    
        @Override
        public void onError(int error, String errorMsg) {
            
        }
    });

```

消息修改后，消息的接收方会收到 `EMMessageListener#onMessageContentChanged` 事件，该事件中会携带修改后的消息对象、最新一次修改消息的用户以及消息的最新修改时间。对于群组和聊天室会话，除了修改消息的用户，群组内的其他成员均会收到该事件。

:::tip
若通过 RESTful API 修改自定义消息，消息的接收方也通过 `EMMessageListener#onMessageContentChanged` 事件接收修改后的自定义消息。
:::

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
                    //消息修改后的扩展字段，可通过以下方式获取
//                Map<String, Object> newExt = messageModified.ext();
//                for (Map.Entry<String, Object> entry : newExt.entrySet()) {
//                    EMLog.e(TAG, "onMessageContentChanged onSuccess key:" + entry.getKey() + " value:" + entry.getValue());
//                }
        }
    });

```



