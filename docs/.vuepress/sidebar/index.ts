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
            { text: "产品概述", link: "product/moderation/moderation_overview.html" },
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
      ],
    },
        {
         text: "回调",
         collapsible: true,
         children: [
        { text: "回调概述", link: "callback/callback_overview.html" },
        { text: "发送前回调", link: "callback/callback_presending.html" },
        { text: "发送后回调", link: "callback/callback_postsending.html" },
        { text: '发送后回调事件',
        collapsible: true,
        children: [
          { text: '用户登入/登出', link: 'callback/callback_login_logout.html' },
          { text: '发送消息', link: 'callback/callback_message_send.html' },
          { text: '发送单聊消息已读回执', link: 'callback/callback_single_read_ack.html' },
          { text: '发送群聊消息已读回执', link: 'callback/callback_group_read_ack.html' },
          { text: '发送会话已读回执', link: 'callback/callback_single_conversation_ack.html' },
          { text: '修改消息', link: 'callback/callback_message_modify.html' },
          { text: '撤回消息', link: 'callback/callback_message_recall.html' },
          { text: '群组/聊天室操作（新）', 
            collapsible: true,
            children: [
              { text: '创建群组/聊天室', link: 'callback/callback_group_room_create.html' },
              { text: '更新群组/聊天室',
                collapsible: true,
                children: [
                  { text: '更新群组_聊天室信息', link: 'callback/callback_group_room_info.html' },
                  { text: '变更群主/聊天室所有者', link: 'callback/callback_group_room_owner.html' },
                  { text: '设置/更新公告', link: 'callback/callback_group_room_announcement.html' },
                  { text: '封禁/解禁群组', link: 'callback/callback_group_ban.html' },
                  { text: '全员禁言', link: 'callback/callback_group_room_muteall.html' }
                ]
              },
              { text: '删除群组/聊天室', link: 'callback/callback_group_room_delete.html' },
              { text: '屏蔽/解除屏蔽群组', link: 'callback/callback_group_block.html' },
              { text: '上传/删除群共享文件', link: 'callback/callback_group_shared_file.html' },
              { text: '用户加入', link: 'callback/callback_group_room_join.html' },
              { text: '成员离开', link: 'callback/callback_group_room_leave.html' },
              { text: '添加/移除管理员', link: 'callback/callback_group_room_admin.html' },
              { text: '加入/移出禁言列表', link: 'callback/callback_group_room_mute.html' },
              { text: '添加/移出白名单', link: 'callback/callback_group_room_allowlist.html' },
              { text: '加入/移出黑名单', link: 'callback/callback_group_room_blocklist.html' },
              { text: '添加/移除聊天室超级管理员', link: 'callback/callback_room_superadmin.html' }
            ]
          },
          { text: '群组/聊天室操作（旧）', link: 'callback/callback_group_room_old.html' },
          { text: '用户关系操作', link: 'callback/callback_contact.html' },
          { text: '离线推送', link: 'callback/callback_offline_push.html' },
          { text: 'Reaction', link: 'callback/callback_reaction.html' },
          { text: 'Thread', link: 'callback/callback_thread.html' },
          { text: '敏感词监测', link: 'callback/callback_sensitive_word.html' }
        ]
      }
         ],
      }, 
      { text: "质量监控", link: "/product/request_quality_overview.html" },
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
      text: "插件",
      collapsible: true,
      children: [
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
