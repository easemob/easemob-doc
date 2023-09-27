import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  { text: '产品简介', link: '/product/introduction.html' },
  {
     text: 'SDK/REST 集成', 
     children: [
      {
        text: '平台',
        children: [
          {
            text: 'Android',
            icon: '/icon-Android.svg',
            link: '/document/android/quickstart.html'
          },
          {
            text: 'iOS',
            icon: '/icon-iOS.svg',
            link: '/document/ios/quickstart.html'
          },
          {
            text: 'Web',
            icon: '/icon-web.svg',
            link: '/document/web/quickstart.html'
          },
          {
            text: 'Windows',
            icon: '/icon-windows.svg',
            link: '/document/windows/quickstart.html'
          }
        ]
      },
      {
        text: '框架',
        children: [
          {
            text: 'React Native',
            icon: '/icon-ReactNative.svg',
            link: '/document/react-native/quickstart.html'
          },
          {
            text: 'Flutter',
            icon: '/icon-flutter.svg',
            link: '/document/flutter/quickstart.html'
          },
          {
            text: 'Unity',
            icon: '/icon-unity.svg',
            link: '/document/unity/quickstart.html'
          },
          {
            text: '小程序',
            icon: '/icon-mini-program.svg',
            link: '/document/applet/overview.html'
          },
          {
            text: 'uni-app',
            icon: '/icon-uni-app.svg',
            link: '/document/applet/uniapp.html'
          },
        ]
      },
      {
        text: '服务端',
        children: [
          {
        text: 'REST API',    
        icon: '/icon-platform.svg',
        link: '/document/server-side/overview.html'
       }
      ]  
    },
    ]
  }, 
  // {
  //   text: 'UIKit', 
  //   children: [
  //    {
  //      text: '平台',
  //      children: [
  //        {
  //          text: 'Android',
  //          icon: '/icon-Android.svg',
  //          link: '/uikit/android/overview.html'
  //        },
  //        {
  //          text: 'iOS',
  //          icon: '/icon-iOS.svg',
  //          link: '/uikit/ios/overview.html'
  //        },
  //       //  {
  //       //    text: 'Web',
  //       //    icon: '/icon-web.svg',
  //       //    link: '/uikit/web/overview.html'
  //       //  },
  //       //  {
  //       //    text: 'Windows',
  //       //    icon: '/icon-windows.svg',
  //       //    link: '/uikit/windows/overview.html'
  //       //  }
  //      ]
  //    },
  //    {
  //      text: '框架',
  //      children: [
  //        {
  //          text: 'React Native',
  //          icon: '/icon-ReactNative.svg',
  //          link: '/uikit/react-native/overview.html'
  //        },
  //        {
  //          text: 'Flutter',
  //          icon: '/icon-flutter.svg',
  //          link: '/uikit/flutter/overview.html'
  //        },
  //       //  {
  //       //    text: 'Unity',
  //       //    icon: '/icon-unity.svg',
  //       //    link: '/uikit/unity/overview.html'
  //       //  },
  //       //  {
  //       //    text: '小程序',
  //       //    icon: '/icon-mini-program.svg',
  //       //    link: '/uikit/applet/overview.html'
  //       //  },
  //       //  {
  //       //    text: 'uni-app',
  //       //    icon: '/icon-uni-app.svg',
  //       //    link: '/uikit/applet/uniapp.html'
  //       //  },
  //      ]
  //    },
  //  ]
  // },  
  {
     text: 'API 参考',
     children: [
      {
        text: '平台',
        children: [
          {
            text: 'Android',
            icon: '/icon-Android.svg',
            link: 'https://sdkdocs.easemob.com/apidoc/android/chat3.0/annotated.html'
          },
          {
            text: 'iOS',
            icon: '/icon-iOS.svg',
            link: 'https://sdkdocs.easemob.com/apidoc/ios/chat3.0/annotated.html'
          },
          {
            text: 'Web/小程序',
            icon: '/icon-web.svg',
            link: 'https://docs-im-beta.easemob.com/jsdoc/index.html'
          },
          {
            text: 'Windows',
            icon: '/icon-windows.svg',
            link: 'https://sdkdocs.easemob.com/apidoc/unity/annotated.html'
          }
        ]
      },
      {
        text: '框架',
        children: [
          {
            text: 'React Native',
            icon: '/icon-ReactNative.svg',
            link: 'https://sdkdocs.easemob.com/apidoc/rn/modules.html'
          },
          {
            text: 'Flutter',
            icon: '/icon-flutter.svg',
            link: 'https://sdkdocs.easemob.com/apidoc/flutter/index.html'
          },
          {
            text: 'Unity',
            icon: '/icon-unity.svg',
            link: 'https://sdkdocs.easemob.com/apidoc/unity/annotated.html'
          }
        ]
      },
      {
        text: '服务端',
        children: [
          {
            text: 'Java',
            icon: '/icon-platform.svg',
            link: 'https://easemob.github.io/easemob-im-server-sdk/'
          },
          {
            text: 'PHP',
            icon: '/icon-platform.svg',
            link: 'https://easemob.github.io/im-php-server-sdk/annotated.html'
          }
        ]
      },
     ]
  },
  {
    text: '即时推送',
    link: '/push/push_overview.html'
  },
  {
    text: '私有部署',
    children: [
          {
            text: '即时通讯',
            link: '/private/im/uc_deploy.html'
          },
          {
            text: '音视频',
            link: '/private/media/common_introduction.html'
          }
        ]
      
  },
  { text: '历史版本', link: 'https://docs-im.easemob.com/ccim/intro' },
  { text: '文档“捉虫”活动', link: 'https://www.imgeek.org/article/825360944' },
]);
