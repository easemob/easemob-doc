import { sidebar } from "vuepress-theme-hope";
import { DOC_V5_SIDEBAR } from "./document";

export const zhSidebar = sidebar({
  "/sdk/v5/": [
    { text: "SDK Overview", link: "/sdk/v5/" },
    { text: "Android", link: "/sdk/v5/android/" },
    { text: "iOS", link: "/sdk/v5/ios/" },
    { text: "Web", link: "/sdk/v5/web/" },
  ],
  "/product/": [
    { text: "Product Introduction", link: "introduction.html" },
    {
      text: "Purchase Guide",
      collapsible: true,
      children: [
        { text: "Billing Policy", link: "pricing_policy.html" },
        { text: "Plan Feature Comparison", link: "product_package_feature.html" },
      ],
    },
    { type: "separator" } as any,
    {
      text: "Feature Overview",
      collapsible: true,
      children: [
        { text: "Feature List", link: "product_function.html" },
        { text: "Features by Conversation Type", link: "conversation_function.html" },
        {
          text: "User Management",
          collapsible: true,
          children: [
            { text: "User Registration and Login", link: "product_user_registration_login.html" },
            { text: "Presence Management", link: "product_user_presence.html" },
            { text: "User Attributes", link: "product_user_attribute.html" },
            { text: "User Relationships", link: "product_user_relationship.html" },
          ],
        },
        {
          text: "Message Management",
          collapsible: true,
          children: [
            { text: "Message Overview", link: "product_message_overview.html" },
            { text: "One-to-One Messages", link: "message_single_chat.html" },
            { text: "Group Messages", link: "message_group.html" },
            { text: "Chat Room Messages", link: "message_chatroom.html" },
            { text: "Message Storage", link: "message_store.html" },
            { text: "Message Format", link: "product_message_format.html" },
          ],
        },
        { text: "Offline Push", link: "product_offline_push_overview.html" },
        {
          text: "Group Management",
          collapsible: true,
          children: [
            { text: "Group Overview", link: "product_group_overview.html" },
            { text: "Message Threads", link: "product_thread_overview.html" },
          ],
        },
        { text: "Chat Rooms", link: "product_chatroom_overview.html" },
      ],
    },
    { text: "Feature Limitations", link: "limitation.html" },
    { text: "Data Centers", link: "data_center.html" },
    { type: "separator" } as any,
    {
      text: "Security",
      collapsible: true,
      children: [
        { text: "Security Best Practices", link: "security_best_practices.html" },
        { text: "GDPR Compliance", link: "GDPR.html" },
      ],
    },
    {
      text: "Console Guide",
      collapsible: true,
      children: [
        { text: "Register an Account", link: "console/account_register.html" },
        { text: "Identity Verification", link: "console/real_name_authentication.html" },
        {
          text: "App Management",
          collapsible: true,
          children: [
            { text: "App Creation and Launch Process", link: "console/app_create_to_launch.html" },
            { text: "Create an App", link: "console/app_create.html" },
            { text: "Manage and Configure an App", link: "console/app_manage.html" },
            { text: "Launch an App", link: "console/app_launch.html" },
            { text: "App Filing", link: "console/app_file.html" },
          ],
        },
        { text: "Purchase a Plan", link: "console/purchase_package.html" },
        {
          text: "Configure Basic Features",
          collapsible: true,
          children: [
            { text: "Users", link: "console/basic_user.html" },
            { text: "Messages", link: "console/basic_message.html" },
            { text: "Conversations, Groups, and Chat Rooms", link: "console/basic_conversation_group_chatroom.html" },
            { text: "Message Webhooks", link: "console/basic_webhook.html" },
            { text: "Server API Calls", link: "console/basic_restful_api_call.html" },
            { text: "Other Settings", link: "console/basic_other.html" },
          ],
        },
        { text: "Activate Value-Added Services", link: "console/purchase_value_added.html" },
        {
          text: "Account Management",
          collapsible: true,
          children: [
            { text: "Manage Account Information", link: "console/account_modify.html" },
            {
              text: "Security Settings",
              collapsible: true,
              children: [
                {
                  text: "MFA Verification",
                  collapsible: true,
                  children: [
                    { text: "Bind an MFA Device", link: "console/account_security_mfa_bind.html" },
                    { text: "Unbind an MFA Device", link: "console/account_security_mfa_unbind.html" },
                  ],
                },
                { text: "Login Protection", link: "console/account_security_protection_login.html" },
                { text: "Operation Protection", link: "console/account_security_protection_operation.html" },
                { text: "Change the Account Password", link: "console/account_security_password_change.html" },
                { text: "Change the Phone Number and Email Address", link: "console/account_security_mobile_email.html" },
              ],
            },
            { text: "Recover the Account Password", link: "console/account_password_retrieve.html" },
            { text: "Manage Subaccounts", link: "console/account_sub_create.html" },
          ],
        },
        { text: "Billing Center", link: "console/account_center.html" },
        {
          text: "Operations Management",
          collapsible: true,
          children: [
            {
              text: "Operations",
              collapsible: true,
              children: [
                { text: "User Management", link: "console/operation_user.html" },
                { text: "Group Management", link: "console/operation_group.html" },
                { text: "Chat Room Management", link: "console/operation_chatroom.html" },
              ],
            },
            {
              text: "Operational Data",
              collapsible: true,
              children: [
                { text: "Data Queries", link: "console/operation_data.html" },
                { text: "Message Statistics", link: "console/operation_message_statistics.html" },
              ],
            },
            {
              text: "Troubleshooting",
              collapsible: true,
              children: [
                { text: "Request Quality Monitoring", link: "console/operation_troubleshooting_request_quality.html" },
                { text: "Message Delivery Queries", link: "console/operation_troubleshooting_message_delivery.html" },
                { text: "User Connection Status Queries", link: "console/operation_troubleshooting_user_connection.html" },
                { text: "User Device Logs", link: "console/operation_troubleshooting_device_log.html" },
                { text: "Chat Room Message Rate", link: "console/operation_troubleshooting_chatroom_rate.html" },
              ],
            },
          ],
        },
      ],
    },
    { text: "Glossary", link: "glossary.html" },
  ],
  ...DOC_V5_SIDEBAR,
});
