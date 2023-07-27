# 主持模式

## 前言
本文将简要分享语音聊天室中主持玩法的的应用场景，并讲述基于环信语聊解决方案，主持玩法的实现步骤。

:::notice
`仅特定的私有化版本SDK支持语聊解决方案.` 开发者如有需求，请联系商务咨询。
:::

主持玩法是目前语音连麦聊天室中必备的玩法之一，通过房主的主持，大家可以有序的进行发言，更好的组织聊天室的互动场景。 

在主持模式，由房主指定谁可以发言，被指定的主播可以发言，其他人不能发言。这个功能是通过会议属性来实现的，当房主指定发言人后，房主修改会议属性，所有人收到会议属性变更通知，如果发现会议属性中是指定的自己发言，自己打开麦克风。其他人关闭。当房主指定另外一个主播发言时，房主修改会议属性，所有人收到会议属性变更通知，当前主播自动下麦。

## 实现方案
我们可以通过一张图，来了解主持模式中接口的调用逻辑：

![img](@static/images/privitization/tc_logic_host.png)

上图中每步涉及到的iOS/Android接口如下：

| 步骤                               | iOS API                                                      | Android API                                                  |
| :--------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 1.设置主持会议属性                 | [EMClient.sharedClient.conferenceManager setConferenceAttribute: value: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a7e29cc54c08e9cab13a3b58df89eea80) | [EMClient.getInstance().conferenceManager().setConferenceAttribute(key, value, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a785be01c2f30dbe661fb91c9c8cac7a9) |
| 2.广播会议属性                     | [EMConferenceManagerDelegate#-conferenceAttributeUpdated:attributes:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html) | [EMConferenceListener#onAttributesUpdated(attributes);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceAttribute.html) |
| 3.指定某个主播发言，并修改会议属性 | [EMClient.sharedClient.conferenceManager setConferenceAttribute: value: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a7e29cc54c08e9cab13a3b58df89eea80) | [EMClient.getInstance().conferenceManager().setConferenceAttribute(key, value, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a785be01c2f30dbe661fb91c9c8cac7a9) |
| 4.广播会议属性                     | [EMConferenceManagerDelegate#-conferenceAttributeUpdated:attributes:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html) | [EMConferenceListener#onAttributesUpdated(attributes);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceAttribute.html) |
| 5.指定者说话，其他人闭麦           | [EMClient.sharedClient.conferenceManager updateConference: isMute:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#abc3d1658875a99bdd1f5f1158a74e789) | [EMClient.getInstance().conferenceManager().openVoiceTransfer();EMClient.getInstance().conferenceManager().closeVoiceTransfer();](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a7b4bd022d9daf8fe127d89494897bf99) |
| 6.指定某个主播发言，并修改会议属性 | [EMClient.sharedClient.conferenceManager setConferenceAttribute: value: completion:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a7e29cc54c08e9cab13a3b58df89eea80) | [EMClient.getInstance().conferenceManager().setConferenceAttribute(key, value, callback);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a785be01c2f30dbe661fb91c9c8cac7a9) |
| 7.广播会议属性                     | [EMConferenceManagerDelegate#-conferenceAttributeUpdated:attributes:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html) | [EMConferenceListener#onAttributesUpdated(attributes);](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceAttribute.html) |
| 8.指定者说话，其他人闭麦           | [EMClient.sharedClient.conferenceManager updateConference: isMute:](http://www.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#abc3d1658875a99bdd1f5f1158a74e789) | [EMClient.getInstance().conferenceManager().openVoiceTransfer();EMClient.getInstance().conferenceManager().closeVoiceTransfer();](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMConferenceManager.html#a7b4bd022d9daf8fe127d89494897bf99) |

语音聊天室可根据业务模型提供多种模式与玩法。目前环信提供的语聊集成方案对准备开发和正在集成聊天室的开发者来说，不仅可以更好的理解环信 IM 即时通讯、音视频所提供的丰富功能，还能通过产品层面的操作，帮助开发者构思出更多的互动玩法，扩展更多有意思的场景。

