# 环信超级社区（Circle）快速开始

<Toc />

## 集成准备

使用 Circle 之前，确保你已经集成环信 Circle SDK（IM iOS SDK 3.9.9.1），详见 [环信即时通讯 IM iOS 快速开始](/document/ios/quickstart.html)。

## 技术原理

用户需加入一个社区，选择加入社区或社区下频道分组中的频道，然后才能在频道中发送消息。

发送和接收消息的逻辑如下：

1. 发送方获取社区 ID；
2. 发送方获取频道 ID；
3. 发送方通过 `sendMessage` 发送消息；
4. 接收方通过 `EMChatManagerDelegate` 添加消息接收的回调通知。

## 实现方法

### 获取指定的社区

你可以通过三种方式获取指定的社区 ID：

- 创建社区；
- 加入一个现有社区；
- 获取已加入的社区列表。

#### 创建社区

你可以调用 `createServer` 方法创建一个社区：

```swift
let attribute = EMCircleServerAttribute()
attribute.name = name
attribute.icon = icon
attribute.desc = desc
attribute.ext = ext
EMClient.shared().circleManager?.createServer(attribute) { server, error in
    if let error = error {
        Toast.show(error.errorDescription, duration: 2)
    } else if server != nil {
        Toast.show("创建成功", duration: 2)
    }
}
```

#### 加入一个现有社区

你可以调用 `joinServer` 方法加入一个现有社区：

```swift
EMClient.shared().circleManager?.joinServer(serverId) { server, error in
    if let error = error {
        Toast.show(error.errorDescription, duration: 2)
    } else if let server = server {
        Toast.show("加入成功", duration: 2)
    }
}
```

#### 获取已加入的社区列表

你可以调用 `fetchJoinedServers` 方法获取已加入的社区列表：

```swift
EMClient.shared().circleManager?.fetchJoinedServers(20, cursor: self.cursor) { result, error in
    if let error = error {
        Toast.show(error.errorDescription, duration: 2)
        return
    }
}
```

### 获取指定的频道

你可以通过三种方式获取指定的频道 ID：

- 创建频道；
- 加入一个现有频道；
- 获取已加入的频道列表；
- 获取社区中的频道列表；

#### 创建频道

你可以调用 `createChannel` 方法创建频道：

```swift
let attribute = EMCircleChannelAttribute()
attribute.name = name
attribute.desc = desc
EMClient.shared().circleManager?.createChannel(self.serverId, categoryId: self.categoryId, attribute: attribute, mode: self.mode, completion: { channel, error in
    if let error = error {
        Toast.show(error.errorDescription, duration: 2)
    } else {
        Toast.show("创建成功", duration: 2)
    }
})
```

#### 加入一个现有频道

你可以调用 `joinChannel` 方法加入一个频道：

```swift
EMClient.shared().circleManager?.joinChannel(serverId, channelId: channelId) { channel, error in
    if let error = error {
        Toast.show(error.errorDescription, duration: 2)
    } else {
        Toast.show("加入成功", duration: 2)
    }
}
```

#### 获取社区的公开频道列表

你可以调用 `fetchPublicChannelsInServer` 方法获取社区下的公开频道列表：

```swift
EMClient.shared().circleManager?.fetchPublicChannels(inServer: serverId, limit: 20, cursor: nil) { result, error in
    if let error = error {
        Toast.show(error.errorDescription, duration: 2)
        return
    }
}
```

#### 获取社区的私密频道列表

你可以调用 `fetchPrivateChannelsInServer` 方法获取社区下所有私密频道的列表：

```swift
EMClient.shared().circleManager?.fetchPrivateChannels(inServer: self.serverId, limit: 20, cursor: nil) { result, error in
    if let error = error {
        Toast.show(error.errorDescription, duration: 2)
        return
    }
}
```

此外，你还可以调用 `fetchPublicChannelsInCategory` 或 `fetchPrivateChannelsInCategory` 方法获取指定频道分组下的公开频道列表或私密频道列表。

### 发送和接收一条频道消息

在频道中发送和接收消息，你可以参考 [发送和接收消息](/document/ios/message_send_receive.html)。

#### 发送一条频道消息

你可以调用 `sendMessage` 方法在指定频道中发送一条消息：

```swift
let messageBody = EMTextMessageBody(text: text)
let message = EMChatMessage(conversationID: channelId, from: selfUserId, to: channelId, body: messageBody, ext: nil)
message.isChannelMessage = true
message.chatType = .groupChat
EMClient.shared().chatManager.send(message, progress: nil) { message, error in 
    if let error = error {
        Toast.show(error.errorDescription, duration: 2)
    } else {
        Toast.show("发送成功", duration: 2)
    }
}
```

#### 接收一条频道消息

添加 `ChatManager` 回调的代理对象：

```swift
EMClient.shared().chatManager?.add(self, delegateQueue: nil)
```

代理对象实现 `EMChatManagerDelegate` 接口的 `messagesDidReceive` 方法。

```swift
extension ChatViewController : EMChatManagerDelegate {
    func messagesDidReceive(_ aMessages: [EMChatMessage]) {
       
    }
}
```
