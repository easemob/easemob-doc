import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  // { text: '产品简介', link: '/product/introduction.html' },

  { text: '即时通讯', children: [
    /**{
       text: 'V1.0',
       link: '/document/v1/privatization/uc_introduction.html'
     },**/
    {
      text: 'V2.0',
      link: '/document/v2/privatization/uc_introduction.html'
    },
  ] },
//   {
//      text: '集成文档', 
//      children: [
//       {
//         text: '平台',
//         children: [
//           {
//             text: 'Android',
//             icon: '/icon-Android.svg',
//             link: '/document/v2/android/quickstart.html'
//           },
//           {
//             text: 'iOS',
//             icon: '/icon-iOS.svg',
//             link: '/document/v2/ios/quickstart.html'
//           },
//           {
//             text: 'Web',
//             icon: '/icon-web.svg',
//             link: '/document/v2/web/quickstart.html'
//           },
//           {
//             text: 'Windows',
//             icon: '/icon-windows.svg',
//             link: '/document/v2/windows/quickstart.html'
//           }
//         ]
//       },
//       {
//         text: '框架',
//         children: [
//           {
//             text: 'React Native',
//             icon: '/icon-ReactNative.svg',
//             link: '/document/v2/react-native/quickstart.html'
//           },
//           {
//             text: 'Flutter',
//             icon: '/icon-flutter.svg',
//             link: '/document/v2/flutter/quickstart.html'
//           },
//           {
//             text: 'Unity',
//             icon: '/icon-unity.svg',
//             link: '/document/v2/unity/quickstart.html'
//           },
//           {
//             text: '小程序',
//             icon: '/icon-mini-program.svg',
//             link: '/document/v2/applet/overview.html'
//           },
//           {
//             text: 'uni-app',
//             icon: '/icon-uni-app.svg',
//             link: '/document/v2/applet/uniapp.html'
//           },
//         ]
//       },
//       {
//         text: '服务端',
//         children: [
//           {
//         text: 'REST API',    
//         icon: '/icon-platform.svg',
//         link: '/document/v2/server-side/overview.html'
//        }
//       ]  
//     },
//   ]
// },  

  // {
  //    text: 'API 参考',
  //    children: [
  //     {
  //       text: '平台',
  //       children: [
  //         {
  //           text: 'Android',
  //           icon: '/icon-Android.svg',
  //           link: 'https://sdkdocs.easemob.com/apidoc/android/chat3.0/annotated.html'
  //         },
  //         {
  //           text: 'iOS',
  //           icon: '/icon-iOS.svg',
  //           link: 'https://sdkdocs.easemob.com/apidoc/ios/chat3.0/annotated.html'
  //         },
  //         {
  //           text: 'Web/小程序',
  //           icon: '/icon-web.svg',
  //           link: 'https://docs-im-beta.easemob.com/jsdoc/index.html'
  //         },
  //         {
  //           text: 'Windows',
  //           icon: '/icon-windows.svg',
  //           link: 'https://sdkdocs.easemob.com/apidoc/unity/annotated.html'
  //         }
  //       ]
  //     },
  //     {
  //       text: '框架',
  //       children: [
  //         {
  //           text: 'React Native',
  //           icon: '/icon-ReactNative.svg',
  //           link: 'https://sdkdocs.easemob.com/apidoc/rn/modules.html'
  //         },
  //         {
  //           text: 'Flutter',
  //           icon: '/icon-flutter.svg',
  //           link: 'https://sdkdocs.easemob.com/apidoc/flutter/index.html'
  //         },
  //         {
  //           text: 'Unity',
  //           icon: '/icon-unity.svg',
  //           link: 'https://sdkdocs.easemob.com/apidoc/unity/annotated.html'
  //         }
  //       ]
  //     },
  //     {
  //       text: '服务端',
  //       children: [
  //         {
  //           text: 'Java',
  //           icon: '/icon-platform.svg',
  //           link: 'https://easemob.github.io/easemob-im-server-sdk/'
  //         },
  //         {
  //           text: 'PHP',
  //           icon: '/icon-platform.svg',
  //           link: 'https://easemob.github.io/im-php-server-sdk/annotated.html'
  //         }
  //       ]
  //     },
  //    ]
  // },
  {
    text: '音视频',
    link: '/private/media/common_introduction.html'
  },
  {
    text: '即时推送',
    link: '/push/push_overview.html'
  },
  {
    text: '解决方案',
    link: '/private/im/uc_overview.html'
  },
]);
