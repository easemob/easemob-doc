export const MODERATION_SIDEBAR = [
     { text: "服务介绍", link: "/value-added/moderation/moderation_overview.html" },
     {
          text: "计费说明",
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
          text: "审核规则配置",
          collapsible: true,
          children: [
            { 
              text: "配置审核规则",
              link: "/value-added/moderation/moderation_rule_config.html",
            },
            { 
              text: "关键词审核",
              link: "/value-added/moderation/moderation_keyword.html",
            },
            {
              text: "标签管理",
              link: "/value-added/moderation/moderation_user_tag.html",
            },
            {
              text: "测试审核规则",
              link: "/value-added/moderation/moderation_rule_test.html",
            },
          ],
        },
        {
          text: "审核机制与处理",
          collapsible: true,
          children: [
            { 
              text: "消息审核机制",
              link: "/value-added/moderation/moderation_mechanism.html",
            },
            { 
              text: "主动文本审核",
              link: "/value-added/moderation/moderation_text_active.html",
            },
            {
              text: "用户审核",
              link: "/value-added/moderation/moderation_usermgmt.html",
            },
            {
              text: "群组/聊天室人工审核",
              link: "/value-added/moderation/moderation_manual_review.html",
            },
            { text: "消息举报", 
              link: "/value-added/moderation/moderation_message_report.html" 
            },
          ],
        },
        {
          text: "数据查询与通知",
          collapsible: true,
          children: [
            { text: "审核历史记录", 
              link: "/value-added/moderation/moderation_history.html" 
            },
            { text: "数据总览", 
              link: "/value-added/moderation/moderation_data_overview.html" 

            },
            {
              text: "审核回调通知",
              link: "/value-added/moderation/moderation_record_callback.html",
            }, 
          ],
        }
    ]    