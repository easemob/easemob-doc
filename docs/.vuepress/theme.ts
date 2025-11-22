import { hopeTheme, ThemeOptions } from "vuepress-theme-hope";
import { zhNavbar } from "./navbar/index.js";
import { zhSidebar } from "./sidebar/index.js";

interface CustomConfig {
  extra_nav?: any[];
}

export default hopeTheme(<ThemeOptions & CustomConfig>{
  hostname: "https://doc.easemob.com/",
  home: "/",
  iconAssets: "iconfont",
  logo: "/logo_name.png",
  repo: "easemob/easemob-doc",
  docsBranch: "doc-v2",
  docsDir: "docs",
  darkmode: "disable",
  pure: true,
  contributors: false,
  // navbar
  navbar: zhNavbar,
  navbarLayout: {
    start: ["Brand", "Links"],
    center: [],
    end: ["Language", "Repo", "Outlook"],
  },
  // sidebar
  sidebar: zhSidebar,
  footer:
    "<div class='footer-left'>环信 IM 文档 V 1.0.0</div><div class='footer-right'>©️环信 2026</div>",
  displayFooter: true,
  headerDepth: 2,
  extra_nav: [
    // { text: '提交工单', link: 'https://console.easemob.com/ticket', type: 'info' },
    {
      text: "登录",
      link: "https://console.easemob.com/user/login",
      type: "",
    },
    {
      text: "注册",
      link: "https://console.easemob.com/user/register",
      type: "primary",
    },
  ],
  editLink: false,
  plugins: {
    mdEnhance: {
      container: true,
      imgSize: true,
      tabs: true,
    },
  },
});
