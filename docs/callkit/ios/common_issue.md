# 常见问题

## 兼容性问题

关于环信 CallKit 与系统电话或其它应用的兼容问题，你可以监听系统电话事件，调用 `CallKitManager.shared.hangup()` 方法判断是否需要挂断当前通话。

## 挂断无反应

若通话一方挂断而其他方没有反应，请联系技术支持获取日志检查是否有 `rtcEngine didOfflineOfUid:`。

## 通话无声音/无画面

如果通话无声音或无画面，请检查权限问题。iOS 15 及以上系统需要在 `Info.plist` 中添加`NSMicrophoneUsageDescription` 和 `NSCameraUsageDescription` 描述。若排除权限问题，请联系技术支持查询应用的音视频流状态。