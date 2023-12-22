# 产品动态

## 2023-12

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.3.0 开发版发布 | **新增特性**：<br/> - [会话标记功能](/document/android/conversation_mark.html)：支持标记会话，并按照标记获取会话。<br/> - 附件消息支持分片上传。 <br/> **优化**<br/> - 移动端移除 FPA 功能，减小 SDK 体积。<br/> - 移动端单个日志文件大小由 2 MB 提升到 5 MB。<br/> - Web 端增加 `onMessage` 回调。在收到文本、图片、视频、语音、地理位置和文件等消息时，批量将消息回调给应用。<br/> - Web 端视频类型消息增加视频首帧缩略图, 通过 videoMessage.thumb 访问。    |  2023-12-22     | <br/> - [Android 4.3.0 更新日志](/document/android/releasenote.html)<br/> - [iOS 4.3.0 更新日志](/document/ios/releasenote.html)<br/> - [Web 4.4.0 更新日志](/document/web/releasenote.html)<br/> - [小程序 4.4.0 更新日志](/document/applet/releasenote.html)。   |


## 2023-11

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.2.0 开发版发布 | **新增特性**：<br/> - 客户端支持[好友备注功能](/document/android/releasenote.html)。<br/> - 客户端支持聊天室全局广播消息，可根据消息属性判断。<br/> - 移动端可以[从服务器获取当前用户已加入的群组数量](/document/android/group_manage.html#查询当前用户已加入的群组数量)。<br/> - 移动端在申请入群被拒绝时，返回的回调中增加了申请者和拒绝者。<br/> - 移动端在初始化时可配置获取会话列表时是否返回空会话。<br/> **优化** <br/> - 客户端统一 Agora Token 和 EaseMob Token 登录方式，新增 EaseMob Token 即将过期及已过期的回调。<br/> - 移动端优化发消息时重试的逻辑。<br/> - 移动端优化数据库升级逻辑。| 2023-11-17  | <br/> - [Android 4.2.1 更新日志](/document/android/releasenote.html)<br/> - [iOS 4.2.1 更新日志](/document/ios/releasenote.html)<br/> - [Web 4.3.0 更新日志](/document/web/releasenote.html)<br/> - [小程序 4.3.0 更新日志](/document/applet/releasenote.html)。  |
| REST API    | 支持[通过 REST API 向 app 下的所有活跃聊天室发送全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息) 。活跃聊天室指聊天室至少存在一个成员，而且至少发送过一条消息。| 2023-11-17  | 详见[发送聊天室广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。  |
| IM Demo   | 好友详情页面可添加和修改好友备注。 | 2023-11-17       | <br/> - [Android 4.2.1 Demo](https://www.easemob.com/download/demo) <br/> - [iOS 4.2.0 Demo](https://www.easemob.com/download/demo)        |

