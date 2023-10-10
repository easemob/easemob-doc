# 多设备管理


## 其他端登录的设备ID

当PC端和手机端登录同一个账号时，在手机端可以通过特定方法获取到PC端的设备ID，该设备ID相当于特殊的好友Username，可以直接使用于聊天，使用方法与好友类似。

#### 接口

```
class EMContactManager:

    /**
     * 从服务器获取登录用户在其他设备上登录的ID
     *
     * @return 其它设备登陆的ID列表
     * @throws HyphenateException
     */
    public List<String> getSelfIdsOnOtherPlatform() throws HyphenateException
    
    /**
     * 异步操作，从服务器获取登录用户在其他设备上登录的ID
     *
     * @param callback 包含用户在其他设备上登录的ID
     */
    public void aysncGetSelfIdsOnOtherPlatform(final EMValueCallBack<List<String>> callback);
```

#### 使用示例

```
List<String> selfIds = EMClient.getInstance().contactManager().getSelfIdsOnOtherPlatform();
```

## 多设备事件回调

账号A同时在设备A和设备B上登录，账号A在设备A上进行一些操作，设备B上会收到这些操作对应的通知，具体说明如下：

#### 接口 EMMultiDeviceListener

```
interface EMMultiDeviceListener {
    /**
     * 好友已经在其他设备上被移除
     */
    int CONTACT_REMOVE = 2;

    /**
     * 好友请求已经在其他设备上被同意
     */
    int CONTACT_ACCEPT          = 3;

    /**
     * 好友请求已经在其他设备上被拒绝
     */
    int CONTACT_DECLINE         = 4;

    /**
     * 当前用户在其他设备加某人进入黑名单
     */
    int CONTACT_BAN           = 5;

    /**
     * 好友在其他设备被移出黑名单
     */
     int CONTACT_ALLOW         = 6;



    /**
     * 创建了群组
     */
    int GROUP_CREATE            = 10;

    /**
     * 销毁了群组
     */
    int GROUP_DESTROY           = 11;

    /**
     * 已经加入群组
     */
    int GROUP_JOIN              = 12;

    /**
     * 已经离开群组
     */
    int GROUP_LEAVE             = 13;

    /**
     * 发起群组申请
     */
    int GROUP_APPLY             = 14;

    /**
     * 同意群组申请
     */
    int GROUP_APPLY_ACCEPT      = 15;

    /**
     * 拒绝群组申请
     */
    int GROUP_APPLY_DECLINE     = 16;

    /**
     * 邀请群成员
     */
    int GROUP_INVITE            = 17; //

    /**
     * 同意群组邀请
     */
    int GROUP_INVITE_ACCEPT     = 18; //

    /**
     * 拒绝群组邀请
     */
    int GROUP_INVITE_DECLINE    = 19;

    /**
     * 将某人踢出群
     */
    int GROUP_KICK              = 20;

    /**
     * 加入群组黑名单
     */
    int GROUP_BAN               = 21; //加入群组黑名单

    /**
     * 移除群组黑名单
     */
    int GROUP_ALLOW             = 22;

    /**
     * 屏蔽群组
     */
    int GROUP_BLOCK             = 23;

    /**
     * 取消群组屏蔽
     */
    int GROUP_UNBLOCK           = 24;

    /**
     * 转移群主
     */
    int GROUP_ASSIGN_OWNER      = 25;

    /**
     * 添加管理员
     */
    int GROUP_ADD_ADMIN         = 26;

    /**
     * 移除管理员
     */
    int GROUP_REMOVE_ADMIN      = 27;

    /**
     * 禁言用户
     */
    int GROUP_ADD_MUTE          = 28;

    /**
     * 移除禁言
     */
    int GROUP_REMOVE_MUTE       = 29;

    /**
     * 多设备联系人事件
     */
    void onContactEvent(int event, String target, String ext);

    /**
     * 多设备群组事件
     */
    void onGroupEvent(int event, String target, List<String> usernames);
}
```

#### 使用示例

```
//注册监听
EMClient.getInstance().addMultiDeviceListener(new MyMultiDeviceListener());  ／／ class MyMultiDeviceListener implements EMMultiDeviceListener 

//撤销监听
EMClient.getInstance().removeMultiDeviceListener(myMultiDeviceListener);
```