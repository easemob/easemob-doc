import { sidebar } from "vuepress-theme-hope";
import { DOC_V5_SIDEBAR } from "./document";

export const zhSidebar = sidebar({
  "/product/": [
    { text: "产品简介", link: "introduction.html" },
    {
      text: "购买指南",
      collapsible: true,
      children: [
        { text: "计费策略", link: "pricing_policy.html" },
        { text: "套餐包功能对比", link: "product_package_feature.html" },
      ],
    },
    { type: "separator" } as any,
    {
      text: "功能介绍",
      collapsible: true,
      children: [
        { text: "功能列表", link: "product_function.html" },
        { text: "各类会话的功能", link: "conversation_function.html" },
        {
          text: "用户相关",
          collapsible: true,
          children: [
            { text: "用户注册与登录", link: "product_user_registration_login.html" },
            { text: "在线状态管理", link: "product_user_presence.html" },
            { text: "用户属性", link: "product_user_attribute.html" },
            { text: "用户关系", link: "product_user_relationship.html" },
          ],
        },
        {
          text: "消息管理",
          collapsible: true,
          children: [
            { text: "消息概述", link: "product_message_overview.html" },
            { text: "单聊消息", link: "message_single_chat.html" },
            { text: "群组消息", link: "message_group.html" },
            { text: "聊天室消息", link: "message_chatroom.html" },
            { text: "消息存储", link: "message_store.html" },
            { text: "消息格式", link: "product_message_format.html" },
          ],
        },
        { text: "离线推送", link: "product_offline_push_overview.html" },
        {
          text: "群组管理",
          collapsible: true,
          children: [
            { text: "群组概述", link: "product_group_overview.html" },
            { text: "消息话题", link: "product_thread_overview.html" },
          ],
        },
        { text: "聊天室", link: "product_chatroom_overview.html" },
      ],
    },
    { text: "使用限制", link: "limitation.html" },
    { text: "数据中心", link: "data_center.html" },
    { type: "separator" } as any,
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
        { text: "注册账号", link: "console/account_register.html" },
        { text: "实名认证", link: "console/real_name_authentication.html" },
        {
          text: "应用管理",
          collapsible: true,
          children: [
            { text: "应用创建与上线流程", link: "console/app_create_to_launch.html" },
            { text: "创建应用", link: "console/app_create.html" },
            { text: "管理和配置应用", link: "console/app_manage.html" },
            { text: "上线应用", link: "console/app_launch.html" },
            { text: "应用备案", link: "console/app_file.html" },
          ],
        },
        { text: "购买套餐包", link: "console/purchase_package.html" },
        {
          text: "配置基础功能",
          collapsible: true,
          children: [
            { text: "用户", link: "console/basic_user.html" },
            { text: "消息", link: "console/basic_message.html" },
            { text: "会话/群组/聊天室", link: "console/basic_conversation_group_chatroom.html" },
            { text: "消息回调", link: "console/basic_webhook.html" },
            { text: "服务端 API 调用", link: "console/basic_restful_api_call.html" },
            { text: "其他", link: "console/basic_other.html" },
          ],
        },
        { text: "开通增值服务", link: "console/purchase_value_added.html" },
        {
          text: "账号管理",
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
            { text: "管理子账号", link: "console/account_sub_create.html" },
          ],
        },
        { text: "账单中心", link: "console/account_center.html" },
        {
          text: "运营管理",
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
    { text: "术语表", link: "glossary.html" },
  ],
  ...DOC_V5_SIDEBAR,
});
