# Rest API 调用频率限制

<Toc />

除部分 API 接口有特殊说明外，API 调用频率限制默认为 100 次/秒，具体每个接口限制以下表为准。

按模块查看接口调用频率限制：

## 帐号管理

| Rest API 接口 |方法  | 接口 URL|
| :------------ | :--- | :--------------------------- |
| 注册单个用户  |  POST  | /{org_name}/{app_name}/users        |
| 批量注册用户 |  POST   | /{org_name}/{app_name}/users       |

以上两个接口一共最高调用频率（默认值） 100 次/秒/App Key。

| Rest API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :------------------- | :----- | :----------------------------------------------------------- | :------------------------- |
| 获取 app/用户 token  | POST   | /{org_name}/{app_name}/token                                 | 300 次/秒/App Key          |
| 获取单个用户  |  GET | /{org_name}/{app_name}/users/{username}   | 100 次/秒/App Key   |
| 批量获取用户 |  GET  | /{org_name}/{app_name}/users      | 100 次/秒/App Key|
| 删除单个用户 |  DELETE  | /{org_name}/{app_name}/users/{username}         | 100 次/秒/App Key |
| 批量删除用户 |  DELETE   | /{org_name}/{app_name}/users       | 30 次/秒/App Key   |
| 修改用户密码  |  POST | /{org_name}/{app_name}/users/{username}/password      | 100 次/秒/App Key   |
| 获取用户在线状态  |  GET | /{org_name}/{app_name}/users/{username}/status        | 100 次/秒/App Key  |
| 批量获取用户在线状态  |  POST          | /{org_name}/{app_name}/users/batch/status  | 50 次/秒/App Key |
| 获取离线消息数       |  GET           | /{org_name}/{app_name}/users/{owner_username}/offline_msg_count        | 100 次/秒/App Key |
| 获取离线消息的状态    |  GET          | /{org_name}/{app_name}/users/{username}/offline_msg_status/{msg_id}       | 100 次/秒/App Key                                                 |
| 账号封禁   |  POST     | /{org_name}/{app_name}/users/{username}/deactivate          | 100 次/秒/App Key                                                 |
| 账号解禁    |  POST                    | /{org_name}/{app_name}/users/{username}/activate         | 100 次/秒/App Key                                                 |
| 强制下线         |  GET          | /{org_name}/{app_name}/users/{username}/disconnect         | 100 次/秒/App Key       |

## 消息推送

| Rest API 接口        | 方法 | 接口 URL                                |
| :------------------- | :--- | :-------------------------------------- |
| 设置推送消息显示昵称 | PUT  | /{org_name}/{app_name}/users/{username} |
| 设置推送消息展示方式 | PUT  | /{org_name}/{app_name}/users/{username} |
| 设置免打扰           | PUT  | /{org_name}/{app_name}/users/{username} |

以上三个接口共限制，接口最高调用频率（默认值）100 次/秒/App Key。

## 消息管理

| Rest API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------------------- | :----- | :--------------------------------------------------- | :----------------------------------------------------------- |
| 发送消息                     | POST   | /{org_name}/{app_name}/messages                      | 100 次/秒/App Key （说明：1 秒下行分发消息量限制是该频率的 20 倍；该接口废弃，后期不再增加新特性） |
| 发送单聊消息                 | POST   | /{org_name}/{app_name}/messages/users                | 6000 条/分钟/App Key                                         |
| 发送群聊消息                 | POST   | /{org_name}/{app_name}/messages/chatgroups           | 20 条/秒/App Key                                             |
| 发送聊天室消息               | POST   | /{org_name}/{app_name}/messages/chatrooms            | 100 条/秒/App Key                                            |
| 上传文件  |    POST  | /{org_name}/{app_name}/chatfiles       | 100 次/秒/App Key                                                 |
| 下载文件      |  GET     | /{org_name}/{app_name}/chatfiles/{uuid}       | 100 次/秒/App Key                                                 |
| 获取历史消息（聊天记录）文件   |  GET     | /{org_name}/{app_name}/chatmessages/${time}          | 10 次/分钟/App Key                                               |
| 服务端消息撤回    |    POST  | /{org_name}/{app_name}/messages/recall        | 100 次/秒/App Key                                                 |
| 服务端单向删除会话   |    DELETE    | /{org_name}/{app_name}/users/{userName}/user_channel          | 100 次/秒/App Key                                                 |
| 拉取会话列表    |   GET    | /{org_name}/{app_name}/user/{username}/user_channels       | 5 次/分钟/单用户 ID，100 次/秒/App Key    |

## 用户属性

| Rest API 接口 |方法  | 接口 URL |
| :------------------------- | :--- | :---------------------------------------------- |
| 获取指定用户的所有用户属性   |  GET     | /{org_name}/{app_name}/metadata/user/{username}             |
| 获取用户属性总量大小   |  GET     | /{org_name}/{app_name}/metadata/user/capacity           |

以上两个接口一共最高调用频率（默认值） 100 次/秒/App Key。

| Rest API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- | :----- | :---------------------------------------------- | :------------------------- |
| 设置用户属性      |  PUT     | /{org_name}/{app_name}/metadata/user/{username}            | 100 次/秒/App Key                                                 |
| 批量获取用户属性    |    POST      | /{org_name}/{app_name}/metadata/user/get           | 100 次/秒/App Key                                                 |
| 删除用户属性   |    DELETE     | /{org_name}/{app_name}/metadata/user/{username}      | 100 次/秒/App Key                                                 |

## 用户关系管理

| Rest API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :------------- | :----- | :----------------------------------------------------------- | :------------------------- |
| 添加好友   |    POST         | /{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}    | 100 次/秒/App Key                                                 |
| 移除好友    |    DELETE        | /{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}    | 100 次/秒/App Key                                                 |
| 获取好友列表    |  GET      | /{org_name}/{app_name}/users/{owner_username}/contacts/users   | 100 次/秒/App Key                                                 |
| 获取黑名单列表     |  GET       | /{org_name}/{app_name}/users/{owner_username}/blocks/users   | 50 次/秒/App Key                                                  |
| 添加黑名单    |    POST       | /{org_name}/{app_name}/users/{owner_username}/blocks/users    | 50 次/秒/App Key                                                  |
| 移除黑名单 |    DELETE      | /{org_name}/{app_name}/users/{owner_username}/blocks/users/{blocked_username}   | 50 次/秒/App Key                                                  |

## 群组管理

| Rest API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 获取 app 中所有的群组（可分页）  |  GET     | /{org_name}/{app_name}/chatgroups        | 100 次/秒/App Key                                                 |
| 获取一个用户参与的所有群组   |  GET         | /{app_name}/users/{username}/joined_chatgroups        | 50 次/秒/App Key                                                  |
| 获取群组详情        |  GET        | /{org_name}/{app_name}/chatgroups/{group_ids}           | 100 次/秒/App Key            |
| 创建一个群组  |    POST      | /{org_name}/{app_name}/chatgroups                  | 100 次/秒/App Key                                                 |
| 修改群组信息   |    PUT         | /{org_name}/{app_name}/chatgroups/{group_id}             | 100 次/秒/App Key                                                 |
| 删除群组 |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}                    | 100 次/秒/App Key                                                 |
| 获取群组公告     |  GET     | /{org_name}/{app_name}/chatgroups/{group_id}/announcement         | 100 次/秒/App Key                                                 |
| 修改群组公告  |    POST| /{org_name}/{app_name}/chatgroups/{group_id}/announcement          | 100 次/秒/App Key                                                 |
| 获取群组共享文件   |  GET     | 不分页：/{org_name}/{app_name}/chatgroups/{group_id}/share_files<br>分页：/{org_name}/{app_name}/chatgroups/{group_id}/share_files?pagenum=1&pagesize=10        | 100 次/秒/App Key                                                 |
| 上传群组共享文件  |    POST  | /{org_name}/{app_name}/chatgroups/{group_id}/share_files       | 100 次/秒/App Key                                                 |
| 下载群组共享文件    |  GET   | /{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}   | 100 次/秒/App Key                                                 |
| 删除群组共享文件   |    DELETE   | /{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}     | 100 次/秒/App Key                                                 |

## 群成员管理

| Rest API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 分页获取群组成员  |  GET     | /{org_name}/{app_name}/chatgroups/{group_id}/users       | 100 次/秒/App Key                                                 |
| 添加单个群组成员     |    POST | /{org_name}/{app_name}/chatgroups/{group_id}/users/{username}    | 100 次/秒/App Key                                                 |
| 批量添加群组成员    |    POST   | /{org_name}/{app_name}/chatgroups/{chatgroupid}/users           | 100 次/秒/App Key                                                 |
| 移除单个群组成员     |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}/users/{username}    | 100 次/秒/App Key                                                 |
| 批量移除群组成员    |    DELETE     | /{org_name}/{app_name}/chatgroups/{group_id}/users/{usernames}    | 100 次/秒/App Key                                                 |
| 获取群管理员列表    |  GET       | /{org_name}/{app_name}/chatgroups/{group_id}/admin              | 100 次/秒/App Key                                                 |
| 添加群管理员     |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/admin              | 100 次/秒/App Key                                                 |
| 移除群管理员     |    DELETE  | /{org_name}/{app_name}/chatgroups/{group_id}/admin/{oldadmin}    | 100 次/秒/App Key                                                 |
| 转让群组       |    PUT | /{org_name}/{app_name}/chatgroups/{groupid}                     | 100 次/秒/App Key                                                 |
| 查询群组黑名单    |    GET   | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users       | 100 次/秒/App Key                                                 |
| 添加单个用户至群组黑名单   |    POST      | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{username}    | 100 次/秒/App Key                                                 |
| 批量添加用户至群组黑名单   |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users       | 100 次/秒/App Key                                                 |
| 从群组黑名单移除单个用户   |    DELETE  | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{username}    | 100 次/秒/App Key                                                 |
| 批量从群组黑名单移除用户  |    DELETE  | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{usernames}    | 100 次/秒/App Key                                                 |
| 查询群组白名单  |    GET | /{org_name}/{app_name}/chatgroups/{group_id}/white/users        | 100 次/秒/App Key                                                 |
| 添加单个用户至群组白名单 |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/white/users/{username}    | 100 次/秒/App Key                                                 |
| 批量添加用户至群组白名单|    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users       | 100 次/秒/App Key                                                 |
| 将用户移除群组白名单 |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}/white/users/{username}    | 100 次/秒/App Key                                                 |
| 获取禁言列表 |    GET    | /{org_name}/{app_name}/chatgroups/{group_id}/mute              | 100 次/秒/App Key                                                 |
| 禁言单个群成员    |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/mute               | 100 次/秒/App Key                                                 |
| 禁言全体成员    |    POST    | /{org_name}/{app_name}/chatgroups/{group_id}/ban                | 100 次/秒/App Key                                                 |
| 解除成员禁言   |    DELETE   | /{org_name}/{app_name}/chatgroups/{group_id}/mute/{member1}(,{member2},…)    | 100 次/秒/App Key                                                 |
| 解除全员禁言 |    DELETE    | /{org_name}/{app_name}/chatgroups/{group_id}/ban                | 100 次/秒/App Key                                                 |

## 聊天室管理

| Rest API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 获取 app 中所有的聊天室  |    GET   | /{org_name}/{app_name}/chatrooms                                 | 50 次/秒/App Key                                                  |
| 获取用户加入的聊天室 |    GET       | /{org_name}/{app_name}/users/{username}/joined_chatrooms         | 50 次/秒/App Key                                                  |
| 获取聊天室详情     |    GET    | /{org_name}/{app_name}/chatrooms/{chatroom_id}                   | 100 次/秒/App Key                                                 |
| 创建一个聊天室   |    POST   | /{org_name}/{app_name}/chatrooms                                 | 50 次/秒/App Key                                                  |
| 修改聊天室信息 |    PUT     | /{org_name}/{app_name}/chatrooms/{chatroom_id}                   | 100 次/秒/App Key                                                 |
| 删除聊天室  |  DELETE  | /{org_name}/{app_name}/chatrooms/{chatroom_id}                   | 100 次/秒/App Key                                                 |
| 获取聊天室公告  |   GET  | /{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement      | 100 次/秒/App Key                                                 |
| 修改聊天室公告   |    POST | /{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement      | 100 次/秒/App Key                                                 |
| 获取聊天室自定义属性 | POST  | /{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement | 100 次/秒/App Key                                                 |
| 设置聊天室自定义属性 | PUT  | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username} | 100 次/秒/App Key                                                 |
| 强制设置聊天室自定义属性 | PUT | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced | 100 次/秒/App Key                                                 |
| 删除聊天室自定义属性 | DELETE  | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username} | 100 次/秒/App Key                                                 |
| 强制删除聊天室自定义属性 | DELETE  | /{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced | 100 次/秒/App Key                                                 |

## 聊天室成员管理

| Rest API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
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

| Rest API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 设置用户全局禁言  |  POST      | /{org_name}/{app_name}/mutes         | 100 次/秒/App Key  |
| 查询单个用户 ID 全局禁言 |   GET   | /{org_name}/{appName}/mutes/username  | 100 次/秒/App Key  |
| 查询 app 下的所有全局禁言的用户  |   GET  | /{org_name}/{app_name}/mutes        | 100 次/秒/App Key  |

## 用户在线状态管理

| Rest API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :--------------- |:------ | :------------  | :----------- |
| 设置用户在线状态信息  |  POST     | /{org_name}/{app_name}/users/{uid}/presence/{resource}/{status} | 50 次/秒/App Key  |
| 批量订阅在线状态    |  POST      | /{org_name}/{app_name}/users/{uid}/presence/{expiry}         | 50 次/秒/App Key   |
| 批量获取在线状态信息    |  POST   | /{org_name}/{app_name}/users/{uid}/presence                  | 50 次/秒/App Key |
| 取消订阅     |  DELETE           | /{org_name}/{app_name}/users/{uid}/presence                  | 50 次/秒/App Key    |
| 查询订阅列表    |   GET       | /{org_name}/{app_name}/users/{uid}/presence/sublist?pageNum=1&pageSize=100 | 50 次/秒/App Key  |