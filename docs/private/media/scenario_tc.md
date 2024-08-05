# 语音连麦聊天室集成介绍


## 前言
本文将简要分享几个语音聊天室的应用场景，并讲述基于环信 SDK ，实现语音连麦聊天室的步骤。
:::notice
`仅特定的私有化版本SDK支持语聊解决方案.` 开发者如有需求，请联系商务咨询。
:::

语音聊天是社交软件必备的功能，语音相比文字图片更丰富，比视频又更简便，是天然的社交工具。除了单纯的1对1语音或视频聊天，在实时音视频技术支持下，很多 APP 已经延伸出多人语聊房、语音电台、语音游戏、私人聊天房、KTV 语聊房等非常丰富的场景。

比如：
1. 语音电台：是目前很多社交APP的玩法。主播可以在直播间中给听众讲故事、脱口秀、唱歌，多种形式不胜枚举，观众也可以申请上麦与主播聊天互动，在聊天的基础上，加上了背景伴奏音以及通过消息系统来实现的文字消息功能，在这种模式下，可以提高用户的活跃度。

2. 语音游戏：也是语音聊天室的常见应用场景。支持在狼人杀、剧本杀，王者荣耀及吃鸡等游戏中实现语音开黑，为玩家创建音视频对话实时互动的场景，功能上与语音直播相似，只是在这个频道中，上麦下麦的玩法逻辑有所不同。

------

## Demo

<!--### Demo 体验

扫码体验，详情请查看[《TC-语音连麦聊天室使用指南》](https://mp.weixin.qq.com/s/PxoAomLBG5bL8ps2mVkkhA)

![img](https://docs-im.easemob.com/_media/im/other/integrationcases/tc.png?w=200&tok=75ff0b)

版本：V1.0

DEMO开发者名称：北京易掌云峰科技有限公司 [隐私协议](https://www.easemob.com/protocol) [用户权限](https://www.easemob.com/agreement)
-->
### Demo 源码

我们在 Github 已经提供了一套完整的 Demo，在 Demo 的基础上，开发者只需要不到1周的时间，对 UI 和功能做简单修改即可准备测试上线。

- [Android](https://github.com/easemob/liveroom-android)

- [iOS](https://github.com/easemob/liveroom-ios)



------

## 实现方案

语音聊天室需要满足的主要功能包括：
- 支持多人参与语音聊天
- 支持本地混音
- 多种连麦模式

要实现一个具备以上功能的语音聊天室，大致可以分为三步：**实现语音连麦、支持本地混音，多种连麦模式**的设计，基于设计需求，语音聊天室场景化方案的架构图与实现思路如下：<br>
![img](/images/privitization/tc_architecture.png)


------

### 实现语音连麦

基于开发者反馈，如果要通过自研的方法实现语音连麦，会存在如下问题：
- 需要自己部署服务器做好高并发处理；
- 需要对编解码器优化来解决回声、噪声问题；
- 需要有成熟的技术方案降低延迟、提高音质；
- 需要兼容各种网络环境下的用户体验等；

总体来讲，就是需要解决设备端网络中的语音连麦**稳定低延时问题与可用性问题**。而以上这些问题，环信已为开发者提供成熟的解决方案，并将相关接口封装于SDK 中，让开发者可以简单快速调用集成。 

**场景需求：观众上麦请求和主播通过上麦申请**<br>
在任意模式下，听众进入房间后可以允许发出上麦申请，房主同意后，听众可上麦，用户角色由听众变为了主播，主播要遵循房间模式来实现自己的功能。

**实现方案：通过会议属性实现**<br>
在语音聊天室 Demo 中，抢麦、主持、自由麦等模式，及包括各个模式中的上麦者均可通过会议属性实现，当会议属性发生更改时，会广播给房间内所有人。

------

#### 创建语聊房间

首先创建者通过 AppServer 创建并加入语聊房间，IM 聊天室。在房主通过 AppServer 创建并进入房间后，通过音视频提供的会议属性接口修改房间的会议属性，从而自定义一些房间的属性。

我们可以通过一张图，来了解创建语聊房间接口的调用逻辑：

![img](/images/privitization/tc_logic_create.png)

上图中每步涉及到的 iOS/Android 接口如下，其中部分调用到了 AppServer 的接口，开发者需要自己实现 AppServer 功能。

| 步骤                                                         | iOS API                                                      | Android API                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 1. 创建语聊房间                                               | AppServer API                                                |      Android与iOS调用接口相同                                                        |
| 2. [ 创建conference](rest_manage.html#创建会议) | AppServer API http://a1.easemob.com/{orgname}/{appname}/conferences POST |                                       Android与iOS调用接口相同                                                                  |
| 3. 创建 chatroom                                              | AppServer API http://a1.easemob.com/{orgname}/{appname}/chatrooms POST |                           Android与iOS调用接口相同                                   |
| 4. 创建成功返回conference ID,chatroom ID                      | AppServer API                                                |               Android与iOS调用接口相同                                               |
| 5. 加入 conference                                            | [EMClient.sharedClient.conferenceManager joinConferenceWithConfId: password: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a465bd08db130e2d10d9bf0d418871bac) | [EMClient.getInstance().conferenceManager().joinConference(conferenceId, password, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#aa04a85ab5f36f3f4ac14dc23ac18afb8) |
| 6. 加入 chatroom                                              | [EMClient.sharedClient.roomManager joinChatroom: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_chatroom_manager-p.html#a4091826df825b9f1825f2ea97c4fb3e2) | [EMClient.getInstance().chatroomManager().joinChatRoom(chatRoomId, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMChatRoomManager.html#af2d592b0801dbc333c0c60bd551e150d) |
| 7. 设置会议属性                                               | [EMClient.sharedClient.conferenceManager setConferenceAttribute: value: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a7e29cc54c08e9cab13a3b58df89eea80) | [EMClient.getInstance().conferenceManager().setConferenceAttribute(key, value, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a785be01c2f30dbe661fb91c9c8cac7a9) |

------

#### 加入语聊房间

当房主创建语聊房间后，其他人通过 AppServer 看到有房间被创建，可以输入房间密码加入到房间中。当加入房间后，就会收到会议属性变更的通知，从而得到会议属性。

我们可以通过一张图，来了解观众进入语聊房间接口的调用逻辑：

![img](/images/privitization/tc_logic_join.png)

上图中每步涉及到的 iOS/Android 接口如下，其中部分调用到了 AppServer 的接口，开发者需要自己实现 AppServer 功能。

| 步骤               | iOS API                                                      | Android API                                                  |
| :----------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 1.获取语聊房间列表 | AppServer API                                                |      Android与iOS调用接口相同                                                                                   |
| 2.加入 conference  | [EMClient.sharedClient.conferenceManager joinConferenceWithConfId: password: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a465bd08db130e2d10d9bf0d418871bac) | [EMClient.getInstance().conferenceManager().joinConference(conferenceId, password, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#aa04a85ab5f36f3f4ac14dc23ac18afb8) |
| 3.加入 chatroom    | [EMClient.sharedClient.roomManager joinChatroom: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_chatroom_manager-p.html#a4091826df825b9f1825f2ea97c4fb3e2) | [EMClient.getInstance().chatroomManager().joinChatRoom(chatRoomId, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMChatRoomManager.html#af2d592b0801dbc333c0c60bd551e150d) |
| 4.同步会议属性     | [EMConferenceManagerDelegate#-conferenceAttributeUpdated:attributes:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html) | [EMConferenceListener#onAttributesUpdated(attributes);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceAttribute.html) |

------

#### 上麦

已在语聊房间的观众通过 IMServer 发送 message 向房主发起上麦请求，房主同意后，通过 MediaServer 改变会议属性，将观众上麦成为主播，成为主播后就能说话进行推流。房间内其他的人都能收到推流通知并进行订阅。

我们可以通过一张图，来了解观众上麦接口的调用逻辑：

![img](/images/privitization/tc_logic_mic.png)

上图中每步涉及到的 iOS/Android 接口如下：

| 步骤           | iOS API                                                      | Android API                                                  |
| :------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 1.请求上麦     | [EMClient.sharedClient.chatManager sendMessage: progress: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_chat_manager-p.html#ad139d7ad31d934a721a979955baf1868) | [EMClient.getInstance().chatManager().sendMessage(msg);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMChatManager.html#ad50be7183f088c415b9507bc7ce792e6) |
| 2.改变角色属性 | [EMClient.sharedClient.conferenceManager changeMemberRoleWithConfId: memberNames: role: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#ac613f23e6f13a14f8c40f12f5c1b45f9) | [EMClient.getInstance().conferenceManager().grantRole(targetRole);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a52a1e73bc4b588bc57227c7a57512409) |
| 3.上麦成为主播 | [EMConferenceManagerDelegate#-roleDidChanged:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#ada8c07dac796d492a5165b28b50fb02c) | [EMConferenceListener#onRoleChanged(role);](http://www.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1EMConferenceListener.html#a6df0e567fc534314cee3008c310dfe72) |
| 4.推流         | [EMClient.sharedClient.conferenceManager publishConference: streamParam: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a4a621606d73a0ea1fab14aa336446a6b) | [EMClient.getInstance().conferenceManager().publish(param,callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#aa087a548e2d8f79ce06f50927decc137) |
| 5.收到推流通知 | [EMConferenceManagerDelegate#-streamDidUpdate: addStream:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#aaec86cf13eaa8930fa5261c1f3848785) | [EMConferenceListener#onStreamAdded(stream);](http://www.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1EMConferenceListener.html#ad06a034d00575fbf41798b98bebe6089) |
| 6.订阅         | [EMClient.sharedClient.conferenceManager subscribeConference: streamId: remoteVideoView: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a97e899177d4a7abcc49d8d7ea5152039) | [EMClient.getInstance().conferenceManager().subscribe(stream,surface,callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a405c38df38cbb0e6bf11420ff80540e0) |

------

#### 下麦、销毁房间

当主播在麦上时，如果想要下麦，同样通过 IMServer 向房主发送 message 发起下麦请求，这里无需房主同意，默认直接下麦。若房主主动将主播下麦，则没有之前这步，房主直接通过 MediaServer 改变会议属性，将主播下麦成为观众，主播成为观众后就停止推流。房主调用 AppServer 销毁房间，进而销毁conference、chatroom。

我们可以通过一张图，来了解主播下麦、房主销毁语聊房间接口的调用逻辑：

![img](/images/privitization/tc_logic_down.png)

上图中每步涉及到的 iOS/Android 接口如下，其中部分调用到了 AppServer 的接口，开发者需要自己实现 AppServer 功能

| 步骤             | iOS API                                                      | Android API                                                  |
| :--------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 1.请求下麦       | [EMClient.sharedClient.chatManager sendMessage: progress: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_chat_manager-p.html#ad139d7ad31d934a721a979955baf1868) | [EMClient.getInstance().chatManager().sendMessage(msg);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMChatManager.html#ad50be7183f088c415b9507bc7ce792e6) |
| 2.改变角色属性   | [EMClient.sharedClient.conferenceManager changeMemberRoleWithConfId: memberNames: role: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#ac613f23e6f13a14f8c40f12f5c1b45f9) | [EMClient.getInstance().conferenceManager().grantRole(targetRole);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a52a1e73bc4b588bc57227c7a57512409) |
| 3.下麦成为观众   | [EMConferenceManagerDelegate#-roleDidChanged:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#ada8c07dac796d492a5165b28b50fb02c) | [EMConferenceListener#onRoleChanged(role);](http://www.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1EMConferenceListener.html#a6df0e567fc534314cee3008c310dfe72) |
| 4.停止推流       | [EMClient.sharedClient.conferenceManager unpublishConference: streamId: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a679bced8da6fa7b293626c0c3243cfe8) | [EMClient.getInstance().conferenceManager().unpublish(publishId,callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a926c631717ce04a6c2a31401c8e095f7) |
| 5.销毁语聊房间   | AppServer API                                                |             Android与iOS调用接口相同                                                 |
| 6.销毁conference | AppServer API http://a1-hsb.easemob.com/{orgname}/{appname}/conferences/{confrId} DELETE |                 Android与iOS调用接口相同                                             |
| 7.销毁chatroom   | AppServer API http://a1.easemob.com/{orgname}/{appname}/chatrooms/{groupid} DELETE |                        Android与iOS调用接口相同                                      |

------

### 本地混音

本地混音是指将几种不同的声音在发送端混在一起。例如常见的K歌场景，就需要将人唱歌的声音和歌曲的背景音乐进行混音处理。所以，在实现了基本的连麦功能后，我们还需要增加背景音乐的混音、播放控制。

在这里，主播可以在自己的客户端上选择要播放的音乐，然后通过 SDK 的 **startAudioMixing** 接口在本地与主播语音混音后播放给连麦听众和普通听众。并且连麦语音与背景音乐播放互不干扰，帮助用户活跃房间内的气氛。在默认情况下，背景音乐是循环播放的。

------

### 多种连麦模式

在语音聊天室 Demo 中，提供了三种模式，自由麦模式、主持模式、抢麦模式（开发者还可以基于此扩展更多模式玩法）。这三种模式就是通过会议属性区分的，当用户进入房间后，就可以知道当前的房间属于哪种模式。

自由麦模式：主播用户可以自由打开和关闭发言，实现起来较为简单就不过多赘述。

这里主要介绍一下，主持模式和抢麦模式的实现逻辑：

- [主持模式](scenario_tc-host)

- [抢麦模式](scenario_tc-robmic)