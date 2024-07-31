import { sidebar } from "vuepress-theme-hope";
import { DOC_SIDEBAR } from "./document";
import { CHAT_UIKIT_SIDEBAR, CHATROOM_UIKIT_SIDEBAR } from "./uikit";
import { PRIVATE_IM_SIDEBAR, PRIVATE_MEDIA_SIDEBAR } from "./private";
import { PUSH_SIDEBAR } from "./push";

export const zhSidebar = sidebar({
  "/product/": [
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
      children: [
        { text: "产品概述", link: "introduction.html" },
        { text: "数据中心", link: "data_center.html" },
        { text: "产品动态", link: "product_dynamics.html" },
        { text: "IM 产品使用限制", link: "limitation.html" },
        { text: "接口频率限制", link: "limitationapi.html" },
        { text: "产品价格", link: "pricing.html" },
        { text: "术语表", link: "glossary.html" },
      ],
    },
    {
      text: "快速开始",
      children: [
        { text: "使用环信 App Token 鉴权", link: "easemob_app_token.html" },
        { text: "使用环信 User Token 鉴权", link: "easemob_user_token.html" },
        { text: "快速开始 Android", link: "/document/android/quickstart.html" },
        { text: "快速开始 iOS", link: "/document/ios/quickstart.html" },
        { text: "快速开始 Web", link: "/document/web/quickstart.html" },
        { text: "快速开始 Applet", link: "/document/applet/wechat.html" },
        { text: "快速开始 HarmonyOS", link: "/document/harmonyos/quickstart.html" },
        { text: "快速开始 Flutter", link: "/document/flutter/quickstart.html" },
        { text: "快速开始 React Native", link: "/document/react-native/quickstart.html" },
        { text: "快速开始 Unity", link: "/document/unity/quickstart.html" },
        { text: "快速开始 Windows", link: "/document/windows/quickstart.html" },
      ],
    },
    {
      text: "内容审核",
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
                { text: "跑通准备", link: "aigc/aigc_open.html" },
                { text: "跑通示例项目", link: "aigc/aigc_run_through_demo.html" },
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
              collapsible: false,
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
      text: "常见方案",
      children: [
        { text: "群 @ 消息", link: "solution_common/group_@.html" },
        { text: "消息引用", link: "solution_common/message_quote.html" },
        { text: "迁移到环信", link: "solution_common/migrate_to_easemob.html" },
      ],
    },
    {
      text: "FAQ",
      children: [
        { text: "FAQ 质量", link: "faq_quality_issues.html" },
        { text: "FAQ 集成", link: "faq_integration_issues.html" },
        { text: "帮助中心", link: "help.html" },
      ],
    },
    {
      text: "安全",
      children: [
        { text: "安全最佳实践", link: "security_best_practices.html" },
        { text: "GDPR 安全合规", link: "GDPR.html" },
      ],
    },
    {
      text: "Console 指南",
      children: [
        { text: "开通和配置服务", link: "enable_and_configure_IM.html" },
        { text: "请求质量概览", link: "request_quality_overview.html" },
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
