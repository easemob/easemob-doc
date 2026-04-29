export const PUSH_SIDEBAR = [
    { text: '服务介绍', link: 'push_overview.html' },
    {
      text: '计费说明',
      collapsible: true,
      children: [
        { text: '国内计费说明', link: 'push_billing_domestic.html' },
        { text: '海外计费说明', link: 'push_billing_overseas.html' },
      ]
    },
    {
      text: '快速入门',
      collapsible: true,
      children: [
        { text: '开通服务', link: 'push_activate.html' },
        { text: '证书配置', link: 'push_certificate_config.html' },
        { text: '创建推送', link: 'push_task_create.html' },
        { text: '推送任务', link: 'push_task.html' },
        { text: '标签管理', link: 'push_tag_mgmt.html' },
        { text: '数据统计', link: 'push_statistics.html' },
      ]
    },
    {
      text: 'Android 接入',
      collapsible: true,
      children: [
        { text: '推送集成说明', link: 'push_integration_note_android' },
        { text: '推送集成过程', link: 'push_integration_process_android' },
        { text: '厂商统计', link: 'push_androidvendor_statistics' },
        // { text: '推送厂商消息分类', link: 'push_androidvendor_msgclassification' },
        { text: '厂商通道限制及解决方案', link: 'push_androidchannel_restriction.html' },
      ]
    },
    {
      text: 'iOS 接入',
      collapsible: true,
      children: [
        { text: '推送集成说明', link: 'push_integration_note_ios' },
        { text: '推送集成过程', link: 'push_integration_process_ios' },
        { text: 'APNs 送达统计', link: 'push_apns_deliver_statistics.html' },
      ]
    },
    {
      text: '服务端 REST',
      collapsible: true,
      children: [
        { text: '服务端 API 概览', link: 'push_api_call_limitation.html' },
        { text: '推送标签管理', link: 'push_by_tag.html' },
        { text: '发送推送通知', link: 'push_send_notification.html' },
        { text: '配置推送通知', link: 'push_notification_config.html' },
      ]
    },
]
