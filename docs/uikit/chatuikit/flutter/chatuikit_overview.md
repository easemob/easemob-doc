# 概述

<Toc />

环信单群聊 UIKit 是基于环信即时通讯云 IM SDK 开发的一款即时通讯 UI 组件库，提供各种组件实现会话列表、聊天界面、联系人列表等功能，帮助开发者根据实际业务需求快速搭建包含 UI 界面的即时通讯应用。

若要访问源码，请点击[这里](https://github.com/easemob/chatuikit-flutter)。

## UIKit 基本项目结构

```bash
├── chat_uikit.dart // 主类
├── chat_uikit_context.dart // 数据缓存
├── chat_uikit_localizations.dart // 国际化
├── chat_uikit_settings.dart // 通用配置
├── chat_uikit_time_formatter.dart // 时间格式化类
├── provider
│   └── chat_uikit_provider.dart // 用户数据提供类
├── sdk_wrapper // SDK 包装类
│   ├── actions
│   │   ├── chat_actions.dart
│   │   ├── contact_actions.dart
│   │   ├── group_actions.dart
│   │   ├── notification_actions.dart
│   │   └── presence_actions.dart
│   ├── chat_sdk_wrapper.dart
│   ├── chat_sdk_wrapper_action_events.dart
│   ├── observers
│   │   ├── action_event_observer.dart
│   │   ├── chat_observer.dart
│   │   ├── connect_observer.dart
│   │   ├── contact_observer.dart
│   │   ├── group_observer.dart
│   │   ├── message_observer.dart
│   │   ├── multi_observer.dart
│   │   └── presence_observer.dart
│   ├── sdk_wrapper_tools.dart
│   ├── typedef_define.dart
│   └── wrappers
│       ├── chat_wrapper.dart
│       ├── connect_wrapper.dart
│       ├── contact_wrapper.dart
│       ├── group_wrapper.dart
│       ├── message_wrapper.dart
│       ├── multi_wrapper.dart
│       ├── notification_wrapper.dart
│       └── presence_wrapper.dart
├── service // uikit 对于 SDK 包装的二次包装类
│   ├── actions
│   │   ├── chat_uikit_chat_actions.dart
│   │   ├── chat_uikit_contact_actions.dart
│   │   ├── chat_uikit_events_actions.dart
│   │   └── chat_uikit_notification_actions.dart
│   ├── chat_uikit_action_events.dart
│   ├── chat_uikit_service.dart
│   ├── observers
│   │   ├── chat_uikit_contact_observers.dart
│   │   └── chat_uikit_events_observers.dart
│   └── protocols
│       └── chat_uikit_profile.dart
├── tools // 工具类
│   ├── chat_uikit_conversation_helper.dart
│   ├── chat_uikit_file_size_tool.dart
│   ├── chat_uikit_helper.dart
│   ├── chat_uikit_highlight_tool.dart
│   ├── chat_uikit_image_loader.dart
│   ├── chat_uikit_insert_message_tool.dart
│   ├── chat_uikit_message_helper.dart
│   └── chat_uikit_time_tool.dart
├── ui // ui 组件
│   ├── components // 列表相关组件
│   │   ├── contact_list_view.dart
│   │   ├── conversation_list_view.dart
│   │   ├── group_list_view.dart
│   │   ├── group_member_list_view.dart
│   │   ├── message_list_view.dart
│   │   └── new_requests_list_view.dart
│   ├── controllers // 列表相关组件的 Controller
│   │   ├── chat_uikit_list_view_controller_base.dart
│   │   ├── contact_list_view_controller.dart
│   │   ├── conversation_list_view_controller.dart
│   │   ├── group_list_view_controller.dart
│   │   ├── group_member_list_view_controller.dart
│   │   ├── message_list_view_controller.dart
│   │   └── new_request_list_view_controller.dart
│   ├── custom // 自定义组件
│   │   ├── chat_uikit_emoji_data.dart
│   │   ├── custom_text_editing_controller.dart
│   │   └── message_list_share_user_data.dart
│   ├── models // UI 组件需要的 model
│   │   ├── alphabetical_item_model.dart
│   │   ├── chat_uikit_list_item_model_base.dart
│   │   ├── contact_item_model.dart
│   │   ├── conversation_model.dart
│   │   ├── group_item_model.dart
│   │   ├── new_request_item_model.dart
│   │   └── quote_mode.dart
│   ├── route // 自定义路由目录
│   │   ├── chat_uikit_route.dart
│   │   ├── chat_uikit_route_names.dart
│   │   └── view_arguments
│   │       ├── change_info_view_arguments.dart
│   │       ├── contact_details_view_arguments.dart
│   │       ├── contacts_view_arguments.dart
│   │       ├── conversations_view_arguments.dart
│   │       ├── create_group_view_arguments.dart
│   │       ├── current_user_info_view_arguments.dart
│   │       ├── group_add_members_view_arguments.dart
│   │       ├── group_change_owner_view_arguments.dart
│   │       ├── group_delete_members_view_arguments.dart
│   │       ├── group_details_view_arguments.dart
│   │       ├── group_members_view_arguments.dart
│   │       ├── group_mention_view_arguments.dart
│   │       ├── groups_view_arguments.dart
│   │       ├── messages_view_arguments.dart
│   │       ├── new_request_details_view_arguments.dart
│   │       ├── new_requests_view_arguments.dart
│   │       ├── report_message_view_arguments.dart
│   │       ├── search_group_members_view_arguments.dart
│   │       ├── search_users_view_arguments.dart
│   │       ├── select_contact_view_arguments.dart
│   │       ├── show_image_view_arguments.dart
│   │       ├── show_video_view_arguments.dart
│   │       └── view_arguments_base.dart
│   ├── views // view 级别组件
│   │   ├── change_info_view.dart // 修改数据组件
│   │   ├── contact_details_view.dart // 联系人详情组件
│   │   ├── contacts_view.dart // 联系人列表组件
│   │   ├── conversations_view.dart // 会话列表组件
│   │   ├── create_group_view.dart // 创建群组组件
│   │   ├── current_user_info_view.dart // 当前用户详情组件
│   │   ├── group_add_members_view.dart // 添加群成员组件
│   │   ├── group_change_owner_view.dart // 修改群主组件
│   │   ├── group_delete_members_view.dart // 删除群成员组件
│   │   ├── group_details_view.dart // 群详情组件
│   │   ├── group_members_view.dart // 群成员列表组件
│   │   ├── group_mention_view.dart // 群@组件
│   │   ├── groups_view.dart // 群组列表组件
│   │   ├── messages_view.dart // 消息组件
│   │   ├── new_request_details_view.dart // 好友请求详情组件
│   │   ├── new_requests_view.dart // 好友请求列表组件
│   │   ├── report_message_view.dart // 消息数据上报组件
│   │   ├── search_group_members_view.dart // 搜索群成员组件
│   │   ├── search_users_view.dart // 搜索好友组件
│   │   ├── select_contact_view.dart  // 联系人多选组件
│   │   ├── show_image_view.dart // 显示图片组件
│   │   └── show_video_view.dart // 显示视频组件
│   └── widgets // widget 级别组件
│       ├── chat_uikit_alphabetical_widget.dart // 字母索引组件
│       ├── chat_uikit_app_bar.dart // appBar 组件
│       ├── chat_uikit_avatar.dart // 头像组件
│       ├── chat_uikit_badge.dart // 角标组件
│       ├── chat_uikit_bottom_sheet.dart // bottom sheet 组件
│       ├── chat_uikit_button.dart // button 组件
│       ├── chat_uikit_dialog.dart // dialog 组件
│       ├── chat_uikit_downloads_helper_widget.dart // 下载附件组件
│       ├── chat_uikit_input_bar.dart // 消息输入组件
│       ├── chat_uikit_input_emoji_bar.dart // 消息表情组件
│       ├── chat_uikit_list_view.dart // 列表组件
│       ├── chat_uikit_message_sliver.dart // 消息列表组件
│       ├── chat_uikit_message_status_widget.dart // 消息状态组件
│       ├── chat_uikit_quote_widget.dart // 消息引用组件
│       ├── chat_uikit_record_bar.dart // 录音组件
│       ├── chat_uikit_reply_bar.dart // 消息回复组件
│       ├── chat_uikit_search_widget.dart // 搜索组件
│       ├── chat_uikit_show_image_widget.dart // 显示大图组件
│       ├── chat_uikit_show_video_widget.dart // 显示视频组件
│       ├── chat_uikit_water_ripple.dart // 水波纹组件
│       └── list_view_items // 列表项
│           ├── chat_uikit_alphabetical_list_view_item.dart // 首字母组件的 item 组件
│           ├── chat_uikit_contact_list_view_item.dart // 联系人组件的 item 组件
│           ├── chat_uikit_conversation_list_view_item.dart // 会话列表组件的 item 组件
│           ├── chat_uikit_details_list_view_item.dart // 详情页列表组件的 item 组件
│           ├── chat_uikit_group_list_view_item.dart // 群列表组件的 item 组件
│           ├── chat_uikit_list_view_more_item.dart // 列表组件中用于展示列表前面或后面数据（例如，联系人列表中的好友申请和群列表部分）的 item 组件
│           ├── chat_uikit_new_request_list_view_item.dart // 好友请求列表组件的 item 组件
│           ├── chat_uikit_search_list_view_item.dart // 搜索组件的 item 组件
│           └── message_list_view_items // 消息列表组件 items
│               ├── chat_uikit_message_list_view_alert_item.dart // 提示消息 item 组件
│               ├── chat_uikit_message_list_view_bubble.dart // 消息气泡组件
│               ├── chat_uikit_message_list_view_message_item.dart  // 消息 item 组件
│               └── message_widget // 消息内容组件
│                   ├── chat_uikit_card_message_widget.dart // 名片消息组件
│                   ├── chat_uikit_file_message_widget.dart // 文件消息组件
│                   ├── chat_uikit_image_message_widget.dart // 图片消息组件
│                   ├── chat_uikit_nonsupport_message_widget.dart // 暂不支持消息组件
│                   ├── chat_uikit_text_message_widget.dart // 文本消息组件
│                   ├── chat_uikit_video_message_widget.dart // 视频消息组件
│                   └── chat_uikit_voice_message_widget.dart // 音频消息组件
└── universal
    ├── chat_uikit_action_model.dart // 事件 model
    └── defines.dart // uikit 内部使用 key
```

## 功能

单群聊 UIKit 中业务相关的 UI 控件主要包含在以下三个 View 中：

- MessagesView 提供所有聊天视图。

![img](@static/images/uikit/chatuikit/android/page_chat.png =400x890) 

- ConversationsView 提供会话列表。

![img](@static/images/uikit/chatuikit/android/page_conversation.png =400x850) 

- ContactsView 提供联系人、群组及其详情等。

![img](@static/images/uikit/chatuikit/android/page_contact_list.png =400x850) 

