# 发送消息

环信即时通讯 IM Unity SDK 通过 `IChatManager` 和 `Message` 类实现文本、图片、音频、视频和文件等类型的消息的发送。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/enable_and_configure_IM.html#好友关系检查)。

- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。

关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的 相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送文本消息

你可以利用 `Message` 类构造一个消息，然后通过 `IChatManager` 将该消息发出。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509 `MESSAGE_CURRENT_LIMITING`。 

示例代码：

```csharp
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

## 发送接收附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

附件消息的发送和接收过程如下：

1. 创建和发送附件类型消息。
2. SDK 将附件上传到环信服务器。

### 发送语音消息

1. 发送语音消息前，在应用层录制语音文件。
2. 发送方调用 `Message#CreateVoiceSendMessage` 方法传入语音文件的 URI、本地语音文件路径、语音时长和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建语音消息。
3. 发送方调用 `ChatManager#SendMessage` 方法发送消息。SDK 会将语音文件上传至环信服务器。

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

### 发送图片消息

1. 发送方调用 `Message#CreateImageSendMessage` 方法传入图片的本地资源路径、设置是否发送原图以及接收方的用户 ID 等参数创建图片消息。

图片消息默认会被压缩后发出，可通过设置 `original` 参数为 `true` 发送原图。

2. 发送方调用 `ChatManager#SendMessage` 方法发送消息。SDK 会将图片文件上传至环信服务器。

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

### 发送视频消息

1. 发送视频消息前，在应用层完成视频文件的选取或者录制。

发送视频消息时，应用层需要完成视频文件的选取或者录制。视频消息支持给出视频的时长作为参数，发送给接收方。

2. 发送方调用 `Message#CreateVideoSendMessage` 方法传入视频文件的本地资源标志符、缩略图的本地存储路径、视频时长以及接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID） 创建视频消息。若需要视频缩略图，你需自行获取视频首帧的路径，将该路径传入 `thumbnailLocalPath` 方法。
   
3. 发送方调用 `ChatManager#SendMessage` 方法发送视频消息。SDK 会将视频文件上传至消息服务器。

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

### 发送文件消息

1. 发送方调用 `Message#CreateFileSendMessage` 方法传入文件的本地资源标志符和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）等参数创建文件消息。
   
2. 发送方调用 `ChatManager#SendMessage` 方法发送文件消息。SDK 将文件上传至环信服务器。

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
```

## 发送位置消息

1. 发送方调用 `Message#CreateLocationSendMessage` 方法创建位置消息。
   
2. 发送方调用 `ChatManager#SendMessage` 方法发送位置消息。

发送位置时，需要集成第三方地图服务，获取到位置点的经纬度信息。

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

## 发送透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

发送透传消息的过程如下：

1. 发送方调用 `Message#CreateCmdSendMessage` 方法创建透传消息。
   
2. 发送方调用 `ChatManager#SendMessage` 方法发送透传消息。

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

## 发送自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

1. 发送方调用 `Message#CreateCustomSendMessage` 方法创建自定义消息。
   
2. 发送方调用 `ChatManager#SendMessage` 方法发送自定义消息。

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

## 发送合并消息

为了方便消息互动，即时通讯 IM 自 1.2.0 版本开始支持将多个消息合并在一起进行转发。你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。

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

## 更多

### 聊天室消息优先级与消息丢弃逻辑

- **消息优先级**：对于聊天室消息，环信即时通讯提供消息分级功能，支持高、普通和低三种优先级，高优先级的消息会优先送达。你可以在创建消息时对指定消息类型或指定成员的消息设置为高优先级，确保这些消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

- **消息丢弃逻辑**：对于单个聊天室，每秒发送的消息数量默认超过 20 条，则会触发消息丢弃逻辑，即首先丢弃低优先级的消息，优先保留高优先级的消息。若带有优先级的消息超过了 20 条/秒，则按照消息发送时间顺序处理，丢弃后发送的消息。

```csharp
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

