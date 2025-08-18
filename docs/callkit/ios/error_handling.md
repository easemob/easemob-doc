# 问题处理

## 错误类型

使用 CallKit 实现通话过程中，出现的错误包含以下几类：

- 即时通讯 IM SDK 错误，详见 [错误码](https://doc.easemob.com/document/ios/error.html)。
- 声网 RTC SDK 错误，详见 [错误码](https://doc.shengwang.cn/doc/rtc/ios/error-code)。
- CallKit 相关错误，包括状态错误、参数错误、信令错误和未知错误。

```Swift
@objc public enum CallBusinessErrorCode: UInt {
    case state// 状态错误
    case param// 参数错误
    case signaling// 信令错误
    case unknown// 未知错误
}
```

| CallKit 错误类型       | 描述   | 
| :--------- | :----- | 
| 状态错误<br/>（state）       | 通话状态错误：<br/> - "A call is already in progress"：当前已有通话在进行中。<br/> - "MultiCallParticipantsController is already presented"：多人通话邀请界面已展示，表示重复调用群组通话 API。<br/> - "Call already in progress with different group ID"：当前已有通话在进行中且群组 ID 不同，表示点击多人通话页面右上角时，呼叫的群组 ID 有误或者中途被其它地方改变。    | 
| 参数错误<br/>（param）       | 主要为呼叫 API 调用参数错误为空等。    | 
| 信令错误<br/>（signaling）       | 大多为信令回复的方法中某些参数错误，例如，对方发的信令里缺少某种参数。   | 
| 未知错误<br/>（unknown）       | 错误原因未知。   | 

## 错误处理

CallKit 提供通话相关事件监听接口。你可以调用 `addListener` 设置监听，获取通话相关事件，进行相应处理。

```Swift
        //添加监听
        CallKitManager.shared.addListener(self)

extension MainViewController: CallServiceListener {
    // 出现错误
    func didOccurError(error: CallError) {
//        DispatchQueue.main.async {
//            self.showToast(toast: "Occur error:\(error.localizedDescription) on module:\(module)")
//        }
        switch error {//Swift 处理方式
        case .im(.invalidURL):
            print("Invalid URL")
        case .rtc(.invalidToken):
            print("Invalid Token")
        case .business(.state):
            print("State error")
        case .business(.param):
            print("Param error")
        default:
            // 注意这里要通过 error.error.message 访问
            print("Other error: \(error.error.message)")
        }
//        switch error.module {//OC 处理方式
//        case .im:
//            switch error.getIMError() {
//            case .invalidURL:
//                print("")
//            default:
//                break
//            }
//        case .rtc:
//            switch error.getRTCError() {
//            case .invalidToken:
//                print("")
//            default:
//                break
//            }
//        case .business:
//            switch error.getCallBusinessError() {
//            case .state:
//                print("")
//            case .param:
//                print("")
//            case .signaling:
//                print("")
//            default:
//                break
//            }
//        default:
//            break
//        }
    }
        // 通话结束原因更新
    func didUpdateCallEndReason(message: ChatMessage) {
        print("didUpdateCallEndReason: \(String(describing: message.ext))")
        NotificationCenter.default.post(name: Notification.Name("didUpdateCallEndReason"), object: message)
    }
    // 远程用户加入通话
    func remoteUserDidJoined(userId: String, uid: UInt, channelName: String, type: CallType) {
        
    }
    // 远程用户离开通话
    func remoteUserDidLeft(userId: String, uid: UInt, channelName: String, type: CallType) {
        
    }
    
}

```

## 获取日志

- 日志中携带 `EaseCallKit Log:` 的所有内容均为 CallKit 日志。你可以通过查看日志进行代码问题排查。
- 线上获取 SDK 日志，需要设备在登录状态下联系环信技术支持。技术支持获取到线上设备的日志，排查线上用户的问题。
