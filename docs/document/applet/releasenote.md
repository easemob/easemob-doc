# 小程序 SDK 更新日志

<Toc />

## 版本 V4.1.2 Dev 2022-11-08（开发版）

### 新增特性

- [IM SDK] [创建群组方法 `createGroup`](group_manage.html#创建群组) 和[修改群信息方法 `modifyGroup`](group_attributes.html#修改群组名称和描述) 新增 `ext` 字段支持群扩展信息。
- [IM SDK] 群组通知事件增加[群组信息修改事件 `updateInfo`](group_manage.html#监听群组事件)。
- [IM SDK] 新增[聊天室消息优先级](message_send_receive.html)。
- [IM SDK] 支持同时[对多个群组成员禁言和解除禁言](group_members.html#管理群组禁言)。

## 版本 V4.1.1 Dev 2022-9-26

### 修复

修复聊天室自定义属性功能中的问题。

## 版本 V4.1.0 Dev 2022-9-16

### 新增特性

- [IM SDK] 新增[聊天室自定义属性功能](room_attributes.html)。
- [IM SDK] 新增 `onLog` 方法，实现用户日志回调。
- [IM SDK] `getJoinedGroups` 方法中新增 `needAffiliations` 和 `needRole` 参数支持获取群组成员数和用户自己的角色。

### 优化

- 增加内嵌文档。
- 优化重连逻辑。

### 修复

[IM SDK] 修复 IM Uniapp 在手机上运行时上报 `addEventListener` 方法相关错误的问题。

## 版本 V4.0.9 2022-7-29

### 新增特性

- [IM SDK] 优化协议，减少数据量。
- [IM SDK] SDK 内部在群组聊天室部分 API 请求时增加 `resourceId`，增加操作的多设备通知提醒。
- [IM SDK] [getJoinedGroups](/web/group_manage.html#获取群组列表) 增加请求参数支持返回群组成员人数和自己的角色。

## 版本 V4.0.8 2022-6-17

### 新增特性

- [IM SDK] 新增群组事件回调 [onGroupEvent](https://docs-im-beta.easemob.com/jsdoc/interfaces/Types.EventHandlerType.EventHandlerType.html#onGroupEvent) 和聊天室事件回调 [onChatroomEvent](https://docs-im-beta.easemob.com/jsdoc/interfaces/Types.EventHandlerType.EventHandlerType.html#onChatroomEvent)。原回调可继续使用；
- [IM SDK] 新增群聊消息限流错误码 [MESSAGE_CURRENT_LIMITING](/document/web/error.html)
- [IM SDK] 邀请加入群聊回调 `onGroupChange` 返回中新增 群名称 参数值。

### 优化

- [IM SDK] 支持批量查询群组详情 [getGroupInfo](/document/web/group_manage.html#获取群组详情信息)。

## 版本 V4.0.7 2022-5-25

### 新增特性:

- [IM SDK] 新增消息子区（message thread）功能；
- [IM SDK] 新增 [getConversationList](/document/web/message_retrieve.html) 方法解析会话中的最新一条消息；

### 优化：

- [IM SDK] 消息事件监听器中新增 onlineState 字段标记离线消息。

## 版本 V4.0.5 2022-5-16

### 新增特性:

- [IM SDK] 新增举报 API 用于内容审核；
- [IM SDK] 新增推送设置 API，支持不同的推送配置；
- [IM SDK] 增加数据上报功能；
- [IM SDK] 新增获取加入的群组支持分页 API；

### 优化：

- [IM SDK] 创建群组时，支持设置群组人数；
- [IM SDK] 接收到的图片消息增加缩略图 URL；

### 修复：

- [IM SDK] 解决切换账号群组消息有缓存的 BUG。

## 版本 V4.0.4 2022-4-19

:::tip
仅 V4.0.4 及以下版本支持私有化部署。
:::

### 新增特性:

- [IM SDK] 增加用户在线状态(Presence)订阅功能。
- [IM SDK] 增加自动翻译接口。除了按需翻译，IM 实现自动翻译。

### 优化：

- [IM SDK] 小程序不需要 isHttpDNS 参数。

### 修复：

- [IM SDK] 修复 Uni_SDK 无法运行到浏览器问题。
- [IM SDK] 修复创建群组时无法修改群简介问题。
- [IM SDK] 修复 SSR 兼容性。

## 版本：v4.0.3 2022-1-19

- [IM SDK] 'fetchGroupSharedFileList' 支持分页。
- [IM SDK] 默认关闭 DNS。

## 版本：v4.0.2 2022-1-14

- [IM SDK] 增加删除会话 API。
- [IM SDK] 位置消息增加 “buildingName” 字段。
- [IM SDK] 增加非好友发消息失败 error。
- [IM SDK] 增加因全局禁言发消息失败 error。
- [IM SDK] 增加支持钉钉小程序。
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

- [IM SDK] 支持 typescript
- [IM SDK] 发送消息、好友操作支持 Promise
- [IM SDK] 支持使用 agora token 登录
- [IM SDK] 增加新的事件监听方式 eventHandler
- [IM SDK] 增加新的构造消息 API
- [IM SDK] 优化部分 API，减少不必要参数，增加错误提示。
- [IM SDK] 修复部分已知 bug

## 版本：v3.6.3 2021-07-30

- [IM SDK] 增加下载文件验证 secret 功能
- [IM SDK] 增加发送消息被自定义拦截的错误类型
- [IM SDK] 优化漫游消息 api, 增加 start 参数，指定开始拉取消息的位置
- [IM SDK] 修复百度小程序兼容问题
- [IM SDK] 登录上报区分不同小程序

## 版本：v3.6.2 2021-07-08

- [IM SDK] 修复 ios14.5 以上小程序如果使用插件导致 SDK 登录不成功

## 版本：v3.6.0 2021-06-30

- [IM SDK] 更新 dnsconfig
- [IM SDK] 启用 dns 的情况下使用动态端口
- [IM SDK] 优化输出日志
- [IM SDK] 修复重连问题

## 版本：v3.5.1 2021-04-14

- [IM SDK] 增加用户属性功能 [用户属性](https://docs-im.easemob.com/im/web/basics/profile)
- [IM SDK] 增加修改推送昵称 API
- [IM SDK] 申请加群 joinGroup 方法增加请求信息参数 message
- [IM SDK] 修复退出聊天室没有清除缓存消息

## 版本：v3.5.0 2021-03-01

- [IM SDK] 登陆接口去掉 apiUrl 参数
- [IM SDK] 默认关闭日志采集
- [IM SDK] 修复未登录状态发消息报错
- [IM SDK] 修复大型聊天室消息堵塞

## 版本：v3.4.2 2021-01-09

- [IM SDK] 增加获取会话列表功能
- [IM SDK] 增加 channel ack 消息
- [IM SDK] 修复由 uniapp 生成 h5 时登陆报错
- [IM SDK] 修复部分已知 bug

## 版本：v3.4.0 2020-12-10

- [IM SDK] 增加支持支付宝小程序
- [IM SDK] 增加移动端上传推送 token api
- [IM SDK] 撤回消息、已读消息增加 from、to 字段
- [IM SDK] CMD、自定义消息增加 type 字段
- [音视频 SDK] 支持 uniapp 生成的原生客户端

## 版本：v3.3.2 2020-10-19

- [IM SDK] 增加支持设置固定 deviceId
- [IM SDK] 修改 getGroup 方法去掉参数
- [IM SDK] 修复拉历史消息 bug
- [IM SDK] 修复发送附件消息对 3.3.0 之前 api 的兼容问题
- [IM SDK] 修复使用 uniapp 打包的 app，退到后台回来时 websocket 无法连接的问题
- [小程序 demo] 增加支持发视频消息
- [小程序 demo] 增加提示注册失败原因：用户名超出 64 字节
- [小程序 demo] 增加支持会话列表显示陌生人会话

## 版本：v3.3.0 2020-09-16

- [IM SDK] 增加支持 promise
- [IM SDK] 增加 onContactInvited、onContactDeleted、onContactAdded、onContactRefuse、onContactAgreed 好友相关的回调
- [IM SDK] 增加 addContact、deleteContact、acceptInvitation、declineInvitation 代替原 subscribe、removeRoster、subscribed、unsubscribed 好友操作 API
- [IM SDK] 增加状态码 40，在 onError 中 type 为 40 会回调出因为 socket 断开导致发送失败的消息
- [IM SDK] 修改默认的 resource，以便区分 web 端和小程序端的用户
- [IM SDK] 修改 getChatRooms 获取聊天室 API，去掉 apiUrl 参数
- [IM SDK] 修改 构造 cmd 消息 API, 去掉 msg 参数
- [IM SDK] 优化构造消息 API，使用 chatType 来区分消息类型（单聊/群聊/聊天室）
- [IM SDK] 修复发送位置消息成功后并不执行 success 回调
- [IM SDK] 增加容错处理

## 版本：v3.2.2 2020-08-25

- [IM SDK] 创建群组时增加被邀请人是否需要同意的参数
- [IM SDK] onError 回调增加 error message

## 版本：v3.2.1 2020-07-28

- [IM SDK] 修改创建聊天室 api，不需要传 owner 参数
- [demo] 修复小程序收到好友申请，如果发起方不在线，那么收到方拒绝后发起方收不到回调
- [demo] 修复 iOS 小程序在音视频会议后，发送单聊消息不显示，必须退出单聊窗口再进入才会显示
- [demo] 修复小程序音视频通话过程中关闭美颜，美颜图标和字体，只有字体置灰
- [demo] 增加小程序音视频时显示时长

## 版本：v3.2.0 2020-07-09

- [IM SDK] 增加创建聊天室、查询\修改聊天室详情、查询\设置\移除管理员
- [IM SDK] 修复对消息扩展类型解析错误
- [IM SDK] 修复发送图片、文件消息时，直接发送 url 时下载不成功
- [IM SDK] 修改对于被禁言、拉黑等导致的发送消息失败，将从 fail 回调出去，不再从全局的 onError 回调

## 版本：v3.1.6 2020-07-03

- [音视频 SDK] 增加 joinRoom API
- [demo] 部分机型在视频会议时被来电打断后，无法继续推拉流，此时自动退出会议。

## 版本：v3.1.4 2020-06-11

- [IM SDK] 支持附件下载重定向
- [IM SDK] 支持图片检测违规抛出单独的异常
- [IM SDK] 增加分页获取聊天室成员 api
- [IM SDK] 修复收消息有延迟情况
- [音视频 SDK] 增加断网重连

## 版本：v3.1.2 2020-05-14

- [IM SDK] 增加上传修改群/聊天室公告、获取群/聊天室公告、上传/下载/删除群/聊天室文件、获取群/聊天室文件列表, 增加上传修改群/聊天室公告、获取群/聊天室公告、上传/下载/删除群/聊天室文件、获取群/聊天室文件列表
- [IM SDK] 修改重连间隔
- [IM SDK] 去掉对上传文件大小的限制, 由服务端来限制
- [IM SDK] 修复拉历史消息 bug
- [IM SDK] 修复自定义消息没有 time

## 版本：v3.1.1 2020-04-28

- [demo] 适配 v3.1.1 IM SDK
- [IM SDK] 更新私有协议, 与 web 端统一
- [IM SDK] 增加漫游消息 api
- [IM SDK] 增加聊天室禁言、解除禁言、获取禁言列表、加入黑名单、移除黑名单、获取黑明单列表等 api
- [IM SDK] 增加聊天室、群组一键禁言、白名单等 api
- [IM SDK] 增加发送自定义消息
- [IM SDK] 增加群组回执
- [音视频 SDK] 兼容 v3.1.1 IM SDK
- [音视频 SDK] 增加关闭摄像头的回调事件
- [音视频 SDK] 修复不能销毁会议

## 版本：v1.3.1 2020-02-16

- [demo] 调整音视频最大码率为 300

## 版本：v1.3.0 2020-02-10

- [demo] 增加音视频会议功能。
- [sdk] 增加音视频 SDK src/emedia/emedia_for_miniProgram.js。

## 版本：v1.2.0 2019-06-24

- [demo] 增加消息状态，比如断网时发的消息显示失败。
- [demo] 增加 socket 连接成功的提示。
- [demo] 修改了语音消息播放时再下载。
- [demo] 修复聊天页面切后台，再切前台收到的离线消息有重复。
- [demo] 由 rest1 迁移到 rest2 后开始校验 token,导致附件消息收不到。
- [demo] 语音发送成功后点击听取后，语音依然闪烁动画。
- [demo] 联系人分类为#，显示问题。
- [sdk] 增加 onSocketConnected 事件 – socket 连接成功。
- [sdk] onError 增加 type='sendMsgError' - 发送消息失败。
- [sdk] sdk 重连时关闭上次创建的的 socket，而不是所有的 socket。

## 版本：v1.1.1 2019-04-10

- [sdk] 增加重连机制
- [demo] 实时更新联系人列表
- [bug] 修复进入群组时，群组名称错误
- [bug] 修复可以同时播放多条语音
- [bug] 群组聊天页显示问题

## 版本：v1.1.0 2019-03-22

- [sdk] [demo] 增加 token 登录
- [demo] 新版 demo，修改 ui
- [demo] 增加搜索功能
- [demo] 增加联系人按字母排序
- [demo] 增加最近聊天按时间排序
- [demo] 增加群组消息提醒
- [demo] 增加测滑删除功能
- [demo] 增加聊天历史分页
- [demo] 增加用户名不区分大小写
- [demo] 增加接收文件消息提示
- [demo] 适配 iphone X，以及 XS max 等机型
- [demo] 主页面由联系人页改为聊天页
- [bug] 修改 A 给好友 B 发语音消息，B 没有显示语音的未读消息数
- [bug] iOS 聊天界点击输入框进行输入时历史消息展示不合理
- [bug] iOS 端小程序收到消息时，会话界面来消息的提醒有时会没有提醒，只显示消息数
- [bug] 语音消息时长为 0

## 版本：v1.0.5 2018-09-12

新功能：

- [sdk]开放注册
- [sdk]登录
- [sdk]退出登录
- [sdk]监听 IM 链接状态
- [sdk]消息发送（文字、图片、语音等）
- [sdk]接收消息
- [sdk]获取用户会话和聊天记录
- [sdk]添加好友
- [sdk]删除好友
- [sdk]同意添加好友请求
- [sdk]拒绝添加好友请求
- [sdk]获取用户好友列表
- [sdk]收发群组消息
- [sdk]创建群组
- [sdk]添加群组成员
- [sdk]退出群组
- [sdk]解散群组
- [sdk]获取完整的群成员列表
- [sdk]获取群组列表
- [sdk]获取群组详情
- [demo]获取未读消息数
- [demo]用户未读消息数清空
- [demo]清空用户会话和聊天记录
