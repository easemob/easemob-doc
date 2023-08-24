# Restful API 调用频率限制

<Toc />

除部分 API 接口有特殊说明外，API 调用频率限制默认为 100 次/秒，具体每个接口限制以下表为准。

按模块查看接口调用频率限制：

##  用户帐号管理

| Restful API 接口 |方法  | 接口 URL|
| :------------ | :--- | :--------------------------- |
| 注册单个用户  |  POST  | /{org_name}/{app_name}/users        |
| 批量注册用户 |  POST   | /{org_name}/{app_name}/users       |
| 设置推送消息显示昵称 | PUT  | /{org_name}/{app_name}/users/{username} |
| 设置推送消息展示方式 | PUT  | /{org_name}/{app_name}/users/{username} | 
| 设置免打扰           | PUT  | /{org_name}/{app_name}/users/{username} |
| 绑定和解绑推送信息           | PUT  | /{org_name}/{app_name}/users/wzy/push/binding |
| 查询当前用户的所有设备的推送绑定信息    | GET  | /{org_name}/{app_name}/users/wzy/push/binding |

以上七个接口的总调用频率（默认值）为 100 次/秒/App Key。

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :----------- | :----- | :------------------- | :------------- |
| 获取 app/用户 token  | POST   | /{org_name}/{app_name}/token   | 300 次/秒/App Key          |
| 获取单个用户  |  GET | /{org_name}/{app_name}/users/{username}   | 100 次/秒/App Key   |
| 批量获取用户 |  GET  | /{org_name}/{app_name}/users      | 100 次/秒/App Key|
| 删除单个用户 |  DELETE  | /{org_name}/{app_name}/users/{username}         | 100 次/秒/App Key |
| 批量删除用户 |  DELETE   | /{org_name}/{app_name}/users  | 30 次/秒/App Key   |
| 修改用户密码  |  POST | /{org_name}/{app_name}/users/{username}/password   | 100 次/秒/App Key   |
| 获取用户在线状态  |  GET | /{org_name}/{app_name}/users/{username}/status   | 100 次/秒/App Key  |
| 批量获取用户在线状态  |  POST    | /{org_name}/{app_name}/users/batch/status  | 50 次/秒/App Key |
| 获取离线消息数       |  GET     | /{org_name}/{app_name}/users/{owner_username}/offline_msg_count    | 100 次/秒/App Key |
| 获取离线消息的状态    |  GET   | /{org_name}/{app_name}/users/{username}/offline_msg_status/{msg_id}   | 100 次/秒/App Key                                                 |
| 账号封禁   |  POST     | /{org_name}/{app_name}/users/{username}/deactivate          | 100 次/秒/App Key     |
| 账号解禁    |  POST                    | /{org_name}/{app_name}/users/{username}/activate         | 100 次/秒/App Key      |
| 强制下线         |  GET    | /{org_name}/{app_name}/users/{username}/disconnect    | 100 次/秒/App Key   |

## 消息推送

| RESTful API 接口        | 方法 | 接口 URL           | 接口最高调用频率（默认值） |
| :----------- | :--- | :------------- | :----------- |
| 设置离线推送         | PUT  | /{org}/{app_name}/users/{username}/notification/{chattype}/{key} | 100 次/秒/App Key          |
| 查询离线推送设置     | GET  | /{org_name}/{app_name}/users/{username}/notification/{chattype}/{key} | 100 次/秒/App Key          |
| 设置推送通知的首选语言     | PUT  | /{org_name}/{app_name}/users/{username}/notification/language | 100 次/秒/App Key          |
| 获取推送通知的首选语言 | PUT  | /{org_name}/{app_name}/users/{username}/notification/language | 100 次/秒/App Key  |
| 创建离线推送模板          | POST  | /{org_name}/{app_name}/notification/template | 10 次/秒/App Key  |
| 查询离线推送模板          | GET  | /{org_name}/{app_name}/notification/template/{name} | 10 次/秒/App Key  |
| 删除离线推送模板          | DELETE  | /{org_name}/{app_name}/notification/template/{name} | 10 次/秒/App Key  |

## 消息管理

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :-------- | :----- | :---------------- | :--------------------- |
| 发送单聊消息                 | POST   | /{org_name}/{app_name}/messages/users                | 6000 条/分钟/App Key                                         |
| 发送群聊消息                 | POST   | /{org_name}/{app_name}/messages/chatgroups           | 20 条/秒/App Key                                             |
| 发送聊天室消息               | POST   | /{org_name}/{app_name}/messages/chatrooms            | 100 条/秒/App Key                                            |
| 上传文件  |    POST  | /{org_name}/{app_name}/chatfiles       | 100 次/秒/App Key                                                 |
| 下载文件      |  GET     | /{org_name}/{app_name}/chatfiles/{file_uuid}       | 100 次/秒/App Key                                                 |
| 获取历史消息（聊天记录）文件   |  GET     | /{org_name}/{app_name}/chatmessages/${time}          | 10 次/分钟/App Key                                               |
| 服务端消息撤回    |    POST  | /{org_name}/{app_name}/messages/recall        | 100 次/秒/App Key                                                 |
| 服务端单向删除会话   |    DELETE    | /{org_name}/{app_name}/users/{userName}/user_channel          | 5 次/分钟/单用户 ID，100 次/秒/App Key                                              |
| 拉取会话列表    |   GET    | /{org_name}/{app_name}/user/{username}/user_channels       | 5 次/分钟/单用户 ID，100 次/秒/App Key    |

## 用户属性

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :---------- | :----- | :-------------------- | :---------------- |
| 设置用户属性      | PUT     | /{org_name}/{app_name}/metadata/user/{username}            | 100 次/秒/App Key |
| 批量获取用户属性    | POST      | /{org_name}/{app_name}/metadata/user/get           | 100 次/秒/App Key    |
| 删除用户属性   | DELETE     | /{org_name}/{app_name}/metadata/user/{username}      | 100 次/秒/App Key  |
| 获取指定用户的所有用户属性   | GET     | /{org_name}/{app_name}/metadata/user/{username}      | 100 次/秒/App Key |
| 获取 app 下的用户属性总大小   | GET     | /{org_name}/{app_name}/metadata/user/capacity   | 100 次/秒/App Key |

## 用户关系管理

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率 |
| :------------- | :----- | :---------------- | :-------------- |
| 添加好友   |    POST         | /{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}    | 100 次/秒/App Key                                                 |
| 移除好友    |    DELETE        | /{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}    | 100 次/秒/App Key                                                 |
| 获取好友列表    |  GET      | /{org_name}/{app_name}/users/{owner_username}/contacts/users   | 100 次/秒/App Key                                                 |
| 获取黑名单列表     |  GET       | /{org_name}/{app_name}/users/{owner_username}/blocks/users   | 50 次/秒/App Key                                                  |
| 添加用户至黑名单    |    POST       | /{org_name}/{app_name}/users/{owner_username}/blocks/users    | 50 次/秒/App Key                                                  |
| 从黑名单移除用户 |    DELETE      | /{org_name}/{app_name}/users/{owner_username}/blocks/users/{blocked_username}   | 50 次/秒/App Key                                                  |

## 群组管理

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 分页获取 app 中的群组  |  GET     | /{org_name}/{app_name}/chatgroups?limit={N}&cursor={cursor}        | 100 次/秒/App Key                                                 |
| 获取一个用户加入的所有群组   |  GET         | /{org_name}/{app_name}/users/{username}/joined_chatgroups        | 50 次/秒/App Key                                                  |
| 查看指定用户是否已加入群组 | POST  | /{org_name}/{app_name}/chatgroups/{group_id}/user/{user_id}/is_joined | 100 次/秒/App Key |
| 获取群组详情        |  GET        | /{org_name}/{app_name}/chatgroups/{group_ids}           | 100 次/秒/App Key            |
| 创建一个群组  |    POST      | /{org_name}/{app_name}/chatgroups                  | 100 次/秒/App Key                                                 |
| 修改群组信息   |    PUT         | /{org_name}/{app_name}/chatgroups/{group_id}             | 100 次/秒/App Key                                                 |
| 删除群组 |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}                    | 100 次/秒/App Key                                                 |
| 获取群组公告     |  GET     | /{org_name}/{app_name}/chatgroups/{group_id}/announcement         | 100 次/秒/App Key                                                 |
| 修改群组公告  |    POST| /{org_name}/{app_name}/chatgroups/{group_id}/announcement          | 100 次/秒/App Key                                                 |
| 分页获取群组共享文件   |  GET     | /{org_name}/{app_name}/chatgroups/{group_id}/share_files?pagenum=1&pagesize=10        | 100 次/秒/App Key                                                 |
| 上传群组共享文件  |    POST  | /{org_name}/{app_name}/chatgroups/{group_id}/share_files       | 100 次/秒/App Key                                                 |
| 下载群组共享文件    |  GET   | /{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}   | 100 次/秒/App Key                                                 |
| 删除群组共享文件   |    DELETE   | /{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}     | 100 次/秒/App Key                                                 |

## 群成员管理

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 分页获取群组成员  |  GET     | /{org_name}/{app_name}/chatgroups/{group_id}/users       | 100 次/秒/App Key                                                 |
| 添加单个群组成员     |    POST | /{org_name}/{app_name}/chatgroups/{group_id}/users/{username}    | 100 次/秒/App Key                                                 |
| 批量添加群组成员    |    POST   | /{org_name}/{app_name}/chatgroups/{group_id}/users           | 100 次/秒/App Key                                                 |
| 移除单个群组成员     |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}/users/{username}    | 100 次/秒/App Key                                                 |
| 批量移除群组成员    |    DELETE     | /{org_name}/{app_name}/chatgroups/{group_id}/users/{usernames}    | 100 次/秒/App Key                                                 |
| 设置群成员自定义属性    |  PUT       | /{org_name}/{app_name}/metadata/chatgroup/{group_id}/user/{username}              | 100 次/秒/App Key                                                 |
| 获取单个群成员的所有自定义属性    |  GET       | /{org_name}/{app_name}/metadata/chatgroup/{group_id}/user/{username}            | 100 次/秒/App Key                                                 |
| 根据属性 key 获取多个群成员的自定义属性    |  GET       | /{org_name}/{app_name}/metadata/chatgroup/{group_id}/get              | 100 次/秒/App Key                                                 |
| 获取群管理员列表    |  GET       | /{org_name}/{app_name}/chatgroups/{group_id}/admin              | 100 次/秒/App Key   |
| 添加群管理员     |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/admin              | 100 次/秒/App Key                                                 |
| 移除群管理员     |    DELETE  | /{org_name}/{app_name}/chatgroups/{group_id}/admin/{oldadmin}    | 100 次/秒/App Key                                                 |
| 转让群组       |    PUT | /{org_name}/{app_name}/chatgroups/{group_id}                     | 100 次/秒/App Key                                                 |
| 查询群组黑名单    |    GET   | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users       | 100 次/秒/App Key                                                 |
| 添加单个用户至群组黑名单   |    POST      | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{username}    | 100 次/秒/App Key                                                 |
| 批量添加用户至群组黑名单   |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users       | 100 次/秒/App Key                                                 |
| 从群组黑名单移除单个用户   |    DELETE  | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{username}    | 100 次/秒/App Key                                                 |
| 批量从群组黑名单移除用户  |    DELETE  | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{usernames}    | 100 次/秒/App Key                                                 |
| 查询群组白名单  |    GET | /{org_name}/{app_name}/chatgroups/{group_id}/white/users        | 100 次/秒/App Key         |
| 添加单个用户至群组白名单 |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/white/users/{username}    | 100 次/秒/App Key      |
| 批量添加用户至群组白名单|    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users       | 100 次/秒/App Key      |
| 将用户移除群组白名单 |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}/white/users/{username}    | 100 次/秒/App Key                                                 |
| 获取禁言列表 |    GET    | /{org_name}/{app_name}/chatgroups/{group_id}/mute              | 100 次/秒/App Key                                                 |
| 禁言单个群成员    |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/mute               | 100 次/秒/App Key                                                 |
| 禁言全体成员    |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/ban                | 100 次/秒/App Key                                                 |
| 解除成员禁言   |    DELETE   | /{org_name}/{app_name}/chatgroups/{group_id}/mute/{member1}(,{member2},…)    | 100 次/秒/App Key                                                 |
| 解除全员禁言 |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}/ban                | 100 次/秒/App Key     |

## 聊天室管理

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 获取 app 中的聊天室  |    GET   | /{org_name}/{app_name}/chatrooms?limit={N}&cursor={cursor}       | 50 次/秒/App Key          |
| 获取用户加入的聊天室 |    GET       | /{org_name}/{app_name}/users/{username}/joined_chatrooms         | 50 次/秒/App Key             |
| 获取聊天室详情     |    GET    | /{org_name}/{app_name}/chatrooms/{chatroom_id}       | 100 次/秒/App Key       |
| 创建一个聊天室   |    POST   | /{org_name}/{app_name}/chatrooms                                 | 50 次/秒/App Key                                                  |
| 修改聊天室信息 |    PUT     | /{org_name}/{app_name}/chatrooms/{chatroom_id}                   | 100 次/秒/App Key                                                 |
| 删除聊天室  |  DELETE  | /{org_name}/{app_name}/chatrooms/{chatroom_id}                   | 100 次/秒/App Key                                                 |
| 获取聊天室公告  |   GET  | /{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement      | 100 次/秒/App Key                                                 |
| 修改聊天室公告   |    POST | /{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement      | 100 次/秒/App Key        |
| 获取聊天室自定义属性 | POST  | /{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement | 100 次/秒/App Key       |
| 设置聊天室自定义属性 | PUT  | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username} | 100 次/秒/App Key       |
| 强制设置聊天室自定义属性 | PUT | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced | 100 次/秒/App Key        |
| 删除聊天室自定义属性 | DELETE  | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username} | 100 次/秒/App Key             |
| 强制删除聊天室自定义属性 | DELETE  | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced | 100 次/秒/App Key           |

## 聊天室成员管理

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 分页获取聊天室成员   |   GET   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users          | 100 次/秒/App Key                                                 |
| 添加单个聊天室成员    |    POST   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{username}  | 100 次/秒/App Key                                                 |
| 批量添加聊天室成员    |    POST   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users           | 100 次/秒/App Key                                                 |
| 删除单个聊天室成员  |  DELETE   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{username}  | 100 次/秒/App Key                                                 |
| 批量删除聊天室成员 |  DELETE   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{usernames}  | 100 次/秒/App Key                                                 |
| 获取聊天室管理员列表    |   GET    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/admin          | 100 次/秒/App Key                                                 |
| 添加聊天室管理员  |    POST    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/admin          | 100 次/秒/App Key                                                 |
| 移除聊天室管理员   |  DELETE    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/admin/{oldadmin}  | 100 次/秒/App Key                                                 |
| 查询聊天室黑名单    |   GET   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users   | 100 次/秒/App Key                                                 |
| 添加单个用户至聊天室黑名单 |    POST    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{username}  | 100 次/秒/App Key                                                 |
| 批量添加用户至聊天室黑名单  |    POST     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users   | 100 次/秒/App Key                                                 |
| 从聊天室黑名单移除单个用户   |  DELETE     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{username}  | 100 次/秒/App Key                                                 |
| 批量从聊天室黑名单移除用户   |  DELETE     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{usernames}  | 100 次/秒/App Key                                                 |
| 查询聊天室白名单   |   GET   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users`   | 100 次/秒/App Key                                                 |
| 添加单个用户至聊天室白名单  |    POST     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users/{username}  | 100 次/秒/App Key                                                 |
| 批量添加用户至聊天室白名单   |    POST    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users    | 100 次/秒/App Key                                                 |
| 将用户移除聊天室白名单  |  DELETE       | /{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users/{username}  | 100 次/秒/App Key                                                 |
| 获取聊天室的禁言列表  |   GET   | /{org_name}/{app_name}/chatrooms/{chatroom_id}/mute           | 100 次/秒/App Key                                                 |
| 禁言聊天室成员   |    POST    | /{org_name}/{app_name}/chatrooms/{chatroom_id}/mute           | 100 次/秒/App Key                                                 |
| 禁言聊天室全体成员    |    POST  | /{org_name}/{app_name}/chatrooms/{chatroom_id}/ban            | 100 次/秒/App Key  |
| 解除聊天室禁言成员   |  DELETE     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/mute/{member1}(,{member2},…)  | 100 次/秒/App Key      |
| 解除聊天室全员禁言    |  DELETE     | /{org_name}/{app_name}/chatrooms/{chatroom_id}/ban            | 100 次/秒/App Key   |
| 获取超级管理员列表   |   GET    | /{org_name}/{app_name}/chatrooms/super_admin                  | 100 次/秒/App Key  |
| 添加超级管理员   |    POST    | /{org_name}/{app_name}/chatrooms/super_admin                  | 100 次/秒/App Key   |
| 移除超级管理员    |  DELETE    | /{org_name}/{app_name}/chatrooms/super_admin/{superAdmin}     | 100 次/秒/App Key  |

## 全局禁言

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 设置用户全局禁言  |  POST      | /{org_name}/{app_name}/mutes         | 100 次/秒/App Key  |
| 查询单个用户 ID 全局禁言 |   GET   | /{org_name}/{appName}/mutes/username  | 100 次/秒/App Key  |
| 查询 app 下的所有全局禁言的用户  |   GET  | /{org_name}/{app_name}/mutes        | 100 次/秒/App Key  |

## 用户在线状态管理

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 设置用户在线状态信息  |  POST     | /{org_name}/{app_name}/users/{uid}/presence/{resource}/{status} | 50 次/秒/App Key  |
| 批量订阅在线状态    |  POST      | /{org_name}/{app_name}/users/{uid}/presence/{expiry}         | 50 次/秒/App Key   |
| 批量获取在线状态信息    |  POST   | /{org_name}/{app_name}/users/{uid}/presence                  | 50 次/秒/App Key |
| 查询单个群组的在线成员数量    |  GET   | /{org_name}/{app_name}/presence/online/{group_id}/type/{query_type}  | 100 次/秒/App Key |
|  取消订阅多个用户的在线状态     |  DELETE           | /{org_name}/{app_name}/users/{uid}/presence                  | 50 次/秒/App Key    |
| 查询订阅列表    |   GET       | /{org_name}/{app_name}/users/{uid}/presence/sublist?pageNum=1&pageSize=100 | 50 次/秒/App Key  |

### 消息表情回复 Reaction


| RESTful API 接口      | 方法   | 接口 URL        | 接口最高调用频率（默认值） |
| :------------------- | :----- | :------------------------ | :----------- |
| 创建/添加 Reaction         | POST   | /{org_name}/{app_name}/reaction/user/{userId}   | 100 次/秒/App Key |
| 根据消息 ID 获取 Reaction     | GET    | /{org_name}/{app_name}/reaction/user/{userId}  | 100 次/秒/App Key  |
| 删除 Reaction     | DELETE | /{org_name}/{app_name}/reaction/user/{userId} | 100 次/秒/App Key  |
| 根据消息 ID 和表情 ID 获取 Reaction 信息 | GET    | /{org_name}/{app_name}/reaction/user/{userId}/detail | 100 次/秒/App Key  |

### 子区管理

| RESTful API 接口      | 方法   | 接口 URL        | 接口最高调用频率（默认值） |
| :------------------- | :----- | :------------------------ | :----------- |
| 分页获取 app 中的子区  | GET  | /{org_name}/{app_name}/thread | 100 次/秒/App Key   |
| 分页获取单个用户加入的所有子区  | GET     | /{org_name}/{app_name}/threads/user/{username}    | 100 次/秒/App Key   |
| 分页获取单个用户在指定群组中加入的所有子区  | GET  | /{org_name}/{app_name}/threads/chatgroups/{group_id}/user/{username}    | 100 次/秒/App Key   |
| 创建子区  | POST     | /{org_name}/{app_name}/thread    | 100 次/秒/App Key  |
| 修改子区  | PUT     | /{org_name}/{app_name}/thread/{thread_id}    | 100 次/秒/App Key   |
| 删除子区  | DELETE     | /{org_name}/{app_name}/thread/{thread_id}    | 100 次/秒/App Key   |
| 分页获取子区成员列表  | GET     | /{org_name}/{app_name}/thread/{thread_id}/users    | 100 次/秒/App Key   |
| 用户批量加入子区  | POST     | /{org_name}/{app_name}/thread/{thread_id}/users   | 100 次/秒/App Key   |
| 批量踢出子区成员  | DELETE     | /{org_name}/{app_name}/threads/{thread_id}/users   | 100 次/秒/App Key  |