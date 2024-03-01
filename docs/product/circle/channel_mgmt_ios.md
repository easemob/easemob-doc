# 管理频道

<Toc />

频道（Channel）是一个社区下不同子话题的讨论分区，因此一个社区下可以有多个频道。社区创建时会自动创建默认频道，该频道中添加了所有社区成员，用于承载各种系统通知。从可见性角度看，频道社区分为公开和私密频道；从功能角度看，频道分为文字频道和语聊频道。社区创建者可以根据自己需求创建频道。

**超级社区中的频道基于即时通讯 IM 的群组或聊天室（频道 ID 为群组 ID 或聊天室 ID）创建，删除群组或聊天室时需注意以下几点：**

**1. 在环信控制台或者通过客户端删除群组或聊天室、群组或聊天室加人、踢人等操作时请谨慎操作，需确保操作的群组或者聊天室不是超级社区使用的。**
**2. 如果将超级社区使用的频道对应的群组或者聊天室删除，会出现数据不一致情况，导致用户加入不了社区、频道、在频道内发不了消息等情况发生。**
**3. 在清理群组或者聊天室数据时，需先确认要删除的群组 ID 或聊天室 ID 与超级社区的频道 ID 是否一致。你可以调用[获取频道详情 API](#获取频道详情) 确认要删除的群组或聊天室是否为超级社区的频道。如果是，请不要进行删除。**
**4. 如果需要清理超级社区数据，调用[删除社区](server_mgmt_ios.html#解散社区)和[删除频道](#解散频道)等 API。**

## 技术原理

环信即时通讯 IM iOS SDK 提供 `IEMCircleManager` 类和 `EMCircleManagerChannelDelegate` 类用于频道管理，支持你通过调用 API 在项目中实现如下功能：

- 创建和管理频道；
- 管理频道成员；
- 监听频道事件。

## 前提条件

开始前，请确保满足以下条件：

- 完成 Circle SDK 的初始化，即完成 IM SDK 3.9.9.1 版本的初始化，详见 [IM SDK 初始化](/document/ios/overview.html#sdk-初始化)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 了解 Circle 的使用限制，详见 [使用限制](circle_overview.html#限制条件)。

## 实现方法

本节介绍如何使用环信即时通讯 IM iOS SDK 提供的 API 实现上述功能。

### 创建和管理频道

#### 创建频道

1. 社区所有者可以调用 `createChannel` 方法在社区中创建公开或私密频道。参与频道创建的初始成员会收到 `EMCircleManagerChannelDelegate#onChannelCreated` 事件。

每个社区默认最多可创建 100 个频道。如需调整该阈值，请联系商务。

示例代码如下：

```swift
let attribute = EMCircleChannelAttribute()
attribute.name = self.nameTextField.text ?? ""
attribute.type = self.publicSwitch.isOn ? .public : .private
let mode: EMCircleChannelMode = self.voiceSwitch.isOn ? .voide : .chat
EMClient.shared().circleManager?.createChannel(self.serverId, categoryId: self.categoryId, attribute: attribute, mode: mode, completion: { channel, error in
})
```

创建频道时，需设置社区 ID、频道分组 ID、频道模式以及频道属性 `EMCircleChannelAttribute`，如下表所示。

| 参数 | 类型        | 描述                 | 是否必需 |
| :--------- | :----------------------- | :------------------ |:------------------ |
| serverId    | NSString     | 社区 ID。   | 是 |
| categoryId    | NSString     | 频道分组 ID。   | 否 |
| mode    | EMCircleChannelMode     | 频道模式：<br/> - `Chat`：文字频道；<br/> - `Voice`：语聊频道。   | 是 |
| EMCircleChannelAttribute.name    | NSString     | 频道名称，不超过 50 个字符。    | 是 |
| EMCircleChannelAttribute.desc    | NSString     | 频道描述，不超过 500 个字符。    | 否 |
| EMCircleChannelAttribute.maxUsers    | int32_t     | 频道最大成员数量：<br/> - 对于语聊频道，该属性的取值范围为 [1,20]，默认值为 `8`；<br/> - 对于文字频道，该属性的取值范围为 [1,2000]，默认值为 `2000`。 | 否 |
| EMCircleChannelAttribute.type    | EMCircleChannelType     | 频道类型：<br/> - （默认）`Public`：公开频道；<br/> - `Private`：私密频道。 | 否 |
| EMCircleChannelAttribute.ext    | NSString     | 频道自定义扩展信息，不超过 500 个字符。          | 否 |
| EMCircleChannelAttribute.rtcChannelId    | NSString     | RTC 频道 ID。该参数仅在创建语聊频道时需设置。若不设置，服务器使用创建的语聊频道的 ID 作为该参数的值返回。   | 否 |

2. 邀请用户加入频道。

社区中的用户可以自由加入社区下的公开频道，私密频道只能由频道成员邀请用户加入。

频道创建者调用 `inviteUserToChannel` 方法邀请用户加入频道。受邀用户收到 `EMCircleManagerChannelDelegate#onReceiveChannelInvitation` 事件。

```swift
 EMClient.shared().circleManager?.inviteUserToChannel(serverId: serverId, channelId: channelId, userId: userId, welcome: welcome) { error in
 }
```

3. 受邀用户确认是否加入频道。

 - 用户调用 `acceptChannelInvitation` 方法同意加入频道，邀请人收到 `EMCircleManagerChannelDelegate#onReceiveChannelInvitation` 事件，频道所有成员（不包括该新加入的成员）收到 `EMCircleManagerChannelDelegate#onMemberJoinedChannel` 事件。示例代码如下：

   ```swift
   EMClient.shared().circleManager?.acceptChannelInvitation(serverId, channelId: channelId, inviter: inviter) { channel, error in
   }
   ```

- 用户调用 `declineChannelInvitation` 方法拒绝加入频道，邀请人收到 `EMCircleManagerChannelDelegate#onChannelInvitationBeDeclined` 事件。示例代码如下：

   ```swift
   EMClient.shared().circleManager?.declineChannelInvitation(serverId, channelId: channelId, inviter: inviter) { error in
   }
   ```

4. 用户加入频道后，可在频道中发送和接收消息。

#### 修改频道信息

仅社区所有者和管理员可调用 `updateChannel` 方法修改频道属性 `EMCircleChannelAttribute`，包括频道名称、类型（公开/私有）、描述、最大成员数量和自定义扩展信息。频道所有成员（除操作者外）会收到 `EMCircleManagerChannelDelegate#onChannelUpdated` 事件。频道创建后，频道模式（文字或语聊）不能修改。

若更换频道所属的频道分组，需调用 [`transferChannel`](category_mgmt_ios.html#更换指定频道的频道分组)方法。

示例代码如下：

```swift
let channelAttr = EMCircleChannelAttribute()
channelAttr.name = channelName
channelAttr.desc = channelDesc
EMClient.shared().circleManager?.updateChannel(serverId, channelId: channelId, attribute: channelAttr) { channel, error in
}
```

#### 解散频道

仅社区所有者可以调用 `destroyChannel` 方法解散社区中的频道。频道内其他成员收到 `EMCircleManagerChannelDelegate#onChannelDestroyed` 事件并被移出频道。

示例代码如下：

```swift
EMClient.shared().circleManager?.destroyChannel(serverId, channelId: channelId) { error in
}
```

#### 获取频道详情

社区成员可以调用 `fetchChannelDetail` 方法获取频道的详情。

示例代码如下：

```swift
EMClient.shared().circleManager?.fetchChannelDetail(serverId, channelId: channelId) { channel, _ in
}
```

#### 获取频道列表

##### 获取社区的公开频道列表

社区成员可以调用 `fetchPublicChannelsInServer` 方法获取社区下的所有公开频道的列表，示例代码如下：

```swift
EMClient.shared().circleManager?.fetchPublicChannels(inServer: serverId, limit: 20, cursor: nil) { result, error in
}
```

##### 获取社区的私密频道列表

社区成员可以调用 `fetchPrivateChannelsInServer` 方法获取社区下所有私密频道的列表。

示例代码如下：

```swift
EMClient.shared().circleManager?.fetchPrivateChannels(inServer: serverId, limit: 20, cursor: nil) { result, error in
}
```

##### 获取社区中加入的频道

社区成员可以调用 `fetchJoinedChannelIds` 方法获取社区下加入的频道列表。

```swift
EMClient.shared().circleManager?.fetchJoinedChannelIds(inServer: serverId, limit: 20, cursor: cursor, completion: { result, error in
            
        })
```

##### 获取频道分组的公开频道列表

社区成员可以调用 `fetchPublicChannelsInCategory` 方法获取频道分组下所有公开频道的列表，示例代码如下：

```swift
EMClient.shared().circleManager?.fetchPublicChannels(inCategory: serverId, categoryId: categoryId, limit: 20, cursor: result?.publicResult?.cursor, completion: { result, error in
}
```

##### 获取频道分组下的私密频道列表

调用 `fetchPrivateChannelsInCategory` 方法获取频道分组下的所有私密频道的列表，示例代码如下：

```swift
EMClient.shared().circleManager?.fetchPrivateChannels(inCategory: self.serverId, categoryId: categoryId, limit: 20, cursor: result?.privateResult?.cursor, completion: { result, error in
}
```

### 发送消息

在频道中发送消息与在群组中发送消息的方式类似，唯一的区别在于接收方需要设置为频道 ID。详见 [发送群聊消息](/document/ios/message_send_receive.html#发送文本消息)。

### 管理频道成员

#### 频道加人

用户加入频道分为两种方式：主动申请和频道成员邀请。

邀请用户加入频道，详见 [创建频道](#创建频道)。本节对用户申请加入频道进行详细介绍。

只有公开频道支持用户申请加入，私有频道不支持。若申请加入公开频道，用户需执行以下步骤：

1. 用户可获取社区下的[公开频道列表](#获取社区的公开频道列表)。

2. 调用 `joinChannel` 方法传入社区 ID 和频道 ID，申请加入对应频道。用户加入频道后，频道所有成员（不包括该新加入的成员）会收到 `EMCircleManagerChannelDelegate#onMemberJoinedChannel` 事件。

示例代码如下：

```swift
EMClient.shared().circleManager?.joinChannel(serverId, channelId: channelId) { channel, error in
}
```

3. 用户加入频道后可以在频道中发送和接收消息。

#### 退出频道

##### 频道成员主动退出频道

频道所有成员可调用 `leaveChannel` 方法退出频道。频道内的其他成员会收到 `EMCircleManagerChannelDelegate#onMemberLeftChannel` 事件。退出频道的成员不会再收到频道消息。

:::tip
社区内的默认频道不允许成员主动退出。
:::

示例代码如下：

```swift
EMClient.shared().circleManager?.leaveChannel(serverId, channelId: channelId) { error in
}
```

##### 频道成员被移出频道

仅频道所有者和管理员可以调用 `removeUserFromChannel` 方法将指定成员移出频道。被移出的频道的成员会收到 `EMCircleManagerChannelDelegate#onMemberRemovedFromChannel`事件，其他成员会收到 `EMCircleManagerChannelDelegate#onMemberLeftChannel` 事件。被移出频道的成员不会再收到频道消息。

:::tip
社区内的默认频道不允许踢出成员。
:::

示例代码如下：

```swift
EMClient.shared().circleManager?.removeUser(fromServer: serverId, userId: userId) { error in
}
```

#### 将成员加入频道禁言列表

社区所有者和社区管理员可以调用 `muteUserInChannel` 方法将频道成员加入禁言列表。被禁言的频道成员、社区所有者和管理员（除操作者外）会收到 `EMCircleManagerChannelDelegate#onMemberMuteChangeInChannel` 事件。

禁言列表中的成员无法在频道中发送消息，但可以接收频道中的消息。

```swift
EMClient.shared().circleManager?.muteUserInChannel(userId: userId, serverId: serverId, channelId: channelId, duration: 86400) { error in
}
```

#### 将成员移出频道禁言列表

社区所有者和社区管理员可以调用 `unmuteUserInChannel` 方法，将频道禁言列表上的频道成员移出频道禁言列表。被移出禁言列表的频道成员、社区所有者和管理员（除操作者外）会收到 `EMCircleManagerChannelDelegate#onMemberMuteChangeInChannel` 事件。频道成员被移出禁言列表后可在频道中正常发送和接收消息。

示例代码如下：

```swift
EMClient.shared().circleManager?.unmuteUserInChannel(userId: userId, serverId: serverId, channelId: channelId) { error in
}
```

#### 获取频道禁言列表

社区所有者和社区管理员可以调用 `fetchChannelMuteUsers` 方法获取频道下的禁言列表。

```swift
EMClient.shared().circleManager?.fetchChannelMuteUsers(serverId, channelId: channelId) { map, error in
}
```

#### 获取指定频道的成员列表

频道中的成员可以获取该频道下的成员列表：

- 创建语聊房频道时，创建者不加入频道。因此，频道创建者不算入频道成员数量，查询频道成员列表时不返回频道创建者。

- 对于其他模式的频道创建时，创建者直接加入频道。因此，频道创建者算入频道成员数量，查询频道成员列表返回频道创建者。

```swift
EMClient.shared().circleManager?.fetchChannelMembers(serverId, channelId: channelId, limit: 20, cursor: cursor) { result, error in
}
```

#### 查询当前用户是否在频道中

社区成员可调用 `checkSelfIsInChannel` 方法查询自己是否在指定频道中。示例代码如下：

```swift
EMClient.shared().circleManager?.checkSelfIsInChannel(serverId: serverId, channelId: channelId) { isJoined, error in
}
```

### 监听频道事件

#### 单设备登录监听事件 

`IEMCircleManager` 中提供频道事件的监听接口。开发者可以通过设置此监听，获取频道中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

```swift
//添加频道回调代理。
EMClient.shared().circleManager?.add(channelDelegate: self, queue: nil)
//移除频道回调代理。
EMClient.shared().circleManager?.remove(channelDelegate: self)
```

```swift
//创建频道。参与创建的初始成员会收到该事件。
func onChannelCreated(_ channel: EMCircleChannel, creator: String) {
        
}
//修改频道信息。频道所有成员（除操作者外）会收到该事件。
func onChannelUpdated(_ channel: EMCircleChannel, initiator: String) {
   
}
//解散频道。频道的所有成员（除操作者）会收到该事件。
func onChannelDestroyed(_ serverId: String, categoryId: String, channelId: String, initiator: String) {
   
}
//用户收到频道加入邀请。受邀用户会收到该事件。
func onReceiveChannelInvitation(_ invite: EMCircleChannelExt, inviter: String) {
   
}
//用户同意频道加入邀请。邀请人会收到该事件。
func onChannelInvitationBeAccepted(_ serverId: String, categoryId: String, channelId: String, invitee: String) {
   
}
//用户拒绝频道加入邀请。邀请人会收到该事件。
func onChannelInvitationBeDeclined(_ serverId: String, categoryId: String, channelId: String, invitee: String) {
   
}
//有用户加入频道。频道的所有成员（不包括该新加入的成员）会收到该事件。
func onMemberJoinedChannel(_ serverId: String, categoryId: String, channelId: String, member: EMCircleUser) {
   
}
//有成员主动退出频道。频道内的其他成员会收到该事件。
func onMemberLeftChannel(_ serverId: String, categoryId: String, channelId: String, member: String) {
   
}
//有成员被移出频道。被移出的成员会收到该事件。
func onMemberRemoved(fromChannel serverId: String, categoryId: String, channelId: String, member: String, initiator: String) {
   
}
//有成员的禁言状态发生变化。禁言状态变更的成员、社区所有者和管理员（除操作者外）会收到该事件。
func onMemberMuteChange(inChannel serverId: String, categoryId: String, channelId: String, muted isMuted: Bool, members: [String]) {
   
}
```

#### 多设备登录监听事件 

```swift
(void)multiDevicesCircleChannelEventDidReceive:(EMMultiDevicesEvent)aEvent
                                       channelId:(NSString * _Nonnull)channelId
                                           ext:(id _Nullable)aExt
{
    switch (aEvent) {
        // 当前用户在其他设备创建了频道。
        case EMMultiDevicesEventCircleChannelCreate:
            break;
        // 当前用户在其他设备销毁了频道。
        case EMMultiDevicesEventCircleChannelDestroy:
            break;
        // 当前用户在其他设备更新了频道。
        case EMMultiDevicesEventCircleChannelUpdate:
            break;
        // 当前用户在其他设备加入了频道。
        case EMMultiDevicesEventCircleChannelJoin:
            break;
        // 当前用户在其他设备同意了频道邀请。
        case EMMultiDevicesEventCircleChannelInviteBeAccepted:
            break;
        // 当前用户在其他设备拒绝了频道邀请。
        case EMMultiDevicesEventCircleChannelInviteBeDeclined:
            break;
        // 当前用户在其他设备退出了频道。
        case EMMultiDevicesEventCircleChannelExit:
            break;
        // 当前用户在其他设备将用户从频道中踢出。
        case EMMultiDevicesEventCircleChannelRemoveUser:
            break;
        // 当前用户在其他设备邀请用户加入频道。
        case EMMultiDevicesEventCircleChannelInviteUser:
            break;
        // 当前用户在其他设备将频道中的用户禁言。
        case EMMultiDevicesEventCircleChannelAddMute:
            break;
        // 当前用户在其他设备解除频道中的用户禁言。
        case EMMultiDevicesEventCircleChannelRemoveMute:
            break;
        default:
            break;
    }
}
```
