# 管理聊天室属性

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，属性信息变更会实时同步给聊天室成员。

本文介绍如何管理聊天室属性信息。

## 技术原理

环信即时通讯 IM SDK 提供 `EMChatRoomManager` 类和 `EMChatRoom` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- 获取和更新聊天室基本属性（名称，描述和公告）；
- 获取聊天室自定义属性；
- 设置聊天室自定义属性；
- 删除聊天室自定义属性。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)；
- 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

### 管理聊天室基本属性

对于聊天室名称和描述，你可以调用 [`fetchChatRoomFromServer`](room_manage.html#获取聊天室详情) 获取聊天室详情时查看。

#### 获取聊天室公告

聊天室所有成员均可调用 `fetchChatRoomAnnouncement` 方法获取聊天室公告。

示例代码如下：

```java
// 同步方法
String announcement = EMClient.getInstance().chatroomManager().fetchChatRoomAnnouncement(chatRoomId);
```

#### 更新聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `updateChatRoomAnnouncement` 方法设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `onAnnouncementChanged` 回调。

示例代码如下：

```java
// 同步方法
EMClient.getInstance().chatroomManager().updateChatRoomAnnouncement(chatRoomId, announcement);
```

#### 修改聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `changeChatRoomSubject` 方法设置和修改聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```java
// 同步方法
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().changeChatRoomSubject(chatRoomId, newSubject);
```

#### 修改聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `changeChatroomDescription` 方法设置和修改聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```java
// 同步方法
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().changeChatroomDescription(chatRoomId, newDescription);
```

### 管理聊天室自定义属性（key-value）

#### 获取聊天室指定自定义属性

聊天室所有成员均可调用 `asyncFetchChatroomAttributesFromServe` 方法获取聊天室指定自定义属性。

示例代码如下：

```java
/**
 * 异步方法。
 *
 * @param String chatRoomId         聊天室 ID。
 * @param List<String> keyList      聊天室自定义属性的 Key 列表。传 `null` 返回所有自定义属性。
 * @param callBack                  结果回调，成功时回调 {@link EMValueCallBack#onSuccess(Object)}，
 *                                  失败时回调 {@link EMValueCallBack#onError(int, String)}。
 */
EMClient.getInstance().chatroomManager().asyncFetchChatroomAttributesFromServe(conversationId, keyList, new EMValueCallBack<Map<String, String>>() {
                @Override
                public void onSuccess(Map<String, String> value) {

                }

                @Override
                public void onError(int error, String errorMsg) {

                }
            });
```

#### 获取聊天室所有自定义属性

聊天室成员可以调用 `asyncFetchChatRoomAllAttributesFromSever` 方法获取聊天室所有自定义属性。

示例代码如下：

```java
/**
 * 异步方法。
 *
 * @param String chatRoomId         聊天室 ID。
 * @param callBack                  结果回调，成功时回调 {@link EMValueCallBack#onSuccess(Object)}，
 *                                  失败时回调 {@link EMValueCallBack#onError(int, String)}。
 */
EMClient.getInstance().chatroomManager().asyncFetchChatRoomAllAttributesFromSever(conversationId, new EMValueCallBack<Map<String, String>>() {
                @Override
                public void onSuccess(Map<String, String> value) {

                }

                @Override
                public void onError(int error, String errorMsg) {

                }
            });
```

#### 设置单个聊天室属性

聊天室成员可以调用 `asyncSetChatroomAttributes` 方法设置单个聊天室自定义属性。该方法只可添加新自定义属性字段和更新自己设置的现有属性。设置后，其他聊天室成员收到 `onAttributesUpdate` 回调。

示例代码如下：

```java
/**
 * 异步方法。
 *
 * @param String  chatRoomId            聊天室 ID。
 * @param String  attributeKey          聊天室属性的 key。
 * @param String  attributeValue        聊天室属性的 value。
 * @param boolean autoDelete            当前成员退出聊天室时是否自动删除该聊天室中其设置的所有自定义属性。
 *       - （默认）`true`：是；
 *       - `false`：否。
 */
EMClient.getInstance().chatroomManager().asyncSetChatroomAttribute(conversationId,attributeKey,attributeValue,false, new EMResultCallBack<Map<String, String>>() {
                @Override
                public void onSuccess() {

                }

                @Override
                public void onError(int error, String errorMsg) {

                }
            });
```

若要覆盖其他聊天室成员设置的自定义属性，需调用 `asyncSetChatroomAttributesForced` 方法。设置后，其他聊天室成员收到 `onAttributesUpdate` 回调。

示例代码如下：

```java
/**
 * 异步方法。
 *
 * @param String  chatRoomId            聊天室 ID。
 * @param String  attributeKey          聊天室属性的 key。
 * @param String  attributeValue        聊天室属性的 value。
 * @param boolean autoDelete            当前成员退出聊天室时是否自动删除该聊天室中其设置的所有自定义属性。
 *       - （默认）`true`：是；
 *       - `false`：否。
 */
EMClient.getInstance().chatroomManager().asyncSetChatroomAttributesForced(conversationId,attributeKey,attributeValue,false, new EMResultCallBack<Map<String, String>>() {
                @Override
                public void onSuccess() {

                }

                @Override
                public void onError(int error, String errorMsg) {

                }
            });
```

#### 设置多个聊天室自定义属性

聊天室成员可以调用 `asyncSetChatroomAttributes` 方法设置多个聊天室自定义属性。该方法只能添加新属性字段以及更新当前用户已添加的属性字段。设置后，其他聊天室成员收到 `onAttributesUpdate` 回调。

示例代码如下：

```java
/**
 * 异步方法。
 *
 * @param String chatRoomId             聊天室 ID。
 * @param Map<String,String> map        聊天室自定义属性集合，为键值对（key-value）结构。
 * @param boolean autoDelete            当前成员退出聊天室时是否自动删除该聊天室中其设置的所有自定义属性。
 *       - （默认）`true`：是；
 *       - `false`：否。
 */
    EMClient.getInstance().chatroomManager().asyncSetChatroomAttributes(conversationId, map, false, new EMResultCallBack<Map<String, String>>() {
                @Override
                public void onSuccess(int code,Map<String, String> value) {
                    if (code == 0){ // onSuccess 返回值 code 为 0，表明自定义属性成功添加。
                    }else { // onSuccess 返回值不为 0，表明一些自定义属性因长度超限等原因添加失败。

                    }
                }

                @Override
                public void onError(int error, String errorMsg) {

                }
            });
```

若要覆盖其他聊天室成员设置的自定义属性，需调用 `asyncSetChatroomAttributesForced` 方法。设置后，其他聊天室成员收到 `onAttributesUpdate` 回调。

示例代码如下：

```java
/**
 * 异步方法。
 *
 * @param String chatRoomId             聊天室 ID。
 * @param Map<String,String> map        聊天室自定义属性集合，为键值对（key-value）结构。
 * @param boolean autoDelete            当前成员退出聊天室时是否自动删除该聊天室中其设置的所有自定义属性。
 *       - （默认）`true`：是；
 *       - `false`：否。
 */
    EMClient.getInstance().chatroomManager().asyncSetChatroomAttributesForced(conversationId, map, false, new EMResultCallBack<Map<String, String>>() {
                @Override
                public void onSuccess(int code,Map<String, String> value) {
                    if (code == 0){ // onSuccess 返回值 code 为 0，表明自定义属性成功添加。

                    }else { // onSuccess 返回值不为 0，表明一些自定义属性因长度超限等原因添加失败。

                    }
                }

                @Override
                public void onError(int error, String errorMsg) {

                }
            });
```

#### 删除单个聊天室自定义属性

聊天室成员可以调用 `asyncRemoveChatRoomAttributesFromSever` 方法删除单个聊天室自定义属性。该方法只能删除自己设置的自定义属性。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```java
/**
 * 异步方法。
 *
 * @param String chatRoomId         聊天室 ID。
 * @param String attributeKey       聊天室属性的 key。
 * @param callBack                  结果回调，成功时回调 {@link EMResultCallBack#onSuccess(int,Object)}，
 *                                  失败时回调 {@link EMResultCallBack#onError(int, String)}。
 */
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributesFromSever(conversationId,attributeKey, new EMResultCallBack<Map<String, String>>() {
                    @Override
                    public void onSuccess(int code,Map<String, String> value) {

                    }

                    @Override
                    public void onError(int error, String errorMsg) {

                    }
                });
```

若要删除其他聊天室成员设置的自定义属性，需调用 `asyncRemoveChatRoomAttributesFromSeverForced` 方法。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```java
/**
 * 异步方法。
 *
 * @param String chatRoomId         聊天室 ID。
 * @param String attributeKey       聊天室属性的 key。
 * @param callBack                  结果回调，成功时回调 {@link EMResultCallBack#onSuccess(int,Object)}，
 *                                  失败时回调 {@link EMResultCallBack#onError(int, String)}。
 */
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributesFromSeverForced(conversationId,attributeKey, new EMResultCallBack<Map<String, String>>() {
                    @Override
                    public void onSuccess() {

                    }

                    @Override
                    public void onError(int error, String errorMsg) {

                    }
                });
```

#### 删除多个聊天室自定义属性

聊天室成员可以调用 `asyncRemoveChatRoomAttributesFromSever` 方法删除多个聊天室自定义属性。该方法只能删除自己设置的自定义属性。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```java
/**
 * 异步方法。
 *
 * @param String chatRoomId         聊天室 ID。
 * @param List<String> keyList      聊天室自定义属性的 key 列表。
 * @param callBack                  结果回调，成功时回调 {@link EMResultCallBack#onSuccess(int,Object)}，
 *                                  失败时回调 {@link EMResultCallBack#onError(int, String)}。
 */
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributesFromSever(conversationId,keyList, new EMResultCallBack<Map<String, String>>() {
                    @Override
                    public void onSuccess(int code,Map<String, String> value) {

                    }

                    @Override
                    public void onError(int error, String errorMsg) {

                    }
                });
```

若要删除其他聊天室成员设置的自定义属性，需调用 `asyncRemoveChatRoomAttributesFromSeverForced` 方法。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```java
/**
 * 异步方法。
 *
 * @param String chatRoomId         聊天室 ID。
 * @param List<String> keyList      聊天室自定义属性的 key 列表。
 * @param callBack                  结果回调，成功时回调 {@link EMResultCallBack#onSuccess(int,Object)}，
 *                                  失败时回调 {@link EMResultCallBack#onError(int, String)}。
 */
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAttributesFromSeverForced(conversationId,keyList, new EMResultCallBack<Map<String, String>>() {
                    @Override
                    public void onSuccess(int code,Map<String, String> value) {

                    }

                    @Override
                    public void onError(int error, String errorMsg) {

                    }
                });
```

### 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。