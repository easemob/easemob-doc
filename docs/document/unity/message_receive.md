# 接收消息

环信即时通讯 IM Unity SDK 通过 `IChatManagerDelegate` 类实现文本、图片、音频、视频和文件等类型的消息的接收。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 接收文本消息

- 你可以用注册监听 `IChatManagerDelegate` 接收消息。该 `IChatManagerDelegate` 可以多次添加，请记得在不需要的时候移除该监听。如在析构 `IChatManagerDelegate` 的继承实例之前。
- 在新消息到来时，你会收到 `OnMessagesReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。若在初始化时打开了 `Options#IncludeSendMessageInMessageListener` 开关，则该回调中会返回发送成功的消息。
- 对于聊天室消息，你可以通过消息的 `Message#Broadcast` 属性判断该消息是否为[通过 REST API 发送的聊天室全局广播消息](/document/server-side/message_broadcast.html#发送聊天室全局广播消息)。

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

## 接收附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

附件消息的接收过程如下：

1. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用 `DownloadAttachment` 方法。
   
2. 获取附件的服务器地址和本地路径。

### 接收语音消息

1. 接收方收到语音消息时，自动下载语音文件。
   
2. 接收方收到 [OnMessagesReceived](#接收文本消息) 回调，获取语音文件的服务器地址或本地路径，从而获取语音文件。

```csharp

foreach (var msg in messages)
{
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
}

```

### 接收图片消息

1. 接收方收到图片消息，自动下载图片缩略图。

2. 图片消息的接收与文本消息一致，详见 [接收文本消息](#接收文本消息)。

  接收方收到图片消息后，参考如下示例代码获取图片消息的缩略图和附件。

- 接收方如果设置了自动下载，即 `Options.IsAutoDownload` 为 `true`，SDK 接收到消息后会下载缩略图。
  
- 如果未设置自动下载，需主动调用 `SDKClient.Instance.ChatManager.DownloadAttachment` 下载。

3. 使用`DownloadAttachment`下载完成后，可获取消息的图片文件和缩略图。

```csharp

SDKClient.Instance.ChatManager.DownloadAttachment("Message ID", new CallBack(
  onSuccess: () => {
    Debug.Log($"下载附件成功");

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

  },
  onProgress: (progress) => {
    Debug.Log($"下载附件进度 {progress}");
  },
  onError: (code, desc) => {
    Debug.Log($"附件下载失败，errCode={code}, errDesc={desc}");
  }
));

```

### 接收视频消息

1. 接收方收到视频消息时，自动下载视频缩略图。
   
   你可以设置自动或手动下载视频缩略图，该设置与图片缩略图相同，详见 [设置图片缩略图自动下载](#接收图片消息)。

2. 接收方收到 [OnMessageReceive](#接收文本消息) 回调，可以调用 `SDKClient.Instance.ChatManager.DownloadAttachment` 下载视频附件。下载完成后，使用相应消息 `Body` 的 `LocalPath` 成员获取视频文件路径。

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

### 接收文件消息

接收方收到 [OnMessageReceive 回调](#接收文本消息)，调用 `DownloadAttachment` 方法下载文件。

```csharp
/**
 * 下载文件。
 */
SDKClient.Instance.ChatManager.DownloadAttachment("Message ID", new CallBack(
  onSuccess: () => {
    Debug.Log($"下载附件成功");

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

  },
  onProgress: (progress) => {
    Debug.Log($"下载附件进度 {progress}");
  },
  onError: (code, desc) => {
    Debug.Log($"附件下载失败，errCode={code}, errDesc={desc}");
  }
));
```

## 接收位置消息

接收位置消息与文本消息一致，详见[接收文本消息](#接收文本消息)。
   
接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

## 接收透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

接收方通过 `OnMessagesReceived` 和 `OnCmdMessagesReceived` 回调接收透传消息，方便用户进行不同的处理。

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

## 接收自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

接收自定义消息与其他类型消息一致，详见[接收文本消息](#接收文本消息)。

## 接收合并消息

接收合并消息与接收普通消息的操作相同，详见[接收消息](#接收文本消息)。

- 对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `FetchCombineMessageDetail` 方法下载合并消息附件并解析出原始消息列表。
- 对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：
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

