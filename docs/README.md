---
home: true
title: Home
heroText: false
tagline: false
products:
  - link: "/product/introduction.html"
    text: Product Introduction
  - link: "/product/pricing_policy.html"
    text: Pricing
  - link: "/sdk/v5/android/releasenote.html"
    text: Latest Release
  - link: "/product/limitation.html"
    text: Feature Limitations
  - link: "https://www.easemob.com/protocol"
    text: Privacy Policy
  - link: "/product/security_best_practices.html"
    text: Security Best Practices
  - link: "https://rte-src.vulbox.com/"
    text: Security Response Center
    target: '_blank'
starter:
  - title: "Beginner's Guide"
    desc: "Learn the complete process for integrating the EasyIM SDK."
    platform:
      - icon: /guide/sdk.svg
        link: /sdk/v5/android/beginner_guide.html
        text: SDK
      - icon: /guide/uikit.svg
        link: /uikit/chatuikit/android/beginner_guide.html
        text: UIKit
        hidden: true
      - icon: /guide/callkit.svg
        link: /callkit/android/beginner_guide.html
        text: CallKit
        hidden: true
  - title: "Integrate with MCP"
    desc: "The EasyIM MCP Server enables MCP-compatible AI coding tools to search EasyIM documentation and source code."
    platform:
      - icon: /guide/sdk.svg
        link: /sdk/v5/android/easemob_mcp_server.html
        text: SDK
      - icon: /guide/uikit.svg
        link: /uikit/chatuikit/android/easemob_mcp_server.html
        text: UIKit
        hidden: true
      - icon: /guide/callkit.svg
        link: /callkit/android/easemob_mcp_server.html
        text: CallKit
        hidden: true
  - title: "SDK Quickstart"
    desc: "Choose a client SDK and quickly add real-time messaging to your app."
    platform:
      - icon: /sdk/android.svg
        link: /sdk/v5/android/quickstart.html
        text: Android
      - icon: /sdk/iOS.svg
        link: /sdk/v5/ios/quickstart.html
        text: iOS 
      - icon: /sdk/web.svg
        link: /sdk/v5/web/quickstart.html
        text: Web
  - title: "Server APIs"
    desc: "Use the RESTful APIs to implement messaging and resource management from your app server."
    platform:
      - icon: /sdk/rest.svg
        link: /rest/overview.html
        text: REST
  - title: "单/群聊 UIKit"
    hidden: true
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
    hidden: true
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
    hidden: true
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
    hidden: true
    desc: "选择合适的增值服务构建内容审核、实时音视频、消息翻译、即时推送等功能，点击对应按钮了解主要功能介绍。"
    platform:
      - icon: /sdk/check_texts.svg
        link: /value-added/moderation/moderation_overview.html
        text: 内容审核
      - icon: /sdk/video.svg
        link: /callkit/android/product_overview.html
        text: 实时音视频
      - icon: /sdk/instant.svg
        link: /value-added/push/push_overview.html
        text: Instant Push
      - icon: /sdk/translation.svg
        link: /value-added/translation/message_translation_android.html
        text: 消息翻译
      - icon: /sdk/check_texts.svg
        link: /value-added/moderation/moderation_overview.html
        text: 服务端消息搜索
      - icon: /sdk/instant.svg
        link: /value-added/search/message_search_android.html
        text: 语音转文字    
projects:
  - title: SDK and Server API Features
    features:
      - title: Messages and Conversations
        icon: /feature/message.svg
        contexts:
          - text: Send Messages
            desc: "Send various message types in one-to-one chats, group chats, and chat rooms, including text, image, voice, video, file, location, command, custom, and combined messages."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_send.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_send.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_send.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/message_single.html
          - text: Send Streaming Messages
            desc: "Send streaming messages in one-to-one and group chats through RESTful APIs."
            sdks:
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/message_stream_send_single.html     
          - text: Receive Messages
            desc: "Receive various message types in one-to-one chats, group chats, and chat rooms, including text, image, voice, video, file, location, command, custom, and combined messages."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_receive.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_receive.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_receive.html
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
          - text: Receive Streaming Messages
            desc: "Receive streaming messages sent by the server in one-to-one and group chats."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_stream_receive.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_stream_receive.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_stream_receive.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS
                link: /document/harmonyos/message_stream_receive.html   
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_stream_receive.html    
          - text: Retrieve Messages
            desc: "Retrieve roaming messages from the EasyIM server or retrieve messages from the local database."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_retrieve.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_retrieve.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_retrieve.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/message_historical.html
          - text: Recall Messages
            desc: "Recall a successfully sent message, including a historical, offline, or roaming message."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_recall.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_recall.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_recall.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/message_recall_single.html
          - text: Edit Messages
            desc: "Edit a successfully sent message in a one-to-one or group conversation."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_modify.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_modify.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_modify.html
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
                link: /rest/message_modify.html       
          - text: Message Receipts
            desc: "Use delivery, conversation read, and message read receipts in one-to-one chats. Group chats support message read receipts."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_receipt.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_receipt.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_receipt.html
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
          - text: Search Messages
            desc: "Search for messages in the local database or on the server."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_search_local.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_search_local.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/message_search_local.html   
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /document/flutter/message_search_local.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/message_search_local.html
              - icon: /sdk/unity.svg
                text: Unity
                link: /document/unity/message_search_local.html
              - icon: /sdk/windows.svg
                text: Windows
                link: /document/windows/message_search_local.html
          - text: Message Reactions
            desc: "Add or remove emoji reactions from messages in one-to-one and group chats."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/reaction.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/reaction.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/reaction.html
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
                link: /rest/reaction_add.html 
          - text: Forward Messages
            desc: "Forward sent or received messages to other users, either individually or as multiple messages combined into one."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_forward.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_forward.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_send.html#send-combined-messages
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
          - text: Import and Insert Messages
            desc: "Import messages into the local database in batches or insert a message into a local conversation."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_import_insert.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_import_insert.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/message_import_single.html
          - text: Update Messages
            desc: "Update messages stored in the local database."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_update.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_update.html
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
          - text: Delete Messages
            desc: "Delete historical messages unilaterally from the server or local database."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_delete.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_delete.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_delete.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/message_delete_roam_single_msgid.html
          - text: Targeted Messages
            desc: "Send a targeted message to one or more specified members of a group or chat room without delivering it to other members."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_target.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_target.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_target.html
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
          - text: Message Extensions
            desc: "Pass custom content through message extension fields when the SDK's built-in message types do not meet your requirements."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_extension.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_extension.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_extension.html
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
          - text: Pin Messages
            desc: "Pin messages to the top of a conversation so that all participants can quickly find important information."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_pin.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_pin.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_pin.html
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
          - text: Deliver Messages Only to Online Users
            desc: "Deliver messages only to users who are online. Offline recipients do not receive these messages."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/message_deliver_only_online.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/message_deliver_only_online.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/message_deliver_only_online.html
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
          - text: Conversation List
            desc: "Retrieve conversation lists from the server or local database."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/conversation_list.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/conversation_list.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/conversation_list.html
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
          - text: Conversation Unread Counts
            desc: "View unread message counts for all local conversations or a specified conversation, and clear conversation unread counts."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/conversation_unread.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/conversation_unread.html
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
          - text: Local Conversations
            desc: "Use the Web SDK's LocalCache module to manage one-to-one and group conversations stored in IndexedDB."
            sdks:
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/conversation_local.html        
          - text: Pin Conversations
            desc: "Pin or unpin one-to-one and group conversations at the top of the conversation list, and retrieve pinned conversations from the server."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/conversation_pin.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/conversation_pin.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/conversation_pin.html
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
          - text: Tag Conversations
            desc: "Add or remove marks on one-to-one and group conversations, and retrieve marked conversations from the server or local database."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/conversation_mark.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/conversation_mark.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/conversation_mark.html
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
          - text: Delete Conversations
            desc: "Delete a conversation and its historical messages unilaterally from the server or local database."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/conversation_delete.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/conversation_delete.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/conversation_delete.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/conversation_delete.html
      - title: Chat Groups and Chat Rooms
        icon: /feature/group.svg
        contexts:
          - text: Create and Manage Chat Groups
            desc: "Create and destroy chat groups, retrieve group details and lists, query how many groups a user has joined, block or unblock group messages, and monitor group events."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/group_manage.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/group_manage.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/group_manage.html
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
                link: /rest/group_create.html   
          - text: Manage Chat Group Members
            desc: "Join or leave chat groups, manage group allowlists, blocklists, and mutes, and set custom member attributes."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/group_members.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/group_members.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/group_members.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/group_member_add_single.html
          - text: Manage Chat Group Member Name Cards
            desc: "Set and retrieve group member name cards to represent a user's identity in different groups, such as department, position, or project role."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/group_namecard.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/group_namecard.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/group_namecard.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/group_namecard.html         
          - text: Manage Chat Group Attributes
            desc: "Modify group names and descriptions, retrieve and update announcements, manage shared files, and update group extension fields."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/group_attributes.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/group_attributes.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/group_attributes.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/group_modify.html     
          - text: Create and Manage Chat Rooms
            desc: "Create and join chat rooms, retrieve room details, leave and destroy rooms, update member counts, and monitor chat room events."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/room_manage.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/room_manage.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/room_manage.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/chatroom_create.html    
          - text: Manage Chat Room Members
            desc: "Join or leave chat rooms, manage room allowlists, blocklists, and mutes, and monitor chat room events."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/room_members.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/room_members.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/room_members.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/chatroom_member_add_single.html
          - text: Manage Chat Room Attributes
            desc: "Manage chat room names, descriptions, announcements, and custom attributes."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/room_attributes.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/room_attributes.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/room_attributes.html
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
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/chatroom_announcement_get.html
          - text: Manage Message Threads
            desc: "Create, destroy, join, and leave message threads; update thread names; retrieve thread details, members, and lists; get the latest thread message; and monitor thread events."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/thread.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/thread.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/thread.html
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
                link: /rest/group_thread_create.html
          - text: Manage Messages in Threads
            desc: "Send, receive, recall, and retrieve messages in message threads."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/thread_message.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/thread_message.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/thread_message.html
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
      - title: Users
        icon: /feature/user.svg
        contexts:
          - text: User Account Management (REST)
            desc: "Register and delete users, retrieve user details and presence, change passwords, and retrieve the online device list for a specified account."
            sdks:
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/account_register_open.html
          - text: User Attributes
            desc: "Set and retrieve user attributes such as nickname, avatar, email address, phone number, gender, signature, and birthday."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/userprofile.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/userprofile.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/userprofile.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/userprofile.html     
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
                link: /rest/user_attribute_set.html
          - text: Automatic User Information Management
            desc: "Automatically synchronize and update user attributes, friend remarks, and group member name cards in memory, reducing the need to retrieve, store, and update user information manually."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/userinfo_provider.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/userinfo_provider.html 
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/userinfo_provider.html   
          - text: User Relationships
            desc: "Add and remove friends, set friend remarks, retrieve friend lists, and manage user blocklists."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/user_relationship.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/user_relationship.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/user_relationship.html
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
                link: /rest/user_friend_add.html 
          - text: Presence
            desc: "Subscribe to and query user presence, including online, offline, and custom states."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/presence.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/presence.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/presence.html
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
                link: /rest/presence_set.html               
      - title: Push Notifications
        icon: /feature/push.svg
        contexts:
          - text: Offline Push
            desc: "Integrate third-party message push services, including FCM, APNs, Huawei, Honor, Xiaomi, OPPO, vivo, and Meizu."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /sdk/v5/android/push/push_overview.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /sdk/v5/ios/push/push_overview.html
              - icon: /sdk/web.svg
                text: Web
                link: /sdk/v5/web/push/push_overview.html
              - icon: /sdk/uniapp.svg
                text: uni-app
                link: /sdk/v5/web/push/push_overview.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /document/harmonyos/push/push_overview.html
              - icon: /sdk/react.svg
                text: React Native
                link: /document/react-native/push/push_overview.html  
              - icon: /sdk/rest.svg
                text: REST
                link: /rest/push_information_bind_unbind.html 
          - text: Instant Push
            desc: "Use instant push for system notifications, promotional campaigns, user re-engagement, social interactions, and content subscriptions across major vendor channels such as Google and Applet."
            sdks:
      - title: Other Features
        icon: /feature/api-server.svg
        contexts:
          - text: Token Authentication
            link: /rest/easemob_app_token.html
          - text: Webhooks
            link: /rest/callback_presending.html
          - text: Multi-Device Management
            link: /rest/callback_login_logout.html 
          - text: Global User Mutes
            link: /rest/user_global_mute_overview.html                                      
  - title: UIKit
    hidden: true
    features:
      - title: 单/群聊
        icon: /feature/uikit.svg
        contexts:
          - text: Conversation List
            desc: "Explore APIs and implementation guidance for conversation list."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_conversation_list_intro.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatuikit_conversation_list_intro
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatuikit/web/chatuikit_conversation_list_intro.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS 
                link: /uikit/chatuikit/harmonyos/chatuikit_conversation_list_intro.html 
              - icon: /sdk/uniapp.svg
                text: uni-app
                link: /uikit/chatuikit/uniapp/chatuikit_conversation_list_intro.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatuikit/flutter/chatuikit_conversation_list_intro.html
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatuikit/react-native/chatuikit_conversation_list_intro.html
          - text: 消息
            desc: "Explore APIs and implementation guidance for conversation list."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_chat_intro
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatuikit_chat_intro
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatuikit/web/chatuikit_chat_intro
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS
                link: /uikit/chatuikit/harmonyos/chatuikit_chat_intro
              - icon: /sdk/uniapp.svg
                text: uni-app
                link: /uikit/chatuikit/uniapp/chatuikit_chat_intro.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatuikit/flutter/chatuikit_chat_intro
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatuikit/react-native/chatuikit_chat_intro
          - text: 通讯录
            desc: "Explore APIs and implementation guidance for conversation list."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_contactlist_intro.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatuikit_custom_contact_list.html
              - icon: /sdk/web.svg
                text: Web
                link: /uikit/chatuikit/web/chatuikit_contactlist_intro.html
              - icon: /sdk/harmonyos.svg
                text: HarmonyOS
                link: /uikit/chatuikit/harmonyos/chatuikit_contactlist_intro.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatuikit/flutter/chatuikit_contactlist_intro.html
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatuikit/react-native/chatuikit_contactlist_intro.html
          - text: 好友详情
            desc: "Explore APIs and implementation guidance for conversation list."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_custom_contact_details.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatuikit_custom_contact_details.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatuikit/flutter/chatuikit_custom_contact_details.html
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatuikit/react-native/chatuikit_custom_contact_details.html  
          - text: 群组详情
            desc: "Explore APIs and implementation guidance for conversation list."
            sdks:
              - icon: /sdk/android.svg
                text: Android
                link: /uikit/chatuikit/android/chatuikit_custom_group_details.html
              - icon: /sdk/iOS.svg
                text: iOS
                link: /uikit/chatuikit/ios/chatuikit_custom_group_details.html
              - icon: /sdk/flutter.svg
                text: Flutter
                link: /uikit/chatuikit/flutter/chatuikit_custom_group_details.html
              - icon: /sdk/react.svg
                text: React Native
                link: /uikit/chatuikit/react-native/chatuikit_custom_group_details.html
          
      - title: 聊天室
        icon: /feature/uikit-chatroom.svg
        contexts:
          - text: 聊天室管理
            desc: "Explore APIs and implementation guidance for conversation list."
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
            desc: "Explore APIs and implementation guidance for conversation list."
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
            desc: "Explore APIs and implementation guidance for conversation list."
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
            desc: "Explore APIs and implementation guidance for conversation list."
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
            desc: "Explore APIs and implementation guidance for conversation list."
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
            desc: "Explore APIs and implementation guidance for conversation list."
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
