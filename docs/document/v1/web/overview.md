# SDK集成概述

## 初始化

### 创建连接

```
let conn = {};
WebIM.config = config;
conn = WebIM.conn = new WebIM.connection({
    appKey: WebIM.config.appkey,
    isHttpDNS: WebIM.config.isHttpDNS,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: WebIM.config.https,
    url: WebIM.config.socketServer,
    apiUrl: WebIM.config.restServer,
    isAutoLogin: WebIM.config.isAutoLogin,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    delivery: WebIM.config.delivery,
    useOwnUploadFun: WebIM.config.useOwnUploadFun
})
// WebIM.config 为之前集成里介绍的WebIMConfig.js
```

### 添加回调函数

```
conn.listen({
    onOpened: function () {},                  //连接成功回调 
    onClosed: function () {},                  //连接关闭回调
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
    onRecallMessage: function(message){},      //收到撤回消息回调
    onReceivedMessage: function(message){},    //收到消息送达服务器回执
    onDeliveredMessage: function(message){},   //收到消息送达客户端回执
    onReadMessage: function(message){},        //收到消息已读回执
    onCreateGroup: function(message){},        //创建群组成功回执（需调用createGroupNew）
    onMutedMessage: function(message){},       //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
    onChannelMessage: function(message){}      //收到整个会话已读的回执，在对方发送channel ack时会在这个回调里收到消息
});
```

## 注册

根据用户名/密码/昵称注册环信 Web IM :

```
var options = { 
    username: 'username',
    password: 'password',
    nickname: 'nickname',
    appKey: WebIM.config.appkey,
    success: function () { },  
    error: function (err) {
        let errorData = JSON.parse(err.data);
        if (errorData.error === 'duplicate_unique_property_exists') {
            console.log('用户已存在！');
        } else if (errorData.error === 'illegal_argument') {
            if (errorData.error_description === 'USERNAME_TOO_LONG') {
                console.log('用户名超过64个字节！')
            }else{
                console.log('用户名不合法！')
            }
        } else if (errorData.error === 'unauthorized') {
            console.log('注册失败，无权限！')
        } else if (errorData.error === 'resource_limited') {
            console.log('您的App用户注册数量已达上限,请升级至企业版！')
        }
    }, 
  }; 
  conn.registerUser(options);
```

## 登录

#### 用户名/密码登录

使用用户名/密码登录环信 Web IM :

```
var options = { 
  user: 'username',
  pwd: 'password',
  appKey: WebIM.config.appkey
};
conn.open(options);
```

#### 使用 Token 登录

1. 使用用户名/密码登录，获取 Token。

```
var options = {
    user: 'username',
    pwd: 'password',
    appKey: WebIM.config.appkey,
    success: function (res) {
      var token = res.access_token
    },
    error: function(){
    }
};
conn.open(options);
```

2. 使用 Token 登录环信 Web IM。

```
var options = {
    user: 'username',
    accessToken: 'token',
    appKey: WebIM.config.appkey
};
conn.open(options);
```

## 退出

```
conn.close();
```

## 上传推送 token

如果把 SDK 用在原生客户端，集成第三方推送功能，可以调用此方法将 token 上传到环信服务器

```
/**
 * @param {Object} options - 
 * @param {Object} options.deviceId - 设备 ID，可以自己定义，一般用来标识同一个设备
 * @param {Object} options.deviceToken - 推送 token
 * @param {Object} options.notifierName - 推送服务的 appId，对于 FCM 是 senderId，对于 VIVO 是 “appId+#+AppKey ”
 */
conn.uploadToken(options);
```

## 修改推送昵称

在注册时可以设置一个昵称，这个昵称用来在推送消息时显示，可以调用下面API修改昵称

```
conn.updateCurrentUserNick('newNick')
```

## 常见问题

Q: 是否支持 token 登录，是否支持 HTTPS？<br/>
A: 支持。

Q: 是否支持重连？<br/>
A: 支持。1.未使用 DNS：当前连接不能建立时会尝试重新连接，连接次数可在 config 里配置；2.使用 DNS：当前连接不能建立时，会根据 DNSconfig 的地址逐一尝试连接。

Q: ws 有上行没有下行？<br/>
A: 可能是浏览器缓存了错误的 ws 返回结果，解决办法是加个时间戳参数，强制浏览器不走缓存。

Q: 收到提示 “您的连接不是私密连接”，怎么处理？<br/>
<img src=@static/images/privitization/400webimintegration.jpeg  title=400webimintegration width="600"/><br/>
A: chrome53 屏蔽了赛门铁克的某些日期颁发的证书，升级 chrome 就可以解决。详细信息可查看：http://www.jkeabc.com/376605.html 或者 https://sslmate.com/blog/post/ct_redaction_in_chrome_53。