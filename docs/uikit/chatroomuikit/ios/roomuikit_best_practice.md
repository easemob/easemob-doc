# 最佳实践

## 初始化 ChatroomUIKit

初始化是使用 ChatroomUIKit 的必要步骤，需在所有接口方法调用前完成。

初始化 ChatroomUIKit 时，你可以传入 `option` 参数，设置各种选项。

```Swift
let option = ChatroomUIKitInitialOptions.ChatOptions()
option.enableConsoleLog = true
option.autoLogin = true
let error = ChatroomUIKitClient.shared.setup(appKey,option: option)
```

## 登录 ChatroomUIKit

你可以通过使用工程中的用户对象并遵守 `UserInfoProtocol` 协议登录 ChatroomUIKit，示例代码如下：

```Swift
public final class YourAppUser: NSObject,UserInfoProtocol {
        
        public func toJsonObject() -> Dictionary<String, Any>? {
            ["userId":self.userId,"nickName":self.nickName,"avatarURL":self.avatarURL,"identity":self.identity,"gender":self.gender]
        }
        
        public var identity: String = ""//用户级别图像的 URL
        
        public var userId: String = <#T##String#>
        
        public var nickName: String = "Jack"
        
        public var avatarURL: String = "https://accktvpic.oss-cn-beijing.aliyuncs.com/pic/sample_avatar/sample_avatar_1.png"
        
        public var gender: Int = 1
        
    }
ChatroomUIKitClient.shared.login(user: YourAppUser(), token: "token", completion: <#T##(ChatError?) -> Void#>)
```

## 初始化聊天室视图

1. 获取聊天室列表，加入指定的聊天室。除此之外，你还可以在环信控制台上[创建聊天室](/product/enable_and_configure_IM.html#创建聊天室)，获取聊天室 ID。

2. 创建聊天室视图 `ChatroomView`，传入的参数包括聊天室 ID、布局参数、聊天室所有者的用户 ID 及一些选项。

:::tip
- 建议 ChatroomView 的宽度初始化为屏幕的宽度，高度不小于以下算式的值：屏幕高度 x 1/5 + 礼物气泡行高 x 2 + 54（底部工具栏的高度）。
- 对于有刘海屏的机型，ChatroomView 的高度为以上算式的值加上底部安全区域的高度。
:::

3. 添加视图。

```Swift
let options  = ChatroomUIKitInitialOptions.UIOptions()
options.bottomDataSource = self.bottomBarDatas()
// 实现显示礼物消息区域。
options.showGiftMessageArea = true
// 是否在聊天区域中显示礼物信息。
options.chatAreaShowGift = false
let roomView = ChatroomUIKitClient.shared.launchRoomView(roomId: self.roomId, frame: CGRect(x: 0, y: ScreenHeight/2.0, width: ScreenWidth, height: ScreenHeight/2.0), ownerId: "Chatroom's owner user id", options: options)
addSubView(roomView)
```

建议你将该视图添加在你的业务视图的上面，便于 ChatroomView 拦截和透传点击事件。例如，若你有播放视频的视图，需要将 ChatroomView 添加在该视图的上面。

## 监听 ChatroomUIKit 事件和错误

你可以调用 `registerRoomEventsListener` 方法添加监听器用于监听 ChatroomUIKit 事件和错误。

```Swift
ChatroomUIKitClient.shared.registerRoomEventsListener(listener：self)
```

## 参考

若要了解以上最佳实践的详情，请访问 [GitHub 仓库](https://github.com/easemob/ChatroomDemo/tree/dev/iOS/ChatroomDemo)。
