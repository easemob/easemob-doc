# 管理社区

<Toc />

社区（Server）是一群有着共同兴趣爱好的人的专属天地，也可以是同学朋友的社交圈子。社区是环信圈子三层基础架构的最上层，各种消息事件均发生在社区内。社区分为公开社区和私密社区。对于公开社区，任何用户均可查询社区列表，可自由加入或退出社区，无需审批；对于私密社区，用户无法查询社区列表，只能通过社区成员邀请加入社区，无法申请加入社区。

**超级社区中的频道基于即时通讯 IM 的群组或聊天室（频道 ID 为群组 ID 或聊天室 ID）创建，删除群组或聊天室时需注意以下几点：**

**1. 在环信控制台或者通过客户端删除群组或聊天室、群组或聊天室加人、踢人等操作时请谨慎操作，需确保操作的群组或者聊天室不是超级社区使用的。**
**2. 如果将超级社区使用的频道对应的群组或者聊天室删除，会出现数据不一致情况，导致用户加入不了社区、频道、在频道内发不了消息等情况发生。**
**3. 在清理群组或者聊天室数据时，需先确认要删除的群组 ID 或聊天室 ID 与超级社区的频道 ID 是否一致。你可以调用[获取频道详情 API](channel_mgmt_ios.html#获取频道详情) 确认要删除的群组或聊天室是否为超级社区的频道。如果是，请不要进行删除。**
**4. 如果需要清理超级社区数据，调用[删除社区](#解散社区)和[删除频道](channel_mgmt_ios.html#解散频道)等 API。**

## 技术原理

环信即时通讯 IM iOS SDK 提供 `IEMCircleManager` 类和 `EMCircleManagerServerDelegate` 类用于社区管理，支持你通过调用 API 在项目中实现如下功能：

- 创建和管理社区；
- 管理社区成员；
- 监听社区事件。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 3.9.9.1 版本的初始化，详见 [快速开始](/document/ios/quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 创建和管理社区

#### 创建社区

社区分为公开社区和私密社区。每个用户最多可以创建 100 个社区。若要提升上限，请联系商务。

1. 调用 `createServer` 方法创建社区。

示例代码如下：

```swift
let attribute = EMCircleServerAttribute()
attribute.name = serverName
attribute.icon = serverIcon
attribute.type = .public
attribute.background = serverBackground
attribute.desc = serverDesc
attribute.ext = serverExt
EMClient.shared().circleManager?.createServer(attribute) { server, error in    
}
```

创建社区时，需设置社区属性 `EMCircleServerAttribute`，如下表所示。

| 参数 | 类型        | 描述                 | 是否必需 |
| :--------- | :----------------------- | :------------------ |:------------------ |
| `name`    | NSString     | 社区名称，不能超过 50 个字符。   | 是 |
| `icon`    | NSString    | 社区头像 URL，不能超过 500 个字符。    | 否 |
| `type`    | EMCircleServerType   | 社区类型：<br/> - （默认）`Public`：公开社区；<br/> - `Private`：私密社区。  | 否 |
| `background`    | NSString    | 社区背景 URL，不能超过 500 个字符。 | 否 |
| `desc`    | NSString     | 社区描述，不能超过 500 个字符。          | 否 |
| `ext`    | NSString     | 社区自定义扩展字段，不能超过 500 个字符。         | 否 |

2. 邀请用户加入社区。

 社区成员调用 `inviteUserToServer` 方法邀请用户加入社区。受邀用户收到 `EMCircleManagerServerDelegate#onReceiveServerInvitation` 事件。

示例代码如下：

```swift
EMClient.shared().circleManager?.inviteUserToServer(serverId: serverId, userId: userId, welcome: welcome) { error in
}
```

3. 用户确认是否加入社区。

  - 若同意加入社区，调用 `acceptServerInvitation` 方法。邀请人收到 `EMCircleManagerServerDelegate#onServerInvitationBeAccepted` 事件，社区内所有成员（不包括加入社区的该新成员）会收到 `EMCircleManagerServerDelegate#onMemberJoinedServer` 事件。示例代码如下：

```swift
EMClient.shared().circleManager?.acceptServerInvitation(serverId, inviter: inviter) { server, error in
}
```

  - 若拒绝加入社区，调用 `declineServerInvitation` 方法。邀请人收到 `EMCircleManagerServerDelegate#onServerInvitationBeDeclined` 事件。示例代码如下：

 ```swift
EMClient.shared().circleManager?.declineServerInvitation(serverId, inviter: inviter) { error in
}
 ```

#### 修改社区信息

社区所有者和管理员可调用 `updateServer` 方法修改社区属性 `EMCircleServerAttribute`，包括社区名称、类型、描述、头像 URL、背景 URL 和自定义扩展信息。社区信息修改后，社区的所有成员（除操作者外）会收到 `EMCircleManagerServerDelegate#onServerUpdated` 事件。

示例代码如下：

```swift
let attribute = EMCircleServerAttribute()
attribute.name = serverName
attribute.desc = serverDesc
if let serverIcon = serverIcon {
    attribute.icon = serverIcon
}
EMClient.shared().circleManager?.updateServer(serverId, attribute: attribute) { server, error in
}
```

#### 解散社区

仅社区所有者可调用 `destroyServer` 方法解散社区。社区解散后，社区所有成员（除社区所有者）会收到 `EMCircleManagerServerDelegate#onServerDestroyed` 事件并被移出社区。

示例代码如下：

```swift
EMClient.shared().circleManager?.destroyServer(serverId) { error in
}
```

#### 添加社区标签

社区所有者和管理员可以调用 `addTagsToServer` 方法为社区添加标签。非社区内用户可以通过搜索标签全名查找社区。每个社区最多可添加 10 个标签。

示例代码如下：

```swift
EMClient.shared().circleManager?.addTags(toServer: serverId, tags: ["tag1", "tag2"]) { tags, error in
}
```

#### 移除社区标签

社区所有者和管理员可以调用 `removeTagsFromServer` 方法移除社区已有标签。

示例代码如下：

```swift
EMClient.shared().circleManager?.removeTags(fromServer: serverId, tagIds: ["tagId1", "tagId2"]) { error in
}
```

#### 获取社区标签列表

社区成员可调用 `fetchServerTags` 方法获取社区的标签列表。

```swift
EMClient.shared.circleManager?.fetchServerTags(serverId, completion: { tags, error in
            
})
```

#### 搜索公开社区

社区成员可以调用 `fetchServersWithType` 方法按查询类型（`EMCircleServerSearchType`）搜索公开社区，即按社区名称或社区标签名称查询。
 - 根据社区名称搜索，支持基于通过社区全名搜索和模糊搜索分页获取数据。若使用模糊搜索，你需要传入社区名称中最左侧的单个字或词汇，或包含该字或词汇的关键字。例如社区名称为 `足球社区01`，传入 `足`或`足球` 都可搜索出该社区，而使用 `球` 或 `社区01` 则搜索不到该社区。
 - 若根据标签名称搜索，需传入完整的标签名称，不支持模糊搜索。该类型查询直接获取带有该标签的所有社区，不支持分页查询。 

```swift
EMClient.shared().circleManager?.fetchServers(with: .name, keyword: keyword, limit: 20, cursor: nil, completion: { servers, error in
                
})
```

#### 获取社区详情

社区成员可以调用 `fetchServerDetail` 方法获取社区的详情。

示例代码如下：

```swift
EMClient.shared().circleManager?.fetchServerDetail(serverId) { server, error in
}
```

#### 获取已加入社区

社区成员可以调用 `fetchJoinedServers` 方法获取已加入的社区列表。

示例代码如下：

```swift
EMClient.shared().circleManager?.fetchJoinedServers(20, cursor: cursor) { result, error in
}
```

#### 分页获取社区成员列表

社区成员可以调用 `fetchServerMembers` 方法分页获取指定社区中的成员列表，该列表包含社区创建者。

示例代码如下：

```swift
EMClient.shared().circleManager?.fetchServerMembers(serverId, limit: 20, cursor: cursor) { result, error in
}
```

### 管理社区成员

#### 加入社区

每个用户最多可加入 100 个社区，超过需要联系商务。用户可以通过以下两种方式加入社区：

1. [搜索公开社区获得社区 ID](#搜索公开社区)，主动申请加入该社区。

2. 社区内成员邀请用户加入。

公开社区支持申请加入和邀请加入，而私密社区仅支持邀请加入。通过邀请加入社区，详见 [创建社区](#创建社区)。

下面介绍用户如何申请加入公开社区。

1. 用户 [搜索公开社区获得社区 ID](#搜索公开社区)。

2. 用户调用 `joinServer` 方法加入社区。加入成功后，社区内其他成员会收到 `EMCircleManagerServerDelegate#onMemberJoinedServer` 事件。

示例代码如下：

```swift
EMClient.shared().circleManager?.joinServer(serverId) { server, error in
}
```

#### 退出社区

社区成员若退出社区，则会退出该社区下的所有频道。社区所有者不支持退出社区操作，只能解散社区。

退出社区分为主动退出和被动退出，被动退出即成员被社区所有者或管理员移出社区。

#### 用户主动退出社区

用户可调用 `leaveServer` 方法退出社区。退出成功后，社区内其他成员会收到 `EMCircleManagerServerDelegate#onMemberLeftServer` 事件。

示例代码如下：

```swift
EMClient.shared().circleManager?.leaveServer(serverId) { error in
}
```

#### 用户被移出社区

社区所有者和管理员调用 `removeUserFromServer` 方法将普通成员移出社区，管理员只能被社区所有者移出社区。被移出社区的成员、社区所有者和管理员（除操作者外）会收到 `EMCircleManagerServerDelegate#onMemberRemovedFromServer` 事件。

示例代码如下：

```swift
EMClient.shared().circleManager?.removeUser(fromServer: serverId, userId: userId) { error in
}
```

#### 查询当前用户是否在社区内

用户可调用 `checkSelfIsInServer` 方法查询自己是否已经加入了指定社区。

示例代码如下：

```swift
EMClient.shared().circleManager?.checkSelfIs(inServer: serverId) { isIn, error in
}
```

#### 查询当前用户的社区角色

用户可调用 `fetchSelfServerRole` 方法查询当前用户在社区中的角色。

示例代码如下：

```swift
EMClient.shared().circleManager?.fetchSelfServerRole(serverId) { role, error in
}
```

#### 设置社区管理员

仅社区所有者可以调用 `addModeratorToServer` 方法设置社区管理员。成功设置后，社区所有成员（除社区所有者外）会收到 `EMCircleManagerServerDelegate#onServerRoleAssigned` 事件。

社区管理员除了不能创建和解散社区等少数权限外，拥有对社区的绝大部分权限。

示例代码如下：

```swift
EMClient.shared().circleManager?.addModerator(toServer: serverId, userId: userId) { error in
}
```

#### 移除社区管理员

仅社区所有者可以调用 `removeModeratorFromServer` 方法移除社区管理员。成功移除后，社区所有成员（除社区所有者外）会收到 `EMCircleManagerServerDelegate#onServerRoleAssigned` 事件。

社区管理员被移除管理员权限后，将只拥有社区普通成员的权限。

示例代码如下：

```swift
EMClient.shared().circleManager?.removeModerator(fromServer: serverId, userId: userId) { error in
}
```

### 监听社区事件

`IEMCircleManager` 中提供社区事件的监听接口。开发者可以通过设置此监听，获取社区中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

```swift
//添加社区回调代理。
EMClient.shared().circleManager?.add(serverDelegate: self, queue: nil)
//移除社区回调代理。
EMClient.shared().circleManager?.remove(serverDelegate: self)
```

```swift
//社区信息更新。社区所有成员（除操作者外）会收到该事件。
func onServerUpdated(_ event: EMCircleServerEvent) {
        
}
//社区被解散。社区所有成员（除社区所有者外）会收到该事件。
func onServerDestroyed(_ serverId: String, initiator: String) {

}
//用户收到社区加入邀请。受邀用户会收到该事件。
func onReceiveServerInvitation(_ event: EMCircleServerEvent, inviter: String) {
    
}
//用户同意社区加入邀请。邀请人会收到该事件。
func onServerInvitationBeAccepted(_ serverId: String, invitee: String) {
    
}
//用户拒绝社区加入邀请。邀请人会收到该事件。
func onServerInvitationBeDeclined(_ serverId: String, invitee: String) {
    
}
//社区成员的角色发生变化。社区所有成员（除操作者外）会收到该事件。
func onServerRoleAssigned(_ serverId: String, member: String, role: EMCircleUserRole) {
    
}
//有用户加入社区。社区所有成员（除加入社区的新成员外）会收到该事件。
func onMemberJoinedServer(_ serverId: String, member: String) {
    
}
//有成员主动退出社区。社区所有者和管理员会收到该事件。
func onMemberLeftServer(_ serverId: String, member: String) {
    
}
//有成员被移出社区。被移出者、社区所有者和管理员（除操作者外）会收到该事件。
func onMemberRemoved(fromServer serverId: String, members: [String]) {
    
}
```
