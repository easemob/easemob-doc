import { sidebar } from "vuepress-theme-hope";
import { DOC_V5_SIDEBAR } from "./document";

export const zhSidebar = sidebar({
  // Put platform-specific SDK sidebars before the generic SDK overview.
  // Sidebar matching is prefix-based, so the more specific paths must win.
  ...DOC_V5_SIDEBAR,
  "/sdk/v5/": [
    { text: "SDK Overview", link: "/sdk/v5/" },
    { text: "Android", link: "/sdk/v5/android/" },
    { text: "iOS", link: "/sdk/v5/ios/beginner_guide.html" },
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
        {
          text: "App Management",
          collapsible: true,
          children: [
            { text: "App Creation and Launch Process", link: "console/app_create_to_launch.html" },
            { text: "Create an App", link: "console/app_create.html" },
            { text: "Manage and Configure an App", link: "console/app_manage.html" },
            { text: "Launch an App", link: "console/app_launch.html" },
          ],
        },
        { text: "Purchase a Plan", link: "console/purchase_package.html" },
        {
          text: "Configure Basic Features",
          collapsible: true,
          children: [
            { text: "User and Login", link: "console/basic_user.html" },
            { text: "Message and Conversation", link: "console/basic_message_conversation.html" },
            { text: "One-to-One and Group Chat", link: "console/basic_single_group_chat.html" },
            { text: "Chat Room", link: "console/basic_chat_room.html" },
            { text: "Webhooks", link: "console/basic_webhook.html" },
            { text: "REST API Call Rate", link: "console/basic_restful_api_call.html" },
            { text: "Security", link: "console/basic_security.html" },
          ],
        },
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
          ],
        },
      ],
    },
    { text: "Glossary", link: "glossary.html" },
  ],
});
