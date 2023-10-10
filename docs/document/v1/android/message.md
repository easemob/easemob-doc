# 消息管理

## 发送消息

发送文本、语音、图片、位置等消息（单聊/群聊通用）。

### 发送文本消息

```
//创建一条文本消息，content为消息文字内容，toChatUsername为对方用户或者群聊的id，后文皆是如此
EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername);
//如果是群聊，设置chattype，默认是单聊
if (chatType == CHATTYPE_GROUP)
	message.setChatType(ChatType.GroupChat);
//发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

### 发送表情消息

发表情消息实质上是发文本消息。接收方收到文本消息后，首先查询文本消息是否是表情消息，如果是，则显示该文本消息为对应的表情图片。可以参考[emoji列表](https://unicode.org/emoji/charts/full-emoji-list.html)来做表情图片和对应的文本字符串的映射。也可以自行维护表情图片和文本字符串的映射。

```
//创建一条表情消息。表情消息实质上是一个文字消息。emojiCode是表情图片对应的文本字符串，toChatUsername为对方用户或者群聊的id，后文皆是如此
EMMessage message = EMMessage.createTxtSendMessage(emojiCode, toChatUsername);
//如果是群聊，设置chattype，默认是单聊
if (chatType == CHATTYPE_GROUP)
	message.setChatType(ChatType.GroupChat);
//发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

### 发送语音消息

```
//voiceUri 为语音文件本地资源标志符，length 为录音时间(秒) 
EMMessage message = EMMessage.createVoiceSendMessage(voiceUri, length, toChatUsername); 
//如果是群聊，设置 chattype，默认是单聊 
if (chatType == CHATTYPE_GROUP) 
    message.setChatType(ChatType.GroupChat); 
EMClient.getInstance().chatManager().sendMessage(message);
```

发送成功后，获取语音消息附件：

```
EMVoiceMessageBody voiceBody = (EMVoiceMessageBody) msg.getBody();
//获取语音文件在服务器的地址
String voiceRemoteUrl = voiceBody.getRemoteUrl();
//本地语音文件的资源路径
Uri voiceLocalUri = voiceBody.getLocalUri();
适配 AndroidQ 及以上手机时，获取本地资源请调用 voiceBody.getLocalUri()，相应的 voiceBody.getLocalUrl() 方法已经被废弃！
```

### 发送视频消息

```
//videoLocalUri 为视频本地资源标志符，thumbLocalUri 为视频预览图路径，videoLength 为视频时间长度
EMMessage message = EMMessage.createVideoSendMessage(videoLocalUri, thumbLocalUri, videoLength, toChatUsername);
//如果是群聊，设置 chattype，默认是单聊
if (chatType == CHATTYPE_GROUP)
   message.setChatType(ChatType.GroupChat);
EMClient.getInstance().chatManager().sendMessage(message);
```

发送成功后，获取视频消息缩略图及附件

```
EMVideoMessageBody videoBody = (EMVideoMessageBody) message.getBody();
//获取视频文件在服务器的路径
String videoRemoteUrl = videoBody.getRemoteUrl();
//获取缩略图在服务器的路径
String thumbnailUrl = videoBody.getThumbnailUrl();
//本地视频文件的资源路径
Uri videoLocalUri = videoBody.getLocalUri();
//本地视频缩略图资源路径
Uri localThumbUri = videoBody.getLocalThumbUri();
适配 AndroidQ 及以上手机时，获取本地资源请调用 videoBody.getLocalUri()，相应的 videoBody.getLocalUrl() 方法已经被废弃！
```

### 发送图片消息

```
//imageUri 为图片本地资源标志符，false 为不发送原图（默认超过 100k 的图片会压缩后发给对方），需要发送原图传 true 
EMMessage.createImageSendMessage(imageUri, false, toChatUsername); 
//如果是群聊，设置 chattype，默认是单聊 
if (chatType == CHATTYPE_GROUP) 
    message.setChatType(ChatType.GroupChat); 
EMClient.getInstance().chatManager().sendMessage(message);
```

发送成功后，获取图片消息缩略图及附件

```
EMImageMessageBody imgBody = (EMImageMessageBody) message.getBody();
//获取图片文件在服务器的路径
String imgRemoteUrl = imgBody.getRemoteUrl();
//获取图片缩略图在服务器的路径
String thumbnailUrl = imgBody.getThumbnailUrl();
//本地图片文件的资源路径
Uri imgLocalUri = imgBody.getLocalUri();
//本地图片缩略图资源路径
Uri thumbnailLocalUri = imgBody.thumbnailLocalUri();
适配 AndroidQ 及以上手机时，获取本地资源请调用 imgBody.getLocalUri()，相应的 imgBody.getLocalUrl() 方法已经被废弃！
```

### 发送地理位置消息

```
//latitude为纬度，longitude为经度，locationAddress为具体位置内容
EMMessage message = EMMessage.createLocationSendMessage(latitude, longitude, locationAddress, toChatUsername);
//如果是群聊，设置chattype，默认是单聊
if (chatType == CHATTYPE_GROUP)
	message.setChatType(ChatType.GroupChat);
EMClient.getInstance().chatManager().sendMessage(message);
```

### 发送文件消息

```
//fileLocalUri 为本地资源标志符
EMMessage message = EMMessage.createFileSendMessage(fileLocalUri, toChatUsername);
// 如果是群聊，设置 chattype，默认是单聊
if (chatType == CHATTYPE_GROUP)
    message.setChatType(ChatType.GroupChat);
EMClient.getInstance().chatManager().sendMessage(message);
```

发送成功后，获取文件消息附件

```
EMNormalFileMessageBody fileMessageBody = (EMNormalFileMessageBody) message.getBody();
//获取文件在服务器的路径
String fileRemoteUrl = fileMessageBody.getRemoteUrl();
//本地文件的资源路径
Uri fileLocalUri = fileMessageBody.getLocalUri();
适配 AndroidQ 及以上手机时，获取本地资源请调用 fileMessageBody.getLocalUri()，相应的 fileMessageBody.getLocalUrl() 方法已经被废弃！
```

### 发送透传消息

透传消息能做什么：头像、昵称的更新等。可以把透传消息理解为一条指令，通过发送这条指令给对方，告诉对方要做的 action，收到消息可以自定义处理的一种消息。（透传消息不会存入本地数据库中，所以在 UI 上是不会显示的）。另以 “em_” 和 “easemob::” 开头的 action 为内部保留字段，注意不要使用。

```
EMMessage cmdMsg = EMMessage.createSendMessage(EMMessage.Type.CMD);

//支持单聊和群聊，默认单聊，如果是群聊添加下面这行
cmdMsg.setChatType(ChatType.GroupChat)
String action="action1";//action可以自定义
EMCmdMessageBody cmdBody = new EMCmdMessageBody(action);
String toUsername = "test1";//发送给某个人
cmdMsg.setTo(toUsername);
cmdMsg.addBody(cmdBody); 
EMClient.getInstance().chatManager().sendMessage(cmdMsg);
```

### 发送自定义类型消息

用户可以在以上几种消息之外，自己定义消息类型，方便用户的业务处理。 自定义消息类型支持用户自己设置一个消息的类型名称，这样用户可以添加多种自定义消息。 自定义消息的内容部分是key，value格式的，用户需要自己添加并解析该内容。

```
EMMessage customMessage = EMMessage.createSendMessage(EMMessage.Type.CUSTOM);
// event为需要传递的自定义消息事件，比如礼物消息，可以设置event = "gift"
EMCustomMessageBody customBody = new EMCustomMessageBody(event);
// params类型为Map<String, String>
customBody.setParams(params);
customMessage.addBody(customBody);
// to指另一方环信id（或者群组id，聊天室id）
customMessage.setTo(to);
// 如果是群聊，设置chattype，默认是单聊
customMessage.setChatType(chatType);
EMClient.getInstance().chatManager().sendMessage(customMessage);
        
```

### 设置群消息是否需要已读回执

当消息为群消息时，消息发送方(目前为管理员和群主)可以设置此消息是否需要已读回执，如需要，则设置 EMMessage 的方法 setIsNeedGroupAck() 为 YES，之后发送。

```
public EMMessage createDingMessage(String to, String content) {
        EMMessage message = EMMessage.createTxtSendMessage(content, to);
        message.setIsNeedGroupAck(true);
        return message;
    }
    
 
```

### 发送群消息已读回执

```
public void sendAckMessage(EMMessage message) {
        if (!validateMessage(message)) {
            return;
        }

        if (message.isAcked()) {
            return;
        }

        // May a user login from multiple devices, so do not need to send the ack msg.
        if (EMClient.getInstance().getCurrentUser().equalsIgnoreCase(message.getFrom())) {
            return;
        }

        try {
            if (message.isNeedGroupAck() && !message.isUnread()) {
                String to = message.conversationId(); // do not use getFrom() here
                String msgId = message.getMsgId();
                EMClient.getInstance().chatManager().ackGroupMessageRead(to, msgId, ((EMTextMessageBody)message.getBody()).getMessage());
                message.setUnread(false);
                EMLog.i(TAG, "Send the group ack cmd-type message.");
            }
        } catch (Exception e) {
            EMLog.d(TAG, e.getMessage());
        }
    }
```

当发送群已读回执后，消息发送方对应 EMMessage 的 groupAckCount 属性会有相应变化；

### 群消息已读回调

群消息已读回调在消息监听类EMMessageListener中。

```
/**
	 * \~chinese
	 * 接受到群组消息体的已读回执, 消息的接收方已经阅读此消息。
	 */
         void onGroupMessageRead(List<EMGroupReadAck> groupReadAcks) {
        }
```

### 获取群消息已读回执详情

如果想实现群消息已读回执的列表显示，可以通过下列接口获取到已读回执的详情。

```
/**
	 * \~chinese
	 * 从服务器获取群组消息回执详情
	 * @param msgId 消息id
	 * @param pageSize 获取的页面大小
	 * @param startAckId 已读回执的id，如果为空，从最新的回执向前开始获取
	 * @return 返回消息列表和用于继续获取群消息回执的Cursor
	 */
	public void asyncFetchGroupReadAcks(final String msgId, final int pageSize,
			final String startAckId, final EMValueCallBack<EMCursorResult<EMGroupReadAck>> callBack) {

	}
```

### 发送扩展消息

当 SDK 提供的消息类型不满足需求时，开发者可以通过扩展自 SDK 提供的文本、语音、图片、位置等消息类型，从而生成自己需要的消息类型。

这里是扩展自文本消息，如果这个自定义的消息需要用到语音或者图片等，可以扩展自语音、图片消息，亦或是位置消息。

```
EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername);
 
// 增加自己特定的属性
message.setAttribute("attribute1", "value");
message.setAttribute("attribute2", true);
...
EMClient.getInstance().chatManager().sendMessage(message);

//接收消息的时候获取到扩展属性
//获取自定义的属性，第2个参数为没有此定义的属性时返回的默认值
message.getStringAttribute("attribute1",null);
message.getBooleanAttribute("attribute2", false);
...
```

## 接收消息

通过注册消息监听来接收消息。

```
EMMessageListener msgListener = new EMMessageListener() {
	
	@Override
	public void onMessageReceived(List<EMMessage> messages) {
		//收到消息
	}
	
	@Override
	public void onCmdMessageReceived(List<EMMessage> messages) {
		//收到透传消息
	}
	
	@Override
	public void onMessageRead(List<EMMessage> messages) {
		//收到已读回执
	}
	
	@Override
	public void onMessageDelivered(List<EMMessage> message) {
		//收到已送达回执
	}
       @Override
	public void onMessageRecalled(List<EMMessage> messages) {
		//消息被撤回
	}
	
	@Override
	public void onMessageChanged(EMMessage message, Object change) {
		//消息状态变动
	}
};
EMClient.getInstance().chatManager().addMessageListener(msgListener);

记得在不需要的时候移除listener，如在activity的onDestroy()时
EMClient.getInstance().chatManager().removeMessageListener(msgListener);
```

## 下载缩略图及附件

### 下载缩略图

如果设置了自动下载，即EMClient.getInstance().getOptions().getAutodownloadThumbnail()为true，SDK接收到消息后会下载缩略图；
如果没有设置自动下载，需主动调用EMClient.getInstance().chatManager().downloadThumbnail(message)下载。
下载完成后，调用相应消息body的thumbnailLocalUri()去获取缩略图路径。
例如：

```
EMImageMessageBody imgBody = (EMImageMessageBody) message.getBody();
//本地图片缩略图资源路径
Uri thumbnailLocalUri = imgBody.thumbnailLocalUri();
```

### 下载附件

下载附件的方法为：EMClient.getInstance().chatManager().downloadAttachment(message);
下载完成后，调用相应消息body的getLocalUri()去获取附件路径。
例如：

```
EMImageMessageBody imgBody = (EMImageMessageBody) message.getBody();
//本地图片文件的资源路径
Uri imgLocalUri = imgBody.getLocalUri();
```

## 监听消息状态

通过 message 设置消息的发送及接收状态。 **注意：** 需在sendMessage之前去设置此回调监听

```
message.setMessageStatusCallback(new EMCallBack(){});
```

## 获取聊天记录

```
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
//获取此会话的所有消息
List<EMMessage> messages = conversation.getAllMessages();
//SDK初始化每个会话加载的聊天记录为1条，可以去DB里获取更多
//获取startMsgId之前的pagesize条消息，此方法获取的messages SDK会自动存入到此会话中，APP中无需再次把获取到的messages添加到会话中
List<EMMessage> messages = conversation.loadMoreMsgFromDB(startMsgId, pagesize);
```

## 获取会话未读消息数量

```
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
conversation.getUnreadMsgCount();
```

## 获取所有未读消息数量

```
EMClient.getInstance().chatManager().getUnreadMessageCount();
```

## 未读消息数清零

```
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
//指定会话消息未读数清零
conversation.markAllMessagesAsRead();
//把一条消息置为已读
conversation.markMessageAsRead(messageId);
//所有未读消息数清零
EMClient.getInstance().chatManager().markAllConversationsAsRead();
```

## 获取会话消息总数

```
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
//获取此会话在本地的所有的消息数量
conversation.getAllMsgCount();
//如果只是获取当前在内存的消息数量，调用
conversation.getAllMessages().size();
```

## 消息漫游

环信sdk 在3.3.4版本增加了一个消息漫游接口，即可以从服务器拉取历史消息到本地，方便用户切换设备同步消息。

此方法属于`EMChatManager` 类，通过`EMClient.getInstance().chatManager()`调用，使用方法参考 Demo 中 `EaseChatFragment` 类的 `loadMoreRoamingMessages()` 方法

```
/**
	 * 从服务器获取历史消息
	 *
	 * @param conversationId 会话名称
	 * @param type 会话类型
	 * @param pageSize 获取的页面大小（一次最多50条）
	 * @param startMsgId 漫游消息的开始消息id，如果为空，从最新的消息向前开始获取
	 * @return 返回消息列表和用于继续获取历史消息的Cursor
	 */
	public EMCursorResult<EMMessage> fetchHistoryMessages(String conversationId, EMConversationType type, int pageSize,String startMsgId);

	/**
	 * 从服务器获取历史消息
	 * 
	 * @param conversationId 会话名称
	 * @param type 会话类型
	 * @param pageSize 获取的页面大小
	 * @param startMsgId 漫游消息的开始消息id，如果为空，从最新的消息向前开始获取
	 * @param callBack 返回消息列表和用于继续获取历史消息的Cursor
	 */
	public void asyncFetchHistoryMessage(String conversationId, EMConversationType type, int pageSize, String startMsgId, EMValueCallBack<EMCursorResult<EMMessage>> callBack) 
```

## 从服务器获取会话列表

该功能开通后默认用户可以拉取 7 天内的 10 个会话和每个会话中最新一条聊天记录，如需调整会话数量请联系环信商务经理。


建议此 API 在首次安装应用时或者本地没有会话的时候调用，其他时候使用本地的会话 API 即可。

```
EMClient.getInstance().chatManager().asyncFetchConversationsFromServer(new EMValueCallBack<Map<String, EMConversation>>() {
    @Override
    public void onSuccess(Map<String, EMConversation> value) {
        // 获取会话成功后的处理逻辑
    }
    @Override
    public void onError(int error, String errorMsg) {
        // 获取会话失败处理逻辑
    }
});
```

## 撤回消息功能

消息撤回功能可以撤回一定时间内发送出去的消息，消息撤回时限默认2分钟，可根据开发者需求以AppKey为单位进行单独设置。


```
EMClient.getInstance().chatManager().recallMessage(contextMenuMessage);
```

## 消息已读回执

消息已读回执功能目前仅适用于单聊（ChatType.Chat），推荐使用方案为会话已读回执(conversation ack)+单条消息已读回执(read ack)结合实现，可减少发送read ack消息量。

### 发送已读回执消息

推荐进入会话首先发送会话已读回执（conversation ack）。

```
try {
    EMClient.getInstance().chatManager().ackConversationRead(conversationId);
} catch (HyphenateException e) {
    e.printStackTrace();
}
```

在会话页面，可以在接收到消息时，根据消息类型发送消息已读回执（read ack），如下所示

```
EMClient.getInstance().chatManager().addMessageListener(new EMMessageListener() {
    ......
    
    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        ......
        sendReadAck(message);
        ......
    }
    
    ......
});

/**
* 发送已读回执
* @param message
*/
public void sendReadAck(EMMessage message) {
    //是接收的消息，未发送过read ack消息且是单聊
    if(message.direct() == EMMessage.Direct.RECEIVE
            && !message.isAcked()
            && message.getChatType() == EMMessage.ChatType.Chat) {
        EMMessage.Type type = message.getType();
        //视频，语音及文件需要点击后再发送,这个可以根据需求进行调整
        if(type == EMMessage.Type.VIDEO || type == EMMessage.Type.VOICE || type == EMMessage.Type.FILE) {
            return;
        }
        try {
            EMClient.getInstance().chatManager().ackMessageRead(message.getFrom(), message.getMsgId());
        } catch (HyphenateException e) {
            e.printStackTrace();
        }
    }
}
```

### 监听已读回执回调

（1）设置会话已读回执的监听

```
EMClient.getInstance().chatManager().addConversationListener(new EMConversationListener() {
    ......

    @Override
    public void onConversationRead(String from, String to) {
        //添加刷新页面通知等逻辑
    }
});
```

接收到会话已读回执（channel ack）回调后，SDK会在内部将会话相关消息置为对方已读，开发者需要在接收到此回调后，进行页面刷新等操作。

（2）设置消息已读回执的监听

```
EMClient.getInstance().chatManager().addMessageListener(new EMMessageListener() {
    ......

    @Override
    public void onMessageRead(List<EMMessage> messages) {
        //添加刷新消息等逻辑
    }

    ......
});
```

接收到read ack回调后，SDK会在内部将消息置为对方已读，开发者需要在接收到此回调后，进行消息刷新等操作。

**注：判断是否对方已读根据消息的`isAcked()`方法进行判断，返回true为对方已读，开发者可以根据此字段进行UI界面的展示及刷新。**

## 会话已读回执

会话已读回执用于需要获知接收方是否阅读消息的场景，目前仅适用于单聊（ChatType.Chat）。


### 发送已读回执消息

推荐进入会话页面，根据会话是否有未读消息，发送会话已读回执（conversation ack），有则发送，没有则不再发送。

```
try {
    EMClient.getInstance().chatManager().ackConversationRead(conversationId);
} catch (HyphenateException e) {
    e.printStackTrace();
}
```

注：该方法为异步方法，需要捕捉异常。

### 监听已读回执回调

```
EMClient.getInstance().addConversationListener(new EMConversationListener() {
    ……

    @Override
    public void onConversationRead(String from, String to) {
        //添加刷新页面通知等逻辑
    }
});
```

注：onConversationRead中的from和to与消息（EMMessage）中的定义相同。

会回调onConversationRead的场景：
（1）消息被接收方阅读，且发送了已读回执(conversation ack)；
（2）多端多设备登录场景下，一端发送会话已读回执（conversation ack），服务器端会将未读消息数置为0，同时其他端会回调此方法；

### 最佳实践

推荐使用方案为会话已读回执(conversation ack)+[单条消息已读回执(read ack)](message#消息已读回执)结合实现，可减少发送read ack消息量。
（1）未启动聊天页面的情况下，有未读消息，点击进入聊天页面，调用会话已读回执(conversation ack)；
（2）已经启动聊天页面内的情况下，接收到消息，即发送单条消息已读回执 (read ack) ，具体实现可参考：[发送 read ack 消息](message#发送已读回执消息)。

## 分页获取历史消息记录

```
try {
    EMClient.getInstance().chatManager().fetchHistoryMessages(
            toChatUsername, EaseCommonUtils.getConversationType(chatType), pagesize, "");
    final List<EMMessage> msgs = conversation.getAllMessages();
    int msgCount = msgs != null ? msgs.size() : 0;
    if (msgCount < conversation.getAllMsgCount() && msgCount < pagesize) {
        String msgId = null;
        if (msgs != null && msgs.size() > 0) {
            msgId = msgs.get(0).getMsgId();
        }
        conversation.loadMoreMsgFromDB(msgId, pagesize - msgCount);
    }
    messageList.refreshSelectLast();
} catch (HyphenateException e) {
    e.printStackTrace();
}
```

## 获取本地所有会话

```
Map<String, EMConversation> conversations = EMClient.getInstance().chatManager().getAllConversations();
```

如果出现偶尔返回的conversations的sizi为0，那很有可能是没有调用`EMClient.getInstance().chatManager().loadAllConversations()`，或者调用顺序不对，具体用法请参考[登录](overview.html#登录)章节。

## 从服务器获取会话列表


该功能开通后，用户默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息），如需调整会话数量请联系环信商务经理。


建议此 API 在首次安装应用时或者本地没有会话的时候调用，其他时候使用本地的会话 API 即可。


```
EMClient.getInstance().chatManager().asyncFetchConversationsFromServer(new EMValueCallBack<Map<String, EMConversation>>() {
    @Override
    public void onSuccess(Map<String, EMConversation> value) {
        // 获取会话成功后的处理逻辑
    }
    @Override
    public void onError(int error, String errorMsg) {
        // 获取会话失败处理逻辑
    }
});
```

## 删除会话及聊天记录

```
//删除和某个user会话，如果需要保留聊天记录，传false
EMClient.getInstance().chatManager().deleteConversation(username, true);
//删除当前会话的某条聊天记录
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
conversation.removeMessage(deleteMsg.msgId);
```

## 根据关键字搜索会话消息

```
List<EMMessage> messages = conversation.searchMsgFromDB(keywords, timeStamp, maxCount, from, EMConversation.EMSearchDirection.UP);
```

## 导入消息到数据库

如果有从2.x SDK或者其他第三方SDK升级到目前3.x SDK的需要，可以使用下面的接口，构造EMMessage 对象，将历史消息导入到本地数据库中。

```
EMClient.getInstance().chatManager().importMessages(msgs);
```

## 插入消息

```
//根据会话插入消息
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
conversation.insertMessage(message);

//直接插入消息
EMClient.getInstance().chatManager().saveMessage(message);
```

## 更新消息到 SDK 本地数据库

```
/**
  *  更新消息到 SDK 本地数据库。
  *  消息更新后，会话的 latestMessage 等属性进行相应更新，不能更新消息 ID。
  *
  *  @param msg 要更新的消息。
  */
    public boolean updateMessage(EMMessage msg) 
```


## Demo 及 SDK 下载

[下载Demo及SDK](https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/downloads/easemob-sdk-3.7.6.3.zip)
