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
      text: '内容审核',
      children: [
        { text: '产品简介', children: [
          { text: '产品概述', link: 'moderation_overview.html' },
        ]},
        { text: '产品定价',  children: [
          { text: '计费说明（国内）', link: 'moderation_billing_domestic.html' },
          { text: '计费说明（国外）', link: 'moderation_billing_overseas.html' },
        ]},
        { text: '快速开始',  children: [
          { text: '开通审核服务', link: 'moderation_enable.html' },
          { text: '规则配置', link: 'moderation_rule_config.html' },
          { text: '规则测试', link: 'moderation_rule_test.html' },
          { text: '历史记录', link: 'moderation_history.html' },
          { text: '消息审核机制', link: 'moderation_mechanism.html' },
        ]},
        { text: '进阶功能', children: [
          { text: '审核记录回调', link: 'moderation_record_callback.html' },
          { text: '消息人工审核', link: 'moderation_manual_review.html' },
          { text: '用户管理', link: 'moderation_usermgmt.html' },
        ]},  
        { text: '常见问题', children: [
          { text: '如何开始使用内容审核服务？', link: 'moderation_use_console.html' },
          { text: '如何新增自定义词？', link: 'moderation_add_word.html' },
          { text: '为什么处置方式选择了替换***，但实际被拦截了没有发出来？', link: 'moderation_replace_refuse.html' },
        ]},  
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
