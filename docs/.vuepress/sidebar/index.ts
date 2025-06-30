import { sidebar } from "vuepress-theme-hope";
import { DOC_SIDEBAR } from "./document";
import { CHAT_UIKIT_SIDEBAR, CHATROOM_UIKIT_SIDEBAR } from "./uikit";
import { PRIVATE_IM_SIDEBAR, PRIVATE_MEDIA_SIDEBAR } from "./private";
import { PUSH_SIDEBAR } from "./push";

export const zhSidebar = sidebar({
  "/product/": [
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
        { text: "服务部署", link: "product_deploy.html" },
        { text: "功能介绍",  link: "product_function.html" },
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
        { text: "使用限制", link: "limitation.html" },
        //   collapsible: true,
        //   children: [
        //     { text: "功能限制", link: "limitation.html" },
        //     { text: "RESTful 接口频率限制", link: "limitationapi.html" },
        //   ],
        // },
        // { text: "数据中心", 
        //   collapsible: true,
        //   children: [
        //     { text: "数据中心", link: "data_center.html" },
        //   ], 
        // },
      ],
    },
    // { text: "购买指南", 
    //   collapsible: true,
    //   children: [
    //     { text: "计费策略", link: "pricing_policy.html"},
    //     { text: "套餐包功能对比", link: "product_package_feature.html"},
    //     { text: "购买指引", link: "pricing_method.html" },
    //   ],
    // }, 
    // {
    //   text: "Demo",
    //   collapsible: true,
    //   children: [
    //     { text: "体验 Demo", link: "demo.html" },
    //   ],
    // },
    {
      text: "增值服务",
      collapsible: true,
      children: [
    //    {
    //   text: "消息翻译",
    //   collapsible: true,
    //   children: [
    //     { text: "Android", link: "/document/android/message_translation.html" },
    //     { text: "iOS", link: "/document/ios/message_translation.html" },
    //     { text: "Web", link: "/document/web/message_translation.html" },
    //     { text: "小程序", link: "/document/applet/message_translation.html" },
    //     { text: "Flutter", link: "/document/flutter/message_translation.html" },
    //     { text: "React Native", link: "/document/react-native/message_translation.html" },
    //     { text: "Unity", link: "/document/unity/message_translation.html" },
    //     { text: "Windows", link: "/document/windows/message_translation.html" },
    //   ],
    // }, 
    //   { text: "内容审核",
    //   collapsible: true,
    //   children: [
    //     {
    //       text: "产品简介",
    //       collapsible: true,
    //       children: [
    //         { text: "产品概述", link: "moderation/moderation_overview.html" },
    //       ],
    //     },
    //     {
    //       text: "产品定价",
    //       collapsible: true,
    //       children: [
    //         {
    //           text: "国内计费说明",
    //           link: "moderation/moderation_billing_domestic.html",
    //         },
    //         {
    //           text: "海外计费说明",
    //           link: "moderation/moderation_billing_overseas.html",
    //         },
    //       ],
    //     },
    //     {
    //       text: "快速开始",
    //       collapsible: true,
    //       children: [
    //         { text: "开通审核服务", link: "moderation/moderation_enable.html" },
    //         {
    //           text: "规则配置",
    //           link: "moderation/moderation_rule_config.html",
    //         },
    //         { text: "规则测试", link: "moderation/moderation_rule_test.html" },
    //         { text: "历史记录", link: "moderation/moderation_history.html" },
    //         { text: "关键词审核", link: "moderation/keyword_review.html" },
    //         {
    //           text: "消息审核机制",
    //           link: "moderation/moderation_mechanism.html",
    //         },
    //       ],
    //     },
    //     {
    //       text: "进阶功能",
    //       collapsible: true,
    //       children: [
    //         {
    //           text: "审核记录回调",
    //           link: "moderation/moderation_record_callback.html",
    //         },
    //         {
    //           text: "消息人工审核",
    //           link: "moderation/moderation_manual_review.html",
    //         },
    //         { text: "用户管理", link: "moderation/moderation_usermgmt.html" },
    //       ],
    //     },
    //   ],
    // },
        {
         text: "回调",
         collapsible: true,
         children: [
        { text: "回调概述", link: "/document/server-side/callback_overview.html" },
        { text: "发送前回调", link: "/document/server-side/callback_presending.html" },
        { text: "发送后回调", link: "/document/server-side/callback_postsending.html" },
        { text: "发送后回调事件", link: "/document/server-side/callback_login_logout.html" },
         ],
      }, 
      // { text: "质量监控", link: "/product/request_quality_overview.html" },
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
      text: "帮助中心",
      collapsible: true,
      children: [
        { text: "FAQ 质量", link: "faq_quality_issues.html" },
        { text: "FAQ 集成", link: "faq_integration_issues.html" },
        ],
    },
    {
      text: "Console 指南",
      collapsible: true,
      children: [
        { text: "开通和配置服务", link: "enable_and_configure_IM.html" },
        { text: "消息量统计", link: "message_statistics.html" },
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
