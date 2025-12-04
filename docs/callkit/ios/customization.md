# 自定义

你可以修改我们提供的 CallKit 源代码，对 CallKit 用户界面进行调整。

## 修改 UI 配置项

`CallAppearance.swift` 是包含所有可配项的类。这些可配项都有默认值，如果要修改某些配置项，需要在初始化对应 UI 控件之前修改其中的属性，配置项才生效。

| 配置项 | 描述 |
| :------------------- | :----- | 
| `avatarRadius` | 修改头像圆角。 |
| `avatarPlaceHolder` | 修改头像占位图。 |
| `resourceBundle` | 整体替换资源 bundle。 |
| `backgroundImage` | 替换呼叫背景图。  |

## 修改原有资源

CallKit 的资源均放在 `CallResource.bundle` 文件中。

![img](/images/callkit/ios/call_resource_bundle.png)

- 图片资源

| 资源 | 描述 |
| :------------------- | :----- |
| 导航资源 | 导航相关图标，例如 back 和 boxes。|
| 背景图片 | 通话背景图 bg.png 等。 |
| 被叫弹窗 | 例如，phone_hang_mini.png、phone_pick_mini.png。 |
| 呼叫页面图标 | 例如，phone_hang、phone_pick、speaker_on、speaker_off、camera_on、camera_off、mic_on、mic_off、flip_front、flip_back 等。 |
| 其他资源 | 例如，person_add.png、网络相关 network_xxx.png、speaking.png 讲话中相关图标等。 |

- 音频资源
  
| 资源 | 描述 |
| :----- | :---------- |
| 音频文件 | - dialing.mp3：拨号声音。 <br/> - ringing.mp3：响铃声音。<br/> - busy.mp3：忙音。<br/>铃声文件建议为 MP3、WAV 等格式，铃声时长为 1-20 秒，文件大小不超过 1 MB。 |

- 国际化资源
  
| 资源 | 描述 |
| :------------------- | :----- |
| 国际化语言 | en：英文；zh-Hans：简体中文。 |

## 修改业务可配置项

你可以修改以下业务可配项：

- 开启 VoIP 功能后会自动开启 LiveCommunicationKit。关于上传 VoIP 服务证书，详见 [APNs 推送文档](/document/ios/push/push_apns.html#上传推送证书)。 
- 若开启画中画功能，同时需要开启应用后台摄像头采集权限。详见 [视频通话画中画文档](picture_in_picture.html)。
- 呼叫超时时间：单位为秒，默认为 30 秒。

```swift
        let config = EaseCallUIKit.CallKitConfig()
        config.enableVOIP = true //开启 VoIP 功能后会自动开启 LiveCommunicationKit，需要在 develop.apple.com 申请证书时勾选。
        config.enablePIPOn1V1VideoScene = true //开启画中画，同时需要开启应用后台摄像头采集权限。
        config.ringTimeOut = 30//默认呼叫超时时间。
        CallKitManager.shared.setup(config)
```

