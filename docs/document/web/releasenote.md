# Web IM SDK 更新日志

<Toc />

## 版本 V4.6.0 Dev 2024-04-02（开发版）

### 新增特性

- [IM SDK] 新增[置顶消息功能](message_pin.html)。
  - `pinMessage`: 置顶消息。
  - `unpinMessage`: 取消置顶消息。
  - `getServerPinnedMessages`：从服务器获取指定会话的置顶消息。
  - `onMessagePinEvent`: 当用户在群组或聊天室会话进行置顶操作时，群组或聊天室中的其他成员会收到该回调。
- [IM SDK] 消息修改回调 `onModifiedMessage` 中支持返回通过 RESTful API 修改的自定义消息。
- [IM SDK] 加入聊天室时，除了要从服务器获取聊天室 ID 之外，支持用户直接传入聊天室 ID。你可以决定传入的聊天室 ID 不存在时是否要自动创建聊天室。
- [IM SDK] 支持获取聊天室漫游消息。

### 优化

- [IM SDK] 优化 Token 登录时的错误提示信息，使错误提示更精细。

### 修复

- [IM SDK] 修复消息 `onlineState` 状态错误问题。

## 版本 V4.5.1 Dev 2024-02-22（开发版）

### 优化

- [IM SDK] 统一消息附件的 URL 格式。

## 版本 V4.5.0 Dev 2024-01-30（开发版）

### 新增特性

- [IM SDK] 聊天室和群组成员进出事件增加成员人数 `memberCount` 字段。
- [IM SDK] 新增 [deleteAllMessagesAndConversations](message_delete.html#清空聊天记录) 方法，用于清空当前用户的聊天记录，包括消息和会话。
- [IM SDK] 新增 [getSelfIdsOnOtherPlatform](multi_device.html#获取当前用户的其他登录设备的登录-id-列表) 方法，可以获取当前用户其他登录设备的登录 ID 列表，实现对指定设备发送消息。
- [IM SDK] 新增 [useReplacedMessageContents](message_send_receive.html#发送文本消息) 开关。开启后，发送消息时如果被内容审核进行了内容替换，发送方可以获取替换后的内容。

### 优化

- [IM SDK] Web 本地数据库移除非必要唯一字段。
- [IM SDK] 格式化会话列表中最近一条自定义消息的 `customExts` 字段。
- [IM SDK] 重复拉消息问题。

### 修复

- [IM SDK] 修复 `onMessage` 回调消息顺序异常问题。
- [IM SDK] 修复 vite electron 引入 MiniCore 插件报错。
- [IM SDK] 修复 H5 引入微信 SDK 后，`updateOwnUserInfo` API 请求参数异常问题。

## 版本 V4.4.0 Dev 2023-12-22（开发版）

### 新增特性

- [IM SDK] 新增[会话标记功能](conversation_mark.html)。
  - `addConversationMark`：[标记会话](conversation_mark.html#标记会话)。
  - `removeConversationMark`：[取消标记会话](conversation_mark.html#取消标记会话)。
  - `getServerConversationsByFilter`：[根据会话标记从服务器分页查询会话列表](conversation_mark.html#根据会话标记从服务器分页查询会话列表)。
  - `onMultiDeviceEvent#markConversation/unMarkConversation`：[多设备场景下的会话标记事件](multi_device.html#实现方法)。当前用户在一台登录设备上更新了会话标记，包括添加和移除会话标记，其他登录设备会收到该事件。
- [IM SDK] 增加 `onMessage` 回调。在收到文本、图片、视频、语音、地理位置和文件等消息时，批量将消息回调给应用。
- [IM SDK] 视频类型消息增加视频首帧缩略图, 通过 `videoMessage.thumb` 访问。

### 修复

- [IM SDK] SDK 类型修正。
- [IM SDK] vite 引入 MiniCore SDK 报错。
- [IM SDK] 优化附件类型消息发送时的附件上传，支持分片上传。

## 版本 V4.3.1 Dev 2023-12-13

### 新增特性

- [IM SDK] [发送消息方法 `Send`](message_send_receive.html#发送文本消息) 的成功回调参数 `SendMsgResult` 中新增 `message` 字段，用于返回成功发送的消息对象。
- [IM SDK] MiniCore SDK 增加 logger 实例。

### 优化

- [IM SDK] 优化部分机型断网后 SDK 重连慢的问题。

### 修复

- [IM SDK] 修复 `isInGroupMutelist` API 调用时出现 404 的问题。

## 版本 V4.3.0 Dev 2023-11-17

### 新增特性

- [IM SDK] 新增[设置好友备注功能](user_relationship.html#设置好友备注)。
- [IM SDK] 新增 `getAllContacts` 和 `getContactsWithCursor` 方法分别用于[从服务器一次性和分页获取好友列表](user_relationship.html#获取好友列表)，其中每个好友对象包含好友的用户 ID 和好友备注。
- [IM SDK] 消息结构新增 `broadcast` 字段, 用于判断该消息是否为聊天室全局广播消息。可通过[调用 REST API 发送聊天室全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。

### 优化

- [IM SDK] Token 登录增加即将过期及已过期的回调，即 Token 已过期或有效期过半时也触发 `onTokenExpired` 和 `onTokenWillExpire` 回调。

### 修复

- [IM SDK] 修复会话列表最后一条消息中获取不到 `reaction` 的问题。

## 版本 V4.2.1 Dev 2023-09-27

### 新增特性

- [IM SDK] 新增 `LocalCache` 模块[实现本地会话数据管理](conversation_local.html)。
- [IM SDK] 用户申请加群被拒绝的回调 `joinPublicGroupDeclined` 中增加申请人的用户 ID。

## 版本 V4.2.0 Dev 2023-07-27

### 新增特性

- [IM SDK] 新增[合并转发消息功能](message_send_receive.html#发送合并消息)。
- [IM SDK] 新增[消息修改功能](message_modify.html)。

### 修复

修复发送不必要的消息送达回执的问题。

## 版本 V4.1.7 Dev 2023-06-08

### 新增特性

1. 新增 `pinConversation` 方法实现[会话置顶和取消置顶](conversation_pin.html#置顶会话)。
2. 新增 `getServerPinnedConversations` 方法[分页获取服务器端的置顶会话列表](conversation_pin.html#获取服务端的置顶会话列表)。
3. 新增 `getServerConversations` 方法[分页获取排序后的服务端会话列表](conversation_list.html#从服务器分页获取会话列表)。原接口 `getConversationlist` 已废弃。
4. 新增[在群组或聊天室会话中发送定向消息](message_send_receive.html#发送定向消息)。通过在构建消息的方法 `create` 中添加 `receiverList` 参数实现该特性。
5. 在从服务器获取历史消息的方法 `getHistoryMessages` 的返回数据中新增 `isLast` 字段表示返回的是否为最后一页数据。
6. 在构建图片消息的方法 `create` 中新增 [`thumbnailWidth` 和 `thumbnailHeight`](message_send_receive.html#发送图片消息) 参数用于设置缩略图的宽度和高度。
7. 新增以下 SDK 登录失败原因，在控制台上提示：
 - [错误码 50，MAX_LIMIT](error.html)：新增应用的日活跃用户数（DAU）超限、在线用户数量超限和月活跃用户数（MAU）超限错误提示。
 - [错误码 2， WEBIM_CONNCTION_AUTH_ERROR](error.html) ：新增 Token 无效提示。
8. 以下[好友管理方法](user_relationship.html)增加执行成功和失败的回调（Promise）：
 - addContact：添加好友。
 - deleteContact：删除好友。
 - acceptContactInvite：接受好友邀请。
 - declineContactInvite：拒绝好友邀请。
 - addUsersToBlocklist：将好友添加至黑名单。
 - removeUserFromBlocklist：将好友移出黑名单。

## 版本 V4.1.6 Dev 2023-04-17

### 新增特性

- [IM SDK] 新增 `searchOptions` 参数对象（包含 `from`、`msgTypes`、`startTime` 和 `endTime` 参数），允许用户调用 `getHistoryMessages` 方法时[按消息发送方、消息类型或时间段从服务端拉取历史消息](message_retrieve.html#从服务器获取指定会话的消息)。
- [IM SDK] 新增错误码 511，即 MESSAGE_SIZE_LIMIT，若[消息体大小超过限制](message_overview.html#消息类型)时提示用户。

## 版本 V4.1.4 Dev 2023-03-16

### 新增特性

- [IM SDK] 新增 [群成员自定义属性功能](group_members.html#管理群成员自定义属性)并增加[自定义属性更新事件](group_manage.html#监听群组事件)实现群成员设置和获取在群组中的昵称和头像等属性。
- [IM SDK] 在消息创建参数中新增 `deliverOnlineOnly` 字段实现发消息只投递给在线用户。若开启了该功能，用户离线时消息不投递。
- [IM Demo] 新增群成员昵称修改与展示功能。 

### 优化

[IM SDK] 优化聊天室进入和退出实现，提升性能。

### 修复

- [IM SDK] 修复 TypeScript 代码的一些类型错误。
- [IM SDK] 修复 `getHistoryMessages` 方法无法捕获错误的问题。

## 版本 V4.1.3 Dev 2023-02-21

#### 新增特性

- [IM SDK] 在 `getConversationlist` 方法中新增分页参数 `pageNum` 和 `pageSize`，支持[分页方法获取会话列表](conversation_list.html#从服务器分页获取会话列表)。
- [IM SDK] 新增[群组创建事件 `create`](group_manage.html#监听群组事件)。群组创建后，群主的其他设备会收到该事件。

#### 优化

- [IM SDK] 缩减 MiniCore 的大小。
- [IM SDK] 优化重连逻辑。

#### 修复

- [IM SDK] 修复 TypeScript 代码的一些类型错误。
- [IM SDK] 修复 `getConversationlist` 方法的返回值缺少 `customExts` 字段的问题。
- [IM SDK] 修复设置 `useOwnUploadFun` 允许用户自己上传图片时图片消息中的 `size` 字段不生效的问题。

## 版本 V4.1.2 Dev 2022-11-08

### 新增特性

- [IM SDK] [创建群组方法 `createGroup`](group_manage.html#创建群组) 和[修改群信息方法 `modifyGroup`](group_attributes.html#修改群组名称和描述) 新增 `ext` 字段支持群扩展信息。
- [IM SDK] 群组通知事件增加[群组信息修改事件 `updateInfo`](group_manage.html#监听群组事件)。
- [IM SDK] 新增[聊天室消息优先级](message_send_receive.html)。
- [IM SDK] 支持同时[对多个群组成员禁言和解除禁言](group_members.html#管理群组禁言)。

### 优化

[IM SDK] 优化断网导致的消息发送失败时调用的回调。

### 修复

[IM SDK] 修复调用 `create` 方法创建附件消息时 `file_length` 参数不生效的问题。

## 版本 V4.1.1 Dev 2022-9-26

### 优化

- [IM SDK] [miniCore](overview.html#引入SDK) 支持配置私有化配置。
- 优化重连逻辑。

### 修复

- [IM SDK] 修复聊天室自定义属性功能中的问题；
- [IM SDK] 修复 `miniCore` 中的 `uploadFile` 方法中的问题。

## 版本 V4.1.0 Dev 2022-9-16

### 新增特性

- [IM SDK] 新增[聊天室自定义属性功能](room_attributes.html)。
- [IM SDK] 新增 `onLog` 方法，实现用户日志回调。
- [IM SDK] `getJoinedGroups` 方法中新增 `needAffiliations` 和 `needRole` 参数支持获取群组成员数和用户自己的角色。

### 优化

- [IM SDK] SDK 模块化拆分。
- [IM SDK] 移除废弃的方法 (`subscribe`、`subscribed`、`unsubscribed`、`removeRoster`、`getRoster`、`callback: onRoster`、`onMutedMessage`、`onCreateGroup` 和 `onBlacklistUpdate`)。

### 修复

- [IM SDK] 修复上传文件失败没有触发回调的问题。
- [IM SDK] 修复 IE 浏览器的兼容性问题。
- [IM SDK] 修复 IM Uniapp 在手机上运行时上报 `addEventListener` 方法相关错误的问题。

## 版本 V4.0.9 2022-7-29

### 新增特性

- [IM SDK] 增加灾备策略。
- [IM SDK] SDK 内部在群组聊天室部分 API 请求时增加 `resourceId`，增加操作的多设备通知提醒。

### 优化

- [IM SDK] 优化协议，减少数据量。
- [IM SDK] 修复某些情况下消息延迟。

## 版本 V4.0.8 2022-6-17

### 新增特性

- [IM SDK] 新增群组事件回调 [onGroupEvent](https://doc.easemob.com/jsdoc/interfaces/Types.EventHandlerType.EventHandlerType.html#onGroupEvent) 和聊天室事件回调 [onChatroomEvent](https://doc.easemob.com/jsdoc/interfaces/Types.EventHandlerType.EventHandlerType.html#onChatroomEvent)。原回调可继续使用；
- [IM SDK] 新增群聊消息限流错误码 [MESSAGE_CURRENT_LIMITING](error.html)
- [IM SDK] 邀请加入群聊回调 onGroupChange 返回中新增 群名称 参数值。

### 优化

- [IM SDK] 支持批量查询群组详情 [getGroupInfo](group_manage.html#获取群组详情信息)。
- [IM SDK] 优化黑名单和白名单相关的方法名。
  - 白名单相关的方法名中的 `Whitelist` 修改为 `Allowlist`，如 `getGroupWhitelist` 修改为 `getGroupAllowlist`；
  - 黑名单相关的方法名中的 `Blacklist` 修改为 `Blocklist`，如 `getGroupBlacklist` 修改为 `getGroupBlocklist`。

## 版本 V4.0.7 2022-5-25

### 新增特性:

- [IM SDK] 新增消息子区（message thread）功能；
- [IM SDK] 新增 [getConversationlist](conversation_list.html#从服务器分页获取会话列表) 方法解析会话中的最新一条消息；

### 优化：

- [IM SDK] 消息事件监听器中新增 onlineState 字段标记消息的在线状态。

## 版本 V4.0.5 2022-5-16

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

## 版本 V4.0.4 2022-4-19

:::tip
仅 V4.0.4 及以下版本支持私有化部署。
:::

### 新增特性:

- [IM SDK] 增加 [用户在线状态(Presence)](presence.html) 订阅功能。
- [IM SDK] [翻译功能](message_translation.html)：增加自动翻译接口。实现用户按需翻译和发消息自动翻译。

### 优化：

- [IM SDK] 小程序不需要 isHttpDNS 参数。

### 修复：

- [IM SDK] 修复 Uni_SDK 无法运行到浏览器问题。
- [IM SDK] 修复创建群组时无法修改群简介问题。
- [IM SDK] 修复 SSR 兼容性。

## 版本：v4.0.3 2022-1-19

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

- [多人音视频] 实现默认使用 dns config
- [多人音视频] 修复 1v1 通话没有挂断原因
- [多人音视频] 修复 eletron 共享桌面显示不正常的问题
- [多人音视频] 修复 退出会议，会提示别人退出
- [多人音视频] 修复 Android 手机微信内，切换 4g, 画面卡住的问题
- [多人音视频] 修复 偶现共享桌面无法显示的问题
- [多人音视频] 支持共享桌面 点击【停止共享】按钮
- [多人音视频] 修复手机切换摄像头不生效的问题
- [多人音视频] 修复 web 端发布流传入选中设备的 deviceId 不生效的问题

## 版本：v3.4.0 2020-12-10

- [IM SDK] 增加移动端上传推送 token api
- [IM SDK] 撤回消息、已读消息增加 from、to 字段
- [IM SDK] CMD、自定义消息增加 type 字段
- [IM SDK] 修复 ie 中兼容问题

## 版本：v3.3.2 2020-10-19

- [IM SDK] 增加支持设置固定 deviceId
- [IM SDK] 修改 getGroup 方法去掉 apiUrl 参数
- [IM SDK] 修复拉历史消息 bug
- [IM SDK] 修复发送附件消息对 3.3.0 之前 api 的兼容问题

## 版本：v3.3.0 2020-09-16

- [IM SDK] 增加支持 promise
- [IM SDK] 增加 onContactInvited、onContactDeleted、onContactAdded、onContactRefuse、onContactAgreed 好友相关的回调
- [IM SDK] 增加 addContact、deleteContact、acceptInvitation、declineInvitation 代替原 subscribe、removeRoster、subscribed、unsubscribed 好友操作 API
- [IM SDK] 修改默认的 resource，以便区分 web 端和小程序端的用户
- [IM SDK] 修改 getChatRooms 获取聊天室 API，去掉 apiUrl 参数
- [IM SDK] 修改 构造 cmd 消息 API, 去掉 msg 参数
- [IM SDK] 优化构造消息 API，使用 chatType 来区分消息类型（单聊/群聊/聊天室）
- [IM SDK] 修复发送位置消息成功后并不执行 success 回调
- [IM SDK] 增加容错处理

## 版本：v3.2.2 2020-08-25

- [IM SDK] 创建群组时增加被邀请人是否需要同意的参数
- [IM SDK] 修复头条小程序消息延迟
- [IM SDK] onError 回调增加 error message
- [IM SDK] 修改附件消息重定向
- [IM SDK] 支持 vue-ssr-renderer 服务端渲染
- [多人音视频] 支持会议中质量监控上报功能
- [多人音视频] 支持会议中视频的弱网和断网状态监听
- [多人音视频] 支持多集群部署文件 RTCConfig URL 可指定
- [多人音视频] 修复多人会议，发布视频流的时候，无麦克风，视频也发布不成功
- [多人音视频] 修复创建会议后，全体静音不生效
- [单人音视频] 支持通话过程中，对一端断网的监听

## 版本：v3.2.1 2020-07-28

- [多人音视频] 共享桌面 API 支持 chrome 72 以上不再依赖插件
- [多人音视频] 增加 多路推流 API
- [多人音视频] 支持纯音频推流 CDN
- [多人音视频] 修复授权 API 在 IM 内无法使用
- [多人音视频] 修复 1 对 1 视频通话 先呼叫一个不在线的人员，再呼叫其他人员失败
- [单人音视频] 增加呼叫推送功能
- [IM SDK] 修改创建聊天室 api，不需要传 owner 参数
- [IM SDK] 增加日志采集功能

## 版本：v3.2.0 2020-07-09

- [IM SDK] 增加创建聊天室、查询\修改聊天室详情、查询\设置\移除管理员
- [IM SDK] 修复对消息扩展类型解析错误
- [IM SDK] 修复发送图片、文件消息时，直接发送 url 时下载不成功
- [IM SDK] 修改对于被禁言、拉黑等导致的发送消息失败，将从 fail 回调出去，不再从全局的 onError 回调
- [多人音视频] 增加通过 joinRoom 创建房间时，可配置支持小程序

## 版本：v3.1.5 2020-06-23

- [多人音视频] 增加创建会议支持自定义共享桌面个数
- [多人音视频] 修复了 safari 浏览器的兼容性问题
- [多人音视频] 支持 electorn 共享桌面

## 版本：v3.1.4 2020-06-11

- [IM SDK] 支持附件下载重定向
- [IM SDK] 支持图片检测违规抛出单独的异常
- [IM SDK] 增加分页获取聊天室成员 api

## 版本：v3.1.2 2020-05-14

- [IM SDK] 增加上传修改群/聊天室公告、获取群/聊天室公告、上传/下载/删除群/聊天室文件、获取群/聊天室文件列表 APIs
- [IM SDK] 修改重连间隔
- [IM SDK] 去掉对上传文件大小的限制, 由服务端来限制
- [IM SDK] 增加聊天室禁言、解除禁言、获取禁言列表、加入黑名单、移除黑名单、获取黑明单列表 APIs
- [多人音视频] 增加上麦申请/下麦降级/申请主持人/全体静音/全体解除静音/静音个人/解除静音个人 APIs
- [多人音视频] 增加了支持多集群部署 API
- [多人音视频] 增加了 推流 CDN/更新推流布局 APIs
- [多人音视频] 修复了引入 webrtc 报错 regenerator-runtime

## 版本：v3.1.0 2020-04-20

- [多人音视频] joinRoom API 通过 appkey 拼接 URL

## 版本：v3.0.10 2020-03-28

- [sdk] 支持一键禁言、白名单等群/聊天室的操作
- [sdk] 支持发自定义消息
- [sdk] 消息体里增加 ContentsType，来表示消息类型
- [sdk] 修复扩展消息不能使用 number 类型数据
- [sdk] 登录接口的'Content-type'改为'application/json'
- [sdk] 修复回复多余回执导致堵塞的情况
- [sdk] 修复 dnsconfig 配置问题
- [多人音视频] 增加添加加入房间 API joinRoom
- [多人音视频] 增加管理员变更回调 onAdminChanged
- [多人音视频] 增加会议属性相关 API
- [多人音视频] 定义视频流类型 StreamType
- [多人音视频] 添加共享桌面 ‘停止共享’ 回调函数 option.stopSharedCallback

## 版本：v3.0.7 2019-12-31

- [sdk] https 下增加 dns 配置
- [sdk] 增加群组回执
- [sdk] 修复 resource 错误等 bug

## 版本：v3.0.6 2019-09-20

- [sdk] 音视频增加录制、合并设置
- [sdk] sdk 增加消息去重机制
- [sdk] 回调消息增加时间戳

## 版本：v3.0.5 2019-08-22

- [sdk] 简化好友添加和移除黑名单方法
- [sdk] 扩展消息支持 json 对象
- [sdk] 退出不执行 onclose
- [sdk] Electron 下不能建立链接问题

## 版本：v3.0.4 2019-07-25

### Bug 修复：

- [sdk] 扩展消息 bug
- [sdk] 群组类消息撤回 bug
- [sdk] 优化历史消息
- [sdk] 发送语音消息、视频消息回调 bug

## 版本：v3.0.2 2019-07-09

### 新功能：

- [sdk] dns 下上传文件走 dns

### Bug 修复：

- [sdk] 无法拉取历史消息
- [sdk] loc/cmd 消息 messageId bug

## 版本：v3.0.0 2019-06-29

### 新功能：

- [sdk] 基于私有协议重写
- [sdk] 增加拉取历史消息接口
- [sdk] 增加撤回消息接口
- [sdk] 增加接受群邀请接口
- [demo] 增加接受群邀请功能
- [demo] 增加和调整一些群操作通知

### Bug 修复：

- [demo] 修复音视频通话时显示名称不对
- [demo] 加入群组群组列表不实时更新
- [demo] 用户名大写导致群组中无法识别人管理员

## 版本：v1.11.1 2019-03-18

### 新功能：

- [sdk] 通过设置 isHttpDNS 为 true，从服务端获取 DNS 配置文件，SDK 中改进自动重连的功能
- [demo] 配置文件文件增加配置 isHttpDNS
- [demo] 项目初始化 sdk 增加 isHttpDNS
- [demo] 解决 safari 视频无图片、无声音问题

## 版本：v1.10.0 2018-09-17

### 新功能：

- [demo] 多人音视频

### Bug 修复：

- [demo] 在视频界面中，切到其他界面，视频界面不在了。但是视频还在继续中
- [demo] 火狐 邀请 chrome， 进入多人会议，都收不到视频通知
- [demo] 不选择会话，收不到视频来电
- [demo] 多人视频 开关视频键状态不对
- [demo] chrome 和 firfox 多人音视频会议中，chrome 不显示 firefox 用户的视频
- [demo] 多人视频，一个浏览器登录两个账号，有一个账号 ui 经常收不到视频邀请

## 版本：v1.6.0 2018-01-29

### 新功能：

- [demo] 多人音视频
- [sdk] 多人音视频

### Bug 修复：

- [demo] 无法发送表情

## 版本：v1.5.0 2017-11-17

### 新功能：

- [demo] 添加 Rest Interface 的 Test case
- [demo] sdk/demo 上传功能兼容 ie8

### Bug 修复：

- [demo] 多设备登录异常
- [demo] 新建需要审批的公有群，加入必须有审批流程
- [demo] 鼠标悬浮在群禁言图标上出现提示信息“禁言”
- [demo] demo.html 中从 cdn 引入 sdk
- [demo] 修复无法准确统计离线消息数的 bug
- [demo] window.history.pushState 在 windows 的 chrome 上有兼容性问题，统一改成 window.location.href
- [demo] window.location.href = xxxx，如果修改的是 href.search 参数(?a=x&b=y)时候, 如果遇到 file 方式打开本地 index.html 会直接跳转页面，造成登录一直不成功，改成修改 href.hash 参数(#a=x&b=y)
- [demo] 将群管理员可操作的项目展示给管理员

## 版本：v1.4.13 2017-09-12

### 新功能：

- [sdk] 新增 jsdoc

### Bug 修复：

- [sdk] ios(8.1)webview 已读和已送到回执异常
- [sdk] 多设备登录异常
- [demo] 多设备登录异常

## 版本：v1.4.12 2017-07-17

### 新功能：

- [sdk] 修改 delivery ack 和 read ack 的格式
- [sdk] 用户在离线状态下发送消息，会自动重连并将未成功发送的消息发送出去
- [sdk] WEBIM 支持多设备，添加加入聊天室事件
- [sdk] 给 delivered 和 ack 加上 from 字段
- [demo] 添加 Rest Interface 的 Test case
- [demo] sdk/demo 上传功能兼容 ie8

### Bug 修复：

- [sdk] 提升 ie8 的兼容性
- [sdk] 自己发送的消息的已读 ack，不再发送给自己
- [demo] 新建需要审批的公有群，加入必须有审批流程
- [demo] 鼠标悬浮在群禁言图标上出现提示信息“禁言”
- [demo] demo.html 中从 cdn 引入 sdk
- [demo] 修复无法准确统计离线消息数的 bug
- [demo] window.history.pushState 在 windows 的 chrome 上有兼容性问题，统一改成 window.location.href
- [demo] window.location.href = xxxx，如果修改的是 href.search 参数(?a=x&b=y)时候, 如果遇到 file 方式打开本地 index.html 会直接跳转页面，造成登录一直不成功，改成修改 href.hash 参数(#a=x&b=y)
- [demo] 将群管理员可操作的项目展示给管理员

## 版本：v1.4.11 2017-06-14

### 新功能：

- [sdk] debug.js 融合到 sdk 当中，优化日志内容输出
- [sdk] 通过 Rest 屏蔽群组
- [sdk] 通过 Rest 发出入群申请
- [sdk] 通过 Rest 获取群组列表
- [sdk] 通过 Rest 根据 groupid 获取群组详情
- [sdk] 通过 Rest 列出某用户所加入的所有群组
- [sdk] 通过 Rest 列出群组的所有成员
- [sdk] 通过 Rest 禁止群用户发言
- [sdk] 通过 Rest 取消对用户禁言的禁止
- [sdk] 通过 Rest 获取群组下所有管理员
- [sdk] 通过 Rest 获取群组下所有被禁言成员
- [sdk] 通过 Rest 设置群管理员
- [sdk] 通过 Rest 取消群管理员
- [sdk] 通过 Rest 同意用户加入群
- [sdk] 通过 Rest 拒绝用户加入群
- [sdk] 通过 Rest 添加用户至群组黑名单（单个）
- [sdk] 通过 Rest 添加用户至群组黑名单（批量）
- [sdk] 通过 Rest 将用户从群黑名单移除（单个）
- [sdk] 通过 Rest 将用户从群黑名单移除（批量）
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

### Bug 修复：

- [sdk] 添加好友会产生多余的订阅消息
- [sdk] 频繁的发送消息会导致消息 id 重复的问题
- [sdk] 适配 SDK 发送文件和图片的大小
- [demo] 优化 sdk/demo.html，修复某些依赖文件找不到的问题
- [demo] 修复离线消息数量统计不准确问题

## 版本：v1.4.10 2017-02-16

### 新功能：

- [sdk] webrtc 新增语音呼叫

## Bug 修复：

- [sdk] webrtc:Firefox 在结束通话后的问题
- [sdk] webrtc:多次接通挂断之后,逻辑功能混乱
- [sdk] webrtc:正常挂断不应该提醒 offline
- [sdk] webrtc:重连后无法处理音视频 IQ 消息

## 版本：v1.4.9 2017-01-20

### Bug 修复：

- [sdk] 成功/失败的回调函数如果没有定义会报错

## 版本：V1.4.8 2017-01-03

### 新功能：

- [demo] 增加 webrtc 视频聊天的声音开关
- [demo] 动态创建 chatWindow，提高网页性能
- [demo] 切换 leftbar 时会给 chatWindow 添加遮罩，返回之前的 leftbar 时会直接跳到之前选中的 cate 和 chatWindow
- [demo] 登录成功后，刷新页面不会再回到登录页

### Bug 修复：

- [sdk] 移除 sdk 中所有 log 方法
- [sdk] 退出 muc group room 时，追加发送一条 unavailable 的 presence stanza

## 版本：V1.4.7 2016-12-21

### 新功能：

- [demo] 在 demo.html 中新增视频聊天及发送视频文件的功能

### Bug 修复：

- [sdk] 解决在手机浏览器在后台运行时无法断线重连的问题
- [demo] WebIM 建群，等待后台建群成功后再拉取群信息并更新 UI 中的群列表
- [demo] WebIM 群加人，群主和被添加的群成员均可以收到通知
- [demo] WebIM 群主将群成员从黑名单移除后，不再回到群成员列表中，而直接被删除

## 版本：V1.4.6 2016-12-20

### 新功能：

- [sdk] 新增 demo.html, 演示如何调用 sdk 的各种接口

### Bug 修复：

- [demo] 创建群组成功之后，立即刷新群组列表，不再等 1 秒
- [sdk] sdk 与上层 Demo 解耦，删除 Demo 相关代码
- [sdk] 删除 server 不支持的 connection.prototype.createRoom

## 版本：V1.4.5 2016-12-01

### 新功能：

- GNU 风格的版本号命名格式: 主版本号.子版本号.修正版本号 (新版本规则的 1.4.5 = 旧版本规则的 1.1.4.5)
- [demo] 好友之间可以通过 webrtc 进行视频聊(仅支持 https + Webkit 浏览器)
- [demo] 支持同一账号最多 8 个标签页登录 isMultiLoginSessions:true
- [demo] http 访问加入 ip 策略功能,防止 DNS 劫持 isHttpDNS:true
- [sdk] 新增两种安装引用方式（具体引用方式，请参考 [集成方式](https://docs-im.easemob.com/im/web/intro/integration)）
  - 添加 `<script>` 标签，并通过 WebIM 命名空间访问 websdk
  - NPM（websdk 已经发布到 NPM），先 require，再访问 WebIM

### Bug 修复：

- [sdk] 解散群组不更新 UI
- [sdk] 修复了发送 cmd 消息成功后无法调用回调函数的 bug

## 版本：V1.1.3 2016-11-01

### 功能改进：

- [demo] 支持 Windows SDK。[https://www.easemob.com/download/im](https://www.easemob.com/download/im)
- [demo] 新增黑名单功能。
- [demo] 获取聊天室列表: 支持分页、下拉刷新，新增以下 2 个参数：pagenum 和 pagesize。
- [demo] 群组增加以下功能：创建群组、修改群组名称、修改群组简介、群组成员管理、加入公开群。
- [sdk] strophe 从 v1.2.2 升级到 v1.2.8，在生产模式使用 strophe-1.2.8.min.js， 在开发模式使用 strophe.js。
- [sdk] 支持自动重连: 在 webim.config.js 文件中新增相关参数 `autoReconnectNumMax` 和 `autoReconnectInterval`。

### Bug fixes:

- [demo] 增加 `babel-core/browser-polyfill.js`文件，修复了 IE 不支持 HTML5 elements 的 bug。
- [demo] 修复了有未读消息时点击联系人不生效的 bug。
- [sdk] 修复了 strophe.js v1.2.8 在 IE9 中使用 BOSH 会报错的 bug。 [https://github.com/strophe/strophejs/issues/213](https://github.com/strophe/strophejs/issues/213)
- [sdk] 修复了存在大量离线消息时收发消息延迟的 bug。客户端将发送 ack 应答消息的速度限制在 5 个/秒，不影响其他正常消息。
- [sdk] 将心跳消息从空 body 的 json message 切换为 ping/pong iq。前者会作为离线消息被 XMPP Server 缓存。

## 版本：V1.1.2 2016-8-12

### 功能改进：

- 新版 demo
- 添加 isAutoLogoin 参数，默认 setPresence
- 拆分 sdk 为四个文件，最终打包成一个 webim.im.sdk.js
- 增加 try catch，尽量减少因为外部的错误导致的连接断开
- 修改错误码，不再返回错误提示消息，在文档体现

### Bug fix：

- 无法传 file_length
- 特殊字符无法显示
- im 用户为数字时，toLowercase 报错
- 发送音频增加时长参数

## 版本：V1.1.1 2016-6-27

### 功能改进：

- 增加聊天室加入成功、失败回调
- 增加网络监测回调 onOnline、onOffline
- 处理 Web IM 与 Android/iOS SDK 3.x 和 2.x 的兼容性
- demo 新增发送文件功能
- 收到 AMR 自动转 MP3

### Bug fix：

- 修复心跳会创建多个 timer
- 联系人名称过长导致的样式问题
- IE9 发送附件失效
- IE9 添加好友报错

## 版本：V1.1.0 2016-4-6

### 功能改进：

- 将表情包移除 sdk，可导入自定义表情。
- 增加 XMPP 连接多 resource 支持的参数。
- 对于不支持 wss，如 qqX5 内核浏览器，自动降级为 https long polling。
- 增加聊天室功能。
- v1.1.0 与之前版本 sdk 部分 api 已不兼容，添加 shim.js，做降级支持。
- 新增消息发送的成功失败回调。
- 优化代码，修复退出时 websocket 报错。

## 版本：V1.0.7 2015-8-25

### 功能改进：

- 增加连接心跳支持，保持客户端连接不间断。
- 增加 XMPP 连接多 resource 支持。
- 实现 Web IM SDK Websocket 支持。
- 增加 Token 登录。
- 在 Demo 中对不支持异步上传的浏览器使用第三方插件（swfupload）提供支持。
- 对于不支持 audio 标签的浏览器，使用 jPlayer 解决无法播放语音的问题，但此方案当前只支持 MP3。
- 重整目录结构，SDK 相关文件在 sdk 文件夹内部；添加 easemob.im.config.js，只需配置此 js 里面相关字段即可。
- 改进 code，支持多环境快速调试。
- 支持 IE7、IE8、IE9（在 Demo 中，接收的音频消息只能播放 MP3 格式）。

## 版本：V1.0.5 2015-3-11

### 新功能：

- 优化底层连接，减少系统登录耗时。
- 添加透传消息支持（注册 onCmdMessage 事件，以监听服务器端推送的透传消息）。
- 添加收到消息后，自动发送回复消息给服务器。
- 当图片下载失败时默认再一次下载。

## 版本：V1.0.4.1 2015-1-15

### 新功能：

- 收到文件消息通知，暂不支持下载。
- 收到视频消息通知，暂不支持下载。

### Bug Fix：

- 修复 bug。修复不点击‘退出’按钮直接关闭浏览器下次登录消息丢失的 bug。

## 版本：V1.0.4 2014-12-17

### Bug Fix：

- 修复 bug。群聊位置消息作为单聊消息处理。
- 修改 bug。好友列表为空时陌生人消息不显示。

## 版本：V1.0.3 2014-12-11

### 新功能：

- 增加陌生人聊天功能。
- 添加新用户注册功能。
- 支持 https 访问模式。
- 支持 token 登录。
- 支持语音消息。
- 消息体支持自定义扩展,添加 ext 属性。
- Demo 示例支持未读消息提醒。

### 功能改进：

- 修复 bug。demo 联系人过多时的样式问题。
- 修复 bug。conn = new Easemob.im.Connection();变量名不为 conn 或者 conn 不是全局变量时接收不到消息。
- 修复 bug。群组离线消息当作陌生人消息处理。
- 修复 bug。IE 浏览器接受文本消息以换行符开始时会遮挡联系人名称。
- 修复 bug。在线用户被邀请加入群组不能实时显示，必须重新登录。
- 丰富相关文档内容。
