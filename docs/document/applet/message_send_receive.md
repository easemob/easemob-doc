# 发送和接收消息

<Toc />

登录环信 IM 后，用户可以在单聊、群聊、聊天室中发送如下类型的消息：

- 文字消息，包含超链接和表情；
- 附件消息，包含图片、语音、视频及文件消息；
- 位置消息；
- 透传消息；
- 自定义消息。

对于聊天室消息，环信即时通讯提供消息分级功能，将消息的优先级划分为高、普通和低三种级别，高优先级的消息会优先送达。你可以在创建消息时对指定聊天室消息类型或指定成员的消息设置为高优先级，确保这些消息优先送达。这种方式确保在聊天室内消息并发量很大或消息发送频率过高时，重要消息能够优先送达，从而提升重要消息的可靠性。当服务器的负载较高时，会优先丢弃低优先级的消息，将资源留给高优先级的消息。不过，消息分级功能只确保消息优先到达，并不保证必达。服务器负载过高的情况下，即使是高优先级消息依然会被丢弃。

本文介绍如何使用即时通讯 IM SDK 实现小程序发送和接收这些类型的消息。

## 技术原理

环信即时通讯 IM SDK 可以实现消息的发送、接收与撤回。

发送和接收消息：

- 消息发送方调用 `create` 方法创建文本、文件或附件消息。
- 消息发送方调用 `send` 方法发送消息。
- 消息接收方调用 `addEventHandler` 监听消息事件，并在相应回调中接收消息。

消息收发流程如下：

1. 用户 A 发送一条消息到环信的消息服务器。
2. 单聊时消息服务器发消息给用户 B，群聊时发消息给群内其他每个成员。
3. 用户收到消息。

![img](@static/images/web/sendandreceivemsg.png)

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 发送文本消息

使用 `Message` 类创建并发送文本消息。示例代码如下：

```javascript
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
  let msg = WebIM.message.create(opt);
  // 调用 `send` 方法发送该文本消息。
  WebIM.conn
    .send(msg)
    .then(() => {
      console.log("Send message success");
    })
    .catch((e) => {
      console.log("Send message fail");
    });
}
```

对于聊天室消息，可设置消息优先级。示例代码如下：

```javascript
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
    let msg = WebIM.message.create(opt);
    conn.send(msg).then(()=>{
        console.log("Send message success");
    }).catch((e)=>{
        console.log("Send message fail");
    });
}
```

### 接收消息

你可以通过 `addEventHandler` 注册监听器监听消息事件。你可以添加多个事件。当不再监听事件时，请确保删除监听器。

当消息到达时，接收方会收到 `onXXXMessage` 回调。每个回调包含一条或多条消息。你可以遍历消息列表，并可以解析和展示回调中的消息。

```javascript
// 使用 `addEventHandler` 监听回调事件
WebIM.conn.addEventHandler("eventName", {
  // SDK 与环信服务器连接成功。
  onConnected: function (message) {},
  // SDK 与环信服务器断开连接。
  onDisconnected: function (message) {},
  // 当前用户收到文本消息。
  onTextMessage: function (message) {},
  // 当前用户收到图片消息。
  onImageMessage: function (message) {},
  // 当前用户收到透传消息。
  onCmdMessage: function (message) {},
  // 当前用户收到语音消息。
  onAudioMessage: function (message) {},
  // 当前用户收到位置消息。
  onLocationMessage: function (message) {},
  // 当前用户收到文件消息。
  onFileMessage: function (message) {},
  // 当前用户收到自定义消息。
  onCustomMessage: function (message) {},
  // 当前用户收到视频消息。
  onVideoMessage: function (message) {},
  // 当前用户订阅的其他用户的在线状态更新。
  onPresence: function (message) {},
  // 当前用户收到好友邀请。
  onContactInvited: function (msg) {},
  // 联系人被删除。
  onContactDeleted: function (msg) {},
  // 新增联系人。
  onContactAdded: function (msg) {},
  // 当前用户发送的好友请求被拒绝。
  onContactRefuse: function (msg) {},
  // 当前用户发送的好友请求被同意。
  onContactAgreed: function (msg) {},
  // 当前用户收到群组邀请。
  onGroupEvent: function (message) {},
  // 本机网络连接成功。
  onOnline: function () {},
  // 本机网络掉线。
  onOffline: function () {},
  // 调用过程中出现错误。
  onError: function (message) {},
  // 当前用户收到的消息被消息发送方撤回。
  onRecallMessage: function (message) {},
  // 当前用户发送的消息被接收方收到。
  onReceivedMessage: function (message) {},
  // 当前用户收到消息送达回执。
  onDeliveredMessage: function (message) {},
  // 当前用户收到消息已读回执。
  onReadMessage: function (message) {},
  // 当前用户收到会话已读回执。
  onChannelMessage: function (message) {},
});
```

### 撤回消息

用户发送消息 2 分钟内可以撤回消息。如需调整时间限制，请联系可联系环信即时通讯 IM 的商务经理。

```javascript
let option = {
  // 要撤回消息的消息 ID。
    mid: 'msgId',
  // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
    to: 'userID',
  // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
    chatType: 'singleChat'
};
WebIM.conn.recallMessage(option).then((res) => {
    console.log('success', res)
}).catch((error) => {
    // 消息撤回失败，原因可能是超过了撤销时限(超过 2 分钟)。
    console.log('fail', error)
```

你还可以使用 `onRecallMessage` 监听消息撤回状态：

```javascript
WebIM.conn.addEventHandler('MESSAGES',{
   onRecallMessage: (msg) => {
      // 这里需要在本地删除对应的消息，也可以插入一条消息：“XXX撤回一条消息”。
      console.log('Recalling the message success'，msg)
   }
})
```

### 发送附件消息

语音、图片、视频和文件消息本质上是附件消息。

在发送附件消息时，采取以下步骤：

1. 小程序上传附件到环信服务器，获取服务器上附件文件的信息
2. 调用 SDK 方法发送附件消息，包含消息的基本信息，以及服务器上附件文件的路径。

#### 发送语音消息

在发送语音消息之前，你应该在小程序实现录音及音频文件上传。

参考以下代码示例来创建和发送语音消息：

```javascript
/**
 * @param {Object} tempFilePath - 要上传的文件的小程序临时文件路径。
 * @param {Object} duration - 语音时长。
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
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
    success(res) {
      var dataObj = JSON.parse(res.data);
      var option = {
        type: "audio",
        chatType: "singleChat",
        filename: tempFilePath,
        // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
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
      WebIM.conn
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

#### 发送图片消息

请参考以下代码示例创建和发送图片消息：

```javascript
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
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
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
            WebIM.conn
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

#### 发送 URL 图片消息

发送 URL 图片消息之前，确保将 `useOwnUploadFun` 设置为 `true`。

```javascript
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
  WebIM.conn.send(msg);
}
```

#### 发送视频消息

在发送视频消息之前，应在 app 级别实现视频捕获以及捕获文件的上传。

参考以下代码示例创建和发送视频消息：

```javascript
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
							"Content-Type": "multipart/form-data",
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

#### 发送文件消息

参考以下代码示例创建、发送和接收文件消息：

```javascript
function sendFile() {
  const me = this;
  wx.chooseImage({
    count: 1,
    sizeType: ["original", "compressed"],
    sourceType: ["album"],
    success(res) {
      me.sendPrivateFile(res);
    },
  });
}

function sendPrivateFile(res) {
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
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
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
              // 消息类型。
              type: "file",
              // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
              chatType: "singleChat",
              to: "username",
              body: {
                //文件 URL。
                url: dataObj.uri + "/" + dataObj.entities[0].uuid,
                //文件类型。
                type: "file",
                //文件名称。
                filename: "filename",
              },
            };
            let msg = WebIM.message.create(option);
            // 调用 `send` 方法发送该文件消息。
            WebIM.conn
              .send(msg)
              .then((res) => {
                // 文件消息成功发送。
                console.log("Success");
              })
              .catch((e) => {
                // 文件消息发送失败。
                console.log("Fail");
              });
          },
        });
      }
    },
  });
}
```

### 发送透传消息

透传消息是通知指定用户采取特定操作的命令消息。接收方自己处理透传消息。

参考以下代码示例发送和接收透传消息：

```javascript
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
  WebIM.conn
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

### 发送自定义消息

自定义消息为用户自定义的键值对，包括消息类型和消息内容。

参考以下示例代码创建和发送自定义消息：

```javascript
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
    customExts,
    // 消息扩展字段，不能设置为空，即设置为 "ext:null" 这种形式会出错。
    ext: {},
  };
  // 创建一条自定义消息。
  let msg = WebIM.message.create(option);
  // 调用 `send` 方法发送该自定义消息。
  WebIM.conn
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

### 使用消息扩展

如果上述消息类型无法满足要求，你可以使用消息扩展为消息添加属性。这种情况可用于更复杂的消息传递场景，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```javascript
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
  // 调用 `send` 方法发送该扩展消息。
  WebIM.conn
    .send(msg)
    .then((res) => {
      console.log("send private text Success");
    })
    .catch((e) => {
      console.log("Send private text error");
    });
}
```
