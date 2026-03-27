import path from "node:path";
import fs from "node:fs";

const getSubDirectories = (dir) =>
  fs
    .readdirSync(dir)
    .filter((item) => fs.statSync(path.join(dir, item)).isDirectory());
const CALL_DOC_PATH = path.resolve(__dirname, "../../callkit");
const callKitPlatformList = getSubDirectories(CALL_DOC_PATH);

const callKitSidebar = [
  { text: "入门指引", link: "beginner_guide.html" },
  { text: "使用 MCP 集成", link: "easemob_mcp_server.html" },
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
    text: "产品介绍",
    collapsible: true,
    children: [
      { text: "产品概述", link: "product_overview.html" },
      { text: "开通服务", link: "product_activation.html" },
      { text: "购买指南", link: "product_purchase.html" }
    ]
  },
  { text: "跑通示例项目", link: "sample_runthrough.html" },
  { text: "快速开始", link: "quickstart.html" },
  { type: "separator" } as any,
  { text: "CallKit 架构", link: "architecture.html" },
  { text: "集成 CallKit", link: "integration.html" },
  { text: "权限", link: "permission.html", only: ["android"] },
  { text: "使用 LiveCommunicationKit", link: "livecommunicationkit.html", only: ["ios"]},
  { text: "画中画", link: "picture_in_picture.html", only: ["ios"] },
  { text: "使用 Telecom", link: "telecom.html", only: ["android"] },
  { text: "来电通知和悬浮窗", link: "float_top.html", only: ["android"] },
  { text: "自定义资源", link: "customization.html" },
  { text: "通话信令", link: "signaling.html" },
  { text: "API 概览", link: "api_overview.html" },
  { type: "separator" } as any,
  { text: "更新日志", link: "releasenote.html" },
  { text: "常见问题", link: "common_issue.html" },
  { text: "设计指南", link: "design_guide.html" },
  { text: "历史文档", link: "easecallkit.html" }
];

function buildCallKitSidebar() {
  const result = {};
  callKitPlatformList.forEach((platform) => {
    const key = `/callkit/${platform}/`;
    result[key] = callKitSidebar
      .map((sidebar) =>
        handleSidebarItem(platform, sidebar, CALL_DOC_PATH, "callkit")
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
      const newLink = `/${kitType}/${platform}/${sidebar.link}`;
      return { ...sidebar, link: newLink };
    }
  }
}

export const CALL_KIT_SIDEBAR = buildCallKitSidebar();
