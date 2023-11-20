# 产品动态


## 2023-11

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.2.0 开发版发布 | **新增特性**：<br/> - 客户端支持[好友备注功能](/document/android/releasenote.html)。<br/> - 客户端新增消息属性用于判断消息是否为聊天室全局广播消息。<br/> - 移动端新增 API 用于[从服务器获取当前用户已加入的群组数量](/document/android/group_manage.html#查询当前用户已加入的群组数量)。<br/> - 移动端的申请入群被拒绝的回调中添加申请者和拒绝者的用户 ID。<br/> - 移动端新增错误码 706，表示聊天室所有者不允许离开聊天室。若初始化时，将是否允许聊天室所有者离开聊天室的参数设置为否时，聊天室所有者在移动端调用离开聊天室的方法时会提示该错误。<br/> - 移动端在 `EMOptions` 类中新增属性用于在初始化时配置获取会话列表时是否返回空会话。<br/> **优化** <br/> - 客户端统一 Agora Token 和 EaseMob Token 登录方式，新增 EaseMob Token 即将过期及已过期的回调。<br/> - 移动端优化发消息时重试的逻辑。<br/> - 移动端优化数据库升级逻辑。| 2023-11-17  | <br/> - [Android 4.2.1 更新日志](/document/android/releasenote.html)<br/> - [iOS 4.2.1 更新日志](/document/ios/releasenote.html)<br/> - [Web 4.3.0 更新日志](/document/web/releasenote.html)。  |
| REST API    | 支持[通过 REST API 向 app 下的所有活跃聊天室发送全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息) 。活跃聊天室指聊天室至少存在一个成员，而且至少发送过一条消息。| 2023-11-17  | 详见[发送聊天室广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。  |
| IM Demo   | 好友详情页面可添加和修改好友备注。 | 2023-11-17       | <br/> - [Android 4.2.1 Demo](https://www.easemob.com/download/demo) <br/> - [iOS 4.2.0 Demo](https://www.easemob.com/download/demo)        |