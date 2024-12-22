# 发送和接收消息

环信即时通讯 IM Unity SDK 通过 `IChatManager` 和 `Message` 类实现文本、图片、音频、视频和文件等类型的消息的发送和接收。

- 对于单聊，环信即时通信 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要[开启好友关系检查](/product/enable_and_configure_IM.html#好友关系检查)。

- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。

单聊、群组聊天和聊天室的消息发送控制，详见[消息发送控制](/product/product_message_overview.html#消息发送控制)文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送和接收文本消息

1. 你可以利用 `Message` 类构造一个消息，然后通过 `IChatManager` 将该消息发出。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509 `MESSAGE_CURRENT_LIMITING`。 

示例代码：

```C#
//创建一条文本消息，`content` 为消息文字内容。
// `conversationId` 为消息接收方，单聊为对端用户的 ID，群聊为群组 ID，聊天室时为聊天室 ID。
Message msg = Message.CreateTextSendMessage(conversationId, content);

//设置会话类型，即 `Message` 类的 `MessageType` 属性。
//单聊、群聊和聊天室分别为 `Chat`、`Group` 和 `Room`，默认为单聊。
msg.MessageType = MessageType.Group;

//对于聊天室消息，可设置消息优先级。
//msg.MessageType = MessageType.Room;
//聊天室消息的优先级。如果不设置，默认值为 `RoomMessagePriority.Normal`，即“普通”优先级。
//msg.SetRoomMessagePriority(RoomMessagePriority.High);

//发送消息。
//发送消息时可设置 `CallBack` 的实例，获得消息发送状态。可在该回调中更新消息的显示状态。例如消息发送失败后的提示等。
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    Debug.Log($"{msg.MsgId}发送成功");
  },
  onError:(code, desc) => {
    Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
  }
));
```

2. 你可以用注册监听 `IChatManagerDelegate` 接收消息。该 `IChatManagerDelegate` 可以多次添加，请记得在不需要的时候移除该监听。如在析构 `IChatManagerDelegate` 的继承实例之前。

在新消息到来时，你会收到 `OnMessagesReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。若在初始化时打开了 `Options#IncludeSendMessageInMessageListener` 开关，则该回调中会返回发送成功的消息。

对于聊天室消息，你可以通过消息的 `Message#Broadcast` 属性判断该消息是否为[通过 REST API 发送的聊天室全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。

```C#
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

## 发送和接收附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

附件消息的发送和接收过程如下：

1. 创建和发送附件类型消息。SDK 将附件上传到环信服务器。
2. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用 `DownloadAttachment` 方法。
3. 获取附件的服务器地址和本地路径。

### 发送和接收语音消息

发送语音消息时，应用层需完成语音文件录制的功能，提供语音文件的 URI 和语音时长。

参考如下示例代码创建并发送语音消息：

```C#
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

语音消息的接收与文本消息一致，详见[接收文本消息](#发送和接收文本消息)。

接收方收到语音消息后，参考如下示例代码获取语音消息的附件：

```C#
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

### 发送和接收图片消息

1. 创建并发送图片消息。

图片消息默认会被压缩后发出，可通过设置 `original` 参数为 `true` 发送原图。

```C#
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

2. 图片消息的接收与文本消息一致，详见[接收文本消息](#发送和接收文本消息)。

接收方收到图片消息后，参考如下示例代码获取图片消息的缩略图和附件。

- 接收方如果设置了自动下载，即 `Options.IsAutoDownload` 为 `true`，SDK 接收到消息后会下载缩略图
- 如果未设置自动下载，需主动调用 `SDKClient.Instance.ChatManager.DownloadThumbnail` 下载。

下载完成后，调用相应消息 `msg.Body` 的 `ThumbnailLocalPath` 获取缩略图路径。

```C#
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

### 发送和接收视频消息

发送视频消息时，应用层需要完成视频文件的选取或者录制。视频消息支持给出视频的时长作为参数，发送给接收方。

1. 创建并发送视频消息。

```C#
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

2. 接收方收到视频消息时，自动下载视频缩略图。你可以设置自动或手动下载视频缩略图，该设置与图片缩略图相同，详见[设置图片缩略图自动下载](#发送和接收图片消息)。

视频文件本身需要通过 `SDKClient.Instance.ChatManager.DownloadAttachment` 下载，下载完成后，使用相应消息 `Body` 的 `LocalPath` 成员获取视频文件路径。

```C#
// 接收到视频消息需先下载附件才能打开。
SDKClient.Instance.ChatManager.DownloadAttachment("Message ID", new CallBack(
  onSuccess: () => {
    Debug.Log($"下载附件成功");

    Message msg = SDKClient.Instance.ChatManager.LoadMessage("Message ID");
    if (msg != null)
    {
      if (msg.Body.Type == ChatSDK.MessageBodyType.VIDEO) {
        ChatSDK.MessageBody.VideoBody vb = (ChatSDK.MessageBody.VideoBody)msg.Body;
        //从本地获取视频文件路径。
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

### 发送和接收文件消息

1. 创建并发送文件消息。

```C#
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

2. 文件消息的接收与文本消息一致，详见[接收文本消息](#发送和接收文本消息)。

## 发送和接收位置消息

1. 创建和发送位置消息。
  
发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。 

```C#
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

2. 接收位置消息与文本消息一致，详见[接收文本消息](#发送和接收文本消息)。
   
 接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

## 发送和接收透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

1. 创建和发送透传消息。

```C#
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

2. 接收方通过 `OnMessagesReceived` 和 `OnCmdMessagesReceived` 回调接收透传消息，方便用户进行不同的处理。

```C#
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

## 发送和接收自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

1. 创建和发送自定义类型消息。

```C#
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

2. 接收自定义消息与其他类型消息一致，详见[接收文本消息](#接收文本消息)。

## 发送和接收合并消息

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


:::tip
1. 合并转发支持嵌套，最多支持 10 层嵌套，每层最多 300 条消息。
2. 不论 `Options#ServerTransfer` 设置为 `false` 或 `true`，SDK 都会将合并消息附件上传到环信服务器。
:::

示例代码如下：

```C#
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

#### 接收和解析合并消息

接收合并消息与接收普通消息的操作相同，详见[接收消息](#发送和接收文本消息)。

对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。

合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `FetchCombineMessageDetail` 方法下载合并消息附件并解析出原始消息列表。

对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：

- 若附件已存在，该方法会直接解析附件并返回原始消息列表。
- 若附件不存在，该方法首先下载附件，然后解析附件并返回原始消息列表。

```C#
SDKClient.Instance.ChatManager.FetchCombineMessageDetail(msg, new ValueCallBack<List<Message>>(
    onSuccess: (list) => {
        // 处理并展示消息列表
    },
    onError: (code, desc) => {
        // 处理出错信息
    }
));
```

## 发送和接收定向消息

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

该功能适用于文本消息、图片消息和音视频消息等全类型消息，最多可向群组或聊天室的 20 个成员发送定向消息。

:::tip
1. 仅 SDK 1.2.0 及以上版本支持。
2. 定向消息不写入服务端会话列表，不计入服务端会话的未读消息计数。
3. 群组定向消息的漫游功能默认关闭，使用前需联系商务开通。
4. 聊天室定向消息的漫游功能默认关闭，使用前需联系商务开通聊天室消息漫游和定向消息漫游功能。
:::

发送定向消息的流程与发送普通消息相似，唯一区别是需要设置消息的接收方，具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的接收方。
3. 发送定向消息。

下面以文本消息为例介绍如何发送定向消息，示例代码如下：

```C#
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

接收群定向消息与接收普通消息的操作相同，详见[接收文本消息](#接收文本消息)。

## 使用消息扩展字段

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型。

当目前消息类型不满足用户需求时，可以在扩展部分保存更多信息，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```C#
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

## 更多

### 设置聊天室消息优先级

针对聊天室消息并发量较大的场景，即时通讯服务提供消息分级功能。你可以通过设置消息优先级，将消息划分为高、普通和低三种级别。你可以在创建消息时，将指定消息类型，或指定成员的所有消息设置为高优先级，确保此类消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

对于聊天室消息，可设置消息优先级，包括高、普通和低优先级。示例代码如下：

```C#
//创建一条文本消息，`content` 为消息文字内容。
// `conversationId` 为消息接收方，单聊为对端用户的 ID，群聊为群组 ID，聊天室时为聊天室 ID。
Message msg = Message.CreateTextSendMessage(conversationId, content);

//设置会话类型，即 `Message` 类的 `MessageType` 属性。
//聊天室为 `Room`。
msg.MessageType = MessageType.Room;

//对于聊天室消息，可设置消息优先级。
msg.MessageType = MessageType.Room;
//聊天室消息的优先级。如果不设置，默认值为 `RoomMessagePriority.Normal`，即“普通”优先级。
msg.SetRoomMessagePriority(RoomMessagePriority.High);

//发送消息。
//发送消息时可设置 `CallBack` 的实例，获得消息发送状态。可在该回调中更新消息的显示状态。例如消息发送失败后的提示等。
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    Debug.Log($"{msg.MsgId}发送成功");
  },
  onError:(code, desc) => {
    Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
  }
));
```

### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/product/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

若初始化时打开了 `Options#UseReplacedMessageContents` 开关，发送文本消息时如果被内容审核（Moderation）进行了内容替换，发送方会收到替换后的内容。若该开关为关闭状态，则发送方不会收到替换后的内容。

