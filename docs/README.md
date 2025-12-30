---
home: true
title: 首页
heroText: false
tagline: false
products:
  - link: "/product/introduction.html"
    text: 产品概述
  - link: "/product/pricing_policy.html"
    text: 产品价格
  - link: "/product/product_dynamics.html"
    text: 产品动态
  - link: "/document/android/releasenote.html"
    text: 最新发版
  - link: "/product/limitation.html"
    text: 使用限制
  - link: "https://www.easemob.com/protocol"
    text: 隐私协议
  - link: "/product/security_best_practices.html"
    text: 安全最佳实践
  - link: "https://rte-src.vulbox.com/"
    text: 安全响应中心  
    target: '_blank'
starter:
  - title: "入门指引"
    desc: "了解接入环信即时通讯 IM SDK、单群聊 UIKit 和 CallKit 的整个流程。"
    platform:
      - icon: /guide/sdk.svg
        link: /document/android/beginner_guide.html
        text: SDK
      - icon: /guide/uikit.svg
        link: /uikit/chatuikit/android/beginner_guide.html
        text: UIKit 
      - icon: /guide/callkit.svg
        link: /callkit/android/beginner_guide.html
        text: CallKit
  - title: "SDK 快速开始"
    desc: "选择合适的 SDK 构建即时通讯应用，点击快速开始按钮快速实现即时通讯消息收发。"
    platform:
      - icon: /sdk/android.svg
        link: /document/android/quickstart.html
        text: Android
      - icon: /sdk/iOS.svg
        link: /document/ios/quickstart.html
        text: iOS 
      - icon: /sdk/web.svg
        link: /document/web/quickstart.html
        text: Web
      - icon: /sdk/applet.svg
        link: /document/applet/wechat.html
        text: 小程序/Uniapp
      - icon: /sdk/harmonyos.svg
        link: /document/harmonyos/quickstart.html
        text: HarmonyOS 
      - icon: /sdk/flutter.svg
        link: /document/flutter/quickstart.html
        text: Flutter
      - icon: /sdk/react.svg
        link: /document/react-native/quickstart.html
        text: React Native
      - icon: /sdk/unity.svg
        link: /document/unity/quickstart.html
        text: Unity
      - icon: /sdk/windows.svg
        link: /document/windows/quickstart.html
        text: Windows
  - title: "Demo 体验" 
    desc: "点击“Demo 体验”按钮立即体验环信 IM 即时通讯功能。"
    platform:
      - icon: /sdk/demo_list.svg
        link: "https://doc.easemob.com/product/demo.html"
        text: Demo 体验 
  - title: "服务端 API"
    desc: "可通过 RESTful API 构建即时通讯应用，点击“REST”按钮快速实现即时通讯消息收发等功能。"
    platform:
      - icon: /sdk/rest.svg
        link: /document/server-side/overview.html
        text: REST
  - title: "单/群聊 UIKit"
    desc: "选择合适的 UIKit 构建即时通讯应用，点击各客户端按钮了解单群聊 UIKit 主要功能介绍。"
    platform:
      - icon: /sdk/android.svg
        link: /uikit/chatuikit/android/chatuikit_overview.html
        text: Android
      - icon: /sdk/iOS.svg
        link: /uikit/chatuikit/ios/chatuikit_overview.html
        text: iOS 
      - icon: /sdk/web.svg
        link: /uikit/chatuikit/web/chatuikit_overview.html
        text: Web
      - icon: '/sdk/harmonyos.svg'
        link: /uikit/chatuikit/harmonyos/chatuikit_overview.html
        text: 'HarmonyOS'  
      - icon: /sdk/uniapp.svg
        link: /uikit/chatuikit/uniapp/chatuikit_overview.html
        text: Uniapp
      - icon: /sdk/flutter.svg
        link: /uikit/chatuikit/flutter/chatuikit_overview.html
        text: Flutter  
      - icon: /sdk/react.svg
        link: /uikit/chatuikit/react-native/chatuikit_overview.html
        text: React Native
  - title: "聊天室 UIKit"
    desc: "选择合适你的 UIKit 构建即时通讯应用，点击各客户端按钮了解聊天室 UIKit 主要功能介绍。"
    platform:
      - icon: /sdk/android.svg
        link: /uikit/chatroomuikit/android/roomuikit_overview.html
        text: Android
      - icon: /sdk/iOS.svg
        link: /uikit/chatroomuikit/ios/roomuikit_overview.html
        text: iOS 
      - icon: /sdk/web.svg
        link: /uikit/chatroomuikit/web/roomuikit_integrated.html
        text: Web
      - icon: /sdk/flutter.svg
        link: /uikit/chatroomuikit/web/roomuikit_overview.html
        text: Flutter
      - icon: /sdk/react.svg
        link: /uikit/chatroomuikit/flutter/roomuikit_overview.html
        text: React Native
  - title: "CallKit" 
    desc: "选择 CallKit 构建音视频功能，点击各客户端按钮了解 CallKit 主要功能介绍。"
    platform:
      - icon: /sdk/android.svg
        link: /callkit/android/product_overview.html
        text: Android
      - icon: /sdk/iOS.svg
        link: /callkit/ios/product_overview.html
        text: iOS  
      - icon: /sdk/web.svg
        link: /callkit/web/product_overview.html
        text: Web
  - title: "增值服务" 
    desc: "选择合适的增值服务构建内容审核、实时音视频、消息翻译、即时推送等功能，点击对应按钮了解主要功能介绍。"
    platform:
      - icon: /sdk/check_texts.svg
        link: /value-added/moderation/moderation_overview.html
        text: 内容审核
      - icon: /sdk/video.svg
        link: /callkit/android/product_overview.html
        text: 实时音视频
      - icon: /sdk/translation.svg
        link: /uikit/chatuikit/web/chatfeature_message.html#消息翻译
        text: 消息翻译
      - icon: /sdk/instant.svg
        link: /value-added/push/push_overview.html
        text: 即时推送  
projects:
  - title: SDK/服务端功能
    features:
      - title: 消息和会话
        icon: /feature/message.svg
        contexts:
          - text: 发送消息
            desc: 在单聊、群聊和聊天室中发送各种类型的消息，包括文本消息、图片、语音、视频、文件消息、位置消息、透传消息、自定义消息、合并消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_send.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_send.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_send.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_send.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS
                link: /document/harmonyos/message_send.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_send.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_send.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_send.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_send.html
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/message.html#发送消息  
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/message_single.html
          - text: 接收消息
            desc: 在单聊、群聊和聊天室中接收各种类型的消息，包括文本消息、图片、语音、视频、文件消息、位置消息、透传消息、自定义消息、合并消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_receive.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_receive.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_receive.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_receive.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS
                link: /document/harmonyos/message_receive.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_receive.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_receive.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_receive.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_receive.html
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/message.html#接收消息    
          - text: 获取消息
            desc: 从环信消息服务器获取漫游消息，或者从本地获取消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_retrieve.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_retrieve.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_retrieve.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_retrieve.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS
                link: /document/harmonyos/message_retrieve.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_retrieve.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_retrieve.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_retrieve.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_retrieve.html
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/conversation.html  
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/message_historical.html
          - text: 撤回消息
            desc: 发送方可以撤回一条发送成功的消息，包括已经发送的历史消息，离线消息或漫游消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_recall.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_recall.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_recall.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_recall.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_recall.html 
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_recall.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_recall.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_recall.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_recall.html
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/message.html#撤回消息  
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/message_recall_single.html
          - text: 修改消息
            desc: 修改单聊或群组聊天会话中已经发送成功的文本消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_modify.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_modify.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_modify.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_modify.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_modify.html    
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_modify.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_modify.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_modify.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_modify.html
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/message_modify.html       
          - text: 消息回执
            desc: 单聊会话支持消息送达回执、会话已读回执和消息已读回执。群聊会话只支持消息已读回执。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_receipt.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_receipt.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_receipt.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_receipt.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_receipt.html   
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_receipt.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_receipt.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_receipt.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_receipt.html
          - text: 搜索消息
            desc: 支持搜索本地数据库中除命令消息之外的所有类型的消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_search.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_search.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_search.html   
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_search.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_search.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_search.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_search.html
          - text: 表情回复
            desc: 消息表情回复（“Reaction”）功能，即用户可以在单聊和群聊中对消息添加、删除表情。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/reaction.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/reaction.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/reaction.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/reaction.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/reaction.html 
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/reaction.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/reaction.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/reaction.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/reaction.html
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/reaction_add.html 
          - text: 转发消息
            desc: 转发消息即将会话中发送成功或收到的消息转发给别人，支持转发单条消息和多条消息（合并消息）。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_forward.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_forward.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_send.html#发送合并消息
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_send.html#发送合并消息
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_forward.html   
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_forward.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_forward.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_forward.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_forward.html
          - text: 导入/插入消息
            desc: 批量导入消息到数据库或在本地会话中插入一条消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_import_insert.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_import_insert.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_import_insert.html   
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_import_insert.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_import_insert.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_import_insert.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_import_insert.html
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/conversation.html#插入消息
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/message_import_single.html
          - text: 更新消息
            desc: 更新本地数据库中的消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_update.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_update.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_update.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_update.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_update.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_update.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_update.html
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/conversation.html  
          - text: 删除消息
            desc: 单向删除服务端以及本地的历史消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_delete.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_delete.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_delete.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_delete.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_delete.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_delete.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_delete.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_delete.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_delete.html
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/conversation.html  
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/message_delete_roam_single_msgid.html
          - text: 定向消息
            desc: 发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_target.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_target.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_target.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_target.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_target.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_target.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_target.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_target.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_target.html 
          - text: 消息扩展
            desc: 当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_extension.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_extension.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_extension.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_extension.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_extension.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_extension.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_extension.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_extension.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_extension.html         
          - text: 置顶消息
            desc: 将会话中的消息固定在会话顶部，方便会话中的所有用户快速查看重要消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_pin.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_pin.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_pin.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_pin.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_pin.html   
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_pin.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_pin.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_pin.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_pin.html 
          - text: 消息审核（举报）
            desc: 你的用户可以在客户端举报违规消息。当服务器收到举报消息后，会将举报消息存储到数据库，并在环信控制台展示。你可在环信控制台查看举报记录，并进行相应处理。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/moderation.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/moderation.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/moderation.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/moderation.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/moderation.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/moderation.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/moderation.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/moderation.html
          - text: 消息只投在线
            desc: 只将消息投递给在线用户。若接收方不在线，则无法收到消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_deliver_only_online.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_deliver_only_online.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_deliver_only_online.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/message_deliver_only_online.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_deliver_only_online.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_deliver_only_online.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_deliver_only_online.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_deliver_only_online.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_deliver_only_online.html      
          - text: 会话列表
            desc: 支持从服务端和本地获取会话列表。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/conversation_list.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/conversation_list.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/conversation_list.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/conversation_list.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/conversation_list.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/conversation_list.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/conversation_list.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/conversation_list.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/conversation_list.html
          - text: 会话未读数
            desc: 支持查看本地所有会话或指定会话的未读消息数，并针对会话的未读消息数清零。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/conversation_unread.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/conversation_unread.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/conversation_unread.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/conversation_unread.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/conversation_unread.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/conversation_unread.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/conversation_unread.html
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/conversation.html#获取会话中的未读消息计数   
          - text: 本地会话
            desc: Web SDK 内部使用 IndexedDB 在本地数据库中保存单聊和群聊会话，通过 LocalCache 模块对本地会话数据进行管理。
            sdks:
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/conversation_local.html        
          - text: 置顶会话
            desc: 将单聊或群聊会话固定在会话列表的顶部，方便用户查找。支持置顶、取消置顶会话和从服务端获取置顶会话列表。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/conversation_pin.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/conversation_pin.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/conversation_pin.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/conversation_pin.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/conversation_pin.html    
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/conversation_pin.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/conversation_pin.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/conversation_pin.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/conversation_pin.html
          - text: 会话标记
            desc: 对单聊和群聊会话添加标记，支持标记和取消标记会话以及根据标记查询服务器或本地会话。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/conversation_mark.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/conversation_mark.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/conversation_mark.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/conversation_mark.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/conversation_mark.html   
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/conversation_mark.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/conversation_mark.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/conversation_mark.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/conversation_mark.html
          - text: 删除会话
            desc: 单向删除服务端或本地的会话及其历史消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/conversation_delete.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/conversation_delete.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/conversation_delete.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/conversation_delete.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/conversation_delete.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/conversation_delete.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/conversation_delete.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/conversation_delete.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/conversation_delete.html  
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/conversation.html#删除会话
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/conversation_delete.html
      - title: 群组和聊天室
        icon: /feature/group.svg
        contexts:
          - text: 群组创建和管理
            desc: 支持创建和解散群组、获取群组详情、获取群成员列表和群组列表、查询用户加入的群组数量、屏蔽和解除屏蔽群消息以及监听群组事件。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/group_manage.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/group_manage.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/group_manage.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/group_manage.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/group_manage.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/group_manage.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/group_manage.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/group_manage.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/group_manage.html  
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/group_create.html   
          - text: 群成员管理
            desc: 支持加入、退出群组、群组白名单、黑名单、禁言和设置群成员的自定义属性。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/group_members.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/group_members.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/group_members.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/group_members.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/group_members.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/group_members.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/group_members.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/group_members.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/group_members.html  
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/group.html#群成员管理 
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/group_member_add_single.html   
          - text: 群组属性管理
            desc: 支持修改群组名称及描述、获取和更新群组公告、管理群共享文件和更新群扩展字段。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/group_attributes.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/group_attributes.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/group_attributes.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/group_attributes.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/group_attributes.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/group_attributes.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/group_attributes.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/group_attributes.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/group_attributes.html  
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/group.html#修改群组信息 
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/group_modify.html     
          - text: 聊天室创建和管理
            desc: 支持创建和加入聊天室、获取聊天室详情、退出和解散聊天室、更新聊天室成员人数以及监听聊天室事件。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/room_manage.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/room_manage.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/room_manage.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/room_manage.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/room_manage.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/room_manage.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/room_manage.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/room_manage.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/room_manage.html  
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/chatroom.html
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/chatroom_create.html    
          - text: 聊天室成员管理
            desc: 支持加入和退出聊天室、聊天室白名单、黑名单、禁言、以及监听聊天室事件等功能。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/room_members.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/room_members.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/room_members.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/room_members.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/room_members.html    
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/room_members.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/room_members.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/room_members.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/room_members.html 
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/chatroom.html#加入聊天室
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/chatroom_member_add_single.html
          - text: 聊天室属性管理
            desc: 管理聊天室基本属性，包括聊天室名称、描述和公告，以及自定义属性。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/room_attributes.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/room_attributes.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/room_attributes.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/room_attributes.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/room_attributes.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/room_attributes.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/room_attributes.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/room_attributes.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/room_attributes.html 
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/chatroom.html#修改聊天室信息
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/chatroom_announcement_get.html
          - text: 子区管理
            desc: 支持创建、解散、加入、退出子区，修改子区名称、获取子区详情和子区成员列表和子区列表，获取子区中最新一条消息以及监听子区事件。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/thread.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/thread.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/thread.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/thread.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/thread.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/thread.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/thread.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/thread.html 
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/group_thread_create.html
          - text: 子区消息管理
            desc: 支持发送和接收子区消息、撤回子区消息和获取子区消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/thread_message.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/thread_message.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/thread_message.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/thread_message.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/thread_message.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/thread_message.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/thread_message.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/thread_message.html                        
      - title: 用户
        icon: /feature/user.svg
        contexts:
          - text: 用户体系(REST 端)
            desc: 支持注册、删除用户、获取用户详情、修改用户密码、获取用户在线状态和获取指定账号的在线登录设备列表。
            sdks:
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/account_register_open.html
          - text: 用户属性
            desc: 设置和获取用户属性，例如用户昵称、头像、邮箱、电话、性别、签名、生日等。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/userprofile.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/userprofile.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/userprofile.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/userprofile.html     
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/userprofile.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/userprofile.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/userprofile.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/userprofile.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/userprofile.html 
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/user_attribute_set.html  
          - text: 用户关系
            desc: 添加和删除好友、设置好友备注、获取好友列表以及好友黑名单管理功能。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/user_relationship.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/user_relationship.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/user_relationship.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/user_relationship.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/user_relationship.html   
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/user_relationship.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/user_relationship.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/user_relationship.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/user_relationship.html 
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/user_friend_add.html 
          - text: 用户在线状态订阅
            desc: 订阅和查询用户的在线状态（即 Presence），包含用户的在线、离线以及自定义状态。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/presence.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/presence.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/presence.html
              - icon: /sdk/applet.svg
                text: 小程序
                link: /document/applet/presence.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/presence.html  
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/presence.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/presence.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/presence.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/presence.html 
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/presence_set.html               
      - title: 推送
        icon: /feature/push.svg
        contexts:
          - text: 离线推送
            desc: 支持集成第三方消息推送服务，包括 FCM、APNs、华为、荣耀、小米、OPPO、vivo 和魅族。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/push/push_overview.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/push/push_overview.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/push/push_overview.html
              - icon: /sdk/uniapp.svg
                text: uni-app
                link: /document/applet/push/uniapp_push.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/push/push_overview.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/push/push_overview.html  
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/push_information_bind_unbind.html 
          - text: 即时推送
            desc: 即时推送服务的应用场景包括系统消息通知、活动促销营销、运营促活推送、社交互动通知、以及内容订阅推送等，覆盖谷歌、华为、小米、魅族、OPPO、vivo 等主流手机厂商通道。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /value-added/push/push_integration_note_android.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /value-added/push/push_integration_note_ios.html 
              - icon: /sdk/rest.svg
                text: REST
                link: /value-added/push/push_api_call_limitation.html
      - title: 其他
        icon: /feature/api-server.svg
        contexts:
          - text: Token 鉴权
            link: /document/server-side/easemob_app_token.html
          - text: 回调
            link: /document/server-side/callback_presending.html
          - text: 多设备管理
            link: /document/server-side/callback_login_logout.html 
          - text: 用户全局禁言
            link: /document/server-side/user_global_mute_overview.html                                      
  - title: UIKit
    features:
      - title: 单/群聊
        icon: /feature/uikit.svg
        contexts:
          - text: 会话
            desc: 展示当前用户的所有会话并且提供会话相关功能，支持自定义标题栏、自定义会话布局等。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_conversation.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatuikit_advancedusage.html#会话列表页面
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatuikit/web/chatuikit_conversation.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS
                link: /uikit/chatuikit/harmonyos/chatuikit_conversation.html 
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatuikit/flutter/chatuikit_conversation.html
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatuikit/react-native/chatuikit_conversation.html
          - text: 消息
            desc: 指用户可以引用一条已发送的消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_message.html#消息引用
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_message.html#消息引用
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatuikit/web/chatfeature_message.html#消息引用
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS
                link: /uikit/chatuikit/harmonyos/chatfeature_message.html#消息引用    
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatuikit/flutter/chatfeature_message.html#消息引用
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatuikit/react-native/chatfeature_message.html#消息引用
          - text: 群组
            desc: 展示通讯录列表，包括添加联系人，好友申请列表入口，联系人列表等。支持自定义联系人列表和联系人事件监听。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_contactlist.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatuikit_advancedusage.html#联系人列表页面
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatuikit/web/chatuikit_contactlist.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS
                link: /uikit/chatuikit/harmonyos/chatuikit_contactlist.html   
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatuikit/flutter/chatuikit_contactlist.html
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatuikit/react-native/chatuikit_contactlist.html
          - text: 联系人
            desc: 展示通讯录列表，包括添加联系人，好友申请列表入口，联系人列表等。支持自定义联系人列表和联系人事件监听。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_contactlist.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatuikit_advancedusage.html#联系人列表页面
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatuikit/web/chatuikit_contactlist.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS
                link: /uikit/chatuikit/harmonyos/chatuikit_contactlist.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatuikit/flutter/chatuikit_contactlist.html
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatuikit/react-native/chatuikit_contactlist.html
      - title: 聊天室
        icon: /feature/uikit-chatroom.svg
        contexts:
          - text: 聊天室管理
            desc: 支持创建聊天室、离开聊天室和解散聊天室。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatroomuikit/android/roomfeature_common.html#创建聊天室
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatroomuikit/ios/roomfeature_common.html#创建聊天室
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatroomuikit/web/roomfeature_common.html#创建聊天室
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatroomuikit/flutter/roomfeature_common.html#创建聊天室
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatroomuikit/react-native/roomfeature_common.html#创建聊天室
          - text: 弹幕和打赏
            desc: 用户可在聊天室中向其他成员发送文字和表情的消息，也可以通过赠送虚拟礼物，向聊天室中的主播或其他用户表达赞赏或者支持。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatroomuikit/android/roomfeature_common.html#发送弹幕
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatroomuikit/ios/roomfeature_common.html#发送弹幕
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatroomuikit/web/roomfeature_common.html#发送弹幕
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatroomuikit/flutter/roomfeature_common.html#发送弹幕   
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatroomuikit/react-native/roomfeature_common.html#发送弹幕  
          - text: 禁言
            desc: 聊天室所有者可以在聊天室中对某个特定的成员禁言，通常是对违反聊天室规则、发表不当言论或不断干扰聊天室秩序的成员所采取的一种惩罚。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatroomuikit/android/roomfeature_member.html#禁言成员
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatroomuikit/ios/roomfeature_member.html#禁言成员
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatroomuikit/web/roomfeature_member.html#禁言成员
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatroomuikit/flutter/roomfeature_member.html#禁言成员
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatroomuikit/react-native/roomfeature_member.html#禁言成员
          - text: 全局广播
            desc: 向 App 内所有聊天室中的所有用户发送消息或通知，可用于传达重要信息、公告、提醒或紧急通知等。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatroomuikit/android/roomfeature_common.html#全局广播
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatroomuikit/ios/roomfeature_common.html#全局广播
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatroomuikit/web/roomfeature_common.html#全局广播
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatroomuikit/flutter/roomfeature_common.html#全局广播
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatroomuikit/react-native/roomfeature_common.html#全局广播
          - text: 消息管理
            desc: 聊天室未读消息数指在一个聊天室中用户尚未读取的消息数量。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatroomuikit/android/roomfeature_common.html#未读消息数
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatroomuikit/ios/roomfeature_common.html#未读消息数
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatroomuikit/web/roomfeature_common.html#未读消息数
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatroomuikit/flutter/roomfeature_common.html#未读消息数
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatroomuikit/react-native/roomfeature_common.html#未读消息数               
          - text: 成员管理
            desc: 聊天室成员列表显示了该聊天室中的当前在线用户。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatroomuikit/android/roomfeature_member.html#查看成员列表
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatroomuikit/ios/roomfeature_member.html#查看成员列表
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatroomuikit/web/roomfeature_member.html#查看成员列表
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatroomuikit/flutter/roomfeature_member.html#查看成员列表
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatroomuikit/react-native/roomfeature_member.html#查看成员列表        
---
