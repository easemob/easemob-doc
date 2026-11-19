export const TRANSLATION_SIDEBAR = [
  { text: '服务介绍', link: '/value-added/translation/message_translation_overview.html' },
  {
    text: '计费说明',
    collapsible: true,
    defaultOpen: false,
    children: [
      { text: '国内计费说明', link: '/value-added/translation/message_translation_billing_domestic.html' },
      { text: '海外计费说明', link: '/value-added/translation/message_translation_billing_overseas.html' },
    ],
  },
  {
    text: '服务集成',
    collapsible: true,
    defaultOpen: true,
    children: [
      { text: 'Android', link: '/value-added/translation/message_translation_android.html' },
      { text: 'iOS', link: '/value-added/translation/message_translation_ios.html' },
      { text: 'Web/小程序', link: '/value-added/translation/message_translation_web.html' },
      { text: 'HarmonyOS', link: '/value-added/translation/message_translation_harmonyos.html' },
      { text: 'Flutter', link: '/value-added/translation/message_translation_flutter.html' },
      { text: 'React Native', link: '/value-added/translation/message_translation_react-native.html' },
      { text: 'Unity', link: '/value-added/translation/message_translation_unity.html' },
      { text: 'Windows', link: '/value-added/translation/message_translation_windows.html' },
      {
        text: '服务端',
        collapsible: false,
        children: [
          { text: '翻译消息内容', link: '/value-added/translation/message_translation_text_rest.html' },
          { text: '获取翻译语言列表', link: '/value-added/translation/message_translation_language_list_rest.html' },
          { text: '检测文本的源语言', link: '/value-added/translation/message_translation_detect_rest.html' },
        ],
      },
    ],
  },
]
