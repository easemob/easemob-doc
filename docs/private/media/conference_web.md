# Web集成多人通话

## 跑通Demo

### 1. 示例代码

- [下载视频会议Demo代码 ](https://github.com/easemob/videocall-web)
- [体验Demo](https://zim-rtc.easemob.com:12007/) 

或进入环信[客户端下载](common_clientsdk.html#场景demo及源码下载)页面，选择下载Web端视频会议 Demo。

### 2. 前提条件

- 安装一款 Easemob Web SDK [支持的浏览器](common_introduction.html#兼容性说明)
- 本地安装 node 环境 >= 6.3.0
- 必须为https+webkit内核浏览器

### 3. 运行 Demo

1. 下载Demo
2. 进入 videocall-web 文件夹
3. 安装依赖包

```
npm install
```

4. 启动项目

```
HTTPS=true npm start
```

## 快速集成

### 1. 环信后台注册 appkey

在开始集成前，你需要注册环信开发者账号并在后台创建应用，参见[创建应用](../im/uc_configure.html#创建应用) 。

### 2. 创建项目

```
a.可以简单的写一个 html，引入 SDK 测试 
b.或者使用 脚手架搭建一个项目
```

### 3. 引入 SDK

#### 3.1 通过 scrpit 标签的 src 引入

[获取静态SDK 文件](#_3-4-获取sdk静态资源文件)

```
<script src="EMedia_sdk-dev.js"></script>
```

#### 3.2 使用 npm 获取 SDK

```
npm install easemob-emedia
```

#### 3.3 在文件内引入 SDK

```
import emedia from 'easemob-emedia';
```

#### 3.4 获取SDK静态资源文件

1. 首先 [下载 WebIM Demo 包](common_clientsdk.html#音视频sdk下载)<br>
![img](/images/privitization/wechatimg_download.png)
2. 从Demo 中选取 SDK 文件**EMedia_sdk-dev.js**<br>
![img](/images/privitization/wechatimg_path.png)


### 4. 初始化SDK

```
emedia.config({
   appkey, // 从环信后台 获取的appkey、必填
   consoleLogger: true, // boolean 是否开启打印日志，默认true
   ... 其他的一些配置
});
```

### 5. 环信ID注册、登录

在进行音视频通话前，需要首先登录IM账户，登录过程参见[账号登录](http://doc.easemob.com/document/web/overview.html#%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95)。<br>
若您还没有IM账户，需要先注册账户，注册过程参见[账号注册](http://doc.easemob.com/document/web/overview.html#%E6%B3%A8%E5%86%8C%E7%94%A8%E6%88%B7)。<br>

### 6. 进入会议

:::notice
加入会议之前必须先要调用 emedia.mgr.setIdentity 方法设置 emedia 对象的memName 、token。
:::
```
emedia.mgr.setIdentity(memName, token); //memName:appkey +'_'+ 环信ID, token: 环信ID登录后返回的access_token
```

**params** 为进入会议需要的参数

```
var params = {
    roomName, // string 房间名称 必需
    password, // string 房间密码 必需
    role  // number 进入会议的角色 1: 观众  3:主播 必需
    config:{
            rec:false, //是否开启录制会议
            recMerge:false, //是否开启合并录制
            supportWechatMiniProgram: true //是否允许小程序加入会议
        }
}
```

调用 **emedia.mgr.joinRoom** 进入会议，若该会议不存在，服务器将会自动创建。

```
const user_room = await emedia.mgr.joinRoom(params);
```

返回的参数 **user_room** ，组成如下：

```
user_room: {
       confrId: "IM3U9Z0AHDYQTF8KNDAAD00C147" 会议ID
       id: "IM3U9Z0AHDYQTF8KNDAAD00C147"
       joinId: "IM3U9Z0AHDYQTF8KNDAAD00C147M2" 在会议中的唯一ID
       role: 1|3|7 //角色 1观众 3主播 7管理员
       roleToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlYXNlbW9iLWRlbW8j..."
       ticket: "{\"tktId\":\"IM3U9Z0AHDYQTF8KNDAAD00C147TK1\",..."
       type: 10 //会议类型
}
```

### 7. 发布本地流

加入会议之后 调用 **emedia.publish** 发布流。

```
var constaints = { // 发布音频流的配置参数, Object 必需。 video或audio属性 至少存在一个
    audio: true, // 是否发布音频
    video: true  // 是否发布视频
}
var ext = {} // 发布流的扩展信息 Object 非必需。会议其他成员可接收到

const pushedStream = await emedia.mgr.publish(constaints, ext);
```

发布本地流成功后， 调用 emedia.mgr.streamBindVideo 用于在video标签显示流。

```
var videoTag = document.getElementById('#xxx') //需要显示本地流的 video 标签
emedia.mgr.streamBindVideo(pushedStream, videoTag);
```

### 8. 订阅远端流

当远端流加入频道时，会触发 emedia.mgr.onStreamAdded 方法，我们需要给 emedia.mgr 赋值 onStreamAdded 用来接收 stream

**我们建议项目初始化后，立即设置[常用监听函数](#_10-会议常用监听函数)**

#### 8.1 监听 onStreamAdded 方法
场景：当有远端流加入时。

:::notice
自己发布的本地流也会触发 onStreamAdded 方法，
stream.located() == true 为自己发的本地流，
也可以在这里绑定 video标签，显示本地流。
:::

```
emedia.mgr.onStreamAdded = function(member, stream) {
    // member：发布流人员的信息、stream：流信息
    if(!stream.located()) {
         var option = {
             member: member, 
             stream: stream, 
             subVideo: true,
             subAudio: true,
             videoTag: document.getElementById('#xxx')
         }
         emedia.mgr.subscribe(option.member, option.stream, option.subVideo, option.subAudio, option.videoTag)    
    }
}
```

在emedia.mgr.subscribe 方法中注意以下参数的设置：

- option.member：发布流人员的信息，必需。也就是 onStreamAdded 方法的 member
- option.stream：流信息，必需。也就是 onStreamAdded 方法的 stream
- option.subVideo: 是否订阅视频，必需
- option.subAudio: 是否订阅音频，必需
- option.videotag: 需要显示流的 video 标签，必需

#### 8.2 监听 onStreamRemoved 方法
场景：当远端流被移除时（例如远端用户调用了 Stream.unpublish）， 停止订阅该流并移除它的画面。

```
emedia.mgr.onStreamRemoved = function(member, stream) {
    // member：发布流人员的信息、stream：流信息
    emedia.mgr.unsubscribe(stream) // 停止订阅流
    removeView(stream.id) // 移除video标签，removeView方法需自己实现
}
```

### 9. 退出会议

调用 emedia.mgr.exitConference 方法退出会议。

```
emedia.mgr.exitConference() //无参数
```

### 10. 会议常用监听函数
:::tip
`强烈建议：` 在加入会议之前定义需要的 SDK 回调函数
:::
```
//有人加入会议
emedia.mgr.onMemberJoined = function (member) { } // member: 加入会议成员信息
    
//有人退出会议
emedia.mgr.onMemberExited = function (member) {} // member: 退出会议成员信息
 
//有媒体流添加 （自己发布的流也会触发 stream.located() == true ）
emedia.mgr.onStreamAdded = function (member, stream) { }; // member: 发布流的成员信息，stream：流信息

//有媒体流移除
emedia.mgr.onStreamRemoved = function (member, stream) { } // member: 移除流的成员信息，stream：流信息

//自己角色变更
emedia.mgr.onRoleChanged = role => {} // role: 变更后的角色

//会议退出；自己主动退 或 服务端主动关闭；
emedia.mgr.onConferenceExit = function (reason, failed) {
    reason = (reason || 0);
    switch (reason){
        case 0:
            reason = "正常挂断";
            break;
        case 1:
            reason = "没响应";
            break;
        case 2:
            reason = "服务器拒绝";
            break;
        case 3:
            reason = "对方忙";
            break;
        case 4:
            reason = "失败,可能是网络或服务器拒绝";
            if(failed === -9527){
                reason = "失败,网络原因";
            }
            if(failed === -500){
                reason = "Ticket失效";
            }
            if(failed === -502){
                reason = "Ticket过期";
            }
            if(failed === -504){
                reason = "链接已失效";
            }
            if(failed === -508){
                reason = "会议无效";
            }
            if(failed === -510){
                reason = "服务端限制";
            }
            break;
        case 5:
            reason = "不支持";
            break;
        case 10:
            reason = "其他设备登录";
            break;
        case 11:
            reason = "会议关闭";
            break;
    }
};
//管理员变更
emedia.mgr.onAdminChanged = admin => {} //admin 管理员信息

//监听弱网状态
emedia.mgr.onNetworkWeak = streamId => {} //streamId 会议中的流 ID

//监听断网状态
emedia.mgr.onNetworkDisconnect = streamId => {} //streamId 会议中的流 ID
```

## 进阶功能

### 会议管理

#### **1. 创建会议并加入**

这里的创建会议 不同于快速集成中的加入会议，这里的是属于另一套逻辑，建议使用快速集成中的加入会议

:::notice
如果只单纯的创建，没进行操作，则创建者不是会议的成员，没有相应的角色，不能进行其他操作。
:::
##### **1.1 调用 emedia.mgr.createConference 方法创建会议**

```
let params = {
     confrType, 
     password, 
     rec, 
     recMerge, 
     supportWechatMiniProgram
     ... 其他参数
}

const confr = await emedia.mgr.createConference(params);
```

在 emedia.mgr.createConference 方法中，注意以下参数的设置：

- confrType 会议类型 10:普通会议模式、11:大会议模式、12:直播模式。number 必需
- password 会议密码 string 必需
- rec 是否开启通话录制 boolean 非必需
- recMerge 是否开启通话录制合并 boolean 非必需
- supportWechatMiniProgram 会议是否支持小程序端 boolean 非必需， 默认不支持

创建会议成功后，返回的参数 confr 结构如下：

```
confr：{
    error: 0,
    confrId: "LBJ13H9WJJEVJTGL1U1PIQ00C2", // 会议id
    password: "xxxx", // 创建会议时设置的密码
    role: 7, // 在会议中的角色 这里因为是创建者，所以是 7: 管理员
    roleToken:"eyJ0eXAiOiJKV1QiLCJhbG *** f1gg_QJWxhs-jqmuFok", //创建者的token
    type: 10 // 会议类型
}
```

##### **1.2 调用 emedia.mgr.joinUsePassword 方法加入会议**

```
const join_result = await this.emedia.joinUsePassword(confrId, password) // 参数为 创建会议成功后返回的 confrId和password
```

加入会议成功后返回的结果，结构如下：

```
join_result: {
     confrId: "LBJ13H9WJJEVJTGL1U1PIQ00C7", // 会议id
     joinId: "LBJ13H9WJJEVJTGL1U1PIQ00C7M9", //创建会议时设置的密码
     password: "0.010568535799199363", // 会议成员在会议中的身份id（唯一）
     role, // 在会议中的角色 创建者加入会议永远是 7: 管理员，其他人加入返回的是 3: 主播
     roleToken: "eyJ0eXAiOiJK *** FaXuMVlqPOTofRRdE", // 加入会议者的token
     type: 10 // 会议类型
  }
```

#### **2. 开启录制、录制合并**

##### **2.1 调用 emedia.mgr.createConference 创建会议时配置**

```
let params = {
     ...
     rec: true,
     recMerge: true,
     ... 其他参数
}

const confr = await emedia.mgr.createConference(params);
```

##### **2.2 调用 emedia.mgr.joinRoom 加入会议时配置**
:::notice
只有第一个加入会议的人，配置的才有效，参数需要放到 config 对象中。
:::
```
let params = {
     ... 其他参数
     config: {
         rec: true,
         recMerge: true
     }
}

const confr = await emedia.mgr.createConference(params);
```

- rec: 是否开启录制，默认 false
- recMerge: 是否开启录制合并，默认false

#### **3. 邀请成员加入会议**

```
SDK 不提供邀请接口。邀请的形式，完全可以由用户自行定义，可以是条文本消息，也可以是个控制消息等等。SDK 不做限制。实现方式可以参考官方 demo，通过群组消息邀请，具体代码 可查询 demo/src/components/webrtc/AddAVMemberModal.js 中的 70-89 行。
```

##### **3.1 成员收到邀请加入会议**

解析出邀请消息中带的 confrId 和 password ，调用 **emedia.mgr.joinUsePassword** 加入会议

#### **4. 管理员销毁会议**

调用 emedia.mgr.destroyConference 方法， **注意：只有管理员有权限，其他角色调用不生效**

```
await emedia.mgr.destroyConference(confrId); //confrId: 会议Id
```

其他人会收到会议结束的回调。

```
emedia.mgr.onConferenceExit = reason => {} // reason：退出会议的原因，因为会议被销毁了，所以这里应为 11: "会议关闭"
```

#### **5. 设置会议人数限制**

##### **5.1 在 emedia.mgr.joinRoom 方法中设置**
只有第一个加入房间的人员（也就是管理员），设置的才能生效

```
var params = {
    ... 其他参数，
    config:{ // 在 config 中指定字段 
      maxTalkerCount：3,
      maxAudienceCount：100,
      maxVideoCount：2,
      maxPubDesktopCount: 1
   }
}

const user_room = await emedia.mgr.joinRoom(params);
```

##### **5.2 在 emedia.mgr.createConference(创建会议) 方法中设置**

```
var params = {
    ... 其他参数，   
    maxTalkerCount：3
    maxVideoCount：2
    maxAudienceCount：100
    maxPubDesktopCount: 1

}
const confr = await emedia.mgr.createConference(params);
```

以上设置会议参数的注意事项如下：

- maxTalkerCount：自定义会议最大主播人数，默认 100
- maxAudienceCount：自定义会议最大观众数 默认 600
- maxVideoCount：自定义会议最大视频数， 默认 9
- maxPubDesktopCount: 自定义会议共享屏幕最大数 默认 2

#### **6. 设置会议昵称**

在 emedia.mgr.joinRoom 方法中设置

```
var params = {
    ... 其他参数,
    config:{ 
      ... 其他参数，
      nickName: xxx, // string
   }
}
const user_room = await emedia.mgr.joinRoom(params);
```

#### **7. 获取会议信息**

调用 **emedia.mgr.selectConfr** 方法获取会议信息

```
const confr_info = await emedia.mgr.selectConfr(confrId, password); // confrId:会议id、password:会议密码
// 返回的参数 confr_info 结构如下：
confr_info: {
    confr: {
        id: "LBJ13H05522QATGIJKXUF800C45639", // 会议id
        type: 10, // 会议类型
        memTotal: 1, // 会议中总人数 主播和观众
        audienceTotal: 0, // 观众人数
        talkers: ["018ae39 *** 663282d7495"] // 主播的memName集合
    }
    error: 0
}
```

#### **8. CDN合流推流**

CDN推流是指将会议画面，合并到一张画布推送到远程CDN，其他人可以从CDN拉流而不用加入会议。

##### **8.1 开启CDN推流**

CDN推流参数 **liveCfg为必需** 结构如下：

```
let liveCfg = {
    cdn:'', //推流地址、字符串；必需 
    layoutStyle: 'GRID' | 'CUSTOM', // 格子显示 | 自定义，必需
    canvas :{// canvas 参数在 layoutStyle == 'CUSTOM' 必填
           bgclr : 0x980000,//背景色 980000 为 十六进制色值
           w : 640, //宽度
           h : 480, //高度
           fps: 20, //输出帧率
           bps: 1200000,  //输出码率
           codec: "H264" //视频编码，现在必须是H264
    }
}
```

**1.创建会议时指定 CDN推流**

```
let option = {
    ...
    liveCfg // 创建CDN推流参数 
}
emedia.mgr.createConference(option)
```

**2.加入房间时 指定CDN推流**

```
// 只有第一个加入房间的人才能创建 CDN、以后加入的人指定CDN也无效
let params = {
       config:{ 
          ...
          liveCfg // 创建CDN推流参数
       }
}
emedia.mgr.joinRoom(params);
```

##### **8.2 多路推流**

通过 **emedia.mgr.addLive** 方法指定一路推流CDN，需要几路CDN，就调用几次方法
**注意：只有管理员，可创建 CDN**

```
// confrId: 会议id, 必需
// liveCfg: cdn 配置，必需
media.mgr.addLive(confrId, liveCfg);
```

##### **8.3 更新CDN布局**

```
// 只有管理员才能 更新布局。更新布局会 将layoutStyle 变为 CUSTOM 而且不可逆
emedia.mgr.updateLiveLayout(confrId, liveId, regions)

// confrId 会议id 必需
// liveId 推流CDN id, 必需 可通过 emedia.config.liveCfgs 获取 Array 

regions:[ // 希望定义视频流 显示的配置集合
    {
       "sid": stream_id,//视频流的id
       "x": 320,//距离 x 轴的距离 Number
       "y": 240,//距离 y 轴的距离 Number
       "w": 960,//宽度 Number
       "h": 720,//高度 Number
       "style": "fill" | "AspectFit" //视频显示模式 fill:铺满、AspectFit:原比例显示
    },        
    .... 其他视频流配置（数组有几个项，就显示几个视频流）
]
```

##### **8.4 删除CDN**

```
// 只有管理员可操作
//confrId 会议id 必需
// liveId 推流CDN id, 必需 可通过 emedia.config.liveCfgs 获取 Array 
emedia.mgr.deleteLive(confrId, liveId) 
```


#### **9. 取日志**

在浏览器控制台，输入 **emedia.fileReport** ,敲下回车键会下载下一份日志文件

```
emedia.fileReport() //无参数
```

#### **10. 会议属性**

```
// 用来自定义一些属性，广播给会议中的成员
    // 有人设置会议属性，所有的成员都能收到
  let options = {
            key:username,
            val:'request_tobe_speaker'
        }
      // a. 设置会议属性 
  emedia.mgr.setConferenceAttrs(options)
      // b. 删除会议属性 
  emedia.mgr.deleteConferenceAttrs(options)
      // c. 会议属性变更回调 
  emedia.mgr.onConfrAttrsUpdated = attrs => {} //attrs 会议属性集合 Array
```

#### **11. 私有部署**

私有部署设置方法参见[私有云sdk集成配置](../im/uc_Web_private.md)。

### 音视频管理

#### **1. 设置通话参数**

发布本地媒体流时，可指定音视频的码率和分辨率非必需。 **共享桌面不可指定**

```
var constaints = {
     audio: {bitrate: 100},// 指定音频码率
     video: {
        width: { // 指定视频分辨率宽度
             exact: 1280
        },
        height: { // 指定视频分辨率高度
             exact: 720
        },
        bitrate: 200,// 指定视频码率
     }
}
emedia.mgr.publish(constaints)
```

#### **2. 指定设备打开音视频**

```
const devices = await emedia.mgr.mediaDevices(); //获取设备列表

    // 设备信息
    device: Object { 
        deviceId: "529a6fe76467d****9498ab22f5f362cd" // 设备ID
        groupId: "2b74c9b9ab99*****d513fbabc1e86b3c5d99f7f8a0c16"
        kind: "audioinput" | audiooutput | videoinput | videooutput // 设备类型
        label: "Internal Microphone (Built-in)"
    }
    constraints： { // 选择设备， 然后指定设备（只需要传入设备信息中的deviceId属性，为String类型，其他的属性在推流时暂时用不到）
        audio: {deviceId: deviceId ? {exact: deviceId} : undefined}, //判断如果deviceId存在那么就传入对象。
        video: {deviceId: deviceId ? {exact: deviceId} : undefined}
    },
    
const stream = await emedia.mgr.publish(constraints) // 推流
```

#### **3. 停止发布流**

调用 **emedia.mgr.unpublish** 方法停止自己已经发布的流。

```
emedia.mgr.unpublish(pushedStream); // pushedStream：自己发布的流
```

会议中人员（包括自己）会收到 流被移除的回调函数 **emedia.mgr.onStreamRemoved**。

```
emedia.mgr.onStreamRemoved = function (member, stream) {
   // member: 停止发布流人员信息
   // stream：流的信息，stream.located() == true 代表是自己的流，false则为其他人的流
};
```

#### **4. 停止订阅流**

调用 **emedia.mgr.unsubscribe** 方法停止订阅别人的流。

```
emedia.mgr.unsubscribe(stream); // stream：已经订阅的流
```

#### **5. 通话过程中音视频控制**

##### **5.1 打开/关闭自己的视频**

```
const res_stream = await emedia.mgr.pauseVideo(own_stream) //关闭视频
const res_stream = await emedia.mgr.resumeVideo(own_stream) //开启视频 
```

##### **5.2 打开/关闭自己的音频**

```
const res_stream = await emedia.mgr.pauseAudio(own_stream) // 关闭音频
const res_stream = await emedia.mgr.resumeAudio(own_stream) // 开启音频
执行开启/关闭音视频方法时，
* own_stream：自己已经发布的媒体流（不能是桌面流）
* res_stream：设置音视频成功后返回的流对象
```

**执行上述操作后，会议中其他人员会收到流变化的回调 emedia.mgr.onMediaChanaged**<br>
emedia.mgr.onMediaChanaged 应该在流变化之前监听。

```
var videoTag = document.getElementById('#xxx') // 获取 video 标签
emedia.mgr.onMediaChanaged(videoTag, function(constaints, stream) {
     
});
// 回调函数中 constaints、stream
constaints: {
    audio: true // true: 开启了音频，false：关闭了音频
    video: true // true: 开启了视频，false：关闭了视频
}
stream：媒体流变化后的 stream 对象
```

##### **5.3 切换摄像头**

```
// 随机切换摄像头
emedia.mgr.changeCamera(confrId).then(function(){
      // 无参数
}).catch(function(){

})
// 切换手机前后摄像头
emedia.mgr.switchMobileCamera(confrId).then(function(){
     // 无参数
}).catch(function(){

})
```

#### **6. 音视频网络状态监听**

:::tip
建议进入会议之前绑定网络状态监听函数
:::
```
//监听弱网状态
emedia.mgr.onNetworkWeak = streamId => {} //streamId 会议中的流 ID

//监听断网状态
emedia.mgr.onNetworkDisconnect = streamId => {} //streamId 会议中的流 ID
```

#### 7. 监听谁在说话

这是监听的video标签。
:::tip
建议：在将video标签与stream绑定时（emedia.mgr.streamBindVideo)， 调用 emedia.mgr.onSoundChanaged 方法。
:::
```
var videoTag = getElementById('#xxx');
emedia.mgr.onSoundChanaged(videoTag,, function (meterData) {});

// 返回的参数 meterData 结构如下：
meterData: {
    instant: 0.26280892641627845 // instant 大约每50毫秒变化一次， 小于1的浮点数
    slow: 0.06802768487276245 // slow大约是一秒钟内的平均音量，小于1的浮点数
    clip: 0
}
```

#### **8. 共享桌面**

仅支持PC Chrome浏览器或electron平台。<br>

**>>SDK 3.2.1 版本 文档**
##### **8.1 无插件共享**

需要 SDK 3.2.1 版本开始支持，并且 Chrome 72 或以上版本。

```
const screenStream = await emedia.mgr.shareDesktopWithAudio({
    confrId: confrId, // 会议ID， 必须
    audio: false, 
});
```

##### **8.2 有插件共享**

```
//在 sdk 内部会自动判断，浏览器是否含有 navigator.mediaDevices.getDisplayMedia API，
//如果没有，将会跳转至 使用 插件的 API，如果没有安装插件将给出提示
```

##### **8.3 分享音频**

```
//1. 版本起支持在 Windows 平台的 Chrome 浏览器 74 及以上版本同时共享屏幕和本地播放的背景音，
//2. 将 audio 设置为 true 即可
```

##### **8.4 Electron 屏幕共享**

```
//1. sdk 内部会判断是否是在 electron 平台内
//2. electron 平台 会默认选择 第一个屏幕
//3. 如果需要自定义选择框，请重新定义  emedia.chooseElectronDesktopMedia 方法
emedia.chooseElectronDesktopMedia = function(sources, accessApproved, accessDenied){
       sources // Array 获取到的屏幕列表         
       accessApproved（source）// 选中的 source 对象，进行分享
       accessDenied（）// 取消分享，关闭自定义框需要调用此方法
}
```

##### **8.5 停止共享桌面**

```
停止共享桌面，执行 取消流的发布 emedia.mgr.unpublish(screenStream)
```

**>>SDK 3.2.1 之前版本 文档**

```
/**
 * let params = { 
 *       videoConstaints, 
 *       withAudio, 
 *       videoTag, 
 *       ext, 
 *       confrId,
 *       stopSharedCallback
 *  }
 */

/**
 * videoConstaints {screenOptions: ['screen', 'window', 'tab']} or true
 * withAudio： true 携带语音，false不携带  如携带语音，需自己调用关闭流，不会执行 stopSharedCallback 回调
 * ext 用户自定义扩展，其他成员可以看到这个字段
 * stopSharedCallback 共享插件 点击【停止共享】的回调函数，做相应的处理（比如删除流...）
 */
emedia.mgr.shareDesktopWithAudio(params).then(function(pushedStream){
    //stream 对象
}).catch(function(error){

});

//electron平台 默认选择第一个屏幕，如果需要选择其他，需要重写方法
emedia.chooseElectronDesktopMedia = function(sources, accessApproved){
    var firstSources = sources[0];
    accessApproved(firstSources);
}
```

**注意：** 在chrome浏览器中使用时，需要从[chrome store](https://chrome.google.com/webstore/detail/rtc-share-desktop/ccahbcjalpomijfpjemdgpnbogofnlgl) 或者从[环信服务器](https://download-sdk.oss-cn-beijing.aliyuncs.com/rtc_desktop_share.zip) 中下载插件，解压后在chrome浏览器中输入 chrome://extensions/，选择“Load unpacked” 选择解压后的文件夹中的1.0_0文件夹，加载插件。

### 角色管理

可通过 emedia.mgr.Role 获取会议中的角色类型。

```
emedia.mgr.Role: {
    ADMIN: 7, // 会议管理员: 能创建会议，销毁会议，移除会议成员，切换其他成员的角色
    TALKER: 3, // 主播: 能上传自己的音视频，能观看收听其他主播的音视频，即能发布流和订阅流）
    AUDIENCE: 1 // 观众: 只能观看收听音视频，即只能订阅流
};
// 可在会议中定义更加语义化的判断：
if(member.role == emedia.mgr.Role.ADMIN){ }
等同于
if(member.role == 7){ }
在以下申请主播和申请管理员的过程，请注意：
1.从发起申请到管理员回复（同意或拒绝）,是一个完整的过程
2.因此可以认为：当管理员收到请求，会收到两个函数参数（同意和拒绝），用于管理员调用
3.当管理员处理了请求（同意或拒绝），申请者会收到处理结果（同意或拒绝），未处理则不会收到
```

**以下方法非回调函数均为异步函数**

```
try {
    await emedia.mgr.xxx;
  } catch(error) { }
     
// 以下出现的参数注解
  confrId: 会议id
  memberId: 与会人员的id，member 中的id
  nickName: 昵称
```

#### **1. 观众申请成为主播**

观众通过调用 **emedia.mgr.requestToTalker** 方法申请主播。

```
// 观众上麦申请方法
emedia.mgr.requestToTalker(confrId) 

// 管理员收到上麦申请的回调 （主播不会收到这个回调）
emedia.mgr.onRequestToTalker = function(applicat, agreeCallback, refuseCallback) {
   /*
    * applicat { memberId, nickName } object 申请者信息
    * agreeCallback 管理员同意的回调 示例：agreeCallback(memberId) memberId 申请者 id 必需
    * refuseCallback 管理员拒绝的回调 示例：refuseCallback(memberId) memberId 申请者 id必需
   */
}
   
// 观众收到 上麦申请的回复 
emedia.mgr.onRequestToTalkerReply = function(result) {
   // result 0: 同意 1: 拒绝
} 
```

#### **2. 主播申请成为管理员**

```
// 主播申请管理员
emedia.mgr.requestToAdmin(confrId);
 
//管理员收到申请管理员的回调 （主播不会收到这个回调）
emedia.mgr.onRequestToAdmin = function(applicat, agreeCallback, refuseCallback) {
   /*
    * applicat { memberId, nickName } object 申请者信息
    * agreeCallback 管理员同意的回调 示例：agreeCallback(memberId) memberId 申请者 id 必需
    * refuseCallback 管理员拒绝的回调 示例：refuseCallback(memberId) memberId 申请者 id必需
   */
}

// 主播收到 申请管理员的回复 
emedia.mgr.onRequestToAdminReply = function(result) {
   // result 0: 同意 1: 拒绝
}
```

#### **3. 授权**

**只有管理员有权限授权**
调用方法改变与会人员的角色（可升可降）。

```
var option = {
    confr:, //会议对象 Object 必需
    memberNames: // 被授权人员的memberName集合（可同时给多人授权）Array
    role: // 需要授权成什么角色 Number 必需
}
emedia.mgr.grantRole(option.confr, option.memberNames, option.role)
```

#### **4. 角色降级**

:::notice
注意：只能角色降级 从管理员到主播、从主播到观众、从管理员到观众，不可逆向操作
:::
与会成员调用 **emedia.mgr.degradeRole** 方法就会角色降级。

```
//[memName] 与会人员的memName、 toRole 想要 达到的角色
emedia.mgr.degradeRole(confrId, [memName], toRole); 
```

#### **5. 管理员踢人**

:::notice
只有管理员可踢人
:::
```
// confr: 会议对象，必需 Object
// memberNames: 被踢掉人员的 memberName, 必需 Array 
emedia.mgr.kickMembersById(confr, memberNames)
```

#### **6. 管理员执行全体静音/取消全体静音**

:::notice
只有管理员可操作，其他角色操作不生效，管理员不会被静音
:::

##### **6.1 管理员静音全体**

```
await emedia.mgr.muteAll(confrId); // confrId: 会议Id

// 主播收到回调 
emedia.mgr.onMuteAll = () => {
    // 在收到回调后，需要在程序中执行关闭麦克风的逻辑(emedia.mgr.pauseAudio(own_stream))
}
```

##### **6.2 取消全体静音**

```
await emedia.mgr.unmuteAll(confrId); // confrId: 会议Id

//主播收到回调 
emedia.mgr.onUnMuteAll = () => {
     // 在收到回调后，需要在程序中执行关闭麦克风的逻辑(emedia.mgr.resumeAudio(own_stream))
}
```

#### **7. 管理员指定成员静音/取消指定成员静音**

:::notice
只有管理员可操作，其他角色操作不生效
:::

##### **7.1 管理员指定成员静音**

```
emedia.mgr.muteBymemberId(confrId, memberId);// memberId 被静音主播的memberId

// 单个主播被管理员静音的回调（只他自己收到回调）
emedia.mgr.onMuted = () => {
     // 在收到回调后，需要在程序中执行关闭麦克风的逻辑(emedia.mgr.pauseAudio(own_stream))
}
```

##### **7.2 管理员取消指定成员静音**

```
emedia.mgr.unmuteBymemberId(confrId, memberId);// memberId 被取消静音主播的memberId

// 单个主播被管理员取消静音的回调 （只他自己收到回调）
emedia.mgr.onUnmuted = () => { 
     // 在收到回调后，需要在程序中执行关闭麦克风的逻辑(emedia.mgr.resumeAudio(own_stream))
}
```

#### **8. 本身角色变更回调**

如果想要变更自己的角色，需要向管理员申请，管理员同意后，角色就会变更
```
emedia.mgr.onRoleChanged = function (role) {
     // role: 变更后的角色
};
```

#### 9. 管理员变更回调

当会议中的管理员变更时，与会人员都会收到这个回调

```
emedia.mgr.onAdminChanged = admin => {} //admin 管理员信息
```

### 其他接口

#### **抓取 video图像，并保存**

```
emedia.mgr.captureVideo(videoTag, true, filename)
等价于
emedia.mgr.triggerCaptureVideo(videoTag, true, filename);
```

#### **控制远程视频(手机端)定格**

```
emedia.mgr.freezeFrameRemote(stream);
等价于
emedia.mgr.triggerFreezeFrameRemote(videoTag).catch(function(){
    alert("定格失败");
});
```

#### **控制手机闪光灯打开/关闭**

```
/**
 * torch true 打开，否则 关闭; 可缺失
 */
emedia.mgr.torchRemote(stream， torch);
等价于
emedia.mgr.triggerTorchRemote(videoTag, torch).catch(function(){
    alert("Torch失败");
});
```

#### **控制手机截屏**

```
emedia.mgr.capturePictureRemote(stream);
等价于
emedia.mgr.triggerCapturePictureRemote(videoTag).catch(function(){
    alert("抓图失败");
});
```

#### **控制手机摄像头放大缩小**

```
emedia.mgr.zoomRemote(stream, multiples);
等价于
emedia.mgr.triggerZoomRemote(videoTag, multiples).catch(function(){
    alert("zoom失败");
});
```

#### **控制手机摄像头聚焦曝光**

```
/**
 * clickEvent 为 videoTag的点击事件。通过event计算点击的坐标传给sdk进行控制
 *
 */
emedia.mgr.focusExpoRemote(stream, videoTag, clickEvent).catch(function(){
    alert("focusExpoRemote失败");
});
等价于
/**
 * event string. 如点击 “click”
 * fail 失败回调；success成功回调
 */
emedia.mgr.onFocusExpoRemoteWhenClickVideo(videoTag, event, fail, success);
```

#### **取消在videoTag上的事件**

```
//用来对onFocusExpoRemoteWhenClickVideo的撤销
emedia.mgr.offEventAtTag(videoTag);
//视频收发数据统计
emedia.mgr.onMediaTransmission(videoTag, function notify(trackId, type, subtype, data) {
    var $iceStatsShow = $div.find("#iceStatsShow");
    var $em = $iceStatsShow.find("#"+subtype);
    if(!$em.length){
        $em  = $("<em></em>").appendTo($iceStatsShow).attr("id", subtype);
    }

    $em.text(subtype + ":" + (data*8/1000).toFixed(2));
});
//连接状态变化
emedia.mgr.onIceStateChanged(videoTag, function (state) {
    console.log(state);
});
```

#### **支持会议属性**

```
// 用来自定义一些属性，广播给会议中的成员
    // 有人设置会议属性，所有的成员都能收到
	let options = {
            key:username,
            val:'request_tobe_speaker'
        }

      // a. 设置会议属性 
	emedia.mgr.setConferenceAttrs(options)
      // b. 删除会议属性 
	emedia.mgr.deleteConferenceAttrs(options)
      // c. 会议属性变更回调 
	emedia.mgr.onConfrAttrsUpdated = attrs => {} //attrs 会议属性集合 Array
```

## 客户端API

多人音视频通话的API包括以下接口

- createConference: 创建会议
- destroyConference：销毁会议
- getConferenceInfo：获取会议信息
- publish：发布媒体流
- unpublish：取消发布媒体流
- grantRole：改变角色
- joinConference：通过password 加入会议
- kickMembersById：通过id踢出成员

**以下方法均为 emedia.mgr 对象的属性方法：**

| 方法                                                         |                       |
| :----------------------------------------------------------- | --------------------- |
| [createConference](http://webim-h5.easemob.com/emedia/jsdoc/out/global.html#createConference) | 创建会议              |
| [destroyConference](http://webim-h5.easemob.com/emedia/jsdoc/out/global.html#destroyConference) | 销毁会议              |
| [getConferenceInfo](http://webim-h5.easemob.com/emedia/jsdoc/out/global.html#getConferenceInfo) | 获取会议信息          |
| [grantRole](http://webim-h5.easemob.com/emedia/jsdoc/out/global.html#grantRole) | 改变角色              |
| [joinConference](http://webim-h5.easemob.com/emedia/jsdoc/out/global.html#joinConference) | 通过password 加入会议 |
| [kickMembersById](http://webim-h5.easemob.com/emedia/jsdoc/out/global.html#kickMembersById) | 通过id踢出成员        |
| [publish](http://webim-h5.easemob.com/emedia/jsdoc/out/global.html#publish) | 发布媒体流            |
| [unpublish](http://webim-h5.easemob.com/emedia/jsdoc/out/global.html#unpublish) | 取消发布媒体流        |