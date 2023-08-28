# 管理频道

频道（Channel）是一个社区下不同子话题的讨论分区，因此一个社区下可以有多个频道。社区创建时会自动创建默认频道，该频道中添加了所有社区成员，用于承载各种系统通知。从可见性角度看，频道社区分为公开和私密频道；从功能角度看，频道分为文字频道和语聊频道。社区创建者可以根据自己需求创建频道。

**超级社区中的频道基于即时通讯 IM 的群组或聊天室（频道 ID 为群组 ID 或聊天室 ID）创建，删除群组或聊天室时需注意以下几点：**

**1. 在环信控制台或者通过客户端删除群组或聊天室、群组或聊天室加人、踢人等操作时请谨慎操作，需确保操作的群组或者聊天室不是超级社区使用的。**
**2. 如果将超级社区使用的频道对应的群组或者聊天室删除，会出现数据不一致情况，导致用户加入不了社区、频道、在频道内发不了消息等情况发生。**
**3. 在清理群组或者聊天室数据时，需先确认要删除的群组 ID 或聊天室 ID 与超级社区的频道 ID 是否一致。你可以调用[获取频道详情 API](#获取频道详情) 确认要删除的群组或聊天室是否为超级社区的频道。如果是，请不要进行删除。**
**4. 如果需要清理超级社区数据，调用[删除社区](server_mgmt_android.html#解散社区)和[删除频道](#解散频道)等 API。**

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMCircleManager` 类和 `EMCircleChannel` 类用于频道管理，支持你通过调用 API 在项目中实现如下功能：

- 创建和管理频道；
- 管理频道成员；
- 监听频道事件。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 3.9.9.2 版本的初始化，详见 [快速开始](/document/android/quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

本节介绍如何使用环信即时通讯 IM Android SDK 提供的 API 实现上述功能。

### 创建和管理频道

#### 创建频道

1. 社区所有者可以调用 `createChannel` 方法在社区中创建公开或私密频道。参与频道创建的初始成员会收到 `EMCircleChannelListener#onChannelCreated` 事件。

每个社区默认最多可创建 100 个频道。如需调整该阈值，请联系商务。

示例代码如下：

```java
EMCircleChannelAttribute attribute = new EMCircleChannelAttribute();
    attribute.setName(name);
    attribute.setDesc(desc);
    attribute.setMaxUsers(2000);
    attribute.setType(EMCircleChannelStyle.EMChannelStylePublic);

EMClient.getInstance().chatCircleManager().createChannel(serverId, categoryId, attribute, EMCircleChannelModeChat, new EMValueCallBack<EMCircleChannel>() {

    @Override
    public void onSuccess(EMCircleChannel value) {

    }

    @Override
    public void onError(int code, String error) {

    }
});
```

创建频道时，需设置社区 ID、频道分组 ID、频道模式以及频道属性 `EMCircleChannelAttribute`，如下表所示。

| 参数 | 类型        | 描述                 | 是否必需 |
| :--------- | :----------------------- | :------------------ |:------------------ |
| serverId    | String     | 社区 ID。   | 是 |
| categoryId    | String     | 频道分组 ID。   | 否 |
| mode    | EMCircleChannelMode     | 频道模式：<br/> - `EMCircleChannelModeChat`：文字频道；<br/> - `EMCircleChannelModeVoice`：语聊频道。   | 是 |
| EMCircleChannelAttribute.name    | String     | 频道名称，不超过 50 个字符。    | 是 |
| EMCircleChannelAttribute.desc    | String     | 频道描述，不超过 500 个字符。    | 否 |
| EMCircleChannelAttribute.maxUsers    | Int     | 频道最大成员数量：<br/> - 对于语聊频道，该属性的取值范围为 [1,20]，默认值为 `8`；<br/> - 对于文字频道，该属性的取值范围为 [1,2000]，默认值为 `2000`。 | 否 |
| EMCircleChannelAttribute.type    | EMCircleChannelStyle     | 频道类型：<br/> - （默认）`EMChannelStylePublic`：公开频道；<br/> - `EMChannelStylePrivate`：私密频道。 | 否 |
| EMCircleChannelAttribute.ext    | String     | 频道自定义扩展信息，不超过 500 个字符。          | 否 |
| EMCircleChannelAttribute.rtcChannelId    | String     | RTC 频道 ID。该参数仅在创建语聊频道时需设置。若不设置，服务器使用创建的语聊频道的 ID 作为该参数的值返回。   | 否 |

2. 邀请用户加入频道。

社区中的用户可以自由加入社区下的公开频道，私密频道只能由频道成员邀请用户加入。

频道创建者调用 `inviteUserToChannel` 方法邀请用户加入频道。受邀用户收到 `EMCircleChannelListener#onReceiveInvitation` 事件。

```java
EMClient.getInstance().chatCircleManager().inviteUserToChannel(serverId, channelId, inviteeUserId, "welcome", new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        
                    }

                    @Override
                    public void onError(int code, String error) {
                        
                    }
                });
```

3. 受邀用户确认是否加入频道。

 - 用户调用 `acceptChannelInvitation` 方法同意加入频道，邀请人收到 `EMCircleChannelListener#onInvitationBeAccepted` 事件，频道所有成员（不包括该新加入的成员）收到 `EMCircleChannelListener#onMemberJoinedChannel` 事件。示例代码如下：

   ```java
   EMClient.getInstance().chatCircleManager().acceptChannelInvitation(serverId, channelId, inviterUserId, new EMValueCallBack<EMCircleChannel>() {
        @Override
        public void onSuccess(EMCircleChannel circleChannel) {
            
        }

        @Override
        public void onError(int code, String message) {
            
        }
    });
   ```

- 用户调用 `declineChannelInvitation` 方法拒绝加入频道，邀请人收到 `EMCircleChannelListener#onInvitationBeDeclined` 事件。示例代码如下：

   ```java
   EMClient.getInstance().chatCircleManager().declineChannelInvitation(serverId,channelId, inviterUserId, new EMCallBack() {
        @Override
        public void onSuccess() {
            
        }

        @Override
        public void onError(int code, String message) {
            
        }
    });
   ```

4. 用户加入频道后，可在频道中发送和接收消息。

#### 修改频道信息

仅社区所有者和管理员可调用 `updateChannel` 方法修改频道属性 `EMCircleChannelAttribute`，包括频道名称、类型（公开/私有）、描述、最大成员数量和自定义扩展信息。频道所有成员（除操作者外）会收到 `EMCircleChannelListener#onChannelUpdated` 事件。频道创建后，频道模式（文字或语聊）不能修改。

若更换频道所属的频道分组，需调用 [transferChannel](category_mgmt_android.html#更换指定频道的频道分组)方法。

示例代码如下：

```java
EMCircleChannelAttribute attribute = new EMCircleChannelAttribute();
    attribute.setName(name);
    attribute.setDesc(desc);
    
EMClient.getInstance().chatCircleManager().updateChannel(serverId, channelId, attribute, new EMValueCallBack<EMCircleChannel>() {

    @Override
    public void onSuccess(EMCircleChannel value) {
        
    }

    @Override
    public void onError(int code, String error) {
        
    }
});
```

#### 解散频道

仅社区所有者可以调用 `destroyChannel` 方法解散社区中的频道。频道内其他成员收到 `EMCircleChannelListener#onChannelDestroyed` 事件并被移出频道。

示例代码如下：

```java
 EMClient.getInstance().chatCircleManager().destroyChannel(serverId, channelId, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int code, String error) {
        
    }
});
```

#### 获取频道详情

社区成员可以调用 `fetchChannelDetail` 方法获取频道的详情。

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().fetchChannelDetail(serverId, channelId, new EMValueCallBack<EMCircleChannel>() {
    @Override
    public void onSuccess(EMCircleChannel value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

#### 获取频道列表

##### 获取社区的公开频道列表

社区成员可以调用 `fetchPublicChannelsInServer` 方法获取社区下的所有公开频道的列表，示例代码如下：

```java
EMClient.getInstance().chatCircleManager().fetchPublicChannelsInServer(serverId, 20, null, new EMValueCallBack<EMCursorResult<EMCircleChannel>>() {
    @Override
    public void onSuccess(EMCursorResult<EMCircleChannel> value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

##### 获取社区的私密频道列表

社区成员可以调用 `fetchVisiblePrivateChannelsInServer` 方法获取社区下所有私密频道的列表。

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().fetchVisiblePrivateChannelsInServer(serverId, 20, null, new EMValueCallBack<EMCursorResult<EMCircleChannel>>() {
    @Override
    public void onSuccess(EMCursorResult<EMCircleChannel> value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

##### 获取社区中加入的频道

社区成员可以调用 `fetchJoinedChannelIdsInServer` 方法获取社区下加入的频道列表。

```java
EMClient.getInstance().chatCircleManager().fetchJoinedChannelIdsInServer(serverId, 20, null, new EMValueCallBack<EMCursorResult<String>>() {
    @Override
    public void onSuccess(EMCursorResult<String> value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

##### 获取频道分组的公开频道列表

社区成员可以调用 `fetchPublicChannelsInCategory` 方法获取频道分组下所有公开频道的列表，示例代码如下：

```java
EMClient.getInstance().chatCircleManager().fetchPublicChannelsInCategory(serverId, categoryId,20, null, new EMValueCallBack<EMCursorResult<EMCircleChannel>>() {
    @Override
    public void onSuccess(EMCursorResult<EMCircleChannel> value) {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

##### 获取频道分组下的私密频道列表

调用 `fetchPrivateChannelsInCategory` 方法获取频道分组下的所有私密频道的列表，示例代码如下：

```java
EMClient.getInstance().chatCircleManager().fetchPrivateChannelsInCategory(serverId, categoryId,20, null, new EMValueCallBack<EMCursorResult<EMCircleChannel>>() {
    @Override
    public void onSuccess(EMCursorResult<EMCircleChannel> value) {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

### 发送消息

在频道中发送消息与在群组中发送消息的方式类似，唯一的区别在于接收方需要设置为频道 ID。详见 [发送群聊消息](/document/android/message_send_receive.html#发送文本消息)。

### 管理频道成员

#### 频道加人

用户加入频道分为两种方式：主动申请和频道成员邀请。

邀请用户加入频道，详见 [创建频道](#创建频道)。本节对用户申请加入频道进行详细介绍。

只有公开频道支持用户申请加入，私有频道不支持。若申请加入公开频道，用户需执行以下步骤：

1. 用户可获取社区下的[公开频道列表](#获取社区的公开频道列表)。

2. 调用 `joinChannel` 方法传入社区 ID 和频道 ID，申请加入对应频道。用户加入频道后，频道所有成员（不包括该新加入的成员）会收到 `EMCircleChannelListener#onMemberJoinedChannel` 事件。

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().joinChannel(serverId, channelId, new EMValueCallBack<EMCircleChannel>() {
    @Override
    public void onSuccess(EMCircleChannel value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

3. 用户加入频道后可以在频道中发送和接收消息。

#### 退出频道

##### 频道成员主动退出频道

频道所有成员可调用 `leaveChannel` 方法退出频道。频道内的其他成员会收到 `EMCircleChannelListener#onMemberLeftChannel` 事件。退出频道的成员不会再收到频道消息。

:::tip
社区内的默认频道不允许成员主动退出。
:::

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().leaveChannel(serverId, channelId, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int code, String error) {

    }
});
```

##### 频道成员被移出频道

仅频道所有者和管理员可以调用 `removeUserFromChannel` 方法将指定成员移出频道。被移出的频道的成员会收到 `EMCircleChannelListener#onMemberRemovedFromChannel`事件，其他成员会收到 `EMCircleChannelListener#onMemberLeftChannel` 事件。被移出频道的成员不会再收到频道消息。

:::tip
社区内的默认频道不允许踢出成员。
:::

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().removeUserFromChannel(serverId, channelId, userId, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int code, String error) {
        
    }
});
```

#### 将成员加入频道禁言列表

社区所有者和社区管理员可以调用 `muteUserInChannel` 方法将频道成员加入禁言列表。被禁言的频道成员、社区所有者和管理员（除操作者外）会收到 `EMCircleChannelListener#onMemberMuteChanged` 事件。

禁言列表中的成员无法在频道中发送消息，但可以接收频道中的消息。

```java
long muteDuration = 24 * 60 * 60 * 1000;//毫秒
EMClient.getInstance().chatCircleManager().muteUserInChannel(serverId, channelId, username, muteDuration, new EMCallBack() {
    @Override
    public void onSuccess() {
       
    }

    @Override
    public void onError(int code, String error) {
        
    }
});
```

#### 将成员移出频道禁言列表

社区所有者和社区管理员可以调用 `unmuteUserInChannel` 方法，将频道禁言列表上的频道成员移出频道禁言列表。被移出禁言列表的频道成员、社区所有者和管理员（除操作者外）会收到 `EMCircleChannelListener#onMemberMuteChanged` 事件。频道成员被移出禁言列表后可在频道中正常发送和接收消息。

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().unmuteUserInChannel(serverId, channelId, username, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int code, String error) {
        
    }
});
```

#### 获取频道禁言列表

社区所有者和社区管理员可以调用 `fetchChannelMuteUsers` 方法获取频道下的禁言列表。

```java
EMClient.getInstance().chatCircleManager().fetchChannelMuteUsers(serverId, channelId, new EMValueCallBack<Map<String, Long>>() {
                    @Override
                    public void onSuccess(Map<String, Long> usersMuted) {
                        
                    }

                    @Override
                    public void onError(int error, String errorMsg) {
                        
                    }
                });
```

#### 获取指定频道的成员列表

频道中的成员可以获取该频道下的成员列表：

- 创建语聊房频道时，创建者不加入频道。因此，频道创建者不算入频道成员数量，查询频道成员列表时不返回频道创建者。

- 对于其他模式的频道创建时，创建者直接加入频道。因此，频道创建者算入频道成员数量，查询频道成员列表返回频道创建者。

```java
EMClient.getInstance().chatCircleManager().fetchChannelMembers(serverId, channelId, 20, null, new EMValueCallBack<EMCursorResult<EMCircleUser>>() {
    @Override
    public void onSuccess(EMCursorResult<EMCircleUser> value) {

    }

    @Override
    public void onError(int error, String errorMsg) {
        
    }
});
```

#### 查询当前用户是否在频道中

社区成员可调用 `checkSelfIsInChannel` 方法查询自己是否在指定频道中。示例代码如下：

```java
EMClient.getInstance().chatCircleManager().checkSelfIsInChannel(serverId, channelId, new EMValueCallBack<Boolean>() {
    @Override
    public void onSuccess(Boolean value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {
        
    }
});
```

### 监听频道事件

#### 单设备登录监听事件 

`EMCircleManager` 中提供频道事件的监听接口。开发者可以通过设置此监听，获取频道中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

```java
EMCircleChannelListener chatChannelListener = new EMCircleChannelListener() {
    //创建频道。参与创建的初始成员会收到该事件。
    @Override
    public void onChannelCreated(EMCircleChannel channel, String creator) {

    }
    //解散频道。频道的所有成员（除操作者）会收到该事件。
    @Override
    public void onChannelDestroyed(String serverId, String categoryId, String channelId, String initiator) {

    }
    //修改频道信息。频道所有成员（除操作者外）会收到该事件。
    @Override
    public void onChannelUpdated(EMCircleChannel channel, String initiator) {

    }
    //有用户加入频道。频道的所有成员（不包括该新加入的成员）会收到该事件。
    @Override
    public void onMemberJoinedChannel(String serverId, String categoryId, String channelId, EMCircleUser circleUser) {

    }
    //有成员退出频道。频道内的其他成员会收到该事件。
    @Override
    public void onMemberLeftChannel(String serverId, String categoryId, String channelId, String member) {

    }
    //有成员被移出频道。被移出的成员会收到该事件。
    @Override
    public void onMemberRemovedFromChannel(String serverId, String categoryId, String channelId, String member, String initiator) {

    }
    //用户收到频道加入邀请。受邀用户会收到该事件。
    @Override
    public void onReceiveInvitation(EMCircleChannelInviteInfo inviteInfo, String inviter) {

    }
    //用户同意频道加入邀请。邀请人会收到该事件。
    @Override
    public void onInvitationBeAccepted(String serverId, String categoryId, String channelId, String invitee) {

    }
    //用户拒绝频道加入邀请。邀请人会收到该事件。
    @Override
    public void onInvitationBeDeclined(String serverId, String categoryId, String channelId, String invitee) {

    }
    //有成员的禁言状态发生变化。禁言状态变更的成员、社区所有者和管理员（除操作者外）会收到该事件。
    @Override
    public void onMemberMuteChanged(String serverId, String categoryId, String channelId, boolean isMuted, List<String> muteMembers) {

    }
};

//添加对频道的监听
EMClient.getInstance().chatCircleManager().addChannelListener(chatChannelListener);
//移除频道的监听。
EMClient.getInstance().chatCircleManager().removeChannelListener(chatChannelListener);
//清空所有频道的监听
EMClient.getInstance().chatCircleManager().clearChannelListeners();
```

#### 多设备登录监听事件 

```java
public void onCircleChannelEvent(int event, String channelId, List<String> usernames) {
    switch (event) {
        // 当前用户在其他设备上创建频道。
        case CHANNEL_CREATE:
            break;
        // 当前用户在其他设备上删除频道。
        case CHANNEL_DELETE:
            break;
        // 当前用户在其他设备上更新频道。
        case CHANNEL_UPDATE:
            break;
        // 当前用户在其他设备上加入频道。
        case CHANNEL_JOIN:
            break;
        // 当前用户在其他设备上接受加入频道的邀请。
        case CHANNEL_INVITATION_ACCEPT:
            break;
        // 当前用户在其他设备上拒绝加入频道的邀请。
        case CHANNEL_INVITATION_DECLINE:
            break;
        // 当前用户在其他设备上退出频道。
        case CHANNEL_LEAVE:
            break;
        // 当前用户在其他设备上从频道中移除成员。
        case CIRCLE_CHANNEL_REMOVE_USER:
            break;
        // 当前用户在其他设备上邀请用户加入频道。
        case CIRCLE_CHANNEL_INVITE_USER:
            break;
        // 当前用户在其他设备上禁言频道成员。
        case CIRCLE_CHANNEL_MEMBER_ADD_MUTE:
            break;
        // 当前用户在其他设备上解除对频道成员的禁言。
        case CIRCLE_CHANNEL_MEMBER_REMOVE_MUTE:
            break;
    }
}
```
