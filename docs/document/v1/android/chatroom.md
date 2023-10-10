# 聊天室管理


环信聊天室模型支持默认最大成员数为 5000，和群组不同，聊天室内成员离线后，服务器当监听到此成员不在线后不再会给此成员再发推送。聊天室成员数可调整，请联系商务。

- 默认支持最大成员数 5000，调整请联系商务；
- 环信的聊天室内有所有者，管理员和游客三种身份；
- 支持禁言，黑名单，踢人等操作；
- 不支持客户端邀请；
- 不支持 REST 邀请。
- 聊天室 API 通常是同步操作，需要在单独的线程中执行，如需使用异步 API，请使用 async 前缀对应的 API

环信聊天室客户端的主要特性包括：

- 支持查询所有 APP 聊天室；
- 支持查询聊天室详情；
- 加入聊天室；
- 退出聊天室；
- 客户端的 API 都是通过 `EMChatroomManager(EMClient.getInstance().chatroomManager())` 操作。

### 服务器端API

服务器端聊天室有关的 REST 操作请参考[聊天室管理](/document/v1/server-side/chatroom.html)。

### 加入聊天室

```
//roomId为聊天室ID
EMClient.getInstance().chatroomManager().joinChatRoom(roomId, new EMValueCallBack<EMChatRoom>() {

        @Override
        public void onSuccess(EMChatRoom value) {   
            //加入聊天室成功
        }

        @Override
        public void onError(final int error, String errorMsg) {
            //加入聊天室失败
        }
    });
```

**注意**对于聊天室模型，请一定要等到 Join 回调成功后再去初始化 conversation。

### 离开聊天室

```
EMClient.getInstance().chatroomManager().leaveChatRoom(toChatUsername);
```

此方法是异步方法，不会阻塞当前线程。此方法没有回调，原因是在任何场景下退出聊天室，SDK 保证退出成功，无论有网出错，还是无网退出。对于聊天室模型，一般退出会话页面，就会调用此 leave 方法。

### 创建聊天室

```
/**
 * \~chinese
 * 创建聊天室，聊天室最大人数上限10000。只有特定用户有权限创建聊天室。
 * @param subject           名称
 * @param description       描述
 * @param welcomeMessage    邀请成员加入聊天室的消息
 * @param maxUserCount      允许加入聊天室的最大成员数
 * @param members           邀请加入聊天室的成员列表
 * @return EMChatRoom 聊天室
 * @throws HyphenateException
 */
EMClient.getInstance().chatroomManager().createChatRoom(String subject, String description, String welcomeMessage,
                                 int maxUserCount, List<String> members);
```

### 销毁聊天室

```
/**
 * 销毁聊天室，需要owner权，同步方法
 * @param chatRoomId
 * @throws HyphenateException
 */
EMClient.getInstance().chatroomManager().destroyChatRoom(String chatRoomId);
```


### 获取聊天室列表

```
/**
 * pageSize: 此次获取的条目
 * cursor: 后台需要的cursor ID，根据此ID再次获取pageSize的条目，首次传null即可
 */
EMCursorResult<EMChatRoom> result = EMClient.getInstance().chatroomManager().fetchPublicChatRoomsFromServer(pageSize, cursor) 
```

返回值：

```
EMCursorResult<EMChatRoom> 内部包含返回的cursor和List<EMChatRoom>
```

### 获取聊天室详情

```
/**
 * roomId 聊天室id
 * fetchMembers 是否要获取聊天室成员，可不传
 */
//EMClient.getInstance().chatroomManager().fetchChatRoomFromServer(roomId, fetchMembers)
EMClient.getInstance().chatroomManager().fetchChatRoomFromServer(roomId)
room.getName();//聊天室名称
room.getId();//聊天室id
room.getDescription();//聊天室描述
room.getOwner();//聊天室创建者

```
参考[API文档](http://www.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_room.html)


<!--





### 修改聊天室名称｜描述

```
// 修改聊天室名称
EMClient.getInstance().chatroomManager().changeChatRoomSubject(String chatRoomId, String newSubject);

// 修改聊天室描述
EMClient.getInstance().chatroomManager().changeChatroomDescription(String chatRoomId, String newDescription));
```

### 聊天室禁言

#### 禁止成员发言

```
/**
 * \~chinese
 * 禁止聊天室成员发言，需要聊天室拥有者或者管理员权限
 * @param chatRoomId
 * @param muteMembers 禁言的用户列表
 * @param duration 禁言的时间，单位是毫秒
 * @return 聊天室
 * @throws HyphenateException
 */
EMClient.getInstance().chatroomManager().muteChatRoomMembers(String chatRoomId, List<String> muteMembers, long duration);
```

#### 取消聊天室成员禁言

```
/**
 * \~chinese
 * 取消禁言，需要聊天室拥有者或者管理员权限
 * @param chatRoomId
 * @param members
 * @return
 * @throws HyphenateException
 */
EMClient.getInstance().chatroomManager().unMuteChatRoomMembers(String chatRoomId, List<String> members);
```

#### 分页获取聊天室禁言列表

```
/**
 * \~chinese
 * 获取聊天室的禁言列表，需要拥有者或者管理员权限
 * @param chatRoomId
 * @param pageNum 分页获取禁言列表
 * @param pageSize 每页包含禁言成员数目
 * @return  Map.entry.key 是禁言的成员id，Map.entry.value是禁言动作失效的时间，单位是毫秒
 * @throws HyphenateException
 */
Map<String, Long> mutes = EMClient.getInstance().chatroomManager().fetchChatRoomMuteList(String chatRoomId, int pageNum, int pageSize);
```

### 开启和关闭全员禁言

owner和管理员可以开启和关闭全员禁言。

```
/**
     * \~chinese
     * 禁言所有成员
     * @param chatRoomId 
     */
    public void muteAllMembers(final String chatRoomId, final EMValueCallBack<EMGroup> callBack)
    
    /**
     * \~chinese
     * 解除所有成员禁言
     * @param chatRoomId 
     */
    public void unmuteAllMembers(final String chatRoomId, final EMValueCallBack<EMGroup> callBack)
```

### 白名单管理

可以将用户添加到白名单中，用户白名单在管理员开启了全员禁言时生效，可以允许白名单用户发出消息。 另外可以将用户移出白名单，检查自己是否在白名单中以及获取白名单列表。

```
/**
     * \~chinese
     * 添加用户到白名单
     * @param chatRoomId 
     * @param members 成员id列表
     */
    public void addToChatRoomWhiteList(final String chatRoomId, final List<String> members, final EMCallBack callBack)

        /**
     * \~chinese
     * 将用户从白名单移除
     * @param chatRoomId
     * @param members 成员id列表
     */
    public void removeFromChatRoomWhiteList(final String chatRoomId, final List<String> members, final EMCallBack callBack)

        /**
     * \~chinese
     * 检查自己是否在白名单中
     * @param groupId 群组id
     */
    public void checkIfInChatRoomWhiteList(final String chatRoomId, EMValueCallBack<Boolean> callBack)

        /**
     * \~chinese
     * 从服务器获取白名单成员列表
     * @param groupId 群组id
     */
    public void fetchChatRoomWhiteList(final String chatRoomId, final EMValueCallBack<List<String>> callBack) 
```

### 聊天室管理员

```
//增加聊天室管理员
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().addChatRoomAdmin(String chatRoomId, String admin);

//删除聊天室管理员
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().removeChatRoomAdmin(String chatRoomId, String admin);

//获取管理员列表，需要先获取群详情
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().fetchChatRoomFromServer(String roomId);
List<String> adminList = chatroom.getAdminList();
```

### 分页获取聊天室成员

```
/**
     * \~chinese
     * 获取聊天室成员列表， 获取最后一页成员列表时，EMCursorResult.getCursor()返回一个空字符串.
     * @param chatRoomId
     * @param cursor
     * @param pageSize
     * @return
     * @throws HyphenateException
     */
    public EMCursorResult<String> fetchChatRoomMembers(String chatRoomId, String cursor, int pageSize);
```

### 删除聊天室成员

```
/**
 * 删除聊天室成员，需要拥有者或者管理员权限
 * @param chatRoomId
 * @param members
 * @return
 * @throws HyphenateException
 */
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().removeChatRoomMembers(String chatRoomId, List<String> members);
```

### 聊天室黑名单

```
// 添加成员到黑名单，禁止成员继续加入聊天室，需要拥有者或者管理员权限
EMChatRoom chatroom = EMClient.getInstance().chatroomManager().blockChatroomMembers(String chatRoomId, List<String> members);

//将成员从黑名单种移除，需要拥有者或者管理员权限
EMChatRoom chatroom = EMClient.getInstance().chatroomManager().unblockChatRoomMembers(String chatRoomId, List<String> members);

//分页获取聊天室黑名单
List<String> blackList = EMClient.getInstance().chatroomManager().fetchChatRoomBlackList(String chatRoomId, int pageNum, int pageSize);
```

### 获取聊天室公告

```
EMClient.getInstance().chatroomManager().fetchChatRoomAnnouncement(roomId);
```

也可以通过聊天室监听接口来获取聊天室公告的消息推送。见[注册聊天室监听](http://docs-im.easemob.com/im/android/basics/chatroom#注册聊天室监听)

### 更新聊天室公告

```
EMClient.getInstance().chatroomManager().updateChatRoomAnnouncement(chatRoomId, announcement);
```

也可以通过聊天室监听接口来获取聊天室公告的消息推送。见[注册聊天室监听](http://docs-im.easemob.com/im/android/basics/chatroom#注册聊天室监听)

### 注册聊天室监听

在会话页面注册监听，来监听成员被踢和聊天室被删除。

```
EMClient.getInstance().chatroomManager().addChatRoomChangeListener(new EMChatRoomChangeListener(){

    @Override
    public void onChatRoomDestroyed(String roomId, String roomName) {
    
    }

    @Override
    public void onMemberJoined(String roomId, String participant) {                
    }

    @Override
    public void onMemberExited(String roomId, String roomName, String participant) {
        
    }

    @Override
    public void onMemberKicked(String roomId, String roomName, String participant) {
        
    }

    @Override
    public void onMuteListAdded(final String chatRoomId, final List<String> mutes, final long expireTime) {

    }

    @Override
    public void onMuteListRemoved(final String chatRoomId, final List<String> mutes) {

    }

     @Override
     public void onWhiteListAdded(final String chatRoomId, final List<String> whitelist){
        
     }  
       
     @Override
     public void onWhiteListRemoved(final String chatRoomId, final List<String> whitelist) {
         
     }

    @Override
    public void onAllMemberMuteStateChanged(final String chatRoomId, final boolean isMuted) {
        
    }

    @Override
    public void onAdminAdded(final String chatRoomId, final String admin) {

    }

    @Override
    public void onAdminRemoved(final String chatRoomId, final String admin) {

    }

    @Override
    public void onOwnerChanged(final String chatRoomId, final String newOwner, final String oldOwner) {

    }
    @Override
    public void onAnnouncementChanged(String chatRoomId, final String announcement) {
            
    }        
});
```

### 移除聊天室监听

```
EMClient.getInstance().chatroomManager().removeChatRoomChangeListener(chatroomListener)
```

-->