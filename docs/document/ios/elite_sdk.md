# 精简版 SDK 

精简版 SDK 4.2.0 支持 Android 和 iOS 平台，包含基础的单聊和聊天室功能，适用于 SDK 包体积尽量小、仅需基础收发消息功能、而无需离线推送通知等功能的情况。

精简版 SDK 对应用的体积增量不大，android 为 1.11 MB，iOS 为 1.09 MB。

要下载 iOS 端精简版 SDK，点击[这里](https://downloadsdk.easemob.com/downloads/SDK-mini/iOS_IMLite_SDK_4.2.0_1116.zip)。

:::tip
精简版 SDK 无本地存储，可以升级为标准版 SDK，但标准版不能降级为精简版。
:::

## 功能列表

精简版 SDK 的功能如下表所示：

<table width="893" border="1">
  <tbody>
    <tr>
      <td width="85">功能模块</td>
      <td width="103">功能</td>
      <td width="110">功能细分/描述</td>
      <td width="301"> 接口文档</td>
      <td width="122"> 精简版 SDK</td>
      <td width="132">标准版 SDK</td>
    </tr>
    <tr>
      <td rowspan="17">消息管理</td>
      <td rowspan="9">发送和接收消息</td>
      <td>发送和接收消息</td>
      <td rowspan="9"><p><a href="https://docs-im-beta.easemob.com/document/android/message_send_receive.html">发送和接收消息</a></p></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>接收消息</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>发送和接收附件类型的消息</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>发送和接收位置消息</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>发送和接收透传消息</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>发送自定义类型消息</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>发送和接收合并消息</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>发送和接收定向消息</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>使用消息的扩展字段</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理本地消息</td>
      <td>管理本地消息</td>
      <td><p><a href="https://docs-im-beta.easemob.com/document/ios/message_retrieve.html">获取本地历史消息</a><a href="https://docs-im-beta.easemob.com/document/ios/message_retrieve.html"></a></p>
      <p><a href="https://docs-im-beta.easemob.com/document/ios/message_search.html">搜索消息</a></p>
      <p><a href="https://docs-im-beta.easemob.com/document/ios/message_import_insert.html">导入和插入消息</a></p>
      <p><a href="https://docs-im-beta.easemob.com/document/ios/message_update.html">更新消息</a></p>
      <p><a href="https://docs-im-beta.easemob.com/document/ios/message_delete.html">删除消息</a></p></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理服务端消息</td>
      <td>管理服务端消息</td>
      <td><p><a href="https://docs-im-beta.easemob.com/document/ios/message_retrieve.html">从服务器分页获取指定会话的历史消息</a></p>
      <p><a href="https://docs-im-beta.easemob.com/document/ios/message_delete.html#单向删除服务端的历史消息">单向删除服务端的历史消息</a></p></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="2">管理消息回执</td>
      <td>消息送达回执</td>
      <td><p><a href="https://docs-im-beta.easemob.com/document/ios/message_receipt.html">消息送达回执</a></p></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>消息已读回执</td>
      <td><p><a href="https://docs-im-beta.easemob.com/document/ios/message_receipt.html">消息已读回执</a></p></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>撤回消息</td>
      <td><p>撤回消息</p>
      <p>设置消息撤回监听</p></td>
      <td>&nbsp;</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>修改消息</td>
      <td>单聊会话中已经发送成功的文本消息进行修改</td>
      <td><p><a href="https://docs-im-beta.easemob.com/document/ios/message_modify.html">修改消息</a></p></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td height="71">获取消息流量统计</td>
      <td>获取消息流量统计</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/message_traffic_statis.html">获取消息流量统计</a></td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td height="71">翻译</td>
      <td>消息翻译</td>
      <td><p><a href="https://docs-im-beta.easemob.com/document/ios/message_modify.html">消息翻译</a></p></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="6">会话管理</td>
      <td rowspan="2">会话列表</td>
      <td>获取本地所有会话 </td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/conversation_list.html#获取本地所有会话">获取本地所有会话</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td> 从服务器分页获取会话列表</td>
      <td><p><a href="https://docs-im-beta.easemob.com/document/ios/conversation_list.html#从服务器分页获取会话列表">从服务器分页获取会话列表</a></p></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>会话未读数</td>
      <td>获取或清零本地会话的未读数</td>
      <td><p>&nbsp;</p>
      <p><a href="https://docs-im-beta.easemob.com/document/ios/conversation_unread.html">会话未读数</a></p></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>置顶会话</td>
      <td>置顶会话</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/conversation_pin.html">置顶会话</a></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="2">删除会话</td>
      <td>单向删除服务端会话及其历史消息</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/conversation_delete.html#单向删除服务端会话及其历史消息">单向删除服务端会话及其历史消息</a></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>删除本地会话及历史消息</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/conversation_delete.html#删除本地会话及历史消息">删除本地会话及历史消息</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理用户属性</td>
      <td>设置和获取用户属性</td>
      <td>用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/userprofile.html">管理用户属性</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理用户关系</td>
      <td>好友列表管理和黑名单管理</td>
      <td><p>添加、删除好友；</p>
      <p>设置和获取好友备注；</p>
      <p>从服务器获取好友列表；</p>
      <p>将用户添加到或移除黑名单</p>
      <p>从服务器获取黑名单列表</p></td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/user_relationship.html">管理用户关系</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>群组管理</td>
      <td>群组为多人聊天，有稳定的<span data-font-family="-apple-system, 'system-ui', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', STHeiti, 'Microsoft YaHei', SimSun, sans-serif">成员关系。</span></td>
      <td><p>创建、管理群组；</p>
      <p>管理群成员；</p>
      <p>管理群成员属性</p></td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/group_overview.html">群组管理</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="19">聊天室管理</td>
      <td>聊天室为多人聊天，没有固定的成员关系。</td>
      <td><p>聊天室概述</p></td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/room_overview.html">聊天室概述</a></td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td rowspan="6">创建和管理聊天室</td>
      <td>创建聊天室</td>
      <td rowspan="6"><a href="https://docs-im-beta.easemob.com/document/ios/room_manage.html">创建和管理聊天室</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>加入聊天室</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>获取聊天室详情</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>退出聊天室</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>解散聊天室</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>监听聊天室事件</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="7">管理聊天室成员</td>
      <td>获取聊天室成员列表</td>
      <td rowspan="7"><a href="https://docs-im-beta.easemob.com/document/ios/room_members.html">管理聊天室成员</a></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>将成员移出聊天室</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理聊天室黑名单</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理聊天室白名单</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理聊天室禁言列表</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>开启和关闭聊天室全员禁言</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理聊天室所有者和管理员</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="4">管理聊天室基本属性</td>
      <td>获取聊天室公告</td>
      <td rowspan="4"><a href="https://docs-im-beta.easemob.com/document/ios/room_attributes.html">管理聊天室基本属性</a></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>更新聊天室公告</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>修改聊天室名称</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>修改聊天室描述</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理聊天室自定义属性</td>
      <td>管理聊天室自定义属性</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/room_attributes.html#管理聊天室自定义属性-key-value">管理聊天室自定义属性</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="7">进阶功能</td>
      <td>离线推送</td>
      <td>集成第三方消息推送服务</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/push.html">离线推送</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="2">登录多个设备</td>
      <td>支持同一账号在多个设备上登录并<span data-font-family="-apple-system, 'system-ui', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', STHeiti, 'Microsoft YaHei', SimSun, sans-serif">接收消息</span></td>
      <td>&nbsp;</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>多设备管理</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/multi_device.html">多设备登录</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理在线状态订阅</td>
      <td>管理在线状态订阅</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/presence.html">在线状态订阅</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>消息表情回复&nbsp;Reaction</td>
      <td>对单聊和群聊中的消息通过表情回复</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/reaction.html">消息表情回复</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>子区管理</td>
      <td>子区是群组成员的子集</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/thread.html">子区管理</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>消息举报</td>
      <td>开发者可以在客户端调用该接口举报违规消息</td>
      <td><a href="https://docs-im-beta.easemob.com/document/ios/moderation.html">消息举报</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

## 错误码 

[iOS 错误码](error.html)

















