# 群组管理


许多群组操作前需要鉴别权限，包括当前用户是否在群里面，是否拥有管理员或者所有者权限。 建议用户登录成功后，调用 EMClient.getInstance().groupManager().getJoinedGroupsFromServer(); 刷新本地群组列表，确保鉴别权限正常工作。


**注意**：`1、群主+管理员 一起一共不超过 100 个，也就是不超过 99 个管理员。2、群组成员最大数（包括群主）取决于所选择的版本，不同版本最大数不同。`

------

## 收发消息

收发消息及聊天记录相关内容等详见 [消息](message)。

## 新建群组

```
/**
 * 创建群组
 * @param groupName 群组名称
 * @param desc 群组简介
 * @param allMembers 群组初始成员，如果只有自己传空数组即可（最多可以传100个成员）
 * @param reason 邀请成员加入的reason
 * @param option 群组类型选项，可以设置群组最大用户数(取决于所选择的版本，不同版本最大数不同)及群组类型@see {@link EMGroupStyle}
 *               option.inviteNeedConfirm表示邀请对方进群是否需要对方同意，默认是被邀请方自动进群。
 *               option.extField创建群时可以为群组设定扩展字段，方便个性化订制。
 * @return 创建好的group
 * @throws HyphenateException
 */
EMGroupOptions option = new EMGroupOptions();
option.maxUsers = 200;
option.style = EMGroupStyle.EMGroupStylePrivateMemberCanInvite;

EMClient.getInstance().groupManager().createGroup(groupName, desc, allMembers, reason, option);
```

注：如果option.inviteNeedConfirm设置为false,即直接加被邀请人进群。在此情况下，被邀请人设置非自动进群是不起作用的。

option里的GroupStyle分别为：

- `EMGroupStylePrivateOnlyOwnerInvite`——私有群，只有群主可以邀请人；
- `EMGroupStylePrivateMemberCanInvite`——私有群，群成员也能邀请人进群；
- `EMGroupStylePublicJoinNeedApproval`——公开群，加入此群除了群主邀请，只能通过申请加入此群；
- `EMGroupStylePublicOpenJoin` ——公开群，任何人都能加入此群。

## 添加管理员权限

```
/**
 * 增加群组管理员，需要owner权限
 * @param groupId
 * @param admin
 * @return
 * @throws HyphenateException
 */
EMClient.getInstance().groupManager().addGroupAdmin(final String groupId, final String admin);//需异步处理
```

## 移除管理员权限

```
/**
 * 删除群组管理员，需要owner权限
 * @param groupId
 * @param admin
 * @return
 * @throws HyphenateException
 */
EMClient.getInstance().groupManager().removeGroupAdmin(String groupId, String admin);//需异步处理
```

## 变更群组所有者

```
/**
 * 群组所有权给他人
 * @param groupId
 * @param newOwner
 * @return
 * @throws HyphenateException
 */
EMClient.getInstance().groupManager().changeOwner(String groupId, String newOwner);//需异步处理
```

## 群组加人

```
//群主加人调用此方法
EMClient.getInstance().groupManager().addUsersToGroup(groupId, newmembers);//需异步处理
//私有群里，如果开放了群成员邀请，群成员邀请调用下面方法
EMClient.getInstance().groupManager().inviteUser(groupId, newmembers, null);//需异步处理
```

## 群组踢人

```
//把username从群组里删除
EMClient.getInstance().groupManager().removeUserFromGroup(groupId, username);//需异步处理
```

## 加入某个群组

只能用于加入公开群。

```
//如果群开群是自由加入的，即group.isMembersOnly()为false，直接join
EMClient.getInstance().groupManager().joinGroup(groupid);//需异步处理
//需要申请和验证才能加入的，即group.isMembersOnly()为true，调用下面方法
EMClient.getInstance().groupManager().applyJoinToGroup(groupid, "求加入");//需异步处理
```

## 退出群组

```
EMClient.getInstance().groupManager().leaveGroup(groupId);//需异步处理
```

## 解散群组

```
EMClient.getInstance().groupManager().destroyGroup(groupId);//需异步处理
```

## 获取完整的群成员列表

```
//如果群成员较多，需要多次从服务器获取完成

List<String> memberList = new ArrayList<>;
EMCursorResult<String> result = null;
final int pageSize = 20;
do {
    result = EMClient.getInstance().groupManager().fetchGroupMembers(groupId,
            result != null ? result.getCursor() : "", pageSize);
    memberList.addAll(result.getData());
} while (!TextUtils.isEmpty(result.getCursor()) && result.getData().size() == pageSize);
```

## 获取群组列表

```
//从服务器获取自己加入的和创建的群组列表，此api获取的群组sdk会自动保存到内存和db。
List<EMGroup> grouplist = EMClient.getInstance().groupManager().getJoinedGroupsFromServer();//需异步处理

//从本地加载群组列表
List<EMGroup> grouplist = EMClient.getInstance().groupManager().getAllGroups();

//获取公开群列表
//pageSize为要取到的群组的数量，cursor用于告诉服务器从哪里开始取
EMCursorResult<EMGroupInfo> result = EMClient.getInstance().groupManager().getPublicGroupsFromServer(pageSize, cursor);//需异步处理
List<EMGroupInfo> groupsList = List<EMGroupInfo> returnGroups = result.getData();
String cursor = result.getCursor();
```

## 修改群组名称｜描述

```
//修改群名称
EMClient.getInstance().groupManager().changeGroupName(groupId,changedGroupName);//需异步处理

//修改群描述
EMClient.getInstance().groupManager().changeGroupDescription(groupId, description);//需异步处理
```

## 群组信息

获取单个群组信息。getGroupFromServer(groupId)返回结果包含群组名称，群描述，群主，管理员列表，不包含群成员。

getGroupFromServer(String groupId, boolean fetchMembers)，如果fetchMembers为true，取群组信息的时候也会获取群成员，最大数200人。

```
//根据群组ID从本地获取群组基本信息
EMGroup group = EMClient.getInstance().groupManager().getGroup(groupId);
//根据群组ID从服务器获取群组基本信息
EMGroup group = EMClient.getInstance().groupManager().getGroupFromServer(groupId);

group.getOwner();//获取群主
List<String> members = group.getMembers();//获取内存中的群成员
List<String> adminList = group.getAdminList();//获取管理员列表
boolean isMsgBlocked = group.isMsgBlocked();//获取是否已屏蔽群组消息
...
```

其它方法详见[环信接口文档](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_group_manager.html)。

## 屏蔽群消息

```
/**
* 屏蔽群消息后，就不能接收到此群的消息（还是群里面的成员，但不再接收消息）
* @param groupId， 群ID
* @throws EasemobException
*/
EMClient.getInstance().groupManager().blockGroupMessage(groupId);//需异步处理
```

## 解除屏蔽群

```
/**
* 取消屏蔽群消息，就可以正常收到群的所有消息
* @param groupId
* @throws EaseMobException
*/
EMClient.getInstance().groupManager().unblockGroupMessage(groupId);//需异步处理
```

## 群组黑名单

### 将群成员拉入群组的黑名单

```
/**
* 将用户加到群组的黑名单，被加入黑名单的用户无法加入群，无法收发此群的消息
* （只有群主才能设置群的黑名单）
* @param groupId, 群组的ID
* @param username, 待屏蔽的用户名
* @exception EaseMobException 出错会抛出
*/
EMClient.getInstance().groupManager().blockUser(groupId, username);//需异步处理
```

### 将用户移除出群黑名单

```
/**
* 将用户从群组的黑名单移除（只有群主才能调用此函数）
* @param groupId, 群组的ID
* @param username, 待解除屏蔽的用户名
*/
EMClient.getInstance().groupManager().unblockUser(groupId, username);//需异步处理
```

### 获取群组的黑名单用户列表

```
/**
* 获取群组的黑名单用户列表
* （只有群主才能调用此函数）
* @return List<String> 
* @throws EaseMobException 获取失败
*/
EMClient.getInstance().groupManager().getBlockedUsers(groupId);//需异步处理
```

## 群组禁言操作

### 将群成员加入禁言列表中

```
/**
 * 禁止某些群组成员发言, 需要群组拥有者或者管理员权限
 * @param groupId
 * @param muteMembers 禁言的用户列表
 * @param duration 禁言的时间，单位是毫秒
 * @return
 * @throws HyphenateException
 */
EMClient.getInstance().groupManager().muteGroupMembers(String groupId, List<String> muteMembers, long duration);//需异步处理
```

### 将群成员移出禁言列表

```
/**
 * 解除禁言, 需要群组拥有者或者管理员权限
 * @param groupId
 * @param members
 * @return
 * @throws HyphenateException
 */

EMClient.getInstance().groupManager().unMuteGroupMembers(String groupId, List<String> members);//需异步处理
```

### 获取群成员禁言列表

```
/**
 * 获取群组的禁言列表，需要群组拥有者或者管理员权限
 * @param groupId
 * @param pageNum
 * @param pageSize
 * @return Map.entry.key 是禁言的成员id，Map.entry.value是禁言动作存在的时间，单位是毫秒。
 * @throws HyphenateException
 */
EMClient.getInstance().groupManager().fetchGroupMuteList(String groupId, int pageNum, int pageSize)
```

### 开启和关闭全员禁言

owner和管理员可以开启和关闭全员禁言。

```
/**
     * \~chinese
     * 禁言所有成员
     * @param groupId 群组id
     */
    public void muteAllMembers(final String groupId, final EMValueCallBack<EMGroup> callBack)
    
    /**
     * \~chinese
     * 解除所有成员禁言
     * @param groupId 群组id
     */
    public void unmuteAllMembers(final String groupId, final EMValueCallBack<EMGroup> callBack)
```

### 白名单管理

可以将用户添加到白名单中，用户白名单在管理员开启了全员禁言时生效，可以运行白名单用户发出消息。 另外可以将用户移出白名单，检查自己是否在白名单中以及获取白名单列表。

```
/**
	 * \~chinese
	 * 添加用户到白名单
	 * @param groupId 群组id
	 * @param members 成员id列表
	 */
	public void addToGroupWhiteList(final String groupId, final List<String> members, final EMCallBack callBack)

        /**
	 * \~chinese
	 * 将用户从白名单移除
	 * @param groupId 群组id
	 * @param members 成员id列表
	 */
	public void removeFromGroupWhiteList(final String groupId, final List<String> members, final EMCallBack callBack)

        /**
	 * \~chinese
	 * 检查自己是否在白名单中
	 * @param groupId 群组id
	 */
	public void checkIfInGroupWhiteList(final String groupId, EMValueCallBack<Boolean> callBack)

        /**
	 * \~chinese
	 * 从服务器获取白名单成员列表
	 * @param groupId 群组id
	 */
	public void fetchGroupWhiteList(final String groupId, final EMValueCallBack<List<String>> callBack) 
```

## 设置/更新群公告

```
/**
 * 更新群公告
 * @param groupId 群id
 * @param announcement 公告内容
 * @throws HyphenateException
 */
EMClient.getInstance().groupManager().updateGroupAnnouncement(groupId, announcement);
```

## 获取群公告

```
EMClient.getInstance().groupManager().fetchGroupAnnouncement(groupId)
```

## 上传共享文件

```
/**
 * 上传共享文件至群组，注意callback只做进度回调用
 * @param groupId 群id
 * @param filePath 文件本地路径
 * @param callBack 回调
 */
EMClient.getInstance().groupManager().uploadGroupSharedFile(groupId, filePath, callBack)
```

## 删除群共享文件

```
/**
 * 从群组里删除这个共享文件
 * @param groupId 群id
 * @param fileId 文件id 
 */
EMClient.getInstance().groupManager().deleteGroupSharedFile(groupId, fileId);
```

## 获取群共享文件列表

```
/**
 * 从服务器获取群组的共享文件列表
 * @param groupId 群id
 * @param pageNum 分页号
 * @param pageSize 分页大小
 *
 */
EMClient.getInstance().groupManager().fetchGroupSharedFileList(groupId, pageNum, pageSize)
```

## 下载群共享文件

```
/**
 * 下载群里的某个共享文件，注意callback只做进度回调用
 * @param groupId 群id
 * @param fileId 文件id
 * @param savePath 文件保存路径
 * @param callBack 回调
 */
EMClient.getInstance().groupManager().downloadGroupSharedFile(groupId, fileId, savePath, callBack);
```

## 更新群扩展字段

```
EMClient.getInstance().groupManager().updateGroupExtension(groupId, extension);
```

## 群组事件监听

```
EMClient.getInstance().groupManager().addGroupChangeListener(new EMGroupChangeListener() {
@Override
    public void onInvitationReceived(String groupId, String groupName, String inviter, String reason) {
		//接收到群组加入邀请
    }

    @Override
    public void onRequestToJoinReceived(String groupId, String groupName, String applyer, String reason) {
		//用户申请加入群
    }

    @Override
    public void onRequestToJoinAccepted(String groupId, String groupName, String accepter) {
		//加群申请被同意
    }

    @Override
    public void onRequestToJoinDeclined(String groupId, String groupName, String decliner, String reason) {
		//加群申请被拒绝
    }

    @Override
    public void onInvitationAccepted(String groupId, String inviter, String reason) {
		//群组邀请被同意
    }

    @Override
    public void onInvitationDeclined(String groupId, String invitee, String reason) {
		//群组邀请被拒绝
    }
    
    @Override
    public void onAutoAcceptInvitationFromGroup(String groupId, String inviter, String inviteMessage) {
		//接收邀请时自动加入到群组的通知
    }

    @Override
    public void onMuteListAdded(String groupId, final List<String> mutes, final long muteExpire) {
		//成员禁言的通知
    }

    @Override
    public void onMuteListRemoved(String groupId, final List<String> mutes) {
		//成员从禁言列表里移除通知
    }
    
    @Override
    public void onWhiteListAdded(String groupId, List<String> whitelist) {
          //成员被加到白名单中
    }

    @Override
    public void onWhiteListRemoved(String groupId, List<String> whitelist) {
         //成员从白名单中被移除
    }

    @Override
    public void onAllMemberMuteStateChanged(String groupId, boolean isMuted) {
          //全员禁言是否开启
    }

    @Override
    public void onAdminAdded(String groupId, String administrator) {
		//增加管理员的通知
    }

    @Override
    public void onAdminRemoved(String groupId, String administrator) {
		//管理员移除的通知
    }

    @Override
    public void onOwnerChanged(String groupId, String newOwner, String oldOwner) {
		//群所有者变动通知
    }
    @Override
    public void onMemberJoined(final String groupId,  final String member){
        //群组加入新成员通知
    }
    @Override
    public void onMemberExited(final String groupId, final String member) {
        //群成员退出通知
    }

    @Override
    public void onAnnouncementChanged(String groupId, String announcement) {
		//群公告变动通知
    }

    @Override
    public void onSharedFileAdded(String groupId, EMMucSharedFile sharedFile) {
		//增加共享文件的通知
    }

    @Override
    public void onSharedFileDeleted(String groupId, String fileId) {
		//群共享文件删除通知
    }
});
```
