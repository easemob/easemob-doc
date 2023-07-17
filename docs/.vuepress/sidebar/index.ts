import { sidebar } from "vuepress-theme-hope";
import { DOC_SIDEBAR } from "./document"
import { PRIVATE_IM_SIDEBAR, PRIVATE_MEDIA_SIDEBAR } from './private'

export const zhSidebar = sidebar({

  '/product/': [
    {
      /*
        text: 分组标题
        children: 分组导航列表
          text: 显示的文本
          link: 链接地址
          show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
          collapsable: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
          children: 子菜单。请参考「子菜单示例」
      */
      text: '产品简介',
      children: [
        { text: '产品概述', link: 'introduction.html' },
        { text: 'IM 产品使用限制', link: 'limitation.html' },
        { text: '接口频率限制', link: 'limitationapi.html' },
        { text: '产品价格', link: 'pricing.html' },
        { text: '术语表', link: 'glossary.html' }
      ]
    },
    {
      text: '快速开始',
      children: [
        { text: '使用环信 App Token 鉴权', link: 'easemob_app_token.html' },
        { text: '使用环信 User Token 鉴权', link: 'easemob_user_token.html' },
        { text: '快速开始（不使用 UIKIT）Android', link: '/document/android/quickstart.html' },
        { text: '快速开始（不使用 UIKIT）iOS', link: '/document/ios/quickstart.html' },
        { text: '快速开始（不使用 UIKIT）Web', link: '/document/web/quickstart.html' }
      ]
    },
    {
      text: '私有化集成',
      children: [
        { text: '私有化部署流程', link: 'uc_deploy.html' },
        { text: 'SDK 及 Demo 下载', link: 'uc_private.html' },
        { text: '环信通下载', link: 'uc_overview.html' },
      ]
    },
    {
      text: '常见方案',
      children: [
        { text: '迁移到环信', link: 'migrate_to_easemob.html' },
      ]
    },
    {
      text: 'FAQ',
      children: [
        { text: 'FAQ 质量', link: 'faq_quality_issues.html' },
        { text: 'FAQ 集成', link: 'faq_integration_issues.html' },
        { text: '帮助中心', link: 'help.html' },
      ]
    },
    {
      text: '安全',
      children: [
        { text: '安全最佳实践', link: 'security_best_practices.html' },
        { text: 'GDPR 安全合规', link: 'GDPR.html' },
      ]
    },
    {
      text: 'Console 指南',
      children: [
        { text: '开通和配置服务', link: 'enable_and_configure_IM.html' },
        { text: '请求质量概览', link: 'request_quality_overview.html' },
      ]
    },
  ],
  ...DOC_SIDEBAR,
  '/private/im/': PRIVATE_IM_SIDEBAR,
  '/private/media/': PRIVATE_MEDIA_SIDEBAR
});
