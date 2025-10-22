import { sidebar } from "vuepress-theme-hope";
import { DOC_SIDEBAR } from "./document";
import { CHAT_UIKIT_SIDEBAR, CHATROOM_UIKIT_SIDEBAR } from "./uikit";
import { PRIVATE_IM_SIDEBAR, PRIVATE_MEDIA_SIDEBAR } from "./private";
import { CALL_KIT_SIDEBAR } from "./callkit";
import { PUSH_SIDEBAR } from "./push";

export const zhSidebar = sidebar({
  "/product/": [
    { text: "产品动态", link: "product_dynamics.html" },
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
        { text: "内容审核", link: "moderation_overview.html" },
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
       {
      text: "消息翻译",
      collapsible: true,
      children: [
        { text: "Android", link: "message_translation_android.html" },
        { text: "iOS", link: "message_translation_ios.html" },
        { text: "Web", link: "message_translation_web.html" },
        { text: "小程序", link: "message_translation_applet.html" },
        { text: "Flutter", link: "message_translation_flutter.html" },
        { text: "React Native", link: "message_translation_react-native.html" },
        { text: "Unity", link: "message_translation_unity.html" },
        { text: "Windows", link: "message_translation_windows.html" },
      ],
    }, 
      { text: "内容审核",
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
            { text: "数据总览", link: "moderation/moderation_data_overview.html" },
            { text: "历史记录", link: "moderation/moderation_history.html" },
            { text: "消息举报", link: "moderation/moderation_message_report.html" },
            { text: "关键词审核", link: "moderation/moderation_keyword" },
            { text: "标签管理", link: "moderation/moderation_user_tag" },
            { text: "消息审核机制", link: "moderation/moderation_mechanism.html",
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
              text: "群组/聊天室审核",
              link: "moderation/moderation_manual_review.html",
            },
            { text: "用户审核", link: "moderation/moderation_usermgmt.html" },
          ],
        },
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
      text: "帮助中心",
      collapsible: true,
      children: [
      {
      text: "FAQ",
      collapsible: true,
      children: [
        { text: "FAQ 质量", link: "faq_quality_issues.html" },
        { text: "FAQ 集成", link: "faq_integration_issues.html" },
        ],
      },
      { text: "联系我们", link: "help.html" },
     ],
    },
    {
      text: "安全",
      collapsible: true,
      children: [
        { text: "安全最佳实践", link: "security_best_practices.html" },
        { text: "GDPR 安全合规", link: "GDPR.html" },
        {text: "SDK合规使用说明", link:"https://www.easemob.com/news/privacy"}
      ],
    },
    {
      text: "Console 指南（新）",
      collapsible: true,
      children: [
        { text: "注册账号", link: "console/account_register.html" },
        { text: "实名认证", link: "console/real_name_authentication.html" },
        { text: "应用管理", 
            collapsible: true,
            children: [
            { text: "创建应用", link: "console/app_create.html" },
            { text: "查看和配置应用", link: "console/app_manage.html" },
          ],
        },
        { text: "服务开通", 
            collapsible: true,
            children: [
            { text: "购买套餐包", link: "console/purchase_package.html" },
            { text: "开通增值服务", link: "console/purchase_value_added.html" },
          ],
        },
        { text: "功能配置", 
            collapsible: true,
            children: [
            {
             text: "配置基础功能",
             collapsible: true,
             children: [
             { text: "用户", link: "console/basic_user.html" },
             { text: "消息", link: "console/basic_message.html" },
             { text: "会话/群组/聊天室", link: "console/basic_conversation_group_chatroom.html" },
             { text: "消息回调", link: "console/basic_webhook.html" },
             { text: "其他", link: "console/basic_other.html" },
             ],
            },
            {
             text: "配置增值功能",
             collapsible: true,
             children: [
             { text: "内容审核", link: "console/value_added_config_moderation.html" },
            { text: "即时推送", link: "console/value_added_config_push.html" },
            { text: "实时音视频", link: "console/value_added_config_rtc.html" },
             ],
            },
          ],
        },
        { text: "账号管理", 
            collapsible: true,
            children: [
            { text: "管理账户信息", link: "console/account_modify.html" },
            {
             text: "安全设置",
             collapsible: true,
             children: [
             { 
              text: "MFA 验证", 
              collapsible: true,
              children: [
              { text: "绑定 MFA 设备", link: "console/account_security_mfa_bind.html" },
              { text: "解绑 MFA 设备", link: "console/account_security_mfa_unbind.html" },
              ], 
            },
             { text: "登录保护", link: "console/account_security_protection_login.html" },
             { text: "操作保护", link: "console/account_security_protection_operation.html" },
             { text: "修改账户密码", link: "console/account_security_password_change.html" },
             { text: "修改手机号和邮箱", link: "console/account_security_mobile_email.html" },
             ],
            },
            { text: "找回账户密码", link: "console/account_password_retrieve.html" },
            { text: "创建子账号", link: "console/account_sub_create.html" },
          ],
        },
        { text: "账单中心", link: "console/account_center.html" },
        { text: "运营管理", 
            collapsible: true,
            children: [
            {
             text: "运营操作",
             collapsible: true,
             children: [
             { text: "用户管理", link: "console/operation_user.html" },
             { text: "群组管理", link: "console/operation_group.html" },
             { text: "聊天室管理", link: "console/operation_chatroom.html" },
             ],
            },
            {
             text: "运营数据",
             collapsible: true,
             children: [
             { text: "数据查询", link: "console/operation_data.html" },
             { text: "消息量统计", link: "console/operation_message_statistics.html" }, 
             ],
            },
            {
             text: "问题排查",
             collapsible: true,
             children: [
             { text: "请求质量监控", link: "console/operation_troubleshooting_request_quality.html" },
             { text: "消息投递查询", link: "console/operation_troubleshooting_message_delivery.html" },
             { text: "用户连接状态查询", link: "console/operation_troubleshooting_user_connection.html" },
             { text: "用户设备日志", link: "console/operation_troubleshooting_device_log.html" },
             { text: "聊天室消息速率", link: "console/operation_troubleshooting_chatroom_rate.html" },
             ],
            },
          ],
        },
        
      ],
    },
    {
      text: "Console 指南（旧）",
      collapsible: true,
      children: [
        { text: "开通和配置服务", link: "enable_and_configure_IM.html" },
        { text: "消息量统计", link: "message_statistics.html" },
        { text: "请求质量概览", link: "request_quality_overview.html" },
      ],
    },
    { text: "术语表", link: "glossary.html" },
    {
      text: "已废弃内容",
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
  ],  
  ...DOC_SIDEBAR,
  ...CHAT_UIKIT_SIDEBAR,
  ...CHATROOM_UIKIT_SIDEBAR,
  ...CALL_KIT_SIDEBAR,
  "/private/im/": PRIVATE_IM_SIDEBAR,
  "/private/media/": PRIVATE_MEDIA_SIDEBAR,
  "/push": PUSH_SIDEBAR,
});
