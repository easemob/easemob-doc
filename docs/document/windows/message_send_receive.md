# 发送和接收消息

<Toc />

登录即时通讯 IM app 后，用户可以在单聊、群聊、聊天室中发送如下类型的消息：

- 文字消息，包含超链接和表情消息。
- 附件消息，包含图片、语音、视频及文件消息。
- 位置消息。
- 透传消息。
- 自定义消息。

针对聊天室消息并发量较大的场景，即时通讯服务提供消息分级功能。你可以通过设置消息优先级，将消息划分为高、普通和低三种级别。你可以在创建消息时，将指定消息类型，或指定成员的所有消息设置为高优先级，确保此类消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性 。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

本文介绍如何使用即时通讯 IM SDK 实现发送和接收这些类型的消息。

## 技术原理

环信即时通讯 IM Windows SDK 通过 `IChatManager` 和 `Message` 类实现消息的发送、接收与撤回。

其中，发送和接收消息的逻辑如下：

1. 发送方调用相应 `Create` 方法创建文本、文件、附件等类型的消息；
2. 发送方调用 `SendMessage` 发送消息；
3. 接收方通过 `AddChatManagerDelegate` 方法监听消息回调事件。在收到 `OnMessageReceived` 后，即表示成功接收到消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 发送文本消息

你可以利用 `Message` 类构造一个消息，然后通过 `IChatManager` 将该消息发出。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509 `MESSAGE_CURRENT_LIMITING`。 

示例代码：

```csharp
//创建一条文本消息，`content` 为消息文字内容，`toChatUsername` 为对方用户或者群聊的 ID，后文皆是如此。
Message msg = Message.CreateTextSendMessage(toChatUsername, content);

//设置消息类型，即设置 `Message` 类的 `MessageType` 属性。
//该属性的值为 `Chat`、`Group` 和 `Room`，表明该消息是单聊，群聊或聊天室消息，默认为单聊。
//若为群聊，设置 `MessageType` 为 `Group`。
msg.MessageType = MessageType.Group;

//对于聊天室消息，可设置消息优先级。
msg.MessageType = MessageType.Room;
//聊天室消息的优先级。如果不设置，默认值为`RoomMessagePriority.Normal`，即“普通”优先级。
msg.SetRoomMessagePriority(RoomMessagePriority.High);

//发送消息。
//发送消息时可以设置 `CallBack` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    Debug.Log($"{msg.MsgId}发送成功");
  },
  onError:(code, desc) => {
    Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
  }
));
```

### 接收消息

你可以用注册监听 `IChatManagerDelegate` 接收消息。

该 `IChatManagerDelegate` 可以多次添加，请记得在不需要的时候移除该监听。如在析构 `IChatManagerDelegate` 的继承实例之前。

在新消息到来时，你会收到 `OnMessagesReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。

```csharp
//继承并实现 IChatManagerDelegate。
public class ChatManagerDelegate : IChatManagerDelegate {

    //实现 OnMessagesReceived 回调。
    public void OnMessagesReceived(List<Message> messages)
    {
      //收到消息，遍历消息列表，解析和显示。
    }
}

//申请并注册监听。
ChatManagerDelegate adelegate = new ChatManagerDelegate();
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);

//移除监听。
SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(adelegate);
```

### 撤回消息

发送方可以撤回一条发送成功的消息。默认情况下，发送方可撤回发出 2 分钟内的消息。你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**功能配置** > **功能配置总览** > **基础功能** 页面设置消息撤回时长，该时长不超过 7 天。

```csharp
SDKClient.Instance.ChatManager.RecallMessage("Message ID", new CallBack(
  onSuccess: () => {
    Debug.Log("回撤成功");
  },
  onProgress: (progress) => {
    Debug.Log($"回撤进度 {progress}");
  },
  onError: (code, desc) => {
    Debug.Log($"回撤失败，errCode={code}, errDesc={desc}");
  }
 ));
```

还可以使用 `IChatManagerDelegate` 设置消息撤回监听：

```csharp
// 接收到消息被撤回时触发此回调（此回调位于 IChatManagerDelegate 中）。
void OnMessagesRecalled(List<Message> messages);
```

### 发送和接收附件消息

除文本消息外，还有几种其他类型的消息，其中语音，图片，短视频，文件等消息，是通过先将附件上传到消息服务器的方式实现。收到语音时，会自动下载，而图片和视频会自动下载缩略图。文件消息不会自动下载附件，接收方需调用下载附件的 API，具体实现参考下文。

#### 发送和接收语音消息

发送语音消息时，应用层需完成语音文件录制的功能，提供语音文件的 URI 和语音时长。

参考如下示例代码创建并发送语音消息：

```csharp
// localPath 为语音文件的本地资源路径，`displayName` 为消息显示名称，语音消息可以设置为空 ""。
// fileSize 为语音文件大小，duration 为语音时长（秒）。
Message msg = Message.CreateVoiceSendMessage(toChatUsername, localPath, displayName, fileSize, duration);

// 设置消息类型，即设置 `Message` 类的 `MessageType` 属性。
// 该属性的值为 `Chat`、`Group` 和 `Room`，表明该消息是单聊，群聊或聊天室消息，默认为单聊。
// 若为群聊，设置 `MessageType` 为 `Group`。
msg.MessageType = MessageType.Group;

// 发送消息。
// 发送消息时可以设置 `CallBack` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    Debug.Log($"{msg.MsgId}发送成功");
  },
  onProgress: (progress) => {
    Debug.Log($"当前发送进度{progress}");
  },
  onError:(code, desc) => {
    Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
  }
));
```

接收方收到语音消息后，参考如下示例代码获取语音消息的附件：

```csharp
// 注意：这里的 "Message ID" 是消息发送成功以后（CallBack 中的 onSuccess 被触发以后），被发送消息的 ID。
Message msg = SDKClient.Instance.ChatManager.LoadMessage("Message ID");
if (msg != null)
{
  ChatSDK.MessageBody.VoiceBody vb = (ChatSDK.MessageBody.VoiceBody)msg.Body;

  //语音文件在服务器的路径。
  string voiceRemoteUrl = vb.RemotePath;

  //语音文件的本地路径。
  string voiceLocalUri = vb.LocalPath;
}
else {
  Debug.Log($"未找到消息");
}
```

#### 发送和接收图片消息

图片消息默认会被压缩后发出，可通过设置 `original` 参数为 `true` 发送原图。

参考如下示例代码，创建并发送图片消息：

```csharp
//`localPath` 为图片本地资源路径。
//`displayName` 为图片显示名称。
//`fileSize` 为用户上传的图片文件大小，单位为字节。
//`original` 默认为 `false` 即发送压缩后的图片（默认超过 100 KB 的图片会被压缩），如需发送原图则该参数传 `true`。
//`width` 为缩略图的宽度，`height` 为缩略图高度，单位为像素。
Message msg = Message.CreateImageSendMessage(toChatUsername,localPath, displayName, fileSize, original, width , height);

//设置消息类型，即设置 `Message` 类的 `MessageType` 属性。
//设置该属性的值为 `Chat`、`Group` 和 `Room`，分别代表该消息是单聊、群聊或聊天室消息，默认为单聊。
msg.MessageType = MessageType.Group;

//发送消息。
//发送消息时可以设置 `CallBack` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    Debug.Log($"{msg.MsgId}发送成功");
  },
  onProgress: (progress) => {
    Debug.Log($"当前发送进度{progress}");
  },
  onError:(code, desc) => {
    Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
  }
));
```

接收方收到图片消息后，参考如下示例代码获取图片消息的缩略图和附件：

```csharp
//注意：这里的 "Message ID" 是消息发送成功以后（`CallBack` 中的 `onSuccess` 被触发以后），被发送消息的 ID。
Message msg = SDKClient.Instance.ChatManager.LoadMessage("Message ID");
if (msg != null)
{
  ChatSDK.MessageBody.ImageBody ib = (ChatSDK.MessageBody.ImageBody)msg.Body;

  //服务器端图片文件路径。
  string imgRemoteUrl = ib.RemotePath;

  //服务器端图片缩略图路径。
  string thumbnailUrl = ib.ThumbnaiRemotePath;

  //本地图片文件路径。
  string imgLocalUri = ib.LocalPath;

  //本地图片缩略图路径。
  Uri thumbnailLocalUri = ib.ThumbnailLocalPath;

}
else {
  Debug.Log($"未找到消息");
}
```

接收方如果设置了自动下载，即 `Options.IsAutoDownload` 为 `true`，SDK 接收到消息后会下载缩略图；如果未设置自动下载，需主动调用 `SDKClient.Instance.ChatManager.DownloadThumbnail` 下载。

下载完成后，调用相应消息 `msg.Body` 的 `ThumbnailLocalPath` 去获取缩略图路径。

#### 发送和接收短视频消息

发送短视频消息时，应用层需要完成视频文件的选取或者录制。视频消息支持给出视频的时长作为参数，发送给接收方。

参考如下示例代码，创建并发送短视频消息：

```csharp
Message msg = Message.CreateVideoSendMessage(toChatUsername, localPath, displayName, thumbnailLocalPath, fileSize, duration, width, height);

//发送消息。
//发送消息时可以设置 `CallBack` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    Debug.Log($"{msg.MsgId}发送成功");
  },
  onProgress: (progress) => {
    Debug.Log($"当前发送进度{progress}");
  },
  onError:(code, desc) => {
    Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
  }
));
```

默认情况下，当收件人收到短视频消息时，SDK 会下载视频消息的缩略图。

如果不希望 SDK 自动下载视频缩略图，可以将 `Options.IsAutoDownload` 设置为 `false`。

如果未设置自动下载，需主动调用 `SDKClient.Instance.ChatManager.DownloadThumbnail` 下载。下载完成后，使用相应消息 `Body` 的 `ThumbnailLocalPath` 成员获取缩略图路径。

短视频文件本身需要通过 `SDKClient.Instance.ChatManager.DownloadAttachment` 下载，下载完成后，使用相应消息 `Body` 的 `LocalPath` 成员获取短视频文件路径。

```csharp
// 接收到视频消息需先下载附件才能打开。
SDKClient.Instance.ChatManager.DownloadAttachment("Message ID", new CallBack(
  onSuccess: () => {
    Debug.Log($"下载附件成功");

    Message msg = SDKClient.Instance.ChatManager.LoadMessage("Message ID");
    if (msg != null)
    {
      if (msg.Body.Type == ChatSDK.MessageBodyType.VIDEO) {
        ChatSDK.MessageBody.VideoBody vb = (ChatSDK.MessageBody.VideoBody)msg.Body;
        //从本地获取短视频文件路径。
        string videoLocalUri = vb.LocalPath;
        //这里可以根据本地路径打开文件。
      }
    }
    else {
      Debug.Log($"未找到消息");
    }

  },
  onProgress: (progress) => {
    Debug.Log($"下载附件进度 {progress}");
  },
  onError: (code, desc) => {
    Debug.Log($"附件下载失败，errCode={code}, errDesc={desc}");
  }
));
```

#### 发送和接收文件消息

参考如下示例代码创建并发送文件消息：

```csharp
// localPath 为文件本地路径，displayName 为消息显示名称，fileSize 为文件大小。
Message msg = Message.CreateFileSendMessage(toChatUsername,localPath, displayName, fileSize);

// 设置消息类型，即设置 `Message` 类的 `MessageType` 属性。
// 设置该属性的值为 `Chat`、`Group` 和 `Room`，分别代表该消息是单聊、群聊或聊天室消息，默认为单聊。
msg.MessageType = MessageType.Group;

// 发送消息。
// 发送消息时可以设置 `CallBack` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    Debug.Log($"{msg.MsgId}发送成功");
  },
  onProgress: (progress) => {
    Debug.Log($"当前发送进度{progress}");
  },
  onError:(code, desc) => {
    Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
  }
));

// 发送成功后，获取文件消息附件。
// 注意：这里的 "Message ID" 是消息发送成功以后（CallBack 中的 onSuccess 被触发以后），被发送消息的 ID。
Message msg = SDKClient.Instance.ChatManager.LoadMessage("Message ID");
if (msg != null)
{
  ChatSDK.MessageBody.FileBody fb = (ChatSDK.MessageBody.FileBody)msg.Body;

  //服务器文件路径。
  string fileRemoteUrl = fb.RemotePath;

  //本地文件路径。
  string fileLocalUri = fb.LocalPath;

}
else {
  Debug.Log($"未找到消息");
}

```

### 发送位置消息

当你需要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

```csharp
//`latitude` 为纬度，`longitude` 为经度，`locationAddress` 为具体位置内容，`buildingName` 为建筑名称。
Message msg = Message.CreateLocationSendMessage(toChatUsername, latitude, longitude, locationAddress, buildingName);

SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    Debug.Log($"{msg.MsgId}发送成功");
  },
  onError:(code, desc) => {
    Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
  }
));
```

### 发送和接收透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。（透传消息不会存入本地数据库中，所以在 UI 上不会显示）。具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 “em_” 和 “easemob::” 开头的 action 为内部保留字段，注意不要使用。

```csharp
//`action` 可以自定义。
string action = "actionXXX";
Message msg = Message.CreateCmdSendMessage(toChatUsername, action);
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
   onSuccess: () => {
      Debug.Log($"{msg.MsgId}发送成功");
   },
   onError: (code, desc) => {
      Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
   }
));
```

请注意透传消息的接收方，也是由单独的回调进行通知，方便用户进行不同的处理。

```csharp
// 继承并实现 `IChatManagerDelegate`。
public class ChatManagerDelegate : IChatManagerDelegate {

    // 收到消息。
    public void OnMessagesReceived(List<Message> messages)
    {
      // 收到消息，遍历消息列表，解析和显示。
    }
    // 收到透传消息。
    void OnCmdMessagesReceived(List<Message> messages)
    {
      // 收到消息，遍历消息列表，解析和处理。
    }
}

// 申请并注册监听。
ChatManagerDelegate adelegate = new ChatManagerDelegate()
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);

```

#### 通过透传消息实现输入指示器

输入指示器显示其他用户何时输入消息。通过该功能，用户之间可进行有效沟通，增加了用户对聊天应用中交互的期待感。

你可以通过透传消息实现输入指示器。下图为输入指示器的工作原理。

![img](@static/images/common/typing_indicator.png)

监听用户 A 的输入状态。一旦有文本输入，通过透传消息将输入状态发送给用户 B，用户 B 收到该消息，了解到用户 A 正在输入文本。

- 用户 A 向用户 B 发送消息，通知其开始输入文本。
- 收到消息后，如果用户 B 与用户 A 的聊天页面处于打开状态，则显示用户 A 的输入指示器。
- 如果用户 B 在几秒后未收到用户 A 的输入，则自动取消输入指示器。

:::notice

用户 A 可根据需要设置透传消息发送间隔。

:::

以下示例代码展示如何发送输入状态的透传消息。

```csharp
//发送表示正在输入的透传消息
string msgTypingBegin = "TypingBegin";

void textChange() {
  int currentTimestamp = getCurrentTimestamp();
  if (currentTimestamp - _previousChangedTimeStamp > 5) {
    _sendBeginTyping();
    _previousChangedTimeStamp = currentTimestamp;
  }
}

void _sendBeginTyping() {
  var msg = Message.CreateCmdSendMessage(
    username: conversationId,
    action: msgTypingBegin,
    deliverOnlineOnly: true,
  );
  msg.chatType = MessageType.Chat;
  SDKClient.getInstance.chatManager.sendMessage(msg);
}

```

以下示例代码展示如何接受和解析输入状态的透传消息。

```csharp
int typingTime = 10;

void OnCmdMessagesReceived(List<Message> list) {
  for (var msg in list) {
    if (msg.ConversationId != currentConversationId) {
      continue;
    }
    MessageBody.CmdBody body = msg.Body as MessageBody.CmdBody;
    if (body.Action == msgTypingBegin) {
      // 这里需更新 UI，显示“对方正在输入”

      Timer timer = new Timer((state) =>
      {
      	// 这里需更新 UI，不再显示“对方正在输入”
      }, null, typingTime, Timeout.Infinite);
    }
  }
}
```

### 发送自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。自定义消息内容为 String 类型的 key-value 格式，你需要自己添加并解析该内容。

```csharp
//`event` 为字符串类型的自定义事件，比如礼物消息，可以设置：
string event = "gift";

//`adict` 类型为 `Dictionary<string, string>`。
Dictionary<string, string> adict = new Dictionary<string, string>();
adict.Add("key", "value");

Message msg = Message.CreateCustomSendMessage(toChatUsername, event, adict);
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
   onSuccess: () => {
      Debug.Log($"{msg.MsgId}发送成功");
   },
   onError: (code, desc) => {
      Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
   }
));
```

### 发送和接收合并消息
为了方便消息互动，即时通讯 IM 自 1.2.0 版本开始支持将多个消息合并在一起进行转发。你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。
3. 对端收到合并消息后进行解析，获取原始消息列表。


#### 创建和发送合并消息

你可以调用 `CreateCombineSendMessage` 方法创建一条合并消息，然后调用 `SendMessage` 方法发送该条消息。

创建合并消息时，需要设置以下参数：

| 属性   | 类型        | 描述    |
| :-------------- | :-------------------- | :-------------------- |
| `userId` | String     | 消息接收方。该字段的设置取决于会话类型：<br/> - 单聊：对方用户 ID；<br/> - 群聊：群组 ID；<br/> - 子区会话：子区 ID；<br/> - 聊天室聊天：聊天室 ID。|
| `title`  | string | 合并消息的标题。    |
| `summary` | string       | 合并消息的概要。   |
| `compatibleText` | string       | 合并消息的兼容文本。<br/>兼容文本起向下兼容不支持消息合并转发的版本的作用。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。  |
| `messageList` | List      | 合并消息的原始消息 ID 列表。该列表最多包含 300 个消息 ID。  |


:::notice
1. 合并转发支持嵌套，最多支持 10 层嵌套，每层最多 300 条消息。
2. 不论 `Options#ServerTransfer` 设置为 `false` 或 `true`，SDK 都会将合并消息附件上传到环信服务器。
:::

示例代码如下：

```csharp
String title = "A和B的聊天记录";
String summary = "A:这是A的消息内容\nB:这是B的消息内容";
String compatibleText = "您当前的版本不支持该消息，请升级到最新版本";
Message msg = Message.CreateCombineSendMessage(to, title, summary, compatibleText, msgIdList);

SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
    onSuccess: () => {
        // 消息发送成功的处理逻辑
    },
    onError: (code, desc) => {
        // 消息发送失败的处理逻辑
    }
));
```

接收合并消息与接收普通消息的操作相同，详见[接收消息](#接收消息)。

对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。

#### 解析合并消息

合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `FetchCombineMessageDetail` 方法下载合并消息附件并解析出原始消息列表。

对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：

- 若附件已存在，该方法会直接解析附件并返回原始消息列表。
- 若附件不存在，该方法首先下载附件，然后解析附件并返回原始消息列表。

```csharp
SDKClient.Instance.ChatManager.FetchCombineMessageDetail(msg, new ValueCallBack<List<Message>>(
    onSuccess: (list) => {
        // 处理并展示消息列表
    },
    onError: (code, desc) => {
        // 处理出错信息
    }
));
```

### 发送和接收定向消息

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

该功能适用于文本消息、图片消息和音视频消息等全类型消息，最多可向群组或聊天室的 20 个成员发送定向消息。

:::notice
1. 仅 SDK 1.2.0 及以上版本支持。
2. 定向消息不计入群组会话或聊天室会话的未读计数。
:::

发送定向消息的流程与发送普通消息相似，唯一区别是需要设置消息的接收方，具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的接收方。
3. 发送定向消息。

下面以文本消息为例介绍如何发送定向消息，示例代码如下：

```csharp
// 创建一条文本消息。
Message msg = Message.CreateTextSendMessage(groupId, content);
// 会话类型：群组和聊天室聊天，分别为 `Group` 和 `Room`。
msg.MessageType = MessageType.Group;

List<string> receives = new List<string>();
receives.Add("userId1");
receives.Add("userId2");

// 设置消息接收方列表。最多可传 20 个接收方的用户 ID。若传入 `null`或者包含接收Id数目为0，则消息发送给群组或聊天室的所有成员。
msg.ReceiverList = receives;

SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
    onSuccess: () => {

    },
    onError: (code, desc) => {

    }
));
```

接收群定向消息与接收普通消息的操作相同，详见[接收消息](#接收消息)。

### 使用消息的扩展字段

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型。

当目前消息类型不满足用户需求时，可以在扩展部分保存更多信息，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```csharp
Message msg = Message.CreateTextSendMessage(toChatUsername, content);

// 增加自定义属性。
AttributeValue attr1 = AttributeValue.Of("value", AttributeValueType.STRING);
AttributeValue attr2 = AttributeValue.Of(true, AttributeValueType.BOOL);
msg.Attributes.Add("attribute1", attr1);
msg.Attributes.Add("attribute2", attr2);

// 发送消息。
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    Debug.Log($"{msg.MsgId}发送成功");
  },
  onError:(code, desc) => {
    Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
  }
));
// 接收消息的时候获取扩展属性。
bool found = false;
string str = Message.GetAttributeValue<string>(msg.Attributes, "attribute1", out found);
if (found) {
  // 使用 str 变量。
}
found = false；
bool b = Message.GetAttributeValue<bool>(msg.Attributes, "attribute2", out found);
if (found) {
  // 使用 b 变量。
}
```

