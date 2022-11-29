# Android IM SDK 更新日志

<Toc />

## 版本 V3.9.9 Dev 2022-11-29（开发版）

### 新增特性

新增[流量统计的功能](message_manage.html)。

### 修复

修复极端情况下 SDK 崩溃的问题。

## 版本 V3.9.8 Dev 2022-11-8（开发版）

### 新增特性

- [IM SDK] 新增[聊天室消息优先级](message_send_receive.html)。
- [IM SDK] 群组信息更新后的 `EMGroupChangeListener#onSpecificationChanged` 回调中添加更新后的群组信息。

### 优化

[IM Demo] 修改 `manifest` 中 `activity` 属性配置，在用户进行音视频通话时在最近任务管理器中显示当前应用。

### 修复

- [IM SDK] 修改 OPPO 推送导致 SDK 偶现 ANR 异常的问题。
- [IM CallKit] 修复发起语音通话时，若在对方接听前返回桌面，对方无法点击接听或挂断的问题。
- [IM UIKit] 修复部分机型拍照后的图片旋转问题。
- [IM SDK] 适配 Android 12，修复依赖环信即时通讯云 SDK 的 APK 在 Android 12 版本的部分手机上第一次安装后打开时出现异常弹框的问题。
- [IM SDK] 修复某些场景下调用 `updateMessage` 方法导致的缓存与数据库消息不一致问题。

## 版本 V3.9.7 Dev 2022-9-30（开发版）

### 新增特性

[IM SDK] 新增 `setAreaCode` 方法限制连接边缘节点的范围。

### 优化

[IM SDK] 优化通信协议，减少数据量。

### 修复

- [IM SDK] 修复数据统计不正确的问题。  
- [IM SDK] 修复极少数场景下打印日志导致崩溃的问题。    
- [IM SDK] 修复开启全链路加入（FPA）功能时导致崩溃的问题。
- [IM SDK] 修复聊天室自定义属性部分设置失败时，返回的错误码为字符串类型（修改为 Int 类型）的问题。

## 版本 V3.9.6.1 Dev 2022-9-21（开发版）

### 新增特性

新增 `getJoinedGroupsFromServer` 方法用于从服务器分页获取当前用户加入的群组。

### 优化

- [IM SDK] 优化聊天室自定义属性更新的回调方法 `onAttributesUpdate`，返回修改成功的聊天室自定义属性的集合。 
- [IM SDK] 优化聊天室自定义属性移除的回调方法 `onAttributesRemoved`，返回成功移除的聊天室自定义属性的 key 数组。
- [IMKit]  语音播放切换至媒体音量。

## 版本 V3.9.6 Dev 2022-9-16（开发版）

### 新增特性

- [IM SDK] 新增[聊天室自定义属性功能](room_attributes.html)。
- [IM SDK] 新增 `EMLogListener` 类，实现用户日志回调。

### 优化

- [IM SDK] 优化获取漫游消息的性能。
- [Demo] Demo 注册采用手机验证方式。
- [IMKit/CallKit] 优化 `isMainProcess` 方法，调用时无需获取 `GET_TASKS` 权限。

### 修复

- [IM SDK] 修复少数场景下，同步或拉取消息时消息量较大时收取失败的问题。 
- [Demo] 修复部分 Demo bug。

## 版本 V3.9.5 2022-8-2

### 新增特性:

- [IM SDK] 新增群组详情中群组禁用状态：[EMGroup#isDisabled()](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_group.html#acd072d7fc16e6ff89110173979ed318b) 属性，该属性需要开发者在服务端设置；
- [IM SDK] 优化遇到连接问题时更新接入点的策略，增强可用性；
- [IM SDK] [发送前回调](/document/server-side/callback.html#_1、发送前回调)：发送失败时返回给 app 用户的错误描述中增加你自定义的错误信息（即 [响应体参数](/document/server-side/callback.html#响应体参数) code 信息）。
- [IM SDK] 在 [EMError](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1_e_m_error.html) 中新增错误码 1101：[EMError#PRESENCE_CANNOT_SUBSCRIBE_YOURSELF](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1_e_m_error.html#abc9130b164d5cccb3559585ec38e8e99)，用来提示用户不能订阅自己的在线状态。

### 优化：

- [IM SDK] 优化登录过程，缩短登录时间；
- [IM SDK] 消息加密算法由 CBC 升级为 GCM；
- [IM SDK] SDK 的 Https 请求支持 TLS 1.3。

修复：

- [IM SDK] 修复 [EMConversation#getAllMessage](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conversation.html#a5482db46052c03f30de813e31ab607c1) 方法没有去重的问题；
- [IM SDK] 修复密码登录时偶现崩溃的问题。

## 版本 V3.9.4 2022-6-16

### 新增特性:

- [IM SDK] 在 [EMMessage](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_message.html#acda7d83054f842b5208496370a9decaa) 中添加 `isOnlineState` 字段，用来标记接收到的消息是否为离线消息。
- [IM SDK] 在 [EMError](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1_e_m_error.html#aa61ecbf9d24db24d0d852f6f631560f4) 类中添加错误码 509 `MESSAGE_CURRENT_LIMITING`，表示群聊消息已被限流。
- [IM SDK] 在 [EMPushManager](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_push_manager.html#a3c49e8245c25954b2cc1a13e93b57e0f) 中新增 `bindDeviceToken` 方法，用于绑定设备 Token。

### 优化：

- [IM SDK] 优化子区相关接口及属性；对比 3.9.3 版本，用 `EMChatThread` 替换 `EMChatThreadInfo`，`EMChatThreadEvent` 中用 `EMChatThread` 对象替换 Chat Thread 相关属性；
- [IM SDK] 群邀请回调 [EMGroupChangeListener#onInvitationReceived](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_group_change_listener.html#ab3591c00dc3f5b4138fa57073cc29589) 中新增 群名称（groupName） 参数值；
- [IM SDK] 移除平台层 CBC 及 ECB 加密算法；
- [IM SDK] 升级网络链路库；
- [IM SDK] 支持发送设置附件地址为远程地址的消息。

### 修复：

- [IM SDK] 修复获取 Reaction 对象时可能为空的问题；
- [IM SDK] 修复低版本手机加载数据库失败的问题。

## 版本 V3.9.3 2022-5-26

### 新增特性:

- [IM SDK] 新增 [消息子区（Message Thread）](thread_message.html)功能；

### 优化：

- [IM SDK] 优化网络链路，提升网络访问性能；
- [IM SDK] 优化[拉取漫游消息接口](message_retrieve.html)，增加指定拉取消息方向的参数。

## 版本 V3.9.2.1 2022-5-17

### 新增特性:

- [IM SDK] 新增 [消息 Reaction](reaction.html) 功能，可以对消息进行不同的响应；
- [IM SDK] 新增 [举报 API](moderation.html) 用于内容审核。

### 优化：

- [IM SDK] 优化获取服务器接入点 (dnsconfig) 的功能；
- [IM SDK] 优化数据上报功能；
- [IM SDK] 修改 libsqlcipher 的文件名，避免使用官方 AAR 时冲突；
- [IM SDK] EMMessage 类的 ext 属性增加 double、float 类型属性设置；
- [IM SDK] 依赖的 openssl 替换为 boringssl；
- [IM SDK] SDK 最低支持版本调整到 21(Android5.0)；
- [EaseCallKIt] 升级 Agora RTC SDK 版本到 3.6.2。

### 修复：

- [IM SDK] 修复 Google Play 上架时报的加密算法问题；
- [IM SDK] 修复 Translation API 失效的问题。

## 版本 V3.9.1.1 2022-4-27

### 修复

- [IM SDK] 修复偶发的拉取历史消息不能正常显示的问题。

## 版本 V3.9.1 2022-4-19

:::tip
仅 V3.9.1 及以下版本支持私有化部署。
:::

### 新增特性

- [IM SDK] 增加 [用户在线状态 (Presence) 订阅功能](presence.html)；

### 优化

- [IM SDK] 缩短发送消息超时时间。
- [IM SDK] DNS 服务器地址列表支持优先级设置，HTTP 和 TCP 请求重试时按 DNS 服务器地址的优先级发送请求，提升请求成功率。
- [IM SDK] IM SDK 所依赖的 OPPO 推送（版本 2.1.0 更新到 版本 3.0.0）和 vivo 推送（版本 2.3.1 更新到 版本 3.0.0.4_484）的 SDK 版本升级。

### 修复

- [IM SDK] 修复 PendingIntent 问题，移除 IM 在 Google Play 上架时的警告。

## 版本 V3.9.0 2022-2-22

### 新增特性

- [IM SDK] [EaseIMKIt] 增加 [单向删除服务端会话 API](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_manager.html#a345e81b9caf2658c8796855fe63fe752)；
- [IM SDK] Push 平台增加推送支持扩展字段获取、后续动作、角标设置、透传消息等功能，见 [Android 推送集成](https://docs-im.easemob.com/push/apppush/androidsdk)；
- [IM SDK] 增加非好友不能发送消息错误码 [221 USER_NOT_ON_ROSTER]；
- [IM SDK] [EaseIMKIt] 增加通过 REST 接口撤回消息功能。

### 优化

- [IM SDK] 减少弱网时发送消息的等待时间。

### 修复

- [IM SDK] 修复消息发送重试被连接成功事件中断；
- [IM SDK] 修复内存泄漏问题；
- [IM SDK] 修复因时间统计为负数导致崩溃问题。

## 版本 V3.8.9.1 2021-12-30

### 修复

- [IM SDK] 增加极端情况下打开数据库失败时重建数据库的策略。

## 版本 V3.8.9 2021-12-27

### 新增

- [IM SDK] 增加翻译功能 API；
- [IM SDK] 位置消息增加建筑物名称字段；
- [IM SDK] 增加按照时间删除消息的 API；
- [IM SDK] 增加获取会话中消息总数的 API；

### 修复

- [IM SDK] 修复部分 crash 的问题；
- [IM SDK] 修复数据库加密的 bug。

## 版本 V3.8.8 2021-12-06

### 新增

- [IM SDK] 增加获取登录状态的 API。

### 更新

- [IM SDK] 更新部分函数命名与注释；
- [IM SDK] 优化推送 token 的更新逻辑，降低对服务器的请求次数；
- [IM SDK] 优化登录速度；
- [IM SDK] 优化群组消息在 token 过期时的处理逻辑；
- [IM SDK] EMOptions 中默认使用 HTTPS only。

### 修复

- [IM SDK] 修复拉取历史漫游消息不全的 bug；
- [IM SDK] 对荣耀手机推送的支持；
- [IM SDK] 部分场景下的 crash 问题；
- [EaseIMKIt] 修复部分场景下消息未读状态显示 bug；
- [EaseIMKIt] 低版本设备部分场景下的 crash 问题。
- [EaseIM App] 退出登录时用户信息未完全清除的 bug。

**`请注意：`** **此版本有偶发不能正常打开数据库的问题，请使用 3.8.9.1 版本。**

## 版本 V3.8.7 2021-10-22

### 新增

- 使用 token 登录时，在 token 过期时回调给上层 app；

### 修改

- 修复部分场景下传输加密的问题。

## 版本 V3.8.6.1 2021-10-12

### 新功能

- [IM SDK] 增强本地存储数据的安全性；
- [IM SDK] 增强传输数据的安全性；
- [IM SDK] 增加用户被全局禁言时发消息会提示单独的错误码；

### 更新

- [EaseIMKIt] 聊天页面语音消息按钮事件移到 APP 层；
- [IM SDK] 检查发送 ReadAck 时 to 是否为空；

### 修复

- [IM SDK] 修复 WAKE_LOCK 权限导致应用 crash 问题；
- [IM SDK] 删除自定义证书异常打印；
- [EaseIMKIt] 修复一般会话列表接收到位置信息后未显示用户昵称问题。

**`请注意：`**

1. **从 3.8.6.1 开始我们采用 Dev 和 Stable 版本并行的方式，用户可以根据需求选择使用的版本。**
   稳定版（Stable）：基于开发版本，提供稳定的功能，持续修复 Bug，可用于发布应用。
   开发版（Dev）：最新版本，体现最新的功能和特性，不定期发布版本，可用于体验。
2. **`V3.8.6.1 Dev 仅支持 HTTPS。`如您的项目（Appkey）配置的是 HTTP，请勿升级该版本，否则会导致 HTTP 用户无法正常登录；如不升级该版本则不受任何影响。**

## 版本 V3.8.5 2021-09-10

### 新功能

- [IM SDK] 对用户日志加强了安全保护。

### 更新

- [IM SDK] 设备 ID 使用随机生成的方式。
- [IM SDK] 移除对 FCM 11.4.0 版本的依赖，将 FCM 的逻辑移到应用层。
- [IM SDK] 如果设置了 EMOptions#setAutoTransferMessageAttachments(false)，SDK 发送消息时不再检查附件是否存在。
- [EaseIMKit] 在 EaseChatFragment 中暴露消息发送成功的回调 onChatSuccess。
- [EaseIM] 将 FCM 逻辑移到应用层，并升级 FCM Messaging 到 22.0.0 版本，[FCM 集成详见](https://docs-im.easemob.com/im/android/push/thirdpartypush#sdk_385_版本之后集成方式)。

### 修复

- [IM SDK] 修复 SDK 某些场景下数据库损坏导致崩溃的问题。
- [EaseIMKit] 修复通讯录首字母识别不准确的问题。
- [EaseIMKit] 移除百度地图 so 文件。
- [EaseCallKit] 修复设置 Agora appId 无效的问题。
- [EaseCallKit] 修复部分场景下 user ID 为空导致崩溃的问题。
- [EaseCallKit] 修复在 Android 11 手机上，在音视频界面切到后台，音视频中断的问题。

## 版本 V3.8.4 2021-08-03

### 新功能

- [IM SDK] 新增单聊 1v1 免打扰功能；

### 更新

- [EaseIM App] 增加单聊 1v1 免打扰开关；
- [IM SDK] EMCmdMessageBody#getParams 方法增加已废弃注解；
- [IM SDK] 更新 API 注释；
- [IM SDK] 去除收集不必要的设备信息；
- [IM SDK] 增加垃圾消息被拦截的错误码；

### 修复

- [IM SDK] 修复 APP 运行在前台或者后台判断错误问题；
- [EaseIM App] 修复置顶会话在新消息到达时未置顶的问题；
- [EaseIM App] 修复未添加好友在好友列表显示问题；
- [EaseIMKIt] 修复文本支持超链接时长按事件失效问题。

## 版本 V3.8.3 2021-07-09

### 更新

- [IM SDK] 在 EMClient 中增加了对一些方法的保护；
- [IM SDK] 移除 SDK 中获取定位的相关逻辑；
- [IM SDK] 移除 SDK 中 AndroidManifest 的权限声明；

### 修复

- [EaseIMKIt] 修复某些场景下导致发送失败图标和已读标志重叠的问题；
- [EaseIMKIt] 修复某些场景下长按聊天条目崩溃的问题；
- [EaseIMKIt] 修复联系人列表不设置头部布局展示空布局的问题；
- [EaseIMKIt] 修复接收的图片或者视频封面没有设置宽高导致崩溃的问题；
- [EaseIM] 修复管理员将群成员加入到黑名单后无法再添加好友的问题；
- [EaseIM] 修复不能在群组和聊天室发送名片的问题；
- [EaseIM] 修复了会话列表中不展示群名称的问题；

## 版本 V3.8.2 2021-06-05

### 新功能：

- [IM SDK] 新增增加异常事件上报功能, 需要开启，默认不会上报；
- [IM SDK] 新增增加针对发送前回调拦截的消息的错误码；
- [IM SDK] 新增支持多种不同应用(相同 Appkey)使用不同的消息过滤规则；

### 修复：

- [IM SDK] 新增会话列表添加 localpath，确保拉取会话列表语音/视频/图片可以下载;
- [IM SDK] 新增修复个别场景下长时间在前台可能会离线的 bug；
- [IM SDK] 新增修复附件中含有 % 时上传失败的问题；
- [IM SDK] 新增使用登录 API 时，对于用户已登录增加描述信息（区分当前登录用户）；
- [CallKit] 增加与小程序互通功能和显示用户头像昵称；

## 版本 V3.8.1 2021-04-13

### 新功能：

- [IM SDK] 新增设置、获取用户属性的接口，集成参见：[用户属性](https://docs-im.easemob.com/im/android/basics/profile)
- [EaseIM App] 新增用户资料（头像、昵称等）的存储、显示;
- [EaseIM App] 新增用户名片消息的发送与展示（使用自定义消息实现);

### 修复：

- [EaseIMKIt] 修复发送多条带附件的消息时会发送重复的问题;
- [EaseIMKIt] 修复注册聊天类型时排序问题造成的展示问题;
- [EaseIMKIt] 提供发送消息前设置消息属性的接口(OnAddMsgAttrsBeforeSendEvent);
- [EaseIMKIt] 修复设置聊天页面条目的头像会被默认头像遮挡的问题；
- [EaseIMKIt] 优化上传文件的逻辑，修复部分场景无法上传文件的问题(EaseFileUtils);
- [IM SDK] 修复上传文件消息时没有设置文件长度的问题;
- [IM SDK] 修复 SDK 3.5.3 后数据库从 2.0 迁移到 3.0 后加载会话列表消息不全的问题;

### 更新(2021-05-08)：

- [EaseCallkit] 修改加入声网频道的方式，改为使用数字 uid 加入，增加与小程序的互通，`与之前版本不互通`，参见[EaseCallKit 使用指南](https://docs-im.easemob.com/im/android/other/easecallkit);

```
**重大变动：**
```

远程仓库统一由 JCenter 迁移到 `MavenCentral`，依赖库的域名由 “com.hyphenate” 修改为 `“io.hyphenate”`，详见 [Android SDK 介绍及导入](https://docs-im.easemob.com/im/android/sdk/import)。

## 版本 V3.8.0 2021-02-27

新功能：

- [EaseCallkit] 发布 EaseCallKit，通话部分模块化为 EaseCallKit；
- [IM SDK] 增加群组成员批量操作的 API；
- [IM SDK] 增加 getContactsFromLocal() 方法；

### 更新：

- [IM SDK] 3.8.0 及以后版本 SDK 更新名为 com.hyphenate:hyphenate-chat:x.x.x, 只发布 IM 功能，移除环信音视频功能；
- [EaseIM App] 环信 app 依赖声网音视频功能;

### 修复：

- [IM SDK] 修复极端情况用户名为空时请求 token 的的问题；
- [IM SDK] 在 EMGroup 和 EMChatRoom 中增加 PermissionType 属性用以判断角色；
- [IM SDK] 修复发送文件消息时没有设置文件长度的问题；
- [EaseIMKit] 修复会话列表页面删除所有数据后，不展示空布局的问题；

### 注意

- **为提供更好的服务，从3.8.0开始SDK中不再提供音视频功能，而是在EaseCallKit中基于声网的SDK给出了音视频功能的参考实现。该方案呼叫功能不能与之前版本之间互通，请根据情况选择使用新方案或者继续使用之前的版本**
- EaseCallKit除了可以远程库外，也公布了源码，详情请见：[EaseCallKit 使用指南](http://docs-im.easemob.com/im/android/other/easecallkit);

## 版本 V3.7.6 2021-09-17

### 修复：

- [IM SDK] 移除 SDK 中获取定位的相关逻辑；
- [IM SDK] 移除 SDK 中 Android Manifest 的权限声明；
- [IM SDK] 去除收集不必要的设备信息；
- [IM SDK] 修复音视频偶现空指针的 bug。

## 版本 V3.7.5 2021-06-05

修复：

- [IM SDK] 修复个别场景下长时间在前台可能会离线的 bug；

`**注意：**`此版本只能从 `MavenCentral` 拉取，依赖库的域名由 “com.hyphenate” 修改为`“io.hyphenate”`，详见 [Android SDK 介绍及导入](https://docs-im.easemob.com/im/android/sdk/import)。

## 版本 V3.7.4 2021-02-04

新功能：

- [IM SDK] 增加针对会话的 read ack 接口；
- [IM SDK] 增加拉取会话列表的接口；
- [IM SDK] 增加搜索自定义消息（消息类型为 CUSTOM）的接口；

更新：

- [EaseIMKit] EaseChatLayout 提供拦截按压录音按钮的方法（OnChatRecordTouchListener）；
- [EaseIMKit] 增加发送消息前设置消息属性（比如设置 ext）的接口（OnAddMsgAttrsBeforeSendEvent）；
- [EaseIMKit] 增加发送会话已读回执的逻辑，减少发送消息回执（read ack）的次数；
- [EaseIM App] 增加从服务器获取会话列表的逻辑（需申请开通）；

修复：

- [IM SDK] 修复部分 HTTP 重复请求的问题；
- [IM SDK] 移除获取设备 IMEI 信息相关逻辑；
- [EaseIMKit] 修复动图不发送已读回执（read ack）的问题;
- [EaseIMKit] 修复群组会话页面不显示昵称（或者环信 ID）的问题；
- [EaseIMKit] 修复开启漫游后，获取的历史消息不上屏的问题；
- [EaseIMKit] 修复聊天页面拦截消息长按事件后，复制功能被拦截的问题；
- [EaseIMKit] 修复聊天页面“正在输入”状态无法消失的问题；
- [EaseIM App] 修复首次安装应用登录后偶现不展示群名称的问题；
- [EaseIM App] 修复群主在群组聊天中 @成员 crash 的问题；
- [EaseIM App] 修复删除会话后，主页会话 tab 未读数未更新的问题；
- [EaseIM App] 修复设置群组消息免打扰接收不到群消息的问题；
- [EaseIM App] 修复通过 ID 搜索公开群 crash 的问题；

## 版本 V3.7.3 2020-12-31

### 新功能：

- [EaseIMKit] EaseUI 的升级版 EaseIMKit 正式发布远程依赖库了，版本号与 IM SDK 一致，详情请见：[EaseIMKit 使用指南](https://docs-im.easemob.com/im/android/other/easeimkit)；

### 更新：

- [IM SDK] 提升 Android 音视频通话时音频的比特率（bitrate），提高声音质量；

### 修复：

- [IM SDK] 修复特殊情况下传输加密引发的 crash 问题；
- [IM SDK] 修复部分 Android 安全问题，移除不必要的 app monitor 保活；
- [IM SDK] 修复调用 updateMessage API 时无法更新消息 body 的问题；
- [IM SDK] 修复 Android Q 版本以上手机发送图片消息时无法正确获取文件名的问题；
- [IM SDK] 修复删除本地消息后，调用 ackMessageRead（发送已读回执）API 失败的问题；

**注意：**

1. EaseIMKit 除了可以远程库外，也公布了源码，详情请见：[EaseIMKit 使用指南](https://docs-im.easemob.com/im/android/other/easeimkit)；
2. 新版 App（EaseIM App）采用了新的 Appkey，不可用之前的账号进行登录，需要重新进行注册。

## 版本 V3.7.2 2020-10-30

- 处理相同 ID 在其他设备上发出的 read ack，实现已读状态在多个设备上的同步；
- 修复对于使用网线设备的网络连接判断不准确的 bug；
- 改进加入聊天室，群组的速度，减少请求服务器次数；
- 注册用户名超过 64 位时返回错误码： USER_NAME_TOO_LONG;
- 修复群组公告长度判断的问题；
- 修复清晰度优先 1v1 作为被叫时不生效的 bug;
- 修复外部输入数据时本地预览不能正常显示的 bug;
- 修复极端情况下消息回调报错的问题;
- 修复偶现的 ExecutorService 空指针问题;
- 修改添加群成员，邀请文案描述只能是 “welcome” 的问题；
- 修复 setHostnameVerifier 的安全隐患；
- 修复 Android API 21以下（不包括 21）delete 请求出现异常的问题；
- 对 Emclient 中的 getCurrentUser 方法增加同步锁，修复偶现的 crash 问题。

## 版本 V3.7.1 2020-08-27

### 新功能：

- RTC 增加设置质量优先的 API；
- RTC 增加设置获取集群代理的 URL 的 API；
- 增加显示推送详情的 API；

### 更新：

- 升级 OPPO 推送 SDK 升级到 2.1.0 版本;
- 修改更新推送昵称的 API；

### 修复：

- 修复发送原图，接收方获取不到图片宽高的问题。

## 版本 V3.7.0 2020-07-29

### 新功能：

- 实现 RTC 质量监控，上报RTC质量数据；
- 增加纯音频推流功能,可设置音频参数；
- 增加多人推流到 CDN 接口的 API；
- 增加推流到 CDN 自定义录制接口的 API；
- 增加退出聊天室时是否保留会话的 API；
- 增加设置心跳间隔的 API；
- Demo 中把 1v1 呼叫时的推送选项默认打开；
- 增加 1V1 语音 视频通话浮窗小窗口；
- 增加网络等异常无视频 音频数据，无数据回调接口；
- 增加发送接收音视频首帧数据的回调；

### 修复：

- 修复构造图片消息时 localpath 为空时的 bug；
- 修复发送图片消息可能会删除原图的 bug。

## 版本 V3.6.9.1 2020-06-29

### 修复：

- 修复设置 REST Server 端口设置失效的问题。

## 版本 V3.6.9 2020-06-23

新功能：

- 增加白板开启关闭交互的 API；
- 增加创建白板时的参数开启关闭交互；
- 增加共享桌面流的限制；
- 增加发布桌面流失败的回调；

修复：

- 修复本地预览模糊；
- 修复本地横屏时候，对端显示不正常的问题；
- 修复视频通话断开连接时 无法切换本地摄像头的问题；
- 修复华为 p20 pro 手机退出会议后，Demo 直接返回到桌面的问题；

## 版本 V3.6.8 2020-06-09

新功能：

- 支持附件下载重定向；
- 支持图片检测违规抛出单独的异常；

更新：

- 适配AndroidQ(支持上传附件通过Uri，具体用法请参考[发送消息](https://docs-im.easemob.com/im/android/basics/message))；
- 移除apache jar包；

修复：

- 修复群组发起音视频会议无法邀请管理员的问题；

**注意：配合SDK适配AndroidQ，EaseUi库进行了相应的适配。如果SDK升级到此版本之后，需要对依赖的EaseUi库进行更新。**

## 版本 V3.6.7 2020-05-15

新功能：

- 支持集群代理功能；
- SDK实现上下麦api；
- SDK实现静音管理功能；
- SDK支持推流CDN功能；
- SDK支持推流CDN更新布局功能；
- 外部输入视频支持NV12格式；
- demo中音视频会议只使用普通模式；

更新：

- 修复视频最小码率不起作用的问题；
- 修复了Android 和 IOS 1V1 视频，安卓切换大小屏时候，对端显示镜像的问题；
- 升级OPPO推送SDK到2.0.2版本。manifest等配置参见：消息推送→第三方推送集成→OPPO推送集成；
- 兼容AndroidQ版本。

## 版本 V3.6.6 2020-04-09

新功能：

- 音视频会议增加踢人api；
- 音视频会议增加管理员转移api和回调；
- 加入房间时支持设置最大主播人数，nickname和扩展。
- 提高默认分辨率为480p；
- 支持x86_64位so文件

更新：

- 修复1v1横屏时显示本地图像倒立的问题；
- 修复3.6.5版本中安卓视频会议和小程序互通问题。
- 修复连续两次调用unpublish()接口时crash的问题；

## 版本 V3.6.5 2020-03-13

新功能：

- 支持群组聊天室白名单管理，全员禁言功能；
- 支持用户自定义消息类型；
- 增加创建白板和加入白板的api；
- 增加视频会议joinRoom的api；
- 添加对于对于加入音视频会议密码错误，或者主播已经满的错误提示；
- 启用DTX功能，用户在静音时节约流量；

更新：

- 修复live模式下只发布音频流时其他人无法收到声音的bug；
- 修复视频fill 模式拉伸显示导致画面不正常的问题；

**注意：该版本视频会议会有小程序端无法看到图像的bug，建议有互通需要的尽快升级最新版本。**

## 版本 V3.6.4 2020-02-12

新功能：

- 支持设置视频流水印；
- 创建会议api，增加参数支持小程序，默认为不支持；

更新：

- 修复加入音视频会议时与小程序互通的bug；
- 解决通话时手机选择90度，本地view显示图像为倒立的问题；
- 修复下麦时crash的问题；

## 版本 V3.6.3 2020-01-03

新功能：

- 支持外部输入音频api；
- 支持设置私有部署的RTC 服务器api；

更新：

- 降低长连接超时时间；
- 修复多端同步消息和已读回执时极端场景下已读回执不回调的问题

## 版本 V3.6.2 2019-11-13

新功能：

- 添加群组回执功能接口（增值服务，需要联系商务开通）
- 添加远端音视频无数据时的提醒回调

更新：

- 支持H264软编解码，提高音视频通话的兼容性；
- 私有部署且未启用dns时，不尝试取服务器列表；
- 添加音视频功能的一些关键log，方便排查问题；

修复：

- 修复特定场景下密钥信息未正确保存的问题；
- 修复网络变化时重连的bug；
- 修复某些场景下码率限制未生效的bug；

## 版本 V3.6.1 2019-07-20

新功能：

- 添加主播自己下麦的接口
- 添加本地消息全局搜索的接口
- 添加mute远端流的接口

更新：

- 改进SDK中加载动态库的方式
- 去除不需要的libsqlcipher.so 减少SDK大小
- 升级Easeui中glide库到4.x版本

修复：

- 修复通话状态回调不准确的问题
- 修复App从后台回到前台时，部分设备上重建连接慢的问题
- 修复音视频通话过程中某些场景下setRotation()不起作用的问题
- 修复上传的文件大小超过限制提示慢问题

## 版本 V3.6.0.1 2019-06-21

修复：

- 修复通过gradle加载完整版SDK时，部分情况下发起多人会议失败的问题；

## 版本 V3.6.0 2019-05-28

新功能：

- 增加会议属性功能，可以方便使用音视频会议实现特定的一些场景，具体可以参见语聊demo；
- 增加语音会议伴音功能，具体可以参见语聊demo；
- 在附件过大时返回相应的错误码，在附件过期或不存在时，返回相应的错误码；
- 发起通话和创建会议时添加参数，是否开启服务端的录制和录制时是否合并流，通过录制id可以在服务器端查询；
- 支持自定义图片消息缩略图的大小；

更新：

- 升级音视频引擎，优化噪声消除，改进性能，减少建立通话的时间等；
- 从3.6.0版本中暂时移除了端上的录制功能，移动端可通过SDK参数配置每个通话是否在服务器上录制，Web端如果也需要录制则需联系商务打开全端录制功能，该功能开启后优先级将高于SDK参数配置；
- 优化批量消息保存方法，在批量保存后再给服务器确认消息，修复极端场景下消息未正确保存的问题；
- 发起通话和创建会议时如果音视频服务未开通或者欠费，会返回相应的错误码；
- 修改一对一视频中自定义本地视频数据接口;

修复：

- 修复保存消息时消息数没有正确增加的问题；

## 版本 V3.5.6 2019-05-16

- 修复接收消息存储过程中发生异常，导致消息不能正常存储的bug。
- 使用gradle添加依赖时，请使用：api 'com.hyphenate:hyphenate-sdk:3.5.6.1'

## 版本 V3.5.5 2019-04-24

- 新增EMStreamParam#setUsingExternalSource(boolean)接口,用于支持音视频会议模式下的EMConferenceManager#inputExternalVideoData()接口的使用;
- 修复chrome 72+ 与Android设备 1v1 呼叫不通的问题;
- 修复SDK中三方推送使用可能崩溃的问题;
- 修复Demo层的一些bug；

## 版本 V3.5.4 2019-03-26

新功能：

- 支持Oppo、Vivo、魅族推送，详情请见[第三方推送集成](http://docs-im.easemob.com/im/android/push/thirdpartypush)文档；

优化：

- 优化三方推送的集成使用接口，详情请见[第三方推送集成](http://docs-im.easemob.com/im/android/push/thirdpartypush)文档；
- 优化一些错误码返回值，错误原因更加具体；

修复：

- 修复个别情况下音视频通话接通失败的问题；
- Demo层的一些bug；

**注意：**

- 针对oppo推送，我们把Demo包名替换为了：com.hyphenate.chatuidemo.push。如果在环信Demo上测试Oppo推送，请自行修改Demo包名。

- `V3.5.4，在华为手机注册推送的时候会出现异常，该 Bug 在V3.5.5及之后的版本中已修复，这里建议未集成的用户或者已是V3.5.4的用户升级到更高的 SDK 版本。`

## 版本 V3.5.3 2019-01-18

修复：

- 某些情况下使用含大写字母的id发消息失败的问题；
- debug log不能关闭的问题；
- 退出登录时仍然可以取到当前用户id的问题；
- 某些场景下第二次加入音视频会议失败的问题；
- 共享网络下不能拨打音视频通话的问题；
- 自己给自己发送消息不能加载会话的问题；
- Demo从设置中设置视频通话分辨率无效的问题;

优化：

- sqlite升级至3.26.0
- 完善音视频通话逻辑，提高音视频呼叫接通率
- 适配android 9.0

```
目前，环信IM SDK和Demo已经全部适配至9.0，编译环境配置如下：
 - Android Studio version: 3.2.1
 - project-level/build.gradle version config:
   buildscript {
    ext.kotlin_version = '1.2.71'
    repositories {
        jcenter()
        maven {
            url 'https://maven.google.com/'
            name 'Google'
        }
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.2.1'
    }
   }
 - module-level/build.gradle version config:
   android {
    compileSdkVersion 28
    buildToolsVersion '28.0.3'
    defaultConfig {
        minSdkVersion 16
        targetSdkVersion 28
    }
   }
 - gradle version (path: project-dir/gradle/wrapper/gradle-wrapper.properties):
   distributionUrl=https\://services.gradle.org/distributions/gradle-4.6-all.zip
 - Android Support-Library 相关:
   'com.android.support:design:28.0.0-alpha1'
   
 Tips：版本的更新会从Google相关网站下载相应版本的编译工具，可能需要科学上网哦
```

## 版本 V3.5.2 2018-11-02

新功能：

- 移除IM SDK3.2.0及以前deprecated的方法。

```
api 变动如下, '-'代表deprecated api，'+'代表可替换的api

-  public int EMChatRoom#getAffiliationsCount();
+  public int EMChatRoom#getMemberCount();

-  public int EMGroup#getAffiliationsCount();
+  public int EMGroup#getMemberCount();

-  public void EMContact#setNick(String nick);
+  public void EMContact#setNickname(String nick);

-  public String EMContact#getNick();
+  public String EMContact#getNickname();
```

- 添加EMCallSurfaceView#setCoverImage(Bitmap bitmap)接口，在通过EMConferenceManager#updateLocalSurfaceView(EMCallSurfaceView)或者EMConferenceManager#updateRemoteSurfaceView(String, EMCallSurfaceView)设置该EMCallSurfaceView时，该view会在stream到来前显示该Bitmap。

修复：

- 音视频通话后可能导致内存泄露的bug；
- 自动登录时无网络，导致获取自己在其他设备登录的id包含自己的bug；
- 个别情况下，连接失败时更新服务器列表的bug;
- 32位设备上EMMessage#setLocalTime(long serverTime)设置后获取为负数的bug；

## 版本 V3.5.1 2018-09-13

新功能：

- 多人实时音视频添加动态修改最大视频码率接口 EMConferenceManager#updateVideoMaxKbps(int maxKbps)
- 1v1实时音视频单独录制音频的功能 EMVideoCallHelper#startAudioRecord(String dirPath) 和 EMVideoCallHelper#stopAudioRecord()

修复：

- Fix：Demo中实时音视频中接听普通电话的问题

优化：

- 屏幕共享性能

## 版本 V3.5.0 2018-08-13

新功能：

- 为满足不同场景需求，3.5.0版本开始将实时音视频会议划分了不同的类型，不同类型对应了不同场景，使你能够轻松地将实时音视频功能集成到你的应用或者网站中。类型如下：

```
   1. Communication：普通通信会议，最多支持参会者6人，会议里的每个参会者都可以自由说话和发布视频，该会议类型在服务器不做语音的再编码，音质最好，适用于远程医疗，在线客服等场景；
   2. Large Communication：大型通信会议，最多参会者30人，会议里的每个参会者都可以自由说话，最多支持6个人发布视频，该会议模式在服务器做混音处理，支持更多的人说话，适用于大型会议等场景；
   3. Live：互动视频会议，会议里支持最多6个主播和600个观众，观众可以通过连麦与主播互动，该会议类型适用于在线教育，互动直播等场景。
```

## 版本 V3.4.3 2018-07-17

1. 解决Android 7.0以上设备聊天中选择扩展功能中的'拍照'崩溃的问题
2. 增加'只投递在线用户'消息属性，以节约消息量，目前只支持CMD类型消息。通过`EMCmdMessageBody#deliverOnlineOnly(true)`接口设置该属性

## 版本 V3.4.2 2018-06-19

新功能：

1. 多人会议增加 joinConferenceWithTicket(); 接口
2. 通过消息邀请参加会议；
3. Android 8 适配

修复：

1. 修复移动端与chrome 端视频通话时不显示视频画面的bug；
2. 解决极端情况下 Android 通话挂断崩溃的问题

优化：

1. 音视频会议实现新的UI；
2. 优化设备同时有FCM和华为推送时的逻辑，使用`EMOption#setUseFCM()`接口

**EMOption#setUseFCM() 接口可以设置是否启用谷歌推送，无需再通过后台配置。默认为true，即如果用户手机上有google play service 且配置了FCM number则优先使用FCM推送，如果仅有国内用户，建议关闭该选项，详细可参考 demo 实现**

**请注意：为提供高质量且一致的音视频体验，从3.4.1版本开始，1v1 通话不再与3.1.5及以前版本兼容，请及时升级。**

## 版本 V3.4.1 2018-05-11

SDK:

1. 修复安卓中会话消息未读数显示不准确的问题；
2. 修复华为推送自动登录情况下有时不可用的问题；
3. 修复app第一次安装运行,初始化过程有可能报nullpointer的问题；
4. 尝试解决sendDeviceToServer()方法crash的问题；
5. 实现音视频弱网检测提示功能；
6. 实现加群时填写验证消息功能；
7. 提供聊天室断线时被踢出聊天室的提醒；
8. 优化1v1 通话；

EaseUI:

1. 更新消息发送逻辑,用于解决发送消息出现重复,顺序颠倒等问题.

**请注意：为提供高质量且一致的音视频体验，从3.4.1版本开始，1v1 通话不再与3.1.5及以前版本兼容，请及时升级。**

## 版本 V3.4.0.1 2018-04-13

新功能：

1. 将华为推送的集成从sdk中转移到应用层，SDK提供上传华为推送token的接口供用户调用，方便华为推送升级时用户自行升级 [3.4.0.1华为推送修改文档](https://docs-im.easemob.com/im/android/push/thirdpartypush#华为hms推送集成)

## 版本 V3.4.0 2018-04-04

新功能：

1. 增加是否使用FCM推送的接口 通过`EMOptions`的`setUserFCM()`方法设置
2. 添加语音会议功能 [多人音视频会议](https://docs-im.easemob.com/im/android/basics/multiuserconference)

修复：

1. 修复华为推送覆盖安装时无法收到推送的bug
2. 修复下载附件时不更新token的bug

## 版本 V3.3.9 2018-02-11

1. Demo层实现群组消息已读功能（发送方在EMMessage.ext中自定义字段用以表示是否需要已读回执，接收方用CMD消息实现已读回执）
2. 精简Demo实现，demo中移除红包功能;
3. 优化重连逻辑,解决用户迁移和服务器受攻击后部分用户连接服务超时的问题;
4. 修复获取会话中消息数量接口(EMConversation#getAllMsgCount())不准确的bug;
5. 修复弱网环境下,连续发送多个带附件消息的同时从数据库中加载更多历史消息导致消息重复展示的bug;
6. 适配部分'1+'手机SharedPreferences#Editor#apply()方法无效的问题;

## 版本 V3.3.8 2018-01-24

1. 添加服务诊断接口
2. 添加设置音频码率接口
3. 优化重连逻辑，减少重连次数
4. 添加社区版SDK注册用户，创建群组\聊天室达到数量限制的提示

## 版本 V3.3.7 2017-11-30

修复：

1. 修复使用华为推送时注册华为推送 token 空指针问题
2. 修复更新聊天室公告时，其他聊天室成员收到回调崩溃问题
3. 修复保存和插入消息时间戳和本地已存在消息的时间戳不同时，导致内存出现重复消息的问题
4. 消息时间戳相同时导致消息不能正确加载
5. 离线消息在某些情况下会导致cmd与普通消息顺序不一致

## 版本 V3.3.6 2017-11-03

新功能：

1. 新增API请查看[3.3.6 API变化](https://docs-im.easemob.com/im/android/sdk/3.3.6apichange)
2. 使用外接音频输入源进行音视频通话时，设置音频源
3. 提供是否自己处理附件的上传和下载设置项
4. 提供是否自动下载附件类消息附件设置项（缩略图，语音文件）
5. 多人音视频会议功能，详细参考集成文档 [多人音视频会议](https://docs-im.easemob.com/im/android/basics/multiuserconference)

优化：

1. 更改 easeui 中 EaseChatRow 实现方式，保证发送消息的回调顺利执行
2. 使用SDK下载接口，如果本地已经有同名文件，新的文件名会在原有文件名后边追加数字；

修复：

1. 修复使用华为推送时注册华为推送 token 空指针问题
2. 修复更新聊天室公告时，其他聊天室成员收到回调崩溃问题
3. 修复保存和插入消息时间戳和本地已存在消息的时间戳不同时，导致内存出现重复消息的问题

## 版本 V3.3.5_r1 2017-10-25

修复：

1. 不再尝试加载sqlcipher。因为部分手机已经在系统中集成sqlcipher,并且会查找java端相应代码，会导致3.3.5加载失败。

## 版本 V3.3.5 2017-10-23

新功能：

1. 增加了传输安全性；
2. 支持FCM推送；

优化：

1. 私有部署设置dns的接口；
2. 优化私有部署重连逻辑；
3. 限制用户名长度为255；
4. 需要服务器开通的功能接口返回SERVICE_NOT_ENABLED(505);

修复：

1. 修复4G与wifi切换时偶然出现发送消息失败的bug；
2. 修复VIVO手机JobService crash问题；

## 版本 V3.3.4 R1 2017-08-09

修复在用户名有下划线时发送消息失败的 bug；

## 版本 V3.3.4 2017-08-04

新功能

1. 新增加API请查看链接[3.3.4api修改](https://docs-im.easemob.com/im/200androidclientintegration/3.3.4apichange)
2. 增加接口支持获取历史消息(消息漫游)（`此功能需要联系商务同事开通`）;
3. 新增PC与移动端互发消息和文件的功能；
4. 增加消息撤回的接口和回调（`此功能需要联系商务同事开通`）;
5. 支持华为新版推送功能(HMS)；

## 版本 V3.3.3 2017-07-21

新功能

1. 新增加API请查看链接[3.3.3api修改](https://docs-im.easemob.com/im/200androidclientintegration/3.3.3apichange)
2. 支持在多个设备登录同一个账号，多个设备间可以同步消息，好友及群组的操作(多设备登录属于增值服务，需要联系商务开通)；
3. 添加群共享文件的大小属性；
4. 增加获取同一账号登录的设备列表的接口，并可以选择踢掉某个设备上的登录；

问题修复

1. 修复分页获取聊天室成员接口无法传入cursor的问题；
2. 修复邀请群成员时没有附带信息的bug；
3. 修复群组操作时必须获取所有已加入群组的问题；
4. 修复附件消息在web IM中右键另存时不能正确显示名字的问题；
5. 修复android 共享文件名为中文时显示乱码的问题；
6. 修复下载附件路径不存在或者打开错误时仍然下载成功的bug；
7. 修复切换账号时某些场景下崩溃的bug；
8. 修复获取群成员时最后一页cursor未更新的问题；

## 版本 V3.3.2 2017-05-18

1. 增加群、聊天室公告相关API
2. 群组支持上传及下载共享文件
3. 群组支持设置扩展属性
4. EMLocalSurfaceView 和 EMOppositeSurfaceView 合为同一个控件 EMCallSurfaceView
5. Demo及EaseUI改成纯Android Studio结构，不再支持Eclicpse导入
6. easeui没有包含SDK的jar和so, 使用需要自己拷贝libs下的库文件，或者执行copyLibs.sh完成拷贝。

## 版本 V3.3.1 2017-04-07

新功能：

1. 新增：使用token登录接口
2. 新增：群组群成员进出群组回调

优化：

1. Demo中红包集成方式更改为aar，默认支持支付宝渠道支付

修复

1. 之前EMChatManager.getMessage对应的消息会保存在缓存中，修改后不缓存getMessage产生的消息。之前的代码会导致loadMoreMessage部分消息不显示。
2. 3.3.0版本Demo中群组@键，弹出列表没有包含群组管理员
3. 3.3.0版本EMGroup.getMuteList会崩溃
4. 3.3.0版本EMChatRoom hash code错误
5. 修复音视频被叫时多个应用都会收到通知的错误

## 版本 V3.3.0 2017-03-07

新功能：

1. 群组和聊天室改造：增加管理员权限，新增禁言，增减管理员的功能，支持使用分批的方式获取成员，禁言，管理员列表，支持完善的聊天室功能。新增加API请查看链接[3.3.0api修改](https://docs-im.easemob.com/im/200androidclientintegration/3.3.0apichange)
2. 优化dns劫持时的处理
3. 增加EMConversation.latestMessageFromOthers,表示收到对方的最后一条消息
4. 增加EMClient.compressLogs，压缩log，Demo中增加通过邮件发送log的示例
5. libs.without.audio继续支持armeabi，解决armeabi-v5te的支持问题

bug 修订:

1. 修复2.x升级3.x消息未读数为0的bug
2. Demo在视频通话时，主叫方铃声没有播放的问题
3. Demo在视频通话时，主叫方在建立连接成功后，文字提示不正确
4. Demo在聊天窗口界面，清空消息后，收到新的消息，返回会话列表，未读消息数显示不正确
5. 修复在Oppo和Vivo手机上出现的JobService报错。
6. EMGroupManager.createGroup成员列表数超过512产生的overflow错误
7. 修复部分手机在网络切换时发消息慢的bug

## 版本 V3.2.3 2016-12-29

新功能/优化：

1. sdk提供aar及gradle方式集成，具体方法查看[gradle方式导入aar](https://docs-im.easemob.com/im/android/sdk/import#手动复制jar包及so导入)
2. 增加离线推送设置的相关接口，具体方法可查看EMPushManager API文档
3. 为了使sdk更简洁易用，修改一些api，并将一些api标记为“已过时”，具体修改查看[3.2.3api修改](https://docs-im.easemob.com/im/200androidclientintegration/3.2.3apichange)，另外，已过时的api后续3-5个版本会进行删除
4. 优化loadAllConversationsFromDB()方法，从联表查询改为从两个表分别查询，解决在个别乐视手机上执行很慢的问题
5. 优化登录模块，减少登录失败的概率
6. 鉴于市面上的手机基本都是armeabi-v7a及以上的架构，从这版本开始不再提供普通的armeabi架构的so，减少打包时app的体积

红包相关：

新增：

1. 小额随机红包
2. 增加广告红包（需要使用请单独联系商务）
3. 商户后台增加广告红包配置、统计功能
4. 商户后台增加修改密码功能

优化：

1. 绑卡后的用户验证四要素改为验证二要素
2. 发红包等页面增加点击空白区域收回键盘的功能
3. 群成员列表索引增加常用姓氏以及汉字的支持

修复bug：

1. 红包详情页领取人列表展示不全
2. 华为P8手机密码框无法获取焦点
3. 部分银行卡号输入正确，提示银行卡号不正确
4. 红包祝福语有换行符显示不正确
5. 修复Emoji表情显示乱码
6. 修复商户自主配置红包最低限额错误
7. 修复零钱明细显示顺序错误问题

## 版本 V3.2.2 2016-12-2

新功能/优化：

1. 新增设置音视频参数及呼叫时对方离线是否发推送的接口
2. 新增修改群描述的接口；
3. 删除好友时的逻辑修改： 删除好友增加接口，根据参数是否删除消息； 被动被删除时不再删除会话消息， 用户需要删除会话及消息时可以在onContactDeleted()中调用EMClient.getInstance().chatManager().deleteConversation(username, true)。

Bug Fix：

1. 修复3.2.1版本中某些情况下心跳比较频繁的问题，节约流量电量，建议升级到最新版本；
2. 修复呼叫时对方不在线，不能正确显示通话结束原因的问题；
3. 修复某些特殊情况下获取群成员列表时crash的问题；
4. 修复某些特殊情况下退出时crash的问题；

Demo：

1. demo中增加音视频参数设置页；

## 版本 V3.2.1 2016-11-12

新功能/优化：

1. 聊天室列表支持分页获取
2. 发起电话的接口增加ext参数，方便用户自定义内容
3. EMOption中增加setUseHttps()的接口
4. 优化会话加载的速度

Bug fix:

1. 修复使用视音频后可能导致手机外放没有声音的bug
2. 修复发送消息后马上删除附件可能导致手机crash的bug
3. 修复音视频呼叫在某些魅蓝手机上会卡死的bug
4. 修复demo中呼叫时没有铃声的bug
5. 修复了视频通话时使用后置摄像头时图像显示不正确的bug

## 版本 V3.2.0 2016-10-15

音视频包含大量升级改进，细节请参考集成文档

- 增强的自适应视频质量算法，根据网络环境动态调整清晰度；
- 优化了语音算法，通话更清晰；
- 支持高清视频，画质更细腻；
- 支持客户端视频和语音数据回调，；
- 支持横屏和竖屏自由转换；
- 支持画面fit和fill模式；

红包功能改进：

- 增加个人间转账功能
- 增加拆红包音效

其他改进：

- cmd消息增加“em_” 和 “easemob::” 开头的action为内部保留字段；
- Fix 个别情况下会话未读消息数显示不准确的bug；
- Fix 个别情况下获取联系人不正确的bug；
- Fix 登录户马上加入聊天室某些情况下会失败的bug；
- 发送语音或者视频时，如果文件内容过小会给出提示；
- 优化读取数据库的性能；

## 版本 V3.1.5 2016-8-26

1. 修改一些api名称，主要针对一些拼写错误的api,具体变动请查看[3.1.5api修改](https://docs-im.easemob.com/im/200androidclientintegration/3.1.5apichange)
2. 优化读取联系人的速度；
3. 修复在logout方法的回调里立刻调用login方法不能登录的bug；
4. 修复https安全漏洞，提高安全性；
5. 修复实时通话时暂停音频不生效的bug；
6. 修复使用网线连接时`NetUtils.hasDataConnection()`判断为false的bug；
7. 修复发送消息时导致memory leak的bug；

## 版本 V3.1.4 2016-7-8

新功能/优化：

1. 支持华为推送
2. 聊天室获取详情后可以通过相应api获取到成员列表及成员数
3. easeui及demo增加@消息

红包相关:

1. 支持群内的专属红包，只有指定用户才能抢红包；
2. 支持支付宝；
3. 支持系统发的群红包，用户只能看到自己的领取情况；
4. 支持绑定多张银行卡，支持解绑银行卡；
5. 零钱页支持充值；
6. 改版零钱页；
7. 支持上传身份证照片做第三通道验证；
8. 红包UI细节打磨，包括双title和各个页面细节，安卓和iOS文案统一；
9. 错误信息梳理，关键错误基于对话框引导；
10. 服务端性能数倍的提升；
11. 红包数据平台完善统计项；
12. 其他优化：优化代码结构，剥离第三方库减少和开发者库的冲突；透传消息仅给发红包用户而非群内全部用户；优化token获取和更新机制；修复若干bug。

## 版本 V3.1.3 R2 2016-6-15

1. 修复R1版本中第三方app或者sdk不能捕捉到app crash的问题
2. 修复R1版本中在Android4.2.2以下系统中使用实时通话crash的问题

## 版本 V3.1.3 2016-6-3

新功能/优化：

1. 消息支持按照本地时间或服务器时间排序
2. 实时音视频支持动态码率
3. Demo支持红包功能(单聊及群聊红包)
4. Demo适配了Android 6.0运行时权限，现在把targetSdkVersion设到23程序也能正常运行

Bug fix:

1. 修复自动同意好友请求有延迟的问题
2. 修复在targetSdkVersion设为23时，视频通话可能crash的问题

## 版本 V3.1.2 R2 2016-4-29

修复 R1 版本 4G 情况下调用`NetUtils.hasDataConnection()`方法返回 false 的 bug。

## 版本 V3.1.2 2016-4-25

新功能：

1. 视频通话增加切换摄像头 API：EMClient.getInstance().callManager().switchCamera()。
2. 新增消息搜索 API：conversation.searchMsgFromDB()。
3. 支持设置和获取 long 类型的扩展字段。
4. 加快 APP 从后台切到前台时的重连速度。
5. 优化 GCM 推送。

Bug fix:

1. 修复某些手机发送系统表情时对方接到为乱码或空白的 bug。
2. 修复上一个版本发送图片消息时，如果是小图会删除原图的 bug。

## 版本 V3.1.1 2016-4-1

新功能：

1. 音视频增加弱网/断网检测功能。
2. 音视频增加音频、视频流暂停、恢复功能。
3. 音视频增加录制功能。
4. 发送图片默认压缩图片，节约流量。

## 版本 V3.1.0 2016-3-7

新功能：

1. 增加了音视频功能，用户可以建立一对一的音频通话，视频通话。
2. 增加 Android studio support。
3. 增加 x86 版本动态库，可以在模拟器上调试。

Bug fix:

1. 修复了扩展字段解析的问题。
2. 修复了用户 id 中有下划线时，会话中 id 显示不完整的问题。
3. 修复了某些情况下创建 cmd 类型消息失败的问题。

## 版本 V3.0.1 2016-2-26

1. 修复从 2.x 版本升级到 3.0 版本覆盖安装后某些会话不能显示出现的问题。
2. 修复某些情况下上传推送相关的信息不成功的问题。

## 版本 V3.0.0 2016-2-19

1. 全新的通信协议：全新的基于消息同步的私有协议，在不稳定网络环境下更稳定更省流量，确保消息投递的可靠、顺序以及实时性，并具有更高的安全性。同时提供了更好的扩展性，将支持更多的对接和设备同步场景。
2. 全新的 SDK：全面重构，将核心通信模块做了更好的封装；简化了接口，结构更清晰，集成更容易；提升了登录速度和弱网络环境下的可靠性编辑。