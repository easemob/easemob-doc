# 消息管理

消息是客户端集成中最重要的功能之一，WebIM 消息的使用方法主要为 ：

- 构造消息

- 发送消息

- 消息撤回

- 接收消息

- 处理消息

- 消息漫游

- 新消息提醒

- 消息回执

通过对消息的集成，您可以最快速的集成体验 IM 收发消息的流畅体验。

## 构造消息

```
let msg = new WebIM.message('txt', id);
msg.set(option);                //消息内容option，下面会有详细介绍
msg.setChatType('groupChat');   //用于设置当前聊天模式为单聊、群聊（groupChat）、聊天室（chatRoom），不设置默认为单聊
```

**注意：** 发送ext 扩展消息，可以没有这个字段，但是如果有，值不能是“ext:null”这种形式，否则出错

## 发送消息

环信支持向**单聊**、**群组**及**聊天室**中发送：

- 文本消息

- 表情消息

- 贴图消息

- URL图片消息

- 命令消息

- 附件消息

- 自定义消息

多样化的消息类型，覆盖多种场景下的消息需求。

### 发送文本消息（单聊、扩展）

单聊发送文本消息示例如下：

```
// 单聊发送文本消息
function sendPrivateText() {
    let id = conn.getUniqueId();                 // 生成本地消息id
    let msg = new WebIM.message('txt', id);      // 创建文本消息
    msg.set({
        msg: 'message content',                  // 消息内容
        to: 'username',                          // 接收消息对象（用户id）
        chatType: 'singleChat',                  // 设置为单聊
        ext: {
            key: value,
            key2: {
                key3: value2
            }
        },                                  //扩展消息
        success: function (id, serverMsgId) {
            console.log('send private text Success');  
        }, 
        fail: function(e){
            // 失败原因:
            // e.type === '603' 被拉黑
            // e.type === '605' 群组不存在
            // e.type === '602' 不在群组或聊天室中
            // e.type === '504' 撤回消息时超出撤回时间
            // e.type === '505' 未开通消息撤回
            // e.type === '506' 没有在群组或聊天室白名单
            // e.type === '501' 消息包含敏感词
            // e.type === '502' 被设置的自定义拦截捕获
            // e.type === '503' 未知错误
            console.log("Send private text error");  
        }
    });
    conn.send(msg.body);
};
```

### 发送文本消息（群组）

群组发送文本消息示例如下：

```
// 群组发送文本消息
function sendGroupText() {
    let id = conn.getUniqueId();            // 生成本地消息id
    let msg = new WebIM.message('txt', id); // 创建文本消息
    let option = {
        msg: 'message content',             // 消息内容
        to: 'group id',                     // 接收消息对象(群组id)
        chatType: 'groupChat',              // 群聊类型设置为群聊
        ext: {},                            // 扩展消息
        success: function () {
            console.log('send room text success');
        },                                  // 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
        fail: function () {
            console.log('failed');
        }                                   // 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
    };
    msg.set(option);
    conn.send(msg.body);
};
```

### 发送文本消息（聊天室）

聊天室发送文本消息示例如下：

```
// 聊天室发送文本消息
function sendRoomText() {
    let id = conn.getUniqueId();         // 生成本地消息id
    let msg = new WebIM.message('txt', id); // 创建文本消息
    let option = {
        msg: 'message content',          // 消息内容
        to: 'chatroom id',               // 接收消息对象(聊天室id)
        chatType: 'chatRoom',            // 群聊类型设置为聊天室
        ext: {},                         // 扩展消息
        success: function () {
            console.log('send room text success');
        },                               // 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
        fail: function () {
            console.log('failed');
        }                                // 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
    };
    msg.set(option);
    conn.send(msg.body);
};
```

:::tip
单聊和群聊的表现示例基本一样，区别在于接受消息的对象不同，单聊 to 的对象为**用户 ID** ，群组/聊天室 to 的对象为**群组/聊天室 ID**
:::
------

### 发送表情消息

发送表情同发送文本消息，需要在对方客户端将表情文本进行解析成图片。

单聊发送表情消息的代码示例如下：

```
conn.listen({
    onEmojiMessage: function (message) {
        console.log('Emoji');
        var data = message.data;
        for(var i = 0 , l = data.length ; i < l ; i++){
            console.log(data[i]);
        }
    },   //收到表情消息
});
// 单聊发送文本消息
var sendPrivateText = function () {
    var id = conn.getUniqueId();                 // 生成本地消息id
    var msg = new WebIM.message('txt', id);      // 创建文本消息
    msg.set({
        msg: 'message content',                  // 消息内容
        to: 'username',                          // 接收消息对象（用户id）
        chatType: 'singleChat',
        success: function (id, serverMsgId) {
            console.log('send private text Success');
        },
        fail: function(e){
            console.log("Send private text error");
        }
    });
    conn.send(msg.body);
};
```

:::tip
当为 WebIM 添加了 Emoji 属性后，若发送的消息含 WebIM.Emoji 里特定的字符串，connection 就会自动将这些字符串和其它文字按顺序组合成一个数组，每一个数组元素的结构为 {type:'emoji(或者txt)',data:'msg(或者src)'}

当 type='emoji' 时，data 表示**表情图像的路径**；

当 type='txt' 时，data 表示**文本消息**。
:::
------

### 发送贴图消息

Web IM SDK本身不支持截图，使用下述代码可以实现用户粘贴图片至输入框后发送。

单聊发送贴图消息的代码示例如下：

```
// 单聊贴图发送
document.addEventListener('paste', function (e) {
    if (e.clipboardData && e.clipboardData.types) {
        if (e.clipboardData.items.length > 0) {
            if (/^image\/\w+$/.test(e.clipboardData.items[0].type)) {
                var blob = e.clipboardData.items[0].getAsFile();
                var url = window.URL.createObjectURL(blob);
                var id = conn.getUniqueId();             // 生成本地消息id
                var msg = new WebIM.message('img', id);  // 创建图片消息
                msg.set({
                    file: {data: blob, url: url},
                    to: 'username',                      // 接收消息对象
                    chatType: 'singleChat',
                    onFileUploadError: function (error) {
                        console.log('Error');
                    },
                    onFileUploadComplete: function (data) {
                        console.log('Complete');
                    },
                    success: function (id) {
                        console.log('Success');
                    },
                    fail: function(e){
                        console.log("Fail"); //如禁言、拉黑后发送消息会失败
                    }
                });
                conn.send(msg.body);
            }
        }
    }
});
```

------

### 发送URL图片消息

App端需要开发者自己实现下载，Web端需要在 WebIMConfig.js中 设置 `useOwnUploadFun: true`。

单聊通过URL发送图片消息的代码示例如下：

```
// 单聊通过URL发送图片消息
 var sendPrivateUrlImg = function () {
    var id = conn.getUniqueId();                   // 生成本地消息id
    var msg = new WebIM.message('img', id);        // 创建图片消息
    var option = {
        body: {
          type: 'file',
          url: url,
          size: {
            width: msg.width,
            height: msg.height,
           },
          length: msg.length,
          filename: msg.file.filename,
          filetype: msg.filetype
        },
        to: 'username',  // 接收消息对象
    };
    msg.set(option);
    conn.send(msg.body);
 }
```

------

### 发送命令消息

发送命令消息的代码示例如下：

```
var id = conn.getUniqueId();            //生成本地消息id
var msg = new WebIM.message('cmd', id); //创建命令消息

msg.set({
  to: 'username',                        //接收消息对象
  action : 'action',                     //用户自定义，cmd消息必填
  ext :{'extmsg':'extends messages'},    //用户自扩展的消息内容（群聊用法相同）
  success: function ( id,serverMsgId ) {}, //消息发送成功回调 
  fail: function(e){
      console.log("Fail"); //如禁言、拉黑后发送消息会失败
  }
});   

conn.send(msg.body);
```

------

### 发送附件消息

附件消息是消息中重要的消息类型，附件消息主要包括以下几种：

- 图片消息

- 文件消息

- 音频消息

- 视频消息

#### 发送附件消息，SDK 自动分两步完成：

1. 上传附件到服务器，并得到服务返回的附件信息等；
2. 发送附件消息，消息体包含附件的基本信息、服务器路径、secret 等。

:::tip
web端和小程序发送附件消息是有区别的，小程序发送附件消息需要自己将附件上传到环信服务器，下面以发送图片消息展示小程序怎样发送附件消息
:::

单聊发送图片消息示例如下：

```
// web单聊发送图片消息
var sendPrivateImg = function () {
    var id = conn.getUniqueId();                   // 生成本地消息id
    var msg = new WebIM.message('img', id);        // 创建图片消息
    var input = document.getElementById('image');  // 选择图片的input
    var file = WebIM.utils.getFileUrl(input);      // 将图片转化为二进制文件
    var allowType = {
        'jpg': true,
        'gif': true,
        'png': true,
        'bmp': true
    };
    if (file.filetype.toLowerCase() in allowType) {
        var option = {
            file: file,
            length: '3000',                       // 视频文件时，单位(ms)
            ext: {
                file_length: file.data.size       // 文件大小
            },
            to: 'username',                       // 接收消息对象
            chatType: 'singleChat',               // 设置为单聊
            onFileUploadError: function () {      // 消息上传失败
                console.log('onFileUploadError');
            },
            onFileUploadProgress: function (e) { // 上传进度的回调
                console.log(e)
            },
            onFileUploadComplete: function () {   // 消息上传成功
                console.log('onFileUploadComplete');
            },
            success: function () {                // 消息发送成功
                console.log('Success');
            },
            fail: function(e){
                console.log("Fail");              //如禁言、拉黑后发送消息会失败
            },
            flashUpload: WebIM.flashUpload
        };
        msg.set(option);
        conn.send(msg.body);
    }
};

// 小程序单聊发送图片消息
sendImage(){
    const me = this;
    wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album"],
        success(res){
            me.upLoadImage(res);
        }
    });
}
upLoadImage(res){
    const me = this;
    let tempFilePaths = res.tempFilePaths;
    let token = WebIM.conn.context.accessToken
    wx.getImageInfo({
	src: res.tempFilePaths[0],
	success(res){
        let allowType = {jpg: true, gif: true, png: true, bmp: true};
        let str = WebIM.config.appkey.split("#");
        let width = res.width;
        let height = res.height;
        let index = res.path.lastIndexOf(".");
        let filetype = (~index && res.path.slice(index + 1)) || "";
        let domain = wx.WebIM.conn.apiUrl + '/'
        if(filetype.toLowerCase() in allowType){
            wx.uploadFile({
                url: domain + str[0] + "/" + str[1] + "/chatfiles",
                filePath: tempFilePaths[0],
                name: "file",
                header: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + token
                },
                success(res){
                    if(res.statusCode === 400){
                        // 图片上传阿里云检验不合法
                        let errData = JSON.parse(res.data);
                        if (errData.error === 'content improper') {
                            wx.showToast({
                                title: '图片不合法'
                            });
                            return
                        }
                    }
                    let data = res.data;
                    let dataObj = JSON.parse(data);
                    let id = WebIM.conn.getUniqueId(); // 生成本地消息 id
                    let msg = new WebIM.message(msgType.IMAGE, id);
                    let file = {
                        type: msgType.IMAGE,
                        size: {
                            width: width,
                            height: height
                        },
                        url: dataObj.uri + "/" + dataObj.entities[0].uuid,
                        filetype: filetype,
                        filename: tempFilePaths[0]
                    };
                    msg.set({
                        apiUrl: WebIM.config.apiURL,
                        body: file,
                        from: me.data.username.myName,
                        to: me.getSendToParam(),
                        chatType: me.data.chatType,
                        success: function (argument) {},
                        fail: function(e){
                            console.log("Fail"); //如禁言、拉黑后发送消息会失败
                        }
                    });
                    WebIM.conn.send(msg.body);
                }
            });
        }
    }
});
}
```

单聊发送文件消息示例如下：

```
// 单聊发送文件消息
var sendPrivateFile = function () {
    var id = conn.getUniqueId();                   // 生成本地消息id
    var msg = new WebIM.message('file', id);        // 创建文件消息
    var input = document.getElementById('file');  // 选择文件的input
    var file = WebIM.utils.getFileUrl(input);      // 将文件转化为二进制文件
    var allowType = {
        'jpg': true,
        'gif': true,
        'png': true,
        'bmp': true,
        'zip': true,
        'txt': true,
        'doc': true,
        'pdf': true
    };
    if (file.filetype.toLowerCase() in allowType) {
        var option = {
            file: file,
            to: 'username',                       // 接收消息对象
            chatType: 'singleChat',               // 设置单聊
            onFileUploadError: function () {      // 消息上传失败
                console.log('onFileUploadError');
            },
            onFileUploadProgress: function (e) { // 上传进度的回调
                console.log(e)
            },
            onFileUploadComplete: function () {   // 消息上传成功
                console.log('onFileUploadComplete');
            },
            success: function () {                // 消息发送成功
                console.log('Success');
            },
            fail: function(e){
                console.log("Fail");              //如禁言、拉黑后发送消息会失败
            },
            flashUpload: WebIM.flashUpload,
            ext: {file_length: file.data.size}
        };
        msg.set(option);
        conn.send(msg.body);
    }
};
```

单聊发送音频消息示例如下：

```
// 单聊发送音频消息
var sendPrivateAudio = function () {
    var id = conn.getUniqueId();                   // 生成本地消息id
    var msg = new WebIM.message('audio', id);      // 创建音频消息
    var input = document.getElementById('audio');  // 选择音频的input
    var file = WebIM.utils.getFileUrl(input);      // 将音频转化为二进制文件
    var allowType = {
        'mp3': true,
        'amr': true,
        'wmv': true
    };
    if (file.filetype.toLowerCase() in allowType) {
        var option = {
            file: file,
            length: '3',                          // 音频文件时长，单位(s)
            to: 'username',                       // 接收消息对象
            chatType: 'singleChat',               // 设置单聊
            onFileUploadError: function () {      // 消息上传失败
                console.log('onFileUploadError');
            },
            onFileUploadProgress: function (e) { // 上传进度的回调
                console.log(e)
            },
            onFileUploadComplete: function () {   // 消息上传成功
                console.log('onFileUploadComplete');
            },
            success: function () {                // 消息发送成功
                console.log('Success');
            },
            fail: function(e){
                console.log("Fail");              //如禁言、拉黑后发送消息会失败
            },
            flashUpload: WebIM.flashUpload,
            ext: {file_length: file.data.size}
        };
        msg.set(option);
        conn.send(msg.body);
    }
};
```

单聊发送视频消息示例如下：

```
// 单聊发送视频消息
var sendPrivateVideo = function () {
    var id = conn.getUniqueId();                   // 生成本地消息id
    var msg = new WebIM.message('video', id);      // 创建视频消息
    var input = document.getElementById('video');  // 选择视频的input
    var file = WebIM.utils.getFileUrl(input);      // 将视频转化为二进制文件
    var allowType = {
        'mp4': true,
        'wmv': true,
        'avi': true,
        'rmvb':true,
        'mkv':true
    };
    if (file.filetype.toLowerCase() in allowType) {
        var option = {
            file: file,
            to: 'username',                       // 接收消息对象
            chatType: 'singleChat',                 // 设置为单聊
            onFileUploadError: function () {      // 消息上传失败
                console.log('onFileUploadError');
            },
            onFileUploadProgress: function (e) { // 上传进度的回调
                console.log(e)
            },
            onFileUploadComplete: function () {   // 消息上传成功
                console.log('onFileUploadComplete');
            },
            success: function () {                // 消息发送成功
                console.log('Success');
            },
            fail: function(e){
                console.log("Fail");              // 如禁言、拉黑后发送消息会失败
            },
            flashUpload: WebIM.flashUpload,
            ext: {file_length: file.data.size}
        };
        msg.set(option);
        conn.send(msg.body);
    }
};
```

### 发送自定义消息

单聊发送自定义消息示例如下：

```
var sendCustomMsg = function () {
    var id = conn.getUniqueId();                 // 生成本地消息id
    var msg = new WebIM.message('custom', id);   // 创建自定义消息
    var customEvent = "customEvent";             // 创建自定义事件
    var customExts = {};                         // 消息内容，key/value 需要 string 类型
    msg.set({
        to: 'username',                          // 接收消息对象（用户id）
        customEvent,
        customExts,
        ext:{},                                  // 消息扩展
        chatType: 'singleChat',               // 设置聊天类型 单聊 群聊 聊天室
        success: function (id, serverMsgId) {},
        fail: function(e){}
    });
    conn.send(msg.body);
};
```

------

## 消息撤回


```
/**
 * 发送撤回消息
 * @param {Object} option - 
 * @param {Object} option.mid -   回撤消息id
 * @param {Object} option.to -   消息的接收方
 * @param {Object} option.type -  chat(单聊) groupchat(群组) chatroom(聊天室)
 * @param {Object} option.success - 撤回成功的回调
 * @param {Object} option.fail- 撤回失败的回调（超过两分钟）
 */
WebIM.conn.recallMessage(option)
```

------

## 接收消息

查看回调函数，接收各类消息的回调函数代码如下：

```
conn.listen({
    onOpened: function () {},          //连接成功回调  
    onClosed: function () {},         //连接关闭回调
    onTextMessage: function ( message ) {},    //收到文本消息
    onEmojiMessage: function ( message ) {},   //收到表情消息
    onPictureMessage: function ( message ) {}, //收到图片消息
    onCmdMessage: function ( message ) {},     //收到命令消息
    onAudioMessage: function ( message ) {},   //收到音频消息
    onLocationMessage: function ( message ) {},//收到位置消息
    onFileMessage: function ( message ) {},    //收到文件消息
    onCustomMessage: function ( message ) {},  //收到自定义消息
    onVideoMessage: function (message) {
        var node = document.getElementById('privateVideo');
        var option = {
            url: message.url,
            headers: {
              'Accept': 'audio/mp4'
            },
            onFileDownloadComplete: function (response) {
                var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                node.src = objectURL;
            },
            onFileDownloadError: function () {
                console.log('File down load error.')
            }
        };
        WebIM.utils.download.call(conn, option);
    },   //收到视频消息
    onPresence: function ( message ) {},       //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
    onRoster: function ( message ) {},         //处理好友申请
    onInviteMessage: function ( message ) {},  //处理群组邀请
    onOnline: function () {},                  //本机网络连接成功
    onOffline: function () {},                 //本机网络掉线
    onError: function ( message ) {},          //失败回调
    onBlacklistUpdate: function (list) {       //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
    },
    onRecallMessage: function( message ){},    //收到消息撤回回执
    onReceivedMessage: function(message){},    //收到消息送达服务器回执
    onDeliveredMessage: function(message){},   //收到消息送达客户端回执
    onReadMessage: function(message){},        //收到消息已读回执
    onCreateGroup: function(message){},        //创建群组成功回执（需调用createGroupNew）
    onMutedMessage: function(message){},       //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
    onChannelMessage: function(message){}      //收到整个会话已读的回执，在对方发送channel ack时会在这个回调里收到消息
});
```

------

## 处理消息

这里主要介绍几种特殊的消息处理示例

- 表情消息

- 图片消息

- 音频消息

### 表情消息

收到表情消息的处理示例：

```
conn.listen({
    onEmojiMessage: function (message) {
        console.log('Emoji');
        var data = message.data;
        for(var i = 0 , l = data.length ; i < l ; i++){
            console.log(data[i]);
        }
    },   //收到表情消息
});
```

**注意：**当为 WebIM 添加了 Emoji 属性后，若发送的消息含 WebIM.Emoji 里特定的字符串，connection 就会自动将这些字符串和其它文字按顺序组合成一个数组，每一个数组元素的结构为 **{type:'emoji(或者txt)',data:type}**

当 type='emoji' 时，data 表示**表情图像的路径**；

当 type='txt' 时，data 表示**文本消息**。

### 图片消息

收到图片消息的处理示例：

```
conn.listen({
    onPictureMessage: function (message) {
        console.log("Location of Picture is ", message.url);
    }, //收到图片消息
});
```

### 音频消息

收到音频消息的处理示例：

```
conn.listen({
  onAudioMessage: function ( message ) {
    // 在这里接收音频消息
  }
})
// 小程序播放
playAudio(message){
  let audioCtx = wx.createInnerAudioContext();
  let curl = ''
  wx.downloadFile({
  url: message.url,
  header: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "audio/mp3",
    Authorization: "Bearer " + this.data.msg.msg.token
  },
  success(res){
    curl = res.tempFilePath;
    audioCtx.src = curl;
    audioCtx.play();			
  },
  fail(e){
    wx.showToast({
      title: "下载失败",
      duration: 1000
    });
  }
});

// web
addAudioMessage: (message, bodyType) => {
  return (dispatch, getState) => {
    let options = {
          url: message.url,
          headers: {
            Accept: 'audio/mp3'
          },
          onFileDownloadComplete: function (response) {
            let objectUrl = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response)
            message.audioSrcUrl = message.url
              message.url = objectUrl
            },
          onFileDownloadError: function () {}
        }
      WebIM.utils.download.call(WebIM.conn, options)
   }
}
```

**注意：**

- 对于图片、语音消息需要先进行下载，然后进行显示或者播放处理。

#### API

示例中使用到的 API

- [listen](http://webim-h5.easemob.com/jsdoc/out/connection.html#listen)

------

## 消息漫游

漫游消息，`SDK增值功能`。

```
/**
 * 获取对话历史消息 支持Promise返回
 * @param {Object} options
 * @param {String} options.queue   - 对方用户id（如果用户id内含有大写字母请改成小写字母）/群组id/聊天室id
 * @param {String} options.count   - 每次拉取条数
 * @param {Boolean} options.isGroup - 是否是群聊，默认为false
 * @param {String} options.start - （非必需）起始位置的消息id，默认从最新的一条开始
 * @param {Function} options.success
 * @param {Funciton} options.fail
 */
var options = {
    queue: "test1", //需特别注意queue属性值为大小写字母混合，以及纯大写字母，会导致拉取漫游为空数组，因此注意将属性值装换为纯小写
    isGroup: false,
    count: 10,
    success: function(res){
       console.log(res) //获取拉取成功的历史消息
    },
    fail: function(){}
}
WebIM.conn.fetchHistoryMessages(options)
```

PS：如需重置拉取历史消息接口的游标可以通过：“WebIM.conn.mr_cache = []” 方法重置。

------

## 新消息提示

SDK 在收到新消息时会直接转发给登录用户，接收到消息后，Demo 中会在好友或者群组的后面显示红色消息数，具体样式开发者可自行处理。

------

## 会话列表

```
需联系商务同事单独开通
```

### 获取会话列表

当和一个用户或者在一个群中发消息后，就会自动把对方加到会话列表中，可以通过调用getSessionList去查询会话列表。建议一个页面只需要在初始时调用一次。使用该功能需要联系您的商务经理进行开通。（您可以在环信通讯云管理后台首页，扫描二维码联系您的商务经理） 特别注意：登陆ID不要为大小写混用的ID，拉取会话列表大小写ID混用会出现拉取会话列表为空。

```
WebIM.conn.getSessionList().then((res) => {
    console.log(res)
    /**
    返回参数说明
    channel_infos - 所有会话
    channel_id - 会话id, username@easemob.com表示单聊，groupid@conference.easemob.com表示群聊
    meta - 最后一条消息
    unread_num - 当前会话的未读消息数
    
    data{
        channel_infos:[
            {
                channel_id: 'easemob-demo#chatdemoui_username@easemob.com',
                meta: {},
                unread_num: 0
            },
            {
                channel_id: 'easemob-demo#chatdemoui_93734273351681@conference.easemob.com',
                meta: {
                    from: "easemob-demo#chatdemoui_zdtest@easemob.com/webim_1610159114836",
                    id: "827197124377577640",
                    payload: "{"bodies":[{"msg":"1","type":"txt"}],"ext":{},"from":"zdtest","to":"93734273351681"}",
                    timestamp: 1610161638919,
                    to: "easemob-demo#chatdemoui_93734273351681@conference.easemob.com"
                },
                unread_num: 0
            }
        ]
    }
    */
    
})
```

当需要清空会话的未读消息数时，可以查看消息回执中channel ack

### 删除会话

可以通过调用 deleteSession 去删除一个会话。

```
WebIM.conn.deleteSession({
    channel: 'userID', // 会话 ID（对方的 userID 或群组 ID）。
    chatType: 'singleChat', // 会话类型 singleChat（单聊） groupChat（群聊）。
    deleteRoam: true, // 是否同时删除服务端漫游消息。
})
```

------

## 消息回执

单聊：

- 已送达回执：在 webim.config.js 中配置 delivery 为 true ，在收到消息时会自动发送已送达回执，对方收到已送达回执的回调函数是 onDeliveredMessage

- 已读回执：

1. 当认为用户已读某条（些）消息时，可以生成已读回执，发送给对方，对方会在 onReadMessage 回调里收到已读回执
2. 也可以针对整个会话回复channel ack消息，表示整个会话的消息都已读。此回执消息是为了清空通过getSessionList获取会话列表中未读数的，比如调用getSessionList获取到会话列表，其中一个会话的未读消息数是5，那么可以在点击这个会话的时候回复一个channel消息，这个会话的未读数就会清零。

**单聊发送已读回执**

```
var bodyId = message.id;         // 需要发送已读回执的消息id
var msg = new WebIM.message('read',conn.getUniqueId());
msg.set({
    id: bodyId
    ,to: message.from
});
conn.send(msg.body);
```

**群聊已读回执**`SDK增值功能`：

- 发送群可以收已读回执的消息 (需要群主或管理员权限)

```
sendGroupReadMsg = () => {
  let id = conn.getUniqueId();                 // 生成本地消息id
  let msg = new WebIM.message('txt', id);      // 创建文本消息
  msg.set({
     msg: 'message content',                  // 消息内容
     to: 'groupId'
     chatType: 'groupChat',                   // 设置为群聊
     success: function (id, serverMsgId) {
         console.log('send private text Success');
     },
     fail: function(e){
         console.log("Send private text error");
     }
  });
  msg.body.msgConfig = { allowGroupAck: true } // 设置此消息需要已读回执
  conn.send(msg.body);
}
 
```

- 收到需要回执的消息后发送回执

```
sendReadMsg = () => {
  let msg = new WebIM.message("read", WebIM.conn.getUniqueId());
  msg.set({
      id: message.id,         // 需要发送已读回执的消息id
      to: message.from,       // 消息的发送方
      msgConfig: { allowGroupAck: true },
      ackContent: JSON.stringify({}) // 回执内容
  })
  msg.setChatType('groupChat')
  WebIM.conn.send(msg.body);
}
```

- 监听收到群组消息回执：分两种情况 1、正常在线时可以在 onReadMessage 函数里监听到回执，2、离线时收到群组消息回执，登录后会在onStatisticMessage函数里监听到回执

```
// 在线时可以在onReadMessage里监听
onReadMessage: (message) => {
  const { mid } = message;
  const msg = {
    id: mid
  };
  if(message.groupReadCount){
    // 消息阅读数
    msg.groupReadCount = message.groupReadCount[message.mid];
  }
}
      
// 离线时收到回执，登录后会在这里监听到
onStatisticMessage: (message) => {
  let statisticMsg = message.location && JSON.parse(message.location);
  let groupAck = statisticMsg.group_ack || [];
}
```

- 查看读过消息的用户

```
WebIM.conn.getGroupMsgReadUser({
    msgId,  // 消息id
    groupId // 群组id
}).then((res)=>{
    console.log(res)
})
```

**发送整个会话已读回执**

```
var msg = new WebIM.message('channel',conn.getUniqueId());
msg.set({
    to: 'username'
});

// 如果是群聊
msg.set({
    to: 'groupid'，
    chatType: 'groupChat'
});

conn.send(msg.body);
```