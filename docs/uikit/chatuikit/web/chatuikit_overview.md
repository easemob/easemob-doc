# 概述

<Toc />

环信单群聊 UIKit 是基于环信即时通讯云 IM SDK 开发的一款即时通讯 React UI 组件库。该组件库提供了聊天相关的组件，包括会话列表、聊天界面、联系人列表和群组设置等组件，组件内部集成了 IM SDK，可以帮助开发者不关心内部实现和数据管理就能根据实际业务需求快速搭建包含 UI 界面的即时通讯应用。

若要访问源码，请点击[这里](https://github.com/easemob/Easemob-UIKit-web/tree/main)。

## 技术原理

环信单群聊 UIKit 组件内部集成 IM SDK 和环信服务器连接，实现收发消息等功能。组件使用 React Context API 管理内部状态，用户可以使用 UIKit 提供的自定义 hooks 从全局数据获取需要的数据，也可以用自定义 hooks 获取操作这些数据的方法。

![img](@static/images/uikit/chatweb/uikit.png)

## 功能

<table>
    <tr>
        <td>组件</td>
        <td>功能</td>
        <td>说明</td>
    </tr>
   <tr>
      <td rowspan="5" style=font-weight:bold>会话列表</td>
   </tr>
   <tr>
      <td>展示会话列表</td>
      <td style=font-size:10px>会话列表显示头像、昵称、最新消息内容、未读消息提醒和时间</td>
   </tr>
   <tr>
      <td>删除会话</td>
      <td style=font-size:10px>将会话从会话列表中删除</td>
   </tr>
   <tr>
      <td>免打扰</td>
      <td style=font-size:10px>开启消息免打扰或关闭消息免打扰</td>
   </tr>
   <tr>
      <td>置顶</td>
      <td style=font-size:10px>将会话固定在列表顶部</td>
   </tr>
    <tr>
      <td rowspan="11" style=font-weight:bold>聊天</td>
   </tr>
   <tr>
      <td>消息发送</td>
      <td style=font-size:10px>支持发送文本、表情、图片、文件、语音、视频、合并消息、名片消息</td>
   </tr>
   <tr>
      <td>历史消息</td>
      <td style=font-size:10px>从服务器获取聊天记录</td>
   </tr>
   <tr>
      <td>消息展示</td>
      <td style=font-size:10px>单、群聊消息展示，包括头像、昵称、消息内容、时间、发送状态、已读状态，消息包括：文本、表情、图片、视频、文件、语音、合并消息</td>
   </tr>
   <tr>
      <td>撤回消息</td>
      <td style=font-size:10px>已发出的消息默认 2 分钟内可撤回</td>
   </tr>
   <tr>
      <td>reaction</td>
      <td style=font-size:10px>对消息回复自定义表情</td>
   </tr>
   <tr>
      <td>回复</td>
      <td style=font-size:10px>引用当前的消息，发出去的消息会带着被引用的消息</td>
   </tr>
   <tr>
      <td>删除</td>
      <td style=font-size:10px>删除这条消息</td>
   </tr>
   <tr>
      <td>翻译</td>
      <td style=font-size:10px>将文本消息翻译成目标语言</td>
   </tr>
   <tr>
      <td>编辑</td>
      <td style=font-size:10px>将已经发出的文本消息进行重新编辑</td>
   </tr>
   <tr>
      <td>多选</td>
      <td style=font-size:10px>可以选择多条消息，然后进行删除或者合并转发</td>
   </tr>
   <tr>
      <td rowspan="5" style=font-weight:bold>联系人列表</td>
   </tr>
   <tr>
      <td>联系人</td>
      <td style=font-size:10px>展示已添加的好友，支持按字母排序，优先展示好友备注，其次展示昵称，没有设置昵称则展示 usrID</td>
   </tr>
   <tr>
      <td>群组</td>
      <td style=font-size:10px>展示已加入的群组，支持按字母排序</td>
   </tr>
   <tr>
      <td>新请求</td>
      <td style=font-size:10px>展示好友申请，可以同意或忽略好友申请</td>
   </tr>
   <tr>
      <td>搜索</td>
      <td style=font-size:10px>搜索好友或者群组</td>
   </tr>
</table>

`easemob-chat-uikit` 目前提供如下组件：

- 容器组件：`Provider`、`Chat` 、`ConversationList`、`ContactList`。
- module 组件：`BaseMessage`、`AudioMessage`、`FileMessage`、 `VideoMessage`、`ImageMessage`、`TextMessage`、`CombinedMessage`、`UserCardMessage`、`GroupDetail`、`UserSelect`、`Header`、`Empty`、`MessageList`、`ConversationItem`、`MessageInput`、`MessageStatus`、`Typing`。
- 纯 UI 组件：`Avatar`、`Badge`、`Button`、`Checkbox`、`Icon`、`Modal`、`Tooltip`、`scrollList`、`Switch`、`UserItem`、`Broadcast`、`Dropdown`。

单群聊 UIKit 中业务相关的 UI 控件主要包含在以下三个组件中：

- Chat 提供所有聊天视图的容器。

截图

- ConversationList 提供会话列表容器。

截图

- ContactList 提供联系人、群组及其详情等容器。

截图
