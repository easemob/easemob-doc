---
home: true
title: 导航页
heroText: false
tagline: false
products:
  - link: "/product/introduction.html"
    text: 产品概述
  - link: "/product/pricing.html"
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
sdkStarter:
  title: "SDK 快速开始"
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
    - icon: /sdk/uniapp.svg
      link: /document/applet/wechat.html
      text: Applet
    - icon: /sdk/flutter.svg
      link: /document/flutter/overview.html
      text: Flutter
    - icon: /sdk/react.svg
      link: /document/react-native/overview.html
      text: React Native
    - icon: /sdk/unity.svg
      link: /document/unity/overview.html
      text: Unity
    - icon: /sdk/windows.svg
      link: /document/windows/overview.html
      text: Windows 

projects:
  - title: SDK/服务端功能
    features:
      - title: 消息和会话
        icon: /feature/message.svg
        contexts:
          - text: 发送/接收消息
            desc: 在单聊、群聊和聊天室中发送和接收各种类型的消息，包括文本消息、图片、语音、视频、文件消息、位置消息、透传消息、自定义消息、合并消息和定向消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_send_receive.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_send_receive.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_send_receive.html
              - icon: /sdk/uniapp.svg
                text: Applet
                link: /document/applet/message_send_receive.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_send_receive.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_send_receive.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_send_receive.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_send_receive.html
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/message.html  
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/message_single.html
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
              - icon: /sdk/uniapp.svg
                text: Applet
                link: /document/applet/message_retrieve.html
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
              - icon: /sdk/uniapp.svg
                text: Applet
                link: /document/applet/message_recall.html
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
                link: /document/electron/message.html  
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/message_recall.html
          - text: 搜索消息
            desc: 发送方可以撤回一条发送成功的消息，包括已经发送的历史消息，离线消息或漫游消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_search.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_search.html
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/message_receipt.html
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/message_modify.html
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
                link: /document/server-side/message_modify_text_custom.html 
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
                link: /document/web/message_send_receive.html#发送合并消息
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/message_send_receive.html#发送合并消息
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
                link: /document/electron/conversation.html  
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/message_import.html
          - text: 更新消息
            desc: 更新本地数据库中的消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_update.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_update.html
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/message_delete.html
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
                link: /document/server-side/message_delete.html
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/message_pin.html
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
          - text: 消息翻译
            desc: 在聊天过程中对文字消息进行翻译，支持发送或接收消息时对文本消息进行按需翻译或自动翻译。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_translation.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_translation.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/message_translation.html
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/message_translation.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_translation.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_translation.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_translation.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_translation.html
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/message_deliver_only_online.html
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
           - text: 消息流量统计
            desc: 本地消息的流量统计功能。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/message_traffic_statis.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/message_traffic_statis.html    
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/conversation_list.html
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
          - text: 本地会话
            desc: Web SDK 内部使用 IndexedDB 在本地数据库中保存单聊和群聊会话，通过 LocalCache 模块对本地会话数据进行管理。
            sdks:
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/conversation_local.html  
          - text: 会话置顶
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/conversation_pin.html
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/conversation_mark.html
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/conversation_delete.html
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
                link: /document/electron/conversation_delete.html  
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/message_recall.html        
      - title: 群组和聊天室
        icon: /feature/group.svg
        contexts:
          - text: 创建和管理群组
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/group_manage.html
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
              - icon: /sdk/electron.svg
                text: Electron
                link: /document/electron/group.html 
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/group.html    
          - text: 管理群成员
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/group_members.html
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
                link: /document/electron/group.html 
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/group.html   
          - text: 管理群组属性
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/group_attributes.html
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
                link: /document/electron/group.html 
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/group.html     
          - text: 创建和管理聊天室
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/room_manage.html
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
                link: /document/server-side/chatroom.html    
          - text: 管理聊天室成员
            desc: 支持聊天室白名单、黑名单、禁言、退出聊天室、获取聊天室成员列表、管理聊天室所有者和管理员以及监听聊天室事件。
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/room_members.html
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
                link: /document/electron/chatroom.html
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/chatroom.html
          - text: 管理聊天室属性
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/room_attributes.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/chatroom.html
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
              - icon: /sdk/uniapp.svg
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
                link: /document/server-side/group.html 
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
              - icon: /sdk/uniapp.svg
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
          - text: 用户体系
            desc: 支持注册、删除用户、获取用户详情、修改用户密码、获取用户在线状态和获取指定账号的在线登录设备列表。
            sdks:
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/account_system.html
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
              - icon: /sdk/uniapp.svg
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
                link: /document/server-side/userprofile.html  
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/user_relationship.html
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
                link: /document/server-side/user_relationship.html 
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
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/presence.html
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
                link: /document/server-side/presence.html          
      - title: 推送
        icon: /feature/push.svg
        contexts:
          - text: 离线推送
            desc: 支持集成第三方消息推送服务，包括 FCM、APNs、华为、荣耀、小米、OPPO、VIVO 和魅族。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/push.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/push.html
          - text: 即时推送
            desc: 即时推送服务的应用场景包括系统消息通知、活动促销营销、运营促活推送、社交互动通知、以及内容订阅推送等，覆盖谷歌、华为、小米、魅族、OPPO、VIVO 等主流手机厂商通道。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /push/push_integration_note_android.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /push/push_integration_note_ios.html
      - title: 其他
        icon: /feature/others.svg
        contexts:
          - text: 回调
            link: /document/server-side/callback.html
          - text: 错误码
            desc: SDK 中的接口和 REST 接口调用或者回调中的错误码。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/error.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/error.html
              - icon: /sdk/web.svg
                text: Web
                link: /document/web/error.html
              - icon: /sdk/uniapp.svg
                text: 小程序
                link: /document/applet/error.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/error.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/error.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/error.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/error.html 
              - icon: /sdk/rest.svg
                text: REST
                link: /document/server-side/error.html
          - text: 内容审核
            link: /product/moderation/moderation_overview.html           
  - title: UIKit
    features:
      - title: UIKit-单群聊
        icon: /feature/uikit.svg
        contexts:
          - text: 聊天界面
            desc: 提供发送和接收消息等功能，支持对标题栏、消息气泡和消息列表区域进行自定义、自定义消息布局、配置消息列表控件、长按菜单功能设置以及自定义消息输入框等。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_conversation.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/flutter/quickstart.html
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_conversation.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/flutter/quickstart.html
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_conversation.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/flutter/quickstart.html    
          - text: 会话列表界面
            desc: 展示当前用户的所有会话并且提供会话相关功能，支持自定义标题栏、自定义会话布局等。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/flutter/quickstart.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/flutter/quickstart.html
          - text: 通讯录界面
            desc: 展示通讯录列表，包括联系人搜索，添加联系人，好友申请列表入口，群组列表入口，联系人列表。支持自定义联系人列表和联系人事件监听。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/flutter/quickstart.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/flutter/quickstart.html      
          - text: 界面主题
            desc: 内置浅色和深色主题，默认为浅色主题。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/flutter/quickstart.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/flutter/quickstart.html  
          - text: 消息引用
            desc: 指用户可以引用一条已发送的消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_message.html#消息引用
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/flutter/quickstart.html 
          - text: 表情回复
            desc: 指用户可以使用表情符号回复消息。在单群聊 UIKit 中，用户可以长按单条消息触发消息拓展功能菜单，选择表情回复。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_message.html#表情回复
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_message.html#表情回复
          - text: 消息编辑
            desc: 指用户可以编辑一条已发送的消息。消息编辑可以帮助用户纠正错误，或添加新信息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_message.html#消息编辑
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_message.html#消息编辑
          - text: 消息撤回
            desc: 指用户可以撤回一条已发送的消息。消息撤回可以帮助用户撤回错误发送的消息，或撤回不想让其他用户看到的消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_message.html#消息撤回
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/android/chatfeature_message.html#消息撤回
          - text: 消息转发
            desc: 指用户可以将消息转发给其他用户。你可以转发单条消息，也可以选择多条消息进行合并转发。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_message.html#消息合并转发
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_message.html#消息合并转发
          - text: 消息翻译
            desc: 指用户可以将一条消息翻译成其他语言。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_message.html#消息翻译
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_message.html#消息翻译
          - text: 语音消息
            desc: 语音消息指以语音形式发送和接收的消息，可替代文字交流。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_common.html#语音消息
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_common.html#语音消息
          - text: 未读消息数
            desc: 未读消息数是指用户收到的但尚未查看的消息数量。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_common.html#未读消息数
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_common.html#未读消息数
          - text: 已读回执
            desc: 已读回执用于告知消息发送者，接收者已经阅读了其发送的消息。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_common.html#已读回执
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/quickstart.html
          - text: 送达回执
            desc: 已发送回执用于告知消息发送者，其发送的消息已经成功发送到服务器、接收方以及发送失败。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_common.html#已发送回执
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_common.html#已发送回执
          - text: 文件共享
            desc: 文件共享允许用户通过即时通讯应用发送和接收文件。文件共享可以用于分享文档、图片、视频等文件。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_common.html#文件共享
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_common.html#文件共享
          - text: 消息话题
            desc: 消息话题（即 Thread）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_message.html#消息话题
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_message.html#消息话题
          - text: 会话已读
            desc: 会话已读是指显示用户是否已阅读过含有未读消息的特定会话。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_conversation.html#会话已读
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatfeature_conversation.html#会话已读
          - text: 会话置顶
            desc: 会话置顶是指用户将重要的会话固定在聊天列表顶部，方便快速访问常用或优先级别的会话。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatfeature_conversation.html#会话置顶
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/android/chatfeature_conversation.html#会话置顶
          - text: 会话免打扰
            desc: 会话免打扰是指用户暂时关闭特定会话的通知，避免被打扰。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/flutter/quickstart.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/flutter/quickstart.html
          - text: 会话删除
            desc: 会话删除是指用户永久删除不再需要的会话，清理会话列表。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/flutter/quickstart.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/flutter/quickstart.html
      - title: UIKit-聊天室
        icon: /feature/uikit-chatroom.svg
        contexts:
          - text: 聊天室管理
            desc: 我是描述，在这里进行feature的相关描述
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/flutter/quickstart.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/flutter/quickstart.html
  - title: CallKit
    features:
      - contexts:
          - text: 一对一/多人通话
            desc: EaseCallKit 是基于环信 IM 和声网音视频结合开发的音视频 UI 库，实现了一对一语音和视频通话以及多人音视频通话的功能。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/easecallkit.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/ios/easecallkit.html
          - text: 通话异常回调
            desc: 通话过程中如果有异常或者错误发生，会触发通话异常回调。
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /document/android/easecallkit.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /document/android/easecallkit.html
  - title: API 参考
    features:
      - title: IM 客户端
        icon: /feature/api-client.svg
        contexts:
          - text: Android
            link: https://sdkdocs.easemob.com/apidoc/android/chat3.0/annotated.html
          - text: iOS
            link: https://sdkdocs.easemob.com/apidoc/android/chat3.0/annotated.html
          - text: Web/Applet
            link: https://sdkdocs.easemob.com/apidoc/android/chat3.0/annotated.html
          - text: Flutter
            link: https://sdkdocs.easemob.com/apidoc/flutter/index.html
          - text: React Native
            link: https://sdkdocs.easemob.com/apidoc/rn/modules.html
          - text: Unity/Windows
            link: https://sdkdocs.easemob.com/apidoc/unity/annotated.html       
      - title: IM 服务端
        icon: /feature/api-server.svg
        contexts:
          - text: JAVA 1.0
            link: https://easemob.github.io/easemob-im-server-sdk/
          - text: JAVA 2.0
            link: https://github.com/easemob/easemob-im-server-sdk/tree/master_java_2.0/src/test/java/com/easemob/im/api  
          - text: PHP
            link: https://easemob.github.io/im-php-server-sdk/annotated.html
      - title: 超级社区
        icon: /feature/api-circle.svg
        contexts:
          - text: Android
            link: https://www.easemob.com/apidoc/Android/hyphenate-api-doc/html/annotated.html
          - text: iOS
            link: https://www.easemob.com/apidoc/iOS/html_ch/annotated.html
          - text: Web
            link: https://www.easemob.com/apidoc/Web/
---
