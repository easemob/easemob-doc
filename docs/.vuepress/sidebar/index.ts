import { sidebar } from "vuepress-theme-hope";
import { DOC_SIDEBAR } from "./document";
import { CHAT_UIKIT_SIDEBAR, CHATROOM_UIKIT_SIDEBAR } from "./uikit";
import { PRIVATE_IM_SIDEBAR, PRIVATE_MEDIA_SIDEBAR } from "./private";
import { PUSH_SIDEBAR } from "./push";

export const zhSidebar = sidebar({
  "/": [
    {
      text: "产品动态",
      collapsible: true,
      children: [
        { text: "产品动态", link: "product_dynamics.html" },
      ],
    },
    {
      /*
        text: 分组标题
        children: 分组导航列表
          text: 显示的文本
          link: 链接地址
          show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
          collapsible: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
          children: 子菜单。请参考「子菜单示例」
      */
      text: "产品简介",
      collapsible: true,
      children: [
        { text: "产品概述", link: "introduction.html" },
        { text: "应用场景", link: "application_scenario.html" },
        { text: "功能介绍", 
            collapsible: true,
            children: [
              { text: "功能列表", link: "product_function.html" },
              { text: "功能详情", link: "conversation_function.html" },
            ],
          },
        { text: "账号系统", 
          collapsible: true,
          children: [
            { text: "用户注册与登录", link: "product_user_registration_login.html" },
            { text: "在线状态管理", link: "product_user_presence.html" },
          ],
        },
        { text: "用户属性与用户关系", 
          collapsible: true,
          children: [
            { text: "用户属性", link: "product_user_attribute.html" },
            { text: "用户关系", link: "product_user_relationship.html" },
          ],
        },
        { text: "消息管理", 
          collapsible: true,
          children: [
            { text: "单聊消息", link: "message_single_chat.html" },
            { text: "群组消息", link: "message_group.html" },
            { text: "聊天室消息", link: "message_chatroom.html" },
            { text: "消息存储", link: "message_store.html" },
            { text: "消息格式", link: "product_message_format.html" },
          ],
        },
        { text: "离线推送", link: "product_offline_push_overview.html" },
        { text: "群组管理", 
          collapsible: true,
          children: [
            { text: "群组概述", link: "product_group_overview.html" },
            { text: "子区", link: "product_thread_overview.html" },
          ],
        },
        { text: "聊天室", link: "product_chatroom_overview.html" },
        { text: "内容审核", link: "moderation/moderation_overview.html" },
        { text: "使用限制", 
          collapsible: true,
          children: [
            { text: "功能限制", link: "limitation.html" },
            { text: "RESTful 接口频率限制", link: "limitationapi.html" },
          ],
        },
        { text: "数据中心", 
          collapsible: true,
          children: [
            { text: "数据中心", link: "data_center.html" },
          ], 
        },
      ],
    },
    { text: "购买指南", 
      collapsible: true,
      children: [
        { text: "计费策略", link: "pricing_policy.html"},
        { text: "套餐包功能对比", link: "product_package_feature.html"},
        { text: "购买指引", link: "pricing_method.html" },
      ],
    }, 
    {
      text: "Demo",
      collapsible: true,
      children: [
        { text: "体验 Demo", link: "demo.html" },
        // TODO：需要补充 Flutter, React Native 和 uniapp 的 Demo 跑通文档
        { text: "快速跑通", 
          collapsible: true,
          children: [
            { text: "Android", link: "document/android/demo.html" },
            { text: "ios", link: "document/ios/demo.html" },
            { text: "Web React", link: "document/web/demo_react.html" },
            { text: "Web Vue", link: "document/web/demo_vue.html" },
          ],
        },  
      ],
    },
    {
      text: "下载中心",
      collapsible: true,
      children: [
        // TODO：需要填写 SDK 下载方式和 Demo 源码下载
        { text: "SDK & Demo 下载", link: "sdk_demo.html" },
        { text: "更新日志", 
          collapsible: true,
          children: [
            { text: "Android", link: "document/android/releasenote.html" },
            { text: "iOS", link: "document/ios/releasenote.html" },
            { text: "Web", link: "document/web/releasenote.html" },
            { text: "HarmonyOS", link: "document/harmonyos/releasenote.html" },
            { text: "小程序", link: "document/applet/releasenote.html" },
            { text: "Flutter", link: "document/flutter/releasenote.html" },
            { text: "React Native", link: "document/react-native/releasenote.html" },
            { text: "Unity", link: "document/unity/releasenote.html" },
            { text: "Windows", link: "document/windows/releasenote.html" },
          ],
        },  
      ],
    },
    { text: "聊天集成（含 UI）", 
          collapsible: true,
          children: [
            {
              text: "了解界面库",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatuikit/android/chatuikit_overview.html" },
                { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_overview.html" },
                { text: "Web", link: "uikit/chatuikit/web/chatuikit_overview.html" },
                { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_overview.html" },
                { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_overview.html" },
                { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_overview.html" },
                { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_overview.html" },
              ],
            },
            {
              text: "特性介绍",
              collapsible: true,
              children: [
                {
              text: "通用",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatuikit/android/chatfeature_common.html" },
                { text: "iOS", link: "uikit/chatuikit/ios/chatfeature_common.html" },
                { text: "Web", link: "uikit/chatuikit/web/chatfeature_common.html" },
                { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatfeature_common.html" },
                { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatfeature_common.html" },
                { text: "Flutter", link: "uikit/chatuikit/flutter/chatfeature_common.html" },
                { text: "React Native", link: "uikit/chatuikit/react-native/chatfeature_common.html" },
              ],
            },
             {
              text: "会话",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatuikit/android/chatfeature_conversation.html" },
                { text: "iOS", link: "uikit/chatuikit/ios/chatfeature_conversation.html" },
                { text: "Web", link: "uikit/chatuikit/web/chatfeature_conversation.html" },
                { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatfeature_conversation.html" },
                { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatfeature_conversation.html" },
                { text: "Flutter", link: "uikit/chatuikit/flutter/chatfeature_conversation.html" },
                { text: "React Native", link: "uikit/chatuikit/react-native/chatfeature_conversation.html" },
              ],
             },
            {
              text: "消息",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatuikit/android/chatfeature_message.html" },
                { text: "iOS", link: "uikit/chatuikit/ios/chatfeature_message.html" },
                { text: "Web", link: "uikit/chatuikit/web/chatfeature_message.html" },
                { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatfeature_message.html" },
                { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatfeature_message.html" },
                { text: "Flutter", link: "uikit/chatuikit/flutter/chatfeature_message.html" },
                { text: "React Native", link: "uikit/chatuikit/react-native/chatfeature_message.html" },
              ],
            },
          ],
        },
        {
              text: "跑通示例项目",
              collapsible: true,
              children: [
                { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_run.html" },
                { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_run.html" },
                { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_overview.html" },
          ],
        },
        {
              text: "快速开始",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatuikit/android/chatuikit_quickstart.html" },
                { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_quickstart.html" },
                { text: "Web", link: "uikit/chatuikit/web/chatuikit_quickstart.html" },
                { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_quickstart.html" },
                { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_quickstart.html" },
                { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_quickstart.html" },
                { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_quickstart.html" },
          ],
        },
        {
              text: "集成 UIKit",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatuikit/android/chatuikit_integrated.html" },
                { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_integrated.html" },
                { text: "Web (React)", link: "uikit/chatuikit/web/chatuikit_integrated_react.html" },
                { text: "Web (Vue)", link: "uikit/chatuikit/web/chatuikit_integrated_vue.html" },
                { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_integrated.html" },
                { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_integrated.html" },
                { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_integrated.html" },
                { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_integrated.html" },
          ],
        },
        
        {
              text: "修改界面主题",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatuikit/android/chatuikit_theme.html" },
                { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_theme.html" },
                { text: "Web", link: "uikit/chatuikit/web/chatuikit_theme.html" },
                { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_theme.html" },
                { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_theme.html" },
                { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_theme.html" },
          ],
        },
        {
              text: "设置界面风格",
              collapsible: true,
              children: [
                {
                   text: "Android",
                   collapsible: true,
                   children: [
                  { text: "聊天页面", link: "uikit/chatuikit/android/chatuikit_chat.html" },
                  { text: "会话列表页面", link: "uikit/chatuikit/android/chatuikit_conversation.html" },
                  { text: "通讯录页面", link: "uikit/chatuikit/android/chatuikit_contactlist.html" },
                  { text: "联系人详情页面", link: "uikit/chatuikit/android/chatuikit_custom_contact_details.html" },
                  { text: "群组详情页面", link: "uikit/chatuikit/android/chatuikit_custom_group_details.html" },
                  { text: "全局配置", link: "uikit/chatuikit/android/chatuikit_global_setting.html" },
                ],
                },
                {
                   text: "iOS",
                   collapsible: true,
                   children: [
                  { 
                    text: "聊天页面", 
                    collapsible: true,
                    children: [
                    { text: "自定义页面", link: "uikit/chatuikit/ios/chatuikit_custom_chat.html" },
                    { text: "实现新类型自定义消息 Cell", link: "uikit/chatuikit/ios/chatuikit_custom_cell.html" },
                    ],
                  },  
                  { text: "会话列表页面", link: "uikit/chatuikit/ios/chatuikit_custom_conversation_list.html" },
                  { text: "通讯录页面", link: "uikit/chatuikit/ios/chatuikit_custom_contact_list.html" },
                  { text: "联系人详情页面", link: "uikit/chatuikit/ios/chatuikit_custom_contact_details.html" },
                  { text: "群组详情页面", link: "uikit/chatuikit/ios/chatuikit_custom_group_details.html" },
                  { text: "全局配置", link: "uikit/chatuikit/ios/chatuikit_config_item.html" },
                  { text: "ViewModel 中可重载的方法", link: "uikit/chatuikit/ios/chatuikit_listener.html" },
                  { text: "拦截点击跳转事件", link: "uikit/chatuikit/ios/chatuikit_customize_clickjump.html" },
                  ],
                },
                {
                   text: "Web",
                   collapsible: true,
                   children: [
                  { text: "全局上下文", link: "uikit/chatuikit/web/chatuikit_context.html" },
                  { text: "登录", link: "uikit/chatuikit/web/chatuikit_login.html" },
                  { text: "事件监听器", link: "uikit/chatuikit/web/chatuikit_listener.html" },
                  { text: "聊天页面", link: "uikit/chatuikit/web/chatuikit_chat.html" },
                  { text: "会话列表页面", link: "uikit/chatuikit/web/chatuikit_conversation.html" },
                  { text: "通讯录页面", link: "uikit/chatuikit/web/chatuikit_contactlist.html" },
                  { text: "音视频通话", link: "uikit/chatuikit/web/chatuikit_video.html" },
                  ],
                },
                {
                   text: "HarmonyOS",
                   collapsible: true,
                   children: [
                  { text: "聊天页面", link: "uikit/chatuikit/harmonyos/chatuikit_chat.html" },
                  { text: "会话列表页面", link: "uikit/chatuikit/harmonyos/chatuikit_conversation.html" },
                  { text: "通讯录页面", link: "uikit/chatuikit/harmonyos/chatuikit_contactlist.html" },
                  ],
                },
                {
                   text: "Flutter",
                   collapsible: true,
                   children: [
                  { text: "聊天页面", link: "uikit/chatuikit/flutter/chatuikit_chat.html" },
                  { text: "会话列表页面", link: "uikit/chatuikit/flutter/chatuikit_conversation.html" },
                  { text: "通讯录页面", link: "uikit/chatuikit/flutter/chatuikit_contactlist.html" },
                  { text: "联系人详情页面", link: "uikit/chatuikit/flutter/chatuikit_custom_contact_details.html" },
                  { text: "群组详情页面", link: "uikit/chatuikit/flutter/chatuikit_custom_group_details.html" },
                  { text: "全局设置", link: "uikit/chatuikit/flutter/chatuikit_global_setting.html" },
                ],
                },
                {
                   text: "React Native",
                   collapsible: true,
                   children: [
                  { text: "聊天页面", link: "uikit/chatuikit/react-native/chatuikit_chat.html" },
                  { text: "会话列表页面", link: "uikit/chatuikit/react-native/chatuikit_conversation.html" },
                  { text: "通讯录页面", link: "uikit/chatuikit/react-native/chatuikit_contactlist.html" },
                  { text: "联系人详情页面", link: "uikit/chatuikit/react-native/chatuikit_custom_contact_details.html" },
                  { text: "群组详情页面", link: "uikit/chatuikit/react-native/chatuikit_custom_group_details.html" },
                ],
                },    
              ],
            },
          {
            text: "用户信息提供",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_userinfo.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_userinfo.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_provider.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_userinfo.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_userinfo.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_userinfo.html" },
         ],
        },  
        {
            text: "国际化",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_internationalization.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_internationalization.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_internationalization.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_internationalization.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_internationalization.html" },
         ],
        }, 
        {
            text: "进阶用法",
            collapsible: true,
            children: [
           { text: "Android", link: "product/uikit/chatuikit/android/chatuikit_advancedusage.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_advancedusage.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_advancedusage.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_advancedusage.html" },
         ],
        }, 
        {
            text: "本地搜索",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_search.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_search.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_feature_search.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_feature_search.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_feature_search.html" },
         ],
        }, 
        {
            text: "消息引用",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_quote.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_quote.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_quote.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_feature_quote.html" },
           { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_feature_quote.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_feature_quote.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_feature_quote.html" },
         ],
        },
        {
            text: "输入状态提示",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_typing.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_typing.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_typing.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_typing" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_typing" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_typing" },
         ],
        },
        {
            text: "消息回执",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_receipt.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_receipt.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_receipt.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_receipt.html" },
           { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_receipt.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_receipt.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_receipt.html" },
         ],
        },
        {
            text: "表情回复",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_reaction.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_reaction.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_reaction.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_reaction.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_reaction.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_reaction.html" },
         ],
        },
        {
            text: "群组 @ 提及",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_@.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_@.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_@.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_@.html" },
           { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_@.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_@.html" },
         ],
        },
        {
            text: "消息翻译",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_translation.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_translation.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_translation.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_translation.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_translation.html" },
         ],
        },
        {
            text: "消息话题",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_thread.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_thread.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_thread.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_thread.html" },
           { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_thread.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_thread.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_thread.html" },
         ],
        },
        {
            text: "消息合并转发",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_forward.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_forward.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_@.html" },
           { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_@.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_@.html" },
         ],
        },
        {
            text: "消息置顶",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_pin.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_pin.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_@.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_@.html" },
           { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_@.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_@.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_@.html" },
         ],
        },
        {
            text: "组件文档",
            collapsible: true,
            children: [
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_storybook.html" },
         ],
        },
        {
            text: "更新日志",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/releasenote.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/releasenote.html" },
           { text: "Web", link: "uikit/chatuikit/web/releasenote.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/releasenote.html" },
           { text: "Uniapp", link: "uikit/chatuikit/uniapp/releasenote.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/releasenote.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/releasenote.html" },
         ],
        },
        {
            text: "设计文档",
            collapsible: true,
            children: [
           { text: "设计指南", link: "uikit/chatuikit/chatuikit_design_guide.html" },
         ],
        },
        {
            text: "历史文档",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/releasenote.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/releasenote.html" },
           { text: "Web", link: "uikit/chatuikit/web/releasenote.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/releasenote.html" },
           { text: "Uniapp", link: "uikit/chatuikit/uniapp/releasenote.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/releasenote.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/releasenote.html" },
         ],
        },
      ],
    },
    {
      text: "内容审核",
      collapsible: true,
      children: [
        {
          text: "产品简介",
          collapsible: true,
          children: [
            { text: "产品概述", link: "moderation/moderation_overview.html" },
          ],
        },
        {
          text: "产品定价",
          collapsible: true,
          children: [
            {
              text: "国内计费说明",
              link: "moderation/moderation_billing_domestic.html",
            },
            {
              text: "海外计费说明",
              link: "moderation/moderation_billing_overseas.html",
            },
          ],
        },

        {
          text: "快速开始",
          collapsible: true,
          children: [
            { text: "开通审核服务", link: "moderation/moderation_enable.html" },
            {
              text: "规则配置",
              link: "moderation/moderation_rule_config.html",
            },
            { text: "规则测试", link: "moderation/moderation_rule_test.html" },
            { text: "历史记录", link: "moderation/moderation_history.html" },
            { text: "关键词审核", link: "moderation/keyword_review.html" },
            {
              text: "消息审核机制",
              link: "moderation/moderation_mechanism.html",
            },
          ],
        },
        {
          text: "进阶功能",
          collapsible: true,
          children: [
            {
              text: "审核记录回调",
              link: "moderation/moderation_record_callback.html",
            },
            {
              text: "消息人工审核",
              link: "moderation/moderation_manual_review.html",
            },
            { text: "用户管理", link: "moderation/moderation_usermgmt.html" },
          ],
        },
        {
          text: "常见问题",
          collapsible: true,
          children: [
            {
              text: "如何开始使用内容审核服务？",
              link: "moderation/moderation_use_console.html",
            },
            {
              text: "如何新增自定义词？",
              link: "moderation/moderation_add_word.html",
            },
            {
              text: "为什么处置方式选择了替换***，但实际被拦截了没有发出来？",
              link: "moderation/moderation_replace_refuse.html",
            },
          ],
        },
      ],
    },
    {
      text: "场景方案",
      collapsible: true,
      children: [
        {
          text: "环信 AIGC",
          collapsible: true,
          children: [
            { text: "方案介绍", link: "aigc/aigc_scenario_introduction.html" },
            { text: "方案选择", link: "aigc/aigc_selection.html" },

            { 
              text: "方案一",
              collapsible: false,
              children: [
                { text: "服务端配置", link: "aigc/aigc_run_through_demo_server.html" },
                { text: "客户端配置", link: "aigc/aigc_run_through_demo_client.html" },
              ], 
            }, 
            { 
              text: "方案二",
              collapsible: false,
              children: [
                { text: "使用 AI 智能功能", link: "aigc/aigc_use.html" },
                { text: "REST API", link: "aigc/aigc_rest_api.html" },
                ], 
            }, 
          ], 
        },   
        {
          text: "超级社区",
          collapsible: true,
          children: [
            { text: "产品概述", link: "circle/circle_overview.html" },
            {
              text: "快速开始",
              collapsible: false,
              children: [
                {
                  text: "Android 快速开始",
                  link: "circle/circle_quickstart_android.html",
                },
                {
                  text: "iOS 快速开始",
                  link: "circle/circle_quickstart_ios.html",
                },
                {
                  text: "Web 快速开始",
                  link: "circle/circle_quickstart_web.html",
                },
              ],
            },
            {
              text: "集成说明",
              collapsible: false,
              children: [
                {
                  text: "Android 社区管理",
                  link: "circle/server_mgmt_android.html",
                },
                {
                  text: "Android 频道管理",
                  link: "circle/channel_mgmt_android.html",
                },
                {
                  text: "Android 频道分组管理",
                  link: "circle/category_mgmt_android.html",
                },
                { text: "iOS 社区管理", link: "circle/server_mgmt_ios.html" },
                { text: "iOS 频道管理", link: "circle/channel_mgmt_ios.html" },
                {
                  text: "iOS 频道分组管理",
                  link: "circle/category_mgmt_ios.html",
                },
                { text: "Web 社区管理", link: "circle/server_mgmt_web.html" },
                { text: "Web 频道管理", link: "circle/channel_mgmt_web.html" },
                {
                  text: "Web 频道分组管理",
                  link: "circle/category_mgmt_web.html",
                },
              ],
            },
            {
              text: "错误码",
              collapsible: false,
              children: [
                {
                  text: "Android 错误码",
                  link: "circle/circle_errorcode_android.html",
                },
                {
                  text: "iOS 错误码",
                  link: "circle/circle_errorcode_ios.html",
                },
                {
                  text: "Web 错误码",
                  link: "circle/circle_errorcode_web.html",
                },
              ],
            },
            {
              text: "API 参考",
              collapsible: true,
              children: [
                { text: "REST 社区管理", link: "circle/server_mgmt_rest.html" },
                {
                  text: "REST 频道管理",
                  link: "circle/channel_mgmt_rest.html",
                },
                {
                  text: "REST 频道分组管理",
                  link: "circle/category_mgmt_rest.html",
                },
                {
                  text: "Android API 参考",
                  link: "circle/api_reference_android.html",
                },
                { text: "iOS API 参考", link: "circle/api_reference_ios.html" },
                { text: "Web API 参考", link: "circle/api_reference_web.html" },
              ],
            },
          ],
        },
        {
          text: "语聊房",
          collapsible: true,
          children: [
            {
              text: "场景概览",
              collapsible: false,
              children: [
                {
                  text: "场景介绍",
                  link: "voiceroom/demo_scenario_introduction.html",
                },
                {
                  text: "Demo 体验（Android/iOS）",
                  link: "voiceroom/demo_experience.html",
                },
              ],
            },
            {
              text: "快速开始",
              collapsible: false,
              children: [
                {
                  text: "跑通示例项目（Android）",
                  link: "voiceroom/run_through_demo_android.html",
                },
                {
                  text: "跑通示例项目（iOS）",
                  link: "voiceroom/run_through_demo_ios.html",
                },
              ],
            },
            {
              text: "实现流程",
              collapsible: false,
              children: [
                {
                  text: "客户端实现（Android）",
                  link: "voiceroom/client_implementation_android.html",
                },
                {
                  text: "客户端实现（iOS）",
                  link: "voiceroom/client_implementation_ios.html",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      text: 'AI 会话摘要助手',
      collapsible: true,
      children: [
        { text: '效果展示及开通', link: 'plug-in/conversation_summary_enable.html' },
        { text: '集成指南', 
          collapsible: true,
          children: [
            { text: "RESTful API", link: "plug-in/conversation_summary_restful.html" },
          ],  
        },
      ], 
    },
    {
      text: "常见方案",
      collapsible: true,
      children: [
        { text: "群 @ 消息", link: "solution_common/group_@.html" },
        { text: "消息引用", link: "solution_common/message_quote.html" },
        { text: "实现输入指示器", link: "solution_common/typing_indication.html" },
        { text: "迁移到环信", link: "solution_common/migrate_to_easemob.html" },
      ],
    },
    {
      text: "FAQ",
      collapsible: true,
      children: [
        { text: "FAQ 质量", link: "faq_quality_issues.html" },
        { text: "FAQ 集成", link: "faq_integration_issues.html" },
        { text: "帮助中心", link: "help.html" },
      ],
    },
    {
      text: "安全",
      collapsible: true,
      children: [
        { text: "安全最佳实践", link: "security_best_practices.html" },
        { text: "GDPR 安全合规", link: "GDPR.html" },
      ],
    },
    {
      text: "Console 指南",
      collapsible: true,
      children: [
        { text: "开通和配置服务", link: "enable_and_configure_IM.html" },
        { text: "消息量统计", link: "message_statistics.html" },
        { text: "请求质量概览", link: "request_quality_overview.html" },
      ],
    },
    { text: "术语表", 
      collapsible: true,
      children: [
        { text: "术语表", link: "glossary.html" },
      ],
    },
  ],  
  ...DOC_SIDEBAR,
  ...CHAT_UIKIT_SIDEBAR,
  ...CHATROOM_UIKIT_SIDEBAR,
  "/private/im/": PRIVATE_IM_SIDEBAR,
  "/private/media/": PRIVATE_MEDIA_SIDEBAR,
  "/push": PUSH_SIDEBAR,
});
