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
            {
              text: "规则配置",
              link: "/value-added/moderation/moderation_rule_config.html",
            },
            { text: "规则测试", link: "/value-added/moderation/moderation_rule_test.html" },
            { text: "历史记录", link: "/value-added/moderation/moderation_history.html" },
            { text: "关键词审核", link: "/value-added/moderation/moderation_keyword.html" },
            {
              text: "消息审核机制",
              link: "/value-added/moderation/moderation_mechanism.html",
            },
        {
          text: "进阶功能",
          collapsible: true,
          children: [
            {
              text: "审核记录回调",
              link: "/value-added/moderation/moderation_record_callback.html",
            },
            {
              text: "消息人工审核",
              link: "/value-added/moderation/moderation_manual_review.html",
            },
            { text: "用户管理", link: "/value-added/moderation/moderation_usermgmt.html" },
          ],
        }
    ]    