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
  {
    /*
      text: 分组标题
      children: 分组导航列表
        text: 显示的文本
        link: 链接地址
        show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
        only: 数组形式，只有在数组中的平台下显示
        except: 数组形式，除了数组中指定的平台外都显示
        collapsible: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
        children: 子菜单。请参考「子菜单示例」
    */
    text: "UIKit 介绍",
    link: "overview.html",
  },
  {
    text: "快速开始",
    link: "quickstart.html",
    except: ["android", "ios"],
  },
  {
    text: "集成聊天页面",
    link: "key_function_chat_page.html",
    except: ["android", "ios"],
  },
  {
    text: "集成会话列表页面",
    link: "key_function_conversation_list.html",
    except: ["android", "ios"],
  },
];

const chatroomUikitSidebar = [
  { text: "概述", link: "roomuikit_overview.html" },
  {
    text: "特性",
    collapsible: true,
    children: [
      { text: "通用", link: "roomfeature_common.html" },
      { text: "消息扩展", link: "roomfeature_message.html" },
      { text: "成员管理", link: "roomfeature_member.html" },
    ],
  },
  { text: "跑通示例项目", link: "roomuikit_run.html" },
  { text: "集成 ChatroomUIKit", link: "roomuikit_integrated.html"},
  { text: "快速开始", link: "roomuikit_quickstart.html" },
  { text: "最佳实践", link: "roomuikit_best_practice.html" },
  { text: "可配置项", link: "roomuikit_configuration_items.html"},
  { text: "主题", link: "roomuikit_theme.html" },
  { text: "自定义", link: "roomuikit_customize.html" },
  { text: "更新日志", link: "roomuikit_releasenote.html" },
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
