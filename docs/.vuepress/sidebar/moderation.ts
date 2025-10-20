export const MODERATION_SIDEBAR = [
     { text: "产品概述", link: "/value-added/moderation/moderation_overview.html" },
     {
          text: "产品定价",
          collapsible: true,
          children: [
            { 
              text: "国内计费说明",
              link: "/value-added/moderation/moderation_billing_domestic.html",
            },
            {
              text: "海外计费说明",
              link: "/value-added/moderation/moderation_billing_overseas.html",
            },
          ],
        },
        { text: "开通审核服务", link: "/value-added/moderation/moderation_enable.html" },
        { text: "规则配置", link: "/value-added/moderation/moderation_rule_config.html" },
        { text: "规则测试", link: "/value-added/moderation/moderation_rule_test.html" },
        { text: "数据总览", link: "/value-added/moderation/moderation_data_overview.html" },
        { text: "历史记录", link: "/value-added/moderation/moderation_history.html" },
        { text: "消息审核机制", link: "/value-added/moderation/moderation_mechanism.html"},
        { text: "消息举报", link: "/value-added/moderation/moderation_message_report.html" },
        { text: "关键词审核", link: "/value-added/moderation/moderation_keyword.html" },
        { text: "标签管理", link: "/value-added/moderation/moderation_user_tag.html" },
        {
          text: "进阶功能",
          collapsible: true,
          children: [
            {
              text: "审核记录回调",
              link: "/value-added/moderation/moderation_record_callback.html",
            },
            {
              text: "群组/聊天室人工审核",
              link: "/value-added/moderation/moderation_manual_review.html",
            },
            { text: "用户管理", link: "/value-added/moderation/moderation_usermgmt.html" },
          ],
        }
    ]    