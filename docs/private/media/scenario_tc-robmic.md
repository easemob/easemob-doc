# 抢麦模式

## 前言
本文将简要分享语音聊天室中抢麦玩法的的应用场景，并讲述基于环信语聊解决方案，实现抢麦玩法的步骤。

:::notice
`仅特定的私有化版本SDK支持语聊解决方案.` 开发者如有需求，请联系商务咨询。
:::

在抢麦模式下，只有抢到麦的主播可以发言，由 AppServer 来决定是否抢到麦当房主发起抢麦时；<br>

首先请求 AppServer ， AppServer 确定主播可以抢麦，返回成功的同时，AppServer 开始计时，在计时结束前或者抢到麦的主播主动释放麦之前，其他主播请求 AppServer 抢麦返回失败。主播抢到麦后，修改会议属性，告知所有人自己抢到了，同时开始倒计时，倒计时结束后，主动重新设置会议属性，告诉所有人自己释放麦。其他人收到抢麦的会议属性变化回调后更新 UI，并开始倒计时，在倒计时结束或者收到释放麦的会议属性变化前，所有人不可以发起抢麦操作。

## 实现方案

我们可以通过一张图，来了解抢麦模式中接口的调用逻辑：

![img](/images/privitization/tc_logic_robmic.png)

上图中每步涉及到的 iOS/Android 接口如下，其中部分调用到了 AppServer 的接口，开发者需要自己实现 AppServer 功能

| 步骤                          | iOS API                                                      | Android API                                                  |
| :---------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 1.设置抢麦会议属性            | [EMClient.sharedClient.conferenceManager setConferenceAttribute: value: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a7e29cc54c08e9cab13a3b58df89eea80) | [EMClient.getInstance().conferenceManager().setConferenceAttribute(key, value, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a785be01c2f30dbe661fb91c9c8cac7a9) |
| 2.广播抢麦会议属性            | [EMConferenceManagerDelegate#-conferenceAttributeUpdated:attributes:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html) | [EMConferenceListener#onAttributesUpdated(attributes);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceAttribute.html) |
| 3.主播向AppServer发起抢麦请求 | AppServer API                                                |               Android与iOS调用接口相同                                               |
| 4.返回抢麦成功结果            | AppServer API                                                |              Android与iOS调用接口相同                                                |
| 5.主播改变会议属性            | [EMClient.sharedClient.conferenceManager setConferenceAttribute: value: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a7e29cc54c08e9cab13a3b58df89eea80) | [EMClient.getInstance().conferenceManager().setConferenceAttribute(key, value, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a785be01c2f30dbe661fb91c9c8cac7a9) |
| 6.广播会议属性                | [EMConferenceManagerDelegate#-conferenceAttributeUpdated:attributes:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html) | [EMConferenceListener#onAttributesUpdated(attributes);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceAttribute.html) |
| 7.抢麦者说话，其他人闭麦      | [EMClient.sharedClient.conferenceManager updateConference: isMute:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#abc3d1658875a99bdd1f5f1158a74e789) | [EMClient.getInstance().conferenceManager().openVoiceTransfer();EMClient.getInstance().conferenceManager().closeVoiceTransfer();](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a7b4bd022d9daf8fe127d89494897bf99) |
| 8.释放麦，改变会议属性        | [EMClient.sharedClient.conferenceManager setConferenceAttribute: value: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a7e29cc54c08e9cab13a3b58df89eea80) | [EMClient.getInstance().conferenceManager().setConferenceAttribute(key, value, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a785be01c2f30dbe661fb91c9c8cac7a9) |
| 9.广播会议属性                | [EMConferenceManagerDelegate#-conferenceAttributeUpdated:attributes:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html) | [EMConferenceListener#onAttributesUpdated(attributes);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceAttribute.html) |

语音聊天室可根据业务模型提供多种模式与玩法。目前环信提供的语聊集成方案对准备开发和正在集成聊天室的开发者来说，不仅可以更好的理解环信 IM 即时通讯、音视频所提供的丰富功能，还能通过产品层面的操作，帮助开发者构思出更多的互动玩法，扩展更多有意思的场景。