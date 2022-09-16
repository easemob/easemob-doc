# 聊天室-管理聊天室成员

<Toc />

聊天室是支持多人沟通的即时通讯系统。本文介绍如何使用环信即时通讯 IM Android SDK 在实时互动 app 中管理聊天室成员，并实现聊天室的相关功能。

## 技术原理

环信即时通讯 IM SDK 提供 `EMChatRoomManager` 类 和 `EMChatRoom` 类，支持对聊天室成员的管理，包括获取、添加和移出聊天室成员等，主要方法如下：

- 获取聊天室成员列表
- 将成员移出聊天室
- 管理聊天室黑名单
- 管理聊天室白名单
- 管理聊天室禁言列表
- 开启和关闭聊天室全员禁言
- 管理聊天室所有者及管理员

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 聊天室相关限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM Android SDK 提供的 API 实现上述功能。

### 获取聊天室成员列表

所有聊天室成员均可调用 `fetchChatRoomMembers` 方法获取当前聊天室成员列表。

示例代码如下：

```java
public EMCursorResult<String> fetchChatRoomMembers(String chatRoomId, String cursor, int pageSize);
```

### 将成员移出聊天室

仅聊天室所有者和管理员可调用 `EMChatRoomManager#removeChatRoomMembers` 方法将指定成员移出聊天室。

被移出后，该成员收到 `onRemovedFromChatRoom` 回调，其他成员收到 `EMChatRoomChangeListener#BE_KICKED` 回调。

被移出的成员可以重新进入聊天室。

示例代码如下：

```java
// 异步方法
EMClient.getInstance().chatroomManager().removeChatRoomMembers(chatRoomId, members);
```

### 管理聊天室黑名单


#### 将成员加入聊天室黑名单

仅聊天室所有者和管理员可调用 `EMChatRoomManager#blockChatroomMembers` 方法将指定成员添加至黑名单。

被加入黑名单后，该成员收到 `EMChatRoomChangeListener#onRemovedFromChatRoom` 回调，其他成员收到 `EMChatRoomChangeListener#onMemberExited` 回调。移出原因为 `EMAChatRoomManagerListener#BE_KICKED`。

被加入黑名单后，该成员无法再收发聊天室消息并被移出聊天室，黑名单中的成员如想再次加入聊天室，聊天室所有者或管理员必须先将其移出黑名单列表。

示例代码如下：

```java
// 异步方法
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().blockChatroomMembers(chatRoomId, members);
```

#### 将成员移出聊天室黑名单

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#unblockChatRoomMembers` 方法将成员移出聊天室黑名单。

示例代码如下：

```java
// 异步方法
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().unblockChatRoomMembers(chatRoomId, members);
```

#### 获取聊天室黑名单列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#fetchChatRoomBlockList` 方法获取当前聊天室黑名单。

示例代码如下：

```java
// 异步方法
EMChatRoom chatroom = EMClient.getInstance().chatroomManager().blockChatroomMembers(chatRoomId, members);
```

### 管理聊天室白名单

#### 获取聊天室白名单列表

仅聊天室所有者和管理员可以调用 `fetchChatRoomWhiteList` 获取当前聊天室白名单成员列表。

示例代码如下：

```java
EMClient.getInstance().chatroomManager().fetchChatRoomWhiteList(chatRoomId, new EMValueCallBack<List<String>>() {
    @Override
    public void onSuccess(List<String> value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

#### 检查自己是否在聊天室白名单中

所有聊天室成员可以调用 `checkIfInChatRoomWhiteList` 方法检查自己是否在聊天室白名单中，示例代码如下：

```java
EMClient.getInstance().chatroomManager().checkIfInChatRoomWhiteList(chatRoomId, new EMValueCallBack<Boolean>() {
    @Override
    public void onSuccess(Boolean value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

#### 将成员加入聊天室白名单

仅聊天室所有者和管理员可以调用 `addToChatRoomWhiteList` 将成员加入聊天室白名单。

示例代码如下：

```java
EMClient.getInstance().chatroomManager().addToChatRoomWhiteList(chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

#### 将成员移出聊天室白名单列表

仅聊天室所有者和管理员可以调用 `removeFromChatRoomWhiteList` 将成员从聊天室白名单移出。

示例代码如下：

```java
EMClient.getInstance().chatroomManager().removeFromChatRoomWhiteList(chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

### 管理聊天室禁言列表

#### 添加成员至聊天室禁言列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#muteChatRoomMembers` 方法将指定成员添加至聊天室禁言列表，操作者外其他成员收到 `EMChatRoomChangeListener#onMuteListAdded` 回调。

:::notice
聊天室所有者可禁言聊天室所有成员，聊天室管理员可禁言聊天室普通成员。
:::

示例代码如下：

```java
// 异步方法
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().muteChatRoomMembers(chatRoomId, members, duration);
```

#### 将成员移出聊天室禁言列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#unMuteChatRoomMembers` 方法将成员移出聊天室禁言列表。被解除禁言后，其他成员收到 `EMChatRoomChangeListener#onMuteListRemoved` 回调。

:::notice
聊天室所有者可对聊天室所有成员解除禁言，聊天室管理员可对聊天室普通成员解除禁言。
:::

示例代码如下：

```java
// 异步方法
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().unMuteChatRoomMembers(chatRoomId, members);
```

#### 获取聊天室禁言列表

仅聊天室所有者和管理员可调用 `fetchChatRoomMuteList` 获取聊天室禁言列表。

示例代码如下：

```java
// 异步方法
Map<String, Long> memberMap =  EMClient.getInstance().chatroomManager().fetchChatRoomMuteList(chatRoomId, pageNum, pageSize);
```

### 开启和关闭聊天室全员禁言

为了快捷管理聊天室发言，聊天室所有者和管理员可以开启和关闭聊天室全员禁言。全员禁言和单独的成员禁言不冲突，设置或者解除全员禁言，原禁言列表并不会变化。

#### 开启全员禁言

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#muteAllMembers` 方法开启全员禁言。全员禁言开启后，除了在白名单中的成员，其他成员不能发言。调用成功后，聊天室成员会收到 `EMChatRoomChangeListener#onAllMemberMuteStateChanged` 回调。

示例代码如下：

```java
EMClient.getInstance().chatroomManager().muteAllMembers(chatRoomId, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

#### 关闭全员禁言

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#unmuteAllMembers` 方法取消全员禁言。调用成功后，聊天室成员会收到 `EMChatRoomChangeListener#onAllMemberMuteStateChanged` 回调。

示例代码如下：

```java
EMClient.getInstance().chatroomManager().unmuteAllMembers(chatRoomId, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### 管理聊天室所有者和管理员

#### 变更聊天室所有者

仅聊天室所有者可以调用 `EMChatRoomManager#changeOwner` 方法将权限移交给聊天室中指定成员。成功移交后，原聊天室所有者变为聊天室成员，新的聊天室所有者和聊天室管理员收到 `EMChatRoomChangeListener#onOwnerChanged` 回调。

示例代码如下：

```java
// 异步方法
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().changeOwner(chatRoomId, newOwner);
```

#### 添加聊天室管理员

仅聊天室所有者可以调用 `EMChatRoomManager#addChatRoomAdmin` 方法添加聊天室管理员。成功添加后，新管理员及其他管理员收到 `EMChatRoomChangeListener#onAdminAdded` 回调。

示例代码如下：

```java
// 异步方法
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().addChatRoomAdmin(chatRoomId, admin);
```

#### 移除聊天室管理员

仅聊天室所有者可以调用 `EMChatRoomManager#removeChatRoomAdmin` 方法移除聊天室管理员。成功移除后，被移除的管理员及其他管理员收到 `EMChatRoomChangeListener#onAdminRemoved` 回调。

示例代码如下：

```java
// 异步方法
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().removeChatRoomAdmin(chatRoomId, admin);
```

### 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。