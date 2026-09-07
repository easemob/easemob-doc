import { navbar } from 'vuepress-theme-hope'

export const zhNavbar = navbar([
  { text: '产品介绍', link: '/docs/product/introduction.html' },
  {
    text: 'CallKit',
    children: [
      {
        text: 'Android',
        icon: '/icon-Android.svg',
        link: '/docs/callkit/android/beginner_guide.html'
      },
      {
        text: 'iOS',
        icon: '/icon-iOS.svg',
        link: '/docs/callkit/ios/beginner_guide.html'
      },
      {
        text: 'Web',
        icon: '/icon-web.svg',
        link: '/docs/callkit/web/beginner_guide.html'
      },
    ]
  },
  {
    text: 'SDK',
    children: [
      {
        text: '平台',
        children: [
          {
            text: 'Android',
            icon: '/icon-Android.svg',
            link: '/docs/document/android/beginner_guide.html'
          },
          {
            text: 'iOS',
            icon: '/icon-iOS.svg',
            link: '/docs/document/ios/beginner_guide.html'
          },
          {
            text: 'Web',
            icon: '/icon-web.svg',
            link: '/docs/document/web/beginner_guide.html'
          },
          {
            text: 'HarmonyOS',
            icon: '/icon-harmonyos.svg',
            link: '/docs/document/harmonyos/beginner_guide.html'
          },
          // {
          // text: 'Windows',
          // icon: '/icon-windows.svg',
          // link: '/docs/document/windows/beginner_guide.html'
          // },
        ]
      },
      {
        text: '框架',
        children: [
          {
            text: 'React Native',
            icon: '/icon-ReactNative.svg',
            link: '/docs/document/react-native/beginner_guide.html'
          },
          {
            text: 'Flutter',
            icon: '/icon-flutter.svg',
            link: '/docs/document/flutter/beginner_guide.html'
          },
          {
            text: 'Unity',
            icon: '/icon-unity.svg',
            link: '/docs/document/unity/beginner_guide.html'
          },
          {
            text: '小程序',
            icon: '/icon-mini-program.svg',
            link: '/docs/document/web/integration.html'
          },
          {
            text: 'uni-app',
            icon: '/icon-uni-app.svg',
            link: '/docs/document/web/integration.html'
          },
        ]
      },
    ]
  },
  { text: '服务端', link: '/docs/document/server-side/overview.html'},

 /* {
    text: 'API 参考',
    children: [
      {
        text: '平台',
        children: [
          {
            text: 'Android',
            icon: '/icon-Android.svg',
            link: 'https://doc.easemob.com/apidoc/android/chat3.0/annotated.html'
          },
          {
            text: 'iOS',
            icon: '/icon-iOS.svg',
            link: 'https://doc.easemob.com/apidoc/ios/chat3.0/annotated.html'
          },
          {
            text: 'Web/小程序',
            icon: '/icon-web.svg',
            link: 'https://doc.easemob.com/jsdoc/index.html'
          },
          {
            text: 'HarmonyOS',
            icon: '/icon-harmonyos.svg',
            link: 'https://doc.easemob.com/apidoc/harmony/chat3.0/classes/ChatClient.ChatClient.html'
          },
          {
            text: 'Windows',
            icon: '/icon-windows.svg',
            link: 'https://doc.easemob.com/apidoc/unity/annotated.html'
          }
        ]
      },
      
      {
        text: '框架',
        children: [
          {
            text: 'React Native',
            icon: '/icon-ReactNative.svg',
            link: 'https://doc.easemob.com/apidoc/rn/modules.html'
          },
          {
            text: 'Flutter',
            icon: '/icon-flutter.svg',
            link: 'https://doc.easemob.com/apidoc/flutter/index.html'
          },
          {
            text: 'Unity',
            icon: '/icon-unity.svg',
            link: 'https://doc.easemob.com/apidoc/unity/annotated.html'
          },
        ]
      },
      {
        text: '服务端',
        children: [
          {
            text: 'Java 1.0',
            icon: '/icon-platform.svg',
            link: 'https://easemob.github.io/easemob-im-server-sdk/'
          },
          {
            text: 'Java 2.0',
            icon: '/icon-platform.svg',
            link: 'https://github.com/easemob/easemob-im-server-sdk/tree/master_java_2.0/src/test/java/com/easemob/im/api'
          },
          {
            text: 'PHP',
            icon: '/icon-platform.svg',
            link: 'https://easemob.github.io/im-php-server-sdk/annotated.html'
          }
        ]
      }
    ]
  },
  */
 /*{
    text: '内容审核',
    link: '/docs/product/moderation_overview.html'
  },
  {
    text: '即时推送',
    link: '/push/push_overview.html'
  },
  */
  {
    text: '增值服务',
      children: [
        { text: '即时推送', link: '/docs/value-added/push/push_overview.html'},
        { text: '消息翻译', link: '/docs/value-added/translation/message_translation_android.html'}
      ]
  },
  // {
  //   text: "私有部署",
  //   children: [
  //     {
  //       text: "即时通讯",
  //       link: "/private/im/uc_deploy.html",
  //     },
  //    {
  //      text: "音视频",
  //      link: "/private/media/common_introduction.html",
  //    },
  //  ],
  // },
  //  { text: '历史版本', link: 'https://docs-im.easemob.com/ccim/intro' },
  // { text: '有奖调研', link: 'https://doc.easemob.com/form/wjx.html' }
])
