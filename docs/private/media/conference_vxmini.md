# 微信小程序集成多人通话

------

**多人音视频SDK**基于微信小程序live-pusher、live-player组件， 音视频SDK依赖IM SDK，所以集成前要先集成IM，把IM SDK放在全局变量wx下，可以参考[demo](https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/downloads/webim-weixin-xcx.zip)中src/comps/chat/multiEmedia的集成：<br>let WebIM = wx.WebIM = require('sdk/connection')

**注意：** 小程序创建的会议支持其他端加入（Android，iOS，Web，桌面端）， 但是其他端创建的会议要在创建时选择支持小程序，小程序端才可以加入会议，否则无法互通。

## 准备

- 下载微信开发者工具
- 在微信公众平台配置自己服务器域名（在私有部署后提供）
- 确保微信小程序符合使用媒体组件相应的类目并开通实时音视频权限
- 使用微信小程序基础库 1.7.0 及以上版本

## 下载

音视频SDK在src/emedia/emedia_for_miniProgram.js，[下载客户端SDK及Demo](https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/downloads/webim-weixin-xcx.zip)。


## 集成

直接引用js： 拷贝文件 emedia_for_miniProgram 到小程序工程文件夹，使用 require 将 SDK 集成到项目中即可：

```
var emedia = require("../emedia/emedia_for_miniProgram.js");
```

### 集成步骤
#### **发起会议**

1. 调用 createConference，在回调中可以得到confr对象，创建者默认为管理员

```
emedia.mgr.createConference(confrType, password).then(function(confr){
    //confr 即为创建的会议
    //将ID password 发送给其他人
})
```

**请注意：在其他端创建会议时，需要指定支持小程序音视频，才能与小程序互通。**

2. 加入会议，调用加入会议的API joinConferenceWithTicket 加入会议

```
emedia.mgr.joinConferenceWithTicket(confrId, ticket, ext).then(function(confr){
    //confr 即为创建的会议
})
```

调用joinRoom加入房间（会议），可以指定房间的名称，并且在房间不存在时会自动创建，另外可以在加入会议时指定角色。

```
let params = {
    roomName: 'test',
    password: '',
    role: 7, //admin
    config: {}
}
wx.emedia.mgr.joinRoom(params).then((res) => {
    let confrId = res.confrId
})
```

3. 发布本地视频流

```
emedia.mgr.pubStream(rtcId).then(function(res){
  // 将返回的res.data.rtmp 赋值给live-pusher的src就可以推流了
})
```

4. sdk调用emedia.mgr.onMemberJoin(member, stream) 告知进入的人

5. sdk调用emedia.mgr.onStreamAdded(member, stream) 告知进入的人发布的流情况，在这个回调里拿到视频流去调subStream订阅流

6. 可根据需要进行订阅emedia.mgr.subStream(streamId)

7. onMemberExited：当有人离开会议，onRoleChanged自己在会议中角色改变；onStreamRemoved某人取消流发布；onConferenceExit会议退出

#### **其他人进入会议**

1. 调用 joinConference，在回调中可以得到confr对象，创建者默认为管理员

```
emedia.mgr.joinConference(confrId, password, ext).then(function(confr){
    //confr 加入会议
})
```

2. sdk调用emedia.mgr.onMemberJoin(member, stream) 告知进入的人

3. sdk调用emedia.mgr.onStreamAdded(member, stream) 告知进入的人发布的流情况

4. 可根据需要进行订阅

```
emedia.mgr.subStream(streamId).then(function(res){
  //将返回的res.data.rtmp赋值给live-player的src就可以播放了
})
```

5. onMemberExited：当有人离开会议，onRoleChanged自己在会议中角色改变；onStreamRemoved某人取消流发布；onConferenceExit会议退出

### SDK回调

1. 有人加入会议，其他人调用joinXX等方法，如果加入成功，已经在会议中的人将会收到

```
emedia.mgr.onMemberJoined = function (member) {};
```

2. 有人退出会议

```
emedia.mgr.onMemberExited = function (member) {};
```

3. 有媒体流添加，比如有人调用pubStream之后

```
emedia.mgr.onStreamAdded = function (stream) {};
```

4. 有媒体流移除

```
emedia.mgr.onStreamRemoved = function (stream) {};
```

5. 角色改变

```
emedia.mgr.onRoleChanged = function (role) {};
```

6. 媒体流发生变化 (比如有人关闭摄像头)

```
emedia.mgr.onMediaChanaged = function (stream) {};
```

7. 会议退出，自己主动退出，服务端主动关闭

```
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
```

### 接口说明

1. 常量

```
// 会议类型
emedia.mgr.ConfrType = {
   COMMUNICATION: 10, //普通会议模式
   COMMUNICATION_MIX: 11, //大会议模式
   LIVE: 12, //直播模式
};

// 角色
emedia.mgr.Role = {
    ADMIN: 7, //管理员(可推送视频、可解散会议、可踢人、可变更其他人角色，会议创建者默认为管理员)
    TALKER: 3, // 主播（可发言、可观看）
    AUDIENCE: 1 // 观众（仅可以观看）
};
```

2. conference|confr

```
// 会议对象
{
    confrId:"TS_X296786295944036352C27",
    id:"TS_X296786295944036352C27",
    password: "password123",
    roleToken:"roleToken",
    ticket:"ticket",
    type:12
}
```

3. member

```
// 成员对象
{
    "ext":{ //emedia.mgr.joinConference(confrId, password, {role: 'admin'})/* 用户可自定义扩展字段*/);
        "role":"admin"
    },
    "id":"MS_X197721744293023744C19M197756407719972865VISITOR",
    "globalName":"easemob-demo#chatdemoui_yss000@easemob.com",
    "name": "yss000"
}
```

4. stream

```
// 视频流对象
{
    "id":"RTC2__Of_C19M197756407719972865VISITOR",
    "voff":0, //1 视频关闭
    "aoff":0, //1 音频关闭
    "memId":"MS_X197721744293023744C19M197756407719972865VISITOR",
    "owner": member ,//member对象
    "rtcId":"RTC1"
}
```

5. 创建会议

```
/**
 * @method createConference 创建会议
 * @param {string} confrType 会议类型
 * @param {string} password 会议密码
 * @param {boolean} rec 是否录制 默认false
 * @param {boolean} recMerge 是否合并 默认false
 */
emedia.mgr.createConference(confrType, password).then(function(confr){
    //confr 即为创建的会议
})
```

6. 获取加入会议ticket

```
/**
 * @method getConferenceTkt 申请tickit
 * @param {string} confrId 会议id
 * @param {string} password 会议密码
 */
emedia.mgr.getConferenceTkt(confrId, password).then(function(tickit){

})
```

7. 销毁会议

```
/**
 * @method destroyConference 解散会议
 * @param {string} confrId 会议id
 */
emedia.mgr.destroyConference(confrId).then(function(){

})
```

8. 踢人

```
/**
 * @method kickMembersById 踢人
 * @param {string} confrId 会议id
 * @param {Array} memberNames 踢出的人
 */
emedia.mgr.kickMembersById(confrId, memberNames).then(function(){

})
```

9. 改变角色

```
/**
 * @method grantRole 改变角色
 * @param {string} confrId 会议id
 * @param {Array} memberNames 人员
 * @param {string} role 角色
 */
emedia.mgr.grantRole(confrId, memberNames, role).then(function(){

})
```

10. 使用用户名密码加入会议，可自定义ext，其他会议成员将会看到

```
/**
 * @method joinConference 加入会议
 * @param {string} confrId 会议id
 * @param {string} password 会议密码
 * @param {Object} ext 扩展
 */
emedia.mgr.joinConference(confrId, password, ext).then(function(){

})
```

11. 使用ticket加入会议，可自定义ext，其他会议成员将会看到

```
/**
 * @method joinConferenceWithTicket 加入会议
 * @param {string} confrId 会议id
 * @param {string} ticket 会议ticket
 * @param {Object} ext 扩展
 */
emedia.mgr.joinConferenceWithTicket(confrId, ticket, ext).then(function(){

})
```

12. 调用joinRoom加入房间（会议），可以指定房间的名称，并且在房间不存在时会自动创建。 另外可以在加入会议时指定角色。

```
/**
 * @method joinRoom 加入房间（会议）
 * @param {Object} option
 * @param {string} option.roomName - 房间名称
 * @param {string} option.password - 房间密码
 * @param {number} option.role - 进入房间时的角色
 * @param {object} option.config - 扩展能力 可设置以下参数
 * @param {string} option.config.nickName - 进入会议的昵称
 * @param {boolean} option.config.rec - 是否开启录制
 * @param {boolean} option.config.recMerge - 是否开启合并
 * @param {number} option.config.maxTalkerCount - 自定义会议最大主播人数
 * @param {number} option.config.maxVideoCount - 自定义会议最大视频数
 * @param {number} option.config.maxAudienceCount - 自定义会议最大观众数
 * @param {number} option.config.maxPubDesktopCount - 自定义会议共享屏幕最大数
 * @param {object} option.config.ext - 扩展字段 用于自定义
 */
wx.emedia.mgr.joinRoom(option).then((res) => {
    let confrId = res.confrId
})
```

13. 退出会议

```
emedia.mgr.exitConference(confrId);
```

14. 发布媒体流

```
/**
 * @method pubStream 发布视频流
 * @param {string} rtcId 视频流id 自己发布流时rtcId = wx.emedia.util.getRtcId()
 */
emedia.mgr.pubStream(rtcId).then(function(res){
  // res.data.rtmp 为要推流的url
})
```

15. 订阅媒体流

```
/**
 * @method subStream 订阅视频流
 * @param {string} streamId 视频流id 可以在onStreamAdded中获取其他人的视频流id
 */
emedia.mgr.subStream(streamId).then(function(res){
  // res.data.rtmp 为要播放的src
})
```