# 视频通话画中画（PiP）

## 功能概述

画中画（Picture-in-Picture，PiP）功能允许用户在视频通话时，将通话界面最小化为悬浮窗口，同时使用其他应用。该功能对于多任务处理场景尤其重要。

对于 PiP，注意 iOS 系统存在如下限制：
- iOS 15 及以上版本支持自定义 PiP。
- 需要用户手动触发 PiP，无法自动进入。
- 音频路由切换需要特殊处理：例如，如果其中群组一个用户关闭了摄像头，开发者需要特殊处理。

<ImageGallery :columns="3">
  <ImageItem src="/images/callkit/ios/1v1_video_float.png" title="一对一视频通话 - PiP" />
</ImageGallery>

## PiP 基本配置

1. 开启画中画功能。
   
   在 **Capabilities** 中启用 **Background Modes**，勾选 **Audio**, **AirPlay**, 和 **Picture in Picture**。

2. 摄像头后台权限。
   
    - 默认不允许后台访问摄像头。
    - 对于 VoIP 应用，在 **Background Modes** 中勾选 **Voice over IP (VoIP)**，支持 LiveCommunicationKit。若不勾选，采用厂商默认系统推送。
    - 若应用需要后台采集视频流，需要申请多任务相机访问权限（Multitasking Camera Access Entitlement）。iOS 系统版本对多任务相机访问权限的支持详见 [苹果官方文档](https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.avfoundation.multitasking-camera-access)。

![img](/images/callkit/ios/backgroundCameraAccess.png)

## 一对一视频通话 PiP

对于一对一视频通话 PiP，进入 PiP 时，切换到悬浮窗；退出 PiP 时，恢复通话页面全屏 UI，重新加载视频流，恢复交互控件。核心架构如下图所示：

![img](/images/callkit/ios/1v1_call_pip_flow.png)

UI 示意图如下所示：

<ImageGallery>
  <ImageItem src="/images/callkit/ios/1v1_video_call.png" title="视频通话" />
  <ImageItem src="/images/callkit/ios/1v1_call_pip.png" title="视频通话悬浮窗" />
</ImageGallery>

## 群组视频通话 PiP 实现方案

CallKit 未实现群组视频通话 PiP，你可以按照本节的推荐方案自行实现。与一对一通话相比，群组视频通话 PiP 的实现更为复杂，需要注意以下几方面：
- 多流管理：需要智能选择显示内容。避免频繁切换视频流，合理设置切换阈值：例如，3 秒内不反复切换主讲人。
- 性能优化：降低资源消耗。你可以提供用户手动固定选项：例如，固定主讲人。

推荐采用 **主讲人模式** 作为默认方案，这样可在保证体验的同时，有效控制资源消耗。对于高端设备，可考虑支持宫格模式，但需要严格的性能监控。

### 核心架构

<img src="/images/callkit/ios/group_call_pip.png" >

此外，你还可以实现群组视频通话的特殊需求，例如，多路视频流同时存在、需要智能选择显示内容以及焦点切换等。

### PiP 交互

下图为群组通话中的 PiP 交互示例。在该例中，PiP 窗口中显示主讲人、主讲人画面、群组通话人数以及相关操作按钮。你可以根据自己的业务决定 PiP 窗口采用主讲人模式或者多人模式。

<ImageGallery>
  <ImageItem src="/images/callkit/ios/group_call_pip_interaction.png" title="PiP 交互示例图" />
</ImageGallery>

### 显示模式

- （推荐）模式一：主讲人模式

```swift
class GroupPIPManager {
    var displayMode: DisplayMode = .activeSpeaker
    var pinnedUserId: String?  // 固定显示的用户
    
    func selectVideoStream() -> VideoStream {
        switch displayMode {
        case .activeSpeaker:
            return getActiveSpeakerStream()
        case .pinned:
            return getPinnedUserStream(pinnedUserId)
        case .recentSpeaker:
            return getRecentSpeakerStream()
        }
    }
}
```

- 模式二：宫格模式。该模式对性能要求较高。

```swift
// 最多显示4路视频
func setupGridLayout(streams: [VideoStream]) {
    let maxDisplay = min(streams.count, 4)
    for i in 0..<maxDisplay {
        addVideoToGrid(streams[i], position: i)
    }
}
```

### PiP 状态智能切换

可以基于 RTC SDK 中音频焦点管理功能实现 PiP 状态的智能切换。

```swift
    public func rtcEngine(_ engine: AgoraRtcEngineKit, reportAudioVolumeIndicationOfSpeakers speakers: [AgoraRtcAudioVolumeInfo], totalVolume: Int)
```

### 视频渲染优化

对于群组通话 PiP 视频渲染，需在 `PixelBufferRenderView.swift` 中查找以下两个回调：

- `onCapture`：获取本地设备采集到的视频数据。
- `onRenderVideoFrame:uid:channelId:`：获取远端发送的视频数据。

```swift
    //本地视频流
    public func onCapture(_ videoFrame: AgoraOutputVideoFrame, sourceType: AgoraVideoSourceType) -> Bool
    //远端视频流 
    public func onRenderVideoFrame(_ videoFrame: AgoraOutputVideoFrame, uid: UInt, channelId: String) -> Bool
```

### 群组成员状态同步

若从 [视频渲染优化](#视频渲染优化) 一节中的 `onCapture` 和 `onRenderVideoFrame:uid:channelId:` 回调中判断 `callInfo` 中的 `type` 为群组，可结合音频回调 `reportAudioVolumeIndicationOfSpeakers` 进行主讲人渲染。

### PiP 性能优化

目前，群组视频通话页面出现时，不同用户数下使用 `AgoraRtcVideoCanvas` 渲染群组画面，每增加 2 个用户会降低本地渲染一个画质级别，被放大的用户本地渲染画质会变为高质量。

| 优化项 | 全屏模式 | PiP 模式 |
| :------------------- | :----- | :------------ |
| 视频分辨率 | 720p/1080p | 360p |
| 帧率 | 30 fps | 15 fps |
| 显示人数 | 全部 | 最多 4 人或只显示主讲人|


