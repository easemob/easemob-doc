# 撤回消息

## 功能说明

单聊、群聊和聊天室会话均支持撤回一条已发送成功的消息。

**适用范围**

- 除透传消息外，其他类型的消息均支持撤回。

**权限规则**

- 在单聊中，仅消息发送方可以撤回自己发送的消息；若消息已超过可撤回时限，则撤回失败。
- 在群聊和聊天室中，普通成员仅可撤回自己发送的消息；若消息已超过可撤回时限，则撤回失败。
- 在群聊和聊天室中，群主、群管理员、聊天室所有者和聊天室管理员可撤回其他成员发送的消息，且不受普通成员撤回时限的限制，即使消息过期也能撤回。

**时效限制**

- 默认情况下，消息发送方可撤回发送后 2 分钟内的消息。
- 你也可以在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯 > 基础功能 > 消息** 页面调整消息撤回时长，最长不超过 7 天。

**撤回结果**

- 消息撤回后，服务端保存的该条消息会被移除，包括历史消息、离线消息和漫游消息。
- 同时，消息发送方和接收方本地内存及数据库中的该条消息也会被移除。
- 对于附件类消息，例如图片、音频、视频和文件消息，消息被撤回后，对应的消息附件也会一并删除。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功建立连接，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 撤回消息

你可以调用 `EMChatManager#asyncRecallMessage` 撤回一条已发送成功的消息。

调用成功后，服务端以及消息发送方和接收方本地保存的消息（历史消息，离线消息或漫游消息）会被移除，相关用户通过 `EMMessageListener#onMessageRecalledWithExt` 收到消息撤回事件。

:::tip
1. 撤回时还可以通过 `ext` 参数携带自定义字符串，供收到撤回事件的客户端进行业务处理。
2. 附件类型消息，包括图片、音频和视频和文件消息，撤回消息后，消息附件也相应删除。
:::


```java
String recallExt = "撤回了一条消息";

// 异步方法。
EMClient.getInstance()
        .chatManager()
        .asyncRecallMessage(
                message,
                recallExt,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 消息撤回成功。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 消息撤回失败，根据错误码和错误信息处理。
                    }

                    @Override
                    public void onProgress(
                            int progress,
                            String status) {
                    }
                });
```

## 设置消息撤回监听

你可以通过 `EMMessageListener#onMessageRecalledWithExt` 监听消息撤回事件。该回调返回 `EMRecallMessageInfo` 列表：

| 方法 | 说明 |
| :--- | :--- |
| `getRecallBy()` | 获取撤回者的用户 ID。 |
| `getRecallMessageId()` | 获取被撤回消息的消息 ID。 |
| `getExt()` | 获取撤回消息时携带的扩展字符串。 |
| `getConversationId()` | 获取被撤回消息所属的会话 ID。 |
| `getRecallMessage()` | 获取被撤回的消息对象。 |

`getRecallMessage()` 的返回值与消息的接收情况有关：

- 若用户在线时已收到该消息，消息被撤回时，通常可以调用该方法获取被撤回的消息对象。
- 若消息发送及撤回期间接收方均处于离线状态，用户上线后只会收到撤回事件，此时该方法返回 `null`。

应用可以根据回调信息刷新消息列表，或者在 UI 中展示“某用户撤回了一条消息”等占位提示。

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageRecalledWithExt(
            List<EMRecallMessageInfo> recallInfoList) {
        for (EMRecallMessageInfo recallInfo : recallInfoList) {
            String recaller = recallInfo.getRecallBy();
            String recalledMessageId =
                    recallInfo.getRecallMessageId();
            String recallExt = recallInfo.getExt();
            String conversationId =
                    recallInfo.getConversationId();
            EMMessage recalledMessage =
                    recallInfo.getRecallMessage();

            // 根据撤回信息更新消息列表和 UI。
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
| [`asyncRecallMessage`](#撤回消息) | `EMChatManager` | 异步撤回一条已发送成功的消息，并可携带扩展字符串。 |
| [`recallMessage`](#撤回消息) | `EMChatManager` | 同步撤回一条已发送成功的消息，并可携带扩展字符串。 |
