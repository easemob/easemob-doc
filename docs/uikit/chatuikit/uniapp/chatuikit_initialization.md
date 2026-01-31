# 初始化

<Toc />

在使用 UIKit 前，需要完成初始化工作。本文介绍如何在 `App.vue` 中初始化 UIKit 并进行路由配置。

## 初始化 UIKit

在 `App.vue` 中初始化 UIKit：

```vue
<script lang="ts">
import { ChatUIKit } from "./ChatUIKit";
import websdk from "easemob-websdk/uniApp/Easemob-chat";
import { EasemobChatStatic } from "easemob-websdk/Easemob-chat";

// 创建 IM SDK 实例
const chat = new (websdk as unknown as EasemobChatStatic).connection({
  appKey: '', // 应用的 App Key
  isHttpDNS: false,
  url: '', // 环信 WebSocket URL
  apiUrl: '', // 环信 RESTful API URL
  delivery: true // 是否开启消息送达回执
});

// 初始化 ChatUIKit
ChatUIKit.init({
  chat, // 传入 IM SDK 实例
  config: {
    theme: {
      // 头像形状：圆形（circle）或方形（square）
      avatarShape: "square"
    },
    isDebug: true // 是否开启调试模式，开发阶段建议开启
  }
});

// 将 ChatUIKit 挂载到全局，便于其他页面调用
uni.$UIKit = ChatUIKit;

export default {
  onShow: function () {
    // 在 onShow 中调用 ChatUIKit.onShow()，主动监测 IM 连接状态
    ChatUIKit.onShow();
  }
};
</script>
```

## 登录

初始化完成后，调用登录方法完成用户认证。可在登录页面或 `App.vue` 的 `onLaunch` 中调用：

```javascript
// 登录
uni.$UIKit.chatStore
  .login({
    user: 'userId', // 用户 ID
    accessToken: '' // 用户 Token
  })
  .then(() => {
    // 登录成功后的处理逻辑
    // 示例：跳转到会话列表页面
    uni.navigateTo({
      url: '/ChatUIKit/modules/Conversation/index'
    });
  })
  .catch((error) => {
    console.error("登录失败", error);
  });
```

## 配置路由

在使用 UIKit 提供的页面功能前，需在项目的 `pages.json` 文件中配置相应的页面路由。以下是 UIKit 所有内置页面的路由配置：

```json
{
  "pages": [
    {
      "path": "ChatUIKit/modules/Conversation/index", // 会话列表页面
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "bounce": "none"
        }
      }
    },
    {
      "path": "ChatUIKit/modules/Chat/index", // 聊天页面
      "style": {
        "navigationStyle": "custom",
        // #ifdef MP-WEIXIN
        "disableScroll": true,
        // #endif 
        "app-plus": {
          "bounce": "none",
          "softinputNavBar": "none"
        }
      }
    },
    {
      "path": "ChatUIKit/modules/ChatNew/index", // 发起新会话页面
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "bounce": "none"
        }
      }
    },
    {
      "path": "ChatUIKit/modules/GroupList/index", // 群组列表页面
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "bounce": "none"
        }
      }
    },
    {
      "path": "ChatUIKit/modules/ConversationSearchList/index", // 搜索会话页面
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "bounce": "none"
        }
      }
    },
    {
      "path": "ChatUIKit/modules/VideoPreview/index", // 预览视频消息页面
      "style": {
        "navigationBarTitleText": "Video Preview",
        "app-plus": {
          "bounce": "none"
        }
      }
    },
    {
      "path": "ChatUIKit/modules/ContactList/index", // 好友列表页面
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "bounce": "none"
        }
      }
    },
    {
      "path": "ChatUIKit/modules/ContactAdd/index", // 添加好友页面
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "bounce": "none"
        }
      }
    },
    {
      "path": "ChatUIKit/modules/ContactRequestList/index", // 好友请求列表页面
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "bounce": "none"
        }
      }
    },
    {
      "path": "ChatUIKit/modules/ContactSearchList/index", // 搜索好友页面
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "bounce": "none"
        }
      }
    },
    {
      "path": "ChatUIKit/modules/GroupCreate/index", // 创建群组页面
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "bounce": "none"
        }
      }
    }
  ]
}
```

## 参考文档

可访问以下地址查看 UIKit 源码：

- [GitHub](https://github.com/easemob/easemob-uikit-uniapp)
- [Gitee](https://gitee.com/easemob-code/easemob-uikit-uniapp)