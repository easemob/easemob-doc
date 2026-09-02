import { sidebar } from "vuepress-theme-hope";
import { DOC_V5_SIDEBAR } from "./document";

export const zhSidebar = sidebar({
  // Put platform-specific SDK sidebars before the generic SDK overview.
  ...DOC_V5_SIDEBAR,
  "/sdk/v5/": [
    { text: "SDK Overview", link: "/sdk/v5/" },
    { text: "Android", link: "/sdk/v5/android/" },
    { text: "iOS", link: "/sdk/v5/ios/beginner_guide.html" },
    { text: "Web", link: "/sdk/v5/web/" },
  ],
  // Product sidebar labels are defined here and do not follow Markdown H1 titles.
  "/product/": [
    { text: "Product Dynamics", link: "product_dynamics.html" },
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
          text: "User",
          collapsible: true,
          children: [
            { text: "User Registration & Login", link: "product_user_registration_login.html" },
            { text: "Presence", link: "product_user_presence.html" },
            { text: "User Attribute", link: "product_user_attribute.html" },
            { text: "User Relationship", link: "product_user_relationship.html" },
          ],
        },
        {
          text: "Message",
          collapsible: true,
          children: [
            { text: "Message Overview", link: "product_message_overview.html" },
            { text: "One-to-One Message", link: "message_single_chat.html" },
            { text: "Group Message", link: "message_group.html" },
            { text: "Chat Room Message", link: "message_chatroom.html" },
            { text: "Message Storage", link: "message_store.html" },
            { text: "Message Format", link: "product_message_format.html" },
          ],
        },
        { text: "Offline Push", link: "product_offline_push_overview.html" },
        {
          text: "Group",
          collapsible: true,
          children: [
            { text: "Group Overview", link: "product_group_overview.html" },
            { text: "Message Thread", link: "product_thread_overview.html" },
          ],
        },
        { text: "Chat Room", link: "product_chatroom_overview.html" },
      ],
    },
    { text: "Feature Limitations", link: "limitation.html" },
    { text: "Data Center", link: "data_center.html" },
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
      text: "Console",
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
            { text: "User & Login", link: "console/basic_user.html" },
            { text: "Message & Conversation", link: "console/basic_message_conversation.html" },
            { text: "One-to-One & Group Chat", link: "console/basic_single_group_chat.html" },
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
