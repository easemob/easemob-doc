# 常见问题

## 1. 兼容性问题

关于环信 CallKit 与系统电话或其它应用的兼容问题，你可以监听系统电话事件，调用 `CallKitManager.shared.hangup()` 方法判断是否需要挂断当前通话。

## 2. 好友检查

默认情况下，环信 CallKit 支持陌生人之间进行通话，即无需添加好友即可通话。若在即时通讯 IM 控制台 [开启了好友检查](/product/console/basic_user.html#好友关系检查)，会导致非好友不能通过 CallKit 进行一对一通话，群组音视频通话信令也会受影响（邀请使用群定向消息，其他信令均为单聊消息）。建议不开启好友检查，后续 SDK 迭代会优化。

## 3. 通话无声音/无画面

如果通话无声音或无画面，请检查权限问题。iOS 15 及以上系统需要在 `Info.plist` 中添加`NSMicrophoneUsageDescription` 和 `NSCameraUsageDescription` 描述。若排除权限问题，请联系技术支持查询应用的音视频流状态。

## 4. 退出 IM SDK 账号相关

登出 IM 账号的时候需要调用 `CallKitManager.shared.cleanUserDefaults()` 方法清理 CallKit 相关的持久化数据，这些数据在 app 在后台或者锁屏时供 CallKit 通信加入 RTC 频道使用。

