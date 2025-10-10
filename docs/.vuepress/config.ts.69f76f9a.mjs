// docs/.vuepress/config.ts
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";

// docs/.vuepress/markdown/plugin.ts
import container from "markdown-it-container";
var containerPlugin = (md) => {
  md.use(...createContainer("notice", "\u63D0\u793A", md));
};
function createContainer(klass, defaultTitle, md) {
  return [
    container,
    klass,
    {
      render(tokens, idx) {
        const token = tokens[idx];
        const info = token.info.trim().slice(klass.length).trim();
        if (token.nesting === 1) {
          const title = md.renderInline(info || defaultTitle);
          return `<div class="${klass == "notice" ? "note" : klass} hint-container"><p class="hint-container-title">${title}</p>
`;
        } else {
          return `</div>
`;
        }
      }
    }
  ];
}

// docs/.vuepress/theme.ts
import { hopeTheme } from "vuepress-theme-hope";

// docs/.vuepress/navbar/index.ts
import { navbar } from "vuepress-theme-hope";
var zhNavbar = navbar([
  { text: "\u4EA7\u54C1\u7B80\u4ECB", link: "/product/introduction.html" },
  {
    text: "UIKit",
    children: [
      {
        text: "\u5355\u7FA4\u804A UIKit",
        children: [
          {
            text: "Android",
            icon: "/icon-Android.svg",
            link: "/uikit/chatuikit/android/chatuikit_overview.html"
          },
          {
            text: "iOS",
            icon: "/icon-iOS.svg",
            link: "/uikit/chatuikit/ios/chatuikit_overview.html"
          },
          {
            text: "Web",
            icon: "/icon-web.svg",
            link: "/uikit/chatuikit/web/chatuikit_overview.html"
          },
          {
            text: "HarmonyOS",
            icon: "/icon-harmonyos.svg",
            link: "/uikit/chatuikit/harmonyos/chatuikit_overview.html"
          },
          {
            text: "Uniapp",
            icon: "/icon-uni-app.svg",
            link: "/uikit/chatuikit/uniapp/chatuikit_overview.html"
          },
          {
            text: "React Native",
            icon: "/icon-ReactNative.svg",
            link: "/uikit/chatuikit/react-native/chatuikit_overview.html"
          },
          {
            text: "Flutter",
            icon: "/icon-flutter.svg",
            link: "/uikit/chatuikit/flutter/chatuikit_overview.html"
          }
        ]
      },
      {
        text: "\u804A\u5929\u5BA4 UIKit",
        children: [
          {
            text: "Android",
            icon: "/icon-Android.svg",
            link: "/uikit/chatroomuikit/android/roomuikit_overview.html"
          },
          {
            text: "iOS",
            icon: "/icon-iOS.svg",
            link: "/uikit/chatroomuikit/ios/roomuikit_overview.html"
          },
          {
            text: "Web",
            icon: "/icon-web.svg",
            link: "/uikit/chatroomuikit/web/roomuikit_overview.html"
          },
          {
            text: "React Native",
            icon: "/icon-ReactNative.svg",
            link: "/uikit/chatroomuikit/react-native/roomuikit_overview.html"
          },
          {
            text: "Flutter",
            icon: "/icon-flutter.svg",
            link: "/uikit/chatroomuikit/flutter/roomuikit_overview.html"
          }
        ]
      }
    ]
  },
  {
    text: "CallKit",
    children: [
      {
        text: "Android",
        icon: "/icon-Android.svg",
        link: "/callkit/android/product_overview.html"
      },
      {
        text: "iOS",
        icon: "/icon-iOS.svg",
        link: "/callkit/ios/product_overview.html"
      },
      {
        text: "Web",
        icon: "/icon-web.svg",
        link: "/callkit/web/product_overview.html"
      }
    ]
  },
  {
    text: "SDK/REST \u96C6\u6210",
    children: [
      {
        text: "\u5E73\u53F0",
        children: [
          {
            text: "Android",
            icon: "/icon-Android.svg",
            link: "/document/android/quickstart.html"
          },
          {
            text: "iOS",
            icon: "/icon-iOS.svg",
            link: "/document/ios/quickstart.html"
          },
          {
            text: "Web",
            icon: "/icon-web.svg",
            link: "/document/web/quickstart.html"
          },
          {
            text: "HarmonyOS",
            icon: "/icon-harmonyos.svg",
            link: "/document/harmonyos/quickstart.html"
          },
          {
            text: "Windows",
            icon: "/icon-windows.svg",
            link: "/document/windows/quickstart.html"
          }
        ]
      },
      {
        text: "\u6846\u67B6",
        children: [
          {
            text: "React Native",
            icon: "/icon-ReactNative.svg",
            link: "/document/react-native/quickstart.html"
          },
          {
            text: "Flutter",
            icon: "/icon-flutter.svg",
            link: "/document/flutter/quickstart.html"
          },
          {
            text: "Unity",
            icon: "/icon-unity.svg",
            link: "/document/unity/quickstart.html"
          },
          {
            text: "\u5C0F\u7A0B\u5E8F",
            icon: "/icon-mini-program.svg",
            link: "/document/applet/overview.html"
          },
          {
            text: "uni-app",
            icon: "/icon-uni-app.svg",
            link: "/document/applet/uniapp.html"
          }
        ]
      },
      {
        text: "\u670D\u52A1\u7AEF",
        children: [
          {
            text: "REST API",
            icon: "/icon-platform.svg",
            link: "/document/server-side/overview.html"
          },
          {
            text: "Java",
            icon: "/icon-platform.svg",
            link: "/document/server-side/java_server_sdk_2.0.html"
          }
        ]
      }
    ]
  },
  {
    text: "API \u53C2\u8003",
    children: [
      {
        text: "\u5E73\u53F0",
        children: [
          {
            text: "Android",
            icon: "/icon-Android.svg",
            link: "https://doc.easemob.com/apidoc/android/chat3.0/annotated.html"
          },
          {
            text: "iOS",
            icon: "/icon-iOS.svg",
            link: "https://doc.easemob.com/apidoc/ios/chat3.0/annotated.html"
          },
          {
            text: "Web/\u5C0F\u7A0B\u5E8F",
            icon: "/icon-web.svg",
            link: "https://doc.easemob.com/jsdoc/index.html"
          },
          {
            text: "HarmonyOS",
            icon: "/icon-harmonyos.svg",
            link: "https://doc.easemob.com/apidoc/harmony/chat3.0/classes/ChatClient.ChatClient.html"
          },
          {
            text: "Windows",
            icon: "/icon-windows.svg",
            link: "https://doc.easemob.com/apidoc/unity/annotated.html"
          }
        ]
      },
      {
        text: "\u6846\u67B6",
        children: [
          {
            text: "React Native",
            icon: "/icon-ReactNative.svg",
            link: "https://doc.easemob.com/apidoc/rn/modules.html"
          },
          {
            text: "Flutter",
            icon: "/icon-flutter.svg",
            link: "https://doc.easemob.com/apidoc/flutter/index.html"
          },
          {
            text: "Unity",
            icon: "/icon-unity.svg",
            link: "https://doc.easemob.com/apidoc/unity/annotated.html"
          }
        ]
      },
      {
        text: "\u670D\u52A1\u7AEF",
        children: [
          {
            text: "Java 1.0",
            icon: "/icon-platform.svg",
            link: "https://easemob.github.io/easemob-im-server-sdk/"
          },
          {
            text: "Java 2.0",
            icon: "/icon-platform.svg",
            link: "https://github.com/easemob/easemob-im-server-sdk/tree/master_java_2.0/src/test/java/com/easemob/im/api"
          }
          // {
          // text: 'PHP',
          // icon: '/icon-platform.svg',
          // link: 'https://easemob.github.io/im-php-server-sdk/annotated.html'
          // }
        ]
      }
    ]
  },
  {
    text: "\u5373\u65F6\u63A8\u9001",
    link: "/push/push_overview.html"
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
  { text: "\u5386\u53F2\u7248\u672C", link: "https://docs-im.easemob.com/ccim/intro" }
  // { text: '有奖调研', link: 'https://doc.easemob.com/form/wjx.html' }
]);

// docs/.vuepress/sidebar/index.ts
import { sidebar } from "vuepress-theme-hope";

// docs/.vuepress/sidebar/document.ts
import path from "node:path";
import fs from "node:fs";
var __vite_injected_original_dirname = "D:/Easemob/Github_Library_Summary/easemob_doc/docs/.vuepress/sidebar";
var getSubDirectories = (dir) => fs.readdirSync(dir).filter((item) => fs.statSync(path.join(dir, item)).isDirectory());
var DOC_PATH = path.resolve(__vite_injected_original_dirname, "../../document");
var platformList = getSubDirectories(DOC_PATH);
var documentSidebar = [
  {
    /*
      text: 分组标题
      children: 分组导航列表
        text: 显示的文本
        link: 链接地址
        show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
        only: 数组形式，只有在数组中的平台下显示
        except: 数组形式，除了数组中指定的平台外都显示
        collapsible: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
        children: 子菜单。请参考「子菜单示例」
    */
    text: "\u5FEB\u901F\u5F00\u59CB",
    children: [
      { text: "React Demo \u4F53\u9A8C", link: "demo_react.html", only: ["web"] },
      { text: "Vue Demo \u4F53\u9A8C", link: "demo_vue.html", only: ["web"] },
      { text: "Demo \u4F53\u9A8C", link: "demo.html", except: ["web", "windows", "unity", "server-side"] },
      { text: "\u5FEB\u901F\u5F00\u59CB", link: "quickstart.html", except: ["windows", "react-native", "flutter", "unity", "server-side"] },
      { text: "\u5FEB\u901F\u5F00\u59CB", link: "quickstart.html", only: ["windows", "react-native", "flutter", "unity"] },
      // { text: '私有云 SDK 集成配置', link: 'privatecloud.html', except: ['windows', 'server-side', 'react-native', 'flutter', 'unity'] },
      { text: "SDK \u66F4\u65B0\u65E5\u5FD7", link: "releasenote.html", except: ["server-side"] },
      /*{ text: 'API reference', link: 'apireference.html', only: ['android', 'ios', 'web', 'windows', 'react-native', 'flutter', 'unity']},*/
      { text: "\u5F00\u901A\u548C\u914D\u7F6E\u670D\u52A1 console", link: "/product/console/app_create.html", only: ["server-side"] },
      { text: "\u4F7F\u7528\u73AF\u4FE1 App Token \u9274\u6743", link: "easemob_app_token.html", only: ["server-side"] },
      { text: "\u4F7F\u7528\u73AF\u4FE1 User Token \u9274\u6743", link: "easemob_user_token.html", only: ["server-side"] },
      { text: "IM \u4EA7\u54C1\u4F7F\u7528\u9650\u5236", link: "limitation.html", only: ["server-side"] },
      { text: "\u63A5\u53E3\u9891\u7387\u9650\u5236", link: "limitationapi.html", only: ["server-side"] }
    ],
    except: ["applet"]
  },
  {
    text: "\u7528\u6237\u6307\u5357",
    children: [
      { text: "\u96C6\u6210 SDK", link: "integration.html" },
      { text: "\u521D\u59CB\u5316", link: "initialization.html" },
      {
        text: "\u767B\u5F55",
        collapsible: true,
        children: [
          { text: "\u767B\u5F55\u4ECB\u7ECD", link: "login.html" },
          { text: "\u8FDE\u63A5", link: "connection.html" },
          { text: "\u591A\u8BBE\u5907\u767B\u5F55", link: "multi_device.html" }
        ]
      },
      {
        text: "\u6D88\u606F\u7BA1\u7406",
        collapsible: true,
        children: [
          { text: "\u6D88\u606F\u6982\u8FF0", link: "message_overview.html" },
          { text: "\u53D1\u9001\u6D88\u606F", link: "message_send.html" },
          { text: "\u63A5\u6536\u6D88\u606F", link: "message_receive.html" },
          { text: "\u83B7\u53D6\u5386\u53F2\u6D88\u606F", link: "message_retrieve.html" },
          { text: "\u64A4\u56DE\u6D88\u606F", link: "message_recall.html" },
          { text: "\u641C\u7D22\u6D88\u606F", link: "message_search.html", except: ["web"] },
          { text: "\u6D88\u606F\u56DE\u6267", link: "message_receipt.html" },
          { text: "\u4FEE\u6539\u6D88\u606F", link: "message_modify.html" },
          { text: "\u6D88\u606F\u8868\u60C5\u56DE\u590D", link: "reaction.html" },
          { text: "\u8F6C\u53D1\u6D88\u606F", link: "message_forward.html", except: ["web"] },
          { text: "\u5BFC\u5165\u548C\u63D2\u5165\u6D88\u606F", link: "message_import_insert.html", except: ["web"] },
          { text: "\u66F4\u65B0\u6D88\u606F", link: "message_update.html", except: ["web"] },
          { text: "\u5220\u9664\u6D88\u606F", link: "message_delete.html" },
          { text: "\u5B9A\u5411\u6D88\u606F", link: "message_target.html" },
          { text: "\u6D88\u606F\u6269\u5C55", link: "message_extension.html" },
          { text: "\u7F6E\u9876\u6D88\u606F", link: "message_pin.html" },
          { text: "\u7FFB\u8BD1\u6D88\u606F", link: "message_translation.html", except: ["harmonyos"] },
          { text: "\u53EA\u6295\u5728\u7EBF\u7528\u6237", link: "message_deliver_only_online.html" },
          { text: "\u6D88\u606F\u5BA1\u6838\uFF08\u4E3E\u62A5\uFF09", link: "moderation.html", except: ["harmonyos"] },
          { text: "\u83B7\u53D6\u6D88\u606F\u6D41\u91CF\u7EDF\u8BA1", link: "message_traffic_statis.html", only: ["android", "ios"] }
        ]
      },
      {
        text: "\u4F1A\u8BDD\u7BA1\u7406",
        collapsible: true,
        children: [
          { text: "\u4F1A\u8BDD\u4ECB\u7ECD", link: "conversation_overview.html" },
          { text: "\u4F1A\u8BDD\u5217\u8868", link: "conversation_list.html" },
          { text: "\u672C\u5730\u4F1A\u8BDD", link: "conversation_local.html", only: ["web"] },
          { text: "\u4F1A\u8BDD\u5DF2\u8BFB\u56DE\u6267", link: "conversation_receipt.html" },
          { text: "\u4F1A\u8BDD\u672A\u8BFB\u6570", link: "conversation_unread.html", except: ["web"] },
          { text: "\u7F6E\u9876\u4F1A\u8BDD", link: "conversation_pin.html" },
          { text: "\u4F1A\u8BDD\u6807\u8BB0", link: "conversation_mark.html" },
          { text: "\u5220\u9664\u4F1A\u8BDD", link: "conversation_delete.html" }
        ]
      },
      {
        text: "\u7FA4\u7EC4\u7BA1\u7406",
        collapsible: true,
        children: [
          { text: "\u7FA4\u7EC4\u6982\u8FF0", link: "group_overview.html" },
          { text: "\u521B\u5EFA\u548C\u7BA1\u7406\u7FA4\u7EC4", link: "group_manage.html" },
          { text: "\u7BA1\u7406\u7FA4\u7EC4\u6210\u5458", link: "group_members.html" },
          { text: "\u7BA1\u7406\u7FA4\u7EC4\u5C5E\u6027", link: "group_attributes.html" },
          { text: "\u7BA1\u7406\u5B50\u533A", link: "thread.html", except: ["harmonyos"] },
          { text: "\u7BA1\u7406\u5B50\u533A\u6D88\u606F", link: "thread_message.html", except: ["harmonyos"] }
        ]
      },
      {
        text: "\u804A\u5929\u5BA4\u7BA1\u7406",
        collapsible: true,
        children: [
          { text: "\u804A\u5929\u5BA4\u6982\u8FF0", link: "room_overview.html" },
          { text: "\u521B\u5EFA\u548C\u7BA1\u7406\u804A\u5929\u5BA4", link: "room_manage.html" },
          { text: "\u7BA1\u7406\u804A\u5929\u5BA4\u6210\u5458", link: "room_members.html" },
          { text: "\u7BA1\u7406\u804A\u5929\u5BA4\u5C5E\u6027", link: "room_attributes.html" }
        ]
      },
      {
        text: "\u7528\u6237\u76F8\u5173",
        collapsible: true,
        children: [
          { text: "\u7528\u6237\u5173\u7CFB", link: "user_relationship.html" },
          { text: "\u7528\u6237\u5C5E\u6027", link: "userprofile.html" },
          { text: "\u5728\u7EBF\u72B6\u6001\u8BA2\u9605", link: "presence.html" }
        ]
      },
      {
        text: "\u79BB\u7EBF\u63A8\u9001",
        collapsible: true,
        children: [
          { text: "\u79BB\u7EBF\u63A8\u9001\u6982\u8FF0", link: "push/push_overview.html", only: ["android", "ios", "web", "harmonyos", "react-native", "flutter"] },
          {
            text: "\u96C6\u6210\u7B2C\u4E09\u65B9\u63A8\u9001",
            collapsible: true,
            children: [
              { text: "FCM \u63A8\u9001", link: "push/push_fcm.html", only: ["android"] },
              { text: "\u534E\u4E3A\u63A8\u9001", link: "push/push_huawei.html", only: ["android"] },
              { text: "\u8363\u8000\u63A8\u9001", link: "push/push_honor.html", only: ["android"] },
              { text: "OPPO \u63A8\u9001", link: "push/push_oppo.html", only: ["android"] },
              { text: "vivo \u63A8\u9001", link: "push/push_vivo.html", only: ["android"] },
              { text: "\u5C0F\u7C73\u63A8\u9001", link: "push/push_xiaomi.html", only: ["android"] },
              { text: "\u9B45\u65CF\u63A8\u9001", link: "push/push_meizu.html", only: ["android"] },
              { text: "APNs \u63A8\u9001", link: "push/push_apns.html", only: ["ios"] },
              { text: "HarmonyOS \u63A8\u9001", link: "push/push_harmony.html", only: ["harmonyos"] }
            ]
          },
          { text: "\u4E0A\u4F20\u63A8\u9001\u8BC1\u4E66", link: "push/push_easemob_console.html", only: ["react-native"] },
          { text: "\u4E0A\u4F20\u63A8\u9001\u8BC1\u4E66\u53CA\u7ED1\u5B9A\u63A8\u9001\u4FE1\u606F", link: "push/push_easemob_console.html", only: ["flutter"] },
          { text: "\u83B7\u53D6\u6216\u66F4\u65B0\u63A8\u9001 token", link: "push/push_get_device_token.html", only: ["react-native"] },
          { text: "\u53D1\u9001\u63A8\u9001 token \u5230\u73AF\u4FE1\u670D\u52A1\u5668", link: "push/push_send_token_to_server.html", only: ["react-native"] },
          { text: "\u89E3\u6790\u63A8\u9001\u6D88\u606F", link: "push/push_parsing.html", only: ["android", "ios"] },
          { text: "\u7EDF\u4E00\u83B7\u53D6\u6D88\u606F\u65B9\u6848", link: "push/push_parsing_unified.html", only: ["android"] },
          { text: "\u8BBE\u7F6E\u901A\u77E5\u7684\u663E\u793A\u5185\u5BB9", link: "push/push_display.html", only: ["android", "ios", "harmonyos", "react-native", "flutter"] },
          { text: "\u8BBE\u7F6E\u901A\u77E5\u65B9\u5F0F\u548C\u514D\u6253\u6270", link: "push/push_notification_mode_dnd.html", only: ["android", "ios", "web", "harmonyos", "react-native", "flutter"] },
          { text: "\u8BBE\u7F6E\u63A8\u9001\u6A21\u677F", link: "push/push_template.html", only: ["web"] },
          { text: "\u8BBE\u7F6E\u63A8\u9001\u7FFB\u8BD1", link: "push/push_translation.html", only: ["android", "ios", "web", "react-native", "flutter"] },
          { text: "\u8BBE\u7F6E\u63A8\u9001\u6269\u5C55\u529F\u80FD", link: "push/push_extension.html", only: ["android", "ios", "web", "react-native", "flutter"] },
          { text: "\u63A8\u9001\u6D88\u606F\u5206\u7C7B", link: "push/push_message_classification.html", only: ["android"] },
          { text: "FAQ", link: "push/push_solution.html", only: ["android", "ios", "harmonyos"] }
        ]
      }
    ],
    except: ["applet", "server-side"]
  },
  {
    text: "\u9519\u8BEF\u6392\u67E5",
    children: [
      { text: "\u9519\u8BEF\u7801", link: "error.html" },
      { text: "\u65E5\u5FD7", link: "log.html", except: ["flutter"] },
      { text: "\u5E38\u89C1\u95EE\u9898", link: "faq.html", only: ["react-native"] }
    ],
    except: ["applet", "server-side"]
  },
  { text: "\u82F9\u679C\u9690\u79C1\u7B56\u7565", link: "privacy_policy.html", only: ["ios"] },
  { text: "\u7CBE\u7B80\u7248 SDK \u4F7F\u7528\u8BF4\u660E", link: "elite_sdk.html", only: ["android", "ios"] },
  {
    text: "\u4EA7\u54C1\u4ECB\u7ECD",
    children: [
      { text: "\u73AF\u4FE1\u5C0F\u7A0B\u5E8F\u5168\u5E73\u53F0\u89E3\u51B3\u65B9\u6848", link: "overview.html" },
      { text: "\u5C0F\u7A0B\u5E8F SDK \u66F4\u65B0\u65E5\u5FD7", link: "releasenote.html" }
    ],
    only: ["applet"]
  },
  {
    text: "\u7528\u6237\u6307\u5357",
    children: [
      {
        text: "\u96C6\u6210\u4ECB\u7ECD",
        collapsible: true,
        children: [
          { text: "\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F", link: "wechat.html" },
          { text: "QQ \u5C0F\u7A0B\u5E8F", link: "qq.html" },
          { text: "\u767E\u5EA6\u5C0F\u7A0B\u5E8F", link: "baidu.html" },
          { text: "\u6296\u97F3\u5C0F\u7A0B\u5E8F", link: "bytedance.html" },
          { text: "\u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F", link: "alipay.html" },
          { text: "Uniapp \u5168\u5E73\u53F0", link: "uniapp.html" }
        ]
      },
      { text: "\u521D\u59CB\u5316", link: "initialization.html" },
      {
        text: "\u767B\u5F55",
        collapsible: true,
        children: [
          { text: "\u767B\u5F55\u4ECB\u7ECD", link: "login.html" },
          { text: "\u8FDE\u63A5", link: "connection.html" },
          { text: "\u591A\u8BBE\u5907\u767B\u5F55", link: "multi_device.html" }
        ]
      },
      {
        text: "\u6D88\u606F\u7BA1\u7406",
        collapsible: true,
        children: [
          { text: "\u6D88\u606F\u6982\u8FF0", link: "message_overview.html" },
          { text: "\u53D1\u9001\u6D88\u606F", link: "message_send.html" },
          { text: "\u63A5\u6536\u6D88\u606F", link: "message_receive.html" },
          { text: "\u83B7\u53D6\u5386\u53F2\u6D88\u606F", link: "message_retrieve.html" },
          { text: "\u64A4\u56DE\u6D88\u606F", link: "message_recall.html" },
          { text: "\u6D88\u606F\u56DE\u6267", link: "message_receipt.html" },
          { text: "\u6D88\u606F\u8868\u60C5\u56DE\u590D", link: "reaction.html" },
          { text: "\u4FEE\u6539\u6D88\u606F", link: "message_modify.html" },
          { text: "\u5220\u9664\u6D88\u606F", link: "message_delete.html" },
          { text: "\u5B9A\u5411\u6D88\u606F", link: "message_target.html" },
          { text: "\u6D88\u606F\u6269\u5C55", link: "message_extension.html" },
          { text: "\u7F6E\u9876\u6D88\u606F", link: "message_pin.html" },
          { text: "\u7FFB\u8BD1\u6D88\u606F", link: "message_translation.html" },
          { text: "\u53EA\u6295\u5728\u7EBF\u7528\u6237", link: "message_deliver_only_online.html" },
          { text: "\u6D88\u606F\u5BA1\u6838\uFF08\u4E3E\u62A5\uFF09", link: "moderation.html" }
        ]
      },
      {
        text: "\u4F1A\u8BDD\u7BA1\u7406",
        collapsible: true,
        children: [
          { text: "\u4F1A\u8BDD\u4ECB\u7ECD", link: "conversation_overview.html" },
          { text: "\u4F1A\u8BDD\u5217\u8868", link: "conversation_list.html" },
          { text: "\u4F1A\u8BDD\u672A\u8BFB\u6570", link: "conversation_unread.html" },
          { text: "\u7F6E\u9876\u4F1A\u8BDD", link: "conversation_pin.html" },
          { text: "\u4F1A\u8BDD\u6807\u8BB0", link: "conversation_mark.html" },
          { text: "\u5220\u9664\u4F1A\u8BDD", link: "conversation_delete.html" }
        ]
      },
      {
        text: "\u7FA4\u7EC4\u7BA1\u7406",
        collapsible: true,
        children: [
          { text: "\u7FA4\u7EC4\u6982\u8FF0", link: "group_overview.html" },
          { text: "\u521B\u5EFA\u548C\u7BA1\u7406\u7FA4\u7EC4", link: "group_manage.html" },
          { text: "\u7BA1\u7406\u7FA4\u7EC4\u6210\u5458", link: "group_members.html" },
          { text: "\u7BA1\u7406\u7FA4\u7EC4\u5C5E\u6027", link: "group_attributes.html" },
          {
            text: "\u5B50\u533A\u7BA1\u7406",
            collapsible: true,
            children: [
              { text: "\u7BA1\u7406\u5B50\u533A", link: "thread.html" },
              { text: "\u7BA1\u7406\u5B50\u533A\u6D88\u606F", link: "thread_message.html" }
            ]
          }
        ]
      },
      {
        text: "\u804A\u5929\u5BA4\u7BA1\u7406",
        collapsible: true,
        children: [
          { text: "\u804A\u5929\u5BA4\u6982\u8FF0", link: "room_overview.html" },
          { text: "\u521B\u5EFA\u548C\u7BA1\u7406\u804A\u5929\u5BA4", link: "room_manage.html" },
          { text: "\u7BA1\u7406\u804A\u5929\u5BA4\u6210\u5458", link: "room_members.html" },
          { text: "\u7BA1\u7406\u804A\u5929\u5BA4\u5C5E\u6027", link: "room_attributes.html" }
        ]
      },
      {
        text: "\u7528\u6237\u76F8\u5173",
        collapsible: true,
        children: [
          { text: "\u7528\u6237\u5173\u7CFB", link: "user_relationship.html" },
          { text: "\u7528\u6237\u5C5E\u6027", link: "userprofile.html" },
          { text: "\u5728\u7EBF\u72B6\u6001\u8BA2\u9605", link: "presence.html" }
        ]
      },
      {
        text: "\u79BB\u7EBF\u63A8\u9001",
        collapsible: true,
        children: [
          { text: "\u79BB\u7EBF\u63A8\u9001\u6982\u8FF0", link: "push/push_overview.html" },
          { text: "\u8BBE\u7F6E\u901A\u77E5\u65B9\u5F0F\u548C\u514D\u6253\u6270", link: "push/push_notification_mode_dnd.html" },
          { text: "\u8BBE\u7F6E\u63A8\u9001\u6A21\u677F", link: "push/push_template.html" },
          { text: "\u8BBE\u7F6E\u63A8\u9001\u7FFB\u8BD1", link: "push/push_translation.html" },
          { text: "\u8BBE\u7F6E\u63A8\u9001\u6269\u5C55\u529F\u80FD", link: "push/push_extension.html" },
          {
            text: "uni-app \u79BB\u7EBF\u63A8\u9001",
            collapsible: true,
            children: [
              { text: "\u4F7F\u7528\u63A8\u9001\u63D2\u4EF6", link: "push/uniapp_push.html" },
              { text: "\u96C6\u6210 FCM", link: "push/uniapp_push_fcm.html" }
            ]
          }
        ]
      }
    ],
    only: ["applet"]
  },
  {
    text: "\u9519\u8BEF\u6392\u67E5",
    children: [
      { text: "\u9519\u8BEF\u7801", link: "error.html" },
      { text: "\u65E5\u5FD7", link: "log.html" }
    ],
    only: ["applet"]
  },
  {
    text: "\u5176\u4ED6\u5E2E\u52A9",
    children: [
      { text: "\u5C0F\u7A0B\u5E8F API \u6587\u6863", link: "apidoc.html" },
      { text: "Uniapp \u751F\u6210\u539F\u751F Android\u3001iOS \u5E94\u7528", link: "uniappnativeapp.html" },
      { text: "\u5C0F\u7A0B\u5E8F\u6A21\u677F\u4F7F\u7528\u6307\u5357", link: "uniappuikit.html" },
      { text: "\u5982\u4F55\u914D\u7F6E\u670D\u52A1\u5668\u57DF\u540D", link: "serverconfig.html" },
      { text: "Vue3 \u9879\u76EE\u5728 H5 \u5E73\u53F0\u53D1\u5E03\u7684\u6CE8\u610F\u4E8B\u9879", link: "vue3_project_h5.html" }
    ],
    only: ["applet"]
  },
  {
    text: "\u670D\u52A1\u7AEF RESTful API",
    children: [
      { text: "\u5373\u65F6\u901A\u8BAF RESTful API \u6982\u89C8", link: "overview.html" },
      {
        text: "\u6D88\u606F\u7BA1\u7406",
        collapsible: true,
        children: [
          { text: "\u53D1\u9001\u5355\u804A\u6D88\u606F", link: "message_single.html" },
          { text: "\u53D1\u9001\u7FA4\u804A\u6D88\u606F", link: "message_group.html" },
          { text: "\u53D1\u9001\u804A\u5929\u5BA4\u6D88\u606F", link: "message_chatroom.html" },
          { text: "\u53D1\u9001\u5168\u5C40\u5E7F\u64AD\u6D88\u606F", link: "message_broadcast.html" },
          { text: "\u4E0A\u4F20\u548C\u4E0B\u8F7D\u6587\u4EF6", link: "message_download.html" },
          { text: "\u83B7\u53D6\u5386\u53F2\u6D88\u606F\u8BB0\u5F55", link: "message_historical.html" },
          { text: "\u8BBE\u7F6E\u6307\u5B9A\u6D88\u606F\u9644\u4EF6\u7684\u5B58\u50A8\u65B9\u5F0F", link: "message_attachment_storage.html" },
          { text: "\u6D88\u606F\u8868\u60C5\u56DE\u590D", link: "reaction.html" },
          { text: "\u64A4\u56DE\u6D88\u606F", link: "message_recall.html" },
          { text: "\u5355\u5411\u5220\u9664\u4F1A\u8BDD", link: "conversation_delete.html" },
          { text: "\u5355\u5411\u5220\u9664\u6F2B\u6E38\u6D88\u606F", link: "message_delete.html" },
          { text: "\u4FEE\u6539\u6D88\u606F", link: "message_modify.html" },
          {
            text: "\u6D88\u606F\u7FFB\u8BD1",
            collapsible: true,
            children: [
              { text: "\u7FFB\u8BD1\u6D88\u606F\u5185\u5BB9", link: "message_translation_text.html" },
              { text: "\u83B7\u53D6\u7FFB\u8BD1\u8BED\u8A00\u5217\u8868", link: "message_translation_language_list.html" },
              { text: "\u68C0\u6D4B\u6587\u672C\u7684\u6E90\u8BED\u8A00", link: "message_translation_detect.html" }
            ]
          },
          { text: "\u83B7\u53D6\u79BB\u7EBF\u6D88\u606F\u6570\u636E", link: "message_offline.html" },
          { text: "\u5BFC\u5165\u6D88\u606F", link: "message_import.html" }
        ]
      },
      {
        text: "\u7FA4\u7EC4",
        collapsible: true,
        children: [
          { text: "\u7BA1\u7406\u7FA4\u7EC4", link: "group_manage.html" },
          { text: "\u7BA1\u7406\u7FA4\u7EC4\u6587\u4EF6", link: "group_file.html" },
          {
            text: "\u7BA1\u7406\u7FA4\u7EC4\u6210\u5458",
            collapsible: true,
            children: [
              { text: "\u83B7\u53D6\u6210\u5458\u5217\u8868", link: "group_member_obtain.html" },
              { text: "\u6DFB\u52A0/\u79FB\u9664\u6210\u5458", link: "group_member_add_delete.html" },
              { text: "\u7BA1\u7406\u7FA4\u6210\u5458\u81EA\u5B9A\u4E49\u5C5E\u6027", link: "group_member_attribute.html" },
              { text: "\u7BA1\u7406\u7FA4\u4E3B/\u7BA1\u7406\u5458", link: "group_member_admin.html" },
              { text: "\u7BA1\u7406\u7981\u8A00", link: "group_member_mutelist.html" },
              { text: "\u7BA1\u7406\u767D\u540D\u5355", link: "group_member_allowlist.html" },
              { text: "\u7BA1\u7406\u9ED1\u540D\u5355", link: "group_member_blocklist.html" }
            ]
          },
          { text: "\u7BA1\u7406\u5B50\u533A", link: "group_thread.html" }
        ]
      },
      {
        text: "\u804A\u5929\u5BA4",
        collapsible: true,
        children: [
          { text: "\u7BA1\u7406\u8D85\u7EA7\u7BA1\u7406\u5458", link: "chatroom_superadmin.html" },
          { text: "\u7BA1\u7406\u804A\u5929\u5BA4", link: "chatroom_manage.html" },
          { text: "\u7BA1\u7406\u804A\u5929\u5BA4\u5C5E\u6027", link: "chatroom_attribute.html" },
          {
            text: "\u7BA1\u7406\u804A\u5929\u5BA4\u6210\u5458",
            collapsible: true,
            children: [
              { text: "\u83B7\u53D6\u6210\u5458\u5217\u8868", link: "chatroom_member_obtain.html" },
              { text: "\u6DFB\u52A0/\u79FB\u9664\u6210\u5458", link: "chatroom_member_add_delete.html" },
              { text: "\u7BA1\u7406\u804A\u5929\u5BA4\u6240\u6709\u8005/\u7BA1\u7406\u5458", link: "chatroom_member_admin.html" },
              {
                text: "\u7BA1\u7406\u7981\u8A00",
                collapsible: true,
                children: [
                  { text: "\u591A\u4E2A\u6216\u5168\u4F53\u6210\u5458\u7981\u8A00", link: "chatroom_member_mutelist.html" },
                  { text: "\u6807\u7B7E\u7981\u8A00", link: "chatroom_label_mute.html" }
                ]
              },
              { text: "\u7BA1\u7406\u767D\u540D\u5355", link: "chatroom_member_allowlist.html" },
              { text: "\u7BA1\u7406\u9ED1\u540D\u5355", link: "chatroom_member_blocklist.html" }
            ]
          }
        ]
      },
      {
        text: "\u7528\u6237\u76F8\u5173",
        collapsible: true,
        children: [
          { text: "\u7528\u6237\u4F53\u7CFB\u7BA1\u7406", link: "account_system.html" },
          { text: "\u7528\u6237\u5C5E\u6027", link: "userprofile.html" },
          { text: "\u7528\u6237\u72B6\u6001\u8BA2\u9605", link: "presence.html" },
          {
            text: "\u7528\u6237\u5173\u7CFB",
            collapsible: true,
            children: [
              { text: "\u6DFB\u52A0\u597D\u53CB", link: "user_relationship_friend_add.html" },
              { text: "\u6821\u9A8C\u597D\u53CB", link: "user_relationship_friend_check.html" },
              { text: "\u5220\u9664\u5355\u4E2A\u597D\u53CB", link: "user_relationship_friend_remove.html" },
              { text: "\u5220\u9664\u6240\u6709\u597D\u53CB", link: "user_relationship_friend_remove_all.html" },
              { text: "\u8BBE\u7F6E\u597D\u53CB\u5907\u6CE8", link: "user_relationship_remark_set.html" },
              { text: "\u5206\u9875\u83B7\u53D6\u597D\u53CB\u5217\u8868", link: "user_relationship_friend_list_paged.html" },
              { text: "\u4E00\u6B21\u6027\u83B7\u53D6\u597D\u53CB\u5217\u8868", link: "user_relationship_friend_list_obtain.html" },
              { text: "\u5BFC\u5165\u597D\u53CB\u5217\u8868", link: "user_relationship_friend_import.html" },
              { text: "\u6DFB\u52A0\u7528\u6237\u81F3\u9ED1\u540D\u5355", link: "user_relationship_blocklist_add.html" },
              { text: "\u4ECE\u9ED1\u540D\u5355\u4E2D\u79FB\u9664\u7528\u6237", link: "user_relationship_blocklist_remove.html" },
              { text: "\u83B7\u53D6\u9ED1\u540D\u5355\u5217\u8868", link: "user_relationship_blocklist_obtain.html" },
              { text: "\u6821\u9A8C\u9ED1\u540D\u5355", link: "user_relationship_blocklist_check.html" }
            ]
          },
          { text: "\u7528\u6237\u5168\u5C40\u7981\u8A00", link: "user_global_mute.html" },
          { text: "\u7528\u6237\u6536\u85CF", link: "user_favorite.html" }
        ]
      },
      {
        text: "\u79BB\u7EBF\u63A8\u9001",
        collapsible: true,
        children: [
          { text: "\u79BB\u7EBF\u63A8\u9001\u8BBE\u7F6E", link: "push.html" },
          { text: "\u79BB\u7EBF\u63A8\u9001\u7684\u6D88\u606F\u6269\u5C55", link: "push_extension.html" },
          { text: "\u67E5\u8BE2\u79BB\u7EBF\u63A8\u9001\u7ED3\u679C", link: "push_result_statistics.html" }
        ]
      },
      {
        text: "\u5173\u952E\u8BCD\u540D\u5355",
        collapsible: true,
        children: [
          { text: "\u521B\u5EFA\u5173\u952E\u8BCD\u540D\u5355", link: "keyword_list_create.html" },
          { text: "\u4FEE\u6539\u5173\u952E\u8BCD\u540D\u5355", link: "keyword_list_modify.html" },
          { text: "\u67E5\u8BE2\u5173\u952E\u8BCD\u540D\u5355", link: "keyword_list_query.html" },
          { text: "\u5220\u9664\u5173\u952E\u8BCD\u540D\u5355", link: "keyword_list_delete.html" },
          { text: "\u6DFB\u52A0\u5173\u952E\u8BCD", link: "keyword_add.html" },
          { text: "\u4FEE\u6539\u5173\u952E\u8BCD", link: "keyword_modify.html" },
          { text: "\u67E5\u8BE2\u5173\u952E\u8BCD", link: "keyword_query.html" },
          { text: "\u5220\u9664\u5355\u4E2A\u5173\u952E\u8BCD", link: "keyword_delete.html" },
          { text: "\u6279\u91CF\u5220\u9664\u5173\u952E\u8BCD", link: "keyword_delete_batch.html" }
        ]
      }
    ],
    only: ["server-side"]
  },
  {
    text: "Server SDK",
    collapsible: true,
    children: [
      { text: "Java Server SDK 2.0", link: "java_server_sdk_2.0.html" },
      { text: "Java Server SDK 1.0", link: "java_server_sdk.html" }
      // { text: 'PHP Server SDK', link: 'php_server_sdk.html' }
    ],
    only: ["server-side"]
  },
  { text: "\u9519\u8BEF\u7801", link: "error.html", only: ["server-side"] },
  {
    text: "\u8BBE\u7F6E\u56DE\u8C03",
    collapsible: true,
    children: [
      { text: "\u56DE\u8C03\u6982\u8FF0", link: "callback_overview.html" },
      { text: "\u53D1\u9001\u524D\u56DE\u8C03", link: "callback_presending.html" },
      { text: "\u53D1\u9001\u540E\u56DE\u8C03", link: "callback_postsending.html" },
      {
        text: "\u53D1\u9001\u540E\u56DE\u8C03\u4E8B\u4EF6",
        collapsible: true,
        children: [
          { text: "\u7528\u6237\u767B\u5165/\u767B\u51FA", link: "callback_login_logout.html" },
          { text: "\u53D1\u9001\u6D88\u606F", link: "callback_message_send.html" },
          { text: "\u53D1\u9001\u5355\u804A\u6D88\u606F\u5DF2\u8BFB\u56DE\u6267", link: "callback_single_read_ack.html" },
          { text: "\u53D1\u9001\u7FA4\u804A\u6D88\u606F\u5DF2\u8BFB\u56DE\u6267", link: "callback_group_read_ack.html" },
          { text: "\u53D1\u9001\u4F1A\u8BDD\u5DF2\u8BFB\u56DE\u6267", link: "callback_single_conversation_ack.html" },
          { text: "\u4FEE\u6539\u6D88\u606F", link: "callback_message_modify.html" },
          { text: "\u64A4\u56DE\u6D88\u606F", link: "callback_message_recall.html" },
          {
            text: "\u7FA4\u7EC4/\u804A\u5929\u5BA4\u64CD\u4F5C\uFF08\u65B0\uFF09",
            collapsible: true,
            children: [
              { text: "\u521B\u5EFA\u7FA4\u7EC4/\u804A\u5929\u5BA4", link: "callback_group_room_create.html" },
              {
                text: "\u66F4\u65B0\u7FA4\u7EC4/\u804A\u5929\u5BA4",
                collapsible: true,
                children: [
                  { text: "\u66F4\u65B0\u7FA4\u7EC4_\u804A\u5929\u5BA4\u4FE1\u606F", link: "callback_group_room_info.html" },
                  { text: "\u53D8\u66F4\u7FA4\u4E3B/\u804A\u5929\u5BA4\u6240\u6709\u8005", link: "callback_group_room_owner.html" },
                  { text: "\u8BBE\u7F6E/\u66F4\u65B0\u516C\u544A", link: "callback_group_room_announcement.html" },
                  { text: "\u5C01\u7981/\u89E3\u7981\u7FA4\u7EC4", link: "callback_group_ban.html" },
                  { text: "\u5168\u5458\u7981\u8A00", link: "callback_group_room_muteall.html" }
                ]
              },
              { text: "\u5220\u9664\u7FA4\u7EC4/\u804A\u5929\u5BA4", link: "callback_group_room_delete.html" },
              { text: "\u5C4F\u853D/\u89E3\u9664\u5C4F\u853D\u7FA4\u7EC4", link: "callback_group_block.html" },
              { text: "\u4E0A\u4F20/\u5220\u9664\u7FA4\u5171\u4EAB\u6587\u4EF6", link: "callback_group_shared_file.html" },
              { text: "\u7528\u6237\u52A0\u5165", link: "callback_group_room_join.html" },
              { text: "\u6210\u5458\u79BB\u5F00", link: "callback_group_room_leave.html" },
              { text: "\u6DFB\u52A0/\u79FB\u9664\u7BA1\u7406\u5458", link: "callback_group_room_admin.html" },
              { text: "\u52A0\u5165/\u79FB\u51FA\u7981\u8A00\u5217\u8868", link: "callback_group_room_mute.html" },
              { text: "\u6DFB\u52A0/\u79FB\u51FA\u767D\u540D\u5355", link: "callback_group_room_allowlist.html" },
              { text: "\u52A0\u5165/\u79FB\u51FA\u9ED1\u540D\u5355", link: "callback_group_room_blocklist.html" },
              { text: "\u6DFB\u52A0/\u79FB\u9664\u804A\u5929\u5BA4\u8D85\u7EA7\u7BA1\u7406\u5458", link: "callback_room_superadmin.html" }
            ]
          },
          { text: "\u7FA4\u7EC4/\u804A\u5929\u5BA4\u64CD\u4F5C\uFF08\u65E7\uFF09", link: "callback_group_room_old.html" },
          { text: "\u7528\u6237\u5173\u7CFB\u64CD\u4F5C", link: "callback_contact.html" },
          { text: "\u79BB\u7EBF\u63A8\u9001", link: "callback_offline_push.html" },
          { text: "Reaction", link: "callback_reaction.html" },
          { text: "Thread", link: "callback_thread.html" },
          { text: "\u654F\u611F\u8BCD\u76D1\u6D4B", link: "callback_sensitive_word.html" }
        ]
      }
    ],
    only: ["server-side"]
  },
  {
    text: "\u5DF2\u5E9F\u5F03\u5185\u5BB9",
    children: [
      { text: "\u901A\u8FC7\u7528\u6237 ID \u548C\u5BC6\u7801\u83B7\u53D6\u7528\u6237 token", link: "easemob_user_token_password.html" }
    ],
    only: ["server-side"]
  }
];
function buildDocSidebar() {
  const result = {};
  platformList.forEach((platform) => {
    const key = `/document/${platform}/`;
    result[key] = documentSidebar.map((sidebar2) => handleSidebarItem(platform, sidebar2)).filter((s) => s);
  });
  return result;
}
function linkExists(platform, link) {
  try {
    const filePath = `${DOC_PATH}/${platform}/${link.replace(/.html$/, ".md")}`;
    return fs.existsSync(filePath);
  } catch (e) {
    console.error(`Error checking file existence: ${e}`);
    return false;
  }
}
function handleSidebarItem(platform, sidebar2) {
  const hasChildren = sidebar2.hasOwnProperty("children") && sidebar2.children.length > 0;
  const hasOnly = sidebar2.hasOwnProperty("only") && sidebar2.only.length > 0;
  const hasExcept = sidebar2.hasOwnProperty("except") && sidebar2.except.length > 0;
  let needThisPlatform = true;
  if (hasOnly) {
    needThisPlatform = sidebar2.only.indexOf(platform) > -1;
  }
  if (hasExcept) {
    needThisPlatform = sidebar2.except.indexOf(platform) == -1;
  }
  if (!needThisPlatform) {
    return null;
  }
  if (hasChildren) {
    let newchildren = sidebar2.children.map((s) => handleSidebarItem(platform, s)).filter((s) => s);
    if (newchildren.length > 0) {
      return { ...sidebar2, children: newchildren };
    }
  } else {
    if (linkExists(platform, sidebar2.link)) {
      const newLink = `/document/${platform}/${sidebar2.link}`;
      return { ...sidebar2, link: newLink };
    }
  }
}
var DOC_SIDEBAR = buildDocSidebar();

// docs/.vuepress/sidebar/uikit.ts
import path2 from "node:path";
import fs2 from "node:fs";
var __vite_injected_original_dirname2 = "D:/Easemob/Github_Library_Summary/easemob_doc/docs/.vuepress/sidebar";
var getSubDirectories2 = (dir) => fs2.readdirSync(dir).filter((item) => fs2.statSync(path2.join(dir, item)).isDirectory());
var CHAT_DOC_PATH = path2.resolve(__vite_injected_original_dirname2, "../../uikit/chatuikit");
var CHATROOM_DOC_PATH = path2.resolve(__vite_injected_original_dirname2, "../../uikit/chatroomuikit");
var chatPlatformList = getSubDirectories2(CHAT_DOC_PATH);
var chatroomPlatformList = getSubDirectories2(CHATROOM_DOC_PATH);
var chatUikitSidebar = [
  {
    /*
      text: 分组标题
      children: 分组导航列表
        text: 显示的文本
        link: 链接地址
        show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
        only: 数组形式，只有在数组中的平台下显示
        except: 数组形式，除了数组中指定的平台外都显示
        collapsible: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
        children: 子菜单。请参考「子菜单示例」
    */
    text: "\u4EA7\u54C1\u4ECB\u7ECD",
    collapsible: true,
    children: [
      { text: "\u6982\u8FF0", link: "chatuikit_overview.html" },
      {
        text: "\u7279\u6027",
        collapsible: true,
        children: [
          { text: "\u901A\u7528", link: "chatfeature_common.html" },
          { text: "\u4F1A\u8BDD", link: "chatfeature_conversation.html" },
          { text: "\u6D88\u606F", link: "chatfeature_message.html" }
        ]
      }
    ],
    only: ["ios"]
  },
  {
    text: "\u5FEB\u901F\u5F00\u59CB",
    collapsible: true,
    children: [
      { text: "\u8DD1\u901A\u793A\u4F8B\u9879\u76EE", link: "chatuikit_run.html" },
      { text: "\u96C6\u6210\u5355\u7FA4\u804A UIKit", link: "chatuikit_integrated.html" },
      { text: "\u5FEB\u901F\u5F00\u59CB", link: "chatuikit_quickstart.html" }
    ],
    only: ["ios"]
  },
  {
    text: "\u96C6\u6210\u6587\u6863",
    collapsible: true,
    children: [
      { text: "\u4E3B\u9898", link: "chatuikit_theme.html" },
      { text: "\u4F1A\u8BDD\u5217\u8868", link: "chatuikit_custom_conversation_list.html" },
      {
        text: "\u6D88\u606F",
        collapsible: true,
        children: [
          { text: "\u81EA\u5B9A\u4E49\u804A\u5929\u9875\u9762", link: "chatuikit_custom_chat.html" },
          {
            text: "\u5B9E\u73B0\u65B0\u7C7B\u578B\u81EA\u5B9A\u4E49\u6D88\u606F Cell",
            link: "chatuikit_custom_cell.html"
          }
        ]
      },
      { text: "\u901A\u8BAF\u5F55", link: "chatuikit_custom_contact_list.html" },
      { text: "\u8054\u7CFB\u4EBA\u8BE6\u60C5", link: "chatuikit_custom_contact_details.html" },
      { text: "\u7FA4\u8BE6\u60C5", link: "chatuikit_custom_group_details.html" },
      { text: "\u901A\u7528\u53EF\u914D\u9879", link: "chatuikit_config_item.html" },
      { text: "\u8FDB\u9636\u7528\u6CD5", link: "chatuikit_advancedusage.html" },
      { text: "\u56FD\u9645\u5316", link: "chatuikit_internationalization.html" },
      { text: "\u9875\u9762 ViewModel \u4E2D\u53EF\u91CD\u8F7D\u65B9\u6CD5", link: "chatuikit_listener.html" },
      {
        text: "\u62E6\u622A\u4E3B\u8981\u9875\u9762\u70B9\u51FB\u8DF3\u8F6C\u4E8B\u4EF6",
        link: "chatuikit_customize_clickjump.html"
      }
    ],
    only: ["ios"]
  },
  { text: "\u8BBE\u8BA1\u6307\u5357", link: "chatuikit_design_guide.html", only: ["ios"] },
  {
    text: "\u4EA7\u54C1\u4ECB\u7ECD",
    collapsible: true,
    children: [
      { text: "\u6982\u8FF0", link: "chatuikit_overview.html" },
      {
        text: "\u7279\u6027",
        collapsible: true,
        children: [
          { text: "\u901A\u7528", link: "chatfeature_common.html" },
          { text: "\u4F1A\u8BDD", link: "chatfeature_conversation.html" },
          { text: "\u6D88\u606F", link: "chatfeature_message.html" }
        ]
      }
    ],
    only: ["web"]
  },
  { text: "\u5FEB\u901F\u5F00\u59CB", link: "chatuikit_quickstart.html", only: ["web"] },
  {
    text: "\u96C6\u6210\u6587\u6863",
    collapsible: true,
    children: [
      {
        text: "React \u96C6\u6210\u5355\u7FA4\u804A UIKit",
        link: "chatuikit_integrated_react.html"
      },
      { text: "Vue \u96C6\u6210\u5355\u7FA4\u804A UIKit", link: "chatuikit_integrated_vue.html" },
      { text: "\u7528\u6237\u4FE1\u606F\u63D0\u4F9B", link: "chatuikit_provider.html" },
      { text: "\u5168\u5C40\u4E0A\u4E0B\u6587", link: "chatuikit_context.html" },
      { text: "\u767B\u5F55", link: "chatuikit_login.html" },
      { text: "\u4E8B\u4EF6\u76D1\u542C\u5668", link: "chatuikit_listener.html" },
      { text: "\u4E3B\u9898", link: "chatuikit_theme.html" },
      { text: "\u4F1A\u8BDD\u5217\u8868", link: "chatuikit_conversation.html" },
      { text: "\u6D88\u606F", link: "chatuikit_chat.html" },
      { text: "\u901A\u8BAF\u5F55", link: "chatuikit_contactlist.html" },
      { text: "\u97F3\u89C6\u9891\u901A\u8BDD", link: "chatuikit_video.html" },
      { text: "\u56FD\u9645\u5316", link: "chatuikit_internationalization.html" }
    ],
    only: ["web"]
  },
  { text: "\u7EC4\u4EF6\u6587\u6863", link: "chatuikit_storybook.html", only: ["web"] },
  { text: "\u8BBE\u8BA1\u6307\u5357", link: "chatuikit_design_guide.html", only: ["web"] },
  {
    text: "\u4EA7\u54C1\u4ECB\u7ECD",
    collapsible: true,
    children: [
      { text: "\u6982\u8FF0", link: "chatuikit_overview.html" },
      {
        text: "\u7279\u6027",
        collapsible: true,
        children: [
          { text: "\u901A\u7528", link: "chatfeature_common.html" },
          { text: "\u4F1A\u8BDD", link: "chatfeature_conversation.html" },
          { text: "\u6D88\u606F", link: "chatfeature_message.html" }
        ]
      }
    ],
    only: ["android", "harmonyos", "react-native", "flutter"]
  },
  {
    text: "\u5FEB\u901F\u5F00\u59CB",
    collapsible: true,
    children: [
      { text: "\u8DD1\u901A\u793A\u4F8B\u9879\u76EE", link: "chatuikit_run.html", except: ["android", "harmonyos"] },
      { text: "\u5FEB\u901F\u5F00\u59CB", link: "chatuikit_quickstart.html" }
    ],
    only: ["android", "harmonyos", "react-native", "flutter"]
  },
  {
    text: "\u96C6\u6210\u6587\u6863",
    collapsible: true,
    children: [
      { text: "\u96C6\u6210\u5355\u7FA4\u804A UIKit", link: "chatuikit_integrated.html" },
      { text: "\u4E3B\u9898", link: "chatuikit_theme.html" },
      { text: "\u4F1A\u8BDD\u5217\u8868", link: "chatuikit_conversation.html" },
      { text: "\u6D88\u606F", link: "chatuikit_chat.html" },
      { text: "\u901A\u8BAF\u5F55", link: "chatuikit_contactlist.html" },
      { text: "\u8054\u7CFB\u4EBA\u8BE6\u60C5", link: "chatuikit_custom_contact_details.html", except: ["harmonyos"] },
      { text: "\u7FA4\u8BE6\u60C5", link: "chatuikit_custom_group_details.html", except: ["harmonyos"] },
      { text: "\u7528\u6237\u4FE1\u606F\u63D0\u4F9B", link: "chatuikit_userinfo.html" },
      { text: "\u56FD\u9645\u5316", link: "chatuikit_internationalization.html", except: ["harmonyos"] },
      { text: "\u8FDB\u9636\u7528\u6CD5", link: "chatuikit_advancedusage.html", except: ["harmonyos"] }
    ],
    only: ["android", "harmonyos", "react-native", "flutter"]
  },
  { text: "\u8BBE\u8BA1\u6307\u5357", link: "chatuikit_design_guide.html", only: ["android", "harmonyos", "react-native", "flutter"] },
  { text: "\u66F4\u65B0\u65E5\u5FD7", link: "releasenote.html", except: ["uniapp"] },
  { text: "\u5E38\u89C1\u95EE\u9898", link: "faq.html", only: ["react-native"] },
  {
    text: "\u5386\u53F2\u6587\u6863",
    collapsible: true,
    children: [
      { text: "\u5386\u53F2\u6587\u6863", link: "ui_historic.html", only: ["android", "ios"] },
      {
        text: "UIKit \u4ECB\u7ECD",
        link: "ui_overview.html",
        except: ["android", "ios"]
      },
      {
        text: "\u5FEB\u901F\u5F00\u59CB",
        link: "ui_quickstart.html",
        except: ["android", "ios"]
      },
      {
        text: "\u96C6\u6210\u804A\u5929\u9875\u9762",
        link: "ui_chat.html",
        except: ["android", "ios"]
      },
      {
        text: "\u96C6\u6210\u4F1A\u8BDD\u5217\u8868\u9875\u9762",
        link: "ui_conversation.html",
        except: ["android", "ios"]
      }
    ],
    only: ["android", "react-native", "flutter", "ios"]
  },
  {
    text: "\u4EA7\u54C1\u4ECB\u7ECD",
    collapsible: true,
    children: [
      { text: "\u6982\u8FF0", link: "chatuikit_overview.html" },
      {
        text: "\u7279\u6027",
        collapsible: true,
        children: [
          { text: "\u901A\u7528", link: "chatfeature_common.html" },
          { text: "\u4F1A\u8BDD", link: "chatfeature_conversation.html" },
          { text: "\u6D88\u606F", link: "chatfeature_message.html" }
        ]
      }
    ],
    only: ["uniapp"]
  },
  { text: "\u5FEB\u901F\u5F00\u59CB", link: "chatuikit_quickstart.html", only: ["uniapp"] },
  { text: "\u96C6\u6210\u5355\u7FA4\u804A UIKit", link: "chatuikit_integrated.html", only: ["uniapp"] },
  { text: "\u8BBE\u8BA1\u6307\u5357", link: "chatuikit_design_guide.html", only: ["uniapp"] },
  { text: "\u66F4\u65B0\u65E5\u5FD7", link: "releasenote.html", only: ["uniapp"] }
];
var chatroomUikitSidebar = [
  { text: "\u6982\u8FF0", link: "roomuikit_overview.html" },
  {
    text: "\u7279\u6027",
    collapsible: true,
    children: [
      { text: "\u901A\u7528", link: "roomfeature_common.html" },
      { text: "\u6D88\u606F\u6269\u5C55", link: "roomfeature_message.html" },
      { text: "\u6210\u5458\u7BA1\u7406", link: "roomfeature_member.html" }
    ]
  },
  { text: "\u8DD1\u901A\u793A\u4F8B\u9879\u76EE", link: "roomuikit_run.html" },
  { text: "\u96C6\u6210 ChatroomUIKit", link: "roomuikit_integrated.html" },
  { text: "\u5FEB\u901F\u5F00\u59CB", link: "roomuikit_quickstart.html" },
  { text: "\u6700\u4F73\u5B9E\u8DF5", link: "roomuikit_best_practice.html" },
  { text: "\u53EF\u914D\u7F6E\u9879", link: "roomuikit_config_item.html" },
  { text: "\u4E3B\u9898", link: "roomuikit_theme.html" },
  { text: "\u81EA\u5B9A\u4E49", link: "roomuikit_customize.html" },
  { text: "\u7EC4\u4EF6\u6587\u6863", link: "roomuikit_storybook.html", only: ["web"] },
  { text: "\u66F4\u65B0\u65E5\u5FD7", link: "roomuikit_releasenote.html" },
  { text: "\u5E38\u89C1\u95EE\u9898", link: "faq.html", only: ["react-native"] },
  { text: "\u8BBE\u8BA1\u6307\u5357", link: "design_guide.html" }
];
function buildChatUikitSidebar() {
  const result = {};
  chatPlatformList.forEach((platform) => {
    const key = `/uikit/chatuikit/${platform}/`;
    result[key] = chatUikitSidebar.map(
      (sidebar2) => handleSidebarItem2(platform, sidebar2, CHAT_DOC_PATH, "chatuikit")
    ).filter((s) => s);
  });
  return result;
}
function buildChatroomUikitSidebar() {
  const result = {};
  chatroomPlatformList.forEach((platform) => {
    const key = `/uikit/chatroomuikit/${platform}/`;
    result[key] = chatroomUikitSidebar.map(
      (sidebar2) => handleSidebarItem2(platform, sidebar2, CHATROOM_DOC_PATH, "chatroomuikit")
    ).filter((s) => s);
  });
  return result;
}
function linkExists2(platform, link, docPath) {
  try {
    const filePath = `${docPath}/${platform}/${link.replace(/.html$/, ".md")}`;
    return fs2.existsSync(filePath);
  } catch (e) {
    console.error(`Error checking file existence: ${e}`);
    return false;
  }
}
function handleSidebarItem2(platform, sidebar2, docPath, kitType) {
  const hasChildren = sidebar2.hasOwnProperty("children") && sidebar2.children.length > 0;
  const hasOnly = sidebar2.hasOwnProperty("only") && sidebar2.only.length > 0;
  const hasExcept = sidebar2.hasOwnProperty("except") && sidebar2.except.length > 0;
  let needThisPlatform = true;
  if (hasOnly) {
    needThisPlatform = sidebar2.only.indexOf(platform) > -1;
  }
  if (hasExcept) {
    needThisPlatform = sidebar2.except.indexOf(platform) == -1;
  }
  if (!needThisPlatform) {
    return null;
  }
  if (hasChildren) {
    let newchildren = sidebar2.children.map((s) => handleSidebarItem2(platform, s, docPath, kitType)).filter((s) => s);
    if (newchildren.length > 0) {
      return { ...sidebar2, children: newchildren };
    }
  } else {
    if (linkExists2(platform, sidebar2.link, docPath)) {
      const newLink = `/uikit/${kitType}/${platform}/${sidebar2.link}`;
      return { ...sidebar2, link: newLink };
    }
  }
}
var CHAT_UIKIT_SIDEBAR = buildChatUikitSidebar();
var CHATROOM_UIKIT_SIDEBAR = buildChatroomUikitSidebar();

// docs/.vuepress/sidebar/private.ts
var PRIVATE_IM_SIDEBAR = [
  {
    text: "\u5B89\u88C5\u90E8\u7F72",
    children: [
      { text: "\u79C1\u6709\u5316\u670D\u52A1\u90E8\u7F72", link: "uc_deploy.html" }
    ]
  },
  {
    text: "\u79C1\u6709\u5316\u96C6\u6210",
    children: [
      { text: "Console\u914D\u7F6E\u8BF4\u660E", link: "uc_configure.html" },
      { text: "SDK \u53CA Demo \u4E0B\u8F7D", link: "uc_private.html" },
      { text: "Android\u79C1\u6709\u5316\u914D\u7F6E", link: "uc_android_private.html" },
      { text: "iOS\u79C1\u6709\u5316\u914D\u7F6E", link: "uc_iOS_private.html" },
      { text: "Web\u79C1\u6709\u5316\u914D\u7F6E", link: "uc_Web_private.html" }
    ]
  },
  {
    text: "\u89E3\u51B3\u65B9\u6848",
    children: [
      { text: "\u4F01\u4E1A\u534F\u540C\u529E\u516C\uFF08\u73AF\u4FE1\u901A\uFF09", link: "uc_overview.html" },
      { text: "\u8F7B\u5BA2\u670D\u8FDC\u7A0B\u534F\u52A9\uFF08\u4E2A\u6027\u5316\u534F\u540C\uFF09", link: "uc_lowcode.html" }
    ]
  }
];
var PRIVATE_MEDIA_SIDEBAR = [
  {
    text: "\u5FEB\u901F\u5F00\u59CB",
    children: [
      { text: "\u97F3\u89C6\u9891\u6982\u89C8", link: "common_introduction.html" },
      { text: "\u5BA2\u6237\u7AEF\u4E0B\u8F7D", link: "common_clientsdk.html" },
      { text: "\u5E38\u89C1\u95EE\u9898", link: "common_faq.html" }
    ]
  },
  {
    text: "1\u5BF91\u901A\u8BDD",
    children: [
      { text: "\u529F\u80FD\u7B80\u4ECB", link: "one2one_introduction.html" },
      { text: "Android\u96C6\u6210", link: "one2one_android.html" },
      { text: "iOS\u96C6\u6210", link: "one2one_ios.html" },
      { text: "Web\u96C6\u6210", link: "one2one_web.html" },
      { text: "\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u96C6\u6210", link: "one2one_vxmini.html" },
      { text: "PC\u96C6\u6210", link: "one2one_pcdesktop.html" }
    ]
  },
  {
    text: "\u591A\u4EBA\u901A\u8BDD",
    children: [
      { text: "\u529F\u80FD\u7B80\u4ECB", link: "conference_introduction.html" },
      { text: "Android\u96C6\u6210", link: "conference_android.html" },
      { text: "iOS\u96C6\u6210", link: "conference_ios.html" },
      { text: "Web\u96C6\u6210", link: "conference_web.html" },
      { text: "\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u96C6\u6210", link: "conference_vxmini.html" },
      { text: "uni-app\u96C6\u6210", link: "conference_uniapp.html" },
      { text: "PC\u96C6\u6210", link: "conference_pcdesktop.html" }
    ]
  },
  /*{
    text: '互动白板', 
    children: [
      { text: '功能简介', link: 'whiteboard_introduction.html' },
      { text: 'Android集成', link: 'whiteboard_android.html' },
      { text: 'iOS集成', link: 'whiteboard_ios.html' },
      { text: 'Web集成', link: 'whiteboard_web.html' },
      { text: '微信小程序集成', link: 'whiteboard_vxmini.html' },
      { text: 'PC集成', link: 'whiteboard_pcdesktop.html' },
    ]
  } ,*/
  {
    text: "REST\u63A5\u53E3",
    children: [
      { text: "\u529F\u80FD\u7B80\u4ECB", link: "rest_introduction.html" },
      { text: "\u4F1A\u8BAE\u7BA1\u7406", link: "rest_manage.html" },
      { text: "\u5F55\u5236\u53CA\u63D0\u53D6", link: "rest_record.html" }
      /*{ text: '互动白板', link: 'rest_whiteboard.html' },*/
    ]
  },
  {
    text: "\u573A\u666F\u65B9\u6848",
    children: [
      { text: "1\u5BF91\u97F3\u89C6\u9891", link: "scenario_one2one.html" },
      { text: "\u97F3\u89C6\u9891\u4F1A\u8BAE", link: "scenario_meeting.html" },
      { text: "\u4E92\u52A8\u76F4\u64AD", link: "scenario_live.html" },
      { text: "\u8BED\u97F3\u8FDE\u9EA6\u804A\u5929\u5BA4", link: "scenario_tc.html" },
      { text: "\u8BED\u97F3\u8FDE\u9EA6\u804A\u5929\u5BA4-\u4E3B\u6301\u6A21\u5F0F", link: "scenario_tc-host.html" },
      { text: "\u8BED\u97F3\u8FDE\u9EA6\u804A\u5929\u5BA4-\u62A2\u9EA6\u6A21\u5F0F", link: "scenario_tc-robmic.html" },
      { text: "\u8BED\u97F3\u8FDE\u9EA6\u804A\u5929\u5BA4-\u4E34\u573A\u6A21\u5F0F", link: "scenario_tc-scene.html" }
    ]
  },
  {
    text: "\u9519\u8BEF\u7801",
    children: [
      { text: "\u9519\u8BEF\u7801", link: "common_error_code.html" }
    ]
  }
];

// docs/.vuepress/sidebar/callkit.ts
import path3 from "node:path";
import fs3 from "node:fs";
var __vite_injected_original_dirname3 = "D:/Easemob/Github_Library_Summary/easemob_doc/docs/.vuepress/sidebar";
var getSubDirectories3 = (dir) => fs3.readdirSync(dir).filter((item) => fs3.statSync(path3.join(dir, item)).isDirectory());
var CALL_DOC_PATH = path3.resolve(__vite_injected_original_dirname3, "../../callkit");
var callKitPlatformList = getSubDirectories3(CALL_DOC_PATH);
var callKitSidebar = [
  {
    /*
      text: 分组标题
      children: 分组导航列表  
        text: 显示的文本
        link: 链接地址
        show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
        only: 数组形式，只有在数组中的平台下显示
        except: 数组形式，除了数组中指定的平台外都显示
        collapsible: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
        children: 子菜单。请参考「子菜单示例」
    */
    text: "\u4EA7\u54C1\u4ECB\u7ECD",
    collapsible: true,
    children: [
      { text: "\u4EA7\u54C1\u6982\u8FF0", link: "product_overview.html" },
      { text: "\u5F00\u901A\u670D\u52A1", link: "product_activation.html" },
      { text: "\u8D2D\u4E70\u6307\u5357", link: "product_purchase.html" }
    ]
  },
  {
    text: "\u5FEB\u901F\u5F00\u59CB",
    collapsible: true,
    children: [
      { text: "\u8DD1\u901A\u793A\u4F8B\u9879\u76EE", link: "sample_runthrough.html" },
      { text: "\u5FEB\u901F\u5F00\u59CB", link: "quickstart.html" }
    ]
  },
  {
    text: "\u96C6\u6210\u6587\u6863",
    collapsible: true,
    children: [
      { text: "CallKit \u67B6\u6784", link: "architecture.html" },
      { text: "\u96C6\u6210 CallKit", link: "integration.html" },
      { text: "\u6743\u9650", link: "permission.html", only: ["android"] },
      {
        text: "\u4F7F\u7528 LiveCommunicationKit",
        link: "livecommunicationkit.html",
        only: ["ios"]
      },
      { text: "\u753B\u4E2D\u753B", link: "picture_in_picture.html", only: ["ios"] },
      { text: "\u4F7F\u7528 Telecom", link: "telecom.html", only: ["android"] },
      { text: "\u6765\u7535\u901A\u77E5\u548C\u60AC\u6D6E\u7A97", link: "float_top.html", only: ["android"] },
      { text: "\u81EA\u5B9A\u4E49\u8D44\u6E90", link: "customization.html" },
      { text: "\u901A\u8BDD\u4FE1\u4EE4", link: "signaling.html" },
      { text: "API \u6982\u89C8", link: "api_overview.html" },
      { text: "\u5E38\u89C1\u95EE\u9898", link: "common_issue.html" }
    ]
  },
  { text: "\u8BBE\u8BA1\u6307\u5357", link: "design_guide.html" },
  { text: "\u5386\u53F2\u6587\u6863", link: "easecallkit.html" }
];
function buildCallKitSidebar() {
  const result = {};
  callKitPlatformList.forEach((platform) => {
    const key = `/callkit/${platform}/`;
    result[key] = callKitSidebar.map(
      (sidebar2) => handleSidebarItem3(platform, sidebar2, CALL_DOC_PATH, "callkit")
    ).filter((s) => s);
  });
  return result;
}
function linkExists3(platform, link, docPath) {
  try {
    const filePath = `${docPath}/${platform}/${link.replace(/.html$/, ".md")}`;
    return fs3.existsSync(filePath);
  } catch (e) {
    console.error(`Error checking file existence: ${e}`);
    return false;
  }
}
function handleSidebarItem3(platform, sidebar2, docPath, kitType) {
  const hasChildren = sidebar2.hasOwnProperty("children") && sidebar2.children.length > 0;
  const hasOnly = sidebar2.hasOwnProperty("only") && sidebar2.only.length > 0;
  const hasExcept = sidebar2.hasOwnProperty("except") && sidebar2.except.length > 0;
  let needThisPlatform = true;
  if (hasOnly) {
    needThisPlatform = sidebar2.only.indexOf(platform) > -1;
  }
  if (hasExcept) {
    needThisPlatform = sidebar2.except.indexOf(platform) == -1;
  }
  if (!needThisPlatform) {
    return null;
  }
  if (hasChildren) {
    let newchildren = sidebar2.children.map((s) => handleSidebarItem3(platform, s, docPath, kitType)).filter((s) => s);
    if (newchildren.length > 0) {
      return { ...sidebar2, children: newchildren };
    }
  } else {
    if (linkExists3(platform, sidebar2.link, docPath)) {
      const newLink = `/${kitType}/${platform}/${sidebar2.link}`;
      return { ...sidebar2, link: newLink };
    }
  }
}
var CALL_KIT_SIDEBAR = buildCallKitSidebar();

// docs/.vuepress/sidebar/push.ts
var PUSH_SIDEBAR = [
  {
    text: "\u4EA7\u54C1\u4ECB\u7ECD",
    children: [
      { text: "\u4EA7\u54C1\u6982\u8FF0", link: "push_overview.html" },
      { text: "\u4EA7\u54C1\u52A8\u6001", collapsible: true, children: [
        { text: "\u4EA7\u54C1\u529F\u80FD\u52A8\u6001", link: "push_dynamics.html" },
        { text: "Android SDK \u53D1\u5E03\u52A8\u6001", link: "push_dynamics_android.html" },
        { text: "iOS SDK \u53D1\u5E03\u52A8\u6001", link: "push_dynamics_ios.html" }
      ] },
      { text: "\u5168\u7403\u5316\u90E8\u7F72", link: "push_global_deployment.html" },
      { text: "\u63A5\u53E3\u9891\u7387\u9650\u5236", link: "push_api_call_limitation.html" }
    ]
  },
  {
    text: "\u4EA7\u54C1\u5B9A\u4EF7",
    children: [
      { text: "\u8BA1\u8D39\u8BF4\u660E", link: "push_billing.html" }
    ]
  },
  {
    text: "\u5FEB\u901F\u5165\u95E8",
    children: [
      { text: "\u521B\u5EFA\u4EA7\u54C1\u53CA\u5E94\u7528", link: "push_createproduct_app.html" },
      { text: "\u521B\u5EFA\u63A8\u9001", link: "push_task_create.html" },
      { text: "\u63A8\u9001\u4EFB\u52A1", link: "push_task.html" },
      { text: "\u6807\u7B7E\u7BA1\u7406", link: "push_tag_mgmt.html" },
      { text: "\u8BC1\u4E66\u914D\u7F6E", link: "push_certificate_config.html" },
      { text: "\u6570\u636E\u7EDF\u8BA1", link: "push_statistics.html" }
    ]
  },
  {
    text: "Android \u63A5\u5165",
    children: [
      { text: "\u63A8\u9001\u96C6\u6210\u8BF4\u660E", link: "push_integration_note_android" },
      { text: "\u63A8\u9001\u96C6\u6210\u8FC7\u7A0B", link: "push_integration_process_android" },
      { text: "\u5382\u5546\u7EDF\u8BA1", link: "push_androidvendor_statistics" },
      // { text: '推送厂商消息分类', link: 'push_androidvendor_msgclassification' },
      { text: "\u5382\u5546\u901A\u9053\u9650\u5236\u53CA\u89E3\u51B3\u65B9\u6848", link: "push_androidchannel_restriction.html" }
    ]
  },
  {
    text: "iOS \u63A5\u5165",
    children: [
      { text: "\u63A8\u9001\u96C6\u6210\u8BF4\u660E", link: "push_integration_note_ios" },
      { text: "\u63A8\u9001\u96C6\u6210\u8FC7\u7A0B", link: "push_integration_process_ios" },
      { text: "APNs \u9001\u8FBE\u7EDF\u8BA1", link: "push_apns_deliver_statistics.html" }
    ]
  },
  {
    text: "\u670D\u52A1\u7AEF REST",
    children: [
      { text: "\u63A8\u9001\u6807\u7B7E\u7BA1\u7406", link: "push_by_tag.html" },
      { text: "\u53D1\u9001\u63A8\u9001\u901A\u77E5", link: "push_send_notification.html" },
      { text: "\u914D\u7F6E\u63A8\u9001\u901A\u77E5", link: "push_notification_config.html" }
    ]
  }
];

// docs/.vuepress/sidebar/index.ts
var zhSidebar = sidebar({
  "/product/": [
    { text: "\u4EA7\u54C1\u52A8\u6001", link: "product_dynamics.html" },
    {
      /*
        text: 分组标题
        children: 分组导航列表
          text: 显示的文本
          link: 链接地址
          show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
          collapsible: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
          children: 子菜单。请参考「子菜单示例」
      */
      text: "\u4EA7\u54C1\u7B80\u4ECB",
      collapsible: true,
      children: [
        { text: "\u4EA7\u54C1\u6982\u8FF0", link: "introduction.html" },
        { text: "\u5E94\u7528\u573A\u666F", link: "application_scenario.html" },
        {
          text: "\u529F\u80FD\u4ECB\u7ECD",
          collapsible: true,
          children: [
            { text: "\u529F\u80FD\u5217\u8868", link: "product_function.html" },
            { text: "\u529F\u80FD\u8BE6\u60C5", link: "conversation_function.html" }
          ]
        },
        {
          text: "\u8D26\u53F7\u7CFB\u7EDF",
          collapsible: true,
          children: [
            { text: "\u7528\u6237\u6CE8\u518C\u4E0E\u767B\u5F55", link: "product_user_registration_login.html" },
            { text: "\u5728\u7EBF\u72B6\u6001\u7BA1\u7406", link: "product_user_presence.html" }
          ]
        },
        {
          text: "\u7528\u6237\u5C5E\u6027\u4E0E\u7528\u6237\u5173\u7CFB",
          collapsible: true,
          children: [
            { text: "\u7528\u6237\u5C5E\u6027", link: "product_user_attribute.html" },
            { text: "\u7528\u6237\u5173\u7CFB", link: "product_user_relationship.html" }
          ]
        },
        {
          text: "\u6D88\u606F\u7BA1\u7406",
          collapsible: true,
          children: [
            { text: "\u5355\u804A\u6D88\u606F", link: "message_single_chat.html" },
            { text: "\u7FA4\u7EC4\u6D88\u606F", link: "message_group.html" },
            { text: "\u804A\u5929\u5BA4\u6D88\u606F", link: "message_chatroom.html" },
            { text: "\u6D88\u606F\u5B58\u50A8", link: "message_store.html" },
            { text: "\u6D88\u606F\u683C\u5F0F", link: "product_message_format.html" }
          ]
        },
        { text: "\u79BB\u7EBF\u63A8\u9001", link: "product_offline_push_overview.html" },
        {
          text: "\u7FA4\u7EC4\u7BA1\u7406",
          collapsible: true,
          children: [
            { text: "\u7FA4\u7EC4\u6982\u8FF0", link: "product_group_overview.html" },
            { text: "\u5B50\u533A", link: "product_thread_overview.html" }
          ]
        },
        { text: "\u804A\u5929\u5BA4", link: "product_chatroom_overview.html" },
        { text: "\u5185\u5BB9\u5BA1\u6838", link: "moderation_overview.html" },
        {
          text: "\u4F7F\u7528\u9650\u5236",
          collapsible: true,
          children: [
            { text: "\u529F\u80FD\u9650\u5236", link: "limitation.html" },
            { text: "RESTful \u63A5\u53E3\u9891\u7387\u9650\u5236", link: "limitationapi.html" }
          ]
        },
        {
          text: "\u6570\u636E\u4E2D\u5FC3",
          collapsible: true,
          children: [
            { text: "\u6570\u636E\u4E2D\u5FC3", link: "data_center.html" }
          ]
        }
      ]
    },
    {
      text: "\u8D2D\u4E70\u6307\u5357",
      collapsible: true,
      children: [
        { text: "\u8BA1\u8D39\u7B56\u7565", link: "pricing_policy.html" },
        { text: "\u5957\u9910\u5305\u529F\u80FD\u5BF9\u6BD4", link: "product_package_feature.html" },
        { text: "\u8D2D\u4E70\u6307\u5F15", link: "pricing_method.html" }
      ]
    },
    // {
    //   text: "Demo",
    //   collapsible: true,
    //   children: [
    //     { text: "体验 Demo", link: "demo.html" },
    //   ],
    // },
    {
      text: "\u589E\u503C\u670D\u52A1",
      collapsible: true,
      children: [
        {
          text: "\u6D88\u606F\u7FFB\u8BD1",
          collapsible: true,
          children: [
            { text: "Android", link: "message_translation_android.html" },
            { text: "iOS", link: "message_translation_ios.html" },
            { text: "Web", link: "message_translation_web.html" },
            { text: "\u5C0F\u7A0B\u5E8F", link: "message_translation_applet.html" },
            { text: "Flutter", link: "message_translation_flutter.html" },
            { text: "React Native", link: "message_translation_react-native.html" },
            { text: "Unity", link: "message_translation_unity.html" },
            { text: "Windows", link: "message_translation_windows.html" }
          ]
        },
        {
          text: "\u5185\u5BB9\u5BA1\u6838",
          collapsible: true,
          children: [
            {
              text: "\u4EA7\u54C1\u7B80\u4ECB",
              collapsible: true,
              children: [
                { text: "\u4EA7\u54C1\u6982\u8FF0", link: "moderation/moderation_overview.html" }
              ]
            },
            {
              text: "\u4EA7\u54C1\u5B9A\u4EF7",
              collapsible: true,
              children: [
                {
                  text: "\u56FD\u5185\u8BA1\u8D39\u8BF4\u660E",
                  link: "moderation/moderation_billing_domestic.html"
                },
                {
                  text: "\u6D77\u5916\u8BA1\u8D39\u8BF4\u660E",
                  link: "moderation/moderation_billing_overseas.html"
                }
              ]
            },
            {
              text: "\u5FEB\u901F\u5F00\u59CB",
              collapsible: true,
              children: [
                { text: "\u5F00\u901A\u5BA1\u6838\u670D\u52A1", link: "moderation/moderation_enable.html" },
                {
                  text: "\u89C4\u5219\u914D\u7F6E",
                  link: "moderation/moderation_rule_config.html"
                },
                { text: "\u89C4\u5219\u6D4B\u8BD5", link: "moderation/moderation_rule_test.html" },
                { text: "\u5386\u53F2\u8BB0\u5F55", link: "moderation/moderation_history.html" },
                { text: "\u5173\u952E\u8BCD\u5BA1\u6838", link: "moderation/moderation_keyword" },
                {
                  text: "\u6D88\u606F\u5BA1\u6838\u673A\u5236",
                  link: "moderation/moderation_mechanism.html"
                }
              ]
            },
            {
              text: "\u8FDB\u9636\u529F\u80FD",
              collapsible: true,
              children: [
                {
                  text: "\u5BA1\u6838\u8BB0\u5F55\u56DE\u8C03",
                  link: "moderation/moderation_record_callback.html"
                },
                {
                  text: "\u6D88\u606F\u4EBA\u5DE5\u5BA1\u6838",
                  link: "moderation/moderation_manual_review.html"
                },
                { text: "\u7528\u6237\u7BA1\u7406", link: "moderation/moderation_usermgmt.html" }
              ]
            }
          ]
        }
      ]
    },
    {
      text: "\u5E38\u89C1\u65B9\u6848",
      collapsible: true,
      children: [
        { text: "\u7FA4 @ \u6D88\u606F", link: "solution_common/group_@.html" },
        { text: "\u6D88\u606F\u5F15\u7528", link: "solution_common/message_quote.html" },
        { text: "\u5B9E\u73B0\u8F93\u5165\u6307\u793A\u5668", link: "solution_common/typing_indication.html" },
        { text: "\u8FC1\u79FB\u5230\u73AF\u4FE1", link: "solution_common/migrate_to_easemob.html" }
      ]
    },
    {
      text: "\u5E2E\u52A9\u4E2D\u5FC3",
      collapsible: true,
      children: [
        {
          text: "FAQ",
          collapsible: true,
          children: [
            { text: "FAQ \u8D28\u91CF", link: "faq_quality_issues.html" },
            { text: "FAQ \u96C6\u6210", link: "faq_integration_issues.html" }
          ]
        },
        { text: "\u8054\u7CFB\u6211\u4EEC", link: "help.html" }
      ]
    },
    {
      text: "\u5B89\u5168",
      collapsible: true,
      children: [
        { text: "\u5B89\u5168\u6700\u4F73\u5B9E\u8DF5", link: "security_best_practices.html" },
        { text: "GDPR \u5B89\u5168\u5408\u89C4", link: "GDPR.html" },
        { text: "SDK\u5408\u89C4\u4F7F\u7528\u8BF4\u660E", link: "https://www.easemob.com/news/privacy" }
      ]
    },
    {
      text: "Console \u6307\u5357\uFF08\u65B0\uFF09",
      collapsible: true,
      children: [
        { text: "\u6CE8\u518C\u8D26\u53F7", link: "console/account_register.html" },
        { text: "\u5B9E\u540D\u8BA4\u8BC1", link: "console/real_name_authentication.html" },
        {
          text: "\u5E94\u7528\u7BA1\u7406",
          collapsible: true,
          children: [
            { text: "\u521B\u5EFA\u5E94\u7528", link: "console/app_create.html" },
            { text: "\u67E5\u770B\u548C\u914D\u7F6E\u5E94\u7528", link: "console/app_manage.html" }
          ]
        },
        {
          text: "\u670D\u52A1\u5F00\u901A",
          collapsible: true,
          children: [
            { text: "\u8D2D\u4E70\u5957\u9910\u5305", link: "console/purchase_package.html" },
            { text: "\u5F00\u901A\u589E\u503C\u670D\u52A1", link: "console/purchase_value_added.html" }
          ]
        },
        {
          text: "\u529F\u80FD\u914D\u7F6E",
          collapsible: true,
          children: [
            {
              text: "\u914D\u7F6E\u57FA\u7840\u529F\u80FD",
              collapsible: true,
              children: [
                { text: "\u7528\u6237", link: "console/basic_user.html" },
                { text: "\u6D88\u606F", link: "console/basic_message.html" },
                { text: "\u4F1A\u8BDD/\u7FA4\u7EC4/\u804A\u5929\u5BA4", link: "console/basic_conversation_group_chatroom.html" },
                { text: "\u6D88\u606F\u56DE\u8C03", link: "console/basic_webhook.html" },
                { text: "\u5176\u4ED6", link: "console/basic_other.html" }
              ]
            },
            {
              text: "\u914D\u7F6E\u589E\u503C\u529F\u80FD",
              collapsible: true,
              children: [
                {
                  text: "\u5185\u5BB9\u5BA1\u6838",
                  collapsible: true,
                  children: [
                    { text: "\u6570\u636E\u603B\u89C8", link: "console/moderation_data_overview.html" },
                    { text: "\u89C4\u5219\u914D\u7F6E", link: "console/moderation_rule_config.html" },
                    { text: "\u89C4\u5219\u6D4B\u8BD5", link: "console/moderation_rule_test.html" },
                    { text: "\u5386\u53F2\u8BB0\u5F55", link: "console/moderation_history.html" },
                    { text: "\u5173\u952E\u8BCD\u540D\u5355", link: "console/moderation_keyword.html" },
                    { text: "\u5BA1\u6838\u8BB0\u5F55\u5BFC\u51FA", link: "console/moderation_history_export.html" },
                    { text: "\u6D88\u606F\u4E3E\u62A5", link: "console/moderation_message_report.html" },
                    { text: "\u6807\u7B7E\u7BA1\u7406", link: "console/moderation_user_tag.html" }
                  ]
                },
                {
                  text: "\u5373\u65F6\u63A8\u9001",
                  collapsible: true,
                  children: [
                    { text: "\u7528\u6237\u7BA1\u7406", link: "console/push_user.html" },
                    { text: "\u8BC1\u4E66\u7BA1\u7406", link: "console/push_certificate_config.html" },
                    { text: "\u6A21\u677F\u7BA1\u7406", link: "console/push_template.html" },
                    { text: "\u521B\u5EFA\u63A8\u9001", link: "console/push_task_create.html" },
                    { text: "\u63A8\u9001\u4EFB\u52A1", link: "console/push_task.html" },
                    { text: "\u6807\u7B7E\u7BA1\u7406", link: "console/push_tag_mgmt.html" },
                    { text: "\u63A8\u9001\u7EDF\u8BA1", link: "console/push_statistics.html" }
                  ]
                }
              ]
            }
          ]
        },
        {
          text: "\u8D26\u53F7\u7BA1\u7406",
          collapsible: true,
          children: [
            { text: "\u4FEE\u6539\u8D26\u6237\u4FE1\u606F", link: "console/account_modify.html" },
            { text: "\u521B\u5EFA\u5B50\u8D26\u53F7", link: "console/account_sub_create.html" }
          ]
        },
        { text: "\u8D26\u5355\u4E2D\u5FC3", link: "console/account_center.html" },
        {
          text: "\u8FD0\u8425\u7BA1\u7406",
          collapsible: true,
          children: [
            {
              text: "\u8FD0\u8425\u64CD\u4F5C",
              collapsible: true,
              children: [
                { text: "\u7528\u6237\u7BA1\u7406", link: "console/operation_user.html" },
                { text: "\u7FA4\u7EC4\u7BA1\u7406", link: "console/operation_group.html" },
                { text: "\u804A\u5929\u5BA4\u7BA1\u7406", link: "console/operation_chatroom.html" }
              ]
            },
            {
              text: "\u8FD0\u8425\u6570\u636E",
              collapsible: true,
              children: [
                { text: "\u6570\u636E\u67E5\u8BE2", link: "console/operation_data.html" },
                { text: "\u6D88\u606F\u91CF\u7EDF\u8BA1", link: "console/operation_message_statistics.html" }
              ]
            },
            {
              text: "\u95EE\u9898\u6392\u67E5",
              collapsible: true,
              children: [
                { text: "\u8BF7\u6C42\u8D28\u91CF\u76D1\u63A7", link: "console/operation_troubleshooting_request_quality.html" },
                { text: "\u6D88\u606F\u6295\u9012\u67E5\u8BE2", link: "console/operation_troubleshooting_message_delivery.html" },
                { text: "\u7528\u6237\u8FDE\u63A5\u72B6\u6001\u67E5\u8BE2", link: "console/operation_troubleshooting_user_connection.html" },
                { text: "\u7528\u6237\u8BBE\u5907\u65E5\u5FD7", link: "console/operation_troubleshooting_device_log.html" },
                { text: "\u804A\u5929\u5BA4\u6D88\u606F\u901F\u7387", link: "console/operation_troubleshooting_chatroom_rate.html" }
              ]
            }
          ]
        }
      ]
    },
    {
      text: "Console \u6307\u5357\uFF08\u65E7\uFF09",
      collapsible: true,
      children: [
        { text: "\u5F00\u901A\u548C\u914D\u7F6E\u670D\u52A1", link: "enable_and_configure_IM.html" },
        { text: "\u6D88\u606F\u91CF\u7EDF\u8BA1", link: "message_statistics.html" },
        { text: "\u8BF7\u6C42\u8D28\u91CF\u6982\u89C8", link: "request_quality_overview.html" }
      ]
    },
    { text: "\u672F\u8BED\u8868", link: "glossary.html" },
    {
      text: "\u5DF2\u5E9F\u5F03\u5185\u5BB9",
      collapsible: true,
      children: [
        {
          text: "\u73AF\u4FE1 AIGC",
          collapsible: true,
          children: [
            { text: "\u65B9\u6848\u4ECB\u7ECD", link: "aigc/aigc_scenario_introduction.html" },
            { text: "\u65B9\u6848\u9009\u62E9", link: "aigc/aigc_selection.html" },
            {
              text: "\u65B9\u6848\u4E00",
              collapsible: false,
              children: [
                { text: "\u670D\u52A1\u7AEF\u914D\u7F6E", link: "aigc/aigc_run_through_demo_server.html" },
                { text: "\u5BA2\u6237\u7AEF\u914D\u7F6E", link: "aigc/aigc_run_through_demo_client.html" }
              ]
            },
            {
              text: "\u65B9\u6848\u4E8C",
              collapsible: false,
              children: [
                { text: "\u4F7F\u7528 AI \u667A\u80FD\u529F\u80FD", link: "aigc/aigc_use.html" },
                { text: "REST API", link: "aigc/aigc_rest_api.html" }
              ]
            }
          ]
        },
        {
          text: "\u8D85\u7EA7\u793E\u533A",
          collapsible: true,
          children: [
            { text: "\u4EA7\u54C1\u6982\u8FF0", link: "circle/circle_overview.html" },
            {
              text: "\u5FEB\u901F\u5F00\u59CB",
              collapsible: false,
              children: [
                {
                  text: "Android \u5FEB\u901F\u5F00\u59CB",
                  link: "circle/circle_quickstart_android.html"
                },
                {
                  text: "iOS \u5FEB\u901F\u5F00\u59CB",
                  link: "circle/circle_quickstart_ios.html"
                },
                {
                  text: "Web \u5FEB\u901F\u5F00\u59CB",
                  link: "circle/circle_quickstart_web.html"
                }
              ]
            },
            {
              text: "\u96C6\u6210\u8BF4\u660E",
              collapsible: false,
              children: [
                {
                  text: "Android \u793E\u533A\u7BA1\u7406",
                  link: "circle/server_mgmt_android.html"
                },
                {
                  text: "Android \u9891\u9053\u7BA1\u7406",
                  link: "circle/channel_mgmt_android.html"
                },
                {
                  text: "Android \u9891\u9053\u5206\u7EC4\u7BA1\u7406",
                  link: "circle/category_mgmt_android.html"
                },
                { text: "iOS \u793E\u533A\u7BA1\u7406", link: "circle/server_mgmt_ios.html" },
                { text: "iOS \u9891\u9053\u7BA1\u7406", link: "circle/channel_mgmt_ios.html" },
                {
                  text: "iOS \u9891\u9053\u5206\u7EC4\u7BA1\u7406",
                  link: "circle/category_mgmt_ios.html"
                },
                { text: "Web \u793E\u533A\u7BA1\u7406", link: "circle/server_mgmt_web.html" },
                { text: "Web \u9891\u9053\u7BA1\u7406", link: "circle/channel_mgmt_web.html" },
                {
                  text: "Web \u9891\u9053\u5206\u7EC4\u7BA1\u7406",
                  link: "circle/category_mgmt_web.html"
                }
              ]
            },
            {
              text: "\u9519\u8BEF\u7801",
              collapsible: false,
              children: [
                {
                  text: "Android \u9519\u8BEF\u7801",
                  link: "circle/circle_errorcode_android.html"
                },
                {
                  text: "iOS \u9519\u8BEF\u7801",
                  link: "circle/circle_errorcode_ios.html"
                },
                {
                  text: "Web \u9519\u8BEF\u7801",
                  link: "circle/circle_errorcode_web.html"
                }
              ]
            },
            {
              text: "API \u53C2\u8003",
              collapsible: true,
              children: [
                { text: "REST \u793E\u533A\u7BA1\u7406", link: "circle/server_mgmt_rest.html" },
                {
                  text: "REST \u9891\u9053\u7BA1\u7406",
                  link: "circle/channel_mgmt_rest.html"
                },
                {
                  text: "REST \u9891\u9053\u5206\u7EC4\u7BA1\u7406",
                  link: "circle/category_mgmt_rest.html"
                },
                {
                  text: "Android API \u53C2\u8003",
                  link: "circle/api_reference_android.html"
                },
                { text: "iOS API \u53C2\u8003", link: "circle/api_reference_ios.html" },
                { text: "Web API \u53C2\u8003", link: "circle/api_reference_web.html" }
              ]
            }
          ]
        },
        {
          text: "\u8BED\u804A\u623F",
          collapsible: true,
          children: [
            {
              text: "\u573A\u666F\u6982\u89C8",
              collapsible: false,
              children: [
                {
                  text: "\u573A\u666F\u4ECB\u7ECD",
                  link: "voiceroom/demo_scenario_introduction.html"
                },
                {
                  text: "Demo \u4F53\u9A8C\uFF08Android/iOS\uFF09",
                  link: "voiceroom/demo_experience.html"
                }
              ]
            },
            {
              text: "\u5FEB\u901F\u5F00\u59CB",
              collapsible: false,
              children: [
                {
                  text: "\u8DD1\u901A\u793A\u4F8B\u9879\u76EE\uFF08Android\uFF09",
                  link: "voiceroom/run_through_demo_android.html"
                },
                {
                  text: "\u8DD1\u901A\u793A\u4F8B\u9879\u76EE\uFF08iOS\uFF09",
                  link: "voiceroom/run_through_demo_ios.html"
                }
              ]
            },
            {
              text: "\u5B9E\u73B0\u6D41\u7A0B",
              collapsible: false,
              children: [
                {
                  text: "\u5BA2\u6237\u7AEF\u5B9E\u73B0\uFF08Android\uFF09",
                  link: "voiceroom/client_implementation_android.html"
                },
                {
                  text: "\u5BA2\u6237\u7AEF\u5B9E\u73B0\uFF08iOS\uFF09",
                  link: "voiceroom/client_implementation_ios.html"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  ...DOC_SIDEBAR,
  ...CHAT_UIKIT_SIDEBAR,
  ...CHATROOM_UIKIT_SIDEBAR,
  ...CALL_KIT_SIDEBAR,
  "/private/im/": PRIVATE_IM_SIDEBAR,
  "/private/media/": PRIVATE_MEDIA_SIDEBAR,
  "/push": PUSH_SIDEBAR
});

// docs/.vuepress/theme.ts
var theme_default = hopeTheme({
  hostname: "https://doc.easemob.com/",
  home: "/",
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
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Language", "Repo", "Outlook"]
  },
  // sidebar
  sidebar: zhSidebar,
  footer: "\u73AF\u4FE1 IM \u6587\u6863 Version: 1.0.0 \xA9\uFE0F\u73AF\u4FE1",
  displayFooter: true,
  headerDepth: 2,
  extra_nav: [
    // { text: '提交工单', link: 'https://console.easemob.com/ticket', type: 'info' },
    {
      text: "\u767B\u5F55",
      link: "https://console.easemob.com/user/login",
      type: "success"
    },
    {
      text: "\u6CE8\u518C",
      link: "https://console.easemob.com/user/register",
      type: "primary"
    }
  ],
  // page meta
  metaLocales: {
    editLink: "\u5728 GitHub \u4E0A\u7F16\u8F91\u6B64\u9875"
  },
  plugins: {
    mdEnhance: {
      container: true,
      imgSize: true,
      tabs: true
    }
  }
});

// docs/.vuepress/config.ts
import path4 from "node:path";
var __vite_injected_original_dirname4 = "D:/Easemob/Github_Library_Summary/easemob_doc/docs/.vuepress";
var config_default = defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "\u73AF\u4FE1 IM \u6587\u6863",
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  description: "\u73AF\u4FE1 IM \u6587\u6863",
  shouldPrefetch: false,
  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: {
          "@static": path4.resolve(__vite_injected_original_dirname4, "./public")
        }
      },
      plugins: [
        // AutoImport({
        //   resolvers: [ElementPlusResolver({})],
        // }),
        // Components({
        //   resolvers: [ElementPlusResolver({ssr: true })],
        // }),
      ]
    },
    vuePluginOptions: {}
  }),
  markdown: {
    headers: {
      level: [2, 3]
    }
  },
  extendsMarkdown: (md) => {
    containerPlugin(md);
  },
  templateBuild: path4.resolve(__vite_injected_original_dirname4, "./templates/index.build.html"),
  theme: theme_default,
  plugins: [
    docsearchPlugin({
      appId: "5K8UTB3JVE",
      apiKey: "df9e938d06f6531ce8dd8de71f907f0d",
      indexName: "im-beta-easemob",
      searchParameters: {
        attributesToSnippet: [
          "hierarchy.lvl1:20",
          "hierarchy.lvl2:20",
          "hierarchy.lvl3:20",
          "hierarchy.lvl4:20",
          "hierarchy.lvl5:20",
          "hierarchy.lvl6:20",
          "content:50"
        ],
        hitsPerPage: 50,
        facetFilters: [
          [
            "type:lvl0",
            "type:lvl1",
            "type:lvl2",
            "type:lvl3",
            "type:lvl4",
            "type:lvl5"
          ]
        ]
      },
      maxResultsPerGroup: 30,
      // transformItems: (items) => {
      //   console.log(items)
      //   return items.map((items) => ({ ...items, content: 'xxxxxx' }))
      // },
      placeholder: "\u641C\u7D22\u6587\u6863",
      translations: {
        button: {
          buttonText: "\u641C\u7D22",
          buttonAriaLabel: "\u641C\u7D22\u6587\u6863"
        },
        modal: {
          searchBox: {
            resetButtonTitle: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6",
            resetButtonAriaLabel: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6",
            cancelButtonText: "\u53D6\u6D88",
            cancelButtonAriaLabel: "\u53D6\u6D88"
          },
          startScreen: {
            recentSearchesTitle: "\u641C\u7D22\u5386\u53F2",
            noRecentSearchesText: "\u6CA1\u6709\u641C\u7D22\u5386\u53F2",
            saveRecentSearchButtonTitle: "\u4FDD\u5B58\u81F3\u641C\u7D22\u5386\u53F2",
            removeRecentSearchButtonTitle: "\u4ECE\u641C\u7D22\u5386\u53F2\u4E2D\u79FB\u9664",
            favoriteSearchesTitle: "\u6536\u85CF",
            removeFavoriteSearchButtonTitle: "\u4ECE\u6536\u85CF\u4E2D\u79FB\u9664"
          },
          errorScreen: {
            titleText: "\u65E0\u6CD5\u83B7\u53D6\u7ED3\u679C",
            helpText: "\u4F60\u53EF\u80FD\u9700\u8981\u68C0\u67E5\u4F60\u7684\u7F51\u7EDC\u8FDE\u63A5"
          },
          footer: {
            selectText: "\u9009\u62E9",
            navigateText: "\u5207\u6362",
            closeText: "\u5173\u95ED",
            searchByText: "\u641C\u7D22\u63D0\u4F9B\u8005"
          },
          noResultsScreen: {
            noResultsText: "\u65E0\u6CD5\u627E\u5230\u76F8\u5173\u7ED3\u679C",
            suggestedQueryText: "\u4F60\u53EF\u4EE5\u5C1D\u8BD5\u67E5\u8BE2",
            reportMissingResultsText: "\u4F60\u8BA4\u4E3A\u8BE5\u67E5\u8BE2\u5E94\u8BE5\u6709\u7ED3\u679C\uFF1F",
            reportMissingResultsLinkText: "\u70B9\u51FB\u53CD\u9988"
          }
        }
      }
    })
  ],
  onPrepared: async (app) => {
    await app.writeTemp(
      "pages.js",
      `export default ${JSON.stringify(app.pages.map(({ data }) => data))}`
    );
  },
  alias: {
    "@theme-hope/components/HomePage": path4.resolve(
      __vite_injected_original_dirname4,
      "./components/HomePage.vue"
    ),
    "@theme-hope/modules/sidebar/components/Sidebar": path4.resolve(
      __vite_injected_original_dirname4,
      "./components/Sidebar.vue"
    ),
    "@theme-hope/modules/navbar/components/Navbar": path4.resolve(
      __vite_injected_original_dirname4,
      "./components/Navbar.vue"
    ),
    "@theme-hope/components/MarkdownContent": path4.resolve(
      __vite_injected_original_dirname4,
      "./components/MarkdownContent.vue"
    ),
    "@theme-hope/components/PageNav": path4.resolve(
      __vite_injected_original_dirname4,
      "./components/PageNav.vue"
    )
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udnVlcHJlc3MvY29uZmlnLnRzIiwgImRvY3MvLnZ1ZXByZXNzL21hcmtkb3duL3BsdWdpbi50cyIsICJkb2NzLy52dWVwcmVzcy90aGVtZS50cyIsICJkb2NzLy52dWVwcmVzcy9uYXZiYXIvaW5kZXgudHMiLCAiZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9pbmRleC50cyIsICJkb2NzLy52dWVwcmVzcy9zaWRlYmFyL2RvY3VtZW50LnRzIiwgImRvY3MvLnZ1ZXByZXNzL3NpZGViYXIvdWlraXQudHMiLCAiZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9wcml2YXRlLnRzIiwgImRvY3MvLnZ1ZXByZXNzL3NpZGViYXIvY2FsbGtpdC50cyIsICJkb2NzLy52dWVwcmVzcy9zaWRlYmFyL3B1c2gudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOi9FYXNlbW9iL0dpdGh1Yl9MaWJyYXJ5X1N1bW1hcnkvZWFzZW1vYl9kb2MvZG9jcy8udnVlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEVhc2Vtb2JcXFxcR2l0aHViX0xpYnJhcnlfU3VtbWFyeVxcXFxlYXNlbW9iX2RvY1xcXFxkb2NzXFxcXC52dWVwcmVzc1xcXFxjb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0Vhc2Vtb2IvR2l0aHViX0xpYnJhcnlfU3VtbWFyeS9lYXNlbW9iX2RvYy9kb2NzLy52dWVwcmVzcy9jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVVc2VyQ29uZmlnLCBVc2VyQ29uZmlnIH0gZnJvbSAndnVlcHJlc3MnXHJcbmltcG9ydCB7IHZpdGVCdW5kbGVyIH0gZnJvbSAnQHZ1ZXByZXNzL2J1bmRsZXItdml0ZSdcclxuaW1wb3J0IHsgaG9wZVRoZW1lIH0gZnJvbSAndnVlcHJlc3MtdGhlbWUtaG9wZSdcclxuLy8gaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuLy8gaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuLy8gaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuaW1wb3J0IHsgZG9jc2VhcmNoUGx1Z2luIH0gZnJvbSAnQHZ1ZXByZXNzL3BsdWdpbi1kb2NzZWFyY2gnXHJcbmltcG9ydCB7IGNvbnRhaW5lclBsdWdpbiB9IGZyb20gJy4vbWFya2Rvd24vcGx1Z2luJ1xyXG5pbXBvcnQgdGhlbWUgZnJvbSAnLi90aGVtZS5qcydcclxuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5cclxuLy8gaW1wb3J0IHR5cGUgeyBEb2NTZWFyY2hQcm9wcyB9IGZyb20gJ0Bkb2NzZWFyY2gvcmVhY3QnXHJcblxyXG4vLyB0eXBlIERvY1NlYXJjaENsaWVudExvY2FsZU9wdGlvbnMgPSBPbWl0PFxyXG4vLyAgIERvY1NlYXJjaFByb3BzLFxyXG4vLyAgICdoaXRDb21wb25lbnQnIHwgJ25hdmlnYXRvcicgfCAndHJhbnNmb3JtU2VhcmNoQ2xpZW50J1xyXG4vLyA+XHJcblxyXG4vLyBpbnRlcmZhY2UgRG9jU2VhcmNoQ2xpZW50T3B0aW9ucyBleHRlbmRzIERvY1NlYXJjaENsaWVudExvY2FsZU9wdGlvbnMge1xyXG4vLyAgIGxvY2FsZXM/OiBSZWNvcmQ8c3RyaW5nLCBEb2NTZWFyY2hDbGllbnRMb2NhbGVPcHRpb25zPlxyXG4vLyB9XHJcblxyXG4vLyBjb25zdCBkZWZpbmVEb2NTZWFyY2hDb25maWc6IChvcHRpb25zOiBEb2NTZWFyY2hDbGllbnRPcHRpb25zKSA9PiB2b2lkXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVVc2VyQ29uZmlnKHtcclxuICBiYXNlOiAnLycsXHJcbiAgbGFuZzogJ3poLUNOJyxcclxuICB0aXRsZTogJ1x1NzNBRlx1NEZFMSBJTSBcdTY1ODdcdTY4NjMnLFxyXG4gIGhlYWQ6IFtbJ2xpbmsnLCB7IHJlbDogJ2ljb24nLCBocmVmOiAnL2xvZ28ucG5nJyB9XV0sXHJcbiAgZGVzY3JpcHRpb246ICdcdTczQUZcdTRGRTEgSU0gXHU2NTg3XHU2ODYzJyxcclxuICBzaG91bGRQcmVmZXRjaDogZmFsc2UsXHJcbiAgYnVuZGxlcjogdml0ZUJ1bmRsZXIoe1xyXG4gICAgdml0ZU9wdGlvbnM6IHtcclxuICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAnQHN0YXRpYyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3B1YmxpYycpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgLy8gQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgLy8gICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKHt9KV0sXHJcbiAgICAgICAgLy8gfSksXHJcbiAgICAgICAgLy8gQ29tcG9uZW50cyh7XHJcbiAgICAgICAgLy8gICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKHtzc3I6IHRydWUgfSldLFxyXG4gICAgICAgIC8vIH0pLFxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgdnVlUGx1Z2luT3B0aW9uczoge31cclxuICB9KSxcclxuICBtYXJrZG93bjoge1xyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICBsZXZlbDogWzIsIDNdXHJcbiAgICB9XHJcbiAgfSxcclxuICBleHRlbmRzTWFya2Rvd246IChtZCkgPT4ge1xyXG4gICAgY29udGFpbmVyUGx1Z2luKG1kKVxyXG4gIH0sXHJcbiAgdGVtcGxhdGVCdWlsZDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vdGVtcGxhdGVzL2luZGV4LmJ1aWxkLmh0bWwnKSxcclxuICB0aGVtZSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBkb2NzZWFyY2hQbHVnaW4oe1xyXG4gICAgICBhcHBJZDogJzVLOFVUQjNKVkUnLFxyXG4gICAgICBhcGlLZXk6ICdkZjllOTM4ZDA2ZjY1MzFjZThkZDhkZTcxZjkwN2YwZCcsXHJcbiAgICAgIGluZGV4TmFtZTogJ2ltLWJldGEtZWFzZW1vYicsXHJcbiAgICAgIHNlYXJjaFBhcmFtZXRlcnM6IHtcclxuICAgICAgICBhdHRyaWJ1dGVzVG9TbmlwcGV0OiBbXHJcbiAgICAgICAgICAnaGllcmFyY2h5Lmx2bDE6MjAnLFxyXG4gICAgICAgICAgJ2hpZXJhcmNoeS5sdmwyOjIwJyxcclxuICAgICAgICAgICdoaWVyYXJjaHkubHZsMzoyMCcsXHJcbiAgICAgICAgICAnaGllcmFyY2h5Lmx2bDQ6MjAnLFxyXG4gICAgICAgICAgJ2hpZXJhcmNoeS5sdmw1OjIwJyxcclxuICAgICAgICAgICdoaWVyYXJjaHkubHZsNjoyMCcsXHJcbiAgICAgICAgICAnY29udGVudDo1MCdcclxuICAgICAgICBdLFxyXG4gICAgICAgIGhpdHNQZXJQYWdlOiA1MCxcclxuICAgICAgICBmYWNldEZpbHRlcnM6IFtcclxuICAgICAgICAgIFtcclxuICAgICAgICAgICAgJ3R5cGU6bHZsMCcsXHJcbiAgICAgICAgICAgICd0eXBlOmx2bDEnLFxyXG4gICAgICAgICAgICAndHlwZTpsdmwyJyxcclxuICAgICAgICAgICAgJ3R5cGU6bHZsMycsXHJcbiAgICAgICAgICAgICd0eXBlOmx2bDQnLFxyXG4gICAgICAgICAgICAndHlwZTpsdmw1J1xyXG4gICAgICAgICAgXVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgbWF4UmVzdWx0c1Blckdyb3VwOiAzMCxcclxuICAgICAgLy8gdHJhbnNmb3JtSXRlbXM6IChpdGVtcykgPT4ge1xyXG4gICAgICAvLyAgIGNvbnNvbGUubG9nKGl0ZW1zKVxyXG4gICAgICAvLyAgIHJldHVybiBpdGVtcy5tYXAoKGl0ZW1zKSA9PiAoeyAuLi5pdGVtcywgY29udGVudDogJ3h4eHh4eCcgfSkpXHJcbiAgICAgIC8vIH0sXHJcbiAgICAgIHBsYWNlaG9sZGVyOiAnXHU2NDFDXHU3RDIyXHU2NTg3XHU2ODYzJyxcclxuICAgICAgdHJhbnNsYXRpb25zOiB7XHJcbiAgICAgICAgYnV0dG9uOiB7XHJcbiAgICAgICAgICBidXR0b25UZXh0OiAnXHU2NDFDXHU3RDIyJyxcclxuICAgICAgICAgIGJ1dHRvbkFyaWFMYWJlbDogJ1x1NjQxQ1x1N0QyMlx1NjU4N1x1Njg2MydcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1vZGFsOiB7XHJcbiAgICAgICAgICBzZWFyY2hCb3g6IHtcclxuICAgICAgICAgICAgcmVzZXRCdXR0b25UaXRsZTogJ1x1NkUwNVx1OTY2NFx1NjdFNVx1OEJFMlx1Njc2MVx1NEVGNicsXHJcbiAgICAgICAgICAgIHJlc2V0QnV0dG9uQXJpYUxhYmVsOiAnXHU2RTA1XHU5NjY0XHU2N0U1XHU4QkUyXHU2NzYxXHU0RUY2JyxcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ1x1NTNENlx1NkQ4OCcsXHJcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvbkFyaWFMYWJlbDogJ1x1NTNENlx1NkQ4OCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzdGFydFNjcmVlbjoge1xyXG4gICAgICAgICAgICByZWNlbnRTZWFyY2hlc1RpdGxlOiAnXHU2NDFDXHU3RDIyXHU1Mzg2XHU1M0YyJyxcclxuICAgICAgICAgICAgbm9SZWNlbnRTZWFyY2hlc1RleHQ6ICdcdTZDQTFcdTY3MDlcdTY0MUNcdTdEMjJcdTUzODZcdTUzRjInLFxyXG4gICAgICAgICAgICBzYXZlUmVjZW50U2VhcmNoQnV0dG9uVGl0bGU6ICdcdTRGRERcdTVCNThcdTgxRjNcdTY0MUNcdTdEMjJcdTUzODZcdTUzRjInLFxyXG4gICAgICAgICAgICByZW1vdmVSZWNlbnRTZWFyY2hCdXR0b25UaXRsZTogJ1x1NEVDRVx1NjQxQ1x1N0QyMlx1NTM4Nlx1NTNGMlx1NEUyRFx1NzlGQlx1OTY2NCcsXHJcbiAgICAgICAgICAgIGZhdm9yaXRlU2VhcmNoZXNUaXRsZTogJ1x1NjUzNlx1ODVDRicsXHJcbiAgICAgICAgICAgIHJlbW92ZUZhdm9yaXRlU2VhcmNoQnV0dG9uVGl0bGU6ICdcdTRFQ0VcdTY1MzZcdTg1Q0ZcdTRFMkRcdTc5RkJcdTk2NjQnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3JTY3JlZW46IHtcclxuICAgICAgICAgICAgdGl0bGVUZXh0OiAnXHU2NUUwXHU2Q0Q1XHU4M0I3XHU1M0Q2XHU3RUQzXHU2NzlDJyxcclxuICAgICAgICAgICAgaGVscFRleHQ6ICdcdTRGNjBcdTUzRUZcdTgwRkRcdTk3MDBcdTg5ODFcdTY4QzBcdTY3RTVcdTRGNjBcdTc2ODRcdTdGNTFcdTdFRENcdThGREVcdTYzQTUnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgIHNlbGVjdFRleHQ6ICdcdTkwMDlcdTYyRTknLFxyXG4gICAgICAgICAgICBuYXZpZ2F0ZVRleHQ6ICdcdTUyMDdcdTYzNjInLFxyXG4gICAgICAgICAgICBjbG9zZVRleHQ6ICdcdTUxNzNcdTk1RUQnLFxyXG4gICAgICAgICAgICBzZWFyY2hCeVRleHQ6ICdcdTY0MUNcdTdEMjJcdTYzRDBcdTRGOUJcdTgwMDUnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbm9SZXN1bHRzU2NyZWVuOiB7XHJcbiAgICAgICAgICAgIG5vUmVzdWx0c1RleHQ6ICdcdTY1RTBcdTZDRDVcdTYyN0VcdTUyMzBcdTc2RjhcdTUxNzNcdTdFRDNcdTY3OUMnLFxyXG4gICAgICAgICAgICBzdWdnZXN0ZWRRdWVyeVRleHQ6ICdcdTRGNjBcdTUzRUZcdTRFRTVcdTVDMURcdThCRDVcdTY3RTVcdThCRTInLFxyXG4gICAgICAgICAgICByZXBvcnRNaXNzaW5nUmVzdWx0c1RleHQ6ICdcdTRGNjBcdThCQTRcdTRFM0FcdThCRTVcdTY3RTVcdThCRTJcdTVFOTRcdThCRTVcdTY3MDlcdTdFRDNcdTY3OUNcdUZGMUYnLFxyXG4gICAgICAgICAgICByZXBvcnRNaXNzaW5nUmVzdWx0c0xpbmtUZXh0OiAnXHU3MEI5XHU1MUZCXHU1M0NEXHU5OTg4J1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICBdLFxyXG4gIG9uUHJlcGFyZWQ6IGFzeW5jIChhcHApID0+IHtcclxuICAgIGF3YWl0IGFwcC53cml0ZVRlbXAoXHJcbiAgICAgICdwYWdlcy5qcycsXHJcbiAgICAgIGBleHBvcnQgZGVmYXVsdCAke0pTT04uc3RyaW5naWZ5KGFwcC5wYWdlcy5tYXAoKHsgZGF0YSB9KSA9PiBkYXRhKSl9YFxyXG4gICAgKVxyXG4gIH0sXHJcbiAgYWxpYXM6IHtcclxuICAgICdAdGhlbWUtaG9wZS9jb21wb25lbnRzL0hvbWVQYWdlJzogcGF0aC5yZXNvbHZlKFxyXG4gICAgICBfX2Rpcm5hbWUsXHJcbiAgICAgICcuL2NvbXBvbmVudHMvSG9tZVBhZ2UudnVlJ1xyXG4gICAgKSxcclxuXHJcbiAgICAnQHRoZW1lLWhvcGUvbW9kdWxlcy9zaWRlYmFyL2NvbXBvbmVudHMvU2lkZWJhcic6IHBhdGgucmVzb2x2ZShcclxuICAgICAgX19kaXJuYW1lLFxyXG4gICAgICAnLi9jb21wb25lbnRzL1NpZGViYXIudnVlJ1xyXG4gICAgKSxcclxuXHJcbiAgICAnQHRoZW1lLWhvcGUvbW9kdWxlcy9uYXZiYXIvY29tcG9uZW50cy9OYXZiYXInOiBwYXRoLnJlc29sdmUoXHJcbiAgICAgIF9fZGlybmFtZSxcclxuICAgICAgJy4vY29tcG9uZW50cy9OYXZiYXIudnVlJ1xyXG4gICAgKSxcclxuXHJcbiAgICAnQHRoZW1lLWhvcGUvY29tcG9uZW50cy9NYXJrZG93bkNvbnRlbnQnOiBwYXRoLnJlc29sdmUoXHJcbiAgICAgIF9fZGlybmFtZSxcclxuICAgICAgJy4vY29tcG9uZW50cy9NYXJrZG93bkNvbnRlbnQudnVlJ1xyXG4gICAgKSxcclxuXHJcbiAgICAnQHRoZW1lLWhvcGUvY29tcG9uZW50cy9QYWdlTmF2JzogcGF0aC5yZXNvbHZlKFxyXG4gICAgICBfX2Rpcm5hbWUsXHJcbiAgICAgICcuL2NvbXBvbmVudHMvUGFnZU5hdi52dWUnXHJcbiAgICApXHJcbiAgfVxyXG59KVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6L0Vhc2Vtb2IvR2l0aHViX0xpYnJhcnlfU3VtbWFyeS9lYXNlbW9iX2RvYy9kb2NzLy52dWVwcmVzcy9tYXJrZG93blwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRWFzZW1vYlxcXFxHaXRodWJfTGlicmFyeV9TdW1tYXJ5XFxcXGVhc2Vtb2JfZG9jXFxcXGRvY3NcXFxcLnZ1ZXByZXNzXFxcXG1hcmtkb3duXFxcXHBsdWdpbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRWFzZW1vYi9HaXRodWJfTGlicmFyeV9TdW1tYXJ5L2Vhc2Vtb2JfZG9jL2RvY3MvLnZ1ZXByZXNzL21hcmtkb3duL3BsdWdpbi50c1wiO2ltcG9ydCB0eXBlIE1hcmtkb3duSXQgZnJvbSAnbWFya2Rvd24taXQnXHJcbmltcG9ydCB0eXBlIHsgUmVuZGVyUnVsZSB9IGZyb20gJ21hcmtkb3duLWl0L2xpYi9yZW5kZXJlcidcclxuaW1wb3J0IGNvbnRhaW5lciBmcm9tICdtYXJrZG93bi1pdC1jb250YWluZXInXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGNvbnRhaW5lclBsdWdpbiA9IChtZDogTWFya2Rvd25JdCkgPT4ge1xyXG4gIG1kLnVzZSguLi5jcmVhdGVDb250YWluZXIoJ25vdGljZScsICdcdTYzRDBcdTc5M0EnLCBtZCkpXHJcbn1cclxuXHJcbnR5cGUgQ29udGFpbmVyQXJncyA9IFt0eXBlb2YgY29udGFpbmVyLCBzdHJpbmcsIHsgcmVuZGVyOiBSZW5kZXJSdWxlIH1dXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDb250YWluZXIoXHJcbiAga2xhc3M6IHN0cmluZyxcclxuICBkZWZhdWx0VGl0bGU6IHN0cmluZyxcclxuICBtZDogTWFya2Rvd25JdFxyXG4pOiBDb250YWluZXJBcmdzIHtcclxuICByZXR1cm4gW1xyXG4gICAgY29udGFpbmVyLFxyXG4gICAga2xhc3MsXHJcbiAgICB7XHJcbiAgICAgIHJlbmRlcih0b2tlbnMsIGlkeCkge1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2lkeF1cclxuICAgICAgICBjb25zdCBpbmZvID0gdG9rZW4uaW5mby50cmltKCkuc2xpY2Uoa2xhc3MubGVuZ3RoKS50cmltKClcclxuICAgICAgICBpZiAodG9rZW4ubmVzdGluZyA9PT0gMSkge1xyXG4gICAgICAgICAgY29uc3QgdGl0bGUgPSBtZC5yZW5kZXJJbmxpbmUoaW5mbyB8fCBkZWZhdWx0VGl0bGUpXHJcbiAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCIke2tsYXNzPT0nbm90aWNlJz8nbm90ZSc6a2xhc3N9IGhpbnQtY29udGFpbmVyXCI+PHAgY2xhc3M9XCJoaW50LWNvbnRhaW5lci10aXRsZVwiPiR7dGl0bGV9PC9wPlxcbmBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGA8L2Rpdj5cXG5gXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgXVxyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDovRWFzZW1vYi9HaXRodWJfTGlicmFyeV9TdW1tYXJ5L2Vhc2Vtb2JfZG9jL2RvY3MvLnZ1ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxFYXNlbW9iXFxcXEdpdGh1Yl9MaWJyYXJ5X1N1bW1hcnlcXFxcZWFzZW1vYl9kb2NcXFxcZG9jc1xcXFwudnVlcHJlc3NcXFxcdGhlbWUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0Vhc2Vtb2IvR2l0aHViX0xpYnJhcnlfU3VtbWFyeS9lYXNlbW9iX2RvYy9kb2NzLy52dWVwcmVzcy90aGVtZS50c1wiO2ltcG9ydCB7IGhvcGVUaGVtZSwgVGhlbWVPcHRpb25zIH0gZnJvbSAndnVlcHJlc3MtdGhlbWUtaG9wZSdcclxuaW1wb3J0IHsgemhOYXZiYXIgfSBmcm9tICcuL25hdmJhci9pbmRleC5qcydcclxuaW1wb3J0IHsgemhTaWRlYmFyIH0gZnJvbSAnLi9zaWRlYmFyL2luZGV4LmpzJ1xyXG5cclxuaW50ZXJmYWNlIEN1c3RvbUNvbmZpZyB7XHJcbiAgZXh0cmFfbmF2PzogYW55W11cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaG9wZVRoZW1lKDxUaGVtZU9wdGlvbnMgJiBDdXN0b21Db25maWc+e1xyXG4gIGhvc3RuYW1lOiAnaHR0cHM6Ly9kb2MuZWFzZW1vYi5jb20vJyxcclxuICBob21lOiAnLycsXHJcbiAgaWNvbkFzc2V0czogJ2ljb25mb250JyxcclxuICBsb2dvOiAnL2xvZ28ucG5nJyxcclxuICByZXBvOiAnZWFzZW1vYi9lYXNlbW9iLWRvYycsXHJcbiAgZG9jc0JyYW5jaDogJ2RvYy12MicsXHJcbiAgZG9jc0RpcjogJ2RvY3MnLFxyXG4gIGRhcmttb2RlOiAnZGlzYWJsZScsXHJcbiAgcHVyZTogdHJ1ZSxcclxuICBjb250cmlidXRvcnM6IGZhbHNlLFxyXG4gIC8vIG5hdmJhclxyXG4gIG5hdmJhcjogemhOYXZiYXIsXHJcbiAgbmF2YmFyTGF5b3V0OiB7XHJcbiAgICBzdGFydDogWydCcmFuZCddLFxyXG4gICAgY2VudGVyOiBbJ0xpbmtzJ10sXHJcbiAgICBlbmQ6IFsnTGFuZ3VhZ2UnLCAnUmVwbycsICdPdXRsb29rJ11cclxuICB9LFxyXG4gIC8vIHNpZGViYXJcclxuICBzaWRlYmFyOiB6aFNpZGViYXIsXHJcbiAgZm9vdGVyOiAnXHU3M0FGXHU0RkUxIElNIFx1NjU4N1x1Njg2MyBWZXJzaW9uOiAxLjAuMCBcdTAwQTlcdUZFMEZcdTczQUZcdTRGRTEnLFxyXG4gIGRpc3BsYXlGb290ZXI6IHRydWUsXHJcbiAgaGVhZGVyRGVwdGg6IDIsXHJcbiAgZXh0cmFfbmF2OiBbXHJcbiAgICAvLyB7IHRleHQ6ICdcdTYzRDBcdTRFQTRcdTVERTVcdTUzNTUnLCBsaW5rOiAnaHR0cHM6Ly9jb25zb2xlLmVhc2Vtb2IuY29tL3RpY2tldCcsIHR5cGU6ICdpbmZvJyB9LFxyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnXHU3NjdCXHU1RjU1JyxcclxuICAgICAgbGluazogJ2h0dHBzOi8vY29uc29sZS5lYXNlbW9iLmNvbS91c2VyL2xvZ2luJyxcclxuICAgICAgdHlwZTogJ3N1Y2Nlc3MnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnXHU2Q0U4XHU1MThDJyxcclxuICAgICAgbGluazogJ2h0dHBzOi8vY29uc29sZS5lYXNlbW9iLmNvbS91c2VyL3JlZ2lzdGVyJyxcclxuICAgICAgdHlwZTogJ3ByaW1hcnknXHJcbiAgICB9XHJcbiAgXSxcclxuICAvLyBwYWdlIG1ldGFcclxuICBtZXRhTG9jYWxlczoge1xyXG4gICAgZWRpdExpbms6ICdcdTU3MjggR2l0SHViIFx1NEUwQVx1N0YxNlx1OEY5MVx1NkI2NFx1OTg3NSdcclxuICB9LFxyXG4gIHBsdWdpbnM6IHtcclxuICAgIG1kRW5oYW5jZToge1xyXG4gICAgICBjb250YWluZXI6IHRydWUsXHJcbiAgICAgIGltZ1NpemU6IHRydWUsXHJcbiAgICAgIHRhYnM6IHRydWVcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDovRWFzZW1vYi9HaXRodWJfTGlicmFyeV9TdW1tYXJ5L2Vhc2Vtb2JfZG9jL2RvY3MvLnZ1ZXByZXNzL25hdmJhclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRWFzZW1vYlxcXFxHaXRodWJfTGlicmFyeV9TdW1tYXJ5XFxcXGVhc2Vtb2JfZG9jXFxcXGRvY3NcXFxcLnZ1ZXByZXNzXFxcXG5hdmJhclxcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRWFzZW1vYi9HaXRodWJfTGlicmFyeV9TdW1tYXJ5L2Vhc2Vtb2JfZG9jL2RvY3MvLnZ1ZXByZXNzL25hdmJhci9pbmRleC50c1wiO2ltcG9ydCB7IG5hdmJhciB9IGZyb20gJ3Z1ZXByZXNzLXRoZW1lLWhvcGUnXHJcblxyXG5leHBvcnQgY29uc3QgemhOYXZiYXIgPSBuYXZiYXIoW1xyXG4gIHsgdGV4dDogJ1x1NEVBN1x1NTRDMVx1N0I4MFx1NEVDQicsIGxpbms6ICcvcHJvZHVjdC9pbnRyb2R1Y3Rpb24uaHRtbCcgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnVUlLaXQnLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdcdTUzNTVcdTdGQTRcdTgwNEEgVUlLaXQnLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdBbmRyb2lkJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLUFuZHJvaWQuc3ZnJyxcclxuICAgICAgICAgICAgbGluazogJy91aWtpdC9jaGF0dWlraXQvYW5kcm9pZC9jaGF0dWlraXRfb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdpT1MnLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24taU9TLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvdWlraXQvY2hhdHVpa2l0L2lvcy9jaGF0dWlraXRfb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdXZWInLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24td2ViLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvdWlraXQvY2hhdHVpa2l0L3dlYi9jaGF0dWlraXRfb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdIYXJtb255T1MnLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24taGFybW9ueW9zLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvdWlraXQvY2hhdHVpa2l0L2hhcm1vbnlvcy9jaGF0dWlraXRfb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdVbmlhcHAnLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24tdW5pLWFwcC5zdmcnLFxyXG4gICAgICAgICAgICBsaW5rOiAnL3Vpa2l0L2NoYXR1aWtpdC91bmlhcHAvY2hhdHVpa2l0X292ZXJ2aWV3Lmh0bWwnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnUmVhY3QgTmF0aXZlJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLVJlYWN0TmF0aXZlLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvdWlraXQvY2hhdHVpa2l0L3JlYWN0LW5hdGl2ZS9jaGF0dWlraXRfb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdGbHV0dGVyJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLWZsdXR0ZXIuc3ZnJyxcclxuICAgICAgICAgICAgbGluazogJy91aWtpdC9jaGF0dWlraXQvZmx1dHRlci9jaGF0dWlraXRfb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiAnXHU4MDRBXHU1OTI5XHU1QkE0IFVJS2l0JyxcclxuICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnQW5kcm9pZCcsXHJcbiAgICAgICAgICAgIGljb246ICcvaWNvbi1BbmRyb2lkLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvdWlraXQvY2hhdHJvb211aWtpdC9hbmRyb2lkL3Jvb211aWtpdF9vdmVydmlldy5odG1sJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dDogJ2lPUycsXHJcbiAgICAgICAgICAgIGljb246ICcvaWNvbi1pT1Muc3ZnJyxcclxuICAgICAgICAgICAgbGluazogJy91aWtpdC9jaGF0cm9vbXVpa2l0L2lvcy9yb29tdWlraXRfb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdXZWInLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24td2ViLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvdWlraXQvY2hhdHJvb211aWtpdC93ZWIvcm9vbXVpa2l0X292ZXJ2aWV3Lmh0bWwnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnUmVhY3QgTmF0aXZlJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLVJlYWN0TmF0aXZlLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvdWlraXQvY2hhdHJvb211aWtpdC9yZWFjdC1uYXRpdmUvcm9vbXVpa2l0X292ZXJ2aWV3Lmh0bWwnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnRmx1dHRlcicsXHJcbiAgICAgICAgICAgIGljb246ICcvaWNvbi1mbHV0dGVyLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvdWlraXQvY2hhdHJvb211aWtpdC9mbHV0dGVyL3Jvb211aWtpdF9vdmVydmlldy5odG1sJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ0NhbGxLaXQnLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdBbmRyb2lkJyxcclxuICAgICAgICBpY29uOiAnL2ljb24tQW5kcm9pZC5zdmcnLFxyXG4gICAgICAgIGxpbms6ICcvY2FsbGtpdC9hbmRyb2lkL3Byb2R1Y3Rfb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdpT1MnLFxyXG4gICAgICAgIGljb246ICcvaWNvbi1pT1Muc3ZnJyxcclxuICAgICAgICBsaW5rOiAnL2NhbGxraXQvaW9zL3Byb2R1Y3Rfb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdXZWInLFxyXG4gICAgICAgIGljb246ICcvaWNvbi13ZWIuc3ZnJyxcclxuICAgICAgICBsaW5rOiAnL2NhbGxraXQvd2ViL3Byb2R1Y3Rfb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdTREsvUkVTVCBcdTk2QzZcdTYyMTAnLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdcdTVFNzNcdTUzRjAnLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdBbmRyb2lkJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLUFuZHJvaWQuc3ZnJyxcclxuICAgICAgICAgICAgbGluazogJy9kb2N1bWVudC9hbmRyb2lkL3F1aWNrc3RhcnQuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdpT1MnLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24taU9TLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvZG9jdW1lbnQvaW9zL3F1aWNrc3RhcnQuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdXZWInLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24td2ViLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvZG9jdW1lbnQvd2ViL3F1aWNrc3RhcnQuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdIYXJtb255T1MnLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24taGFybW9ueW9zLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvZG9jdW1lbnQvaGFybW9ueW9zL3F1aWNrc3RhcnQuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdXaW5kb3dzJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLXdpbmRvd3Muc3ZnJyxcclxuICAgICAgICAgICAgbGluazogJy9kb2N1bWVudC93aW5kb3dzL3F1aWNrc3RhcnQuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1Njg0Nlx1NjdCNicsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dDogJ1JlYWN0IE5hdGl2ZScsXHJcbiAgICAgICAgICAgIGljb246ICcvaWNvbi1SZWFjdE5hdGl2ZS5zdmcnLFxyXG4gICAgICAgICAgICBsaW5rOiAnL2RvY3VtZW50L3JlYWN0LW5hdGl2ZS9xdWlja3N0YXJ0Lmh0bWwnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnRmx1dHRlcicsXHJcbiAgICAgICAgICAgIGljb246ICcvaWNvbi1mbHV0dGVyLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvZG9jdW1lbnQvZmx1dHRlci9xdWlja3N0YXJ0Lmh0bWwnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnVW5pdHknLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24tdW5pdHkuc3ZnJyxcclxuICAgICAgICAgICAgbGluazogJy9kb2N1bWVudC91bml0eS9xdWlja3N0YXJ0Lmh0bWwnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnXHU1QzBGXHU3QTBCXHU1RThGJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLW1pbmktcHJvZ3JhbS5zdmcnLFxyXG4gICAgICAgICAgICBsaW5rOiAnL2RvY3VtZW50L2FwcGxldC9vdmVydmlldy5odG1sJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dDogJ3VuaS1hcHAnLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24tdW5pLWFwcC5zdmcnLFxyXG4gICAgICAgICAgICBsaW5rOiAnL2RvY3VtZW50L2FwcGxldC91bmlhcHAuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1NjcwRFx1NTJBMVx1N0FFRicsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dDogJ1JFU1QgQVBJJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLXBsYXRmb3JtLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvZG9jdW1lbnQvc2VydmVyLXNpZGUvb3ZlcnZpZXcuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdKYXZhJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLXBsYXRmb3JtLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICcvZG9jdW1lbnQvc2VydmVyLXNpZGUvamF2YV9zZXJ2ZXJfc2RrXzIuMC5odG1sJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ0FQSSBcdTUzQzJcdTgwMDMnLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdcdTVFNzNcdTUzRjAnLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdBbmRyb2lkJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLUFuZHJvaWQuc3ZnJyxcclxuICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZG9jLmVhc2Vtb2IuY29tL2FwaWRvYy9hbmRyb2lkL2NoYXQzLjAvYW5ub3RhdGVkLmh0bWwnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnaU9TJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLWlPUy5zdmcnLFxyXG4gICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9kb2MuZWFzZW1vYi5jb20vYXBpZG9jL2lvcy9jaGF0My4wL2Fubm90YXRlZC5odG1sJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dDogJ1dlYi9cdTVDMEZcdTdBMEJcdTVFOEYnLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24td2ViLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICdodHRwczovL2RvYy5lYXNlbW9iLmNvbS9qc2RvYy9pbmRleC5odG1sJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dDogJ0hhcm1vbnlPUycsXHJcbiAgICAgICAgICAgIGljb246ICcvaWNvbi1oYXJtb255b3Muc3ZnJyxcclxuICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZG9jLmVhc2Vtb2IuY29tL2FwaWRvYy9oYXJtb255L2NoYXQzLjAvY2xhc3Nlcy9DaGF0Q2xpZW50LkNoYXRDbGllbnQuaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdXaW5kb3dzJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLXdpbmRvd3Muc3ZnJyxcclxuICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZG9jLmVhc2Vtb2IuY29tL2FwaWRvYy91bml0eS9hbm5vdGF0ZWQuaHRtbCdcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiAnXHU2ODQ2XHU2N0I2JyxcclxuICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnUmVhY3QgTmF0aXZlJyxcclxuICAgICAgICAgICAgaWNvbjogJy9pY29uLVJlYWN0TmF0aXZlLnN2ZycsXHJcbiAgICAgICAgICAgIGxpbms6ICdodHRwczovL2RvYy5lYXNlbW9iLmNvbS9hcGlkb2Mvcm4vbW9kdWxlcy5odG1sJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dDogJ0ZsdXR0ZXInLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24tZmx1dHRlci5zdmcnLFxyXG4gICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9kb2MuZWFzZW1vYi5jb20vYXBpZG9jL2ZsdXR0ZXIvaW5kZXguaHRtbCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdVbml0eScsXHJcbiAgICAgICAgICAgIGljb246ICcvaWNvbi11bml0eS5zdmcnLFxyXG4gICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9kb2MuZWFzZW1vYi5jb20vYXBpZG9jL3VuaXR5L2Fubm90YXRlZC5odG1sJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiAnXHU2NzBEXHU1MkExXHU3QUVGJyxcclxuICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnSmF2YSAxLjAnLFxyXG4gICAgICAgICAgICBpY29uOiAnL2ljb24tcGxhdGZvcm0uc3ZnJyxcclxuICAgICAgICAgICAgbGluazogJ2h0dHBzOi8vZWFzZW1vYi5naXRodWIuaW8vZWFzZW1vYi1pbS1zZXJ2ZXItc2RrLydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdKYXZhIDIuMCcsXHJcbiAgICAgICAgICAgIGljb246ICcvaWNvbi1wbGF0Zm9ybS5zdmcnLFxyXG4gICAgICAgICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2Vhc2Vtb2IvZWFzZW1vYi1pbS1zZXJ2ZXItc2RrL3RyZWUvbWFzdGVyX2phdmFfMi4wL3NyYy90ZXN0L2phdmEvY29tL2Vhc2Vtb2IvaW0vYXBpJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAvLyB0ZXh0OiAnUEhQJyxcclxuICAgICAgICAgICAgLy8gaWNvbjogJy9pY29uLXBsYXRmb3JtLnN2ZycsXHJcbiAgICAgICAgICAgIC8vIGxpbms6ICdodHRwczovL2Vhc2Vtb2IuZ2l0aHViLmlvL2ltLXBocC1zZXJ2ZXItc2RrL2Fubm90YXRlZC5odG1sJ1xyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NTM3M1x1NjVGNlx1NjNBOFx1OTAwMScsXHJcbiAgICBsaW5rOiAnL3B1c2gvcHVzaF9vdmVydmlldy5odG1sJ1xyXG4gIH0sXHJcbiAgLy8ge1xyXG4gIC8vICAgdGV4dDogXCJcdTc5QzFcdTY3MDlcdTkwRThcdTdGNzJcIixcclxuICAvLyAgIGNoaWxkcmVuOiBbXHJcbiAgLy8gICAgIHtcclxuICAvLyAgICAgICB0ZXh0OiBcIlx1NTM3M1x1NjVGNlx1OTAxQVx1OEJBRlwiLFxyXG4gIC8vICAgICAgIGxpbms6IFwiL3ByaXZhdGUvaW0vdWNfZGVwbG95Lmh0bWxcIixcclxuICAvLyAgICAgfSxcclxuICAvLyAgICB7XHJcbiAgLy8gICAgICB0ZXh0OiBcIlx1OTdGM1x1ODlDNlx1OTg5MVwiLFxyXG4gIC8vICAgICAgbGluazogXCIvcHJpdmF0ZS9tZWRpYS9jb21tb25faW50cm9kdWN0aW9uLmh0bWxcIixcclxuICAvLyAgICB9LFxyXG4gIC8vICBdLFxyXG4gIC8vIH0sXHJcbiAgeyB0ZXh0OiAnXHU1Mzg2XHU1M0YyXHU3MjQ4XHU2NzJDJywgbGluazogJ2h0dHBzOi8vZG9jcy1pbS5lYXNlbW9iLmNvbS9jY2ltL2ludHJvJyB9LFxyXG4gIC8vIHsgdGV4dDogJ1x1NjcwOVx1NTk1Nlx1OEMwM1x1NzgxNCcsIGxpbms6ICdodHRwczovL2RvYy5lYXNlbW9iLmNvbS9mb3JtL3dqeC5odG1sJyB9XHJcbl0pXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDovRWFzZW1vYi9HaXRodWJfTGlicmFyeV9TdW1tYXJ5L2Vhc2Vtb2JfZG9jL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEVhc2Vtb2JcXFxcR2l0aHViX0xpYnJhcnlfU3VtbWFyeVxcXFxlYXNlbW9iX2RvY1xcXFxkb2NzXFxcXC52dWVwcmVzc1xcXFxzaWRlYmFyXFxcXGluZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9FYXNlbW9iL0dpdGh1Yl9MaWJyYXJ5X1N1bW1hcnkvZWFzZW1vYl9kb2MvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9pbmRleC50c1wiO2ltcG9ydCB7IHNpZGViYXIgfSBmcm9tIFwidnVlcHJlc3MtdGhlbWUtaG9wZVwiO1xyXG5pbXBvcnQgeyBET0NfU0lERUJBUiB9IGZyb20gXCIuL2RvY3VtZW50XCI7XHJcbmltcG9ydCB7IENIQVRfVUlLSVRfU0lERUJBUiwgQ0hBVFJPT01fVUlLSVRfU0lERUJBUiB9IGZyb20gXCIuL3Vpa2l0XCI7XHJcbmltcG9ydCB7IFBSSVZBVEVfSU1fU0lERUJBUiwgUFJJVkFURV9NRURJQV9TSURFQkFSIH0gZnJvbSBcIi4vcHJpdmF0ZVwiO1xyXG5pbXBvcnQgeyBDQUxMX0tJVF9TSURFQkFSIH0gZnJvbSBcIi4vY2FsbGtpdFwiO1xyXG5pbXBvcnQgeyBQVVNIX1NJREVCQVIgfSBmcm9tIFwiLi9wdXNoXCI7XHJcblxyXG5leHBvcnQgY29uc3QgemhTaWRlYmFyID0gc2lkZWJhcih7XHJcbiAgXCIvcHJvZHVjdC9cIjogW1xyXG4gICAgeyB0ZXh0OiBcIlx1NEVBN1x1NTRDMVx1NTJBOFx1NjAwMVwiLCBsaW5rOiBcInByb2R1Y3RfZHluYW1pY3MuaHRtbFwiIH0sXHJcbiAgICB7XHJcbiAgICAgIC8qXHJcbiAgICAgICAgdGV4dDogXHU1MjA2XHU3RUM0XHU2ODA3XHU5ODk4XHJcbiAgICAgICAgY2hpbGRyZW46IFx1NTIwNlx1N0VDNFx1NUJGQ1x1ODIyQVx1NTIxN1x1ODg2OFxyXG4gICAgICAgICAgdGV4dDogXHU2NjNFXHU3OTNBXHU3Njg0XHU2NTg3XHU2NzJDXHJcbiAgICAgICAgICBsaW5rOiBcdTk0RkVcdTYzQTVcdTU3MzBcdTU3NDBcclxuICAgICAgICAgIHNob3c6IFx1NEUwRFx1NUI1OFx1NTcyOFx1NjIxNlx1ODAwNVx1NTAzQ1x1NEUzQSB0cnVlIFx1NjVGNlx1RkYwQ1x1ODNEQ1x1NTM1NVx1NjYzRVx1NzkzQVx1RkYxQlx1NUI1OFx1NTcyOFx1NUU3Nlx1NEUxNFx1NTAzQ1x1NEUzQSBmYWxzZSBcdTY1RjZcdUZGMENcdTgzRENcdTUzNTVcdTRFMERcdTY2M0VcdTc5M0FcclxuICAgICAgICAgIGNvbGxhcHNpYmxlOiBcdTVCNTBcdTgzRENcdTUzNTVcdTY2MkZcdTU0MjZcdTUxNDFcdThCQjhcdTVDNTVcdTVGMDAvXHU2NTM2XHU4RDc3XHVGRjBDdHJ1ZTogXHU1MTQxXHU4QkI4OyBmYWxzZTogXHU0RTBEXHU1MTQxXHU4QkI4XHUzMDAyXHU4QkY3XHU1M0MyXHU4MDAzXHUzMDBDXHU1QjUwXHU4M0RDXHU1MzU1XHU3OTNBXHU0RjhCXHUzMDBEXHJcbiAgICAgICAgICBjaGlsZHJlbjogXHU1QjUwXHU4M0RDXHU1MzU1XHUzMDAyXHU4QkY3XHU1M0MyXHU4MDAzXHUzMDBDXHU1QjUwXHU4M0RDXHU1MzU1XHU3OTNBXHU0RjhCXHUzMDBEXHJcbiAgICAgICovXHJcbiAgICAgIHRleHQ6IFwiXHU0RUE3XHU1NEMxXHU3QjgwXHU0RUNCXCIsXHJcbiAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgIHsgdGV4dDogXCJcdTRFQTdcdTU0QzFcdTY5ODJcdThGRjBcIiwgbGluazogXCJpbnRyb2R1Y3Rpb24uaHRtbFwiIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NUU5NFx1NzUyOFx1NTczQVx1NjY2RlwiLCBsaW5rOiBcImFwcGxpY2F0aW9uX3NjZW5hcmlvLmh0bWxcIiB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJcdTUyOUZcdTgwRkRcdTRFQ0JcdTdFQ0RcIiwgXHJcbiAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgIHsgdGV4dDogXCJcdTUyOUZcdTgwRkRcdTUyMTdcdTg4NjhcIiwgbGluazogXCJwcm9kdWN0X2Z1bmN0aW9uLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgIHsgdGV4dDogXCJcdTUyOUZcdTgwRkRcdThCRTZcdTYwQzVcIiwgbGluazogXCJjb252ZXJzYXRpb25fZnVuY3Rpb24uaHRtbFwiIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJcdThEMjZcdTUzRjdcdTdDRkJcdTdFREZcIiwgXHJcbiAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJcdTc1MjhcdTYyMzdcdTZDRThcdTUxOENcdTRFMEVcdTc2N0JcdTVGNTVcIiwgbGluazogXCJwcm9kdWN0X3VzZXJfcmVnaXN0cmF0aW9uX2xvZ2luLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHU1NzI4XHU3RUJGXHU3MkI2XHU2MDAxXHU3QkExXHU3NDA2XCIsIGxpbms6IFwicHJvZHVjdF91c2VyX3ByZXNlbmNlLmh0bWxcIiB9LFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJcdTc1MjhcdTYyMzdcdTVDNUVcdTYwMjdcdTRFMEVcdTc1MjhcdTYyMzdcdTUxNzNcdTdDRkJcIiwgXHJcbiAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJcdTc1MjhcdTYyMzdcdTVDNUVcdTYwMjdcIiwgbGluazogXCJwcm9kdWN0X3VzZXJfYXR0cmlidXRlLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHU3NTI4XHU2MjM3XHU1MTczXHU3Q0ZCXCIsIGxpbms6IFwicHJvZHVjdF91c2VyX3JlbGF0aW9uc2hpcC5odG1sXCIgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7IHRleHQ6IFwiXHU2RDg4XHU2MDZGXHU3QkExXHU3NDA2XCIsIFxyXG4gICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHU1MzU1XHU4MDRBXHU2RDg4XHU2MDZGXCIsIGxpbms6IFwibWVzc2FnZV9zaW5nbGVfY2hhdC5odG1sXCIgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiBcIlx1N0ZBNFx1N0VDNFx1NkQ4OFx1NjA2RlwiLCBsaW5rOiBcIm1lc3NhZ2VfZ3JvdXAuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJcdTgwNEFcdTU5MjlcdTVCQTRcdTZEODhcdTYwNkZcIiwgbGluazogXCJtZXNzYWdlX2NoYXRyb29tLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHU2RDg4XHU2MDZGXHU1QjU4XHU1MEE4XCIsIGxpbms6IFwibWVzc2FnZV9zdG9yZS5odG1sXCIgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NkQ4OFx1NjA2Rlx1NjgzQ1x1NUYwRlwiLCBsaW5rOiBcInByb2R1Y3RfbWVzc2FnZV9mb3JtYXQuaHRtbFwiIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NzlCQlx1N0VCRlx1NjNBOFx1OTAwMVwiLCBsaW5rOiBcInByb2R1Y3Rfb2ZmbGluZV9wdXNoX292ZXJ2aWV3Lmh0bWxcIiB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJcdTdGQTRcdTdFQzRcdTdCQTFcdTc0MDZcIiwgXHJcbiAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJcdTdGQTRcdTdFQzRcdTY5ODJcdThGRjBcIiwgbGluazogXCJwcm9kdWN0X2dyb3VwX292ZXJ2aWV3Lmh0bWxcIiB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHU1QjUwXHU1MzNBXCIsIGxpbms6IFwicHJvZHVjdF90aHJlYWRfb3ZlcnZpZXcuaHRtbFwiIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1ODA0QVx1NTkyOVx1NUJBNFwiLCBsaW5rOiBcInByb2R1Y3RfY2hhdHJvb21fb3ZlcnZpZXcuaHRtbFwiIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NTE4NVx1NUJCOVx1NUJBMVx1NjgzOFwiLCBsaW5rOiBcIm1vZGVyYXRpb25fb3ZlcnZpZXcuaHRtbFwiIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NEY3Rlx1NzUyOFx1OTY1MFx1NTIzNlwiLCBcclxuICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NTI5Rlx1ODBGRFx1OTY1MFx1NTIzNlwiLCBsaW5rOiBcImxpbWl0YXRpb24uaHRtbFwiIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJSRVNUZnVsIFx1NjNBNVx1NTNFM1x1OTg5MVx1NzM4N1x1OTY1MFx1NTIzNlwiLCBsaW5rOiBcImxpbWl0YXRpb25hcGkuaHRtbFwiIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NjU3MFx1NjM2RVx1NEUyRFx1NUZDM1wiLCBcclxuICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NjU3MFx1NjM2RVx1NEUyRFx1NUZDM1wiLCBsaW5rOiBcImRhdGFfY2VudGVyLmh0bWxcIiB9LFxyXG4gICAgICAgICAgXSwgXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICB7IHRleHQ6IFwiXHU4RDJEXHU0RTcwXHU2MzA3XHU1MzU3XCIsIFxyXG4gICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICB7IHRleHQ6IFwiXHU4QkExXHU4RDM5XHU3QjU2XHU3NTY1XCIsIGxpbms6IFwicHJpY2luZ19wb2xpY3kuaHRtbFwifSxcclxuICAgICAgICB7IHRleHQ6IFwiXHU1OTU3XHU5OTEwXHU1MzA1XHU1MjlGXHU4MEZEXHU1QkY5XHU2QkQ0XCIsIGxpbms6IFwicHJvZHVjdF9wYWNrYWdlX2ZlYXR1cmUuaHRtbFwifSxcclxuICAgICAgICB7IHRleHQ6IFwiXHU4RDJEXHU0RTcwXHU2MzA3XHU1RjE1XCIsIGxpbms6IFwicHJpY2luZ19tZXRob2QuaHRtbFwiIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9LCBcclxuICAgIC8vIHtcclxuICAgIC8vICAgdGV4dDogXCJEZW1vXCIsXHJcbiAgICAvLyAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgLy8gICBjaGlsZHJlbjogW1xyXG4gICAgLy8gICAgIHsgdGV4dDogXCJcdTRGNTNcdTlBOEMgRGVtb1wiLCBsaW5rOiBcImRlbW8uaHRtbFwiIH0sXHJcbiAgICAvLyAgIF0sXHJcbiAgICAvLyB9LFxyXG4gICAge1xyXG4gICAgICB0ZXh0OiBcIlx1NTg5RVx1NTAzQ1x1NjcwRFx1NTJBMVwiLFxyXG4gICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgIHtcclxuICAgICAgdGV4dDogXCJcdTZEODhcdTYwNkZcdTdGRkJcdThCRDFcIixcclxuICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgeyB0ZXh0OiBcIkFuZHJvaWRcIiwgbGluazogXCJtZXNzYWdlX3RyYW5zbGF0aW9uX2FuZHJvaWQuaHRtbFwiIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcImlPU1wiLCBsaW5rOiBcIm1lc3NhZ2VfdHJhbnNsYXRpb25faW9zLmh0bWxcIiB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJXZWJcIiwgbGluazogXCJtZXNzYWdlX3RyYW5zbGF0aW9uX3dlYi5odG1sXCIgfSxcclxuICAgICAgICB7IHRleHQ6IFwiXHU1QzBGXHU3QTBCXHU1RThGXCIsIGxpbms6IFwibWVzc2FnZV90cmFuc2xhdGlvbl9hcHBsZXQuaHRtbFwiIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIkZsdXR0ZXJcIiwgbGluazogXCJtZXNzYWdlX3RyYW5zbGF0aW9uX2ZsdXR0ZXIuaHRtbFwiIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlJlYWN0IE5hdGl2ZVwiLCBsaW5rOiBcIm1lc3NhZ2VfdHJhbnNsYXRpb25fcmVhY3QtbmF0aXZlLmh0bWxcIiB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJVbml0eVwiLCBsaW5rOiBcIm1lc3NhZ2VfdHJhbnNsYXRpb25fdW5pdHkuaHRtbFwiIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIldpbmRvd3NcIiwgbGluazogXCJtZXNzYWdlX3RyYW5zbGF0aW9uX3dpbmRvd3MuaHRtbFwiIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9LCBcclxuICAgICAgeyB0ZXh0OiBcIlx1NTE4NVx1NUJCOVx1NUJBMVx1NjgzOFwiLFxyXG4gICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiBcIlx1NEVBN1x1NTRDMVx1N0I4MFx1NEVDQlwiLFxyXG4gICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHU0RUE3XHU1NEMxXHU2OTgyXHU4RkYwXCIsIGxpbms6IFwibW9kZXJhdGlvbi9tb2RlcmF0aW9uX292ZXJ2aWV3Lmh0bWxcIiB9LFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IFwiXHU0RUE3XHU1NEMxXHU1QjlBXHU0RUY3XCIsXHJcbiAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlx1NTZGRFx1NTE4NVx1OEJBMVx1OEQzOVx1OEJGNFx1NjYwRVwiLFxyXG4gICAgICAgICAgICAgIGxpbms6IFwibW9kZXJhdGlvbi9tb2RlcmF0aW9uX2JpbGxpbmdfZG9tZXN0aWMuaHRtbFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJcdTZENzdcdTU5MTZcdThCQTFcdThEMzlcdThCRjRcdTY2MEVcIixcclxuICAgICAgICAgICAgICBsaW5rOiBcIm1vZGVyYXRpb24vbW9kZXJhdGlvbl9iaWxsaW5nX292ZXJzZWFzLmh0bWxcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiBcIlx1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQlwiLFxyXG4gICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHU1RjAwXHU5MDFBXHU1QkExXHU2ODM4XHU2NzBEXHU1MkExXCIsIGxpbms6IFwibW9kZXJhdGlvbi9tb2RlcmF0aW9uX2VuYWJsZS5odG1sXCIgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiXHU4OUM0XHU1MjE5XHU5MTREXHU3RjZFXCIsXHJcbiAgICAgICAgICAgICAgbGluazogXCJtb2RlcmF0aW9uL21vZGVyYXRpb25fcnVsZV9jb25maWcuaHRtbFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHU4OUM0XHU1MjE5XHU2RDRCXHU4QkQ1XCIsIGxpbms6IFwibW9kZXJhdGlvbi9tb2RlcmF0aW9uX3J1bGVfdGVzdC5odG1sXCIgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVwiLCBsaW5rOiBcIm1vZGVyYXRpb24vbW9kZXJhdGlvbl9oaXN0b3J5Lmh0bWxcIiB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHU1MTczXHU5NTJFXHU4QkNEXHU1QkExXHU2ODM4XCIsIGxpbms6IFwibW9kZXJhdGlvbi9rZXl3b3JkX3Jldmlldy5odG1sXCIgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiXHU2RDg4XHU2MDZGXHU1QkExXHU2ODM4XHU2NzNBXHU1MjM2XCIsXHJcbiAgICAgICAgICAgICAgbGluazogXCJtb2RlcmF0aW9uL21vZGVyYXRpb25fbWVjaGFuaXNtLmh0bWxcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiBcIlx1OEZEQlx1OTYzNlx1NTI5Rlx1ODBGRFwiLFxyXG4gICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJcdTVCQTFcdTY4MzhcdThCQjBcdTVGNTVcdTU2REVcdThDMDNcIixcclxuICAgICAgICAgICAgICBsaW5rOiBcIm1vZGVyYXRpb24vbW9kZXJhdGlvbl9yZWNvcmRfY2FsbGJhY2suaHRtbFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJcdTZEODhcdTYwNkZcdTRFQkFcdTVERTVcdTVCQTFcdTY4MzhcIixcclxuICAgICAgICAgICAgICBsaW5rOiBcIm1vZGVyYXRpb24vbW9kZXJhdGlvbl9tYW51YWxfcmV2aWV3Lmh0bWxcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NzUyOFx1NjIzN1x1N0JBMVx1NzQwNlwiLCBsaW5rOiBcIm1vZGVyYXRpb24vbW9kZXJhdGlvbl91c2VybWdtdC5odG1sXCIgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICAgXSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRleHQ6IFwiXHU1RTM4XHU4OUMxXHU2NUI5XHU2ODQ4XCIsXHJcbiAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgIHsgdGV4dDogXCJcdTdGQTQgQCBcdTZEODhcdTYwNkZcIiwgbGluazogXCJzb2x1dGlvbl9jb21tb24vZ3JvdXBfQC5odG1sXCIgfSxcclxuICAgICAgICB7IHRleHQ6IFwiXHU2RDg4XHU2MDZGXHU1RjE1XHU3NTI4XCIsIGxpbms6IFwic29sdXRpb25fY29tbW9uL21lc3NhZ2VfcXVvdGUuaHRtbFwiIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NUI5RVx1NzNCMFx1OEY5M1x1NTE2NVx1NjMwN1x1NzkzQVx1NTY2OFwiLCBsaW5rOiBcInNvbHV0aW9uX2NvbW1vbi90eXBpbmdfaW5kaWNhdGlvbi5odG1sXCIgfSxcclxuICAgICAgICB7IHRleHQ6IFwiXHU4RkMxXHU3OUZCXHU1MjMwXHU3M0FGXHU0RkUxXCIsIGxpbms6IFwic29sdXRpb25fY29tbW9uL21pZ3JhdGVfdG9fZWFzZW1vYi5odG1sXCIgfSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRleHQ6IFwiXHU1RTJFXHU1MkE5XHU0RTJEXHU1RkMzXCIsXHJcbiAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICBjaGlsZHJlbjogW1xyXG4gICAgICB7XHJcbiAgICAgIHRleHQ6IFwiRkFRXCIsXHJcbiAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgIHsgdGV4dDogXCJGQVEgXHU4RDI4XHU5MUNGXCIsIGxpbms6IFwiZmFxX3F1YWxpdHlfaXNzdWVzLmh0bWxcIiB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJGQVEgXHU5NkM2XHU2MjEwXCIsIGxpbms6IFwiZmFxX2ludGVncmF0aW9uX2lzc3Vlcy5odG1sXCIgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU4MDU0XHU3Q0ZCXHU2MjExXHU0RUVDXCIsIGxpbms6IFwiaGVscC5odG1sXCIgfSxcclxuICAgICBdLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgdGV4dDogXCJcdTVCODlcdTUxNjhcIixcclxuICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NUI4OVx1NTE2OFx1NjcwMFx1NEY3M1x1NUI5RVx1OERGNVwiLCBsaW5rOiBcInNlY3VyaXR5X2Jlc3RfcHJhY3RpY2VzLmh0bWxcIiB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJHRFBSIFx1NUI4OVx1NTE2OFx1NTQwOFx1ODlDNFwiLCBsaW5rOiBcIkdEUFIuaHRtbFwiIH0sXHJcbiAgICAgICAge3RleHQ6IFwiU0RLXHU1NDA4XHU4OUM0XHU0RjdGXHU3NTI4XHU4QkY0XHU2NjBFXCIsIGxpbms6XCJodHRwczovL3d3dy5lYXNlbW9iLmNvbS9uZXdzL3ByaXZhY3lcIn1cclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRleHQ6IFwiQ29uc29sZSBcdTYzMDdcdTUzNTdcdUZGMDhcdTY1QjBcdUZGMDlcIixcclxuICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NkNFOFx1NTE4Q1x1OEQyNlx1NTNGN1wiLCBsaW5rOiBcImNvbnNvbGUvYWNjb3VudF9yZWdpc3Rlci5odG1sXCIgfSxcclxuICAgICAgICB7IHRleHQ6IFwiXHU1QjlFXHU1NDBEXHU4QkE0XHU4QkMxXCIsIGxpbms6IFwiY29uc29sZS9yZWFsX25hbWVfYXV0aGVudGljYXRpb24uaHRtbFwiIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NUU5NFx1NzUyOFx1N0JBMVx1NzQwNlwiLCBcclxuICAgICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJcdTUyMUJcdTVFRkFcdTVFOTRcdTc1MjhcIiwgbGluazogXCJjb25zb2xlL2FwcF9jcmVhdGUuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJcdTY3RTVcdTc3MEJcdTU0OENcdTkxNERcdTdGNkVcdTVFOTRcdTc1MjhcIiwgbGluazogXCJjb25zb2xlL2FwcF9tYW5hZ2UuaHRtbFwiIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NjcwRFx1NTJBMVx1NUYwMFx1OTAxQVwiLCBcclxuICAgICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJcdThEMkRcdTRFNzBcdTU5NTdcdTk5MTBcdTUzMDVcIiwgbGluazogXCJjb25zb2xlL3B1cmNoYXNlX3BhY2thZ2UuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJcdTVGMDBcdTkwMUFcdTU4OUVcdTUwM0NcdTY3MERcdTUyQTFcIiwgbGluazogXCJjb25zb2xlL3B1cmNoYXNlX3ZhbHVlX2FkZGVkLmh0bWxcIiB9LFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJcdTUyOUZcdTgwRkRcdTkxNERcdTdGNkVcIiwgXHJcbiAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICB0ZXh0OiBcIlx1OTE0RFx1N0Y2RVx1NTdGQVx1Nzg0MFx1NTI5Rlx1ODBGRFwiLFxyXG4gICAgICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NzUyOFx1NjIzN1wiLCBsaW5rOiBcImNvbnNvbGUvYmFzaWNfdXNlci5odG1sXCIgfSxcclxuICAgICAgICAgICAgIHsgdGV4dDogXCJcdTZEODhcdTYwNkZcIiwgbGluazogXCJjb25zb2xlL2Jhc2ljX21lc3NhZ2UuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICB7IHRleHQ6IFwiXHU0RjFBXHU4QkREL1x1N0ZBNFx1N0VDNC9cdTgwNEFcdTU5MjlcdTVCQTRcIiwgbGluazogXCJjb25zb2xlL2Jhc2ljX2NvbnZlcnNhdGlvbl9ncm91cF9jaGF0cm9vbS5odG1sXCIgfSxcclxuICAgICAgICAgICAgIHsgdGV4dDogXCJcdTZEODhcdTYwNkZcdTU2REVcdThDMDNcIiwgbGluazogXCJjb25zb2xlL2Jhc2ljX3dlYmhvb2suaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICB7IHRleHQ6IFwiXHU1MTc2XHU0RUQ2XCIsIGxpbms6IFwiY29uc29sZS9iYXNpY19vdGhlci5odG1sXCIgfSxcclxuICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgIHRleHQ6IFwiXHU5MTREXHU3RjZFXHU1ODlFXHU1MDNDXHU1MjlGXHU4MEZEXCIsXHJcbiAgICAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICB0ZXh0OiBcIlx1NTE4NVx1NUJCOVx1NUJBMVx1NjgzOFwiLFxyXG4gICAgICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NjU3MFx1NjM2RVx1NjAzQlx1ODlDOFwiLCBsaW5rOiBcImNvbnNvbGUvbW9kZXJhdGlvbl9kYXRhX292ZXJ2aWV3Lmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1ODlDNFx1NTIxOVx1OTE0RFx1N0Y2RVwiLCBsaW5rOiBcImNvbnNvbGUvbW9kZXJhdGlvbl9ydWxlX2NvbmZpZy5odG1sXCIgfSxcclxuICAgICAgICAgICAgIHsgdGV4dDogXCJcdTg5QzRcdTUyMTlcdTZENEJcdThCRDVcIiwgbGluazogXCJjb25zb2xlL21vZGVyYXRpb25fcnVsZV90ZXN0Lmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NTM4Nlx1NTNGMlx1OEJCMFx1NUY1NVwiLCBsaW5rOiBcImNvbnNvbGUvbW9kZXJhdGlvbl9oaXN0b3J5Lmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NTE3M1x1OTUyRVx1OEJDRFx1NTQwRFx1NTM1NVwiLCBsaW5rOiBcImNvbnNvbGUvbW9kZXJhdGlvbl9rZXl3b3JkLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NUJBMVx1NjgzOFx1OEJCMFx1NUY1NVx1NUJGQ1x1NTFGQVwiLCBsaW5rOiBcImNvbnNvbGUvbW9kZXJhdGlvbl9oaXN0b3J5X2V4cG9ydC5odG1sXCIgfSxcclxuICAgICAgICAgICAgIHsgdGV4dDogXCJcdTZEODhcdTYwNkZcdTRFM0VcdTYyQTVcIiwgbGluazogXCJjb25zb2xlL21vZGVyYXRpb25fbWVzc2FnZV9yZXBvcnQuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICB7IHRleHQ6IFwiXHU2ODA3XHU3QjdFXHU3QkExXHU3NDA2XCIsIGxpbms6IFwiY29uc29sZS9tb2RlcmF0aW9uX3VzZXJfdGFnLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgIHRleHQ6IFwiXHU1MzczXHU2NUY2XHU2M0E4XHU5MDAxXCIsXHJcbiAgICAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICB7IHRleHQ6IFwiXHU3NTI4XHU2MjM3XHU3QkExXHU3NDA2XCIsIGxpbms6IFwiY29uc29sZS9wdXNoX3VzZXIuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICB7IHRleHQ6IFwiXHU4QkMxXHU0RTY2XHU3QkExXHU3NDA2XCIsIGxpbms6IFwiY29uc29sZS9wdXNoX2NlcnRpZmljYXRlX2NvbmZpZy5odG1sXCIgfSxcclxuICAgICAgICAgICAgIHsgdGV4dDogXCJcdTZBMjFcdTY3N0ZcdTdCQTFcdTc0MDZcIiwgbGluazogXCJjb25zb2xlL3B1c2hfdGVtcGxhdGUuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICB7IHRleHQ6IFwiXHU1MjFCXHU1RUZBXHU2M0E4XHU5MDAxXCIsIGxpbms6IFwiY29uc29sZS9wdXNoX3Rhc2tfY3JlYXRlLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NjNBOFx1OTAwMVx1NEVGQlx1NTJBMVwiLCBsaW5rOiBcImNvbnNvbGUvcHVzaF90YXNrLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NjgwN1x1N0I3RVx1N0JBMVx1NzQwNlwiLCBsaW5rOiBcImNvbnNvbGUvcHVzaF90YWdfbWdtdC5odG1sXCIgfSxcclxuICAgICAgICAgICAgIHsgdGV4dDogXCJcdTYzQThcdTkwMDFcdTdFREZcdThCQTFcIiwgbGluazogXCJjb25zb2xlL3B1c2hfc3RhdGlzdGljcy5odG1sXCIgfSxcclxuICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJcdThEMjZcdTUzRjdcdTdCQTFcdTc0MDZcIiwgXHJcbiAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHU0RkVFXHU2NTM5XHU4RDI2XHU2MjM3XHU0RkUxXHU2MDZGXCIsIGxpbms6IFwiY29uc29sZS9hY2NvdW50X21vZGlmeS5odG1sXCIgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NTIxQlx1NUVGQVx1NUI1MFx1OEQyNlx1NTNGN1wiLCBsaW5rOiBcImNvbnNvbGUvYWNjb3VudF9zdWJfY3JlYXRlLmh0bWxcIiB9LFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJcdThEMjZcdTUzNTVcdTRFMkRcdTVGQzNcIiwgbGluazogXCJjb25zb2xlL2FjY291bnRfY2VudGVyLmh0bWxcIiB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJcdThGRDBcdTg0MjVcdTdCQTFcdTc0MDZcIiwgXHJcbiAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICB0ZXh0OiBcIlx1OEZEMFx1ODQyNVx1NjRDRFx1NEY1Q1wiLFxyXG4gICAgICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NzUyOFx1NjIzN1x1N0JBMVx1NzQwNlwiLCBsaW5rOiBcImNvbnNvbGUvb3BlcmF0aW9uX3VzZXIuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICB7IHRleHQ6IFwiXHU3RkE0XHU3RUM0XHU3QkExXHU3NDA2XCIsIGxpbms6IFwiY29uc29sZS9vcGVyYXRpb25fZ3JvdXAuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICB7IHRleHQ6IFwiXHU4MDRBXHU1OTI5XHU1QkE0XHU3QkExXHU3NDA2XCIsIGxpbms6IFwiY29uc29sZS9vcGVyYXRpb25fY2hhdHJvb20uaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICB0ZXh0OiBcIlx1OEZEMFx1ODQyNVx1NjU3MFx1NjM2RVwiLFxyXG4gICAgICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NjU3MFx1NjM2RVx1NjdFNVx1OEJFMlwiLCBsaW5rOiBcImNvbnNvbGUvb3BlcmF0aW9uX2RhdGEuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICB7IHRleHQ6IFwiXHU2RDg4XHU2MDZGXHU5MUNGXHU3RURGXHU4QkExXCIsIGxpbms6IFwiY29uc29sZS9vcGVyYXRpb25fbWVzc2FnZV9zdGF0aXN0aWNzLmh0bWxcIiB9LCBcclxuICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgIHRleHQ6IFwiXHU5NUVFXHU5ODk4XHU2MzkyXHU2N0U1XCIsXHJcbiAgICAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICB7IHRleHQ6IFwiXHU4QkY3XHU2QzQyXHU4RDI4XHU5MUNGXHU3NkQxXHU2M0E3XCIsIGxpbms6IFwiY29uc29sZS9vcGVyYXRpb25fdHJvdWJsZXNob290aW5nX3JlcXVlc3RfcXVhbGl0eS5odG1sXCIgfSxcclxuICAgICAgICAgICAgIHsgdGV4dDogXCJcdTZEODhcdTYwNkZcdTYyOTVcdTkwMTJcdTY3RTVcdThCRTJcIiwgbGluazogXCJjb25zb2xlL29wZXJhdGlvbl90cm91Ymxlc2hvb3RpbmdfbWVzc2FnZV9kZWxpdmVyeS5odG1sXCIgfSxcclxuICAgICAgICAgICAgIHsgdGV4dDogXCJcdTc1MjhcdTYyMzdcdThGREVcdTYzQTVcdTcyQjZcdTYwMDFcdTY3RTVcdThCRTJcIiwgbGluazogXCJjb25zb2xlL29wZXJhdGlvbl90cm91Ymxlc2hvb3RpbmdfdXNlcl9jb25uZWN0aW9uLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NzUyOFx1NjIzN1x1OEJCRVx1NTkwN1x1NjVFNVx1NUZEN1wiLCBsaW5rOiBcImNvbnNvbGUvb3BlcmF0aW9uX3Ryb3VibGVzaG9vdGluZ19kZXZpY2VfbG9nLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgeyB0ZXh0OiBcIlx1ODA0QVx1NTkyOVx1NUJBNFx1NkQ4OFx1NjA2Rlx1OTAxRlx1NzM4N1wiLCBsaW5rOiBcImNvbnNvbGUvb3BlcmF0aW9uX3Ryb3VibGVzaG9vdGluZ19jaGF0cm9vbV9yYXRlLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRleHQ6IFwiQ29uc29sZSBcdTYzMDdcdTUzNTdcdUZGMDhcdTY1RTdcdUZGMDlcIixcclxuICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1NUYwMFx1OTAxQVx1NTQ4Q1x1OTE0RFx1N0Y2RVx1NjcwRFx1NTJBMVwiLCBsaW5rOiBcImVuYWJsZV9hbmRfY29uZmlndXJlX0lNLmh0bWxcIiB9LFxyXG4gICAgICAgIHsgdGV4dDogXCJcdTZEODhcdTYwNkZcdTkxQ0ZcdTdFREZcdThCQTFcIiwgbGluazogXCJtZXNzYWdlX3N0YXRpc3RpY3MuaHRtbFwiIH0sXHJcbiAgICAgICAgeyB0ZXh0OiBcIlx1OEJGN1x1NkM0Mlx1OEQyOFx1OTFDRlx1Njk4Mlx1ODlDOFwiLCBsaW5rOiBcInJlcXVlc3RfcXVhbGl0eV9vdmVydmlldy5odG1sXCIgfSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICB7IHRleHQ6IFwiXHU2NzJGXHU4QkVEXHU4ODY4XCIsIGxpbms6IFwiZ2xvc3NhcnkuaHRtbFwiIH0sXHJcbiAgICB7XHJcbiAgICAgIHRleHQ6IFwiXHU1REYyXHU1RTlGXHU1RjAzXHU1MTg1XHU1QkI5XCIsXHJcbiAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IFwiXHU3M0FGXHU0RkUxIEFJR0NcIixcclxuICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NjVCOVx1Njg0OFx1NEVDQlx1N0VDRFwiLCBsaW5rOiBcImFpZ2MvYWlnY19zY2VuYXJpb19pbnRyb2R1Y3Rpb24uaHRtbFwiIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJcdTY1QjlcdTY4NDhcdTkwMDlcdTYyRTlcIiwgbGluazogXCJhaWdjL2FpZ2Nfc2VsZWN0aW9uLmh0bWxcIiB9LFxyXG5cclxuICAgICAgICAgICAgeyBcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlx1NjVCOVx1Njg0OFx1NEUwMFwiLFxyXG4gICAgICAgICAgICAgIGNvbGxhcHNpYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NjcwRFx1NTJBMVx1N0FFRlx1OTE0RFx1N0Y2RVwiLCBsaW5rOiBcImFpZ2MvYWlnY19ydW5fdGhyb3VnaF9kZW1vX3NlcnZlci5odG1sXCIgfSxcclxuICAgICAgICAgICAgICAgIHsgdGV4dDogXCJcdTVCQTJcdTYyMzdcdTdBRUZcdTkxNERcdTdGNkVcIiwgbGluazogXCJhaWdjL2FpZ2NfcnVuX3Rocm91Z2hfZGVtb19jbGllbnQuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICAgXSwgXHJcbiAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICB7IFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiXHU2NUI5XHU2ODQ4XHU0RThDXCIsXHJcbiAgICAgICAgICAgICAgY29sbGFwc2libGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiXHU0RjdGXHU3NTI4IEFJIFx1NjY3QVx1ODBGRFx1NTI5Rlx1ODBGRFwiLCBsaW5rOiBcImFpZ2MvYWlnY191c2UuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiUkVTVCBBUElcIiwgbGluazogXCJhaWdjL2FpZ2NfcmVzdF9hcGkuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICAgICBdLCBcclxuICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICBdLCBcclxuICAgICAgICB9LCAgIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IFwiXHU4RDg1XHU3RUE3XHU3OTNFXHU1MzNBXCIsXHJcbiAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJcdTRFQTdcdTU0QzFcdTY5ODJcdThGRjBcIiwgbGluazogXCJjaXJjbGUvY2lyY2xlX292ZXJ2aWV3Lmh0bWxcIiB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJcdTVGRUJcdTkwMUZcdTVGMDBcdTU5Q0JcIixcclxuICAgICAgICAgICAgICBjb2xsYXBzaWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJBbmRyb2lkIFx1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQlwiLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiBcImNpcmNsZS9jaXJjbGVfcXVpY2tzdGFydF9hbmRyb2lkLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6IFwiaU9TIFx1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQlwiLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiBcImNpcmNsZS9jaXJjbGVfcXVpY2tzdGFydF9pb3MuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJXZWIgXHU1RkVCXHU5MDFGXHU1RjAwXHU1OUNCXCIsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6IFwiY2lyY2xlL2NpcmNsZV9xdWlja3N0YXJ0X3dlYi5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlx1OTZDNlx1NjIxMFx1OEJGNFx1NjYwRVwiLFxyXG4gICAgICAgICAgICAgIGNvbGxhcHNpYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiBcIkFuZHJvaWQgXHU3OTNFXHU1MzNBXHU3QkExXHU3NDA2XCIsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6IFwiY2lyY2xlL3NlcnZlcl9tZ210X2FuZHJvaWQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJBbmRyb2lkIFx1OTg5MVx1OTA1M1x1N0JBMVx1NzQwNlwiLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiBcImNpcmNsZS9jaGFubmVsX21nbXRfYW5kcm9pZC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiBcIkFuZHJvaWQgXHU5ODkxXHU5MDUzXHU1MjA2XHU3RUM0XHU3QkExXHU3NDA2XCIsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6IFwiY2lyY2xlL2NhdGVnb3J5X21nbXRfYW5kcm9pZC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcImlPUyBcdTc5M0VcdTUzM0FcdTdCQTFcdTc0MDZcIiwgbGluazogXCJjaXJjbGUvc2VydmVyX21nbXRfaW9zLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcImlPUyBcdTk4OTFcdTkwNTNcdTdCQTFcdTc0MDZcIiwgbGluazogXCJjaXJjbGUvY2hhbm5lbF9tZ210X2lvcy5odG1sXCIgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJpT1MgXHU5ODkxXHU5MDUzXHU1MjA2XHU3RUM0XHU3QkExXHU3NDA2XCIsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6IFwiY2lyY2xlL2NhdGVnb3J5X21nbXRfaW9zLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiV2ViIFx1NzkzRVx1NTMzQVx1N0JBMVx1NzQwNlwiLCBsaW5rOiBcImNpcmNsZS9zZXJ2ZXJfbWdtdF93ZWIuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiV2ViIFx1OTg5MVx1OTA1M1x1N0JBMVx1NzQwNlwiLCBsaW5rOiBcImNpcmNsZS9jaGFubmVsX21nbXRfd2ViLmh0bWxcIiB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiBcIldlYiBcdTk4OTFcdTkwNTNcdTUyMDZcdTdFQzRcdTdCQTFcdTc0MDZcIixcclxuICAgICAgICAgICAgICAgICAgbGluazogXCJjaXJjbGUvY2F0ZWdvcnlfbWdtdF93ZWIuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJcdTk1MTlcdThCRUZcdTc4MDFcIixcclxuICAgICAgICAgICAgICBjb2xsYXBzaWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJBbmRyb2lkIFx1OTUxOVx1OEJFRlx1NzgwMVwiLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiBcImNpcmNsZS9jaXJjbGVfZXJyb3Jjb2RlX2FuZHJvaWQuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJpT1MgXHU5NTE5XHU4QkVGXHU3ODAxXCIsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6IFwiY2lyY2xlL2NpcmNsZV9lcnJvcmNvZGVfaW9zLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6IFwiV2ViIFx1OTUxOVx1OEJFRlx1NzgwMVwiLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiBcImNpcmNsZS9jaXJjbGVfZXJyb3Jjb2RlX3dlYi5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkFQSSBcdTUzQzJcdTgwMDNcIixcclxuICAgICAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIlJFU1QgXHU3OTNFXHU1MzNBXHU3QkExXHU3NDA2XCIsIGxpbms6IFwiY2lyY2xlL3NlcnZlcl9tZ210X3Jlc3QuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6IFwiUkVTVCBcdTk4OTFcdTkwNTNcdTdCQTFcdTc0MDZcIixcclxuICAgICAgICAgICAgICAgICAgbGluazogXCJjaXJjbGUvY2hhbm5lbF9tZ210X3Jlc3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJSRVNUIFx1OTg5MVx1OTA1M1x1NTIwNlx1N0VDNFx1N0JBMVx1NzQwNlwiLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiBcImNpcmNsZS9jYXRlZ29yeV9tZ210X3Jlc3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJBbmRyb2lkIEFQSSBcdTUzQzJcdTgwMDNcIixcclxuICAgICAgICAgICAgICAgICAgbGluazogXCJjaXJjbGUvYXBpX3JlZmVyZW5jZV9hbmRyb2lkLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiaU9TIEFQSSBcdTUzQzJcdTgwMDNcIiwgbGluazogXCJjaXJjbGUvYXBpX3JlZmVyZW5jZV9pb3MuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiV2ViIEFQSSBcdTUzQzJcdTgwMDNcIiwgbGluazogXCJjaXJjbGUvYXBpX3JlZmVyZW5jZV93ZWIuaHRtbFwiIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiBcIlx1OEJFRFx1ODA0QVx1NjIzRlwiLFxyXG4gICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJcdTU3M0FcdTY2NkZcdTY5ODJcdTg5QzhcIixcclxuICAgICAgICAgICAgICBjb2xsYXBzaWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJcdTU3M0FcdTY2NkZcdTRFQ0JcdTdFQ0RcIixcclxuICAgICAgICAgICAgICAgICAgbGluazogXCJ2b2ljZXJvb20vZGVtb19zY2VuYXJpb19pbnRyb2R1Y3Rpb24uaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDogXCJEZW1vIFx1NEY1M1x1OUE4Q1x1RkYwOEFuZHJvaWQvaU9TXHVGRjA5XCIsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6IFwidm9pY2Vyb29tL2RlbW9fZXhwZXJpZW5jZS5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlx1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQlwiLFxyXG4gICAgICAgICAgICAgIGNvbGxhcHNpYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiBcIlx1OEREMVx1OTAxQVx1NzkzQVx1NEY4Qlx1OTg3OVx1NzZFRVx1RkYwOEFuZHJvaWRcdUZGMDlcIixcclxuICAgICAgICAgICAgICAgICAgbGluazogXCJ2b2ljZXJvb20vcnVuX3Rocm91Z2hfZGVtb19hbmRyb2lkLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXHU4REQxXHU5MDFBXHU3OTNBXHU0RjhCXHU5ODc5XHU3NkVFXHVGRjA4aU9TXHVGRjA5XCIsXHJcbiAgICAgICAgICAgICAgICAgIGxpbms6IFwidm9pY2Vyb29tL3J1bl90aHJvdWdoX2RlbW9faW9zLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiXHU1QjlFXHU3M0IwXHU2RDQxXHU3QTBCXCIsXHJcbiAgICAgICAgICAgICAgY29sbGFwc2libGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXHU1QkEyXHU2MjM3XHU3QUVGXHU1QjlFXHU3M0IwXHVGRjA4QW5kcm9pZFx1RkYwOVwiLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiBcInZvaWNlcm9vbS9jbGllbnRfaW1wbGVtZW50YXRpb25fYW5kcm9pZC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0OiBcIlx1NUJBMlx1NjIzN1x1N0FFRlx1NUI5RVx1NzNCMFx1RkYwOGlPU1x1RkYwOVwiLFxyXG4gICAgICAgICAgICAgICAgICBsaW5rOiBcInZvaWNlcm9vbS9jbGllbnRfaW1wbGVtZW50YXRpb25faW9zLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgXSwgIFxyXG4gIC4uLkRPQ19TSURFQkFSLFxyXG4gIC4uLkNIQVRfVUlLSVRfU0lERUJBUixcclxuICAuLi5DSEFUUk9PTV9VSUtJVF9TSURFQkFSLFxyXG4gIC4uLkNBTExfS0lUX1NJREVCQVIsXHJcbiAgXCIvcHJpdmF0ZS9pbS9cIjogUFJJVkFURV9JTV9TSURFQkFSLFxyXG4gIFwiL3ByaXZhdGUvbWVkaWEvXCI6IFBSSVZBVEVfTUVESUFfU0lERUJBUixcclxuICBcIi9wdXNoXCI6IFBVU0hfU0lERUJBUixcclxufSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDovRWFzZW1vYi9HaXRodWJfTGlicmFyeV9TdW1tYXJ5L2Vhc2Vtb2JfZG9jL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEVhc2Vtb2JcXFxcR2l0aHViX0xpYnJhcnlfU3VtbWFyeVxcXFxlYXNlbW9iX2RvY1xcXFxkb2NzXFxcXC52dWVwcmVzc1xcXFxzaWRlYmFyXFxcXGRvY3VtZW50LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9FYXNlbW9iL0dpdGh1Yl9MaWJyYXJ5X1N1bW1hcnkvZWFzZW1vYl9kb2MvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9kb2N1bWVudC50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIlxyXG5pbXBvcnQgZnMgZnJvbSBcIm5vZGU6ZnNcIlxyXG5cclxuY29uc3QgZ2V0U3ViRGlyZWN0b3JpZXMgPSAoZGlyKSA9PiBmcy5yZWFkZGlyU3luYyhkaXIpLmZpbHRlcihpdGVtID0+IGZzLnN0YXRTeW5jKHBhdGguam9pbihkaXIsIGl0ZW0pKS5pc0RpcmVjdG9yeSgpKVxyXG5jb25zdCBET0NfUEFUSCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9kb2N1bWVudCcpXHJcbmNvbnN0IHBsYXRmb3JtTGlzdCA9IGdldFN1YkRpcmVjdG9yaWVzKERPQ19QQVRIKVxyXG5cclxuY29uc3QgZG9jdW1lbnRTaWRlYmFyID0gW1xyXG4gIHtcclxuICAgIC8qXHJcbiAgICAgIHRleHQ6IFx1NTIwNlx1N0VDNFx1NjgwN1x1OTg5OFxyXG4gICAgICBjaGlsZHJlbjogXHU1MjA2XHU3RUM0XHU1QkZDXHU4MjJBXHU1MjE3XHU4ODY4XHJcbiAgICAgICAgdGV4dDogXHU2NjNFXHU3OTNBXHU3Njg0XHU2NTg3XHU2NzJDXHJcbiAgICAgICAgbGluazogXHU5NEZFXHU2M0E1XHU1NzMwXHU1NzQwXHJcbiAgICAgICAgc2hvdzogXHU0RTBEXHU1QjU4XHU1NzI4XHU2MjE2XHU4MDA1XHU1MDNDXHU0RTNBIHRydWUgXHU2NUY2XHVGRjBDXHU4M0RDXHU1MzU1XHU2NjNFXHU3OTNBXHVGRjFCXHU1QjU4XHU1NzI4XHU1RTc2XHU0RTE0XHU1MDNDXHU0RTNBIGZhbHNlIFx1NjVGNlx1RkYwQ1x1ODNEQ1x1NTM1NVx1NEUwRFx1NjYzRVx1NzkzQVxyXG4gICAgICAgIG9ubHk6IFx1NjU3MFx1N0VDNFx1NUY2Mlx1NUYwRlx1RkYwQ1x1NTNFQVx1NjcwOVx1NTcyOFx1NjU3MFx1N0VDNFx1NEUyRFx1NzY4NFx1NUU3M1x1NTNGMFx1NEUwQlx1NjYzRVx1NzkzQVxyXG4gICAgICAgIGV4Y2VwdDogXHU2NTcwXHU3RUM0XHU1RjYyXHU1RjBGXHVGRjBDXHU5NjY0XHU0RTg2XHU2NTcwXHU3RUM0XHU0RTJEXHU2MzA3XHU1QjlBXHU3Njg0XHU1RTczXHU1M0YwXHU1OTE2XHU5MEZEXHU2NjNFXHU3OTNBXHJcbiAgICAgICAgY29sbGFwc2libGU6IFx1NUI1MFx1ODNEQ1x1NTM1NVx1NjYyRlx1NTQyNlx1NTE0MVx1OEJCOFx1NUM1NVx1NUYwMC9cdTY1MzZcdThENzdcdUZGMEN0cnVlOiBcdTUxNDFcdThCQjg7IGZhbHNlOiBcdTRFMERcdTUxNDFcdThCQjhcdTMwMDJcdThCRjdcdTUzQzJcdTgwMDNcdTMwMENcdTVCNTBcdTgzRENcdTUzNTVcdTc5M0FcdTRGOEJcdTMwMERcclxuICAgICAgICBjaGlsZHJlbjogXHU1QjUwXHU4M0RDXHU1MzU1XHUzMDAyXHU4QkY3XHU1M0MyXHU4MDAzXHUzMDBDXHU1QjUwXHU4M0RDXHU1MzU1XHU3OTNBXHU0RjhCXHUzMDBEXHJcbiAgICAqL1xyXG4gICAgdGV4dDogJ1x1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQicsXHJcbiAgICBjaGlsZHJlbjogW1xyXG4gICAgICB7IHRleHQ6ICdSZWFjdCBEZW1vIFx1NEY1M1x1OUE4QycsIGxpbms6ICdkZW1vX3JlYWN0Lmh0bWwnLCBvbmx5OiBbJ3dlYiddIH0sXHJcbiAgICAgIHsgdGV4dDogJ1Z1ZSBEZW1vIFx1NEY1M1x1OUE4QycsIGxpbms6ICdkZW1vX3Z1ZS5odG1sJywgb25seTogWyd3ZWInXSB9LFxyXG4gICAgICB7IHRleHQ6ICdEZW1vIFx1NEY1M1x1OUE4QycsIGxpbms6ICdkZW1vLmh0bWwnLCBleGNlcHQ6IFsnd2ViJywgJ3dpbmRvd3MnLCAndW5pdHknLCAnc2VydmVyLXNpZGUnXSB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTVGRUJcdTkwMUZcdTVGMDBcdTU5Q0InLCBsaW5rOiAncXVpY2tzdGFydC5odG1sJywgZXhjZXB0OiBbJ3dpbmRvd3MnLCAncmVhY3QtbmF0aXZlJywgJ2ZsdXR0ZXInLCAndW5pdHknLCAnc2VydmVyLXNpZGUnXSB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTVGRUJcdTkwMUZcdTVGMDBcdTU5Q0InLCBsaW5rOiAncXVpY2tzdGFydC5odG1sJywgb25seTogWyd3aW5kb3dzJywgJ3JlYWN0LW5hdGl2ZScsICdmbHV0dGVyJywgJ3VuaXR5J10gfSxcclxuICAgICAgLy8geyB0ZXh0OiAnXHU3OUMxXHU2NzA5XHU0RTkxIFNESyBcdTk2QzZcdTYyMTBcdTkxNERcdTdGNkUnLCBsaW5rOiAncHJpdmF0ZWNsb3VkLmh0bWwnLCBleGNlcHQ6IFsnd2luZG93cycsICdzZXJ2ZXItc2lkZScsICdyZWFjdC1uYXRpdmUnLCAnZmx1dHRlcicsICd1bml0eSddIH0sXHJcbiAgICAgIHsgdGV4dDogJ1NESyBcdTY2RjRcdTY1QjBcdTY1RTVcdTVGRDcnLCBsaW5rOiAncmVsZWFzZW5vdGUuaHRtbCcsIGV4Y2VwdDogWydzZXJ2ZXItc2lkZSddfSxcclxuICAgICAgLyp7IHRleHQ6ICdBUEkgcmVmZXJlbmNlJywgbGluazogJ2FwaXJlZmVyZW5jZS5odG1sJywgb25seTogWydhbmRyb2lkJywgJ2lvcycsICd3ZWInLCAnd2luZG93cycsICdyZWFjdC1uYXRpdmUnLCAnZmx1dHRlcicsICd1bml0eSddfSwqL1xyXG4gICAgICB7IHRleHQ6ICdcdTVGMDBcdTkwMUFcdTU0OENcdTkxNERcdTdGNkVcdTY3MERcdTUyQTEgY29uc29sZScsIGxpbms6ICdlbmFibGVfYW5kX2NvbmZpZ3VyZV9JTS5odG1sJywgb25seTogWydzZXJ2ZXItc2lkZSddIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NEY3Rlx1NzUyOFx1NzNBRlx1NEZFMSBBcHAgVG9rZW4gXHU5Mjc0XHU2NzQzJywgbGluazogJ2Vhc2Vtb2JfYXBwX3Rva2VuLmh0bWwnLCBvbmx5OiBbJ3NlcnZlci1zaWRlJ10gfSxcclxuICAgICAgeyB0ZXh0OiAnXHU0RjdGXHU3NTI4XHU3M0FGXHU0RkUxIFVzZXIgVG9rZW4gXHU5Mjc0XHU2NzQzJywgbGluazogJ2Vhc2Vtb2JfdXNlcl90b2tlbi5odG1sJywgb25seTogWydzZXJ2ZXItc2lkZSddIH0sXHJcbiAgICAgIHsgdGV4dDogJ0lNIFx1NEVBN1x1NTRDMVx1NEY3Rlx1NzUyOFx1OTY1MFx1NTIzNicsIGxpbms6ICdsaW1pdGF0aW9uLmh0bWwnLCBvbmx5OiBbJ3NlcnZlci1zaWRlJ10gfSxcclxuICAgICAgeyB0ZXh0OiAnXHU2M0E1XHU1M0UzXHU5ODkxXHU3Mzg3XHU5NjUwXHU1MjM2JywgbGluazogJ2xpbWl0YXRpb25hcGkuaHRtbCcsIG9ubHk6IFsnc2VydmVyLXNpZGUnXSB9LFxyXG4gICAgXSxcclxuICAgIGV4Y2VwdDogWydhcHBsZXQnXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NzUyOFx1NjIzN1x1NjMwN1x1NTM1NycsXHJcbiAgICBjaGlsZHJlbjogW1xyXG4gICAgICB7IHRleHQ6ICdcdTk2QzZcdTYyMTAgU0RLJywgbGluazogJ2ludGVncmF0aW9uLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NTIxRFx1NTlDQlx1NTMxNicsIGxpbms6ICdpbml0aWFsaXphdGlvbi5odG1sJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1NzY3Qlx1NUY1NScsXHJcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NzY3Qlx1NUY1NVx1NEVDQlx1N0VDRCcsIGxpbms6ICdsb2dpbi5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4RkRFXHU2M0E1JywgbGluazogJ2Nvbm5lY3Rpb24uaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NTkxQVx1OEJCRVx1NTkwN1x1NzY3Qlx1NUY1NScsIGxpbms6ICdtdWx0aV9kZXZpY2UuaHRtbCcgfSxcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiAnXHU2RDg4XHU2MDZGXHU3QkExXHU3NDA2JyxcclxuICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2RDg4XHU2MDZGXHU2OTgyXHU4RkYwJywgbGluazogJ21lc3NhZ2Vfb3ZlcnZpZXcuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NTNEMVx1OTAwMVx1NkQ4OFx1NjA2RicsIGxpbms6ICdtZXNzYWdlX3NlbmQuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NjNBNVx1NjUzNlx1NkQ4OFx1NjA2RicsIGxpbms6ICdtZXNzYWdlX3JlY2VpdmUuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1ODNCN1x1NTNENlx1NTM4Nlx1NTNGMlx1NkQ4OFx1NjA2RicsIGxpbms6ICdtZXNzYWdlX3JldHJpZXZlLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTY0QTRcdTU2REVcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV9yZWNhbGwuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NjQxQ1x1N0QyMlx1NkQ4OFx1NjA2RicsIGxpbms6ICdtZXNzYWdlX3NlYXJjaC5odG1sJywgZXhjZXB0OiBbJ3dlYiddfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NkQ4OFx1NjA2Rlx1NTZERVx1NjI2NycsIGxpbms6ICdtZXNzYWdlX3JlY2VpcHQuaHRtbCd9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU0RkVFXHU2NTM5XHU2RDg4XHU2MDZGJywgbGluazogJ21lc3NhZ2VfbW9kaWZ5Lmh0bWwnfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NkQ4OFx1NjA2Rlx1ODg2OFx1NjBDNVx1NTZERVx1NTkwRCcsIGxpbms6ICdyZWFjdGlvbi5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4RjZDXHU1M0QxXHU2RDg4XHU2MDZGJywgbGluazogJ21lc3NhZ2VfZm9yd2FyZC5odG1sJywgZXhjZXB0OiBbJ3dlYiddfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NUJGQ1x1NTE2NVx1NTQ4Q1x1NjNEMlx1NTE2NVx1NkQ4OFx1NjA2RicsIGxpbms6ICdtZXNzYWdlX2ltcG9ydF9pbnNlcnQuaHRtbCcsIGV4Y2VwdDogWyd3ZWInXX0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTY2RjRcdTY1QjBcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV91cGRhdGUuaHRtbCcsIGV4Y2VwdDogWyd3ZWInXX0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTUyMjBcdTk2NjRcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV9kZWxldGUuaHRtbCcgfSwgICAgXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTVCOUFcdTU0MTFcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV90YXJnZXQuaHRtbCcgfSwgICAgXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTZEODhcdTYwNkZcdTYyNjlcdTVDNTUnLCBsaW5rOiAnbWVzc2FnZV9leHRlbnNpb24uaHRtbCcgfSwgICAgXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdGNkVcdTk4NzZcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV9waW4uaHRtbCd9LCAgICAgICAgIFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3RkZCXHU4QkQxXHU2RDg4XHU2MDZGJywgbGluazogJ21lc3NhZ2VfdHJhbnNsYXRpb24uaHRtbCcsIGV4Y2VwdDogWydoYXJtb255b3MnXX0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTUzRUFcdTYyOTVcdTU3MjhcdTdFQkZcdTc1MjhcdTYyMzcnLCBsaW5rOiAnbWVzc2FnZV9kZWxpdmVyX29ubHlfb25saW5lLmh0bWwnfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NkQ4OFx1NjA2Rlx1NUJBMVx1NjgzOFx1RkYwOFx1NEUzRVx1NjJBNVx1RkYwOScsIGxpbms6ICdtb2RlcmF0aW9uLmh0bWwnLCBleGNlcHQ6IFsnaGFybW9ueW9zJ119LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4M0I3XHU1M0Q2XHU2RDg4XHU2MDZGXHU2RDQxXHU5MUNGXHU3RURGXHU4QkExJywgbGluazogJ21lc3NhZ2VfdHJhZmZpY19zdGF0aXMuaHRtbCcsIG9ubHk6IFsnYW5kcm9pZCcsICdpb3MnXSB9LFxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdcdTRGMUFcdThCRERcdTdCQTFcdTc0MDYnLFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTRGMUFcdThCRERcdTRFQ0JcdTdFQ0QnLCBsaW5rOiAnY29udmVyc2F0aW9uX292ZXJ2aWV3Lmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTRGMUFcdThCRERcdTUyMTdcdTg4NjgnLCBsaW5rOiAnY29udmVyc2F0aW9uX2xpc3QuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NjcyQ1x1NTczMFx1NEYxQVx1OEJERCcsIGxpbms6ICdjb252ZXJzYXRpb25fbG9jYWwuaHRtbCcsIG9ubHk6IFsnd2ViJ10gfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NEYxQVx1OEJERFx1NURGMlx1OEJGQlx1NTZERVx1NjI2NycsIGxpbms6ICdjb252ZXJzYXRpb25fcmVjZWlwdC5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU0RjFBXHU4QkREXHU2NzJBXHU4QkZCXHU2NTcwJywgbGluazogJ2NvbnZlcnNhdGlvbl91bnJlYWQuaHRtbCcsIGV4Y2VwdDogWyd3ZWInXSB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3RjZFXHU5ODc2XHU0RjFBXHU4QkREJywgbGluazogJ2NvbnZlcnNhdGlvbl9waW4uaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NEYxQVx1OEJERFx1NjgwN1x1OEJCMCcsIGxpbms6ICdjb252ZXJzYXRpb25fbWFyay5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1MjIwXHU5NjY0XHU0RjFBXHU4QkREJywgbGluazogJ2NvbnZlcnNhdGlvbl9kZWxldGUuaHRtbCcgfSxcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiAnXHU3RkE0XHU3RUM0XHU3QkExXHU3NDA2JyxcclxuICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3RkE0XHU3RUM0XHU2OTgyXHU4RkYwJywgbGluazogJ2dyb3VwX292ZXJ2aWV3Lmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTUyMUJcdTVFRkFcdTU0OENcdTdCQTFcdTc0MDZcdTdGQTRcdTdFQzQnLCBsaW5rOiAnZ3JvdXBfbWFuYWdlLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdCQTFcdTc0MDZcdTdGQTRcdTdFQzRcdTYyMTBcdTU0NTgnLCBsaW5rOiAnZ3JvdXBfbWVtYmVycy5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3QkExXHU3NDA2XHU3RkE0XHU3RUM0XHU1QzVFXHU2MDI3JywgbGluazogJ2dyb3VwX2F0dHJpYnV0ZXMuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1N0JBMVx1NzQwNlx1NUI1MFx1NTMzQScsIGxpbms6ICd0aHJlYWQuaHRtbCcsIGV4Y2VwdDogWydoYXJtb255b3MnXSB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3QkExXHU3NDA2XHU1QjUwXHU1MzNBXHU2RDg4XHU2MDZGJywgbGluazogJ3RocmVhZF9tZXNzYWdlLmh0bWwnLCBleGNlcHQ6IFsnaGFybW9ueW9zJ10gfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdcdTgwNEFcdTU5MjlcdTVCQTRcdTdCQTFcdTc0MDYnLFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTgwNEFcdTU5MjlcdTVCQTRcdTY5ODJcdThGRjAnLCBsaW5rOiAncm9vbV9vdmVydmlldy5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1MjFCXHU1RUZBXHU1NDhDXHU3QkExXHU3NDA2XHU4MDRBXHU1OTI5XHU1QkE0JywgbGluazogJ3Jvb21fbWFuYWdlLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdCQTFcdTc0MDZcdTgwNEFcdTU5MjlcdTVCQTRcdTYyMTBcdTU0NTgnLCBsaW5rOiAncm9vbV9tZW1iZXJzLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdCQTFcdTc0MDZcdTgwNEFcdTU5MjlcdTVCQTRcdTVDNUVcdTYwMjcnLCBsaW5rOiAncm9vbV9hdHRyaWJ1dGVzLmh0bWwnIH0sXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1NzUyOFx1NjIzN1x1NzZGOFx1NTE3MycsXHJcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NzUyOFx1NjIzN1x1NTE3M1x1N0NGQicsIGxpbms6ICd1c2VyX3JlbGF0aW9uc2hpcC5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3NTI4XHU2MjM3XHU1QzVFXHU2MDI3JywgbGluazogJ3VzZXJwcm9maWxlLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTU3MjhcdTdFQkZcdTcyQjZcdTYwMDFcdThCQTJcdTk2MDUnLCBsaW5rOiAncHJlc2VuY2UuaHRtbCcgfSxcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiAnXHU3OUJCXHU3RUJGXHU2M0E4XHU5MDAxJywgXHJcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NzlCQlx1N0VCRlx1NjNBOFx1OTAwMVx1Njk4Mlx1OEZGMCcsIGxpbms6ICdwdXNoL3B1c2hfb3ZlcnZpZXcuaHRtbCcsIG9ubHk6IFsnYW5kcm9pZCcsICdpb3MnLCAnd2ViJywgJ2hhcm1vbnlvcycsICdyZWFjdC1uYXRpdmUnLCAnZmx1dHRlciddIH0sXHJcbiAgICAgICAgICB7IFxyXG4gICAgICAgICAgICB0ZXh0OiAnXHU5NkM2XHU2MjEwXHU3QjJDXHU0RTA5XHU2NUI5XHU2M0E4XHU5MDAxJywgXHJcbiAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7IHRleHQ6ICdGQ00gXHU2M0E4XHU5MDAxJywgbGluazogJ3B1c2gvcHVzaF9mY20uaHRtbCcsIG9ubHk6IFsnYW5kcm9pZCddIH0sIFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTUzNEVcdTRFM0FcdTYzQThcdTkwMDEnLCBsaW5rOiAncHVzaC9wdXNoX2h1YXdlaS5odG1sJywgb25seTogWydhbmRyb2lkJ10gfSwgXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1ODM2M1x1ODAwMFx1NjNBOFx1OTAwMScsIGxpbms6ICdwdXNoL3B1c2hfaG9ub3IuaHRtbCcsIG9ubHk6IFsnYW5kcm9pZCddIH0sIFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdPUFBPIFx1NjNBOFx1OTAwMScsIGxpbms6ICdwdXNoL3B1c2hfb3Bwby5odG1sJywgb25seTogWydhbmRyb2lkJ10gfSwgXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ3Zpdm8gXHU2M0E4XHU5MDAxJywgbGluazogJ3B1c2gvcHVzaF92aXZvLmh0bWwnLCBvbmx5OiBbJ2FuZHJvaWQnXSB9LCBcclxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU1QzBGXHU3QzczXHU2M0E4XHU5MDAxJywgbGluazogJ3B1c2gvcHVzaF94aWFvbWkuaHRtbCcsIG9ubHk6IFsnYW5kcm9pZCddIH0sIFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTlCNDVcdTY1Q0ZcdTYzQThcdTkwMDEnLCBsaW5rOiAncHVzaC9wdXNoX21laXp1Lmh0bWwnLCBvbmx5OiBbJ2FuZHJvaWQnXSB9LCBcclxuICAgICAgICAgICAgeyB0ZXh0OiAnQVBOcyBcdTYzQThcdTkwMDEnLCBsaW5rOiAncHVzaC9wdXNoX2FwbnMuaHRtbCcsIG9ubHk6IFsnaW9zJ10gfSwgXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ0hhcm1vbnlPUyBcdTYzQThcdTkwMDEnLCBsaW5rOiAncHVzaC9wdXNoX2hhcm1vbnkuaHRtbCcsIG9ubHk6IFsnaGFybW9ueW9zJ10gfVxyXG4gICAgICAgICAgIF1cclxuICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU0RTBBXHU0RjIwXHU2M0E4XHU5MDAxXHU4QkMxXHU0RTY2JywgbGluazogJ3B1c2gvcHVzaF9lYXNlbW9iX2NvbnNvbGUuaHRtbCcsIG9ubHk6IFsncmVhY3QtbmF0aXZlJ10gfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NEUwQVx1NEYyMFx1NjNBOFx1OTAwMVx1OEJDMVx1NEU2Nlx1NTNDQVx1N0VEMVx1NUI5QVx1NjNBOFx1OTAwMVx1NEZFMVx1NjA2RicsIGxpbms6ICdwdXNoL3B1c2hfZWFzZW1vYl9jb25zb2xlLmh0bWwnLCBvbmx5OiBbJ2ZsdXR0ZXInXSB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4M0I3XHU1M0Q2XHU2MjE2XHU2NkY0XHU2NUIwXHU2M0E4XHU5MDAxIHRva2VuJywgbGluazogJ3B1c2gvcHVzaF9nZXRfZGV2aWNlX3Rva2VuLmh0bWwnLCBvbmx5OiBbJ3JlYWN0LW5hdGl2ZSddIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTUzRDFcdTkwMDFcdTYzQThcdTkwMDEgdG9rZW4gXHU1MjMwXHU3M0FGXHU0RkUxXHU2NzBEXHU1MkExXHU1NjY4JywgbGluazogJ3B1c2gvcHVzaF9zZW5kX3Rva2VuX3RvX3NlcnZlci5odG1sJywgb25seTogWydyZWFjdC1uYXRpdmUnXSB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4OUUzXHU2NzkwXHU2M0E4XHU5MDAxXHU2RDg4XHU2MDZGJywgbGluazogJ3B1c2gvcHVzaF9wYXJzaW5nLmh0bWwnLCBvbmx5OiBbJ2FuZHJvaWQnLCAnaW9zJ10gfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1N0VERlx1NEUwMFx1ODNCN1x1NTNENlx1NkQ4OFx1NjA2Rlx1NjVCOVx1Njg0OCcsIGxpbms6ICdwdXNoL3B1c2hfcGFyc2luZ191bmlmaWVkLmh0bWwnLCBvbmx5OiBbJ2FuZHJvaWQnXSB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4QkJFXHU3RjZFXHU5MDFBXHU3N0U1XHU3Njg0XHU2NjNFXHU3OTNBXHU1MTg1XHU1QkI5JywgbGluazogJ3B1c2gvcHVzaF9kaXNwbGF5Lmh0bWwnLCBvbmx5OiBbJ2FuZHJvaWQnLCAnaW9zJywgJ2hhcm1vbnlvcycsICdyZWFjdC1uYXRpdmUnLCAnZmx1dHRlciddIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdThCQkVcdTdGNkVcdTkwMUFcdTc3RTVcdTY1QjlcdTVGMEZcdTU0OENcdTUxNERcdTYyNTNcdTYyNzAnLCBsaW5rOiAncHVzaC9wdXNoX25vdGlmaWNhdGlvbl9tb2RlX2RuZC5odG1sJywgb25seTogWydhbmRyb2lkJywgJ2lvcycsICd3ZWInLCAnaGFybW9ueW9zJywgJ3JlYWN0LW5hdGl2ZScsICdmbHV0dGVyJ119LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4QkJFXHU3RjZFXHU2M0E4XHU5MDAxXHU2QTIxXHU2NzdGJywgbGluazogJ3B1c2gvcHVzaF90ZW1wbGF0ZS5odG1sJywgb25seTogWyd3ZWInXX0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdThCQkVcdTdGNkVcdTYzQThcdTkwMDFcdTdGRkJcdThCRDEnLCBsaW5rOiAncHVzaC9wdXNoX3RyYW5zbGF0aW9uLmh0bWwnLCBvbmx5OiBbJ2FuZHJvaWQnLCAnaW9zJywgJ3dlYicsICdyZWFjdC1uYXRpdmUnLCAnZmx1dHRlciddfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1OEJCRVx1N0Y2RVx1NjNBOFx1OTAwMVx1NjI2OVx1NUM1NVx1NTI5Rlx1ODBGRCcsIGxpbms6ICdwdXNoL3B1c2hfZXh0ZW5zaW9uLmh0bWwnLCBvbmx5OiBbJ2FuZHJvaWQnLCAnaW9zJywgJ3dlYicsICdyZWFjdC1uYXRpdmUnLCAnZmx1dHRlciddfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NjNBOFx1OTAwMVx1NkQ4OFx1NjA2Rlx1NTIwNlx1N0M3QicsIGxpbms6ICdwdXNoL3B1c2hfbWVzc2FnZV9jbGFzc2lmaWNhdGlvbi5odG1sJywgb25seTogWydhbmRyb2lkJ10gfSxcclxuICAgICAgICAgIHsgdGV4dDogJ0ZBUScsIGxpbms6ICdwdXNoL3B1c2hfc29sdXRpb24uaHRtbCcsIG9ubHk6IFsnYW5kcm9pZCcsICdpb3MnLCdoYXJtb255b3MnXX0sXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICAgIGV4Y2VwdDogWydhcHBsZXQnLCdzZXJ2ZXItc2lkZSddXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU5NTE5XHU4QkVGXHU2MzkyXHU2N0U1JyxcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1OTUxOVx1OEJFRlx1NzgwMScsIGxpbms6ICdlcnJvci5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY1RTVcdTVGRDcnLCBsaW5rOiAnbG9nLmh0bWwnLCBleGNlcHQ6IFsnZmx1dHRlciddIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NUUzOFx1ODlDMVx1OTVFRVx1OTg5OCcsIGxpbms6ICdmYXEuaHRtbCcsIG9ubHk6IFsncmVhY3QtbmF0aXZlJ10gfSxcclxuICAgIF0sXHJcbiAgICBleGNlcHQ6IFsnYXBwbGV0JywgJ3NlcnZlci1zaWRlJ11cclxuICB9LFxyXG4gIHsgdGV4dDogJ1x1ODJGOVx1Njc5Q1x1OTY5MFx1NzlDMVx1N0I1Nlx1NzU2NScsIGxpbms6ICdwcml2YWN5X3BvbGljeS5odG1sJywgb25seTogWydpb3MnXSB9LFxyXG4gIHsgdGV4dDogJ1x1N0NCRVx1N0I4MFx1NzI0OCBTREsgXHU0RjdGXHU3NTI4XHU4QkY0XHU2NjBFJywgbGluazogJ2VsaXRlX3Nkay5odG1sJywgb25seTogWydhbmRyb2lkJywgJ2lvcyddfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU0RUE3XHU1NEMxXHU0RUNCXHU3RUNEJyxcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1NzNBRlx1NEZFMVx1NUMwRlx1N0EwQlx1NUU4Rlx1NTE2OFx1NUU3M1x1NTNGMFx1ODlFM1x1NTFCM1x1NjVCOVx1Njg0OCcsIGxpbms6ICdvdmVydmlldy5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTVDMEZcdTdBMEJcdTVFOEYgU0RLIFx1NjZGNFx1NjVCMFx1NjVFNVx1NUZENycsIGxpbms6ICdyZWxlYXNlbm90ZS5odG1sJyB9LFxyXG4gICAgXSxcclxuICAgIG9ubHk6IFsnYXBwbGV0J11cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTc1MjhcdTYyMzdcdTYzMDdcdTUzNTcnLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdcdTk2QzZcdTYyMTBcdTRFQ0JcdTdFQ0QnLFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTVGQUVcdTRGRTFcdTVDMEZcdTdBMEJcdTVFOEYnLCBsaW5rOiAnd2VjaGF0Lmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdRUSBcdTVDMEZcdTdBMEJcdTVFOEYnLCBsaW5rOiAncXEuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NzY3RVx1NUVBNlx1NUMwRlx1N0EwQlx1NUU4RicsIGxpbms6ICdiYWlkdS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2Mjk2XHU5N0YzXHU1QzBGXHU3QTBCXHU1RThGJywgbGluazogJ2J5dGVkYW5jZS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2NTJGXHU0RUQ4XHU1QjlEXHU1QzBGXHU3QTBCXHU1RThGJywgbGluazogJ2FsaXBheS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnVW5pYXBwIFx1NTE2OFx1NUU3M1x1NTNGMCcsIGxpbms6ICd1bmlhcHAuaHRtbCcgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTUyMURcdTU5Q0JcdTUzMTYnLCBsaW5rOiAnaW5pdGlhbGl6YXRpb24uaHRtbCcgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdcdTc2N0JcdTVGNTUnLFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTc2N0JcdTVGNTVcdTRFQ0JcdTdFQ0QnLCBsaW5rOiAnbG9naW4uaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1OEZERVx1NjNBNScsIGxpbms6ICdjb25uZWN0aW9uLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTU5MUFcdThCQkVcdTU5MDdcdTc2N0JcdTVGNTUnLCBsaW5rOiAnbXVsdGlfZGV2aWNlLmh0bWwnIH0sXHJcbiAgICAgICAgXSwgIFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1NkQ4OFx1NjA2Rlx1N0JBMVx1NzQwNicsXHJcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NkQ4OFx1NjA2Rlx1Njk4Mlx1OEZGMCcsIGxpbms6ICdtZXNzYWdlX292ZXJ2aWV3Lmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTUzRDFcdTkwMDFcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV9zZW5kLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTYzQTVcdTY1MzZcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV9yZWNlaXZlLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTgzQjdcdTUzRDZcdTUzODZcdTUzRjJcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV9yZXRyaWV2ZS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2NEE0XHU1NkRFXHU2RDg4XHU2MDZGJywgbGluazogJ21lc3NhZ2VfcmVjYWxsLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTZEODhcdTYwNkZcdTU2REVcdTYyNjcnLCBsaW5rOiAnbWVzc2FnZV9yZWNlaXB0Lmh0bWwnIH0sIFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2RDg4XHU2MDZGXHU4ODY4XHU2MEM1XHU1NkRFXHU1OTBEJywgbGluazogJ3JlYWN0aW9uLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTRGRUVcdTY1MzlcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV9tb2RpZnkuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NTIyMFx1OTY2NFx1NkQ4OFx1NjA2RicsIGxpbms6ICdtZXNzYWdlX2RlbGV0ZS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1QjlBXHU1NDExXHU2RDg4XHU2MDZGJywgbGluazogJ21lc3NhZ2VfdGFyZ2V0Lmh0bWwnIH0sIFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2RDg4XHU2MDZGXHU2MjY5XHU1QzU1JywgbGluazogJ21lc3NhZ2VfZXh0ZW5zaW9uLmh0bWwnIH0sICAgIFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3RjZFXHU5ODc2XHU2RDg4XHU2MDZGJywgbGluazogJ21lc3NhZ2VfcGluLmh0bWwnIH0sIFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3RkZCXHU4QkQxXHU2RDg4XHU2MDZGJywgbGluazogJ21lc3NhZ2VfdHJhbnNsYXRpb24uaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NTNFQVx1NjI5NVx1NTcyOFx1N0VCRlx1NzUyOFx1NjIzNycsIGxpbms6ICdtZXNzYWdlX2RlbGl2ZXJfb25seV9vbmxpbmUuaHRtbCd9LCAgXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTZEODhcdTYwNkZcdTVCQTFcdTY4MzhcdUZGMDhcdTRFM0VcdTYyQTVcdUZGMDknLCBsaW5rOiAnbW9kZXJhdGlvbi5odG1sJ30sICAgICAgXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1NEYxQVx1OEJERFx1N0JBMVx1NzQwNicsXHJcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NEYxQVx1OEJERFx1NEVDQlx1N0VDRCcsIGxpbms6ICdjb252ZXJzYXRpb25fb3ZlcnZpZXcuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NEYxQVx1OEJERFx1NTIxN1x1ODg2OCcsIGxpbms6ICdjb252ZXJzYXRpb25fbGlzdC5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU0RjFBXHU4QkREXHU2NzJBXHU4QkZCXHU2NTcwJywgbGluazogJ2NvbnZlcnNhdGlvbl91bnJlYWQuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1N0Y2RVx1OTg3Nlx1NEYxQVx1OEJERCcsIGxpbms6ICdjb252ZXJzYXRpb25fcGluLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTRGMUFcdThCRERcdTY4MDdcdThCQjAnLCBsaW5rOiAnY29udmVyc2F0aW9uX21hcmsuaHRtbCd9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1MjIwXHU5NjY0XHU0RjFBXHU4QkREJywgbGluazogJ2NvbnZlcnNhdGlvbl9kZWxldGUuaHRtbCd9LFxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdcdTdGQTRcdTdFQzRcdTdCQTFcdTc0MDYnLFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdGQTRcdTdFQzRcdTY5ODJcdThGRjAnLCBsaW5rOiAnZ3JvdXBfb3ZlcnZpZXcuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NTIxQlx1NUVGQVx1NTQ4Q1x1N0JBMVx1NzQwNlx1N0ZBNFx1N0VDNCcsIGxpbms6ICdncm91cF9tYW5hZ2UuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1N0JBMVx1NzQwNlx1N0ZBNFx1N0VDNFx1NjIxMFx1NTQ1OCcsIGxpbms6ICdncm91cF9tZW1iZXJzLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdCQTFcdTc0MDZcdTdGQTRcdTdFQzRcdTVDNUVcdTYwMjcnLCBsaW5rOiAnZ3JvdXBfYXR0cmlidXRlcy5odG1sJyB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnXHU1QjUwXHU1MzNBXHU3QkExXHU3NDA2JyxcclxuICAgICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3QkExXHU3NDA2XHU1QjUwXHU1MzNBJywgbGluazogJ3RocmVhZC5odG1sJyB9LFxyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1x1N0JBMVx1NzQwNlx1NUI1MFx1NTMzQVx1NkQ4OFx1NjA2RicsIGxpbms6ICd0aHJlYWRfbWVzc2FnZS5odG1sJyB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1ODA0QVx1NTkyOVx1NUJBNFx1N0JBMVx1NzQwNicsXHJcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgdGV4dDogJ1x1ODA0QVx1NTkyOVx1NUJBNFx1Njk4Mlx1OEZGMCcsIGxpbms6ICdyb29tX292ZXJ2aWV3Lmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTUyMUJcdTVFRkFcdTU0OENcdTdCQTFcdTc0MDZcdTgwNEFcdTU5MjlcdTVCQTQnLCBsaW5rOiAncm9vbV9tYW5hZ2UuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1N0JBMVx1NzQwNlx1ODA0QVx1NTkyOVx1NUJBNFx1NjIxMFx1NTQ1OCcsIGxpbms6ICdyb29tX21lbWJlcnMuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1N0JBMVx1NzQwNlx1ODA0QVx1NTkyOVx1NUJBNFx1NUM1RVx1NjAyNycsIGxpbms6ICdyb29tX2F0dHJpYnV0ZXMuaHRtbCcgfSxcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiAnXHU3NTI4XHU2MjM3XHU3NkY4XHU1MTczJyxcclxuICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3NTI4XHU2MjM3XHU1MTczXHU3Q0ZCJywgbGluazogJ3VzZXJfcmVsYXRpb25zaGlwLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTc1MjhcdTYyMzdcdTVDNUVcdTYwMjcnLCBsaW5rOiAndXNlcnByb2ZpbGUuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NTcyOFx1N0VCRlx1NzJCNlx1NjAwMVx1OEJBMlx1OTYwNScsIGxpbms6ICdwcmVzZW5jZS5odG1sJyB9LFxyXG4gICAgICAgIF1cclxuICAgICAgfSwgICAgXHJcbiAgICAgIHsgdGV4dDogJ1x1NzlCQlx1N0VCRlx1NjNBOFx1OTAwMScsIFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU3OUJCXHU3RUJGXHU2M0E4XHU5MDAxXHU2OTgyXHU4RkYwJywgbGluazogJ3B1c2gvcHVzaF9vdmVydmlldy5odG1sJyB9LCBcclxuICAgICAgICB7IHRleHQ6ICdcdThCQkVcdTdGNkVcdTkwMUFcdTc3RTVcdTY1QjlcdTVGMEZcdTU0OENcdTUxNERcdTYyNTNcdTYyNzAnLCBsaW5rOiAncHVzaC9wdXNoX25vdGlmaWNhdGlvbl9tb2RlX2RuZC5odG1sJyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1x1OEJCRVx1N0Y2RVx1NjNBOFx1OTAwMVx1NkEyMVx1Njc3RicsIGxpbms6ICdwdXNoL3B1c2hfdGVtcGxhdGUuaHRtbCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdThCQkVcdTdGNkVcdTYzQThcdTkwMDFcdTdGRkJcdThCRDEnLCBsaW5rOiAncHVzaC9wdXNoX3RyYW5zbGF0aW9uLmh0bWwnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU4QkJFXHU3RjZFXHU2M0E4XHU5MDAxXHU2MjY5XHU1QzU1XHU1MjlGXHU4MEZEJywgbGluazogJ3B1c2gvcHVzaF9leHRlbnNpb24uaHRtbCcgfSxcclxuICAgICAgICB7IHRleHQ6ICd1bmktYXBwIFx1NzlCQlx1N0VCRlx1NjNBOFx1OTAwMScsXHJcbiAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSwgXHJcbiAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTRGN0ZcdTc1MjhcdTYzQThcdTkwMDFcdTYzRDJcdTRFRjYnLCBsaW5rOiAncHVzaC91bmlhcHBfcHVzaC5odG1sJyB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTk2QzZcdTYyMTAgRkNNJywgbGluazogJ3B1c2gvdW5pYXBwX3B1c2hfZmNtLmh0bWwnIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sIFxyXG4gICAgXSxcclxuICAgIG9ubHk6IFsnYXBwbGV0J11cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTk1MTlcdThCRUZcdTYzOTJcdTY3RTUnLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiAnXHU5NTE5XHU4QkVGXHU3ODAxJywgbGluazogJ2Vycm9yLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjVFNVx1NUZENycsIGxpbms6ICdsb2cuaHRtbCcgfSxcclxuICAgIF0sXHJcbiAgICBvbmx5OiBbJ2FwcGxldCddXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU1MTc2XHU0RUQ2XHU1RTJFXHU1MkE5JyxcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1NUMwRlx1N0EwQlx1NUU4RiBBUEkgXHU2NTg3XHU2ODYzJywgbGluazogJ2FwaWRvYy5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdVbmlhcHAgXHU3NTFGXHU2MjEwXHU1MzlGXHU3NTFGIEFuZHJvaWRcdTMwMDFpT1MgXHU1RTk0XHU3NTI4JywgbGluazogJ3VuaWFwcG5hdGl2ZWFwcC5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTVDMEZcdTdBMEJcdTVFOEZcdTZBMjFcdTY3N0ZcdTRGN0ZcdTc1MjhcdTYzMDdcdTUzNTcnLCBsaW5rOiAndW5pYXBwdWlraXQuaHRtbCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1OTgyXHU0RjU1XHU5MTREXHU3RjZFXHU2NzBEXHU1MkExXHU1NjY4XHU1N0RGXHU1NDBEJywgbGluazogJ3NlcnZlcmNvbmZpZy5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdWdWUzIFx1OTg3OVx1NzZFRVx1NTcyOCBINSBcdTVFNzNcdTUzRjBcdTUzRDFcdTVFMDNcdTc2ODRcdTZDRThcdTYxMEZcdTRFOEJcdTk4NzknLCBsaW5rOiAndnVlM19wcm9qZWN0X2g1Lmh0bWwnIH0sXHJcbiAgICBdLFxyXG4gICAgb25seTogWydhcHBsZXQnXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NjcwRFx1NTJBMVx1N0FFRiBSRVNUZnVsIEFQSScsXHJcbiAgICBjaGlsZHJlbjogW1xyXG4gICAgICB7IHRleHQ6ICdcdTUzNzNcdTY1RjZcdTkwMUFcdThCQUYgUkVTVGZ1bCBBUEkgXHU2OTgyXHU4OUM4JywgbGluazogJ292ZXJ2aWV3Lmh0bWwnIH0sXHJcbiAgICAgIHsgXHJcbiAgICAgICAgdGV4dDogJ1x1NkQ4OFx1NjA2Rlx1N0JBMVx1NzQwNicsIFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTUzRDFcdTkwMDFcdTUzNTVcdTgwNEFcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV9zaW5nbGUuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NTNEMVx1OTAwMVx1N0ZBNFx1ODA0QVx1NkQ4OFx1NjA2RicsIGxpbms6ICdtZXNzYWdlX2dyb3VwLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTUzRDFcdTkwMDFcdTgwNEFcdTU5MjlcdTVCQTRcdTZEODhcdTYwNkYnLCBsaW5rOiAnbWVzc2FnZV9jaGF0cm9vbS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1M0QxXHU5MDAxXHU1MTY4XHU1QzQwXHU1RTdGXHU2NEFEXHU2RDg4XHU2MDZGJywgbGluazogJ21lc3NhZ2VfYnJvYWRjYXN0Lmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTRFMEFcdTRGMjBcdTU0OENcdTRFMEJcdThGN0RcdTY1ODdcdTRFRjYnLCBsaW5rOiAnbWVzc2FnZV9kb3dubG9hZC5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4M0I3XHU1M0Q2XHU1Mzg2XHU1M0YyXHU2RDg4XHU2MDZGXHU4QkIwXHU1RjU1JywgbGluazogJ21lc3NhZ2VfaGlzdG9yaWNhbC5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4QkJFXHU3RjZFXHU2MzA3XHU1QjlBXHU2RDg4XHU2MDZGXHU5NjQ0XHU0RUY2XHU3Njg0XHU1QjU4XHU1MEE4XHU2NUI5XHU1RjBGJywgbGluazogJ21lc3NhZ2VfYXR0YWNobWVudF9zdG9yYWdlLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTZEODhcdTYwNkZcdTg4NjhcdTYwQzVcdTU2REVcdTU5MEQnLCBsaW5rOiAncmVhY3Rpb24uaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NjRBNFx1NTZERVx1NkQ4OFx1NjA2RicsIGxpbms6ICdtZXNzYWdlX3JlY2FsbC5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1MzU1XHU1NDExXHU1MjIwXHU5NjY0XHU0RjFBXHU4QkREJywgbGluazogJ2NvbnZlcnNhdGlvbl9kZWxldGUuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NTM1NVx1NTQxMVx1NTIyMFx1OTY2NFx1NkYyQlx1NkUzOFx1NkQ4OFx1NjA2RicsIGxpbms6ICdtZXNzYWdlX2RlbGV0ZS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU0RkVFXHU2NTM5XHU2RDg4XHU2MDZGJywgbGluazogJ21lc3NhZ2VfbW9kaWZ5Lmh0bWwnIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdcdTZEODhcdTYwNkZcdTdGRkJcdThCRDEnLFxyXG4gICAgICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU3RkZCXHU4QkQxXHU2RDg4XHU2MDZGXHU1MTg1XHU1QkI5JywgbGluazogJ21lc3NhZ2VfdHJhbnNsYXRpb25fdGV4dC5odG1sJyB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTgzQjdcdTUzRDZcdTdGRkJcdThCRDFcdThCRURcdThBMDBcdTUyMTdcdTg4NjgnLCBsaW5rOiAnbWVzc2FnZV90cmFuc2xhdGlvbl9sYW5ndWFnZV9saXN0Lmh0bWwnIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NjhDMFx1NkQ0Qlx1NjU4N1x1NjcyQ1x1NzY4NFx1NkU5MFx1OEJFRFx1OEEwMCcsIGxpbms6ICdtZXNzYWdlX3RyYW5zbGF0aW9uX2RldGVjdC5odG1sJyB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1ODNCN1x1NTNENlx1NzlCQlx1N0VCRlx1NkQ4OFx1NjA2Rlx1NjU3MFx1NjM2RScsIGxpbms6ICdtZXNzYWdlX29mZmxpbmUuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NUJGQ1x1NTE2NVx1NkQ4OFx1NjA2RicsIGxpbms6ICdtZXNzYWdlX2ltcG9ydC5odG1sJyB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7IFxyXG4gICAgICAgIHRleHQ6ICdcdTdGQTRcdTdFQzQnLFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdCQTFcdTc0MDZcdTdGQTRcdTdFQzQnLCBsaW5rOiAnZ3JvdXBfbWFuYWdlLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdCQTFcdTc0MDZcdTdGQTRcdTdFQzRcdTY1ODdcdTRFRjYnLCBsaW5rOiAnZ3JvdXBfZmlsZS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3QkExXHU3NDA2XHU3RkE0XHU3RUM0XHU2MjEwXHU1NDU4JywgXHJcbiAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1x1ODNCN1x1NTNENlx1NjIxMFx1NTQ1OFx1NTIxN1x1ODg2OCcsIGxpbms6ICdncm91cF9tZW1iZXJfb2J0YWluLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2REZCXHU1MkEwL1x1NzlGQlx1OTY2NFx1NjIxMFx1NTQ1OCcsIGxpbms6ICdncm91cF9tZW1iZXJfYWRkX2RlbGV0ZS5odG1sJyB9LFxyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1x1N0JBMVx1NzQwNlx1N0ZBNFx1NjIxMFx1NTQ1OFx1ODFFQVx1NUI5QVx1NEU0OVx1NUM1RVx1NjAyNycsIGxpbms6ICdncm91cF9tZW1iZXJfYXR0cmlidXRlLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3QkExXHU3NDA2XHU3RkE0XHU0RTNCL1x1N0JBMVx1NzQwNlx1NTQ1OCcsIGxpbms6ICdncm91cF9tZW1iZXJfYWRtaW4uaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTdCQTFcdTc0MDZcdTc5ODFcdThBMDAnLCBsaW5rOiAnZ3JvdXBfbWVtYmVyX211dGVsaXN0Lmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3QkExXHU3NDA2XHU3NjdEXHU1NDBEXHU1MzU1JywgbGluazogJ2dyb3VwX21lbWJlcl9hbGxvd2xpc3QuaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTdCQTFcdTc0MDZcdTlFRDFcdTU0MERcdTUzNTUnLCBsaW5rOiAnZ3JvdXBfbWVtYmVyX2Jsb2NrbGlzdC5odG1sJyB9XHJcbiAgICAgICAgICAgIF0gIFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1N0JBMVx1NzQwNlx1NUI1MFx1NTMzQScsIGxpbms6ICdncm91cF90aHJlYWQuaHRtbCcgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgeyBcclxuICAgICAgICB0ZXh0OiAnXHU4MDRBXHU1OTI5XHU1QkE0JyxcclxuICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3QkExXHU3NDA2XHU4RDg1XHU3RUE3XHU3QkExXHU3NDA2XHU1NDU4JywgbGluazogJ2NoYXRyb29tX3N1cGVyYWRtaW4uaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1N0JBMVx1NzQwNlx1ODA0QVx1NTkyOVx1NUJBNCcsIGxpbms6ICdjaGF0cm9vbV9tYW5hZ2UuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1N0JBMVx1NzQwNlx1ODA0QVx1NTkyOVx1NUJBNFx1NUM1RVx1NjAyNycsIGxpbms6ICdjaGF0cm9vbV9hdHRyaWJ1dGUuaHRtbCcgfSxcclxuICAgICAgICAgIHsgXHJcbiAgICAgICAgICAgIHRleHQ6ICdcdTdCQTFcdTc0MDZcdTgwNEFcdTU5MjlcdTVCQTRcdTYyMTBcdTU0NTgnLCBcclxuICAgICAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4M0I3XHU1M0Q2XHU2MjEwXHU1NDU4XHU1MjE3XHU4ODY4JywgbGluazogJ2NoYXRyb29tX21lbWJlcl9vYnRhaW4uaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTZERkJcdTUyQTAvXHU3OUZCXHU5NjY0XHU2MjEwXHU1NDU4JywgbGluazogJ2NoYXRyb29tX21lbWJlcl9hZGRfZGVsZXRlLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3QkExXHU3NDA2XHU4MDRBXHU1OTI5XHU1QkE0XHU2MjQwXHU2NzA5XHU4MDA1L1x1N0JBMVx1NzQwNlx1NTQ1OCcsIGxpbms6ICdjaGF0cm9vbV9tZW1iZXJfYWRtaW4uaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTdCQTFcdTc0MDZcdTc5ODFcdThBMDAnLCBcclxuICAgICAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1OTFBXHU0RTJBXHU2MjE2XHU1MTY4XHU0RjUzXHU2MjEwXHU1NDU4XHU3OTgxXHU4QTAwJywgIGxpbms6ICdjaGF0cm9vbV9tZW1iZXJfbXV0ZWxpc3QuaHRtbCcgfSxcclxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2ODA3XHU3QjdFXHU3OTgxXHU4QTAwJywgIGxpbms6ICdjaGF0cm9vbV9sYWJlbF9tdXRlLmh0bWwnIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9LCAgXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3QkExXHU3NDA2XHU3NjdEXHU1NDBEXHU1MzU1JywgbGluazogJ2NoYXRyb29tX21lbWJlcl9hbGxvd2xpc3QuaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTdCQTFcdTc0MDZcdTlFRDFcdTU0MERcdTUzNTUnLCBsaW5rOiAnY2hhdHJvb21fbWVtYmVyX2Jsb2NrbGlzdC5odG1sJyB9XHJcbiAgICAgICAgICAgIF0gIFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgeyBcclxuICAgICAgICB0ZXh0OiAnXHU3NTI4XHU2MjM3XHU3NkY4XHU1MTczJyxcclxuICAgICAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3NTI4XHU2MjM3XHU0RjUzXHU3Q0ZCXHU3QkExXHU3NDA2JywgbGluazogJ2FjY291bnRfc3lzdGVtLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTc1MjhcdTYyMzdcdTVDNUVcdTYwMjcnLCBsaW5rOiAndXNlcnByb2ZpbGUuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NzUyOFx1NjIzN1x1NzJCNlx1NjAwMVx1OEJBMlx1OTYwNScsIGxpbms6ICdwcmVzZW5jZS5odG1sJyB9LFxyXG4gICAgICAgICAgeyBcclxuICAgICAgICAgICAgdGV4dDogJ1x1NzUyOFx1NjIzN1x1NTE3M1x1N0NGQicsXHJcbiAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1x1NkRGQlx1NTJBMFx1NTk3RFx1NTNDQicsIGxpbms6ICd1c2VyX3JlbGF0aW9uc2hpcF9mcmllbmRfYWRkLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2ODIxXHU5QThDXHU1OTdEXHU1M0NCJywgbGluazogJ3VzZXJfcmVsYXRpb25zaGlwX2ZyaWVuZF9jaGVjay5odG1sJyB9LFxyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTIyMFx1OTY2NFx1NTM1NVx1NEUyQVx1NTk3RFx1NTNDQicsIGxpbms6ICd1c2VyX3JlbGF0aW9uc2hpcF9mcmllbmRfcmVtb3ZlLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1MjIwXHU5NjY0XHU2MjQwXHU2NzA5XHU1OTdEXHU1M0NCJywgbGluazogJ3VzZXJfcmVsYXRpb25zaGlwX2ZyaWVuZF9yZW1vdmVfYWxsLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4QkJFXHU3RjZFXHU1OTdEXHU1M0NCXHU1OTA3XHU2Q0U4JywgbGluazogJ3VzZXJfcmVsYXRpb25zaGlwX3JlbWFya19zZXQuaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTUyMDZcdTk4NzVcdTgzQjdcdTUzRDZcdTU5N0RcdTUzQ0JcdTUyMTdcdTg4NjgnLCBsaW5rOiAndXNlcl9yZWxhdGlvbnNoaXBfZnJpZW5kX2xpc3RfcGFnZWQuaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTRFMDBcdTZCMjFcdTYwMjdcdTgzQjdcdTUzRDZcdTU5N0RcdTUzQ0JcdTUyMTdcdTg4NjgnLCBsaW5rOiAndXNlcl9yZWxhdGlvbnNoaXBfZnJpZW5kX2xpc3Rfb2J0YWluLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1QkZDXHU1MTY1XHU1OTdEXHU1M0NCXHU1MjE3XHU4ODY4JywgbGluazogJ3VzZXJfcmVsYXRpb25zaGlwX2ZyaWVuZF9pbXBvcnQuaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTZERkJcdTUyQTBcdTc1MjhcdTYyMzdcdTgxRjNcdTlFRDFcdTU0MERcdTUzNTUnLCBsaW5rOiAndXNlcl9yZWxhdGlvbnNoaXBfYmxvY2tsaXN0X2FkZC5odG1sJyB9LFxyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1x1NEVDRVx1OUVEMVx1NTQwRFx1NTM1NVx1NEUyRFx1NzlGQlx1OTY2NFx1NzUyOFx1NjIzNycsIGxpbms6ICd1c2VyX3JlbGF0aW9uc2hpcF9ibG9ja2xpc3RfcmVtb3ZlLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4M0I3XHU1M0Q2XHU5RUQxXHU1NDBEXHU1MzU1XHU1MjE3XHU4ODY4JywgbGluazogJ3VzZXJfcmVsYXRpb25zaGlwX2Jsb2NrbGlzdF9vYnRhaW4uaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTY4MjFcdTlBOENcdTlFRDFcdTU0MERcdTUzNTUnLCBsaW5rOiAndXNlcl9yZWxhdGlvbnNoaXBfYmxvY2tsaXN0X2NoZWNrLmh0bWwnIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NzUyOFx1NjIzN1x1NTE2OFx1NUM0MFx1Nzk4MVx1OEEwMCcsIGxpbms6ICd1c2VyX2dsb2JhbF9tdXRlLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTc1MjhcdTYyMzdcdTY1MzZcdTg1Q0YnLCBsaW5rOiAndXNlcl9mYXZvcml0ZS5odG1sJ31cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHsgXHJcbiAgICAgICAgdGV4dDogJ1x1NzlCQlx1N0VCRlx1NjNBOFx1OTAwMScsXHJcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NzlCQlx1N0VCRlx1NjNBOFx1OTAwMVx1OEJCRVx1N0Y2RScsIGxpbms6ICdwdXNoLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTc5QkJcdTdFQkZcdTYzQThcdTkwMDFcdTc2ODRcdTZEODhcdTYwNkZcdTYyNjlcdTVDNTUnLCBsaW5rOiAncHVzaF9leHRlbnNpb24uaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NjdFNVx1OEJFMlx1NzlCQlx1N0VCRlx1NjNBOFx1OTAwMVx1N0VEM1x1Njc5QycsIGxpbms6ICdwdXNoX3Jlc3VsdF9zdGF0aXN0aWNzLmh0bWwnIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHsgXHJcbiAgICAgICAgdGV4dDogJ1x1NTE3M1x1OTUyRVx1OEJDRFx1NTQwRFx1NTM1NScsXHJcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NTIxQlx1NUVGQVx1NTE3M1x1OTUyRVx1OEJDRFx1NTQwRFx1NTM1NScsIGxpbms6ICdrZXl3b3JkX2xpc3RfY3JlYXRlLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTRGRUVcdTY1MzlcdTUxNzNcdTk1MkVcdThCQ0RcdTU0MERcdTUzNTUnLCBsaW5rOiAna2V5d29yZF9saXN0X21vZGlmeS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2N0U1XHU4QkUyXHU1MTczXHU5NTJFXHU4QkNEXHU1NDBEXHU1MzU1JywgbGluazogJ2tleXdvcmRfbGlzdF9xdWVyeS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1MjIwXHU5NjY0XHU1MTczXHU5NTJFXHU4QkNEXHU1NDBEXHU1MzU1JywgbGluazogJ2tleXdvcmRfbGlzdF9kZWxldGUuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NkRGQlx1NTJBMFx1NTE3M1x1OTUyRVx1OEJDRCcsIGxpbms6ICdrZXl3b3JkX2FkZC5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU0RkVFXHU2NTM5XHU1MTczXHU5NTJFXHU4QkNEJywgbGluazogJ2tleXdvcmRfbW9kaWZ5Lmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTY3RTVcdThCRTJcdTUxNzNcdTk1MkVcdThCQ0QnLCBsaW5rOiAna2V5d29yZF9xdWVyeS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1MjIwXHU5NjY0XHU1MzU1XHU0RTJBXHU1MTczXHU5NTJFXHU4QkNEJywgbGluazogJ2tleXdvcmRfZGVsZXRlLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTYyNzlcdTkxQ0ZcdTUyMjBcdTk2NjRcdTUxNzNcdTk1MkVcdThCQ0QnLCBsaW5rOiAna2V5d29yZF9kZWxldGVfYmF0Y2guaHRtbCcgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBvbmx5OiBbJ3NlcnZlci1zaWRlJ11cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdTZXJ2ZXIgU0RLJyxcclxuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiAnSmF2YSBTZXJ2ZXIgU0RLIDIuMCcsIGxpbms6ICdqYXZhX3NlcnZlcl9zZGtfMi4wLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ0phdmEgU2VydmVyIFNESyAxLjAnLCBsaW5rOiAnamF2YV9zZXJ2ZXJfc2RrLmh0bWwnIH0sXHJcbiAgICAgIC8vIHsgdGV4dDogJ1BIUCBTZXJ2ZXIgU0RLJywgbGluazogJ3BocF9zZXJ2ZXJfc2RrLmh0bWwnIH1cclxuICAgIF0sXHJcbiAgICBvbmx5OiBbJ3NlcnZlci1zaWRlJ11cclxuICB9LFxyXG4gIHsgdGV4dDogJ1x1OTUxOVx1OEJFRlx1NzgwMScsIGxpbms6ICdlcnJvci5odG1sJywgb25seTogWydzZXJ2ZXItc2lkZSddfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU4QkJFXHU3RjZFXHU1NkRFXHU4QzAzJyxcclxuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiAnXHU1NkRFXHU4QzAzXHU2OTgyXHU4RkYwJywgbGluazogJ2NhbGxiYWNrX292ZXJ2aWV3Lmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NTNEMVx1OTAwMVx1NTI0RFx1NTZERVx1OEMwMycsIGxpbms6ICdjYWxsYmFja19wcmVzZW5kaW5nLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NTNEMVx1OTAwMVx1NTQwRVx1NTZERVx1OEMwMycsIGxpbms6ICdjYWxsYmFja19wb3N0c2VuZGluZy5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTUzRDFcdTkwMDFcdTU0MEVcdTU2REVcdThDMDNcdTRFOEJcdTRFRjYnLFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTc1MjhcdTYyMzdcdTc2N0JcdTUxNjUvXHU3NjdCXHU1MUZBJywgbGluazogJ2NhbGxiYWNrX2xvZ2luX2xvZ291dC5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1M0QxXHU5MDAxXHU2RDg4XHU2MDZGJywgbGluazogJ2NhbGxiYWNrX21lc3NhZ2Vfc2VuZC5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1M0QxXHU5MDAxXHU1MzU1XHU4MDRBXHU2RDg4XHU2MDZGXHU1REYyXHU4QkZCXHU1NkRFXHU2MjY3JywgbGluazogJ2NhbGxiYWNrX3NpbmdsZV9yZWFkX2Fjay5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1M0QxXHU5MDAxXHU3RkE0XHU4MDRBXHU2RDg4XHU2MDZGXHU1REYyXHU4QkZCXHU1NkRFXHU2MjY3JywgbGluazogJ2NhbGxiYWNrX2dyb3VwX3JlYWRfYWNrLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTUzRDFcdTkwMDFcdTRGMUFcdThCRERcdTVERjJcdThCRkJcdTU2REVcdTYyNjcnLCBsaW5rOiAnY2FsbGJhY2tfc2luZ2xlX2NvbnZlcnNhdGlvbl9hY2suaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NEZFRVx1NjUzOVx1NkQ4OFx1NjA2RicsIGxpbms6ICdjYWxsYmFja19tZXNzYWdlX21vZGlmeS5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2NEE0XHU1NkRFXHU2RDg4XHU2MDZGJywgbGluazogJ2NhbGxiYWNrX21lc3NhZ2VfcmVjYWxsLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdGQTRcdTdFQzQvXHU4MDRBXHU1OTI5XHU1QkE0XHU2NENEXHU0RjVDXHVGRjA4XHU2NUIwXHVGRjA5JywgXHJcbiAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTIxQlx1NUVGQVx1N0ZBNFx1N0VDNC9cdTgwNEFcdTU5MjlcdTVCQTQnLCBsaW5rOiAnY2FsbGJhY2tfZ3JvdXBfcm9vbV9jcmVhdGUuaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTY2RjRcdTY1QjBcdTdGQTRcdTdFQzQvXHU4MDRBXHU1OTI5XHU1QkE0JyxcclxuICAgICAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2NkY0XHU2NUIwXHU3RkE0XHU3RUM0X1x1ODA0QVx1NTkyOVx1NUJBNFx1NEZFMVx1NjA2RicsIGxpbms6ICdjYWxsYmFja19ncm91cF9yb29tX2luZm8uaHRtbCcgfSxcclxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1M0Q4XHU2NkY0XHU3RkE0XHU0RTNCL1x1ODA0QVx1NTkyOVx1NUJBNFx1NjI0MFx1NjcwOVx1ODAwNScsIGxpbms6ICdjYWxsYmFja19ncm91cF9yb29tX293bmVyLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1OEJCRVx1N0Y2RS9cdTY2RjRcdTY1QjBcdTUxNkNcdTU0NEEnLCBsaW5rOiAnY2FsbGJhY2tfZ3JvdXBfcm9vbV9hbm5vdW5jZW1lbnQuaHRtbCcgfSxcclxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1QzAxXHU3OTgxL1x1ODlFM1x1Nzk4MVx1N0ZBNFx1N0VDNCcsIGxpbms6ICdjYWxsYmFja19ncm91cF9iYW4uaHRtbCcgfSxcclxuICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1MTY4XHU1NDU4XHU3OTgxXHU4QTAwJywgbGluazogJ2NhbGxiYWNrX2dyb3VwX3Jvb21fbXV0ZWFsbC5odG1sJyB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTUyMjBcdTk2NjRcdTdGQTRcdTdFQzQvXHU4MDRBXHU1OTI5XHU1QkE0JywgbGluazogJ2NhbGxiYWNrX2dyb3VwX3Jvb21fZGVsZXRlLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1QzRGXHU4NTNEL1x1ODlFM1x1OTY2NFx1NUM0Rlx1ODUzRFx1N0ZBNFx1N0VDNCcsIGxpbms6ICdjYWxsYmFja19ncm91cF9ibG9jay5odG1sJyB9LFxyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1x1NEUwQVx1NEYyMC9cdTUyMjBcdTk2NjRcdTdGQTRcdTUxNzFcdTRFQUJcdTY1ODdcdTRFRjYnLCBsaW5rOiAnY2FsbGJhY2tfZ3JvdXBfc2hhcmVkX2ZpbGUuaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTc1MjhcdTYyMzdcdTUyQTBcdTUxNjUnLCBsaW5rOiAnY2FsbGJhY2tfZ3JvdXBfcm9vbV9qb2luLmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2MjEwXHU1NDU4XHU3OUJCXHU1RjAwJywgbGluazogJ2NhbGxiYWNrX2dyb3VwX3Jvb21fbGVhdmUuaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTZERkJcdTUyQTAvXHU3OUZCXHU5NjY0XHU3QkExXHU3NDA2XHU1NDU4JywgbGluazogJ2NhbGxiYWNrX2dyb3VwX3Jvb21fYWRtaW4uaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTUyQTBcdTUxNjUvXHU3OUZCXHU1MUZBXHU3OTgxXHU4QTAwXHU1MjE3XHU4ODY4JywgbGluazogJ2NhbGxiYWNrX2dyb3VwX3Jvb21fbXV0ZS5odG1sJyB9LFxyXG4gICAgICAgICAgICAgIHsgdGV4dDogJ1x1NkRGQlx1NTJBMC9cdTc5RkJcdTUxRkFcdTc2N0RcdTU0MERcdTUzNTUnLCBsaW5rOiAnY2FsbGJhY2tfZ3JvdXBfcm9vbV9hbGxvd2xpc3QuaHRtbCcgfSxcclxuICAgICAgICAgICAgICB7IHRleHQ6ICdcdTUyQTBcdTUxNjUvXHU3OUZCXHU1MUZBXHU5RUQxXHU1NDBEXHU1MzU1JywgbGluazogJ2NhbGxiYWNrX2dyb3VwX3Jvb21fYmxvY2tsaXN0Lmh0bWwnIH0sXHJcbiAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2REZCXHU1MkEwL1x1NzlGQlx1OTY2NFx1ODA0QVx1NTkyOVx1NUJBNFx1OEQ4NVx1N0VBN1x1N0JBMVx1NzQwNlx1NTQ1OCcsIGxpbms6ICdjYWxsYmFja19yb29tX3N1cGVyYWRtaW4uaHRtbCcgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3RkE0XHU3RUM0L1x1ODA0QVx1NTkyOVx1NUJBNFx1NjRDRFx1NEY1Q1x1RkYwOFx1NjVFN1x1RkYwOScsIGxpbms6ICdjYWxsYmFja19ncm91cF9yb29tX29sZC5odG1sJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3NTI4XHU2MjM3XHU1MTczXHU3Q0ZCXHU2NENEXHU0RjVDJywgbGluazogJ2NhbGxiYWNrX2NvbnRhY3QuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NzlCQlx1N0VCRlx1NjNBOFx1OTAwMScsIGxpbms6ICdjYWxsYmFja19vZmZsaW5lX3B1c2guaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1JlYWN0aW9uJywgbGluazogJ2NhbGxiYWNrX3JlYWN0aW9uLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdUaHJlYWQnLCBsaW5rOiAnY2FsbGJhY2tfdGhyZWFkLmh0bWwnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTY1NEZcdTYxMUZcdThCQ0RcdTc2RDFcdTZENEInLCBsaW5rOiAnY2FsbGJhY2tfc2Vuc2l0aXZlX3dvcmQuaHRtbCcgfVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgXSxcclxuICAgIG9ubHk6IFsnc2VydmVyLXNpZGUnXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NURGMlx1NUU5Rlx1NUYwM1x1NTE4NVx1NUJCOScsXHJcbiAgICBjaGlsZHJlbjogW1xyXG4gICAgICB7IHRleHQ6ICdcdTkwMUFcdThGQzdcdTc1MjhcdTYyMzcgSUQgXHU1NDhDXHU1QkM2XHU3ODAxXHU4M0I3XHU1M0Q2XHU3NTI4XHU2MjM3IHRva2VuJywgbGluazogJ2Vhc2Vtb2JfdXNlcl90b2tlbl9wYXNzd29yZC5odG1sJyB9XHJcbiAgICBdLFxyXG4gICAgb25seTogWydzZXJ2ZXItc2lkZSddXHJcbiAgfSxcclxuXVxyXG5cclxuZnVuY3Rpb24gYnVpbGREb2NTaWRlYmFyKCkge1xyXG4gIGNvbnN0IHJlc3VsdCA9IHt9XHJcbiAgcGxhdGZvcm1MaXN0LmZvckVhY2gocGxhdGZvcm0gPT4ge1xyXG4gICAgY29uc3Qga2V5ID0gYC9kb2N1bWVudC8ke3BsYXRmb3JtfS9gXHJcbiAgICByZXN1bHRba2V5XSA9IGRvY3VtZW50U2lkZWJhci5tYXAoc2lkZWJhciA9PiBoYW5kbGVTaWRlYmFySXRlbShwbGF0Zm9ybSwgc2lkZWJhcikpLmZpbHRlcihzID0+IHMpXHJcbiAgfSk7XHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbGlua0V4aXN0cyhwbGF0Zm9ybTogc3RyaW5nLCBsaW5rOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgZmlsZVBhdGggPSBgJHtET0NfUEFUSH0vJHtwbGF0Zm9ybX0vJHtsaW5rLnJlcGxhY2UoLy5odG1sJC8sICcubWQnKX1gO1xyXG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGNoZWNraW5nIGZpbGUgZXhpc3RlbmNlOiAke2V9YCk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBmdW5jdGlvbiBoYW5kbGVTaWRlYmFySXRlbShwbGF0Zm9ybTogc3RyaW5nLCBzaWRlYmFyOiBhbnkpOiBhbnkge1xyXG4vLyAgIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuaXNBcnJheShzaWRlYmFyLmNoaWxkcmVuKSA/IHNpZGViYXIuY2hpbGRyZW4gOiBbXTtcclxuLy8gICBjb25zdCBuZXdjaGlsZHJlbiA9IFtdO1xyXG4vLyAgIGZvciAoY29uc3QgaXRlbSBvZiBjaGlsZHJlbikge1xyXG4vLyAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcclxuLy8gICAgICAgY29uc3QgbmV3U3ViY2hpbGRyZW4gPSBpdGVtLmNoaWxkcmVuLm1hcCgoc3ViSXRlbSkgPT4gaGFuZGxlU2lkZWJhckl0ZW0ocGxhdGZvcm0sIHN1Ykl0ZW0pKS5maWx0ZXIoQm9vbGVhbik7XHJcbi8vICAgICAgIGZvciAoY29uc3Qgc3ViSXRlbSBvZiBuZXdTdWJjaGlsZHJlbikge1xyXG4vLyAgICAgICAgIGlmICghbmV3Y2hpbGRyZW4uc29tZSgoaSkgPT4gaS5saW5rID09PSBzdWJJdGVtLmxpbmspKSB7XHJcbi8vICAgICAgICAgICBuZXdjaGlsZHJlbi5wdXNoKHN1Ykl0ZW0pO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgfVxyXG4vLyAgICAgfSBlbHNlIGlmIChsaW5rRXhpc3RzKHBsYXRmb3JtLCBpdGVtLmxpbmspKSB7XHJcbi8vICAgICAgIGNvbnN0IGRvY3VtZW50TGluayA9IGAvZG9jdW1lbnQvJHtwbGF0Zm9ybX0vJHtpdGVtLmxpbmsucmVwbGFjZSgvLmh0bWwkLywgJycpfWA7XHJcbi8vICAgICAgIG5ld2NoaWxkcmVuLnB1c2goeyAuLi5pdGVtLCBsaW5rOiBkb2N1bWVudExpbmsgfSk7XHJcbi8vICAgICB9XHJcbi8vICAgfVxyXG4vLyAgIHJldHVybiBuZXdjaGlsZHJlbi5sZW5ndGggPyB7IC4uLnNpZGViYXIsIGNoaWxkcmVuOiBuZXdjaGlsZHJlbiB9IDogbnVsbDtcclxuLy8gfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVNpZGViYXJJdGVtKHBsYXRmb3JtLCBzaWRlYmFyKSB7XHJcbiAgY29uc3QgaGFzQ2hpbGRyZW4gPSBzaWRlYmFyLmhhc093blByb3BlcnR5KCdjaGlsZHJlbicpICYmIHNpZGViYXIuY2hpbGRyZW4ubGVuZ3RoID4wXHJcbiAgY29uc3QgaGFzT25seSA9IHNpZGViYXIuaGFzT3duUHJvcGVydHkoJ29ubHknKSAmJiBzaWRlYmFyLm9ubHkubGVuZ3RoID4wXHJcbiAgY29uc3QgaGFzRXhjZXB0ID0gc2lkZWJhci5oYXNPd25Qcm9wZXJ0eSgnZXhjZXB0JykgJiYgc2lkZWJhci5leGNlcHQubGVuZ3RoID4wXHJcblxyXG4gIGxldCBuZWVkVGhpc1BsYXRmb3JtID0gdHJ1ZVxyXG4gIGlmIChoYXNPbmx5KSB7XHJcbiAgICBuZWVkVGhpc1BsYXRmb3JtID0gc2lkZWJhci5vbmx5LmluZGV4T2YocGxhdGZvcm0pID4gLTFcclxuICB9XHJcbiAgaWYgKGhhc0V4Y2VwdCkge1xyXG4gICAgbmVlZFRoaXNQbGF0Zm9ybSA9IHNpZGViYXIuZXhjZXB0LmluZGV4T2YocGxhdGZvcm0pID09IC0xXHJcbiAgfVxyXG5cclxuICBpZiAoIW5lZWRUaGlzUGxhdGZvcm0pIHtcclxuICAgIHJldHVybiBudWxsXHJcbiAgfVxyXG5cclxuICBpZiAoaGFzQ2hpbGRyZW4pIHtcclxuICAgIGxldCBuZXdjaGlsZHJlbiA9IHNpZGViYXIuY2hpbGRyZW4ubWFwKHMgPT4gaGFuZGxlU2lkZWJhckl0ZW0ocGxhdGZvcm0sIHMpKS5maWx0ZXIocz0+cylcclxuICAgIC8vIG5ld2NoaWxkcmVuID0gbmV3Y2hpbGRyZW4ucmVkdWNlKChyLCBjdXIpPT4ge1xyXG4gICAgLy8gICByZXR1cm4gci5maW5kKGkgPT4gaS5saW5rID09PSBjdXIubGluayk/IHI6IFsuLi5yLCBjdXJdXHJcbiAgICAvLyB9LCBbXSlcclxuICAgIGlmIChuZXdjaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJldHVybiB7Li4uc2lkZWJhciwgY2hpbGRyZW46IG5ld2NoaWxkcmVuIH1cclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGxpbmtFeGlzdHMocGxhdGZvcm0sIHNpZGViYXIubGluaykpIHtcclxuICAgICAgY29uc3QgbmV3TGluayA9IGAvZG9jdW1lbnQvJHtwbGF0Zm9ybX0vJHtzaWRlYmFyLmxpbmt9YFxyXG4gICAgICByZXR1cm4gey4uLnNpZGViYXIsIGxpbms6bmV3TGlua31cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBET0NfU0lERUJBUiA9IGJ1aWxkRG9jU2lkZWJhcigpXHJcblxyXG4vLyBjb25zb2xlLmRpcihidWlsZERvY1NpZGViYXIoKSwge2RlcHRoOiBudWxsfSlcclxuXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDovRWFzZW1vYi9HaXRodWJfTGlicmFyeV9TdW1tYXJ5L2Vhc2Vtb2JfZG9jL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEVhc2Vtb2JcXFxcR2l0aHViX0xpYnJhcnlfU3VtbWFyeVxcXFxlYXNlbW9iX2RvY1xcXFxkb2NzXFxcXC52dWVwcmVzc1xcXFxzaWRlYmFyXFxcXHVpa2l0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9FYXNlbW9iL0dpdGh1Yl9MaWJyYXJ5X1N1bW1hcnkvZWFzZW1vYl9kb2MvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci91aWtpdC50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcclxuaW1wb3J0IGZzIGZyb20gXCJub2RlOmZzXCI7XHJcblxyXG5jb25zdCBnZXRTdWJEaXJlY3RvcmllcyA9IChkaXIpID0+XHJcbiAgZnNcclxuICAgIC5yZWFkZGlyU3luYyhkaXIpXHJcbiAgICAuZmlsdGVyKChpdGVtKSA9PiBmcy5zdGF0U3luYyhwYXRoLmpvaW4oZGlyLCBpdGVtKSkuaXNEaXJlY3RvcnkoKSk7XHJcbmNvbnN0IENIQVRfRE9DX1BBVEggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uLy4uL3Vpa2l0L2NoYXR1aWtpdFwiKTtcclxuY29uc3QgQ0hBVFJPT01fRE9DX1BBVEggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uLy4uL3Vpa2l0L2NoYXRyb29tdWlraXRcIik7XHJcbmNvbnN0IGNoYXRQbGF0Zm9ybUxpc3QgPSBnZXRTdWJEaXJlY3RvcmllcyhDSEFUX0RPQ19QQVRIKTtcclxuY29uc3QgY2hhdHJvb21QbGF0Zm9ybUxpc3QgPSBnZXRTdWJEaXJlY3RvcmllcyhDSEFUUk9PTV9ET0NfUEFUSCk7XHJcblxyXG5jb25zdCBjaGF0VWlraXRTaWRlYmFyID0gW1xyXG4gIHtcclxuICAgIC8qXHJcbiAgICAgIHRleHQ6IFx1NTIwNlx1N0VDNFx1NjgwN1x1OTg5OFxyXG4gICAgICBjaGlsZHJlbjogXHU1MjA2XHU3RUM0XHU1QkZDXHU4MjJBXHU1MjE3XHU4ODY4XHJcbiAgICAgICAgdGV4dDogXHU2NjNFXHU3OTNBXHU3Njg0XHU2NTg3XHU2NzJDXHJcbiAgICAgICAgbGluazogXHU5NEZFXHU2M0E1XHU1NzMwXHU1NzQwXHJcbiAgICAgICAgc2hvdzogXHU0RTBEXHU1QjU4XHU1NzI4XHU2MjE2XHU4MDA1XHU1MDNDXHU0RTNBIHRydWUgXHU2NUY2XHVGRjBDXHU4M0RDXHU1MzU1XHU2NjNFXHU3OTNBXHVGRjFCXHU1QjU4XHU1NzI4XHU1RTc2XHU0RTE0XHU1MDNDXHU0RTNBIGZhbHNlIFx1NjVGNlx1RkYwQ1x1ODNEQ1x1NTM1NVx1NEUwRFx1NjYzRVx1NzkzQVxyXG4gICAgICAgIG9ubHk6IFx1NjU3MFx1N0VDNFx1NUY2Mlx1NUYwRlx1RkYwQ1x1NTNFQVx1NjcwOVx1NTcyOFx1NjU3MFx1N0VDNFx1NEUyRFx1NzY4NFx1NUU3M1x1NTNGMFx1NEUwQlx1NjYzRVx1NzkzQVxyXG4gICAgICAgIGV4Y2VwdDogXHU2NTcwXHU3RUM0XHU1RjYyXHU1RjBGXHVGRjBDXHU5NjY0XHU0RTg2XHU2NTcwXHU3RUM0XHU0RTJEXHU2MzA3XHU1QjlBXHU3Njg0XHU1RTczXHU1M0YwXHU1OTE2XHU5MEZEXHU2NjNFXHU3OTNBXHJcbiAgICAgICAgY29sbGFwc2libGU6IFx1NUI1MFx1ODNEQ1x1NTM1NVx1NjYyRlx1NTQyNlx1NTE0MVx1OEJCOFx1NUM1NVx1NUYwMC9cdTY1MzZcdThENzdcdUZGMEN0cnVlOiBcdTUxNDFcdThCQjg7IGZhbHNlOiBcdTRFMERcdTUxNDFcdThCQjhcdTMwMDJcdThCRjdcdTUzQzJcdTgwMDNcdTMwMENcdTVCNTBcdTgzRENcdTUzNTVcdTc5M0FcdTRGOEJcdTMwMERcclxuICAgICAgICBjaGlsZHJlbjogXHU1QjUwXHU4M0RDXHU1MzU1XHUzMDAyXHU4QkY3XHU1M0MyXHU4MDAzXHUzMDBDXHU1QjUwXHU4M0RDXHU1MzU1XHU3OTNBXHU0RjhCXHUzMDBEXHJcbiAgICAqL1xyXG4gICAgdGV4dDogXCJcdTRFQTdcdTU0QzFcdTRFQ0JcdTdFQ0RcIixcclxuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiBcIlx1Njk4Mlx1OEZGMFwiLCBsaW5rOiBcImNoYXR1aWtpdF9vdmVydmlldy5odG1sXCIgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6IFwiXHU3Mjc5XHU2MDI3XCIsXHJcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgdGV4dDogXCJcdTkwMUFcdTc1MjhcIiwgbGluazogXCJjaGF0ZmVhdHVyZV9jb21tb24uaHRtbFwiIH0sXHJcbiAgICAgICAgICB7IHRleHQ6IFwiXHU0RjFBXHU4QkREXCIsIGxpbms6IFwiY2hhdGZlYXR1cmVfY29udmVyc2F0aW9uLmh0bWxcIiB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiBcIlx1NkQ4OFx1NjA2RlwiLCBsaW5rOiBcImNoYXRmZWF0dXJlX21lc3NhZ2UuaHRtbFwiIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBvbmx5OiBbXCJpb3NcIl0sXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiBcIlx1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQlwiLFxyXG4gICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICBjaGlsZHJlbjogW1xyXG4gICAgICB7IHRleHQ6IFwiXHU4REQxXHU5MDFBXHU3OTNBXHU0RjhCXHU5ODc5XHU3NkVFXCIsIGxpbms6IFwiY2hhdHVpa2l0X3J1bi5odG1sXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1OTZDNlx1NjIxMFx1NTM1NVx1N0ZBNFx1ODA0QSBVSUtpdFwiLCBsaW5rOiBcImNoYXR1aWtpdF9pbnRlZ3JhdGVkLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU1RkVCXHU5MDFGXHU1RjAwXHU1OUNCXCIsIGxpbms6IFwiY2hhdHVpa2l0X3F1aWNrc3RhcnQuaHRtbFwiIH0sXHJcbiAgICBdLFxyXG4gICAgb25seTogW1wiaW9zXCJdLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogXCJcdTk2QzZcdTYyMTBcdTY1ODdcdTY4NjNcIixcclxuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiBcIlx1NEUzQlx1OTg5OFwiLCBsaW5rOiBcImNoYXR1aWtpdF90aGVtZS5odG1sXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1NEYxQVx1OEJERFx1NTIxN1x1ODg2OFwiLCBsaW5rOiBcImNoYXR1aWtpdF9jdXN0b21fY29udmVyc2F0aW9uX2xpc3QuaHRtbFwiIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiBcIlx1NkQ4OFx1NjA2RlwiLFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6IFwiXHU4MUVBXHU1QjlBXHU0RTQ5XHU4MDRBXHU1OTI5XHU5ODc1XHU5NzYyXCIsIGxpbms6IFwiY2hhdHVpa2l0X2N1c3RvbV9jaGF0Lmh0bWxcIiB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIlx1NUI5RVx1NzNCMFx1NjVCMFx1N0M3Qlx1NTc4Qlx1ODFFQVx1NUI5QVx1NEU0OVx1NkQ4OFx1NjA2RiBDZWxsXCIsXHJcbiAgICAgICAgICAgIGxpbms6IFwiY2hhdHVpa2l0X2N1c3RvbV9jZWxsLmh0bWxcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1OTAxQVx1OEJBRlx1NUY1NVwiLCBsaW5rOiBcImNoYXR1aWtpdF9jdXN0b21fY29udGFjdF9saXN0Lmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU4MDU0XHU3Q0ZCXHU0RUJBXHU4QkU2XHU2MEM1XCIsIGxpbms6IFwiY2hhdHVpa2l0X2N1c3RvbV9jb250YWN0X2RldGFpbHMuaHRtbFwiIH0sXHJcbiAgICAgIHsgdGV4dDogXCJcdTdGQTRcdThCRTZcdTYwQzVcIiwgbGluazogXCJjaGF0dWlraXRfY3VzdG9tX2dyb3VwX2RldGFpbHMuaHRtbFwiIH0sXHJcbiAgICAgIHsgdGV4dDogXCJcdTkwMUFcdTc1MjhcdTUzRUZcdTkxNERcdTk4NzlcIiwgbGluazogXCJjaGF0dWlraXRfY29uZmlnX2l0ZW0uaHRtbFwiIH0sXHJcbiAgICAgIHsgdGV4dDogXCJcdThGREJcdTk2MzZcdTc1MjhcdTZDRDVcIiwgbGluazogXCJjaGF0dWlraXRfYWR2YW5jZWR1c2FnZS5odG1sXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1NTZGRFx1OTY0NVx1NTMxNlwiLCBsaW5rOiBcImNoYXR1aWtpdF9pbnRlcm5hdGlvbmFsaXphdGlvbi5odG1sXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1OTg3NVx1OTc2MiBWaWV3TW9kZWwgXHU0RTJEXHU1M0VGXHU5MUNEXHU4RjdEXHU2NUI5XHU2Q0Q1XCIsIGxpbms6IFwiY2hhdHVpa2l0X2xpc3RlbmVyLmh0bWxcIiB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogXCJcdTYyRTZcdTYyMkFcdTRFM0JcdTg5ODFcdTk4NzVcdTk3NjJcdTcwQjlcdTUxRkJcdThERjNcdThGNkNcdTRFOEJcdTRFRjZcIixcclxuICAgICAgICBsaW5rOiBcImNoYXR1aWtpdF9jdXN0b21pemVfY2xpY2tqdW1wLmh0bWxcIixcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBvbmx5OiBbXCJpb3NcIl0sXHJcbiAgfSxcclxuICB7IHRleHQ6IFwiXHU4QkJFXHU4QkExXHU2MzA3XHU1MzU3XCIsIGxpbms6IFwiY2hhdHVpa2l0X2Rlc2lnbl9ndWlkZS5odG1sXCIsIG9ubHk6IFtcImlvc1wiXX0sXHJcbiAge1xyXG4gICAgdGV4dDogXCJcdTRFQTdcdTU0QzFcdTRFQ0JcdTdFQ0RcIixcclxuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiBcIlx1Njk4Mlx1OEZGMFwiLCBsaW5rOiBcImNoYXR1aWtpdF9vdmVydmlldy5odG1sXCIgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6IFwiXHU3Mjc5XHU2MDI3XCIsXHJcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgIHsgdGV4dDogXCJcdTkwMUFcdTc1MjhcIiwgbGluazogXCJjaGF0ZmVhdHVyZV9jb21tb24uaHRtbFwiIH0sXHJcbiAgICAgICAgICB7IHRleHQ6IFwiXHU0RjFBXHU4QkREXCIsIGxpbms6IFwiY2hhdGZlYXR1cmVfY29udmVyc2F0aW9uLmh0bWxcIiB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiBcIlx1NkQ4OFx1NjA2RlwiLCBsaW5rOiBcImNoYXRmZWF0dXJlX21lc3NhZ2UuaHRtbFwiIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBvbmx5OiBbXCJ3ZWJcIl0sXHJcbiAgfSxcclxuICB7IHRleHQ6IFwiXHU1RkVCXHU5MDFGXHU1RjAwXHU1OUNCXCIsIGxpbms6IFwiY2hhdHVpa2l0X3F1aWNrc3RhcnQuaHRtbFwiLCBvbmx5OiBbXCJ3ZWJcIl19LFxyXG4gIHtcclxuICAgIHRleHQ6IFwiXHU5NkM2XHU2MjEwXHU2NTg3XHU2ODYzXCIsXHJcbiAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiBcIlJlYWN0IFx1OTZDNlx1NjIxMFx1NTM1NVx1N0ZBNFx1ODA0QSBVSUtpdFwiLFxyXG4gICAgICAgIGxpbms6IFwiY2hhdHVpa2l0X2ludGVncmF0ZWRfcmVhY3QuaHRtbFwiLFxyXG4gICAgICB9LFxyXG4gICAgICB7IHRleHQ6IFwiVnVlIFx1OTZDNlx1NjIxMFx1NTM1NVx1N0ZBNFx1ODA0QSBVSUtpdFwiLCBsaW5rOiBcImNoYXR1aWtpdF9pbnRlZ3JhdGVkX3Z1ZS5odG1sXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1NzUyOFx1NjIzN1x1NEZFMVx1NjA2Rlx1NjNEMFx1NEY5QlwiLCBsaW5rOiBcImNoYXR1aWtpdF9wcm92aWRlci5odG1sXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1NTE2OFx1NUM0MFx1NEUwQVx1NEUwQlx1NjU4N1wiLCBsaW5rOiBcImNoYXR1aWtpdF9jb250ZXh0Lmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU3NjdCXHU1RjU1XCIsIGxpbms6IFwiY2hhdHVpa2l0X2xvZ2luLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU0RThCXHU0RUY2XHU3NkQxXHU1NDJDXHU1NjY4XCIsIGxpbms6IFwiY2hhdHVpa2l0X2xpc3RlbmVyLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU0RTNCXHU5ODk4XCIsIGxpbms6IFwiY2hhdHVpa2l0X3RoZW1lLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU0RjFBXHU4QkREXHU1MjE3XHU4ODY4XCIsIGxpbms6IFwiY2hhdHVpa2l0X2NvbnZlcnNhdGlvbi5odG1sXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1NkQ4OFx1NjA2RlwiLCBsaW5rOiBcImNoYXR1aWtpdF9jaGF0Lmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU5MDFBXHU4QkFGXHU1RjU1XCIsIGxpbms6IFwiY2hhdHVpa2l0X2NvbnRhY3RsaXN0Lmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU5N0YzXHU4OUM2XHU5ODkxXHU5MDFBXHU4QkREXCIsIGxpbms6IFwiY2hhdHVpa2l0X3ZpZGVvLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU1NkZEXHU5NjQ1XHU1MzE2XCIsIGxpbms6IFwiY2hhdHVpa2l0X2ludGVybmF0aW9uYWxpemF0aW9uLmh0bWxcIiB9LFxyXG4gICAgXSxcclxuICAgIG9ubHk6IFtcIndlYlwiXSxcclxuICB9LFxyXG4gIHsgdGV4dDogXCJcdTdFQzRcdTRFRjZcdTY1ODdcdTY4NjNcIiwgbGluazogXCJjaGF0dWlraXRfc3Rvcnlib29rLmh0bWxcIiwgb25seTogW1wid2ViXCJdfSxcclxuICB7IHRleHQ6IFwiXHU4QkJFXHU4QkExXHU2MzA3XHU1MzU3XCIsIGxpbms6IFwiY2hhdHVpa2l0X2Rlc2lnbl9ndWlkZS5odG1sXCIsIG9ubHk6IFtcIndlYlwiXSB9LFxyXG4gIHtcclxuICAgIHRleHQ6IFwiXHU0RUE3XHU1NEMxXHU0RUNCXHU3RUNEXCIsXHJcbiAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHsgdGV4dDogXCJcdTY5ODJcdThGRjBcIiwgbGluazogXCJjaGF0dWlraXRfb3ZlcnZpZXcuaHRtbFwiIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiBcIlx1NzI3OVx1NjAyN1wiLFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6IFwiXHU5MDFBXHU3NTI4XCIsIGxpbms6IFwiY2hhdGZlYXR1cmVfY29tbW9uLmh0bWxcIiB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiBcIlx1NEYxQVx1OEJERFwiLCBsaW5rOiBcImNoYXRmZWF0dXJlX2NvbnZlcnNhdGlvbi5odG1sXCIgfSxcclxuICAgICAgICAgIHsgdGV4dDogXCJcdTZEODhcdTYwNkZcIiwgbGluazogXCJjaGF0ZmVhdHVyZV9tZXNzYWdlLmh0bWxcIiB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgb25seTogW1wiYW5kcm9pZFwiLCBcImhhcm1vbnlvc1wiLCBcInJlYWN0LW5hdGl2ZVwiLCBcImZsdXR0ZXJcIl0sXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiBcIlx1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQlwiLFxyXG4gICAgY29sbGFwc2libGU6IHRydWUsXHJcbiAgICBjaGlsZHJlbjogW1xyXG4gICAgICB7IHRleHQ6IFwiXHU4REQxXHU5MDFBXHU3OTNBXHU0RjhCXHU5ODc5XHU3NkVFXCIsIGxpbms6IFwiY2hhdHVpa2l0X3J1bi5odG1sXCIsIGV4Y2VwdDogW1wiYW5kcm9pZFwiLCAnaGFybW9ueW9zJ10gfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQlwiLCBsaW5rOiBcImNoYXR1aWtpdF9xdWlja3N0YXJ0Lmh0bWxcIiB9LFxyXG4gICAgXSxcclxuICAgIG9ubHk6IFtcImFuZHJvaWRcIiwgXCJoYXJtb255b3NcIiwgXCJyZWFjdC1uYXRpdmVcIiwgXCJmbHV0dGVyXCJdLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogXCJcdTk2QzZcdTYyMTBcdTY1ODdcdTY4NjNcIixcclxuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiBcIlx1OTZDNlx1NjIxMFx1NTM1NVx1N0ZBNFx1ODA0QSBVSUtpdFwiLCBsaW5rOiBcImNoYXR1aWtpdF9pbnRlZ3JhdGVkLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU0RTNCXHU5ODk4XCIsIGxpbms6IFwiY2hhdHVpa2l0X3RoZW1lLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU0RjFBXHU4QkREXHU1MjE3XHU4ODY4XCIsIGxpbms6IFwiY2hhdHVpa2l0X2NvbnZlcnNhdGlvbi5odG1sXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1NkQ4OFx1NjA2RlwiLCBsaW5rOiBcImNoYXR1aWtpdF9jaGF0Lmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU5MDFBXHU4QkFGXHU1RjU1XCIsIGxpbms6IFwiY2hhdHVpa2l0X2NvbnRhY3RsaXN0Lmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU4MDU0XHU3Q0ZCXHU0RUJBXHU4QkU2XHU2MEM1XCIsIGxpbms6IFwiY2hhdHVpa2l0X2N1c3RvbV9jb250YWN0X2RldGFpbHMuaHRtbFwiLCBleGNlcHQ6IFsnaGFybW9ueW9zJ10gfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1N0ZBNFx1OEJFNlx1NjBDNVwiLCBsaW5rOiBcImNoYXR1aWtpdF9jdXN0b21fZ3JvdXBfZGV0YWlscy5odG1sXCIsIGV4Y2VwdDogWydoYXJtb255b3MnXSB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU3NTI4XHU2MjM3XHU0RkUxXHU2MDZGXHU2M0QwXHU0RjlCXCIsIGxpbms6IFwiY2hhdHVpa2l0X3VzZXJpbmZvLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU1NkZEXHU5NjQ1XHU1MzE2XCIsIGxpbms6IFwiY2hhdHVpa2l0X2ludGVybmF0aW9uYWxpemF0aW9uLmh0bWxcIiwgZXhjZXB0OiBbJ2hhcm1vbnlvcyddIH0sXHJcbiAgICAgIHsgdGV4dDogXCJcdThGREJcdTk2MzZcdTc1MjhcdTZDRDVcIiwgbGluazogXCJjaGF0dWlraXRfYWR2YW5jZWR1c2FnZS5odG1sXCIsIGV4Y2VwdDogWydoYXJtb255b3MnXSB9LFxyXG4gICAgXSxcclxuICAgIG9ubHk6IFtcImFuZHJvaWRcIiwgXCJoYXJtb255b3NcIiwgXCJyZWFjdC1uYXRpdmVcIiwgXCJmbHV0dGVyXCJdLFxyXG4gIH0sXHJcbiAgeyB0ZXh0OiBcIlx1OEJCRVx1OEJBMVx1NjMwN1x1NTM1N1wiLCBsaW5rOiBcImNoYXR1aWtpdF9kZXNpZ25fZ3VpZGUuaHRtbFwiLCBvbmx5OiBbXCJhbmRyb2lkXCIsIFwiaGFybW9ueW9zXCIsIFwicmVhY3QtbmF0aXZlXCIsIFwiZmx1dHRlclwiXX0sXHJcbiAgeyB0ZXh0OiBcIlx1NjZGNFx1NjVCMFx1NjVFNVx1NUZEN1wiLCBsaW5rOiBcInJlbGVhc2Vub3RlLmh0bWxcIiwgIGV4Y2VwdDogW1widW5pYXBwXCJdfSxcclxuICB7IHRleHQ6IFwiXHU1RTM4XHU4OUMxXHU5NUVFXHU5ODk4XCIsIGxpbms6IFwiZmFxLmh0bWxcIiwgb25seTogW1wicmVhY3QtbmF0aXZlXCJdfSxcclxuXHJcbiAge1xyXG4gICAgdGV4dDogXCJcdTUzODZcdTUzRjJcdTY1ODdcdTY4NjNcIixcclxuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiBcIlx1NTM4Nlx1NTNGMlx1NjU4N1x1Njg2M1wiLCBsaW5rOiBcInVpX2hpc3RvcmljLmh0bWxcIiwgb25seTogW1wiYW5kcm9pZFwiLCBcImlvc1wiXSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogXCJVSUtpdCBcdTRFQ0JcdTdFQ0RcIixcclxuICAgICAgICBsaW5rOiBcInVpX292ZXJ2aWV3Lmh0bWxcIixcclxuICAgICAgICBleGNlcHQ6IFtcImFuZHJvaWRcIiwgXCJpb3NcIl0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiBcIlx1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQlwiLFxyXG4gICAgICAgIGxpbms6IFwidWlfcXVpY2tzdGFydC5odG1sXCIsXHJcbiAgICAgICAgZXhjZXB0OiBbXCJhbmRyb2lkXCIsIFwiaW9zXCJdLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogXCJcdTk2QzZcdTYyMTBcdTgwNEFcdTU5MjlcdTk4NzVcdTk3NjJcIixcclxuICAgICAgICBsaW5rOiBcInVpX2NoYXQuaHRtbFwiLFxyXG4gICAgICAgIGV4Y2VwdDogW1wiYW5kcm9pZFwiLCBcImlvc1wiXSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6IFwiXHU5NkM2XHU2MjEwXHU0RjFBXHU4QkREXHU1MjE3XHU4ODY4XHU5ODc1XHU5NzYyXCIsXHJcbiAgICAgICAgbGluazogXCJ1aV9jb252ZXJzYXRpb24uaHRtbFwiLFxyXG4gICAgICAgIGV4Y2VwdDogW1wiYW5kcm9pZFwiLCBcImlvc1wiXSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBvbmx5OiBbXCJhbmRyb2lkXCIsIFwicmVhY3QtbmF0aXZlXCIsIFwiZmx1dHRlclwiLCBcImlvc1wiXSxcclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6IFwiXHU0RUE3XHU1NEMxXHU0RUNCXHU3RUNEXCIsXHJcbiAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHsgdGV4dDogXCJcdTY5ODJcdThGRjBcIiwgbGluazogXCJjaGF0dWlraXRfb3ZlcnZpZXcuaHRtbFwiIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiBcIlx1NzI3OVx1NjAyN1wiLFxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICB7IHRleHQ6IFwiXHU5MDFBXHU3NTI4XCIsIGxpbms6IFwiY2hhdGZlYXR1cmVfY29tbW9uLmh0bWxcIiB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiBcIlx1NEYxQVx1OEJERFwiLCBsaW5rOiBcImNoYXRmZWF0dXJlX2NvbnZlcnNhdGlvbi5odG1sXCIgfSxcclxuICAgICAgICAgIHsgdGV4dDogXCJcdTZEODhcdTYwNkZcIiwgbGluazogXCJjaGF0ZmVhdHVyZV9tZXNzYWdlLmh0bWxcIiB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgb25seTogW1widW5pYXBwXCJdLFxyXG4gIH0sXHJcbiAgeyB0ZXh0OiBcIlx1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQlwiLCBsaW5rOiBcImNoYXR1aWtpdF9xdWlja3N0YXJ0Lmh0bWxcIiwgb25seTogW1widW5pYXBwXCJdfSxcclxuICB7IHRleHQ6IFwiXHU5NkM2XHU2MjEwXHU1MzU1XHU3RkE0XHU4MDRBIFVJS2l0XCIsIGxpbms6IFwiY2hhdHVpa2l0X2ludGVncmF0ZWQuaHRtbFwiLCBvbmx5OiBbXCJ1bmlhcHBcIl19LFxyXG4gIHsgdGV4dDogXCJcdThCQkVcdThCQTFcdTYzMDdcdTUzNTdcIiwgbGluazogXCJjaGF0dWlraXRfZGVzaWduX2d1aWRlLmh0bWxcIiwgb25seTogW1widW5pYXBwXCJdfSxcclxuICB7IHRleHQ6IFwiXHU2NkY0XHU2NUIwXHU2NUU1XHU1RkQ3XCIsIGxpbms6IFwicmVsZWFzZW5vdGUuaHRtbFwiLCBvbmx5OiBbXCJ1bmlhcHBcIl19XHJcbl07XHJcbmNvbnN0IGNoYXRyb29tVWlraXRTaWRlYmFyID0gW1xyXG4gIHsgdGV4dDogXCJcdTY5ODJcdThGRjBcIiwgbGluazogXCJyb29tdWlraXRfb3ZlcnZpZXcuaHRtbFwiIH0sXHJcbiAge1xyXG4gICAgdGV4dDogXCJcdTcyNzlcdTYwMjdcIixcclxuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiBcIlx1OTAxQVx1NzUyOFwiLCBsaW5rOiBcInJvb21mZWF0dXJlX2NvbW1vbi5odG1sXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1NkQ4OFx1NjA2Rlx1NjI2OVx1NUM1NVwiLCBsaW5rOiBcInJvb21mZWF0dXJlX21lc3NhZ2UuaHRtbFwiIH0sXHJcbiAgICAgIHsgdGV4dDogXCJcdTYyMTBcdTU0NThcdTdCQTFcdTc0MDZcIiwgbGluazogXCJyb29tZmVhdHVyZV9tZW1iZXIuaHRtbFwiIH0sXHJcbiAgICBdLFxyXG4gIH0sXHJcbiAgeyB0ZXh0OiBcIlx1OEREMVx1OTAxQVx1NzkzQVx1NEY4Qlx1OTg3OVx1NzZFRVwiLCBsaW5rOiBcInJvb211aWtpdF9ydW4uaHRtbFwiIH0sXHJcbiAgeyB0ZXh0OiBcIlx1OTZDNlx1NjIxMCBDaGF0cm9vbVVJS2l0XCIsIGxpbms6IFwicm9vbXVpa2l0X2ludGVncmF0ZWQuaHRtbFwiIH0sXHJcbiAgeyB0ZXh0OiBcIlx1NUZFQlx1OTAxRlx1NUYwMFx1NTlDQlwiLCBsaW5rOiBcInJvb211aWtpdF9xdWlja3N0YXJ0Lmh0bWxcIiB9LFxyXG4gIHsgdGV4dDogXCJcdTY3MDBcdTRGNzNcdTVCOUVcdThERjVcIiwgbGluazogXCJyb29tdWlraXRfYmVzdF9wcmFjdGljZS5odG1sXCIgfSxcclxuICB7IHRleHQ6IFwiXHU1M0VGXHU5MTREXHU3RjZFXHU5ODc5XCIsIGxpbms6IFwicm9vbXVpa2l0X2NvbmZpZ19pdGVtLmh0bWxcIiB9LFxyXG4gIHsgdGV4dDogXCJcdTRFM0JcdTk4OThcIiwgbGluazogXCJyb29tdWlraXRfdGhlbWUuaHRtbFwiIH0sXHJcbiAgeyB0ZXh0OiBcIlx1ODFFQVx1NUI5QVx1NEU0OVwiLCBsaW5rOiBcInJvb211aWtpdF9jdXN0b21pemUuaHRtbFwiIH0sXHJcbiAgeyB0ZXh0OiBcIlx1N0VDNFx1NEVGNlx1NjU4N1x1Njg2M1wiLCBsaW5rOiBcInJvb211aWtpdF9zdG9yeWJvb2suaHRtbFwiLCBvbmx5OiBbXCJ3ZWJcIl0gfSxcclxuICB7IHRleHQ6IFwiXHU2NkY0XHU2NUIwXHU2NUU1XHU1RkQ3XCIsIGxpbms6IFwicm9vbXVpa2l0X3JlbGVhc2Vub3RlLmh0bWxcIiB9LFxyXG4gIHsgdGV4dDogXCJcdTVFMzhcdTg5QzFcdTk1RUVcdTk4OThcIiwgbGluazogXCJmYXEuaHRtbFwiLCBvbmx5OiBbXCJyZWFjdC1uYXRpdmVcIl0gfSxcclxuICB7IHRleHQ6IFwiXHU4QkJFXHU4QkExXHU2MzA3XHU1MzU3XCIsIGxpbms6IFwiZGVzaWduX2d1aWRlLmh0bWxcIiB9LFxyXG5dO1xyXG5cclxuZnVuY3Rpb24gYnVpbGRDaGF0VWlraXRTaWRlYmFyKCkge1xyXG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xyXG4gIGNoYXRQbGF0Zm9ybUxpc3QuZm9yRWFjaCgocGxhdGZvcm0pID0+IHtcclxuICAgIGNvbnN0IGtleSA9IGAvdWlraXQvY2hhdHVpa2l0LyR7cGxhdGZvcm19L2A7XHJcbiAgICByZXN1bHRba2V5XSA9IGNoYXRVaWtpdFNpZGViYXJcclxuICAgICAgLm1hcCgoc2lkZWJhcikgPT5cclxuICAgICAgICBoYW5kbGVTaWRlYmFySXRlbShwbGF0Zm9ybSwgc2lkZWJhciwgQ0hBVF9ET0NfUEFUSCwgXCJjaGF0dWlraXRcIilcclxuICAgICAgKVxyXG4gICAgICAuZmlsdGVyKChzKSA9PiBzKTtcclxuICB9KTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZENoYXRyb29tVWlraXRTaWRlYmFyKCkge1xyXG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xyXG4gIGNoYXRyb29tUGxhdGZvcm1MaXN0LmZvckVhY2goKHBsYXRmb3JtKSA9PiB7XHJcbiAgICBjb25zdCBrZXkgPSBgL3Vpa2l0L2NoYXRyb29tdWlraXQvJHtwbGF0Zm9ybX0vYDtcclxuICAgIHJlc3VsdFtrZXldID0gY2hhdHJvb21VaWtpdFNpZGViYXJcclxuICAgICAgLm1hcCgoc2lkZWJhcikgPT5cclxuICAgICAgICBoYW5kbGVTaWRlYmFySXRlbShwbGF0Zm9ybSwgc2lkZWJhciwgQ0hBVFJPT01fRE9DX1BBVEgsIFwiY2hhdHJvb211aWtpdFwiKVxyXG4gICAgICApXHJcbiAgICAgIC5maWx0ZXIoKHMpID0+IHMpO1xyXG4gIH0pO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpbmtFeGlzdHMocGxhdGZvcm06IHN0cmluZywgbGluazogc3RyaW5nLCBkb2NQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgZmlsZVBhdGggPSBgJHtkb2NQYXRofS8ke3BsYXRmb3JtfS8ke2xpbmsucmVwbGFjZSgvLmh0bWwkLywgXCIubWRcIil9YDtcclxuICAgIHJldHVybiBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKGBFcnJvciBjaGVja2luZyBmaWxlIGV4aXN0ZW5jZTogJHtlfWApO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlU2lkZWJhckl0ZW0ocGxhdGZvcm0sIHNpZGViYXIsIGRvY1BhdGgsIGtpdFR5cGUpIHtcclxuICBjb25zdCBoYXNDaGlsZHJlbiA9XHJcbiAgICBzaWRlYmFyLmhhc093blByb3BlcnR5KFwiY2hpbGRyZW5cIikgJiYgc2lkZWJhci5jaGlsZHJlbi5sZW5ndGggPiAwO1xyXG4gIGNvbnN0IGhhc09ubHkgPSBzaWRlYmFyLmhhc093blByb3BlcnR5KFwib25seVwiKSAmJiBzaWRlYmFyLm9ubHkubGVuZ3RoID4gMDtcclxuICBjb25zdCBoYXNFeGNlcHQgPVxyXG4gICAgc2lkZWJhci5oYXNPd25Qcm9wZXJ0eShcImV4Y2VwdFwiKSAmJiBzaWRlYmFyLmV4Y2VwdC5sZW5ndGggPiAwO1xyXG5cclxuICBsZXQgbmVlZFRoaXNQbGF0Zm9ybSA9IHRydWU7XHJcbiAgaWYgKGhhc09ubHkpIHtcclxuICAgIG5lZWRUaGlzUGxhdGZvcm0gPSBzaWRlYmFyLm9ubHkuaW5kZXhPZihwbGF0Zm9ybSkgPiAtMTtcclxuICB9XHJcbiAgaWYgKGhhc0V4Y2VwdCkge1xyXG4gICAgbmVlZFRoaXNQbGF0Zm9ybSA9IHNpZGViYXIuZXhjZXB0LmluZGV4T2YocGxhdGZvcm0pID09IC0xO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFuZWVkVGhpc1BsYXRmb3JtKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGlmIChoYXNDaGlsZHJlbikge1xyXG4gICAgbGV0IG5ld2NoaWxkcmVuID0gc2lkZWJhci5jaGlsZHJlblxyXG4gICAgICAubWFwKChzKSA9PiBoYW5kbGVTaWRlYmFySXRlbShwbGF0Zm9ybSwgcywgZG9jUGF0aCwga2l0VHlwZSkpXHJcbiAgICAgIC5maWx0ZXIoKHMpID0+IHMpO1xyXG4gICAgaWYgKG5ld2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgcmV0dXJuIHsgLi4uc2lkZWJhciwgY2hpbGRyZW46IG5ld2NoaWxkcmVuIH07XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChsaW5rRXhpc3RzKHBsYXRmb3JtLCBzaWRlYmFyLmxpbmssIGRvY1BhdGgpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0xpbmsgPSBgL3Vpa2l0LyR7a2l0VHlwZX0vJHtwbGF0Zm9ybX0vJHtzaWRlYmFyLmxpbmt9YDtcclxuICAgICAgcmV0dXJuIHsgLi4uc2lkZWJhciwgbGluazogbmV3TGluayB9O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IENIQVRfVUlLSVRfU0lERUJBUiA9IGJ1aWxkQ2hhdFVpa2l0U2lkZWJhcigpO1xyXG5leHBvcnQgY29uc3QgQ0hBVFJPT01fVUlLSVRfU0lERUJBUiA9IGJ1aWxkQ2hhdHJvb21VaWtpdFNpZGViYXIoKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOi9FYXNlbW9iL0dpdGh1Yl9MaWJyYXJ5X1N1bW1hcnkvZWFzZW1vYl9kb2MvZG9jcy8udnVlcHJlc3Mvc2lkZWJhclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRWFzZW1vYlxcXFxHaXRodWJfTGlicmFyeV9TdW1tYXJ5XFxcXGVhc2Vtb2JfZG9jXFxcXGRvY3NcXFxcLnZ1ZXByZXNzXFxcXHNpZGViYXJcXFxccHJpdmF0ZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRWFzZW1vYi9HaXRodWJfTGlicmFyeV9TdW1tYXJ5L2Vhc2Vtb2JfZG9jL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXIvcHJpdmF0ZS50c1wiO2V4cG9ydCBjb25zdCBQUklWQVRFX0lNX1NJREVCQVIgPSBbXHJcbiAgICB7XHJcbiAgICAgIHRleHQ6ICdcdTVCODlcdTg4QzVcdTkwRThcdTdGNzInLCBcclxuICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICB7IHRleHQ6ICdcdTc5QzFcdTY3MDlcdTUzMTZcdTY3MERcdTUyQTFcdTkwRThcdTdGNzInLCBsaW5rOiAndWNfZGVwbG95Lmh0bWwnIH0sXHJcbiAgICAgIF1cclxuICAgIH0gLFxyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnXHU3OUMxXHU2NzA5XHU1MzE2XHU5NkM2XHU2MjEwJywgXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgeyB0ZXh0OiAnQ29uc29sZVx1OTE0RFx1N0Y2RVx1OEJGNFx1NjYwRScsIGxpbms6ICd1Y19jb25maWd1cmUuaHRtbCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdTREsgXHU1M0NBIERlbW8gXHU0RTBCXHU4RjdEJywgbGluazogJ3VjX3ByaXZhdGUuaHRtbCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdBbmRyb2lkXHU3OUMxXHU2NzA5XHU1MzE2XHU5MTREXHU3RjZFJywgbGluazogJ3VjX2FuZHJvaWRfcHJpdmF0ZS5odG1sJyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ2lPU1x1NzlDMVx1NjcwOVx1NTMxNlx1OTE0RFx1N0Y2RScsIGxpbms6ICd1Y19pT1NfcHJpdmF0ZS5odG1sJyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1dlYlx1NzlDMVx1NjcwOVx1NTMxNlx1OTE0RFx1N0Y2RScsIGxpbms6ICd1Y19XZWJfcHJpdmF0ZS5odG1sJyB9LFxyXG4gICAgICBdXHJcbiAgICB9ICxcclxuICAgIHtcclxuICAgICAgdGV4dDogJ1x1ODlFM1x1NTFCM1x1NjVCOVx1Njg0OCcsIFxyXG4gICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgIHsgdGV4dDogJ1x1NEYwMVx1NEUxQVx1NTM0Rlx1NTQwQ1x1NTI5RVx1NTE2Q1x1RkYwOFx1NzNBRlx1NEZFMVx1OTAxQVx1RkYwOScsIGxpbms6ICd1Y19vdmVydmlldy5odG1sJyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1x1OEY3Qlx1NUJBMlx1NjcwRFx1OEZEQ1x1N0EwQlx1NTM0Rlx1NTJBOVx1RkYwOFx1NEUyQVx1NjAyN1x1NTMxNlx1NTM0Rlx1NTQwQ1x1RkYwOScsIGxpbms6ICd1Y19sb3djb2RlLmh0bWwnIH0sXHJcbiAgICAgIF1cclxuICAgIH0gXHJcbl1cclxuXHJcblxyXG5leHBvcnQgY29uc3QgUFJJVkFURV9NRURJQV9TSURFQkFSID0gW1xyXG4gIHtcclxuICAgIHRleHQ6ICdcdTVGRUJcdTkwMUZcdTVGMDBcdTU5Q0InLCBcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1OTdGM1x1ODlDNlx1OTg5MVx1Njk4Mlx1ODlDOCcsIGxpbms6ICdjb21tb25faW50cm9kdWN0aW9uLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NUJBMlx1NjIzN1x1N0FFRlx1NEUwQlx1OEY3RCcsIGxpbms6ICdjb21tb25fY2xpZW50c2RrLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NUUzOFx1ODlDMVx1OTVFRVx1OTg5OCcsIGxpbms6ICdjb21tb25fZmFxLmh0bWwnIH0sXHJcbiAgICBdXHJcbiAgfSAsXHJcbiAge1xyXG4gICAgdGV4dDogJzFcdTVCRjkxXHU5MDFBXHU4QkREJywgXHJcbiAgICBjaGlsZHJlbjogW1xyXG4gICAgICB7IHRleHQ6ICdcdTUyOUZcdTgwRkRcdTdCODBcdTRFQ0InLCBsaW5rOiAnb25lMm9uZV9pbnRyb2R1Y3Rpb24uaHRtbCcgfSxcclxuICAgICAgeyB0ZXh0OiAnQW5kcm9pZFx1OTZDNlx1NjIxMCcsIGxpbms6ICdvbmUyb25lX2FuZHJvaWQuaHRtbCcgfSxcclxuICAgICAgeyB0ZXh0OiAnaU9TXHU5NkM2XHU2MjEwJywgbGluazogJ29uZTJvbmVfaW9zLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1dlYlx1OTZDNlx1NjIxMCcsIGxpbms6ICdvbmUyb25lX3dlYi5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTVGQUVcdTRGRTFcdTVDMEZcdTdBMEJcdTVFOEZcdTk2QzZcdTYyMTAnLCBsaW5rOiAnb25lMm9uZV92eG1pbmkuaHRtbCcgfSxcclxuICAgICAgeyB0ZXh0OiAnUENcdTk2QzZcdTYyMTAnLCBsaW5rOiAnb25lMm9uZV9wY2Rlc2t0b3AuaHRtbCcgfSxcclxuICAgIF1cclxuICB9ICxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU1OTFBXHU0RUJBXHU5MDFBXHU4QkREJywgXHJcbiAgICBjaGlsZHJlbjogW1xyXG4gICAgICB7IHRleHQ6ICdcdTUyOUZcdTgwRkRcdTdCODBcdTRFQ0InLCBsaW5rOiAnY29uZmVyZW5jZV9pbnRyb2R1Y3Rpb24uaHRtbCcgfSxcclxuICAgICAgeyB0ZXh0OiAnQW5kcm9pZFx1OTZDNlx1NjIxMCcsIGxpbms6ICdjb25mZXJlbmNlX2FuZHJvaWQuaHRtbCcgfSxcclxuICAgICAgeyB0ZXh0OiAnaU9TXHU5NkM2XHU2MjEwJywgbGluazogJ2NvbmZlcmVuY2VfaW9zLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1dlYlx1OTZDNlx1NjIxMCcsIGxpbms6ICdjb25mZXJlbmNlX3dlYi5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTVGQUVcdTRGRTFcdTVDMEZcdTdBMEJcdTVFOEZcdTk2QzZcdTYyMTAnLCBsaW5rOiAnY29uZmVyZW5jZV92eG1pbmkuaHRtbCcgfSxcclxuICAgICAgeyB0ZXh0OiAndW5pLWFwcFx1OTZDNlx1NjIxMCcsIGxpbms6ICdjb25mZXJlbmNlX3VuaWFwcC5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdQQ1x1OTZDNlx1NjIxMCcsIGxpbms6ICdjb25mZXJlbmNlX3BjZGVza3RvcC5odG1sJyB9LFxyXG4gICAgXVxyXG4gIH0gLFxyXG4gIC8qe1xyXG4gICAgdGV4dDogJ1x1NEU5Mlx1NTJBOFx1NzY3RFx1Njc3RicsIFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiAnXHU1MjlGXHU4MEZEXHU3QjgwXHU0RUNCJywgbGluazogJ3doaXRlYm9hcmRfaW50cm9kdWN0aW9uLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ0FuZHJvaWRcdTk2QzZcdTYyMTAnLCBsaW5rOiAnd2hpdGVib2FyZF9hbmRyb2lkLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ2lPU1x1OTZDNlx1NjIxMCcsIGxpbms6ICd3aGl0ZWJvYXJkX2lvcy5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdXZWJcdTk2QzZcdTYyMTAnLCBsaW5rOiAnd2hpdGVib2FyZF93ZWIuaHRtbCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1RkFFXHU0RkUxXHU1QzBGXHU3QTBCXHU1RThGXHU5NkM2XHU2MjEwJywgbGluazogJ3doaXRlYm9hcmRfdnhtaW5pLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1BDXHU5NkM2XHU2MjEwJywgbGluazogJ3doaXRlYm9hcmRfcGNkZXNrdG9wLmh0bWwnIH0sXHJcbiAgICBdXHJcbiAgfSAsKi9cclxuICB7XHJcbiAgICB0ZXh0OiAnUkVTVFx1NjNBNVx1NTNFMycsIFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiAnXHU1MjlGXHU4MEZEXHU3QjgwXHU0RUNCJywgbGluazogJ3Jlc3RfaW50cm9kdWN0aW9uLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NEYxQVx1OEJBRVx1N0JBMVx1NzQwNicsIGxpbms6ICdyZXN0X21hbmFnZS5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTVGNTVcdTUyMzZcdTUzQ0FcdTYzRDBcdTUzRDYnLCBsaW5rOiAncmVzdF9yZWNvcmQuaHRtbCcgfSxcclxuICAgICAgLyp7IHRleHQ6ICdcdTRFOTJcdTUyQThcdTc2N0RcdTY3N0YnLCBsaW5rOiAncmVzdF93aGl0ZWJvYXJkLmh0bWwnIH0sKi9cclxuICAgIF1cclxuICB9ICxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU1NzNBXHU2NjZGXHU2NUI5XHU2ODQ4JywgXHJcbiAgICBjaGlsZHJlbjogW1xyXG4gICAgICB7IHRleHQ6ICcxXHU1QkY5MVx1OTdGM1x1ODlDNlx1OTg5MScsIGxpbms6ICdzY2VuYXJpb19vbmUyb25lLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1OTdGM1x1ODlDNlx1OTg5MVx1NEYxQVx1OEJBRScsIGxpbms6ICdzY2VuYXJpb19tZWV0aW5nLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NEU5Mlx1NTJBOFx1NzZGNFx1NjRBRCcsIGxpbms6ICdzY2VuYXJpb19saXZlLmh0bWwnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1OEJFRFx1OTdGM1x1OEZERVx1OUVBNlx1ODA0QVx1NTkyOVx1NUJBNCcsIGxpbms6ICdzY2VuYXJpb190Yy5odG1sJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdThCRURcdTk3RjNcdThGREVcdTlFQTZcdTgwNEFcdTU5MjlcdTVCQTQtXHU0RTNCXHU2MzAxXHU2QTIxXHU1RjBGJywgbGluazogJ3NjZW5hcmlvX3RjLWhvc3QuaHRtbCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU4QkVEXHU5N0YzXHU4RkRFXHU5RUE2XHU4MDRBXHU1OTI5XHU1QkE0LVx1NjJBMlx1OUVBNlx1NkEyMVx1NUYwRicsIGxpbms6ICdzY2VuYXJpb190Yy1yb2JtaWMuaHRtbCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU4QkVEXHU5N0YzXHU4RkRFXHU5RUE2XHU4MDRBXHU1OTI5XHU1QkE0LVx1NEUzNFx1NTczQVx1NkEyMVx1NUYwRicsIGxpbms6ICdzY2VuYXJpb190Yy1zY2VuZS5odG1sJyB9LFxyXG4gICAgXVxyXG4gIH0gLFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTk1MTlcdThCRUZcdTc4MDEnLCBcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1OTUxOVx1OEJFRlx1NzgwMScsIGxpbms6ICdjb21tb25fZXJyb3JfY29kZS5odG1sJyB9LFxyXG4gICAgXVxyXG4gIH0gXHJcbl0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6L0Vhc2Vtb2IvR2l0aHViX0xpYnJhcnlfU3VtbWFyeS9lYXNlbW9iX2RvYy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxFYXNlbW9iXFxcXEdpdGh1Yl9MaWJyYXJ5X1N1bW1hcnlcXFxcZWFzZW1vYl9kb2NcXFxcZG9jc1xcXFwudnVlcHJlc3NcXFxcc2lkZWJhclxcXFxjYWxsa2l0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9FYXNlbW9iL0dpdGh1Yl9MaWJyYXJ5X1N1bW1hcnkvZWFzZW1vYl9kb2MvZG9jcy8udnVlcHJlc3Mvc2lkZWJhci9jYWxsa2l0LnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xyXG5pbXBvcnQgZnMgZnJvbSBcIm5vZGU6ZnNcIjtcclxuXHJcbmNvbnN0IGdldFN1YkRpcmVjdG9yaWVzID0gKGRpcikgPT5cclxuICBmc1xyXG4gICAgLnJlYWRkaXJTeW5jKGRpcilcclxuICAgIC5maWx0ZXIoKGl0ZW0pID0+IGZzLnN0YXRTeW5jKHBhdGguam9pbihkaXIsIGl0ZW0pKS5pc0RpcmVjdG9yeSgpKTtcclxuY29uc3QgQ0FMTF9ET0NfUEFUSCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi4vY2FsbGtpdFwiKTtcclxuY29uc3QgY2FsbEtpdFBsYXRmb3JtTGlzdCA9IGdldFN1YkRpcmVjdG9yaWVzKENBTExfRE9DX1BBVEgpO1xyXG5cclxuY29uc3QgY2FsbEtpdFNpZGViYXIgPSBbXHJcbiAge1xyXG4gICAgLypcclxuICAgICAgdGV4dDogXHU1MjA2XHU3RUM0XHU2ODA3XHU5ODk4XHJcbiAgICAgIGNoaWxkcmVuOiBcdTUyMDZcdTdFQzRcdTVCRkNcdTgyMkFcdTUyMTdcdTg4NjggIFxyXG4gICAgICAgIHRleHQ6IFx1NjYzRVx1NzkzQVx1NzY4NFx1NjU4N1x1NjcyQ1xyXG4gICAgICAgIGxpbms6IFx1OTRGRVx1NjNBNVx1NTczMFx1NTc0MFxyXG4gICAgICAgIHNob3c6IFx1NEUwRFx1NUI1OFx1NTcyOFx1NjIxNlx1ODAwNVx1NTAzQ1x1NEUzQSB0cnVlIFx1NjVGNlx1RkYwQ1x1ODNEQ1x1NTM1NVx1NjYzRVx1NzkzQVx1RkYxQlx1NUI1OFx1NTcyOFx1NUU3Nlx1NEUxNFx1NTAzQ1x1NEUzQSBmYWxzZSBcdTY1RjZcdUZGMENcdTgzRENcdTUzNTVcdTRFMERcdTY2M0VcdTc5M0FcclxuICAgICAgICBvbmx5OiBcdTY1NzBcdTdFQzRcdTVGNjJcdTVGMEZcdUZGMENcdTUzRUFcdTY3MDlcdTU3MjhcdTY1NzBcdTdFQzRcdTRFMkRcdTc2ODRcdTVFNzNcdTUzRjBcdTRFMEJcdTY2M0VcdTc5M0FcclxuICAgICAgICBleGNlcHQ6IFx1NjU3MFx1N0VDNFx1NUY2Mlx1NUYwRlx1RkYwQ1x1OTY2NFx1NEU4Nlx1NjU3MFx1N0VDNFx1NEUyRFx1NjMwN1x1NUI5QVx1NzY4NFx1NUU3M1x1NTNGMFx1NTkxNlx1OTBGRFx1NjYzRVx1NzkzQVxyXG4gICAgICAgIGNvbGxhcHNpYmxlOiBcdTVCNTBcdTgzRENcdTUzNTVcdTY2MkZcdTU0MjZcdTUxNDFcdThCQjhcdTVDNTVcdTVGMDAvXHU2NTM2XHU4RDc3XHVGRjBDdHJ1ZTogXHU1MTQxXHU4QkI4OyBmYWxzZTogXHU0RTBEXHU1MTQxXHU4QkI4XHUzMDAyXHU4QkY3XHU1M0MyXHU4MDAzXHUzMDBDXHU1QjUwXHU4M0RDXHU1MzU1XHU3OTNBXHU0RjhCXHUzMDBEXHJcbiAgICAgICAgY2hpbGRyZW46IFx1NUI1MFx1ODNEQ1x1NTM1NVx1MzAwMlx1OEJGN1x1NTNDMlx1ODAwM1x1MzAwQ1x1NUI1MFx1ODNEQ1x1NTM1NVx1NzkzQVx1NEY4Qlx1MzAwRFxyXG4gICAgKi9cclxuICAgIHRleHQ6IFwiXHU0RUE3XHU1NEMxXHU0RUNCXHU3RUNEXCIsXHJcbiAgICBjb2xsYXBzaWJsZTogdHJ1ZSxcclxuICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgIHsgdGV4dDogXCJcdTRFQTdcdTU0QzFcdTY5ODJcdThGRjBcIiwgbGluazogXCJwcm9kdWN0X292ZXJ2aWV3Lmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU1RjAwXHU5MDFBXHU2NzBEXHU1MkExXCIsIGxpbms6IFwicHJvZHVjdF9hY3RpdmF0aW9uLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU4RDJEXHU0RTcwXHU2MzA3XHU1MzU3XCIsIGxpbms6IFwicHJvZHVjdF9wdXJjaGFzZS5odG1sXCIgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogXCJcdTVGRUJcdTkwMUZcdTVGMDBcdTU5Q0JcIixcclxuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiBcIlx1OEREMVx1OTAxQVx1NzkzQVx1NEY4Qlx1OTg3OVx1NzZFRVwiLCBsaW5rOiBcInNhbXBsZV9ydW50aHJvdWdoLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU1RkVCXHU5MDFGXHU1RjAwXHU1OUNCXCIsIGxpbms6IFwicXVpY2tzdGFydC5odG1sXCIgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogXCJcdTk2QzZcdTYyMTBcdTY1ODdcdTY4NjNcIixcclxuICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAgeyB0ZXh0OiBcIkNhbGxLaXQgXHU2N0I2XHU2Nzg0XCIsIGxpbms6IFwiYXJjaGl0ZWN0dXJlLmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU5NkM2XHU2MjEwIENhbGxLaXRcIiwgbGluazogXCJpbnRlZ3JhdGlvbi5odG1sXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1Njc0M1x1OTY1MFwiLCBsaW5rOiBcInBlcm1pc3Npb24uaHRtbFwiLCBvbmx5OiBbXCJhbmRyb2lkXCJdIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiBcIlx1NEY3Rlx1NzUyOCBMaXZlQ29tbXVuaWNhdGlvbktpdFwiLCBsaW5rOiBcImxpdmVjb21tdW5pY2F0aW9ua2l0Lmh0bWxcIiwgb25seTogW1wiaW9zXCJdXHJcbiAgICAgIH0sXHJcbiAgICAgIHsgdGV4dDogXCJcdTc1M0JcdTRFMkRcdTc1M0JcIiwgbGluazogXCJwaWN0dXJlX2luX3BpY3R1cmUuaHRtbFwiLCBvbmx5OiBbXCJpb3NcIl0gfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1NEY3Rlx1NzUyOCBUZWxlY29tXCIsIGxpbms6IFwidGVsZWNvbS5odG1sXCIsIG9ubHk6IFtcImFuZHJvaWRcIl0gfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1Njc2NVx1NzUzNVx1OTAxQVx1NzdFNVx1NTQ4Q1x1NjBBQ1x1NkQ2RVx1N0E5N1wiLCBsaW5rOiBcImZsb2F0X3RvcC5odG1sXCIsIG9ubHk6IFtcImFuZHJvaWRcIl0gfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1ODFFQVx1NUI5QVx1NEU0OVx1OEQ0NFx1NkU5MFwiLCBsaW5rOiBcImN1c3RvbWl6YXRpb24uaHRtbFwiIH0sXHJcbiAgICAgIHsgdGV4dDogXCJcdTkwMUFcdThCRERcdTRGRTFcdTRFRTRcIiwgbGluazogXCJzaWduYWxpbmcuaHRtbFwiIH0sXHJcbiAgICAgIHsgdGV4dDogXCJBUEkgXHU2OTgyXHU4OUM4XCIsIGxpbms6IFwiYXBpX292ZXJ2aWV3Lmh0bWxcIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU1RTM4XHU4OUMxXHU5NUVFXHU5ODk4XCIsIGxpbms6IFwiY29tbW9uX2lzc3VlLmh0bWxcIiB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAgeyB0ZXh0OiBcIlx1OEJCRVx1OEJBMVx1NjMwN1x1NTM1N1wiLCBsaW5rOiBcImRlc2lnbl9ndWlkZS5odG1sXCIgfSxcclxuICB7IHRleHQ6IFwiXHU1Mzg2XHU1M0YyXHU2NTg3XHU2ODYzXCIsIGxpbms6IFwiZWFzZWNhbGxraXQuaHRtbFwiIH1cclxuXTtcclxuXHJcbmZ1bmN0aW9uIGJ1aWxkQ2FsbEtpdFNpZGViYXIoKSB7XHJcbiAgY29uc3QgcmVzdWx0ID0ge307XHJcbiAgY2FsbEtpdFBsYXRmb3JtTGlzdC5mb3JFYWNoKChwbGF0Zm9ybSkgPT4ge1xyXG4gICAgY29uc3Qga2V5ID0gYC9jYWxsa2l0LyR7cGxhdGZvcm19L2A7XHJcbiAgICByZXN1bHRba2V5XSA9IGNhbGxLaXRTaWRlYmFyXHJcbiAgICAgIC5tYXAoKHNpZGViYXIpID0+XHJcbiAgICAgICAgaGFuZGxlU2lkZWJhckl0ZW0ocGxhdGZvcm0sIHNpZGViYXIsIENBTExfRE9DX1BBVEgsIFwiY2FsbGtpdFwiKVxyXG4gICAgICApXHJcbiAgICAgIC5maWx0ZXIoKHMpID0+IHMpO1xyXG4gIH0pO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpbmtFeGlzdHMocGxhdGZvcm06IHN0cmluZywgbGluazogc3RyaW5nLCBkb2NQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgZmlsZVBhdGggPSBgJHtkb2NQYXRofS8ke3BsYXRmb3JtfS8ke2xpbmsucmVwbGFjZSgvLmh0bWwkLywgXCIubWRcIil9YDtcclxuICAgIHJldHVybiBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKGBFcnJvciBjaGVja2luZyBmaWxlIGV4aXN0ZW5jZTogJHtlfWApO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlU2lkZWJhckl0ZW0ocGxhdGZvcm0sIHNpZGViYXIsIGRvY1BhdGgsIGtpdFR5cGUpIHtcclxuICBjb25zdCBoYXNDaGlsZHJlbiA9XHJcbiAgICBzaWRlYmFyLmhhc093blByb3BlcnR5KFwiY2hpbGRyZW5cIikgJiYgc2lkZWJhci5jaGlsZHJlbi5sZW5ndGggPiAwO1xyXG4gIGNvbnN0IGhhc09ubHkgPSBzaWRlYmFyLmhhc093blByb3BlcnR5KFwib25seVwiKSAmJiBzaWRlYmFyLm9ubHkubGVuZ3RoID4gMDtcclxuICBjb25zdCBoYXNFeGNlcHQgPVxyXG4gICAgc2lkZWJhci5oYXNPd25Qcm9wZXJ0eShcImV4Y2VwdFwiKSAmJiBzaWRlYmFyLmV4Y2VwdC5sZW5ndGggPiAwO1xyXG5cclxuICBsZXQgbmVlZFRoaXNQbGF0Zm9ybSA9IHRydWU7XHJcbiAgaWYgKGhhc09ubHkpIHtcclxuICAgIG5lZWRUaGlzUGxhdGZvcm0gPSBzaWRlYmFyLm9ubHkuaW5kZXhPZihwbGF0Zm9ybSkgPiAtMTtcclxuICB9XHJcbiAgaWYgKGhhc0V4Y2VwdCkge1xyXG4gICAgbmVlZFRoaXNQbGF0Zm9ybSA9IHNpZGViYXIuZXhjZXB0LmluZGV4T2YocGxhdGZvcm0pID09IC0xO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFuZWVkVGhpc1BsYXRmb3JtKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGlmIChoYXNDaGlsZHJlbikge1xyXG4gICAgbGV0IG5ld2NoaWxkcmVuID0gc2lkZWJhci5jaGlsZHJlblxyXG4gICAgICAubWFwKChzKSA9PiBoYW5kbGVTaWRlYmFySXRlbShwbGF0Zm9ybSwgcywgZG9jUGF0aCwga2l0VHlwZSkpXHJcbiAgICAgIC5maWx0ZXIoKHMpID0+IHMpO1xyXG4gICAgaWYgKG5ld2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgcmV0dXJuIHsgLi4uc2lkZWJhciwgY2hpbGRyZW46IG5ld2NoaWxkcmVuIH07XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChsaW5rRXhpc3RzKHBsYXRmb3JtLCBzaWRlYmFyLmxpbmssIGRvY1BhdGgpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0xpbmsgPSBgLyR7a2l0VHlwZX0vJHtwbGF0Zm9ybX0vJHtzaWRlYmFyLmxpbmt9YDtcclxuICAgICAgcmV0dXJuIHsgLi4uc2lkZWJhciwgbGluazogbmV3TGluayB9O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IENBTExfS0lUX1NJREVCQVIgPSBidWlsZENhbGxLaXRTaWRlYmFyKCk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDovRWFzZW1vYi9HaXRodWJfTGlicmFyeV9TdW1tYXJ5L2Vhc2Vtb2JfZG9jL2RvY3MvLnZ1ZXByZXNzL3NpZGViYXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEVhc2Vtb2JcXFxcR2l0aHViX0xpYnJhcnlfU3VtbWFyeVxcXFxlYXNlbW9iX2RvY1xcXFxkb2NzXFxcXC52dWVwcmVzc1xcXFxzaWRlYmFyXFxcXHB1c2gudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0Vhc2Vtb2IvR2l0aHViX0xpYnJhcnlfU3VtbWFyeS9lYXNlbW9iX2RvYy9kb2NzLy52dWVwcmVzcy9zaWRlYmFyL3B1c2gudHNcIjtleHBvcnQgY29uc3QgUFVTSF9TSURFQkFSID0gW1xyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnXHU0RUE3XHU1NEMxXHU0RUNCXHU3RUNEJyxcclxuICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICB7IHRleHQ6ICdcdTRFQTdcdTU0QzFcdTY5ODJcdThGRjAnLCBsaW5rOiAncHVzaF9vdmVydmlldy5odG1sJyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1x1NEVBN1x1NTRDMVx1NTJBOFx1NjAwMScsIGNvbGxhcHNpYmxlOiB0cnVlLCBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU0RUE3XHU1NEMxXHU1MjlGXHU4MEZEXHU1MkE4XHU2MDAxJywgbGluazogJ3B1c2hfZHluYW1pY3MuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ0FuZHJvaWQgU0RLIFx1NTNEMVx1NUUwM1x1NTJBOFx1NjAwMScsIGxpbms6ICdwdXNoX2R5bmFtaWNzX2FuZHJvaWQuaHRtbCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ2lPUyBTREsgXHU1M0QxXHU1RTAzXHU1MkE4XHU2MDAxJywgbGluazogJ3B1c2hfZHluYW1pY3NfaW9zLmh0bWwnIH0sXHJcbiAgICAgICAgXX0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU1MTY4XHU3NDAzXHU1MzE2XHU5MEU4XHU3RjcyJywgbGluazogJ3B1c2hfZ2xvYmFsX2RlcGxveW1lbnQuaHRtbCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTYzQTVcdTUzRTNcdTk4OTFcdTczODdcdTk2NTBcdTUyMzYnLCBsaW5rOiAncHVzaF9hcGlfY2FsbF9saW1pdGF0aW9uLmh0bWwnIH0sXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRleHQ6ICdcdTRFQTdcdTU0QzFcdTVCOUFcdTRFRjcnLFxyXG4gICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgIHsgdGV4dDogJ1x1OEJBMVx1OEQzOVx1OEJGNFx1NjYwRScsIGxpbms6ICdwdXNoX2JpbGxpbmcuaHRtbCcgfSxcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgdGV4dDogJ1x1NUZFQlx1OTAxRlx1NTE2NVx1OTVFOCcsXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU1MjFCXHU1RUZBXHU0RUE3XHU1NEMxXHU1M0NBXHU1RTk0XHU3NTI4JywgbGluazogJ3B1c2hfY3JlYXRlcHJvZHVjdF9hcHAuaHRtbCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTUyMUJcdTVFRkFcdTYzQThcdTkwMDEnLCBsaW5rOiAncHVzaF9jcmVhdGVub3RpZmljYXRpb24uaHRtbCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTYzQThcdTkwMDFcdTRFRkJcdTUyQTEnLCBsaW5rOiAncHVzaF90YXNrLmh0bWwnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU2ODA3XHU3QjdFXHU3QkExXHU3NDA2JywgbGluazogJ3B1c2hfdGFnX21nbXQuaHRtbCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdThCQzFcdTRFNjZcdTkxNERcdTdGNkUnLCBsaW5rOiAncHVzaF9jZXJ0aWZpY2F0ZV9jb25maWcuaHRtbCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTY1NzBcdTYzNkVcdTdFREZcdThCQTEnLCBsaW5rOiAncHVzaF9zdGF0aXN0aWNzLmh0bWwnIH0sXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRleHQ6ICdBbmRyb2lkIFx1NjNBNVx1NTE2NScsXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU2M0E4XHU5MDAxXHU5NkM2XHU2MjEwXHU4QkY0XHU2NjBFJywgbGluazogJ3B1c2hfaW50ZWdyYXRpb25fbm90ZV9hbmRyb2lkJyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1x1NjNBOFx1OTAwMVx1OTZDNlx1NjIxMFx1OEZDN1x1N0EwQicsIGxpbms6ICdwdXNoX2ludGVncmF0aW9uX3Byb2Nlc3NfYW5kcm9pZCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTUzODJcdTU1NDZcdTdFREZcdThCQTEnLCBsaW5rOiAncHVzaF9hbmRyb2lkdmVuZG9yX3N0YXRpc3RpY3MnIH0sXHJcbiAgICAgICAgLy8geyB0ZXh0OiAnXHU2M0E4XHU5MDAxXHU1MzgyXHU1NTQ2XHU2RDg4XHU2MDZGXHU1MjA2XHU3QzdCJywgbGluazogJ3B1c2hfYW5kcm9pZHZlbmRvcl9tc2djbGFzc2lmaWNhdGlvbicgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTUzODJcdTU1NDZcdTkwMUFcdTkwNTNcdTk2NTBcdTUyMzZcdTUzQ0FcdTg5RTNcdTUxQjNcdTY1QjlcdTY4NDgnLCBsaW5rOiAncHVzaF9hbmRyb2lkY2hhbm5lbF9yZXN0cmljdGlvbi5odG1sJyB9LFxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnaU9TIFx1NjNBNVx1NTE2NScsXHJcbiAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU2M0E4XHU5MDAxXHU5NkM2XHU2MjEwXHU4QkY0XHU2NjBFJywgbGluazogJ3B1c2hfaW50ZWdyYXRpb25fbm90ZV9pb3MnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU2M0E4XHU5MDAxXHU5NkM2XHU2MjEwXHU4RkM3XHU3QTBCJywgbGluazogJ3B1c2hfaW50ZWdyYXRpb25fcHJvY2Vzc19pb3MnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnQVBOcyBcdTkwMDFcdThGQkVcdTdFREZcdThCQTEnLCBsaW5rOiAncHVzaF9hcG5zX2RlbGl2ZXJfc3RhdGlzdGljcy5odG1sJyB9LFxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnXHU2NzBEXHU1MkExXHU3QUVGIFJFU1QnLFxyXG4gICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgIHsgdGV4dDogJ1x1NjNBOFx1OTAwMVx1NjgwN1x1N0I3RVx1N0JBMVx1NzQwNicsIGxpbms6ICdwdXNoX2J5X3RhZy5odG1sJyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1x1NTNEMVx1OTAwMVx1NjNBOFx1OTAwMVx1OTAxQVx1NzdFNScsIGxpbms6ICdwdXNoX3NlbmRfbm90aWZpY2F0aW9uLmh0bWwnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU5MTREXHU3RjZFXHU2M0E4XHU5MDAxXHU5MDFBXHU3N0U1JywgbGluazogJ3B1c2hfbm90aWZpY2F0aW9uX2NvbmZpZy5odG1sJyB9LFxyXG4gICAgICBdXHJcbiAgICB9LFxyXG5dXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVcsU0FBUyx3QkFBb0M7QUFDaFosU0FBUyxtQkFBbUI7QUFLNUIsU0FBUyx1QkFBdUI7OztBQ0poQyxPQUFPLGVBQWU7QUFHZixJQUFNLGtCQUFrQixDQUFDLE9BQW1CO0FBQ2pELEtBQUcsSUFBSSxHQUFHLGdCQUFnQixVQUFVLGdCQUFNLEVBQUUsQ0FBQztBQUMvQztBQUlBLFNBQVMsZ0JBQ1AsT0FDQSxjQUNBLElBQ2U7QUFDZixTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsTUFDRSxPQUFPLFFBQVEsS0FBSztBQUNsQixjQUFNLFFBQVEsT0FBTyxHQUFHO0FBQ3hCLGNBQU0sT0FBTyxNQUFNLEtBQUssS0FBSyxFQUFFLE1BQU0sTUFBTSxNQUFNLEVBQUUsS0FBSztBQUN4RCxZQUFJLE1BQU0sWUFBWSxHQUFHO0FBQ3ZCLGdCQUFNLFFBQVEsR0FBRyxhQUFhLFFBQVEsWUFBWTtBQUNsRCxpQkFBTyxlQUFlLFNBQU8sV0FBUyxTQUFPLHlEQUF5RDtBQUFBO0FBQUEsUUFDeEcsT0FBTztBQUNMLGlCQUFPO0FBQUE7QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBQ2hDaVcsU0FBUyxpQkFBK0I7OztBQ0FsQixTQUFTLGNBQWM7QUFFdlksSUFBTSxXQUFXLE9BQU87QUFBQSxFQUM3QixFQUFFLE1BQU0sNEJBQVEsTUFBTSw2QkFBNkI7QUFBQSxFQUNuRDtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLE1BQ1I7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLFVBQVU7QUFBQSxVQUNSO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sVUFBVTtBQUFBLFVBQ1I7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLE1BQ1I7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLE1BQ1I7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLFVBQVU7QUFBQSxVQUNSO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixVQUFVO0FBQUEsVUFDUjtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sVUFBVTtBQUFBLFVBQ1I7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLE1BQ1I7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLFVBQVU7QUFBQSxVQUNSO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxV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LElBQ04sVUFBVTtBQUFBLE1BQ1IsRUFBRSxNQUFNLGtDQUFTLE1BQU0sMkJBQTJCO0FBQUEsTUFDbEQsRUFBRSxNQUFNLGtDQUFTLE1BQU0sd0JBQXdCO0FBQUEsTUFDL0MsRUFBRSxNQUFNLDRCQUFRLE1BQU0sa0JBQWtCO0FBQUEsSUFDMUM7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLE1BQ1IsRUFBRSxNQUFNLDRCQUFRLE1BQU0sNEJBQTRCO0FBQUEsTUFDbEQsRUFBRSxNQUFNLHVCQUFhLE1BQU0sdUJBQXVCO0FBQUEsTUFDbEQsRUFBRSxNQUFNLG1CQUFTLE1BQU0sbUJBQW1CO0FBQUEsTUFDMUMsRUFBRSxNQUFNLG1CQUFTLE1BQU0sbUJBQW1CO0FBQUEsTUFDMUMsRUFBRSxNQUFNLDhDQUFXLE1BQU0sc0JBQXNCO0FBQUEsTUFDL0MsRUFBRSxNQUFNLGtCQUFRLE1BQU0seUJBQXlCO0FBQUEsSUFDakQ7QUFBQSxFQUNGO0FBQUEsRUFDQTtBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLE1BQ1IsRUFBRSxNQUFNLDRCQUFRLE1BQU0sK0JBQStCO0FBQUEsTUFDckQsRUFBRSxNQUFNLHVCQUFhLE1BQU0sMEJBQTBCO0FBQUEsTUFDckQsRUFBRSxNQUFNLG1CQUFTLE1BQU0sc0JBQXNCO0FBQUEsTUFDN0MsRUFBRSxNQUFNLG1CQUFTLE1BQU0sc0JBQXNCO0FBQUEsTUFDN0MsRUFBRSxNQUFNLDhDQUFXLE1BQU0seUJBQXlCO0FBQUEsTUFDbEQsRUFBRSxNQUFNLHVCQUFhLE1BQU0seUJBQXlCO0FBQUEsTUFDcEQsRUFBRSxNQUFNLGtCQUFRLE1BQU0sNEJBQTRCO0FBQUEsSUFDcEQ7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBWUE7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxNQUNSLEVBQUUsTUFBTSw0QkFBUSxNQUFN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S0FBSyxNQUFNLElBQUksQ0FBQztBQUFBLElBQ3BFO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsbUNBQW1DRCxNQUFLO0FBQUEsTUFDdENDO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUVBLGtEQUFrREQsTUFBSztBQUFBLE1BQ3JEQztBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFFQSxnREFBZ0RELE1BQUs7QUFBQSxNQUNuREM7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBRUEsMENBQTBDRCxNQUFLO0FBQUEsTUFDN0NDO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUVBLGtDQUFrQ0QsTUFBSztBQUFBLE1BQ3JDQztBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInNpZGViYXIiLCAicGF0aCIsICJmcyIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJnZXRTdWJEaXJlY3RvcmllcyIsICJmcyIsICJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInNpZGViYXIiLCAiaGFuZGxlU2lkZWJhckl0ZW0iLCAibGlua0V4aXN0cyIsICJwYXRoIiwgImZzIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgImdldFN1YkRpcmVjdG9yaWVzIiwgImZzIiwgInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAic2lkZWJhciIsICJoYW5kbGVTaWRlYmFySXRlbSIsICJsaW5rRXhpc3RzIiwgInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicGF0aCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSJdCn0K
