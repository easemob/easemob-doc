# 环信即时通讯 IM React Demo

<Toc />

环信即时通讯 IM React Demo 提供用户登录、单聊、群组、聊天室、子区、消息(文字、表情、语音、视频、图片、文件等)发送及管理、会话管理、好友管理、用户属性、用户在线状态（Presence）以及实时音视频通话等功能。

## 体验 Demo 

1. [登录 Demo](https://webim-h5.easemob.com/login)。
2. 输入你的手机号，获取验证码，然后输入。
3. 选择同意《环信服务条款》与《环信隐私协议》，然后点击 **登录** 登录 Demo。
   
![img](/images/demo/web_react_login.png)

下面为部分 UI 界面的展示：

<ImageGallery :columns="1">
  <ImageItem src="/images/uikit/chatuikit/web/main_conversation_list_chat.png" title="会话列表+聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/web/main_conversation_list_group_detail.png" title="会话列表+群组设置" />
  <ImageItem src="/images/uikit/chatuikit/web/main_conversation_list_contact_detail.png" title="会话列表+联系人设置" />
  <ImageItem src="/images/uikit/chatuikit/web/main_contact_list_group.png" title="联系人列表+群组" />
  <ImageItem src="/images/uikit/chatuikit/web/main_contact_list_contact.png" title="联系人列表+联系人" />
</ImageGallery>  

## 快速跑通 Demo 源码

### 跑通步骤

1. [创建应用](/product/enable_and_configure_IM.html)。 
2. [获取应用的 App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。
3. [创建用户](/product/enable_and_configure_IM.html#创建-im-用户)。
4. [下载即时通讯 IM Demo 项目源码](https://github.com/easemob/easemob-demo-react/tree/dev_4.0)。
5. 下载完毕，在项目根目录打开终端，安装依赖。
   
```
npm install
```

6. 启动项目。
  
```
npm start
```

7. 在登录页面打开 **使用自定义配置** 开关，填入自己的 App Key，然后点击 **保存** 按钮。
8. 使用注册的用户 ID 和密码登录。

### App Server

为方便开发者快速体验即时通讯 IM 功能，跑通本工程 Demo 源码默认使用开发者注册的用户 ID 和密码直接登录，不需要依赖部署服务端 App Server。但是在此模式下，手机验证码、用户头像和实时音视频等相关功能不可用，你可以通过部署 App Server 完整体验这些功能。

App Server 为 Demo 提供以下功能：

- 通过手机号获取验证码。
- 通过手机号和验证码返回环信用户 ID 和环信用户 Token。
- 上传头像并返回地址。
- 根据用户的信息生成 [CallKit](https://doc.easemob.com/document/web/easecallkit.html) 登录所需的 Token。
- 获取音视频通话时环信用户 ID 和 Agora UID 的映射关系。

你通过以下步骤部署 App Server：

1. 部署 App Server。详见 [服务端源码](https://github.com/easemob/easemob-im-app-server/tree/dev-demo)。  
2. 在 Demo 工程根目录下，将 src/service 里面用到的服务替换成你自己的服务，然后把 src/config 里面的 appKey 和 appId 替换成和 appServer 里一样的。

**服务端中的 App Key 要跟客户端的 App Key 保持一致。**

## 主要模块介绍

Demo 中的主要模块如下：

| 模块名称     | 描述                                     |
| :----------- | :--------------------------------------- |
| `components` | 项目中定义的组件。                       |
| `config`     | SDK 初始化配置。                         |
| `containers` | 容器组件，包含联系人、聊天、登录和注册。 |
| `layout`     | 聊天部分的布局。                         |
| `selectors`  | 缓存数据，优化性能。                     |
| `utils`      | 数据库和工具方法。                       |
