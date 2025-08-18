# 自定义

你可以修改我们提供的 Callkit 源代码，对 CallKit 用户界面进行调整。

## 修改 UI 可配置项

`CallAppearance.swift` 是包含所有可配项的类。这些可配项都有默认值，如果要修改某些配置项，需要在初始化对应 UI 控件之前修改其中的属性，配置项才生效。// TODO：可以这么说吗？

下面示例展示如何修改消息内容显示：// TODO：下面示例展示如何修改通话界面显示？

```Swift
        // 改变头像圆角
        CallAppearance.avatarRadius = .extraSmall
        // 改变头像占位图
        CallAppearance.avatarPlaceHolder = UIImage(named: "avatar_placeholder")
        //整体替换资源 bundle
        CallAppearance.resourceBundle = Bundle.main
        //替换聊天背景图  // TODO：通话背景？
        CallAppearance.backgroundImage = UIImage(named: "chat_background")
```

## 修改原有资源

// TODO：添加描述，图片主要包含哪些图片，举一些例子。音频，我添加了呼叫声音，除了这些还有吗？
// TODO：国际化文件：也描述一下吧。
// TODO：可以替换文案吗？

主要包含有

- 图片  // TODO：图标和图片：例如，呼叫接听和挂断图标、扬声器、麦克风和摄像头图标等。
- 音频：例如，铃声文件。CallKit 支持发起呼叫时的声音、接收呼叫时的声音以及被挂断时的声音。铃声文件支持 MP3、WAV 等格式，建议铃声时长为 1-20 秒，文件大小不超过 1 MB。
- 国际化文件

![资源图](./DocumentationImages/resource_replace.png)

![资源图1](./DocumentationImages/resource_replace1.png)


## 3.修改业务可配置项

你可以开启 VoIP 通话和画中画功能以及设置呼叫超时时间（默认 30 秒）等。

- 开启 VoIP 通话：开启voip功能后会自动开启LiveCommunicationKit，需要在develop.apple.com申请证书时勾选
- 开启画中画：

如需进一步修改业务逻辑，请源码集成后修改。

```Swift
        let config = EaseCallUIKit.CallKitConfig()
        config.enableVOIP = true //开启voip功能后会自动开启LiveCommunicationKit，需要在develop.apple.com申请证书时勾选
        config.enablePIPOn1V1VideoScene = true //开启画中画，同时需要开启应用后台摄像头采集权限，详见[PictureInPicture.md](./PictureInPicture.md)。
        config.ringTimeOut = 30//默认呼叫超时时间
        CallKitManager.shared.setup(config)
```

