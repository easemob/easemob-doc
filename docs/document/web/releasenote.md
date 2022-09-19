# Web IM SDK 更新日志

<Toc />

## 版本 V4.1.0 Dev 2022-9-16（开发版）

### 新增特性

- [IM SDK] 新增聊天室自定义属性功能。
- [IM SDK] 新增 `logsCallback`（logger.logsCallback = (log) => {}）方法，实现用户日志回调。
- [IM SDK] `getJoinedGroups` 方法中新增 `needAffiliations` 和 `needRole` 参数支持获取群组成员数和用户自己的角色。

### 优化

- [IM SDK] SDK 模块化拆分。
- [IM SDK] 移除废弃的方法 (`subscribe`, `subscribed`, `unsubscribed`, `removeRoster`, `getRoster`, `callback: onRoster`, `onMutedMessage`, `onCreateGroup` 和 onBlacklistUpdate)。

### 修复

- [IM SDK] 修复上传文件失败没有触发回调的问题。
- [IM SDK] 修复 IE 浏览器的兼容性问题。
- [IM SDK] 修复 IM Uniapp 在手机上运行时上报 `addEventListener` 错误的问题。

## 版本 V4.0.9 Dev 2022-7-29（开发版）

### 新增特性

- [IM SDK] 增加灾备策略。
- [IM SDK] SDK 内部在群组聊天室部分 API 请求时增加 `resourceId`，增加操作的多设备通知提醒。

### 优化

- [IM SDK] 优化协议，减少数据量。
- [IM SDK] 修复某些情况下消息延迟。

## 版本 V4.0.8 Dev 2022-6-17

### 新增特性
- [IM SDK] 新增群组事件回调 [onGroupEvent](https://webim-h5.easemob.com/jsdoc/out/interfaces/Types.EvevtHandlerType.EventHandlerType.html#onGroupEvent) 和聊天室事件回调 [onChatroomEvent](https://webim-h5.easemob.com/jsdoc/out/interfaces/Types.EvevtHandlerType.EventHandlerType.html#onChatroomEvent)。原回调可继续使用；
- [IM SDK] 新增群聊消息限流错误码 [MESSAGE_CURRENT_LIMITING](error.html)
- [IM SDK] 邀请加入群聊回调 onGroupChange 返回中新增 群名称 参数值。

### 优化

- [IM SDK] 支持批量查询群组详情 [getGroupInfo](group_manage.html#获取群组详情信息)。

## 版本 V4.0.7 Dev 2022-5-25

### 新增特性:

- [IM SDK] 新增消息子区（message thread）功能；
- [IM SDK] 新增 [getConversationlist](message_retrieve.html#从服务器获取消息) 方法解析会话中的最新一条消息；

### 优化：

- [IM SDK] 消息事件监听器中新增 onlineState 字段标记消息的在线状态。

## 版本 V4.0.5 Dev 2022-5-16

### 新增特性:

- [IM SDK] 新增 [消息 Reaction](reaction.html) 功能，可以对消息进行不同的响应；
- [IM SDK] 新增 [举报 API](moderation.html) 用于内容审核；
- [IM SDK] 新增推送设置 API，支持不同的推送配置；
- [IM SDK] 增加数据上报功能；

### 优化：

- [IM SDK] 获取加入的群组更新为支持分页的 API；
- [IM SDK] 创建群组时，支持设置群组人数；
- [IM SDK] 接收到的图片消息增加缩略图 URL；

### 修复：

- [IM SDK] 解决切换账号群组消息有缓存的 BUG。

## 版本 V4.0.4 Dev 2022-4-19

### 新增特性:

- [IM SDK] 增加 [用户在线状态(Presence)](presence.html) 订阅功能。
- [IM SDK] [翻译功能](message_translation.html)：增加自动翻译接口。实现用户按需翻译和发消息自动翻译。

### 优化：

- [IM SDK] 小程序不需要 isHttpDNS 参数。

### 修复：

- [IM SDK] 修复 Uni_SDK 无法运行到浏览器问题。
- [IM SDK] 修复创建群组时无法修改群简介问题。
- [IM SDK] 修复 SSR 兼容性。

## 版本：v4.0.3 2022-1-19（稳定版）

- [IM SDK] 修复缺失 'downloadGroupSharedFile' 方法。
- [IM SDK] 'fetchGroupSharedFileList' 支持分页。

## 版本：v4.0.2 2022-1-14

- [IM SDK] 增加单向删除会话 API：deleteSession。
- [IM SDK] 位置消息增加 “buildingName” 字段。
- [IM SDK] 增加非好友发消息失败 error：type 221。
- [IM SDK] 增加因全局禁言发消息失败 error：type 219。
- [IM SDK] 修复不回调 “onChannelMessage” 事件 bug。
- [IM SDK] 修复其他已知错误。

## 版本：v4.0.1 2021-12-10

- [IM SDK] 修复类型错误。
- [IM SDK] 修复收不到 delivery ack。
- [IM SDK] 修复群公告不能设为空。
- [IM SDK] 修复聊天中禁言报错。
- [IM SDK] 更新部分函数命名与注释。
- [IM SDK] 增加部分错误码。

## 版本：v4.0.0 2021-10-22

- [IM SDK] 支持 typescript；
- [IM SDK] 发送消息、好友操作支持 Promise；
- [IM SDK] 增加新的事件监听方式 eventHandler；
- [IM SDK] 增加新的构造消息 API；
- [IM SDK] 优化部分 API，减少不必要参数，增加错误提示；
- [IM SDK] 修复部分已知 bug。

## 版本：v3.6.3 2021-07-30

- [IM SDK] 增加下载文件验证 secret 功能；
- [IM SDK] 增加发送消息被自定义拦截的错误类型；
- [IM SDK] 增加发送附件消息 onFileUploadProgress 上传进度回调；
- [IM SDK] 优化漫游消息 API，增加 start 参数，指定开始拉取消息的位置；
- [IM SDK] 优化重连逻辑；
- [IM SDK] 修复上传附件过程中发消息报错；
- [IM SDK] 修复 react native 使用用户属性报错；
- [IM SDK] 修复 Electron 使用报错。

## 版本：v3.6.0 2021-06-30

- [IM SDK] 更新 dnsconfig；
- [IM SDK] 启用 DNS 的情况下使用动态端口；
- [IM SDK] 优化输出日志。

## 版本：v3.5.1 2021-04-14

- [IM SDK] 增加用户属性功能 [用户属性](userprofile.html)；
- [IM SDK] 增加修改推送昵称 API；
- [IM SDK] 申请加群 joinGroup 方法增加请求信息参数 message；
- [IM SDK] 修复退出聊天室没有清除缓存消息；
- [demo] 增加用户资料功能；
- [demo] 增加名片消息功能。

## 版本：v3.5.0 2021-03-01

- [IM SDK] 登陆接口去掉 apiUrl 参数；
- [IM SDK] 默认关闭日志采集；
- [IM SDK] 修复未登录状态发消息报错；
- [IM SDK] 修复大型聊天室消息堵塞；
- [IM SDK] 修复开始 dnsConfig 情况下，循环报错；
- [demo] demo 中使用声网音视频 SDK 实现音视频通话功能。

## 版本：v3.4.2 2021-01-09

- [IM SDK] 增加获取会话列表功能；
- [IM SDK] 增加 channel ack 消息；
- [IM SDK] 修复 IE10 兼容问题；
- [IM SDK] 修复由 uniapp 生成 h5 时登陆报错；
- [IM SDK] 修复部分已知 bug；

## 版本：v3.4.1 2020-12-24

- [多人音视频] 实现默认使用dns config
- [多人音视频] 修复1v1 通话没有挂断原因
- [多人音视频] 修复eletron 共享桌面显示不正常的问题
- [多人音视频] 修复 退出会议，会提示别人退出
- [多人音视频] 修复 Android手机微信内，切换 4g, 画面卡住的问题
- [多人音视频] 修复 偶现共享桌面无法显示的问题
- [多人音视频] 支持共享桌面 点击【停止共享】按钮
- [多人音视频] 修复手机切换摄像头不生效的问题
- [多人音视频] 修复web端发布流传入选中设备的deviceId不生效的问题

## 版本：v3.4.0 2020-12-10

- [IM SDK] 增加移动端上传推送token api
- [IM SDK] 撤回消息、已读消息增加from、to字段
- [IM SDK] CMD、自定义消息增加type字段
- [IM SDK] 修复ie中兼容问题

## 版本：v3.3.2 2020-10-19

- [IM SDK] 增加支持设置固定 deviceId
- [IM SDK] 修改 getGroup 方法去掉 apiUrl 参数
- [IM SDK] 修复拉历史消息 bug
- [IM SDK] 修复发送附件消息对3.3.0之前 api 的兼容问题

## 版本：v3.3.0 2020-09-16

- [IM SDK] 增加支持 promise
- [IM SDK] 增加 onContactInvited、onContactDeleted、onContactAdded、onContactRefuse、onContactAgreed 好友相关的回调
- [IM SDK] 增加 addContact、deleteContact、acceptInvitation、declineInvitation 代替原subscribe、removeRoster、subscribed、unsubscribed 好友操作 API
- [IM SDK] 修改默认的resource，以便区分web端和小程序端的用户
- [IM SDK] 修改 getChatRooms 获取聊天室 API，去掉 apiUrl 参数
- [IM SDK] 修改 构造 cmd 消息 API, 去掉 msg 参数
- [IM SDK] 优化构造消息API，使用 chatType 来区分消息类型（单聊/群聊/聊天室）
- [IM SDK] 修复发送位置消息成功后并不执行 success 回调
- [IM SDK] 增加容错处理

## 版本：v3.2.2 2020-08-25

- [IM SDK] 创建群组时增加被邀请人是否需要同意的参数
- [IM SDK] 修复头条小程序消息延迟
- [IM SDK] onError回调增加 error message
- [IM SDK] 修改附件消息重定向
- [IM SDK] 支持vue-ssr-renderer服务端渲染
- [多人音视频] 支持会议中质量监控上报功能
- [多人音视频] 支持会议中视频的弱网和断网状态监听
- [多人音视频] 支持多集群部署文件RTCConfig URL 可指定
- [多人音视频] 修复多人会议，发布视频流的时候，无麦克风，视频也发布不成功
- [多人音视频] 修复创建会议后，全体静音不生效
- [单人音视频] 支持通话过程中，对一端断网的监听

## 版本：v3.2.1 2020-07-28

- [多人音视频] 共享桌面 API 支持 chrome 72 以上不再依赖插件
- [多人音视频] 增加 多路推流API
- [多人音视频] 支持纯音频推流CDN
- [多人音视频] 修复授权API 在IM内无法使用
- [多人音视频] 修复 1对1 视频通话 先呼叫一个不在线的人员，再呼叫其他人员失败
- [单人音视频] 增加呼叫推送功能
- [IM SDK] 修改创建聊天室api，不需要传owner参数
- [IM SDK] 增加日志采集功能

## 版本：v3.2.0 2020-07-09

- [IM SDK] 增加创建聊天室、查询\修改聊天室详情、查询\设置\移除管理员
- [IM SDK] 修复对消息扩展类型解析错误
- [IM SDK] 修复发送图片、文件消息时，直接发送url时下载不成功
- [IM SDK] 修改对于被禁言、拉黑等导致的发送消息失败，将从fail回调出去，不再从全局的onError回调
- [多人音视频] 增加通过joinRoom创建房间时，可配置支持小程序

## 版本：v3.1.5 2020-06-23

- [多人音视频] 增加创建会议支持自定义共享桌面个数
- [多人音视频] 修复了safari 浏览器的兼容性问题
- [多人音视频] 支持 electorn 共享桌面

## 版本：v3.1.4 2020-06-11

- [IM SDK] 支持附件下载重定向
- [IM SDK] 支持图片检测违规抛出单独的异常
- [IM SDK] 增加分页获取聊天室成员api

## 版本：v3.1.2 2020-05-14

- [IM SDK] 增加上传修改群/聊天室公告、获取群/聊天室公告、上传/下载/删除群/聊天室文件、获取群/聊天室文件列表APIs
- [IM SDK] 修改重连间隔
- [IM SDK] 去掉对上传文件大小的限制, 由服务端来限制
- [IM SDK] 增加聊天室禁言、解除禁言、获取禁言列表、加入黑名单、移除黑名单、获取黑明单列表APIs
- [多人音视频] 增加上麦申请/下麦降级/申请主持人/全体静音/全体解除静音/静音个人/解除静音个人 APIs
- [多人音视频] 增加了支持多集群部署 API
- [多人音视频] 增加了 推流CDN/更新推流布局 APIs
- [多人音视频] 修复了引入 webrtc 报错 regenerator-runtime

## 版本：v3.1.0 2020-04-20

- [多人音视频] joinRoom API 通过appkey 拼接URL

## 版本：v3.0.10 2020-03-28

- [sdk] 支持一键禁言、白名单等群/聊天室的操作
- [sdk] 支持发自定义消息
- [sdk] 消息体里增加ContentsType，来表示消息类型
- [sdk] 修复扩展消息不能使用number类型数据
- [sdk] 登录接口的'Content-type'改为'application/json'
- [sdk] 修复回复多余回执导致堵塞的情况
- [sdk] 修复dnsconfig配置问题
- [多人音视频] 增加添加加入房间API joinRoom
- [多人音视频] 增加管理员变更回调 onAdminChanged
- [多人音视频] 增加会议属性相关 API
- [多人音视频] 定义视频流类型 StreamType
- [多人音视频] 添加共享桌面 ‘停止共享’ 回调函数 option.stopSharedCallback

## 版本：v3.0.7 2019-12-31

- [sdk] https下增加dns配置
- [sdk] 增加群组回执
- [sdk] 修复resource错误等bug

## 版本：v3.0.6 2019-09-20

- [sdk] 音视频增加录制、合并设置
- [sdk] sdk增加消息去重机制
- [sdk] 回调消息增加时间戳

## 版本：v3.0.5 2019-08-22

- [sdk] 简化好友添加和移除黑名单方法
- [sdk] 扩展消息支持json对象
- [sdk] 退出不执行onclose
- [sdk] Electron下不能建立链接问题

## 版本：v3.0.4 2019-07-25

### Bug修复：

- [sdk] 扩展消息bug
- [sdk] 群组类消息撤回bug
- [sdk] 优化历史消息
- [sdk] 发送语音消息、视频消息回调bug

## 版本：v3.0.2 2019-07-09

### 新功能：

- [sdk] dns下上传文件走dns

### Bug修复：

- [sdk] 无法拉取历史消息
- [sdk] loc/cmd消息 messageId bug

## 版本：v3.0.0 2019-06-29

### 新功能：

- [sdk] 基于私有协议重写
- [sdk] 增加拉取历史消息接口
- [sdk] 增加撤回消息接口
- [sdk] 增加接受群邀请接口
- [demo] 增加接受群邀请功能
- [demo] 增加和调整一些群操作通知

### Bug修复：

- [demo] 修复音视频通话时显示名称不对
- [demo] 加入群组群组列表不实时更新
- [demo] 用户名大写导致群组中无法识别人管理员

## 版本：v1.11.1 2019-03-18

### 新功能：

- [sdk] 通过设置 isHttpDNS 为 true，从服务端获取 DNS 配置文件，SDK中改进自动重连的功能
- [demo] 配置文件文件增加配置 isHttpDNS
- [demo] 项目初始化 sdk 增加 isHttpDNS
- [demo] 解决safari视频无图片、无声音问题

## 版本：v1.10.0 2018-09-17

### 新功能：

- [demo] 多人音视频

### Bug修复：

- [demo] 在视频界面中，切到其他界面，视频界面不在了。但是视频还在继续中
- [demo] 火狐 邀请 chrome， 进入多人会议，都收不到视频通知
- [demo] 不选择会话，收不到视频来电
- [demo] 多人视频 开关视频键状态不对
- [demo] chrome和firfox多人音视频会议中，chrome不显示firefox用户的视频
- [demo] 多人视频，一个浏览器登录两个账号，有一个账号 ui经常收不到视频邀请

## 版本：v1.6.0 2018-01-29

### 新功能：

- [demo] 多人音视频
- [sdk] 多人音视频

### Bug修复：

- [demo] 无法发送表情

## 版本：v1.5.0 2017-11-17

### 新功能：

- [demo] 添加Rest Interface的Test case
- [demo] sdk/demo 上传功能兼容ie8

### Bug修复：

- [demo] 多设备登录异常
- [demo] 新建需要审批的公有群，加入必须有审批流程
- [demo] 鼠标悬浮在群禁言图标上出现提示信息“禁言”
- [demo] demo.html中从cdn引入sdk
- [demo] 修复无法准确统计离线消息数的bug
- [demo] window.history.pushState在windows的chrome上有兼容性问题，统一改成window.location.href
- [demo] window.location.href = xxxx，如果修改的是href.search参数(?a=x&b=y)时候, 如果遇到file方式打开本地index.html会直接跳转页面，造成登录一直不成功，改成修改 href.hash 参数(#a=x&b=y)
- [demo] 将群管理员可操作的项目展示给管理员

## 版本：v1.4.13 2017-09-12

### 新功能：

- [sdk] 新增jsdoc

### Bug修复：

- [sdk] ios(8.1)webview 已读和已送到回执异常
- [sdk] 多设备登录异常
- [demo] 多设备登录异常

## 版本：v1.4.12 2017-07-17

### 新功能：

- [sdk] 修改delivery ack和read ack的格式
- [sdk] 用户在离线状态下发送消息，会自动重连并将未成功发送的消息发送出去
- [sdk] WEBIM支持多设备，添加加入聊天室事件
- [sdk] 给delivered和ack加上from字段
- [demo] 添加Rest Interface的 Test case
- [demo] sdk/demo上传功能兼容ie8

### Bug修复：

- [sdk] 提升ie8的兼容性
- [sdk] 自己发送的消息的已读ack，不再发送给自己
- [demo] 新建需要审批的公有群，加入必须有审批流程
- [demo] 鼠标悬浮在群禁言图标上出现提示信息“禁言”
- [demo] demo.html中从cdn引入sdk
- [demo] 修复无法准确统计离线消息数的bug
- [demo] window.history.pushState在windows的chrome上有兼容性问题，统一改成window.location.href
- [demo] window.location.href = xxxx，如果修改的是href.search参数(?a=x&b=y)时候, 如果遇到file方式打开本地index.html会直接跳转页面，造成登录一直不成功，改成修改 href.hash 参数(#a=x&b=y)
- [demo] 将群管理员可操作的项目展示给管理员

## 版本：v1.4.11 2017-06-14

### 新功能：

- [sdk] debug.js融合到sdk当中，优化日志内容输出
- [sdk] 通过Rest屏蔽群组
- [sdk] 通过Rest发出入群申请
- [sdk] 通过Rest获取群组列表
- [sdk] 通过Rest根据groupid获取群组详情
- [sdk] 通过Rest列出某用户所加入的所有群组
- [sdk] 通过Rest列出群组的所有成员
- [sdk] 通过Rest禁止群用户发言
- [sdk] 通过Rest取消对用户禁言的禁止
- [sdk] 通过Rest获取群组下所有管理员
- [sdk] 通过Rest获取群组下所有被禁言成员
- [sdk] 通过Rest设置群管理员
- [sdk] 通过Rest取消群管理员
- [sdk] 通过Rest同意用户加入群
- [sdk] 通过Rest拒绝用户加入群
- [sdk] 通过Rest添加用户至群组黑名单（单个）
- [sdk] 通过Rest添加用户至群组黑名单（批量）
- [sdk] 通过Rest将用户从群黑名单移除（单个）
- [sdk] 通过Rest将用户从群黑名单移除（批量）
- [demo] 聊天窗口中记录可清空
- [demo] 聊天窗口中发送方聊天记录显示状态（未送达、已送达、已读）
- [demo] 查看聊天室成员
- [demo] 通过链接直接打开与好友的对话框
- [demo] 新增申请加入公开群面板
- [demo] 在申请加入公开群面板可下拉分页获取公开群
- [demo] 在申请加入公开群面板可点击群名称可查看群详情
- [demo] 在申请加入公开群面板可搜索群查看群详情
- [demo] 在申请加入公开群面板群详情页面可申请加入群组
- [demo] 群主可同意、拒绝加群申请
- [demo] 在群主的群成员列表中新增添加/移除管理员、禁言/解禁群成员按钮

### Bug修复：

- [sdk] 添加好友会产生多余的订阅消息
- [sdk] 频繁的发送消息会导致消息id重复的问题
- [sdk] 适配SDK发送文件和图片的大小
- [demo] 优化sdk/demo.html，修复某些依赖文件找不到的问题
- [demo] 修复离线消息数量统计不准确问题

## 版本：v1.4.10 2017-02-16

### 新功能：

- [sdk] webrtc新增语音呼叫

## Bug修复：

- [sdk] webrtc:Firefox在结束通话后的问题
- [sdk] webrtc:多次接通挂断之后,逻辑功能混乱
- [sdk] webrtc:正常挂断不应该提醒offline
- [sdk] webrtc:重连后无法处理音视频IQ消息

## 版本：v1.4.9 2017-01-20

### Bug修复：

- [sdk] 成功/失败的回调函数如果没有定义会报错

## 版本：V1.4.8 2017-01-03

### 新功能：

- [demo] 增加webrtc视频聊天的声音开关
- [demo] 动态创建chatWindow，提高网页性能
- [demo] 切换leftbar时会给chatWindow添加遮罩，返回之前的leftbar时会直接跳到之前选中的cate和chatWindow
- [demo] 登录成功后，刷新页面不会再回到登录页

### Bug修复：

- [sdk] 移除sdk中所有log方法
- [sdk] 退出muc group room 时，追加发送一条unavailable的presence stanza

## 版本：V1.4.7 2016-12-21

### 新功能：

- [demo] 在demo.html中新增视频聊天及发送视频文件的功能

### Bug修复：

- [sdk] 解决在手机浏览器在后台运行时无法断线重连的问题
- [demo] WebIM建群，等待后台建群成功后再拉取群信息并更新UI中的群列表
- [demo] WebIM群加人，群主和被添加的群成员均可以收到通知
- [demo] WebIM群主将群成员从黑名单移除后，不再回到群成员列表中，而直接被删除

## 版本：V1.4.6 2016-12-20

### 新功能：

- [sdk] 新增 demo.html, 演示如何调用sdk的各种接口

### Bug修复：

- [demo] 创建群组成功之后，立即刷新群组列表，不再等1秒
- [sdk] sdk与上层Demo解耦，删除Demo相关代码
- [sdk] 删除server不支持的connection.prototype.createRoom

## 版本：V1.4.5 2016-12-01

### 新功能：

- GNU风格的版本号命名格式: 主版本号.子版本号.修正版本号 (新版本规则的1.4.5 = 旧版本规则的1.1.4.5)
- [demo] 好友之间可以通过webrtc进行视频聊(仅支持 https + Webkit浏览器)
- [demo] 支持同一账号最多8个标签页登录 isMultiLoginSessions:true
- [demo] http访问加入ip策略功能,防止DNS劫持 isHttpDNS:true
- [sdk] 新增两种安装引用方式（具体引用方式，请参考 [集成方式](https://docs-im.easemob.com/im/web/intro/integration)）
    - 添加 `<script>` 标签，并通过WebIM命名空间访问websdk
    - NPM（websdk 已经发布到NPM），先require，再访问WebIM

### Bug修复：

- [sdk] 解散群组不更新UI
- [sdk] 修复了发送cmd消息成功后无法调用回调函数的bug

## 版本：V1.1.3 2016-11-01

### 功能改进：

- [demo] 支持 Windows SDK。[https://www.easemob.com/download/im](https://www.easemob.com/download/im)
- [demo] 新增黑名单功能。
- [demo] 获取聊天室列表: 支持分页、下拉刷新，新增以下2个参数：pagenum 和 pagesize。
- [demo] 群组增加以下功能：创建群组、修改群组名称、修改群组简介、群组成员管理、加入公开群。
- [sdk] strophe 从 v1.2.2 升级到 v1.2.8，在生产模式使用 strophe-1.2.8.min.js， 在开发模式使用 strophe.js。
- [sdk] 支持自动重连: 在 webim.config.js 文件中新增相关参数 `autoReconnectNumMax` 和 `autoReconnectInterval`。

### Bug fixes:

- [demo] 增加 `babel-core/browser-polyfill.js`文件，修复了 IE 不支持 HTML5 elements 的 bug。
- [demo] 修复了有未读消息时点击联系人不生效的bug。
- [sdk] 修复了strophe.js v1.2.8在IE9中使用BOSH会报错的bug。 [https://github.com/strophe/strophejs/issues/213](https://github.com/strophe/strophejs/issues/213)
- [sdk] 修复了存在大量离线消息时收发消息延迟的bug。客户端将发送ack应答消息的速度限制在5个/秒，不影响其他正常消息。
- [sdk] 将心跳消息从空body的 json message 切换为 ping/pong iq。前者会作为离线消息被XMPP Server缓存。

## 版本：V1.1.2 2016-8-12

### 功能改进：

- 新版demo
- 添加isAutoLogoin参数，默认setPresence
- 拆分sdk为四个文件，最终打包成一个webim.im.sdk.js
- 增加try catch，尽量减少因为外部的错误导致的连接断开
- 修改错误码，不再返回错误提示消息，在文档体现

### Bug fix：

- 无法传file_length
- 特殊字符无法显示
- im用户为数字时，toLowercase报错
- 发送音频增加时长参数

## 版本：V1.1.1 2016-6-27

### 功能改进：

- 增加聊天室加入成功、失败回调
- 增加网络监测回调onOnline、onOffline
- 处理Web IM与Android/iOS SDK 3.x和2.x的兼容性
- demo新增发送文件功能
- 收到AMR自动转MP3

### Bug fix：

- 修复心跳会创建多个timer
- 联系人名称过长导致的样式问题
- IE9发送附件失效
- IE9添加好友报错

## 版本：V1.1.0 2016-4-6

### 功能改进：

- 将表情包移除sdk，可导入自定义表情。
- 增加XMPP连接多resource支持的参数。
- 对于不支持wss，如qqX5内核浏览器，自动降级为https long polling。
- 增加聊天室功能。
- v1.1.0与之前版本sdk部分api已不兼容，添加shim.js，做降级支持。
- 新增消息发送的成功失败回调。
- 优化代码，修复退出时websocket报错。

## 版本：V1.0.7 2015-8-25

### 功能改进：

- 增加连接心跳支持，保持客户端连接不间断。
- 增加XMPP连接多resource支持。
- 实现Web IM SDK Websocket支持。
- 增加Token登录。
- 在Demo中对不支持异步上传的浏览器使用第三方插件（swfupload）提供支持。
- 对于不支持audio标签的浏览器，使用jPlayer解决无法播放语音的问题，但此方案当前只支持MP3。
- 重整目录结构，SDK相关文件在sdk文件夹内部；添加easemob.im.config.js，只需配置此js里面相关字段即可。
- 改进code，支持多环境快速调试。
- 支持IE7、IE8、IE9（在Demo中，接收的音频消息只能播放MP3格式）。

## 版本：V1.0.5 2015-3-11

### 新功能：

- 优化底层连接，减少系统登录耗时。
- 添加透传消息支持（注册onCmdMessage事件，以监听服务器端推送的透传消息）。
- 添加收到消息后，自动发送回复消息给服务器。
- 当图片下载失败时默认再一次下载。

## 版本：V1.0.4.1 2015-1-15

### 新功能：

- 收到文件消息通知，暂不支持下载。
- 收到视频消息通知，暂不支持下载。

### Bug Fix：

- 修复bug。修复不点击‘退出’按钮直接关闭浏览器下次登录消息丢失的bug。

## 版本：V1.0.4 2014-12-17

### Bug Fix：

- 修复bug。群聊位置消息作为单聊消息处理。
- 修改bug。好友列表为空时陌生人消息不显示。

## 版本：V1.0.3 2014-12-11

### 新功能：

- 增加陌生人聊天功能。
- 添加新用户注册功能。
- 支持https访问模式。
- 支持token登录。
- 支持语音消息。
- 消息体支持自定义扩展,添加ext属性。
- Demo示例支持未读消息提醒。

### 功能改进：

- 修复bug。demo联系人过多时的样式问题。
- 修复bug。conn = new Easemob.im.Connection();变量名不为conn或者conn不是全局变量时接收不到消息。
- 修复bug。群组离线消息当作陌生人消息处理。
- 修复bug。IE浏览器接受文本消息以换行符开始时会遮挡联系人名称。
- 修复bug。在线用户被邀请加入群组不能实时显示，必须重新登录。
- 丰富相关文档内容。