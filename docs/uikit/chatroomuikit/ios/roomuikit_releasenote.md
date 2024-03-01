# 聊天室 UIKit 更新日志

<Toc />

## 版本 V1.0.0 2023-12-29

### 新增特性

ChatroomUIKit 提供以下功能：

- **通用特性**
  - [创建聊天室](roomfeature_common.html#创建聊天室)：ChatroomUIKit 不提供创建聊天室的功能，你可以[调用即时通讯 IM SDK 的接口创建聊天室](/document/server-side/chatroom.html#创建聊天室)。
  - [销毁聊天室](roomfeature_common.html#销毁聊天室)：ChatroomUIKit 不提供销毁聊天室的功能，你可以[调用即时通讯 IM SDK 的接口销毁聊天室](/document/server-side/chatroom.html#删除聊天室)。
  - [离开聊天室](roomfeature_common.html#离开聊天室)：聊天室中的成员可自行离开聊天室，聊天室所有者也可以将成员移出聊天室。
  - [发送弹幕消息](roomfeature_common.html#发送弹幕)：用户在聊天室中向其他参与者发送文字和表情的消息。
  - [打赏](roomfeature_common.html#打赏)：用户通过赠送虚拟礼物，向聊天室中的主播或其他用户表达赞赏或者支持
  - [全局广播](roomfeature_common.html#全局广播)：向 App 内所有在线聊天室中的所有用户发送相同的消息或通知。
  - [未读消息数](roomfeature_common.html#未读消息数)：在一个聊天室中用户尚未读取的消息数量。
  - [已禁言列表](roomfeature_common.html#已禁言列表)：记录被禁止发言用户的列表。当用户违反了聊天室的规则时，聊天室所有者将其禁言，即添加至已禁言列表。
  - [暗黑模式](roomfeature_common.html#暗黑模式)：ChatroomUIKit 默认风格为明亮模式，切换为暗黑模式后，聊天室界面中所有元素将替换为暗黑风格设计，提供用户舒适的视觉体验。
- **消息扩展**(长按一条消息可进行的操作)
  - [消息举报](roomfeature_message.html#消息举报)：在聊天室中，用户可以举报不适当、违规或有害的消息内容以促使聊天室所有者采取适当的行动。
  - [消息翻译](roomfeature_message.html#消息翻译)：将聊天室中的单条消息从一种语言转换成另一种语言。
  - [消息撤回](roomfeature_message.html#消息撤回)：在聊天室中撤销已经发送的消息。所有用户只能撤回自己发送的消息，即使聊天室所有者也不能撤回其他成员发送的消息。
  - [禁言成员](roomfeature_message.html#禁言成员)：聊天室所有者对聊天室中的成员禁止发言。
- **成员管理**
  - [查看成员列表](roomfeature_member.html#查看成员列表)：聊天室成员列表显示了该聊天室中的当前在线用户。
  - [搜索成员](roomfeature_member.html#搜索成员)：在聊天室中查找指定成员的功能，支持支持本地搜索和模糊匹配。
  - [禁言成员](roomfeature_member.html#禁言成员)：聊天室所有者可以在聊天室中对某个特定的成员禁言。
  - [移除成员](roomfeature_member.html#移除成员)：聊天室所有者将指定成员从聊天室中踢出。

