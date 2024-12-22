# 发送和接收消息

<Toc />

环信即时通讯 IM 的小程序 SDK 可以实现文本、图片、音频、视频和文件等类型的消息的发送和接收。

- 对于单聊，环信即时通信 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要[开启好友关系检查](/product/enable_and_configure_IM.html#好友关系检查)。

- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。

单聊、群组聊天和聊天室的消息发送控制，详见[消息发送控制](/product/product_message_overview.html#消息发送控制)文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送和接收文本消息

1. 使用 `Message` 类创建并发送文本消息。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509 `MESSAGE_CURRENT_LIMITING`。

```JavaScript
// 发送文本消息。
function sendTextMessage() {
  let option = {
    // 消息类型。
    type: "txt",
    // 消息内容。
    msg: "message content",
    // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
    to: "username",
    // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`，默认为单聊。
    chatType: "singleChat",
  };
  // 创建文本消息。
  let msg = WebIM.message.create(option);
  // 调用 `send` 方法发送该文本消息。
  conn.send(msg).then((res)=>{
     console.log("Send message success",res);
  }).catch((e)=>{
      console.log("Send message fail",e);
  });
}
```

2. 你可以通过 `addEventHandler` 注册监听器监听消息事件。你可以添加多个事件。当不再监听事件时，请确保删除监听器。

当消息到达时，接收方会收到 `onTextMessage` 回调。每个回调包含一条或多条消息。你可以遍历消息列表，并可以解析和展示回调中的消息。

对于聊天室消息，你可以通过消息的 `broadcast` 属性判断该消息是否为[通过 REST API 发送的聊天室全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。

```JavaScript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  onTextMessage: function (message) {},
  
});
```

## 发送和接收附件消息

语音、图片、视频和文件消息本质上是附件消息。发送和接收附件消息的流程如下：

1. 创建和发送附件类型消息。SDK 将附件上传到环信服务器，获取消息的基本信息以及服务器上附件文件的路径。

  对于图片消息来说，环信服务器会自动生成图片缩略图；而对于视频消息来说，视频的首帧为缩略图。

2. 接收附件消息。

   接收方可以自行下载语音、图片、图片缩略图、视频和文件。
   
对于消息附件，你也可以将附件上传到自己的服务器，而不是环信服务器，然后发送消息。这种情况下，需要在 SDK 初始化时将 [`Connection` 类中的 `useOwnUploadFun` 参数](https://doc.easemob.com/jsdoc/classes/Connection.Connection-1.html)设置为 `true`。例如，对于图片消息，上传附件后，调用 `sendPrivateUrlImg` 方法传入图片的 URL 发送图片消息。

```JavaScript
function sendPrivateUrlImg() {
  let option = {
    chatType: "singleChat",
    // 消息类型。
    type: "img",
    // 图片文件的 URL 地址。
    url: "img url",
    // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
    to: "username",
  };
  // 创建一条图片消息。
  let msg = WebIM.message.create(option);
  // 调用 `send` 方法发送该图片消息。
  conn.send(msg);
}
```

### 发送和接收语音消息

在发送语音消息前，你应该在 app 级别实现录音，提供录制的语音文件的 URI 和时长（单位为秒）。

1. 创建和发送语音消息。

```JavaScript
/**
 * @param {Object} tempFilePath - 要上传的文件的小程序临时文件路径。
 * @param {Object} duration - 语音时长，单位为秒。
 */
function sendPrivateAudio(tempFilePath, duration) {
  var str = WebIM.config.appkey.split("#");
  var token = WebIM.conn.context.accessToken;
  var domain = WebIM.conn.apiUrl;
  wx.uploadFile({
    url: domain + "/" + str[0] + "/" + str[1] + "/chatfiles",
    filePath: tempFilePath,
    name: "file",
    header: {
      Authorization: "Bearer " + token
    },
    success(res) {
      var dataObj = JSON.parse(res.data);
      var option = {
        type: "audio",
        chatType: "singleChat",
        filename: tempFilePath,
        // 消息接收方：单聊为对端用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
        to: "username", 
        body: {
          //文件 URL。
          url: dataObj.uri + "/" + dataObj.entities[0].uuid,
          //文件类型。
          type: "audio",
          //文件名。
          filename: tempFilePath,
          // 音频文件时长，单位为秒。
          length: Math.ceil(duration / 1000),
        },
      };
      let msg = WebIM.message.create(option);
      // 调用 `send` 方法发送该语音消息。
      conn
        .send(msg)
        .then((res) => {
          // 语音消息成功发送。
          console.log("Success");
        })
        .catch((e) => {
          // 语音消息发送失败。
          console.log("Fail", e);
        });
    },
  });
}
```

2. 接收方收到 `onAudioMessage` 回调，根据消息 `url` 字段获取语音文件的服务器地址，从而获取语音文件。

```JavaScript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  // 当前用户收到语音消息。
  onAudioMessage: function (message) {
    // 语音文件在服务器的地址。
    console.log(message.url);
  },
});

```

### 发送和接收图片消息

发送和接收图片消息的流程如下：

1. 创建和发送图片消息。

```JavaScript
function sendImage() {
  var me = this;
  wx.chooseImage({
    count: 1,
    sizeType: ["original", "compressed"],
    sourceType: ["album"],
    success(res) {
      me.sendPrivateImg(res);
    },
  });
}

function sendPrivateImg(res) {
  var me = this;
  var tempFilePaths = res.tempFilePaths;
  var token = WebIM.conn.context.accessToken;
  wx.getImageInfo({
    src: res.tempFilePaths[0],
    success(res) {
      var allowType = {
        jpg: true,
        gif: true,
        png: true,
        bmp: true,
      };
      var str = WebIM.config.appkey.split("#");
      var width = res.width;
      var height = res.height;
      var index = res.path.lastIndexOf(".");
      var filetype = (~index && res.path.slice(index + 1)) || "";
      var domain = wx.WebIM.conn.apiUrl + "/";
      if (filetype.toLowerCase() in allowType) {
        wx.uploadFile({
          url: domain + str[0] + "/" + str[1] + "/chatfiles",
          filePath: tempFilePaths[0],
          name: "file",
          header: {
            Authorization: "Bearer " + token
          },
          success(res) {
            if (res.statusCode === 400) {
              // 图片上传阿里云检验不合法
              var errData = JSON.parse(res.data);
              if (errData.error === "content improper") {
                wx.showToast({
                  title: "图片不合法",
                });
                return false;
              }
            }
            var data = res.data;
            var dataObj = JSON.parse(data);
            var option = {
              type: "img",
              chatType: "singleChat",
              width: width,
              height: height,
              url: dataObj.uri + "/" + dataObj.entities[0].uuid,
              // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
              to: "username", 
            };
            let msg = WebIM.message.create(option);
            // 调用 `send` 方法发送该图片消息。
            conn
              .send(msg)
              .then((res) => {
                // 图片消息成功发送。
                console.log("Success");
              })
              .catch((e) => {
                // 图片消息发送失败。
                console.log("Fail");
              });
          },
        });
      }
    },
  });
}
```

2. 接收方收到 `onImageMessage` 回调，根据消息 `url` 字段获取图片文件的服务器地址，从而获取图片文件。

```JavaScript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  onImageMessage: function (message) {},
});
```

### 发送和接收视频消息

在发送视频消息之前，应在 app 级别实现视频捕获以及捕获文件的上传。

1. 创建和发送视频消息。

```JavaScript
function sendPrivateVideo(){
			var me = this;
			var token = WebIM.conn.context.accessToken
			wx.chooseVideo({
				sourceType: ["album", "camera"],
				maxDuration: 30,
				camera: "back",
				success(res){
					var tempFilePaths = res.tempFilePath;
					var str = WebIM.config.appkey.split("#");
					var domain = wx.WebIM.conn.apiUrl + '/'
					wx.uploadFile({
						url: domain + str[0] + "/" + str[1] + "/chatfiles",
						filePath: tempFilePaths,
						name: "file",
						header: {
							Authorization: "Bearer " + token
						},
						success(res){
							var data = res.data;
							var dataObj = JSON.parse(data);
  						var option = {
                  // 消息类型。
									type: "video",
                  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
									chatType: "singleChat",
                  // 文件名。
                  filename: "filename",
                  // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
									to: "username",
                  body: {
                    //文件 URL。
                    url:dataObj.uri + "/" + dataObj.entities[0].uuid,
                    //文件类型。
                    type: "video",
                    //文件名称。
                    filename: "filename",
                  },
							}
              let msg = WebIM.message.create(option);
               // 调用 `send` 方法发送该视频消息。
              WebIM.conn.send(msg).then((res)=>{
               // 视频消息成功发送。
                console.log("Success");
              }).catch((e)=>{
                // 视频消息发送失败。
                console.log("Fail");
              });
						}
					});
				}
			});
		},
```


2. 接收方收到 `onVideoMessage` 回调，根据消息 `url` 字段获取视频文件的服务器地址，从而获取视频文件。

```JavaScript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  // 当前用户收到视频消息。
  onVideoMessage: function (message) {
    // 视频文件在服务器的地址。
    console.log(message.url);
    // 视频首帧缩略图文件在服务器的地址。
    console.log(message.thumb);
  },
});
```

### 发送和接收文件消息

发送文件消息前，应先选择文件。微信小程序仅支持从客户端会话选择文件。

1. 创建和发送文件消息。

```JavaScript
// 发送文件消息。
function sendFileMessage() {
      const me = this;
      // 微信小程序仅支持从客户端会话选择文件。
      wx.chooseMessageFile({
        // 可选择的最大文件数。
        count: 1,
        success(res) {
          const domain = wx.WebIM.conn.apiUrl + "/";
          const [orgName, appName] = WebIM.config.appkey.split("#");
          const token = WebIM.conn.context.accessToken;
          const tempFiles = res.tempFiles[0];
          const fileName = tempFiles.name;
          const fileSize = tempFiles.size;
          const filePath = tempFiles.path;
          const index = fileName.lastIndexOf(".");
          const filetype = (~index && fileName.slice(index + 1)) || "";

          // 上传文件到服务器。
          wx.uploadFile({
            url: domain + orgName + "/" + appName + "/chatfiles",
            filePath: filePath,
            name: "file",
            header: {
              Authorization: "Bearer " + token
            },
            success(res) {
              // 获取返回数据。
              let data = res.data;
              let dataObj = JSON.parse(data);
              let option = {
                // 消息类型。
                type: "file",
                // 单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
                chatType: "singleChat",
                // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
                to: "userId",
                body: {
                  // 文件 URL。
                  url: dataObj.uri + "/" + dataObj.entities[0].uuid,
                  // 文件类型。
                  type: filetype,
                  // 文件名称。
                  filename: fileName,
                  // 文件大小。
                  file_length: fileSize
                }
              };
              
              // 创建消息。
              const msg = WebIM.message.create(option);
              // 发送消息。
              conn
                .send(msg)
                .then((res) => {
                  console.log(res, "send file message success");
                })
                .catch((e) => {
                  console.log(e, "send file message error");
                });
            }
          });
        }
      });
    }
```

2. 接收方收到 `onFileMessage` 回调，根据消息 `url` 字段获取文件的服务器地址，从而获取文件。

```JavaScript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  // 当前用户收到文件消息。
  onFileMessage: function (message) {
    // 文件在服务器的地址。
    console.log(message.url);
  },
});

```

## 发送和接收位置消息

发送和接收位置消息的流程如下：

1. 创建和发送位置消息。

发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。
```JavaScript
const sendLocMsg = () => {
  let option = {
    chatType: "singleChat",
    type: "loc",
    to: "username",
    addr: "四通桥东",
    buildingName: "数码大厦",
    lat: 40, // 纬度
    lng: 116, // 经度
  };
  let msg = WebIM.message.create(option);
  conn.send(msg).then((res)=>{
        console.log("Send message success"，res);
    }).catch((e)=>{
        console.log("Send message fail"，e);
    });
};
```

2. 接收方收到 `onLocationMessage` 回调，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

```JavaScript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  onLocationMessage: function (message) {},
});
```

## 发送和接收透传消息

透传消息是通知指定用户采取特定操作的命令消息。接收方自己处理透传消息。

:::tip
透传消息发送后，不支持撤回。
:::

1. 创建和发送透传消息。

```JavaScript
function sendCMDMessage() {
  let option = {
    // 消息类型。
    type: "cmd",
    // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
    chatType: "singleChat",
    // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
    to: "username",
    // 自定义动作。对于透传消息，该字段必填。
    action: "action",
    // 消息扩展信息。
    ext: { key: "extends messages" },
  };
  // 创建一条透传消息。
  let msg = WebIM.message.create(option);
  // 调用 `send` 方法发送该透传消息。
  conn
    .send(msg)
    .then((res) => {
      // 消息成功发送回调。
      console.log("Success");
    })
    .catch((e) => {
      // 消息发送失败回调。
      console.log("Fail");
    });
}
```

2. 接收方通过 `onCmdMessage` 回调接收透传消息。

```JavaScript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  onCmdMessage: function (message) {},
});
```


## 发送和接收自定义消息

自定义消息为用户自定义的键值对，包括消息类型和消息内容。
发送和接收自定义消息的流程如下：

1. 创建和发送自定义消息。

```JavaScript
function sendCustomMsg() {
  // 设置自定义事件。
  let customEvent = "customEvent";
  // 通过键值对设置自定义消息内容。
  let customExts = {};
  let option = {
    // 消息类型。
    type: "custom",
    // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
    to: "username",
    // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
    chatType: "singleChat",
    customEvent,
    // key 和 value 只支持字符串类型，否则客户端无法解析。
    customExts,
    // 消息扩展字段，不能设置为空，即设置为 "ext:null" 会出错。
    ext: {},
  };
  // 创建一条自定义消息。
  let msg = WebIM.message.create(option);
  // 调用 `send` 方法发送该自定义消息。
  conn
    .send(msg)
    .then((res) => {
      // 消息成功发送回调。
      console.log("Success");
    })
    .catch((e) => {
      // 消息发送失败回调。
      console.log("Fail");
    });
}
```

2. 接收方通过 `onCustomMessage` 回调接收自定义消息。

```JavaScript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  onCustomMessage: function (message) {},
});
```

## 发送和接收合并消息

为了方便消息互动，即时通讯 IM 自 4.2.0 版本开始支持将多个消息合并在一起进行转发。你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。
3. 对端收到合并消息后进行解析，获取原始消息列表。

:::tip

该功能在 uniapp 中暂不支持运行到原生手机端。

:::
#### 创建和发送合并消息

你可以调用 `message.create` 方法创建一条合并消息，然后调用 `connection.send` 方法发送该条消息。

创建合并消息时，需要设置以下参数：

| 属性                   | 类型                                            | 描述         |
| :--------------------- | :---------------------------------------------- | :----------------------- |
| `chatType`             | ChatType                                        | 会话类型。     |
| `type`                 | 'combine'                                       | 消息类型。    |
| `to`                   | String                                          | 消息接收方。该字段的设置取决于会话类型：<br/> - 单聊：对方用户 ID；<br/> - 群聊：群组 ID；<br/> - 子区会话：子区 ID；<br/> - 聊天室聊天：聊天室 ID。    |
| `title`                | String                                          | 合并消息的标题。   |
| `summary`              | String                                          | 合并消息的概要。   |
| `compatibleText`       | String                                          | 合并消息的兼容文本。<br/>兼容文本起向下兼容不支持消息合并转发的版本的作用。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。 |
| `messageList`        | MessagesType[]                                  | 合并消息的消息列表。该列表最多包含 300 个消息。        |
| `onFileUploadComplete` | (data: { url: string; secret: string;}) => void | 合并消息文件上传完成的回调。     |
| `onFileUploadError`    | (error: any) => void                            | 合并消息文件上传失败的回调。      |

:::tip
1. 合并转发支持嵌套，最多支持 10 层嵌套，每层最多 300 条消息。
2. 只有成功发送或接收的消息才能合并转发。
:::

示例代码如下：

```JavaScript
let option = {
  chatType: "singleChat",
  type: "combine",
  to: "userId",
  compatibleText: "SDK 版本低，请升级",
  title: "聊天记录",
  summary: "hi",
  messageList: [
    {
      type: "txt",
      chatType: "singleChat",
      // ...
    },
  ],
  onFileUploadComplete: (data) => {
    option.url = data.url;
  },
};
let msg = WebIM.message.create(option);
conn.send
  .send(msg)
  .then((res) => {
    console.log("发送成功", res);
  })
  .catch((err) => {
    console.log("发送失败", err);
  });
```

#### 接收和解析合并消息

接收合并消息与接收普通消息的操作相同，唯一不同是对于合并消息来说，消息接收事件为 `onCombineMessage`。

对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。

合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `downloadAndParseCombineMessage` 方法下载合并消息附件并解析出原始消息列表。

```JavaScript
connection
  .downloadAndParseCombineMessage({
    url: msg.url,
    secret: msg.secret,
  })
  .then((res) => {
    console.log("合并消息解析后的消息列表", res);
  });
```

## 发送和接收定向消息

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

该功能适用于文本消息、图片消息和音视频消息等全类型消息，最多可向群组或聊天室的 20 个成员发送定向消息。

:::tip
1. 仅 SDK 4.2.0 及以上版本支持。
2. 定向消息不写入服务端会话列表，不计入服务端会话的未读消息数。
3. 群组定向消息的漫游功能默认关闭，使用前需联系商务开通。
4. 聊天室定向消息的漫游功能默认关闭，使用前需联系商务开通聊天室消息漫游和定向消息漫游功能。
:::

发送定向消息的流程与发送普通消息相似，唯一区别是需要设置定向消息的接收方。

下面以文本消息为例介绍如何发送定向消息，示例代码如下：

```JavaScript
// 发送定向文本消息。
function sendTextMessage() {
  let option = {
    // 消息类型。
    type: "txt",
    // 消息内容。
    msg: "message content",
    // 消息接收方所在群组或聊天室的 ID。
    to: "groupId",
    // 会话类型：群聊和聊天室分别为 `groupChat` 和 `chatRoom`。
    chatType: "groupChat",
    // 消息的接收方列表。最多可传 20 个接收方的用户 ID。若不设置该字段或传入数组类型之外的值，如字符串，则消息发送给群组或聊天室的所有成员。
    receiverList: ['uId1','uId2'],
  };
  // 创建文本消息。
  let msg = WebIM.message.create(option);
  // 调用 `send` 方法发送该文本消息。
    conn.send(msg).then((res)=>{
      console.log("Send message success",res);
    }).catch((e)=>{
      console.log("Send message fail",e);
    });
}
```

接收定向消息与接收普通消息的操作相同，详见各类消息的接收描述。

## 使用消息扩展

如果上述类型的消息无法满足要求，你可以使用消息扩展为消息添加属性。这种情况可用于更复杂的消息传递场景，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```JavaScript
function sendTextMessage() {
  let option = {
    type: "txt",
    msg: "message content",
    to: "username",
    chatType: "singleChat",
    // 设置消息扩展信息。扩展字段为可选，若带有该字段，值不能为空，即 "ext:null" 会出错。
    ext: {
      key1: "Self-defined value1",
      key2: {
        key3: "Self-defined value3",
      },
    },
  };
  let msg = WebIM.message.create(option);
  //  调用 `send` 方法发送该扩展消息。
  conn
    .send(msg)
    .then((res) => {
      console.log("send private text Success");
    })
    .catch((e) => {
      console.log("Send private text error");
    });
}
```

## 更多

### 设置聊天室消息优先级

针对聊天室消息并发量较大的场景，即时通讯服务提供消息分级功能。你可以通过设置消息优先级，将消息划分为高、普通和低三种级别。你可以在创建消息时，将指定消息类型，或指定成员的所有消息设置为高优先级，确保此类消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

对于聊天室消息，可设置消息优先级，包括高、普通和低优先级。示例代码如下：

```JavaScript
// 发送文本消息。
function sendTextMessage() {
    let option = {
        type: "txt",
        msg: "message content",
        // 聊天室消息的优先级。如果不设置，默认值为 `normal`，即“普通”优先级。
        priority: "high"
        to: "chat room ID",
        chatType: "chatRoom",
    };
    let msg = WebIM.message.create(option);
    conn.send(msg).then(()=>{
        console.log("Send message success");
    }).catch((e)=>{
        console.log("Send message fail");
    });
}
```

### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/product/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

若初始化时打开了 `EMOptions#setUseReplacedMessageContents` 开关，发送文本消息时如果被内容审核（Moderation）进行了内容替换，发送方会收到替换后的内容。若该开关为关闭状态，则发送方不会收到替换后的内容。