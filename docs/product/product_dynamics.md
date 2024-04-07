# 产品动态

## 2024-04

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.5.0 开发版发布  | **新增特性**：<br/> - 客户端可[置顶消息](/document/android/message_pin.html)，方便会话中的所有用户快速查看重要消息。<br/> - 客户端的消息修改回调中可返回[通过 RESTful API 修改的自定义消息](/document/server-side/message_modify_text_custom.html)。<br/> - 客户端加入聊天室时，若传入的聊天室 ID 不存在，可实现[自动创建聊天室](/document/android/room_manage.html#加入聊天室)。若使用该功能，你需要联系商务开通。<br/> - 客户端支持[获取聊天室漫游消息](/document/android/message_retrieve.html#从服务器获取指定会话的历史消息)。若使用该功能，你需要联系商务开通。<br/> - Android 端 SDK 集成支持[动态加载 .so 库文件](quickstart.html#方法三-动态加载-so-库文件)，减少应用安装包的大小。<br/> - iOS 端可[将所有会话的未读消息设为已读](/document/ios/conversation_unread.html#将所有会话的未读消息数清零)，将所有会话的未读消息数清零。<br/>**优化**：<br/> - 优化 token 登录时的错误提示信息，使错误提示更准确。<br/> - 移动端优化[单条转发](/document/android/message_forward.html)功能，附件消息无需重新上传附件即可转发。 |  2024-04-03    |  <br/> - [Android 4.5.0 更新日志](/document/android/releasenote.html#版本-v4-5-0-dev-2024-04-03-开发版)<br/> - [iOS 4.5.0 更新日志](/document/ios/releasenote.html#版本-v4-5-0-dev-2024-04-03-开发版)<br/> - [Web 4.6.0 更新日志](/document/web/releasenote.html#版本-v4-6-0-dev-2024-04-02-开发版)<br/> - [小程序 4.6.0 更新日志](/document/applet/releasenote.html#版本-v4-6-0-dev-2024-04-02-开发版)。|
| REST API | <br/> - [分页获取好友列表](/document/server-side/user_relationship.html#分页获取好友列表)；<br/> - 支持单向清空漫游消息：[根据时间单向清空单聊会话的漫游消息](/document/server-side/message_roam_clear.html#单向清空指定单聊会话一段时间内的漫游消息)；[根据时间单向清空群组或聊天室对话漫游](/document/server-side/message_roam_clear.html#单向清空指定群组或聊天室会话一段时间内的漫游消息)；[清空用户当前时间之前的所有漫游](/document/server-side/message_roam_clear.html#单向清空指定用户的漫游消息)；<br/> - [修改文本或自定义消息](/document/server-side/message_modify_text_custom.html)；<br/> - [转让聊天室](/document/server-side/chatroom.html#转让聊天室)；<br/> - [强制指定账号从单设备下线](/document/server-side/account_system.html#强制用户从单设备下线)。| 2024-04 | 关于接口的调用频率限制，详见 [API 调用频率限制](/document/server-side/limitationapi.html)。 |

## 2024-01

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.4.0 开发版发布  | **新增特性**：<br/> - 客户端可[清空聊天记录](/document/android/message_delete.html#清空聊天记录)：单个用户包含本地或服务端记录。<br/> - 客户端发送消息时如果被内容审核进行了内容替换，你可以通过[设置开关](/document/android/message_send_receive.html#发送文本消息)决定发送方是否可以获取替换后的内容。<br/> - 移动端的[本地消息搜索可选择搜索范围](/document/android/message_search.html#根据搜索范围搜索当前会话中的消息)，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。<br/> - 移动端接收消息的回调支持通过[设置开关](/document/android/message_send_receive.html#接收消息)设置是否返回发送成功的消息。<br/> - [Web 端支持向指定设备发消息](/document/web/multi_device.html#获取当前用户的其他登录设备的登录-id-列表)，例如，电脑端给手机端发消息，登录同一账号的多个设备均会收到消息。<br/> - Web 端聊天室和群组成员进出事件增加成员人数 `memberCount` 字段。<br/>**优化**：<br/> - 移动端群组全员禁言状态存储到本地数据库，下次登录时可以直接从本地获取到。<br/> - 移动端转发合并消息时导致的附件重复上传问题。|  2024-01-30    |  <br/> - [Android 4.4.0 更新日志](/document/android/releasenote.html#版本-v4-4-0-dev-2024-01-30-开发版)<br/> - [iOS 4.4.0 更新日志](/document/ios/releasenote.html#版本-v4-4-0-dev-2024-01-30-开发版)<br/> - [Web 4.5.0 更新日志](/document/web/releasenote.html#版本-v4-5-0-dev-2024-01-30-开发版)<br/> - [小程序 4.5.0 更新日志](/document/applet/releasenote.html#版本-v4-5-0-dev-2024-01-30-开发版)。  |

## 2023-12

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.3.0 开发版发布 | **新增特性**：<br/> - [会话标记功能](/document/android/conversation_mark.html)：支持标记会话，并按照标记获取会话。<br/> **优化**<br/> - 对于原生平台，优化附件类型消息发送时的附件上传，支持分片上传。 <br/> - 移动端移除 FPA 功能，减小 SDK 体积。<br/> - 移动端单个日志文件大小由 2 MB 提升到 5 MB。<br/> - Web 端增加 `onMessage` 回调。在收到文本、图片、视频、语音、地理位置和文件等消息时，批量将消息回调给应用。<br/> - Web 端视频类型消息增加视频首帧缩略图, 通过 videoMessage.thumb 访问。    |  2023-12-22     | <br/> - [Android 4.3.0 更新日志](/document/android/releasenote.html#版本-v4-3-0-dev-2023-12-22-开发版)<br/> - [iOS 4.3.0 更新日志](/document/ios/releasenote.html#版本-v4-3-0-dev-2023-12-22-开发版)<br/> - [Web 4.4.0 更新日志](/document/web/releasenote.html#版本-v4-4-0-dev-2023-12-22-开发版)<br/> - [小程序 4.4.0 更新日志](/document/applet/releasenote.html#版本-v4-4-0-dev-2023-12-22-开发版)。   |

## 2023-11

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.2.0 开发版发布 | **新增特性**：<br/> - 客户端支持[好友备注功能](/document/android/releasenote.html)。<br/> - 客户端支持聊天室全局广播消息，可根据消息属性判断。<br/> - 移动端可以[从服务器获取当前用户已加入的群组数量](/document/android/group_manage.html#查询当前用户已加入的群组数量)。<br/> - 移动端在申请入群被拒绝时，返回的回调中增加了申请者和拒绝者。<br/> - 移动端在初始化时可配置获取会话列表时是否返回空会话。<br/> **优化** <br/> - 客户端统一 Agora Token 和 EaseMob Token 登录方式，新增 EaseMob Token 即将过期及已过期的回调。<br/> - 移动端优化发消息时重试的逻辑。<br/> - 移动端优化数据库升级逻辑。| 2023-11-17  | <br/> - [Android 4.2.1 更新日志](/document/android/releasenote.html#版本-v4-2-1-dev-2023-11-17)<br/> - [iOS 4.2.0 更新日志](/document/ios/releasenote.html#版本-v4-2-0-dev-2023-11-13)<br/> - [Web 4.3.0 更新日志](/document/web/releasenote.html#版本-v4-3-0-dev-2023-11-17)<br/> - [小程序 4.3.0 更新日志](/document/applet/releasenote.html#版本-v4-3-0-dev-2023-11-17)。<br/> - [Flutter 4.2.0 更新日志](/document/flutter/releasenote.html#_4-2-0-2024-1-4)<br/> - [React Native 1.3.0 更新日志](/document/react-native/releasenote.html#版本-v1-3-0-2024-1-4)  |
| REST API    | 支持[通过 REST API 向 app 下的所有活跃聊天室发送全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息) 。活跃聊天室指聊天室至少存在一个成员，而且至少发送过一条消息。| 2023-11-17  | 详见[发送聊天室广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。  |
| IM Demo   | 好友详情页面可添加和修改好友备注。 | 2023-11-17       | <br/> - [Android 4.2.1 Demo](https://www.easemob.com/download/demo) <br/> - [iOS 4.2.0 Demo](https://www.easemob.com/download/demo)        |

