# 管理频道

<Toc />

频道（Channel）是一个社区下不同子话题的讨论分区，因此一个社区下可以有多个频道。社区创建时会自动创建默认频道，该频道中添加了所有社区成员，用于承载各种系统通知。从可见性角度看，频道社区分为公开和私密频道；从功能角度看，频道分为文字频道和语聊频道。社区创建者可以根据自己需求创建频道。

**超级社区中的频道基于即时通讯 IM 的群组或聊天室（频道 ID 为群组 ID 或聊天室 ID）创建，解散群组或聊天室时需注意以下几点：**

**1. 在环信控制台或者通过客户端解散群组或聊天室、群组或聊天室加人、踢人等操作时请谨慎操作，需确保操作的群组或者聊天室不是超级社区使用的。**
**2. 如果将超级社区使用的频道对应的群组或者聊天室删除，会出现数据不一致情况，导致用户加入不了社区、频道、在频道内发不了消息等情况发生。**
**3. 在清理群组或者聊天室数据时，需先确认要删除的群组 ID 或聊天室 ID 与超级社区的频道 ID 是否一致。你可以调用[获取频道详情 API](#获取频道详情) 确认要删除的群组或聊天室是否为超级社区的频道。如果是，请不要进行删除。**
**4. 如果需要清理超级社区数据，调用[删除社区](server_mgmt_web.html#解散社区)和[删除频道](#解散频道)等 API。**

## 技术原理

环信 Circle Android SDK 支持你通过调用 API 实现如下功能：

- 创建和管理频道；
- 管理频道成员；
- 监听频道事件。

## 前提条件

开始前，请确保满足以下条件：

- 完成环信即时通讯 Web Circle SDK 的初始化。Circle SDK 初始化与 IM SDK 相同，详见 [IM SDK 初始化](/document/web/overview.html#sdk-初始化)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 了解 Circle 的使用限制，详见 [使用限制](circle_overview.html#限制条件)。

## 实现方法

本节介绍如何使用环信即时通讯 IM Web SDK 提供的 API 实现上述功能。

### 创建和管理频道

#### 创建频道

1. 社区所有者可以调用 `createChannel` 方法在社区中创建公开或私密频道。

每个社区默认最多可创建 100 个频道。如需调整该阈值，请联系商务。

示例代码如下：

```javascript
let options = {
   serverId: 'serverID',
   isPublic: true,
   name: 'channelName',
   description: 'this is my channel',
   ext: 'ext',
   maxusers: 8,
   mode: 0,
   categoryId: 'categoryId',
   rtcChannelId: 'rtcChannelId',
}

WebIM.conn.createChannel(options).then((res) => {
   console.log(res)
})
```

创建频道时，需设置以下参数，如下表所示。

| 参数 | 类型        | 描述                 | 是否必需 |
| :--------- | :----------------------- | :------------------ |:------------------ |
| serverId    | String     | 社区 ID。   | 是 |
| categoryId    | String     | 频道分组 ID。   | 否 |
| mode    | Number     | 频道模式：<br/> - `0`：文字频道；<br/> - `1`：语聊频道。   | 否 |
| name    | String     | 频道名称，不超过 50 个字符。   | 是 |
| isPublic    | Boolean     | 频道类型：<br/> - （默认）`true`：公开频道；<br/> - `false`：私密频道。   | 否 |
| description    | String     | 频道描述，不超过 500 个字符。   | 否 |
| maxusers    | Number     | 频道最大成员数量：<br/> - 对于语聊频道，该属性的取值范围为 [1,20]，默认值为 `8`；<br/> - 对于文字频道，该属性的取值范围为 [1,2000]，默认值为 `2000`。   | 否 |
| ext    | String     | 频道的扩展字段，不超过 500 个字符。   | 否 |
| rtcChannelId    | String     | RTC 频道 ID。该参数仅在创建语聊频道时需设置。若不设置，服务器使用创建的语聊频道的 ID 作为该参数的值返回。   | 否 |

2. 邀请用户加入频道。

社区中的用户可以自由加入社区下的公开频道，私密频道只能由频道中的成员邀请用户加入。

频道创建者调用 `inviteUserToChannel` 方法邀请用户加入频道。受邀用户会收到 `onChannelEvent` 回调，事件为 `inviteToJoin`。

- 调用 `inviteUserToChannel` 方法邀请用户加入频道，示例代码如下：
 
```javascript
let options = {
   serverId: 'serverId',
   channelId: 'channelId',
   userId: 'userId',
}

WebIM.conn.inviteUserToChannel(options).then(() => {
   console.log('发送邀请成功')
})
```

3. 受邀用户确认是否加入频道。

用户监听 `onChannelEvent` 回调，事件为 `inviteToJoin`，收到频道加入邀请，确认是否接受邀请。

 - 用户调用 `acceptChannelInvite` 方法同意加入频道。邀请人会收到 `onChannelEvent` 回调，事件为 `acceptInvite`，频道所有成员（不包括该新加入的成员）收到 `onChannelEvent` 回调，事件为`memberPresence`。示例代码如下：

   ```javascript
   let options = {
      serverId: 'serverId',
      channelId: 'channelId',
      inviter: 'inviterUserId',
   }

   WebIM.conn.acceptChannelInvite(options)
   ```

 - 用户调用 `rejectChannelInvite` 方法拒绝加入频道。邀请人会收到 `onChannelEvent` 回调，事件为 `rejectInvite`。示例代码如下：

   ```javascript
   let options = {
      serverId: 'serverId',
      channelId: 'channelId',
      inviter: 'inviterUserId',
   }

   WebIM.conn.rejectChannelInvite(options)
   ```

4. 用户加入频道后，可在频道中发送和接收消息。

#### 修改频道信息

仅社区所有者和管理员可调用 `updateChannel` 方法修改频道属性，包括频道名称、类型（公开/私有）、描述、最大成员数量和自定义扩展信息。频道所有成员（除操作者外）会收到 `onChannelEvent` 回调，事件为 `update`。频道创建后，频道模式（文字或语聊）不能修改。

若更换频道所属的频道分组，需调用 [`transferChannel`](#更换指定频道的频道分组)方法。

```javascript
let options = {
   serverId: 'serverId',
 	channelId: 'channelId'
  	name: 'the new channel name',
  	description: 'the new channel description',
}

WebIM.conn.updateChannel(options).then((res) => {
   console.log(res)
})

```

#### 解散频道

仅社区所有者可以调用 `destroyChannel` 方法解散社区中的频道。频道内其他成员收到 `onChannelEvent` 回调，事件为 `destroy` 并被移出频道。

示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
   channelId: 'channelId',
}

WebIM.conn.destroyChannel(options).then(() => {
   console.log('删除频道成功')
})
```

#### 获取频道详情

社区成员可以调用 `getChannelDetail` 方法获取频道的详情。

示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
   channelId: 'channelId',
}

WebIM.conn.getChannelDetail(options).then((res) => {
   console.log(res)
})
```

#### 获取频道列表

##### 获取社区的公开频道列表

社区成员可以调用 `getPublicChannels` 方法获取社区下的所有公开频道的列表，示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
   pageSize: 20,
   cursor: '',
}

WebIM.conn.getPublicChannels(options).then((res) => {
   console.log(res)
})
```

##### 获取社区的私密频道列表

社区成员可以调用 `getPrivateChannels` 方法获取社区下所有私密频道的列表，示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
 	pageSize: 20,
   cursor: '',
}

WebIM.conn.getPrivateChannels(options).then((res) => {
   console.log(res)
})
```

##### 获取频道分组的公开频道列表

社区成员可以调用 `getCategoryPublicChannels` 方法获取频道分组下的所有公开频道列表，示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
   categoryId: 'categoryId',
   pageSize: 20,
   cursor: '',
}

WebIM.conn.getCategoryPublicChannels(options).then((res) => {
   console.log(res)
})
```

##### 获取频道分组的私密频道列表

社区成员可以调用 `getCategoryPrivateChannels` 方法获取频道分组下的所有私密频道列表，示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
   categoryId: 'categoryId',
 	pageSize: 20,
   cursor: '',
}

WebIM.conn.getCategoryPrivateChannels(options).then((res) => {
   console.log(res)
})
```

### 发送消息

在频道中发送消息与在群组中发送消息的方式类似，唯一的区别在于接收方需要设置为频道 ID。详见 [发送群聊消息](/document/web/message_send_receive.html#发送文本消息)。

### 管理频道成员

#### 频道加人

用户加入频道分为两种方式：主动申请和频道成员邀请。

邀请用户加入频道，详见 [创建频道](#创建频道)。本节对用户申请加入频道进行详细介绍。

只有公开频道支持用户申请加入，私密频道不支持。若申请加入公开频道，用户需执行以下步骤：

1. 用户可获取[获取社区下的所有公开频道列表](#获取社区的公开频道列表)。

2. 调用 `joinChannel` 方法传入社区 ID 和频道 ID，申请加入对应频道。用户加入频道后，频道所有成员（不包括该新加入的成员）会收到 `onChannelEvent` 回调，事件为 `memberPresence`。示例代码如下：

   ```javascript
   let options = {
      serverId: 'serverId',
      channelId: 'channelId'
   }

   WebIM.conn.joinChannel(options).then((res) => {
      console.log(res)
   })
   ```

3. 用户加入频道后可以在频道中发送和接收消息。

#### 退出频道

##### 频道成员主动退出频道

频道所有成员可调用 `leaveChannel` 方法退出频道。频道内的其他成员会收到 `onChannelEvent` 回调，事件为 `memberAbsence`。退出频道的成员不会再收到频道消息。

:::tip
社区内的默认频道不允许成员主动退出。
:::

示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
   channelId: 'channelId'
}

WebIM.conn.leaveChannel(options).then(() => {
   console.log('离开频道成功')
})
```

##### 频道成员被移出频道

社区所有者和管理员可以调用 `removeChannelMember` 方法将指定成员移出频道。被移出频道的成员会收到 `onChannelEvent` 回调，事件为 `removed`，频道其他成员会收到 `onChannelEvent` 回调，事件为 `memberAbsence`。被移出频道的成员不会再收到频道消息。

:::tip
社区内的默认频道不允许踢出成员。
:::

示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
   channelId: 'channelId',
   userId: 'userId'
}

WebIM.conn.removeChannelMember(options).then(() => {
   console.log('移除频道成员成功')
})
```

#### 将成员加入频道禁言列表

仅社区所有者和社区管理员可以调用 `muteChannelMember` 方法将频道成员加入禁言列表。被禁言的频道成员、社区所有者和管理员（除操作者外）会收到 `onChannelEvent` 回调，事件为 `muteMember`。

禁言列表中的成员无法在频道中发送消息，但可以接收频道中的消息。

示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
   channelId: 'channelId',
   userId: 'userId',
   duration: -1
}

WebIM.conn.muteChannelMember(options).then(() => {
   console.log('禁言频道成员成功')
})
```

#### 将成员移出频道禁言列表

社区所有者和社区管理员可以调用 `unmuteChannelMember` 方法，将频道禁言列表上的频道成员移出频道禁言列表。被移出禁言列表的频道成员、社区所有者和管理员（除操作者外）会收到 `onChannelEvent` 回调，事件为 `unmuteMember`。频道成员被移出禁言列表后可在频道中正常发送和接收消息。

示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
   channelId: 'channelId',
   userId: 'userId',
}

WebIM.conn.unmuteChannelMember(options).then(() => {
   console.log('移除禁言成员成功')
})
```

#### 获取频道禁言列表

社区所有者和社区管理员可以调用 `getChannelMutelist` 方法获取频道下的禁言列表。

```javascript
let options = {
   serverId: 'serverId',
   channelId: 'channelId',
}

WebIM.conn.getChannelMutelist(options).then((res) => {
   console.log(res)
})
```

#### 获取指定频道的成员列表

频道中的成员可以获取该频道下的成员列表：

- 创建语聊房频道时，创建者不加入频道。因此，频道创建者不算入频道成员数量，查询频道成员列表时不返回频道创建者。

- 对于其他模式的频道创建时，创建者直接加入频道。因此，频道创建者算入频道成员数量，查询频道成员列表返回频道创建者。


```javascript
let options = {
   serverId: 'serverId',
   channelId: 'channelId',
   pageSize: 20,
   cursor: ''
}

WebIM.conn.getChannelMembers(options).then((res) => {
   console.log(res)
})
```

#### 查询当前用户是否在频道中

社区成员可以调用 `isInChannel` 方法查询自己是否在指定频道中。示例代码如下：

```javascript
let options = {
   serverId: 'serverId',
   channelId: 'channelId',
}

WebIM.conn.isInChannel(options).then((res) => {
   console.log(res)
})
```

### 监听频道事件

Circle 提供 `addEventHandler` 方法用于注册监听事件。开发者可以通过设置此监听，获取频道分组中的事件。

```javascript
WebIM.conn.addEventHandler("channelEvent", {
   onChannelEvent: (e) => {
      const { operation } = e;
      switch (operation) {
         case "destroy":
            // 解散频道。频道的所有成员（除操作者外）会收到该事件。
            break;
         case "update":
            // 修改频道信息。频道所有成员（除操作者外）会收到该事件。
            break;
         case "memberAbsence":
            // 有成员主动退出频道。频道内的其他成员会收到该事件。
            break;
         case "memberPresence":
            // 有用户加入频道。频道的所有成员会收到该事件。
            break;
         case "removed":
            // 有成员被移出频道。被移出的成员会收到该事件。
            break;
         case "muteMember":
            // 有成员被添加至频道禁言列表。被添加至禁言列表的成员、社区所有者和管理员（除操作者外）会收到该事件。
            break;
         case "unmuteMember":
            // 有用户被移出频道禁言列表。被移出禁言列表的成员、社区所有者和管理员（除操作者外）会收到该事件。
            break;  
         case "inviteToJoin":
            // 用户收到频道加入邀请。受邀用户会收到该事件。
            break;
         case "rejectInvite":
            // 用户拒绝频道加入邀请。邀请人会收到该事件。
            break;
         case "acceptInvite":
            // 用户同意频道加入邀请。邀请人会收到该事件。
            break;
         default:
            break;
      }
   }
});
               
```