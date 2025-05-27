# 快速开始

<Toc />

利用环信单群聊 UIKit，你可以轻松实现单群和群聊。本文介绍如何快速实现在单聊和群聊会话中发送消息。

## 前提条件

开始前，请确保你的开发环境满足以下条件：

- HBuilderX 最新版
- Vue3
- sass：sass-loader 10.1.1 及之前版本
- node：12.13.0 - 17.0.0，推荐 LTS 版本 16.17.0
- npm：版本需与 Node.js 版本匹配

## 项目集成

本节介绍将单群聊 UIKit 引入项目中的必要环境配置。

1. 创建 uni-app Vue3 项目，详情参考 [uni-app 项目创建](https://uniapp.dcloud.net.cn/quickstart-hx.html)。

2. 下载 UIKit 源码。

:::tip
UIKit 中依赖的静态资源（`ChatUIKit/assets`）放置在环信服务器中，存在访问频率限制，建议你将静态资源放置在你的业务服务器上，然后修改 `ChatUIKit/const/index.ts` 文件中的 `ASSETS_URL` 为你的资源服务器地址。
:::

 ```bash
   # 克隆 UIKit
   git clone https://github.com/easemob/easemob-uikit-uniapp.git
   # 在你的 uni-app 项目根目录下执行以下命令，拷贝组件文件
   mkdir -p ./ChatUIKit
   # macOS
   mv ${组件项目路径}/ChatUIKit/* ./ChatUIKit
   # windows
   move ${组件项目路径}/ChatUIKit/* .\ChatUIKit

 ```

3. 添加依赖。

:::tip
环信即时通讯 IM Web SDK 4.10.0 及以上。
:::

在项目根目录下执行以下命令，添加依赖：

```bash
npm init -y
npm i easemob-websdk@4.11.0 pinyin-pro@3.26.0 mobx@6.13.4 --save
```
  
## 实现发送第一条单聊消息

本节介绍如何通过单群聊 UIKit 实现发送第一条单聊消息。

### 第一步 创建快速开始页面 

1. 打开 `pages/index/index.vue` 文件，并替换为如下内容：

```jsx
<template>
  <view class="index">
    <view class="login-form">
      <input
        class="input-field"
        type="text"
        v-model="userId"
        placeholder="请输入用户ID"
      />
      <input
        class="input-field"
        type="password"
        v-model="password"
        placeholder="请输入密码"
      />
      <view class="login-button" @click="handleLogin">登录</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const userId = ref("");
const password = ref("");

const id = ""; // 用户 ID 或者群组 ID
const type = ""; // 会话类型：单聊 singleChat，群聊为 groupChat 

const handleLogin = () => {
  if (!userId.value || !password.value) {
    uni.showToast({
      title: "请输入用户ID和密码",
      icon: "none"
    });
    return;
  }
  // 登录
  uni.$UIKit.chatStore
    .login({
      user: userId.value,
      pwd: password.value
    })
    .then(() => {
      // 登录成功跳转聊天页面
      uni.navigateTo({
        url: `/ChatUIKit/modules/Chat/index?id=${id}&type=${type}`
      });
    })
    .catch((error) => {
      console.error("登录失败", error);
    });
};
// 退出登录
const logout = () => {
    uni.$UIKit.chatStore.logout();
};
</script>
<style lang="scss" scoped>
.index {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;

  .login-form {
    width: 80%;
    max-width: 300px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .input-field {
      width: 100%;
      height: 40px;
      margin-bottom: 15px;
      padding: 0 15px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;

      &:focus {
        border-color: #006eff;
      }
    }

    .login-button {
      width: 100%;
      padding: 12px 0;
      color: #fff;
      background-color: #006eff;
      font-size: 16px;
      border-radius: 4px;
      text-align: center;

      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style>

```

2. 打开 `app.vue` 文件，并替换为如下内容。

要查看服务器域名配置，请点击[这里](https://doc.easemob.com/document/applet/wechat.html#配置服务器域名) 。

```jsx
<script lang="ts">
import { ChatUIKit } from "./ChatUIKit";
import websdk from "easemob-websdk/uniApp/Easemob-chat";
import { EasemobChatStatic } from "easemob-websdk/Easemob-chat";

// 创建 IM 实例
const chat = new (websdk as unknown as EasemobChatStatic).connection({
  appKey: '', // 应用的 App Key
  isHttpDNS: false,
  url: '', // 环信 websocket URL
  apiUrl: '', // 环信 Restful API URL
  delivery: true // 是否开启消息已送达回执
});


// 初始化 ChatUIKit
ChatUIKit.init({
  chat, // 传入 IM 实例
  config: {
    theme: {
			// 头像形状：圆形（circle）和方形（square）
      avatarShape: "square"
    },
    isDebug: true // 是否开启调试模式
  }
});

uni.$UIKit = ChatUIKit;

export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
    // 在 onShow 中调用 ChatUIKit.onShow() 方法，主动监测 IM 连接状态
    ChatUIKit.onShow();
  },
  onHide: function () {
    console.log("App Hide");
  }
};
</script>
<style>
/* 通用样式 */
html,body,page {
  height: 100%;
  width: 100%;
}
</style>
```

3. 配置路由。

在你项目的 `pages.json` 文件中的更新 `pages` 路由：

```json
{
  "pages": [
        {
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app"
			}
		},
		{
			"path": "ChatUIKit/modules/Chat/index",
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
			"path": "ChatUIKit/modules/VideoPreview/index",
			"style": {
				"navigationBarTitleText": "Video Preview",
				"app-plus": {
					"bounce": "none"
				}
			}
		},
  ]
}
```

### 第二步 运行项目

在 uni-app IDE 中，运行 项目：

![image](/images/uikit/chatuikit/uniapp/uniapp_run.png)

### 第三步 发送第一条消息

在聊天页面下方输入消息，然后点击**发送**按钮发送消息。

![img](/images/uikit/chatuikit/android/message_first.png =300x650) 
