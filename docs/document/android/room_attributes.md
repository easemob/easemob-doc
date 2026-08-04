# 管理聊天室属性

## 功能说明

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，key 和 value 均为字符串，属性信息变更会实时同步给聊天室成员。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)；
- 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 管理聊天室基本属性

### 获取聊天室详情

聊天室所有成员均可调用 `asyncFetchChatRoomFromServer` 获取聊天室详情，包括聊天室 ID、聊天室名称、聊天室描述、最大成员数、聊天室所有者、是否全员禁言以及当前用户在聊天室中的角色类型。聊天室公告、管理员列表、成员列表、黑名单列表和禁言列表需要分别调用对应接口获取。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance()
        .chatroomManager()
        .asyncFetchChatRoomFromServer(
                chatRoomId,
                new EMValueCallBack<EMChatRoom>() {
                    @Override
                    public void onSuccess(EMChatRoom chatRoom) {
                        // 获取聊天室详情成功。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 获取聊天室详情失败。
                    }
                });
```

### 获取聊天室公告

聊天室所有成员均可调用 `asyncFetchChatRoomAnnouncement` 方法获取聊天室公告。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncFetchChatRoomAnnouncement(
        chatRoomId,
        new EMValueCallBack<String>() {
            @Override
            public void onSuccess(String announcement) {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### 更新聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `asyncUpdateChatRoomAnnouncement` 方法设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `onAnnouncementChanged` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncUpdateChatRoomAnnouncement(
        chatRoomId,
        announcement,
        new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }

            @Override
            public void onProgress(int progress, String status) {
            }
        });
```

### 修改聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `asyncChangeChatRoomSubject` 方法设置和修改聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncChangeChatRoomSubject(
        chatRoomId,
        newSubject,
        new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom chatRoom) {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### 修改聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `asyncChangeChatroomDescription` 方法设置和修改聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncChangeChatroomDescription(
        chatRoomId,
        newDescription,
        new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom chatRoom) {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

## 管理聊天室自定义属性（key-value）

### 获取聊天室指定自定义属性

聊天室所有成员均可调用 `asyncFetchChatroomAttributesFromServer` 方法获取聊天室指定自定义属性。

示例代码如下：

```java
// 异步方法。
// `keyList` 表示要获取的 Key 列表；传 `null` 获取全部属性。
EMClient.getInstance().chatroomManager().asyncFetchChatroomAttributesFromServer(
    conversationId, 
    keyList, 
    new EMValueCallBack<Map<String, String>>() {
        @Override
        public void onSuccess(Map<String, String> value) {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
});
```

### 获取聊天室所有自定义属性

聊天室成员可以调用 `asyncFetchChatRoomAllAttributesFromServer` 方法获取聊天室所有自定义属性。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncFetchChatRoomAllAttributesFromServer(
    conversationId, 
    new EMValueCallBack<Map<String, String>>() {
        @Override
        public void onSuccess(Map<String, String> value) {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
});
```

### 设置单个聊天室属性

聊天室成员可以调用 `asyncSetChatroomAttribute` 方法设置或更新单个聊天室自定义属性。该方法只可添加新自定义属性字段和更新自己设置的现有属性。设置后，其他聊天室成员收到 `onAttributesUpdate` 回调。

示例代码如下：

```java
// 异步方法。
// `autoDelete` 表示退出时是否自动删除，默认 `true`。 
EMClient.getInstance().chatroomManager().asyncSetChatroomAttribute(
    conversationId,
    attributeKey,
    attributeValue,
    autoDelete, 
    new EMCallBack() {
        @Override
        public void onSuccess() {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
});
```

### 强制设置单个聊天室属性

如果除了设置或更新自己的单个自定义属性还需覆盖其他聊天室成员设置的该属性，需调用 `asyncSetChatroomAttributeForced` 方法。设置后，其他聊天室成员收到 `onAttributesUpdate` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncSetChatroomAttributeForced(
    conversationId,
    attributeKey,
    attributeValue,
    // 退出时是否自动删除，默认 `true`。
    autoDelete, 
    new EMCallBack() {
        @Override
        public void onSuccess() {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
});
```

### 设置多个聊天室自定义属性

聊天室成员可以调用 `asyncSetChatroomAttributes` 方法设置或更新多个聊天室自定义属性。该方法只能添加新属性字段以及更新当前用户已添加的属性字段。设置后，其他聊天室成员收到 `onAttributesUpdate` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncSetChatroomAttributes(
    conversationId, 
    // 属性键值对。`Map<String,String>` 类型。
    attributeMap, 
    // 退出时是否自动删除，默认 `true`。
    autoDelete, 
    new EMResultCallBack<Map<String, Integer>>() {
        @Override
        public void onResult(int code, Map<String, Integer> value) {
            if (code == EMError.EM_NO_ERROR) { // onResult 返回值 code 为 EMError.EM_NO_ERROR，表明自定义属性成功添加。

            }else { // onResult 返回值不为 EMError.EM_NO_ERROR，表明一些自定义属性因长度超限等原因添加失败。

            }
        }
});
```

### 强制设置多个聊天室属性

如果除了设置自己的多个自定义属性还需覆盖其他聊天室成员设置的这些属性，需调用 `asyncSetChatroomAttributesForced` 方法。设置后，其他聊天室成员收到 `onAttributesUpdate` 回调。

示例代码如下：

```java
// 异步方法。
// `autoDelete` 表示退出时是否自动删除，默认 `true`。
EMClient.getInstance().chatroomManager().asyncSetChatroomAttributesForced(
    conversationId, 
    attributeMap, 
    autoDelete, 
    new EMResultCallBack<Map<String, Integer>>() {
        @Override
        public void onResult(int code, Map<String, Integer> value) {
            if (code == EMError.EM_NO_ERROR) { // onResult 返回值 code 为 EMError.EM_NO_ERROR，表明自定义属性成功添加。

            }else { // onResult 返回值不为 EMError.EM_NO_ERROR，表明一些自定义属性因长度超限等原因添加失败。

            }
        }
});
```

### 删除单个聊天室自定义属性

聊天室成员可以调用 `asyncRemoveChatRoomAttributeFromServer` 方法删除单个聊天室自定义属性。该方法只能删除自己设置的自定义属性。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributeFromServer(
    conversationId,
    key, 
    new EMCallBack() {
        @Override
        public void onSuccess() {
        }

        @Override
        public void onError(int code, String error) {
        }
});
```

### 强制删除单个聊天室自定义属性

如果除了删除自己设置的单个自定义属性还需删除其他聊天室成员设置的该属性，需调用 `asyncRemoveChatRoomAttributeFromServerForced` 方法。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributeFromServerForced(
    conversationId,
    key, 
    new EMCallBack() {
        @Override
        public void onSuccess() {
        }

        @Override
        public void onError(int code, String error) {
        }
});
```

### 删除多个聊天室自定义属性

聊天室成员可以调用 `asyncRemoveChatRoomAttributesFromServer` 方法删除多个聊天室自定义属性。该方法只能删除自己设置的自定义属性。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```java
// 异步方法。
// `keyList` 表示要删除的属性 Key 列表，不能为空。该列表为 `List<String>` 类型。
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributesFromServer(
    conversationId,
    keyList,
    new EMResultCallBack<Map<String, Integer>>() {
        @Override
        public void onResult(int code, Map<String, Integer> value) {
            // code 为 EMError.EM_NO_ERROR 时，全部属性删除成功；
            // value 包含未成功删除的属性键及对应错误码。
        }
    });
```

### 强制删除多个聊天室自定义属性

如果除了删除自己设置的多个自定义属性还需删除其他聊天室成员设置的这些属性，需调用 `asyncRemoveChatRoomAttributesFromServerForced` 方法。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```java
// 异步方法。
// `keyList` 表示要删除的属性 Key 列表，不能为空。该列表为 `List<String>` 类型。
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributesFromServerForced(
    conversationId,
    keyList, 
    new EMResultCallBack<Map<String, Integer>>() {
        @Override
        public void onResult(int code,Map<String, Integer> value) {

        }
});
```

## 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncFetchChatRoomFromServer`](#获取聊天室详情) | `EMChatRoomManager` | 异步从服务器获取聊天室详情。 |
| [`asyncFetchChatRoomAnnouncement`](#获取聊天室公告) | `EMChatRoomManager` | 异步获取聊天室公告。 |
| [`asyncUpdateChatRoomAnnouncement`](#更新聊天室公告) | `EMChatRoomManager` | 异步更新聊天室公告。 |
| [`asyncChangeChatRoomSubject`](#修改聊天室名称) | `EMChatRoomManager` | 异步修改聊天室名称。 |
| [`asyncChangeChatroomDescription`](#修改聊天室描述) | `EMChatRoomManager` | 异步修改聊天室描述。 |
| [`asyncFetchChatroomAttributesFromServer`](#获取聊天室指定自定义属性) | `EMChatRoomManager` | 获取指定自定义属性。 |
| [`asyncFetchChatRoomAllAttributesFromServer`](#获取聊天室所有自定义属性) | `EMChatRoomManager` | 获取全部自定义属性。 |
| [`asyncSetChatroomAttribute`](#设置单个聊天室属性) | `EMChatRoomManager` | 设置或更新单个自定义属性。 |
| [`asyncSetChatroomAttributes`](#设置多个聊天室自定义属性) | `EMChatRoomManager` | 设置或更新多个自定义属性。 |
| [`asyncRemoveChatRoomAttributeFromServer`](#删除单个聊天室自定义属性) | `EMChatRoomManager` | 删除单个自定义属性。 |
| [`asyncRemoveChatRoomAttributesFromServer`](#删除多个聊天室自定义属性) | `EMChatRoomManager` | 删除多个自定义属性。 |



