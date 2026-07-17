import path from "node:path";
import fs from "node:fs";

const getSubDirectories = (dir) =>
  fs
    .readdirSync(dir)
    .filter((item) => fs.statSync(path.join(dir, item)).isDirectory());
const CHAT_DOC_PATH = path.resolve(__dirname, "../../uikit/chatuikit");
const CHATROOM_DOC_PATH = path.resolve(__dirname, "../../uikit/chatroomuikit");
const chatPlatformList = getSubDirectories(CHAT_DOC_PATH);
const chatroomPlatformList = getSubDirectories(CHATROOM_DOC_PATH);

const chatUikitSidebar = [
  { text: "入门指引", link: "beginner_guide.html" },
  { text: "使用 MCP 集成", link: "easemob_mcp_server.html", only: ["ios"]},
  { text: "产品概述", link: "chatuikit_overview.html", only: ["ios"] },
  {
        text: "特性",
        collapsible: true,
        children: [
          { text: "通用", link: "chatfeature_common.html" },
          { text: "会话", link: "chatfeature_conversation.html" },
          { text: "消息", link: "chatfeature_message.html" },
        ],
    only: ["ios"],
  },
  { text: "跑通示例项目", link: "chatuikit_run.html", only: ["ios"] },
  { type: "separator", only: ['ios']} as any,
  { text: "添加依赖", link: "chatuikit_integrated.html", only: ["ios"] },  
  { text: "快速开始", link: "chatuikit_quickstart.html", only: ["ios"] }, 
  { text: "页面导航栏", link: "chatuikit_custom_titlebar.html", only: ["ios"] },
  {
      text: "会话列表",
      collapsible: true,
      children: [
        { text: "页面介绍", link: "chatuikit_conversation_list_intro.html" },
        {
          text: "自定义会话列表",
          collapsible: true,
          children: [
               { text: "基本设置", link: "chatuikit_custom_conversation_list_basic.html" },
               { text: "高级设置", link: "chatuikit_custom_conversation_list_advanced.html" },
          ],
        },
      ],
    only: ["ios"],
  },
  {
      text: "消息",
      collapsible: true,
      children: [
        { text: "页面介绍", link: "chatuikit_chat_intro.html" },
        {
          text: "自定义消息列表",
          collapsible: true,
          children: [
            { text: "基本设置", link: "chatuikit_custom_chat_basic.html" },
            { text: "高级设置", link: "chatuikit_custom_chat_advanced.html" },
          ],
        },
        { text: "自定义消息输入", link: "chatuikit_custom_chat_inputmenu.html" },
      ],
    only: ["ios"],
  },
  {
        text: "通讯录",
        collapsible: true,
        children: [
          { text: "自定义通讯录页面", link: "chatuikit_custom_contact_list.html" },
          { text: "拦截事件与可重载的方法", link: "chatuikit_contact_intercept_event_overload_method.html" },
        ], 
      only: ["ios"]
  },
  { text: "好友详情", link: "chatuikit_custom_contact_details.html", only: ["ios"]},
  { text: "群详情", link: "chatuikit_custom_group_details.html", only: ["ios"]},
  { text: "用户信息提供", link: "chatuikit_userinfo.html", only: ["ios"]},
  { text: "国际化", link: "chatuikit_internationalization.html", only: ["ios"]},
  { text: "主题", link: "chatuikit_theme.html", only: ["ios"]},
  { text: "全局配置", link: "chatuikit_config_item.html", only: ["ios"]},
  { text: "进阶用法", link: "chatuikit_advancedusage.html", only: ["ios"]},
  // { text: "设计指南", link: "chatuikit_design_guide.html", only: ["ios"]},
  { text: "使用 MCP 集成", link: "easemob_mcp_server.html", only: ["web"]},
  { text: "产品概述", link: "chatuikit_overview.html", only: ["web"]},
  {
    text: "特性",
    collapsible: true,
    children: [
      { text: "通用", link: "chatfeature_common.html" },
      { text: "会话", link: "chatfeature_conversation.html" },
      { text: "消息", link: "chatfeature_message.html" },
    ],
    only: ["web"],
  },
  { text: "快速开始", link: "chatuikit_quickstart.html", only: ["web"]},
  { type: "separator", only: ['web']} as any,
  { text: "React 集成单群聊 UIKit", link: "chatuikit_integrated_react.html", only: ["web"]},
  { text: "用户信息提供", link: "chatuikit_provider.html", only: ["web"]},
  { text: "全局上下文", link: "chatuikit_context.html", only: ["web"]},
  { text: "登录", link: "chatuikit_login.html", only: ["web"]},
  { text: "事件监听器", link: "chatuikit_listener.html", only: ["web"]},
  { text: "页面标题栏", link: "chatuikit_custom_titlebar.html", only: ["web"]},
  {
      text: "会话列表",
      collapsible: true,
      children: [
        { text: "页面介绍", link: "chatuikit_conversation_list_intro.html" },
        { text: "自定义搜索栏", link: "chatuikit_custom_conversation_list_searchbar.html" },
        {
          text: "自定义会话列表",
          collapsible: true,
          children: [
           { text: "基本设置", link: "chatuikit_custom_conversation_list_basic.html" },
            { text: "高级设置", link: "chatuikit_custom_conversation_list_advanced.html" },
          ],
        },
      ],
    only: ["web"],
  },
  {
      text: "消息",
      collapsible: true,
      children: [
        { text: "页面介绍", link: "chatuikit_chat_intro.html" },
        { text: "自定义消息列表", link: "chatuikit_custom_chat.html" },
        { text: "自定义消息输入", link: "chatuikit_custom_chat_inputmenu.html" },
      ],
    only: ["web"],
  },
  {
      text: "通讯录",
      collapsible: true,
      children: [
        { text: "页面介绍", link: "chatuikit_contactlist_intro.html" },
        { text: "自定义页面", link: "chatuikit_contactlist.html" },
      ],
    only: ["web"],
  },
  { text: "rootStore", link: "chatuikit_store.html", only: ["web"]},
  { text: "音视频通话", link: "chatuikit_video.html", only: ["web"]},
  { text: "国际化", link: "chatuikit_internationalization.html", only: ["web"]},
  { text: "主题", link: "chatuikit_theme.html", only: ["web"]},
  { text: "组件文档", link: "chatuikit_storybook.html", only: ["web"]},
  // { text: "设计指南", link: "chatuikit_design_guide.html", only: ["web"] },
  { text: "使用 MCP 集成", link: "easemob_mcp_server.html", only: ["android", "harmonyos", "react-native", "flutter"]},
  { text: "产品概述", link: "chatuikit_overview.html", only: ["android", "harmonyos", "react-native", "flutter"]},
  {
      text: "特性",
      collapsible: true,
      children: [
        { text: "通用", link: "chatfeature_common.html" },
        { text: "会话", link: "chatfeature_conversation.html" },
        { text: "消息", link: "chatfeature_message.html" },
      ],
    only: ["android", "harmonyos", "react-native", "flutter"],
  },
  { text: "跑通示例项目", link: "chatuikit_run.html", only: ["react-native", "flutter"] },
  { text: "快速开始", link: "chatuikit_quickstart.html", only: ["android", "harmonyos", "react-native", "flutter"]},
  { type: "separator", only: ["android", "harmonyos", "react-native", "flutter"]} as any,
  { text: "添加依赖", link: "chatuikit_dependency.html", only: ["android", "harmonyos"] },
  { text: "初始化", link: "chatuikit_initialization.html", only: ["android", "harmonyos"] },
  { text: "页面标题栏", link: "chatuikit_custom_titlebar.html", only: ["android", "harmonyos", "flutter"]},
  { text: "页面导航栏", link: "chatuikit_custom_titlebar.html", only: ["react-native"]},
  { text: "集成单群聊 UIKit", link: "chatuikit_integrated.html", only: ["react-native", "flutter"] },
  {
      text: "会话列表",
      collapsible: true,
      children: [
        { text: "页面介绍", link: "chatuikit_conversation_list_intro.html" },
        { text: "自定义搜索栏", link: "chatuikit_custom_conversation_list_searchbar.html" },
        {
          text: "自定义会话列表",
          collapsible: true,
          children: [
            { text: "基本设置", link: "chatuikit_custom_conversation_list_basic.html" },
            { text: "高级设置", link: "chatuikit_custom_conversation_list_advanced.html" },
          ],
        },
      ],
    only: ["android", "harmonyos", "react-native", "flutter"],
  },
  {
      text: "消息",
      collapsible: true,
      children: [
        { text: "页面介绍", link: "chatuikit_chat_intro.html" },
        { text: "自定义搜索栏", link: "chatuikit_custom_chat_message_search_local.html", only: ["react-native"] },
        {
          text: "自定义消息列表",
          collapsible: true,
          children: [
            { text: "基本设置", link: "chatuikit_custom_chat_basic.html" },
            { text: "高级设置", link: "chatuikit_custom_chat_advanced.html" },
          ],
        },
        { text: "自定义消息输入", link: "chatuikit_custom_chat_inputmenu.html" }
      ], 
    only: ["android", "harmonyos", "react-native", "flutter"],
  },
  {
      text: "通讯录",
      collapsible: true,
      children: [
        { text: "页面介绍", link: "chatuikit_contactlist_intro.html" },
        { text: "自定义页面", link: "chatuikit_contactlist.html" },
      ],
    only: ["android", "harmonyos", "react-native", "flutter"],
  },
  { text: "用户信息提供", link: "chatuikit_userinfo.html", only: ["android", "harmonyos", "react-native", "flutter"]},
  { text: "好友详情", link: "chatuikit_custom_contact_details.html", only: ["android", "react-native", "flutter"]},
  { text: "群详情", link: "chatuikit_custom_group_details.html", only: ["android", "react-native", "flutter"] },
  { text: "自定义数据模型", link: "chatuikit_custom_data_model.html", only: ["react-native"] },
  {
      text: "自定义资源",
      collapsible: true,
      children: [
        { text: "自定义文本", link: "chatuikit_custom_text.html" },
        { text: "自定义图标", link: "chatuikit_custom_icon.html" },
      ],
    only: ["react-native"],
  },
  { text: "国际化", link: "chatuikit_internationalization.html", only: ["android", "react-native"] },
  { text: "主题", link: "chatuikit_theme.html", only: ["android", "harmonyos", "react-native", "flutter"]},
  { text: "进阶用法", link: "chatuikit_advancedusage.html", only: ["android", "react-native", "flutter"] },
  // { text: "更新日志", link: "releasenote.html",  except: ["uniapp"]},
  // { text: "设计指南", link: "chatuikit_design_guide.html", only: ["android", "harmonyos", "react-native", "flutter"]},
  // { text: "历史文档", link: "ui_historic.html.html", only: ["android", "ios"]},
  // {
  //   text: "历史文档",
  //   collapsible: true,
  //   children: [
  //     { text: "UIKit 介绍", link: "ui_overview.html" },
  //     { text: "快速开始", link: "ui_quickstart.html" },
  //     { text: "集成聊天页面", link: "ui_chat.html" },
  //     { text: "集成会话列表页面", link: "ui_conversation.html" },
  //   ],
  //   only: ["react-native", "flutter"],
  // },
  { text: "产品概述", link: "chatuikit_overview.html", only: ["uniapp"]},
  {
    text: "特性",
    collapsible: true,
    children: [
      { text: "通用", link: "chatfeature_common.html" },
      { text: "会话", link: "chatfeature_conversation.html" },
      { text: "消息", link: "chatfeature_message.html" },
    ],
    only: ["uniapp"],
  },
  { text: "快速开始", link: "chatuikit_quickstart.html", only: ["uniapp"]},
  { type: "separator", only: ["uniapp"]} as any,
  { text: "集成UIKit", link: "chatuikit_dependency.html", only: ["uniapp"]},
  { text: "初始化", link: "chatuikit_initialization.html", only: ["uniapp"]},
  // 会话列表
  {
    text: "会话列表",
    collapsible: true,
    children: [
      { text: "页面介绍", link: "chatuikit_conversation_list_intro.html" },
      { text: "自定义页面", link: "chatuikit_custom_conversation_list.html" },
    ],
    only: ["uniapp"],
  },
  {
    text: "消息",
    collapsible: true,
    children: [
      { text: "页面介绍", link: "chatuikit_chat_intro.html" },
      { text: "自定义页面", link: "chatuikit_custom_chat.html" },
    ],
    only: ["uniapp"],
  },
  { text: "进阶用法", link: "chatuikit_advantage.html", only: ["uniapp"]},
  { text: "常见问题", link: "faq.html", only: ["uniapp"]},
  { type: "separator"} as any, 
  { text: "更新日志", link: "releasenote.html"},
  { text: "常见问题", link: "faq.html", only: ["react-native"]},
  { text: "设计指南", link: "chatuikit_design_guide.html"},
  { text: "历史文档", link: "ui_historic.html", only: ["android", "ios"]},
  {
    text: "历史文档",
    collapsible: true,
    children: [
      { text: "UIKit 介绍", link: "ui_overview.html" },
      { text: "快速开始", link: "ui_quickstart.html" },
      { text: "集成聊天页面", link: "ui_chat.html" },
      { text: "集成会话列表页面", link: "ui_conversation.html" },
    ],
    only: ["react-native", "flutter"],
  },
];
const chatroomUikitSidebar = [
  { text: "使用 MCP 集成", link: "easemob_mcp_server.html"},
  { text: "产品概述", link: "roomuikit_overview.html" },
  {
    text: "特性",
    collapsible: true,
    children: [
      { text: "通用", link: "roomfeature_common.html" },
      { text: "消息扩展", link: "roomfeature_message.html" },
      { text: "成员管理", link: "roomfeature_member.html" },
    ],
  },
  { type: "separator"} as any,
  { text: "跑通示例项目", link: "roomuikit_run.html" },
  { text: "集成 ChatroomUIKit", link: "roomuikit_integrated.html" },
  { text: "快速开始", link: "roomuikit_quickstart.html" },
  { text: "最佳实践", link: "roomuikit_best_practice.html" },
  { text: "可配置项", link: "roomuikit_config_item.html" },
  { text: "主题", link: "roomuikit_theme.html" },
  { text: "自定义", link: "roomuikit_customize.html" },
  { text: "组件文档", link: "roomuikit_storybook.html", only: ["web"] },
  { type: "separator", except: ["web"] } as any,
  { type: "separator", only: ["web"]} as any,
  { text: "更新日志", link: "roomuikit_releasenote.html" },
  { text: "常见问题", link: "faq.html", only: ["react-native"] },
  { text: "设计指南", link: "design_guide.html" },
];

function buildChatUikitSidebar() {
  const result = {};
  chatPlatformList.forEach((platform) => {
    const key = `/uikit/chatuikit/${platform}/`;
    result[key] = chatUikitSidebar
      .map((sidebar) =>
        handleSidebarItem(platform, sidebar, CHAT_DOC_PATH, "chatuikit")
      )
      .filter((s) => s);
  });
  return result;
}

function buildChatroomUikitSidebar() {
  const result = {};
  chatroomPlatformList.forEach((platform) => {
    const key = `/uikit/chatroomuikit/${platform}/`;
    result[key] = chatroomUikitSidebar
      .map((sidebar) =>
        handleSidebarItem(platform, sidebar, CHATROOM_DOC_PATH, "chatroomuikit")
      )
      .filter((s) => s);
  });
  return result;
}

function linkExists(platform: string, link: string, docPath: string): boolean {
  try {
    const filePath = `${docPath}/${platform}/${link.replace(/.html$/, ".md")}`;
    return fs.existsSync(filePath);
  } catch (e) {
    console.error(`Error checking file existence: ${e}`);
    return false;
  }
}

function handleSidebarItem(platform, sidebar, docPath, kitType) {
  const hasChildren =
    sidebar.hasOwnProperty("children") && sidebar.children.length > 0;
  const hasOnly = sidebar.hasOwnProperty("only") && sidebar.only.length > 0;
  const hasExcept =
    sidebar.hasOwnProperty("except") && sidebar.except.length > 0;

  let needThisPlatform = true;
  if (hasOnly) {
    needThisPlatform = sidebar.only.indexOf(platform) > -1;
  }
  if (hasExcept) {
    needThisPlatform = sidebar.except.indexOf(platform) == -1;
  }

  if (!needThisPlatform) {
    return null;
  }
  if(sidebar.type === 'separator') {
    return { ...sidebar, type: 'separator' };
  }
  if (hasChildren) {
    let newchildren = sidebar.children
      .map((s) => handleSidebarItem(platform, s, docPath, kitType))
      .filter((s) => s);
    if (newchildren.length > 0) {
      return { ...sidebar, children: newchildren };
    }
  } else {
    if (linkExists(platform, sidebar.link, docPath)) {
      const newLink = `/uikit/${kitType}/${platform}/${sidebar.link}`;
      return { ...sidebar, link: newLink };
    }
  }
}

export const CHAT_UIKIT_SIDEBAR = buildChatUikitSidebar();
export const CHATROOM_UIKIT_SIDEBAR = buildChatroomUikitSidebar();
