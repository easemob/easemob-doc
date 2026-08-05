# 编辑消息

## 功能说明

环信即时通讯 IM 提供消息编辑功能。用户可以修改已发送成功的消息，服务端和本地存储的消息将同步更新，无需重新发送一条消息。

### 支持范围

该功能适用于单聊、群聊和聊天室，支持范围如下：

- 文本消息和自定义消息：支持修改消息体 `body` 和扩展字段 `ext`。
- 文件、视频、音频、图片、位置及合并转发消息：仅支持修改扩展字段 `ext`，不支持修改消息体。
- 透传消息：不支持编辑。

### 消息编辑流程

1. 应用调用消息编辑 API，传入待编辑的消息及修改后的内容。  
2. SDK 将编辑请求发送至服务端；服务端完成消息更新后，将编辑后的消息返回给 SDK。  
3. SDK 更新本地数据库中的对应消息，并通过编辑结果回调将更新后的消息返回给应用。  
4. 消息所属会话的其他成员收到消息编辑事件后，可通过消息监听器获取编辑后的消息并更新界面。

### 各类会话的消息编辑权限

- 对于单聊会话，只有消息发送方才能对消息进行编辑。
- 对于群组/聊天室会话，普通成员只能编辑自己发送的消息。群主/聊天室所有者和管理员除了可以编辑自己发送的消息，还可以编辑普通成员发送的消息。这种情况下，消息的发送方不变，消息体中的编辑者用户 ID 为群主、聊天室所有者或管理员的用户 ID。

### 消息编辑后的生命周期

编辑消息没有时间限制，即只要这条消息仍在服务端存储就可以编辑。消息编辑后，消息生命周期（在服务端的保存时间）会重新计算，例如，消息可在服务器上保存 180 天，用户在消息发送后的第 30 天（服务器上的保存时间剩余 150 天）编辑了消息，编辑成功后该消息还可以在服务器上保存 180 天。

## 功能开通

若使用该功能，**需联系环信商务开通**。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [初始化](initialization.html) 文档。
- 了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。
- 联系环信商务开通消息编辑功能。

## 编辑消息

你可以调用 `EMChatManager#asyncModifyMessage` 编辑已经发送成功的消息。该方法会同时更新服务端和本地消息，消息 ID 不会变化。对于编辑后的消息，消息体中除了内容变化，还包含最后一次编辑者的用户 ID、编辑时间和编辑次数。除消息体和消息扩展属性 `ext` 外，该消息的其他信息（例如消息 ID、消息发送方和接收方）均不会发生变化。

`messageBodyModified` 和 `ext` 不能同时为 `null`。传入非 `null` 的 `ext` 时，新扩展字段会覆盖原消息的全部扩展字段；如需保留原有扩展字段，应先将其合并到新的 `Map` 中再传入。扩展字段的值支持 `String`、`Integer`、`Double`、`Boolean`、`Long`、`Float`、`JSONObject` 和 `JSONArray` 类型。

:::tip
一条消息默认最多可编辑 10 次。
:::

```java
// 文本消息：可以同时编辑消息体和消息扩展字段。
EMTextMessageBody textBody =
        new EMTextMessageBody("new content");
Map<String, Object> textExt = new HashMap<>();
textExt.put("newKey", "new value");

EMClient.getInstance()
        .chatManager()
        .asyncModifyMessage(
                messageId,
                textBody,
                textExt,
                new EMValueCallBack<EMMessage>() {
                    @Override
                    public void onSuccess(EMMessage message) {
                        // message 为编辑后的消息。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });

// 自定义消息：可以同时编辑消息体和消息扩展字段。
EMCustomMessageBody customBody =
        new EMCustomMessageBody("new action");
Map<String, Object> customExt = new HashMap<>();
customExt.put("newKey1", "new value");
customExt.put("newKey2", 123);

EMClient.getInstance()
        .chatManager()
        .asyncModifyMessage(
                messageId,
                customBody,
                customExt,
                new EMValueCallBack<EMMessage>() {
                    @Override
                    public void onSuccess(EMMessage message) {
                        // message 为编辑后的消息。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });

// 文件、视频、音频、图片、位置和合并转发消息：
// 只能编辑消息扩展字段，因此消息体传入 null。
Map<String, Object> attachmentExt = new HashMap<>();
attachmentExt.put("newKey1", false);
attachmentExt.put("newKey2", "new value");

EMClient.getInstance()
        .chatManager()
        .asyncModifyMessage(
                messageId,
                null,
                attachmentExt,
                new EMValueCallBack<EMMessage>() {
                    @Override
                    public void onSuccess(EMMessage message) {
                        // message 为编辑后的消息。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

消息编辑后，消息接收方以及当前账号的其他在线设备会收到 `EMMessageListener#onMessageContentChanged` 回调。该回调携带编辑后的消息、最后一次编辑消息的用户 ID 以及最新编辑时间。对于群组和聊天室会话，除执行编辑操作的用户外，群组或聊天室内的其他成员均会收到该回调。

:::tip
若 [通过 RESTful API 编辑自定义消息](/document/server-side/message_modify.html)，消息接收方也通过 `EMMessageListener#onMessageContentChanged` 回调接收编辑后的自定义消息。
:::

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageContentChanged(
            EMMessage modifiedMessage,
            String operatorId,
            long operationTime) {
        EMMessageBody body = modifiedMessage.getBody();

        // 获取消息累计编辑次数。
        int operationCount = body.operationCount();

        // 也可以从消息体中获取最后一次编辑者和编辑时间；
        // 其值与回调参数 operatorId 和 operationTime 一致。
        String lastOperatorId = body.operatorId();
        long lastOperationTime = body.operationTime();

        // 获取编辑后的消息扩展字段。
        Map<String, Object> modifiedExt = modifiedMessage.ext();
        if (modifiedExt != null) {
            for (Map.Entry<String, Object> entry : modifiedExt.entrySet()) {
                EMLog.d(
                        "MessageModify",
                        "key: " + entry.getKey()
                                + ", value: " + entry.getValue());
            }
        }
    }
};

EMClient.getInstance()
        .chatManager()
        .addMessageListener(messageListener);

// 不再需要监听时移除监听器。
EMClient.getInstance()
        .chatManager()
        .removeMessageListener(messageListener);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncModifyMessage`](#编辑消息) | `EMChatManager` | 编辑服务端及本地消息的消息体或扩展字段。 |
| [`operatorId`](#编辑消息) | `EMMessageBody` | 获取最后一次编辑消息的用户 ID。 |
| [`ext`](#编辑消息) | `EMMessage` | 获取编辑后的消息扩展字段。 |
