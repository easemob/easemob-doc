export const PUSH_SIDEBAR = [
    {
      text: '产品介绍',
      children: [
        { text: '产品概述', link: 'push_overview.html' },
        { text: '产品动态', collapsible: true, children: [
          { text: '产品功能动态', link: 'push_dynamics.html' },
          { text: 'Android SDK 发布动态', link: 'push_dynamics_android.html' },
          { text: 'iOS SDK 发布动态', link: 'push_dynamics_ios.html' },
        ]},
        { text: '全球化部署', link: 'push_global_deployment.html' },
      ]
    },
    {
      text: '产品定价',
      children: [
        { text: '计费说明', link: 'push_billing.html' },
      ]
    },
    {
      text: '快速入门',
      children: [
        { text: '创建产品及应用', link: 'push_createproduct_app.html' },
        { text: '创建推送', link: 'push_createnotification.html' },
        { text: '推送任务', link: 'push_task.html' },
        { text: '标签管理', link: 'push_tag_mgmt.html' },
        { text: '证书配置', link: 'push_certificate_config.html' },
        { text: '数据统计', link: 'push_statistics.html' },
      ]
    },
    {
      text: 'Android 接入',
      children: [
        { text: '推送集成说明', link: 'push_integration_note_android' },
        { text: '推送集成过程', link: 'push_integration_process_android' },
        { text: '厂商统计', link: 'push_androidvendor_statistics' },
        { text: '推送厂商消息分类', link: 'push_androidvendor_msgclassification' },
        { text: '厂商通道限制及解决方案', link: 'push_androidchannel_restriction.html' },
      ]
    },
    {
      text: 'iOS 接入',
      children: [
        { text: '推送集成说明', link: 'push_integration_note_ios' },
        { text: '推送集成过程', link: 'push_integration_process_ios' },
        { text: 'APNs 送达统计', link: 'push_apns_deliver_statistics.html' },
      ]
    },
    {
      text: '服务端 REST',
      children: [
        { text: '推送标签管理', link: 'push_tag_mgmt.html' },
        { text: '发送推送通知', link: 'push_send_notification.html' },
        { text: '配置推送通知', link: 'push_notification_config.html' },
      ]
    },
]
