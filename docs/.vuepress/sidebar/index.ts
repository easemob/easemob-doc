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
        { text: "产品概述", link: "product/introduction.html" },
        { text: "应用场景", link: "product/application_scenario.html" },
        { text: "功能介绍", 
            collapsible: true,
            children: [
              { text: "功能列表", link: "product/product_function.html" },
              { text: "功能详情", link: "product/conversation_function.html" },
            ],
          },
        { text: "账号系统", 
          collapsible: true,
          children: [
            { text: "用户注册与登录", link: "product/product_user_registration_login.html" },
            { text: "在线状态管理", link: "product/product_user_presence.html" },
          ],
        },
        { text: "用户属性与用户关系", 
          collapsible: true,
          children: [
            { text: "用户属性", link: "product/product_user_attribute.html" },
            { text: "用户关系", link: "product/product_user_relationship.html" },
          ],
        },
        { text: "消息管理", 
          collapsible: true,
          children: [
            { text: "单聊消息", link: "product/message_single_chat.html" },
            { text: "群组消息", link: "product/message_group.html" },
            { text: "聊天室消息", link: "product/message_chatroom.html" },
            { text: "消息存储", link: "product/message_store.html" },
            { text: "消息格式", link: "product/product_message_format.html" },
          ],
        },
        { text: "离线推送", link: "product/product_offline_push_overview.html" },
        { text: "群组管理", 
          collapsible: true,
          children: [
            { text: "群组概述", link: "product/product_group_overview.html" },
            { text: "子区", link: "product/product_thread_overview.html" },
          ],
        },
        { text: "聊天室", link: "product/product_chatroom_overview.html" },
        { text: "内容审核", link: "product/moderation/moderation_overview.html" },
        { text: "使用限制", link: "product/limitation.html" },
        { text: "数据中心", link: "product/data_center.html" },
      ],
    },
    { text: "购买指南", 
      collapsible: true,
      children: [
        { text: "计费策略", link: "product/pricing_policy.html"},
        { text: "套餐包功能对比", link: "product/product_package_feature.html"},
        { text: "购买指引", link: "product/pricing_method.html" },
      ],
    }, 
    {
      text: "Demo",
      collapsible: true,
      children: [
        { text: "体验 Demo", link: "product/demo.html" },
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
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_typing.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_feature_typing" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_feature_typing" },
         ],
        },
        {
            text: "消息回执",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_receipt.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_receipt.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_receipt.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_feature_receipt.html" },
           { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_feature_receipt.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_feature_receipt.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_feature_receipt.html" },
         ],
        },
        {
            text: "表情回复",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_reaction.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_reaction.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_reaction.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_feature_reaction.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_feature_reaction.html" },
         ],
        },
        {
            text: "群组 @ 提及",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_@.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_@.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_@.html" },
           { text: "HarmonyOS", link: "uikit/chatuikit/harmonyos/chatuikit_feature_@.html" },
           { text: "Uniapp", link: "uikit/chatuikit/uniapp/chatuikit_feature_@.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_feature_@.html" },
         ],
        },
        {
            text: "消息翻译",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_translation.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_translation.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_translation.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_feature_translation.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_feature_translation.html" },
         ],
        },
        {
            text: "消息话题",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_thread.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_thread.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_thread.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_feature_thread.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_thread.html" },
         ],
        },
        {
            text: "消息合并转发",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_forward.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_forward.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_forward.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_feature_forward.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_feature_forward.html" },
         ],
        },
        {
            text: "消息置顶",
            collapsible: true,
            children: [
           { text: "Android", link: "uikit/chatuikit/android/chatuikit_feature_pin.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/chatuikit_feature_pin.html" },
           { text: "Web", link: "uikit/chatuikit/web/chatuikit_feature_pin.html" },
           { text: "Flutter", link: "uikit/chatuikit/flutter/chatuikit_feature_pin.html" },
           { text: "React Native", link: "uikit/chatuikit/react-native/chatuikit_feature_pin.html" },
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
           { text: "Android", link: "uikit/chatuikit/android/ui_historic.html" },
           { text: "iOS", link: "uikit/chatuikit/ios/ui_historic.html" },
           {
            text: "Flutter",
            collapsible: true,
            children: [
           { text: "UIKit 介绍", link: "uikit/chatuikit/flutter/ui_overview.html" },
           { text: "快速开始", link: "uikit/chatuikit/flutter/ui_quickstart.html" },
           { text: "集成聊天页面", link: "uikit/chatuikit/flutter/ui_chat.html" },
           { text: "集成会话列表页面", link: "uikit/chatuikit/flutter/ui_conversation.html" },
           ],
          },
          {
            text: "React Native",
            collapsible: true,
            children: [
           { text: "UIKit 介绍", link: "uikit/chatuikit/react-native/ui_overview.html" },
           { text: "快速开始", link: "uikit/chatuikit/react-native/ui_quickstart.html" },
           { text: "集成聊天页面", link: "uikit/chatuikit/react-native/ui_chat.html" },
           { text: "集成会话列表页面", link: "uikit/chatuikit/react-native/ui_conversation.html" },
           ],
          },
         ],
        },
        { text: "聊天室（含 UI）", 
          collapsible: true,
          children: [
            {
              text: "概述",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatroomuikit/android/roomuikit_overview.html" },
                { text: "iOS", link: "uikit/chatroomuikit/ios/roomuikit_overview.html" },
                { text: "Web", link: "uikit/chatroomuikit/web/roomuikit_overview.html" },
                { text: "Flutter", link: "uikit/chatroomuikit/flutter/roomuikit_overview.html" },
                { text: "React Native", link: "uikit/chatroomuikit/react-native/roomuikit_overview.html" },
              ],
            },
            {
              text: "特性介绍",
              collapsible: true,
              children: [
                { text: "通用", link: "uikit/chatroomuikit/roomfeature_common.html" },
                { text: "消息扩展", link: "uikit/chatroomuikit/roomfeature_message.html" },
                { text: "成员管理", link: "uikit/chatroomuikit/roomfeature_member.html" },
              ],
            },
            {
              text: "跑通示例项目",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatroomuikit/android/roomuikit_run.html" },
                { text: "iOS", link: "uikit/chatroomuikit/ios/roomuikit_run.html" },
                { text: "Web", link: "uikit/chatroomuikit/web/roomuikit_run.html" },
                { text: "Flutter", link: "uikit/chatroomuikit/flutter/roomuikit_run.html" },
                { text: "React Native", link: "uikit/chatroomuikit/react-native/roomuikit_run.html" },
              ],
            },
            {
              text: "集成聊天室 UIKit",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatroomuikit/android/roomuikit_integrated.html" },
                { text: "iOS", link: "uikit/chatroomuikit/ios/roomuikit_integrated.html" },
                { text: "Web", link: "uikit/chatroomuikit/web/roomuikit_integrated.html" },
                { text: "Flutter", link: "uikit/chatroomuikit/flutter/roomuikit_integrated.html" },
                { text: "React Native", link: "uikit/chatroomuikit/react-native/roomuikit_integrated.html" },
              ],
            },
            {
              text: "快速开始",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatroomuikit/android/roomuikit_quickstart.html" },
                { text: "iOS", link: "uikit/chatroomuikit/ios/roomuikit_quickstart.html" },
                { text: "Web", link: "uikit/chatroomuikit/web/roomuikit_quickstart.html" },
                { text: "Flutter", link: "uikit/chatroomuikit/flutter/roomuikit_quickstart.html" },
                { text: "React Native", link: "uikit/chatroomuikit/react-native/roomuikit_quickstart.html" },
              ],
            },
            {
              text: "最佳实践",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatroomuikit/android/roomuikit_best_practice.html" },
                { text: "iOS", link: "uikit/chatroomuikit/ios/roomuikit_best_practice.html" },
                { text: "Web", link: "uikit/chatroomuikit/web/roomuikit_best_practice.html" },
                { text: "Flutter", link: "uikit/chatroomuikit/flutter/roomuikit_best_practice.html" },
                { text: "React Native", link: "uikit/chatroomuikit/react-native/roomuikit_best_practice.html" },
              ],
            },
            {
              text: "可配置项",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatroomuikit/android/roomuikit_config_item.html" },
                { text: "iOS", link: "uikit/chatroomuikit/ios/roomuikit_config_item.html" },
                { text: "Web", link: "uikit/chatroomuikit/web/roomuikit_config_item.html" },
                { text: "Flutter", link: "uikit/chatroomuikit/flutter/roomuikit_config_item.html" },
                { text: "React Native", link: "uikit/chatroomuikit/react-native/roomuikit_config_item.html" },
              ],
            },
            {
              text: "主题",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatroomuikit/android/roomuikit_theme.html" },
                { text: "iOS", link: "uikit/chatroomuikit/ios/roomuikit_theme.html" },
                { text: "Web", link: "uikit/chatroomuikit/web/roomuikit_theme.html" },
                { text: "Flutter", link: "uikit/chatroomuikit/flutter/roomuikit_theme.html" },
                { text: "React Native", link: "uikit/chatroomuikit/react-native/roomuikit_theme.html" },
              ],
            },
            {
              text: "自定义",
              collapsible: true,
              children: [
                { text: "iOS", link: "uikit/chatroomuikit/ios/roomuikit_customize.html" },
                { text: "Web", link: "uikit/chatroomuikit/web/roomuikit_customize.html" },
                { text: "React Native", link: "uikit/chatroomuikit/react-native/roomuikit_customize.html" },
              ],
            },
            {
              text: "组件文档",
              collapsible: true,
              children: [
                { text: "Web", link: "uikit/chatroomuikit/web/roomuikit_storybook.html" },
              ],
            },
            {
              text: "更新日志",
              collapsible: true,
              children: [
                { text: "Android", link: "uikit/chatroomuikit/android/roomuikit_releasenote.html" },
                { text: "iOS", link: "uikit/chatroomuikit/ios/roomuikit_releasenote.html" },
                { text: "Web", link: "uikit/chatroomuikit/web/roomuikit_releasenote.html" },
                { text: "Flutter", link: "uikit/chatroomuikit/flutter/roomuikit_releasenote.html" },
                { text: "React Native", link: "uikit/chatroomuikit/react-native/roomuikit_releasenote.html" },
              ],
            },
            {
              text: "设计指南",
              collapsible: true,
              children: [
                { text: "设计指南", link: "uikit/chatroomuikit/design_guide.html" },
              ],
            },
          ],
        },   
      ],
   },
   {
      text: "音视频通话（含 UI）",
      collapsible: true,
      children: [
        { text: "Android", link: "document/android/easecallkit.html" },
        { text: "ios", link: "document/ios/easecallkit.html" },
        { text: "Web", link: "document/web/easecallkit.html" },
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
        { text: '效果展示及开通', link: 'product/plug-in/conversation_summary_enable.html' },
        { text: '集成指南', 
          collapsible: true,
          children: [
            { text: "REST API", link: "product/plug-in/conversation_summary_restful.html" },
          ],  
        },
      ], 
    },
    {
      text: "常见方案",
      collapsible: true,
      children: [
        { text: "群 @ 消息", link: "product/solution_common/group_@.html" },
        { text: "消息引用", link: "product/solution_common/message_quote.html" },
        { text: "实现输入指示器", link: "product/solution_common/typing_indication.html" },
        { text: "迁移到环信", link: "product/solution_common/migrate_to_easemob.html" },
      ],
    },
    {
      text: "无 UI 集成",
      collapsible: true,
      children: [
        {
          text: "集成 SDK",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/integration.html" },
          { text: "iOS", link: "document/ios/integration.html" },
          { text: "Web", link: "document/web/integration.html" },
          { text: "HarmonyOS", link: "document/harmonyos/integration.html" },
          {
          text: "小程序",
          collapsible: true,
          children: [
          { text: "小程序全平台解决方案", link: "document/applet/overview.html" },
          { text: "微信小程序", link: "document/applet/wechat.html" },
          { text: "QQ 小程序", link: "document/applet/qq.html" },
          { text: "百度小程序", link: "document/applet/baidu.html" },
          { text: "抖音小程序", link: "document/applet/bytedance.html" },
          { text: "支付宝小程序", link: "document/applet/alipay.html" },
          { text: "Uniapp 全平台", link: "document/applet/uniapp.html" },
          ],
        },
          { text: "Flutter", link: "document/flutter/integration.html" },
          { text: "React Native", link: "document/react-native/integration.html" },
          { text: "Unity", link: "document/unity/integration.html" },
          { text: "Windows", link: "document/windows/integration.html" },
          ],
        },
        {
          text: "初始化",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/initialization.html" },
          { text: "iOS", link: "document/ios/initialization.html" },
          { text: "Web", link: "document/web/initialization.html" },
          { text: "HarmonyOS", link: "document/harmonyos/initialization.html" },
          { text: "小程序", link: "document/applet/initialization.html" },
          { text: "Flutter", link: "document/flutter/initialization.html" },
          { text: "React Native", link: "document/react-native/initialization.html" },
          { text: "Unity/Windows", link: "document/unity/initialization.html" },
          ],
        },
        {
          text: "登录",
          collapsible: true,
          children: [
          {
          text: "登录介绍",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/login.html" },
          { text: "iOS", link: "document/ios/login.html" },
          { text: "Web", link: "document/web/login.html" },
          { text: "HarmonyOS", link: "document/harmonyos/login.html" },
          { text: "小程序", link: "document/applet/login.html" },
          { text: "Flutter", link: "document/flutter/login.html" },
          { text: "React Native", link: "document/react-native/login.html" },
          { text: "Unity/Windows", link: "document/unity/login.html" },
           ],
          },
          {
          text: "连接",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/connection.html" },
          { text: "iOS", link: "document/ios/connection.html" },
          { text: "Web", link: "document/web/connection.html" },
          { text: "HarmonyOS", link: "document/harmonyos/connection.html" },
          { text: "小程序", link: "document/applet/connection.html" },
          { text: "Flutter", link: "document/flutter/connection.html" },
          { text: "React Native", link: "document/react-native/connection.html" },
          { text: "Unity/Windows", link: "document/unity/connection.html" },
          ],
        },
          {
          text: "多设备登录",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/multi_device.html" },
          { text: "iOS", link: "document/ios/multi_device.html" },
          { text: "Web/小程序", link: "document/web/multi_device.html" },
          { text: "HarmonyOS", link: "document/harmonyos/multi_device.html" },
          { text: "Flutter", link: "document/flutter/multi_device.html" },
          { text: "React Native", link: "document/react-native/multi_device.html" },
          { text: "Unity/Windows", link: "document/unity/multi_device.html" },
          ],
        },
          ],
        },
        {
          text: "消息管理",
          collapsible: true,
          children: [
          { text: "消息概述", link: "document/message_overview.html" }, 
          {
          text: "发送和接收消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_send_receive.html" },
          { text: "iOS", link: "document/ios/message_send_receive.html" },
          { text: "Web", link: "document/web/message_send_receive.html" },
          { text: "HarmonyOS", link: "document/harmonyos/message_send_receive.html" },
          { text: "小程序", link: "document/applet/message_send_receive.html" },
          { text: "Flutter", link: "document/flutter/message_send_receive.html" },
          { text: "React Native", link: "document/react-native/message_send_receive.html" },
          { text: "Unity", link: "document/unity/message_send_receive.html" },
          { text: "Windows", link: "document/windows/message_send_receive.html" },
           ],
          },
          {
          text: "获取历史消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_retrieve.html" },
          { text: "iOS", link: "document/ios/message_retrieve.html" },
          { text: "Web/小程序", link: "document/web/message_retrieve.html" },
          { text: "HarmonyOS", link: "document/harmonyos/message_retrieve.html" },
          { text: "Flutter", link: "document/flutter/message_retrieve.html" },
          { text: "React Native", link: "document/react-native/message_retrieve.html" },
          { text: "Unity/Windows", link: "document/unity/message_retrieve.html" },
          ],
        },
          {
          text: "撤回消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_recall.html" },
          { text: "iOS", link: "document/ios/message_recall.html" },
          { text: "Web/小程序", link: "document/web/message_recall.html" },
          { text: "HarmonyOS", link: "document/harmonyos/message_recall.html" },
          { text: "Flutter", link: "document/flutter/message_recall.html" },
          { text: "React Native", link: "document/react-native/message_recall.html" },
          { text: "Unity/Windows", link: "document/unity/message_recall.html" },
          ],
        },
        {
          text: "搜索消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_search.html" },
          { text: "iOS", link: "document/ios/message_search.html" },
          { text: "HarmonyOS", link: "document/harmonyos/message_search.html" },
          { text: "Flutter", link: "document/flutter/message_search.html" },
          { text: "React Native", link: "document/react-native/message_search.html" },
          { text: "Unity/Windows", link: "document/unity/message_search.html" },
          ],
        },
        {
          text: "消息回执",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_receipt.html" },
          { text: "iOS", link: "document/ios/message_receipt.html" },
          { text: "Web", link: "document/web/message_receipt.html" },
          { text: "HarmonyOS", link: "document/harmonyos/message_receipt.html" },
          { text: "Web/小程序", link: "document/web/message_receipt.html" },
          { text: "Flutter", link: "document/flutter/message_receipt.html" },
          { text: "React Native", link: "document/react-native/message_receipt.html" },
          { text: "Unity/Windows", link: "document/unity/message_receipt.html" },
          ],
        },
        {
          text: "修改消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_modify.html" },
          { text: "iOS", link: "document/ios/message_modify.html" },
          { text: "Web/小程序", link: "document/web/message_modify.html" },
          { text: "HarmonyOS", link: "document/harmonyos/message_modify.html" },
          { text: "Flutter", link: "document/flutter/message_modify.html" },
          { text: "React Native", link: "document/react-native/message_modify.html" },
          { text: "Unity/Windows", link: "document/unity/message_modify.html" },
          ],
        },
        {
          text: "消息表情回复",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/reaction.html" },
          { text: "iOS", link: "document/ios/reaction.html" },
          { text: "Web/小程序", link: "document/web/reaction.html" },
          { text: "HarmonyOS", link: "document/harmonyos/reaction.html" },
          { text: "Flutter", link: "document/flutter/reaction.html" },
          { text: "React Native", link: "document/react-native/reaction.html" },
          { text: "Unity/Windows", link: "document/unity/reaction.html" },
          ],
        },
        {
          text: "转发消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/reaction.html" },
          { text: "iOS", link: "document/ios/reaction.html" },
          { text: "HarmonyOS", link: "document/harmonyos/reaction.html" },
          { text: "Flutter", link: "document/flutter/reaction.html" },
          { text: "React Native", link: "document/react-native/reaction.html" },
          { text: "Unity/Windows", link: "document/unity/reaction.html" },
          ],
        },
        {
          text: "导入和插入消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_import_insert.html" },
          { text: "iOS", link: "document/ios/message_import_insert.html" },
          { text: "HarmonyOS", link: "document/harmonyos/message_import_insert.html" },
          { text: "Flutter", link: "document/flutter/message_import_insert.html" },
          { text: "React Native", link: "document/react-native/message_import_insert.html" },
          { text: "Unity/Windows", link: "document/unity/message_import_insert.html" },
          ],
        },
        {
          text: "更新消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_update.html" },
          { text: "iOS", link: "document/ios/message_update.html" },
          { text: "HarmonyOS", link: "document/harmonyos/message_update.html" },
          { text: "Flutter", link: "document/flutter/message_update.html" },
          { text: "React Native", link: "document/react-native/message_update.html" },
          { text: "Unity/Windows", link: "document/unity/message_update.html" },
          ],
        },
        {
          text: "删除消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_delete.html" },
          { text: "iOS", link: "document/ios/message_delete.html" },
          { text: "Web/小程序", link: "document/web/message_delete.html" },
          { text: "HarmonyOS", link: "document/harmonyos/message_delete.html" },
          { text: "Flutter", link: "document/flutter/message_delete.html" },
          { text: "React Native", link: "document/react-native/message_delete.html" },
          { text: "Unity/Windows", link: "document/unity/message_delete.html" },
          ],
        },
        {
          text: "置顶消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_pin.html" },
          { text: "iOS", link: "document/ios/message_pin.html" },
          { text: "Web/小程序", link: "document/web/message_pin.html" },
          { text: "HarmonyOS", link: "document/harmonyos/message_pin.html" },
          { text: "Flutter", link: "document/flutter/message_pin.html" },
          { text: "React Native", link: "document/react-native/message_pin.html" },
          { text: "Unity/Windows", link: "document/unity/message_pin.html" },
          ],
        },
        {
          text: "翻译消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_translation.html" },
          { text: "iOS", link: "document/ios/message_translation.html" },
          { text: "Web/小程序", link: "document/web/message_translation.html" },
          { text: "Flutter", link: "document/flutter/message_translation.html" },
          { text: "React Native", link: "document/react-native/message_translation.html" },
          { text: "Unity/Windows", link: "document/unity/message_translation.html" },
          ],
        },
        {
          text: "只投在线",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_deliver_only_online.html" },
          { text: "iOS", link: "document/ios/message_deliver_only_online.html" },
          { text: "Web/小程序", link: "document/web/message_deliver_only_online.html" },
          { text: "Flutter", link: "document/flutter/message_deliver_only_online.html" },
          { text: "React Native", link: "document/react-native/message_deliver_only_online.html" },
          { text: "Unity/Windows", link: "document/unity/message_deliver_only_online.html" },
          ],
        },
        {
          text: "消息审核（举报）",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/moderation.html" },
          { text: "iOS", link: "document/ios/moderation.html" },
          { text: "Web/小程序", link: "document/web/moderation.html" },
          { text: "Flutter", link: "document/flutter/moderation.html" },
          { text: "React Native", link: "document/react-native/moderation.html" },
          { text: "Unity/Windows", link: "document/unity/moderation.html" },
          ],
        },
        {
          text: "获取消息流量统计",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/message_traffic_statis.html" },
          { text: "iOS", link: "document/ios/message_traffic_statis.html" },
          ],
        },
       ],
      },
      {
      text: "会话管理",
      collapsible: true,
      children: [
        {
          text: "会话介绍",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/conversation_overview.html" },
          { text: "iOS", link: "document/ios/conversation_overview.html" },
          { text: "Web/小程序", link: "document/web/conversation_overview.html" },
          { text: "Flutter", link: "document/flutter/conversation_overview.html" },
          { text: "React Native", link: "document/react-native/conversation_overview.html" },
          { text: "Unity/Windows", link: "document/unity/conversation_overview.html" },
          ],
        }, 
        {
          text: "会话列表",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/conversation_list.html" },
          { text: "iOS", link: "document/ios/conversation_list.html" },
          { text: "Web/小程序", link: "document/web/conversation_list.html" },
          { text: "HarmonyOS", link: "document/harmonyos/conversation_list.html" },
          { text: "Flutter", link: "document/flutter/conversation_list.html" },
          { text: "React Native", link: "document/react-native/conversation_list.html" },
          { text: "Unity/Windows", link: "document/unity/conversation_list.html" },
          ],
        },  
        {
          text: "会话已读回执",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/conversation_receipt.html" },
          { text: "iOS", link: "document/ios/conversation_receipt.html" },
          { text: "Web/小程序", link: "document/web/conversation_receipt.html" },
          { text: "HarmonyOS", link: "document/harmonyos/conversation_receipt.html" },
          { text: "Flutter", link: "document/flutter/conversation_receipt.html" },
          { text: "React Native", link: "document/react-native/conversation_receipt.html" },
          { text: "Unity/Windows", link: "document/unity/conversation_receipt.html" },
          ],
        }, 
        {
          text: "会话未读数",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/conversation_unread.html" },
          { text: "iOS", link: "document/ios/conversation_unread.html" },
          { text: "Web/小程序", link: "document/web/conversation_unread.html" },
          { text: "HarmonyOS", link: "document/harmonyos/conversation_unread.html" },
          { text: "Flutter", link: "document/flutter/conversation_unread.html" },
          { text: "React Native", link: "document/react-native/conversation_unread.html" },
          { text: "Unity/Windows", link: "document/unity/conversation_unread.html" },
          ],
        }, 
        {
          text: "置顶会话",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/conversation_pin.html" },
          { text: "iOS", link: "document/ios/conversation_pin.html" },
          { text: "Web/小程序", link: "document/web/conversation_pin.html" },
          { text: "HarmonyOS", link: "document/harmonyos/conversation_pin.html" },
          { text: "Flutter", link: "document/flutter/conversation_pin.html" },
          { text: "React Native", link: "document/react-native/conversation_pin.html" },
          { text: "Unity/Windows", link: "document/unity/conversation_pin.html" },
          ],
        }, 
        {
          text: "会话标记",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/conversation_mark.html" },
          { text: "iOS", link: "document/ios/conversation_mark.html" },
          { text: "Web/小程序", link: "document/web/conversation_mark.html" },
          { text: "HarmonyOS", link: "document/harmonyos/conversation_mark.html" },
          { text: "Flutter", link: "document/flutter/conversation_mark.html" },
          { text: "React Native", link: "document/react-native/conversation_mark.html" },
          { text: "Unity/Windows", link: "document/unity/conversation_mark.html" },
          ],
        }, 
        {
          text: "删除会话",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/conversation_delete.html" },
          { text: "iOS", link: "document/ios/conversation_delete.html" },
          { text: "Web/小程序", link: "document/web/conversation_delete.html" },
          { text: "HarmonyOS", link: "document/harmonyos/conversation_delete.html" },
          { text: "Flutter", link: "document/flutter/conversation_delete.html" },
          { text: "React Native", link: "document/react-native/conversation_delete.html" },
          { text: "Unity/Windows", link: "document/unity/conversation_delete.html" },
          ],
        }, 
      ],
    },
    {
      text: "群组管理",
      collapsible: true,
      children: [
        { text: "群组概述", link: "document/group_overview.html" },
        {
          text: "创建和管理群组",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/group_manage.html" },
          { text: "iOS", link: "document/ios/group_manage.html" },
          { text: "Web/小程序", link: "document/web/group_manage.html" },
          { text: "HarmonyOS", link: "document/harmonyos/group_manage.html" },
          { text: "Flutter", link: "document/flutter/group_manage.html" },
          { text: "React Native", link: "document/react-native/group_manage.html" },
          { text: "Unity/Windows", link: "document/unity/group_manage.html" },
          ],
        }, 
        {
          text: "管理群组成员",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/group_members.html" },
          { text: "iOS", link: "document/ios/group_members.html" },
          { text: "Web/小程序", link: "document/web/group_members.html" },
          { text: "HarmonyOS", link: "document/harmonyos/group_members.html" },
          { text: "Flutter", link: "document/flutter/group_members.html" },
          { text: "React Native", link: "document/react-native/group_members.html" },
          { text: "Unity/Windows", link: "document/unity/group_members.html" },
          ],
        },
        {
          text: "管理群组属性",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/group_attributes.html" },
          { text: "iOS", link: "document/ios/group_attributes.html" },
          { text: "Web/小程序", link: "document/web/group_attributes.html" },
          { text: "HarmonyOS", link: "document/harmonyos/group_attributes.html" },
          { text: "Flutter", link: "document/flutter/group_attributes.html" },
          { text: "React Native", link: "document/react-native/group_attributes.html" },
          { text: "Unity/Windows", link: "document/unity/group_attributes.html" },
          ],
        },
        {
          text: "管理子区",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/thread.html" },
          { text: "iOS", link: "document/ios/thread.html" },
          { text: "Web/小程序", link: "document/web/thread.html" },
          { text: "HarmonyOS", link: "document/harmonyos/thread.html" },
          { text: "Flutter", link: "document/flutter/thread.html" },
          { text: "React Native", link: "document/react-native/thread.html" },
          { text: "Unity/Windows", link: "document/unity/thread.html" },
          ],
        },
        {
          text: "管理子区消息",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/thread_message.html" },
          { text: "iOS", link: "document/ios/thread_message.html" },
          { text: "Web/小程序", link: "document/web/thread_message.html" },
          { text: "HarmonyOS", link: "document/harmonyos/thread_message.html" },
          { text: "Flutter", link: "document/flutter/thread_message.html" },
          { text: "React Native", link: "document/react-native/thread_message.html" },
          { text: "Unity/Windows", link: "document/unity/thread_message.html" },
          ],
        },
      ],
    },
    {
      text: "聊天室管理",
      collapsible: true,
      children: [
        { text: "聊天室概述", link: "document/room_overview.html" },
        {
          text: "创建和管理聊天室",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/room_manage.html" },
          { text: "iOS", link: "document/ios/room_manage.html" },
          { text: "Web/小程序", link: "document/web/room_manage.html" },
          { text: "Flutter", link: "document/flutter/room_manage.html" },
          { text: "React Native", link: "document/react-native/room_manage.html" },
          { text: "Unity/Windows", link: "document/unity/room_manage.html" },
          ],
        }, 
        {
          text: "管理聊天室成员",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/room_members.html" },
          { text: "iOS", link: "document/ios/room_members.html" },
          { text: "Web/小程序", link: "document/web/room_members.html" },
          { text: "Flutter", link: "document/flutter/room_members.html" },
          { text: "React Native", link: "document/react-native/room_members.html" },
          { text: "Unity/Windows", link: "document/unity/room_members.html" },
          ],
        }, 
        {
          text: "管理聊天室属性",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/room_attributes.html" },
          { text: "iOS", link: "document/ios/room_attributes.html" },
          { text: "Web/小程序", link: "document/web/room_attributes.html" },
          { text: "Flutter", link: "document/flutter/room_attributes.html" },
          { text: "React Native", link: "document/react-native/room_attributes.html" },
          { text: "Unity/Windows", link: "document/unity/room_attributes.html" },
          ],
        }, 
      ],
    },
    {
      text: "用户相关",
      collapsible: true,
      children: [
        {
          text: "用户关系",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/user_relationship.html" },
          { text: "iOS", link: "document/ios/user_relationship.html" },
          { text: "Web/小程序", link: "document/web/user_relationship.html" },
          { text: "Flutter", link: "document/flutter/user_relationship.html" },
          { text: "React Native", link: "document/react-native/user_relationship.html" },
          { text: "Unity/Windows", link: "document/unity/user_relationship.html" },
          ],
        }, 
        {
          text: "用户属性",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/userprofile.html" },
          { text: "iOS", link: "document/ios/userprofile.html" },
          { text: "Web/小程序", link: "document/web/userprofile.html" },
          { text: "Flutter", link: "document/flutter/userprofile.html" },
          { text: "React Native", link: "document/react-native/userprofile.html" },
          { text: "Unity", link: "document/unity/userprofile.html" },
          { text: "Windows", link: "document/windows/userprofile.html" },
          ],
        }, 
        {
          text: "在线状态订阅",
          collapsible: true,
          children: [
          { text: "Android", link: "document/android/presence.html" },
          { text: "iOS", link: "document/ios/presence.html" },
          { text: "Web/小程序", link: "document/web/presence.html" },
          { text: "Flutter", link: "document/flutter/presence.html" },
          { text: "React Native", link: "document/react-native/presence.html" },
          { text: "Unity/Windows", link: "document/unity/presence.html" },
          ],
        }, 
      ],
    },
    {
      text: "离线推送",
      collapsible: true,
      children: [
        {
         text: "Android",
         collapsible: true,
        children: [
        { text: "离线推送概述", link: "document/android/push/push_overview.html" },
        {
          text: "集成第三方推送",
          collapsible: true,
          children: [
          { text: "FCM 推送", link: "document/android/push/push_fcm.html" },
          { text: "华为推送", link: "document/android/push/push_huawei.html" },
          { text: "荣耀推送", link: "document/android/push/push_honor.html" },
          { text: "OPPO 推送", link: "document/android/push/push_oppo.html" },
          { text: "vivo 推送", link: "document/android/push/push_vivo.html" },
          { text: "小米推送", link: "document/android/push/push_xiaomi.html" },
          { text: "魅族推送", link: "document/android/push/push_meizu.html" },
          ],
        }, 
        { text: "解析推送消息", link: "document/android/push/push_parsing.html" },
        { text: "统一获取消息方案", link: "document/android/push/push_parsing_unified.html" },
        { text: "设置通知的显示内容", link: "document/android/push/push_display.html" },
        { text: "设置通知方式和免打扰", link: "document/android/push/push_notification_mode_dnd.html" },
        { text: "设置推送翻译", link: "document/android/push/push_translation.html" },
        { text: "设置推送扩展功能", link: "document/android/push/push_extension.html" },
        { text: "推送消息分类", link: "document/android/push/push_message_classification.html" },
        { text: "FAQ", link: "document/android/push/push_solution.html" },
         ],
        },
        {
         text: "iOS",
         collapsible: true,
        children: [
        { text: "离线推送概述", link: "document/ios/push/push_overview.html" },
        { text: "集成 APNs 推送", link: "document/ios/push/push_apns.html" },
        { text: "解析推送消息", link: "document/ios/push/push_parsing.html" },
        { text: "设置通知的显示内容", link: "document/ios/push/push_display.html" },
        { text: "设置通知方式和免打扰", link: "document/ios/push/push_notification_mode_dnd.html" },
        { text: "设置推送翻译", link: "document/ios/push/push_translation.html" },
        { text: "设置推送扩展功能", link: "document/ios/push/push_extension.html" },
        { text: "FAQ", link: "document/ios/push/push_solution.html" },
         ],
        },
        {
         text: "Web",
         collapsible: true,
        children: [
        { text: "离线推送概述", link: "document/web/push/push_overview.html" },
        { text: "设置通知方式和免打扰", link: "document/web/push/push_notification_mode_dnd.html" },
        { text: "设置推送模板", link: "document/web/push/push_template.html" },
        { text: "设置推送翻译", link: "ddocument/web/push/push_translation.html" },
        { text: "设置推送扩展功能", link: "document/web/push/push_extension.html" },
         ],
        },
        {
         text: "HarmonyOS",
         collapsible: true,
        children: [
        { text: "离线推送概述", link: "document/harmonyos/push/push_overview.html" },
        { text: "集成 HarmonyOS 推送", link: "document/harmonyos/push/push_harmony.html" },
        { text: "设置通知的显示内容", link: "document/harmonyos/push/push_display.html" },
        { text: "设置通知方式和免打扰", link: "document/harmonyos/push/push_notification_mode_dnd.html" },
        { text: "FAQ", link: "document/harmonyos/push/push_solution.html" },
         ],
        },
        {
         text: "小程序",
         collapsible: true,
        children: [
        { text: "离线推送概述", link: "document/applet/push/push_overview.html" },
        { text: "设置通知方式和免打扰", link: "document/applet/push/push_notification_mode_dnd.html" },
        { text: "设置推送模板", link: "document/applet/push/push_template.html" },
        { text: "设置推送翻译", link: "document/applet/push/push_translation.html" },
        { text: "设置推送扩展功能", link: "document/applet/push/push_extension.html" },
        {
         text: "uni-app 离线推送",
         collapsible: true,
        children: [
        { text: "使用推送插件", link: "document/applet/push/uniapp_push.html" },
        { text: "集成 FCM", link: "document/applet/push/uniapp_push_fcm.html" },
         ],
        },
         ],
        },
        {
         text: "Flutter",
         collapsible: true,
        children: [
        { text: "离线推送概述", link: "document/flutter/push/push_overview.html" },
        { text: "上传推送证书及绑定推送信息", link: "document/flutter/push/push_easemob_console.html" },
        { text: "设置通知的显示内容", link: "document/flutter/push/push_display.html" },
        { text: "设置通知方式和免打扰", link: "document/flutter/push/push_notification_mode_dnd.html" },
        { text: "设置推送翻译", link: "document/flutter/push/push_translation.html" },
        { text: "设置推送扩展功能", link: "document/flutter/push/push_extension.html" },
         ],
        },
        {
         text: "React Native",
         collapsible: true,
        children: [
        { text: "离线推送概述", link: "document/react-native/push/push_overview.html" },
        { text: "上传推送证书", link: "document/react-native/push/push_easemob_console.html" },
        { text: "获取或更新推送 token", link: "document/react-native/push/push_get_device_token.html" },
        { text: "发送推送 token 到环信服务器", link: "document/react-native/push/push_send_token_to_server.html" },
        { text: "设置通知的显示内容", link: "document/react-native/push/push_display.html" },
        { text: "设置通知方式和免打扰", link: "document/react-native/push/push_notification_mode_dnd.html" },
        { text: "设置推送翻译", link: "document/react-native/push/push_translation.html" },
        { text: "设置推送扩展功能", link: "document/react-native/push/push_extension.html" },
         ],
        },
      ],
    },
      ],
    },
    {
          text: "精简版 SDK",
          collapsible: true,
          children: [
        { text: "Android", link: "document/android/elite_sdk.html" },
        { text: "iOS", link: "document/ios/elite_sdk.html" },
         ],
        },
    {
      text: "客户端 API",
      collapsible: true,
      children: [
        { text: "Android", link: "document/android/api_overview.html" },
        { text: "iOS", link: "document/ios/api_overview.html" },
        { text: "Web", link: "document/web/api_overview.html" },
        { text: "HarmonyOS", link: "document/harmonyos/api_overview.html" },
        { text: "小程序", link: "document/applet/api_overview.html" },
        { text: "Flutter", link: "document/flutter/api_overview.html" },
        { text: "React Native", link: "document/react-native/api_overview.html" },
        { text: "Unity", link: "document/unity/api_overview.html" },
        { text: "Windows", link: "document/windows/api_overview.html" },
      ],
    },
    {
      text: "服务端 API",
      collapsible: true,
      children: [
    {
      text: "REST API",
      collapsible: true,
      children: [
        { text: "REST 平台与请求", link: "document/server-side/overview.html" },
        { text: "REST API 调用频率限制", link: "product/limitationapi.html" },
        {
          text: "消息管理",
          collapsible: true,
          children: [
        { text: "发送单聊消息", link: "document/server-side/message_single.html" },
        { text: "发送群聊消息", link: "document/server-side/message_group.html" },
        { text: "发送聊天室消息", link: "document/server-side/message_chatroom.html" },
        { text: "发送全局广播消息", link: "document/server-side/message_broadcast.html" },
        { text: "上传和下载文件", link: "document/server-side/message_download.html" },
        { text: "获取历史消息记录", link: "document/server-side/message_historical.html" },
        { text: "设置指定消息附件的存储方式", link: "document/server-side/message_attachment_storage.html" },
        { text: "消息表情回复", link: "document/server-side/reaction.html" },
        { text: "撤回消息", link: "document/server-side/message_recall.html" },
        { text: "单向删除会话", link: "document/server-side/conversation_delete.html" },
        { text: "单向删除漫游消息", link: "document/server-side/message_delete.html" },
        { text: "修改消息", link: "document/server-side/message_modify.html" },
        { text: "获取离线消息数据", link: "document/server-side/message_offline.html" },
        { text: "导入消息", link: "document/server-side/message_import.html" },
         ],
        },
        {
          text: "群组管理",
          collapsible: true,
          children: [
        { text: "管理群组", link: "document/server-side/group_manage.html" },
        { text: "管理群组文件", link: "document/server-side/group_file.html" },
        {
         text: "管理群组成员",
         collapsible: true,
         children: [
           { text: "获取成员列表", link: "document/server-side/group_member_obtain.html" },
           { text: "添加/移除成员", link: "document/server-side/group_member_add_delete.html" },
           { text: "管理群成员自定义属性", link: "document/server-side/group_member_attribute.html" },
           { text: "管理群主/管理员", link: "document/server-side/group_member_admin.html" },
           { text: "管理禁言", link: "document/server-side/group_member_mutelist.html" },
           { text: "管理白名单", link: "document/server-side/group_member_allowlist.html" },
           { text: "管理黑名单", link: "document/server-side/group_member_blocklist.html" },
          ],
        },
        { text: "管理子区", link: "document/server-side/group_thread.html" },
         ],
        },
        {
          text: "聊天室管理",
          collapsible: true,
          children: [
        { text: "管理超级管理员", link: "document/server-side/chatroom_superadmin.html" },
        { text: "管理聊天室", link: "document/server-side/chatroom_manage.html" },
        { text: "管理聊天室属性", link: "document/server-side/chatroom_attribute.html" },
        {
         text: "管理聊天室成员",
         collapsible: true,
         children: [
           { text: "获取成员列表", link: "document/server-side/chatroom_member_obtain.html" },
           { text: "添加/移除成员", link: "document/server-side/chatroom_member_add_delete.html" },
           { text: "管理聊天室所有者/管理员", link: "document/server-side/chatroom_member_admin.html" },
           {
             text: "管理禁言",
             collapsible: true,
             children: [
              { text: "多个或全体成员禁言", link: "document/server-side/chatroom_member_mutelist.html" },
              { text: "标签禁言", link: "document/server-side/chatroom_label_mute.html" },
           { text: "管理白名单", link: "document/server-side/chatroom_member_allowlist.html" },
           { text: "管理黑名单", link: "document/server-side/chatroom_member_blocklist.html" },
             ],
           },
          ],
         },
         ],
        },
        {
          text: "用户相关",
          collapsible: true,
          children: [
        { text: "用户体系管理", link: "document/server-side/account_system.html" },
        { text: "用户属性", link: "document/server-side/userprofile.html" },
        { text: "用户状态订阅", link: "document/server-side/presence.html" },
        { text: "用户全局禁言", link: "document/server-side/user_global_mute.html" },
        { text: "用户收藏", link: "document/server-side/user_favorite.html" },
        { text: "用户关系管理", link: "document/server-side/user_relationship.html" },
         ],
        },
        {
          text: "离线推送",
          collapsible: true,
          children: [
        { text: "离线推送设置", link: "document/server-side/push.html" },
        { text: "离线推送的消息扩展", link: "document/server-side/push_extension.html" },
        { text: "查询离线推送结果", link: "document/server-side/push_result_statistics.html" },
          ],
         },
        ],
      },
      {
      text: '设置回调',
      collapsible: true,
      children: [
        { text: '回调概述', link: 'document/server-side/callback_overview.html' },
        { text: '发送前回调', link: 'document/server-side/callback_presending.html' },
        { text: '发送后回调', link: 'document/server-side/callback_postsending.html' },
        { text: '发送后回调事件',
          collapsible: true,
          children: [
          { text: '用户登入/登出', link: 'document/server-side/callback_login_logout.html' },
          { text: '发送消息', link: 'document/server-side/callback_message_send.html' },
          { text: '发送单聊消息已读回执', link: 'document/server-side/callback_single_read_ack.html' },
          { text: '发送群聊消息已读回执', link: 'document/server-side/callback_group_read_ack.html' },
          { text: '发送会话已读回执', link: 'document/server-side/callback_single_conversation_ack.html' },
          { text: '修改消息', link: 'document/server-side/callback_message_modify.html' },
          { text: '撤回消息', link: 'document/server-side/callback_message_recall.html' },
          { text: '群组/聊天室操作（新）', 
            collapsible: true,
            children: [
              { text: '创建群组/聊天室', link: 'document/server-side/callback_group_room_create.html' },
              { text: '更新群组/聊天室',
                collapsible: true,
                children: [
                  { text: '更新群组_聊天室信息', link: 'document/server-side/callback_group_room_info.html' },
                  { text: '变更群主/聊天室所有者', link: 'document/server-side/callback_group_room_owner.html' },
                  { text: '设置/更新公告', link: 'document/server-side/callback_group_room_announcement.html' },
                  { text: '封禁/解禁群组', link: 'document/server-side/callback_group_ban.html' },
                  { text: '全员禁言', link: 'document/server-side/callback_group_room_muteall.html' }
                ]
              },
              { text: '删除群组/聊天室', link: 'document/server-side/callback_group_room_delete.html' },
              { text: '屏蔽/解除屏蔽群组', link: 'document/server-side/callback_group_block.html' },
              { text: '上传/删除群共享文件', link: 'document/server-side/callback_group_shared_file.html' },
              { text: '用户加入', link: 'document/server-side/callback_group_room_join.html' },
              { text: '成员离开', link: 'document/server-side/callback_group_room_leave.html' },
              { text: '添加/移除管理员', link: 'document/server-side/callback_group_room_admin.html' },
              { text: '加入/移出禁言列表', link: 'document/server-side/callback_group_room_mute.html' },
              { text: '添加/移出白名单', link: 'document/server-side/callback_group_room_allowlist.html' },
              { text: '加入/移出黑名单', link: 'document/server-side/callback_group_room_blocklist.html' },
              { text: '添加/移除聊天室超级管理员', link: 'document/server-side/callback_room_superadmin.html' }
            ]
          },
          { text: '群组/聊天室操作（旧）', link: 'document/server-side/callback_group_room_old.html' },
          { text: '用户关系操作', link: 'document/server-side/callback_contact.html' },
          { text: '离线推送', link: 'document/server-side/callback_offline_push.html' },
          { text: 'Reaction', link: 'document/server-side/callback_reaction.html' },
          { text: 'Thread', link: 'document/server-side/callback_thread.html' },
          { text: '敏感词监测', link: 'document/server-side/callback_sensitive_word.html' }
          ]
        }
      ],
    }
    ],
    },
    {
      text: "错误排查",
      collapsible: true,
      children: [
        {
         text: "错误码",
         collapsible: true,
         children: [
           { text: "Android", link: "document/android/error.html" },
           { text: "iOS", link: "document/ios/error.html" },
           { text: "Web/小程序", link: "document/web/error.html" },
           { text: "HarmonyOS", link: "document/harmonyos/error.html" },
           { text: "Flutter", link: "document/flutter/error.html" },
           { text: "React Native", link: "document/react-native/error.html" },
           { text: "Unity/Windows", link: "document/unity/error.html" },
           { text: "REST", link: "document/server-side/error.html" },
           ],
        },
        {
         text: "日志",
         collapsible: true,
         children: [
           { text: "Android", link: "document/android/log.html" },
           { text: "iOS", link: "document/ios/log.html" },
           { text: "Web/小程序", link: "document/web/log.html" },
           { text: "HarmonyOS", link: "document/harmonyos/log.html" },
           { text: "React Native", link: "document/react-native/log.html" },
           { text: "Unity", link: "document/unity/log.html" },
           { text: "Windows", link: "document/windows/log.html" },
           ],
        },
      ],
    },
    {
      text: "控制台指南",
      collapsible: true,
      children: [
        { text: "开通和配置服务", link: "product/enable_and_configure_IM.html" },
        { text: "消息量统计", link: "product/message_statistics.html" },
        { text: "请求质量概览", link: "product/request_quality_overview.html" },
      ],
    },
    {
      text: "常见问题",
      collapsible: true,
      children: [
        { text: "FAQ 质量", link: "product/faq_quality_issues.html" },
        { text: "FAQ 集成", link: "product/faq_integration_issues.html" },
      ],
    },
    {
      text: "安全",
      collapsible: true,
      children: [
        { text: "苹果隐私策略", link: "document/ios/privacy_policy.html" },
        { text: "安全最佳实践", link: "product/security_best_practices.html" },
        { text: "GDPR 安全合规", link: "product/GDPR.html" },
      ],
    },
    {
      text: "联系我们",
      collapsible: true,
      children: [
        { text: "联系我们", link: "product/help.html" },
      ],
    },
    { text: "术语表", 
      collapsible: true,
      children: [
        { text: "术语表", link: "product/glossary.html" },
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
