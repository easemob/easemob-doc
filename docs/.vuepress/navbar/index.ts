import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  { text: '产品简介', link: '/product/introduction.html' },
  {
     text: '集成文档', 
     link: '/document/android/quickstart.html',
    //  children: [
    //   {
    //     text: 'Android',
    //     link: '/document/android'
    //   },
    //   {
    //     text: 'iOS',
    //     link: '/document/ios'
    //   },
    //   {
    //     text: 'Web',
    //     link: '/document/web'
    //   },
    //  ]
  },
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
      }
     ]
  },
  { text: '历史版本', link: 'https://docs-im.easemob.com/ccim/intro' },
  { text: '参与环信文档“捉虫”活动，领京东卡', link: 'https://www.imgeek.org/article/825360944' },
]);
