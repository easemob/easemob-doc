# 消息

消息是桌面端集成中最重要的功能之一，消息的使用方法主要为 ：

- 发送消息

- 接受消息

同时对于发送不超过2分钟的消息，允许主动撤回。

通过对消息的集成，您可以最快速的集成体验 IM 收发消息的流畅体验。

------

## 发送消息

发送消息类型主要有以下几种：

- 文本消息

- 文件消息

- 图片消息

- CMD 消息
- 自定义 消息

- 位置消息

通过这些操作，可以组合帮助您完成多种场景下的 IM 需求。

发送文本、文件、图片等消息（单聊/群聊通用）。完整的消息发送过程，包括创建消息体，创建消息，设置属性，设置回调，然后发送消息，不同的消息类型只是在创建消息体过程不同，其他步骤一样。

------

### 发送文本消息

```
/** 
 * 创建文本消息体
 * param1 文本消息正文，输入参数，String
 * return 消息体 EMTextMessageBody
 */
var textMsgBody = new easemob.EMTextMessageBody("wahhahahaha");
/** 
 * 创建消息
 * param1 发送者用户名，输入参数
 * param2 目的端，会话 ID，输入参数
 * param3 消息体 EMTextMessageBody
 * return 消息 EMMessage
 */
var textSendMsg = easemob.createSendMessage("jwfan", "jwfan1", textMsgBody);
// 消息可以设置扩展属性，用户界面可通过自定义属性，实现自定义等功能
textSendMsg.setAttribute("data", 120);
data = textSendMsg.getAttribute("data");
// 设置消息类型,0为单聊，1为群聊，2为聊天室
textSendMsg.setChatType(0);
// 设置回调
var emCallback = new easemob.EMCallback();
emCallback.onSuccess(() => {
    console.log("emCallback call back success");
    if(me.cfr){
        console.log(sendMessage);
        console.log(sendMessage.msgId());
        return true;
    });
    emCallback.onFail((error) => {
        console.log("emCallback call back fail");
        console.log(error.description);
        console.log(error.errorCode);
        return true;
    });
    emCallback.onProgress((progress) => {
        console.log(progress);
        console.log("call back progress");
    });
sendMessage.setCallback(emCallback);
// 发送消息
chatManager.sendMessage(textMsg);
```

------

### 发送文件

```
/** 
 * 创建文件消息体
 * param1 文件路径，输入参数，String
 * return 消息体 EMFileMessageBody
 */
var fileMsgBody = new easemob.EMFileMessageBody("/Users/jiangwei/Code/fanjiangwei7/emclient-linux/testapp/file.txt");
// 创建消息
var fileMsg = easemob.createSendMessage("jwfan", "jwfan1", fileMsgBody);
//setCallback(callback) 设置消息回调函数，通过回调函数显示消息发送成功失败，以及附件上传百分比
//callback easemob.EMCallback的实例，设置onSuccess、onFail和onProgress三个回调函数。
fileMsg.setCallback(emCallback);
chatManager.sendMessage(fileMsg);
```

------

### 发送图片

```
/** 
 * 创建图片消息体
 * param1 图片文件路径，输入参数，String
 * param2 图片缩略图路径，输入参数
 * return 消息体EMFileMessageBody
 */
var imageMsgBody = new easemob.EMImageMessageBody('/Users/jiangwei/Code/fanjiangwei7/emclient-linux/testapp/image_960x718.jpg', '/Users/jiangwei/Code/fanjiangwei7/emclient-linux/testapp/thumb_image.jpg');
var imageMsg = easemob.createSendMessage("jwfan", "jwfan1", imageMsgBody);
imageMsg.setCallback(emCallback);
chatManager.sendMessage(imageMsg);
```

------

### 发送 CMD 消息

```
var cmdMsgBody = new easemob.EMCmdMessageBody("action");
console.log("cmdMsgBody.type() = " + cmdMsgBody.type());

console.log("cmdMsgBody.action() = " + cmdMsgBody.action());
cmdMsgBody.setAction("displayName");
console.log("cmdMsgBody.action() = " + cmdMsgBody.action());

var obj1 = {"key" : "1", "value" : "1"};
var obj2 = {"key" : "2", "value" : "2"};
console.log("cmdMsgBody.params() = " + cmdMsgBody.params());
cmdMsgBody.setParams([obj1, obj2]);
var cmdMsg = easemob.createSendMessage("jwfan", "jwfan1", cmdMsgBody);
chatManager.sendMessage(cmdMsg);
```

------

### 发送 自定义 消息

自定义消息包括消息event和消息扩展exts，构造及发送过程如下

```
let customMsgBody = new easemob.EMCustomMessageBody("userCard");
customMsgBody.setExts({'avatar':'https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image5.png','nickname':'xiaoming','uid':'uid'});
let customMsg = easemob.createSendMessage('lxm9','lxm',customMsgBody);
chatManager.sendMessage(customMsg);
```

------

### 位置消息

```
/** 
 * 创建位置消息体
 * param1 位置经度，输入参数，String
 * param2 位置纬度，输入参数
 * param3 地址，输入参数
 * return 消息体EMFileMessageBody
 */
var locationMsgBody = new easemob.EMLocationMessageBody(123.45, 35.67, 'USA');
console.log("locationMsgBody.type() = " + locationMsgBody.type());
console.log("locationMsgBody.latitude() = " + locationMsgBody.latitude());
console.log("locationMsgBody.longitude() = " + locationMsgBody.longitude());
console.log("locationMsgBody.address() = " + locationMsgBody.address());
locationMsgBody.setLatitude(87.87);
locationMsgBody.setLongitude(45.45);
locationMsgBody.setAddress('china');
var locationMsg = easemob.createSendMessage("jwfan", "jwfan1", locationMsgBody);
chatManager.sendMessage(locationMsg);
```

------

## 撤回消息

默认发送两分钟内的消息可以撤回，撤回使用recallMessage接口

```
/** 
 * 撤回消息
 * param msg {EMMessage} 要撤回的消息
 */
chatManager.recallMessage(msg);
```

------

## 接收消息

接收消息在会话管理中通过设置回调函数实现，在回调函数中处理

```
// 实例化监听回调，并添加到client
chatManager = emclient.getChatManager();
listener = new easemob.EMChatManagerListener();
chatManager.addListener(listener);

// 收到会话消息
listener.onReceiveMessages((messages) => {
    console.log("onReceiveMessages messages.length = " + messages.length);
    for (var index = 0, len = messages.length; index < len; index++) {
    var msg = messages[index];
    var bodies = msg.bodies();
    console.log("bodies.length = " + bodies.length);
    var body = bodies[0];
    var type = body.type();
    console.log("msg.from() = " + msg.from());
    console.log("msg.to() = " + msg.to());
    console.log("body.type() = " + type);
    if (type == 0) {    //text message
      console.log("body.text() = " + body.text());
    } else if (type == 1) {     //image message
      console.log("body.displayName() = " + body.displayName());
      console.log("body.localPath() = " + body.localPath());
      chatManager.downloadMessageAttachments(msg);
      chatManager.downloadMessageThumbnail(msg);
    } else if (type == 5) {     //file message
      console.log("body.displayName() = " + body.displayName());
      console.log("body.localPath() = " + body.localPath());
      chatManager.downloadMessageAttachments(msg);
    }
});
// 收到命令消息
listener.onReceiveCmdMessages ((messages) => {
  for (var index = 0, len = messages.length; index < len; index++) {
  var msg = messages[index];
  var bodies = msg.bodies();
  console.log("bodies.length = " + bodies.length);
  var body = bodies[0];
  var type = body.type();
  console.log("msg.from() = " + msg.from());
  console.log("msg.to() = " + msg.to());
  console.log("msg.type() = " + type);
  console.log("body.action() = " + body.action());
  var params = cmdMsgBody.params()
  console.log("cmdMsgBody.params().length = " + params.length);
  if (params.length > 0) {
    console.log("cmdMsgBody.params()[0] = " + JSON.stringify(params[0]));
  }
}
});

// 收到消息撤回
listener.onReceiveRecallMessages ((message) => {
  console.log("onReceiveRecallMessages messages.length = " + messages.length);
  for (var index = 0, len = messages.length; index < len; index++) {
  var message = messages[index];
  console.log("message.msgId() = " + message.msgId());
  console.log("message.from() = " + message.from());
  console.log("message.to() = " + message.to());
} 
});
// addListener(listener) 添加消息回调监听，从监听中获取接收消息。
```