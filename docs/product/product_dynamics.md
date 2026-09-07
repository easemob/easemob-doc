---
title: 产品动态
show_mcp_server: false
show_server_search: false
show_callback_route: false
show_server_callback_route: false
---

# 产品动态

## 2026-08

#### IM Android/iOS SDK v5.0.0 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android/iOS SDK 5.0.0 开发版发布   | - 提供统一的数据同步配置和状态回调。应用可 [配置登录后自动同步会话](/document/android/initialization.html#设置登录后自动同步数据)、[好友](/document/android/user_relationship.html#登录后自动同步好友列表)和 [已加入群组](/document/android/group_manage.html#获取当前用户加入的群组列表) 数据，并在本地数据库打开后提前读取本地数据。<br/> - [群组配置](/document/android/group_manage.html#创建群组) 拆分为多个独立属性，并支持创建群组后按需更新指定配置。<br/> - 原有的单条消息回执、会话回执和全局回执开关已调整为批量消息回执和未读数清理接口，覆盖单聊和群聊场景。 <br/> - 支持 [批量删除会话](/document/android/conversation_delete.html#批量删除本地会话) 和 [会话展示信息](/document/android/conversation_list.html#获取会话名称和头像) 等常用管理能力。<br/> - 移除密码登录，不再支持自动登录。 <br/> - 移除客户端注册、公开群列表、聊天室创建和销毁、消息统计等低频 API。 <br/> - | 2026-8-15     | - [Android SDK 5.0.0 更新日志](/document/android/releasenote.html#v5-0-0-dev-2026-8-12) <br/> - [iOS SDK 5.0.0 更新日志](/document/ios/releasenote.html#v5-0-0-dev-2026-8-12)  |

#### IM Web SDK v5.1.0 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web/小程序 SDK 5.1.0 开发版发布   | - 支持通过 App ID 进行 SDK 初始化。<br/> - 新增 `ChatClient` 统一入口，负责 [SDK 初始化](/document/web/initialization.html)、[登录登出](/document/web/login.html)、[连接生命周期](/document/web/connection.html)、事件分发和 Manager 注册。<br/> - 支持模块化 Manager 能力拆分。  <br/> - 支持类型化 [消息创建](/document/web/message_send.html) 接口。 <br/> - 支持消息扩展能力，包括 [消息撤回](/document/web/message_recall.html)、[消息编辑](/document/web/message_modify.html)、[消息置顶](/document/web/message_pin.html)、[引用消息](/document/web/message_quote.html)、[Reaction](/document/web/reaction.html)、[历史消息拉取](/document/web/message_retrieve.html)、[服务端消息搜索](/value-added/search/message_search_web.html)、[消息翻译](/value-added/translation/message_translation_web.html)、[合并消息解析](/document/web/message_receive.html#接收合并消息) 和 [流式消息接收](/document/web/message_stream_receive.html)。<br/> - 支持统一的 [消息已读回执](/document/web/message_receipt.html#单聊消息已读回执) 能力。<br/> - 支持 [会话列表本地缓存与自动同步](/document/web/conversation_list.html)。 <br/> - 完善会话管理：支持 [会话置顶](/document/web/conversation_pin.html)、[会话标记](/document/web/conversation_mark.html)、[会话删除](/document/web/conversation_delete.html) 和 [会话未读数清零](/document/web/conversation_unread.html) 能力。 <br/> - 支持 [用户属性订阅](/document/web/userprofile.html#订阅非好友用户的属性变更) 和 [用户信息自动管理](/document/web/userinfo_provider.html) <br/> - 多场景能力统一：支持 [群组](/document/web/group_manage.html)、[聊天室](/document/web/room_manage.html)、[消息话题](/document/web/thread.html)、[在线状态](/document/web/presence.html) 和 [推送通知](/document/web/push/push_overview.html) 相关能力。<br/> - 支持跨平台运行时适配层：可在 Web、微信小程序、uni-app、React Native 和 Electron 等环境中适配请求、上传、WebSocket 和本地存储等基础能力。<br/> - 移除密码 [登录](/document/web/login.html) 。| 2026-8-21    | - [Web/小程序 SDK 5.1.0 更新日志](/document/web/releasenote.html#v5-1-0-dev-2026-8-21)   |

<HideSection :show="$frontmatter.show_server_search">

## 2026-07

:::tip
目前，服务端消息搜索仅面向中国区开放。
:::

#### IM Android/iOS SDK v4.24.0 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android/iOS SDK 4.24.0 开发版发布   | - Android 和 iOS SDK [支持服务端消息搜索](/value-added/search/message_search_android.html)。<br/> - Android 可通过异步方法 [更新群扩展字段](/docs/v4/android/group_attributes.html#更新群扩展字段)。<br/> - Android 可通过异步方法 [获取服务器端推送配置](/docs/v4/android/push/push_display_attribute.html#获取推送通知的显示属性)。   | 2026-7-10     | - [Android SDK 4.24.0 更新日志](/docs/v4/android/releasenote.html#v4-24-0-dev-2026-7-10-开发版) <br/> - [iOS SDK 4.24.0 更新日志](/docs/v4/ios/releasenote.html#v4-24-0-dev-2026-7-10-开发版)  |


#### IM Web/小程序 SDK v4.24.1 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web/小程序 SDK v4.24.1 开发版发布   | [支持服务端消息搜索](/value-added/search/message_search_web.html)。   | 2026-7-10     | - [Web SDK 4.24.1 更新日志](/docs/v4/web/releasenote.html#v4-24-1-dev-2026-7-10-开发版) <br/> - [小程序 SDK 4.24.1 更新日志](/docs/v4/applet/releasenote.html#v4-24-0-dev-2026-7-10-开发版)  |

#### 服务端支持消息搜索

服务端支持根据关键词搜索历史消息。详见 [消息搜索文档](/value-added/search/message_search_rest.html)。

消息搜索为增值服务，要使用该功能，需要在环信控制台开通，详见 [开通说明](/product/console/purchase_value_added.html#消息搜索)。开通后，系统会为你的应用创建搜索索引资源并开始同步消息数据。

目前，仅中国区集群支持该功能。

**关于扩展字段搜索**： 开通消息搜索服务后，消息扩展字段（`ext`）搜索默认不开启。如需使用该功能，可在开通时一并说明，或后续联系商务单独开通。

</HideSection>

## 2026-06

<HideSection :show="$frontmatter.show_callback_route">

:::tip
目前，[发消息时设置回调路由功能](/document/android/message_send.html#发消息时设置回调路由) 仅面向中国区开放。
:::

#### IM HarmonyOS SDK v1.13.0 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| HarmonyOS SDK 1.13.0 开发版发布   | - [支持用户信息自动管理](/document/harmonyos/userinfo_provider.html)。<br/> - [群成员名片](/document/harmonyos/group_namecard.html)。<br/> - [支持语言转文字](/value-added/stt/voice_to_text_harmonyos.html)。   | 2026-6-24     | [HarmonyOS SDK 1.13.0 更新日志](/document/harmonyos/releasenote.html#v1-13-0-dev-2026-6-24-开发版)   |

#### IM Android/iOS/Web/小程序 SDK v4.23.0 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android/iOS SDK 4.23.0 开发版发布   | - 支持 [为消息配置回调路由标识，使消息可按指定路由触发发送前回调和发送后回调](/docs/v4/android/message_send.html#发消息时设置回调路由)。<br/> - 新增 [登录失败相关的连接超时错误码](/docs/v4/android/error.html)。 | 2026-6-18     | - [Android SDK 4.23.0 更新日志](/docs/v4/android/releasenote.html#v4-23-0-dev-2026-6-10-开发版) <br/> - [iOS SDK 4.23.0 更新日志](/docs/v4/ios/releasenote.html#v4-23-0-dev-2026-6-10-开发版) <br/>       |
| Web/小程序 SDK 4.23.0 开发版发布   | 支持 [为消息配置回调路由标识，使消息可按指定路由触发发送前回调和发送后回调](/docs/v4/android/message_send.html#发消息时设置回调路由)。  | 2026-6-18    | - [Web SDK 4.23.0 更新日志](/docs/v4/web/releasenote.html#v4-23-0-dev-2026-6-10-开发版)<br/> - [小程序 SDK 4.23.0 更新日志](/docs/v4/applet/releasenote.html#v4-23-0-dev-2026-6-10-开发版) |

</HideSection>

#### IM 客户端 SDK v4.22.0 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android/iOS SDK 4.22.0 开发版发布   | - 图片消息分层资源管理，[发送方发消息时可选择上传原图或大图](/docs/v4/android/message_send.html#发送图片消息)，[接收方可下载原图、大图和缩略图](/docs/v4/android/message_send.html#发送图片消息)。<br/> - [支持登录成功后自动同步好友列表及好友信息](/docs/v4/android/user_relationship.html#开启自动同步) <br/> - 支持 [订阅非好友用户的属性变更功能](/docs/v4/android/userprofile.html#订阅非好友用户的属性变更)。<br/> - 新增同步数据 WebSocket 服务地址和端口配置接口。 | 2026-6-17     | - [Android SDK 4.22.0 更新日志](/docs/v4/android/releasenote.html#v4-22-0-dev-2026-6-5-开发版) <br/> - [iOS SDK 4.22.0 更新日志](/docs/v4/ios/releasenote.html#v4-22-0-dev-2026-6-5-开发版) <br/>       |
| Web/小程序 SDK 4.22.0 开发版发布   | 图片消息分层资源管理，[发送方发消息时可选择上传原图或大图](/docs/v4/web/message_send.html#发送图片消息)，[接收方可下载原图、大图和缩略图](/docs/v4/web/message_send.html#发送图片消息)。  | 2026-6-17     | - [Web SDK 4.22.0 更新日志](/docs/v4/web/releasenote.html#v4-22-0-dev-2026-6-5-开发版)<br/> - [小程序 SDK 4.22.0 更新日志](/docs/v4/applet/releasenote.html#v4-22-0-dev-2026-6-5-开发版) |

<HideSection :show="$frontmatter.show_server_callback_route">

#### 服务端支持发消息时设置回调路由

服务端支持在单聊、群组聊天和聊天室中发消息时设置回调路由，使消息可按指定路由触发 [发送后回调](/document/server-side/callback_postsending.html)。

调用发送消息接口时，只需在发消息时在请求体中传入 `env` 参数。单聊、群聊和聊天室的接口均支持该字段，使用方式完全一致，详见 [发送单聊消息时设置回调路由](/document/server-side/message_single.html#发消息时设置回调路由)。

</HideSection>

## 2026-04

#### IM 客户端 SDK v4.21.0 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android/iOS/Web/小程序 SDK 4.21.0 开发版发布   | [支持语言转文字](/value-added/stt/voice_to_text_android.html)。  | 2026-4-28     | - [Android SDK 4.21.0 更新日志](/docs/v4/android/releasenote.html#v4-21-0-dev-2026-4-28-开发版) <br/> - [iOS SDK 4.21.0 更新日志](/docs/v4/ios/releasenote.html#v4-21-0-dev-2026-4-28-开发版) <br/> - [Web SDK 4.21.0 更新日志](/docs/v4/web/releasenote.html#v4-21-0-dev-2026-4-28-开发版)<br/> - [小程序 SDK 4.21.0 更新日志](/docs/v4/applet/releasenote.html#v4-21-0-dev-2026-4-28-开发版)      |
| React Native SDK 1.15.0 开发版发布   | [支持接收服务端发送的流式消息](/document/harmonyos/message_stream_receive.html)。  | 2026-4-22     | [React Native 1.15.0 更新日志](/document/react-native/releasenote.html#v1-15-0-2026-04-22)  |

## 2026-03

<HideSection :show="$frontmatter.show_mcp_server">

#### 环信 MCP Server

环信 MCP Server 基于 MCP（Model Context Protocol）实现，为支持 MCP 的 AI 编程工具提供即时通讯 IM 相关文档查询和源码检索能力，可用于以下场景：

- 查询 SDK、单群聊 UIKit、CallKit、聊天室 UIKit 文档。
- 检索 Demo 或示例工程源码。
- 辅助集成、功能开发和问题排查。

环信 MCP Server 支持以下平台 SDK、单群聊 UIKit、CallKit、聊天室 UIKit 的文档查询与源码检索能力：

| 平台         | SDK  | 单群聊 UIKit | CallKit | 聊天室 UIKit | Demo 源码 |
| :----------- | :--- | :---- | :------ | :------------ | :-------- |
| iOS          | ✓    | ✓     | ✓       | ✓             | ✓         |
| Android      | ✓    | ✓     | ✓       | ✓             | ✓         |
| Web          | ✓    | ✓     | ✓       | ✓             | ✓         |
| HarmonyOS    | ✓    | ✓     | ✗       | ✗             | ✗         |
| Flutter      | ✓    | ✓     | ✗       | ✓             | ✓         |
| React Native | ✓    | ✓     | ✗       | ✓             | ✓         |

环信 MCP Server 支持的工具、安装与配置说明，详见环信 MCP Server 使用指南。例如，以下为 Android 平台文档链接：
- [SDK](/document/android/easemob_mcp_server.html)
- [单群聊 UIKit](/uikit/chatuikit/android/easemob_mcp_server.html)
- [CallKit](/callkit/android/easemob_mcp_server.html)
- [聊天室 UIKit](/uikit/chatroomuikit/android/easemob_mcp_server.html)

</HideSection>

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android/iOS SDK 4.20.0 开发版发布   | - [支持用户信息自动管理](/docs/v4/android/userinfo_provider.html)。<br/> - [群成员名片](/docs/v4/android/group_namecard.html)。  | 2026-3-30     | - [Android SDK 4.20.0 更新日志](/docs/v4/android/releasenote.html#v4-20-0-dev-2026-3-30-开发版) <br/> - [iOS SDK 4.20.0 更新日志](/docs/v4/ios/releasenote.html#v4-20-0-dev-2026-3-30-开发版)       |
| HarmonyOS SDK 1.12.0 开发版发布   | - [支持接收服务端发送的流式消息](/document/harmonyos/message_stream_receive.html)。<br/> - WebSocket 连接支持 IPv6 地址。  | 2026-3-18     | [HarmonyOS SDK 1.12.0 更新日志](/document/harmonyos/releasenote.html#v1-12-0-dev-2026-3-18-开发版)        |
| Flutter SDK 4.19.0 发布   | [支持接收服务端发送的流式消息](/document/flutter/message_stream_receive.html)。 | 2026-3-27     | [Flutter SDK 4.19.0 更新日志](/document/flutter/releasenote.html#v4-19-0-2026-3-27)        |

#### 服务端 API

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| 新增发送流式消息 API   | - 新增发送单聊流式消息 API。 <br/> - 新增发送群聊流式消息 API。 | 2026-3-18  | - [发送单聊流式消息 API](/document/server-side/message_stream_send_single.html) <br/> - [发送群聊流式消息 API](/document/server-side/message_stream_send_group.html)        |

## 2026-02

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Andriod/iOS SDK 4.19.0 开发版发布   | - [支持接收服务端发送的流式消息](/docs/v4/android/message_stream_receive.html)。<br/> - [SDK 依赖的 AOSL Crash 检测库](/docs/v4/android/releasenote.html#v4-19-0-dev-2026-2-2-开发版)。  | 2026-2-2     | - [Android SDK 4.19.0 更新日志](/docs/v4/android/releasenote.html#v4-19-0-dev-2026-2-2-开发版)  <br/> - [iOS SDK 4.19.0 更新日志](/docs/v4/ios/releasenote.html#v4-19-0-dev-2026-2-2-开发版)        |
| Web/小程序 SDK 4.19.1 开发版发布   | [支持接收服务端发送的流式消息](/docs/v4/web/message_stream_receive.html)。  | 2026-2-2     | - [Web SDK 4.19.1 更新日志](/docs/v4/web/releasenote.html#_4-19-1-dev-2026-2-27-开发版)  <br/> - [小程序 SDK 4.19.1 更新日志](/docs/v4/applet/releasenote.html#_4-19-1-dev-2026-2-27-开发版)        |
| uniapp SDK 4.19.0 开发版发布   | [uniapp 平台支持自动登录](/docs/v4/applet/uniapp.html#自动登录)。  | 2026-2-4     | [uniapp SDK 4.19.0 更新日志](/docs/v4/applet/releasenote.html#_4-19-0-dev-2026-02-04-开发版)          |
| HarmonyOS SDK 1.11.0 开发版发布   | - 底层支持安全 DNS 解析 DoH，提高连通性。<br/> - 私有化部署底层链路支持 TCP 和 WebSocket 之间切换。 | 2026-2-4     | [HarmonyOS SDK 1.11.0 更新日志](/document/harmonyos/releasenote.html#v1-11-0-dev-2026-2-4-开发版)          |

#### CallKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android CallKit 4.19.0 发版   | - 支持灵活配置 RTC 参数。<br/> - 支持控制是否禁用 RTC Token 验证  | 2026-2-4     | [Android CallKit 4.19.0 更新日志](/callkit/android/releasenote.html#v4-19-0)          |

## 2026-01

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| HarmonyOS SDK 1.9.0 开发版发布   | - 新增 Native Crash 上报能力：当 SDK native 层代码发生 Crash 时，会在下次启动后上报 Crash 信息。<br/> - 支持 [根据关键字从本地数据库中获取本地会话的消息](/document/harmonyos/message_retrieve.html#根据关键字获取本地会话中的消息)，SDK 返回会话 ID 及消息 ID 列表的映射关系。<br/> - 支持 [根据消息 ID 列表获取本地消息](/document/harmonyos/message_retrieve.html#根据消息-id-列表获取本地消息)。 | 2026-1-9       | [HarmonyOS SDK 1.9.0 更新日志](/document/harmonyos/releasenote.html#v1-9-0-2026-1-9)          |
| HarmonyOS SDK 1.10.0 开发版发布 | - 长连接支持 WebSocket 协议。<br/> - 支持 WebSocket 私有部署。|2026-1-26 | [HarmonyOS SDK 1.10.0 更新日志](/document/harmonyos/releasenote.html#v1-10-0-dev-2026-1-26-开发版) |
| React Native SDK 1.13.0 开发版发布 | - 长连接支持 WebSocket 协议。<br/> - 支持 WebSocket 私有部署。|2026-1-28 | [React Native SDK 1.13.0 更新日志](/document/react-native/releasenote.html#v1-13-0-2026-01-28) |
| Unity SDK 1.4.0 开发版发布 | - [支持修改各类型的消息](/document/unity/message_modify.html)：<br/>1. 文本/自定义消息：支持编辑消息内容（body）和扩展 `ext`。<br/>2.  文件/视频/音频/图片/位置/合并转发消息：只支持编辑消息扩展 `ext`。<br/>3. 透传消息：不支持修改。<br/> - 支持 [发送](/document/unity/message_send.html#发送-gif-图片消息) 和 [接收 GIF 图片消息](/document/unity/message_receive.html#接收-gif-图片消息)。<br/> - 支持 [群组头像功能](/document/unity/group_attributes.html#管理群组头像)。<br/> - 支持 [拉取群组中指定的单个或多个成员发送的历史消息](/document/unity/message_retrieve.html#从服务器获取指定会话的消息)。<br/> - 支持 [从本地获取指定群成员发送的消息](/document/unity/message_retrieve.html#从本地获取指定群成员发送的消息)。<br/> - 支持 [获取群成员列表](/document/unity/group_manage.html#获取群成员列表) 时包括成员角色和入群时间。<br/> - 支持 [根据关键字从本地数据库中获取会话的消息 ID 列表](/document/unity/message_retrieve.html#根据关键字获取本地会话的消息-id)，SDK 返回会话 ID 及消息 ID 列表。<br/> - 支持 [根据消息 ID 列表获取本地消息](/document/unity/message_retrieve.html#根据消息-id-列表获取本地消息)。<br/> - 群组成员进出事件支持一次通知多个成员进出群组。调整前，SDK 会为每个加入/退出的成员单独回调一条事件。 |2026-1-30 | [Unity SDK 1.4.0 更新日志](/document/unity/releasenote.html#v1-4-0-2026-01-30) |


#### UIKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web UIKit 2.4.0 发版   | `ConversationList` 组件增加 `includeEmptyConversations` 参数控制是否拉取 [空会话](/docs/v4/web/conversation_overview.html#空会话)。 | 2026-1-9      | [Web 单群聊 UIKit 2.4.0 更新日志](/uikit/chatuikit/web/releasenote.html#v2-4-0)          |

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web 聊天室 UIKit 2.4.0 发版   | - `Chatroom` 组件增加 `customMessageRenderers` 参数用于自定义消息的界面展示。<br/> - `Provider` 组件增加 `initConfig.countMemberJoinToUnread` 参数，表示聊天室人员加入的消息是否计未读数。 | 2026-1-9       | [Web 聊天室 UIKit 2.4.0 更新日志](/uikit/chatroomuikit/web/roomuikit_releasenote.html#v2-4-0)          |

#### CallKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web CallKit 2.4.0 发布    | 支持在多摄像头设备上切换摄像头（注意：部分机型有兼容问题）。  | 2026-1-9       | [Web CallKit 2.4.0 更新日志](/callkit/web/releasenote.html#v2-4-0)          |

## 2025-12

#### 服务端 API

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| 新增主动文本审核 RESTful API   | 调用文本审核 API，业务服务器传入需审核的文本内容，IM 服务器进行审核，返回审核结果。 | 2025-12-12  | [主动文本审核](/document/server-side/moderation_text_active.html)         |
| - 基于自定义群组 ID 创建群组<br/> - 基于自定义聊天室 ID 创建聊天室  | 调用创建群组或聊天室的 RESTful API 时，你可以传入自定义的群组 ID 或聊天室 ID 创建群组或聊天室。若你不传入自定义群组 ID 或聊天室 ID，即时通讯 IM 创建时会自动生成。 | 2025-12-12       | [创建群组](/document/server-side/group_create.html#请求-body-参数) 或 [创建聊天室](/document/server-side/chatroom_create.html#请求-body-参数)          |

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web/小程序 SDK 4.17.1 开发版发布   | 优化日志输出格式和内容。 | 2025-12-12       | - [Web SDK 4.17.1 更新日志](/docs/v4/web/releasenote.html#_4-17-1-2025-12-12) <br/> - [小程序 SDK 4.17.1 更新日志](/docs/v4/applet/releasenote.html#_4-17-1-2025-12-12)         |
| Flutter 4.16.0 发版    | - 支持 [根据消息 ID 列表获取本地消息](/document/flutter/message_retrieve.html#根据消息-id-列表获取本地消息)。<br/> - 支持私有部署时设置 IPv6 格式的 REST 地址。 | 2025-12-10       |  [Flutter SDK 4.16.0 更新日志](/document/flutter/releasenote.html#v4-16-0-2025-12-10)         |
| Flutter 4.17.0 发版    | - 长连接支持 WebSocket 协议。<br/> - 私有化部署底层链路支持 TCP 和 WebSocket 之间的切换。 | 2025-12-17       |  [Flutter SDK 4.17.0 更新日志](/document/flutter/releasenote.html#v4-17-0-2025-12-17)         |

#### UIKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web 单群聊 UIKit 2.3.1 发版   | - 支持监听用户获取会话列表事件 `getConversationlist`。<br/> - 优化图片放大查看效果。<br/> -  使用 `customRenderers` 代替原来的 `renderMessage` 来自定义消息的界面展示。<br/> - 优化移动设备上消息操作菜单的显示。 | 2025-12-4      | [Web 单群聊 UIKit 2.2.0 更新日志](/uikit/chatuikit/web/releasenote.html#v2-3-1)          |
| Flutter 单群聊 UIKit 2.3.0-dev.1 发版   | 合并聊天室 UIKit 并完整本地化。 | 2025-12-20      | [Flutter 单群聊 UIKit 2.3.0-dev.1 更新日志](/uikit/chatuikit/flutter/releasenote.html#v2-3-0-dev-1) |
| Flutter UIKit 2.2.0 发版   | - 升级第三方库。<br/> - 修改撤回消息回调。<br/> - 修改群默认头像设置。 | 2025-12-20      | [Flutter 单群聊 UIKit 2.3.0-dev.1 更新日志](/uikit/chatuikit/flutter/releasenote.html#v2-3-0-dev-1) |

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web 聊天室 UIKit 2.3.1 发版   | `ChatroomMessage` 组件支持自定义消息操作菜单。 | 2025-12-4       | [Web 聊天室 UIKit 2.3.1 更新日志](/uikit/chatroomuikit/web/roomuikit_releasenote.html#v2-3-1)          |

#### CallKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web CallKit 2.3.1 发布    | 增加 `useRTCToken` 参数，控制是否开启 Token 校验。  | 2025-12-4       | [Web CallKit 2.3.1 更新日志](/callkit/web/releasenote.html#v2-3-1)          |

## 2025-11

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android SDK 4.18.1 开发版发布    | 私有化部署底层链路支持 TCP 和 WebSocket 之间切换。  | 2025-11-12       | [Android SDK 4.18.1 更新日志](/docs/v4/android/releasenote.html#v4-18-1-dev-2025-11-12-开发版)          |
| iOS SDK 4.18.1 开发版发布    | 私有化部署底层链路支持 TCP 和 WebSocket 之间切换。  | 2025-11-12       | [iOS SDK 4.18.1 更新日志](/docs/v4/ios/releasenote.html#v4-18-1-dev-2025-11-12-开发版)          |
| HarmonyOS SDK 1.8.1 开发版发布   | 解决 HTTP 请求受文件描述符（FD）限制问题。  | 2025-11-6       | [HarmonyOS SDK 1.8.1 更新日志](/document/harmonyos/releasenote.html#v1-8-1-2025-11-6)          |
| Flutter 4.15.2 发版    | - 新增 `getCurrentDeviceId` 方法获取你当前设备的设备 ID。<br/> - 支持 [根据关键字获取单个会话中的消息](/document/flutter/message_retrieve.html#根据关键字获取会话中的消息)。 | 2025-11-7       | [Flutter SDK 4.15.2 更新日志](/document/flutter/releasenote.html#v4-15-2-2025-11-7)          |

#### UIKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web 单群聊 UIKit 2.2.1 发版   | `Chat`、`ConversationList` 和 `CallKit` 等组件适配移动端，会话列表和消息等鼠标悬停事件改为长按事件。 | 2025-11-10      | [Web 单群聊 UIKit 2.2.0 更新日志](/uikit/chatuikit/web/releasenote.html#v2-2-1)          |
| React Native 单群聊 UIKit 2.5.0 发版   | - 支持 [自定义数据层](/uikit/chatuikit/web/chatuikit_advancedusage.html#自定义-sdk-数据模型)，实现灵活业务处理。例如，App 内根据手机号搜索好友功能已使用该接口。<br/> - 新增 [自定义图片预览组件](/uikit/chatuikit/web/chatuikit_advancedusage.html#自定义图片消息预览组件)，支持自定义 App 内图片消息预览效果。<br/> - 新增 [自定义视频预览组件](/uikit/chatuikit/web/chatuikit_advancedusage.html#自定义视频消息预览组件)，支持自定义 App 内视频消息预览效果。<br/> - 新增语音图像动画组件，提升动画展示效果。 | 2025-11-17   | [React Native 单群聊 UIKit 2.5.0 更新日志](/uikit/chatuikit/react-native/releasenote.html#v2-5-0)           |

## 2025-10

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android SDK 4.18.0 开发版发布   | 底层支持安全 DNS 解析 DoH，提高连通性。<br/> - 支持私有部署时设置 IPv6 格式的 REST 地址。  | 2025-10-31      | [Android SDK 4.18.0 更新日志](/docs/v4/android/releasenote.html#v4-18-0-dev-2025-10-31-开发版)         |
| Unity SDK 1.3.3 发版   | 适配 Android 15 的 16 KB 页面大小。  | 2025-10-31      | [Unity 1.3.3 更新日志](/document/unity/releasenote.html#版本-1-3-3-2025-10-31)         |

#### UIKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web 单群聊 UIKit 2.1.0 发版   | CallKit 增加清屏功能。 | 2025-10-27       | [Web 单群聊 UIKit 2.1.0 更新日志](/uikit/chatuikit/web/releasenote.html#v2-1-0)          |
| Uniapp 单群聊 UIKit 1.0.1 发版   | 运行到 app 端，发送语音消息时，增加麦克风权限校验。 | 2025-10-17       | [Uniapp 单群聊 UIKit 1.0.1 更新日志](/uikit/chatuikit/uniapp/releasenote.html#v1-0-1)          |

#### CallKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web CallKit 2.0.1 发布    | 新增清屏功能。  | 2025-10-27       | [Web CallKit 2.1.0 更新日志](/callkit/web/releasenote.html#v2-1-0)          |

## 2025-09

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android SDK 4.17.0 开发版发布   | - 长连接支持 WebSocket 协议。<br/> - 支持 WebSocket 私有部署。 <br/> - 主动退出账号时添加 logout 协议。 | 2025-9-25       | [Android SDK 4.17.0 更新日志](/docs/v4/android/releasenote.html#v4-17-0-dev-2025-9-25-开发版)          |
| iOS SDK 4.17.0 开发版发布   | - 长连接支持 WebSocket 协议。<br/> - 支持 WebSocket 私有部署。 | 2025-9-28       | [iOS SDK 4.17.0 更新日志](/docs/v4/ios/releasenote.html#v4-17-0-dev-2025-9-28-开发版)          |
| Web/小程序 SDK 4.17.0 开发版发布   | - 获取服务端会话列表时可获取 [空会话](/docs/v4/web/conversation_overview.html#空会话)。<br/> - 获取服务端的置顶会话列表时可获取 [空会话](/docs/v4/web/conversation_overview.html#空会话) | 2025-9-30       | - [Web SDK 4.17.0 更新日志](/docs/v4/web/releasenote.html#v4-17-0-2025-9-30)<br/> - [小程序 SDK 4.17.0 更新日志](/docs/v4/applet/releasenote.html#v4-17-0-2025-9-30) |

#### UIKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Web UIKit 2.0.0 发版   | 增加 `CallKit` 组件，`Chat` 组件内使用 `CallKit` 取代原来的音视频通话功能。 | 2025-9-3       | [Web 单群聊 UIKit 2.0.0 更新日志](/uikit/chatuikit/web/releasenote.html#v2-0-0)          |

## 2025-08

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android/iOS SDK 4.16.0 开发版发布    | IM Demo 增加反诈提示：<br/> - 聊天页面增加反诈背景。<br/> - 发送和接收消息都会插入一个反诈提示消息。  | 2025-8-19       | - [Android SDK 4.16.0 更新日志](/docs/v4/android/releasenote.html#v4-16-0-dev-2025-8-19-开发版)<br> - [iOS SDK 4.16.0 更新日志](/docs/v4/android/releasenote.html#v4-16-0-dev-2025-8-19-开发版)          |

#### CallKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android CallKit 4.16.0 发布    | 从该版本开始，Android CallKit 源码使用 Kotlin 语言开发，代码迁移至 [GitHub 新 repo](https://github.com/easemob/easemob-callkit-android) 或 [Gitee](https://gitee.com/easemob-code/easemob-callkit-android) ，老版本不再维护。该版本的 CallKit 主要变更如下：<br/> - 优化了 [单群聊音视频通话的 UI 界面](/callkit/android/product_overview.html#界面效果)。<br/> - 采用 MVVM 框架设计抽离各个模块的代码，职责分离。<br/> - 合并信令，由原来三个地方合并为一处。解决了 Activity 被回收导致信令不通问题。<br/> - 在应用集成了 FCM 推送的设备上，当应用进程被杀死时，支持 [使用 Telecom](/callkit/android/telecom.html) 唤起设备，实现系统级丝滑呼叫体验。<br/> -  [群组通话的邀请界面](/callkit/android/integration.html#步骤-5-发起通话) 改为 CallKit 内部实现，不再需要开发者自己实现。<br/> - 移除 App Server 的依赖，直接由 CallKit 内部从 SDK 中获取 RTC App ID、rtcToken、UID 和 userID 映射关系等。  | 2025-8-29       | [Android CallKit 4.16.0 更新日志](/callkit/android/releasenote.html#v4-16-0)          |
| iOS CallKit 4.16.0 发布    | 从该版本开始，iOS CallKit 源码使用 Swift 语言开发，并且支持 iOS 15.0 及以上版本，代码迁移至 [GitHub 新 repo](https://github.com/easemob/easemob-callkit-iOS) 和 [Gitee 地址](https://gitee.com/easemob-code/easemob-callkit-iOS)。老版本不再维护。<br/>该版本的 CallKit 主要变更如下：<br/> - 优化了 [单群聊音视频通话的 UI 界面](/callkit/ios/product_overview.html#界面效果)。<br/> - 单人视频通话支持[画中画](/callkit/ios/picture_in_picture.html)。<br/> - 被叫离线时，支持 [使用 LiveCommunicationKit 进行呼叫](/callkit/ios/livecommunicationkit.html)。<br/> - 优化了 [群组通话的呼叫信令交互](/callkit/ios/signaling.html#群组通话信令交互流程)。<br/> - [群组通话的邀请界面](/callkit/ios/integration.html#发起群组通话) 改为 UIKit 内部实现，不再需要开发者自己实现。<br/> - 通话使用的声网 RTC App ID 及 Token 在 CallKit 内部通过 IM SDK 接口获取，不再依赖 App Server。  | 2025-8-29       | [iOS CallKit 4.16.0 更新日志](/callkit/ios/releasenote.html#v4-16-0)          |
| Web CallKit 2.0.1 发布    | 从该版本开始，CallKit 移到 `easemob-chat-uikit` 中，为 UIKit 的中的一个组件，代码迁移至 [GitHub 新 repo](https://github.com/easemob/easemob-uikit-react) 和 [Gitee 地址](https://gitee.com/easemob-code/easemob-uikit-react)，老版本不再维护。<br/>该版本的 CallKit 主要变更如下：<br/> - 优化了 [单群聊音视频通话的 UI 界面](/callkit/web/product_overview.html#界面效果)。<br/> - 优化了群组通话的呼叫信令交互。<br/> - [群组通话的邀请界面](/callkit/web/integration.html#发起群组通话) 改为 UIKit 内部实现，不再需要开发者自己实现。<br/> - 通话使用的声网 RTC App ID 及 Token 在 CallKit 内部通过 IM SDK 接口获取，不再依赖 App Server。  | 2025-8-29       | [Web CallKit 2.0.1 更新日志](/callkit/web/releasenote.html#v2-0-1)          |

## 2025-07

#### 服务端消息翻译 RESTful API

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| 消息翻译 RESTful API   | 消息翻译支持以下三个 RESTful API：<br/> - 翻译消息内容 <br/> - 获取翻译语言列表 <br/> - 检测文本的源语言 | 2025-7-2       | <br/> - [翻译消息内容](/document/server-side/message_translation_text.html) <br/> - [获取翻译语言列表](/document/server-side/message_translation_language_list.html) <br/> - [检测文本的源语言](/document/server-side/message_translation_detect.html) |

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| React Native SDK 1.11.3 发版 | [支持用户查看自己是否在聊天室禁言列表上](room_members.html#查看当前用户是否在聊天室禁言列表)。 | 2025-7-15 | [React Native SDK 1.11.3 更新日志](/document/react-native/releasenote.html#v1-11-3-2025-7-15)|

#### UIKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| React Native 单群聊 UIKit 2.4.8 发版   | 新增漫游消息拉取特性。 | 2025-07-28   | [React Native 单群聊 UIKit 2.4.8 更新日志](/uikit/chatuikit/react-native/releasenote.html#v2-4-8)           |

## 2025-06

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| Android/iOS SDK 4.15.1 开发版发布   | <br/> - 支持 [根据关键字从本地数据库中获取会话的消息](/docs/v4/android/message_retrieve.html#根据关键字获取本地会话中的消息)，SDK 返回会话 ID 及消息 ID 列表。<br/> - [根据消息 ID 从本地数据库获取单个或多个消息](/docs/v4/ios/message_retrieve.html#根据消息-id-列表获取本地消息)。 | 2025-6-23    | <br> - [Android SDK 4.15.1 更新日志](/docs/v4/android/releasenote.html#v4-15-1-dev-2025-6-23-开发版)<br> - [iOS SDK 4.15.1 更新日志](/docs/v4/ios/releasenote.html#v4-15-1-dev-2025-6-23-开发版)  |
| Web SDK 4.15.1 开发版发布   | <br/> - 支持 [查询当前用户已加入的群组数量](/docs/v4/web/group_manage.html#查询当前用户已加入的群组数)。<br/> - 支持 [屏蔽群消息](/docs/v4/web/group_manage.html#屏蔽群消息)、[解除屏蔽群消息](/docs/v4/web/group_manage.html#解除屏蔽群消息) 和 [检查当前用户是否已经屏蔽群消息](/docs/v4/web/group_manage.html#检查当前用户是否已屏蔽群消息)。 | 2025-6-9     | [Web SDK 4.15.1 更新日志](/docs/v4/web/releasenote.html#v4-15-1-2025-6-9)      |
| HarmonyOS SDK 1.8.0 开发版发布   | <br/> - [撤回消息](/document/harmonyos/message_recall.html) 时，支持群主/聊天室所有者和管理员撤回其他用户发送的消息。<br/> - 群组成员进出事件支持一次通知多个成员进出群组。调整前，SDK 会为每个加入/退出的成员单独回调一条事件。 <br/> - 修改 Token [即将过期事件](/document/harmonyos/connection.html#监听连接状态) 的触发时机。SDK 会在 Token 有效期达到 80% 时（之前版本为 50% ）回调即将过期通知。<br/> - 支持 [获取群成员列表](/document/harmonyos/group_manage.html#获取群成员列表) 时除了用户 ID 还包括成员角色和加群时间。 | 2025-6-6     | [HarmonyOS 1.8.0 更新日志](/document/harmonyos/releasenote.html#v1-8-0-2025-6-6)      |
| Flutter SDK 4.15.0 版本发布   | <br/> - 支持 [GIF 图片消息](/document/flutter/message_send.html#发送-gif-图片消息)。<br/> - 支持 [群组头像功能](/document/flutter/group_attributes.html#管理群组头像)。<br/> - 支持 [消息附件鉴权功能](/document/flutter/message_receive.html#接收附件消息)。该功能需要联系商务开通，开通后必须调用 SDK 的 API 才能下载消息附件。<br/> - 支持拉取漫游消息时，[只拉取指定的群成员发送的消息](/document/flutter/message_retrieve.html#从服务器获取指定群成员发送的消息)。<br/> - 支持加载本地会话消息时，[只加载指定群成员发送的消息](/document/flutter/message_retrieve.html#从本地获取指定群成员发送的消息)。<br/> - 支持 [获取群成员列表](/document/flutter/group_manage.html#获取群成员列表) 时除了用户 ID 还包括成员角色和加群时间。  | 2025-06-13     | [Flutter 4.15.0 更新日志](/document/flutter/releasenote.html#v4-15-0-dev-2025-6-16-开发版)      |

#### UIKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| iOS 单群聊 UIKit 4.14.0 发版   | 支持 GIF 图片消息。 | 2025-6-23       | [iOS 单群聊 UIKit 4.14.0 更新日志](/uikit/chatuikit/ios/releasenote.html#v-4-14-0)          |
| Web 单群聊 UIKit 1.7.0 发版   | 增加点击消息的回调事件。 | 2025-6-9       | [Web 单群聊 UIKit 4.14.0 更新日志](/uikit/chatuikit/web/releasenote.html#v1-7-0)          |

## 2025-05

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.15.0 开发版发布  |<br/> - [撤回消息](/docs/v4/android/message_recall.html)时，支持群主/聊天室所有者和管理员撤回其他用户发送的消息。<br/> - 群组成员进出事件支持一次通知多个成员进出群组。调整前，SDK 会为每个加入/退出的成员单独回调一条事件。<br/> - 修改 Token [即将过期事件](/docs/v4/android/connection.html#监听连接状态) 的触发时机。SDK 会在 Token 有效期达到 80% 时（之前版本为 50% ）回调即将过期通知。<br/> - Web/小程序端支持获取 [群组](/docs/v4/web/group_manage.html#获取群成员列表)/[聊天室成员列表](/docs/v4/web/room_members.html#获取聊天室成员列表) 时，列明成员的用户 ID 和角色。|  2025-05-21                 | <br/> - [Android 4.15.0 更新日志](/docs/v4/android/releasenote.html#v4-15-0-dev-2025-5-21-开发版)<br/> - [iOS 4.15.0 更新日志](/docs/v4/ios/releasenote.html#v4-15-0-dev-2025-5-21-开发版)<br/> - [Web 4.15.0 更新日志](/docs/v4/web/releasenote.html#v4-15-0-2025-5-21) <br/> - [小程序 4.15.0 更新日志](/docs/v4/applet/releasenote.html#v4-15-0-2025-5-21)                   |
| HarmonyOS SDK 1.7.0 开发版发布   | <br/> - 支持 [发送](/document/harmonyos/message_send.html#发送-gif-图片消息) 和 [接收 GIF 图片消息](/document/harmonyos/message_send.html#接收-gif-图片消息)。<br/> - 支持 [群组头像功能](/document/harmonyos/group_attributes.html#管理群组头像)。<br/> - 支持 [消息附件鉴权功能](/document/harmonyos/message_receive.html#接收附件消息)。该功能需要联系商务开通，开通后必须调用 SDK 的 API 才能下载消息附件。<br/> - 支持拉取漫游消息时，[只拉取指定的群成员发送的消息](/document/harmonyos/message_retrieve.html#从服务器获取指定群成员发送的消息)。<br/> - 支持加载本地会话消息时，[只加载指定群成员发送的消息](/document/harmonyos/message_retrieve.html#从本地获取指定群成员发送的消息)。<br/> - 支持 [根据搜索范围搜索所有会话中的消息](/document/harmonyos/message_search_local.html#根据搜索范围搜索所有会话中的消息) 和 [单个会话中的消息](/document/harmonyos/message_search_local.html#根据搜索范围搜索当前会话中的消息)：可以根据关键字搜索消息时，选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。    | 2025-05-15     | [HarmonyOS 1.7.0 更新日志](/document/harmonyos/releasenote.html#v1-7-0-2025-5-15)      |

#### UIKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| HarmonyOS UIKit 1.0.1 发版   | - 新增新请求页面，方便同意好友请求。<br/> - 新增发起新会话页面。 | 2025-5-21       | [HarmonyOS 单群聊 UIKit 1.0.1 更新日志](/uikit/chatuikit/harmonyos/releasenote.html#v1-0-1)          |

## 2025-04

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.14.0 开发版发布   | <br/> - 支持 [发送](/docs/v4/android/message_send.html#发送-gif-图片消息) 和 [接收 GIF 图片消息](/docs/v4/android/message_receive.html#接收-gif-图片消息)。 <br/> - 支持 [群组头像功能](/docs/v4/android/group_attributes.html#管理群组头像)。 <br/> - 支持 [消息附件鉴权功能](/docs/v4/android/message_receive.html#接收附件消息)。该功能需要联系商务开通，开通后必须调用 SDK 的 API 才能下载消息附件。<br/> - 支持拉取漫游消息时，只 [拉取指定的群成员发送的消息](/docs/v4/android/message_retrieve.html#从服务器获取指定群成员发送的消息)。<br/> - 支持加载本地会话消息时，[只加载指定群成员发送的消息](/docs/v4/android/message_retrieve.html#从本地获取指定群成员发送的消息)。<br/> - Android 端支持 [获取群成员信息时包括成员加群时间](/docs/v4/android/group_members.html#获取群成员信息)。<br/> - Web/小程序支持 [自定义设备平台](/docs/v4/web/multi_device.html#设置登录设备的平台)。<br/> - Uni-app 离线推送 Android 平台支持 [Google FCM](/docs/v4/applet/push/uniapp_push_fcm.html)。 | 2025-04-18       | <br/> - [Android 4.14.0 更新日志](/docs/v4/android/releasenote.html#v4-14-0-dev-2025-4-21-开发版)<br/> - [iOS 4.14.0 更新日志](/docs/v4/ios/releasenote.html#v4-14-0-dev-2025-4-21-开发版)<br/> - [Web 4.14.0 更新日志](/docs/v4/web/releasenote.html#v4-14-0-2025-4-21) <br/> - [小程序 4.14.0 更新日志](/docs/v4/applet/releasenote.html#v4-14-0-2025-4-21)         |
| HarmonyOS SDK 1.6.0 开发版发布   | <br/> - [支持修改各类型的消息](/document/harmonyos/message_modify.html)：<br/>1. 文本/自定义消息：支持编辑消息内容（body）和扩展；<br/>2. 文件/视频/音频/图片/位置/合并转发消息：只支持编辑消息扩展字段；<br/>3. 透传消息：不支持修改。    | 2025-04-9     | [HarmonyOS 1.6.0 更新日志](/document/harmonyos/releasenote.html#v1-6-0-2025-4-9)      |
| React Native SDK 1.11.0 开发版发布   |- 更新 [编辑消息](/document/react-native/message_modify.html)：作废 `modifyMessageBody`，新增 `modifyMsgBody`，文本、自定义消息可以编辑消息体和扩展信息，文件、视频、音频、图片、位置、合并转发支持修改扩展信息。<br/> - 支持 [发送](/document/react-native/message_send.html#发送-gif-图片消息) 和 [接收 GIF 图片消息](/document/react-native/message_receive.html#接收-gif-图片消息)。<br/> - 支持 [消息附件鉴权功能](/document/react-native/message_receive.html#接收附件消息)。该功能需要联系商务开通，开通后必须调用 SDK 的 API 才能下载消息附件。<br/> - 支持拉取漫游消息时，只 [拉取指定的群成员发送的消息](/document/react-native/message_retrieve.html#从服务器获取指定群成员发送的消息)。详见 `fetchHistoryMessagesByOptions` 接口的 `ChatFetchMessageOptions` 参数。<br/> - 支持加载本地会话消息时，[只加载指定群成员发送的消息](/document/react-native/message_retrieve.html#从本地获取指定群成员发送的消息)。<br/> - 支持 [根据关键字从本地数据库中获取会话的消息 ID 列表](/document/react-native/message_retrieve.html#根据关键字获取本地会话的消息-id)，SDK 返回会话 ID 及消息 ID 列表。<br/> - 支持 [根据消息 ID 列表获取本地消息](/document/react-native/message_retrieve.html#根据消息-id-列表获取本地消息)。<br/> - 更新 [根据搜索范围搜索当前会话中的消息](/document/react-native/message_search_local.html#根据搜索范围搜索当前会话中的消息) 接口 `getConvMsgsWithKeyword`, 新增 `senders` 参数，替换原来的 `sender` 参数。<br/> - [撤回消息](/document/react-native/message_recall.html)时，支持群主/聊天室所有者和管理员撤回其他用户发送的消息。<br/> - 支持 [创建群组时设置群头像](/document/react-native/group_attributes.html#管理群组头像)。新增创建群组接口 `createGroupEx`，作废原接口 `createGroup`。<br/> - 支持 [修改群组头像](/document/react-native/group_attributes.html#修改群头像)。<br/> - 支持 [获取群成员列表](/document/react-native/group_manage.html#获取群成员列表) 时包括成员角色和入群时间。<br/> - 群组成员进出事件支持一次通知多个成员进出群组（调整前，SDK 会为每个加入/退出的成员单独回调一条事件）：新增群成员进出事件 [onMembersJoined](/document/react-native/group_manage.html#监听群组事件) 和 [onMembersExited](/document/react-native/group_manage.html#监听群组事件)。已废弃原事件 `onMemberJoined` 和 `onMemberExited`，请使用新事件代替。 <br/> - 修改 Token 即将过期事件 [ChatConnectEventListener#onTokenWillExpire](/document/react-native/connection.html#监听连接状态) 的触发时机。SDK 会在 Token 有效期达到 80% 时（之前版本为 50% ）回调即将过期通知。   | 2025-4-15       | [React Native 1.11.0 更新日志](/document/react-native/releasenote.html#v1-11-0-2025-4-15)          |

## 2025-03

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.13.0 开发版发布   | **新增特性**：<br/><br/> - [发送后编辑消息接口支持修改各类消息](/docs/v4/android/message_modify.html)：<br/>1. 文本/自定义消息：支持编辑消息内容（body）和扩展；<br/>2. 文件/视频/音频/图片/位置/合并转发消息：只支持编辑消息扩展字段；<br/>4. 透传消息：不支持修改。<br/><br/> - 小程序 SDK 支持运行到微信小游戏平台。    | 2025-03-12     | <br/> - [Android 4.13.0 更新日志](/docs/v4/android/releasenote.html#v4-13-0-2025-3-12)<br/> - [iOS 4.13.0 更新日志](/docs/v4/ios/releasenote.html#v4-13-0-2025-3-12)<br/> - [Web 4.13.0 更新日志](/docs/v4/web/releasenote.html#v4-13-0-2025-3-12) <br/> - [小程序 4.13.0 更新日志](/docs/v4/applet/releasenote.html#v4-13-0-2025-3-12) <br/> - [Flutter 4.13.0 更新日志](/document/flutter/releasenote.html#v4-13-0-2025-3-28)|
| HarmonyOS SDK 1.5.2 开发版发布   | **新增特性**：<br/> - 支持 [清空聊天记录](/document/harmonyos/message_delete.html#清空聊天记录)：清除当前用户的单聊、群聊和聊天室的消息和会话记录，可选择是否清除服务端的聊天记录。<br/> - 支持检查 SDK 是否连接到IM 服务器：自动登录的场景下，登录状态变为已登录时，可能 SDK 未成功连接至服务端，这种情况下与服务器交互的操作会失败，比如发消息。此时，可调用 `isConnected()` 接口判断 SDK 与服务器的连接状态。    | 2025-03-10     | [HarmonyOS 1.5.2 更新日志](/document/harmonyos/releasenote.html#v1-5-2-dev-2025-3-10-开发版)      |
| HarmonyOS SDK 1.5.3 开发版发布   | **新增特性**：<br/> - 支持[从本地获取单个好友的用户 ID 和好友备注](/document/harmonyos/user_relationship.html#从本地获取好友列表)。    | 2025-03-17     | [HarmonyOS 1.5.3 更新日志](/document/harmonyos/releasenote.html#v1-5-3-2025-3-17)      |

#### 其他优化

1. 注册用户时用户 ID 建议统一使用小写字母

为了更好地实现服务端与 SDK 的兼容，调用 [RESTful API](/document/server-side/account_register_authorized_single.html)和客户端 API 以及在 [声网控制台](https://console.shengwang.cn/overview) 创建用户时，建议统一使用小写字母。目前用户 ID 支持以下字符集：

- 26 个小写英文字母 a-z；
- 10 个数字 0-9；
- “_”, “-”, “.”。

1. 新增发送后回调事件

因解散群组或聊天室导致的用户退出，IM 服务器向你的 App Server 发送的回调请求。详情请参见 [成员离开事件](/document/server-side/callback_group_room_leave.html#因解散群组-聊天室导致的用户退出) 。

## 2025-01

#### SDK 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.12.0 开发版发布   | **新增特性**：<br/> - 移动端/Web/小程序/跨平台：用户加入聊天室可获取的信息新增聊天室当前人数、聊天室创建时间戳、当前用户是否在聊天室白名单中以及当前用户被禁言截止时间戳。<br/> - HarmonyOS [新增自定义设备的名称](/document/harmonyos/multi_device.html#设置登录设备的名称)：添加该功能后，在多设备场景下，若有设备被踢下线，被踢设备可知晓被哪个设备挤下线。 <br/> - HarmonyOS [新增自定义设备的平台](/document/harmonyos/multi_device.html#设置登录设备的平台)：例如，将手机和平板电脑设置为两个单独的平台，方便用户精细化控制同一平台的登录设备数量及平台间互踢等行为。 <br/> - HarmonyOS [新增两个错误码](/document/harmonyos/error.html)：`ChatError#GROUP_USER_IN_BLOCKLIST`（613）：该用户在群组黑名单中。群组黑名单中的用户进行某些操作时，例如，加入群组，会提示该错误。`ChatError#CHATROOM_USER_IN_BLOCKLIST`（707）：该用户在聊天室黑名单中。聊天室黑名单中的用户进行某些操作时，例如，加入聊天室，会提示该错误。 <br/> - HarmonyOS 新增拉取服务器漫游消息时会读取服务端的消息已读和送达状态。该功能只适用于单聊消息，默认关闭，如果需要，请联系商务经理开通。<br/> **优化：** <br/> - HarmonyOS 删除服务端会话时会同时删除本地会话。 |  2025-01-11    | <br/> - [Android 4.12.0 更新日志](/docs/v4/android/releasenote.html#v4-12-0-2025-1-10)<br/> - [iOS 4.12.0 更新日志](/docs/v4/ios/releasenote.html#v4-12-0-2025-1-10)<br/> - [Web 4.12.0 更新日志](/docs/v4/web/releasenote.html#v4-12-0-2025-1-10) <br/> - [小程序 4.12.0 更新日志](/docs/v4/applet/releasenote.html#v4-12-0-2025-1-10) <br/> - [鸿蒙 1.5.0 更新日志](/document/harmonyos/releasenote.html#v1-5-0-dev-2025-1-10-开发版) <br/> - [Flutter 4.12.0 更新日志](/document/flutter/releasenote.html#v4-12-0-2025-1-17) <br/> - [React Native 1.8.0 更新日志](/document/react-native/releasenote.html#v1-8-0-2025-1-17)<br/> - [Unit 1.3.2 更新日志](/document/unity/releasenote.html#v1-3-2-2025-1-17)|

#### UIKit 发版

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| React Native 单群聊 UIKit 2.4.2 发版 | 增加置顶消息。| 2025-1-17 | [React Native 单群聊 UIKit 2.4.2 更新日志](/uikit/chatuikit/react-native/releasenote.html#v2-4-2) |

## 2024-12

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.11.0 开发版发布   | **新增特性**：<br/> - 新增拉取服务器漫游消息时会读取服务端的消息已读和送达状态。该功能只适用于单聊消息，默认关闭，如果需要，请联系商务经理开通。<br/> - 聊天室成员被禁言后，该成员会收到禁言事件，可查看禁言过期时间。<br/> - Web 端与移动端对齐，群组/聊天室成员被禁言后，该成员可通过收到的禁言事件查看被禁言的成员。<br/> - uniapp SDK 支持鸿蒙系统。    |  2024-12-3     | <br/> - [Android 4.11.0 更新日志](/docs/v4/android/releasenote.html#v4-11-0-2024-12-3)<br/> - [iOS 4.11.0 更新日志](/docs/v4/ios/releasenote.html#v4-11-0-2024-12-3)<br/> - [Web 4.11.0 更新日志](/docs/v4/web/releasenote.html#v4-11-0-2024-12-3) <br/> - [小程序 4.11.0 更新日志](/docs/v4/applet/releasenote.html#v4-11-0-2024-12-3)          |

## 2024-09

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.10.0 开发版发布   | **新增特性**：<br/> - 移动端支持获取数据库中的消息总数；<br/> - 移动端新增 [两个错误码](/docs/v4/android/error.html)，用于提示用户在群组黑名单或聊天室黑名单中。群组或聊天室黑名单中的用户进行某些操作时，例如，加入群组，会提示该错误。<br/> - 移动端 [单向删除服务端会话时也会删除本地会话](/docs/v4/android/conversation_delete.html#单向删除服务端会话)。<br/> - Web/小程序端的聊天室公告修改事件返回更新的公告，即聊天室公告修改后，聊天室中的其他成员会通过事件收到更新的公告。<br/> - Web/小程序端新增错误码 208 `WEBIM_USER_ALREADY_LOGIN`，提示用户已登录。单设备登录时，若调用登录方法 `open` 时用户已经登录，会触发该错误；新增错误码 512 `MESSAGE_SEND_TIMEOUT`，提示发送消息超时，例如，连接断开时发送消息会提示该错误。| 2024-09-30      |  <br/> - [Android 4.10.0 更新日志](/docs/v4/android/releasenote.html#v4-10-0-2024-09-30)<br/> - [iOS 4.10.0 更新日志](/docs/v4/ios/releasenote.html#v4-10-0-2024-09-30)<br/> - [Web 4.10.0 更新日志](/docs/v4/web/releasenote.html#v4-10-0-2024-10-11-开发版) <br/> - [小程序 4.10.0 更新日志](/docs/v4/applet/releasenote.html#v4-10-0-2024-10-11-开发版)  |
| SDK 4.9.1 开发版发布   | uni-app SDK 支持[离线推送](/docs/v4/applet/push/uniapp_push.html)。 | 2024-09-06      | [小程序 4.9.1 更新日志](/docs/v4/applet/releasenote.html#v4-9-1-dev-2024-09-06-开发版)         |

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| HarmonyOS SDK 1.4.0 开发版发布 | **新增特性**：<br/> - 新增[置顶消息功能](/document/harmonyos/message_pin.html#消息置顶)。<br/> - 新增 [根据单个或多个消息类型，搜索本地数据库中所有会话或单个会话中的消息](/document/harmonyos/message_search_local.html#根据消息类型搜索会话消息)。<br/> - 支持 [获取 SDK 本地数据库中会话某个时间段内的全部消息数](/document/harmonyos/message_retrieve.html#获取会话在一定时间内的消息数)。<br/> - 支持 [会话推送通知方式的本地存储](/document/harmonyos/push/push_notification_mode_dnd.html#从服务器获取所有会话的推送通知方式设置)，并支持从服务器获取所有会话的推送通知方式的设置。<br/> - 支持 [设备登录时携带自定义扩展信息并传递给被踢的设备](/document/harmonyos/multi_device.html#设置登录设备的扩展信息)，应用于被踢设备展示提示信息或进行业务判断。<br/> - 支持用户上线后从服务端拉取离线消息时 [收到拉取开始和结束的通知](/document/harmonyos/connection.html)。 <br/> - 支持 [查看当前用户是否在群组禁言列表中](/document/harmonyos/group_members.html#检查自己是否在禁言列表中)。<br/> - 支持 [错误码 213 ChatError#USER_BIND_ANOTHER_DEVICE](/document/harmonyos/error.html)，用于当用户达到登录设备上线时，当前设备无法登录的场景。<br/> - 支持在撤回消息的事件中 [返回被撤回的消息所属的会话 ID](/document/harmonyos/message_recall.html#设置消息撤回监听)。<br/> - 支持 [加入聊天室时携带扩展信息，并指定是否退出之前加入的全部聊天室](/document/harmonyos/room_manage.html#加入聊天室)。当用户加入聊天室携带了扩展信息时，聊天室内其他人可以在用户加入聊天室的回调中，获取到扩展信息。<br/> - 支持 [从服务端单向删除聊天室漫游消息](/document/harmonyos/message_delete.html#单向删除服务端的历史消息)。| 2024-09-30  | [HarmonyOS 1.4.0 更新日志](/document/harmonyos/releasenote.html#v1-4-0-dev-2024-09-30-开发版)  |
| HarmonyOS SDK 1.3.0 开发版发布     | **新增特性**：<br/> - HarmonyOS 端新增 [群成员自定义属性](/document/harmonyos/group_members.html#管理群成员的自定义属性)功能。 <br/> - HarmonyOS 端新增 [设置推送通知的显示内容](/document/harmonyos/push/push_display_attribute.html) 、[推送通知方式和免打扰模式功能](/document/harmonyos/push/push_notification_mode_dnd.html)。 <br/> - HarmonyOS 端新增 [用户在线状态订阅](/document/harmonyos/presence.html)功能。 <br/> - 新增 [聊天室自定义属性](/document/harmonyos/room_attributes.html#管理聊天室自定义属性-key-value)功能。 | 2024-09-09         | [HarmonyOS 1.3.0 更新日志](/document/harmonyos/releasenote.html#v1-3-0-dev-2024-09-10-开发版)  |

## 2024-08

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.9.0 开发版发布  | **新增特性**：<br/> - 用户上线后从服务端拉取离线消息时，会 [收到拉取开始和结束的通知](/docs/v4/android/connection.html)。<br/> - 单聊会话支持 [消息置顶](/docs/v4/android/message_pin.html)。<br/> - 移动端支持查看当前用户是否在指定的群组的禁言列表中。<br/> - 移动端撤回消息后，你 [收到的通知中会体现消息所属的会话 ID](/docs/v4/android/message_recall.html#设置消息撤回监听)。<br/> - Web 端可 [查看 app 下设置了推送通知方式（接收所有人通知、只接收 @ 我的通知和不接收任何通知）的所有会话](/docs/v4/web/push/push_notification_mode_dnd.html#获取设置了推送通知方式的所有会话)。<br/> - 对于 Web 端，你若设置了指定会话的推送通知方式或免打扰时长或时间段，[其他设备会收到事件通知](/docs/v4/web/push/push_notification_mode_dnd.html#设置单个会话的推送通知)。<br/> - 对于 Web 端，你若清除了会话的推送通知方式，[其他设备会收到事件通知](/docs/v4/web/push/push_notification_mode_dnd.html#清除单个会话的推送通知方式的设置)。| 2024-08-30       |  <br/> - [Android 4.9.0 更新日志](/docs/v4/android/releasenote.html#v4-9-0-2024-08-30-开发版)<br/> - [iOS 4.9.0 更新日志](/docs/v4/ios/releasenote.html#v4-9-0-2024-08-30-开发版) <br/> - [Web 4.9.0 更新日志](/docs/v4/web/releasenote.html#v4-9-0-dev-2024-08-30-开发版) |

## 2024-07

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.8.0 开发版发布  | **新增特性**：<br/> - 移动端支持 AUT 协议，优化弱网环境下的服务连接成功率。<br/> - 移动端支持 [本地存储会话的推送通知方式](/docs/v4/ios/push/push_notification_mode_dnd.html#从服务器获取所有会话的推送通知方式设置)，并支持从服务器获取所有会话的推送通知方式的设置。<br/> - 移动端支持 [本地获取指定会话某个时间段内的消息数](/docs/v4/android/message_retrieve.html#获取会话在一定时间内的消息数)。<br/> - 客户端支持 [加入聊天室时携带的扩展信息，并可指定是否退出所有其他聊天室](/docs/v4/android/room_manage.html#加入聊天室)。<br/> - Web 端 [设备登录时允许携带自定义扩展消息并传递给被踢的设备](/docs/v4/web/multi_device.html#设置登录设备的扩展信息)，应用于被踢设备展示提示信息或进行业务判断。<br/> - Web 端支持 [使用固定的设备 ID](/docs/v4/web/multi_device.html)，这会影响多端登录互踢的策略。<br/> - Web 端支持 [聊天室所有者解散聊天室](/docs/v4/web/room_manage.html#解散聊天室)。<br/>**优化**：<br/> 移动端设置和获取用户属性时，包括 [设置当前用户的属性](/docs/v4/android/userprofile.html#设置当前用户的所有属性)、[获取单个或多个用户的用户属性](/docs/v4/android/userprofile.html#从服务端获取用户的所有属性)和 [获取指定用户的指定用户属性](/docs/v4/android/userprofile.html#从服务端获取用户的指定属性)时，若超过调用频率限制，会上报错误码 4 `EMErrorExceedServiceLimit`（iOS）或 `EXCEED_SERVICE_LIMIT`（Android）。| 2024-07-01   | <br/> - [Android 4.8.0 更新日志](/docs/v4/android/releasenote.html#v4-8-0-2024-07-01-开发版)<br/> - [iOS 4.8.0 更新日志](/docs/v4/ios/releasenote.html#v4-8-0-2024-07-01-开发版)。<br/> - [Web 4.8.0 更新日志](/docs/v4/web/releasenote.html#v4-8-0-dev-2024-07-01-开发版)。<br/> - [Flutter 4.8.1 更新日志](/document/flutter/releasenote.html#v4-8-1-2024-10-15)。|

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| HarmonyOS SDK 1.2.0 开发版发布 |**新增特性**：<br/> - HarmonyOS 端新增[表情回复 Reaction](/document/harmonyos/reaction.html)功能。<br/> - HarmonyOS 端新增[会话标记](/document/harmonyos/conversation_mark.html)功能。<br/> - HarmonyOS 端新增[会话置顶](/document/harmonyos/conversation_pin.html)功能。<br/> - HarmonyOS 端新增[用户属性](/document/harmonyos/userprofile.html)功能。  | 2024-07-11  | [HarmonyOS 1.2.0 更新日志](/document/harmonyos/releasenote.html#v1-2-0-dev-2024-07-11-开发版) | 
| HarmonyOS SDK 1.1.0 开发版发布 |**新增特性**：<br/> - HarmonyOS 端新增[编辑消息](/document/harmonyos/message_modify.html)功能。<br/> - HarmonyOS 端新增 [发送](/document/harmonyos/message_send.html#发送自定义类型消息)和 [接收自定义消息](/document/harmonyos/message_receive.html#接收自定义类型消息)功能。<br/> - HarmonyOS 端新增 [发送](/document/harmonyos/message_send.html#发送合并消息) 和[接收合并转发消息](/document/harmonyos/message_receive.html#接收合并消息)功能。<br/> - HarmonyOS 端新增[离线推送](/document/harmonyos/push/push_overview.html)功能。  | 2024-07-01  | [HarmonyOS 1.1.0 更新日志](/document/harmonyos/releasenote.html#v1-1-0-dev-2024-07-01-开发版) | 

## 2024-06

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.7.0 开发版发布  | **新增特性**：<br/> - 移动端[设备登录时允许携带自定义扩展消息并传递给被踢的设备](/docs/v4/android/multi_device.html#设置登录设备的扩展信息)，应用于被踢设备展示提示信息或进行业务判断。<br/> - 移动端支持[根据多个消息类型搜索本地所有会话或单个会话中的消息](/docs/v4/android/message_search_local.html#根据消息类型搜索所有会话中的消息)。<br/> - 移动端支持本地获取群组记录，有助于降低接口调用频率，提升群组信息获取效率。<br/> - 移动端支持[从服务端单向删除聊天室漫游消息](/docs/v4/android/message_delete.html#单向删除服务端的历史消息)。 | 2024-06-05   | <br/> - [Android 4.7.0 更新日志](/docs/v4/android/releasenote.html#v4-7-0-dev-2024-06-05-开发版)<br/> - [iOS 4.7.0 更新日志](/docs/v4/ios/releasenote.html#v4-7-0-dev-2024-06-05-开发版)。  |

## 2024-04

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.6.0 开发版发布  | **新增特性**：<br/> - 客户端[消息撤回时支持携带自定义信息](/docs/v4/android/message_recall.html#实现方法)。<br/> - 客户端支持离线期间撤回的消息通知给接收方。<br/> - 移动端支持[自定义筛选获取本地会话列表](/docs/v4/android/conversation_list.html#获取本地所有或筛选的会话)。<br/> - 移动端支持[清除内存中的会话](/docs/v4/android/conversation_list.html#清除内存中的会话)，并举例说明如何[降低会话占用内存](/docs/v4/android/conversation_list.html#降低会话占用内存的实例)。<br/> - Android 端添加绑定推送 token 成功与否的回调。<br/> - Web/小程序端增加接口支持[获取当前用户加入和创建的聊天室](/docs/v4/web/room_manage.html#获取当前用户加入的聊天室列表)。<br/> - Web/小程序 端支持 [logger 日志不显示在控制台](/docs/v4/web/log.html#输出信息到日志文件)。 <br/>**重大变更** <br/> 1. **Android**：<br/> 从 V4.6.0 版本开始会启用 Kotlin 语言编写的新的 EaseIM App 项目与 EaseIMKIt 项目，老版本的项目将逐渐不再维护，请参考：<br/> - [EaseIMKIt 文档](/uikit/chatuikit/android/chatuikit_overview.html) <br/> - EaseIM App 项目：[Github](https://github.com/easemob/easemob-demo-android) 或 [Gitee 地址](https://gitee.com/easemob-code/easemob-demo-android)。<br/> 2. **iOS**：<br/>从 V4.6.0 版本开始会启用 Swift 语言编写的新的 `EaseChatUIKit` 与 `EaseChatDemo`，老版本 Demo 和 UIKit 逐渐不再维护，请参考：<br/> - [UIKit 文档](/uikit/chatuikit/ios/chatuikit_overview.html) <br/> - Demo 源码：[GitHub](https://github.com/easemob/chat-ios/tree/SwiftDemo) 或 [Gitee 地址](https://gitee.com/easemob-code/easemob-demo-ios/tree/SwiftDemo) | 2024-04-30   | <br/> - [Android 4.6.0 更新日志](/docs/v4/android/releasenote.html#v4-6-0-dev-2024-04-30-开发版)<br/> - [iOS 4.6.0 更新日志](/docs/v4/ios/releasenote.html#v4-6-0-dev-2024-04-30-开发版)<br/> - [Web 4.7.0 更新日志](/docs/v4/web/releasenote.html#v4-7-0-dev-2024-04-30-开发版)<br/> - [小程序 4.7.0 更新日志](/docs/v4/applet/releasenote.html#v4-7-0-dev-2024-04-30-开发版)。  |

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.5.0 开发版发布 | **新增特性**：<br/> - 客户端可[置顶消息](/docs/v4/android/message_pin.html)，方便会话中的所有用户快速查看重要消息。<br/> - 客户端的消息编辑回调中可返回[通过 RESTful API 编辑的自定义消息](/document/server-side/message_modify.html)。<br/> - 客户端支持[获取聊天室漫游消息](/docs/v4/android/message_retrieve.html#从服务器获取指定会话的消息)。<br/> - Android 端 SDK 集成支持[动态加载 .so 库文件](/docs/v4/android/quickstart.html#方法三-动态加载-so-库文件)，减少应用安装包的大小。<br/> - iOS 端可[将所有会话的未读消息设为已读](/docs/v4/ios/conversation_unread.html#将所有会话的未读消息数清零)，将所有会话的未读消息数清零。<br/>**优化**：<br/> - 优化 token 登录时的错误提示信息，使错误提示更准确。<br/> - 移动端优化[单条转发](/docs/v4/android/message_forward.html)功能，附件消息无需重新上传附件即可转发。 | 2024-04-03 | <br/> - [Android 4.5.0 更新日志](/docs/v4/android/releasenote.html#v4-5-0-dev-2024-04-03-开发版)<br/> - [iOS 4.5.0 更新日志](/docs/v4/ios/releasenote.html#v4-5-0-dev-2024-04-03-开发版)<br/> - [Web 4.6.0 更新日志](/docs/v4/web/releasenote.html#v4-6-0-dev-2024-04-02-开发版)<br/> - [小程序 4.6.0 更新日志](/docs/v4/applet/releasenote.html#v4-6-0-dev-2024-04-02-开发版)<br/> - [Flutter 4.5.0 更新日志](/document/flutter/releasenote.html#v4-5-0-2024-5-7)。<br/> - [React Native 1.4.0 更新日志](/document/react-native/releasenote.html#v1-4-0-2024-5-7)<br/> - [Unity 1.3.0 更新日志](/document/unity/releasenote.html#v1-3-0-dev-2024-5-7-开发版)|
| REST API |**新增 API**： <br/> 1. [分页获取好友列表](/document/server-side/user_friend_list_paged.html)；<br/> 2. [单向清空漫游消息](/document/server-side/message_delete_roam_single_msgid.html)：[根据时间单向清空单聊会话的漫游消息](/document/server-side/message_delete_roam_single_time.html)；[根据时间单向清空群组或聊天室会话的漫游消息](/document/server-side/message_delete_roam_group_room_time.html)；[清空用户的所有漫游消息](/document/server-side/message_delete_roam_user.html)；<br/> 3. [修改文本或自定义消息](/document/server-side/message_modify.html)；<br/> 4. [转让聊天室](/document/server-side/chatroom_owner_transfer.html)；<br/> 5. [强制指定账号从单设备下线](/document/server-side/account_offline_device_single.html)。| 2024-04 | 关于接口的调用频率限制，详见 [API 调用频率限制](/document/server-side/limitationapi.html)。 |

## 2024-01

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.4.0 开发版发布  | **新增特性**：<br/> - 客户端可[清空聊天记录](/docs/v4/android/message_delete.html#清空聊天记录)：单个用户包含本地或服务端记录。<br/> - 移动端的[本地消息搜索可选择搜索范围](/docs/v4/android/message_search_local.html#根据搜索范围搜索当前会话中的消息)，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。<br/> - [Web 端支持向指定设备发消息](/docs/v4/web/multi_device.html#获取当前用户的其他登录设备的登录-id-列表)，例如，电脑端给手机端发消息，登录同一账号的多个设备均会收到消息。<br/> - Web 端聊天室和群组成员进出事件增加成员人数 `memberCount` 字段。<br/>**优化**：<br/> - 移动端群组全员禁言状态存储到本地数据库，下次登录时可以直接从本地获取到。<br/> - 移动端转发合并消息时导致的附件重复上传问题。|  2024-01-30    |  <br/> - [Android 4.4.0 更新日志](/docs/v4/android/releasenote.html#v4-4-0-dev-2024-01-30-开发版)<br/> - [iOS 4.4.0 更新日志](/docs/v4/ios/releasenote.html#v4-4-0-dev-2024-01-30-开发版)<br/> - [Web 4.5.0 更新日志](/docs/v4/web/releasenote.html#v4-5-0-dev-2024-01-30-开发版)<br/> - [小程序 4.5.0 更新日志](/docs/v4/applet/releasenote.html#v4-5-0-dev-2024-01-30-开发版)。  |

## 2023-12

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.3.0 开发版发布 | **新增特性**：<br/> - [会话标记功能](/docs/v4/android/conversation_mark.html)：支持标记会话，并按照标记获取会话。<br/> **优化**<br/> - 对于原生平台，优化附件类型消息发送时的附件上传，支持分片上传。 <br/> - 移动端移除 FPA 功能，减小 SDK 体积。<br/> - 移动端单个日志文件大小由 2 MB 提升到 5 MB。<br/> - Web 端增加 `onMessage` 回调。在收到文本、图片、视频、语音、地理位置和文件等消息时，批量将消息回调给应用。<br/> - Web 端视频类型消息增加视频首帧缩略图, 通过 videoMessage.thumb 访问。    |  2023-12-22     | <br/> - [Android 4.3.0 更新日志](/docs/v4/android/releasenote.html#v4-3-0-dev-2023-12-22-开发版)<br/> - [iOS 4.3.0 更新日志](/docs/v4/ios/releasenote.html#v4-3-0-dev-2023-12-22-开发版)<br/> - [Web 4.4.0 更新日志](/docs/v4/web/releasenote.html#v4-4-0-dev-2023-12-22-开发版)<br/> - [小程序 4.4.0 更新日志](/docs/v4/applet/releasenote.html#v4-4-0-dev-2023-12-22-开发版)   |

## 2023-11

| 动态名称   | 动态描述 | 发布时间       | 相关文档          |
| :----- | :------- | :---------------- | :---------------- |
| SDK 4.2.0 开发版发布 | **新增特性**：<br/> - 客户端支持[好友备注功能](/docs/v4/android/releasenote.html)。<br/> - 客户端支持聊天室全局广播消息，可根据消息属性判断。<br/> - 移动端可以[从服务器获取当前用户已加入的群组数量](/docs/v4/android/group_manage.html#查询当前用户已加入的群组数量)。<br/> - 移动端在申请入群被拒绝时，返回的回调中增加了申请者和拒绝者。<br/> - 移动端在初始化时可配置获取会话列表时是否返回 [空会话](/docs/v4/android/conversation_overview.html#空会话)。<br/> **优化** <br/> - 客户端统一 Agora Token 和 EaseMob Token 登录方式，新增 EaseMob Token 即将过期及已过期的回调。<br/> - 移动端优化发消息时重试的逻辑。<br/> - 移动端优化数据库升级逻辑。| 2023-11-17  | <br/> - [Android 4.2.1 更新日志](/docs/v4/android/releasenote.html#v4-2-1-dev-2023-11-17)<br/> - [iOS 4.2.0 更新日志](/docs/v4/ios/releasenote.html#v4-2-0-dev-2023-11-13)<br/> - [Web 4.3.0 更新日志](/document/web/releasenote.html#v4-3-0-dev-2023-11-17)<br/> - [小程序 4.3.0 更新日志](/docs/v4/applet/releasenote.html#v4-3-0-dev-2023-11-17)。<br/> - [Flutter 4.2.0 更新日志](/document/flutter/releasenote.html#v4-2-0-2024-1-4)<br/> - [React Native 1.3.0 更新日志](/document/react-native/releasenote.html#v1-3-0-2024-1-4)  |
| REST API    | 支持[通过 REST API 向 app 下的所有活跃聊天室发送全局广播消息](/document/server-side/broadcast_to_chatrooms.html) 。活跃聊天室指聊天室至少存在一个成员，而且至少发送过一条消息。| 2023-11-17  | 详见[发送聊天室广播消息](/document/server-side/broadcast_to_chatrooms.html)。  |
| IM Demo   | 好友详情页面可添加和修改好友备注。 | 2023-11-17       | <br/> - Android 4.2.1 Demo <br/> - iOS 4.2.0 Demo        |

