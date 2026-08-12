# 发送消息

<Toc />

环信即时通讯 IM Web SDK 可以实现文本、图片、音频、视频和文件等类型的消息的发送和接收。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要[开启好友关系检查](/product/console/basic_user.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的 相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送文本消息

使用 `Message` 类创建并发送文本消息。示例代码如下：

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
  另外，你也可以 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。
- 对于图片消息，环信服务器会自动生成图片缩略图；对于视频消息，视频首帧为缩略图。

消息附件大小和存储限制，详见 [消息附件限制说明](limitation.html#消息存储)。

### 发送语音消息

1. 发送语音消息前，在 app 级别实现录音，提供录制的语音文件的 URI 和时长（单位为秒）。
2. 创建和发送语音消息。

```javascript
function sendPrivateAudio() {
  // 获取语音文件。
  let input = document.getElementById("audio");
  let file = WebIM.message.getFileUrl(input);
  let allowType = {
    mp3: true,
    amr: true,
    wmv: true,
  };
  if (file.filetype.toLowerCase() in allowType) {
    let option = {
      // 消息类型。
      type: "audio",
      file: file,
      // 语音文件长度，单位为秒。
      length: "3",
      // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
      to: "username",
      // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
      chatType: "singleChat",
      // 语音文件上传失败。
      onFileUploadError: function () {
        console.log("onFileUploadError");
      },
      // 语音文件上传进度。
      onFileUploadProgress: function (e) {
        console.log(e);
      },
      // 语音文件上传成功。
      onFileUploadComplete: function () {
        console.log("onFileUploadComplete");
      },
      ext: { },
    };
    // 创建一条语音消息。
    let msg = WebIM.message.create(option);
    // 调用 `send` 方法发送该语音消息。
    conn
      .send(msg)
      .then((res) => {
        // 语音文件成功发送。
        console.log("Success");
      })
      .catch((e) => {
        // 语音文件发送失败。
        console.log("Fail");
      });
  }
}
```

### 发送图片消息

自 SDK 4.22.0 版本新增大图资源，一条图片消息通常包含三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：服务端基于原图进行等比压缩后的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

发送图片消息的流程如下：

1. 获取图片的本地路径。
   
2. 创建和发送图片消息。 

  创建消息时，需要传入图片的本地路径、是否发送原图的标志，以及接收方的用户 ID。若为群聊或聊天室消息，则分别传入群组 ID 或聊天室 ID。

  `isOriginalImage` 参数用于控制实际上传的图片资源：`true` 表示 SDK 上传原图，`false` 表示上传大图。服务器自动生成缩略图。

```javascript
function sendPrivateImg() {
  // 选择本地图片文件。
  let input = document.getElementById("image");
  let file = WebIM.message.getFileUrl(input);
  let allowType = {
    jpg: true,
    gif: true,
    png: true,
    bmp: true,
  };
  if (file.filetype.toLowerCase() in allowType) {
    let option = {
      // 消息类型。
      type: "img",
      file: file,
      ext: {
        // 图片文件长度，单位为字节。
        file_length: file.data.size,
      },
      // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
      to: "username",
      // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
      chatType: "singleChat",
      // 图片文件上传失败。
      onFileUploadError: function () {
        console.log("onFileUploadError");
      },
      // 图片文件上传进度。
      onFileUploadProgress: function (e) {
        console.log(e);
      },
      // 图片文件上传成功。
      onFileUploadComplete: function () {
        console.log("onFileUploadComplete");
      },
      thumbnailHeight: 200,
      thumbnailWidth: 200,
      // 是否发送原图，默认为 false， 会进行压缩， 对方收到的是压缩后的大图。
			isOriginalImage: true,
    };
    // 创建一条图片消息。
    let msg = WebIM.message.create(option);
    // 调用 `send` 方法发送该图片消息。
    conn
      .send(msg)
      .then((res) => {
        // 图片文件成功发送。
        console.log("Success");
      })
      .catch((e) => {
        // 图片文件发送失败。
        console.log("Fail");
      });
  }
}
```

### 发送 GIF 图片消息

- 自 SDK 4.14.0 开始，支持发送 GIF 图片消息。
- GIF 图片消息是一种特殊的图片消息，在发送图片消息时可以指定是否是 GIF 图片。
- GIF 图片缩略图的生成与普通图片消息相同，详见 [发送图片消息](#发送图片消息)。

发送 GIF 图片消息过程如下：

1. 构造消息，设置 `isGif` 为 `true`。
2. 调用 `send` 方法发送消息。

```javascript
sendGIFMsg(){
    const file = WebIM.utils.getFileUrl(imgInput as HTMLInputElement);
    let option = {
      chatType: "singleChat",
      type: "img",
      to: "userId",
      file: file,
      isGif: file.data.type === "image/gif", // 设置是否是为GIF图片
    };
    let msg = WebIM.message.create(option);
    conn.send(msg);
}
```

### 发送视频消息

1. 发送视频消息之前，在 app 级别实现视频捕获，获得捕获的视频文件的时长，单位为秒。
2. 创建和发送视频消息。服务器自动生成视频缩略图。

```javascript
function sendPrivateVideo() {
  // 选择本地视频文件。
  let input = document.getElementById("video");
  let file = WebIM.message.getFileUrl(input);
  let allowType = {
    mp4: true,
    wmv: true,
    avi: true,
    rmvb: true,
    mkv: true,
  };
  if (file.filetype.toLowerCase() in allowType) {
    let option = {
      // 消息类型。
      type: "video",
      file: file,
      // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
      to: "username",
      // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
      chatType: "singleChat",
      onFileUploadError: function () {
        // 视频文件上传失败。
        console.log("onFileUploadError");
      },
      onFileUploadProgress: function (e) {
        // 视频文件上传进度。
        console.log(e);
      },
      onFileUploadComplete: function () {
        // 视频文件上传成功。
        console.log("onFileUploadComplete");
      },
      ext: { },
    };
    // 创建一条视频消息。
    let msg = WebIM.message.create(option);
    // 调用 `send` 方法发送该视频消息。
    conn
      .send(msg)
      .then((res) => {
        // 视频文件成功发送。
        console.log("Success");
      })
      .catch((e) => {
        // 视频文件发送失败。例如，本地用户被禁言或封禁。
        console.log("Fail");
      });
  }
}
```

### 发送文件消息

创建和发送文件消息，示例代码如下：

```javascript
function sendPrivateFile() {
  // 选择本地文件。
  let input = document.getElementById("file");
  let file = WebIM.message.getFileUrl(input);
  let allowType = {
    jpg: true,
    gif: true,
    png: true,
    bmp: true,
    zip: true,
    txt: true,
    doc: true,
    pdf: true,
  };
  if (file.filetype.toLowerCase() in allowType) {
    let option = {
      // 消息类型。
      type: "file",
      file: file,
      // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
      to: "username",
      // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
      chatType: "singleChat",
      // 文件上传失败。
      onFileUploadError: function () {
        console.log("onFileUploadError");
      },
      // 文件上传进度。
      onFileUploadProgress: function (e) {
        console.log(e);
      },
      // 文件上传成功。
      onFileUploadComplete: function () {
        console.log("onFileUploadComplete");
      },
      ext: { },
    };
    // 创建一条文件消息。
    let msg = WebIM.message.create(option);
    // 调用 `send` 方法发送该文件消息。
    conn
      .send(msg)
      .then((res) => {
        // 文件消息成功发送。
        console.log("Success");
      })
      .catch((e) => {
        // 文件消息发送失败。
        console.log("Fail");
      });
  }
}
```

## 发送位置消息

创建和发送位置消息。

发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。

```javascript
const sendLocMsg = () => {
  let coords;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      coords = position.coords;
      let option = {
        chatType: "singleChat",
        type: "loc",
        to: "username",
        addr: "四通桥东",
        buildingName: "数码大厦",
        lat: Math.round(coords.latitude),
        lng: Math.round(coords.longitude),
      };
      let msg = WebIM.message.create(option);
      conn.send(msg).then((res)=>{
        console.log("Send message success", res);
      }).catch((e)=>{
        console.log("Send message fail", e);
      });
    })
  }
}
```

## 发送透传消息

透传消息是通知指定用户采取特定操作的透传消息。接收方自己处理透传消息。

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
3. 对端收到合并消息后进行解析，获取原始消息列表。

你可以调用 `message.create` 方法创建一条合并消息，然后调用 `conn.send` 方法发送该条消息。

创建合并消息时，需要设置以下参数：

| 属性                   | 类型                                            | 描述         |
| :--------------------- | :---------------------------------------------- | :----------------------- |
| `chatType`             | ChatType                                        | 会话类型。     |
| `type`                 | 'combine'                                       | 消息类型。    |
| `to`                   | String                                          | 消息接收方。该字段的设置取决于会话类型：<br/> - 单聊：对方用户 ID；<br/> - 群聊：群组 ID；<br/> - 消息话题会话：消息话题 ID；<br/> - 聊天室聊天：聊天室 ID。    |
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

### 上传消息附件至自有服务器

若要将消息附件上传至你自己的服务器（而非环信服务器），需在 SDK 初始化时将 [`Connection` 类中的 `useOwnUploadFun` 参数](https://doc.easemob.com/jsdoc/classes/Connection.Connection-1.html) 设置为 `true`。发送消息时，直接传入已上传附件的 URL 即可。例如，发送图片消息时，可调用 `sendPrivateUrlImg` 方法并传入图片 URL。

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
  //  调用 `send` 方法发送该图片消息。
  conn.send(msg);
}
```

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

### 语聊房麦位管理

基于 [聊天室自定义属性](room_attributes.html)，实现语聊房的麦位状态管理与多端实时同步。将麦位列表（含用户信息、麦位状态、音量等字段）作为房间属性存储，任何麦位变更通过更新属性触发全房间广播，确保所有客户端状态一致。详见 [聊天室自定义属性](room_attributes.html)。

### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/value-added/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

默认情况下，内容审核替换后的内容仅下发至接收方。发送方如需同步接收替换内容，需 **联系环信商务开通权限**，并在初始化 SDK 时将 `useReplacedMessageContents` 参数设为 `true`。开启后，发送方将在消息被审核替换时收到新内容；若开关关闭（默认状态），则发送方仍保留原始发送内容，不会感知替换结果。

### 消息大小和存储限制

各类消息的大小和存储限制，详见 [消息限制说明](limitation.html#消息大小)。

### 发消息时设置回调路由

回调路由允许你在同一个 App Key 下，将不同消息按回调环境维度分别投递到不同的回调地址。发送消息时，你可以在消息中携带回调环境字段（如 `dev`、`test`、`prod`），环信服务器收到消息后，根据该字段匹配控制台中配置的 [回调路由规则](/product/console/basic_webhook.html#配置消息回调规则)，并将当前消息回调至对应的 [发送前回调](/document/server-side/callback_presending.html) 或 [发送后回调](/document/server-side/callback_postsending.html) 地址。

:::tip
目前，该功能仅面向国内 1 区和国内 2 区开放。
:::

**适用场景**

| 场景               | 说明                                                         |
| :----------------- | :----------------------------------------------------------- |
| 多环境隔离     | 同一 App Key 下区分开发、测试、生产环境，消息分别回调至各自的服务地址。 |
| 灰度发布      | 部分消息回调至新链路验证，其余消息仍走旧链路。               |
| 多业务线分流   | 不同业务模块的消息回调至各自的审核、风控或同步服务。         |
| 降低发送前时延 | 避免消息先统一回调至一个入口，再由业务服务器二次转发。       |

**适用范围**

| 回调类型    | 生效范围       | 说明      |
| :------------- | :------- | :---------------- |
| [发送前回调](/document/server-side/callback_presending.html) | 仅对 **SDK 发送的消息** 生效（不支持群组/聊天室的定向消息）。 | 消息下发给目标用户前，你的服务器可判断是否拦截或修改消息内容。 |
| [发送后回调](/document/server-side/callback_postsending.html) | 对 **SDK 和 REST API 发送的消息** 均生效。  | 消息成功发送后，通知你的服务器。   |

**工作流程**

1. 在控制台为发送前回调或发送后回调 [配置回调路由](/product/console/basic_webhook.html#配置消息回调规则)。
2. 客户端发送消息时，设置回调环境值。
3. 环信服务器收到消息后，根据消息中的回调环境值匹配当前阶段的回调地址。
4. 命中有效路由后，服务器将回调请求发送到对应地址。

**示例代码**

发送消息时，可通过消息创建参数 `webhookEnv` 设置回调环境。该参数的说明如下：

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `webhookEnv` | `string` | 否 | 回调环境值。仅支持字母和数字，长度不能超过 8 个字符。服务器根据该值匹配控制台中配置的回调地址。建议与控制台中设置的回调环境保持一致，例如 `dev`、`test`、`prod`。 |

创建消息时设置回调环境：

```typescript
const message = WebIM.message.create({
  type: "txt",
  msg: "hello",
  to: "toUser",
  chatType: "singleChat",
  webhookEnv: "test",
});

// 发送消息
WebIM.conn.send(message);
```

读取当前消息设置的回调环境值：

```typescript
const webhookEnv = message.webhookEnv;
```

**消息中的回调环境字段命中规则**

| 场景                                     | 路由结果                                                     |
| :--------------------------------------- | :----------------------------------------------------------- |
| 携带环境值且命中有效路由           | 按该环境值路由至对应的回调地址。                             |
| 携带环境值但未命中有效路由           | **不触发回调**，控制台中的 `default` 兜底配置在此场景下 **不生效**。 |
| 未携带环境值                         | 自动路由至 `default` 环境对应的回调地址。                    |
| 同一消息需同时触发发送前与发送后回调 | 两个阶段必须使用 **相同的环境值**。例如，发送前配置 `test -> url1`，发送后配置 `test -> url2`，则消息中携带 `test` 即可同时生效于两阶段。 |