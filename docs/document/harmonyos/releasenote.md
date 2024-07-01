# HarmonyOS IM SDK 更新日志

<Toc />

## 版本 V1.1.0 Dev 2024-07-01（开发版）

### 新增特性

- 新增[修改消息](message_modify.html)功能。
- 新增[自定义消息](message_send_receive.html#发送自定义类型消息)功能。
- 新增[合并转发消息](message_send_receive.html#发送和接收合并消息)功能。
- 支持 [HarmonyOS 推送](push.html)能力。

### 优化

- `ChatClient#init` 方法中新增 `Context` 参数。
- 修改 SDK 文件路径到应用级的应用文件路径下。

## 版本 V1.0.0 Dev 2024-06-7（开发版）

### 新增特性

环信即时通讯 HarmonyOS SDK 支持单聊、群组聊天和聊天室聊天场景，实现了以下特性：

- 支持消息特性：
  - [发送和接收消息](message_send_receive.html)；
  - [获取历史消息](message_retrieve.html)；
  - [撤回消息](message_recall.html)；
  - [消息回执](message_receipt.html)；
  - [转发消息](message_forward.html)；
  - [导入和插入消息](message_import_insert.html)；
  - [更新消息](message_update.html)；
  - [删除消息](message_delete.html)；
  - [只投在线用户](message_deliver_only_online.html)。
- 支持会话特性：
  - [会话列表](conversation_list.html)；
  - [会话未读数](conversation_unread.html)；
  - [删除会话](conversation_delete.html)。
- 支持[用户关系管理](user_relationship.html)特性：
  - [添加、删除好友](user_relationship.html#添加好友)；
  - [设置好友备注](user_relationship.html#设置好友备注)；
  - [获取好友列表](user_relationship.html#从服务端获取好友列表)；
  - [好友黑名单管理](user_relationship.html#添加用户到黑名单)。
- 支持群组管理特性：
  - [创建和管理群组](group_manage.html)：创建/解散群组、获取群组详情、获取群成员列表、获取群组列表、查询当前用户已加入的群组数量、屏蔽和解除屏蔽群消息以及监听群组事件。
  - [管理群成员](group_members.html)：更换群主、添加、移除和获取群管理员、群组白名单和黑名单、群组禁言等。
  - [管理群组属性](group_attributes.html)：修改群组名称和群组描述、获取群公告、更新群扩展字段。 
- 支持聊天室管理特性：
  - [创建和管理聊天室](room_manage.html)：创建、加入和退出聊天室和监听聊天室事件。
  - [管理聊天室成员](room_members.html)：更换聊天室所有者、添加、移除和获取聊天室管理员、聊天室白名单和黑名单、聊天室禁言等。
  - [管理聊天室属性](room_attributes.html)：修改聊天室名称和描述、获取和更新聊天室公告。 
- 支持[多设备登录](multi_device.html)特性。  



