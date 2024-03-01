# 环信超级社区（Circle）快速开始

<Toc />

## 集成准备

使用 Circle 之前，确保你已经集成环信即时通讯 IM Android SDK 3.9.9.2，详见 [环信即时通讯 IM Android 快速开始](/document/android/quickstart.html)。

## 技术原理

用户需加入一个社区，选择加入社区或社区下频道分组中的频道，然后才能在频道中发送消息。

发送和接收消息的逻辑如下：

1. 发送方获取社区 ID；
2. 发送方获取频道 ID；
3. 发送方通过 `sendMessage` 发送消息；
4. 接收方通过 `EMMessageListener` 添加消息接收的回调通知。

## 实现方法

### 获取指定的社区

你可以通过三种方式获取指定的社区 ID：

- 创建社区；
- 加入一个现有社区；
- 获取已加入的社区列表。

#### 创建社区

你可以调用 `createServer` 方法创建一个社区：

```java
EMCircleServerAttribute attribute = new EMCircleServerAttribute();
    attribute.setName(name);
    attribute.setDesc(desc);
    attribute.setIcon(icon);
EMClient.getInstance().chatCircleManager().createServer(attribute, new EMValueCallBack<EMCircleServer>() {
    @Override
    public void onSuccess(EMCircleServer value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {
        
    }
});
```

#### 加入一个现有社区

你可以调用 `joinServer` 方法加入一个现有社区：

```java
EMClient.getInstance().chatCircleManager().joinServer(serverId, new EMValueCallBack<EMCircleServer>() {
      @Override
      public void onSuccess(EMCircleServer value) {
        
      }

      @Override
      public void onError(int code, String error) {
          
      }
  }
);
```

#### 获取已加入的社区列表

你可以调用 `fetchJoinedServers` 方法获取已加入的社区列表：

```java
EMClient.getInstance().chatCircleManager().fetchJoinedServers(20, null, new EMValueCallBack<EMCursorResult<EMCircleServer>>() {
    @Override
    public void onSuccess(EMCursorResult<EMCircleServer> value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {
        
    }
});
```

### 获取指定的频道

你可以通过三种方式获取指定的频道 ID：

- 创建频道；
- 加入一个现有频道；
- 获取已加入的频道列表；
- 获取社区中的频道列表；

#### 创建频道

你可以调用 `createChannel` 方法创建频道：

```java
EMCircleChannelAttribute attribute = new EMCircleChannelAttribute();
    attribute.setName(name);
    attribute.setDesc(desc);
    attribute.setMaxUsers(2000);
    attribute.setType(EMCircleChannelStyle.EMChannelStylePublic);

EMClient.getInstance().chatCircleManager().createChannel(serverId, categoryId, attribute, EMCircleChannelModeChat, new EMValueCallBack<EMCircleChannel>() {

    @Override
    public void onSuccess(EMCircleChannel value) {

    }

    @Override
    public void onError(int code, String error) {

    }
});
```

#### 加入一个现有频道

你可以调用 `joinChannel` 方法加入一个频道：

```java
EMClient.getInstance().chatCircleManager().joinChannel(serverId, channelId, new EMValueCallBack<EMCircleChannel>() {
    @Override
    public void onSuccess(EMCircleChannel value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

#### 获取社区的公开频道列表

你可以调用 `fetchPublicChannelsInServer` 方法获取社区下的公开频道列表：

```java
EMClient.getInstance().chatCircleManager().fetchPublicChannelsInServer(serverId, 20, null, new EMValueCallBack<EMCursorResult<EMCircleChannel>>() {
    @Override
    public void onSuccess(EMCursorResult<EMCircleChannel> value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

#### 获取社区的私密频道列表

你可以调用 `fetchVisiblePrivateChannelsInServer` 方法获取社区下所有私密频道的列表：

```java
EMClient.getInstance().chatCircleManager().fetchVisiblePrivateChannelsInServer(serverId, 20, null, new EMValueCallBack<EMCursorResult<EMCircleChannel>>() {
    @Override
    public void onSuccess(EMCursorResult<EMCircleChannel> value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

此外，你还可以调用 `fetchPublicChannelsInCategory` 或 `fetchPrivateChannelsInCategory` 方法获取指定频道分组下的公开频道列表或私密频道列表。

### 发送和接收一条频道消息

在频道中发送和接收消息，你可以参考 [发送和接收消息](/document/android/message_send_receive.html)。

#### 发送一条频道消息

你可以调用 `sendMessage` 方法在指定频道中发送一条消息：

```java
// 创建一条文本消息，`content` 为消息文字内容，`channelID` 为频道 ID
EMMessage message = EMMessage.createTextSendMessage(content, channelID);
// 设置消息类型，即设置 `Message` 类的 `ChatType` 为 `GroupChat`。
message.setChatType(EMMessage.ChatType.GroupChat);
// 设置消息属性为 `Channel Message`。
message.setIsChannelMessage(true);

// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
// 发送消息时可以设置 `EMCallBack` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如消息发送失败后的提示等。
message.setMessageStatusCallback(new EMCallBack() {
     @Override
     public void onSuccess() {
         
     }
     @Override
     public void onError(int code, String error) {
         
     }
     @Override
     public void onProgress(int progress, String status) {

     }

 });
EMClient.getInstance().chatManager().sendMessage(message);
```

#### 接收一条频道消息

你可以注册 `EMMessageListener` 监听器接收消息。

```java 
EMMessageListener msgListener = new EMMessageListener() {

   // 收到消息，遍历消息队列，解析和显示。
   @Override
   public void onMessageReceived(List<EMMessage> messages) {

   }
};
EMClient.getInstance().chatManager().addMessageListener(msgListener);
```
