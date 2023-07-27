# iOS集成互动白板

**注意：**`仅特定的私有化版本SDK支持白板功能.`

使用白板功能首先需要登录环信，登录成功之后才可以去调用api创建白板房间，创建成功之后会直接加入房间，不需要再去调用加入的api。

其他人可以通过房间名称或者通过创建成功之后返回的房间ID去加入白板房间。创建或者加入成功之后会返回对应白板房间的URL，在webview中去加载显示

## 创建白板房间

```
/**
 * \~chinese
 * 创建白板房间
 * @param aUsername         用户名
 * @param aToken            用户的token
 * @param aRoomName         房间名
 * @param aPassword         房间的密码
 * @param bInteract         是否允许互动
 * @param aCompletionBlock  请求完成的回调
 *
 * \~english
 * create room for whiteboard
 * @param aUsername         username
 * @param aToken            user's token
 * @param aRoomName         room name for whiteboard
 * @param aPassword         password for room
 * @param bInteract         weather allow members interact
 * @param aCompletionBlock  callback
 */
- (void)createWhiteboardRoomWithUsername:(NSString *)aUsername
                               userToken:(NSString *)aToken
                                roomName:(NSString *)aRoomName
                            roomPassword:(NSString *)aPassword
                                interact:(BOOL)aInteract
                              completion:(void(^)(EMWhiteboard *aWhiteboard, EMError *aError))aCompletionBlock;
```

## 通过房间名称加入白板房间

```
/**
 * \~chinese
 * 通过白板名称加入房间
 * @param aRoomName         房间名
 * @param aUsername         用户名
 * @param aToken            用户的token
 * @param aPassword         房间的密码
 * @param aCompletionBlock  请求完成的回调
 */
- (void)joinWhiteboardRoomWithName:(NSString *)aRoomName
                          username:(NSString *)aUsername
                         userToken:(NSString *)aToken
                      roomPassword:(NSString *)aPassword
                        completion:(void(^)(EMWhiteboard *aWhiteboard, EMError *aError))aCompletionBlock;
```

## 通过房间ID加入白板房间

```
/**
 * \~chinese
 * 通过白板id加入房间
 * @param aRoomId           房间id
 * @param aUsername         用户名
 * @param aToken            用户的token
 * @param aPassword         房间的密码
 * @param aCompletionBlock  请求完成的回调
 */
- (void)joinWhiteboardRoomWithId:(NSString *)aRoomId
                        username:(NSString *)aUsername
                       userToken:(NSString *)aToken
                    roomPassword:(NSString *)aPassword
                      completion:(void(^)(EMWhiteboard *aWhiteboard, EMError *aError))aCompletionBlock;
```

## 修改成员互动权限

白板创建者可以修改其他成员的互动权限，禁止互动的成员将无法操作白板。修改互动权限的api如下

```
/**
 * \~chinese
 * 修改白板的用户互动权限
 * @param aRoomId         房间Id
 * @param aToken            用户的token
 * @param aPassword         房间的密码
 * @param aInteract        是否允许互动，YES为允许互动，NO为不允许互动
 * @param aAll                   是否操作所有成员，YES时操作所有人，aServentIds不起作用
 * @param aServentIds      操作的成员数组,aAll为NO时有效
 * @param aCompletionBlock  请求完成的回调
 *
 * \~english
 * update whiteboard room interact
 * @param aRoomId         room Id
 * @param aUsername         username
 * @param aToken            user's token
 * @param aInteract         weather allow members interact
 * @param aAll                    weather update all members`s interact right.if YES,aServentIds is invalid.
 * @param aServentIds    array of members`s id.invalid when aAll is NO
 * @param aCompletionBlock  callback
 */
- (void)updateWhiteboardRoomWithRoomId:(NSString *)aRoomId
                              username:(NSString *)aUsername
                             userToken:(NSString *)aToken
                               intract:(BOOL)aInteract
                              allUsers:(BOOL)aAll
                            serventIds:(NSArray<NSString *>*)aServentIds
                            completion:(void(^)(EMError *aError))aCompletionBlock;
```

## 销毁白板房间

```
/**
 * \~chinese
 * 销毁白板房间
 * @param aUsername         用户名
 * @param aToken            用户的token
 * @param aRoomId           房间id
 * @param aCompletionBlock  请求完成的回调
 */
- (void)destroyWhiteboardRoomWithUsername:(NSString *)aUsername
                                userToken:(NSString *)aToken
                                   roomId:(NSString *)aRoomId
                               completion:(void(^)(EMError *aError))aCompletionBlock;
```