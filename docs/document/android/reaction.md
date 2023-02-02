# 消息表情回复 Reaction

<Toc />

环信即时通讯 IM 提供消息表情回复（下文统称 “Reaction”）功能。用户可以在单聊和群聊中对消息添加、删除表情。表情可以直观地表达情绪，利用 Reaction 可以提升用户的使用体验。同时在群组中，利用 Reaction 可以发起投票，根据不同表情的追加数量来确认投票。

:::notice
1. 目前 Reaction 仅适用于单聊和群组。聊天室暂不支持 Reaction 功能。
2. 私有化版本不支持 Reaction 功能。
:::

## 技术原理

环信即时通讯 IM SDK 支持你通过调用 API 在项目中实现如下功能：

- `asyncAddReaction` 在消息上添加 Reaction；
- `asyncRemoveReaction` 删除消息的 Reaction；
- `asyncGetReactionList` 获取消息的 Reaction 列表；
- `asyncGetReactionDetail` 获取 Reaction 详情；
- `EMMessage.getMessageReaction()` 从 `EMMessage` 对象获取 Reaction 列表。

Reaction 场景示例如下：

![img](@static/images/android/reactions.png)

分别展示如何添加 Reaction，群聊中 Reaction 的效果，以及查看 Reaction 列表。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 `3.9.2.1 或以上版本` SDK 初始化，详见 [快速开始](quickstart.html)。
2. 了解环信即时通讯 IM API 的 [使用限制](product/limitation.html)。
3. 已联系商务开通 Reaction 功能。

## 实现方法

### 在消息上添加 Reaction

调用 `asyncAddReaction` 在消息上添加 Reaction，在 `onReactionChanged` 监听事件中会收到这条消息的最新 Reaction 概览。

示例代码如下：

```java
// 添加 Reaction。
 EMClient.getInstance().chatManager().asyncAddReaction(message.getMsgId(), reaction, new EMCallBack() {
    @Override
    public void onSuccess() {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }

    @Override
    public void onProgress(int i, String s) {

    }
});

// 监听 Reaction 更新。
EMMessageListener listener = new EMMessageListener() {
    ...
    @Override
    public void onReactionChanged(List<EMMessageReactionChange> messageReactionChangeList) {
        // 处理 reaction 更新逻辑
    }
    ...
};
// 注册消息监听
EMClient.getInstance().chatManager().addMessageListener(listener);
```

### 删除消息的 Reaction

调用 `asyncRemoveReaction` 删除消息的 Reaction，在 `onReactionChanged` 监听事件中会收到这条消息的最新 Reaction 概览。

示例代码如下：

```java
// 删除 Reaction。
EMClient.getInstance().chatManager().asyncRemoveReaction(message.getMsgId(), reaction, new EMCallBack() {
    @Override
    public void onSuccess() {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }

    @Override
    public void onProgress(int i, String s) {

    }
});

// 监听 Reaction 更新。
EMMessageListener listener = new EMMessageListener() {
    ...
    @Override
    public void onReactionChanged(List<EMMessageReactionChange> messageReactionChangeList) {
        // 处理 reaction 更新逻辑
    }
    ...
};
// 注册消息监听
EMClient.getInstance().chatManager().addMessageListener(listener);
```

### 获取消息的 Reaction 列表

调用 `asyncGetReactionList` 可以从服务器获取指定消息的 Reaction 概览列表，列表内容包含 Reaction 内容，添加或移除 Reaction 的用户数量，以及添加或移除 Reaction 的前三个用户的用户 ID。示例代码如下：

```java
EMClient.getInstance().chatManager().asyncGetReactionList(msgIdList, EMMessage.ChatType.Chat, groupId, new EMValueCallBack<Map<String, List<EMMessageReaction>>>() {
    @Override
    public void onSuccess(Map<String, List<EMMessageReaction>> stringListMap) {

    }

    @Override
    public void onError(int i, String s) {

    }
});
```

### 获取 Reaction 详情

调用 `asyncGetReactionDetail` 可以从服务器获取指定 Reaction 的详情，包括 Reaction 内容，添加或移除 Reaction 的用户数量以及添加或移除 Reaction 的全部用户列表。示例代码如下：

```java
EMClient.getInstance().chatManager().asyncGetReactionDetail(mMsgId, emojiconId,
                pageCursor, 30, new EMValueCallBack<EMCursorResult<EMMessageReaction>>() {
    @Override
    public void onSuccess(EMCursorResult<EMMessageReaction> messageReactionCursorResult) {

    }

    @Override
    public void onError(int i, String s) {

    }
});
```