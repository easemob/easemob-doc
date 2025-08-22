# 自定义

你可以修改我们提供的 CallKit 源代码，对 CallKit 用户界面进行调整。

CallKit 的资源均放在 CallResource.bundle 文件中。

// TODO：添加图

## 修改 UI 配置项

// TODO：表格

`CallAppearance.swift` 是包含所有可配项的类。这些可配项都有默认值，如果要修改某些配置项，需要在初始化对应 UI 控件之前修改其中的属性，配置项才生效。

下面示例展示如何修改通话界面显示：

```Swift
        // 改变头像圆角
        CallAppearance.avatarRadius = .extraSmall
        // 改变头像占位图
        CallAppearance.avatarPlaceHolder = UIImage(named: "avatar_placeholder")
        //整体替换资源bundle
        CallAppearance.resourceBundle = Bundle.main
        //替换呼叫背景图
        CallAppearance.backgroundImage = UIImage(named: "chat_background")
```

## 修改原有资源

- 图片资源

|内容描述 | 详细说明 |
|---------|---------|
| 导航资源 | 导航相关图标，例如 back 和 boxes。|
| 背景图片 | 通话背景图等。 |
| 被叫弹窗 | phone_hang_mini.png、phone_pick_mini.png。 |
| 呼叫页面图标 | phone_hang、phone_pick、speaker_on、speaker_off、camera_on、camera_off、mic_on、mic_off。 |
| 其他资源 | person_add、network相关、语音音量相关图标等。 |

- 音频和国际化文件
  
| 资源类型 | 内容描述 | 详细说明 |
|---------|---------|---------|
| 音频资源 | 音频文件 | dialing.mp3（拨号音）、ringing.mp3（响铃音）、busy.mp3（忙音）<br/> CallKit 支持发起呼叫时的声音、接收呼叫时的声音以及被挂断时的声音。铃声文件建议支持 MP3、WAV 等格式，铃声时长为 1-20 秒，文件大小不超过 1 MB。 |
| 国际化文件 | 语言支持 | en（英文）、zh-Hans（简体中文） |

// TODO：上表统一调整格式

![img](/images/callkit/ios/call_resource_bundle.png)

## 3.修改业务可配置项

你可以开启 VoIP 通话和画中画功能以及设置呼叫超时时间（默认 30 秒）等。

- 开启 VoIP 功能后会自动开启 LiveCommunicationKit。关于上传 VoIP 服务证书，详见 [APNs 推送文档](/document/ios/push/push_apns.html#上传推送证书)。 
- 若开启画中画功能，同时需要开启应用后台摄像头采集权限。详见 [视频通话画中画文档](picture_in_picture.html)。
- 呼叫超时时间：单位为秒，默认为 30 秒。

```Swift
        let config = EaseCallUIKit.CallKitConfig()
        config.enableVOIP = true //开启voip功能后会自动开启LiveCommunicationKit，需要在develop.apple.com申请证书时勾选
        config.enablePIPOn1V1VideoScene = true //开启画中画，同时需要开启应用后台摄像头采集权限。
        config.ringTimeOut = 30//默认呼叫超时时间
        CallKitManager.shared.setup(config)
```

