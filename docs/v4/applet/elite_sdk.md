# 精简版 SDK

精简版 SDK 是专为小程序平台设计的轻量级即时通讯解决方案，包体积约 290 KB。与标准版 SDK 相比，精简版保留了核心的单聊与聊天室功能，移除了好友关系等高级能力，专注于满足对包体积有严格要求、仅需核心收发消息功能的开发场景，助力开发者构建更轻量的小程序应用。

## 添加依赖

在小程序项目根目录，即 `package.json` 所在目录，执行以下命令安装依赖：

```bash
npm install easemob-chat-lite --save
```

关于安装 npm 包，详见 [小程序 npm 支持文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

:::tip 
精简版可以升级为标准版 SDK，但标准版不能降级为精简版。
:::

## 功能列表

精简版 SDK 与标准版 SDK 的功能对比如下表所示：

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
      <td rowspan="14">消息管理</td>
      <td rowspan="8">发送和接收消息</td>
      <td>发送和接收文本消息</td>
      <td rowspan="8"><p><a href="https://doc.easemob.com/v4/applet/message_send.html">发送和接收消息</a></p></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>发送和接收附件消息</td>
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
      <td>使用消息扩展字段</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理服务端消息</td>
      <td>管理服务端消息</td>
      <td><p><a href="https://doc.easemob.com/v4/applet/message_retrieve.html">从服务器分页获取指定会话的历史消息</a></p>
      <p><a href="https://doc.easemob.com/v4/applet/message_delete.html#单向删除服务端的历史消息">单向删除服务端的历史消息</a></p></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="2">管理消息回执</td>
      <td>消息送达回执</td>
      <td><p><a href="https://doc.easemob.com/v4/applet/message_receipt.html">消息送达回执</a></p></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>消息已读回执</td>
      <td><p><a href="https://doc.easemob.com/v4/applet/message_receipt.html">消息已读回执</a></p></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>撤回消息</td>
      <td><p>撤回消息</p>
      <p>设置消息撤回监听</p></td>
      <td><p><a href="https://doc.easemob.com/v4/applet/message_recall.html">撤回消息</a></p></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>编辑消息</td>
      <td>单聊会话中已经发送成功的文本消息进行编辑</td>
      <td><p><a href="https://doc.easemob.com/v4/applet/message_modify.html">编辑消息</a></p></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td height="71">翻译</td>
      <td>消息翻译</td>
      <td><p><a href="https://doc.easemob.com/v4/applet/message_modify.html">消息翻译</a></p></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="3">会话管理</td>
      <td>会话列表</td>
      <td> 从服务器分页获取会话列表</td>
      <td><p><a href="https://doc.easemob.com/v4/applet/conversation_list.html#从服务器分页获取会话列表">从服务器分页获取会话列表</a></p></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>置顶会话</td>
      <td>置顶会话</td>
      <td><a href="https://doc.easemob.com/v4/applet/conversation_pin.html">置顶会话</a></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>删除会话</td>
      <td>单向删除服务端会话</td>
      <td><a href="https://doc.easemob.com/v4/applet/conversation_delete.html#单向删除服务端会话及本地会话">单向删除服务端会话及其历史消息</a></td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理用户属性</td>
      <td>设置和获取用户属性</td>
      <td>用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等</td>
      <td><a href="https://doc.easemob.com/v4/applet/userprofile.html">管理用户属性</a></td>
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
      <td><a href="https://doc.easemob.com/v4/applet/user_relationship.html">管理用户关系</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>群组管理</td>
      <td>群组为多人聊天，有稳定的<span data-font-family="-apple-system, 'system-ui', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', STHeiti, 'Microsoft YaHei', SimSun, sans-serif">成员关系。</span></td>
      <td><p>创建、管理群组；</p>
      <p>管理群成员；</p>
      <p>管理群成员属性</p></td>
      <td><a href="https://doc.easemob.com/v4/applet/group_overview.html">群组管理</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="19">聊天室管理</td>
      <td>聊天室为多人聊天，没有固定的成员关系。</td>
      <td><p>聊天室概述</p></td>
      <td><a href="https://doc.easemob.com/v4/applet/room_overview.html">聊天室概述</a></td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td rowspan="6">创建和管理聊天室</td>
      <td>创建聊天室</td>
      <td rowspan="6"><a href="https://doc.easemob.com/v4/applet/room_manage.html">创建和管理聊天室</a></td>
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
      <td rowspan="7"><a href="https://doc.easemob.com/v4/applet/room_members.html">管理聊天室成员</a></td>
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
      <td rowspan="4"><a href="https://doc.easemob.com/v4/applet/room_attributes.html">管理聊天室基本属性</a></td>
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
      <td><a href="https://doc.easemob.com/v4/applet/room_attributes.html#管理聊天室自定义属性-key-value">管理聊天室自定义属性</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td rowspan="6">进阶功能</td>
      <td rowspan="2">登录多个设备</td>
      <td>支持同一账号在多个设备上登录并<span data-font-family="-apple-system, 'system-ui', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', STHeiti, 'Microsoft YaHei', SimSun, sans-serif">接收消息</span></td>
      <td>&nbsp;</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>多设备管理</td>
      <td><a href="https://doc.easemob.com/v4/applet/multi_device.html">多设备登录</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>管理在线状态订阅</td>
      <td>管理在线状态订阅</td>
      <td><a href="https://doc.easemob.com/v4/applet/presence.html">在线状态订阅</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>消息表情回复&nbsp;Reaction</td>
      <td>对单聊和群聊中的消息通过表情回复</td>
      <td><a href="https://doc.easemob.com/v4/applet/reaction.html">消息表情回复</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>消息话题管理</td>
      <td>消息话题是群组成员的子集</td>
      <td><a href="https://doc.easemob.com/v4/applet/thread.html">消息话题管理</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>消息举报</td>
      <td>开发者可以在客户端调用该接口举报违规消息</td>
      <td><a href="https://doc.easemob.com/v4/applet/moderation.html">消息举报</a></td>
      <td>❌</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>


## 错误码

详见 [小程序错误码文档](error.html)。







