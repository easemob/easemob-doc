# 最佳实践

## 初始化 ChatroomUIKit

初始化是使用 ChatroomUIKit 的必要步骤，需在所有接口方法调用前完成。如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

初始化 ChatroomUIKit 时，你可以传入 `option` 参数，设置各种选项。

```kotlin
 		val chatroomUIKitOptions = ChatroomUIKitOptions(
            chatOptions = ChatSDKOptions(enableDebug = true),
            uiOptions = UiOptions(
                targetLanguageList = listOf(currentLanguage),
                useGiftsInList = false,
            )
        )
```

## 登录 ChatroomUIKit

你可以通过使用工程中的用户对象并遵守 `UserInfoProtocol` 协议登录 ChatroomUIKit，示例代码如下：

```kotlin
class YourAppUser: UserInfoProtocol {
    var userId: String = "your application user id"
            
    var nickName: String = "you user nick name"
            
    var avatarURL: String = "you user avatar url"
            
    var gender: Int = 1
            
    var identity: String =  "you user level symbol url"
            
}
ChatroomUIKitClient.getInstance().login(YourAppUser, token, onSuccess = {}, onError = {code,error ->})
```

## 初始化聊天室视图

1. 获取聊天室列表，加入指定的聊天室。除此之外，你还可以在环信即时通讯云控制台上[创建聊天室](/product/enable_and_configure_IM.html#创建聊天室)，获取聊天室 ID。

2. 加载聊天室视图 `ComposeChatroom`，传入的参数包括聊天室 ID、布局参数、聊天室所有者的用户 ID 及一些选项。

```kotlin  
class ChatroomActivity : ComponentActivity(){
	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		setContent {
			ComposeChatroom(roomId = roomId,roomOwner = ownerInfo)
		}
	}
}
```

## 监听 ChatroomUIKit 事件和错误

你可以调用 `registerRoomEventsListener` 方法添加监听器用于监听 ChatroomUIKit 事件和错误。

```Kotlin
ChatroomUIKitClient.getInstance().registerRoomResultListener(this)
```