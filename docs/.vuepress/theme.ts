import { hopeTheme, ThemeOptions } from "vuepress-theme-hope";
import { zhNavbar } from "./navbar/index.js";
import { zhSidebar } from "./sidebar/index.js";

interface CustomConfig {
  extra_nav?: any[];
}

export default hopeTheme(<ThemeOptions & CustomConfig>{
  hostname: "https://doc.easemob.com/",
  home: "/product/introduction",
  iconAssets: "iconfont",
  logo: "/logo.png",
  repo: "easemob/easemob-doc",
  docsBranch: "doc-v2",
  docsDir: "docs",
  darkmode: "disable",
  pure: true,
  contributors: false,
  // navbar
  navbar: zhNavbar,
  // sidebar
  sidebar: zhSidebar,
  footer: "环信IM文档",
  displayFooter: true,
  headerDepth: 2,
  extra_nav: [
    // { text: '提交工单', link: 'https://console.easemob.com/ticket', type: 'info' },
    {
      text: "登录",
      link: "https://console.easemob.com/user/login",
      type: "success",
    },
    {
      text: "注册",
      link: "https://console.easemob.com/user/register",
      type: "primary",
    },
  ],
  // page meta
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },
  plugins: {
    mdEnhance: {
      container: true,
      imgSize: true,
    },
  },
});
