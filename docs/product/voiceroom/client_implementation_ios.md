# 客户端实现

## 场景描述

本文介绍如何通过环信 IM SDK 和 Agora Audio SDK 在你的 iOS 项目里实现语聊房的主要功能。

## 技术原理

### 房间管理

语聊房 SDK 内部依赖环信 IM 聊天室（Chatroom）与 Agora Audio 的音频房间（RTC Channel）。

语聊房内用户角色说明如下：

| 角色 | 描述                                                         |
| ---- | ------------------------------------------------------------ |
| 房主 | 语聊房创建者，在 Demo 中占用 0 号麦位，不可修改。房主可以接收、发送音频流。 |
| 主播 | 进入语聊房后，通过上麦成为主播，可以接收、发送音频流。       |
| 观众 | 进入语聊房后，接收音频流。申请上麦或房主邀请上麦后，可以和主播实时互动。 |

以下为房间管理流程图。

![img](@static/images/voiceroom/voiceroom_mgmt.png)

房间管理流程如下：

1. 用户利用手机号和验证码登录环信 IM。
2. 房主可创建语聊房，普通用户加入语聊房。
3. 加入环信 IM 和 RTC 频道。
4. 进入语聊房，检查是否成功加入环信 IM 和 RTC 频道。
   - 若成功加入，房主可以发送本地音频流和消息，观众可以发消息。
   - 若未成功加入，退出房间，返回房间列表页面。
5. 退出房间。

房间相关操作如下表所示：

| 操作       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| 创建房间   | 房主通过 App Server 创建语聊房，创建成功后自动加入语聊房。房主自动上麦成为主播，更新房间内麦位信息。加入语聊房前，调用 `VoiceRoomIMManager.configIM` 方法初始化环信 IM，调用 `ASRTCKit.getSharedInstance` 方法初始化 Agora Audio。 |
| 加入房间   | 用户可调用 `joinRoom` 方法加入语聊房。加入语聊房前，调用 `VoiceRoomIMManager.loginIM` 方法登录环信 IM，然后调用 `VoiceRoomIMManager.joinChatRoom` 和 `self.rtcKit.joinChannel` 方法加入聊天室和 RTC 频道，成功后再加入语聊房。 |
| 离开房间   | 观众或主播可调用 `leaveRoom()` 方法离开语聊房。房主离开语聊房，语聊房对象自动销毁，其他成员自动离开语聊房。 |
| 发送音频流 | 观众或主播可调用 `self.rtcKit.joinChannel` 方法发送音频流。  |
| 发送消息   | 语聊房内的用户可调用 `VoiceRoomIMManager.sendMessage` 或者 `VoiceRoomIMManager.sendCustomMessage` 方法发送消息。观众也可以调用 `VoiceRoomIMManager.sendGift` 方法发送礼物消息。 |

### 麦位管理

以下为麦位管理流程图：

![img](@static/images/voiceroom/voiceroom_seatmgmt.png)

麦位相关操作如下所示：

| 操作     | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| 邀请上麦 | 房主调用 `inviteUserToMic` RESTful API 邀请观众上麦。观众收到 `receiveInviteSite` 回调，选择是否同意上麦。<br/> - 观众调用 `agreeInvite` RESTful API 同意上麦，成为主播，App Server 设置聊天室属性。同时，房间内所有用户会收到该观众连麦的回调 `VoiceRoomIMDelegate.chatroomAttributesDidUpdate`，更新房间内麦位信息。 | 
| 申请上麦 | 观众调用 `requestSpeak` 方法向房主申请上麦。房主收到 `VoiceRoomIMManager.receiveApplySite` 回调，选择同意或拒绝申请。<br/> - 房主调用 `agreeUserApply` 方法同意上麦申请，申请者收到 `VoiceRoomIMDelegate.chatroomAttributesDidUpdate` 回调并调用 `self.rtcKit.joinChannel` 方法成为主播。同时，房间内所有用户会收到该观众连麦的回调 `VoiceRoomIMDelegate.chatroomAttributesDidUpdate`，并更新房间内麦位信息。<br/> - 房主调用 `refuseApply` RESTful API 方法拒绝上麦申请。 |
| 下麦     | 下麦分为主动和被动两种方式：<br/> - 主动下麦：主播可调用 `leaveMic` 方法下麦成为观众。<br/>- 被踢下麦：房主调用 `kickOff` RESTful API 对主播发起下麦指令。该连麦主播收到 `VoiceRoomIMDelegate.chatroomAttributesDidUpdate` 回调，然后下麦成为观众。<br/> 对于这两种下麦方式，房间内所有用户都会收到 `VoiceRoomIMDelegate.chatroomAttributesDidUpdate` 回调，更新房间内麦位信息。 |
| 禁麦     | 房主调用 `muteMic` RESTful API 禁麦，不允许指定连麦主播发言，该主播的音频流将关闭。包括主播在内的房间内所有用户会收到 `VoiceRoomIMDelegate.chatroomAttributesDidUpdate` 回调，更新房间内麦位信息。 |
| 解禁麦位 | 房主调用 `unmuteMic` RESTful API 解禁麦位，恢复连麦主播的发言权限，即恢复该麦位主播的音频流。包括主播在内的房间内所有用户会收到 `VoiceRoomIMDelegate.chatroomAttributesDidUpdate` 回调，更新房间内麦位信息。 |
| 锁麦     | 房主调用 `lockMic` RESTful API 锁麦，不允许任何人上该麦位。锁麦时，若该麦位有主播连麦，该主播收到 `VoiceRoomIMDelegate.chatroomAttributesDidUpdate` 回调，被踢下来成为普通观众。房间内所有用户也会收到该回调，更新房间内麦位信息。 |
| 解锁麦位 | 房主调用 `unlockMic` RESTful API 解锁麦位，使指定麦位恢复空闲状态，观众可以在该麦位申请上麦。房间内所有用户会收到 `VoiceRoomIMDelegate.chatroomAttributesDidUpdate` 回调，更新房间内麦位信息。 |
| 换麦     | 主播可调用 `changeMic` 方法换麦，即从当前麦位切换到另一个空闲麦位。包括主播在内的房间内所有用户会收到 `VoiceRoomIMDelegate.chatroomAttributesDidUpdate` 回调，更新房间内麦位信息。 |

### 发送单向消息流程图

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

### 发送礼物消息流程图

![img](@static/images/voiceroom/voiceroom_gift_msg.png)

发送礼物消息的流程如下：

1. 用户 A 发送礼物详情到 App Server。
2. App Server 统计礼物信息后对用户 A 返回响应。
3. SDK 将礼物消息发送到语聊房。

## 前提条件

- Xcode 13.0 或以上版本。
- CocoaPods。你可以参考 [CocoaPods 安装指南](https://guides.cocoapods.org/using/getting-started.html#getting-started) 安装。
- iOS 13.0 或以上版本的设备。部分模拟机可能无法支持本项目的全部功能，所以推荐使用真机。
- 有效的环信 IM 开发者账号和 App key，详见[环信即时通讯云控制台](https://console.easemob.com/user/login)。
- [有效的 Agora 项目，获取项目的 App ID 以及一个 RTC Token，实现语音通话](https://docportal.shengwang.cn/cn/voice-call-4.x/start_call_audio_ios_ng?platform=iOS)。
- 如果你的网络环境部署了防火墙，请联系环信技术支持设置白名单。

## 项目配置

| 产品                | SDK 下载                           | 集成文档                                                     |
| ------------------- | ---------------------------------- | ------------------------------------------------------------ |
| 环信即时通讯 IM SDK | 环信即时通讯 IM SDK 3.9.8 或以上版本 | [发送、接收消息、聊天室属性 KV](/document/ios/message_send_receive.html) |
| Agora Audio SDK     | 声网 RTM SDK 4.0.1                 | [实现音频通话](https://docportal.shengwang.cn/cn/voice-call-4.x/start_call_audio_ios_ng?platform=iOS) |

## 基本 API 参考

本节提供环信 IM SDK 和 Agora Audio SDK 的基本 API 参考。

- [App Server API 文档](https://github.com/easemob/voiceroom_demo_ios/blob/dev/redoc-static.html.zip)。该文档为静态 HTML 页面，需下载后查看。

- [Demo 中的方法与 App Server API 之间的映射](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift)。

### 房间管理 API 列表

| API                                                          | 实现功能               |
| ------------------------------------------------------------ | ---------------------- |
| [VoiceRoomBusinessApi.fetchRoomInfo](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 获取指定语聊房的信息。 |
| [VoiceRoomBusinessApi.createRoom](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 创建房间。             |
| [VoiceRoomBusinessApi.deleteRoom](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 根据房间 ID 删除房间。     |
| [VoiceRoomBusinessApi.modifyRoomInfo](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 修改语聊房信息。       |
| [VoiceRoomBusinessApi.fetchRoomList](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 获取房间列表。         |
| [VoiceRoomBusinessApi.fetchRoomMembers](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 获取房间内的成员。     |
| [VoiceRoomBusinessApi.joinRoom](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 加入房间。             |
| [VoiceRoomBusinessApi.validatePassWord](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 校验密码。             |
| [VoiceRoomBusinessApi.leaveRoom](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 离开房间。             |
| [VoiceRoomBusinessApi.kickUser](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 踢出房间。             |

### 麦位管理 API 列表

| API                                                          | 实现功能           |
| ------------------------------------------------------------ | ------------------ |
| [VoiceRoomBusinessApi.fetchMicsInfo](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 获取麦位信息。     |
| [VoiceRoomBusinessApi.fetchApplyMembers](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 获取上麦申请列表。 |
| [VoiceRoomBusinessApi.inviteUserToMic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 邀请上麦。         |
| [VoiceRoomBusinessApi.agreeInvite](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 用户同意上麦邀请。 |
| [VoiceRoomBusinessApi.refuseInvite](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 用户拒绝上麦邀请。 |
| [VoiceRoomBusinessApi.submitApply](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 提交上麦申请。     |
| [VoiceRoomBusinessApi.cancelApply](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 撤销上麦申请。     |
| [VoiceRoomBusinessApi.refuseApply](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 拒绝上麦申请。     |
| [VoiceRoomBusinessApi.agreeApply](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 同意上麦申请。     |
| [VoiceRoomBusinessApi.closeMic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 关麦。             |
| [VoiceRoomBusinessApi.cancelCloseMic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 开麦。             |
| [VoiceRoomBusinessApi.leaveMic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 主动下麦。         |
| [VoiceRoomBusinessApi.muteMic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 封禁指定麦位。     |
| [VoiceRoomBusinessApi.unmuteMic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 解禁指定麦位。     |
| [VoiceRoomBusinessApi.exchangeMic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 换麦。             |
| [VoiceRoomBusinessApi.kickMic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 踢用户下麦。       |
| [VoiceRoomBusinessApi.lockMic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 锁定麦位。         |
| [VoiceRoomBusinessApi.unlockMic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 解锁麦位。         |

麦位相关方法，详见 [VoiceRoomViewController+Mic](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Business/VoiceChat2.0/Controller/VoiceRoomViewController%2BMic.swift) 文件。

### 礼物榜单 API 列表

| API                                                          | 实现功能           |
| ------------------------------------------------------------ | ------------------ |
| [VoiceRoomBusinessApi.fetchGiftContribute](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 获取赠送礼物榜单。 |
| [VoiceRoomBusinessApi.giftTo](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomBusinessApi.swift) | 赠送礼物。         |

### 对 HyphenateChat IM SDK 进行封装的类中的方法

| API                                                          | 实现功能                       |
| ------------------------------------------------------------ | ------------------------------ |
| [VoiceRoomIMManager.configIM](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomIMManager.swift) | 初始化环信 IM。                     |
| [VoiceRoomIMManager.loginIM](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomIMManager.swift) | 登录环信 IM。                       |
| [VoiceRoomIMManager.addChatRoomListener](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomIMManager.swift) | 添加 IM 消息以及聊天室回调监听。 |
| [VoiceRoomIMManager.removeListener](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Common/Network/VoiceRoomIMManager.swift) | 移除 IM 消息以及聊天室回调监听。 |

### Agora Audio iOS SDK 的 API 封装回调

| API                                                          | 实现功能          |
| ------------------------------------------------------------ | ----------------- |
| [AgoraRtcEngineKit.sharedEngine(withAppId: AgoraConfig.rtcId, delegate: nil)](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Compoment/AgoraRtcKit/ASRTCKit.swift) | 初始化 RTC。       |
| [ASRTCKit.joinVoicRoomWith](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Compoment/AgoraRtcKit/ASRTCKit.swift) | 加入 RTC 频道。 |
| [ASRTCKit.setClientRole](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Compoment/AgoraRtcKit/ASRTCKit.swift) | 设置 RTC 角色。     |
| [ASRTCKit.leaveChannel](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Compoment/AgoraRtcKit/ASRTCKit.swift) | 离开 RTC 频道。 |

### 初始化设置

加入语聊房前，进行[环信 IM SDK 初始化](http://docs-im-beta.easemob.com/document/android/quickstart.html#实现单聊)和 [Agora Audio 初始化](https://docportal.shengwang.cn/cn/voice-call-4.x/start_call_audio_ios_ng?platform=iOS#实现语音通话逻辑)设置。

### 加入/离开环信 IM 聊天室或者声网 RTC 频道

| API                                                          | 实现功能                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [joinChatroom](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_chatroom_manager-p.html#ac66d04fd0182c7499ed539c0ea610152) | 加入语聊房。房间内的观众会收到 `userDidJoinChatroom` 回调。用户加入语聊房后才能接收或发布音频流。 |
| [leaveChatroom](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_chatroom_manager-p.html#ac66d04fd0182c7499ed539c0ea610152) | 离开语聊房。其他成员收到 `userDidLeaveChatroom` 回调。房主离开语聊房后，房间对象自动销毁，其他成员会自动离开语聊房。 |
| [joinChannelbyToken](https://docs.agora.io/cn/voice-call-4.x/API Reference/ios_ng/API/class_irtcengine.html#api_irtcengine_joinchannel) | 加入 RTC 频道。用户加入语聊房后才能接收或发布音频流。房间内的观众会收到 `ASManagerDelegate.didRtcLocalUserJoinedOfUid` 回调。 |
| [leaveChannel](https://docportal.shengwang.cn/cn/voice-call-4.x/API%20Reference/ios_ng/v4.2.2/API/rtc_api_overview_ng.html#api_irtcengine_leavechannel) | 离开 RTC 频道。                                              |

通过 App Server 加入或离开语聊房的方法的示例代码如下：

```swift
// 加入语聊房
    func uploadStatus( status: Bool) {
        guard let roomId = self.roomInfo?.room?.room_id  else { return }
        VoiceRoomBusinessRequest.shared.sendPOSTRequest(api: .joinRoom(roomId: roomId), params: [:]) { dic, error in
            if let result = dic?["result"] as? Bool,error == nil,result {
                self.view.makeToast("Joined successful!".localized(),point: self.toastPoint, title: nil, image: nil, completion: nil)
            } else {
                self.didHeaderAction(with: .back,destroyed: false)
            }
        }
    }
// 离开语聊房
    @objc private func leaveRoom() {
        if let room_id = roomInfo?.room?.room_id {
            VoiceRoomBusinessRequest.shared.sendDELETERequest(api: .leaveRoom(roomId: room_id), params: [:]) { map, err in
                print(map?["result"] as? Bool ?? false)
            }
        }
    }
```

- 环信 IM 相关回调以及处理的方法，详见 [VoiceRoomViewController+IM](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Business/VoiceChat2.0/Controller/VoiceRoomViewController%2BIM.swift) 文件。

- 送礼物相关方法及其底部时间回调，详见 [VoiceRoomViewController+ChatBar](https://github.com/easemob/voiceroom_demo_ios/blob/dev/EasemobVoice_iOS/EasemobVoice_iOS/Business/VoiceChat2.0/Controller/VoiceRoomViewController%2BChatBar.swift) 文件。

### 音频相关

主播调用以下方法设置音频流：

| API                                                          | 实现功能                       |
| ------------------------------------------------------------ | ------------------------------ |
| [`setAudioProfile [2/2]`](https://docportal.shengwang.cn/cn/voice-call-4.x/API%20Reference/ios_ng/v4.2.2/API/rtc_api_overview_ng.html#api_setaudioprofile2) | 设置音频编码属性。             |
| [`muteLocalAudioStream`](https://docportal.shengwang.cn/cn/voice-call-4.x/API%20Reference/ios_ng/v4.2.2/API/rtc_api_overview_ng.html#api_mutelocalaudiostream) | 主播可以关闭或开启本地麦克风。 |
| [`adjustRecordingSignalVolume`](https://docportal.shengwang.cn/cn/voice-call-4.x/API%20Reference/ios_ng/v4.2.2/API/rtc_api_overview_ng.html#api_adjustrecordingsignalvolume) | 调节人声音量。                 |

### 附加功能

#### 最佳音效

调用 [`setAudioEffectPreset`](https://docportal.shengwang.cn/cn/voice-call-4.x/API%20Reference/ios_ng/v4.2.2/API/rtc_api_overview_ng.html#ariaid-title129) 方法，在不改变原声的性别特征的前提下，设置人声音效。设置音效后，频道内所有用户都能听到该效果。

```swift
    rtcKit.setChannelProfile(.liveBroadcasting)
    rtcKit.setAudioProfile(.musicHighQuality)
    rtcKit.setAudioScenario(.gameStreaming)
```

#### AI 降噪

AI 降噪插件使用声网人工智能噪声消除算法，能够让远程交流和面对面交谈一样实时。

可以开启或关闭 AI 降噪以及设置中级降噪和高级降噪。示例代码如下：

```swift
public func setAINS(with level: AINS_STATE) {
        switch level {
        case .high:
        rtcKit.setParameters("{\"che.audio.ains_mode\":2}")
        rtcKit.setParameters("{\"che.audio.nsng.lowerBound\":10}")
        rtcKit.setParameters("{\"che.audio.nsng.lowerMask\":10}")
        rtcKit.setParameters("{\"che.audio.nsng.statisticalbound\":0}")
        rtcKit.setParameters("{\"che.audio.nsng.finallowermask\":8}")
        rtcKit.setParameters("{\"che.audio.nsng.enhfactorstastical\":200}")
        case .mid:
        rtcKit.setParameters("{\"che.audio.ains_mode\":2}")
        rtcKit.setParameters("{\"che.audio.nsng.lowerBound\":80}")
        rtcKit.setParameters("{\"che.audio.nsng.lowerMask\":50}")
        rtcKit.setParameters("{\"che.audio.nsng.statisticalbound\":5}")
        rtcKit.setParameters("{\"che.audio.nsng.finallowermask\":30}")
        rtcKit.setParameters("{\"che.audio.nsng.enhfactorstastical\":200}")
        case .off:
        rtcKit.setParameters("{\"che.audio.ains_mode\":0}")
        rtcKit.setParameters("{\"che.audio.nsng.lowerBound\":80}")
        rtcKit.setParameters("{\"che.audio.nsng.lowerMask\":50}")
        rtcKit.setParameters("{\"che.audio.nsng.statisticalbound\":5}")
        rtcKit.setParameters("{\"che.audio.nsng.finallowermask\":30}")
        rtcKit.setParameters("{\"che.audio.nsng.enhfactorstastical\":200}")
    }
}
```