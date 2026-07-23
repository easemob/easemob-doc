# 环信即时通讯 IM React Native Demo

环信即时通讯 IM React Native Demo 提供用户登录、单聊、群组、消息话题、消息(文字、表情、语音、视频、图片、文件等)发送及管理、会话管理、好友管理、用户属性、用户在线状态（Presence）以及实时音视频通话等功能。

## 体验 Demo

1. [下载 React Native iOS Demo](https://www.easemob.com/download/demo) 或 [React Native Android Demo](https://www.easemob.com/download/demo)。
2. 输入你的手机号，获取验证码，然后输入。
3. 选择同意《环信服务条款》与《环信隐私协议》，然后点击 **登录** 登录 Demo。

![img](/images/demo/android_login.png =350x750)

下面为部分 UI 界面的展示：

<ImageGallery :columns="2">
  <ImageItem src="/images/uikit/chatuikit/android/main_chat.png" title="单聊页面" />
  <ImageItem src="/images/uikit/chatuikit/android/main_chat_group.png" title="群聊页面" />
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="会话列表" />
  <ImageItem src="/images/uikit/chatuikit/android/main_contact_list.png" title="通讯录" />
</ImageGallery>

## 快速跑通 Demo 源码

### 开发环境要求

- MacOS 12 或以上版本
- React-Native 0.71 或以上版本
- NodeJs 20.18 或以上版本
- iOS 平台：xcode 15 或以上版本
- Android 平台：Android Studio 2022.3 或以上版本
- Yarn 包管理工具

### 跑通步骤

1. [创建应用](/product/console/app_create.html)。
2. [获取应用的 App Key](/product/console/app_manage.html#管理应用)。
3. [创建用户](/product/console/operation_user.html#创建用户)。
4. 从 [GitHub](https://github.com/easemob/easemob-uikit-reactnative) 或 [Gitee](https://gitee.com/easemob-code/react-native-chat-library) 中下载即时通讯 IM Demo 项目源码。
5. 进入工程根目录，执行 `yarn && yarn prepare` 安装依赖和创建本地配置文件。
6. 更改配置文件(`examples/product-uikit-demo/src/env.ts`)内容, 设置 appKey 的值，其他字段有默认值。
7. 设置推送配置文件。如果没有，可以使用模板文件保证编译运行没有问题。如果有，则使用自己的配置文件。详见 [Firebase 相关文档](https://rnfirebase.io/)。
   - Android 平台拷贝命令为 `cp -f templates/google-services.json.template examples/product-uikit-demo/android/app/google-services.json && cp -f templates/debug.keystore.template examples/product-uikit-demo/android/app/debug.keystore`。
   - iOS 平台拷贝命令为 `cp templates/GoogleService-Info.plist.template examples/product-uikit-demo/ios/productuikitdemo/GoogleService-Info.plist`。
8. 进入目录 `examples/product-uikit-demo`， 运行 `yarn android` 或 `yarn ios` 运行 Demo。
9. 启动本地服务 `yarn run start`，默认端口 8081。
10. 在登录页面连续点击 5 次以上版本号，将切换为用户 ID 和密码登录页面（再次连续点击返回手机号和验证码登录页面）。
11. 使用注册的用户 ID 和密码登录。

### App Server

为方便开发者快速体验即时通讯 IM 功能，跑通本工程 Demo 源码默认使用开发者注册的用户 ID 和密码直接登录，不需要依赖部署服务端 App Server。但是在此模式下，手机验证码、用户头像和 EaseCallKit 实时音视频等相关功能不可用，你可以通过部署 App Server 完整体验这些功能。

App Server 为 Demo 提供以下功能：

- 通过手机号获取验证码。
- 通过手机号和验证码返回环信用户 ID 和环信用户 Token。
- 上传头像并返回地址。
- 获取音视频通话时环信用户 ID 和 Agora UID 的映射关系。

你可通过以下步骤部署 App Server：

1. 部署 App Server。关于服务器源码，详见 [GitHub](https://github.com/easemob/easemob-demo-appserver/tree/dev-demo) 或 [Gitee](https://gitee.com/easemob-code/easemob-demo-appserver/tree/dev-demo)。
2. 修改 文件 `examples/product-uikit-demo/src/env.ts` 中的内容 `useAppServerDomain = true` 。

**服务端中的 App Key 要跟客户端的 App Key 保持一致。**

## Demo 项目结构

### Demo 架构

```
├── App.tsx  // 入口文件
├── demo
│   ├── App.tsx // 应用程序文件
│   ├── assets  // 资源文件
│   ├── common  // 常见文件
│   ├── hooks   // hooks 方法
│   ├── routes  // 路由配置文件
│   ├── screens // 页面文件
│   ├── ui      // 自定义 Demo 文件
│   └── utils   // 工具类文件
├── env.ts      // App Key 等配置文件
├── rename.callkit.ts // CallKit 库配置文件（依赖 App Server）
└── rename.uikit.ts   // UIKit 库配置文件
```

### 主要模块介绍

| 模块         | 描述                                                                          |
| :----------- | :---------------------------------------------------------------------------- |
| 聊天模块     | 展示如何依赖 UIKit 实现聊天列表，如何扩展消息类型及如何增加扩展菜单等的逻辑。 |
| 会话列表模块 | 展示如何依赖 UIKit 实现会话列表的逻辑及实现系统消息的具体逻辑。               |
| 好友模块   | 展示如何依赖 UIKit 实现好友列表的逻辑。                                     |
| 聊天设置模块 | 展示 IM SDK 提供的对于群聊对成员及群组属性的操作。                            |
| 设置模块     | 展示 IM SDK 对于新消息的设置及消息免打扰，群组等通用设置。                    |

## 常见问题

详见 [常见问题](faq.html)。