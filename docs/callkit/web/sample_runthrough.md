# 跑通 Web 示例项目

本文档基于 `call-demo.tsx` 示例，帮助你快速集成和运行环信 Web CallKit，实现一对一音视频通话和群组音视频通话功能。

## 推荐环境

- Node.js: 16.0 及以上
- npm/yarn: 推荐最新版本
- React: 18.0 及以上
- TypeScript: 4.9 及以上
- 现代浏览器: Chrome/Firefox/Safari/Edge 最新版本

## 前提条件

在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：

1. [注册环信账号](/product/console/account_register.html#注册账号)。
2. [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
3. [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID。
4. [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID，将用户加入群组。
5. [开通音视频服务](product_activation.html)。

## 操作步骤

### 步骤 1 配置项目

1. 克隆或下载项目。

```bash
git clone https://github.com/easemob/easemob-uikit-react.git
cd easemob-uikit-react
```

2. 安装依赖。

```bash
npm install
# 或
yarn install
```

3. 启动开发服务器。

```bash
npm run dev
# 或
yarn dev
```

### 步骤 2 运行项目

打开浏览器访问 `http://localhost:5173/demo/callkit/call-demo.html`，确认项目正常运行。

### 步骤 3 开始通话

1. 登录：填写 App Key、用户 ID 和密码，点击 **登录**，等待登录成功提示。
   
   <img src="/images/callkit/web/project_runthrough1.png" >

2. 完成配置：输入被叫用户 ID（一对一通话）或群组 ID（群组通话），点击 **完成配置**。
   
   <img src="/images/callkit/web/project_runthrough2.png" >

3. （可选）选择通话背景：点击 **选择背景** 在背景选择面板中选择喜欢的通话背景图片。
   
   <img src="/images/callkit/web/project_runthrough3.png" >

4. 发起通话：
 
   - 点击 **发起视频通话** 或 **发起语音通话** 发起一对一通话。 
   - 点击 **发起群组视频通话**，选择要邀请的成员，发起群组视频通话。
  
  <img src="/images/callkit/web/project_runthrough4.png" >

5. 授权权限：在浏览器弹出的权限请求中，允许访问摄像头和麦克风。
6. 通话控制：在通话中可以控制静音、摄像头、扬声器等，点击 **结束通话** 挂断。
