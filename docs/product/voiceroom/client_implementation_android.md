# 客户端实现

## 场景描述

本文介绍如何通过环信 IM SDK 和 Agora RTC SDK 在 Android 项目里实现语聊房的主要功能。

## 技术原理

### 房间管理

语聊房 Demo 内部依赖环信 IM 聊天室与 Agora RTC 频道。

以下为房间管理流程图。

![img](@static/images/voiceroom/voiceroom_mgmt.png)

Demo 中创建或加入语聊房的流程如下：

1. 启动 Demo。在 `application` 中调用 `ChatroomConfigManager.getInstance.initRoomConfig` 方法初始化环信 IM SDK。
2. 利用手机号和验证码登录环信 IM。
3. 登录 IM 后，通过 App Server 创建语聊房。成功后，房间创建者成为房主自动加入语聊房并跳转至语聊房页面。
4. 进入房间后加入环信 IM 聊天室和 RTC 频道。
   首先检查是否具有 RTC 所需权限。获取到所需权限并得到授权后执行 `onPermissionGrant` 方法，调用 `initSdkJoin` 进行 RTC 初始化（初始化 RTC 加入频道需要的参数由登录时由 App Server 返回）。
5. 检查是否成功加入环信 IM 聊天室 和 RTC 频道。
   - 若成功加入，房主可以发送本地音频流和消息，观众可以发消息。
   - 若未成功加入，则退出房间，返回房间列表页面。
6. 退出房间。

语聊房的用户角色如下表所示：

| 角色 | 描述                |
| :--- | :-------------------------- |
| 房主 | 语聊房创建者，在 Demo 中占用 0 号麦位，不可修改。房主可以接收、发送音频流和消息。                    |
| 主播 | 进入语聊房后，通过上麦成为主播，可以接收、发送音频流和消息。                                         |
| 观众 | 进入语聊房后，未进行上麦的成员只能发送和接收消息。申请上麦或房主邀请上麦成功后，可以和主播实时互动。 |

语聊房的相关操作如下表所示：

| 操作       | 描述               |
| :--------- | :---------------------------------------- |
| 创建房间   | 房主调用 App Server 的 `ChatroomHttpManager.getInstance.createRoom` 方法创建语聊房，创建成功后自动加入语聊房。房主自动上麦成为主播，更新房间内麦位信息。<br/> 创建语聊房前，房主调用 `ChatroomConfigManager.getInstance.initRoomConfig` 方法初始化环信 IM SDK。 |
| 加入房间   | 用户调用 App Server 的 `ChatroomHttpManager.getInstance.joinRoom` 方法加入语聊房。加入语聊房前，首先调用 `ChatroomHttpManager.getInstance.loginWithToken` 方法登录环信 IM，然后调用 `initSdkJoin` 进行 RTC 初始化。                                             |
| 离开房间   | 观众或主播可调用 `ChatroomHttpManager.getInstance.leaveRoom` 方法离开语聊房。房主离开语聊房，语聊房对象自动销毁，其他成员自动离开语聊房。           |
| 发送音频流 | 观众或主播可调用 `RtcRoomController.get.joinChannel` 方法发送音频流。      |
| 发送消息   | 语聊房内的用户可调用 `ChatroomHelper.getInstance.sendTextMsg` 或者 `CustomMsgHelper.getInstance.sendCustomMsg` 方法发送消息。观众也可以调用 `ChatroomHelper.getInstance.sendGiftMsg` 方法发送礼物消息。                  |

### 麦位管理

麦位管理流程图如下所示：

![img](@static/images/voiceroom/voiceroom_seatmgmt.png)

麦位相关操作如下表所示：

| 操作         | 描述        |
| :----------- | :------------------ |
| 邀请上麦     | 房主调用 `ChatroomHttpManager.getInstance.invitationMic` 方法邀请观众上麦。观众收到 `ChatroomListener.receiveInviteSite` 回调，选择是否上麦。<br/> - 观众调用 `ChatroomHttpManager.getInstance.agreeMicInvitation` 方法同意上麦，成为主播，房间内所有用户会收到 `ChatroomListener.roomAttributesDidUpdated`，更新房间内麦位信息。<br/> - 观众调用 `ChatroomHttpManager.getInstance.rejectMicInvitation` 方法拒绝上麦，房主收到 `ChatroomListener receiveInviteRefusedSite` 回调。 |
| 申请上麦     | 观众调用 `ChatroomHttpManager.getInstance.submitMic` 方法向房主申请上麦。房主收到 `ChatroomListener.receiveApplySite` 回调，选择同意或拒绝申请。<br/> - 房主调用 `ChatroomHttpManager.getInstance.applySubmitMic` 方法同意上麦申请，房间内所有用户会收到 `ChatroomListener roomAttributesDidUpdated` 回调，更新房间内麦位信息。<br/> - 房主调用 `ChatroomHttpManager.getInstance.rejectSubmitMic` 方法拒绝上麦申请，申请者收到 `ChatroomListener receiveDeclineApply` 回调。      |
| 撤销上麦申请 | 观众向房主申请上麦后，可以调用 `ChatroomHttpManager.getInstance.cancelSubmitMic` 方法撤销上麦申请。        |
| 下麦         | 下麦分为主动和被动两种方式：<br/>- 主动下麦：主播可调用 `ChatroomHttpManager.getInstance.leaveMic` 方法下麦成为观众。<br/>- 被踢下麦：房主调用 `ChatroomHttpManager.getInstance.kickMic` 方法对所在麦位主播发起下麦指令。<br/>对于这两种下麦方式，房间内所有用户都会收到 `ChatroomListener.roomAttributesDidUpdated` 回调，更新房间内麦位信息。                                                            |
| 开麦         | 房主和主播调用 `ChatroomHttpManager.getInstance.cancelCloseMic` 方法开麦，发言时房间内其他用户可听到。房间内所有用户会收到 `ChatroomListener roomAttributesDidUpdated` 回调，更新麦位状态。         |
| 关麦         | 房主和主播调用 `ChatroomHttpManager.getInstance.closeMic` 方法关麦，关闭自己的声音。房间内所有用户会收到 `ChatroomListener roomAttributesDidUpdated` 回调，更新麦位状态。  |
| 禁麦         | 房主调用 `ChatroomHttpManager.getInstance.muteMic` 方法禁麦，不允许指定连麦主播发言，该主播的音频流将关闭。包括主播在内的房间内所有用户会收到 `ChatroomListener roomAttributesDidUpdated` 回调，更新麦位状态。 |
| 解禁麦位     | 房主调用 `ChatroomHttpManager.getInstance.cancelMuteMic` 方法解禁麦位，恢复连麦主播的发言权限，即恢复该麦位主播的音频流。包括主播在内的房间内所有用户会收到 `ChatroomListener.roomAttributesDidUpdated` 回调，更新麦位状态。 |
| 锁麦         | 房主调用 `ChatroomHttpManager.getInstance.lockMic` 方法锁麦，不允许任何人上该麦位。锁麦时，若该麦位有主播连麦，该主播收到  `ChatroomListener.roomAttributesDidUpdated`  回调被踢下来成为普通观众。房间内所有用户也会收到该回调，更新房间内麦位信息。 |
| 解锁麦位     | 房主调用 `ChatroomHttpManager.getInstance.cancelLockMic` 方法解锁麦位，使指定麦位恢复空闲状态，观众可申请该麦位上麦。房间内所有用户会收到 `ChatroomListener roomAttributesDidUpdated` 回调，更新麦位状态。           |
| 换麦         | 主播调用 `ChatroomHttpManager.getInstance.exChangeMic` 方法换麦，即从当前麦位切换到另一个空闲麦位。包括主播在内的房间内所有用户会收到 `ChatroomListener roomAttributesDidUpdated` 回调，更新房间内麦位信息。 |

### 发送单向消息

![img](@static/images/voiceroom/voiceroom_oneway_msg.png)

邀请用户上麦的流程如下：

1. 房主调用 RESTFul API 邀请用户上麦。
2. App Server 收到邀请消息后，利用房主角色向用户发送该消息。
3. 用户同意邀请后调用 RESTful API 上麦。
4. App Server 设置聊天室属性通知房间全员刷新房间设置。

用户申请上麦的流程如下：

1. 用户调用 RESTful 接口申请上麦。
2. App Server 收到上麦申请消息后以用户角色向房主发送该消息。
3. 房主收到上麦申请后调用 RESTful API 同意上麦。
4. App Server 设置聊天室属性通知房间全员刷新房间设置。

### 发送礼物消息

![img](@static/images/voiceroom/voiceroom_gift_msg.png)

发送礼物消息的流程如下：

1. 用户 A 发送礼物详情到 App Server。
2. App Server 统计礼物信息后对用户 A 返回响应。
3. SDK 将礼物消息发送到语聊房。

## 前提条件

- Android Studio 3.0 或以上版本；
- Android SDK API 等级 23 或以上；
- Android 6.0 或以上版本的设备；
- 有效的环信 IM 开发者账号和 App key，详见[环信即时通讯云控制台](https://console.easemob.com/user/login)；
- [有效的 Agora 项目，获取项目的 App ID 以及一个 RTC Token，实现语音通话](https://docportal.shengwang.cn/cn/voice-call-4.x/start_call_audio_android_ng?platform=Android)；
- 如果你的网络环境部署了防火墙，请联系环信技术支持设置白名单。

## 项目配置

| 产品                | SDK 下载                  | 集成文档                                                                    |
| :------------------ | :------------------------ | :------------------------------------------------ |
| 环信即时通讯 IM SDK | 环信即时通讯 IM SDK 3.9.8 | [发送和接收消息](/document/android/message_send_receive.html)           |
| Agora RTC SDK       | Agora RTC SDK 4.0.1       | [实现音频通话](https://docportal.shengwang.cn/cn/voice-call-4.x/start_call_audio_android_ng?platform=Android)|

## 基础 API 参考

本节提供环信 IM SDK 和 Agora RTC SDK 的基本 API 参考。

### 初始设置

加入语聊房前，进行[环信 IM SDK 初始化](/document/android/quickstart.html#实现单聊)和 [Agora RTC 初始化](https://docportal.shengwang.cn/cn/voice-call-4.x/start_call_audio_android_ng?platform=Android#处理-android-系统逻辑)设置。

### App Server 相关

以下表格为 App Server 的基础 API。

房间管理 API 如下表所示：

| API                                                 | 实现功能               |
| :-------------------------------------------------- | :--------------------- |
| [`ChatroomHttpManager.getInstance.getRoomDetails`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)    | 获取指定语聊房的信息。 |
| [`ChatroomHttpManager.getInstance.createRoom`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)        | 创建房间。             |
| [`ChatroomHttpManager.getInstance.deleteRoom`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)        | 根据房间 ID 删除房间。     |
| [`ChatroomHttpManager.getInstance.updateRoomInfo`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)    | 修改语聊房信息。       |
| [`ChatroomHttpManager.getInstance.getRoomFromServer`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java) | 获取房间列表。         |
| [`ChatroomHttpManager.getInstance.getRoomMembers`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)    | 获取房间内的成员。     |
| [`ChatroomHttpManager.getInstance.joinRoom`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)          | 加入房间。             |
| [`ChatroomHttpManager.getInstance.checkPassword`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)     | 校验密码。             |
| [`ChatroomHttpManager.getInstance.leaveRoom`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)         | 离开房间。             |
| [`ChatroomHttpManager.getInstance.kickRoomMember`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)    | 踢出房间。             |

麦位管理 API 如下表所示：

| API                                                   | 实现功能           |
| :---------------------------------------------------- | :----------------- |
| [`ChatroomHttpManager.getInstance.getMicInfo`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)          | 获取麦位信息。     |
| [`ChatroomHttpManager.getInstance.getApplyMicList`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)     | 获取上麦申请列表。 |
| [`ChatroomHttpManager.getInstance.invitationMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)       | 邀请上麦。         |
| [`ChatroomHttpManager.getInstance.agreeMicInvitation`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)  | 用户同意上麦邀请。 |
| [`ChatroomHttpManager.getInstance.rejectMicInvitation`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java) | 用户拒绝上麦邀请。 |
| [`ChatroomHttpManager.getInstance.submitMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)           | 提交上麦申请。     |
| [`ChatroomHttpManager.getInstance.cancelSubmitMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)     | 撤销上麦申请。     |
| [`ChatroomHttpManager.getInstance.rejectSubmitMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)     | 拒绝上麦申请。     |
| [`ChatroomHttpManager.getInstance.applySubmitMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)      | 同意上麦申请。     |
| [`ChatroomHttpManager.getInstance.closeMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)            | 关麦。             |
| [`ChatroomHttpManager.getInstance.cancelCloseMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)      | 开麦。             |
| [`ChatroomHttpManager.getInstance.leaveMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)            | 主动下麦。         |
| [`ChatroomHttpManager.getInstance.muteMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)             | 封禁指定麦位。     |
| [`ChatroomHttpManager.getInstance.cancelMuteMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)       | 解禁指定麦位。     |
| [`ChatroomHttpManager.getInstance.exChangeMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)         | 换麦。             |
| [`ChatroomHttpManager.getInstance.kickMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)             | 踢用户下麦。       |
| [`ChatroomHttpManager.getInstance.lockMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)             | 锁定麦位。         |
| [`ChatroomHttpManager.getInstance.cancelLockMic`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)       | 解锁麦位。         |

礼物榜单 API 如下表所示：

| API                                           | 实现功能           |
| :-------------------------------------------- | :----------------- |
| [`ChatroomHttpManager.getInstance.getGiftList`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java) | 获取赠送礼物榜单。 |
| [`ChatroomHttpManager.getInstance.sendGift`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)    | 赠送礼物。         |

### Agora RTC 相关

| API                                                          | 实现功能                |
| :----------------------------------------------------------- | :---------------------- |
| [initializeAndJoinChannel](https://docportal.shengwang.cn/cn/voice-call-4.x/start_call_audio_android_ng?platform=Android#实现语音通话逻辑) | 初始化 app 并加入频道。 |

其他 API，详见[声网官网](https://docportal.shengwang.cn/cn/voice-call-4.x/API%20Reference/java_ng/API/rtc_api_overview_ng.html)。

### Easemob IM SDK 相关

Easemob IM SDK 的 API 如下表所示：

| API                                            | 实现功能        |
| :--------------------------------------------- | :-------------- |
| [`EMClient.getInstance.init`](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_client.html#a739c181ecd146af520cde6076e4b4de4)                    | 初始化 IM SDK。 |
| [`EMClient.getInstance.chatManager.sendMessage`](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_manager.html#ad50be7183f088c415b9507bc7ce792e6) | 发送消息。      |

### 语聊房监听

 初始化 SDK（ChatroomConfigManager.getInstance.initRoomConfig）时已注册了连接监听、消息监听、聊天室监听，可以实现 `ChatroomListener` 接口。

| API                                                          | 实现功能                               |
| :----------------------------------------------------------- | :------------------------------------- |
| [`ChatroomHttpManager.getInstance.receiveTextMessage`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)         | 收到普通文本消息。                     |
| [`ChatroomHttpManager.getInstance.receiveGift`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)                | 收到礼物消息。                         |
| [`ChatroomHttpManager.getInstance.receiveApplySite`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)           | 接收申请消息。                         |
| [`ChatroomHttpManager.getInstance.receiveCancelApplySite`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)     | 接收取消申请消息。                     |
| [`ChatroomHttpManager.getInstance.receiveInviteSite`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)          | 接收邀请消息。                         |
| [`ChatroomHttpManager.getInstance.receiveInviteRefusedSite`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)   | 接收拒绝邀请消息。                     |
| [`ChatroomHttpManager.getInstance.receiveDeclineApply`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)        | 接收拒绝申请消息。                     |
| [`ChatroomHttpManager.getInstance.onMemberExited`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)             | 用户离开房间。                         |
| [`ChatroomHttpManager.getInstance.announcementChanged`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)        | 聊天室公告更新。                       |
| [`ChatroomHttpManager.getInstance.userBeKicked`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)               | 聊天室成员被踢出房间。                 |
| [`ChatroomHttpManager.getInstance.roomAttributesDidUpdated`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)   | 聊天室属性变更。                       |
| [`ChatroomHttpManager.getInstance.roomAttributesDidRemoved`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)   | 聊天室属性移除。                       |
| [`ChatroomHttpManager.getInstance.onTokenWillExpire`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)          | Token 即将过期。                       |
| [`ChatroomHttpManager.getInstance.onTokenExpired`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)             | Token 已过期。                         |
| [`ChatroomHttpManager.getInstance.receiveSystem`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)              | 收到系统消息（目前用来实现成员加入）。 |
| [`ChatroomHttpManager.getInstance.voiceRoomUpdateRobotVolume`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java) | 机器人音量更新。                       |
| [`ChatroomHttpManager.getInstance.onRoomDestroyed`](https://github.com/apex-wang/voiceroom_demo_android/blob/dev/business/chatroom/src/main/java/com/easemob/chatroom/general/net/ChatroomHttpManager.java)            | 聊天室被销毁。                         |

### 音频相关

主播调用以下方法设置音频流：

| API     | 实现功能                       |
| :--------------- | :------------------- |
| [`setAudioProfile [2/2\]`](https://docportal.shengwang.cn/cn/voice-call-4.x/API%20Reference/ios_ng/v4.2.2/API/rtc_api_overview_ng.html#api_setaudioprofile2)   | 设置音频编码属性。   |
| [`muteLocalAudioStream`](https://docportal.shengwang.cn/cn/voice-call-4.x/API%20Reference/ios_ng/v4.2.2/API/rtc_api_overview_ng.html#api_mutelocalaudiostream) | 主播可以关闭或开启本地麦克风。 |
| [`adjustRecordingSignalVolume`](https://docportal.shengwang.cn/cn/voice-call-4.x/API%20Reference/ios_ng/v4.2.2/API/rtc_api_overview_ng.html#api_adjustrecordingsignalvolume) | 调节人声音量。  |

### 附加功能

#### 最佳音效

设置最佳音效，示例代码如下：

```
annotation class SoundSelection {
                    companion object {
                        const val SocialChat = 0        //社交语聊

                        const val Karaoke = 1           //在线 K 歌

                        const val GamingBuddy = 2       //游戏陪玩

                        const val SoundCardHQ = 3       //专业主播
                    }
                }

                 rtcEngine?.apply {
            when (config.soundType) {
                SoundSelection.SocialChat, SoundSelection.Karaoke -> { // 社交语聊，KTV
                    setChannelProfile(Constants.CHANNEL_PROFILE_LIVE_BROADCASTING)
                    setAudioProfile(Constants.AUDIO_PROFILE_MUSIC_HIGH_QUALITY)
                    setAudioScenario(Constants.AUDIO_SCENARIO_GAME_STREAMING)
                }
                SoundSelection.GamingBuddy -> { // 游戏陪玩
                    setChannelProfile(Constants.CHANNEL_PROFILE_COMMUNICATION)
                }
                else -> { //专业主播
                    setAudioProfile(Constants.AUDIO_PROFILE_MUSIC_HIGH_QUALITY)
                    setAudioScenario(Constants.AUDIO_SCENARIO_GAME_STREAMING)
                    setParameters("{\"che.audio.custom_payload_type\":73}")
                    setParameters("{\"che.audio.custom_bitrate\":128000}")
                    // setRecordingDeviceVolume(128) 4.0.1 上才支持
                    setParameters("{\"che.audio.input_channels\":2}")
                }
            }
        }
```

#### AI 降噪

AI 降噪插件使用声网人工智能噪声消除算法，能够让远程交流和面对面交谈一样实时。

可以开启或关闭 AI 降噪以及设置中级降噪和高级降噪。示例代码如下：

```
internal class AgoraRtcDeNoiseEngine : RtcBaseDeNoiseEngine<RtcEngineEx>() {

    override fun closeDeNoise(): Boolean {
        engine?.apply {
            setParameters("{\"che.audio.ains_mode\":0}")
            setParameters("{\"che.audio.nsng.lowerBound\":80}")
            setParameters("{\"che.audio.nsng.lowerMask\":50}")
            setParameters("{\"che.audio.nsng.statisticalbound\":5}")
            setParameters("{\"che.audio.nsng.finallowermask\":30}")
            setParameters("{\"che.audio.nsng.enhfactorstastical\":200}")
        }
        return true
    }

    override fun openMediumDeNoise(): Boolean {
        engine?.apply {
            setParameters("{\"che.audio.ains_mode\":2}")
            setParameters("{\"che.audio.nsng.lowerBound\":80}")
            setParameters("{\"che.audio.nsng.lowerMask\":50}")
            setParameters("{\"che.audio.nsng.statisticalbound\":5}")
            setParameters("{\"che.audio.nsng.finallowermask\":30}")
            setParameters("{\"che.audio.nsng.enhfactorstastical\":200}")
        }
        return true
    }

    override fun openHeightDeNoise(): Boolean {
        engine?.apply {
            setParameters("{\"che.audio.ains_mode\":2}")
            setParameters("{\"che.audio.nsng.lowerBound\":10}")
            setParameters("{\"che.audio.nsng.lowerMask\":10}")
            setParameters("{\"che.audio.nsng.statisticalbound\":0}")
            setParameters("{\"che.audio.nsng.finallowermask\":8}")
            setParameters("{\"che.audio.nsng.enhfactorstastical\":200}")
        }
        return true
    }
}
```
