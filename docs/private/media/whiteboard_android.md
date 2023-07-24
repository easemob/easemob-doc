# Android集成互动白板

**注意：**`仅特定的私有化版本SDK支持白板功能.`

使用白板功能首先需要登录环信，登录成功之后才可以去调用api创建白板房间，创建成功之后会直接加入房间，不需要再去调用加入的api。

其他人可以通过房间名称或者通过创建成功之后返回的房间ID去加入白板房间。创建或者加入成功之后会返回对应白板房间的URL，在webview中去加载显示

## 创建白板房间

```
/**
     * \~chinese
     * 创建白板房间
     * @param user 用户名
     * @param token 用户的token
     * @param roomName 房间名
     * @param password 房间的密码
     * @param isInteractive 是否允许互动
     * @param callBack 请求完成的回调
     */
public void createWhiteboardRoom(final String user, final String token, final String roomName,
                                 final String password, final boolean isInteractive,
                                 final EMValueCallBack<EMWhiteboard> callBack) {}
```

## 通过房间名称加入白板房间

```
/**
     * \~chinese
     * 通过白板名称加入房间
     * @param user 用户名
     * @param token 用户的token
     * @param roomName 房间名
     * @param password 房间的密码
     * @param callBack 请求完成的回调
     */
    public void joinWhiteboardRoomWithName(final String user, final String token, final String roomName, final String password, final EMValueCallBack<EMWhiteboard> callBack) 
```

## 通过房间ID加入白板房间

```
/**
     * \~chinese
     * 通过白板id加入房间
     * @param user 用户名
     * @param token 用户的token
     * @param roomId 房间名
     * @param password 房间的密码
     * @param callBack 请求完成的回调
     */
    public void joinWhiteboardRoomWithId(final String user, final String token, final String roomId, final String password, final EMValueCallBack<EMWhiteboard> callBack)
```

## 通过房间ID修改白板互动权限

```
* \~chinese
     * 通过白板Id 修改白板操作权限
     * @param user  创建者的userId
     * @param roomId  房间Id
     * @param token 用户的token
     * @param isInteractive 是否开启交互权限
     * @param aServentIds 需要互动控制的成员
     * @param isAllInTeract 是否允许所有人交互
     * @param callBack 请求完成的回调
     *
     */
     public void updateWhiteboardRoomWithRoomId(final String user,final String roomId, final String token, final boolean isInteractive,final List<String> aServentIds,final boolean isAllInTeract, EMCallBack callBack){}
```

## 销毁白板房间

```
/**
     * \~chinese
     * 销毁白板房间
     * @param user 用户名
     * @param token 用户的token
     * @param roomId 房间id
     * @param callBack 请求完成的回调
     */
    public void destroyWhiteboardRoom(final String user, final String token, final String roomId, EMCallBack callBack)
```