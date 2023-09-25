# 会话管理

环信桌面端 SDK 支持会话管理的集成，集成后可以进行如下操作：

- 会话处理

- 获取消息

- 消息处理

通过这些操作，可以组合帮助您完成多种场景下的 IM 需求。

会话管理模块为 EMChatManager，由 EMClient 模块加载时主动创建，可以使用 EMClient 模块的 getChatManager 方法获取，代码如下：

```
var chatManager = emclient.getChatManager();
```

------

## 会话处理

会话处理包含以下处理操作：

- 获取会话列表

- 根据 ID 获取会话

- 删除会话

- 获取会话属性

- 会话属性扩展

所有处理操作的示例下面会一一说明。

------

### 获取会话列表

接口 API 如下：

```
/** 
 * 获取会话列表
 * return 返回会话列表，EMConversation 数组
 */
getConversations()
```

调用方法如下:

```
var convlist = chatManager.getConversations();
```

------

### 根据 ID 获取会话

根据会话 ID 获取会话，接口 API 如下：

```
/** 
 * 获取会话
 * param conversationId 会话 ID，输入参数，String
 * param type 会话类型，输入参数，0为单聊，1为群聊
 * return 会话，EMConversation
 */
conversationWithType(conversationId,type)
```

调用方法如下:

```
let conversationlist = chatManager.conversationWithType(conversationId,type);
```

------

### 删除会话

接口 API 如下：

```
/** 根据 ID 删除会话
 * param conversationId 会话 ID,输入参数
 * param isRemoveMessages 是否删除消息，ture 为删除
 */
removeConversation(conversationId，isRemoveMessages)
```

调用方法如下:

```
chatManager.removeConversation(conversationId，true);
```

------

### 获取会话属性

```
// 获取会话 ID
console.log("conversationId" + conversation.conversationId());
// 获取会话类型，0为单聊，1为群聊
console.log("conversationType" + conversation.conversationType());
```

------

### 会话扩展属性

接口 API 如下：

```
/** 
 * 设置会话扩展属性
 * param ext 扩展属性，String
 */
setExtField(strAttr)
/** 
 * 获取会话扩展属性
 * return 扩展属性，String
 */
extField()
```

调用方法如下：

```
conversation.setExtField(ext);
var strAttr = conversation.extField();
```

------

## 获取消息

获取消息包含以下处理操作：

- 获取历史消息

- 根据 ID 获取当前会话消息

- 获取会话中的消息计数

- 获取会话中的未读消息计数

- 获取最新消息

所有处理操作的示例下面会一一说明。

------

### 获取历史消息

接口 API 如下：

```
/** 
 * 分页获取历史消息,从服务器获取
 * param conversationId 会话 ID,输入参数
 * param type 会话类型，1为群组，0为单聊
 * param pageSize 每页的消息计数
 * param startMsgId 起始消息 ID
 * return 返回 Promise 对象，response 参数为 MessageListResult
 */
chatManager.fetchHistoryMessages(conversationId, type, pageSize, startMsgId)
```

调用方法如下:

```
chatManager.fetchHistoryMessages(conversationId, type, pageSize, startMsgId).then((res) => {},(error) => {});
```

------

### 根据 ID 获取当前会话消息

根据消息 ID 获取当前会话消息，接口 API 如下：

```
/** 
 * 根据消息 ID 获取消息
 * param msgid 消息 ID
 * return 未读消息计数
 */
loadMessage(msgid)
```

调用方法如下：

```
var msg = conversation.loadMessage(msgid);
```

------

### 获取会话中的消息计数

接口 API 如下：

```
/** 
 * 获取会话中的消息计数
 * return 消息计数,Number
 */
messagesCount()
```

调用方法如下：

```
var msgCount = conversation.messagesCount();
```

------

### 获取会话中的未读消息计数

接口 API 如下：

```
/** 
 * 获取会话中的未读消息计数
 * return 未读消息计数,Number
 */
unreadMessagesCount()
```

调用方法如下：

```
var unreaddMsgCount = conversation.unreadMessagesCount();
```

------

### 获取最新一条消息

接口 API 如下：

```
/** 
 * 获取会话中的最新一条消息
 * return EMMessage 消息对象
 */
latestMessage()
```

调用方法如下：

```
var msg = conversation.latestMessage();
```

------

## 消息处理

消息处理包含以下处理操作：

- 插入消息

- 添加消息

- 修改消息

- 加载会话消息

- 删除会话消息

- 清空会话消息

- 下载图片、附件

- 设置消息已读状态

所有处理操作的示例下面会一一说明。

------

### 插入消息

接口 API 如下：

```
/**
  * 不发送消息，只是插入到本地，按照时间插入到本地数据库
  * param messagelist 要插入的消息列表，EMMessage 数组
  * return 返回操作结果，Bool
*/
insertMessages(messagelist);
```

调用方法如下:

```
chatManager.insertMessages(messagelist);
```

------

### 添加消息

接口 API 如下：

```
/**
  * 在末尾添加一条消息
  * param message 要插入的消息，EMMessage 对象
  * return 返回操作结果，Bool
*/
appendMessage(message);
```

调用方法如下:

```
chatManager.appendMessage(message);
```

------

### 修改消息

接口 API 如下：

```
/**
  * 修改一条消息，不能改变消息 ID
  * param message 要插入的消息，EMMessage 对象
  * return 返回操作结果，Bool
*/
updateMessage(message);
```

调用方法如下:

```
chatManager.updateMessage(message);
```

------

### 加载会话消息

接口 API 如下：

```
/** 
 * 按照 ID 加载会话消息
 * param refMsgId 起始消息 ID,输入参数，空为最新消息,String
 * param count 加载的消息数，输入参数,Number
 * param direction 消息加载方向填0
 * return 返回为 EMMessage 数组
 */
loadMoreMessagesByMsgId(refMsgId, count, direction);

/** 
 * 按照时间加载会话消息
 * param timeStamp 起始消息时间，输入参数
 * param count 加载的消息数，输入参数
 * param direction 消息加载方向，填0
 * return 返回EMMessage数组
 */
conversation.loadMoreMessagesByTime(timeStamp, count, direction);
```

调用方法如下:

```
conversation.loadMoreMessagesByMsgId("", 20,0);
conversation.loadMoreMessagesByTime(timeStamp, 20,0);
```

------

### 删除会话消息

接口 API 如下：

```
/** 
 * 按照 ID 移除会话消息，只操作缓存和本地数据库
 * param messageId 要删除的消息 ID
 * return 返回操作结果，bool 型
 */
removeMessage(messageId)
```

调用方法如下:

```
conversation.removeMessage(messageId).then((res)=>{},(error) => {});
```

------

### 清空会话消息

接口 API 如下：

```
/** 
 * 清空会话消息，只操作缓存和本地数据库
 * return 返回操作结果，bool 型
 */
clearAllMessages()
```

调用方法如下:

```
conversation.clearAllMessages();
```

------

### 下载图片、附件

```
// 下载附件消息，message 为 EMMessage 对象，可在 message 中设置回调
chatManager.downloadMessageAttachments(message);
// 下载图片缩略，message 为 EMMessage 对象，可在 message 中设置回调
chatManager.downloadMessageThumbnail(message);
```

------

### 设置消息已读状态

接口 API 如下：

```
/** 
 * 根据消息 ID 标记消息已读状态
 * param msgid，消息 ID
 * isread bool，已读状态
 * return 返回操作结果，bool 型
 */
markMessageAsRead(msgid,isread);
/** 
 * 标记会话中所有消息的已读状态
 * isread bool，已读状态
 * return 返回操作结果，bool 型
 */
markAllMessagesAsRead(isread);
```

调用方法如下:

```
conversation.markMessageAsRead(msgid,isread);
conversation.markAllMessagesAsRead(isread);
```