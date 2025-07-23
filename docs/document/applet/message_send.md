# 发送消息

<Toc />

环信即时通讯 IM 的小程序 SDK 可以实现文本、图片、音频、视频和文件等类型的消息的发送和接收。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/enable_and_configure_IM.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的 相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送文本消息

使用 `Message` 类创建并发送文本消息。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509 `MESSAGE_CURRENT_LIMITING`。

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
  let msg = WebIM.message.create(option);
  // 调用 `send` 方法发送该文本消息。
  conn.send(msg).then((res)=>{
     console.log("Send message success",res);
  }).catch((e)=>{
      console.log("Send message fail",e);
  });
}
```

## 发送附件消息

- 语音、图片、视频和文件消息本质上是附件消息。
- 创建和发送附件类型消息。SDK 将附件上传到环信服务器，获取消息的基本信息以及服务器上附件文件的路径。
- 对于图片消息，环信服务器会自动生成图片缩略图；对于视频消息，视频的首帧为缩略图。
   
对于消息附件，你也可以将附件上传到自己的服务器，而不是环信服务器，然后发送消息。这种情况下，需要在 SDK 初始化时将 [`Connection` 类中的 `useOwnUploadFun` 参数](https://doc.easemob.com/jsdoc/classes/Connection.Connection-1.html)设置为 `true`。例如，对于图片消息，上传附件后，调用 `sendPrivateUrlImg` 方法传入图片的 URL 发送图片消息。

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
  conn.send(msg);
}
```

### 发送语音消息

1. 发送语音消息前，在 app 级别实现录音，提供录制的语音文件的 URI 和时长（单位为秒）。

2. 创建和发送语音消息。

```javascript
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

### 发送图片消息

创建和发送图片消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。

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

### 发送 GIF 图片消息

- 自小程序 SDK 4.14.0 开始，支持发送 GIF 图片消息。
- GIF 图片消息是一种特殊的图片消息，在发送图片消息时可以指定是否是 GIF 图片。
- GIF 图片缩略图的生成与普通图片消息相同，详见 [发送图片消息](#发送图片消息)。

构造消息时，设置 `isGif` 为 `true`。

```javascript
sendGIFMsg(){
    const file = EC.utils.getFileUrl(imgInput as HTMLInputElement);
    let option = {
      chatType: "singleChat",
      type: "img",
      to: "userId",
      file: file,
      isGif: file.data.type === "image/gif", // 设置是否为 GIF 图片
    };
    let msg = EC.message.create(option);
    conn.send(msg);
}
```

### 发送视频消息

1. 发送视频消息之前，在 app 级别实现视频捕获以及捕获文件的上传。

2. 创建和发送视频消息。SDK 会将视频文件上传至消息服务器。服务端自动生成视频消息的缩略图。

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

### 发送文件消息

1. 发送文件消息前，先选择文件。微信小程序仅支持从客户端会话选择文件。

2. 创建和发送文件消息。

```javascript
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

## 发送位置消息

创建和发送位置消息。

发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。

```javascript
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

## 发送透传消息

透传消息是通知指定用户采取特定操作的命令消息。接收方自己处理透传消息。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
透传消息发送后，不支持撤回。
:::

创建和发送透传消息，示例代码如下：

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

## 发送自定义消息

自定义消息为用户自定义的键值对，包括消息类型和消息内容。

创建和发送自定义消息，示例代码如下：

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

## 发送合并消息

为了方便消息互动，即时通讯 IM 自 4.2.0 版本开始支持将多个消息合并在一起进行转发。你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。

:::tip

该功能在 uniapp 中暂不支持运行到原生手机端。

:::

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

```javascript
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

## 更多

### 聊天室消息优先级与消息丢弃逻辑

- **消息优先级**：对于聊天室消息，环信即时通讯提供消息分级功能，支持高、普通和低三种优先级，高优先级的消息会优先送达。你可以在创建消息时对指定消息类型或指定成员的消息设置为高优先级，确保这些消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

- **消息丢弃逻辑**：对于单个聊天室，每秒发送的消息数量默认超过 20 条，则会触发消息丢弃逻辑，即首先丢弃低优先级的消息，优先保留高优先级的消息。若带有优先级的消息超过了 20 条/秒，则按照消息发送时间顺序处理，丢弃后发送的消息。

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

若初始化时打开了 `EMOptions#useReplacedMessageContents` 开关，发送文本消息时如果被内容审核（Moderation）进行了内容替换，发送方会收到替换后的内容。若该开关为关闭状态，则发送方不会收到替换后的内容。