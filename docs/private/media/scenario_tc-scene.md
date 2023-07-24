# 临场模式

## 前言

本文简要分享语音聊天室中临场模式的使用场景，并概述基于环信音视频会议实现临场模式切换的主要步骤。
:::notice
`仅特定的私有化版本SDK支持语聊解决方案.` 开发者如有需求，请联系商务咨询。
:::

临场模式环信以常见的杀人游戏白天、黑夜示例两种临时模式的切换，示例并非完整展示游戏的过程。仅提供切换方法和思路，以便开发者学习使用。

2018年后，由于实时音视频在社交应用中的广泛使用，影响了了大量私密社交和娱乐化社交的场景升级，娱乐社交方式不在停留在即时通讯的领域而更加激进的走向实时通讯领域。无论是连麦、直播或者场景化的聊天室。互动过程中更丰富发玩法自由切换，场景自由穿插组合成成为大部分社交应用的基础功能。业务模型的逐渐升级也推进环信语音连麦场景需要更迅速的提供通用的解决方案和集成支持。

环信将音视频会议内的临时场景切换归纳形成临场模式集成方案，主要解决：

- 用户通过业务场景的定义实现发言逻辑变更，用户使用行为变更等常用功能；
- 通过此模式的集成实现，可以更快速的切换业务；
- 保持音视频会议通讯的稳定；
- 以及最大化的录制保存用户沟通的全部信息。

下面将详细介绍语音聊天室临场模式的集成方法：

临场模式中的场景切换核心是通过修改和广播会议属性，由客户端预先约定好会议属性内的参数对应业务进行对订阅流音频、视频设置实现，这个`至关重要！！！` 同时还增加了服务端 的修改接口，可以通过 REST API 对会议属性进行控制。下图详细介绍临时场景实现过程。

## 临场变更

![img](@static/images/privitization/tc_logic_scene.png)

| 步骤                                                         | iOS API                                                      | Android API                                                  | REST API |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :------- |
| 1. 修改会议属性                                               | [EMConferenceManagerDelegate](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a7e29cc54c08e9cab13a3b58df89eea80) | [EMConferenceManager.setConferenceAttribute](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a785be01c2f30dbe661fb91c9c8cac7a9) | 近期上线 |
| 2. 广播同步会议属性                                           | [EMConferenceManagerDelegate.h](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html) | [EMConferenceListener#onAttributesUpdated](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceAttribute.html) | -        |
| 3. 客户端按照约定参数进行muteRemote指定的特殊用户并mute自身，并且配合UI进行场景分别定制 | [muteRemoteAudio:mute](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a28f9297ad2411c6aa9bdbb291bb8df26) | [muteRemoteAudio](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#aa55d14555c59930263659b1f608e8f18) | -        |

4. 当前语聊demo中的特殊主播用户（狼人）在夜晚场景可以自由发言，其他主播夜晚将无法发言；

5. 所有订阅未改变，按照会议默认的方式继续同步；

6. 但是由于其他主播用户设置muteRemote的特殊用户，将不进行特殊用户发言发本地播放行为。从而实现了临时场景屏蔽；


## 临场变更恢复

![img](@static/images/privitization/tc_logic_scene_reset.png)

| 步骤                                                         | iOS API                                                      | Android API                                                  | REST API |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :------- |
| 1. 修改会议属性                                               | [EMConferenceManagerDelegate](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a7e29cc54c08e9cab13a3b58df89eea80) | [EMConferenceManager.setConferenceAttribute](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a785be01c2f30dbe661fb91c9c8cac7a9) | 近期上线 |
| 2. 广播同步会议属性                                           | [EMConferenceManagerDelegate.h](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html) | [EMConferenceListener#onAttributesUpdated](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceAttribute.html) | -        |
| 3. 客户端按照约定参数取消之前muteRemote指定的特殊用户并mute自身，并且配合UI进行场景恢复 | [muteRemoteAudio:mute](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a28f9297ad2411c6aa9bdbb291bb8df26) | [muteRemoteAudio](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#aa55d14555c59930263659b1f608e8f18) | -        |

临场模式的优势在于：

1. 通过会议属性的切换同步，可以快速通知到各客户端场景切换，并且可以使新用户接入时继承最新的会议状态衔接场景功能。
2. 过程中没有改变会议订阅的情况，与服务器之间交互行为减少，减少其他非必要的网络延迟，符合多次、小范围、临时的场景切换的要求。
3. 保持全员通话畅通的基础上可以最大限度的保留原始素材的服务端录制，对后续的回溯播放提供完整的信息。

以上是临场模式的集成介绍，临场模式配合各种玩法，希望结合实际业务完成更多的聊天室互动场景。如有相关集成问题可以联系环信支持与产品咨询。另有更多的玩法集成请考到其他常见集成文档。