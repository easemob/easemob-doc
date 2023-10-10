# 好友管理


## 获取好友列表

获取好友的 username list，开发者需要根据 username 去自己服务器获取好友的详情。

```
List<String> usernames = EMClient.getInstance().contactManager().getAllContactsFromServer();
```

## 查找好友

SDK 不提供好友查找的服务，如需要查找好友，需要调用开发者自己服务器的用户查询接口。

为了保证查找到的好友可以添加，需要将开发者自己服务器的用户数据（用户的环信 ID），通过 SDK 的后台接口导入到环信服务器中。

## 添加好友

```
//参数为要添加的好友的username和添加理由
EMClient.getInstance().contactManager().addContact(toAddUsername, reason);
```

## 删除好友

```
EMClient.getInstance().contactManager().deleteContact(username);
```

## 同意好友请求

默认好友请求是自动同意的，如果要手动同意需要在初始化SDK时调用 `opptions.setAcceptInvitationAlways(false);` 。

```
EMClient.getInstance().contactManager().acceptInvitation(username);
```

## 拒绝好友请求

```
EMClient.getInstance().contactManager().declineInvitation(username);
```

## 监听好友状态事件

```
EMClient.getInstance().contactManager().setContactListener(new EMContactListener() {
   
   @Override
   public void onContactAgreed(String username) {
       //好友请求被同意
   }
   
   @Override
   public void onContactRefused(String username) {
       //好友请求被拒绝
   }
   
   @Override
   public void onContactInvited(String username, String reason) {
       //收到好友邀请
   }
   
   @Override
   public void onContactDeleted(String username) {
       //被删除时回调此方法
   }
   
   
   @Override
   public void onContactAdded(String username) {
       //增加了联系人时回调此方法
   }
});
```

## 黑名单

### 从服务器获取黑名单列表

```
EMClient.getInstance().contactManager().getBlackListFromServer();
```

### 从本地db获取黑名单列表

```
EMClient.getInstance().contactManager().getBlackListUsernames();
```

### 把用户加入到黑名单

```
//true和false的效果一样，都是我能给黑名单的中用户发消息，但是对方发给我时我是收不到的
EMClient.getInstance().contactManager().addUserToBlackList(username,true);
```

### 把用户从黑名单中移除

```
EMClient.getInstance().contactManager().removeUserFromBlackList(username);
```

## 获取同一账号在其他端登录的id

获取到该id 后可以用于不同端登录的账号之间互发消息，比如PC端与移动端可以互发消息。

```
selfIds = EMClient.getInstance().contactManager().getSelfIdsOnOtherPlatform();
```

