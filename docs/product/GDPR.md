# GDPR 安全合规

<Toc />

环信 IM 提供一系列数据删除和导出 API，保护数据安全和用户隐私 ，确保符合 GDPR（通用数据保护条例）的安全合规要求。

## 数据删除


为保护用户隐私，环信提供数据删除 REST API 供开发者对环信即时通讯服务器存储的用户相关数据进行删除，例如：删除用户账号、删除用户属性、删除群组和删除聊天室。

### 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization：Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 仅支持使用 app token 的鉴权方式，详见[使用 App Token 鉴权](easemob_app_token.html)。

### REST API 介绍

#### 删除用户账号

[删除 App 下指定的用户](/document/server-side/account_system.html#删除单个用户)，删除的用户数据主要包括用户的会话列表、用户属性和好友关系。

#### 删除用户属性

[删除 App 下指定用户的用户属性](/document/server-side/userprofile.html#删除用户属性)。

#### 删除群组

[删除 App 下指定群 ID 的群组](/document/server-side/group.html#删除群组)。

#### 删除聊天室

[删除 App 下指定 ID 的聊天室](/document/server-side/chatroom.html#删除聊天室)。

## 数据导出

### 功能描述

为了保证用户管理其隐私数据的权利，环信提供了数据导出 REST API，可供开发者导出环信即时通讯服务器存储的相关数据，包括用户数据、群组数据、聊天室数据、历史消息和附件。

### REST API 概览

本文介绍数据导出 API 的列表。

#### 导出用户数据

| REST API                                                     | 描述                                |
| :----------------------------------------------------------- | :---------------------------------- |
| [获取单个用户信息](/document/server-side/account_system.html#获取单个用户的详情)<br>[批量获取用户信息](/document/server-side/account_system.html#批量获取用户详情) | 获取 App 下指定用户 ID 的用户信息。 |
| [获取用户属性](/document/server-side/userprofile.html#获取用户属性) | 获取 App 下指定用户 ID 的用户属性。 |

#### 导出群组数据

| REST API                                                     | 描述                                      |
| :----------------------------------------------------------- | :---------------------------------------- |
| [群组详情](/document/server-side/group.html#获取群组详情) | 获取 App 下指定群组 ID 的群组详情。       |
| [App 下所有的群组](/document/server-side/group.html#获取-app-中所有的群组-可分页) | 获取 App 下包含所有群组的列表。           |
| [群组管理员列表](/document/server-side/group.html#获取群管理员列表) | 获取 App 下指定群组 ID 的群组管理员列表。 |
| [群组成员列表](/document/server-side/group.html#分页获取群组成员) | 获取 App下指定群组 ID 的群组成员列表。    |
| [群组公告](/document/server-side/group.html#获取群组公告) | 获取 App 下指定群组 ID 的群组公告。       |
| [群组共享文件](/document/server-side/group.html#获取群组共享文件) | 获取 App 下指定群组 ID 的群组共享文件。   |
| [群组黑名单列表](/document/server-side/group.html#查询群组黑名单) | 获取 App 下指定群组 ID 的群组黑名单列表。 |
| [群组禁言列表](/document/server-side/group.html#获取禁言列表) | 获取 App 下指定群组 ID 的群组禁言列表。   |

#### 导出聊天室数据

| REST API                                                     | 描述                                          |
| :----------------------------------------------------------- | :-------------------------------------------- |
| [获取聊天室详情](/document/server-side/chatroom.html#查询聊天室详情) | 获取 App 下指定聊天室 ID 的聊天室详情。       |
| [App 下所有的聊天室](/document/server-side/chatroom.html#获取-app-中所有的聊天室) | 获取 App 下所有的聊天室列表。                 |
| [用户加入的聊天室](/document/server-side/chatroom.html#获取用户加入的聊天室) | 获取 App 下指定用户 ID 加入的聊天室列表。     |
| [聊天室管理员列表](/document/server-side/chatroom.html#获取聊天室管理员列表) | 获取 App 下指定聊天室 ID 的聊天室管理员列表。 |
| [聊天室成员列表](/document/server-side/chatroom.html#分页获取聊天室成员) | 获取 App 下指定聊天室 ID 的聊天室禁言列表。   |
| [聊天室禁言列表](/document/server-side/chatroom.html#获取禁言列表) | 获取 App 下指定聊天室 ID 的聊天室禁言列表。   |

#### 获取历史消息记录

此接口一次只能获取一个小时的历史消息记录。

| REST API                                                     | 描述                                  |
| :----------------------------------------------------------- | :------------------------------------ |
| [获取历史消息记录](/document/server-side/message_historical.html) | 获取 App 下指定时间段的历史消息文件。 |

#### 导出附件

附件包含图片、语音、视频、文件。

| REST API                                                     | 描述                          |
| :----------------------------------------------------------- | :---------------------------- |
| [下载附件](/document/server-side/message_download.html#下载文件) | 下载 App 下指定 UUID 的附件。 |