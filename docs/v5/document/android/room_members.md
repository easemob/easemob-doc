# 管理聊天室成员

## 功能说明

聊天室是支持多人沟通的即时通讯系统，适用于直播互动、开放讨论和消息广播等多人实时互动场景。本文介绍如何使用 SDK 管理聊天室成员，包括查询成员列表、管理员、白名单、黑名单和禁言等功能。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 聊天室相关限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 获取聊天室成员列表

所有聊天室成员均可调用 `asyncFetchChatRoomMembers` 方法获取当前聊天室成员列表。服务器不对成员进行排序，因此，返回的成员列表不保证有序。

示例代码如下：

```java
// 异步方法。
// cursor：从该游标位置开始取数据。首次调用时传空值，从最新数据开始获取。
// pageSize：每页期望返回的成员数，最大值为 1,000。
EMClient.getInstance().chatroomManager().asyncFetchChatRoomMembers(
        chatRoomId, cursor, pageSize, new EMValueCallBack<EMCursorResult<String>>() {
            @Override
            public void onSuccess(EMCursorResult<String> value) {
                // 获取成员列表成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 获取成员列表失败。
            }
        });
```

## 管理聊天室黑名单

### 将成员加入聊天室黑名单

仅聊天室所有者和管理员可调用 `EMChatRoomManager#asyncBlockChatroomMembers` 方法将指定成员添加至黑名单。

被加入黑名单后，该成员收到 `EMChatRoomChangeListener#onRemovedFromChatRoom` 回调。默认情况下，其他成员不会收到事件通知。如需该事件，请联系商务开通。

被加入黑名单后，该成员无法再收发聊天室消息并被移出聊天室，黑名单中的成员如想再次加入聊天室，聊天室所有者或管理员必须先将其移出黑名单列表。

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncBlockChatroomMembers(
        chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // 加入黑名单成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 加入黑名单失败。
            }
        });
```

### 将成员移出聊天室黑名单

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#asyncUnBlockChatRoomMembers` 方法将成员移出聊天室黑名单。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncUnBlockChatRoomMembers(
        chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // 移出黑名单成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 移出黑名单失败。
            }
        });
```

### 获取聊天室黑名单列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#asyncFetchChatRoomBlackList` 方法获取当前聊天室黑名单。

示例代码如下：

```java
// 异步方法。
// pageNum	当前页码，从 1 开始。
// pageSize	每页期望获取的黑名单中的成员数。取值范围为 [1,50]。
EMClient.getInstance().chatroomManager().asyncFetchChatRoomBlackList(
        chatRoomId, pageNum, pageSize, new EMValueCallBack<List<String>>() {
            @Override
            public void onSuccess(List<String> value) {
                // 获取黑名单成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 获取黑名单失败。
            }
        });
```

## 管理聊天室白名单

聊天室所有者和管理员默认会被加入聊天室白名单。

聊天室白名单中的成员在聊天室中发送的消息为高优先级，会优先送达，但不保证必达。当负载较高时，服务器会优先丢弃低优先级的消息。若即便如此负载仍很高，服务器也会丢弃高优先级消息。

### 获取聊天室白名单列表

仅聊天室所有者和管理员可以调用 `fetchChatRoomWhiteList` 获取当前聊天室白名单成员列表。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().fetchChatRoomWhiteList(chatRoomId, new EMValueCallBack<List<String>>() {
    @Override
    public void onSuccess(List<String> value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### 检查自己是否在聊天室白名单中

所有聊天室成员可以调用 `checkIfInChatRoomWhiteList` 方法检查自己是否在聊天室白名单中，示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().checkIfInChatRoomWhiteList(chatRoomId, new EMValueCallBack<Boolean>() {
    @Override
    public void onSuccess(Boolean value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### 将成员加入聊天室白名单

仅聊天室所有者和管理员可以调用 `addToChatRoomWhiteList` 将成员加入聊天室白名单。被添加白名单的成员会收到 `onWhiteListAdded` 事件。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().addToChatRoomWhiteList(chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### 将成员移出聊天室白名单列表

仅聊天室所有者和管理员可以调用 `removeFromChatRoomWhiteList` 将成员从聊天室白名单移出。被移出白名单的成员会收到 `onWhiteListRemoved` 事件。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().removeFromChatRoomWhiteList(chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

## 管理聊天室禁言列表

### 添加成员至聊天室禁言列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#asyncMuteChatRoomMembers` 方法将指定成员添加至聊天室禁言列表。被禁言的成员和其他未操作的聊天室管理员或聊天室所有者收到 `EMChatRoomChangeListener#onMuteListAdded` 回调。

:::tip
聊天室所有者可禁言聊天室所有成员，聊天室管理员可禁言聊天室普通成员。
:::

示例代码如下：

```java
// 异步方法。
// `duration`：禁言时间。传 -1 表示永久禁言。
EMClient.getInstance().chatroomManager().asyncMuteChatRoomMembers(
        chatRoomId, members, duration, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // 添加禁言成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 添加禁言失败。
            }
        });
```

### 将成员移出聊天室禁言列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#asyncUnMuteChatRoomMembers` 方法将成员移出聊天室禁言列表。被解除禁言的成员和其他未操作的聊天室管理员或聊天室所有者收到 `EMChatRoomChangeListener#onMuteListRemoved` 回调。

:::tip
聊天室所有者可对聊天室所有成员解除禁言，聊天室管理员可对聊天室普通成员解除禁言。
:::

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncUnMuteChatRoomMembers(
        chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // 解除禁言成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 解除禁言失败。
            }
        });
```

### 获取聊天室禁言列表

仅聊天室所有者和管理员可调用 `asyncFetchChatRoomMuteList` 获取聊天室禁言列表。

示例代码如下：

```java
// 异步方法。
// pageNum	当前页码，从 1 开始。
// pageSize	每页期望返回的禁言成员数。取值范围为 [1,50]。
EMClient.getInstance().chatroomManager().asyncFetchChatRoomMuteList(
        chatRoomId, pageNum, pageSize, new EMValueCallBack<Map<String, Long>>() {
            @Override
            public void onSuccess(Map<String, Long> value) {
                // 获取禁言列表成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 获取禁言列表失败。
            }
        });
```

### 检查自己是否在聊天室禁言列表

聊天室成员可以调用 `asyncCheckIfInMuteList` 方法查看自己是否在聊天室禁言列表。

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncCheckIfInMuteList(chatRoomId, new EMValueCallBack<Boolean>() {
            @Override
            public void onSuccess(Boolean inMuteList) {
                if(inMuteList) {
                    EMLog.d( TAG,"you are in the mutelist of chatroom");
                }else{
                    EMLog.d( TAG,"you are not in the mutelist of chatroom");
                }

            }

            @Override
            public void onError(int error, String errorMsg) {
                EMLog.d( TAG,"asyncCheckIfInMuteList error:"+error+" errorMsg:"+errorMsg);
            }
        });
```

## 开启和关闭聊天室全员禁言

为了快捷管理聊天室发言，聊天室所有者和管理员可以开启和关闭聊天室全员禁言。全员禁言和单独的成员禁言不冲突，设置或者解除全员禁言，原禁言列表并不会变化。

### 开启全员禁言

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#muteAllMembers` 方法开启全员禁言。全员禁言开启后不会在一段时间内自动解除禁言，需要调用 `EMChatRoomManager#unmuteAllMembers` 方法解除禁言。

全员禁言开启后，除了在白名单中的成员，其他成员不能发言。调用成功后，聊天室成员会收到 `EMChatRoomChangeListener#onAllMemberMuteStateChanged` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().muteAllMembers(chatRoomId, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### 关闭全员禁言

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#unmuteAllMembers` 方法取消全员禁言。调用成功后，聊天室成员会收到 `EMChatRoomChangeListener#onAllMemberMuteStateChanged` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().unmuteAllMembers(chatRoomId, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## 管理聊天室所有者和管理员

聊天室创建者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。

### 变更聊天室所有者

仅聊天室所有者可以调用 `EMChatRoomManager#asyncChangeOwner` 方法将权限移交给聊天室中指定成员。成功移交后，原聊天室所有者变为聊天室成员，新的聊天室所有者和聊天室管理员收到 `EMChatRoomChangeListener#onOwnerChanged` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncChangeOwner(
        chatRoomId, newOwner, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // 所有者变更成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 所有者变更失败。
            }
        });
```

### 添加聊天室管理员

仅聊天室所有者可以调用 `EMChatRoomManager#asyncAddChatRoomAdmin` 方法添加聊天室管理员。成功添加后，新管理员及其他管理员收到 `EMChatRoomChangeListener#onAdminAdded` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncAddChatRoomAdmin(
        chatRoomId, admin, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // 添加管理员成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 添加管理员失败。
            }
        });
```

### 移除聊天室管理员

仅聊天室所有者可以调用 `EMChatRoomManager#asyncRemoveChatRoomAdmin` 方法移除聊天室管理员。成功移除后，被移除的管理员及其他管理员收到 `EMChatRoomChangeListener#onAdminRemoved` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAdmin(
        chatRoomId, admin, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // 移除管理员成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 移除管理员失败。
            }
        });
```

## 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncFetchChatRoomMembers`](#获取聊天室成员列表) | `EMChatRoomManager` | 异步分页获取聊天室成员列表。 |
| [`asyncBlockChatroomMembers`](#将成员加入聊天室黑名单) | `EMChatRoomManager` | 异步将成员加入聊天室黑名单。 |
| [`asyncUnBlockChatRoomMembers`](#将成员移出聊天室黑名单) | `EMChatRoomManager` | 异步将成员移出聊天室黑名单。 |
| [`asyncFetchChatRoomBlackList`](#获取聊天室黑名单列表) | `EMChatRoomManager` | 异步获取聊天室黑名单。 |
| [`fetchChatRoomWhiteList`](#获取聊天室白名单列表) | `EMChatRoomManager` | 获取聊天室白名单。 |
| [`checkIfInChatRoomWhiteList`](#检查自己是否在聊天室白名单中) | `EMChatRoomManager` | 检查当前用户是否在白名单中。 |
| [`addToChatRoomWhiteList`](#将成员加入聊天室白名单) | `EMChatRoomManager` | 将成员加入白名单。 |
| [`removeFromChatRoomWhiteList`](#将成员移出聊天室白名单列表) | `EMChatRoomManager` | 将成员移出白名单。 |
| [`asyncMuteChatRoomMembers`](#添加成员至聊天室禁言列表) | `EMChatRoomManager` | 异步将成员加入禁言列表。 |
| [`asyncUnMuteChatRoomMembers`](#将成员移出聊天室禁言列表) | `EMChatRoomManager` | 异步将成员移出禁言列表。 |
| [`asyncFetchChatRoomMuteList`](#获取聊天室禁言列表) | `EMChatRoomManager` | 异步获取禁言列表。 |
| [`asyncCheckIfInMuteList`](#检查自己是否在聊天室禁言列表) | `EMChatRoomManager` | 检查当前用户是否在禁言列表中。 |
| [`muteAllMembers`](#开启全员禁言) | `EMChatRoomManager` | 开启聊天室全员禁言。 |
| [`unmuteAllMembers`](#关闭全员禁言) | `EMChatRoomManager` | 关闭聊天室全员禁言。 |
| [`asyncChangeOwner`](#变更聊天室所有者) | `EMChatRoomManager` | 异步变更聊天室所有者。 |
| [`asyncAddChatRoomAdmin`](#添加聊天室管理员) | `EMChatRoomManager` | 异步添加聊天室管理员。 |
| [`asyncRemoveChatRoomAdmin`](#移除聊天室管理员) | `EMChatRoomManager` | 异步移除聊天室管理员。 |
