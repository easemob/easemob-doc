# 环信即时通讯 IM Flutter Demo 

环信即时通讯 IM Flutter Demo 提供用户登录、单聊、群组、子区、消息(文字、表情、语音、视频、图片、文件等)发送及管理、会话管理、好友管理、用户属性、用户在线状态（Presence）以及实时音视频通话等功能。

## 体验 Demo 

1. [下载 Demo](https://www.easemob.com/download/demo)。
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

- Flutter 3.29.0;
- Android SDK API 21 及以上;
- iOS 14 及以上;

### 跑通步骤

1. [创建应用](/product/enable_and_configure_IM.html)。 
2. [获取应用的 App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。
3. [创建用户](/product/enable_and_configure_IM.html#创建-im-用户)。
4. [下载即时通讯 IM Demo 项目源码](https://github.com/easemob/easemob-demo-flutter)。
5. 下载完毕，打开项目。
6. 将你的应用的 App Key 填入 Demo 工程根目录下的 `main.dart` 文件。
7. 编译运行项目。
8. 使用注册的用户 ID 和密码登录。

### App Server

为方便开发者快速体验即时通讯 IM 功能，跑通本工程 Demo 源码默认使用开发者注册的用户 ID 和密码直接登录，不需要依赖部署服务端 App Server。但是在此模式下，手机验证码、用户头像和 EaseCallKit 实时音视频等相关功能不可用，你可以通过部署 App Server 完整体验这些功能。

App Server 为 Demo 提供以下功能：

- 通过手机号获取验证码。
- 通过手机号和验证码返回环信用户 ID 和环信用户 Token。
- 上传头像并返回地址。
- 获取音视频通话时环信用户 ID 和 Agora UID 的映射关系。

你通过以下步骤部署 App Server：

1. 部署 App Server。详见 [服务端源码](https://github.com/easemob/easemob-im-app-server/tree/dev-demo)。
2. 在 Demo 工程根目录下 `main.dart` 文件中，填入 `serverUrl` 的域名或 IP 地址。
3. 在 Demo 工程根目录下 `main.dart` 文件中，填入 `rtcAppId`，即通知 Demo 工程需要启用 App Server，体验完整功能。

**服务端中的 App Key 要跟客户端的 App Key 保持一致。**

## Demo 项目结构

```

├── custom
│   └── chat_route_filter.dart // chat-uikit 自定义拦截类，所有对 chat-uikit 的自定义通过该文件实现。
├── demo_config.dart           // Demo 运行的配置类，包含 appkey， agoraAppId， appServer 
├── demo_localizations.dart    // Demo 国际化类，用于对 Ddemo 中文字国际化
├── main.dart                  // 项目入口，包括了初始化 SDK，设置主题
├── notifications
│   └── app_settings_notification.dart      // 主题变更通知
├── pages
│   ├── call                                // 呼叫相关页面
│   │   ├── call_handler_widget.dart        // 呼叫监听页面，当 Home 页启动时会初始化，用于监听语音会叫回调。
│   │   ├── call_helper.dart                // 呼叫工具类，集成了 1v1 音视频呼叫和多人呼叫的方法。
│   │   ├── call_pages                      // 呼叫相关的 UI 页面
│   │   │   ├── call_button.dart            // 呼叫使用的自定义按钮
│   │   │   ├── call_user_info.dart         // 用于展示呼叫的头像昵称
│   │   │   ├── multi_call_item_view.dart   // 多人呼叫时的单人展示信息
│   │   │   ├── multi_call_page.dart        // 多人呼叫时的总页面
│   │   │   ├── multi_call_view.dart        // 多人呼叫中的 page 页面
│   │   │   └── single_call_page.dart       // 单人呼叫页面
│   │   └── group_member_select_view.dart   // 群成员选择页面，用户多人呼叫时选则参与人
│   ├── contact
│   │   └── contact_page.dart               // 通讯录页面
│   ├── conversation
│   │   └── conversation_page.dart          // 会话列表页面
│   ├── help
│   │   └── download_page.dart              // 附件消息下载页面
│   ├── home_page.dart                      // 主页
│   ├── login_page.dart                     // 登录页面
│   ├── me
│   │   ├── about_page.dart                 // About 页面
│   │   ├── my_page.dart                    // 个人页面
│   │   ├── personal
│   │   │   └── personal_info_page.dart     // 个人详情页
│   │   └── settings
│   │       ├── advanced_page.dart          // 特性开关页面
│   │       ├── general_page.dart           // 设置页面
│   │       ├── language_page.dart          // 语言选择页面
│   │       └── translate_page.dart         // 选择翻译目标语言页面
│   └── welcome_page.dart                   // 启动页
├── tool
│   ├── app_server_helper.dart              // AppServer 请求封装页面，用于封装向 AppServer 的请求
│   ├── format_time_tool.dart               // 时间工具，用于格式化通话时间
│   ├── settings_data_store.dart            // 配置存储工具
│   └── user_data_store.dart                // 用户属性存储类
└── widgets
    ├── list_item.dart                      // 设置页面的item
    ├── toast_handler_widget.dart           // toast 页面，对 UIKit 中事件结果的封装，如添加好友的loading toast 等
    ├── token_status_handler_widget.dart    // token 过期监听页，用于监听 SDK 登录用户 Token 过期。
    └── user_provider_handler_widget.dart   // 用户数据配置类，用于把用户信息传给 UIKit 和根据 UIKit 的请求返回对应用户数据
```